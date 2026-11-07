import {AbsoluteFill, Audio, Easing, Sequence, interpolate, random, staticFile, useCurrentFrame} from "remotion";
import {loadFont} from "@remotion/google-fonts/Montserrat";
import {Shark} from "./Shark";

// Chosen over Poppins after a side-by-side test against the frames.
const {fontFamily} = loadFont("normal", {weights: ["900"], subsets: ["latin"]});

// Every animation and sound is keyed off these frames (30 fps).
const CUT = 63;
const T = {
  pings: [0, 30],
  title: 24,
  rule: CUT,
  label: CUT + 6,
  caption: 81,
  people: [93, 99, 105, 111],
  ghost: 120,
  fadeStart: 138,
  end: 150,
};
const SNAP = 9; // the guide's 300 ms ease-out entrance

const snap = (f: number, start: number, dur = SNAP) =>
  interpolate(f, [start, start + dur], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const wrap = (v: number, m: number) => ((v % m) + m) % m;

// Three depth planes. Nearer planes are larger, blurrier and move faster.
const DEPTH = {
  far: {specks: 70, speckR: 0.7, bokeh: 8, bokehR: [6, 14], blur: 6, speed: 0.35, glow: 0.7},
  mid: {specks: 50, speckR: 1.3, bokeh: 8, bokehR: [12, 28], blur: 10, speed: 1, glow: 1},
  near: {specks: 0, speckR: 0, bokeh: 6, bokehR: [40, 76], blur: 22, speed: 2.8, glow: 0.8},
};

const Dust = ({frame, seed, plane, pan}: {frame: number; seed: string; plane: keyof typeof DEPTH; pan: number}) => {
  const d = DEPTH[plane];
  const id = `dust-${seed}-${plane}`;
  return (
    <svg width="1920" height="1080" style={{position: "absolute"}}>
      <defs>
        <filter id={id} x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation={d.blur} />
        </filter>
      </defs>
      {Array.from({length: d.bokeh}).map((_, i) => {
        const r = (k: string) => random(`${id}-b-${i}-${k}`);
        const x = wrap(r("x") * 2240 - frame * pan * d.speed, 2240) - 160;
        const y = wrap(r("y") * 1400 - frame * (0.12 + r("w") * 0.3) * d.speed, 1400) - 160;
        const radius = d.bokehR[0] + r("r") * (d.bokehR[1] - d.bokehR[0]);
        return <circle key={i} cx={x} cy={y} r={radius} fill="#9DB4BC" opacity={(0.04 + r("o") * 0.09) * d.glow} filter={`url(#${id})`} />;
      })}
      {Array.from({length: d.specks}).map((_, i) => {
        const r = (k: string) => random(`${id}-s-${i}-${k}`);
        const x = wrap(r("x") * 1960 - frame * pan * d.speed, 1960) - 20;
        const y = wrap(r("y") * 1100 - frame * (0.08 + r("w") * 0.22) * d.speed, 1100) - 10;
        return <circle key={i} cx={x} cy={y} r={d.speckR * (0.7 + r("r") * 0.8)} fill="#C9D6DA" opacity={(0.14 + r("o") * 0.4) * d.glow} />;
      })}
    </svg>
  );
};

// Soft light behind the subject, which separates it from the background.
const BackGlow = ({cx, cy, rx, ry, color, opacity}: {cx: number; cy: number; rx: number; ry: number; color: string; opacity: number}) => (
  <svg width="1920" height="1080" style={{position: "absolute", mixBlendMode: "screen"}}>
    <defs>
      <filter id="backGlow" filterUnits="userSpaceOnUse" x="-300" y="-300" width="2520" height="1680">
        <feGaussianBlur stdDeviation="70" />
      </filter>
    </defs>
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={color} opacity={opacity} filter="url(#backGlow)" />
  </svg>
);

const Vignette = ({strength = 0.8}: {strength?: number}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 72% 78% at 50% 48%, rgba(0,0,0,0) 48%, rgba(0,1,1,${strength}) 100%)`}} />
);

const BACK_SHAFTS = [
  [225, 130, 0.42], [510, 135, 0.32], [720, 210, 0.52], [975, 100, 0.56], [1210, 150, 0.35], [1560, 120, 0.28],
];
const FRONT_SHAFTS = [[1130, 120, 0.3]];

const LightShafts = ({frame, id, shafts, blur}: {frame: number; id: string; shafts: number[][]; blur: number}) => (
  <svg width="1920" height="1080" style={{position: "absolute", mixBlendMode: "screen"}}>
    <defs>
      <linearGradient id={`${id}-fill`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#385F6C" stopOpacity="0.85" />
        <stop offset="0.55" stopColor="#315968" stopOpacity="0.3" />
        <stop offset="1" stopColor="#315968" stopOpacity="0" />
      </linearGradient>
      <filter id={`${id}-blur`} x="-40%" y="-5%" width="180%" height="110%">
        <feGaussianBlur stdDeviation={blur} />
      </filter>
    </defs>
    {shafts.map(([x, w, o], i) => {
      const sway = Math.sin(frame * 0.02 + i * 1.7) * 8;
      const flicker = o * (0.85 + 0.15 * Math.sin(frame * 0.05 + i * 2.1));
      return (
        <polygon
          key={i}
          points={`${x},0 ${x + w},0 ${x + w + 70 + sway},820 ${x + 40 + sway},820`}
          fill={`url(#${id}-fill)`}
          opacity={flicker}
          filter={`url(#${id}-blur)`}
        />
      );
    })}
  </svg>
);

