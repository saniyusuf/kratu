// @ts-nocheck
/*
 * Kalangu, drawn (Sani 2026-10-25: "the same quality as Hawan Sallah, with dancers"). A village square in the late
 * afternoon: a compound wall with zanko horns and white relief, a baobab, neighbours sitting along the wall, bunting.
 * The band stands on the right (a kakaki player, two kalangu drummers, a ganga drummer) and four dancers in northern
 * dress wait on the left: a woman in zani and kallabi, a man in babban riga and hula, a girl in a long dress and
 * hijab, an old man with a fan. The word's picture hangs on a carved board at the top left, filling it edge to edge.
 *
 * Moving parts carry classes that kalangu.css animates by transform and opacity only (cheap tablets):
 *   every figure: .kl-body (sway, step, hop) · .kl-head (shake) · .kl-al / .kl-ar (arms, turning at the shoulder)
 *   faces:        .kl-eo open eyes · .kl-eh happy eyes · .kl-eb cross brows · .kl-ms smile · .kl-mf frown
 *   band:         .kl-drum (squeezed) · .kl-horn (the kakaki); the drummers strike with their right arm (.kl-ar)
 * The stage carries .play while the band plays and .sad after a wrong answer.
 */
const SKIN = ['#7A4A26', '#5E3A1C', '#8B5A2B', '#6B4022'];
let gid = 0;

/* ---------------- the square ---------------- */
const lg = (id, ...c) => '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' + c.map((col, i) => '<stop offset="' + (i / (c.length - 1)).toFixed(2) + '" stop-color="' + col + '"/>').join('') + '</linearGradient>';
const zanko = (x0, x1, y) => { let s = ''; for (let x = x0; x <= x1; x += 8) s += '<path d="M' + x + ' ' + y + ' l1.4 -4.4 l1.4 4.4 Z"/>'; return s; };
const relief = (x, y) => '<g fill="none" stroke="#FFF1D6" stroke-width=".55" opacity=".8"><path d="M' + (x - 5) + ' ' + y + ' q5 -5 10 0 q-5 5 -10 0 Z"/><circle cx="' + x + '" cy="' + y + '" r="1.2"/><path d="M' + (x - 7) + ' ' + (y + 5) + ' l3.5 -2 l3.5 2 l3.5 -2 l3.5 2"/></g>';
const cloud = (x, y, s) => '<g class="drift4" transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="#fff" opacity=".8"><ellipse rx="12" ry="3"/><ellipse cx="7" cy="-1.6" rx="7" ry="3.4"/><ellipse cx="-5" cy="-1" rx="5" ry="2.6"/></g>';
/** neighbours sitting along the wall: wrappers and caps, a few clapping */
const sitters = (x0, x1, y) => {
  const C = [['#AD1457', '#FFB300'], ['#2F6B9A', '#F4EBD0'], ['#2E7D32', '#FFD54A'], ['#6A4C93', '#E9D9A6'], ['#EF6C00', '#FFFFFF'], ['#00897B', '#C2185B'], ['#C62828', '#F4EBD0']];
  let s = '<g class="kl-sit">'; let k = 0;
  for (let x = x0; x <= x1; x += 5.2, k++) { const c = C[k % C.length], sk = SKIN[k % 4], w = k % 2;
    s += '<g transform="translate(' + (x + (k % 3) * .6).toFixed(1) + ' ' + (y + (k % 2) * .5) + ') scale(' + [1, .92, 1.06, .96, 1.1][k % 5] + ')"><ellipse cx=".8" cy=".3" rx="3.6" ry=".7" fill="#5A3A1A" opacity=".3"/><path d="M-3 0 Q-3.2 -5 -1.8 -6.2 L1.8 -6.2 Q3.2 -5 3 0 Z" fill="' + c[0] + '"/>' +
      '<path d="M-3 0 Q-3.2 -5 -1.8 -6.2 L-.8 -6.2 Q-1.6 -3 -1.2 0 Z" fill="#fff" opacity=".16"/><path d="M-2.8 -1.6 Q0 -2.6 2.8 -1.6 L3.2 0 H-3.2 Z" fill="#000" opacity=".14"/><path d="M-2.6 0 h1.4 M1.2 0 h1.4" stroke="' + sk + '" stroke-width=".7"/>' +
      '<rect x="-.45" y="-7" width=".9" height="1" fill="' + sk + '"/><circle cy="-7.8" r="1.6" fill="' + sk + '"/><circle cx="-.5" cy="-8.2" r=".7" fill="#fff" opacity=".13"/><circle cx="-.5" cy="-7.8" r=".17" fill="#1A0E06"/><circle cx=".5" cy="-7.8" r=".17" fill="#1A0E06"/>' +
      (w ? '<path d="M-1.9 -8 Q0 -11.4 1.9 -8 Z" fill="' + c[1] + '"/>' : '<path d="M-2 -7.6 Q-2 -10.4 0 -10.4 Q2 -10.4 2 -7.6 L2.4 -5.6 L-2.4 -5.6 Z" fill="' + c[1] + '"/><circle cy="-7.8" r="1.2" fill="' + sk + '"/>') +
      (k % 3 === 1 ? '<g class="kl-clap"><path d="M1.4 -5 L3 -6.6" stroke="' + c[0] + '" stroke-width="1" stroke-linecap="round"/></g>' : '') + '</g>'; }
  return s + '</g>';
};
/* (r3, Sani 2026-10-27 "more real") the wall's plaster: blotches of darker and paler earth, rain streaks from the
   parapet, hairline cracks; the palm-wood beams (toron) that stand out of every Hausa wall; the dagi knot in raised
   plaster in place of the old eye; ripples, footprints and pebbles in the sand. The light comes from the upper left. */
