import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { afterPaint } from '../../shared/paint';
import { Door, Ear } from '../../shared/chrome/chrome';
import { HearHandle } from '../../core/speech/speech.service';
import { LailaButton } from '../../shared/laila/laila-button';
import { AbcKeyboard, KeyMark } from '../../shared/lesson/abc-keyboard';
import { AlloButton } from '../../shared/lesson/allo-button';
import { Clip, Item } from '../../shared/lesson/lesson-base';
import { TopicLessonBase } from '../../shared/lesson/topic-lesson-base';
import { TopicMenu } from '../../shared/lesson/topic-menu';
import { ResultsGrid } from '../../shared/lesson/results-grid';
import { firstHints, flyLetter, shuffle, wait } from '../../shared/lesson/helpers';

const SPELL_CATS = [
  { key: 'r3', ha: 'Haruffa uku', ico: 'r3', c: 'var(--red)', min: 3, max: 3 }, { key: 'r4', ha: 'Haruffa huɗu', ico: 'r4', c: 'var(--blue)', min: 4, max: 4 }, { key: 'r5', ha: 'Haruffa biyar', ico: 'r5', c: 'var(--yellow)', min: 5, max: 5 },
  { key: 'rlong', ha: 'Kalmomi dogaye', ico: 'rlong', c: 'var(--purple)', min: 6, max: 99 }, { key: 'rnum', ha: 'Lambobi', ico: 'rnum', c: 'var(--green)', set: 'numbers' },
];
type Slot = { L: string; text: string; st: '' | 'on' | 'done' | 'bad' };
type Ev = { kind: 'tap'; L: string } | { kind: 'heard'; letters: string[] | null } | { kind: 'dk' };

/**
 * Screen 12 · Rubutu, spelling. Sets of five: Laila shows the picture, names it, spells it letter by letter; the child writes it
 * (tap a key or say the letters to Laila; the black slate tells the letter for that place). Then the test of those five:
 * the whole word freely, checked when complete. Results; the missed ones come back first in the next five.
 */
@Component({
  selector: 'app-rubutu',
  imports: [Door, Ear, TopicMenu, ResultsGrid, LailaButton, AlloButton, AbcKeyboard],
  host: { class: 's lesson spell', '[class.hearing]': 'rec() || armed()' },
  template: `
<app-door (pressed)="door()" /><app-ear (pressed)="ear()" /><div class="eyebrow">{{ eye() }}</div>
<div class="splanding" [hidden]="inLesson()"><app-topic-menu [cats]="cats" [few]="true" [picked]="cat()" [cue]="cue()" [nohand]="nohand()" (choose)="choose($event)" (go)="go()" /></div>
<div class="splesson" [hidden]="!inLesson()">
  <div #show class="objshow" [class.off]="!picSrc() && !resultsOn()"><span class="kimg objpic">@if (picSrc()) {<img alt="" [src]="picSrc()">}</span><app-results [on]="resultsOn()" [items]="resultItems()" [miss]="resultMiss()" [saying]="saying()" /></div>
  <div #slotsEl class="wslots">@for (sl of slots(); track $index) {<span class="wslot" [attr.data-l]="sl.L" [class.on]="sl.st === 'on'" [class.done]="sl.st === 'done'" [class.bad]="sl.st === 'bad'">{{ sl.text }}</span>}</div>
  <app-abc-keyboard #kb [locked]="kbLocked()" [marks]="keyMarks()" (key)="keyTap($event)" />
  <div class="fb" [class]="'fb ' + fbCls()">{{ fbText() }}</div>
  <div class="yesno ynpair spq" [class.nohand]="pairNohand()">
    <app-laila-btn #lb label="Faɗa" [size]="96" [armed]="armed()" [rec]="rec()" [speak]="speak()" [prep]="speech.preparing()" [amp]="speech.amp()" (pressed)="lailaPressed()" />
    <app-allo-btn #dk [hidden]="dkHidden()" (pressed)="pressDk()" />
  </div>
</div>`,
})
export class RubutuScreen extends TopicLessonBase {
  readonly cats = SPELL_CATS;
  protected readonly lesson = 'rubutu'; protected readonly title = 'Rubutu'; protected readonly introKey = 's_r_intro2'; protected readonly descPrefix = 's_rd_';
  private readonly showRef = viewChild.required<ElementRef<HTMLElement>>('show');
  private readonly slotsRef = viewChild.required<ElementRef<HTMLElement>>('slotsEl');
  private readonly kb = viewChild.required(AbcKeyboard);
  private readonly lb = viewChild.required(LailaButton);
  private readonly dk = viewChild.required(AlloButton);
  private readonly results = viewChild.required(ResultsGrid);
  readonly picSrc = signal<string | null>(null); readonly slots = signal<Slot[]>([]); readonly keyMarks = signal<Record<string, KeyMark>>({}); readonly kbLocked = signal(false);
  readonly armed = signal(false); readonly rec = signal(false); readonly speak = signal(false); readonly pairNohand = signal(false); readonly dkHidden = signal(false);
  readonly resultsOn = signal(false); readonly resultItems = signal<Item[]>([]); readonly resultMiss = signal<string[]>([]); readonly saying = signal('');
  private WORDS: Item[] = []; private curLetter: string | null = null;
  private awaiting = false; private pend: ((e: Ev) => void) | null = null; private hearHandle: HearHandle | null = null; private round = 0; private timer: ReturnType<typeof setTimeout> | null = null;

