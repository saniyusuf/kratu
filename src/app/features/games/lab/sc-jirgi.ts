// @ts-nocheck
import { arewaCap } from './capsArewa';
/*
 * Jirgin ruwa (the ferry): a river crossing point in the morning. The far bank is a busy market town at its landing:
 * zinc-roofed and mat-roofed stalls of tomatoes, peppers and grain, umbrellas, market folk, a mosque with its minaret,
 * red-earth houses with zanko horns, dum palms and neems, canoes pulled up on the sand with a donkey and a man unloading.
 * Out on the water a long wooden engine boat full of passengers putts across near the far bank. Birds fly
 * over the river and two egrets stand at the far shallows. On the near bank (right) people wait for the ferry under a
 * shade tree: a market woman with a basin of tomatoes on her head, a man with his bicycle and its sack, a boy with a
 * goat on a rope, a man with a sack on his shoulder, and the tea seller (mai shayi) at his table and charcoal stove.
 * The middle stays open water for the game's word boat (engineBoat); the bottom left is sand under the game's jetty.
 *
 * Classes for sc-jirgi.css (transform and opacity only):
 *   .x-fig a whole person · .x-head head · .x-al / .x-ar arms · .x-wv an arm that waves on cheer · .x-cl a clapping arm
 *   .x-ms / .x-mf smile / frown · idle: .x-ferry .x-bird .x-ripple .x-goat .x-egret
 */
const P = 'jr4';
const SK = ['#7A4A26', '#5E3A1C', '#8B5A2B', '#6B4022', '#4F2F17', '#94603A'];

/* ---------- colour and gradient helpers ---------- */
const mix = (a, b, t) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
const dk = (c, t = 0.25) => mix(c, '#1a0e06', t);
const lt = (c, t = 0.25) => mix(c, '#ffffff', t);
const lg = (id, c, y1 = 0, y2 = 1, us = false) => '<linearGradient id="' + P + '-' + id + '" x1="0" y1="' + y1 + '" x2="0" y2="' + y2 + '"' + (us ? ' gradientUnits="userSpaceOnUse"' : '') + '>' +
  c.map((col, i) => '<stop offset="' + (i / (c.length - 1)).toFixed(2) + '" stop-color="' + col + '"/>').join('') + '</linearGradient>';
const u = (id) => 'url(#' + P + '-' + id + ')';
const f1 = (n) => (+n).toFixed(1);

