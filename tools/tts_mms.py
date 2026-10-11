#!/usr/bin/env python3
"""Local VITS voices (Meta MMS and its fine-tunes) for languages Google's free voice does not speak.
   tools/.venv-tts/bin/python tools/tts_mms.py --model facebook/mms-tts-yor --jobs jobs.json
   jobs.json: [{"text": "...", "out": "/abs/path.wav"}, ...]  →  16 kHz mono WAV per job; voice.mjs normalises and encodes.
Weights download once into tools/.models/hf (ignored). Licence of the MMS family: CC-BY-NC 4.0."""
import argparse, json, os, sys, unicodedata
os.environ.setdefault('HF_HOME', os.path.join(os.path.dirname(os.path.abspath(__file__)), '.models', 'hf'))
import torch, scipy.io.wavfile
from transformers import VitsModel, AutoTokenizer

ap = argparse.ArgumentParser(); ap.add_argument('--model', required=True); ap.add_argument('--jobs', required=True); ap.add_argument('--seed', type=int, default=7)
ap.add_argument('--vocab', action='store_true', help='print the characters the tokenizer knows and exit')
a = ap.parse_args()
tok = AutoTokenizer.from_pretrained(a.model)
if a.vocab: print(json.dumps(sorted(tok.get_vocab().keys()), ensure_ascii=False)); sys.exit(0)
model = VitsModel.from_pretrained(a.model); model.eval()
model.noise_scale = 0.5; model.noise_scale_duration = 0.6; model.speaking_rate = 0.92   # calmer and a touch slower, for a six-year-old
vocab = set(tok.get_vocab().keys())
for j in json.load(open(a.jobs)):
    text = unicodedata.normalize('NFC', j['text'])
    if not any(c in vocab for c in text.lower()): text = unicodedata.normalize('NFD', j['text'])
    torch.manual_seed(a.seed)
    ids = tok(text, return_tensors='pt')
    with torch.no_grad(): wav = model(**ids).waveform[0].numpy()
    scipy.io.wavfile.write(j['out'], model.config.sampling_rate, wav)
    print('ok', j['out'], flush=True)
