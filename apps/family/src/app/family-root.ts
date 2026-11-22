import { Component, inject } from '@angular/core';
import { NavigationEnd, ResolveEnd, Router } from '@angular/router';
import { App } from '@kratu/app/app';
import { FamilyShell } from './family-shell';

/**
 * The family app (Sani 2026-11-18): the whole Kratu app (loader, lessons, games, settings) shared from the main app,
 * with the family's own screens drawn over it: welcome, microphone, parent PIN, add a child, the profiles with Guest.
 */
@Component({
  selector: 'family-root',
  imports: [App, FamilyShell],
  template: `<app-root /><app-family-shell />`,
  styles: [`:host{display:contents}`],
})
export class FamilyRoot {
  /**
   * Upright on a phone (Sani 2026-11-18): every menu and lesson follows the phone; only the games are always landscape,
   * drawn turned a quarter when the phone is held upright. The games are the judging games, the balloons, Nemo hoto
   * and the letters gate.
   */
  static readonly GAMES = /^\/(wasanni\/[^/?#]+|fashe|nemo|haruffa\/gwada)(?:[/?#]|$)/;
  constructor() {
    const set = (url: string) => document.documentElement.classList.toggle('fam-up', !FamilyRoot.GAMES.test(url));
    document.documentElement.classList.add('fam-build');   // the family build's own look on shared screens (app.css), e.g. no emoji, the camera's border
    const router = inject(Router);
    set(location.pathname);
    // before the new screen is drawn (ResolveEnd), so its fit is measured the right way round
    router.events.subscribe((e) => { if (e instanceof ResolveEnd || e instanceof NavigationEnd) set(e.urlAfterRedirects); });
  }
}
