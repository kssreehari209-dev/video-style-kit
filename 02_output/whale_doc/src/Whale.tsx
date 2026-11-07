// Original side-view sperm whale. Head points left, the opposite of the reference's whale.
// Local space: x 0 (snout) to 1000 (fluke tip), y 0 on the body's midline.
// Colors are the guide's side-view values. Soft light follows rule 11: painted over flat shapes.
import {P, spline} from "./theme";

const BODY = "#393A3C";
const RIM = "#3C484E";
const TAIL = "#232426";
const FIN = "#2E2F31";
const LINE = "#1F2022";

const TOP: P[] = [
  [6, -30], [18, -66], [52, -88], [120, -100], [210, -108], [320, -112], [430, -108], [520, -98],
  [578, -92], [612, -112], [640, -98], [672, -78], [702, -74], [728, -60], [752, -56], [778, -42],
  [820, -28], [860, -17], [892, -13],
];
const BOTTOM: P[] = [
  [892, 11], [850, 19], [790, 34], [720, 54], [640, 76], [540, 92], [430, 100], [330, 98],
  [250, 86], [196, 66], [120, 50], [46, 42], [12, 22],
];
// Narrow lower jaw, slung under the head and shorter than it.
const JAW: P[] = [[64, 40], [58, 52], [78, 62], [130, 70], [190, 76], [240, 80], [262, 68], [200, 58], [130, 48]];
const PECTORAL: P[] = [[318, 66], [360, 78], [396, 112], [414, 150], [372, 134], [322, 108], [298, 80]];
const FLUKE: P[] = [
  [878, -14], [920, -30], [962, -64], [1000, -74], [986, -40], [964, -6],
  [980, 26], [988, 62], [946, 50], [908, 26], [878, 12],
];

// Sperm whale skin is wrinkled behind the head, so creases are short and irregular.
const CREASES: [number, number, number][] = [
  [-74, 400, 590], [-54, 470, 690], [-34, 380, 560], [-30, 610, 770], [-12, 430, 700],
  [8, 370, 520], [10, 560, 800], [30, 440, 640], [52, 390, 600], [66, 500, 660],
];

// Swimming wave: strongest at the flukes, still at the head.
const wave = (x: number, phase: number, amp: number) => {
  const k = Math.max(0, x / 1000);
  return amp * k * k * k * Math.sin(phase - x * 0.006);
};

export const Whale = ({frame, id, speed = 0.09, amp = 34, glow = 0, silhouette = false}: {frame: number; id: string; speed?: number; amp?: number; glow?: number; silhouette?: boolean}) => {
  const phase = frame * speed;
  const bend = (pts: P[]): P[] => pts.map(([x, y]) => [x, y + wave(x, phase, amp)]);
  const body = spline(bend([...TOP, ...BOTTOM]), true);
  const fluke = spline(bend(FLUKE), true);
  const back = spline(bend(TOP), false);
  const belly = spline(bend(BOTTOM), false);
  const pectoral = spline(PECTORAL, true);
  const jaw = spline(JAW, true);
  const region = {filterUnits: "userSpaceOnUse" as const, x: -120, y: -260, width: 1260, height: 520};

  if (silhouette) {
    return (
      <g>
        <path d={fluke} fill="currentColor" />
        <path d={body} fill="currentColor" />
        <path d={jaw} fill="currentColor" />
        <path d={pectoral} fill="currentColor" />
      </g>
    );
  }

  const ridge = (y: number, x0: number, x1: number) => {
    const pts: P[] = [];
    for (let x = x0; x <= x1; x += 34) pts.push([x, y + Math.sin(x * 0.05) * 3]);
    return spline(bend(pts), false);
  };

  return (
    <g>
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={body} />
        </clipPath>
        <linearGradient id={`${id}-fade`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={BODY} />
          <stop offset="0.5" stopColor={BODY} />
          <stop offset="0.75" stopColor="#2C2D2F" />
          <stop offset="1" stopColor={TAIL} />
        </linearGradient>
        <linearGradient id={`${id}-fin`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#3C3D40" />
          <stop offset="1" stopColor="#242527" />
        </linearGradient>
        <filter id={`${id}-soft`} {...region}>
          <feGaussianBlur stdDeviation="26" />
        </filter>
        <filter id={`${id}-glow`} {...region}>
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="11" />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1.6 0 0 0 -0.85" />
        </filter>
      </defs>

      <path d={fluke} fill={TAIL} />
      <path d={body} fill={RIM} />
      <g clipPath={`url(#${id}-clip)`}>
        {/* Body sits lower than the rim layer, leaving a thin rim light along the back. */}
        <path d={body} fill={`url(#${id}-fade)`} transform="translate(2 4)" />
        {/* Painted soft light: along the back, on the brow, shadow underneath, bounce on the belly */}
        <path d={back} stroke="#62676C" strokeWidth="64" fill="none" opacity="0.5" transform="translate(0 38)" filter={`url(#${id}-soft)`} />
        <ellipse cx="120" cy="-46" rx="100" ry="38" fill="#6B7075" opacity="0.38" filter={`url(#${id}-soft)`} />
        <path d={belly} stroke="#000" strokeWidth="84" fill="none" opacity="0.32" transform="translate(0 -22)" filter={`url(#${id}-soft)`} />
        <path d={belly} stroke={RIM} strokeWidth="12" fill="none" opacity="0.7" filter={`url(#${id}-glow)`} />
        {/* Soft shadow the fin casts on the flank */}
        <path d={pectoral} fill="#000" opacity="0.36" transform="translate(8 -14)" filter={`url(#${id}-glow)`} />
        {CREASES.map(([y, x0, x1]) => (
          <path key={`${y}-${x0}`} d={ridge(y, x0, x1)} stroke={LINE} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.26" />
        ))}
        <rect x="0" y="-140" width="1000" height="280" filter={`url(#${id}-grain)`} opacity="0.11" />
        {/* The brain sits far back in the head, near the eye */}
        {glow > 0 && <ellipse cx="258" cy="-6" rx="76" ry="44" fill="#E4E1DA" opacity={0.4 * glow} filter={`url(#${id}-soft)`} />}
      </g>

      <path d={jaw} fill="#2B2C2E" />
      <path d="M14 26Q70 50 130 50Q196 54 264 70" stroke={LINE} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d={pectoral} fill={`url(#${id}-fin)`} />

      {/* Small eye just above the end of the mouth, blowhole at the front of the head */}
      <circle cx="282" cy="40" r="6" fill="#050607" />
      <circle cx="280.5" cy="38.5" r="1.4" fill="#F1EFEB" />
      <path d="M30 -78q8 -5 16 -3" stroke={LINE} strokeWidth="3" strokeLinecap="round" fill="none" />
    </g>
  );
};
