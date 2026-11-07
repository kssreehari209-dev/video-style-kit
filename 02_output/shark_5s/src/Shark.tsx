// Original side-view Greenland shark. Head points right. Local space: x 0 (tail) to 1000 (snout).
// Colors are the guide's side-view whale values, because the guide has no shark colors.
type P = [number, number];

const BODY = "#393A3C";
const RIM = "#3C484E";
const TAIL = "#1E1F21";
const FIN = "#2F3032";
const LINE = "#1F2022";

const TOP: P[] = [
  [1000, 14], [996, -14], [975, -42], [925, -66], [840, -86], [730, -98], [620, -100],
  [520, -92], [420, -74], [320, -52], [240, -33], [185, -22], [150, -17],
];
const BOTTOM: P[] = [
  [150, 13], [185, 17], [240, 27], [320, 50], [420, 76], [520, 92], [620, 100],
  [720, 98], [820, 86], [900, 73], [955, 60], [990, 40],
];
const CAUDAL: P[] = [
  [195, -24], [130, -46], [70, -74], [26, -96], [36, -66], [60, -32], [88, -4],
  [76, 18], [66, 54], [104, 36], [140, 20], [195, 19],
];
const DORSAL_1: P[] = [[560, -88], [518, -106], [486, -126], [482, -102], [468, -76]];
const DORSAL_2: P[] = [[345, -48], [316, -62], [292, -78], [290, -58], [276, -34]];
const PELVIC: P[] = [[424, 70], [388, 88], [342, 104], [348, 82], [354, 54]];
const PECTORAL: P[] = [[818, 62], [772, 104], [728, 132], [712, 114], [734, 74], [772, 52]];

// Faint skin creases, as the reference creatures have: short and irregular, not full-length stripes.
const CREASES: [number, number, number][] = [
  [-66, 330, 620], [-48, 520, 860], [-30, 260, 470], [-12, 430, 780], [8, 300, 560],
  [24, 610, 770], [44, 240, 520], [62, 470, 720],
];

// Swimming wave: strongest at the tail, nearly still at the head.
const wave = (x: number, phase: number) => {
  const k = (1000 - x) / 1000;
  return 15 * k * k * Math.sin(phase + (1000 - x) * 0.0075);
};

const bend = (pts: P[], phase: number): P[] => pts.map(([x, y]) => [x, y + wave(x, phase)]);

