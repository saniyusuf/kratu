/* Kratu identity engine v2 — worker side.
   SCRFD-500m face detection (5 keypoints) → quality gate → 5-point similarity alignment (112×112) → ArcFace MobileFaceNet (w600k) 512-d
   Voice: kaldi-style 80-bin log-mel fbank → 3D-Speaker CAM++ 512-d.  All on-device via ONNX Runtime Web (WebGPU when available, else WASM). */
import * as ort from './models/ort/ort.webgpu.min.mjs';
ort.env.wasm.wasmPaths = new URL('./models/ort/', import.meta.url).href;
ort.env.wasm.numThreads = 1;
ort.env.logLevel = 'error';                        // SCRFD declares 640-px output shapes; we run it at 320 → harmless size warnings                       // plain http.server has no COOP/COEP → single-thread wasm

/* One recogniser, everywhere: w600k_r50. The small MobileFaceNet build is gone, so there is no second mode to reason
   about and every child's vectors are comparable on every device (Sani 2026-09-19). The model ships as three parts
   because a single 174 MB file cannot be pushed to GitHub; the page joins them and hands over the bytes. */
const M = { det: 'models/insightface/det_500m.onnx', recParts: ['models/insightface/w600k_r50.onnx.part0', 'models/insightface/w600k_r50.onnx.part1', 'models/insightface/w600k_r50.onnx.part2'], spk: 'models/speaker/3dspeaker_speech_campplus_sv_en_voxceleb_16k.onnx' };
const REC_NAME = 'w600k_r50';
const DET = 320;                                   // detector input (square letterbox)
const ARC = [[38.2946, 51.6963], [73.5318, 51.5014], [56.0252, 71.7366], [41.5493, 92.3655], [70.7299, 92.2041]];
let det = null, rec = null, spk = null, ep = 'wasm';
const detCanvas = new OffscreenCanvas(DET, DET), detCtx = detCanvas.getContext('2d', { willReadFrequently: true });
const alnCanvas = new OffscreenCanvas(112, 112), alnCtx = alnCanvas.getContext('2d', { willReadFrequently: true });

async function create(path, eps) {
  try { return await ort.InferenceSession.create(path, { executionProviders: eps, graphOptimizationLevel: 'all', logSeverityLevel: 3 }); }
  catch (e) { if (eps[0] !== 'wasm') return ort.InferenceSession.create(path, { executionProviders: ['wasm'], logSeverityLevel: 3 }); throw e; }
}
async function init(opts) {
  const eps = (opts && opts.webgpu && self.navigator && navigator.gpu) ? ['webgpu', 'wasm'] : ['wasm'];
  /* the page may hand the recogniser over in parts: join here, on the worker's thread, never on the UI's */
  if (opts && opts.blobs && Array.isArray(opts.blobs.recParts) && opts.blobs.recParts.length) {
    const ps = opts.blobs.recParts; let n = 0; ps.forEach((b) => { n += b.byteLength; });
    const all = new Uint8Array(n); let o = 0;
    for (let i = 0; i < ps.length; i++) { all.set(new Uint8Array(ps[i]), o); o += ps[i].byteLength; ps[i] = null; }   /* drop each part as it lands: the peak is one model, not two */
    opts.blobs.rec = all.buffer; opts.blobs.recParts = null;
  }
  if (opts && opts.blobs && opts.blobs.det && opts.blobs.rec && opts.blobs.spk) {
    if (opts.blobs.wasm) ort.env.wasm.wasmBinary = opts.blobs.wasm;   /* the runtime's own wasm too: the page inflated it from the .gz, ORT builds from these bytes and fetches nothing */   /* Kratu: model bytes already downloaded (and cached) by the page — no fetch here, nothing to unpack, sessions are built straight from memory */
    det = await create(new Uint8Array(opts.blobs.det), eps); rec = await create(new Uint8Array(opts.blobs.rec), eps); spk = await create(new Uint8Array(opts.blobs.spk), ['wasm']);
    ep = eps[0]; await runDet(new Float32Array(3 * DET * DET)); await rec.run({ 'input.1': new ort.Tensor('float32', new Float32Array(3 * 112 * 112), [1, 3, 112, 112]) });
    return { ep, rec: REC_NAME, version: 'scrfd500m+' + REC_NAME + '+campplus' };
  }
  /* no blobs handed in (a direct worker test): fetch the parts and join them here */
  const parts = await Promise.all(M.recParts.map((u) => fetch(u).then((r) => r.arrayBuffer())));
  let n = 0; parts.forEach((b) => { n += b.byteLength; });
  const recBytes = new Uint8Array(n); let o = 0; parts.forEach((b) => { recBytes.set(new Uint8Array(b), o); o += b.byteLength; });
  det = await create(M.det, eps); rec = await create(recBytes, eps); spk = await create(M.spk, ['wasm']);
  ep = eps[0];
  // warm-up
  await runDet(new Float32Array(3 * DET * DET));
  await rec.run({ 'input.1': new ort.Tensor('float32', new Float32Array(3 * 112 * 112), [1, 3, 112, 112]) });
  return { ep, rec: REC_NAME, version: 'scrfd500m+' + REC_NAME + '+campplus' };
}
async function runDet(chw) { return det.run({ 'input.1': new ort.Tensor('float32', chw, [1, 3, DET, DET]) }); }

