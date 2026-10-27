// @ts-nocheck
import { arewaCap } from './capsArewa';
/*
 * Dalar gyaɗa, drawn (Sani 2026-10-25: the same hand as Hawan Sallah). The groundnut pyramids of Kano in the harmattan:
 * a pale ochre sky with the sun low in the dust, the old city faint on the horizon, great pyramids built of jute sacks,
 * porters climbing them with sacks on their heads, a zinc-roofed warehouse on the left (behind the game's lorry), and
 * on the right a mat shade where a man works the platform scale and a clerk keeps the ledger. A donkey loaded with
 * sacks is led to the scale, men in jalabiya and caps watch the work, children and a kosai seller by the warehouse,
 * and two egrets drift across the haze.
 *
 * Classes for sc-gyada.css (transform and opacity only):
 *   every person: .x-p (body) · .x-hd (head) · .x-al / .x-ar (arms, each centred on its shoulder) · .x-ms / .x-mf (smile, frown)
 *   .x-w workers who cheer · .x-por porters (droop when sad) · .x-clerk (nods) · .x-climb (climbs) · .x-eg (egret) · .x-haze
 */
const P = 'gy4';
const SK = ['#7A4A26', '#5E3A1C', '#8B5A2B', '#6B4022', '#4E2F17', '#9A6236'];
const n2 = (v) => +(+v).toFixed(2);
const lg = (id, ...c) => '<linearGradient id="' + P + '-' + id + '" x1="0" y1="0" x2="0" y2="1">' + c.map((col, i) => '<stop offset="' + (i / (c.length - 1)).toFixed(2) + '" stop-color="' + col + '"/>').join('') + '</linearGradient>';

/* ---------------- people: one figure about 40 units tall, feet at 0 ---------------- */
const ARM = {
  down: ['M-4.2 -24.8 Q-6.4 -19.6 -5.9 -14.6', -5.9, -14.2],
  up: ['M-4.2 -24.8 Q-7.6 -30 -6.4 -36', -6.4, -36.4],
  head: ['M-4.2 -24.8 Q-8 -31 -3.8 -37.2', -3.6, -37.6],
  hip: ['M-4.2 -24.8 Q-8.8 -20.4 -4.6 -16.8', -4.4, -16.6],
  front: ['M-4.2 -24.8 Q-5.6 -18 -1.4 -18.4', -1, -18.4],
  point: ['M-4.2 -24.8 Q-9 -25.4 -12.4 -29', -12.8, -29.4],
  staff: ['M-4.2 -24.8 Q-7.2 -21.4 -7.4 -17.6', -7.4, -17.2],
  write: ['M-4.2 -24.8 Q-4.8 -18.4 -.6 -16.4', -.2, -16.2],
  out: ['M-4.2 -24.8 Q-9.4 -22 -11.2 -17.4', -11.4, -17],
};
/* an arm turns about its shoulder: the empty circle centres its box there, so CSS can use 50% 50% */
function arm(side, pose, col, sk, hold = '', w = 2.6) {
  const [d, hx, hy] = Array.isArray(pose) ? pose : ARM[pose], name = Array.isArray(pose) ? 'x-cu' : 'x-' + pose;
  return '<g class="x-a' + side + ' ' + name + '"><circle cx="' + (side === 'l' ? -4.2 : 4.2) + '" cy="-24.8" r="30" fill="none"/><g' + (side === 'r' ? ' transform="scale(-1 1)"' : '') + '>' +
    '<path class="x-sl" d="' + d + '" stroke="' + col + '"' + (w > 3 ? ' stroke-width="' + w + '"' : '') + '/><path class="x-sf" d="' + d + '"/>' +
    '<circle cx="' + hx + '" cy="' + hy + '" r="1.2" fill="' + sk + '"/>' + hold + '</g></g>';
}
const CAP = {
  hula: (c, c2) => arewaCap('hula', 0, -32.7, 3.75, c, c2),
  zanna: (c, c2, o) => arewaCap('zanna', 0, -32.7, 3.75, c, c2, '', o.capside || 1),
  borno: (c, c2, o) => arewaCap('borno', 0, -32.7, 3.75, c, c2, o.capc3),
  turban: (c) => '<path d="M-3.4 -32.6 Q-5.6 -29 -4.2 -25.6" stroke="' + c + '" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M-4.1 -32.2 Q-4.8 -38.8 0 -39 Q4.8 -38.8 4.1 -32.2 Q2 -34.4 0 -34.2 Q-2 -34.4 -4.1 -32.2Z" fill="' + c + '"/><path d="M-3.8 -35.4 Q0 -37.8 3.8 -35.4 M-4 -33.6 Q0 -36.4 4 -33.6" stroke="#000" stroke-opacity=".13" stroke-width=".4" fill="none"/>',
  kallabi: (c, c2) => '<path d="M-4 -32 Q-4.6 -38.4 0 -38.6 Q4.6 -38.4 4 -32 Q2 -34.6 0 -34.4 Q-2 -34.6 -4 -32Z" fill="' + c + '"/><path d="M-2.2 -38 Q-5 -41.8 -1 -40.6 Q0 -43 1.2 -40.6 Q5 -41.8 2.2 -38Z" fill="' + c + '"/><path d="M-3.7 -34.8 Q0 -37.2 3.7 -34.8" stroke="' + c2 + '" stroke-width=".55" fill="none"/>',
  kube: (c) => '<path d="M-3.5 -33 Q-3.4 -36.4 0 -36.6 Q3.4 -36.4 3.5 -33Z" fill="' + c + '"/>',
  pad: () => '<ellipse cy="-35.2" rx="3" ry=".9" fill="#E9D9A6" stroke="#B89A5E" stroke-width=".3"/>',
};
const HEADB = '<g id="' + P + '-hb"><rect x="-1.1" y="-29.2" width="2.2" height="3.2"/><ellipse cx="-3.6" cy="-31.4" rx=".7" ry="1"/><ellipse cx="3.6" cy="-31.4" rx=".7" ry="1"/><circle cy="-31.6" r="3.7"/></g>';
const FACE = '<g id="' + P + '-fc"><path d="M-1.1 -27 h2.2" stroke="#000" stroke-opacity=".15" stroke-width=".6"/><circle cy="-31.6" r="3.7" fill="url(#' + P + '-sh)"/><g fill="#1A0E06"><circle cx="-1.35" cy="-32" r=".46"/><circle cx="1.35" cy="-32" r=".46"/></g><g fill="#fff" opacity=".7"><circle cx="-1.2" cy="-32.15" r=".14"/><circle cx="1.5" cy="-32.15" r=".14"/></g>' +
  '<path d="M-2.1 -33.1 l1.4 -.2 M2.1 -33.1 l-1.4 -.2" stroke="#1A0E06" stroke-width=".3" stroke-linecap="round"/><path d="M.1 -31.6 q.6 .9 -.2 1.3" stroke="#000" stroke-opacity=".28" stroke-width=".35" fill="none"/></g>';