const plaster = () => { let s = '<g>';
  for (let i = 0; i < 60; i++) { const x = (i * 37.3) % 160, y = 46 + (i * 23.7) % 25; s += '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="' + (1 + (i % 4) * .7).toFixed(1) + '" ry="' + (.5 + (i % 3) * .3).toFixed(1) + '" fill="' + (i % 2 ? '#9A5A2E' : '#E8A86E') + '" opacity=".22"/>'; }
  for (let i = 0; i < 16; i++) { const x = 3 + (i * 53.1) % 154; s += '<path d="M' + x.toFixed(1) + ' ' + (x > 60 && x < 100 ? 38 : 44) + ' v' + (5 + (i % 4) * 3) + '" stroke="#7A3A1C" stroke-width="' + (.6 + (i % 2) * .5) + '" opacity=".13"/>'; }
  return s + '<path d="M14 56 l2 3 l-1 3 l2 4 M128 58 l-2 3 l1 4" stroke="#6B3418" stroke-width=".35" fill="none" opacity=".45"/></g>'; };
const toron = (pts) => '<g>' + pts.map(([x, y]) => '<path d="M' + (x + .5) + ' ' + (y + .6) + ' l2 .3 l-.4 1.6 l-1.6 -.3 Z" fill="#6E3418" opacity=".35"/><rect x="' + (x - .6) + '" y="' + (y - .5) + '" width="2.2" height="1.1" rx=".3" fill="#5A3416"/><rect x="' + (x - .6) + '" y="' + (y - .5) + '" width="2.2" height=".35" fill="#8A5A30"/>').join('') + '</g>';
const dagi = (x, y, r = 5) => { const k = r * .55, d = 'M' + x + ' ' + (y - r) + ' Q' + (x + k) + ' ' + (y - k) + ' ' + (x + r) + ' ' + y + ' Q' + (x + k) + ' ' + (y + k) + ' ' + x + ' ' + (y + r) + ' Q' + (x - k) + ' ' + (y + k) + ' ' + (x - r) + ' ' + y + ' Q' + (x - k) + ' ' + (y - k) + ' ' + x + ' ' + (y - r) + ' Z' +
    'M' + (x - r * .7) + ' ' + (y - r * .7) + ' Q' + x + ' ' + (y - r * .15) + ' ' + (x + r * .7) + ' ' + (y - r * .7) + ' Q' + (x + r * .15) + ' ' + y + ' ' + (x + r * .7) + ' ' + (y + r * .7) + ' Q' + x + ' ' + (y + r * .15) + ' ' + (x - r * .7) + ' ' + (y + r * .7) + ' Q' + (x - r * .15) + ' ' + y + ' ' + (x - r * .7) + ' ' + (y - r * .7) + ' Z';
  return '<g fill="none" stroke-linejoin="round"><path d="' + d + '" stroke="#6E3418" stroke-width=".9" opacity=".35" transform="translate(.35 .4)"/><path d="' + d + '" stroke="#FFF1D6" stroke-width=".7" opacity=".85"/><circle cx="' + x + '" cy="' + y + '" r="' + (r * .22) + '" stroke="#FFF1D6" stroke-width=".6" opacity=".85"/></g>'; };
