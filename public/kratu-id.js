/* Kratu identity engine v2 — main-thread API.
   window.KratuID: init() · watch(video, cb) / unwatch() · voiceEmbed(pcm) · pcmFromBlob(blob) · store (IndexedDB, AES-GCM at rest)
   · match({faceVecs, voiceVec, nameKey}) → fused decision with margin.  Falls back gracefully: if init() rejects, KratuID.isReady stays false. */
(function () {
  const cfg = { faceAccept: 0.55, faceMaybe: 0.40, margin: 0.08, voiceAccept: 0.55, voiceWeightHigh: 0.9, voiceWeightLow: 0.15, gapClose: 0.08, gapWide: 0.25, voiceTieBreak: 0.06, nameBonus: 0.10, topK: 3, enrollKeep: 4, recentKeep: 8, perSitting: 2, refreshGapMs: 20 * 3600 * 1000, minFace: 70, blurMin: 25, fps: 5, frameWidth: 640, webgpu: true, modelVer: 'v3-scrfd500m-w600k_r50-campplus' };
  const W = new Worker('kratu-id.worker.js', { type: 'module' });
  let seq = 0; const pend = new Map();
  W.onmessage = (ev) => { const p = pend.get(ev.data.id); if (!p) return; pend.delete(ev.data.id); ev.data.ok ? p.res(ev.data) : p.rej(new Error(ev.data.error)); };
  W.onerror = (e) => { console.error('KratuID worker error', e && e.message); for (const p of pend.values()) p.rej(new Error('identity worker failed to load')); pend.clear(); };
  function call(type, payload, transfer) { return new Promise((res, rej) => { const id = ++seq; pend.set(id, { res, rej }); W.postMessage(Object.assign({ id, type }, payload || {}), transfer || []); }); }

  const K = { cfg, isReady: false, ep: null, ready: null, version: cfg.modelVer };
  K.init = function (o) { if (K.ready) return K.ready; o = o || {}; const opts = { webgpu: cfg.webgpu }; const transfer = [];
    /* the model set and its thresholds come from the page (models/manifest.json: `kinds` and `cfg`), so the family build can run
       YuNet + SFace with SFace's own score scale while the school build keeps today's (Sani 2026-11-22) */
    if (o.kinds) opts.kinds = o.kinds; if (o.cfg) Object.assign(cfg, o.cfg); K.version = cfg.modelVer; if (o.blobs) { opts.blobs = o.blobs; Object.keys(o.blobs).forEach(n => { const b = o.blobs[n];
      if (Array.isArray(b)) b.forEach(x => { if (x && x.byteLength) transfer.push(x); });   /* the recogniser arrives in parts: the worker joins them, so the 174 MB copy never happens on the main thread (Sani 2026-09-19) */
      else if (b && b.byteLength) transfer.push(b); }); }
    K.ready = call('init', { opts }, transfer).then(r => { K.isReady = true; K.ep = r.ep; K.version = r.version; K.recName = r.rec || (r.version || '').split('+')[1] || ''; return r; }).catch(e => { K.ready = null; throw e; }); return K.ready; };   // a failed init may be retried; model bytes handed in by the page are transferred, not copied

  /* ---- frame pump: one frame in flight, ~cfg.fps ---- */
  let watching = null;
  K.watch = function (video, onResult) {
    K.unwatch(); let busy = false, stop = false, lastT = 0;
    async function tick() {
      if (stop) return;
      const now = performance.now();
      if (!busy && video.readyState >= 2 && !video.paused && now - lastT >= 1000 / cfg.fps) {
        busy = true; lastT = now;
        try {
          const scale = Math.min(1, cfg.frameWidth / (video.videoWidth || cfg.frameWidth));
          const bm = await createImageBitmap(video, { resizeWidth: Math.round(video.videoWidth * scale), resizeHeight: Math.round(video.videoHeight * scale) });
          const r = await call('frame', { bitmap: bm, opts: { minFace: cfg.minFace * scale, blurMin: cfg.blurMin } }, [bm]);
          r.scale = scale;                                   // box/kps are in bitmap coords → divide by scale for video coords
          if (r.box && !Array.isArray(r.box)) r.boxVideo = { x: r.box.x / scale, y: r.box.y / scale, width: r.box.width / scale, height: r.box.height / scale };
          if (!stop) onResult(r);
        } catch (e) { if (!stop) onResult({ ok: false, error: e.message, faces: 0 }); }
        busy = false;
      }
      watching = requestAnimationFrame(tick);
    }
    watching = requestAnimationFrame(tick);
    K.unwatch = function () { stop = true; if (watching) cancelAnimationFrame(watching); watching = null; K.unwatch = function () {}; };
  };
  K.unwatch = function () {};

  /* ---- voice ---- */
  K.voiceEmbed = function (pcm) { return call('voice', { pcm }, [pcm.buffer]).then(r => r.emb); };
  K.pcmFromBlob = async function (blob, maxSec) { // decode → mono 16 kHz Float32, trimmed to speech, ≤ maxSec (default 4 s)
    const ctx = new (window.AudioContext || window.webkitAudioContext)(); const buf = await ctx.decodeAudioData(await blob.arrayBuffer()); ctx.close && ctx.close();
    const sr = buf.sampleRate, ch = buf.getChannelData(0), ratio = sr / 16000, L = Math.floor(ch.length / ratio), out = new Float32Array(L);
    for (let i = 0; i < L; i++) { const p = i * ratio, k = Math.floor(p), f = p - k; out[i] = (ch[k] || 0) * (1 - f) + (ch[k + 1] || 0) * f; }
    // trim leading/trailing silence
    const F = 320, nf = Math.floor(L / F), rms = new Float32Array(nf); let mx = 0;
    for (let i = 0; i < nf; i++) { let s = 0; for (let j = i * F; j < (i + 1) * F; j++) s += out[j] * out[j]; rms[i] = Math.sqrt(s / F); if (rms[i] > mx) mx = rms[i]; }
    const th = Math.max(0.008, mx * 0.12); let a = 0, b = nf - 1; while (a < nf && rms[a] < th) a++; while (b > a && rms[b] < th) b--;
    let s0 = Math.max(0, a * F - 1600), s1 = Math.min(L, (b + 1) * F + 1600); if (s1 - s0 > (maxSec || 4) * 16000) s1 = s0 + (maxSec || 4) * 16000;
    return out.slice(s0, s1);
  };
  K.embedAll = async function (imgEl) { const bm = await createImageBitmap(imgEl); return call('embedAll', { bitmap: bm }, [bm]); };
  K.alignImage = async function (imgEl) { const bm = await createImageBitmap(imgEl); return call('alignImage', { bitmap: bm }, [bm]); };
  K.embedImage = async function (imgEl) { const bm = await createImageBitmap(imgEl); return call('embedImage', { bitmap: bm }, [bm]); };

  /* ---- store: IndexedDB, records encrypted with a non-extractable AES-GCM key kept in the same DB ---- */
  const DBN = 'kratu_id', people = []; let db = null, key = null, loaded = null;
  function openDB() { return new Promise((res, rej) => { const r = indexedDB.open(DBN, 1); r.onupgradeneeded = () => { const d = r.result; if (!d.objectStoreNames.contains('people')) d.createObjectStore('people', { keyPath: 'id' }); if (!d.objectStoreNames.contains('keys')) d.createObjectStore('keys', { keyPath: 'id' }); }; r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); }
  function tx(store, mode, fn) { return new Promise((res, rej) => { const t = db.transaction(store, mode), s = t.objectStore(store), out = fn(s); t.oncomplete = () => res(out && out.result !== undefined ? out.result : out); t.onerror = () => rej(t.error); }); }
  async function getKey() { const got = await tx('keys', 'readonly', s => s.get('k')); if (got && got.key) return got.key; const k = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']); await tx('keys', 'readwrite', s => s.put({ id: 'k', key: k })); return k; }
  /* Face prints (Sani 2026-11-16): each person keeps two sets. enrollFaceVecs are from the day they enrolled and are never
     replaced, so a match can always fall back to how they first looked. recentFaceVecs are the latest few sittings: on a
     clear, confident recognition (at most once in ~a day) the newest prints go in and the oldest drop out, so the record
     follows a growing face. faceVecs is only the two sets together, worked out in memory and never stored. */
  const arr = (vs) => (vs || []).map(v => Array.from(v)), f32 = (vs) => (vs || []).map(v => Float32Array.from(v));
  function spread(vs, n) { if (vs.length <= n) return vs.slice(); const out = []; for (let i = 0; i < n; i++) out.push(vs[Math.round(i * (vs.length - 1) / (n - 1 || 1))]); return out; }
  function joinSets(p) { p.faceVecs = (p.enrollFaceVecs || []).concat(p.recentFaceVecs || []); return p; }
  function ser(rec) { const o = Object.assign({}, rec); delete o.faceVecs; o.enrollFaceVecs = arr(rec.enrollFaceVecs); o.recentFaceVecs = arr(rec.recentFaceVecs); o.voiceVec = rec.voiceVec ? Array.from(rec.voiceVec) : null; return new TextEncoder().encode(JSON.stringify(o)); }
  function deser(bytes) { const o = JSON.parse(new TextDecoder().decode(bytes));
    if (!o.enrollFaceVecs && o.faceVecs) { const old = f32(o.faceVecs); o.enrollFaceVecs = spread(old, cfg.enrollKeep); o.recentFaceVecs = old.filter(v => o.enrollFaceVecs.indexOf(v) < 0).slice(-cfg.recentKeep); o._split = true; }   /* a record from before 16 Nov: its prints are all from enrolment, so a spread of them becomes the first set and the rest the recent set */
    else { o.enrollFaceVecs = f32(o.enrollFaceVecs); o.recentFaceVecs = f32(o.recentFaceVecs); }
    delete o.faceVecs; o.voiceVec = o.voiceVec ? Float32Array.from(o.voiceVec) : null; return joinSets(o); }
  async function enc(rec) { const iv = crypto.getRandomValues(new Uint8Array(12)); const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, ser(rec)); return { id: rec.id, iv, ct }; }
  async function dec(row) { return deser(new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: row.iv }, key, row.ct))); }
  K.store = {
    load: async function () { if (loaded) return loaded; loaded = (async () => { db = await openDB(); key = await getKey(); const rows = await tx('people', 'readonly', s => s.getAll()); people.length = 0; for (const r of rows) { try { const p = await dec(r); let dirty = false; if (p.avatar || p.still) { delete p.avatar; delete p.still; dirty = true; } if (p._split) { delete p._split; dirty = true; } if (K.version && p.modelVer !== K.version && (p.faceVecs || []).length) { p.enrollFaceVecs = []; p.recentFaceVecs = []; joinSets(p); p.modelVer = K.version; dirty = true; }   /* face vectors from a different recogniser cannot be compared: drop them, keep name, voice and clip, and the next 'sunana' merges fresh vectors into the same record */
          if (dirty) { try { const row = await enc(p); await tx('people', 'readwrite', s => s.put(row)); } catch (e) {} } people.push(p); } catch (e) { console.warn('KratuID: could not decrypt record', r.id); } } return people; })(); return loaded; },   /* no photos at rest — vectors, name, key, gender and the child's own short 'sunana …' clip for the greeting (Sani 2026-09-11); older photo fields are stripped on load */
    all: function () { return people.slice(); },
    /* A record is one child, and nothing but their own id ever reaches it: two children called Musa are two records,
       each with their own faces and voice. Pass an id to add to that child; pass none and a new child is created. */
    upsert: async function (rec) { await K.store.load(); let ex = rec.id ? people.find(p => p.id === rec.id) : null;
      const got = rec.faceVecs || [];
      if (ex) {   /* more prints for someone we already have: they fill the first set only if it is empty (after a model change), else they are recent. The stored gender is never changed here: picking the other gender on the first screen changes Laila's wording for that sitting, not the record (Sani 2026-11-16). */
        if (!(ex.enrollFaceVecs || []).length) { ex.enrollFaceVecs = spread(got, cfg.enrollKeep); ex.recentFaceVecs = got.filter(v => ex.enrollFaceVecs.indexOf(v) < 0).slice(-cfg.recentKeep); }
        else if (got.length) ex.recentFaceVecs = (ex.recentFaceVecs || []).concat(spread(got, cfg.perSitting)).slice(-cfg.recentKeep);
        if (got.length) ex.faceAt = Date.now();
        if (rec.voiceVec) ex.voiceVec = rec.voiceVec; ['key', 'clip', 'name'].forEach(k => { if (rec[k]) ex[k] = rec[k]; }); if (!ex.gender && rec.gender) ex.gender = rec.gender; ex.modelVer = K.version || cfg.modelVer; }
      else { ex = Object.assign({ id: 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), at: Date.now(), modelVer: K.version || cfg.modelVer }, rec); delete ex.faceVecs;
        ex.enrollFaceVecs = spread(got, cfg.enrollKeep); ex.recentFaceVecs = got.filter(v => ex.enrollFaceVecs.indexOf(v) < 0).slice(-cfg.recentKeep); ex.faceAt = Date.now(); people.push(ex); }
      joinSets(ex);
      const row = await enc(ex); await tx('people', 'readwrite', s => s.put(row)); return ex; },
    /* After a clear, confident recognition: the newest prints of this sitting join the recent set, the oldest drop out.
       At most once in cfg.refreshGapMs, and only for a match decided by the face alone, so a wrong or shaky match can never
       teach a record somebody else's face. The first set is never touched. Returns true if the record changed. */
    refresh: async function (id, vecs, match) { await K.store.load(); const p = people.find(x => x.id === id);
      if (!p || !vecs || !vecs.length || !match || match.decision !== 'accept' || !match.person || match.person.id !== id) return false;
      if (!(match.face >= cfg.faceAccept && match.margin >= cfg.margin)) return false;
      if (p.faceAt && Date.now() - p.faceAt < cfg.refreshGapMs) return false;
      p.recentFaceVecs = (p.recentFaceVecs || []).concat(spread(vecs, cfg.perSitting)).slice(-cfg.recentKeep); p.faceAt = Date.now(); joinSets(p);
      const row = await enc(p); await tx('people', 'readwrite', s => s.put(row)); return true; },
    remove: async function (id) { await K.store.load(); const i = people.findIndex(p => p.id === id); if (i >= 0) people.splice(i, 1); await tx('people', 'readwrite', s => s.delete(id)); },
    clear: async function () { await K.store.load(); people.length = 0; await tx('people', 'readwrite', s => s.clear()); }
  };

  /* ---- matching: cosine, per-person max over exemplars, mean of top-K frames, margin over runner-up, name + voice fusion ---- */
  function cos(a, b) { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; }
  function setScore(q, set) { if (!q.length || !set || !set.length) return 0; const per = q.map(v => Math.max(...set.map(e => cos(v, e)))).sort((a, b) => b - a); const k = Math.min(cfg.topK, per.length); return per.slice(0, k).reduce((s, x) => s + x, 0) / k; }
  K.match = function (q) {
    const faceVecs = q.faceVecs || [], voiceVec = q.voiceVec || null, nameKey = q.nameKey || null, out = { person: null, decision: 'reject', face: 0, second: 0, margin: 0, voice: null, name: false, fused: 0, n: faceVecs.length, scores: [], reasons: [] };
    if (!people.length) { out.reasons.push('nobody enrolled'); return out; }
    const byFace = people.map(p => {
      /* both sets are searched, each on its own, and the better one counts: the first prints for a child who has not been
         seen for a while, the recent ones for a face that has changed since enrolment (Sani 2026-11-16) */
      const first = setScore(faceVecs, p.enrollFaceVecs), recent = setScore(faceVecs, p.recentFaceVecs), face = Math.max(first, recent);
      const voice = (voiceVec && p.voiceVec) ? cos(voiceVec, p.voiceVec) : null, name = !!(nameKey && p.key && p.key === nameKey);
      return { p, face, first, recent, voice, name };
    }).sort((a, b) => b.face - a.face);
    /* How much the voice is allowed to say depends on the faces. One face clearly ahead of the rest decides on its own;
       two faces close together (siblings, twins, any two children who look alike) hand the decision to the voice. */
    const gap = byFace.length > 1 ? byFace[0].face - byFace[1].face : 1;
    const t = Math.max(0, Math.min(1, (gap - cfg.gapClose) / (cfg.gapWide - cfg.gapClose)));
    const vw = cfg.voiceWeightHigh + (cfg.voiceWeightLow - cfg.voiceWeightHigh) * t;
    out.faceGap = +gap.toFixed(3); out.voiceWeight = +vw.toFixed(3);
    const scored = byFace.map(x => ({ ...x, fused: x.face + (x.voice !== null ? vw * Math.max(0, x.voice - 0.35) : 0) + (x.name ? cfg.nameBonus : 0) })).sort((a, b) => b.fused - a.fused);
    out.scores = scored.map(s => ({ name: s.p.name, face: +s.face.toFixed(3), first: +s.first.toFixed(3), recent: +s.recent.toFixed(3), voice: s.voice === null ? null : +s.voice.toFixed(3), name_match: s.name, fused: +s.fused.toFixed(3) }));
    const best = scored[0], sec = scored[1]; out.face = best.face; out.voice = best.voice; out.name = best.name; out.fused = best.fused; out.second = sec ? sec.fused : 0; out.margin = best.fused - out.second;
    const strong = best.face >= cfg.faceAccept, maybe = best.face >= cfg.faceMaybe, corroborated = best.name || (best.voice !== null && best.voice >= cfg.voiceAccept);
    if (!faceVecs.length) { if (best.voice !== null && best.voice >= cfg.voiceAccept && best.name) { out.person = best.p; out.decision = 'accept'; out.reasons.push('voice+name (no usable face)'); } else out.reasons.push('no usable face frames'); return out; }
    if ((strong || (maybe && corroborated)) && (!sec || out.margin >= cfg.margin)) { out.person = best.p; out.decision = 'accept'; out.reasons.push(strong ? 'face strong' : 'face borderline, corroborated by ' + (best.name ? 'name' : 'voice')); }
    else if (strong && sec && out.margin < cfg.margin) { out.reasons.push('ambiguous: ' + best.p.name + ' vs ' + sec.p.name + ' (margin ' + out.margin.toFixed(2) + ')');
      if (best.name && !sec.name) { out.person = best.p; out.decision = 'accept'; out.reasons.push('resolved by name'); }
      else if (best.voice !== null && best.voice >= cfg.voiceAccept && best.voice - (sec.voice === null ? 0 : sec.voice) >= cfg.voiceTieBreak) { out.person = best.p; out.decision = 'accept'; out.reasons.push('resolved by voice'); } }
    else out.reasons.push(maybe ? 'face borderline, not corroborated' : 'no match (best ' + best.face.toFixed(2) + ')');
    return out;
  };
  window.KratuID = K;
})();
