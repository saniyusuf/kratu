#!/usr/bin/env python3
"""Coqui XTTS-v2 fine-tunes, for a language whose MMS-family voice is not intelligible enough (Igbo).
   tools/.venv-xtts/bin/python tools/tts_xtts.py --model samuelolubukun/xtts-v2-igbo-openbible-conversational \
       --lang ig --ref samples/sample1_ref.wav --jobs jobs.json
The voice is cloned from --ref, a reference clip shipped with the model (a Common Voice adult speaker), never a child.
jobs.json: [{"text": "...", "out": "/abs/path.wav"}]. Licence: Coqui CPML (non-commercial)."""
import argparse, json, os, re, sys, unicodedata
os.environ.setdefault('HF_HOME', os.path.join(os.path.dirname(os.path.abspath(__file__)), '.models', 'hf'))
import numpy as np, torch, scipy.io.wavfile
from huggingface_hub import snapshot_download
from TTS.tts.configs.xtts_config import XttsConfig
from TTS.tts.models.xtts import Xtts

ap = argparse.ArgumentParser(); ap.add_argument('--model', required=True); ap.add_argument('--lang', required=True)
ap.add_argument('--ref', required=True); ap.add_argument('--jobs', required=True); ap.add_argument('--seed', type=int, default=7)
ap.add_argument('--temp', type=float, default=0.3); ap.add_argument('--speed', type=float, default=0.95)
a = ap.parse_args()
d = snapshot_download(a.model)
cfg = XttsConfig(); cfg.load_json(os.path.join(d, 'config.json'))
model = Xtts.init_from_config(cfg)
model.load_checkpoint(cfg, checkpoint_dir=d, vocab_path=os.path.join(d, 'vocab.json'), use_deepspeed=False, eval=True)
model.tokenizer.char_limits.setdefault(a.lang, 200)   # the stock table has no entry for a fine-tune's own language
orig = model.tokenizer.preprocess_text
def preprocess(txt, lang):   # the model card's fallback: the stock cleaner knows no Igbo, so it is only lower-cased
    try: return orig(txt, lang)
    except NotImplementedError: return re.sub(r'\s+', ' ', txt.lower()).strip()
model.tokenizer.preprocess_text = preprocess
lat, emb = model.get_conditioning_latents(audio_path=os.path.join(d, a.ref), gpt_cond_len=30, max_ref_length=30, sound_norm_refs=False)
SR = 24000
for j in json.load(open(a.jobs)):
    torch.manual_seed(a.seed)
    text = unicodedata.normalize('NFC', j['text'])
    out = model.inference(text=text, language=a.lang, gpt_cond_latent=lat, speaker_embedding=emb, temperature=a.temp, length_penalty=1.0,
                          repetition_penalty=5.0, top_k=30, top_p=0.85, speed=a.speed)
    scipy.io.wavfile.write(j['out'], SR, np.asarray(out['wav'], dtype=np.float32))
    print('ok', j['out'], flush=True)