const SACKDEF = '<g id="' + P + '-ld"><path d="M-5.4 -38.6 Q-5.6 -41.6 -2.6 -41.8 L3.6 -41.4 Q6 -41.2 5.4 -38.4 Q5 -37 2.8 -37.2 L-3.4 -37.4 Q-5.2 -37.4 -5.4 -38.6Z" fill="#D6B676" stroke="#8B6A3A" stroke-width=".25"/>' +
  '<path d="M-4.6 -39.6 H4.8" stroke="#9A7A42" stroke-width=".3" stroke-dasharray=".7 .5"/><path d="M-5.4 -40.8 l-.9 -.8 M5.6 -40.2 l.9 -.8" stroke="#B89656" stroke-width=".6" stroke-linecap="round"/><path d="M1 -37.3 Q3.6 -37.6 5.2 -38.6" stroke="#000" stroke-opacity=".12" stroke-width=".8" fill="none"/></g>';
const JALF = '<g id="' + P + '-jf"><path d="M0 -27 Q3.4 -26.8 4.6 -25.8 L6.6 -1.6 Q3.4 -.6 0 -.4Z" fill="#000" opacity=".13"/><path d="M-2 -18 Q-2.8 -9 -3.6 -2 M2.2 -16 Q2.8 -8 3.8 -2" stroke="#000" stroke-opacity=".12" stroke-width=".45" fill="none"/></g>';
const RIGF = '<g id="' + P + '-rf"><path d="M0 -27.2 Q3.4 -27 4.8 -26 L10.6 -2.2 Q5 -.6 0 -.4Z" fill="#000" opacity=".13"/><path d="M-3 -18 Q-6 -10 -8 -3 M3.2 -16 Q5.6 -9 7.4 -2.6 M0 -14 V-1" stroke="#000" stroke-opacity=".1" stroke-width=".45" fill="none"/></g>';
const WOMF = '<g id="' + P + '-wf"><path d="M0 -27 Q3.2 -26.8 4.4 -26 L5 -15.6 H0Z" fill="#000" opacity=".12"/><path d="M2.6 -15.6 Q1.8 -8 3 -1" stroke="#000" stroke-opacity=".15" stroke-width=".45" fill="none"/><path d="M0 -15.8 Q3.6 -15 5.3 -16 L6.1 -1.2 Q3.4 -.4 0 -.2Z" fill="#000" opacity=".1"/></g>';
const SACK = '<use href="#' + P + '-ld"/>';
function head(o, sk) {
  const cap = CAP[o.cap] ? CAP[o.cap](o.capc, o.capc2, o) : '';
  const back = o.cap === 'hijab' ? '<path d="M-4.4 -31 Q-5 -38 0 -38 Q5 -38 4.4 -31 L5.8 -22.6 Q0 -20.6 -5.8 -22.6Z" fill="' + o.capc + '"/>' : '';
  const front = o.cap === 'hijab' ? '<path d="M-4.2 -30.2 Q-4.6 -37 0 -37 Q4.6 -37 4.2 -30.2 Q3.2 -35 0 -35 Q-3.2 -35 -4.2 -30.2Z" fill="' + o.capc + '"/>' : cap;
  return '<g class="x-hd"><circle cy="-28" r="13" fill="none"/>' + back + '<use href="#' + P + '-hb" fill="' + sk + '"/>' +
    '<use href="#' + P + '-fc"/>' +
    '<path class="x-ms" d="M-1.15 -29.7 q1.15 .95 2.3 0"/><path class="x-mf" d="M-1 -29.1 q1 -.8 2 0"/>' +
    (o.beard ? '<path d="M-3.1 -30.8 Q-2.8 -26.4 0 -26.2 Q2.8 -26.4 3.1 -30.8 Q1.6 -28.7 0 -28.9 Q-1.6 -28.7 -3.1 -30.8Z" fill="' + o.beard + '"/>' : '') + front + '</g>';
}
function body(o) {
  const c = o.c, t = o.t || '#F4EBD0';
  if (o.dress === 'riga') return '<path d="M-4.8 -26 Q0 -27.6 4.8 -26 L10.6 -2.2 Q0 .4 -10.6 -2.2Z" fill="' + c + '"/><use href="#' + P + '-rf"/>' +
    '<path d="M-1.8 -26.2 L0 -21.6 L1.8 -26.2" stroke="' + t + '" stroke-width=".5" fill="none"/><circle cx="-.4" cy="-19" r="1.4" fill="none" stroke="' + t + '" stroke-width=".45"/><path d="M-2.6 -15.6 q2.2 1.4 4.4 0 M-2 -13.6 q1.8 1.2 3.6 0" stroke="' + t + '" stroke-width=".4" fill="none"/>';
  if (o.dress === 'wom') return '<path d="M-4.4 -26 Q0 -27.4 4.4 -26 L5 -15.6 L-5 -15.6Z" fill="' + c + '"/>' +
    '<path d="M-2.2 -26.2 Q0 -24 2.2 -26.2" stroke="' + t + '" stroke-width=".5" fill="none"/>' +
    '<path d="M-5.3 -16.2 L5.3 -16.2 L6.1 -1.2 Q0 .3 -6.1 -1.2Z" fill="' + o.w + '"/><path d="M-5.4 -12.4 H5.5 M-5.8 -5.2 H5.9" stroke="' + o.w2 + '" stroke-width=".9"/><path d="M-5.2 -14.8 H5.2" stroke="' + o.w2 + '" stroke-width=".5"/>' +
    '<use href="#' + P + '-wf"/>';
  // jalabiya: the long plain gown, its folds and a little stitching at the neck
  return '<path d="M-4.6 -25.8 Q0 -27.4 4.6 -25.8 L6.6 -1.6 Q0 .2 -6.6 -1.6Z" fill="' + c + '"/><use href="#' + P + '-jf"/><path d="M-1.6 -26 L0 -22.4 L1.6 -26" stroke="' + t + '" stroke-width=".45" fill="none"/>';
}
/** o: x y s flip skin dress c t (w w2) cap capc capc2 al ar hl hr load beard cls lean */
function person(o) {
  const sk = SK[(o.skin || 0) % SK.length], s = o.s || 1, wide = o.dress === 'riga' ? 3.6 : 2.6;
  const feet = '<use href="#' + P + '-ft"/>';
  return '<g transform="translate(' + n2(o.x) + ' ' + n2(o.y) + ') scale(' + (o.flip ? -s : s) + ' ' + s + ')' + (o.lean ? ' rotate(' + o.lean + ')' : '') + '"><g class="x-p ' + (o.cls || '') + '">' +
    '<ellipse cy=".1" rx="' + (o.dress === 'riga' ? 10 : 7) + '" ry="1.3" fill="#3C2810" opacity=".22"/>' + feet + body(o) + head(o, sk) + (o.load || '') +
    arm('l', o.al || 'down', o.c, sk, o.hl, wide) + arm('r', o.ar || 'down', o.c, sk, o.hr, wide) + (o.front || '') + '</g></g>';
}

