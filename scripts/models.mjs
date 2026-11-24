// The big downloads' lists (Sani 2026-11-24, the downloads design, points 4 and 6). Run by `npm run content` before
// every build:
//  - every model file the loader downloads gets a fingerprint (sha256 of the bytes as served). The loader keeps each file
//    under its fingerprint, so an update fetches only the files whose fingerprint changed, and drops the old copy once
//    the new one is fully in;
//  - the school app's plain .onnx models are packed ahead (.onnx.gz), like the family app's: a smaller download (87 →
//    78 MB for the face matcher) whatever the server does, and the fingerprint is of the bytes that travel.
//    The packed copies are made here (deterministic, gzip level 9) and ignored by git; their source is the .onnx.
// A list is written only when something in it changed.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const SHA = (FILE) => createHash('sha256').update(readFileSync(FILE)).digest('hex');
// Every served model file is also cut into 1 MB part files (<file>.parts/000.bin …; `pieces` in the list), each fetched whole. Range requests
// cannot be used: a server that compresses on the fly (Firebase with brotli, the dev server with gzip) answers a range
// with a slice of its compressed stream, which the browser cannot decode (ERR_CONTENT_DECODING_FAILED, 24 Nov).
// A whole part file decodes like any other file. The parts are ignored by git and remade when the file changes.
const PIECE = 1 << 20;
function cutParts(FILE, SHA_HEX) {
  const DIR = FILE + '.parts', STAMP = DIR + '/sha256';
  const N = Math.max(1, Math.ceil(statSync(FILE).size / PIECE));
  if (existsSync(STAMP) && readFileSync(STAMP, 'utf8') === SHA_HEX && readdirSync(DIR).length === N + 1) return N;
  rmSync(DIR, { recursive: true, force: true }); mkdirSync(DIR, { recursive: true });
  const BUF = readFileSync(FILE);
  for (let I = 0; I < N; I++) writeFileSync(DIR + '/' + String(I).padStart(3, '0') + '.bin', BUF.subarray(I * PIECE, Math.min(BUF.length, (I + 1) * PIECE)));
  writeFileSync(STAMP, SHA_HEX);
  return N;
}
const MODEL_LISTS = [
  { file: 'public/models/manifest.json', root: 'public/', pack: true },
  { file: 'apps/family/public/models/manifest.json', root: 'apps/family/public/', pack: false },
];
const FIND = (ROOTS, PATH) => ROOTS.map((R) => R + PATH).find((F) => existsSync(F));
let CHANGED = 0;

for (const LIST of MODEL_LISTS) {
  if (!existsSync(LIST.file)) continue;
  const BEFORE = readFileSync(LIST.file, 'utf8'), MAN = JSON.parse(BEFORE);
  const ROOTS = [LIST.root, 'public/'];
  for (const KEY of ['det', 'spk', 'rec', 'wasm']) {
    const M = MAN[KEY]; if (!M?.path) continue;
    // a plain model in the school list: pack it, and download the packed copy from now on
    const PLAIN = M.path.replace(/\.gz$/, '');
    if (LIST.pack && !/\.gz$/.test(M.path) && /\.onnx$/.test(M.path)) {
      const SRC = FIND(ROOTS, PLAIN); if (!SRC) throw new Error(LIST.file + ': ' + KEY + ' missing ' + PLAIN);
      M.srcsha256 = SHA(SRC); M.path = PLAIN + '.gz';
    }
    if (LIST.pack && M.srcsha256) {
      const SRC = FIND(ROOTS, PLAIN), GZ = SRC + '.gz';
      const SRC_SHA = SHA(SRC);
      if (!existsSync(GZ) || M.srcsha256 !== SRC_SHA) {
        console.log('models: packing', PLAIN, '…');
        writeFileSync(GZ, gzipSync(readFileSync(SRC), { level: 9 }));
        M.srcsha256 = SRC_SHA;
      }
      M.size = statSync(SRC).size;
    }
    const SERVED = FIND(ROOTS, M.path); if (!SERVED) throw new Error(LIST.file + ': ' + KEY + ' missing ' + M.path);
    if (/\.gz$/.test(M.path)) M.gzsize = statSync(SERVED).size; else { M.size = statSync(SERVED).size; delete M.gzsize; }
    M.sha256 = SHA(SERVED); M.pieces = cutParts(SERVED, M.sha256); if (typeof M.parts === "number") delete M.parts;
  }
  const AFTER = JSON.stringify(MAN, null, 1) + '\n';
  if (AFTER !== BEFORE) { writeFileSync(LIST.file, AFTER); CHANGED++; console.log('models: updated', LIST.file); }
}

// the speech model (shared): a fingerprint for each packed file
{
  const FILE = 'public/vosk-model/manifest.json';
  const BEFORE = readFileSync(FILE, 'utf8'), MAN = JSON.parse(BEFORE);
  for (const F of MAN.files) { const P = 'public/vosk-model/' + F.gz; F.gzsize = statSync(P).size; F.sha256 = SHA(P); F.pieces = cutParts(P, F.sha256); delete F.parts; }
  const AFTER = JSON.stringify(MAN, null, 1) + '\n';
  if (AFTER !== BEFORE) { writeFileSync(FILE, AFTER); CHANGED++; console.log('models: updated', FILE); }
}
console.log('models: fingerprints checked' + (CHANGED ? ', ' + CHANGED + ' list(s) updated' : ', nothing changed'));
