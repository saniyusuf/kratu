// @ts-nocheck
/*
 * Hawan Sallah (Sani 2026-10-22): every horseman different, as at a real Sallah durbar. Six riders and horses: coat
 * (bay, chestnut, grey, black, dun, roan), the caparison's colours and pattern (quilted diamonds, stripes, checks,
 * stars), the headdress and plume, the rider's robe, turban and veil, sword or spear. The emir sits on his throne
 * under the royal umbrella and shows how he feels.
 *
 * Moving parts carry classes that gamelab.css animates by transform and opacity only:
 *   rider:  .hrs (the whole horse, rears and kneels) · .lg a–d (legs, gallop) · .fleg (front legs, fold to kneel) ·
 *           .hhead (head, droops when sad) · .sword (salute) · .r-smile / .r-frown · .r-eyes-happy / .r-eyes-sad
 *   emir:   .e-head (turns away) · .e-smile / .e-frown · .e-brow · .e-rest / .e-fold (hands on knees, arms folded)
 */
const SKIN = ['#7A4A26', '#5E3A1C', '#8B5A2B', '#6B4022'];
interface V { coat: [string, string]; mane: string; cap: [string, string, string]; pat: 'diamond' | 'stripe' | 'check' | 'star'; plume: string; robe: string; trim: string; turban: string; veil: boolean; spear: boolean; skin: number; flag: [string, string]; }
const RIDERS: V[] = [
  { coat: ['#8B5A2B', '#4E2E14'], mane: '#1A0E06', cap: ['#B71C1C', '#2E7D32', '#FFD54A'], pat: 'diamond', plume: '#C62828', robe: '#FFFFFF', trim: '#2E7D32', turban: '#FFFFFF', veil: false, spear: false, skin: 0, flag: ['#C62828', '#FFD54A'] },
  { coat: ['#B5562A', '#7A3416'], mane: '#4E1E08', cap: ['#1A237E', '#FFD54A', '#FFFFFF'], pat: 'stripe', plume: '#FFD54A', robe: '#283593', trim: '#FFD54A', turban: '#FFFFFF', veil: true, spear: true, skin: 1, flag: ['#1565C0', '#FFFFFF'] },
  { coat: ['#E8E4DC', '#A9A49A'], mane: '#8C877C', cap: ['#2E7D32', '#C62828', '#FFD54A'], pat: 'check', plume: '#2E7D32', robe: '#F4EBD0', trim: '#C62828', turban: '#C62828', veil: false, spear: false, skin: 2, flag: ['#2E7D32', '#FFD54A'] },
  { coat: ['#3A2A20', '#120A06'], mane: '#000000', cap: ['#FFB300', '#6A1B9A', '#FFFFFF'], pat: 'star', plume: '#FFFFFF', robe: '#6A1B9A', trim: '#FFB300', turban: '#FFFFFF', veil: true, spear: false, skin: 3, flag: ['#6A1B9A', '#FFB300'] },
  { coat: ['#C9A262', '#8B6A34'], mane: '#3A2410', cap: ['#C62828', '#FFFFFF', '#1565C0'], pat: 'diamond', plume: '#1565C0', robe: '#FFFFFF', trim: '#1565C0', turban: '#1A237E', veil: false, spear: true, skin: 0, flag: ['#C62828', '#FFFFFF'] },
  { coat: ['#9A8478', '#5E4A40'], mane: '#2B1E18', cap: ['#00695C', '#FFD54A', '#C62828'], pat: 'stripe', plume: '#FFD54A', robe: '#B71C1C', trim: '#FFD54A', turban: '#FFFFFF', veil: true, spear: false, skin: 1, flag: ['#00695C', '#FFD54A'] },
];
export const RIDER_COUNT = RIDERS.length;
let gid = 0;

/** a colour made lighter (k > 0, toward white) or darker (k < 0, toward black) */
function tone(c: string, k: number): string {
  const n = parseInt(c.slice(1), 16), t = k > 0 ? 255 : 0, a = Math.abs(k);
  const f = (x: number) => Math.round(x + (t - x) * a).toString(16).padStart(2, '0');
  return '#' + f(n >> 16) + f((n >> 8) & 255) + f(n & 255);
}
/* hands (r4, Sani 2026-10-27 "more real"): drawn at the wrist (0, 0) and placed with a transform. A fist round a rein,
   a hilt or a spear shaft; an open palm raised (fingers up); a hand resting on the knee (fingers down). */
function fist(x: number, y: number, sk: string, r = 0, s = 1): string {
  const d = tone(sk, -.35), l = tone(sk, .18);
  return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="M-3.9 -2.4 C-2 -4.2 2.2 -4.4 3.9 -2.6 C5 -1 5 1.8 3.6 3.4 C1.6 4.8 -2.4 4.6 -4 2.8 C-5 1.2 -5 -1.2 -3.9 -2.4 Z" fill="${sk}"/>` +
    `<path d="M-1.6 -3.6 C-1.4 -1 -1.4 1.6 -1.2 4.3 M.9 -3.8 C1.1 -1 1.2 1.6 1.4 4.3 M3.2 -3 C3.4 -1 3.5 1 3.3 3.7" stroke="${d}" stroke-width=".55" fill="none"/>` +
    `<path d="M-4.2 -1.6 C-2.6 -.6 -.6 -.8 1.4 -2.2" stroke="${d}" stroke-width=".7" fill="none" stroke-linecap="round"/><path d="M-3 -3.4 C-1 -4.4 2 -4.4 3.4 -3" stroke="${l}" stroke-width=".7" fill="none" opacity=".8"/></g>`;
}
function palm(x: number, y: number, sk: string, s = 1, flip = 1): string {
  const d = tone(sk, -.35), p = tone(sk, .32);
  const f = (fx: number, len: number, lean: number) => `<path d="M${fx} -9 L${fx + lean} ${-9 - len}" stroke="${sk}" stroke-width="2.5" stroke-linecap="round"/><path d="M${fx + lean * .6} ${-9 - len * .55} l${lean * .08} -.1" stroke="${d}" stroke-width=".4"/><ellipse cx="${fx + lean}" cy="${-8.6 - len}" rx=".75" ry=".55" fill="${p}" opacity=".9"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s * flip} ${s})"><path d="M4.4 -3 C6.4 -4.6 8 -6.8 9 -9.4" stroke="${sk}" stroke-width="2.8" stroke-linecap="round" fill="none"/>` +
    f(-3.6, 6.6, -1.1) + f(-1.2, 8.2, -.3) + f(1.3, 7.8, .4) + f(3.7, 6.2, 1.2) +
    `<path d="M-4.8 0 C-5.6 -4 -5.6 -8 -4.8 -10 L4.9 -10 C5.6 -8 5.4 -4 4.4 0 Z" fill="${p}"/><path d="M-4.8 0 C-5.6 -4 -5.6 -8 -4.8 -10 L4.9 -10 C5.6 -8 5.4 -4 4.4 0 Z" fill="none" stroke="${sk}" stroke-width="1.1"/>` +
    `<path d="M-3.6 -6.4 Q0 -5 3.6 -7 M-2.4 -2.4 Q0 -4.4 2 -8.4" stroke="${d}" stroke-width=".45" fill="none" opacity=".75"/></g>`;
}
function restHand(x: number, y: number, sk: string, s = 1, flip = 1): string {
  const d = tone(sk, -.35), l = tone(sk, .2), n = tone(sk, .45);
  const f = (fx: number, len: number) => `<path d="M${fx} 8 L${fx * 1.08} ${8 + len}" stroke="${sk}" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="${fx * 1.08}" cy="${8.6 + len}" rx=".7" ry=".5" fill="${n}" opacity=".7"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s * flip} ${s})"><path d="M-5 0 C-5.6 3 -5.6 6 -5.2 9 L5.2 9 C5.6 6 5.4 3 5 0 Z" fill="${sk}"/>` +
    f(-3.8, 5.8) + f(-1.25, 7) + f(1.3, 6.8) + f(3.8, 5.4) +
    `<path d="M5 2 C7 4 7.6 6.6 7.2 9" stroke="${sk}" stroke-width="2.7" stroke-linecap="round" fill="none"/><path d="M5.2 2.4 C6.4 4 6.8 5.6 6.8 7.6" stroke="${d}" stroke-width=".45" fill="none"/>` +
    `<path d="M-4.4 8.6 Q-3 9.6 -1.6 8.6 Q0 9.6 1.4 8.6 Q2.8 9.6 4.4 8.6" stroke="${d}" stroke-width=".45" fill="none"/><path d="M-3.8 1.6 Q0 .6 3.8 1.6" stroke="${l}" stroke-width=".8" fill="none" opacity=".7"/></g>`;
}
/** an embroidered spiral (the tambari on a babban riga's breast) */
function spiral(x: number, y: number, R: number): string {
  let d = ''; for (let k = 0; k <= 60; k++) { const a = k * .3, r = R * k / 60; d += (k ? ' L' : 'M') + (x + Math.cos(a) * r).toFixed(1) + ' ' + (y + Math.sin(a) * r).toFixed(1); }
  return d;
}
/** a tassel: a cord and a tuft of threads */
function tassel(x: number, y: number, c: string, len = 7): string {
  return `<path d="M${x} ${y} v${len * .55}" stroke="${c}" stroke-width=".9"/><path d="M${x - 1.8} ${y + len * .5} h3.6 l1.2 ${len * .75} h-6 Z" fill="${c}"/>` +
    `<path d="M${x - 1.2} ${y + len * .62} v${len * .6} M${x + .1} ${y + len * .62} v${len * .64} M${x + 1.4} ${y + len * .62} v${len * .6}" stroke="#000" stroke-opacity=".22" stroke-width=".45"/>`;
}

