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

const ROUTE: Record<string, string> = { letters: 'haruffa/koyo', things: 'abubuwa', spell: 'rubutu', numbers: 'lambobi', quiz: 'nemo', read: 'karatu' };
const FALLBACK: Record<string, string> = { things: 's_act_desc_things', numbers: 's_n_intro', read: 's_k_intro2' };

/** Screen 4 · Zaɓi darasi. Six tiles; a tap lifts one and Laila describes it; press her to start. */
@Component({
  selector: 'app-home',
  imports: [Door, Ear, Laila, Leave],
  host: { class: 's lesson home' },
  template: `
<app-door (pressed)="leave()" />
<app-ear (pressed)="pick()" />
<div class="ltitle">Zaɓi darasi</div>
<div #gridHost style="display:contents" [innerHTML]="grid" (click)="tile($event)"></div>
<div class="lrow"><button class="lbtn" [class.cue]="cue()" aria-label="Danna kan Laila" (click)="start()"><span class="lglow"></span><app-laila [size]="110" /><span class="lhand">👆🏾</span><span class="lhint">Fara</span></button></div>
<app-leave />`,
})
export class HomeScreen implements OnInit, OnDestroy {
  private readonly bus = inject(AudioBus);
  private readonly flow = inject(LessonFlow);
  private readonly session = inject(SessionService);
  private readonly leaveBox = viewChild.required(Leave);
  readonly grid = inject(DomSanitizer).bypassSecurityTrustHtml(HOMEGRID_HTML);
  private readonly gridHost = viewChild.required<ElementRef<HTMLElement>>('gridHost');
  readonly act = signal<string | null>(null);
  readonly cue = signal(false);

  ngOnInit(): void { afterPaint().then(() => this.arrive()); }
  /** A sample session started from the settings is greeted first: "Sannu, Musa!" · the name · "Barka da zuwa!" */
  private async arrive(): Promise<void> {
    const g = this.session.greet();
    if (g) {
      this.session.greet.set(null);
      if (!(await this.bus.play('s_sannu'))) return;
      if (g.src && !(await this.bus.playRaw(g.src, { ha: g.name, en: g.name }))) return;
      if (!(await this.bus.play('s_welcome'))) return;
    }
    await this.bus.play('app_act_pick');
  }
  ngOnDestroy(): void { this.bus.stopAll(); }
  pick(): void { this.bus.play('app_act_pick'); }

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