/* ---------------- things ---------------- */
/* a pyramid of real sacks (copied and grown from the old sackPyr): each row a sack shorter and set half a sack in, so a
   porter can step up it; the shaded side darker and the tints varied so no two sacks match */
function pyr(cx, base, rows, o) {
  const sw = 7.2, sh = 4, by = {}; let s = '<g opacity="' + o + '">', st = '';
  for (let k = 0; k < rows; k++) { const n = rows - k, y = base - (k + 1) * sh, x0 = cx - n * sw / 2;
    for (let i = 0; i < n; i++) { const x = x0 + i * sw, t = (i * 7 + k * 3) % 4, shade = x + sw / 2 > cx + (n * sw / 2) * .2;
      const f = shade ? ['#B38E57', '#A98450', '#B89458', '#A27E4A'][t] : ['#DDBF86', '#D4B47A', '#E2C690', '#CFAE74'][t];
      by[f] = (by[f] || '') + '<use href="#' + P + '-s" x="' + n2(x) + '" y="' + n2(y) + '"/>';
      if ((i + k * 2) % 4 === 0) st += 'M' + n2(x + 1.8) + ' ' + n2(y + 2) + 'h3.6'; } }
  for (const f in by) s += '<g fill="' + f + '">' + by[f] + '</g>';
  return s + '<path d="' + st + '" stroke="#8A6A38" stroke-width=".25" stroke-dasharray=".5 .4"/></g>';
}
/* a loose heap of sacks on the ground */
const heap = (x, y, k = 0) => [[0, 0], [7.2, 0], [14.4, 0], [3.6, -4], [10.8, -4], [7.2, -8]].slice(0, k ? 3 : 6).map(([dx, dy], i) =>
  '<use href="#' + P + '-s" x="' + n2(x + dx) + '" y="' + n2(y + dy - 4) + '" fill="' + ['#D8BA80', '#CFAE74', '#B89458', '#E0C48C', '#C9A86E', '#D4B47A'][i] + '"/>').join('');
const egret = (x, y, s, cls) => '<g class="x-eg ' + cls + '"><g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
  '<path d="M-6 0 Q-2 -1.6 3 -.6 L6.4 -1.6 L4 .4 Q0 1.4 -6 0Z" fill="#FFFDF6"/><path class="x-wg" d="M-2 -.6 Q1 -7 6 -6.4 Q2 -3 1.4 -.4Z" fill="#F4F0E4"/><path d="M6.4 -1.6 l2.4 .4 l-2.2 .4" fill="#E8B730"/><path d="M-6 .2 l-3 1.4" stroke="#3A2A1A" stroke-width=".4"/></g></g>';

