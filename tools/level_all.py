# Raise every voice clip to one loud level (Sani 2026-11-17: "raise all to the same highest level, the tablet can turn
# it down"): -14 LUFS as heard (EBU R128), peaks held under -1 dBFS by a limiter so nothing distorts. Short clips whose
# loudness cannot be measured (under 0.4 s) are set by their mean level instead. Re-encoded opus 24 kHz mono, in place;
# git keeps the old files. Run: python3 tools/level_all.py [dirs…]
import subprocess, re, sys, os, concurrent.futures as cf
TARGET = -14.0
DIRS = sys.argv[1:] or ['public/assets/audio/ha', 'public/assets/audio/en', 'langs/yo/public/assets/audio/yo', 'langs/ig/public/assets/audio/ig',
                        'langs/pcm/public/assets/audio/pcm', 'langs/hapw/public/assets/audio/hapw']
def level(path):
    r = subprocess.run(['ffmpeg', '-nostats', '-i', path, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    m = re.findall(r'^\s+I:\s+(-?[\d.]+) LUFS', r, re.M)
    i = float(m[-1]) if m else None
    if i is None or i < -60:   # too short to measure: use the mean level, which sits about 3.5 dB under LUFS for this voice
        v = subprocess.run(['ffmpeg', '-i', path, '-af', 'volumedetect', '-f', 'null', '-'], capture_output=True, text=True).stderr
        mv = re.search(r'mean_volume:\s*(-?[\d.]+) dB', v); i = float(mv.group(1)) + 3.5 if mv else TARGET
    gain = TARGET - i
    tmp = path + '.lvl.ogg'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', path, '-af', f'volume={gain:.2f}dB,alimiter=limit=0.89:level=false', '-ar', '24000', '-ac', '1', '-c:a', 'libopus', '-b:a', '24k', tmp], check=True)
    os.replace(tmp, path); return round(gain, 1)
files = [os.path.join(d, f) for d in DIRS if os.path.isdir(d) for f in sorted(os.listdir(d)) if f.endswith('.ogg')]
with cf.ThreadPoolExecutor(8) as ex: gains = list(ex.map(level, files))
print(len(files), 'clips; gain min', min(gains), 'median', sorted(gains)[len(gains)//2], 'max', max(gains))
