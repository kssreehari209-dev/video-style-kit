import {Composition} from "remotion";
import {Scene} from "./Scene";

export const Root = () => (
  <Composition
    id="Shark5s"
    component={Scene}
    durationInFrames={150}
    fps={30}
    width={1920}
    height={1080}
  />
);
