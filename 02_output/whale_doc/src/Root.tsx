import {AbsoluteFill, Audio, Composition, staticFile} from "remotion";
import {AbsCue, makeFilm} from "./kit";
import {CUES, s1} from "./Section1";
import {s2, s3, s4, s5} from "./SectionsA";
import {s6, s7, s8, s9, s10} from "./SectionsB";
import {lerp} from "./theme";

const {frames, Picture, cues} = makeFilm([...s1, ...s2, ...s3, ...s4, ...s5, ...s6, ...s7, ...s8, ...s9, ...s10], CUES);

// One bed across the whole film, so the drone never restarts.
const Film = (_: {cues: AbsCue[]}) => (
  <AbsoluteFill>
    <Picture />
    <Audio src={staticFile("sfx/ocean_drone.wav")} loop volume={(v) => lerp(v, frames - 70, frames - 1, 0.28, 0)} />
  </AbsoluteFill>
);

export const Root = () => <Composition id="Film" component={Film} durationInFrames={frames} fps={30} width={1920} height={1080} defaultProps={{cues}} />;
