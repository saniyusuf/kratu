import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AudioBus } from '../audio/audio-bus.service';
import { SessionService, Gender } from '../state/session.service';
import { IdentityService } from '../identity/identity.service';
import { LoaderService } from '../loader/loader.service';
import { SpeechService } from '../speech/speech.service';

/**
 * A child's profile on this phone. Since 22 Nov (Sani: "we don't need enrolment manually, this is based on face now")
 * children sign themselves up as in the school app: boy or girl, then the face screen, face and "Sunana …" together.
 * The profile's id IS the identity record's id (face and voice prints, the child's own name clip; never a photo).
 * `name` is empty unless the parent types one in Manage profiles: the child's own clip says their name.
 */
export interface Profile { id: string; name: string; g: Gender; at: number;
  /** Up to three names-bank names the offline recogniser heard in the child's own "Sunana …" (Sani 2026-11-23). */
  /** The bank name the parent confirmed, and its clip (Laila says it from then on; the clip is kept on the phone). */
  nameKey?: string; nameClip?: string; }   // no animal any more (Sani 2026-11-22: no emoji, no animal step); older saved profiles may still carry one, ignored

/** The parent's account (Sani 2026-11-21, "for now"): an email, a phone number and a 6-digit code the parent sets
 *  (typed twice). Manage profiles asks for that code; adding a child needs nothing. Later the code will be sent to the
 *  email or phone instead. Only the code's hash is kept. */
/** The parent's account, on this phone only. `name` came on 22 Nov (Sani: full name first), so older saved accounts have none. */
export interface Account { name?: string; email: string; phone: string; code: string; at: number;
  /** When the parent agreed to face sign-in (Sani 2026-11-22, Nigeria's data law: a parent's consent before a child's
   *  face print is made). Unset: never asked or not yet agreed. */
  faceOk?: number; }


/** The family build's own screens, drawn over the app (both ways round, unlike the landscape lessons). */
export type FamScreen = 'welcome' | 'mic' | 'signin' | 'consent' | 'getready' | 'code' | 'parent' | null;

const K_PROFILES = 'kratu_fam_profiles', K_ACCOUNT = 'kratu_fam_account', K_STARTED = 'kratu_fam_started';

@Injectable({ providedIn: 'root' })
export class FamilyService {
  /** Set by the parent area's "Settings: Open": the next press of the gear opens the real settings, not the parent code. */
  static settingsNext = false;
  private readonly router = inject(Router);
  private readonly bus = inject(AudioBus);
  private readonly session = inject(SessionService);
  private readonly identity = inject(IdentityService);
  private readonly loader = inject(LoaderService);
  private readonly speech = inject(SpeechService);

  readonly screen = signal<FamScreen>(null);
  readonly profiles = signal<Profile[]>(this.read());
  /** The child signing in now. */
  readonly current = signal<Profile | null>(null);
  /** The parent's account on this phone, once signed in. */
  readonly account = signal<Account | null>(this.readAccount());
  /** Set by the shell when the loader has finished: screens after the microphone wait for it. */
  private loaded!: Promise<void>;
  /**
   * Try one step (Sani 2026-11-21: every step of the family app, played and heard on its own). `?step=<id>` opens that
   * real screen with sample children; nothing is saved on the phone (no profile, no PIN), so a parent's real profiles
   * are left exactly as they were. The steps page lists the ids.
   */
  readonly trying = new URLSearchParams(location.search).get('step');
  static readonly SAMPLES: Profile[] = [
    { id: 'try_musa', name: 'Musa', g: 'm', at: 0 },
    { id: 'try_aisha', name: 'Aisha', g: 'f', at: 0 },
  ];

  // ---- storage: this phone only for now; the parent account and its sync come with the server (design page, box 6)
  private read(): Profile[] { try { return JSON.parse(localStorage.getItem(K_PROFILES) || '[]'); } catch { return []; } }
  private write(list: Profile[]): void { this.profiles.set(list); if (this.trying) return; try { localStorage.setItem(K_PROFILES, JSON.stringify(list)); } catch { /* private mode */ } }
  private readAccount(): Account | null { try { return JSON.parse(localStorage.getItem(K_ACCOUNT) || 'null'); } catch { return null; } }
  private saveAccount(a: Account): void { this.account.set(a); if (this.trying) return; try { localStorage.setItem(K_ACCOUNT, JSON.stringify(a)); } catch { /* private mode */ } }

