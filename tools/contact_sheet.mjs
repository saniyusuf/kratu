// contact sheet: node sheet.mjs <dir> <out.jpg> [from] [n]   → 4×3 grid of 256 px tiles with the key written under each
import sharp from 'sharp';
import { readdirSync } from 'node:fs';
const [dir, out, from = 0, n = 12] = process.argv.slice(2);
const files = readdirSync(dir).filter((f) => f.endsWith('.png')).sort().slice(+from, +from + +n);
const T = 256, L = 26, C = 4, R = Math.ceil(files.length / C);
const tiles = await Promise.all(files.map(async (f, i) => {
  const img = await sharp(dir + '/' + f).resize(T, T, { fit: 'contain', background: '#fff' }).toBuffer();
  const label = Buffer.from(`<svg width="${T}" height="${L}"><rect width="100%" height="100%" fill="#fff"/><text x="6" y="19" font-size="17" font-family="Helvetica">${f.replace('.png', '')}</text></svg>`);
  return [{ input: img, left: (i % C) * T, top: Math.floor(i / C) * (T + L) }, { input: label, left: (i % C) * T, top: Math.floor(i / C) * (T + L) + T }];
}));
await sharp({ create: { width: C * T, height: R * (T + L), channels: 3, background: '#fff' } }).composite(tiles.flat()).jpeg({ quality: 80 }).toFile(out);
console.log(out, files.length);
