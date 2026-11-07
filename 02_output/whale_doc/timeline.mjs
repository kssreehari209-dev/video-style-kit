// Writes timeline.json: section starts and every sound cue, read from the compositions.
import {bundle} from "@remotion/bundler";
import {getCompositions} from "@remotion/renderer";
import {writeFileSync} from "node:fs";
const serveUrl = await bundle({entryPoint: "src/index.ts"});
const comps = await getCompositions(serveUrl);
const film = comps.find((c) => c.id === "Film");
writeFileSync("timeline.json", JSON.stringify({frames: film.durationInFrames, cues: film.defaultProps.cues}));
console.log(film.durationInFrames, film.defaultProps.cues.length);