/* ---------- people (drawn in a 60 x 140 box, feet on y 134, placed by a nested svg) ---------- */
const POSE = {
  down: ['M16 45 Q11 68 13 90', [13, 92]],
  wave: ['M16 45 Q5 30 9 10', [9, 8]],
  load: ['M16 45 Q5 28 17 8', [17, 7]],
  clap: ['M16 45 Q15 62 27 64', [28, 64]],
  fwd: ['M16 45 Q9 62 3 70', [2, 71]],
  hip: ['M16 45 Q4 60 15 76', [15, 77]],
  staff: ['M16 45 Q8 64 9 78', [9, 79]],
  wash: ['M16 45 Q13 66 23 76', [24, 77]],
  splash: ['M16 45 Q3 40 1 24', [1, 22]],
};
const mir = (d) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => (60 - +x) + ' ' + y);
function arm(side, pose, sleeve, sk, cls = '', w = 9, hold = '') {
  const L = side === 'l';
  let [d, [hx, hy]] = POSE[pose];
  if (!L) { d = mir(d); hx = 60 - hx; }
  if (/wave|load|splash/.test(pose)) cls += ' x-up';
  return '<g class="x-a' + side + (cls ? ' ' + cls : '') + '" style="transform-origin:' + (L ? '16px 45px' : '44px 45px') + '">' +
    '<path d="' + d + '" stroke="' + dk(sleeve, 0.3) + '" stroke-width="' + (w + 1.4) + '" stroke-linecap="round" fill="none"/>' +
    '<path d="' + d + '" stroke="' + sleeve + '" stroke-width="' + w + '" stroke-linecap="round" fill="none"/>' +
    '<circle cx="' + hx + '" cy="' + hy + '" r="3.7" fill="' + sk + '"/><circle cx="' + (hx + (L ? 1.6 : -1.6)) + '" cy="' + (hy - 1.6) + '" r="1.5" fill="' + dk(sk, 0.12) + '"/>' + hold + '</g>';
}
function head(o, sk) {
  const cy = 25;
  let back = '', front = '';
  const hc = o.hatc || '#F4EBD0', hc2 = o.hatc2 || '#C62828';
  if (o.hat === 'hijab') back = '<path d="M16 30 Q13 8 30 7.5 Q47 8 44 30 L50 60 Q30 68 10 60 Z" fill="' + hc + '"/><path d="M30 40 Q42 44 50 60" stroke="' + dk(hc, 0.18) + '" stroke-width="1.2" fill="none"/>';
  if (o.hat === 'hula' || o.hat === 'zanna' || o.hat === 'borno') front = arewaCap(o.hat, 30, 19, 11.3, hc, o.hatc2, o.hatc3, o.capside || 1);
  if (o.hat === 'turban') front = '<path d="M17 21 Q15.6 3 30 2.4 Q44.4 3 43 21 Q36 15 30 15.6 Q24 15 17 21 Z" fill="' + hc + '"/><path d="M18 13 Q30 5 42 13 M18 17.4 Q30 9.4 42 17.4" stroke="' + dk(hc, 0.16) + '" stroke-width="1.2" fill="none"/><path d="M41 19 Q47 30 43 44" stroke="' + hc + '" stroke-width="4" fill="none" stroke-linecap="round"/>';
  if (o.hat === 'kallabi') front = '<path d="M17 22 Q14 5 30 4 Q46 5 43 22 Q36 14.6 30 15.4 Q24 14.6 17 22 Z" fill="' + hc + '"/>' +
    '<path d="M22 8 Q14 -5 26 -3 Q30 -10 34.6 -3 Q46 -6 38 8 Z" fill="' + hc + '"/><path d="M26 -3 Q28.6 3 30 6.6 M34.6 -3 Q32 3 31 6.6" stroke="' + dk(hc, 0.3) + '" stroke-width="1" fill="none"/>' +
    '<path d="M18 16.6 Q30 9.6 42 16.6" stroke="' + hc2 + '" stroke-width="1.5" fill="none"/>';
  if (o.hat === 'hijab') front = '<path d="M17.4 26 Q16.4 8.5 30 8.5 Q43.6 8.5 42.6 26 Q39 16.4 30 16.6 Q21 16.4 17.4 26 Z" fill="' + hc + '"/><path d="M17.4 26 Q16 36 22 38 M42.6 26 Q44 36 38 38" stroke="' + hc + '" stroke-width="3" fill="none"/>';
  if (o.hat === 'malafa') front = '<path d="M30 -6 L43 13 L17 13 Z" fill="' + hc + '"/><path d="M30 -6 L43 13 L36 13 Z" fill="' + dk(hc, 0.16) + '"/>' +
    '<ellipse cx="30" cy="14" rx="21" ry="4.2" fill="' + hc + '"/><ellipse cx="30" cy="13.4" rx="21" ry="4.2" fill="none" stroke="' + hc2 + '" stroke-width="1.4"/>' +
    '<path d="M24.6 2 L35.4 2 M22.4 6 L37.6 6" stroke="' + hc2 + '" stroke-width="1.2"/><path d="M28.6 -6 h2.8 l-.4 -2.6 h-2 Z" fill="' + hc2 + '"/>';
  if (o.hat === 'hair') front = '<path d="M19.4 23 Q18.4 12.6 30 12.8 Q41.6 12.6 40.6 23 Q37 16.6 30 17 Q23 16.6 19.4 23 Z" fill="#1E120A"/>';
  if (o.hat === 'braids') front = '<path d="M19.4 23 Q18.4 12.6 30 12.8 Q41.6 12.6 40.6 23 Q37 16.6 30 17 Q23 16.6 19.4 23 Z" fill="#1E120A"/><path d="M24 14 V10 M30 13 V8.6 M36 14 V10" stroke="#1E120A" stroke-width="1.6" stroke-linecap="round"/>';
  const ld = o.load ? '<g transform="translate(30 4) scale(1.4)">' + o.load + '</g>' : '';
  return '<g class="x-head" style="transform-origin:30px 37px">' + back +
    '<path d="M26 32 h8 v10 h-8 Z" fill="' + dk(sk, 0.1) + '"/>' +
    '<path d="M19.6 23.6 q-2.6 .2 -2.2 2.8 q.4 2.4 2.6 2 Z M40.4 23.6 q2.6 .2 2.2 2.8 q-.4 2.4 -2.6 2 Z" fill="' + dk(sk, 0.08) + '"/>' +
    '<path d="M30 ' + (cy - 11.4) + ' C36.6 ' + (cy - 11.4) + ' 40.8 ' + (cy - 6.2) + ' 40.6 ' + cy + ' C40.4 ' + (cy + 6.4) + ' 36.4 ' + (cy + 11.8) + ' 30 ' + (cy + 11.8) + ' C23.6 ' + (cy + 11.8) + ' 19.6 ' + (cy + 6.4) + ' 19.4 ' + cy + ' C19.2 ' + (cy - 6.2) + ' 23.4 ' + (cy - 11.4) + ' 30 ' + (cy - 11.4) + ' Z" fill="' + sk + '"/>' +
    '<path d="M36.6 15.6 Q41.4 20 40.4 27.4 Q39 34.4 31.4 36.6 Q37 32 37.6 25.6 Q38 20 36.6 15.6 Z" fill="' + dk(sk, 0.28) + '" opacity=".7"/>' +
    '<path d="M23 18.6 q3.8 -3.6 9 -3 q-5 .8 -7.6 4 Z M21.8 27 q1.6 -1.2 3.2 0 q-1.6 1.6 -3.2 0 Z" fill="' + lt(sk, 0.4) + '" opacity=".45"/>' +
    '<path d="M24.3 24.2 q1.5 -2.4 3 0 q-1.5 2.2 -3 0 Z M32.7 24.2 q1.5 -2.4 3 0 q-1.5 2.2 -3 0 Z" fill="#1A0E06"/><path d="M25.9 23.3 h.7 v.7 h-.7 Z M34.3 23.3 h.7 v.7 h-.7 Z" fill="#fff" opacity=".85"/>' +
    '<path d="M23.2 21 q2.4 -1.4 4.8 -.2 M32 20.8 q2.4 -1.2 4.8 .2" stroke="#1A0E06" stroke-width="1" fill="none" stroke-linecap="round"/>' +
    '<path d="M29.8 23.4 q.4 2.4 .8 3.4 M27.4 27.6 q1.2 1.2 2.6 .5 q1.4 .7 2.6 -.5" stroke="' + dk(sk, 0.45) + '" stroke-width=".85" fill="none" stroke-linecap="round"/>' +
    '<path class="x-ms" d="M26.2 30.4 Q30 33.8 33.8 30.4" stroke="#3A1A0A" stroke-width="1.3" fill="none" stroke-linecap="round"/>' +
    '<path class="x-mf" d="M26.6 32.6 Q30 30 33.4 32.6" stroke="#3A1A0A" stroke-width="1.3" fill="none" stroke-linecap="round" opacity="0"/>' +
    (o.beard ? '<path d="M21.4 28 Q22 37.6 30 38.4 Q38 37.6 38.6 28 Q36 33.4 30 33.4 Q24 33.4 21.4 28 Z" fill="' + (o.beard === 'w' ? '#E8E4DC' : '#24160C') + '"/>' : '') +
    front + ld + (o.face || '') + '</g>';
}
function body(o, sk) {
  const r = o.robe, r2 = o.robe2 || dk(o.robe, 0.2), t = o.trim || '#F4EBD0';
  if (o.kind === 'man') return '<path d="M21 124 h7 v8 h-9 Z M32 124 h7 l2 8 h-9 Z" fill="' + (o.trou || '#E8DFC8') + '"/><path d="M17 131 h11 v3 h-12 Z M32 131 h11 l1 3 h-12 Z" fill="#3A2416"/>' +
    '<path d="M18 46 Q30 41 42 46 L45 126 Q30 129 15 126 Z" fill="' + r2 + '"/>' +
    '<path d="M14 43 Q30 37 46 43 Q57 72 56 118 Q48 122 40 120 L38 70 L22 70 L20 120 Q12 122 4 118 Q3 72 14 43 Z" fill="' + r + '"/>' +
    '<path d="M38 70 L40 120 Q48 122 56 118 Q57 72 46 43 Q44 60 38 70 Z" fill="' + dk(r, 0.14) + '"/>' +
    '<path d="M24 44 L30 62 L36 44" fill="none" stroke="' + t + '" stroke-width="1.4"/><path d="M22 52 q-2 6 2 10 q4 3 6 -2" stroke="' + t + '" stroke-width="1.1" fill="none"/><circle cx="25" cy="58" r="2.2" fill="none" stroke="' + t + '" stroke-width="1"/>' +
    '<path d="M12 60 Q9 88 9 114 M48 60 Q51 88 51 114 M30 72 V124" stroke="' + dk(r, 0.22) + '" stroke-width="1" fill="none" opacity=".7"/>' +
    '<path d="M5 117 Q12 121 20 119 M40 119 Q48 121 55 117" stroke="' + t + '" stroke-width="1.3" fill="none"/>';
  if (o.kind === 'boy') return '<path d="M22 112 h6 v20 h-7 Z M32 112 h6 l1 20 h-7 Z" fill="' + (o.trou || '#E8DFC8') + '"/><path d="M19 130 h9 v4 h-10 Z M32 130 h9 l1 4 h-10 Z" fill="#3A2416"/>' +
    '<path d="M17 45 Q30 40 43 45 L47 116 Q30 120 13 116 Z" fill="' + r + '"/><path d="M36 45 Q42 44 43 45 L47 116 Q42 118 38 118 Z" fill="' + dk(r, 0.15) + '"/>' +
    '<path d="M25 46 L30 56 L35 46" fill="none" stroke="' + t + '" stroke-width="1.2"/><path d="M20 70 Q18 92 16 112 M30 60 V116" stroke="' + dk(r, 0.22) + '" stroke-width=".9" fill="none" opacity=".7"/>';
  // woman / girl: blouse and zani wrapper
  return '<path d="M20 130 h8 v4 h-9 Z M32 130 h8 l1 4 h-9 Z" fill="' + dk(sk, 0.35) + '"/>' +
    '<path d="M15 43 Q30 38 45 43 L47 82 L13 82 Z" fill="' + r + '"/><path d="M36 41 Q42 41 45 43 L47 82 L38 82 Z" fill="' + dk(r, 0.15) + '"/>' +
    '<path d="M23 43 Q30 51 37 43" fill="none" stroke="' + t + '" stroke-width="1.4"/>' +
    '<path d="M11 80 L49 80 L52 131 Q30 135 8 131 Z" fill="' + (o.wrap || '#2F6B9A') + '"/><path d="M11 80 L49 80 L49.6 87 L10.4 87 Z" fill="' + (o.wrap2 || '#FFD54A') + '"/>' +
    '<path d="M9.6 104 H50.4 M9 119 H51" stroke="' + (o.wrap2 || '#FFD54A') + '" stroke-width="2"/>' +
    '<g fill="' + (o.wrap2 || '#FFD54A') + '">' + [15, 23, 31, 39, 47].map((x) => '<path d="M' + x + ' 109 l2.6 2.6 l-2.6 2.6 l-2.6 -2.6 Z"/>').join('') + '</g>' +
    '<path d="M42 88 Q40 108 45 131 M20 90 Q18 110 16 131" stroke="rgba(0,0,0,.2)" stroke-width="1.1" fill="none"/>';
}
/** a standing person with feet at (x, y), h units tall; o.cls adds classes to the figure */
function person(x, y, h, o) {
  const s = h / 140, sk = SK[o.skin % SK.length], w = o.kind === 'man' ? 11 : 8.4;
  const arms = arm('l', o.al || 'down', o.sl || o.robe, sk, o.alc || '', w, o.hl || '') + arm('r', o.ar || 'down', o.sl || o.robe, sk, o.arc || '', w, o.hr || '');
  const inner = '<ellipse cx="30" cy="135" rx="22" ry="3.4" fill="rgba(40,24,10,.28)"/>' + (o.under || '') +
    '<g class="x-fig' + (o.cls ? ' ' + o.cls : '') + '" style="transform-origin:30px 134px">' + (o.behind || '') +
    (o.armsBack ? arms + body(o, sk) : body(o, sk) + arms) + head(o, sk) + (o.front || '') + '</g>';
  return '<svg x="' + f1(x - 30 * s) + '" y="' + f1(y - 134 * s) + '" width="' + f1(60 * s) + '" height="' + f1(140 * s) + '" viewBox="0 0 60 140" overflow="visible">' + inner + '</svg>';
}

/* ---------- scenery ---------- */
const thatchLines = (x, y, w, h) => { let s = ''; for (let i = -3; i <= 3; i++) s += 'M' + f1(x + i * w / 7) + ' ' + f1(y + h) + ' L' + f1(x + i * w / 20) + ' ' + f1(y + h * 0.15) + ' '; return '<path d="' + s + '" stroke="#8A6A2E" stroke-width=".35" opacity=".6" fill="none"/>'; };
/** a round mud hut with a conical thatched roof, base centre (x, y), width w */
const hut = (x, y, w, wall = '#C98A55') => { const h = w * 0.55, rh = w * 0.62;
  return '<g><path d="M' + f1(x - w / 2) + ' ' + f1(y) + ' V' + f1(y - h) + ' H' + f1(x + w / 2) + ' V' + f1(y) + ' Q' + x + ' ' + f1(y + w * 0.08) + ' ' + f1(x - w / 2) + ' ' + f1(y) + ' Z" fill="' + wall + '"/>' +
    '<path d="M' + x + ' ' + f1(y - h) + ' H' + f1(x + w / 2) + ' V' + f1(y) + ' Q' + f1(x + w / 4) + ' ' + f1(y + w * 0.06) + ' ' + x + ' ' + f1(y + w * 0.04) + ' Z" fill="' + dk(wall, 0.16) + '"/>' +
    '<path d="M' + f1(x - w * 0.12) + ' ' + f1(y + w * 0.03) + ' V' + f1(y - h * 0.62) + ' Q' + x + ' ' + f1(y - h * 0.82) + ' ' + f1(x + w * 0.12) + ' ' + f1(y - h * 0.62) + ' V' + f1(y + w * 0.03) + ' Z" fill="#3A2212"/>' +
    '<path d="M' + f1(x - w * 0.62) + ' ' + f1(y - h + 1) + ' L' + x + ' ' + f1(y - h - rh) + ' L' + f1(x + w * 0.62) + ' ' + f1(y - h + 1) + ' Q' + x + ' ' + f1(y - h + 3) + ' ' + f1(x - w * 0.62) + ' ' + f1(y - h + 1) + ' Z" fill="#D9B565"/>' +
    '<path d="M' + x + ' ' + f1(y - h - rh) + ' L' + f1(x + w * 0.62) + ' ' + f1(y - h + 1) + ' Q' + f1(x + w * 0.3) + ' ' + f1(y - h + 2.4) + ' ' + f1(x + w * 0.1) + ' ' + f1(y - h + 2.6) + ' Z" fill="#B8924A"/>' +
    thatchLines(x, y - h - rh, w * 1.1, rh) + '<path d="M' + x + ' ' + f1(y - h - rh) + ' l0 -2" stroke="#8A6A2E" stroke-width=".7"/></g>'; };
