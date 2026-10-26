// @ts-nocheck
/*
 * Jirgin ruwa (the ferry): a river crossing point in the morning. The far bank is a busy market town at its landing:
 * zinc-roofed and mat-roofed stalls of tomatoes, peppers and grain, umbrellas, market folk, a mosque with its minaret,
 * red-earth houses with zanko horns, dum palms and neems, canoes pulled up on the sand with a donkey and a man unloading.
 * Out on the water the big wooden ferry, loaded with passengers and sacks, is poled across by its ferryman. Birds fly
 * over the river and two egrets stand at the far shallows. On the near bank (right) people wait for the ferry under a
 * shade tree: a market woman with a basin of tomatoes on her head, a man with his bicycle and its sack, a boy with a
 * goat on a rope, a man with a sack on his shoulder, and the tea seller (mai shayi) at his table and charcoal stove.
 * The lower middle stays open water for the game's word canoe; the bottom left is sand under the game's jetty.
 *
 * Classes for sc-jirgi.css (transform and opacity only):
 *   .x-fig a whole person · .x-head head · .x-al / .x-ar arms · .x-wv an arm that waves on cheer · .x-cl a clapping arm
 *   .x-ms / .x-mf smile / frown · idle: .x-ferry .x-pole .x-bird .x-ripple .x-goat .x-egret
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
  if (o.hat === 'hula') front = '<path d="M19 19 Q18.6 5.5 30 5 Q41.4 5.5 41 19 Z" fill="' + hc + '"/><path d="M19 19 Q30 16 41 19" stroke="' + dk(hc, 0.2) + '" stroke-width="1.4" fill="none"/>' +
    '<path d="M20.5 14 l2.4 -2.4 l2.4 2.4 l2.4 -2.4 l2.4 2.4 l2.4 -2.4 l2.4 2.4 l2.4 -2.4 l2.4 2.4" stroke="' + hc2 + '" stroke-width="1.1" fill="none"/><path d="M33 6 Q38 8 40 15" stroke="#fff" stroke-width="1" opacity=".35" fill="none"/>';
  if (o.hat === 'zanna') front = '<path d="M18.6 19.5 L19.6 6 Q30 2.6 40.4 6 L41.4 19.5 Z" fill="' + hc + '"/><path d="M19.6 6 Q24 12 21 19.5" stroke="' + dk(hc, 0.3) + '" stroke-width="1.2" fill="none"/><path d="M18.6 19.5 H41.4" stroke="' + dk(hc, 0.3) + '" stroke-width="1.3"/>';
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
/** a goat facing left, feet on y */
const goat = (x, y, s, c = '#F2EEE6', c2 = '#5A3A22') => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><g class="x-goat">' +
  '<path d="M2 -6 v6 M4.4 -6 v6 M11 -6 v6 M13.4 -6 v6" stroke="' + dk(c, 0.35) + '" stroke-width="1.2" stroke-linecap="round"/>' +
  '<path d="M1 -9 Q1 -13 6 -13 L13 -13 Q16.6 -13 16 -9 Q15.4 -5.6 12 -5.6 L4 -5.6 Q1 -5.6 1 -9 Z" fill="' + c + '"/><path d="M8 -13 Q12 -12.4 13 -10 Q11 -8 8 -9 Z" fill="' + c2 + '"/>' +
  '<path d="M15.6 -11.6 l2 -2.4" stroke="' + c + '" stroke-width="1.1" stroke-linecap="round"/>' +
  '<path d="M2.4 -11 Q0 -15 -2 -16.6 Q-4.4 -17 -4.6 -15 Q-4 -13 -1 -11 Z" fill="' + c + '"/><path d="M-4.6 -15.6 L-4 -12.6" stroke="' + c2 + '" stroke-width=".8"/>' +
  '<path d="M-1.6 -16.6 Q-1 -20 1.6 -20.4" stroke="#8A7A62" stroke-width=".8" fill="none" stroke-linecap="round"/><path d="M-.6 -16 l3 1.2 l-2.6 .8 Z" fill="' + dk(c, 0.2) + '"/>' +
  '<circle cx="-2.6" cy="-15.8" r=".45" fill="#1A0E06"/><path d="M-4.4 -14.6 q-.2 1.8 .4 2.6" stroke="' + dk(c, 0.3) + '" stroke-width=".5" fill="none"/></g></g>';
