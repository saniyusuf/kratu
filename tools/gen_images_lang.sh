#!/bin/sh
# A demo language's own pictures, made locally like the shared set (FLUX.1-schnell 4-bit, 4 steps, 768 px, seed from the key).
#   sh tools/gen_images_lang.sh yo [--force]      prompts: content/langs/<code>/image_prompts.json → tools/.genimg-<code>/<key>.png
# then: node scripts/lang-pictures.mjs <code>     (webp 512 into the build's override folder)
# The generator and its weights live in the main checkout (~/Documents/kratu/tools), whose venv must never move.
code=$1; force=$2; G=$HOME/Documents/kratu/tools
mkdir -p tools/.genimg-$code
python3 -c "import json,hashlib,sys;d=json.load(open('content/langs/$code/image_prompts.json'));[print(k+'\t'+str(int(hashlib.md5(k.encode()).hexdigest()[:6],16))+'\t'+v) for k,v in d.items()]" |
while IFS="$(printf '\t')" read -r k seed p; do
  out=tools/.genimg-$code/$k.png
  [ -f "$out" ] && [ "$force" != "--force" ] && continue
  "$G/.venv-img/bin/mflux-generate" --model "$G/.models/schnell-4bit" --base-model schnell --steps 4 --seed "$seed" --width 768 --height 768 --prompt "$p" --output "$out" >/dev/null 2>&1 && echo "ok   $code $k" || echo "FAIL $code $k"
done
echo "DONE $code"
