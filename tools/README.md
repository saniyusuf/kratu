# Kratu audio tools

All narration and word audio is pre-generated and baked into the app — these
tools regenerate it.

- **`tts.py`** — the TTS module (Google Translate voice; free, no key). The
  provider layer is kept thin so a better source — e.g. **human recordings of a
  Nigerian speaker** — can be slotted in later without touching the generator.
- **`clips_manifest.json`** — every regenerable clip: key → text + language
  (499 clips: Hausa narration/words, English words, A–Z letters). Add new
  clips here first.
- **`generate_audio.py`** — batch generator. `--lang ha`, `--keys 'wha_*'`
  filters; `--inject` splices results into `kratu-lessons.html` + `index.html`
  (appended as the last `Object.assign(AUDIO, …)`, which wins at runtime).

```sh
# regenerate all English word clips and inject
python3 tools/generate_audio.py --lang en --inject
```

Note: there is no Nigerian-accented English in this engine. When ready, record
a native speaker reading the manifest's English lines (~20 min of audio) and
inject the files the same way.

Legacy clips from the alphabet track (prompt/kudos/retry lines, name-bank
names) predate the manifest and keep their current audio until their texts are
added here.
