import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AudioBus } from '../../core/audio/audio-bus.service';
import { SessionService } from '../../core/state/session.service';
import { Laila } from '../../shared/laila/laila';

/** Screen 00 · Izini. Camera and microphone permission, the tap that starts everything. */
@Component({
  selector: 'app-perm',
  imports: [Laila],
  host: { class: 's perm' },
  template: `
<div class="pcard">
  <div class="ptop"><div class="ptitle">Izini · Permission</div><div class="phead">Ana buƙatar izinin kyamara da makirufo<span>Camera and microphone permission is needed before we start</span></div></div>
  <div class="permrow">
    <span class="pchip cam" [class.ok]="cam() === 'ok'" [class.no]="cam() === 'no'"><i class="ptile"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg></i><b>Kyamara · Camera</b><small>Domin Laila ta gani · so Laila can see</small></span>
    <button class="permgo" [class.busy]="busy()" aria-label="Danna kan Laila · Tap Laila" (click)="ask()"><app-laila [size]="170" /><span class="phand">👆🏾</span><div class="plabel">Danna kan Laila · Tap Laila</div></button>
    <span class="pchip mic" [class.ok]="mic() === 'ok'" [class.no]="mic() === 'no'"><i class="ptile"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/></svg></i><b>Makirufo · Microphone</b><small>Domin Laila ta ji · so Laila can hear</small></span>
  </div>
  <div class="pnote"><b>A danna kan Laila, sannan a danna “Allow”.</b><span>Tap Laila, then tap “Allow” when the device asks. No photo or recording is kept, and nothing is sent anywhere.</span></div>
  <div class="pstatus" aria-live="polite">{{ status() }}</div>
</div>`,
})
export class PermScreen {
  private readonly bus = inject(AudioBus);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);
  readonly busy = signal(false);
  readonly cam = signal<'' | 'ok' | 'no'>('');
  readonly mic = signal<'' | 'ok' | 'no'>('');
  readonly status = signal('');

  async ask(): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true); this.status.set(''); this.cam.set(''); this.mic.set('');
    const md = navigator.mediaDevices;
    if (!md?.getUserMedia) { this.status.set('No camera or microphone on this device'); this.busy.set(false); this.next(); return; }
    this.bus.play('s_perm');
    const done = (ok: boolean, why?: string) => { this.busy.set(false); if (ok) { this.session.savePerms(this.cam() === 'ok'); setTimeout(() => this.next(), 400); } else { this.status.set(why || ''); this.bus.play('s_perm_no'); } };
    try {
      const str = await md.getUserMedia({ video: true, audio: true }); str.getTracks().forEach((t) => t.stop()); this.cam.set('ok'); this.mic.set('ok'); done(true);
    } catch (e: any) {
      // no camera at all → the microphone alone is enough (the face screen has a photo fallback)
      try { const s2 = await md.getUserMedia({ audio: true }); s2.getTracks().forEach((t) => t.stop()); this.mic.set('ok'); this.cam.set('no'); if (e?.name === 'NotFoundError' || e?.name === 'OverconstrainedError') done(true); else done(false, 'Camera: ' + (e?.name || 'refused')); }
      catch (e2: any) { this.mic.set('no'); this.cam.set('no'); done(false, 'Microphone: ' + (e2?.name || 'refused')); }
    }
  }
  private next(): void { const d = this.session.demo(); if (d) { this.session.setGender(d.g); this.session.name.set(d.name); this.router.navigate(['/home']); } else this.router.navigate(['/gender']); }
}
