# www.kratu.ng (2026 redesign)

    ./build.sh                                                   # src/ -> dist/
    firebase deploy --only hosting:kratu-site --project kratu-app

* `src/index.html` is the page exactly as designed (the claude.ai sample, with its review bar).
  `prod.py` removes the review bar and writes the real head, manifest, robots.txt and sitemap.
* `src/a/` holds every picture, sound, game loop and the self-hosted fonts (Baloo 2, Nunito; SIL OFL).
* Old assets (Kratu-Deck.pdf, icons) are copied from `../site/assets`, so existing links keep working.
* The previous site is untouched in `../site`; to roll back, deploy from there.
* Lighthouse (20 Nov 2026): 100 / 100 / 100 / 100 phone and desktop.
