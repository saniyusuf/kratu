import { Component, ElementRef, ViewEncapsulation, OnDestroy, OnInit, computed, inject, input, output, signal, viewChild } from '@angular/core';
import { AudioBus } from '@kratu/app/core/audio/audio-bus.service';
import { IdentityService, MatchResult } from '@kratu/app/core/identity/identity.service';
import { nameClip } from '@kratu/app/core/identity/name-clip';
import { LoaderService } from '@kratu/app/core/loader/loader.service';
import { Profile } from '@kratu/app/core/family/family.service';

/** What the camera step ended with. */
export type FaceEnd =
  | { kind: 'enrolled' }                       // enrol: the child's face prints (and voice) are saved under their profile id
  | { kind: 'match'; id: string }              // sign-in: this profile, surely
  | { kind: 'unsure' }                         // sign-in: no clear match, the cards take over
  | { kind: 'nocam' }                          // the camera was refused or is missing: the cards take over
  | { kind: 'skip' };                          // the parent chose "later" / the child chose the list

/** One face for this long (the school ring is ten seconds; a parent holding the phone needs less). */
const ENROL_MS = 7000;
/** Sign-in: a clear face match goes in early; otherwise the ring runs this long and then the voice helps decide. */
const WHO_MS = 6000;
/** Never more than this in all, pauses included. */
const HARD_MS = 20000;
/** Two faces for this long and it gives up and offers a fresh try (as the school capture does). */
const CROWD_GIVE_UP = 25000;
const HAND: Record<string, string> = { left: '👈🏾', right: '👉🏾', up: '👆🏾', down: '👇🏾' };

/**
 * The family app's face step (Sani 2026-11-22), with the school capture's rules and hints in the family's own look:
 * one round camera with a ring that fills while one face is in it, the app's hand pointing the way to move, two faces
 * dropping everything gathered and pausing, Laila's existing lines for "look at the camera", "come closer", "hold
 * still", "find light" and "sit alone". No photo is ever kept: face prints (numbers) and, at enrolment, the child's
 * own "Sunana …" clip only.
 *   enrol — the parent holds the phone up to the child just enrolled; saved under that profile's id.
 *   who   — option A: the child looks at the phone and is recognised; the cards are only the fallback.
 *   check — option B: the child tapped a card; the face only confirms it.
 */
@Component({
  selector: 'fam-face',
  template: `
<div class="ff" [class.busy]="!!paused()" [class.ok]="oneFace() && !paused() && !nudge()" [class.live]="liveOn()">
  @if (!engineReady()) {
    <div class="ffload">
      <div class="ffbar"><i [style.width]="loadPct() + '%'"></i></div>
      <p class="hint">{{ loadText() }}</p>
      @if (prog().state === 'fail') {<button class="ffretry" (click)="retryLoad()">↺ Try again</button>}
    </div>
  }
  <div class="ffcam">
    <svg class="ffring" viewBox="0 0 100 100" aria-hidden="true"><circle class="bg" cx="50" cy="50" r="47"/><circle class="fg" cx="50" cy="50" r="47" [style.stroke-dashoffset]="295.3 * (1 - progress() / 100)"/></svg>
    <div class="ffwin"><video #live autoplay playsinline [muted]="true" [hidden]="!liveOn()"></video>
      @if (!liveOn()) {<span class="ffidle">📷</span>}</div>
    @if (nudge(); as n) {<span [class]="'ffhand ' + n" aria-hidden="true">{{ HAND[n] }}</span>}
  </div>
  <p class="ffsay" [class.warn]="!!paused()">{{ say() }}</p>
</div>`,
  styleUrl: './fam-face.css',
  encapsulation: ViewEncapsulation.None,
  host: { style: 'display:contents' },
})
export class FamFace implements OnInit, OnDestroy {
  readonly mode = input.required<'enrol' | 'who' | 'check'>();
  readonly profile = input<Profile | null>(null);
  /** enrol: the parent presses Start; who and check: the camera opens by itself. */
  readonly auto = input(false);
  /** A try-one-step preview (`?step=`): nothing is saved. */
  readonly dry = input(false);
  readonly ended = output<FaceEnd>();

  private readonly bus = inject(AudioBus);
  private readonly identity = inject(IdentityService);
  private readonly loader = inject(LoaderService);
  private readonly liveRef = viewChild<ElementRef<HTMLVideoElement>>('live');
  readonly HAND = HAND;

