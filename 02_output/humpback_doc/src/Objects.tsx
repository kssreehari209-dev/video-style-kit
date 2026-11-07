import React from "react";
import {AbsoluteFill} from "remotion";
import {Dust, LightShafts, Surface, Vignette} from "./atmosphere";
import {Cam, Key} from "./cam";
import {Pill} from "./ui";
import {C, spline} from "./theme";
import data from "./mapdata.json";

// ---- Maps. Land is Natural Earth, clipped by tools/make_maps.py. World frame is 1920 x 1080 in Mercator.
type MapName = keyof typeof data;
const merc = (lat: number) => (Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * 180) / Math.PI;

export const ll = (map: MapName, lon: number, lat: number): [number, number] => {
  const m = data[map];
  const k = 1920 / (m.east - m.west);
  return [(lon - m.west) * k, 540 - (merc(lat) - merc(m.clat)) * k];
};

export const Land = ({map, fill = "#0C2B3A", stroke = "#385F6C"}: {map: MapName; fill?: string; stroke?: string}) => (
  <svg width="1920" height="1080" style={{position: "absolute"}}>
    <path d={data[map].d} fill={fill} stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
  </svg>
);

// A pill or label tied to a map point that keeps its screen size while the camera zooms.
export const MapPill = ({text, at, z, f, start, dx = 0, dy = 0, size = 36, color = C.title, out}: {text: string; at: [number, number]; z: number; f: number; start: number; dx?: number; dy?: number; size?: number; color?: string; out?: number}) => {
  if (out !== undefined && f >= out) return null;
  return (
    <div style={{position: "absolute", left: at[0], top: at[1], transformOrigin: "0 0", transform: `scale(${1 / z})`}}>
      <Pill text={text} x={dx} y={dy} frame={f} start={start} size={size} color={color} />
    </div>
  );
};

// ---- Sea with the water line partway down: air and a boat above, the whale below.
export const SplitSea = ({f, seed, keys, surface = 330, children}: {f: number; seed: string; keys?: Key[]; surface?: number; children: React.ReactNode}) => (
  <AbsoluteFill>
    <Cam keys={keys} f={f} style={{background: "#040D12"}}>
      <div style={{position: "absolute", left: 0, top: 0, width: 1920, height: surface, background: "linear-gradient(180deg, #03090D 0%, #0B1F28 72%, #0C2B3A 100%)"}} />
      <div style={{position: "absolute", left: 0, top: surface, width: 1920, height: 1080 - surface, overflow: "hidden", background: "linear-gradient(180deg, #1A3A47 0%, #132F3B 17%, #0E222C 42%, #040F15 86%, #030A0F 100%)"}}>
        <LightShafts frame={f} id={seed} />
      </div>
      <div style={{position: "absolute", left: 0, top: surface - 12, width: 1920, height: 100, overflow: "hidden"}}>
        <Surface frame={f} id={seed} />
      </div>
      <Dust frame={f} seed={seed} />
      {children}
    </Cam>
    <Vignette strength={0.72} />
  </AbsoluteFill>
);