export function durbarRider(L: string, vi = 0): string {
  const v = RIDERS[vi % RIDERS.length], id = 'dr' + (gid++), sk = SKIN[v.skin], skd = tone(sk, -.32);
  const ink = '#1A0E06', mane = v.mane, robeD = tone(v.robe, -.24), tur = v.turban;
  const BEARD = [true, false, true, false, true, false][vi % RIDERS.length];
  const disc = (x, y, r = 2.3) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#E8B730" stroke="#8A6410" stroke-width=".6"/><circle cx="${x - r * .3}" cy="${y - r * .3}" r="${r * .38}" fill="#FFF3C0" opacity=".85"/>`;
  const CAP = 'M94 88 C116 84 140 92 160 88 C168 86 174 84 181 84 C185 104 187 130 183 158 C160 163 116 164 94 158 C88 136 88 110 94 88 Z';
  let pat = '';
  if (v.pat === 'diamond') for (let x = 86; x < 190; x += 12) for (let y = 86; y < 166; y += 12) pat += `<path d="M${x} ${y} l6 -6 l6 6 l-6 6 Z" fill="${v.cap[1]}" opacity=".85"/>`;
  if (v.pat === 'stripe') for (let x = 86; x < 192; x += 10) pat += `<path d="M${x} 82 L${x + 2} 166" stroke="${(x / 10) % 2 ? v.cap[1] : v.cap[2]}" stroke-width="4"/>`;
  if (v.pat === 'check') for (let x = 86; x < 190; x += 10) for (let y = 84; y < 166; y += 10) if (((x + y) / 10) % 2 < 1) pat += `<rect x="${x}" y="${y}" width="10" height="10" fill="${v.cap[1]}" opacity=".8"/>`;
  if (v.pat === 'star') for (let x = 100; x < 186; x += 18) for (let y = 98; y < 160; y += 16) pat += `<path d="M${x} ${y - 5} l1.6 3.6 l3.9 .4 l-3 2.6 l.9 3.8 l-3.4 -2 l-3.4 2 l.9 -3.8 l-3 -2.6 l3.9 -.4 Z" fill="${v.cap[1]}"/>`;
  // the quilting: stitched diagonals over the whole cloth, each with a lit edge
  let quilt = ''; for (let x = 30; x < 250; x += 9) quilt += `M${x} 80 l44 90 M${x + 44} 80 l-44 90 `;
  let fringe = ''; for (let x = 97, k = 0; x <= 182; x += 5.5, k++) { const y = +(158 + 4 * Math.sin(Math.PI * (x - 94) / 89)).toFixed(1); fringe += tassel(x, y - 1, k % 2 ? v.cap[1] : v.cap[2], 9); }
  /* the mane: locks falling from the crest down the near side of the neck */
  let maneS = ''; for (let k = 0; k < 11; k++) {
    const t = .04 + k * .088, u = 1 - t, x = u * u * u * 166 + 3 * u * u * t * 170 + 3 * u * t * t * 186 + t * t * t * 208, y = u * u * u * 92 + 3 * u * u * t * 70 + 3 * u * t * t * 50 + t * t * t * 38;
    const X = x.toFixed(1), Y = y.toFixed(1), len = 15 + [0, 5, 2, 7, 3, 6, 1, 5, 3, 6, 2][k];
    maneS += `<path d="M${(x - 3).toFixed(1)} ${(y - 1).toFixed(1)} C${(x - 1).toFixed(1)} ${(y + 5).toFixed(1)} ${(x - 1).toFixed(1)} ${(y + len * .6).toFixed(1)} ${(x - 5).toFixed(1)} ${(y + len).toFixed(1)} C${(x + 1.5).toFixed(1)} ${(y + len * .7).toFixed(1)} ${(x + 3.5).toFixed(1)} ${(y + 5).toFixed(1)} ${(x + 3).toFixed(1)} ${(y - 1.5).toFixed(1)} Z" fill="${mane}"/>` +
      `<path d="M${X} ${Y} C${(x + .5).toFixed(1)} ${(y + 5).toFixed(1)} ${(x).toFixed(1)} ${(y + len * .6).toFixed(1)} ${(x - 2.5).toFixed(1)} ${(y + len * .85).toFixed(1)}" stroke="${tone(mane, .3)}" stroke-width=".7" fill="none" opacity=".7"/>`;
  }
  maneS = `<path d="M166 93 C170 70 186 50 208 37 L211 45 C194 56 181 74 177 97 Z" fill="${mane}"/>` + maneS;
  let tailS = ''; for (let k = 0; k < 6; k++) tailS += `<path d="M88 96 C76 104 ${68 - k} ${126 + k * 2} ${56 + k * 3.4} ${166 + k * 3}" stroke="${tone(mane, .28)}" stroke-width=".8" fill="none" opacity=".6"/>`;
  /* (r3/r4, Sani 2026-10-27 "more real") a horse's leg, not a post: the forearm or the gaskin full and muscled, the knee
     (front) or the point of the hock (hind) standing out, the slim cannon bone with its tendon, the round fetlock with its
     tuft of hair, the pastern sloping forward into a hoof with a lighter wall; the hoof moves with its leg. A white sock on some. */
  const SOCK = [false, true, false, true, false, false][vi % RIDERS.length];
  const leg = (cls, x, front, near) => {
    const d = front
      ? `M${x - 8} 128 C${x - 10} 142 ${x - 8} 154 ${x - 6} 164 Q${x - 7.5} 170 ${x - 5} 174 C${x - 4} 184 ${x - 4} 191 ${x - 4} 197 Q${x - 5.5} 202 ${x - 1} 205 L${x + 8} 205 Q${x + 7} 200 ${x + 4} 196 C${x + 4} 189 ${x + 4} 182 ${x + 5} 175 Q${x + 8} 170 ${x + 7} 164 C${x + 9} 152 ${x + 10} 140 ${x + 9} 128 Z`
      : `M${x - 12} 124 C${x - 16} 140 ${x - 14} 152 ${x - 11} 162 Q${x - 12.5} 170 ${x - 8} 175 C${x - 6} 184 ${x - 5} 191 ${x - 5} 197 Q${x - 6.5} 202 ${x - 2} 205 L${x + 7} 205 Q${x + 6} 200 ${x + 3} 196 C${x + 2.6} 189 ${x + 2.4} 182 ${x + 3} 173 C${x + 6} 164 ${x + 10} 152 ${x + 12} 140 C${x + 13} 132 ${x + 12} 128 ${x + 10} 122 Z`;
    const sock = SOCK && near ? `<path d="M${x - 5} 186 C${x - 4} 191 ${x - 4} 194 ${x - 4} 197 Q${x - 5.5} 202 ${x - 1} 205 L${x + 7.5} 205 Q${x + 6.5} 200 ${x + 3.6} 196 C${x + 3.6} 192 ${x + 3.6} 189 ${x + 4} 186 Z" fill="#F2EEE6"/><path d="M${x + 2.6} 187 C${x + 2.6} 194 ${x + 3.4} 199 ${x + 6} 204" stroke="#000" stroke-opacity=".12" stroke-width="1.6" fill="none"/>` : '';
    return `<g class="lg ${cls}"><path d="${d}" fill="url(#${id}${near ? 'c' : 'f'})"/>${sock}` +
      // the far edge in shade, the tendon down the back of the cannon, the knee or hock catching the light
      `<path d="M${x + (front ? 7 : 9)} ${front ? 134 : 132} C${x + (front ? 8 : 10)} 150 ${x + (front ? 6 : 4)} 166 ${x + 4} 176 L${x + 3.4} 196" stroke="#000" stroke-opacity=".2" stroke-width="2.2" fill="none" stroke-linecap="round"/>` +
      `<path d="M${x - 2.6} 178 C${x - 2.2} 186 ${x - 2.2} 192 ${x - 2.6} 197" stroke="#fff" stroke-opacity=".16" stroke-width="1.2" fill="none"/>` +
      (front ? `<ellipse cx="${x + 1.6}" cy="170" rx="4.4" ry="3.6" fill="#fff" opacity=".1"/>` : `<path d="M${x - 11} 166 Q${x - 11} 172 ${x - 7} 175" stroke="#fff" stroke-opacity=".2" stroke-width="1.2" fill="none"/>`) +
      `<path d="M${x - 4.5} 199 q-2.2 4 .6 6.4" stroke="${mane}" stroke-width="1.6" fill="none" opacity=".7"/>` +
      `<path d="M${x - 2.4} 204 h10.4 l2.6 7 h-15 Z" fill="url(#${id}v)"/><path d="M${x - 2.4} 204 h10.4 l.6 1.8 h-11.2 Z" fill="#6A5646"/><path d="M${x + 6.6} 205 l2.2 6" stroke="#fff" stroke-opacity=".2" stroke-width=".8"/></g>`;
  };
  const sword = v.spear
    ? `<path d="M110.6 33 L122.4 -22" stroke="#6B4422" stroke-width="2.4" stroke-linecap="round"/><path d="M110.6 33 L122.4 -22" stroke="#fff" stroke-opacity=".2" stroke-width=".7"/><path d="M121.6 -21 C121 -26 122.6 -32 125.4 -36 C126.4 -31 125.8 -25 123.8 -20.6 Z" fill="url(#k4-steel)"/><path d="M121.4 -20.6 l3 .7" stroke="#C9A227" stroke-width="2"/>${tassel(121.6, -19.4, v.trim, 7)}`
    : `<path d="M111.6 10 L97.4 -18.6 L94.6 -22.6 L93.6 -17.4 L106.6 12.6 Z" fill="url(#k4-steel)" stroke="#4E565E" stroke-width=".7" stroke-linejoin="round"/><path d="M108.6 11 L95.8 -17.6" stroke="#5E6670" stroke-width=".5" opacity=".7"/><path d="M104 13.6 L114.6 8.6" stroke="#C9A227" stroke-width="2.4" stroke-linecap="round"/><path d="M114 17.6 L116.4 21.6" stroke="#3A2410" stroke-width="2.2"/><circle cx="117" cy="22.6" r="1.7" fill="#C9A227"/>`;
  return `<svg class="rider dur" viewBox="-54 -116 316 342" aria-hidden="true"><defs>` +
    `<linearGradient id="${id}c" gradientUnits="userSpaceOnUse" x1="110" y1="40" x2="160" y2="212"><stop offset="0" stop-color="${tone(v.coat[0], .16)}"/><stop offset=".42" stop-color="${v.coat[0]}"/><stop offset="1" stop-color="${v.coat[1]}"/></linearGradient>` +
    `<linearGradient id="${id}f" gradientUnits="userSpaceOnUse" x1="110" y1="40" x2="160" y2="212"><stop offset="0" stop-color="${tone(v.coat[0], -.22)}"/><stop offset="1" stop-color="${tone(v.coat[1], -.3)}"/></linearGradient>` +
    `<radialGradient id="${id}h"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>` +
    `<linearGradient id="${id}k" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".24"/><stop offset=".42" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".34"/></linearGradient>` +
    `<linearGradient id="${id}r" x1="0" y1="0" x2="1" y2=".35"><stop offset="0" stop-color="#fff" stop-opacity=".26"/><stop offset=".48" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>` +
    `<radialGradient id="${id}s" cx=".36" cy=".34" r=".78"><stop offset="0" stop-color="${tone(sk, .2)}"/><stop offset=".55" stop-color="${sk}"/><stop offset="1" stop-color="${skd}"/></radialGradient>` +
    `<linearGradient id="${id}t" x1="0" y1="0" x2="1" y2=".4"><stop offset="0" stop-color="${tone(tur, .12)}"/><stop offset=".5" stop-color="${tur}"/><stop offset="1" stop-color="${tone(tur, -.24)}"/></linearGradient>` +
    `<linearGradient id="${id}v" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4A3E36"/><stop offset="1" stop-color="#17110D"/></linearGradient>` +
    `<clipPath id="${id}q"><path d="${CAP}"/></clipPath></defs>` +
    // the cast shadow falls to the right (the sun is high on the left); a darker touch where each hoof meets the sand
    `<ellipse cx="150" cy="211" rx="110" ry="8.5" fill="url(#k4-shadow)"/><g fill="#2A1A0A" opacity=".3"><ellipse cx="100" cy="211" rx="9" ry="2"/><ellipse cx="116" cy="210" rx="8" ry="1.8"/><ellipse cx="183" cy="211" rx="9" ry="2"/><ellipse cx="197" cy="210" rx="8" ry="1.8"/></g>` +
    `<g class="dust"><circle cx="96" cy="206" r="7"/><circle cx="114" cy="207" r="6"/><circle cx="180" cy="206" r="7"/><circle cx="194" cy="207" r="6"/></g>` +
    `<g class="hrs">` +
    /* the letter's banner (Sani 2026-10-23: "the flag with the letter must be huge"): a tall lance planted by the saddle,
       a big cream cloth edged in the rider's colours streaming back behind him, and the letter as large as the cloth allows */
    `<g class="flag"><path d="M116 -100 L120 112" stroke="#5E3A1C" stroke-width="4" stroke-linecap="round"/><path d="M114 -100 l2.5 -12 l2.5 12 Z" fill="#C9A227"/><circle cx="116.5" cy="-99" r="3" fill="#C9A227"/>` +
    `<g class="cloth"><path class="fglow" d="M115 -94 Q60 -104 -40 -92 Q-26 -40 -40 14 Q60 4 116 14 Z" fill="none" stroke="#FFD400" stroke-width="28" stroke-linejoin="round"/><path d="M115 -94 Q60 -104 -40 -92 Q-26 -40 -40 14 Q60 4 116 14 Z" fill="${v.flag[0]}"/>` +
    `<path d="M108 -84 Q58 -92 -26 -82 Q-14 -40 -26 4 Q58 -4 108 4 Z" fill="#FFFFFF"/>` +
    `<path d="M-40 -92 l-10 8 l10 6 M-40 14 l-10 -8 l10 -6" fill="${v.flag[1]}"/>` +
    `<path d="M115 -94 Q60 -104 -40 -92 M-40 14 Q60 4 116 14" stroke="${v.flag[1]}" stroke-width="4" fill="none"/>` +
    `<text x="41" y="-1" text-anchor="middle" class="flagL">${L}</text></g></g>` +
    // the tail: a full fall of hair from the dock, lit strands through it
    `<g class="tail"><path d="M90 92 C76 90 66 100 63 118 C60 136 58 154 50 172 C57 171 62 167 66 162 C67 169 66 176 62 184 C73 177 79 163 78 144 C78 126 82 110 94 100 Z" fill="${mane}"/>${tailS}` +
    `<path d="M92 91 C85 91 80 95 78 102 L84 105 C86 100 90 98 95 99 Z" fill="url(#${id}c)"/></g>` +
    leg('b', 114, false, false) +
    `<g class="fleg">` + leg('d', 193, true, false) + `</g>` +
    // the body: croup, back, withers, the deep chest, the belly and the round hindquarters
    `<path d="M86 92 C96 82 118 84 134 90 C150 94 164 88 176 80 L190 92 C200 102 206 114 204 126 C202 136 194 142 186 144 C170 148 140 150 120 146 C112 145 106 142 102 140 C90 140 80 128 80 112 C79 102 81 96 86 92 Z" fill="url(#${id}c)"/>` +
    `<ellipse cx="104" cy="104" rx="21" ry="16" fill="url(#${id}h)"/><ellipse cx="190" cy="110" rx="11" ry="18" fill="url(#${id}h)"/>` +
    `<path d="M84 110 C88 124 94 134 104 140 M120 128 C116 134 111 138 104 141 M178 92 C180 108 182 124 190 140 M197 117 C199 125 197 133 192 140" stroke="#000" stroke-opacity=".17" stroke-width="2.2" fill="none" stroke-linecap="round"/>` +
    `<path d="M120 146 C150 150 172 148 186 144 C178 140 150 142 120 140 Z" fill="#000" opacity=".22"/><path d="M87 92 C97 84 116 85 132 90" stroke="#fff" stroke-opacity=".24" stroke-width="2.4" fill="none" stroke-linecap="round"/>` +
    leg('a', 98, false, true) +
    `<g class="fleg">` + leg('c', 179, true, true) + `</g>` +
    /* the caparison (Sani 2026-10-27): a quilted cloth over the back, its own pattern under stitched diagonals, a broad
       embroidered border, the Hausa knot worked in the middle, soft folds, and a fringe of tassels along its hem */
    `<path d="${CAP}" fill="${v.cap[0]}"/><g clip-path="url(#${id}q)">${pat}` +
    `<path d="${quilt}" stroke="#000" stroke-opacity=".16" stroke-width=".7" fill="none"/>` +
    `<path d="M112 90 C110 120 108 140 106 162 L117 163 C116 140 116 118 117 90 Z M150 90 C152 120 152 140 150 163 L158 163 C160 140 160 118 158 90 Z" fill="#000" opacity=".1"/>` +
    `<path d="${CAP}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="12"/><path d="${CAP}" fill="none" stroke="${v.cap[2]}" stroke-width="11"/>` +
    `<path d="${CAP}" fill="none" stroke="${v.cap[1]}" stroke-width="6.4" stroke-dasharray=".9 2.4"/><path d="${CAP}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="1"/>` +
    `<path d="M134 114 C150 120 168 118 180 110 L182 126 C164 132 146 130 132 122 Z" fill="#000" opacity=".16"/></g>` +
    `<g transform="translate(136 128)"><circle r="12" fill="${tone(v.cap[0], -.18)}" stroke="${v.cap[2]}" stroke-width="1.6"/><g fill="none" stroke="${v.cap[2]}" stroke-width="2"><rect x="-6.4" y="-6.4" width="12.8" height="12.8"/><rect x="-6.4" y="-6.4" width="12.8" height="12.8" transform="rotate(45)"/><circle r="3"/></g>` +
    `<g fill="none" stroke="${v.cap[1]}" stroke-width=".7"><rect x="-6.4" y="-6.4" width="12.8" height="12.8"/><rect x="-6.4" y="-6.4" width="12.8" height="12.8" transform="rotate(45)"/></g></g>` +
    `<path d="${CAP}" fill="url(#${id}k)"/>` + fringe +
    disc(96, 92) + disc(138, 90) + disc(176, 88) + disc(96, 154) + disc(138, 158) + disc(178, 154) +
    // the breast collar across the chest, with brass bosses and tassels
    `<path d="M182 92 C190 104 198 116 203 128" stroke="#2A1A0A" stroke-opacity=".5" stroke-width="7.6" fill="none"/><path d="M182 92 C190 104 198 116 203 128" stroke="${v.cap[1]}" stroke-width="6" fill="none"/>` +
    `<path d="M182 92 C190 104 198 116 203 128" stroke="${v.cap[2]}" stroke-width="1.1" stroke-dasharray="1.4 1.8" fill="none"/>` +
    tassel(189, 105, v.cap[0], 9) + tassel(196, 115, v.cap[2], 9) + tassel(201.5, 126, v.cap[0], 9) + disc(186, 99) + disc(193, 110) + disc(199, 121) +
    /* the head and neck (Sani 2026-10-27): the arched crest with its mane, the throat, the long head with a flat
       forehead, the big round cheek, an eye under its bony brow, the flared nostril and soft muzzle, two pricked ears;
       the quilted Durbar headstall with its brass, a plume on the poll */
    `<g class="hhead"><path d="M216 38 C216 30 219 24 223 19 C225 25 224.6 31 221.6 39 Z" fill="${tone(v.coat[1], -.2)}"/>` +
    `<path d="M166 92 C170 70 186 50 208 37 C214 39 219 46 222 56 C220 66 214 72 210 80 C206 92 204 106 204 122 L184 122 Z" fill="url(#${id}c)"/>` +
    `<path d="M172 86 C178 66 192 50 208 40" stroke="#fff" stroke-opacity=".2" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M219 64 C212 76 207 92 206 116" stroke="#000" stroke-opacity=".13" stroke-width="4" fill="none" stroke-linecap="round"/>` +
    `<path d="M208 38 C214 33 222 34 228 40 L247 60 C252 64 255 69 253 73 C252 77 247 79 243 78 L240 77 C236 77 232 75 229 73 C221 72 213 66 212 57 C211 50 209 44 208 38 Z" fill="url(#${id}c)"/>` +
    `<path d="M222 49 C216 52 214 58 218 65 C222 70 228 71 231 69" stroke="#000" stroke-opacity=".16" stroke-width="1.6" fill="none"/><path d="M212 40 C218 37 224 38 230 43 L246 59" stroke="#fff" stroke-opacity=".24" stroke-width="2" fill="none" stroke-linecap="round"/>` +
    `<ellipse cx="248.6" cy="70" rx="6" ry="6.4" fill="#000" opacity=".16"/><path d="M247 63 C250 62 252.4 64 251.4 67.4 C250.4 66 248.6 65.4 247.2 66 Z" fill="${ink}"/><path d="M246.4 61.8 C249.6 60.4 253 62.4 252.6 66" stroke="#fff" stroke-opacity=".25" stroke-width=".8" fill="none"/>` +
    `<path d="M252.6 73.4 C249.6 74.8 246.4 74.8 243.4 74.4" stroke="${ink}" stroke-width=".8" fill="none" opacity=".7"/>` +
    `<path d="M219.4 44.8 C221 42.2 225 41.4 228.2 43" stroke="#000" stroke-opacity=".3" stroke-width="1.4" fill="none"/><path d="M220.4 46.4 Q224.2 43.2 228.6 45.8 Q224.6 49.4 220.4 46.4 Z" fill="${ink}"/><path d="M221.8 46.2 Q224.4 44.6 227 45.6" stroke="#5A3A20" stroke-width=".8" fill="none"/><circle cx="225.6" cy="45.4" r=".75" fill="#fff" opacity=".9"/>` +
    `<path d="M210 38 C207 30 208 24 212 17 C216 22 218 29 216.4 38 Z" fill="url(#${id}c)"/><path d="M211.4 33 C210.6 28 211.2 24 212.4 21 C214 25 214.6 29 214.2 33" stroke="#000" stroke-opacity=".3" stroke-width="1.2" fill="none"/>` +
    maneS + `<path d="M216 37 C220 40 223 44 222 49 C220 45 217 42 214 41 Z" fill="${mane}"/>` +
    // the headstall: a quilted face panel down the forehead, brow band, cheek strap, noseband, the bit ring
    `<path d="M212.6 38.4 L227 37.4 L246.4 57.8 L242.8 60.6 L230 44.2 L221 41.6 Z" fill="${v.cap[0]}"/><path d="M217 39.4 L244.6 59.2 M222 38.2 L226 41.6 M228 39.8 L230.6 43.4 M233.4 45 L236.6 44.2 M238.4 50.6 L241.4 49.8" stroke="#000" stroke-opacity=".22" stroke-width=".6"/>` +
    `<path d="M212.6 38.4 L227 37.4 L246.4 57.8 L242.8 60.6 L230 44.2 L221 41.6 Z" fill="none" stroke="${v.cap[2]}" stroke-width="1.4"/>` +
    `<path d="M209 41 C212 52 214 62 222 68 M213 42 L246.4 72.4 M244.6 56.4 C240.6 62 237 68 235.4 76" stroke="${v.cap[1]}" stroke-width="2.6" fill="none"/><path d="M213 42 L246.4 72.4" stroke="${v.cap[2]}" stroke-width=".7" stroke-dasharray="1 1.4"/>` +
    disc(233.4, 45.6, 1.7) + disc(240, 52.8, 1.5) + disc(219, 39.6, 1.5) + `<circle cx="247" cy="73" r="2.4" fill="none" stroke="#C9A227" stroke-width="1.2"/>` +
    `<path d="M207 36 C211 30 220 30 226 35 L224.4 39.6 C218 36 213 36 208.6 40 Z" fill="${v.cap[1]}"/><path d="M208 37 C212 32 219 32 225 36.4" stroke="${v.cap[2]}" stroke-width=".8" stroke-dasharray="1 1.2" fill="none"/>` +
    tassel(212, 66, v.cap[2], 8) + tassel(216.4, 69, v.cap[0], 8) + tassel(220.6, 71, v.plume, 8) +
    `<path class="plume" d="M215 34 C206 22 205 6 213 -8 C215.6 4 222 16 219 34 Z" fill="${v.plume}"/><path d="M216.6 32 C212 20 211.6 8 213.2 -4 M214.6 22 l-4.6 -3 M214 14 l-4 -3.4 M214 6 l-3 -3.6 M216 24 l4 -3 M215.4 16 l3.6 -3.2" stroke="${tone(v.plume, -.25)}" stroke-width=".8" fill="none"/><path d="M211.6 18 C210.6 10 211 2 213 -6" stroke="#fff" stroke-opacity=".35" stroke-width="1" fill="none"/></g>` +
    // the reins from the bit to his hand
    `<path d="M246 73.4 C224 82 196 84 167 73 M246 74 C226 86 200 90 168 76" stroke="#3A2410" stroke-width="1.4" fill="none"/>` +
    // the high Hausa saddle: cantle behind him, the tall pommel before him
    `<path d="M117 92 C115 82 115 72 119.6 66 C124.4 65.6 126.4 70 126.2 76 L128 92 Z" fill="#6B3E1E"/><path d="M118.6 70 C120.6 66.6 124 66.6 125.6 70" stroke="#C9A227" stroke-width="2" fill="none" stroke-linecap="round"/>` +
    `<path d="M156 92 C158 80 160 72 166 64 C170.4 63.6 171.4 68 169 74 C166 80 164 86 164 94 Z" fill="#6B3E1E"/><circle cx="167.4" cy="64.6" r="2.4" fill="#C9A227"/><path d="M160 80 C162 74 164 70 166.6 66.6" stroke="#fff" stroke-opacity=".22" stroke-width="1.2" fill="none"/>` +
    /* the horseman (Sani 2026-10-27 "more real"): seated deep in the saddle, his near leg down the horse's side, foot in
       the wide Hausa stirrup; the babban riga's great sleeves and folds, the embroidered breast; a real face turned to the
       emir under his wound turban; the far arm raised with sword or spear in salute, the near hand on the reins */
    `<g class="rider2">` +
    `<g class="sword"><path d="M140 40 C130 35 122 26 116.6 18 L113.2 21 C114 31 118.4 41 127 49 Z" fill="${v.robe}"/><path d="M140 40 C130 35 122 26 116.6 18 L113.2 21 C114 31 118.4 41 127 49 Z" fill="#000" opacity=".18"/>` +
    `<path d="M118 27 C122 35 127 41 134 44" stroke="#000" stroke-opacity=".18" stroke-width="1" fill="none"/>` + sword +
    `<path d="M113 19.6 L117.6 15.8 L120.4 19.8 L116 23.4 Z" fill="${sk}"/>` + fist(113.4, 15.4, sk, -62, 1.05) + `</g>` +
    `<path d="M146 92 L157.6 134" stroke="#3A2410" stroke-width="2.2"/>` +
    `<path d="M159 100 L172 102 L169 128 L156.6 128 Z" fill="#EDE6D6"/><path d="M166 104 L164.6 127" stroke="#000" stroke-opacity=".14" stroke-width="2"/>` +
    `<path d="M155.6 123 L168.6 124.4 C168.4 129.6 168.6 133.4 170.6 135.6 L178 137.6 C180.4 139 179.8 141.6 176.6 141.8 L155.6 141.8 C154.8 136 154.8 129.6 155.6 123 Z" fill="#7A2E14"/>` +
    `<path d="M157 126 C156.6 131 156.8 136 157.6 140" stroke="#fff" stroke-opacity=".24" stroke-width="1.2" fill="none"/><path d="M156 127 L168.4 128" stroke="#E8B730" stroke-width="1" stroke-dasharray="1 1.2"/>` +
    `<path d="M152.4 141.6 L182.4 141.6 L178.6 146 L154.6 146 Z" fill="url(#k4-steel)"/><path d="M157.6 134 L155.6 141.6" stroke="#8A939C" stroke-width="1.8"/>` +
    `<path d="M128 40 C122 50 118 66 118 84 C116 94 113 104 114 114 C124 118 140 120 156 118 C166 116 174 112 176 106 C174 100 170 98 166 97 C160 94 156 86 155 76 C155 64 155 50 151 42 C145 38 134 38 128 40 Z" fill="${v.robe}"/>` +
    `<path d="M128 40 C122 50 118 66 118 84 C116 94 113 104 114 114 C124 118 140 120 156 118 C166 116 174 112 176 106 C174 100 170 98 166 97 C160 94 156 86 155 76 C155 64 155 50 151 42 C145 38 134 38 128 40 Z" fill="url(#${id}r)"/>` +
    `<path d="M126 50 C122 70 120 90 120 112 M136 62 C134 82 132 100 130 116 M150 84 C156 96 164 104 172 108 M141 96 C146 106 150 112 152 118 M158 100 C162 106 166 110 170 112" stroke="#000" stroke-opacity=".15" stroke-width="1.3" fill="none" stroke-linecap="round"/>` +
    `<path d="M131 46 C127 64 125 84 125 108 M146 92 C152 100 158 106 164 109" stroke="#fff" stroke-opacity=".26" stroke-width="1.2" fill="none" stroke-linecap="round"/>` +
    `<path d="M114 114 C124 118 140 120 156 118 C166 116 174 112 176 106" stroke="${robeD}" stroke-width="1.6" fill="none"/>` +
    // the breast embroidery: the two knives (aska biyu) and the spiral, in the trim colour
    `<path d="M150.6 43 C149 56 149 68 151 80" stroke="${v.trim}" stroke-width="1.6" fill="none"/><path d="M143.6 46 L149.2 46 L146.8 72 Z M137.6 48 L142.6 48 L140.6 66 Z" fill="none" stroke="${v.trim}" stroke-width="1"/>` +
    `<path d="M144.8 49 L148 49 L146.6 64 Z M138.6 51 L141.6 51 L140.6 60 Z" fill="${v.trim}" opacity=".55"/><path d="M142 76 m-3 0 a3 3 0 1 1 3 3 a1.8 1.8 0 1 1 -1.8 -1.8" stroke="${v.trim}" stroke-width=".9" fill="none"/>` +
    `<path d="M133 41 C139 44.6 147 44.6 152 40.4" stroke="${v.trim}" stroke-width="1.4" fill="none" stroke-dasharray="1.6 1"/>` +
    // the near arm: the wide sleeve hanging from it, the hand closed on the reins
    `<path d="M140 42 C150 46 156 56 158 66 L166 70 C168 74 166 78 162 80 C154 88 144 90 136 86 C134 74 134 56 140 42 Z" fill="${v.robe}"/><path d="M140 42 C150 46 156 56 158 66 L166 70 C168 74 166 78 162 80 C154 88 144 90 136 86 C134 74 134 56 140 42 Z" fill="url(#${id}r)"/>` +
    `<path d="M142 50 C140 64 140 76 142 86 M150 60 C152 70 156 76 160 79" stroke="#000" stroke-opacity=".16" stroke-width="1.2" fill="none"/><path d="M158 66 L166 70 C168 74 166 78 162 80 C160 76 158.4 72 158 66 Z" fill="#000" opacity=".25"/>` +
    `<path d="M136 86 C144 90 154 88 162 80" stroke="${v.trim}" stroke-width="1.3" fill="none"/>` + fist(166.6, 72.4, sk, -12, 1.05) +
    // the neck, the face (eyes with their whites and lids, brows, the nose and its nostril, the lips), his ear
    `<path d="M137.4 26 L148.6 28 L149.4 39 L137.6 39.4 Z" fill="${skd}"/>` +
    `<path d="M133.5 14 C134 9 140 7 145.5 8 C150 9 151.8 13 151.6 17 L152.2 19.8 C153.6 21.6 153.8 23.2 152.4 24 C152.2 27 150.2 30.2 146.6 30.8 C142.6 31.4 138.6 29.4 136.6 26.6 C134.4 24.6 133 19.6 133.5 14 Z" fill="url(#${id}s)"/>` +
    `<path d="M137 26.6 C140 30 144 31.2 147.6 30.6 C143.6 30.4 140 28.8 137.6 25.6 Z" fill="#000" opacity=".18"/><path d="M151 17.4 C151.6 20 152.6 22 152 23.6" stroke="${skd}" stroke-width=".6" fill="none" opacity=".8"/>` +
    `<path d="M135.4 16.4 C133.2 15.8 132.4 19 133 21.6 C133.6 23.6 135.2 24.2 136.6 23 Z" fill="${sk}"/><path d="M135.4 18 C134.4 18.6 134.4 20.6 135.4 21.8" stroke="${skd}" stroke-width=".6" fill="none"/>` +
    `<ellipse cx="151.2" cy="23.6" rx=".9" ry=".5" fill="#2A170B"/><path d="M150 22.4 Q149.4 24 150.8 24.5" stroke="${skd}" stroke-width=".5" fill="none"/>` +
    `<path d="M144.4 26.3 Q147 25.4 150.2 26 Q147.2 26.8 144.4 26.3 Z" fill="${tone(sk, -.42)}"/><path d="M144.8 26.7 Q147.4 28.3 150 26.5 Q147.4 27.3 144.8 26.7 Z" fill="${tone(sk, -.12)}"/>` +
    (BEARD ? `<path d="M136.8 25.4 C138 29.6 142.4 32 146.6 31.8 C150 31.4 152.2 28.8 152.4 26 C151.2 28.4 149.6 29.2 147.6 29.2 C146 29 145.6 28.6 144.6 28.8 C141.6 29.2 139 27.6 136.8 25.4 Z" fill="#1E140D"/><path d="M144 25.8 Q147.4 24.4 150.8 25.4 Q147.6 25.6 144 26.2 Z" fill="#1E140D"/>` : '') +
    `<g class="r-eyes-happy"><path d="M140.8 18.7 Q143.2 17.2 145.6 18.5 Q143.2 20 140.8 18.7 Z" fill="#F2ECE2"/><circle cx="143.9" cy="18.6" r="1.05" fill="#2A170B"/><circle cx="144.2" cy="18.2" r=".3" fill="#fff"/>` +
    `<path d="M148.2 18.5 Q149.6 17.4 150.9 18.3 Q149.6 19.4 148.2 18.5 Z" fill="#F2ECE2"/><circle cx="150" cy="18.4" r=".82" fill="#2A170B"/>` +
    `<path d="M140.6 18.6 Q143.2 16.8 145.8 18.4 M148 18.4 Q149.6 17.1 151.1 18.1" stroke="${ink}" stroke-width=".7" fill="none" stroke-linecap="round"/><path d="M141.2 19.6 Q143.2 20.4 145.2 19.4" stroke="${skd}" stroke-width=".4" fill="none"/>` +
    `<path d="M140.2 15.4 Q142.8 13.8 145.4 14.8 M147.8 14.8 Q149.6 14.2 151 15" stroke="${ink}" stroke-width="1" fill="none" stroke-linecap="round"/></g>` +
    `<g class="r-eyes-sad"><path d="M140.8 18.9 Q143.2 18 145.6 18.7 Q143.2 20 140.8 18.9 Z" fill="#F2ECE2"/><circle cx="143.6" cy="19.2" r=".9" fill="#2A170B"/><path d="M148.2 18.7 Q149.6 18 150.9 18.5 Q149.6 19.4 148.2 18.7 Z" fill="#F2ECE2"/><circle cx="149.7" cy="18.9" r=".7" fill="#2A170B"/>` +
    `<path d="M140.6 18.9 Q143.2 17.8 145.8 18.6 M148 18.6 Q149.6 17.8 151.1 18.4" stroke="${ink}" stroke-width=".9" fill="none" stroke-linecap="round"/>` +
    `<path d="M140.2 16 L145.2 14 M147.8 14.4 L151 15.6" stroke="${ink}" stroke-width="1" fill="none" stroke-linecap="round"/></g>` +
    `<path class="r-smile" d="M144.2 26.2 Q147.2 28 150.4 25.8" stroke="#3A1A0A" stroke-width=".9" fill="none" stroke-linecap="round"/>` +
    `<path class="r-frown" d="M144.2 27.4 Q147.2 25.8 150.4 27.4" stroke="#3A1A0A" stroke-width=".9" fill="none" stroke-linecap="round"/>` +
    // the turban wound round his head, its end brought down behind the ear and round the neck (and over the chin for some)
    `<path d="M132 13 C130 20 131 28 135 34 C137 37 141 38.6 145 38.4 L141.6 34.4 C137.6 32.4 135.6 27 135.6 21 Z" fill="url(#${id}t)"/>` +
    (v.veil ? `<path d="M135 21.4 C135.6 29 140 33.8 146.6 33.8 C150.6 33.6 153.4 30.8 153.8 27.4 C151.6 29.4 149.4 30.2 147 30 C142.6 29.6 139 26.6 137.6 21.4 Z" fill="url(#${id}t)"/><path d="M137 26 C140 30 144 32 149 31.6" stroke="#000" stroke-opacity=".14" stroke-width=".8" fill="none"/>` : '') +
    `<path d="M131.6 16 C129 7 132 -3 141.6 -4.6 C151 -5.6 156 1 154 11.6 C151.5 9.4 147.5 8 143 8.4 C138.4 8.8 134.6 11.6 131.6 16 Z" fill="url(#${id}t)"/>` +
    `<path d="M132.4 11 C138 4 148 2 154.4 6.4 M133 5.6 C139 -1 148 -2.4 153.6 1.4 M135.6 0 C140 -3.4 147 -4 151.4 -2" stroke="#000" stroke-opacity=".15" stroke-width=".9" fill="none"/>` +
    `<path d="M133 9.6 C138 3 147 1 153 4.6 M134.4 4 C139.4 -2 147 -3.2 152 -.4" stroke="#fff" stroke-opacity=".45" stroke-width=".6" fill="none"/>` +
    `</g></g></svg>`;
}