  async setAccount(name: string, email: string, phone: string, code: string): Promise<void> {
    this.saveAccount({ name: name.trim().replace(/\s+/g, ' '), email: email.trim(), phone: phone.trim(), code: await this.hash(code), at: Date.now() });
  }
  async checkCode(code: string): Promise<boolean> {
    if (this.trying) return /^\d{6}$/.test(code);
    const a = this.account(); return !!a && a.code === await this.hash(code);
  }
  private async hash(code: string): Promise<string> {
    const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('kratu-family:' + code));
    return Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, '0')).join('');
  }
  /** Manage profiles: the parent may type a child's name (optional; the child's own clip says it anyway). */
  rename(id: string, name: string): void {
    const NAME = name.replace(/\s+/g, ' ').trim().slice(0, 24);
    // a name typed over the bank one: Laila's bank clip no longer fits, so the child's own clip speaks again
    this.write(this.profiles().map((p) => (p.id === id ? (NAME === p.name ? p : { ...p, name: NAME, nameKey: undefined, nameClip: undefined }) : p)));
    if (NAME) this.identity.api?.store.upsert({ id, name: NAME }).catch(() => undefined);
  }
  // ---- the name (Sani 2026-11-23): heard offline from the child's clip, set only in strict mode, never sent anywhere
  private namesData: Promise<{ phrases: Record<string, string[]>; file: Record<string, string>; variants: Record<string, string[]> } | null> | null = null;
  names(): Promise<{ phrases: Record<string, string[]>; file: Record<string, string>; variants: Record<string, string[]> } | null> {
    if (!this.namesData) this.namesData = fetch('names/phrases.json').then((r) => (r.ok ? r.json() : null)).catch(() => null);
    return this.namesData;
  }
  /** How a bank key is written: "a'isha" → "A'isha". */
  nameOf(key: string): string { return key.charAt(0).toUpperCase() + key.slice(1); }
  async clipUrl(key: string): Promise<string | null> { const D = await this.names(); return D?.file[key] ? 'names/' + D.file[key] + '.ogg' : null; }
  /**
   * The name step (Sani 2026-11-23, hybrid): try hard for an accurate name, set it only when sure, and never hold the child
   * up. It runs in the background after the child is in, and gives up after NAME_WAIT_MS.
   *  1. Offline, both ways: the names-bank grammar hears a phrase that is ONE name, and free listening, matched to the
   *     bank by a sound key, lands on that same name (or a spelling of it). On the 1,958 bank recordings: 23% set, 91% right.
   *  2. Online (NAME_ONLINE, off): the place where a hosted recogniser (Google / PlotWeaver, Sani's open question) plugs in,
   *     asked only when the offline step is not sure and the phone is online. Nothing is sent anywhere while it is off.
   * Not sure: nothing is set and the child's own clip stays their name. A name a parent typed is never replaced.
   */
  async nameStep(id: string): Promise<void> {
    const KEY = await Promise.race([this.findName(id), new Promise<null>((r) => setTimeout(() => r(null), NAME_WAIT_MS))]);
    if (!KEY || this.profiles().find((p) => p.id === id)?.name || this.identity.people().find((x) => x.id === id)?.key) return;
    await this.setBankName(id, KEY);
  }
  private async findName(id: string): Promise<string | null> {
    try {
      const CLIP = this.clipOf(id), D = await this.names(); if (!CLIP || !D) return null;
      const CTX = new AudioContext({ sampleRate: 16000 });
      const PCM = (await CTX.decodeAudioData(await (await fetch(CLIP)).arrayBuffer())).getChannelData(0); CTX.close();
      const OFFLINE = await this.offlineName(PCM, D);
      if (OFFLINE) return OFFLINE;
      if (NAME_ONLINE && navigator.onLine) return await this.onlineName(PCM, Object.keys(D.file));
      return null;
    } catch { return null; }
  }
  private async offlineName(PCM: Float32Array, D: { phrases: Record<string, string[]>; file: Record<string, string>; variants: Record<string, string[]> }): Promise<string | null> {
    const HEARD = await this.speech.recognizeClip(PCM, 16000, Object.keys(D.phrases));
    const ONE = D.phrases[HEARD]; if (!ONE || ONE.length !== 1) return null;
    const KEY = ONE[0], NEAR = nearestName(await this.speech.recognizeClip(PCM, 16000, null), Object.keys(D.file));
    return NEAR && (NEAR === KEY || (D.variants[KEY] || []).includes(NEAR)) ? KEY : null;
  }
  /** The online check's socket: returns a names-bank key it is sure of, or null. Not built yet (NAME_ONLINE is false). */
  private async onlineName(_pcm: Float32Array, _keys: string[]): Promise<string | null> { return null; }
  /** The name is written and its bank clip kept on the phone for Laila's "Sannu, <name>". */
  private async setBankName(id: string, key: string): Promise<void> {
    const URL0 = await this.clipUrl(key); let clip: string | undefined;
    try { if (URL0) { const B = await (await fetch(URL0)).blob(); clip = await new Promise<string>((r) => { const F = new FileReader(); F.onload = () => r(String(F.result)); F.readAsDataURL(B); }); } } catch { clip = undefined; }
    const NAME = this.nameOf(key);
    this.write(this.profiles().map((p) => (p.id === id ? { ...p, name: NAME, nameKey: key, nameClip: clip } : p)));
    this.identity.api?.store.upsert({ id, name: NAME, key }).catch(() => undefined);
  }
  /** The child's own "Sunana …" name clip, from their identity record. */
  clipOf(id: string): string | null { return this.identity.people().find((x) => x.id === id)?.clip || null; }
  remove(id: string): void {
    this.write(this.profiles().filter((p) => p.id !== id));
    this.identity.api?.store.remove(id).catch(() => undefined);   // their face prints and name clip go too
    // the child's own rows on this phone go with them
    try { for (const k of Object.keys(localStorage)) if (k.endsWith('_' + id) || k.includes('_' + id + '_')) localStorage.removeItem(k); } catch { /* ignore */ }
  }

  /** The microphone up front; the camera is asked for only at the face step, after the parent's consent. */
  async micGranted(): Promise<boolean> {
    let ok = false;
    // the microphone and the camera, both (Sani 2026-11-23: asked together, the camera never again on the face screen)
    try { if (navigator.permissions?.query) { const Q = (n: string) => navigator.permissions.query({ name: n as PermissionName }).then((r) => r.state === 'granted'); ok = (await Q('microphone')) && (await Q('camera')); } } catch { /* fall through */ }
    if (!ok) try { ok = localStorage.getItem('kratu_perms') === '1'; } catch { /* ignore */ }
    if (ok) this.session.perms.set({ camera: true, mic: true, at: Date.now() });
    return ok;
  }

  /**
   * The opening (app.ts calls it with the loader's promise). The very first open: the welcome page, the microphone, the
   * loader, the parent's PIN, then the first child. Every open after that: the profiles, Netflix style.
   */
  async begin(loaded: Promise<void>): Promise<void> {
    this.loaded = loaded;
    if (this.trying) { this.tryStep(this.trying); return; }
    let started = false; try { started = localStorage.getItem(K_STARTED) === '1'; } catch { /* ignore */ }
    if (!started && !this.profiles().length) { this.show('welcome'); return; }
    if (!this.account()) { this.show('signin'); return; }   // Register comes straight after Start (Sani 2026-11-22)
    if (this.account()?.faceOk) this.loader.loadFace();   // from Cache Storage after the first time: ready by the time the camera opens
    await this.loaded;
    if (!(await this.micGranted())) { this.show('mic'); return; }
    this.afterSetup();
  }
  /** `?step=` (see `trying`): straight to one real screen, with the sample children and nothing saved. */
  private async tryStep(step: string): Promise<void> {
    this.profiles.set(FamilyService.SAMPLES);
    const kid = step.endsWith('_f') ? FamilyService.SAMPLES[1] : FamilyService.SAMPLES[0];
    this.account.set({ name: 'Parent Example', phone: '0803 000 0000', email: 'parent@example.com', code: '', at: 0 });
    const id = step.replace(/_[mf]$/, '');
    if (id === 'welcome') { this.show('welcome'); return; }
    if (id === 'mic') { this.show('mic'); return; }
    await this.loaded;
    switch (id) {
      case 'signin': this.account.set(null); this.show('signin'); return;
      case 'consent': this.account.set({ ...this.account()!, faceOk: undefined }); this.show('consent'); return;
      case 'getready': this.show('getready'); return;
      case 'gender': this.show(null); this.router.navigate(['/gender']); return;
      case 'parent': this.manage(); return;
      case 'guest': this.guest(); return;
      case 'laila': case 'first': this.current.set(kid); this.firstGo(); return;
      case 'home': this.signIn(kid); this.session.known.set(true); this.show(null); this.router.navigate(['/home']); return;
      default: this.toCamera();
    }
  }
  /** Welcome page: Start. */
  start(): void {
    try { localStorage.setItem(K_STARTED, '1'); } catch { /* ignore */ }
    if (!this.account()) { this.show('signin'); return; }   // Start -> Register, the parent's sign-up (Sani 2026-11-22)
    this.micThen();
  }
  /** The parent has registered: then the microphone, the loader and the first child. */
  registered(): void { this.loader.loadFace(); this.micThen(); }   // the face models start now, while the parent carries on
  private async micThen(): Promise<void> { if (await this.micGranted()) this.afterMic(); else this.show('mic'); }
  /** The microphone screen is done (allowed or not: refused means the touch versions of speaking). */
  async afterMic(): Promise<void> {
    this.show(null);   // the loader shows through while it is still working
    await this.loaded;
    if (!this.account()) { this.show('signin'); return; }
    this.afterSetup();
  }
  /** After the microphone: the parent's consent once, then the camera (the school app's own sign-in). */
  afterSetup(): void { if (!this.account()?.faceOk) { this.show('consent'); return; } this.toCamera(); }
  /** Face and voice (Sani 2026-11-22, Nigeria's data law): the parent agrees once, before any child is seen. */
  consent(yes: boolean): void {
    const A = this.account();
    if (!yes || !A) { this.guest(); return; }   // no face and voice: the children can only play as guests until the parent agrees (asked again next time)
    this.saveAccount({ ...A, faceOk: Date.now() }); this.loader.loadFace(); this.toCamera();
  }
  /**
   * The school app's own sign-in (Sani 2026-11-22): boy or girl, then the face screen with its example film and
   * "Sunana …". A known child is signed in; a face no one knows, with a voice, becomes a new child (held until they press
   * Laila, exactly as in the school). The face models must be in first: their progress shows if they are not.
   */
  async toCamera(): Promise<void> {
    if (!this.account()?.faceOk) { this.show('consent'); return; }
    this.bus.stopAll(); this.session.end(); this.session.guest.set(false);
    if (!this.identity.ready()) { this.show('getready'); if (!(await this.loader.loadFace())) return; if (this.screen() !== 'getready') return; }
    this.show(null); this.router.navigate(['/gender']);
  }
  /** Camera or microphone refused (Sani 2026-11-22: no cards, face and voice are the only way in): the app's own
   *  permission screen asks again, and goes on to boy-or-girl once allowed. */
  toPerm(): void { this.bus.stopAll(); this.show(null); this.router.navigate(['/perm']); }
  /**
   * The face screen has decided (face.ts enter()): a new child's record has just been written, or a known child was
   * recognised. A new child gets a profile under the same id and meets Laila; a known one goes on to Laila's
   * welcome back, as in the school app.
   */
  faceDone(id: string | null, isNew: boolean): void {
    if (!id) { this.toCamera(); return; }
    let p = this.profiles().find((x) => x.id === id);
    if (!p) {
      const PERSON = this.identity.people().find((x) => x.id === id);
      p = { id, name: PERSON?.name || '', g: PERSON?.gender || this.session.g() || 'm', at: Date.now() };
      this.write([...this.profiles(), p]);
    }
    this.signIn(p); this.current.set(p);
    if (isNew) this.nameStep(p.id);   // in the background: set only when sure, never holds the child up
    // a known child with a name: "Sannu, <name>" first, nothing appended (Sani 2026-11-23)
    const SAY = p.nameClip || this.clipOf(p.id);   // Laila's bank clip, else the child's own recording of their name
    if (!isNew && SAY) { const CLIP = SAY; this.show(null); this.bus.play('s_sannu').then((ok) => (ok ? this.bus.playRaw(CLIP) : false)).then(() => { this.session.known.set(true); this.router.navigate(['/welcome']); }); return; }
    // a new child meets Laila (her first-day welcome), a known one hears her welcome back (Sani 2026-11-22: no animal step)
    this.session.known.set(!isNew); this.show(null); this.router.navigate(['/welcome']);
  }
  /** Manage profiles: the parent's code first (Sani 2026-11-21). */
  manage(): void { this.show('code'); }

  /** After the welcome by name: Laila's first-day welcome, one screen (Sani 2026-11-21: Meet Laila and the first
   *  welcome merged), then home. */
  firstGo(): void {
    const p = this.current(); if (!p) return;
    this.signIn(p); this.session.known.set(false); this.show(null); this.router.navigate(['/welcome']);
  }
  /** After "welcome back": the welcome-back beats of the app's own welcome screen, then home. */
  backGo(): void { this.session.known.set(true); this.show(null); this.router.navigate(['/welcome']); }
  /** The TEMPORARY tester bar (family-shell TEST_BAR): in as the sample Musa or Aisha, no camera, nothing saved to any
   *  real child (the sample ids are try_musa / try_aisha), on to Laila's welcome back and home. */
  testAs(g: Gender): void {
    const P = g === 'f' ? FamilyService.SAMPLES[1] : FamilyService.SAMPLES[0];
    this.bus.stopAll(); this.signIn(P); this.current.set(P); this.backGo();
  }
  /** Guest (Sani 2026-11-18): anyone, everything open, nothing saved, gone when the session ends. */
  guest(): void {
    this.bus.stopAll(); this.session.end(); this.session.guest.set(true); this.session.setGender('m');
    this.session.name.set(null); this.session.personId.set(null); this.session.known.set(true);
    this.show(null); this.router.navigate(['/home']);
  }
  private signIn(p: Profile): void {
    this.session.end(); this.session.guest.set(false); this.session.setGender(p.g);
    this.session.name.set(p.name); this.session.personId.set(p.id);
  }
  show(s: FamScreen): void {
    this.bus.stopAll(); this.screen.set(s);
    document.documentElement.classList.toggle('fam-on', !!s);
  }
}

