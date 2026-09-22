#!/usr/bin/env python3
"""Animate an action still into a short loop on Hedra (kling-25-turbo), then make an animated WebP + GIF.
  python3 tools/hedra_video.py --key wash --still tools/.genimg/wash.hedra.png --motion "the girl scrubs the cloth in the basin"
Outputs tools/.genvid/<key>.mp4, <key>.webp (looping, 480px, for the app), <key>.gif (for review)."""
import argparse, json, os, sys, time, subprocess, urllib.request, urllib.error, uuid
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__))); API='https://api.hedra.com/v3'; OUT=os.path.join(R,'tools','.genvid')
KEY=[l.split('=',1)[1].strip() for l in open(os.path.join(R,'tools','.env')) if l.startswith('HEDRA_API_KEY=')][0]
def call(method,path,body=None,raw=None,ctype='application/json'):
    for attempt in range(8):
        req=urllib.request.Request(API+path,method=method,headers={'X-API-Key':KEY,'Content-Type':ctype},data=raw if raw is not None else (json.dumps(body).encode() if body is not None else None))
        try:
            with urllib.request.urlopen(req,timeout=120) as r: return json.load(r)
        except urllib.error.HTTPError as e:
            b=e.read().decode()[:400]
            if e.code==429 or e.code>=500: time.sleep(16); continue
            raise SystemExit('%s %s -> %s %s'%(method,path,e.code,b))
    raise SystemExit('gave up '+path)
def upload(path):
    bnd='----kratu'+uuid.uuid4().hex; data=open(path,'rb').read()
    body=('--%s\r\nContent-Disposition: form-data; name="file"; filename="%s"\r\nContent-Type: image/png\r\n\r\n'%(bnd,os.path.basename(path))).encode()+data+('\r\n--%s--\r\n'%bnd).encode()
    return call('POST','/files',raw=body,ctype='multipart/form-data; boundary='+bnd)['url']
def run(key,still,motion,model='kling-25-turbo',dur=5000):
    os.makedirs(OUT,exist_ok=True); url=upload(still)
    prompt=motion+', natural gentle movement, the camera stays still, photorealistic, same person and same place as the picture, no text'
    inp={'prompt':prompt,'aspect_ratio':'1:1','duration_ms':dur,'start_image':{'source':'url','url':url}}
    if model.startswith('kling'): inp['resolution']='1080p'; inp['negative_prompt']='text, watermark, distortion, extra limbs'
    job=call('POST','/models/'+model,{'input':inp}); jid=job.get('job_id') or job.get('id'); print(key,'job',jid,flush=True)
    for _ in range(120):
        st=call('GET','/jobs/%s/status'%jid).get('status')
        if st in ('COMPLETED','FAILED'): break
        time.sleep(12)
    res=call('GET','/jobs/%s'%jid); outs=res.get('outputs') or []
    vurl=next((o.get('url') for o in outs if o.get('url')),None)
    if st!='COMPLETED' or not vurl: print('FAIL',key,json.dumps(res)[:300]); return False
    mp4=os.path.join(OUT,key+'.mp4'); urllib.request.urlretrieve(vurl,mp4)
    # loop-friendly: 480px, 12 fps; webp for the app, gif for review
    frames=os.path.join(OUT,'_frames_'+key); os.makedirs(frames,exist_ok=True)
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',mp4,'-vf','fps=12,scale=480:-2',os.path.join(frames,'f%03d.png')])
    from PIL import Image; import glob as _g
    fr=[Image.open(f).convert('RGB') for f in sorted(_g.glob(frames+'/f*.png'))]
    if fr: fr[0].save(os.path.join(OUT,key+'.webp'),save_all=True,append_images=fr[1:],duration=int(1000/12),loop=0,quality=72,method=4)
    for f in _g.glob(frames+'/f*.png'): os.remove(f)
    os.rmdir(frames)
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',mp4,'-vf','fps=10,scale=360:-2:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer:bayer_scale=4','-loop','0',os.path.join(OUT,key+'.gif')])
    print('ok',key,os.path.getsize(mp4),'webp',os.path.getsize(os.path.join(OUT,key+'.webp')),'gif',os.path.getsize(os.path.join(OUT,key+'.gif')),flush=True); return True
if __name__=='__main__':
    ap=argparse.ArgumentParser(); ap.add_argument('--key',required=True); ap.add_argument('--still',required=True); ap.add_argument('--motion',required=True); ap.add_argument('--model',default='kling-25-turbo'); a=ap.parse_args()
    run(a.key,a.still,a.motion,a.model)
