import { Component, ViewEncapsulation, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { bootArt4 } from '../../features/games/lab/art4';
import { previewSvg } from './previews';

/**
 * A game's live preview (Sani 2026-11-06): <app-game-preview [gid]="id" />. It draws previewSvg(gid) — the game's own
 * scene with a few of its pieces moving (previews.ts) — inside a .glab box so the scenes' own styles and slow movements
 * apply, scaled to fill whatever box it is given. Only the one mounted preview runs; it holds still under
 * prefers-reduced-motion. The styles are the games' own (scoped under .glab) plus preview.css.
 */
@Component({
  selector: 'app-game-preview',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'gprevhost' },
  template: `<div class="glab gprev"><div class="gbg" [innerHTML]="svg()"></div></div>`,
  styleUrls: ['../../features/games/lab/gamelab.css', '../../features/games/lab/kalangu.css', '../../features/games/lab/teastall.css', '../../features/games/lab/kamun.css', '../../features/games/lab/rest.css',
    '../../features/games/lab/sc-kogi.css', '../../features/games/lab/sc-jirgi.css', '../../features/games/lab/sc-allo.css', '../../features/games/lab/sc-wasika.css', '../../features/games/lab/sc-tukwane.css',
    '../../features/games/lab/sc-bulo.css', '../../features/games/lab/sc-kasuwa.css', '../../features/games/lab/sc-suya.css', '../../features/games/lab/sc-gyada.css', '../../features/games/lab/sc-shanu.css',
    '../../features/games/lab/sc-garke.css', '../../features/games/lab/dillali.css', '../../features/games/lab/sc-dillali.css', '../../features/games/lab/sc-ruwa.css', '../../features/games/lab/sc-rini.css', './preview.css'],
})
export class GamePreview {
  readonly gid = input.required<string>();
  private readonly san = inject(DomSanitizer);
  constructor() { bootArt4(); }   // the shared gradients some scenes paint with
  readonly svg = computed(() => this.san.bypassSecurityTrustHtml(previewSvg(this.gid()) || ''));
}
