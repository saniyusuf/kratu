import { AfterViewInit, Component, ElementRef, OnDestroy, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { afterPaint } from '../../../shared/paint';
import { AudioBus } from '../../../core/audio/audio-bus.service';
import { CourseService } from '../../../core/state/course.service';
import { ProgressService } from '../../../core/state/progress.service';
import { SessionService } from '../../../core/state/session.service';
import { ZoomService } from '../../../core/zoom/zoom.service';
import { Door, Ear } from '../../../shared/chrome/chrome';
import { Laila } from '../../../shared/laila/laila';
import { Spotter } from '../../../shared/lesson/helpers';
import { BOOK_COVER_SVG } from '../../../shared/book/book-svg';
import { GAME_LIST } from '../lab/game-list';
import { BOARD_GAMES, KINDS, KIND_COLOUR, Kind, cardSvg, headHtml } from './frames';

interface Row { k: Kind; colour: string; head: SafeHtml; games: { id: string; name: string; svg: SafeHtml }[]; }

/**
 * Wasanni, the games board (Sani 2026-11-05): a row for each kind of game — letters, things, reading, spelling, numbers —
 * each opening with a picture of what it practises and scrolling sideways on its own; the rows scroll up and down when
 * they do not fit. Only the games the child has WON are on it (passed in the course; in the settings simulator, every
 * game step before the simulated one); a row with none is left out, and a child with none sees each row's empty frames.
 * A card opens its game in free play, and leaving or finishing it comes back here. The bottom-right corner holds the
 * book: it, and the door, go home, the board shrinking back into the corner it grew from (ScreenTransition 'grow').
 */
@Component({
  selector: 'app-games-board',
  imports: [Door, Ear, Laila],
  host: { class: 's lesson wasanni' },
  template: `
<app-door (pressed)="home()" />
<app-ear (pressed)="arrive()" />
<div class="wrows fitbox">
  @for (r of rows; track r.k; let ri = $index) {
    <div class="wrow" [style.--r]="ri">
      <span class="whead" [style.background]="r.colour" [innerHTML]="r.head"></span>
      <div class="wrail">
        @for (g of r.games; track g.id; let ci = $index) {<button class="wcard" [style.--c]="ci" [attr.aria-label]="g.name" [innerHTML]="g.svg" (click)="play(g.id)"></button>}
        @if (!r.games.length) {@for (e of empties; track e) {<span class="wcard wempty" [style.--c]="e"></span>}}
      </div>
    </div>
  }
</div>
<div class="lrow"><app-laila [size]="100" /></div>
<button class="wbook" aria-label="Littafi" (click)="home()"><span class="wbookic" [innerHTML]="bookSvg"></span></button>`,
})
export class GamesBoard implements AfterViewInit, OnDestroy {
  private readonly bus = inject(AudioBus);
  private readonly router = inject(Router);
  private readonly course = inject(CourseService);
  private readonly progress = inject(ProgressService);
  private readonly session = inject(SessionService);
  private readonly zoom = inject(ZoomService);
  private readonly san = inject(DomSanitizer);
  private readonly hostEl = inject(ElementRef) as ElementRef<HTMLElement>;
  private readonly spotter = new Spotter(this.hostEl.nativeElement, this.zoom);
  readonly bookSvg = this.san.bypassSecurityTrustHtml(BOOK_COVER_SVG);
  readonly empties = [0, 1, 2];
  readonly rows: Row[] = this.build();
  private asks = 0; private dead = false; private readonly off: (() => void)[] = [];

  /** The games this child has won: a game step of the course passed (or the game passed outside the course), and in
   *  the simulator every game step before the simulated one. */
  private won(): Set<string> {
    const at = this.course.at(), out = new Set<string>();
    for (const s of this.course.steps) {
      if (s.t !== 'game' || !s.game || !BOARD_GAMES[s.game]) continue;
      if (this.progress.passed('s' + s.n) || this.progress.passed('g' + s.game) || (at != null && s.n < at)) out.add(s.game);
    }
    return out;
  }
  private build(): Row[] {
    const won = this.won(), any = won.size > 0;
    return KINDS.map((k) => ({
      k, colour: KIND_COLOUR[k], head: this.san.bypassSecurityTrustHtml(headHtml(k)),
      games: GAME_LIST.filter((g) => won.has(g.id) && BOARD_GAMES[g.id]?.kind === k)
        .map((g) => ({ id: g.id, name: g.name, svg: this.san.bypassSecurityTrustHtml(cardSvg(g.id, g.name)) })),
    })).filter((r) => !any || r.games.length);   // none won yet: every row, with its empty frames
  }

  ngAfterViewInit(): void {
    const s = this.hostEl.nativeElement;
    s.querySelectorAll<HTMLElement>('.wrail').forEach((el) => this.drag(el, 'x'));
    const v = s.querySelector<HTMLElement>('.wrows'); if (v) this.drag(v, 'y');
    afterPaint().then(() => this.arrive());
  }
  ngOnDestroy(): void { this.dead = true; this.asks++; this.spotter.unspot(); this.bus.stopAll(); this.off.forEach((f) => f()); }

  /** Laila's line on arrival, and the ear's. There is no recorded "pick a game" line yet: she says "we are going to play
   *  a little game" (s_gate_play). The first time only, the hand shows the book in the corner, with "to go home, press
   *  the book" once Sani has given its Hausa (s_wb_home, planned). */
  async arrive(): Promise<void> {
    const mine = ++this.asks; this.spotter.unspot();
    if (!(await this.bus.play('s_gate_play')) || mine !== this.asks || this.dead) return;
    if (!this.session.once('wbhome')) return;
    this.spotter.spot(this.hostEl.nativeElement.querySelector('.wbook'), 'left');
    const k = this.bus.gk('s_wb_home');
    if (this.bus.has(k)) await this.bus.play(k); else await new Promise((r) => setTimeout(r, 3000));
    if (mine === this.asks) this.spotter.unspot();
  }
  home(): void { this.bus.stopAll(); this.spotter.unspot(); this.router.navigate(['/home']); }
  /** A card opens its game in free play, the way the settings list does; the game comes back here when it is done. */
  play(id: string): void {
    if (this.hostEl.nativeElement.querySelector('[data-dragged]')) return;
    const g = GAME_LIST.find((x) => x.id === id); this.bus.stopAll(); this.spotter.unspot();
    this.router.navigate(id === 'fashe' ? ['/fashe'] : ['/wasanni', id], { queryParams: { ...(g?.q || {}), from: 'wasanni' } });
  }

  /** Drag to scroll with the mouse (a finger scrolls natively), with a little momentum; a drag is never a press. */
  private drag(el: HTMLElement, axis: 'x' | 'y'): void {
    let d: { p: number; s: number; v: number; t: number; moved: boolean } | null = null, raf = 0;
    const pos = (e: PointerEvent) => (axis === 'x' ? e.clientX : e.clientY) / (this.zoom.z() || 1);
    const get = () => (axis === 'x' ? el.scrollLeft : el.scrollTop), set = (n: number) => { if (axis === 'x') el.scrollLeft = n; else el.scrollTop = n; };
    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      if (axis === 'y' && (e.target as HTMLElement).closest('.wrail')) return;   // a rail drags sideways
      cancelAnimationFrame(raf); d = { p: pos(e), s: get(), v: 0, t: performance.now(), moved: false };
      el.style.scrollSnapType = 'none';
    };
    const move = (e: PointerEvent) => {
      if (!d) return; const p = pos(e), dx = p - d.p, now = performance.now();
      if (Math.abs(dx) > 6) d.moved = true;
      const before = get(); set(d.s - dx); d.v = (get() - before) / Math.max(1, now - d.t); d.t = now;
    };
    const up = () => {
      if (!d) return; const { moved } = d; let v = d.v * 16; d = null;
      if (moved) { el.dataset['dragged'] = '1'; setTimeout(() => delete el.dataset['dragged'], 60); }
      const glide = () => { if (Math.abs(v) < .5) { el.style.scrollSnapType = ''; return; } set(get() + v); v *= .92; raf = requestAnimationFrame(glide); };
      raf = requestAnimationFrame(glide);
    };
    el.addEventListener('pointerdown', down); addEventListener('pointermove', move); addEventListener('pointerup', up);
    this.off.push(() => { cancelAnimationFrame(raf); el.removeEventListener('pointerdown', down); removeEventListener('pointermove', move); removeEventListener('pointerup', up); });
  }
}
