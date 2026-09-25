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
/** Eight in the sky, and four wrong pops looking for one letter ends it — that child is guessing (Sani 2026-09-24). */
const SKY = 8, GUESSES = 4;
/** A child who has stopped popping is nudged, and then the game gives up on them rather than waiting for ever. */
const NUDGE_AT = 14000, GIVE_AT = 40000;

interface Bub { id: number; L: string; lane: number; x: number; dur: number; phase: number; state: '' | 'pop' | 'burst'; }

/**
 * Fashe haruffa · the placement game. Letters drift up in balloons and the child pops them **in alphabetical order**,
 * A to Z, with nobody naming them: Laila pops A as the example and then says only "find the next one". That is the
 * whole test — not whether a child can point at a letter somebody just read out, but whether they carry the order of
 * the English alphabet in their head (Sani 2026-09-25).
 *
 * A right pop bursts, says the letter (the one moment teaching happens here) and flies it into its place in the A–Z
 * strip; a wrong one bursts on a low note and the skin falls back down to fill again, so nothing is lost. Four wrong
 * pops hunting for the same letter ends the game: that child is guessing.
 *
 * It asks for a finger rather than a voice because the recogniser confuses T with C and F with S, and a bad listen
 * must never send a child who knows the alphabet back to A.
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
      [style.--c]="colour(b.L)" [style.--x.%]="b.x" [style.--dur.ms]="b.dur" [style.--phase.ms]="-b.phase" [attr.aria-label]="b.L">{{ b.L }}</button>
  }
</div>
<div #slots class="abcslots">@for (L of all; track L) {<span class="aslot" [style.--c]="colour(L)" [class.active]="true" [class.on]="target() === L" [class.done]="done()[$index]">{{ done()[$index] ? L : '' }}</span>}</div>
<div class="fb" [class]="'fb ' + fbCls()">{{ fbText() }}</div>
<div class="yesno ynpair abcq lone popask">
  <app-laila-btn #lb label="Laila" [size]="96" [speak]="speak()" [yay]="yay()" [nope]="nope()" (pressed)="again()" />
  <span class="ask" [class.bad]="bad()">A → Z <b>{{ gone() }}</b></span>
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
  /** The letter the child should pop next. It is never written on the screen — that is the test. */
  readonly target = signal(''); readonly gone = signal('0 / 25');
  readonly fbCls = signal(''); readonly fbText = signal('');
  readonly speak = signal(false); readonly yay = signal(false); readonly nope = signal(false); readonly bad = signal(false);

  private seq = 0; private at = 0; private reached = 0; private wrong = 0; private roundWrong = 0;
  private answer: ((ok: boolean | null) => void) | null = null;
  private stopped = false; private timers: number[] = []; private ro?: ResizeObserver;
  private readonly onKey = (e: KeyboardEvent) => this.key(e);

  colour(L: string): string { return LETTER_COLOR(ALL.indexOf(L)); }

  ngOnInit(): void {
    document.addEventListener('keydown', this.onKey);
    afterPaint().then(() => { this.measure(); this.start(); });
  }
  ngOnDestroy(): void {
    this.stopped = true; this.bus.stopAll(); document.removeEventListener('keydown', this.onKey);
    this.timers.forEach((t) => clearTimeout(t)); this.ro?.disconnect(); this.unpoint(); this.answer?.(null);
  }

  /** How far a balloon climbs: enough to cross the sky, short enough that it is never half off the top or bottom. */
  private measure(): void {
    const el = this.skyRef().nativeElement;
    const set = () => el.style.setProperty('--travel', Math.round(el.clientHeight * 0.72) + 'px');
    set(); try { this.ro = new ResizeObserver(set); this.ro.observe(el); } catch { /* older webviews keep the first measure */ }
  }
  private slot(L: string): HTMLElement { return this.slotsRef().nativeElement.children[ALL.indexOf(L)] as HTMLElement; }
  private fb(cls: string, t: string): void { this.fbCls.set(cls); this.fbText.set(t); }
  private later(ms: number, f: () => void): number { const t = window.setTimeout(f, ms); this.timers.push(t); return t; }

  // ---- the sky ----
  private inSky(): string[] { return this.bubs().map((b) => b.L); }
  /** Every letter in the sky is different: two of the same makes a keypress ambiguous, and a tap unfair (Sani 2026-09-24). */
  private freshLetter(keep: string[] = []): string { return this.pickLetter(this.inSky(), keep); }
  /** What a new balloon carries: one of the letters still to come, never one already popped, never one already up. */
  private pickLetter(others: string[], keep: string[] = []): string {
    // what is left is read off the strip, not off the counter: a balloon is refilled the moment its letter pops, which
    // is before the run has counted it, and the just-popped letter would sail straight back up (Sani 2026-09-25)
    const left = ALL.filter((L, i) => !this.done()[i]);     // near the end fewer are left than lanes, so done ones come back as decoys
    const pool = (left.length > SKY ? left : ALL).filter((L) => !others.includes(L) && !keep.includes(L));
    return pool.length ? shuffle(pool)[0] : ALL[Math.floor(Math.random() * 26)];
  }
  /**
   * One balloon, in the next free lane. `in` is how far up it starts: the first skyful is spread through the whole
   * climb, or all eight would rise as one clump and leave the sky empty between waves (Sani 2026-09-24). Every balloon
   * after that enters from the bottom, as a new one should.
   */
  /**
   * A balloon rises up its own lane and, at the top, comes round again **carrying the same letter** — it never trades
   * it for another. That is what keeps both promises at once: they drift upward the way balloons do, and a letter a
   * child is hunting for cannot vanish on them (Sani 2026-09-25). The climb is measured so the whole balloon stays
   * inside the sky from the bottom of the rise to the top of it.
   */
  private mk(L: string, lane: number): Bub {
    const dur = 19000 + Math.random() * 9000;
    return { id: ++this.seq, L, lane, x: 7 + lane * (86 / (SKY - 1)) + (Math.random() * 4 - 2), dur, phase: Math.random() * dur, state: '' };
  }
  /** One balloon per place, all eight different letters. */
  private fill(): void {
    const out: Bub[] = [];
    for (let lane = 0; lane < SKY; lane++) {
      const taken = new Set(out.map((b) => b.L));
      const pool = ALL.filter((L) => !taken.has(L));
      out.push(this.mk(pool[Math.floor(Math.random() * pool.length)], lane));
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
    const L = need && !others.includes(need) ? need : this.pickLetter([...others, need], keep);   // the letter now due is always in the sky
    this.bubs.update((a) => a.map((b) => b.id === id ? this.mk(L, old.lane) : b));
  }
  /** Any balloon carrying a letter already on the strip leaves: the sky shows what is still to come, never a decoy a
   *  child has already dealt with. Cheaper than reasoning about which recycle raced which pop (Sani 2026-09-25). */
  private sweep(): void {
    const stale = this.bubs().filter((b) => !b.state && this.done()[ALL.indexOf(b.L)] && b.L !== this.target());
    if (this.bubs().filter((b) => !this.done()[ALL.indexOf(b.L)]).length < 2) return;   // near Z there is nothing else to show
    stale.forEach((b) => this.recycle(b.id));
  }

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

  /**
   * A balloon that is bursting leaves its climb behind: its own animation replaces the rise, which would snap it back
   * down to the foot of its lane first. So the height it has reached is frozen into --y0 and the burst starts there
   * (Sani 2026-09-25). The computed matrix carries the centring -50% too, which is why the half-height goes back on.
   */
  private freeze(el: HTMLElement | null): void {
    if (!el) return;
    try { const m = new DOMMatrixReadOnly(getComputedStyle(el).transform); el.style.setProperty('--y0', (m.m42 + el.getBoundingClientRect().height / 2) + 'px'); } catch { /* it bursts from its lane's foot */ }
  }
  private async right(b: Bub): Promise<void> {
    const el = this.el(b.id), res = this.answer; this.answer = null;
    this.freeze(el);
    this.bubs.update((a) => a.map((x) => x.id === b.id ? { ...x, state: 'pop' } : x));
    joy(this.bus, this.yay); this.bad.set(false); this.fb('good', 'Madalla! ✓');
    if (el) await flyLetter(this.zoom, this.host.nativeElement, el, this.slot(b.L), b.L, 'var(--green)');
    this.done.update((a) => a.map((v, i) => i === ALL.indexOf(b.L) ? true : v));
    this.later(60, () => { this.recycle(b.id); this.sweep(); });
    this.bus.play('app_en_' + b.L).catch(() => undefined);   // the letter is named only once it is right
    res?.(true);
  }
  /** Wrong: it bursts on a low note and the skin falls back down to fill again, so the sky never empties of chances. */
  private miss(b: Bub): void {
    const el = this.el(b.id);
    this.freeze(el);
    this.bubs.update((a) => a.map((x) => x.id === b.id ? { ...x, state: 'burst' } : x));
    this.bus.playRaw(NOPE).catch(() => undefined); shakeNo(this.nope);
    this.wrong++; this.roundWrong++;
    this.bad.set(true); this.fb('bad', 'A’a');   // never the answer: the order is what is being tested
    this.later(950, () => this.recycle(b.id));
    if (this.roundWrong >= GUESSES) { const res = this.answer; this.answer = null; res?.(false); }   // hunting, not reading
  }

  // ---- the run: A to Z, in order, with nobody saying which letter is next ----
  /** The letter now due. Keeping it in the sky is this screen's one duty; naming it would end the test. */
  private want(): string { return ALL[this.at] || ''; }
  /**
   * What Laila says before each letter: the one **just popped**, and never the one due — "ka fasa wanda ke bayan A",
   * pop the one after A; then after B, then after C, as the child works down the strip. The letter she names is the
   * app's Nigerian English recording, the same voice the lessons teach in, so a child hears "A" said the way they will
   * be asked to say it (Sani 2026-09-25). A child who knows the alphabet knows what follows A; one who does not
   * cannot be handed it, which is what this game is for.
   */
  private async askNext(first = false): Promise<void> {
    const prev = ALL[this.at - 1]; if (!prev) return;
    this.speak.set(true);
    // one chain, awaited end to end: every bus.play stops whatever is sounding, so a second line started alongside
    // this one swallows it — that is how "ka fasa" went missing under "yanzu kai" (Sani 2026-09-25)
    if (first) await this.bus.play(this.bus.gk('s_pop_go'));
    await this.bus.play(this.bus.gk('s_pop_after'));
    await this.bus.play('app_en_' + prev);
    this.speak.set(false);
  }
  private wait(): Promise<boolean | null> {
    return new Promise((res) => {
      const L = this.want();
      this.sweep();                                   // nothing in the sky that is already on the strip, whatever raced what
      this.answer = res; this.target.set(L); this.roundWrong = 0; this.bad.set(false);
      // the letter now due must be in the sky: the balloon nearest the top makes way for it, in its own lane
      if (!this.inSky().includes(L)) { const old = shuffle(this.bubs().filter((b) => !b.state))[0]; if (old) this.bubs.update((a) => a.map((b) => b.id === old.id ? this.mk(L, old.lane) : b)); }
      this.fb('wait', '');
      this.askNext(this.at === 1).catch(() => undefined);   // she talks while they play: a pop mid-sentence counts
      this.later(NUDGE_AT, () => { if (this.answer === res) this.again(); });
      this.later(GIVE_AT, () => { if (this.answer === res) { this.answer = null; res(false); } });   // they have stopped playing
    });
  }
  /** The ear, and Laila herself: the same prompt again — the letter behind, never the one due. */
  async again(): Promise<void> {
    if (!this.target()) return;
    this.bus.stopAll(); await this.askNext();
  }
  /**
   * Laila does the first one herself, in full view: the balloons are drifting, a hand travels up to the A balloon and
   * rides along with it, she says "here is an example, I'll pop the first one", names it — **A** — and only then does
   * it burst. A child who has never held a tablet has now seen the whole move (Sani 2026-09-25).
   */
  private async example(): Promise<void> {
    if (this.done()[0]) { this.at = Math.max(this.at, 1); return; }   // an eager child got there first
    const b = this.bubs().find((x) => x.L === 'A') ?? (() => { const old = shuffle(this.bubs())[0]; const n = this.mk('A', old.lane); this.bubs.update((a) => a.map((x) => x.id === old.id ? n : x)); return n; })();
    await wait(80);
    const el = this.el(b.id);
    if (el) this.pointAt(el);                               // it walks across to the one she is about to burst
    this.speak.set(true);
    await this.bus.play(this.bus.gk('s_pop_demo'));          // "Ga misali. Zan fasa na farko:"
    await this.bus.play('app_en_A');                         // …and its name, so the move is unambiguous
    this.speak.set(false);
    if (this.stopped) { this.unpoint(); return; }
    this.freeze(el);
    this.bubs.update((a) => a.map((x) => x.id === b.id ? { ...x, state: 'pop' } : x));
    joy(this.bus, this.yay); this.unpoint();
    if (el) await flyLetter(this.zoom, this.host.nativeElement, el, this.slot('A'), 'A', 'var(--green)');
    this.done.update((a) => a.map((v, i) => i === 0 ? true : v));
    this.at = 1;                                            // A is shown, not scored: the child's own run starts at B
    this.later(60, () => { this.recycle(b.id); this.sweep(); });
  }
  /** The pointing hand rides the balloon it is pointing at, because the balloon is moving while she talks. */
  private hand: HTMLElement | null = null; private handRaf = 0; private handOn: HTMLElement | null = null;
  private pointAt(el: HTMLElement): void {
    const sky = this.skyRef().nativeElement;
    this.handOn = el;
    if (!this.hand) {
      const h = document.createElement('span'); h.className = 'pophand'; h.textContent = '👆🏾'; h.setAttribute('aria-hidden', 'true');
      sky.appendChild(h); this.hand = h;
    }
    cancelAnimationFrame(this.handRaf);
    const follow = () => {
      const h = this.hand, on = this.handOn;
      if (!h || !on || !on.isConnected) return;
      const r = on.getBoundingClientRect(), s = sky.getBoundingClientRect();
      // left/top, not transform: the hand's bob animation owns its transform and would throw any translate away
      h.style.left = (r.left - s.left + r.width / 2 - 30) + 'px'; h.style.top = (r.bottom - s.top - 6) + 'px';
      this.handRaf = requestAnimationFrame(follow);
    };
    follow();
  }
  private unpoint(): void { cancelAnimationFrame(this.handRaf); this.hand?.remove(); this.hand = null; this.handOn = null; }
  private async start(): Promise<void> {
    this.fill(); this.eye.set('Mu gani · A → Z');
    await afterPaint();
    // "here are balloons with letters — press one with your finger and it bursts", with the hand on a balloon as she
    // says it, so the move is shown before it is asked for (Sani 2026-09-25)
    const first = this.skyRef().nativeElement.querySelector('.bub') as HTMLElement | null;
    if (first) this.pointAt(first);
    if (!(await this.bus.play(this.bus.gk('s_pop_intro')))) { this.unpoint(); return; }
    if (!(await this.bus.play(this.bus.gk('s_pop_task')))) { this.unpoint(); return; }
    await this.example();
    if (this.stopped) return;
    for (; this.at < ALL.length; ) {
      if (this.stopped) return;
      const ok = await this.wait();
      if (ok === null || this.stopped) return;              // the screen was left
      if (!ok) { await this.finish(true); return; }         // four wrong pops, or they stopped playing
      this.reached++; this.at++; this.gone.set(this.reached + ' / 25');
      await wait(220);
    }
    await this.finish(false);
  }
  private async finish(stopped: boolean): Promise<void> {
    this.target.set(''); this.answer = null;
    const start = PlanService.decide(this.reached, this.wrong);
    this.plan.save({ hits: this.reached, wrong: this.wrong, asked: ALL.length - 1, start, at: Date.now() });
    this.fb('good', 'Madalla! ' + this.reached + ' / 25');
    await this.bus.play('s_pop_done'); await wait(400);
    if (!this.stopped) this.router.navigate(['/home']);
  }
  leave(): void { this.stopped = true; this.bus.stopAll(); this.router.navigate(['/home']); }
}