const Surface = ({frame}: {frame: number}) => {
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
        <linearGradient id="surfaceGlow" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#385F6C" stopOpacity="0.8" />
          <stop offset="1" stopColor="#385F6C" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1920" height="90" fill="url(#surfaceGlow)" />
      <path d={line(12, 0.08, 4)} stroke="#6E98A6" strokeWidth="1.5" fill="none" opacity="0.7" />
    </svg>
  );
};

const FlashlightCone = () => {
  const tip = [1455, 905];
  const area = {filterUnits: "userSpaceOnUse" as const, x: -300, y: -300, width: 2520, height: 1680};
  return (
    <svg width="1920" height="1080" style={{position: "absolute"}}>
      <defs>
        <linearGradient id="cone" gradientUnits="userSpaceOnUse" x1={tip[0]} y1={tip[1]} x2="500" y2="110">
          <stop offset="0" stopColor="#E4E1DA" stopOpacity="0.2" />
          <stop offset="0.45" stopColor="#E4E1DA" stopOpacity="0.13" />
          <stop offset="0.8" stopColor="#E4E1DA" stopOpacity="0.05" />
          <stop offset="1" stopColor="#E4E1DA" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="torch" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#2E353A" />
          <stop offset="1" stopColor="#0B0E10" />
        </linearGradient>
        <filter id="coneEdge" {...area}>
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id="coneCore" {...area}>
          <feGaussianBlur stdDeviation="34" />
        </filter>
        <filter id="lensGlow" {...area}>
          <feGaussianBlur stdDeviation="16" />
        </filter>
      </defs>
      <polygon points={`${tip[0]},${tip[1]} 100,160 900,-60`} fill="url(#cone)" filter="url(#coneEdge)" />
      <polygon points={`${tip[0]},${tip[1]} 340,94 660,6`} fill="url(#cone)" opacity="0.55" filter="url(#coneCore)" />
      <circle cx={tip[0]} cy={tip[1]} r="30" fill="#E4E1DA" opacity="0.4" filter="url(#lensGlow)" />
      <g transform={`translate(${tip[0]} ${tip[1]}) rotate(39.6)`}>
        <rect x="4" y="-19" width="58" height="38" rx="8" fill="url(#torch)" />
        <rect x="-3" y="-18" width="7" height="36" rx="3.5" fill="#EFEDE7" />
      </g>
    </svg>
  );
};

const SonarRings = ({frame}: {frame: number}) => (
  <svg width="1920" height="1080" style={{position: "absolute"}}>
    <defs>
      <filter id="ringGlow" filterUnits="userSpaceOnUse" x="-300" y="-300" width="2520" height="1680">
        <feGaussianBlur stdDeviation="6" />
      </filter>
    </defs>
    {[-60, -30, ...T.pings, 60].map((start) => {
      const age = frame - start;
      if (age < 0) return null;
      const r = 95 + age * 7.67; // lands on the guide's radii: 95, 325, 555 at 30-frame spacing
      const o = Math.max(0, 0.62 * (1 - r / 860));
      return (
        <g key={start}>
          <circle cx="960" cy="507" r={r} fill="none" stroke="#C7D6DA" strokeWidth="10" opacity={o * 0.35} filter="url(#ringGlow)" />
          <circle cx="960" cy="507" r={r} fill="none" stroke="#C7D6DA" strokeWidth="3" opacity={o} />
        </g>
      );
    })}
  </svg>
);

