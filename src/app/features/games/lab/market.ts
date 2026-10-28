// @ts-nocheck
/*
 * Dillalin kasuwa's goods, drawn (Sani 2026-10-22): every thing the dillali sells is a small SVG, and every sale ends
 * the way it would in the market. Animals are led away on a rope, a chicken is tucked under an arm, a mat is unrolled
 * and prayed on, pots and food go on the head, the kettle is carried by its handle, the broom sweeps, caps, turbans,
 * kaftans and shoes are put on with a proud turn, the umbrella opens. Moving parts by transform and opacity only.
 */
import { ram, goat } from './art4';
import { KW } from './sc-kasuwa';
import { arewaCap } from './capsArewa';
import { liveAC } from './audioctx';

const G = (vb, inner) => `<svg class="good" viewBox="${vb}" aria-hidden="true">${inner}</svg>`;
const SH = (cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${rx / 7}" fill="rgba(40,24,10,.25)"/>`;

function donkey(): string {
  return `<svg class="beast" viewBox="0 0 170 150" aria-hidden="true">${SH(86, 144, 60)}` +
    `<g class="legs"><path class="lg a" d="M52 98 L50 142" stroke="#6E6A66" stroke-width="7" stroke-linecap="round"/><path class="lg b" d="M64 98 L66 142" stroke="#87827C" stroke-width="7" stroke-linecap="round"/>` +
    `<path class="lg c" d="M110 98 L108 142" stroke="#6E6A66" stroke-width="7" stroke-linecap="round"/><path class="lg d" d="M122 98 L126 142" stroke="#87827C" stroke-width="7" stroke-linecap="round"/></g>` +
    `<path d="M38 74 Q26 86 32 108" stroke="#6E6A66" stroke-width="3" fill="none"/><ellipse cx="86" cy="80" rx="50" ry="25" fill="#9E9A94"/><path d="M50 70 Q86 62 122 70" stroke="#3E3A36" stroke-width="3" fill="none"/>` +
    `<path d="M124 62 Q140 42 152 56 Q160 74 154 84 Q144 86 132 80 Z" fill="#9E9A94"/><ellipse cx="154" cy="80" rx="7" ry="6" fill="#D9D4CC"/>` +
    `<path d="M136 50 L130 22 L140 46 M144 50 L146 22 L150 48" stroke="#9E9A94" stroke-width="6" stroke-linecap="round" fill="none"/><circle cx="146" cy="64" r="2.2" fill="#1A0E06"/></svg>`;
}
function camel(): string {
  return `<svg class="beast" viewBox="0 0 180 170" aria-hidden="true">${SH(90, 164, 66)}` +
    `<g class="legs"><path class="lg a" d="M58 100 L54 162" stroke="#A57A45" stroke-width="7" stroke-linecap="round"/><path class="lg b" d="M70 100 L72 162" stroke="#C49A60" stroke-width="7" stroke-linecap="round"/>` +
    `<path class="lg c" d="M112 100 L110 162" stroke="#A57A45" stroke-width="7" stroke-linecap="round"/><path class="lg d" d="M124 100 L128 162" stroke="#C49A60" stroke-width="7" stroke-linecap="round"/></g>` +
    `<path d="M44 96 Q40 66 70 60 Q84 34 98 58 Q112 60 126 74 Q138 94 126 104 L56 106 Q44 104 44 96 Z" fill="#C49A60"/>` +
    `<path d="M124 80 Q150 60 148 30 L160 26 Q168 30 166 38 Q160 40 158 46 Q160 70 136 96 Z" fill="#C49A60"/><circle cx="158" cy="34" r="2" fill="#1A0E06"/>` +
    `<path d="M70 62 Q84 50 96 62" fill="#B71C1C"/><path d="M68 64 h30" stroke="#FFD54A" stroke-width="2"/></svg>`;
}
function chicken(): string {
  return G('0 0 100 100', SH(50, 92, 30) + `<path d="M46 72 L44 90 M56 72 L58 90" stroke="#E8A317" stroke-width="3"/>` +
    `<path d="M20 50 Q14 30 30 34 Q24 44 34 52 Z" fill="#5E3A1C"/><ellipse cx="50" cy="58" rx="28" ry="20" fill="#B5562A"/><path d="M34 58 Q50 68 66 56" stroke="#7A3416" stroke-width="2" fill="none"/>` +
    `<circle cx="72" cy="38" r="11" fill="#B5562A"/><path d="M66 28 q3 -8 6 0 q3 -8 6 0" fill="#E53935"/><path d="M82 38 l8 3 l-8 3 Z" fill="#E8A317"/><path d="M78 46 q2 6 -2 7" fill="#E53935"/><circle cx="75" cy="36" r="1.8" fill="#1A0E06"/>`);
}
function sackOf(fill, top) { return `<path d="M30 92 Q22 60 32 40 L68 40 Q78 60 70 92 Z" fill="#C9A262" stroke="#8B6A3A"/><ellipse cx="50" cy="40" rx="18" ry="5" fill="#8B6A3A"/>${top}`; }
function millet(): string { let s = ''; for (let k = 0; k < 7; k++) s += `<path d="M${38 + k * 4} 92 L${30 + k * 6} 20" stroke="#C9A24A" stroke-width="2"/><ellipse cx="${30 + k * 6}" cy="16" rx="3" ry="9" fill="#B08A3A"/>`; return G('0 0 100 100', SH(50, 94, 24) + s + `<path d="M36 70 h28" stroke="#6B4422" stroke-width="5"/>`); }
function groundnut(): string { let s = ''; for (let k = 0; k < 14; k++) { const x = 30 + (k % 5) * 10 + (k > 9 ? 5 : 0), y = 46 - Math.floor(k / 5) * 7; s += `<path d="M${x} ${y} q4 -4 8 0 q-4 6 -8 0 Z" fill="#D9B46A" stroke="#8B6A3A" stroke-width=".6"/>`; } return G('0 0 100 100', SH(50, 94, 32) + `<path d="M18 50 Q50 98 82 50 Z" fill="#B5763C"/><path d="M22 56 Q50 92 78 56" stroke="#7A4A22" stroke-width="1.4" fill="none" stroke-dasharray="3 2"/>` + s); }
function mango(): string { return G('0 0 100 100', SH(50, 94, 30) + `<path d="M18 70 Q50 98 82 70 Z" fill="#8B5A2B"/>` + [[36, 56, '#F9A825'], [56, 54, '#7CB342'], [46, 44, '#FB8C00']].map(([x, y, c]) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="14" fill="${c}" transform="rotate(-20 ${x} ${y})"/><path d="M${x + 2} ${y - 13} l3 -5" stroke="#4E7A2A" stroke-width="2"/>`).join('')); }
function bread(): string { return G('0 0 100 100', SH(50, 90, 36) + `<path class="loaf" d="M14 84 Q10 52 50 50 Q90 52 86 84 Z" fill="#D9933A"/><path d="M14 84 Q10 52 50 50 Q90 52 86 84 Z" fill="none" stroke="#8B5A2B" stroke-width="2"/><path d="M30 60 l6 10 M46 56 l6 10 M62 58 l6 10" stroke="#F2C27A" stroke-width="3" stroke-linecap="round"/>`); }
function onion(): string { return G('0 0 100 100', SH(50, 94, 30) + [[34, 72], [62, 72], [48, 58]].map(([x, y]) => `<path d="M${x} ${y - 18} Q${x - 18} ${y} ${x} ${y + 16} Q${x + 18} ${y} ${x} ${y - 18} Z" fill="#AD1457"/><path d="M${x} ${y - 16} Q${x - 6} ${y} ${x} ${y + 14}" stroke="#F48FB1" stroke-width="1.2" fill="none"/><path d="M${x} ${y - 18} l0 -8" stroke="#7CB342" stroke-width="2"/>`).join('')); }
function calabash(): string { return G('0 0 100 100', SH(50, 92, 36) + `<path d="M12 50 Q14 92 50 92 Q86 92 88 50 Z" fill="#E8C35A"/><ellipse cx="50" cy="50" rx="38" ry="8" fill="#B08A3A"/><path d="M20 62 q8 -6 16 0 q8 6 16 0 q8 -6 16 0 q8 6 12 0" stroke="#8B5A2B" stroke-width="2" fill="none"/>`); }
function pot(): string { return G('0 0 100 100', SH(50, 94, 26) + `<path d="M36 18 H64 Q62 26 70 32 Q86 46 80 68 Q74 92 50 92 Q26 92 20 68 Q14 46 30 32 Q38 26 36 18 Z" fill="#B85C30"/><ellipse cx="50" cy="18" rx="15" ry="4" fill="#7E3A16"/><path d="M22 48 l6 -5 l6 5 l6 -5 l6 5 l6 -5 l6 5 l6 -5 l6 5" stroke="#FFE3C4" stroke-width="2" fill="none"/>`); }
function matRolled(): string { return G('0 0 100 100', SH(50, 92, 40) + `<rect x="12" y="66" width="76" height="24" rx="12" fill="#C99A4E"/><ellipse cx="88" cy="78" rx="6" ry="12" fill="#A8782E"/><path d="M24 66 v24 M40 66 v24 M56 66 v24 M72 66 v24" stroke="#B23A2A" stroke-width="3"/><path d="M18 72 h66 M18 84 h66" stroke="#2E7D32" stroke-width="1.6"/>`); }
function kettle(): string { return G('0 0 100 100', SH(50, 94, 28) + `<path d="M28 90 Q20 56 38 46 L62 46 Q80 56 72 90 Z" fill="#1E88E5"/><path d="M70 60 Q90 52 92 38" stroke="#1E88E5" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M36 46 Q50 22 64 46" stroke="#1565C0" stroke-width="4" fill="none"/><ellipse cx="50" cy="46" rx="12" ry="3" fill="#90CAF9"/><path d="M30 70 h40" stroke="#FFD54A" stroke-width="3"/>`); }
function broom(): string { let s = ''; for (let k = 0; k < 13; k++) s += `<path d="M50 30 L${26 + k * 4} 92" stroke="#C9A24A" stroke-width="1.6"/>`; return G('0 0 100 100', SH(50, 94, 30) + s + `<path d="M44 24 h12 v16 h-12 Z" fill="#B23A2A"/><path d="M44 30 h12 M44 35 h12" stroke="#FFD54A" stroke-width="1.4"/>`); }
function kaftan(): string { return G('0 0 100 100', SH(50, 96, 30) + `<path d="M30 20 Q50 14 70 20 L90 40 L80 50 L72 42 L74 94 L26 94 L28 42 L20 50 L10 40 Z" fill="#F4EBD0" stroke="#C9B48A"/><path d="M44 20 L48 60 L52 60 L56 20" stroke="#2E7D32" stroke-width="2" fill="none"/><path d="M40 34 q10 6 20 0 M40 44 q10 6 20 0" stroke="#C9A227" stroke-width="1.6" fill="none"/>`); }
function cap(): string { return G('0 0 100 100', SH(50, 86, 30) + arewaCap('hula', 50, 80, 31, '#6A1B9A', '#FFD54A')); }
function turban(): string { return G('0 0 100 100', SH(50, 86, 34) + `<ellipse cx="50" cy="64" rx="34" ry="20" fill="#FFFFFF" stroke="#D9CBA6"/><path d="M18 62 Q50 40 82 62 M20 70 Q50 50 80 70 M24 76 Q50 60 76 76" stroke="#D9CBA6" stroke-width="2" fill="none"/><path d="M78 66 Q92 76 86 92" stroke="#FFFFFF" stroke-width="7" fill="none" stroke-linecap="round"/>`); }
function shoe(): string { return G('0 0 100 100', SH(50, 88, 38) + [[18, 0], [52, 4]].map(([x, d]) => `<path d="M${x} ${78 + d} Q${x} ${64 + d} ${x + 14} ${64 + d} L${x + 30} ${70 + d} Q${x + 34} ${80 + d} ${x + 28} ${84 + d} L${x + 4} ${84 + d} Z" fill="#8B5A2B"/><path d="M${x + 10} ${68 + d} Q${x + 18} ${62 + d} ${x + 24} ${70 + d}" stroke="#C62828" stroke-width="3" fill="none"/>`).join('')); }
function umbrella(): string { return G('0 0 100 100', SH(50, 94, 20) + `<path d="M50 14 L50 86 Q50 94 42 92" stroke="#3A2410" stroke-width="3" fill="none"/><path d="M50 18 L38 74 L50 70 L62 74 Z" fill="#1565C0"/><path d="M50 18 L44 72 M50 18 L56 72" stroke="#0D47A1" stroke-width="1.2"/>`); }

export const GOODS: Record<string, { svg: () => string; act: string }> = {
  ram: { svg: () => ram(), act: 'lead' }, goat: { svg: () => goat(), act: 'lead' }, donkey: { svg: donkey, act: 'lead' }, camel: { svg: camel, act: 'lead' }, chicken: { svg: chicken, act: 'arm' },
  millet: { svg: millet, act: 'head' }, groundnut: { svg: groundnut, act: 'head' }, mango: { svg: mango, act: 'head' }, bread: { svg: bread, act: 'eat' }, onion: { svg: onion, act: 'head' },
  calabash: { svg: calabash, act: 'head' }, pot: { svg: pot, act: 'head' }, mat: { svg: matRolled, act: 'pray' }, kettle: { svg: kettle, act: 'hand' }, broom: { svg: broom, act: 'sweep' },
  kaftan: { svg: kaftan, act: 'wear' }, cap: { svg: cap, act: 'wear' }, turban: { svg: turban, act: 'wear' }, shoe: { svg: shoe, act: 'wear' }, umbrella: { svg: umbrella, act: 'umbrella' },
};
/** how long each kind of sale takes before the next item comes up (ms) */
export const ACT_MS: Record<string, number> = { lead: 3200, arm: 2800, head: 3000, eat: 3200, hand: 2800, sweep: 3600, wear: 3400, umbrella: 3200, pray: 5200 };

const BUYERS = [
  { hat: 'cap', hatc: '#E9D9A6', robe: '#2F6B9A', robe2: '#24557C', skin: 1 }, { hat: 'hijab', hatc: '#AD1457', robe: '#C2185B', robe2: '#880E4F', skin: 2 },
  { hat: 'cap', style: 'zanna', hatc: '#7A1F2B', hatc2: '#E9C46A', robe: '#6D4C41', robe2: '#4E342E', skin: 0 }, { hat: 'hijab', hatc: '#2E7D32', robe: '#388E3C', robe2: '#1B5E20', skin: 3 },
];

/* the three positions of salah, side on, in a white robe and cap: standing, bowing (ruku'), prostrating (sujud) */
function prayer(): string {
  const sk = '#6B4022';
  return `<svg class="prayer" viewBox="0 0 120 100" aria-hidden="true">` +
    `<g class="mat-flat"><rect x="6" y="88" width="108" height="8" rx="2" fill="#C99A4E"/><path d="M20 88 v8 M40 88 v8 M60 88 v8 M80 88 v8 M100 88 v8" stroke="#B23A2A" stroke-width="2.4"/><path d="M8 90 h104" stroke="#2E7D32" stroke-width="1"/></g>` +
    `<g class="p-stand"><path d="M50 88 L52 42 Q60 36 68 42 L70 88 Z" fill="#FFFFFF" stroke="#D9CBA6"/><circle cx="60" cy="30" r="8" fill="${sk}"/><path d="M52 27 Q60 18 68 27 Z" fill="#FFFFFF" stroke="#D9CBA6"/><path d="M54 48 Q48 62 54 70 M66 48 Q72 62 66 70" stroke="#FFFFFF" stroke-width="5" fill="none" stroke-linecap="round"/></g>` +
    `<g class="p-bow"><path d="M48 88 L50 60 L58 58 L60 88 Z" fill="#FFFFFF" stroke="#D9CBA6"/><path d="M50 58 L84 56 L84 68 L52 70 Z" fill="#FFFFFF" stroke="#D9CBA6"/><circle cx="91" cy="61" r="7.5" fill="${sk}"/><path d="M94 54 Q102 60 96 68 Z" fill="#FFFFFF"/><path d="M80 62 L76 80 M70 64 L64 80" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/></g>` +
    `<g class="p-sujud"><path d="M26 88 Q30 62 54 64 Q76 68 82 84 L82 88 Z" fill="#FFFFFF" stroke="#D9CBA6"/><path d="M26 88 L20 84 L24 80" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" fill="none"/><circle cx="88" cy="82" r="7" fill="${sk}"/><path d="M92 76 Q100 82 94 88 Z" fill="#FFFFFF"/><path d="M78 80 L96 88" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/></g></svg>`;
}

/** the sale itself: a buyer from the crowd and the thing, doing what people do with it, then walking off */
export function deal(key: string, b: number): string {
  const g = GOODS[key], act = g.act, by = BUYERS[b % BUYERS.length], item = g.svg();
  if (act === 'pray') return `<div class="deal act-pray">${prayer()}</div>`;
  if (act === 'wear') {
    const o = { ...by, hat: 'cap' as any };
    if (key === 'cap') Object.assign(o, { hat: 'cap', hatc: '#6A1B9A' }); if (key === 'turban') Object.assign(o, { hat: 'turban', hatc: '#FFFFFF' });
    if (key === 'kaftan') Object.assign(o, { robe: '#F4EBD0', robe2: '#D9CBA6' });
    return `<div class="deal act-wear"><span class="buyer">${kwPerson(kwOf(o))}</span>${key === 'shoe' ? `<span class="feet">${item}</span>` : ''}</div>`;
  }
  const P = `<span class="buyer">${kwPerson(kwOf(by, act === 'umbrella' ? 'up' : act === 'eat' ? 'clap' : 'down'))}</span>`;
  if (act === 'lead') return `<div class="deal act-lead walk">${P}<span class="rope"></span><span class="animal">${item}</span></div>`;
  if (act === 'umbrella') return `<div class="deal act-umbrella">${P}<span class="brolly"><svg viewBox="0 0 100 60" aria-hidden="true"><path d="M4 50 Q50 -10 96 50 Q86 42 74 50 Q62 42 50 50 Q38 42 26 50 Q14 42 4 50 Z" fill="#1565C0"/><path d="M50 50 V8" stroke="#0D47A1" stroke-width="2"/></svg></span></div>`;
  return `<div class="deal act-${act}">${P}<span class="prop">${item}</span></div>`;
}

/* ---- Dillalin kasuwa, again (Sani 2026-10-25): the dillali holds up the real photo; the drawing is what the buyer takes ---- */

/** the thing for sale: its lesson photo in a wooden frame, the picture filling it edge to edge */
export function photoCard(src: string): string {
  return `<span class="mkcard"><span class="mkframe"><img alt="" src="${src}"><i class="mkx"></i></span></span>`;
}
/** the round's shopper: walks up to the stall from the left and leans in to look; leaves with it, or walks off without */
export function inspector(b: number): string {
  return `<div class="deal look"><span class="buyer"><span class="bob">${kwPerson(kwOf(BUYERS[b % BUYERS.length]))}</span></span></div>`;
}
/** coins that leap from the sale up to the tally */
export function coinBurst(n = 6): string {
  let s = ''; for (let k = 0; k < n; k++) s += `<i class="cn" style="--k:${k};--x:${(k - (n - 1) / 2) * 2.2}cqw"></i>`;
  return `<span class="mkcoins">${s}</span><span class="mkring"></span>`;
}

/* the market's own sounds, on the game's little synth like the tea seller's cup and the herd's bell:
   right, coins clink into the dillali's hand; wrong, the shopper's low "a'a" (no) as they turn away */
let mac: AudioContext | null = null;
const ctx = () => { try { return mac = liveAC(mac); } catch { return null; } };
export function coinClink(): void {
  const c = ctx(); if (!c) return;
  [[3520, 0], [4180, .09], [2960, .17], [3950, .27], [3300, .34]].forEach(([f, d]) => {
    const t = c.currentTime + .03 + d, o = c.createOscillator(), o2 = c.createOscillator(), g = c.createGain();
    o.type = 'triangle'; o.frequency.setValueAtTime(f, t); o2.type = 'sine'; o2.frequency.setValueAtTime(f * 1.51, t);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.07, t + .004); g.gain.exponentialRampToValueAtTime(.0001, t + .28);
    o.connect(g); o2.connect(g); g.connect(c.destination); o.start(t); o2.start(t); o.stop(t + .3); o2.stop(t + .3);
  });
}
export function aaNo(): void {
  const c = ctx(); if (!c) return;
  [[210, 175, 0], [190, 140, .3]].forEach(([f1, f2, d]) => {
    const t = c.currentTime + .03 + d, o = c.createOscillator(), g = c.createGain(), lp = c.createBiquadFilter();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(f2, t + .22);
    lp.type = 'lowpass'; lp.frequency.value = 700;
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.09, t + .03); g.gain.setValueAtTime(.09, t + .14); g.gain.exponentialRampToValueAtTime(.0001, t + .26);
    o.connect(lp).connect(g).connect(c.destination); o.start(t); o.stop(t + .3);
  });
}

/* ---- realism pass (Sani 2026-10-27): the people of the square in the square's own hand, and a real dillali ---- */

/** a market person drawn like the square's people (sc-kasuwa.ts), feet on the bottom of its box, with a contact shadow.
 *  Their faces read --ms/--mf (frown) and --eo/--eh (happy eyes) like the background's. */
export function kwPerson(o: any): string {
  return `<svg class="pp kwp" viewBox="-13 -47 26 48.6" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><ellipse cx="3" cy=".5" rx="9" ry="1.3" fill="#2A1A0C" opacity=".14"/>${KW.person({ x: 0, y: 0, s: 1, ...o })}</svg>`;
}
/** the old buyer description (art4 style) as a square person */
function kwOf(by: any, arm = 'down'): any {
  const a = arm === 'up' ? 'up' : arm === 'clap' ? 'front' : 'down', sk = KW.SKIN[by.skin ?? 1];
  if (by.hat === 'hijab') return { kind: 'woman', sk, top: by.robe, wrap: by.robe, wrap2: '#FFD54A', trim: '#FFD54A', cap: 'mayafi', capc: by.hatc, al: 'down', ar: a };
  return { kind: 'man', sk, robe: by.robe, robe2: by.robe2, trim: '#E8D9A8', cap: by.hat === 'turban' ? 'turban' : by.style || 'hula', capc: by.hatc, capc2: by.hatc2 || by.robe2, capc3: by.hatc3, beard: by.skin === 0 ? '#2A1A10' : '', al: 'down', ar: a };
}
const CROWD_KW = [
  { kind: 'man', sk: KW.SKIN[1], robe: '#2F6B9A', robe2: '#24557C', trim: '#E8D9A8', cap: 'borno', capc: '#F2E8CF', capc2: '#A3242C', capc3: '#1E5B3A' },
  { kind: 'woman', sk: KW.SKIN[2], top: '#AD1457', wrap: '#AD1457', wrap2: '#FFD54A', trim: '#FFD54A', cap: 'kallabi', capc: '#C2185B', capc2: '#FFD54A' },
  { kind: 'man', sk: KW.SKIN[0], robe: '#F4EBD0', robe2: '#D9CBA6', trim: '#8EA8C8', cap: 'turban', capc: '#FFFFFF', beard: '#E8E4DC' },
];
/** the onlookers at the right: they clap (.clapping) and frown (.sad on the stage) */
export function crowdKw(n = 3): string {
  return CROWD_KW.slice(0, n).map((p, i) => `<span class="pp-w" style="--d:${i * .13}s">${kwPerson({ ...p, al: 'front', ar: 'front', acl: 'x-a', acr: 'x-a' })}</span>`).join('');
}

/** the dillali: a grown man about seven heads tall in a brown babban riga with its embroidered pocket (aljihu) and
 *  neck, a cream jallabiya and wando under it, sandals, a folded embroidered zanna cap, a short beard; his left arm up with the
 *  wide sleeve fallen back to the elbow, his right hand holding a carbi (prayer beads). Lit from the upper left. */
export function auctioneer(): string {
  const sk = '#7A4A2A', skd = '#5A3520', robe = '#5B3A29', robeD = '#3E271A', robeL = '#76503B', emb = '#E2C26A', cr = '#EFE6D2', crD = '#CDBF9F', hair = '#1E140C';
  return `<svg class="dill auc" viewBox="0 0 120 200" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><defs>` +
    `<linearGradient id="mkA-r" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".13"/><stop offset=".42" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".34"/></linearGradient>` +
    `<radialGradient id="mkA-f" cx=".36" cy=".32" r=".78"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".38"/></radialGradient>` +
    `<radialGradient id="mkA-g"><stop offset="0" stop-color="#2A1A0C" stop-opacity=".6"/><stop offset="1" stop-color="#2A1A0C" stop-opacity="0"/></radialGradient></defs>` +
    // cast shadow to the lower right (sun upper left) and the dark contact under the feet
    `<path d="M40 197 Q90 192 118 195 Q92 200 44 199.4 Z" fill="#2A1A0C" opacity=".16"/><ellipse cx="54" cy="197.4" rx="24" ry="3.4" fill="url(#mkA-g)"/>` +
    // wando and sandals
    `<path d="M41 182 L41.6 193 L49.4 193 L49.6 182 Z" fill="${crD}"/><path d="M57 182 L57 193 L64.6 193 L65.4 182 Z" fill="${cr}"/>` +
    `<path d="M38 193.4 Q36.6 197.6 41 198 L51 198 Q53 196.6 50.6 193.4 Z" fill="#3E2414"/><path d="M40 194 Q45 191.4 50 194" stroke="#8B2E1E" stroke-width="1.8" fill="none"/>` +
    `<path d="M55.6 193.4 Q54.6 197.6 58.8 198 L69 198 Q71 196.6 68.4 193.4 Z" fill="#4A2C18"/><path d="M57.4 194 Q62.4 191.4 67.6 194" stroke="#A33A26" stroke-width="1.8" fill="none"/>` +
    // the jallabiya under the riga
    `<path d="M28 158 L26.6 185 Q52 189.6 75.4 185 L74 158 Z" fill="${cr}"/><path d="M28 158 L26.6 185 Q52 189.6 75.4 185 L74 158 Z" fill="url(#mkA-r)"/>` +
    `<path d="M40 166 Q39 176 38.4 186 M62 166 Q63 176 64 186" stroke="#000" stroke-opacity=".12" stroke-width="1" fill="none"/>` +
    // the right arm, hanging inside the riga, hand out at the side with the beads
    `<path d="M24 74 Q14 100 18 128" stroke="${robeD}" stroke-width="11" stroke-linecap="round" fill="none"/>` +
    // the babban riga: very wide, folded over the shoulders
    `<path d="M36 55 Q50 51 64 55 L75 60 Q88 74 92 104 L96 172 Q52 180 8 172 L12 104 Q16 72 28 59 Z" fill="${robe}"/>` +
    `<path d="M8 172 Q52 180 96 172 L95.4 176 Q52 184 8.4 176 Z" fill="#000" opacity=".16"/>` +
    `<path d="M22 84 Q15 124 16 168 M36 70 Q31 120 33 174 M50 62 Q49 120 51 176 M78 96 Q84 134 85 172 M68 120 Q71 150 70 175" stroke="${robeD}" stroke-width="1.5" fill="none" opacity=".75"/>` +
    `<path d="M26 92 Q20 128 21 166 M44 100 Q42 140 44 172" stroke="${robeL}" stroke-width="1.2" fill="none" opacity=".7"/>` +
    `<path d="M36 55 Q50 51 64 55 L75 60 Q88 74 92 104 L96 172 Q52 180 8 172 L12 104 Q16 72 28 59 Z" fill="url(#mkA-r)"/>` +
    // embroidery: the neck, the slit, the pocket with its spiral and the two knives (aska biyu)
    `<path d="M41.6 55.6 Q50 66 58.4 55.6" stroke="${emb}" stroke-width="1.6" fill="none"/><path d="M50 63 V78" stroke="${emb}" stroke-width="1.1"/>` +
    `<path d="M55 70 H73 L74 112 H56 Z" fill="none" stroke="${emb}" stroke-width=".9" opacity=".9"/>` +
    `<path d="M64.6 80 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 M64.6 80 m-2.6 0 a2.6 2.6 0 1 0 5.2 0" stroke="${emb}" stroke-width=".9" fill="none"/>` +
    `<path d="M58 89 L61.6 89 L59.8 110 Z M67.6 89 L71.2 89 L69.4 110 Z" fill="${emb}" opacity=".9"/><path d="M57 114 l2 -2 l2 2 l2 -2 l2 2 l2 -2 l2 2 l2 -2 l2 2" stroke="${emb}" stroke-width=".8" fill="none"/>` +
    // right hand and carbi
    `<path d="M15.4 126 Q14 133 18 135.6 Q22.6 136 22.8 130.6 Q22.4 126.6 19 126 Z" fill="${sk}"/><path d="M15.4 126 Q14 133 18 135.6" stroke="${skd}" stroke-width=".7" fill="none"/>` +
    `<g fill="#6B2E1A">${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((k) => `<circle cx="${(18.6 + Math.sin(k * .55) * 3.2).toFixed(1)}" cy="${(136.4 + k * 1.7).toFixed(1)}" r=".95"/>`).join('')}</g><path d="M19 151.6 l-.8 3.4 h1.6 Z" fill="${emb}"/>` +
    // the raised left arm: the sleeve folded back over the upper arm, the bare forearm, the open hand
    `<g class="arm"><path d="M66 57 Q79 51 86 41 L95 48 Q90 64 78 76 Q71 70 66 57 Z" fill="${robe}"/><path d="M84 42 Q99 44 96 58 Q99 78 91 96 Q84 80 79 70 Z" fill="${robeD}"/>` +
    `<path d="M84 42 Q99 44 96 58" stroke="${emb}" stroke-width="1" fill="none"/><path d="M68 60 Q78 58 88 46" stroke="${robeD}" stroke-width="1.1" fill="none" opacity=".8"/>` +
    `<path d="M89.6 46 L95.4 20" stroke="${sk}" stroke-width="6.6" stroke-linecap="round"/><path d="M92 46 L97.6 21" stroke="${skd}" stroke-width="2" stroke-linecap="round" opacity=".6"/>` +
    `<path d="M92.4 22 Q91.6 13 94 9 L94.8 3.2 Q95.6 1.4 96.8 3 L97 9 L97.8 1.6 Q98.8 -.2 99.8 1.6 L99.8 9 L100.8 3 Q102 1.4 102.8 3.2 L102.4 10.4 L104.2 6.8 Q106 6 105.8 8.4 L102.6 18.4 Q99 23.4 92.4 22 Z" fill="${sk}"/>` +
    `<path d="M97 9 L97.2 14 M99.8 9 L99.8 14 M102.4 10.4 L101.8 14.6" stroke="${skd}" stroke-width=".6" fill="none"/></g>` +
    // neck, ears, face (lit from the upper left), beard, eyes, brows, nose, the calling mouth and the frown
    `<path d="M45 45 L45 57 Q50 59.4 55 57 L55 45 Z" fill="${skd}"/>` +
    `<ellipse cx="38" cy="36.6" rx="2.2" ry="3.6" fill="${sk}"/><ellipse cx="62" cy="36.6" rx="2.2" ry="3.6" fill="${skd}"/>` +
    `<path d="M38.4 31 Q38.4 21 50 20.4 Q61.6 21 61.6 31 Q61.6 44 56 49.6 Q50 53.6 44 49.6 Q38.4 44 38.4 31 Z" fill="${sk}"/><path d="M38.4 31 Q38.4 21 50 20.4 Q61.6 21 61.6 31 Q61.6 44 56 49.6 Q50 53.6 44 49.6 Q38.4 44 38.4 31 Z" fill="url(#mkA-f)"/>` +
    `<path d="M39 37 Q40 47 45 50.6 Q50 54.6 55 50.6 Q60 47 61 37 Q60.4 45 55 47.6 Q50 49.4 45 47.6 Q39.6 45 39 37 Z" fill="${hair}"/><path d="M46.6 50.6 Q50 56.4 53.4 50.6 Z" fill="${hair}"/>` +
    `<path d="M45 41.2 Q50 38.8 55 41.2" stroke="${hair}" stroke-width="1.6" fill="none" stroke-linecap="round"/>` +
    `<ellipse cx="45" cy="32.6" rx="2.3" ry="1.3" fill="#F2ECE2"/><ellipse cx="55" cy="32.6" rx="2.3" ry="1.3" fill="#E6DED2"/><circle cx="45.4" cy="32.7" r="1.05" fill="#1A0E06"/><circle cx="55.4" cy="32.7" r="1.05" fill="#1A0E06"/>` +
    `<path d="M42.6 32 Q45 30.8 47.4 31.8 M52.6 31.8 Q55 30.8 57.4 32" stroke="${skd}" stroke-width=".6" fill="none"/>` +
    `<path d="M42 29.6 Q45 28 48 29.4 M52 29.4 Q55 28 58 29.6" stroke="${hair}" stroke-width="1.15" fill="none" stroke-linecap="round"/>` +
    `<path d="M50.2 32.4 Q49.6 36.8 47.8 38 Q50 39.4 52.4 38.2" stroke="${skd}" stroke-width=".9" fill="none" stroke-linecap="round"/><path d="M48.8 33 Q48.4 36 47.8 37.4" stroke="#fff" stroke-opacity=".18" stroke-width=".7" fill="none"/>` +
    `<path class="mouth pm-smile" d="M46.4 42.6 Q50 47.8 53.6 42.6 Q50 43.6 46.4 42.6 Z" fill="#3A1A0A"/>` +
    `<path class="pm-sad" d="M46.4 45 Q50 42.4 53.6 45" stroke="#3A1A0A" stroke-width="1.3" fill="none" stroke-linecap="round"/>` +
    // the folded zanna cap, leaning to one side, embroidered
    arewaCap('zanna', 50, 27.2, 12.2, '#EDE2C4', '#7A3A22', '', -1) + `</svg>`;
}
