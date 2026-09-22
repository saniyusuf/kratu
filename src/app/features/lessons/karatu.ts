import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { afterPaint } from '../../shared/paint';
import { Door, Ear } from '../../shared/chrome/chrome';
import { HearHandle } from '../../core/speech/speech.service';
import { LailaButton } from '../../shared/laila/laila-button';
import { Item } from '../../shared/lesson/lesson-base';
import { TopicLessonBase } from '../../shared/lesson/topic-lesson-base';
import { TopicMenu } from '../../shared/lesson/topic-menu';
import { ResultsGrid } from '../../shared/lesson/results-grid';
import { firstHints, flyText, matchWord, shuffle, wait } from '../../shared/lesson/helpers';

const READ_CATS = [
  { key: 'k3', ha: 'Kalmomi gajeru', ico: 'k3', c: 'var(--red)', min: 3, max: 3 }, { key: 'k45', ha: 'Kalmomi matsakaita', ico: 'k45', c: 'var(--blue)', min: 4, max: 5 },
  { key: 'klong', ha: 'Kalmomi dogaye', ico: 'klong', c: 'var(--purple)', min: 6, max: 99 }, { key: 'knum', ha: 'Lambobi', ico: 'knum', c: 'var(--green)', set: 'numbers' },
];
type Slot = { L: string; st: '' | 'on' | 'done' };

/**
 * Screen 15 · Karatu, reading. Blocks of five: the word in its places, the letters lit as Laila reads them, then the child
 * reads the whole word to Laila and the picture is the reward. The test of the five, the results; the missed ones are
 * re-taught and tested again until all five are right.
 */
@Component({
  selector: 'app-karatu',
  imports: [Door, Ear, TopicMenu, ResultsGrid, LailaButton],
  host: { class: 's lesson read karatu', '[class.hearing]': 'rec() || armed()' },
  template: `
<app-door (pressed)="door()" /><app-ear (pressed)="ear()" /><div class="eyebrow">{{ eye() }}</div>
<div class="splanding" [hidden]="inLesson()"><app-topic-menu [cats]="cats" [few]="true" [picked]="cat()" [cue]="cue()" [nohand]="nohand()" (choose)="choose($event)" (go)="go()" /></div>
<div class="splesson" [hidden]="!inLesson()">
  <div #show class="objshow" [class.off]="!picSrc() && !resultsOn()"><span class="kimg objpic">@if (picSrc()) {<img #pic alt="" [src]="picSrc()">}</span><app-results [on]="resultsOn()" [items]="resultItems()" [miss]="resultMiss()" [saying]="saying()" /></div>
  <div class="wslots">@for (sl of slots(); track $index) {<span class="wslot show" [class.on]="sl.st === 'on'" [class.done]="sl.st === 'done'">{{ sl.L }}</span>}</div>
  <div class="fb" [class]="'fb ' + fbCls()">{{ fbText() }}</div>
  <div class="yesno ynpair spq"><app-laila-btn #lb label="Karanta" [size]="96" [armed]="armed()" [rec]="rec()" [speak]="speak()" [prep]="speech.preparing()" [amp]="speech.amp()" (pressed)="lailaPressed()" /></div>
</div>`,
})
export class KaratuScreen extends TopicLessonBase {
  readonly cats = READ_CATS;
  protected readonly lesson = 'karatu'; protected readonly title = 'Karatu'; protected readonly introKey = 's_k_intro2'; protected readonly descPrefix = 's_kd_';
  private readonly showRef = viewChild.required<ElementRef<HTMLElement>>('show');
  private readonly lb = viewChild.required(LailaButton);
  private readonly results = viewChild.required(ResultsGrid);
  readonly picSrc = signal<string | null>(null); readonly slots = signal<Slot[]>([]);
  readonly armed = signal(false); readonly rec = signal(false); readonly speak = signal(false);
  readonly resultsOn = signal(false); readonly resultItems = signal<Item[]>([]); readonly resultMiss = signal<string[]>([]); readonly saying = signal('');
  private WORDS: Item[] = []; private curWord: Item | null = null; private firstWord = true; private needLaila = true;
  private awaiting = false; private pend: ((r: { got: string | null; raw: string }) => void) | null = null; private hearHandle: HearHandle | null = null; private round = 0;

