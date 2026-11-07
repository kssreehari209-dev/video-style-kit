// Props for sections 2 to 10. All original drawings. Storyboard quality for now.
import {C, FONT, P, spline} from "./theme";

// Tapered limb along a path: wide at the root, a point at the tip.
const limb = (pts: P[], w0: number) => {
  const left: P[] = [];
  const right: P[] = [];
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const n = Math.hypot(dx, dy) || 1;
    const w = w0 * Math.pow(1 - i / (pts.length - 1), 0.75);
    left.push([p[0] - (dy / n) * w, p[1] + (dx / n) * w]);
    right.push([p[0] + (dy / n) * w, p[1] - (dx / n) * w]);
  });
  return spline([...left, ...right.reverse()], true);
};

// Upright giant squid: mantle on top, arms hanging. Unlike frame 4's sideways colossal squid.
export const Squid = ({id, frame = 0}: {id: string; frame?: number}) => {
  const mantle = spline([[0, -340], [58, -290], [92, -190], [102, -70], [78, 12], [-78, 12], [-102, -70], [-92, -190], [-58, -290]], true);
  const arms: P[][] = [-1.2, -0.75, -0.32, 0.1, 0.5, 0.9, 1.3].map((k, i) => {
    const len = i === 1 || i === 5 ? 620 : 400;
    const pts: P[] = [];
    for (let t = 0; t <= 1.001; t += 0.125) {
      const curl = Math.sin(t * 3 + i + frame * 0.05) * 34 * t;
      pts.push([k * 46 + k * 170 * t + curl, 82 + t * len]);
    }
    return pts;
  });
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-m`} x1="0.2" x2="0.8" y1="0" y2="1">
          <stop offset="0" stopColor="#674337" />
          <stop offset="0.6" stopColor="#4F3229" />
          <stop offset="1" stopColor="#33201A" />
        </linearGradient>
        <filter id={`${id}-soft`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="20" />
        </filter>
      </defs>
      {arms.map((pts, i) => (
        <path key={i} d={limb(pts, i === 1 || i === 5 ? 11 : 20)} fill={i % 2 ? "#3C261F" : "#4A2F27"} />
      ))}
      <path d="M-58 -292Q-150 -262 -160 -186Q-110 -196 -84 -214Z" fill="#442B23" />
      <path d="M58 -292Q150 -262 160 -186Q110 -196 84 -214Z" fill="#3C261F" />
      <path d={mantle} fill={`url(#${id}-m)`} />
      <ellipse cx="-30" cy="-210" rx="42" ry="96" fill="#8A6052" opacity="0.5" filter={`url(#${id}-soft)`} />
      <ellipse cx="0" cy="44" rx="76" ry="52" fill="#4A2F27" />
      <circle cx="34" cy="40" r="27" fill="#6E5146" />
      <circle cx="34" cy="40" r="20" fill="#08090A" />
      <circle cx="27" cy="33" r="6" fill="#F1EFEB" opacity="0.85" />
    </g>
  );
};

// Parrot-like squid beak.
export const Beak = ({x, y, r = 0, s = 1}: {x: number; y: number; r?: number; s?: number}) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M-26 -14Q-4 -30 22 -18Q34 -10 30 12Q18 -2 -4 2Q-20 4 -26 -14Z" fill="#17120E" />
    <path d="M-24 -12Q-4 -26 20 -16" stroke="#8A7564" strokeWidth="2.5" fill="none" opacity="0.7" />
  </g>
);

// KSRTC-sized bus: guide's bus colors, a door and a sloped front make it a new drawing.
export const Bus = ({x, y, w = 888}: {x: number; y: number; w?: number}) => {
  const k = w / 888;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
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
};

// Segmented meter from frames 6a to 6c: 13 segments in a dark housing, 186 x 622 at 1080p.
export const Meter = ({x, y, lit}: {x: number; y: number; lit: number}) => {
  const seg = (i: number) => (i < 8 ? C.green : i < 11 ? C.amber : C.red);
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="186" height="622" rx="20" fill={C.meterHousing} />
      {Array.from({length: 13}).map((_, i) => (
        <rect key={i} x="24" y={584 - (i + 1) * 45 + 12} width="138" height="36" rx="5" fill={i < lit ? seg(i) : C.meterEmpty} />
      ))}
    </g>
  );
};

