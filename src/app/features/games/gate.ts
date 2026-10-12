import { Component, ElementRef, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { afterPaint } from '../../shared/paint';
import { AudioBus } from '../../core/audio/audio-bus.service';
import { SessionService } from '../../core/state/session.service';
import { Door, Ear } from '../../shared/chrome/chrome';
import { Laila } from '../../shared/laila/laila';
import { LailaButton } from '../../shared/laila/laila-button';
import { AlloButton } from '../../shared/lesson/allo-button';
import { Spotter, wait } from '../../shared/lesson/helpers';
import { ZoomService } from '../../core/zoom/zoom.service';
import { ALL, LETTER_COLOR } from '../../shared/lesson/letters';

/** The four she names out loud, and the one she stops at. */
const SHOWN = ['A', 'B', 'C', 'D'];

/**
 * The gate · "Ka san dukan haruffa?"
 *
 * A child who cannot read cannot answer "do you know the letters" in the abstract — ask it that way and a
 * six-year-old says yes. So she does not ask it in the abstract: she says **A, B, C, D** out loud, in the
 * app's own letter recordings, each tile lighting as she names it, and then asks whether they have all of
 * them, through to Z (Sani 2026-10-07).
 *
 * The two answers are the two hands the child already has. Laila is "yes" everywhere in Kratu, and the black
 * allo is already their "Ban sani ba" in every lesson — so nothing new is learned here, and the slate is not
 * a failure button: tapping it goes to Haruffa, which is where running out of time in the game goes too.
 */
@Component({
  selector: 'app-gate',
  imports: [Door, Ear, Laila, LailaButton, AlloButton],
  host: { class: 's lesson gate' },
  template: `
<app-door (pressed)="leave()" /><app-ear (pressed)="repeat()" />
<div class="eyebrow">Mu gani · haruffa</div>

@if (phase() === 'invite') {
  <button class="startlaila gatestart" [class.talking]="speak()" [class.cue]="ready()"
          aria-label="Danna Laila mu fara" (click)="begin()">
    <span class="meethalo"></span><app-laila [size]="190" cls="meet-lm" />
    @if (ready()) {<span class="meet-hand">👆🏾</span>}
  </button>
  <div class="starthint" [class.show]="ready()">Danna kan Laila mu fara<br><small>tap Laila to begin</small></div>
} @else {
  <div class="pr">Ka san dukan haruffa?<span class="sm">Do you know all the letters?</span></div>
  <div class="gateabc" aria-hidden="true">
    @for (L of shown; track L) {
      <b [style.--c]="colour(L)" [class.lit]="lit() === L" [class.said]="saidAt() > $index">{{ L }}</b>
    }
    <span class="gdots">…</span>
    <b [style.--c]="colour('Z')" [class.lit]="lit() === 'Z'" [class.said]="saidAt() > 4">Z</b>
  </div>
  <div class="fb" [class]="'fb ' + fbCls()">{{ fbText() }}</div>
  <div class="yesno ynpair gateq" [class.nohand]="!cue()">
    <app-laila-btn #lb label="Na sani" [size]="132" [cue]="cue()" [speak]="speak()" (pressed)="yes()" />
    <app-allo-btn label="Ban sani ba" (pressed)="no()" />
  </div>
}`,
})
export class GateScreen implements OnInit, OnDestroy {
  private readonly bus = inject(AudioBus);
  private readonly router = inject(Router);
  private readonly session = inject(SessionService);
  readonly shown = SHOWN;
  /** Which letter she is saying right now, and how many she has got through. */
  readonly lit = signal(''); readonly saidAt = signal(0);
  readonly speak = signal(false); readonly cue = signal(false);
  readonly fbCls = signal(''); readonly fbText = signal('');
  /**
   * Two beats on one screen, the way Meet Laila does it. She invites them first and waits to be pressed —
   * which is also what unlocks sound, since a browser refuses the first clip of a fresh load until a
   * finger has touched the page. Only then does she ask the question (Sani 2026-10-07).
   */
  readonly phase = signal<'invite' | 'ask'>('invite');
  readonly ready = signal(false);
  private seq = 0; private stopped = false;
  private readonly host = inject(ElementRef) as ElementRef<HTMLElement>;
  private readonly spotter = new Spotter(this.host.nativeElement, inject(ZoomService));

  colour(L: string): string { return LETTER_COLOR(ALL.indexOf(L)); }

  /** Straight into the question (Sani 2026-10-12: instructions are spoken, never waited for). A browser that refuses
   *  the sound — a fresh load that nobody has touched yet — gets the press-Laila-to-begin beat first instead. */
  ngOnInit(): void { this.phase.set('ask'); afterPaint().then(() => this.ask()); }
  ngOnDestroy(): void { this.stopped = true; this.seq++; this.spotter.unspot(); this.bus.stopAll(); }

  /** Only when the browser refused the sound: she glows and waits for the finger that unlocks it. */
  private invite(): void { this.seq++; this.spotter.unspot(); this.speak.set(false); this.phase.set('invite'); this.ready.set(true); }
  /** The press: sound is unlocked, and the question follows. */
  begin(): void {
    if (!this.ready()) return;
    this.seq++; this.bus.stopAll(); this.phase.set('ask');
    afterPaint().then(() => this.ask());
  }
  /** The ear repeats whichever beat the screen is on. */
  repeat(): void { if (this.phase() === 'invite') this.invite(); else this.ask(); }

  /**
   * "First we need to know if you know the alphabet, like" A, B, C, D "… all the way to" Z — the letters in her
   * English letter clips, never Hausa names — then each choice with the hand on it: Laila if they know them, the
   * black slate if they do not (Sani 2026-10-12). The ear restarts the whole thing, as on every other screen.
   */
  async ask(): Promise<void> {
    const my = ++this.seq;
    this.cue.set(false); this.lit.set(''); this.saidAt.set(0); this.fb('', ''); this.spotter.unspot();
    const mine = () => my === this.seq && !this.stopped;

    this.speak.set(true);
    const first = this.bus.gk('s_gate_first');
    if (this.bus.has(first) && !(await this.bus.play(first))) { if (this.bus.blocked() && mine()) this.invite(); return; }
    if (!mine()) return;

    // her own letter clips, the voice the child will have to answer in
    for (let i = 0; i < SHOWN.length; i++) {
      this.lit.set(SHOWN[i]);
      if (!(await this.bus.play('app_en_' + SHOWN[i]))) return;
      if (!mine()) return;
      this.saidAt.set(i + 1); this.lit.set('');
      await wait(140);
      if (!mine()) return;
    }
    this.lit.set('Z');
    if (this.bus.has(this.bus.gk('s_gate_z')) && !(await this.bus.play(this.bus.gk('s_gate_z')))) return;
    if (!(await this.bus.play('app_en_Z'))) return;
    if (!mine()) return;
    this.saidAt.set(5); this.lit.set('');

    const host = this.host.nativeElement;
    this.spotter.spot(host.querySelector('app-laila-btn'), 'above');
    if (this.bus.has(this.bus.gk('s_gate_yes')) && !(await this.bus.play(this.bus.gk('s_gate_yes')))) return;
    if (!mine()) return;
    this.spotter.spot(host.querySelector('app-allo-btn'), 'above');
    if (this.bus.has(this.bus.gk('s_gate_no')) && !(await this.bus.play(this.bus.gk('s_gate_no')))) return;
    if (!mine()) return;
    this.spotter.unspot(); this.speak.set(false); this.cue.set(true);
  }

  /** Says they know them: straight to the game, which is where the claim gets tested. */
  yes(): void {
    if (!this.cue()) return;                       // nothing to answer until she has finished asking
    this.seq++; this.spotter.unspot(); this.bus.stopAll(); this.session.owedGame.set(false);
    this.router.navigate(['/fashe']);
  }

  /** Says they do not: no fuss, no second question, into the lesson. */
  async no(): Promise<void> {
    if (!this.cue()) return;
    this.seq++; this.spotter.unspot(); this.bus.stopAll(); this.cue.set(false);
    this.fb('wait', 'Kada ka damu');
    this.speak.set(true);
    const g = this.bus.gk('s_gate_calm');
    if (this.bus.has(g)) await this.bus.play(g); else await wait(500);
    this.speak.set(false);
    this.session.owedGame.set(true);                 // the lesson hands them to the game when it is done
    if (!this.stopped) this.router.navigate(['/haruffa/koyo']);
  }

  leave(): void { this.seq++; this.stopped = true; this.spotter.unspot(); this.bus.stopAll(); this.router.navigate(['/home']); }
  private fb(cls: string, text: string): void { this.fbCls.set(cls); this.fbText.set(text); }
}
