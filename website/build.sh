#!/bin/sh
# Build www.kratu.ng: src/ (the page as designed) -> dist/ (what Firebase serves).
# Old assets (pitch deck PDF, icons, earlier pictures) come from ../site/assets so old links keep working.
set -e
cd "$(dirname "$0")"
rm -rf dist
python3 prod.py src dist
cp -n ../site/assets/* dist/assets/ 2>/dev/null || true
echo "built dist/  ->  firebase deploy --only hosting:kratu-site --project kratu-app"
