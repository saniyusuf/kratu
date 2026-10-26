// @ts-nocheck
/*
 * The Arewa games (Sani 2026-10-16): two speaking games for every lesson, and Lambobi's games done again. Each is
 * drawn with the shaded, animated SVG in art4.ts; the words a child must name are the lessons' own photos, framed
 * inside those drawings. Same rules as the other games: one fixed box, transform and opacity only, Laila is the
 * microphone and the clock waits while she listens.
 */
import * as A from './art4';
import { GOODS, ACT_MS, deal, photoCard, inspector, coinBurst, marketLife, coinClink, aaNo } from './market';
import { durbarRider, emirThrone, sallahBand, dogari, maiFanka, hooves, fanfare, groan, RIDER_COUNT } from './durbar';
import { zebu, tuft, herdsman, cowbell, moo, egret, priceBoard } from './herd';
import { dabba, dabSound } from './sc-shanu';
import { react as reactScene } from './rest';
import { alloWrite, alloWash } from './sc-allo';
import { postRider, envelopeArt, inkLetter, splat, wasikaSound } from './sc-wasika';
import * as JR from './sc-jirgi';
import { teaStall, umbrellaBench, roadBehind, cupTap, served, waiter, CUSTOMERS } from './teastall';

export function moreGames(c: any): Record<string, any> {
  const { K, h, say, sfx, drum, shuffle, micBox, line, F, io } = c, opts = c.opts || {};
  const later = (run, ms, f) => run.later(ms, f);
  const beat = (run, n) => { for (let k = 0; k < n; k++) later(run, k * 200, () => drum(k % 2 === 0)); };
  const bump = (el, cls, ms = 700) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); if (ms) setTimeout(() => el.classList.remove(cls), ms); };
  /** one picture on a card, the lessons' photo */
  const photo = (w, cls = '') => `<span class="ph ${cls}"><img alt="" src="${K.pic[w]}"></span>`;
  /** a speaking round: press Laila, say it; right → onRight, wrong → onWrong(tries). Two tries, then the answer is shown. */
  /* one answer each (Sani 2026-10-22): no second go, no hints, the answer is never shown or said. Right: Laila hops;
     wrong: she shakes her head, the turn is marked wrong and the game shows its displeasure. */
  function speakRound(run, box, target, among, onRight, onMiss, tries = 1) {
    let t = 0; box.cue();
    /* a single letter is heard the way the alphabet lessons hear it (Sani 2026-10-23: the Durbar never heard a letter):
       the letter grammar has the letters' spoken names (bee, see, aitch…) and gives back the capital letter. The word
       matcher left both out, so "bee" was never B, and the lowercase "b" it did return never equalled "B". */
    const letter = /^[A-Z]$/.test(target);
    box.listen(() => letter ? { target } : { target, among, match: (raw) => io.match(raw, target, among) }, (r) => {
      if (r.value === null && !r.raw) { box.cue(); return; }
      if (r.value === target) { box.busy = true; box.yay(); onRight(); return; }
      t++; run.bad(); box.nope();
      if (t >= tries) { box.busy = true; onMiss(); } else box.cue();
    }, () => target);
  }
  /* the same round, with Laila listening by herself (Sani 2026-10-25, "auto mode like the other games"): the first
     picture waits for a press; every press or listen after that turns her own listening on, so the next round opens
     the microphone by itself once her last word has finished. Nothing heard: she listens once more, then waits for a
     press again. `scene` is the drawn background, whose people cheer a right answer and frown at a wrong one. */
  function autoRound(run, box, target, among, onRight, onMiss) {
    let quiet = 0;
    box.listen(() => { run.auto = true; return { target, among, match: (raw) => io.match(raw, target, among) }; }, (r) => {
      if (r.value === null && !r.raw) {
        if (run.auto && ++quiet < 2) { box.busy = false; box.go(); return; }
        run.auto = false; box.cue(); return;
      }
      box.busy = true;
      if (r.value === target) { box.yay(); react(run, 'cheer'); onRight(); return; }
      run.bad(); box.nope(); react(run, 'sad'); onMiss();
    }, () => target);
    autoGo(run, box);
  }
  /** open the microphone by itself once Laila is quiet (her last line is run.said), or cue her for a press */
  function autoGo(run, box) {
    if (!run.auto || !box.go) { box.cue(); return; }
    box.busy = true;
    Promise.resolve(run.said).then(() => later(run, 450, () => { if (!run.dead && !run.listening) { box.busy = false; box.go(); } }));
  }
  /** a line that the next auto listen waits for */
  const sayW = (run, src) => (run.said = say(src, run));
  const react = (run, kind) => reactScene(run.scr, kind);

  return {
    /* ---------------- Haruffa: Hawan Sallah, the Durbar ---------------- */
    'j-durbar': { title: 'Hawan Sallah', cls: 'durbar', scene: 'palace', noHow: true,   // the example teaches it; "how" stays the reminder
      placeNo: 'Haruffa would start at A, with the lessons.',
      place: (r) => r.missed.length ? 'Could not say <b>' + r.missed.join(', ') + '</b>: those letters are taught again.' : 'Every horseman greeted the emir: every letter said.',
      play(run, done) {
        // always mixed up, never in order: the balloons already check A to Z in order. Given letters (the learning path sends
        // those learned so far), only those; given none, the full alphabet A to Z (Sani 2026-10-24)
        const L8 = shuffle(opts.letters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')), N = L8.length; let i = 0; const missed = [];
        // the emir at his gate with his court about him: a dogari each side, his attendant fanning him (no horses behind: Sani 2026-10-24)
        const st = h('<div class="dstage">' +
          '<div class="sallahw">' + sallahBand() + '</div><span class="gg l">' + dogari(2) + '</span><span class="gg r">' + dogari(3) + '</span>' +
          '<div class="courtw"><span class="cw dg l">' + dogari(0) + '</span><div class="emirw">' + emirThrone() + '</div><span class="cw fk">' + maiFanka() + '</span><span class="cw dg r">' + dogari(1) + '</span></div>' +
          '<div class="rlane"></div></div>');
        const looks = shuffle(Array.from({ length: RIDER_COUNT }, (_, k) => k));   // a different horseman each time
        const row = h('<div class="lrow' + (N > 12 ? ' many' : '') + '">' + L8.map(() => '<span></span>').join('') + '</div>');
        const box = micBox(run);
        run.scr.appendChild(st); run.scr.appendChild(row); run.scr.appendChild(box);
        run.remind = () => say(line('j-durbar', 'how'), run);
        const lane = st.querySelector('.rlane'), emir = st.querySelector('.emirw'), court = st.querySelector('.courtw'), bandEl = st.querySelector('.sallahw');
        const lbtn = box.querySelector('.x-laila'); lbtn.classList.remove('cue');   // no cue until the example is over
        const scene = run.scr.closest('.glab')?.querySelector('.gbg>.scene');   // the painted palace: its gate, its guards and the children on the square
        posts();
        /** a horseman gallops in with his letter and reins in before the emir */
        function arrive(L, look) {
          lane.innerHTML = ''; lane.classList.remove('enter'); if (scene) scene.classList.remove('open', 'cheer'); st.classList.remove('open'); posts();   // the gate swings shut behind the last one
          const rw = h('<div class="rw">' + durbarRider(L, look) + '</div>'); lane.appendChild(rw); emir.classList.remove('cross', 'pleased'); court.classList.remove('pleased');
          rw.classList.add('gallop'); void rw.offsetWidth; rw.classList.add('in'); hooves(1.1); return rw;
        }
        /** right: the horse prances (the zormo), then kneels to greet the emir; rider and emir smile (Sani 2026-10-22).
            The band answers only once the letter has been said: kakaki, drums and the women's guda, and the children wave.
            Then (Sani 2026-10-23) the guards haul the gate open and he rides in behind the court, into the palace. */
        function greet(rw) {
          rw.classList.remove('listen'); rw.classList.add('zormo'); later(run, 900, () => { fanfare(); beat(run, 4); bandEl.classList.add('play'); if (scene) scene.classList.add('cheer'); }); later(run, 3200, () => bandEl.classList.remove('play'));
          later(run, 1300, () => { rw.classList.remove('zormo'); rw.classList.add('kneel'); emir.classList.add('pleased'); court.classList.add('pleased'); });
          later(run, 2400, () => { if (scene) scene.classList.add('open'); st.classList.add('open'); });   // the guards haul the gate open
          later(run, 3000, () => { rw.classList.remove('kneel'); toGate(rw); lane.classList.add('enter'); rw.classList.add('gallop', 'enter'); hooves(1.4, true); });
        }
        /** the gate guards stand at the gate's posts (x 61 and 99 of the drawing), their feet on its threshold */
        function posts() {
          const g = gateAt(), d = st.getBoundingClientRect(), k = st.offsetWidth / (d.width || 1); if (!g) return;
          st.querySelectorAll('.gg').forEach((el, n) => { el.style.left = ((g.x(n ? 99 : 61) - d.left) * k - el.offsetWidth / 2).toFixed(1) + 'px'; el.style.bottom = ((d.bottom - g.y(70)) * k).toFixed(1) + 'px'; });
        }
        function gateAt() {
          if (!scene) return null; const r = scene.getBoundingClientRect(), s = Math.max(r.width / 160, r.height / 100);
          return { x: (v) => r.left + (r.width - 160 * s) / 2 + v * s, y: (v) => r.top + (r.height - 100 * s) / 2 + v * s };
        }
        /** where the gate's threshold is on screen: the scene is a 160×100 drawing sliced to fill, the gate's foot at (77, 70) */
        function toGate(rw) {
          const g = gateAt(); if (!g) return; const b = rw.getBoundingClientRect(), k = rw.offsetWidth / (b.width || 1), gx = g.x(77), gy = g.y(70);
          rw.style.setProperty('--gx', ((gx - b.left - b.width / 2) * k).toFixed(1) + 'px'); rw.style.setProperty('--gy', ((gy - b.bottom) * k).toFixed(1) + 'px');
        }
        /** wrong: the emir folds his arms and turns his face away; horse and rider hang their heads and ride back out, and
            the gate stays shut */
        function refuse(rw) {
          emir.classList.add('cross'); rw.classList.add('sad'); later(run, 450, groan);
          later(run, 1600, () => { rw.classList.add('turn', 'gallop', 'back'); hooves(1.2, true); });
        }
        /** a line not recorded yet is skipped, or its stand-in said instead */
        const sayIf = (k, alt = null) => io.has && !io.has(k) ? (alt ? say(alt, run) : Promise.resolve(!run.dead)) : say(k, run);
        /*
         * The example teaches the game before it starts, with no score and no clock, and nobody says a letter in it. One
         * line says it all (Sani 2026-10-25): a horseman reins in with a blank white flag, the pointing hand on it while
         * Laila says what to do; then, without words, he is greeted, the gate opens and he rides into the palace. Only the
         * happy outcome is shown (Sani 2026-10-26: no wrong-answer demo). Then she asks the child to press her, and only
         * that press starts the game and its clock.
         */
        function example() {
          const rw = arrive('', looks[looks.length - 1]);
          later(run, 1500, () => { rw.classList.remove('gallop'); rw.classList.add('listen'); box.busy = true;
            const hand = h('<span class="dhand">👇🏾</span>'); rw.appendChild(hand);   // the app's pointing hand (as the lessons' Spotter draws it), on the flag
            sayIf('s_g_durbar_eg1').then(() => { hand.remove(); if (run.dead) return;
              rw.classList.remove('listen'); greet(rw); later(run, 4300, () => { if (!run.dead) ready(); });
            });
          });
        }
        /** "press Laila to start": said again 10 s later if she is not pressed, then every 20 s until she is (Sani 2026-10-26);
            the press, or leaving the screen (run.stop clears run.later), ends it */
        function ready() {
          lane.innerHTML = ''; emir.classList.remove('cross'); let nag = null;
          const ask = () => sayIf('s_g_durbar_ready', 'app_w_tap_white');
          const again = (ms) => { nag = later(run, ms, () => { if (run.dead || !lbtn.onclick) return; ask().then(() => { if (!run.dead && lbtn.onclick) again(20000); }); }); };
          ask().then(() => { if (run.dead) return;
            box.busy = false; lbtn.classList.add('cue');
            lbtn.onclick = () => { if (run.dead) return; lbtn.onclick = null; clearTimeout(nag); lbtn.classList.remove('cue'); io.hush();
              run.clock(Math.max(150, 20 + N * 9), () => done({ right: run.right, part: run.right / N, missed: L8.slice(i).concat(missed) }));
              next(); };
            again(10000);
          });
        }
        /*
         * Each letter: the horseman reins in, his flag glows and the microphone opens by itself (Sani 2026-10-24: pressing
         * Laila to speak "is not how it works"), listening for up to 6 s. The right letter ends it at once; two wrong
         * letters end it early as a miss; 6 s without the letter is a miss too. One answer, no hints: the letter is never
         * shown or said. AUTO = false would make the child press Laila for each horseman instead.
         */
        const AUTO = true;
        function next() {
          const L = L8[i], rw = arrive(L, looks[i % looks.length]);
          later(run, 1500, () => { rw.classList.remove('gallop'); rw.classList.add('listen'); row.children[i].classList.add('now');
            box.listen(() => ({ target: L, until: L, maxWrong: 2, limit: 6000 }), (r) => {
              box.busy = true; rw.classList.remove('listen');
              if (r.value === L) {
                box.yay(); run.good(rw); say(K.L[L], run); row.children[i].classList.remove('now'); row.children[i].classList.add('on'); row.children[i].textContent = L;
                greet(rw); later(run, 4300, step); return;
              }
              run.bad(); box.nope(); missed.push(L); row.children[i].classList.remove('now'); row.children[i].classList.add('miss');
              refuse(rw); later(run, 3200, step);
            }, () => L);
            if (AUTO) { box.busy = false; box.go(); } else box.cue();
          });
        }
        function step() { i++; if (i >= N) done({ right: run.right, finished: true, missed }); else next(); }
        example();
      } },

    /* ---------------- Abubuwa: the auctioneer ---------------- */
    'j-dillali': { title: 'Dillalin kasuwa', cls: 'dillali', scene: 'kurmi',
      placeNo: 'Abubuwa would start at Dabbobi, with the lessons.',
      place: (r) => r.right >= 6 ? 'Named everything the dillali held up: those groups would be skipped.' : 'Named ' + r.right + ' of 6: the groups with misses would be taught.',
      /* Dillalin kasuwa (Sani 2026-10-25): the dillali holds up the real photo, and a shopper walks up to look at it.
         Named right: the photo turns into its drawing with a burst of coins and their clink, and the shopper takes it
         the way people do (an animal led off on a rope, the mat prayed on, a pot on the head, a cap put on…) while the
         crowd claps. Wrong: a red cross on the photo, the shopper's low "a'a", and they walk off without buying; the
         photo goes back and its name is never said. Behind the stall the market carries on: wheelbarrows, a woman with
         a basin of oranges, people stopping at the stalls to look and moving on. */
      play(run, done) {
        const G = [['ram', 'goat', 'chicken', 'camel', 'donkey'], ['millet', 'groundnut', 'mango', 'bread', 'onion'], ['calabash', 'pot', 'mat', 'kettle', 'broom'], ['kaftan', 'cap', 'turban', 'shoe', 'umbrella']];
        const items = shuffle(G.map((g) => shuffle(g)[0]).concat(shuffle(G.flat()).slice(0, 4))).filter((w, k, a) => a.indexOf(w) === k).slice(0, 6), among = G.flat();
        let r = 0, sold = 0;
        const st = h('<div class="dstage mk">' + marketLife() + '<div class="dillw">' + A.dillali() + '</div><div class="stall"><div class="goods"></div><div class="mkdrawn"></div><div class="dealw"></div><div class="mkfx"></div></div><div class="crowd">' + A.crowd(4) + '</div></div>');
        const tally = h('<div class="tally"><span class="coin s">Z</span> <b>0</b> / 6</div>');
        const box = micBox(run);
        run.scr.appendChild(st); run.scr.appendChild(tally); run.scr.appendChild(box);
        run.clock(170, () => done({ right: sold, part: sold / 6 }));
        run.remind = () => say(line('j-dillali', 'how'), run);
        const goods = st.querySelector('.goods'), drawn = st.querySelector('.mkdrawn'), dealw = st.querySelector('.dealw'), fx = st.querySelector('.mkfx'), crowdEl = st.querySelector('.crowd');
        function next() {
          const w = items[r]; st.classList.remove('sad'); fx.innerHTML = ''; drawn.className = 'mkdrawn'; drawn.innerHTML = '';
          goods.className = 'goods'; goods.innerHTML = photoCard(K.pic[w]); void goods.offsetWidth; goods.classList.add('up');
          dealw.innerHTML = inspector(r); const look = dealw.firstElementChild;
          speakRound(run, box, w, among, () => {
            sold++; run.good(goods); tally.querySelector('b').textContent = sold; bump(tally, 'pop', 600);
            // the photo turns over into its drawing, coins leap and clink
            goods.classList.add('turn'); fx.innerHTML = coinBurst(); later(run, 250, coinClink);
            later(run, 260, () => { drawn.innerHTML = GOODS[w].svg(); drawn.classList.add('pop'); });
            // then the shopper takes it away
            later(run, 1100, () => { drawn.classList.add('taken'); dealw.innerHTML = deal(w, r); bump(crowdEl, 'clapping', 1600);
              later(run, 60, () => dealw.firstElementChild && dealw.firstElementChild.classList.add('run')); });
            step(1100 + (ACT_MS[GOODS[w].act] || 3000));
          }, () => {
            goods.classList.add('wrong'); st.classList.add('sad'); bump(crowdEl, 'grumble', 1400); later(run, 450, aaNo);
            later(run, 700, () => look && look.classList.add('away'));
            later(run, 1300, () => goods.classList.add('back')); step(2900);
          });
        }
        function step(ms) { later(run, ms, () => { r++; if (r >= 6) done({ right: sold, finished: true, part: sold / 6 }); else next(); }); }
        next();
      } },

    /* ---------------- Nemo hoto: the tea seller ---------------- */
    /* Mai shayi by the roadside (Sani 2026-10-23, served 2026-10-26): one picture at a time, big, with Laila in the
       middle under it as in the lessons. Each order comes from someone, never the same person twice running: a bubble
       over their head shows what they want, and a bar under the picture runs down for as long as they will wait (it
       stops while Laila listens). Named right: two taps of the spoon, the picture becomes the thing as it is served (the
       egg fried on a plate, the sugar dropping into a cup of tea, the milk poured in…) and it goes to that person: the
       man at the stand takes it from the seller, and for the bench the seller's helper carries it over on his tray
       (Sani 2026-10-26) and walks back, while the seller keeps pulling tea and cooking. Wrong, or the bar runs out: the seller and his customers frown, the picture drops away, the next order comes. */
    'j-shayi': { title: 'Mai shayi', cls: 'shayi', scene: 'teanight',
      placeNo: 'Nemo hoto would start from the four-picture rounds.',
      place: (r) => r.right >= 7 ? 'Ordered everything by name: food and drink words are known.' : 'Ordered ' + r.right + ' of 7: Nemo hoto would start from the four-picture rounds.',
      play(run, done) {
        const MENU = ['tea', 'bread', 'egg', 'sugar', 'milk', 'cup', 'spoon', 'kettle', 'water'], ORDER = shuffle(MENU).slice(0, 7), WAIT = 15000; let r = 0, got = 0, last = -1;
        const st = h('<div class="tstage">' + roadBehind() + '<div class="tsw">' + teaStall() + '</div><div class="ubw">' + umbrellaBench() + '</div>' +
          '<div class="tcard"></div><div class="twait"><i></i></div><div class="tbub"></div><div class="tserve"></div></div>');
        const box = micBox(run); run.scr.appendChild(st); run.scr.appendChild(box);
        run.clock(150, () => done({ right: got, part: got / 7 }));
        run.remind = () => say(line('j-shayi', 'how'), run);
        const card = st.querySelector('.tcard'), bar = st.querySelector('.twait'), fill = bar.firstElementChild, bub = st.querySelector('.tbub'), sv = st.querySelector('.tserve');
        function next() {
          const w = ORDER[r], who = shuffle([0, 1, 2, 3].filter((k) => k !== last))[0], c = CUSTOMERS[who]; last = who;
          let left = WAIT, over = false;
          st.classList.remove('sad', 'glad'); card.className = 'tcard'; card.innerHTML = photo(w); void card.offsetWidth; card.classList.add('in');
          sv.className = 'tserve'; sv.innerHTML = '';
          // the bubble shows the order drawn, as it will be served
          bub.className = 'tbub'; bub.innerHTML = served(w); bub.style.left = c.x + 'cqw'; bub.style.bottom = c.head + 'cqw'; void bub.offsetWidth; bub.classList.add('on');
          bar.className = 'twait on'; fill.style.transform = 'scaleX(1)';
          const end = () => { over = true; bar.classList.remove('on'); bub.classList.remove('on'); };
          const miss = () => { end(); cupTap(false); st.classList.add('sad'); card.classList.add('drop'); step(1900); };
          // the wait runs down only while nobody is speaking and nothing is being judged
          (function tick() { if (over || run.dead) return;
            if (!run.listening && !box.busy) { left -= 100; fill.style.transform = 'scaleX(' + Math.max(0, left / WAIT).toFixed(3) + ')'; bar.classList.toggle('low', left < WAIT * .34); }
            if (left <= 0) { box.busy = true; miss(); return; }
            later(run, 100, tick); })();
          speakRound(run, box, w, MENU, () => {
            end(); got++; run.good(card); say(K.en[w], run); cupTap(true); st.classList.add('glad');
            // the picture becomes the thing as it is served
            card.classList.add('turn'); sv.innerHTML = served(w);
            if (who === 0) {   // the man at the stand takes it from the seller's hand
              fly(c.x, c.hand); later(run, 1800, () => { sv.className = 'tserve'; hand(0, w); }); step(3000); return;
            }
            // the bench: it lands on the helper's tray, he walks it over, hands it on and walks back
            const T = tray.getBoundingClientRect(), R = st.getBoundingClientRect(), u = R.width / 100;
            fly((T.left + T.width / 2 - R.left) / u, (R.bottom - T.top - T.height / 2) / u);
            later(run, 1800, () => { sv.className = 'tserve'; tray.innerHTML = served(w); tray.classList.add('on');
              helper.classList.add('walk'); helper.style.transform = 'translateX(' + (c.x - 4.5 - 39).toFixed(1) + 'cqw)'; });
            later(run, 3450, () => { helper.classList.remove('walk'); tray.classList.remove('on'); hand(who, w); });
            later(run, 3800, () => { helper.classList.add('walk', 'back'); helper.style.transform = ''; });
            later(run, 5450, () => helper.classList.remove('walk', 'back'));
            step(4000);
          }, () => miss());
        }
        function step(ms) { later(run, ms, () => { r++; if (r >= ORDER.length) done({ right: got, finished: true, part: got / 7 }); else next(); }); }
        next();
      } },

          CUSTOMERS.map((c) => '<div class="tgot" style="left:' + c.x + 'cqw;bottom:' + c.hand + 'cqw"></div>').join('') +
          '<div class="twaiter">' + waiter() + '<div class="ttray"></div></div>' +
    /* ---------------- Lambobi: the groundnut pyramids (tap) ---------------- */
    'j-gyada': { title: 'Dalar gyaɗa', cls: 'gyada', scene: 'pyramids', tap: true,
      placeNo: 'Lambobi would start at 1 to 5, with the lessons.',
      place: (r) => r.right >= 8 ? 'Matched every number to its stack, to twenty: Lambobi would start at the tens.' : 'Matched ' + r.right + ' of 8: Lambobi would start ' + (r.reached > 10 ? 'at 11 to 20.' : 'at 1 to 10.'),
      /* Laila says a number; the child taps the pile of groundnut sacks that has that many. Right: the sacks are loaded
        const helper = st.querySelector('.twaiter'), tray = st.querySelector('.ttray'), gots = st.querySelectorAll('.tgot');
        /** the served thing flies from the picture to a point on the stage (cqw from the left, cqw from the bottom) */
        function fly(x, y) {
          const R = st.getBoundingClientRect(), S = sv.getBoundingClientRect(), u = R.width / 100;   // in the stage's own units
          sv.style.setProperty('--dx', ((R.left + x * u - (S.left + S.width / 2)) / u).toFixed(2) + 'cqw'); sv.style.setProperty('--dy', ((R.bottom - y * u - (S.top + S.height / 2)) / u).toFixed(2) + 'cqw');
          void sv.offsetWidth; sv.classList.add('show'); later(run, 700, () => sv.classList.add('fly'));
        }
        function hand(who, w) { const g = gots[who]; g.className = 'tgot'; g.innerHTML = served(w); void g.offsetWidth; g.classList.add('on'); }
         onto the back of the lorry one by one, the horn sounds and it speeds off in a cloud of dust. Wrong: the lorry
         drives off empty and the next one comes (Sani 2026-10-22). */
      play(run, done) {
        const N = shuffle([2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 4).concat(shuffle([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]).slice(0, 4)); let r = 0, got = 0, reached = 0, busy = false;
        const top = h('<div class="gtop"><button type="button" class="hearn">🔊</button><div class="lorryw">' + A.lorry() + '</div><span class="tally"><b>0</b> / 8 🚚</span></div>');
        const row = h('<div class="stacks2"></div>');
        run.scr.appendChild(top); run.scr.appendChild(row);
        run.clock(150, () => done({ right: got, part: got / 8, reached }));
        const sayN = () => say(K.en['n' + N[r]], run);
        run.remind = sayN; top.querySelector('.hearn').onclick = sayN;
        const lw = top.querySelector('.lorryw');
        function newLorry() {   // an empty lorry pulls in from the left
          lw.classList.remove('away', 'zoom', 'slow'); lw.classList.add('reset'); lw.querySelector('.load').innerHTML = ''; void lw.offsetWidth;
          lw.classList.remove('reset'); lw.classList.add('arrive'); later(run, 1300, () => lw.classList.remove('arrive'));
        }
        function after(ms) { later(run, ms, () => { r++; if (r >= 8) { done({ right: got, finished: true, part: got / 8, reached }); return; } newLorry(); later(run, 900, next); }); }
        function next() {
          busy = false;
          // up to ten: four piles; the teens: three bigger piles, so every sack stays big enough to count
          const n = N[r], cap = n <= 10 ? 10 : 20, k = n <= 10 ? 3 : 2;
          const opts = shuffle([n].concat(shuffle([-3, -2, -1, 1, 2, 3].map((d) => n + d).filter((x) => x >= 1 && x <= cap)).slice(0, k)));
          row.innerHTML = ''; row.classList.toggle('big', cap === 20);
          opts.forEach((m) => { const b = h('<button type="button" class="stk" aria-label="' + m + ' sacks">' + A.sacks(m, cap) + '</button>'); row.appendChild(b);
            b.onclick = () => { if (run.dead || busy) return; busy = true;
              if (m !== n) {
                // wrong: the right pile glows for a moment, and the lorry leaves empty
                run.bad(b); react(run, 'sad'); horn(false); later(run, 900, () => lw.classList.add('away', 'slow')); after(2600); return;
              }
              got++; reached = Math.max(reached, n); run.good(b); react(run, 'cheer'); top.querySelector('.tally b').textContent = got;
              // the pile empties into the back of the lorry: the sacks drop in one after another
              const br = io.rect(b), lr = io.rect(lw);
              b.style.setProperty('--tx', (lr.left + lr.width * .35 - (br.left + br.width / 2)) + 'px'); b.style.setProperty('--ty', (lr.top + lr.height * .3 - (br.top + br.height / 2)) + 'px');
              b.classList.add('fly'); row.querySelectorAll('.stk').forEach((o) => { if (o !== b) o.classList.add('fade'); });
              later(run, 500, () => { lw.querySelector('.load').innerHTML = A.lorryLoad(n); });
              const loaded = 500 + n * 90 + 400;
              later(run, loaded, () => { bump(lw, 'thump', 500); horn(true); });
              later(run, loaded + 500, () => lw.classList.add('away', 'zoom'));   // off it speeds, in approval
              after(loaded + 1700);
            }; });
          later(run, 300, sayN);
        }
        /* the lorry's horn: two bright toots when it is loaded, one low one when it leaves empty */
        let hac = null;
        function horn(happy) {
          try { hac = hac || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
          const notes = happy ? [[440, 0], [554, .18]] : [[220, 0]];
          notes.forEach(([f, t0]) => { const t = hac.currentTime + t0, o = hac.createOscillator(), g = hac.createGain();
            o.type = 'square'; o.frequency.setValueAtTime(f, t); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.12, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + (happy ? .16 : .4));
            o.connect(g).connect(hac.destination); o.start(t); o.stop(t + .45); });
        }
        next();
      } },

    /* ---------------- Lambobi: the livestock market (tap) ---------------- */
    /* Kasuwar dabbobi (Sani 2026-10-23, renamed and remade 2026-10-26: "goats and rams not cow only so a mix ... very
       real"; "only livestock, no fowls"). Four animals of four kinds stand at their posts, each with its price on a little
       blackboard: a zebu cow (White Fulani or Red Bororo), a Sokoto Red goat, a white Sahel goat, a Balami or an Uda ram
       (sc-shanu.ts draws them); they breathe, flick their tails and ears. Hear a price and touch the animal that costs it.
       Right: a buyer comes and leads it off on a rope, it calls (bleat, moo), the cowbell or the coins. Wrong: it shakes
       its head, complains and turns away, the board gets a red cross, and the next price comes (one touch, no second go). */
    'j-shanu': { title: 'Kasuwar dabbobi', cls: 'shanu', scene: 'cattle', tap: true,
      placeNo: 'Lambobi would start at the tens, with the lessons.',
      place: (r) => r.right >= 8 ? 'Knew every price by ear, to a thousand: the tens and hundreds would be skipped.' : 'Knew ' + r.right + ' of 8 prices: Lambobi would start ' + (r.hundreds < 2 ? 'at the tens.' : 'at the hundreds.'),
      play(run, done) {
        const TENS = [20, 30, 40, 50, 60, 70, 80, 90], HUN = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
        const P = shuffle(TENS).slice(0, 3).concat(shuffle(HUN).slice(0, 5)); let r = 0, got = 0, hundreds = 0, busy = false, v = 0;
        const top = h('<div class="gtop"><button type="button" class="hearn">🔊</button><span class="tally"><span class="coin s">Z</span> <b>0</b> / 8</span></div>');
        const yard = h('<div class="yard"><div class="pen4"></div><span class="eg e1">' + egret() + '</span><span class="eg e2">' + egret() + '</span><span class="eg e3">' + egret() + '</span><div class="buyer2">' + herdsman() + '</div></div>');
        const pen = yard.querySelector('.pen4'), buyer = yard.querySelector('.buyer2');
        run.scr.appendChild(yard); run.scr.appendChild(top);
        run.clock(150, () => done({ right: got, part: got / 8, hundreds }));
        const sayP = () => say(K.en['n' + P[r]], run);
        run.remind = sayP; top.querySelector('.hearn').onclick = sayP;
        function next() {
          busy = false; yard.classList.remove('sad');
          const p = P[r], pool = p >= 100 ? HUN : TENS, opts = shuffle([p].concat(shuffle(pool.filter((x) => x !== p)).slice(0, 3)));
          pen.innerHTML = '';
          // four kinds every round, never four of one: one cow (the two breeds take turns), two goats, the rams
          const kinds = shuffle([v++ % 2 ? 'cr' : 'cw', 'gr', 'gw', 'rb', 'ru']).slice(0, 4);
          opts.forEach((m, k) => {
            const b = h('<button type="button" class="beast2" aria-label="₦' + m + '" style="--gd:' + (-Math.random() * 6).toFixed(2) + 's;--gs:' + (5 + Math.random() * 3).toFixed(2) + 's;--i:' + k + '">' +
              priceBoard(m) + '<span class="post"></span>' + dabba(kinds[k]) + '</button>');
            pen.appendChild(b);
            b.onclick = () => { if (run.dead || busy) return; busy = true;
              if (m === p) {
                got++; if (p >= 100) hundreds++; run.good(b); react(run, 'cheer'); top.querySelector('.tally b').textContent = got; say(K.en['n' + p], run);
                b.classList.add('bought'); if (kinds[k][0] === 'c') cowbell(2); else coinClink();
                later(run, 1100, () => dabSound(kinds[k], true));
                later(run, 3000, step);
              } else {
                // one touch: the animal lows and turns away, its board is crossed out, the market frowns, and on we go
                run.bad(); react(run, 'sad'); dabSound(kinds[k], false); b.classList.add('no'); yard.classList.add('sad');
                later(run, 2200, step);
              } };
          });
          later(run, 300, sayP);
        }
        function step() { r++; if (r >= 8) done({ right: got, finished: true, part: got / 8, hundreds }); else next(); }
        next();
      } },

    /* ---------------- Lambobi: counting the herd (speaking) ---------------- */
    /* Ƙirgen shanu (Sani 2026-10-22): White Fulani and Red Bororo cattle graze on the open grass and drift slowly
       forward; the herdsman walks behind them with his staff upright. Say the number and the front cow ambles into the
       pen to its cowbell; a wrong count and she lifts her head, shakes it and lows, and the herdsman shakes his head. */
    'j-garke': { title: 'Ƙirgen shanu', cls: 'garke', scene: 'camp',
      placeNo: 'Lambobi would start at 1 to 5, with the lessons.',
      place: (r) => r.finished ? 'Counted the herd to ten and the big herd in tens to fifty: Lambobi would start at the hundreds.' : 'Counted to <b>' + r.reached + '</b>: Lambobi would start ' + (r.reached < 5 ? 'at 1 to 5.' : r.reached <= 10 ? 'at 6 to 10.' : 'at the tens.'),
      play(run, done) {
        const STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50], WORD = (n) => K.enText['n' + n].toLowerCase(), AMONG = STEPS.map(WORD).concat(['eleven', 'twelve', 'sixty', 'hundred']);
        let s = 0, reached = 0, wrong = 0, v = 0;
        const grass = [[4, 2, 0], [16, 6, 1], [27, 1, 2], [36, 5, 0], [47, 2, 1], [56, 7, 2], [9, 9, 1], [31, 9, 2]].map(([x, y, k]) => '<i class="tf" style="left:' + x + 'cqw;bottom:' + y + 'cqw">' + tuft(k) + '</i>').join('');
        const st = h('<div class="gstage herd"><div class="field">' + grass + '</div><div class="queue"></div><div class="hman">' + herdsman() + '</div><div class="pen3">' + A.zariba() + '<div class="inpen"></div><b class="cnt2">0</b></div></div>');
        const box = micBox(run); run.scr.appendChild(st); run.scr.appendChild(box);
        run.clock(150, () => done({ right: s, part: s / STEPS.length, reached }));
        run.remind = () => say(line('j-garke', 'how'), run);
        const queue = st.querySelector('.queue'), inpen = st.querySelector('.inpen'), cnt = st.querySelector('.cnt2'), hman = st.querySelector('.hman');
        // each cow grazes on its own clock, so the herd never nods in step
        const cow = (ten) => '<span class="qcow' + (ten ? ' ten' : '') + '" style="--gd:' + (-Math.random() * 6).toFixed(2) + 's;--gs:' + (5 + Math.random() * 3).toFixed(2) + 's">' + zebu(v++) + (ten ? '<b>×10</b>' : '') + '</span>';
        function fill() { queue.innerHTML = ''; for (let k = 0; k < 3; k++) queue.insertAdjacentHTML('beforeend', cow(s >= 10)); }
        function next() {
          if (s === 10) { inpen.innerHTML = ''; cnt.textContent = '0'; }
          if (s === 0 || s === 10) fill();
          const n = STEPS[s], w = WORD(n); wrong = 0;
          box.cue();
          box.listen(() => ({ target: w, among: AMONG, match: (raw) => io.match(raw, w, AMONG) }), (r) => {
            if (r.value === null && !r.raw) { box.cue(); return; }
            if (r.value === w) { box.busy = true; box.yay(); reached = n; walkIn(n); return; }
            wrong++; run.bad(); box.nope(); moo();
            const c = queue.firstChild; c.classList.add('no'); st.classList.add('cross'); later(run, 1400, () => { st.classList.remove('cross'); c.classList.remove('no'); });
            if (wrong >= 1) { box.busy = true; later(run, 1500, () => { done({ right: s, part: s / STEPS.length, reached }); }); }
            else box.cue();
          }, () => w);
        }
        // the front cow ambles into the pen (slowly, legs stepping), the herdsman walks a few steps after her
        function walkIn(n) {
          const c = queue.firstChild; run.good(c); c.classList.add('zgo'); hman.classList.add('step'); cowbell(3);
          later(run, 2900, () => { c.remove(); hman.classList.remove('step');
            inpen.insertAdjacentHTML('beforeend', '<span class="pc" style="--gd:' + (-Math.random() * 6).toFixed(2) + 's">' + zebu(v++) + '</span>'); cnt.textContent = n; bump(cnt, 'pop');
            queue.insertAdjacentHTML('beforeend', cow(s + 1 >= 10));
            s++; if (s >= STEPS.length) done({ right: s, finished: true, part: 1, reached }); else next(); });
        }
        next();
      } },

    /* ---------------- Lambobi: the suya seller (speaking) ---------------- */
    'j-suya': { title: 'Mai suya', cls: 'suyag', scene: 'suyanight',
      placeNo: 'Lambobi would start at the tens, with the lessons.',
      place: (r) => r.right >= 6 ? 'Paid with every note by name, to a thousand: Lambobi would skip the hundreds.' : 'Named ' + r.right + ' of 6 notes: Lambobi would start at the tens.',
      play(run, done) {
        const NOTES = shuffle([20, 50, 100, 200, 500, 1000]), AMONG = NOTES.map((n) => K.enText['n' + n].toLowerCase()).concat(['ten', 'five', 'two', 'one']); let r = 0, got = 0;
        const st = h('<div class="sgstage"><div class="grillw">' + A.suya() + '</div></div>');
        const hand = h('<div class="handn"></div>'), wraps = h('<div class="wraps">' + NOTES.map(() => '<i></i>').join('') + '</div>');
        const box = micBox(run);
        run.scr.appendChild(st); run.scr.appendChild(hand); run.scr.appendChild(wraps); run.scr.appendChild(box);
        run.clock(150, () => done({ right: got, part: got / 6 }));
        run.remind = () => say(line('j-suya', 'how'), run);
        function next() {
          const n = NOTES[r], w = K.enText['n' + n].toLowerCase(); hand.innerHTML = A.note(n); hand.classList.remove('paid'); void hand.offsetWidth; hand.classList.add('in');
          autoRound(run, box, w, AMONG, () => {
            got++; run.good(hand); sayW(run, K.en['n' + n]); hand.classList.add('paid'); wraps.children[r].classList.add('on'); later(run, 1700, step);
          }, () => { wraps.children[r].classList.add('miss'); st.classList.add('cross'); later(run, 1500, () => { st.classList.remove('cross'); hand.classList.add('paid'); }); later(run, 1900, step); });
        }
        function step() { r++; if (r >= 6) done({ right: got, finished: true, part: got / 6 }); else next(); }
        next();
      } },

    /* ---------------- Karatu: the allo ---------------- */
    'j-allo': { title: 'Allo', cls: 'allog', scene: 'islamiyya',
      placeNo: 'Karatu would start at short words, with the lessons.',
      place: (r) => r.longest >= 5 ? 'Read aloud up to ' + r.longest + '-letter words: Karatu would start at long words.' : 'Read aloud up to ' + (r.longest || 0) + '-letter words: Karatu would start at short words.',
      play(run, done) {
        const W = shuffle(['cat', 'sun', 'bus', 'dog', 'cup']).slice(0, 3).concat(shuffle(['goat', 'book', 'fish', 'milk']).slice(0, 2), shuffle(['bread', 'mango', 'water']).slice(0, 2));
        let r = 0, got = 0, longest = 0;
        const st = h('<div class="astage"><div class="allow2"></div></div>'); const box = micBox(run); run.scr.appendChild(st); run.scr.appendChild(box);
        const prog = h('<div class="seats">' + W.map(() => '<i></i>').join('') + '</div>'); run.scr.appendChild(prog);
        run.clock(150, () => done({ right: got, part: got / W.length, longest }));
        run.remind = () => say(line('j-allo', 'how'), run);
        const aw = st.querySelector('.allow2');
        function next() {
          const w = W[r]; alloWrite(aw, w.toUpperCase());
          autoRound(run, box, w, W, () => {
            got++; longest = Math.max(longest, w.length); run.good(aw); sayW(run, K.en[w]); prog.children[r].classList.add('on');
            alloWash(aw); later(run, 2350, step);
          }, () => { prog.children[r].classList.add('miss'); aw.classList.add('wrongw'); later(run, 1100, () => { aw.classList.remove('wrongw'); alloWash(aw); }); later(run, 3400, step); });
        }
        function step() { r++; if (r >= W.length) done({ right: got, finished: got === W.length, part: got / W.length, longest }); else next(); }
        next();
      } },

    /* ---------------- Karatu: the ferry ---------------- */
    /* Sani 2026-10-26: the word rides a local engine passenger boat (sc-jirgi.ts engineBoat), up on the water clear of Laila.
       Right: the horn toots, the next person on the jetty walks to the boat, climbs in and sits as it putts away. Wrong: a
       soft sad fall, the person frowns with tears and walks off home along the jetty; the boat leaves empty. */
    'j-jirgi': { title: 'Jirgin ruwa', cls: 'jirgi', scene: 'crossing',
      placeNo: 'Karatu would start at short words, with the lessons.',
      place: (r) => r.right >= 5 ? 'Read every boat aloud and filled it: the ferry and the board agree.' : 'Read ' + r.right + ' of 5 boats: Karatu would start at short words.',
      play(run, done) {
        const W = shuffle(['cup', 'bed', 'pen', 'cow', 'egg', 'key', 'hat', 'map'].filter((w) => K.en[w])).slice(0, 5); let r = 0, got = 0;
        const st = h('<div class="fstage"><div class="bank3">' + W.map((_, k) => '<span class="pq">' + JR.waiter(k) + '</span>').join('') + '</div><div class="ferry"></div></div>');
        const box = micBox(run); run.scr.appendChild(st); run.scr.appendChild(box);
        run.clock(150, () => done({ right: got, part: got / 5 }));
        run.remind = () => say(line('j-jirgi', 'how'), run);
        const ferry = st.querySelector('.ferry'), bank = st.querySelector('.bank3');
        const who = () => bank.children[W.length - 1 - r];   // the one nearest the boat goes first
        /* where the walker must go, in the jetty's own (scaled) px: to the jetty's end, then up into the boat's seat */
        function aim(p) {
          const op = ferry.offsetParent || st, S = op.getBoundingClientRect(), k = S.width / op.offsetWidth || 1, B = bank.getBoundingClientRect(), kb = (B.width / bank.offsetWidth || 1);
          const P = p.getBoundingClientRect(), fx = P.left + P.width / 2, fy = P.bottom;
          const bx = S.left + (ferry.offsetLeft + ferry.offsetWidth * 104 / 420) * k, by = S.top + (ferry.offsetTop + ferry.offsetHeight * 70 / 165) * k;   // the plank's top on the gunwale
          p.style.setProperty('--x1', ((B.right - fx) / kb - P.width / kb / 2) + 'px');
          p.style.setProperty('--x2', ((bx - fx) / kb) + 'px'); p.style.setProperty('--y2', ((by - fy) / kb) + 'px');
        }
        function next() {
          const w = W[r]; ferry.innerHTML = JR.engineBoat(w.toUpperCase(), W.length - 1 - r); ferry.className = 'ferry'; void ferry.offsetWidth; ferry.classList.add('drift');
          JR.puttPutt(2.2); later(run, 2300, () => ferry.classList.add('moor'));
          autoRound(run, box, w, W, () => {
            got++; run.good(ferry); sayW(run, K.en[w]);
            const p = who(); aim(p); ferry.classList.add('plank'); p.classList.add('aboard');
            later(run, 1900, () => { p.classList.add('in'); ferry.classList.add('boarded'); });
            later(run, 2300, () => ferry.classList.remove('plank'));
            later(run, 2300, () => JR.toot());
            later(run, 3000, () => { ferry.classList.remove('moor'); ferry.classList.add('leave'); JR.puttPutt(2.4); });
            later(run, 4800, step);
          }, () => {
            JR.sadTones(); const p = who(); p.classList.add('x-sad');
            p.style.setProperty('--x3', -(p.getBoundingClientRect().right + 60) / ((bank.getBoundingClientRect().width / bank.offsetWidth) || 1) + 'px');
            later(run, 900, () => p.classList.add('home'));
            later(run, 1300, () => { ferry.classList.remove('moor'); ferry.classList.add('leave'); JR.puttPutt(2.4); });
            later(run, 3900, step);
          });
        }
        function step() { r++; if (r >= 5) done({ right: got, finished: true, part: got / 5 }); else next(); }
        next();
      } },

    /* ---------------- Rubutu: the letter writer ---------------- */
    /* Marubucin wasiƙa (Sani 2026-10-23): spell the name on the envelope by saying the letters to Laila OR by typing them
       on the A–Z keys (or a real keyboard). Each right letter is written in ink; a wrong one blots the letter and the
       next one comes (one go). A finished letter is sealed, stamped and taken off by the post rider. */
    'j-marubuci': { title: 'Marubucin wasiƙa', cls: 'marubg', scene: 'postoffice',
      placeNo: 'Rubutu would start at three letters, with the lessons.',
      place: (r) => r.right >= 4 ? 'Spelled every name: with Ginin bulo agreeing, Rubutu moves on.' : 'Spelled ' + r.right + ' of 4: Rubutu would start at three letters.',
      play(run, done) {
        const W = shuffle(['mama', 'baba', 'aunt', 'uncle'].filter((w) => K.en[w] && K.pic[w])); let wi = 0, li = 0, words = 0;
        const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const st = h('<div class="mstage"><div class="marw">' + A.marubuci() + '</div><div class="env">' + envelopeArt() + '</div><div class="achw">' + postRider() + '</div></div>');
        const snd = wasikaSound(run), fin = (r) => { snd.close(); done(r); };
        const key = (L) => '<button type="button" class="mk" data-l="' + L + '">' + L + '</button>';   // A–M on the left, N–Z on the right, Laila between them
        const kb = h('<div class="mkb"><div class="mkh">' + ABC.slice(0, 13).map(key).join('') + '</div><div class="mkh">' + ABC.slice(13).map(key).join('') + '</div></div>');
        const box = micBox(run); run.scr.appendChild(st); run.scr.appendChild(kb); run.scr.appendChild(box);
        run.clock(150, () => done({ right: words, part: words / W.length }));
        run.remind = () => say(K.en[W[wi]], run);
        const env = st.querySelector('.env'), hand = env.querySelector('.hand2'), ach = st.querySelector('.achw');
        function word() {
          const w = W[wi].toUpperCase(); li = 0; env.querySelector('img').src = K.pic[W[wi]]; env.className = 'env'; ach.className = 'achw'; kb.classList.remove('locked');
          hand.innerHTML = w.split('').map(() => '<span></span>').join(''); box.cue();
          later(run, 300, () => { sayW(run, K.en[W[wi]]); if (run.auto) autoGo(run, box); });   // after a spoken word, Laila listens by herself
        }
        function nextWord(ms) { later(run, ms, () => { wi++; if (wi >= W.length) done({ right: words, finished: true, part: words / W.length }); else word(); }); }
        // the same for a spoken run of letters and for a key: right letters are inked in order, the first wrong one ends the word
        function take(letters, key) {
          const w = W[wi].toUpperCase();
          for (let k = 0; k < letters.length && li < w.length; k++) {
            const L = String(letters[k]).toUpperCase();
            if (L === w[li]) { const s = hand.children[li]; s.innerHTML = inkLetter(L); s.classList.add('on'); snd.pen(); bump(st.querySelector('.marw'), 'writing', 400); if (key) bump(key, 'good', 500); li++; }
            else { run.bad(env); if (key) bump(key, 'bad', 700); hand.children[li].innerHTML = splat(); snd.blot(); li = -1; break; }   // the ink blots where the letter should go
          }
          if (li < 0) { box.busy = true; kb.classList.add('locked'); env.classList.add('blot'); react(run, 'sad'); nextWord(1800); return; }
          if (li >= w.length) { box.busy = true; kb.classList.add('locked'); words++; run.good(env); react(run, 'cheer'); env.classList.add('sealed');
            // the flap folds shut, the postmark comes down (thud), the counter bell, and the rider takes it off (putter)
            later(run, 420, () => { env.classList.add('stamped'); snd.thud(); }); later(run, 760, () => snd.bell());
            later(run, 1150, () => { env.classList.add('post'); ach.classList.add('ride'); }); later(run, 1950, () => snd.putter()); nextWord(3700); }
          else if (run.auto && !key) autoGo(run, box); else box.cue();
        }
        // a press (or her own listening) turns auto listening on; typing a key turns it off, and a key may be typed while
        // she listens: what she hears for a letter already typed past is dropped (stamp)
        let quiet = 0, stamp = '';
        box.listen(() => { const w = W[wi].toUpperCase(); run.auto = true; stamp = wi + ':' + li; return { multi: true, word: W[wi], target: w[li] }; }, (r) => {
          if (stamp !== wi + ':' + li || box.busy) return;
          const got = r.value || [];
          if (!got.length) { if (run.auto && ++quiet < 2) { box.busy = false; box.go(); return; } quiet = 0; run.auto = false; box.cue(); return; }
          quiet = 0; take(got);
        }, () => W[wi].toUpperCase().slice(li).split(''));
        const ready = () => !run.dead && !box.busy;
        const typed = (L, b) => { run.auto = false; take([L], b); };
        kb.addEventListener('click', (e) => { const b = e.target.closest('.mk'); if (b && ready()) typed(b.dataset.l, b); });
        const onKey = (e) => { if (run.dead) { document.removeEventListener('keydown', onKey); return; }
          const L = (e.key || '').toUpperCase(); if (L.length === 1 && L >= 'A' && L <= 'Z' && ready()) { e.preventDefault(); typed(L, kb.querySelector('[data-l="' + L + '"]')); } };
        document.addEventListener('keydown', onKey);
        word();
      } },
  };
}
