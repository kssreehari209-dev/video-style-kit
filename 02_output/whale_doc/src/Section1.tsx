import {AbsoluteFill} from "remotion";
import {BG, Dust, LightShafts, SonarRings, Surface, Vignette} from "./atmosphere";
import {Cam, Key} from "./cam";
import {Shot} from "./kit";
import {Clipping, Lump} from "./Objects";
import {C, lerp, snap} from "./theme";
import {Brackets, Pill, Rule, ScaleLabel, Title} from "./ui";
import {Whale} from "./Whale";

// Every animation and sound is keyed off these frames (30 fps).
// Timing is estimated from the script. Move these numbers when narration is recorded.
export const T = {
  clips: [12, 48, 84],
  underline: 135,
  cutSeizure: 210,
  seizureTitle: 222,
  rule: 240,
  kg: 252,
  bracketsIn: 276,
  bracketsLand: 300,
  cutLump: 400,
  waxTitle: 412,
  creatureTitle: 490,
  pingsLump: [490, 520, 550],
  loomStart: 505,
  cutSea: 600,
  brainPill: 636,
  soundPill: 720,
  pingsSound: [720, 736, 752],
  cutReveal: 840,
  name: 852,
  malayalamName: 925,
  end: 1050,
};

// Camera keys, in frames from each shot's first frame.
const K: Record<string, Key[]> = {
  // Close on each small clipping, snap out as the big one lands, then push into the price.
  clips: [[0, 565, 345, 1.7], [44, 565, 345, 1.62], [60, 1355, 380, 1.6, "ease"], [78, 1355, 380, 1.56], [88, 960, 560, 1.02, "snap"], [118, 960, 560, 1.04], [150, 800, 560, 1.36, "ease"], [209, 790, 565, 1.42]],
  // Open on the lump, ease back to show the rule, then push in as the brackets close.
  seizure: [[0, 960, 420, 1.25], [34, 960, 450, 1.08, "ease"], [66, 960, 470, 1.04], [92, 960, 400, 1.35, "ease"], [189, 960, 400, 1.42]],
  // Slow push on the lump, then pull right back to reveal the shape behind it.
  lump: [[0, 960, 620, 1.18], [92, 960, 620, 1.3], [190, 960, 540, 1, "ease"], [199, 960, 540, 1]],
  // Linear pan that travels with the whale.
  sea: [[0, 1010, 600, 1.1], [239, 880, 600, 1.1]],
  // Cut in on the eye, pull out to the whole animal under the title.
  reveal: [[0, 690, 610, 2.2], [70, 960, 560, 1, "ease"], [209, 960, 560, 1.06]],
};

const ClippingsShot = ({f}: {f: number}) => {
  const line = snap(f, T.underline, 12);
  return (
    <AbsoluteFill>
      <Cam keys={K.clips} f={f} style={{background: BG.deep}}>
      <AbsoluteFill style={{background: "radial-gradient(ellipse 60% 62% at 50% 46%, rgba(49,89,104,0.22) 0%, rgba(49,89,104,0) 100%)"}} />
      <AbsoluteFill>
        <Clipping id="c1" x={130} y={130} w={640} h={430} rotate={-5} p={snap(f, T.clips[0])} seed={3} size={56} lines={2} headline={"തിമിംഗല ഛർദ്ദി\nപിടികൂടി"} dim={0.72} />
        <Clipping id="c2" x={1170} y={170} w={620} h={420} rotate={4} p={snap(f, T.clips[1])} seed={5} size={64} headline="വില കോടികൾ" dim={0.72} />
        <Clipping
          id="c3"
          x={400}
          y={345}
          w={1120}
          h={600}
          rotate={-1.5}
          p={snap(f, T.clips[2])}
          seed={7}
          size={70}
          lines={2}
          headline={
            <>
              തിമിംഗല ഛർദ്ദി പിടികൂടി,
              <br />
              <span style={{position: "relative", display: "inline-block"}}>
                വില കോടികൾ
                <span style={{position: "absolute", left: 0, bottom: 4, height: 7, width: `${100 * line}%`, background: C.red}} />
              </span>
            </>
          }
        >
          <div style={{position: "absolute", right: 36, bottom: 36, width: 330, height: 236, background: "#101416", overflow: "hidden"}}>
            <svg width="330" height="236">
              <g transform="translate(165 122)">
                <Lump id="c3lump" scale={0.56} />
              </g>
            </svg>
          </div>
        </Clipping>
      </AbsoluteFill>
      <Dust frame={f} seed="s1a" />
      </Cam>
      <Vignette strength={0.85} />
    </AbsoluteFill>
  );
};