/** a rumbu granary: a clay pot on stones with a thatch cap */
const rumbu = (x, y, w) => { const h = w * 0.9;
  return '<g><path d="M' + f1(x - w * 0.3) + ' ' + y + ' v' + f1(-w * 0.18) + ' M' + f1(x + w * 0.3) + ' ' + y + ' v' + f1(-w * 0.18) + '" stroke="#7A6A5A" stroke-width="' + f1(w * 0.14) + '"/>' +
    '<path d="M' + f1(x - w * 0.42) + ' ' + f1(y - w * 0.16) + ' Q' + f1(x - w * 0.62) + ' ' + f1(y - h * 0.7) + ' ' + f1(x - w * 0.3) + ' ' + f1(y - h) + ' H' + f1(x + w * 0.3) + ' Q' + f1(x + w * 0.62) + ' ' + f1(y - h * 0.7) + ' ' + f1(x + w * 0.42) + ' ' + f1(y - w * 0.16) + ' Z" fill="#B97848"/>' +
    '<path d="M' + x + ' ' + f1(y - h) + ' H' + f1(x + w * 0.3) + ' Q' + f1(x + w * 0.62) + ' ' + f1(y - h * 0.7) + ' ' + f1(x + w * 0.42) + ' ' + f1(y - w * 0.16) + ' H' + x + ' Z" fill="#9C6036"/>' +
    '<path d="M' + f1(x - w * 0.5) + ' ' + f1(y - h * 0.55) + ' Q' + x + ' ' + f1(y - h * 0.45) + ' ' + f1(x + w * 0.5) + ' ' + f1(y - h * 0.55) + '" stroke="#8A5230" stroke-width=".5" fill="none"/>' +
    '<path d="M' + f1(x - w * 0.5) + ' ' + f1(y - h + 0.6) + ' L' + x + ' ' + f1(y - h - w * 0.62) + ' L' + f1(x + w * 0.5) + ' ' + f1(y - h + 0.6) + ' Z" fill="#D2AC5C"/>' +
    '<path d="M' + x + ' ' + f1(y - h - w * 0.62) + ' L' + f1(x + w * 0.5) + ' ' + f1(y - h + 0.6) + ' L' + f1(x + w * 0.1) + ' ' + f1(y - h + 0.6) + ' Z" fill="#B08C44"/></g>'; };
/** a dum palm: a forked trunk with fan leaves */
const fan = (x, y, r, c) => { let s = '<g transform="translate(' + f1(x) + ' ' + f1(y) + ')">'; for (let a = -160; a <= -20; a += 20) { const rad = a * Math.PI / 180; s += '<path d="M0 0 L' + f1(Math.cos(rad - 0.12) * r) + ' ' + f1(Math.sin(rad - 0.12) * r) + ' L' + f1(Math.cos(rad + 0.12) * r) + ' ' + f1(Math.sin(rad + 0.12) * r) + ' Z" fill="' + (a % 40 ? c : dk(c, 0.15)) + '"/>'; }
  for (let a = 10; a <= 60; a += 25) { const rad = a * Math.PI / 180; s += '<path d="M0 0 L' + f1(Math.cos(rad - 0.12) * r * 0.8) + ' ' + f1(Math.sin(rad - 0.12) * r * 0.8) + ' L' + f1(Math.cos(rad + 0.12) * r * 0.8) + ' ' + f1(Math.sin(rad + 0.12) * r * 0.8) + ' Z" fill="' + dk(c, 0.2) + '"/>'; s += '<path d="M0 0 L' + f1(-Math.cos(rad - 0.12) * r * 0.8) + ' ' + f1(Math.sin(rad - 0.12) * r * 0.8) + ' L' + f1(-Math.cos(rad + 0.12) * r * 0.8) + ' ' + f1(Math.sin(rad + 0.12) * r * 0.8) + ' Z" fill="' + dk(c, 0.2) + '"/>'; }
  return s + '<circle r="' + f1(r * 0.12) + '" fill="#6B4A22"/></g>'; };
const dum = (x, y, s, c = '#6E8E3A') => '<g><path d="M' + x + ' ' + y + ' Q' + f1(x + 1 * s) + ' ' + f1(y - 14 * s) + ' ' + f1(x) + ' ' + f1(y - 22 * s) + ' Q' + f1(x - 3 * s) + ' ' + f1(y - 30 * s) + ' ' + f1(x - 7 * s) + ' ' + f1(y - 36 * s) + ' M' + x + ' ' + f1(y - 22 * s) + ' Q' + f1(x + 4 * s) + ' ' + f1(y - 28 * s) + ' ' + f1(x + 6 * s) + ' ' + f1(y - 40 * s) + '" stroke="#7A6248" stroke-width="' + f1(1.6 * s) + '" fill="none" stroke-linecap="round"/>' +
  fan(x - 7 * s, y - 36 * s, 9 * s, c) + fan(x + 6 * s, y - 40 * s, 10 * s, c) + '<g fill="#8A5A2A"><circle cx="' + f1(x - 6 * s) + '" cy="' + f1(y - 34.6 * s) + '" r="' + f1(1 * s) + '"/><circle cx="' + f1(x + 6.8 * s) + '" cy="' + f1(y - 38.4 * s) + '" r="' + f1(1 * s) + '"/></g></g>';
const neem = (x, y, s) => '<g><path d="M' + f1(x - 1.6 * s) + ' ' + y + ' Q' + f1(x - 1 * s) + ' ' + f1(y - 12 * s) + ' ' + f1(x - 5 * s) + ' ' + f1(y - 20 * s) + ' M' + f1(x + 1.4 * s) + ' ' + y + ' Q' + f1(x + 1.4 * s) + ' ' + f1(y - 12 * s) + ' ' + f1(x + 6 * s) + ' ' + f1(y - 19 * s) + '" stroke="#5E4630" stroke-width="' + f1(2 * s) + '" fill="none"/>' +
  '<g fill="#4F7A35"><ellipse cx="' + f1(x - 6 * s) + '" cy="' + f1(y - 21 * s) + '" rx="' + f1(9 * s) + '" ry="' + f1(5.6 * s) + '"/><ellipse cx="' + f1(x + 6 * s) + '" cy="' + f1(y - 22 * s) + '" rx="' + f1(9 * s) + '" ry="' + f1(6 * s) + '"/><ellipse cx="' + x + '" cy="' + f1(y - 27 * s) + '" rx="' + f1(9 * s) + '" ry="' + f1(5.6 * s) + '"/></g>' +
  '<g fill="#6A9444"><ellipse cx="' + f1(x - 2 * s) + '" cy="' + f1(y - 29 * s) + '" rx="' + f1(5.6 * s) + '" ry="' + f1(3 * s) + '"/><ellipse cx="' + f1(x + 8 * s) + '" cy="' + f1(y - 24.6 * s) + '" rx="' + f1(4.4 * s) + '" ry="' + f1(2.6 * s) + '"/><ellipse cx="' + f1(x - 9 * s) + '" cy="' + f1(y - 23 * s) + '" rx="' + f1(4 * s) + '" ry="' + f1(2.4 * s) + '"/></g></g>';
const zanko = (x0, x1, y, step = 5, c) => { let s = ''; for (let x = x0; x <= x1; x += step) s += 'M' + f1(x) + ' ' + y + ' l.9 -2.8 l.9 2.8 Z '; return '<path d="' + s + '" fill="' + c + '"/>'; };
const cloud = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="#fff" opacity=".85"><ellipse rx="16" ry="3.6"/><ellipse cx="7" cy="-2.4" rx="8" ry="4.4"/><ellipse cx="-6" cy="-1.4" rx="6" ry="3.4"/></g>';
const reeds = (x, y, n, s = 1) => { let p = ''; for (let i = 0; i < n; i++) { const xx = x + i * 2.4 * s, hh = (14 + (i * 7) % 9) * s, lean = ((i % 3) - 1) * 2.4 * s; p += 'M' + f1(xx) + ' ' + y + ' Q' + f1(xx + lean * 0.3) + ' ' + f1(y - hh * 0.6) + ' ' + f1(xx + lean) + ' ' + f1(y - hh) + ' '; }
  let tops = ''; for (let i = 0; i < n; i += 2) { const xx = x + i * 2.4 * s, hh = (14 + (i * 7) % 9) * s, lean = ((i % 3) - 1) * 2.4 * s; tops += '<ellipse cx="' + f1(xx + lean) + '" cy="' + f1(y - hh - 1.4 * s) + '" rx="' + f1(0.7 * s) + '" ry="' + f1(2.4 * s) + '" fill="#7A5A30"/>'; }
  return '<path d="' + p + '" stroke="#5F8A3A" stroke-width="' + f1(0.7 * s) + '" fill="none" stroke-linecap="round"/>' + tops; };

