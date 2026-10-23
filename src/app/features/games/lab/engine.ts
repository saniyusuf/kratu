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
import { moreGames } from './games2';
import { kakakiPlayer, kalanguDrummer, dancer, pickRhythm, playRhythm, playSigh } from './band';

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
  amp?: () => number;
  preparing?: () => boolean;
}
export interface GameHandle { stop(): void; again(): void; }
/** Inside a lesson (Haruffa's in-between games): only the letters learned so far, in order or mixed up, no opening
 *  question, and Laila on the score screen carries the child back into the lesson. */
export interface GameOpts { letters?: string[]; order?: 'in' | 'mixed'; lesson?: boolean; }

export function playGame(frame: HTMLElement, gid: string, io: GameIO, opts: GameOpts = {}): GameHandle {
  const KART = bootArt(), K = io.K, F = io.female ? 1 : 0, bg = frame.querySelector('.gbg');
  bootArt4(KART);
  let ac = null, live = null, gone = false, mic = null;
  function rnd(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function h(html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }
  function sfx(k) { if (!gone) io.sfx(K[k]); }
  function drum(big) {
    if (gone) return;
    try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
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
  function alloBtn() { return '<button type="button" class="gallo"><span class="asvg">' + K.allo + '</span><small>Ban sani ba</small></button>'; }
  function line(gid, which) { return K.lines[gid] && K.lines[gid][which]; }
  function closeMic() { if (mic) { try { mic.stop(); } catch (e) { /* closed */ } mic = null; } }

  function Run() {
    var self = this; this.scr = frame.querySelector('.scr'); this.dead = false; this.timers = []; this.miss = 0; this.right = 0; this.idle = 0; this.combo = 0; this.coins = 0;
    this.onDown = function (e) { self.lastEl = e.target.closest && e.target.closest('button'); };
    this.scr.addEventListener('pointerdown', this.onDown);
  }
  Run.prototype.later = function (ms, f) { var t = setTimeout(f, ms); this.timers.push(t); return t; };
  Run.prototype.stop = function () { this.dead = true; this.timers.forEach(clearTimeout); clearInterval(this.tick); closeMic(); io.hush(); this.scr.removeEventListener('pointerdown', this.onDown); };
  /* the clock: a bar that empties; right answers give 4 s back, wrong ones take 8. It stands still while the mic is open. */
  Run.prototype.clock = function (secs, onOut) {
    var self = this; this.left = secs * 1000; this.full = secs * 1000;
    var c = h('<div class="gclock"><span class="hcoin"><span class="coin s">Z</span><b class="cn">0</b></span><span class="bar"><i></i></span><b class="tm">' + secs + '</b><span class="combo"></span></div>'); this.scr.appendChild(c); this.cel = c;
    var last = performance.now();
    this.tick = setInterval(function () {
      var now = performance.now(), dt = now - last; last = now;
      if (self.listening) return;
      self.left -= dt;
      if (self.left <= 0) { self.left = 0; clearInterval(self.tick); onOut(); }
      self.paint();
      self.idle += 250;                                   // reminders: 10 s, 10 s more, then a 20 s rest
      var due = [10000, 20000, 40000, 50000, 70000, 80000];
      if (due.indexOf(self.idle) >= 0 && self.remind) self.remind();
    }, 250);
    this.paint();
  };
  Run.prototype.paint = function () { if (!this.cel) return; var p = Math.max(0, this.left / this.full); this.cel.querySelector('i').style.transform = 'scaleX(' + p + ')'; this.cel.querySelector('.tm').textContent = Math.ceil(this.left / 1000); this.cel.classList.toggle('low', this.left < 15000); };
  Run.prototype.bump = function (ms) { this.left = Math.max(0, Math.min(this.full, this.left + ms)); this.paint(); var b = h('<span class="bump ' + (ms > 0 ? 'up' : 'down') + '">' + (ms > 0 ? '+' : '−') + Math.abs(ms / 1000) + '</span>'); this.cel.appendChild(b); setTimeout(function () { b.remove(); }, 900); };
  Run.prototype.spark = function (el, pts) {
    var sr = io.rect(this.scr), r = el && el.getBoundingClientRect ? io.rect(el) : null;
    var x = r ? r.left + r.width / 2 - sr.left : sr.width / 2, y = r ? r.top + r.height / 2 - sr.top : sr.height / 2, k = sr.width / 100;
    var box = h('<div class="fx" style="left:' + x + 'px;top:' + y + 'px"></div>'), cols = ['#FFD54A', '#FFF1A8', '#4CAF50', '#1FA1D8', '#E63946'];
    for (var i = 0; i < 10; i++) { var a = i / 10 * Math.PI * 2, d = (6 + (i % 3) * 3) * k; box.insertAdjacentHTML('beforeend', '<i style="--dx:' + Math.cos(a) * d + 'px;--dy:' + Math.sin(a) * d + 'px;background:' + cols[i % 5] + '"></i>'); }
    if (pts) box.insertAdjacentHTML('beforeend', '<b>+' + pts + '</b>');
    this.scr.appendChild(box); setTimeout(function () { box.remove(); }, 900);
  };
  Run.prototype.good = function (el) {
    this.right++; this.idle = 0; this.combo++; var pts = 10 * Math.min(3, this.combo); this.coins += pts; sfx('yay');
    if (this.cel && !this.noBump) this.bump(4000);
    this.spark(el || this.lastEl, pts);
    if (this.cel) { var cn = this.cel.querySelector('.cn'); cn.textContent = this.coins; cn.parentNode.classList.remove('pulse'); void cn.offsetWidth; cn.parentNode.classList.add('pulse');
      var cb = this.cel.querySelector('.combo'); cb.innerHTML = this.combo >= 2 ? '🔥 ×' + Math.min(3, this.combo) : ''; cb.classList.toggle('on', this.combo >= 2); }
  };
  Run.prototype.bad = function (el) { this.miss++; this.idle = 0; this.combo = 0; sfx('nope'); if (this.cel) { var cb = this.cel.querySelector('.combo'); cb.innerHTML = ''; cb.classList.remove('on'); } this.scr.classList.remove('hit'); void this.scr.offsetWidth; this.scr.classList.add('hit'); if (this.cel && !this.noBump) this.bump(-8000); if (el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); } };

  /* The speaking games: Laila is the microphone. Press her, say it, and the answer comes back to `heard`.
     While she listens she glows red and the clock waits, so a slow speaker is never punished for the recogniser. */
  function micBox(run) {
    /* the same Laila the lessons press (Sani 2026-10-22): her glow, the green hear-rings, the sound bubble that moves
       with the child's voice, the REC tag, a hop when right and a head-shake when wrong */
    var box = h('<div class="mic micx"><span class="yn yes abc-start x-laila cue" role="button" aria-label="Laila"><span class="lglow"></span><span class="hearrings"></span>' +
      '<span class="lmw"><span class="lm">' + K.laila + '</span></span><span class="beak"></span><span class="hearbubble" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>' +
      '<span class="lhand">👆🏾</span><small>Faɗa</small></span></div>');
    var btn = box.querySelector('.x-laila'), raf = 0;
    function level() { btn.style.setProperty('--amp', String(io.amp ? io.amp() : 0)); btn.classList.toggle('prep', !!(io.preparing && io.preparing())); raf = requestAnimationFrame(level); }
    box.listen = function (opts, heard, right) {
      box.heard = heard; box.right = right;
      if (io.tester && !box.querySelector('.tester')) {     // ?debug only: answer for the child, for a desk without a microphone
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
    box.cue = function (on) { box.busy = false; btn.classList.toggle('cue', on !== false); };   // ready for an answer
    box.yay = function () { btn.classList.remove('yay', 'nope'); void btn.offsetWidth; btn.classList.add('yay'); setTimeout(function () { btn.classList.remove('yay'); }, 800); };
    box.nope = function () { btn.classList.remove('yay', 'nope'); void btn.offsetWidth; btn.classList.add('nope'); setTimeout(function () { btn.classList.remove('nope'); }, 800); };
    return box;
  }


  /* ---------- the three screens every game shares ---------- */
  function question() {
    if (live) live.stop();
    var g = GAMES[gid], run = new Run(); live = run;
    run.scr.className = 'scr q'; bg.innerHTML = '';
    run.scr.innerHTML = '<div class="eye">' + g.title + '</div>' +
      '<div class="qrow">' + lailaBtn('yes talking', 'Na sani') + alloBtn() + '</div>';   // the question is heard, never written (Kratu rule)
    var yes = run.scr.querySelector('.glaila'), no = run.scr.querySelector('.gallo');
    yes.onclick = function () { start(); };
    no.onclick = function () { result(run, { learn: true }); };
    run.remind = null;
    say(line(gid, 'ask'), run).then(function () { if (!run.dead) { yes.classList.remove('talking'); yes.classList.add('cue'); } });
  }
  function start() {
    if (live) live.stop();
    var g = GAMES[gid], run = new Run(); live = run;
    run.scr.className = 'scr p ' + g.cls;
    var PAINT = { 'j-abubuwa': 'underriver', 'j-magana': 'courtyard', 'j-nemo': 'market', 'j-lambobi': 'nightvillage', 'j-karatu': 'riverart', 'j-rubutu': 'potteryard', 'j-rubutu-say': 'savanna' };
    var scene = KART.scene[g.scene || PAINT[gid]] || '';
    if (gid === 'j-abubuwa') scene = '<div class="scene paint">' + KART.scene.underriver + KART.underwater + '</div>';
    bg.innerHTML = scene; run.scr.innerHTML = '<div class="eye">' + g.title + '</div>';   // the scene fills the whole screen, behind the game's box
    var go = function () {
      if (run.dead) return;
      var cd = h('<div class="cdown"><b></b></div>'); run.scr.appendChild(cd); var steps = ['3', '2', '1', 'Fara!'], i = 0;
      (function tick() {
        if (run.dead) return; if (i >= steps.length) { cd.remove(); g.play(run, function (r) { result(run, r); }); return; }
        var b = cd.querySelector('b'); b.textContent = steps[i]; b.classList.remove('in'); void b.offsetWidth; b.classList.add('in'); drum(i === 3); i++; run.later(i === 4 ? 650 : 600, tick);
      })();
    };
    var how = line(gid, 'how');
    if (how) {
      var s = h('<div class="gsay">' + lailaBtn('talking') + '</div>'); run.scr.appendChild(s);   // Laila explains out loud; nothing written
      var skip = false; s.querySelector('.glaila').onclick = function () { if (skip) return; skip = true; io.hush(); s.remove(); go(); };   // a tap while she explains starts the game
      say(how, run).then(function () { if (skip || run.dead) return; skip = true; s.remove(); go(); });
    } else go();
  }
  function result(run, r) {
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
    res.scr.querySelector('.glaila').onclick = function () { if (opts.lesson && io.next) { live && live.stop(); io.next(r); } else question(); };
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
        // six casts, one touch each (Sani 2026-10-23: a miss is part of the game): a wrong fish slips off the hook and the
        // shoal darts away, and the next cast comes; the right one goes into the net
        var words = shuffle(['goat', 'mango', 'car', 'dog', 'banana', 'horse', 'cow', 'bus', 'fish', 'apple', 'cup', 'chair']), r = 0, n = 0, target, busy = false;
        var pond = h('<div class="pond2"></div>'), net = h('<div class="net">🥅 <b>0</b> / 6</div>');
        run.scr.appendChild(pond); run.scr.appendChild(net); run.clock(120, function () { done({ right: r, part: r / 6 }); });
        run.remind = function () { say(K.en[target], run); };
        function round() {
          pond.innerHTML = ''; pond.classList.remove('scared'); busy = false; target = words[n]; var opts = shuffle([target].concat(shuffle(words.filter(function (w) { return w !== target; })).slice(0, 2)));
          opts.forEach(function (w, k) {
            var f = h('<button type="button" class="fish2 fish3" style="top:' + (k * 34) + '%;animation-duration:' + (24 + k * 3) + 's;animation-delay:-' + (k * 8) + 's" aria-label="fish">' + KART.fish3(K.pic[w]) + '</button>');
            f.onclick = function () {
              if (busy || run.dead) return; busy = true; n++;
              if (w === target) { run.good(); f.classList.add('caught'); r++; net.querySelector('b').textContent = r; }
              else { run.bad(); f.classList.add('slip'); pond.classList.add('scared'); }
              run.later(w === target ? 900 : 1600, function () { if (n >= 6) done({ right: r, finished: r === 6, part: r / 6, misses: run.miss }); else round(); });
            };
            pond.appendChild(f);
          });
          say(K.en[target], run);
        }
        round();
      } },

    /* Kalangu, made plain (Sani 2026-10-14: "I don't understand it"). One picture on a stand with a "?" under it. Press
       Laila and say its name. Right: the "?" turns over to show the word, Laila beats her drum and a drum in the row
       lights up. Wrong: try once more; the second miss shows the word and moves on. Six pictures. */
    'j-magana': { title: 'Kalangu', cls: 'drum', instr: ['Duba hoton nan. Ka danna Laila, ka faɗi sunansa da Turanci, sai in buga kalangu!', 'Duba hoton nan. Ki danna Laila, ki faɗi sunansa da Turanci, sai in buga kalangu!'], ask: ['Ka iya faɗin sunayen abubuwa da Turanci?', 'Kin iya faɗin sunayen abubuwa da Turanci?'],
      placeNo: 'Abubuwa would start at Dabbobi, with the lessons.',
      place: function (r) { return r.right >= 6 ? 'Said every word: those sets would be skipped.' : 'Said ' + r.right + ' of 6: the sets they could not say would be taught.'; },
      /* Kalangu (Sani 2026-10-22): one picture, one answer, no hints. Right: the band plays one of fifteen rhythms
         (at least three seconds) and the dancers come out; the word shows on the plate. Wrong: the plate shows a red
         cross, the band sighs on the kakaki and the drummers shake their heads; the word is never shown or said. */
      play: function (run, done) {
        var words = shuffle(['horse', 'goat', 'cat', 'dog', 'cup', 'chair', 'bed', 'sun', 'book', 'chicken']).slice(0, 6), r = 0, said = 0;
        var stage = h('<div class="kstage">' +
          '<div class="easel"><div class="kcard"><img alt=""></div><div class="plate"><span class="pf">?</span><span class="pb"></span></div><span class="legs"></span></div>' +
          '<div class="kband"><span class="bm k1">' + kakakiPlayer() + '</span><span class="bm d1">' + kalanguDrummer(0) + '</span><span class="bm d2">' + kalanguDrummer(1) + '</span><span class="notes"><i>♪</i><i>♫</i><i>♪</i></span></div>' +
          '<div class="dancers"><span class="dn">' + dancer(0) + '</span><span class="dn">' + dancer(1) + '</span><span class="dn">' + dancer(2) + '</span></div>' +
          '</div>');
        var row = h('<div class="krow">' + words.map(function () { return '<span class="kd">' + KART.minidrum() + '</span>'; }).join('') + '</div>');
        var box = micBox(run);
        run.scr.appendChild(stage); run.scr.appendChild(row); run.scr.appendChild(box);
        run.clock(150, function () { done({ right: said, part: said / 6 }); });
        run.remind = function () { say(line(gid, 'how'), run); };
        var card = stage.querySelector('.easel'), plate = stage.querySelector('.plate'), band = stage.querySelector('.kband'), dancers = stage.querySelector('.dancers');
        function audio() { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); return ac; } catch (e) { return null; } }
        function round() {
          var w = words[r];
          card.classList.remove('in', 'out'); plate.classList.remove('flip', 'miss'); void card.offsetWidth;
          card.querySelector('img').src = K.pic[w]; plate.querySelector('.pb').textContent = w; card.classList.add('in'); row.children[r].classList.add('now');
          box.cue();
          box.listen(function () { return { target: w, among: words, match: function (raw) { return io.match(raw, w, words); } }; }, function (res) {
            if (res.value === null && !res.raw) { box.cue(); return; }                  // nothing heard: press again
            box.busy = true; row.children[r].classList.remove('now');
            if (res.value === w) {
              box.yay(); run.good(card); said++; plate.classList.add('flip'); row.children[r].classList.add('on');
              var a = audio(), ms = a ? playRhythm(a, pickRhythm()) : 3500;
              band.classList.add('play'); dancers.classList.add('on');
              run.later(ms, function () { band.classList.remove('play'); dancers.classList.remove('on'); });
              next(ms + 500);
            } else {
              box.nope(); run.bad(card); plate.classList.add('miss'); row.children[r].classList.add('miss');
              var b = audio(); if (b) playSigh(b); band.classList.add('cross'); run.later(1500, function () { band.classList.remove('cross'); });
              next(1900);
            }
          }, function () { return w; });
        }
        function next(ms) {
          run.later(ms, function () { card.classList.add('out'); r++;
            if (r >= 6) run.later(500, function () { done({ right: said, finished: true, part: said / 6, misses: 6 - said }); }); else run.later(450, round); });
        }
        round();
      } },

    'j-nemo': { title: 'Hanzarin kasuwa', cls: 'market2', instr: ['Masu saye sun zo! Ka ba kowa abin da ya roƙa da sauri.', 'Masu saye sun zo! Ki ba kowa abin da ya roƙa da sauri.'], ask: ['Za ka iya gane abu idan an faɗe shi da Turanci?', 'Za ki iya gane abu idan an faɗe shi da Turanci?'],
      placeNo: 'Nemo hoto would start from the four-picture rounds.',
      place: function (r) { return r.right >= 6 ? 'Served everyone: Nemo hoto would be done.' : 'Served ' + r.right + ' of 6: Nemo hoto would start from the four-picture rounds.'; },
      play: function (run, done) {
        var goods = ['tomato', 'bread', 'egg', 'orange', 'onion', 'banana'], people = ['woman', 'man', 'girl', 'boy', 'old_man', 'woman'], q = shuffle(goods), c = 0, served = 0, pt;
        var top = h('<div class="cust"><span class="person"></span><span class="ask"><i></i></span><span class="pat"><b></b></span></div>');
        run.scr.appendChild(h('<div class="awnwrap">' + KART.awning() + '</div>'));
        var mat = h('<div class="mat2">' + goods.map(function (k) { return '<button type="button" class="mi2 bowl" data-k="' + k + '">' + KART.bowl(K.pic[k]) + '</button>'; }).join('') + '</div>');
        var sold = h('<div class="sold"><span class="coin s">Z</span> <b>0</b> / 6</div>');
        var shop = h('<div class="shop"><div class="buyer"></div></div>'); shop.firstChild.appendChild(top); shop.firstChild.appendChild(sold); shop.appendChild(mat);   // the buyer beside the stall, so the goods can be big
        run.scr.appendChild(shop); run.clock(90, function () { done({ right: served, part: served / 6 }); });
        run.remind = function () { say(K.en[q[c]], run); };
        function next() {
          if (c >= 6) return done({ right: served, finished: served === 6, part: served / 6 });
          var who = people[c]; top.querySelector('.person').innerHTML = '<img alt="" src="' + K.pic[who] + '">';
          top.classList.remove('leave', 'come'); void top.offsetWidth; top.classList.add('come');
          var bar = top.querySelector('.pat b'); bar.style.transition = 'none'; bar.style.transform = 'scaleX(1)'; void bar.offsetWidth; bar.style.transition = 'transform 12s linear'; bar.style.transform = 'scaleX(0)';
          clearTimeout(pt); pt = run.later(12000, function () { run.miss++; top.classList.add('leave'); c++; run.later(600, next); });
          say(K.en[q[c]], run);
        }
        [].forEach.call(mat.children, function (b) {
          b.onclick = function () {
            if (c >= 6 || run.dead) return;
            if (b.dataset.k === q[c]) { clearTimeout(pt); run.good(); served++; sold.querySelector('b').textContent = served; b.classList.add('fly'); setTimeout(function () { b.classList.remove('fly'); }, 700); top.classList.add('leave'); c++; run.later(700, next); }
            else { clearTimeout(pt); run.bad(b); top.classList.add('sad', 'leave'); c++; run.later(1200, function () { top.classList.remove('sad'); next(); }); }   // one go: the customer leaves unhappy
          };
        });
        next();
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

    'j-karatu': { title: 'Kwale-kwale', cls: 'pondbg', instr: ['Ka karanta kalmar da ke cikin kowane kwale-kwale, sannan ka danna wadda ta dace da hoton.', 'Ki karanta kalmar da ke cikin kowane kwale-kwale, sannan ki danna wadda ta dace da hoton.'], ask: ['Ka iya karanta kalmomi da Turanci?', 'Kin iya karanta kalmomi da Turanci?'],
      placeNo: 'Karatu would start at short words, with the lessons.',
      place: function (r) { return r.right >= 5 && !r.misses ? 'Read every word: the full game moves on to longer words.' : 'Read ' + r.right + ' of 5: Karatu would start at short words.'; },
      /* Kwale-kwale (Sani 2026-10-22): one answer. The right canoe paddles off fast through a splash with the sound of
         the paddle in the water; a wrong one sinks with bubbles and a gurgle, and the round is marked wrong. Fish leap
         now and then, and a fisherman sits on the far bank with his line in the water. */
      play: function (run, done) {
        var R = shuffle([['cat', ['CAT', 'CAR', 'CUP']], ['dog', ['DOG', 'DIG', 'LOG']], ['sun', ['SUN', 'BUN', 'SUB']], ['bus', ['BUS', 'BUT', 'BUN']], ['cup', ['CUP', 'CAP', 'CUT']]]), r = 0, got = 0, busy = false;
        var bank = h('<div class="bank2"><img alt=""></div>'), river = h('<div class="canal2"></div>');
        var life = h('<div class="riverlife"><span class="fisher">' + fisherman() + '</span>' + [0, 1, 2].map(function (k) { return '<span class="leap l' + k + '">' + leapFish() + '</span>'; }).join('') + '</div>');
        run.scr.appendChild(life); run.scr.appendChild(bank); run.scr.appendChild(river); run.clock(120, function () { done({ right: got, part: got / 5, misses: run.miss }); });
        run.remind = function () { say(line(gid, 'how'), run); };
        function audio() { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); return ac; } catch (e) { return null; } }
        function freeze(c) { var m = getComputedStyle(c).transform; c.style.animation = 'none'; c.style.transform = m === 'none' ? '' : m; void c.offsetWidth; }
        function splash(c, cls) { var cr = io.rect(c), rr = io.rect(river), sp = h('<span class="' + cls + '" style="left:' + (cr.left - rr.left + cr.width * .45) + 'px;top:' + (cr.top - rr.top + cr.height * .7) + 'px"><i></i><i></i><i></i><b></b><b></b><b></b></span>'); river.appendChild(sp); setTimeout(function () { sp.remove(); }, 1600); }
        function round() {
          busy = false; var item = R[r]; bank.querySelector('img').src = K.pic[item[0]]; river.innerHTML = '';
          shuffle(item[1]).forEach(function (w, k) {
            var c = h('<button type="button" class="canoe2" style="top:' + (6 + k * 32) + '%;animation-duration:' + (23 + k * 2.8) + 's;animation-delay:-' + (k * 7.4) + 's">' + KART.canoe(w) + '</button>');
            c.onclick = function () {
              if (run.dead || busy) return; busy = true;
              if (w === item[0].toUpperCase()) {
                run.good(c); got++; freeze(c); c.classList.add('row'); splash(c, 'splash');
                var a = audio(); if (a) paddleSound(a);
                requestAnimationFrame(function () { c.style.transition = 'transform 1.4s cubic-bezier(.5,0,.8,.4)'; c.style.transform = 'translateX(150cqw)'; });
              } else {
                run.bad(); freeze(c); c.classList.add('sink'); splash(c, 'bubbles');
                var b = audio(); if (b) sinkSound(b);
                requestAnimationFrame(function () { c.style.transition = 'transform 1.6s ease-in, opacity 1.2s ease-in .4s'; c.style.transform += ' translateY(9cqw) rotate(-14deg)'; c.style.opacity = '0'; });
              }
              r++; if (r >= 5) run.later(1900, function () { done({ right: got, finished: true, part: got / 5, misses: run.miss }); }); else run.later(1900, round);
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
        var W = shuffle(['cat', 'dog', 'sun', 'bus']), wi = 0, li = 0, words = 0, misses = 0, busy = false;
        var top = h('<div class="sp"><span class="sppic"><img alt=""></span><div class="spslots"></div></div>');
        var pad = h('<div class="pots2"></div>');
        run.scr.appendChild(top); run.scr.appendChild(pad);
        run.clock(120, function () { done({ right: words, part: words / 4, misses: misses }); });
        run.remind = function () { say(K.en[W[wi]], run); };
        function nextWord() { wi++; if (wi >= W.length) run.later(900, function () { done({ right: words, finished: words === W.length, misses: misses }); }); else run.later(1000, word); }
        function word() {
          busy = false; var w = W[wi].toUpperCase(); li = 0; top.querySelector('img').src = K.pic[W[wi]];
          top.querySelector('.spslots').innerHTML = w.split('').map(function () { return '<span></span>'; }).join('');
          var pool = shuffle(w.split('').concat(shuffle('BDEGHKLMPRT'.split('').filter(function (x) { return w.indexOf(x) < 0; })).slice(0, 2)));
          pad.innerHTML = '';
          pool.forEach(function (L) {
            var b = h('<button type="button" class="pot2">' + KART.pot(L) + '</button>');
            b.onclick = function () {
              if (b.disabled || run.dead || busy) return;
              if (L === w[li]) {
                run.idle = 0; b.disabled = true; var slot = top.querySelectorAll('.spslots > span')[li], k = li; li++;
                var br = io.rect(b), sr = io.rect(slot);
                b.style.setProperty('--tx', (sr.left + sr.width / 2 - (br.left + br.width / 2)) + 'px'); b.style.setProperty('--ty', (sr.top + sr.height / 2 - (br.top + br.height / 2)) + 'px');
                b.classList.add('fly');                                 // the pot lifts off its place into the box
                run.later(560, function () { slot.innerHTML = '<span class="mp">' + KART.pot(L) + '</span>'; slot.classList.add('on'); b.classList.add('gone'); say(K.L[L], run); run.spark(slot, 5); });
                if (li >= w.length) { busy = true; run.later(700, function () { run.good(top.querySelector('.spslots')); words++; }); nextWord(); }
              } else {
                // a wrong pot cracks: a crash, the word is marked wrong, and on to the next word
                busy = true; misses++; run.bad(); b.classList.add('crack'); b.insertAdjacentHTML('beforeend', '<i class="shard s1"></i><i class="shard s2"></i><i class="shard s3"></i><i class="shard s4"></i>');
                try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); crashSound(ac); } catch (e) { /* no sound */ }
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
        var W = shuffle(['cat', 'dog', 'sun', 'bus']), wi = 0, li = 0, placed = 0, TOTAL = 12;
        var top = h('<div class="sp hs"><span class="sppic"><img alt=""></span><div class="spslots"></div><span class="hpct"><b>0</b>%</span></div>');
        var ROWS = [[102, 4, 18, 182], [76, 4, 28, 172], [50, 3, 44, 156], [24, 1, 70, 130]], bricksSvg = '';
        ROWS.forEach(function (r) { var w = (r[3] - r[2]) / r[1]; for (var k = 0; k < r[1]; k++) { var x = r[2] + k * w;
          bricksSvg += '<g class="hb ghost"><rect x="' + (x + 1) + '" y="' + (r[0] + 1) + '" width="' + (w - 2) + '" height="24" rx="4"/><rect class="tex" x="' + (x + 1) + '" y="' + (r[0] + 1) + '" width="' + (w - 2) + '" height="24" rx="4" fill="url(#kc-crack)"/><text x="' + (x + w / 2) + '" y="' + (r[0] + 18) + '" text-anchor="middle"></text></g>'; } });
        var site = h('<div class="site"><svg class="dome" viewBox="0 0 200 140" aria-hidden="true">' +
          '<defs><clipPath id="domeclip"><path d="M16 128 A84 96 0 0 1 184 128 Z"/></clipPath>' +
          '<linearGradient id="mudb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9A066"/><stop offset="1" stop-color="#A9672E"/></linearGradient>' +
          '<radialGradient id="domeshade" cx=".36" cy=".3" r=".85"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#3A2412" stop-opacity=".55"/></radialGradient></defs>' +
          '<ellipse class="shadow" cx="100" cy="130" rx="92" ry="9"/>' +
          '<path class="outline" d="M16 128 A84 96 0 0 1 184 128 Z"/>' +
          '<g clip-path="url(#domeclip)">' + bricksSvg +
          '<g class="relief" fill="none" stroke="#FFF1D6" stroke-width="1.4"><path d="M70 62 q10 -12 20 0 q10 12 20 0 q10 -12 20 0"/><circle cx="100" cy="44" r="5"/><path d="M95 44 h10 M100 39 v10"/></g>' +
          '<path class="band" d="M20 102 l10 -6 l10 6 l10 -6 l10 6 l10 -6 l10 6 l10 -6 l10 6 l10 -6 l10 6 l10 -6 l10 6 l10 -6 l10 6 l10 -6 l10 6"/>' +
          '<ellipse cx="100" cy="128" rx="84" ry="96" fill="url(#domeshade)" class="shade"/></g>' +
          '<path class="door" d="M84 128 V108 a16 16 0 0 1 32 0 V128 z"/><path class="doorlip" d="M80 128 V107 a20 20 0 0 1 40 0 V128"/>' +
          '<g class="finial"><rect x="96" y="12" width="8" height="12" rx="2"/><circle cx="100" cy="10" r="5"/></g>' +
          '<g class="pot"><ellipse cx="146" cy="126" rx="10" ry="9"/><rect x="141" y="114" width="10" height="4" rx="2"/></g>' +
          '</svg><span class="ground"></span></div>');
        var box = micBox(run);
        var hrow = h('<div class="hrow"></div>'); hrow.appendChild(site);
        run.scr.appendChild(top); run.scr.appendChild(hrow); run.scr.appendChild(box);
        run.noBump = true;
        run.clock(150, function () { done({ right: wi, part: placed / TOTAL, built: placed }); });
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
          var w = W[wi].toUpperCase(); li = 0; top.querySelector('img').src = K.pic[W[wi]];
          top.querySelector('.spslots').innerHTML = w.split('').map(function () { return '<span></span>'; }).join('');
          box.cue();
          run.later(200, function () { say(K.en[W[wi]], run); });
        }
        /* "C A T" in one breath is welcome: every letter heard in order is a brick; the first wrong one breaks one and stops */
        box.listen(function () { var w = W[wi].toUpperCase(); return { multi: true, word: W[wi], target: w[li] }; }, function (r) {
          var w = W[wi].toUpperCase(), got = r.value || [];
          if (!got.length) { box.cue(); return; }
          for (var k = 0; k < got.length && li < w.length; k++) {
            var L = String(got[k]).toUpperCase();
            if (L === w[li]) {
              run.idle = 0; var slot = top.querySelectorAll('.spslots > span')[li]; slot.textContent = L; slot.classList.add('on'); addBrick(L); li++;
              if (placed >= TOTAL) { box.busy = true; run.right = 4; site.classList.add('done'); sfx('yay'); run.later(1800, function () { done({ right: 4, finished: true, built: TOTAL }); }); return; }
            } else { run.bad(site); breakBrick(); li = -1; break; }
          }
          if (li < 0) { box.busy = true; wi = (wi + 1) % W.length; run.later(1500, word); return; }   // one go: the brick breaks and the next word comes
          if (li >= w.length) { box.busy = true; run.good(site); run.right--; wi = (wi + 1) % W.length; run.later(900, word); }
          else box.cue();
        }, function () { return W[wi].toUpperCase().slice(li).split(''); });
        word();
      } }
  };

  Object.assign(GAMES, moreGames({ K, KART, h, say, sfx, drum, shuffle, micBox, line, F, io, opts }));   // the Arewa games (games2.ts)

  if (opts.lesson) start(); else question();
  return {
    stop: function () { gone = true; if (live) live.stop(); closeMic(); io.hush(); try { ac && ac.close(); } catch (e) { /* closed */ } },
    again: function () { if (live && live.remind) live.remind(); else if (live && live.scr.classList.contains('q')) say(line(gid, 'ask'), live); },
  };
}

/** The games, for the list in the settings. The balloons are the app's own screen. */
export const GAME_LIST: { id: string; name: string; en: string; section: string; q?: Record<string, string> }[] = [
  { id: 'fashe', name: 'Fashe haruffa', en: 'Pop the balloons · the whole A–Z', section: 'Haruffa' },
  { id: 'j-durbar', name: 'Hawan Sallah · a jere', en: 'Durbar, A–P in order · speaking', section: 'Haruffa', q: { letters: 'ABCDEFGHIJKLMNOP', order: 'in' } },
  { id: 'j-durbar', name: 'Hawan Sallah · a gauraye', en: 'Durbar, A–X mixed up · speaking', section: 'Haruffa', q: { letters: 'ABCDEFGHIJKLMNOPQRSTUVWX', order: 'mixed' } },
  { id: 'j-abubuwa', name: 'Kamun kifi', en: 'Catch the fish', section: 'Abubuwa' },
  { id: 'j-magana', name: 'Kalangu', en: 'The talking drum · speaking', section: 'Abubuwa' },
  { id: 'j-dillali', name: 'Dillalin kasuwa', en: 'The auctioneer · speaking', section: 'Abubuwa' },
  { id: 'j-nemo', name: 'Hanzarin kasuwa', en: 'Market rush', section: 'Nemo hoto' },
  { id: 'j-shayi', name: 'Mai shayi', en: 'The tea seller · speaking', section: 'Nemo hoto' },
  { id: 'j-gyada', name: 'Dalar gyaɗa', en: 'The groundnut pyramids', section: 'Lambobi' },
  { id: 'j-shanu', name: 'Kasuwar shanu', en: 'The cattle market', section: 'Lambobi' },
  { id: 'j-garke', name: 'Ƙirgen shanu', en: 'Counting the herd · speaking', section: 'Lambobi' },
  { id: 'j-suya', name: 'Mai suya', en: 'The suya seller · speaking', section: 'Lambobi' },
  { id: 'j-karatu', name: 'Kwale-kwale', en: 'The canoes', section: 'Karatu' },
  { id: 'j-allo', name: 'Allo', en: 'The writing board · speaking', section: 'Karatu' },
  { id: 'j-jirgi', name: 'Jirgin ruwa', en: 'The ferry · speaking', section: 'Karatu' },
  { id: 'j-rubutu', name: 'Tukwane', en: 'Clay pots', section: 'Rubutu' },
  { id: 'j-rubutu-say', name: 'Ginin bulo', en: 'Build the house · speaking', section: 'Rubutu' },
  { id: 'j-marubuci', name: 'Marubucin wasiƙa', en: 'The letter writer · speaking', section: 'Rubutu' },
];
