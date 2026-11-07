#!/usr/bin/env bash
# Extract still frames and a contact sheet from the reference video.
# Usage: bash scripts/extract_frames.sh [video] [fps]
# Defaults: 00_reference/reference.mp4, 1 frame per second.
# Requires ffmpeg.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VIDEO="${1:-$ROOT/00_reference/reference.mp4}"
FPS="${2:-1}"
OUT="$ROOT/00_reference/frames"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg is not installed. Install it first (https://ffmpeg.org/download.html)." >&2
  exit 1
fi

if [ ! -f "$VIDEO" ]; then
  echo "Video not found: $VIDEO" >&2
  echo "Place your video at 00_reference/reference.mp4 or pass a path." >&2
  exit 1
fi

mkdir -p "$OUT"

echo "Extracting frames at ${FPS} fps..."
ffmpeg -loglevel error -y -i "$VIDEO" -vf "fps=${FPS}" -q:v 2 "$OUT/frame_%04d.jpg"

COUNT=$(ls "$OUT"/frame_*.jpg | wc -l)
echo "Wrote $COUNT frames to $OUT"

echo "Building contact sheet..."
ffmpeg -loglevel error -y -i "$VIDEO" \
  -vf "fps=${FPS},scale=320:-1,tile=5x4" -frames:v 1 -q:v 2 "$OUT/contact_sheet.jpg"

echo "Done. Next: run the Gemini step described in README.md."
