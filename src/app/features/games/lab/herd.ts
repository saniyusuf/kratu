// @ts-nocheck
import { liveAC } from './audioctx';
/*
 * Ƙirgen shanu's cattle (Sani 2026-10-22): the cows Nigerian children know. White Fulani (Bunaji): white, black
 * muzzle and ear tips, long lyre horns; Red Bororo (Rahaji): deep red with long pale horns; and a white and grey
 * pied cow. Each has the zebu hump and dewlap. They graze (head down to the grass), switch their tails and walk
 * slowly. The herder walks with them, guiding with his staff, never striking.
 *   .zhead (grazes) · .zl a–d (legs, slow amble) · .ztail (switches) · herdsman(): .hl legs, .hstaff (sways, taps the ground)
 */
const COWS = [
  // White Fulani: white coat, black skin at the eyes, muzzle and ear tips, long lyre horns
  { body: ['#F6F3EC', '#D6CEBF'], horn: '#EFE6D2', tip: '#3A2A1E', muzzle: '#2B211A', ear: '#2B211A', eye: '#2B211A', horns: 'lyre' },
  // Red Bororo: deep red, tall upright horns pale to the tips
  { body: ['#A8431E', '#6E2A10'], horn: '#F1E2C0', tip: '#8A7350', muzzle: '#3A1A0A', ear: '#7A3416', eye: '#4A1C08', horns: 'tall' },
  // Sokoto Gudali: cream and grey, short horns, a heavy dewlap
  { body: ['#EDE6D8', '#BDB3A2'], horn: '#E6DCC6', tip: '#6A5A44', muzzle: '#4A403A', ear: '#9A9086', eye: '#5A504A', horns: 'short' },
];
/* round five (Sani 2026-10-27, realism with performance): the horns are tapering filled shapes, not strokes */
const HORNS = {
  lyre: 'M188 67 C176 52 179 32 195 19 C185 34 183 52 194 64Z M196 64 C210 50 222 40 217 19 C227 40 216 55 201 66Z',
  tall: 'M188 67 C174 50 176 22 189 5 C182 24 183 50 194 64Z M196 64 C212 48 224 28 219 5 C230 28 218 52 201 66Z',
  short: 'M189 66 C184 58 187 50 193 45 C190 52 191 58 195 64Z M197 64 C204 58 209 52 207 45 C212 52 208 60 201 66Z',
};
const TIPS = { lyre: [[195, 21], [218, 21]], tall: [[189, 7], [220, 7]], short: [[193, 46.5], [208, 46.5]] };
let n = 0;
/* viewBox 0 0 240 160, ground at 150; the neck and head (.zhead) turn about the shoulder at (156,74) to reach the grass.
   Round five: the zebu drawn as the market draws its cattle: the rump with its hip bones, the back dipping to the hump,
   the deep brisket and the sagging belly, jointed legs (knee in front, hock behind) on small hooves, the coat lit from
   the upper left with the belly and the far side in shade, a long face, the ear held out, the dewlap in folds. */
