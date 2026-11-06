// Every clip the app ships is made the same way: −18.5 dB mean, opus 24 kHz mono (Sani's rule for new clips).
import { execFileSync, spawnSync } from 'node:child_process';
export const TARGET_DB = -18.5;
/**
 * Any audio file → the app's clip format at dest. Options, for a demo language's own voice:
 *   tempo  slower or faster without changing the pitch (0.8 = a fifth slower)
 *   lufs   loudness as heard (EBU R128 integrated), instead of the mean level: the Hausa clips actually sit at a
 *          median −17.7 LUFS, and a voice with more pauses sounds quieter at the same mean level. Peaks are held at −1 dBFS.
 */
export function encode(src, dest, opt = {}) {
  const raw = dest + '.raw.wav';
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', src, '-ac', '1', '-ar', '24000'].concat(opt.tempo && opt.tempo !== 1 ? ['-af', 'atempo=' + opt.tempo] : []).concat([raw]));
  if (opt.lufs) {
    const r = spawnSync('ffmpeg', ['-nostats', '-i', raw, '-af', 'ebur128', '-f', 'null', '-'], { encoding: 'utf8' }).stderr || '';
    const I = [...r.matchAll(/^\s+I:\s+(-?[\d.]+) LUFS/gm)].pop();
    const gain = I ? (opt.lufs - parseFloat(I[1])).toFixed(2) : '0';
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-af', 'volume=' + gain + 'dB,alimiter=limit=0.89:level=false', '-ar', '24000', '-c:a', 'libopus', '-b:a', '24k', '-ac', '1', dest]);
    execFileSync('rm', ['-f', raw]); return;
  }
  // volumedetect reports on stderr (reading stdout finds nothing, and the clip would go out at whatever level it came in)
  const det = spawnSync('ffmpeg', ['-i', raw, '-af', 'volumedetect', '-f', 'null', '-'], { encoding: 'utf8' }).stderr || '';
  const m = /mean_volume:\s*(-?[\d.]+) dB/.exec(det);
  const gain = m ? (TARGET_DB - parseFloat(m[1])).toFixed(2) : '0';
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-af', 'volume=' + gain + 'dB', '-c:a', 'libopus', '-b:a', '24k', '-ac', '1', dest]);
  execFileSync('rm', ['-f', raw]);
}