  // ---- slots and keys ----
  private buildSlots(word: string): void { this.slots.set(word.split('').map((L) => ({ L, text: '_', st: '' }))); }
  private setSlot(i: number, patch: Partial<Slot>): void { this.slots.update((a) => a.map((x, k) => k === i ? { ...x, ...patch } : x)); }
  private slotOn(i: number): void { this.slots.update((a) => a.map((x, k) => ({ ...x, st: k === i ? 'on' : (x.st === 'on' ? '' : x.st) }))); }
  private slotEl(i: number): HTMLElement | null { return this.slotsRef().nativeElement.children[i] as HTMLElement | null; }
  private mark(L: string, m: KeyMark | null): void { this.keyMarks.update((a) => { const b = { ...a }; if (m) b[L] = m; else delete b[L]; return b; }); }
  private clearBad(): void { this.keyMarks.update((a) => Object.fromEntries(Object.entries(a).filter(([, v]) => v !== 'bad'))); }
  private showPic(it: Item | null): void { this.picSrc.set(it?.w.img || null); }
  /** A letter flies from a key or from Laila and lands in its place; the lesson goes on meanwhile. */
  private fly(from: Element | null, i: number, L: string): Promise<void> { const el = this.slotEl(i); const land = () => this.setSlot(i, { text: L, st: 'done' }); if (!el || !from) { land(); return Promise.resolve(); } return flyLetter(this.zoom, this.s, from, el, L).then(land); }

  // ---- the child's turn: Laila armed, a key, the ear or the slate ----
  private waitEv(): Promise<Ev> { this.awaiting = true; this.armed.set(true); return new Promise((res) => { this.pend = res; }); }
  private settle(e: Ev): void { const p = this.pend; if (!p) return; this.pend = null; this.awaiting = false; this.armed.set(false); this.stopMic(); this.clearTimer(); p(e); }
  private stopMic(): void { this.round++; this.hearHandle?.stop(); this.hearHandle = null; this.rec.set(false); }
  private clearTimer(): void { if (this.timer) { clearTimeout(this.timer); this.timer = null; } }
  /** Clips that start after a short debounce: a fast child's next tap simply cancels them (Sani 2026-09-11). */
  private later(ms: number, ks: Clip[], speak = false): void { this.clearTimer(); this.timer = setTimeout(() => { this.timer = null; if (!this.awaiting) return; if (speak) this.speak.set(true); this.seq(ks).catch(() => undefined).then(() => this.speak.set(false)); }, ms); }
  keyTap(L: string): void { if (!this.awaiting || this.kbLocked()) return; this.bus.stopAll(); this.clearBad(); this.settle({ kind: 'tap', L }); }
  pressDk(): void { if (!this.awaiting || this.dkHidden()) return; this.settle({ kind: 'dk' }); }
  /** The ear: listens up to 10 s, letters only; "G O A T" in one go is welcome. The keyboard always wins over the ear. */
  lailaPressed(): void {
    if (!this.awaiting || this.hearHandle) return; this.bus.stopAll(); this.clearTimer(); this.clearBad(); this.armed.set(false); this.rec.set(true);
    const my = ++this.round, h = this.speech.hear({ multi: true, word: this.curWord, target: this.curLetter || undefined }); this.hearHandle = h;
    h.done.then((r) => { if (my !== this.round || this.hearHandle !== h) return; this.hearHandle = null; this.rec.set(false); this.armed.set(true); this.settle({ kind: 'heard', letters: (r.value as string[] | null) }); });
  }
  private curWord = '';
  protected override onLeave(): void { this.stopMic(); this.clearTimer(); this.pend = null; }