/*
 * The emir on his throne under the royal umbrella (r4, Sani 2026-10-27 "make the king more real"): a man of real
 * proportions seated, his white turban wound high with its two horns (kunne), its end wound under the chin; a face with
 * whites to the eyes and lids, brows, a nose with nostrils, lips and a short beard; the white babban riga with its heavy
 * gold embroidery and deep folds, a green alkyabba cloak over the shoulders; hands with fingers. A carved and gilded
 * throne on a carpeted dais, his feet on a cushion; the great umbrella's gores, embroidery and fringe above him.
 * Moving parts (gamelab.css): .e-head (turns away) · .e-pupils · .e-brow calm/cross · .e-smile/.e-frown ·
 * .e-rest (hands on knees; .e-armL the arm that rises) · .e-wave/.e-fore (the raised arm, the waving forearm) · .e-fold
 */
export function emirThrone(): string {
  const id = 'em' + (gid++), S2 = '#5E3A1C', skd = tone(S2, -.3), ink = '#1A0E06', G = '#C9A227', GD = '#8A6410';
  const ROBE = 'M74 130 C64 136 60 152 58 170 C56 186 54 204 52 218 Q76 224 100 219 Q124 224 148 218 C146 204 144 186 142 170 C140 152 136 136 126 130 C116 126 84 126 74 130 Z';
  // the umbrella: eight gores from the finial to the rim, red and green in turn, gold bands worked across them
  const xs = Array.from({ length: 9 }, (_, k) => 2 + k * 24.5), ry = (x) => (-12 + 26 * Math.abs(x - 100) / 98).toFixed(1), cx = (x) => (100 + (x - 100) * .55).toFixed(1);
  let gores = ''; for (let k = 0; k < 8; k++) { const a = xs[k], b = xs[k + 1];
    gores += `<path d="M100 -12 C${cx(a)} -12 ${a} ${ry(a)} ${a} 56 L${b} 56 C${b} ${ry(b)} ${cx(b)} -12 100 -12 Z" fill="${k % 2 ? '#1E6B3A' : '#C62828'}"/>`; }
  let ribs = ''; xs.forEach((x) => { ribs += `M100 -12 C${cx(x)} -12 ${x} ${ry(x)} ${x} 56 `; });
  let val = 'M2 56 L198 56 L198 64'; for (let k = 8; k > 0; k--) { const a = xs[k], b = xs[k - 1]; val += ` Q${((a + b) / 2).toFixed(1)} 74 ${b} 64`; } val += ' Z';
  let utas = ''; xs.forEach((x, k) => { utas += tassel(x, 63, k % 2 ? '#FFD54A' : G, 10); });
  let fringe = ''; for (let x = 6; x <= 194; x += 4) fringe += `<path d="M${x} 66 l0 ${(3 + (x % 3)).toFixed(1)}" stroke="#E8B730" stroke-width="1.1"/>`;
  let tufts = ''; for (let y = 100; y <= 160; y += 14) for (let x = 72; x <= 128; x += 14) tufts += `<circle cx="${x + ((y / 14) % 2 ? 7 : 0)}" cy="${y}" r="1.3" fill="${G}"/>`;
  let rug = ''; for (let x = 14; x < 186; x += 8) rug += `<path d="M${x} 236 l4 3 l4 -3" stroke="#E8B730" stroke-width=".9" fill="none"/>`;
  return `<svg class="emir dur" viewBox="0 0 200 250" aria-hidden="true"><defs>` +
    `<linearGradient id="${id}w" x1="0" y1="0" x2="1" y2=".3"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".45" stop-color="#F4F0E7"/><stop offset="1" stop-color="#C9C0AE"/></linearGradient>` +
    `<radialGradient id="${id}s" cx=".38" cy=".36" r=".75"><stop offset="0" stop-color="${tone(S2, .22)}"/><stop offset=".55" stop-color="${S2}"/><stop offset="1" stop-color="${skd}"/></radialGradient>` +
    `<linearGradient id="${id}g" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#F3D27A"/><stop offset=".5" stop-color="#C9962E"/><stop offset="1" stop-color="#7A5410"/></linearGradient>` +
    `<linearGradient id="${id}v" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stop-color="#B0302E"/><stop offset="1" stop-color="#5A1012"/></linearGradient>` +
    `<linearGradient id="${id}u" x1="0" y1="0" x2="1" y2=".5"><stop offset="0" stop-color="#fff" stop-opacity=".26"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".36"/></linearGradient>` +
    `<linearGradient id="${id}k" x1="0" y1="0" x2="1" y2=".4"><stop offset="0" stop-color="#2F8456"/><stop offset="1" stop-color="#12402A"/></linearGradient>` +
    `<clipPath id="${id}d"><path d="M2 56 C8 22 50 -12 100 -12 C150 -12 192 22 198 56 Z"/></clipPath></defs>` +
    `<ellipse cx="110" cy="245" rx="98" ry="7" fill="url(#k4-shadow)"/>` +
    // the dais under a carpet: its top, its front, a worked border
    `<path d="M18 233 L182 233 L193 242 L7 242 Z" fill="#8E1B1B"/><path d="M7 242 L193 242 L193 247 L7 247 Z" fill="#4A0E0E"/><path d="M14 236.2 L186 236.2" stroke="#1E6B3A" stroke-width="2.4"/>${rug}<path d="M18 233 L182 233" stroke="#fff" stroke-opacity=".2" stroke-width="1"/>` +
    // the umbrella's pole, then the umbrella
    `<rect x="98.4" y="50" width="3.2" height="40" fill="#4E2E14"/><rect x="98.4" y="50" width="1.2" height="40" fill="#fff" opacity=".2"/>` +
    `<g clip-path="url(#${id}d)">${gores}<path d="M0 50 Q100 2 200 50" stroke="#E8B730" stroke-width="3.4" fill="none"/><path d="M0 50 Q100 2 200 50" stroke="${GD}" stroke-width=".6" fill="none" stroke-dasharray="1.6 1.6"/>` +
    `<path d="M0 30 Q100 -22 200 30" stroke="#E8B730" stroke-width="1.6" fill="none" stroke-dasharray="3 2"/><path d="${ribs}" stroke="#E8B730" stroke-width=".9" fill="none" opacity=".8"/>` +
    `<path d="M2 56 C8 22 50 -12 100 -12 C150 -12 192 22 198 56 Z" fill="url(#${id}u)"/><ellipse cx="62" cy="10" rx="34" ry="16" fill="#fff" opacity=".1"/></g>` +
    `<path d="${val}" fill="#9E1B1B"/><path d="${val}" fill="url(#${id}u)"/><path d="M2 58.6 L198 58.6" stroke="#E8B730" stroke-width="1.2" stroke-dasharray="2 1.4"/><path d="${val}" fill="none" stroke="#E8B730" stroke-width="1"/>` + utas +
    `<path d="M100 -14 L100 -26" stroke="${G}" stroke-width="2"/><circle cx="100" cy="-14" r="5.4" fill="url(#${id}g)"/><circle cx="98.4" cy="-15.6" r="1.6" fill="#FFF3C0" opacity=".8"/>` +
    // the throne: a tall arched back, its gilded frame carved, red velvet buttoned with gold, a crest on top
    `<path d="M54 176 L54 98 C54 86 64 80 75 79 C83 70 91 66 100 66 C109 66 117 70 125 79 C136 80 146 86 146 98 L146 176 Z" fill="url(#${id}g)"/>` +
    `<path d="M62 176 L62 100 C62 92 68 87 77 87 C85 80 92 76 100 76 C108 76 115 80 123 87 C132 87 138 92 138 100 L138 176 Z" fill="url(#${id}v)"/>${tufts}` +
    `<path d="M62 100 C62 92 68 87 77 87 C85 80 92 76 100 76 C108 76 115 80 123 87" stroke="#000" stroke-opacity=".35" stroke-width="1.4" fill="none"/><path d="M56 98 C56 88 64 82 75 81 C83 72 91 68 100 68" stroke="#FFF3C0" stroke-opacity=".6" stroke-width="1" fill="none"/>` +
    // the arms of the throne, scrolled at the front, on turned posts
    `<path d="M38 148 C38 141 44 139 52 139 L66 139 L66 152 L46 152 C41 152 38 151 38 148 Z" fill="url(#${id}g)"/><circle cx="43.6" cy="145.4" r="5.4" fill="url(#${id}g)" stroke="${GD}" stroke-width=".8"/><path d="M43.6 145.4 m-2.4 0 a2.4 2.4 0 1 1 2.4 2.4" stroke="${GD}" stroke-width=".8" fill="none"/>` +
    `<path d="M162 148 C162 141 156 139 148 139 L134 139 L134 152 L154 152 C159 152 162 151 162 148 Z" fill="url(#${id}g)"/><circle cx="156.4" cy="145.4" r="5.4" fill="url(#${id}g)" stroke="${GD}" stroke-width=".8"/><path d="M156.4 145.4 m-2.4 0 a2.4 2.4 0 1 1 2.4 2.4" stroke="${GD}" stroke-width=".8" fill="none"/>` +
    `<path d="M44 152 L44 186 M50 152 L50 186 M150 152 L150 186 M156 152 L156 186" stroke="url(#${id}g)" stroke-width="3.6"/><path d="M42 160 h10 M42 172 h10 M148 160 h10 M148 172 h10" stroke="${GD}" stroke-width="2.4" stroke-linecap="round"/>` +
    // the seat's carved front rail and the cabriole legs on ball feet
    `<path d="M36 184 L164 184 L164 198 C150 202 136 198 124 202 C112 198 88 198 76 202 C64 198 50 202 36 198 Z" fill="url(#${id}g)"/><path d="M38 188.4 L162 188.4" stroke="${GD}" stroke-width="1"/><path d="M40 191.6 L160 191.6" stroke="#FFF3C0" stroke-width="1.1" stroke-dasharray="1.4 2.6" opacity=".7"/>` +
    `<path d="M40 198 C37 210 45 220 40 230 L50 230 C53 220 47 210 50 198 Z M160 198 C163 210 155 220 160 230 L150 230 C147 220 153 210 150 198 Z" fill="url(#${id}g)"/><circle cx="45" cy="231" r="3.6" fill="${GD}"/><circle cx="155" cy="231" r="3.6" fill="${GD}"/>` +
    // his feet in gold-worked slippers on a velvet cushion
    `<path d="M66 225 L134 225 C138 225 140 229 138 234 L62 234 C60 229 62 225 66 225 Z" fill="url(#${id}v)"/><path d="M64 226.6 L136 226.6" stroke="#E8B730" stroke-width="1"/>` + tassel(63, 231, '#E8B730', 7) + tassel(137, 231, '#E8B730', 7) +
    `<path d="M77 217 C75 221 77 226 85 226 L94 226 C96.4 222 95 217 90 217 Z M123 217 C125 221 123 226 115 226 L106 226 C103.6 222 105 217 110 217 Z" fill="#B8862B"/><path d="M80 222 h12 M108 222 h12" stroke="#7A5410" stroke-width=".8" stroke-dasharray="1 1"/>` +
    // the babban riga: falling wide over his knees, a U of cloth hanging between them, deep folds, a gold-worked hem
    `<path d="${ROBE}" fill="url(#${id}w)"/>` +
    `<ellipse cx="78" cy="180" rx="14" ry="7" fill="#fff" opacity=".3"/><ellipse cx="122" cy="180" rx="14" ry="7" fill="#fff" opacity=".15"/>` +
    `<path d="M82 186 Q100 204 118 186 M86 197 Q100 210 114 197 M64 176 C62 192 60 204 60 218 M70 188 C68 200 68 210 68 220 M136 176 C138 192 140 204 140 218 M130 188 C132 200 132 210 132 220 M100 206 L100 219" stroke="#000" stroke-opacity=".14" stroke-width="1.4" fill="none" stroke-linecap="round"/>` +
    `<path d="M52 218 Q76 224 100 219 Q124 224 148 218" stroke="${G}" stroke-width="2.2" fill="none"/><path d="M52.6 214.6 Q76 220.6 100 215.6 Q124 220.6 147.6 214.6" stroke="${G}" stroke-width=".9" fill="none" stroke-dasharray="1.6 1.4"/>` +
    // the breast: the V of the neck over the inner riga, and the great embroidery (the two knives, the spiral, the square)
    `<path d="M90 129 L100 148 L110 129 Z" fill="#EFEAE0"/><path d="M90 129 L100 148 L110 129" stroke="${G}" stroke-width="1.6" fill="none"/><path d="M93 131 L100 144 L107 131" stroke="${G}" stroke-width=".7" fill="none" stroke-dasharray="1.2 1"/>` +
    `<path d="M103.6 140 L110.6 140 L107.2 176 Z M112.6 138 L119.4 138 L116.2 168 Z" fill="none" stroke="${GD}" stroke-width="1.6"/><path d="M103.6 140 L110.6 140 L107.2 176 Z M112.6 138 L119.4 138 L116.2 168 Z" fill="${G}" opacity=".85"/>` +
    `<path d="M105.4 146 h3.6 M105.8 152 h2.8 M106.2 158 h2 M114.4 144 h3.4 M114.8 150 h2.6 M115.2 156 h2" stroke="#FFF3C0" stroke-width=".7"/>` +
    `<path d="${spiral(91, 160, 6)}" stroke="${G}" stroke-width="1.2" fill="none"/><circle cx="91" cy="160" r="7.6" fill="none" stroke="${G}" stroke-width=".8" stroke-dasharray="1.2 1.2"/>` +
    `<rect x="101" y="180" width="12" height="12" fill="none" stroke="${G}" stroke-width="1.2" transform="rotate(45 107 186)"/><rect x="104" y="183" width="6" height="6" fill="${G}" transform="rotate(45 107 186)"/>` +
    // the alkyabba: a green cloak over the shoulders, open down the front, its edge worked in gold
    `<path d="M72 130 C62 138 56 156 56 174 C56 190 56 204 56 216 L70 218 C68 200 68 178 72 160 C74 148 80 136 88 129 Z" fill="url(#${id}k)"/><path d="M128 130 C138 138 144 156 144 174 C144 190 144 204 144 216 L130 218 C132 200 132 178 128 160 C126 148 120 136 112 129 Z" fill="url(#${id}k)"/>` +
    `<path d="M88 129 C80 136 74 148 72 160 C68 178 68 200 70 218 M112 129 C120 136 126 148 128 160 C132 178 132 200 130 218" stroke="${G}" stroke-width="1.8" fill="none"/><path d="M60 170 C60 190 61 204 62 216 M140 170 C140 190 139 204 138 216" stroke="#000" stroke-opacity=".2" stroke-width="1.4" fill="none"/>` +
    // hands on his knees
    `<g class="e-rest"><g class="e-armL"><path d="M74 130 C64 136 60 150 60 162 C60 172 62 180 66 186 L84 184 C84 176 82 166 82 156 C82 146 80 138 78 132 Z" fill="url(#${id}w)"/><path d="M66 150 C66 162 68 172 70 182 M76 144 C76 156 78 168 80 182" stroke="#000" stroke-opacity=".14" stroke-width="1.2" fill="none"/><path d="M66 186 L84 184" stroke="${G}" stroke-width="1.4"/>` + restHand(75, 182, S2, 1.05, -1) + `</g>` +
    `<path d="M126 130 C136 136 140 150 140 162 C140 172 138 180 134 186 L116 184 C116 176 118 166 118 156 C118 146 120 138 122 132 Z" fill="url(#${id}w)"/><path d="M134 150 C134 162 132 172 130 182 M124 144 C124 156 122 168 120 182" stroke="#000" stroke-opacity=".16" stroke-width="1.2" fill="none"/><path d="M134 186 L116 184" stroke="${G}" stroke-width="1.4"/>` + restHand(125, 182, S2, 1.05, 1) + `</g>` +
    /* pleased (Sani 2026-10-23: "the king should wave hand in approval"): the arm toward the horseman rises, its wide
       sleeve falling back from it, and the open palm waves from the elbow; then it rests on his knee again */
    `<g class="e-wave"><path d="M80 132 C72 124 64 116 58 108 L52 114 C54 126 60 140 70 150 C76 148 80 140 80 132 Z" fill="url(#${id}w)"/><path d="M58 116 C62 128 66 138 72 146" stroke="#000" stroke-opacity=".16" stroke-width="1.2" fill="none"/><path d="M52 114 C54 126 60 140 70 150" stroke="${G}" stroke-width="1.3" fill="none"/>` +
    `<g class="e-fore"><path d="M60 112 C58 104 56 96 55.6 91 L50 91.4 C50.4 97 52 105 54 113 Z" fill="#EFEAE0"/><path d="M58.6 110 C57 103 55.6 97 55.2 92" stroke="#000" stroke-opacity=".14" stroke-width="1.4" fill="none"/><path d="M50 91.4 L55.6 91" stroke="${G}" stroke-width="1.2"/><path d="M53.6 92 L52.6 87" stroke="${S2}" stroke-width="6" stroke-linecap="round"/>` + palm(52.6, 87.4, S2, 1.05, 1) + `</g></g>` +
    // arms folded, each forearm in its sleeve across him
    `<g class="e-fold"><path d="M74 130 C64 138 60 152 64 166 C80 168 104 164 122 156 L120 146 C104 152 86 154 76 150 C76 142 76 136 78 132 Z" fill="url(#${id}w)"/>` +
    `<path d="M126 130 C136 138 140 152 136 168 C120 170 96 168 78 162 L80 152 C96 156 114 158 124 152 C124 144 124 136 122 132 Z" fill="#F4F0E7"/><path d="M126 130 C136 138 140 152 136 168 C120 170 96 168 78 162" stroke="#000" stroke-opacity=".14" stroke-width="1.2" fill="none"/>` +
    `<path d="M80 152 L78 162" stroke="${G}" stroke-width="1.4"/>` + fist(74.6, 157, S2, 90, 1.1) + `<path d="M120 146 L122 156" stroke="${G}" stroke-width="1.4"/>` + fist(125, 150.6, S2, -80, 1.05) + `</g>` +
    // the head: the wrapped end of the turban framing the face, the face, the turban and its two horns
    `<g class="e-head"><path d="M86 98 C84 112 88 126 100 129 C112 126 116 112 114 98 L109.6 100 C110.6 112 107 121.6 100 123.2 C93 121.6 89.4 112 90.4 100 Z" fill="url(#${id}w)"/>` +
    `<path d="M88 112 C90 120 94 125 100 126.4 M112 112 C110 120 106 125 100 126.4" stroke="#000" stroke-opacity=".12" stroke-width=".9" fill="none"/>` +
    `<path d="M90.5 102 C90 112 93.6 121.6 100 122.4 C106.4 121.6 110 112 109.5 102 C109 96 105 94 100 94 C95 94 91 96 90.5 102 Z" fill="url(#${id}s)"/>` +
    `<path d="M106 102 C108 110 106 118 101 121.8 C106 121 109.4 113 109.5 103 Z" fill="#000" opacity=".16"/>` +
    `<path d="M91 112 C92 118 95.6 122.6 100 123 C104.4 122.6 108 118 109 112 C107.8 117 104.6 120.6 100 120.8 C95.4 120.6 92.2 117 91 112 Z" fill="#2A2420" opacity=".88"/><path d="M96 115.2 Q100 113.8 104 115.2 Q100 115 96 115.7 Z" fill="#2A2420"/>` +
    `<path d="M92.6 106.1 Q95.2 104.5 97.8 106 Q95.2 107.6 92.6 106.1 Z M102.2 106 Q104.8 104.5 107.4 106.1 Q104.8 107.6 102.2 106 Z" fill="#F2ECE2"/>` +
    `<g class="e-pupils"><circle cx="95.4" cy="106" r="1.15" fill="#2B160A"/><circle cx="105" cy="106" r="1.15" fill="#2B160A"/><circle cx="95.8" cy="105.6" r=".35" fill="#fff"/><circle cx="105.4" cy="105.6" r=".35" fill="#fff"/></g>` +
    `<path d="M92.4 106 Q95.2 104.1 98 105.9 M102 105.9 Q104.8 104.1 107.6 106" stroke="${ink}" stroke-width=".85" fill="none" stroke-linecap="round"/><path d="M93 107 Q95.2 108 97.4 107 M102.6 107 Q104.8 108 107 107" stroke="${skd}" stroke-width=".4" fill="none"/>` +
    `<path class="e-brow calm" d="M92 103 Q95 101.6 98.2 102.6 M101.8 102.6 Q105 101.6 108 103" stroke="${ink}" stroke-width="1.15" fill="none" stroke-linecap="round"/>` +
    `<path class="e-brow cross" d="M92 101.8 L98.2 103.8 M108 101.8 L101.8 103.8" stroke="${ink}" stroke-width="1.3" fill="none" stroke-linecap="round"/>` +
    `<path d="M98.8 106.8 C98.4 109 98 110.6 97 112" stroke="${skd}" stroke-width=".7" fill="none" opacity=".8"/><path d="M96.6 112.2 Q97.4 113.6 99 113.2 Q100 113.8 101 113.2 Q102.6 113.6 103.4 112.2" stroke="${skd}" stroke-width=".7" fill="none"/>` +
    `<ellipse cx="98.6" cy="113" rx=".7" ry=".4" fill="#2A1408"/><ellipse cx="101.4" cy="113" rx=".7" ry=".4" fill="#2A1408"/><ellipse cx="100.2" cy="111.4" rx="1" ry=".6" fill="#fff" opacity=".16"/>` +
    `<path d="M96 116.4 Q98 115.6 100 116 Q102 115.6 104 116.4 Q100 117 96 116.4 Z" fill="${tone(S2, -.38)}"/><path d="M96.6 116.8 Q100 118.8 103.4 116.8 Q100 117.4 96.6 116.8 Z" fill="${tone(S2, -.1)}"/>` +
    `<path class="e-smile" d="M95.6 116.2 Q100 119 104.4 116.2" stroke="#2A1408" stroke-width=".9" fill="none" stroke-linecap="round"/>` +
    `<path class="e-frown" d="M95.6 117.6 Q100 115.4 104.4 117.6" stroke="#2A1408" stroke-width=".9" fill="none" stroke-linecap="round"/>` +
    `<path d="M87 74 C83.4 68.6 83.6 62 87.6 59.6 C92 57.6 96.4 61 98.4 69 Z" fill="url(#${id}w)"/><path d="M113 74 C116.6 68.6 116.4 62 112.4 59.6 C108 57.6 103.6 61 101.6 69 Z" fill="url(#${id}w)"/>` +
     `<path d="M87.4 62 C90.4 62 93.4 64.6 94.8 69 M112.6 62 C109.6 62 106.6 64.6 105.2 69" stroke="#000" stroke-opacity=".16" stroke-width=".9" fill="none"/>` +
    `<path d="M84 100 C80 88 82 72 92 66 C96 63.6 104 63.6 108 66 C118 72 120 88 116 100 C110 96.4 105 95 100 95 C95 95 90 96.4 84 100 Z" fill="url(#${id}w)"/>` +
    `<path d="M84.6 92 C92 84 106 80 116.4 86 M85 84 C92 76 104 72 114 74 M88 74 C94 68 104 66 110 68 M84 98 C92 92 104 90 115 92" stroke="#000" stroke-opacity=".13" stroke-width=".9" fill="none"/>` +
    `<path d="M84.4 89 C92 81 104 77.4 113 80 M86 79 C92 72 102 69.4 110 70.6" stroke="#fff" stroke-width=".8" fill="none"/></g>` +
    `</svg>`;
}

