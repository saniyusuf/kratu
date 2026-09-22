import { Injectable, inject, signal } from '@angular/core';
import { AudioBus } from '../audio/audio-bus.service';
import { WordsService } from '../clips/words.service';

export interface HearOptions {
  /** One expected word (with its aliases) — the grammar is the vocabulary plus this word. */
  target?: string;
  /** Free matcher for word screens: recognised text → the word it counts as, or null. */
  match?: (raw: string) => string | null;
  /** A burst of letters ("D O G"): every letter heard, in order. */
  multi?: boolean;
  /** The word being spelled; a child may say it too and it is ignored. */
  word?: string;
  /** Demo mode: nothing is heard, the expected answer is simulated after the sample clips. */
  auto?: boolean;
  /** For demo mode: the letters or word the sample child "says". */
  say?: string | string[];
}
export interface HearHandle { done: Promise<{ value: string | string[] | null; raw: string }>; stop(): void; }
export interface HeardEntry { t: number; target: string; heard: string; ok: boolean; peak: number; rate?: number; ctx?: string; device?: string; }

declare const Vosk: any;

/**
 * The offline recogniser (Vosk) behind one door. Every lesson calls hear(): the microphone opens, the child speaks,
 * the answer comes back as the word or the letters, and the mic closes. Laila is silent while it is open.
 */
@Injectable({ providedIn: 'root' })
export class SpeechService {
  private readonly bus = inject(AudioBus);
  private readonly words = inject(WordsService);
  private readonly NAMES: Record<string, string> = { A: 'a', B: 'bee', C: 'see', D: 'dee', E: 'e', F: 'ef', G: 'gee', H: 'aitch', I: 'i', J: 'jay', K: 'kay', L: 'el', M: 'em', N: 'en', O: 'o', P: 'pee', Q: 'cue', R: 'ar', S: 'es', T: 'tee', U: 'you', V: 'vee', W: 'double u', X: 'ex', Y: 'why', Z: 'zee' };
  private readonly ALL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  private readonly ALIAS: Record<string, string[]> = { pawpaw: ['paw paw', 'papaya', 'popo'] };
  private model: any = null; private loading = false; private failed = false; private lastErr = '';
  private saved = false; private saveT: ReturnType<typeof setInterval> | null = null; private strikes = 0; private feedErr = 0;
  private ctx: AudioContext | null = null; private stream: MediaStream | null = null; private proc: ScriptProcessorNode | null = null;
  private feeding = false; private rec: any = null; private seq = 0; private peak = 0; private vocabCache: string[] | null = null;
  /** The loader hands over the model's files; a restart fetches them again through this. */
  filesProvider: (() => Promise<Record<string, ArrayBuffer> | null>) | null = null;

  readonly state = signal<'idle' | 'loading' | 'ready' | 'failed'>('idle');
  readonly listening = signal(false);
  readonly preparing = signal(false);
  readonly amp = signal(0);
  readonly fb = signal('');
  readonly isSaved = signal(false);
  readonly heard: HeardEntry[] = [];
  audioInfo: { device?: string; muted?: boolean; ctx?: string; rate?: number } = {};

  ready(): boolean { return !!this.model; }
  error(): string { return this.lastErr; }
  feedErrors(): number { return this.feedErr; }
  present(): boolean { return typeof Vosk !== 'undefined'; }

  loadModel(files?: Record<string, ArrayBuffer> | null): void {
    if (this.model || this.loading || this.failed || typeof Vosk === 'undefined') return;
    this.loading = true; this.state.set('loading');
    const url = new URL('vosk-model.tar.gz', document.baseURI).href;
    let m: any, done = false;
    const ok = () => { if (done) return; done = true; this.model = m; this.loading = false; this.strikes = 0; this.state.set('ready'); try { m.on('saved', (msg: any) => { if (msg?.result) { this.saved = true; this.isSaved.set(true); this.note('engine', 'saved to this tablet'); } }); } catch { /* ignore */ } this.scheduleSave(); };
    const bad = (why?: string) => { if (done) return; done = true; this.loading = false; this.failed = true; this.lastErr = why || 'speech model failed'; this.state.set('failed'); };
    try { m = new Vosk.Model(url, 0, files || null); } catch (e: any) { bad(e?.message); return; }
    m.on('load', (msg: any) => { msg?.result ? ok() : bad('model did not load'); });
    m.on('error', (msg: any) => { bad(msg?.error); });
    try { m.worker.onerror = (e: any) => { bad('worker: ' + (e?.message || 'crashed')); }; } catch { /* ignore */ }
  }
  retry(files?: Record<string, ArrayBuffer> | null): void { this.failed = false; this.lastErr = ''; this.loadModel(files); }
  restart(why: string): void {
    this.note('engine', 'restarted: ' + why);
    try { this.model?.terminate?.(); } catch { /* ignore */ }
    this.model = null; this.loading = false; this.failed = false; this.lastErr = ''; this.strikes = 0; this.saved = false; this.state.set('loading');
    if (this.filesProvider) this.filesProvider().then((f) => this.loadModel(f), () => this.loadModel()); else this.loadModel();
  }
  /** Wipe the voice model copies on this device (the loader's cache and the recogniser's own store). */
  async reset(): Promise<void> {
    try { this.model?.terminate?.(); } catch { /* ignore */ }
    await Promise.all([
      new Promise<void>((r) => { try { const d = indexedDB.deleteDatabase('/vosk'); d.onsuccess = d.onerror = d.onblocked = () => r(); } catch { r(); } }),
      typeof caches !== 'undefined' ? caches.delete('kratu-models-1').then(() => undefined, () => undefined) : Promise.resolve(),
    ]);
    try { localStorage.removeItem('kratu_mic'); } catch { /* ignore */ }
  }
  resetAudio(): void { try { this.stream?.getTracks().forEach((t) => t.stop()); } catch { /* ignore */ } try { this.ctx?.close(); } catch { /* ignore */ } this.stream = null; this.ctx = null; this.proc = null; }

