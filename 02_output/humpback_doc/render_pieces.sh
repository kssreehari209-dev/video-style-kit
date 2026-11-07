#!/bin/bash
# Renders the film as separate 30-40 second clips in ../humpback_doc_pieces/. There is no full-film render.
# Run from this folder. Name the clips to redo, e.g. bash render_pieces.sh 3 7. With no names it renders any missing clip.
# If shots change, re-mix the sound first, because every clip cuts its audio from this one mix:
#   npx remotion render src/index.ts Film film_audio.wav --codec=wav --log=error
set -e
OUT=../humpback_doc_pieces
mkdir -p "$OUT"
COUNT=$(node -p "require('./pieces.json').length")
TODO="$*"
if [ -z "$TODO" ]; then
  for n in $(seq 1 "$COUNT"); do
    [ -f "$OUT/humpback_piece_$(printf %02d "$n").mp4" ] || TODO="$TODO $n"
  done
fi
for n in $TODO; do
  name="humpback_piece_$(printf %02d "$n")"
  start=$(node -p "require('./pieces.json')[$n-1][0]")
  end=$(node -p "require('./pieces.json')[$n-1][1]")
  seconds=$(node -p "($end-$start+1)/30")
  echo "$(date +%H:%M:%S) clip $n: frames $start-$end, $seconds s"
  npx remotion render src/index.ts Film "$OUT/$name.silent.mp4" --frames="$start-$end" --codec=h264 --crf=16 --muted --concurrency=4 --log=error
  ffmpeg -y -v error -i "$OUT/$name.silent.mp4" -ss "$(node -p "$start/30")" -t "$seconds" -i film_audio.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -movflags +faststart "$OUT/$name.mp4"
  rm "$OUT/$name.silent.mp4"
done
echo "$(date +%H:%M:%S) done"
