import data from "./voice.json";

// Sentence times of the narration, in film frames. voice.json is written from the four narration files
// by aligning script sentences to the pauses in the audio (see CHANGELOG). Beats hang off these times.
export const VOICE_FILES = data.files as {src: string; at: number}[];
type Line = {sec: number; i: number; start: number; end: number; text: string};
const LINES = data.lines as Line[];

const line = (sec: number, i: number) => {
  const l = LINES.find((x) => x.sec === sec && x.i === i);
  if (!l) throw new Error(`no narration line ${sec}.${i}`);
  return l;
};

// Frame where sentence i of section `sec` starts, or a fraction of the way through it (an estimate inside a sentence).
export const at = (sec: number, i: number, frac = 0) => {
  const l = line(sec, i);
  return Math.round(l.start + (l.end - l.start) * frac);
};
export const endOf = (sec: number, i: number) => line(sec, i).end;

// Where each section's first shot starts: a short lead before its first sentence.
// Sections 1 and 2 keep the frames their shots were built on.
export const SEC: Record<number, number> = {1: 0, 2: 1110};
for (let s = 3; s <= 12; s++) SEC[s] = at(s, 0) - 16;
export const FILM_END = endOf(12, 7) + 150;