const SeizureShot = ({f: local}: {f: number}) => {
  const f = local + T.cutSeizure;
  // Brackets frame a wide area, then shrink onto the subject (frames 1a, 1b).
  const b = snap(f, T.bracketsIn + 6, T.bracketsLand - T.bracketsIn - 6);
  const box = {
    x: 330 + (640 - 330) * b,
    y: 200 + (230 - 200) * b,
    w: 1260 + (640 - 1260) * b,
    h: 370 + (350 - 370) * b,
  };
  return (
    <AbsoluteFill>
      <Cam keys={K.seizure} f={local} style={{background: BG.scale}}>
      <Dust frame={f} seed="s1b" />
      <svg width="1920" height="1080" style={{position: "absolute"}}>
        <g transform="translate(960 404)">
          <Lump id="seizure" scale={0.92} />
        </g>
      </svg>
      <Rule frame={f} start={T.rule} y={622} half={420} />
      <ScaleLabel text="19 KG" frame={f} start={T.kg} top={648} size={72} />
      <Brackets {...box} opacity={snap(f, T.bracketsIn, 6)} />
      </Cam>
      <Title text="2021 · ചേറ്റുവ, തൃശൂർ" frame={f} start={T.seizureTitle} />
      <Vignette strength={0.85} />
    </AbsoluteFill>
  );
};

const LumpShot = ({f: local}: {f: number}) => {
  const f = local + T.cutLump;
  const room = lerp(f, T.creatureTitle, T.creatureTitle + 80, 1, 0.3);
  const loom = lerp(f, T.loomStart, T.cutSea - 14, 0, 1);
  const waxOut = f < T.creatureTitle ? 1 : 0;
  return (
    <AbsoluteFill>
      <Cam keys={K.lump} f={local} style={{background: BG.deep}}>
      {/* The creature behind the lump: a huge, barely visible shape */}
      <svg width="1920" height="1080" style={{position: "absolute", color: "#0D1F27", opacity: loom}}>
        <defs>
          <filter id="loomBlur" x="-10%" y="-30%" width="120%" height="160%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>
        <g transform={`translate(${60 - (f - T.loomStart) * 0.5} 420) scale(1.95)`} filter="url(#loomBlur)">
          <Whale frame={f} id="loom" silhouette amp={18} speed={0.05} />
        </g>
      </svg>
      {/* Table under a soft pool of light */}
      <AbsoluteFill style={{opacity: room}}>
        <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(0,0,0,0) 69%, #0A1519 69.2%, #050C10 100%)"}} />
        <AbsoluteFill style={{background: "radial-gradient(ellipse 46% 56% at 50% 58%, rgba(120,150,160,0.2) 0%, rgba(120,150,160,0) 100%)"}} />
      </AbsoluteFill>
      <SonarRings frame={f} starts={T.pingsLump} cx={960} cy={600} r0={230} fadeAt={1100} />
      <svg width="1920" height="1080" style={{position: "absolute"}}>
        <g transform="translate(960 640)">
          <Lump id="closeup" scale={1.5} />
        </g>
      </svg>
      <Dust frame={f} seed="s1c" />
      </Cam>
      <Vignette strength={0.85} />
      {waxOut ? <Title text="വെറുമൊരു മെഴുകുകട്ട" frame={f} start={T.waxTitle} /> : <Title text="ഈ കട്ടയ്ക്ക് പിന്നിൽ ഒരു ജീവിയുണ്ട്" frame={f} start={T.creatureTitle} />}
    </AbsoluteFill>
  );
};

