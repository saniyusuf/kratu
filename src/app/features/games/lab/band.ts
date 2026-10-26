// @ts-nocheck
/*
 * Kalangu's music (Sani 2026-10-22): when the child names the picture the band plays one of fifteen rhythms (every one
 * at least three seconds); a wrong answer gets the kakaki's sigh. The band and the dancers are drawn in kalangu.ts.
 */
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
