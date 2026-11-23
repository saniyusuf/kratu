import { Component, ElementRef, OnDestroy, OnInit, effect, inject, signal, viewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { afterPaint } from '../../shared/paint';
import { AudioBus } from '../../core/audio/audio-bus.service';
import { IdentityService, MatchResult, Person } from '../../core/identity/identity.service';
import { extractName, nameClip, snapName, stillFrame } from '../../core/identity/name-clip';
import { SessionService } from '../../core/state/session.service';
import { Door, Ear } from '../../shared/chrome/chrome';
import { Laila } from '../../shared/laila/laila';
import { DOOR_SVG } from '../../shared/svg';
import { LANG } from '../../core/lang/lang';
import { bi, t } from '../../core/lang/t';
import { FAMILY } from '../../core/edition';
import { FamilyService } from '../../core/family/family.service';

type Pause = 'alone' | 'noface' | 'small' | 'blurry' | 'dark' | 'turned';
/** How long the capture will wait for the child to be alone again before it gives up and offers a fresh try. */
const CROWD_GIVE_UP = 25000;
const PICT: Record<string, [string, string]> = { alone: ['👥', '🧒'], noface: ['🙈', '👀'], small: ['🐜', '🔍'], blurry: ['💨', '✋'], dark: ['🌑', '💡'], turned: ['↩️', '👀'] };
/** The family build (Sani 2026-11-22): the whole step at most 10 seconds for young children. */
const MAXMS = FAMILY ? 8000 : 10000, HARDMS = FAMILY ? 10000 : 20000;
/** The family build: when to ask for the name, and how much of s_p3 is played (its first sentence ends at 2.95 s). */
const ASK_NAME_MS = 4000, ASK_NAME_CLIP_MS = 3150;
/** The online recogniser may help but never holds a child up: not listening within this, the ring starts without it. */
const SR_START_WAIT = 2500;
/** iPad and iPhone: every browser there is WebKit, whose speech recogniser is Siri. It has no Hausa, and it takes the
 *  microphone away from the recording, so there the recording alone carries the name (Sani 2026-09-22). iPadOS reports
 *  itself as a Mac, hence the touch check. */
/**
 * The browser's recogniser sends the recording to its maker's servers (Chrome: Google). Never (Sani 2026-11-09): nothing about
 * a child goes over the air. The name is not written down; Laila says only "Barka da zuwa" to a new child, and the child's
 * own recording, kept with their record on the tablet, is what carries their name.
 */
const NAME_ONLINE = false;
/** The family build (Sani 2026-11-22): a voice print only from real speech, at least 0.3 s above a quiet room. */
function spoke(pcm: Float32Array): boolean {
  let loud = 0; for (let i = 0; i + 320 <= pcm.length; i += 320) { let e = 0; for (let j = i; j < i + 320; j++) e += pcm[j] * pcm[j]; if (Math.sqrt(e / 320) > 0.015) loud++; }
  return loud >= 15;   // 0.3 s: a child may say just their name ("Musa"), not "Sunana Musa"
}
/** The family build shows no emoji (Sani 2026-11-22): the hint's leading picture is dropped there. */
const E = (s: string): string => (FAMILY ? '' : s);
const APPLE_TOUCH = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

/**
 * Screen 3 · Bari mu ga wa kake. The tablet looks and listens at once: ten seconds of one face in the frame while the child
 * says "Sunana …". A returning child is greeted by name; a new one is enrolled on the spot as vectors, never a photo.
 * Two faces in the frame: everything gathered is dropped, Laila says so, and the child presses her to try again alone.
 */
@Component({
  selector: 'app-face',
  imports: [Ear, Laila, Door],
  host: { class: 's facecap', '[attr.data-gender]': 'session.g()' },   // the design hides the other gender's example through this attribute
  template: `
@if (FAMILY) { <app-door (pressed)="famBack()" /> }
<app-ear (pressed)="intro()" />
<div class="pr">{{ session.g() === 'f' ? t('Bari mu ga wa kike') : t('Bari mu ga wa kake') }}<span class="sm">{{ session.g() === 'f' ? t('Bidiyo kina faɗin sunanki') : t('Bidiyo kana faɗin sunanka') }} · a video of you saying your name</span></div>
<div class="examples" [hidden]="capturing()">
  <div class="exlabel">{{ bi('Misali', 'the example') }}</div>
  <div class="gtoggle"><button [class.on]="exG() === 'm'" (click)="exG.set('m')">{{ t('Namiji') }}</button><button [class.on]="exG() === 'f'" (click)="exG.set('f')">{{ t('Mace') }}</button></div>
  <div class="exrow">
    @for (g of ['m','f']; track g) {
    <button class="exvid" [class.m]="g === 'm'" [class.f]="g === 'f'" [class.talking]="talking() === g" (click)="example(g)">
      <span class="exframe"><video #ex class="exphoto exvideo" playsinline preload="auto" disablepictureinpicture [poster]="'assets/example-' + g + '.webp'"><source [src]="'assets/example-' + g + '.mp4'" type="video/mp4"><source [src]="'assets/example-' + g + '.webm'" type="video/webm"></video><i class="vfc"></i><span class="vfbar"><span class="exrec">● REC</span><span class="vftime">00:02</span></span></span>
      <span class="exsub">{{ g === 'm' ? t('“Sunana Musa”') : t('“Sunana Aisha”') }}</span><span class="exwave"><i></i><i></i><i></i><i></i><i></i></span><span class="exhand">👆🏾</span>
    </button>}
  </div>
</div>
<div class="facestage">
  <button class="startwrap" [class.cue]="cue()" [hidden]="capturing()" [attr.aria-label]="t('Danna Laila don farawa')" (click)="start()">
    <span class="startring"></span><app-laila [size]="110" cls="start-lm" /><span class="start-hand">👆🏾</span>
    <span class="starthint">{{ t('Danna kan Laila don farawa') }}</span>
  </button>
</div>
@if (capturing()) {
<div #modal class="capmodal"><div class="capmodal-inner facecap" [attr.data-gender]="session.g()">@if (FAMILY) { <app-door (pressed)="famBack()" /> }
  <div class="capmodal-title">{{ bi('Bari mu ga wa kake', 'let’s see who you are') }}</div>
  <div class="camview">
    <div class="camwrap" [class.armed]="armed()" [class.paused]="!!paused()" [class.glow]="glow()" [class.done]="!!still()" [style.--p]="progress() + '%'">
      <div class="cam" [class.matched]="!!matchFx()">@if (matchFx(); as f) {<span class="matchfx" [style.left.%]="f.l + f.w / 2" [style.top.%]="f.t + f.h / 2"><i></i><i></i><i></i></span>}<i class="vfc"></i><span class="vfbar"><span class="rec">● REC</span><span class="vftime cap-time">{{ capTime() }}</span></span>
        <video #live class="feed live" autoplay [muted]="true" [volume]="0" playsinline [hidden]="!liveOn() || !!still()"></video>
        <div class="pict" [hidden]="!pict()"><div class="pict-big">{{ pictA() }}</div><div class="pict-arrow">→</div><div class="pict-big ok">{{ pictB() }}</div></div>
        <div class="faceguide" [class.ok]="faceOK() && !paused() && sizeOK()" [class.busy]="!!paused()" [class.follow]="!!track()" [style.left.%]="track() ? track()!.l + track()!.w / 2 : null" [style.top.%]="track() ? track()!.t + track()!.h / 2 : null" [style.width.%]="track()?.w ?? null" [style.height.%]="track()?.h ?? null" [hidden]="!liveOn() || !!still()" aria-hidden="true"></div>
        @if (nudge(); as n) {<div [class]="'facenudge ' + n" [hidden]="!liveOn() || !!still()" aria-hidden="true">{{ HAND[n] }}</div>}
        <div class="alone" [hidden]="!aloneText()" [class.soft]="aloneSoft()">{{ aloneText() }}</div>
        <img class="feed" alt="" [src]="still() || 'assets/gender-girl.webp'" [hidden]="liveOn() && !still()"><div class="ov"></div></div>
      <div class="vfprog"><i></i></div>
      <div class="startwrap capnext" [class.cue]="gate() !== null" [hidden]="gate() === null">
        <button type="button" class="gatepick gatelaila" [class.lit]="gateFocus() === 'laila'" [class.dim]="gateFocus() === 'door'" [attr.aria-label]="t('Danna Laila · sake gwadawa')" (click)="gatePress()"><app-laila [size]="150" cls="start-lm" /><span class="start-hand" [hidden]="gateFocus() === 'door'">👆🏾</span><div class="hint">{{ gateHint() }}<small>{{ t('click Laila to try again') }}</small></div></button>
        <button type="button" class="gatepick gatedoor" [class.lit]="gateFocus() === 'door'" [class.dim]="gateFocus() === 'laila'" [attr.aria-label]="t('Koma farko')" (click)="startOver($event)"><span style="display:contents" [innerHTML]="door"></span><span class="start-hand" [hidden]="gateFocus() !== 'door'">👆🏾</span><div class="hint">{{ t('Koma farko') }}<small>click the door to start again</small></div></button></div>
    </div>
    <span class="cam-hand" [style.display]="glow() ? 'block' : 'none'">👆🏾</span>
    <div class="capmic" [hidden]="!armed()">{{ session.g() === 'f' ? t('Ki ce') : t('Ka ce') }}: @if (FAMILY) {{{ t('“Sunana …”') }}} @else {{{ bi('“Sunana…”', 'say your name') }}}</div>
    <div class="heard" [hidden]="!heardText()" [class.interim]="interim()">{{ heardText() }}</div>
    <div class="camnote" [hidden]="!note()">{{ note() }}</div>
    <div class="capdone" [hidden]="!doneText()"><span class="donetext">{{ doneText() }}</span></div>
    <div class="capmiss" [hidden]="!missText()">{{ missText() }}</div>
    <button class="again" type="button" [hidden]="!againOn()" (click)="again()">{{ E('↺ ') }}{{ bi('Sake gwada', 'try again') }}</button>
  </div>

  <canvas #confetti class="confetti" [hidden]="!confettiOn()"></canvas>
</div></div>}`,
})
export class FaceScreen implements OnInit, OnDestroy {
  readonly session = inject(SessionService);
  private readonly bus = inject(AudioBus);
  private readonly identity = inject(IdentityService);
  private readonly router = inject(Router);
  private readonly fam = inject(FamilyService);
  private readonly liveRef = viewChild<ElementRef<HTMLVideoElement>>('live');
  private readonly exRefs = viewChild<ElementRef<HTMLVideoElement>>('ex');
  private readonly modalRef = viewChild<ElementRef<HTMLElement>>('modal');
  private readonly hostEl = inject(ElementRef) as ElementRef<HTMLElement>;
  private readonly confettiRef = viewChild<ElementRef<HTMLCanvasElement>>('confetti');

  readonly t = t;
  readonly FAMILY = FAMILY;
  /** The family build's back (Sani 2026-11-23: the app's own door): back to boy or girl, the camera closed. */
  famBack(): void { this.pending = null; this.bus.stopAll(); this.teardown(); this.dropModal(); this.capturing.set(false); this.router.navigate(['/gender']); }
  readonly E = E;
  readonly bi = bi;
  readonly exG = signal<'m' | 'f'>('m');
  readonly door = inject(DomSanitizer).bypassSecurityTrustHtml(DOOR_SVG);
  readonly talking = signal<'' | 'm' | 'f'>('');
  readonly cue = signal(false);
  readonly capturing = signal(false);
  readonly armed = signal(false); readonly glow = signal(false); readonly liveOn = signal(false);
  readonly paused = signal<Pause | null>(null);
  readonly progress = signal(0); readonly capTime = signal('00:00');
  readonly pict = signal<string | null>(null); readonly pictA = signal(''); readonly pictB = signal('');
  readonly aloneText = signal(''); readonly aloneSoft = signal(false);
  readonly heardText = signal(''); readonly interim = signal(false);
  readonly note = signal(''); readonly doneText = signal(''); readonly missText = signal('');
  readonly againOn = signal(false); readonly still = signal<string | null>(null);
  readonly gate = signal<'retry' | null>(null); readonly gateHint = signal(''); readonly gateFocus = signal<'laila' | 'door' | null>(null);
  readonly confettiOn = signal(false);

  private stream: MediaStream | null = null; private rec: MediaRecorder | null = null; private chunks: Blob[] = []; private recBlob: Blob | null = null;
  private recHeld = false; private micHolds = 0; private recT0 = 0; private nameAt = -1; private nameClipP: Promise<{ url: string } | null> | null = null;
  private sr: any = null; private srWait: ReturnType<typeof setTimeout> | null = null; private transcript = ''; private recLive = false; private srLive = false; private speechCb: ((t: string, fin: boolean) => void) | null = null;
  private faceVecs: Float32Array[] = []; private bestSc = 0; private bestStill: string | null = null; private lastMs = 0;
  /** One face, right now: the guide follows it. */
  readonly faceOK = signal(true);
  /** Where the face is in the camera picture, as a share of it (used to work out which way to point). */
  readonly track = signal<{ l: number; t: number; w: number; h: number } | null>(null);
  readonly nudge = signal<'' | 'left' | 'right' | 'up' | 'down'>('');
  /** The app's own pointing hand, turned the way the child should move. */
  readonly HAND: Record<string, string> = { left: '👈🏾', right: '👉🏾', up: '👆🏾', down: '👇🏾' };
  /** The face fills a sensible part of the picture: the ring only turns green when it does. */
  readonly sizeOK = signal(true);
  private crowdSince = 0;
  private speaking = false; private lastWarn: Record<string, number> = {}; private cnt = { many: 0, none: 0, one: 0 }; private badSince = 0; private badKind: string | null = null;
  private capEnded = false; private lastManyAt = 0; private iv: ReturnType<typeof setInterval> | null = null; private stopT: ReturnType<typeof setTimeout> | null = null;
  private ended = false; private confT: number | null = null;

  constructor() {
    // the capture dialog is the old app's body-level overlay: it sits outside the zoomed frame, sized in viewport units
    effect(() => { const m = this.modalRef()?.nativeElement; if (m && m.parentElement !== document.body) document.body.appendChild(m); document.body.classList.toggle('capmodal-open', this.capturing()); });
  }
  /**
   * The family build (Sani 2026-11-22: "searching and enrolling" at once, quick for young children): once any child is
   * enrolled, the camera opens straight away, no intro and no press, and a known face goes in before a word is said.
   * The very first child still gets the intro (the example film) to learn what to do.
   */
  ngOnInit(): void { afterPaint().then(async () => { if (FAMILY && (await this.anyone())) { this.start(); return; } this.intro(); }); }
  private async anyone(): Promise<boolean> { try { const K = this.identity.api; if (!K || !this.identity.ready()) return false; await K.store.load(); return K.store.all().length > 0; } catch { return false; } }
  ngOnDestroy(): void { this.pending = null; this.teardown(); this.dropModal(); }
  /** The dialog lives at body level (moved there by the effect); Angular's own removal misses it, so it is removed here. */
  private dropModal(): void { document.querySelectorAll('.capmodal').forEach((m) => m.remove()); document.body.classList.remove('capmodal-open'); }

  /** On entry (and on the ear): the video is explained (s_p1) · "here is Musa / Aisha saying the name" · that gender's film · "now you: press Laila and say your name" · Laila cued (Sani 14 Sep 2026). */
  async intro(): Promise<void> {
    this.bus.stopAll(); this.cue.set(false); const g = this.session.g();
    if (!(await this.bus.play(this.bus.gk('s_p1')))) return;     // 1. we will take a video of you saying your name; e.g. if your name is Musa, say "Sunana Musa" (s_p1, not s_face: that one ends with a second "press Laila")
    if (!(await this.bus.play(this.bus.gk('s_p2')))) return;     // 2. here is the boy Musa / the girl Aisha saying the name
    if ((await this.playFilm(g)) === 'cut') return;
    if (!(await this.bus.play(this.bus.gk('s_p3')))) return;
    this.cue.set(true);
  }
  /** The film of the child's own gender (the other one is hidden by the design's CSS). */
  private exVideo(g: string): HTMLVideoElement | null { return this.hostEl.nativeElement.querySelector('.exvid.' + g + ' video'); }
  private exSeq = 0;
  /** A child enrolled but not yet started: written only when they press Laila to begin. */
  private pending: (Partial<Person> & { name: string }) | null = null;
  /**
   * The one way the example film is ever played, by the entry sequence and by a press alike: it has sound, so it goes
   * through the engine (Laila stops for it, a later clip stops it), it always starts from the beginning, and however it
   * finishes — played out, cut off, or refused — the still frame it showed before comes back. It must never be left
   * black (Sani 2026-09-17).
   */
  private async playFilm(g: 'm' | 'f'): Promise<'ended' | 'cut' | 'blocked'> {
    const v = this.exVideo(g); if (!v) return 'blocked';
    const my = ++this.exSeq;
    this.talking.set(g);
    if (LANG.muteFilms) v.muted = true;   // the child in the film speaks Hausa: another language's build shows the film silent
    const how = await this.bus.engine.claim(v);
    if (my !== this.exSeq) return how;   // a newer press owns the film now, and will reset it itself
    this.talking.set('');
    try { v.load(); } catch { /* ignore */ }   // load() puts the poster back
    return how;
  }
  /** A press on the film: play it again from the start. */
  async example(g: string): Promise<void> { if ((await this.playFilm(g as 'm' | 'f')) === 'ended') this.cue.set(true); }

  /** Press Laila: the camera opens, the ring starts, the child says "Sunana …". */
  async start(): Promise<void> {
    if (FAMILY && this.capturing()) return;   // the camera opens by itself in the family build: a press of Laila at the same moment must not open it twice
    this.bus.stopAll(); this.cue.set(false); this.reset(); this.capturing.set(true);
    await afterPaint();
    const md = navigator.mediaDevices;
    if (!md?.getUserMedia) { if (FAMILY) { this.leaveForPerm(); return; } this.note.set('No camera in this viewer — showing a photo instead'); this.runRing(); return; }
    let started = false; const begin = () => { if (started) return; started = true; this.runRing(); };
    const guard = setTimeout(() => { if (!started && !FAMILY) { this.note.set('Waiting for camera permission… showing a photo for now'); begin(); } }, 2500);
    try {
      const s = await md.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } }, audio: true });
      clearTimeout(guard); this.stream = s; const live = this.liveRef()?.nativeElement;
      if (live) { live.srcObject = s; live.muted = true; live.volume = 0; this.liveOn.set(true); }
      if (live && FAMILY) { const AR = () => { const C = live.closest('.cam') as HTMLElement | null; if (C && live.videoWidth) C.style.setProperty('--ar', String(live.videoWidth / live.videoHeight)); }; live.addEventListener('loadedmetadata', AR); live.addEventListener('resize', AR); }   // the family camera box takes the picture's own shape, and follows a turn of the phone
      this.note.set('');
      this.bus.micReady().then(() => { if (this.stream === s) this.startRec(s); });
      const go = () => { live?.play().catch(() => undefined); begin(); };
      if (live) live.addEventListener('loadedmetadata', () => console.log('[kratu] camera', live.videoWidth + 'x' + live.videoHeight, 'box', Math.round(live.getBoundingClientRect().width) + 'x' + Math.round(live.getBoundingClientRect().height)), { once: true });
      if (live && live.readyState >= 2) go(); else { live?.addEventListener('loadedmetadata', go, { once: true }); setTimeout(go, 1200); }
    } catch (err: any) { clearTimeout(guard); if (FAMILY) { console.warn('[kratu] camera refused', err?.name, err?.message); this.leaveForPerm(); return; } this.note.set('Camera blocked (' + (err?.name || 'error') + ') — showing a photo instead'); begin(); }
  }

  /** The family build (Sani 2026-11-22): no photo fallback and no cards; the permission screen asks again. */
  private leaveForPerm(): void { this.capturing.set(false); this.teardown(); this.dropModal(); this.fam.toPerm(); }
  private reset(): void {
    this.faceVecs = []; this.recBlob = null; this.bestSc = 0; this.bestStill = null; this.transcript = ''; this.still.set(null);
    this.heardText.set(''); this.note.set(''); this.doneText.set(''); this.missText.set(''); this.againOn.set(false); this.gate.set(null); this.confettiOn.set(false);
    this.progress.set(0); this.capTime.set('00:00'); this.aloneText.set(''); this.pict.set(null); this.liveOn.set(false);
  }
  private holdMic(on: boolean): void { this.micHolds = Math.max(0, this.micHolds + (on ? 1 : -1)); this.bus.setMic(this.micHolds > 0); }
  private startRec(s: MediaStream): void {
    try {
      this.chunks = []; const rec = new MediaRecorder(s); this.rec = rec;
      rec.ondataavailable = (ev) => { if (ev.data?.size) this.chunks.push(ev.data); };
      rec.onstop = () => { try { const blob = new Blob(this.chunks, { type: rec.mimeType || 'video/webm' }); this.recBlob = blob; this.nameClipP = nameClip(blob, this.nameAt).catch(() => null); } catch { /* ignore */ } };
      rec.onstart = () => { this.recLive = true; this.recT0 = Date.now(); this.armCheck(); };
      rec.start(250); this.holdMic(true); this.recHeld = true; this.recT0 = Date.now(); this.nameAt = -1; this.nameClipP = null;
    } catch { this.recLive = true; this.armCheck(); }
  }
  private stopCam(): void {
    if (this.rec && this.rec.state !== 'inactive') { try { this.rec.stop(); } catch { /* ignore */ } if (this.recHeld) { this.holdMic(false); this.recHeld = false; } }
    this.rec = null; const live = this.liveRef()?.nativeElement; try { live?.pause(); } catch { /* ignore */ }
    if (this.stream) { this.stream.getTracks().forEach((t) => t.stop()); this.stream = null; }
  }
  private armCheck(): void { if (this.armed()) return; if (this.recLive && this.srLive) { this.armed.set(true); this.heardText.set(t('Ina saurara…') + ' · listening'); this.interim.set(true); } }
  private disarm(): void { this.armed.set(false); this.recLive = false; this.srLive = false; }

  // ---- the name: the browser's recogniser (Hausa, then English), as the design does ----
  private startSR(lang = LANG.sr): void {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!NAME_ONLINE || !SR || APPLE_TOUCH) { this.srLive = true; this.armCheck(); return; }   // nothing to wait for: the recording carries the name
    // Kept where it works (Chrome with internet), but on a leash (Sani 2026-09-22): if it is not listening within
    // SR_START_WAIT the ring starts anyway, and whatever it has not heard by the end of the 10 s capture, the recording carries.
    this.clearSrWait();
    this.srWait = setTimeout(() => { this.srWait = null; if (!this.srLive && !this.paused() && !this.capEnded) { this.srLive = true; this.armCheck(); } }, SR_START_WAIT);
    try {
      const sr = new SR(); this.sr = sr; sr.lang = lang; sr.interimResults = true; sr.continuous = true; sr.maxAlternatives = 3;
      sr.onresult = (ev: any) => { let s = '', fin = false; for (let i = 0; i < ev.results.length; i++) { s += ev.results[i][0].transcript + ' '; if (ev.results[i].isFinal) fin = true; } this.transcript = s.trim(); this.heardText.set('“' + this.transcript + '”'); this.interim.set(!fin); this.speechCb?.(this.transcript, fin); };
      sr.onerror = (e: any) => { if (e?.error === 'language-not-supported' && sr.lang !== 'en-US') { try { sr.abort(); } catch { /* ignore */ } if (sr.__mic) { sr.__mic = false; this.holdMic(false); } this.startSR('en-US'); return; } if (e && e.error !== 'aborted' && e.error !== 'no-speech') { this.note.set('Speech: ' + e.error); this.srLive = true; this.armCheck(); } };
      sr.onstart = () => { this.clearSrWait(); this.srLive = true; this.armCheck(); };
      sr.start(); this.holdMic(true); sr.__mic = true; this.heardText.set(t('Ana shirya…') + ' · getting ready'); this.interim.set(true);
    } catch { this.note.set('Speech recognition failed to start'); }
  }
  private clearSrWait(): void { if (this.srWait) { clearTimeout(this.srWait); this.srWait = null; } }
  private stopSR(): void { this.clearSrWait(); try { if (this.sr) { this.sr.stop(); if (this.sr.__mic) { this.sr.__mic = false; this.holdMic(false); } } } catch { /* ignore */ } }

  // ---- faces: one face, always; two faces drop everything ----
  private startFaceMon(): void {
    const live = this.liveRef()?.nativeElement; const K = this.identity.api;
    if (!live || !K || !this.identity.ready() || !this.liveOn()) { this.faceOK.set(true); return; }
    this.faceVecs = []; this.earlyMatch = null; this.faceT0 = Date.now();
    K.watch(live, (r) => {
      if (!r?.ok) return; this.lastMs = r.ms || this.lastMs; this.setFaces(r.faces);
      this.follow(r.faces === 1 ? r.boxVideo : null, live);
      if (r.faces === 1) {
        if (r.emb) { this.faceVecs.push(r.emb); if ((r.score || 0) > this.bestSc) { this.bestStill = stillFrame(live); this.bestSc = r.score || 0; } this.tryEarly(); }
        else if (r.quality && !r.quality.ok) { this.aloneText.set(E('🎯 ') + this.hintFor(r.quality.reasons)); this.aloneSoft.set(true); }
        if (r.quality) this.qualityWatch(r.quality);
      }
    });
  }
  /**
   * Put the guide over the face. The engine reports the face in the camera's own pixels; the picture is drawn mirrored
   * and may be letterboxed in its box, so both are undone here. The whole picture counts (Sani 20 Nov): the ring follows
   * the face wherever it is and goes green there; the hand only shows when the face is running off the edge of the picture.
   * Sizes are the box's own layout size, never its on-screen rectangle: held upright the whole app is drawn turned a
   * quarter, and the rectangle's width and height would come back swapped.
   */
  private follow(b: { x: number; y: number; width: number; height: number } | null | undefined, v: HTMLVideoElement): void {
    if (!b || !v.videoWidth || !v.videoHeight) { this.track.set(null); this.nudge.set(''); this.sizeOK.set(true); return; }
    const BW = v.clientWidth, BH = v.clientHeight; if (!BW || !BH) return;
    const FIT = getComputedStyle(v).objectFit;
    const SX = BW / v.videoWidth, SY = BH / v.videoHeight;
    const SC = FIT === 'contain' ? Math.min(SX, SY) : FIT === 'fill' ? 0 : Math.max(SX, SY);
    const DW = SC ? v.videoWidth * SC : BW, DH = SC ? v.videoHeight * SC : BH;
    const OX = (BW - DW) / 2, OY = (BH - DH) / 2, KX = DW / v.videoWidth, KY = DH / v.videoHeight;
    const W = b.width * KX, H = b.height * KY;
    const LEFT = OX + (v.videoWidth - b.x - b.width) * KX, TOP = OY + b.y * KY;   // mirrored picture: the box flips
    const PAD_X = W * 0.42, PAD_Y = H * 0.34;
    const PCT = (n: number, of: number) => (n / of) * 100;
    this.track.set({ l: PCT(LEFT - PAD_X, BW), t: PCT(TOP - PAD_Y, BH), w: PCT(W + PAD_X * 2, BW), h: PCT(H + PAD_Y * 2, BH) }); this.lastTrack = this.track();
    // a sensible size, as a share of the camera picture itself (the detector's own floor is 70 of 640 pixels)
    const SIZE = b.width / v.videoWidth;
    this.sizeOK.set(SIZE >= 0.11 && SIZE <= 0.75);
    // the hand points the way the face must travel ON SCREEN, and only when part of the face is outside the picture
    const EDGE = 0.02, FL = LEFT - OX, FR = FL + W, FT = TOP - OY, FB = FT + H;
    this.nudge.set(FL < DW * EDGE ? 'right' : FR > DW * (1 - EDGE) ? 'left' : FT < DH * EDGE ? 'down' : FB > DH * (1 - EDGE) ? 'up' : '');
  }
  /**
   * A child the tablet already knows goes in as soon as the face alone is a clear match, after a few frames, instead of
   * waiting out the ten-second ring (Sani 2026-11-16: speed is of the essence). Only a strong, unambiguous face match
   * ends early; anything less, and every new child, still gets the full ring so their name can be recorded.
   */
  private earlyAt = 0;
  /** The clear face match that ended the ring early, so the welcome need not wait for the voice (Sani 20 Nov: fast). */
  private earlyMatch: MatchResult | null = null;
  private faceT0 = 0;
  private tryEarly(): void {
    const K = this.identity.api; if (!K || this.ended || this.capEnded || this.paused() || this.faceVecs.length < 2) return;
    const now = Date.now(); if (now - this.earlyAt < 250) return; this.earlyAt = now;
    try {
      const m: MatchResult = K.match({ faceVecs: this.faceVecs, voiceVec: null, nameKey: null });
      // the family build signs in on the face alone only when it is very sure (Sani 2026-11-22: before the name if found;
      // a stranger scored 0.56 in a test, so the bar here is higher than the ring's own accept, and needs a few frames)
      const SURE = !FAMILY || (m.face >= ((K as any).cfg?.earlyAccept ?? 0) && this.faceVecs.length >= 4);
      if (m.decision === 'accept' && m.person && (m.reasons || []).includes('face strong') && SURE) { console.log('[kratu] early sign-in', m.person.id, 'after', this.faceVecs.length, 'frames, face', m.face?.toFixed?.(3), 'in', Date.now() - this.faceT0, 'ms'); this.earlyMatch = m; this.endRec(); }
    } catch { /* the full ring still decides */ }
  }
  private stopFaceMon(): void { this.track.set(null); this.nudge.set(''); this.sizeOK.set(true); try { this.identity.api?.unwatch(); } catch { /* ignore */ } this.aloneText.set(''); }
  private hintFor(reasons: string[]): string { const r = reasons || []; if (r.includes('small')) return t('Matso kusa') + ' · come closer'; if (r.includes('blurry')) return t('Tsaya cak') + ' · hold still'; if (r.includes('dark') || r.includes('bright')) return t('Nemi haske') + ' · find better light'; return t('Duba kyamara') + ' · look at the camera'; }
  private setFaces(n: number): void {
    const many = n > 1; this.faceOK.set(n === 1);
    if (many) {
      // someone else is in the picture: nothing gathered can be kept, so it is dropped and the capture waits — Laila says
      // what is wrong and says it again every few seconds, and it carries on by itself once the child is alone again.
      this.cnt.many++; this.cnt.none = 0; this.cnt.one = 0; this.lastManyAt = Date.now(); this.discardCapture();
      if (!this.crowdSince) this.crowdSince = Date.now();
      if (Date.now() - this.crowdSince > CROWD_GIVE_UP) { this.crowdSince = 0; if (!this.capEnded) this.crowdAbort(); return; }
      this.pauseCapture('alone', 's_alone2');
    }
    else if (n === 0) { this.cnt.none++; this.cnt.many = 0; this.cnt.one = 0; if (this.cnt.none >= 4) this.pauseCapture('noface', 's_look_'); }
    else { this.cnt.one++; this.cnt.many = 0; this.cnt.none = 0; this.crowdSince = 0; const need = this.paused() === 'alone' ? 5 : 2; const p = this.paused(); if (this.cnt.one >= need && p && !['small', 'blurry', 'dark', 'turned'].includes(p)) this.resumeCapture(); }
    if (n === 1) { this.aloneText.set(''); } else { this.aloneSoft.set(n === 0); this.aloneText.set(many ? E('👥 ') + (this.session.g() === 'f' ? t('Ki zauna ke kaɗai') : t('Ka zauna kai kaɗai')) + ' · please be alone in the frame' : E('🙈 ') + t('Duba kyamara') + ' · look at the camera'); }
  }
  private discardCapture(): void { this.faceVecs = []; this.transcript = ''; this.bestSc = 0; this.bestStill = null; }
  private showPict(kind: string): void { const pr = PICT[kind] || PICT['noface']; this.pictA.set(pr[0]); this.pictB.set(pr[1]); this.pict.set(kind); }
  private pauseCapture(kind: Pause, clip?: string): void {
    if (this.capEnded) return;
    if (!this.paused()) { this.paused.set(kind); this.stopSR(); if (this.rec?.state === 'recording') { try { this.rec.pause(); } catch { /* ignore */ } } if (this.recHeld) { this.holdMic(false); this.recHeld = false; } this.armed.set(false); this.srLive = false; this.heardText.set('⏸'); this.interim.set(true); }
    else if (this.paused() !== kind) this.paused.set(kind);
    this.showPict(kind);
    const now = Date.now();
    if (clip && !this.speaking && now - (this.lastWarn[kind] || 0) > 7000) { this.lastWarn[kind] = now; this.speaking = true; this.bus.play(this.bus.gk(clip.replace(/_$/, ''))).then(() => { this.speaking = false; if (!this.paused()) this.doResume(); }); }
  }
  private doResume(): void {
    if (this.capEnded || this.paused() || this.speaking) return; this.pict.set(null);
    this.bus.micReady().then(() => { if (this.capEnded || this.paused() || this.speaking) return; if (this.rec?.state === 'paused') { try { this.rec.resume(); } catch { /* ignore */ } } if (this.rec?.state === 'recording' && !this.recHeld) { this.holdMic(true); this.recHeld = true; } this.startSR(); });
  }
  private resumeCapture(): void { if (!this.paused()) return; this.paused.set(null); this.badSince = 0; this.badKind = null; this.doResume(); }
  private qualityWatch(q: { ok: boolean; reasons: string[] }): void {
    if (!q || q.ok) { this.badSince = 0; this.badKind = null; return; }
    const kind: Pause = q.reasons.includes('small') ? 'small' : q.reasons.includes('blurry') ? 'blurry' : (q.reasons.includes('dark') || q.reasons.includes('bright')) ? 'dark' : 'turned';
    if (kind !== this.badKind) { this.badKind = kind; this.badSince = Date.now(); return; }
    if (Date.now() - this.badSince > 3000) { this.badSince = Date.now(); this.pauseCapture(kind, kind === 'small' ? 's_closer_' : kind === 'blurry' ? 's_still_' : kind === 'dark' ? 's_light_' : 's_look_'); setTimeout(() => this.resumeCapture(), 400); }
  }

  // ---- the ring: ten seconds of one face, twenty at most ----
  private runRing(): void {
    this.capEnded = false; this.ended = false; this.paused.set(null); this.speaking = false; this.lastWarn = {}; this.cnt = { many: 0, none: 0, one: 0 }; this.badSince = 0; this.badKind = null; this.pict.set(null); this.glow.set(true); this.disarm();
    if (!this.stream) this.recLive = true;   // photo fallback (no camera) → no recorder to wait for
    this.bus.micReady().then(() => this.startSR()); this.identity.api?.store.load().catch(() => { /* matched at the end instead */ }); this.startFaceMon();
    let t0 = Date.now(), last = t0, last0 = t0, active = 0; this.ringT0 = t0; this.askedName = false;
    this.speechCb = (t, fin) => { const nm = extractName(t); if (nm) { if (this.nameAt < 0 && this.recT0) this.nameAt = Math.max(0, Date.now() - this.recT0 - 900); if (this.stopT) clearTimeout(this.stopT); this.stopT = setTimeout(() => this.endRec(), fin ? 500 : 1500); } };
    this.iv = setInterval(() => {
      const now = Date.now(); if (this.faceOK() && this.armed()) active += now - last; last = now;
      this.progress.set(Math.min(100, active / MAXMS * 100)); const sec = Math.floor(active / 1000); this.capTime.set('00:' + (sec < 10 ? '0' : '') + sec);
      if ((this.paused() || this.speaking) && !FAMILY) t0 += now - last0; last0 = now;   // the family build: 10 seconds in all, pauses included (Sani 2026-11-22)
      if (FAMILY && this.extend) { t0 += this.extend; this.extend = 0; }   // except Laila's own "say your name"
      if (FAMILY && !this.askedName && now - this.ringT0 >= ASK_NAME_MS && !this.capEnded && !this.ended) this.askName();
      if (active >= MAXMS || now - t0 >= HARDMS) this.endRec();
    }, 100);
  }
  /**
   * The family build (Sani 2026-11-23): nobody signed in on the face alone by about 4 s (not found, or two children too
   * close), so Laila asks for the name, once: the first sentence of her own s_p3 ("Yanzu kai, ka faɗa mana sunanka." /
   * "Yanzu ke, ki faɗa mana sunanki."), cut before its "press Laila". The recording pauses while she speaks (she is never
   * heard with the microphone open), and her line does not count against the 10 s.
   */
  private ringT0 = 0; private askedName = false;
  private async askName(): Promise<void> {
    this.askedName = true; this.speaking = true; const T = Date.now(); console.log('[kratu] say your name, at', T - this.ringT0, 'ms');
    try { if (this.rec?.state === 'recording') this.rec.pause(); } catch { /* ignore */ }
    if (this.recHeld) { this.holdMic(false); this.recHeld = false; }
    const CUT = setTimeout(() => this.bus.stopAll(), ASK_NAME_CLIP_MS);
    await this.bus.play(this.bus.gk('s_p3')); clearTimeout(CUT);
    this.extend += Date.now() - T; this.speaking = false;
    if (this.capEnded || this.ended) return;
    await this.bus.micReady();
    if (this.rec?.state === 'paused') { try { this.rec.resume(); } catch { /* ignore */ } }
    if (this.rec?.state === 'recording' && !this.recHeld) { this.holdMic(true); this.recHeld = true; }
  }
  private extend = 0;
  private stopAllCapture(): void { if (this.iv) clearInterval(this.iv); this.iv = null; if (this.stopT) clearTimeout(this.stopT); this.speechCb = null; this.disarm(); this.pict.set(null); this.paused.set(null); this.glow.set(false); this.stopFaceMon(); this.stopSR(); this.stopCam(); }
  private endRec(): void {
    if (this.ended) return; this.ended = true; this.capEnded = true; this.stopAllCapture();
    if (this.lastManyAt && Date.now() - this.lastManyAt < 2500) { this.crowdAbort(true); return; }
    const EARLY = this.earlyMatch; this.earlyMatch = null;
    if (EARLY?.person) { this.welcomeBack(EARLY); return; }
    setTimeout(() => this.finishName(), 700);
  }
  private crowdAbort(force = false): void {
    if (this.ended && !force) return; this.crowdSince = 0; this.ended = true; this.capEnded = true; this.stopAllCapture(); this.discardCapture();
    this.missText.set(E('👥 ') + (this.session.g() === 'f' ? t('Ki zauna ke kaɗai') : t('Ka zauna kai kaɗai')) + ' · please be alone in the frame'); this.aloneText.set(''); this.lastManyAt = 0;
    this.bus.play(this.bus.gk('s_alone2')).then(() => this.showGate('retry'));
  }

  // ---- who is it ----
  /**
   * The face alone was a clear, unambiguous match: the child is greeted at once. The voice is not worked out (it could
   * only add to a face that is already strong), so there is no wait for the recording to be read. The recording is
   * waited for only when the record has no name sound of its own to greet them with.
   */
  private async welcomeBack(m: MatchResult): Promise<void> {
    const P = m.person!; const K = this.identity.api;
    K?.store.refresh(P.id, this.faceVecs.slice(), m).catch(() => { /* the session still opens */ });
    const BANK = (window as any).KRATU_BANK as Record<string, string> | null;
    const HAS_NAME_SOUND = !!(P.key && BANK?.[P.key]) || !!P.clip;
    let ownUrl: string | undefined;
    if (!HAS_NAME_SOUND && P.name) { await new Promise((r) => setTimeout(r, 700)); ownUrl = (await (this.nameClipP || Promise.resolve(null)))?.url; }
    console.log('[kratu] sign-in accept (early) frames', this.faceVecs.length, 'in', Date.now() - this.faceT0, 'ms');
    this.welcome(P, true, ownUrl);
  }
  private async finishName(): Promise<void> {
    const raw = extractName(this.transcript); const bank = (window as any).KRATU_BANK as Record<string, string> | null;
    const key = raw && raw.indexOf(' ') < 0 ? snapName(raw, bank) : null; const heardName = key ? key.charAt(0).toUpperCase() + key.slice(1) : raw;
    this.heardText.set(this.transcript ? '“' + this.transcript + '”' : ''); this.interim.set(false);
    const K = this.identity.api; const own = await (this.nameClipP || Promise.resolve(null));
    let voiceVec: Float32Array | null = null;
    try { if (K && this.recBlob) { const pcm = await K.pcmFromBlob(this.recBlob); voiceVec = pcm.length > 8000 && (!FAMILY || spoke(pcm)) ? await K.voiceEmbed(pcm) : null; } } catch { voiceVec = null; }
    if (K && this.identity.ready()) {
      await K.store.load();
      const m: MatchResult = K.match({ faceVecs: this.faceVecs, voiceVec, nameKey: key });
      console.log('[kratu] sign-in', m.decision, (m.reasons || []).join('; '), 'frames', this.faceVecs.length, 'heard', JSON.stringify(this.transcript), 'own clip', !!own?.url);
      if (m.decision === 'accept' && m.person) {
        // a clear recognition keeps the record's recent face prints up to date (Sani 2026-11-16); refresh() itself refuses
        // anything short of a confident, face-only match, and never touches the prints from enrolment
        K.store.refresh(m.person.id, this.faceVecs.slice(), m).catch(() => { /* the session still opens */ });
        this.welcome(m.person, true, own?.url); return;
      }
      if (heardName && this.faceVecs.length) {
        // held, not written: a child who walks away, presses the door or tries again leaves nothing behind. It is saved
        // in enter(), the moment the session actually opens (Sani 2026-09-17).
        this.pending = { name: heardName, key: key || undefined, gender: this.session.g(), faceVecs: this.faceVecs.slice(), voiceVec, clip: own?.url };
        this.doneText.set(t('Madalla! Sannu, ') + heardName + t('! Barka da zuwa!')); this.still.set(this.bestStill);
        await this.greet({ id: 'new', ...this.pending } as Person, false, own?.url); this.confetti(); this.enter(); return;
      }
      if (FAMILY && !heardName && this.faceVecs.length && !voiceVec) { this.missText.set(E('🤔 ') + (this.session.g() === 'f' ? t('Ban ji sunan ki sosai ba') : t('Ban ji sunan ka sosai ba'))); this.retryTalk('s_retry_name'); this.againOn.set(true); return; }   // family sign-up needs the voice as well as the face (Sani 2026-11-22)
      if (!heardName && own?.url && this.faceVecs.length) {
        // No words came back (an iPad, whose recogniser is Siri and has no Hausa; Chrome with no internet) but the child was
        // seen and their own "Sunana …" was recorded: they are enrolled anyway. An unknown name is never a blocker (Sani
        // 2026-09-17). Their recording is kept with the record; greet() says only "Barka da zuwa" (it may hold "sunana"),
        // and the students list shows "?" for the written name.
        this.pending = { name: '', gender: this.session.g(), faceVecs: this.faceVecs.slice(), voiceVec, clip: own.url };
        this.doneText.set(t('Madalla! Barka da zuwa!')); this.still.set(this.bestStill);
        await this.greet({ id: 'new', ...this.pending } as Person, false, own.url); this.confetti(); this.enter(); return;
      }
      if (heardName) { this.missText.set(E('🙈 ') + (this.session.g() === 'f' ? t('Ba na ganin ki sosai') : t('Ba na ganin ka sosai'))); this.retryTalk('s_retry_face'); this.againOn.set(true); return; }
    } else if (heardName || own?.url) {
      // no face engine on this device: the child's own recording (or a name) opens the session, nothing is stored in the
      // identity store. With the online recogniser gone (Sani 2026-11-09) there is never a written name here, so the
      // recording alone must be enough, and Laila says just "Barka da zuwa".
      this.welcome({ id: 'tmp', name: heardName || '', key: key || undefined, faceVecs: [], voiceVec: null, clip: own?.url } as Person, false, own?.url); return;
    }
    this.missText.set(E('🤔 ') + (this.session.g() === 'f' ? t('Ban ji sunan ki sosai ba') : t('Ban ji sunan ka sosai ba'))); this.retryTalk('s_retry_name'); this.againOn.set(true);
  }
  private async welcome(p: Person, back: boolean, ownUrl?: string): Promise<void> {
    if (FAMILY && back) { this.matched(p); return; }
    this.doneText.set(t('Sannu') + (p.name ? ', ' + p.name : '') + '! ' + (back ? t('Barka da dawowa!') : t('Barka da zuwa!'))); this.still.set(this.bestStill);
    await this.greet(p, back, ownUrl); if (!back) this.confetti(); this.enter();
  }
  /**
   * Known, so nothing more is asked here: the record is written (this is the moment the child actually starts) and the
   * welcome screen takes over. A new child keeps the confetti for a beat so the Madalla lands (Sani 2026-09-18).
   */
  /**
   * The family build (Sani 2026-11-22): a known child is in. No frame, no border: only a small light animation where the
   * face was, then straight on to Laila's welcome back (she greets them there).
   */
  readonly matchFx = signal<{ l: number; t: number; w: number; h: number } | null>(null);
  private lastTrack: { l: number; t: number; w: number; h: number } | null = null;
  private matched(p: Person): void {
    this.session.name.set(p.name); this.session.personId.set(p.id); this.session.known.set(true); this.session.simulated.set(null);
    this.matchFx.set(this.lastTrack || { l: 30, t: 20, w: 40, h: 55 });
    this.enter();
  }
  private enter(): void {
    const p = this.pending; this.pending = null;
    const go = async () => {
      if (p) { try { const rec = await this.identity.api!.store.upsert(p); this.session.personId.set(rec.id); } catch { /* the session still opens; nothing is kept */ } }
      this.bus.stopAll(); this.teardown(); this.dropModal();
      if (FAMILY) { this.fam.faceDone(this.session.personId(), !!p); return; }   // the family build: a new child picks an animal first
      this.router.navigate(['/welcome']);
    };
    setTimeout(go, p ? 900 : this.matchFx() ? 650 : 300);
  }
  /** "Sannu, <name>! Barka da dawowa / zuwa" — the name in Laila's voice from the bank, else in the child's own voice. */
  private async greet(p: Person, back: boolean, ownUrl?: string): Promise<void> {
    this.session.name.set(p.name); this.session.personId.set(p.id); this.session.known.set(back); this.session.simulated.set(null);
    const bank = (window as any).KRATU_BANK as Record<string, string> | null;
    // A name is said only when it is surely the name alone: a bank recording, or the child's own clip cut where the recogniser
    // heard the name. With no written name (an iPad, no internet) the clip may still hold "sunana …", so Laila just says
    // welcome (Sani 2026-09-22).
    const nameSrc = p.key && bank?.[p.key] ? bank[p.key] : (p.name ? (p.clip || ownUrl || null) : null);
    if (nameSrc) { await this.bus.play('s_sannu'); await this.bus.playRaw(nameSrc); }
    await this.bus.play(back ? 's_back' : 's_welcome');
  }
  /** Only ever 'retry' now: a recognised child goes straight on instead of being asked to press again. */
  /** Laila explains the miss, then lights Laila while she says "click Laila", then the door while she says "or the door". A tap on either cuts her off. */
  private async retryTalk(why: string): Promise<void> {
    const run = ++this.retryRun;
    await this.bus.play(this.bus.gk(why)); if (run !== this.retryRun) return;
    this.showGate('retry');
    this.gateFocus.set('laila'); await this.bus.play(this.bus.gk('s_retry_laila')); if (run !== this.retryRun) return;
    this.gateFocus.set('door'); await this.bus.play(this.bus.gk('s_retry_door')); if (run !== this.retryRun) return;
    this.gateFocus.set(null);
  }
  private retryRun = 0;
  private showGate(mode: 'retry'): void { this.gate.set(mode); this.gateHint.set((this.session.g() === 'f' ? t('Ki danna kan Laila') : t('Ka danna kan Laila')) + ' · ' + t('sake gwadawa')); }
  /** The door under Laila on the gate: back to the very start, the session reset (Sani 14 Sep 2026). */
  startOver(e: Event): void { e.stopPropagation(); this.retryRun++; this.pending = null; this.bus.stopAll(); this.teardown(); this.dropModal(); this.session.end(); if (FAMILY) { this.router.navigate(['/gender']); return; } try { sessionStorage.clear(); } catch { /* ignore */ } this.router.navigate(['/gender']); }
  /** The only gate left is the try-again one: a child who was recognised never sees it. */
  gatePress(): void { this.retryRun++; this.gateFocus.set(null); this.bus.stopAll(); this.again(); setTimeout(() => this.start(), 250); }
  again(): void { this.pending = null; this.stopAllCapture(); this.stopConfetti(); this.reset(); this.capturing.set(false); }
  private teardown(): void { this.stopAllCapture(); this.stopConfetti(); this.micHolds = 0; this.bus.setMic(false); }

  private confetti(): void {
    const c = this.confettiRef()?.nativeElement; const host = c?.parentElement as HTMLElement | null; if (!c || !host) return;
    this.stopConfetti(); this.confettiOn.set(true);
    const ctx = c.getContext('2d')!, W = (c.width = host.clientWidth), H = (c.height = host.clientHeight);
    const cols = ['#E63946', '#1FA1D8', '#FBC02D', '#2FAE9E', '#8A5FBF', '#EE7043', '#4CAF50', '#FF7B9C'];
    const ps = Array.from({ length: 160 }, (_, i) => ({ x: W / 2 + (Math.random() - 0.5) * W * 0.6, y: H * 0.35, vx: (Math.random() - 0.5) * 9, vy: -Math.random() * 11 - 4, r: 4 + Math.random() * 5, c: cols[i % cols.length], a: Math.random() * 6.28, s: (Math.random() - 0.5) * 0.3 }));
    const t0 = performance.now();
    const tick = (now: number) => { const t = (now - t0) / 1000; ctx.clearRect(0, 0, W, H); ps.forEach((p) => { p.vy += 0.28; p.x += p.vx; p.y += p.vy; p.vx *= 0.99; p.a += p.s; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.globalAlpha = Math.max(0, 1 - Math.max(0, t - 2.2) / 0.8); ctx.fillRect(-p.r, -p.r * 0.6, p.r * 2, p.r * 1.2); ctx.restore(); }); if (t < 3) this.confT = requestAnimationFrame(tick); else this.stopConfetti(); };
    this.confT = requestAnimationFrame(tick);
  }
  private stopConfetti(): void { if (this.confT) cancelAnimationFrame(this.confT); this.confT = null; this.confettiOn.set(false); }
}
