// @ts-nocheck
import { SKIN } from './skin';
/*
 * Northern caps, drawn (Sani 2026-10-27: "the caps can also be northern arewa style cap, both the Bornu cap and the
 * Hausa cap"). One helper every game's people use, so the men in the markets, the river, the allo and the fields wear
 * real Arewa caps, mixed:
 *   hula  - the round Hausa cap, a soft dome finely embroidered: a stitched band at the brim, rows of small motifs
 *           climbing to a rosette at the crown.
 *   zanna - the folded Hausa cap (dara): taller, the crown pushed down so it leans over to one side, embroidered in
 *           columns of small patterns.
 *   borno - the Kanuri cap of Borno: tall, stiff, nearly cylindrical with a slightly domed top, embroidered all over in
 *           bold coloured bands of triangles and diamonds.
 * arewaCap(kind, x, y, w, c, c2, c3, side): (x, y) is the middle of the brim where the cap meets the forehead, w the
 * half width of the head there. The sun is upper left: the right side is shaded, the left catches the light.
 * capFor(i) gives a mixed set (style and colours) for crowds: pass any index.
 */
const n = (v) => Math.round(v * 100) / 100;

/* a darker or lighter shade of a #rrggbb colour, f in -1..1 */
function tone(hex, f) {
  const h = (hex || '#F4EBD0').replace('#', '');
  const v = h.length === 3 ? h.split('').map((x) => parseInt(x + x, 16)) : [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16));
  const m = v.map((c) => Math.round(f < 0 ? c * (1 + f) : c + (255 - c) * f));
  return '#' + m.map((c) => ('0' + Math.max(0, Math.min(255, c)).toString(16)).slice(-2)).join('');
}
const light = (hex) => { const t = tone(hex, 0); const v = [1, 3, 5].map((i) => parseInt(t.substr(i, 2), 16)); return v[0] * .3 + v[1] * .59 + v[2] * .11 > 150; };

function hula(x, y, w, c, c2) {
  const h = 1.14, sw = n(w * .07);
  const P = (dx, dy) => n(x + dx * w) + ' ' + n(y - dy * w);
  const dome = 'M' + P(-1, 0) + ' C' + P(-1.04, .78) + ' ' + P(-.66, h) + ' ' + P(0, h) + ' C' + P(.66, h) + ' ' + P(1.04, .78) + ' ' + P(1, 0) + ' Q' + P(0, -.12) + ' ' + P(-1, 0) + ' Z';
  let s = '<path d="' + dome + '" fill="' + c + '"/>';
  // the stitched band at the brim, a fine zigzag over it
  s += '<path d="M' + P(-.99, .14) + ' Q' + P(0, .02) + ' ' + P(.99, .14) + '" stroke="' + c2 + '" stroke-width="' + n(w * .13) + '" fill="none"/>';
  let z = 'M' + P(-.95, .3);
  for (let i = 1; i <= 14; i++) z += ' L' + P(-.95 + i * .1357, i % 2 ? .4 : .3);
  s += '<path d="' + z + '" stroke="' + c2 + '" stroke-width="' + sw + '" fill="none" stroke-linejoin="round"/>';
  // two rows of small diamonds, offset, following the curve of the dome
  let d = '';
  const dia = (cx, cy, r) => 'M' + P(cx, cy + r) + ' L' + P(cx + r * .8, cy) + ' L' + P(cx, cy - r) + ' L' + P(cx - r * .8, cy) + 'Z';
  for (let i = -3; i <= 3; i++) d += dia(i * .27, .58 - i * i * .012, .065);
  for (let i = -2; i <= 2; i++) d += dia(i * .27 + (i < 0 ? -.135 : .135) * (i ? 1 : 0), .8 - i * i * .03, .05);
  s += '<path d="' + d + '" fill="' + c2 + '"/>';
  // a ring of stitches round the crown and the crown's knot
  s += '<ellipse cx="' + n(x) + '" cy="' + n(y - w * 1.02) + '" rx="' + n(w * .3) + '" ry="' + n(w * .08) + '" fill="none" stroke="' + c2 + '" stroke-width="' + n(w * .05) + '"/>';
  s += '<circle cx="' + n(x) + '" cy="' + n(y - w * 1.08) + '" r="' + n(w * .07) + '" fill="' + c2 + '"/>';
  // light upper left, shade on the right, a soft crease at the brim
  s += '<path d="M' + P(.2, h - .01) + ' C' + P(.72, h - .03) + ' ' + P(1.04, .78) + ' ' + P(1, 0) + ' Q' + P(.66, -.07) + ' ' + P(.36, -.09) + ' C' + P(.62, .4) + ' ' + P(.58, .86) + ' ' + P(.2, h - .01) + 'Z" fill="#000" opacity=".2"/>';
  s += '<path d="M' + P(-.8, .5) + ' Q' + P(-.72, .96) + ' ' + P(-.25, 1.08) + '" stroke="#fff" stroke-opacity=".32" stroke-width="' + n(w * .12) + '" fill="none" stroke-linecap="round"/>';
  s += '<path d="M' + P(-1, 0) + ' Q' + P(0, -.12) + ' ' + P(1, 0) + '" stroke="#000" stroke-opacity=".28" stroke-width="' + n(w * .085) + '" fill="none"/>';
  return s;
}

