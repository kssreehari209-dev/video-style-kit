import React from "react";
import {C, FONT, P, spline} from "./theme";

// Ambergris lump. No guide color exists, so it uses the guide's elephant greys.
// Local space is centered on the lump, about 400 wide.
const LUMP: P[] = [
  [-200, 40], [-198, -12], [-170, -58], [-120, -92], [-62, -122], [2, -130], [60, -114], [94, -84],
  [132, -76], [178, -50], [208, -6], [214, 40], [188, 78], [120, 96], [30, 104], [-70, 100], [-150, 90],
];

export const Lump = ({id, scale = 1, shadow = true}: {id: string; scale?: number; shadow?: boolean}) => {
  const d = spline(LUMP, true);
  const region = {filterUnits: "userSpaceOnUse" as const, x: -320, y: -240, width: 640, height: 480};
  return (
    <g transform={`scale(${scale})`}>
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={d} />
        </clipPath>
        <linearGradient id={`${id}-base`} x1="0.3" x2="0.6" y1="0" y2="1">
          <stop offset="0" stopColor="#7A7E80" />
          <stop offset="0.55" stopColor="#555A5D" />
          <stop offset="1" stopColor="#2C3033" />
        </linearGradient>
        <filter id={`${id}-soft`} {...region}>
          <feGaussianBlur stdDeviation="22" />
        </filter>
        <filter id={`${id}-glow`} {...region}>
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="3" seed="4" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.1  0 0 0 0 0.1  2 0 0 0 -0.9" />
        </filter>
      </defs>
      {shadow && <ellipse cx="6" cy="104" rx="226" ry="26" fill="#000" opacity="0.7" filter={`url(#${id}-glow)`} />}
      <path d={d} fill={`url(#${id}-base)`} />
      <g clipPath={`url(#${id}-clip)`}>
        {/* Painted soft light: top highlight, a second lobe, shadow underneath, teal bounce */}
        <ellipse cx="-50" cy="-82" rx="120" ry="44" fill="#B4B8B8" opacity="0.5" filter={`url(#${id}-soft)`} />
        <ellipse cx="128" cy="-44" rx="66" ry="28" fill="#B4B8B8" opacity="0.3" filter={`url(#${id}-soft)`} />
        <ellipse cx="0" cy="96" rx="230" ry="46" fill="#000" opacity="0.5" filter={`url(#${id}-soft)`} />
        <path d="M-180 84Q0 110 186 72" stroke={C.rim} strokeWidth="10" fill="none" opacity="0.8" filter={`url(#${id}-glow)`} />
        {/* Waxy dents and cracks */}
        {[[-92, -18, 30, 13], [40, 8, 38, 15], [122, 22, 20, 9], [-30, 52, 24, 9]].map(([x, y, rx, ry]) => (
          <g key={x}>
            <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#000" opacity="0.2" filter={`url(#${id}-glow)`} />
            <ellipse cx={x + 3} cy={y + 8} rx={rx * 0.8} ry={ry * 0.5} fill="#8A8E90" opacity="0.14" filter={`url(#${id}-glow)`} />
          </g>
        ))}
        <path d="M-150 -6Q-110 8 -74 -8T-10 -2" stroke="#1F2124" strokeWidth="2.5" fill="none" opacity="0.5" strokeLinecap="round" />
        <path d="M46 -70Q60 -36 96 -34T150 -6" stroke="#1F2124" strokeWidth="2.5" fill="none" opacity="0.45" strokeLinecap="round" />
        <rect x="-220" y="-140" width="440" height="260" filter={`url(#${id}-grain)`} opacity="0.32" />
      </g>
    </g>
  );
};

// Newspaper clipping with a torn edge. No masthead or paper name: only script phrases.
// Paper color is not in the guide, so it is a dimmed version of the guide's cream.
const tear = (w: number, h: number, seed: number): string => {
  const r = (i: number) => Math.abs(Math.sin(seed * 12.9 + i * 78.2)) * 9;
  const pts: string[] = [];
  const n = 26;
  for (let i = 0; i <= n; i++) pts.push(`${(w * i) / n},${r(i)}`);
  for (let i = 1; i <= 16; i++) pts.push(`${w - r(i + 40)},${(h * i) / 16}`);
  for (let i = n - 1; i >= 0; i--) pts.push(`${(w * i) / n},${h - r(i + 80)}`);
  for (let i = 15; i >= 1; i--) pts.push(`${r(i + 120)},${(h * i) / 16}`);
  return pts.join(" ");
};

export const Clipping = ({id, w, h, x, y, rotate, p, headline, lines = 1, size, seed, dim = 1, children}: {id: string; w: number; h: number; x: number; y: number; rotate: number; p: number; headline: React.ReactNode; lines?: number; size: number; seed: number; dim?: number; children?: React.ReactNode}) => {
  const columns = 3;
  const gap = 26;
  const pad = 34;
  const colW = (w - pad * 2 - gap * (columns - 1)) / columns;
  const headH = size * 1.4 * lines + 30;
  const bars = Math.max(0, Math.floor((h - pad * 2 - headH - 8) / 20));
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        opacity: p,
        transform: `rotate(${rotate}deg) scale(${1.14 - 0.14 * p})`,
        filter: `brightness(${dim})`,
      }}
    >
      <svg width={w + 80} height={h + 80} style={{position: "absolute", left: -40, top: -40, overflow: "visible"}}>
        <defs>
          <linearGradient id={`${id}-paper`} x1="0.1" x2="0.8" y1="0" y2="1">
            <stop offset="0" stopColor="#CFCBC0" />
            <stop offset="0.6" stopColor="#B4B1A7" />
            <stop offset="1" stopColor="#8E8C84" />
          </linearGradient>
          <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
          <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={seed} />
            <feColorMatrix type="matrix" values="0 0 0 0 0.2  0 0 0 0 0.19  0 0 0 0 0.17  1.5 0 0 0 -0.8" />
          </filter>
          <clipPath id={`${id}-clip`}>
            <polygon points={tear(w, h, seed)} />
          </clipPath>
        </defs>
        <g transform="translate(40 40)">
          <polygon points={tear(w, h, seed)} fill="#000" opacity="0.65" transform="translate(10 18)" filter={`url(#${id}-shadow)`} />
          <polygon points={tear(w, h, seed)} fill={`url(#${id}-paper)`} />
          <g clipPath={`url(#${id}-clip)`}>
            <rect width={w} height={h} filter={`url(#${id}-grain)`} opacity="0.3" />
            {/* Body text is drawn as grey bars, so no invented wording appears */}
            {Array.from({length: columns}).map((_, c) =>
              Array.from({length: bars}).map((__, b) => (
                <rect
                  key={`${c}-${b}`}
                  x={pad + c * (colW + gap)}
                  y={pad + headH + 8 + b * 20}
                  width={colW * (b === bars - 1 ? 0.55 : 0.86 + 0.14 * Math.abs(Math.sin((b + 1) * (c + 2) * seed)))}
                  height="7"
                  rx="2"
                  fill="#55544E"
                  opacity="0.55"
                />
              )),
            )}
          </g>
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          left: pad,
          top: pad - 6,
          width: w - pad * 2,
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: size,
          lineHeight: 1.4,
          color: "#16181A",
          whiteSpace: "pre-line",
        }}
      >
        {headline}
      </div>
      {children}
    </div>
  );
};
