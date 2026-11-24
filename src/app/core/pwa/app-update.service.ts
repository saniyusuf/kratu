import { Injectable, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

/** The screens between two children, where nothing is lost: a press of the update button there switches at once. */
const SAFE = /^\/(perm|gender|blank)?(\?|$)/;
/** (Sani 2026-11-24) where the "New version ready" pill shows: the children screen only, never in a lesson or a game. */
const PILL_AT = /^\/(perm|gender)(\?|$)/;
/** While Kratu stays open, ask for a new version this often. */
const EVERY = 60 * 60 * 1000;

export type UpdateState = 'idle' | 'confirm' | 'checking' | 'downloading' | 'ready' | 'latest' | 'offline' | 'failed' | 'dev';

/**
 * Keeping the tablet on the newest copy (Sani 19 Nov 2026). app.ts already asks once at a cold start; a tablet that only
 * ever comes back from the background never started cold, so after a deploy it stayed on the old copy until someone closed
 * it. Here it also asks whenever Kratu comes back on screen and once an hour. A version found that way downloads quietly
 * and (Sani 2026-11-24) never restarts the app by itself: a small "New version ready · Update" pill appears on the
 * children screen, always with "Later". Later hides it until the next check or the next open; Kratu opened again starts
 * in the new version on its own (app.ts freshCopy). Nothing is ever shown in a lesson or a game.
 * The settings button ("Get the latest version") runs the same check by hand. Neither ever touches a child's records:
 * an update swaps the app's own files (screens, clips, pictures) and nothing else; the models live in their own cache.
 */
@Injectable({ providedIn: 'root' })
export class AppUpdate {
  private readonly sw = inject(SwUpdate);
  private readonly router = inject(Router);
  /** What the settings button says. */
  readonly state = signal<UpdateState>('idle');
  /** This copy's build time, from version.json (written by scripts/stamp.mjs at every build); null in development. */
  readonly built = signal<Date | null>(null);
  /** A new version is downloaded and waits for a safe screen. */
  private waiting = false;
  /** A new version is in and waits: the pill can show. */
  readonly ready = signal(false);
  /** Later was pressed: hidden until the next check (Sani 2026-11-24). */
  readonly later = signal(false);
  /** The route now, for where the pill may show. */
  private readonly url = signal('');
  private asking = false;
  private started = false;

  start(): void {
    if (this.started) return; this.started = true;
    this.readStamp();
    if (!this.sw.isEnabled) { this.state.set('dev'); return; }
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') this.quietCheck(); });
    addEventListener('online', () => this.quietCheck());
    setInterval(() => this.quietCheck(), EVERY);
    this.router.events.subscribe((e) => { if (e instanceof NavigationEnd) this.url.set(e.urlAfterRedirects); });
  }

  private async readStamp(): Promise<void> {
    try { const r = await fetch('version.json', { cache: 'no-cache' }); if (!r.ok) return; const j = await r.json(); if (j?.built) this.built.set(new Date(j.built)); } catch { /* development, or offline before the first install */ }
  }

  /** In the background: found and downloaded, it waits for a screen between two children. */
  private async quietCheck(): Promise<void> {
    if (this.waiting) { this.later.set(false); return; }   // the next check shows the pill again after Later
    if (!this.sw.isEnabled || this.asking || !navigator.onLine || document.visibilityState !== 'visible') return;
    this.asking = true;
    try { if (await this.sw.checkForUpdate()) { this.waiting = true; this.ready.set(true); this.later.set(false); console.log('[kratu] a new version is ready'); } }
    catch (e) { console.warn('[kratu] update check failed', String(e)); }
    finally { this.asking = false; }
  }

  /** What the "Get the latest version" button says (the design of 19 Nov 2026: no tick or cross in any of its states). */
  readonly words = computed(() => {
    const D = this.built(), V = D ? 'the version of ' + D.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'a development copy';
    switch (this.state()) {
      case 'confirm': return { b: 'Press again to update', s: 'The lesson that is open will close. The child\'s progress so far is kept.', warn: true, busy: false };
      case 'checking': return { b: 'Looking for a new version…', s: 'Kratu keeps working while it looks', warn: false, busy: true };
      case 'downloading': return { b: 'Downloading the new version', s: 'Children\'s records stay on this device', warn: false, busy: true };
      case 'ready': return { b: 'Ready, restarting', s: 'Kratu restarts in 2 seconds and opens the first screen', warn: false, busy: true };
      case 'latest': return { b: 'You have the latest version', s: 'This device has ' + V + '. Press again to check later.', warn: false, busy: false };
      case 'offline': return { b: 'No internet right now', s: 'Kratu keeps working as it is. Try again when you are online.', warn: true, busy: false };
      case 'failed': return { b: 'Could not get the new version', s: 'Nothing changed. Press to try again, or repair the app below.', warn: true, busy: false };
      case 'dev': return { b: 'Updates are off in this copy', s: 'A development server always serves the newest files', warn: false, busy: false };
      default: return { b: 'Get the latest version', s: 'This device has ' + V, warn: false, busy: false };
    }
  });
  /** The pill: a new version is in, on the children screen, and Later was not pressed since the last check. */
  pillOn(): boolean { return this.ready() && !this.later() && PILL_AT.test(this.url() || this.router.url); }
  /** The pill's Update: into the new version now. */
  updateNow(): void { this.restart(); }
  /** The pill's Later: hidden until the next check, or the next time Kratu is opened. */
  dismiss(): void { this.later.set(true); }

  /** The settings button. A first press inside a child's sitting only warns that it will close. */
  async press(): Promise<void> {
    const s = this.state();
    if (s === 'checking' || s === 'downloading' || s === 'ready') return;
    if (!this.sw.isEnabled) { this.state.set('dev'); return; }
    if (!navigator.onLine) { this.state.set('offline'); return; }
    if (s !== 'confirm' && !SAFE.test(this.router.url)) { this.state.set('confirm'); return; }
    this.state.set('checking');
    const sub = this.sw.versionUpdates.subscribe((e) => { if (e.type === 'VERSION_DETECTED') this.state.set('downloading'); });
    try {
      const found = this.waiting || await this.sw.checkForUpdate();
      if (found) { this.state.set('ready'); setTimeout(() => this.restart(), 2000); }
      else this.state.set('latest');
    } catch (e) { console.warn('[kratu] update failed', String(e)); this.state.set(navigator.onLine ? 'failed' : 'offline'); }
    finally { sub.unsubscribe(); }
  }

  /** Back to the waiting button (the panel was closed). */
  reset(): void { const s = this.state(); if (s !== 'checking' && s !== 'downloading' && s !== 'ready' && s !== 'dev') this.state.set('idle'); }

  /** Into the new version, from the start: the opening run begins again, as at any launch. */
  private async restart(): Promise<void> {
    this.waiting = false;
    try { await this.sw.activateUpdate(); } catch { /* the reload loads the newest copy all the same */ }
    location.replace(location.pathname);
  }

  /**
   * A copy that will not update: drop the service worker and its own stored files only, and load fresh from the internet.
   * The children (IndexedDB, local storage) and the downloaded models (kratu-models-1) are never touched.
   */
  async repair(): Promise<void> {
    if (!navigator.onLine) { this.state.set('offline'); return; }
    this.state.set('checking');
    try { for (const r of (await navigator.serviceWorker?.getRegistrations?.()) || []) await r.unregister(); } catch { /* ignore */ }
    try { if (typeof caches !== 'undefined') for (const k of await caches.keys()) if (k.startsWith('ngsw:')) await caches.delete(k); } catch { /* ignore */ }
    location.replace(location.pathname);
  }
}
