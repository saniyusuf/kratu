import { Component, ElementRef, OnInit, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { afterPaint } from '../../shared/paint';
import { Door, Ear } from '../../shared/chrome/chrome';
import { LailaButton } from '../../shared/laila/laila-button';
import { AlloButton } from '../../shared/lesson/allo-button';
import { Item, LessonBase, Stopped } from '../../shared/lesson/lesson-base';
import { ResultsGrid } from '../../shared/lesson/results-grid';
import { firstHints, matchWord, shuffle, wait } from '../../shared/lesson/helpers';
import { CAT_NAME } from './cats';

type Mark = '' | 'done' | 'miss';
const STAGES = [
  { key: 'lambobi_palms', ha: 'yatsu', intro: 's_n_palms', blocks: [[0, 10]] }, { key: 'lambobi_symbols', ha: 'alamu 1–10', intro: 's_n_symbols', blocks: [[0, 10]] },
  { key: 'lambobi_symbols', ha: 'alamu 11–20', intro: 's_n_sym2', blocks: [[10, 20]] }, { key: 'lambobi_tens', ha: 'manyan lambobi', intro: 's_n_tens', blocks: [[0, 8]] }, { key: 'lambobi_hundreds', ha: 'ɗaruruwa', intro: 's_n_hundreds', blocks: [[0, 9]] },
];
/**
 * Screens 11 and 13 · Abubuwa and Lambobi, one engine, two modes. One picture at a time: Hausa, English twice, then the child says it.
 * After five, a quiet test of those five (three tries, never the answer), then the results slider; the missed ones come back first
 * in the next five, always five. Numbers add the five stages (fingers, symbols, tens, hundreds) and the big test of fifteen with re-teaching.
 */
@Component({
  selector: 'app-obj-lesson',
  imports: [Door, Ear, LailaButton, AlloButton, ResultsGrid],
  host: { class: 's lesson word obj', '[class.lambobi]': "mode === 'numbers'", '[class.hearing]': 'rec() || armed()', '[class.presenting]': 'presenting()' },
  template: `
<app-door (pressed)="leave()" /><app-ear (pressed)="ear()" /><div class="eyebrow">{{ eye() }}</div>
<div #show class="objshow" [class.off]="!picSrc() && !resultsOn()"><span class="kimg objpic">@if (picSrc()) {<img alt="" [src]="picSrc()">}</span><app-results [on]="resultsOn()" [items]="resultItems()" [miss]="resultMiss()" [saying]="saying()" /></div>
<div class="objrow" [class.many]="rowItems().length > 5">@for (it of rowItems(); track it.k) {<span class="oslot active" [class.on]="onItem() === it.k" [class.done]="marks()[it.k] === 'done'" [class.miss]="marks()[it.k] === 'miss'" [attr.data-item]="it.k"></span>}</div>
<div class="fb" [class]="'fb ' + fbCls()">{{ fbText() }}</div>
<div class="yesno ynpair objq" [hidden]="resultsOn()" [class.nohand]="nohand()">
  <app-laila-btn #lb label="Faɗa" [size]="112" [cue]="cue()" [armed]="armed()" [rec]="rec()" [speak]="speak()" [prep]="speech.preparing()" [amp]="speech.amp()" (pressed)="lailaPressed()" />
  <app-allo-btn #dk (pressed)="pressDk()" />
</div>`,
})
export class ObjLessonScreen extends LessonBase implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly lb = viewChild.required<LailaButton>('lb');
  private readonly dk = viewChild.required(AlloButton);
  private readonly showRef = viewChild.required<ElementRef<HTMLElement>>('show');
  private readonly resultsGrid = viewChild.required(ResultsGrid);
  readonly mode: 'words' | 'numbers' = this.route.snapshot.data['mode'] || 'words';

  readonly picSrc = signal<string | null>(null); readonly presenting = signal(false);
  readonly rowItems = signal<Item[]>([]); readonly marks = signal<Record<string, Mark>>({}); readonly onItem = signal('');
  readonly resultsOn = signal(false); readonly resultItems = signal<Item[]>([]); readonly resultMiss = signal<string[]>([]); readonly saying = signal('');
  readonly nohand = signal(false);
  readonly cue = signal(false); readonly armed = signal(false); readonly rec = signal(false); readonly speak = signal(false);

  private items: Item[] = []; private cat = 'animals'; private stageHa = 'yatsu'; private big = false;
  private running = false; private inTest = false; private curItem: Item | null = null;
  private awaiting = false; private pend: { res: (r: { kind: 'say'; ok: boolean; heard: string | null } | { kind: 'dk' } | { kind: 'skip' }) => void } | null = null;
  private hearHandle: { stop(): void } | null = null;

  ngOnInit(): void { afterPaint().then(() => this.start().catch(() => undefined)); }
  protected override onLeave(): void { this.hearHandle?.stop(); }

  // ---- data ----
  private loadCat(c: string): void { this.cat = c; this.items = this.words.list(c).map((w) => ({ ...this.item(w, c), en: String(w.en).toLowerCase() })); this.rowItems.set([]); this.marks.set({}); }
  /** The line the categories screen used to say before it let go: this lesson's own opening (Sani 2026-09-21). */
  private catStart(c: string): string | null { return this.bus.has('app_cat_start_' + c) ? 'app_cat_start_' + c : this.bus.has('s_cat_start_' + c) ? 's_cat_start_' + c : null; }
  private catName(): string { return this.mode === 'numbers' ? 'Lambobi · ' + this.stageHa : (CAT_NAME[this.cat] || this.cat); }
  private showPic(it: Item): void { this.curItem = it; this.picSrc.set(it.w.img || null); this.onItem.set(it.k); }
  private hidePic(): void { this.picSrc.set(null); this.onItem.set(''); }
  private markActive(list: Item[]): void { this.warm.soon(list.map((i) => i.w.img)); this.rowItems.set(list.slice()); this.marks.update((m) => { const n: Record<string, Mark> = {}; list.forEach((it) => { n[it.k] = m[it.k] || ''; }); return n; }); }
  private clearMarks(list: Item[]): void { this.marks.update((m) => { const n = { ...m }; list.forEach((it) => { n[it.k] = ''; }); return n; }); }
  private mark(it: Item, v: Mark): void { this.marks.update((m) => ({ ...m, [it.k]: v })); }
  private reset(): void { this.presenting.set(false); this.rowItems.set([]); this.marks.set({}); this.fb('', ''); this.armed.set(false); this.cue.set(false); this.rec.set(false); this.speak.set(false); this.nohand.set(false); this.resultsOn.set(false); this.awaiting = false; this.pend = null; this.inTest = false; this.hidePic(); this.spotter.unspot(); }
  /** "Wannan shi ne akuya" · "Da Turanci, shi ne:" goat · "Ka saurara kuma…" goat */
  private async say(it: Item): Promise<void> { this.speak.set(true); await this.seq(['app_wannan', this.ha(it), 's_o_inen', this.en(it), this.bus.gk('s_o_again2'), this.en(it)]); this.speak.set(false); }
  private async remind(it: Item): Promise<void> { this.speak.set(true); await this.seq([this.bus.gk('app_remind'), this.ha(it), 's_o_inen', this.en(it)]); this.speak.set(false); }

  // ---- the child answers: Laila armed (+ the allo = I don't know) → pressed → listening → result ----
  private arm(it: Item, skippable = false): Promise<{ kind: 'say'; ok: boolean; heard: string | null } | { kind: 'dk' } | { kind: 'skip' }> {
    return new Promise((res) => { this.awaiting = true; this.pend = { res }; this.armed.set(true); if (!skippable) this.fb('wait', 'Danna kan Laila, ' + this.KA() + ' faɗa da Turanci.'); (this.pend as any).it = it; (this.pend as any).skippable = skippable; });
  }
  private async press(): Promise<void> {
    if (!this.awaiting || !this.pend) return; const p = this.pend as any; this.awaiting = false; this.armed.set(false); this.bus.stopAll(); this.spotter.unspot(); this.nohand.set(false);
    if (p.skippable) { this.pend = null; p.res({ kind: 'skip' }); return; }
    const it: Item = p.it; this.rec.set(true); const h = this.speech.hear({ target: it.en, match: (raw) => matchWord(raw, it.en) }); this.hearHandle = h; const r = await h.done; this.hearHandle = null; this.rec.set(false);
    this.pend = null; p.res({ kind: 'say', ok: r.value === it.en, heard: r.raw || null });
  }
  pressDk(): void { if (!this.awaiting || !this.pend || (this.pend as any).skippable) return; const p = this.pend; this.awaiting = false; this.pend = null; this.armed.set(false); this.bus.stopAll(); this.spotter.unspot(); this.nohand.set(false); p.res({ kind: 'dk' }); }
  lailaPressed(): void { if (this.awaiting) { this.press(); return; } if (this.running) return; this.bus.stopAll(); this.start().catch(() => undefined); }
  /** practice: say it; 3 wrong in a row, or "ban sani ba" → listen once → ask again */
  private async askSay(it: Item, first: boolean): Promise<void> {
    let misses = 0; this.showPic(it);
    if (first) { const armP = this.arm(it); this.play(this.bus.gk('s_o_say')).catch(() => undefined); const r = await armP; if (await this.settlePractice(it, r, () => ++misses)) return; }
    for (;;) {
      this.check(); const r = await this.arm(it); if (await this.settlePractice(it, r, () => ++misses)) return;
      if (r.kind === 'dk') { misses = 0; }
    }
  }
  private async settlePractice(it: Item, r: { kind: 'say'; ok: boolean; heard: string | null } | { kind: 'dk' } | { kind: 'skip' }, miss: () => number): Promise<boolean> {
    if (r.kind === 'say' && r.ok) { this.mark(it, 'done'); this.fb('good', 'Madalla! ✓'); await this.play('app_kudos'); return true; }   // no written word here: naming the picture is the whole answer (Sani 2026-09-20)
    if (r.kind === 'dk') { this.fb('wait', 'Ba komai — ' + this.KA() + ' saurara.'); await this.remind(it); return false; }
    if (r.kind === 'say') { const m = miss(); this.fb('bad', r.heard ? ('“' + r.heard + '” — sake gwadawa.') : 'Ban ji ba — sake gwadawa.'); await this.play('app_retry'); if (m % 3 === 0) await this.remind(it); }
    return false;
  }
  private rowSlot(it: Item): Element | null { return this.s.querySelector('.oslot[data-item="' + it.k + '"]'); }

  // ---- teach five, then the quiet test, then the results ----
  private async teach(set: Item[], first: boolean, setNo: number): Promise<void> {
    this.markActive(set); this.clearMarks(set); this.eye.set(this.catName() + ' · koyo · saiti ' + setNo);
    for (let i = 0; i < set.length; i++) {
      this.check(); const it = set[i]; this.showPic(it);
      // the child may answer while Laila is still naming it: a press cuts her off and listens at once
      const skip = this.arm(it, true); await this.say(it);
      if (this.awaiting) { this.awaiting = false; this.pend = null; this.armed.set(false); } else { await skip; await this.askSay(it, false); await wait(400); continue; }
      if (first && i === 0) {
        this.nohand.set(true); this.spotter.spot(this.lb().head(), 'above'); await this.play(this.bus.gk('s_o_turn')); await this.play('app_yn_hint_no');
        this.spotter.spot(this.dk().slate(), 'above'); await this.play('app_press_allo'); this.spotter.unspot(); this.nohand.set(false);
        await firstHints(this.bus, this.session, this.spotter, this.s, null);
      }
      await this.askSay(it, !(first && i === 0)); await wait(400);
    }
  }
  private async quiz(set: Item[]): Promise<Item[]> {
    this.inTest = true; const order = shuffle(set), misses: Item[] = []; this.markActive(set); this.clearMarks(set); this.eye.set(this.catName() + ' · ƙaramin jarrabawa · ' + set.length);
    const skip = this.arm(set[0], true); this.nohand.set(true); this.spotter.spot(this.lb().head(), 'above');
    const explain = (async () => { await this.play(this.bus.gk('s_o_test2')); this.spotter.spot(this.dk().slate(), 'above'); await this.play('app_press_allo'); this.spotter.unspot(); this.nohand.set(false); await this.play(this.bus.gk('s_o_go')); })();
    await Promise.race([explain, skip]); if (this.awaiting) { this.awaiting = false; this.pend = null; this.armed.set(false); } this.spotter.unspot(); this.nohand.set(false);
    for (let i = 0; i < order.length; i++) {
      this.check(); const it = order[i]; this.showPic(it); const dot = set[i]; this.onItem.set(dot.k); let tries = 0;
      this.speak.set(true); await this.seq(['app_wannan', this.ha(it)]); this.speak.set(false);
      let ok = false;
      for (;;) { const r = await this.arm(it); if (r.kind === 'say' && r.ok) { ok = true; break; } if (r.kind === 'dk') break; tries++; if (tries >= 3) break; this.speak.set(true); await this.play('app_retry'); this.speak.set(false); }
      this.onItem.set(''); this.mark(dot, ok ? 'done' : 'miss'); if (!ok) misses.push(it); this.fb('', ''); await wait(500);
    }
    this.hidePic(); this.inTest = false; return misses;
  }
  private async showResults(right: Item[], wrongs: Item[]): Promise<void> {
    this.eye.set(this.catName() + ' · sakamako'); this.hidePic(); this.resultItems.set(right.concat(wrongs)); this.resultMiss.set(wrongs.map((w) => w.k)); this.resultsOn.set(true);
    await afterPaint();
    const name = async (list: Item[]) => { for (const it of list) { this.check(); this.saying.set(it.k); await this.seq([this.ha(it), 's_o_inen', this.en(it)]); await wait(350); } this.saying.set(''); };
    if (right.length) { await this.play(this.bus.gk('s_o_right')); await name(right); }
    if (wrongs.length) { await this.play('s_o_wrong'); await name(wrongs); }
    this.resultsOn.set(false); this.resultItems.set([]); await wait(400);
  }
  /** always five: the missed ones, then new ones, then passed ones to fill */
  private async runQueue(queue: Item[], firstEver: boolean, countingOrder: boolean): Promise<void> {
    let carry: Item[] = [], setNo = 0; const passed: Item[] = [];
    for (;;) {
      this.check(); let set = carry.slice(); carry = [];
      while (set.length < 5 && queue.length) set.push(queue.shift()!);
      if (set.length && set.length < 5) { const pool = countingOrder ? passed.filter((it) => !set.includes(it)).sort((a, b) => this.items.indexOf(a) - this.items.indexOf(b)) : shuffle(passed.filter((it) => !set.includes(it))); while (set.length < 5 && pool.length) set.push(pool.shift()!); }
      if (!set.length) return;
      if (!countingOrder) set = shuffle(set); setNo++; const first = firstEver && setNo === 1;
      if (this.mode === 'words') await this.play(first ? this.bus.gk('s_o_look') : 's_o_new3'); else if (setNo > 1) await this.play('s_o_new3');
      await this.teach(set, first, setNo);
      const misses = await this.quiz(set); const right = set.filter((it) => !misses.includes(it)); right.forEach((it) => { if (!passed.includes(it)) passed.push(it); });
      await this.showResults(right, misses); carry = misses; await wait(400);
    }
  }

  // ---- numbers: the stages and the big test ----
  private wrongs: Item[] = []; private right: Item[] = [];
  private async present(set: Item[]): Promise<void> { this.presenting.set(true); for (const it of set) { this.check(); this.showPic(it); await this.say(it); await wait(450); } this.hidePic(); this.presenting.set(false); }
  private async practice(set: Item[]): Promise<void> { for (const it of set) { this.check(); await this.askSay(it, true); await wait(400); } }
  private async test(list: Item[]): Promise<void> {
    this.inTest = true; this.right = []; this.wrongs = []; this.markActive(list); this.clearMarks(list); this.eye.set(this.catName() + (this.big ? '' : ' · ƙaramin jarrabawa') + ' · ' + list.length); const order = shuffle(list);
    this.nohand.set(true); this.spotter.spot(this.lb().head(), 'above'); await this.play(this.bus.gk(this.big ? 's_n_big' : 's_o_test2')); this.spotter.spot(this.dk().slate(), 'above'); await this.play('app_press_allo'); this.spotter.unspot(); this.nohand.set(false); await this.play(this.bus.gk('s_o_go'));
    for (let i = 0; i < order.length; i++) {
      this.check(); const it = order[i], dot = list[i]; let tries = 0; this.showPic(it); this.onItem.set(dot.k);
      this.speak.set(true); await this.seq(['app_wannan', this.ha(it)]); this.speak.set(false);
      const armP = this.arm(it); this.play(this.bus.gk('s_o_say')).catch(() => undefined); let r = await armP; let ok = false, why: 'three' | 'dk' = 'three';
      for (;;) { if (r.kind === 'say' && r.ok) { ok = true; break; } if (r.kind === 'dk') { why = 'dk'; break; } tries++; this.fb('bad', r.kind === 'say' && r.heard ? ('“' + r.heard + '”') : 'Ban ji ba'); if (tries >= 3) break; await this.play('app_retry'); r = await this.arm(it); }
      if (ok) { this.mark(dot, 'done'); this.right.push(it); this.fb('good', 'Madalla! ✓'); await this.play('app_kudos'); await wait(300); }
      else { this.mark(dot, 'miss'); this.wrongs.push(it); this.fb('wait', why === 'dk' ? 'Ban sani ba' : 'Sau uku'); this.speak.set(true); await this.seq([this.bus.gk(why === 'three' ? 's_o_three' : 's_o_miss'), 's_o_inen', this.en(it), 's_o_next']); this.speak.set(false); await wait(300); }
      this.onItem.set('');
    }
    this.hidePic(); this.inTest = false;
  }
  private async bigTest(): Promise<void> {
    const all: Item[] = []; ['lambobi_symbols', 'lambobi_tens', 'lambobi_hundreds'].forEach((c) => this.words.list(c).forEach((w) => all.push({ ...this.item(w, c), en: String(w.en).toLowerCase() })));
    this.items = shuffle(all).slice(0, 15); this.stageHa = 'babbar jarrabawa'; this.big = true; this.markActive(this.items);
    for (;;) {
      this.check(); await this.test(this.items); await this.showResults(this.right, this.wrongs);
      if (!this.wrongs.length) break;
      const failed = this.wrongs.slice(), pad = shuffle(this.right).slice(0, Math.max(0, 5 - failed.length)), list = failed.concat(pad);
      this.markActive(list); this.clearMarks(list); this.eye.set(this.catName() + ' · sake koyo'); this.speak.set(true); await this.play(this.bus.gk('s_o_retake')); await this.play(this.bus.gk(pad.length ? 's_n_focus5' : 's_o_focus')); this.speak.set(false);
      for (let i = 0; i < list.length; i += 5) { const ss = list.slice(i, i + 5); await this.present(ss); await this.practice(ss); }
      this.markActive(this.items);
    }
    this.big = false;
  }

  private async start(): Promise<void> {
    if (this.running) return; this.running = true; this.reset();
    this.eye.set(this.mode === 'numbers' ? 'Lambobi · yatsu · saiti 1 / 2' : (CAT_NAME[this.session.category() || 'animals'] || 'Dabbobi') + ' · koyo · saiti 1 / 12');   // the design's placeholder until the first set names it
    try {
      if (this.mode === 'words') {
        this.loadCat(this.session.category() || 'animals');
        const opening = this.catStart(this.cat); if (opening) await this.play(opening);
        // whatever the example already named counts as the first one done (Sani 2026-09-20)
        const ex = this.session.takeExample('abubuwa');
        await this.runQueue(this.items.slice().filter((it) => !ex || it.k !== ex), true, false);
      }
      else {
        let first = true;
        for (const st of STAGES) {
          this.check(); this.loadCat(st.key); this.stageHa = st.ha;
          if (first) { first = false; await this.play(this.bus.gk('s_n_intro')); } await this.play(this.bus.gk(st.intro));
          for (const [a, b] of st.blocks) await this.runQueue(this.items.slice(a, b), a === 0 && st.key === 'lambobi_palms', true);
        }
        this.hidePic(); await this.bigTest();
      }
      this.hidePic(); await this.play(this.bus.gk('app_stage_done')); this.running = false; this.router.navigate(['/home']);
    } catch (e) { if (!(e instanceof Stopped)) throw e; }
  }
  async ear(): Promise<void> { this.bus.stopAll(); if (this.curItem && this.picSrc()) { if (this.inTest) await this.play(this.bus.gk('s_o_say')); else await this.say(this.curItem); } else await this.play(this.bus.gk(this.mode === 'numbers' ? 's_n_intro' : 's_o_look')); }
  leave(): void { this.bus.stopAll(); this.router.navigate([this.mode === 'words' ? '/abubuwa' : '/home']); }
}
