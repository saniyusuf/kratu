import { Component, DestroyRef, ViewEncapsulation, computed, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AppUpdate } from '@kratu/app/core/pwa/app-update.service';
import { FamilyService } from '@kratu/app/core/family/family.service';
import { SessionService } from '@kratu/app/core/state/session.service';

/** The bar's height under the phone's own top edge. */
const BAR_PX = 56;
/** The one smooth move, in and out (the bar and the home screen together). */
const MOVE_MS = 450;
/** Back on the screen they left after a Reload: this long before the bar goes. */
const RESUMED_HOLD_MS = 700;

/**
 * "New version available" (Sani 2026-11-25, design 2a): a teal bar across the very top edge, shown on the family home
 * only, and only once the new version is fully downloaded and ready. It slides down and the home screen eases down
 * with it in one smooth move (a transform: the screen is drawn a little smaller under the bar, nothing is laid out
 * again), then stays still; it eases back up when the bar goes. Never in a lesson, a game or a family screen, and never
 * together with the install sheet (the update wins, the sheet waits).
 * Reload keeps the session: the child and the screen are kept for the reload, which goes straight back to them with no
 * sign-in, no greeting and no loading line (AppUpdate.reloadKeep, FamilyService.resume). Later hides it until the next
 * check. Words only, no tick or cross.
 */