/* animals */
/** an egret (white) or heron (grey) standing, facing left; local feet on y 0 */
const wader = (x, y, s, heron, cls = '') => { const b = heron ? '#8E98A0' : '#FBFBF6', b2 = heron ? '#6C757C' : '#DCDDD6';
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><g class="x-egret ' + cls + '">' +
    '<path d="M0 0 L1 -8 M3 0 L2 -8" stroke="' + (heron ? '#7A6A4A' : '#1A1A1A') + '" stroke-width=".7"/>' +
    '<path d="M-3 -10 Q-1 -15 5 -14 Q9 -12 9 -9 Q5 -7 0 -8 Z" fill="' + b + '"/><path d="M2 -13 Q7 -12 9 -9 Q5 -8 2 -9 Z" fill="' + b2 + '"/>' +
    '<path d="M-2 -12 Q-5 -16 -2 -19 Q0 -21 -1 -23" stroke="' + b + '" stroke-width="1.4" fill="none" stroke-linecap="round"/>' +
    '<circle cx="-1.4" cy="-23.4" r="1.4" fill="' + b + '"/><path d="M-2.4 -23.8 L-7 -23 L-2.4 -22.6 Z" fill="' + (heron ? '#C9A43A' : '#E8B830') + '"/>' +
    (heron ? '<path d="M-1 -24.6 Q2 -25 4 -23.4" stroke="#2A2A2A" stroke-width=".6" fill="none"/><path d="M-2.6 -19 Q-3 -15 -1.6 -13" stroke="#3A3A3A" stroke-width=".5" fill="none" stroke-dasharray=".6 .6"/>' : '') +
    '<circle cx="-1.8" cy="-23.8" r=".35" fill="#1A1A1A"/></g></g>'; };
const bird = (x, y, s, cls) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><g class="x-bird ' + cls + '"><path d="M-4 0 Q-2 -2 0 0 Q2 -2 4 0" stroke="#3A3A44" stroke-width=".7" fill="none" stroke-linecap="round"/></g></g>';
/** a dugout canoe, centre (x, y), length l */
const canoe = (x, y, l, c = '#7A4A26') => '<g><path d="M' + f1(x - l / 2) + ' ' + f1(y - l * 0.08) + ' Q' + f1(x - l * 0.3) + ' ' + f1(y + l * 0.07) + ' ' + x + ' ' + f1(y + l * 0.07) + ' Q' + f1(x + l * 0.3) + ' ' + f1(y + l * 0.07) + ' ' + f1(x + l / 2) + ' ' + f1(y - l * 0.08) + ' Q' + x + ' ' + f1(y - l * 0.01) + ' ' + f1(x - l / 2) + ' ' + f1(y - l * 0.08) + ' Z" fill="' + c + '"/>' +
  '<path d="M' + f1(x - l * 0.46) + ' ' + f1(y - l * 0.055) + ' Q' + x + ' ' + f1(y + l * 0.02) + ' ' + f1(x + l * 0.46) + ' ' + f1(y - l * 0.055) + '" stroke="' + lt(c, 0.3) + '" stroke-width="' + f1(l * 0.012) + '" fill="none"/>' +
  '<path d="M' + f1(x - l * 0.3) + ' ' + f1(y + l * 0.035) + ' Q' + x + ' ' + f1(y + l * 0.06) + ' ' + f1(x + l * 0.3) + ' ' + f1(y + l * 0.035) + '" stroke="' + dk(c, 0.3) + '" stroke-width="' + f1(l * 0.01) + '" fill="none"/></g>';


/* ---------- the crossing's own pieces ---------- */
/** a tiny market figure (far bank), feet at (x, y) */
const tiny = (x, y, c, hc, w, sk = '#6B4022') => '<g transform="translate(' + f1(x) + ' ' + f1(y) + ')">' +
  (w ? '<path d="M-1.8 0 L-1.4 -4.6 L1.4 -4.6 L1.8 0 Z" fill="' + hc + '"/><path d="M-1.3 -4.4 L-1 -7.6 L1 -7.6 L1.3 -4.4 Z" fill="' + c + '"/>'
     : '<path d="M-1.9 0 L-1.3 -7.4 L1.3 -7.4 L1.9 0 Z" fill="' + c + '"/><path d="M-.9 0 v.4 M.9 0 v.4" stroke="#3A2416" stroke-width=".5"/>') +
  '<circle cy="-8.6" r="1.1" fill="' + sk + '"/>' + (w ? '<path d="M-1.2 -9 q1.2 -1.8 2.4 0 Z" fill="' + hc + '"/>' : '<path d="M-1.1 -9.2 q1.1 -1.2 2.2 0 Z" fill="' + hc + '"/>') + '</g>';
/** a market stall: posts and a sloping roof (zinc or a zana mat), goods on a table */
const stall = (x, y, w, zinc, goods) => { const h = 9;
  let g = ''; const n = Math.floor(w / 2.4); for (let i = 0; i < n; i++) g += '<circle cx="' + f1(x + 1.4 + i * 2.4) + '" cy="' + f1(y - 3.4) + '" r="1.1" fill="' + goods[i % goods.length] + '"/>';
  for (let i = 0; i < n - 2; i += 2) g += '<circle cx="' + f1(x + 2.6 + i * 2.4) + '" cy="' + f1(y - 4.8) + '" r="1" fill="' + goods[(i + 1) % goods.length] + '"/>';
  return '<g><path d="M' + f1(x) + ' ' + y + ' V' + f1(y - h) + ' M' + f1(x + w) + ' ' + y + ' V' + f1(y - h + 1.4) + '" stroke="#6B4A22" stroke-width=".7"/>' +
    '<path d="M' + f1(x - 1) + ' ' + f1(y - 2.6) + ' H' + f1(x + w + 1) + ' V' + f1(y - 1.2) + ' H' + f1(x - 1) + ' Z" fill="#8A6038"/>' + g +
    (zinc ? '<path d="M' + f1(x - 2) + ' ' + f1(y - h - 1.6) + ' L' + f1(x + w + 2) + ' ' + f1(y - h + 0.6) + ' L' + f1(x + w + 2) + ' ' + f1(y - h + 2) + ' L' + f1(x - 2) + ' ' + f1(y - h) + ' Z" fill="#A7AFB4"/>' +
      '<path d="' + Array.from({ length: Math.floor(w / 1.6) }, (_, i) => 'M' + f1(x - 1 + i * 1.6) + ' ' + f1(y - h - 1.4 + i * 1.6 * 2.2 / (w + 4)) + ' v1.5').join(' ') + '" stroke="#7E878C" stroke-width=".3"/>'
      : '<path d="M' + f1(x - 2) + ' ' + f1(y - h) + ' Q' + f1(x + w / 2) + ' ' + f1(y - h - 2.6) + ' ' + f1(x + w + 2) + ' ' + f1(y - h) + ' L' + f1(x + w + 1) + ' ' + f1(y - h + 1.4) + ' L' + f1(x - 1) + ' ' + f1(y - h + 1.4) + ' Z" fill="#CDAA62"/><path d="M' + f1(x - 1) + ' ' + f1(y - h + 0.6) + ' H' + f1(x + w + 1) + '" stroke="#A8864A" stroke-width=".3" stroke-dasharray=".8 .6"/>') + '</g>'; };
const umbrella = (x, y, c1, c2) => '<g><path d="M' + x + ' ' + y + ' V' + (y - 10) + '" stroke="#5A4A3A" stroke-width=".5"/><path d="M' + (x - 7) + ' ' + (y - 9) + ' Q' + x + ' ' + (y - 16) + ' ' + (x + 7) + ' ' + (y - 9) + ' Z" fill="' + c1 + '"/>' +
  '<path d="M' + x + ' ' + (y - 12.6) + ' L' + (x - 2.4) + ' ' + (y - 9) + ' L' + (x + 2.4) + ' ' + (y - 9) + ' Z" fill="' + c2 + '"/></g>';
/** a basin of tomatoes and peppers carried on the head (head coordinates, sits on y 0) */
const headBasin = (c, goods) => '<ellipse cx="0" cy="1" rx="8" ry="2" fill="#E8DCC0"/><path d="M-11 0 Q0 2.6 11 0 L17 -11 L-17 -11 Z" fill="' + c + '"/><path d="M2 1.4 Q8 1 11 0 L17 -11 L6 -11 Z" fill="' + dk(c, 0.2) + '"/>' +
  '<g>' + [-12, -7, -2, 3, 8, 13, -9, -4, 1, 6, 11, -5, 0, 5].map((x, i) => '<circle cx="' + x + '" cy="' + (i < 6 ? -12 : i < 11 ? -15.6 : -19) + '" r="3" fill="' + goods[i % goods.length] + '"/>').join('') + '</g>' +
  '<ellipse cx="0" cy="-11" rx="17" ry="2.2" fill="none" stroke="' + lt(c, 0.4) + '" stroke-width="1.4"/><path d="M-9 -4 Q0 -2 9 -4" stroke="' + lt(c, 0.5) + '" stroke-width="1" fill="none"/>';
