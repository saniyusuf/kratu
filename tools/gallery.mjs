// A page to look at a demo language's own pictures beside the shared Hausa ones: tools/.genimg/gallery.html.
//   node tools/gallery.mjs [--watch]     (--watch rewrites it every minute while pictures are being made)
import { readFileSync, readdirSync, writeFileSync, existsSync, statSync } from 'node:fs';
const W = Object.fromEntries(JSON.parse(readFileSync('content/words.json', 'utf8')).words.map((w) => [w.key, w]));
const LANGS = [['yo', 'Yoruba'], ['ig', 'Igbo'], ['sw', 'Swahili']];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
function page() {
  const sections = LANGS.map(([code, name]) => {
    const want = existsSync(`content/langs/${code}/image_prompts.json`) ? Object.keys(JSON.parse(readFileSync(`content/langs/${code}/image_prompts.json`, 'utf8'))) : [];
    const dir = `tools/.genimg-${code}`, have = new Set(existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.png')).map((f) => f.slice(0, -4)) : []);
    const done = want.filter((k) => have.has(k)).sort((a, b) => statSync(`${dir}/${b}.png`).mtimeMs - statSync(`${dir}/${a}.png`).mtimeMs);
    const cards = done.map((k) => { const w = W[k] || {}, orig = typeof w.picture === 'string' ? '../../public/assets/' + w.picture : ''; return `<figure><div class="pair">${orig ? `<img src="${orig}" loading="lazy" title="shared (Hausa)">` : '<span class="none">no shared picture</span>'}<img src="../.genimg-${code}/${k}.png?${statSync(`${dir}/${k}.png`).mtimeMs}" loading="lazy" title="${esc(name)}"></div><figcaption><b>${esc(k)}</b> · ${esc(w.en || '')}</figcaption></figure>`; }).join('');
    return `<section><h2>${esc(name)} <small>${done.length} of ${want.length} done</small></h2><p class="legend">left: the shared Hausa picture · right: the new ${esc(name)} one (newest first)</p><div class="grid">${cards || '<p class="legend">none yet</p>'}</div></section>`;
  }).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="60"><title>Language pictures</title>
<style>:root{color-scheme:light}body{margin:0;padding:24px;background:#fbf7ee;color:#2b2318;font:15px/1.4 system-ui,sans-serif}h1{margin:0 0 4px}h2{margin:28px 0 4px}small,.legend{color:#7a6d5c;font-weight:400}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:16px}figure{margin:0;background:#fff;border-radius:12px;padding:10px;box-shadow:0 1px 3px #0001}.pair{display:grid;grid-template-columns:1fr 1fr;gap:6px}.pair img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:8px;background:#eee}.none{display:grid;place-items:center;aspect-ratio:1;background:#f1ece2;border-radius:8px;color:#7a6d5c;font-size:13px}figcaption{margin-top:6px}</style></head>
<body><h1>Kratu · pictures for each language</h1><p class="legend">Made locally (FLUX schnell). Updated ${new Date().toLocaleTimeString()} · this page reloads every minute.</p>${sections}</body></html>`;
}
const write = () => writeFileSync('tools/.genimg/gallery.html', page());
write(); if (process.argv.includes('--watch')) setInterval(write, 60000);
