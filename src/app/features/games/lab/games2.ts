// @ts-nocheck
/*
 * The Arewa games (Sani 2026-10-16): two speaking games for every lesson, and Lambobi's games done again. Each is
 * drawn with the shaded, animated SVG in art4.ts; the words a child must name are the lessons' own photos, framed
 * inside those drawings. Same rules as the other games: one fixed box, transform and opacity only, Laila is the
 * microphone and the clock waits while she listens.
 */
import * as A from './art4';

export function moreGames(c: any): Record<string, any> {
  const { K, h, say, sfx, drum, shuffle, micBox, line, F, io } = c;
  const LET = 'ABCDEFGHIJKLMNOPRSTUVWYZ'.split('');   // no Q or X: the recogniser cannot hear them apart from K and S
  const later = (run, ms, f) => run.later(ms, f);
  const beat = (run, n) => { for (let k = 0; k < n; k++) later(run, k * 200, () => drum(k % 2 === 0)); };
  const bump = (el, cls, ms = 700) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); if (ms) setTimeout(() => el.classList.remove(cls), ms); };
  /** one picture on a card, the lessons' photo */
  const photo = (w, cls = '') => `<span class="ph ${cls}"><img alt="" src="${K.pic[w]}"></span>`;
  /** a speaking round: press Laila, say it; right → onRight, wrong → onWrong(tries). Two tries, then the answer is shown. */
  function speakRound(run, box, target, among, onRight, onMiss, tries = 2) {
    let t = 0; box.cue();
    box.listen(() => ({ target, among, match: (raw) => io.match(raw, target, among) }), (r) => {
      if (r.value === null && !r.raw) { box.cue(); return; }
      if (r.value === target) { box.busy = true; onRight(); return; }
      t++; run.bad(box);
      if (t >= tries) { box.busy = true; onMiss(); } else box.cue();
    }, () => target);
  }

  return {
    /* ---------------- Haruffa: the Durbar ---------------- */
    'j-durbar': { title: 'Hawan Daushe', cls: 'durbar', scene: 'courtyard',
      placeNo: 'Haruffa would start at A, with the lessons.',
      place: (r) => r.missed.length ? 'Could not say <b>' + r.missed.join(', ') + '</b> out of order: those letters would be taught.' : 'Said every letter out of order: with the balloons and the lanterns agreeing, Haruffa is done.',
      play(run, done) {
        const L8 = shuffle(LET).slice(0, 8); let i = 0; const missed = [];
        const st = h('<div class="dstage"><div class="emirw">' + A.emir() + '</div><div class="rlane"></div></div>');
        const row = h('<div class="lrow">' + L8.map(() => '<span></span>').join('') + '</div>');
        const box = micBox(run); st.appendChild(box);
        run.scr.appendChild(st); run.scr.appendChild(row);
        run.clock(150, () => done({ right: run.right, part: run.right / 8, missed: L8.slice(i).concat(missed) }));
        run.remind = () => say(line('j-durbar', 'how'), run);
        const lane = st.querySelector('.rlane');
        function next() {
          const L = L8[i]; lane.innerHTML = ''; const rw = h('<div class="rw">' + A.rider(L) + '</div>'); lane.appendChild(rw);
          rw.classList.add('gallop'); void rw.offsetWidth; rw.classList.add('in'); drum(false);
          later(run, 1300, () => { rw.classList.remove('gallop'); row.children[i].classList.add('now');
            speakRound(run, box, L, LET.map((x) => x), () => {
              run.good(rw); say(K.L[L], run); rw.classList.add('salute'); row.children[i].classList.remove('now'); row.children[i].classList.add('on'); row.children[i].textContent = L;
              later(run, 900, () => { rw.classList.add('gallop', 'go'); beat(run, 4); });
              later(run, 2300, step);
            }, () => {
              missed.push(L); row.children[i].classList.remove('now'); row.children[i].classList.add('miss'); say(K.L[L], run);
              later(run, 700, () => rw.classList.add('gallop', 'back')); later(run, 2000, step);
            }, 3);
          });
        }
        function step() { i++; if (i >= 8) done({ right: run.right, finished: true, missed }); else next(); }
        next();
      } },

    /* ---------------- Abubuwa: the auctioneer ---------------- */
    'j-dillali': { title: 'Dillalin kasuwa', cls: 'dillali', scene: 'market',
      placeNo: 'Abubuwa would start at Dabbobi, with the lessons.',
      place: (r) => r.right >= 6 ? 'Named everything the dillali held up: those groups would be skipped.' : 'Named ' + r.right + ' of 6: the groups with misses would be taught.',
      play(run, done) {
        const G = [['ram', 'goat', 'chicken', 'camel', 'donkey'], ['millet', 'groundnut', 'mango', 'bread', 'onion'], ['calabash', 'pot', 'mat', 'kettle', 'broom'], ['kaftan', 'cap', 'turban', 'shoe', 'umbrella']];
        const items = shuffle(G.map((g) => shuffle(g)[0]).concat(shuffle(G.flat()).slice(0, 4))).filter((w, k, a) => a.indexOf(w) === k).slice(0, 6), among = G.flat();
        let r = 0, sold = 0;
        const st = h('<div class="dstage"><div class="dillw">' + A.dillali() + '<div class="board"><img alt=""><b class="stamp">SOLD</b></div></div><div class="crowd">' + A.crowd(5) + '</div></div>');
        const tally = h('<div class="tally"><span class="coin s">Z</span> <b>0</b> / 6</div>');
        const box = micBox(run); st.appendChild(box);
        run.scr.appendChild(st); run.scr.appendChild(tally);
        run.clock(150, () => done({ right: sold, part: sold / 6 }));
        run.remind = () => say(line('j-dillali', 'how'), run);
        const board = st.querySelector('.board'), crowdEl = st.querySelector('.crowd');
        function next() {
          const w = items[r]; board.classList.remove('sold', 'up'); board.querySelector('img').src = K.pic[w]; void board.offsetWidth; board.classList.add('up');
          speakRound(run, box, w, among, () => {
            sold++; run.good(board); tally.querySelector('b').textContent = sold; say(K.en[w], run); board.classList.add('sold'); bump(crowdEl, 'clapping', 1400); sfx('yay'); step();
          }, () => { say(K.en[w], run); step(); });
        }
        function step() { later(run, 1700, () => { r++; if (r >= 6) done({ right: sold, finished: true, part: sold / 6 }); else next(); }); }
        next();
      } },

    /* ---------------- Nemo hoto: the keke ---------------- */
    'j-keke': { title: 'Keke NAPEP', cls: 'keke', scene: 'savanna',
      placeNo: 'Nemo hoto would start from the four-picture rounds.',
      place: (r) => r.right >= 6 ? 'Took every passenger where they asked: places are known.' : 'Got ' + r.right + ' of 6 places: Nemo hoto would start from the four-picture rounds.',
      play(run, done) {
        const D = shuffle(['school', 'farm', 'river', 'well', 'forest', 'road']); let r = 0, got = 0;
        const st = h('<div class="kstage2"><div class="kekew">' + A.keke() + '</div><div class="pax"><div class="pp1"></div><div class="bub">' + photo('school') + '</div></div></div>');
        const box = micBox(run); st.appendChild(box); run.scr.appendChild(st);
        const seats = h('<div class="seats">' + D.map(() => '<i></i>').join('') + '</div>'); run.scr.appendChild(seats);
        run.clock(150, () => done({ right: got, part: got / 6 }));
        run.remind = () => say(line('j-keke', 'how'), run);
        const kw = st.querySelector('.kekew'), pax = st.querySelector('.pax');
        function next() {
          const w = D[r]; pax.querySelector('.pp1').innerHTML = A.passenger(r); pax.querySelector('.bub img').src = K.pic[w];
          pax.classList.remove('gone'); kw.classList.remove('drive', 'away'); void kw.offsetWidth; kw.classList.add('arrive');
          speakRound(run, box, w, D, () => {
            got++; run.good(pax); say(K.en[w], run); seats.children[r].classList.add('on');
            later(run, 600, () => pax.classList.add('gone')); later(run, 1100, () => { kw.classList.remove('arrive'); kw.classList.add('drive', 'away'); });
            later(run, 2600, step);
          }, () => { seats.children[r].classList.add('miss'); say(K.en[w], run); later(run, 1600, step); });
        }
        function step() { r++; if (r >= 6) done({ right: got, finished: true, part: got / 6 }); else next(); }
        next();
      } },

    /* ---------------- Nemo hoto: the tea seller ---------------- */
    'j-shayi': { title: 'Mai shayi', cls: 'shayi', scene: 'nightvillage',
      placeNo: 'Nemo hoto would start from the four-picture rounds.',
      place: (r) => r.right >= 7 ? 'Ordered everything by name: food and drink words are known.' : 'Ordered ' + r.right + ' of 7: Nemo hoto would start from the four-picture rounds.',
      play(run, done) {
        const MENU = ['tea', 'bread', 'egg', 'sugar', 'milk', 'rice', 'beans', 'water'];
        const orders = (() => { const m = shuffle(MENU); return [m.slice(0, 2), m.slice(2, 4), m.slice(4, 7)]; })(); let o = 0, got = 0;
        const st = h('<div class="sstage"><div class="stallw">' + A.shayi() + '</div><div class="order"></div></div>');
        const plate = h('<div class="plate3"></div>'), kettle = h('<div class="kettle"><i></i><span>♨</span></div>');
        const box = micBox(run); st.appendChild(box);
        run.scr.appendChild(st); run.scr.appendChild(plate); run.scr.appendChild(kettle);
        run.clock(150, () => done({ right: got, part: got / 7 }));
        run.remind = () => say(line('j-shayi', 'how'), run);
        const orderEl = st.querySelector('.order'); let kt = null;
        function boil(secs) { const i = kettle.querySelector('i'); i.style.transition = 'none'; i.style.transform = 'scaleX(0)'; void i.offsetWidth; i.style.transition = 'transform ' + secs + 's linear'; i.style.transform = 'scaleX(1)';
          if (kt) clearTimeout(kt); kt = later(run, secs * 1000, () => { run.bad(kettle); bump(kettle, 'over', 900); finish(); }); }
        function next() {
          const want = orders[o].slice(); orderEl.innerHTML = want.map((w) => photo(w, 'o-' + w)).join(''); plate.innerHTML = ''; boil(22 + want.length * 6);
          (function ask() {
            if (!want.length) { clearTimeout(kt); later(run, 900, finish); return; }
            box.cue();
            box.listen(() => ({ target: want[0], among: MENU, match: (raw) => { for (const w of want) if (io.match(raw, w, MENU)) return w; return null; } }), (r) => {
              if (r.value === null && !r.raw) { box.cue(); return; }
              const w = want.indexOf(r.value) >= 0 ? r.value : null;
              if (!w) { run.bad(orderEl); box.cue(); return; }
              want.splice(want.indexOf(w), 1); got++; run.good(orderEl.querySelector('.o-' + w)); say(K.en[w], run);
              orderEl.querySelector('.o-' + w).classList.add('done'); plate.insertAdjacentHTML('beforeend', photo(w, 'served'));
              later(run, 700, ask);
            }, () => want[0]);
          })();
        }
        function finish() { o++; if (o >= orders.length) done({ right: got, finished: true, part: got / 7 }); else later(run, 600, next); }
        next();
      } },

    /* ---------------- Lambobi: the groundnut pyramids (tap) ---------------- */
    'j-gyada': { title: 'Dalar gyaɗa', cls: 'gyada', scene: 'savanna', tap: true,
      placeNo: 'Lambobi would start at 1 to 5, with the lessons.',
      place: (r) => r.right >= 8 ? 'Matched every number to its stack, to twenty: Lambobi would start at the tens.' : 'Matched ' + r.right + ' of 8: Lambobi would start ' + (r.reached > 10 ? 'at 11 to 20.' : 'at 1 to 10.'),
      play(run, done) {
        const N = shuffle([2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 4).concat(shuffle([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]).slice(0, 4)); let r = 0, got = 0, reached = 0;
        const top = h('<div class="gtop"><button type="button" class="hearn">🔊</button><div class="lorryw">' + A.lorry() + '<span class="loaded"><b>0</b> / 8</span></div></div>');
        const row = h('<div class="stacks2"></div>');
        run.scr.appendChild(top); run.scr.appendChild(row);
        run.clock(150, () => done({ right: got, part: got / 8, reached }));
        const sayN = () => say(K.en['n' + N[r]], run);
        run.remind = sayN; top.querySelector('.hearn').onclick = sayN;
        function next() {
          // up to ten: four stacks; the teens: three bigger stacks, so every sack stays big enough to count
          const n = N[r], cap = n <= 10 ? 10 : 20, k = n <= 10 ? 3 : 2;
          const opts = shuffle([n].concat(shuffle([-3, -2, -1, 1, 2, 3].map((d) => n + d).filter((x) => x >= 1 && x <= cap)).slice(0, k)));
          row.innerHTML = ''; row.classList.toggle('big', cap === 20);
          opts.forEach((m) => { const b = h('<button type="button" class="stk" aria-label="' + m + ' sacks">' + A.sacks(m, cap) + '</button>'); row.appendChild(b);
            b.onclick = () => { if (run.dead || b.classList.contains('fly')) return;
              if (m === n) { got++; reached = Math.max(reached, n); run.good(b); b.classList.add('fly'); top.querySelector('.loaded b').textContent = got; bump(top.querySelector('.lorryw'), 'thump');
                later(run, 1000, () => { r++; if (r >= 8) done({ right: got, finished: true, part: got / 8, reached }); else next(); }); }
              else run.bad(b); }; });
          later(run, 300, sayN);
        }
        next();
      } },

    /* ---------------- Lambobi: the cattle market (tap) ---------------- */
    'j-shanu': { title: 'Kasuwar shanu', cls: 'shanu', scene: 'market', tap: true,
      placeNo: 'Lambobi would start at the tens, with the lessons.',
      place: (r) => r.right >= 8 ? 'Knew every price by ear, to a thousand: the tens and hundreds would be skipped.' : 'Knew ' + r.right + ' of 8 prices: Lambobi would start ' + (r.hundreds < 2 ? 'at the tens.' : 'at the hundreds.'),
      play(run, done) {
        const TENS = [20, 30, 40, 50, 60, 70, 80, 90], HUN = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
        const P = shuffle(TENS).slice(0, 3).concat(shuffle(HUN).slice(0, 5)); let r = 0, got = 0, hundreds = 0;
        const top = h('<div class="gtop"><button type="button" class="hearn">🔊</button><span class="tally"><span class="coin s">Z</span> <b>0</b> / 8</span></div>');
        const pen = h('<div class="pen2"></div>');
        run.scr.appendChild(top); run.scr.appendChild(pen);
        run.clock(150, () => done({ right: got, part: got / 8, hundreds }));
        const sayP = () => say(K.en['n' + P[r]], run);
        run.remind = sayP; top.querySelector('.hearn').onclick = sayP;
        const BEASTS = [A.cow, A.ram, A.goat, A.cow];
        function next() {
          const p = P[r], pool = p >= 100 ? HUN : TENS, opts = shuffle([p].concat(shuffle(pool.filter((x) => x !== p)).slice(0, 3)));
          pen.innerHTML = '';
          opts.forEach((m, k) => { const b = h('<button type="button" class="beastb" aria-label="₦' + m + '">' + BEASTS[k]() + '<b class="ptag">₦' + m.toLocaleString('en-GB') + '</b></button>'); pen.appendChild(b);
            b.onclick = () => { if (run.dead || b.classList.contains('sold')) return;
              if (m === p) { got++; if (p >= 100) hundreds++; run.good(b); b.classList.add('sold'); top.querySelector('.tally b').textContent = got; say(K.en['n' + p], run);
                later(run, 1600, () => { r++; if (r >= 8) done({ right: got, finished: true, part: got / 8, hundreds }); else next(); }); }
              else run.bad(b); }; });
          later(run, 300, sayP);
        }
        next();
      } },

    /* ---------------- Lambobi: counting the herd (speaking) ---------------- */
    'j-garke': { title: 'Ƙirgen garke', cls: 'garke', scene: 'savanna',
      placeNo: 'Lambobi would start at 1 to 5, with the lessons.',
      place: (r) => r.finished ? 'Counted the herd to ten and the big herd in tens to fifty: Lambobi would start at the hundreds.' : 'Counted to <b>' + r.reached + '</b>: Lambobi would start ' + (r.reached < 5 ? 'at 1 to 5.' : r.reached <= 10 ? 'at 6 to 10.' : 'at the tens.'),
      play(run, done) {
        const STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50], WORD = (n) => K.enText['n' + n].toLowerCase(), AMONG = STEPS.map(WORD).concat(['eleven', 'twelve', 'sixty', 'hundred']);
        let s = 0, reached = 0, wrong = 0;
        const st = h('<div class="gstage"><div class="queue"></div><div class="gate2"><div class="herder">' + A.herder() + '</div></div><div class="pen3">' + A.zariba() + '<div class="inpen"></div><b class="cnt2">0</b></div></div>');
        const box = micBox(run); run.scr.appendChild(st); run.scr.appendChild(box);
        run.clock(150, () => done({ right: s, part: s / STEPS.length, reached }));
        run.remind = () => say(line('j-garke', 'how'), run);
        const queue = st.querySelector('.queue'), inpen = st.querySelector('.inpen'), cnt = st.querySelector('.cnt2');
        function fill() { queue.innerHTML = ''; for (let k = 0; k < 3; k++) queue.insertAdjacentHTML('beforeend', '<span class="qcow' + (s >= 10 ? ' ten' : '') + '">' + A.cow() + (s >= 10 ? '<b>×10</b>' : '') + '</span>'); }
        function next() {
          if (s === 10) { inpen.innerHTML = ''; cnt.textContent = '0'; }
          if (s === 0 || s === 10) fill();
          const n = STEPS[s], w = WORD(n); wrong = 0;
          box.cue();
          box.listen(() => ({ target: w, among: AMONG, match: (raw) => io.match(raw, w, AMONG) }), (r) => {
            if (r.value === null && !r.raw) { box.cue(); return; }
            if (r.value === w) { box.busy = true; run.good(queue.firstChild); reached = n; walkIn(n); return; }
            wrong++; run.bad(queue.firstChild);
            if (wrong >= 3) { box.busy = true; say(K.en['n' + n], run); later(run, 900, () => { done({ right: s, part: s / STEPS.length, reached }); }); }
            else box.cue();
          }, () => w);
        }
        function walkIn(n) {
          const c = queue.firstChild; c.classList.add('walk');
          later(run, 1100, () => { c.remove(); inpen.insertAdjacentHTML('beforeend', '<span class="pc">' + A.cow() + '</span>'); cnt.textContent = n; bump(cnt, 'pop');
            queue.insertAdjacentHTML('beforeend', '<span class="qcow' + (s + 1 >= 10 ? ' ten' : '') + '">' + A.cow() + (s + 1 >= 10 ? '<b>×10</b>' : '') + '</span>');
            s++; if (s >= STEPS.length) done({ right: s, finished: true, part: 1, reached }); else next(); });
        }
        next();
      } },

    /* ---------------- Lambobi: the suya seller (speaking) ---------------- */
    'j-suya': { title: 'Mai suya', cls: 'suyag', scene: 'nightvillage',
      placeNo: 'Lambobi would start at the tens, with the lessons.',
      place: (r) => r.right >= 6 ? 'Paid with every note by name, to a thousand: Lambobi would skip the hundreds.' : 'Named ' + r.right + ' of 6 notes: Lambobi would start at the tens.',
      play(run, done) {
        const NOTES = shuffle([20, 50, 100, 200, 500, 1000]), AMONG = NOTES.map((n) => K.enText['n' + n].toLowerCase()).concat(['ten', 'five', 'two', 'one']); let r = 0, got = 0;
        const st = h('<div class="sgstage"><div class="grillw">' + A.suya() + '</div></div>');
        const hand = h('<div class="handn"></div>'), wraps = h('<div class="wraps">' + NOTES.map(() => '<i></i>').join('') + '</div>');
        const box = micBox(run); st.appendChild(box);
        run.scr.appendChild(st); run.scr.appendChild(hand); run.scr.appendChild(wraps);
        run.clock(150, () => done({ right: got, part: got / 6 }));
        run.remind = () => say(line('j-suya', 'how'), run);
        function next() {
          const n = NOTES[r], w = K.enText['n' + n].toLowerCase(); hand.innerHTML = A.note(n); hand.classList.remove('paid'); void hand.offsetWidth; hand.classList.add('in');
          speakRound(run, box, w, AMONG, () => {
            got++; run.good(hand); say(K.en['n' + n], run); hand.classList.add('paid'); wraps.children[r].classList.add('on'); later(run, 1700, step);
          }, () => { say(K.en['n' + n], run); wraps.children[r].classList.add('miss'); later(run, 1700, step); });
        }
        function step() { r++; if (r >= 6) done({ right: got, finished: true, part: got / 6 }); else next(); }
        next();
      } },

    /* ---------------- Karatu: the allo ---------------- */
    'j-allo': { title: 'Allo', cls: 'allog', scene: 'courtyard',
      placeNo: 'Karatu would start at short words, with the lessons.',
      place: (r) => r.longest >= 5 ? 'Read aloud up to ' + r.longest + '-letter words: Karatu would start at long words.' : 'Read aloud up to ' + (r.longest || 0) + '-letter words: Karatu would start at short words.',
      play(run, done) {
        const W = shuffle(['cat', 'sun', 'bus', 'dog', 'cup']).slice(0, 3).concat(shuffle(['goat', 'book', 'fish', 'milk']).slice(0, 2), shuffle(['bread', 'mango', 'water']).slice(0, 2));
        let r = 0, got = 0, longest = 0;
        const st = h('<div class="astage"><div class="allow2"></div></div>'); const box = micBox(run); st.appendChild(box); run.scr.appendChild(st);
        const prog = h('<div class="seats">' + W.map(() => '<i></i>').join('') + '</div>'); run.scr.appendChild(prog);
        run.clock(150, () => done({ right: got, part: got / W.length, longest }));
        run.remind = () => say(line('j-allo', 'how'), run);
        const aw = st.querySelector('.allow2');
        function next() {
          const w = W[r]; aw.innerHTML = A.allo(w.toUpperCase()); aw.classList.remove('washing'); void aw.offsetWidth; aw.classList.add('writing');
          speakRound(run, box, w, W, () => {
            got++; longest = Math.max(longest, w.length); run.good(aw); say(K.en[w], run); prog.children[r].classList.add('on');
            aw.classList.remove('writing'); aw.classList.add('washing'); later(run, 1900, step);
          }, () => { say(K.en[w], run); prog.children[r].classList.add('miss'); later(run, 1700, step); });
        }
        function step() { r++; if (r >= W.length) done({ right: got, finished: got === W.length, part: got / W.length, longest }); else next(); }
        next();
      } },

    /* ---------------- Karatu: the ferry ---------------- */
    'j-jirgi': { title: 'Jirgin ruwa', cls: 'jirgi', scene: 'riverart',
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
          }, () => { say(K.en[w], run); ferry.classList.add('leave'); later(run, 1800, step); });
        }
        function step() { r++; if (r >= 5) done({ right: got, finished: true, part: got / 5 }); else next(); }
        const KC = c.KART; next();
      } },

    /* ---------------- Rubutu: the letter writer ---------------- */
    'j-marubuci': { title: 'Marubucin wasiƙa', cls: 'marubg', scene: 'courtyard',
      placeNo: 'Rubutu would start at three letters, with the lessons.',
      place: (r) => r.right >= 4 ? 'Spelled every name aloud: with Ginin bulo agreeing, Rubutu moves on.' : 'Spelled ' + r.right + ' of 4 aloud: Rubutu would start at three letters.',
      play(run, done) {
        const W = shuffle(['mama', 'baba', 'aunt', 'uncle'].filter((w) => K.en[w] && K.pic[w])); let wi = 0, li = 0, words = 0;
        const st = h('<div class="mstage"><div class="marw">' + A.marubuci() + '</div><div class="env"><span class="to"><img alt=""></span><div class="hand2"></div><span class="stamp2"></span></div><div class="achw">' + A.achaba() + '</div></div>');
        const box = micBox(run); st.appendChild(box); run.scr.appendChild(st);
        run.clock(150, () => done({ right: words, part: words / W.length }));
        run.remind = () => say(K.en[W[wi]], run);
        const env = st.querySelector('.env'), hand = env.querySelector('.hand2'), ach = st.querySelector('.achw');
        function word() {
          const w = W[wi].toUpperCase(); li = 0; env.querySelector('img').src = K.pic[W[wi]]; env.className = 'env'; ach.className = 'achw';
          hand.innerHTML = w.split('').map(() => '<span></span>').join(''); box.cue(); later(run, 300, () => say(K.en[W[wi]], run));
        }
        box.listen(() => { const w = W[wi].toUpperCase(); return { multi: true, word: W[wi], target: w[li] }; }, (r) => {
          const w = W[wi].toUpperCase(), got = r.value || [];
          if (!got.length) { box.cue(); return; }
          for (let k = 0; k < got.length && li < w.length; k++) {
            const L = String(got[k]).toUpperCase();
            if (L === w[li]) { const s = hand.children[li]; s.textContent = L; s.classList.add('on'); bump(st.querySelector('.marw'), 'writing', 400); li++; }
            else { run.bad(env); break; }
          }
          if (li >= w.length) { box.busy = true; words++; run.good(env); env.classList.add('sealed'); later(run, 800, () => { env.classList.add('post'); ach.classList.add('ride'); });
            later(run, 2600, () => { wi++; if (wi >= W.length) done({ right: words, finished: true, part: 1 }); else word(); }); }
          else box.cue();
        }, () => W[wi].toUpperCase().slice(li).split(''));
        word();
      } },
  };
}