/** a sack carried on the right shoulder (figure coordinates) */
const sack = '<path d="M28 14 Q30 -2 46 -1 Q60 2 58 14 Q50 24 36 22 Z" fill="#DCCBA0"/><path d="M46 -1 Q60 2 58 14 Q50 24 44 23 Q52 12 46 -1 Z" fill="#C2AE7E"/>' +
  '<path d="M32 8 Q44 4 56 8 M30 14 Q44 10 57 13" stroke="#A8925E" stroke-width=".8" fill="none"/><path d="M26 12 l4 2 l-3 3 Z" fill="#C2AE7E"/>';
/** a bicycle facing left with a sack on its carrier; front axle at (x, y), wheel radius r */
const bicycle = (x, y, r) => { const L = r * 3.1, rx = x + L;
  const wheel = (cx) => '<circle cx="' + f1(cx) + '" cy="' + y + '" r="' + r + '" fill="none" stroke="#2A2A2A" stroke-width="1"/><circle cx="' + f1(cx) + '" cy="' + y + '" r="' + f1(r - 0.7) + '" fill="none" stroke="#9AA0A4" stroke-width=".25"/>' +
    '<path d="' + [0, 30, 60, 90, 120, 150].map((a) => { const t = a * Math.PI / 180; return 'M' + f1(cx - Math.cos(t) * (r - 0.6)) + ' ' + f1(y - Math.sin(t) * (r - 0.6)) + ' L' + f1(cx + Math.cos(t) * (r - 0.6)) + ' ' + f1(y + Math.sin(t) * (r - 0.6)); }).join(' ') + '" stroke="#B8BEC2" stroke-width=".2"/>';
  const bx = x + L * 0.5, by = y;
  return '<g>' + wheel(x) + wheel(rx) +
    '<path d="M' + x + ' ' + y + ' L' + f1(x + 1.4) + ' ' + f1(y - r * 1.5) + ' M' + f1(x + 1) + ' ' + f1(y - r * 1.1) + ' L' + f1(bx) + ' ' + by + ' L' + f1(rx - r * 0.7) + ' ' + f1(y - r * 1.1) + ' Z M' + f1(bx) + ' ' + by + ' L' + rx + ' ' + y + ' L' + f1(rx - r * 0.7) + ' ' + f1(y - r * 1.1) + '" stroke="#1F5FA8" stroke-width=".9" fill="none" stroke-linejoin="round"/>' +
    '<path d="M' + f1(x - 1) + ' ' + f1(y - r * 1.55) + ' h3.6" stroke="#2A2A2A" stroke-width=".9" stroke-linecap="round"/><path d="M' + f1(rx - r * 1.1) + ' ' + f1(y - r * 1.25) + ' h3" stroke="#2A2A2A" stroke-width="1.2" stroke-linecap="round"/>' +
    '<path d="M' + f1(rx - r * 0.4) + ' ' + f1(y - r * 1.05) + ' h' + f1(r * 1.3) + '" stroke="#555" stroke-width=".6"/>' +
    '<path d="M' + f1(rx - r * 0.6) + ' ' + f1(y - r * 1.1) + ' Q' + f1(rx - r * 0.7) + ' ' + f1(y - r * 2.4) + ' ' + f1(rx + r * 0.3) + ' ' + f1(y - r * 2.5) + ' Q' + f1(rx + r * 1.2) + ' ' + f1(y - r * 2.3) + ' ' + f1(rx + r * 1.1) + ' ' + f1(y - r * 1.1) + ' Z" fill="#E6D6A8"/>' +
    '<path d="M' + f1(rx - r * 0.5) + ' ' + f1(y - r * 1.8) + ' Q' + f1(rx + r * 0.3) + ' ' + f1(y - r * 2) + ' ' + f1(rx + r * 1.1) + ' ' + f1(y - r * 1.7) + '" stroke="#B8A26E" stroke-width=".4" fill="none"/>' +
    '<circle cx="' + f1(bx) + '" cy="' + by + '" r=".9" fill="#555"/></g>'; };
/** a long-legged Sahel goat facing left, feet on y: drooping ears, a beard, horns swept back, a patch on its side */
const goat = (x, y, s, c = '#F2EEE6', c2 = '#5A3A22') => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><ellipse cx="8" cy=".3" rx="10" ry="1.1" fill="rgba(40,24,10,.3)"/><g class="x-goat">' +
  '<path d="M3.6 -7 L3.4 0 h1 L4.9 -7 Z M11.8 -7 L12.3 0 h1 L13.5 -7 Z" fill="' + dk(c, 0.38) + '"/>' +
  '<path d="M2 -7.6 Q1 -10.4 0 -12.4 L-2.6 -15.6 Q-4.6 -15 -5 -15.8 Q-5.4 -17.2 -4.6 -18 L-2.4 -19.6 Q-.8 -20.2 .2 -19 Q1.4 -16 3.4 -13.6 Q8 -13.8 13 -13.4 Q15.6 -13.2 16 -11 Q16.2 -8 14.6 -7 Q8 -6 2 -7.6 Z" fill="' + c + '"/>' +
  '<path d="M7 -13.6 Q11 -13.2 12 -10.2 Q10 -8.2 7 -9.2 Z" fill="' + c2 + '"/><path d="M2 -7.6 Q8 -6 14.6 -7 Q15.6 -8.6 15.8 -10 Q10 -8.4 3 -9.6 Z M-2.6 -15.6 L0 -12.4 Q-1.4 -13.4 -2.6 -15.6 Z" fill="#1a0e06" opacity=".18"/>' +
  '<path d="M2 -8.4 L2.2 -3 L1.8 0 h1.2 L3.7 -3 L4.1 -8.4 Z M13 -8.4 Q14.4 -5 13.6 -3 L13.4 0 h1.2 L15 -3 Q15.7 -6 15 -8.4 Z" fill="' + dk(c, 0.12) + '"/>' +
  '<path d="M15.8 -12.6 l1.4 -2.4" stroke="' + c + '" stroke-width="1.1" stroke-linecap="round"/>' +
  '<path d="M-.6 -18.6 Q1.8 -18.4 2.6 -15.6 Q.6 -16.4 -.9 -17.6 Z" fill="' + dk(c, 0.22) + '"/>' +
  '<path d="M-1.2 -19.8 Q0 -22.6 2.8 -22.2" stroke="#8A7A62" stroke-width=".9" fill="none" stroke-linecap="round"/><path d="M-4.2 -15.4 q-.3 1.8 .3 2.8" stroke="' + dk(c, 0.3) + '" stroke-width=".6" fill="none"/>' +
  '<circle cx="-2.5" cy="-18.2" r=".45" fill="#1A0E06"/></g></g>';