const SeaShot = ({f: local}: {f: number}) => {
  const f = local + T.cutSea;
  const s = 1.2;
  const tx = lerp(f, T.cutSea, T.cutReveal, 620, 400); // constant linear speed
  const ty = 690;
  const brainAt = {x: tx + 258 * s, y: ty - 6 * s}; // the brain, near the eye
  const snout = {x: tx + 24 * s, y: ty - 60 * s}; // clicks start at the front of the head
  const brain = snap(f, T.brainPill, 14);
  const sound = snap(f, T.soundPill, 14);
  const lines = [
    {x: 1330, y: 300, to: brainAt, p: brain},
    {x: 430, y: 300, to: snout, p: sound},
  ];
  return (
    <AbsoluteFill>
      <Cam keys={K.sea} f={local} style={{background: BG.sonar}}>
      <LightShafts frame={f} id="s1d" />
      <Surface frame={f} id="s1d" />
      <Dust frame={f} seed="s1d" />
      <svg width="1920" height="1080" style={{position: "absolute"}}>
        <g transform={`translate(${tx} ${ty}) scale(${s})`}>
          <Whale frame={f} id="sea" glow={brain} />
        </g>
      </svg>
      <SonarRings frame={f} starts={T.pingsSound} cx={snout.x} cy={snout.y} r0={40} fadeAt={900} />
      <svg width="1920" height="1080" style={{position: "absolute"}}>
        {lines.map(({x, y, to, p}) => (
          <line key={x} x1={x} y1={y} x2={x + (to.x - x) * p} y2={y + (to.y - y) * p} stroke="#ADBBC2" strokeWidth="3" strokeDasharray="12 10" opacity="0.7" />
        ))}
      </svg>
      <Pill text="ഏറ്റവും വലിയ തലച്ചോർ" x={1330} y={300} frame={f} start={T.brainPill} size={46} />
      <Pill text="ഏറ്റവും ശക്തമായ ശബ്ദം" x={430} y={300} frame={f} start={T.soundPill} size={46} />
      </Cam>
      <Vignette strength={0.72} />
    </AbsoluteFill>
  );
};

const RevealShot = ({f: local}: {f: number}) => {
  const f = local + T.cutReveal;
  const s = 1.3;
  return (
    <AbsoluteFill>
      <Cam keys={K.reveal} f={local} style={{background: BG.scale}}>
      <Dust frame={f} seed="s1e" />
      <svg width="1920" height="1080" style={{position: "absolute"}}>
        <g transform={`translate(${320 - local * 0.35} 560) scale(${s})`}>
          <Whale frame={f} id="reveal" />
        </g>
      </svg>
      <ScaleLabel text="മലയാളത്തിൽ: എണ്ണത്തിമിംഗലം" frame={f} start={T.malayalamName} top={826} size={56} />
      </Cam>
      <Title text="സ്പേം തിമിംഗലം" frame={f} start={T.name} top={110} size={96} />
      <Vignette strength={0.85} />
    </AbsoluteFill>
  );
};

// Listed in one table so the sync can be checked against the MP4.
export const CUES: {file: string; frame: number; volume: number}[] = [
  {file: "ui_pop.wav", frame: T.clips[0], volume: 0.6},
  {file: "ui_pop.wav", frame: T.clips[1], volume: 0.6},
  {file: "thud.wav", frame: T.clips[2], volume: 0.7},
  {file: "ui_alert.wav", frame: T.underline, volume: 0.7},
  {file: "thud.wav", frame: T.cutSeizure, volume: 0.9},
  {file: "ui_pop.wav", frame: T.seizureTitle, volume: 0.6},
  {file: "ui_pop.wav", frame: T.kg, volume: 0.6},
  {file: "ui_pop.wav", frame: T.bracketsIn, volume: 0.6},
  {file: "ui_pop.wav", frame: T.bracketsLand, volume: 0.6},
  {file: "thud.wav", frame: T.cutLump, volume: 0.9},
  {file: "ui_pop.wav", frame: T.waxTitle, volume: 0.6},
  ...T.pingsLump.map((frame) => ({file: "sonar_ping.wav", frame, volume: 0.6})),
  {file: "thud.wav", frame: T.cutSea, volume: 0.9},
  {file: "ui_pop.wav", frame: T.brainPill, volume: 0.6},
  ...T.pingsSound.map((frame) => ({file: "sonar_ping.wav", frame, volume: 0.5})),
  {file: "ui_pop.wav", frame: T.soundPill, volume: 0.6},
  {file: "thud.wav", frame: T.cutReveal, volume: 0.9},
  {file: "ui_pop.wav", frame: T.name, volume: 0.6},
  {file: "ui_pop.wav", frame: T.malayalamName, volume: 0.6},
];

export const s1: Shot[] = [
  {dur: T.cutSeizure, C: ClippingsShot, link: {kind: "push", from: [1700, 860], to: [960, 520]}}, // into the photo of the lump
  {dur: T.cutLump - T.cutSeizure, C: SeizureShot, link: {kind: "push", from: [960, 546], to: [960, 564]}}, // closer on the same lump
  {dur: T.cutSea - T.cutLump, C: LumpShot, link: {kind: "tilt", dir: 1}}, // sink into the sea
  {dur: T.cutReveal - T.cutSea, C: SeaShot, link: {kind: "push", from: [804, 692], to: [953, 544]}}, // through the whale's eye
  {dur: T.end - T.cutReveal, C: RevealShot, link: {kind: "push", from: [900, 620], to: [960, 600]}}, // into the belly, out to the lump
];
