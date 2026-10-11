// Every clip the app ships is made the same way: −18.5 dB mean, opus 24 kHz mono (Sani's rule for new clips).
import { execFileSync, spawnSync } from 'node:child_process';
export const TARGET_DB = -18.5;
/** Any audio file → the app's clip format at dest. */
export function encode(src, dest) {
  const raw = dest + '.raw.wav';
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', src, '-ac', '1', '-ar', '24000', raw]);
  // volumedetect reports on stderr (reading stdout finds nothing, and the clip would go out at whatever level it came in)
  const det = spawnSync('ffmpeg', ['-i', raw, '-af', 'volumedetect', '-f', 'null', '-'], { encoding: 'utf8' }).stderr || '';
  const m = /mean_volume:\s*(-?[\d.]+) dB/.exec(det);
  const gain = m ? (TARGET_DB - parseFloat(m[1])).toFixed(2) : '0';
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-af', 'volume=' + gain + 'dB', '-c:a', 'libopus', '-b:a', '24k', '-ac', '1', dest]);
  execFileSync('rm', ['-f', raw]);
}
