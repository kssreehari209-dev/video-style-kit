import {AbsoluteFill, Audio, Composition, interpolate, Sequence, staticFile} from "remotion";
import {AbsCue, makeFilm} from "./kit";
import {s1} from "./Section1";
import {s2} from "./Section2";
import {sectionsA} from "./SectionsA";
import {sectionsB} from "./SectionsB";
import {FILM_END, SEC, VOICE_FILES} from "./voice";

const {frames, Picture, cues} = makeFilm([...s1, ...s2, ...sectionsA(SEC[6]), ...sectionsB(FILM_END)], []);

// One drone bed across the whole film, so it never restarts, fading out over the last 4 seconds.
// The narration plays on top at full level; the effects keep the volumes from SFX_MAP.md.
const Film = (_: {cues: AbsCue[]}) => (
  <AbsoluteFill>
    <Picture />
    <Audio src={staticFile("sfx/ocean_drone.wav")} loop volume={(f) => 0.26 * interpolate(f, [frames - 120, frames - 1], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})} />
    {VOICE_FILES.map((v) => (
      <Sequence key={v.src} from={v.at} layout="none">
        <Audio src={staticFile(v.src)} volume={1} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const Root = () => <Composition id="Film" component={Film} durationInFrames={frames} fps={30} width={1920} height={1080} defaultProps={{cues}} />;
