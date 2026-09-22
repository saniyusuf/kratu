/**
 * The child's own name, cut from the login recording — the NAME only, never the "sunana" in front of it (Sani 2026-09-17).
 * The recording is split into spoken pieces at the pauses, and the last piece is the name: a child says "Sunana … Sani".
 * Normalised, 16 kHz mono WAV as a data URL. This is the only audio ever kept for a child.
 */
export function nameClip(blob: Blob, startMs: number): Promise<{ url: string; ms: number; startMs: number }> {
  return new Promise((res, rej) => {
    const ctx = new AudioContext();
    blob.arrayBuffer().then((ab) => ctx.decodeAudioData(ab)).then((buf) => {
      const sr = buf.sampleRate, ch = buf.getChannelData(0), n = ch.length, F = Math.round(sr * 0.02), nf = Math.floor(n / F), rms = new Float32Array(nf); let mx = 0;
      for (let i = 0; i < nf; i++) { let s = 0; for (let j = i * F; j < (i + 1) * F; j++) s += ch[j] * ch[j]; rms[i] = Math.sqrt(s / F); if (rms[i] > mx) mx = rms[i]; }
      if (!mx) { rej(new Error('silent')); return; }
      const th = Math.max(0.012, mx * 0.18), from = Math.max(0, Math.floor(((startMs || 0) - 400) / 20));
      // every spoken piece after the point the name was first heard, split at pauses of 140 ms or more
      const GAP = 7, MIN = 6;   // frames of 20 ms: a 140 ms pause separates pieces, a piece must last 120 ms
      const pieces: [number, number][] = []; let st = -1, quiet = 0;
      for (let i = from; i < nf; i++) {
        if (rms[i] > th) { if (st < 0) st = i; quiet = 0; }
        else if (st >= 0 && ++quiet >= GAP) { if (i - quiet - st >= MIN) pieces.push([st, i - quiet]); st = -1; }
      }
      if (st >= 0 && nf - st >= MIN) pieces.push([st, nf - 1]);
      if (!pieces.length) { rej(new Error('no speech')); return; }
      // "Sunana Sani": the last piece is the name. One piece only means they said the name on its own.
      const [a, b] = pieces[pieces.length - 1];
      const s0 = Math.max(0, a * F - Math.round(sr * 0.06)), s1 = Math.min(n, (b + 1) * F + Math.round(sr * 0.18));
      if (s1 - s0 < sr * 0.12) { rej(new Error('too short')); return; }
      const seg = ch.subarray(s0, s1); let pk = 0; for (let i = 0; i < seg.length; i++) { const v = Math.abs(seg[i]); if (v > pk) pk = v; }
      const g = pk ? Math.min(8, 0.707 / pk) : 1; let out: Float32Array;
      if (sr === 16000) out = seg; else { const ratio = sr / 16000, L = Math.floor(seg.length / ratio); out = new Float32Array(L); for (let i = 0; i < L; i++) { const p = i * ratio, k = Math.floor(p), fr = p - k; out[i] = (seg[k] || 0) * (1 - fr) + (seg[k + 1] || 0) * fr; } }
      const wav = new DataView(new ArrayBuffer(44 + out.length * 2)); const W = (o: number, s: string) => { for (let i = 0; i < s.length; i++) wav.setUint8(o + i, s.charCodeAt(i)); };
      W(0, 'RIFF'); wav.setUint32(4, 36 + out.length * 2, true); W(8, 'WAVE'); W(12, 'fmt '); wav.setUint32(16, 16, true); wav.setUint16(20, 1, true); wav.setUint16(22, 1, true); wav.setUint32(24, 16000, true); wav.setUint32(28, 32000, true); wav.setUint16(32, 2, true); wav.setUint16(34, 16, true); W(36, 'data'); wav.setUint32(40, out.length * 2, true);
      for (let i = 0; i < out.length; i++) { const x = Math.max(-1, Math.min(1, out[i] * g)); wav.setInt16(44 + i * 2, x < 0 ? x * 32768 : x * 32767, true); }
      const bytes = new Uint8Array(wav.buffer); let bin = ''; for (let i = 0; i < bytes.length; i += 8192) bin += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + 8192)));
      res({ url: 'data:audio/wav;base64,' + btoa(bin), ms: Math.round(out.length / 16), startMs: Math.round(s0 / sr * 1000) });
    }).catch(rej).finally(() => { try { ctx.close(); } catch { /* ignore */ } });
  });
}

/** A still frame of the live video, for display during the greeting only. It is never stored. */
export function stillFrame(video: HTMLVideoElement, w = 512): string | null {
  try {
    const h = Math.round(w * video.videoHeight / video.videoWidth) || Math.round(w * 0.75);
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d'); if (!g) return null;
    g.translate(w, 0); g.scale(-1, 1); g.drawImage(video, 0, 0, w, h);
    return c.toDataURL('image/jpeg', 0.85);
  } catch { return null; }
}

/** The name protocol: only the words after the last "sunana" count, up to four, cut at a trailing "ne". */
const CARRIER_STOP = new Set(['ne', 'ni', 'ce']);
export function extractName(t: string): string {
  if (!t) return '';
  const s = ' ' + t.toLowerCase().replace(/[^a-z' ]/g, ' ').replace(/\s+/g, ' ') + ' ';
  const ms = s.match(/ suna ?na /g); if (!ms) return '';
  const last = ms[ms.length - 1], idx = s.lastIndexOf(last);
  let rest = s.slice(idx + last.length).trim().split(' ').filter(Boolean);
  while (rest.length && CARRIER_STOP.has(rest[0])) rest.shift();
  const end = rest.indexOf('ne'); if (end > 0) rest = rest.slice(0, end);
  rest = rest.slice(0, 4);
  return rest.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
/** A heard name folded to its sound: no doubled letters, no silent h, common vowel spellings joined, so 'Muhammad' and 'Mohamed' meet. */
function nameNorm(s: string): string { return (s||'').toLowerCase().replace(/[^a-z']/g,'').replace(/'/g,'').replace(/h(?=[^aeiou]|$)/g,'').replace(/(.)\1+/g,'$1').replace(/tu$/,'t').replace(/ou$/,'u').replace(/ee/g,'i').replace(/oo/g,'u').replace(/q/g,'k').replace(/y+a$/,'ya'); }
let bankIdx: Record<string, string> | null = null;
/** Snap a heard name onto the name bank (the names Laila can say in her own voice). */
export function snapName(raw: string, bank: Record<string, string> | null): string | null {
  if (!bank || !raw) return null;
  const key = raw.toLowerCase().replace(/[^a-z']/g, ''); if (bank[key]) return key;
  if (!bankIdx) { bankIdx = {}; Object.keys(bank).forEach((k) => { const nk = nameNorm(k); if (!bankIdx![nk]) bankIdx![nk] = k; }); }
  const nk = nameNorm(key); if (bankIdx[nk]) return bankIdx[nk];
  // Nothing else counts. A near miss used to be accepted, which meant one name could be heard and another said back —
  // never acceptable (Sani 2026-09-17). When we are not certain, the child's own recording says the name instead.
  return null;
}
