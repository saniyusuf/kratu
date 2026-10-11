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
import { LessonId, ProgressService } from '../../core/state/progress.service';
import { CourseBook } from '../../shared/book/book';

const ROUTE: Record<string, string> = { letters: 'haruffa/koyo', things: 'abubuwa', spell: 'rubutu', numbers: 'lambobi', quiz: 'nemo', read: 'karatu' };
const LESSON: Record<string, LessonId> = { letters: 'haruffa', things: 'abubuwa', quiz: 'nemo', numbers: 'lambobi', read: 'karatu', spell: 'rubutu' };
const BOOK_ROUTE: Record<LessonId, string> = { haruffa: 'haruffa/koyo', abubuwa: 'abubuwa', nemo: 'nemo', lambobi: 'lambobi', karatu: 'karatu', rubutu: 'rubutu' };
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
<app-course-book (pressed)="book()" />
<div #gridHost style="display:contents" [innerHTML]="grid" (click)="tile($event)"></div>
<div class="lrow"><button class="lbtn" [class.cue]="cue()" aria-label="Danna kan Laila" (click)="start()"><span class="lglow"></span><app-laila [size]="110" /><span class="lhand">👆🏾</span><span class="lhint">Fara</span></button></div>
<app-leave />`,
})
export class HomeScreen implements OnInit, OnDestroy {
  private readonly bus = inject(AudioBus);
  private readonly flow = inject(LessonFlow);
  private readonly session = inject(SessionService);
  private readonly progress = inject(ProgressService);
  private readonly leaveBox = viewChild.required(Leave);
  readonly grid = inject(DomSanitizer).bypassSecurityTrustHtml(HOMEGRID_HTML);
  private readonly gridHost = viewChild.required<ElementRef<HTMLElement>>('gridHost');
  readonly act = signal<string | null>(null);
  readonly cue = signal(false);

  ngOnInit(): void { afterPaint().then(() => { this.marks(); this.arrive(); }); }
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
    await this.bus.play(this.invite());
  }
  /** A new child is told to press the book to start, a returning one to press it to continue; until those lines are
   *  recorded, the old "pick a lesson". */
  private invite(): string {
    const k = this.bus.gk(this.progress.started() ? 'app_book_more' : 'app_book_start');
    return this.bus.has(k) ? k : 'app_act_pick';
  }
  ngOnDestroy(): void { clearTimeout(this.leaving); this.bus.stopAll(); }
  pick(): void { this.bus.play(this.invite()); }
  /** The book opens the next lesson on the path: the first one open and not finished. */
  book(): void {
    this.bus.stopAll(); this.cue.set(false); const to = BOOK_ROUTE[this.progress.next()];
    clearTimeout(this.leaving); this.leaving = window.setTimeout(() => this.flow.open(to), 700);   // the pictures jump first
  }
  private leaving = 0;

  tile(e: Event): void {
    const t = (e.target as HTMLElement).closest('.htile') as HTMLElement | null; if (!t) return;
    const host = this.gridHost().nativeElement; host.querySelectorAll('.htile').forEach((x) => x.classList.toggle('hot', x === t)); host.querySelector('.homegrid')?.classList.add('has-sel');
    const act = t.dataset['act'] || ''; this.act.set(act); this.cue.set(false);
    let k = 'app_act_desc_' + act; if (!this.bus.has(k)) k = FALLBACK[act] || k;
    this.bus.play(k).then((ok) => { if (!ok) return; this.cue.set(true); this.bus.play('app_w_tap_white'); });
  }
  start(): void {
    const act = this.act(); if (!act) return;
    this.bus.stopAll(); this.cue.set(false);
    this.flow.open(ROUTE[act] || 'home');
  }
  leave(): void { this.leaveBox().show(); }
}
