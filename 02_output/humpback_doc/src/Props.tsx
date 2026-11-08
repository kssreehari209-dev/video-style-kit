import React from "react";
import {random} from "remotion";
import {C, FONT, P, spline} from "./theme";

// Original drawings for sections 3 to 12. Main subjects get soft painted light (rule 11): a top highlight,
// a darker underside and a soft shadow, over flat shapes. People stay in the diver's night-vision green.

// ---- KSRTC-sized bus, from the earlier whale film. Origin top-left, w wide.
export const Bus = ({x, y, w = 888}: {x: number; y: number; w?: number}) => (
  <g transform={`translate(${x} ${y}) scale(${w / 888})`}>
    <defs>
      <linearGradient id="busBody" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#D9A839" />
        <stop offset="0.6" stopColor={C.bus} />
        <stop offset="1" stopColor="#8F6A1C" />
      </linearGradient>
    </defs>
    <path d="M36 0H850Q880 0 884 30L888 104Q888 124 868 124H16Q0 124 0 106V34Q0 0 36 0Z" fill="url(#busBody)" />
    {Array.from({length: 8}).map((_, i) => (
      <rect key={i} x={118 + i * 88} y="18" width="74" height="50" rx="4" fill={C.busWindow} />
    ))}
    <rect x="28" y="18" width="66" height="94" rx="4" fill={C.busWindow} />
    <circle cx="226" cy="124" r="34" fill="#141618" />
    <circle cx="716" cy="124" r="34" fill="#141618" />
    <text x="470" y="108" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="40" fill={C.title}>
      KSRTC ബസ്
    </text>
  </g>
);

// ---- Tusker, side on, facing right, in the guide's elephant grey. Origin at the feet, centered. About 170 wide.
export const Tusker = ({x, y, s = 1, ghost = false}: {x: number; y: number; s?: number; ghost?: boolean}) => {
  const body = ghost ? "#2C3033" : "#555A5D";
  const dark = ghost ? "#24282A" : "#43474A";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* Far legs */}
      <rect x="-58" y="-62" width="22" height="62" rx="6" fill={dark} />
      <rect x="22" y="-62" width="22" height="62" rx="6" fill={dark} />
      {/* Body and head */}
      <path d="M-84 -66Q-92 -128 -30 -140Q30 -150 58 -118Q72 -100 66 -64Q30 -48 -20 -50Q-70 -46 -84 -66Z" fill={body} />
      <path d="M48 -126Q72 -150 96 -132Q112 -116 104 -88Q98 -70 84 -66Q66 -66 58 -84Z" fill={body} />
      {/* Ear */}
      <path d="M50 -128Q34 -118 38 -92Q50 -78 62 -88Q70 -110 64 -128Z" fill={dark} />
      {/* Trunk */}
      <path d="M100 -96Q116 -60 108 -26Q104 -8 116 -4" stroke={body} strokeWidth="16" fill="none" strokeLinecap="round" />
      {/* Tusk */}
      {!ghost && <path d="M90 -74Q112 -60 128 -66" stroke="#E6DED0" strokeWidth="7" fill="none" strokeLinecap="round" />}
      <circle cx="88" cy="-108" r="3" fill="#141618" />
      {/* Near legs */}
      <rect x="-76" y="-60" width="24" height="60" rx="6" fill={body} />
      <rect x="36" y="-60" width="24" height="60" rx="6" fill={body} />
      <path d="M-84 -66Q-86 -76 -96 -60" stroke={body} strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Soft top light */}
      {!ghost && <path d="M-70 -118Q-20 -146 50 -124" stroke="#7B8185" strokeWidth="10" fill="none" opacity="0.45" strokeLinecap="round" />}
    </g>
  );
};

