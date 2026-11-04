import { Component, ElementRef, OnDestroy, OnInit, ViewEncapsulation, inject, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AudioBus } from '../../../core/audio/audio-bus.service';
import { SessionService } from '../../../core/state/session.service';
import { SpeechService } from '../../../core/speech/speech.service';
import { WordsService } from '../../../core/clips/words.service';
import { ProgressService } from '../../../core/state/progress.service';
import { CourseService } from '../../../core/state/course.service';
import { ZoomService } from '../../../core/zoom/zoom.service';
import { Door, Ear } from '../../../shared/chrome/chrome';
import { matchWord } from '../../../shared/lesson/helpers';
import { ALLO_SVG } from '../../../shared/allo';
import { LAILA_SVG } from '../../../shared/svg';
import { afterPaint } from '../../../shared/paint';
import { GameHandle, GameOpts, playGame } from './engine';
import { LEVEL_AT, TITLES, unlockLines } from '../../../core/state/zinari';
import { CourseGate } from '../../../core/state/course-gate.service';
import { playUnlock, UnlockHandle } from './unlock';
import { Spotter } from '../../../shared/lesson/helpers';

const WORDS = ['goat', 'mango', 'car', 'dog', 'cat', 'fish', 'apple', 'banana', 'horse', 'cow', 'bus', 'tomato', 'bread', 'egg', 'orange', 'onion', 'cup', 'chair', 'bed', 'sun', 'book', 'chicken',
  // the Arewa games: the dillali's goods, the mai shayi's menu, the allo's and the ferry's words, the letter writer's names
  'ram', 'camel', 'donkey', 'millet', 'groundnut', 'calabash', 'pot', 'mat', 'kettle', 'broom', 'kaftan', 'cap', 'turban', 'shoe', 'umbrella',
  'school', 'farm', 'river', 'well', 'forest', 'road', 'tea', 'sugar', 'milk', 'spoon', 'rice', 'beans', 'water', 'pen', 'key', 'mama', 'baba', 'aunt', 'uncle',
  // Ruwan sama and Karofi (2026-11-02): the longer words they read and spell
  'sheep', 'plate', 'table', 'teacher', 'farmer', 'flower'];
const PEOPLE = ['woman', 'man', 'girl', 'boy', 'old_man'];
const NUMS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
/** Lambobi's numbers by value: 1–10 have their own word clips, the rest are the n-keys of the Lambobi lessons. */
const NUMBER: Record<number, string> = { 1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten', 11: 'Eleven', 12: 'Twelve', 13: 'Thirteen', 14: 'Fourteen',
  15: 'Fifteen', 16: 'Sixteen', 17: 'Seventeen', 18: 'Eighteen', 19: 'Nineteen', 20: 'Twenty', 30: 'Thirty', 40: 'Forty', 50: 'Fifty', 60: 'Sixty', 70: 'Seventy', 80: 'Eighty', 90: 'Ninety', 100: 'One hundred',
  200: 'Two hundred', 300: 'Three hundred', 400: 'Four hundred', 500: 'Five hundred', 600: 'Six hundred', 700: 'Seven hundred', 800: 'Eight hundred', 900: 'Nine hundred', 1000: 'One thousand' };
/** Every game's how-to, said before its first play (the "do you know this game?" question is gone, Sani 2026-11-04).
 *  Keys written out, so the content lint sees them. */
const LINES: Record<string, { how: string }> = {
  'j-abubuwa': { how: 's_g_fish_how' },
  'j-magana': { how: 's_g_drum_how' },
  'j-nemo': { how: 's_g_market_how' },
  'j-karatu': { how: 's_g_canoes_how' },
  'j-rubutu': { how: 's_g_pots_how' },
  'j-rubutu-say': { how: 's_g_house_how' },
  // the Arewa games ask the same question as the other games of their lesson
  'j-durbar': { how: 's_g_durbar_how' },
  'j-dillali': { how: 's_g_dillali_how' },
  'j-shayi': { how: 's_g_shayi_how' },
  'j-gyada': { how: 's_g_gyada_how' },
  'j-shanu': { how: 's_g_shanu_how' },
  'j-garke': { how: 's_g_garke_how' },
  'j-suya': { how: 's_g_suya_how' },
  'j-allo': { how: 's_g_allo_how' },
  'j-jirgi': { how: 's_g_jirgi_how' },
  'j-marubuci': { how: 's_g_marubuci_how' },
  'j-ruwa': { how: 's_g_ruwa_how' },
  'j-rini': { how: 's_g_rini_how' },
};

/**
 * Wasanni · the judging games from the proposal, playable inside the app (Sani 2026-10-14). For now they are reached only
 * from the settings gear; the balloons stay the one game the lessons use. The engine draws everything inside one fixed
 * box (.glab.nofit), absolutely placed, so the zoom never measures it and nothing on the screen moves while a game plays.
 */
