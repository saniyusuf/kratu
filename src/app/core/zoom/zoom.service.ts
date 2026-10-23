import { Injectable } from '@angular/core';
import { afterPaint } from '../../shared/paint';

/**
 * A 960×600 layout scaled to whatever screen there is, up or down. The frame is zoomed with --z;
 * then the active screen's in-flow content is measured: a new screen is grown until it fills the screen, and the
 * zoom is eased back just enough for everything to fit.
 * Rectangles reported by the browser are in screen pixels while screens position hands and spots in
 * layout pixels: rect() hands back layout units for anything inside the frame.
 */
@Injectable({ providedIn: 'root' })
export class ZoomService {
  private t: ReturnType<typeof setTimeout> | null = null;
  private observer: MutationObserver | null = null;

  start(): void {
    this.fit();
    addEventListener('resize', () => { if (this.t) clearTimeout(this.t); this.t = setTimeout(() => this.fit(), 120); });   // a real resize always refits
    addEventListener('orientationchange', () => setTimeout(() => this.fit(), 200));
    const app = document.getElementById('app');
    if (app && !this.observer) {
      this.observer = new MutationObserver((records) => {
        // a game draws inside a fixed box marked .nofit: its sparks, clocks and moving pieces can never change the size
        records = records.filter((r) => !(r.target as Element).closest?.('.nofit'));
        if (!records.length) return;
        // a whole new screen: settle its size before it is seen, so it never appears at one size and rescales to another
        for (const r of records) for (const n of Array.from(r.addedNodes)) {
          const el = n as HTMLElement;
          if (el.nodeType === 1 && (el.classList?.contains('s') || el.querySelector?.('.s'))) { this.settle(); return; }
        }
        this.refit();
      });
      this.observer.observe(app, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'hidden', 'style'] });
    }
  }
  z(): number { return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--z')) || 1; }
  /** Layout-unit rectangle for an element inside the zoomed frame. */
  rect(el: Element): DOMRect {
    const r = el.getBoundingClientRect(), z = this.z();
    if (z === 1 || !el.closest('#app .frame')) return r;
    return new DOMRect(r.x / z, r.y / z, r.width / z, r.height / z);
  }
  /** Everything on the new screen that can still change its size: the fonts, and every picture or film in it. */
  private async contentReady(): Promise<void> {
    const s = document.querySelector('#app .frame > .s'); if (!s) return;
    const waits: Promise<unknown>[] = [document.fonts?.ready ?? Promise.resolve()];
    s.querySelectorAll('img').forEach((im) => { if (!im.complete) waits.push(new Promise((r) => { im.addEventListener('load', r, { once: true }); im.addEventListener('error', r, { once: true }); })); });
    s.querySelectorAll('video').forEach((v) => { if (v.readyState < 1) waits.push(new Promise((r) => { v.addEventListener('loadedmetadata', r, { once: true }); v.addEventListener('error', r, { once: true }); })); });
    await Promise.race([Promise.all(waits), new Promise((r) => setTimeout(r, 600))]);
  }
  /** Hold the frame back until the new screen's final size is known, so it never appears at one size and rescales to another. */
  private settling = false;
  /** Set by the transition service: how the finished screen is brought in. */
  reveal: ((screen: HTMLElement) => void) | null = null;
  settle(): void {
    const app = document.getElementById('app'); if (!app || this.settling) return;
    // opacity, never visibility: `visibility:hidden` is inherited, and measure() skips hidden elements, so the fit
    // would measure an empty screen and leave the zoom wrong — the very rescale this is here to prevent
    // the screen itself is held, not #app: a copy of the screen being left lives in the frame and must stay visible
    const hold = (v: string) => { const s = document.querySelector<HTMLElement>('#app .frame > .s'); if (s) { s.style.opacity = v; s.style.pointerEvents = v ? 'none' : ''; } };
    this.settling = true; hold('0');
    const show = () => { const s = document.querySelector<HTMLElement>('#app .frame > .s'); hold(''); this.settling = false; if (s && this.reveal) this.reveal(s); };
    const guard = setTimeout(show, 900);   // never leave the screen hidden because something failed to load
    afterPaint()
      .then(() => this.contentReady())
      .then(() => { this.fit(); return afterPaint(); })
      .then(() => { this.fit(); clearTimeout(guard); show(); }, () => { clearTimeout(guard); show(); });
  }
  /**
   * A change inside the screen (a class, a hint appearing) refits too, but only when the size really has to change: a
   * bounce, a wobble or a balloon passing must never rescale the whole screen. Laila's "yay" made her a little bigger
   * for a moment, the fit shrank everything to make room, and the game jumped on every pop (Sani 2026-10-14).
   */
  refit(): void { if (this.t) clearTimeout(this.t); this.t = setTimeout(() => this.fit(false), 120); }
  /**
   * The design is drawn on a 960×600 page with room to spare, and on a 7-inch tablet that left the cards, pictures and
   * Laila small in a sea of paper (Sani 2026-10-23). So a new screen is also GROWN until its content fills the screen:
   * up to GROW times the plain fit, leaving HEAD of the height free so a hint appearing later rarely has to shrink it.
   * Only a new screen (or a resize) grows; a change inside a screen may only shrink it, never jump it bigger.
   */
  private static readonly GROW = 1.6;
  private static readonly HEAD = 0.86;
  fit(force = true): void {
    const root = document.documentElement.style, prev = this.z();
    const base = Math.min(innerWidth / 960, innerHeight / 600);
    const set = (v: number) => { root.setProperty('--z', v.toFixed(3)); void document.body.offsetHeight; };
    const floor = base * 0.8, cap = base * ZoomService.GROW;
    let z = force ? base : prev; set(z);
    // grow: the content's size against the screen's, a few passes, because sizes given in frame units (cqw/cqh) stay
    // put on screen while everything given in pixels grows with the zoom
    if (force) for (let i = 0; i < 8; i++) {
      const g = this.room(); if (g <= 1.01) break;
      const nz = Math.min(cap, z * g); if (nz - z < 0.004) break;
      z = nz; set(z);
    }
    // then ease back until every in-flow piece of the active screen fits: centring moves the content each time the
    // frame grows (the old build stopped after two passes and could leave a hint hanging below the edge)
    for (let i = 0; i < 8; i++) {
      const m = this.measure(); if (m >= 0.999) break;
      z = Math.max(floor, z * m); set(z);
      if (z <= floor) break;
    }
    if (!force && Math.abs(z - prev) / prev < 0.03) set(prev);
  }
  /** The in-flow content of the active screen, as one screen-pixel box (null when there is none to fit). */
  private box(): { s: DOMRect; top: number; bot: number; left: number; right: number } | null {
    const s = document.querySelector('#app .block.active .s');
    if (!s) return null;
    let top = Infinity, bot = -Infinity, left = Infinity, right = -Infinity;
    const inFlow = (el: HTMLElement): boolean => { if (el.hidden) return false; const cs = getComputedStyle(el); return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.position !== 'absolute' && cs.position !== 'fixed'; };
    const sr = s.getBoundingClientRect();
    // sideways only what is really drawn (pictures, buttons, the innermost boxes): a row or grid stretched across the
    // screen says nothing about how wide its content is
    const drawn = (el: Element) => !el.firstElementChild || /^(BUTTON|IMG|SVG|VIDEO|CANVAS)$/i.test(el.tagName);
    const add = (el: Element) => {
      const r = el.getBoundingClientRect(); if (r.height <= 0) return;
      top = Math.min(top, r.top); bot = Math.max(bot, r.bottom);
      if (r.width > 0 && r.width < sr.width * 0.88 && drawn(el)) { left = Math.min(left, r.left); right = Math.max(right, r.right); }
    };
    Array.from(s.children).forEach((k) => {
      const el = k as HTMLElement;
      if (el.classList.contains('backdoor') || el.classList.contains('helpdome') || !inFlow(el)) return;
      add(el);
      // a child's in-flow descendants can hang below it (a hint under a fixed-size button): they must fit too, or the screen is cut off
      el.querySelectorAll<HTMLElement>('*').forEach((d) => { if (inFlow(d)) add(d); });
    });
    if (!isFinite(top)) return null;
    return { s: sr, top, bot, left, right };
  }
  /** How much the content could grow and still leave the screen's margins and some headroom free (1 = no room). */
  private room(): number {
    const b = this.box(); if (!b) return 1;
    // a screen whose content runs edge to edge on purpose (the full-screen games) has nothing to grow into
    if (b.right - b.left >= b.s.width - 4 && b.bot - b.top >= b.s.height * 0.9) return 1;
    const gh = (b.s.height * ZoomService.HEAD - 24) / Math.max(1, b.bot - b.top);
    // the corners belong to the door, the ear and the gear: the content keeps clear of them sideways
    const gw = isFinite(b.left) ? (b.s.width - 2 * 64) / Math.max(1, b.right - b.left) : Infinity;
    return Math.max(1, Math.min(gh, gw));
  }
  private measure(): number {
    const b = this.box(); if (!b) return 1;
    const content = b.bot - b.top, avail = b.s.height - (b.top - b.s.top) - 12;
    return Math.min(1, avail / Math.max(1, content));
  }
}
