import { Component, ElementRef, OnDestroy, OnInit, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { afterPaint } from '../../shared/paint';
import { AudioBus } from '../../core/audio/audio-bus.service';
import { SpeechService } from '../../core/speech/speech.service';
import { SessionService } from '../../core/state/session.service';
import { ZoomService } from '../../core/zoom/zoom.service';
import { Door, Ear } from '../../shared/chrome/chrome';
import { LailaButton } from '../../shared/laila/laila-button';
import { Spotter, firstHints, flyText, wait } from '../../shared/lesson/helpers';
import { ALL, LETTER_COLOR } from '../../shared/lesson/letters';

const YAY = 'assets/audio/sfx/yay.ogg';
/**
 * One press, one entry. Inside it the child may try twice; a second wrong letter ends the entry as wrong rather than
 * letting them guess their way to the answer (Sani 2026-09-24). Laila only says the letter herself after HELP failed
 * entries — being told the answer is teaching, and it should not arrive the moment a child guesses twice.
 */
const WRONG = 2, HELP = 3;
const GROUPS: string[][] = []; for (let g = 0; g < 26; g += 4) GROUPS.push(ALL.slice(g, g + 4));
const shuffle = <T,>(a: T[]) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/**
 * Screens 6–9 · Koyo, the learning path. Four letters at a time: Laila shows them, teaches each (the child says it back),
 * recalls them in order, then scattered; a small check at 8 and 16 letters; two finals for A–Z. Missed letters get help after three tries.
 */
@Component({
  selector: 'app-haruffa-learn',
  imports: [Door, Ear, LailaButton],
  host: { class: 's lesson learn', '[class.hearing]': 'rec() || armed()' },
  template: `
<app-door (pressed)="leave()" /><app-ear (pressed)="ear()" /><div class="eyebrow">{{ eye() }}</div>
<div class="abcshow" [class.off]="!big()"><span class="abcbig" [style.--c]="bigColor()">{{ big() }}</span></div>
<div #slots class="abcslots">@for (L of all; track L) {<span class="aslot" [attr.data-l]="L" [style.--c]="color($index)" [class.active]="active()[$index]" [class.on]="st()[$index] === 'on'" [class.done]="st()[$index] === 'done'" [class.bad]="st()[$index] === 'bad'">{{ st()[$index] === 'done' ? L : '' }}</span>}</div>
<div class="fb" [class]="'fb ' + fbCls()">{{ fbText() }}</div>
<div class="yesno ynpair abcq lone"><app-laila-btn #lb label="Laila" [size]="132" [cue]="cue()" [armed]="armed()" [rec]="rec()" [speak]="speak()" [yay]="yay()" [prep]="speech.preparing()" [amp]="speech.amp()" (pressed)="lailaPressed()" /></div>`,
})
export class HaruffaLearnScreen implements OnInit, OnDestroy {
  readonly speech = inject(SpeechService);
  private readonly bus = inject(AudioBus);
  private readonly session = inject(SessionService);
  private readonly zoom = inject(ZoomService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly lb = viewChild.required<LailaButton>('lb');
  private readonly slotsRef = viewChild.required<ElementRef<HTMLElement>>('slots');
  readonly all = ALL; readonly color = LETTER_COLOR;
  readonly eye = signal('Haruffa · koyo · rukuni 1');
  readonly st = signal<('' | 'on' | 'done' | 'bad')[]>(ALL.map(() => '')); readonly active = signal<boolean[]>(ALL.map(() => false));
  readonly big = signal(''); readonly bigColor = signal('var(--red)');
  readonly fbCls = signal(''); readonly fbText = signal('');
  readonly cue = signal(false); readonly armed = signal(false); readonly rec = signal(false); readonly speak = signal(false); readonly yay = signal(false);
  private spotter!: Spotter; private running = false; private awaiting = false; private cur: { L: string; res: (v: { ok: boolean; heard: string | null; tries: number }) => void } | null = null;
  private hinted = false; private hearHandle: { stop(): void } | null = null; private stopped = false;

  ngOnInit(): void { this.spotter = new Spotter(this.host.nativeElement, this.zoom); const q = this.route.snapshot.queryParamMap; const from = +(q.get('from') || 0); afterPaint().then(() => this.start(from, from === 0 && q.get('intro') !== '0')); }
  ngOnDestroy(): void { this.stopped = true; this.bus.stopAll(); this.hearHandle?.stop(); this.spotter?.unspot(); }

  private idx(L: string): number { return ALL.indexOf(L); }
  private slot(L: string): HTMLElement { return this.slotsRef().nativeElement.children[this.idx(L)] as HTMLElement; }
  private setSt(L: string, v: '' | 'on' | 'done' | 'bad'): void { const i = this.idx(L); this.st.update((a) => a.map((x, k) => k === i ? v : x)); }
  private showLetter(L: string): void { this.big.set(L); this.bigColor.set(LETTER_COLOR(this.idx(L))); this.st.update((a) => a.map((x, k) => k === this.idx(L) ? 'on' : (x === 'on' ? '' : x))); }
  private hideLetter(): void { this.big.set(''); this.st.update((a) => a.map((x) => x === 'on' ? '' : x)); }
  private markActive(list: string[]): void { this.active.set(ALL.map((L) => list.includes(L))); }
  private unfill(list: string[]): void { list.forEach((L) => this.setSt(L, '')); }
  private fill(L: string): void { this.setSt(L, 'done'); }
  private fb(cls: string, t: string): void { this.fbCls.set(cls); this.fbText.set(t); }
  private KA(): string { return this.session.g() === 'f' ? 'ki' : 'ka'; }
  private reset(): void { this.st.set(ALL.map(() => '')); this.fb('', ''); this.armed.set(false); this.cue.set(false); this.rec.set(false); this.speak.set(false); this.awaiting = false; this.cur = null; this.hideLetter(); this.spotter.unspot(); }
  private setDoneUpTo(n: number): void { this.st.update((a) => a.map((x, k) => k < n ? 'done' : x)); }
  private async play(k: string): Promise<boolean> { return this.stopped ? false : this.bus.play(k); }
  /** Right answer: the kalangu sounds and Laila hops, while the letter flies to its place. */
  private celebrate(): void {
    this.bus.playRaw(YAY).catch(() => undefined);
    this.yay.set(true); setTimeout(() => this.yay.set(false), 760);
  }
  private async seq(ks: string[]): Promise<boolean> { for (const k of ks) if (!(await this.play(k))) return false; return true; }
  private async playIntro(k: string): Promise<void> { await this.play(k); if (!this.hinted) { this.hinted = true; await firstHints(this.bus, this.session, this.spotter, this.host.nativeElement, null); } }

  // ---- the child speaks: Laila armed → pressed → listening → result ----
  private arm(L: string): Promise<{ ok: boolean; heard: string | null; tries: number }> { return new Promise((res) => { this.awaiting = true; this.cur = { L, res }; this.armed.set(true); this.fb('wait', 'Danna kan Laila, ' + this.KA() + ' faɗi harafin.'); }); }
  private async press(): Promise<void> {
    if (!this.awaiting || !this.cur) return; this.awaiting = false; this.armed.set(false); const c = this.cur; this.bus.stopAll(); this.spotter.unspot(); if (this.st()[this.idx(c.L)] === 'bad') this.setSt(c.L, 'on');
    // as many tries as the child likes: the microphone closes on the right letter, or when the time runs out
    this.rec.set(true); const h = this.speech.hear({ target: c.L, until: c.L, maxWrong: WRONG }); this.hearHandle = h; const r = await h.done; this.hearHandle = null; this.rec.set(false);
    c.res({ ok: r.value === c.L, heard: (r.value as string | null) || r.wrong || null, tries: r.tries || 0 });
  }
  /** The letter is on the board; prompt, then the child says it. Three wrong → help: "listen, this is …" + the letter, then ask again. */
  private async askSay(L: string, prompt: string[], noKudos = false): Promise<void> {
    let misses = 0, helped = 0; this.showLetter(L);
    for (;;) {
      if (this.stopped) return;
      if (prompt.length) { const p = prompt; prompt = []; const armP = this.arm(L); const said = this.seq(p); const r = await Promise.race([armP.then((x) => ({ r: x })), said.then(() => null)]); if (r) { if (await this.judge(L, r.r, noKudos, (n) => (misses += n))) return; continue; } const rr = await armP; if (await this.judge(L, rr, noKudos, (n) => (misses += n))) return; }
      else { const r = await this.arm(L); if (await this.judge(L, r, noKudos, (n) => (misses += n))) return; }
      // two wrong letters since the last help, however they arrived — both in one breath or one at a time
      if (misses - helped >= HELP) { helped = misses; await this.play('app_retry'); this.speak.set(true); await this.seq([this.bus.gk('app_remind'), 'app_en_' + L]); this.speak.set(false); this.setSt(L, 'on'); }
      else { await this.play('app_retry'); this.setSt(L, 'on'); }
    }
  }
  private async judge(L: string, r: { ok: boolean; heard: string | null; tries: number }, noKudos: boolean, miss: (n: number) => void): Promise<boolean> {
    if (r.ok) { this.celebrate(); await flyText(this.zoom, this.host.nativeElement, this.lb().head(), this.slot(L), L); this.fill(L); this.fb('good', 'Madalla! ✓'); if (noKudos) await wait(350); else await this.play('app_kudos'); return true; }
    miss(1);   // one failed entry is one miss, however many tries it held
    this.setSt(L, 'bad'); this.fb('bad', r.heard ? ('Wannan ' + r.heard + ' ne — sake gwadawa.') : 'Ban ji ba — sake gwadawa.'); return false;
  }
  // ---- the four steps of a group ----
  private async present(group: string[]): Promise<void> { for (const L of group) { if (this.stopped) return; this.showLetter(L); this.speak.set(true); await this.seq(['app_wannan', 'app_en_' + L]); this.speak.set(false); await wait(500); } this.hideLetter(); }
  /**
   * A letter the child already said correctly in the example is not taught again: it is shown as done and the group
   * starts at the next one. They still meet it in the recall, where remembering it is the point (Sani 2026-09-18).
   */
  private exampleLetter: string | null = null;
  private async teach(group: string[]): Promise<void> {
    this.exampleLetter = this.exampleLetter ?? this.session.takeExample('haruffa');
    for (const L of group) {
      if (this.stopped) return;
      if (L === this.exampleLetter) { this.setSt(L, 'done'); continue; }
      this.showLetter(L); this.speak.set(true); await this.seq(['app_wannan', 'app_en_' + L]); this.speak.set(false);
      await this.askSay(L, [this.bus.gk('s_abc_say')]); await wait(400);
    }
  }
  private async recall(list: string[], lastNoKudos = false): Promise<void> { for (let i = 0; i < list.length; i++) { if (this.stopped) return; await this.askSay(list[i], [this.bus.gk('s_abc_say')], lastNoKudos && i === list.length - 1); await wait(400); } }
  private async runGroup(gi: number): Promise<void> {
    const group = GROUPS[gi]; this.markActive(group); this.unfill(group); this.eye.set('Haruffa · koyo · rukuni ' + (gi + 1));
    await this.playIntro(gi === 0 ? this.bus.gk('s_l_look') : this.bus.gk(group.length < 4 ? 's_l_new2' : 's_l_new4'));
    await this.present(group); await this.teach(group);
    // whatever the example already got right is done: this group neither teaches nor recalls it again. The checkpoints
    // and the two A–Z finals still include it, because those test the whole alphabet (Sani 2026-09-20).
    const rest = group.filter((L) => L !== this.exampleLetter);
    await this.play(this.bus.gk('s_l_recall')); this.unfill(group); await this.recall(rest);
    await this.play('app_scatter_intro'); this.unfill(group); await this.recall(shuffle(rest), true);
    const learned = Math.min(26, (gi + 1) * 4); this.hideLetter(); await this.play(this.bus.gk('app_stage_done'));
    if (learned < 26 && learned % 8 === 0) await this.checkpoint(learned);
  }
  private async checkpoint(n: number): Promise<void> { const list = ALL.slice(0, n); this.markActive(list); this.unfill(list); this.eye.set('Ƙaramin jarrabawa · ' + n + ' haruffa'); await this.play(this.bus.gk('s_l_check')); await this.recall(shuffle(list)); this.hideLetter(); await wait(400); }
  private async finals(): Promise<void> {
    this.markActive(ALL); this.unfill(ALL); this.eye.set('Babbar jarrabawa · A → Z'); await this.play(this.bus.gk('s_l_final1')); await this.recall(ALL); this.hideLetter(); this.unfill(ALL);
    this.eye.set('Jarrabawa ta ƙarshe · a gauraye'); await this.play(this.bus.gk('s_l_final2')); await this.recall(shuffle(ALL), true); this.hideLetter(); this.fb('good', '✓ A – Z'); await this.play(this.bus.gk('s_all_done'));
  }
  private async start(fromGroup: number, intro = false): Promise<void> {
    this.running = true; this.hinted = false; this.reset(); this.setDoneUpTo(fromGroup * 4);
    if (intro) { await this.play('app_board_intro'); if (this.stopped) return; }   // said here, not on the screen that sent them (Sani 2026-09-21)
    for (let gi = fromGroup; gi < GROUPS.length; gi++) { if (this.stopped) return; await this.runGroup(gi); }
    if (this.stopped) return; await this.finals(); this.running = false; this.router.navigate(['/home']);
  }
  lailaPressed(): void { if (this.awaiting) { this.press(); return; } if (this.running) return; this.bus.stopAll(); this.start(0); }
  async ear(): Promise<void> { this.bus.stopAll(); if (this.cur?.L) { this.speak.set(true); await this.seq(['app_wannan', 'app_en_' + this.cur.L]); this.speak.set(false); } else await this.play(this.bus.gk('s_l_look')); }
  leave(): void { this.stopped = true; this.bus.stopAll(); this.hearHandle?.stop(); this.router.navigate(['/home']); }
}
