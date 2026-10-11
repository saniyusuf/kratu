#!/usr/bin/env python3
"""How intelligible a voice is, without a listener: Meta's MMS speech recogniser (mms-1b-all, one adapter per language)
transcribes clips and the transcript is scored against the text they were made from (character error rate, accents and
punctuation folded away so a missing tone mark is not counted as a wrong sound).
   tools/.venv-tts/bin/python tools/asr_check.py --lang yor --pairs pairs.json      pairs: [{"wav": path, "text": ...}]
Lower is better. A clip a recogniser cannot read is one a child will struggle with too; it says nothing about warmth."""
import argparse, json, os, re, unicodedata
os.environ.setdefault('HF_HOME', os.path.join(os.path.dirname(os.path.abspath(__file__)), '.models', 'hf'))
import numpy as np, torch, subprocess
from transformers import Wav2Vec2ForCTC, AutoProcessor

ap = argparse.ArgumentParser(); ap.add_argument('--lang', required=True); ap.add_argument('--pairs', required=True); ap.add_argument('--show', type=int, default=4)
a = ap.parse_args()
proc = AutoProcessor.from_pretrained('facebook/mms-1b-all'); model = Wav2Vec2ForCTC.from_pretrained('facebook/mms-1b-all')
proc.tokenizer.set_target_lang(a.lang); model.load_adapter(a.lang); model.eval()

def fold(s):
    s = unicodedata.normalize('NFD', s.lower()); s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r'\s+', ' ', re.sub(r"[^a-z0-9ɓɗƙƴ' ]", ' ', s)).strip()
def lev(x, y):
    d = list(range(len(y) + 1))
    for i, cx in enumerate(x, 1):
        p, d[0] = d[0], i
        for j, cy in enumerate(y, 1): p, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, p + (cx != cy))
    return d[len(y)]
def load(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32)

tot_e = tot_n = 0; rows = []
for p in json.load(open(a.pairs)):
    x = load(p['wav'])
    with torch.no_grad(): ids = model(**proc(x, sampling_rate=16000, return_tensors='pt')).logits.argmax(-1)[0]
    hyp = proc.decode(ids); ref = fold(p['text']); h = fold(hyp); e = lev(ref, h)
    tot_e += e; tot_n += max(1, len(ref)); rows.append((e / max(1, len(ref)), ref, h))
rows.sort(reverse=True)
print(json.dumps({'lang': a.lang, 'clips': len(rows), 'cer': round(tot_e / max(1, tot_n), 3), 'worst': [{'cer': round(r[0], 2), 'said': r[1], 'heard': r[2]} for r in rows[:a.show]], 'best': [{'cer': round(r[0], 2), 'said': r[1], 'heard': r[2]} for r in rows[-2:]]}, ensure_ascii=False, indent=1))
