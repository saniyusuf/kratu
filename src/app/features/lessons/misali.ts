import { Component, ElementRef, OnDestroy, OnInit, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { afterPaint } from '../../shared/paint';
import { AudioBus } from '../../core/audio/audio-bus.service';
import { WordsService, Word } from '../../core/clips/words.service';
import { SpeechService } from '../../core/speech/speech.service';
import { LessonFlow, SampleKind } from '../../core/state/flow.service';
import { ImageWarm } from '../../core/clips/warm.service';
import { SessionService } from '../../core/state/session.service';
import { ZoomService } from '../../core/zoom/zoom.service';
import { Door, Ear } from '../../shared/chrome/chrome';
import { LailaButton } from '../../shared/laila/laila-button';
import { AbcKeyboard, KeyMark } from '../../shared/lesson/abc-keyboard';
import { Spotter, flyLetter, flyText, wait, matchWord } from '../../shared/lesson/helpers';

/**
 * Misali · the sample. Laila shows one press-and-say (or spell, read, find) with the boy's or girl's voice, locked like a
 * short film; then "now you": the child repeats the same item with the real microphone. Every lesson opens with its sample once.
 */
@Component({
  selector: 'app-misali',
  imports: [Door, Ear, LailaButton, AbcKeyboard],
  host: { class: 's lesson misali', '[class.movie]': 'movie()', '[class.hearing]': 'hearing()', '[class.read]': "kind === 'karatu'", '[class.karatu]': "kind === 'karatu'", '[class.spell]': "kind === 'rubutu'", '[class.word]': "kind === 'abubuwa' || kind === 'lambobi'", '[class.obj]': "kind === 'abubuwa' || kind === 'lambobi'", '[class.quiz]': "kind === 'nemo' || kind === 'nemonum'", '[class.abc]': "kind === 'haruffa'" },
  template: `
<app-door (pressed)="leave()" /><div class="moviepill"><i></i>Misali</div><app-ear (pressed)="restart()" /><div class="eyebrow">{{ title }}</div>
@if (kind === 'haruffa') {<div class="abcshow" [class.off]="!bigLetter()"><span class="abcbig" style="--c:var(--red)">{{ bigLetter() }}</span><span class="abcex">example</span></div>}
@if (kind === 'nemo' || kind === 'nemonum') {
<div class="qlesson"><div #qgrid class="qgrid" [class.n4]="kind === 'nemo'" [class.n6]="kind === 'nemonum'">
  @for (it of gridItems(); track it.k) {<button type="button" [attr.data-k]="it.k" [class.wrongtap]="wrongTap() === it.k" (click)="tap(it.k)"><img alt="" [src]="it.img">@if (it.k === gridDone()) {<div class="qmask">✓</div>}</button>}
</div><div class="objrow">@for (i of ten; track i) {<span class="oslot active" [class.on]="i === 0"></span>}</div><div class="fb" [class]="'fb ' + fbCls()">{{ fbText() }}</div></div>}
@else {
@if (kind === 'karatu' || kind === 'rubutu' || kind === 'abubuwa' || kind === 'lambobi') {<div #show class="objshow" [class.off]="!picSrc()"><span #pic class="kimg objpic">@if (picSrc()) {<img alt="" [src]="picSrc()">}</span></div>}
@if (kind === 'abubuwa' || kind === 'lambobi') {<div class="objrow">@for (i of five; track i) {<span class="oslot active" [class.on]="i === 0"></span>}</div>}
@if (kind === 'karatu' || kind === 'rubutu') {<div #slots class="wslots">@for (l of slotLetters(); track $index) {<span class="wslot show" [class.on]="slotState()[$index] === 'on'" [class.done]="slotState()[$index] === 'done'" [class.all]="allDone()">{{ slotText()[$index] }}</span>}</div>}
@if (kind === 'rubutu') {<app-abc-keyboard #kb [locked]="kbLocked()" [marks]="keyMarks()" (key)="keyTap($event)" />}
<div class="fb" [class]="'fb ' + fbCls()">{{ fbText() }}</div>
<div class="yesno ynpair objq"><app-laila-btn #lb [label]="kind === 'karatu' ? 'Karanta' : 'Faɗa'" [size]="kind === 'karatu' || kind === 'rubutu' ? 96 : 112" [cue]="cue()" [armed]="armed()" [rec]="rec()" [speak]="speak()" [amp]="rec() ? 0.7 : speech.amp()" (pressed)="lailaPressed()" [yay]="yay()" /></div>}`,
})
export class MisaliScreen implements OnInit, OnDestroy {
  readonly speech = inject(SpeechService);
  private readonly bus = inject(AudioBus);
  private readonly words = inject(WordsService);
  private readonly warm = inject(ImageWarm);
  private readonly session = inject(SessionService);
  private readonly flow = inject(LessonFlow);
  private readonly zoom = inject(ZoomService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly lb = viewChild<LailaButton>('lb');
  private readonly showRef = viewChild<ElementRef<HTMLElement>>('show');
  private readonly kb = viewChild(AbcKeyboard);
  readonly keyMarks = signal<Record<string, KeyMark>>({});
  readonly kbLocked = signal(true);
  /** which slot the child is filling, and how the turn ends, whichever way they answer */
  private tIdx = 0; private tDone: ((ok: boolean) => void) | null = null;
  private readonly picRef = viewChild<ElementRef<HTMLElement>>('pic');
  private readonly slotsRef = viewChild<ElementRef<HTMLElement>>('slots');
  private readonly qgridRef = viewChild<ElementRef<HTMLElement>>('qgrid');

  readonly kind = (this.route.snapshot.paramMap.get('kind') || 'abubuwa') as SampleKind;
  readonly title = ({ karatu: 'Karatu · misali', rubutu: 'Rubutu · misali', abubuwa: 'Abubuwa · misali', lambobi: 'Lambobi · misali', nemo: 'Nemo hoto · misali', nemonum: 'Nemo hoto · Lambobi · misali', haruffa: 'Haruffa · misali' } as Record<string, string>)[this.kind];
  readonly five = [0, 1, 2, 3, 4]; readonly ten = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  readonly movie = signal(false); readonly hearing = signal(false);
  readonly cue = signal(false); readonly armed = signal(false); readonly rec = signal(false); readonly speak = signal(false); readonly yay = signal(false);
  readonly fbCls = signal(''); readonly fbText = signal('');
  readonly picSrc = signal<string | null>(null); readonly bigLetter = signal('');
  readonly slotLetters = signal<string[]>([]); readonly slotText = signal<string[]>([]); readonly slotState = signal<('' | 'on' | 'done')[]>([]); readonly allDone = signal(false);
  readonly gridItems = signal<Word[]>([]); readonly gridDone = signal(''); readonly wrongTap = signal('');
  private stopped = false;
  private phase: 'idle' | 'movie' | 'turn' | 'doing' = 'idle'; private running = false; private hand: HTMLElement | null = null;
  private W = 'CAT'; private AW: Word | null = null; private RW: Word | null = null; private KW: Word | null = null; private gridTarget = '';
  private hearHandle: { stop(): void } | null = null;

  ngOnInit(): void { afterPaint().then(() => this.start()); }
  ngOnDestroy(): void { this.bus.stopAll(); this.hearHandle?.stop(); this.handOff(); }

  // ---- little helpers ----
  private s(): HTMLElement { return this.host.nativeElement; }
  private word(k: string): Word | null { return this.words.find(k) ?? null; }
  private clip(w: Word | null, which: 'ha' | 'en'): string | null { return which === 'ha' ? w?.ha_clip ?? null : w?.en_clip ?? null; }
  private async play(k: string | { src: string }): Promise<boolean> { if (this.stopped) return false; const ok = typeof k === 'string' ? await this.bus.play(k) : await this.bus.playRaw(k.src); return ok && !this.stopped; }
  private async seq(ks: (string | { src: string } | null)[]): Promise<boolean> { for (const k of ks) { if (!k) continue; if (!(await this.play(k))) return false; } return true; }
  private async say(ks: (string | { src: string } | null)[]): Promise<boolean> { this.speak.set(true); const ok = await this.seq(ks); this.speak.set(false); return ok; }
  private fb(cls: string, text: string): void { this.fbCls.set(cls); this.fbText.set(text); }
  private gk(k: string): string { return this.bus.gk(k); }
  private async handTo(el: Element, dx = 0, dy = 0): Promise<void> {
    const sR = this.zoom.rect(this.s()), r = this.zoom.rect(el);
    const x0 = r.left + r.width / 2 - sR.left, y0 = r.top + r.height / 2 - sR.top;
    if (!this.hand) { this.hand = document.createElement('span'); this.hand.className = 'misalihand'; this.hand.textContent = '👆🏾'; this.hand.style.transform = 'translate(' + (x0 + 80) + 'px,' + (y0 + 80) + 'px)'; this.s().appendChild(this.hand); }
    const h = this.hand; await afterPaint(); h.style.transform = 'translate(' + (x0 - 16 + dx) + 'px,' + (y0 - 8 + dy) + 'px)'; await wait(750);
  }
  private handOff(): void { this.hand?.remove(); this.hand = null; }
  private recOn(): void { this.rec.set(true); this.hearing.set(true); }
  private recOff(): void { this.rec.set(false); this.hearing.set(false); }
  private showPic(src?: string | null): void { this.picSrc.set(src || null); }
  /** Right answer: the kalangu sounds and Laila hops (Sani 2026-09-24). */
  private celebrate(): void { this.bus.playRaw('assets/audio/sfx/yay.ogg').catch(() => undefined); this.yay.set(true); setTimeout(() => this.yay.set(false), 760); }
  /** The example's own pictures, decoded before the film starts. */
  private warmExample(): void { this.warm.soon([this.AW?.img, this.RW?.img, this.KW?.img, this.word('goat')?.img, this.word('cat')?.img, ...this.gridItems().map((w) => w.img)]); }
  private reveal(): void { const im = this.picRef()?.nativeElement.querySelector('img'); if (!im?.animate) return; try { const an = im.animate([{ clipPath: 'inset(0 100% 0 0 round 30px)' }, { clipPath: 'inset(0 0 0 0 round 30px)' }], { duration: 900, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }); const fin = () => { try { an.cancel(); } catch { /* ignore */ } }; an.onfinish = fin; setTimeout(fin, 1300); } catch { /* ignore */ } }
  private mkSlots(w: string, blank = false): void { this.slotLetters.set(w.split('')); this.slotText.set(w.split('').map((L) => blank ? '_' : L)); this.slotState.set(w.split('').map(() => '')); this.allDone.set(false); }
  private slotEl(i: number): HTMLElement | null { return (this.slotsRef()?.nativeElement.children[i] as HTMLElement) || null; }
  private setSlot(i: number, st: '' | 'on' | 'done', text?: string): void { this.slotState.update((a) => a.map((x, k) => k === i ? st : x)); if (text !== undefined) this.slotText.update((a) => a.map((x, k) => k === i ? text : x)); }
  private head(): Element { return this.lb()?.head() || this.s(); }

  /** The recorder "listens" while the sample child's voice speaks (or the real child, in their turn), then the heard word flies to its place. */
  private async listen(heard: string, voice: string | null, target: Element | null | false, noKudos = false): Promise<void> {
    this.armed.set(true); await wait(400); this.armed.set(false); this.recOn(); this.fb('wait', '…');
    if (voice) await this.play(voice);
    else {
      // the child's own turn: the real microphone
      // a letter is heard as a letter (the 26 letters and their names), a word as a word; never compared case-sensitively —
      // 'a' against 'A' never matched, so the alphabet example waited out its 8 s instead of hearing the child (Sani 2026-09-22)
      const w = heard.toLowerCase();
      const h = /^[A-Z]$/.test(heard) ? this.speech.hear({ target: heard, until: heard })
        : this.speech.hear({ target: heard, match: (raw) => (matchWord(raw, w) ? heard : null) });   // the lessons' own matcher, p/f and all
      this.hearHandle = h; const r = await h.done; this.hearHandle = null; if (r.raw) heard = r.value ? heard : heard;
    }
    this.fb('heard', '“' + heard + '”'); await wait(350); this.recOff();
    // the written word flying out of Laila is for reading and the alphabet: elsewhere the child says a word and that is
    // the whole answer, so nothing is written for them to read (Sani 2026-09-20)
    if (target !== false && (this.kind === 'karatu' || this.kind === 'haruffa')) await flyText(this.zoom, this.s(), this.head(), target, heard);
    this.fb('good', 'Madalla! ✓'); this.celebrate(); if (!noKudos) await this.play('app_kudos');
  }
  private reset(): void { this.running = false; this.phase = 'idle'; this.movie.set(false); this.cue.set(false); this.handOff(); this.fb('', ''); this.speak.set(false); this.armed.set(false); this.recOff(); this.showPic(null); this.mkSlots(''); this.bigLetter.set(''); this.gridItems.set([]); this.gridDone.set(''); }
  /**
   * The two corners, once in a child's life: the very first example they ever see explains the ear and the door, each
   * spotlit while it is named, and no example or lesson mentions them again (Sani 2026-09-20).
   */
  private async corners(): Promise<void> {
    if (this.session.hintsSaid()) return;
    this.session.hintsMark();
    const spot = new Spotter(this.s(), this.zoom);
    try {
      for (const [key, sel, side] of [['s_ear', '.helpdome', 'left'], ['s_back', '.backdoor', 'right']] as const) {
        const ok = await this.bus.play(this.gk(key), { onStart: () => spot.spot(this.s().querySelector(sel), side) });
        spot.unspot();
        if (!ok || this.stopped) return;
      }
    } finally { spot.unspot(); }
  }
  private async finish(): Promise<void> { await this.corners(); await this.say([this.gk('sx_now')]); this.running = false; this.yourTurn(); }
  private sampleWord(k: 'rubutu' | 'karatu'): string { const p = this.flow.sampleWord[k]; return p && this.word(p.toLowerCase()) ? p.toUpperCase() : 'CAT'; }
  private pickAbubuwa(): Word { const list = this.words.list(this.session.category() || ''); const w = list[0]; if (w && this.bus.has('sx_w_' + String(w.en).toLowerCase() + '_m')) return w; return this.word('goat')!; }
  private numFive(): Word { return this.words.list('lambobi_symbols').find((x) => x.k === 'n5')!; }
  private mkGrid(): void {
    const num = this.kind === 'nemonum'; this.gridTarget = num ? 'n5' : 'goat';
    const pool = num ? this.words.list('lambobi_symbols').slice(0, 10) : this.words.list('animals').slice(0, 8);
    const tgt = num ? pool.find((x) => x.k === 'n5')! : this.word('goat')!;
    const items = [tgt].concat(pool.filter((x) => x.k !== this.gridTarget).slice(0, num ? 5 : 3)); items.sort(() => Math.random() - .5);
    this.gridItems.set(items); this.gridDone.set('');
  }
  private gridTargetEl(): Element | null { return this.qgridRef()?.nativeElement.querySelector('[data-k="' + this.gridTarget + '"]') || null; }

  private yourTurn(): void {
    this.movie.set(false); this.handOff(); this.fb('', ''); this.phase = 'turn';
    if (this.kind === 'karatu') { this.mkSlots(this.W); this.showPic(null); }
    else if (this.kind === 'rubutu') { const w = this.RW || this.word(this.W.toLowerCase()); this.showPic(w?.img); this.mkSlots(this.W, true); }
    else if (this.kind === 'abubuwa') this.showPic((this.AW || this.word('goat'))?.img);
    else if (this.kind === 'lambobi') this.showPic(this.words.list('lambobi_palms')[4]?.img);
    else if (this.kind === 'haruffa') this.bigLetter.set('A');
    else this.mkGrid();
    if (this.kind === 'rubutu') { this.tIdx = 0; this.kbLocked.set(false); this.cue.set(true); this.play('app_spell_ord_1'); }
    else if (this.kind === 'nemonum') this.seq([{ src: this.clip(this.numFive(), 'en')! }, 's_qn_tap']);
    else if (this.kind !== 'nemo') { this.cue.set(true); this.play('app_w_tap_white'); }
    else this.seq([{ src: this.clip(this.word('goat'), 'en')! }, 'app_quiz_tap']);
  }
  private done(): void { this.phase = 'idle'; this.running = false; this.cue.set(false); this.next(); }
  private next(): void { const next = this.route.snapshot.queryParamMap.get('next') || '/home'; setTimeout(() => this.router.navigateByUrl(next), 500); }

  async lailaPressed(): Promise<void> { if (this.phase === 'turn') this.doTurn(); else if (!this.running) this.start(); }
  private async doTurn(): Promise<void> {
    if (this.phase !== 'turn') return; this.phase = 'doing'; this.bus.stopAll(); this.cue.set(false);
    if (this.kind === 'karatu') { const kw = this.KW || this.word('cat')!; await this.listen(String(kw.en).toLowerCase(), null, this.showRef()?.nativeElement || null, true); this.allDone.set(true); this.showPic(kw.img); this.reveal(); await this.play(this.gk('app_read_good')); this.done(); }
    else if (this.kind === 'abubuwa') { await this.listen(String((this.AW || this.word('goat'))!.en).toLowerCase(), null, this.picRef()?.nativeElement || null); this.done(); }
    else if (this.kind === 'lambobi') { await this.listen('five', null, false); this.done(); }
    else if (this.kind === 'haruffa') { await this.listen('A', null, this.s().querySelector('.abcbig')); this.session.markExample('haruffa', 'A'); this.done(); }
    else if (this.kind === 'rubutu') {
      /* Pressing Laila only opens the microphone. The board has been live since the turn began, so a child may tap
         some letters and say others; whichever they use, one turn is running and Laila joins it (Sani 2026-09-21). */
      if (!this.tDone) this.startSpell();
      this.openMic();
    }
  }
  /** A key pressed during the child's turn: the right next letter fills its slot, a wrong one is just refused. */
  keyTap(L: string): void {
    if (this.kind !== 'rubutu' || this.kbLocked()) return;
    if (this.phase === 'turn') { this.phase = 'doing'; this.cue.set(false); this.bus.stopAll(); this.startSpell(); }
    if (!this.tDone) return;
    if (L !== this.W.charAt(this.tIdx)) { this.keyMarks.set({ [L]: 'bad' }); setTimeout(() => this.keyMarks.set({}), 450); return; }
    this.putLetter(L);
  }
  /** Laila pressed: the microphone opens on the turn that is already running. Never opens a second one. */
  private openMic(): void {
    if (this.hearHandle || !this.tDone) return;
    this.recOn();
    const h = this.speech.hear({ multi: true, word: this.W }); this.hearHandle = h;
    h.done.then((r) => {
      this.hearHandle = null; this.recOff(); if (!this.tDone) return;
      const ls = (Array.isArray(r.value) ? r.value : []).map((x) => String(x).toUpperCase());
      let put = 0;
      for (const L of ls) { if (this.tIdx >= this.W.length) break; if (L !== this.W.charAt(this.tIdx)) break; this.putLetter(L, false); put++; }
      if (this.tIdx >= this.W.length) { const d = this.tDone; this.tDone = null; d?.(true); return; }
      if (put) this.askNext();            // one prompt after the whole burst, not one per letter
      else { const d = this.tDone; this.tDone = null; d?.(false); }
    }).catch(() => undefined);
  }
  /** A tap started the turn: the promise the word is finished on, with no microphone until Laila is pressed. */
  private startSpell(): void {
    const w = this.RW || this.word('cat')!;
    new Promise<boolean>((res) => { this.tDone = res; }).then(async (ok) => {
      this.kbLocked.set(true); this.recOff(); this.hearHandle?.stop(); this.hearHandle = null;
      if (ok) { this.allDone.set(true); this.fb('good', 'Madalla! \u2713'); await this.seq([{ src: this.clip(w, 'en')! }, 'app_kudos']); this.done(); }
      else { this.fb('bad', 'Sake gwadawa'); this.phase = 'turn'; this.cue.set(true); this.kbLocked.set(false); }
    });
  }
  private askNext(): void { this.play('app_spell_ord_' + Math.min(9, this.tIdx + 1)).catch(() => undefined); }
  private putLetter(L: string, prompt = true): void {
    const i = this.tIdx++; this.setSlot(i, 'on');
    const el = this.slotEl(i), key = this.kb()?.keyEl(L) || null;
    this.keyMarks.set({ [L]: 'good' }); setTimeout(() => this.keyMarks.set({}), 400);
    if (el) void flyLetter(this.zoom, this.s(), key || this.head(), el, L);
    this.setSlot(i, 'done', L);
    if (this.tIdx >= this.W.length) { const d = this.tDone; this.tDone = null; d?.(true); return; }
    // ask for the next one in the lesson's own words, the same recording it will use tomorrow (Sani 2026-09-20)
    if (prompt) this.askNext();
  }
  tap(k: string): void {
    if (this.phase !== 'turn') return;
    if (k === this.gridTarget) { this.phase = 'doing'; this.gridDone.set(k); this.fb('good', 'Madalla! ✓'); this.play('app_kudos').then(() => this.done()); }
    else { this.wrongTap.set(''); setTimeout(() => this.wrongTap.set(k), 0); this.fb('bad', 'A’a'); this.play('app_quiz_wrong'); }
  }

  // ---- the films ----
  private async start(): Promise<void> {
    if (this.running) return; this.bus.stopAll(); this.reset(); this.running = true; this.movie.set(true); this.phase = 'movie';
    this.warmExample();
    const runs: Record<string, () => Promise<void>> = { karatu: () => this.runKaratu(), rubutu: () => this.runRubutu(), abubuwa: () => this.runAbubuwa(), lambobi: () => this.runLambobi(), nemo: () => this.runNemo(false), nemonum: () => this.runNemo(true), haruffa: () => this.runHaruffa() };
    await runs[this.kind]?.();
  }
  restart(): void { this.bus.stopAll(); this.hearHandle?.stop(); this.reset(); this.start(); }
  leave(): void { this.bus.stopAll(); this.hearHandle?.stop(); this.router.navigate(['/home']); }
  private async runKaratu(): Promise<void> {
    const W = this.sampleWord('karatu'); this.W = W; this.KW = this.word(W.toLowerCase()); this.mkSlots(W);
    if (!(await this.say([this.gk('sx_intro'), 'sx_laila']))) return;
    this.speak.set(true); if (!(await this.play('app_read_intro'))) return;
    if (!(await this.play(this.gk('sx_k_letters')))) return;   // "I will read the letters, one by one. Listen." — who reads is said before the letters (Sani 15 Sep)
    for (let i = 0; i < W.length; i++) { this.slotState.set(W.split('').map((_, k) => k === i ? 'on' : (k < i ? 'done' : ''))); if (!(await this.play('app_en_' + W.charAt(i)))) return; await wait(650); }   // a clear pause after each letter, so they are heard one by one, not in one go
    this.speak.set(false); this.slotState.set(W.split('').map(() => 'done'));
    if (!(await this.play('app_read_word'))) return;
    if (!(await this.sayDo('sx_do_read'))) return;
    await this.listen(W.toLowerCase(), this.gk('sx_w_' + W.toLowerCase()), this.showRef()?.nativeElement || null, true);
    this.handOff(); this.allDone.set(true); this.showPic(this.KW?.img); this.reveal(); await this.play(this.gk('app_read_good'));
    this.session.markExample('karatu', this.W); await this.finish();
  }
  private async runRubutu(): Promise<void> {
    const W = this.sampleWord('rubutu'); this.W = W; const w = this.word(W.toLowerCase())!; this.RW = w;
    if (!(await this.say([this.gk('sx_intro'), 'sx_laila']))) return; this.showPic(w.img);
    if (!(await this.say(['app_wannan', { src: this.clip(w, 'ha')! }, 's_o_inen', { src: this.clip(w, 'en')! }]))) return;
    this.mkSlots(W, true);
    if (!(await this.sayDo('sx_do_spell'))) return;
    // Say the plan, then point at each way as it is named: Laila for the voice, the board for the keys, so "two ways"
    // means two things the child can see rather than two words (Sani 2026-09-20).
    if (!(await this.play('sx_r_plan'))) return;
    const spot = new Spotter(this.s(), this.zoom);
    try {
      if (!(await this.bus.play('sx_r_w1', { onStart: () => spot.spot(this.head(), 'above') }))) return;
      spot.unspot();
      if (!(await this.bus.play('sx_r_w2', { onStart: () => spot.spot(this.s().querySelector('.abcgrid'), 'above') }))) return;
    } finally { spot.unspot(); }
    await wait(200);

    const last = W.length - 1;
    for (let i = 0; i < W.length; i++) {
      const L = W.charAt(i), byBoard = i === last && W.length > 1;
      // name the method for this letter before it happens, so the child knows which one they are watching
      if (!(await this.play(i === 0 ? 'sx_r_v1' : byBoard ? 'sx_r_kb' : 'sx_r_v2'))) return;
      this.setSlot(i, 'on');   // no "heard" chip here: Laila is speaking, not the child (Sani 2026-09-20)
      if (byBoard) {
        const key = this.kb()?.keyEl(L) || null;
        if (key) { await this.handTo(key, 0, -6); this.keyMarks.set({ [L]: 'hot' }); await wait(280); }
        const el = this.slotEl(i); if (el) await flyLetter(this.zoom, this.s(), key || this.head(), el, L);
        this.keyMarks.set({ [L]: 'good' });
      } else {
        this.recOn(); await this.handTo(this.head(), 0, 10);
        if (!(await this.play(this.gk('sx_w_' + L)))) return;
        const el = this.slotEl(i); if (el) await flyLetter(this.zoom, this.s(), this.head(), el, L);
        this.recOff();
      }
      this.setSlot(i, 'done', L); await wait(250);
    }
    this.handOff(); this.keyMarks.set({}); this.allDone.set(true); this.fb('good', 'Madalla! \u2713');
    await this.say([{ src: this.clip(w, 'en')! }]);
    this.session.markExample('rubutu', this.W); await this.finish();
  }
  private async runAbubuwa(): Promise<void> {
    const w = this.pickAbubuwa(); this.AW = w; const E = String(w.en).toLowerCase();
    if (!(await this.say([this.gk('sx_intro'), 'sx_laila']))) return; this.showPic(w.img);
    if (!(await this.say(['app_wannan', { src: this.clip(w, 'ha')! }, 's_o_inen', { src: this.clip(w, 'en')! }]))) return;
    if (!(await this.sayDo('sx_do_say'))) return;
    await this.listen(E, this.gk('sx_w_' + E), this.picRef()?.nativeElement || null); this.session.markExample('abubuwa', w.k); this.handOff(); await this.finish();
  }
  private async runLambobi(): Promise<void> {
    const w = this.words.list('lambobi_palms')[4];
    if (!(await this.say([this.gk('sx_intro'), 'sx_laila']))) return; this.showPic(w.img);
    if (!(await this.say(['app_wannan', { src: this.clip(w, 'ha')! }, 's_o_inen', { src: this.clip(w, 'en')! }]))) return;
    if (!(await this.sayDo('sx_do_say'))) return;
    await this.listen('five', this.gk('sx_w_five'), false); this.session.markExample('lambobi', w.k); this.handOff(); await this.finish();
  }
  private async runNemo(num: boolean): Promise<void> {
    this.mkGrid(); await afterPaint(); const tgt = num ? this.numFive() : this.word('goat')!;
    if (!(await this.say([this.gk('sx_intro'), 'sx_laila']))) return;
    // just the word: what to do with it is the next line's job, and saying it twice made the example drag (Sani 20 Sep)
    if (!(await this.say([{ src: this.clip(tgt, 'en')! }]))) return;
    if (!(await this.sayDo(num ? 'sx_do_findnum' : 'sx_do_find', this.gridTargetEl()))) return;
    const gb = this.gridTargetEl(); if (gb) await this.handTo(gb); this.gridDone.set(this.gridTarget); this.fb('good', 'Madalla! ✓'); await this.play('app_kudos');
    this.session.markExample(num ? 'nemonum' : 'nemo', tgt.k); this.handOff(); await this.finish();
  }
  /**
   * The one instruction every example gives: why, then both steps, in a single line. The hand lands on Laila while
   * she names her, taken from the line's own position rather than a stopwatch, so a re-recording still lands right
   * (Sani 2026-09-18).
   */
  private async sayDo(key: string, target?: Element | null): Promise<boolean> {
    let pointed = false;
    const el = target === undefined ? this.head() : target;
    const ok = await this.bus.play(this.gk(key), {
      onProgress: (p) => { if (!pointed && p >= 0.46 && el) { pointed = true; if (this.running) void this.handTo(el, 0, 10); } },
    });
    return ok && !this.stopped;
  }
  private async runHaruffa(): Promise<void> {
    if (!(await this.say([this.gk('sx_intro'), 'sx_laila']))) return; this.bigLetter.set('A');
    if (!(await this.say(['app_wannan', 'app_en_A']))) return;
    // the same instruction every other example gives; the only A they hear after it is the child's own (Sani 18 Sep)
    if (!(await this.sayDo('sx_do_say'))) return;
    await this.listen('A', this.gk('sx_w_A'), this.s().querySelector('.abcbig')); this.session.markExample('haruffa', 'A'); this.handOff(); await this.finish();
  }
}
