# Family name server (Cloud Function `familyApi`, codebase `family`)

What tools/name-proxy.mjs does on a laptop, for the deployed family app (Sani 2026-11-25). Firebase Hosting target
`family` (site `kratu-family`) rewrites `/api/name` and `/api/say` here, so the app's paths do not change.

- `POST /api/name`: the child's "Sunana …" clip (16 kHz mono WAV, 200 KB / about 6 s at most) → PlotWeaver STORM ASR (Hausa) → `{text}`
- `POST /api/say`: a written name only (letters, 24 at most) → PlotWeaver's Hausa voice Rahama → Opus/Ogg at the app's level
- Guards: POST only (405), WAV only (400), size caps (413), names only (400), the family site's origin only (403),
  20 name calls and 10 say calls per IP per 10 minutes per instance (429), at most 3 instances.
- The key is the Functions secret `PLOTWEAVER_KEY`. Logs carry sizes and times only: never the key, the audio or the text.
- Region europe-west1, Node 22, 512 MiB. ffmpeg comes from `ffmpeg-static` (GPL-3.0 binary, run on the server only, not shipped to phones).

## Local test (emulators)

    # functions/.secret.local holds PLOTWEAVER_KEY=… (gitignored; made from the local .env, never printed)
    npm run build:family
    firebase emulators:start --only functions,hosting:family --project kratu-app    # app on http://127.0.0.1:5050

## Release (each step needs Sani's yes; the Blaze plan is needed for functions and secrets)

    firebase functions:secrets:set PLOTWEAVER_KEY --project kratu-app     # paste the key when asked; it is never in the repo
    firebase hosting:sites:create kratu-family --project kratu-app
    npm run build:family
    KRATU_DEPLOY=family firebase deploy --only functions:family,hosting:family --project kratu-app

The school app on kratu-app.web.app is deployed on its own: `KRATU_DEPLOY=school firebase deploy --only hosting:school --project kratu-app`.
A plain `firebase deploy` stops: every target runs tools/deploy-guard.mjs first, which refuses unless KRATU_DEPLOY
names it, and checks the build is there, the PlotWeaver key is not in it, and (family) TESTER is off.