function zanna(x, y, w, c, c2, side) {
  const k = side < 0 ? -1 : 1;
  const P = (dx, dy) => n(x + dx * w * k) + ' ' + n(y - dy * w);
  // the high side, the crown folded over and leaning down to the other side
  const body = 'M' + P(-1, 0) + ' L' + P(-.98, 1.28) + ' Q' + P(-.62, 1.5) + ' ' + P(-.05, 1.34) + ' Q' + P(.62, 1.14) + ' ' + P(1.05, .74) + ' L' + P(1, 0) + ' Q' + P(0, -.12) + ' ' + P(-1, 0) + ' Z';
  let s = '<path d="' + body + '" fill="' + c + '"/>';
  // columns of small embroidered motifs, shorter towards the low side
  let col = '';
  const xs = [-.72, -.36, 0, .36, .7], tops = [1.18, 1.18, 1.1, .96, .72];
  xs.forEach((cx, i) => { for (let yy = .34; yy < tops[i] - .06; yy += .2) col += 'M' + P(cx, yy + .07) + ' L' + P(cx + .07, yy) + ' L' + P(cx, yy - .07) + ' L' + P(cx - .07, yy) + 'Z'; });
  s += '<path d="' + col + '" fill="' + c2 + '"/>';
  let ln = '';
  [-.54, -.18, .18, .53].forEach((cx, i) => { ln += 'M' + P(cx, .26) + ' L' + P(cx, [1.2, 1.16, 1.02, .84][i]); });
  s += '<path d="' + ln + '" stroke="' + c2 + '" stroke-width="' + n(w * .05) + '" opacity=".75"/>';
  s += '<path d="M' + P(-.98, .16) + ' Q' + P(0, .04) + ' ' + P(1, .16) + '" stroke="' + c2 + '" stroke-width="' + n(w * .15) + '" fill="none"/>';
  // the fold: the pushed-down crown overhangs, shaded under its edge
  s += '<path d="M' + P(-.7, 1.36) + ' Q' + P(.1, 1.02) + ' ' + P(1.04, .72) + ' Q' + P(.5, 1.18) + ' ' + P(-.05, 1.34) + ' Q' + P(-.4, 1.42) + ' ' + P(-.7, 1.36) + 'Z" fill="' + tone(c, light(c) ? -.08 : .12) + '"/>';
  s += '<path d="M' + P(-.7, 1.36) + ' Q' + P(.1, 1.02) + ' ' + P(1.04, .72) + '" stroke="#000" stroke-opacity=".3" stroke-width="' + n(w * .08) + '" fill="none"/>';
  // the light from the upper left: shade on the right half
  const shadeR = k > 0 ? 'M' + P(.3, 1.08) + ' Q' + P(.7, .95) + ' ' + P(1.05, .74) + ' L' + P(1, 0) + ' Q' + P(.66, -.07) + ' ' + P(.36, -.09) + 'Z'
    : 'M' + P(-.98, 1.28) + ' L' + P(-1, 0) + ' Q' + P(-.7, -.07) + ' ' + P(-.4, -.09) + ' L' + P(-.42, 1.38) + ' Q' + P(-.7, 1.42) + ' ' + P(-.98, 1.28) + 'Z';
  s += '<path d="' + shadeR + '" fill="#000" opacity=".18"/>';
  s += '<path d="M' + P(-1, 0) + ' Q' + P(0, -.12) + ' ' + P(1, 0) + '" stroke="#000" stroke-opacity=".28" stroke-width="' + n(w * .085) + '" fill="none"/>';
  return s;
}

