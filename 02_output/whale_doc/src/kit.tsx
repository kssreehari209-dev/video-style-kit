import React, {useContext} from "react";
import {AbsoluteFill, Audio, Easing, Sequence, staticFile, useCurrentFrame} from "remotion";
import {BG, Dust, LightShafts, Surface, Vignette} from "./atmosphere";
import {Cam, Key, ShotKeys} from "./cam";
import {C, FONT, snap} from "./theme";
import {Whale} from "./Whale";

// The film is one list of shots. Each shot keeps its own beats, in frames from its first frame,
// so re-timing to narration means changing `dur` and the numbers beside it.
export type Cue = [file: string, frame: number, volume?: number];
export type AbsCue = {file: string; frame: number; volume: number};

// How the camera travels from a shot into the next one. The move is centered on the cut frame,
// so sounds placed on the cut land in the middle of it.
//   pan / tilt = the two scenes sit side by side and the camera sweeps across the dark gap
//   push       = the camera goes through a point in this shot (from) and the next opens from a point (to)
//   blend      = same place, same camera: one continuous shot
export type Link = {kind: "pan" | "tilt"; dir: 1 | -1} | {kind: "push"; from: [number, number]; to: [number, number]} | {kind: "blend"};
export type Shot = {dur: number; C: React.FC<{f: number}>; cues?: Cue[]; cam?: Key[]; link?: Link};

export const LINK_FRAMES = 20;
const HALF = LINK_FRAMES / 2;
const GAP = 240;
const curve = Easing.inOut(Easing.cubic);

const leaving = (link: Link, t: number): React.CSSProperties => {
  const e = curve(t);
  if (link.kind === "pan") return {transform: `translateX(${-link.dir * (1920 + GAP) * e}px)`};
  if (link.kind === "tilt") return {transform: `translateY(${-link.dir * (1080 + GAP) * e}px)`};
  if (link.kind === "push") return {transformOrigin: `${link.from[0]}px ${link.from[1]}px`, transform: `scale(${Math.exp(Math.log(3.4) * e)})`};
  return {};
};

const arriving = (link: Link, t: number): React.CSSProperties => {
  const e = curve(t);
  if (link.kind === "pan") return {transform: `translateX(${link.dir * (1920 + GAP) * (1 - e)}px)`};
  if (link.kind === "tilt") return {transform: `translateY(${link.dir * (1080 + GAP) * (1 - e)}px)`};
  if (link.kind === "push") {
    // The next scene grows inside a soft circle. The circle stays clear of the scene's edges
    // until the scene is full size, so no rectangle ever shows.
    const [x, y] = link.to;
    const soft = 240;
    const room = Math.max(120, Math.min(x, 1920 - x, y, 1080 - y) - soft);
    const grown = curve(Math.min(1, t / 0.7));
    const r = t < 0.7 ? room * grown : room + 2600 * Math.pow((t - 0.7) / 0.3, 2);
    const mask = `radial-gradient(circle at ${x}px ${y}px, #000 ${r}px, rgba(0,0,0,0) ${r + soft}px)`;
    return {transformOrigin: `${x}px ${y}px`, transform: `scale(${0.45 + 0.55 * grown})`, maskImage: mask, WebkitMaskImage: mask};
  }
  return {opacity: e};
};

const Layer = ({shot, into, pre}: {shot: Shot; into?: Link; pre: number}) => {
  const f = useCurrentFrame() - pre;
  let style: React.CSSProperties = {};
  if (into && f < HALF) style = arriving(into, (f + HALF) / LINK_FRAMES);
  else if (shot.link && f >= shot.dur - HALF) style = leaving(shot.link, (f - shot.dur + HALF) / LINK_FRAMES);
  return (
    <ShotKeys.Provider value={shot.cam}>
      <AbsoluteFill style={style}>
        <shot.C f={f} />
      </AbsoluteFill>
    </ShotKeys.Provider>
  );
};

// The volumes SFX_MAP.md suggests.
const VOLUME: Record<string, number> = {thud: 0.9, ui_pop: 0.6, ui_alert: 0.7, ui_check: 0.7, sonar_ping: 0.6, scan_typing: 0.5};

