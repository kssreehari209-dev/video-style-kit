// Original side-view humpback. Head points left; use `flip` in W to face right.
// Local space: x 0 (snout) to about 1000 (fluke tip), y 0 near the body's midline.
// The back uses the guide's side-view whale colors. The pale throat and flipper are invented,
// built from the guide's greys. Soft light follows rule 11: painted over flat shapes.
import {P, spline} from "./theme";

const BODY = "#393A3C";
const RIM = "#3C484E";
const TAIL = "#232426";
const LINE = "#1F2022";
const PALE = "#8F9494";

const TOP: P[] = [
  [3, 8], [16, -4], [60, -15], [120, -24], [172, -38], [214, -50], [280, -72], [350, -87], [430, -90], [510, -83],
  [580, -71], [622, -68], [646, -86], [668, -94], [686, -72], [704, -56], [760, -42], [820, -28], [870, -16], [900, -12],
];
const REAR_BOTTOM: P[] = [[900, 10], [850, 18], [780, 32], [700, 52], [620, 74], [540, 96], [460, 112], [380, 120], [306, 119]];
const FRONT_BOTTOM: P[] = [[306, 119], [220, 106], [140, 84], [70, 58], [24, 36], [6, 20]];
// Mouth line, snout to hinge: arches up, then dips below the eye.
const MOUTH: P[] = [[6, 16], [60, 8], [120, 8], [180, 14], [230, 26], [262, 40]];
const HINGE: P = [262, 40];
const FLUKE: P[] = [
  [884, -12], [924, -30], [966, -66], [1012, -82], [1002, -50], [990, -34], [982, -14], [970, -4],
  [984, 16], [994, 28], [1000, 52], [1008, 80], [962, 60], [922, 32], [884, 10],
];
// Long flipper, about a third of the body. Local to the shoulder at (0, 0), swept back and down.
const FIN_LEAD: P[] = [[-16, 4], [10, 50], [46, 92], [88, 134], [132, 172], [180, 206], [232, 232], [264, 242]];
const FIN_TRAIL: P[] = [[250, 222], [205, 190], [160, 148], [120, 104], [86, 62], [56, 22], [30, -8]];
const SHOULDER: P = [306, 86];

// Knobs on the head, each around a hair follicle.
const KNOBS_TOP: [number, number, number][] = [
  [34, -3, 4], [66, -7, 4.5], [100, -11, 4.5], [134, -15, 4.5], [52, 3, 3.5], [88, 0, 4], [124, -2, 4], [158, -6, 4], [192, -18, 4], [162, -24, 3.5], [226, -28, 3.5],
];
const KNOBS_CHIN: [number, number, number][] = [[24, 27, 4], [50, 34, 4.5], [82, 38, 4.5], [40, 44, 3.5], [70, 52, 3.5], [114, 40, 4]];

// Swimming wave: strongest at the flukes, still at the head.
const wave = (x: number, phase: number, amp: number) => {
  const k = Math.max(0, x / 1000);
  return amp * k * k * k * Math.sin(phase - x * 0.006);
};

// The flipper's bumpy leading edge: extra points pushed in and out along the edge.
const bumpy = (pts: P[]) => {
  const out: P[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [a, b] = [pts[i], pts[i + 1]];
    const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
    const n = Math.hypot(dx, dy);
    out.push(a);
    out.push([a[0] + dx * 0.5 - (dy / n) * 5, a[1] + dy * 0.5 + (dx / n) * 5]);
  }
  out.push(pts[pts.length - 1]);
  return out;
};

// Still outline of the body, for clipping things drawn inside the whale.
export const OUTLINE = spline([...TOP, ...REAR_BOTTOM, ...FRONT_BOTTOM.slice(1)], true);
// The long flipper on its own, local to the shoulder, for close-ups.
export const FIN_PATH = spline([...bumpy(FIN_LEAD), ...FIN_TRAIL], true);

type Props = {frame: number; id: string; speed?: number; amp?: number; gape?: number; finSwing?: number; silhouette?: boolean; glow?: number; lite?: boolean; swell?: number};

// Underside of the body, snout to tail, for the throat pouch.
const UNDER: P[] = [...[...FRONT_BOTTOM].reverse(), ...[...REAR_BOTTOM].reverse().slice(1)];
const underY = (x: number) => {
  for (let i = 0; i < UNDER.length - 1; i++) {
    const [a, b] = [UNDER[i], UNDER[i + 1]];
    if (x >= a[0] && x <= b[0]) return a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0]);
  }
  return UNDER[UNDER.length - 1][1];
};

