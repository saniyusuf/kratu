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
ap.add_argument('--th', type=float, default=0.03); ap.add_argument('--min', type=int, default=14); ap.add_argument('--vocab', action='store_true', help='print the characters the tokenizer knows and exit')
a = ap.parse_args()
tok = AutoTokenizer.from_pretrained(a.model)
if a.vocab: print(json.dumps(sorted(tok.get_vocab().keys()), ensure_ascii=False)); sys.exit(0)
model = VitsModel.from_pretrained(a.model); model.eval()
model.noise_scale = 0.5; model.noise_scale_duration = 0.6; model.speaking_rate = a.rate   # calmer and a touch slower, for a six-year-old
SR = model.config.sampling_rate; TH = a.th; MIN = a.min
REST = {'.': 0.38, '!': 0.38, '?': 0.38, '…': 0.38, ':': 0.3, ';': 0.3, '—': 0.25, ',': 0.2}

def pieces(text):
    out = []
    for m in re.finditer(r'([^.!?…:;—,]+)([.!?…:;—,]*)', text):
        words, punct = m.group(1).strip(), m.group(2)
        if not re.search(r'\w', words): continue
        out.append((words, max([REST.get(c, 0.0) for c in punct] or [0.0])))
    # a piece of a word or two comes out garbled or silent (the model needs some run-up), so short pieces are said
    # together with the next one, giving up that pause; a short line on its own gets a breath of run-up instead
    merged = []
    for words, rest in out:
        if merged and len(merged[-1][0]) < MIN: merged[-1] = (merged[-1][0] + ' ' + words, rest)
        else: merged.append((words, rest))
    if len(merged) > 1 and len(merged[-1][0]) < MIN: last = merged.pop(); merged[-1] = (merged[-1][0] + ' ' + last[0], last[1])
    return merged or [(text, 0.0)]

def tighten(wav, gap=0.3):
    """These models pad a phrase with up to a second of silence at each end and sometimes stop for two or three seconds
    inside it: the ends are cut and any pause longer than `gap` is shortened to it, so only the rests we add remain."""
    if not len(wav): return wav
    F = int(SR * 0.02); n = len(wav) // F
    if n < 2: return wav
    rms = np.sqrt((wav[:n * F].reshape(n, F) ** 2).mean(1)); th = max(rms.max() * TH, 1e-4)
    on = np.where(rms > th)[0]
    if not len(on): return np.zeros(0, dtype=np.float32)
    out, keep = [], int(gap * SR / F)
    start = prev = on[0]
    for i in on[1:]:
        if i - prev > keep: out.append(wav[max(0, start - 2) * F:(prev + 3) * F]); out.append(np.zeros(int(gap * SR), dtype=np.float32)); start = i
        prev = i
    out.append(wav[max(0, start - 2) * F:(prev + 3) * F])
    return np.concatenate(out).astype(np.float32)

def say(words):
    torch.manual_seed(a.seed)
    ids = tok(words, return_tensors='pt')
    if ids['input_ids'].shape[-1] < 2: return np.zeros(0, dtype=np.float32)
    with torch.no_grad(): return tighten(model(**ids).waveform[0].numpy())

for j in json.load(open(a.jobs)):
    text = unicodedata.normalize('NFC', j['text'])
    parts = []
    for words, rest in pieces(text):
        parts.append(say(words)); parts.append(np.zeros(int(SR * rest), dtype=np.float32))
    wav = np.concatenate(parts) if parts else np.zeros(SR // 4, dtype=np.float32)
    scipy.io.wavfile.write(j['out'], SR, wav.astype(np.float32))
    print('ok', j['out'], flush=True)
