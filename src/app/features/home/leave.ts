import { Component, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AudioBus } from '../../core/audio/audio-bus.service';
import { SessionService } from '../../core/state/session.service';
import { BLACK_DOOR_SVG } from '../../shared/svg';
import { bi, sub, t } from '../../core/lang/t';
import { FAMILY } from '../../core/edition';
import { FamilyService } from '../../core/family/family.service';

/**
 * The door on the chooser, and the system Back on home (Sani 2026-11-24): "End the lesson?" with two buttons, the app's
 * own door and arrow = I'm finished (another child can use the tablet), a big X = cancel (stay on home). A tap outside
 * also keeps the session. It never reloads. (Until 24 Nov: Laila = done, the black slate = start again.)
 * Laila's line s_leave still describes the old buttons: it plays until Sani gives the new wording.
 */
@Component({
  selector: 'app-leave',
  host: { id: 'leave', '[hidden]': '!open()', '(click)': 'backdrop($event)' },
  template: `<div class="lbox"><div class="ltitle">{{ bi('Ƙare zaman?', 'End the session?') }}</div><div class="lpair">
  <button class="yn lv-done" [attr.aria-label]="t('Na gama')" (click)="end(false)"><span class="lvdoor" aria-hidden="true"><svg class="lvarrow" viewBox="0 0 24 24"><path d="M21 12H5M11 5l-7 7 7 7"/></svg><span class="lvd" [innerHTML]="door"></span></span><b>{{ t('Na gama') }}</b><small class="lvsub">{{ sub('Na gama') }}</small></button>
  <button class="yn lv-cancel" [attr.aria-label]="t('Cancel')" (click)="hide()"><span class="lvx" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></span><b>{{ t('Cancel') }}</b><small class="lvsub">{{ sub('Cancel') }}</small></button></div></div>`,
})
export class Leave {
  readonly t = t;
  readonly bi = bi;
  readonly sub = sub;
  private readonly bus = inject(AudioBus);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);
  private readonly fam = inject(FamilyService);
  readonly door = inject(DomSanitizer).bypassSecurityTrustHtml(BLACK_DOOR_SVG);
  readonly open = signal(false);
  show(): void { this.bus.stopAll(); this.open.set(true); this.bus.play('s_leave'); }   // the old wording (Laila / the slate) until Sani gives the new line
  hide(): void { this.bus.stopAll(); this.open.set(false); }
  backdrop(e: Event): void { if ((e.target as HTMLElement).id === 'leave') this.hide(); }
  end(reset: boolean): void {
    this.bus.stopAll(); this.open.set(false);
    const guest = this.session.guest(); this.session.end();
    if (reset || guest) { try { sessionStorage.clear(); } catch { /* ignore */ } }   // a guest leaves nothing behind
    if (FAMILY) { this.fam.toCamera(); return; }   // the family build goes back to the sign-in camera (Sani 2026-11-22: no cards)
    this.router.navigate(['/gender']);
  }
}
