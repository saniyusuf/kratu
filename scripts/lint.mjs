// The chain must agree end to end: every key the app says exists in the catalogue and is live; every live line has its
// file(s); a gendered line has both voices; no text is recorded twice under two keys; every word has its picture and
// clips and no two words share a picture or an English name.  →  npm run lint:content   (exit 1 on any error)
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
const lines = JSON.parse(readFileSync('content/lines.json', 'utf8')), W = JSON.parse(readFileSync('content/words.json', 'utf8'));
const errors = [], warns = [];
// --- the code: every quoted literal, so dynamic keys ('s_qd_' + key) are matched by their prefix
const lits = new Set(); const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (p.endsWith('.ts') && !p.endsWith('.spec.ts')) for (const m of readFileSync(p, 'utf8').matchAll(/'([A-Za-z0-9_]+)'/g)) lits.add(m[1]); } }; walk('src/app');
const rows = new Map(lines.map((r) => [r.key, r]));
const strip = (k) => k.replace(/^(s_|app_|sx_)/, '');
const used = (key) => { for (const l of lits) { if (l === key) return true; if (l.endsWith('_') && l.length >= 4 && (key.startsWith(l) || strip(key).startsWith(l) || key === l.slice(0, -1))) return true; } return false; };
// --- catalogue → files
const seenText = new Map();
for (const r of lines) {
  const texts = typeof r.text === 'string' ? { any: r.text } : r.text;
  if (r.status === 'live') {
    for (const [g, t] of Object.entries(texts)) {
      const key = g === 'any' ? r.key : r.key + '_' + g, file = `public/assets/audio/${r.lang}/${key}.ogg`;
      if (!existsSync(file)) errors.push(`${key}: no clip at ${file} (run npm run voice)`);
      if (!t) errors.push(`${key}: no text`);
      const sig = r.lang + '|' + g + '|' + t.trim().toLowerCase(); if (t && seenText.has(sig)) warns.push(`${key}: same text as ${seenText.get(sig)}`); else seenText.set(sig, key);
      const rec = typeof r.recorded === 'string' ? r.recorded : (r.recorded || {})[g]; if (rec === undefined) warns.push(`${key}: not marked as recorded (run npm run voice)`);
    }
    if (r.gender === 'pair' && !(texts.m && texts.f)) errors.push(`${r.key}: gendered line missing a voice (m and f both needed)`);
    if (r.gender === 'any' && r.lang === 'ha' && !r.addresses_both && /\b(ka|ki|kai|kin|kika|maka|miki|sunanka|sunanki)\b/.test(String(r.text))) warns.push(`${r.key}: unisex line contains a gendered word`);   // 'ke' is left out: it is also the relative marker and the 'sa ke' pronunciation steer
    if (!r.en && r.lang === 'ha') warns.push(`${r.key}: no English caption`);
    if (!used(r.key)) warns.push(`${r.key}: live but nothing in src/app says it (status should be "unused" or the key is built in a way the lint cannot see)`);
  }
}
// --- code → catalogue: literals that look like clip keys must exist
for (const l of lits) { if (/^(s|app|sx)_[a-z0-9_]+$/i.test(l) && !l.endsWith('_') && !rows.has(l) && !rows.has(l.replace(/_(m|f)$/, ''))) errors.push(`code says '${l}' but the catalogue has no such line`); }
// --- words
const byKey = new Map(W.words.map((w) => [w.key, w])); const pics = new Map(), ens = new Map();
for (const w of W.words) {
  for (const g of w.groups) if (!W.groups.includes(g)) errors.push(`${w.key}: unknown group ${g}`);
  const p = typeof w.picture === 'string' ? w.picture : w.picture?.of ? byKey.get(w.picture.of)?.picture : null;
  if (!p) errors.push(`${w.key}: no picture`); else if (!existsSync('public/assets/' + p)) errors.push(`${w.key}: picture missing ${p}`);
  if (typeof w.picture === 'string') { if (pics.has(p)) warns.push(`${w.key}: same picture as ${pics.get(p)}`); pics.set(p, w.key); }
  for (const side of ['ha', 'en']) { const v = w[side + '_clip']; const owner = typeof v === 'object' && v ? v.of : w.key; if (!v) errors.push(`${w.key}: no ${side} clip`); else if (!existsSync(`public/assets/audio/${side}/word_${owner}.ogg`)) errors.push(`${w.key}: ${side} clip missing (word_${owner}.ogg)`); }
  const en = String(w.en).toLowerCase(), num = w.groups.some((g) => g.startsWith('lambobi') || g === 'numbers'); if (!num) { if (ens.has(en)) warns.push(`${w.key}: English "${w.en}" also used by ${ens.get(en)} (the reading and spelling pools keep only one)`); else ens.set(en, w.key); }
}
// --- orphans on disk
for (const lang of ['ha', 'en']) for (const f of readdirSync('public/assets/audio/' + lang)) { const k = f.replace(/\.ogg$/, ''); if (k.startsWith('word_')) { if (!byKey.has(k.slice(5))) warns.push(`orphan word clip audio/${lang}/${f}`); } else if (!rows.has(k) && !rows.has(k.replace(/_(m|f)$/, ''))) warns.push(`orphan clip audio/${lang}/${f}`); else { const r = rows.get(k) || rows.get(k.replace(/_(m|f)$/, '')); if (r.status !== 'live') warns.push(`audio/${lang}/${f} belongs to a ${r.status} line (delete it)`); } }
for (const w of warns) console.log('warn  ' + w);
for (const e of errors) console.log('ERROR ' + e);
console.log(`content lint: ${errors.length} errors, ${warns.length} warnings, ${lines.length} lines, ${W.words.length} words, ${lits.size} literals scanned`);
process.exit(errors.length ? 1 : 0);