export function gyadaScene(): string {
  const defs = '<defs>' + lg('sky', '#E2C795', '#ECD8AE', '#F4E5C4') + lg('gr', '#D9B77E', '#C9A167', '#B88E55') + lg('zinc', '#C3C7C6', '#8E9496') + lg('wall', '#DCC7A0', '#C9AE80') +
    '<radialGradient id="' + P + '-sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF8E2"/><stop offset=".35" stop-color="#FFEFC4" stop-opacity=".7"/><stop offset="1" stop-color="#FFEFC4" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="' + P + '-sh" cx=".38" cy=".36" r=".7"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></radialGradient>' +
    '<linearGradient id="' + P + '-hz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4E4C0" stop-opacity="0"/><stop offset=".7" stop-color="#F4E4C0" stop-opacity=".55"/><stop offset="1" stop-color="#F4E4C0" stop-opacity=".2"/></linearGradient>' +
    HEADB + FACE + SACKDEF + JALF + RIGF + WOMF + '<path id="' + P + '-ft" d="M-3.6 -1.4h2.8v1.3h-3.4z M.8 -1.4h2.8l.6 1.3h-3.4z" fill="#2E2218"/>' +
    '<path id="' + P + '-s" d="M.5 .4Q3.6 -.3 6.7 .4Q7.5 2 6.7 3.8Q3.6 4.3 .5 3.8Q-.3 2 .5 .4Z" stroke="#8B6A3A" stroke-width=".22"/></defs>';

  const sky = '<rect width="320" height="200" fill="url(#' + P + '-sky)"/><circle cx="70" cy="34" r="34" fill="url(#' + P + '-sun)"/><circle cx="70" cy="34" r="8.5" fill="#FFF6DC" opacity=".9"/>' +
    // the old city faint on the horizon: flat roofs with zanko horns, a dome and a minaret
    '<g fill="#C7AC7E" opacity=".5"><path d="M60 124 V112 H84 V124Z M88 124 V108 H104 V124Z M150 124 V110 H176 V124Z M228 124 V113 H250 V124Z M296 124 V109 H320 V124Z"/>' +
    '<path d="M60 112 l1.2 -3 1.2 3 M72 112 l1.2 -3 1.2 3 M82 112 l1.2 -3 1.2 3 M88 108 l1.2 -3 1.2 3 M102 108 l1.2 -3 1.2 3 M296 109 l1.2 -3 1.2 3 M318 109 l1.2 -3 1.2 3"/>' +
    '<ellipse cx="164" cy="110" rx="6" ry="5"/><path d="M166 124 V94 L167.6 90 L169.2 94 V124Z"/><path d="M164.6 100 h5.2 M164.6 108 h5.2" stroke="#C7AC7E" stroke-width="1"/></g>';

  // far pyramids, pale in the haze, and the big ones in front
  const haze = '<g class="x-haze"><ellipse cx="160" cy="112" rx="190" ry="14" fill="#F6E8C8" opacity=".4"/></g>';
  // far porters, tiny, on the far pyramid and walking to it from the warehouse
  const tiny = (x, y, c, k) => person({ x, y, s: .26, skin: k, c, cap: 'pad', al: 'head', ar: 'down', load: SACK, flip: k % 2 });
  const far = '<g opacity=".85">' + tiny(124, 61.4, '#B23A2A', 1) + tiny(136, 73, '#2F6B9A', 2) + tiny(111, 77, '#E9DDC0', 3) + '</g>' +
    tiny(146, 125.2, '#6A4C93', 0) + tiny(256, 125.2, '#E9DDC0', 2);
  const pyrs = '<path d="M-10 70 Q80 64 170 72 T330 66" stroke="#F7EAD0" stroke-width="5" fill="none" opacity=".25"/><path d="M-10 52 Q120 46 210 54 T330 50" stroke="#F7EAD0" stroke-width="3" fill="none" opacity=".25"/>' +
    pyr(30, 125, 11, .55) + pyr(122, 125, 16, .72) + '<rect y="60" width="320" height="66" fill="url(#' + P + '-hz)"/>' + haze +
    '<g fill="#5A3A16" opacity=".2"><path d="M200 124.8 L247 124.8 L282 131.6 L226 131.6Z"/><path d="M292 124.8 L325 124.8 L330 129.8 L310 129.8Z"/></g>' + pyr(292, 125, 9, 1) + pyr(200, 125, 13, 1);

  // the warehouse: whitewashed earth walls under a corrugated zinc roof, its big door open on stacked sacks
  let corr = ''; for (let x = -8; x < 62; x += 2.2) corr += 'M' + n2(x) + ' 90.4 L' + n2(x - 1.6) + ' 101';
  const store = '<g><rect x="-10" y="99" width="70" height="27" fill="url(#' + P + '-wall)"/><rect x="-10" y="121" width="70" height="5" fill="#B49A6E"/>' +
    '<path d="M-12 101.6 L63 101.6 L57 90 L-6 90Z" fill="url(#' + P + '-zinc)"/><path d="' + corr + '" stroke="#7C8284" stroke-width=".3" opacity=".7"/>' +
    '<path d="M-12 101.6 H63" stroke="#6E7476" stroke-width=".8"/><g fill="#A0603A" opacity=".22"><path d="M8 97 h6 l-.6 4.4 h-5Z"/><path d="M33 99 h9 l-.3 2.6 h-8.6Z"/><path d="M48 96 h3 l.2 5.6 h-3.4Z"/></g>' +
    '<rect x="40" y="105" width="14" height="21" fill="#3B2A1A"/>' + heap(40.4, 126, 1) + '<use href="#' + P + '-s" x="43.8" y="114" fill="#B89458"/>' +
    '<path d="M54 105 l5 1.6 v20 l-5 -1Z" fill="#9AA0A2"/><path d="M40 105 h14" stroke="#6E7476" stroke-width=".8"/><rect x="2" y="106" width="6" height="5" fill="#4A3624"/><path d="M2 108.5 h6 M5 106 v5" stroke="#9AA0A2" stroke-width=".5"/></g>';

  const g = '<path d="M0 124.6 H320 V200 H0Z" fill="url(#' + P + '-gr)"/><g fill="#B88E55" opacity=".35"><ellipse cx="60" cy="150" rx="40" ry="2.4"/><ellipse cx="250" cy="165" rx="50" ry="2.6"/><ellipse cx="160" cy="190" rx="70" ry="3"/></g>' +
    // spilled groundnut shells on the ground
    '<linearGradient id="' + P + '-gn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7A5226" stop-opacity="0"/><stop offset="1" stop-color="#7A5226" stop-opacity=".3"/></linearGradient><rect y="150" width="320" height="50" fill="url(#' + P + '-gn)"/>' +
    '<linearGradient id="' + P + '-tk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A87C46" stop-opacity=".4"/><stop offset=".55" stop-color="#A87C46" stop-opacity=".3"/><stop offset="1" stop-color="#A87C46" stop-opacity="0"/></linearGradient>' +
    '<path d="M-10 128 Q80 126.4 170 129 Q230 130.4 300 133 Q240 137.6 170 139.4 Q80 138.4 -10 140Z" fill="url(#' + P + '-tk)"/>' +
    '<path d="M-10 131.6 Q80 130 168 132 Q220 133 270 134.6 M-10 138 Q80 136.4 168 137.6 Q215 137.4 262 136.2" stroke="#8E6634" stroke-width=".6" stroke-dasharray="1.2 .8" fill="none" opacity=".4"/>' +
    '<g stroke="#E8CF9C" stroke-width=".4" fill="none" opacity=".45">' + [[20, 150], [110, 156], [210, 148], [260, 160], [40, 172], [150, 178], [240, 186], [80, 190], [300, 174]].map(([x, y]) => '<path d="M' + x + ' ' + y + ' q6 -1.2 12 0 t12 0"/>').join('') + '</g>' +
    '<g stroke="#A27840" stroke-width=".35" fill="none" opacity=".35">' + [[22, 151], [112, 157], [212, 149], [262, 161], [42, 173], [152, 179], [242, 187], [82, 191], [302, 175]].map(([x, y]) => '<path d="M' + x + ' ' + y + ' q6 -1.2 12 0 t12 0"/>').join('') + '</g>' +
    '<g fill="#8E6634" opacity=".35">' + [[150, 134], [156, 137], [161, 134.4], [167, 137.4], [190, 140], [196, 143], [232, 139], [228, 143]].map(([x, y]) => '<ellipse cx="' + x + '" cy="' + y + '" rx="1" ry=".45"/>').join('') + '</g>' +
    '<g fill="#9A7848">' + [[130, 147], [176, 152], [226, 146], [98, 162], [286, 150], [190, 166], [64, 156]].map(([x, y]) => '<ellipse cx="' + x + '" cy="' + y + '" rx=".9" ry=".55"/>').join('') + '</g>' +
    '<g fill="#C79A5C">' + [[180, 131], [214, 129], [246, 131], [12, 182], [300, 186], [30, 194], [292, 195], [262, 130]].map(([x, y]) => '<ellipse cx="' + x + '" cy="' + y + '" rx=".9" ry=".5"/><ellipse cx="' + (x + 2) + '" cy="' + (y + .6) + '" rx=".8" ry=".45"/>').join('') + '</g>';

  // porters: two climb the big pyramid's right face, sack on head; one sets his down at the top; one comes back down
  const por = (x, y, s, sk, c, extra) => person(Object.assign({ x, y, s, skin: sk, c, cap: 'pad', al: 'head', ar: 'down', load: SACK, cls: 'x-w x-por' }, extra || {}));
  const climbers = [0, 1].map((i) => '<g class="x-climb c' + i + '">' + por(247, 125, .5, i + 1, i ? '#2F6B9A' : '#B23A2A', { flip: true, lean: -6, al: 'head', ar: 'staff' }) + '</g>').join('');
  const onPyr = por(201, 73.4, .48, 3, '#2E7D32', { al: 'up', ar: 'up', load: '<g transform="translate(0 -3)">' + SACK + '</g>', cls: 'x-w x-por x-top' }) +
    person({ x: 184, y: 93, s: .47, skin: 4, c: '#E9DDC0', cap: 'kube', capc: '#C62828', al: 'out', ar: 'down', cls: 'x-w x-por x-down2', lean: 4 }) +
    por(222, 101, .48, 0, '#6A4C93', { flip: true, lean: -5 });

  // the donkey, loaded with two sacks across its back, led to the scale
  const donkey = '<g transform="translate(232 127)"><ellipse cy=".2" rx="9" ry="1.2" fill="#3C2810" opacity=".22"/>' +
    '<g stroke="#6E6660" stroke-width="1.3" stroke-linecap="round"><path d="M-6 -6 L-6.6 -.4 M-3.6 -6 L-3 -.4 M4.4 -6 L4 -.4 M6.4 -6 L7 -.4"/></g><g fill="#2E2620"><rect x="-7.4" y="-1" width="1.6" height="1"/><rect x="-3.8" y="-1" width="1.6" height="1"/><rect x="3.2" y="-1" width="1.6" height="1"/><rect x="6.2" y="-1" width="1.6" height="1"/></g>' +
    '<g class="x-tail"><path d="M-7.6 -10 Q-10 -7 -9.6 -3.6" stroke="#7C746C" stroke-width=".6" fill="none"/><path d="M-9.8 -4.4 l-.4 1.6 l.9 -.2Z" fill="#3A322C"/></g>' +
    '<path d="M-8 -9.6 Q-8 -13 -4 -13 L5 -13 Q8.4 -13 8.6 -9.4 Q8.4 -6 5 -5.6 L-4.6 -5.6 Q-8 -6 -8 -9.6Z" fill="#9A928A"/><path d="M-6 -6 Q0 -4.6 6 -6" stroke="#E8E2DA" stroke-width="1.2" fill="none" opacity=".7"/>' +
    '<g class="x-dh"><path d="M6.6 -11.8 Q9 -15 11.4 -16.6 L14.6 -12.4 Q12.6 -11.6 10 -8.6Z" fill="#9A928A"/><path d="M11.4 -16.6 Q14.4 -16.4 15.8 -13.4 Q15.6 -12 14 -11.8 L12.4 -12.4Z" fill="#A8A098"/><ellipse cx="15.2" cy="-12.8" rx="1.2" ry="1" fill="#E8E2DA"/>' +
    '<path d="M10.8 -16.4 L9.4 -21.6 L11.6 -17 M12 -16.8 L12.6 -22 L13 -16.6" stroke="#8A827A" stroke-width="1" stroke-linejoin="round" fill="#8A827A"/><circle cx="12.8" cy="-14.6" r=".45" fill="#1A1410"/><path d="M8 -15 Q9 -16.4 10.6 -17" stroke="#3A322C" stroke-width=".6" fill="none"/></g>' +
    '<path d="M-4.4 -13.6 Q.6 -15 5.2 -13.6 L5.6 -11.6 L-4.8 -11.6Z" fill="#8B2E1A"/>' + '<use href="#' + P + '-s" x="-6.6" y="-15.6" fill="#D8BA80" transform="rotate(-8 -3 -14)"/><use href="#' + P + '-s" x="-.6" y="-15.8" fill="#CFAE74" transform="rotate(6 3 -14)"/>' +
    '<path d="M-3 -11.6 v4.6 M3 -11.6 v4.6" stroke="#6B4422" stroke-width=".5"/><path d="M15.4 -12.4 Q19 -10 21 -12" stroke="#6B4422" stroke-width=".35" fill="none"/></g>';

  // the mat shade on the right: the platform scale with a sack on it, the weigher, and the clerk at his ledger
  const shade = '<g><path d="M262 127 V104 M312 127 V104 M287 127 V103" stroke="#6B4A2A" stroke-width="1.1"/>' +
    '<path d="M258 105 Q287 100.6 316 105 L314 101 Q287 97 260 101Z" fill="#C9A15E"/><path d="M260 101 Q287 97 314 101" stroke="#8B6A2E" stroke-width=".5" fill="none"/><path d="M264 103 l2 -2.6 M272 102.4 l2 -2.8 M280 102 l2 -2.8 M290 102 l2 -2.8 M298 102.2 l2 -2.8 M306 102.8 l2 -2.6" stroke="#A88440" stroke-width=".35"/>' +
    // the scale: a low iron platform, the column, the beam with its sliding weight
    '<path d="M265 126.6 L283 126.6 L282 124.2 L266 124.2Z" fill="#4E5458"/><rect x="279.6" y="108" width="1.6" height="16.4" fill="#5E6468"/><path d="M272 108.6 H284" stroke="#3E4448" stroke-width="1"/><rect class="x-wt" x="276" y="107.4" width="1.6" height="2.4" fill="#C9A227"/><circle cx="283.6" cy="108.6" r=".8" fill="#3E4448"/>' +
    '<use href="#' + P + '-s" x="267" y="120.4" fill="#D8BA80"/><use href="#' + P + '-s" x="273.6" y="120.4" fill="#B89458"/><use href="#' + P + '-s" x="270.2" y="116.6" fill="#D6B676"/>' +
    person({ x: 272, y: 127, s: .52, skin: 2, c: '#F4EBD0', t: '#2E7D32', cap: 'hula', capc: '#F6F2E8', capc2: '#2E5E3A', al: 'front', ar: ['M-4.2 -24.8 Q-8 -28 -11.4 -31.6', -11.8, -32], flip: true, cls: 'x-w' }) +
    // the clerk sits behind a little table, the ledger open in front of him, his pen moving
    person({ x: 300, y: 124.6, s: .5, skin: 1, c: '#FFFFFF', t: '#1565C0', cap: 'zanna', capc: '#7A1F2B', capc2: '#E9C46A', beard: '#2A1E14', al: 'down', ar: 'write', hr: '<path d="M-.2 -16.2 l-1.6 -2.4" stroke="#1A237E" stroke-width=".5"/>', cls: 'x-clerk' }) +
    '<path d="M290 118 H310 L309 119.4 H291Z" fill="#8B5A2B"/><path d="M292 119.4 V127 M308 119.4 V127" stroke="#6B4422" stroke-width=".9"/><path d="M291 119.4 H309 V121 H291Z" fill="#000" opacity=".12"/>' +
    '<path d="M294.4 117.9 L300 116.4 L300 117.9Z M300 116.4 L305.6 117.9 L300 117.9Z" fill="#FBF6E8" stroke="#B8A77E" stroke-width=".2"/><path d="M295.6 117.4 l3 -.7 M301 117 l3 .6" stroke="#5A6A9A" stroke-width=".2"/>' +
    '<rect x="306" y="115.2" width="1.6" height="2.8" rx=".3" fill="#4A6A8A"/></g>';

  // men watching the work, one pointing up at the porters
  const men = person({ x: 176, y: 128, s: .58, skin: 0, dress: 'riga', c: '#F4EBD0', t: '#2E7D32', cap: 'borno', capc: '#F2E8CF', capc2: '#A3242C', capc3: '#1E5B3A', beard: '#E8E4DC', al: 'down', ar: 'point', flip: true, cls: 'x-w' }) +
    person({ x: 187, y: 128.6, s: .55, skin: 3, c: '#4A7FB5', t: '#F4EBD0', cap: 'zanna', capc: '#1F2E5A', capc2: '#D9B36A', capside: -1, al: 'hip', ar: 'down', cls: 'x-w' }) +
    person({ x: 254, y: 128, s: .55, skin: 5, c: '#D9C79A', t: '#6B4422', cap: 'turban', capc: '#FFFFFF', al: ['M-4.2 -24.8 Q-8 -20 -10 -17.4', -10.4, -17], ar: 'down', flip: true, cls: 'x-w',
      hl: '<path d="M-10.4 -17 Q-14 -14 -17 -15.4" stroke="#6B4422" stroke-width=".4" fill="none"/>' });

  // by the warehouse: a woman selling kosai from a tray on her head, and children watching
  const tray = '<g><ellipse cy="-36" rx="5" ry="1.1" fill="#C9A15E"/><path d="M-4.4 -36.4 Q0 -39.6 4.4 -36.4Z" fill="#E8C35A"/><g fill="#B8741E"><circle cx="-2" cy="-37.2" r=".9"/><circle cx="0" cy="-37.8" r=".9"/><circle cx="2" cy="-37.2" r=".9"/></g></g>';
  const town = person({ x: 150, y: 129.4, s: .55, skin: 2, dress: 'wom', c: '#C2185B', t: '#FFD54A', w: '#1E6E5A', w2: '#FFD54A', cap: 'kallabi', capc: '#FFB300', capc2: '#C2185B', al: 'head', ar: 'down', load: tray, cls: 'x-w' }) +
    person({ x: 142.4, y: 130, s: .36, skin: 4, c: '#E57A2A', t: '#FFF1D6', cap: 'kube', capc: '#2E5E8C', al: 'down', ar: 'front', cls: 'x-w x-kid' }) +
    person({ x: 162, y: 130.6, s: .38, skin: 0, dress: 'wom', c: '#7B3FA0', w: '#3F6FB5', w2: '#F4EBD0', cap: 'hijab', capc: '#F6C94A', al: 'down', ar: 'down', cls: 'x-w x-kid' }) +
    person({ x: 157, y: 130.2, s: .34, skin: 3, c: '#2E9E6A', cap: 'kube', capc: '#F4EBD0', al: 'up', ar: 'down', cls: 'x-w x-kid' });

  // the near corners: a few sacks and a heap of shells in front, the dust of the yard
  const near = '';

  return '<svg class="scene ' + P + '" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + defs + sky +
    egret(118, 46, .9, 'e1') + egret(146, 55, .7, 'e2') + pyrs + store + g + far + climbers + onPyr + donkey + shade + men + town + near + '</svg>';
}