// ---- Autorickshaw, side on, facing right. Origin at the ground, left end. About 260 wide (one is about 2.6 m).
export const Auto = ({x, y, s = 1}: {x: number; y: number; s?: number}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M10 -150Q14 -170 60 -172H200Q240 -170 248 -140L252 -112H14Z" fill={C.bus} />
    <path d="M14 -112H252Q262 -80 258 -40Q256 -24 236 -24H26Q8 -24 8 -44Z" fill="#1E2326" />
    <path d="M200 -170Q236 -160 244 -112H206Z" fill={C.busWindow} />
    <rect x="90" y="-150" width="70" height="36" rx="4" fill={C.busWindow} />
    <path d="M14 -112H252" stroke="#3A4246" strokeWidth="4" />
    <circle cx="58" cy="-22" r="24" fill="#111315" />
    <circle cx="58" cy="-22" r="9" fill="#3A4246" />
    <circle cx="218" cy="-22" r="24" fill="#111315" />
    <circle cx="218" cy="-22" r="9" fill="#3A4246" />
    <path d="M24 -164Q120 -178 230 -160" stroke="#E5BD5A" strokeWidth="6" fill="none" opacity="0.6" strokeLinecap="round" />
  </g>
);

// ---- Small fish, and a school of them. The school can be pulled toward a point (swallowed).
export const Fish = ({x, y, s = 1, r = 0, o = 1}: {x: number; y: number; s?: number; r?: number; o?: number}) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>
    <path d="M-14 0Q-4 -7 10 -3L16 -8V8L10 3Q-4 7 -14 0Z" fill="#9DB4BC" />
    <path d="M-12 -1Q-2 -5 8 -2" stroke="#D7E3E6" strokeWidth="1.5" fill="none" />
  </g>
);

export const School = ({f, cx, cy, n = 60, rx = 160, ry = 90, seed, pull = 0, to = [0, 0], dir = 1}: {f: number; cx: number; cy: number; n?: number; rx?: number; ry?: number; seed: string; pull?: number; to?: P; dir?: 1 | -1}) => (
  <g>
    {Array.from({length: n}).map((_, i) => {
      const r = (k: string) => random(`${seed}-${i}-${k}`);
      const a = r("a") * Math.PI * 2 + f * 0.012 * dir;
      const d = Math.sqrt(r("d"));
      const x0 = cx + Math.cos(a) * rx * d;
      const y0 = cy + Math.sin(a) * ry * d;
      const p = Math.min(1, Math.max(0, pull * 1.4 - r("p") * 0.4));
      const x = x0 + (to[0] - x0) * p;
      const y = y0 + (to[1] - y0) * p;
      return <Fish key={i} x={x} y={y} s={0.7 + r("s") * 0.6} r={dir > 0 ? 180 : 0} o={1 - p} />;
    })}
  </g>
);

// Krill: a swarm of tiny rust-orange specks.
export const Krill = ({f, cx, cy, n = 140, rx = 200, ry = 120, seed, o = 1}: {f: number; cx: number; cy: number; n?: number; rx?: number; ry?: number; seed: string; o?: number}) => (
  <g opacity={o}>
    {Array.from({length: n}).map((_, i) => {
      const r = (k: string) => random(`${seed}-k-${i}-${k}`);
      const a = r("a") * Math.PI * 2 + Math.sin(f * 0.02 + i) * 0.2;
      const d = Math.sqrt(r("d"));
      return <circle key={i} cx={cx + Math.cos(a) * rx * d} cy={cy + Math.sin(a) * ry * d} r={1.6 + r("r") * 2.2} fill={r("c") > 0.5 ? "#C47A5E" : "#9A6A58"} opacity={0.6 + r("o") * 0.4} />;
    })}
  </g>
);

