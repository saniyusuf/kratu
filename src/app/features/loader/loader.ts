import { Component, inject, effect } from '@angular/core';
import { LoaderService } from '../../core/loader/loader.service';
import { AudioBus } from '../../core/audio/audio-bus.service';
import { ClipsService } from '../../core/clips/clips.service';
import { Laila } from '../../shared/laila/laila';
import { bi, EN_ON, t } from '../../core/lang/t';

/** The first screen: the Kratu word fills in letter by letter as the pieces arrive. Styled by app.css (#loader). */
@Component({
  selector: 'app-loader',
  imports: [Laila],
  template: `
<div id="loader" [class]="'st-' + L.stage() + (L.failed() || L.netWait() ? ' failed' : '') + (L.finished() ? ' out' : '')" (pointerdown)="tap()">
  <div class="ld-top"><div class="ld-laila"><app-laila [size]="150" /></div>
    <div class="ld-bubble"><span>{{ L.bubbleHa() }}</span><small [hidden]="enOn || !L.bubbleEn()">{{ L.bubbleEn() }}</small></div></div>
  <div class="ld-word">
    @for (on of L.letters(); track $index) {<span [class]="'kratu'[$index] + (on ? ' on' : '')">{{ 'Kratu'[$index] }}</span>}
  </div>
  <div class="ld-step">@if (L.step()) {@if (enOn) {Step {{ L.step() }} of 4} @else {<ng-container>{{ t('Mataki') }}</ng-container> {{ L.step() }} / 4 · Step {{ L.step() }} of 4}}</div>
  <div class="ld-msg"><b>{{ L.headHa() }}</b><small [hidden]="enOn || !L.headEn()">{{ L.headEn() }}</small></div>
  @if (L.resumed() && !L.netWait() && !L.finished()) {<div class="ld-resume">{{ resumeLine }}</div>}
  <div class="ld-barrow"><div class="ld-bar"><i [style.width.%]="L.pct()"></i></div><span class="ld-pct">{{ L.pct() }}%</span></div>
  <div class="ld-eta">{{ L.eta() }}</div>
  <div class="ld-steps">@for (c of L.chips(); track c.id) {<span [class]="c.state === 'ok' ? 'done' : c.state">{{ c.label }}@if (c.text) { · {{ c.text }}}</span>}</div>
  @if (L.noteHa()) {<div class="ld-note"><b>{{ L.noteHa() }}</b><small [hidden]="enOn">{{ L.noteEn() }}</small></div>}
  <button class="ld-retry" (click)="L.retry()">{{ bi('Sake gwadawa', 'Try again') }}</button>
  <button class="ld-skip" [hidden]="!L.showSkip()" (click)="L.skip()">{{ bi('Ci gaba haka', 'Continue anyway') }}</button>
</div>`,
  styles: [`:host{display:contents}`],
})
export class LoaderScreen {
  readonly t = t;
  readonly bi = bi;
  readonly enOn = EN_ON;
  /** (Sani 2026-11-24) shown when a half-done download is picked up. */
  readonly resumeLine = t('Carrying on where we stopped');
  readonly L = inject(LoaderService);
  private readonly bus = inject(AudioBus);
  private readonly clips = inject(ClipsService);
  private said = false;
  constructor() {
    // Laila: "please wait a little, everything is getting ready" — at once where sound is allowed before a tap, else on the first touch
    effect(() => { if (this.clips.ready() && !this.said) { this.said = true; this.bus.play('s_loading').then((ok) => { if (!ok) this.said = false; }); } });
  }
  tap(): void { if (!this.said && this.clips.ready()) { this.said = true; this.bus.play('s_loading'); } }
}
