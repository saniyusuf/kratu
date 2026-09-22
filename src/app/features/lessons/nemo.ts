import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { afterPaint } from '../../shared/paint';
import { Door, Ear } from '../../shared/chrome/chrome';
import { Clip, Item } from '../../shared/lesson/lesson-base';
import { TopicLessonBase } from '../../shared/lesson/topic-lesson-base';
import { TopicMenu } from '../../shared/lesson/topic-menu';
import { ResultsGrid } from '../../shared/lesson/results-grid';
import { shuffle, wait } from '../../shared/lesson/helpers';

const QUIZ_CATS = [{ key: 'q4', ha: 'Hotuna huɗu', ico: 'q4', c: 'var(--blue)', n: 4 }, { key: 'qnum', ha: 'Lambobi', ico: 'qnum', c: 'var(--green)', n: 6, set: 'lambobi_symbols' }];

/**
 * Screen 14 · Nemo hoto. Hear the name, tap the picture: four photos, or six number signs. One wrong tap is forgiven,
 * the second fails it. Ten a block, then the recap; the missed ones open the next ten.
 */
@Component({
  selector: 'app-nemo',
  imports: [Door, Ear, TopicMenu, ResultsGrid],
  host: { class: 's lesson quiz' },
  template: `
<app-door (pressed)="door()" /><app-ear (pressed)="ear()" /><div class="eyebrow">{{ eye() }}</div>
<div class="splanding" [hidden]="inLesson()"><app-topic-menu [cats]="cats" [few]="true" goClass="q-go" [picked]="cat()" [cue]="cue()" [nohand]="nohand()" (choose)="choose($event)" (go)="go()" /></div>
<div class="qlesson" [hidden]="!inLesson()">
  <div #show class="objshow" [class.off]="!resultsOn()" [hidden]="!resultsOn()"><span class="kimg objpic"></span><app-results [on]="resultsOn()" [items]="resultItems()" [miss]="resultMiss()" [saying]="saying()" /></div>
  <div [class]="'qgrid n' + n()">
    @for (c of choices(); track c.k) {<button type="button" [attr.data-k]="c.k" (click)="tap(c.k)"><img alt="" [src]="c.w.img">@if (masks()[c.k]; as m) {<div [class]="'qmask ' + m">{{ m === 'good' ? '✓' : '✗' }}</div>}</button>}
    @for (p of placeholders(); track $index) {<div class="qph"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"><rect x="6" y="8" width="36" height="32" rx="6"/><circle cx="17" cy="18" r="3.5"/><path d="M8 36l11-11 7 7 6-6 8 8"/></svg></div>}
  </div>
  <div class="objrow" [class.many]="dots().length > 5">@for (d of dots(); track $index) {<span class="oslot active" [class.on]="dotOn() === $index" [class.done]="d === 'done'" [class.miss]="d === 'miss'"></span>}</div>
  <div class="fb" [class]="'fb ' + fbCls()">{{ fbText() }}</div>
</div>`,
})
export class NemoScreen extends TopicLessonBase {
  readonly cats = QUIZ_CATS;
  protected readonly lesson = 'nemo'; protected readonly title = 'Nemo hoto'; protected readonly introKey = 'app_act_desc_quiz'; protected readonly descPrefix = 's_qd_';
  private readonly showRef = viewChild.required<ElementRef<HTMLElement>>('show');
  private readonly results = viewChild.required(ResultsGrid);
  readonly n = signal(4); readonly choices = signal<Item[]>([]); readonly placeholders = signal<number[]>([]); readonly masks = signal<Record<string, 'good' | 'bad'>>({});
  readonly dots = signal<('' | 'done' | 'miss')[]>([]); readonly dotOn = signal(-1);
  readonly resultsOn = signal(false); readonly resultItems = signal<Item[]>([]); readonly resultMiss = signal<string[]>([]); readonly saying = signal('');
  private pool: Item[] = []; private seen: string[] = []; private right: Item[] = []; private wrongs: Item[] = [];
  private tapRes: ((k: string) => void) | null = null; private curItem: Item | null = null;

