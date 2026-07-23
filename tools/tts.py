#!/usr/bin/env python3
"""Kratu TTS module — pluggable providers.

Providers:
  google  — Google Translate TTS (free, no key, robotic; the current default)
  spitch  — Spitch (https://spitch.app) real Nigerian voices; needs SPITCH_API_KEY

Select with --provider, or the KRATU_TTS env var. Usage:

  python3 tools/tts.py --text "Sannu!" --lang ha --out clip.mp3
  KRATU_TTS=spitch python3 tools/tts.py --text "Sannu!" --lang ha --out clip.mp3
"""
from __future__ import annotations
import os, sys, time, urllib.request, urllib.parse

# voice used per language when the provider supports voices
SPITCH_VOICES = {"ha": "amina", "en": "john", "yo": "sade", "ig": "ngozi"}
SPITCH_BASE = os.environ.get("SPITCH_BASE_URL", "https://api.spi-tch.com")


def synth_google(text: str, lang: str) -> bytes:
    url = ("https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=%s&q=%s"
           % (lang, urllib.parse.quote(text)))
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    return urllib.request.urlopen(req, timeout=30).read()


def synth_spitch(text: str, lang: str, voice: str | None = None) -> bytes:
    key = os.environ.get("SPITCH_API_KEY")
    if not key:
        raise RuntimeError("SPITCH_API_KEY not set — export it or use --provider google")
    body = {"text": text, "language": lang,
            "voice": voice or SPITCH_VOICES.get(lang, "john"), "format": "mp3"}
    import json as _json
    req = urllib.request.Request(SPITCH_BASE + "/v1/speech",
                                 data=_json.dumps(body).encode(),
                                 headers={"Authorization": "Bearer " + key,
                                          "Content-Type": "application/json"})
    return urllib.request.urlopen(req, timeout=60).read()


def synth(text: str, lang: str, provider: str | None = None, voice: str | None = None,
          retries: int = 3) -> bytes:
    provider = provider or os.environ.get("KRATU_TTS", "google")
    last = None
    for _ in range(retries):
        try:
            if provider == "spitch":
                return synth_spitch(text, lang, voice)
            if provider == "google":
                return synth_google(text, lang)
            raise ValueError("unknown provider: " + provider)
        except (RuntimeError, ValueError):
            raise
        except Exception as e:  # transient network — retry
            last = e
            time.sleep(1.5)
    raise last


if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--text", required=True)
    ap.add_argument("--lang", default="ha")
    ap.add_argument("--provider", default=None, help="google | spitch (default: $KRATU_TTS or google)")
    ap.add_argument("--voice", default=None, help="spitch voice override (e.g. amina, zainab)")
    ap.add_argument("--out", default="out.mp3")
    a = ap.parse_args()
    data = synth(a.text, a.lang, a.provider, a.voice)
    open(a.out, "wb").write(data)
    print("wrote %s (%d bytes) via %s" % (a.out, len(data), a.provider or os.environ.get("KRATU_TTS", "google")))
