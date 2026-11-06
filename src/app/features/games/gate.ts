import { Component, ElementRef, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { afterPaint } from '../../shared/paint';
import { AudioBus } from '../../core/audio/audio-bus.service';
import { SessionService } from '../../core/state/session.service';
import { CourseService } from '../../core/state/course.service';
import { PlanService } from '../../core/state/plan.service';
import { Door, Ear } from '../../shared/chrome/chrome';
import { Laila } from '../../shared/laila/laila';
import { LailaButton } from '../../shared/laila/laila-button';
import { AlloButton } from '../../shared/lesson/allo-button';
import { Spotter, wait } from '../../shared/lesson/helpers';
import { ZoomService } from '../../core/zoom/zoom.service';
import { ALL, LETTER_COLOR } from '../../shared/lesson/letters';
import { t, tx } from '../../core/lang/t';

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
  styles: [`
.gscene{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;background:linear-gradient(180deg,#BFE6F7 0%,#DDF0F2 45%,#F7E9CB 100%)}
.gsun{position:absolute;right:16%;top:16%;width:11%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,#FFF4C2 0 45%,rgba(255,226,120,.55) 46% 62%,rgba(255,226,120,0) 70%)}
.gtown{position:absolute;left:0;right:0;bottom:0;width:100%;height:30%}
.gbal{position:absolute;bottom:-18%;width:7.5%;aspect-ratio:.86;scale:var(--s);animation:gbal-up var(--w) linear var(--d) infinite;will-change:transform}
.gbal b{position:absolute;inset:0;border-radius:50% 50% 47% 47%;display:grid;place-items:center;font:800 22px/1 var(--disp);color:#fff;
  background:radial-gradient(circle at 34% 28%,rgba(255,255,255,.75) 0 7%,transparent 18%),var(--c);opacity:.55;box-shadow:inset -6px -8px 0 rgba(0,0,0,.12)}
.gbal::after{content:"";position:absolute;left:50%;top:100%;width:2px;height:40%;background:rgba(59,46,30,.25)}
@keyframes gbal-up{from{transform:translate(0,0)}50%{transform:translate(14px,-62cqh)}to{transform:translate(0,-128cqh)}}
.gribbon{position:relative;z-index:2;font:800 38px/1 var(--disp);color:#5A3A00;padding:12px 64px 14px;
  background:linear-gradient(180deg,#FFE58A,#F7C93E 55%,#D99A12);clip-path:polygon(0 0,100% 0,95% 50%,100% 100%,0 100%,5% 50%);
  filter:drop-shadow(0 5px 0 rgba(122,82,0,.3));animation:gpop .5s cubic-bezier(.3,1.5,.5,1) both}
.gboard{position:relative;z-index:2;display:grid;grid-template-columns:repeat(13,46px);gap:8px;padding:16px 20px;border-radius:18px;
  background:linear-gradient(180deg,#9A6534,#7A4A22);box-shadow:inset 0 0 0 4px rgba(255,220,160,.25),0 8px 0 rgba(74,44,18,.35),0 14px 30px rgba(74,44,18,.25)}
.gboard b{display:grid;place-items:center;height:52px;border-radius:10px;background:#FFFDF7;font:800 30px/1 var(--disp);color:var(--c);
  box-shadow:0 3px 0 rgba(0,0,0,.25);opacity:.38;transition:opacity .25s,transform .38s cubic-bezier(.2,1.7,.4,1),box-shadow .25s}
.gboard b.said{opacity:1}
.gboard.all b:not(.ex){transition-delay:calc(var(--i) * 45ms - 180ms);animation:gwave .5s ease-out calc(var(--i) * 45ms - 180ms) both}
.gboard b.lit{opacity:1;transform:translateY(-10px) scale(1.35);z-index:1;box-shadow:0 0 0 3px #FFD54A,0 0 22px rgba(255,213,74,.95)}
@keyframes gwave{40%{transform:translateY(-8px) scale(1.15)}}
@keyframes gpop{from{opacity:0;transform:scale(.6)}}
:host .eyebrow{position:relative;z-index:2}
:host .yesno{position:relative;z-index:2}
:host .fb{position:relative;z-index:2}
:host .startlaila{z-index:2}
@media (prefers-reduced-motion:reduce){.gbal,.gribbon,.gboard.all b{animation:none}}
`],
  template: `
<app-door (pressed)="leave()" /><app-ear (pressed)="repeat()" />
<div class="gscene nofit" aria-hidden="true">
  <span class="gsun"></span>
  @for (b of balloons; track b.L) {<span class="gbal" [style.left.%]="b.x" [style.--c]="colour(b.L)" [style.--d.s]="b.d" [style.--w.s]="b.w" [style.--s]="b.s"><b>{{ b.L }}</b></span>}
  <svg class="gtown" viewBox="0 0 1600 260" preserveAspectRatio="xMidYMax slice">
    <path fill="#E2B98C" d="M0 170h1600v90H0z"/>
    <g fill="#D29A6A"><path d="M40 120h170v60H40z"/><path d="M40 120l-8-22 22 14zM210 120l8-22-22 14z"/><path d="M260 95h120v85H260z"/><path d="M260 95l-8-24 22 16zM380 95l8-24-22 16z"/>
      <path d="M520 130h200v50H520z"/><path d="M820 110h140v70H820z"/><path d="M820 110l-8-22 22 14zM960 110l8-22-22 14z"/><path d="M1060 88h110v92h-110z"/><path d="M1060 88l-8-24 22 16zM1170 88l8-24-22 16z"/>
      <path d="M1260 125h180v55h-180z"/><path d="M1490 105h110v75h-110z"/></g>
    <g fill="#B97C4E"><path d="M300 130h40v50h-40z"/><path d="M95 145h34v35H95z"/><path d="M600 148h30v32h-30z"/><path d="M1095 125h40v55h-40z"/><path d="M870 140h36v40h-36z"/><path d="M1330 145h34v35h-34z"/></g>
    <g fill="none" stroke="#F4E2C4" stroke-width="5" opacity=".7"><path d="M285 112l15 10 15-10 15 10 15-10 15 10M1075 106l15 10 15-10 15 10 15-10M840 126l15 10 15-10 15 10 15-10 15 10"/></g>
    <g fill="#7FA35B"><circle cx="460" cy="120" r="42"/><circle cx="430" cy="138" r="30"/><circle cx="1215" cy="118" r="38"/><path d="M455 150h10v32h-10zM1210 145h10v36h-10z" fill="#8A5A34"/></g>
  </svg>
</div>
<div class="eyebrow">{{ tx('Mu gani · haruffa') }}</div>

@if (phase() === 'invite') {
  <button class="startlaila gatestart" [class.talking]="speak()" [class.cue]="ready()"
          [attr.aria-label]="t('Danna Laila mu fara')" (click)="begin()">
    <span class="meethalo"></span><app-laila [size]="190" cls="meet-lm" />
    @if (ready()) {<span class="meet-hand">👆🏾</span>}
  </button>
  <div class="starthint" [class.show]="ready()">{{ t('Danna kan Laila mu fara') }}<br><small>{{ t('tap Laila to begin') }}</small></div>
} @else {
  <div class="gribbon">{{ t('Haruffa') }}</div>
  <div class="gboard" [class.all]="saidAt() > 4" aria-hidden="true">
    @for (L of all; track L) {
      <b [style.--c]="colour(L)" [style.--i]="$index" [class.ex]="$index < 4" [class.lit]="lit() === L" [class.said]="$index < 4 ? saidAt() > $index : saidAt() > 4">{{ L }}</b>
    }
  </div>
  <div class="fb" [class]="'fb ' + fbCls()">{{ tx(fbText()) }}</div>
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
  private readonly course = inject(CourseService);
  private readonly plan = inject(PlanService);
  readonly shown = SHOWN;
  readonly all = ALL;
  /** The letters drifting up behind the board: a hint of the balloon game that comes next. */
  readonly balloons = [{ L: 'K', x: 2, d: 0, w: 19, s: 1 }, { L: 'R', x: 9, d: -9, w: 23, s: .8 }, { L: 'A', x: 15, d: -4, w: 21, s: .9 },
    { L: 'T', x: 78, d: -12, w: 20, s: .85 }, { L: 'U', x: 85, d: -2, w: 24, s: 1 }, { L: 'M', x: 92, d: -15, w: 22, s: .75 }];
  /** Which letter she is saying right now, and how many she has got through. */
  readonly t = t; readonly tx = tx;
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
   * "We want to make sure you know the English letters, like" A, B, C, D — the letters in her
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
    this.saidAt.set(5);   // no "…har zuwa Z" (Sani 2026-10-12): the four letters are the example, the Z stays on screen

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
    if (this.phase() !== 'ask') return;            // an answer while she is still asking is fine (Sani 2026-10-12)
    this.seq++; this.spotter.unspot(); this.bus.stopAll(); this.session.owedGame.set(false);
    this.router.navigate(['/fashe']);
  }

  /** Says they do not: no fuss, no second question, into the lesson. */
  async no(): Promise<void> {
    if (this.phase() !== 'ask') return;
    this.seq++; this.spotter.unspot(); this.bus.stopAll(); this.cue.set(false);
    this.fb('wait', 'Kada ka damu');
    this.speak.set(true);
    const g = this.bus.gk('s_gate_calm');
    if (this.bus.has(g)) await this.bus.play(g); else await wait(500);
    this.speak.set(false);
    if (this.stopped) return;
    // the course from its first letters, A B C D (Sani 2026-11-04): the course's own Durbar and balloons come after
    this.plan.save({ hits: 0, wrong: 0, asked: 0, start: 'haruffa_ah', at: Date.now() });
    const st = this.course.placed([]); if (!st) { this.router.navigate(['/haruffa/koyo']); return; }
    const rt = this.course.route(st); this.router.navigate(['/' + rt.path], { queryParams: rt.query });
  }

  leave(): void { this.seq++; this.stopped = true; this.spotter.unspot(); this.bus.stopAll(); this.router.navigate(['/home']); }
  private fb(cls: string, text: string): void { this.fbCls.set(cls); this.fbText.set(text); }
}
