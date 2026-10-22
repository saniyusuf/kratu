// @ts-nocheck
/*
 * Kalangu's band and dancers (Sani 2026-10-22). A kakaki player and two kalangu drummers stand to one side; when the
 * child names the picture the band plays one of fifteen rhythms (every one at least three seconds) and three dancers in
 * northern dress come out and dance: a woman in zani and kallabi, a man in kaftan and cap, a girl in a long dress and
 * headscarf. Nothing wild: swaying, stepping, clapping, arms raised. Moving parts by transform only.
 */
const SK = ['#7A4A26', '#5E3A1C', '#8B5A2B'];

function head(x, y, sk, hat) { return `<circle cx="${x}" cy="${y}" r="6" fill="${sk}"/><path d="M${x - 2.4} ${y + 1.6} q2.4 2 4.8 0" stroke="#3A1A0A" stroke-width="1" fill="none"/><circle cx="${x - 2}" cy="${y - 1}" r=".8" fill="#1A0E06"/><circle cx="${x + 2}" cy="${y - 1}" r=".8" fill="#1A0E06"/>${hat}`; }

export function kakakiPlayer(): string {
  return `<svg class="bandman" viewBox="-10 -46 60 116" aria-hidden="true"><ellipse cx="10" cy="68" rx="14" ry="2.6" fill="rgba(40,24,10,.25)"/>` +
    `<path d="M0 66 L2 26 Q10 20 18 26 L20 66 Z" fill="#C62828"/><path d="M10 26 V66" stroke="#FFD54A" stroke-width="1.2"/>` +
    head(10, 16, SK[0], `<path d="M3 14 Q10 2 17 14 Z" fill="#FFFFFF"/>`) +
    `<g class="horn"><path d="M14 20 L48 -40" stroke="#D9B44A" stroke-width="2.6" stroke-linecap="round"/><path d="M45 -38 l6 -10 l5 5 Z" fill="#E8C35A"/>` +
    `<path d="M4 30 Q12 26 15 20 M17 30 Q20 26 22 14" stroke="#C62828" stroke-width="4" stroke-linecap="round" fill="none"/></g></svg>`;
}

export function kalanguDrummer(v = 0): string {
  const robe = ['#1565C0', '#2E7D32'][v % 2], cap = ['#FFD54A', '#FFFFFF'][v % 2];
  return `<svg class="bandman drummer" viewBox="-12 0 60 76" aria-hidden="true"><ellipse cx="10" cy="72" rx="14" ry="2.6" fill="rgba(40,24,10,.25)"/>` +
    `<path d="M0 70 L2 30 Q10 24 18 30 L20 70 Z" fill="${robe}"/>` +
    head(10, 20, SK[(v + 1) % 3], `<path d="M4 17 Q10 8 16 17 Z" fill="${cap}"/>`) +
    `<g class="kdrum"><path d="M16 36 Q22 42 28 36 L28 52 Q22 46 16 52 Z" fill="#8B5A2B" stroke="#4E2E14" stroke-width=".6"/>` +
    `<ellipse cx="16" cy="44" rx="2" ry="8" fill="#F1E2C0"/><ellipse cx="28" cy="44" rx="2" ry="8" fill="#F1E2C0"/><path d="M17 37 L27 51 M17 51 L27 37" stroke="#F1E2C0" stroke-width=".7"/></g>` +
    `<path d="M4 34 Q12 44 18 44" stroke="${robe}" stroke-width="4" fill="none" stroke-linecap="round"/>` +
    `<g class="stick"><path d="M18 32 Q28 30 30 36" stroke="${robe}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M30 36 Q36 36 34 44" stroke="#5E3A1C" stroke-width="1.6" fill="none"/></g></svg>`;
}

/* 0: a woman in zani and kallabi · 1: a man in kaftan and cap · 2: a girl in a long dress and headscarf */
export function dancer(v = 0): string {
  const sk = SK[v % 3];
  if (v % 3 === 0) return `<svg class="dancer" viewBox="-14 -4 48 84" aria-hidden="true"><ellipse cx="10" cy="78" rx="12" ry="2.4" fill="rgba(40,24,10,.25)"/>` +
    `<g class="dbody"><path d="M2 76 L4 44 L16 44 L18 76 Z" fill="#C2185B"/><path d="M3 54 h14 M3 64 h15" stroke="#FFD54A" stroke-width="1.4"/>` +
    `<path d="M3 44 Q10 26 17 44 Z" fill="#FFB300"/>` + head(10, 18, sk, `<path d="M2 16 Q10 2 18 16 Q14 10 10 11 Q6 10 2 16 Z" fill="#C2185B"/><path d="M17 12 q4 2 5 -2" stroke="#C2185B" stroke-width="2.4" fill="none"/>`) +
    `<g class="armL"><path d="M5 30 Q-4 24 -6 12" stroke="#FFB300" stroke-width="3.6" fill="none" stroke-linecap="round"/></g><g class="armR"><path d="M15 30 Q24 24 26 12" stroke="#FFB300" stroke-width="3.6" fill="none" stroke-linecap="round"/></g></g></svg>`;
  if (v % 3 === 1) return `<svg class="dancer" viewBox="-14 -4 48 84" aria-hidden="true"><ellipse cx="10" cy="78" rx="12" ry="2.4" fill="rgba(40,24,10,.25)"/>` +
    `<g class="dbody"><path d="M0 76 L3 30 Q10 24 17 30 L20 76 Z" fill="#F4EBD0"/><path d="M8 30 L10 50 L12 30" stroke="#2E7D32" stroke-width="1.2" fill="none"/>` +
    head(10, 18, sk, `<path d="M3 15 Q10 4 17 15 Z" fill="#6A1B9A"/><path d="M4 13 h12" stroke="#FFD54A" stroke-width=".8"/>`) +
    `<g class="armL"><path d="M5 32 Q-4 34 -4 22" stroke="#F4EBD0" stroke-width="4" fill="none" stroke-linecap="round"/></g><g class="armR"><path d="M15 32 Q24 34 24 22" stroke="#F4EBD0" stroke-width="4" fill="none" stroke-linecap="round"/></g></g></svg>`;
  return `<svg class="dancer" viewBox="-14 -4 48 84" aria-hidden="true"><ellipse cx="10" cy="78" rx="12" ry="2.4" fill="rgba(40,24,10,.25)"/>` +
    `<g class="dbody"><path d="M2 76 L4 30 Q10 26 16 30 L18 76 Z" fill="#00897B"/><path d="M3 60 h15" stroke="#FFFFFF" stroke-width="1.2"/>` +
    head(10, 20, sk, `<path d="M2 20 Q2 8 10 8 Q18 8 18 20 L18 30 Q10 34 2 30 Z" fill="#FFD54A" opacity=".95"/>`) +
    `<circle cx="10" cy="20" r="5" fill="${sk}"/><circle cx="8" cy="19" r=".8" fill="#1A0E06"/><circle cx="12" cy="19" r=".8" fill="#1A0E06"/><path d="M8 22.4 q2 1.6 4 0" stroke="#3A1A0A" stroke-width="1" fill="none"/>` +
    `<g class="armL"><path d="M5 34 Q0 40 4 44" stroke="#00897B" stroke-width="3.6" fill="none" stroke-linecap="round"/></g><g class="armR"><path d="M15 34 Q20 40 16 44" stroke="#00897B" stroke-width="3.6" fill="none" stroke-linecap="round"/></g></g></svg>`;
}

