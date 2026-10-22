#!/usr/bin/env bash
# Mirrors a public website into ./mirror for migration purposes.
# Captures: WordPress REST API dumps (if available), sitemaps, robots.txt,
# response headers, a wget page mirror (HTML/CSS/JS/images), and the full
# media library (size-capped).
set -uo pipefail

SITE="${1:?site origin required, e.g. https://example.com}"
SITE="${SITE%/}"
HOST="$(printf '%s' "$SITE" | sed -E 's#^https?://##; s#/.*$##')"
BARE_HOST="${HOST#www.}"
OUT="mirror"
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36 site-migration-bot"
MEDIA_FILE_CAP=$((12 * 1024 * 1024))     # skip single files larger than 12 MB
MEDIA_TOTAL_CAP=$((450 * 1024 * 1024))   # stop media download after 450 MB
WGET_QUOTA="400m"

mkdir -p "$OUT/api" "$OUT/raw" "$OUT/media" "$OUT/meta"
echo "$SITE" > "$OUT/meta/site.txt"

log() { printf '\n==> %s\n' "$*"; }

fetch() { # fetch URL to file, print status code
  local url="$1" dest="$2"
  curl -sSL -A "$UA" --max-time 60 -o "$dest" -w '%{http_code}' "$url" 2>/dev/null || echo "000"
}

log "Response headers for homepage"
curl -sSIL -A "$UA" --max-time 60 "$SITE/" > "$OUT/meta/headers.txt" 2>&1 || true
for p in /en/ /nl/; do
  curl -sSIL -A "$UA" --max-time 60 "$SITE$p" > "$OUT/meta/headers$(echo "$p" | tr '/' '_').txt" 2>&1 || true
done

log "robots.txt and sitemaps"
fetch "$SITE/robots.txt" "$OUT/meta/robots.txt" >/dev/null
for s in sitemap.xml sitemap_index.xml wp-sitemap.xml sitemap-index.xml post-sitemap.xml page-sitemap.xml; do
  code=$(fetch "$SITE/$s" "$OUT/meta/$s")
  echo "$s -> $code"
  [ "$code" = "200" ] || rm -f "$OUT/meta/$s"
