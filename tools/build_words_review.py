#!/usr/bin/env python3
"""Kratu Words — every example word the app can teach, with its picture and its two clips, and a remove toggle.

  python3 tools/build_words_review.py   → kratu-words.artifact.html

Sani marks words to drop; the page keeps the marks in the browser and shows the list of dropped keys as JSON
to paste back. Applying the list is done with tools/apply_word_removals.py (keys → removed from kratu_words_all.json).
"""
import json, html, pathlib

R = pathlib.Path(__file__).resolve().parent.parent
W = json.load(open(R / 'tools' / 'kratu_words_all.json', encoding='utf-8'))
EN = json.load(open(R / 'tools' / 'clip_en.json', encoding='utf-8'))

LABEL = {'animals': 'Dabbobi · Animals', 'food': 'Abinci · Food', 'home': 'Gida · Home', 'body': 'Jiki · Body', 'nature': 'Yanayi · Nature',
         'vehicles': 'Motoci · Vehicles', 'people': 'Mutane · People', 'actions': 'Ayyuka · Actions', 'clothing': 'Tufafi · Clothing',
         'school': 'Makaranta · School', 'numbers': 'Lambobi · Numbers', 'lambobi_palms': 'Lambobi · palms (1–10)',
         'lambobi_symbols': 'Lambobi · symbols', 'lambobi_tens': 'Lambobi · tens', 'lambobi_hundreds': 'Lambobi · hundreds'}

cards, audio, total = [], {}, 0
for cat, items in W.items():
    rows = []
    for w in items:
        k = w['k']; total += 1
        if w.get('wha'): audio['ha_' + k] = w['wha']
        if w.get('wen'): audio['en_' + k] = w['wen']
        img = w.get('img') or ''
        rows.append(
            '<div class="card" data-k="%s" data-cat="%s">'
            '<button class="rm" title="Cire · remove">✕</button>'
            '%s'
            '<div class="t"><b>%s</b><span>%s</span></div>'
            '<div class="pl"><button class="play" data-a="ha_%s" %s>▶ Hausa</button><button class="play" data-a="en_%s" %s>▶ English</button></div>'
            '</div>' % (html.escape(k), html.escape(cat),
                        ('<img src="%s" alt="">' % img) if img else '<div class="noimg">no picture</div>',
                        html.escape(str(w.get('ha', ''))), html.escape(str(w.get('en', ''))),
                        html.escape(k), '' if w.get('wha') else 'disabled', html.escape(k), '' if w.get('wen') else 'disabled'))
    cards.append('<section data-cat="%s"><h2>%s <small>%d</small></h2><div class="grid">%s</div></section>' % (html.escape(cat), LABEL.get(cat, cat), len(items), ''.join(rows)))