export function zebu(v = 0): string {
  const c = COWS[v % COWS.length], id = 'zb' + (n++);
  const leg = (cls, x, top, front, col) => `<g class="zl ${cls}"><path d="${front
      ? `M${x - 6} ${top} L${x + 7} ${top} C${x + 7} ${top + 12} ${x + 6} ${top + 18} ${x + 4.6} ${top + 22} L${x + 4} 138 Q${x + 4.6} 141 ${x + 5} 141.4 L${x - 1.6} 141.4 L${x - 2} 138 L${x - 3} ${top + 24} C${x - 4} ${top + 18} ${x - 6} ${top + 10} ${x - 6} ${top} Z`
      : `M${x - 10} ${top} C${x - 12} ${top + 14} ${x - 6} ${top + 22} ${x - 4} ${top + 26} L${x - 2} 138 Q${x - 2} 141 ${x} 141.4 L${x + 5} 141.4 Q${x + 5} 138 ${x + 4} 136 L${x + 4} ${top + 24} C${x + 6} ${top + 16} ${x + 9} ${top + 8} ${x + 8} ${top} Z`}" fill="${col}"/>` +
    `<path d="M${front ? x - 2.6 : x - 1.6} 140.6 h${front ? 8.2 : 7.8} l1.3 7.4 q-5.6 1.4 -10.8 0 Z" fill="#231A14"/></g>`;
  const far = c.body[1], near = `url(#${id})`, dw = v % 3 === 2;
  const BODY = 'M56 64 C64 58 78 60 92 61 C108 62 118 61 125 58 C129 47 140 40 151 43 C159 46 162 54 161 62 C168 68 172 78 173 92 C174 106 168 116 158 120 C140 126 112 127 94 123 C84 121 78 118 72 114 C62 112 52 104 49 92 C47 80 49 70 56 64 Z';
  return `<svg class="zebu" viewBox="0 0 240 160" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.body[0]}"/><stop offset=".55" stop-color="${c.body[0]}"/><stop offset="1" stop-color="${c.body[1]}"/></linearGradient>` +
    `<radialGradient id="${id}v" cx=".4" cy=".3" r=".75"><stop offset=".55" stop-color="#1A0E04" stop-opacity="0"/><stop offset="1" stop-color="#1A0E04" stop-opacity=".26"/></radialGradient></defs>` +
    `<ellipse cx="122" cy="149.6" rx="72" ry="4.6" fill="rgba(40,24,10,.3)"/>` +
    leg('b', 76, 104, false, far) + leg('d', 146, 108, true, far) +
    `<g class="ztail"><path d="M54 66 Q44 96 47 130" stroke="${c.body[1]}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M43 124 q1 12 5 13 q4 -1 4 -9 q-3 -6 -9 -4 Z" fill="#231A14"/></g>` +
    `<path d="${BODY}" fill="${near}"/><path d="${BODY}" fill="url(#${id}v)"/>` +
    `<path d="M150 70 Q162 90 155 113 M62 70 Q78 86 71 112 M110 97 q9 6 19 4 M113 105 q8 5 16 3 M60 63 q4 -4 9 -2 M98 121 Q124 128 150 120" stroke="#1A0E04" stroke-opacity=".1" stroke-width="2" fill="none" stroke-linecap="round"/>` +
    `<path d="M60 66 Q96 60 122 62 M131 50 Q141 43 151 46" stroke="#fff" stroke-opacity=".24" stroke-width="3.4" fill="none" stroke-linecap="round"/>` +
    leg('a', 64, 100, false, c.body[0]) + leg('c', 158, 108, true, c.body[0]) +
    `<g class="zhead">` +
    `<path d="M146 62 C162 58 180 60 190 68 L197 92 C188 98 178 104 168 110 L150 98 Z" fill="${near}"/>` +
    `<path d="M162 100 C164 ${dw ? 130 : 120} 176 ${dw ? 136 : 128} 190 ${dw ? 122 : 116} L196 94 Z" fill="${c.body[1]}"/><path d="M170 110 q6 4 13 1 M172 119 q5 3 11 -1 M168 102 q8 3 16 0" stroke="#000" stroke-opacity=".13" stroke-width="1.3" fill="none"/>` +
    `<path d="${HORNS[c.horns]}" fill="${c.horn}"/><path d="${TIPS[c.horns].map(([x, y]) => `M${x - 2.2} ${y + 1.6} Q${x} ${y - 3.4} ${x + 2.2} ${y + 1.6}Z`).join('')}" fill="${c.tip}"/>` +
    `<path d="M186 62 C195 57 205 62 208 70 L220 98 C224 109 214 117 205 112 L190 93 C184 84 182 70 186 62 Z" fill="${c.body[0]}"/>` +
    `<path d="M203 70 Q209 84 216 100 L205 110 L191 92 Q197 82 203 70 Z" fill="#1A0E04" opacity=".09"/>` +
    `<ellipse cx="212" cy="106" rx="8" ry="6.5" transform="rotate(-30 212 106)" fill="${c.muzzle}"/><path d="M208.6 103.2 a1.3 1 0 1 0 .1 0 M214.6 105.4 a1.3 1 0 1 0 .1 0 M203 110 q4 3 9 2" stroke="#000" stroke-width="1.2" fill="none"/>` +
    `<ellipse cx="197" cy="77" rx="4" ry="3" fill="${c.eye}" opacity=".6"/><path d="M197 74.8 a2.2 2.2 0 1 0 .1 0Z" fill="#140C06"/>` +
    `<path d="M189 72 C180 69 171 73 168 80 C177 83 186 80 190 77 Z" fill="${c.body[1]}"/><path d="M176 74 C172 76 170 78 169.4 80 C174 80 176 79 178 77 Z" fill="${c.ear}"/>` +
    `</g></svg>`;
}
/* a clump of savanna grass: thin tapering blades, the dry ones behind and the green in front (round five: filled blades,
   not combs of strokes) */
