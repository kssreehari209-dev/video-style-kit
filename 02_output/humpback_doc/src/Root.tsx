import {AbsoluteFill, Audio, Composition, staticFile} from "remotion";
import {AbsCue, makeFilm} from "./kit";
import {s1} from "./Section1";
import {s2} from "./Section2";

const {frames, Picture, cues} = makeFilm([...s1, ...s2], []);

// One bed across the whole film, so the drone never restarts. Add the end fade when the last section exists.
const Film = (_: {cues: AbsCue[]}) => (
  <AbsoluteFill>
    <Picture />
    <Audio src={staticFile("sfx/ocean_drone.wav")} loop volume={0.28} />
  </AbsoluteFill>
);

export const Root = () => <Composition id="Film" component={Film} durationInFrames={frames} fps={30} width={1920} height={1080} defaultProps={{cues}} />;
