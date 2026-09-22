// Adds or refreshes an example word: the picture (any image → webp 512 px) and the two name clips.
//   npm run words -- --add goat --group animals --ha akuya --en Goat --picture takes/goat.png
//   npm run words                 re-make every missing picture or clip for words already in content/words.json
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
const args = process.argv.slice(2), opt = (n) => args.includes('--' + n) ? args[args.indexOf('--' + n) + 1] : null;
const W = JSON.parse(readFileSync('content/words.json', 'utf8'));
if (opt('add')) { const key = opt('add'); if (W.words.some((w) => w.key === key)) throw new Error(key + ' exists'); W.words.push({ key, groups: [opt('group') || 'animals'], ha: opt('ha') || '', en: opt('en') || '', picture: 'pictures/' + key + '.webp', ha_clip: true, en_clip: true, source: opt('picture') || null }); W.words.sort((a, b) => a.key.localeCompare(b.key)); }
let made = 0;
for (const w of W.words) {
  if (typeof w.picture === 'string' && !existsSync('public/assets/' + w.picture) && w.source && existsSync(w.source)) { await sharp(w.source).resize(512, 512, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 88 }).toFile('public/assets/' + w.picture); made++; console.log('picture ' + w.picture); }
  for (const [side, lang, text] of [['ha', 'ha', w.ha], ['en', 'en', w.en]]) { if (w[side + '_clip'] !== true) continue; const dest = `public/assets/audio/${lang}/word_${w.key}.ogg`; if (existsSync(dest) || !text) continue; execFileSync('node', ['scripts/voice.mjs', '--word', w.key, '--lang', lang, '--text', text, '--dest', dest], { stdio: 'inherit' }); made++; }
}
writeFileSync('content/words.json', JSON.stringify(W, null, 1) + '\n'); console.log('words: ' + made + ' files made');