function borno(x, y, w, c, c2, c3) {
  const H = 1.5;
  const P = (dx, dy) => n(x + dx * w) + ' ' + n(y - dy * w);
  const body = 'M' + P(-1, 0) + ' L' + P(-1.05, H * .9) + ' Q' + P(-.98, H * 1.06) + ' ' + P(0, H * 1.07) + ' Q' + P(.98, H * 1.06) + ' ' + P(1.05, H * .9) + ' L' + P(1, 0) + ' Q' + P(0, -.12) + ' ' + P(-1, 0) + ' Z';
  let s = '<path d="' + body + '" fill="' + c + '"/>';
  // bold bands, bottom to top: a solid band, a row of triangles, a band of diamonds, a row of triangles, a band at the top
  const band = (y0, t, col) => '<path d="M' + P(-1.02, y0) + ' Q' + P(0, y0 - .1) + ' ' + P(1.02, y0) + '" stroke="' + col + '" stroke-width="' + n(w * t) + '" fill="none"/>';
  s += band(.12, .22, c2) + band(.74, .08, c2) + band(1.2, .14, c2);
  let tri = '', tri2 = '', dia = '';
  for (let i = 0; i < 6; i++) {
    const x0 = -1 + i * .34;
    tri += 'M' + P(x0, .28) + ' L' + P(x0 + .17, .58) + ' L' + P(x0 + .34, .28) + 'Z';
    tri2 += 'M' + P(x0, 1.1) + ' L' + P(x0 + .17, .84) + ' L' + P(x0 + .34, 1.1) + 'Z';
  }
  for (let i = 0; i < 5; i++) { const cx = -.68 + i * .34; dia += 'M' + P(cx, 1.04) + ' L' + P(cx + .11, .97) + ' L' + P(cx, .9) + ' L' + P(cx - .11, .97) + 'Z'; }
  s += '<path d="' + tri + '" fill="' + c3 + '"/><path d="' + tri2 + '" fill="' + c2 + '" opacity=".9"/><path d="' + dia + '" fill="' + c3 + '"/>';
  // small stitches between the triangles and a star at the crown
  let st = '';
  for (let i = 0; i < 5; i++) { const cx = -.66 + i * .34; st += 'M' + P(cx, .36) + ' V' + n(y - .5 * w); }
  s += '<path d="' + st + '" stroke="' + c2 + '" stroke-width="' + n(w * .05) + '"/>';
  s += '<path d="M' + P(-.5, H * 1.02) + ' Q' + P(0, H * .96) + ' ' + P(.5, H * 1.02) + '" stroke="' + c3 + '" stroke-width="' + n(w * .1) + '" fill="none"/>';
  // a cylinder lit from the left: a highlight strip on the left, the right third in shade
  s += '<path d="M' + P(-.78, .12) + ' L' + P(-.82, H * .94) + '" stroke="#fff" stroke-opacity=".28" stroke-width="' + n(w * .16) + '" stroke-linecap="round"/>';
  s += '<path d="M' + P(.4, -.1) + ' L' + P(.44, H * 1.05) + ' Q' + P(.95, H * 1.04) + ' ' + P(1.05, H * .9) + ' L' + P(1, 0) + ' Q' + P(.7, -.07) + ' ' + P(.4, -.1) + 'Z" fill="#000" opacity=".22"/>';
  s += '<path d="M' + P(-1, 0) + ' Q' + P(0, -.12) + ' ' + P(1, 0) + '" stroke="#000" stroke-opacity=".3" stroke-width="' + n(w * .09) + '" fill="none"/>';
  return s;
}

/** the cap only, drawn over the head; kind 'hula' | 'zanna' | 'borno' */
export function arewaCap(kind, x, y, w, c, c2, c3, side = 1) {
  if (SKIN && SKIN.cap) return SKIN.cap(kind, x, y, w, c, c2, c3, side);   // a language build's own hats (skin.ts)
  c = c || '#F4F1EA';
  c2 = c2 || (light(c) ? '#7A1F2B' : '#F2E6C4');
  if (kind === 'borno') return '<g class="cap-b">' + borno(x, y, w, c, c2, c3 || (light(c) ? '#1E5B3A' : '#E0A526')) + '</g>';
  if (kind === 'zanna') return '<g class="cap-z">' + zanna(x, y, w, c, c2, side) + '</g>';
  return '<g class="cap-h">' + hula(x, y, w, c, c2) + '</g>';
}

/* a mixed set for crowds: cream, white, maroon, navy and green Hausa caps; Borno caps in bold colours */
export const CAPS = [
  { cap: 'hula', capc: '#F6F2E8', capc2: '#7A1F2B' },
  { cap: 'borno', capc: '#F2E8CF', capc2: '#A3242C', capc3: '#1E5B3A' },
  { cap: 'zanna', capc: '#7A1F2B', capc2: '#E9C46A' },
  { cap: 'hula', capc: '#1F2E5A', capc2: '#E9E2CF' },
  { cap: 'zanna', capc: '#F4EBD0', capc2: '#2E5E3A' },
  { cap: 'borno', capc: '#7A1F2B', capc2: '#F2C230', capc3: '#1F2E5A' },
  { cap: 'hula', capc: '#2E5E3A', capc2: '#F4EBD0' },
  { cap: 'zanna', capc: '#1F2E5A', capc2: '#D9B36A' },
  { cap: 'borno', capc: '#1F2E5A', capc2: '#E9C46A', capc3: '#B23A2A' },
  { cap: 'hula', capc: '#EDE3CC', capc2: '#1F2E5A' },
  { cap: 'zanna', capc: '#FFFFFF', capc2: '#7A1F2B' },
  { cap: 'borno', capc: '#FFFFFF', capc2: '#1E5B3A', capc3: '#C62828' },
];
export const capFor = (i) => CAPS[((i % CAPS.length) + CAPS.length) % CAPS.length];
