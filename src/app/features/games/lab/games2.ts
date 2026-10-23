// @ts-nocheck
/*
 * The Arewa games (Sani 2026-10-16): two speaking games for every lesson, and Lambobi's games done again. Each is
 * drawn with the shaded, animated SVG in art4.ts; the words a child must name are the lessons' own photos, framed
 * inside those drawings. Same rules as the other games: one fixed box, transform and opacity only, Laila is the
 * microphone and the clock waits while she listens.
 */
import * as A from './art4';
import { GOODS, ACT_MS, deal } from './market';
import { durbarRider, emirThrone, sallahBand, dogari, maiFanka, lifidi, hooves, fanfare, groan, RIDER_COUNT } from './durbar';
import { zebu, tuft, herdsman, cowbell, moo, egret, priceBoard } from './herd';
import { teaStall, umbrellaBench, okada, cupTap } from './teastall';

export function moreGames(c: any): Record<string, any> {
  const { K, h, say, sfx, drum, shuffle, micBox, line, F, io } = c, opts = c.opts || {};
  const LET = 'ABCDEFGHIJKLMNOPRSTUVWYZ'.split('');   // no Q or X: the recogniser cannot hear them apart from K and S
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

  return {
    /* ---------------- Haruffa: Hawan Sallah, the Durbar ---------------- */
    'j-durbar': { title: 'Hawan Sallah', cls: 'durbar', scene: 'palace',
      placeNo: 'Haruffa would start at A, with the lessons.',
      place: (r) => r.missed.length ? 'Could not say <b>' + r.missed.join(', ') + '</b>: those letters are taught again.' : 'Every horseman greeted the emir: every letter said.',
      play(run, done) {
        // in a lesson: every letter learned so far, in alphabetical order or mixed up; on its own, eight from the whole alphabet
        const L8 = opts.letters ? (opts.order === 'mixed' ? shuffle(opts.letters) : opts.letters.slice()) : shuffle(LET).slice(0, 8), N = L8.length; let i = 0; const missed = [];
        // the emir at his gate with his court about him: a dogari each side, his attendant fanning him; the yan lifidi wait behind the band
        const st = h('<div class="dstage"><div class="lifw"><span>' + lifidi(0) + '</span><span>' + lifidi(1) + '</span><span>' + lifidi(2) + '</span></div>' +
          '<div class="sallahw">' + sallahBand() + '</div>' +
          '<div class="courtw"><span class="cw dg l">' + dogari(0) + '</span><div class="emirw">' + emirThrone() + '</div><span class="cw fk">' + maiFanka() + '</span><span class="cw dg r">' + dogari(1) + '</span></div>' +
          '<div class="rlane"></div></div>');
        const looks = shuffle(Array.from({ length: RIDER_COUNT }, (_, k) => k));   // a different horseman each time
        const row = h('<div class="lrow' + (N > 12 ? ' many' : '') + '">' + L8.map(() => '<span></span>').join('') + '</div>');
        const box = micBox(run);
        run.scr.appendChild(st); run.scr.appendChild(row); run.scr.appendChild(box);
        run.remind = () => say(line('j-durbar', 'how'), run);
        const lane = st.querySelector('.rlane'), emir = st.querySelector('.emirw'), court = st.querySelector('.courtw'), bandEl = st.querySelector('.sallahw');
        const lbtn = box.querySelector('.x-laila'); lbtn.classList.remove('cue');   // nothing to press here: the microphone opens by itself
        /** a horseman gallops in with his letter and reins in before the emir */
        function arrive(L, look) {
          lane.innerHTML = ''; const rw = h('<div class="rw">' + durbarRider(L, look) + '</div>'); lane.appendChild(rw); emir.classList.remove('cross', 'pleased'); court.classList.remove('pleased');
          rw.classList.add('gallop'); void rw.offsetWidth; rw.classList.add('in'); hooves(1.1); return rw;
        }
        /** right: the horse prances (the zormo), then kneels to greet the emir; rider and emir smile (Sani 2026-10-22).
            The band answers only once the letter has been said: kakaki, drums and the women's guda. */
        function greet(rw) {
          rw.classList.remove('listen'); rw.classList.add('zormo'); later(run, 900, () => { fanfare(); beat(run, 4); bandEl.classList.add('play'); }); later(run, 3200, () => bandEl.classList.remove('play'));
          later(run, 1300, () => { rw.classList.remove('zormo'); rw.classList.add('kneel'); emir.classList.add('pleased'); court.classList.add('pleased'); });
          later(run, 3000, () => { rw.classList.remove('kneel'); rw.classList.add('gallop', 'go'); hooves(1.2, true); });
        }
        /*
         * The example first (Sani 2026-10-23: "when you start you teach the person how to say it"): Laila says it is an
         * example, a horseman rides in with A, Laila listens and the sample child (boy or girl, as the player) says "A",
         * the horseman greets the emir; then "your turn". It is not scored and the clock has not started.
         */
        function example() {
          say('sx_intro', run).then(() => {
            if (run.dead) return; const rw = arrive('A', looks[looks.length - 1]);
            later(run, 1500, () => { rw.classList.remove('gallop'); rw.classList.add('listen'); box.busy = true; lbtn.classList.remove('cue'); lbtn.classList.add('rec'); box.classList.add('rec');
              later(run, 600, () => say('sx_w_A', run).then(() => { if (run.dead) return;
                lbtn.classList.remove('rec'); box.classList.remove('rec'); box.yay(); greet(rw);
                later(run, 4300, () => say('sx_now', run).then(() => { if (run.dead) return; box.busy = false; lane.innerHTML = '';
                  run.clock(Math.max(150, 20 + N * 9), () => done({ right: run.right, part: run.right / N, missed: L8.slice(i).concat(missed) }));
                  next(); }));
              }));
            });
          });
        }
        /*
         * Each letter after the example (Sani 2026-10-23): no press. The horseman reins in, the microphone opens by itself
         * and listens for 6 s while his banner keeps flying. The right letter ends it at once; two wrong letters end it
         * early as a miss; 6 s without the letter is a miss too. One answer, no hints: the letter is never shown or said.
         */
        function next() {
          const L = L8[i], rw = arrive(L, looks[i % looks.length]);
          later(run, 1500, () => { rw.classList.remove('gallop'); rw.classList.add('listen'); row.children[i].classList.add('now');
            box.listen(() => ({ target: L, until: L, maxWrong: 2, limit: 6000 }), (r) => {
              box.busy = true; rw.classList.remove('listen');
              if (r.value === L) {
                box.yay(); run.good(rw); say(K.L[L], run); row.children[i].classList.remove('now'); row.children[i].classList.add('on'); row.children[i].textContent = L;
                greet(rw); later(run, 4300, step); return;
              }
              // wrong: the emir folds his arms and turns his face away; horse and rider hang their heads and ride out
              run.bad(); box.nope(); missed.push(L); row.children[i].classList.remove('now'); row.children[i].classList.add('miss');
              emir.classList.add('cross'); rw.classList.add('sad'); later(run, 450, groan);
              later(run, 1600, () => { rw.classList.add('turn', 'gallop', 'back'); hooves(1.2, true); }); later(run, 3200, step);
            }, () => L);
            box.busy = false; box.go();
          });
        }
        function step() { i++; if (i >= N) done({ right: run.right, finished: true, missed }); else next(); }
        example();
      } },

    /* ---------------- Abubuwa: the auctioneer ---------------- */
    'j-dillali': { title: 'Dillalin kasuwa', cls: 'dillali', scene: 'kurmi',
      placeNo: 'Abubuwa would start at Dabbobi, with the lessons.',
      place: (r) => r.right >= 6 ? 'Named everything the dillali held up: those groups would be skipped.' : 'Named ' + r.right + ' of 6: the groups with misses would be taught.',
      /* Dillalin kasuwa (Sani 2026-10-22): the thing for sale is drawn, not a photo. Named right: a buyer takes it the
         way people do (an animal led off on a rope, the mat prayed on, a pot on the head, a cap put on…) and the crowd
         claps. Wrong: the thing goes back off to the left and everyone looks sad; its name is never said. */
      play(run, done) {
        const G = [['ram', 'goat', 'chicken', 'camel', 'donkey'], ['millet', 'groundnut', 'mango', 'bread', 'onion'], ['calabash', 'pot', 'mat', 'kettle', 'broom'], ['kaftan', 'cap', 'turban', 'shoe', 'umbrella']];
        const items = shuffle(G.map((g) => shuffle(g)[0]).concat(shuffle(G.flat()).slice(0, 4))).filter((w, k, a) => a.indexOf(w) === k).slice(0, 6), among = G.flat();
        let r = 0, sold = 0;
        const st = h('<div class="dstage mk"><div class="dillw">' + A.dillali() + '</div><div class="stall"><div class="goods"></div><div class="dealw"></div></div><div class="crowd">' + A.crowd(4) + '</div></div>');
        const tally = h('<div class="tally"><span class="coin s">Z</span> <b>0</b> / 6</div>');
        const box = micBox(run);
        run.scr.appendChild(st); run.scr.appendChild(tally); run.scr.appendChild(box);
        run.clock(170, () => done({ right: sold, part: sold / 6 }));
        run.remind = () => say(line('j-dillali', 'how'), run);
        const goods = st.querySelector('.goods'), dealw = st.querySelector('.dealw'), crowdEl = st.querySelector('.crowd');
        function next() {
          const w = items[r]; st.classList.remove('sad'); dealw.innerHTML = ''; goods.className = 'goods'; goods.innerHTML = GOODS[w].svg(); void goods.offsetWidth; goods.classList.add('up');
          speakRound(run, box, w, among, () => {
            sold++; run.good(goods); tally.querySelector('b').textContent = sold; goods.classList.add('taken');
            dealw.innerHTML = deal(w, r); bump(crowdEl, 'clapping', 1600); sfx('yay');
            later(run, 60, () => dealw.firstElementChild && dealw.firstElementChild.classList.add('run'));
            step(ACT_MS[GOODS[w].act] || 3000);
          }, () => { goods.classList.add('back'); st.classList.add('sad'); step(2200); });
        }
        function step(ms) { later(run, ms, () => { r++; if (r >= 6) done({ right: sold, finished: true, part: sold / 6 }); else next(); }); }
        next();
      } },

    /* ---------------- Nemo hoto: the tea seller ---------------- */
    /* Mai shayi by the roadside (Sani 2026-10-23): one picture at a time, big, with Laila in the middle under it as in the
       lessons. The seller pulls tea between two cups while an egg fries; people eat on the bench under the umbrella and a
       motorbike goes by. Name the picture: two taps of the spoon and it goes over to the bench. Wrong: the seller and his
       customers frown, the picture drops away, and the next one comes (one answer, no hints). */
    'j-shayi': { title: 'Mai shayi', cls: 'shayi', scene: 'teanight',
      placeNo: 'Nemo hoto would start from the four-picture rounds.',
      place: (r) => r.right >= 7 ? 'Ordered everything by name: food and drink words are known.' : 'Ordered ' + r.right + ' of 7: Nemo hoto would start from the four-picture rounds.',
      play(run, done) {
        const MENU = ['tea', 'bread', 'egg', 'sugar', 'milk', 'cup', 'spoon', 'kettle', 'water'], ORDER = shuffle(MENU).slice(0, 7); let r = 0, got = 0;
        const st = h('<div class="tstage"><div class="road"><i></i></div><div class="okw">' + okada() + '</div><div class="tsw">' + teaStall() + '</div><div class="ubw">' + umbrellaBench() + '</div><div class="tcard"></div></div>');
        const box = micBox(run); run.scr.appendChild(st); run.scr.appendChild(box);
        run.clock(150, () => done({ right: got, part: got / 7 }));
        run.remind = () => say(line('j-shayi', 'how'), run);
        const card = st.querySelector('.tcard');
        function next() {
          const w = ORDER[r]; st.classList.remove('sad', 'glad'); card.className = 'tcard'; card.innerHTML = photo(w); void card.offsetWidth; card.classList.add('in');
          speakRound(run, box, w, MENU, () => {
            got++; run.good(card); say(K.en[w], run); cupTap(true); st.classList.add('glad'); card.classList.add('serve'); step(1900);
          }, () => { cupTap(false); st.classList.add('sad'); card.classList.add('drop'); step(1900); });
        }
        function step(ms) { later(run, ms, () => { r++; if (r >= ORDER.length) done({ right: got, finished: true, part: got / 7 }); else next(); }); }
        next();
      } },

    /* ---------------- Lambobi: the groundnut pyramids (tap) ---------------- */
    'j-gyada': { title: 'Dalar gyaɗa', cls: 'gyada', scene: 'pyramids', tap: true,
      placeNo: 'Lambobi would start at 1 to 5, with the lessons.',
      place: (r) => r.right >= 8 ? 'Matched every number to its stack, to twenty: Lambobi would start at the tens.' : 'Matched ' + r.right + ' of 8: Lambobi would start ' + (r.reached > 10 ? 'at 11 to 20.' : 'at 1 to 10.'),
      /* Laila says a number; the child taps the pile of groundnut sacks that has that many. Right: the sacks are loaded
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
                run.bad(b); horn(false); later(run, 900, () => lw.classList.add('away', 'slow')); after(2600); return;
              }
              got++; reached = Math.max(reached, n); run.good(b); top.querySelector('.tally b').textContent = got;
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

    /* ---------------- Lambobi: the cattle market (tap) ---------------- */
    /* Kasuwar shanu (Sani 2026-10-23): a real cattle market. Four cattle (White Fulani, Red Bororo, Gudali) stand at their
       posts, each with its price on a little blackboard; they eat, switch their tails and egrets walk about their feet.
       Hear a price and touch the animal that costs it. Right: the cowbell, the coins, and the buyer leads it away. Wrong:
       it lows and turns its head away, the board gets a red cross, and the next price comes (one touch, no second go). */
    'j-shanu': { title: 'Kasuwar shanu', cls: 'shanu', scene: 'cattle', tap: true,
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
          opts.forEach((m, k) => {
            const b = h('<button type="button" class="beast2" aria-label="₦' + m + '" style="--gd:' + (-Math.random() * 6).toFixed(2) + 's;--gs:' + (5 + Math.random() * 3).toFixed(2) + 's;--i:' + k + '">' +
              priceBoard(m) + '<span class="post"></span>' + zebu(v++) + '</button>');
            pen.appendChild(b);
            b.onclick = () => { if (run.dead || busy) return; busy = true;
              if (m === p) {
                got++; if (p >= 100) hundreds++; run.good(b); top.querySelector('.tally b').textContent = got; say(K.en['n' + p], run); cowbell(3);
                b.classList.add('bought'); buyer.classList.remove('lead'); void buyer.offsetWidth; buyer.classList.add('lead');
                later(run, 3000, step);
              } else {
                // one touch: the animal lows and turns away, its board is crossed out, the market frowns, and on we go
                run.bad(); moo(); b.classList.add('no'); yard.classList.add('sad');
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
          speakRound(run, box, w, AMONG, () => {
            got++; run.good(hand); say(K.en['n' + n], run); hand.classList.add('paid'); wraps.children[r].classList.add('on'); later(run, 1700, step);
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
          const w = W[r]; aw.innerHTML = A.allo(w.toUpperCase()); aw.classList.remove('washing'); void aw.offsetWidth; aw.classList.add('writing');
          speakRound(run, box, w, W, () => {
            got++; longest = Math.max(longest, w.length); run.good(aw); say(K.en[w], run); prog.children[r].classList.add('on');
            aw.classList.remove('writing'); aw.classList.add('washing'); later(run, 1900, step);
          }, () => { prog.children[r].classList.add('miss'); aw.classList.add('wrongw'); later(run, 1500, () => aw.classList.remove('wrongw')); later(run, 1700, step); });
        }
        function step() { r++; if (r >= W.length) done({ right: got, finished: got === W.length, part: got / W.length, longest }); else next(); }
        next();
      } },

    /* ---------------- Karatu: the ferry ---------------- */
    'j-jirgi': { title: 'Jirgin ruwa', cls: 'jirgi', scene: 'crossing',
      placeNo: 'Karatu would start at short words, with the lessons.',
      place: (r) => r.right >= 5 ? 'Read every canoe aloud and filled the boat: the ferry and the board agree.' : 'Read ' + r.right + ' of 5 canoes: Karatu would start at short words.',
      play(run, done) {
        const W = shuffle(['cup', 'bed', 'pen', 'cow', 'egg', 'key', 'hat', 'map'].filter((w) => K.en[w])).slice(0, 5); let r = 0, got = 0;
        const st = h('<div class="fstage"><div class="bank3">' + W.map((_, k) => '<span class="pq">' + A.passenger(k) + '</span>').join('') + '</div><div class="ferry"></div></div>');
        const box = micBox(run); run.scr.appendChild(st); run.scr.appendChild(box);
        run.clock(150, () => done({ right: got, part: got / 5 }));
        run.remind = () => say(line('j-jirgi', 'how'), run);
        const ferry = st.querySelector('.ferry'), bank = st.querySelector('.bank3');
        function next() {
          const w = W[r]; ferry.innerHTML = KC.canoe(w.toUpperCase()); ferry.className = 'ferry'; void ferry.offsetWidth; ferry.classList.add('drift');
          speakRound(run, box, w, W, () => {
            got++; run.good(ferry); say(K.en[w], run); ferry.classList.remove('drift'); ferry.classList.add('dock');
            const p = bank.children[r]; later(run, 900, () => p.classList.add('board')); later(run, 1600, () => ferry.classList.add('leave')); later(run, 2600, step);
          }, () => { ferry.classList.add('leave'); later(run, 1800, step); });
        }
        function step() { r++; if (r >= 5) done({ right: got, finished: true, part: got / 5 }); else next(); }
        const KC = c.KART; next();
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
        const st = h('<div class="mstage"><div class="marw">' + A.marubuci() + '</div><div class="env"><span class="to"><img alt=""></span><div class="hand2"></div><span class="stamp2"></span></div><div class="achw">' + A.achaba() + '</div></div>');
        const kb = h('<div class="mkb">' + ABC.map((L) => '<button type="button" class="mk" data-l="' + L + '">' + L + '</button>').join('') + '</div>');
        const box = micBox(run); run.scr.appendChild(st); run.scr.appendChild(kb); run.scr.appendChild(box);
        run.clock(150, () => done({ right: words, part: words / W.length }));
        run.remind = () => say(K.en[W[wi]], run);
        const env = st.querySelector('.env'), hand = env.querySelector('.hand2'), ach = st.querySelector('.achw');
        function word() {
          const w = W[wi].toUpperCase(); li = 0; env.querySelector('img').src = K.pic[W[wi]]; env.className = 'env'; ach.className = 'achw'; kb.classList.remove('locked');
          hand.innerHTML = w.split('').map(() => '<span></span>').join(''); box.cue(); later(run, 300, () => say(K.en[W[wi]], run));
        }
        function nextWord(ms) { later(run, ms, () => { wi++; if (wi >= W.length) done({ right: words, finished: true, part: words / W.length }); else word(); }); }
        // the same for a spoken run of letters and for a key: right letters are inked in order, the first wrong one ends the word
        function take(letters, key) {
          const w = W[wi].toUpperCase();
          for (let k = 0; k < letters.length && li < w.length; k++) {
            const L = String(letters[k]).toUpperCase();
            if (L === w[li]) { const s = hand.children[li]; s.textContent = L; s.classList.add('on'); bump(st.querySelector('.marw'), 'writing', 400); if (key) bump(key, 'good', 500); li++; }
            else { run.bad(env); if (key) bump(key, 'bad', 700); li = -1; break; }
          }
          if (li < 0) { box.busy = true; kb.classList.add('locked'); env.classList.add('blot'); nextWord(1800); return; }
          if (li >= w.length) { box.busy = true; kb.classList.add('locked'); words++; run.good(env); env.classList.add('sealed'); later(run, 800, () => { env.classList.add('post'); ach.classList.add('ride'); }); nextWord(2600); }
          else box.cue();
        }
        box.listen(() => { const w = W[wi].toUpperCase(); return { multi: true, word: W[wi], target: w[li] }; }, (r) => {
          const got = r.value || [];
          if (!got.length) { box.cue(); return; }
          take(got);
        }, () => W[wi].toUpperCase().slice(li).split(''));
        const ready = () => !run.dead && !run.listening && !box.busy;
        kb.addEventListener('click', (e) => { const b = e.target.closest('.mk'); if (b && ready()) take([b.dataset.l], b); });
        const onKey = (e) => { if (run.dead) { document.removeEventListener('keydown', onKey); return; }
          const L = (e.key || '').toUpperCase(); if (L.length === 1 && L >= 'A' && L <= 'Z' && ready()) { e.preventDefault(); take([L], kb.querySelector('[data-l="' + L + '"]')); } };
        document.addEventListener('keydown', onKey);
        word();
      } },
  };
}
