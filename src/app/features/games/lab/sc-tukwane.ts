// @ts-nocheck
/*
 * Tukwane, drawn (Sani 2026-10-25). A potters' yard in a northern village on a bright morning: a red-earth compound
 * wall with zanko horns and white relief, round huts with thatch, a baobab on the right. On the left a donkey has
 * brought clay in its panniers to a pile, and a woman walks with a stack of new pots on her head. Under the letter
 * boxes, rows of water pots and cooking pots dry in the sun; on the right a firing heap of grass smokes, a boy stands
 * by it, and two women sit on the ground shaping pots by hand. Chickens peck in the corners. The bottom strip where
 * the game's letter pots stand is left as open, trodden ground.
 *
 * Moving parts (sc-tukwane.css animates transform and opacity only):
 *   people   .x-p (one per figure, plus .clap / .hop) · .x-bd body · .x-hd head · .x-al / .x-ar arms
 *   faces    .x-eo open eyes · .x-eh laughing eyes and mouth · .x-ms smile · .x-mf frown and brows
 *   idle     .x-sm smoke puffs · .x-cl clouds · .x-pk pecking chickens · .x-ear / .x-tail the donkey · .x-wk working hands
 */
const P = 'tk4';
const SK = ['#7A4A26', '#5E3A1C', '#8B5A2B', '#6B4022', '#94603A'];
const n = (v) => Math.round(v * 10) / 10;
const lin = (id, stops, h) => `<linearGradient id="${P}-${id}" x1="0" y1="0" x2="${h ? 1 : 0}" y2="${h ? 0 : 1}">` +
  stops.map((c, i) => `<stop offset="${n(i / (stops.length - 1))}" stop-color="${c}"/>`).join('') + '</linearGradient>';
const rad = (id, stops, cx = .5, cy = .5, r = .5) => `<radialGradient id="${P}-${id}" cx="${cx}" cy="${cy}" r="${r}">` +
  stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('') + '</radialGradient>';
/** place a drawing; an animated class goes on an inner group so CSS transforms never fight the placement */
const at = (x, y, s, inner, cls = '', flip = false) =>
  `<g transform="translate(${n(x)} ${n(y)}) scale(${flip ? -s : s} ${s})">${cls ? `<g class="${cls}">${inner}</g>` : inner}</g>`;
const url = (id) => `url(#${P}-${id})`;
/** the sun is high on the upper left: a dark contact patch where a thing meets the ground and a soft shadow thrown to
    the lower right, foreshortened on the flat yard */
const shadow = (w, len = 1) => `<ellipse cx="${n(w * .62 * len)}" cy=".4" rx="${n(w * (1 + .55 * len))}" ry="${n(1.3 + .45 * len)}" fill="rgba(74,40,14,.2)"/>` +
  `<ellipse cx="${n(w * .12)}" cy=".1" rx="${n(w * .82)}" ry="${n(.8 + .25 * len)}" fill="rgba(48,22,6,.32)"/>`;