const sand = () => { let s = '<g fill="none" stroke="#B88A50" stroke-width=".3" opacity=".45">';
  for (let i = 0; i < 24; i++) { const x = (i * 41.3) % 156 + 2, y = 80 + (i * 17.9) % 19, w = 4 + (i % 4) * 2; s += '<path d="M' + x.toFixed(1) + ' ' + y.toFixed(1) + ' q' + (w / 2) + ' -.8 ' + w + ' 0"/>'; }
  s += '</g><g fill="#A47A46" opacity=".35">';
  for (let i = 0; i < 16; i++) { const x = (i * 29.7 + 11) % 150 + 4, y = 82 + (i * 13.1) % 16; s += '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx=".7" ry=".35"/><ellipse cx="' + (x + 1.6).toFixed(1) + '" cy="' + (y + 1).toFixed(1) + '" rx=".7" ry=".35"/>'; }
  s += '</g><g fill="#8E6A3E" opacity=".5">';
  for (let i = 0; i < 26; i++) { const x = (i * 23.9 + 5) % 156 + 2, y = 78 + (i * 11.3) % 21; s += '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="' + (.25 + (i % 3) * .15).toFixed(2) + '" ry=".18"/>'; }
  return s + '</g>'; };
export function kalanguScene(): string {
  const flags = [6, 18, 30, 42, 54, 66, 78, 90, 102, 114, 126, 138, 150].map((x, i) => '<path d="M' + x + ' ' + (12 + Math.sin(x / 160 * Math.PI) * 10).toFixed(1) + ' l2.6 5 l2.6 -5 Z" fill="' + ['#C62828', '#2E7D32', '#FFD54A', '#1565C0'][i % 4] + '"/>').join('');
  return '<svg class="scene kl-scene" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>' +
    lg('kl-sky', '#F2A65A', '#F8CF8E', '#FBE7C0') + lg('kl-wall', '#D08A4E', '#B26B36') + lg('kl-wall2', '#C27840', '#9E5A2C') + lg('kl-ground', '#E6C690', '#CDA068') +
    '<radialGradient id="kl-sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF4C8"/><stop offset=".5" stop-color="#FFE08A" stop-opacity=".6"/><stop offset="1" stop-color="#FFE08A" stop-opacity="0"/></radialGradient></defs>' +
    '<rect width="160" height="100" fill="url(#kl-sky)"/><circle cx="26" cy="20" r="30" fill="url(#kl-sun)"/><circle cx="26" cy="20" r="6" fill="#FFF1C2"/>' + cloud(34, 10, .8) + cloud(140, 14, .6) +
    // far roofs of the town, then the baobab behind the wall
    '<g fill="#D2A88A" opacity=".5"><path d="M0 46 V36 H22 V46 Z M30 46 V32 H52 V46 Z M96 46 V34 H116 V46 Z M138 46 V30 H160 V46 Z"/>' + zanko(0, 20, 36) + zanko(30, 50, 32) + zanko(96, 114, 34) + zanko(138, 158, 30) +
    '<ellipse cx="74" cy="34" rx="5" ry="4.4"/><path d="M69 34 h10 v12 h-10 Z"/><path d="M74 25 v-3" stroke="#D2A88A" stroke-width=".6"/></g>' +
    '<g><path d="M136 66 Q134 44 128 36 Q132 36 138 44 Q140 30 136 22 Q141 26 143 38 Q147 28 154 24 Q150 34 146 44 Q150 50 150 66 Z" fill="#7A5A3A"/>' +
    '<path d="M137 40 Q140 52 141 66" stroke="#5E4026" stroke-width=".6" fill="none"/>' +
    '<g fill="#6E8E3A"><ellipse cx="128" cy="22" rx="10" ry="6"/><ellipse cx="141" cy="17" rx="11" ry="6.4"/><ellipse cx="154" cy="22" rx="9" ry="5.6"/><ellipse cx="136" cy="27" rx="7" ry="4"/></g>' +
    '<g fill="#86A646"><ellipse cx="139" cy="14" rx="7" ry="3.4"/><ellipse cx="151" cy="19" rx="5" ry="2.8"/><ellipse cx="126" cy="19" rx="5" ry="2.6"/></g>' +
    '<g fill="#8A6A3A"><ellipse cx="132" cy="28" rx="1" ry="2.2"/><ellipse cx="146" cy="25" rx="1" ry="2.4"/></g></g>' +
    // the compound wall, its gate (zaure) with a painted arch, and white relief
    '<path d="M0 72 V44 H160 V72 Z" fill="url(#kl-wall)"/><g fill="#B26B36">' + zanko(0, 158, 44) + '</g>' +
    '<path d="M60 72 V38 H100 V72 Z" fill="url(#kl-wall2)"/><g fill="#9E5A2C">' + zanko(60, 98, 38) + '</g>' +
    '<path d="M70 72 V54 Q80 42 90 54 V72 Z" fill="#3A1E0C"/><path d="M67 72 V53 Q80 38 93 53 V72" fill="none" stroke="#FFF1D6" stroke-width="1.3"/>' +
    '<path d="M64 72 V52 Q80 34 96 52 V72" fill="none" stroke="#2E7D32" stroke-width="1"/>' +
    '<g fill="#FFD54A"><circle cx="80" cy="42" r="1.2"/><circle cx="72" cy="45.5" r=".8"/><circle cx="88" cy="45.5" r=".8"/></g>' +
    plaster() + '<path d="M100 38 h3.4 V72 H100 Z" fill="#5A2A10" opacity=".16"/><path d="M0 44 H60 v1.2 H0 Z M100 44 H160 v1.2 H100 Z M60 38 H100 v1.2 H60 Z" fill="#5A2A10" opacity=".14"/>' +
    toron([[8, 49], [26, 49], [50, 49], [106, 49], [124, 49], [150, 49], [64, 43], [94, 43]]) +
    dagi(20, 56, 4.4) + dagi(44, 56, 4.4) + dagi(116, 56, 4.4) + dagi(140, 56, 4.4) + dagi(80, 31, 3.6) +
    '<path d="M108 58 h8 v6 h-8 Z M30 58 h8 v6 h-8 Z" fill="#5A3416"/><path d="M108 58 h8 M30 58 h8" stroke="#FFF1D6" stroke-width=".5"/>' +
    // the bunting across the square
    '<g class="kl-bunting"><path d="M0 12 Q80 24 160 12" fill="none" stroke="#5A3A1E" stroke-width=".45"/>' + flags + '</g>' +
    // the ground, the trodden dancing ring, the neighbours along the wall
    '<path d="M0 72 H160 V100 H0 Z" fill="url(#kl-ground)"/><path d="M0 72 H160 V75 Q80 74 0 75 Z" fill="#6E4A22" opacity=".2"/>' + sand() + sitters(3, 58, 74.4) + sitters(102, 158, 74.4) +
    '<ellipse cx="44" cy="90" rx="38" ry="6" fill="#F2DDB0" opacity=".55"/><ellipse cx="44" cy="90" rx="38" ry="6" fill="none" stroke="#B98A50" stroke-width=".4" stroke-dasharray="1.4 1.2" opacity=".6"/>' +
    '<g fill="#B98A50" opacity=".4"><ellipse cx="120" cy="94" rx="20" ry="1.4"/><ellipse cx="12" cy="97" rx="10" ry="1"/></g></svg>';
}