const Title = ({text, frame, start}: {text: string; frame: number; start: number}) => {
  const p = snap(frame, start);
  return (
    <div
      style={{
        position: "absolute",
        top: 127 - 40,
        width: "100%",
        textAlign: "center",
        fontFamily,
        fontWeight: 900,
        fontSize: 64,
        lineHeight: "80px",
        letterSpacing: "0.02em",
        color: "#F1EFEB",
        textShadow: "0 2px 3px rgba(0,0,0,0.4), 0 12px 30px rgba(0,0,0,0.65)",
        opacity: p,
        transform: `scale(${0.92 + 0.08 * p})`,
      }}
    >
      {text}
    </div>
  );
};

const SonarShot = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, CUT], [930, 1035]); // constant linear speed
  const s = interpolate(f, [0, CUT], [0.68, 0.76]);
  return (
    <AbsoluteFill style={{background: "linear-gradient(180deg, #1A3A47 0%, #132F3B 17%, #0E222C 42%, #040F15 80%, #030A0F 100%)"}}>
      <LightShafts frame={f} id="back" shafts={BACK_SHAFTS} blur={9} />
      <Surface frame={f} />
      <Dust frame={f} seed="sonar" plane="far" pan={0.9} />
      <BackGlow cx={x} cy={520} rx={430} ry={150} color="#2B5A6C" opacity={0.42} />
      <Dust frame={f} seed="sonar" plane="mid" pan={0.9} />
      <svg width="1920" height="1080" style={{position: "absolute"}}>
        <g transform={`translate(${x - 500 * s} 520) scale(${s})`}>
          <Shark frame={f} id="sonar" scale={s} haze="#123040" beam />
        </g>
      </svg>
      <SonarRings frame={f} />
      <FlashlightCone />
      <LightShafts frame={f} id="front" shafts={FRONT_SHAFTS} blur={22} />
      <Dust frame={f} seed="sonar" plane="near" pan={0.9} />
      <Vignette strength={0.72} />
      <Title text="HOW OLD IS THIS SHARK?" frame={f} start={T.title} />
    </AbsoluteFill>
  );
};

const Person = ({x, top, bottom, p}: {x: number; top: string; bottom: string; p: number}) => {
  const id = `person-${x}`;
  return (
    <g transform={`translate(${x} 1027) scale(${p}) translate(-60 -165)`} opacity={p}>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="0" y2="165">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="166" rx="58" ry="9" fill="#000" opacity="0.65" filter="url(#contact)" />
      <g filter="url(#personLit)">
        <circle cx="60" cy="27" r="26" fill={`url(#${id})`} />
        <path d="M30 80Q30 62 48 62H72Q90 62 90 80V165H64V116H56V165H30Z" fill={`url(#${id})`} />
        <rect x="12" y="64" width="15" height="64" rx="7.5" fill={`url(#${id})`} />
        <rect x="93" y="64" width="15" height="64" rx="7.5" fill={`url(#${id})`} />
      </g>
    </g>
  );
};

// The frames show the row lit from the center, falling off toward the edges (5c).
const PEOPLE = [
  {x: 484, top: "#6F757A", bottom: "#3B3F42"},
  {x: 722, top: "#878F95", bottom: "#4A4F52"},
  {x: 960, top: "#99A2A9", bottom: "#555A5D"},
  {x: 1198, top: "#878F95", bottom: "#4A4F52"},
];