export function jirgiScene(): string {
  // the far bank: the town and its market at the landing
  const town = '<path d="M0 74 Q80 70 160 73 T320 72 V102 H0 Z" fill="' + u('bank') + '"/>' +
    '<g fill="#B9A27A" opacity=".7"><path d="M0 74 V66 H18 V74 Z M86 74 V64 H112 V74 Z M196 74 V65 H220 V74 Z M262 74 V63 H290 V74 Z"/></g>' +
    // the minaret and the mosque
    '<g><path d="M56 82 L58.6 40 Q62 36 65.4 40 L68 82 Z" fill="#E6D6B6"/><path d="M62 37.6 Q65.4 38 65.4 40 L68 82 L62 82 Z" fill="#CDB994"/><path d="M59 48 h6 M58.6 58 h6.8 M58 68 h8" stroke="#2E7D32" stroke-width="1"/>' +
    '<path d="M59.4 40 L62 30 L64.6 40 Z" fill="#2E7D32"/><path d="M62 30 v-3" stroke="#6B5A3A" stroke-width=".5"/><path d="M61 25.6 a1.2 1.2 0 1 0 1.6 1.6 a1 1 0 1 1 -1.6 -1.6 Z" fill="#C9A227"/>' +
    '<path d="M42 84 V70 H84 V84 Z" fill="#EADCC0"/><path d="M64 84 V70 H84 V84 Z" fill="#D6C6A4"/><path d="M58 70 Q63 62 68 70 Z" fill="#2E7D32"/><path d="M60 84 v-7 a3 3 0 0 1 6 0 v7 Z" fill="#4A3A26"/></g>' +
    // red-earth houses with zanko horns and zinc roofs
    '<path d="M0 86 V74 H30 V86 Z" fill="#C27A46"/>' + zanko(0, 28, 74, 4.4, '#C27A46') + '<path d="M16 86 V74 H30 V86 Z" fill="#AA6538"/><path d="M10 86 v-6 h4 v6 Z" fill="#4A2A14"/>' +
    '<path d="M86 86 V76 H112 V86 Z" fill="#C98A55"/><path d="M84 77 L114 74 L114 76.4 L84 79 Z" fill="#9EA6AB"/>' +
    '<path d="M204 86 V75 H232 V86 Z" fill="#C27A46"/>' + zanko(204, 230, 75, 4.4, '#C27A46') + '<path d="M218 86 V75 H232 V86 Z" fill="#AA6538"/>' +
    '<path d="M276 86 V74 H306 V86 Z" fill="#C98A55"/><path d="M274 75 L308 72 L308 74.4 L274 77.4 Z" fill="#9EA6AB"/><path d="M286 86 v-6 h4 v6 Z" fill="#4A2A14"/>' +
    dum(36, 88, 0.85) + dum(30, 89, 0.65, '#7A9A44') + neem(250, 86, 1.3) + neem(318, 87, 1.1) + dum(196, 87, 0.75) +
    // the market under its roofs and umbrellas
    stall(92, 94, 14, true, ['#E53935', '#43A047', '#FB8C00']) + stall(110, 95, 12, false, ['#FFD54A', '#8D6E63', '#E53935']) + umbrella(128, 96, '#E53935', '#FFD54A') +
    stall(206, 94, 13, false, ['#43A047', '#FB8C00', '#D7CCC8']) + stall(224, 95, 14, true, ['#C62828', '#FFB300', '#6D4C41']) + umbrella(244, 96, '#1E88E5', '#fff') + stall(258, 95, 12, true, ['#FB8C00', '#E53935', '#FFF3C4']) +
    stall(278, 94, 14, false, ['#7CB342', '#F4511E', '#FFD54A']) +
    tiny(88, 98, '#2F6B9A', '#FFD54A', 1) + tiny(98, 99, '#F4EBD0', '#C62828', 0, '#5E3A1C') + tiny(105, 98.6, '#AD1457', '#AD1457', 1, '#8B5A2B') + tiny(121, 99, '#00897B', '#F4EBD0', 1) + tiny(134, 99.4, '#F4EBD0', '#F4EBD0', 0, '#4F2F17') +
    tiny(203, 99, '#6A4C93', '#FFB300', 1, '#7A4A26') + tiny(214, 98.6, '#C9A46A', '#3A2A22', 0) + tiny(240, 99.4, '#EF6C00', '#EF6C00', 1, '#5E3A1C') + tiny(252, 98.8, '#F4EBD0', '#2E7D32', 0, '#8B5A2B') +
    tiny(270, 99.2, '#C62828', '#FFD54A', 1) + tiny(292, 99, '#3E6E8E', '#F4EBD0', 0, '#4F2F17') + tiny(305, 98.6, '#2E7D32', '#2E7D32', 1, '#7A4A26') +
    // the landing: canoes pulled up on the sand, a man unloading, a donkey
    '<path d="M136 101 Q170 96 200 101 Z" fill="#E6CD95"/>' + canoe(152, 99.4, 22, '#6B3E1E') + canoe(176, 100.4, 20, '#7E4A24') + canoe(188, 98.4, 16, '#5E3A1C') +
    tiny(164, 99.6, '#F4EBD0', '#C62828', 0, '#5E3A1C') + '<path d="M162.4 90.2 q2 -1.6 4 0 l-.4 1.6 h-3.2 Z" fill="#DCCBA0"/>' +
    '<g transform="translate(140 99.4)"><path d="M0 0 v-3 M1.6 0 v-3 M5 0 v-3 M6.4 0 v-3" stroke="#6E6258" stroke-width=".7"/><path d="M-.6 -2.6 Q-.6 -5.6 3 -5.6 Q7.6 -5.6 7.4 -2.8 Z" fill="#8E8278"/><path d="M-.4 -4.6 L-2.6 -6.6 L-3 -5.2 L-1 -3 Z" fill="#8E8278"/><path d="M-2.6 -6.6 l-.2 -1.8 M-2 -6.4 l.6 -1.6" stroke="#8E8278" stroke-width=".5"/><path d="M1.4 -5.8 h3.6 v2 h-3.6 Z" fill="#C62828"/></g>';
  // the waiting passengers on the near bank, the shade tree and its tea seller
  const nearR = '<path d="M320 138 Q282 144 252 158 Q226 172 212 200 L210 212 H320 Z" fill="' + u('sand') + '"/><path d="M320 138 Q282 144 252 158 Q226 172 212 200 L210 212 H320 Z" fill="' + u('grit') + '"/>' +
    '<path d="M320 138 Q282 144 252 158 Q226 172 212 200 L219 200 Q232 176 256 162.4 Q284 148 320 143 Z" fill="#8A6A3E" opacity=".28"/><path d="M320 138 Q282 144 252 158 Q226 172 212 200" stroke="#F2E2B8" stroke-width="1.2" fill="none" opacity=".8"/>' +
    '<ellipse cx="292" cy="170" rx="34" ry="6" fill="rgba(60,40,10,.18)"/>' +
    // the shade tree
    '<g><path d="M296 170 Q298 140 292 110 Q288 96 280 84 M297 140 Q306 116 314 96 M293 116 Q300 100 304 84" stroke="#5E4630" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M298 170 Q300 140 294 110" stroke="#4A3624" stroke-width="2" fill="none"/>' +
    '<path d="M246 80 Q244 70 256 68 Q258 58 272 60 Q278 50 292 54 Q302 46 314 54 Q328 52 332 62 Q342 66 338 78 Q340 90 326 92 Q316 98 302 92 Q292 98 280 94 Q266 98 258 90 Q246 90 246 80 Z" fill="#3F6B2E"/>' +
    '<path d="M250 76 Q250 68 260 68 Q262 60 274 62 Q280 53 292 57 Q302 50 312 56 Q322 55 326 62 Q316 64 306 62 Q296 66 286 64 Q276 70 266 70 Q256 74 250 76 Z" fill="#52833A"/>' +
    '<path d="M246 80 Q244 70 256 68 Q258 58 272 60 Q278 50 292 54 Q302 46 314 54 Q328 52 332 62 Q342 66 338 78 Q340 90 326 92 Q316 98 302 92 Q292 98 280 94 Q266 98 258 90 Q246 90 246 80 Z" fill="' + u('leaf') + '"/>' +
    '<path d="M262 66 q4 -4 10 -3 q-5 1 -10 3 Z M282 58 q6 -4 13 -2 q-7 0 -13 2 Z M302 54 q5 -2 9 1 q-5 -1 -9 -1 Z M256 86 q6 3 12 2 M292 92 q8 2 14 -1" fill="#6A9C46" stroke="#2F5422" stroke-width=".6" stroke-opacity=".5"/></g>' +
    // the tea seller behind his little table: kettle, glasses, the charcoal stove
    person(304, 166, 25, { kind: 'man', skin: 1, robe: '#F4EBD0', trim: '#8A6A3E', hat: 'borno', hatc: '#7A1F2B', hatc2: '#F2C230', hatc3: '#1F2E5A', al: 'clap', ar: 'clap', alc: 'x-cl', arc: 'x-cl', beard: 'w' }) +
    '<g><path d="M292 160 h20 v1.6 h-20 Z" fill="#8A5A2E"/><path d="M294 161.6 v7 M310 161.6 v7" stroke="#6B4422" stroke-width="1.1"/>' +
    '<g fill="#F2E6B8" opacity=".9"><path d="M296 160 h1.6 l-.2 -2.6 h-1.2 Z M299 160 h1.6 l-.2 -2.6 h-1.2 Z"/></g><g fill="#B5541E"><rect x="296.2" y="158.6" width="1.2" height="1.4"/><rect x="299.2" y="158.6" width="1.2" height="1.4"/></g>' +
    '<path d="M303 160 Q302 155 305.6 155 Q309 155 308.4 160 Z" fill="#2E7D32"/><path d="M308.4 157 l2.6 -2" stroke="#2E7D32" stroke-width=".9"/><path d="M304.4 155 q1.2 -1.4 2.4 0" stroke="#1F5A22" stroke-width=".7" fill="none"/></g>' +
    '<g><path d="M311 169 l2 -5 h6 l2 5 Z" fill="#4A4A4A"/><ellipse cx="316" cy="164" rx="3.4" ry="1" fill="#E8661E"/><path d="M314.6 163 Q315 159 317 156 Q317 160 318 163" stroke="#B0B6BA" stroke-width=".5" fill="none" opacity=".7"/></g>' +
    // the passengers waiting with their loads
    person(238, 180, 24, { kind: 'boy', skin: 3, robe: '#2E7D32', trou: '#E8DFC8', hat: 'hula', hatc: '#F4EBD0', hatc2: '#2E7D32', al: 'fwd', ar: 'down', arc: 'x-wv', cls: 'p1' }) +
    person(250, 179, 34, { kind: 'woman', skin: 0, robe: '#C2185B', wrap: '#FFB300', wrap2: '#6A1B9A', hat: 'kallabi', hatc: '#FFB300', hatc2: '#C2185B', al: 'load', ar: 'down', arc: 'x-wv', load: headBasin('#1E88E5', ['#E53935', '#C62828', '#43A047', '#FB8C00']), cls: 'p2' }) +
    person(272, 177, 34, { kind: 'man', skin: 5, robe: '#E8E1CF', robe2: '#D4CBB4', trim: '#3E6E8E', hat: 'zanna', hatc: '#1F2E5A', hatc2: '#E9E2CF', al: 'clap', ar: 'clap', alc: 'x-cl', arc: 'x-cl', cls: 'p3' }) +
    goat(226, 184, 0.62, '#F2EEE6', '#5A3A22') + '<path d="M233.4 169.4 Q231.4 176.4 225 175.2" stroke="#A8864A" stroke-width=".5" fill="none"/>' +
    bicycle(283, 172, 5.2) +
    person(259, 188, 32, { kind: 'man', skin: 2, robe: '#4E6E3A', trou: '#D8CFB8', hat: 'turban', hatc: '#F4EBD0', al: 'down', ar: 'load', alc: 'x-wv', front: sack, cls: 'p4' });
  // the near-left sand under the game's jetty
  const nearL = '<path d="M0 166 Q40 164 80 172 Q104 178 116 200 L118 212 H0 Z" fill="' + u('sand') + '"/><path d="M0 166 Q40 164 80 172 Q104 178 116 200 L118 212 H0 Z" fill="' + u('grit') + '"/>' +
    '<path d="M0 166 Q40 164 80 172 Q104 178 116 200 L109 200 Q98 182 76 176 Q40 169 0 170.6 Z" fill="#8A6A3E" opacity=".28"/>' + reeds(4, 170, 6, 1.1) + reeds(98, 188, 4, 1);
  return '<svg class="scene ' + P + '" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>' +
    lg('sky', ['#86C8EA', '#B8DFEE', '#EEF1DE', '#F6E6C2']) + lg('bank', ['#B8A46C', '#A39A5E', '#D2BC86']) + lg('sand', ['#E8D29A', '#D8B87A', '#C9A266']) +
    lg('water', ['#8CCBE0', '#4FA9D6', '#2F86BA', '#1F6A9A'], 100, 200, true) +
    '<pattern id="' + P + '-grit" width="23" height="13" patternUnits="userSpaceOnUse"><path d="M2 2.2 h.5 v.4 h-.5 Z M13.6 1 h.4 v.5 h-.4 Z M8 6.4 h.6 v.4 h-.6 Z M19 8.6 h.4 v.4 h-.4 Z M4.6 11 h.5 v.4 h-.5 Z M15 11.6 h.6 v.3 h-.6 Z M1 7.6 q2.6 -.9 5.2 0 M11 4 q3 -1 6 .1 M14.4 9.6 q2.4 -.8 4.6 .2" fill="#6E5028" fill-opacity=".4" stroke="#FFF4D8" stroke-opacity=".28" stroke-width=".3"/></pattern>' +
    '<pattern id="' + P + '-leaf" width="9" height="6" patternUnits="userSpaceOnUse"><path d="M1 3 q1.5 -2.2 3 0 M5 5.6 q1.5 -2.2 3 0 M5.4 1.8 q1.1 -1.6 2.2 0" stroke="#24401A" stroke-width=".5" fill="none" opacity=".55"/></pattern>' +
    '</defs><rect width="320" height="200" fill="' + u('sky') + '"/>' +
    cloud(40, 34, 0.9) + cloud(170, 26, 0.7) + cloud(236, 44, 0.6) +
    town +
    '<path d="M0 101 Q80 99 160 101 T320 101 V200 H0 Z" fill="' + u('water') + '"/><path d="M0 101 Q80 99 160 101 T320 101 V106 Q240 104 160 106 T0 106 Z" fill="#B8DDE8" opacity=".55"/>' +
    '<g opacity=".18" fill="#6B3E1E"><path d="M142 102 h22 l-2 1.4 h-18 Z M166 102.4 h20 l-2 1.2 h-16 Z"/></g>' +
    '<g stroke="#D4EDF6" stroke-width=".6" fill="none" opacity=".65" stroke-linecap="round"><path d="M136 114 q5 -1.6 10 0 M200 110 q5 -1.6 10 0 M150 160 q5 -1.6 10 0 M176 172 q5 -1.6 10 0 M120 128 q5 -1.6 10 0 M290 120 q5 -1.6 10 0 M196 186 q5 -1.6 10 0 M10 140 q5 -1.6 10 0 M60 152 q5 -1.6 10 0"/></g>' +
    '<g class="x-ripple"><path d="M180 124 q6 -1.8 12 0 M232 150 q6 -1.8 12 0 M128 146 q6 -1.8 12 0" stroke="#E6F5FA" stroke-width=".7" fill="none" stroke-linecap="round"/></g>' +
    wader(222, 104.6, 0.32, false, 'e1') + wader(232, 105, 0.3, false, 'e2') +
    // birds over the water
    bird(118, 46, 1.1, 'b1') + bird(130, 40, 0.9, 'b2') + bird(142, 50, 0.8, 'b3') + bird(200, 58, 0.9, 'b4') +
    // a passenger engine boat crossing near the far bank (the same kind of boat as the game's)
    '<g class="x-ferry"><svg x="8" y="88" width="50" height="19.6" viewBox="0 0 420 165" overflow="visible">' + boatBody({ crowd: true }) + '</svg></g>' +
    nearL + nearR + '</svg>';
}

