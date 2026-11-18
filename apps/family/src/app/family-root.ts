import { Component } from '@angular/core';
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
export class FamilyRoot {}
