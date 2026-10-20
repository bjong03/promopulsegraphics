"""Level-match the four voiceover clips (plain gain, no compression).

The recordings came in at different levels (clip 1 ≈ 9 dB louder than 2–4).
This measures each clip's speech loudness (RMS of 50 ms windows above its
noise floor) and writes gain-matched WAVs to public/audio/vo/matched/.

Usage (from the repo root):
    for f in public/audio/vo/*.m4a; do
      npx remotion ffmpeg -y -i "$f" -ac 1 -ar 48000 "${f%.m4a}.wav"
    done
    python3 scripts/normalize_vo.py public/audio/vo/*.wav
"""
import os
import sys
import wave

import numpy as np

TARGET_DB = -20.0  # speech RMS, dBFS
CEILING = 10 ** (-1.5 / 20)  # keep peaks under -1.5 dBFS


def read(path):
    with wave.open(path) as w:
        sr = w.getframerate()
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768
        if w.getnchannels() == 2:
            x = x.reshape(-1, 2).mean(axis=1)
    return x, sr


def speech_db(x, sr):
    hop = int(sr * 0.05)
    frames = x[: len(x) // hop * hop].reshape(-1, hop)
    rms = np.sqrt((frames**2).mean(axis=1)) + 1e-9
    db = 20 * np.log10(rms)
    floor = np.percentile(db, 10)
    voiced = rms[db > floor + 15]
    return 20 * np.log10(np.sqrt((voiced**2).mean()))


out_dir = os.path.join("public", "audio", "vo", "matched")
os.makedirs(out_dir, exist_ok=True)
for path in sys.argv[1:]:
    x, sr = read(path)
    level = speech_db(x, sr)
    gain = 10 ** ((TARGET_DB - level) / 20)
    gain = min(gain, CEILING / (np.abs(x).max() + 1e-9))
    y = np.clip(x * gain, -1, 1)
    out = os.path.join(out_dir, os.path.basename(path))
    with wave.open(out, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes((y * 32767).astype("<i2").tobytes())
    print(f"{os.path.basename(path)}: speech {level:.1f} dB → gain {20*np.log10(gain):+.1f} dB")