/*
 * Fifteen rhythms for the kalangu band, each two bars of sixteenths at about 120 beats a minute (32 steps of 125 ms,
 * four seconds). H: the talking drum high, L: low, B: squeezed so the pitch rises, G: the ganga's deep thump,
 * K: a kakaki blast, .: rest. One is picked at random each time, never the same twice in a row.
 */
export const RHYTHMS = [
  'K...H.L.H.L.G...H.L.H.LBG.......',
  'G.H.H.L.G.H.H.L.G.H.H.L.B...K...',
  'H..LH..LG..BH..LH..LG..BK.......',
  'K.......G.HLH.G.HLH.G.BB..G.HL..',
  'H.H.L...H.H.L...G.G.B.B.H.L.H...',
  'GHL.GHL.GHLBGHL.K...H.L.H.L.B...',
  'B..HB..HL.L.G...B..HB..HL.L.K...',
  'K...K...H.LLH.LLG.BBG.BBH.L.....',
  'H.L.B.L.H.L.B.L.G.G.G...K.......',
  'G...HHL.G...HHL.G.B.HHL.G...B...',
  'HLHLB...HLHLB...GGL.GGL.K.......',
  'K.H.H.H.L...B.L.H.H.H.L...B.G...',
  'G.L.H.B.G.L.H.B.G.L.H.B.HHL.K...',
  'H...L...B.B.H...L...B.B.G.G.K...',
  'HB.LHB.LG..GHB.LHB.LG..GK.......',
];
let lastR = -1;
export function pickRhythm(): number { let i; do { i = Math.floor(Math.random() * RHYTHMS.length); } while (i === lastR && RHYTHMS.length > 1); lastR = i; return i; }

/** Play rhythm i on an AudioContext; returns its length in ms. */
export function playRhythm(ac: AudioContext, i: number): number {
  const pat = RHYTHMS[i], step = 0.125, t0 = ac.currentTime + 0.05, out = ac.createGain(); out.gain.value = .8; out.connect(ac.destination);
  const tone = (t, f0, f1, dur, type = 'sine', vol = .5) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur * .8);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + dur); o.connect(g).connect(out); o.start(t); o.stop(t + dur + .05); };
  const kakaki = (t) => { const o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter(), lfo = ac.createOscillator(), lg = ac.createGain();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(233, t); f.type = 'lowpass'; f.frequency.value = 1400; lfo.frequency.value = 6; lg.gain.value = 5; lfo.connect(lg).connect(o.frequency);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.18, t + .06); g.gain.setValueAtTime(.18, t + .5); g.gain.exponentialRampToValueAtTime(.0001, t + .75);
    o.connect(f).connect(g).connect(out); o.start(t); lfo.start(t); o.stop(t + .8); lfo.stop(t + .8); };
  for (let k = 0; k < pat.length; k++) { const c = pat[k], t = t0 + k * step;
    if (c === 'H') tone(t, 330, 270, .18); else if (c === 'L') tone(t, 170, 120, .25); else if (c === 'B') tone(t, 190, 330, .3, 'sine', .45);
    else if (c === 'G') { tone(t, 95, 55, .3, 'sine', .7); } else if (c === 'K') kakaki(t); }
  return Math.round(pat.length * step * 1000) + 300;
}
/** the band's displeasure: a falling, unhappy two-note kakaki */
export function playSigh(ac: AudioContext): void {
  const t = ac.currentTime + .03, o = ac.createOscillator(), g = ac.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(220, t); o.frequency.setValueAtTime(220, t + .3); o.frequency.exponentialRampToValueAtTime(150, t + .9);
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.12, t + .05); g.gain.exponentialRampToValueAtTime(.0001, t + 1); o.connect(g).connect(ac.destination); o.start(t); o.stop(t + 1.05);
}
