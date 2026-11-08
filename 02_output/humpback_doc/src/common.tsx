import React from "react";
import {AbsoluteFill} from "remotion";
import {BG, Dust, LightShafts, SonarRings, Surface, Vignette} from "./atmosphere";
import {camAt, Cam, Fixed, Key} from "./cam";
import {Land} from "./Objects";
import {C, FONT, snap} from "./theme";
import {Title} from "./ui";
import data from "./mapdata.json";

// Scene wrappers and small pieces shared by sections 2 to 12. Everything takes F, the film frame.

export const Stage = ({F, keys, bg = BG.deep, seed, vig = 0.85, children}: {F: number; keys: Key[]; bg?: string; seed: string; vig?: number; children: React.ReactNode}) => (
  <AbsoluteFill>
    <Cam keys={keys} f={F} style={{background: bg}}>
      <Dust frame={F} seed={seed} />
      {children}
    </Cam>
    <Vignette strength={vig} />
  </AbsoluteFill>
);

// Blue sonar water with light shafts and the surface line along the top (frames 2a to 2c).
export const SonarSea = ({F, keys, seed, children}: {F: number; keys: Key[]; seed: string; children: React.ReactNode}) => (
  <AbsoluteFill>
    <Cam keys={keys} f={F} style={{background: BG.sonar}}>
      <LightShafts frame={F} id={seed} />
      <Surface frame={F} id={seed} />
      <Dust frame={F} seed={seed} />
      {children}
    </Cam>
    <Vignette strength={0.72} />
  </AbsoluteFill>
);

type MapName = keyof typeof data;
export const MapStage = ({F, keys, map, seed, tint, children}: {F: number; keys: Key[]; map: MapName; seed: string; tint?: string; children: React.ReactNode}) => (
  <AbsoluteFill>
    <Cam keys={keys} f={F} style={{background: BG.deep}}>
      {tint && <AbsoluteFill style={{background: tint}} />}
      <Land map={map} />
      <Dust frame={F} seed={seed} />
      {children}
    </Cam>
    <Vignette strength={0.85} />
  </AbsoluteFill>
);

// A glowing green dot with sonar pings on a map. Sizes stay fixed on screen whatever the zoom.
export const MapDot = ({F, at, keys, start, pings = [], color = C.green, o = 1}: {F: number; at: [number, number]; keys: Key[]; start: number; pings?: number[]; color?: string; o?: number}) => {
  const inv = 1 / camAt(keys, F).z;
  return (
    <svg width="1920" height="1080" style={{position: "absolute", opacity: o}}>
      {pings.map((p) => {
        const age = F - p;
        if (age < 0 || age > 44) return null;
        return <circle key={p} cx={at[0]} cy={at[1]} r={(14 + age * 7.67) * inv} fill="none" stroke="#C7D6DA" strokeWidth={3 * inv} opacity={0.62 * (1 - age / 44)} />;
      })}
      <g opacity={snap(F, start, 6)}>
        <circle cx={at[0]} cy={at[1]} r={24 * inv} fill={color} opacity={0.18 + 0.06 * Math.sin(F * 0.2)} />
        <circle cx={at[0]} cy={at[1]} r={8 * inv} fill="#D9FBE7" />
      </g>
    </svg>
  );
};