done
# Follow sitemap index children
for idx in "$OUT"/meta/*.xml; do
  [ -f "$idx" ] || continue
  grep -oE '<loc>[^<]+</loc>' "$idx" | sed -E 's#</?loc>##g' | grep -E '\.xml(\?.*)?$' | while read -r child; do
    name="$(basename "${child%%\?*}")"
    [ -f "$OUT/meta/child-$name" ] && continue
    code=$(fetch "$child" "$OUT/meta/child-$name"); echo "child $child -> $code"
    [ "$code" = "200" ] || rm -f "$OUT/meta/child-$name"
  done
done
cat "$OUT"/meta/*.xml 2>/dev/null | grep -oE '<loc>[^<]+</loc>' | sed -E 's#</?loc>##g' | grep -vE '\.xml(\?.*)?$' | sort -u > "$OUT/meta/sitemap-urls.txt" || true
echo "sitemap urls: $(wc -l < "$OUT/meta/sitemap-urls.txt")"

log "WordPress REST API discovery"
root_code=$(fetch "$SITE/wp-json/" "$OUT/api/root.json")
echo "wp-json root -> $root_code"
IS_WP=0
if [ "$root_code" = "200" ] && jq -e '.namespaces' "$OUT/api/root.json" >/dev/null 2>&1; then
  IS_WP=1
  jq -r '.name, .description, .url, .home, (.namespaces|join(","))' "$OUT/api/root.json" || true
else
  rm -f "$OUT/api/root.json"
fi

if [ "$IS_WP" = "1" ]; then
  log "Dumping REST collections"
  dump_collection() { # type, extra query
    local t="$1" q="$2" tag="$3" page=1
    while :; do
      f="$OUT/api/${t}${tag}-p${page}.json"
      code=$(fetch "$SITE/wp-json/wp/v2/${t}?per_page=100&page=${page}&_embed=1${q}" "$f")
      if [ "$code" != "200" ] || ! jq -e 'type=="array"' "$f" >/dev/null 2>&1; then rm -f "$f"; break; fi
      n=$(jq 'length' "$f"); echo "  $t$tag page $page: $n items"
      [ "$n" -ge 100 ] || break
      page=$((page+1))
      [ "$page" -le 40 ] || break
    done
  }
  for t in posts pages media categories tags users menus menu-items block-types; do
    dump_collection "$t" "" ""
  done
  # Polylang / WPML style language filters (ignored by sites that don't use them)
  for lang in en nl fr; do
    for t in posts pages; do dump_collection "$t" "&lang=$lang" "-$lang"; done
  done
  for t in types taxonomies statuses settings; do
    fetch "$SITE/wp-json/wp/v2/$t" "$OUT/api/$t.json" >/dev/null || true
  done
  # Custom post types (courses, products, testimonials, events, etc.)
  if [ -f "$OUT/api/types.json" ]; then
    jq -r 'to_entries[] | select(.value.rest_base != null) | .value.rest_base' "$OUT/api/types.json" 2>/dev/null | sort -u | while read -r rb; do
      case "$rb" in posts|pages|media|blocks|templates|template-parts|navigation|menu-items|wp_font_family|wp_font_face|global-styles|font-families|font-faces|navigation-areas) continue;; esac
      dump_collection "$rb" "" ""
    done
  fi
  # Other namespaces that often hold content (WooCommerce store, Yoast meta, Elementor)
  fetch "$SITE/wp-json/wc/store/v1/products?per_page=100" "$OUT/api/wc-store-products.json" >/dev/null || true
  jq -e 'type=="array"' "$OUT/api/wc-store-products.json" >/dev/null 2>&1 || rm -f "$OUT/api/wc-store-products.json"
fi

log "Collect candidate page URLs"
{
  cat "$OUT/meta/sitemap-urls.txt" 2>/dev/null
  for f in "$OUT"/api/posts*.json "$OUT"/api/pages*.json; do [ -f "$f" ] && jq -r '.[].link' "$f"; done
  echo "$SITE/"; echo "$SITE/en/"; echo "$SITE/nl/"; echo "$SITE/fr/"
} 2>/dev/null | grep -E "^https?://(www\.)?${BARE_HOST//./\\.}" | sed -E 's#/+$#/#' | sort -u > "$OUT/meta/urls.txt"
echo "candidate urls: $(wc -l < "$OUT/meta/urls.txt")"

log "wget mirror (quota $WGET_QUOTA)"
wget \
  --recursive --level=8 --page-requisites --adjust-extension --convert-links --backup-converted \
  --no-parent --span-hosts --timestamping \
  --domains="${BARE_HOST},www.${BARE_HOST},i0.wp.com,i1.wp.com,i2.wp.com,i3.wp.com,s0.wp.com,s1.wp.com,s2.wp.com,fonts.googleapis.com,fonts.gstatic.com,use.typekit.net,p.typekit.net" \
  --execute robots=off --wait=0.2 --random-wait --tries=2 --timeout=45 --quota="$WGET_QUOTA" \
  --reject-regex='(\?replytocom=|/feed/?$|/wp-login|/wp-admin|xmlrpc\.php|\?share=|\?print=|/comments/feed|\?s=|/wp-json/|\?p=[0-9]+$|/embed/?$|\?amp|/amp/?$)' \
  --user-agent="$UA" --no-verbose --directory-prefix="$OUT/raw" \
  --input-file="$OUT/meta/urls.txt" "$SITE/" 2> "$OUT/meta/wget.log" || echo "wget exited $? (continuing)"
echo "wget files: $(find "$OUT/raw" -type f | wc -l)"

if [ "$IS_WP" = "1" ]; then
  log "Downloading full media library from REST (file cap $MEDIA_FILE_CAP B, total cap $MEDIA_TOTAL_CAP B)"
  total=0; skipped=0; got=0
  : > "$OUT/meta/media-skipped.txt"
  for f in "$OUT"/api/media-p*.json; do
    [ -f "$f" ] || continue
    jq -r '.[] | [.id, .source_url, (.media_details.filesize // 0), .mime_type] | @tsv' "$f" | while IFS=$'\t' read -r id url size mime; do
      [ -n "$url" ] || continue
      rel="$(printf '%s' "$url" | sed -E 's#^https?://[^/]+/##')"
      dest="$OUT/media/$rel"
      mkdir -p "$(dirname "$dest")"
      if [ -f "$dest" ]; then continue; fi
      if [ "$size" -gt "$MEDIA_FILE_CAP" ] 2>/dev/null; then echo "$url (size $size)" >> "$OUT/meta/media-skipped.txt"; continue; fi
      code=$(curl -sSL -A "$UA" --max-time 120 --max-filesize "$MEDIA_FILE_CAP" -o "$dest" -w '%{http_code}' "$url" 2>/dev/null || echo 000)
      if [ "$code" != "200" ]; then rm -f "$dest"; echo "$url (http $code)" >> "$OUT/meta/media-skipped.txt"; continue; fi
      cur=$(du -sb "$OUT/media" | cut -f1)
      if [ "$cur" -gt "$MEDIA_TOTAL_CAP" ]; then echo "TOTAL CAP REACHED at $url" >> "$OUT/meta/media-skipped.txt"; break; fi
    done
  done
  echo "media files: $(find "$OUT/media" -type f | wc -l), skipped: $(wc -l < "$OUT/meta/media-skipped.txt")"
fi

log "Done. Mirror size: $(du -sh "$OUT" | cut -f1)"
