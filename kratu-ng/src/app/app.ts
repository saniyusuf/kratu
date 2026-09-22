import { Component, OnInit, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterOutlet } from '@angular/router';
import { AudioBus } from './core/audio/audio-bus.service';
import { LoaderService } from './core/loader/loader.service';
import { SessionService } from './core/state/session.service';
import { ZoomService } from './core/zoom/zoom.service';
import { ScreenTransition } from './core/nav/screen-transition.service';
import { LoaderScreen } from './features/loader/loader';
import { Settings } from './features/settings/settings';
import { Subs } from './shared/subs/subs';
import { LAILA_DEFS } from './shared/svg';

/** The shell: the zoomed frame every screen lives in, the loader in front of it until everything is ready, the settings gear, the subtitles strip, the rotate overlay. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderScreen, Settings, Subs],
  template: `
<span class="svgdefs" [innerHTML]="defs"></span>
@if (!loaded()) {<app-loader />}
<div id="app"><div class="block active"><div class="frame"><router-outlet /></div></div></div>
<div id="rotate"><svg viewBox="0 0 64 64"><rect x="14" y="6" width="36" height="52" rx="6"/><circle cx="32" cy="51" r="2"/><path d="M22 12h20"/></svg><b>Juya allon · Turn the tablet sideways</b><small>Kratu works in landscape only</small></div>
<app-settings /><app-subs />`,
  styles: [`:host{display:contents} .svgdefs{position:absolute;width:0;height:0;overflow:hidden}`],
})
export class App implements OnInit {
  readonly session = inject(SessionService);
  readonly bus = inject(AudioBus);
  private readonly loader = inject(LoaderService);
  private readonly zoom = inject(ZoomService);
  private readonly nav = inject(ScreenTransition);
  private readonly router = inject(Router);
  readonly defs = inject(DomSanitizer).bypassSecurityTrustHtml(LAILA_DEFS);
  readonly loaded = signal(false);

  async ngOnInit(): Promise<void> {
    this.zoom.start(); this.nav.start();
    document.addEventListener('click', () => { try { (screen.orientation as any)?.lock?.('landscape').catch(() => undefined); } catch { /* ignore */ } }, { once: true, capture: true });
    // a fresh load has no user gesture yet, so the first line of the first screen is refused by the browser: the first touch says it
    document.addEventListener('pointerdown', () => { if (this.bus.blocked()) setTimeout(() => this.bus.replayBlocked(), 0); }, { capture: true });
    // a long press on a tablet must not open a menu, select text or start a drag; the app has nothing to copy or save
    for (const ev of ['contextmenu', 'dragstart', 'selectstart'] as const) document.addEventListener(ev, (e) => { const t = e.target as HTMLElement | null; if (t && /^(INPUT|SELECT|TEXTAREA)$/.test(t.tagName)) return; e.preventDefault(); }, { capture: true });
    // whatever the address, no screen may render under the loader: its opening line would play unheard and never again
    this.router.navigateByUrl('/blank', { skipLocationChange: true });
    await this.loader.run();
    this.loaded.set(true);
    const ok = await this.session.permsGranted();
    if (ok) this.session.perms.set({ camera: true, mic: true, at: Date.now() });
    // ?debug only: jump straight to a screen, so a single screen can be checked without walking the whole opening run
    if (this.session.debug) {
      const q = new URLSearchParams(location.search), to = q.get('screen');
      if (to) {
        this.session.setGender(q.get('g') === 'f' ? 'f' : 'm');
        this.session.name.set(q.get('name') || 'Sani');
        if (q.has('known')) this.session.known.set(q.get('known') !== '0');
        if (q.has('pid')) this.session.personId.set(q.get('pid'));   // ?debug only: stand in for a signed-in child
        this.router.navigate(['/' + to]); return;
      }
    }
    const d = this.session.demo();
    if (d && ok) { this.session.setGender(d.g); this.session.name.set(d.name); this.router.navigate(['/home']); return; }
    this.router.navigate([ok ? '/gender' : '/perm']);
  }
}