  // ---- teaching a word: picture · Hausa · English · spelt out · the child writes it letter by letter ----
  private async spellOut(word: string): Promise<void> {
    this.speak.set(true); await this.play('s_sp_spelt');
    for (let i = 0; i < word.length; i++) { this.slotOn(i); this.setSlot(i, { text: word.charAt(i) }); await this.play('app_en_' + word.charAt(i)); this.setSlot(i, { st: 'done' }); await wait(140); }
    this.speak.set(false); await wait(600); this.slots.update((a) => a.map((x) => ({ ...x, text: '_', st: '' })));
  }
  /** A finger types a few letters on the keyboard; stops when told, tells when a pass is done. */
  private typeDemo(letters: string[], onPass: () => void): () => void {
    const hand = document.createElement('span'); hand.className = 'spothand typing'; hand.textContent = '👆🏾'; this.s.appendChild(hand); let i = 0, alive = true, t: ReturnType<typeof setTimeout> | null = null, passed = false;
    const step = () => { if (!alive) return; if (i === letters.length && !passed) { passed = true; onPass(); } const L = letters[i % letters.length]; i++; const k = this.kb().keyEl(L); if (!k) { t = setTimeout(step, 300); return; }
      const sR = this.zoom.rect(this.s), r = this.zoom.rect(k);   // transform, not left/top: the hand hops key to key without relaying out the keyboard
      hand.style.transform = 'translate(' + (r.left + r.width / 2 - sR.left - 22) + 'px,' + (r.top + r.height / 2 - sR.top - 4) + 'px)';
      t = setTimeout(() => { if (!alive) return; this.mark(L, 'hot'); setTimeout(() => { if (alive) this.mark(L, null); }, 260); t = setTimeout(step, 420); }, 360); };
    step(); return () => { alive = false; if (t) clearTimeout(t); hand.remove(); this.keyMarks.update((a) => Object.fromEntries(Object.entries(a).filter(([, v]) => v !== 'hot'))); };
  }
  /** The three ways, shown once a session: say it to Laila · a finger types the word · "if not, press the black slate". */
  private async ways(word: string): Promise<void> {
    // the example already showed both ways, on this screen's own keyboard: saying it twice is what made it drag
    if (this.session.spellWaysShown() || !this.session.once('spell_ways')) { await this.play(this.bus.gk('app_w_spell_go')); return; }
    this.pairNohand.set(true); await this.play(this.bus.gk('app_spell_intro')); await this.playSpot(this.bus.gk('app_spell_way_speak'), this.lb().head(), 'above');
    let pass!: () => void; const passP = new Promise<void>((r) => { pass = r; }); const stop = this.typeDemo(word.toUpperCase().split('').slice(0, 5), () => pass());
    try { await Promise.all([this.play(this.bus.gk('app_spell_way_tap')), passP]); } finally { stop(); }
    await this.playSpot('app_yn_hint_no', this.dk().slate(), 'above'); await this.playSpot('app_press_allo', this.dk().slate(), 'above'); this.pairNohand.set(false);
  }
  /** One place of the word: armed at once; the clips (kudos for the last letter, then "the next letter…") start after 0.5 s. */
  private async askLetter(word: string, idx: number, pre: Clip[] | null): Promise<{ ok: boolean; n: number }> {
    const L = word.charAt(idx), WU = word.toUpperCase(); let tries = 0; this.slotOn(idx); this.keyMarks.set({}); this.curLetter = L;
    const ordKey = this.bus.has('app_spell_ord_' + (idx + 1)) ? 'app_spell_ord_' + (idx + 1) : this.bus.gk('s_say_it');
    this.later(500, (pre || []).concat([ordKey]));
    const wrong = async (heard: string | null): Promise<{ ok: boolean; n: number } | null> => {
      tries++; this.fb('bad', heard ? '“' + heard + '”' : 'Sake'); if (heard && this.kb().keyEl(heard)) this.mark(heard, 'bad');
      if (tries >= 3) { this.mark(L, 'good'); this.speak.set(true); await this.seq([this.bus.gk('app_remind'), 'app_en_' + L]); this.speak.set(false); this.fly(this.kb().keyEl(L), idx, L); return { ok: false, n: 1 }; }
      this.later(350, ['app_retry', 'app_en_' + L]); return null;
    };
    for (;;) {
      this.check(); this.fb('wait', 'Danna harafi, ko ' + this.KA() + ' faɗa wa Laila.'); const e = await this.waitEv(); this.check();
      if (e.kind === 'dk') { this.clearBad(); this.mark(L, 'hot'); this.speak.set(true); await this.seq(['s_sp_is_' + Math.min(idx + 1, 9), 'app_en_' + L, 's_sp_press']); this.speak.set(false); continue; }
      if (e.kind === 'tap') { if (e.L === L) { this.mark(L, 'good'); this.fly(this.kb().keyEl(L), idx, L); return { ok: true, n: 1 }; } const r = await wrong(e.L); if (r) return r; continue; }
      const ls = (e.letters || []).map((x) => String(x).toUpperCase()); if (!ls.length) { this.fb('wait', 'Ban ji harafi ba — sake.'); continue; }
      let n = 0; while (n < ls.length && idx + n < WU.length && ls[n] === WU.charAt(idx + n)) n++;   // only letters count, in order
      if ((n < ls.length && idx + n < WU.length) || n === 0) { const r = await wrong(n === 0 ? ls[0] : ls[n]); if (r) return r; continue; }   // a burst with a wrong letter anywhere is one miss and fills nothing: “D A” is wrong, “D O” fills two (Sani 2026-09-13)
      if (n >= 2) { this.speak.set(true); await this.play(this.bus.gk('s_r_wow')); this.speak.set(false); for (let j = 0; j < n; j++) { this.slotOn(idx + j); await this.fly(this.lb().head(), idx + j, word.charAt(idx + j)); await wait(150); } return { ok: true, n }; }   // ≥2 in one go → "Kai! Ka iya sosai!" first
      this.fly(this.lb().head(), idx, L); return { ok: true, n: 1 };
    }
  }
  private async spellWord(it: Item): Promise<boolean> {
    const word = it.en; this.curWord = word; this.buildSlots(word); this.showPic(it); this.kbLocked.set(false); this.dkHidden.set(false); let misses = 0;
    this.speak.set(true); await this.seq(['app_wannan', this.ha(it), 's_o_inen', this.en(it)]); this.speak.set(false);
    await this.spellOut(word); await this.ways(word);
    let pre: Clip[] | null = null;
    for (let i = 0; i < word.length;) { const r = await this.askLetter(word, i, pre); if (!r.ok) misses++; i += r.n; pre = r.ok && r.n >= 2 ? null : ['app_kudos']; }
    this.curLetter = null; this.fb('good', word + ' ✓'); if (pre) await this.seq(pre); return misses === 0;
  }
  // ---- the test: the whole word freely; checked only when complete; two tries (three for words longer than four letters) ----
  private async examWord(it: Item, maxTries: number, pre: Clip[] | null): Promise<boolean> {
    const word = it.en; this.curWord = word; this.curLetter = null; this.buildSlots(word); this.showPic(it); this.kbLocked.set(false); this.dkHidden.set(true); let tries = 0, typed: string[] = [];
    const render = () => this.slots.set(word.split('').map((L, i) => ({ L, text: typed[i] || '_', st: i === typed.length ? 'on' : '' })));
    const put = (L: string) => { if (typed.length >= word.length) return; typed.push(L); render(); };
    render(); this.later(500, (pre || []).concat([this.ha(it), this.bus.gk('app_w_spell_go')]), true);
    for (;;) {
      this.check(); this.fb('wait', ''); const e = await this.waitEv(); this.check();
      if (e.kind === 'tap') { if (!typed.length) render(); put(e.L); } else if (e.kind === 'heard') { if (!typed.length) render(); (e.letters || []).forEach((L) => put(String(L).toUpperCase())); }
      if (typed.length < word.length) continue;
      await wait(250);
      if (typed.join('') === word) { this.slots.update((a) => a.map((x) => ({ ...x, st: 'done' }))); this.fb('good', word + ' ✓'); return true; }
      tries++; this.slots.update((a) => a.map((x) => ({ ...x, st: 'bad' }))); this.fb('bad', typed.join(''));
      if (tries >= maxTries) { await wait(700); return false; }
      typed = []; this.speak.set(true); await this.play('app_retry'); this.speak.set(false); render();
    }
  }
  // ---- results: the right ones are named in English only; the missed ones are shown (they come back first) ----
  private async showResults(right: Item[], wrongs: Item[]): Promise<void> {
    this.eye.set(this.def().ha + ' · rubutu · sakamako'); this.showPic(null); this.slots.set([]); this.kbLocked.set(true); this.dkHidden.set(true);
    this.resultItems.set(right.concat(wrongs)); this.resultMiss.set(wrongs.map((w) => w.k)); this.resultsOn.set(true);
    await afterPaint();
    if (right.length) { await this.play(this.bus.gk('s_o_right')); await this.nameEach(right, (k) => this.saying.set(k), (it) => this.play(this.en(it))); }
    if (wrongs.length) { await this.play('s_o_wrong'); await this.nameEach(wrongs, (k) => this.saying.set(k), () => wait(550)); }
    this.resultsOn.set(false); this.resultItems.set([]); this.kbLocked.set(false); await wait(400);
  }
  /** Sets of five: teach five → test those five → results; the missed ones come back first in the next five. */
  private async runSets(list: Item[]): Promise<void> {
    const queue = list.slice(), passed: Item[] = []; let carry: Item[] = [], setNo = 0; const maxTries = (w: Item) => w.en.length <= 4 ? 2 : 3; const name = this.def().ha;
    for (;;) {
      this.check(); const set = carry.slice(); carry = []; while (set.length < 5 && queue.length) set.push(queue.shift()!);
      if (set.length && set.length < 5) { const pool = shuffle(passed.filter((it) => !set.includes(it))); while (set.length < 5 && pool.length) set.push(pool.shift()!); }
      if (!set.length) return; setNo++;
      if (setNo > 1) { this.speak.set(true); await this.play('s_o_new3'); this.speak.set(false); }
      for (let i = 0; i < set.length; i++) { this.eye.set(name + ' · rubutu · ' + set[i].en.toLowerCase() + ' · ' + (i + 1) + ' / ' + set.length); await this.spellWord(set[i]); await wait(200); }
      const r: Item[] = [], w: Item[] = []; this.eye.set(name + ' · rubutu · gwaji'); this.speak.set(true); await this.play('app_w_spell_test'); this.speak.set(false);
      const order = shuffle(set); let pre: Clip[] | null = null;
      for (let i = 0; i < order.length; i++) { this.eye.set(name + ' · rubutu · gwaji · ' + (i + 1) + ' / ' + order.length); const ok = await this.examWord(order[i], maxTries(order[i]), pre); (ok ? r : w).push(order[i]); await wait(200); pre = ok ? ['app_kudos'] : null; }
      if (pre) await this.seq(pre);
      r.forEach((it) => { if (!passed.includes(it)) passed.push(it); }); await this.showResults(r, w); carry = w; await wait(400);
    }
  }
  protected async start(key: string): Promise<void> {
    this.WORDS = this.poolByLength(this.def()); this.clear();
    // the word the example already spelled counts as the first one done and is not set again (Sani 2026-09-20)
    const ex = this.session.takeExample('rubutu');
    if (ex) this.WORDS = this.WORDS.filter((w) => String(w.en).toUpperCase() !== ex.toUpperCase());
    await firstHints(this.bus, this.session, this.spotter, this.s, null); await this.runSets(this.WORDS); await this.play(this.bus.gk('app_stage_done'));
  }
  protected clear(): void { this.stopMic(); this.clearTimer(); this.pend = null; this.awaiting = false; this.curLetter = null; this.slots.set([]); this.fb('', ''); this.showPic(null); this.resultsOn.set(false); this.resultItems.set([]); this.keyMarks.set({}); this.s.querySelectorAll('.spothand.typing').forEach((x) => x.remove()); this.kbLocked.set(false); this.dkHidden.set(false); this.armed.set(false); this.rec.set(false); this.speak.set(false); this.pairNohand.set(false); }
  protected earInLesson(): void { if (this.curLetter) this.play('app_en_' + this.curLetter).catch(() => undefined); else this.play('app_act_desc_spell').catch(() => undefined); }
}