/* ================= the game's own pieces, round three (Sani 2026-10-27: realism) =================
   The lorry is a bonneted northern lorry (the old Mercedes 911 shape) with a painted wooden body, parked on the
   ground; the piles stand on palm-fibre mats on the ground, not on cards. Light from the upper left, shadows fall
   to the right. Same classes the game's CSS drives: .lorry .load .ld .wheel .dust .speed, .sacks. */
const SKB = 'M3 3.5 Q1.5 .5 4.5 1.3 Q15 -.6 25.5 1.3 Q28.6 .5 27 3.5 Q30.4 9 27 14.6 Q28.6 17.6 25.5 16.8 Q15 18.8 4.5 16.8 Q1.5 17.6 3 14.6 Q-.4 9 3 3.5 Z';
const SKDEF = '<radialGradient id="gyS-hl" cx=".3" cy=".22" r=".6"><stop offset="0" stop-color="#FFF6DA" stop-opacity=".5"/><stop offset="1" stop-color="#FFF6DA" stop-opacity="0"/></radialGradient>' +
  '<linearGradient id="gyS-dk" x1="0" y1="0" x2="1" y2="1"><stop offset=".45" stop-color="#2A1806" stop-opacity="0"/><stop offset="1" stop-color="#2A1806" stop-opacity=".38"/></linearGradient>' +
  '<pattern id="gyS-mat" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="4" height="4" fill="#C9A35E"/><path d="M0 1 H4 M0 3 H4" stroke="#A9843E" stroke-width=".9"/><path d="M1 0 V1 M3 2 V3" stroke="#E2C27E" stroke-width=".8"/></pattern>';