/** the big wooden ferry, bow at the right; centre (x, y) */
const ferry = (x, y) => '<g transform="translate(' + x + ' ' + y + ')">' +
  '<path d="M-50 -6 Q-46 6 -30 7 L34 7 Q48 6 54 -8 Q40 -3 20 -3 L-30 -3 Q-44 -3 -50 -6 Z" fill="#7A4A26"/>' +
  '<path d="M-48 -3 Q-40 1 -30 1 L32 1 Q44 0 52 -5" stroke="#5A3418" stroke-width=".8" fill="none"/><path d="M-46 1.4 Q-38 4.6 -28 4.6 L32 4.6 Q42 4 50 -1" stroke="#5A3418" stroke-width=".6" fill="none"/>' +
  '<path d="M-50 -6 Q-44 -3 -30 -3 L20 -3 Q40 -3 54 -8" stroke="#A8743E" stroke-width="1.2" fill="none"/>' +
  '<g fill="#5A3418"><rect x="-24" y="-3" width="1.4" height="9"/><rect x="0" y="-3" width="1.4" height="9"/><rect x="24" y="-3" width="1.4" height="9"/></g>' +
  // the cargo and the passengers sitting in it
  '<path d="M34 -3 Q34 -10 40 -10 Q46 -10 45 -4 Z" fill="#DCCBA0"/><path d="M40 -10 Q46 -10 45 -4 L40 -3.4 Q43 -6 40 -10 Z" fill="#C2AE7E"/><path d="M24 -3 h8 v-5 h-8 Z" fill="#E8A13A"/><path d="M24 -6 h8" stroke="#B5781E" stroke-width=".5"/>' +
  [[-24, '#C62828', '#FFD54A', 1], [-15, '#F4EBD0', '#F4EBD0', 0], [-6, '#1E88E5', '#1E88E5', 1], [3, '#2E7D32', '#C62828', 0], [12, '#6A4C93', '#FFB300', 1]].map(([px, c, hc, w], i) =>
    '<g><path d="M' + (px - 3.6) + ' -3 Q' + (px - 3.8) + ' -11 ' + px + ' -11.6 Q' + (px + 3.8) + ' -11 ' + (px + 3.6) + ' -3 Z" fill="' + c + '"/><path d="M' + px + ' -11.6 Q' + (px + 3.8) + ' -11 ' + (px + 3.6) + ' -3 L' + (px + 1) + ' -3 Z" fill="#000" opacity=".12"/>' +
    '<circle cx="' + px + '" cy="-14" r="2.5" fill="' + SK[i % 6] + '"/><circle cx="' + (px - .9) + '" cy="-14.2" r=".35" fill="#1A0E06"/><circle cx="' + (px + .9) + '" cy="-14.2" r=".35" fill="#1A0E06"/>' +
    (w ? '<path d="M' + (px - 2.9) + ' -14.4 Q' + px + ' -19.4 ' + (px + 2.9) + ' -14.4 Q' + px + ' -16 ' + (px - 2.9) + ' -14.4 Z" fill="' + hc + '"/><path d="M' + (px - 2.8) + ' -14 Q' + (px - 4.4) + ' -8 ' + (px - 3.4) + ' -5" stroke="' + hc + '" stroke-width="1.4" fill="none"/>' : '<path d="M' + (px - 2.5) + ' -15 Q' + px + ' -18.6 ' + (px + 2.5) + ' -15 Z" fill="' + hc + '"/>') + '</g>').join('') +
  '<path d="M-50 -6 Q-46 6 -30 7 L34 7 Q48 6 54 -8 Q40 -3 20 -3 L-30 -3 Q-44 -3 -50 -6 Z" fill="none"/>' +
  // the ferryman at the stern, leaning on his long pole
  '<g class="x-pole">' + person(-40, -4, 27, { kind: 'man', skin: 4, robe: '#5D6B7A', trou: '#5D6B7A', hat: 'turban', hatc: '#EDE6D6', al: 'clap', ar: 'clap', beard: 'd',
    front: '<path d="M50 20 L-24 200" stroke="#8A6A3E" stroke-width="4.6" stroke-linecap="round"/><path d="M50 20 L-24 200" stroke="#B08A54" stroke-width="1.6" stroke-linecap="round"/>' }) + '</g>' +
  '<path d="M-56 8 q8 -2 16 0 M44 8 q8 -2 14 0 M-20 9.4 q10 -1.6 20 0" stroke="#D9EEF6" stroke-width=".6" fill="none"/></g>';

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
  const nearR = '<path d="M320 138 Q282 144 252 158 Q226 172 212 200 L210 212 H320 Z" fill="' + u('sand') + '"/><path d="M320 138 Q282 144 252 158 Q226 172 212 200" stroke="#F2E2B8" stroke-width="1.2" fill="none" opacity=".8"/>' +
    '<ellipse cx="292" cy="170" rx="34" ry="6" fill="rgba(60,40,10,.18)"/>' +
    // the shade tree
    '<g><path d="M296 170 Q298 140 292 110 Q288 96 280 84 M297 140 Q306 116 314 96 M293 116 Q300 100 304 84" stroke="#5E4630" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M298 170 Q300 140 294 110" stroke="#4A3624" stroke-width="2" fill="none"/>' +
    '<g fill="#3F6B2E"><ellipse cx="268" cy="78" rx="22" ry="11"/><ellipse cx="296" cy="70" rx="26" ry="14"/><ellipse cx="320" cy="82" rx="18" ry="11"/><ellipse cx="284" cy="88" rx="14" ry="6"/></g>' +
    '<g fill="#52833A"><ellipse cx="262" cy="74" rx="14" ry="6"/><ellipse cx="290" cy="63" rx="17" ry="7"/><ellipse cx="314" cy="72" rx="12" ry="6"/></g>' +
    '<g fill="#6A9C46"><ellipse cx="286" cy="59" rx="9" ry="3.6"/><ellipse cx="258" cy="71" rx="7" ry="2.8"/><ellipse cx="308" cy="66" rx="6" ry="2.6"/></g></g>' +
    // the tea seller behind his little table: kettle, glasses, the charcoal stove
    person(304, 166, 25, { kind: 'man', skin: 1, robe: '#F4EBD0', trim: '#8A6A3E', hat: 'zanna', hatc: '#8E2A2A', al: 'clap', ar: 'clap', alc: 'x-cl', arc: 'x-cl', beard: 'w' }) +
    '<g><path d="M292 160 h20 v1.6 h-20 Z" fill="#8A5A2E"/><path d="M294 161.6 v7 M310 161.6 v7" stroke="#6B4422" stroke-width="1.1"/>' +
    '<g fill="#F2E6B8" opacity=".9"><path d="M296 160 h1.6 l-.2 -2.6 h-1.2 Z M299 160 h1.6 l-.2 -2.6 h-1.2 Z"/></g><g fill="#B5541E"><rect x="296.2" y="158.6" width="1.2" height="1.4"/><rect x="299.2" y="158.6" width="1.2" height="1.4"/></g>' +
    '<path d="M303 160 Q302 155 305.6 155 Q309 155 308.4 160 Z" fill="#2E7D32"/><path d="M308.4 157 l2.6 -2" stroke="#2E7D32" stroke-width=".9"/><path d="M304.4 155 q1.2 -1.4 2.4 0" stroke="#1F5A22" stroke-width=".7" fill="none"/></g>' +
    '<g><path d="M311 169 l2 -5 h6 l2 5 Z" fill="#4A4A4A"/><ellipse cx="316" cy="164" rx="3.4" ry="1" fill="#E8661E"/><path d="M314.6 163 Q315 159 317 156 Q317 160 318 163" stroke="#B0B6BA" stroke-width=".5" fill="none" opacity=".7"/></g>' +
    // the passengers waiting with their loads
    goat(220, 180, 0.62, '#F2EEE6', '#5A3A22') +
    '<path d="M225 166.8 Q226 174 219.4 173" stroke="#A8864A" stroke-width=".5" fill="none"/>' +
    person(230, 180, 24, { kind: 'boy', skin: 3, robe: '#2E7D32', trou: '#E8DFC8', hat: 'hula', hatc: '#F4EBD0', hatc2: '#2E7D32', al: 'fwd', ar: 'down', arc: 'x-wv', cls: 'p1' }) +
    person(247, 179, 34, { kind: 'woman', skin: 0, robe: '#C2185B', wrap: '#FFB300', wrap2: '#6A1B9A', hat: 'kallabi', hatc: '#FFB300', hatc2: '#C2185B', al: 'load', ar: 'down', arc: 'x-wv', load: headBasin('#1E88E5', ['#E53935', '#C62828', '#43A047', '#FB8C00']), cls: 'p2' }) +
    person(272, 177, 34, { kind: 'man', skin: 5, robe: '#E8E1CF', robe2: '#D4CBB4', trim: '#3E6E8E', hat: 'hula', hatc: '#3E6E8E', hatc2: '#F4EBD0', al: 'clap', ar: 'clap', alc: 'x-cl', arc: 'x-cl', cls: 'p3' }) +
    bicycle(283, 172, 5.2) +
    person(259, 188, 32, { kind: 'man', skin: 2, robe: '#4E6E3A', trou: '#D8CFB8', hat: 'turban', hatc: '#F4EBD0', al: 'down', ar: 'load', alc: 'x-wv', front: sack, cls: 'p4' });
  // the near-left sand under the game's jetty
  const nearL = '<path d="M0 166 Q40 164 80 172 Q104 178 116 200 L118 212 H0 Z" fill="' + u('sand') + '"/>' + reeds(4, 170, 6, 1.1) + reeds(98, 188, 4, 1);
  return '<svg class="scene ' + P + '" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>' +
    lg('sky', ['#86C8EA', '#B8DFEE', '#EEF1DE', '#F6E6C2']) + lg('bank', ['#B8A46C', '#A39A5E', '#D2BC86']) + lg('sand', ['#E8D29A', '#D8B87A', '#C9A266']) +
    lg('water', ['#8CCBE0', '#4FA9D6', '#2F86BA', '#1F6A9A'], 100, 200, true) +
    '<radialGradient id="' + P + '-sh" cx=".38" cy=".32" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></radialGradient>' +
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
    '<g class="x-ferry">' + '<g transform="translate(70 116) scale(.88)">' + ferry(0, 0) + '</g>' + '</g>' +
    nearL + nearR + '</svg>';
}
