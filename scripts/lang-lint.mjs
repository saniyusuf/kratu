// The chain for one demo language: every line Hausa says has its text and clip here, every word its name and clip,
// and every fixed text the screens pass through t() has its translation.  →  node scripts/lint.mjs --lang sw
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadLang, outDir, spoken, forms, clipOwner } from './lang-build.mjs';

export function lintLang(code) {
  const { pack, lines: L, words: names } = loadLang(code);
  const ha = JSON.parse(readFileSync('content/lines.json', 'utf8')), W = JSON.parse(readFileSync('content/words.json', 'utf8'));
  const errors = [], warns = [], out = outDir(code), byKey = new Map(L.map((r) => [r.key, r]));
  for (const k of ['code', 'name', 'bird', 'sr', 'carrier', 'tts', 'ui']) if (pack[k] === undefined) errors.push(`lang.json: no ${k}`);
  if (pack.code !== code) errors.push(`lang.json: code is ${pack.code}, folder is ${code}`);
  // lines: the same keys Hausa speaks, each in this language, each with its clip
  for (const r of ha.filter(spoken)) {
    const x = byKey.get(r.key); if (!x) { errors.push(`${r.key}: Hausa says it, ${code} has no line`); continue; }
    if (!x.en) warns.push(`${r.key}: no English caption`);
    if (/\b(Hausa)\b/.test(String(JSON.stringify(x.text)))) warns.push(`${r.key}: the text still names Hausa`);
    const hf = Object.keys(forms(r.text)), xf = Object.keys(forms(x.text));
    if (xf.length > 1 && hf.join() !== xf.join()) warns.push(`${r.key}: forms ${xf.join('/')} differ from Hausa's ${hf.join('/')}`);
    for (const [g, t] of Object.entries(forms(x.text))) {
      const key = g === 'any' ? r.key : r.key + '_' + g;
      if (!t || !String(t).trim()) errors.push(`${key}: no text`);
      if (!existsSync(`${out}/audio/${code}/${key}.ogg`)) errors.push(`${key}: no clip (node scripts/voice.mjs --lang ${code})`);
    }
  }
  const hk = new Set(ha.map((r) => r.key)); for (const x of L) if (!hk.has(x.key)) warns.push(`${x.key}: not a Hausa key`);
  // words
  for (const w of W.words) {
    if (!names[w.key]) { errors.push(`word ${w.key}: no ${code} name`); continue; }
    if (!existsSync(`${out}/audio/${code}/word_${clipOwner(w, names)}.ogg`)) errors.push(`word ${w.key}: no clip (word_${clipOwner(w, names)}.ogg)`);
  }
  // screen text: every fixed t('…') / tx('…') in the code has its translation (the ones built from data are checked by eye)
  const keys = new Set(); const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (p.endsWith('.ts')) { const src = readFileSync(p, 'utf8'); for (const m of src.matchAll(/\bt[x]?\('((?:[^'\\]|\\.)*)'\)/g)) keys.add(m[1].replace(/\\'/g, "'")); for (const m of src.matchAll(/\bt[x]?\("([^"]*)"\)/g)) keys.add(m[1]); } } }; walk('src/app');
  for (const k of JSON.parse(readFileSync('content/langs/ui-keys.json', 'utf8')).keys) keys.add(k);
  const ui = pack.ui || {}; let english = 0;
  // English text on screen needs no translation, only the bird's name, which t() swaps by itself
  const ENGLISH = /^(click|tap|so Laila|a teleprompter)\b/i;
  for (const k of keys) { if (ui[k] !== undefined) continue; if (ENGLISH.test(k)) { english++; continue; } errors.push(`screen text "${k}": no ${code} translation in lang.json ui`); }
  for (const w of warns) console.log('warn  ' + w);
  for (const e of errors) console.log('ERROR ' + e);
  console.log(`content lint [${code}]: ${errors.length} errors, ${warns.length} warnings, ${L.length} lines, ${Object.keys(names).length} word names, ${keys.size} screen texts (${english} English, left to the bird-name swap)`);
  return errors.length;
}
