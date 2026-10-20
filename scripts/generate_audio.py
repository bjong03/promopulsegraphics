"""Generate the Promo Pulse film's original score and sound effects.

Everything is synthesized from scratch with numpy (no samples, no network),
so the output is ours to use. Run from the repo root:

    python3 scripts/generate_audio.py

Writes public/audio/music/score.wav and public/audio/sfx/*.wav. The score's
sections line up with src/film/timeline.ts (59.15 s, 48 kHz stereo).
"""
import os
import wave

import numpy as np

SR = 48000
RNG = np.random.default_rng(7)  # fixed seed → identical files every run
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "audio")


def write(path, x):
    """Write mono or stereo float audio as 16-bit WAV."""
    x = np.asarray(x, dtype=np.float64)
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    peak = np.max(np.abs(x))
    if peak > 0.98:
        x = x * (0.98 / peak)
    data = (x * 32767).astype("<i2")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def smooth(x, n):
    """Cheap low-pass: moving average of n samples."""
    if n <= 1:
        return x
    k = np.ones(n) / n
    return np.convolve(x, k, mode="same")


def reverb(x, seconds=2.4, mix=0.3, tone=24):
    """Convolution reverb with a synthetic, slightly darkened noise tail."""
    n = int(seconds * SR)
    ir = RNG.standard_normal(n) * np.exp(-np.linspace(0, 7, n))
    ir = smooth(ir, tone)
    ir /= np.sqrt(np.sum(ir**2))
    size = 1 << int(np.ceil(np.log2(len(x) + n)))
    wet = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    return (1 - mix) * x + mix * wet * 0.6


def env_adsr(n, a, r, sus=1.0):
    e = np.full(n, sus)
    na, nr = int(a * SR), int(r * SR)
    if na:
        e[:na] = np.linspace(0, sus, na) ** 1.5
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr) ** 1.5
    return e


def pad_voice(freq, dur, harmonics=10, bright=1.6, detune=0.004):
    """Soft saw-like pad: additive harmonics with 1/n^bright roll-off, 3 detuned voices."""
    t = t_axis(dur)
    out = np.zeros_like(t)
    for d in (-detune, 0.0, detune):
        f = freq * (1 + d)
        ph = RNG.uniform(0, 2 * np.pi)
        for h in range(1, harmonics + 1):
            if f * h > 9000:
                break
            out += np.sin(2 * np.pi * f * h * t + ph * h) / h**bright
    return out / 3


def place(buf, x, at):
    i = int(at * SR)
    j = min(len(buf), i + len(x))
    if j > i:
        buf[i:j] += x[: j - i]


