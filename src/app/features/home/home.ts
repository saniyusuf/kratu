import { Router } from '@angular/router';
import { Component, ElementRef, OnDestroy, OnInit, inject, signal, viewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { afterPaint } from '../../shared/paint';
import { AudioBus } from '../../core/audio/audio-bus.service';
import { LessonFlow } from '../../core/state/flow.service';
import { Door, Ear } from '../../shared/chrome/chrome';
import { Laila } from '../../shared/laila/laila';
import { HOMEGRID_HTML } from './homegrid';
import { Leave } from './leave';
import { SessionService } from '../../core/state/session.service';
import { PlanService } from '../../core/state/plan.service';
import { LessonId, ProgressService } from '../../core/state/progress.service';
import { CourseBook } from '../../shared/book/book';
import { ZoomService } from '../../core/zoom/zoom.service';
import { Spotter, hintOnce } from '../../shared/lesson/helpers';
import { ScreenTransition } from '../../core/nav/screen-transition.service';

const ROUTE: Record<string, string> = { letters: 'haruffa/koyo', things: 'abubuwa', spell: 'rubutu', numbers: 'lambobi', quiz: 'nemo', read: 'karatu' };
const LESSON: Record<string, LessonId> = { letters: 'haruffa', things: 'abubuwa', quiz: 'nemo', numbers: 'lambobi', read: 'karatu', spell: 'rubutu' };
/** How a met game shows on the home page's shelf. */
const GAME_ICON: Record<string, { name: string; ico: string }> = {
  fashe: { name: 'Fashe haruffa', ico: '🎈' }, 'j-durbar': { name: 'Hawan Sallah', ico: '🐎' }, 'j-abubuwa': { name: 'Kamun kifi', ico: '🐟' }, 'j-magana': { name: 'Kalangu', ico: '🥁' },
  'j-dillali': { name: 'Dillalin kasuwa', ico: '🔨' }, 'j-nemo': { name: 'Hanzarin kasuwa', ico: '🧺' }, 'j-shayi': { name: 'Mai shayi', ico: '☕' }, 'j-gyada': { name: 'Dalar gyaɗa', ico: '🥜' },
  'j-shanu': { name: 'Kasuwar shanu', ico: '🐄' }, 'j-garke': { name: 'Ƙirgen shanu', ico: '🐂' }, 'j-suya': { name: 'Mai suya', ico: '🍢' }, 'j-karatu': { name: 'Kwale-kwale', ico: '🛶' },
  'j-allo': { name: 'Allo', ico: '📜' }, 'j-jirgi': { name: 'Jirgin ruwa', ico: '⛵' }, 'j-rubutu': { name: 'Tukwane', ico: '🏺' }, 'j-rubutu-say': { name: 'Ginin bulo', ico: '🧱' }, 'j-marubuci': { name: 'Marubucin wasiƙa', ico: '✉️' },
};
const FALLBACK: Record<string, string> = { things: 's_act_desc_things', numbers: 's_n_intro', read: 's_k_intro2' };

/**
 * Screen 4 · Zaɓi darasi. The course book on top opens the next lesson of the path (Sani 2026-10-11); below it the six
 * tiles, in the order the curriculum opens them, each showing how far the child has come. A tap lifts one and Laila
 * describes it; press her to start it.
 */
@Component({
  selector: 'app-home',
  imports: [Door, Ear, Laila, Leave, CourseBook],
  host: { class: 's lesson home' },
  template: `
<app-door (pressed)="leave()" />
<app-ear (pressed)="pick()" />
<app-course-book [hold]="true" (pressed)="book()" (settled)="respot()" />
<div #gridHost style="display:contents" [innerHTML]="grid" (click)="tile($event)"></div>
<div class="lrow"><button class="lbtn" [class.cue]="cue()" aria-label="Danna kan Laila" (click)="start()"><span class="lglow"></span><app-laila [size]="110" />@if (cue()) {<span class="lhand">👆🏾</span>}<span class="lhint">Fara</span></button></div>
@if (games().length) {
  <button class="gamesbtn" [class.fresh]="gamesFresh()" aria-label="Wasanni" (click)="openGames()"><span class="gico">🎮</span><b>Wasanni</b><small>{{ games().length }}</small></button>
}
@if (shelf()) {
  <div class="gshelf" (click)="shelf.set(false)"><div class="gbox2" (click)="$event.stopPropagation()">
    <h3>Wasanni</h3>
    <div class="glist2">@for (g of games(); track g.id) {<button class="gcard" (click)="playGame(g.id)"><span class="gico">{{ g.ico }}</span><b>{{ g.name }}</b></button>}</div>
  </div></div>
}
<app-leave />`,
})
export class HomeScreen implements OnInit, OnDestroy {
  private readonly bus = inject(AudioBus);
  private readonly flow = inject(LessonFlow);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);
  /** What the plan says comes next: the book opens it, and so does Laila when no tile is picked. */
  private readonly step = inject(PlanService).next();
  private readonly progress = inject(ProgressService);
  private readonly hostEl = inject(ElementRef) as ElementRef<HTMLElement>;
  private readonly zoom = inject(ZoomService);
  private readonly nav = inject(ScreenTransition);
  private readonly spotter = new Spotter(this.hostEl.nativeElement, this.zoom);
  private pointing = false; private asks = 0;
  private readonly leaveBox = viewChild.required(Leave);
  private readonly courseBook = viewChild.required(CourseBook);
  readonly grid = inject(DomSanitizer).bypassSecurityTrustHtml(HOMEGRID_HTML);
  private readonly gridHost = viewChild.required<ElementRef<HTMLElement>>('gridHost');
  readonly act = signal<string | null>(null);
  /** The games this child has met: each one stays here to play any time (Sani 2026-10-22). */
  readonly games = signal(this.progress.games().map((id) => ({ id, ...(GAME_ICON[id] || { name: id, ico: '🎮' }) })));
  readonly gamesFresh = signal(this.progress.gamesNew());
  readonly shelf = signal(false);
  openGames(): void { this.bus.stopAll(); this.shelf.set(true); this.gamesFresh.set(false); this.progress.gamesSeen(); }
  playGame(id: string): void { this.bus.stopAll(); this.shelf.set(false); this.router.navigate(id === 'fashe' ? ['/fashe'] : ['/wasanni', id]); }
  readonly cue = signal(false);

  ngOnInit(): void { afterPaint().then(() => { this.marks(); this.arrive().finally(() => this.openBook()); }); }
  /** The book stays shut while she talks about it and opens once she has finished (Sani 2026-10-12); if the browser
   *  refused the sound, it waits a while before opening anyway. */
  private openBook(): void {
    clearTimeout(this.bookTimer);
    if (this.bus.blocked()) this.bookTimer = window.setTimeout(() => this.courseBook().begin(), 10000); else this.courseBook().begin();
  }
  private bookTimer = 0;
  /** Each tile's progress: the wave's height, the padlock, the medal. Locked tiles still open when pressed, for now. */
  private marks(): void {
    this.gridHost().nativeElement.querySelectorAll<HTMLElement>('.htile').forEach((t) => {
      const l = LESSON[t.dataset['act'] || '']; if (!l) return;
      const p = this.progress.share(l), open = this.progress.open(l);
      t.classList.toggle('lock', !open); t.classList.toggle('done', open && p >= 1); t.classList.toggle('zero', p <= 0);
      t.style.setProperty('--p', Math.round(p * 100) + '%');
    });
  }
  /** A sample session started from the settings is greeted first: "Sannu, Musa!" · the name · "Barka da zuwa!" */
  private async arrive(): Promise<void> {
    const g = this.session.greet();
    if (g) {
      this.session.greet.set(null);
      if (!(await this.bus.play('s_sannu'))) return;
      if (g.src && !(await this.bus.playRaw(g.src, { ha: g.name, en: g.name }))) return;
      if (!(await this.bus.play('s_welcome'))) return;
    }
    // then the door, the first time a child is on a screen that has one: "press this door to go back" (Sani 2026-10-12)
    if (await this.invite()) await hintOnce('door', this.bus, this.session, this.spotter, this.hostEl.nativeElement);
  }
  /** The book comes first (Sani 2026-10-11): the hand points at it and it glows while Laila invites the child to press it —
   *  to start for a new child, to continue for a returning one — and then she says the tiles can be picked too. */
  private async invite(): Promise<boolean> {
    const k = this.bus.gk(this.progress.started() ? 'app_book_more' : 'app_book_start');
    const mine = ++this.asks; this.pointAtBook(true);
    if (this.bus.has(k)) {
      const ok = await this.bus.play(k);
      // the ear may have asked again meanwhile, or a tap cut her off; a browser that refused the sound keeps the hand on the book
      if (!ok || mine !== this.asks) return false;
      // then the tiles: "you can tap any lesson to hear more" — all six glow and pulse together with the hand in their middle (Sani 2026-10-12)
      this.pointAtBook(false); this.pointAtTiles(true);
    }
    const or = this.bus.gk('app_book_or'), ok = await this.bus.play(this.bus.has(or) ? or : 'app_act_pick');
    if (mine === this.asks && !this.bus.blocked()) { this.pointAtBook(false); this.pointAtTiles(false); }
    return ok;
  }
  private pointAtBook(on: boolean): void {
    this.pointing = on; if (on) this.pointAtTiles(false);
    if (on) this.spotter.spot(this.hostEl.nativeElement.querySelector('.cbook'), 'right'); else this.spotter.unspot();
  }
  /** Every tile at once, and one hand in the middle of them pulsing in step: any of these can be tapped. */
  private pointAtTiles(on: boolean): void {
    const s = this.hostEl.nativeElement, g = s.querySelector<HTMLElement>('.homegrid');
    s.querySelector('.gridhand')?.remove(); g?.classList.remove('pickme');
    if (!on || !g) return;
    const sR = this.zoom.rect(s), r = this.zoom.rect(g), h = document.createElement('span');
    h.className = 'gridhand'; h.textContent = '👆🏾';
    h.style.left = (r.left + r.width / 2 - sR.left) + 'px'; h.style.top = (r.top + r.height / 2 - sR.top) + 'px';
    s.appendChild(h); g.classList.add('pickme');
  }
  /** The book slides to the middle as its cover opens; the hand follows it there. */
  respot(): void { if (this.pointing) this.pointAtBook(true); }
  ngOnDestroy(): void { clearTimeout(this.leaving); clearTimeout(this.bookTimer); this.pointAtTiles(false); this.spotter.unspot(); this.bus.stopAll(); }
  pick(): void { this.bus.stopAll(); this.invite(); }
  /** The book opens the plan's next step — the letters gate first, then whatever it decided (Sani 2026-10-11). */
  book(): void {
    this.bus.stopAll(); this.pointAtBook(false); this.pointAtTiles(false); this.cue.set(false);
    clearTimeout(this.leaving); this.leaving = window.setTimeout(() => { this.nav.plain(); this.next(); }, 150);   // just long enough to see it pressed; no slide
  }
  private next(): void {
    const c = this.step;
    if (c.category) this.session.category.set(c.category);
    if (c.query) { this.router.navigate(['/' + c.route], { queryParams: c.query }); return; }
    this.flow.open(c.route);
  }
  private leaving = 0;

  tile(e: Event): void {
    const t = (e.target as HTMLElement).closest('.htile') as HTMLElement | null; if (!t) return;
    const host = this.gridHost().nativeElement; host.querySelectorAll('.htile').forEach((x) => x.classList.toggle('hot', x === t)); host.querySelector('.homegrid')?.classList.add('has-sel');
    const act = t.dataset['act'] || ''; this.act.set(act); this.cue.set(false); this.pointAtBook(false); this.pointAtTiles(false);
    let k = 'app_act_desc_' + act; if (!this.bus.has(k)) k = FALLBACK[act] || k;
    this.bus.play(k).then((ok) => { if (!ok) return; this.cue.set(true); this.bus.play('app_w_tap_white'); });
  }
  start(): void {
    // A tapped tile still wins — free play is one tap — but with nothing tapped she opens the plan's own
    // next step instead of doing nothing, so a child who chooses nothing is still learning.
    const act = this.act();
    if (!act) { this.next(); return; }
    this.bus.stopAll(); this.cue.set(false);
    this.flow.open(ROUTE[act] || 'home');
  }
  leave(): void { this.leaveBox().show(); }
}
