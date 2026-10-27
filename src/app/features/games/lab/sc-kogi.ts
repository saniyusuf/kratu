// @ts-nocheck
import { arewaCap } from './capsArewa';
/*
 * Kwale-kwale (the canoes): a wide northern river at morning, like the Sokoto or the Hadejia.
 * The far bank: a village of round thatched huts and rumbu granaries, a red-earth wall, a minaret, dum palms, a neem,
 * fishing nets drying on poles. At the shallows Zebu cattle drink with egrets about them and a Fulani boy with his staff.
 * Out on the water a fisherman casts his net from a small canoe. The near bank (left): women washing clothes in a basin
 * and spreading them on the rocks. The near shallows (right): children splashing, a grey heron, reeds.
 * The river fills y 108–200 (of 200) so the game's word canoes sit on water; the picture card hangs over the top middle.
 *
 * Classes for sc-kogi.css (transform and opacity only):
 *   .x-fig   a whole person (hop)        .x-head  head (shake)       .x-al / .x-ar  arms (turn at the shoulder)
 *   .x-wv    an arm that waves on cheer  .x-ms / .x-mf  smile / frown
 *   idle loops: .x-scrub .x-boat .x-net .x-splash .x-cow .x-egret .x-bird .x-glint .x-mist .x-kid
 */