const TINT = ['#000', '#5A3A10', '#000', '#FFF2D0'], TOP = [0, .1, .08, .1];
function gySack(x, y, k = 0) {
  const t = k % 4;
  return '<g transform="translate(' + n2(x) + ' ' + n2(y) + ')"><ellipse cx="16.4" cy="17.4" rx="14" ry="2" fill="#2A1806" opacity=".38"/>' +
    '<path d="' + SKB + '" fill="url(#k4-sackg)" stroke="#5E4218" stroke-width=".55"/><path d="' + SKB + '" fill="url(#k4-jute)" opacity=".55"/>' +
    (TOP[t] ? '<path d="' + SKB + '" fill="' + TINT[t] + '" opacity="' + TOP[t] + '"/>' : '') +
    '<path d="' + SKB + '" fill="url(#gyS-hl)"/><path d="' + SKB + '" fill="url(#gyS-dk)"/>' +
    '<path d="M6 5 Q9 7 8 11 M21 4 Q24 8 22 13 M14 13.5 Q17 12 19 14.6" stroke="#7A5826" stroke-width=".5" fill="none" opacity=".7"/>' +
    '<path d="M9.6 1.2 Q10.2 9 9.6 17 M11.3 1.1 Q11.9 9 11.3 17.2" stroke="#A8352A" stroke-width=".95" fill="none" opacity=".8"/><path d="M13 1 Q13.6 9 13 17.3" stroke="#2E6E30" stroke-width=".95" fill="none" opacity=".8"/>' +
    '<text x="20" y="10.4" text-anchor="middle" font-size="3.1" font-weight="800" fill="#3E2A10" opacity=".5" font-family="Baloo 2,sans-serif">GYAƊA</text>' +
    '<path d="M4.6 3.2 Q15 1.6 25.6 3.2" stroke="#4E3A18" stroke-width=".5" stroke-dasharray="1.1 .9" fill="none"/>' +
    '<path d="M3 3.5 q-1.6 -1.6 -2.4 -3 M3 14.6 q-1.6 1.6 -2.4 3 M27 3.5 q1.6 -1.6 2.4 -3 M27 14.6 q1.6 1.6 2.4 3" stroke="#6E4E1E" stroke-width="1.2" stroke-linecap="round" fill="none"/></g>';
}
/** n sacks in a stepped pile on a mat; the mat and the scale are the same for every pile of the round (cap) */
export function gySacks(n, cap = 20) {
  const rows = []; let left = n, w = Math.max(1, Math.ceil((Math.sqrt(8 * n + 1) - 1) / 2));
  while (left > 0) { const r = Math.min(w, left); rows.push(r); left -= r; w = Math.max(1, w - 1); }
  const SW = 27, SH = 14, maxw = rows[0] * SW, cx = maxw / 2; let out = '', y = 142, k = n * 3;
  rows.forEach((r) => { const x0 = cx - r * SW / 2; for (let i = 0; i < r; i++) out += gySack(x0 + i * SW, y - 18, k++); y -= SH; });
  const wc = Math.ceil((Math.sqrt(8 * cap + 1) - 1) / 2), Wc = wc * SW, W = Wc + 14, H = wc * SH + 26, ml = cx - Wc / 2 - 2, mr = cx + Wc / 2 + 2;
  const mat = '<path d="M' + n2(ml - 2) + ' 149 L' + n2(mr + 6) + ' 149.4 L' + n2(mr + 1) + ' 137.6 L' + n2(ml + 3) + ' 137.4Z" fill="#2A1806" opacity=".18" transform="translate(2.4 1.4)"/>' +
    '<path d="M' + n2(ml - 2) + ' 148.4 L' + n2(mr + 4) + ' 148.6 L' + n2(mr) + ' 137 L' + n2(ml + 2) + ' 136.8Z" fill="url(#gyS-mat)" stroke="#7E5E28" stroke-width=".7"/>' +
    '<path d="M' + n2(ml - 1) + ' 147 H' + n2(mr + 3) + '" stroke="#9A7434" stroke-width="1.1" opacity=".7"/>' +
    '<path d="M' + n2(ml - 2) + ' 148.4 L' + n2(mr + 4) + ' 148.6" stroke="#E6CC92" stroke-width=".5" stroke-dasharray=".6 .8"/>';
  const cast = '<ellipse cx="' + n2(cx + maxw * .12) + '" cy="143.2" rx="' + n2(maxw * .58) + '" ry="3.2" fill="#2A1806" opacity=".3"/>';
  return '<svg class="sacks gys" viewBox="' + n2(cx - W / 2) + ' ' + (151 - H) + ' ' + n2(W) + ' ' + H + '" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><defs>' + SKDEF + '</defs>' + mat + cast + out + '</svg>';
}
/** the sacks on the back of the lorry, piled above the sides the way they are in the north; each drops in in turn */
export function gyLorryLoad(n) {
  let out = '', k = 0;
  for (let r = 0; k < n; r++) { const inRow = Math.min(8 - (r % 2), n - k);
    for (let i = 0; i < inRow; i++, k++) out += '<g class="ld" style="--i:' + k + '"><g transform="translate(' + (16 + i * 22 + (r % 2) * 11) + ' ' + (31 - r * 11.5) + ') scale(.84)">' + gySack(0, 0, k) + '</g></g>'; }
  return out;
}
function wheel(x) {
  let nuts = ''; for (let a = 0; a < 6; a++) nuts += '<circle cx="' + n2(x + 4.4 * Math.cos(a * Math.PI / 3)) + '" cy="' + n2(125 + 4.4 * Math.sin(a * Math.PI / 3)) + '" r=".8" fill="#E8E8E8"/>';
  return '<ellipse cx="' + (x + 4) + '" cy="142" rx="17" ry="2.2" fill="#1A0E04" opacity=".55"/>' +
    '<g class="wheel" style="transform-origin:' + x + 'px 125px"><circle cx="' + x + '" cy="125" r="17" fill="url(#gyL-tyre)"/>' +
    '<circle cx="' + x + '" cy="125" r="15.8" fill="none" stroke="#2C2C2C" stroke-width="2.2" stroke-dasharray="2 1.7"/>' +
    '<circle cx="' + x + '" cy="125" r="10.4" fill="url(#gyL-rim)" stroke="#111" stroke-width="1"/><circle cx="' + x + '" cy="125" r="6.6" fill="#C9CED2" stroke="#7D848A" stroke-width=".6"/>' +
    nuts + '<circle cx="' + x + '" cy="125" r="2.4" fill="#5A6066"/><path d="M' + (x - 9) + ' 120 A10 10 0 0 1 ' + (x - 3) + ' 115.6" stroke="#fff" stroke-width=".9" opacity=".45" fill="none"/></g>';
}
/** a northern lorry, side on, facing right: the long bonnet, a painted wooden body, a driver at the window */
export function gyLorry() {
  const defs = '<defs>' + SKDEF +
    '<linearGradient id="gyL-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9A562"/><stop offset=".6" stop-color="#B57E42"/><stop offset="1" stop-color="#8E5C2C"/></linearGradient>' +
    '<linearGradient id="gyL-cab" x1="0" y1="0" x2=".5" y2="1"><stop offset="0" stop-color="#4C93CF"/><stop offset=".55" stop-color="#2468A8"/><stop offset="1" stop-color="#174A7C"/></linearGradient>' +
    '<linearGradient id="gyL-top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF8E6"/><stop offset="1" stop-color="#D9CCAE"/></linearGradient>' +
    '<linearGradient id="gyL-gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#D8EEF4"/><stop offset=".5" stop-color="#8FB4C2"/><stop offset="1" stop-color="#4E6E7A"/></linearGradient>' +
    '<linearGradient id="gyL-cr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FAFAFA"/><stop offset=".5" stop-color="#9AA0A6"/><stop offset="1" stop-color="#DADDE0"/></linearGradient>' +
    '<linearGradient id="gyL-lit" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF4D8" stop-opacity=".22"/><stop offset=".5" stop-color="#FFF4D8" stop-opacity="0"/><stop offset="1" stop-color="#1A0E04" stop-opacity=".28"/></linearGradient>' +
    '<radialGradient id="gyL-tyre" cx=".42" cy=".38" r=".62"><stop offset=".55" stop-color="#3A3A3A"/><stop offset="1" stop-color="#0E0E0E"/></radialGradient>' +
    '<radialGradient id="gyL-rim" cx=".38" cy=".34" r=".7"><stop offset="0" stop-color="#E5534B"/><stop offset="1" stop-color="#8E1C16"/></radialGradient>' +
    '<radialGradient id="gyL-dust" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#E2CC9A" stop-opacity=".85"/><stop offset="1" stop-color="#E2CC9A" stop-opacity="0"/></radialGradient></defs>';
  // planks with their grain; three painted bands; posts with bolts
  let planks = '', grain = '';
  for (let k = 0; k < 7; k++) { const y = 50 + k * 7.4; planks += '<rect x="12" y="' + n2(y) + '" width="184" height="7.4" fill="url(#gyL-wood)"/>';
    for (let g = 0; g < 3; g++) { const x0 = 14 + ((k * 37 + g * 61) % 150); grain += 'M' + x0 + ' ' + n2(y + 2 + g * 1.7) + ' q8 -.9 16 0 t16 .2'; } }
  const bands = '<rect x="12" y="50" width="184" height="7.4" fill="#F1E3BF"/><rect x="12" y="64.8" width="184" height="7.4" fill="#2E7D32"/>' +
    '<path d="M12 72.2 l6 -7.4 l6 7.4 l6 -7.4 l6 7.4 l6 -7.4 l6 7.4 l6 -7.4 l6 7.4 l6 -7.4 l6 7.4 l6 -7.4 l6 7.4 l6 -7.4 l6 7.4 l6 -7.4 l6 7.4 l6 -7.4 l6 7.4 l6 -7.4 l6 7.4 l6 -7.4 l6 7.4 l6 -7.4 l6 7.4 l6 -7.4 l6 7.4 l6 -7.4 l6 7.4 l6 -7.4 l6 7.4" stroke="#FFD54A" stroke-width="1.3" fill="none"/>' +
    '<rect x="12" y="87" width="184" height="7.4" fill="#B3261E"/><g fill="#F1E3BF">' + [24, 48, 72, 96, 120, 144, 168].map((x) => '<path d="M' + x + ' 88.4 l3 2.3 l-3 2.3 l-3 -2.3Z"/>').join('') + '</g>' +
    '<text x="104" y="56.2" text-anchor="middle" style="font:800 5.6px var(--disp,sans-serif);letter-spacing:.4px" fill="#8E2414">ALLAH YA KIYAYE</text>';
  const posts = [12, 70, 134, 192].map((x) => '<rect x="' + x + '" y="47" width="4" height="56" fill="#6E4320"/><path d="M' + (x + .7) + ' 48 V102" stroke="#A8743E" stroke-width=".6"/><circle cx="' + (x + 2) + '" cy="61" r=".7" fill="#C9CED2"/><circle cx="' + (x + 2) + '" cy="83" r=".7" fill="#C9CED2"/>').join('');
  const body = planks + bands + '<path d="' + grain + '" stroke="#6E4320" stroke-width=".35" fill="none" opacity=".45"/>' +
    '<path d="M12 57.4 H196 M12 64.8 H196 M12 72.2 H196 M12 79.6 H196 M12 87 H196 M12 94.4 H196" stroke="#4A2C12" stroke-width=".55" opacity=".7"/>' +
    posts + '<rect x="10" y="45.6" width="190" height="3.2" rx="1" fill="#4A2C12"/><rect x="10" y="101.6" width="190" height="5.4" fill="#3A220E"/>' +
    '<rect x="12" y="50" width="184" height="52" fill="url(#gyL-lit)"/>' +
    // the headboard rising over the cab roof, and the rack over the cab
    '<path d="M196 30 H203 V102 H196Z" fill="#6E4320"/><path d="M197 31 V101" stroke="#A8743E" stroke-width=".7"/><path d="M200 33 H246 M200 37 H244" stroke="#3A220E" stroke-width="1.6"/><path d="M208 33 V40 M222 33 V40 M236 33 V40" stroke="#3A220E" stroke-width="1.2"/>';
  const chassis = '<path d="M16 113 L284 113 L292 141 L22 141Z" fill="#1A0E04" opacity=".26"/>' +
    '<rect x="14" y="107" width="272" height="6" fill="#222"/><path d="M14 107.6 H286" stroke="#555" stroke-width=".6"/>' +
    '<rect x="124" y="111" width="30" height="11" rx="5.5" fill="#2A2A2A"/><ellipse cx="139" cy="116.5" rx="11" ry="4" fill="#3A3A3A"/>' +
    '<rect x="170" y="109" width="30" height="12" rx="4" fill="url(#gyL-cr)"/><path d="M174 111 v8 M196 111 v8" stroke="#7D848A" stroke-width=".7"/>' +
    '<path d="M60 108 Q84 96 108 108" stroke="#1E1E1E" stroke-width="3.6" fill="none"/><rect x="104" y="108" width="4" height="12" fill="#1E1E1E"/>';
  const cab = '<path d="M202 112 V46 Q202 40 208 40 L240 40 Q246 40 247 46 L251 74 Q272 70 286 76 Q293 80 293 92 L293 112Z" fill="url(#gyL-cab)"/>' +
    '<path d="M202 46 Q202 40 208 40 L240 40 Q246 40 247 46 L250 66 H202Z" fill="url(#gyL-top)"/>' +
    '<path d="M202 74 H251 Q272 70 286 76 Q290 78 291.4 81" stroke="#E8731A" stroke-width="2.6" fill="none"/>' +
    '<path d="M207 46 L239 46 Q243 46 244 50 L246 70 H207Z" fill="url(#gyL-gl)" stroke="#2A3A44" stroke-width=".8"/>' +
    // the driver, cap on, elbow on the sill
    '<g><path d="M219 70 Q219 61 226 60.6 Q233 61 233 70Z" fill="#F4EBD0"/><circle cx="227" cy="56" r="4.6" fill="#5E3A1C"/><path d="M222.6 54.6 Q222.6 49.4 227 49.2 Q231.4 49.4 231.4 54.6Z" fill="#F4EBD0"/><path d="M223 53 l.8 -.8 .8 .8 .8 -.8 .8 .8 .8 -.8 .8 .8 .8 -.8 .8 .8 .8 -.8" stroke="#2E7D32" stroke-width=".4" fill="none"/><circle cx="229.6" cy="56" r=".5" fill="#1A0E06"/>' +
    '<path d="M231 68 Q238 66 245 69.6" stroke="#F4EBD0" stroke-width="3.4" stroke-linecap="round" fill="none"/><circle cx="245.6" cy="69.6" r="1.5" fill="#5E3A1C"/></g>' +
    '<path d="M209 47.4 L224 47.4 L212 60Z" fill="#fff" opacity=".22"/>' +
    '<path d="M204 76 V110 M249 76 V110" stroke="#123A60" stroke-width=".7"/><rect x="236" y="80" width="7" height="1.6" rx=".8" fill="url(#gyL-cr)"/>' +
    '<path d="M255 82 l14 -1.6 M256 86 l14 -1.6 M257 90 l14 -1.6" stroke="#123A60" stroke-width=".8" opacity=".7"/>' +
    '<path d="M286 76 Q293 80 293 92 V112 H288 Q289 92 284 78Z" fill="#0E2E50" opacity=".45"/>' +
    '<circle cx="288" cy="92" r="4.2" fill="url(#gyL-cr)"/><circle cx="288.6" cy="92" r="2.8" fill="#FFF6C8"/><rect x="287" y="99" width="4" height="2.4" fill="#F29A2E"/>' +
    '<path d="M247 50 L255 46" stroke="#333" stroke-width="1"/><rect x="254" y="40" width="3" height="12" rx="1" fill="#2A2A2A"/>' +
    '<rect x="212" y="112" width="24" height="3" fill="#2A2A2A"/><rect x="282" y="110" width="15" height="5" rx="1.2" fill="url(#gyL-cr)"/>' +
    '<path d="M244 112 A22 22 0 0 1 288 112Z" fill="#111"/><path d="M243 112 A23 23 0 0 1 289 112" stroke="#0E2E50" stroke-width="2.6" fill="none"/>';
  const dust = '<g class="dust"><circle cx="0" cy="134" r="12" fill="url(#gyL-dust)"/><circle cx="-14" cy="126" r="16" fill="url(#gyL-dust)"/><circle cx="12" cy="138" r="8" fill="url(#gyL-dust)"/></g>';
  return '<svg class="lorry gyl" viewBox="-20 0 320 150" aria-hidden="true">' + defs +
    '<ellipse cx="160" cy="142" rx="150" ry="5" fill="#1A0E04" opacity=".22"/>' + chassis +
    '<g class="load"></g>' + body + cab + wheel(84) + wheel(266) + dust + '<g class="speed"></g></svg>';
}
