import { Component, DestroyRef, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { Laila } from '@kratu/app/shared/laila/laila';
import { FamilyService } from '@kratu/app/core/family/family.service';

/** Chrome's install offer, kept by main.ts the moment it arrives (it can come before the app is up). */
interface InstallOffer extends Event { prompt(): Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> }
declare global { interface Window { __kratuInstall?: InstallOffer | null } }

/** Later (or "I've done it" on an iPhone, which we cannot check): not again for this long. */
const LATER_MS = 3 * 24 * 60 * 60 * 1000;
/** On the home screen this long before the sheet rises, so the child's own screen is seen first. */
const SHOW_AFTER_MS = 2500;
const K_LATER = 'kratu_fam_install_later';
/** Laila's line while the sheet is up: none until Sani gives the Hausa (key s_install_ask, not recorded yet). */
const INSTALL_LINE: string | null = null;

/**
 * The install sheet (Sani 2026-11-25, design B: design/install-prompt): a sheet that slides up over the family home
 * screen. It shows only when the phone can install Kratu (Chrome made its install offer, or an iPhone that has not added
 * it yet), never once Kratu runs from its icon, and only on the home screen: never in a lesson, a game or a family
 * screen. Later is kept on the phone and the sheet may come back after 3 days. The sheet is fixed over the screen and
 * moves by transform only, so nothing under it shifts.
 */
@Component({
  selector: 'app-install-sheet',
  imports: [Laila],
  template: `
@if (on()) {
<div class="isd" [class.up]="up()" [class.ios]="ios" role="dialog" aria-modal="true" aria-labelledby="isd-h">
  <div class="isd-dim" (click)="later()"></div>
  <div class="isd-sheet">
    <div class="isd-grab" aria-hidden="true"></div>
    <button class="isd-x" type="button" aria-label="Close" (click)="later()"><i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round"/></svg></i></button>
    <div class="isd-head"><div class="isd-k" [innerHTML]="K"></div><h2 id="isd-h">Add Kratu to your home screen</h2></div>
    @if (ios) {<p class="isd-p">On iPhone, Kratu goes on the home screen from Safari’s Share menu.</p>}
    @else {<p class="isd-p">Put Kratu on your home screen and open it from its own icon.</p>}
    <ul class="isd-why">
      <li><b style="--c:#E63946"></b>Opens full screen, like a real app</li>
      <li><b style="--c:#2FAE9E"></b>Works without internet</li>
      <li><b style="--c:#F2A93B"></b>Keeps your children’s progress safe</li>
    </ul>
    @if (ios) {
    <ol class="isd-ios">
      <li>Tap <svg class="isd-share" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M8 7l4-4 4 4" fill="none" stroke="#1E7CF2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 10H5v11h14V10h-2" fill="none" stroke="#1E7CF2" stroke-width="2" stroke-linejoin="round"/></svg> <span>Share</span> at the bottom of Safari</li>
      <li>Choose <span>Add to Home Screen</span></li>
      <li>Tap <span>Add</span></li>
    </ol>}
    <div class="isd-row">
      <button class="isd-ghost" (click)="later()">Later</button>
      @if (ios) {<button class="isd-pri" (click)="later()">I’ve done it</button>}
      @else {<button class="isd-pri" (click)="install()">Install Kratu</button>}
    </div>
    <div class="isd-laila"><app-laila [size]="lailaSize" /></div>
  </div>
</div>}`,
  styles: [`
:host{display:contents}
.isd{position:fixed;inset:0;z-index:1000;display:flex;align-items:flex-end;justify-content:center;font-family:var(--body,'Nunito',sans-serif);color:#3B2E1E;pointer-events:none}
.isd-dim{position:absolute;inset:0;background:rgba(40,28,10,.42);opacity:0;transition:opacity .35s;pointer-events:auto}
.isd.up .isd-dim{opacity:1}
.isd-sheet{position:relative;background:#FFFCF4;border-radius:26px 26px 0 0;box-shadow:0 -8px 30px rgba(40,28,10,.2);padding:14px 20px calc(150px + env(safe-area-inset-bottom,0px));width:100%;max-width:520px;display:grid;gap:14px;transform:translateY(105%);transition:transform .42s cubic-bezier(.2,.8,.2,1);pointer-events:auto}
.isd.up .isd-sheet{transform:none}
.isd-grab{width:44px;height:5px;border-radius:3px;background:#E2D3B0;justify-self:center}
.isd-head{display:flex;gap:14px;align-items:center;padding-right:40px}
/* Close (Sani 2026-11-25, pick 3: teal circle): same as Later; 48 px tap square, 34 px circle */
.isd-x{position:absolute;top:6px;right:8px;width:48px;height:48px;border:0;background:none;padding:0;display:grid;place-items:center;cursor:pointer;-webkit-tap-highlight-color:transparent}
.isd-x i{display:block;box-sizing:border-box;width:34px;height:34px;border-radius:50%;background:#2FAE9E;box-shadow:0 3px 0 #23897C;padding:8px}
.isd-x svg{display:block;width:100%;height:100%}
.isd-x:active i{transform:translateY(2px);box-shadow:0 1px 0 #23897C}
.isd-k{width:52px;height:52px;border-radius:13px;box-shadow:0 6px 18px rgba(80,60,20,.18);flex:none;overflow:hidden}
.isd-k ::ng-deep svg{width:100%;height:100%;display:block}
h2{font:800 24px/1.15 var(--disp,'Baloo 2',sans-serif);margin:0;color:#3B2E1E}
.isd-p{margin:0;font:600 15px/1.45 var(--body,'Nunito',sans-serif);color:#5F5137}
.isd-why{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.isd-why li{display:flex;align-items:center;gap:10px;font:700 15px var(--body,sans-serif)}
.isd-why b{width:10px;height:10px;border-radius:50%;background:var(--c);flex:none}
.isd-ios{margin:0;padding-left:22px;display:grid;gap:8px;font:700 15px/1.35 var(--body,sans-serif)}
.isd-ios span{font-weight:800;color:#1E7CF2}
.isd-share{width:18px;height:18px;vertical-align:-3px}
.isd-row{display:flex;gap:10px}
.isd-row button{flex:1;min-height:50px;border-radius:16px;padding:0 18px;font:800 17px var(--disp,'Baloo 2',sans-serif);cursor:pointer}
.isd-pri{border:0;background:#EE7043;color:#fff;box-shadow:0 4px 0 #C9562E}
.isd-ghost{border:2px solid #E2D3B0;background:#fff;color:#5F5137}
button:focus-visible{outline:3px solid #2FAE9E;outline-offset:2px}
.isd-laila>app-laila{display:block;width:100%;height:100%}.isd-laila ::ng-deep .lm{display:block;width:100%!important;height:100%!important}.isd-laila ::ng-deep .lm svg{display:block;width:100%;height:100%}
.isd-laila{position:absolute;left:50%;bottom:calc(14px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);width:110px;height:110px;pointer-events:none}
@media (orientation:landscape){
  .isd-sheet{max-width:640px;padding:8px 22px calc(98px + env(safe-area-inset-bottom,0px));grid-template-columns:1fr 1fr;gap:10px 22px;align-items:center}
  .isd-grab,.isd-head,.isd-row{grid-column:1/-1}
  .isd-why{gap:5px}
  .isd.ios .isd-p{display:none}
  .isd.ios .isd-why{grid-column:1}.isd.ios .isd-ios{grid-column:2}
  h2{font-size:21px}
  .isd-laila{width:84px;height:84px;bottom:calc(6px + env(safe-area-inset-bottom,0px))}
}
@media (prefers-reduced-motion:reduce){.isd-sheet,.isd-dim{transition:none}}
`],
})
export class InstallSheet {
  private readonly router = inject(Router);
  private readonly fam = inject(FamilyService);
  /** The brand's K on cream (public/favicon.svg, as the app icon draws it). */
  readonly K = inject(DomSanitizer).bypassSecurityTrustHtml('<svg viewBox="0 0 930 930" aria-hidden="true"><rect width="930" height="930" fill="#FBF3DE"/><g transform="translate(465 472) scale(.62) translate(-465 -472)"><path fill="#E63946" transform="translate(157.0,775.0) scale(1,-1)" d="M152 310 215 350Q321 248 397.5 168.0Q474 88 527 40Q526 18 514.0 5.5Q502 -7 484 -7Q467 -7 453.5 3.0Q440 13 426 26ZM226 282 145 300 446 612Q472 611 485.0 599.0Q498 587 498 571Q498 558 491.5 546.5Q485 535 471 523ZM89 367H171V1Q165 -1 155.0 -3.5Q145 -6 133 -6Q111 -6 100.0 3.0Q89 12 89 31ZM171 300H89V606Q94 608 104.5 610.5Q115 613 127 613Q149 613 160.0 604.5Q171 596 171 576Z"/></g></svg>');
  /** An iPhone or iPad (iPadOS says it is a Mac, but has touch). */
  readonly ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  readonly lailaSize = 110;   // the box sets her size (84 px sideways)
  /** In the page (rendered off screen) / slid up. */
  readonly on = signal(false);
  readonly up = signal(false);
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    const SUB = this.router.events.subscribe((e) => { if (e instanceof NavigationEnd) this.route(e.urlAfterRedirects); });
    const OFFER = () => this.route(this.router.url);
    addEventListener('kratu-installable', OFFER);
    const GONE = () => { window.__kratuInstall = null; this.hide(); };
    addEventListener('appinstalled', GONE);
    inject(DestroyRef).onDestroy(() => { SUB.unsubscribe(); removeEventListener('kratu-installable', OFFER); removeEventListener('appinstalled', GONE); this.clear(); });
  }

  /** Running from its icon already: never. */
  private installed(): boolean {
    return matchMedia('(display-mode: standalone), (display-mode: fullscreen), (display-mode: minimal-ui)').matches || (navigator as any).standalone === true;
  }
  private can(): boolean { return !this.installed() && (!!window.__kratuInstall || this.ios); }
  private waiting(): boolean {
    try { const AT = Number(localStorage.getItem(K_LATER) || 0); return AT > 0 && Date.now() - AT < LATER_MS; } catch { return false; }
  }
  /** The home screen with no family screen over it; anything else hides the sheet at once. */
  private route(url: string): void {
    const HOME = /^\/home(?:[/?#]|$)/.test(url);
    if (!HOME) { this.hide(); return; }
    if (this.on() || this.timer || !this.can() || this.waiting()) return;
    this.timer = setTimeout(() => {
      this.timer = null;
      if (!/^\/home(?:[/?#]|$)/.test(this.router.url) || this.fam.screen() || !this.can() || this.waiting()) return;
      this.on.set(true);
      requestAnimationFrame(() => requestAnimationFrame(() => this.up.set(true)));
      if (INSTALL_LINE) console.log('[kratu] install sheet line', INSTALL_LINE);
      console.log('[kratu] install sheet shown', this.ios ? '(iPhone steps)' : '(install offer)');
    }, SHOW_AFTER_MS);
  }
  private clear(): void { if (this.timer) { clearTimeout(this.timer); this.timer = null; } }
  private hide(): void {
    this.clear(); if (!this.on()) return;
    this.up.set(false); setTimeout(() => { if (!this.up()) this.on.set(false); }, 450);
  }
  /** Later, the close X, or "I’ve done it" on an iPhone: kept on the phone, not again for 3 days. */
  later(): void { try { localStorage.setItem(K_LATER, String(Date.now())); } catch { /* ignore */ } this.hide(); }
  /** Chrome's own install box. Turned down there counts as Later; accepted, the sheet never comes back. */
  async install(): Promise<void> {
    const EV = window.__kratuInstall; if (!EV) { this.later(); return; }
    try {
      await EV.prompt(); const C = await EV.userChoice; console.log('[kratu] install', C?.outcome);
      window.__kratuInstall = null;
      if (C?.outcome === 'accepted') this.hide(); else this.later();
    } catch (e) { console.warn('[kratu] install box refused', String(e)); this.later(); }
  }
}
