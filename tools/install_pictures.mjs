// The Hedra redraw into the builds, sized like `npm run words` (webp, 512 px, quality 88):
//   shared, ha → public/assets/<the word's picture path>   (every language, Hausa included; Sani 12 Oct)
//   yo, ig, sw → langs/<code>/public/assets/pictures-<code>/<key>.webp   (that language only)
//   node tools/install_pictures.mjs shared ha yo ig sw
import { readFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import sharp from 'sharp';
const W = Object.fromEntries(JSON.parse(readFileSync('content/words.json', 'utf8')).words.map((w) => [w.key, w]));
for (const set of process.argv.slice(2)) {
  const src = `tools/.hedra-${set}`; let n = 0, skipped = [];
  for (const f of readdirSync(src).filter((f) => f.endsWith('.png'))) {
    const k = f.slice(0, -4), w = W[k];
    let dst;
    if (set === 'shared' || set === 'ha') { if (!w || typeof w.picture !== 'string') { skipped.push(k); continue; } dst = 'public/assets/' + w.picture; }
    else { if (!w) { skipped.push(k); continue; } mkdirSync(`langs/${set}/public/assets/pictures-${set}`, { recursive: true }); dst = `langs/${set}/public/assets/pictures-${set}/${k}.webp`; }
    await sharp(`${src}/${f}`).resize(512, 512, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 88 }).toFile(dst); n++;
  }
  console.log(`${set}: ${n} installed${skipped.length ? ', skipped (no such word): ' + skipped.join(' ') : ''}`);
}