  readonly prog = this.loader.faceProg;
  readonly engineReady = computed(() => this.prog().state === 'ready');
  readonly loadPct = computed(() => { const P = this.prog(); return P.total ? Math.round(100 * P.got / P.total) : 3; });
  readonly loadText = computed(() => { const P = this.prog(); if (P.state === 'fail') return 'The face camera could not be downloaded. Check the connection.';
    return 'Getting the face camera ready' + (P.total ? ' · ' + Math.round(P.got / 1048576) + ' / ' + Math.round(P.total / 1048576) + ' MB' : '') + ' · once only'; });
  readonly liveOn = signal(false);
  readonly running = signal(false);
  /** At least one attempt has ended here (the shell shows "Try again" only then). */
  readonly tried = signal(false);
  readonly progress = signal(0);
  readonly oneFace = signal(false);
  readonly paused = signal<'' | 'alone' | 'noface' | 'small' | 'blurry' | 'dark' | 'turned'>('');
  readonly nudge = signal<'' | 'left' | 'right' | 'up' | 'down'>('');
  readonly hint = signal('');

  private stream: MediaStream | null = null; private rec: MediaRecorder | null = null; private chunks: Blob[] = [];
  private vecs: Float32Array[] = []; private iv: ReturnType<typeof setInterval> | null = null;
  private crowdSince = 0; private lastMany = 0; private none = 0; private one = 0; private lastWarn: Record<string, number> = {};
  private t0 = 0; private badKind = ''; private badSince = 0; private done = false; private earlyAt = 0; private speaking = false;

  readonly say = computed(() => {
    const P = this.paused(), H = this.hint();
    if (P === 'alone') return '👥 Only one face in the circle, please';
    if (P === 'noface') return '🙈 Look at the camera';
    if (H) return H;
    const NAME = this.profile()?.name || '';
    if (this.mode() === 'enrol') return this.running() ? NAME + ' says: “Sunana ' + NAME + '”' : 'Hold the phone so ' + NAME + '’s face is in the circle';
    return this.running() ? 'Look at the camera and say “Sunana …”' : '';
  });

  ngOnInit(): void { this.loader.loadFace(); if (this.auto()) this.whenReady().then((ok) => { if (ok && !this.done) this.start(); }); }
  ngOnDestroy(): void { this.done = true; this.stop(); }

  private async whenReady(): Promise<boolean> { const OK = await this.loader.loadFace(); return OK && this.identity.ready(); }
  retryLoad(): void { this.loader.loadFace(); }