/* the Sallah around them: kakaki players with their long trumpets, a drummer, the emir's guards (dogarai) */
export function sallahBand(): string {
  const man = (x, robe, hat, inner) => `<g transform="translate(${x} 0)"><path d="M-7 60 L-5 30 Q0 24 5 30 L7 60 Z" fill="${robe}"/><circle cx="0" cy="22" r="5" fill="#5E3A1C"/>` +
    `<path d="M-6 20 Q0 10 6 20 Z" fill="${hat}"/>${inner}</g>`;
  const kakaki = (x, robe) => man(x, robe, '#FFFFFF', `<g class="kakaki"><path d="M3 30 L34 -14" stroke="#D9B44A" stroke-width="2.4"/><path d="M32 -12 l8 -10 l4 6 Z" fill="#E8C35A"/><path d="M2 32 L-3 38 M4 30 Q8 34 10 26" stroke="${robe}" stroke-width="3" stroke-linecap="round"/></g>`);
  const drummer = (x) => man(x, '#B71C1C', '#FFD54A', `<g class="drumarm"><ellipse cx="9" cy="42" rx="5" ry="7" fill="#8B5A2B"/><ellipse cx="9" cy="36" rx="5" ry="1.6" fill="#F1E2C0"/><path d="M4 30 Q12 26 14 32" stroke="#B71C1C" stroke-width="3" fill="none"/></g>`);
  const dogari = (x) => man(x, '#C62828', '#2E7D32', `<path d="M-6 36 h12 M-6 44 h12" stroke="#2E7D32" stroke-width="3"/><path d="M9 0 L9 62" stroke="#6B4422" stroke-width="1.6"/><path d="M7 2 l2 -8 l2 8 Z" fill="#B0BEC5"/>`);
  return `<svg class="sallah" viewBox="0 -28 220 92" aria-hidden="true">${dogari(14)}${kakaki(44, '#C62828')}${kakaki(76, '#2E7D32')}${drummer(110)}${kakaki(140, '#1565C0')}${dogari(200)}</svg>`;
}

