import { Injectable, inject, signal } from '@angular/core';
import { ClipsService } from '../clips/clips.service';
import { WordsService } from '../clips/words.service';
import { IdentityService } from '../identity/identity.service';
import { SpeechService } from '../speech/speech.service';
import { LANG } from '../lang/lang';
import { FAMILY } from '../edition';
import { bi, t } from '../lang/t';
import { FileSpec, getFile, partly, wake } from './pieces';
import { follow, handOver } from './bg-fetch';

export interface Piece { id: 'speech' | 'face' | 'names' | 'pictures'; ha: string; en: string; heavy: boolean; dl?: () => Promise<'skip' | void>; prep?: () => Promise<void>; }
type St = 'wait' | 'busy' | 'ok' | 'skip' | 'fail';

/**
 * First visit: everything is fetched, like a game install — the small login files first, then the two engines
 * with byte counts, then at most 20 s of setup. Later visits read from the device's cache and open in seconds.
 * Every model file is kept in Cache Storage; the recogniser is always built from those files, never an older copy.
 */
@Injectable({ providedIn: 'root' })
export class LoaderService {
  private readonly clips = inject(ClipsService);
  private readonly words = inject(WordsService);
  private readonly identity = inject(IdentityService);
  private readonly speech = inject(SpeechService);
  private readonly PREP_MAX = 20000;
  private readonly CACHE = 'kratu-models-1';
  private dl: Record<string, St> = {}; private prep: Record<string, St> = {}; private bytes: Record<string, { got: number; total: number }> = {};
  private errs: Record<string, string> = {}; private ptext: Record<string, string> = {}; private fails = 0; private samples: [number, number][] = [];
  private speechFiles: Record<string, ArrayBuffer> | null = null; private faceBlobs: { blobs: Record<string, ArrayBuffer | ArrayBuffer[]>; kinds?: Record<string, unknown>; cfg?: Record<string, unknown> } | null = null;
  private resolveDone!: () => void;
  readonly done = new Promise<void>((r) => { this.resolveDone = r; });
  readonly times: Record<string, number> = {};

  readonly finished = signal(false);
  readonly failed = signal(false);
  readonly stage = signal<'names' | 'download' | 'wait' | 'wake' | 'ready' | 'fail'>('names');
  readonly step = signal(1);
  readonly headHa = signal(t('Ana shirya Kratu…'));
  readonly headEn = signal('Getting ready · after this it works without internet');
  readonly bubbleHa = signal(t('Ina zuwa…'));
  readonly bubbleEn = signal('Coming…');
  readonly pct = signal(0);
  readonly eta = signal('');
  readonly noteHa = signal('');
  readonly noteEn = signal('');
  readonly showSkip = signal(false);
  /** (Sani 2026-11-24) no internet: the download waits and carries on by itself when it is back. */
  readonly netWait = signal(false);
  /** A half-done download was picked up where it stopped ("Carrying on where we stopped"). */
  readonly resumed = signal(false);
  private pctMax = 0;
  private planned: Promise<void> | null = null;
  readonly chips = signal<{ id: string; label: string; text: string; state: St }[]>([]);
  readonly letters = signal<boolean[]>([false, false, false, false, false]);

  readonly pieces: Piece[] = [
    { id: 'speech', ha: 'Murya', en: 'voice', heavy: true,
      dl: async () => { if (!(await this.speech.script())) return 'skip'; this.speechFiles = await this.fetchSpeechFiles(); return undefined; },
      prep: () => this.prepSpeech() },
    { id: 'face', ha: 'Fuska', en: 'face', heavy: true,
      dl: async () => { if (!this.identity.present()) return 'skip'; await this.fetchFaceModels(); return undefined; },
      prep: async () => { this.prog('face', bi('ana tadawa', 'starting')); const o = this.faceBlobs; this.faceBlobs = null; await this.identity.init(o?.blobs, o?.kinds, o?.cfg); this.prog('face', bi('a shirye', 'ready') + ' · ' + (this.identity.model() || '')); } },
    { id: 'names', ha: 'Sunaye', en: 'names', heavy: false,
      dl: async () => { await this.clips.load(); await this.words.load(); if (!LANG.namesBank || FAMILY) return 'skip';   // the family build types names, never matches them   // the bank is Hausa TTS: another language's build says the name in the child's own voice
        const r = await fetch('names_bank_expanded.json'); if (r.status === 404) return 'skip'; if (!r.ok) throw new Error('names ' + r.status); (window as any).KRATU_BANK = await r.json(); return undefined; } },
    { id: 'pictures', ha: 'Hotuna', en: 'pictures', heavy: false,
      dl: () => this.fetchMedia(),
      prep: async () => { await (document.fonts?.ready ?? Promise.resolve()); const first = Object.values(this.words.cats()).slice(0, 4).flatMap((c) => c.slice(0, 2)); await Promise.all(first.filter((w) => w.img).map((w) => new Promise<void>((res) => { const im = new Image(); im.onload = im.onerror = () => res(); im.src = w.img!; }))); } },
  ];

