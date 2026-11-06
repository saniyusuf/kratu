// A demo language's own pictures: tools/.genimg-<code>/<key>.png (from tools/hedra_images.py --prompts
// content/langs/<code>/image_prompts.json --out tools/.genimg-<code>) → langs/<code>/public/assets/pictures-<code>/<key>.webp,
// sized like `npm run words` makes them. The build then shows them instead of the shared picture.
//   node scripts/lang-pictures.mjs sw
import { readdirSync, mkdirSync, existsSync } from 'node:fs';
import sharp from 'sharp';
const code = process.argv[2]; if (!code) throw new Error('usage: node scripts/lang-pictures.mjs <code>');
const src = 'tools/.genimg-' + code, dst = 'langs/' + code + '/public/assets/pictures-' + code; mkdirSync(dst, { recursive: true });
let n = 0;
for (const f of existsSync(src) ? readdirSync(src) : []) {
  if (!/\.(png|jpe?g|webp)$/.test(f)) continue;
  await sharp(src + '/' + f).resize(512, 512, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 88 }).toFile(dst + '/' + f.replace(/\.\w+$/, '.webp')); n++;
}
console.log(`pictures[${code}]: ${n} made in ${dst}`);
