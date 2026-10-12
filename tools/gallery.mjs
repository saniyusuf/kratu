// A page for looking at the demo languages' own pictures beside the shared Hausa ones, big, with comments.
//   node tools/gallery.mjs            → http://localhost:4210  (local only; comments are saved to tools/.genimg/comments.json)
// New pictures appear on their own (the page asks for the list every minute); a comment stays with its picture.
import { createServer } from 'node:http';
import { readFileSync, readdirSync, writeFileSync, existsSync, statSync, mkdirSync, createReadStream } from 'node:fs';
import { extname, normalize } from 'node:path';

const PORT = 4210, COMMENTS = 'tools/.genimg/comments.json';
const LANGS = [['yo', 'Yoruba'], ['ig', 'Igbo'], ['sw', 'Swahili']];
const W = Object.fromEntries(JSON.parse(readFileSync('content/words.json', 'utf8')).words.map((w) => [w.key, w]));
mkdirSync('tools/.genimg', { recursive: true });
const comments = () => (existsSync(COMMENTS) ? JSON.parse(readFileSync(COMMENTS, 'utf8')) : {});

function data() {
  const c = comments();
  return LANGS.map(([code, name]) => {
    const pf = `content/langs/${code}/image_prompts.json`, prompts = existsSync(pf) ? JSON.parse(readFileSync(pf, 'utf8')) : {};
    const dir = `tools/.genimg-${code}`, have = existsSync(dir) ? new Set(readdirSync(dir).filter((f) => f.endsWith('.png')).map((f) => f.slice(0, -4))) : new Set();
    const items = Object.keys(prompts).filter((k) => have.has(k)).map((k) => {
      const w = W[k] || {}, t = statSync(`${dir}/${k}.png`).mtimeMs;
      return { key: k, en: w.en || '', at: t, mine: `/${dir}/${k}.png?${Math.round(t)}`, shared: typeof w.picture === 'string' ? '/public/assets/' + w.picture : null, prompt: prompts[k], comments: c[code + '/' + k] || [] };
    }).sort((a, b) => b.at - a.at);
    return { code, name, total: Object.keys(prompts).length, items };
  });
}

const TYPES = { '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.html': 'text/html; charset=utf-8', '.json': 'application/json' };
createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/') { res.writeHead(200, { 'content-type': TYPES['.html'] }); res.end(PAGE); return; }
  if (url.pathname === '/data.json') { res.writeHead(200, { 'content-type': TYPES['.json'], 'cache-control': 'no-store' }); res.end(JSON.stringify(data())); return; }
  if (url.pathname === '/comment' && req.method === 'POST') {
    let body = ''; req.on('data', (d) => { body += d; if (body.length > 20000) req.destroy(); });
    req.on('end', () => {
      try {
        const { lang, key, text } = JSON.parse(body); if (!LANGS.some(([c]) => c === lang) || !/^[a-z0-9_]+$/.test(key) || !String(text || '').trim()) throw new Error('bad');
        const c = comments(), id = lang + '/' + key; (c[id] ||= []).push({ text: String(text).trim().slice(0, 2000), at: new Date().toISOString() });
        writeFileSync(COMMENTS, JSON.stringify(c, null, 1)); res.writeHead(200, { 'content-type': TYPES['.json'] }); res.end(JSON.stringify(c[id]));
      } catch { res.writeHead(400); res.end('bad comment'); }
    });
    return;
  }
  // pictures only, from the folders this page shows
  const p = normalize(decodeURIComponent(url.pathname)).replace(/^\/+/, '');
  if (!/^(tools\/\.genimg-(yo|ig|sw)|public\/assets\/pictures)\/[a-z0-9_]+\.(png|webp)$/.test(p) || !existsSync(p)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPES[extname(p)], 'cache-control': 'max-age=60' }); createReadStream(p).pipe(res);
}).listen(PORT, '127.0.0.1', () => console.log('gallery on http://localhost:' + PORT));