  constructor() { this.speech.filesProvider = () => this.fetchSpeechFiles(); }

  run(): Promise<void> { this.times['t0'] = Math.round(performance.now()); this.chips.set(this.pieces.filter((p) => !(FAMILY && p.id === 'face')).map((p) => ({ id: p.id, label: bi(p.ha, p.en), text: '', state: 'wait' }))); this.round(); return this.done; }
  retry(): void { if (this.netWait()) { wake(); return; } this.round(); }
  skip(): void { this.finish(); }

  private async round(): Promise<void> {
    this.failed.set(false); this.note('', ''); this.paint();
    if (!this.planned) this.planned = this.planTotals(); await this.planned;
    const small = this.pieces.filter((p) => !p.heavy && !this.dlDone(p)), heavy = this.pieces.filter((p) => p.heavy && !this.dlDone(p)), preps: Promise<void>[] = [];
    await Promise.all(small.map((p) => this.runDl(p).then(() => { preps.push(this.runPrep(p)); }, () => undefined)));
    if (this.showFail(small)) return;
    if (heavy.length) await this.handOverHeavy(heavy);
    for (const p of heavy) { let tries = 0; for (;;) { tries++; try { await this.runDl(p); preps.push(this.runPrep(p)); break; } catch { if (tries >= 3) break; this.prog(p.id, bi('sake gwadawa', 'retrying')); await new Promise((r) => setTimeout(r, 3000)); } } }
    if (this.showFail(heavy)) return;
    this.paint();
    const timer = setTimeout(() => this.finish(), this.PREP_MAX);
    await Promise.all(preps); clearTimeout(timer); setTimeout(() => this.finish(), 300);
  }
  private showFail(list: Piece[]): boolean {
    const bad = list.filter((p) => this.dl[p.id] === 'fail'); if (!bad.length) return false;
    this.fails++; this.failed.set(true); this.stage.set('fail'); this.step.set(0);
    this.headHa.set(t('Wani abu bai zo ba')); this.headEn.set('Something did not load: ' + bad.map((p) => p.en + ' (' + (this.errs[p.id] || '?') + ')').join(', ') + ' · check the connection, then try again');
    this.bubbleHa.set(t('Kai!')); this.bubbleEn.set('Oh no'); if (this.fails >= 2) this.showSkip.set(true); return true;
  }
  private finish(): void { if (this.finished()) return; this.times['finish'] = Math.round(performance.now()); this.finished.set(true); this.paint(); setTimeout(() => this.resolveDone(), 900); }
  private dlDone(p: Piece): boolean { return this.dl[p.id] === 'ok' || this.dl[p.id] === 'skip'; }
  private async runDl(p: Piece): Promise<void> {
    if (!p.dl) { this.dl[p.id] = 'skip'; this.paint(); return; }
    this.dl[p.id] = 'busy'; this.times[p.id + '.dl0'] = Math.round(performance.now()); this.paint();
    try { const r = await p.dl(); this.dl[p.id] = r === 'skip' ? 'skip' : 'ok'; this.times[p.id + '.dl1'] = Math.round(performance.now()); this.prog(p.id, /saved|ajiye/.test(this.ptext[p.id] || '') ? this.ptext[p.id] : ''); this.paint(); }
    catch (e: any) { this.dl[p.id] = 'fail'; this.errs[p.id] = e?.message || String(e); this.prog(p.id, ''); console.warn('Kratu loader:', p.id, this.errs[p.id]); this.paint(); throw e; }
  }
  private async runPrep(p: Piece): Promise<void> {
    if (!p.prep || this.prep[p.id] === 'ok' || this.prep[p.id] === 'busy') return;
    this.prep[p.id] = 'busy'; this.times[p.id + '.prep0'] = Math.round(performance.now()); this.paint();
    try { await p.prep(); this.prep[p.id] = 'ok'; this.times[p.id + '.prep1'] = Math.round(performance.now()); }
    catch (e: any) { this.prep[p.id] = 'fail'; this.errs[p.id] = e?.message || String(e); console.warn('Kratu loader (background):', p.id, this.errs[p.id]); }
    this.paint();
  }
  private prog(id: string, text: string): void { this.ptext[id] = text || ''; this.chips.update((cs) => cs.map((c) => c.id === id ? { ...c, text: this.ptext[id] } : c)); }
  private note(ha: string, en: string): void { this.noteHa.set(ha); this.noteEn.set(en); }
  private stageSet(key: 'names' | 'download' | 'wake' | 'ready', n: number, ha: string, en: string, bha: string, ben: string): void { this.stage.set(key); this.step.set(n); this.headHa.set(t(ha)); this.headEn.set(t(en)); this.bubbleHa.set(t(bha)); this.bubbleEn.set(ben); }
  private paint(): void {
    let got = 0, total = 0, frac = 0, n = 0;
    const letters = this.pieces.map((p) => { const b = this.bytes[p.id]; if (b?.total) { got += this.dlDone(p) ? b.total : Math.min(b.got, b.total); total += b.total; } const f = this.dlDone(p) ? 1 : (b?.total ? Math.min(0.98, b.got / b.total) : 0); n++; frac += f; return this.dlDone(p); });
    this.letters.set([...letters, this.finished()]);   // four pieces light K R A T; the U lights when everything is ready — the word was stuck at "Krat" (Sani 2026-09-23)
    this.chips.update((cs) => cs.map((c) => { const d = this.dl[c.id] || 'wait', p = this.prep[c.id] || 'wait'; const done = d === 'ok' || d === 'skip'; return { ...c, state: done ? (p === 'fail' ? 'fail' : 'ok') : (d === 'fail' ? 'fail' : d === 'busy' ? 'busy' : 'wait') }; }));
    const prepsAll = this.pieces.filter((p) => p.prep), prepsDone = prepsAll.filter((p) => this.prep[p.id] === 'ok').length;
    const dlPart = total ? got / total : (n ? frac / n : 0), allDl = this.pieces.every((p) => this.dlDone(p));
    let pct = Math.round((allDl ? 0.9 : 0.9 * dlPart) * 100 + (prepsAll.length ? 10 * prepsDone / prepsAll.length : 10)); if (this.finished()) pct = 100; pct = Math.max(this.pctMax, Math.min(100, pct)); this.pctMax = pct; this.pct.set(pct);
    if (this.failed()) return;
    const small = this.pieces.filter((p) => !p.heavy), heavy = this.pieces.filter((p) => p.heavy);
    if (this.netWait() && !this.finished()) {
      // (Sani 2026-11-24) no internet: Laila rests, the bar keeps what is in, and it carries on by itself
      this.stage.set('wait'); this.headHa.set(t('No internet just now. I’ll carry on by myself when it’s back.')); this.headEn.set('');
      this.bubbleHa.set(t('Waiting for the internet…')); this.bubbleEn.set(''); this.eta.set(''); this.showSkip.set(true); return;
    }
    if (this.finished()) { this.stageSet('ready', 0, 'An shirya! · Ready', 'Laila is ready · everything is on this tablet now', 'Mu fara!', 'Let’s start'); this.eta.set(''); }
    else if (!small.every((p) => this.dlDone(p))) { this.stageSet('names', 1, 'Ana ɗaukar sunaye da hotuna…', 'Getting the names and pictures', 'Ina zuwa…', 'Coming…'); }
    else if (!heavy.every((p) => this.dlDone(p))) {
      const cur = heavy.find((p) => !this.dlDone(p))!, b = this.bytes[cur.id] || { got: 0, total: 0 }; const mb = b.total ? Math.round(b.got / 1048576) + ' / ' + Math.round(b.total / 1048576) + ' MB' : '';
      if (cur.id === 'speech') this.stageSet('download', 2, 'Ana ɗaukar muryar Laila…', 'Downloading Laila’s voice' + (mb ? ' · ' + mb : ''), 'Ina koyon magana…', 'Learning to talk…');
      else this.stageSet('download', 3, 'Ana ɗaukar idanun Laila…', 'Downloading Laila’s eyes' + (mb ? ' · ' + mb : '') + ' · once only, then it stays on this tablet', 'Ina koyon gani…', 'Learning to see…');
      if (b.total) this.etaFrom(got, total);
    } else { this.stageSet('wake', 4, 'Ana tada Laila…', 'Waking Laila up · a few seconds', 'Ina zuwa!', 'Almost there'); this.eta.set(''); }
  }
  private etaFrom(got: number, total: number): void {
    const now = Date.now(); this.samples.push([now, got]); while (this.samples.length > 2 && now - this.samples[0][0] > 6000) this.samples.shift();
    if (this.samples.length < 2 || now - this.samples[0][0] < 1500 || !total) { this.eta.set(''); return; }
    const rate = (got - this.samples[0][1]) / ((now - this.samples[0][0]) / 1000); if (rate <= 0) { this.eta.set(''); return; }
    const left = (total - got) / rate; const s5 = Math.round(left / 5) * 5, min = Math.max(1, Math.round(left / 60));
    this.eta.set(left < 8 ? '' : left < 90 ? t('kimanin daƙiƙa') + ` ${s5} · about ${s5} seconds left` : t('kimanin minti') + ` ${min} · about ${min} minute${min > 1 ? 's' : ''} left`);
  }