/* ---------- detection ---------- */
function toCHW(imgData, mean, scale) { // RGB, (x-mean)/scale
  const d = imgData.data, n = imgData.width * imgData.height, out = new Float32Array(3 * n);
  for (let i = 0; i < n; i++) { out[i] = (d[i * 4] - mean) / scale; out[n + i] = (d[i * 4 + 1] - mean) / scale; out[2 * n + i] = (d[i * 4 + 2] - mean) / scale; }
  return out;
}
function nms(boxes, thr) {
  boxes.sort((a, b) => b.score - a.score); const keep = [];
  for (const b of boxes) { let ok = true; for (const k of keep) { if (iou(b, k) > thr) { ok = false; break; } } if (ok) keep.push(b); }
  return keep;
}
function iou(a, b) { const x1 = Math.max(a.x1, b.x1), y1 = Math.max(a.y1, b.y1), x2 = Math.min(a.x2, b.x2), y2 = Math.min(a.y2, b.y2); const i = Math.max(0, x2 - x1) * Math.max(0, y2 - y1); const ua = (a.x2 - a.x1) * (a.y2 - a.y1) + (b.x2 - b.x1) * (b.y2 - b.y1) - i; return ua > 0 ? i / ua : 0; }
async function detect(bitmap, thr) {
  const s = DET / Math.max(bitmap.width, bitmap.height), w = Math.round(bitmap.width * s), h = Math.round(bitmap.height * s);
  detCtx.fillStyle = '#000'; detCtx.fillRect(0, 0, DET, DET); detCtx.drawImage(bitmap, 0, 0, w, h);
  const out = await runDet(toCHW(detCtx.getImageData(0, 0, DET, DET), 127.5, 128));
  const names = det.outputNames, strides = [8, 16, 32], boxes = [];
  for (let si = 0; si < 3; si++) {
    const st = strides[si], sc = out[names[si]].data, bb = out[names[3 + si]].data, kp = out[names[6 + si]].data, fw = DET / st;
    for (let i = 0; i < sc.length; i++) {
      if (sc[i] < thr) continue;
      const cell = i >> 1, cx = (cell % fw) * st, cy = Math.floor(cell / fw) * st;
      const b = { score: sc[i], x1: (cx - bb[i * 4] * st) / s, y1: (cy - bb[i * 4 + 1] * st) / s, x2: (cx + bb[i * 4 + 2] * st) / s, y2: (cy + bb[i * 4 + 3] * st) / s, kps: [] };
      for (let j = 0; j < 5; j++) b.kps.push([(cx + kp[i * 10 + j * 2] * st) / s, (cy + kp[i * 10 + j * 2 + 1] * st) / s]);
      boxes.push(b);
    }
  }
  return nms(boxes, 0.4);
}