const P = 'kg4';
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
  const ld = o.load ? '<g transform="translate(30 3)">' + o.load + '</g>' : '';
  return '<g class="x-head" style="transform-origin:30px 37px">' + back +
    '<path d="M26 32 h8 v10 h-8 Z" fill="' + dk(sk, 0.1) + '"/>' +
    '<circle cx="19.3" cy="26" r="2.3" fill="' + sk + '"/><circle cx="40.7" cy="26" r="2.3" fill="' + sk + '"/>' +
    '<circle cx="30" cy="' + cy + '" r="10.8" fill="' + sk + '"/><circle cx="30" cy="' + cy + '" r="10.8" fill="' + u('sh') + '"/>' +
    '<g fill="#1A0E06"><ellipse cx="25.8" cy="24.2" rx="1.35" ry="1.7"/><ellipse cx="34.2" cy="24.2" rx="1.35" ry="1.7"/></g><g fill="#fff"><circle cx="26.2" cy="23.5" r=".45"/><circle cx="34.6" cy="23.5" r=".45"/></g>' +
    '<path d="M23.4 20.8 q2.4 -1.3 4.6 -.1 M32 20.7 q2.2 -1.2 4.6 .1" stroke="#1A0E06" stroke-width=".9" fill="none" stroke-linecap="round"/>' +
    '<path d="M30.2 25.4 q1.8 2.6 -.2 3.3" stroke="' + dk(sk, 0.4) + '" stroke-width=".9" fill="none" stroke-linecap="round"/>' +
    '<g fill="' + lt(sk, 0.3) + '" opacity=".35"><ellipse cx="23.6" cy="28.4" rx="2" ry="1.2"/><ellipse cx="36.4" cy="28.4" rx="2" ry="1.2"/></g>' +
    '<path class="x-ms" d="M26.2 30.4 Q30 33.8 33.8 30.4" stroke="#3A1A0A" stroke-width="1.3" fill="none" stroke-linecap="round"/>' +
    '<path class="x-mf" d="M26.6 32.6 Q30 30 33.4 32.6" stroke="#3A1A0A" stroke-width="1.3" fill="none" stroke-linecap="round" opacity="0"/>' +
    (o.beard ? '<path d="M21.4 28 Q22 37.6 30 38.4 Q38 37.6 38.6 28 Q36 33.4 30 33.4 Q24 33.4 21.4 28 Z" fill="' + (o.beard === 'w' ? '#E8E4DC' : '#24160C') + '"/>' : '') +
    front + ld + '</g>';
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
/** a Zebu cow facing left with its head down to drink; local feet on y 0, about 36 wide */
const cow = (x, y, s, c, cls = '') => { const d = dk(c, 0.2);
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><g class="x-cow ' + cls + '">' +
    '<path d="M8 -12 v12 M12 -12 v12 M26 -12 v12 M30 -12 v12" stroke="' + d + '" stroke-width="2.4" stroke-linecap="round"/>' +
    '<path d="M6 -22 Q8 -27 14 -27 Q15 -31 19 -30 Q21 -26 32 -26 Q38 -25 38 -18 Q38 -11 32 -11 L10 -11 Q5 -12 5 -16 Z" fill="' + c + '"/>' +
    '<path d="M14 -27 Q15 -31 19 -30 Q20 -27 19 -25 Z" fill="' + d + '"/><path d="M20 -12 Q28 -10 32 -11 Q38 -11 38 -18 Q36 -14 30 -13 Z" fill="' + d + '" opacity=".6"/>' +
    '<path d="M38 -22 Q42 -18 40 -8" stroke="' + d + '" stroke-width="1" fill="none"/><path d="M39.4 -9 l1.6 3 l-2.6 -.4 Z" fill="#2A1A10"/>' +
    '<path d="M7 -20 Q2 -16 -1 -8 L2 -6 Q5 -12 9 -15 Z" fill="' + c + '"/><path d="M7 -14 Q8 -9 6 -8" stroke="' + d + '" stroke-width="1.6" fill="none"/>' +
    '<path d="M-3 -8 Q-4 -3 -1 -2 Q2 -2 3 -6 Q2 -9 -1 -9 Z" fill="' + c + '"/><ellipse cx="-1.6" cy="-2.6" rx="1.6" ry="1" fill="' + dk(c, 0.4) + '"/><circle cx="0" cy="-6.6" r=".5" fill="#1A0E06"/>' +
    '<path d="M1 -8.6 Q-2 -14 -6 -13 Q-4 -11.6 -3 -9 M2 -8.4 Q6 -13 10 -12 Q7.6 -10.6 4 -8" stroke="#EDE3C8" stroke-width="1.1" fill="none" stroke-linecap="round"/>' +
    '<path d="M3 -8 l2.6 -1 l-.6 1.8 Z" fill="' + d + '"/></g>' +
    '<ellipse cx="18" cy="0" rx="18" ry="1.6" fill="#fff" opacity=".4"/></g>'; };
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
/** a washing basin with soapsuds and clothes, centred on (x, y) at its rim */
const basin = (x, y, w, c = '#2E8B7A') => '<g><path d="M' + f1(x - w / 2) + ' ' + y + ' Q' + f1(x - w * 0.4) + ' ' + f1(y + w * 0.36) + ' ' + x + ' ' + f1(y + w * 0.38) + ' Q' + f1(x + w * 0.4) + ' ' + f1(y + w * 0.36) + ' ' + f1(x + w / 2) + ' ' + y + ' Z" fill="' + c + '"/>' +
  '<path d="M' + x + ' ' + f1(y + w * 0.38) + ' Q' + f1(x + w * 0.4) + ' ' + f1(y + w * 0.36) + ' ' + f1(x + w / 2) + ' ' + y + ' L' + f1(x + w * 0.1) + ' ' + y + ' Z" fill="' + dk(c, 0.2) + '"/>' +
  '<ellipse cx="' + x + '" cy="' + y + '" rx="' + f1(w / 2) + '" ry="' + f1(w * 0.09) + '" fill="#EAF4F6"/><g fill="#fff"><circle cx="' + f1(x - w * 0.2) + '" cy="' + f1(y - w * 0.04) + '" r="' + f1(w * 0.07) + '"/><circle cx="' + f1(x + w * 0.05) + '" cy="' + f1(y - w * 0.06) + '" r="' + f1(w * 0.09) + '"/><circle cx="' + f1(x + w * 0.27) + '" cy="' + f1(y - w * 0.03) + '" r="' + f1(w * 0.06) + '"/></g>' +
  '<path d="M' + f1(x - w * 0.36) + ' ' + f1(y + w * 0.04) + ' Q' + f1(x - w * 0.1) + ' ' + f1(y - w * 0.1) + ' ' + f1(x + w * 0.14) + ' ' + f1(y + w * 0.02) + '" stroke="#C2185B" stroke-width="' + f1(w * 0.08) + '" fill="none" stroke-linecap="round"/>' +
  '<path d="M' + f1(x - w / 2) + ' ' + y + ' Q' + x + ' ' + f1(y + w * 0.08) + ' ' + f1(x + w / 2) + ' ' + y + '" stroke="' + lt(c, 0.35) + '" stroke-width="' + f1(w * 0.04) + '" fill="none"/>' +
  '<g fill="#FFD54A">' + [-0.3, -0.1, 0.1, 0.3].map((k) => '<circle cx="' + f1(x + k * w) + '" cy="' + f1(y + w * 0.2) + '" r="' + f1(w * 0.03) + '"/>').join('') + '</g></g>';
