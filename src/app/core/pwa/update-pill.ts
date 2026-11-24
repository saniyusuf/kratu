import { Component, inject } from '@angular/core';
import { AppUpdate } from './app-update.service';
import { t } from '../lang/t';

/**
 * "New version ready · Update", always with "Later" (Sani 2026-11-24, the downloads design point 5, and his word that the
 * update button must always have a dismiss). Shown only on the children screen; words only, no tick or cross.
 */
@Component({
  selector: 'app-update-pill',
  template: `@if (U.pillOn()) {<div class="updpill" role="status"><span class="upd-t">{{ T_READY }}</span><button class="upd-go" (click)="U.updateNow()">{{ T_UPDATE }}</button><button class="upd-later" (click)="U.dismiss()">{{ T_LATER }}</button></div>}`,
  styles: [`:host{display:contents}`],
})
export class UpdatePill {
  readonly U = inject(AppUpdate);
  readonly T_READY = t('New version ready');
  readonly T_UPDATE = t('Update');
  readonly T_LATER = t('Later');
}
