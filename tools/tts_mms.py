#!/usr/bin/env python3
"""Local VITS voices (Meta MMS and its fine-tunes) for the languages Google's free voice does not speak.
   tools/.venv-tts/bin/python tools/tts_mms.py --model facebook/mms-tts-yor --jobs jobs.json
   jobs.json: [{"text": "...", "out": "/abs/path.wav"}, ...]  →  one mono WAV per job; scripts/lang-voice.mjs normalises
   and encodes it like every other clip. These models read letters only (punctuation is dropped), so the text is cut at its
   punctuation and the pieces joined with short silences: a sentence end rests longer than a comma.
Weights download once into tools/.models/hf (ignored). Licence of the MMS family: CC-BY-NC 4.0."""
import argparse, json, os, re, sys, unicodedata
os.environ.setdefault('HF_HOME', os.path.join(os.path.dirname(os.path.abspath(__file__)), '.models', 'hf'))
import numpy as np, torch, scipy.io.wavfile
from transformers import VitsModel, AutoTokenizer

ap = argparse.ArgumentParser(); ap.add_argument('--model', required=True); ap.add_argument('--jobs', required=True)
ap.add_argument('--seed', type=int, default=7); ap.add_argument('--rate', type=float, default=0.92)
ap.add_argument('--vocab', action='store_true', help='print the characters the tokenizer knows and exit')
a = ap.parse_args()
tok = AutoTokenizer.from_pretrained(a.model)
if a.vocab: print(json.dumps(sorted(tok.get_vocab().keys()), ensure_ascii=False)); sys.exit(0)
model = VitsModel.from_pretrained(a.model); model.eval()
model.noise_scale = 0.5; model.noise_scale_duration = 0.6; model.speaking_rate = a.rate   # calmer and a touch slower, for a six-year-old
SR = model.config.sampling_rate
REST = {'.': 0.38, '!': 0.38, '?': 0.38, '…': 0.38, ':': 0.3, ';': 0.3, '—': 0.25, ',': 0.2}

def pieces(text):
    out = []
    for m in re.finditer(r'([^.!?…:;—,]+)([.!?…:;—,]*)', text):
        words, punct = m.group(1).strip(), m.group(2)
        if not re.search(r'\w', words): continue
        out.append((words, max([REST.get(c, 0.0) for c in punct] or [0.0])))
    return out or [(text, 0.0)]

def say(words):
    torch.manual_seed(a.seed)
    ids = tok(words, return_tensors='pt')
    if ids['input_ids'].shape[-1] < 2: return np.zeros(0, dtype=np.float32)
    with torch.no_grad(): return model(**ids).waveform[0].numpy()

for j in json.load(open(a.jobs)):
    text = unicodedata.normalize('NFC', j['text'])
    parts = []
    for words, rest in pieces(text):
        parts.append(say(words)); parts.append(np.zeros(int(SR * rest), dtype=np.float32))
    wav = np.concatenate(parts) if parts else np.zeros(SR // 4, dtype=np.float32)
    scipy.io.wavfile.write(j['out'], SR, wav.astype(np.float32))
    print('ok', j['out'], flush=True)
