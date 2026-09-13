#!/usr/bin/env python3
"""Kratu Script — what Laila (and the app voice) says on each screen, in order, with play and a remove toggle.

  python3 tools/build_script_review.py   → kratu-script.artifact.html

Word and letter clips (app_wha_/app_wen_/app_en_/wha_/wen_) are content, not script, and are left out.
Boy/girl pairs (_m/_f) are one line with two play buttons. Marks stay in the browser; the removed list is JSON to paste back.
"""
import re, json, html, pathlib

R = pathlib.Path(__file__).resolve().parent.parent
h = open(R / 'kratu-login.artifact.html', encoding='utf-8').read()
i = h.index('const KRATU_AUDIO='); seg = h[i:h.index('};', i) + 1]
audio = dict(re.findall(r'"([A-Za-z0-9_]+)": "(data:audio/[a-z]+;base64,[A-Za-z0-9+/=]+)"', seg))
HA = json.load(open(R / 'tools' / 'live_texts.json', encoding='utf-8'))
EN = json.load(open(R / 'tools' / 'clip_en.json', encoding='utf-8'))
man = json.load(open(R / 'tools' / 'clips_manifest.json', encoding='utf-8'))
for k, v in man.items():
    if isinstance(v, dict) and v.get('text'): HA.setdefault(k, v['text'])

blocks = re.findall(r'<div class="block" data-au="([^"]*)">\s*<div class="tags"><span class="st[^"]*">([^<]*)</span><span class="ti">([^<]*)</span>', h)
screens = []
for au, st, ti in blocks:
    keys = [k.strip() for k in au.split(',') if k.strip()]
    screens.append((st.strip(), html.unescape(ti).strip(), keys))
def num(s):
    m = re.search(r'\d+', s); return int(m.group()) if m else 99
screens.sort(key=lambda s: (num(s[0]) if 'Misali' not in s[1] else 100 + num(s[0])))

SKIP = re.compile(r'^(app_wha_|app_wen_|app_en_|wha_|wen_|sx_w_)')
def base(k): return re.sub(r'_(m|f)$', '', k)
def is_m(k): return k.endswith('_m')
def is_f(k): return k.endswith('_f')

seen_global = {}
sections, used_audio = [], {}
for st, ti, keys in screens:
    rows, done = [], set()
    for k in keys:
        if SKIP.match(k) or k not in audio: continue
        b = base(k)
        if b in done: continue
        done.add(b)
        km = b + '_m' if (b + '_m') in audio else None
        kf = b + '_f' if (b + '_f') in audio else None
        ku = b if b in audio else None
        text_ha = HA.get(km or ku or kf or b) or HA.get(b) or ''
        text_en = EN.get(km or ku or kf or b) or EN.get(b) or ''
        if not text_ha and not text_en: text_ha = '(no text on file)'
        elsewhere = seen_global.setdefault(b, [])
        also = (' <em>also on ' + ', '.join(elsewhere) + '</em>') if elsewhere else ''
        elsewhere.append(st)
        btns = []
        for label, key in (('▶ boy', km), ('▶ girl', kf), ('▶ play', ku)):
            if key: used_audio[key] = audio[key]; btns.append('<button class="play" data-a="%s">%s</button>' % (key, label))
        who = 'app' if b.startswith('app_') else ('sample' if b.startswith('sx_') else 'laila')
        rows.append('<div class="line %s" data-k="%s"><button class="rm" title="Cire · remove">✕</button><div class="tx"><b>%s</b><span>%s</span><small><code>%s</code> · %s%s</small></div><div class="pl">%s</div></div>'
                    % (who, html.escape(b), html.escape(text_ha), html.escape(text_en), html.escape(b), who, also, ''.join(btns)))
    if rows:
        sections.append('<section><h2>%s <small>%s</small></h2>%s</section>' % (html.escape(st), html.escape(ti), ''.join(rows)))

