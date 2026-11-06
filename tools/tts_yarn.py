#!/usr/bin/env python3
"""YarnGPT2 (saheedniyi/YarnGPT2, Apache-2.0): Nigerian voices for Yoruba, Igbo, Hausa and Nigerian English, each prompted
by a named speaker (yoruba_female2, igbo_female2 …). Audio tokens are decoded by WavTokenizer.
   tools/.venv-yarn/bin/python tools/tts_yarn.py --lang yoruba --speaker yoruba_female2 --jobs jobs.json
jobs.json: [{"text": "...", "out": "/abs/path.wav"}]. Needs tools/.yarngpt (git clone of github.com/saheedniyi02/yarngpt)."""
import argparse, json, os, sys, unicodedata
HERE = os.path.dirname(os.path.abspath(__file__))
os.environ.setdefault('HF_HOME', os.path.join(HERE, '.models', 'hf'))
sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '.yarngpt'))
import numpy as np, scipy.io.wavfile, torch
from huggingface_hub import hf_hub_download
from transformers import AutoModelForCausalLM
from audiotokenizer import AudioTokenizerV2

ap = argparse.ArgumentParser(); ap.add_argument('--lang', required=True); ap.add_argument('--speaker', required=True); ap.add_argument('--jobs', required=True)
ap.add_argument('--temp', type=float, default=0.1); ap.add_argument('--seed', type=int, default=7); ap.add_argument('--beams', type=int, default=1)
ap.add_argument('--ckpt', default=os.path.join(HERE, '.models', 'yarn', 'wavtokenizer_large_speech_320_24k.ckpt'))   # the decoder YarnGPT's README fetches (Google Drive); the Hub's v2 file decodes to noise
a = ap.parse_args()
ckpt = a.ckpt if os.path.exists(a.ckpt) else hf_hub_download(*a.ckpt.split(':'))
cfg = hf_hub_download('novateur/WavTokenizer-medium-speech-75token', 'wavtokenizer_mediumdata_frame75_3s_nq1_code4096_dim512_kmeans200_attn.yaml')
tok = AudioTokenizerV2('saheedniyi/YarnGPT2', ckpt, cfg)
model = AutoModelForCausalLM.from_pretrained('saheedniyi/YarnGPT2', torch_dtype='auto').to(tok.device)
for j in json.load(open(a.jobs)):
    torch.manual_seed(a.seed)
    text = unicodedata.normalize('NFC', j['text'])
    ids = tok.tokenize_prompt(tok.create_prompt(text, lang=a.lang, speaker_name=a.speaker))
    out = model.generate(input_ids=ids, temperature=a.temp, repetition_penalty=1.1, max_length=4000, num_beams=a.beams, do_sample=a.beams == 1)
    audio = tok.get_audio(tok.get_codes(out))
    scipy.io.wavfile.write(j['out'], 24000, np.asarray(audio.detach().cpu() if hasattr(audio, 'detach') else audio, dtype=np.float32).reshape(-1))
    print('ok', j['out'], flush=True)
