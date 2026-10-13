import { Component, computed, input } from '@angular/core';
import { retryPic } from './helpers';

/**
 * A word's picture. Most are stills (<img>); an action word moves (Sani 12 Oct): its picture is a short looping film,
 * shown as a <video> that is muted, loops and starts by itself. Muted media never reaches the sound guard, so it can
 * never cut Laila off, and nothing calls .play() on it. Like an <img> it lays out through the same CSS (app.css mirrors
 * each picture rule for video), and the host is display:contents so the DOM around it is unchanged.
 */
@Component({
  selector: 'app-pic',
  host: { style: 'display:contents' },
  template: `@if (moving()) {<video [src]="src()" [muted]="true" autoplay loop playsinline disablepictureinpicture preload="auto" aria-hidden="true" (loadstart)="hush($event)" (error)="retry($event)"></video>} @else {<img alt="" [src]="src()" (error)="retry($event)">}`,
})
export class Pic {
  readonly src = input<string | null | undefined>(null);
  readonly moving = computed(() => /\.mp4(\?|$)/.test(this.src() || ''));
  readonly retry = retryPic;
  /** A bare muted attribute does not mute a <video> Angular renders; the property is set before it can autoplay. */
  hush(ev: Event): void { const v = ev.target as HTMLVideoElement; v.muted = true; v.defaultMuted = true; }
}
