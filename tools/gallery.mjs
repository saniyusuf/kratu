// A page for reviewing the pictures, big, with comments and choices.  node tools/gallery.mjs → http://localhost:4210 (local only)
//   Compare   every picture that has a version per language: the old one and the Hausa, Yoruba, Igbo and Swahili ones side by
//             side; pick one to use for every language, or keep one each, and comment on the row.
//   Shared / Hausa / Yoruba / Igbo / Swahili   each set beside the picture it replaces.
// Choices and comments are saved to tools/.genimg/review.json; "Copy as JSON" puts them on the clipboard to paste into the chat.
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, existsSync, statSync, mkdirSync, createReadStream } from 'node:fs';
import { extname, normalize } from 'node:path';

const PORT = 4210, STORE = 'tools/.genimg/review.json';
const SETS = [['shared', 'Shared'], ['ha', 'Hausa'], ['yo', 'Yoruba'], ['ig', 'Igbo'], ['sw', 'Swahili']];
const LANGS = SETS.slice(1);
const W = Object.fromEntries(JSON.parse(readFileSync('content/words.json', 'utf8')).words.map((w) => [w.key, w]));
mkdirSync('tools/.genimg', { recursive: true });
const store = () => (existsSync(STORE) ? JSON.parse(readFileSync(STORE, 'utf8')) : { comments: {}, choices: {} });
const prompts = (s) => (existsSync(`content/pictures/${s}.json`) ? JSON.parse(readFileSync(`content/pictures/${s}.json`, 'utf8')) : {});
const pic = (s, k) => {
  // a word that moves shows its loop (tools/.genvid/small, as installed in the app) instead of its still
  const loop = `tools/.genvid/small/${k}.webp`; if (s === 'shared' && existsSync(loop)) return `/${loop}?${Math.round(statSync(loop).mtimeMs)}`;
  const f = `tools/.hedra-${s}/${k}.png`; return existsSync(f) ? `/${f}?${Math.round(statSync(f).mtimeMs)}` : null;
};
/** The picture each word had before the redraw (tools/.genimg/old holds the ones it replaced). */
const old = (k) => { const w = W[k]; if (existsSync(`tools/.genimg/old/${k}.webp`)) return `/tools/.genimg/old/${k}.webp`; return w && typeof w.picture === 'string' ? '/public/assets/' + w.picture : null; };

function data() {
  const st = store(), sets = SETS.map(([code, name]) => {
    const p = prompts(code);
    const items = Object.keys(p).filter((k) => pic(code, k)).map((k) => ({ key: k, en: (W[k] || {}).en || '', mine: pic(code, k), old: old(k), prompt: p[k], comments: st.comments[code + '/' + k] || [] }));
    return { code, name, total: Object.keys(p).length, items };
  });
  const keys = [...new Set(LANGS.flatMap(([c]) => Object.keys(prompts(c))))].filter((k) => LANGS.some(([c]) => pic(c, k)));
  const compare = keys.map((k) => ({ key: k, en: (W[k] || {}).en || '', old: old(k), versions: Object.fromEntries(LANGS.map(([c]) => [c, pic(c, k)])), choice: st.choices[k] || 'each', comments: st.comments['compare/' + k] || [] }));
  return { sets, compare, langs: LANGS };
}

const TYPES = { '.png': 'image/png', '.webp': 'image/webp', '.html': 'text/html; charset=utf-8', '.json': 'application/json' };
const body = (req) => new Promise((res, rej) => { let b = ''; req.on('data', (d) => { b += d; if (b.length > 20000) req.destroy(); }); req.on('end', () => { try { res(JSON.parse(b)); } catch (e) { rej(e); } }); });
const json = (res, v, code = 200) => { res.writeHead(code, { 'content-type': TYPES['.json'], 'cache-control': 'no-store' }); res.end(JSON.stringify(v)); };
createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/') { res.writeHead(200, { 'content-type': TYPES['.html'] }); res.end(PAGE); return; }
  if (url.pathname === '/data.json') return json(res, data());
  if (req.method === 'POST' && (url.pathname === '/comment' || url.pathname === '/choose')) {
    try {
      const b = await body(req), st = store();
      if (!/^[a-z0-9_]+$/.test(b.key || '')) throw new Error('key');
      if (url.pathname === '/comment') {
        if (!['compare', ...SETS.map(([c]) => c)].includes(b.set) || !String(b.text || '').trim()) throw new Error('bad');
        (st.comments[b.set + '/' + b.key] ||= []).push({ text: String(b.text).trim().slice(0, 2000), at: new Date().toISOString() });
      } else {
        if (!['each', 'old', ...LANGS.map(([c]) => c)].includes(b.pick)) throw new Error('pick');
        if (b.pick === 'each') delete st.choices[b.key]; else st.choices[b.key] = b.pick;
      }
      writeFileSync(STORE, JSON.stringify(st, null, 1)); return json(res, { ok: true });
    } catch { return json(res, { ok: false }, 400); }
  }
  const p = normalize(decodeURIComponent(url.pathname)).replace(/^\/+/, '');
  if (!/^(tools\/\.hedra-(shared|ha|yo|ig|sw)|tools\/\.genimg\/old|tools\/\.genvid\/small|public\/assets\/pictures)\/[a-z0-9_]+\.(png|webp)$/.test(p) || !existsSync(p)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPES[extname(p)], 'cache-control': 'max-age=60' }); createReadStream(p).pipe(res);
}).listen(PORT, '127.0.0.1', () => console.log('gallery on http://localhost:' + PORT));

