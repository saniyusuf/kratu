import { Injectable, signal } from '@angular/core';

/** Lets a screen open the settings panel at one of its pages: the chooser's games corner opens Wasanni (Sani 2026-11-05). */
@Injectable({ providedIn: 'root' })
export class SettingsPanel {
  /** Bumped on every ask, so asking twice for the same page opens it twice. */
  readonly ask = signal<{ stage: 'games'; n: number } | null>(null);
  games(): void { this.ask.set({ stage: 'games', n: (this.ask()?.n ?? 0) + 1 }); }
}