@Component({
  selector: 'app-gamelab',
  imports: [Door, Ear],
  host: { class: 's lesson gamelab' },
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./gamelab.css', './kalangu.css', './teastall.css', './kamun.css', './rest.css', './sc-kogi.css', './sc-jirgi.css', './sc-allo.css', './sc-wasika.css', './sc-tukwane.css', './sc-bulo.css', './sc-kasuwa.css', './sc-suya.css', './sc-gyada.css', './sc-shanu.css', './sc-garke.css', './dillali.css', './sc-dillali.css', './sc-ruwa.css', './sc-rini.css', './zinari.css', './unlock.css'],
  template: `<div #frame class="glab nofit"><div class="gbg"></div><div class="gbox"><div class="scr"></div></div></div><app-door (pressed)="leave()" /><app-ear (pressed)="again()" />`,
})
export class GameLabScreen implements OnInit, OnDestroy {
  private readonly bus = inject(AudioBus);
  private readonly session = inject(SessionService);
  private readonly speech = inject(SpeechService);
  private readonly zoom = inject(ZoomService);
  private readonly progress = inject(ProgressService);
  private readonly course = inject(CourseService);
  private readonly cgate = inject(CourseGate);
  private unl: UnlockHandle | null = null;
  private readonly words = inject(WordsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly frame = viewChild.required<ElementRef<HTMLElement>>('frame');
  private game: GameHandle | null = null;
  private gone = false;
  private readonly spotter = new Spotter(inject(ElementRef).nativeElement, inject(ZoomService));
  /** The yay or nope still sounding: Laila's next line waits for it, so neither cuts the other off. */
  private sfxP: Promise<unknown> = Promise.resolve();

  ngOnInit(): void {
    // the word list first: a lesson's words are given by key, and a key is not always the word as written (sorghum: Guinea corn)
    afterPaint().then(() => this.words.load().catch(() => undefined)).then(() => { if (!this.gone) this.start(this.route.snapshot.paramMap.get('id') || 'j-magana'); });
  }
  ngOnDestroy(): void { this.gone = true; this.spotter.unspot(); this.unl?.stop(); this.unl = null; this.game?.stop(); this.game = null; this.bus.stopAll(); }

  private start(id: string): void {
    if (id === 'unlock') { this.unlockOnly(); return; }
    const map = (keys: string[], f: (k: string) => string) => Object.fromEntries(keys.map((k) => [k, f(k)]));
    // ?words=…: a lesson's own words, so their pictures and clips are there too (a key the content does not know is dropped)
    const extra = (this.opts().words || []).filter((w) => this.words.find(w)), info = (w: string) => this.words.find(w);
    const K = {
      pic: { ...map(WORDS.concat(PEOPLE), (w) => 'assets/pictures/' + w + '.webp'), ...map(extra, (w) => info(w)!.img || 'assets/pictures/' + w + '.webp') },
      /** each word as written, for reading, spelling and hearing it: the key is not always the word */
      word: Object.fromEntries(WORDS.concat(PEOPLE, extra).map((w) => [w, info(w)?.en || w.replace(/_/g, ' ')])),
      en: { ...map(WORDS.concat(NUMS), (w) => 'assets/audio/en/word_' + w + '.ogg'), ...map(extra, (w) => info(w)!.en_clip || 'assets/audio/en/word_' + w + '.ogg'),
        ...Object.fromEntries(Object.keys(NUMBER).map((n) => ['n' + n, 'assets/audio/en/word_' + (+n <= 10 ? NUMBER[+n].toLowerCase() : 'n' + n) + '.ogg'])) },
      enText: Object.fromEntries(Object.entries(NUMBER).map(([n, t]) => ['n' + n, t])),
      L: map('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), (L) => 'assets/audio/en/app_en_' + L + '.ogg'),
      yay: 'assets/audio/sfx/yay.ogg', nope: 'assets/audio/sfx/nope.ogg',
      lines: LINES, learn: 's_g_learn', kudos: 'app_kudos', go: 's_g_go', unlock: 's_game_open',
      laila: LAILA_SVG, allo: ALLO_SVG,
    };
    this.game = playGame(this.frame().nativeElement, id, {
      K, female: this.session.g() === 'f', tester: /[?&]tester=1\b/.test(location.search),   // the ✓ ✗ answer buttons: only with ?tester=1 in the link, for a desk without a microphone; never sticky, never on a tablet (Sani 2026-10-25: "remove that everywhere")
      say: (src) => this.sfxP.then(() => this.gone ? false : src.startsWith('assets/') ? this.bus.playRaw(src) : this.bus.play(this.bus.gk(src))).catch(() => false),
      hush: () => this.bus.stopAll(),
      has: (k) => this.bus.has(this.bus.gk(k)),
      sfx: (src) => { this.sfxP = this.bus.playRaw(src).catch(() => false); },
      hear: (o) => this.speech.hear(o),
      amp: () => this.speech.amp(), preparing: () => this.speech.preparing(),
      match: (raw, word, among) => matchWord(raw, word, among),
      rect: (el) => this.zoom.rect(el),
      leave: () => this.leave(),
      firstTime: () => this.progress.unlockGame(id),
      award: (a: { stars: number; tries: number }) => this.award(id, a),
      zinari: () => this.progress.zinari(), levels: LEVEL_AT,
      spot: (el: Element | null) => { if (el) this.spotter.spot(el, 'left'); else this.spotter.unspot(); },
      next: (r) => {
        if (r && r.gate) { this.gate(r); return; }
        const q = this.route.snapshot.queryParamMap;
        const n = q.get('next'), missed = ((r && r.missed) || []).join('');
        if (n && n.startsWith('/')) this.router.navigateByUrl(missed ? n + (n.includes('?') ? '&' : '?') + 'again=' + missed : n); else this.leave();
      },
    }, this.opts());
  }
  /** ?letters=ABCD: only those letters; ?words=mango,bread: the lesson's words, every one of them played (every word game,
   *  Sani 2026-11-02: a game practises all the words just learned); ?next=/…:
   *  played inside a lesson, which it hands back to. */
  private opts(): GameOpts {
    const q = this.route.snapshot.queryParamMap, letters = (q.get('letters') || '').toUpperCase().replace(/[^A-Z]/g, '').split('').filter(Boolean);
    const words = (q.get('words') || '').toLowerCase().split(',').map((w) => w.trim()).filter((w) => /^[a-z_]+$/.test(w));
    const lesson = !!q.get('next'), id = this.route.snapshot.paramMap.get('id') || '';
    // the course's gate: inside the course (a step number), or whenever the simulator is on (Sani 2026-11-02)
    const gate = lesson && (q.get('step') || this.course.on())
      ? { tries: Math.max(1, Math.min(2, +(q.get('try') || 1))), first: !this.progress.games().includes(id), sim: this.course.on() || /[?&]debug\b/.test(location.search) } : undefined;
    return { letters: letters.length ? letters : undefined, words: words.length ? words : undefined, lesson, gate };
  }
  /** After the gate's result, Laila's press: passed, on to the next step; first miss, the same game again with a new mix;
   *  second miss, a review lesson of the words missed, which comes back to this game (its intro, a fresh first try). */
  private gate(r: { pass: boolean; missed: string[]; review: string[] | null; tries: number; letters: boolean }): void {
    const q = this.route.snapshot.queryParamMap, step = q.get('step'), id = this.route.snapshot.paramMap.get('id') || '';
    const here = (t: number) => { const p = new URLSearchParams(location.search); p.set('try', String(t)); return '/wasanni/' + id + '?' + p.toString(); };
    const reopen = (url: string) => this.router.navigateByUrl('/blank', { skipLocationChange: true }).then(() => this.router.navigateByUrl(url));
    if (r.pass) {
      // straight on to the next step of the course, never back to the menu (Sani 2026-11-03)
      if (step) { this.course.done(+step); const nx = this.course.step(); if (nx && this.course.at() === +step + 1) { const rt = this.course.route(nx); reopen(this.router.serializeUrl(this.router.createUrlTree(['/' + rt.path], { queryParams: rt.query }))); return; } }
      const n = q.get('next'); this.router.navigateByUrl(n && n.startsWith('/') ? n : '/home'); return;
    }
    if (r.tries < 2) { reopen(here(2)); return; }
    // the letters missed are taught again on their own, and the game comes back (its intro, a fresh first try)
    if (r.letters && r.missed.length) { this.router.navigate(['/haruffa/koyo'], { queryParams: { letters: r.missed.join(''), back: here(1) } }); return; }
    if (r.review && r.review.length) { this.router.navigate(['/abubuwa/koyo'], { queryParams: { words: r.review.join(','), review: 1, back: here(1) } }); return; }
    reopen(here(1));   // nothing to review by word (a counting game): a fresh first try
  }
  /** A passed game's Zinari (Sani 2026-11-03): paid once on the result screen. When it fills a bag, that bag's title is
   *  granted there and then (Sani 2026-11-04): the unlock plays, and the course goes on only after Laila is pressed. */
  private award(id: string, a: { stars: number; tries: number }) { return this.cgate.award(id, this.route.snapshot.queryParamMap.get('step'), a.stars, a.tries); }
  /** /wasanni/unlock?i=…&next=…: a title won on a screen of its own (Nemo hoto, the balloons) is granted here, in the
   *  game frame where the unlock is drawn, and Laila's press carries on to the next step (Sani 2026-11-04). */
  private unlockOnly(): void {
    const q = this.route.snapshot.queryParamMap, i = Math.max(0, Math.min(TITLES.length - 1, +(q.get('i') || 0))), t = TITLES[i], next = q.get('next') || '/home';
    const frame = this.frame().nativeElement, f = this.session.g() === 'f';
    frame.querySelector('.gbg')?.classList.add('gdim');
    this.unl = playUnlock(frame, i, f ? t.f : t.m, t.colour, unlockLines(i), {
      laila: LAILA_SVG, say: (k) => this.gone ? Promise.resolve(false) : this.bus.play(this.bus.gk(k)), hush: () => this.bus.stopAll(),
      spot: (el) => { if (el) this.spotter.spot(el, 'left'); else this.spotter.unspot(); },
    }, () => { this.unl = null; this.router.navigateByUrl(next.startsWith('/') ? next : '/home'); });
  }
  again(): void { this.game?.again(); }
  leave(): void { this.game?.stop(); this.bus.stopAll(); this.router.navigate(['/home']); }
}
