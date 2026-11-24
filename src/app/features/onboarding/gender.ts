import { Component, ElementRef, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { afterPaint } from '../../shared/paint';
import { AudioBus } from '../../core/audio/audio-bus.service';
import { SessionService, Gender } from '../../core/state/session.service';
import { Door, Ear } from '../../shared/chrome/chrome';
import { FamilyService } from '../../core/family/family.service';
import { Spotter, hintOnce } from '../../shared/lesson/helpers';
import { ZoomService } from '../../core/zoom/zoom.service';
import { t } from '../../core/lang/t';
import { FAMILY } from '../../core/edition';

/** Screen 0 · Gender, always first: two photos, Laila greets and the ear repeats. */
@Component({
  selector: 'app-gender',
  imports: [Ear, Door],
  host: { class: 's genderred', '[class.touring]': 'touring()' },
  template: `
@if (FAMILY) { @if (!fam.ready()) { <app-door (pressed)="famBack()" /> }<button class="famguest" (click)="famGuest()"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.6"/><path d="M4.8 20.2c.9-3.9 3.7-6 7.2-6s6.3 2.1 7.2 6"/><path d="M17.6 3.6l.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5z" fill="currentColor"/></svg>Enter as guest</button> }
<app-ear [spot]="spot() === 'dome'" (pressed)="tour()" />
<div class="deco"><b>a</b><b>b</b><b>c</b><b>d</b></div>
<div class="hi" style="font-size:clamp(26px,4vw,38px)">{{ t('Sannu!') }}</div>
<div class="mk"><span class="k">K</span><span class="r">r</span><span class="a">a</span><span class="t">t</span><span class="u">u</span></div>
<div class="cards2">
  <button class="pcard girl" [class.spot]="spot() === 'girl'" (click)="pick('f')"><img class="gph" [alt]="t('Mace')" src="assets/gender-girl.webp"><div class="nm">{{ t('Mace') }}</div><span class="phand">👆🏾</span></button>
  <button class="pcard boy" [class.spot]="spot() === 'boy'" (click)="pick('m')"><img class="gph" [alt]="t('Namiji')" src="assets/gender-boy.webp"><div class="nm">{{ t('Namiji') }}</div><span class="phand">👆🏾</span></button>
</div>`,
})
export class GenderScreen implements OnInit, OnDestroy {
  readonly t = t;
  readonly FAMILY = FAMILY;
  readonly fam = inject(FamilyService);
  /** The family build (Sani 2026-11-23): the app's own door, back to the family's first page. Once a parent has set up
   *  (Sani 2026-11-24) boy/girl is the landing page: no door, and Back does nothing (stayOnBack). */
  famBack(): void { this.bus.stopAll(); this.fam.show('welcome'); }
  /** Guest (Sani 2026-11-23: on this screen only): home with everything open, nothing saved. */
  famGuest(): void { this.bus.stopAll(); this.fam.guest(); }
  private readonly bus = inject(AudioBus);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);
  private readonly zoom = inject(ZoomService);
  private readonly hostEl = inject(ElementRef) as ElementRef<HTMLElement>;
  private spotter!: Spotter;
  private readonly GREET_MS = 7518;
  private timers: ReturnType<typeof setTimeout>[] = [];
  readonly touring = signal(false);
  readonly spot = signal<'' | 'girl' | 'boy' | 'dome'>('');

  ngOnInit(): void { this.spotter = new Spotter(this.hostEl.nativeElement, this.zoom); afterPaint().then(() => this.tour()); }
  ngOnDestroy(): void { this.clear(); this.spotter?.unspot(); }

  /** Laila greets: the girl lights first, the boy at half-way, then the ear with "hear it again". */
  async tour(): Promise<void> {
    this.clear(); this.spotter.unspot(); this.touring.set(true); this.spot.set('girl');
    this.timers.push(setTimeout(() => this.spot.set('boy'), this.GREET_MS / 2));
    const ok = await this.bus.play('s0');
    this.clear();
    if (!ok) { this.spotter.unspot(); this.touring.set(false); this.spot.set(''); return; }
    // then the ear: it pulses with the pointing hand beside it while Laila says "press the ear to hear it again",
    // and both go with her voice — the same hand every lesson uses for the ear (Sani 16 Sep)
    await hintOnce('ear', this.bus, this.session, this.spotter, this.hostEl.nativeElement);
    this.touring.set(false); this.spot.set('');
  }
  pick(g: Gender): void { this.bus.stopAll(); this.clear(); this.spotter.unspot(); this.touring.set(false); this.spot.set(''); this.session.setGender(g); this.router.navigate([FAMILY ? '/face' : '/laila']); }   // the family build meets Laila after the animal (welcome), so the face comes straight after
  private clear(): void { this.timers.forEach((t) => clearTimeout(t)); this.timers = []; }
}
