#!/usr/bin/env python3
"""Generate Kratu lesson photos remotely on Hedra (v3 API) from tools/image_prompts.json.

  python3 tools/hedra_images.py --keys hyena,giraffe [--model flux-dev] [--estimate] [--force] [--suffix .hedra]

Writes tools/.genimg/<key><suffix>.png (same place the local FLUX pipeline writes), so embed steps are unchanged.
Key: HEDRA_API_KEY in tools/.env (never in the repo).
"""
import argparse, json, os, sys, time, urllib.request, urllib.error, concurrent.futures as cf
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV=os.path.join(R,'tools','.env'); OUT=os.path.join(R,'tools','.genimg'); PROMPTS=os.path.join(R,'tools','image_prompts.json')
API='https://api.hedra.com/v3'
def key():
    for line in open(ENV):
        if line.startswith('HEDRA_API_KEY='): return line.split('=',1)[1].strip()
    sys.exit('no HEDRA_API_KEY in tools/.env')
KEY=key()
def call(method, path, body=None):
    body_data=body
    req=urllib.request.Request(API+path, method=method, headers={'X-API-Key':KEY,'Content-Type':'application/json'}, data=json.dumps(body).encode() if body is not None else None)
    for attempt in range(8):
        try:
            with urllib.request.urlopen(req, timeout=60) as r: return json.load(r)
        except urllib.error.HTTPError as e:
            body=e.read().decode()[:400]
            if e.code==429 or e.code>=500:   # rate limit (60 req/min per key) or provider hiccup: wait and retry
                wait=15
                try: wait=int(json.loads(body)['error'].get('retry_after') or 15)
                except Exception: pass
                time.sleep(wait+1); req=urllib.request.Request(API+path, method=method, headers={'X-API-Key':KEY,'Content-Type':'application/json'}, data=json.dumps(body_data).encode() if body_data is not None else None); continue
            raise SystemExit('%s %s -> %s %s'%(method,path,e.code,body))
    raise SystemExit('%s %s: gave up after retries'%(method,path))
def inp(model, prompt, seed):
    base={'prompt':prompt,'aspect_ratio':'1:1','seed':seed}
    if model.startswith('imagen'): base['resolution']='1K'; base.pop('seed',None)
    elif model.startswith('flux-dev') or model.startswith('flux-11'): base['resolution']='1080p'; base['output_format']='png'
    elif model.startswith('gpt-image'): base['quality']='medium'; base['resolution']='1024x1024'; base.pop('seed',None)
    return base
def run_one(model, k, prompt, dst):
    seed=int(__import__('hashlib').md5(k.encode()).hexdigest()[:6],16)
    job=call('POST','/models/'+model,{'input':inp(model,prompt,seed)})
    jid=job.get('job_id') or job.get('id')
    for _ in range(120):
        st=call('GET','/jobs/%s/status'%jid); s=st.get('status')
        if s in ('COMPLETED','FAILED'): break
        time.sleep(10)
    res=call('GET','/jobs/%s'%jid)
    outs=res.get('outputs') or res.get('result',{}).get('outputs') or []
    url=next((o.get('url') for o in outs if o.get('url')),None)
    if s!='COMPLETED' or not url: return (k, False, json.dumps(res)[:300])
    urllib.request.urlretrieve(url, dst); return (k, True, os.path.getsize(dst))
if __name__=='__main__':
    ap=argparse.ArgumentParser(); ap.add_argument('--keys',required=True); ap.add_argument('--model',default='flux-dev'); ap.add_argument('--estimate',action='store_true'); ap.add_argument('--force',action='store_true'); ap.add_argument('--suffix',default=''); ap.add_argument('--workers',type=int,default=4)
    a=ap.parse_args(); prompts=json.load(open(PROMPTS)); keys=[k for k in a.keys.split(',') if k in prompts]
    if a.estimate:
        est=call('POST','/models/%s/estimate'%a.model,{'input':inp(a.model,prompts[keys[0]],1)}); print(a.model,'estimate per image:',est); sys.exit()
    os.makedirs(OUT,exist_ok=True)
    todo=[k for k in keys if a.force or not os.path.exists(os.path.join(OUT,k+a.suffix+'.png'))]
    print('model',a.model,'generating',len(todo),'skipping',len(keys)-len(todo))
    with cf.ThreadPoolExecutor(a.workers) as ex:
        futs=[ex.submit(run_one,a.model,k,prompts[k],os.path.join(OUT,k+a.suffix+'.png')) for k in todo]
        for f in cf.as_completed(futs):
            k,ok,info=f.result(); print(('ok  ' if ok else 'FAIL'),k,info,flush=True)
    print('HEDRA DONE')
