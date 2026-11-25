// The family app's install set (Sani 2026-11-25: "all the PWA things with proper Kratu icons"): every icon, the
// maskable and monochrome ones, Apple's touch icon and iPhone splash screens, all drawn from the brand's own files
// (public/favicon.svg: the K on cream; public/brand/kratu-wordmark.svg: the coloured word). No new artwork.
//   node tools/pwa-icons.mjs   → apps/family/public/icons/*, apps/family/public/splash/*
import fs from 'node:fs';
import sharp from 'sharp';
const OUT = 'apps/family/public/icons', SPL = 'apps/family/public/splash';
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(SPL, { recursive: true });
const CREAM = '#FBF3DE', RED = '#E63946';
const FAV = fs.readFileSync('public/favicon.svg', 'utf8');
const K_PATH = FAV.match(/<path[^>]*\/>/)[0];                        // the K, placed in a 930 box
const WORD = fs.readFileSync('public/brand/kratu-wordmark.svg', 'utf8');
// the K, scaled about its own centre (465, 472) so it sits inside the maskable safe circle (80%)
const kOnly = (fill, scale) => K_PATH.replace(/fill="[^"]*"/, `fill="${fill}"`).replace('<path', `<g transform="translate(465 472) scale(${scale}) translate(-465 -472)"><path`) + '</g>';
const SVG = {
  // the rounded cream tile with the K at the size the school app's icons already use (about 40% of the height)
  any: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 930 930"><rect width="930" height="930" rx="204.6" fill="${CREAM}"/>${kOnly(RED, 0.62)}</svg>`,
  maskable: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 930 930"><rect width="930" height="930" fill="${CREAM}"/>${kOnly(RED, 0.62)}</svg>`,
  monochrome: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 930 930">${kOnly('#FFFFFF', 0.62)}</svg>`,
  apple: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 930 930"><rect width="930" height="930" fill="${CREAM}"/>${kOnly(RED, 0.7)}</svg>`,  // iOS rounds it itself, no transparency
};
const png = (svg, size, file) => sharp(Buffer.from(svg), { density: 300 }).resize(size, size).png({ compressionLevel: 9 }).toFile(file);
const JOBS = [];
for (const S of [48, 72, 96, 128, 144, 152, 192, 256, 384, 512]) JOBS.push(png(SVG.any, S, `${OUT}/icon-${S}.png`));
for (const S of [192, 512]) { JOBS.push(png(SVG.maskable, S, `${OUT}/maskable-${S}.png`)); JOBS.push(png(SVG.monochrome, S, `${OUT}/monochrome-${S}.png`)); }
JOBS.push(png(SVG.apple, 180, `${OUT}/apple-touch-icon-180.png`));
JOBS.push(png(SVG.any, 150, `${OUT}/mstile-150.png`));
// iPhone splash screens (portrait, at device pixels): the coloured word on cream, a little above the middle
const VB = WORD.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number), RATIO = VB[3] / VB[2];
const PHONES = [[1290, 2796, 430, 932, 3], [1179, 2556, 393, 852, 3], [1284, 2778, 428, 926, 3], [1170, 2532, 390, 844, 3], [1125, 2436, 375, 812, 3], [1242, 2688, 414, 896, 3], [828, 1792, 414, 896, 2], [750, 1334, 375, 667, 2], [1080, 2340, 360, 780, 3]];
const LINKS = [];
for (const [W, H, w, h, r] of PHONES) {
  const WW = Math.round(W * 0.56), WH = Math.round(WW * RATIO);
  const word = await sharp(Buffer.from(WORD), { density: Math.min(600, 72 * WW / VB[2] * 1.5) }).resize(WW, WH).png().toBuffer();
  const F = `splash-${W}x${H}.png`;
  JOBS.push(sharp({ create: { width: W, height: H, channels: 3, background: CREAM } }).composite([{ input: word, left: Math.round((W - WW) / 2), top: Math.round(H * 0.44 - WH / 2) }]).png({ compressionLevel: 9 }).toFile(`${SPL}/${F}`));
  LINKS.push(`  <link rel="apple-touch-startup-image" href="splash/${F}" media="(device-width: ${w}px) and (device-height: ${h}px) and (-webkit-device-pixel-ratio: ${r}) and (orientation: portrait)">`);
}
await Promise.all(JOBS);
fs.writeFileSync(`${SPL}/links.html`, LINKS.join('\n') + '\n');
console.log('icons and', PHONES.length, 'splash screens written');