// Fades its children out from `at`. Titles inside keep pinning themselves to the screen.
export const Gone = ({F, at, d = 8, children}: {F: number; at: number; d?: number; children: React.ReactNode}) => {
  const o = 1 - snap(F, at, d);
  return o <= 0 ? null : <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

// A title that shows from `start` until `end`.
export const T = ({F, text, start, end, top, size, color}: {F: number; text: string; start: number; end?: number; top?: number; size?: number; color?: string}) =>
  F < start - 1 || (end !== undefined && F >= end + 8) ? null : (
    <Gone F={F} at={end ?? 1e9}>
      <Title text={text} frame={F} start={start} top={top} size={size} color={color} />
    </Gone>
  );

// Big Latin number or unit line, pinned to the screen (the guide's scale label, larger when it is the point of a shot).
export const Big = ({F, text, start, end, top = 186, size = 48, color = C.scale}: {F: number; text: string; start: number; end?: number; top?: number; size?: number; color?: string}) => {
  if (F < start - 1 || (end !== undefined && F >= end + 8)) return null;
  const p = snap(F, start) * (end === undefined ? 1 : 1 - snap(F, end, 8));
  return (
    <Fixed>
      <div style={{position: "absolute", top, width: "100%", textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.3, color, opacity: p, transform: `scale(${0.85 + 0.15 * snap(F, start)})`, textShadow: "0 3px 10px rgba(0,0,0,0.55)"}}>
        {text}
      </div>
    </Fixed>
  );
};

// Pill pinned to the screen at (x, y), with an optional end.
export const ScreenPill = ({F, text, x, y, start, end, size = 40, color = C.title}: {F: number; text: string; x: number; y: number; start: number; end?: number; size?: number; color?: string}) => {
  if (F < start - 1 || (end !== undefined && F >= end + 8)) return null;
  const p = snap(F, start) * (end === undefined ? 1 : 1 - snap(F, end, 8));
  return (
    <Fixed>
      <div style={{position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * snap(F, start)})`, opacity: p, background: C.pill, borderRadius: 14, padding: "10px 26px 12px", whiteSpace: "nowrap", fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.3, color}}>
        {text}
      </div>
    </Fixed>
  );
};

// Sonar rings in world space.
export const Rings = ({F, starts, x, y, r0 = 40, fadeAt = 700}: {F: number; starts: number[]; x: number; y: number; r0?: number; fadeAt?: number}) => <SonarRings frame={F} starts={starts} cx={x} cy={y} r0={r0} fadeAt={fadeAt} />;

// A whale's arc out of the water and back. The head starts `deep` below the surface, peaks `high` above it,
// and travels from x0 to x1. Returns where the snout is and the angle the body points.
export const arc = (F: number, t0: number, t1: number, x0: number, x1: number, surf: number, deep: number, high: number) => {
  const u = Math.max(0, Math.min(1, (F - t0) / (t1 - t0)));
  const k = deep + high;
  const x = x0 + (x1 - x0) * u;
  const y = surf - high + k * (2 * u - 1) ** 2;
  const vx = x1 - x0;
  const vy = 4 * k * (2 * u - 1);
  const right = vx >= 0;
  const r = right ? (Math.atan2(vy, vx) * 180) / Math.PI : (Math.atan2(-vy, -vx) * 180) / Math.PI;
  // Frame where the head goes back under.
  const back = t0 + (t1 - t0) * (1 + Math.sqrt(high / k)) / 2;
  return {x, y, r, flip: right, u, back};
};

// Dashed arrow in world space.
export const Arrow = ({x1, y1, x2, y2, p = 1, color = C.rule, w = 4, o = 1}: {x1: number; y1: number; x2: number; y2: number; p?: number; color?: string; w?: number; o?: number}) => {
  const [x, y] = [x1 + (x2 - x1) * p, y1 + (y2 - y1) * p];
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = 18 + w * 2;
  return (
    <g opacity={o * (p > 0 ? 1 : 0)}>
      <line x1={x1} y1={y1} x2={x} y2={y} stroke={color} strokeWidth={w} strokeDasharray={`${w * 3} ${w * 2.4}`} />
      <path d={`M${x} ${y}L${x - h * Math.cos(a - 0.5)} ${y - h * Math.sin(a - 0.5)}M${x} ${y}L${x - h * Math.cos(a + 0.5)} ${y - h * Math.sin(a + 0.5)}`} stroke={color} strokeWidth={w} strokeLinecap="round" />
    </g>
  );
};

// "TRACKING" style readout, bottom right, in the guide's sage.
export const Readout = ({F, text, start, end}: {F: number; text: string; start: number; end?: number}) =>
  F < start || (end !== undefined && F >= end + 8) ? null : (
    <Fixed>
      <div style={{position: "absolute", right: 72, bottom: 54, fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 1.5, color: "#6A947E", opacity: snap(F, start) * (end === undefined ? 1 : 1 - snap(F, end, 8))}}>{text}</div>
    </Fixed>
  );
