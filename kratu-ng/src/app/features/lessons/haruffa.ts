import { Component, ElementRef, OnDestroy, OnInit, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { afterPaint } from '../../shared/paint';
import { AudioBus } from '../../core/audio/audio-bus.service';
import { SpeechService } from '../../core/speech/speech.service';
import { SessionService } from '../../core/state/session.service';
import { ZoomService } from '../../core/zoom/zoom.service';
import { Door, Ear } from '../../shared/chrome/chrome';
import { LailaButton } from '../../shared/laila/laila-button';
import { Spotter, firstHints, flyFromBeak, wait } from '../../shared/lesson/helpers';
import { DomSanitizer } from '@angular/platform-browser';
import { ALLO_SVG } from '../../shared/allo';

export const ALL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export const LETTER_COLOR = (i: number) => ['var(--red)', 'var(--blue)', 'var(--yellow)', 'var(--teal)', 'var(--purple)', 'var(--orange)', 'var(--green)'][Math.min(6, Math.floor(i / 4))];

/**
 * Screen 5 · Haruffa, the first test. "Ka san haruffa?" — Laila shows A B C D, then the child either presses her
 * (I know the letters → the A–Z test) or the black allo (teach me → the learning path). Two misses in the test → the path.
 */
@Component({
  selector: 'app-haruffa',
  imports: [Door, Ear, LailaButton],
  host: { class: 's lesson abc', '[class.hearing]': 'rec() || armed()' },
  template: `
<app-door (pressed)="leave()" /><app-ear (pressed)="ear()" /><div class="eyebrow">Haruffa · gwaji na farko</div>
<div class="abcshow" [class.off]="!big()"><span class="abcbig" [class.glow]="bigGlow()" [style.--c]="bigColor()">{{ big() }}</span><span class="abcex" [hidden]="!exTag()">misali</span></div>
<div #slots class="abcslots">@for (L of all; track L) {<span class="aslot" [attr.data-l]="L" [style.--c]="color($index)" [class.on]="st()[$index] === 'on'" [class.done]="st()[$index] === 'done'" [class.bad]="st()[$index] === 'bad'" [class.miss]="st()[$index] === 'miss'">{{ st()[$index] === 'done' ? L : '' }}</span>}</div>
<div class="fb" [class]="'fb ' + fbCls()">{{ fbText() }}</div>
<div class="yesno ynpair abcq" [class.picked-yes]="picked() === 'yes'" [class.picked-no]="picked() === 'no'" [class.nohand]="nohand()">
  <app-laila-btn #lb label="Fara" [size]="132" [cue]="cue()" [armed]="armed()" [rec]="rec()" [speak]="speak()" [prep]="speech.preparing()" [amp]="speech.amp()" (pressed)="lailaPressed()" />
  <button #learn class="yn no board abc-learn" aria-label="Koyo" (click)="teachMe()"><span [innerHTML]="allo"></span><small>Koyo</small></button>
</div>`,
})
export class HaruffaScreen implements OnInit, OnDestroy {
  readonly speech = inject(SpeechService);
  private readonly bus = inject(AudioBus);
  private readonly session = inject(SessionService);
  private readonly zoom = inject(ZoomService);
  private readonly router = inject(Router);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly lb = viewChild.required<LailaButton>('lb');
  private readonly slotsRef = viewChild.required<ElementRef<HTMLElement>>('slots');
  private readonly learnRef = viewChild.required<ElementRef<HTMLElement>>('learn');
  readonly all = ALL; readonly allo = inject(DomSanitizer).bypassSecurityTrustHtml(ALLO_SVG); readonly color = LETTER_COLOR;
  readonly st = signal<('' | 'on' | 'done' | 'bad' | 'miss')[]>(ALL.map(() => ''));
  readonly big = signal(''); readonly bigColor = signal('var(--red)'); readonly bigGlow = signal(false); readonly exTag = signal(false);
  readonly fbCls = signal(''); readonly fbText = signal('');
  readonly picked = signal<'' | 'yes' | 'no'>(''); readonly nohand = signal(false);
  readonly cue = signal(false); readonly armed = signal(false); readonly rec = signal(false); readonly speak = signal(false);
  private spotter!: Spotter; private running = false; private primed = false; private introCut = false; private introActive = false;
  private awaiting = false; private ti = 0; private misses = 0; private hearHandle: { stop(): void } | null = null;

  ngOnInit(): void { this.spotter = new Spotter(this.host.nativeElement, this.zoom); afterPaint().then(() => this.intro()); }
  ngOnDestroy(): void { this.bus.stopAll(); this.hearHandle?.stop(); this.spotter?.unspot(); }

  private slot(i: number): HTMLElement { return this.slotsRef().nativeElement.children[i] as HTMLElement; }
  private setSt(i: number, v: '' | 'on' | 'done' | 'bad' | 'miss'): void { this.st.update((a) => a.map((x, k) => k === i ? v : x)); }
  private showLetter(i: number): void { this.big.set(ALL[i]); this.bigColor.set(LETTER_COLOR(i)); this.bigGlow.set(false); this.st.update((a) => a.map((x, k) => k === i ? 'on' : (x === 'on' ? '' : x))); }
  private reset(): void { this.st.set(ALL.map(() => '')); this.fb('', ''); this.armed.set(false); this.cue.set(false); this.rec.set(false); this.awaiting = false; this.picked.set(''); this.big.set(''); this.exTag.set(false); this.spotter.unspot(); }
  private fb(cls: string, t: string): void { this.fbCls.set(cls); this.fbText.set(t); }
  private KA(): string { return this.session.g() === 'f' ? 'ki' : 'ka'; }

  /** ① Laila shows A B C D · ② "your turn" · ③ don't know? press the allo — know? press Laila · then the ear and the door, once. */
  private async intro(): Promise<void> {
    if (this.running) return; this.introCut = false; this.introActive = true; this.reset();
    const ok = await this.bus.play(this.bus.gk('s_abc_intro'), { onStart: () => setTimeout(() => this.spotter.spot(this.host.nativeElement.querySelector('.abcshow'), 'below'), 1500) });
    this.spotter.unspot(); if (!ok || this.introCut) return;
    this.exTag.set(true); this.speak.set(true);
    for (let i = 0; i < 4; i++) { if (this.introCut) return; this.showLetter(i); this.bigGlow.set(true); this.bus.play('app_en_' + ALL[i]); await flyFromBeak(this.zoom, this.host.nativeElement, this.lb().head(), this.slot(i), ALL[i], LETTER_COLOR(i)); this.setSt(i, 'done'); await wait(300); }
    this.speak.set(false); await wait(900); this.exTag.set(false); this.big.set(''); for (let k = 0; k < 4; k++) this.setSt(k, '');
    if (this.introCut) return;
    this.cue.set(true); this.primed = true; this.nohand.set(true);
    if (!(await this.bus.play(this.bus.gk('s_abc_turn'), { onStart: () => this.spotter.spot(this.lb().head(), 'above') }))) return; this.spotter.unspot();
    if (!(await this.bus.play('app_yn_hint_no'))) return;
    if (!(await this.bus.play('app_press_allo', { onStart: () => this.spotter.spot(this.learnRef().nativeElement.querySelector('.allo'), 'above') }))) return; this.spotter.unspot();
    this.nohand.set(false); this.cue.set(true); this.primed = true;
    await firstHints(this.bus, this.session, this.spotter, this.host.nativeElement, null); this.introActive = false;
  }

  // ---- the test: a letter shows, the child presses Laila and says it; correct lands in its slot with a ✓ ----
  private run(): void { if (this.running) return; this.running = true; this.reset(); this.picked.set('yes'); this.ti = 0; this.ask(); }
  private async ask(): Promise<void> {
    const first = this.ti < 4;
    if (this.ti >= 26) { this.armed.set(false); this.rec.set(false); this.big.set(''); this.fb('good', '✓ A – Z'); await this.bus.play(this.bus.gk('s_abc_done')); this.running = false; this.router.navigate(['/home']); return; }
    this.showLetter(this.ti); this.misses = 0; this.arm();
    if (first) { this.nohand.set(true); await this.bus.play(this.bus.gk('s_abc_say'), { onStart: () => this.spotter.spot(this.lb().head(), 'above') }); this.spotter.unspot(); this.nohand.set(false); this.arm(); }
    else { await this.bus.play(this.bus.gk('s_say_it')); this.arm(); }
  }
  private arm(): void { if (!this.running) return; this.awaiting = true; this.armed.set(true); this.fb('wait', 'Danna kan Laila, ' + this.KA() + ' faɗi harafin.'); }
  private async press(): Promise<void> {
    if (!this.awaiting) return; this.awaiting = false; this.armed.set(false); this.bus.stopAll(); this.spotter.unspot(); this.nohand.set(false); if (this.st()[this.ti] === 'bad') this.setSt(this.ti, 'on');
    this.rec.set(true); const h = this.speech.hear({ target: ALL[this.ti] }); this.hearHandle = h; const r = await h.done; this.hearHandle = null; this.rec.set(false);
    this.result(r.value as string | null);
  }
  private async result(L: string | null): Promise<void> {
    const target = ALL[this.ti];
    if (L === target) { await flyFromBeak(this.zoom, this.host.nativeElement, this.lb().head(), this.slot(this.ti), target, LETTER_COLOR(this.ti)); this.setSt(this.ti, 'done'); this.fb('good', 'Madalla! ✓'); if (this.ti === 25) { await wait(350); } else { await this.bus.play('app_kudos'); } this.ti++; this.ask(); return; }
    this.misses++; this.setSt(this.ti, 'bad'); this.fb('bad', L ? ('Wannan ' + L + ' ne — sake gwadawa.') : 'Ban ji ba — sake gwadawa.');
    if (this.misses < 2) { this.arm(); await this.bus.play('app_retry'); this.setSt(this.ti, 'on'); this.arm(); return; }
    this.setSt(this.ti, 'miss'); this.armed.set(false); this.fb('wait', ALL.slice(0, this.ti).join('') + ' ✓ · ' + target + ' ? → koya');
    await this.bus.play('s_teach_part'); this.running = false; this.router.navigate(['/haruffa/koyo'], { queryParams: { from: Math.floor(this.ti / 4) } });
  }
  lailaPressed(): void {
    if (this.awaiting) { this.press(); return; }
    if (this.running) { if (!this.primed) return; this.introCut = true; this.running = false; }
    else if (this.introActive) { this.introCut = true; this.introActive = false; this.primed = true; }
    this.bus.stopAll(); this.spotter.unspot(); this.nohand.set(false);
    if (this.primed) { this.cue.set(false); this.run(); } else this.intro();
  }
  /* The board opens at once and introduces itself there; the child never waits on this screen for a line about the next one. */
  teachMe(): void {
    this.bus.stopAll(); this.spotter.unspot(); if (this.running) return; this.introCut = true; this.introActive = false; this.nohand.set(false); this.picked.set('no');
    this.router.navigate(['/haruffa/koyo'], { queryParams: { from: 0, intro: 1 } });
  }
  ear(): void { this.bus.stopAll(); this.hearHandle?.stop(); this.running = false; this.intro(); }
  leave(): void { this.bus.stopAll(); this.hearHandle?.stop(); this.router.navigate(['/home']); }
}
