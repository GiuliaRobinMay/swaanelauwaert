#!/usr/bin/env bash
# Writes mirror/INDEX.md with an inventory of what was captured.
set -uo pipefail
OUT=mirror
{
  echo "# Mirror inventory"
  echo
  echo "Source: $(cat $OUT/meta/site.txt 2>/dev/null)"
  echo
  echo "## Sizes"
  du -sh "$OUT"/* 2>/dev/null | sed 's/^/- /'
  echo
  echo "## Counts"
  echo "- raw files: $(find $OUT/raw -type f 2>/dev/null | wc -l)"
  echo "- html pages: $(find $OUT/raw -type f -name '*.html' 2>/dev/null | wc -l)"
  echo "- media files: $(find $OUT/media -type f 2>/dev/null | wc -l)"
  echo "- screenshots: $(find $OUT/screenshots -type f 2>/dev/null | wc -l)"
  echo "- api dumps: $(ls $OUT/api 2>/dev/null | wc -l)"
  echo
  echo "## Candidate URLs"
  sed 's/^/- /' "$OUT/meta/urls.txt" 2>/dev/null
  echo
  echo "## Media skipped"
  sed 's/^/- /' "$OUT/meta/media-skipped.txt" 2>/dev/null
} > "$OUT/INDEX.md"
cat "$OUT/INDEX.md" | head -80
