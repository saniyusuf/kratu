import { Component, ElementRef, OnDestroy, OnInit, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { afterPaint } from '../../shared/paint';
import { AudioBus } from '../../core/audio/audio-bus.service';
import { PlanService } from '../../core/state/plan.service';
import { SessionService } from '../../core/state/session.service';
import { ZoomService } from '../../core/zoom/zoom.service';
import { Door, Ear } from '../../shared/chrome/chrome';
import { LailaButton } from '../../shared/laila/laila-button';
import { flyLetter, joy, shakeNo, shuffle, wait } from '../../shared/lesson/helpers';
import { ALL, LETTER_COLOR } from '../../shared/lesson/letters';

const NOPE = 'assets/audio/sfx/nope.ogg';
/** Twelve letters asked, eight in the sky, and four wrong pops on one letter ends it — that child is guessing (Sani 2026-09-24). */
const ASKED = 12, SKY = 8, GUESSES = 4;
/** A child who has not popped anything gets the letter said again, and is not left on it forever. */
const REPEAT_AT = 12000, MISS_AT = 26000;

interface Bub { id: number; L: string; lane: number; x: number; dur: number; in: number; state: '' | 'pop' | 'burst'; }

/**
 * Fashe haruffa · the placement game. Letters drift up in balloons and Laila asks for one: the child pops it with a
 * finger or with the keyboard. A right pop flies into its place in the A–Z strip; a wrong one bursts on a low note and
 * the skin falls back down to fill again, so nothing is lost and no round ends on a mistake.
 *
 * It decides where the child starts. A finger cannot be misheard, which is the whole reason this rung is not spoken:
 * the recogniser confuses T with C and F with S, and a bad listen must never send a child who knows the alphabet back
 * to A (Sani 2026-09-24).
 */
@Component({
  selector: 'app-fashe',
  imports: [Door, Ear, LailaButton],
  host: { class: 's lesson fashe' },
  template: `
<app-door (pressed)="leave()" /><app-ear (pressed)="again()" /><div class="eyebrow">{{ eye() }}</div>
<div #sky class="sky" (click)="tapped($event)">
  @for (b of bubs(); track b.id) {
    <button class="bub" [class.pop]="b.state === 'pop'" [class.burst]="b.state === 'burst'" [attr.data-b]="b.id" [attr.data-l]="b.L"
      [style.--c]="colour(b.L)" [style.--x.%]="b.x" [style.--dur.ms]="b.dur" [style.animation-delay.ms]="-b.in" [attr.aria-label]="b.L" (animationend)="ended(b, $event)">{{ b.L }}</button>
  }
</div>
<div #slots class="abcslots">@for (L of all; track L) {<span class="aslot" [style.--c]="colour(L)" [class.active]="true" [class.on]="target() === L" [class.done]="done()[$index]">{{ done()[$index] ? L : '' }}</span>}</div>
<div class="fb" [class]="'fb ' + fbCls()">{{ fbText() }}</div>
<div class="yesno ynpair abcq lone popask">
  <app-laila-btn #lb label="Laila" [size]="96" [speak]="speak()" [yay]="yay()" [nope]="nope()" (pressed)="again()" />
  <span class="ask" [class.bad]="bad()">{{ said() }} <b>{{ target() }}</b></span>
</div>`,
})
export class FasheScreen implements OnInit, OnDestroy {
  private readonly bus = inject(AudioBus);
  private readonly session = inject(SessionService);
  private readonly plan = inject(PlanService);
  private readonly zoom = inject(ZoomService);
  private readonly router = inject(Router);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly lb = viewChild.required<LailaButton>('lb');
  private readonly skyRef = viewChild.required<ElementRef<HTMLElement>>('sky');
  private readonly slotsRef = viewChild.required<ElementRef<HTMLElement>>('slots');
  readonly all = ALL;
  readonly eye = signal('Mu gani · fashe haruffa');
  readonly bubs = signal<Bub[]>([]);
  readonly done = signal<boolean[]>(ALL.map(() => false));
  readonly target = signal(''); readonly said = signal('');
  readonly fbCls = signal(''); readonly fbText = signal('');
  readonly speak = signal(false); readonly yay = signal(false); readonly nope = signal(false); readonly bad = signal(false);

  private seq = 0; private round = 0; private hits = 0; private wrong = 0; private roundWrong = 0;
  private targets: string[] = []; private answer: ((ok: boolean | null) => void) | null = null;
  private stopped = false; private timers: number[] = []; private ro?: ResizeObserver;
  private readonly onKey = (e: KeyboardEvent) => this.key(e);

  colour(L: string): string { return LETTER_COLOR(ALL.indexOf(L)); }

  ngOnInit(): void {
    document.addEventListener('keydown', this.onKey);
    afterPaint().then(() => { this.measure(); this.start(); });
  }
  ngOnDestroy(): void {
    this.stopped = true; this.bus.stopAll(); document.removeEventListener('keydown', this.onKey);
    this.timers.forEach((t) => clearTimeout(t)); this.ro?.disconnect(); this.answer?.(null);
  }

  /** The balloons rise by a measured distance rather than a guessed one, so they always clear the top of the sky. */
  private measure(): void {
    const el = this.skyRef().nativeElement;
    const set = () => el.style.setProperty('--travel', (el.clientHeight + 120) + 'px');
    set(); try { this.ro = new ResizeObserver(set); this.ro.observe(el); } catch { /* older webviews keep the first measure */ }
  }
  private slot(L: string): HTMLElement { return this.slotsRef().nativeElement.children[ALL.indexOf(L)] as HTMLElement; }
  private fb(cls: string, t: string): void { this.fbCls.set(cls); this.fbText.set(t); }
  private later(ms: number, f: () => void): number { const t = window.setTimeout(f, ms); this.timers.push(t); return t; }

  // ---- the sky ----
  private inSky(): string[] { return this.bubs().map((b) => b.L); }
  /** Every letter in the sky is different: two of the same makes a keypress ambiguous, and a tap unfair (Sani 2026-09-24). */
  private freshLetter(keep: string[] = []): string {
    const taken = new Set([...this.inSky(), ...keep]);
    const pool = ALL.filter((L) => !taken.has(L));
    return pool.length ? pool[Math.floor(Math.random() * pool.length)] : ALL[Math.floor(Math.random() * 26)];
  }
  /**
   * One balloon, in the next free lane. `in` is how far up it starts: the first skyful is spread through the whole
   * climb, or all eight would rise as one clump and leave the sky empty between waves (Sani 2026-09-24). Every balloon
   * after that enters from the bottom, as a new one should.
   */
  private mk(L: string, lane: number, spread = false): Bub {
    const dur = 24000 + Math.random() * 10000;   // a slow drift: a child must have time to look for the letter
    return { id: ++this.seq, L, lane, x: 6 + lane * (88 / (SKY - 1)) + (Math.random() * 6 - 3), dur, in: spread ? Math.random() * dur * 0.55 : 0, state: '' };
  }
  /** One balloon per lane, the first skyful spread through the climb so they do not rise as one clump. */
  private fill(): void {
    const out: Bub[] = [];
    for (let lane = 0; lane < SKY; lane++) {
      const taken = new Set(out.map((b) => b.L));
      const pool = ALL.filter((L) => !taken.has(L));
      out.push(this.mk(pool[Math.floor(Math.random() * pool.length)], lane, true));
    }
    this.bubs.set(out);
  }
  /**
   * A balloon that has drifted off the top, been popped, or burst and fallen: a new letter takes its lane. It replaces
   * the old one in place — moving a balloon's node in the list restarts every CSS animation Angular moves with it, and
   * the whole sky then rises as one clump (Sani 2026-09-24).
   */
  private recycle(id: number, keep: string[] = []): void {
    if (this.stopped) return;
    const old = this.bubs().find((b) => b.id === id); if (!old) return;
    const need = this.target();
    const others = this.bubs().filter((b) => b.id !== id).map((b) => b.L);
    const L = need && !others.includes(need) ? need                                   // the asked letter is always in the sky
      : (ALL.filter((x) => !others.includes(x) && !keep.includes(x) && x !== need)[0] ? shuffle(ALL.filter((x) => !others.includes(x) && !keep.includes(x) && x !== need))[0] : this.freshLetter(keep));
    this.bubs.update((a) => a.map((b) => b.id === id ? this.mk(L, old.lane) : b));
  }
  /** A balloon reaching the top is not an answer: it is replaced, quietly. Popped and burst ones are recycled by
   *  their own timers, so only the drift counts here. */
  ended(b: Bub, e: AnimationEvent): void { if (e.animationName === 'bubrise' && !b.state) this.recycle(b.id); }

  // ---- answering, by finger or by key ----
  tapped(e: Event): void {
    const el = (e.target as HTMLElement).closest('.bub') as HTMLElement | null;
    if (!el || el.classList.contains('pop') || el.classList.contains('burst')) return;
    this.hit(+(el.dataset['b'] || 0));
  }
  private key(e: KeyboardEvent): void {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const L = (e.key || '').toUpperCase();
    if (!/^[A-Z]$/.test(L)) return;                       // any other key does nothing at all: no sound, no penalty
    const b = this.bubs().find((x) => x.L === L && x.state === '');
    if (!b) return;                                        // a letter that is not in the sky is not an answer either
    e.preventDefault(); this.hit(b.id);
  }
  private hit(id: number): void {
    const b = this.bubs().find((x) => x.id === id); if (!b || b.state || !this.answer || !this.target()) return;
    if (b.L === this.target()) this.right(b); else this.miss(b);
  }
  private el(id: number): HTMLElement | null { return this.skyRef().nativeElement.querySelector('[data-b="' + id + '"]'); }

  private async right(b: Bub): Promise<void> {
    const el = this.el(b.id), res = this.answer; this.answer = null;
    this.bubs.update((a) => a.map((x) => x.id === b.id ? { ...x, state: 'pop' } : x));
    joy(this.bus, this.yay); this.bad.set(false); this.fb('good', 'Madalla! ✓');
    if (el) await flyLetter(this.zoom, this.host.nativeElement, el, this.slot(b.L), b.L, 'var(--green)');
    this.done.update((a) => a.map((v, i) => i === ALL.indexOf(b.L) ? true : v));
    this.later(60, () => this.recycle(b.id));
    this.bus.play('app_en_' + b.L).catch(() => undefined);
    res?.(true);
  }
  /** Wrong: it bursts on a low note and the skin falls back down to fill again, so the sky never empties of chances. */
  private miss(b: Bub): void {
    const el = this.el(b.id);
    if (el) { try { const m = new DOMMatrixReadOnly(getComputedStyle(el).transform); el.style.setProperty('--y0', m.m42 + 'px'); } catch { /* no matrix: it still falls from its lane */ } }
    this.bubs.update((a) => a.map((x) => x.id === b.id ? { ...x, state: 'burst' } : x));
    this.bus.playRaw(NOPE).catch(() => undefined); shakeNo(this.nope);
    this.wrong++; this.roundWrong++;
    this.bad.set(true); this.fb('bad', 'A’a — ' + this.target());
    this.later(950, () => this.recycle(b.id));
    if (this.roundWrong >= GUESSES) { const res = this.answer; this.answer = null; res?.(false); }
  }

  // ---- the run ----
  /** Twelve letters spread across the whole alphabet: knowing A B C proves nothing, so one is taken from each twelfth. */
  private pick(): string[] {
    const out: string[] = [];
    for (let i = 0; i < ASKED; i++) {
      const lo = Math.floor(i * 26 / ASKED), hi = Math.max(lo + 1, Math.floor((i + 1) * 26 / ASKED));
      const band = ALL.slice(lo, hi); out.push(band[Math.floor(Math.random() * band.length)]);
    }
    return shuffle(out);
  }
  private ask(L: string): Promise<boolean | null> {
    return new Promise((res) => {
      this.answer = res; this.target.set(L); this.roundWrong = 0; this.bad.set(false);
      // the letter being asked for must be in the sky: the balloon nearest the top makes way for it, in its own lane
      if (!this.inSky().includes(L)) { const old = [...this.bubs()].sort((a, b) => b.in - a.in)[0]; if (old) this.bubs.update((a) => a.map((b) => b.id === old.id ? this.mk(L, old.lane) : b)); }
      this.said.set(this.session.g() === 'f' ? 'Ki fashe' : 'Ka fashe');
      this.fb('wait', '');
      this.speak.set(true);
      this.bus.play(this.bus.gk('s_pop_say')).then(() => this.bus.play('app_en_' + L)).then(() => this.speak.set(false)).catch(() => this.speak.set(false));
      this.later(REPEAT_AT, () => { if (this.answer === res) this.again(); });
      this.later(MISS_AT, () => { if (this.answer === res) { this.answer = null; res(false); } });
    });
  }
  /** The ear, and Laila herself: say the letter again. Repeating never costs a child anything. */
  async again(): Promise<void> {
    const L = this.target(); if (!L) return;
    this.bus.stopAll(); this.speak.set(true);
    await this.bus.play(this.bus.gk('s_pop_say')); await this.bus.play('app_en_' + L); this.speak.set(false);
  }
  private async start(): Promise<void> {
    this.targets = this.pick(); this.fill();
    if (!(await this.bus.play(this.bus.gk('s_pop_intro')))) return;
    for (this.round = 0; this.round < ASKED; this.round++) {
      if (this.stopped) return;
      this.eye.set('Mu gani · ' + (this.round + 1) + ' / ' + ASKED);
      const ok = await this.ask(this.targets[this.round]);
      if (ok === null || this.stopped) return;             // the screen was left
      if (ok) this.hits++;
      if (this.roundWrong >= GUESSES) { await this.finish(true); return; }   // guessing: the game ends here
      await wait(360);
    }
    await this.finish(false);
  }
  private async finish(guessed: boolean): Promise<void> {
    this.target.set(''); this.said.set(''); this.answer = null;
    const start = guessed ? 'haruffa_ah' : PlanService.decide(this.hits, this.wrong);
    this.plan.save({ hits: this.hits, wrong: this.wrong, asked: this.round, start, at: Date.now() });
    this.fb('good', 'Madalla! ' + this.hits + ' / ' + ASKED);
    await this.bus.play('s_pop_done'); await wait(400);
    if (!this.stopped) this.router.navigate(['/home']);
  }
  leave(): void { this.stopped = true; this.bus.stopAll(); this.router.navigate(['/home']); }
}
