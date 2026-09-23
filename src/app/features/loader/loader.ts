import { Component, inject, effect } from '@angular/core';
import { LoaderService } from '../../core/loader/loader.service';
import { AudioBus } from '../../core/audio/audio-bus.service';
import { ClipsService } from '../../core/clips/clips.service';
import { Laila } from '../../shared/laila/laila';

/** The first screen: the Kratu word fills in letter by letter as the pieces arrive. Styled by app.css (#loader). */
@Component({
  selector: 'app-loader',
  imports: [Laila],
  template: `
<div id="loader" [class]="'st-' + L.stage() + (L.failed() ? ' failed' : '') + (L.finished() ? ' out' : '')" (pointerdown)="tap()">
  <div class="ld-top"><div class="ld-laila"><app-laila [size]="150" /></div>
    <div class="ld-bubble"><span>{{ L.bubbleHa() }}</span><small>{{ L.bubbleEn() }}</small></div></div>
  <div class="ld-word">
    @for (on of L.letters(); track $index) {<span [class]="'kratu'[$index] + (on ? ' on' : '')">{{ 'Kratu'[$index] }}</span>}
  </div>
  <div class="ld-step">@if (L.step()) {Mataki {{ L.step() }} / 4 · Step {{ L.step() }} of 4}</div>
  <div class="ld-msg"><b>{{ L.headHa() }}</b><small>{{ L.headEn() }}</small></div>
  <div class="ld-barrow"><div class="ld-bar"><i [style.width.%]="L.pct()"></i></div><span class="ld-pct">{{ L.pct() }}%</span></div>
  <div class="ld-eta">{{ L.eta() }}</div>
  <div class="ld-steps">@for (c of L.chips(); track c.id) {<span [class]="c.state === 'ok' ? 'done' : c.state">{{ c.label }}@if (c.text) { · {{ c.text }}}</span>}</div>
  @if (L.noteHa()) {<div class="ld-note"><b>{{ L.noteHa() }}</b><small>{{ L.noteEn() }}</small></div>}
  <button class="ld-retry" (click)="L.retry()">Sake gwadawa · Try again</button>
  <button class="ld-skip" [hidden]="!L.showSkip()" (click)="L.skip()">Ci gaba haka · Continue anyway</button>
</div>`,
  styles: [`:host{display:contents}`],
})
export class LoaderScreen {
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
