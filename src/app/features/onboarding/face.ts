import { Component, ElementRef, OnDestroy, OnInit, effect, inject, signal, viewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { afterPaint } from '../../shared/paint';
import { AudioBus } from '../../core/audio/audio-bus.service';
import { IdentityService, MatchResult, Person } from '../../core/identity/identity.service';
import { extractName, nameClip, snapName, stillFrame } from '../../core/identity/name-clip';
import { SessionService } from '../../core/state/session.service';
import { Ear } from '../../shared/chrome/chrome';
import { Laila } from '../../shared/laila/laila';
import { DOOR_SVG } from '../../shared/svg';

type Pause = 'alone' | 'noface' | 'small' | 'blurry' | 'dark' | 'turned';
/** How long the capture will wait for the child to be alone again before it gives up and offers a fresh try. */
const CROWD_GIVE_UP = 25000;
const PICT: Record<string, [string, string]> = { alone: ['👥', '🧒'], noface: ['🙈', '👀'], small: ['🐜', '🔍'], blurry: ['💨', '✋'], dark: ['🌑', '💡'], turned: ['↩️', '👀'] };
const MAXMS = 10000, HARDMS = 20000;
/** iPad and iPhone: every browser there is WebKit, whose speech recogniser is Siri. It has no Hausa, and it takes the
 *  microphone away from the recording, so there the recording alone carries the name (Sani 2026-09-22). iPadOS reports
 *  itself as a Mac, hence the touch check. */
const APPLE_TOUCH = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

/**
 * Screen 3 · Bari mu ga wa kake. The tablet looks and listens at once: ten seconds of one face in the frame while the child
 * says "Sunana …". A returning child is greeted by name; a new one is enrolled on the spot as vectors, never a photo.
 * Two faces in the frame: everything gathered is dropped, Laila says so, and the child presses her to try again alone.
 */
@Component({
  selector: 'app-face',
  imports: [Ear, Laila],
  host: { class: 's facecap', '[attr.data-gender]': 'session.g()' },   // the design hides the other gender's example through this attribute
  template: `
<app-ear (pressed)="intro()" />
<div class="pr">{{ session.g() === 'f' ? 'Bari mu ga wa kike' : 'Bari mu ga wa kake' }}<span class="sm">{{ session.g() === 'f' ? 'Bidiyo kina faɗin sunanki' : 'Bidiyo kana faɗin sunanka' }} · a video of you saying your name</span></div>
<div class="examples" [hidden]="capturing()">
  <div class="exlabel">Misali · the example</div>
  <div class="gtoggle"><button [class.on]="exG() === 'm'" (click)="exG.set('m')">Namiji</button><button [class.on]="exG() === 'f'" (click)="exG.set('f')">Mace</button></div>
  <div class="exrow">
    @for (g of ['m','f']; track g) {
    <button class="exvid" [class.m]="g === 'm'" [class.f]="g === 'f'" [class.talking]="talking() === g" (click)="example(g)">
      <span class="exframe"><video #ex class="exphoto exvideo" playsinline preload="auto" disablepictureinpicture [poster]="'assets/example-' + g + '.webp'"><source [src]="'assets/example-' + g + '.mp4'" type="video/mp4"><source [src]="'assets/example-' + g + '.webm'" type="video/webm"></video><i class="vfc"></i><span class="vfbar"><span class="exrec">● REC</span><span class="vftime">00:02</span></span></span>
      <span class="exsub">{{ g === 'm' ? '“Sunana Musa”' : '“Sunana Aisha”' }}</span><span class="exwave"><i></i><i></i><i></i><i></i><i></i></span><span class="exhand">👆🏾</span>
    </button>}
  </div>
</div>
<div class="facestage">
  <button class="startwrap" [class.cue]="cue()" [hidden]="capturing()" aria-label="Danna Laila don farawa" (click)="start()">
    <span class="startring"></span><app-laila [size]="110" cls="start-lm" /><span class="start-hand">👆🏾</span>
    <span class="starthint">Danna kan Laila don farawa<br><small>click Laila to start</small></span>
  </button>
</div>
@if (capturing()) {
<div #modal class="capmodal"><div class="capmodal-inner facecap" [attr.data-gender]="session.g()">
  <div class="capmodal-title">Bari mu ga wa kake · let’s see who you are</div>
  <div class="camview">
    <div class="camwrap" [class.armed]="armed()" [class.paused]="!!paused()" [class.glow]="glow()" [class.done]="!!still()" [style.--p]="progress() + '%'">
      <div class="cam"><i class="vfc"></i><span class="vfbar"><span class="rec">● REC</span><span class="vftime cap-time">{{ capTime() }}</span></span>
        <video #live class="feed live" autoplay [muted]="true" [volume]="0" playsinline [hidden]="!liveOn() || !!still()"></video>
        <div class="pict" [hidden]="!pict()"><div class="pict-big">{{ pictA() }}</div><div class="pict-arrow">→</div><div class="pict-big ok">{{ pictB() }}</div></div>
        <div class="faceguide" [class.ok]="faceOK() && !paused() && !nudge() && sizeOK()" [class.busy]="!!paused()" [hidden]="!liveOn() || !!still()" aria-hidden="true"></div>
        @if (nudge(); as n) {<div [class]="'facenudge ' + n" [hidden]="!liveOn() || !!still()" aria-hidden="true">{{ HAND[n] }}</div>}
        <div class="alone" [hidden]="!aloneText()" [class.soft]="aloneSoft()">{{ aloneText() }}</div>
        <img class="feed" alt="" [src]="still() || 'assets/gender-girl.webp'" [hidden]="liveOn() && !still()"><div class="ov"></div></div>
      <div class="vfprog"><i></i></div>
      <div class="startwrap capnext" [class.cue]="gate() !== null" [hidden]="gate() === null">
        <button type="button" class="gatepick gatelaila" [class.lit]="gateFocus() === 'laila'" [class.dim]="gateFocus() === 'door'" aria-label="Danna Laila · sake gwadawa" (click)="gatePress()"><app-laila [size]="150" cls="start-lm" /><span class="start-hand" [hidden]="gateFocus() === 'door'">👆🏾</span><div class="hint">{{ gateHint() }}<small>click Laila to try again</small></div></button>
        <button type="button" class="gatepick gatedoor" [class.lit]="gateFocus() === 'door'" [class.dim]="gateFocus() === 'laila'" aria-label="Koma farko" (click)="startOver($event)"><span style="display:contents" [innerHTML]="door"></span><span class="start-hand" [hidden]="gateFocus() !== 'door'">👆🏾</span><div class="hint">Koma farko<small>click the door to start again</small></div></button></div>
    </div>
    <span class="cam-hand" [style.display]="glow() ? 'block' : 'none'">👆🏾</span>
    <div class="capmic" [hidden]="!armed()">{{ session.g() === 'f' ? 'Ki ce' : 'Ka ce' }}: “Sunana…” · say your name</div>
    <div class="heard" [hidden]="!heardText()" [class.interim]="interim()">{{ heardText() }}</div>
    <div class="camnote" [hidden]="!note()">{{ note() }}</div>
    <div class="capdone" [hidden]="!doneText()"><span class="bigcheck">✓</span> <span class="donetext">{{ doneText() }}</span></div>
    <div class="capmiss" [hidden]="!missText()">{{ missText() }}</div>
    <button class="again" type="button" [hidden]="!againOn()" (click)="again()">↺ Sake gwada · try again</button>
  </div>

  <canvas #confetti class="confetti" [hidden]="!confettiOn()"></canvas>
</div></div>}`,
})
export class FaceScreen implements OnInit, OnDestroy {
  readonly session = inject(SessionService);
  private readonly bus = inject(AudioBus);
  private readonly identity = inject(IdentityService);
  private readonly router = inject(Router);
  private readonly liveRef = viewChild<ElementRef<HTMLVideoElement>>('live');
  private readonly exRefs = viewChild<ElementRef<HTMLVideoElement>>('ex');
  private readonly modalRef = viewChild<ElementRef<HTMLElement>>('modal');
  private readonly hostEl = inject(ElementRef) as ElementRef<HTMLElement>;
  private readonly confettiRef = viewChild<ElementRef<HTMLCanvasElement>>('confetti');

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
  private sr: any = null; private transcript = ''; private recLive = false; private srLive = false; private speechCb: ((t: string, fin: boolean) => void) | null = null;
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
  ngOnInit(): void { afterPaint().then(() => this.intro()); }
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
    this.bus.stopAll(); this.cue.set(false); this.reset(); this.capturing.set(true);
    await afterPaint();
    const md = navigator.mediaDevices;
    if (!md?.getUserMedia) { this.note.set('No camera in this viewer — showing a photo instead'); this.runRing(); return; }
    let started = false; const begin = () => { if (started) return; started = true; this.runRing(); };
    const guard = setTimeout(() => { if (!started) { this.note.set('Waiting for camera permission… showing a photo for now'); begin(); } }, 2500);
    try {
      const s = await md.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } }, audio: true });
      clearTimeout(guard); this.stream = s; const live = this.liveRef()?.nativeElement;
      if (live) { live.srcObject = s; live.muted = true; live.volume = 0; this.liveOn.set(true); }
      this.note.set('');
      this.bus.micReady().then(() => { if (this.stream === s) this.startRec(s); });
      const go = () => { live?.play().catch(() => undefined); begin(); };
      if (live && live.readyState >= 2) go(); else { live?.addEventListener('loadedmetadata', go, { once: true }); setTimeout(go, 1200); }
    } catch (err: any) { clearTimeout(guard); this.note.set('Camera blocked (' + (err?.name || 'error') + ') — showing a photo instead'); begin(); }
  }

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
  private armCheck(): void { if (this.armed()) return; if (this.recLive && this.srLive) { this.armed.set(true); this.heardText.set('Ina saurara… · listening'); this.interim.set(true); } }
  private disarm(): void { this.armed.set(false); this.recLive = false; this.srLive = false; }

  // ---- the name: the browser's recogniser (Hausa, then English), as the design does ----
  private startSR(lang = 'ha-NG'): void {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR || APPLE_TOUCH) { this.srLive = true; this.armCheck(); return; }   // nothing to wait for: the recording carries the name
    try {
      const sr = new SR(); this.sr = sr; sr.lang = lang; sr.interimResults = true; sr.continuous = true; sr.maxAlternatives = 3;
      sr.onresult = (ev: any) => { let s = '', fin = false; for (let i = 0; i < ev.results.length; i++) { s += ev.results[i][0].transcript + ' '; if (ev.results[i].isFinal) fin = true; } this.transcript = s.trim(); this.heardText.set('“' + this.transcript + '”'); this.interim.set(!fin); this.speechCb?.(this.transcript, fin); };
      sr.onerror = (e: any) => { if (e?.error === 'language-not-supported' && sr.lang !== 'en-US') { try { sr.abort(); } catch { /* ignore */ } if (sr.__mic) { sr.__mic = false; this.holdMic(false); } this.startSR('en-US'); return; } if (e && e.error !== 'aborted' && e.error !== 'no-speech') { this.note.set('Speech: ' + e.error); this.srLive = true; this.armCheck(); } };
      sr.onstart = () => { this.srLive = true; this.armCheck(); };
      sr.start(); this.holdMic(true); sr.__mic = true; this.heardText.set('Ana shirya… · getting ready'); this.interim.set(true);
    } catch { this.note.set('Speech recognition failed to start'); }
  }
  private stopSR(): void { try { if (this.sr) { this.sr.stop(); if (this.sr.__mic) { this.sr.__mic = false; this.holdMic(false); } } } catch { /* ignore */ } }

  // ---- faces: one face, always; two faces drop everything ----
  private startFaceMon(): void {
    const live = this.liveRef()?.nativeElement; const K = this.identity.api;
    if (!live || !K || !this.identity.ready() || !this.liveOn()) { this.faceOK.set(true); return; }
    this.faceVecs = [];
    K.watch(live, (r) => {
      if (!r?.ok) return; this.lastMs = r.ms || this.lastMs; this.setFaces(r.faces);
      this.follow(r.faces === 1 ? r.boxVideo : null, live);
      if (r.faces === 1) {
        if (r.emb) { this.faceVecs.push(r.emb); if ((r.score || 0) > this.bestSc) { this.bestStill = stillFrame(live); this.bestSc = r.score || 0; } }
        else if (r.quality && !r.quality.ok) { this.aloneText.set('🎯 ' + this.hintFor(r.quality.reasons)); this.aloneSoft.set(true); }
        if (r.quality) this.qualityWatch(r.quality);
      }
    });
  }
  /**
   * Put the guide over the face. The engine reports the face in the camera's own pixels; the picture is drawn mirrored
   * and may be cropped to fill its box, so both are undone here. The oval is drawn generously around the face, and when
   * the child is off to one side or too far away the arrow says which way to move (Sani 2026-09-17).
   */
  private follow(b: { x: number; y: number; width: number; height: number } | null | undefined, v: HTMLVideoElement): void {
    if (!b || !v.videoWidth || !v.videoHeight) { this.track.set(null); this.nudge.set(''); this.sizeOK.set(true); return; }
    const box = v.getBoundingClientRect(); if (!box.width) return;
    const fit = getComputedStyle(v).objectFit;
    const sx = box.width / v.videoWidth, sy = box.height / v.videoHeight;
    const s = fit === 'contain' ? Math.min(sx, sy) : fit === 'fill' ? 0 : Math.max(sx, sy);   // cover is the default here
    const dw = s ? v.videoWidth * s : box.width, dh = s ? v.videoHeight * s : box.height;
    const ox = (box.width - dw) / 2, oy = (box.height - dh) / 2, k = dw / v.videoWidth, k2 = dh / v.videoHeight;
    const w = b.width * k, h = b.height * k2;
    const left = ox + (v.videoWidth - b.x - b.width) * k, top = oy + b.y * k2;   // mirrored picture: the box flips
    const padX = w * 0.42, padY = h * 0.34;
    const pct = (n: number, of: number) => (n / of) * 100;
    this.track.set({ l: pct(left - padX, box.width), t: pct(top - padY, box.height), w: pct(w + padX * 2, box.width), h: pct(h + padY * 2, box.height) });
    // The target is the ring drawn in the middle; a child sits a little below its centre, hence 48. The hand points the
    // way the face must travel ON SCREEN, which is what a child watching the picture follows (Sani 2026-09-17: not
    // inverted). Too far or too close is left to the spoken hint and its picture.
    const cx = pct(left + w / 2, box.width), cy = pct(top + h / 2, box.height), size = pct(w, box.width);
    this.sizeOK.set(size >= 17 && size <= 58);
    this.nudge.set(cx < 38 ? 'right' : cx > 62 ? 'left'
      : cy < 35 ? 'down' : cy > 61 ? 'up' : '');
  }
  private stopFaceMon(): void { this.track.set(null); this.nudge.set(''); this.sizeOK.set(true); try { this.identity.api?.unwatch(); } catch { /* ignore */ } this.aloneText.set(''); }
  private hintFor(reasons: string[]): string { const r = reasons || []; if (r.includes('small')) return 'Matso kusa · come closer'; if (r.includes('blurry')) return 'Tsaya cak · hold still'; if (r.includes('dark') || r.includes('bright')) return 'Nemi haske · find better light'; return 'Duba kyamara · look at the camera'; }
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
    if (n === 1) { this.aloneText.set(''); } else { this.aloneSoft.set(n === 0); this.aloneText.set(many ? '👥 ' + (this.session.g() === 'f' ? 'Ki zauna ke kaɗai' : 'Ka zauna kai kaɗai') + ' · please be alone in the frame' : '🙈 Duba kyamara · look at the camera'); }
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
    this.bus.micReady().then(() => this.startSR()); this.startFaceMon();
    let t0 = Date.now(), last = t0, last0 = t0, active = 0;
    this.speechCb = (t, fin) => { const nm = extractName(t); if (nm) { if (this.nameAt < 0 && this.recT0) this.nameAt = Math.max(0, Date.now() - this.recT0 - 900); if (this.stopT) clearTimeout(this.stopT); this.stopT = setTimeout(() => this.endRec(), fin ? 500 : 1500); } };
    this.iv = setInterval(() => {
      const now = Date.now(); if (this.faceOK() && this.armed()) active += now - last; last = now;
      this.progress.set(Math.min(100, active / MAXMS * 100)); const sec = Math.floor(active / 1000); this.capTime.set('00:' + (sec < 10 ? '0' : '') + sec);
      if (this.paused() || this.speaking) t0 += now - last0; last0 = now;
      if (active >= MAXMS || now - t0 >= HARDMS) this.endRec();
    }, 100);
  }
  private stopAllCapture(): void { if (this.iv) clearInterval(this.iv); this.iv = null; if (this.stopT) clearTimeout(this.stopT); this.speechCb = null; this.disarm(); this.pict.set(null); this.paused.set(null); this.glow.set(false); this.stopFaceMon(); this.stopSR(); this.stopCam(); }
  private endRec(): void {
    if (this.ended) return; this.ended = true; this.capEnded = true; this.stopAllCapture();
    if (this.lastManyAt && Date.now() - this.lastManyAt < 2500) { this.crowdAbort(true); return; }
    setTimeout(() => this.finishName(), 700);
  }
  private crowdAbort(force = false): void {
    if (this.ended && !force) return; this.crowdSince = 0; this.ended = true; this.capEnded = true; this.stopAllCapture(); this.discardCapture();
    this.missText.set('👥 ' + (this.session.g() === 'f' ? 'Ki zauna ke kaɗai' : 'Ka zauna kai kaɗai') + ' · please be alone in the frame'); this.aloneText.set(''); this.lastManyAt = 0;
    this.bus.play(this.bus.gk('s_alone2')).then(() => this.showGate('retry'));
  }

  // ---- who is it ----
  private async finishName(): Promise<void> {
    const raw = extractName(this.transcript); const bank = (window as any).KRATU_BANK as Record<string, string> | null;
    const key = raw && raw.indexOf(' ') < 0 ? snapName(raw, bank) : null; const heardName = key ? key.charAt(0).toUpperCase() + key.slice(1) : raw;
    this.heardText.set(this.transcript ? '“' + this.transcript + '”' : ''); this.interim.set(false);
    const K = this.identity.api; const own = await (this.nameClipP || Promise.resolve(null));
    let voiceVec: Float32Array | null = null;
    try { if (K && this.recBlob) { const pcm = await K.pcmFromBlob(this.recBlob); voiceVec = pcm.length > 8000 ? await K.voiceEmbed(pcm) : null; } } catch { voiceVec = null; }
    if (K && this.identity.ready()) {
      await K.store.load();
      const m: MatchResult = K.match({ faceVecs: this.faceVecs, voiceVec, nameKey: key });
      if (m.decision === 'accept' && m.person) { this.welcome(m.person, true, own?.url); return; }
      if (heardName && this.faceVecs.length) {
        // held, not written: a child who walks away, presses the door or tries again leaves nothing behind. It is saved
        // in enter(), the moment the session actually opens (Sani 2026-09-17).
        this.pending = { name: heardName, key: key || undefined, gender: this.session.g(), faceVecs: this.faceVecs.slice(), voiceVec, clip: own?.url };
        this.doneText.set('Madalla! Sannu, ' + heardName + '! Barka da zuwa!'); this.still.set(this.bestStill);
        await this.greet({ id: 'new', ...this.pending } as Person, false, own?.url); this.confetti(); this.enter(); return;
      }
      if (!heardName && own?.url && this.faceVecs.length) {
        // No words came back (an iPad, whose recogniser is Siri and has no Hausa; Chrome with no internet) but the child was
        // seen and their own "Sunana …" was recorded: they are enrolled anyway. An unknown name is never a blocker (Sani
        // 2026-09-17). Their recording is kept with the record; greet() says only "Barka da zuwa" (it may hold "sunana"),
        // and the students list shows "?" for the written name.
        this.pending = { name: '', gender: this.session.g(), faceVecs: this.faceVecs.slice(), voiceVec, clip: own.url };
        this.doneText.set('Madalla! Barka da zuwa!'); this.still.set(this.bestStill);
        await this.greet({ id: 'new', ...this.pending } as Person, false, own.url); this.confetti(); this.enter(); return;
      }
      if (heardName) { this.missText.set('🙈 ' + (this.session.g() === 'f' ? 'Ba na ganin ki sosai' : 'Ba na ganin ka sosai')); this.retryTalk('s_retry_face'); this.againOn.set(true); return; }
    } else if (heardName) {
      // no face engine on this device: the name alone opens the session, nothing is stored
      this.welcome({ id: 'tmp', name: heardName, key: key || undefined, faceVecs: [], voiceVec: null, clip: own?.url } as Person, false, own?.url); return;
    }
    this.missText.set('🤔 ' + (this.session.g() === 'f' ? 'Ban ji sunan ki sosai ba' : 'Ban ji sunan ka sosai ba')); this.retryTalk('s_retry_name'); this.againOn.set(true);
  }
  private async welcome(p: Person, back: boolean, ownUrl?: string): Promise<void> {
    this.doneText.set('Sannu' + (p.name ? ', ' + p.name : '') + '! ' + (back ? 'Barka da dawowa!' : 'Barka da zuwa!')); this.still.set(this.bestStill);
    await this.greet(p, back, ownUrl); if (!back) this.confetti(); this.enter();
  }
  /**
   * Known, so nothing more is asked here: the record is written (this is the moment the child actually starts) and the
   * welcome screen takes over. A new child keeps the confetti for a beat so the Madalla lands (Sani 2026-09-18).
   */
  private enter(): void {
    const p = this.pending; this.pending = null;
    const go = async () => {
      if (p) { try { const rec = await this.identity.api!.store.upsert(p); this.session.personId.set(rec.id); } catch { /* the session still opens; nothing is kept */ } }
      this.bus.stopAll(); this.teardown(); this.dropModal(); this.router.navigate(['/welcome']);
    };
    setTimeout(go, p ? 900 : 300);
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
  private showGate(mode: 'retry'): void { this.gate.set(mode); this.gateHint.set((this.session.g() === 'f' ? 'Ki danna kan Laila' : 'Ka danna kan Laila') + ' · sake gwadawa'); }
  /** The door under Laila on the gate: back to the very start, the session reset (Sani 14 Sep 2026). */
  startOver(e: Event): void { e.stopPropagation(); this.retryRun++; this.pending = null; this.bus.stopAll(); this.teardown(); this.dropModal(); this.session.end(); try { sessionStorage.clear(); } catch { /* ignore */ } this.router.navigate(['/gender']); }
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
