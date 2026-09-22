# Kratu — CLAUDE.md

Kratu is an offline, voice-first Hausa literacy tutor for children aged 6–10, for cheap Android tablets. Laila (the bird)
speaks Hausa; the child answers by voice or by touch. **This Angular project is THE app** (Sani, 13 Sep 2026), and since
22 Sep it IS the repository root (it used to live in `kratu-ng/`). The old single-file build, the design page and the design
explorations are retired and gone from the tree; they survive in git history on `main`. Work happens on `angular-app`.
Live: https://kratu-app.web.app (Firebase project `kratu-app`).

## Commands
- `npm start` — regenerate content, then `ng serve` (port 4200). `npm run build` — content + lint + production build.
- `npm run content` — `content/` → `public/assets/clips.json` + `words.json`. Never edit those two by hand.
- `npm run lint:content` — code ↔ catalogue ↔ files must agree (exit 1 on errors). Run it after any content change.
- `npm run voice` — record lines whose clip is missing or whose text changed (`--dry-run`, `--only key`, `--force`).
- `npm run words` — pictures (webp 512) and the two name clips for words; `-- --add key --group g --ha … --en … --picture file`.
- Voice provider and any key live in `.env` (ignored). Never print a key. `.env.example` shows the shape.
- Deploy: `npm run build && firebase deploy --only hosting --project kratu-app`. Node is pinned to 22.21.1 (`.nvmrc`):
  22.23.0 breaks the Firebase CLI's sign-in ("Premature close", reported as "credentials are no longer valid").

## Generation tools (`tools/`, Sani 22 Sep: keep the latest generator of anything we can use)
Scripts are tracked; the weights, the Python env, raw renders and the Hedra key are ignored and stay on this machine.
- `gen_images.py` — FLUX.1-schnell, local and free: `tools/.venv-img/bin/python tools/gen_images.py --keys dog,cat`.
  Weights in `tools/.models/schnell-4bit`; the venv only works at this exact path (never move it).
- `hedra_images.py` — pictures on Hedra (paid, key in `tools/.env`), prompts in `image_prompts.json`.
- `hedra_video.py` + `run_action_loops.py` — an action still → 5 s looping WebP (motions in `action_motions.json`).
  30 loops exist in `tools/.genvid`; 17 actions have none yet; the app does not show loops yet.
- `fetch_names_bank.py` + `northern_names.py` — the names bank (Hausa TTS) → `public/names_bank_expanded.json`.
- Raw outputs: `tools/.genimg` (pictures), `tools/.genvid` (loops). `npm run words` turns a picture into the app's webp.

## Where things live
- `content/` is the truth: `lines.json` (every Laila line), `words.json`, `names.json`, `pruned.json`. See `content/README.md`.
- `public/assets/audio/ha`, `audio/en`, `pictures/` — generated from the catalogue; word clips are `word_<key>.ogg`.
- `public/models/`, `public/vosk-model/` — gzipped models with manifests carrying true sizes; the loader inflates them and
  keeps them in Cache Storage `kratu-models-1`; ORT gets its wasm as bytes (`wasmBinary`). The service worker keeps the
  app, the engine scripts and every clip and picture; it never caches the models.
- `src/app/core` (audio bus, clips, words, session, flow, speech, identity, loader, zoom), `shared` (Laila, chrome, lesson
  base + topic-lesson base, topic menu, results grid, allo button, abc keyboard, subs, icons), `features` (loader,
  onboarding, home + leave, lessons, settings). Screens extend `LessonBase` / `TopicLessonBase`; add shared behaviour
  there, never copy it between screens.
- Screens refer to content by key only (`bus.play('app_kudos')`, `bus.gk('s_back')`), never by file path.

## Rules that never change (Sani)
- Every Hausa line has a boy and a girl form (`_m` / `_f`) unless it is truly gender-neutral; the lint checks pairs.
- One sound at a time, always: `SoundEngine` owns the single audio element, films with sound are `claim()`ed through it,
  and a document guard pauses everything else the moment any media starts. `AudioBus.play()` sits on top (keys, gendered
  keys, captions); sequences abort when preempted. Never call `.play()` on a media element yourself. Laila is never audible
  while the microphone is open.
