import { Component, ElementRef, OnDestroy, OnInit, ViewEncapsulation, inject, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AudioBus } from '../../../core/audio/audio-bus.service';
import { SessionService } from '../../../core/state/session.service';
import { SpeechService } from '../../../core/speech/speech.service';
import { ProgressService } from '../../../core/state/progress.service';
import { ZoomService } from '../../../core/zoom/zoom.service';
import { Door, Ear } from '../../../shared/chrome/chrome';
import { matchWord } from '../../../shared/lesson/helpers';
import { ALLO_SVG } from '../../../shared/allo';
import { LAILA_SVG } from '../../../shared/svg';
import { afterPaint } from '../../../shared/paint';
import { GameHandle, GameOpts, playGame } from './engine';

const WORDS = ['goat', 'mango', 'car', 'dog', 'cat', 'fish', 'apple', 'banana', 'horse', 'cow', 'bus', 'tomato', 'bread', 'egg', 'orange', 'onion', 'cup', 'chair', 'bed', 'sun', 'book', 'chicken',
  // the Arewa games: the dillali's goods, the mai shayi's menu, the allo's and the ferry's words, the letter writer's names
  'ram', 'camel', 'donkey', 'millet', 'groundnut', 'calabash', 'pot', 'mat', 'kettle', 'broom', 'kaftan', 'cap', 'turban', 'shoe', 'umbrella',
  'school', 'farm', 'river', 'well', 'forest', 'road', 'tea', 'sugar', 'milk', 'rice', 'beans', 'water', 'pen', 'key', 'milk', 'mama', 'baba', 'aunt', 'uncle'];
const PEOPLE = ['woman', 'man', 'girl', 'boy', 'old_man'];
const NUMS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
/** Lambobi's numbers by value: 1–10 have their own word clips, the rest are the n-keys of the Lambobi lessons. */
const NUMBER: Record<number, string> = { 1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten', 11: 'Eleven', 12: 'Twelve', 13: 'Thirteen', 14: 'Fourteen',
  15: 'Fifteen', 16: 'Sixteen', 17: 'Seventeen', 18: 'Eighteen', 19: 'Nineteen', 20: 'Twenty', 30: 'Thirty', 40: 'Forty', 50: 'Fifty', 60: 'Sixty', 70: 'Seventy', 80: 'Eighty', 90: 'Ninety', 100: 'One hundred',
  200: 'Two hundred', 300: 'Three hundred', 400: 'Four hundred', 500: 'Five hundred', 600: 'Six hundred', 700: 'Seven hundred', 800: 'Eight hundred', 900: 'Nine hundred', 1000: 'One thousand' };
/** Every game's two lines: the question first (Na sani / Ban sani ba), then how to play. Keys written out, so the content lint sees them. */
const LINES: Record<string, { ask: string; how: string }> = {
  'j-haruffa-say': { ask: 's_g_lanterns_ask', how: 's_g_lanterns_how' },
  'j-abubuwa': { ask: 's_g_fish_ask', how: 's_g_fish_how' },
  'j-magana': { ask: 's_g_drum_ask', how: 's_g_drum_how' },
  'j-nemo': { ask: 's_g_market_ask', how: 's_g_market_how' },
  'j-karatu': { ask: 's_g_canoes_ask', how: 's_g_canoes_how' },
  'j-rubutu': { ask: 's_g_pots_ask', how: 's_g_pots_how' },
  'j-rubutu-say': { ask: 's_g_house_ask', how: 's_g_house_how' },
  // the Arewa games ask the same question as the other games of their lesson
  'j-durbar': { ask: 's_g_lanterns_ask', how: 's_g_durbar_how' },
  'j-dillali': { ask: 's_g_drum_ask', how: 's_g_dillali_how' },
  'j-shayi': { ask: 's_g_drum_ask', how: 's_g_shayi_how' },
  'j-gyada': { ask: 's_g_stars_ask', how: 's_g_gyada_how' },
  'j-shanu': { ask: 's_g_stars_ask', how: 's_g_shanu_how' },
  'j-garke': { ask: 's_g_stars_ask', how: 's_g_garke_how' },
  'j-suya': { ask: 's_g_stars_ask', how: 's_g_suya_how' },
  'j-allo': { ask: 's_g_canoes_ask', how: 's_g_allo_how' },
  'j-jirgi': { ask: 's_g_canoes_ask', how: 's_g_jirgi_how' },
  'j-marubuci': { ask: 's_g_house_ask', how: 's_g_marubuci_how' },
};

