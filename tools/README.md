# Kratu audio tools

All narration and word audio is pre-generated and baked into the app — these
tools regenerate it with a switchable TTS provider.

- **`tts.py`** — the provider module. `google` (current voice, free, no key) or
  `spitch` (real Nigerian voices — Hausa: amina/aliyu/hasan/zainab; needs
  `SPITCH_API_KEY`). Select via `--provider` or `KRATU_TTS` env var.
- **`clips_manifest.json`** — every regenerable clip: key → text + language
  (473 clips: 263 Hausa, 210 English). Add new clips here so any provider can
  build them.
- **`generate_audio.py`** — batch generator. `--lang ha`, `--keys 'wha_*'`
  filters; `--inject` splices the results into `kratu-lessons.html` +
  `index.html` (appended as the last `Object.assign(AUDIO, …)`, which wins at
  runtime).

## Switch every Hausa clip to Spitch's Amina

```sh
export SPITCH_API_KEY=sk_...
python3 tools/generate_audio.py --provider spitch --lang ha --inject
```

Roll back to the Google voice the same way with `--provider google`.
Try a different voice first: `python3 tools/tts.py --provider spitch --voice zainab --text "Sannu!" --out test.mp3`

Note: a handful of legacy clips from the alphabet track (letter prompts,
kudos/retry, name-bank names) predate the manifest and keep their current
audio until their texts are added here.