  private mkSlots(word: string): void { this.slots.set(word.split('').map((L) => ({ L, st: '' }))); }
  private setAll(st: Slot['st']): void { this.slots.update((a) => a.map((x) => ({ ...x, st }))); }
  /** Each letter lights as Laila says it. */
  private async walk(word: string): Promise<void> {
    this.speak.set(true);
    for (let i = 0; i < word.length; i++) { this.slots.update((a) => a.map((x, k) => ({ ...x, st: k === i ? 'on' : k < i ? 'done' : '' }))); if (!(await this.play('app_en_' + word.charAt(i)))) break; await wait(280); }
    this.speak.set(false);
  }
  private waitAnswer(): Promise<{ got: string | null; raw: string }> { this.awaiting = true; this.armed.set(true); this.fb('wait', 'Danna kan Laila, ' + this.KA() + ' karanta kalmar.'); return new Promise((res) => { this.pend = res; }); }
  private stopMic(): void { this.round++; this.hearHandle?.stop(); this.hearHandle = null; this.rec.set(false); }
  lailaPressed(): void {
    if (!this.awaiting || this.hearHandle) return; const it = this.curWord; if (!it) return; this.bus.stopAll(); this.spotter.unspot(); this.speak.set(false); this.armed.set(false); this.rec.set(true);
    const word = it.en.toLowerCase(), my = ++this.round, h = this.speech.hear({ target: word, match: (raw) => matchWord(raw, word) }); this.hearHandle = h;
    h.done.then((r) => { if (my !== this.round || this.hearHandle !== h) return; this.hearHandle = null; this.rec.set(false); const p = this.pend; this.pend = null; this.awaiting = false; p?.({ got: (r.value as string | null), raw: r.raw }); });
  }
  protected override onLeave(): void { this.stopMic(); this.pend = null; }