total = sum(s.count('class="line') for s in sections)
page = r'''<title>Kratu Script</title>
<style>
:root{color-scheme:light;--bg:#f6ecd6;--card:#fbf4e3;--ink:#2b2418;--muted:#6b5f4c;--line:#e3d4b4;--red:#e0474b;--teal:#18a39b;--gold:#f2b32c;--purple:#8657d6}
html{background:#f6ecd6}body{margin:0;background:var(--bg);background-image:radial-gradient(#e2d3b3 1px,transparent 1.2px);background-size:22px 22px;color:var(--ink);font-family:Nunito,"Segoe UI",Helvetica,Arial,sans-serif;font-size:15px}
.wrap{max-width:1000px;margin:0 auto;padding:28px 22px 80px}
h1{font-family:Fredoka,Nunito,Arial,sans-serif;font-size:34px;margin:0 0 4px}h2{font-family:Fredoka,Nunito,Arial,sans-serif;font-size:21px;margin:34px 0 10px}h2 small{display:block;color:var(--muted);font-size:13.5px;font-weight:400;font-family:Nunito,sans-serif}
.lede{color:var(--muted);max-width:72ch;margin:0 0 14px}
.bar{position:sticky;top:0;z-index:5;background:rgba(246,236,214,.96);backdrop-filter:blur(6px);border-bottom:1px solid var(--line);padding:10px 0;display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.bar b{font-family:Fredoka,sans-serif}.bar button{border-radius:10px;padding:8px 12px;font:700 13px inherit;cursor:pointer;background:#fff;border:1px solid var(--line)}
.bar input{border:1px solid var(--line);border-radius:10px;padding:8px 10px;font:inherit;min-width:220px}
.line{position:relative;display:grid;grid-template-columns:34px 1fr auto;gap:10px;align-items:center;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:10px 12px;margin:8px 0;transition:opacity .2s}
.line .tx b{display:block;font-family:Fredoka,Nunito,sans-serif;font-weight:600;font-size:17px}.line .tx span{display:block;color:var(--muted)}.line .tx small{display:block;color:var(--muted);font-size:12px;margin-top:3px}.line .tx code{font-family:ui-monospace,Menlo,monospace;font-size:11.5px;background:#f3e6c9;padding:1px 5px;border-radius:5px}.line .tx em{color:var(--purple);font-style:normal}
.line.app .tx b{color:var(--teal)}.line.sample .tx b{color:var(--purple)}
.line .pl{display:flex;gap:6px}.line .play{border:0;border-radius:8px;padding:7px 10px;font:700 12px inherit;background:var(--teal);color:#fff;cursor:pointer;white-space:nowrap}.line .play.on{background:var(--gold);color:#3a2a00}
.line .rm{width:28px;height:28px;border-radius:50%;border:0;background:#fff;color:var(--red);font-weight:900;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.15)}
.line.gone{opacity:.4}.line.gone .rm{background:var(--red);color:#fff}.line.gone .tx b{text-decoration:line-through}
.hidegone .line.gone{display:none}.hidden{display:none}
textarea{width:100%;min-height:90px;border:1px solid var(--line);border-radius:10px;padding:10px;font:13px ui-monospace,Menlo,monospace;background:#fff}
.legend{display:flex;gap:14px;font-size:13px;color:var(--muted)}.legend i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:5px}
</style>
<div class="wrap">
<h1>Kratu Script</h1>
<p class="lede">Everything said on each screen, in the order the screen uses it: __TOTAL__ lines. A line with a boy and a girl form is one row with two play buttons. Press ✕ on a line you do not want; press again to keep it. Marks stay in this browser; copy the list at the bottom and send it to me. Word and letter clips are not here, only what Laila and the app say.</p>
<div class="legend"><span><i style="background:#2b2418"></i>Laila</span><span><i style="background:#18a39b"></i>app voice</span><span><i style="background:#8657d6"></i>sample (misali)</span></div>
<div class="bar"><b id="count">0 removed</b><input id="q" placeholder="Nema · search a line"><button id="toggleGone">Hide removed</button><button id="stopAll">■ Stop sound</button><button id="clearAll">Clear all marks</button></div>
__SECTIONS__
<h2>Jerin da aka cire · removed list</h2>
<p class="lede">Copy this and paste it back to me; I take those lines out of the app.</p>
<textarea id="out" readonly></textarea>
</div>
<script>
var AUDIO=__AUDIO__; var KEY='kratu_script_removed'; var cur=null;
function load(){ try{ return JSON.parse(localStorage.getItem(KEY)||'[]'); }catch(e){ return []; } }
function save(list){ try{ localStorage.setItem(KEY, JSON.stringify(list)); }catch(e){} render(list); }
function render(list){ document.querySelectorAll('.line').forEach(function(c){ c.classList.toggle('gone', list.indexOf(c.dataset.k)>=0); }); document.getElementById('count').textContent=list.length+' removed'; document.getElementById('out').value=JSON.stringify(list); }
document.addEventListener('click', function(e){ var rm=e.target.closest('.rm'); if(rm){ var k=rm.closest('.line').dataset.k, l=load(), i=l.indexOf(k); if(i>=0) l.splice(i,1); else l.push(k); save(l); return; }
  var pb=e.target.closest('.play'); if(pb){ stop(); var a=new Audio(AUDIO[pb.dataset.a]); cur={a:a,b:pb}; pb.classList.add('on'); a.onended=function(){ pb.classList.remove('on'); cur=null; }; a.play().catch(function(){ pb.classList.remove('on'); }); } });
function stop(){ if(cur){ try{ cur.a.pause(); }catch(e){} cur.b.classList.remove('on'); cur=null; } }
document.getElementById('stopAll').onclick=stop;
document.getElementById('clearAll').onclick=function(){ if(confirm('Clear every mark?')) save([]); };
document.getElementById('toggleGone').onclick=function(){ document.body.classList.toggle('hidegone'); this.textContent=document.body.classList.contains('hidegone')?'Show removed':'Hide removed'; };
document.getElementById('q').addEventListener('input', function(){ var q=this.value.trim().toLowerCase(); document.querySelectorAll('.line').forEach(function(c){ c.classList.toggle('hidden', !!q && c.textContent.toLowerCase().indexOf(q)<0); }); });
render(load());
</script>
'''.replace('__TOTAL__', str(total)).replace('__SECTIONS__', ''.join(sections)).replace('__AUDIO__', json.dumps(used_audio))
(R / 'kratu-script.artifact.html').write_text(page, encoding='utf-8')
print('screens', len(sections), 'lines', total, 'clips', len(used_audio), 'MB', round(len(page) / 1e6, 2))
