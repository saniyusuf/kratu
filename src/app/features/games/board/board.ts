import { AfterViewInit, Component, ElementRef, OnDestroy, computed, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { afterPaint } from '../../../shared/paint';
import { AudioBus } from '../../../core/audio/audio-bus.service';
import { SessionService } from '../../../core/state/session.service';
import { ZoomService } from '../../../core/zoom/zoom.service';
import { Door, Ear } from '../../../shared/chrome/chrome';
import { Laila } from '../../../shared/laila/laila';
import { Spotter } from '../../../shared/lesson/helpers';
import { BOOK_COVER_SVG } from '../../../shared/book/book-svg';
import { GAME_LIST } from '../lab/game-list';

/** The games in board order (Sani 2026-11-06): letters, things, reading, spelling, numbers. `line` is the game's
 *  description; its Hausa is still to come from Sani, so `en` is the stand-in shown as the subtitle meanwhile. */
const ORDER: { id: string; line: string; en: string }[] = [
  { id: 'j-durbar', line: 'gd_hawan', en: "The Sallah riders are coming! Say each letter as its horseman rides past." },
  { id: 'fashe', line: 'gd_fashe', en: "Letters float up in balloons. Pop the letter Laila says." },
  { id: 'j-nemo', line: 'gd_hanzarin', en: "Help the market woman: quickly find the food Laila names." },
  { id: 'j-abubuwa', line: 'gd_kifi', en: "Go fishing: catch the fish that carries the right picture." },
  { id: 'j-magana', line: 'gd_kalangu', en: "Beat the drum when you hear the right word." },
  { id: 'j-shayi', line: 'gd_shayi', en: "Run the tea stall: serve each customer the thing they ask for." },
  { id: 'j-dillali', line: 'gd_dillali', en: "Be the auctioneer: say the name of each thing to sell it." },
  { id: 'j-gyada', line: 'gd_dalar', en: "Load the groundnut sacks onto the lorry and count them." },
  { id: 'j-suya', line: 'gd_suya', en: "Sell suya at the night market and count the money." },
  { id: 'j-allo', line: 'gd_allo', en: "Read the word on the allo board to the class." },
  { id: 'j-jirgi', line: 'gd_jirgi', en: "Read the word on each boat to let it sail." },
  { id: 'j-karatu', line: 'gd_kwale', en: "Read the word on the canoe to paddle across the river." },
  { id: 'j-ruwa', line: 'gd_ruwa', en: "Read the word on the storm cloud so the rain makes the millet grow." },
  { id: 'j-rubutu', line: 'gd_tukwane', en: "Spell the word with the letter pots." },
  { id: 'j-rubutu-say', line: 'gd_bulo', en: "Spell the word brick by brick to build the wall." },
  { id: 'j-marubuci', line: 'gd_marubuci', en: "Help the letter writer spell the word on the envelope." },
  { id: 'j-rini', line: 'gd_karofi', en: "Spell the word by dyeing each letter cloth in the Kano dye pits." },
  { id: 'j-shanu', line: 'gd_shanu', en: "Find the cow with the right price at the cattle market." },
  { id: 'j-garke', line: 'gd_garke', en: "Count the cattle as they go into the kraal." }
];
/** Games whose scene has a second still: the preview crossfades between the two. */
const TWO = new Set(['j-rini', 'j-ruwa']);
/** Cards an arrow press moves the strip by, and a card's width plus the gap after it (design px). */
const STEP = 3, CARD = 194;

interface Game { id: string; name: string; line: string; en: string; pic: string; pic2: string | null; q?: Record<string, string>; }

/**
 * Wasanni, the games board, layout 1 (Sani 2026-11-06): a preview screen on top showing the picked game's scene with a
 * slow drift, its name on a band along the bottom and a big green play button; under it a strip of all 19 games with
 * real arrows, three cards a press. Pressing a card picks it (gold edge, a little lift): the preview swaps to it and
 * Laila describes it. Only the play button, or the preview itself, opens the game, in free play; leaving or finishing
 * it comes back here. The first card is picked on arrival. Every game is on it and every one can be played.
 * The bottom-right corner holds the book: it, and the door, go home, the board shrinking back into the corner it grew
 * from (ScreenTransition 'grow').
 */
@Component({
  selector: 'app-games-board',
  imports: [Door, Ear, Laila],
  host: { class: 's lesson wasanni' },
  template: `
<app-door (pressed)="home()" />
<app-ear (pressed)="arrive()" />
<div class="wprev" role="button" [attr.aria-label]="sel().name" (click)="play()">
  @for (g of [sel()]; track g.id) {
    <div class="wscene" [class.two]="!!g.pic2"><img class="wkb" [src]="g.pic" alt="">@if (g.pic2) {<img class="wkb wkb2" [src]="g.pic2" alt="">}</div>
    <div class="wband"><b>{{ g.name }}</b>@if (session.captions()) {<small>{{ g.en }}</small>}</div>
  }
  <button class="wplay" aria-label="Fara wasa" (click)="play(); $event.stopPropagation()"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg></button>
</div>
<div class="wstrip">
  <button class="warr" aria-label="Baya" [disabled]="at() <= 0" (click)="slide(-1)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
  <div class="wview fitbox">
    <div class="wrail" [style.transform]="'translateX(' + (-at() * card + dx()) + 'px)'" [class.drag]="dragging()">
      @for (g of games; track g.id) {<button class="wcard" [class.on]="g.id === sel().id" [attr.aria-label]="g.name" (click)="pick(g)"><img [src]="g.pic" alt=""><b>{{ g.name }}</b></button>}
    </div>
  </div>
  <button class="warr" aria-label="Gaba" [disabled]="at() >= last()" (click)="slide(1)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>
</div>
<div class="lrow"><span class="wlaila" [class.talk]="talking()"><app-laila [size]="120" /></span></div>
<button class="wbook" aria-label="Littafi" (click)="home()"><span class="wbookic" [innerHTML]="bookSvg"></span></button>`,
})
export class GamesBoard implements AfterViewInit, OnDestroy {
  private readonly bus = inject(AudioBus);
  private readonly router = inject(Router);
  readonly session = inject(SessionService);
  private readonly zoom = inject(ZoomService);
  private readonly hostEl = inject(ElementRef) as ElementRef<HTMLElement>;
  private readonly spotter = new Spotter(this.hostEl.nativeElement, this.zoom);
  readonly bookSvg = inject(DomSanitizer).bypassSecurityTrustHtml(BOOK_COVER_SVG);
  readonly card = CARD;
  readonly games: Game[] = ORDER.map((o) => {
    const g = GAME_LIST.find((x) => x.id === o.id);
    return { ...o, name: g?.name || o.id, q: g?.q, pic: 'assets/games/' + o.id + '.webp', pic2: TWO.has(o.id) ? 'assets/games/' + o.id + '-2.webp' : null };
  });
  readonly sel = signal<Game>(this.games[0]);
  /** The first card showing at the strip's left edge. */
  readonly at = signal(0);
  /** How many cards fit in the strip's window, measured once it is drawn. */
  private readonly fits = signal(4);
  readonly last = computed(() => Math.max(0, this.games.length - this.fits()));
  readonly dx = signal(0); readonly dragging = signal(false);
  readonly talking = signal(false);
  private asks = 0; private dead = false; private talkTimer = 0; private readonly off: (() => void)[] = [];

  ngAfterViewInit(): void {
    const v = this.hostEl.nativeElement.querySelector<HTMLElement>('.wview');
    if (v) { this.fits.set(Math.max(1, Math.floor((v.offsetWidth + 14) / CARD))); this.swipe(v); }
    afterPaint().then(() => this.arrive());
  }
  ngOnDestroy(): void { this.dead = true; this.asks++; clearTimeout(this.talkTimer); this.spotter.unspot(); this.bus.stopAll(); this.off.forEach((f) => f()); }

  /** Arrival, and the ear: "we are going to play a little game" (no games line is recorded yet), then the picked
   *  game's description; the first time only, the hand shows the book in the corner, with "to go home, press the book"
   *  once Sani has given its Hausa (s_wb_home, planned). */
  async arrive(): Promise<void> {
    const mine = ++this.asks; this.spotter.unspot();
    if (!(await this.say('s_gate_play', mine))) return;
    if (!(await this.describe(mine))) return;
    if (!this.session.once('wbhome')) return;
    this.spotter.spot(this.hostEl.nativeElement.querySelector('.wbook'), 'left');
    const k = this.bus.gk('s_wb_home');
    if (this.bus.has(k)) await this.bus.play(k); else await new Promise((r) => setTimeout(r, 3000));
    if (mine === this.asks) this.spotter.unspot();
  }
  /** Laila says a line with her talking glow. A description with no clip yet (its Hausa is still to come) is a silent
   *  glow of about 3.5 s, with the English as the subtitle. Resolves false when a newer press took over. */
  private say(key: string, mine: number): Promise<boolean> {
    clearTimeout(this.talkTimer); this.talking.set(true);
    const k = this.bus.gk(key);
    const done = this.bus.has(k) ? this.bus.play(k) : new Promise<boolean>((r) => { this.bus.stopAll(); this.talkTimer = window.setTimeout(() => r(true), 3500); });
    return done.then((ok) => { if (mine === this.asks) this.talking.set(false); return ok && mine === this.asks && !this.dead; });
  }
  private describe(mine: number): Promise<boolean> { return this.say(this.sel().line, mine); }

  /** A card picks its game: the preview swaps to it and Laila describes it. It does not start the game. */
  pick(g: Game): void {
    if (this.moved) return;
    this.spotter.unspot(); this.sel.set(g);
    const mine = ++this.asks; this.describe(mine);
  }
  /** An arrow moves the strip three cards. */
  slide(d: number): void { this.at.set(Math.max(0, Math.min(this.last(), this.at() + d * STEP))); }
  /** The play button, or the preview itself: the picked game in free play, the way the settings list opens it. */
  play(): void {
    const g = this.sel(); this.asks++; this.bus.stopAll(); this.spotter.unspot();
    this.router.navigate(g.id === 'fashe' ? ['/fashe'] : ['/wasanni', g.id], { queryParams: { ...(g.q || {}), from: 'wasanni' } });
  }
  home(): void { this.asks++; this.bus.stopAll(); this.spotter.unspot(); this.router.navigate(['/home']); }

  /** A swipe (finger or mouse) drags the strip and lands on the nearest card; a swipe is never a press. */
  private moved = false;
  private swipe(v: HTMLElement): void {
    let x0: number | null = null;
    const down = (e: PointerEvent) => { x0 = e.clientX; this.moved = false; };
    const move = (e: PointerEvent) => {
      if (x0 == null) return; const d = (e.clientX - x0) / (this.zoom.z() || 1);
      if (!this.moved && Math.abs(d) < 8) return;
      this.moved = true; this.dragging.set(true); this.dx.set(d);
    };
    const up = () => {
      if (x0 == null) return; x0 = null;
      if (this.moved) { const n = Math.round(this.at() - this.dx() / CARD); this.at.set(Math.max(0, Math.min(this.last(), n))); setTimeout(() => (this.moved = false), 0); }
      this.dx.set(0); this.dragging.set(false);
    };
    v.addEventListener('pointerdown', down); addEventListener('pointermove', move); addEventListener('pointerup', up); addEventListener('pointercancel', up);
    this.off.push(() => { v.removeEventListener('pointerdown', down); removeEventListener('pointermove', move); removeEventListener('pointerup', up); removeEventListener('pointercancel', up); });
  }
}