- Door upper-left = back, everywhere. Ear upper-right = hear again. Black slate = "ban sani ba". Hints once per session.
- Never two "Madalla" in a row. Written Hausa prompts are never shown to children; subtitles are English, off by default.
- No photos of a child are ever stored: vectors and the child's own "sunana" clip only. Two faces in frame = never recognise.
- Permission screen first, skipped when already granted. No device gate: the layout scales to any viewport; landscape only.
- New clips: −18.5 dB mean, opus 24 kHz mono (the voice script does this). Name protocol: the words after "sunana".
- Settings gear bottom-left, teal; code 064662118 gates only the students list. Diagnostics only with `?debug`.
- English on screen says "click Laila", never "click the head of Laila" (Sani 16 Sep).
- Don't invent lines, screens or panels: the design's final markup and script for a screen are the whole truth (stray CSS in
  the design file is not). Any Angular wrapper element between design elements is `display: contents` so the DOM matches
  one to one; measure a changed screen against the old build at the same viewport. Ask Sani for wording; never guess Hausa.
- **No pushes to GitHub until Sani says so.**

## Gotchas
- The name is the sound, not the spelling (Sani 17 Sep). `nameClip()` keeps only the NAME: the recording is split at the
  pauses and the last piece taken, so the greeting is "Sannu," + "Sani", never "Sannu, sunana Sani". `snapName()` accepts
  a bank name only on an exact or spelling-folded match — the old near-miss matching is gone, because one name must never
  be heard and another said back. No bank match simply means the child's own recording says their name.
- Identity, corrected by Sani 17 Sep: (1) a record is ONE child and is only ever merged by id — never by name, so two
  children called Musa are two records; (2) a new child is held in memory and written only when they press Laila to start
  (`pending` in face.ts), so an abandoned or retried enrolment leaves nothing; (3) the voice's weight is set by how close
  the two best faces are — 0.9 when they are within 0.08 of each other, 0.15 once one face leads by 0.25 — and a voice
  that is strong and clearly ahead can settle an ambiguous pair on its own.
- Two faces in the camera no longer end the capture: everything gathered is dropped, Laila says `s_alone2` (again every
  7 s), the ring's clock stops, and it carries on by itself once one face has been seen for five frames. Only after 25 s
  of company does it give up and offer a fresh try. The camera guide (Sani 17 Sep): ONE generous target ring in the middle (pale
  dashed while waiting, green only when one face is in it at a sensible size, amber while paused), and the app's own
  pointing hand on the far side of the ring pointing the way the face must travel ON SCREEN, which is what a child
  watching the picture follows (Sani 17 Sep: not inverted). Centred locks in with a strong green glow, inside and out. Too far or too close is left to the spoken hint and its picture.
  `follow()` undoes the mirror and the cover crop to map the engine's camera-pixel box onto the picture on screen.
- The capture dialog lives at body level, so CSS for anything inside it must match `.facecap …`, never `.s.facecap …`.
- Screens move by what the change means (`core/nav/screen-transition.service.ts`, Sani 17 Sep): the opening run
  (permission → gender → Laila → face → chooser) has no way back, so each screen is a new page laid down (PAPER); from
  the chooser into a lesson and deeper the child travels, so screens SLIDE, reversed for the door. A depth table of
  routes decides both which movement and which direction. The screen being left is a still clone (the router has already removed the
  real one; videos and audio are stripped from the copy); the arriving screen is live, and any tap cuts the slide short.
  It runs from `ZoomService.reveal`, so it can never start before the new screen's size is settled. `ScreenTransition.on`
  is the single switch, off by default under `prefers-reduced-motion`.
- A new screen is held back (`ZoomService.settle()`) until its fonts and media are in and the fit is final, so it never
  appears at one size and rescales — hold it with OPACITY, never `visibility:hidden`: that is inherited and `measure()`
  skips hidden elements, so the fit would measure an empty screen. Anything that appears mid-screen must have its space
  reserved (min-height), not grow the layout (Sani 17 Sep).
- The face screen's example film has ONE play routine, `playFilm()`, used by the entry sequence and by a press alike: it
  is pressable (app.css re-enables the pointer events the design had off), always starts from the beginning, and however
  it finishes — played out, cut off or refused — `video.load()` puts the poster back. It must never be left on a black
  frame (Sani 17 Sep). Only the newest press resets it (a token), or the previous one's cleanup wipes the new playback.
- Meet Laila: while `s_laila2` plays she is the emphasis (slow strong glow, no hand); when it ends the hand appears, her
  glow quickens and Ci gaba gets a mild glow. A press or the ear restarts that sequence (a token guards the old run).
