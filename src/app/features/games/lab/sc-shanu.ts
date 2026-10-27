// @ts-nocheck
import { arewaCap, CAPS } from './capsArewa';
/*
 * Kasuwar dabbobi (was Kasuwar shanu), drawn (Sani 2026-10-25: the same hand as Hawan Sallah; 2026-10-26: a mixed livestock
 * market, goats, rams, a few cattle, poultry as background life). Originally a big open cattle market in the morning, like
 * Wudil or Potiskum: dust hanging in the air, a town and its minaret on the far side, herds of White Fulani, Red Bororo
 * with their tall lyre horns and Sokoto Gudali spread across the yard, each with a Fulani herder in a malafa hat with
 * his staff. On the left a tea seller's stand under a neem, a man on the bench with his glass, the trough where two
 * cattle drink; in the middle distance a buyer in babban riga haggles with an owner, a calf beside them; on the right
 * a lorry is loaded up an earth ramp, a Bororo bull being walked up into it, the driver and a buyer counting notes.
 * The game's own cattle, posts and price boards stand across the front, so the life is in the background band.
 *
 * Classes for sc-shanu.css (transform and opacity only):
 *   every person: .x-p · .x-hd · .x-al / .x-ar · .x-ms / .x-mf   ·   .x-w (cheers) · .x-hr herders (raise staffs)
 *   .x-shrug (shrugs when sad) · cattle: .x-cow · .x-ch (head) · .x-tl (tail) · .x-calf · .x-up (the bull on the ramp)
 *   .x-eg egrets · .x-du dust · .x-stm the tea's steam
 */
const P = 'sh4';
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
  malafa: (c, c2) => '<path d="M-8.4 -33.2 Q0 -36.4 8.4 -33.2 Q0 -31.6 -8.4 -33.2Z" fill="' + c + '"/><path d="M-8.4 -33.2 Q0 -31.6 8.4 -33.2" stroke="' + c2 + '" stroke-width=".5" fill="none"/><path d="M-4.4 -34.4 L-.9 -40.6 Q0 -41.4 .9 -40.6 L4.4 -34.4 Q0 -35.4 -4.4 -34.4Z" fill="' + c + '"/>' +
    '<path d="M-1.3 -39.8 Q0 -42.6 1.3 -39.8 Z" fill="' + c2 + '"/><path d="M-3.6 -35.8 Q0 -36.8 3.6 -35.8" stroke="' + c2 + '" stroke-width=".9" fill="none"/><path d="M-3 -38 L-1.6 -37.6 M3 -38 L1.6 -37.6" stroke="#B08A40" stroke-width=".3"/><path d="M-3.4 -33 Q-3 -29 -1.4 -28" stroke="' + c2 + '" stroke-width=".3" fill="none"/>',
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
  if (o.dress === 'sit') return '<path d="M-4.8 -26 Q0 -27.6 4.8 -26 L6 -13.4 Q9.6 -13 9.8 -10.4 L10.2 -1 Q7 .2 3.8 -1 L3.8 -8.6 L-6.4 -8.8 Q-7 -11 -5.6 -12.6Z" fill="' + c + '"/>' +
    '<path d="M0 -27.2 Q3.4 -27 4.8 -26 L6 -13.4 L0 -12Z M3.8 -8.6 L10.2 -1 Q7 .2 3.8 -1Z" fill="#000" opacity=".12"/><path d="M-5.6 -12.4 Q2 -13.6 9.6 -11" stroke="#000" stroke-opacity=".12" stroke-width=".5" fill="none"/>' +
    '<path d="M-1.8 -26.2 L0 -21.6 L1.8 -26.2" stroke="' + t + '" stroke-width=".5" fill="none"/><circle cx="-.4" cy="-19" r="1.3" fill="none" stroke="' + t + '" stroke-width=".45"/>';
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
  const feet = '<use href="#' + P + '-ft"' + (o.dress === 'sit' ? ' x="7.2"' : '') + '/>';
  return '<g transform="translate(' + n2(o.x) + ' ' + n2(o.y) + ') scale(' + (o.flip ? -s : s) + ' ' + s + ')' + (o.lean ? ' rotate(' + o.lean + ')' : '') + '"><g class="x-p ' + (o.cls || '') + '">' +
    '<ellipse cy=".1" rx="' + (o.dress === 'riga' ? 10 : 7) + '" ry="1.3" fill="#3C2810" opacity=".22"/>' + feet + body(o) + head(o, sk) + (o.load || '') +
    arm('l', o.al || 'down', o.c, sk, o.hl, wide) + arm('r', o.ar || 'down', o.c, sk, o.hr, wide) + (o.front || '') + '</g></g>';
}


const egret = (x, y, s, cls) => '<g class="x-eg ' + cls + '"><g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
  '<path d="M-6 0 Q-2 -1.6 3 -.6 L6.4 -1.6 L4 .4 Q0 1.4 -6 0Z" fill="#FFFDF6"/><path class="x-wg" d="M-2 -.6 Q1 -7 6 -6.4 Q2 -3 1.4 -.4Z" fill="#F4F0E4"/><path d="M6.4 -1.6 l2.4 .4 l-2.2 .4" fill="#E8B730"/><path d="M-6 .2 l-3 1.4" stroke="#3A2A1A" stroke-width=".4"/></g></g>';


/* ---------------- cattle (shapes copied and simplified from the game's zebu, drawn 1/8 size): side view facing right,
   feet at 0, about 22 long. Still cattle are <use> of a breed symbol; the few that move are drawn inline. ---------------- */
const BREED = {
  // White Fulani: white coat, black muzzle and ear tips, long lyre horns
  wf: { c: '#F6F3EC', d: '#D6CEBF', horn: '#EFE6D2', tip: '#3A2A1E', m: '#2B211A', e: '#2B211A', h: 'M192 66 C178 52 182 32 196 20 M198 64 C212 50 224 40 218 20' },
  // Red Bororo: deep red, tall pale horns
  rb: { c: '#A8431E', d: '#6E2A10', horn: '#F1E2C0', tip: '#8A7350', m: '#3A1A0A', e: '#7A3416', h: 'M192 66 C176 50 178 22 190 6 M198 64 C214 48 226 28 220 6' },
  // Sokoto Gudali: cream and grey, short horns, the heavy dewlap
  gu: { c: '#EDE6D8', d: '#BDB3A2', horn: '#E6DCC6', tip: '#6A5A44', m: '#4A403A', e: '#9A9086', h: 'M192 66 C186 58 188 50 194 46 M198 64 C206 58 210 52 208 46' },
};
const leg = (x, top, front, col) => '<path d="' + (front
  ? 'M' + (x - 6) + ' ' + top + ' L' + (x + 7) + ' ' + top + ' L' + (x + 5) + ' ' + (top + 22) + ' L' + (x + 4) + ' 143 L' + (x - 2) + ' 143 L' + (x - 3) + ' ' + (top + 22) + 'Z'
  : 'M' + (x - 10) + ' ' + top + ' L' + (x + 8) + ' ' + (top + 2) + ' L' + (x + 4) + ' ' + (top + 20) + ' L' + (x + 5) + ' 143 L' + (x - 1) + ' 143 L' + (x - 3) + ' ' + (top + 24) + 'Z') + '" fill="' + col + '"/>' +
  '<path d="M' + (front ? x - 3 : x - 1.5) + ' 141 h' + (front ? 8 : 7.5) + ' l1 7 h-10Z" fill="#231A14"/>';
/** the cow's drawing in the zebu's own 240×160 frame; down = the head lowered to graze or drink */
function cowArt(k, down, calf) {
  const c = BREED[k], d = c.d, h = calf ? 'M192 66 C190 60 192 56 195 54 M198 64 C202 60 204 58 203 54' : c.h;
  return '<ellipse cx="118" cy="150" rx="70" ry="5" fill="#3C2810" opacity=".22"/>' + leg(76, 104, false, d) + leg(146, 108, true, d) +
    '<g class="x-tl"><path d="M52 70 Q42 96 46 132" stroke="' + d + '" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M42 126 q2 14 8 4 q0 -8 -8 -4Z" fill="#231A14"/></g>' +
    '<path d="M126 70 C124 44 146 34 160 48 C166 56 164 66 158 72Z" fill="' + c.c + '"/>' +
    '<path d="M54 66 C66 56 110 58 140 60 C160 62 172 76 172 94 C172 108 164 116 152 118 C130 122 100 122 82 118 C64 116 50 106 48 90 C47 80 49 72 54 66Z" fill="' + c.c + '"/>' +
    '<path d="M62 70 Q100 62 140 66" stroke="#fff" stroke-opacity=".25" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M50 92 C54 108 66 116 82 118 L80 104 C70 102 60 98 50 92Z M100 112 Q126 122 152 116 L150 110 Q126 116 100 108Z" fill="#000" opacity=".08"/>' +
    (k === 'gu' ? '<path d="M128 62 C150 58 168 70 172 92 C170 104 162 112 150 116 C150 96 142 74 128 62Z" fill="' + d + '" opacity=".55"/>' : '') +
    leg(64, 100, false, c.c) + leg(158, 108, true, c.c) +
    (down ? '<g transform="rotate(' + (down === true ? 40 : down) + ' 156 74)">' : '<g>') + '<g class="x-ch"><path d="M146 62 C162 60 178 62 190 70 L196 92 C186 96 176 102 168 108 L150 96Z" fill="' + c.c + '"/>' +
    '<path d="M164 102 C168 ' + (k === 'gu' ? 132 : 124) + ' 180 ' + (k === 'gu' ? 136 : 128) + ' 192 ' + (k === 'gu' ? 118 : 114) + ' L196 94Z" fill="' + d + '"/>' +
    '<path d="' + h + '" stroke="' + c.horn + '" stroke-width="6" fill="none" stroke-linecap="round"/>' +
    '<path d="M187 64 C196 60 204 64 207 72 L219 100 C222 110 212 116 204 111 L189 92 C184 84 183 72 187 64Z" fill="' + c.c + '"/>' +
    '<ellipse cx="212" cy="106" rx="8" ry="6.5" transform="rotate(-30 212 106)" fill="' + c.m + '"/><circle cx="197" cy="77" r="2.6" fill="#140C06"/>' +
    '<path d="M189 72 C180 70 172 74 170 80 C178 82 186 80 190 77Z" fill="' + d + '"/><path d="M176 74 C172 76 170 78 170 80 C174 80 176 79 178 77Z" fill="' + c.e + '"/></g></g>';
}
const FRAME = 'scale(.125) translate(-118 -150)';
/** a still cow: a <use> of its breed's symbol */
const cow = (x, y, s, k, flip, head = 'up') => '<use href="#' + P + '-c' + k + (head === 'down' ? 'd' : head === 'drink' ? 'k' : '') + '" transform="translate(' + n2(x) + ' ' + n2(y) + ') scale(' + (flip ? -s : s) + ' ' + s + ')"/>';
/** a cow that moves (drinks, switches its tail, hops): drawn inline so CSS can reach its head and tail */
const cowLive = (x, y, s, k, flip, head, cls, calf) => '<g transform="translate(' + n2(x) + ' ' + n2(y) + ') scale(' + (flip ? -s : s) + ' ' + s + ')"><g class="x-cow ' + cls + '"><g transform="' + FRAME + '">' + cowArt(k, head === 'down' ? true : head === 'drink' ? 24 : false, calf) + '</g></g></g>';
const calf = (x, y, s, k, flip) => cowLive(x, y, s, k, flip, 'up', 'x-calf', true);
const COWDEFS = () => ['wf', 'rb', 'gu'].map((k) => '<g id="' + P + '-c' + k + '" transform="' + FRAME + '">' + cowArt(k, false).replace(/ class="x-(tl|ch)"/g, '') + '</g>' +
  '<g id="' + P + '-c' + k + 'd" transform="' + FRAME + '">' + cowArt(k, true).replace(/ class="x-(tl|ch)"/g, '') + '</g>').join('') +
  '<g id="' + P + '-crbk" transform="' + FRAME + '">' + cowArt('rb', 24).replace(/ class="x-(tl|ch)"/g, '') + '</g>';