/**
 * Wasanni · the judging games from the proposal, playable inside the app (Sani 2026-10-14). For now they are reached only
 * from the settings gear; the balloons stay the one game the lessons use. The engine draws everything inside one fixed
 * box (.glab.nofit), absolutely placed, so the zoom never measures it and nothing on the screen moves while a game plays.
 */
@Component({
  selector: 'app-gamelab',
  imports: [Door, Ear],
  host: { class: 's gamelab' },
  encapsulation: ViewEncapsulation.None,
  styleUrl: './gamelab.css',
  template: `<div #frame class="glab nofit"><div class="gbg"></div><div class="gbox"><div class="scr"></div></div></div><app-door (pressed)="leave()" /><app-ear (pressed)="again()" />`,
})
export class GameLabScreen implements OnInit, OnDestroy {
  private readonly bus = inject(AudioBus);
  private readonly session = inject(SessionService);
  private readonly speech = inject(SpeechService);
  private readonly zoom = inject(ZoomService);
  private readonly progress = inject(ProgressService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly frame = viewChild.required<ElementRef<HTMLElement>>('frame');
  private game: GameHandle | null = null;
  private gone = false;
  /** The yay or nope still sounding: Laila's next line waits for it, so neither cuts the other off. */
  private sfxP: Promise<unknown> = Promise.resolve();

  ngOnInit(): void {
    afterPaint().then(() => { if (!this.gone) this.start(this.route.snapshot.paramMap.get('id') || 'j-magana'); });
  }
  ngOnDestroy(): void { this.gone = true; this.game?.stop(); this.bus.stopAll(); }

  private start(id: string): void {
    const map = (keys: string[], f: (k: string) => string) => Object.fromEntries(keys.map((k) => [k, f(k)]));
    const K = {
      pic: map(WORDS.concat(PEOPLE), (w) => 'assets/pictures/' + w + '.webp'),
      en: { ...map(WORDS.concat(NUMS), (w) => 'assets/audio/en/word_' + w + '.ogg'),
        ...Object.fromEntries(Object.keys(NUMBER).map((n) => ['n' + n, 'assets/audio/en/word_' + (+n <= 10 ? NUMBER[+n].toLowerCase() : 'n' + n) + '.ogg'])) },
      enText: Object.fromEntries(Object.entries(NUMBER).map(([n, t]) => ['n' + n, t])),
      L: map('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), (L) => 'assets/audio/en/app_en_' + L + '.ogg'),
      yay: 'assets/audio/sfx/yay.ogg', nope: 'assets/audio/sfx/nope.ogg',
      lines: LINES, learn: 's_g_learn', kudos: 'app_kudos', go: 's_g_go',
      laila: LAILA_SVG, allo: ALLO_SVG,
    };
    this.game = playGame(this.frame().nativeElement, id, {
      K, female: this.session.g() === 'f', tester: this.session.debug,
      say: (src) => this.sfxP.then(() => this.gone ? false : src.startsWith('assets/') ? this.bus.playRaw(src) : this.bus.play(this.bus.gk(src))).catch(() => false),
      hush: () => this.bus.stopAll(),
      sfx: (src) => { this.sfxP = this.bus.playRaw(src).catch(() => false); },
      hear: (o) => this.speech.hear(o),
      match: (raw, word, among) => matchWord(raw, word, among),
      rect: (el) => this.zoom.rect(el),
      leave: () => this.leave(),
      next: (r) => {
        const q = this.route.snapshot.queryParamMap;
        // the speaking check after the balloons: only letters said aloud count as known (Sani 2026-10-21)
        if (q.get('prove')) { this.router.navigateByUrl(this.progress.proveSaid(this.opts().letters || [], (r && r.missed) || []) ? '/home' : '/haruffa/koyo'); return; }
        const n = q.get('next'); if (n && n.startsWith('/')) this.router.navigateByUrl(n); else this.leave();
      },
    }, this.opts());
  }
  /** ?letters=ABCD&order=in|mixed: only those letters; ?next=/…: played inside a lesson, which it hands back to. */
  private opts(): GameOpts {
    const q = this.route.snapshot.queryParamMap, letters = (q.get('letters') || '').toUpperCase().replace(/[^A-Z]/g, '').split('').filter(Boolean);
    return { letters: letters.length ? letters : undefined, order: q.get('order') === 'mixed' ? 'mixed' : 'in', lesson: !!(q.get('next') || q.get('prove')) };
  }
  again(): void { this.game?.again(); }
  leave(): void { this.game?.stop(); this.bus.stopAll(); this.router.navigate(['/home']); }
}
