#!/usr/bin/env bash
# Dumps the remaining REST collections the first crawl skipped (comments,
# menus, navigation) with pacing, into mirror/api.
set -uo pipefail
SITE="${1:-https://swaanelauwaert.com}"; SITE="${SITE%/}"
OUT=mirror/api; mkdir -p "$OUT"
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36 site-migration-bot"
dump() { local t="$1" q="$2" page=1
  while :; do f="$OUT/${t}-p${page}.json"
    code=$(curl -sSL -A "$UA" --max-time 60 -o "$f" -w '%{http_code}' "$SITE/wp-json/wp/v2/${t}?per_page=100&page=${page}${q}" 2>/dev/null || echo 000)
    if [ "$code" = "429" ]; then echo "  429 on $t page $page, waiting"; rm -f "$f"; sleep 40; continue; fi
    if [ "$code" != "200" ] || ! jq -e 'type=="array"' "$f" >/dev/null 2>&1; then echo "  $t page $page -> $code (stop)"; rm -f "$f"; break; fi
    n=$(jq length "$f"); echo "  $t page $page: $n"; [ "$n" -ge 100 ] || break; page=$((page+1)); [ "$page" -le 60 ] || break; sleep 2
  done; }
dump comments "&orderby=date&order=asc"
dump navigation ""
dump menus ""
dump menu-items ""
dump feedback ""
echo "rest-extra done"