  /** One word: (lesson) the letters lit as Laila reads them → "now read the whole word" → the child reads → the photo is the reward. */
  private async readWord(it: Item, testMode: boolean): Promise<boolean> {
    const word = it.en; this.curWord = it; this.picSrc.set(null); this.mkSlots(word); let tries = 0;
    if (!testMode) { if (this.firstWord) { this.firstWord = false; this.speak.set(true); await this.play('app_read_intro'); this.speak.set(false); } await this.walk(word); }
    this.setAll('');
    const first = this.waitAnswer();   // armed at once: a press cuts the clips off
    this.play('app_read_word').then(async (ok) => { if (ok && this.needLaila && !testMode) { this.needLaila = false; await this.playSpot('app_z_speak', this.lb().head(), 'above'); } }).catch(() => undefined);
    let r = await first;
    for (;;) {
      this.check();
      if (r.got) {
        await flyText(this.zoom, this.s, this.lb().head(), this.showRef().nativeElement, word); this.setAll('done'); this.picSrc.set(it.w.img || null); await afterPaint(); this.reveal();
        this.fb('good', '✓ ' + word); this.speak.set(true); await this.play(this.bus.gk('app_read_good')); this.speak.set(false); return true;   // "Madalla! Ka iya karatu!" (no extra kudos: never two Madalla)
      }
      tries++; this.fb('bad', r.raw && r.raw !== '?' ? '“' + r.raw + '”' : 'Sake gwadawa'); this.speak.set(true);
      if (tries >= 3) { if (!testMode) await this.seq([this.bus.gk('app_remind'), this.en(it)]); this.speak.set(false); return false; }
      const next = this.waitAnswer(); this.seq(testMode ? ['app_retry'] : ['app_retry', this.en(it)]).then(() => this.speak.set(false)).catch(() => undefined); r = await next;
    }
  }
  private reveal(): void { const im = this.showRef().nativeElement.querySelector('img'); if (!im) return; try { const an = im.animate([{ clipPath: 'inset(0 100% 0 0 round 30px)', transform: 'scale(.96)' }, { clipPath: 'inset(0 0 0 0 round 30px)', transform: 'scale(1)' }], { duration: 900, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }); const fin = () => { try { an.cancel(); } catch { /* gone */ } }; an.onfinish = fin; setTimeout(fin, 1300); } catch { /* no animations */ } }
  private async showResults(right: Item[], wrongs: Item[]): Promise<void> {
    this.eye.set(this.def().ha + ' · karatu · sakamako'); this.picSrc.set(null); this.slots.set([]); this.resultItems.set(right.concat(wrongs)); this.resultMiss.set(wrongs.map((w) => w.k)); this.resultsOn.set(true);
    await afterPaint();
    const say = (it: Item) => this.seq([this.ha(it), 's_o_inen', this.en(it)]);
    if (right.length) { await this.play(this.bus.gk('s_o_right')); await this.nameEach(right, (k) => this.saying.set(k), say); }
    if (wrongs.length) { await this.play('s_o_wrong'); await this.nameEach(wrongs, (k) => this.saying.set(k), say); }
    this.resultsOn.set(false); this.resultItems.set([]); await wait(400);
  }
  /** A block of five: lesson → test → results → all right, or the missed ones re-taught and tested again. */
  private async runBlock(list: Item[], last: boolean): Promise<void> {
    const name = this.def().ha;
    const lessonOn = async (items: Item[]) => { for (let i = 0; i < items.length; i++) { this.eye.set(name + ' · karatu · ' + (i + 1) + ' / ' + items.length); await this.readWord(items[i], false); await wait(600); } };
    await lessonOn(list);
    for (;;) {
      this.check(); const right: Item[] = [], wrongs: Item[] = []; this.eye.set(name + ' · karatu · gwaji'); await this.play(this.bus.gk('s_k_test'));
      for (const it of shuffle(list)) { const ok = await this.readWord(it, true); (ok ? right : wrongs).push(it); await wait(600); }
      await this.showResults(right, wrongs);
      if (!wrongs.length) { if (!last) { this.speak.set(true); await this.play(this.bus.gk('s_o_allright')); this.speak.set(false); } return; }
      this.speak.set(true); await this.play(this.bus.gk('s_o_retake')); this.speak.set(false); await lessonOn(wrongs);
    }
  }
  protected async start(key: string): Promise<void> {
    this.WORDS = this.poolByLength(this.def()); this.clear();
    // the word the example already read is not read again: it counts as the first one done (Sani 2026-09-20)
    const ex = this.session.takeExample('karatu');
    if (ex) this.WORDS = this.WORDS.filter((w) => String(w.en).toUpperCase() !== ex.toUpperCase());
    const blocks: Item[][] = []; for (let i = 0; i < this.WORDS.length; i += 5) blocks.push(this.WORDS.slice(i, i + 5));
    await firstHints(this.bus, this.session, this.spotter, this.s, null);
    for (let b = 0; b < blocks.length; b++) await this.runBlock(blocks[b], b === blocks.length - 1);
    await this.play(this.bus.gk('app_stage_done'));
  }
  protected clear(): void { this.stopMic(); this.pend = null; this.awaiting = false; this.curWord = null; this.firstWord = true; this.needLaila = true; this.slots.set([]); this.fb('', ''); this.picSrc.set(null); this.resultsOn.set(false); this.resultItems.set([]); this.armed.set(false); this.rec.set(false); this.speak.set(false); }
  protected earInLesson(): void { const it = this.curWord; if (it && this.slots().length) this.walk(it.en).then(() => this.play('app_read_word')).catch(() => undefined); else this.play('s_k_lesson').catch(() => undefined); }
}