export function tuft(v = 0): string {
  const g = ['#6B8E3A', '#8FA548', '#A9A050'][v % 3];
  const bl = (pts) => pts.map(([x, tx, ty]) => `M${x - 1} 22 Q${(x + tx) / 2 - 1} ${(22 + ty) / 2 + 2} ${tx} ${ty} Q${(x + tx) / 2 + 1.4} ${(22 + ty) / 2 + 3} ${x + 1.4} 22Z`).join('');
  return `<svg class="tuft" viewBox="0 0 40 22" aria-hidden="true"><ellipse cx="20" cy="21.6" rx="15" ry="1.2" fill="rgba(40,24,10,.18)"/>` +
    `<path d="${bl([[9, 2, 6], [15, 12, 1], [21, 26, 2], [27, 36, 8], [12, 6, 2]])}" fill="#B9A35E"/>` +
    `<path d="${bl([[6, 0, 13], [11, 9, 4], [17, 19, 3], [20, 24, 5], [24, 31, 7], [30, 39, 13], [14, 14, 6]])}" fill="${g}"/></svg>`;
}

/*
 * The herdsman: a Fulani man in a long robe and the conical malafa hat, a calabash at his hip and his long staff held
 * upright beside him. He walks with the herd; the staff only sways and touches the ground, never a cow.
 */
export function herdsman(): string {
  return `<svg class="herdsman" viewBox="-14 -10 70 140" aria-hidden="true"><ellipse cx="20" cy="128" rx="18" ry="3" fill="rgba(40,24,10,.28)"/>` +
    `<g class="hl b"><path d="M22 92 L24 126" stroke="#3E2A1E" stroke-width="5" stroke-linecap="round"/><path d="M21 124 h8 v4 h-9 Z" fill="#5E3A1C"/></g>` +
    `<path d="M8 46 Q20 38 32 46 L36 100 Q20 106 4 100 Z" fill="#5D4A86"/><path d="M8 46 Q20 38 32 46 L34 72 Q20 76 6 72 Z" fill="#6E5A98"/>` +
    `<path d="M20 44 V100" stroke="#C9A15E" stroke-width="1.2" stroke-dasharray="3 3"/>` +
    `<g class="hl a"><path d="M16 94 L14 126" stroke="#4A3324" stroke-width="5" stroke-linecap="round"/><path d="M10 124 h8 v4 h-9 Z" fill="#5E3A1C"/></g>` +
    `<path d="M4 82 Q-2 88 2 96 Q8 98 10 90 Z" fill="#D9A55A"/><path d="M4 84 Q2 80 8 80" stroke="#7A4A26" stroke-width="1" fill="none"/>` +
    `<circle cx="20" cy="30" r="9" fill="#6E4426"/><path d="M15 36 q5 3 10 0" stroke="#3A1A0A" stroke-width="1.2" fill="none"/><circle cx="17" cy="29" r="1" fill="#1A0E06"/><circle cx="23" cy="29" r="1" fill="#1A0E06"/>` +
    `<path d="M12 33 Q20 44 28 33 L28 38 Q20 46 12 38 Z" fill="#E8E0D0"/>` +
    `<path d="M0 26 L20 4 L40 26 Q20 30 0 26 Z" fill="#D9B464"/><path d="M4 24 Q20 27 36 24" stroke="#7A4A26" stroke-width="2" fill="none"/><path d="M12 16 L20 4 L28 16 Z" fill="#7A4A26"/><path d="M8 20 L32 20" stroke="#B88E3A" stroke-width=".8"/>` +
    `<g class="hstaff"><path d="M40 -6 L44 128" stroke="#7A5230" stroke-width="3" stroke-linecap="round"/><path d="M40 -6 q-4 -4 -1 -8" stroke="#7A5230" stroke-width="3" fill="none" stroke-linecap="round"/>` +
    `<path d="M30 50 Q38 56 42 60" stroke="#5D4A86" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="42" cy="60" r="3.2" fill="#6E4426"/></g>` +
    `<path d="M10 50 Q4 62 6 72" stroke="#5D4A86" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="6" cy="73" r="3" fill="#6E4426"/></svg>`;
}