  /** Open the mic for one answer. The handle's stop() closes it early (a tap on a key, leaving the screen). */
  hear(o: HearOptions): HearHandle {
    let resolve!: (v: { value: string | string[] | null; raw: string }) => void;
    const done = new Promise<{ value: string | string[] | null; raw: string }>((r) => { resolve = r; });
    const my = ++this.seq; let finished = false; let tmo: ReturnType<typeof setTimeout> | null = null; let quiet: ReturnType<typeof setTimeout> | null = null;
    const letters: string[] = []; let lastRaw = '';
    const handle: HearHandle = { done, stop: () => { if (finished) return; finished = true; this.seq++; this.closeMic(); } };
    if (o.auto || typeof Vosk === 'undefined' || this.failed) { this.simulate(o, my).then((r) => { if (!finished) { finished = true; resolve(r); } }); return handle; }
    const fin = (L: string | string[] | null, raw: string) => {
      if (finished || my !== this.seq) return;
      finished = true; if (tmo) clearTimeout(tmo); if (quiet) clearTimeout(quiet);
      this.heard.push({ t: Date.now(), target: o.target || (o.multi ? 'letters' : 'word'), heard: raw || '', ok: !!L, peak: +this.peak.toFixed(2), rate: this.ctx?.sampleRate, ctx: this.ctx?.state, device: this.audioInfo.device }); if (this.heard.length > 30) this.heard.shift();
      this.closeMic(); resolve({ value: L, raw: raw || '' });
    };
    const go = async () => {
      await this.bus.micReady(); const ok = await this.ensureAudio();
      if (finished || my !== this.seq) return;
      if (!ok) { finished = true; resolve(await this.simulate(o, my)); return; }
      let gram: string[];
      const addWord = (t: string) => { t = t.toLowerCase(); if (t && gram.indexOf(t) < 0) gram.push(t); const al = this.ALIAS[t]; if (al) al.forEach((a) => a.split(/\s+/).forEach((x) => { if (x && gram.indexOf(x) < 0) gram.push(x); })); };
      if (o.match) { if (!this.vocabCache) this.vocabCache = this.words.vocab(); gram = this.vocabCache.slice(); if (o.target) String(o.target).toLowerCase().split(/\s+/).forEach(addWord); gram.push('[unk]'); }
      else { gram = this.ALL.map((L) => L.toLowerCase()).concat(this.ALL.map((L) => this.NAMES[L])); if (o.word) String(o.word).toLowerCase().split(/\s+/).forEach(addWord); gram.push('[unk]'); }
      try { this.rec = new this.model.KaldiRecognizer(this.ctx!.sampleRate, JSON.stringify(gram)); } catch { this.rec = new this.model.KaldiRecognizer(this.ctx!.sampleRate); }
      this.rec.on('partialresult', (m: any) => { if (finished || my !== this.seq) return; const p = m?.result?.partial || ''; if (p && p !== '[unk]') { lastRaw = p; this.fb.set('“' + p + '”'); } });
      this.rec.on('result', (m: any) => {
        if (finished || my !== this.seq) return;
        let t = String(m?.result?.text || '').replace(/\[unk\]/g, '').trim(); if (!t) return; lastRaw = t;
        if (o.multi) { t.toLowerCase().split(/\s+/).forEach((tok) => { const c = this.classify(tok); if (c) letters.push(c); }); if (quiet) clearTimeout(quiet); quiet = setTimeout(() => fin(null, lastRaw), 900); return; }
        if (o.target) { const tg = String(o.target).toLowerCase(); (this.ALIAS[tg] || []).forEach((a) => { if (t.toLowerCase().indexOf(a) >= 0) t = tg; }); }
        const L = o.match ? o.match(t) : this.classifyPhrase(t);
        fin(L, t);
      });
      this.feeding = true; this.peak = 0; this.bus.setMic(true); this.listening.set(true); this.fb.set('Ina saurara…');
      tmo = setTimeout(() => { if (!lastRaw && this.peak > 0.12) { this.strikes++; if (this.strikes >= 2) setTimeout(() => this.restart('no answer twice while the microphone heard sound'), 50); } else this.strikes = 0; fin(null, lastRaw); }, o.multi ? 10000 : 8000);
    };
    // the multi result: letters are the value
    const origResolve = resolve; resolve = (r) => { origResolve(o.multi ? { value: letters, raw: r.raw } : r); };
    if (!this.model) {
      this.loadModel(); this.preparing.set(true); this.fb.set('Ana shirya murya…'); const t0 = Date.now();
      const wait = () => { if (finished || my !== this.seq) { this.preparing.set(false); return; } if (this.model) { this.preparing.set(false); go(); } else if (this.failed || Date.now() - t0 > 90000) { this.preparing.set(false); finished = true; this.simulate(o, my).then(resolve); } else setTimeout(wait, 250); };
      wait(); return handle;
    }
    go(); return handle;
  }