const PAGE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Picture review</title>
<style>
:root{color-scheme:light;--bg:#fbf7ee;--ink:#2b2318;--soft:#7a6d5c;--card:#fff;--line:#e9e1d2;--accent:#0f766e;--pick:#f59e0b}
*{box-sizing:border-box}body{margin:0;padding:20px 16px;background:var(--bg);color:var(--ink);font:15px/1.45 system-ui,sans-serif}
h1{margin:0 0 4px;font-size:24px}h2{margin:22px 0 4px}.soft{color:var(--soft)}
.tabs{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.tabs button,.btn{border:1px solid var(--line);background:#fff;border-radius:999px;padding:6px 14px;font:inherit;cursor:pointer}
.tabs button.on{background:var(--accent);color:#fff;border-color:var(--accent)}.send{background:var(--accent);color:#fff;border:0;border-radius:8px;padding:8px 14px;font:inherit;cursor:pointer}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px}
figure{margin:0;background:var(--card);border-radius:12px;padding:10px;box-shadow:0 1px 3px #0001}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:6px}img.t{width:100%;aspect-ratio:1;object-fit:cover;border-radius:8px;background:#eee;cursor:zoom-in;display:block}
.none{display:grid;place-items:center;aspect-ratio:1;background:#f1ece2;border-radius:8px;color:var(--soft);font-size:13px}
figcaption{margin-top:6px;display:flex;justify-content:space-between;gap:8px}.badge{background:#fdecc8;color:#7a4b00;border-radius:999px;padding:0 8px;font-size:12px;white-space:nowrap}
.row{background:var(--card);border-radius:12px;padding:12px;box-shadow:0 1px 3px #0001;margin-bottom:14px}
.row h3{margin:0 0 8px;font-size:17px}.cols{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}
.col{border:3px solid transparent;border-radius:12px;padding:4px}.col.chosen{border-color:var(--pick);background:#fff8e6}
.col .lab{font-size:13px;color:var(--soft);margin:4px 0}.col label,.opts label{display:flex;gap:6px;align-items:center;font-size:13px;cursor:pointer;margin-top:4px}
.opts{margin:8px 0}
textarea{width:100%;min-height:48px;font:inherit;padding:8px;border:1px solid var(--line);border-radius:8px;margin-top:6px}
.c{background:#fff;border:1px solid var(--line);border-radius:8px;padding:6px 8px;margin-top:6px;font-size:14px}.c small{color:var(--soft)}
#big{position:fixed;inset:0;background:#fbf7eef5;display:none;overflow:auto;padding:16px}#big.on{display:block}#big img{max-width:100%;max-height:88vh;display:block;margin:0 auto;border-radius:12px}
#big .bar{display:flex;justify-content:space-between;max-width:1100px;margin:0 auto 10px}
@media (max-width:760px){.cols{grid-template-columns:repeat(2,minmax(0,1fr))}}
</style></head><body>
<h1>Kratu · picture review</h1>
<p class="soft">Compare: pick one picture to use for every language (it turns orange), or keep one per language, and comment on the row. Click any picture to see it big.</p>
<div class="tabs" id="tabs"></div>
<p><button class="send" id="copy">📋 Copy choices and comments as JSON</button> <span class="soft" id="copied"></span></p><textarea id="copybox" readonly style="display:none;min-height:160px"></textarea>
<div id="list"></div>
<div id="big"><div class="bar"><b id="btitle"></b><button class="btn" id="close">close ✕</button></div><img id="bimg" alt=""></div>
<script>
let D=null,tab=localStorage.getItem('tab3')||'compare';
const $=(id)=>document.getElementById(id), esc=(s)=>String(s).replace(/[&<>"]/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
const img=(src,title)=>src?'<img class="t" loading="lazy" src="'+src+'" data-title="'+esc(title)+'">':'<span class="none">none</span>';
const comm=(cs)=>cs.map(c=>'<div class="c">'+esc(c.text)+' <small>· '+new Date(c.at).toLocaleString()+'</small></div>').join('');
async function load(){ const keep=[...document.querySelectorAll('textarea[data-id]')].map(t=>[t.dataset.id,t.value]); try{ D=await (await fetch('/data.json')).json(); }catch{ return; } draw(); for(const [id,v] of keep){ const t=document.querySelector('textarea[data-id="'+id+'"]'); if(t) t.value=v; } }
function draw(){
  $('tabs').innerHTML=['<button data-t="compare" class="'+(tab==='compare'?'on':'')+'">Compare · '+D.compare.length+'</button>'].concat(D.sets.map(s=>'<button data-t="'+s.code+'" class="'+(tab===s.code?'on':'')+'">'+s.name+' · '+s.items.length+'/'+s.total+'</button>')).join('');
  if(tab==='compare'){
    $('list').innerHTML=D.compare.map(r=>{
      const cols=[['old','Before (Hausa today)',r.old]].concat(D.langs.map(([c,n])=>[c,n,r.versions[c]]));
      return '<div class="row"><h3>'+esc(r.key)+' · '+esc(r.en)+(r.comments.length?' <span class="badge">💬 '+r.comments.length+'</span>':'')+'</h3><div class="cols">'+cols.map(([c,n,src])=>'<div class="col'+(r.choice===c?' chosen':'')+'"><div class="lab">'+n+'</div>'+img(src,r.key+' · '+n)+(src?'<label><input type="radio" name="p_'+r.key+'" value="'+c+'"'+(r.choice===c?' checked':'')+' data-key="'+r.key+'"> use this for all</label>':'')+'</div>').join('')+'</div>'
        +'<div class="opts"><label><input type="radio" name="p_'+r.key+'" value="each"'+(r.choice==='each'?' checked':'')+' data-key="'+r.key+'"> keep one per language</label></div>'
        +comm(r.comments)+'<textarea data-id="compare/'+r.key+'" placeholder="Comment on '+esc(r.key)+'…"></textarea><button class="btn" data-save="compare/'+r.key+'">Save comment</button></div>';
    }).join('');
  } else {
    const S=D.sets.find(s=>s.code===tab);
    $('list').innerHTML='<h2>'+S.name+' <span class="soft">left: the picture before · right: the new one</span></h2><div class="grid">'+S.items.map(it=>'<figure><div class="pair">'+img(it.old,it.key+' · before')+img(it.mine,it.key+' · new '+S.name)+'</div><figcaption><span><b>'+esc(it.key)+'</b> · '+esc(it.en)+'</span>'+(it.comments.length?'<span class="badge">💬 '+it.comments.length+'</span>':'')+'</figcaption>'+comm(it.comments)+'<textarea data-id="'+S.code+'/'+it.key+'" placeholder="Comment…"></textarea><button class="btn" data-save="'+S.code+'/'+it.key+'">Save comment</button></figure>').join('')+'</div>';
  }
}
$('tabs').onclick=(e)=>{ const b=e.target.closest('button'); if(!b) return; tab=b.dataset.t; try{localStorage.setItem('tab3',tab)}catch{} draw(); };
$('list').onclick=async(e)=>{
  const im=e.target.closest('img.t'); if(im){ $('bimg').src=im.src; $('btitle').textContent=im.dataset.title; $('big').classList.add('on'); return; }
  const sv=e.target.closest('[data-save]'); if(sv){ const id=sv.dataset.save, [set,key]=id.split('/'); const t=document.querySelector('textarea[data-id="'+id+'"]'); const text=t.value.trim(); if(!text) return; const r=await fetch('/comment',{method:'POST',body:JSON.stringify({set,key,text})}); if(r.ok){ t.value=''; load(); } else alert('Could not save'); }
};
$('list').onchange=async(e)=>{ const r=e.target; if(r.type!=='radio') return; await fetch('/choose',{method:'POST',body:JSON.stringify({key:r.dataset.key,pick:r.value})}); load(); };
$('close').onclick=()=>$('big').classList.remove('on'); document.onkeydown=(e)=>{ if(e.key==='Escape') $('close').onclick(); };
$('copy').onclick=async()=>{
  const choices=D.compare.filter(r=>r.choice!=='each').map(r=>({key:r.key,word:r.en,use_for_all:r.choice}));
  const comments=[]; for(const r of D.compare) for(const c of r.comments) comments.push({where:'compare',key:r.key,word:r.en,comment:c.text});
  for(const S of D.sets) for(const it of S.items) for(const c of it.comments) comments.push({where:S.name,key:it.key,word:it.en,comment:c.text});
  const txt=JSON.stringify({picture_review:{choices,comments}},null,1); let ok=false; try{ await navigator.clipboard.writeText(txt); ok=true; }catch{}
  const box=$('copybox'); box.value=txt; box.style.display=ok?'none':'block'; if(!ok){ box.focus(); box.select(); }
  $('copied').textContent=ok?(choices.length+' choices and '+comments.length+' comments copied — paste them in the chat.'):'Select all in the box below and copy.';
};
load(); setInterval(load,60000);
</script></body></html>`;
