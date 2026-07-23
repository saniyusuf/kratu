#!/usr/bin/env python3
"""Batch-regenerate Kratu audio clips from tools/clips_manifest.json.

Examples:
  # regenerate a few clips, write JSON only
  python3 tools/generate_audio.py --keys w_intro,w_say_en --out /tmp/audio.json

  # regenerate every Hausa clip and inject into the app
  python3 tools/generate_audio.py --lang ha --inject

Injection appends a final `Object.assign(AUDIO, {...})` to kratu-lessons.html
(and copies to index.html), which wins over earlier definitions at runtime.
Run tools/compact_audio.js afterwards if the file accumulates stale layers.
"""
import argparse, base64, fnmatch, json, os, sys, time

sys.path.insert(0, os.path.dirname(__file__))
from tts import synth  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = os.path.join(ROOT, "tools", "clips_manifest.json")
APP = os.path.join(ROOT, "kratu-lessons.html")
INDEX = os.path.join(ROOT, "index.html")


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
    ap.add_argument("--lang", default=None, help="only clips in this language (ha | en)")
    ap.add_argument("--keys", default=None, help="comma-separated keys or glob patterns (e.g. 'wha_*,w_intro')")
    ap.add_argument("--out", default=None, help="also write the audio JSON here")
    ap.add_argument("--inject", action="store_true", help="splice results into the app")
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
    print("generating %d clips" % len(keys))

    audio, fails = {}, []
    for i, k in enumerate(keys):
        c = manifest[k]
        try:
            data = synth(c["text"], c["lang"])
            audio[k] = "data:audio/mpeg;base64," + base64.b64encode(data).decode()
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
