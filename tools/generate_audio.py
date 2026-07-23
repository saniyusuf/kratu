#!/usr/bin/env python3
"""Batch-regenerate Kratu audio clips from tools/clips_manifest.json.

Examples:
  # regenerate every Hausa clip with Spitch's Amina and inject into the app
  SPITCH_API_KEY=sk_... python3 tools/generate_audio.py --provider spitch --lang ha --inject

  # regenerate a few clips with the current (Google) voice, write JSON only
  python3 tools/generate_audio.py --provider google --keys w_intro,w_say_en --out /tmp/audio.json

  # everything, both languages, Spitch
  SPITCH_API_KEY=sk_... python3 tools/generate_audio.py --provider spitch --inject

Injection appends a final `Object.assign(AUDIO, {...})` to kratu-lessons.html
(and copies to index.html), which wins over earlier definitions at runtime.
"""
import argparse, audioop, base64, fnmatch, io, json, os, subprocess, sys, tempfile, time, wave

sys.path.insert(0, os.path.dirname(__file__))
from tts import synth  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = os.path.join(ROOT, "tools", "clips_manifest.json")
APP = os.path.join(ROOT, "kratu-lessons.html")
INDEX = os.path.join(ROOT, "index.html")


def normalize_to_aac(wav_bytes: bytes, peak_target: float) -> tuple:
    """Boost WAV to peak_target of full scale, encode to AAC (m4a) via afconvert."""
    wf = wave.open(io.BytesIO(wav_bytes))
    nch, sw, fr, nf = wf.getnchannels(), wf.getsampwidth(), wf.getframerate(), wf.getnframes()
    frames = wf.readframes(nf)
    peak = audioop.max(frames, sw) or 1
    full = float(2 ** (8 * sw - 1) - 1)
    factor = min(full * peak_target / peak, 6.0)
    frames = audioop.mul(frames, sw, factor)
    with tempfile.TemporaryDirectory() as td:
        wp, mp = os.path.join(td, "a.wav"), os.path.join(td, "a.m4a")
        out = wave.open(wp, "wb")
        out.setnchannels(nch); out.setsampwidth(sw); out.setframerate(fr)
        out.writeframes(frames); out.close()
        r = subprocess.run(["afconvert", wp, "-o", mp, "-f", "m4af", "-d", "aac", "-b", "56000"],
                           capture_output=True)
        if r.returncode != 0:
            raise RuntimeError("afconvert failed: " + r.stderr.decode()[:120])
        return open(mp, "rb").read(), "audio/mp4"


def inject(audio: dict):
    h = open(APP, encoding="utf-8").read()
    needle = "  Object.assign(AUDIO, "
    last = h.rfind(needle)
    if last < 0:
        sys.exit("no Object.assign(AUDIO,...) anchor found in app")
    eol = h.index("\n", last)
    h = h[:eol] + "\n  Object.assign(AUDIO, " + json.dumps(audio) + ");" + h[eol:]
    open(APP, "w", encoding="utf-8").write(h)
    open(INDEX, "w", encoding="utf-8").write(h)
    print("injected %d clips into kratu-lessons.html + index.html" % len(audio))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--provider", default=None, help="google | spitch (default: $KRATU_TTS or google)")
    ap.add_argument("--voice", default=None, help="spitch voice override (amina, zainab, aliyu, hasan, ...)")
    ap.add_argument("--lang", default=None, help="only clips in this language (ha | en)")
    ap.add_argument("--keys", default=None, help="comma-separated keys or glob patterns (e.g. 'wha_*,w_intro')")
    ap.add_argument("--out", default=None, help="also write the audio JSON here")
    ap.add_argument("--inject", action="store_true", help="splice results into the app")
    ap.add_argument("--speed", type=float, default=None, help="spitch speech rate (e.g. 0.85 = slower)")
    ap.add_argument("--gain", type=float, default=None, help="normalize loudness to this peak fraction (e.g. 0.95); spitch only — outputs AAC")
    ap.add_argument("--delay", type=float, default=0.15, help="seconds between requests")
    a = ap.parse_args()

    manifest = json.load(open(MANIFEST, encoding="utf-8"))
    keys = list(manifest)
    if a.lang:
        keys = [k for k in keys if manifest[k]["lang"] == a.lang]
    if a.keys:
        pats = [p.strip() for p in a.keys.split(",")]
        keys = [k for k in keys if any(fnmatch.fnmatch(k, p) for p in pats)]
    if not keys:
        sys.exit("no clips matched")
    print("generating %d clips via %s" % (len(keys), a.provider or os.environ.get("KRATU_TTS", "google")))

    audio, fails = {}, []
    for i, k in enumerate(keys):
        c = manifest[k]
        try:
            if a.gain:
                wav = synth(c["text"], c["lang"], a.provider, a.voice, speed=a.speed, fmt="wav")
                data, mime = normalize_to_aac(wav, a.gain)
            else:
                data = synth(c["text"], c["lang"], a.provider, a.voice, speed=a.speed)
                mime = "audio/mpeg"
            audio[k] = "data:" + mime + ";base64," + base64.b64encode(data).decode()
            print("ok %-22s %5dB  (%d/%d)" % (k, len(data), i + 1, len(keys)))
        except Exception as e:
            fails.append(k)
            print("FAIL %-20s %s" % (k, str(e)[:80]))
        time.sleep(a.delay)

    if a.out:
        json.dump(audio, open(a.out, "w"))
        print("wrote", a.out)
    if a.inject and audio:
        inject(audio)
    print("done: %d ok, %d failed%s" % (len(audio), len(fails), (" -> " + ",".join(fails)) if fails else ""))
    if fails:
        sys.exit(1)


if __name__ == "__main__":
    main()