- The route for '' is `blank`, and app.ts navigates to `/blank` before the loader runs: a screen rendered under the
  loader overlay would speak its opening line unheard and, being the same route instance, never say it again (the
  gender greeting bug of 16 Sep). After the loader the gender greeting always plays, then `s_ear` ("to hear it again, press this ear") with the ear
  pulsing and the pointing hand beside it, both only while that line plays. Whenever a screen points something out it uses
  `Spotter` (the app's own hand); app.css widens the design's `.s.lesson .spothand` rule to every screen.
- `styles.scss` carries the old page head's `[hidden]{display:none!important}`: every `hidden` attribute in the design
  depends on it (without it, boxes styled `display:flex` stay visible — the Nemo hoto placeholder of 15 Sep).
- Autoplay: on a fresh load the browser refuses the first line (no user gesture yet). The bus remembers the refused line
  and `replayBlocked()` says it on the first `pointerdown` (app.ts). Never assume the opening line of the first screen played.
- A bare `muted` attribute on a `<video>` in an Angular template does NOT mute it (the attribute only counts at parse
  time). Use `[muted]="true"` and set `el.muted = true` in code when attaching a stream, or the child hears their own
  microphone as an echo (found 14 Sep on the face capture).
- Parity with the old build was measured with `scripts/parity/` (collector + compare, see its README). The old build now
  lives only in git history (`git show main:kratu-v2.html`), so check it out somewhere else to run a comparison. The old build reports rects in layout px (legacy CSS zoom); the Angular page in screen px.
- Inside the zoomed frame the old build's `vw`/`vh` behaved as frame-relative units; design.css therefore uses `cqw`/`cqh`
  (the frame is the size container). Never reintroduce `vw` inside the frame.
- `[innerHTML]` with our SVG strings must go through `DomSanitizer.bypassSecurityTrustHtml` (Laila, slate, door, ear) or
  Angular strips the drawing silently.
- Word order inside each group is meaning (counting order, teaching order, the samples' "five"): content/words.json keeps
  the design's order and build-content never sorts.
- The old build shipped NO web fonts (its head was cut); it rendered the system fallback. The Angular app ships Baloo 2 and
  Nunito offline as the design page intended. Sani decides which look is canonical (asked 14 Sep).
- The door and ear components ARE the design's `.backdoor` / `.helpdome` elements (host class), so the old build's
  `.s > .backdoor {position:fixed}` corner rule matches; the home grid has no wrapper in layout. Any new wrapper must be
  `display:contents`. The zoom easing (`ZoomService.fit`) measures every in-flow descendant and iterates until the
  screen fits: nothing may ever be cut off (the old build measured direct children only and clipped the face hint).
- The face screen's capture dialog (`.capmodal`) is moved to `document.body` when it opens (an effect in face.ts): the old
  app appended it there, outside the zoomed frame, sized in viewport units. Never leave a fixed overlay inside the frame. Because it is moved by hand it is also removed by hand (`dropModal()`) when
  capture ends or the screen is left; Angular's own removal misses it.
- The recognition gate (`.capnext`) sits inside `.camwrap` and covers the whole camera picture: Laila alone (150 px), the
  line, and a door button underneath that ends the session and returns to the gender screen (Sani 14 Sep).
- Face screen entry (Sani 14 Sep): `s_p1` (what the video is for, with the example "Sunana Musa"; never `s_face`, it ends with a second "press Laila") → `s_p2` ("here is Musa / Aisha saying the name") → the film of the child's gender →
  `s_p3` ("now you: press Laila and say your name") → Laila cued. The ear repeats it.
- The face screen shows only the chosen gender's example (`data-gender` on the host) and its heading is gendered
  (kake/sunanka · kike/sunanki).
- Never write `textContent` into an element Angular renders with `{{ }}`: the text node detaches and the slot shows stale
  letters. Fly helpers only animate; the caller sets the signal.
- `ng serve` can miss a file created in a new folder: touch a file to nudge it.
- A dev-server restart mid-download ends a stream cleanly; the loader compares sizes against the manifests before caching.
- `?debug` + `localStorage.kratu_perms=1` bypasses the permission check for walkthroughs; `#musa` / `#aisha` are demo
  sessions (captions on). The Browser pane blocks camera and mic: mic flows can only be checked up to the "retry" path.
- The ORT bundle we ship loads one runtime (`ort-wasm-simd-threaded.jsep.wasm.gz`) for WebGPU and plain wasm alike.

## Open items
- Review page inside the app (`/review`, debug only), screens index (`/screens`) — see the plan:
  https://claude.ai/code/artifact/56d76491-ae9f-476e-b17d-895b578e5300 (the repo-root move is done; hosting is Firebase, not Pages).
- Content: `farm` and `farm_work` are both "Farm" in English; Sani's wording for `s_perm_no` is pending.
