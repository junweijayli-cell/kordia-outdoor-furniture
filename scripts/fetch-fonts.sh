#!/usr/bin/env bash
# Re-download the two self-hosted webfonts into assets/fonts/.
#
# Both faces are self-hosted rather than loaded from a CDN: Google Fonts is not
# reachable from mainland China and this site ships a full Chinese version, so a
# blocked stylesheet would leave Latin text in a fallback face.
#
#   Urbanist  SIL Open Font License 1.1        (Google Fonts)
#   Stardom   ITF Free Font License            (Fontshare / Indian Type Foundry)
#
# Urbanist is the VARIABLE file (wght 100..900). Google only serves the variable
# woff2 to a modern browser UA — with curl's default UA you get a static 400 cut,
# which silently turns every 600-weight heading into a faux bold. Hence the -A.
set -euo pipefail
cd "$(dirname "$0")/.."
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
OUT=assets/fonts
mkdir -p "$OUT"

echo "Urbanist (variable, wght 100..900)"
CSS=$(curl -sS -A "$UA" "https://fonts.googleapis.com/css2?family=Urbanist:wght@100..900&display=swap")
grep -q "font-weight: 100 900" <<<"$CSS" || { echo "ERROR: Google returned static cuts, not the variable font" >&2; exit 1; }
curl -sS -o "$OUT/urbanist-latin-ext.woff2" "$(grep -A6 '/\* latin-ext \*/' <<<"$CSS" | grep -o 'https://[^)]*\.woff2')"
curl -sS -o "$OUT/urbanist-latin.woff2"     "$(grep -A6 '/\* latin \*/'     <<<"$CSS" | grep -o 'https://[^)]*\.woff2')"

echo "Stardom (400, single cut)"
SCSS=$(curl -sS "https://api.fontshare.com/v2/css?f%5B%5D=stardom@400")
curl -sS -o "$OUT/stardom-400.woff2" "https:$(grep -o "//cdn\.fontshare\.com/[^']*\.woff2" <<<"$SCSS" | head -1)"

ls -l "$OUT"