/* ---------------- people ---------------- */
interface Fig {
  kind: 'man' | 'woman' | 'girl'; skin: number; robe: string; robe2: string; trim: string;
  hat?: 'hula' | 'turban' | 'kallabi' | 'hijab'; hatc?: string; hatc2?: string;
  wrap?: string; wrap2?: string; shawl?: string;
  al?: string; ar?: string;              // arm paths (shoulder first) or a pose name
  hl?: string; hr?: string;              // what each hand holds (drawn inside the arm, so it moves with it)
  beard?: boolean; behind?: string; front?: string;
}
/* arm poses from the left shoulder (16,46); the right arm mirrors them about x = 30 */
const POSE = {
  down: ['M16 46 Q8 70 12 92', [12, 94]], up: ['M16 46 Q6 26 10 6', [10, 4]], out: ['M16 46 Q2 50 -6 38', [-8, 36]],
  clap: ['M16 46 Q14 64 28 66', [30, 66]], hip: ['M16 46 Q2 62 14 80', [15, 81]], high: ['M16 46 Q10 30 18 12', [18, 10]],
};
const mirror = (d) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => (60 - +x) + ' ' + y);
function arm(side, pose, sleeve, skin, hold = '', w = 9) {
  const left = side === 'l', o = left ? '16px 46px' : '44px 46px';
  let d, hx, hy;
  if (POSE[pose]) { d = POSE[pose][0]; [hx, hy] = POSE[pose][1]; if (!left) { d = mirror(d); hx = 60 - hx; } }
  else { const m = pose.split('|'); d = m[0]; [hx, hy] = m[1].split(',').map(Number); }
  return `<g class="kl-a${side}" style="transform-origin:${o}">${hold && hold.startsWith('<!--b-->') ? hold : ''}` +
    `<path d="${d}" stroke="${sleeve}" stroke-width="${w}" stroke-linecap="round" fill="none"/><circle cx="${hx}" cy="${hy}" r="3.9" fill="${skin}"/>` +
    `${hold && !hold.startsWith('<!--b-->') ? hold : ''}</g>`;
}
function head(o: Fig, sk) {
  const girl = o.kind === 'girl';
  let back = '', front = '';
  if (o.hat === 'hijab') back = `<path d="M16 32 Q14 8 30 8 Q46 8 44 32 L48 52 Q30 58 12 52 Z" fill="${o.hatc}"/>`;
  if (o.hat === 'hula') front = `<path d="M18.5 19 Q18 5 30 4 Q42 5 41.5 19 Z" fill="${o.hatc}"/><path d="M19.5 15 l3 -3 l3 3 l3 -3 l3 3 l3 -3 l3 3 l3 -3 l2 2" stroke="${o.hatc2}" stroke-width="1.3" fill="none"/><path d="M18.5 19 H41.5" stroke="rgba(0,0,0,.2)" stroke-width="1.2"/>`;
  if (o.hat === 'turban') front = `<path d="M17 20 Q16 4 30 3 Q44 4 43 20 Q36 14 30 15 Q24 14 17 20 Z" fill="${o.hatc}"/><path d="M18 12 Q30 5 42 12 M18 16 Q30 9 42 16" stroke="rgba(0,0,0,.14)" stroke-width="1.2" fill="none"/><path d="M19 18 Q14 30 18 40" stroke="${o.hatc}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  if (o.hat === 'kallabi') front = `<path d="M17 21 Q14 5 30 4 Q46 5 43 21 Q36 14 30 15 Q24 14 17 21 Z" fill="${o.hatc}"/>` +
    `<path d="M23 7 Q16 -6 27 -3 Q30 -10 34 -3 Q45 -7 37 7 Z" fill="${o.hatc}"/><path d="M27 -3 Q29 3 30 6 M34 -3 Q32 3 31 6" stroke="${o.hatc2}" stroke-width="1" fill="none"/>` +
    `<path d="M18 16 Q30 9 42 16" stroke="${o.hatc2}" stroke-width="1.4" fill="none"/>`;
  if (o.hat === 'hijab') front = `<path d="M17 24 Q16 8 30 8 Q44 8 43 24 Q38 16 30 16 Q22 16 17 24 Z" fill="${o.hatc}"/>`;
  const r = girl ? 10.5 : 11, cy = girl ? 26 : 25;
  return `<g class="kl-head" style="transform-origin:30px ${cy + r}px">${back}` +
    `<rect x="26" y="${cy + 6}" width="8" height="${girl ? 9 : 10}" fill="${sk}"/><circle cx="30" cy="${cy}" r="${r}" fill="${sk}"/><circle cx="30" cy="${cy}" r="${r}" fill="url(#k4-shade)"/><circle cx="${30 - r * .45}" cy="${cy - r * .3}" r="${r * .38}" fill="#fff" opacity=".1"/>` +
    `<path d="M29.4 ${cy - .2} q-1.6 3.4 .4 4.2 q1.8 .2 2.4 -.8" stroke="#000" stroke-opacity=".28" stroke-width="1" fill="none" stroke-linecap="round"/>` +
    `<g class="kl-eo" fill="#1A0E06"><circle cx="25.6" cy="${cy - 1}" r="1.6"/><circle cx="34.4" cy="${cy - 1}" r="1.6"/></g>` +
    `<g class="kl-eh" fill="none" stroke="#1A0E06" stroke-width="1.5" stroke-linecap="round"><path d="M23.6 ${cy - .6} q2 -2.2 4 0 M32.4 ${cy - .6} q2 -2.2 4 0"/></g>` +
    `<g class="kl-eb" stroke="#1A0E06" stroke-width="1.2" stroke-linecap="round"><path d="M23 ${cy - 5} l5 1.6 M37 ${cy - 5} l-5 1.6"/></g>` +
    `<path class="kl-ms" d="M25.5 ${cy + 5} Q30 ${cy + 9} 34.5 ${cy + 5}" stroke="#3A1A0A" stroke-width="1.6" fill="none" stroke-linecap="round"/>` +
    `<path class="kl-mf" d="M25.5 ${cy + 7.5} Q30 ${cy + 4} 34.5 ${cy + 7.5}" stroke="#3A1A0A" stroke-width="1.6" fill="none" stroke-linecap="round"/>` +
    (o.beard ? `<path d="M22 ${cy + 4} Q30 ${cy + 17} 38 ${cy + 4} Q34 ${cy + 11} 30 ${cy + 11} Q26 ${cy + 11} 22 ${cy + 4} Z" fill="#E8E4DC"/>` : '') +
    `${front}</g>`;
}
function body(o: Fig) {
  if (o.kind === 'man') return (
    `<path d="M20 126 h7 v7 h-9 Z M33 126 h7 l2 7 h-9 Z" fill="#3A2A1E"/>` +
    `<path d="M14 42 Q30 36 46 42 L58 124 Q30 132 2 124 Z" fill="${o.robe}"/><path d="M30 40 Q44 40 46 42 L58 124 Q44 128 30 129 Z" fill="${o.robe2}" opacity=".35"/>` +
    `<path d="M24 44 L30 68 L36 44" fill="none" stroke="${o.trim}" stroke-width="1.6"/><circle cx="30" cy="74" r="4.6" fill="none" stroke="${o.trim}" stroke-width="1.4"/>` +
    `<path d="M23 52 q7 4.4 14 0 M24 60 q6 4 12 0" stroke="${o.trim}" stroke-width="1.2" fill="none"/>` +
    `<path d="M8 96 q5 -9 12 -2 q4 7 -3 9 q-6 1 -4 -5 q2 -3 4 -1" stroke="${o.trim}" stroke-width="1.3" fill="none"/>` +
    `<path d="M3 122 Q30 130 57 122" stroke="${o.trim}" stroke-width="1.6" fill="none"/>` +
    `<path d="M18 70 Q12 96 9 122 M42 70 Q48 96 51 122 M36 90 Q38 108 40 126" stroke="#000" stroke-opacity=".12" stroke-width="1.6" fill="none" stroke-linecap="round"/>`);
  if (o.kind === 'woman') return (
    `<path d="M21 128 h7 v6 h-9 Z M32 128 h7 l2 6 h-9 Z" fill="#5A2E14"/>` +
    `<path d="M15 42 Q30 37 45 42 L48 82 L12 82 Z" fill="${o.robe}"/><path d="M30 40 Q42 40 45 42 L48 82 L30 82 Z" fill="${o.robe2}" opacity=".3"/>` +
    `<path d="M22 43 Q30 52 38 43" fill="none" stroke="${o.trim}" stroke-width="1.6"/><g fill="${o.trim}"><circle cx="24" cy="49" r="1"/><circle cx="27" cy="51.4" r="1"/><circle cx="30" cy="52.2" r="1"/><circle cx="33" cy="51.4" r="1"/><circle cx="36" cy="49" r="1"/></g>` +
    `<path d="M10 80 L50 80 L53 130 Q30 135 7 130 Z" fill="${o.wrap}"/><path d="M10 80 L50 80 L50.6 88 L9.4 88 Z" fill="${o.wrap2}"/>` +
    `<path d="M8.6 104 H51.4 M8 118 H52" stroke="${o.wrap2}" stroke-width="2.2"/>` +
    `<g fill="${o.wrap2}">${[14, 22, 30, 38, 46].map((x) => `<path d="M${x} 108 l3 3 l-3 3 l-3 -3 Z"/>`).join('')}</g>` +
    `<path d="M44 84 Q40 104 46 130" stroke="rgba(0,0,0,.18)" stroke-width="1.2" fill="none"/>` +
    (o.shawl ? `<path d="M41 42 Q54 54 51 88 L45 86 Q47 60 36 44 Z" fill="${o.shawl}"/><path d="M45 86 l1 5 M48 87 l1 5 M51 88 l.6 5" stroke="${o.shawl}" stroke-width="1"/>` : ''));
  return (
    `<path d="M22 126 h6 v6 h-8 Z M32 126 h6 l2 6 h-8 Z" fill="#5A2E14"/>` +
    `<path d="M16 44 Q30 39 44 44 L52 128 Q30 133 8 128 Z" fill="${o.robe}"/><path d="M30 42 Q42 42 44 44 L52 128 Q42 131 30 131 Z" fill="${o.robe2}" opacity=".3"/>` +
    `<g fill="${o.trim}">${[[18, 70], [30, 64], [42, 72], [14, 96], [26, 92], [38, 98], [48, 112], [20, 118], [34, 114]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6"/><circle cx="${x + 2.4}" cy="${y + 1}" r="1"/>`).join('')}</g>` +
    `<path d="M9 124 Q30 131 51 124" stroke="${o.trim}" stroke-width="1.6" fill="none"/>`);
}
/** one standing figure in a 60×140 box, feet on y 134; `scale` shrinks a child about her feet */
function figure(o: Fig, cls = '', scale = 1): string {
  const sk = SKIN[o.skin % 4], sleeve = o.kind === 'woman' ? o.robe : o.robe, w = o.kind === 'man' ? 10 : 8;
  const inner = `<ellipse cx="30" cy="135" rx="24" ry="3.4" fill="rgba(40,24,10,.25)"/>` +
    `<g class="kl-body" style="transform-origin:30px 134px">${o.behind || ''}` +
    arm('l', o.al || 'down', sleeve, sk, o.hl, w) + body(o) + head(o, sk) + arm('r', o.ar || 'down', sleeve, sk, o.hr, w) + `${o.front || ''}</g>`;
  return `<svg class="kl-fig ${cls}" viewBox="-14 -14 88 152" aria-hidden="true">` + (scale === 1 ? inner : `<g transform="translate(${30 * (1 - scale)} ${134 * (1 - scale)}) scale(${scale})">${inner}</g>`) + `</svg>`;
}

/* ---------------- the dancers ---------------- */
export function dancers(): string {
  const hanky = (x, y, c) => `<path d="M${x} ${y} q-6 -8 -2 -14 q4 4 10 2 q-2 6 -8 12 Z" fill="${c}"/>`;
  const fan = (x, y) => `<g transform="translate(${x} ${y})"><path d="M0 0 L-8 -14 Q0 -19 8 -14 Z" fill="#E8C35A"/><path d="M0 0 L-4 -16 M0 0 L0 -17 M0 0 L4 -16" stroke="#A8862E" stroke-width=".7"/><path d="M-8 -14 Q0 -19 8 -14" stroke="#C62828" stroke-width="1.4" fill="none"/></g>`;
  const D: [Fig, number][] = [
    [{ kind: 'woman', skin: 0, robe: '#FFB300', robe2: '#C77800', trim: '#C2185B', wrap: '#C2185B', wrap2: '#FFD54A', shawl: '#7B1FA2', hat: 'kallabi', hatc: '#C2185B', hatc2: '#FFD54A', al: 'up', ar: 'out', hl: hanky(10, 4, '#FFFFFF') }, 1],
    [{ kind: 'man', skin: 1, robe: '#F4EBD0', robe2: '#B8A77E', trim: '#2E7D32', hat: 'hula', hatc: '#6A1B9A', hatc2: '#FFD54A', al: 'out', ar: 'up' }, 1],
    [{ kind: 'girl', skin: 2, robe: '#00897B', robe2: '#004D40', trim: '#FFD54A', hat: 'hijab', hatc: '#FFE082', al: 'clap', ar: 'clap' }, .8],
    [{ kind: 'man', skin: 3, robe: '#1565C0', robe2: '#0D3C80', trim: '#FFD54A', hat: 'turban', hatc: '#FFFFFF', beard: true, al: 'hip', ar: 'high', hr: fan(42, 12) }, 1],
  ];
  return D.map(([o, s], i) => `<span class="kl-dn d${i}">${figure(o, '', s)}</span>`).join('');
}

/* ---------------- the band ---------------- */
/** the kalangu, the hourglass talking drum, lying across: two heads, the cords between them, a leather band at the waist */
function talkingDrum(x, y, len = 26, r = 9) {
  let cords = ''; for (let k = -3; k <= 3; k++) cords += `<path d="M${x} ${y + k * r / 3.4} L${x + len} ${y - k * r / 3.4}" stroke="#F1E2C0" stroke-width=".7"/>`;
  return `<g class="kl-drum" style="transform-origin:${x + len / 2}px ${y}px">` +
    `<path d="M${x} ${y - r} Q${x + len / 2} ${y - r * .3} ${x + len} ${y - r} L${x + len} ${y + r} Q${x + len / 2} ${y + r * .3} ${x} ${y + r} Z" fill="url(#k4-wood)"/>` + cords +
    `<rect x="${x + len / 2 - 3}" y="${y - r * .42}" width="6" height="${r * .84}" fill="#8B2E1A"/>` +
    `<ellipse cx="${x}" cy="${y}" rx="2.4" ry="${r}" fill="#F1E2C0" stroke="#8B5A2B" stroke-width=".8"/><ellipse cx="${x + len}" cy="${y}" rx="2.4" ry="${r}" fill="#E9D6AE" stroke="#8B5A2B" stroke-width=".8"/></g>`;
}
export function band(): string {
  // a kalangu drummer: the drum under his left arm, a bent stick in his right hand striking its inner head
  const kal = (o: Fig) => figure({ ...o, kind: 'man',
    behind: talkingDrum(-12, 70, 26, 8.5), al: 'M16 46 Q2 54 -2 66|-3,68',
    ar: 'M44 46 Q50 66 30 72|28,72', hr: '<path d="M28 72 Q20 62 13 64" stroke="#4E2E14" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
  });
  const kakaki = figure({ kind: 'man', skin: 0, robe: '#C62828', robe2: '#7F1414', trim: '#FFD54A', hat: 'turban', hatc: '#FFFFFF',
    al: 'M16 46 Q30 42 42 21|42,21', ar: 'M44 46 Q60 30 52 8|52,8',
    behind: '<g class="kl-horn" style="transform-origin:34px 30px"><path d="M33 31 L104 -62" stroke="url(#k4-steel)" stroke-width="3.2" stroke-linecap="round"/>' +
      '<path d="M100 -56 L114 -78 L120 -70 Z" fill="#E8C35A" stroke="#A8862E" stroke-width=".8"/><circle cx="66" cy="-12" r="2.2" fill="#E8C35A"/><path d="M58 -2 l10 -14" stroke="#C62828" stroke-width="2.6"/></g>' });
  const ganga = figure({ kind: 'man', skin: 2, robe: '#F4EBD0', robe2: '#B8A77E', trim: '#1565C0', hat: 'hula', hatc: '#C62828', hatc2: '#FFFFFF',
    behind: '<path d="M18 44 L50 86" stroke="#6B4422" stroke-width="2.4"/>',
    al: 'M16 46 Q8 70 34 76|36,76', ar: 'M44 46 Q58 54 56 64|56,66',
    hl: '<path d="M36 76 L48 66" stroke="#4E2E14" stroke-width="1.6" stroke-linecap="round"/>', hr: '<path d="M56 66 L52 78" stroke="#4E2E14" stroke-width="1.6" stroke-linecap="round"/>',
    front: '<g class="kl-drum" style="transform-origin:46px 92px"><rect x="34" y="78" width="26" height="28" rx="3" fill="url(#k4-wood)"/>' +
      '<path d="M34 84 L60 100 M34 100 L60 84" stroke="#F1E2C0" stroke-width=".8"/><ellipse cx="47" cy="78" rx="13" ry="3.4" fill="#F1E2C0" stroke="#8B5A2B" stroke-width=".8"/>' +
      '<ellipse cx="47" cy="106" rx="13" ry="3" fill="#5E3A1C"/></g>' });
  return `<span class="kl-bm k">${kakaki}</span>` +
    `<span class="kl-bm d1">${kal({ skin: 1, robe: '#1565C0', robe2: '#0D3C80', trim: '#FFD54A', hat: 'hula', hatc: '#FFD54A', hatc2: '#2E7D32' })}</span>` +
    `<span class="kl-bm d2">${kal({ skin: 3, robe: '#2E7D32', robe2: '#14501F', trim: '#FFFFFF', hat: 'turban', hatc: '#F4EBD0' })}</span>` +
    `<span class="kl-bm g">${ganga}</span>` +
    `<span class="kl-notes"><i>♪</i><i>♫</i><i>♪</i><i>♫</i></span>`;
}
