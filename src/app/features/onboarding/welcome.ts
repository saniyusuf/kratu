import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { afterPaint } from '../../shared/paint';
import { AudioBus } from '../../core/audio/audio-bus.service';
import { SessionService } from '../../core/state/session.service';
import { Ear } from '../../shared/chrome/chrome';
import { Laila } from '../../shared/laila/laila';
import { HOMEGRID_HTML } from '../../features/home/homegrid';

/** One line of the welcome: what she says, what lights up, and how she stands while she says it. */
interface Beat {
  key: string;
  /** which chooser tiles zoom, by their data-act name */
  hot?: string[];
  /** her pose: wave · open · l · r · u · both · mic · self */
  pose?: string;
  fan?: boolean;      // the five lessons are on screen
  orbit?: boolean;    // English letters turning around her
  stars?: boolean;    // the sparkle line
  mic?: boolean;      // she holds the microphone and words come out
  ribbon?: boolean;   // Barka da dawowa over her head
  cue?: boolean;      // the hint fades in, Ci gaba glows
}

/** Where each named lesson sits: one even arc over her head, and which way she points at it. */
const ARC: Record<string, { x: number; y: number; r: number; dir: string }> = {
  letters: { x: 12.4, y: 36.4, r: -10, dir: 'l' },
  read:    { x: 27.1, y: 23.1, r: -6,  dir: 'u' },
  spell:   { x: 50.0, y: 18.0, r: 0,   dir: 'u' },
  things:  { x: 72.9, y: 23.1, r: 6,   dir: 'r' },
  numbers: { x: 87.6, y: 36.4, r: 10,  dir: 'r' },
};
const ARC_ORDER = ['letters', 'read', 'spell', 'things', 'numbers'];

/** The first day: who she is, what the two of you will learn, and what to press. Once in a child's life. */
const INTRO: Beat[] = [
  { key: 's_w_name',     pose: 'wave' },
  { key: 's_w_together', pose: 'open', orbit: true },
  { key: 's_w_have',     pose: 'open', fan: true },
  { key: 's_w_l1',       fan: true, hot: ['letters'] },
  { key: 's_w_l2',       fan: true, hot: ['read', 'spell'] },
  { key: 's_w_l3',       fan: true, hot: ['numbers'] },
  { key: 's_w_l4',       fan: true, hot: ['things'] },
  { key: 's_w_more',     fan: true, hot: ARC_ORDER, stars: true, pose: 'both' },
  { key: 's_w_talk',     pose: 'mic', mic: true },
  { key: 's_go',         pose: 'self', cue: true },
];

/** Every day after: the greeting and the cue, nothing else on screen. The face screen has already said
 *  "Sannu, <name>! Barka da dawowa!" aloud, so this one shows the ribbon rather than repeating the words. */
const BACK: Beat[] = [
  { key: 's_b_glad', pose: 'both', ribbon: true },
  { key: 's_b_cont', pose: 'open' },
  { key: 's_go',     pose: 'self', cue: true },
];

/**
 * Screen 4 · Barka da zuwa. Straight after the face screen has greeted them by name: a new child hears what this place
 * is, a returning child hears four seconds of welcome back. Laila is the button throughout — a press at any moment
 * cuts her off and opens the chooser (Sani 2026-09-18).
 */
@Component({
  selector: 'app-welcome',
  imports: [Ear, Laila],
  host: { class: 's welcome', '[attr.data-gender]': 'session.g()' },
  template: `
<app-ear (pressed)="run()" />
<div class="deco"><b>a</b><b>b</b><b>c</b><b>d</b></div>

@if (fan()) {
  <div class="warc" [class.settled]="settled()">
    @for (k of ARC_ORDER; track k) {
      <span class="wtile" [class.hot]="isHot(k)" [class.cold]="cold(k)"
            [style.--px.%]="ARC[k].x" [style.--py.%]="ARC[k].y" [style.--r.deg]="ARC[k].r" [style.--sc]="scale()"
            [style.--c]="'var(--' + COLOR[k] + ')'" [innerHTML]="tile(k)"></span>
    }
  </div>
  @if (spark(); as s) { <span class="wspark" [style.--px.%]="s.x" [style.--py.%]="s.y" [innerHTML]="s.html"></span> }
}
@if (orbit()) { <div class="worb">@for (c of ORB; track c.ch) { <b [style.transform]="c.t" [style.color]="c.col">{{ c.ch }}</b> }</div> }
@if (stars()) { <span class="wstars">@for (p of STARS; track p.l) { <b [style.left.%]="p.l" [style.top.%]="p.t" [style.animation-delay]="p.d">✨</b> }</span> }
@if (ribbon()) { <div class="wribbon">Barka da dawowa!</div> }

<button class="startlaila" [class.talking]="talking()" [class.cue]="cue()" aria-label="Danna Laila mu fara" (click)="go()">
  <span class="meethalo"></span><span class="tapring"></span>
  @if (mic()) { <span class="wmic">🎙️</span>
    <span class="wwords">@for (w of WORDS; track w.t) { <b [style.--dx.cqw]="w.dx" [style.animation-delay]="w.d">{{ w.t }}</b> }</span> }
  <app-laila [size]="210" [cls]="'meet-lm point-' + pose()" />
  <span class="meet-hand" [class.now]="cue()">👆🏾</span>
</button>

<div class="pr" style="font-size:clamp(22px,3vw,30px)">Sunana Laila</div>
<div class="starthint" [class.show]="cue()">{{ session.g() === 'f' ? 'Ki danna kan Laila mu fara' : 'Ka danna kan Laila mu fara' }}<br><small>click Laila to start</small></div>
<button class="go" [class.cue]="cue()" (click)="go()"><span class="tri"></span> Ci gaba</button>`,
})
export class WelcomeScreen implements OnInit, OnDestroy {
  readonly session = inject(SessionService);
  private readonly bus = inject(AudioBus);
  private readonly router = inject(Router);
  private readonly san = inject(DomSanitizer);

