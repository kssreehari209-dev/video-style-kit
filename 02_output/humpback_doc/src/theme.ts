import {Easing, interpolate} from "remotion";
import {loadFont as loadLatin} from "@remotion/google-fonts/Montserrat";
import {loadFont as loadMalayalam} from "@remotion/google-fonts/NotoSansMalayalam";

const latin = loadLatin("normal", {weights: ["900"], subsets: ["latin"]});
const malayalam = loadMalayalam("normal", {weights: ["900"], subsets: ["malayalam"]});

// Latin first: numbers and units take Montserrat, Malayalam falls through to Noto.
export const FONT = `${latin.fontFamily}, ${malayalam.fontFamily}, sans-serif`;

// Exact values from the style guide's palette table.
export const C = {
  deep: "#03090D",
  mid: "#0B1F28",
  teal: "#0C2B3A",
  title: "#F1EFEB",
  selected: "#FFFCFD",
  dim: "#BABDBA",
  scale: "#F9F7F2",
  red: "#DB4043",
  redFill: "#271516",
  maroon: "#512123",
  green: "#48CD80",
  amber: "#DFB33B",
  pill: "#131517",
  rule: "#ADBBC2",
  bus: "#C99629",
  busWindow: "#2B3635",
  whale: "#393A3C",
  rim: "#3C484E",
  squid: "#674337",
  meterHousing: "#212A31",
  meterEmpty: "#2D363E",
};

export const SNAP = 9; // the guide's 300 ms ease-out entrance at 30 fps

export const snap = (f: number, start: number, dur = SNAP) =>
  interpolate(f, [start, start + dur], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const lerp = (f: number, a: number, b: number, from: number, to: number) =>
  interpolate(f, [a, b], [from, to], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

export type P = [number, number];

// Catmull-Rom spline through the points, as cubic Beziers.
export const spline = (pts: P[], closed: boolean) => {
  const at = (i: number) => (closed ? pts[(i + pts.length) % pts.length] : pts[Math.max(0, Math.min(pts.length - 1, i))]);
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  const last = closed ? pts.length : pts.length - 1;
  for (let i = 0; i < last; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const c1: P = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: P = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + (closed ? "Z" : "");
};
