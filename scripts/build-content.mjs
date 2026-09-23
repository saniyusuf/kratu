// Generates what the app reads (public/assets/clips.json, words.json) from the catalogue in content/.
// The catalogue is the truth; these outputs are never edited by hand.  →  npm run content
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
const lines = JSON.parse(readFileSync('content/lines.json', 'utf8'));
const W = JSON.parse(readFileSync('content/words.json', 'utf8'));
const clips = {};
for (const r of lines) {
  if (r.status !== 'live') continue;
  const dir = 'audio/' + r.lang + '/';
  const texts = typeof r.text === 'string' ? { any: r.text } : r.text;
  for (const [g, text] of Object.entries(texts)) {
    const key = g === 'any' ? r.key : r.key + '_' + g;
    clips[key] = { file: dir + key + '.ogg', ha: r.lang === 'ha' ? text : '', en: r.en || (r.lang === 'en' ? text : '') };
  }
}
writeFileSync('public/assets/clips.json', JSON.stringify(clips));
const byKey = Object.fromEntries(W.words.map((w) => [w.key, w]));
const pic = (w) => !w.picture ? undefined : typeof w.picture === 'string' ? w.picture : pic(byKey[w.picture.of]);
const clip = (w, side) => { const v = w[side + '_clip']; if (!v) return undefined; return typeof v === 'object' ? clip(byKey[v.of], side) : 'audio/' + side + '/word_' + w.key + '.ogg'; };
const groups = Object.fromEntries(W.groups.map((g) => [g, []]));
for (const w of W.words) for (const g of w.groups) groups[g].push({ k: w.key, img: pic(w), haClip: clip(w, 'ha'), enClip: clip(w, 'en'), ha: w.ha, en: w.en });
writeFileSync('public/assets/words.json', JSON.stringify(groups));

// Every media file the app ships, with its size: the loader downloads the lot while the child watches the bar, so a
// tablet that reached the chooser has every clip, picture and film on it (Sani 2026-09-23).
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(dir + '/' + e.name) : [dir + '/' + e.name]);
const SKIP = /\/media\.json$/;   // everything else, clips.json and words.json included: they are fetched before the worker is driving, so the loader must ask for them again
const media = walk('public/assets').filter((f) => !SKIP.test(f)).map((f) => ({ path: 'assets/' + f.slice('public/assets/'.length), size: statSync(f).size }))
  .sort((a, b) => a.path.localeCompare(b.path));
const mediaTotal = media.reduce((a, f) => a + f.size, 0);
writeFileSync('public/assets/media.json', JSON.stringify({ total: mediaTotal, files: media }));
console.log('content: ' + Object.keys(clips).length + ' clips, ' + W.words.length + ' words in ' + W.groups.length + ' groups');
console.log('media:   ' + media.length + ' files, ' + (mediaTotal / 1048576).toFixed(1) + ' MB (clips, pictures, films)');