# ───────────────────────────── sound effects ─────────────────────────────
def sfx():
    d = os.path.join(OUT, "sfx")
    # Keyboard tick: short filtered noise burst, no leading silence.
    t = t_axis(0.05)
    key = smooth(RNG.standard_normal(len(t)), 3) * np.exp(-t * 140) * 0.5
    key += np.sin(2 * np.pi * 1900 * t) * np.exp(-t * 300) * 0.15
    write(f"{d}/key.wav", key)

    # Notification ping: two soft sine partials.
    t = t_axis(0.6)
    ping = (np.sin(2 * np.pi * 1318.5 * t) + 0.4 * np.sin(2 * np.pi * 1975.5 * t)) * np.exp(-t * 7)
    ping *= np.minimum(1, t * 400)
    write(f"{d}/ping.wav", reverb(ping * 0.45, 0.8, 0.25))

    # Alert: low two-note muted tone, slightly dissonant.
    t = t_axis(0.9)
    tone = lambda f, s: np.sin(2 * np.pi * f * t) * np.exp(-(t - s).clip(0) * 6) * (t >= s)
    alert = 0.5 * tone(659.3, 0) + 0.45 * tone(622.3, 0.12) + 0.2 * tone(329.6, 0)
    alert *= np.minimum(1, t * 300)
    write(f"{d}/alert.wav", reverb(alert * 0.5, 1.0, 0.3))

    # UI tick: crisp, very short.
    t = t_axis(0.08)
    tick = np.sin(2 * np.pi * 2600 * t) * np.exp(-t * 90) * 0.35 + smooth(RNG.standard_normal(len(t)), 2) * np.exp(-t * 400) * 0.08
    write(f"{d}/tick.wav", tick)

    # Confirm: rising two-note sine, gentle.
    t = t_axis(0.7)
    c = np.sin(2 * np.pi * 880 * t) * np.exp(-t * 8) * (t < 0.09) * 0 + 0
    a1 = np.sin(2 * np.pi * 987.8 * t) * np.exp(-t * 9)
    a2 = np.sin(2 * np.pi * 1318.5 * (t - 0.08)) * np.exp(-(t - 0.08).clip(0) * 7) * (t >= 0.08)
    confirm = (a1 + a2) * np.minimum(1, t * 500) * 0.4 + c
    write(f"{d}/confirm.wav", reverb(confirm, 1.0, 0.3))

    # Chime: soft major triad bell for approvals / end card.
    t = t_axis(2.2)
    chime = np.zeros_like(t)
    for f, a, s in ((1174.7, 0.5, 0.0), (1480.0, 0.35, 0.05), (1760.0, 0.3, 0.1), (2349.3, 0.12, 0.1)):
        chime += a * np.sin(2 * np.pi * f * t) * np.exp(-(t - s).clip(0) * 3.2) * (t >= s)
    chime *= np.minimum(1, t * 600)
    write(f"{d}/chime.wav", reverb(chime * 0.5, 2.0, 0.35))

    # Swell: rising filtered noise + tone into the reveal (1.4 s, peaks at end).
    t = t_axis(1.4)
    rise = (t / t[-1]) ** 2.5
    noise = smooth(RNG.standard_normal(len(t)), 40) * rise
    tone = np.sin(2 * np.pi * (180 + 220 * rise) * t) * rise * 0.3
    swell = (noise * 0.6 + tone) * np.minimum(1, (t[-1] - t) * 30)
    write(f"{d}/swell.wav", reverb(swell * 0.6, 1.6, 0.35))

    # Impact: low, warm, controlled hit for the figure.
    t = t_axis(3.0)
    sub = np.sin(2 * np.pi * 55 * t) * np.exp(-t * 2.2)
    body = np.sin(2 * np.pi * 110 * t) * np.exp(-t * 4) * 0.4
    air = smooth(RNG.standard_normal(len(t)), 30) * np.exp(-t * 6) * 0.15
    impact = (sub + body + air) * np.minimum(1, t * 200)
    write(f"{d}/impact.wav", reverb(impact * 0.7, 2.5, 0.3))


