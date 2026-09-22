import { Component, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AudioBus } from '../../core/audio/audio-bus.service';
import { SessionService } from '../../core/state/session.service';
import { ALLO_SVG } from '../../shared/allo';
import { Laila } from '../../shared/laila/laila';

/**
 * The door on the chooser: "the session will end". Laila = done (another child can use the tablet), the black slate =
 * reset (the examples and hints play again); a tap outside keeps the session (Sani 2026-09-11).
 */
@Component({
  selector: 'app-leave',
  imports: [Laila],
  host: { id: 'leave', '[hidden]': '!open()', '(click)': 'backdrop($event)' },
  template: `<div class="lbox"><div class="ltitle">Ƙare zaman? · End the session?</div><div class="lpair">
  <button class="yn yes lv-laila" aria-label="Na gama" (click)="end(false)"><span class="lm" style="width:112px;height:112px"><app-laila [size]="112" /></span><small>Na gama · done</small></button>
  <button class="yn no board lv-slate" aria-label="Sake farawa" (click)="end(true)"><span [innerHTML]="slate"></span><small>Sake farawa · reset</small></button></div></div>`,
})
export class Leave {
  private readonly bus = inject(AudioBus);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);
  readonly slate = inject(DomSanitizer).bypassSecurityTrustHtml(ALLO_SVG);
  readonly open = signal(false);
  show(): void { this.bus.stopAll(); this.open.set(true); this.bus.play('s_leave'); }
  hide(): void { this.bus.stopAll(); this.open.set(false); }
  backdrop(e: Event): void { if ((e.target as HTMLElement).id === 'leave') this.hide(); }
  end(reset: boolean): void {
    this.bus.stopAll(); this.open.set(false); this.session.end();
    if (reset) { try { sessionStorage.clear(); } catch { /* ignore */ } }
    this.router.navigate(['/gender']);
  }
}
