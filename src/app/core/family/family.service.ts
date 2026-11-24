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
 * `name` is empty unless the parent types one or the name step sets a bank name; the child's own clip is kept for
 * voice matching and reading the name, never played as the name (Sani 2026-11-24).
 */
export interface Profile { id: string; name: string; g: Gender; at: number;
  /** The bank name the name step set, and its clip (Laila says it from then on; the clip is kept on the phone). */
  nameKey?: string; nameClip?: string;
  /** PlotWeaver has answered for this child's clip once; the same clip is not sent again (Sani 2026-11-24). */
  nameAsked?: boolean;
  /** (Sani 2026-11-24, "bank, else PlotWeaver once") a written name that is not a bank name, read once by PlotWeaver in
   *  the Hausa voice nearest Laila's and kept on the phone for good (an Opus data URL). Cleared when the name changes. */
  nameVoice?: string;
  /** How many times the name step has read this child's clip (at most NAME_TRIES while no name is set). */
  nameTries?: number;
  /** The child's own "Sunana …" clip is too short to read a name from: the next sign-in asks for the name again and
   *  keeps the new clip. */
  clipShort?: boolean; }   // no animal any more (Sani 2026-11-22: no emoji, no animal step); older saved profiles may still carry one, ignored

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

  /** (Sani 2026-11-24) the details are kept as soon as Register is done, before the code, so a parent who closes the
   *  app there comes back to the code screen. `code` stays '' until the code is set: `ready()` tells the two apart. */
  saveDetails(name: string, email: string, phone: string): void {
    const A = this.account();
    this.saveAccount({ ...(A || { code: '', at: Date.now() }), name: name.trim().replace(/\s+/g, ' '), email: email.trim(), phone: phone.trim() });
  }
  async setAccount(name: string, email: string, phone: string, code: string): Promise<void> {
    this.saveAccount({ ...(this.account() || {}), name: name.trim().replace(/\s+/g, ' '), email: email.trim(), phone: phone.trim(), code: await this.hash(code), at: Date.now() });
  }
  /** Registered and the parent code set: the sign-up is done. */
  ready(): boolean { return !!this.account()?.code; }
  async checkCode(code: string): Promise<boolean> {
    if (this.trying) return /^\d{6}$/.test(code);
    const a = this.account(); return !!a && a.code === await this.hash(code);
  }
  private async hash(code: string): Promise<string> {
    const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('kratu-family:' + code));
    return Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, '0')).join('');
  }
  /** Manage profiles: the parent may type a child's name (optional). Laila says it from the bank when it is a bank
   *  name, else in PlotWeaver's voice, made once; the child's own recording is never played as the name. */
  rename(id: string, name: string): void {
    const NAME = name.replace(/\s+/g, ' ').trim().slice(0, 24);
    // a name typed over the bank one: Laila's bank clip no longer fits, so the child's own clip speaks again
    this.write(this.profiles().map((p) => (p.id === id ? (NAME === p.name ? p : { ...p, name: NAME, nameKey: undefined, nameClip: undefined, nameVoice: undefined }) : p)));
    if (NAME) this.identity.api?.store.upsert({ id, name: NAME }).catch(() => undefined);
  }
  // ---- the name (Sani 2026-11-23): heard offline from the child's clip, set only in strict mode, never sent anywhere
  private namesData: Promise<NamesData | null> | null = null;
  names(): Promise<NamesData | null> {
    if (!this.namesData) this.namesData = fetch('names/phrases.json').then((r) => (r.ok ? r.json() : null)).catch(() => null);
    return this.namesData;
  }
  /** How a bank key is written: "a'isha" → "A'isha". */
  nameOf(key: string): string { return key.charAt(0).toUpperCase() + key.slice(1); }
  async clipUrl(key: string): Promise<string | null> { const D = await this.names(); return D?.file[key] ? 'names/' + D.file[key] + '.ogg' : null; }
  /**
   * The name step (Sani 2026-11-24: "a perfect match is better than a wrong name"). It runs in the background once the
   * child is in, only for a child with no stored name, and gives up after NAME_WAIT_MS; nothing holds the child up.
   *  - Online (NAME_ONLINE): the child's "Sunana …" clip, and nothing else, goes to our own /api/name, which holds the
   *    PlotWeaver key (tools/name-proxy.mjs locally; a small server for release). The words that come back are matched
   *    to the closest bank name by sound. The name is set when that match is near exact (PlotWeaver sure); since Sani's
   *    choice of 24 Nov (22:42) the offline grammar no longer has to agree for a bank name.
   *  - No answer in ONLINE_WAIT_MS, or no network: offline strict only (the grammar hears ONE name and free listening
   *    lands on it too: 23% set, 91% right).
   * Not sure: no name (Laila says just "Sannu"; the child's own clip is never played as the name). Once PlotWeaver has answered for a clip it is not sent
   * again; if it never answered, a later sign-in tries again. A named child's clip is never sent again.
   */
  async nameStep(id: string, later = false): Promise<void> {
    if (this.named(id)) return;
    // (Sani 2026-11-24) while a child has no name, a later sign-in reads their clip again, up to NAME_TRIES times in all
    if (later && !(this.clipOf(id) && (this.profiles().find((p) => p.id === id)?.nameTries ?? 0) < NAME_TRIES)) return;
    if (this.naming.has(id)) return;   // one try at a time per child
    this.naming.add(id);
    try {
      const KEY = await Promise.race([this.findName(id), new Promise<null>((r) => setTimeout(() => r(null), NAME_WAIT_MS))]);
      if (KEY && !this.named(id)) await this.setBankName(id, KEY);
    } finally { this.naming.delete(id); }
  }
  private naming = new Set<string>();
  /** The parent's "Read names online" (Sani 2026-11-24, on unless they turn it off): off, the name step is offline only
   *  and nothing is sent. Kept on this phone. */
  readonly nameOnline = signal<boolean>((() => { try { return localStorage.getItem(K_NAME_ONLINE) !== '0'; } catch { return true; } })());
  setNameOnline(on: boolean): void { this.nameOnline.set(on); try { localStorage.setItem(K_NAME_ONLINE, on ? '1' : '0'); } catch { /* ignore */ } }
  /** Clear name (Sani 2026-11-24): the name goes, typed or set; Laila says just "Sannu" again, and a fresh name can be
   *  worked out at later sign-ins (their clip may be read again, up to NAME_TRIES times). */
  clearName(id: string): void {
    this.write(this.profiles().map((p) => (p.id === id ? { ...p, name: '', nameKey: undefined, nameClip: undefined, nameAsked: undefined, nameVoice: undefined, nameTries: undefined } : p)));
    this.identity.api?.store.upsert({ id, name: '', clearName: true }).catch(() => undefined);
  }
  /** A typed name, or a bank name already set: the child is named, and nothing is asked or sent for them again. */
  private named(id: string): boolean { return !!(this.profiles().find((p) => p.id === id)?.name || this.identity.people().find((x) => x.id === id)?.key); }
  private async findName(id: string): Promise<string | null> {
    try {
      const CLIP = this.clipOf(id), D = await this.names(); if (!CLIP || !D) return null;
      const CTX = new AudioContext({ sampleRate: 16000 });
      const PCM = (await CTX.decodeAudioData(await (await fetch(CLIP)).arrayBuffer())).getChannelData(0); CTX.close().catch(() => undefined);
      // (Sani 2026-11-24: his sign-up clip was 0.7 s) a clip under MIN_CLIP_S cannot carry "Sunana …": nothing is sent
      // and no try is counted; the next sign-in asks for the name again and keeps the new clip
      if (PCM.length < 16000 * MIN_CLIP_S) { this.write(this.profiles().map((p) => (p.id === id ? { ...p, clipShort: true } : p))); console.log('[kratu] name step: clip too short', (PCM.length / 16000).toFixed(1), 's, asking again next time'); return null; }
      this.write(this.profiles().map((p) => (p.id === id ? { ...p, clipShort: undefined, nameTries: (p.nameTries ?? 0) + 1 } : p)));
      const ASK = NAME_ONLINE && this.nameOnline() && navigator.onLine;
      const ONLINE = ASK ? this.onlineText(PCM) : Promise.resolve(null);   // on its way while the phone listens
      const HEARD = heardPhrase(await this.speech.recognizeClip(PCM, 16000, grammarOf(D)));
      const TEXT = await ONLINE;
      if (TEXT !== null) {
        this.write(this.profiles().map((p) => (p.id === id ? { ...p, nameAsked: true } : p)));
        const KEY = onlineName(TEXT, HEARD, D);
        console.log('[kratu] name step: online', KEY ? 'sure (bank name)' : 'not sure, no name');
        return KEY;
      }
      const KEY = await this.offlineName(PCM, HEARD, D);
      console.log('[kratu] name step: offline strict', KEY ? 'sure' : 'not sure, no name');
      return KEY;
    } catch { return null; }
  }
  private async offlineName(PCM: Float32Array, HEARD: string, D: NamesData): Promise<string | null> {
    const ONE = D.phrases[HEARD]; if (!ONE || ONE.length !== 1) return null;
    const FREE = dropSunana(await this.speech.recognizeClip(PCM, 16000, null));
    const KEY = ONE[0], NEAR = nearestName(FREE, Object.keys(D.file));
    return NEAR && sameName(NEAR, KEY, D) ? KEY : null;
  }
  /** The words PlotWeaver heard in the clip (through our /api/name), or null with no answer in ONLINE_WAIT_MS. */
  private async onlineText(PCM: Float32Array): Promise<string | null> {
    try {
      const R = await fetch('api/name', { method: 'POST', headers: { 'Content-Type': 'audio/wav' }, body: wav16k(PCM), signal: AbortSignal.timeout(ONLINE_WAIT_MS) });
      if (!R.ok) return null;
      const J = await R.json(); return typeof J?.text === 'string' ? J.text : null;
    } catch { return null; }
  }
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
  /** A name is stored for this child (typed, or a bank name set): nothing is read for them again. */
  hasName(id: string): boolean { return this.named(id); }
  /** The record's own clip is too short to read a name from: the face screen asks for the name again (face.ts). */
  needsClip(id: string): boolean { return !!this.profiles().find((p) => p.id === id)?.clipShort; }
  /** A new, longer clip was kept for this child: read it for a name (counts as a try). */
  clipReplaced(id: string): void { this.write(this.profiles().map((p) => (p.id === id ? { ...p, clipShort: undefined } : p))); this.nameStep(id, true); }
  /**
   * The name as Laila says it (Sani 2026-11-24, "bank, else PlotWeaver once"): a bank name in Laila's own recording; any
   * other written name in PlotWeaver's Hausa voice, asked for once and kept on the phone; no name, nothing. Never the
   * child's own recording. Answers within `waitMs` or null; a PlotWeaver clip that comes later is still kept for next time.
   */
  async nameSound(id: string, waitMs = NAME_SOUND_WAIT_MS): Promise<string | null> {
    const P = this.profiles().find((p) => p.id === id); if (!P?.name) return null;
    const WORK = (async (): Promise<string | null> => {
      const D = await this.names();
      const KEY = P.nameKey || (D?.file[P.name.toLowerCase()] ? P.name.toLowerCase() : null);
      if (KEY) return P.nameKey === KEY && P.nameClip ? P.nameClip : await this.clipUrl(KEY);
      if (P.nameVoice) return P.nameVoice;
      return this.makeNameVoice(id, P.name);
    })();
    return Promise.race([WORK.catch(() => null), new Promise<null>((r) => setTimeout(() => r(null), waitMs))]);
  }
  private voicing = new Map<string, Promise<string | null>>();
  /** PlotWeaver reads the written name once (through our /api/say; only the name is sent); kept with the child. */
  private makeNameVoice(id: string, name: string): Promise<string | null> {
    const K = id + '|' + name; const ON = this.voicing.get(K); if (ON) return ON;
    const P = (async () => {
      try {
        const R = await fetch('api/say', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: name }), signal: AbortSignal.timeout(SAY_TIMEOUT_MS) });
        if (!R.ok) return null;
        const B = await R.blob(); const URL = await new Promise<string>((ok) => { const F = new FileReader(); F.onload = () => ok(String(F.result)); F.readAsDataURL(B); });
        // kept only if the name is still the same one
        this.write(this.profiles().map((p) => (p.id === id && p.name === name ? { ...p, nameVoice: URL } : p)));
        console.log('[kratu] name voice made once and kept');
        return URL;
      } catch { return null; } finally { this.voicing.delete(K); }
    })();
    this.voicing.set(K, P); return P;
  }
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
    // (Sani 2026-11-24) the browser's own answer decides: a permission taken away later is not hidden by an old note.
    // The saved note is used only where the browser cannot be asked.
    let asked = false;
    try { if (navigator.permissions?.query) { const Q = (n: string) => navigator.permissions.query({ name: n as PermissionName }).then((r) => r.state === 'granted'); ok = (await Q('microphone')) && (await Q('camera')); asked = true; } } catch { /* fall through */ }
    if (!asked) try { ok = localStorage.getItem('kratu_perms') === '1'; } catch { /* ignore */ }
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
    this.watchPerms();
    let started = false; try { started = localStorage.getItem(K_STARTED) === '1'; } catch { /* ignore */ }
    if (!started && !this.profiles().length) { this.show('welcome'); return; }
    // (Sani 2026-11-24) sign-up not finished (no details yet, or no code): Welcome again, and Start goes on from where
    // the parent stopped (Register, or the code screen with the details kept)
    if (!this.ready()) { this.show('welcome'); return; }
    if (this.account()?.faceOk) this.loader.loadFace();   // from Cache Storage after the first time: ready by the time the camera opens
    await this.loaded;
    if (!(await this.micGranted())) { this.show('mic'); return; }
    this.afterSetup();
  }
  /** (Sani 2026-11-24) the microphone and camera are needed before anything, guests too: if either is taken away while
   *  the app is open, or while it was in the background, every screen goes back to the permission screen. */
  private watchPerms(): void {
    const BACK = async () => { if (this.screen() !== 'mic' && this.screen() !== 'welcome' && this.screen() !== 'signin' && !(await this.micGranted())) this.toPerm(); };
    try {
      for (const N of ['microphone', 'camera']) navigator.permissions?.query({ name: N as PermissionName }).then((r) => { r.onchange = () => { if (r.state !== 'granted') BACK(); }; }).catch(() => undefined);
    } catch { /* no permissions API */ }
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') BACK(); });
  }
  /** `?step=` (see `trying`): straight to one real screen, with the sample children and nothing saved. */
  private async tryStep(step: string): Promise<void> {
    this.profiles.set(FamilyService.SAMPLES);
    const kid = step.endsWith('_f') ? FamilyService.SAMPLES[1] : FamilyService.SAMPLES[0];
    this.account.set({ name: 'Parent Example', phone: '0803 000 0000', email: 'parent@example.com', code: 'sample', at: 0 });
    const id = step.replace(/_[mf]$/, '');
    if (id === 'welcome') { this.show('welcome'); return; }
    if (id === 'mic') { this.show('mic'); return; }
    await this.loaded;
    switch (id) {
      case 'signin': this.account.set(null); this.show('signin'); return;
      case 'code-make': this.account.set({ ...this.account()!, code: '' }); this.show('signin'); return;
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
    if (!this.ready()) { this.show('signin'); return; }   // Start -> Register, the parent's sign-up (Sani 2026-11-22), or its code
    this.micThen();
  }
  /** The parent has registered: then the microphone, the loader and the first child. */
  registered(): void { this.loader.loadFace(); this.micThen(); }   // the face models start now, while the parent carries on
  private async micThen(): Promise<void> { if (await this.micGranted()) this.afterMic(); else this.show('mic'); }
  /** The permission screen is done: only once both the microphone and the camera are allowed (Sani 2026-11-24). */
  async afterMic(): Promise<void> {
    this.show(null);   // the loader shows through while it is still working
    await this.loaded;
    if (!this.ready()) { this.show('signin'); return; }
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
    if (!this.identity.ready()) {
      // (Sani 2026-11-24) a short wait shows nothing: "Getting the camera ready" only if the models take over GETREADY_AFTER_MS
      const LOAD = this.loader.loadFace(), FROM = this.screen();
      const QUICK = await Promise.race([LOAD.then(() => true), new Promise<boolean>((r) => setTimeout(() => r(false), GETREADY_AFTER_MS))]);
      if (!QUICK) { this.show('getready'); if (!(await LOAD)) return; if (this.screen() !== 'getready') return; }
      else if (!(await LOAD) || this.screen() !== FROM) return;
    }
    this.show(null); this.router.navigate(['/gender']);
  }
  /** Camera or microphone refused (Sani 2026-11-22: no cards, face and voice are the only way in): the app's own
   *  permission screen asks again, and goes on to boy-or-girl once allowed. */
  toPerm(): void { this.bus.stopAll(); this.session.guest.set(false); this.show('mic'); }   // (Sani 2026-11-24) the one permission screen, 4
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
    // in the background: set only when sure, never holds the child up; a known child with no name is tried again
    // only if PlotWeaver never answered for their clip (Sani 2026-11-24)
    if (isNew) this.nameStep(p.id); else this.nameStep(p.id, true);
    // a known child: "Sannu", then the name when its sound is ready within NAME_SOUND_WAIT_MS (the bank clip, else
    // PlotWeaver's, made once); otherwise just "Sannu". Never the child's own recording (Sani 2026-11-24).
    if (!isNew) { const ID = p.id; this.show(null); this.nameSound(ID).then(async (SRC) => { if ((await this.bus.play('s_sannu')) && SRC) await this.bus.playRaw(SRC); this.session.known.set(true); this.router.navigate(['/welcome']); }); return; }
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

const K_NAME_ONLINE = 'kratu_fam_name_online';
type NamesData = { phrases: Record<string, string[]>; file: Record<string, string>; variants: Record<string, string[]> };
/** The online name check (Sani 2026-11-24: PlotWeaver, through our own /api/name). Off: nothing leaves the phone. */
const NAME_ONLINE = true;
/** (Sani 2026-11-24) the name step reads a child's clip at most this many times while no name is set. */
const NAME_TRIES = 3;
/** A clip shorter than this cannot hold "Sunana …" (Sani's sign-up clip was 0.7 s). */
const MIN_CLIP_S = 1;
/** At the welcome, the name's sound must be ready within this, else Laila says just "Sannu" (Sani 2026-11-24). */
const NAME_SOUND_WAIT_MS = 5000;
/** /api/say gives up after this. */
const SAY_TIMEOUT_MS = 15000;
/** Getting the camera ready shows only when the face models take longer than this. */
const GETREADY_AFTER_MS = 1200;
/** The name step never takes longer than this; the child is already in, it only decides whether a name gets set. */
const NAME_WAIT_MS = 7000;
/** No answer from /api/name by then: the offline strict check decides alone. */
const ONLINE_WAIT_MS = 5000;
/** PlotWeaver is sure when its words sound almost exactly like one bank name (the names test: 76% of clips, 89% right). */
const ONLINE_SURE = 0.15;
const SUNANA_KEY = soundKey('sunana');
/** How the offline grammar hears "Sunana" (the names test's grammar: every phrase alone, and after this). */
const SUNANA_PHRASE = 'su nona';
let GRAMMAR: string[] | null = null;
/** Every bank phrase, alone and after "Sunana", as the names test heard them (the child says "Sunana <name>"). */
function grammarOf(D: NamesData): string[] {
  if (!GRAMMAR) { const P = Object.keys(D.phrases); GRAMMAR = [...P, ...P.map((p) => SUNANA_PHRASE + ' ' + p)]; }
  return GRAMMAR;
}
/** The bank phrase in what the grammar heard: "[unk]" and the "Sunana" before it dropped. */
function heardPhrase(text: string): string {
  const T = text.replace(/\[unk\]/g, ' ').replace(/\s+/g, ' ').trim();
  return T.startsWith(SUNANA_PHRASE + ' ') ? T.slice(SUNANA_PHRASE.length + 1) : T;
}
/** Free listening hears "Sunana" as one to three words ("so now now zubaydah"): the closest such start is dropped. */
function dropSunana(text: string): string {
  const W = text.split(/\s+/).filter(Boolean); let best = 0, bestD = 3;
  for (let k = 1; k <= 3 && k < W.length; k++) { const DD = editDistance(soundKey(W.slice(0, k).join('')), SUNANA_KEY); if (DD < bestD) { bestD = DD; best = k; } }
  return W.slice(best).join(' ');
}
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
function nearestName(heard: string, keys: string[]): string | null { return nearest(heard, keys).key; }
/** The closest bank name by sound, and how far off it is (0 = the same sound key, 1 = nothing alike). */
function nearest(heard: string, keys: string[]): { key: string | null; dist: number } {
  const T = soundKey(heard.replace(/\s+/g, '')); if (!T) return { key: null, dist: 1 };
  let best: string | null = null, bestD = Infinity;
  for (const K of keys) { const SK = soundKey(K), DD = editDistance(T, SK) / Math.max(T.length, SK.length); if (DD < bestD) { bestD = DD; best = K; } }
  return { key: best, dist: bestD };
}
/** One name, or two spellings of it. */
function sameName(a: string, b: string, D: NamesData): boolean { return a === b || (D.variants[a] || []).includes(b); }
/** PlotWeaver's words to a bank name, set only when it is sure AND the offline grammar hearing names the same child
 *  (the names test's 95% setting). "Suna na Aisha." → aisha. */
function onlineName(text: string, heard: string, D: NamesData): string | null {
  let w = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z ]/g, ' ').split(/\s+/).filter(Boolean);
  if (w.length > 2 && editDistance(soundKey(w[0] + w[1]), SUNANA_KEY) <= 1) w = w.slice(2);
  else if (w.length && editDistance(soundKey(w[0]), SUNANA_KEY) <= 2) w = w.slice(1);
  else if (w.length && soundKey(w[0]).startsWith(SUNANA_KEY.slice(0, 4)) && soundKey(w[0]).length > SUNANA_KEY.length) w = [w[0].slice(6), ...w.slice(1)];
  const { key: KEY, dist: DIST } = nearest(w.join(''), Object.keys(D.file));
  if (!KEY || DIST > ONLINE_SURE) return null;
  // (Sani 2026-11-24, 22:42) PlotWeaver alone is enough when its words are a bank name, exactly or nearly (spelling folded),
  // whatever the offline check heard; a name outside the bank is never set here (it needs both to agree, and only bank
  // names can be set by the name step). Still only when no name is stored, never over one.
  if (!(D.phrases[heard] || []).some((x) => sameName(KEY, x, D))) console.log('[kratu] name step: offline heard otherwise; PlotWeaver alone decides (bank name)');
  return KEY;
}
/** The clip as a 16 kHz mono 16-bit WAV, 10 s at most: the one thing the name check sends. */
function wav16k(pcm: Float32Array): Blob {
  const N = Math.min(pcm.length, 16000 * 10), B = new DataView(new ArrayBuffer(44 + N * 2));
  const STR = (o: number, t: string) => { for (let i = 0; i < t.length; i++) B.setUint8(o + i, t.charCodeAt(i)); };
  STR(0, 'RIFF'); B.setUint32(4, 36 + N * 2, true); STR(8, 'WAVE'); STR(12, 'fmt '); B.setUint32(16, 16, true); B.setUint16(20, 1, true); B.setUint16(22, 1, true);
  B.setUint32(24, 16000, true); B.setUint32(28, 32000, true); B.setUint16(32, 2, true); B.setUint16(34, 16, true); STR(36, 'data'); B.setUint32(40, N * 2, true);
  for (let i = 0; i < N; i++) B.setInt16(44 + i * 2, Math.max(-1, Math.min(1, pcm[i])) * 0x7fff, true);
  return new Blob([B.buffer], { type: 'audio/wav' });
}