page = r'''<title>Kratu Words</title>
<style>
:root{color-scheme:light;--bg:#f6ecd6;--card:#fbf4e3;--ink:#2b2418;--muted:#6b5f4c;--line:#e3d4b4;--red:#e0474b;--teal:#18a39b;--gold:#f2b32c}
html{background:#f6ecd6}body{margin:0;background:var(--bg);background-image:radial-gradient(#e2d3b3 1px,transparent 1.2px);background-size:22px 22px;color:var(--ink);font-family:Nunito,"Segoe UI",Helvetica,Arial,sans-serif;font-size:15px}
.wrap{max-width:1180px;margin:0 auto;padding:28px 22px 80px}
h1{font-family:Fredoka,Nunito,Arial,sans-serif;font-size:34px;margin:0 0 4px}h2{font-family:Fredoka,Nunito,Arial,sans-serif;font-size:22px;margin:30px 0 10px}h2 small{color:var(--muted);font-size:14px;font-weight:400}
.lede{color:var(--muted);max-width:70ch;margin:0 0 14px}
.bar{position:sticky;top:0;z-index:5;background:rgba(246,236,214,.96);backdrop-filter:blur(6px);border-bottom:1px solid var(--line);padding:10px 0;display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.bar b{font-family:Fredoka,sans-serif}.bar button{border:0;border-radius:10px;padding:8px 12px;font:700 13px inherit;cursor:pointer;background:#fff;border:1px solid var(--line)}
.bar input{border:1px solid var(--line);border-radius:10px;padding:8px 10px;font:inherit;min-width:220px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
.card{position:relative;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:8px;display:flex;flex-direction:column;gap:6px;transition:opacity .2s}
.card img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:10px;background:#fff}.card .noimg{aspect-ratio:1;display:grid;place-items:center;border-radius:10px;background:#fff;color:var(--muted);font-size:12px}
.card .t b{display:block;font-size:15px}.card .t span{color:var(--muted);font-size:13px}
.card .pl{display:flex;gap:6px}.card .play{flex:1;border:0;border-radius:8px;padding:6px 0;font:700 12px inherit;background:var(--teal);color:#fff;cursor:pointer}.card .play[disabled]{background:#ddd;color:#888}.card .play.on{background:var(--gold);color:#3a2a00}
.card .rm{position:absolute;top:6px;right:6px;width:26px;height:26px;border-radius:50%;border:0;background:#fff;color:var(--red);font-weight:900;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.15)}
.card.gone{opacity:.35}.card.gone .rm{background:var(--red);color:#fff}.card.gone::after{content:"cire · removed";position:absolute;left:8px;top:8px;background:var(--red);color:#fff;font-size:11px;font-weight:800;padding:2px 7px;border-radius:999px}
.hidegone .card.gone{display:none}
textarea{width:100%;min-height:90px;border:1px solid var(--line);border-radius:10px;padding:10px;font:13px ui-monospace,Menlo,monospace;background:#fff}
.hidden{display:none}
</style>
<div class="wrap">
<h1>Kratu Words</h1>
<p class="lede">Every example word the app can teach: __TOTAL__ words in __GROUPS__ groups, each with its picture, its Hausa clip and its English clip. Press ✕ on a word you do not want; press again to keep it. Your marks stay in this browser. When you are done, copy the list at the bottom and send it to me.</p>
<div class="bar"><b id="count">0 removed</b><input id="q" placeholder="Nema · search a word"><button id="toggleGone">Hide removed</button><button id="stopAll">■ Stop sound</button><button id="clearAll">Clear all marks</button></div>
__CARDS__
<h2>Jerin da aka cire · removed list</h2>
<p class="lede">Copy this and paste it back to me; I apply it to the app.</p>
<textarea id="out" readonly></textarea>
</div>
<script>
var AUDIO=__AUDIO__; var KEY='kratu_words_removed'; var cur=null;
function load(){ try{ return JSON.parse(localStorage.getItem(KEY)||'[]'); }catch(e){ return []; } }
function save(list){ try{ localStorage.setItem(KEY, JSON.stringify(list)); }catch(e){} render(list); }
function render(list){ document.querySelectorAll('.card').forEach(function(c){ c.classList.toggle('gone', list.indexOf(c.dataset.k)>=0); }); document.getElementById('count').textContent=list.length+' removed'; document.getElementById('out').value=JSON.stringify(list); }
document.addEventListener('click', function(e){ var rm=e.target.closest('.rm'); if(rm){ var k=rm.closest('.card').dataset.k, l=load(), i=l.indexOf(k); if(i>=0) l.splice(i,1); else l.push(k); save(l); return; }
  var pb=e.target.closest('.play'); if(pb&&!pb.disabled){ stop(); var a=new Audio(AUDIO[pb.dataset.a]); cur={a:a,b:pb}; pb.classList.add('on'); a.onended=function(){ pb.classList.remove('on'); cur=null; }; a.play().catch(function(){ pb.classList.remove('on'); }); } });
function stop(){ if(cur){ try{ cur.a.pause(); }catch(e){} cur.b.classList.remove('on'); cur=null; } }
document.getElementById('stopAll').onclick=stop;
document.getElementById('clearAll').onclick=function(){ if(confirm('Clear every mark?')) save([]); };
document.getElementById('toggleGone').onclick=function(){ document.body.classList.toggle('hidegone'); this.textContent=document.body.classList.contains('hidegone')?'Show removed':'Hide removed'; };
document.getElementById('q').addEventListener('input', function(){ var q=this.value.trim().toLowerCase(); document.querySelectorAll('.card').forEach(function(c){ c.classList.toggle('hidden', !!q && c.textContent.toLowerCase().indexOf(q)<0 && c.dataset.k.indexOf(q)<0); }); });
render(load());
</script>
'''.replace('__TOTAL__', str(total)).replace('__GROUPS__', str(len(W))).replace('__CARDS__', ''.join(cards)).replace('__AUDIO__', json.dumps(audio))
out = R / 'kratu-words.artifact.html'
out.write_text(page, encoding='utf-8')
print('words', total, 'groups', len(W), 'clips', len(audio), 'MB', round(len(page) / 1e6, 2))