/*
 * The emir's court at the palace gate (Sani 2026-10-23: "where is his entourage, the person fanning him, his guards"):
 * two dogarai in the palace guard's red and green, spear in hand and sword at the hip, and his attendant waving a big
 * leather fan over him. Each is its own drawing so the court can be laid out around the throne in the page.
 * Moving parts: .fan (the fan sweeps), .tassel (the spear's tassel sways), .dg-salute (the spear lifts when he is pleased).
 */
export function dogari(v = 0): string {
  const sk = SKIN[(v + 2) % SKIN.length], id = 'dg' + (gid++), skd = tone(sk, -.32), ink = '#1A0E06', R = '#B71C1C', GR = '#1B5E20';
  const robe = 'M28 92 C20 110 16 140 16 180 C16 206 14 226 12 242 Q46 250 78 242 C76 226 74 206 74 180 C74 140 70 110 62 92 C54 88 36 88 28 92 Z';
  // the robe's panels, red and green in turn, fanning out from the shoulders to the hem
  let strips = ''; for (let k = 0; k < 6; k++) { const a = 26 + k * 6.4, b = a + 6.4, A = 8 + k * 12.4, B = A + 12.4;
    strips += `<path d="M${a} 86 L${b} 86 L${B} 252 L${A} 252 Z" fill="${k % 2 ? GR : R}"/><path d="M${b} 86 L${B} 252" stroke="#E8B730" stroke-width=".8"/>`; }
  return `<svg class="dogari dur" viewBox="0 0 90 262" aria-hidden="true"><defs>` +
    `<linearGradient id="${id}o" x1="0" y1="0" x2="1" y2=".2"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".34"/></linearGradient>` +
    `<radialGradient id="${id}s" cx=".38" cy=".36" r=".75"><stop offset="0" stop-color="${tone(sk, .22)}"/><stop offset=".55" stop-color="${sk}"/><stop offset="1" stop-color="${skd}"/></radialGradient>` +
    `<linearGradient id="${id}t" x1="0" y1="0" x2="1" y2=".3"><stop offset="0" stop-color="#E0453A"/><stop offset=".5" stop-color="${R}"/><stop offset="1" stop-color="#7A1010"/></linearGradient>` +
    `<clipPath id="${id}r"><path d="${robe}"/></clipPath></defs>` +
    `<ellipse cx="52" cy="251" rx="40" ry="6" fill="url(#k4-shadow)"/><ellipse cx="44" cy="251" rx="20" ry="2.4" fill="#2A1A0A" opacity=".28"/>` +
    // the spear first, held upright in the right hand, with its red tassel
    `<g class="dg-spear"><path d="M74 248 L74 14" stroke="#6B4422" stroke-width="3"/><path d="M73 248 L73 14" stroke="#fff" stroke-opacity=".22" stroke-width=".8"/>` +
    `<path d="M74 -6 C71 2 71 10 72 16 L76 16 C77 10 77 2 74 -6 Z" fill="url(#k4-steel)"/><path d="M74 -4 L74 15" stroke="#6E7882" stroke-width=".5"/><path d="M70 18 h8" stroke="#C9A227" stroke-width="3"/>` +
    `<g class="tassel"><path d="M74 20 q-6 8 -4 18 M74 20 q0 9 2 18 M74 20 q6 8 6 16" stroke="${R}" stroke-width="2.6" fill="none" stroke-linecap="round"/></g></g>` +
    // feet in leather boots below the hem
    `<path d="M29 238 L40 238 L41 247 C41 250.6 36 251.6 27 250.6 C24.6 250 25.4 246.6 29 245.6 Z M50 238 L61 238 C62 244.6 66 246.6 64.6 250.4 C58 251.6 51 251 49.6 249.6 Z" fill="#4A2A16"/><path d="M27 249.6 C32 250.4 37 250.2 40.6 249 M51 249 C55 250 60 250.2 64 249.4" stroke="#fff" stroke-opacity=".2" stroke-width=".8" fill="none"/>` +
    // the long robe in red and green panels, gold seams, a green hem; shaded from the left, folds down it
    `<g clip-path="url(#${id}r)">${strips}<path d="M0 232 H90 V262 H0 Z" fill="#14501C"/><path d="M0 232 H90" stroke="#E8B730" stroke-width="1.4"/><path d="M0 236 H90" stroke="#E8B730" stroke-width=".8" stroke-dasharray="1.4 1.4"/>` +
    `<path d="M30 112 C26 160 24 200 22 248 L28 248 C30 200 32 160 34 112 Z M58 112 C62 160 66 200 68 248 L62 248 C60 200 58 160 56 112 Z M44 150 C44 190 44 220 44 248 L48 248 C48 220 48 190 47 150 Z" fill="#000" opacity=".16"/>` +
    `<path d="${robe}" fill="url(#${id}o)"/></g>` +
    // the gold sash, its knot and hanging ends
    `<path d="M20 140 Q45 148 70 140 L71 152 Q45 160 19 152 Z" fill="#E8B730"/><path d="M20 140 Q45 148 70 140 L71 152 Q45 160 19 152 Z" fill="url(#${id}o)"/><path d="M20 145 Q45 153 70 145" stroke="#8A6410" stroke-width=".7" fill="none"/>` +
    `<path d="M40 152 L36 178 L42 177 L44 154 Z M46 154 L50 176 L55 174 L49 152 Z" fill="#D9A520"/><circle cx="44" cy="152" r="3.4" fill="#C9962E"/>` +
    // the sword in its red leather scabbard at the left hip, brass at the tip
    `<path d="M24 150 Q12 190 15 224" stroke="#7A1E10" stroke-width="5.2" fill="none" stroke-linecap="round"/><path d="M23 152 Q12.6 190 14.6 222" stroke="#fff" stroke-opacity=".2" stroke-width="1" fill="none"/><path d="M13.4 216 L15.4 226" stroke="#C9A227" stroke-width="5.4" stroke-linecap="round"/>` +
    `<path d="M20 141 L31 147" stroke="#C9A227" stroke-width="2.6" stroke-linecap="round"/><path d="M26 144 L28.6 136" stroke="#3A2410" stroke-width="2.4"/>` +
    // arms in their wide sleeves: the left hand on the sword's hilt, the right closed round the spear
    `<path d="M30 94 C22 100 16 114 16 128 C16 136 18 142 22 146 L32 144 C31 134 32 120 35 106 Z" fill="${R}"/><path d="M30 94 C22 100 16 114 16 128 C16 136 18 142 22 146 L32 144 C31 134 32 120 35 106 Z" fill="url(#${id}o)"/><path d="M22 112 C21 124 22 134 25 142" stroke="#000" stroke-opacity=".18" stroke-width="1" fill="none"/><path d="M22 146 L32 144" stroke="#E8B730" stroke-width="1.2"/>` +
    fist(27.6, 139, sk, 20, 1.15) +
    `<path d="M60 94 C68 100 74 112 76 122 L78 130 L68 133 C66 124 62 112 57 104 Z" fill="${GR}"/><path d="M60 94 C68 100 74 112 76 122 L78 130 L68 133 C66 124 62 112 57 104 Z" fill="url(#${id}o)"/><path d="M78 130 L68 133" stroke="#E8B730" stroke-width="1.2"/>` +
    fist(74, 135.4, sk, -6, 1.15) +
    // the neck, the face (stern), the red turban wound up high with green bands, its end under the chin
    `<path d="M39.4 80 L50.6 80 L51 92 L39 92 Z" fill="${skd}"/><path d="M34 90 Q45 96 56 90" stroke="#E8B730" stroke-width="1.4" fill="none"/>` +
    `<path d="M36.6 68 C36.4 76 40 82.6 45 83 C50 82.6 53.6 76 53.4 68 C53 62 49.6 59 45 59 C40.4 59 37 62 36.6 68 Z" fill="url(#${id}s)"/>` +
    `<path d="M50 68 C52 74 50 80 46 82.8 C50.6 82 53.4 76 53.4 69 Z" fill="#000" opacity=".16"/>` +
    `<path d="M38.8 69 Q41.2 67.6 43.4 68.9 Q41.2 70.3 38.8 69 Z M46.6 68.9 Q48.8 67.6 51.2 69 Q48.8 70.3 46.6 68.9 Z" fill="#F2ECE2"/><circle cx="41.4" cy="69" r=".95" fill="#2B160A"/><circle cx="48.8" cy="69" r=".95" fill="#2B160A"/><circle cx="41.7" cy="68.7" r=".28" fill="#fff"/><circle cx="49.1" cy="68.7" r=".28" fill="#fff"/>` +
    `<path d="M38.6 69 Q41.2 67.2 43.6 68.6 M46.4 68.6 Q48.8 67.2 51.4 69" stroke="${ink}" stroke-width=".75" fill="none"/>` +
    `<path d="M38.2 66 L43.6 67 M51.8 66 L46.4 67" stroke="${ink}" stroke-width="1.2" stroke-linecap="round"/>` +
    `<path d="M44.6 69.6 C44.4 71.6 44 73 43.2 74.2" stroke="${skd}" stroke-width=".6" fill="none"/><path d="M42.6 74.4 Q43.4 75.6 45 75.2 Q46.6 75.6 47.4 74.4" stroke="${skd}" stroke-width=".6" fill="none"/><ellipse cx="44.2" cy="75" rx=".55" ry=".35" fill="#2A1408"/><ellipse cx="45.8" cy="75" rx=".55" ry=".35" fill="#2A1408"/>` +
    `<path d="M41.8 77.8 Q45 77.2 48.2 77.8" stroke="#2A1408" stroke-width=".9" fill="none" stroke-linecap="round"/><path d="M42.6 78.4 Q45 79.6 47.4 78.4" stroke="${tone(sk, -.12)}" stroke-width=".8" fill="none"/><path d="M41.6 77 Q45 75.8 48.4 77" stroke="#1E140D" stroke-width="1.1" fill="none"/>` +
    `<path d="M34.6 66 C33.6 78 38 86.6 45 87.6 C52 86.6 56.4 78 55.4 66 L53.2 68 C53.6 77 50 82.6 45 83.2 C40 82.6 36.4 77 36.8 68 Z" fill="url(#${id}t)"/><path d="M37 78 C39 83 42 85.4 45 85.8" stroke="#000" stroke-opacity=".18" stroke-width=".8" fill="none"/>` +
    `<path d="M34 66 C31 54 32 40 36 32 C39 26 51 26 54 32 C58 40 59 54 56 66 C52 62 48.6 61 45 61 C41.4 61 38 62 34 66 Z" fill="url(#${id}t)"/>` +
    `<path d="M33.4 56 C40 51 50 51 56.6 56 M33.6 45 C40 40 50 40 56.4 45" stroke="${GR}" stroke-width="3.4" fill="none"/><path d="M33.6 50.4 C40 46 50 46 56.4 50.4 M34.6 39.6 C40 35.4 50 35.4 55.4 39.6" stroke="#E8B730" stroke-width="1" fill="none"/>` +
    `<path d="M36.6 34 C39 29.6 44 28.6 48 29.6" stroke="#fff" stroke-opacity=".3" stroke-width="1" fill="none"/><path d="M53 36 C56 44 57 54 55 64" stroke="#000" stroke-opacity=".2" stroke-width="1.6" fill="none"/>` +
    `<circle cx="45" cy="28" r="4" fill="#E8B730"/><circle cx="43.8" cy="26.8" r="1.2" fill="#FFF3C0"/></svg>`;
}

