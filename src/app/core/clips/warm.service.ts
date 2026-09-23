import { Injectable } from '@angular/core';

/**
 * Pictures decoded and held in memory before a lesson needs them (Sani 2026-09-23). Having the file on the tablet is not
 * the same as being ready to paint: the first time a picture is shown it still goes through the service worker and is
 * decoded, which on a cheap tablet lands exactly when Laila names it. A set is warmed while she is still talking, so the
 * picture appears whole. Only the most recent ones are held — a 512 px picture costs about a megabyte decoded.
 */
@Injectable({ providedIn: 'root' })
export class ImageWarm {
  private readonly held = new Map<string, HTMLImageElement>();
  private readonly MAX = 24;

  /** Decode these pictures now; already-warm ones only move to the front. Never throws: a missing picture is not fatal. */
  async warm(urls: (string | null | undefined)[]): Promise<void> {
    for (const url of [...new Set(urls)]) {
      if (!url) continue;
      const had = this.held.get(url);
      if (had) { this.held.delete(url); this.held.set(url, had); continue; }
      const img = new Image();
      img.src = url;
      try { await img.decode(); } catch { continue; }   // not decodable, or gone: the lesson still shows it the old way
      this.held.set(url, img);
      while (this.held.size > this.MAX) this.held.delete(this.held.keys().next().value as string);
    }
  }
  /** Warm in the background: the lesson carries on talking while the pictures are made ready. */
  soon(urls: (string | null | undefined)[]): void { this.warm(urls).catch(() => undefined); }
}