  /** Open the camera (and the microphone, for the child's "Sunana …"), then the ring. */
  async start(): Promise<void> {
    if (this.running() || this.done) return;
    if (!(await this.whenReady())) return;
    const MD = navigator.mediaDevices;
    if (!MD?.getUserMedia) { this.finish({ kind: 'nocam' }); return; }
    try {
      this.stream = await MD.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } }, audio: true })
        .catch(() => MD.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } } }));
    } catch { this.finish({ kind: 'nocam' }); return; }
    if (this.done) { this.stop(); return; }
    const LIVE = this.liveRef()?.nativeElement; if (!LIVE) { this.finish({ kind: 'nocam' }); return; }
    LIVE.srcObject = this.stream; LIVE.muted = true; LIVE.volume = 0; this.liveOn.set(true);
    await new Promise<void>((r) => { if (LIVE.readyState >= 2) r(); else { LIVE.addEventListener('loadedmetadata', () => r(), { once: true }); setTimeout(r, 1500); } });
    LIVE.play().catch(() => undefined);
    this.bus.stopAll();
    await this.bus.micReady();
    this.startRec();
    this.running.set(true); this.t0 = Date.now(); this.watch(LIVE); this.ring();
  }

  private startRec(): void {
    const S = this.stream; if (!S || !S.getAudioTracks().length) return;
    try {
      this.chunks = []; const R = new MediaRecorder(new MediaStream(S.getAudioTracks())); this.rec = R;
      R.ondataavailable = (ev) => { if (ev.data?.size) this.chunks.push(ev.data); };
      R.start(250); this.bus.setMic(true);
    } catch { this.rec = null; }
  }
  private stopRec(): Promise<Blob | null> {
    const R = this.rec; this.rec = null;
    if (!R || R.state === 'inactive') { this.bus.setMic(false); return Promise.resolve(null); }
    return new Promise((res) => { R.onstop = () => { this.bus.setMic(false); res(this.chunks.length ? new Blob(this.chunks, { type: R.mimeType || 'audio/webm' }) : null); }; try { R.stop(); } catch { res(null); } });
  }

  private watch(live: HTMLVideoElement): void {
    const K = this.identity.api; if (!K) return;
    K.watch(live, (r) => {
      if (!r?.ok || this.done) return;
      this.faces(r.faces);
      this.follow(r.faces === 1 ? r.boxVideo : null, live);
      if (r.faces !== 1) return;
      if (r.emb && !this.paused()) { this.vecs.push(r.emb); this.hint.set(''); this.early(); }
      else if (r.quality && !r.quality.ok) this.quality(r.quality.reasons);
    });
  }
  /** Two faces: everything gathered is dropped and it waits; one face again for a few frames and it carries on. */
  private faces(n: number): void {
    this.oneFace.set(n === 1);
    if (n > 1) {
      this.vecs = []; this.one = 0; this.none = 0; this.lastMany = Date.now();
      if (!this.crowdSince) this.crowdSince = Date.now();
      if (Date.now() - this.crowdSince > CROWD_GIVE_UP) { this.crowdSince = 0; this.restart(); return; }
      this.pause('alone', 's_alone2');
    } else if (n === 0) { this.none++; this.one = 0; if (this.none >= 4) this.pause('noface', 's_look'); }
    else { this.one++; this.none = 0; this.crowdSince = 0; const NEED = this.paused() === 'alone' ? 5 : 2; if (this.paused() && this.one >= NEED) this.paused.set(''); }
  }
  private pause(kind: 'alone' | 'noface', clip: string): void {
    this.paused.set(kind);
    const NOW = Date.now();
    if (!this.speaking && NOW - (this.lastWarn[kind] || 0) > 7000) { this.lastWarn[kind] = NOW; this.speak(clip); }
  }
  /** Laila is never heard while the microphone is open: the recording pauses while she speaks. */
  private async speak(clip: string): Promise<void> {
    this.speaking = true;
    try { if (this.rec?.state === 'recording') this.rec.pause(); } catch { /* ignore */ }
    this.bus.setMic(false); await this.bus.play(this.bus.gk(clip));
    this.speaking = false;
    if (this.done || !this.rec) return;
    await this.bus.micReady(); this.bus.setMic(true);
    try { if (this.rec?.state === 'paused') this.rec.resume(); } catch { /* ignore */ }
  }
  private quality(reasons: string[]): void {
    const KIND = reasons.includes('small') ? 'small' : reasons.includes('blurry') ? 'blurry' : (reasons.includes('dark') || reasons.includes('bright')) ? 'dark' : 'turned';
    this.hint.set(KIND === 'small' ? '🔍 Come closer' : KIND === 'blurry' ? '✋ Hold still' : KIND === 'dark' ? '💡 Find more light' : '👀 Look at the camera');
    if (KIND !== this.badKind) { this.badKind = KIND; this.badSince = Date.now(); return; }
    if (Date.now() - this.badSince > 3000 && !this.speaking) { this.badSince = Date.now(); this.speak(KIND === 'small' ? 's_closer' : KIND === 'blurry' ? 's_still' : KIND === 'dark' ? 's_light' : 's_look'); }
  }
  /** The school capture's mapping (face.ts follow()): the camera-pixel box onto the mirrored, cover-cropped picture. */
  private follow(b: { x: number; y: number; width: number; height: number } | null | undefined, v: HTMLVideoElement): void {
    if (!b || !v.videoWidth) { this.nudge.set(''); return; }
    const BOX = v.getBoundingClientRect(); if (!BOX.width) return;
    const S = Math.max(BOX.width / v.videoWidth, BOX.height / v.videoHeight);
    const DW = v.videoWidth * S, DH = v.videoHeight * S, OX = (BOX.width - DW) / 2, OY = (BOX.height - DH) / 2;
    const LEFT = OX + (v.videoWidth - b.x - b.width) * S, TOP = OY + b.y * S;
    const CX = 100 * (LEFT + b.width * S / 2) / BOX.width, CY = 100 * (TOP + b.height * S / 2) / BOX.height;
    this.nudge.set(CX < 36 ? 'right' : CX > 64 ? 'left' : CY < 33 ? 'down' : CY > 63 ? 'up' : '');
  }
  /** Sign-in: a strong, unambiguous face match goes in after a few frames (the school's tryEarly). */
  private early(): void {
    if (this.mode() === 'enrol' || this.vecs.length < 3) return;
    const NOW = Date.now(); if (NOW - this.earlyAt < 250) return; this.earlyAt = NOW;
    const M = this.match(null);
    if (M && M.decision === 'accept' && M.person && (M.reasons || []).includes('face strong')) this.end();
  }
  private ring(): void {
    let active = 0, last = Date.now(); const T0 = last; const NEED = this.mode() === 'enrol' ? ENROL_MS : WHO_MS;
    this.iv = setInterval(() => {
      const NOW = Date.now(); if (this.oneFace() && !this.paused() && !this.speaking) active += NOW - last; last = NOW;
      this.progress.set(Math.min(100, 100 * active / NEED));
      if (active >= NEED || NOW - T0 >= HARD_MS) this.end();
    }, 100);
  }
  private restart(): void { this.tried.set(true); this.vecs = []; this.progress.set(0); this.stop(); this.paused.set(''); this.hint.set('Only one face in the circle, please. Press Start to try again.'); }

  private match(voiceVec: Float32Array | null): MatchResult | null {
    try { return this.identity.api?.match({ faceVecs: this.vecs, voiceVec, nameKey: null }) ?? null; } catch { return null; }
  }
  private async end(): Promise<void> {
    if (!this.running() || this.done) return;
    this.running.set(false); this.tried.set(true); if (this.iv) clearInterval(this.iv); this.iv = null;
    try { this.identity.api?.unwatch(); } catch { /* ignore */ }
    if (this.lastMany && Date.now() - this.lastMany < 2500) { this.restart(); return; }
    const BLOB = await this.stopRec(); this.stopCam();
    const K = this.identity.api!;
    let voiceVec: Float32Array | null = null;
    try { if (BLOB) { const PCM = await K.pcmFromBlob(BLOB); voiceVec = PCM.length > 8000 ? await K.voiceEmbed(PCM) : null; } } catch { voiceVec = null; }
    if (this.mode() === 'enrol') {
      const P = this.profile();
      if (!P || this.vecs.length < 3) { this.hint.set('I could not see the face well. Press Start to try again.'); this.progress.set(0); return; }
      const CLIP = BLOB ? await nameClip(BLOB, -1).catch(() => null) : null;
      if (!this.dry()) await K.store.upsert({ id: P.id, name: P.name, gender: P.g, faceVecs: this.vecs.slice(), voiceVec, clip: CLIP?.url });
      this.finish({ kind: 'enrolled' }); return;
    }
    const M = this.match(voiceVec);
    console.log('[kratu] family sign-in', M?.decision, (M?.reasons || []).join('; '), 'frames', this.vecs.length, 'ms', Date.now() - this.t0);
    const ID = M && M.decision === 'accept' && M.person ? M.person.id : null;
    if (ID && (this.mode() === 'who' || ID === this.profile()?.id)) { K.store.refresh(ID, this.vecs.slice(), M!).catch(() => undefined); this.finish({ kind: 'match', id: ID }); return; }
    this.finish({ kind: 'unsure' });
  }
  private finish(e: FaceEnd): void { if (this.done) return; this.done = true; this.stop(); this.ended.emit(e); }
  /** The parent's "later" / the child's "choose from the list". */
  cancel(): void { this.finish({ kind: 'skip' }); }
  private stopCam(): void {
    const LIVE = this.liveRef()?.nativeElement; try { LIVE?.pause(); if (LIVE) LIVE.srcObject = null; } catch { /* ignore */ }
    this.stream?.getTracks().forEach((t) => t.stop()); this.stream = null; this.liveOn.set(false);
  }
  private stop(): void {
    if (this.iv) clearInterval(this.iv); this.iv = null; this.running.set(false);
    try { this.identity.api?.unwatch(); } catch { /* ignore */ }
    this.stopRec(); this.stopCam(); this.nudge.set('');
  }
}
