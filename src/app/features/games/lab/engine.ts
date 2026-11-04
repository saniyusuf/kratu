// @ts-nocheck
/*
 * The judging games, moved from the proposal page (games.js) into the app. One small engine, eight games: every one asks
 * first (Laila = Na sani, the slate = Ban sani ba), counts 3-2-1, plays against a clock, and ends on stars and gold.
 * The balloons are not here: they are the app's own Fashe screen.
 *
 * Nothing in here ever changes the size or place of anything else on the screen: the whole game draws inside one fixed
 * box (.nofit) and every piece moves by transform and opacity only (Sani 2026-10-14: "nothing moving as the game is played").
 * Sound goes through the screen (io): Laila's lines and the English words one at a time on the app's bus, the yay and
 * nope on their own channel so they never cut her off. The speaking games listen with the app's recogniser.
 */
import { bootArt } from './art';
import { bootArt4 } from './art4';
import { react, restScene, bowl2 } from './rest';
import { moreGames } from './games2';
import { buloHouse } from './sc-bulo';
import { tukPot } from './sc-tukwane';
import { pickRhythm, playRhythm, playSigh } from './band';
import * as KL from './kalangu';
import { argunguScene, argunguWater, fisherman as argFisher, basket, fish4 } from './kamun';
import { liveAC, closeAC } from './audioctx';
import { BAG, U_DEFS } from './unlock-art';
import { playUnlock } from './unlock';

export interface GameIO {
  K: any;                          // pictures, words, letters and line keys (see GameLabScreen)
  female: boolean;
  say(src: string): Promise<boolean>;
  hush(): void;
  sfx(src: string): void;
  hear(o: any): { done: Promise<any>; stop(): void };
  match(raw: string, word: string, among: string[]): string | null;
  rect(el: Element): DOMRect;
  leave(): void;
  tester?: boolean;
  next?: (r?: any) => void;
  firstTime?: () => boolean;
  /** a passed course game's Zinari: the gold, the totals before and after, the title, and Laila's lines for them */
  award?: (a: { stars: number; tries: number }) => any;
  amp?: () => number;
  preparing?: () => boolean;
  has?: (key: string) => boolean;  // is this line recorded? (a draft line not yet recorded is skipped)
  /** the child's Zinari total, for the five bags in a course game's status bar */
  zinari?: () => number;
  /** where each bag is full (LEVEL_AT) */
  levels?: number[];
  /** the app's pointing hand beside an element (null: away) */
  spot?: (el: Element | null) => void;
}
export interface GameHandle { stop(): void; again(): void; }
/** Inside a lesson (Haruffa's in-between games): only the letters learned so far, no opening
 *  question, and Laila on the score screen carries the child back into the lesson. */
export interface GameOpts { letters?: string[]; words?: string[]; lesson?: boolean;
  /** The course's game gate (Sani 2026-11-02): an intro before the game, a 75% pass, a retry with a new mix, then a review
   *  lesson of the words missed. `tries` is this attempt (1 or 2), `first` whether the child has never met this game (only then
   *  does Laila explain it), `sim` lets an adult mark words as failed before playing (the course simulator). */
  gate?: { tries: number; first: boolean; sim: boolean }; }