// Beaked whale: smaller and slimmer than the sperm whale, with a short beak. Head left.
export const BeakedWhale = ({id}: {id: string}) => {
  const body = spline(
    [[0, 6], [40, -2], [72, -18], [116, -42], [220, -62], [380, -68], [520, -58], [596, -50], [634, -74], [652, -42], [760, -24], [860, -10], [900, -7], [900, 7], [760, 26], [560, 54], [360, 62], [200, 48], [100, 30], [50, 18]],
    true,
  );
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-b`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#6A6660" />
          <stop offset="0.55" stopColor="#4F4C48" />
          <stop offset="1" stopColor="#2F2D2A" />
        </linearGradient>
      </defs>
      <path d="M880 -7Q930 -40 980 -46Q966 -6 950 0Q968 26 978 54Q926 40 880 8Z" fill="#35332F" />
      <path d={body} fill={`url(#${id}-b)`} />
      <path d="M300 56Q344 86 392 92Q370 62 350 50Z" fill="#35332F" />
      <circle cx="150" cy="4" r="5" fill="#08090A" />
      <path d="M6 8Q50 14 110 12" stroke="#1F2022" strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  );
};

export const Brain = ({id, x, y, s}: {id: string; x: number; y: number; s: number}) => {
  const d = spline([[-130, 30], [-136, -30], [-96, -82], [-30, -100], [44, -98], [108, -66], [136, -10], [120, 44], [74, 62], [30, 58], [8, 84], [-34, 88], [-52, 62], [-104, 66]], true);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <radialGradient id={`${id}-g`} cx="0.4" cy="0.25" r="0.85">
          <stop offset="0" stopColor="#8B857C" />
          <stop offset="0.6" stopColor="#4F4C48" />
          <stop offset="1" stopColor="#2A2825" />
        </radialGradient>
      </defs>
      <path d={d} fill={`url(#${id}-g)`} />
      {["M-96 -30Q-60 -60 -30 -30T34 -40T96 -24", "M-110 18Q-70 -8 -34 18T30 8T104 22", "M-56 52Q-30 34 -6 50", "M-40 -72Q-16 -54 10 -74"].map((p) => (
        <path key={p} d={p} stroke="#23211E" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.7" />
      ))}
    </g>
  );
};

export const Ship = ({x, y, s = 1, tilt = 0}: {x: number; y: number; s?: number; tilt?: number}) => (
  <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${s})`}>
    {[-170, 10, 170].map((mx, i) => (
      <g key={mx}>
        <rect x={mx - 4} y={-340 + i * 16} width="8" height="340" fill="#1B1F22" />
        {[-300, -210, -120].map((sy, j) => (
          <path key={sy} d={`M${mx - 76 + j * -12} ${sy + i * 16}Q${mx + 18} ${sy + 36 + i * 16} ${mx + 76 + j * 12} ${sy + i * 16}L${mx + 92 + j * 12} ${sy + 72 + i * 16}Q${mx + 18} ${sy + 102 + i * 16} ${mx - 92 + j * -12} ${sy + 72 + i * 16}Z`} fill={j === 0 ? "#555A5D" : "#3D4245"} />
        ))}
      </g>
    ))}
    <path d="M-340 -30H300Q360 -34 396 -66L360 58Q350 74 320 74H-280Q-310 74 -320 50Z" fill="#191C1E" />
    <path d="M-340 -30H300Q360 -34 396 -66" stroke={C.rim} strokeWidth="5" fill="none" />
  </g>
);

// Small swimmer in the guide's diver colors.
export const Swimmer = ({x, y, s = 1}: {x: number; y: number; s?: number}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-46" y="-13" width="86" height="26" rx="13" fill="#094513" />
    <circle cx="56" cy="-8" r="15" fill="#094513" />
    <circle cx="62" cy="-10" r="4" fill={C.green} />
    <path d="M30 -8L88 -30" stroke="#094513" strokeWidth="11" strokeLinecap="round" />
    <circle cx="90" cy="-32" r="7" fill={C.green} />
    <path d="M-44 -4L-104 -18M-44 6L-104 18" stroke="#094513" strokeWidth="12" strokeLinecap="round" />
    <path d="M-104 -18L-128 -30M-104 18L-128 6" stroke={C.green} strokeWidth="8" strokeLinecap="round" />
  </g>
);

// Rotated red outlined stamp (frame 6c).
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