/* a neem tree: a stout trunk and a broad round canopy of small leaves */
const neem = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-2.4 0 Q-3 -14 -1.6 -24 L1.6 -24 Q3 -14 2.4 0Z" fill="#5A3A1E"/><path d="M0 -18 L-9 -27 M0 -16 L10 -26 M0 -22 L-3 -32" stroke="#5A3A1E" stroke-width="1.6" stroke-linecap="round"/>' +
  '<g fill="#3E6B2E"><ellipse cx="0" cy="-34" rx="20" ry="11"/><ellipse cx="-11" cy="-28" rx="11" ry="7"/><ellipse cx="11" cy="-29" rx="11" ry="7"/></g>' +
  '<g fill="#5A8A3C"><ellipse cx="-5" cy="-38" rx="11" ry="6"/><ellipse cx="8" cy="-35" rx="8" ry="5"/><ellipse cx="-14" cy="-31" rx="5" ry="3"/></g><g fill="#7AA64C" opacity=".7"><ellipse cx="-6" cy="-41" rx="6" ry="2.6"/><ellipse cx="9" cy="-38" rx="4" ry="2"/></g></g>';

/* bring a group nearer: scale k about (x, y), then drop it dy */
const near_ = (g, x, y, k, dy) => '<g transform="translate(' + x + ' ' + (y + dy) + ') scale(' + k + ') translate(' + (-x) + ' ' + (-y) + ')">' + g + '</g>';
/* ---- the market's poultry, background life only (Sani 2026-10-26: "the fowls can be bg noise"): drawn facing right,
   feet at 0, about 30 units tall; the scene scales them down ---- */
/** a local cock: red-brown with golden hackles, the dark green sickle tail, a big red comb and wattles */
const cock = (cls = '') => '<g class="' + cls + '">' +
  '<path d="M-6 -15 C-12 -30 -22 -30 -24 -18 M-7 -14 C-15 -26 -24 -22 -23 -11 M-7 -13 C-14 -20 -20 -16 -19 -8" stroke="#16241C" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
  '<path d="M-6 -15 C-12 -30 -22 -30 -24 -18" stroke="#2E6B4A" stroke-width=".8" fill="none" opacity=".8"/>' +
  '<path d="M-1 -7 L-2 0 M3 -7 L4 0" stroke="#D9A93A" stroke-width="1.3"/><path d="M-4.4 0 h4.6 M1.8 0 h4.6" stroke="#D9A93A" stroke-width=".9" stroke-linecap="round"/>' +
  '<path d="' + sm([[-10, -12], [-8, -17], [-2, -20], [5, -19], [10, -16], [9, -10], [3, -6], [-4, -6.4]]) + '" fill="#8B3A12"/>' +
  '<path d="' + sm([[-6, -14], [-1, -17], [6, -15], [4, -10], [-3, -9.6]]) + '" fill="#5A2410"/><path d="M-4 -12 q4 1.4 8 -.4 M-3 -10.4 q3.4 1 6.6 -.4" stroke="#2A1206" stroke-width=".5" fill="none" opacity=".6"/>' +
  '<path d="' + sm([[4, -18], [6, -25], [9, -30], [12, -28], [11.4, -22], [10, -16]]) + '" fill="#D98A2A"/><path d="M6 -24 q2 4 4 7 M8 -26 q1.6 4 2.6 8" stroke="#A85A16" stroke-width=".5" fill="none"/>' +
  '<circle cx="10" cy="-28.6" r="2.6" fill="#C8642A"/><path d="M7.6 -30.4 l.8 -2.2 .9 1.4 .9 -2.4 .9 1.6 1 -2 .6 2.4 Q12 -30 10.6 -30.6Z" fill="#D62A1A"/>' +
  '<path d="M12.2 -29.2 l2.4 .8 -2.4 .8Z" fill="#E8B83A"/><path d="M11 -27 q.4 3 -1 3.6 q-1 -1.4 -.2 -3.4Z" fill="#D62A1A"/><circle cx="10.6" cy="-29.2" r=".55" fill="#1A0E06"/></g>';
/** a brown speckled hen, smaller, her tail short and up */
const hen = (cls = '') => '<g class="' + cls + '">' +
  '<path d="M-1 -6 L-1.6 0 M2.4 -6 L3 0" stroke="#C99A3A" stroke-width="1.1"/><path d="M-3.6 0 h3.8 M1 0 h3.8" stroke="#C99A3A" stroke-width=".8" stroke-linecap="round"/>' +
  '<g class="x-hb"><path d="' + sm([[-9, -11], [-10, -17, 1], [-5, -15], [0, -17], [6, -16], [9, -12], [7, -7], [1, -5], [-5, -6]]) + '" fill="#A0652E"/>' +
  '<path d="' + hairs([-8, -15, 7, -7], 18, 1.4, 2.8, 5, .3) + '" stroke="#5A3414" stroke-width=".6" fill="none" opacity=".7"/>' +
  '<path d="' + sm([[-5, -12], [0, -14], [5, -12], [2, -8.6], [-3, -8.6]]) + '" fill="#7A4A20"/>' +
  '<path d="' + sm([[4, -15], [6, -20], [9, -23], [11, -21], [10, -16], [8, -12]]) + '" fill="#B87A3A"/><circle cx="9.4" cy="-22" r="2.1" fill="#B87A3A"/><path d="M8 -23.8 q1 -1.4 2.4 -.4 q-1 .4 -2.4 .4Z" fill="#D62A1A"/>' +
  '<path d="M11.2 -22.4 l2 .6 -2 .7Z" fill="#E8B83A"/><circle cx="10" cy="-22.6" r=".45" fill="#1A0E06"/><path d="M10.6 -20.8 q.2 1.6 -.6 1.8" stroke="#D62A1A" stroke-width=".8" fill="none"/></g></g>';
/** a local turkey cock displaying: the tail fanned, the body puffed, the bare red and blue head, the snood and wattle */
const turkey = (cls = '', fold = false) => {
  let fan = ''; for (let i = 0; i <= 12; i++) { const a = Math.PI * (1.06 + i * .072), x = -4 + Math.cos(a) * 19, y = -15 + Math.sin(a) * 19, x2 = -4 + Math.cos(a + .05) * 19, y2 = -15 + Math.sin(a + .05) * 19;
    fan += '<path d="M-4 -15 L' + r1(x) + ' ' + r1(y) + ' Q' + r1(-4 + Math.cos(a + .036) * 20.6) + ' ' + r1(-15 + Math.sin(a + .036) * 20.6) + ' ' + r1(x2) + ' ' + r1(y2) + 'Z" fill="' + (i % 2 ? '#3A2A1E' : '#2E2018') + '"/>'; }
  if (fold) fan = '<path d="' + sm([[-8, -16], [-15, -11], [-20, -3], [-17, -1.6], [-11, -6], [-6, -10]]) + '" fill="#2E2018"/><path d="M-10 -12 L-18 -3 M-9 -10 L-15 -2.4" stroke="#B88A4A" stroke-width=".7" opacity=".7"/>';
  return '<g class="' + cls + '"><g class="x-fan">' + fan + (fold ? '</g>' : '<path d="M' + r1(-4 + Math.cos(Math.PI * 1.05) * 16.4) + ' ' + r1(-15 + Math.sin(Math.PI * 1.05) * 16.4) + ' A16.4 16.4 0 0 1 ' + r1(-4 + Math.cos(Math.PI * 1.95) * 16.4) + ' ' + r1(-15 + Math.sin(Math.PI * 1.95) * 16.4) + '" stroke="#B88A4A" stroke-width="1.4" fill="none"/>' +
    '<path d="M' + r1(-4 + Math.cos(Math.PI * 1.05) * 18.8) + ' ' + r1(-15 + Math.sin(Math.PI * 1.05) * 18.8) + ' A18.8 18.8 0 0 1 ' + r1(-4 + Math.cos(Math.PI * 1.95) * 18.8) + ' ' + r1(-15 + Math.sin(Math.PI * 1.95) * 18.8) + '" stroke="#E8DCC4" stroke-width="1.2" fill="none"/></g>') +
    '<path d="M-1 -5 L-2 0 M3 -5 L4 0" stroke="#C9A08A" stroke-width="1.4"/><path d="M-4.6 0 h4.6 M1.6 0 h4.6" stroke="#C9A08A" stroke-width=".9" stroke-linecap="round"/>' +
    '<path d="' + sm([[-11, -12], [-8, -20], [0, -22], [7, -19], [10, -13], [6, -6], [-2, -4.6], [-9, -7]]) + '" fill="#2A1E16"/>' +
    '<path d="' + hairs([-10, -20, 8, -6], 30, 1.8, 1.6, 9, .5) + '" stroke="#8A6A3E" stroke-width=".6" fill="none" opacity=".75"/>' +
    '<path d="M6 -19 Q9 -22 9 -27" stroke="#2A1E16" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M7.6 -24 q2 -4 1.8 -5.6" stroke="#8AB0D8" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
    '<circle cx="9.6" cy="-29.4" r="2.2" fill="#9CC0E0"/><path d="M10.4 -31 q1.6 -.4 2 1.4 q.4 2.4 -.6 4" stroke="#C8323A" stroke-width="1.1" fill="none" stroke-linecap="round"/>' +
    '<path d="M8.4 -27.6 q-.6 3.4 1.6 4.6 q1.2 -1.6 .4 -4" fill="#C8323A"/><path d="M11.6 -29.4 l1.8 .6 -1.8 .7Z" fill="#D8C8A8"/><circle cx="10" cy="-30" r=".5" fill="#1A0E06"/>' +
    '<path d="M7 -15 l1 4" stroke="#1A120C" stroke-width="1" stroke-linecap="round"/></g>';
};
/** a wicker cage (kwando) turned over the turkeys: the hoops and ribs of split cane */
const cage = () => {
  let d = ''; for (let i = -4; i <= 4; i++) d += 'M' + (i * 3) + ' 0 Q' + r1(i * 3.4) + ' -20 0 -21 ';
  return '<path d="M-14 0 Q-14 -21 0 -21 Q14 -21 14 0Z" fill="#C9A46A" opacity=".18"/><path d="' + d + '" stroke="#A8844A" stroke-width=".7" fill="none"/>' +
    '<path d="M-13.7 -5 H13.7 M-12.6 -10.4 Q0 -11.4 12.6 -10.4 M-9.8 -15.4 Q0 -17 9.8 -15.4 M-5 -19.4 Q0 -20.4 5 -19.4" stroke="#B8935A" stroke-width="1" fill="none"/><path d="M-14 0 Q-14 -21 0 -21 Q14 -21 14 0" stroke="#8A6A38" stroke-width="1.2" fill="none"/>';
};
/** a pen of upright sticks lashed to two rails: back half, (animals), then the front sticks */
const fence = (x, y, w, hgt, front) => { let d = ''; for (let i = 0; i <= w; i += 2.4) d += 'M' + r1(x + i) + ' ' + r1(y + (front ? 0 : -3)) + 'v' + r1(-hgt - ((i * 7) % 3) * .4); return '<path d="' + d + '" stroke="#8B6A3A" stroke-width="' + (front ? .6 : .8) + '" opacity="' + (front ? .85 : 1) + '"/><path d="M' + x + ' ' + r1(y - hgt * .4 + (front ? 0 : -3)) + 'h' + w + ' M' + x + ' ' + r1(y - hgt * .85 + (front ? 0 : -3)) + 'h' + w + '" stroke="#6B4A28" stroke-width=".7"/>'; };

