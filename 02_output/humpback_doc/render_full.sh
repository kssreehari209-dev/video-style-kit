#!/bin/bash
# Renders the film in silent parts (frame ranges in pieces.json) into ../humpback_doc_pieces/, then joins them
# with the one sound mix into ../humpback_film.mp4. Run from this folder.
#   bash render_full.sh 3 4    render parts 3 and 4
#   bash render_full.sh        render any part that is missing
#   bash render_full.sh join   join all parts with film_audio.wav
# If shots or cues change, re-mix the sound first:
#   npx remotion render src/index.ts Film film_audio.wav --codec=wav --concurrency=4 --log=error
set -e
OUT=../humpback_doc_pieces
mkdir -p "$OUT"
COUNT=$(node -p "require('./pieces.json').length")
if [ "$1" = "join" ]; then
  : > "$OUT/parts.txt"
  for n in $(seq 1 "$COUNT"); do echo "file 'part_$(printf %02d "$n").mp4'" >> "$OUT/parts.txt"; done
  ffmpeg -y -v error -f concat -safe 0 -i "$OUT/parts.txt" -i film_audio.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart ../humpback_film.mp4
  echo "$(date +%H:%M:%S) joined ../humpback_film.mp4"
  exit 0
fi
TODO="$*"
if [ -z "$TODO" ]; then
  for n in $(seq 1 "$COUNT"); do [ -f "$OUT/part_$(printf %02d "$n").mp4" ] || TODO="$TODO $n"; done
fi
for n in $TODO; do
  start=$(node -p "require('./pieces.json')[$n-1][0]")
  end=$(node -p "require('./pieces.json')[$n-1][1]")
  echo "$(date +%H:%M:%S) part $n: frames $start-$end"
  npx remotion render src/index.ts Film "$OUT/part_$(printf %02d "$n").mp4" --frames="$start-$end" --codec=h264 --crf=16 --muted --concurrency=4 --timeout=120000 --log=error
done
echo "$(date +%H:%M:%S) done"