  readonly ARC = ARC; readonly ARC_ORDER = ARC_ORDER;
  readonly COLOR: Record<string, string> = { letters: 'red', read: 'teal', spell: 'purple', things: 'blue', numbers: 'green' };
  readonly ORB = ['A', 'B', 'C', 'D', 'E', 'F'].map((ch, i, a) => {
    const deg = (360 / a.length) * i, col = ['#E63946', '#FBC02D', '#2FAE9E', '#1FA1D8', '#8A5FBF', '#4CAF50'][i];
    return { ch, col, t: `rotate(${deg}deg) translate(25cqw,0) rotate(${-deg}deg)` };
  });
  readonly STARS = [[14, 20], [30, 10], [50, 8], [70, 12], [86, 22], [92, 54], [24, 62], [76, 68], [10, 42], [62, 26]]
    .map((p, i) => ({ l: p[0], t: p[1], d: (i % 5) * 0.22 + 's' }));
  readonly WORDS = [{ t: 'Sannu', dx: 7, d: '0s' }, { t: 'A', dx: -6, d: '.7s' }, { t: 'Akuya', dx: 12, d: '1.4s' }];

  readonly beat = signal(-1);
  readonly talking = signal(false);
  private seq = 0;
  private script: Beat[] = INTRO;
  /** the chooser's own tile markup, cut out of the grid the next screen draws */
  private readonly tiles = new Map<string, ReturnType<DomSanitizer['bypassSecurityTrustHtml']>>();

  private at(): Beat | null { const i = this.beat(); return i >= 0 && i < this.script.length ? this.script[i] : null; }
  fan(): boolean { return !!this.at()?.fan; }
  orbit(): boolean { return !!this.at()?.orbit; }
  stars(): boolean { return !!this.at()?.stars; }
  mic(): boolean { return !!this.at()?.mic; }
  ribbon(): boolean { return !!this.at()?.ribbon; }
  cue(): boolean { return !!this.at()?.cue; }
  settled(): boolean { const b = this.at(); return !!b?.fan && !!b?.hot; }
  isHot(k: string): boolean { return !!this.at()?.hot?.includes(k); }
  cold(k: string): boolean { const h = this.at()?.hot; return !!h && !h.includes(k); }
  scale(): number { const n = this.at()?.hot?.length || 0; return n === 1 ? 1.4 : n === 2 ? 1.3 : n > 2 ? 1.14 : 1; }
  /** she points with the wing on the side of whatever she is naming, or holds her own pose */
  pose(): string {
    const b = this.at(); if (!b) return '';
    if (b.hot && b.hot.length === 1) return ARC[b.hot[0]].dir;
    if (b.hot && b.hot.length === 2) return 'u';
    return b.pose || '';
  }
  spark(): { x: number; y: number; html: unknown } | null {
    const b = this.at(); if (!b?.hot || b.hot.length !== 1) return null;
    const k = b.hot[0], q = ARC[k];
    const chars = k === 'letters' ? ['A', 'B', 'C', 'D'] : k === 'numbers' ? ['1', '2', '3'] : null;
    if (!chars) return null;
    const cols = ['#E63946', '#1FA1D8', '#4CAF50', '#FBC02D'];
    const html = chars.map((c, i) => {
      const a = -140 + i * 55;
      return `<b style="--dx:${(Math.cos(a * Math.PI / 180) * 13).toFixed(1)}cqw;--dy:${(Math.sin(a * Math.PI / 180) * 13).toFixed(1)}cqh;color:${cols[i % 4]};animation-delay:${i * 0.22}s">${c}</b>`;
    }).join('');
    return { x: q.x, y: q.y, html: this.san.bypassSecurityTrustHtml(html) };
  }
  /** the chooser's real tile for this lesson, so the child meets the same thing twice */
  tile(k: string): unknown {
    if (!this.tiles.has(k)) {
      const host = document.createElement('div'); host.innerHTML = HOMEGRID_HTML;
      const el = host.querySelector<HTMLElement>(`.htile[data-act="${k}"]`);
      this.tiles.set(k, this.san.bypassSecurityTrustHtml(el ? el.innerHTML : ''));
    }
    return this.tiles.get(k);
  }

  ngOnInit(): void {
    this.script = this.session.known() ? BACK : INTRO;
    afterPaint().then(() => this.run());
  }
  ngOnDestroy(): void { this.bus.stopAll(); }

  /** The whole welcome, line by line. The ear starts it again from the top. */
  async run(): Promise<void> {
    const my = ++this.seq;
    this.talking.set(true);
    for (let i = 0; i < this.script.length; i++) {
      this.beat.set(i);
      const ok = await this.bus.play(this.bus.gk(this.script[i].key));
      if (my !== this.seq) return;          // she was pressed, or the ear started it again
      if (!ok) break;                        // autoplay refused: leave the cue on screen
    }
    if (my !== this.seq) return;
    this.beat.set(this.script.length - 1);   // hold the last frame: hand, hint, Ci gaba
    this.talking.set(false);
  }
  /** Pressing her at any moment cuts her off and opens the chooser. */
  go(): void { this.seq++; this.bus.stopAll(); this.router.navigate(['/home']); }
}