/** a cloth spread on a rock */
const rockCloth = (x, y, w, rock, cloth, cloth2) => '<g><path d="M' + f1(x - w / 2) + ' ' + y + ' Q' + f1(x - w * 0.46) + ' ' + f1(y - w * 0.34) + ' ' + f1(x - w * 0.1) + ' ' + f1(y - w * 0.4) + ' Q' + f1(x + w * 0.4) + ' ' + f1(y - w * 0.42) + ' ' + f1(x + w / 2) + ' ' + y + ' Z" fill="' + rock + '"/>' +
  '<path d="M' + f1(x + w * 0.1) + ' ' + f1(y - w * 0.41) + ' Q' + f1(x + w * 0.42) + ' ' + f1(y - w * 0.4) + ' ' + f1(x + w / 2) + ' ' + y + ' L' + f1(x + w * 0.1) + ' ' + y + ' Z" fill="' + dk(rock, 0.18) + '"/>' +
  (cloth ? '<path d="M' + f1(x - w * 0.42) + ' ' + f1(y - w * 0.1) + ' Q' + f1(x - w * 0.38) + ' ' + f1(y - w * 0.36) + ' ' + f1(x - w * 0.06) + ' ' + f1(y - w * 0.4) + ' Q' + f1(x + w * 0.3) + ' ' + f1(y - w * 0.42) + ' ' + f1(x + w * 0.4) + ' ' + f1(y - w * 0.14) + ' L' + f1(x + w * 0.36) + ' ' + f1(y - w * 0.02) + ' L' + f1(x - w * 0.38) + ' ' + f1(y + w * 0.02) + ' Z" fill="' + cloth + '"/>' +
  '<path d="M' + f1(x - w * 0.38) + ' ' + f1(y - w * 0.2) + ' Q' + x + ' ' + f1(y - w * 0.32) + ' ' + f1(x + w * 0.38) + ' ' + f1(y - w * 0.22) + ' M' + f1(x - w * 0.38) + ' ' + f1(y - w * 0.08) + ' Q' + x + ' ' + f1(y - w * 0.18) + ' ' + f1(x + w * 0.38) + ' ' + f1(y - w * 0.08) + '" stroke="' + cloth2 + '" stroke-width="' + f1(w * 0.05) + '" fill="none"/>' : '') + '</g>';
/** a dugout canoe, centre (x, y), length l */
const canoe = (x, y, l, c = '#7A4A26') => '<g><path d="M' + f1(x - l / 2) + ' ' + f1(y - l * 0.08) + ' Q' + f1(x - l * 0.3) + ' ' + f1(y + l * 0.07) + ' ' + x + ' ' + f1(y + l * 0.07) + ' Q' + f1(x + l * 0.3) + ' ' + f1(y + l * 0.07) + ' ' + f1(x + l / 2) + ' ' + f1(y - l * 0.08) + ' Q' + x + ' ' + f1(y - l * 0.01) + ' ' + f1(x - l / 2) + ' ' + f1(y - l * 0.08) + ' Z" fill="' + c + '"/>' +
  '<path d="M' + f1(x - l * 0.46) + ' ' + f1(y - l * 0.055) + ' Q' + x + ' ' + f1(y + l * 0.02) + ' ' + f1(x + l * 0.46) + ' ' + f1(y - l * 0.055) + '" stroke="' + lt(c, 0.3) + '" stroke-width="' + f1(l * 0.012) + '" fill="none"/>' +
  '<path d="M' + f1(x - l * 0.3) + ' ' + f1(y + l * 0.035) + ' Q' + x + ' ' + f1(y + l * 0.06) + ' ' + f1(x + l * 0.3) + ' ' + f1(y + l * 0.035) + '" stroke="' + dk(c, 0.3) + '" stroke-width="' + f1(l * 0.01) + '" fill="none"/></g>';

