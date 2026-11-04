// @ts-nocheck
/*
 * A title unlocked (Sani approved the unlock page, 4 Nov 2026): played over a passed game's results the moment its gold
 * fills a bag. The screen dims, the rays turn, the title's own stage rises, the medal drops dark with a "?", a flash
 * reveals it, the name unfurls on a gold ribbon letter by letter, and the new bag fills with three coins. The sound is
 * made here (Web Audio, nothing to licence) and sits quiet under Laila; her lines go through the app's bus. At the end
 * she glows with the app's pointing hand, and only a press on her carries on; the music stops that moment.
 * Transform and opacity only, for cheap tablets.
 */
import { liveAC } from './audioctx';
import { BAG, MEDALS, STAGES } from './unlock-art';

export interface UnlockIO {
  laila: string;
  /** Laila's lines, one at a time on the app's bus: resolves false if cut off */
  say(key: string): Promise<boolean>;
  hush(): void;
  /** the app's pointing hand beside an element, or away */
  spot?(el: Element | null): void;
}
export interface UnlockHandle { stop(): void; again(): void; }

const FW = [[18, 22, '#FFD54A', 1.6], [82, 20, '#E63946', 2.0], [30, 40, '#1FA1D8', 2.6], [72, 44, '#FFD54A', 3.0], [50, 14, '#2FAE9E', 3.4], [16, 52, '#E63946', 3.9], [86, 50, '#8A5FBF', 4.3]];

