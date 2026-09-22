import { Injectable } from '@angular/core';
import { afterPaint } from '../../shared/paint';

/**
 * A 960×600 layout scaled to whatever screen there is, up or down. The frame is zoomed with --z;
 * then the active screen's in-flow content is measured and the zoom eased back just enough to fit.
 * Rectangles reported by the browser are in screen pixels while screens position hands and spots in
 * layout pixels: rect() hands back layout units for anything inside the frame.
 */
@Injectable({ providedIn: 'root' })
export class ZoomService {
  private t: ReturnType<typeof setTimeout> | null = null;
  private observer: MutationObserver | null = null;

  start(): void {
    this.fit();
    addEventListener('resize', () => this.refit());
    addEventListener('orientationchange', () => setTimeout(() => this.fit(), 200));
    const app = document.getElementById('app');
    if (app && !this.observer) {
      this.observer = new MutationObserver((records) => {
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
  refit(): void { if (this.t) clearTimeout(this.t); this.t = setTimeout(() => this.fit(), 120); }
  fit(): void {
    const root = document.documentElement.style;
    const base = Math.min(innerWidth / 960, innerHeight / 600);
    root.setProperty('--z', base.toFixed(3));
    void document.body.offsetHeight;
    // ease the zoom back until every in-flow piece of the active screen fits: a few passes, because centring moves the
    // content each time the frame grows (the old build stopped after two and could leave a hint hanging below the edge)
    let z = base; const floor = base * 0.8;
    for (let i = 0; i < 6; i++) {
      const m = this.measure(); if (m >= 0.999) break;
      z = Math.max(floor, z * m); root.setProperty('--z', z.toFixed(3)); void document.body.offsetHeight;
      if (z <= floor) break;
    }
  }
  private measure(): number {
    const s = document.querySelector('#app .block.active .s');
    if (!s) return 1;
    const sr = s.getBoundingClientRect();
    let top = Infinity, bot = -Infinity;
    const inFlow = (el: HTMLElement): boolean => { if (el.hidden) return false; const cs = getComputedStyle(el); return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.position !== 'absolute' && cs.position !== 'fixed'; };
    Array.from(s.children).forEach((k) => {
      const el = k as HTMLElement;
      if (el.classList.contains('backdoor') || el.classList.contains('helpdome') || !inFlow(el)) return;
      const r = el.getBoundingClientRect();
      if (r.height <= 0) return;
      top = Math.min(top, r.top); bot = Math.max(bot, r.bottom);
      // a child's in-flow descendants can hang below it (a hint under a fixed-size button): they must fit too, or the screen is cut off
      el.querySelectorAll<HTMLElement>('*').forEach((d) => { if (!inFlow(d)) return; const dr = d.getBoundingClientRect(); if (dr.height > 0) { top = Math.min(top, dr.top); bot = Math.max(bot, dr.bottom); } });
    });
    if (!isFinite(top)) return 1;
    const content = bot - top, avail = sr.height - (top - sr.top) - 12;
    return Math.min(1, avail / Math.max(1, content));
  }
}