/* ---------- alignment (least-squares similarity: x' = a x − b y + tx ; y' = b x + a y + ty) ---------- */
function similarity(src, dst) {
  // normal equations for [a,b,tx,ty]
  let Saa = 0, Sax = 0, Say = 0, Sx = 0, Sy = 0, Su = 0, Sv = 0, Sxu = 0, Syv = 0, Sxv = 0, Syu = 0, n = src.length;
  for (let i = 0; i < n; i++) { const [x, y] = src[i], [u, v] = dst[i]; Saa += x * x + y * y; Sx += x; Sy += y; Su += u; Sv += v; Sxu += x * u; Syv += y * v; Sxv += x * v; Syu += y * u; }
  // Solve 4x4: rows for a,b,tx,ty
  const A = [[Saa, 0, Sx, Sy], [0, Saa, -Sy, Sx], [Sx, -Sy, n, 0], [Sy, Sx, 0, n]], B = [Sxu + Syv, Sxv - Syu, Su, Sv];
  return solve4(A, B);
}
function solve4(A, B) { // Gaussian elimination
  const n = 4, M = A.map((r, i) => r.concat([B[i]]));
  for (let c = 0; c < n; c++) { let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r; [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < n; r++) { if (r === c) continue; const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; } }
  return M.map((r, i) => r[n] / r[i]);
}
function align(bitmap, kps) {
  const [a, b, tx, ty] = similarity(kps, ARC);
  alnCtx.setTransform(1, 0, 0, 1, 0, 0); alnCtx.fillStyle = '#000'; alnCtx.fillRect(0, 0, 112, 112);
  alnCtx.setTransform(a, b, -b, a, tx, ty); alnCtx.drawImage(bitmap, 0, 0); alnCtx.setTransform(1, 0, 0, 1, 0, 0);
  return alnCtx.getImageData(0, 0, 112, 112);
}

/* ---------- quality gate ---------- */
function quality(face, img, minFace, blurMin) {
  const w = face.x2 - face.x1, h = face.y2 - face.y1, k = face.kps, le = k[0], re = k[1], no = k[2], ml = k[3], mr = k[4];
  const q = { size: Math.round(Math.max(w, h)), reasons: [] };
  if (q.size < minFace) q.reasons.push('small');
  const eyeDx = re[0] - le[0] || 1; q.yaw = (no[0] - le[0]) / eyeDx;                 // 0.5 = frontal
  if (q.yaw < 0.28 || q.yaw > 0.72) q.reasons.push('turned');
  q.roll = Math.abs(Math.atan2(re[1] - le[1], eyeDx) * 180 / Math.PI); if (q.roll > 18) q.reasons.push('tilted');
  const eyeY = (le[1] + re[1]) / 2, mouthY = (ml[1] + mr[1]) / 2; q.pitch = (no[1] - eyeY) / ((mouthY - eyeY) || 1);
  if (q.pitch < 0.22 || q.pitch > 0.85) q.reasons.push('pitched');
  // sharpness + exposure on the aligned gray crop
  const d = img.data, g = new Float32Array(112 * 112); let mean = 0;
  for (let i = 0; i < g.length; i++) { g[i] = 0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]; mean += g[i]; }
  mean /= g.length; q.bright = Math.round(mean); if (mean < 45 || mean > 225) q.reasons.push(mean < 45 ? 'dark' : 'bright');
  let lv = 0, ls = 0, cnt = 0;
  for (let y = 1; y < 111; y++) for (let x = 1; x < 111; x++) { const i = y * 112 + x, l = -4 * g[i] + g[i - 1] + g[i + 1] + g[i - 112] + g[i + 112]; lv += l; ls += l * l; cnt++; }
  const lm = lv / cnt; q.blur = Math.round(ls / cnt - lm * lm); if (q.blur < blurMin) q.reasons.push('blurry');
  q.ok = q.reasons.length === 0; return q;
}