  // ---- downloads: every file through Cache Storage, with a byte count and a stall guard
  // ---- downloads (Sani 2026-11-24): piece by piece, fingerprinted, waiting through a lost connection (pieces.ts)
  /** What the downloads tell the screen: waiting for the internet, or carrying on a half-done download. */
  private readonly NET = { waiting: (ON: boolean) => { this.netWait.set(ON); this.paint(); }, resumed: () => this.resumed.set(true) };
  /**
   * Every piece's size before anything comes (Sani 2026-11-24, point 7): the bar is then one sum from the start and never
   * jumps when a piece's size becomes known. Pieces that turn out not to be needed count as done.
   */
  private async planTotals(): Promise<void> {
    try {
      const [S, M] = await Promise.all([this.speechSpecs(), this.getJSON('assets/media.json')]);
      if (S) this.bytes['speech'] = { got: 0, total: S.specs.reduce((A, F) => A + F.bytes, 0) };
      if (M?.total) this.bytes['pictures'] = { got: 0, total: M.total };
      if (!FAMILY && this.identity.present()) { const F = await this.faceSpecs(); if (F) this.bytes['face'] = { got: 0, total: F.plan.reduce((A, X) => A + X.spec.bytes, 0) }; }
      for (const F of S?.specs || []) if (await partly(F)) { this.resumed.set(true); break; }
    } catch { /* the pieces report their own sizes as they go */ }
    this.paint();
  }
  /**
   * Android Chrome (Sani 2026-11-24, point 1): the heavy files are handed to the phone, which keeps downloading with the
   * tab closed. The page follows its progress, then picks the files up; anything the phone did not finish comes in pieces.
   */
  private async handOverHeavy(heavy: Piece[]): Promise<void> {
    const PARTS: { id: string; specs: FileSpec[] }[] = [];
    for (const P of heavy) {
      if (P.id === 'speech') { const S = await this.speechSpecs(); if (S) PARTS.push({ id: 'speech', specs: S.specs }); }
      if (P.id === 'face' && this.identity.present()) { const F = await this.faceSpecs(); if (F) PARTS.push({ id: 'face', specs: F.plan.map((X) => X.spec) }); }
    }
    const ALL = PARTS.flatMap((X) => X.specs); if (!ALL.length) return;
    const JOB = await handOver('kratu-models', ALL, t('Getting Laila ready')); if (!JOB) return;
    await follow(JOB, (DOWN) => {
      let LEFT = DOWN;
      for (const X of PARTS) { const TOT = X.specs.reduce((A, F) => A + F.bytes, 0), G = Math.max(0, Math.min(TOT, LEFT)); LEFT -= G; this.bytes[X.id] = { got: G, total: TOT }; this.prog(X.id, Math.round(G / 1048576) + ' / ' + Math.round(TOT / 1048576) + ' MB'); }
      this.netWait.set(!navigator.onLine); this.paint();
    });
    this.netWait.set(false);
  }
  private async getJSON(url: string): Promise<any | null> { const r = await fetch(url); if (r.status === 404 || !/json/i.test(r.headers.get('content-type') || '')) return null; if (!r.ok) throw new Error(url + ' ' + r.status); return r.json(); }
  /** The speech model's files, as the loader downloads them (packed, fingerprinted). */
  private async speechSpecs(): Promise<{ specs: FileSpec[]; paths: string[] } | null> {
    const MAN = await this.getJSON('vosk-model/manifest.json'); if (!MAN?.files) return null;
    const GZ = typeof DecompressionStream !== 'undefined' && MAN.files.every((F: any) => F.gz);
    return {
      specs: MAN.files.map((F: any) => ({ url: 'vosk-model/' + (GZ ? F.gz : F.path), bytes: GZ ? F.gzsize : F.size, raw: F.size || 0, gz: GZ, sha: GZ ? F.sha256 : undefined, parts: GZ ? F.pieces : undefined })),
      paths: MAN.files.map((F: any) => F.path),
    };
  }
  private async fetchSpeechFiles(): Promise<Record<string, ArrayBuffer> | null> {
    const S = await this.speechSpecs(); if (!S) return null;
    const TOTAL = S.specs.reduce((A, F) => A + F.bytes, 0); let got = 0; const FILES: Record<string, ArrayBuffer> = {};
    const SHOW = () => { this.bytes['speech'] = { got, total: TOTAL }; this.prog('speech', Math.round(got / 1048576) + ' / ' + Math.round(TOTAL / 1048576) + ' MB'); this.paint(); };
    for (let I = 0; I < S.specs.length; I++) {
      const F = S.specs[I]; let last = 0;
      FILES[S.paths[I]] = await getFile(F, (G) => { got += G - last; last = G; SHOW(); }, this.NET);
      got += F.bytes - last; SHOW();
    }
    return FILES;
  }
  private async prepSpeech(): Promise<void> {
    const t0 = Date.now(); const tick = setInterval(() => this.prog('speech', (this.speechFiles ? bi('ana tadawa', 'starting') + ' · ' : bi('ana buɗewa', 'unpacking') + ' · ') + Math.round((Date.now() - t0) / 1000) + ' s'), 1000);
    let kicked = false, lastWhy = '';
    try {
      await new Promise<void>((res, rej) => { const start = Date.now(); const w = () => { if (this.speech.ready()) { res(); return; } const st = this.speech.state(); if (st === 'failed') { lastWhy = this.speech.error(); if (kicked) { rej(new Error(lastWhy || 'failed')); return; } kicked = true; this.speech.retry(this.speechFiles); this.speechFiles = null; } else if (st === 'idle') { this.speech.loadModel(this.speechFiles); this.speechFiles = null; } if (Date.now() - start > 600000) { rej(new Error('timeout')); return; } setTimeout(w, 250); }; w(); });
      this.prog('speech', bi('a shirye', 'ready'));
    } finally { clearInterval(tick); }
  }
  /**
   * Every clip, picture and film, counted while the child watches the bar (Sani 2026-09-23). The service worker fetches
   * them (its prefetch is retried across launches and survives a half-finished install); the loader just watches its cache
   * fill, so nothing is downloaded twice and the app only says it is ready when the tablet really holds the lot.
   * No worker (a dev build, or one that never takes over): the files are fetched here instead so the app still works.
   */
  private async fetchMedia(): Promise<'skip' | void> {
    const man = await this.getJSON('assets/media.json');
    if (!man?.files?.length) return 'skip';
    const total: number = man.total, size = new Map<string, number>(man.files.map((f: any) => [new URL(f.path, document.baseURI).href, f.size]));
    let got = 0;
    const show = () => { this.bytes['pictures'] = { got, total }; this.prog('pictures', Math.round(got / 1048576) + ' / ' + Math.round(total / 1048576) + ' MB'); this.paint(); };
    show();
    const held = async (): Promise<number> => {
      if (typeof caches === 'undefined') return -1;
      const names = (await caches.keys()).filter((n) => /assets:media:cache/.test(n));
      if (!names.length) return -1;
      const seen = new Set<string>();
      for (const n of names) for (const r of await (await caches.open(n)).keys()) if (size.has(r.url)) seen.add(r.url);
      let bytes = 0; seen.forEach((u) => { bytes += size.get(u) || 0; });
      return bytes;
    };
    const t0 = Date.now(); let stuck = 0, last = -1;
    for (;;) {
      const bytes = await this.swDriving() ? await held() : -1;
      if (bytes < 0) break;                                   // no worker: fall through and fetch them here
      got = bytes; show();
      if (got >= total * 0.999) return;                       // the tablet holds every file
      stuck = bytes === last ? stuck + 1 : 0; last = bytes;
      if (Date.now() - t0 > 240000 || stuck > 40) break;      // it is not coming: fetch the rest ourselves
      await new Promise((r) => setTimeout(r, 300));
    }
    const queue: { path: string; size: number }[] = man.files.slice(); got = 0; show();
    await Promise.all(Array.from({ length: 6 }, async () => {
      for (;;) {
        const f = queue.shift(); if (!f) return;
        try { await (await fetch(f.path)).arrayBuffer(); } catch { /* one missing file must not stop the install */ }
        got += f.size; show();
      }
    }));
    this.prog('pictures', bi('a shirye', 'ready'));
  }
  /** Resolves true once the service worker controls this page, false if it does not take over. */
  private swDriving(): Promise<boolean> {
    const sw = navigator.serviceWorker;
    if (!sw) return Promise.resolve(false);
    if (sw.controller) return Promise.resolve(true);
    return Promise.race([
      sw.ready.then(() => sw.controller ? true : new Promise<boolean>((r) => sw.addEventListener('controllerchange', () => r(true), { once: true }))),
      new Promise<boolean>((r) => setTimeout(() => r(!!sw.controller), 10000)),
    ]).catch(() => false);
  }
  /**
   * A runtime we have stopped shipping would otherwise sit in Cache Storage for good. The tablets already in the field
   * hold the old 5 MB WebGPU build, so without this the upgrade costs them 8.8 MB of storage instead of saving 1.5:
   * they download the new runtime and keep the old one beside it. Swept before the download, not after, so a tablet
   * near its quota has the room free when it needs it (Sani 2026-09-30).
   */
  private async sweepRuntimes(keep: string): Promise<void> {
    try {
      if (typeof caches === 'undefined') return;
      const c = await caches.open(this.CACHE), want = new URL(keep, document.baseURI).href;
      for (const r of await c.keys()) if (r.url.indexOf('/models/ort/') >= 0 && r.url.split('?')[0] !== want) await c.delete(r);
    } catch { /* no Cache Storage, or it would not open: there is nothing to sweep */ }
  }
  /** The face and voice engine's files, as the loader downloads them (the runtime, then the models). */
  private async faceSpecs(): Promise<{ MAN: any; plan: { key: string; spec: FileSpec }[]; recCount: number } | null> {
    const MAN = await this.getJSON('models/manifest.json');
    const W = MAN?.wasm || {};
    const WASM: FileSpec = { url: 'models/ort/ort-wasm-simd-threaded.wasm.gz', bytes: W.gzsize || 0, raw: W.size || 0, gz: true, sha: W.sha256, parts: W.pieces };   // the one runtime the ORT glue loads; handed to the worker as bytes
    if (!MAN?.rec) return { MAN, plan: [{ key: 'wasm', spec: WASM }], recCount: 0 };
    // a model whose path ends in .gz is shipped packed: gzsize is the download, size the inflated bytes
    const ONE = (M: { path: string; size: number; gzsize?: number; sha256?: string; pieces?: number }): FileSpec => { const GZ = /\.gz$/.test(M.path); return { url: M.path, bytes: GZ ? (M.gzsize || 0) : M.size, raw: M.size, gz: GZ, sha: M.sha256, parts: M.pieces }; };
    const R = MAN.rec, REC_PARTS: { path: string; size: number; gzsize?: number; sha256?: string; pieces?: number }[] = R.parts ? R.parts : [R];
    return { MAN, plan: [{ key: 'wasm', spec: WASM }, { key: 'det', spec: ONE(MAN.det) }, { key: 'spk', spec: ONE(MAN.spk) }].concat(REC_PARTS.map((PT, I) => ({ key: 'rec' + I, spec: ONE(PT) }))), recCount: REC_PARTS.length };
  }
  private async fetchFaceModels(onp?: (got: number, total: number) => void): Promise<void> {
    const P = await this.faceSpecs(); if (!P) return;
    await this.sweepRuntimes(P.plan[0].spec.url);
    const TOTAL = P.plan.reduce((A, X) => A + X.spec.bytes, 0); let got = 0; const BUFS: Record<string, ArrayBuffer> = {};
    const SHOW = () => { this.bytes['face'] = { got, total: TOTAL }; this.prog('face', Math.round(got / 1048576) + ' / ' + Math.round(TOTAL / 1048576) + ' MB'); this.paint(); onp?.(got, TOTAL); };
    for (const X of P.plan) { let last = 0; BUFS[X.key] = await getFile(X.spec, (G) => { got += G - last; last = G; SHOW(); }, this.NET); got += X.spec.bytes - last; SHOW(); }
    if (!P.recCount) return;
    // the parts go over as they are: the worker joins them on its own thread, so the UI never does a 174 MB copy
    const PARTS = Array.from({ length: P.recCount }, (_, I) => BUFS['rec' + I]);
    this.faceBlobs = { blobs: { wasm: BUFS['wasm'], det: BUFS['det'], recParts: PARTS, spk: BUFS['spk'] }, kinds: P.MAN.kinds, cfg: P.MAN.cfg };
  }