/* ---------- the game's own pieces (Sani 2026-10-26): a local engine passenger boat, the people waiting on the jetty,
   and the boat's sounds ---------- */
/** the hull of the long wooden boat: the gunwale sweeps up to a high prow at the left (bow), the keel runs flat to the
    stern at the right. t = 0 at the gunwale, 1 at the keel; x in the boat's 420 x 165 box */
const XB = 12, XS = 346;
const gun = (x) => { const v = (x - XB) / (XS - XB); return 80 - 30 * Math.pow(1 - v, 3) - 6 * Math.pow(v, 4); };
const keel = (x) => { const v = (x - XB) / (XS - XB); return 140 - 90 * Math.pow(1 - v, 6); };
const band = (t0, t1) => { const xs = []; for (let x = XB; x <= XS; x += 6) xs.push(x); if (xs[xs.length - 1] !== XS) xs.push(XS);
  const y = (x, t) => gun(x) + t * (keel(x) - gun(x));
  return 'M' + xs.map((x) => f1(x) + ' ' + f1(y(x, t0))).join(' L') + ' L' + xs.slice().reverse().map((x) => f1(x) + ' ' + f1(y(x, t1))).join(' L') + ' Z'; };
/* the far side of the boat seen over the near gunwale: its inside, dark, and its own rail a little higher */
const inner = (edge) => { const xs = []; for (let x = 30; x <= XS; x += 8) xs.push(x); xs.push(XS); const far = (x) => gun(x) - 7 * Math.min(1, (x - 24) / 40);
  return 'M' + xs.map((x) => f1(x) + ' ' + f1(far(x))).join(' L') + (edge ? '' : ' L' + xs.slice().reverse().map((x) => f1(x) + ' ' + f1(gun(x) + 1)).join(' L') + ' Z'); };
const seam = (t) => { let s = ''; for (let x = XB + 4; x <= XS; x += 6) s += (s ? ' L' : 'M') + f1(x) + ' ' + f1(gun(x) + t * (keel(x) - gun(x))); return s; };
/** the people in the boat: who waits on the jetty (k) and the same person sitting in the boat once they board */
const WAIT = [
  { kind: 'woman', skin: 1, robe: '#8E24AA', wrap: '#4A148C', wrap2: '#FFD54A', hat: 'hijab', hatc: '#6A1B9A' },
  { kind: 'man', skin: 0, robe: '#00838F', trou: '#E8DFC8', trim: '#F4EBD0', hat: 'hula', hatc: '#F6F2E8', hatc2: '#7A1F2B' },
  { kind: 'woman', skin: 2, robe: '#F57C00', wrap: '#2E7D32', wrap2: '#FFF3C4', hat: 'kallabi', hatc: '#EF6C00', hatc2: '#2E7D32' },
  { kind: 'man', skin: 3, robe: '#F4EBD0', robe2: '#D9CBA6', trim: '#8A6A3E', hat: 'turban', hatc: '#FFFFFF', beard: 'd' },
  { kind: 'man', skin: 5, robe: '#455A64', trou: '#CFD8DC', trim: '#F4EBD0', hat: 'zanna', hatc: '#7A1F2B', hatc2: '#E9C46A' },
];
/* a sad face that shows only on .x-sad: brows that slope down and a tear on each cheek */
const SADFACE = '<g class="x-sadf" opacity="0"><path d="M23 20 q2.6 -.4 4.8 1.4 M37 20 q-2.6 -.4 -4.8 1.4" stroke="#1A0E06" stroke-width="1" fill="none" stroke-linecap="round"/>' +
  '<path class="x-tear" d="M25.4 26.6 q-1.5 2.8 0 3.8 q1.5 -1 0 -3.8 Z M34.6 26.6 q-1.5 2.8 0 3.8 q1.5 -1 0 -3.8 Z" fill="#8FD3F4" stroke="#4FA9D6" stroke-width=".3"/></g>';
const waitO = (k) => Object.assign({}, WAIT[k % WAIT.length], { face: SADFACE });
/** one person waiting on the jetty for the boat, standing, feet at the bottom of the box */
export function waiter(k: number): string {
  return '<svg class="jr4w" viewBox="-6 -14 72 150" overflow="visible" aria-hidden="true">' + person(30, 134, 140, Object.assign(waitO(k), { cls: 'w-fig' })) + '</svg>';
}
/** the boat itself in its 420 x 165 box, bow at the left; o.board = the word, o.pax = the passenger index who boards,
    o.crowd = a few seated passengers (the scene's far boat) */
