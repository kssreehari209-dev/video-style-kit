import {AbsoluteFill, random} from "remotion";

// Ported from shark_5s, where they were checked against frames 2a, 2b and 5c.

export const BG = {
  scale: "radial-gradient(ellipse 85% 75% at 50% 8%, #0B1F28 0%, #09181F 45%, #03090D 100%)",
  sonar: "linear-gradient(180deg, #1A3A47 0%, #132F3B 17%, #0E222C 42%, #040F15 80%, #030A0F 100%)",
  deep: "radial-gradient(ellipse 80% 70% at 50% 30%, #071419 0%, #03090D 70%, #020608 100%)",
};

export const Dust = ({frame, seed}: {frame: number; seed: string}) => (
  <svg width="1920" height="1080" style={{position: "absolute"}}>
    <defs>
      <filter id={`dust-${seed}`} x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="9" />
      </filter>
    </defs>
    {Array.from({length: 16}).map((_, i) => {
      const r = (k: string) => random(`${seed}-b-${i}-${k}`);
      const x = (((r("x") * 2100 - 90 + frame * (r("v") - 0.5) * 0.9) % 2100) + 2100) % 2100;
      const y = (((r("y") * 1160 - 40 - frame * (0.12 + r("w") * 0.3)) % 1160) + 1160) % 1160;
      return <circle key={i} cx={x} cy={y} r={8 + r("r") * 22} fill="#9DB4BC" opacity={0.04 + r("o") * 0.09} filter={`url(#dust-${seed})`} />;
    })}
    {Array.from({length: 110}).map((_, i) => {
      const r = (k: string) => random(`${seed}-s-${i}-${k}`);
      const x = (((r("x") * 1960 + frame * (r("v") - 0.5) * 0.5) % 1960) + 1960) % 1960;
      const y = (((r("y") * 1100 - frame * (0.08 + r("w") * 0.22)) % 1100) + 1100) % 1100;
      return <circle key={i} cx={x} cy={y} r={0.8 + r("r") * 1.5} fill="#C9D6DA" opacity={0.14 + r("o") * 0.4} />;
    })}
  </svg>
);

export const Vignette = ({strength = 0.8}: {strength?: number}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 72% 78% at 50% 48%, rgba(0,0,0,0) 48%, rgba(0,1,1,${strength}) 100%)`}} />
);

export const LightShafts = ({frame, id = "s"}: {frame: number; id?: string}) => {
  const shafts = [
    [225, 130, 0.6], [510, 135, 0.45], [720, 210, 0.75], [975, 100, 0.8], [1210, 150, 0.5], [1560, 120, 0.4],
  ];
  return (
    <svg width="1920" height="1080" style={{position: "absolute"}}>
      <defs>
        <linearGradient id={`shaft-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#385F6C" stopOpacity="0.6" />
          <stop offset="0.55" stopColor="#315968" stopOpacity="0.2" />
          <stop offset="1" stopColor="#315968" stopOpacity="0" />
        </linearGradient>
        <filter id={`shaftBlur-${id}`} x="-20%" y="-5%" width="140%" height="110%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      {shafts.map(([x, w, o], i) => {
        const sway = Math.sin(frame * 0.02 + i * 1.7) * 8;
        const flicker = o * (0.85 + 0.15 * Math.sin(frame * 0.05 + i * 2.1));
        return (
          <polygon
            key={i}
            points={`${x},0 ${x + w},0 ${x + w + 70 + sway},820 ${x + 40 + sway},820`}
            fill={`url(#shaft-${id})`}
            opacity={flicker}
            filter={`url(#shaftBlur-${id})`}
          />
        );
      })}
    </svg>
  );
};

export const Surface = ({frame, id = "s"}: {frame: number; id?: string}) => {
  const line = (y: number, speed: number, amp: number) => {
    let d = "";
    for (let x = -20; x <= 1940; x += 20) {
      const yy = y + Math.sin(x * 0.022 + frame * speed) * amp + Math.sin(x * 0.051 - frame * speed * 0.7) * amp * 0.5;
      d += `${d ? "L" : "M"}${x} ${yy.toFixed(1)}`;
    }
    return d;
  };
  return (
    <svg width="1920" height="1080" style={{position: "absolute"}}>
      <defs>
        <linearGradient id={`surfaceGlow-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#385F6C" stopOpacity="0.8" />
          <stop offset="1" stopColor="#385F6C" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1920" height="90" fill={`url(#surfaceGlow-${id})`} />
      <path d={line(12, 0.08, 4)} stroke="#6E98A6" strokeWidth="1.5" fill="none" opacity="0.7" />
    </svg>
  );
};

// Rings leave (cx, cy). Speed lands on the guide's 95 / 325 / 555 radii at 30-frame spacing.
export const SonarRings = ({frame, starts, cx = 960, cy = 507, r0 = 95, fadeAt = 860}: {frame: number; starts: number[]; cx?: number; cy?: number; r0?: number; fadeAt?: number}) => (
  <svg width="1920" height="1080" style={{position: "absolute"}}>
    {starts.map((start) => {
      const age = frame - start;
      if (age < 0) return null;
      const r = r0 + age * 7.67;
      return <circle key={start} cx={cx} cy={cy} r={r} fill="none" stroke="#C7D6DA" strokeWidth="3" opacity={Math.max(0, 0.62 * (1 - r / fadeAt))} />;
    })}
  </svg>
);
