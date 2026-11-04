import { Component, ElementRef, OnDestroy, OnInit, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { afterPaint } from '../../shared/paint';
import { AudioBus } from '../../core/audio/audio-bus.service';
import { SpeechService } from '../../core/speech/speech.service';
import { SessionService } from '../../core/state/session.service';
import { ProgressService } from '../../core/state/progress.service';
import { ZoomService } from '../../core/zoom/zoom.service';
import { CourseService } from '../../core/state/course.service';
import { Door, Ear } from '../../shared/chrome/chrome';
import { LailaButton } from '../../shared/laila/laila-button';
import { Spotter, firstHints, flyText, joy, shakeNo, wait } from '../../shared/lesson/helpers';
import { ALL, LETTER_COLOR } from '../../shared/lesson/letters';

/**
 * One press, one entry. Inside it the child may try twice; a second wrong letter ends the entry as wrong rather than
 * letting them guess their way to the answer (Sani 2026-09-24). Laila only says the letter herself after HELP failed
 * entries — being told the answer is teaching, and it should not arrive the moment a child guesses twice. After GIVE
 * she writes it in and moves on, so no child is ever stuck on one letter.
 */
/**
 * Three wrong answers before Laila steps in, not two: a child saying a letter into a cheap tablet microphone in a noisy
 * room deserves a third go before being told the answer (Sani 2026-10-04).
 */
const WRONG = 3, HELP = 3, GIVE = 5;
const GROUPS: string[][] = []; for (let g = 0; g < 26; g += 4) GROUPS.push(ALL.slice(g, g + 4));
const shuffle = <T,>(a: T[]) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/**
 * Screens 6–9 · Koyo, the learning path. Four letters at a time: Laila shows them, teaches each (the child says it back),
 * recalls them in order, then scattered; a small check at 8 and 16 letters; two finals for A–Z. Missed letters get help after three tries.
 */
/** The in-between game, by letters learned: the Durbar, always mixed up — the balloons already check A to Z in order
    (Sani 2026-10-17, 24 Oct; the lanterns retired 22 Oct — they checked the same thing). */
const BETWEEN: Record<number, string> = { 12: 'j-durbar', 20: 'j-durbar' };

@Component({
  selector: 'app-haruffa-learn',
  imports: [Door, Ear, LailaButton],
  host: { class: 's lesson learn', '[class.hearing]': 'rec() || armed()' },
  template: `
<app-door (pressed)="leave()" /><app-ear (pressed)="ear()" /><div class="eyebrow">{{ eye() }}</div>
<div class="abcshow" [class.off]="!big()"><span class="abcbig" [style.--c]="bigColor()">{{ big() }}</span></div>
<div #slots class="abcslots">@for (L of all; track L) {<span class="aslot" [attr.data-l]="L" [style.--c]="color($index)" [class.active]="active()[$index]" [class.on]="st()[$index] === 'on'" [class.done]="st()[$index] === 'done'" [class.bad]="st()[$index] === 'bad'">{{ st()[$index] === 'done' ? L : '' }}</span>}</div>
<div class="fb" [class]="'fb ' + fbCls()">{{ fbText() }}</div>
<div class="yesno ynpair abcq lone"><app-laila-btn #lb label="Laila" [size]="132" [cue]="cue()" [armed]="armed()" [rec]="rec()" [speak]="speak()" [yay]="yay()" [nope]="nope()" [prep]="speech.preparing()" [amp]="speech.amp()" (pressed)="lailaPressed()" /></div>`,
})
export class HaruffaLearnScreen implements OnInit, OnDestroy {
  readonly speech = inject(SpeechService);
  private readonly bus = inject(AudioBus);
  private readonly session = inject(SessionService);
  private readonly progress = inject(ProgressService);
  private readonly zoom = inject(ZoomService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly course = inject(CourseService);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly lb = viewChild.required<LailaButton>('lb');
  private readonly slotsRef = viewChild.required<ElementRef<HTMLElement>>('slots');
  readonly all = ALL; readonly color = LETTER_COLOR;
  readonly eye = signal('Haruffa · koyo · rukuni 1');
  readonly st = signal<('' | 'on' | 'done' | 'bad')[]>(ALL.map(() => '')); readonly active = signal<boolean[]>(ALL.map(() => false));
  readonly big = signal(''); readonly bigColor = signal('var(--red)');
  readonly fbCls = signal(''); readonly fbText = signal('');
  readonly cue = signal(false); readonly armed = signal(false); readonly rec = signal(false); readonly speak = signal(false); readonly yay = signal(false); readonly nope = signal(false);
  private spotter!: Spotter; private running = false; private awaiting = false; private cur: { L: string; res: (v: { ok: boolean; heard: string | null; tries: number }) => void } | null = null;
  private hinted = false; private hearHandle: { stop(): void } | null = null; private stopped = false;

  /** Opened without a starting point (the tile): the first letter group not yet finished, so a child never relearns
   *  what the balloons or the lessons have already proved. All of it finished: from A again, as a review. */
  /** The letter to start at, from the balloons: earlier letters of its group are already known (Sani 2026-10-22). */
  private startAt = 0;
  private resumeAt(): number { for (let g = 0; g < GROUPS.length; g++) if (!this.progress.has('haruffa', 'g' + g)) return g; return 0; }
  ngOnInit(): void {
    this.spotter = new Spotter(this.host.nativeElement, this.zoom); const q = this.route.snapshot.queryParamMap;
    // a course step (?letters=ABCD&done=n), or the letters a course game found missing (?letters=…&back=the game)
    const only = (q.get('letters') || '').toUpperCase().split('').filter((L) => ALL.includes(L));
    if (only.length && (q.get('done') || q.get('back'))) { afterPaint().then(() => this.courseLetters(only)); return; }
    const fromL = (q.get('fromL') || '').toUpperCase(); this.startAt = Math.max(0, ALL.indexOf(fromL)); const from = fromL ? Math.floor(this.startAt / 4) : q.get('from') !== null ? +(q.get('from') || 0) : this.resumeAt(); afterPaint().then(() => this.start(from, from === 0 && q.get('intro') !== '0')); }
  ngOnDestroy(): void { this.stopped = true; this.stopAuto(); this.bus.stopAll(); this.hearHandle?.stop(); this.spotter?.unspot(); }

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
  private reset(): void { this.stopAuto(); this.autoOn = false; this.st.set(ALL.map(() => '')); this.fb('', ''); this.armed.set(false); this.cue.set(false); this.rec.set(false); this.speak.set(false); this.awaiting = false; this.cur = null; this.hideLetter(); this.spotter.unspot(); }
  private setDoneUpTo(n: number): void { this.st.update((a) => a.map((x, k) => k < n ? 'done' : x)); }
  /** A press on Laila while she talks (Sani 2026-10-12): it cuts her off, the lines up to the next question are
   *  skipped, and she listens there. It lapses after a few seconds so nothing is left silent. */
  private earlyUntil = 0;
  private hurrying(): boolean { return performance.now() < this.earlyUntil; }
  private async play(k: string): Promise<boolean> { if (this.stopped) return false; if (this.hurrying()) return true; const ok = await this.bus.play(k); return ok || this.hurrying(); }
  /** Right answer: the kalangu sounds and Laila hops, while the letter flies to its place. */
  private celebrate(): Promise<boolean> { return joy(this.bus, this.yay); }
  /**
   * Teaching voice: every letter is said twice, with a beat between, because once goes past a child who is still
   * settling into the screen (Sani 2026-09-24). The second time is introduced too — "Wannan shi ne A. Ka saurara,
   * wannan shi ne A" — never the bare letter twice over. Only teaching repeats; the child's own turn is unchanged.
   */
  private async sayLetter(intro: string, L: string): Promise<void> {
    const again = intro.startsWith('app_remind') ? 'app_wannan' : this.bus.gk('app_remind');
    this.speak.set(true);
    if (await this.seq([intro, 'app_en_' + L])) { await wait(300); await this.seq([again, 'app_en_' + L]); }
    this.speak.set(false);
  }
  private async seq(ks: string[]): Promise<boolean> { for (const k of ks) if (!(await this.play(k))) return false; return true; }
  private async playIntro(k: string): Promise<void> { await this.play(k); if (!this.hinted) { this.hinted = true; await firstHints(this.bus, this.session, this.spotter, this.host.nativeElement, null); } }

  // ---- the child speaks: Laila armed → pressed → listening → result ----
  /**
   * After the child has pressed Laila once, every letter after it opens the microphone by itself as soon as she stops
   * talking. Pressing her head before each of twenty-six letters is the thing children found most tiring, and the press
   * taught them nothing after the first time. She is still there to press whenever they want to hear it again
   * (Sani 2026-10-04).
   */
  private autoOn = false; private autoT: ReturnType<typeof setTimeout> | null = null;
  private arm(L: string): Promise<{ ok: boolean; heard: string | null; tries: number }> {
    return new Promise((res) => {
      this.awaiting = true; this.cur = { L, res }; this.armed.set(true);
      if (this.hurrying()) { this.earlyUntil = 0; setTimeout(() => this.press()); }
      this.fb('wait', this.autoOn ? (this.KA() === 'ka' ? 'Ka faɗi harafin.' : 'Ki faɗi harafin.') : 'Danna kan Laila, ' + this.KA() + ' faɗi harafin.');
      if (this.autoOn) this.listenSoon();
    });
  }
  /** Open the microphone the moment Laila goes quiet, so her own voice never reaches it. */
  private listenSoon(): void {
    if (this.autoT) clearTimeout(this.autoT);
    const tick = () => {
      this.autoT = null;
      if (!this.awaiting || this.stopped) return;
      // 'timeupdate' refreshes lastSound about four times a second while a clip runs, so the quiet window has to
      // clear that interval comfortably — and the engine's own playing flag settles it either way.
      if (!this.bus.engine.playing() && Date.now() - this.bus.engine.lastSound >= 450) { this.press(); return; }
      this.autoT = setTimeout(tick, 140);
    };
    this.autoT = setTimeout(tick, 450);
  }
  private stopAuto(): void { if (this.autoT) { clearTimeout(this.autoT); this.autoT = null; } }
  private async press(): Promise<void> {
    if (!this.awaiting || !this.cur) return; this.awaiting = false; this.armed.set(false); this.stopAuto(); this.autoOn = true; const c = this.cur; this.bus.stopAll(); this.spotter.unspot(); if (this.st()[this.idx(c.L)] === 'bad') this.setSt(c.L, 'on');
    // as many tries as the child likes: the microphone closes on the right letter, or when the time runs out
    this.rec.set(true);
    const h = this.speech.hear({ target: c.L, until: c.L, maxWrong: WRONG }); this.hearHandle = h; const r = await h.done; this.hearHandle = null; this.rec.set(false);
    c.res({ ok: r.value === c.L, heard: (r.value as string | null) || r.wrong || null, tries: r.tries || 0 });
  }
  /** The letter is on the board; prompt, then the child says it. Three wrong → help: "listen, this is …" + the letter, then ask again. */
  private async askSay(L: string, prompt: string[], noKudos = false): Promise<void> {
    let misses = 0, helped = 0; this.showLetter(L);
    for (;;) {
      if (this.stopped) return;
      if (prompt.length) { const p = prompt; prompt = []; const armP = this.arm(L); const said = this.seq(p); const r = await Promise.race([armP.then((x) => ({ r: x })), said.then(() => null)]); if (r) { if (await this.judge(L, r.r, noKudos, (n) => (misses += n))) return; continue; } const rr = await armP; if (await this.judge(L, rr, noKudos, (n) => (misses += n))) return; }
      else { const r = await this.arm(L); if (await this.judge(L, r, noKudos, (n) => (misses += n))) return; }
      // HELP failed entries: Laila says the letter herself, as a lesson rather than a buzzer
      if (misses - helped >= HELP) { helped = misses; await this.play('app_retry'); await this.sayLetter(this.bus.gk('app_remind'), L); this.setSt(L, 'on'); }
      else { await this.play('app_retry'); this.setSt(L, 'on'); }
      // GIVE failed entries: she writes it in and the group moves on. Nothing here ever ends a child's turn, so a letter
      // the microphone cannot hear from this child — F and S sound alike to it — would otherwise hold them forever
      // (Sani 2026-09-24, found running A–Z). It counts as missed, so the recall and the scatter ask again.
      if (misses >= GIVE) {
        await this.sayLetter(this.bus.gk('app_remind'), L);
        await flyText(this.zoom, this.host.nativeElement, this.lb().head(), this.slot(L), L); this.fill(L);
        this.fb('wait', L + ' ✓'); await wait(500); return;
      }
    }
  }
  private async judge(L: string, r: { ok: boolean; heard: string | null; tries: number }, noKudos: boolean, miss: (n: number) => void): Promise<boolean> {
    // the drum and the letter fly together, but "Madalla" waits for the drum to finish: starting both at once let
    // them cut each other off (Sani 2026-09-28)
    if (r.ok) {
      const cel = this.celebrate();
      await flyText(this.zoom, this.host.nativeElement, this.lb().head(), this.slot(L), L); this.fill(L); this.fb('good', 'Madalla! ✓');
      await cel;
      if (noKudos) await wait(350); else await this.play('app_kudos');
      return true;
    }
    miss(1);   // one failed entry is one miss, however many tries it held
    shakeNo(this.nope); this.setSt(L, 'bad'); this.fb('bad', r.heard ? ('Wannan ' + r.heard + ' ne — sake gwadawa.') : 'Ban ji ba — sake gwadawa.'); return false;
  }
  // ---- the four steps of a group ----
  private async present(group: string[]): Promise<void> { for (const L of group) { if (this.stopped) return; this.showLetter(L); await this.sayLetter('app_wannan', L); await wait(500); } this.hideLetter(); }
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
      this.showLetter(L); await this.sayLetter('app_wannan', L);
      await this.askSay(L, [this.bus.gk('s_abc_say')]); await wait(400);
    }
  }
  private async recall(list: string[], lastNoKudos = false): Promise<void> { for (let i = 0; i < list.length; i++) { if (this.stopped) return; await this.askSay(list[i], [this.bus.gk('s_abc_say')], lastNoKudos && i === list.length - 1); await wait(400); } }
  /** One group: shown, taught, recalled in order, then mixed up. */
  private async teachGroup(group: string[], gi: number): Promise<void> {
    this.markActive(group); this.unfill(group); this.eye.set('Haruffa · koyo · rukuni ' + (gi + 1));
    await this.playIntro(gi === 0 ? this.bus.gk('s_l_look') : this.bus.gk(group.length < 4 ? 's_l_new2' : 's_l_new4'));
    await this.present(group); await this.teach(group);
    // whatever the example already got right is done: this group neither teaches nor recalls it again. The checkpoints
    // and the two A–Z finals still include it, because those test the whole alphabet (Sani 2026-09-20).
    const rest = group.filter((L) => L !== this.exampleLetter);
    await this.play(this.bus.gk('s_l_recall')); this.unfill(group); await this.recall(rest);
    await this.play('app_scatter_intro'); this.unfill(group); await this.recall(shuffle(rest), true);
  }
  /**
   * A course step's letters, or a course game's missed ones (Sani 2026-11-04): only those, in the app's groups of four
   * (a step of U–Z is U V W X, then Y Z), and then the course goes on, or back to the game that sent them.
   */
  private async courseLetters(list: string[]): Promise<void> {
    const q = this.route.snapshot.queryParamMap, done = q.get('done'), back = q.get('back'), at = Math.min(...list.map((L) => ALL.indexOf(L)));
    this.running = true; this.hinted = false; this.reset(); this.setDoneUpTo(done ? at : 0);
    if (done && at === 0) { await this.play('app_board_intro'); if (this.stopped) return; }
    for (let gi = 0; gi < GROUPS.length; gi++) {
      const group = GROUPS[gi].filter((L) => list.includes(L)); if (!group.length) continue; if (this.stopped) return;
      if (back) { this.markActive(group); this.unfill(group); this.eye.set('Mu sake · ' + group.join(' ')); await this.teach(group); this.hideLetter(); await wait(400); continue; }
      await this.teachGroup(group, gi); if (this.stopped) return; this.hideLetter(); this.progress.mark('haruffa', 'g' + gi);
    }
    if (this.stopped) return; await this.play(this.bus.gk('app_stage_done')); this.running = false; if (this.stopped) return; this.stopped = true; this.bus.stopAll();
    if (done) {
      const nx = this.course.finish(+done);
      if (nx) { const rt = this.course.route(nx); await this.router.navigateByUrl('/blank', { skipLocationChange: true }); this.router.navigate(['/' + rt.path], { queryParams: rt.query }); return; }
    }
    this.router.navigateByUrl(back && back.startsWith('/') ? back : '/home');
  }
  private async runGroup(gi: number): Promise<void> {
    const group = GROUPS[gi].filter((L) => ALL.indexOf(L) >= this.startAt);
    await this.teachGroup(group, gi);
    const learned = Math.min(26, (gi + 1) * 4); this.hideLetter(); await this.play(this.bus.gk('app_stage_done')); this.progress.mark('haruffa', 'g' + gi);
    if (learned === 8 || learned === 16 || learned === 24) await this.checkpoint(learned);
    // at twelve and at twenty letters the Durbar, mixed up, with only the letters learned so far;
    // the spoken checks stay at 8, 16 and 24. The balloons wait for the whole alphabet (Sani 2026-10-17, 22 Oct).
    const game = BETWEEN[learned];
    if (game && !this.stopped) {
      await this.play(this.bus.gk('s_l_game')); if (this.stopped) return;
      this.stopped = true; this.bus.stopAll();
      this.router.navigate(['/wasanni', game], { queryParams: { letters: ALL.slice(0, learned).join(''), next: '/haruffa/koyo?from=' + (gi + 1) + '&intro=0' } });
    }
  }
  private async checkpoint(n: number): Promise<void> { const list = ALL.slice(0, n); this.markActive(list); this.unfill(list); this.eye.set('Ƙaramin jarrabawa · ' + n + ' haruffa'); await this.play(this.bus.gk('s_l_check')); await this.recall(shuffle(list)); this.hideLetter(); await wait(400); }
  private async finals(): Promise<void> {
    this.markActive(ALL); this.unfill(ALL); this.eye.set('Babbar jarrabawa · A → Z'); await this.play(this.bus.gk('s_l_final1')); await this.recall(ALL); this.hideLetter(); this.unfill(ALL);
    this.eye.set('Jarrabawa ta ƙarshe · a gauraye'); await this.play(this.bus.gk('s_l_final2')); await this.recall(shuffle(ALL), true); this.hideLetter(); this.fb('good', '✓ A – Z'); await this.play(this.bus.gk('s_all_done')); this.progress.mark('haruffa', 'final');
  }
  private async start(fromGroup: number, intro = false): Promise<void> {
    this.running = true; this.hinted = false; this.reset(); this.setDoneUpTo(Math.max(fromGroup * 4, this.startAt));
    if (intro) { await this.play('app_board_intro'); if (this.stopped) return; }   // said here, not on the screen that sent them (Sani 2026-09-21)
    // letters the in-between game showed they could not say are taught again before the next group (Sani 2026-10-21)
    const again = (this.route.snapshot.queryParamMap.get('again') || '').toUpperCase().replace(/[^A-Z]/g, '').split('').filter(Boolean);
    if (again.length) { this.markActive(again); this.unfill(again); this.eye.set('Mu sake · ' + again.join(' ')); await this.teach(again); if (this.stopped) return; this.hideLetter(); await wait(400); }
    for (let gi = fromGroup; gi < GROUPS.length; gi++) { if (this.stopped) return; await this.runGroup(gi); }
    if (this.stopped) return; await this.finals(); this.running = false;
    this.router.navigate(['/fashe']);   // the whole alphabet learned: now the balloons, the A–Z game (Sani 2026-10-17)
  }
  lailaPressed(): void { if (this.awaiting) { this.press(); return; } if (this.running) { if (!this.rec()) { this.earlyUntil = performance.now() + 6000; this.bus.stopAll(); this.spotter.unspot(); } return; } this.bus.stopAll(); this.start(0); }
  async ear(): Promise<void> { this.bus.stopAll(); if (this.cur?.L) { await this.sayLetter('app_wannan', this.cur.L); } else await this.play(this.bus.gk('s_l_look')); }
  leave(): void { this.stopped = true; this.bus.stopAll(); this.hearHandle?.stop(); this.router.navigate(['/home']); }
}