/** a sprinkle of marks from a fixed seed, so the mud and the ground have grain without random redraws */
function grain(x0, x1, y0, y1, k, fill, r = .35, seed = 7) {
  let s = '', v = seed;
  const rnd = () => (v = (v * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < k; i++) { const x = x0 + rnd() * (x1 - x0), y = y0 + rnd() * (y1 - y0), rr = r * (.5 + rnd()); s += `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(rr * 1.6)}" ry="${n(rr)}"/>`; }
  return `<g fill="${fill}">${s}</g>`;
}

/* ---------------- people ---------------- */
function head(sk, o) {
  const hc = o.hatc || '#C2185B', h2 = o.hatc2 || '#FFD54A';
  let back = '', front = '';
  if (o.hat === 'veil') {
    back = `<path d="M-5.6 .4 Q-6 -6.6 0 -6.8 Q6 -6.6 5.6 .4 L8.4 9 Q0 11.4 -8.4 9 Z" fill="${hc}"/>`;
    front = `<path d="M-5.6 1.4 Q-6 -6.4 0 -6.6 Q6 -6.4 5.6 1.4 Q4.4 -3.6 0 -3.9 Q-4.4 -3.6 -5.6 1.4 Z" fill="${hc}"/><path d="M-4.8 -.6 Q0 -5.4 4.8 -.6" stroke="rgba(0,0,0,.15)" stroke-width=".5" fill="none"/>`;
  }
  if (o.hat === 'kallabi') front = `<path d="M-5.4 -.4 Q-6 -6.8 0 -6.8 Q6 -6.8 5.4 -.4 Q0 -4.2 -5.4 -.4 Z" fill="${hc}"/>` +
    `<path d="M-1.6 -6.2 Q-6.2 -11 -1.4 -9.8 Q0 -12.8 1.6 -9.8 Q6.4 -10.8 2 -6.2 Z" fill="${hc}"/><path d="M-1.4 -9.8 Q-.6 -8 -.4 -6.6 M1.6 -9.8 Q.8 -8 .4 -6.6" stroke="${h2}" stroke-width=".45" fill="none"/>` +
    `<path d="M-5.1 -2.2 Q0 -5.6 5.1 -2.2" stroke="${h2}" stroke-width=".7" fill="none"/><path d="M-4 -4.6 Q0 -6.4 4 -4.6" stroke="rgba(0,0,0,.18)" stroke-width=".4" fill="none"/>`;
  if (o.hat === 'hula') front = `<path d="M-4.9 -1.8 Q-5 -7.4 0 -7.4 Q5 -7.4 4.9 -1.8 Z" fill="${hc}"/>` +
    `<path d="M-4.5 -3.6 l1.1 -1.2 l1.1 1.2 l1.1 -1.2 l1.1 1.2 l1.1 -1.2 l1.1 1.2 l1.1 -1.2 l.8 .9" stroke="${h2}" stroke-width=".5" fill="none"/><path d="M-4.9 -1.8 H4.9" stroke="rgba(0,0,0,.25)" stroke-width=".5"/>`;
  if (o.hat === 'hair') front = `<path d="M-4.9 -1.4 Q-5.2 -5.8 0 -5.8 Q5.2 -5.8 4.9 -1.4 Q2.4 -3.8 0 -3.6 Q-2.4 -3.8 -4.9 -1.4 Z" fill="#1E120A"/>`;
  return back +
    `<circle cx="-4.9" cy=".4" r="1.1" fill="${sk}"/><circle cx="4.9" cy=".4" r="1.1" fill="${sk}"/>` +
    `<circle r="5" fill="${sk}"/><circle r="5" fill="${url('shade')}"/>` +
    `<g class="x-eo" fill="#1A0E06"><circle cx="-1.8" cy="-.3" r=".62"/><circle cx="1.8" cy="-.3" r=".62"/></g>` +
    `<g class="x-eh" fill="none" stroke="#1A0E06" stroke-width=".55" stroke-linecap="round"><path d="M-2.6 0 q.8 -1.1 1.6 0 M1 0 q.8 -1.1 1.6 0"/></g>` +
    `<path d="M-.1 .3 q.8 1 -.2 1.4" stroke="rgba(30,14,4,.55)" stroke-width=".4" fill="none"/>` +
    `<path class="x-ms" d="M-1.5 2.5 Q0 3.5 1.5 2.5" stroke="#3A1A0A" stroke-width=".5" fill="none" stroke-linecap="round"/>` +
    `<path class="x-eh" d="M-1.8 2.2 Q0 4.8 1.8 2.2 Z" fill="#5A1A10"/>` +
    `<g class="x-mf" stroke="#3A1A0A" stroke-width=".5" fill="none" stroke-linecap="round"><path d="M-1.5 3.3 Q0 2.3 1.5 3.3"/><path d="M-2.8 -2 l1.7 .6 M2.8 -2 l-1.7 .6"/></g>` +
    (o.beard ? `<path d="M-4 1.6 Q0 7.4 4 1.6 Q2.6 4.2 0 4.2 Q-2.6 4.2 -4 1.6 Z" fill="#2A1A10"/>` : '') + front + (o.top || '');
}
/** an arm from the shoulder (sx, sy): a quadratic to the hand at (hx, hy) through (cx, cy) */
function arm(cls, sx, sy, a, sleeve, sk, kind, hold = '') {
  const [cx, cy, hx, hy] = a, d = `M${sx} ${sy} Q${cx} ${cy} ${hx} ${hy}`;
  let s = '';
  if (kind === 'short') {
    const t = .45, ax = sx + (cx - sx) * t, ay = sy + (cy - sy) * t, bx = cx + (hx - cx) * t, by = cy + (hy - cy) * t;
    const mx = ax + (bx - ax) * t, my = ay + (by - ay) * t;
    s = `<path d="${d}" stroke="rgba(30,14,4,.35)" stroke-width="3.3" stroke-linecap="round" fill="none"/><path d="${d}" stroke="${sk}" stroke-width="2.7" stroke-linecap="round" fill="none"/>` +
      `<path d="M${sx} ${sy} Q${n(ax)} ${n(ay)} ${n(mx)} ${n(my)}" stroke="${sleeve}" stroke-width="3.8" stroke-linecap="round" fill="none"/>`;
  } else {
    const w = kind === 'wide' ? 4.6 : 3.5;
    s = `<path d="${d}" stroke="rgba(30,14,4,.3)" stroke-width="${w + .7}" stroke-linecap="round" fill="none"/><path d="${d}" stroke="${sleeve}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`;
  }
  return `<g class="${cls}" style="transform-origin:${sx}px ${sy}px">${s}<circle cx="${hx}" cy="${hy}" r="1.45" fill="${sk}"/>${hold}</g>`;
}
const GEO = { stand: [-52, -44.5, 7], sit: [-33.5, -26.5, 6.5], kneel: [-37.5, -30.5, 6.5] };
const side = (d) => `<path d="${d}" fill="${url('side')}"/>`;
function body(o, sk) {
  const t = o.trim || '#FFD54A', feet = (y = 0) => `<path d="M-4.4 ${y - 1.5} h3 l.3 1.5 h-3.6 Z M1.1 ${y - 1.5} h3 l.6 1.5 h-3.6 Z" fill="#3A2214"/>`;
  if (o.pose === 'sit') {
    const sil = 'M-6.5 -27 Q0 -29.4 6.5 -27 L8.2 -11 Q15.6 -8 15 0 Q0 1.6 -15 0 Q-15.6 -8 -8.2 -11 Z';
    return `<ellipse cx="-13" cy="-1" rx="2.4" ry="1.2" fill="${sk}"/><ellipse cx="13" cy="-1" rx="2.4" ry="1.2" fill="${sk}"/>` +
      `<path d="M-15 0 Q-16 -7.6 -9 -11.4 L9 -11.4 Q16 -7.6 15 0 Q0 1.6 -15 0 Z" fill="${o.wrap}"/>` +
      `<path d="M-14.6 -4.4 Q0 -2.6 14.6 -4.4" stroke="${o.wrap2}" stroke-width="1.1" fill="none"/><g fill="${o.wrap2}">${[-10, -5, 0, 5, 10].map((x) => `<path d="M${x} -8.2 l1.1 1.1 l-1.1 1.1 l-1.1 -1.1 Z"/>`).join('')}</g>` +
      `<path d="M-4 -10.4 Q-2 -5 -5.6 .4 M6 -10 Q9 -5 8 .6" stroke="rgba(0,0,0,.18)" stroke-width=".5" fill="none"/>` +
      `<path d="M-6.5 -27 Q0 -29.4 6.5 -27 L8.2 -10.6 Q0 -9.4 -8.2 -10.6 Z" fill="${o.robe}"/><path d="M-2.6 -27.8 Q0 -24.6 2.6 -27.8" stroke="${t}" stroke-width=".7" fill="none"/>` +
      `<path d="M-3 -22 Q-4 -16 -5 -11 M3.4 -21 Q4.6 -16 5.4 -11" stroke="rgba(0,0,0,.14)" stroke-width=".5" fill="none"/>` + side(sil);
  }
  if (o.pose === 'kneel') return `<path d="M-10.4 0 Q-11.4 -9 -7.4 -14.6 L7.4 -14.6 Q11.4 -9 10.4 0 Q0 1.2 -10.4 0 Z" fill="${o.pants}"/>` +
    `<path d="M-6.5 -31 Q0 -33.4 6.5 -31 L8 -12.6 Q0 -11 -8 -12.6 Z" fill="${o.robe}"/><path d="M-2.6 -31.8 Q0 -28.6 2.6 -31.8" stroke="${t}" stroke-width=".7" fill="none"/>` +
    side('M-6.5 -31 Q0 -33.4 6.5 -31 L8 -12.6 L11 0 Q0 1.2 -10.4 0 L-8 -12.6 Z');
  if (o.kind === 'woman') {
    const sil = 'M-7 -45 Q0 -47.6 7 -45 L8.6 -28.6 L9 -28.6 L10.2 -1.4 Q0 .4 -10.2 -1.4 L-9 -28.6 L-8.6 -28.6 Z';
    return feet() + `<path d="M-7 -45 Q0 -47.6 7 -45 L8.6 -26.5 L-8.6 -26.5 Z" fill="${o.robe}"/><path d="M-2.6 -45.6 Q0 -42.2 2.6 -45.6" stroke="${t}" stroke-width=".7" fill="none"/>` +
      `<path d="M-9 -28.6 L9 -28.6 L10.2 -1.4 Q0 .4 -10.2 -1.4 Z" fill="${o.wrap}"/><path d="M-9 -28.6 L9 -28.6 L9.15 -25.6 L-9.15 -25.6 Z" fill="${o.wrap2}"/>` +
      `<path d="M-9.7 -15 H9.7 M-10 -6 H10" stroke="${o.wrap2}" stroke-width=".9"/><g fill="${o.wrap2}">${[-7, -3.5, 0, 3.5, 7].map((x) => `<path d="M${x} -12.2 l1.2 1.2 l-1.2 1.2 l-1.2 -1.2 Z"/>`).join('')}</g>` +
      `<path d="M3.6 -25 Q2.6 -12 4.8 -1.2 M-6 -40 Q-5 -34 -6.6 -28" stroke="rgba(0,0,0,.17)" stroke-width=".55" fill="none"/>` + side(sil);
  }
  if (o.kind === 'child') return feet() + `<path d="M-4.2 -9.6 h2.6 v8.4 h-2.6 Z M1.6 -9.6 h2.6 v8.4 h-2.6 Z" fill="${sk}"/>` +
    `<path d="M-5.6 -21 L5.6 -21 L5 -9 L1 -9 L0 -15 L-1 -9 L-5 -9 Z" fill="${o.pants || '#E8E0CC'}"/>` +
    `<path d="M-6.4 -45 Q0 -47.4 6.4 -45 L8.4 -17 Q0 -15.4 -8.4 -17 Z" fill="${o.robe}"/><path d="M-2.4 -45.4 L0 -40 L2.4 -45.4" stroke="${t}" stroke-width=".7" fill="none"/>` +
    side('M-6.4 -45 Q0 -47.4 6.4 -45 L8.4 -17 Q0 -15.4 -8.4 -17 Z');
  // a man in a long riga
  return feet() + `<path d="M-4.6 -4.4 h3.4 v3 h-3.4 Z M1.2 -4.4 h3.4 v3 h-3.4 Z" fill="${o.pants || '#E8E0CC'}"/>` +
    `<path d="M-7 -45 Q0 -47.6 7 -45 L12.6 -3.6 Q0 -1.4 -12.6 -3.6 Z" fill="${o.robe}"/><path d="M-3.4 -45.4 L0 -37 L3.4 -45.4" stroke="${t}" stroke-width=".8" fill="none"/>` +
    `<path d="M-6 -36 h4 v5 q-2 1.2 -4 0 Z" stroke="${t}" stroke-width=".55" fill="none"/>` +
    `<path d="M-3 -36 Q-6 -20 -9 -4 M3 -36 Q6 -20 9 -4" stroke="rgba(0,0,0,.15)" stroke-width=".55" fill="none"/>` + side('M-7 -45 Q0 -47.6 7 -45 L12.6 -3.6 Q0 -1.4 -12.6 -3.6 Z');
}
/** one figure, feet (or seat) at the local origin */
function person(o) {
  const sk = SK[o.skin % SK.length], pose = o.pose || 'stand', [hy, sy, sx] = GEO[pose], hs = o.hs || (o.kind === 'child' ? 1 : .88);
  const sleeve = o.sleeveC || o.robe, sl = o.sleeve || 'long';
  return `<g class="x-p ${o.cls || ''}">${pose === 'sit' ? shadow(15, .7) : shadow(8, 2)}` +
    `<g class="x-bd">${o.back || ''}${body(o, sk)}` +
    `<rect x="-1.8" y="${hy + 3}" width="3.6" height="${n(sy - hy - 2.6)}" fill="${sk}"/>` +
    `<g class="x-hd" style="transform-origin:0px ${sy}px"><g transform="translate(0 ${hy}) scale(${hs})">${head(sk, o)}</g></g>` +
    (o.front || '') + arm('x-al', -sx, sy, o.al, sleeve, sk, sl, o.hl) + arm('x-ar', sx, sy, o.ar, sleeve, sk, sl, o.hr) +
    (o.up ? `<g class="x-up">${arm('x-ul', -sx, sy, [-sx - 8, sy - 12, -1.5, hy - 11], sleeve, sk, sl)}${arm('x-ur', sx, sy, [sx + 8, sy - 12, 1.5, hy - 11], sleeve, sk, sl)}</g>` : '') + `</g></g>`;
}

/* ---------------- things ---------------- */
function pot(type, fill, deco = '#F3D9B0') {
  if (type === 'tulu') return `<path d="M-4 -.6 Q-6.6 -3.6 -6.4 -8 Q-6 -12 -2.4 -13.2 L-2.2 -14.6 Q-3.2 -15.2 -3.2 -16 H3.2 Q3.2 -15.2 2.2 -14.6 L2.4 -13.2 Q6 -12 6.4 -8 Q6.6 -3.6 4 -.6 Q0 .4 -4 -.6 Z" fill="${fill}"/>` +
    `<ellipse cy="-16" rx="3.2" ry=".7" fill="#4A2412"/><path d="M-5.2 -10.8 l1 -1 l1 1 l1 -1 l1 1 l1 -1 l1 1 l1 -1 l1 1 l1 -1 l.6 .6" stroke="${deco}" stroke-width=".45" fill="none" opacity=".8"/>` +
    `<ellipse cx="-2.8" cy="-7.4" rx="1.1" ry="3" fill="#fff" opacity=".16"/>`;
  return `<path d="M-3.4 -.2 Q-7.2 -1.6 -7 -5.4 Q-6.8 -8.6 -4.2 -9.4 L-4.6 -10.4 H4.6 L4.2 -9.4 Q6.8 -8.6 7 -5.4 Q7.2 -1.6 3.4 -.2 Q0 .4 -3.4 -.2 Z" fill="${fill}"/>` +
    `<ellipse cy="-10.4" rx="4.6" ry="1" fill="#4A2412"/><path d="M-6.4 -7 Q0 -5.6 6.4 -7" stroke="${deco}" stroke-width=".5" fill="none" opacity=".7"/>` +
    `<ellipse cx="-3.6" cy="-4.6" rx="1.2" ry="2.2" fill="#fff" opacity=".15"/>`;
}
const zanko = (x0, x1, y, step, h = 4) => { let s = ''; for (let x = x0; x <= x1; x += step) s += `<path d="M${n(x - 1.6)} ${y} Q${n(x - .6)} ${y - h * .5} ${n(x - .2)} ${n(y - h)} Q${n(x + .6)} ${y - h * .5} ${n(x + 1.6)} ${y} Z"/>`; return s; };
const relief = (x, y) => `<g fill="none" stroke="#FCEBD0" stroke-width=".55" opacity=".75"><path d="M${x - 5} ${y} q5 -5 10 0 q-5 5 -10 0 Z"/><circle cx="${x}" cy="${y}" r="1.2"/><path d="M${x - 7} ${y + 5} l3.5 -2 l3.5 2 l3.5 -2 l3.5 2"/></g>`;
const cloud = (x, y, s, d) => at(x, y, s, `<g fill="#fff" opacity=".85"><ellipse rx="13" ry="3.2"/><ellipse cx="7" cy="-2" rx="7.4" ry="3.8"/><ellipse cx="-5" cy="-1.4" rx="5.4" ry="3"/><ellipse cx="1" cy="-3.4" rx="4" ry="3"/></g>`, 'x-cl ' + d);
function hut(x, y, s) {
  let lines = ''; for (let k = -12; k <= 12; k += 3) lines += `<path d="M0 -31 Q${n(k * .6)} -20 ${k * 1.2} -10.6"/>`;
  return at(x, y, s, `<path d="M-12 0 V-12 Q0 -14 12 -12 V0 Q0 2 -12 0 Z" fill="${url('wall')}"/><path d="M4 -12.8 Q9 -12.6 12 -12 V0 Q8 1.4 4 1.4 Z" fill="rgba(80,30,10,.2)"/>` +
    `<path d="M-2.6 .4 V-6.6 Q0 -9.6 2.6 -6.6 V.6 Z" fill="#3A1E0C"/>` +
    `<path d="M-15.6 -10.6 Q-8 -20 0 -31 Q8 -20 15.6 -10.6 Q0 -8.4 -15.6 -10.6 Z" fill="${url('thatch')}"/><g stroke="#9C7A3A" stroke-width=".35" fill="none" opacity=".7">${lines}</g>` +
    `<path d="M-15.6 -10.6 l1.4 1.6 l1.4 -1.4 l1.4 1.6 l1.4 -1.4 l1.4 1.6 l1.4 -1.4 l1.4 1.6 l1.4 -1.4 l1.4 1.6 l1.4 -1.4 l1.4 1.6 l1.4 -1.4 l1.4 1.6 l1.4 -1.4 l1.4 1.6 l1.4 -1.4 l1.4 1.6 l1.4 -1.4 l1.4 1.6 l1.4 -1.4 l1.4 1.6 l.4 -1" stroke="#B48C44" stroke-width=".5" fill="none"/>` +
    `<path d="M0 -31 V-35" stroke="#6B4422" stroke-width=".8"/><circle cy="-35.4" r=".8" fill="#6B4422"/>`);
}
function chicken(x, y, s, c, flip, d) {
  return at(x, y, s, shadow(3.4, 1) + `<path d="M-.6 -2.4 L-1 0 M1 -2.4 L1.2 0" stroke="#D9A23A" stroke-width=".45"/>` +
    `<g class="x-pk ${d}"><path d="M-3.6 -5.4 Q-5.6 -9 -3.8 -9.4 Q-2.6 -7 -2 -5.4 Z" fill="${c[1]}"/><ellipse cx="-.4" cy="-4.2" rx="3.6" ry="2.5" fill="${c[0]}"/>` +
    `<path d="M-2.6 -4.6 Q-.6 -2.6 1.6 -4.4" stroke="${c[1]}" stroke-width=".5" fill="none"/><circle cx="2.8" cy="-6.6" r="1.35" fill="${c[0]}"/>` +
    `<path d="M2 -7.8 q.4 -1.2 .9 -.3 q.4 -1 .9 .1 q.3 .4 -.2 .8 Z" fill="#D32F2F"/><path d="M4 -6.8 l1.3 .4 l-1.3 .4 Z" fill="#E8A23A"/><path d="M3.4 -5.6 q.3 .9 -.2 1.2" stroke="#D32F2F" stroke-width=".55" fill="none"/>` +
    `<circle cx="3.1" cy="-6.9" r=".26" fill="#1A0E06"/></g>`, '', flip);
}
function donkey() {
  // side on, facing right, two woven panniers of wet clay across its back
  return shadow(15, 1.2) +
    `<g fill="#6E6964"><rect x="-12" y="-12" width="2.4" height="11.4" rx="1"/><rect x="9" y="-12" width="2.4" height="11.4" rx="1"/></g>` +
    `<g class="x-tail" style="transform-origin:-13px -17px"><path d="M-13 -17 Q-16 -12 -15 -5" stroke="#6E6964" stroke-width="1" fill="none"/><path d="M-15.6 -6.4 q-.4 2.6 .6 3.4 q.8 -1.4 .4 -3.4 Z" fill="#2E2A26"/></g>` +
    `<ellipse cx="0" cy="-15" rx="13.4" ry="6.6" fill="${url('donk')}"/><ellipse cx="0" cy="-10.6" rx="10" ry="2.4" fill="#D2CAC0" opacity=".6"/>` +
    `<g fill="#8E8A86"><rect x="-8" y="-12" width="2.6" height="11.4" rx="1"/><rect x="5.6" y="-12" width="2.6" height="11.4" rx="1"/></g>` +
    `<g fill="#2E2A26"><rect x="-12" y="-1.4" width="2.4" height="1.4"/><rect x="9" y="-1.4" width="2.4" height="1.4"/><rect x="-8" y="-1.4" width="2.6" height="1.4"/><rect x="5.6" y="-1.4" width="2.6" height="1.4"/></g>` +
    `<path d="M8 -18 Q11 -26 16 -28 L20 -23.6 Q15 -21 12.6 -12.6 Z" fill="#8A8580"/><path d="M9 -19 Q12 -26 16.4 -28" stroke="#2E2A26" stroke-width="1.3" fill="none"/>` +
    `<g class="x-ear" style="transform-origin:17px -28px"><path d="M15.6 -28 L14.4 -35.6 L17.2 -28.4 Z M17.4 -28.4 L18.8 -36 L19 -28 Z" fill="#7A7570"/><path d="M15.2 -29 L14.8 -33.6 M18.2 -29 L18.6 -33.6" stroke="#2E2A26" stroke-width=".4"/></g>` +
    `<path d="M15 -28.4 Q19.4 -30.4 23.2 -24 Q25.2 -20 22 -19 Q19 -19 16 -22 Z" fill="#8E8A86"/><ellipse cx="22.6" cy="-20.6" rx="2.1" ry="1.6" fill="#D8D0C4"/>` +
    `<circle cx="18.6" cy="-25.4" r=".55" fill="#1A1410"/><circle cx="23.4" cy="-20.8" r=".3" fill="#3A3430"/>` +
    // the saddle cloth, the near pannier, lumps of clay
    `<path d="M-7 -21 Q0 -23 7 -21 L7.6 -14 Q0 -12.6 -7.6 -14 Z" fill="#B23A2A"/><path d="M-7.4 -15.4 Q0 -14 7.4 -15.4" stroke="#F2C14E" stroke-width=".6" fill="none"/>` +
    `<g fill="#7E6450"><ellipse cx="-4" cy="-22.6" rx="2.8" ry="2"/><ellipse cx="0" cy="-23.6" rx="3" ry="2.2"/><ellipse cx="4" cy="-22.6" rx="2.6" ry="1.9"/></g>` +
    `<path d="M-6.4 -21.6 L6.4 -21.6 L7.2 -10.6 Q0 -8.8 -7.2 -10.6 Z" fill="#C9A35E"/>` +
    `<g stroke="#9C7A3A" stroke-width=".4" fill="none"><path d="M-6.6 -18 Q0 -16.6 6.6 -18 M-6.9 -14.4 Q0 -13 6.9 -14.4"/><path d="M-4 -21.4 L-4.4 -9.8 M0 -21.6 V-9.2 M4 -21.4 L4.4 -9.8"/></g>` +
    `<path d="M-6.4 -21.6 L6.4 -21.6 L7.2 -10.6 Q0 -8.8 -7.2 -10.6 Z" fill="${url('side')}"/>`;
}
function baobab() {
  return `<path d="M-11 0 Q-8 -22 -7.4 -38 Q-13 -46 -21 -52 L-18.6 -54.6 Q-10 -49 -5 -45 Q-5 -54 -9 -63 L-5.6 -64 Q-1 -54 0 -46 Q6 -55 15 -60 L17 -57 Q9 -50 6.4 -40 Q7.4 -20 11 0 Z" fill="${url('bark')}"/>` +
    `<path d="M-3 -6 Q-2 -22 -3 -36 M4 -4 Q3 -18 4 -32" stroke="rgba(60,40,24,.35)" stroke-width=".7" fill="none"/>` +
    `<g fill="#6F8A3C"><ellipse cx="-20" cy="-57" rx="9" ry="5"/><ellipse cx="-7" cy="-67" rx="8" ry="4.6"/><ellipse cx="16" cy="-62" rx="10" ry="5.4"/><ellipse cx="4" cy="-66" rx="6" ry="3.6"/></g>` +
    `<g fill="#86A24A"><ellipse cx="-22" cy="-59" rx="5" ry="2.4"/><ellipse cx="-6" cy="-69" rx="4.6" ry="2.2"/><ellipse cx="14" cy="-64.6" rx="6" ry="2.4"/></g>` +
    `<g stroke="#7A6248" stroke-width=".3"><path d="M-15 -53 v4 M11 -58 v5 M-3 -63 v3.6"/></g><g fill="#B9A27A"><ellipse cx="-15" cy="-48" rx=".9" ry="1.6"/><ellipse cx="11" cy="-52" rx=".9" ry="1.7"/><ellipse cx="-3" cy="-59" rx=".8" ry="1.5"/></g>`;
}
function fireHeap() {
  let straw = ''; for (let k = -18; k <= 18; k += 2.2) straw += `<path d="M${n(k * .25)} -17.6 Q${n(k * .7)} -10 ${n(k * 1.08)} -.6"/>`;
  const puff = (d, x) => `<g class="x-sm ${d}"><circle cx="${x}" cy="-20" r="4" fill="#E9E4DC"/><circle cx="${x + 2.6}" cy="-21.6" r="3" fill="#F4F1EC"/></g>`;
  return shadow(21, .8) +
    `<path d="M-1 -18 Q-6 -34 2 -46 Q8 -58 0 -74" stroke="#D8D4CE" stroke-width="7" fill="none" opacity=".35" stroke-linecap="round"/>` +
    `<path d="M-21 0 Q-19 -16 0 -18.6 Q19 -16 21 0 Q0 2 -21 0 Z" fill="${url('straw')}"/>` +
    `<g stroke="#A27E36" stroke-width=".45" fill="none" opacity=".8">${straw}</g>` +
    `<g fill="#5A4636" opacity=".55"><path d="M-12 -12 q5 -3 9 -1 l-1 3 q-4 -1.4 -8 1 Z M4 -15 q4 -1.6 7 .6 l-1.4 2.4 q-2.4 -1.4 -5 -.4 Z"/></g>` +
    `<g transform="translate(-10 -1.6) scale(.6)">${pot('tukunya', url('pot'))}</g><g transform="translate(9 -1.8) scale(.55)">${pot('tukunya', url('blk'), '#C9A27A')}</g>` +
    `<ellipse cx="0" cy="-1.2" rx="19" ry="2.6" fill="${url('ember')}"/><g fill="#FFB347"><circle cx="-10" cy="-1.6" r=".7"/><circle cx="-3" cy="-.8" r=".6"/><circle cx="6" cy="-1.4" r=".7"/><circle cx="13" cy="-1" r=".5"/></g>` +
    puff('d0', -2) + puff('d1', 1) + puff('d2', -3);
}

export function tukwaneScene(): string {
  // the people
  const potterA = person({ pose: 'sit', kind: 'woman', skin: 0, robe: '#2E7D9A', trim: '#FFE08A', wrap: '#C2185B', wrap2: '#FFC94A', hat: 'kallabi', hatc: '#F2A33A', hatc2: '#8E2A6E',
    cls: 'clap pa', up: 1, sleeve: 'short', front: `<g transform="translate(0 -1)"><ellipse cx="0" cy="0" rx="8.6" ry="1.8" fill="#6A4630"/>${at(0, -1, .95, pot('tukunya', url('raw'), '#9C7A5A'))}</g>`,
    al: [-11, -16, -6.8, -8.8], ar: [11, -16, 6.8, -8.8] });
  const potterB = person({ pose: 'sit', kind: 'woman', skin: 3, robe: '#F2C14E', trim: '#B23A2A', wrap: '#2E6B3A', wrap2: '#F4EBD0', hat: 'veil', hatc: '#7B3F8C',
    cls: 'clap pb', up: 1, sleeve: 'long', front: `<g transform="translate(0 -1)"><ellipse cx="0" cy="0" rx="8" ry="1.8" fill="#6A4630"/>${at(0, -1, .95, pot('tulu', url('raw'), '#9C7A5A'))}</g>`,
    al: [-12, -18, -6.4, -12], ar: [10, -22, 4, -17.4] });
  const inv = (y, k, f) => `<g transform="translate(0 ${y}) scale(${k} ${-k})">${pot('tukunya', url(f), '#C9A27A')}</g>`;
  const stackTop = `<ellipse cy="-5.6" rx="3.2" ry="1" fill="#F4EBD0"/>` + inv(-14.5, .82, 'pot') + inv(-20.5, .66, 'blk') + inv(-24.8, .5, 'pot');
  const carrier = person({ kind: 'woman', skin: 2, robe: '#C2185B', trim: '#FFD54A', wrap: '#1F5F8B', wrap2: '#F2C14E', hat: 'kallabi', hatc: '#2E7D32', hatc2: '#FFD54A', top: stackTop,
    cls: 'wave cw', sleeve: 'short', al: [-11, -34, -9.6, -24], ar: [12, -54, 7.4, -62.6] });
  const boy = person({ kind: 'child', skin: 4, robe: '#F4EBD0', trim: '#1565C0', pants: '#8B6B4A', hat: 'hair', hs: 1.25, cls: 'hop by', sleeve: 'short',
    al: [-10, -34, -9, -26], ar: [10, -34, 9, -26], hr: `<path d="M8 -26 l4 -9 M9 -26 l5.4 -8 M10 -26 l6 -6" stroke="#D9B45A" stroke-width=".7"/>` });

  // rows of pots drying in the sun under the letter boxes
  let rows = '';
  const R1 = [['tulu', 'pot'], ['tukunya', 'raw'], ['tulu', 'raw'], ['tukunya', 'pot'], ['tulu', 'blk'], ['tukunya', 'raw'], ['tulu', 'pot'], ['tukunya', 'blk']];
  const dry = (t, f) => shadow(t === 'tulu' ? 5.6 : 6.4, .8) + pot(t, url(f));
  R1.concat(R1).forEach(([t, f], i) => { rows += at(70 + i * 11.6 + (i % 3) * 1.4, 122.8, .5, dry(t, f)); });
  [['tukunya', 'pot'], ['tulu', 'raw'], ['tukunya', 'raw'], ['tulu', 'pot'], ['tukunya', 'blk'], ['tulu', 'pot'], ['tukunya', 'raw'], ['tulu', 'blk'], ['tukunya', 'pot']].forEach(([t, f], i) => { rows += at(76 + i * 21.4, 128.6, .58, dry(t, f)); });

  const sky = `<rect width="320" height="200" fill="${url('sky')}"/>` +
    `<circle cx="50" cy="42" r="26" fill="${url('sun')}"/><circle cx="50" cy="42" r="7.6" fill="#FFF4CC"/>` +
    cloud(118, 36, 1.1, 'd0') + cloud(160, 30, .9, 'd1') + cloud(300, 18, .7, 'd0');
  const far = `<path d="M0 98 Q30 88 64 92 Q100 84 140 90 Q190 82 236 90 Q280 84 320 90 V104 H0 Z" fill="#CDBF98" opacity=".75"/>` +
    `<g fill="#B79E74" opacity=".6"><path d="M140 98 V91 H154 V98 Z M158 98 V89 H170 V98 Z"/>${zanko(141, 153, 91, 6, 2.4)}${zanko(159, 169, 89, 5, 2.4)}</g>` +
    `<g fill="#8FA26A" opacity=".7"><ellipse cx="200" cy="90" rx="8" ry="4"/><ellipse cx="228" cy="91" rx="6" ry="3"/><rect x="199.4" y="90" width="1.2" height="6"/></g>`;
  const wall = `<path d="M0 118 V97 H320 V118 Z" fill="${url('wall')}"/><path d="M0 97 H320 V99.4 H0 Z" fill="#A85E2E" opacity=".55"/>` +
    `<g fill="#C27840">${zanko(4, 318, 97, 14, 3.4)}</g>` +
    `<path d="M136 118 V93 H146 V118 Z M262 118 V93 H272 V118 Z" fill="#B8672F"/><g fill="#B8672F">${zanko(138, 145, 93, 6, 5)}${zanko(264, 271, 93, 6, 5)}</g>` +
    relief(292, 106) + `<g fill="rgba(255,240,215,.12)"><path d="M152 99.4 h1.4 v14.6 h-1.4 Z M196 99.4 h1.4 v14.6 h-1.4 Z M240 99.4 h1.4 v14.6 h-1.4 Z"/></g>` +
    `<g fill="rgba(70,30,10,.18)"><path d="M0 114 H320 V118 H0 Z"/></g>` +
    // mud grain, rain streaks down from the horns, and the plaster lit from the left
    grain(0, 320, 100, 117, 110, 'rgba(110,52,18,.22)', .4, 11) + grain(0, 320, 100, 117, 50, 'rgba(255,226,180,.18)', .35, 29) +
    `<g stroke="rgba(110,50,16,.16)" stroke-width=".8">${[12, 47, 88, 121, 178, 213, 236, 305].map((x) => `<path d="M${x} 99.6 v${4 + (x % 7)}"/>`).join('')}</g>` +
    `<rect y="97" width="320" height="21" fill="${url('walllit')}"/>`;
  const ground = `<path d="M0 116 H320 V200 H0 Z" fill="${url('ground')}"/>` +
    `<ellipse cx="160" cy="168" rx="150" ry="30" fill="${url('trod')}"/>` +
    `<g fill="#B9884C" opacity=".45"><ellipse cx="96" cy="191" rx="22" ry="1.6"/><ellipse cx="236" cy="194" rx="26" ry="1.6"/><ellipse cx="166" cy="140" rx="30" ry="1.2"/></g>` +
    grain(0, 320, 118, 200, 140, 'rgba(150,96,46,.32)', .45, 3) + grain(0, 320, 120, 200, 60, 'rgba(255,236,200,.35)', .4, 17) +
    `<g fill="none" stroke="rgba(160,104,52,.28)" stroke-width=".5"><path d="M0 150 Q80 144 150 152 T320 147"/><path d="M0 172 Q90 166 170 176 T320 170"/></g>` +
    `<g fill="#A86E3A" opacity=".55"><path d="M118 186 l2.4 -1 l1.2 1.6 Z M204 183 l2 -1.4 l1 1.8 Z M150 196 l2.6 -.6 l.6 1.4 Z"/><circle cx="72" cy="196" r=".7"/><circle cx="268" cy="188" r=".6"/></g>`;
  // the clay pile with a hoe and a water pot, at the left
  const clay = `<ellipse cx="28" cy="152.6" rx="21" ry="2.4" fill="rgba(60,34,14,.25)"/><path d="M8 152 Q12 140 22 139 Q28 136 34 140 Q44 142 47 152 Z" fill="${url('clay')}"/>` +
    `<g fill="#9C8068"><ellipse cx="18" cy="143" rx="3.4" ry="1.6"/><ellipse cx="30" cy="140" rx="3" ry="1.4"/><ellipse cx="39" cy="145" rx="2.6" ry="1.2"/></g><path d="M14 148 q6 -3 12 0 M28 149 q5 -2.4 10 0" stroke="#6E5644" stroke-width=".5" fill="none"/>` +
    `<path d="M14 141 L3 126" stroke="#6B4422" stroke-width="1.1"/><path d="M16.4 140 q-2.6 -1.2 -4 2 l2.8 1.6 Z" fill="#5A5450"/>` +
    `<g fill="#fff" opacity=".18"><ellipse cx="22" cy="142" rx="5" ry="1.2"/><ellipse cx="36" cy="144" rx="3" ry=".9"/></g>`;
  // potter A's mat, calabash of water and a finished pot beside her
  const workA = `<path d="M136 137 L176 137 L180 142 L132 142 Z" fill="#D8B46A"/><g stroke="#B08A44" stroke-width=".35"><path d="M140 137 l-2 5 M148 137 l-1 5 M156 137 v5 M164 137 l1 5 M172 137 l2 5"/></g>` +
    `<path d="M168 140 q0 4 5 4 q5 0 5 -4 Z" fill="#E2B04E"/><ellipse cx="173" cy="140" rx="5" ry="1.2" fill="#6EA8C8"/>`;
  const workB = `<path d="M276 156 L320 156 L322 162 L274 162 Z" fill="#CFA85E"/><g stroke="#A8823E" stroke-width=".35"><path d="M282 156 l-1 6 M292 156 v6 M302 156 v6 M312 156 l1 6"/></g>` +
    at(282, 158, .6, pot('tukunya', url('pot')));

  const defs = '<defs>' +
    lin('sky', ['#7FC4EA', '#BFE2F0', '#F6E6C4']) + lin('ground', ['#DDB47A', '#D2A56A', '#C29256']) + lin('wall', ['#D69457', '#B9713A']) +
    lin('thatch', ['#D8B46A', '#B08A44']) + lin('bark', ['#A88866', '#8A6A4C', '#6E5238'], true) + lin('straw', ['#E2C072', '#B98E40']) +
    lin('donk', ['#9A9590', '#76716C']) + lin('clay', ['#9A7460', '#7A5644', '#664636']) +
    rad('trod', [[0, '#F0D4A0', .7], [.7, '#E8C994', .35], [1, '#E8C994', 0]]) + rad('sun', [[0, '#FFF6D0', .9], [.4, '#FFE7A0', .5], [1, '#FFE7A0', 0]]) +
    rad('shade', [[.45, '#000', 0], [1, '#000', .3]], .38, .3, .8) +
    rad('pot', [[0, '#E9A56C'], [.55, '#C0683A'], [1, '#7E3A1A']], .36, .35, .75) + rad('raw', [[0, '#D2B394'], [.55, '#B08E6E'], [1, '#7E6450']], .36, .35, .75) +
    rad('blk', [[0, '#6E5848'], [.6, '#3E2E24'], [1, '#22180F']], .36, .35, .75) + rad('ember', [[0, '#FFB347', .95], [.6, '#E8692A', .6], [1, '#E8692A', 0]]) +
    `<linearGradient id="${P}-side" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".24"/></linearGradient>` +
    `<linearGradient id="${P}-haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EAF2F4" stop-opacity=".05"/><stop offset="1" stop-color="#F1E6CC" stop-opacity=".34"/></linearGradient>` +
    `<linearGradient id="${P}-walllit" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFE2B0" stop-opacity=".22"/><stop offset=".5" stop-color="#FFE2B0" stop-opacity="0"/><stop offset="1" stop-color="#5A2A0A" stop-opacity=".12"/></linearGradient>` +
    LPDEFS +
    '</defs>';

  return `<svg class="scene ${P}" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">` + defs + sky + far +
    hut(16, 100, 1.2) + hut(46, 98, .9) + `<g transform="translate(298 120) scale(1.7 1.36)">${baobab()}</g>` +
    `<rect y="40" width="320" height="78" fill="${url('haze')}"/>` + wall + hut(288, 117, .8) + ground +
    rows + at(297, 134, .85, fireHeap()) + at(17, 130, .95, donkey()) + at(45, 137, .8, carrier) + clay + at(46, 154, .6, shadow(6, .8) + pot('tulu', url('blk'), '#C9A27A')) +
    at(264, 133, .48, boy) + `<g transform="translate(281 148) scale(.7) translate(-156 -138)">${workA}</g>` + at(281, 148, .7 * .78, potterA) +
    `<g transform="translate(305 171) scale(.92) translate(-298 -159)">${workB}</g>` + at(305, 171, .92 * .96, potterB) +
    chicken(14, 178, 1.6, ['#F2EDE4', '#3A3A3A'], false, 'd0') + chicken(34, 190, 1.35, ['#A8562A', '#2E4A2A'], true, 'd1') + chicken(288, 194, 1.5, ['#C9772E', '#5A2A1A'], true, 'd2') +
    '</svg>';
}

/* ---------------- the game's letter pots (engine.ts 'j-rubutu') ----------------
   A round-bellied water pot (tulu) with the light from the upper left like the yard: a lit shoulder, a core shadow
   down the right, a little reflected light off the ground on the far edge, an incised shoulder band and rouletted
   lower body. Its contact shadow and the shadow it throws to the lower right sit on the ground under it. The gradients
   live in the scene's <defs> (tk4-lp…), which is in the page whenever the game is. */
const LPDEFS =
  `<radialGradient id="${P}-lpc" cx=".34" cy=".3" r=".86"><stop offset="0" stop-color="#F6BC86"/><stop offset=".3" stop-color="#D98049"/><stop offset=".72" stop-color="#A9542A"/><stop offset="1" stop-color="#6A2C0E"/></radialGradient>` +
  `<linearGradient id="${P}-lps" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFE6C8" stop-opacity=".16"/><stop offset=".42" stop-color="#000" stop-opacity="0"/><stop offset=".82" stop-color="#2A0E02" stop-opacity=".34"/><stop offset="1" stop-color="#E89A60" stop-opacity=".22"/></linearGradient>` +
  `<linearGradient id="${P}-lpb" x1="0" y1="0" x2="0" y2="1"><stop offset=".62" stop-color="#2A0E02" stop-opacity="0"/><stop offset="1" stop-color="#2A0E02" stop-opacity=".42"/></linearGradient>` +
  `<radialGradient id="${P}-lph"><stop offset="0" stop-color="#FFF4E4" stop-opacity=".7"/><stop offset="1" stop-color="#FFF4E4" stop-opacity="0"/></radialGradient>` +
  `<radialGradient id="${P}-lpsh" cx=".42" cy=".5" r=".5"><stop offset="0" stop-color="#3C1C06" stop-opacity=".42"/><stop offset=".7" stop-color="#3C1C06" stop-opacity=".16"/><stop offset="1" stop-color="#3C1C06" stop-opacity="0"/></radialGradient>`;
const LPB = 'M27 8.6 H53 Q55.4 8.6 55.4 10.8 V12.6 Q55.4 15 52.6 15.2 Q50.6 19.6 55 23.4 Q75 33 75 55 Q75 76 54 84.6 Q40 88.6 26 84.6 Q5 76 5 55 Q5 33 25 23.4 Q29.4 19.6 27.4 15.2 Q24.6 15 24.6 12.6 V10.8 Q24.6 8.6 27 8.6 Z';
let LPR = '';
for (let r = 0; r < 4; r++) for (let k = 0; k < 13 - r * 2; k++) {
  const y = 76 + r * 2.4, x = 18 + r * 3 + k * (44 - r * 6) / (12 - r * 2);
  LPR += `M${n(x)} ${n(y + Math.abs(x - 40) * -.02)} l1.6 .5`;
}
export function tukPot(L: string): string {
  return '<svg viewBox="0 0 80 92" class="art" style="overflow:visible">' +
    `<ellipse cx="52" cy="87.4" rx="34" ry="4.6" fill="url(#${P}-lpsh)"/><ellipse cx="40.6" cy="86.6" rx="17" ry="2.4" fill="rgba(46,20,4,.42)"/>` +
    `<path d="${LPB}" fill="url(#${P}-lpc)"/><path d="${LPB}" fill="url(#kc-speck)" opacity=".7"/>` +
    `<path d="${LPB}" fill="url(#${P}-lps)"/><path d="${LPB}" fill="url(#${P}-lpb)"/>` +
    // the mouth: a thick rolled rim, dark inside, the far lip lit
    `<ellipse cx="40" cy="10.2" rx="14.6" ry="3.6" fill="#B8622E"/><ellipse cx="40" cy="10.4" rx="12" ry="2.5" fill="#2E1004"/>` +
    `<path d="M28.4 9.6 Q40 6.6 51.6 9.6" fill="none" stroke="#F6C08E" stroke-width="1" opacity=".8"/>` +
    `<path d="M27.6 15.4 Q40 18.4 52.4 15.4" fill="none" stroke="#5A2208" stroke-width="1.2" opacity=".45"/>` +
    // incised shoulder lines and a band of comb-pressed triangles
    `<g fill="none" stroke="#5E2408" stroke-linecap="round" opacity=".55"><path d="M14 31 Q40 39.4 66 31" stroke-width="1.1"/><path d="M10 37.4 Q40 46.6 70 37.4" stroke-width="1.1"/></g>` +
    `<path d="M12.6 34.6 l3 -2.4 l3 3 l3 -2.6 l3 3 l3 -2.6 l3 3 l3 -2.6 l3 3 l3 -2.6 l3 3 l3 -2.6 l3 3 l3 -2.6 l3 3 l3 -2.4 l3 2.6 l2 -1.6" fill="none" stroke="#FFDDB8" stroke-width="1" opacity=".55"/>` +
    `<path d="M14 31.6 Q40 40 66 31.6" fill="none" stroke="#FFD8B0" stroke-width=".5" opacity=".45" transform="translate(0 .9)"/>` +
    // rouletted texture round the lower belly
    `<path d="${LPR}" stroke="#5A2208" stroke-width=".9" stroke-linecap="round" opacity=".38"/>` +
    // the shine on the lit shoulder
    `<ellipse cx="24" cy="44" rx="6.4" ry="13" fill="url(#${P}-lph)" transform="rotate(18 24 44)"/>` +
    `<path d="M66 44 Q71 58 63 74" fill="none" stroke="#F0A26C" stroke-width="1.2" opacity=".35"/>` +
    `<text x="40" y="68" text-anchor="middle" class="tc">${L}</text></svg>`;
}
