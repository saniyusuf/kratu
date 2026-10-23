// @ts-nocheck
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
const HORNS = {
  lyre: 'M192 66 C178 52 182 32 196 20 M198 64 C212 50 224 40 218 20',
  tall: 'M192 66 C176 50 178 22 190 6 M198 64 C214 48 226 28 220 6',
  short: 'M192 66 C186 58 188 50 194 46 M198 64 C206 58 210 52 208 46',
};
const TIPS = { lyre: [[196, 20], [218, 20]], tall: [[190, 6], [220, 6]], short: [[194, 46], [208, 46]] };
let n = 0;
/* viewBox 0 0 240 160, ground at 150; the neck and head (.zhead) turn about the shoulder at (156,74) to reach the grass */
export function zebu(v = 0): string {
  const c = COWS[v % COWS.length], id = 'zb' + (n++);
  // a tapered leg with its knee or hock, and the hoof, moving together
  const leg = (cls, x, top, front, col) => `<g class="zl ${cls}"><path d="${front
      ? `M${x - 6} ${top} L${x + 7} ${top} L${x + 5} ${top + 22} L${x + 4} 143 L${x - 2} 143 L${x - 3} ${top + 22} Z`
      : `M${x - 10} ${top} L${x + 8} ${top + 2} L${x + 4} ${top + 20} L${x + 5} 143 L${x - 1} 143 L${x - 3} ${top + 24} Z`}" fill="${col}"/>` +
    `<path d="M${front ? x - 3 : x - 1.5} 141 h${front ? 8 : 7.5} l1 7 h-10 Z" fill="#231A14"/></g>`;
  const far = c.body[1], near = `url(#${id})`;
  return `<svg class="zebu" viewBox="0 0 240 160" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.body[0]}"/><stop offset=".7" stop-color="${c.body[0]}"/><stop offset="1" stop-color="${c.body[1]}"/></linearGradient></defs>` +
    `<ellipse cx="118" cy="150" rx="74" ry="5" fill="rgba(40,24,10,.25)"/>` +
    leg('b', 76, 104, false, far) + leg('d', 146, 108, true, far) +
    `<g class="ztail"><path d="M52 70 Q42 96 46 132" stroke="${c.body[1]}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M42 126 q2 14 8 4 q0 -8 -8 -4 Z" fill="#231A14"/></g>` +
    // the hump over the withers, leaning forward, its base hidden by the body
    `<path d="M126 70 C124 44 146 34 160 48 C166 56 164 66 158 72 Z" fill="${near}"/><path d="M136 48 Q146 42 154 47" stroke="#fff" stroke-opacity=".14" stroke-width="2" fill="none"/>` +
    `<path d="M54 66 C66 56 110 58 140 60 C160 62 172 76 172 94 C172 108 164 116 152 118 C130 122 100 122 82 118 C64 116 50 106 48 90 C47 80 49 72 54 66 Z" fill="${near}"/>` +
    `<path d="M62 70 Q100 62 140 66" stroke="#fff" stroke-opacity=".22" stroke-width="5" fill="none" stroke-linecap="round"/>` +
    `<path d="M50 92 C54 108 66 116 82 118 L80 104 C70 102 60 98 50 92 Z" fill="#000" opacity=".06"/><path d="M100 112 Q126 120 150 114" stroke="#000" stroke-opacity=".07" stroke-width="7" fill="none"/>` +
    `<path d="M150 80 Q160 92 156 110" stroke="#000" stroke-opacity=".07" stroke-width="3" fill="none"/>` +
    leg('a', 64, 100, false, c.body[0]) + leg('c', 158, 108, true, c.body[0]) +
    `<g class="zhead">` +
    // neck and dewlap, then the long head down to the dark muzzle; the horns rise from the poll
    `<path d="M146 62 C162 60 178 62 190 70 L196 92 C186 96 176 102 168 108 L150 96 Z" fill="${near}"/>` +
    `<path d="M164 102 C168 ${v % 3 === 2 ? 132 : 124} 180 ${v % 3 === 2 ? 136 : 128} 192 ${v % 3 === 2 ? 118 : 114} L196 94 Z" fill="${c.body[1]}"/><path d="M172 112 q6 4 13 1 M174 121 q5 3 11 -1" stroke="#000" stroke-opacity=".12" stroke-width="1.3" fill="none"/>` +
    `<path d="${HORNS[c.horns]}" stroke="${c.horn}" stroke-width="5.5" fill="none" stroke-linecap="round"/>` + TIPS[c.horns].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.9" fill="${c.tip}"/>`).join('') +
    `<path d="M187 64 C196 60 204 64 207 72 L219 100 C222 110 212 116 204 111 L189 92 C184 84 183 72 187 64 Z" fill="${c.body[0]}"/>` +
    `<path d="M194 66 Q200 70 204 80" stroke="#000" stroke-opacity=".08" stroke-width="3" fill="none"/>` +
    `<ellipse cx="212" cy="106" rx="8" ry="6.5" transform="rotate(-30 212 106)" fill="${c.muzzle}"/><circle cx="210" cy="104" r="1.3" fill="#000"/><circle cx="215.5" cy="106" r="1.3" fill="#000"/>` +
    `<path class="chew" d="M203 110 q4 3 9 2" stroke="${c.muzzle}" stroke-width="2" fill="none"/>` +
    `<ellipse cx="197" cy="77" rx="4.4" ry="3.4" fill="${c.eye}" opacity=".6"/><circle cx="197" cy="77" r="2.3" fill="#140C06"/><circle cx="197.8" cy="76.2" r=".7" fill="#fff"/>` +
    `<path d="M189 72 C180 70 172 74 170 80 C178 82 186 80 190 77 Z" fill="${c.body[1]}"/><path d="M176 74 C172 76 170 78 170 80 C174 80 176 79 178 77 Z" fill="${c.ear}"/>` +
    `</g></svg>`;
}
/* a tuft of savanna grass to graze on; two greens so the field is not flat */
export function tuft(v = 0): string {
  const g = ['#6B8E3A', '#8FA548', '#A9A050'][v % 3];
  return `<svg class="tuft" viewBox="0 0 40 22" aria-hidden="true"><path d="M4 22 Q6 9 10 4 M10 22 Q12 6 18 1 M16 22 Q18 10 24 5 M22 22 Q26 8 32 3 M28 22 Q30 12 36 7 M8 22 Q4 14 1 12 M34 22 Q36 16 39 14" stroke="${g}" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>`;
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
  try { bac = bac || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
  for (let k = 0; k < times; k++) { const t = bac.currentTime + .05 + k * .55;
    [[540, .09], [812, .05], [1290, .025]].forEach(([f, v]) => { const o = bac.createOscillator(), g = bac.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(f * (k % 2 ? .94 : 1), t);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .008); g.gain.exponentialRampToValueAtTime(.0001, t + .5); o.connect(g).connect(bac.destination); o.start(t); o.stop(t + .55); }); }
}
/* a low, unhappy moo for a wrong count */
export function moo(): void {
  try { bac = bac || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
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
  return `<span class="pboard"><i class="prope"></i><b>₦${m.toLocaleString('en-GB')}</b></span>`;
}
