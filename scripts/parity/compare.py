import json, os, sys, re
D='/tmp/kratu-parity/data'
PAIRS=[('perm','perm'),('gender','gender'),('meetlaila','laila'),('facecap','face'),('home','home'),('abc','haruffa'),('learn','haruffa-koyo'),('cats','abubuwa'),('obj','abubuwa-koyo'),('spell','rubutu'),('lambobi','lambobi'),('quiz','nemo'),('karatu','karatu'),
 ('misali-karatu','misali-karatu'),('misali-rubutu','misali-rubutu'),('misali-abubuwa','misali-abubuwa'),('misali-lambobi','misali-lambobi'),('misali-nemo','misali-nemo'),('misali-nemonum','misali-nemonum'),('misali-haruffa','misali-haruffa')]
TOL=4
def load(n):
    p=os.path.join(D,n+'.json'); return json.load(open(p)) if os.path.exists(p) else None
def norm_key(k):
    # Angular hosts: app-laila renders inside .lm; results host etc. already mapped
    return k
report=[]
for old_n,new_n in PAIRS:
    o=load('old-'+old_n); n=load('new-'+new_n)
    if not o or not n: report.append((old_n,new_n,['MISSING capture: '+('old ' if not o else '')+('new' if not n else '')],[],[])); continue
    zo=o['z']
    for e in o['els']:
        for a in ('x','y','w','h'): e[a]=round(e[a]*zo)
    o['s']={a:round(v*zo) for a,v in o['s'].items()}
    om={(e['key'],e['i']):e for e in o['els']}; nm={(e['key'],e['i']):e for e in n['els']}
    skip=lambda k: k[0].startswith('div.demobar') or k[0].startswith('button.demo') or k[0].startswith('span.spothand')
    om={k:v for k,v in om.items() if not skip(k)}; nm={k:v for k,v in nm.items() if not skip(k)}
    diffs=[]; missing=[k for k in om if k not in nm]; extra=[k for k in nm if k not in om]
    for k,e in om.items():
        if k not in nm: continue
        f=nm[k]; d=[]
        for a in ('x','y','w','h'):
            if abs(e[a]-f[a])>TOL: d.append(f"{a} {e[a]}→{f[a]}")
        if e['text']!=f['text']: d.append(f"text “{e['text']}”→“{f['text']}”")
        hastext=bool(e['text'] or f['text'])
        for a in (('fw','color','ff','fs') if hastext else ()):
            if e[a]!=f[a]:
                if a=='fs':
                    try:
                        ov=float(re.sub('[^0-9.]','',e[a]) or 0); nv=float(re.sub('[^0-9.]','',f[a]) or 0)
                        if abs(ov-nv)>1.0: d.append(f"fs {ov:.1f}→{nv:.1f}")
                    except ValueError: pass
                else: d.append(f"{a} {e[a]}→{f[a]}")
        if e['bg']!=f['bg']: d.append(f"bg {e['bg']}→{f['bg']}")
        if e['br']!=f['br']: d.append(f"br {e['br']}→{f['br']}")
        if d: diffs.append(f"{k[0]}#{k[1]}: "+'; '.join(d))
    clips=(o['clips'],n['clips'])
    report.append((old_n,new_n,diffs,missing,extra,clips,(o['s'],n['s'],o['z'],n['z'])))
tot=0
for r in report:
    old_n,new_n=r[0],r[1]
    if len(r)==5: print(f"\n### {old_n} ↔ {new_n}: {r[2]}"); continue
    diffs,missing,extra,clips,meta=r[2],r[3],r[4],r[5],r[6]
    print(f"\n### {old_n} ↔ {new_n}   screen old {meta[0]} z{meta[2]} | new {meta[1]} z{meta[3]}")
    print("  clips old:", clips[0], "| new:", clips[1], "" if clips[0]==clips[1] else "  <<< DIFFERENT")
    for m in missing: print("  MISSING in new:", m)
    for m in extra: print("  EXTRA in new:", m)
    for d in diffs: print("  ", d)
    tot+=len(diffs)+len(missing)+len(extra)
print("\nTOTAL element differences:", tot)
