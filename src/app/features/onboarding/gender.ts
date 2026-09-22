import { Component, ElementRef, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { afterPaint } from '../../shared/paint';
import { AudioBus } from '../../core/audio/audio-bus.service';
import { SessionService, Gender } from '../../core/state/session.service';
import { Ear } from '../../shared/chrome/chrome';
import { Spotter } from '../../shared/lesson/helpers';
import { ZoomService } from '../../core/zoom/zoom.service';

/** Screen 0 · Gender, always first: two photos, Laila greets and the ear repeats. */
@Component({
  selector: 'app-gender',
  imports: [Ear],
  host: { class: 's genderred', '[class.touring]': 'touring()' },
  template: `
<app-ear [spot]="spot() === 'dome'" (pressed)="tour()" />
<div class="deco"><b>a</b><b>b</b><b>c</b><b>d</b></div>
<div class="hi" style="font-size:clamp(26px,4vw,38px)">Sannu!</div>
<div class="mk"><span class="k">K</span><span class="r">r</span><span class="a">a</span><span class="t">t</span><span class="u">u</span></div>
<div class="cards2">
  <button class="pcard girl" [class.spot]="spot() === 'girl'" (click)="pick('f')"><img class="gph" alt="Mace" src="assets/gender-girl.webp"><div class="nm">Mace</div><span class="phand">👆🏾</span></button>
  <button class="pcard boy" [class.spot]="spot() === 'boy'" (click)="pick('m')"><img class="gph" alt="Namiji" src="assets/gender-boy.webp"><div class="nm">Namiji</div><span class="phand">👆🏾</span></button>
</div>`,
})
export class GenderScreen implements OnInit, OnDestroy {
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
    this.spot.set('dome'); this.spotter.spot(this.hostEl.nativeElement.querySelector('.helpdome'), 'left');
    await this.bus.play(this.bus.gk('s_ear'));
    this.spotter.unspot(); this.touring.set(false); this.spot.set('');
  }
  pick(g: Gender): void { this.bus.stopAll(); this.clear(); this.spotter.unspot(); this.touring.set(false); this.spot.set(''); this.session.setGender(g); this.router.navigate(['/laila']); }
  private clear(): void { this.timers.forEach((t) => clearTimeout(t)); this.timers = []; }
}
