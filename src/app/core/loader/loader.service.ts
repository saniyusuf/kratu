import { Injectable, inject, signal } from '@angular/core';
import { ClipsService } from '../clips/clips.service';
import { WordsService } from '../clips/words.service';
import { IdentityService } from '../identity/identity.service';
import { SpeechService } from '../speech/speech.service';

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
  private speechFiles: Record<string, ArrayBuffer> | null = null; private faceBlobs: { blobs: Record<string, ArrayBuffer | ArrayBuffer[]> } | null = null;
  private resolveDone!: () => void;
  readonly done = new Promise<void>((r) => { this.resolveDone = r; });
  readonly times: Record<string, number> = {};

  readonly finished = signal(false);
  readonly failed = signal(false);
  readonly stage = signal<'names' | 'download' | 'wake' | 'ready' | 'fail'>('names');
  readonly step = signal(1);
  readonly headHa = signal('Ana shirya Kratu…');
  readonly headEn = signal('Getting ready · after this it works without internet');
  readonly bubbleHa = signal('Ina zuwa…');
  readonly bubbleEn = signal('Coming…');
  readonly pct = signal(0);
  readonly eta = signal('');
  readonly noteHa = signal('');
  readonly noteEn = signal('');
  readonly showSkip = signal(false);
  readonly chips = signal<{ id: string; label: string; text: string; state: St }[]>([]);
  readonly letters = signal<boolean[]>([false, false, false, false, false]);

  readonly pieces: Piece[] = [
    { id: 'speech', ha: 'Murya', en: 'voice', heavy: true,
      dl: async () => { if (!this.speech.present()) return 'skip'; this.speechFiles = await this.fetchSpeechFiles(); return undefined; },
      prep: () => this.prepSpeech() },
    { id: 'face', ha: 'Fuska', en: 'face', heavy: true,
      dl: async () => { if (!this.identity.present()) return 'skip'; await this.fetchFaceModels(); return undefined; },
      prep: async () => { this.prog('face', 'ana tadawa · starting'); const o = this.faceBlobs; this.faceBlobs = null; await this.identity.init(o?.blobs); this.prog('face', 'a shirye · ready · ' + (this.identity.model() || '')); } },
    { id: 'names', ha: 'Sunaye', en: 'names', heavy: false,
      dl: async () => { await this.clips.load(); await this.words.load(); const r = await fetch('names_bank_expanded.json'); if (r.status === 404) return 'skip'; if (!r.ok) throw new Error('names ' + r.status); (window as any).KRATU_BANK = await r.json(); return undefined; } },
    { id: 'pictures', ha: 'Hotuna', en: 'pictures', heavy: false,
      prep: async () => { await (document.fonts?.ready ?? Promise.resolve()); const first = Object.values(this.words.cats()).slice(0, 4).flatMap((c) => c.slice(0, 2)); await Promise.all(first.filter((w) => w.img).map((w) => new Promise<void>((res) => { const im = new Image(); im.onload = im.onerror = () => res(); im.src = w.img!; }))); } },
  ];

  constructor() { this.speech.filesProvider = () => this.fetchSpeechFiles(); }

  run(): Promise<void> { this.times['t0'] = Math.round(performance.now()); this.chips.set(this.pieces.map((p) => ({ id: p.id, label: p.ha + ' · ' + p.en, text: '', state: 'wait' }))); this.round(); return this.done; }
  retry(): void { this.round(); }
  skip(): void { this.finish(); }

  private async round(): Promise<void> {
    this.failed.set(false); this.note('', ''); this.paint();
    const small = this.pieces.filter((p) => !p.heavy && !this.dlDone(p)), heavy = this.pieces.filter((p) => p.heavy && !this.dlDone(p)), preps: Promise<void>[] = [];
    await Promise.all(small.map((p) => this.runDl(p).then(() => { preps.push(this.runPrep(p)); }, () => undefined)));
    if (this.showFail(small)) return;
    for (const p of heavy) { let tries = 0; for (;;) { tries++; try { await this.runDl(p); preps.push(this.runPrep(p)); break; } catch { if (tries >= 3) break; this.prog(p.id, 'sake gwadawa · retrying'); await new Promise((r) => setTimeout(r, 3000)); } } }
    if (this.showFail(heavy)) return;
    this.paint();
    const timer = setTimeout(() => this.finish(), this.PREP_MAX);
    await Promise.all(preps); clearTimeout(timer); setTimeout(() => this.finish(), 300);
  }
  private showFail(list: Piece[]): boolean {
    const bad = list.filter((p) => this.dl[p.id] === 'fail'); if (!bad.length) return false;
    this.fails++; this.failed.set(true); this.stage.set('fail'); this.step.set(0);
    this.headHa.set('Wani abu bai zo ba'); this.headEn.set('Something did not load: ' + bad.map((p) => p.en + ' (' + (this.errs[p.id] || '?') + ')').join(', ') + ' · check the connection, then try again');
    this.bubbleHa.set('Kai!'); this.bubbleEn.set('Oh no'); if (this.fails >= 2) this.showSkip.set(true); return true;
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
  private stageSet(key: 'names' | 'download' | 'wake' | 'ready', n: number, ha: string, en: string, bha: string, ben: string): void { this.stage.set(key); this.step.set(n); this.headHa.set(ha); this.headEn.set(en); this.bubbleHa.set(bha); this.bubbleEn.set(ben); }
  private paint(): void {
    let got = 0, total = 0, frac = 0, n = 0;
    const letters = this.pieces.map((p) => { const b = this.bytes[p.id]; if (b?.total) { got += Math.min(b.got, b.total); total += b.total; } const f = this.dlDone(p) ? 1 : (b?.total ? Math.min(0.98, b.got / b.total) : 0); n++; frac += f; return this.dlDone(p); });
    this.letters.set([...letters, this.finished()]);   // four pieces light K R A T; the U lights when everything is ready — the word was stuck at "Krat" (Sani 2026-09-23)
    this.chips.update((cs) => cs.map((c) => { const d = this.dl[c.id] || 'wait', p = this.prep[c.id] || 'wait'; const done = d === 'ok' || d === 'skip'; return { ...c, state: done ? (p === 'fail' ? 'fail' : 'ok') : (d === 'fail' ? 'fail' : d === 'busy' ? 'busy' : 'wait') }; }));
    const prepsAll = this.pieces.filter((p) => p.prep), prepsDone = prepsAll.filter((p) => this.prep[p.id] === 'ok').length;
    const dlPart = total ? got / total : (n ? frac / n : 0), allDl = this.pieces.every((p) => this.dlDone(p));
    let pct = Math.round((allDl ? 0.9 : 0.9 * dlPart) * 100 + (prepsAll.length ? 10 * prepsDone / prepsAll.length : 10)); if (this.finished()) pct = 100; this.pct.set(pct);
    if (this.failed()) return;
    const small = this.pieces.filter((p) => !p.heavy), heavy = this.pieces.filter((p) => p.heavy);
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
    this.eta.set(left < 8 ? '' : left < 90 ? `kimanin daƙiƙa ${s5} · about ${s5} seconds left` : `kimanin minti ${min} · about ${min} minute${min > 1 ? 's' : ''} left`);
  }

  // ---- downloads: every file through Cache Storage, with a byte count and a stall guard
  private download(url: string, onp: (got: number, total: number) => void, gunzip = false): Promise<ArrayBuffer> {
    const ac = typeof AbortController !== 'undefined' ? new AbortController() : null; let last = Date.now();
    const stall = setInterval(() => { if (Date.now() - last > 30000) { clearInterval(stall); try { ac?.abort(); } catch { /* ignore */ } } }, 1000);
    return fetch(url, ac ? { signal: ac.signal } : {}).then(async (r) => {
      if (!r.ok) throw new Error(url + ' ' + r.status);
      const total = +(r.headers.get('content-length') || 0); let got = 0; const chunks: Uint8Array[] = [];
      if (!r.body) { const b = await r.arrayBuffer(); clearInterval(stall); return b; }
      const rd = r.body.getReader();
      for (;;) { const x = await rd.read(); if (x.done) break; last = Date.now(); got += x.value.length; chunks.push(x.value); onp(got, total); }
      clearInterval(stall);
      const raw = this.concat(chunks);
      // a server may hand a .gz file back already inflated: only inflate what really starts with the gzip magic bytes
      const isGz = raw.byteLength > 2 && new Uint8Array(raw)[0] === 0x1f && new Uint8Array(raw)[1] === 0x8b;
      if (gunzip && isGz && typeof DecompressionStream !== 'undefined') {
        try { const out = await new Response(new Blob([raw]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer(); return out; }
        catch (e) { console.warn('Kratu loader: inflate failed, using the bytes as they are', url, e); }
      }
      return raw;
    }, (e) => { clearInterval(stall); throw new Error(e?.name === 'AbortError' ? url + ' stalled, no data for 30 s' : (e?.message || String(e))); });
  }
  private concat(chunks: Uint8Array[]): ArrayBuffer { let n = 0; chunks.forEach((c) => { n += c.length; }); const out = new Uint8Array(n); let o = 0; chunks.forEach((c) => { out.set(c, o); o += c.length; }); return out.buffer; }
  /** Fetch through Cache Storage. `expect` is the file's true size from its manifest: a short file (a server restart ends a stream cleanly) is never cached and fails the piece, so the retry gets it again. */
  private async cachedFetch(url: string, onp: (got: number) => void, gunzip = false, expect = 0): Promise<ArrayBuffer> {
    let c: Cache | null = null; try { if (typeof caches !== 'undefined') c = await caches.open(this.CACHE); } catch { c = null; }
    if (c) { try { const hit = await c.match(url); if (hit) { const b = await hit.arrayBuffer(); if (!expect || b.byteLength === expect) return b; await c.delete(url); } } catch { /* ignore */ } }
    const buf = await this.download(url, (g) => onp(g), gunzip);
    if (expect && buf.byteLength !== expect) throw new Error(url + ' short: ' + buf.byteLength + ' of ' + expect + ' bytes');
    if (c) { try { await c.put(url, new Response(buf.slice(0), { headers: { 'content-type': 'application/octet-stream' } })); } catch { /* quota */ } }
    return buf;
  }
  private async getJSON(url: string): Promise<any | null> { const r = await fetch(url); if (r.status === 404 || !/json/i.test(r.headers.get('content-type') || '')) return null; if (!r.ok) throw new Error(url + ' ' + r.status); return r.json(); }
  private async fetchSpeechFiles(): Promise<Record<string, ArrayBuffer> | null> {
    const man = await this.getJSON('vosk-model/manifest.json'); if (!man?.files) return null;
    const gz = typeof DecompressionStream !== 'undefined' && man.files.every((f: any) => f.gz);
    const urls: string[] = man.files.map((f: any) => 'vosk-model/' + (gz ? f.gz : f.path)), sizes: number[] = man.files.map((f: any) => gz ? f.gzsize : f.size);
    const total = sizes.reduce((a, b) => a + b, 0); let got = 0; const bufs: Record<string, ArrayBuffer> = {};
    const show = () => { this.bytes['speech'] = { got, total }; this.prog('speech', Math.round(got / 1048576) + ' / ' + Math.round(total / 1048576) + ' MB'); this.paint(); };
    for (let i = 0; i < urls.length; i++) { let last = 0; const buf = await this.cachedFetch(urls[i], (g) => { got += g - last; last = g; show(); }, gz, man.files[i].size || 0); got += sizes[i] - last; show(); bufs[urls[i]] = buf; }
    const files: Record<string, ArrayBuffer> = {}; man.files.forEach((f: any) => { files[f.path] = bufs['vosk-model/' + (gz ? f.gz : f.path)]; }); return files;
  }
  private async prepSpeech(): Promise<void> {
    const t0 = Date.now(); const tick = setInterval(() => this.prog('speech', (this.speechFiles ? 'ana tadawa · starting · ' : 'ana buɗewa · unpacking · ') + Math.round((Date.now() - t0) / 1000) + ' s'), 1000);
    let kicked = false, lastWhy = '';
    try {
      await new Promise<void>((res, rej) => { const start = Date.now(); const w = () => { if (this.speech.ready()) { res(); return; } const st = this.speech.state(); if (st === 'failed') { lastWhy = this.speech.error(); if (kicked) { rej(new Error(lastWhy || 'failed')); return; } kicked = true; this.speech.retry(this.speechFiles); this.speechFiles = null; } else if (st === 'idle') { this.speech.loadModel(this.speechFiles); this.speechFiles = null; } if (Date.now() - start > 600000) { rej(new Error('timeout')); return; } setTimeout(w, 250); }; w(); });
      this.prog('speech', 'a shirye · ready');
    } finally { clearInterval(tick); }
  }
  private async fetchFaceModels(): Promise<void> {
    const man = await this.getJSON('models/manifest.json');
    const wasmUrl = 'models/ort/ort-wasm-simd-threaded.jsep.wasm.gz';   // the one runtime the ORT glue loads (WebGPU or plain wasm backend); shipped gzipped (21 → 5 MB), inflated here, handed to the worker as bytes
    if (!man?.rec) { await this.cachedFetch(wasmUrl, () => undefined, true); return; }
    const R = man.rec;   // one recogniser everywhere: w600k_r50, in three parts (Sani 2026-09-19)
    const recParts: { path: string; size: number }[] = R.parts ? R.parts : [{ path: R.path, size: R.size }];
    const W = man.wasm || {}; const plan = [{ key: 'wasm', url: wasmUrl, size: W.gzsize || 0, raw: W.size || 0, keep: true }, { key: 'det', url: man.det.path, size: man.det.size, raw: man.det.size, keep: true }, { key: 'spk', url: man.spk.path, size: man.spk.size, raw: man.spk.size, keep: true }].concat(recParts.map((pt, i) => ({ key: 'rec' + i, url: pt.path, size: pt.size, raw: pt.size, keep: true })));
    const total = plan.reduce((a, x) => a + x.size, 0); let got = 0; const bufs: Record<string, ArrayBuffer> = {};
    const show = () => { this.bytes['face'] = { got, total }; this.prog('face', Math.round(got / 1048576) + ' / ' + Math.round(total / 1048576) + ' MB'); this.paint(); };
    for (const x of plan) { let last = 0; const buf = await this.cachedFetch(x.url, (g) => { got += g - last; last = g; show(); }, x.key === 'wasm', x.raw); got += x.size - last; show(); if (x.keep) bufs[x.key] = buf; }
    // the parts go over as they are: the worker joins them on its own thread, so the UI never does a 174 MB copy
    const parts = recParts.map((_, i) => bufs['rec' + i]);
    this.faceBlobs = { blobs: { wasm: bufs['wasm'], det: bufs['det'], recParts: parts, spk: bufs['spk'] } };
  }
}