/** i: the title (0 Jarumi … 4 Sarki), name: the child's form of it, colour: the title's own, lines: Laila's keys in order */
export function playUnlock(host: HTMLElement, i: number, name: string, colour: string, lines: string[], io: UnlockIO, done: () => void): UnlockHandle {
  const o = i + 1, top = i === 4;   // the page's stage numbers: l2 shield … l6 canopy
  let dead = false, tok = 0, ac = null, bus = null, NB = null;
  const timers = [];
  const later = (ms, f) => { timers.push(setTimeout(f, ms)); };

  /* ---------- the picture ---------- */
  const ladder = [0, 1, 2, 3, 4].map((k) => '<i class="' + (k === i ? 'u-new' : k < i ? 'u-won' : '') + '">' + BAG + (k === i ? '<b class="u-fc"></b><b class="u-fc"></b><b class="u-fc"></b>' : '') + '</i>').join('');
  const fw = top ? FW.map((f) => '<div class="u-fw" style="--c:' + f[2] + ';--d:' + f[3] + 's;left:' + f[0] + '%;top:' + f[1] + '%"></div>').join('') : '';
  const cols = ['#FFD54A', '#E63946', '#1FA1D8', '#2FAE9E', '#8A5FBF', '#4CAF50', colour];
  let conf = '';
  for (let k = 0, n = 17 + i * 9; k < n; k++) conf += '<i style="left:' + ((k * 37 + o * 11) % 100) + '%;background:' + cols[k % cols.length] + ';--d:' + (2.4 + ((k * 7) % 15) / 10).toFixed(2) + 's;--t:' + (2 + ((k * 5) % 10) / 10).toFixed(2) + 's"></i>';
  if (top) for (let k = 0; k < 26; k++) conf += '<i style="left:' + ((k * 29) % 100) + '%;width:1.6cqw;height:1.6cqw;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFF1A8,#F7C93E 50%,#C98A0C);--d:' + (1.2 + ((k * 3) % 20) / 10).toFixed(2) + 's;--t:2.2s"></i>';
  const ribbon = Array.from(name).map((c, k) => c === ' ' ? ' ' : '<b style="--i:' + k + '">' + c + '</b>').join('');
  const el = document.createElement('div');
  el.className = 'zul';
  el.innerHTML = '<div class="u-dim"></div><div class="u-rays"></div><div class="u-vign"></div>' + fw +
    '<div class="u-stage l' + (o + 1) + '">' + STAGES[i] + '</div><div class="u-ring"></div><div class="u-flash"></div><div class="u-medalw">' + MEDALS[i] + '</div>' +
    '<div class="u-ribbon">' + ribbon + '</div><div class="u-ladder">' + ladder + '</div><div class="u-lglow"></div>' +
    '<button type="button" class="u-lailaw" aria-label="Laila">' + io.laila + '</button><div class="u-conf">' + conf + '</div>';
  host.appendChild(el);
  const lb = el.querySelector('.u-lailaw');

  /* ---------- the sound (the page's sfx.js) ---------- */
  function ctx() { try { ac = liveAC(ac); if (ac.state === 'suspended') ac.resume(); return ac; } catch (e) { return null; } }
  function stopMusic() { if (bus && ac) { const g = bus; try { g.gain.cancelScheduledValues(ac.currentTime); g.gain.setTargetAtTime(0, ac.currentTime, .05); setTimeout(() => g.disconnect(), 500); } catch (e) { /* gone */ } } bus = null; }
  function tone(t, f, d, type, v, f2) { const x = ac.createOscillator(), g = ac.createGain(); x.type = type || 'sine'; x.frequency.setValueAtTime(f, t); if (f2) x.frequency.exponentialRampToValueAtTime(f2, t + d);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + d); x.connect(g); g.connect(bus); x.start(t); x.stop(t + d + .05); }
  function noiseBuf() { if (!NB) { NB = ac.createBuffer(1, ac.sampleRate, ac.sampleRate); const d = NB.getChannelData(0); for (let k = 0; k < d.length; k++) d[k] = Math.random() * 2 - 1; } return NB; }
  function noise(t, d, v, ft, f, f2, q) { const s = ac.createBufferSource(); s.buffer = noiseBuf(); const fl = ac.createBiquadFilter(); fl.type = ft || 'bandpass'; fl.frequency.setValueAtTime(f || 1000, t);
    if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + d); fl.Q.value = q || 1; const g = ac.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .01);
    g.gain.exponentialRampToValueAtTime(.0001, t + d); s.connect(fl); fl.connect(g); g.connect(bus); s.start(t); s.stop(t + Math.min(d + .05, .99)); }
  function drum(t, v) { tone(t, 140, .35, 'sine', v, 45); noise(t, .08, v * .35, 'lowpass', 900); }
  function brass(t, f, d, v) { const a = ac.createOscillator(), b = ac.createOscillator(), fl = ac.createBiquadFilter(), g = ac.createGain(); a.type = b.type = 'sawtooth'; a.frequency.value = f; b.frequency.value = f * 1.006;
    fl.type = 'lowpass'; fl.frequency.setValueAtTime(600, t); fl.frequency.linearRampToValueAtTime(2600, t + .08); fl.frequency.linearRampToValueAtTime(1400, t + d);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .04); g.gain.setValueAtTime(v, t + d - .06); g.gain.linearRampToValueAtTime(0, t + d);
    a.connect(fl); b.connect(fl); fl.connect(g); g.connect(bus); a.start(t); b.start(t); a.stop(t + d + .02); b.stop(t + d + .02); }
  function chime(t, f, v) { tone(t, f, 1.2, 'sine', v); tone(t, f * 2.76, .5, 'sine', v * .3); }
  function music() {
    const c = ctx(); if (!c) return; stopMusic(); bus = c.createGain(); bus.connect(c.destination);
    const t = c.currentTime + .05, G0 = .5 + o * .06; let k, x;
    bus.gain.setValueAtTime(G0, t);
    for (k = 0, x = 0; x < 2.15; k++) { drum(t + x, .12 + .45 * (x / 2.15)); x += Math.max(.06, .32 - k * .025); }   // the drum roll up to the reveal
    drum(t + 2.25, 1); noise(t + 2.2, .95, .3, 'highpass', 5000, 9000, .7);                                               // the reveal: boom and shimmer
    const sc = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98, 2093]; for (k = 0; k < 3 + o; k++) chime(t + 2.3 + k * .11, sc[k % 7], .2);   // a longer chime run for each title
    [261.63, 329.63, 392].forEach((f) => { const y = c.createOscillator(), g = c.createGain(); y.type = 'triangle'; y.frequency.value = f; g.gain.setValueAtTime(0, t + 2.4);
      g.gain.linearRampToValueAtTime(.05, t + 3); g.gain.setValueAtTime(.05, t + 5.8); g.gain.linearRampToValueAtTime(0, t + 7.6); y.connect(g); g.connect(bus); y.start(t + 2.4); y.stop(t + 7.7); });
    bus.gain.setValueAtTime(G0, t + 2.9); bus.gain.linearRampToValueAtTime(G0 * .3, t + 3.05); bus.gain.setValueAtTime(G0 * .3, t + 5.4); bus.gain.linearRampToValueAtTime(G0 * .6, t + 5.8);   // quiet under Laila
    if (o === 1) { [523, 1176, 1840, 2730].forEach((f) => { tone(t + .85, f, 1.2, 'sine', .08); tone(t + .85, f * 1.01, .6, 'square', .02); }); noise(t + .85, .2, .4, 'highpass', 2000);
      noise(t + 1.05, .15, .3, 'bandpass', 3000, 1500, 2); noise(t + 1.12, .15, .3, 'bandpass', 3300, 1500, 2); }                                   // shield clang, spears
    if (o === 2) for (k = 0; k < 9; k++) noise(t + .8 + k * .12, .1, .18, 'bandpass', 2500 + k * 80, 4000, 3);                                     // the pen scratching the allo
    if (o === 3) { noise(t + .55, .9, .3, 'bandpass', 300, 2500, 1.5); chime(t + 1.35, 1568, .14); }                                                 // the umbrella whooshes open
    if (o === 4) { [392, 440, 523.25, 587.33].forEach((f, j) => { tone(t + .45 + j * .2, f / 2, .3, 'triangle', .25); drum(t + .45 + j * .2, .35); });
      [2637, 3136].forEach((f, j) => tone(t + 1.45 + j * .12, f, .4, 'sine', .12)); }                                                                 // the steps rise, the key clinks
    if (o === 5) { x = .5; [[392, .2], [392, .12], [523.25, .2], [659.25, .25], [784, .7]].forEach((p) => { brass(t + x, p[0] / 2, p[1], .11); brass(t + x, p[0], p[1], .07); x += p[1] + .03; });
      [1.6, 2.0, 2.6, 3.0, 3.4, 3.9, 4.3].forEach((d) => { noise(t + d, .5, .3, 'lowpass', 1800, 300); noise(t + d + .08, .6, .1, 'highpass', 6000); }); }   // kakaki fanfare, fireworks
    [3.75, 3.95, 4.15].forEach((d, j) => { tone(t + d + .45, 2637 + j * 220, .3, 'sine', .14); tone(t + d + .45, 3951, .15, 'sine', .05); }); tone(t + 4.6, 180, .25, 'sine', .25, 90);   // coins into the bag, thump
    bus.gain.setValueAtTime(G0 * .6, t + 6.6); bus.gain.linearRampToValueAtTime(0, t + 8);
  }
  function pressChime() { const c = ctx(); if (!c) return; bus = c.createGain(); bus.connect(c.destination); const s = c.currentTime; [784, 1046.5, 1318.5].forEach((f, k) => tone(s + k * .08, f, .35, 'sine', .18)); }

  /* ---------- Laila ---------- */
  function sayAll() {
    const my = ++tok; let n = 0;
    el.classList.remove('u-ready'); el.classList.add('u-talk'); if (io.spot) io.spot(null);
    (function next() {
      if (dead || my !== tok) return;
      if (n >= lines.length) { el.classList.remove('u-talk'); el.classList.add('u-ready'); if (io.spot) io.spot(lb); return; }
      io.say(lines[n++]).then((ok) => { if (dead || my !== tok) return; if (ok) later(250, next); else { n = lines.length; next(); } });
    })();
  }
  lb.addEventListener('click', (e) => {
    e.stopPropagation(); if (dead || !el.classList.contains('u-ready')) return;
    tok++; stopMusic(); io.hush(); if (io.spot) io.spot(null);
    el.classList.remove('u-ready'); el.classList.add('u-go'); pressChime();
    later(600, () => { if (dead) return; finish(); done(); });
  });
  function finish() { dead = true; tok++; timers.forEach(clearTimeout); stopMusic(); if (io.spot) io.spot(null); }

  void el.offsetWidth; el.classList.add('u-run'); music();
  later(3000, sayAll);
  return {
    stop() { if (dead) return; finish(); io.hush(); el.remove(); },
    again() { if (!dead && (el.classList.contains('u-ready') || el.classList.contains('u-talk'))) { io.hush(); sayAll(); } },
  };
}