export function shanuScene(): string {
  const defs = '<defs>' + lg('sky', '#A8D2E6', '#DCE3D6', '#F1DEB6') + lg('gr', '#DDBA82', '#CBA068', '#B88B52') +
    '<radialGradient id="' + P + '-sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF8E2"/><stop offset=".35" stop-color="#FFF0C8" stop-opacity=".7"/><stop offset="1" stop-color="#FFF0C8" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="' + P + '-sh" cx=".38" cy=".36" r=".7"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></radialGradient>' +
    '<radialGradient id="' + P + '-du" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#F2DDB2" stop-opacity=".8"/><stop offset="1" stop-color="#F2DDB2" stop-opacity="0"/></radialGradient>' +
    HEADB + FACE + JALF + RIGF + WOMF + COWDEFS() + dabAllDefs() + '<path id="' + P + '-ft" d="M-3.6 -1.4h2.8v1.3h-3.4z M.8 -1.4h2.8l.6 1.3h-3.4z" fill="#2E2218"/>' +
    ['gr', 'gw', 'rb', 'ru'].map((k) => '<g id="' + P + '-a' + k + '">' + dabStill(0, 0, 1, k, 0) + '</g>').join('') + '</defs>';
  const an = (x, y, s, k, flip) => '<use href="#' + P + '-a' + k + '" transform="translate(' + n2(x) + ' ' + n2(y) + ') scale(' + (flip ? -s : s) + ' ' + s + ')"/>';

  const sky = '<rect width="320" height="200" fill="url(#' + P + '-sky)"/><circle cx="92" cy="40" r="28" fill="url(#' + P + '-sun)"/><circle cx="92" cy="40" r="7.5" fill="#FFF7DC"/>' +
    '<path d="M0 92 Q40 82 86 88 T170 84 T250 86 T320 82 V104 H0Z" fill="#B9AE8C" opacity=".45"/>' +
    '<g fill="#BBA27A" opacity=".5"><path d="M150 100 V92 H166 V100Z M170 100 V90 H180 V100Z"/><path d="M184 100 V76 L185.6 72 L187.2 76 V100Z"/><ellipse cx="176" cy="90" rx="4" ry="3.4"/></g>' +
    '<g fill="#7F946A" opacity=".55">' + [[12, 6], [40, 5], [62, 7], [128, 5], [146, 6], [200, 6], [226, 5], [252, 7], [296, 6]].map(([x, r]) => '<ellipse cx="' + x + '" cy="' + (98 - r * .4) + '" rx="' + r + '" ry="' + (r * .6) + '"/><rect x="' + (x - .5) + '" y="' + (98 - r * .2) + '" width="1" height="3"/>').join('') + '</g>';

  const ground = '<path d="M0 100 Q160 96 320 100 V200 H0Z" fill="url(#' + P + '-gr)"/>' +
    '<g fill="#B88B52" opacity=".3"><ellipse cx="70" cy="130" rx="40" ry="2.4"/><ellipse cx="240" cy="140" rx="54" ry="2.6"/><ellipse cx="150" cy="172" rx="80" ry="3"/><ellipse cx="40" cy="190" rx="40" ry="2"/></g>' +
    '<g fill="#8A6A3A" opacity=".35">' + [[30, 140], [96, 150], [180, 136], [262, 156], [300, 182], [120, 186], [210, 192]].map(([x, y]) => '<ellipse cx="' + x + '" cy="' + y + '" rx="1.6" ry=".7"/>').join('') + '</g>';

  const herder = (x, y, s, sk, c, flip, cls = '') => person({ x, y, s, skin: sk, c, t: '#E9D9A6', cap: 'malafa', capc: '#D9B464', capc2: '#6B3A1E', al: 'staff', ar: 'down', flip, cls: 'x-w x-hr ' + cls,
    hl: '<path d="M-7.9 -36 L-6.8 1.4" stroke="#6B4422" stroke-width=".9" stroke-linecap="round"/>' });
  const hausa = (x, y, s, sk, c, capc, o = {}) => person(Object.assign({ x, y, s, skin: sk, dress: 'riga', c, t: '#F4EBD0', cap: 'hula', capc, capc2: '#F4EBD0', al: 'down', ar: 'down', cls: 'x-w' }, o));
  // the far side of the yard: a few cattle with their herder, flocks of goats and rams in stick pens, rows of tiny cattle
  const farHerds = '<g opacity=".9">' +
    cow(46, 104, .5, 'rb', 0) + cow(58, 103, .48, 'wf', 1, 'down') + cow(36, 102.4, .44, 'gu', 0) + herder(28, 105, .32, 0, '#C9B28A', 0) +
    fence(104, 103.6, 36, 4.4, false) + an(110, 101.6, .42, 'gw', 0) + an(117, 102.4, .42, 'gr', 1) + an(124, 101.4, .4, 'gr', 0) + an(131, 102.6, .44, 'gw', 1) + an(136, 101.8, .4, 'gr', 0) + fence(104, 103.6, 36, 3.6, true) +
    hausa(144, 104, .3, 3, '#5E7FA8', '#F4EBD0', { capc2: '#7A1F2B' }) +
    fence(186, 103.4, 34, 4.4, false) + an(192, 101.2, .4, 'rb', 0) + an(200, 102.2, .42, 'ru', 1) + an(208, 101.4, .4, 'rb', 1) + an(215, 102, .4, 'ru', 0) + fence(186, 103.4, 34, 3.6, true) + herder(182, 104, .3, 4, '#8A5A2E', 0) +
    '<g opacity=".6">' + [[96, 'wf', 0], [228, 'wf', 1], [236, 'rb', 0], [292, 'wf', 0], [300, 'rb', 1], [20, 'wf', 1]].map(([x, k, f]) => cow(x, 97.6, .3, k, f)).join('') +
    [[150, 'gr', 0], [156, 'gw', 1], [162, 'gr', 1], [246, 'rb', 0], [252, 'ru', 1], [270, 'gw', 0]].map(([x, k, f]) => an(x, 98, .3, k, f)).join('') + '</g></g>';

  const mat = (x, y) => '<g transform="translate(' + x + ' ' + y + ')"><path d="M-9 -9 H9 L10.4 -7 H-10.4Z" fill="#C9A15E"/><path d="M-8 -7 V0 M8 -7 V0" stroke="#6B4A2A" stroke-width=".7"/>' +
    '<g fill="#7A5A3A"><path d="M-5 0 L-4.4 -4 H-1.6 L-1 0Z"/><circle cx="-3" cy="-5" r="1"/><path d="M2 0 L2.6 -4 H5.4 L6 0Z"/><circle cx="4" cy="-5" r="1"/></g><path d="M-4 -5.6 h2 M3 -5.6 h2" stroke="#F4EBD0" stroke-width=".8"/></g>';
  const far2 = '<g opacity=".7">' + mat(160, 101) + mat(266, 100) + '</g>';
  // left: the tea seller's stand under a neem, a man on the bench with his glass
  const tea = neem(22, 112, 1.25) + '<g>' +
    '<g><path d="M35 113.8 Q34.4 110.4 37 110 Q39.6 110.4 39 113.8Z" fill="#2E7D32"/><path d="M39 111.4 l2 -1.4" stroke="#2E7D32" stroke-width=".7"/><path d="M36 110.2 q1 -1 2 0" stroke="#1B5E20" stroke-width=".6" fill="none"/>' +
    '<path d="M41.6 113.8 Q41 110.8 43.4 110.4 Q45.8 110.8 45.2 113.8Z" fill="#1565C0"/><path d="M45.2 111.6 l1.8 -1.2" stroke="#1565C0" stroke-width=".7"/>' +
    '<g fill="#F4E3B8" opacity=".9"><rect x="47.4" y="111.8" width="1.2" height="2" rx=".2"/><rect x="49.2" y="111.8" width="1.2" height="2" rx=".2"/><rect x="51" y="111.8" width="1.2" height="2" rx=".2"/></g><g fill="#B5651D"><rect x="47.4" y="112.8" width="1.2" height="1"/><rect x="49.2" y="112.8" width="1.2" height="1"/></g></g>' +
    '<path d="M56 124 L57 119 H63 L64 124Z" fill="#4E4A46"/><ellipse cx="60" cy="119" rx="3.4" ry=".9" fill="#E8661A"/><path d="M58.6 118.8 Q59 116.6 61.4 116.4 Q63.6 116.8 62.6 119Z" fill="#37474F"/>' +
    '<g class="x-stm"><path d="M60 115.6 q-1.4 -2.4 0 -4.6 q1.2 -2 0 -4" stroke="#fff" stroke-width=".7" fill="none" opacity=".7" stroke-linecap="round"/><path d="M37 109 q-1 -2 0 -3.6" stroke="#fff" stroke-width=".5" fill="none" opacity=".6"/></g>' +
    person({ x: 42, y: 116.2, s: .44, skin: 3, c: '#F4EBD0', t: '#C62828', cap: 'zanna', capc: '#2E5E3A', capc2: '#F4EBD0', al: 'front', ar: 'down', cls: 'x-w' }) +
    '<path d="M30 114 H54 L53 115.6 H31Z" fill="#8B5A2B"/><path d="M32 115.6 V124 M52 115.6 V124" stroke="#6B4422" stroke-width="1"/>' +
    '<path d="M4 120 H26 V121.4 H4Z" fill="#7A4A22"/><path d="M6 121.4 V126 M24 121.4 V126" stroke="#5E3A1C" stroke-width=".9"/>' +
    '<g class="x-sit">' + person({ x: 12, y: 125.8, s: .5, skin: 1, dress: 'sit', c: '#5E7FA8', t: '#FFD54A', cap: 'borno', capc: '#1F2E5A', capc2: '#E9C46A', capc3: '#B23A2A', beard: '#2A1E14', al: ['M-4.2 -24.8 Q-6.4 -19 -2.6 -17.4', -2.2, -17.4], ar: 'down', cls: 'x-w',
      hl: '<rect x="-3" y="-20" width="1.6" height="2.4" rx=".2" fill="#F4E3B8"/><rect x="-3" y="-18.9" width="1.6" height="1.3" fill="#B5651D"/>' }) + '</g>' +
    '<path d="M4 120 H26" stroke="#5E3A1C" stroke-width=".5"/></g>';

  // the rams' line: a rope between two posts, Balami and Uda rams tied along it for Sallah, a Fulani seller with his staff
  const rams = '<path d="M64 108.6 V100 M104 109 V100.4" stroke="#6B4A28" stroke-width="1.1" stroke-linecap="round"/><path d="M64 101 Q84 104.6 104 101.4" stroke="' + ROPE2 + '" stroke-width=".5" fill="none"/>' +
    dabLive(72, 110.4, .62, 'rb', 0, 'r1') + an(83, 111, .62, 'ru', 0) + dabLive(94, 110.6, .6, 'rb', 0, 'r2') + an(102, 111.6, .62, 'ru', 1) +
    herder(60, 112, .46, 2, '#E9DDC0', 0);

  // the haggling over a white goat: a buyer in babban riga, hand out with his price; the owner (malafa) shakes his head
  const haggle = person({ x: 118, y: 122, s: .5, skin: 0, dress: 'riga', c: '#F4EBD0', t: '#1565C0', cap: 'hula', capc: '#F6F2E8', capc2: '#1F2E5A', al: 'down', ar: 'front', cls: 'x-w x-shrug' }) +
    herder(129, 122.4, .5, 5, '#6A5A3A', 1) + dabLive(139, 122.6, .5, 'gw', 1, 'g1') +
    person({ x: 107, y: 121.4, s: .46, skin: 2, dress: 'riga', c: '#2E7D32', t: '#F4EBD0', cap: 'turban', capc: '#FFFFFF', beard: '#E8E4DC', al: 'hip', ar: 'hip', cls: 'x-w' });

  // the poultry corner: turkeys under a wicker cage, a turkey cock displaying beside it, a man holding chickens up by
  // their legs for a buyer to feel, hens and a cock scratching about
  const hang = (x, y, r) => '<g transform="translate(' + x + ' ' + y + ') rotate(' + r + ') scale(.34)"><g transform="rotate(180)">' + hen() + '</g><path d="M-4 9 Q-11 14 -9 25 M4 9 Q11 14 9 25" stroke="#7A4A20" stroke-width="3.4" fill="none" stroke-linecap="round" opacity=".9"/></g>';
  const poultry = '<g transform="translate(150 120.6) scale(.3)"><g transform="translate(-4 0) scale(.6)">' + turkey('', true) + '</g><g transform="translate(5 0) scale(-.58 .58)">' + turkey('', true) + '</g>' + cage() + '</g>' +
    '<g transform="translate(159 123.4) scale(.25)">' + turkey('x-tk') + '</g>' +
    hausa(169, 121.4, .5, 4, '#7A6A58', '#7A1F2B', { cap: 'borno', capc2: '#F2C230', capc3: '#1F2E5A', ar: 'front', al: 'out', cls: 'x-w x-chk', hl: hang(-11.4, -17, 0) + hang(-11, -16.6, 16) }) +
    '<g transform="translate(144 125.4) scale(.19)">' + hen('x-pk') + '</g><g transform="translate(164 126.4) scale(-.2 .2)">' + cock() + '</g><g transform="translate(174 126.8) scale(.18)">' + hen('x-pk p2') + '</g>';

  // right: a lorry backed up to an earth ramp, a red Bororo bull led up into it, heads and horns over the slats
  let slats = ''; for (let x = 238; x <= 284; x += 4.6) slats += 'M' + n2(x) + ' 80 V104';
  const lorry = '<g><ellipse cx="252" cy="111" rx="40" ry="2" fill="#3C2810" opacity=".2"/>' +
    cow(250, 100, .66, 'rb', 1) + an(262, 99.4, .64, 'rb', 0) + cow(276, 100, .62, 'gu', 1) +
    // (r3) the lorry drawn properly: weathered slats with light on their tops and shade on the far side, the deck and
    // chassis, a two-tone cab with glass and a driver, rims and tyres, and its shadow on the ground (light from the left)
    '<defs><linearGradient id="sh4-lw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B7844E"/><stop offset="1" stop-color="#7A4E28"/></linearGradient>' +
    '<linearGradient id="sh4-lc" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#3F86C4"/><stop offset="1" stop-color="#1A4E80"/></linearGradient>' +
    '<linearGradient id="sh4-lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E2F2F6"/><stop offset="1" stop-color="#7FA2B0"/></linearGradient></defs>' +
    '<path d="M212 108.6 L290 108.6 L296 112.4 L216 112.4Z" fill="#3C2810" opacity=".22"/>' +
    '<path d="' + slats + '" stroke="url(#sh4-lw)" stroke-width="1.5"/><path d="' + slats + '" stroke="#2A1A0C" stroke-width=".35" opacity=".5" transform="translate(.8 0)"/>' +
    '<rect x="236" y="96.4" width="51" height="7.6" fill="url(#sh4-lw)"/><path d="M237 98.6 q10 -.6 20 0 t20 0 M240 101.4 q8 .5 16 0 t20 .2" stroke="#5E3A1C" stroke-width=".3" fill="none" opacity=".6"/>' +
    '<path d="M236 80 H287 M236 88.4 H287" stroke="#6B4422" stroke-width="1.6"/><path d="M236 79.4 H287" stroke="#D6A86C" stroke-width=".5"/><path d="M236 96.4 H287" stroke="#5E3A1C" stroke-width=".7"/>' +
    '<rect x="234.4" y="78.4" width="2.4" height="26" fill="#5E3A1C"/><rect x="285.6" y="78.4" width="2.4" height="26" fill="#4E2E12"/>' +
    '<rect x="234" y="104" width="54" height="2.4" fill="#3A2614"/><rect x="214" y="106.2" width="76" height="2" fill="#262626"/><path d="M234 104.2 H288" stroke="#C62828" stroke-width=".7"/>' +
    '<path d="M214 107.4 V95 Q214 90 218 89 L224 85.6 H235 V107.4Z" fill="url(#sh4-lc)"/><path d="M218 89 L224 85.6 H235 V90 H217.4Z" fill="#F2E8D0"/>' +
    '<path d="M219.4 95 L224.6 89 H232.4 V95Z" fill="url(#sh4-lg)" stroke="#203040" stroke-width=".35"/><circle cx="228.4" cy="92.4" r="1.5" fill="#5E3A1C"/><path d="M226.6 91.4 q1.8 -1.8 3.6 0Z" fill="#F4EBD0"/><path d="M220.4 94.4 L224 90.4 L225.4 90.4 L221.6 94.4Z" fill="#fff" opacity=".35"/>' +
    '<path d="M214 100 H235" stroke="#123A60" stroke-width=".6"/><path d="M214 101.2 H235" stroke="#E8731A" stroke-width=".8"/><path d="M226 96 v8" stroke="#123A60" stroke-width=".45"/><rect x="229.4" y="98" width="2.6" height=".7" rx=".3" fill="#D0D4D8"/>' +
    '<rect x="211.6" y="102.4" width="3.2" height="1.8" rx=".4" fill="#FFE9A8"/><rect x="211.2" y="105" width="4" height="1.6" rx=".4" fill="#BFC4C8"/><path d="M214 95 Q214 90 218 89" stroke="#fff" stroke-width=".5" opacity=".35" fill="none"/>' +
    [222, 248, 276].map((x) => '<ellipse cx="' + (x + 1) + '" cy="112" rx="3.8" ry=".7" fill="#1A0E04" opacity=".45"/><circle cx="' + x + '" cy="108.6" r="3.4" fill="#1C1C1C"/><circle cx="' + x + '" cy="108.6" r="2.9" fill="none" stroke="#333" stroke-width=".5" stroke-dasharray=".6 .5"/><circle cx="' + x + '" cy="108.6" r="1.7" fill="#B23A2A"/><circle cx="' + x + '" cy="108.6" r=".7" fill="#D8DCE0"/>').join('') +
    '<path d="M287 104 L306 117 H312 L291 104Z" fill="#A9814E"/><path d="M288 104.4 L307 116.6 M290 104.4 L309.4 116.6" stroke="#7A5530" stroke-width=".5"/>' +
    '<g class="x-up"><g transform="translate(297 111) rotate(33)">' + cowLive(0, 0, .74, 'rb', 1, 'up', 'x-bull') + '</g></g>' +
    herder(311, 119.4, .48, 1, '#E9DDC0', 1, 'x-push') + '</g>';
  const byLorry = person({ x: 226, y: 118.6, s: .48, skin: 0, dress: 'riga', c: '#7B1FA2', t: '#FFD54A', cap: 'zanna', capc: '#7A1F2B', capc2: '#E9C46A', capside: -1, al: 'front', ar: 'front', cls: 'x-w x-shrug',
      hl: '<rect x="-1.6" y="-19.8" width="2.6" height="1.6" fill="#7FB07A" stroke="#4E7A4A" stroke-width=".2"/>' });
  // the Fulani woman with her calabash of fura, her child beside her, between the goat pen and the rams
  const fulani = person({ x: 96, y: 107, s: .4, skin: 5, dress: 'wom', c: '#1E3A6E', t: '#FFD54A', w: '#2B2B2B', w2: '#C62828', cap: 'kallabi', capc: '#2B2B2B', capc2: '#FFD54A', al: 'head', ar: 'down', cls: 'x-w',
    load: '<g><ellipse cy="-39.4" rx="4.6" ry="3" fill="#C98A3A"/><path d="M-4.6 -39.4 Q0 -36 4.6 -39.4" stroke="#8A5A22" stroke-width=".4" fill="none"/><path d="M-4.4 -40.6 Q0 -43.4 4.4 -40.6 Q0 -42 -4.4 -40.6Z" fill="#E8D8B0"/><path d="M-3 -41 h6" stroke="#6E8A3A" stroke-width=".4"/></g>' }) +
    person({ x: 101, y: 107.4, s: .27, skin: 2, c: '#C2185B', cap: 'kube', capc: '#F4EBD0', al: 'down', ar: 'down', cls: 'x-w x-kid' });

  const tuft = (x, y) => '<path d="M' + x + ' ' + y + ' q-1 -3 -3 -4 M' + x + ' ' + y + ' q0 -4 1 -5 M' + x + ' ' + y + ' q1 -3 3.4 -3.6" stroke="#A9A050" stroke-width=".6" fill="none"/>';
  const near = neem(318, 122, 1.4) + '<g>' + tuft(10, 196) + tuft(16, 197) + tuft(306, 196) + tuft(196, 198) + tuft(70, 198) + '</g>';
  const dust = '<g class="x-du d1"><ellipse cx="140" cy="104" rx="70" ry="9" fill="url(#' + P + '-du)"/></g><g class="x-du d2"><ellipse cx="250" cy="118" rx="50" ry="7" fill="url(#' + P + '-du)"/></g>';

  return '<svg class="scene ' + P + '" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + defs + sky +
    egret(150, 54, .8, 'e1') + egret(176, 62, .62, 'e2') + ground + farHerds + far2 + fulani + dust + near_(rams, 84, 110, 1.12, 8) + near_(tea, 30, 125, 1.2, 8) + near_(haggle, 124, 122, 1.22, 11) + near_(poultry, 160, 122, 1.2, 10) +
    '<g transform="translate(-12 0)">' + near_(lorry, 262, 110, 1.12, 5) + '</g>' + near_(byLorry, 218, 118, 1.15, 8) + near + '</svg>';
}