// Catmull-Rom spline through the points, as cubic Beziers.
const spline = (pts: P[], closed: boolean) => {
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

// Sharp-tipped fin: straight base, curved edges meeting at the tip.
const fin = (pts: P[], phase: number) => {
  const [a, b, tip, c, e] = bend(pts, phase);
  return `M${a[0]} ${a[1]}Q${b[0]} ${b[1]} ${tip[0]} ${tip[1]}Q${c[0]} ${c[1]} ${e[0]} ${e[1]}Z`;
};

const caudal = (phase: number) => {
  const p = bend(CAUDAL, phase);
  return (
    `M${p[0][0]} ${p[0][1]}Q${p[1][0]} ${p[1][1]} ${p[2][0]} ${p[2][1]}L${p[3][0]} ${p[3][1]}` +
    `Q${p[4][0]} ${p[4][1]} ${p[5][0]} ${p[5][1]}Q${p[6][0]} ${p[6][1]} ${p[7][0]} ${p[7][1]}` +
    `L${p[8][0]} ${p[8][1]}Q${p[9][0]} ${p[9][1]} ${p[10][0]} ${p[10][1]}L${p[11][0]} ${p[11][1]}Z`
  );
};

const ridge = (y: number, x0: number, x1: number, phase: number) => {
  const pts: P[] = [];
  for (let x = x0; x <= x1; x += 40) pts.push([x, y * (0.55 + 0.45 * Math.sin(((x - 150) / 850) * Math.PI))]);
  return spline(bend(pts, phase), false);
};

export const Shark = ({frame, id, beam = false}: {frame: number; id: string; beam?: boolean}) => {
  const phase = frame * 0.17;
  const body = spline(bend([...TOP, ...BOTTOM], phase), true);
  const w = (x: number) => wave(x, phase);
  const pectoral = spline(bend(PECTORAL, phase), true);
  const back = spline(bend(TOP, phase), false);
  const belly = spline(bend(BOTTOM, phase), false);
  const region = {filterUnits: "userSpaceOnUse" as const, x: -80, y: -240, width: 1160, height: 480};

  return (
    <g>
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={body} />
        </clipPath>
        <linearGradient id={`${id}-fade`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={TAIL} />
          <stop offset="0.09" stopColor={TAIL} />
          <stop offset="0.35" stopColor="#2C2D2F" />
          <stop offset="0.65" stopColor={BODY} />
          <stop offset="1" stopColor={BODY} />
        </linearGradient>
        <linearGradient id={`${id}-fin`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#404144" />
          <stop offset="1" stopColor="#242527" />
        </linearGradient>
        <linearGradient id={`${id}-tailfade`} gradientUnits="userSpaceOnUse" x1="195" x2="470" y1="0" y2="0">
          <stop offset="0" stopColor={TAIL} stopOpacity="1" />
          <stop offset="1" stopColor={TAIL} stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}-soft`} {...region}>
          <feGaussianBlur stdDeviation="26" />
        </filter>
        <filter id={`${id}-glow`} {...region}>
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1.6 0 0 0 -0.85" />
        </filter>
      </defs>

      <path d={fin(DORSAL_1, phase)} fill={FIN} />
      <path d={fin(DORSAL_2, phase)} fill={TAIL} />
      <path d={fin(PELVIC, phase)} fill={TAIL} />

      <path d={body} fill={RIM} />
      <g clipPath={`url(#${id}-clip)`}>
        {/* Body sits 4 units lower than the rim layer, leaving a thin rim light on top. */}
        <path d={body} fill={`url(#${id}-fade)`} transform="translate(-2 4)" />
        {/* Painted soft light: top highlight, forehead highlight, shadow underneath, bounce on the belly */}
        <path d={back} stroke="#62676C" strokeWidth="64" fill="none" opacity="0.5" transform="translate(0 36)" filter={`url(#${id}-soft)`} />
        <ellipse cx="895" cy={-34 + w(895)} rx="72" ry="30" fill="#62676C" opacity="0.32" filter={`url(#${id}-soft)`} />
        <path d={belly} stroke="#000" strokeWidth="80" fill="none" opacity="0.3" transform="translate(0 -20)" filter={`url(#${id}-soft)`} />
        <path d={belly} stroke={RIM} strokeWidth="12" fill="none" opacity="0.7" filter={`url(#${id}-glow)`} />
        {beam && <ellipse cx="640" cy={-6 + w(640)} rx="230" ry="56" fill="#E4E1DA" opacity="0.1" filter={`url(#${id}-soft)`} />}
        {/* Soft shadow the fin casts on the flank */}
        <path d={pectoral} fill="#000" opacity="0.38" transform="translate(-5 -10)" filter={`url(#${id}-glow)`} />
        {/* Light dies away before the tail, so the body meets the tail without a seam */}
        <rect x="100" y="-130" width="370" height="260" fill={`url(#${id}-tailfade)`} />
        {CREASES.map(([y, x0, x1]) => (
          <path key={`${y}-${x0}`} d={ridge(y, x0, x1, phase)} stroke={LINE} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.24" />
        ))}
        <rect x="0" y="-130" width="1000" height="260" filter={`url(#${id}-grain)`} opacity="0.11" />
      </g>

      <path d={caudal(phase)} fill={TAIL} />
      <path d={pectoral} fill={`url(#${id}-fin)`} />

      {/* Gill slits */}
      {[792, 806, 820, 834, 848].map((x, i) => (
        <path
          key={x}
          d={`M${x} ${-16 + i * 2 + w(x)}Q${x + 9} ${10 + w(x)} ${x - 2} ${36 - i * 2 + w(x)}`}
          stroke={LINE}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
      ))}

      {/* Underslung mouth, nostril, small dull eye */}
      <path d="M974 52Q935 56 896 63" stroke={LINE} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <circle cx="984" cy="10" r="2.6" fill={LINE} />
      <circle cx="930" cy="-12" r="6" fill="#050607" />
      <circle cx="931.5" cy="-13.5" r="1.4" fill="#F1EFEB" />
    </g>
  );
};