// ---- Diver, in night-vision green with bright hands, feet and eye and a white-cyan torch tip (frames 1a to 1c).
// Own drawing. Origin at the chest, swimming left.
export const Diver = ({f, x, y, s = 1, flip = false, r = 0}: {f: number; x: number; y: number; s?: number; flip?: boolean; r?: number}) => {
  const kick = Math.sin(f * 0.22) * 10;
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${flip ? -s : s} ${s})`}>
      {/* Tank */}
      <rect x="-18" y="-24" width="62" height="16" rx="8" fill="#0C5A1A" />
      {/* Body and head */}
      <path d="M-34 -8Q-10 -20 30 -12L66 -6Q74 0 64 6L26 12Q-12 16 -34 8Z" fill="#094513" />
      <circle cx="-48" cy="-5" r="15" fill="#094513" />
      <circle cx="-54" cy="-8" r="5" fill={C.green} />
      {/* Arm, with the torch at the hand */}
      <path d="M-26 6L-68 22" stroke="#094513" strokeWidth="10" strokeLinecap="round" />
      <circle cx="-72" cy="24" r="6.5" fill={C.green} />
      <rect x="-96" y="24" width="20" height="6" rx="3" fill="#D7F4F4" transform="rotate(-18 -86 27)" />
      {/* Legs and fins */}
      <path d={`M62 -2L104 ${-6 + kick}`} stroke="#094513" strokeWidth="10" strokeLinecap="round" />
      <path d={`M60 4L104 ${10 - kick}`} stroke="#094513" strokeWidth="10" strokeLinecap="round" />
      <path d={`M104 ${-6 + kick}L140 ${-14 + kick * 1.7}`} stroke={C.green} strokeWidth="7" strokeLinecap="round" />
      <path d={`M104 ${10 - kick}L140 ${18 - kick * 1.7}`} stroke={C.green} strokeWidth="7" strokeLinecap="round" />
    </g>
  );
};

// ---- Small whale-watching boat, side on, bow to the right. Origin on the waterline at the hull's center.
export const Boat = ({f, x, y, s = 1, people = 1}: {f: number; x: number; y: number; s?: number; people?: number}) => {
  const rock = Math.sin(f * 0.05) * 1.4;
  const bob = Math.sin(f * 0.06 + 1) * 3;
  const heads = [-104, -62, -20, 22, 64];
  return (
    <g transform={`translate(${x} ${y + bob}) rotate(${rock}) scale(${s})`}>
      <defs>
        <linearGradient id="boatHull" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#D8D6CF" />
          <stop offset="0.55" stopColor="#8D9193" />
          <stop offset="1" stopColor="#3C484E" />
        </linearGradient>
      </defs>
      {/* Canopy on two posts */}
      <rect x="-122" y="-96" width="4" height="56" fill="#6A7478" />
      <rect x="78" y="-96" width="4" height="56" fill="#6A7478" />
      <rect x="-134" y="-104" width="226" height="10" rx="5" fill="#ADBBC2" />
      {/* Passengers leaning to the rail */}
      {heads.map((hx, i) => {
        const p = Math.max(0, Math.min(1, people * 5 - i));
        return (
          <g key={hx} opacity={p} transform={`translate(${hx} ${(1 - p) * 10})`}>
            <path d="M-11 -32Q-11 -56 0 -56Q11 -56 11 -32Z" fill={i % 2 ? "#5E6A70" : "#7B8589"} />
            <circle cx="1" cy="-66" r="9.5" fill="#C9CCCB" />
            <path d="M8 -50L24 -56" stroke="#7B8589" strokeWidth="5.5" strokeLinecap="round" />
          </g>
        );
      })}
      {/* Hull */}
      <path d="M-170 -36H150Q176 -36 196 -46Q186 -10 148 12H-150Q-166 -8 -170 -36Z" fill="url(#boatHull)" />
      <rect x="-170" y="-38" width="342" height="5" rx="2.5" fill="#F1EFEB" />
      {/* Soft shadow on the water under the hull */}
      <ellipse cx="0" cy="18" rx="170" ry="9" fill="#000" opacity="0.28" />
    </g>
  );
};

// ---- Sea floor along the bottom of the picture: dark sand with a soft lit edge and a few rocks. `top` is its highest line.
export const Seabed = ({top = 890}: {top?: number}) => {
  const edge: [number, number][] = [[-20, top + 34], [260, top + 14], [560, top + 26], [860, top + 6], [1160, top + 16], [1460, top], [1720, top + 18], [1940, top + 8]];
  const d = spline(edge, false);
  const rocks: [number, number, number, number][] = [[640, top + 34, 62, 26], [1220, top + 30, 84, 34], [1330, top + 38, 44, 18], [430, top + 44, 40, 16]];
  return (
    <g>
      <defs>
        <linearGradient id="bed" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#0E2A36" />
          <stop offset="0.5" stopColor={C.mid} />
          <stop offset="1" stopColor={C.deep} />
        </linearGradient>
      </defs>
      {rocks.map(([x, y, rx, ry]) => (
        <g key={x}>
          <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#0A1A22" />
          <ellipse cx={x - rx * 0.2} cy={y - ry * 0.4} rx={rx * 0.5} ry={ry * 0.32} fill="#1E3C49" opacity="0.7" />
        </g>
      ))}
      <path d={`${d}L1940 1100L-20 1100Z`} fill="url(#bed)" />
      <path d={d} stroke="#315968" strokeWidth="2" fill="none" opacity="0.6" />
    </g>
  );
};

// ---- Small lobster, side on, claws to the left, in the squid's rust. Origin at the middle of its body.
export const Lobster = ({f, x, y, s = 1}: {f: number; x: number; y: number; s?: number}) => {
  const wave = Math.sin(f * 0.09) * 4;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* Feelers and legs */}
      <path d={`M-30 -8Q-70 -30 -96 ${-22 + wave}`} stroke="#8A5A49" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d={`M-30 -6Q-62 -40 -74 ${-48 - wave}`} stroke="#8A5A49" strokeWidth="2" fill="none" strokeLinecap="round" />
      {[-14, 0, 14, 28].map((lx) => (
        <path key={lx} d={`M${lx} 8L${lx - 7} 22`} stroke="#4D3027" strokeWidth="3.5" strokeLinecap="round" />
      ))}
      {/* Claw */}
      <path d="M-26 2Q-48 8 -58 0" stroke="#4D3027" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d={`M-56 0Q-84 -14 -92 ${-2 + wave * 0.4}Q-80 2 -74 4Q-84 10 -90 ${14 - wave * 0.4}Q-70 18 -56 6Z`} fill={C.squid} />
      {/* Body and tail */}
      <path d="M-34 -2Q-30 -14 -6 -14Q26 -14 48 -6Q66 0 74 12Q58 12 44 10Q14 14 -14 12Q-32 10 -34 -2Z" fill={C.squid} />
      <path d="M-24 -6Q0 -12 40 -6" stroke="#9A6A58" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.65" />
      {[12, 26, 40].map((lx) => (
        <path key={lx} d={`M${lx} -9Q${lx + 4} 2 ${lx - 1} 11`} stroke="#4D3027" strokeWidth="2" fill="none" opacity="0.7" />
      ))}
      <circle cx="-26" cy="-8" r="2.4" fill="#120B0B" />
    </g>
  );
};
