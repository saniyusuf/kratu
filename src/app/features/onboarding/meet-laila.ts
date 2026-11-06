import { Component, ElementRef, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { afterPaint } from '../../shared/paint';
import { AudioBus } from '../../core/audio/audio-bus.service';
import { Ear } from '../../shared/chrome/chrome';
import { Spotter, hintOnce } from '../../shared/lesson/helpers';
import { SessionService } from '../../core/state/session.service';
import { ZoomService } from '../../core/zoom/zoom.service';
import { Laila } from '../../shared/laila/laila';
import { t } from '../../core/lang/t';

/** Screen 2 · Meet Laila. She introduces herself; she is pressable while she talks, a press cuts her off and goes on. */
@Component({
  selector: 'app-meet-laila',
  imports: [Ear, Laila],
  host: { class: 's meetlaila' },
  template: `
<app-ear (pressed)="intro()" />
<div class="deco"><b>a</b><b>b</b><b>c</b><b>d</b></div>
<button class="startlaila" [class.cue]="cue()" [class.talking]="talking()" [attr.aria-label]="t('Danna Laila mu fara')" (click)="go()">
  <span class="startring"></span>
  <span class="meethalo"></span><app-laila [size]="210" cls="meet-lm" />
  @if (cue()) {<span class="meet-hand">👆🏾</span>}
</button>
<div class="pr" style="font-size:clamp(22px,3vw,30px)">{{ t('Sunana Laila') }}</div>
<div class="starthint">{{ t('Danna kan Laila mu fara') }}<br><small>{{ t('click Laila to start') }}</small></div>
<button class="go" [class.cue]="cue()" (click)="go()"><span class="tri"></span> {{ t('Ci gaba') }}</button>`,
})
export class MeetLailaScreen implements OnInit, OnDestroy {
  readonly t = t;
  private readonly session = inject(SessionService);
  private readonly hostEl = inject(ElementRef) as ElementRef<HTMLElement>;
  private readonly spotter = new Spotter(this.hostEl.nativeElement, inject(ZoomService));
  private readonly bus = inject(AudioBus);
  private readonly router = inject(Router);
  /** While she says who she is, she is the emphasis; the hand and the two glows come only when it is time to press (Sani 16 Sep). */
  readonly cue = signal(false);
  readonly talking = signal(false);
  private seq = 0;
  ngOnInit(): void { afterPaint().then(() => this.intro()); }
  ngOnDestroy(): void { this.bus.stopAll(); }
  async intro(): Promise<void> {
    const my = ++this.seq; this.cue.set(false); this.talking.set(true);
    const ok = await this.bus.play(this.bus.gk('s_laila2'));
    if (my !== this.seq) return;   // the ear started the line again: that run owns the screen now
    // a child who pressed a gender before Laila got to the ear hears about it here instead (Sani 2026-10-12)
    if (ok) { await hintOnce('ear', this.bus, this.session, this.spotter, this.hostEl.nativeElement); if (my !== this.seq) return; }
    this.talking.set(false); this.cue.set(true);
  }
  go(): void { this.seq++; this.spotter.unspot(); this.bus.stopAll(); this.router.navigate(['/face']); }
}