export function playGame(frame: HTMLElement, gid: string, io: GameIO, opts: GameOpts = {}): GameHandle {
  const KART = bootArt(), K = io.K, F = io.female ? 1 : 0, bg = frame.querySelector('.gbg');
  bootArt4(KART);
  let ac = null, live = null, gone = false, mic = null, unl = null;
  if (!frame.querySelector('#zb-sack')) frame.insertAdjacentHTML('beforeend', U_DEFS);   // the bag and medal gradients, once
  function rnd(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function h(html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }
  function sfx(k) { if (!gone) io.sfx(K[k]); }
  function drum(big) {
    if (gone) return;
    try { ac = liveAC(ac); } catch (e) { return; }
    var t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(big ? 140 : 220, t); o.frequency.exponentialRampToValueAtTime(big ? 60 : 110, t + .25);
    g.gain.setValueAtTime(.6, t); g.gain.exponentialRampToValueAtTime(.001, t + .35); o.connect(g).connect(ac.destination); o.start(t); o.stop(t + .4);
  }
  /* Kwale-kwale's sounds: the paddle pulling through water (filtered noise strokes), and a canoe going down (gurgle) */
  function noiseBuf(a, secs) { var n = Math.floor(a.sampleRate * secs), b = a.createBuffer(1, n, a.sampleRate), d = b.getChannelData(0); for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; return b; }
  function paddleSound(a) {
    for (var k = 0; k < 4; k++) { var t = a.currentTime + .05 + k * .32, src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
      src.buffer = noiseBuf(a, .4); f.type = 'bandpass'; f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(300, t + .3); f.Q.value = 1.2;
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.35, t + .05); g.gain.exponentialRampToValueAtTime(.0001, t + .32); src.connect(f).connect(g).connect(a.destination); src.start(t); src.stop(t + .4); }
  }
  function sinkSound(a) {
    for (var k = 0; k < 7; k++) { var t = a.currentTime + .05 + k * .16 + Math.random() * .05, o = a.createOscillator(), g = a.createGain(), f0 = 520 - k * 55;
      o.type = 'sine'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f0 * 1.6, t + .06); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.18, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + .09);
      o.connect(g).connect(a.destination); o.start(t); o.stop(t + .1); }
    var src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(), t0 = a.currentTime; src.buffer = noiseBuf(a, 1.2); f.type = 'lowpass'; f.frequency.value = 500;
    g.gain.setValueAtTime(.2, t0); g.gain.exponentialRampToValueAtTime(.0001, t0 + 1.1); src.connect(f).connect(g).connect(a.destination); src.start(t0); src.stop(t0 + 1.2);
  }
  /* a clay pot breaking: a bright crack, clinking shards, a dull thud */
  function crashSound(a) {
    var t = a.currentTime + .02, src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    src.buffer = noiseBuf(a, .5); f.type = 'highpass'; f.frequency.value = 1800; g.gain.setValueAtTime(.5, t); g.gain.exponentialRampToValueAtTime(.0001, t + .35); src.connect(f).connect(g).connect(a.destination); src.start(t); src.stop(t + .5);
    var o = a.createOscillator(), og = a.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(60, t + .2); og.gain.setValueAtTime(.4, t); og.gain.exponentialRampToValueAtTime(.0001, t + .25); o.connect(og).connect(a.destination); o.start(t); o.stop(t + .3);
    for (var k = 0; k < 5; k++) { var tk = t + .08 + k * .07 + Math.random() * .04, c = a.createOscillator(), cg = a.createGain(); c.type = 'triangle'; c.frequency.value = 2200 + Math.random() * 1600; cg.gain.setValueAtTime(.12, tk); cg.gain.exponentialRampToValueAtTime(.0001, tk + .08); c.connect(cg).connect(a.destination); c.start(tk); c.stop(tk + .1); }
  }
  function leapFish() { return '<svg viewBox="0 0 30 14" aria-hidden="true"><path d="M2 7 Q10 0 20 5 L28 1 L26 7 L28 13 L20 9 Q10 14 2 7 Z" fill="#7FA6B8"/><path d="M8 5 Q13 3 18 5" stroke="#E6F1F6" stroke-width="1" fill="none"/><circle cx="6" cy="6.4" r="1" fill="#1A2A30"/></svg>'; }
  function fisherman() {
    return '<svg viewBox="0 0 60 50" aria-hidden="true"><path d="M2 46 Q20 40 40 46 Z" fill="#8B6A3A" opacity=".6"/>' +
      '<path d="M18 44 L20 28 Q24 24 28 28 L30 44 Z" fill="#2F6B9A"/><circle cx="24" cy="22" r="4" fill="#5E3A1C"/><path d="M16 20 Q24 10 32 20 Z" fill="#D9B46A"/>' +
      '<path d="M27 30 L36 24" stroke="#2F6B9A" stroke-width="3" stroke-linecap="round"/><path d="M34 26 L56 6" stroke="#6B4422" stroke-width="1.2"/>' +
      '<g class="line"><path d="M56 6 Q58 26 57 40" stroke="#fff" stroke-width=".5" fill="none" opacity=".8"/><circle class="float" cx="57" cy="40" r="1.4" fill="#E53935"/></g></svg>';
  }
  /* one sound at a time, like the rest of the app: every line waits for the one before */
  function say(src, run) { if (!src || gone || (run && run.dead)) return Promise.resolve(false); return io.say(src).then(function (ok) { return ok && !gone && !(run && run.dead); }); }
  function lailaBtn(cls, label) { return '<button type="button" class="glaila ' + (cls || '') + '"><span class="lsvg">' + K.laila + '</span>' + (label ? '<small>' + label + '</small>' : '') + '</button>'; }
  function line(gid, which) { return K.lines[gid] && K.lines[gid][which]; }
  function closeMic() { if (mic) { try { mic.stop(); } catch (e) { /* closed */ } mic = null; } }
  /* A lesson's words (?words=, Sani 2026-11-02): every word game plays ALL of them, once each, instead of its own short
     list; the clock grows with the count. A key is not always the word as written (sorghum is "Guinea corn"), so the
     games read, spell and hear txt(), letters() and spoken(), and Laila says the key's own clip. */
  var LW = (opts.words || []).filter(function (w, k, a) { return K.pic[w] && K.en[w] && a.indexOf(w) === k; });
  function txt(w) { return (K.word && K.word[w]) || String(w).replace(/_/g, ' '); }
  function spoken(w) { return txt(w).toLowerCase(); }
  function letters(w) { return txt(w).toUpperCase().replace(/[^A-Z]/g, ''); }
  /** a two-word name is spelt without its space ("school uniform" = 13 letters), but its boxes keep the gap between the
      words, so the child sees two words: the box that starts the next word gets .wb (a margin). Gives the gap count. */
  function gaps(box, w) {
    var parts = txt(w).toUpperCase().split(/[^A-Z]+/).filter(Boolean), at = 0, n = 0;
    parts.forEach(function (p, k) { if (k && box.children[at]) { box.children[at].classList.add('wb'); n++; } at += p.length; });
    return n;
  }
  function secs(base, n, n0) { return Math.round(base * Math.max(1, n / n0)); }
  /** n words into rounds of at most `most`, as even as they come (20 by 6: 5 5 5 5) */
  function batches(ws, most) { var nb = Math.ceil(ws.length / most), out = [], k = 0; for (var b = 0; b < nb; b++) { var sz = Math.ceil((ws.length - k) / (nb - b)); out.push(ws.slice(k, k + sz)); k += sz; } return out; }

  function Run() {
    var self = this; this.scr = frame.querySelector('.gbox .scr') || frame.querySelector('.scr'); this.dead = false; this.timers = []; this.offs = []; this.miss = 0; this.right = 0; this.idle = 0; this.combo = 0; this.coins = 0; this.cur = null; this.seen = []; this.res = {};
    this.onDown = function (e) { self.lastEl = e.target.closest && e.target.closest('button'); };
    this.scr.addEventListener('pointerdown', this.onDown);
  }
  /** the word (or letter) now being asked: a right answer counts for it only if nothing went wrong on it first */
  Run.prototype.item = function (k) { this.cur = k; if (this.seen.indexOf(k) < 0) this.seen.push(k); };
  Run.prototype.later = function (ms, f) { var t = setTimeout(f, ms); this.timers.push(t); return t; };
  Run.prototype.stop = function () { this.dead = true; this.timers.forEach(clearTimeout); clearInterval(this.tick); this.hold(); closeMic(); io.hush(); this.scr.removeEventListener('pointerdown', this.onDown); this.offs.forEach(function (f) { f(); }); this.offs = []; };
  /* the clock: a bar that empties; right answers give 4 s back, wrong ones take 8. It stands still while the mic is open. */
  Run.prototype.clock = function (secs, onOut) {
    var self = this; this.left = secs * 1000; this.full = secs * 1000;
    var c = h('<div class="gclock"><span class="hcoin"><span class="coin s">Z</span><b class="cn">0</b></span><span class="bar"><i></i></span><b class="tm">' + secs + '</b><span class="combo"></span></div>'); this.scr.appendChild(c); this.cel = c;
    if (opts.gate && io.zinari) c.querySelector('.hcoin').insertAdjacentHTML('afterend', zbags(io.zinari(), LV0));   // the child's five bags, always in sight in a course game (Sani 2026-11-04)
    var last = performance.now();
    this.tick = setInterval(function () {
      var now = performance.now(), dt = now - last; last = now;
      if (self.listening) { self.hold(); return; }
      self.left -= dt;
      if (self.left <= 0) { self.left = 0; clearInterval(self.tick); onOut(); }
      self.paint();
      self.idle += 250;                                   // reminders: 10 s, 10 s more, then a 20 s rest
      var due = [10000, 20000, 40000, 50000, 70000, 80000];
      if (due.indexOf(self.idle) >= 0 && self.remind) self.remind();
    }, 250);
    this.paint();
  };
  /* The bar used to get a fresh .25 s transition to the new value on every tick, four a second, each costing the main
     thread a frame. It is now ONE linear animation that runs the same 250 ms behind the clock those chained transitions
     did, re-aimed only when the clock jumps (a bump, or going on after the mic) and brought to rest exactly where the
     last transition would have stopped when the clock stands (the mic is open, or the round is over). The number is
     written only when it changes. */
  Run.prototype.paint = function () {
    var c = this.cel; if (!c) return;
    if (!c._bar) { c._bar = c.querySelector('i'); c._tm = c.querySelector('.tm'); }
    var p = Math.max(0, this.left / this.full), now = performance.now(), s = String(Math.ceil(this.left / 1000));
    if (c._tm.textContent !== s) c._tm.textContent = s;
    c.classList.toggle('low', this.left < 15000);
    c._last = p; c._lastT = now;
    if (c._anim && !c._held && Math.abs(c._p0 - (now - c._t0) / this.full - p) < .001) return;   // already on its way there
    var from = barAt(c, now, this.full), d = 250 + p * this.full;
    if (c._anim) c._anim.cancel();
    c._anim = c._bar.animate([{ transform: 'scaleX(' + from + ')' }, { transform: 'scaleX(' + p + ')', offset: 250 / d }, { transform: 'scaleX(0)' }], { duration: d, easing: 'linear', fill: 'forwards' });
    c._from = from; c._p0 = p; c._t0 = now; c._held = false;
  };
  /** the clock stands: the bar finishes the move to the last value painted and stays there */
  Run.prototype.hold = function () {
    var c = this.cel; if (!c || !c._anim || c._held) return;
    var now = performance.now(), from = barAt(c, now, this.full), d = Math.max(0, c._lastT + 250 - now);
    c._anim.cancel(); c._anim = c._bar.animate([{ transform: 'scaleX(' + from + ')' }, { transform: 'scaleX(' + c._last + ')' }], { duration: d, easing: 'linear', fill: 'forwards' });
    c._from = from; c._p0 = c._last; c._t0 = now; c._held = true; c._hd = d;
  };
  /** where the bar's animation has it now */
  function barAt(c, now, full) {
    if (!c._anim) return c._last;
    var e = now - c._t0;
    if (c._held) return e >= c._hd ? c._p0 : c._from + (c._p0 - c._from) * e / c._hd;
    return e < 250 ? c._from + (c._p0 - c._from) * e / 250 : Math.max(0, c._p0 - (e - 250) / full);
  }
  Run.prototype.bump = function (ms) { this.left = Math.max(0, Math.min(this.full, this.left + ms)); this.paint(); var b = h('<span class="bump ' + (ms > 0 ? 'up' : 'down') + '">' + (ms > 0 ? '+' : '−') + Math.abs(ms / 1000) + '</span>'); this.cel.appendChild(b); setTimeout(function () { b.remove(); }, 900); };
  Run.prototype.spark = function (el, pts) {
    var sr = io.rect(this.scr), r = el && el.getBoundingClientRect ? io.rect(el) : null;
    var x = r ? r.left + r.width / 2 - sr.left : sr.width / 2, y = r ? r.top + r.height / 2 - sr.top : sr.height / 2, k = sr.width / 100;
    var box = h('<div class="fx" style="left:' + x + 'px;top:' + y + 'px"></div>'), cols = ['#FFD54A', '#FFF1A8', '#4CAF50', '#1FA1D8', '#E63946'];
    var s = '';   // one parse for the burst, not eleven
    for (var i = 0; i < 10; i++) { var a = i / 10 * Math.PI * 2, d = (6 + (i % 3) * 3) * k; s += '<i style="--dx:' + Math.cos(a) * d + 'px;--dy:' + Math.sin(a) * d + 'px;background:' + cols[i % 5] + '"></i>'; }
    if (pts) s += '<b>+' + pts + '</b>';
    box.insertAdjacentHTML('beforeend', s);
    this.scr.appendChild(box); setTimeout(function () { box.remove(); }, 900);
  };
  Run.prototype.good = function (el) {
    if (this.cur != null && !(this.cur in this.res)) this.res[this.cur] = 1;
    this.right++; this.idle = 0; this.combo++; var pts = 10 * Math.min(3, this.combo); this.coins += pts; sfx('yay');
    if (this.cel && !this.noBump) this.bump(4000);
    this.spark(el || this.lastEl, pts);
    if (this.cel) { var cn = this.cel.querySelector('.cn'); cn.textContent = this.coins; cn.parentNode.classList.remove('pulse'); void cn.offsetWidth; cn.parentNode.classList.add('pulse');
      var cb = this.cel.querySelector('.combo'); cb.innerHTML = this.combo >= 2 ? '🔥 ×' + Math.min(3, this.combo) : ''; cb.classList.toggle('on', this.combo >= 2); }
  };
  Run.prototype.bad = function (el) { if (this.cur != null) this.res[this.cur] = 0; this.miss++; this.idle = 0; this.combo = 0; sfx('nope'); if (this.cel) { var cb = this.cel.querySelector('.combo'); cb.innerHTML = ''; cb.classList.remove('on'); } this.scr.classList.remove('hit'); void this.scr.offsetWidth; this.scr.classList.add('hit'); if (this.cel && !this.noBump) this.bump(-8000); if (el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); } };

  /* The speaking games: Laila is the microphone. Press her, say it, and the answer comes back to `heard`.
     While she listens she glows red and the clock waits, so a slow speaker is never punished for the recogniser. */
  function micBox(run) {
    /* the same Laila the lessons press (Sani 2026-10-22): her glow, the green hear-rings, the sound bubble that moves
       with the child's voice, the REC tag, a hop when right and a head-shake when wrong */
    var box = h('<div class="mic micx"><span class="yn yes abc-start x-laila cue" role="button" aria-label="Laila"><span class="lglow"></span><span class="hearrings"></span>' +
      '<span class="lmw"><span class="lm">' + K.laila + '</span></span><span class="beak"></span><span class="hearbubble" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>' +
      '<span class="lhand">👆🏾</span><small>Faɗa</small></span></div>');
    var btn = box.querySelector('.x-laila'), raf = 0;
    function level() { if (run.dead) { raf = 0; return; } btn.style.setProperty('--amp', String(io.amp ? io.amp() : 0)); btn.classList.toggle('prep', !!(io.preparing && io.preparing())); raf = requestAnimationFrame(level); }
    box.listen = function (opts, heard, right) {
      box.heard = heard; box.right = right;
      if (io.tester && !box.querySelector('.tester')) {     // ?tester=1 in the link only: answer for the child, for a desk without a microphone
        var t = h('<span class="tester"><button type="button" class="ok">✓</button><button type="button" class="no">✗</button></span>'); box.appendChild(t);
        t.querySelector('.ok').onclick = function () { if (!run.dead && !run.listening && !box.busy) box.heard({ value: box.right(), raw: 'test' }); };
        t.querySelector('.no').onclick = function () { if (!run.dead && !run.listening && !box.busy) box.heard({ value: Array.isArray(box.right()) ? ['Q'] : 'zzz', raw: 'test', wrong: 'Q' }); };
      }
      btn.onclick = function () {
        if (run.dead || run.listening || box.busy) return;
        io.hush(); run.idle = 0; run.listening = true; btn.classList.remove('cue', 'yay', 'nope'); btn.classList.add('rec'); box.classList.add('rec'); level();
        var hh = io.hear(opts()); mic = hh;
        hh.done.then(function (r) {
          if (mic === hh) mic = null; cancelAnimationFrame(raf); btn.style.setProperty('--amp', '0');
          run.listening = false; btn.classList.remove('rec', 'prep'); box.classList.remove('rec'); if (run.dead) return;
          heard(r || { value: null, raw: '' });
        });
      };
    };
    /** open the microphone without a press, as if Laila had been pressed (the Durbar listens on its own, Sani 2026-10-23) */
    box.go = function () { if (btn.onclick) btn.onclick(); };
    box.cue = function (on) { box.busy = false; btn.classList.toggle('cue', on !== false); };   // ready for an answer
    box.yay = function () { btn.classList.remove('yay', 'nope'); void btn.offsetWidth; btn.classList.add('yay'); setTimeout(function () { btn.classList.remove('yay'); }, 800); };
    box.nope = function () { btn.classList.remove('yay', 'nope'); void btn.offsetWidth; btn.classList.add('nope'); setTimeout(function () { btn.classList.remove('nope'); }, 800); };
    return box;
  }


  /* ---------- the three screens every game shares ---------- */
  function start() {
    if (live) live.stop();
    var g = GAMES[gid], run = new Run(); live = run;
    run.scr.className = 'scr p ' + g.cls;
    var PAINT = { 'j-abubuwa': 'underriver', 'j-magana': 'courtyard', 'j-nemo': 'market', 'j-lambobi': 'nightvillage', 'j-karatu': 'riverart', 'j-rubutu': 'potteryard', 'j-rubutu-say': 'savanna' };
    var scene = KART.scene[g.scene || PAINT[gid]] || '';
    if (gid === 'j-abubuwa') scene = '<div class="scene paint">' + argunguScene() + argunguWater() + '</div>';   // Argungu on festival day
    scene = restScene(gid) || scene;   // the drawn scenes of 2026-10-25 (rest.ts)
    bg.classList.remove('cheer', 'sad'); bg.innerHTML = scene; run.scr.innerHTML ='<div class="eye">' + g.title + '</div>';   // the scene fills the whole screen, behind the game's box
    var go = function () {
      if (run.dead) return;
      var cd = h('<div class="cdown"><b></b></div>'); run.scr.appendChild(cd); var steps = ['3', '2', '1', 'Fara!'], i = 0;
      (function tick() {
        if (run.dead) return; if (i >= steps.length) { cd.remove(); g.play(run, function (r) { result(run, r); }); return; }
        var b = cd.querySelector('b'); b.textContent = steps[i]; b.classList.remove('in'); void b.offsetWidth; b.classList.add('in'); drum(i === 3); i++; run.later(i === 4 ? 650 : 600, tick);
      })();
    };
    var how = g.noHow ? null : line(gid, 'how');   // a game whose example teaches it skips the spoken how-to before the 3-2-1
    if (opts.gate) { intro(run, how, go); return; }
    if (how) {
      var s = h('<div class="gsay">' + lailaBtn('talking') + '</div>'); run.scr.appendChild(s);   // Laila explains out loud; nothing written
      var skip = false; s.querySelector('.glaila').onclick = function () { if (skip) return; skip = true; io.hush(); s.remove(); go(); };   // a tap while she explains starts the game
      say(how, run).then(function () { if (skip || run.dead) return; skip = true; s.remove(); go(); });
    } else go();
  }
  /* ---------- the course's game gate (Sani 2026-11-02) ---------- */
  /** what this game asks: the lesson's words, or its letters */
  function gateItems() { return LW.length ? LW.slice() : (opts.letters || []).slice(); }
  function chip(k) { return K.pic[k] ? '<img alt="" src="' + K.pic[k] + '">' : '<b>' + k + '</b>'; }
  function stars4(n) { return '<div class="g4stars">' + [1, 2, 3, 4].map(function (i) { return (i === 4 ? '<span class="g4line"></span>' : '') + '<i class="' + (i <= n ? 'on' : '') + '"></i>'; }).join('') + '</div>'; }
  function tries(n) { return '<div class="gtries">' + [1, 2].map(function (i) { return '<i class="' + (i <= n ? 'on' : '') + '"></i>'; }).join('') + '</div>'; }
  var simMissed = null;   // the words an adult marked as failed on the intro (the simulator), or null to score the real play
  /** Before every game in the course: the scene behind, the name on a ribbon, every word's picture, the four stars with the
   *  pass line after the third, the tries, and Laila to press. She explains the game only the first time it is met. */
  function intro(run, how, go) {
    var g = GAMES[gid], items = gateItems(), sim = opts.gate.sim;
    var o = h('<div class="gintro">' + tries(opts.gate.tries) + '<div class="gi-ban">' + g.title + '</div>' +
      (items.length ? '<div class="gi-chips' + (items.length > 10 ? ' many' : '') + '">' + items.map(function (k) { return '<button type="button" class="gi-chip" data-k="' + k + '" aria-label="' + (K.pic[k] ? spoken(k) : k) + '">' + chip(k) + '</button>'; }).join('') + '</div>' : '') +
      stars4(0) + '<div class="gi-go">' + lailaBtn('talking') + '<span class="gi-hand">👉🏾</span></div>' +
      (sim ? '<div class="gi-sim"><small>Simulate: tap pictures to mark them failed</small><button type="button" class="gi-skip">Skip to results ›</button></div>' : '') + '</div>');
    run.scr.appendChild(o);
    var lb = o.querySelector('.glaila'), started = false, marked = [];
    if (sim) {
      [].forEach.call(o.querySelectorAll('.gi-chip'), function (c) { c.onclick = function () { var k = c.dataset.k, i = marked.indexOf(k); if (i < 0) marked.push(k); else marked.splice(i, 1); c.classList.toggle('fail', i < 0); }; });
      o.querySelector('.gi-skip').onclick = function () { if (started) return; started = true; simMissed = marked.slice(); io.hush(); bg.classList.remove('gdim');
        result(run, { finished: true, right: items.length - marked.length, part: items.length ? 1 - marked.length / items.length : 1, banner: true }); };
    }
    lb.onclick = function () { if (started) return; started = true; if (sim && marked.length) simMissed = marked.slice(); io.hush(); o.remove(); bg.classList.remove('gdim'); run.remind = null; go(); };
    var cue = function () { if (run.dead || started) return; lb.classList.remove('talking'); lb.classList.add('cue'); o.classList.add('ready'); };
    run.remind = function () { if (how) say(how, run).then(cue); else say(K.go, run).then(cue); };
    if (opts.gate.first && how) say(how, run).then(function (ok) { if (ok && !run.dead && !started) return say(K.go, run).then(cue); cue(); });
    else say(K.go, run).then(cue);
  }
  /** The gate's result, over the game's own scene with a mask: 75% passes; under it, Laila takes the child back to try again
   *  with a new mix, and after a second miss to a review lesson of the words missed (at least five, never more than ten). */
  function gateResult(run, r) {
    var items = gateItems(), missed;
    if (simMissed) missed = simMissed.slice();
    else if (items.length && run.seen.length) missed = items.filter(function (k) { return run.res[k] !== 1; });
    else if (r.missed) missed = [].concat(r.missed);
    else missed = null;
    var total = items.length || Math.max(1, run.right + run.miss);
    var score = missed ? (total - missed.length) / total : (r.part != null ? r.part : run.right / Math.max(1, run.right + run.miss));
    var pass = score >= .75 - 1e-9, n = Math.max(0, Math.min(4, Math.floor(score * 4 + 1e-9))), tryN = opts.gate.tries;
    var review = null;
    if (!pass && tryN >= 2 && missed && LW.length) {
      var rest = shuffle(LW.filter(function (k) { return missed.indexOf(k) < 0; }));
      review = missed.slice(0, 10); while (review.length < 5 && rest.length) review.push(rest.shift());
    }
    var snap = document.createElement('div'); snap.className = 'gsnapbox'; var sc = run.scr.cloneNode(true);
    [].forEach.call(sc.querySelectorAll('video,audio'), function (e) { e.remove(); }); snap.appendChild(sc); bg.appendChild(snap);   // the game as it stood, behind the mask
    var res = new Run(); live = res;
    res.scr.className = 'scr r gres' + (pass ? ' pass' : ''); bg.classList.add('gdim');
    var aw = pass && io.award ? io.award({ stars: n, tries: tryN }) : null;
    var mid = pass && aw ? zinHtml(aw)
      : pass ? '<div class="gold"><span class="coin">Z</span><b>+' + Math.max(50, Math.floor((100 + run.right * 20) / 50) * 50) + '</b><small>Zinari</small></div>'
      : tryN < 2 ? '<div class="gr-row">' + shuffle(items).slice(0, 10).map(function (k, i) { return '<span class="gr-fly" style="animation-delay:-' + (i * .23).toFixed(2) + 's">' + chip(k) + '</span>'; }).join('') + '</div>'
      : '<div class="gr-book">' + (review || missed || []).map(function (k) { return '<span class="' + (missed && missed.indexOf(k) >= 0 ? 'miss' : '') + '">' + chip(k) + '</span>'; }).join('') + '</div>';
    res.scr.innerHTML = stars4(n) + mid + '<div class="gi-go">' + lailaBtn('talking') + '<span class="gi-hand">👉🏾</span></div>' + (pass ? '' : tries(tryN));
    var lb = res.scr.querySelector('.glaila'), out = { gate: true, pass: pass, score: score, missed: missed || [], review: review, tries: tryN, letters: !LW.length && !!(opts.letters || []).length };
    var cue = function () { if (!res.dead) { lb.classList.remove('talking'); lb.classList.add('cue'); res.scr.classList.add('ready'); } };
    var onward = function () { live && live.stop(); bg.classList.remove('gdim'); if (io.next) io.next(out); };
    lb.onclick = onward;
    if (io.firstTime) io.firstTime();
    if (aw) zinAnim(res, aw);
    var up = aw && aw.unlock;   // a bag filled: its title is granted now, and Laila's press on the unlock carries on instead
    var seq = pass ? (aw && aw.lines.length && (!io.has || io.has(aw.lines[0])) ? aw.lines.slice() : [K.kudos]).concat(up ? [] : [K.go]).filter(function (k) { return k === K.kudos || k === K.go || !io.has || io.has(k); }) : tryN < 2 ? ['s_pop_again', 's_q_again'] : ['s_o_retake', review && review.length > missed.length ? 's_n_focus5' : 's_o_focus'];
    if (pass) sfx('yay');
    res.remind = function () { if (unl) unl.again(); else play(0); };
    function play(i) {
      if (res.dead) return;
      if (i >= seq.length) { if (up) unlock(); else cue(); return; }
      say(seq[i], res).then(function (ok) { if (ok) play(i + 1); else if (up) unlock(); else cue(); });
    }
    function unlock() {
      if (unl || res.dead) return;
      res.scr.classList.add('zhide');   // the results step aside: the unlock is the whole screen
      unl = playUnlock(frame, up.i, up.name, up.colour, up.lines, { laila: K.laila, say: function (k) { return say(k, res); }, hush: io.hush, spot: io.spot }, function () { unl = null; onward(); });
    }
    res.later(pass ? 700 : 300, function () { play(0); });
  }
  /* ---------- Zinari on a passed game (Sani 2026-11-03; bags 2026-11-04): the gold just won counts up and flies into the
     bag it is filling; a bag that fills grants its title (the unlock, above). Five bags, one per title: full ones gold,
     the one filling gold to its level, the rest grey. ---------- */
  var LV0 = io.levels || [];   // where each bag is full (LEVEL_AT, from the screen)
  function bagFill(total, at) { return at.map(function (hi, i) { var lo = i ? at[i - 1] : 0; return Math.max(0, Math.min(1, (total - lo) / (hi - lo))); }); }
  function zbags(total, at, big) {
    var f = bagFill(total, at), cur = f.findIndex(function (x) { return x < 1; });
    return '<span class="zbags' + (big ? ' big' : '') + '">' + f.map(function (x, i) { return '<i class="zb' + (i === cur ? ' cur' : '') + '" style="--f:' + x.toFixed(3) + '"><span class="zgrey">' + BAG + '</span><span class="zg"><span>' + BAG + '</span></span></i>'; }).join('') + '</span>';
  }
  function paintBags(box, total, at) {
    var f = bagFill(total, at), cur = f.findIndex(function (x) { return x < 1; });
    [].forEach.call(box.querySelectorAll('.zb'), function (b, i) { b.style.setProperty('--f', f[i].toFixed(3)); b.classList.toggle('cur', i === cur); });
  }
  function zinHtml(aw) {
    return '<div class="zgain"><span class="coin">Z</span><b class="zplus">+0</b></div>' + zbags(aw.before, aw.at, true);
  }
  function zcount(res, el, from, to, ms, pre) {
    var t0 = 0; function f(t) { if (res.dead) return; if (!t0) t0 = t; var k = Math.min(1, (t - t0) / ms); el.textContent = (pre || '') + Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); }
    requestAnimationFrame(f);
  }
  function zinAnim(res, aw) {
    var scr = res.scr, plus = scr.querySelector('.zplus'), box = scr.querySelector('.zbags');
    var into = bagFill(aw.before, aw.at).findIndex(function (x) { return x < 1; });
    res.later(350, function () { zcount(res, plus, 0, aw.gold, 700, '+'); });
    res.later(1250, function () {
      var target = box.children[into >= 0 ? into : box.children.length - 1];
      var a = scr.querySelector('.zgain .coin').getBoundingClientRect(), b = target.getBoundingClientRect(), o = scr.getBoundingClientRect();
      var sc = o.width / (scr.offsetWidth || o.width);
      for (var i = 0; i < 6; i++) {
        var c = h('<span class="coin s zfly">Z</span>'); scr.appendChild(c);
        c.style.left = (a.left - o.left + a.width / 2) / sc + 'px'; c.style.top = (a.top - o.top + a.height / 2) / sc + 'px';
        c.style.setProperty('--dx', (b.left - a.left + (b.width - a.width) / 2) / sc + 'px'); c.style.setProperty('--dy', (b.top - a.top + (b.height - a.height) / 2) / sc + 'px');
        c.style.animationDelay = (i * 90) + 'ms';
        (function (c) { res.later(900 + i * 90, function () { c.remove(); }); })(c);
      }
      res.later(450, function () { sfx('yay'); paintBags(box, aw.after, aw.at); });
    });
  }
  function result(run, r) {
    if (opts.gate && !r.learn && r.banner) { run.stop(); gateResult(run, r); return; }
    if (!r.learn && !r.banner) {
      run.stop(); var bn = h('<div class="finish"><b>' + (r.finished ? 'An gama!' : 'Lokaci ya ƙare!') + '</b></div>'); run.scr.appendChild(bn); drum(true);
      r.banner = true; setTimeout(function () { if (!gone) result(run, r); }, 1300); return;
    }
    run.stop(); var g = GAMES[gid];
    var res = new Run(); live = res;
    var secs = Math.round((run.left || 0) / 1000), stars;
    if (r.learn) stars = 0;
    else if (!r.finished) stars = r.right >= 1 ? (r.part >= .5 ? 2 : 1) : 1;
    else stars = run.miss === 0 ? (secs >= 20 ? 5 : 4) : run.miss <= 2 ? 3 : 2;
    var gold = r.learn ? 0 : Math.max(50, Math.floor((100 + run.right * 20 + secs) / 50) * 50);
    res.scr.className = 'scr r' + (stars === 5 ? ' top' : ''); bg.innerHTML = '';
    res.scr.innerHTML = (stars === 5 ? '<div class="conf">' + Array.from({ length: 36 }, function (_, i) { return '<i style="left:' + (i * 37 % 100) + '%;animation-delay:-' + (i * 7 % 15) / 10 + 's;background:' + ['#FFD54A', '#E63946', '#1FA1D8', '#2FAE9E', '#8A5FBF', '#4CAF50'][i % 6] + '"></i>'; }).join('') + '</div>' : '') +
      '<div class="eye">' + g.title + ' · sakamako</div>' +
      (r.learn ? '<p class="big">Ba komai!</p>' : '<div class="stars">' + [1, 2, 3, 4, 5].map(function (i) { return '<i class="' + (i <= stars ? '' : 'off') + '" style="animation-delay:' + (i * .3) + 's">★</i>'; }).join('') + '</div>' +
        (stars === 5 ? '<div class="topbanner">★ Mafi girma ★</div>' : '') +
        '<div class="gold"><span class="coin">Z</span><b>+' + gold + '</b><small>Zinari</small></div>') +
      '<div class="place">' + (r.learn ? g.placeNo : g.place(r, run)) + '</div>' +
      lailaBtn('cue', 'Danna Laila');
    res.scr.querySelector('.glaila').onclick = function () { if (opts.lesson && io.next) { live && live.stop(); io.next(r); } else start(); };
    if (r.learn) say(K.learn, res);
    else {
      if (io.firstTime) io.firstTime();   // remembered as met; no home-page shelf (Sani 2026-10-23: removed)
      sfx('yay'); res.later(700, function () { say(K.kudos, res).then(function (ok) { if (ok) say(K.go, res); }); });
    }
  }

  /* ---------- the games ---------- */
  var GAMES = {
    'j-abubuwa': { title: 'Kamun kifi', cls: 'pondbg', instr: ['Ka kama kifin da ke ɗauke da abin da na faɗa.', 'Ki kama kifin da ke ɗauke da abin da na faɗa.'], ask: ['Ka san sunayen abubuwa da Turanci?', 'Kin san sunayen abubuwa da Turanci?'],
      placeNo: 'Abubuwa would start at Dabbobi, with the lessons.',
      place: function (r) { return r.right >= 6 && !r.misses ? 'Knew every word: those sets would be skipped.' : 'Knew ' + r.right + ' of 6: the sets with misses would be taught.'; },
      play: function (run, done) {
        // six casts, one touch each (Sani 2026-10-23: a miss is part of the game). Sani 2026-10-25: a busier river that is
        // never emptied. Nine smaller fish with bigger photos swim in three rows of three, evenly spaced. The right fish is scooped up in the fisherman's homa and flicked into his basket; a wrong one
        // slips off the hook and sinks away. Nothing ever appears mid-river (Sani 2026-10-25): a fish only joins by swimming
        // in from off the left, when its empty place next comes round. The word is chosen only from fish already in view,
        // never the newest arrival, so the answer is in the water before Laila says it and is not the obvious one.
        var OWN = ['goat', 'mango', 'car', 'dog', 'banana', 'horse', 'cow', 'bus', 'fish', 'apple', 'cup', 'chair'];
        // a lesson's words are the ones asked, every one; when there are fewer than the river holds, its own fish swim with them unasked
        var ASK = LW.length ? shuffle(LW) : null, N = ASK ? ASK.length : 6;
        var words = ASK ? ASK.concat(shuffle(OWN.filter(function (w) { return ASK.indexOf(w) < 0; })).slice(0, Math.max(0, 12 - ASK.length))) : shuffle(OWN), r = 0, n = 0, target, busy = false;
        function askable(w) { return !ASK || ASK.indexOf(w) >= 0; }
        var slots = [null, null, null, null, null, null, null, null, null], asked = {}, used = {}, t0 = [0, 1, 2].map(function () { return performance.now() - Math.random() * 20000; });
        var pond = h('<div class="pond2 ag"></div>');
        var bank = h('<div class="kamun"><span class="fisher">' + argFisher() + '</span><span class="kw">' + basket() + '<b class="kn">0 / ' + N + '</b></span></div>');
        bg.appendChild(bank); run.scr.appendChild(pond); run.clock(secs(120, N, 6), function () { done({ right: r, part: r / N }); });
        run.remind = function () { say(K.en[target], run); };
        function dur(row) { return 26 + row * 4; }
        function along(f) { var d = dur(f._row); return (((performance.now() - t0[f._row]) / 1000 / d) + f._ph / 3) % 1; }   // 0 = off at the left, 1 = off at the right
        function swimming() { return slots.filter(Boolean); }
        function addFish(w, s) {
          var row = s % 3, ph = Math.floor(s / 3), d = dur(row); used[w] = true;
          var f = h('<button type="button" class="fish2 fish3 f4" data-w="' + w + '" style="top:' + (row * 32) + '%;animation-duration:' + d + 's" aria-label="fish">' + fish4(K.pic[w]) + '</button>');
          f._row = row; f._ph = ph; f._born = performance.now(); f.style.animationDelay = '-' + (along(f) * d).toFixed(2) + 's'; slots[s] = f;
          f.onclick = function () {
            if (busy || run.dead || slots.indexOf(f) < 0) return; busy = true; n++; var at0 = slots.indexOf(f); slots[at0] = null; refill(at0);
            if (w === target) { run.good(); r++; land(f); }
            else {
              run.bad(); var m = new DOMMatrix(getComputedStyle(f).transform); f.style.setProperty('--x', m.m41 + 'px'); f.classList.add('slip2');
              bank.classList.add('miss'); run.later(1400, function () { f.remove(); bank.classList.remove('miss'); });
            }
            run.later(w === target ? 1800 : 1500, function () { if (n >= N) done({ right: r, finished: r === N, part: r / N, misses: run.miss }); else cast(); });
          };
          pond.appendChild(f);
        }
        /* the catch: up into the hoop, a flick, an arc through the air and into the basket, which bobs and shows one more fish */
        function land(f) {
          var fr = io.rect(frame), fb = io.rect(f), mr = io.rect(bank.querySelector('.fisher')), kr = io.rect(bank.querySelector('.kw'));
          var w0 = fb.width * 126 / 262, h0 = fb.height * 60 / 110, c0x = fb.left + fb.width * 199 / 262 - fr.left, c0y = fb.top + fb.height * 56 / 110 - fr.top;
          var fl = h('<div class="flyer">' + fish4('', true) + '</div>');
          fl.style.cssText = 'left:' + (c0x - w0 / 2) + 'px;top:' + (c0y - h0 / 2) + 'px;width:' + w0 + 'px;height:' + h0 + 'px';
          frame.appendChild(fl); f.style.visibility = 'hidden'; run.later(400, function () { f.remove(); });
          var hx = mr.left - fr.left + mr.width * 22 / 120, hy = mr.top - fr.top + mr.height * 70 / 130;      // the hoop, dipped
          var ux = mr.left - fr.left + mr.width * 28 / 120, uy = mr.top - fr.top + mr.height * 18 / 130;      // the hoop, flicked up
          var bx = kr.left - fr.left + kr.width / 2, by = kr.top - fr.top + kr.height * .3;                    // the basket's mouth
          var s1 = mr.width * .3 / w0, s2 = kr.width * .32 / w0;
          function at(x, y, s, rot) { return 'translate(' + (x - c0x).toFixed(1) + 'px,' + (y - c0y).toFixed(1) + 'px) scale(' + s.toFixed(3) + ') rotate(' + rot + 'deg)'; }
          if (fl.animate) fl.animate([
            { transform: at(c0x, c0y, 1, 0) },
            { offset: .38, transform: at(hx, hy, s1, -20) },
            { offset: .46, transform: at(hx, hy, s1, -20) },
            { offset: .62, transform: at(ux, uy, s1, -120) },
            { offset: .8, transform: at((ux + bx) / 2, Math.min(uy, by) - mr.height * .12, s1, -250) },
            { offset: 1, transform: at(bx, by, s2, -360) }
          ], { duration: 1400, easing: 'ease-in-out', fill: 'forwards' });
          run.later(250, function () { bank.classList.add('scoop'); });
          run.later(650, function () { bank.classList.remove('scoop'); bank.classList.add('throw'); });
          run.later(1150, function () { bank.classList.remove('throw'); });
          run.later(1400, function () {
            fl.remove(); var kw = bank.querySelector('.kw'), b = kw.querySelector('.bf.b' + r); if (b) b.classList.add('on');
            kw.querySelector('.kn').textContent = r + ' / ' + N; kw.classList.remove('plop'); void kw.offsetWidth; kw.classList.add('plop');
          });
          run.later(1500, function () { fl.remove(); });
        }
        /* a free place in a row is filled when it next comes round to just off the left edge, so the new fish swims in */
        function refill(sl) {
          var row = sl % 3, d = dur(row), p = (((performance.now() - t0[row]) / 1000 / d) + Math.floor(sl / 3) / 3) % 1;
          run.later((1 - p) * d * 1000 + 60, function () {
            if (run.dead || slots[sl]) return;
            var inRiver = {}; swimming().forEach(function (f) { inRiver[f.dataset.w] = true; });
            // a word still to be asked comes first, so every one of a lesson's words reaches the water
            var due = shuffle(words.filter(function (w) { return askable(w) && !asked[w] && !inRiver[w]; }));
            var fresh = shuffle(words.filter(function (w) { return !used[w] && !inRiver[w]; })), again = shuffle(words.filter(function (w) { return !asked[w] && !inRiver[w]; }));
            var w = due[0] || fresh[0] || again[0] || shuffle(words.filter(function (w) { return !inRiver[w]; }))[0]; if (w) addFish(w, sl);
          });
        }
        /* the word: a fish not asked before that is well into view and not the newest arrival; if none is ready yet, wait */
        function cast(tries) {
          busy = true; tries = tries || 0;
          var open = swimming().filter(function (f) { return !asked[f.dataset.w] && askable(f.dataset.w); });
          if (!open.length) { run.later(300, function () { cast(tries); }); return; }   // the next word to ask is still swimming in
          var newest = swimming().reduce(function (m, f) { return !m || f._born > m._born ? f : m; }, null);
          var ok = open.filter(function (f) { var p = along(f); return f !== newest && p > .4 && p < .62; });
          if (!ok.length) ok = open.filter(function (f) { var p = along(f); return f !== newest && p > .36 && p < .74; });
          if (!ok.length && tries < 40) { run.later(300, function () { cast(tries + 1); }); return; }
          if (!ok.length) ok = open.filter(function (f) { var p = along(f); return p > .36 && p < .8; });
          if (!ok.length) ok = open;
          busy = false; target = rnd(ok).dataset.w; asked[target] = true; run.item(target); pond.dataset.t = target;
          say(K.en[target], run);
        }
        // the river at the start: three fish in each row, evenly spaced, already in the water when the game opens
        [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach(function (sl) { addFish(words[sl], sl); });
        cast();
      } },

    /* Kalangu (Sani 2026-10-25): a drawn village square, the band on the right and four dancers on the left, the word's
       picture on a carved board at the top left, filling it edge to edge. One picture, one answer, no hints. Right: the
       band plays one of fifteen rhythms (at least three seconds), the dancers dance and the word shows on the plate.
       Wrong: the plate turns red (never a cross), the kakaki sighs, the dancers stop and shake their heads; the word is never
       shown or said. Laila waits for the first press; from then on she listens by herself as each picture comes in (if
       she hears nothing she listens once more, then waits for a press again). */
    'j-magana': { title: 'Kalangu', cls: 'drum', scene: (KART.scene.kalangu = KL.kalanguScene(), 'kalangu'),
      instr: ['Duba hoton nan. Ka danna Laila, ka faɗi sunansa da Turanci, sai in buga kalangu!', 'Duba hoton nan. Ki danna Laila, ki faɗi sunansa da Turanci, sai in buga kalangu!'], ask: ['Ka iya faɗin sunayen abubuwa da Turanci?', 'Kin iya faɗin sunayen abubuwa da Turanci?'],
      placeNo: 'Abubuwa would start at Dabbobi, with the lessons.',
      place: function (r) { return r.right >= 6 ? 'Said every word: those sets would be skipped.' : 'Said ' + r.right + ' of 6: the sets they could not say would be taught.'; },
      play: function (run, done) {
        var words = LW.length ? shuffle(LW) : shuffle(['horse', 'goat', 'cat', 'dog', 'cup', 'chair', 'bed', 'sun', 'book', 'chicken']).slice(0, 6), N = words.length, r = 0, said = 0, auto = false, quiet = 0;
        var among = words.map(spoken);
        var stage = h('<div class="kl-stage">' +
          '<span class="kl-poles"><i></i><i></i></span><div class="kl-easel"><div class="kl-board"><img alt=""></div><div class="plate"><span class="pf">?</span><span class="pb"></span></div></div>' +
          '<div class="kl-dancers">' + KL.dancers() + '</div><div class="kl-band">' + KL.band() + '</div></div>');
        var row = h('<div class="krow' + (N > 10 ? ' many' : '') + '">' + words.map(function () { return '<span class="kd">' + KART.minidrum() + '</span>'; }).join('') + '</div>');
        var box = micBox(run);
        run.scr.appendChild(stage); run.scr.appendChild(row); run.scr.appendChild(box);
        run.clock(secs(150, N, 6), function () { done({ right: said, part: said / N }); });
        run.remind = function () { say(line(gid, 'how'), run); };
        var easel = stage.querySelector('.kl-easel'), plate = stage.querySelector('.plate');
        function audio() { try { ac = liveAC(ac); return ac; } catch (e) { return null; } }
        function round() {
          var w = words[r], ws = spoken(w); run.item(w);
          easel.classList.remove('in', 'out'); plate.classList.remove('flip', 'miss'); stage.classList.remove('sad'); void easel.offsetWidth;
          easel.querySelector('img').src = K.pic[w]; plate.querySelector('.pb').textContent = ws; plate.style.setProperty('--len', String(ws.length)); easel.classList.add('in'); row.children[r].classList.add('now');
          // every listen, pressed or by herself, turns her own listening on for the pictures after it
          box.listen(function () { auto = true; return { target: ws, among: among, match: function (raw) { return io.match(raw, ws, among); } }; }, function (res) {
            if (res.value === null && !res.raw) {                                       // nothing heard
              if (auto && ++quiet < 2) { box.busy = false; box.go(); return; }          // she listens once more by herself
              quiet = 0; auto = false; box.cue(); return;                                // then waits for a press
            }
            quiet = 0; box.busy = true; row.children[r].classList.remove('now');
            if (res.value === ws) {
              box.yay(); run.good(easel); said++; plate.classList.add('flip'); row.children[r].classList.add('on');
              var a = audio(), ms = a ? playRhythm(a, pickRhythm()) : 3500;
              stage.classList.add('play'); run.later(ms, function () { stage.classList.remove('play'); });
              next(ms + 500);
            } else {
              box.nope(); run.bad(easel); plate.classList.add('miss'); row.children[r].classList.add('miss'); stage.classList.add('sad');
              var b = audio(); if (b) playSigh(b);
              next(2200);
            }
          }, function () { return ws; });
          if (auto) run.later(700, function () { if (!run.dead) { box.busy = false; box.go(); } }); else box.cue();
        }
        function next(ms) {
          run.later(ms, function () { easel.classList.add('out'); r++;
            if (r >= N) run.later(500, function () { done({ right: said, finished: true, part: said / N, misses: N - said }); }); else run.later(450, round); });
        }
        round();
      } },

    'j-nemo': { title: 'Hanzarin kasuwa', cls: 'market2', instr: ['Masu saye sun zo! Ka ba kowa abin da ya roƙa da sauri.', 'Masu saye sun zo! Ki ba kowa abin da ya roƙa da sauri.'], ask: ['Za ka iya gane abu idan an faɗe shi da Turanci?', 'Za ki iya gane abu idan an faɗe shi da Turanci?'],
      placeNo: 'Nemo hoto would start from the four-picture rounds.',
      place: function (r) { return r.right >= 6 ? 'Served everyone: Nemo hoto would be done.' : 'Served ' + r.right + ' of 6: Nemo hoto would start from the four-picture rounds.'; },
      play: function (run, done) {
        // a lesson's words come to the stall six at most at a time; when a set is sold the stall is laid out again with the next
        var SETS = LW.length ? batches(shuffle(LW), 6) : [['tomato', 'bread', 'egg', 'orange', 'onion', 'banana']], si = 0, goods = SETS[0];
        var N = SETS.reduce(function (a, b) { return a + b.length; }, 0), base = 0;
        var people = ['woman', 'man', 'girl', 'boy', 'old_man', 'woman'], q = shuffle(goods), c = 0, served = 0, pt;
        var top = h('<div class="cust"><span class="person"></span><span class="ask"><i></i></span><span class="pat"><b></b></span></div>');
        run.scr.appendChild(h('<div class="awnwrap">' + KART.awning() + '</div>'));
        var mat = h('<div class="mat2"></div>');
        var sold = h('<div class="sold"><span class="coin s">Z</span> <b>0</b> / ' + N + '</div>');
        var shop = h('<div class="shop"><div class="buyer"></div></div>'); shop.firstChild.appendChild(top); shop.firstChild.appendChild(sold); shop.appendChild(mat);   // the buyer beside the stall, so the goods can be big
        run.scr.appendChild(shop); run.clock(secs(90, N, 6), function () { done({ right: served, part: served / N }); });
        run.remind = function () { say(K.en[q[c]], run); };
        function next() {
          if (c >= goods.length) {
            if (si + 1 >= SETS.length) return done({ right: served, finished: served === N, part: served / N });
            si++; base += goods.length; goods = SETS[si]; q = shuffle(goods); c = 0; lay();
          }
          var who = people[(base + c) % people.length]; top.querySelector('.person').innerHTML = '<img alt="" src="' + K.pic[who] + '">';
          top.classList.remove('leave', 'come'); void top.offsetWidth; top.classList.add('come');
          var bar = top.querySelector('.pat b'); bar.style.transition = 'none'; bar.style.transform = 'scaleX(1)'; void bar.offsetWidth; bar.style.transition = 'transform 12s linear'; bar.style.transform = 'scaleX(0)';
          clearTimeout(pt); pt = run.later(12000, function () { run.miss++; react(run.scr, 'sad'); top.classList.add('leave'); c++; run.later(600, next); });
          run.item(q[c]); say(K.en[q[c]], run);
        }
        function lay() {
          mat.innerHTML = goods.map(function (k) { return '<button type="button" class="mi2 bowl" data-k="' + k + '" aria-label="' + spoken(k) + '">' + bowl2(K.pic[k]) + '</button>'; }).join('');
          [].forEach.call(mat.children, wire);
        }
        function wire(b) {
          b.onclick = function () {
            if (c >= goods.length || run.dead) return;
            if (b.dataset.k === q[c]) { clearTimeout(pt); run.good(); react(run.scr, 'cheer'); served++; sold.querySelector('b').textContent = served; b.classList.add('fly'); setTimeout(function () { b.classList.remove('fly'); }, 700); top.classList.add('leave'); c++; run.later(700, next); }
            else { clearTimeout(pt); run.bad(b); react(run.scr, 'sad'); top.classList.add('sad', 'leave'); c++; run.later(1200, function () { top.classList.remove('sad'); next(); }); }   // one go: the customer leaves unhappy
          };
        }
        lay(); next();
      } },

    'j-lambobi': { title: 'Ƙirga taurari', cls: 'night', instr: ['Taurari suna jira! Ka danna su bisa tsari, daga ɗaya.', 'Taurari suna jira! Ki danna su bisa tsari, daga ɗaya.'], ask: ['Ka iya ƙirga da Turanci?', 'Kin iya ƙirga da Turanci?'],
      placeNo: 'Lambobi would start at 1 to 5, with the lessons.',
      place: function (r) { return r.finished ? 'Counted 1 to 10 in order: the full game goes on to the tens, and Lambobi would start at 11.' : 'Counted to <b>' + r.right + '</b>: Lambobi would start ' + (r.right < 5 ? 'at 1 to 5' : 'at 6 to 10') + '.'; },
      play: function (run, done) {
        var NUMS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'], want = 1;
        var pos = shuffle([[12, 22], [26, 60], [38, 18], [50, 52], [62, 22], [74, 62], [86, 30], [18, 78], [56, 82], [88, 76]]);
        var sky = h('<div class="sky3"><svg class="lines" viewBox="0 0 100 100" preserveAspectRatio="none"></svg></div>');
        run.scr.appendChild(sky); run.clock(120, function () { done({ right: want - 1, part: (want - 1) / 10 }); });
        run.remind = function () { say(line(gid, 'how'), run); };
        var prev = null;
        pos.forEach(function (p, k) {
          var n = k + 1, s = h('<button type="button" class="st3" style="left:' + p[0] + '%;top:' + p[1] + '%">' + KART.star() + '<span>' + n + '</span></button>');
          s.onclick = function () {
            if (s.classList.contains('lit') || run.dead) return;
            if (n === want) {
              run.good(); s.classList.add('lit'); say(K.en[NUMS[n - 1]], run);
              if (prev) sky.querySelector('svg').insertAdjacentHTML('beforeend', '<line x1="' + prev[0] + '" y1="' + prev[1] + '" x2="' + p[0] + '" y2="' + p[1] + '"/>');
              prev = p; want++; if (want > 10) run.later(900, function () { done({ right: 10, finished: true }); });
            } else {   // a wrong star falls away and the sky goes dim: the count ends where it reached (one go)
              run.bad(); s.classList.add('fall'); sky.classList.add('dim'); [].forEach.call(sky.querySelectorAll('.st3'), function (x) { x.disabled = true; });
              run.later(1600, function () { done({ right: want - 1, part: (want - 1) / 10 }); });
            }
          };
          sky.appendChild(s);
        });
      } },

    'j-karatu': { title: 'Kwale-kwale', cls: 'pondbg kwale', instr: ['Ka karanta kalmar da ke cikin kowane kwale-kwale, sannan ka danna wadda ta dace da hoton.', 'Ki karanta kalmar da ke cikin kowane kwale-kwale, sannan ki danna wadda ta dace da hoton.'], ask: ['Ka iya karanta kalmomi da Turanci?', 'Kin iya karanta kalmomi da Turanci?'],
      placeNo: 'Karatu would start at short words, with the lessons.',
      place: function (r) { return r.right >= 5 && !r.misses ? 'Read every word: the full game moves on to longer words.' : 'Read ' + r.right + ' of 5: Karatu would start at short words.'; },
      /* Kwale-kwale (Sani 2026-10-22): one answer. The right canoe paddles off fast through a splash with the sound of
         the paddle in the water; a wrong one sinks with bubbles and a gurgle, and the round is marked wrong. Fish leap
         now and then, and a fisherman sits on the far bank with his line in the water. */
      play: function (run, done) {
        var R = shuffle([['cat', ['CAT', 'CAR', 'CUP', 'COT', 'CAP']], ['dog', ['DOG', 'DIG', 'LOG', 'FOG', 'DOT']], ['sun', ['SUN', 'BUN', 'SUB', 'RUN', 'SUM']], ['bus', ['BUS', 'BUT', 'BUN', 'BUD', 'BUG']], ['cup', ['CUP', 'CAP', 'CUT', 'PUP', 'CUB']]]), r = 0, got = 0, busy = false;
        if (LW.length) {
          // a lesson's words: the other canoes carry the lesson's other words, nearest in length first, then the same first letter
          var SPARE = ['CAT', 'DOG', 'SUN', 'BUS', 'CUP', 'BED', 'HAT', 'PEN', 'GOAT', 'FISH', 'BOOK', 'MILK', 'BREAD', 'MANGO', 'WATER', 'CHAIR'];
          R = shuffle(LW).map(function (w) {
            var t = txt(w).toUpperCase(), all = LW.map(function (x) { return txt(x).toUpperCase(); }).concat(SPARE).filter(function (x, k, a) { return x !== t && a.indexOf(x) === k; });
            var near = shuffle(all).sort(function (a, b) { return (Math.abs(a.length - t.length) - Math.abs(b.length - t.length)) || ((b[0] === t[0] ? 1 : 0) - (a[0] === t[0] ? 1 : 0)); });
            return [w, [t].concat(near.slice(0, 4))];
          });
        }
        var N = R.length;
        /* five canoes at once (Sani 2026-10-25: "no more than 5, but on the water"): each lane keeps to open water, and a
           canoe fades in and out where the river meets a bank, so none is ever seen on the sand (top, from, to, seconds) */
        var LANES = [[30.5, -26, 100, 27, 0, .92], [30.5, -26, 100, 27, .5, .92], [37, -12, 88, 22, .2, .95], [43.5, 20, 64, 15, .6, .97], [50, 31, 46, 11, .35, 1]];   // the last number: further canoes are smaller (Sani 2026-10-27, realism)
        var bank = h('<div class="bank2"><img alt=""></div>'), river = h('<div class="canal2"></div>');
        run.scr.appendChild(h('<div class="kwstand" aria-hidden="true"><i></i><i></i><b></b></div>'));   // the picture's board stands on two posts at the water's edge
        var life = h('<div class="riverlife"><span class="fisher">' + fisherman() + '</span>' + [0, 1, 2].map(function (k) { return '<span class="leap l' + k + '">' + leapFish() + '</span>'; }).join('') + '</div>');
        run.scr.appendChild(life); run.scr.appendChild(bank); run.scr.appendChild(river); run.clock(secs(120, N, 5), function () { done({ right: got, part: got / N, misses: run.miss }); });
        run.remind = function () { say(line(gid, 'how'), run); };
        function audio() { try { ac = liveAC(ac); return ac; } catch (e) { return null; } }
        function freeze(c) { var m = getComputedStyle(c).transform; c.style.animation = 'none'; c.style.transform = m === 'none' ? '' : m; void c.offsetWidth; }
        function splash(c, cls) { var cr = io.rect(c), rr = io.rect(river), sp = h('<span class="' + cls + '" style="left:' + (cr.left - rr.left + cr.width * .45) + 'px;top:' + (cr.top - rr.top + cr.height * .7) + 'px"><i></i><i></i><i></i><b></b><b></b><b></b></span>'); river.appendChild(sp); setTimeout(function () { sp.remove(); }, 1600); }
        function round() {
          busy = false; var item = R[r]; run.item(item[0]); bank.querySelector('img').src = K.pic[item[0]]; river.innerHTML = '';
          shuffle(item[1]).forEach(function (w, k) {
            var L = LANES[k], c = h('<button type="button" aria-label="' + spoken(w) + '" class="canoe2 lane' + (w.length > 6 ? ' long' : '') + '" style="top:' + L[0] + 'cqw;--k:' + L[5] + ';--x0:' + L[1] + 'cqw;--x1:' + L[2] + 'cqw;animation-duration:' + L[3] + 's;animation-delay:-' + (L[4] * L[3]).toFixed(1) + 's">' + KART.canoe(w) + '</button>');
            c.onclick = function () {
              if (run.dead || busy) return; busy = true;
              if (w === item[1][0]) {
                run.good(c); react(run.scr, 'cheer'); got++; freeze(c); c.classList.add('row'); splash(c, 'splash');
                var a = audio(); if (a) paddleSound(a);
                requestAnimationFrame(function () { c.style.transition = 'transform 1.4s cubic-bezier(.5,0,.8,.4)'; c.style.transform = 'translateX(150cqw)'; });
              } else {
                run.bad(); react(run.scr, 'sad'); freeze(c); c.classList.add('sink'); splash(c, 'bubbles');
                var b = audio(); if (b) sinkSound(b);
                requestAnimationFrame(function () { c.style.transition = 'transform 1.6s ease-in, opacity 1.2s ease-in .4s'; c.style.transform += ' translateY(9cqw) rotate(-14deg)'; c.style.opacity = '0'; });
              }
              r++; if (r >= N) run.later(1900, function () { done({ right: got, finished: true, part: got / N, misses: run.miss }); }); else run.later(1900, round);
            };
            river.appendChild(c);
          });
        }
        round();
      } },

    'j-rubutu': { title: 'Tukwane', cls: 'potter2', instr: ['Bari mu gina kalma da tukwane. Ka danna haruffa ɗaya bayan ɗaya.', 'Bari mu gina kalma da tukwane. Ki danna haruffa ɗaya bayan ɗaya.'], ask: ['Ka iya rubuta kalmomi da Turanci?', 'Kin iya rubuta kalmomi da Turanci?'],
      placeNo: 'Rubutu would start at three letters, with the lessons.',
      place: function (r) { return r.finished && !r.misses ? 'Spelled every word: the full game moves on to longer words.' : 'Spelled ' + r.right + ' of 4 words: Rubutu would start at three letters.'; },
      /* Tukwane (Sani 2026-10-22): the child writes the word with pots. A right pot lifts off its place and flies into
         the next box, where it stays with its letter; its place is left empty. A wrong pot cracks apart with a crash, the
         word is marked wrong and the next word comes. */
      play: function (run, done) {
        var W = LW.length ? shuffle(LW) : shuffle(['cat', 'dog', 'sun', 'bus']), N = W.length, wi = 0, li = 0, words = 0, misses = 0, busy = false;
        var top = h('<div class="sp"><span class="sppic"><img alt=""></span><div class="spslots"></div></div>');
        var pad = h('<div class="pots2"></div>');
        run.scr.appendChild(top); run.scr.appendChild(pad);
        run.clock(secs(120, N, 4), function () { done({ right: words, part: words / N, misses: misses }); });
        run.remind = function () { say(K.en[W[wi]], run); };
        function nextWord() { wi++; if (wi >= W.length) run.later(900, function () { done({ right: words, finished: words === W.length, misses: misses }); }); else run.later(1000, word); }
        function word() {
          busy = false; var w = letters(W[wi]); li = 0; run.item(W[wi]); top.querySelector('img').src = K.pic[W[wi]];
          top.classList.toggle('long', w.length > 6); pad.classList.toggle('long', w.length > 6);
          top.querySelector('.spslots').innerHTML = w.split('').map(function () { return '<span></span>'; }).join('');
          var pool = shuffle(w.split('').concat(shuffle('BDEGHKLMPRT'.split('').filter(function (x) { return w.indexOf(x) < 0; })).slice(0, 2)));
          var gp = gaps(top.querySelector('.spslots'), W[wi]); top.classList.toggle('long', w.length + gp > 6);
          pad.innerHTML = ''; pad.classList.toggle('two', pool.length > 9); pad.style.setProperty('--n', String(pool.length)); top.style.setProperty('--n', String(w.length + gp * .5));   // sizes for a long word (sc-tukwane.css)
          pool.forEach(function (L) {
            var b = h('<button type="button" class="pot2" aria-label="' + L + '">' + tukPot(L) + '</button>');
            b.onclick = function () {
              if (b.disabled || run.dead || busy) return;
              if (L === w[li]) {
                run.idle = 0; b.disabled = true; var slot = top.querySelectorAll('.spslots > span')[li], k = li; li++;
                var br = io.rect(b), sr = io.rect(slot);
                b.style.setProperty('--tx', (sr.left + sr.width / 2 - (br.left + br.width / 2)) + 'px'); b.style.setProperty('--ty', (sr.top + sr.height / 2 - (br.top + br.height / 2)) + 'px');
                b.classList.add('fly');                                 // the pot lifts off its place into the box
                run.later(560, function () { slot.innerHTML = '<span class="mp">' + tukPot(L) + '</span>'; slot.classList.add('on'); b.classList.add('gone'); say(K.L[L], run); run.spark(slot, 5); });
                if (li >= w.length) { busy = true; run.later(700, function () { run.good(top.querySelector('.spslots')); react(run.scr, 'cheer'); words++; }); nextWord(); }
              } else {
                // a wrong pot cracks: a crash, the word is marked wrong, and on to the next word
                busy = true; misses++; run.bad(); react(run.scr, 'sad'); b.classList.add('crack'); b.insertAdjacentHTML('beforeend', '<i class="shard s1"></i><i class="shard s2"></i><i class="shard s3"></i><i class="shard s4"></i>');
                try { ac = liveAC(ac); crashSound(ac); } catch (e) { /* no sound */ }
                top.querySelector('.spslots').classList.add('wrongw'); run.later(1200, function () { top.querySelector('.spslots').classList.remove('wrongw'); });
                nextWord();
              }
            };
            pad.appendChild(b);
          });
          run.later(200, function () { say(K.en[W[wi]], run); });
        }
        word();
      } },

    'j-rubutu-say': { title: 'Ginin bulo', cls: 'mud2', instr: ['Mu gina gida kafin lokaci ya ƙare! Ka danna Laila, ka faɗi haruffan kalmar ɗaya bayan ɗaya. Kowane harafi bulo ne.', 'Mu gina gida kafin lokaci ya ƙare! Ki danna Laila, ki faɗi haruffan kalmar ɗaya bayan ɗaya. Kowane harafi bulo ne.'], ask: ['Ka iya faɗin haruffan kalma ɗaya bayan ɗaya?', 'Kin iya faɗin haruffan kalma ɗaya bayan ɗaya?'],
      placeNo: 'Rubutu would start at three letters, with the lessons.',
      place: function (r) { return r.finished ? 'Built the whole house in time: spelling out loud is there, and with Tukwane agreeing Rubutu moves on.' : 'Built ' + Math.round(100 * (r.built || 0) / 12) + '% of the house before time ran out: Rubutu would start at three letters.'; },
      play: function (run, done) {
        /* every letter said right is a mud brick in the house; a wrong one knocks the top brick off. Finish before the clock runs out. */
        var W = LW.length ? shuffle(LW) : shuffle(['cat', 'dog', 'sun', 'bus']), wi = 0, li = 0, placed = 0, TOTAL = 12;
        /* a lesson's words: each is spelt once, and the house grows by the share of all their letters spelt right (a
           wrong letter still knocks a brick's worth off); the game ends after the last word, or with the house built */
        var LES = LW.length > 0, ALL = W.reduce(function (a, w) { return a + letters(w).length; }, 0), lt = 0, done1 = 0, rightW = 0;
        var top = h('<div class="sp hs"><span class="sppic"><img alt=""></span><div class="spslots"></div><span class="hpct"><b>0</b>%</span></div>');
        /* the house is the red-earth Hausa house of the scene behind (sc-bulo.ts buloHouse, Sani 2026-10-26) */
        var site = h('<div class="site">' + buloHouse() + '</div>');
        /* the lessons' A–Z keys (abcgrid/abckey, design.css) as in Marubucin wasiƙa: A–M left, N–Z right, Laila between them */
        var ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), key = function (L) { return '<button type="button" class="abckey" data-l="' + L + '">' + L + '</button>'; };
        var kb = h('<div class="mkb abcgrid"><div class="mkh">' + ABC.slice(0, 13).map(key).join('') + '</div><div class="mkh">' + ABC.slice(13).map(key).join('') + '</div></div>');
        var box = micBox(run);
        var hrow = h('<div class="hrow"></div>'); hrow.appendChild(site);
        run.scr.appendChild(top); run.scr.appendChild(hrow); run.scr.appendChild(kb); run.scr.appendChild(box);
        run.noBump = true;
        run.clock(LES ? secs(150, W.length, 4) : 150, function () { done({ right: LES ? rightW : wi, part: placed / TOTAL, built: placed }); });
        run.remind = function () { say(K.en[W[wi]], run); };
        var bricks = site.querySelectorAll('.hb');
        function paint() { top.querySelector('.hpct b').textContent = Math.round(100 * placed / TOTAL); }
        function addBrick(L) { var b = bricks[placed]; b.classList.remove('ghost', 'fall'); b.querySelector('text').textContent = L; b.classList.add('drop'); drum(true); placed++; paint(); }
        function breakBrick() {
          if (!placed) return; placed--; var b = bricks[placed]; b.classList.remove('drop'); b.classList.add('fall');
          setTimeout(function () { b.classList.remove('fall'); b.classList.add('ghost'); b.querySelector('text').textContent = ''; }, 600);
          site.classList.remove('quake'); void site.offsetWidth; site.classList.add('quake'); paint();
        }
        function word() {
          var w = letters(W[wi]); li = 0; run.item(W[wi]); top.querySelector('img').src = K.pic[W[wi]]; kb.classList.remove('locked');
          top.querySelector('.spslots').innerHTML = w.split('').map(function () { return '<span></span>'; }).join('');
          top.querySelector('.spslots').style.setProperty('--n', String(w.length + gaps(top.querySelector('.spslots'), W[wi]) * .5));   // a long word's boxes share the board (sc-bulo.css)
          box.cue();
          run.later(200, function () { run.said = say(K.en[W[wi]], run); if (run.auto) autoGo(); });   // after the first press Laila listens by herself
        }
        function autoGo() { box.busy = true; Promise.resolve(run.said).then(function () { run.later(450, function () { if (!run.dead && !run.listening) { box.busy = false; box.go(); } }); }); }
        var quiet = 0, stamp = '';
        /* the same for a spoken run of letters and for a key. "C A T" in one breath is welcome: every letter in order is a
           brick; the first wrong one breaks one and stops (one go) */
        /* the lesson's way: bricks follow the share of all the letters spelt right */
        function lesBricks(L) { var want = Math.floor(TOTAL * lt / ALL); while (placed < want) addBrick(L); }
        function lesNext(ms) {
          done1++; wi++;
          if (done1 >= W.length || placed >= TOTAL) { box.busy = true; kb.classList.add('locked'); if (placed >= TOTAL) site.classList.add('done');
            run.later(ms + 600, function () { done({ right: rightW, finished: rightW === W.length, part: placed / TOTAL, built: placed }); }); return; }
          run.later(ms, word);
        }
        function take(got, kbtn) {
          var w = letters(W[wi]);
          for (var k = 0; k < got.length && li < w.length; k++) {
            var L = String(got[k]).toUpperCase();
            if (L === w[li]) {
              run.idle = 0; var slot = top.querySelectorAll('.spslots > span')[li]; slot.textContent = L; slot.classList.add('on'); li++;
              if (LES) { lt++; lesBricks(L); } else addBrick(L);
              if (kbtn) { kbtn.classList.remove('bad'); kbtn.classList.add('good'); setTimeout(function () { kbtn.classList.remove('good'); }, 500); }
              if (!LES && placed >= TOTAL) { box.busy = true; kb.classList.add('locked'); run.right = 4; site.classList.add('done'); react(run.scr, 'cheer'); sfx('yay'); run.later(2200, function () { done({ right: 4, finished: true, built: TOTAL }); }); return; }
            } else {
              run.bad(site); react(run.scr, 'sad'); breakBrick(); if (LES) lt = Math.ceil(placed * ALL / TOTAL); li = -1;
              if (kbtn) { kbtn.classList.add('bad'); setTimeout(function () { kbtn.classList.remove('bad'); }, 700); }
              break;
            }
          }
          if (li < 0) { box.busy = true; kb.classList.add('locked'); if (LES) { lesNext(1500); return; } wi = (wi + 1) % W.length; run.later(1500, word); return; }   // one go: the brick breaks and the next word comes
          if (li >= w.length) { box.busy = true; kb.classList.add('locked'); run.good(site); react(run.scr, 'cheer'); if (LES) { rightW++; lesNext(900); return; } run.right--; wi = (wi + 1) % W.length; run.later(900, word); }
          else if (run.auto && !kbtn) autoGo(); else box.cue();
        }
        /* a press (or her own listening) turns auto listening on; typing a key turns it off, and a key may be typed while
           she listens: what she hears for a letter already typed past is dropped (stamp) */
        box.listen(function () { var w = letters(W[wi]); run.auto = true; stamp = wi + ':' + li; return { multi: true, word: spoken(W[wi]), target: w[li] }; }, function (r) {
          if ((stamp && stamp !== wi + ':' + li) || box.busy) return;   // (the ?tester buttons answer without a listen, so no stamp)
          stamp = ''; var got = r.value || [];
          if (!got.length) { if (run.auto && ++quiet < 2) { box.busy = false; box.go(); return; } quiet = 0; run.auto = false; box.cue(); return; }   // nothing heard: once more, then wait for a press
          quiet = 0; take(got);
        }, function () { return letters(W[wi]).slice(li).split(''); });
        var ready = function () { return !run.dead && !box.busy; };
        var typed = function (L, b) { run.auto = false; take([L], b); };
        kb.addEventListener('click', function (e) { var b = e.target.closest('.abckey'); if (b && ready()) typed(b.dataset.l, b); });
        var onKey = function (e) { if (run.dead) { document.removeEventListener('keydown', onKey); return; }
          var L = (e.key || '').toUpperCase(); if (L.length === 1 && L >= 'A' && L <= 'Z' && ready()) { e.preventDefault(); typed(L, kb.querySelector('[data-l="' + L + '"]')); } };
        document.addEventListener('keydown', onKey); run.offs.push(function () { document.removeEventListener('keydown', onKey); });   // gone with the game, not at the next key
        word();
      } }
  };

  Object.assign(GAMES, moreGames({ K, KART, h, say, sfx, drum, shuffle, micBox, line, F, io, opts, LW, txt, spoken, letters, gaps, secs, batches }));   // the Arewa games (games2.ts)

  // no "do you know this game?" before a game any more (Sani 2026-11-04): only the course's first step asks that, about the
  // letters. Every game opens on its own how-to the first time, and the gate's intro after that.
  start();
  return {
    stop: function () { gone = true; if (unl) { unl.stop(); unl = null; } if (live) live.stop(); closeMic(); io.hush(); try { ac && ac.close(); } catch (e) { /* closed */ } closeAC(); },
    again: function () { if (unl) unl.again(); else if (live && live.remind) live.remind(); },
  };
}
