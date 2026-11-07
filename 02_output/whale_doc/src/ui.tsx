import React from "react";
import {Fixed} from "./cam";
import {C, FONT, snap} from "./theme";

// Sizes come from the guide's 1080p estimates: titles 64, scale labels 48.

export const Title = ({text, frame, start, top = 87, size = 64, color = C.title, world = false}: {text: string; frame: number; start: number; top?: number; size?: number; color?: string; world?: boolean}) => {
  const p = snap(frame, start);
  const Layer = world ? React.Fragment : Fixed;
  return (
    <Layer>
    <div
      style={{
        position: "absolute",
        top,
        width: "100%",
        textAlign: "center",
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.35,
        color,
        textShadow: "0 3px 10px rgba(0,0,0,0.55)",
        opacity: p,
        transform: `scale(${0.92 + 0.08 * p})`,
      }}
    >
      {text}
    </div>
    </Layer>
  );
};

export const ScaleLabel = ({text, frame, start, top = 620, left = 0, width = 1920, size = 48}: {text: string; frame: number; start: number; top?: number; left?: number; width?: number; size?: number}) => {
  const p = snap(frame, start);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width,
        textAlign: "center",
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.33,
        color: C.scale,
        opacity: p,
        transform: `scale(${0.85 + 0.15 * p})`,
      }}
    >
      {text}
    </div>
  );
};

export const Rule = ({frame, start, y = 598, half = 595, cx = 960}: {frame: number; start: number; y?: number; half?: number; cx?: number}) => {
  const p = snap(frame, start);
  return <div style={{position: "absolute", left: cx - half * p, width: 2 * half * p, top: y, height: 4, borderRadius: 2, background: C.rule}} />;
};

export const RedCaption = ({text, frame, start, top = 736, size = 48}: {text: string; frame: number; start: number; top?: number; size?: number}) => {
  const p = snap(frame, start);
  return (
    <div style={{position: "absolute", top, width: "100%", textAlign: "center", opacity: p, transform: `scale(${0.92 + 0.08 * p})`}}>
      <span style={{display: "inline-block", position: "relative", fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.3, color: C.red}}>
        {text}
        <span style={{position: "absolute", left: 0, bottom: -6, height: 5, width: `${100 * p}%`, background: C.red}} />
      </span>
    </div>
  );
};

// Dark rounded label pill, as on the radial diagram. Centered on (x, y).
export const Pill = ({text, x, y, frame, start, size = 40, color = C.title}: {text: string; x: number; y: number; frame: number; start: number; size?: number; color?: string}) => {
  const p = snap(frame, start);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * p})`,
        opacity: p,
        background: C.pill,
        borderRadius: 14,
        padding: "10px 26px 12px",
        whiteSpace: "nowrap",
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.3,
        color,
      }}
    >
      {text}
    </div>
  );
};

// Red corner marks: 3 px stroke and 28 px arms at 720p, so 4.5 and 42 here.
export const Brackets = ({x, y, w, h, opacity = 1}: {x: number; y: number; w: number; h: number; opacity?: number}) => {
  const a = 42;
  const corners = [
    `M${x} ${y + a}V${y}H${x + a}`,
    `M${x + w - a} ${y}H${x + w}V${y + a}`,
    `M${x} ${y + h - a}V${y + h}H${x + a}`,
    `M${x + w - a} ${y + h}H${x + w}V${y + h - a}`,
  ];
  return (
    <svg width="1920" height="1080" style={{position: "absolute", opacity}}>
      {corners.map((d) => (
        <path key={d} d={d} stroke={C.red} strokeWidth="4.5" fill="none" />
      ))}
    </svg>
  );
};

// Thick red line through the middle that overshoots the text slightly (frames 3c, 3d).
export const Strike = ({children, p, size = 64, color = C.title}: {children: React.ReactNode; p: number; size?: number; color?: string}) => (
  <span style={{position: "relative", display: "inline-block", fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.3, color, opacity: 1 - 0.45 * p}}>
    {children}
    <span style={{position: "absolute", left: -14, top: "54%", height: 8, width: `calc(${100 * p}% + ${28 * p}px)`, background: C.red, borderRadius: 2}} />
  </span>
);

// Selected option box: dark red fill, red border (frame 3b).
export const RedBox = ({text, x, y, w, h = 111, size = 48, frame, start}: {text: string; x: number; y: number; w: number; h?: number; size?: number; frame: number; start: number}) => {
  const p = snap(frame, start);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        boxSizing: "border-box",
        border: `3px solid ${C.red}`,
        borderRadius: 12,
        background: C.redFill,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        whiteSpace: "nowrap",
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size,
        color: C.selected,
        opacity: p,
        transform: `scale(${0.95 + 0.05 * p})`,
      }}
    >
      {text}
    </div>
  );
};
