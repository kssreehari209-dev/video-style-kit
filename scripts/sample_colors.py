#!/usr/bin/env python3
"""Sample real colors from the extracted frames.

Use this to settle hex codes instead of trusting an AI's estimate.

Usage:
    python3 scripts/sample_colors.py [frames_dir] [every_nth_frame]

Defaults: 00_reference/frames, every 2nd frame.
Requires Pillow (pip install pillow).

For each color family it prints the most common exact-ish colors found,
so you can pick the real hex for the guide.
"""
import colorsys
import sys
from collections import Counter
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
frames_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "00_reference" / "frames"
step = int(sys.argv[2]) if len(sys.argv) > 2 else 2

FAMILIES = {
    "ocean blue (mid/dark)": lambda h, s, v: 190 <= h <= 250 and s > 0.30 and 0.18 <= v <= 0.60,
    "near black": lambda h, s, v: v < 0.12,
    "white / off-white": lambda h, s, v: s < 0.08 and v > 0.93,
    "red": lambda h, s, v: (h <= 12 or h >= 348) and s > 0.55 and v > 0.5,
    "green": lambda h, s, v: 90 <= h <= 165 and s > 0.50 and v > 0.5,
}

counts = {name: Counter() for name in FAMILIES}


def bucket(r, g, b):
    # round to the nearest 2 levels so near-identical shades merge
    return tuple((c // 2) * 2 for c in (r, g, b))


frames = sorted(p for p in frames_dir.glob("*.jpg") if "contact_sheet" not in p.name)[::step]
if not frames:
    sys.exit(f"No .jpg frames in {frames_dir}. Add screenshots or run scripts/extract_frames.sh first.")

for path in frames:
    img = Image.open(path).convert("RGB")
    img.thumbnail((200, 200))
    pixels = getattr(img, "get_flattened_data", img.getdata)()
    for r, g, b in pixels:
        h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
        h *= 360
        for name, test in FAMILIES.items():
            if test(h, s, v):
                counts[name][bucket(r, g, b)] += 1
                break

print(f"Sampled {len(frames)} frames from {frames_dir}\n")
for name, counter in counts.items():
    print(name)
    if not counter:
        print("  (no pixels found)")
    for (r, g, b), n in counter.most_common(5):
        print(f"  #{r:02X}{g:02X}{b:02X}  ({n} px)")
    print()