/** the drawing kit, shared with Ƙirgen shanu’s Fulani camp (sc-garke.ts): same people, same cattle, same defs */
export const shanuKit = { P, n2, lg, person, cow, cowLive, calf, neem, egret, near_, defs: () => HEADB + FACE + JALF + RIGF + WOMF + COWDEFS() + '<path id="' + P + '-ft" d="M-3.6 -1.4h2.8v1.3h-3.4z M.8 -1.4h2.8l.6 1.3h-3.4z" fill="#2E2218"/>' };

/* ====================================================================================================================
 * Kasuwar dabbobi's livestock (Sani 2026-10-26: "goats and rams not cow only so a mix ... very real"; then "only
 * livestock no fowls, the fowls can be bg noise"). Six animals drawn side on, facing right, in one 240×160 frame with
 * the ground at y 150, each at its own true-ish size (a cow fills the frame, a ram about three quarters, a goat a
 * little over half): a White Fulani and a Red Bororo zebu cow, a Sokoto Red (Maradi) goat, a white Sahel goat with its
 * lop ears, a Balami ram (big, white, hairy, Roman nose) and an Uda ram (black fore, white hind), both with curled
 * horns. Outlines are smooth curves through points; coats are shaded with a gradient, muscle shadows and fine hair
 * strokes clipped to the body; hooves are cloven; goats and sheep have the horizontal pupil.
 * Moving parts (transform only): .d-all (turns away) · .d-up (breathes) · .d-hd (neck and head) · .d-ear · .d-tl ·
 * .d-lg a–d (legs, walking) · .d-buy (the buyer) · .d-rope (his lead) · .d-teth (the tether to the post).
 * ================================================================================================================== */
