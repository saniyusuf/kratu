#!/usr/bin/env python3
"""Animate every action still that has no loop yet (tools/action_motions.json), 5 at a time."""
import json,os,subprocess,concurrent.futures as cf
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
M=json.load(open(R+'/tools/action_motions.json'))
def still(k):
    for c in [R+'/tools/.genimg/'+k+'.hedra.png', R+'/tools/.genimg/'+k+'.png']:
        if os.path.exists(c): return c
    return None
todo=[k for k in M if not os.path.exists(R+'/tools/.genvid/'+k+'.webp') and still(k)]
print('animating',len(todo),flush=True)
def one(k):
    r=subprocess.run(['python3',R+'/tools/hedra_video.py','--key',k,'--still',still(k),'--motion',M[k]],capture_output=True,text=True)
    return k, r.returncode, (r.stdout+r.stderr)[-300:]
with cf.ThreadPoolExecutor(5) as ex:
    for k,rc,out in ex.map(one,todo): print(('ok  ' if rc==0 and 'ok '+k in out else 'FAIL'),k,out.strip().splitlines()[-1] if out.strip() else '',flush=True)
print('LOOPS DONE')