// ---- Humpback seen from above, head pointing along +x. Origin at the middle of the body; about 420 long.
export const TopWhale = ({f, x, y, s = 1, r = 0, tag = false}: {f: number; x: number; y: number; s?: number; r?: number; tag?: boolean}) => {
  const beat = Math.sin(f * 0.12) * 10;
  const body = spline([[210, 0], [190, -26], [120, -46], [20, -52], [-80, -40], [-160, -18], [-190, 0], [-160, 18], [-80, 40], [20, 52], [120, 46], [190, 26]], true);
  const blink = Math.sin(f * 0.26) > 0.2 ? 1 : 0.2;
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <ellipse cx="10" cy="12" rx="210" ry="60" fill="#000" opacity="0.3" />
      <g transform={`rotate(${beat} -185 0)`}>
        <path d="M-180 0Q-220 -10 -250 -64Q-228 -40 -206 -36Q-214 -12 -196 0Q-214 12 -206 36Q-228 40 -250 64Q-220 10 -180 0Z" fill="#2C2D2F" />
      </g>
      {/* Long flippers */}
      <path d={`M70 -40Q20 ${-130 - beat * 0.4} -40 -160Q-10 -110 30 -40Z`} fill="#6F7374" />
      <path d={`M70 40Q20 ${130 + beat * 0.4} -40 160Q-10 110 30 40Z`} fill="#6F7374" />
      <path d={body} fill={C.whale} />
      <path d="M190 -10Q100 -36 -100 -26" stroke="#5B6064" strokeWidth="18" fill="none" opacity="0.5" strokeLinecap="round" />
      <path d={body} fill="none" stroke={C.rim} strokeWidth="3" />
      {[150, 120, 90, 160, 130].map((kx, i) => (
        <circle key={i} cx={kx} cy={(i % 2 ? -1 : 1) * (6 + i * 3)} r="3.5" fill="#28292B" />
      ))}
      {tag && (
        <g>
          <circle cx="-20" cy="0" r="12" fill={C.green} opacity={0.25 * blink} />
          <circle cx="-20" cy="0" r="5" fill="#D9FBE7" opacity={blink} />
        </g>
      )}
    </g>
  );
};

// ---- Kayak with a paddler, side on, bow to the right. Origin on the waterline at the middle.
export const Kayak = ({f, x, y, s = 1, r = 0}: {f: number; x: number; y: number; s?: number; r?: number}) => {
  const stroke = Math.sin(f * 0.16) * 22;
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M-150 -6Q-60 -22 150 -10Q120 14 -120 12Z" fill={C.bus} />
      <path d="M-140 -8Q-40 -18 140 -10" stroke="#E5BD5A" strokeWidth="4" fill="none" />
      <path d="M-10 -14Q-14 -46 0 -58Q14 -46 12 -14Z" fill="#094513" />
      <circle cx="2" cy="-70" r="11" fill="#094513" />
      <circle cx="7" cy="-72" r="3.5" fill={C.green} />
      <line x1={-40 - stroke} y1={-70 + stroke * 0.6} x2={44 + stroke} y2={-10 - stroke * 0.6} stroke="#7B8589" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="0" cy="14" rx="140" ry="6" fill="#000" opacity="0.25" />
    </g>
  );
};

// ---- Orca, side on, facing left. Origin at the snout. About 520 long.
export const Orca = ({f, x, y, s = 1, r = 0}: {f: number; x: number; y: number; s?: number; r?: number}) => {
  const tail = Math.sin(f * 0.18) * 14;
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d={`M440 -6Q480 ${-40 + tail} 520 ${-50 + tail}Q500 ${-10 + tail} 470 0Q500 ${10 + tail} 520 ${50 + tail}Q480 ${40 + tail} 440 6Z`} fill="#0D0F10" />
      <path d="M0 6Q10 -30 80 -46Q200 -66 330 -40Q420 -20 450 0Q420 22 330 34Q200 50 90 44Q20 36 0 6Z" fill="#111314" />
      <path d="M190 -58Q210 -150 236 -170Q236 -110 250 -56Z" fill="#111314" />
      <path d="M20 20Q100 46 220 40Q160 22 60 14Z" fill="#D7DCDC" />
      <path d="M70 -24Q100 -34 130 -22Q102 -14 70 -24Z" fill="#E8ECEC" />
      <path d="M160 30Q190 70 230 80Q210 50 196 30Z" fill="#0B0C0D" />
      <path d="M60 -40Q200 -64 330 -40" stroke="#3E4448" strokeWidth="8" fill="none" opacity="0.6" strokeLinecap="round" />
    </g>
  );
};