/** The name step (Sani 2026-11-23): an online check plugs in behind this one switch; off, nothing leaves the phone. */
const NAME_ONLINE = false;
/** The name step never takes longer than this; the child is already in, it only decides whether a name gets set. */
const NAME_WAIT_MS = 6000;
/** A rough Hausa/English sound key (the names test's free.py): letters folded to how they sound, doubles and h after consonants dropped. */
function soundKey(text: string): string {
  let s = text.toLowerCase().replace(/'/g, '');
  const FOLDS: [string, string][] = [['ph', 'f'], ['ck', 'k'], ['q', 'k'], ['c', 'k'], ['x', 'ks'], ['z', 's'], ['ee', 'i'], ['ea', 'i'], ['oo', 'u'], ['ou', 'u'], ['y', 'i'], ['w', 'u'], ['e', 'i'], ['o', 'u'], ['dh', 'd'], ['th', 't'], ['kh', 'k'], ['gh', 'g'], ['sh', 'S'], ['ch', 'S'], ['j', 'J'], ['ts', 'S']];
  for (const [A, B] of FOLDS) s = s.split(A).join(B);
  return s.replace(/([bdfgklmnprst])h/g, '$1').replace(/[^a-zSJ]/g, '').replace(/(.)\1+/g, '$1');
}
function editDistance(a: string, b: string): number {
  const D = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = D[0]; D[0] = i;
    for (let j = 1; j <= b.length; j++) { const T = D[j]; D[j] = Math.min(D[j] + 1, D[j - 1] + 1, prev + (a[i - 1] !== b[j - 1] ? 1 : 0)); prev = T; }
  }
  return D[b.length];
}
/** The bank name whose sound key is closest to what free listening heard. */
function nearestName(heard: string, keys: string[]): string | null {
  const T = soundKey(heard.replace(/\s+/g, '')); if (!T) return null;
  let best: string | null = null, bestD = Infinity;
  for (const K of keys) { const SK = soundKey(K), DD = editDistance(T, SK) / Math.max(T.length, SK.length); if (DD < bestD) { bestD = DD; best = K; } }
  return best;
}
