#!/usr/bin/env bash
# Paced downloader for mirror/meta/fetch-list.txt (one URL per line).
# Saves into mirror/media/<path>, retries on HTTP 429/5xx with backoff, and
# downscales very large images with scripts/mirror/shrink.mjs afterwards.
set -uo pipefail
LIST="${1:-mirror/meta/fetch-list.txt}"
OUT="mirror/media"
DELAY="${FETCH_DELAY:-1.2}"
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36 site-migration-bot"
[ -f "$LIST" ] || { echo "no list at $LIST"; exit 0; }
mkdir -p "$OUT" mirror/meta
: > mirror/meta/fetch-failed.txt
n=0; ok=0; fail=0
while read -r url; do
  [ -n "$url" ] || continue
  n=$((n+1))
  rel="$(printf '%s' "$url" | sed -E 's#^https?://[^/]+/##; s#\?.*$##')"
  dest="$OUT/$rel"
  if [ -f "$dest" ]; then ok=$((ok+1)); continue; fi
  mkdir -p "$(dirname "$dest")"
  code=000
  for attempt in 1 2 3 4; do
    code=$(curl -sSL -A "$UA" --max-time 120 --max-filesize 25000000 -o "$dest" -w '%{http_code}' "$url" 2>/dev/null || echo 000)
    case "$code" in
      200) break;;
      429|503|502|500) rm -f "$dest"; echo "  $code on $url (attempt $attempt), backing off"; sleep $((30*attempt));;
      *) rm -f "$dest"; break;;
    esac
  done
  if [ "$code" = "200" ]; then ok=$((ok+1)); else fail=$((fail+1)); echo "$url (http $code)" >> mirror/meta/fetch-failed.txt; fi
  [ $((n % 25)) -eq 0 ] && echo "progress: $n processed, $ok ok, $fail failed"
  sleep "$DELAY"
done < "$LIST"
echo "fetch-list done: $n processed, $ok ok, $fail failed"