  /** Demo mode, or no engine: nothing is invented — the demo's own answer plays as if said. */
  private async simulate(o: HearOptions, my: number): Promise<{ value: string | string[] | null; raw: string }> {
    await new Promise((r) => setTimeout(r, o.auto ? 1200 : 1400));
    if (my !== this.seq) return { value: null, raw: '' };
    if (!o.auto) return { value: null, raw: '' };
    if (o.multi) { const ls = Array.isArray(o.say) ? o.say : String(o.say || o.word || '').toUpperCase().split(''); return { value: ls, raw: ls.join(' ') }; }
    const v = Array.isArray(o.say) ? o.say.join(' ') : (o.say || o.target || '');
    return { value: v, raw: v };
  }
  private closeMic(): void {
    this.feeding = false; try { this.rec?.remove(); } catch { /* ignore */ } this.rec = null; this.peak = 0;
    this.listening.set(false); this.preparing.set(false); this.amp.set(0); this.bus.setMic(false);
  }
  private classify(t: string): string | null {
    t = (t || '').toLowerCase().replace(/[^a-z]/g, ''); if (!t) return null;
    for (const L of this.ALL) if (t === L.toLowerCase() || t === this.NAMES[L].replace(/ /g, '')) return L;
    return null;
  }
  private classifyPhrase(text: string): string | null { for (const tok of (text || '').toLowerCase().split(/\s+/)) { const c = this.classify(tok); if (c) return c; } return null; }
  private note(target: string, text: string): void { this.heard.push({ t: Date.now(), target, heard: text, ok: true, peak: 0 }); if (this.heard.length > 30) this.heard.shift(); }
  /** The copy of the model into storage happens only while nobody is speaking: the worker is single-threaded. */
  private scheduleSave(): void {
    if (this.saved || this.saveT) return;
    this.saveT = setInterval(() => { if (this.saved || !this.model) { clearInterval(this.saveT!); this.saveT = null; return; } if (this.feeding || this.rec) return; try { this.model.save?.(); } catch { /* ignore */ } }, 5000);
    document.addEventListener('visibilitychange', () => { if (document.hidden && this.model && !this.saved && !this.feeding) { try { this.model.save?.(); } catch { /* ignore */ } } });
  }
  private ensureAudio(): Promise<boolean> {
    return new Promise((res) => {
      if (this.ctx && this.stream) { if (this.ctx.state === 'suspended') { try { this.ctx.resume(); } catch { /* ignore */ } } res(true); return; }
      if (!navigator.mediaDevices?.getUserMedia) { res(false); return; }
      const want: MediaTrackConstraints = { echoCancellation: true, noiseSuppression: true, channelCount: 1 };
      try { const dev = localStorage.getItem('kratu_mic'); if (dev) want.deviceId = { exact: dev }; } catch { /* ignore */ }
      navigator.mediaDevices.getUserMedia({ video: false, audio: want }).catch(() => navigator.mediaDevices.getUserMedia({ video: false, audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 } })).then((st) => {
        this.stream = st; const ctx = new AudioContext(); this.ctx = ctx; try { ctx.resume(); } catch { /* ignore */ }
        const proc = ctx.createScriptProcessor(4096, 1, 1); this.proc = proc;
        try { const tr = st.getAudioTracks()[0]; this.audioInfo = { device: tr?.label || '?', muted: !!tr?.muted, ctx: ctx.state, rate: ctx.sampleRate }; ctx.onstatechange = () => { this.audioInfo.ctx = ctx.state; }; } catch { /* ignore */ }
        proc.onaudioprocess = (e) => {
          if (!this.feeding || !this.rec) return;
          if (ctx.state === 'suspended') { try { ctx.resume(); } catch { /* ignore */ } }
          try { this.rec.acceptWaveform(e.inputBuffer); } catch { this.feedErr++; }
          try { const d = e.inputBuffer.getChannelData(0); let sum = 0, n = 0; for (let i = 0; i < d.length; i += 32) { sum += d[i] * d[i]; n++; } const amp = Math.min(1, Math.sqrt(sum / n) * 7); if (amp > this.peak) this.peak = amp; this.amp.set(+amp.toFixed(3)); } catch { /* ignore */ }
        };
        ctx.createMediaStreamSource(st).connect(proc); proc.connect(ctx.destination); res(true);
      }).catch(() => res(false));
    });
  }
}