export function maiFanka(): string {
  const sk = SKIN[1], skd = tone(sk, -.32), id = 'fk' + (gid++), ink = '#1A0E06';
  let rings = ''; ['#B71C1C', '#E8B730', '#1B5E20', '#E8B730', '#7A4320'].forEach((c, k) => { rings += `<circle cx="0" cy="0" r="${34 - k * 6.5}" fill="${c}"/>`; });
  let tri = ''; for (let k = 0; k < 16; k++) { const a = k * Math.PI / 8, x = Math.cos(a) * 30, y = Math.sin(a) * 30; tri += `<path d="M${(x * .93).toFixed(1)} ${(y * .93).toFixed(1)} L${(Math.cos(a + .1) * 33).toFixed(1)} ${(Math.sin(a + .1) * 33).toFixed(1)} L${(Math.cos(a - .1) * 33).toFixed(1)} ${(Math.sin(a - .1) * 33).toFixed(1)} Z" fill="#FFF8E7"/>`; }
  let fringe = ''; for (let k = 0; k < 28; k++) { const a = k * Math.PI / 14, x = Math.cos(a) * 36, y = Math.sin(a) * 36, x2 = Math.cos(a) * 42, y2 = Math.sin(a) * 42; fringe += `<path d="M${x.toFixed(1)} ${y.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${k % 2 ? '#B71C1C' : '#1A0E06'}" stroke-width="2.4" stroke-linecap="round"/>`; }
  const robe = 'M75 104 Q92 98 109 104 C114 150 117 200 120 258 Q92 266 64 258 C67 200 70 150 75 104 Z';
  return `<svg class="fanka dur" viewBox="0 0 150 270" aria-hidden="true"><defs>` +
    `<linearGradient id="${id}w" x1="0" y1="0" x2="1" y2=".2"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".45" stop-color="#F2EEE5"/><stop offset="1" stop-color="#C4BBA8"/></linearGradient>` +
    `<radialGradient id="${id}s" cx=".38" cy=".36" r=".75"><stop offset="0" stop-color="${tone(sk, .22)}"/><stop offset=".55" stop-color="${sk}"/><stop offset="1" stop-color="${skd}"/></radialGradient>` +
    `<radialGradient id="${id}l" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient></defs>` +
    `<ellipse cx="98" cy="261" rx="40" ry="7" fill="url(#k4-shadow)"/><ellipse cx="92" cy="260" rx="20" ry="2.4" fill="#2A1A0A" opacity=".28"/>` +
    // sandalled feet under a plain white robe that falls in long folds; a red cap
    `<path d="M76 254 L88 254 L88 260 C82 261.6 76 261.4 72 260.6 C71 258.6 73 256 76 254 Z M96 254 L108 254 C111 256 113 258.6 112 260.6 C108 261.4 102 261.6 96 260 Z" fill="${sk}"/><path d="M71.6 260.6 C78 261.8 84 261.6 88.4 260.2 M95.6 260.2 C100 261.6 106 261.8 112.4 260.6" stroke="#3A2410" stroke-width="1.4" fill="none"/>` +
    `<path d="${robe}" fill="url(#${id}w)"/><path d="M84 130 C80 170 78 210 76 256 M100 130 C104 170 106 210 108 256 M92 150 C92 190 92 220 92 260" stroke="#000" stroke-opacity=".12" stroke-width="1.6" fill="none" stroke-linecap="round"/>` +
    `<path d="M81 120 C78 160 76 200 74 250" stroke="#fff" stroke-width="1.2" fill="none"/><path d="M86 112 L92 128 L98 112" stroke="#1B5E20" stroke-width="1.2" fill="none"/><path d="M88 116 q4 4 8 0 M88 122 q4 4 8 0" stroke="#1B5E20" stroke-width=".9" fill="none"/>` +
    `<path d="M64 258 Q92 266 120 258" stroke="#1B5E20" stroke-width="1.2" fill="none"/>` +
    // the head: a face looking up at his work, ears below a red cap
    `<path d="M86.6 92 L97.4 92 L98 102 L86 102 Z" fill="${skd}"/>` +
    `<path d="M82.6 85 C81.6 84.4 81 87.4 82 89.4 C82.6 90.6 83.6 90.6 84.2 89.6 Z M101.4 85 C102.4 84.4 103 87.4 102 89.4 C101.4 90.6 100.4 90.6 99.8 89.6 Z" fill="${sk}"/>` +
    `<path d="M83.4 84 C83.2 92 86.8 97.6 92 98 C97.2 97.6 100.8 92 100.6 84 C100.2 77.6 96.8 74 92 74 C87.2 74 83.8 77.6 83.4 84 Z" fill="url(#${id}s)"/><path d="M97 84 C99 90 97 95.4 93 97.8 C97.6 97 100.4 92 100.6 85 Z" fill="#000" opacity=".15"/>` +
    `<path d="M85.6 85 Q87.8 83.6 90 84.9 Q87.8 86.3 85.6 85 Z M94 84.9 Q96.2 83.6 98.4 85 Q96.2 86.3 94 84.9 Z" fill="#F2ECE2"/><circle cx="87.4" cy="84.6" r=".9" fill="#2B160A"/><circle cx="95.8" cy="84.6" r=".9" fill="#2B160A"/>` +
    `<path d="M85.4 85 Q87.8 83.2 90.2 84.6 M93.8 84.6 Q96.2 83.2 98.6 85" stroke="${ink}" stroke-width=".7" fill="none"/><path d="M85.2 81.8 Q87.6 80.6 90 81.6 M94 81.6 Q96.4 80.6 98.8 81.8" stroke="${ink}" stroke-width=".9" fill="none" stroke-linecap="round"/>` +
    `<path d="M91.6 85.6 C91.4 87.6 91 89 90.2 90.2" stroke="${skd}" stroke-width=".6" fill="none"/><path d="M89.6 90.4 Q90.4 91.6 92 91.2 Q93.6 91.6 94.4 90.4" stroke="${skd}" stroke-width=".6" fill="none"/>` +
    `<path d="M88.6 93.6 Q92 95.6 95.4 93.6" stroke="#2A1408" stroke-width=".85" fill="none" stroke-linecap="round"/><path d="M89.6 94.6 Q92 95.8 94.4 94.6" stroke="${tone(sk, -.12)}" stroke-width=".7" fill="none"/>` +
    `<path d="M82.8 80 C82.4 71 86 67 92 67 C98 67 101.6 71 101.2 80 C96 78 88 78 82.8 80 Z" fill="#A31818"/><path d="M83 78 C88 76 96 76 101 78" stroke="#E8B730" stroke-width="1.2" fill="none"/><path d="M84 74 C86 70 90 68.6 94 69" stroke="#fff" stroke-opacity=".3" stroke-width="1" fill="none"/>` +
    // the fan: a great round leather fan, rings of red, gold and green, a fringe; it sweeps on its long handle
    `<g class="fan"><path d="M78 128 L34 54" stroke="#6B4422" stroke-width="4" stroke-linecap="round"/><path d="M77 127 L33.4 54.6" stroke="#fff" stroke-opacity=".2" stroke-width="1"/>` +
    `<g transform="translate(30 46)">${fringe}${rings}${tri}<circle r="34" fill="url(#${id}l)"/><circle r="27.5" fill="none" stroke="#3A1E0A" stroke-width=".5" stroke-dasharray="1 1.2" opacity=".6"/><circle r="14.5" fill="none" stroke="#3A1E0A" stroke-width=".5" stroke-dasharray="1 1.2" opacity=".6"/><circle r="5" fill="#C9A227"/><circle cx="-1.4" cy="-1.4" r="1.6" fill="#FFF3C0"/></g>` +
    fist(73.8, 120.6, sk, 30, 1.1) + fist(79.4, 130, sk, 30, 1.1) + `</g>` +
    `<path d="M77 104 C71 110 70 120 73 126 L82 132 C83 124 85 114 88 108 Z" fill="url(#${id}w)"/><path d="M107 104 C101 108 92 112 78 118 L76 124 C88 125 99 122 108 116 Z" fill="url(#${id}w)"/><path d="M77 124 C88 125 99 122 108 116" stroke="#000" stroke-opacity=".14" stroke-width="1" fill="none"/></svg>`;
}