// ---- Tiger shark, side on, facing left, about 4.5 m. Origin at the snout. About 460 long.
export const Shark = ({f, x, y, s = 1}: {f: number; x: number; y: number; s?: number}) => {
  const tail = Math.sin(f * 0.15) * 12;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M380 -4L460 ${-70 + tail}L436 0L452 ${44 + tail}Z`} fill="#3F4548" />
      <path d="M0 8Q20 -26 110 -34Q260 -40 390 -6Q300 30 120 34Q30 32 0 8Z" fill="#4A5054" />
      <path d="M160 -36L200 -96L226 -32Z" fill="#3F4548" />
      <path d="M120 26L150 70L176 28Z" fill="#3F4548" />
      {[150, 190, 230, 270, 310].map((sx) => (
        <path key={sx} d={`M${sx} -32Q${sx + 8} -18 ${sx - 2} -6`} stroke="#2C3033" strokeWidth="5" fill="none" opacity="0.7" />
      ))}
      <path d="M10 14Q120 34 300 14" stroke="#7E868A" strokeWidth="6" fill="none" opacity="0.5" />
      <circle cx="40" cy="-6" r="3" fill="#0B0C0D" />
    </g>
  );
};

// ---- Phone or camera recording overlay, pinned to the screen: white corners, red REC dot, running time.
export const RecFrame = ({f, start, o = 1}: {f: number; start: number; o?: number}) => {
  const t = Math.max(0, f - start) / 30;
  const a = 60;
  const [x0, y0, x1, y1] = [70, 70, 1850, 1010];
  const corners = [`M${x0} ${y0 + a}V${y0}H${x0 + a}`, `M${x1 - a} ${y0}H${x1}V${y0 + a}`, `M${x0} ${y1 - a}V${y1}H${x0 + a}`, `M${x1 - a} ${y1}H${x1}V${y1 - a}`];
  const on = Math.floor(f / 15) % 2 === 0;
  return (
    <div style={{position: "absolute", inset: 0, opacity: o}}>
      <svg width="1920" height="1080" style={{position: "absolute"}}>
        {corners.map((d) => (
          <path key={d} d={d} stroke="#E8ECEC" strokeWidth="5" fill="none" opacity="0.8" />
        ))}
        <circle cx="128" cy="128" r="14" fill={C.red} opacity={on ? 1 : 0.25} />
      </svg>
      <div style={{position: "absolute", left: 156, top: 106, fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#E8ECEC", letterSpacing: 2}}>
        REC {`00:${String(Math.floor(t)).padStart(2, "0")}`}
      </div>
    </div>
  );
};

// ---- Postcard with a whale tail on it. Origin at its center, 520 x 340.
export const Postcard = ({x, y, s = 1, r = 0}: {x: number; y: number; s?: number; r?: number}) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <rect x="-266" y="-166" width="532" height="342" rx="10" fill="#000" opacity="0.35" />
    <rect x="-260" y="-170" width="520" height="340" rx="10" fill="#E9E4D8" />
    <rect x="-236" y="-146" width="300" height="292" rx="4" fill="#0E2A36" />
    <path d="M-236 40H64V146H-236Z" fill="#132F3B" />
    <path d="M-86 40Q-90 -10 -116 -40Q-150 -60 -180 -52Q-140 -40 -122 0Q-110 20 -100 40ZM-86 40Q-82 -10 -56 -40Q-22 -60 8 -52Q-32 -40 -50 0Q-62 20 -72 40Z" fill="#393A3C" />
    <path d="M-110 40H-62" stroke="#6E98A6" strokeWidth="3" />
    <rect x="150" y="-146" width="86" height="100" rx="3" fill="none" stroke={C.red} strokeWidth="4" strokeDasharray="6 5" />
    {[0, 1, 2].map((k) => (
      <line key={k} x1="90" x2="236" y1={20 + k * 40} y2={20 + k * 40} stroke="#9A958A" strokeWidth="3" />
    ))}
  </g>
);

// ---- Cast net (വീശുവല), open, seen from the side. Origin at the top knot. About 240 across.
export const CastNet = ({x, y, s = 1, o = 1}: {x: number; y: number; s?: number; o?: number}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    {Array.from({length: 9}).map((_, i) => {
      const bx = -120 + i * 30;
      return <path key={i} d={`M0 0Q${bx * 0.5} 70 ${bx} 170`} stroke={C.rule} strokeWidth="2" fill="none" opacity="0.8" />;
    })}
    {[50, 100, 150].map((h) => (
      <path key={h} d={`M${(-120 * h) / 170} ${h}Q0 ${h + 16} ${(120 * h) / 170} ${h}`} stroke={C.rule} strokeWidth="2" fill="none" opacity="0.6" />
    ))}
    {Array.from({length: 9}).map((_, i) => (
      <circle key={i} cx={-120 + i * 30} cy={170 + (i % 2) * 4} r="5" fill="#7B8589" />
    ))}
    <circle cx="0" cy="0" r="6" fill={C.rule} />
  </g>
);

// ---- Small plane silhouette, nose right.
export const Plane = ({x, y, s = 1}: {x: number; y: number; s?: number}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-90 -6H70Q96 -6 104 0Q96 6 70 6H-90Z" fill="#C9CCCB" />
    <path d="M-10 -4L-40 -60H-20L30 -4ZM-10 4L-40 60H-20L30 4Z" fill="#ADBBC2" />
    <path d="M-80 -4L-96 -34H-84L-60 -4Z" fill="#ADBBC2" />
  </g>
);

// ---- Segmented meter from frames 6a to 6c: 13 segments in a dark housing, 186 x 622.
export const Meter = ({x, y, lit, s = 1}: {x: number; y: number; lit: number; s?: number}) => {
  const seg = (i: number) => (i < 8 ? C.green : i < 11 ? C.amber : C.red);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect width="186" height="622" rx="20" fill={C.meterHousing} />
      {Array.from({length: 13}).map((_, i) => (
        <rect key={i} x="24" y={584 - (i + 1) * 45 + 12} width="138" height="36" rx="5" fill={i < Math.floor(lit) ? seg(i) : C.meterEmpty} />
      ))}
    </g>
  );
};

// ---- Rotated red outlined stamp (frame 6c).
export const Stamp = ({text, x, y, size = 64, p = 1}: {text: string; x: number; y: number; size?: number; p?: number}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `translate(-50%, -50%) rotate(-8deg) scale(${1.5 - 0.5 * p})`,
      opacity: p,
      border: `6px solid ${C.red}`,
      borderRadius: 6,
      padding: "6px 30px 10px",
      fontFamily: FONT,
      fontWeight: 900,
      fontSize: size,
      color: C.red,
      background: "rgba(39,21,22,0.55)",
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

// ---- Splash: white spray thrown up from the water line at (x, y). p runs 0 to 1 over its life.
export const Splash = ({x, y, p, w = 1, seed}: {x: number; y: number; p: number; w?: number; seed: string}) => {
  if (p <= 0 || p >= 1) return null;
  return (
    <g>
      {Array.from({length: 26}).map((_, i) => {
        const r = (k: string) => random(`${seed}-${i}-${k}`);
        const ang = -Math.PI / 2 + (r("a") - 0.5) * 1.8;
        const v = (180 + r("v") * 260) * w;
        const t = p;
        const px = x + Math.cos(ang) * v * t;
        const py = y + Math.sin(ang) * v * t + 520 * w * t * t;
        return <circle key={i} cx={px} cy={Math.min(py, y + 6)} r={(5 + r("r") * 12) * w * (1 - t * 0.5)} fill="#E8ECEC" opacity={0.75 * (1 - t)} />;
      })}
      <ellipse cx={x} cy={y} rx={160 * w * (0.4 + p)} ry={14 * w} fill="#E8ECEC" opacity={0.5 * (1 - p)} />
    </g>
  );
};
