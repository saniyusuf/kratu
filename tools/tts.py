#!/usr/bin/env python3
"""Kratu TTS module.

Current provider: Google Translate TTS (free, no key). The provider layer is
kept so a better voice (e.g. human recordings, another API) can be added later
without touching the generator.

  python3 tools/tts.py --text "Sannu!" --lang ha --out clip.mp3
"""
from __future__ import annotations
import os, time, urllib.request, urllib.parse


def synth_google(text: str, lang: str) -> bytes:
    url = ("https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=%s&q=%s"
           % (lang, urllib.parse.quote(text)))
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    return urllib.request.urlopen(req, timeout=30).read()


def synth(text: str, lang: str, provider: str | None = None, retries: int = 3) -> bytes:
    provider = provider or os.environ.get("KRATU_TTS", "google")
    if provider != "google":
        raise ValueError("unknown provider: " + provider)
    last = None
    for _ in range(retries):
        try:
            return synth_google(text, lang)
        except Exception as e:  # transient network — retry
            last = e
            time.sleep(1.5)
    raise last


if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--text", required=True)
    ap.add_argument("--lang", default="ha")
    ap.add_argument("--out", default="out.mp3")
    a = ap.parse_args()
    data = synth(a.text, a.lang)
    open(a.out, "wb").write(data)
    print("wrote %s (%d bytes)" % (a.out, len(data)))