# ───────────────────────────────── score ─────────────────────────────────
def score():
    dur = 59.15
    n = int(dur * SR)
    L = np.zeros(n)
    t_all = t_axis(dur)

    # 0 – 11.75 s: tension. Low D drone, slowly brightening, plus a quiet
    # clock-like pulse that tightens. Hard stop for the freeze.
    seg = 11.75
    tt = t_axis(seg)
    drone = pad_voice(hz(38), seg, 8, 1.8) * 0.5 + pad_voice(hz(45), seg, 8, 2.0) * 0.28
    drone += pad_voice(hz(51), seg, 6, 2.2) * 0.12 * np.linspace(0, 1, len(tt))
    drone *= env_adsr(len(tt), 1.5, 0.03) * (0.45 + 0.55 * tt / seg)
    place(L, drone * 0.16, 0)
    beat = 60 / 108
    k = 0.0
    while k < seg - 0.1:
        tk = t_axis(0.12)
        click = np.sin(2 * np.pi * 1200 * tk) * np.exp(-tk * 60) * (0.2 + 0.6 * k / seg)
        place(L, click * 0.05, k)
        k += beat / 2

    # 12.6 – 20.0 s: urgency. Heartbeat-like low pulse under a minor cluster.
    s0, s1 = 12.6, 20.0
    seg = s1 - s0
    tt = t_axis(seg)
    cl = pad_voice(hz(38), seg, 6, 2.0) * 0.45 + pad_voice(hz(50), seg, 6, 2.2) * 0.2 + pad_voice(hz(53), seg, 6, 2.4) * 0.12
    cl *= env_adsr(len(tt), 1.2, 0.5) * (0.6 + 0.4 * tt / seg)
    place(L, cl * 0.16, s0)
    k = s0 + 0.4
    while k < s1 - 0.6:
        tk = t_axis(0.5)
        thump = np.sin(2 * np.pi * (58 - 18 * tk) * tk) * np.exp(-tk * 9)
        place(L, thump * 0.22, k)
        place(L, thump * 0.12, k + 0.22)
        k += 1.0

    # 20.0 – 21.2: deliberate near-silence (the swell SFX rises into 21.2).

    # 21.2 – 48.05: Promo Pulse theme. Warm major progression, plucked arpeggio.
    bpm = 100
    bar = 4 * 60 / bpm  # 2.4 s
    prog = [
        [50, 57, 62, 66, 69, 76],  # Dmaj9-ish (D A D F# A E)
        [47, 54, 59, 62, 66, 69],  # Bm7
        [43, 50, 55, 59, 62, 66],  # Gmaj7
        [45, 52, 57, 61, 64, 66],  # A6sus-ish
    ]
    start = 21.2
    end = 48.05
    i = 0
    tb = start
    while tb < end - 0.1:
        chord = prog[i % 4]
        cd = min(bar, end - tb)
        tt = t_axis(cd + 1.2)
        pad = sum(pad_voice(hz(m), cd + 1.2, 8, 2.0) * (0.55 if j == 0 else 0.22) for j, m in enumerate(chord))
        e = env_adsr(len(tt), 0.6 if i else 1.4, 1.2)
        lvl = 0.11 if tb < 42 else 0.085
        place(L, pad * e * lvl, tb)
        # arpeggio (eighth notes) from the 2nd bar on
        if i >= 1:
            notes = chord[2:] + chord[2:][::-1]
            for q in range(8):
                tq = tb + q * bar / 8
                if tq >= end:
                    break
                tn = t_axis(0.9)
                f = hz(notes[q % len(notes)] + 12)
                pl = (np.sin(2 * np.pi * f * tn) + 0.25 * np.sin(4 * np.pi * f * tn)) * np.exp(-tn * 5.5)
                pl *= np.minimum(1, tn * 800)
                place(L, pl * (0.035 if tb < 42 else 0.025), tq)
        # soft sub pulse on beats 1 and 3
        for q in (0, 2):
            tq = tb + q * bar / 4
            tn = t_axis(0.45)
            sub = np.sin(2 * np.pi * hz(chord[0] - 12) * tn) * np.exp(-tn * 6)
            place(L, sub * 0.07, tq)
        tb += bar
        i += 1

    # 48.05 – 51.55: broader, more confident — wider voicing, low octave, shimmer.
    for c, (tb, cd) in enumerate(((48.05, 2.4), (50.45, 1.3))):
        chord = [38, 50, 57, 62, 66, 69, 74, 78] if c == 0 else [43, 55, 59, 62, 66, 71, 74]
        tt = t_axis(cd + 1.5)
        pad = sum(pad_voice(hz(m), cd + 1.5, 9, 1.8) * (0.6 if j < 2 else 0.2) for j, m in enumerate(chord))
        place(L, pad * env_adsr(len(tt), 0.25 if c == 0 else 0.5, 1.4) * 0.12, tb)

    # 51.55 – 59.15: resolution. Bm7 → Gmaj7 → D (held, fading to silence).
    for tb, cd, chord, a in (
        (51.55, 1.9, [47, 59, 62, 66, 69], 0.5),
        (53.35, 1.8, [43, 55, 59, 62, 66], 0.4),
        (55.05, 4.1, [38, 50, 57, 62, 66, 69, 74], 0.8),
    ):
        tt = t_axis(cd + 0.6)
        pad = sum(pad_voice(hz(m), cd + 0.6, 8, 2.0) * (0.55 if j < 2 else 0.22) for j, m in enumerate(chord))
        e = env_adsr(len(tt), a, 0.6 if tb < 54 else cd + 0.6)
        place(L, pad * e * 0.11, tb)

    L = reverb(L, 3.0, 0.32)
    # gentle stereo width: slightly different early reflections per side
    R = np.roll(L, int(0.011 * SR)) * 0.92 + L * 0.08
    st = np.stack([L, R], axis=1)
    # enforce the silences exactly (freeze beat and pre-reveal pause)
    for a, b in ((11.78, 12.6), (20.25, 21.15)):
        i, j = int(a * SR), int(b * SR)
        st[i:j] = 0
    # fade the very end to digital silence
    fade = int(0.4 * SR)
    st[-fade:] *= np.linspace(1, 0, fade)[:, None]
    write(os.path.join(OUT, "music", "score.wav"), st * 2.2)


if __name__ == "__main__":
    sfx()
    score()
    print("wrote", OUT)
