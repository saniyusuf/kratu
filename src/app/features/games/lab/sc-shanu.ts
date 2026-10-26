// @ts-nocheck
/*
 * Kasuwar shanu, drawn (Sani 2026-10-25: the same hand as Hawan Sallah). A big open cattle market in the morning, like
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
  hula: (c, c2) => '<path d="M-3.6 -32.8 Q-3.8 -37.8 0 -38 Q3.8 -37.8 3.6 -32.8 Z" fill="' + c + '"/><path d="M-3.3 -34.4 l.8 -.9 .8 .9 .8 -.9 .8 .9 .8 -.9 .8 .9 .8 -.9 .8 .9" stroke="' + c2 + '" stroke-width=".4" fill="none"/><path d="M-3.6 -32.8 H3.6" stroke="#000" stroke-opacity=".2" stroke-width=".4"/>',
  zanna: (c) => '<path d="M-3.7 -32.6 L-3.3 -37.2 Q0 -38.6 3.7 -36.4 L3.7 -32.6 Q0 -33.6 -3.7 -32.6Z" fill="' + c + '"/><path d="M-3.3 -37.2 Q-.2 -35.2 3.7 -36.4" stroke="#000" stroke-opacity=".22" stroke-width=".45" fill="none"/>',
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
  const cap = CAP[o.cap] ? CAP[o.cap](o.capc, o.capc2) : '';
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
export function shanuScene(): string {
  const defs = '<defs>' + lg('sky', '#A8D2E6', '#DCE3D6', '#F1DEB6') + lg('gr', '#DDBA82', '#CBA068', '#B88B52') +
    '<radialGradient id="' + P + '-sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF8E2"/><stop offset=".35" stop-color="#FFF0C8" stop-opacity=".7"/><stop offset="1" stop-color="#FFF0C8" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="' + P + '-sh" cx=".38" cy=".36" r=".7"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></radialGradient>' +
    '<radialGradient id="' + P + '-du" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#F2DDB2" stop-opacity=".8"/><stop offset="1" stop-color="#F2DDB2" stop-opacity="0"/></radialGradient>' +
    HEADB + FACE + JALF + RIGF + WOMF + COWDEFS() + '<path id="' + P + '-ft" d="M-3.6 -1.4h2.8v1.3h-3.4z M.8 -1.4h2.8l.6 1.3h-3.4z" fill="#2E2218"/></defs>';

  const sky = '<rect width="320" height="200" fill="url(#' + P + '-sky)"/><circle cx="92" cy="40" r="28" fill="url(#' + P + '-sun)"/><circle cx="92" cy="40" r="7.5" fill="#FFF7DC"/>' +
    // far hills, a town with its minaret, and a line of trees along the horizon
    '<path d="M0 92 Q40 82 86 88 T170 84 T250 86 T320 82 V104 H0Z" fill="#B9AE8C" opacity=".45"/>' +
    '<g fill="#BBA27A" opacity=".5"><path d="M150 100 V92 H166 V100Z M170 100 V90 H180 V100Z"/><path d="M184 100 V76 L185.6 72 L187.2 76 V100Z"/><ellipse cx="176" cy="90" rx="4" ry="3.4"/></g>' +
    '<g fill="#7F946A" opacity=".55">' + [[12, 6], [40, 5], [62, 7], [128, 5], [146, 6], [200, 6], [226, 5], [252, 7], [296, 6]].map(([x, r]) => '<ellipse cx="' + x + '" cy="' + (98 - r * .4) + '" rx="' + r + '" ry="' + (r * .6) + '"/><rect x="' + (x - .5) + '" y="' + (98 - r * .2) + '" width="1" height="3"/>').join('') + '</g>';

  const ground = '<path d="M0 100 Q160 96 320 100 V200 H0Z" fill="url(#' + P + '-gr)"/>' +
    '<g fill="#B88B52" opacity=".3"><ellipse cx="70" cy="130" rx="40" ry="2.4"/><ellipse cx="240" cy="140" rx="54" ry="2.6"/><ellipse cx="150" cy="172" rx="80" ry="3"/><ellipse cx="40" cy="190" rx="40" ry="2"/></g>' +
    '<g fill="#8A6A3A" opacity=".35">' + [[30, 140], [96, 150], [180, 136], [262, 156], [300, 182], [120, 186], [210, 192]].map(([x, y]) => '<ellipse cx="' + x + '" cy="' + y + '" rx="1.6" ry=".7"/>').join('') + '</g>';

  // the far herds across the yard, each with its Fulani herder in a malafa hat
  const herder = (x, y, s, sk, c, flip, cls = '') => person({ x, y, s, skin: sk, c, t: '#E9D9A6', cap: 'malafa', capc: '#D9B464', capc2: '#6B3A1E', al: 'staff', ar: 'down', flip, cls: 'x-w x-hr ' + cls,
    hl: '<path d="M-7.9 -36 L-6.8 1.4" stroke="#6B4422" stroke-width=".9" stroke-linecap="round"/>' });
  const farHerds = '<g opacity=".9">' +
    cow(120, 101, .49, 'wf', 0, 'down') + cow(131, 102, .51, 'rb', 1) + cow(140, 100.6, .46, 'wf', 0) + cow(112, 103, .51, 'gu', 0, 'down') + herder(148, 103, .3, 2, '#3F6E8C', 1) +
    cow(196, 101, .49, 'rb', 1, 'down') + cow(206, 102.4, .51, 'rb', 0) + cow(186, 103, .49, 'wf', 1) + cow(216, 100.8, .45, 'gu', 1, 'down') + herder(178, 103.4, .3, 4, '#8A5A2E', 0) +
    cow(46, 104, .5, 'rb', 0) + cow(58, 103, .48, 'wf', 1, 'down') + cow(36, 102.4, .44, 'gu', 0) + cow(66, 104.6, .5, 'rb', 1) + herder(28, 105, .32, 0, '#C9B28A', 0) +
    '<g opacity=".6">' + [[96, 'wf', 0], [104, 'rb', 1], [228, 'wf', 1], [236, 'rb', 0], [244, 'gu', 1], [292, 'wf', 0], [300, 'rb', 1], [20, 'wf', 1]].map(([x, k, f]) => cow(x, 97.6, .3, k, f)).join('') + '</g>' +
    cow(160, 99, .41, 'wf', 1) + cow(168, 99.4, .41, 'gu', 0) + '</g>';

  const mat = (x, y) => '<g transform="translate(' + x + ' ' + y + ')"><path d="M-9 -9 H9 L10.4 -7 H-10.4Z" fill="#C9A15E"/><path d="M-8 -7 V0 M8 -7 V0" stroke="#6B4A2A" stroke-width=".7"/>' +
    '<g fill="#7A5A3A"><path d="M-5 0 L-4.4 -4 H-1.6 L-1 0Z"/><circle cx="-3" cy="-5" r="1"/><path d="M2 0 L2.6 -4 H5.4 L6 0Z"/><circle cx="4" cy="-5" r="1"/></g><path d="M-4 -5.6 h2 M3 -5.6 h2" stroke="#F4EBD0" stroke-width=".8"/></g>';
  const far2 = '<g opacity=".7">' + mat(150, 101) + mat(172, 101.4) + mat(266, 100) + '</g>';
  const fulani = person({ x: 180, y: 122, s: .48, skin: 5, dress: 'wom', c: '#1E3A6E', t: '#FFD54A', w: '#2B2B2B', w2: '#C62828', cap: 'kallabi', capc: '#2B2B2B', capc2: '#FFD54A', al: 'head', ar: 'down', cls: 'x-w',
    load: '<g><ellipse cy="-39.4" rx="4.6" ry="3" fill="#C98A3A"/><path d="M-4.6 -39.4 Q0 -36 4.6 -39.4" stroke="#8A5A22" stroke-width=".4" fill="none"/><path d="M-4.4 -40.6 Q0 -43.4 4.4 -40.6 Q0 -42 -4.4 -40.6Z" fill="#E8D8B0"/><path d="M-3 -41 h6" stroke="#6E8A3A" stroke-width=".4"/></g>' }) +
    person({ x: 187, y: 122.4, s: .32, skin: 2, c: '#C2185B', cap: 'kube', capc: '#F4EBD0', al: 'down', ar: 'down', cls: 'x-w x-kid' });
  // left: the tea seller's stand under a neem, a man on the bench with his glass
  const tea = neem(22, 112, 1.25) + '<g>' +
    // kettles, glasses and the charcoal stove
    '<g><path d="M35 113.8 Q34.4 110.4 37 110 Q39.6 110.4 39 113.8Z" fill="#2E7D32"/><path d="M39 111.4 l2 -1.4" stroke="#2E7D32" stroke-width=".7"/><path d="M36 110.2 q1 -1 2 0" stroke="#1B5E20" stroke-width=".6" fill="none"/>' +
    '<path d="M41.6 113.8 Q41 110.8 43.4 110.4 Q45.8 110.8 45.2 113.8Z" fill="#1565C0"/><path d="M45.2 111.6 l1.8 -1.2" stroke="#1565C0" stroke-width=".7"/>' +
    '<g fill="#F4E3B8" opacity=".9"><rect x="47.4" y="111.8" width="1.2" height="2" rx=".2"/><rect x="49.2" y="111.8" width="1.2" height="2" rx=".2"/><rect x="51" y="111.8" width="1.2" height="2" rx=".2"/></g><g fill="#B5651D"><rect x="47.4" y="112.8" width="1.2" height="1"/><rect x="49.2" y="112.8" width="1.2" height="1"/></g></g>' +
    '<path d="M56 124 L57 119 H63 L64 124Z" fill="#4E4A46"/><ellipse cx="60" cy="119" rx="3.4" ry=".9" fill="#E8661A"/><path d="M58.6 118.8 Q59 116.6 61.4 116.4 Q63.6 116.8 62.6 119Z" fill="#37474F"/>' +
    '<g class="x-stm"><path d="M60 115.6 q-1.4 -2.4 0 -4.6 q1.2 -2 0 -4" stroke="#fff" stroke-width=".7" fill="none" opacity=".7" stroke-linecap="round"/><path d="M37 109 q-1 -2 0 -3.6" stroke="#fff" stroke-width=".5" fill="none" opacity=".6"/></g>' +
    person({ x: 42, y: 116.2, s: .44, skin: 3, c: '#F4EBD0', t: '#C62828', cap: 'hula', capc: '#C62828', capc2: '#F4EBD0', al: 'front', ar: 'down', cls: 'x-w' }) +
    '<path d="M30 114 H54 L53 115.6 H31Z" fill="#8B5A2B"/><path d="M32 115.6 V124 M52 115.6 V124" stroke="#6B4422" stroke-width="1"/>' +
    // the bench, with a man in a riga sitting with his tea, and a herder standing by
    '<path d="M4 120 H26 V121.4 H4Z" fill="#7A4A22"/><path d="M6 121.4 V126 M24 121.4 V126" stroke="#5E3A1C" stroke-width=".9"/>' +
    '<g class="x-sit">' + person({ x: 12, y: 125.8, s: .5, skin: 1, dress: 'sit', c: '#5E7FA8', t: '#FFD54A', cap: 'zanna', capc: '#B71C1C', beard: '#2A1E14', al: ['M-4.2 -24.8 Q-6.4 -19 -2.6 -17.4', -2.2, -17.4], ar: 'down', cls: 'x-w',
      hl: '<rect x="-3" y="-20" width="1.6" height="2.4" rx=".2" fill="#F4E3B8"/><rect x="-3" y="-18.9" width="1.6" height="1.3" fill="#B5651D"/>' }) + '</g>' +
    '<path d="M4 120 H26" stroke="#5E3A1C" stroke-width=".5"/></g>';

  // the water trough, two cattle drinking and an egret on the rim
  const trough = cowLive(76, 112.4, .8, 'wf', 0, 'drink', 'x-dr') + cow(109, 113, .78, 'rb', 1, 'drink') +
    '<g><path d="M80 106.4 H104 L103 111.4 H81Z" fill="#7C858F"/><path d="M80 106.4 H104" stroke="#5E666E" stroke-width=".8"/><ellipse cx="92" cy="106.8" rx="11.4" ry=".9" fill="#8FC3D6"/><path d="M81 111.4 H103" stroke="#3C2810" stroke-opacity=".25" stroke-width="1.2"/></g>' +
    '<g transform="translate(100 106.2) scale(.32)"><path d="M-5 0 Q-1 -2.6 4 -2 L4.6 -6 Q5.4 -9.4 8 -9 L10.4 -8.4 L8 -7.6 Q6.6 -7.6 6.6 -5.6 L6 -1 Q2 2 -5 0Z" fill="#FFFDF6"/><path d="M-1 0 V5 M1.4 0 V5" stroke="#8A7A4A" stroke-width=".7"/></g>';

  // the haggling: a buyer in babban riga, hand out with his price; the owner (malafa) shakes his head; a calf by them
  const haggle = person({ x: 132, y: 122, s: .5, skin: 0, dress: 'riga', c: '#F4EBD0', t: '#1565C0', cap: 'hula', capc: '#1565C0', capc2: '#FFD54A', al: 'down', ar: 'front', cls: 'x-w x-shrug' }) +
    herder(146, 122.4, .5, 5, '#6A5A3A', 1) + calf(160, 122.6, .5, 'rb', 1) +
    person({ x: 120, y: 121.4, s: .46, skin: 2, dress: 'riga', c: '#2E7D32', t: '#F4EBD0', cap: 'turban', capc: '#FFFFFF', beard: '#E8E4DC', al: 'hip', ar: 'hip', cls: 'x-w' });

  // right: a lorry backed up to an earth ramp, a red Bororo bull led up into it, heads and horns over the slats
  let slats = ''; for (let x = 238; x <= 284; x += 4.6) slats += 'M' + n2(x) + ' 80 V104';
  const lorry = '<g><ellipse cx="252" cy="111" rx="40" ry="2" fill="#3C2810" opacity=".2"/>' +
    // heads of the cattle already loaded
    cow(250, 100, .66, 'rb', 1) + cow(263, 100.4, .64, 'wf', 0) + cow(276, 100, .62, 'gu', 1) +
    '<rect x="236" y="80" width="51" height="24" fill="#8B5A2B" opacity=".25"/><path d="' + slats + '" stroke="#8B5A2B" stroke-width="1.4"/><path d="M236 80 H287 M236 92 H287 M236 103.4 H287" stroke="#6B4422" stroke-width="1.4"/>' +
    '<rect x="234" y="104" width="54" height="3.4" fill="#3E3A38"/><path d="M234 104 H288" stroke="#C62828" stroke-width=".8"/>' +
    // the cab, facing left
    '<path d="M214 107.4 V95 Q214 90 218 89 L224 85.6 H235 V107.4Z" fill="#1E6FA8"/><path d="M219 95 L224.4 88.6 H232 V95Z" fill="#BFE3F2"/><path d="M214 100 H235" stroke="#155A8A" stroke-width=".7"/><rect x="212.4" y="102.6" width="3" height="1.8" fill="#FFE08A"/><path d="M226 96 v8" stroke="#155A8A" stroke-width=".5"/>' +
    '<path d="M214 104.4 H235" stroke="#FFD54A" stroke-width=".8"/>' +
    [222, 248, 276].map((x) => '<circle cx="' + x + '" cy="108.6" r="3.4" fill="#222"/><circle cx="' + x + '" cy="108.6" r="1.3" fill="#9E9E9E"/>').join('') +
    // the ramp of packed earth and planks, the bull on it, the herder behind with his staff
    '<path d="M287 104 L306 117 H312 L291 104Z" fill="#A9814E"/><path d="M288 104.4 L307 116.6 M290 104.4 L309.4 116.6" stroke="#7A5530" stroke-width=".5"/>' +
    '<g class="x-up"><g transform="translate(297 111) rotate(33)">' + cowLive(0, 0, .74, 'rb', 1, 'up', 'x-bull') + '</g></g>' +
    herder(311, 119.4, .48, 1, '#E9DDC0', 1, 'x-push') + '</g>';
  // two more by the lorry: the driver leaning on the cab and a buyer counting notes
  const byLorry = person({ x: 208, y: 116, s: .46, skin: 4, c: '#7A6A58', t: '#F4EBD0', cap: 'kube', capc: '#E9D9A6', al: 'hip', ar: 'down', cls: 'x-w' }) +
    person({ x: 226, y: 118.6, s: .48, skin: 0, dress: 'riga', c: '#7B1FA2', t: '#FFD54A', cap: 'zanna', capc: '#B71C1C', al: 'front', ar: 'front', cls: 'x-w x-shrug',
      hl: '<rect x="-1.6" y="-19.8" width="2.6" height="1.6" fill="#7FB07A" stroke="#4E7A4A" stroke-width=".2"/>' });

  // near corners: an egret by the left foot of the yard, a neem's shade on the right, tufts of dry grass
  const tuft = (x, y) => '<path d="M' + x + ' ' + y + ' q-1 -3 -3 -4 M' + x + ' ' + y + ' q0 -4 1 -5 M' + x + ' ' + y + ' q1 -3 3.4 -3.6" stroke="#A9A050" stroke-width=".6" fill="none"/>';
  const near = neem(318, 122, 1.4) + '<g>' + tuft(10, 196) + tuft(16, 197) + tuft(306, 196) + tuft(196, 198) + tuft(70, 198) + '</g>';
  const dust = '<g class="x-du d1"><ellipse cx="140" cy="104" rx="70" ry="9" fill="url(#' + P + '-du)"/></g><g class="x-du d2"><ellipse cx="250" cy="118" rx="50" ry="7" fill="url(#' + P + '-du)"/></g>';

  return '<svg class="scene ' + P + '" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + defs + sky +
    egret(150, 54, .8, 'e1') + egret(176, 62, .62, 'e2') + ground + farHerds + dust + far2 + near_(trough, 92, 112, 1.12, 8) + near_(tea, 30, 125, 1.2, 8) + near_(haggle, 140, 122, 1.22, 11) + near_(fulani, 196, 122, 1.2, 10) + '<g transform="translate(-12 0)">' + near_(lorry, 262, 110, 1.12, 5) + '</g>' + near_(byLorry, 218, 118, 1.15, 8) + near + '</svg>';
}
