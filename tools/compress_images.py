#!/usr/bin/env python3
"""Compress every data:image URI: downscale to display size + WebP (alpha-safe).
Visually lossless at the sizes the app actually renders. Usage:
  python3 tools/compress_images.py <file.html> [--max 640] [--q 90]
  python3 tools/compress_images.py --json /tmp/photos_all.json
"""
import sys, re, base64, io
from PIL import Image

MAXEDGE = 640
QUALITY = 90
URI_RE = re.compile(rb'data:image/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+')

def compress_uri(uri: str) -> str:
    head, b64 = uri.split(",", 1)
    raw = base64.b64decode(b64)
    im = Image.open(io.BytesIO(raw))
    has_alpha = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
    im = im.convert("RGBA" if has_alpha else "RGB")
    w, h = im.size
    scale = min(1.0, MAXEDGE / max(w, h))
    if scale < 1.0:
        im = im.resize((max(1, round(w*scale)), max(1, round(h*scale))), Image.LANCZOS)
    out = io.BytesIO()
    im.save(out, "WEBP", quality=QUALITY, method=6)
    return "data:image/webp;base64," + base64.b64encode(out.getvalue()).decode()

def run_html(path):
    data = open(path, "rb").read()
    before = len(data)
    stats = {"n": 0, "saved": 0}
    def repl(m):
        u = m.group(0).decode()
        c = compress_uri(u)
        stats["n"] += 1; stats["saved"] += len(u) - len(c)
        return c.encode()
    data = URI_RE.sub(repl, data)
    open(path, "wb").write(data)
    print(f"{path}: {stats['n']} images, {before/1048576:.2f}MB -> {len(data)/1048576:.2f}MB")

def run_json(path):
    import json
    P = json.load(open(path))
    n = 0
    for k, v in P.items():
        if isinstance(v, str) and v.startswith("data:image"):
            P[k] = compress_uri(v); n += 1
    json.dump(P, open(path, "w"))
    print(f"{path}: compressed {n} images")

if __name__ == "__main__":
    args = sys.argv[1:]
    if "--max" in args: MAXEDGE = int(args[args.index("--max")+1])
    if "--q" in args: QUALITY = int(args[args.index("--q")+1])
    if "--json" in args: run_json(args[args.index("--json")+1])
    else: run_html(args[0])