export function kogiScene(): string {
  // the far village
  const village =
    // hazy far trees
    '<g fill="#A8B98A" opacity=".75"><ellipse cx="20" cy="90" rx="22" ry="6"/><ellipse cx="70" cy="89" rx="26" ry="5"/><ellipse cx="160" cy="88" rx="40" ry="6"/><ellipse cx="250" cy="89" rx="30" ry="6"/><ellipse cx="305" cy="90" rx="22" ry="5"/></g>' +
    // the land of the far bank
    '<path d="M0 92 Q60 88 120 91 T240 90 T320 92 V110 H0 Z" fill="' + u('bank') + '"/>' +
    // red-earth compound wall at the left with its zanko horns
    '<path d="M2 101 V93 H40 V101 Z" fill="#C27A46"/>' + zanko(2, 38, 93, 4.5, '#C27A46') + '<path d="M20 101 V93 H40 V101 Z" fill="#AF6A3A"/><path d="M14 101 v-5 a2 2 0 0 1 4 0 v5 Z" fill="#4A2A14"/>' +
    dum(48, 100, 1.05) + dum(57, 101, 0.8, '#7A9A44') +
    hut(10, 100, 12, '#C98A55') + hut(30, 101, 13, '#BF7E4C') + rumbu(44, 102, 6.4) + hut(70, 101, 12, '#C6875A') + rumbu(84, 102, 5.6) + hut(98, 102, 11, '#BE7F4E') + rumbu(110, 102.4, 5) +
    neem(122, 101, 1.1) +
    // the right village: the minaret, huts, a neem, a dum palm
    '<g><path d="M226 101 L228.6 64 Q232 60 235.4 64 L238 101 Z" fill="#C98A55"/><path d="M232 61.6 Q235.4 62 235.4 64 L238 101 L232 101 Z" fill="#B0703F"/>' +
    '<path d="M229.4 66 h9 M229 74 h9.4 M228.4 82 h10.4 M227.8 90 h11.4" stroke="#7A4A26" stroke-width=".7" stroke-linecap="round"/>' +
    '<path d="M229.6 64 L232 54 L234.4 64 Z" fill="#C98A55"/><path d="M232 54 v-4" stroke="#6B4A22" stroke-width=".5"/><circle cx="232" cy="49.4" r=".9" fill="none" stroke="#C9A227" stroke-width=".5"/>' +
    '<path d="M231 72 h2 v3 h-2 Z M231 84 h2 v3 h-2 Z" fill="#3A2212"/>' +
    '<path d="M214 101 V84 H250 V101 Z" fill="#C27A46"/>' + zanko(214, 248, 84, 4.4, '#C27A46') + '<path d="M232 101 V84 H250 V101 Z" fill="#AA6538"/><path d="M226 101 v-8 a4 4 0 0 1 8 0 v8 Z" fill="#4A2A14"/>' +
    '<g fill="none" stroke="#FFF1D6" stroke-width=".45" opacity=".75"><path d="M218 90 q2.4 -2.4 4.8 0 q-2.4 2.4 -4.8 0 Z M240 90 q2.4 -2.4 4.8 0 q-2.4 2.4 -4.8 0 Z"/></g></g>' +
    hut(203, 102, 12, '#C6875A') + rumbu(260, 102, 6) + hut(272, 101, 12, '#BF7E4C') + neem(300, 100, 1.2) + dum(288, 101, 0.9) + hut(314, 102, 11, '#C98A55') + rumbu(190, 102, 5.4) +
    // tiny village folk: a woman pounding, a man walking
    '<g><path d="M62 104 h1.6 l.6 -5 h-2.8 Z" fill="#2E7D32"/><circle cx="62.8" cy="98" r="1" fill="#6B4022"/><path d="M61.6 97.4 q1.2 -1.8 2.4 0 Z" fill="#FFB300"/></g>' +
    '<g><path d="M254 104 l.6 -6 h2.4 l.6 6 Z" fill="#F4EBD0"/><circle cx="255.8" cy="97" r="1" fill="#5E3A1C"/><path d="M254.8 96.6 q1 -1.4 2 0 Z" fill="#C62828"/></g>';
  // fishing nets drying on poles at the far water's edge
  const nets = '<g><path d="M262 106 V92 M276 106 V91 M290 106 V92" stroke="#6B4A22" stroke-width=".9"/>' +
    '<path d="M262 93 Q269 102 276 92 Q283 101 290 93 L290 100 Q283 106 276 99 Q269 107 262 100 Z" fill="#E8DFC0" opacity=".55"/>' +
    '<path d="M262 93 Q269 102 276 92 Q283 101 290 93 M262 96 Q269 104 276 96 Q283 104 290 96 M265 95 v8 M269 97 v8 M273 96 v7 M279 96 v7 M283 98 v6 M287 96 v6" stroke="#9A8A64" stroke-width=".3" fill="none"/>' +
    '<g fill="#E86A2A"><circle cx="266" cy="96.6" r=".6"/><circle cx="272" cy="97.6" r=".6"/><circle cx="280" cy="97" r=".6"/><circle cx="286" cy="96.6" r=".6"/></g></g>';
  // cattle at the shallows, egrets, the Fulani boy
  const herd = '<g><ellipse cx="70" cy="111" rx="52" ry="4" fill="#9FCFE0" opacity=".5"/>' +
    cow(20, 111, 0.62, '#EDE6D6', 'c1') + cow(48, 113, 0.7, '#9A4A26', 'c2') + cow(80, 110.6, 0.6, '#3A2A22', 'c3') +
    wader(44, 99.6, 0.34, false, 'e1') + wader(104, 112, 0.42, false, 'e2') + wader(10, 112.6, 0.38, false, 'e3') +
    '<path d="M0 109.4 Q60 108.4 106 109.4 Q114 112 106 115.4 H0 Z" fill="#8EC6DA" opacity=".5"/>' +
    '<g fill="none" stroke="#E8F6FB" stroke-width=".45" opacity=".9"><ellipse cx="19.6" cy="110" rx="3" ry=".7"/><ellipse cx="47.6" cy="112" rx="3.2" ry=".7"/><ellipse cx="79.6" cy="109.8" rx="3" ry=".7"/></g>' +
    person(116, 109.4, 19, { kind: 'boy', skin: 2, robe: '#C9A46A', trou: '#8A6A44', hat: 'malafa', hatc: '#D8B46A', hatc2: '#6B3A1E', al: 'staff', ar: 'hip', arc: 'x-wv',
      behind: '<path d="M9 22 L9 136" stroke="#6B4A22" stroke-width="2.4" stroke-linecap="round"/>' }) + '</g>';
  // the fisherman casting his net from a small canoe
  const fisher = '<g transform="translate(248 131)"><g class="x-boat">' +
    '<g class="x-net"><path d="M8 -20 Q22 -26 30 -6 Q24 -2 16 -1 Q10 -1 6 -4 Z" fill="#F2EBD6" opacity=".35"/>' +
    '<path d="M8 -20 Q22 -26 30 -6 M8 -20 Q20 -16 24 -2 M8 -20 Q14 -10 15 -1 M10 -11 Q20 -14 27 -12 M12 -5 Q20 -6 29 -7" stroke="#EDE3C4" stroke-width=".35" fill="none"/>' +
    '<g fill="#7A7A7A"><circle cx="30" cy="-6" r=".6"/><circle cx="24" cy="-2" r=".6"/><circle cx="16" cy="-1" r=".6"/><circle cx="6" cy="-4" r=".6"/></g></g>' +
    canoe(0, 2, 30, '#6B3E1E') +
    person(1, 1, 18, { kind: 'man', skin: 4, robe: '#3E6E8E', trou: '#3E6E8E', hat: 'hula', hatc: '#F4EBD0', al: 'down', ar: 'wave' }) + '</g>' +
    '<ellipse cx="0" cy="4" rx="17" ry="1.4" fill="#fff" opacity=".35"/></g>';
  // the near bank on the left: rocks with clothes, the washing women
  const nearL = '<path d="M0 158 Q34 160 62 170 Q92 180 116 200 L120 212 H0 Z" fill="' + u('sand') + '"/><path d="M0 158 Q34 160 62 170 Q92 180 116 200" stroke="#F2E2B8" stroke-width="1.2" fill="none" opacity=".8"/>' +
    '<path d="M60 168 Q84 176 104 192" stroke="#fff" stroke-width=".8" fill="none" opacity=".55"/>' +
    reeds(1, 162, 6, 1.1) +
    rockCloth(22, 176, 26, '#9A8C7A', '#C2185B', '#FFD54A') + rockCloth(44, 182, 18, '#8A7E6E', '#1E88E5', '#fff') + rockCloth(8, 186, 18, '#A49684', '#FFB300', '#2E7D32') +
    // the woman spreading a wrapper over the rock
    person(36, 172, 34, { kind: 'woman', skin: 1, robe: '#6A4C93', wrap: '#00897B', wrap2: '#FFD54A', hat: 'kallabi', hatc: '#6A4C93', hatc2: '#FFD54A', al: 'fwd', ar: 'down', arc: 'x-wv' }) +
    '<path d="M27.4 155.6 L31.6 157 Q30.6 164 33 168.6 Q26 169.4 20.4 167.4 Q25 162 27.4 155.6 Z" fill="#FB8C00"/><path d="M28.6 157 Q27.6 163 23.4 167.6 M30.6 158 Q29.6 164 28 168.4" stroke="#C2185B" stroke-width=".8" fill="none"/>' +
    // the woman kneeling at her basin by the water
    '<g><ellipse cx="72" cy="183" rx="17" ry="4.6" fill="#C62828"/><path d="M57 183 Q72 179 87 183" stroke="#F4EBD0" stroke-width="1" fill="none"/><ellipse cx="72" cy="187.4" rx="18" ry="2.4" fill="rgba(40,24,10,.25)"/><g clip-path="url(#kg4-kneel)">' + person(72, 190, 34, { kind: 'woman', skin: 3, robe: '#F4EBD0', trim: '#2E7D32', wrap: '#C62828', wrap2: '#F4EBD0', hat: 'hijab', hatc: '#2E7D32', al: 'wash', ar: 'wash', alc: 'x-scrub', arc: 'x-wv x-scrub2' }) + '</g>' +
    basin(72, 176.6, 27, '#1F8A70') + '</g>' +
    // a little girl with a bucket
    person(102, 186, 22, { kind: 'woman', skin: 5, robe: '#FFB300', wrap: '#AD1457', wrap2: '#FFB300', hat: 'braids', al: 'down', ar: 'wave', arc: 'x-wv' }) +
    '<g><path d="M94 179 h6 l-.8 6 h-4.4 Z" fill="#E8A13A"/><path d="M94 179 q3 -4 6 0" stroke="#5A4A3A" stroke-width=".5" fill="none"/></g>';
  // the near shallows on the right: children splashing, a heron, reeds, a dum palm
  const splash = (x, y) => '<g class="x-splash"><g fill="#E8F6FB">' +
    '<path d="M' + (x - 4) + ' ' + y + ' q-2 -5 -5 -6 q4 1 6 5 Z M' + (x + 4) + ' ' + y + ' q2 -5 5 -6 q-4 1 -6 5 Z"/><circle cx="' + (x - 6) + '" cy="' + (y - 8) + '" r=".8"/><circle cx="' + (x + 7) + '" cy="' + (y - 9) + '" r=".7"/><circle cx="' + (x + 1) + '" cy="' + (y - 10) + '" r=".9"/></g></g>';
  const kid = (x, y, h, o) => '<g class="x-kid">' + person(x, y, h, o) + '</g>';
  const nearR = '<path d="M320 156 Q300 160 284 172 Q266 184 258 200 L254 212 H320 Z" fill="' + u('sand') + '"/><path d="M320 156 Q300 160 284 172 Q266 184 258 200" stroke="#F2E2B8" stroke-width="1.2" fill="none" opacity=".8"/>' +
    // the two children in the water up to their waists
    kid(232, 199, 30, { kind: 'boy', skin: 0, robe: '#E53935', trou: '#E53935', hat: 'hair', al: 'splash', ar: 'splash', alc: 'x-wv', arc: 'x-wv', cls: 'k1' }) +
    kid(254, 198, 27, { kind: 'woman', skin: 2, robe: '#FFD54A', wrap: '#1E88E5', wrap2: '#FFD54A', hat: 'braids', al: 'wave', ar: 'splash', alc: 'x-wv', arc: 'x-wv', cls: 'k2' }) +
    '<path d="M212 187 Q244 184.6 274 187 L276 212 H210 Z" fill="' + u('water2') + '"/>' +
    '<g fill="none" stroke="#E8F6FB" stroke-width=".7" opacity=".85"><ellipse cx="232" cy="187.2" rx="8" ry="1.6"/><ellipse cx="254" cy="187" rx="7" ry="1.4"/><ellipse cx="243" cy="190" rx="22" ry="3" opacity=".5"/></g>' +
    splash(221, 187) + splash(265, 187) +
    // a boy on the bank about to jump in
    person(272, 182, 26, { kind: 'boy', skin: 4, robe: '#1E88E5', trou: '#E8DFC8', hat: 'hair', al: 'wave', ar: 'wave', alc: 'x-wv', arc: 'x-wv' }) +
    wader(294, 176, 0.9, true, 'h1') + reeds(300, 182, 8, 1.2) + reeds(206, 197, 5, 1);
  return '<svg class="scene ' + P + '" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>' +
    lg('sky', ['#8FCBEA', '#BFE0EE', '#F4E7C8', '#FBDDB0']) + lg('bank', ['#B7A86A', '#9C9A58', '#C9B47A']) + lg('sand', ['#E8D29A', '#D8B87A', '#C9A266']) +
    lg('water', ['#8EC6DA', '#4FA3CC', '#2F84B6', '#22709F'], 104, 200, true) + lg('water2', ['#8EC6DA', '#4FA3CC', '#2F84B6', '#22709F'], 111, 207, true) +
    '<radialGradient id="' + P + '-sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6D0"/><stop offset=".4" stop-color="#FFE9A0" stop-opacity=".7"/><stop offset="1" stop-color="#FFE9A0" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="' + P + '-sh" cx=".38" cy=".32" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></radialGradient>' +
    '<clipPath id="' + P + '-kneel"><rect x="40" y="120" width="70" height="60"/></clipPath></defs>' +
    '<rect width="320" height="200" fill="' + u('sky') + '"/><circle cx="44" cy="50" r="34" fill="' + u('sun') + '"/><circle cx="44" cy="50" r="10" fill="#FFF3C4"/>' +
    cloud(64, 34, 1) + cloud(200, 22, 0.8) + cloud(300, 66, 0.6) +
    bird(92, 52, 1, 'b1') + bird(102, 47, 0.8, 'b2') + bird(212, 58, 0.9, 'b3') +
    village +
    // the river
    '<path d="M0 106 Q80 103 160 105 T320 106 V200 H0 Z" fill="' + u('water') + '"/>' +
    '<path d="M0 106 Q80 103 160 105 T320 106 V112 Q240 109 160 111 T0 112 Z" fill="#B5D9E4" opacity=".55"/>' +
    '<g class="x-mist"><path d="M0 110 Q60 106 130 110 Q200 113 320 108 V116 Q200 118 120 115 Q60 113 0 117 Z" fill="#fff" opacity=".22"/></g>' +
    '<g opacity=".22" stroke="#C98A55" stroke-width="1.2" stroke-linecap="round"><path d="M215 108.6 h34 M227.6 111.4 h8.8 M228.4 114.6 h7 M229.4 118 h5.4 M230.4 121.6 h3.4 M231 125 h2"/></g>' +
    // the sun's road on the water
    '<g class="x-glint" fill="#FFF6D6"><path d="M34 116 h20 v.8 h-20 Z M30 121 h28 v.8 h-28 Z M38 126 h18 v.8 h-18 Z M28 133 h22 v.8 h-22 Z M42 140 h16 v.8 h-16 Z"/></g>' +
    '<g stroke="#D4EDF6" stroke-width=".6" fill="none" opacity=".6" stroke-linecap="round"><path d="M20 128 q5 -1.6 10 0 M60 140 q5 -1.6 10 0 M150 124 q5 -1.6 10 0 M190 146 q5 -1.6 10 0 M120 158 q5 -1.6 10 0 M30 150 q5 -1.6 10 0 M170 170 q5 -1.6 10 0 M220 154 q5 -1.6 10 0 M300 140 q5 -1.6 10 0 M100 186 q5 -1.6 10 0 M150 192 q5 -1.6 10 0"/></g>' +
    nets + herd + fisher + '<g transform="translate(0 -7)">' + nearL + nearR + '</g></svg>';
}