const PAGE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Language pictures</title>
<style>
:root{color-scheme:light;--bg:#fbf7ee;--ink:#2b2318;--soft:#7a6d5c;--card:#fff;--line:#e9e1d2;--accent:#0f766e}
*{box-sizing:border-box}body{margin:0;padding:24px 16px;background:var(--bg);color:var(--ink);font:15px/1.45 system-ui,sans-serif}
h1{margin:0 0 4px;font-size:24px}h2{margin:28px 0 2px}.soft{color:var(--soft)}
.tabs{display:flex;gap:8px;margin:14px 0}.tabs button{border:1px solid var(--line);background:#fff;border-radius:999px;padding:6px 14px;font:inherit;cursor:pointer}.tabs button.on{background:var(--accent);color:#fff;border-color:var(--accent)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px}
figure{margin:0;background:var(--card);border-radius:12px;padding:10px;box-shadow:0 1px 3px #0001;cursor:zoom-in}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:6px}.pair img,.none{width:100%;aspect-ratio:1;object-fit:cover;border-radius:8px;background:#eee}
.none{display:grid;place-items:center;color:var(--soft);font-size:13px}
figcaption{margin-top:6px;display:flex;justify-content:space-between;gap:8px}.badge{background:#fdecc8;color:#7a4b00;border-radius:999px;padding:0 8px;font-size:12px;white-space:nowrap}
#big{position:fixed;inset:0;background:#fbf7eeF2;display:none;overflow:auto;padding:20px 16px}#big.on{display:block}
.bigwrap{max-width:1200px;margin:0 auto}.bigpair{display:grid;grid-template-columns:1fr 1fr;gap:12px}.bigpair img{width:100%;border-radius:12px;background:#eee}
.bigpair .lab{font-size:13px;color:var(--soft);margin-bottom:4px}
.bar{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:12px}.bar button{font:inherit;border:1px solid var(--line);background:#fff;border-radius:8px;padding:6px 12px;cursor:pointer}
textarea{width:100%;min-height:70px;font:inherit;padding:8px;border:1px solid var(--line);border-radius:8px}
.send{margin-top:6px;background:var(--accent);color:#fff;border:0;border-radius:8px;padding:8px 14px;font:inherit;cursor:pointer}
.c{background:#fff;border:1px solid var(--line);border-radius:8px;padding:8px;margin-top:6px}.c small{color:var(--soft)}
.prompt{font-size:12px;color:var(--soft);margin-top:10px}
@media (max-width:640px){.bigpair{grid-template-columns:1fr}}
</style></head><body>
<h1>Kratu · pictures for each language</h1><p class="soft">Left: the shared Hausa picture · right: the new one. Click a picture to see it big and leave a comment. New pictures appear on their own.</p>
<div class="tabs" id="tabs"></div><div id="list"></div>
<div id="big"><div class="bigwrap"><div class="bar"><b id="btitle"></b><span><button id="prev">← previous</button> <button id="next">next →</button> <button id="close">close ✕</button></span></div>
<div class="bigpair"><div><div class="lab">shared (Hausa)</div><img id="bshared" alt=""></div><div><div class="lab" id="blab"></div><img id="bmine" alt=""></div></div>
<h3>Comments</h3><div id="bcomments"></div><textarea id="btext" placeholder="What should change? e.g. 'wrong clothes', 'make her younger', 'perfect'"></textarea><button class="send" id="bsend">Save comment</button>
<p class="prompt" id="bprompt"></p></div></div>
<script>
let D=[],lang=localStorage.getItem('lang')||'yo',cur=null;
const $=(id)=>document.getElementById(id), esc=(s)=>String(s).replace(/[&<>"]/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
async function load(){ try{ D=await (await fetch('/data.json')).json(); }catch{ return; } draw(); if(cur) fill(); }
function draw(){
  $('tabs').innerHTML=D.map(l=>'<button class="'+(l.code===lang?'on':'')+'" data-l="'+l.code+'">'+l.name+' · '+l.items.length+'/'+l.total+'</button>').join('');
  const L=D.find(l=>l.code===lang); if(!L) return;
  $('list').innerHTML='<h2>'+L.name+' <span class="soft">'+L.items.length+' of '+L.total+' made · newest first</span></h2><div class="grid">'+L.items.map((it,i)=>'<figure data-i="'+i+'"><div class="pair">'+(it.shared?'<img loading="lazy" src="'+it.shared+'">':'<span class="none">no shared picture</span>')+'<img loading="lazy" src="'+it.mine+'"></div><figcaption><span><b>'+esc(it.key)+'</b> · '+esc(it.en)+'</span>'+(it.comments.length?'<span class="badge">💬 '+it.comments.length+'</span>':'')+'</figcaption></figure>').join('')+'</div>';
}
function items(){ return (D.find(l=>l.code===lang)||{items:[]}).items; }
function open(i){ cur={i,key:items()[i].key}; fill(); $('big').classList.add('on'); }
function fill(){ const its=items(); let i=its.findIndex(x=>x.key===cur.key); if(i<0) i=Math.min(cur.i,its.length-1); cur.i=i; const it=its[i]; if(!it) return;
  $('btitle').textContent=it.key+' · '+it.en; $('blab').textContent='new ('+(D.find(l=>l.code===lang).name)+')'; $('bmine').src=it.mine; $('bshared').src=it.shared||''; $('bshared').style.display=it.shared?'':'none';
  $('bcomments').innerHTML=it.comments.length?it.comments.map(c=>'<div class="c">'+esc(c.text)+'<br><small>'+new Date(c.at).toLocaleString()+'</small></div>').join(''):'<p class="soft">No comments yet.</p>'; $('bprompt').textContent='Prompt: '+it.prompt; }
function step(d){ const n=items().length; if(!n) return; cur.i=(cur.i+d+n)%n; cur.key=items()[cur.i].key; fill(); $('btext').value=''; }
$('tabs').onclick=(e)=>{ const b=e.target.closest('button'); if(!b) return; lang=b.dataset.l; try{localStorage.setItem('lang',lang)}catch{} draw(); };
$('list').onclick=(e)=>{ const f=e.target.closest('figure'); if(f) open(+f.dataset.i); };
$('close').onclick=()=>{ $('big').classList.remove('on'); cur=null; };
$('prev').onclick=()=>step(-1); $('next').onclick=()=>step(1);
document.onkeydown=(e)=>{ if(!cur||e.target.tagName==='TEXTAREA') return; if(e.key==='Escape') $('close').onclick(); if(e.key==='ArrowRight') step(1); if(e.key==='ArrowLeft') step(-1); };
$('bsend').onclick=async()=>{ const text=$('btext').value.trim(); if(!text||!cur) return; const r=await fetch('/comment',{method:'POST',body:JSON.stringify({lang,key:cur.key,text})}); if(r.ok){ $('btext').value=''; await load(); } else alert('Could not save the comment'); };
load(); setInterval(load,60000);
</script></body></html>`;
