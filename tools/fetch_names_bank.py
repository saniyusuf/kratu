#!/usr/bin/env python3
"""Build the expanded NAMEBANK: every name in northern_names.py spoken by the Hausa TTS voice,
re-encoded to 24k mono Opus (same format as the clips already in the app). Resumable."""
import urllib.request, urllib.parse, base64, json, sys, time, re, subprocess, pathlib, random
R = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(R / "tools"))
from northern_names import build

OUT = R / "public" / "names_bank_expanded.json"   # the app reads it from public/ (the repo root is the app since 22 Sep)
bank = json.loads(OUT.read_text()) if OUT.exists() else {}   # the app's bank already holds every approved clip (the old build's NAMEBANK was merged in)

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
def tts(text):
    url = f"https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=ha&q={urllib.parse.quote(text)}"
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Referer": "https://translate.google.com/"})
    return urllib.request.urlopen(req, timeout=30).read()
def opus(raw):
    return subprocess.run(["ffmpeg","-loglevel","error","-i","pipe:0","-ac","1","-b:a","24k","-c:a","libopus","-f","ogg","pipe:1"],
                          input=raw, capture_output=True).stdout

names = build()
todo = [(k, n) for k, n, g in names if k not in bank]
print(f"{len(names)} unique names; {len(bank)} already have audio; fetching {len(todo)}", flush=True)
fails = []
import threading
from concurrent.futures import ThreadPoolExecutor
lock = threading.Lock(); done = [0]
def work(item):
    k, n = item
    for attempt in range(4):
        try:
            raw = tts(n)
            if len(raw) < 800: raise RuntimeError("tiny response")
            og = opus(raw)
            if not og: raise RuntimeError("ffmpeg failed")
            with lock:
                bank[k] = "data:audio/ogg;base64," + base64.b64encode(og).decode()
            break
        except Exception as e:
            wait = 4 * (attempt + 1) + random.random() * 2
            print(f"  retry {n}: {e} (sleep {wait:.0f}s)", flush=True); time.sleep(wait)
    else:
        with lock: fails.append(n)
    with lock:
        done[0] += 1
        if done[0] % 25 == 0 or done[0] == len(todo):
            OUT.write_text(json.dumps(bank)); print(f"  {done[0]}/{len(todo)} saved ({len(bank)} clips)", flush=True)
    time.sleep(0.2 + random.random() * 0.3)
with ThreadPoolExecutor(max_workers=4) as ex:
    list(ex.map(work, todo))
OUT.write_text(json.dumps(bank))
print("DONE", len(bank), "clips; failed:", fails, flush=True)
gmap = {k: g for k, _, g in names}
(R / "tools" / "names_gender.json").write_text(json.dumps(gmap))