/* ---------- face embedding ---------- */
function l2(v) { let s = 0; for (let i = 0; i < v.length; i++) s += v[i] * v[i]; s = Math.sqrt(s) || 1; const o = new Float32Array(v.length); for (let i = 0; i < v.length; i++) o[i] = v[i] / s; return o; }
async function embedFace(img) {
  const out = await rec.run({ 'input.1': new ort.Tensor('float32', toCHW(img, 127.5, 127.5), [1, 3, 112, 112]) });
  return l2(out[rec.outputNames[0]].data);
}

/* ---------- voice: kaldi-style fbank → CAM++ ---------- */
const SR = 16000, NFFT = 512, FLEN = 400, HOP = 160, NMEL = 80;
let melFB = null, win = null, fftTw = null;
function mel(f) { return 1127 * Math.log(1 + f / 700); } function imel(m) { return 700 * (Math.exp(m / 1127) - 1); }
function buildMel() {
  const nb = NFFT / 2 + 1, lo = mel(20), hi = mel(SR / 2), pts = []; for (let i = 0; i < NMEL + 2; i++) pts.push(imel(lo + (hi - lo) * i / (NMEL + 1)));
  melFB = []; for (let m = 0; m < NMEL; m++) { const f0 = pts[m], f1 = pts[m + 1], f2 = pts[m + 2], row = []; for (let k = 0; k < nb; k++) { const f = k * SR / NFFT; let w = 0; if (f > f0 && f < f1) w = (f - f0) / (f1 - f0); else if (f >= f1 && f < f2) w = (f2 - f) / (f2 - f1); if (w > 0) row.push([k, w]); } melFB.push(row); }
  win = new Float32Array(FLEN); for (let i = 0; i < FLEN; i++) win[i] = Math.pow(0.5 - 0.5 * Math.cos(2 * Math.PI * i / (FLEN - 1)), 0.85); // povey
}
function fft(re, im) { // in-place radix-2, n = NFFT
  const n = re.length; for (let i = 1, j = 0; i < n; i++) { let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
  for (let len = 2; len <= n; len <<= 1) { const ang = -2 * Math.PI / len, wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) { let cr = 1, ci = 0; for (let k = 0; k < len / 2; k++) { const ar = re[i + k], ai = im[i + k], br = re[i + k + len / 2] * cr - im[i + k + len / 2] * ci, bi = re[i + k + len / 2] * ci + im[i + k + len / 2] * cr; re[i + k] = ar + br; im[i + k] = ai + bi; re[i + k + len / 2] = ar - br; im[i + k + len / 2] = ai - bi; const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t; } } }
}
function fbank(pcm) {
  if (!melFB) buildMel();
  const nf = Math.floor((pcm.length - FLEN) / HOP) + 1; if (nf < 10) return null;
  const feats = new Float32Array(nf * NMEL), re = new Float32Array(NFFT), im = new Float32Array(NFFT), nb = NFFT / 2 + 1, pw = new Float32Array(nb);
  for (let f = 0; f < nf; f++) {
    const o = f * HOP; let dc = 0; for (let i = 0; i < FLEN; i++) dc += pcm[o + i]; dc /= FLEN;
    re.fill(0); im.fill(0);
    for (let i = 0; i < FLEN; i++) { const x = pcm[o + i] - dc, xp = i > 0 ? pcm[o + i - 1] - dc : x; re[i] = (x - 0.97 * xp) * win[i]; }
    fft(re, im); for (let k = 0; k < nb; k++) pw[k] = re[k] * re[k] + im[k] * im[k];
    for (let m = 0; m < NMEL; m++) { let e = 0; const row = melFB[m]; for (let j = 0; j < row.length; j++) e += pw[row[j][0]] * row[j][1]; feats[f * NMEL + m] = Math.log(Math.max(e, 1e-10)); }
  }
  // global mean normalisation
  for (let m = 0; m < NMEL; m++) { let mu = 0; for (let f = 0; f < nf; f++) mu += feats[f * NMEL + m]; mu /= nf; for (let f = 0; f < nf; f++) feats[f * NMEL + m] -= mu; }
  return { feats, nf };
}
async function embedVoice(pcm) {
  const fb = fbank(pcm); if (!fb) return null;
  const out = await spk.run({ [spk.inputNames[0]]: new ort.Tensor('float32', fb.feats, [1, fb.nf, NMEL]) });
  return l2(out[spk.outputNames[0]].data);
}

