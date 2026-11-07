import React, {createContext, useContext} from "react";
import {AbsoluteFill, Easing, interpolate} from "remotion";

// One flat camera per shot: the whole picture moves as a single plane, so there is no parallax.
// A key is [frame, x, y, zoom, ease]: the world point (x, y) sits at screen center at that zoom.
// `ease` shapes the move that ends on this key:
//   lin  = constant speed, the guide's linear pan and slow push-in (the default)
//   ease = gentle start and stop, for re-framing between beats
//   snap = fast ease-out, the same feel as the guide's 300 ms entrances, for punch-ins
export type Key = [frame: number, x: number, y: number, zoom: number, ease?: "lin" | "ease" | "snap"];

const SHAPE = {
  lin: (t: number) => t,
  ease: Easing.inOut(Easing.cubic),
  snap: Easing.out(Easing.cubic),
};

export const camAt = (keys: Key[], f: number) => {
  let i = 0;
  while (i < keys.length - 2 && f >= keys[i + 1][0]) i++;
  const a = keys[i];
  const b = keys[Math.min(i + 1, keys.length - 1)];
  const t = b[0] === a[0] ? 1 : interpolate(f, [a[0], b[0]], [0, 1], {easing: SHAPE[b[4] ?? "lin"], extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  // Zoom moves on a log scale, so a push-in feels even from start to end.
  const z = Math.exp(Math.log(a[3]) + (Math.log(b[3]) - Math.log(a[3])) * t);
  const clamp = (v: number, half: number, size: number) => Math.min(size - half, Math.max(half, v));
  // Keep the frame inside the 1920 x 1080 picture, so no edge ever shows.
  const x = clamp(a[1] + (b[1] - a[1]) * t, 960 / z, 1920);
  const y = clamp(a[2] + (b[2] - a[2]) * t, 540 / z, 1080);
  return {z, tx: 960 - x * z, ty: 540 - y * z};
};

const View = createContext({z: 1, tx: 0, ty: 0});
export const ShotKeys = createContext<Key[] | undefined>(undefined);

export const Cam = ({keys, f, style, children}: {keys?: Key[]; f: number; style?: React.CSSProperties; children: React.ReactNode}) => {
  const view = keys ? camAt(keys, f) : {z: 1, tx: 0, ty: 0};
  return (
    <View.Provider value={view}>
      <AbsoluteFill style={{...style, transformOrigin: "0 0", transform: `translate(${view.tx}px, ${view.ty}px) scale(${view.z})`}}>{children}</AbsoluteFill>
    </View.Provider>
  );
};

// Pins its contents to the screen: titles and captions stay put and readable while the camera moves.
export const Fixed = ({children}: {children: React.ReactNode}) => {
  const {z, tx, ty} = useContext(View);
  return <AbsoluteFill style={{transformOrigin: "0 0", transform: `scale(${1 / z}) translate(${-tx}px, ${-ty}px)`}}>{children}</AbsoluteFill>;
};