function boatBody(o) {
  const rail = '#5A3418';
  // under the canopy: its posts, the driver at the stern, the passenger who boards (hidden until .boarded)
  let s = '<ellipse cx="200" cy="150" rx="196" ry="9" fill="rgba(10,40,70,.28)"/>' +
    '<g stroke="#6B4422" stroke-width="3.2" stroke-linecap="round"><path d="M104 70 V30 M212 76 V24 M300 78 V26"/></g>' +
    '<path d="' + inner() + '" fill="#4A2E18"/><path d="' + inner(true) + '" stroke="#7A4A26" stroke-width="2" fill="none"/>';
  if (o.crowd) s += [[132, 1, '#C62828'], [168, 3, '#1E88E5'], [196, 0, '#F4EBD0'], [236, 2, '#2E7D32'], [266, 4, '#FFB300']].map(([x, k, c], i) =>
    person(x, gun(x) + 34, 68, { kind: i % 2 ? 'man' : 'woman', skin: k, robe: c, hat: i % 2 ? (i === 1 ? 'borno' : 'hula') : 'hijab', hatc: i % 2 ? '#F4EBD0' : c, wrap: '#2F6B9A' })).join('');
  if (o.pax != null) s += '<g class="eb-pax">' + person(118, gun(118) + 34, 68, Object.assign(waitO(o.pax), { al: 'down', ar: 'down', arc: 'x-wv' })) + '</g>';
  s += '<g class="eb-drv">' + person(322, gun(322) + 30, 64, { kind: 'man', skin: 4, robe: '#5D6B7A', trou: '#5D6B7A', hat: 'turban', hatc: '#EDE6D6', ar: 'fwd', al: 'down', beard: 'd' }) + '</g>';
  // the hull: painted planks, tarred below, a dark rail along the top, the transom at the stern
  s += '<path d="' + band(0, 1) + '" fill="#3A2A1E"/>' +
    '<path d="' + band(0, 0.13) + '" fill="' + rail + '"/><path d="' + band(0.13, 0.3) + '" fill="#F2C230"/><path d="' + band(0.3, 0.37) + '" fill="#C62828"/>' +
    '<path d="' + band(0.37, 0.78) + '" fill="#1F7A8C"/><path d="' + band(0.78, 0.84) + '" fill="#F4EBD0"/>' +
    '<path d="' + seam(0.22) + ' M' + seam(0.55).slice(1) + ' M' + seam(0.92).slice(1) + '" stroke="rgba(0,0,0,.22)" stroke-width="1" fill="none"/>' +
    '<path d="' + seam(0.02) + '" stroke="#A8743E" stroke-width="2" fill="none" stroke-linecap="round"/>' +
    '<path d="M' + XS + ' ' + f1(gun(XS)) + ' L' + (XS + 4) + ' ' + f1(gun(XS) + 1) + ' L' + (XS + 3) + ' 140 L' + XS + ' 140 Z" fill="' + rail + '"/>' +
    // ribs of the hull showing as nail lines, and the eye painted at the prow
    '<g stroke="rgba(0,0,0,.18)" stroke-width="1">' + [60, 100, 140, 330].map((x) => '<path d="M' + x + ' ' + f1(gun(x) + 4) + ' V' + f1(keel(x) - 4) + '"/>').join('') + '</g>' +
    '<circle cx="34" cy="' + f1(gun(34) + 12) + '" r="4.2" fill="#F4EBD0"/><circle cx="33" cy="' + f1(gun(34) + 12) + '" r="2" fill="#1A0E06"/>';
  if (o.board != null) s += '<g class="eb-board"><rect x="124" y="84" width="196" height="46" rx="5" fill="#FFF6DF" stroke="#6B3E1E" stroke-width="3"/>' +
    '<rect x="128" y="88" width="188" height="38" rx="3" fill="none" stroke="#E2C99A" stroke-width="1"/>' +
    '<g fill="#8A6A3E"><circle cx="131" cy="91" r="1.6"/><circle cx="313" cy="91" r="1.6"/><circle cx="131" cy="123" r="1.6"/><circle cx="313" cy="123" r="1.6"/></g>' +
    '<text x="222" y="121" text-anchor="middle" font-size="38" font-weight="900" letter-spacing="7" fill="#2A1A0C" style="font-family:var(--disp,sans-serif)">' + o.board + '</text></g>';
  // the boarding plank from the end of the jetty (below the boat, nearer to us) up to the gunwale; shown while moored
  if (o.pax != null) s += '<g class="eb-plank"><path d="M58 202 L86 202 L110 ' + f1(gun(104) + 1) + ' L98 ' + f1(gun(104) + 1) + ' Z" fill="#A8743E" stroke="#5E3A1C" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M64 186 h20 M70 166 h17 M76 146 h15 M82 126 h13 M88 106 h11 M93 88 h10" stroke="#6B4422" stroke-width="2.2" stroke-linecap="round"/></g>';
  // the canopy: a tarpaulin roof on its posts, a fringe along the edge
  s += '<path d="M90 32 Q200 12 316 24 L316 31 Q200 20 90 39 Z" fill="#2C7BB6"/><path d="M90 32 Q200 12 316 24" stroke="#7FB8E0" stroke-width="2" fill="none"/>' +
    '<path d="M90 39 Q200 20 316 31" stroke="#FFD54A" stroke-width="2.4" fill="none" stroke-dasharray="5 4"/>' +
    // the outboard engine on the transom: bracket, cowling, the leg going down into the water, the tiller to the driver
    '<g class="eb-eng"><path d="M346 84 h7 v10 h-7 Z" fill="#4A4A4A"/>' +
    '<path d="M362 102 L372 102 L370 138 L363 138 Z" fill="#3A3E42"/><path d="M359 128 h16 v3 h-16 Z" fill="#4A4E52"/>' +
    '<path d="M352 76 Q351 64 362 63 L374 63 Q382 64 381 74 L379 98 Q378 104 371 104 L360 104 Q353 103 353 96 Z" fill="#2B2F33"/>' +
    '<path d="M355 70 Q357 65 363 65 L373 65 Q378 65 379 70" stroke="#7A838A" stroke-width="2" fill="none" stroke-linecap="round"/>' +
    '<path d="M353 86 L380 86" stroke="#C62828" stroke-width="2.2"/><path d="M372 70 Q376 80 375 98" stroke="rgba(255,255,255,.12)" stroke-width="3" fill="none"/>' +
    '<path d="M353 82 L335 79" stroke="#1E1E1E" stroke-width="3" stroke-linecap="round"/></g>';
  // the water at the hull: a lip of river over the keel, foam along it, the wake and spray behind the engine
  s += '<path d="M8 140 Q30 137 60 139 Q200 137 350 140 Q362 141 360 146 Q200 150 40 148 Q6 146 8 140 Z" fill="#4FA9D6" opacity=".6"/>' +
    '<path d="M16 139 Q120 142 230 141 T344 141" stroke="#F4FBFF" stroke-width="2" fill="none" opacity=".85" stroke-linecap="round"/>' +
    '<g class="eb-wake"><path d="M356 140 Q372 133 392 137 Q408 140 418 145 Q400 143 386 146 Q368 148 356 144 Z" fill="#F4FBFF" opacity=".85"/>' +
    '<path d="M368 150 q12 -3 24 0 M394 147 q10 -2 20 1 M380 133 q10 -3 18 0" stroke="#F4FBFF" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".9"/>' +
    '<g fill="#F4FBFF"><circle cx="384" cy="128" r="2"/><circle cx="394" cy="123" r="1.5"/><circle cx="402" cy="131" r="1.7"/><circle cx="376" cy="124" r="1.2"/><circle cx="410" cy="137" r="1.3"/></g></g>' +
    '<g class="eb-spray" fill="#F4FBFF" opacity=".85"><path d="M14 139 q-8 -3 -13 1 q7 2 13 -1 Z"/><circle cx="4" cy="133" r="1.3"/><circle cx="9" cy="129" r=".9"/></g>';
  return s;
}
/** the word's boat for the game: the word on a board along its side */
export function engineBoat(word: string, pax: number): string {
  return '<svg class="eb ' + P + 'b" viewBox="0 0 420 165" overflow="visible" aria-hidden="true">' + boatBody({ board: word, pax }) + '</svg>';
}

/* ---------- sounds: gentle and short, synthesised (the same pattern as engine.ts) ---------- */
let jac = null;
const audio = () => { try { jac = jac || new (window.AudioContext || (window as any).webkitAudioContext)(); return jac; } catch (e) { return null; } };
/** the engine's putt-putt: soft low thuds, swelling and fading over `sec` seconds */
export function puttPutt(sec = 1.8): void {
  const a = audio(); if (!a) return;
  const lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 340; lp.connect(a.destination);
  const n = Math.round(sec / 0.115), t0 = a.currentTime + 0.02;
  for (let i = 0; i < n; i++) {
    const t = t0 + i * 0.115, env = Math.sin(Math.PI * (i + 0.5) / n), o = a.createOscillator(), g = a.createGain();
    o.type = 'triangle'; o.frequency.setValueAtTime(68 + (i % 2) * 6, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.08);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.0001 + 0.09 * env, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    o.connect(g).connect(lp); o.start(t); o.stop(t + 0.1);
  }
}
/** the boat's horn: two bright friendly toots (right answer) */
export function toot(): void {
  const a = audio(); if (!a) return;
  [[392, 0, 0.16], [523, 0.22, 0.3]].forEach(([f, d, len]) => { const t = a.currentTime + 0.02 + d;
    [1, 1.005].forEach((m) => { const o = a.createOscillator(), g = a.createGain(), lp = a.createBiquadFilter();
      o.type = 'sawtooth'; o.frequency.setValueAtTime(f * m, t); lp.type = 'lowpass'; lp.frequency.value = 1400;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.045, t + 0.03); g.gain.setValueAtTime(0.045, t + len - 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      o.connect(lp).connect(g).connect(a.destination); o.start(t); o.stop(t + len + 0.05); }); });
}
/** a gentle sad fall: three soft tones going down (wrong answer) */
export function sadTones(): void {
  const a = audio(); if (!a) return;
  [[392, 0], [349, 0.3], [294, 0.6]].forEach(([f, d], i) => { const t = a.currentTime + 0.02 + d, len = i === 2 ? 0.7 : 0.3, o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(f, t); o.frequency.linearRampToValueAtTime(f * 0.97, t + len);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.08, t + 0.04); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + len + 0.05); });
}