/* a cowbell's soft clonk, the sound of a herd moving (WebAudio; the tab's own volume) */
let bac = null;
export function cowbell(times = 2): void {
  try { bac = liveAC(bac); } catch (e) { return; }
  for (let k = 0; k < times; k++) { const t = bac.currentTime + .05 + k * .55;
    [[540, .09], [812, .05], [1290, .025]].forEach(([f, v]) => { const o = bac.createOscillator(), g = bac.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(f * (k % 2 ? .94 : 1), t);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .008); g.gain.exponentialRampToValueAtTime(.0001, t + .5); o.connect(g).connect(bac.destination); o.start(t); o.stop(t + .55); }); }
}
/* a low, unhappy moo for a wrong count */
export function moo(): void {
  try { bac = liveAC(bac); } catch (e) { return; }
  const t = bac.currentTime + .05, o = bac.createOscillator(), g = bac.createGain(), f = bac.createBiquadFilter();
  o.type = 'sawtooth'; o.frequency.setValueAtTime(150, t); o.frequency.linearRampToValueAtTime(175, t + .35); o.frequency.exponentialRampToValueAtTime(105, t + 1.2);
  f.type = 'lowpass'; f.frequency.value = 600; g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.14, t + .12); g.gain.setValueAtTime(.14, t + .8); g.gain.exponentialRampToValueAtTime(.0001, t + 1.3);
  o.connect(f).connect(g).connect(bac.destination); o.start(t); o.stop(t + 1.35);
}

/* a cattle egret, the white bird that walks about the cattle's feet; it pecks now and then (.peck) */
export function egret(): string {
  return `<svg class="egret" viewBox="0 0 40 40" aria-hidden="true"><ellipse cx="20" cy="38" rx="9" ry="1.6" fill="rgba(40,24,10,.22)"/>` +
    `<path d="M16 24 L15 37 M22 24 L23 37" stroke="#C9A040" stroke-width="1.4"/>` +
    `<path d="M8 20 Q12 12 22 14 Q28 16 26 24 Q18 28 8 20 Z" fill="#FBFBF6"/><path d="M10 20 Q16 22 22 20" stroke="#E2E2DA" stroke-width="1" fill="none"/>` +
    `<g class="peck"><path d="M24 16 Q27 8 30 6" stroke="#FBFBF6" stroke-width="3.4" fill="none" stroke-linecap="round"/><circle cx="30.5" cy="5.6" r="2.6" fill="#FBFBF6"/>` +
    `<path d="M32 5 L38 6.4 L32 6.6 Z" fill="#E7B53A"/><circle cx="31" cy="5" r=".6" fill="#222"/></g></svg>`;
}
/* the price board hung on the post in front of each animal: chalk on a little blackboard */
export function priceBoard(m: number): string {
  return `<span class="pboard"><i class="prope"></i><b>${m.toLocaleString('en-GB')}</b></span>`;
}