// lite drops the blurred light layers. Use it when the camera is zoomed in far: a blur that large is very slow to draw.
// swell (0 to 1) fills the pleated throat like a balloon.
export const Humpback = ({frame, id, speed = 0.07, amp = 34, gape = 0, finSwing = 7, silhouette = false, lite = false, swell = 0}: Props) => {
  const phase = frame * speed;
  const bend = (pts: P[]): P[] => pts.map(([x, y]) => [x, y + wave(x, phase, amp)]);
  const jawAngle = 24 * gape;
  const upper = spline([...bend(TOP), ...bend(REAR_BOTTOM), HINGE, ...[...MOUTH].reverse().slice(1)], true);
  const lower = spline([...MOUTH, [306, 119], ...FRONT_BOTTOM.slice(1)], true);
  const whole = spline(bend([...TOP, ...REAR_BOTTOM, ...FRONT_BOTTOM.slice(1)]), true);
  const fluke = spline(bend(FLUKE), true);
  const back = spline(bend(TOP), false);
  const belly = spline(bend([...REAR_BOTTOM, ...FRONT_BOTTOM.slice(1)]), false);
  const fin = spline([...bumpy(FIN_LEAD), ...FIN_TRAIL], true);
  const finTurn = -14 + Math.sin(frame * 0.03) * finSwing;
  const jaw = `rotate(${-jawAngle} ${HINGE[0]} ${HINGE[1]})`;
  const region = {filterUnits: "userSpaceOnUse" as const, x: -120, y: -260, width: 1300, height: 640};

  if (silhouette) {
    return (
      <g>
        <path d={fluke} fill="currentColor" />
        <path d={whole} fill="currentColor" />
        <g transform={`translate(${SHOULDER[0]} ${SHOULDER[1]}) rotate(${finTurn})`}>
          <path d={fin} fill="currentColor" />
        </g>
      </g>
    );
  }

  // Throat grooves run from the chin back to the navel.
  const groove = (i: number, x0: number, x1: number) => {
    const pts: P[] = [];
    for (let x = x0; x <= x1; x += 30) {
      const t = (x - 20) / 480;
      const edge = 28 + 92 * Math.sin(Math.min(1, t * 1.25) * 1.45);
      pts.push([x, edge - 7 - i * 8.5 + t * i * 2]);
    }
    return spline(pts, false);
  };
  const GROOVES = [0, 1, 2, 3, 4, 5];

  // Inside the open mouth: the wedge between the top lip and the dropped lip.
  const rad = (jawAngle * Math.PI) / 180;
  const drop = ([x, y]: P): P => {
    const [dx, dy] = [x - HINGE[0], y - HINGE[1]];
    return [HINGE[0] + dx * Math.cos(rad) + dy * Math.sin(rad), HINGE[1] - dx * Math.sin(rad) + dy * Math.cos(rad)];
  };
  const wedge = spline([...MOUTH, ...[...MOUTH].reverse().slice(1, -1).map(drop), drop(MOUTH[0])], true);
  // Baleen hangs from the upper jaw as a fringe of thin plates. No teeth.
  const plates: [number, number, number, number][] = [];
  for (let x = 12; x < 252; x += 4.4) {
    let y = 16;
    for (let i = 0; i < MOUTH.length - 1; i++) {
      const [a, b] = [MOUTH[i], MOUTH[i + 1]];
      if (x >= a[0] && x <= b[0]) y = a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0]);
    }
    const gap = (HINGE[0] - x) * Math.tan(rad);
    // Plates differ a little in length and tone, so the fringe reads as bristle, not a comb.
    const n = Math.sin(x * 12.9898) * 43758.5453;
    const r = n - Math.floor(n);
    plates.push([x, y, Math.min(70, gap * 0.82) * (0.84 + 0.16 * r), 0.5 + 0.42 * r]);
  }

  return (
    <g>
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={upper} />
        </clipPath>
        <clipPath id={`${id}-jawclip`}>
          <path d={lower} />
        </clipPath>
        <linearGradient id={`${id}-fade`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={BODY} />
          <stop offset="0.55" stopColor={BODY} />
          <stop offset="0.78" stopColor="#2C2D2F" />
          <stop offset="1" stopColor={TAIL} />
        </linearGradient>
        <linearGradient id={`${id}-throat`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#4A4C4E" />
          <stop offset="0.5" stopColor="#6E7272" />
          <stop offset="1" stopColor={PALE} />
        </linearGradient>
        <linearGradient id={`${id}-fin`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#3F4042" />
          <stop offset="0.45" stopColor="#6F7374" />
          <stop offset="1" stopColor="#A7ABAA" />
        </linearGradient>
        <linearGradient id={`${id}-fluke`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={TAIL} />
          <stop offset="1" stopColor="#3A3C3E" />
        </linearGradient>
        <filter id={`${id}-soft`} {...region}>
          <feGaussianBlur stdDeviation="24" />
        </filter>
        <filter id={`${id}-glow`} {...region}>
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="17" />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1.6 0 0 0 -0.85" />
        </filter>
      </defs>

      <path d={fluke} fill={`url(#${id}-fluke)`} />
      <path d={upper} fill={RIM} />
      <g clipPath={`url(#${id}-clip)`}>
        {/* Body sits lower than the rim layer, leaving a thin rim light along the back. */}
        <path d={upper} fill={`url(#${id}-fade)`} transform="translate(2 4)" />
        {/* Pale belly fading back from the throat */}
        {!lite && <path d={spline([[290, 60], [380, 70], [470, 82], [540, 110], [440, 140], [290, 140]], true)} fill={PALE} opacity="0.62" filter={`url(#${id}-glow)`} />}
        {!lite && <path d={back} stroke="#62676C" strokeWidth="60" fill="none" opacity="0.5" transform="translate(0 36)" filter={`url(#${id}-soft)`} />}
        {!lite && <ellipse cx="130" cy="-16" rx="96" ry="22" fill="#6B7075" opacity="0.34" filter={`url(#${id}-soft)`} />}
        {!lite && <path d={belly} stroke="#000" strokeWidth="70" fill="none" opacity="0.26" transform="translate(0 -6)" filter={`url(#${id}-soft)`} />}
        {!lite && <path d={belly} stroke={RIM} strokeWidth="10" fill="none" opacity="0.7" filter={`url(#${id}-glow)`} />}
        {GROOVES.map((i) => (
          <path key={i} d={groove(i, 300, 470)} stroke={LINE} strokeWidth="2.6" strokeLinecap="round" fill="none" opacity="0.5" />
        ))}
        {/* Soft shadow the flipper casts on the flank */}
        <g transform={`translate(${SHOULDER[0] + 10} ${SHOULDER[1] - 16}) rotate(${finTurn})`}>
          {!lite && <path d={fin} fill="#000" opacity="0.34" filter={`url(#${id}-glow)`} />}
        </g>
        {!lite && <rect x="0" y="-140" width="1000" height="300" filter={`url(#${id}-grain)`} opacity="0.11" />}
      </g>

      {gape > 0 && (
        <g>
          <path d={wedge} fill="#120B0B" />
          {plates.map(([x, y, h, o]) => (
            <line key={x} x1={x} y1={y + 1} x2={x + 3} y2={y + h} stroke="#7C786C" strokeWidth="2.4" strokeLinecap="round" opacity={o} />
          ))}
        </g>
      )}

      {/* Top of the head */}
      {KNOBS_TOP.map(([x, y, r]) => (
        <g key={`${x}`}>
          <circle cx={x} cy={y} r={r} fill="#28292B" />
          <circle cx={x - r * 0.2} cy={y - r * 0.32} r={r * 0.5} fill="#5B5F63" opacity="0.8" />
        </g>
      ))}
      <path d="M170 -33q10 -6 22 -3" stroke={LINE} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      {/* Eye, just above the corner of the mouth */}
      <ellipse cx="288" cy="24" rx="11" ry="8" fill="#242527" />
      <circle cx="288" cy="24" r="5.5" fill="#050607" />
      <circle cx="286.4" cy="22.4" r="1.5" fill="#F1EFEB" />

      {swell > 0 && (() => {
        const xs: number[] = [];
        for (let x = 20; x <= 600; x += 20) xs.push(x);
        const sag = (x: number) => swell * 120 * Math.pow(Math.sin((Math.PI * (x - 20)) / 580), 0.8);
        const top: P[] = xs.map((x) => [x, underY(x) - 30]);
        const bot: P[] = xs.map((x) => [x, underY(x) + sag(x)]);
        const pouch = spline([...top, ...[...bot].reverse()], true);
        return (
          <g>
            <path d={pouch} fill={`url(#${id}-throat)`} />
            {[1, 2, 3, 4, 5, 6].map((k) => (
              <path key={k} d={spline(xs.map((x) => [x, underY(x) - 4 + (sag(x) + 4) * (k / 7)] as P), false)} stroke={LINE} strokeWidth="2.6" fill="none" opacity="0.5" />
            ))}
            <path d={spline(bot, false)} stroke="#B9BDBC" strokeWidth="3" fill="none" opacity="0.5" />
          </g>
        );
      })()}

      {/* Lower jaw and throat: this part drops when the mouth opens */}
      <g transform={jaw}>
        <path d={lower} fill={`url(#${id}-throat)`} />
        <g clipPath={`url(#${id}-jawclip)`}>
          {GROOVES.map((i) => (
            <path key={i} d={groove(i, 30, 306)} stroke={LINE} strokeWidth="2.6" strokeLinecap="round" fill="none" opacity="0.5" />
          ))}
          {!lite && <path d={spline(MOUTH, false)} stroke="#000" strokeWidth="26" fill="none" opacity="0.32" transform="translate(0 12)" filter={`url(#${id}-glow)`} />}
        </g>
        {KNOBS_CHIN.map(([x, y, r]) => (
          <g key={`${x}`}>
            <circle cx={x} cy={y} r={r} fill="#34363A" />
            <circle cx={x - r * 0.2} cy={y - r * 0.32} r={r * 0.5} fill="#7A7E80" opacity="0.8" />
          </g>
        ))}
      </g>
      {gape === 0 && <path d={spline(MOUTH, false)} stroke={LINE} strokeWidth="4" strokeLinecap="round" fill="none" />}

      <g transform={`translate(${SHOULDER[0]} ${SHOULDER[1]}) rotate(${finTurn})`}>
        <path d={fin} fill={`url(#${id}-fin)`} />
      </g>
    </g>
  );
};