@Component({
  selector: 'app-update-bar',
  encapsulation: ViewEncapsulation.None,
  template: `
@if (on()) {
<div class="fub" [class.up]="up()" [class.now]="now" role="status">
  @if (busy()) {<span class="fub-t">Updating Kratu…</span><span class="fub-bar"><i></i></span>}
  @else {<span class="fub-t">New version available</span><button class="fub-go" type="button" (click)="reload()">Reload</button><button class="fub-no" type="button" (click)="upd.dismiss()">Later</button>}
</div>}`,
  styles: [`
app-update-bar{display:contents}
.fub{position:fixed;left:0;right:0;top:0;z-index:960;box-sizing:border-box;height:calc(${BAR_PX}px + env(safe-area-inset-top,0px));padding:env(safe-area-inset-top,0px) max(10px,env(safe-area-inset-right,0px)) 0 max(16px,env(safe-area-inset-left,0px));background:#2FAE9E;color:#fff;display:flex;align-items:center;gap:10px;font:800 16px var(--body,'Nunito',sans-serif);box-shadow:0 2px 8px rgba(20,80,70,.18);transform:translateY(-100%);transition:transform ${MOVE_MS}ms cubic-bezier(.2,.8,.2,1)}
.fub.up{transform:none}
.fub.now{transition:none}
.fub-t{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fub button{cursor:pointer;-webkit-tap-highlight-color:transparent}
.fub-go{border:0;border-radius:12px;background:#fff;color:#1E7A6E;min-height:40px;padding:0 18px;font:800 16px var(--disp,'Baloo 2',sans-serif);box-shadow:0 2px 0 #1E8A7C}
.fub-go:focus-visible,.fub-no:focus-visible{outline:3px solid #FFE08A;outline-offset:2px}
.fub-no{border:0;background:none;color:#fff;font:800 15px var(--body,sans-serif);text-decoration:underline;min-height:44px;padding:0 8px}
.fub-bar{display:block;flex:none;width:110px;height:6px;margin-right:8px;border-radius:3px;background:rgba(255,255,255,.3);overflow:hidden;position:relative}
.fub-bar i{position:absolute;top:0;bottom:0;left:0;width:40%;border-radius:3px;background:#fff;animation:fubMove 1.1s ease-in-out infinite alternate}
@keyframes fubMove{from{transform:translateX(-10%)}to{transform:translateX(160%)}}
/* the home screen under it: one smooth move down, drawn a little smaller so all of it still shows, nothing laid out again */
#app{transition:transform ${MOVE_MS}ms cubic-bezier(.2,.8,.2,1)}
html.fam-updbar #app{transform:translateY(var(--fub-h)) scale(var(--fub-s));transform-origin:50% 0}
html.fam-updbar.fub-now #app,html.fub-still #app{transition:none!important}
html.fub-measure #app{transform:none!important}
html.fam-updbar,html.fam-updbar body{background:linear-gradient(#CDBC98,#C6B597 55%,#B8A88B)}   /* the home's own edge colour, so the narrow sides left by the smaller drawing read as its frame */
/* back from a Reload: the loader's words and pictures stay hidden, the bar says "Updating Kratu…" */
html.kratu-resume #loader>*{visibility:hidden}
@media (prefers-reduced-motion:reduce){.fub,#app{transition:none}.fub-bar i{animation:none;width:60%}}
`],
})
export class UpdateBar {
  readonly upd = inject(AppUpdate);
  private readonly fam = inject(FamilyService);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);
  private readonly url = signal(this.router.url);
  /** Back from a Reload: the bar is already there when Kratu opens, so it does not slide in. */
  readonly now = this.upd.resuming();
  readonly busy = computed(() => this.upd.busy() || this.upd.resuming());
  private readonly home = computed(() => /^\/home(?:[/?#]|$)/.test(this.url()) && !this.fam.screen());
  /** Wanted: the new version is in, on home, not put off, the install sheet not up; or the switch is under way. */
  private readonly want = computed(() => this.busy() || (this.upd.ready() && !this.upd.later() && this.home() && !this.upd.installUp()));
  readonly on = signal(false);
  readonly up = signal(false);
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    const SUB = this.router.events.subscribe((e) => { if (e instanceof NavigationEnd) this.url.set(e.urlAfterRedirects); });
    const FIT = () => this.fit();
    addEventListener('resize', FIT);
    inject(DestroyRef).onDestroy(() => { SUB.unsubscribe(); removeEventListener('resize', FIT); });
    this.fit();
    if (this.now) { this.on.set(true); this.up.set(true); this.push(true, true); }
    effect(() => { const W = this.want(); if (W) this.show(); else this.hide(); });
    // back on the screen they left after a Reload: a moment, then the bar and the home's move go together
    effect(() => { if (this.upd.resuming() && this.home() && this.session.known()) setTimeout(() => this.upd.resumed(), RESUMED_HOLD_MS); });
  }

  /** How far the home moves and how much smaller it is drawn: the bar's own height, safe area included. */
  private fit(): void {
    const S = document.documentElement.style, PX = BAR_PX + this.safeTop();
    S.setProperty('--fub-h', PX + 'px'); S.setProperty('--fub-s', String(Math.max(0.5, (innerHeight - PX) / innerHeight)));
  }
  private safeTop(): number {
    const P = document.createElement('div'); P.style.cssText = 'position:fixed;top:0;height:env(safe-area-inset-top,0px);visibility:hidden;pointer-events:none';
    document.body.appendChild(P); const H = P.getBoundingClientRect().height; P.remove(); return H;
  }
  private push(on: boolean, instant = false): void {
    const H = document.documentElement.classList;
    H.toggle('fub-now', instant); H.toggle('fam-updbar', on);
    if (instant) requestAnimationFrame(() => requestAnimationFrame(() => H.remove('fub-now')));
  }
  private show(): void {
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
    if (this.up()) return;
    this.fit(); this.on.set(true);
    requestAnimationFrame(() => requestAnimationFrame(() => { this.up.set(true); this.push(true); }));
  }
  private hide(): void {
    if (!this.on() || this.timer) return;
    this.up.set(false); this.push(false);
    this.timer = setTimeout(() => { this.timer = null; if (!this.up()) this.on.set(false); }, MOVE_MS);
  }
  /** Reload: into the new version, straight back to this child on this screen. */
  reload(): void {
    this.upd.reloadKeep({ kid: this.session.personId(), guest: this.session.guest(), route: this.router.url });
  }
}