  /**
   * The family build (Sani 2026-11-22): the face models are not part of the first visit. They come after the parent has
   * registered, with their own progress, and stay in Cache Storage; every later launch finds them there. The engine
   * script is put on the page here, so a family that never registers never loads it. Safe to call more than once.
   */
  readonly faceProg = signal<{ got: number; total: number; state: 'idle' | 'busy' | 'ready' | 'fail' }>({ got: 0, total: 0, state: 'idle' });
  private faceRun: Promise<boolean> | null = null;
  loadFace(): Promise<boolean> {
    if (this.faceRun) return this.faceRun;
    this.faceProg.set({ got: 0, total: 0, state: 'busy' });
    this.faceRun = (async () => {
      try {
        await this.engineScript();
        // Android Chrome: the phone takes the download over, so it carries on with the app closed (Sani 2026-11-24)
        const F = await this.faceSpecs();
        const JOB = F ? await handOver('kratu-face', F.plan.map((X) => X.spec), t('Getting Laila ready')) : null;
        if (JOB && F) { const TOT = F.plan.reduce((A, X) => A + X.spec.bytes, 0); await follow(JOB, (DOWN) => { this.netWait.set(!navigator.onLine); this.faceProg.set({ got: Math.min(DOWN, TOT), total: TOT, state: 'busy' }); }); this.netWait.set(false); }
        await this.fetchFaceModels((got, total) => this.faceProg.set({ got, total, state: 'busy' }));
        const O = this.faceBlobs; this.faceBlobs = null; await this.identity.init(O?.blobs, O?.kinds, O?.cfg);
        this.faceProg.update((p) => ({ ...p, state: 'ready' })); return true;
      } catch (e: any) { console.warn('Kratu face:', e?.message || e); this.faceProg.update((p) => ({ ...p, state: 'fail' })); this.faceRun = null; return false; }
    })();
    return this.faceRun;
  }
  private engineScript(): Promise<void> {
    if (this.identity.present()) return Promise.resolve();
    return new Promise((res, rej) => { const S = document.createElement('script'); S.src = 'kratu-id.js'; S.onload = () => res(); S.onerror = () => rej(new Error('kratu-id.js')); document.head.appendChild(S); });
  }
}