const r1 = (v) => Math.round(v * 10) / 10;
const pt = (p) => r1(p[0]) + ' ' + r1(p[1]);
/** a smooth outline through points (Catmull-Rom); a point with a third value 1 is a corner */
function sm(pts, closed = true) {
  const n = pts.length, N = closed ? n : n - 1, at = (i) => closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
  let d = 'M' + pt(pts[0]);
  for (let i = 0; i < N; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += 'C' + pt(c1) + ' ' + pt(c2) + ' ' + pt(p2);
  }
  return d + (closed ? 'Z' : '');
}
/** a tapering shape along a centre line: horns, tails, beards */
function taper(c, w0, w1) {
  const n = c.length, L = [], R = [];
  c.forEach((p, i) => { const a = c[Math.max(0, i - 1)], b = c[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * i / (n - 1)) / 2;
    L.push([p[0] - dy / m * w, p[1] + dx / m * w]); R.push([p[0] + dy / m * w, p[1] - dx / m * w]); });
  L[0][2] = 1; R[0][2] = 1;
  return sm(L.concat([c[n - 1]], R.reverse()));
}
const mv = (pts, dx, dy) => pts.map((p) => [p[0] + dx, p[1] + dy, p[2]]);
const rng = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
/** fine hair strokes scattered in a box (clipped to the coat by the caller), flowing at angle `ang` */
function hairs(box, n, len, ang, seed, curl = .07) {
  const R = rng(seed); let d = '';
  for (let i = 0; i < n; i++) {
    const x = box[0] + R() * (box[2] - box[0]), y = box[1] + R() * (box[3] - box[1]), a = ang + (R() - .5) * .5, l = len * (.6 + R() * .7), ex = Math.cos(a) * l, ey = Math.sin(a) * l;
    d += 'M' + r1(x) + ' ' + r1(y) + 'q' + r1(ex / 2 - ey * curl) + ' ' + r1(ey / 2 + ex * curl) + ' ' + r1(ex) + ' ' + r1(ey);
  }
  return d;
}
/* legs, side on, facing right: x is the leg's middle at the body, top is hidden inside the body; offsets are
   (dx × width, share of the leg's length). The fore leg: forearm, knee, cannon, fetlock, pastern; the hind: thigh,
   gaskin, the hock jutting back, cannon, fetlock. */
const FORE = { b: [[-9, 0, 1], [-9.6, .26], [-6.4, .48], [-5.4, .6], [-4.2, .68], [-3.8, .86], [-4.6, .92, 1]], f: [[2.4, .92, 1], [1.6, .86], [1.8, .68], [2.8, .6], [3.8, .44], [6.4, .24], [9, 0, 1]], h: [[-4.6, .92], [2.4, .92], [5, 1], [-4.8, 1]] };
const HIND = { b: [[-12, 0, 1], [-15, .18], [-14.6, .36], [-12.6, .5], [-12.8, .6], [-10.2, .66], [-9.4, .86], [-10, .92, 1]], f: [[-3.4, .92, 1], [-4, .86], [-5, .7], [-5.6, .62], [-2.6, .5], [2.4, .32], [7, .14], [10, 0, 1]], h: [[-10, .92], [-3.4, .92], [-1, 1], [-10.4, 1]] };
function limb(x, top, fore, wk, fill, hoof, cls, G = 150) {
  const L = G - top, S = fore ? FORE : HIND, m = (p) => [x + p[0] * wk, top + p[1] * L, p[2]];
  const hf = S.h.map((p) => [x + p[0] * wk, top + p[1] * L]), fl = m(S.b[S.b.length - 2]);
  return '<g class="d-lg ' + cls + '" style="transform-origin:' + r1(x) + 'px ' + r1(top + 4) + 'px">' +
    '<path d="' + sm(S.b.map(m).concat(S.f.map(m))) + '" fill="' + fill + '"/>' +
    '<path d="' + sm(S.b.slice(1, -1).map(m), false) + '" stroke="#000" stroke-opacity=".17" stroke-width="' + r1(1.7 * wk) + '" fill="none"/>' +
    '<path d="' + sm(S.f.slice(1, -1).map(m), false) + '" stroke="#fff" stroke-opacity=".14" stroke-width="' + r1(1.1 * wk) + '" fill="none"/>' +
    '<path d="M' + pt(m([fore ? -4.6 : -9.6, fore ? .62 : .6])) + 'q' + r1(2 * wk) + ' ' + r1(1.2 * wk) + ' ' + r1(4.6 * wk) + ' .4" stroke="#000" stroke-opacity=".14" stroke-width=".7" fill="none"/>' +
    '<ellipse cx="' + r1(fl[0] - .4 * wk) + '" cy="' + r1(fl[1] - .4) + '" rx="' + r1(1.1 * wk) + '" ry="' + r1(.8 * wk) + '" fill="' + hoof + '"/>' +
    '<path d="M' + pt(hf[0]) + 'L' + pt(hf[1]) + 'Q' + pt([hf[2][0] - .2, hf[2][1] - 2 * wk]) + ' ' + pt(hf[2]) + 'L' + pt(hf[3]) + 'Z" fill="' + hoof + '"/>' +
    '<path d="M' + pt([(hf[0][0] + hf[1][0]) / 2 + .6 * wk, hf[0][1] + .3]) + 'L' + pt([(hf[2][0] + hf[3][0]) / 2 + 1.2 * wk, hf[2][1]]) + '" stroke="#000" stroke-opacity=".55" stroke-width="' + r1(.45 * wk + .2) + '"/>' +
    '<path d="M' + pt([hf[0][0] + .5 * wk, hf[0][1] + .7]) + 'L' + pt([hf[1][0] - .2, hf[1][1] + .7]) + '" stroke="#fff" stroke-opacity=".2" stroke-width=".7"/></g>';
}
/** an eye: the white rim, the iris, and the pupil (goats and sheep: a horizontal bar; cattle: round), a glint */
const eyeA = (x, y, r, iris, bar, lid) => '<ellipse cx="' + x + '" cy="' + y + '" rx="' + r1(r * 1.25) + '" ry="' + r1(r * .95) + '" fill="' + (lid || '#2A1A10') + '" opacity=".55"/>' +
  '<ellipse cx="' + x + '" cy="' + y + '" rx="' + r + '" ry="' + r1(r * .8) + '" fill="' + iris + '"/>' +
  (bar ? '<rect x="' + r1(x - r * .62) + '" y="' + r1(y - r * .2) + '" width="' + r1(r * 1.24) + '" height="' + r1(r * .4) + '" rx="' + r1(r * .2) + '" fill="#0E0805"/>' : '<circle cx="' + x + '" cy="' + y + '" r="' + r1(r * .55) + '" fill="#0E0805"/>') +
  '<circle cx="' + r1(x + r * .35) + '" cy="' + r1(y - r * .32) + '" r="' + r1(r * .24) + '" fill="#fff" opacity=".85"/>' +
  '<path d="M' + r1(x - r * 1.3) + ' ' + r1(y - r * .3) + 'Q' + x + ' ' + r1(y - r * 1.5) + ' ' + r1(x + r * 1.3) + ' ' + r1(y - r * .4) + '" stroke="#000" stroke-opacity=".35" stroke-width="' + r1(r * .35) + '" fill="none" stroke-linecap="round"/>';