/* ---------- messages ---------- */
self.onmessage = async (ev) => {
  const { id, type } = ev.data;
  try {
    if (type === 'init') { const r = await init(ev.data.opts || {}); self.postMessage({ id, ok: true, ...r }); return; }
    if (type === 'frame') {
      const t0 = performance.now(), bm = ev.data.bitmap, o = ev.data.opts || {};
      const faces = await detect(bm, o.detThr || 0.5);
      const res = { id, ok: true, faces: faces.length, ms: 0, emb: null, quality: null, box: null, kps: null, score: 0 };
      if (faces.length === 1) {
        const f = faces[0], img = align(bm, f.kps), q = quality(f, img, o.minFace || 70, o.blurMin || 25);
        res.quality = q; res.box = { x: f.x1, y: f.y1, width: f.x2 - f.x1, height: f.y2 - f.y1 }; res.kps = f.kps; res.score = f.score;
        if (q.ok) res.emb = await embedFace(img);
      } else if (faces.length > 1) { res.box = faces.map(f => ({ x: f.x1, y: f.y1, width: f.x2 - f.x1, height: f.y2 - f.y1 })); }
      bm.close(); res.ms = Math.round(performance.now() - t0);
      self.postMessage(res, res.emb ? [res.emb.buffer] : []); return;
    }
    if (type === 'voice') { const t0 = performance.now(); const emb = await embedVoice(ev.data.pcm); self.postMessage({ id, ok: true, emb, ms: Math.round(performance.now() - t0) }, emb ? [emb.buffer] : []); return; }
    if (type === 'embedAll') { // debug: every face in the image
      const bm = ev.data.bitmap, faces = await detect(bm, 0.5), embs = []; for (const f of faces) { embs.push(await embedFace(align(bm, f.kps))); } bm.close();
      self.postMessage({ id, ok: true, n: faces.length, embs: embs.map(e => Array.from(e)), boxes: faces.map(f => [f.x1, f.y1, f.x2, f.y2].map(Math.round)) }); return; }
    if (type === 'alignImage') { // debug: return the aligned 112×112 crop + keypoints
      const bm = ev.data.bitmap, faces = await detect(bm, 0.5); let img = null; if (faces.length) img = align(bm, faces[0].kps); bm.close();
      self.postMessage({ id, ok: true, faces: faces.map(f => ({ score: f.score, box: [f.x1, f.y1, f.x2, f.y2].map(Math.round), kps: f.kps.map(k => k.map(Math.round)) })), img }); return; }
    if (type === 'embedImage') { // for tests: full pipeline on a still image
      const bm = ev.data.bitmap, faces = await detect(bm, 0.5); let emb = null, q = null; if (faces.length) { const img = align(bm, faces[0].kps); q = quality(faces[0], img, 40, 10); emb = await embedFace(img); } bm.close();
      self.postMessage({ id, ok: true, faces: faces.length, emb, quality: q }, emb ? [emb.buffer] : []); return;
    }
    self.postMessage({ id, ok: false, error: 'unknown type ' + type });
  } catch (e) { self.postMessage({ id, ok: false, error: (e && e.message) || String(e) }); }
};
