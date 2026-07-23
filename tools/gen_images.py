#!/usr/bin/env python3
"""Generate Kratu lesson images locally with FLUX.1-schnell (mflux, 4-bit).

  tools/.venv-img/bin/python tools/gen_images.py [--keys dog,cat] [--force]

Reads tools/image_prompts.json (key -> prompt), writes tools/.genimg/<key>.png.
Skips keys that already have an output unless --force. Seed is stable per key.
"""
import argparse, hashlib, json, os, subprocess, sys
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VENV=os.path.join(ROOT,"tools",".venv-img","bin","mflux-generate")
MODEL=os.path.join(ROOT,"tools",".models","schnell-4bit")
OUT=os.path.join(ROOT,"tools",".genimg")
ap=argparse.ArgumentParser()
ap.add_argument("--keys",default=None)
ap.add_argument("--force",action="store_true")
ap.add_argument("--steps",type=int,default=4)
ap.add_argument("--size",type=int,default=768)
ap.add_argument("--variant",type=int,default=0,help="extra candidate: bumps seed, writes <key>.v<N>.png")
a=ap.parse_args()
prompts=json.load(open(os.path.join(ROOT,"tools","image_prompts.json")))
keys=list(prompts)
if a.keys: keys=[k.strip() for k in a.keys.split(",") if k.strip() in prompts]
os.makedirs(OUT,exist_ok=True)
suffix=(".v%d"%a.variant) if a.variant else ""
todo=[k for k in keys if a.force or not os.path.exists(os.path.join(OUT,k+suffix+".png"))]
print("generating %d images (skipping %d existing)"%(len(todo),len(keys)-len(todo)))
for i,k in enumerate(todo):
    seed=int(hashlib.md5(k.encode()).hexdigest()[:6],16)+a.variant*99991
    dst=os.path.join(OUT,k+suffix+".png")
    r=subprocess.run([VENV,"--model",MODEL,"--base-model","schnell","--steps",str(a.steps),
        "--seed",str(seed),"--width",str(a.size),"--height",str(a.size),
        "--prompt",prompts[k],"--output",dst],capture_output=True,text=True)
    ok=os.path.exists(dst)
    print("%s %-12s (%d/%d)"%("ok " if ok else "FAIL",k,i+1,len(todo)))
    if not ok: print(r.stderr[-200:])
print("IMAGES DONE")
