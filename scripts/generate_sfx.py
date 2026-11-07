#!/usr/bin/env python3
"""Synthesize the sound effects for the sperm-whale-style explainer.

Usage:
    python3 scripts/generate_sfx.py [output_dir]

Default output: 02_output/audio/
Requires numpy only. Writes 48 kHz mono 16-bit WAV files.

Every sound is built from sine waves, filtered noise and envelopes, so you can
tweak the numbers in each function and re-run. All values below are starting
points chosen from the style guide's sound description, not measurements of the
original video.
"""
import sys
import wave
from pathlib import Path

import numpy as np

SR = 48000
ROOT = Path(__file__).resolve().parent.parent
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "02_output" / "audio"
rng = np.random.default_rng(7)  # fixed seed so reruns give identical files


def t_(dur):
    return np.arange(int(SR * dur)) / SR


def env_ad(n, attack, tau):
    """Fast linear attack, exponential decay."""
    t = np.arange(n) / SR
    a = np.clip(t / attack, 0, 1) if attack > 0 else np.ones(n)
    return a * np.exp(-t / tau)


def lowpass(x, cutoff):
    """Smooth FFT low-pass. Circular, so loopable noise stays loopable."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(X / (1 + (f / cutoff) ** 4), len(x))


def blip(freq, dur, tau, attack=0.002):
    t = t_(dur)
    return np.sin(2 * np.pi * freq * t) * env_ad(len(t), attack, tau)


# ---------------------------------------------------------------- sounds

def drone(dur=24.0):
    """Deep ocean bed. Seamless loop: every component fits whole cycles in dur."""
    n = int(SR * dur)
    t = np.arange(n) / SR
    noise = lowpass(rng.standard_normal(n), 140)
    sig = 0.5 * noise / np.max(np.abs(noise))
    for freq, amp, lfo_cycles, phase in [(38, 0.50, 3, 0.0), (55, 0.35, 5, 1.3), (82, 0.20, 7, 2.1)]:
        freq = round(freq * dur) / dur
        lfo = 0.65 + 0.35 * np.sin(2 * np.pi * lfo_cycles * t / dur + phase)
        sig += amp * np.sin(2 * np.pi * freq * t) * lfo
    return sig


def sonar_ping(dur=1.8):
    """High sine ping with a quieter echo half a second later."""
    n = int(SR * dur)
    t = t_(dur)
    tone = np.sin(2 * np.pi * 1800 * t) + 0.25 * np.sin(2 * np.pi * 3600 * t)
    s = tone * env_ad(n, 0.004, 0.28)
    out = s.copy()
    d = int(0.5 * SR)
    out[d:] += 0.3 * s[: n - d]
    return out


def ui_check(dur=0.3):
    """Two rising notes plus a tiny click: checkbox tick."""
    out = np.zeros(int(SR * dur))
    a = blip(880, 0.12, 0.04)
    b = blip(1320, 0.18, 0.06)
    out[: len(a)] += a
    s = int(0.07 * SR)
    out[s : s + len(b)] += b
    k = int(SR * 0.006)
    out[:k] += 0.4 * rng.standard_normal(k) * np.linspace(1, 0, k)
    return out


def ui_pop(dur=0.14):
    """Quick upward sweep: text, brackets, boxes appearing."""
    n = int(SR * dur)
    t = t_(dur)
    freq = 400 + 400 * (t / dur)
    phase = 2 * np.pi * np.cumsum(freq) / SR
    return np.sin(phase) * env_ad(n, 0.003, 0.035)


def scan_typing(count=14, gap=0.05):
    """Digital scanning/typing: a run of short square-ish blips."""
    n = int(SR * (count * gap + 0.05))
    out = np.zeros(n)
    for i in range(count):
        freq = rng.choice([2200, 2600, 3000, 3400, 3800])
        b = np.tanh(3 * blip(freq, 0.03, 0.008, 0.001))
        s = int(i * gap * SR)
        out[s : s + len(b)] += 0.6 * b
    return out


def thud(dur=1.0):
    """Low-end thud for scale comparisons: falling sine plus a dull click."""
    n = int(SR * dur)
    t = t_(dur)
    freq = 35 + 60 * np.exp(-t / 0.06)
    phase = 2 * np.pi * np.cumsum(freq) / SR
    body = np.sin(phase) * env_ad(n, 0.002, 0.22)
    click = lowpass(rng.standard_normal(n), 400) * env_ad(n, 0.001, 0.02)
    click /= np.max(np.abs(click))
    return body + 0.35 * click


def ui_alert(dur=0.5):
    """Two short buzzy beeps for red warnings (NEVER PROVEN, CANCEL)."""
    out = np.zeros(int(SR * dur))
    t = t_(0.14)
    beep = (np.sin(2 * np.pi * 440 * t) + 0.5 * np.sin(2 * np.pi * 660 * t)) * env_ad(len(t), 0.003, 0.1)
    for start in (0.0, 0.2):
        s = int(start * SR)
        out[s : s + len(beep)] += beep
    return out


def whale_song(dur=4.2):
    """Humpback-style call: a slow rising and falling moan with soft echoes. Invented, not a recording."""
    n = int(SR * dur)
    t = t_(dur)
    glide = np.interp(t, [0, 0.9, 1.9, 2.8, dur], [150, 310, 240, 390, 120])
    glide = glide * (1 + 0.012 * np.sin(2 * np.pi * 5.5 * t))
    phase = 2 * np.pi * np.cumsum(glide) / SR
    tone = np.sin(phase) + 0.45 * np.sin(2 * phase) + 0.18 * np.sin(3 * phase)
    shape = np.interp(t, [0, 0.5, 1.5, 2.1, 3.0, dur], [0, 1, 0.75, 0.9, 0.7, 0])
    s = lowpass(tone * shape, 1400)
    out = s.copy()
    for delay, gain in [(0.31, 0.32), (0.67, 0.18), (1.1, 0.09)]:
        d = int(delay * SR)
        out[d:] += gain * s[: n - d]
    return out


# ----------------------------------------------------------------- output

def save(name, x, loop=False, peak=0.7):
    x = x / np.max(np.abs(x)) * peak
    if not loop:
        fade = int(0.005 * SR)
        x[-fade:] *= np.linspace(1, 0, fade)
    data = (np.clip(x, -1, 1) * 32767).astype("<i2")
    path = OUT / f"{name}.wav"
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
    print(f"{path.name:18s} {len(x) / SR:5.2f}s")


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    save("ocean_drone", drone(), loop=True)
    save("sonar_ping", sonar_ping())
    save("ui_check", ui_check())
    save("ui_pop", ui_pop())
    save("scan_typing", scan_typing())
    save("thud", thud())
    save("ui_alert", ui_alert())
    save("whale_song", whale_song())
    print(f"\nWrote WAV files to {OUT}")
