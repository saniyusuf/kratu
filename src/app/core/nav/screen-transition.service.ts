import { Injectable, inject, signal } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ZoomService } from '../zoom/zoom.service';

/** How deep each screen sits. Going to a deeper one slides forward; coming back slides the way the child came. */
const DEPTH: [RegExp, number][] = [
  [/^\/blank/, -1], [/^\/perm/, 0], [/^\/gender/, 1], [/^\/laila/, 2], [/^\/face/, 3], [/^\/welcome/, 4], [/^\/home/, 5],
  [/^\/misali/, 7], [/^\/(haruffa|abubuwa|rubutu|lambobi|nemo|karatu)\/koyo/, 7], [/^\/(haruffa|abubuwa|rubutu|lambobi|nemo|karatu)/, 6],
];
const depth = (url: string): number => { for (const [re, d] of DEPTH) if (re.test(url)) return d; return 5; };

/**
 * Two movements, by what the change means (Sani 17 Sep).
 *  · The opening screens — permission, gender, meeting Laila, the face, the chooser — have no way back, so each one is
 *    a new page laid down: PAPER.
 *  · From the chooser into a lesson and everything deeper, the child is travelling and the door brings them back, so the
 *    screens SLIDE, reversed on the way out.
 * The screen being left is a still copy of itself (the router has already taken the real one away); the one arriving is
 * live from the first frame, so a child who taps during the movement is answered and the movement is cut short.
 */
@Injectable({ providedIn: 'root' })
export class ScreenTransition {
  private readonly router = inject(Router);
  private readonly zoom = inject(ZoomService);
  /** The single setting: off means screens change the way they did before. */
  readonly on = signal(!matchMedia('(prefers-reduced-motion: reduce)').matches);
  private static readonly SLIDE_MS = 320;
  private static readonly PAPER_MS = 340;
  private kind: 'slide' | 'paper' = 'slide';
  private ghost: HTMLElement | null = null;
  private dir = 1; private fromZ = 1; private armed = false;

  start(): void {
    this.router.events.subscribe((e) => { if (e instanceof NavigationStart) this.snap(e.url); });
    this.zoom.reveal = (screen) => this.run(screen);
  }

  /** Before the router takes the old screen away, keep a still copy of it to slide out. */
  private snap(to: string): void {
    this.drop();
    if (!this.on()) return;
    const from = this.router.url, a = depth(from), b = depth(to);
    if (a < 0 || b < 0 || a === b) { this.armed = false; return; }   // the loader's blank stop, and same-level moves, do not move
    // a lesson on either side means the child is travelling; the opening run is only ever a new page
    this.kind = Math.max(a, b) >= 6 ? 'slide' : 'paper';
    this.dir = b > a ? 1 : -1;
    const live = document.querySelector<HTMLElement>('#app .frame > .s'); const frame = document.querySelector<HTMLElement>('#app .frame');
    if (!live || !frame) { this.armed = false; return; }
    this.fromZ = this.zoom.z();
    const g = live.cloneNode(true) as HTMLElement;
    g.classList.add('ghost'); g.removeAttribute('id'); g.setAttribute('aria-hidden', 'true');
    g.querySelectorAll('video, audio').forEach((m) => m.remove());   // a copy must never play anything
    frame.appendChild(g); this.ghost = g; this.armed = true;
  }

  /** The new screen is measured and ready: slide them past each other. */
  private run(screen: HTMLElement): void {
    const g = this.ghost;
    if (!this.armed || !this.on() || !g) { this.drop(); return; }
    const frame = screen.parentElement!, k = this.kind;
    const ms = k === 'slide' ? ScreenTransition.SLIDE_MS : ScreenTransition.PAPER_MS;
    frame.style.setProperty('--nav-dir', String(this.dir));
    frame.style.setProperty('--nav-ms', ms + 'ms');
    g.style.zoom = String(this.fromZ / (this.zoom.z() || 1));   // the copy keeps the size it had, whatever the new screen needs
    screen.classList.add('nav-in', 'nav-' + k); g.classList.add('nav-out', 'nav-' + k);
    const end = () => { screen.classList.remove('nav-in', 'nav-' + k); this.drop(); document.removeEventListener('pointerdown', end, true); clearTimeout(t); };
    const t = setTimeout(end, ms + 60);
    document.addEventListener('pointerdown', end, true);   // a tap lands on the new screen and cuts the movement short
  }
  private drop(): void { this.ghost?.remove(); this.ghost = null; this.armed = false; }
}