export const makeFilm = (shots: Shot[], extra: AbsCue[]) => {
  let at = 0;
  const placed = shots.map((s) => {
    const from = at;
    at += s.dur;
    return {...s, from};
  });
  const cues: AbsCue[] = [
    ...extra,
    ...placed.flatMap((s) => (s.cues ?? []).map(([file, frame, volume]) => ({file: `${file}.wav`, frame: s.from + frame, volume: volume ?? VOLUME[file]}))),
  ];
  const Picture = () => (
    <AbsoluteFill style={{background: C.deep}}>
      {placed.map((s, i) => {
        const into = placed[i - 1]?.link;
        const pre = into ? HALF : 0;
        const post = s.link ? HALF : 0;
        return (
          <Sequence key={s.from} from={s.from - pre} durationInFrames={s.dur + pre + post}>
            <Layer shot={s} into={into} pre={pre} />
          </Sequence>
        );
      })}
      {cues.map((c) => (
        <Sequence key={`${c.file}-${c.frame}`} from={c.frame} layout="none">
          <Audio src={staticFile(`sfx/${c.file}`)} volume={c.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
  return {frames: at, Picture, cues};
};

export const Scene = ({f, bg, seed, children, vig = 0.85}: {f: number; bg: string; seed: string; children: React.ReactNode; vig?: number}) => {
  const keys = useContext(ShotKeys);
  return (
    <AbsoluteFill>
      <Cam keys={keys} f={f} style={{background: bg}}>
        <Dust frame={f} seed={seed} />
        {children}
      </Cam>
      <Vignette strength={vig} />
    </AbsoluteFill>
  );
};

export const Sea = ({f, seed, children}: {f: number; seed: string; children: React.ReactNode}) => {
  const keys = useContext(ShotKeys);
  return (
    <AbsoluteFill>
      <Cam keys={keys} f={f} style={{background: BG.sonar}}>
        <LightShafts frame={f} id={seed} />
        <Surface frame={f} id={seed} />
        <Dust frame={f} seed={seed} />
        {children}
      </Cam>
      <Vignette strength={0.72} />
    </AbsoluteFill>
  );
};

export const Svg = ({children, style}: {children: React.ReactNode; style?: React.CSSProperties}) => (
  <svg width="1920" height="1080" style={{position: "absolute", ...style}}>
    {children}
  </svg>
);

// Origin is the whale's snout, so x and y say where its nose is.
export const W = ({f, x, y, s, id, r = 0, flip = false, glow = 0, amp = 34, opacity = 1}: {f: number; x: number; y: number; s: number; id: string; r?: number; flip?: boolean; glow?: number; amp?: number; opacity?: number}) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${flip ? -s : s} ${s})`} opacity={opacity}>
    <Whale frame={f} id={id} glow={glow} amp={amp} />
  </g>
);

export const Icon = ({x, y, s, color, r = 0}: {x: number; y: number; s: number; color: string; r?: number}) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} style={{color}}>
    <Whale frame={0} id="icon" silhouette amp={0} />
  </g>
);

// Dashed line that draws itself from (x1, y1) as p goes from 0 to 1.
export const Lead = ({x1, y1, x2, y2, p = 1}: {x1: number; y1: number; x2: number; y2: number; p?: number}) => (
  <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={C.rule} strokeWidth="3" strokeDasharray="12 10" opacity="0.7" />
);

// Pops an SVG group in around (x, y).
export const PopG = ({x, y, p, children}: {x: number; y: number; p: number; children: React.ReactNode}) => (
  <g transform={`translate(${x} ${y}) scale(${0.85 + 0.15 * p}) translate(${-x} ${-y})`} opacity={p}>
    {children}
  </g>
);

// Left-aligned list line, as on the option menu. Starts at x 480: 320 at 720p.
export const Row = ({text, y, f, start, x = 480, size = 56}: {text: string; y: number; f: number; start: number; x?: number; size?: number}) => {
  const p = snap(f, start);
  return (
    <div style={{position: "absolute", left: x, top: y, fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.3, color: C.dim, opacity: p, transform: `translateX(${(1 - p) * -16}px)`}}>
      {text}
    </div>
  );
};

export const Fade = ({p}: {p: number}) => <AbsoluteFill style={{background: "#010304", opacity: p * 0.93}} />;