/*
 * The Durbar's own sounds (Sani 2026-10-23: "don't forget sound effects"), made in Web Audio so nothing new is
 * downloaded: hooves when a horseman rides in and out, the kakaki's fanfare and the women's ululation (guda) for a
 * letter said right, a long falling kakaki and a crowd's groan for a miss. All are short and end before the
 * microphone can open; none plays over Laila's voice (the game schedules them after her).
 */
let dac: AudioContext | null = null;
function audio(): AudioContext | null { try { dac = dac || new (window.AudioContext || (window as any).webkitAudioContext)(); if (dac.state === 'suspended') dac.resume(); return dac; } catch { return null; } }
function noise(a: AudioContext, secs: number): AudioBuffer { const n = Math.floor(a.sampleRate * secs), b = a.createBuffer(1, n, a.sampleRate), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; return b; }
function clop(a: AudioContext, t: number, vol: number): void {
  const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(); s.buffer = noise(a, .08); f.type = 'bandpass'; f.frequency.value = 1700; f.Q.value = 2.5;
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .004); g.gain.exponentialRampToValueAtTime(.0001, t + .07); s.connect(f).connect(g).connect(a.destination); s.start(t); s.stop(t + .08);
  const o = a.createOscillator(), og = a.createGain(); o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(60, t + .08);
  og.gain.setValueAtTime(.0001, t); og.gain.exponentialRampToValueAtTime(vol * 1.4, t + .005); og.gain.exponentialRampToValueAtTime(.0001, t + .1); o.connect(og).connect(a.destination); o.start(t); o.stop(t + .12);
}
/** a gallop: hooves in threes, louder as the horse comes near (in) or fading as it goes (out) */
export function hooves(secs = 1.1, out = false): void {
  const a = audio(); if (!a) return; const t0 = a.currentTime + .02;
  for (let t = 0; t < secs; t += .34) [0, .07, .14].forEach((d) => { const k = (t + d) / secs, v = .05 + .2 * (out ? 1 - k : Math.min(1, k * 1.4)); clop(a, t0 + t + d, v); });
}
function horn(a: AudioContext, t: number, f0: number, dur: number, f1 = f0, vol = .16): void {
  const o = a.createOscillator(), o2 = a.createOscillator(), g = a.createGain(), f = a.createBiquadFilter(), lfo = a.createOscillator(), lg = a.createGain();
  o.type = 'sawtooth'; o2.type = 'square'; o.frequency.setValueAtTime(f0, t); o2.frequency.setValueAtTime(f0 * 1.005, t);
  if (f1 !== f0) { o.frequency.setValueAtTime(f0, t + dur * .5); o.frequency.exponentialRampToValueAtTime(f1, t + dur); o2.frequency.setValueAtTime(f0 * 1.005, t + dur * .5); o2.frequency.exponentialRampToValueAtTime(f1, t + dur); }
  f.type = 'lowpass'; f.frequency.setValueAtTime(700, t); f.frequency.linearRampToValueAtTime(1800, t + .08); lfo.frequency.value = 5.5; lg.gain.value = 4; lfo.connect(lg); lg.connect(o.frequency); lg.connect(o2.frequency);
  const g2 = a.createGain(); g2.gain.value = .35; o2.connect(g2).connect(f); o.connect(f); f.connect(g);
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .05); g.gain.setValueAtTime(vol, t + dur - .12); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  g.connect(a.destination); [o, o2, lfo].forEach((x) => { x.start(t); x.stop(t + dur + .05); });
}
/** the kakaki salute and the women's guda: a letter said right */
export function fanfare(): void {
  const a = audio(); if (!a) return; const t = a.currentTime + .03;
  horn(a, t, 233, .22); horn(a, t + .28, 233, .22); horn(a, t + .56, 311, .9, 311, .18);
  // guda: a high voice trilling fast, rising and falling as the women in the crowd join in
  [0, .18].forEach((d, k) => { const o = a.createOscillator(), l = a.createOscillator(), lg = a.createGain(), g = a.createGain(); o.type = 'triangle';
    o.frequency.value = 1050 + k * 140; l.frequency.value = 7.5 + k; lg.gain.value = 170; l.connect(lg).connect(o.frequency);
    const s = t + .5 + d; g.gain.setValueAtTime(.0001, s); g.gain.exponentialRampToValueAtTime(.05, s + .15); g.gain.setValueAtTime(.05, s + .9); g.gain.exponentialRampToValueAtTime(.0001, s + 1.2);
    o.connect(g).connect(a.destination); o.start(s); l.start(s); o.stop(s + 1.25); l.stop(s + 1.25); });
}
/** a miss: one long kakaki note sagging down, and the crowd's low "aah" */
export function groan(): void {
  const a = audio(); if (!a) return; const t = a.currentTime + .03;
  horn(a, t, 233, 1, 160, .13);
  const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(); s.buffer = noise(a, 1.2); f.type = 'bandpass'; f.Q.value = 3; f.frequency.setValueAtTime(520, t); f.frequency.exponentialRampToValueAtTime(260, t + 1.1);
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.12, t + .2); g.gain.exponentialRampToValueAtTime(.0001, t + 1.15); s.connect(f).connect(g).connect(a.destination); s.start(t); s.stop(t + 1.2);
}
