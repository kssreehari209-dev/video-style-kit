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

const Dust = ({frame, seed}: {frame: number; seed: string}) => (
  <svg width="1920" height="1080" style={{position: "absolute"}}>
    <defs>
      <filter id={`dust-${seed}`} x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="9" />
      </filter>
    </defs>
    {Array.from({length: 16}).map((_, i) => {
      const r = (k: string) => random(`${seed}-b-${i}-${k}`);
      const x = (r("x") * 2100 - 90 + frame * (r("v") - 0.5) * 0.9 + 2100) % 2100;
      const y = (r("y") * 1160 - 40 - frame * (0.12 + r("w") * 0.3) + 1160) % 1160;
      return <circle key={i} cx={x} cy={y} r={8 + r("r") * 22} fill="#9DB4BC" opacity={0.04 + r("o") * 0.09} filter={`url(#dust-${seed})`} />;
    })}
    {Array.from({length: 110}).map((_, i) => {
      const r = (k: string) => random(`${seed}-s-${i}-${k}`);
      const x = (r("x") * 1960 + frame * (r("v") - 0.5) * 0.5) % 1960;
      const y = (r("y") * 1100 - frame * (0.08 + r("w") * 0.22) + 1100) % 1100;
      return <circle key={i} cx={x} cy={y} r={0.8 + r("r") * 1.5} fill="#C9D6DA" opacity={0.14 + r("o") * 0.4} />;
    })}
  </svg>
);

const Vignette = ({strength = 0.8}: {strength?: number}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 72% 78% at 50% 48%, rgba(0,0,0,0) 48%, rgba(0,1,1,${strength}) 100%)`}} />
);

const LightShafts = ({frame}: {frame: number}) => {
  const shafts = [
    [225, 130, 0.6], [510, 135, 0.45], [720, 210, 0.75], [975, 100, 0.8], [1210, 150, 0.5], [1560, 120, 0.4],
  ];
  return (
    <svg width="1920" height="1080" style={{position: "absolute"}}>
      <defs>
        <linearGradient id="shaft" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#385F6C" stopOpacity="0.6" />
          <stop offset="0.55" stopColor="#315968" stopOpacity="0.2" />
          <stop offset="1" stopColor="#315968" stopOpacity="0" />
        </linearGradient>
        <filter id="shaftBlur" x="-20%" y="-5%" width="140%" height="110%">
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
            fill="url(#shaft)"
            opacity={flicker}
            filter="url(#shaftBlur)"
          />
        );
      })}
    </svg>
  );
};

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
  return (
    <svg width="1920" height="1080" style={{position: "absolute"}}>
      <defs>
        <linearGradient id="cone" gradientUnits="userSpaceOnUse" x1={tip[0]} y1={tip[1]} x2="500" y2="110">
          <stop offset="0" stopColor="#E4E1DA" stopOpacity="0.25" />
          <stop offset="0.45" stopColor="#E4E1DA" stopOpacity="0.16" />
          <stop offset="0.8" stopColor="#E4E1DA" stopOpacity="0.06" />
          <stop offset="1" stopColor="#E4E1DA" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`${tip[0]},${tip[1]} 100,160 900,-60`} fill="url(#cone)" />
      <g transform={`translate(${tip[0]} ${tip[1]}) rotate(39.6)`}>
        <rect x="4" y="-19" width="58" height="38" rx="8" fill="#14181B" />
        <rect x="-3" y="-18" width="7" height="36" rx="3.5" fill="#EFEDE7" />
      </g>
    </svg>
  );
};

const SonarRings = ({frame}: {frame: number}) => (
  <svg width="1920" height="1080" style={{position: "absolute"}}>
    {[-60, -30, ...T.pings, 60].map((start) => {
      const age = frame - start;
      if (age < 0) return null;
      const r = 95 + age * 7.67; // lands on the guide's radii: 95, 325, 555 at 30-frame spacing
      return <circle key={start} cx="960" cy="507" r={r} fill="none" stroke="#C7D6DA" strokeWidth="3" opacity={Math.max(0, 0.62 * (1 - r / 860))} />;
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
        textShadow: "0 3px 10px rgba(0,0,0,0.55)",
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
      <LightShafts frame={f} />
      <Surface frame={f} />
      <Dust frame={f} seed="sonar" />
      <svg width="1920" height="1080" style={{position: "absolute"}}>
        <g transform={`translate(${x - 500 * s} 520) scale(${s})`}>
          <Shark frame={f} id="sonar" beam />
        </g>
      </svg>
      <SonarRings frame={f} />
      <FlashlightCone />
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
        <radialGradient id={id} cx="0.42" cy="0.28" r="0.85">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </radialGradient>
      </defs>
      <circle cx="60" cy="27" r="26" fill={`url(#${id})`} />
      <path d="M30 80Q30 62 48 62H72Q90 62 90 80V165H64V116H56V165H30Z" fill={`url(#${id})`} />
      <rect x="12" y="64" width="15" height="64" rx="7.5" fill={`url(#${id})`} />
      <rect x="93" y="64" width="15" height="64" rx="7.5" fill={`url(#${id})`} />
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
  const s = 1.2;
  return (
    <AbsoluteFill style={{background: "radial-gradient(ellipse 85% 75% at 50% 8%, #0B1F28 0%, #09181F 45%, #03090D 100%)"}}>
      <Dust frame={f} seed="scale" />
      <svg width="1920" height="1080" style={{position: "absolute"}}>
        <g transform={`translate(${360 + local * 0.35} 372) scale(${s})`}>
          <Shark frame={f} id="scale" />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          left: 960 - 595 * rule,
          width: 1190 * rule,
          top: 598,
          height: 4,
          borderRadius: 2,
          background: "#ADBBC2",
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
        <span style={{display: "inline-block", position: "relative", fontFamily, fontWeight: 900, fontSize: 48, lineHeight: "62px", letterSpacing: "0.02em", color: "#DB4043"}}>
          ≈ 400 YEARS = 4–5 LIFETIMES
          <span style={{position: "absolute", left: 0, bottom: -6, height: 5, width: `${100 * caption}%`, background: "#DB4043"}} />
        </span>
      </div>
      <svg width="1920" height="1080" style={{position: "absolute"}}>
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