  private get qdef() { return QUIZ_CATS.find((x) => x.key === this.cat()) || QUIZ_CATS[0]; }
  private get N(): number { return this.qdef.n ?? 4; }
  /** The pool: every word round-robin across the groups (so four pictures never look alike); numbers = the signs, tens, hundreds. */
  private loadPool(): void {
    this.pool = []; this.seen = []; const have = new Set<string>(); const add = (c: string, w: any) => { if (!have.has(w.k)) { have.add(w.k); this.pool.push(this.item(w, c)); } };
    if (this.qdef.set) { ['lambobi_symbols', 'lambobi_tens', 'lambobi_hundreds'].forEach((c) => this.words.list(c).forEach((w) => add(c, w))); return; }
    const cats = Object.keys(this.words.cats()).filter((c) => !/^lambobi|^numbers/.test(c)), lists = cats.map((c) => this.words.list(c).slice());
    for (let any = true; any;) { any = false; lists.forEach((l, i) => { if (l.length) { add(cats[i], l.shift()!); any = true; } }); }
  }
  private sameAs(a: Item, b: Item): boolean { return a.k === b.k || a.w.img === b.w.img || a.en.toLowerCase() === b.en.toLowerCase(); }
  private distractors(target: Item, n: number): Item[] {
    const out: Item[] = [], used: Record<string, 1> = { [target.cat!]: 1 }; const sh = shuffle(this.pool.filter((x) => !this.sameAs(x, target))); const clash = (x: Item) => out.some((y) => this.sameAs(x, y));
    sh.forEach((x) => { if (out.length < n && !used[x.cat!] && !clash(x)) { out.push(x); used[x.cat!] = 1; } }); sh.forEach((x) => { if (out.length < n && !clash(x)) out.push(x); }); return out;
  }
  private nextTen(prevWrong: Item[], cap = 10): Item[] {
    const items = prevWrong.slice(), fresh = this.pool.filter((x) => !this.seen.includes(x.k) && !items.includes(x)); while (items.length < cap && fresh.length) items.push(fresh.shift()!);
    if (items.length < cap) { const passed = shuffle(this.pool.filter((x) => this.seen.includes(x.k) && !items.includes(x))); while (items.length < cap && passed.length) items.push(passed.shift()!); }
    items.forEach((x) => { if (!this.seen.includes(x.k)) this.seen.push(x.k); }); return shuffle(items);
  }
  private tapKey(): string { return this.qdef.set ? 's_qn_tap' : 'app_quiz_tap'; }
  tap(k: string): void { const r = this.tapRes; if (r) { this.tapRes = null; r(k); } }

