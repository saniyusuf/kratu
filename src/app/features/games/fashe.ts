import { Component, ElementRef, OnDestroy, OnInit, computed, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { afterPaint } from '../../shared/paint';
import { AudioBus } from '../../core/audio/audio-bus.service';
import { PlanService } from '../../core/state/plan.service';
import { ProgressService } from '../../core/state/progress.service';
import { SessionService } from '../../core/state/session.service';
import { ZoomService } from '../../core/zoom/zoom.service';
import { CourseService } from '../../core/state/course.service';
import { Door, Ear } from '../../shared/chrome/chrome';
import { LailaButton } from '../../shared/laila/laila-button';
import { flyLetter, joy, shakeNo, shuffle, wait } from '../../shared/lesson/helpers';
import { ALL, LETTER_COLOR } from '../../shared/lesson/letters';

const NOPE = 'assets/audio/sfx/nope.ogg';
const SKY = 8;
/**
 * The clock is the test (Sani 2026-10-07). A round is about five seconds — she names the letter just
 * popped, the child finds the next one and taps it — so twenty-six of them is roughly 130s of work and
 * two minutes is about fifteen seconds more than the job takes.
 *
 * The penalty is not aimed at a child who is guessing: a guesser never reaches Z anyway, because they
 * cannot find the next letter. It is aimed at brute force — tapping every balloon until one bursts,
 * the only way to beat this without knowing the alphabet. At +4 against -8 that costs about 16s a
 * letter and dies around the eighth, while a child who knows the order finishes with ~45s in hand.
 */
const CLOCK = 120_000, GAIN = 4_000, LOSS = 8_000;
/** A child who has stopped popping is nudged, and then the game gives up on them rather than waiting for ever. */
/** Quiet before a reminder: two 10 s apart, then a 20 s pause, and again (Sani 2026-10-12). Giving up waits longer. */
const NUDGE_GAP = 10000, NUDGE_REST = 20000, GIVE_AT = 90000;

interface Bub { id: number; L: string; lane: number; x: number; dur: number; wait: number; state: '' | 'pop' | 'burst' | 'go'; }

/**
 * Fashe haruffa · the placement game. Letters drift up in balloons and the child pops them **in alphabetical order**,
 * A to Z, with nobody naming them but A: Laila says "pop the first letter, A" and then only "pop the next letter". That is the
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
/** The pointing hand rides its balloon by the `translate` property where the webview has it (Chrome 104+). */
const TRANSLATE = typeof CSS !== 'undefined' && !!CSS.supports?.('translate', '1px 1px');

@Component({
  selector: 'app-fashe',
  imports: [Door, Ear, LailaButton],
  host: { class: 's lesson fashe', '[class.introon]': 'intro()' },
  template: `
<app-door (pressed)="leave()" /><app-ear (pressed)="again()" /><div class="eyebrow">{{ eye() }}</div>
<div class="poptime" [class.low]="low()" [class.off]="!ticking()">
  <span class="ptbar nofit"><i [style.width.%]="pct()"></i></span><b>{{ clock() }}</b>
  @if (bump()) {<span class="ptbump" [class.minus]="bump()!.startsWith('−')">{{ bump() }}</span>}
</div>
<div #sky class="sky nofit" (click)="tapped($event)">
  <span class="stage" aria-hidden="true"></span>
  @for (b of bubs(); track b.id) {
    <button class="bub" [class.pop]="b.state === 'pop'" [class.burst]="b.state === 'burst'" [class.go]="b.state === 'go'" [attr.data-b]="b.id" [attr.data-l]="b.L"
      [style.--c]="colour(b.L)" [style.--x.%]="b.x" [style.--dur.ms]="b.dur" [style.--wait.ms]="b.wait" [attr.aria-label]="b.L">{{ b.L }}</button>
  }
  <span class="curtain" aria-hidden="true"></span>
</div>
<div #slots class="abcslots">@for (L of all; track L) {<span class="aslot" [style.--c]="colour(L)" [class.active]="true" [class.on]="target() === L" [class.done]="done()[$index]">{{ done()[$index] ? L : '' }}</span>}</div>
<div class="fb" [class]="'fb ' + fbCls()">{{ fbText() }}</div>
<div class="yesno ynpair abcq lone popask">
  <app-laila-btn #lb label="Laila" [size]="96" [speak]="speak()" [yay]="yay()" [nope]="nope()" (pressed)="again()" />
  <span class="ask" [class.bad]="bad()">A → Z <b>{{ gone() }}</b></span>
</div>
@if (intro()) {
<div class="pintro nofit" [class.ready]="introReady()">
  <div class="ptries">@for (i of [1, 2]; track i) {<i [class.on]="i <= tryN"></i>}</div>
  <div class="pban">Fashe haruffa</div>
  <div class="pboard">@for (L of all; track L) {<button type="button" [style.--c]="colour(L)" [style.--i]="$index" [class.fail]="marked().includes(L)" (click)="mark(L)">{{ L }}</button>}</div>
  <div class="pstars"><i></i><i></i><i></i><span class="pline"></span><i></i></div>
  <div class="pgo"><app-laila-btn label="" [size]="130" [speak]="introSpeak()" [cue]="introReady()" (pressed)="go()" /></div>
  @if (sim) {<div class="psim"><small>Simulate: tap letters to mark them failed (the game stops at the first one)</small><button type="button" (click)="skipToEnd()">Skip to results ›</button></div>}
</div>
}`,
  styles: [`
.pintro{position:absolute;inset:0;z-index:6;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:40px 60px;background:rgba(28,20,12,.58);animation:pfade .35s ease-out both}
.pban{font:800 40px/1 var(--disp);color:#5A3A00;padding:12px 70px 14px;background:linear-gradient(180deg,#FFE58A,#F7C93E 55%,#D99A12);
  clip-path:polygon(0 0,100% 0,95% 50%,100% 100%,0 100%,5% 50%);filter:drop-shadow(0 5px 0 rgba(0,0,0,.3));animation:ppop .5s cubic-bezier(.3,1.5,.5,1) both}
.pboard{display:grid;grid-template-columns:repeat(13,48px);gap:8px;padding:14px 18px;border-radius:18px;background:linear-gradient(180deg,#9A6534,#7A4A22);
  box-shadow:inset 0 0 0 4px rgba(255,220,160,.25),0 8px 0 rgba(0,0,0,.35)}
.pboard button{height:54px;border:0;padding:0;border-radius:10px;background:#FFFDF7;font:800 31px/1 var(--disp);color:var(--c);box-shadow:0 3px 0 rgba(0,0,0,.28);
  outline:4px solid transparent;outline-offset:-4px;animation:ppop .4s cubic-bezier(.3,1.5,.5,1) calc(var(--i) * 30ms) both;transition:transform .15s,filter .15s,outline-color .15s;cursor:default}
.pboard button.fail{outline-color:#E63946;filter:grayscale(.85) brightness(.8);transform:scale(.88) rotate(-5deg)}
.pstars{display:flex;align-items:center;gap:12px}
.pstars i{font-style:normal;font-size:46px;line-height:1;color:rgba(255,255,255,.28)}
.pstars i::before{content:"★"}
.pline{width:5px;height:56px;border-radius:3px;background:#fff;margin:0 6px;box-shadow:0 0 10px rgba(255,255,255,.7)}
.ptries{position:absolute;top:28px;right:120px;display:flex;gap:10px}
.ptries i{width:22px;height:22px;border-radius:50%;background:rgba(255,255,255,.22);box-shadow:inset 0 0 0 3px rgba(255,255,255,.55)}
.ptries i.on{background:radial-gradient(circle at 35% 30%,#FFF1A8,#F7C93E 50%,#C98A0C);box-shadow:0 0 10px rgba(255,213,74,.7)}
.pgo{position:relative;display:flex;align-items:center;gap:8px;color:#fff}
.phand{font-size:56px;line-height:1;opacity:0;transition:opacity .3s}
.pintro.ready .phand{opacity:1;animation:phand 1s ease-in-out infinite}
.psim{position:absolute;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;gap:18px;padding:10px 20px;background:rgba(0,0,0,.55);color:#fff;font:700 14px var(--body)}
.psim button{font:800 14px var(--disp);color:#3B2E1E;background:#FFD54A;border:0;border-radius:99px;padding:7px 18px;cursor:pointer}
.pintro:has(.psim) .pboard button{cursor:pointer}
/* the A–Z strip as a wooden board: empty sockets fill with letter tiles as they pop (Sani 2026-11-02); no tick badge */
.abcslots{width:min(720px,96%)!important;gap:6px!important;padding:10px 14px;border-radius:14px;background:linear-gradient(180deg,#9A6534,#7A4A22);
  box-shadow:inset 0 0 0 3px rgba(255,220,160,.25),0 6px 0 rgba(74,44,18,.35)}
.aslot{height:40px!important;border:0!important;border-radius:8px!important;background:rgba(40,22,8,.38)!important;box-shadow:inset 0 3px 6px rgba(0,0,0,.35)!important;font-size:26px!important;color:var(--c)!important}
.aslot.on{background:rgba(255,213,74,.25)!important;box-shadow:inset 0 0 0 3px #FFD54A,0 0 16px rgba(255,213,74,.8)!important}
.aslot.done{background:#FFFDF7!important;box-shadow:0 3px 0 rgba(0,0,0,.28)!important}
.aslot.done::after{display:none!important}
.popask .ask{background:linear-gradient(180deg,#FFE58A,#F7C93E 55%,#E0A21A)!important;border:0!important;color:#5A3A00!important;box-shadow:0 4px 0 rgba(122,82,0,.35)}
.popask .ask b{color:#7A2E00!important}
:host(.introon) .popask,:host(.introon) .abcslots,:host(.introon) .poptime{opacity:0}
@keyframes pfade{from{opacity:0}}
@keyframes ppop{from{opacity:0;transform:scale(.6)}}
@keyframes phand{50%{translate:-10px 0}}
@media (prefers-reduced-motion:reduce){.pintro,.pban,.pboard button,.phand{animation:none!important}}
`],
})
export class FasheScreen implements OnInit, OnDestroy {
  private readonly bus = inject(AudioBus);
  private readonly session = inject(SessionService);
  private readonly plan = inject(PlanService);
  private readonly progress = inject(ProgressService);
  private readonly zoom = inject(ZoomService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
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
  /** Milliseconds left, the bar, and the little +4 / −8 that flies off the clock when it changes. */
  readonly left = signal(CLOCK); readonly ticking = signal(false); readonly bump = signal<string | null>(null);
  readonly pct = computed(() => Math.max(0, Math.min(100, (this.left() / CLOCK) * 100)));
  readonly low = computed(() => this.left() <= 20_000);
  readonly clock = computed(() => {
    const s = Math.max(0, Math.ceil(this.left() / 1000));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  });
  private tickId = 0; private tickAt = 0; private bumpT: ReturnType<typeof setTimeout> | null = null;
  private outOfTime = false;
  readonly speak = signal(false); readonly yay = signal(false); readonly nope = signal(false); readonly bad = signal(false);

  private seq = 0; private at = 0; private reached = 0; private wrong = 0; private roundWrong = 0;
  private answer: ((ok: boolean | null) => void) | null = null;
  private stopped = false; private timers: number[] = []; private ro?: ResizeObserver;
  private readonly onKey = (e: KeyboardEvent) => this.key(e);

  colour(L: string): string { return LETTER_COLOR(ALL.indexOf(L)); }

  /**
   * The game's intro (Sani 2026-11-02), the same as every other game's: the name on a gold ribbon, the whole A–Z on a board,
   * the four stars with the pass line, the tries, and Laila to press. The balloons already rise behind the mask.
   * With the course simulator on (or ?debug) an adult can tap letters to count them as failed and skip to the ending.
   */
  private readonly course = inject(CourseService);
  readonly intro = signal(true); readonly introReady = signal(false); readonly introSpeak = signal(false);
  readonly marked = signal<string[]>([]);
  readonly sim = this.course.on() || this.session.debug;
  readonly tryN = this.route.snapshot.queryParamMap.get('try') === '2' ? 2 : 1;
  private introSeq = 0;
  mark(L: string): void { if (!this.sim) return; const m = this.marked(); this.marked.set(m.includes(L) ? m.filter((x) => x !== L) : [...m, L]); }
  private async introLine(): Promise<void> {
    const my = ++this.introSeq; this.introReady.set(false); this.introSpeak.set(true);
    await this.bus.play(this.bus.gk('s_g_go'));
    if (my !== this.introSeq || !this.intro()) return;
    this.introSpeak.set(false); this.introReady.set(true);
  }
  go(): void {
    if (!this.intro()) return;
    this.introSeq++; this.bus.stopAll(); this.intro.set(false); this.introSpeak.set(false);
    const m = this.marked();
    if (m.length) { this.simEnd(m); return; }              // marked letters but pressed Laila: the same as skipping
    this.start();
  }
  skipToEnd(): void { if (!this.intro()) return; this.introSeq++; this.bus.stopAll(); this.intro.set(false); this.simEnd(this.marked()); }
  /** The simulated ending: the game stops at the first letter marked failed, or goes through to Z. */
  private simEnd(m: string[]): void {
    const first = ALL.findIndex((L) => m.includes(L));
    if (first < 0) { this.at = ALL.length; this.reached = ALL.length - 1; this.gone.set(this.reached + ' / 25'); this.finish(false); return; }
    this.at = first; this.reached = Math.max(0, first - 1); this.gone.set(this.reached + ' / 25'); this.finish(true);
  }

  ngOnInit(): void {
    document.addEventListener('keydown', this.onKey);
    afterPaint().then(() => { this.measure(); this.fill(); this.eye.set('Mu gani · A → Z'); this.introLine(); });
  }
  ngOnDestroy(): void {
    this.stopped = true; this.stopClock(); if (this.bumpT) clearTimeout(this.bumpT);
    this.bus.stopAll(); document.removeEventListener('keydown', this.onKey);
    this.timers.forEach((t) => clearTimeout(t)); this.ro?.disconnect(); this.unpoint(); this.answer?.(null);
  }

  /**
   * The climb: a balloon starts wholly below the stage floor and ends wholly above the curtain, so it is never seen to
   * appear or vanish — it rises out from behind the boards and goes up behind the pelmet, the way it would on a real
   * stage (Sani 2026-09-25).
   */
  private measure(): void {
    const el = this.skyRef().nativeElement;
    const set = () => {
      const bh = (el.querySelector('.bub') as HTMLElement | null)?.offsetHeight || 70;
      el.style.setProperty('--bh', bh + 'px');
      // the climb is the sky's real height now that the game is full screen (Sani 2026-10-23), not the old 300px default
      el.style.setProperty('--sky', el.clientHeight + 'px');
      el.style.setProperty('--stage', ((el.querySelector('.stage') as HTMLElement | null)?.offsetHeight || 14) + 'px');
      el.style.setProperty('--cur', ((el.querySelector('.curtain') as HTMLElement | null)?.offsetHeight || 20) + 'px');
    };
    set(); afterPaint().then(set);                          // again once the balloons have a size
    try { this.ro = new ResizeObserver(set); this.ro.observe(el); } catch { /* older webviews keep the first measure */ }
  }
  private slot(L: string): HTMLElement { return this.slotsRef().nativeElement.children[ALL.indexOf(L)] as HTMLElement; }
  private fb(cls: string, t: string): void { this.fbCls.set(cls); this.fbText.set(t); }
  /**
   * Wall-clock, not a counter of ticks: a cheap tablet drops frames and a tab can be backgrounded, and
   * a child must never gain time because the device stuttered.
   */
  private runClock(): void {
    if (this.tickId) return;
    this.tickAt = Date.now(); this.ticking.set(true);
    this.tickId = window.setInterval(() => {
      const now = Date.now(); const d = now - this.tickAt; this.tickAt = now;
      const left = Math.max(0, this.left() - d);
      this.left.set(left);
      if (left <= 0) { this.stopClock(); this.timeUp(); }
    }, 200);
  }
  private stopClock(): void { if (this.tickId) { clearInterval(this.tickId); this.tickId = 0; } this.ticking.set(false); }
  /** +4 or −8, shown on the clock for a beat so the child sees what their tap cost or earned. */
  private adjust(ms: number): void {
    this.tickAt = Date.now();                                   // do not let the adjustment be eaten by the next tick
    this.left.set(Math.max(0, Math.min(CLOCK, this.left() + ms)));
    this.bump.set((ms > 0 ? '+' : '−') + Math.abs(ms) / 1000);
    if (this.bumpT) clearTimeout(this.bumpT);
    this.bumpT = setTimeout(() => this.bump.set(null), 900);
    if (this.left() <= 0) { this.stopClock(); this.timeUp(); }
  }
  /** The clock ran out. Not a failure screen: the same sentence and the same destination as saying "I don't know". */
  private timeUp(): void {
    if (this.outOfTime || this.stopped) return;
    this.outOfTime = true;
    const res = this.answer; this.answer = null; this.target.set('');
    this.timers.forEach((t) => clearTimeout(t)); this.timers = [];
    res?.(false);
  }
  private later(ms: number, f: () => void): number { const t = window.setTimeout(f, ms); this.timers.push(t); return t; }

  // ---- the sky ----
  private inSky(): string[] { return this.bubs().filter((b) => b.state !== 'go').map((b) => b.L); }
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
  private mk(L: string, lane: number, wait = 0): Bub {
    // the same speed as before on the taller full-screen sky: the climb's time grows with its height
    const dur = (19000 + Math.random() * 9000) * Math.max(1, (this.skyRef().nativeElement.clientHeight || 300) / 300);
    return { id: ++this.seq, L, lane, x: 7 + lane * (86 / (SKY - 1)) + (Math.random() * 4 - 2), dur, wait, state: '' };
  }
  /**
   * The first skyful, all eight letters different, rising one after another while Laila explains. Nothing is ever put
   * on the screen already in the air: a balloon's only way in is up from behind the boards, whether it is the first of
   * the game or the one replacing a letter just burst (Sani 2026-09-25).
   */
  private fill(): void {
    const out: Bub[] = [];
    for (let lane = 0; lane < SKY; lane++) {
      const taken = new Set(out.map((b) => b.L));
      const pool = ALL.filter((L) => !taken.has(L));
      out.push(this.mk(pool[Math.floor(Math.random() * pool.length)], lane, lane * 900));
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
    const others = this.bubs().filter((b) => b.id !== id && b.state !== 'go').map((b) => b.L);
    const L = need && !others.includes(need) ? need : this.pickLetter([...others, need], keep);   // the letter now due is always in the sky
    this.bubs.update((a) => a.map((b) => b.id === id ? this.mk(L, old.lane) : b));
  }
  /**
   * A balloon that must leave while a child is looking at it — its letter has just been done, or its lane is wanted
   * for the letter now due — does not blink out. It lets go and floats up out of the sky, and its replacement comes up
   * from the boards behind it. Deleting it where it stood is exactly the disappearing Sani kept seeing (2026-09-25).
   */
  private float(id: number, replaceWith?: string): void {
    const old = this.bubs().find((b) => b.id === id); if (!old || old.state) return;
    // it carries on up at its own speed, faded and untappable, and goes once it is out of the top — nothing in the sky
    // ever speeds up (Sani 2026-10-12)
    const el = this.el(id), gone = () => this.bubs.update((a) => a.filter((b) => b.id !== id));
    el?.addEventListener('animationiteration', gone, { once: true });
    this.bubs.update((a) => a.map((b) => b.id === id ? { ...b, state: 'go' as const } : b));
    const others = this.bubs().filter((b) => b.id !== id && b.state !== 'go').map((b) => b.L);
    const L = replaceWith || this.pickLetter([...others, this.target()], []);
    this.bubs.update((a) => [...a, this.mk(L, old.lane)]);
    this.later(old.dur + 500, gone);
  }
  /** Any balloon carrying a letter already on the strip leaves: the sky shows what is still to come, never a decoy a
   *  child has already dealt with. Cheaper than reasoning about which recycle raced which pop (Sani 2026-09-25). */
  private sweep(): void {
    const stale = this.bubs().filter((b) => !b.state && this.done()[ALL.indexOf(b.L)] && b.L !== this.target());
    if (this.bubs().filter((b) => !b.state && !this.done()[ALL.indexOf(b.L)]).length < 2) return;   // near Z there is nothing else to show
    stale.forEach((b) => this.float(b.id));
  }

  // ---- answering, by finger or by key ----
  tapped(e: Event): void {
    const el = (e.target as HTMLElement).closest('.bub') as HTMLElement | null;
    if (!el || el.classList.contains('pop') || el.classList.contains('burst')) return;
    this.hit(+(el.dataset['b'] || 0));
  }
  private key(e: KeyboardEvent): void {
    if (this.intro() || e.metaKey || e.ctrlKey || e.altKey) return;
    const L = (e.key || '').toUpperCase();
    if (!/^[A-Z]$/.test(L)) return;                       // any other key does nothing at all: no sound, no penalty
    const b = this.bubs().find((x) => x.L === L && x.state === '');
    if (!b) return;                                        // a letter that is not in the sky is not an answer either
    e.preventDefault(); this.hit(b.id);
  }
  private hit(id: number): void {
    // a balloon pressed while she is still explaining (Sani 2026-10-12: what is on screen always works): she stops,
    // the game starts, and that press is the child's first
    if (!this.answer && this.introducing) { this.skipIntro = true; this.earlyBub = id; this.bus.stopAll(); this.unpoint(); return; }
    const b = this.bubs().find((x) => x.id === id); if (!b || b.state || !this.answer || !this.target()) return;
    this.nudges = 0; this.arm(this.answer);           // any tap starts the quiet over
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
    joy(this.bus, this.yay); this.bad.set(false); this.fb('good', 'Madalla! ✓'); this.adjust(GAIN);
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
    this.adjust(-LOSS);                          // the clock is the only punishment, and it is visible
    this.later(950, () => this.recycle(b.id));
  }

  // ---- the run: A to Z, in order, with nobody saying which letter is next ----
  /** The letter now due. Keeping it in the sky is this screen's one duty; naming it would end the test. */
  private want(): string { return ALL[this.at] || ''; }
  /**
   * The reminder, after 10 s with no tap (Sani 2026-10-12): "pop the first letter: A" while A
   * is due — A is the one letter she may name — and after that only "pop the next letter", never naming it, because
   * knowing what comes next is exactly what this game is testing.
   */
  private async remind(): Promise<void> {
    this.speak.set(true);
    if (this.at === 0) { if (await this.bus.play(this.bus.gk('s_pop_first'))) await this.bus.play('app_en_A'); }
    else await this.bus.play(this.bus.gk('s_pop_next'));
    this.speak.set(false);
  }
  private wait(): Promise<boolean | null> {
    return new Promise((res) => {
      const L = this.want();
      this.sweep();                                   // nothing in the sky that is already on the strip, whatever raced what
      this.answer = res; this.target.set(L); this.roundWrong = 0; this.bad.set(false);
      // the letter now due must be in the sky: the balloon nearest the top makes way for it, in its own lane
      if (!this.inSky().includes(L)) { const old = shuffle(this.bubs().filter((b) => !b.state))[0]; if (old) this.float(old.id, L); }   // the old one floats off, the letter due rises in behind it
      this.fb('wait', '');
      this.nudges = 0;
      const early = this.earlyBub; this.earlyBub = 0;
      if (early) { this.arm(res); setTimeout(() => this.hit(early)); }
      else if (this.at === 0) this.remind().then(() => this.arm(res), () => undefined);   // she talks while they play: a pop mid-sentence counts
      else this.arm(res);
    });
  }
  /**
   * The quiet is counted from the last tap or the end of her last line. After 10 s she reminds them, after 10 s more
   * again, then she rests 20 s before the next pair; any tap starts it over. She never talks over herself.
   */
  private nudges = 0; private nudgeT = 0; private giveT = 0;
  private introducing = false; private skipIntro = false; private earlyBub = 0;
  private arm(res: (v: boolean | null) => void): void {
    if (this.answer !== res || this.stopped) return;
    clearTimeout(this.nudgeT); clearTimeout(this.giveT);
    const gap = this.nudges > 0 && this.nudges % 2 === 0 ? NUDGE_REST : NUDGE_GAP;
    this.nudgeT = this.later(gap, async () => {
      if (this.answer !== res) return;
      if (this.bus.speaking()) { this.arm(res); return; }
      this.nudges++; await this.remind().catch(() => undefined); this.arm(res);
    });
    this.giveT = this.later(GIVE_AT, () => { if (this.answer === res) { this.answer = null; res(false); } });   // they have stopped playing
  }
  /** The ear, and Laila herself: the same reminder again. */
  async again(): Promise<void> {
    if (this.intro()) { this.bus.stopAll(); this.introLine(); return; }
    if (!this.target()) return;
    this.bus.stopAll(); await this.remind();
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
      // not transform: the hand's bob animation owns it. The separate `translate` property composes with it and moves
      // the hand without a layout every frame (left/top did, 2026-10-28); a webview without it keeps left/top.
      const x = r.left - s.left + r.width / 2 - 30, y = r.bottom - s.top - 6;
      if (TRANSLATE) h.style.translate = x + 'px ' + y + 'px'; else { h.style.left = x + 'px'; h.style.top = y + 'px'; }
      this.handRaf = requestAnimationFrame(follow);
    };
    follow();
  }
  private unpoint(): void { cancelAnimationFrame(this.handRaf); this.hand?.remove(); this.hand = null; this.handOn = null; }
  private async start(): Promise<void> {
    if (!this.bubs().length) this.fill(); this.eye.set('Mu gani · A → Z');
    await afterPaint();
    // "here are balloons with letters — press one with your finger and it bursts", with the hand on a balloon as she
    // says it, so the move is shown before it is asked for (Sani 2026-09-25)
    const first = this.skyRef().nativeElement.querySelector('.bub') as HTMLElement | null;
    if (first) this.pointAt(first);
    this.introducing = true; this.skipIntro = false;
    const say = async (k: string) => this.skipIntro || (await this.bus.play(k)) || this.skipIntro;
    if (!(await say(this.bus.gk('s_pop_intro')))) { this.unpoint(); return; }
    if (!(await say(this.bus.gk('s_pop_task')))) { this.unpoint(); return; }
    // The clock is explained while it is on screen and full, so the warning is attached to the thing it
    // is about. Each of these plays only once recorded; until then the bar says it on its own.
    for (const k of ['s_pop_clock', 's_pop_scoring', 's_pop_luck']) {
      const g = this.bus.gk(k);
      if (this.bus.has(g) && !(await say(g))) { this.unpoint(); return; }
    }
    this.introducing = false;
    this.unpoint();                                         // no demonstration (Sani 2026-10-12): the child starts at A
    if (this.stopped) return;
    this.runClock();
    for (; this.at < ALL.length; ) {
      if (this.stopped) return;
      const ok = await this.wait();
      if (ok === null || this.stopped) return;              // the screen was left
      if (!ok) { await this.finish(true); return; }         // the clock ran out, or they stopped playing
      if (this.at > 0) this.reached++;                     // A is named for them, so it is not scored: B–Z, as before
      this.at++; this.gone.set(this.reached + ' / 25');
      await wait(220);
    }
    await this.finish(false);
  }
  /**
   * Two endings, and only one of them is a win. Running out of time says the same sentence a child hears
   * for tapping the slate at the gate — "let us learn the letters first" — and goes to the same place, so
   * claiming to know the alphabet and being wrong costs nothing but the detour (Sani 2026-10-07).
   */
  private async finish(stopped: boolean): Promise<void> {
    this.target.set(''); this.answer = null; this.stopClock();
    // Two tries in a row (Sani 2026-10-22). The better of the two decides: all of A–Z goes straight to Abubuwa;
    // anything less goes to Haruffa, starting at the very letter where they stopped.
    const q = this.route.snapshot.queryParamMap, first = +(q.get('best') || -1), second = q.get('try') === '2';
    const at = Math.max(this.at, first), won = !stopped && this.at >= ALL.length;
    const startL = won ? '' : ALL[Math.min(at, ALL.length - 1)];
    const start = won ? 'dabbobi' : PlanService.decide(Math.max(0, at - 1), this.wrong);
    this.plan.save({ hits: Math.max(0, at - 1), wrong: this.wrong, asked: ALL.length - 1, start, at: Date.now(), startL });
    // a child who has already finished Haruffa in the lessons is never sent back to A, whatever the balloons show
    const learned = this.progress.has('haruffa', 'final');
    if (won) {
      this.eye.set('Mu gani · A → Z');
      this.fb('good', 'Madalla! ' + this.reached + ' / 25');
      await this.bus.play('s_pop_done');
      await this.sayMaybe('s_pop_know');                    // "Ka san haruffa." — you know your letters
      await wait(400);
      this.session.owedGame.set(false);
      if (this.stopped) return;
      this.progress.unlockGame('fashe');                    // remembered as met (no home-page shelf: Sani 2026-10-23)
      if (this.stopped) return;
      this.progress.passLetters(ALL.length);                // the whole alphabet: Haruffa is done
      this.session.category.set('animals'); this.router.navigate(['/abubuwa/koyo']);   // straight on to Abubuwa
      return;
    }
    this.fb('bad', this.outOfTime ? 'Lokaci ya ƙare' : this.reached + ' / 25');
    if (!second && !learned) {
      // the first try missed: one more go, straight away, keeping how far they got
      await this.sayMaybe('s_pop_again');                   // "Ka kusa! Mu sake gwadawa sau ɗaya."
      await wait(300);
      if (this.stopped) return;
      await this.router.navigateByUrl('/blank', { skipLocationChange: true });
      this.router.navigate(['/fashe'], { queryParams: { try: '2', best: at } });
      return;
    }
    if (this.outOfTime) await this.sayMaybe('s_pop_timeup');   // "Lokaci ya ƙare. Mu koyi haruffa tukuna."
    await wait(400);
    if (this.stopped) return;
    this.progress.unlockGame('fashe');
    if (learned) { this.router.navigate(['/home']); return; }
    this.session.owedGame.set(true);
    this.progress.passLetters(ALL.indexOf(startL));         // the letters before it are known: never taught again
    this.router.navigate(['/haruffa/koyo'], { queryParams: { fromL: startL } });
  }
  /** A line that is written but not yet recorded: the screen still says it, the speaker stays quiet. */
  private async sayMaybe(k: string): Promise<void> {
    const g = this.bus.gk(k);
    if (this.bus.has(g)) await this.bus.play(g);
  }
  leave(): void { this.stopped = true; this.bus.stopAll(); this.router.navigate(['/home']); }
}