/** ridged horn along a centre line */
function horn(c, w0, w1, col, ridge, tip) {
  let d = ''; const n = c.length;
  for (let i = 1; i < n - 1; i++) { const a = c[i - 1], b = c[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * i / (n - 1)) * .46;
    d += 'M' + pt([c[i][0] - dy / m * w, c[i][1] + dx / m * w]) + 'L' + pt([c[i][0] + dy / m * w, c[i][1] - dx / m * w]); }
  return '<path d="' + taper(c, w0, w1) + '" fill="' + col + '"/><path d="' + taper(c, w0 * .45, w1 * .4) + '" fill="#fff" opacity=".14" transform="translate(-.4 -.5)"/>' +
    '<path d="' + d + '" stroke="' + ridge + '" stroke-width=".55" stroke-opacity=".7"/>' + (tip ? '<path d="' + taper(c.slice(-3), w1 * 1.4, w1 * .7) + '" fill="' + tip + '"/>' : '');
}
/** a spiral ram's horn: from the poll it goes up, back, down round the ear and forward to the cheek */
function spiral(cx, cy, R, a0, turn, rEnd, steps = 26) {
  const c = []; for (let i = 0; i <= steps; i++) { const t = i / steps, a = a0 - turn * 2 * Math.PI * t, r = R * (1 - (1 - rEnd) * t); c.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
  return c;
}

/* ---- the six animals as data ---- */
const GOAT_BODY = [[150, 46], [132, 50], [112, 52], [94, 49], [82, 44.5], [70, 49], [65, 59], [64, 73], [68, 85], [78, 90], [94, 93], [116, 99], [136, 99.4], [150, 98], [162, 94], [171, 87], [176, 75], [174, 61], [164, 50]];
const GOAT_NECK = [[146, 54], [157, 38], [168, 24], [178, 14], [188, 16], [192, 28], [187, 42], [180, 56], [177, 72], [166, 74], [154, 62]];
const GOAT_HEAD = [[176, 15], [183, 8], [192, 9], [199, 16], [205, 26], [210, 35], [212, 41], [208, 46], [201, 46.5], [195, 43], [188, 35], [182, 27], [177, 21]];
const RAM_BODY = [[152, 50], [132, 54], [108, 55], [86, 53], [68, 49], [57, 53], [51, 63], [50, 79], [55, 93], [68, 98], [88, 102], [116, 107], [140, 106.6], [156, 104], [168, 98], [176, 87], [178, 73], [172, 59], [164, 52]];
const RAM_NECK = [[148, 58], [158, 44], [170, 32], [181, 25], [190, 30], [193, 44], [188, 60], [181, 76], [177, 90], [164, 84], [154, 68]];
const RAM_HEAD = [[175, 30], [180, 20], [189, 15], [198, 19], [205, 31], [210, 45], [213, 57], [212, 65], [205, 70], [197, 68.6], [190, 60], [183, 48], [177, 40]];
const COW_BODY = [[160, 62], [140, 60], [114, 61], [92, 59], [74, 55], [60, 56], [49, 57], [42, 64], [39, 78], [41, 92], [48, 102], [68, 99], [88, 104], [114, 108], [142, 106], [160, 101], [169, 96], [175, 88], [177, 76], [173, 64]];
const COW_NECK = [[158, 62], [174, 56], [190, 56], [200, 64], [204, 78], [199, 89], [188, 93], [177, 93], [168, 88], [160, 76]];
const COW_HEAD = [[195, 58], [203, 53], [212, 57], [218, 69], [224, 83], [229, 95], [229, 103], [223, 108], [215, 105], [207, 95], [200, 84], [195, 71]];
const ROPE = '#CDB27A', ROPE2 = '#8E7444';
const SPEC = {
  // Sokoto Red (Maradi) goat: a deep glossy mahogany coat, small horns swept back, ears held out level, a little beard
  gr: { k: .5, cx: 132, coat: ['#C8693A', '#9E3F1B', '#64230E'], legs: ['#93391A', '#5E200C'], far: '#6A2612', hoof: '#2A1C14', y0: 44, y1: 100,
    body: GOAT_BODY, neck: GOAT_NECK, head: GOAT_HEAD, wk: .9, fn: [164, 84], ff: [154, 85], hn: [80, 74], hf: [92, 76],
    hairC: '#4A1406', hairL: '#F0A070', hairN: 110, hairLen: 4.4,
    ear: [[184, 18], [174, 20], [163, 25], [158, 29], [164, 31], [175, 28], [185, 24]], earIn: '#C9785A', earOrigin: [183, 21],
    horns: [[[183, 10], [179, 1], [173, -6], [166, -10], [160, -10]], [[187, 10], [184, 1], [179, -6], [173, -10], [168, -11]]], hornC: '#54443A', hornR: '#2A2018', hw: [6, 1.4],
    eye: [192, 20, 2.3, '#D2A23A'], nose: [208.5, 36.5], mouth: 'M211 43.5 Q206 45.2 200.5 44', muzzle: '#7C2C12', beard: [[203, 46], [202, 52], [199.5, 58]], beardC: '#4A1A0A',
    tail: [[73, 49], [69, 42], [67, 36], [67, 31]], tailW: [6, 3.4], tailTip: '#4A1608', collar: 'M170 30 Q177 44 190 36', at: [186, 42], hd: [160, 66] },
  // white Sahel goat: long legs, a longer white coat, long drooping ears, short horns twisted back
  gw: { k: .53, cx: 132, coat: ['#FFFFFF', '#EEE8DC', '#C4B9A6'], legs: ['#E9E2D4', '#BDB1A0'], far: '#C2B7A4', hoof: '#4A3C30', y0: 38, y1: 94, lift: -6,
    body: GOAT_BODY, neck: GOAT_NECK, head: GOAT_HEAD, wk: .84, fn: [164, 78], ff: [154, 79], hn: [80, 68], hf: [92, 70],
    hairC: '#9C8E78', hairL: '#FFFFFF', hairN: 150, hairLen: 6,
    ear: [[187, 14], [181, 19], [177, 28], [176, 38], [179, 43], [183, 39], [186, 28], [190, 19]], earIn: '#E8C9B8', earOrigin: [186, 16], earFront: true,
    horns: [[[183, 10], [177, 3], [170, -1], [163, 0]], [[187, 10], [182, 3], [176, -1], [170, -1]]], hornC: '#CDBB98', hornR: '#8A7656', hw: [5.2, 1.6],
    eye: [192, 20, 2.3, '#C9A44A'], nose: [208.5, 36.5], mouth: 'M211 43.5 Q206 45.2 200.5 44', muzzle: '#D9C2B4',
    tail: [[73, 49], [69, 42], [67, 36], [67, 31]], tailW: [6, 4], tailTip: '#D8CDB8', collar: 'M170 30 Q177 44 190 36', at: [186, 42], hd: [160, 66] },
  // Balami ram: the big white Sahel sheep, hair not wool, long legs, a Roman nose, long ears, a ruff at the throat
  rb: { k: .67, cx: 126, coat: ['#FFFFFF', '#EDE7DB', '#C2B6A2'], legs: ['#EAE3D6', '#BCAF9C'], far: '#BFB3A0', hoof: '#5A4A3C', y0: 48, y1: 108,
    body: RAM_BODY, neck: RAM_NECK, head: RAM_HEAD, wk: 1, fn: [162, 92], ff: [151, 93], hn: [68, 82], hf: [80, 84],
    hairC: '#A0927C', hairL: '#FFFFFF', hairN: 170, hairLen: 6.4,
    ear: [[182, 38], [177, 43], [173, 52], [172, 59], [176, 60], [180, 52], [185, 42]], earIn: '#E4C4B4', earOrigin: [182, 40],
    curl: [176, 36, 15], hornC: '#E0CFAC', hornR: '#9A8460', hw: [11, 3.4],
    eye: [193, 31, 2.7, '#C8A04A'], nose: [210, 58], mouth: 'M212.5 66 Q207 69.4 200 68', muzzle: '#D8B8A8', ruff: true,
    tail: [[56, 58], [52.5, 74], [52.5, 92], [54.5, 110], [57, 122]], tailW: [7, 4], tailTip: '#E2D8C6', collar: 'M170 50 Q178 64 194 56', at: [188, 60], hd: [158, 72] },
  // Uda ram: tall and long-legged, the fore half black, the hind half white, curled horns, long ears
  ru: { k: .64, cx: 126, coat: ['#FFFFFF', '#ECE6DA', '#C0B4A0'], dark: ['#4A3A33', '#2C201B', '#160F0C'], legs: ['#EAE3D6', '#BCAF9C'], far: '#BFB3A0', farF: '#1E1612', hoof: '#2A201A', y0: 40, y1: 100, lift: -8,
    body: RAM_BODY, neck: RAM_NECK, head: RAM_HEAD, wk: .95, fn: [162, 92], ff: [151, 93], hn: [68, 82], hf: [80, 84],
    hairC: '#9C8E78', hairL: '#FFFFFF', hairN: 140, hairLen: 5.6,
    ear: [[182, 38], [177, 43], [173, 52], [172, 59], [176, 60], [180, 52], [185, 42]], earIn: '#5A4038', earOrigin: [182, 40],
    curl: [176, 36, 15], hornC: '#CDB68E', hornR: '#8A7450', hw: [10.6, 3.2],
    eye: [193, 31, 2.7, '#B8862E'], nose: [210, 58], mouth: 'M212.5 66 Q207 69.4 200 68', muzzle: '#1A1210',
    tail: [[56, 58], [52.5, 74], [52.5, 92], [54.5, 110], [57, 122]], tailW: [6.4, 3.6], tailTip: '#E2D8C6', collar: 'M170 50 Q178 64 194 56', at: [188, 60], hd: [158, 72] },
  // White Fulani (Bunaji) cow: white, black points, the hump, the dewlap, long lyre horns
  cw: { k: 1, cx: 128, coat: ['#FFFFFF', '#EDE7DB', '#BDB2A0'], legs: ['#E8E1D3', '#B4A894'], far: '#B9AE9C', hoof: '#231A14', y0: 48, y1: 104, lift: -8,
    body: COW_BODY, neck: COW_NECK, head: COW_HEAD, wk: 1.5, fn: [167, 96], ff: [154, 97], hn: [61, 84], hf: [74, 86],
    hairC: '#9A8E7A', hairL: '#FFFFFF', hairN: 160, hairLen: 5,
    ear: [[206, 63], [196, 64], [185, 69], [182, 73], [189, 76], [200, 72], [207, 68]], earIn: '#E4B8A8', earOrigin: [205, 66],
    horns: [[[200, 58], [194, 46], [192, 32], [196, 18], [203, 8]], [[207, 56], [213, 44], [216, 30], [214, 16], [209, 6]]], hornC: '#EFE6D2', hornR: '#B8A884', hornTip: '#3A2A1E', hw: [7.4, 2.4],
    eye: [211, 71, 2.9, '#3A2412'], lid: '#120A06', nose: [226, 97.5], mouth: 'M228.5 106 Q222 108.6 215.5 104.4', muzzle: '#2B211A', muzzleE: true,
    hump: [[130, 62], [136, 52], [145, 44], [155, 41], [164, 45], [170, 54], [173, 66]], dewlap: [[198, 88], [194, 98], [186, 106], [176, 111], [168, 108], [171, 99], [184, 96], [194, 91]], udder: '#D7B5A6',
    tail: [[50, 58], [43, 64], [40, 80], [41, 98], [43, 114], [45, 124]], tailW: [6, 3], tailTip: '#231A14', switch: true, collar: 'M213 92 Q220 103 230 97 M215 93 L207 62', at: [216, 100], hd: [170, 80] },
  // Red Bororo (Rahaji) cow: deep red, very tall pale lyre horns
  cr: { k: 1, cx: 128, coat: ['#C8603A', '#9C3A18', '#5A1E08'], legs: ['#8E3416', '#5A1E08'], far: '#62220C', hoof: '#231A14', y0: 48, y1: 104, lift: -8,
    body: COW_BODY, neck: COW_NECK, head: COW_HEAD, wk: 1.45, fn: [167, 96], ff: [154, 97], hn: [61, 84], hf: [74, 86],
    hairC: '#3E1204', hairL: '#F09868', hairN: 150, hairLen: 5,
    ear: [[206, 63], [196, 64], [185, 69], [182, 73], [189, 76], [200, 72], [207, 68]], earIn: '#C46A50', earOrigin: [205, 66],
    horns: [[[200, 58], [193, 42], [190, 22], [194, 3], [201, -12]], [[207, 56], [214, 40], [219, 20], [217, 0], [211, -12]]], hornC: '#F1E2C0', hornR: '#B8A27A', hornTip: '#8A7350', hw: [8, 2.4],
    eye: [211, 71, 2.9, '#3A1A0A'], lid: '#2A0E04', nose: [226, 97.5], mouth: 'M228.5 106 Q222 108.6 215.5 104.4', muzzle: '#3A1A0A', muzzleE: true,
    hump: [[130, 62], [136, 52], [145, 44], [155, 41], [164, 45], [170, 54], [173, 66]], dewlap: [[198, 88], [194, 98], [186, 106], [176, 111], [168, 108], [171, 99], [184, 96], [194, 91]], udder: '#B8806A',
    tail: [[50, 58], [43, 64], [40, 80], [41, 98], [43, 114], [45, 124]], tailW: [6, 3], tailTip: '#231A14', switch: true, collar: 'M213 92 Q220 103 230 97 M215 93 L207 62', at: [216, 100], hd: [170, 80] },
};
export const DAB_KINDS = Object.keys(SPEC);
/** the gradients and clips one animal needs (ids dab-<kind>-…; the same in every copy, so duplicates are harmless) */
function dabDefs(id) {
  const s = SPEC[id], ly = s.lift || 0, g = (n, c, y0, y1) => '<linearGradient id="dab-' + id + '-' + n + '" gradientUnits="userSpaceOnUse" x1="0" y1="' + y0 + '" x2="0" y2="' + y1 + '">' + c.map((col, i) => '<stop offset="' + (i / (c.length - 1)).toFixed(2) + '" stop-color="' + col + '"/>').join('') + '</linearGradient>';
  return '<radialGradient id="dab-vol" cx=".52" cy=".32" r=".72"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></radialGradient>' + g('c', s.coat, s.y0, s.y1) + g('l', s.legs, s.y1 - 14, 150) + (s.dark ? g('d', s.dark, s.y0 - 30, s.y1) : '') +
    '<clipPath id="dab-' + id + '-cb"><path d="' + sm(mv(s.body, 0, ly)) + '"/></clipPath><clipPath id="dab-' + id + '-cn"><path d="' + sm(mv(s.neck, 0, ly)) + '"/></clipPath>';
}
export const dabAllDefs = () => DAB_KINDS.map(dabDefs).join('');
/** the animal's own drawing, in its own scale (native frame; the caller places it) */
function dabArt(id, live = true) {
  const s = SPEC[id], ly = s.lift || 0, M = (p) => mv(p, 0, ly), C = 'url(#dab-' + id + '-c)', D = s.dark ? 'url(#dab-' + id + '-d)' : C;
  const cls = (c) => live ? ' class="' + c + '"' : '';
  const o = (x, y) => live ? ' style="transform-origin:' + r1(x) + 'px ' + r1(y + ly) + 'px"' : '';
  const cow = !!s.hump, sheep = !!s.curl;
  const fx = s.fn[0], hx = s.hn[0];
  // far legs, then the tail, the near legs, the body and its coat
  let a = '<ellipse cx="' + r1((hx + fx) / 2 + 4) + '" cy="150" rx="' + r1((fx - hx) / 2 + 30 * s.wk) + '" ry="' + r1(4 * s.wk) + '" fill="#3C2810" opacity=".24"/>' +
    limb(s.ff[0], s.ff[1] + ly, true, s.wk * .95, s.farF || s.far, s.hoof, 'b') + limb(s.hf[0], s.hf[1] + ly, false, s.wk * .95, s.far, s.hoof, 'd');
  const TT = s.tail[s.tail.length - 1];
  const tail = '<g' + cls('d-tl') + o(s.tail[0][0], s.tail[0][1]) + '><path d="' + taper(M(s.tail), s.tailW[0], s.tailW[1]) + '" fill="' + (s.tailC || C) + '"/>' +
    (s.switch ? '<path d="' + taper(M(s.tail.slice(-2).concat([[TT[0] + 1, TT[1] + 8]])), 3, 1) + '" fill="' + s.tailTip + '"/><path d="' + sm(M([[TT[0] - 2.4, TT[1]], [TT[0] + 2.6, TT[1]], [TT[0] + 3.6, TT[1] + 8], [TT[0] + 1, TT[1] + 14], [TT[0] - 2, TT[1] + 8]])) + '" fill="' + s.tailTip + '"/>'
      : '<path d="' + taper(M(s.tail.slice(-2)), s.tailW[1] + .6, .6) + '" fill="' + s.tailTip + '" opacity=".8"/>') +
    (sheep ? '<path d="' + hairs([s.tail[0][0] - 4, s.tail[0][1] + ly + 6, s.tail[0][0] + 4, TT[1] + ly], 18, 4, 1.7, 7) + '" stroke="#A89A84" stroke-opacity=".5" stroke-width=".45" fill="none"/>' : '') + '</g>';
  a += (cow ? '' : tail) + limb(hx, s.hn[1] + ly, false, s.wk, s.legs === s.far ? s.far : 'url(#dab-' + id + '-l)', s.hoof, 'c') +
    limb(fx, s.fn[1] + ly, true, s.wk, s.dark ? D : 'url(#dab-' + id + '-l)', s.hoof, 'a');
  let up = '<path d="' + sm(M(s.body)) + '" fill="' + C + '"/>';
  const vol = (pts) => '<path d="' + sm(M(pts)) + '" fill="url(#dab-vol)"/>';
  if (s.udder) up += '<path d="' + sm(M([[64, 100], [67, 107], [73, 110], [79, 107], [80, 100]])) + '" fill="' + s.udder + '"/><path d="M69 108 v3 M76 108.6 v2.6" stroke="' + s.udder + '" stroke-width="1.8" stroke-linecap="round" transform="translate(0 ' + ly + ')"/>';
  // the coat: hair strokes clipped to the body, the shadows of shoulder, ribs and thigh, the light along the back
  const B = s.body, bx0 = Math.min(...B.map((p) => p[0])), bx1 = Math.max(...B.map((p) => p[0])), by0 = Math.min(...B.map((p) => p[1])) + ly, by1 = Math.max(...B.map((p) => p[1])) + ly;
  const sx = (f) => r1(bx0 + (bx1 - bx0) * f), sy = (f) => r1(by0 + (by1 - by0) * f);
  up += '<g clip-path="url(#dab-' + id + '-cb)">' +
    (s.dark ? '<path d="M' + sx(.66) + ' ' + (by0 - 4) + ' Q' + sx(.6) + ' ' + sy(.25) + ' ' + sx(.67) + ' ' + sy(.45) + ' Q' + sx(.61) + ' ' + sy(.66) + ' ' + sx(.7) + ' ' + sy(.82) + ' Q' + sx(.66) + ' ' + sy(.95) + ' ' + sx(.72) + ' ' + (by1 + 4) + ' L' + (bx1 + 4) + ' ' + (by1 + 4) + ' L' + (bx1 + 4) + ' ' + (by0 - 4) + 'Z" fill="' + D + '"/>' : '') +
    '<path d="M' + sx(.0) + ' ' + sy(.62) + ' Q' + sx(.12) + ' ' + sy(1.05) + ' ' + sx(.3) + ' ' + sy(1.02) + ' L' + sx(.3) + ' ' + sy(.82) + ' Q' + sx(.12) + ' ' + sy(.82) + ' ' + sx(.0) + ' ' + sy(.62) + 'Z" fill="#000" opacity=".08"/>' +
    '<path d="M' + sx(.22) + ' ' + sy(.95) + ' Q' + sx(.18) + ' ' + sy(.55) + ' ' + sx(.1) + ' ' + sy(.18) + '" stroke="#000" stroke-opacity=".04" stroke-width="' + r1(4 * s.wk) + '" fill="none"/>' +
    '<path d="M' + sx(.8) + ' ' + sy(.05) + ' Q' + sx(.76) + ' ' + sy(.5) + ' ' + sx(.84) + ' ' + sy(.86) + '" stroke="#000" stroke-opacity=".04" stroke-width="' + r1(4.4 * s.wk) + '" fill="none"/>' +
    '<path d="M' + sx(.86) + ' ' + sy(.05) + ' Q' + sx(.83) + ' ' + sy(.4) + ' ' + sx(.9) + ' ' + sy(.62) + '" stroke="#fff" stroke-opacity=".16" stroke-width="' + r1(2 * s.wk) + '" fill="none"/>' +
    [].map((f) => '<path d="M' + sx(f) + ' ' + sy(.45) + ' Q' + sx(f + .03) + ' ' + sy(.7) + ' ' + sx(f) + ' ' + sy(.92) + '" stroke="#000" stroke-opacity=".028" stroke-width="' + r1(3 * s.wk) + '" fill="none"/>').join('') +
    '<path d="M' + sx(.05) + ' ' + sy(.12) + ' Q' + sx(.5) + ' ' + sy(.02) + ' ' + sx(.82) + ' ' + sy(.06) + '" stroke="#fff" stroke-opacity=".22" stroke-width="' + r1(3.4 * s.wk) + '" fill="none" stroke-linecap="round"/>' +
    '<path d="M' + sx(.02) + ' ' + sy(.96) + ' Q' + sx(.5) + ' ' + sy(1.06) + ' ' + sx(.96) + ' ' + sy(.9) + '" stroke="#000" stroke-opacity=".1" stroke-width="' + r1(5 * s.wk) + '" fill="none"/>' +
    '<path d="' + hairs([bx0, by0, bx1, by1], s.hairN, s.hairLen, 2.75, 11) + '" stroke="' + s.hairC + '" stroke-opacity=".24" stroke-width=".42" fill="none" stroke-linecap="round"/>' +
    '<path d="' + hairs([bx0, by0, bx1, sy(.6)], s.hairN * .4, s.hairLen * .8, 2.8, 23) + '" stroke="' + s.hairL + '" stroke-opacity=".3" stroke-width=".45" fill="none" stroke-linecap="round"/></g>';
  up += vol(s.body);
  if (cow) up += tail;
  if (s.hump) up += '<path d="' + sm(M(s.hump)) + '" fill="' + C + '"/><path d="M' + pt([142, 47 + ly]) + 'Q' + pt([152, 38 + ly]) + ' ' + pt([164, 45 + ly]) + '" stroke="#fff" stroke-opacity=".3" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M' + pt([166, 46 + ly]) + 'Q' + pt([172, 56 + ly]) + ' ' + pt([166, 66 + ly]) + '" stroke="#000" stroke-opacity=".1" stroke-width="2.4" fill="none"/>';
  // neck and head, turning together about the base of the neck
  const N = s.neck, H = s.head, NC = s.dark ? D : C;
  let hd = '';
  if (s.horns) hd += horn(M(s.horns[1]), s.hw[0] * .92, s.hw[1] * .92, s.hornC, s.hornR, s.hornTip).replace('fill="' + s.hornC + '"', 'fill="' + s.hornC + '" style="filter:brightness(.78)"');
  hd += '<path d="' + sm(M(N)) + '" fill="' + NC + '"/>' +
    '<g clip-path="url(#dab-' + id + '-cn)"><path d="' + hairs([Math.min(...N.map((p) => p[0])), Math.min(...N.map((p) => p[1])) + ly, Math.max(...N.map((p) => p[0])), Math.max(...N.map((p) => p[1])) + ly], s.hairN * .35, s.hairLen, 2.2, 31) + '" stroke="' + (s.dark ? '#000' : s.hairC) + '" stroke-opacity=".3" stroke-width=".5" fill="none"/>' +
    '<path d="M' + pt([N[1][0], N[1][1] + ly + 4]) + 'Q' + pt([N[3][0] - 4, N[3][1] + ly + 8]) + ' ' + pt([N[4][0] - 4, N[4][1] + ly + 6]) + '" stroke="#fff" stroke-opacity=".18" stroke-width="' + r1(2.4 * s.wk) + '" fill="none"/>' +
    '<path d="M' + pt([N[6][0] - 2, N[6][1] + ly]) + 'Q' + pt([N[7][0] - 4, N[7][1] + ly]) + ' ' + pt([N[8][0] - 3, N[8][1] + ly]) + '" stroke="#000" stroke-opacity=".12" stroke-width="' + r1(3 * s.wk) + '" fill="none"/></g>';
  if (s.dewlap) hd += '<path d="' + sm(M(s.dewlap)) + '" fill="' + C + '"/><path d="M' + pt([174, 110 + ly]) + 'q8 4 16 -2 M' + pt([172, 118 + ly]) + 'q7 3 14 -2 M' + pt([186, 100 + ly]) + 'q4 4 9 0" stroke="#000" stroke-opacity=".12" stroke-width="1.3" fill="none"/>';
  if (s.ruff) hd += '<path d="' + hairs([172, 64 + ly, 186, 96 + ly], 34, 9, 1.75, 41, .1) + '" stroke="#B8AA92" stroke-opacity=".6" stroke-width=".7" fill="none" stroke-linecap="round"/><path d="' + hairs([170, 70 + ly, 184, 94 + ly], 20, 9, 1.7, 43, .1) + '" stroke="#fff" stroke-opacity=".8" stroke-width=".8" fill="none" stroke-linecap="round"/>';
  const ear = '<g' + cls('d-ear') + o(s.earOrigin[0], s.earOrigin[1]) + '><path d="' + sm(M(s.ear)) + '" fill="' + NC + '" stroke="#000" stroke-opacity=".16" stroke-width=".7"/><path d="' + sm(M(s.ear.map((p, i) => [p[0] + (s.earOrigin[0] - p[0]) * .3, p[1] + (s.earOrigin[1] - p[1]) * .3 + (i > s.ear.length / 2 ? -.6 : .6)]))) + '" fill="' + s.earIn + '" opacity=".75"/>' +
    (s.earTip ? '<path d="' + sm(M([[s.ear[2][0] + 3, s.ear[2][1] - 1], s.ear[2], s.ear[3], s.ear[4], [s.ear[4][0] + 3, s.ear[4][1] - 1.4]])) + '" fill="' + s.earTip + '"/>' : '') + '</g>';
  if (!s.earFront) hd += ear;
  hd += '<path d="' + sm(M(H)) + '" fill="' + NC + '"/>' + vol(H);
  // the face: a light along the brow and nose, the shadow under the jaw, the cheek
  hd += '<path d="M' + pt([H[1][0] + 2, H[1][1] + ly + 2]) + 'Q' + pt([H[3][0], H[3][1] + ly + 2]) + ' ' + pt([H[5][0] - 2, H[5][1] + ly]) + '" stroke="#fff" stroke-opacity=".22" stroke-width="' + r1(1.8 * s.wk) + '" fill="none" stroke-linecap="round"/>' +
    '<path d="M' + pt([H[H.length - 4][0], H[H.length - 4][1] + ly - 1]) + 'Q' + pt([H[H.length - 3][0] - 1, H[H.length - 3][1] + ly - 2]) + ' ' + pt([H[H.length - 2][0], H[H.length - 2][1] + ly - 2]) + '" stroke="#000" stroke-opacity=".14" stroke-width="' + r1(2.2 * s.wk) + '" fill="none"/>';
  if (s.muzzleE) hd += '<ellipse cx="' + r1(s.nose[0] - 1) + '" cy="' + r1(s.nose[1] + 3.6 + ly) + '" rx="7" ry="6" transform="rotate(-30 ' + r1(s.nose[0] - 1) + ' ' + r1(s.nose[1] + 3.6 + ly) + ')" fill="' + s.muzzle + '"/>';
  else hd += '<path d="' + sm(M([[H[5][0] - 3, H[5][1] - 2], [H[6][0], H[6][1]], [H[7][0], H[7][1]], [H[8][0] + 1, H[8][1] - .4], [H[8][0] - 1, H[8][1] - 4]])) + '" fill="' + s.muzzle + '" opacity=".6"/>';
  hd += '<path d="M' + pt([s.nose[0] - 1.2, s.nose[1] - .8 + ly]) + 'q1.6 .2 1.8 1.6 q-.3 1 -1.4 1.1" stroke="#0E0805" stroke-width="' + r1(.8 * s.wk + .2) + '" fill="none" stroke-linecap="round"/>' +
    '<path d="' + s.mouth + '" stroke="#0E0805" stroke-opacity=".7" stroke-width=".8" fill="none" stroke-linecap="round" transform="translate(0 ' + ly + ')"/>' +
    eyeA(s.eye[0], s.eye[1] + ly, s.eye[2], s.eye[3], !cow, s.lid);
  if (s.beard) hd += '<path d="' + taper(M(s.beard), 4.4, .8) + '" fill="' + s.beardC + '"/>';
  if (s.earFront) hd += ear;
  if (s.curl) { const [cx, cy, R] = s.curl, c = spiral(cx, cy + ly, R, -1.05, .86, .78); hd += horn(c, s.hw[0], s.hw[1], s.hornC, s.hornR) + '<path d="M' + pt(c[2]) + 'Q' + pt([cx, cy + ly]) + ' ' + pt(c[c.length - 4]) + '" stroke="#000" stroke-opacity=".12" stroke-width="2" fill="none"/>'; }
  if (s.horns) hd += horn(M(s.horns[0]), s.hw[0], s.hw[1], s.hornC, s.hornR, s.hornTip);
  // the halter rope the sellers tie them with
  hd += '<path d="' + s.collar + '" stroke="' + ROPE2 + '" stroke-width="' + r1(2.2 * s.wk) + '" fill="none" stroke-linecap="round" transform="translate(0 ' + ly + ')"/><path d="' + s.collar + '" stroke="' + ROPE + '" stroke-width="' + r1(1.3 * s.wk) + '" stroke-dasharray="1.4 .8" fill="none" transform="translate(0 ' + ly + ')"/>';
  return a + '<g' + cls('d-up') + o((bx0 + bx1) / 2, by1) + '>' + up + '<g' + cls('d-hd') + o(s.hd[0], s.hd[1]) + '>' + hd + '</g></g>';
}
/** where (in the 240×160 frame) a native point of animal `id` lands once the animal is scaled and placed */
const place = (id, p) => { const s = SPEC[id]; return [120 + s.k * (p[0] - s.cx), 150 + s.k * (p[1] + (s.lift || 0) - 150)]; };
/** a game piece: the animal at its post, its tether, and (hidden till it is bought) the buyer with his lead rope */
export function dabba(id) {
  const s = SPEC[id], [ax, ay] = place(id, s.at), bx = Math.max(ax + 44, 238), hand = [bx - 11.4 * 3.5, 150 - 17 * 3.5], px = Math.min(ax + 6, 232);
  const buyer = person({ x: bx, y: 150, s: 3.5, skin: [0, 2, 4][id.charCodeAt(1) % 3], dress: 'riga', c: ['#F4EBD0', '#3F6E8C', '#7A6A58'][id.charCodeAt(1) % 3], t: '#C9A15E', ...CAPS[[1, 3, 4][id.charCodeAt(1) % 3]], al: 'out', ar: 'down', cls: 'x-buyer' });
  return '<svg class="dab dab-' + id + '" viewBox="0 0 240 160" aria-hidden="true"><defs>' + dabDefs(id) + '</defs>' +
    // (r3, Sani 2026-10-27) tied the way they are at the market: the halter rope runs down to a peg driven into the
    // ground in front of the forefeet; the price board stands on its own stake behind the rump (games2 places it)
    '<g><ellipse cx="' + r1(px + 1.6) + '" cy="151" rx="4.4" ry="1.1" fill="#3C2810" opacity=".3"/><path d="M' + r1(px - 1.1) + ' 151 L' + r1(px - .8) + ' 143.4 Q' + r1(px) + ' 142.4 ' + r1(px + .8) + ' 143.4 L' + r1(px + 1.1) + ' 151Z" fill="#7A5230"/><path d="M' + r1(px - .6) + ' 150 L' + r1(px - .4) + ' 144" stroke="#B88A56" stroke-width=".5"/></g>' +
    '<path class="d-teth" d="M' + r1(px) + ' 144.4 Q' + r1((px + ax) / 2 + 3) + ' ' + r1(Math.max(144, ay) + 6) + ' ' + r1(ax) + ' ' + r1(ay) + '" stroke="' + ROPE2 + '" stroke-width="1.3" fill="none"/>' +
    '<g class="d-walk"><g class="d-all" style="transform-origin:120px 150px"><g transform="translate(120 150) scale(' + s.k + ') translate(' + (-s.cx) + ' -150)">' + dabArt(id) + '</g></g>' +
    '<path class="d-rope" d="M' + r1(ax) + ' ' + r1(ay) + ' Q' + r1((ax + hand[0]) / 2) + ' ' + r1(Math.max(ay, hand[1]) + 14) + ' ' + r1(hand[0]) + ' ' + r1(hand[1]) + '" stroke="' + ROPE2 + '" stroke-width="1.4" fill="none"/>' +
    '<g class="d-buy sh4">' + buyer + '</g></g></svg>';
}
/** where the price board's stake stands, in % of the 240-wide frame: just behind the animal's rump */
export function dabRump(id) { const s = SPEC[id], B = s.body, x0 = Math.min(...B.map((p) => p[0])), x1 = Math.max(...B.map((p) => p[0])); return Math.max(9, place(id, [x0 + (x1 - x0) * .06, 0])[0] / 2.4); }
/** a still copy for the background (no classes), placed like the cattle there: feet at (x, y), s the scale */
export const dabStill = (x, y, s, id, flip) => '<g transform="translate(' + n2(x) + ' ' + n2(y) + ') scale(' + (flip ? -s : s) + ' ' + s + ') ' + FRAME + '"><g transform="translate(120 150) scale(' + SPEC[id].k + ') translate(' + (-SPEC[id].cx) + ' -150)">' + dabArt(id, false) + '</g></g>';
/** a background copy that moves (breathes, flicks its tail, lifts its head): classes kept, under .x-live */
export const dabLive = (x, y, s, id, flip, cls = '') => '<g transform="translate(' + n2(x) + ' ' + n2(y) + ') scale(' + (flip ? -s : s) + ' ' + s + ') ' + FRAME + '"><g class="x-live ' + cls + '" transform="translate(120 150) scale(' + SPEC[id].k + ') translate(' + (-SPEC[id].cx) + ' -150)">' + dabArt(id) + '</g></g>';

/* ---- their voices (WebAudio, gentle): a goat's bleat, a ram's lower one, a cow's moo; displeased is shorter and falls ---- */
let dac = null;
export function dabSound(id, happy) {
  try { dac = dac || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
  const t = dac.currentTime + .03, fam = id[0];
  if (fam === 'c') {   // the cow: a low moo through a soft filter; happy rises a little at the end
    const o = dac.createOscillator(), f = dac.createBiquadFilter(), g = dac.createGain(), d = happy ? 1.1 : 1.3;
    o.type = 'sawtooth'; o.frequency.setValueAtTime(happy ? 140 : 150, t); o.frequency.linearRampToValueAtTime(happy ? 168 : 172, t + .3); o.frequency.exponentialRampToValueAtTime(happy ? 150 : 100, t + d);
    f.type = 'lowpass'; f.frequency.setValueAtTime(380, t); f.frequency.linearRampToValueAtTime(happy ? 900 : 650, t + .35); f.frequency.linearRampToValueAtTime(420, t + d);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.13, t + .15); g.gain.setValueAtTime(.13, t + d - .3); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(f).connect(g).connect(dac.destination); o.start(t); o.stop(t + d + .05); return;
  }
  // goats and sheep: a buzzy voice through a nasal formant, its loudness wobbling fast (the "baa")
  const goat = fam === 'g', f0 = goat ? (happy ? 430 : 380) : (happy ? 235 : 200), d = happy ? (goat ? .75 : .9) : .6, wob = goat ? 24 : 15;
  const o = dac.createOscillator(), bp = dac.createBiquadFilter(), lp = dac.createBiquadFilter(), am = dac.createGain(), env = dac.createGain(), lfo = dac.createOscillator(), lg2 = dac.createGain();
  o.type = 'sawtooth'; o.frequency.setValueAtTime(f0, t); o.frequency.linearRampToValueAtTime(f0 * (happy ? 1.06 : 1.02), t + .15); o.frequency.exponentialRampToValueAtTime(f0 * (happy ? .9 : .72), t + d);
  bp.type = 'bandpass'; bp.frequency.value = goat ? 1150 : 800; bp.Q.value = 1.6; lp.type = 'lowpass'; lp.frequency.value = goat ? 3000 : 2000;
  lfo.frequency.value = wob; lg2.gain.value = .45; am.gain.value = .55; lfo.connect(lg2).connect(am.gain);
  env.gain.setValueAtTime(.0001, t); env.gain.exponentialRampToValueAtTime(goat ? .2 : .24, t + .06); env.gain.setValueAtTime(goat ? .2 : .24, t + d - .2); env.gain.exponentialRampToValueAtTime(.0001, t + d);
  o.connect(bp).connect(lp).connect(am).connect(env).connect(dac.destination); o.start(t); lfo.start(t); o.stop(t + d + .05); lfo.stop(t + d + .05);
}

/** the animal alone, as the market draws it (Ƙirgen shanu’s counted cows, sc-garke): no post, tether or buyer */
export function dabbaAlone(id) { const s = SPEC[id]; return '<svg class="dab dab-' + id + '" viewBox="0 0 240 160" aria-hidden="true"><defs>' + dabDefs(id) + '</defs><g class="d-all" style="transform-origin:120px 150px"><g transform="translate(120 150) scale(' + s.k + ') translate(' + (-s.cx) + ' -150)">' + dabArt(id) + '</g></g></svg>'; }
/** the market’s animal table, so Ƙirgen shanu (sc-garke) can add its bulls and other breeds drawn the same way */
export const dabSpec = SPEC;