  /** One puzzle: the name, N pictures, tap. The grid is live at once; an early tap cuts Laila off and counts. */
  private async puzzle(it: Item, idx: number): Promise<void> {
    const N = this.N; this.curItem = it; this.choices.set(shuffle([it].concat(this.distractors(it, N - 1)))); this.placeholders.set([]); this.masks.set({}); this.dotOn.set(idx); this.fb('', '');
    let ask: Clip[] = [this.en(it), this.tapKey()];
    for (let tries = 0; ;) {
      this.check(); const tapP = new Promise<string>((res) => { this.tapRes = res; });   // live before Laila speaks: a tap cuts her off and counts
      this.seq(ask).then((ok) => { if (ok) this.fb('wait', this.qdef.set ? 'Danna alamar lambar da aka faɗa.' : 'Danna hoton abin da aka faɗa.'); }).catch(() => undefined);
      const k = await tapP; this.bus.stopAll(); this.check();
      if (k === it.k) { this.masks.update((m) => ({ ...m, [k]: 'good' })); this.dotOn.set(-1); this.dots.update((d) => d.map((x, i) => i === idx ? 'done' : x)); this.right.push(it); this.fb('good', 'Madalla! ✓'); await this.play('app_kudos'); await wait(400); return; }
      tries++; this.masks.update((m) => ({ ...m, [k]: 'bad' }));
      if (tries < 2) { this.fb('bad', '✗'); ask = ['app_quiz_wrong', this.en(it), this.tapKey()]; continue; }   // "A'a, ba wannan ba…" then the name again; the grid stays live
      this.wrongs.push(it); this.dotOn.set(-1); this.dots.update((d) => d.map((x, i) => i === idx ? 'miss' : x)); this.masks.update((m) => ({ ...m, [it.k]: 'good' })); this.fb('wait', it.en);
      await this.seq([this.bus.gk('s_o_miss'), 's_o_inen', this.en(it), 's_o_next']); await wait(400); return;
    }
  }
  private async recap(): Promise<void> {
    this.eye.set(this.qdef.ha + ' · sakamako'); this.choices.set([]); this.placeholders.set([]); this.resultItems.set(this.right.concat(this.wrongs)); this.resultMiss.set(this.wrongs.map((w) => w.k)); this.resultsOn.set(true);
    await afterPaint();
    if (this.right.length) { await this.play(this.bus.gk('s_o_right')); await this.nameEach(this.right, (k) => this.saying.set(k), (it) => this.play(this.ha(it))); }
    if (this.wrongs.length) { await this.play('s_o_wrong'); await this.nameEach(this.wrongs, (k) => this.saying.set(k), (it) => this.seq([this.ha(it), 's_o_inen', this.en(it)])); }
    this.resultsOn.set(false); this.resultItems.set([]); await wait(400);
  }
  /** `preDone` is the one the example already got right: its dot starts filled and the round asks the rest. */
  private async runTen(items: Item[], first: boolean, preDone = 0): Promise<void> {
    this.right = []; this.wrongs = [];
    this.dots.set((Array.from({ length: preDone }, () => 'done') as ('' | 'done' | 'miss')[]).concat(items.map(() => '')));
    this.placeholders.set(Array.from({ length: this.N }, (_, i) => i)); this.choices.set([]); this.eye.set(this.qdef.ha + ' · wasa · ' + (items.length + preDone));
    // after the example, one line that says what is about to happen: four pictures, listen for the English name, press it
    await this.play(first ? this.bus.gk(this.qdef.set ? 's_qn_start' : 's_q_start') : this.bus.gk('s_q_again'));
    for (let i = 0; i < items.length; i++) await this.puzzle(items[i], i + preDone);
    this.curItem = null; await this.recap();
  }
  protected async start(): Promise<void> {
    this.loadPool(); this.n.set(this.N); let first = true, prev: Item[] = [];
    // whatever the example already got right is not asked again: the first round is one short and starts a dot ahead
    const done = this.session.takeExample(this.qdef.set ? 'nemonum' : 'nemo'); let pre = 0;
    if (done && this.pool.some((x) => x.k === done)) { this.pool = this.pool.filter((x) => x.k !== done); pre = 1; }
    for (;;) { this.check(); const items = this.nextTen(prev, 10 - pre); if (!items.length) break; await this.runTen(items, first, pre); pre = 0; first = false; prev = this.wrongs.slice(); if (!prev.length && !this.pool.some((x) => !this.seen.includes(x.k))) break; }
    await this.play(this.bus.gk('app_stage_done'));
  }
  protected clear(): void { this.tapRes = null; this.curItem = null; this.choices.set([]); this.placeholders.set([]); this.masks.set({}); this.dots.set([]); this.fb('', ''); this.resultsOn.set(false); this.resultItems.set([]); }
  protected earInLesson(): void { const it = this.curItem; if (it) this.seq([this.en(it), this.tapKey()]).catch(() => undefined); }
}