const ScaleShot = () => {
  const local = useCurrentFrame();
  const f = local + CUT;
  const rule = snap(f, T.rule);
  const label = snap(f, T.label);
  const caption = snap(f, T.caption);
  const s = interpolate(f, [CUT, T.end], [1.2, 1.225]); // slow push-in
  const floor = snap(f, T.people[0]);
  return (
    <AbsoluteFill style={{background: "radial-gradient(ellipse 85% 75% at 50% 8%, #0B1F28 0%, #09181F 45%, #03090D 100%)"}}>
      <Dust frame={f} seed="scale" plane="far" pan={0.25} />
      <BackGlow cx={980} cy={365} rx={640} ry={190} color="#12404F" opacity={0.34} />
      <Dust frame={f} seed="scale" plane="mid" pan={0.25} />
      <svg width="1920" height="1080" style={{position: "absolute"}}>
        <g transform={`translate(${960 - 500 * s + local * 0.35} 372) scale(${s})`}>
          <Shark frame={f} id="scale" scale={s} haze="#0B1F28" />
        </g>
      </svg>
      <Dust frame={f} seed="scale" plane="near" pan={0.25} />
      <div
        style={{
          position: "absolute",
          left: 960 - 595 * rule,
          width: 1190 * rule,
          top: 598,
          height: 4,
          borderRadius: 2,
          background: "#ADBBC2",
          boxShadow: "0 0 16px rgba(173,187,194,0.4)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 620,
          width: "100%",
          textAlign: "center",
          fontFamily,
          fontWeight: 900,
          fontSize: 48,
          lineHeight: "64px",
          color: "#F9F7F2",
          textShadow: "0 8px 22px rgba(0,0,0,0.7)",
          opacity: label,
          transform: `scale(${0.85 + 0.15 * label})`,
        }}
      >
        ~5 M
      </div>
      <div
        style={{
          position: "absolute",
          top: 736,
          width: "100%",
          textAlign: "center",
          opacity: caption,
          transform: `scale(${0.92 + 0.08 * caption})`,
        }}
      >
        <span style={{display: "inline-block", position: "relative", fontFamily, fontWeight: 900, fontSize: 48, lineHeight: "62px", letterSpacing: "0.02em", color: "#DB4043", textShadow: "0 0 26px rgba(219,64,67,0.3), 0 8px 20px rgba(0,0,0,0.7)"}}>
          ≈ 400 YEARS = 4–5 LIFETIMES
          <span style={{position: "absolute", left: 0, bottom: -6, height: 5, width: `${100 * caption}%`, background: "#DB4043", boxShadow: "0 0 14px rgba(219,64,67,0.45)"}} />
        </span>
      </div>
      <svg width="1920" height="1080" style={{position: "absolute"}}>
        <defs>
          <filter id="contact" x="-40%" y="-200%" width="180%" height="500%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id="floor" filterUnits="userSpaceOnUse" x="0" y="880" width="1920" height="200">
            <feGaussianBlur stdDeviation="20" />
          </filter>
          <filter id="personLit" x="-15%" y="-10%" width="130%" height="120%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceAlpha" stdDeviation="9" result="height" />
            <feDiffuseLighting in="height" surfaceScale="13" diffuseConstant="1.28" lightingColor="#FFFFFF" result="diffuse">
              <feDistantLight azimuth="250" elevation="50" />
            </feDiffuseLighting>
            <feGaussianBlur in="diffuse" stdDeviation="3.5" result="softDiffuse" />
            <feBlend in="SourceGraphic" in2="softDiffuse" mode="multiply" result="shaded" />
            <feComposite in="shaded" in2="SourceAlpha" operator="in" />
          </filter>
        </defs>
        <ellipse cx="960" cy="1034" rx="640" ry="26" fill="#1C333D" opacity={0.75 * floor} filter="url(#floor)" />
        {PEOPLE.map((p, i) => (
          <Person key={p.x} {...p} p={snap(f, T.people[i])} />
        ))}
        <Person x={1436} top="#2C3033" bottom="#1C1F21" p={snap(f, T.ghost)} />
      </svg>
      <Vignette strength={0.85} />
    </AbsoluteFill>
  );
};

const Sfx = ({file, frame, volume}: {file: string; frame: number; volume: number}) => (
  <Sequence from={frame} layout="none">
    <Audio src={staticFile(`sfx/${file}`)} volume={volume} />
  </Sequence>
);

const Soundtrack = () => (
  <>
    <Audio
      src={staticFile("sfx/ocean_drone.wav")}
      volume={(f) => interpolate(f, [T.fadeStart, T.end - 1], [0.28, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})}
    />
    {T.pings.map((f) => (
      <Sfx key={f} file="sonar_ping.wav" frame={f} volume={0.6} />
    ))}
    <Sfx file="ui_pop.wav" frame={T.title} volume={0.6} />
    <Sfx file="thud.wav" frame={T.rule} volume={0.9} />
    <Sfx file="ui_pop.wav" frame={T.label} volume={0.6} />
    <Sfx file="ui_alert.wav" frame={T.caption} volume={0.7} />
    {T.people.map((f) => (
      <Sfx key={f} file="ui_pop.wav" frame={f} volume={0.6} />
    ))}
    <Sfx file="ui_pop.wav" frame={T.ghost} volume={0.3} />
  </>
);

export const Scene = () => {
  const f = useCurrentFrame();
  // Fade to near-black, not full black, as in frame 3e.
  const fade = interpolate(f, [T.fadeStart, T.end - 1], [0, 0.93], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{background: "#03090D"}}>
      <Sequence durationInFrames={CUT}>
        <SonarShot />
      </Sequence>
      <Sequence from={CUT}>
        <ScaleShot />
      </Sequence>
      <AbsoluteFill style={{background: "#010304", opacity: fade}} />
      <Soundtrack />
    </AbsoluteFill>
  );
};
