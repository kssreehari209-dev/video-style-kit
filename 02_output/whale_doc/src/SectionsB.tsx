// Sections 6 to 10. Beats are estimated from the script's sentences, in frames at 30 fps.
import {AbsoluteFill, random} from "remotion";
import {BG, SonarRings} from "./atmosphere";
import {Fixed} from "./cam";
import {Cue, Fade, Icon, Lead, PopG, Row, Scene, Sea, Shot, Svg, W} from "./kit";
import {Clipping} from "./Objects";
import {Brain, Ship, Swimmer} from "./Props";
import {C, FONT, lerp, snap} from "./theme";
import {Pill, RedBox, RedCaption, Rule, ScaleLabel, Strike, Title} from "./ui";

/* ---------- Section 6: തൃശൂർ ശൈലിയും കണ്ണൂർ ശൈലിയും ---------- */

// One click pattern per family: gaps between clicks in px, also used as timing.
const CODA: [string, number[]][] = [
  [C.green, [0, 34, 68, 136, 170]],
  [C.amber, [0, 70, 90, 110, 180]],
  [C.title, [0, 24, 48, 72, 170]],
];
const clickFrame = (start: number, gap: number) => start + Math.round(gap / 5);
const codaCues = (start: number, g: number): Cue[] => CODA[g][1].map((gap) => ["ui_check", clickFrame(start, gap)]);

const Family = ({f, cx, g, start}: {f: number; cx: number; g: number; start: number}) => {
  const [color, gaps] = CODA[g];
  const p = snap(f, start - 12);
  return (
    <g opacity={p}>
      {[120, 190, 260].map((r, i) => {
        const pulse = snap(f, start + i * 6, 16);
        return <circle key={r} cx={cx} cy="540" r={r * (0.7 + 0.3 * pulse)} fill="none" stroke={color} strokeWidth="3" opacity={(0.75 - i * 0.2) * pulse} />;
      })}
      <Icon x={cx - 130} y={490} s={0.26} color="#4F4C48" />
      <Icon x={cx - 86} y={560} s={0.17} color="#3F3D39" />
      <Icon x={cx - 10} y={590} s={0.14} color="#3F3D39" />
      {gaps.map((d) => {
        const dot = snap(f, clickFrame(start, d), 4);
        return <circle key={d} cx={cx - 85 + d} cy="860" r={13 * dot} fill={color} />;
      })}
    </g>
  );
};

const GRID = {x: 280, y: 200, cols: 170, rows: 51, d: 8};
const FULL = GRID.cols * GRID.rows; // 8,670 dots in whole rows, plus 49 in a last short row

export const s6: Shot[] = [
  {
    dur: 210,
    link: {kind: "pan", dir: 1},
    cam: [[0, 640, 580, 1.5], [84, 640, 580, 1.54], [104, 1371, 580, 1.75, "ease"], [145, 1371, 580, 1.78], [170, 960, 520, 1, "ease"], [209, 960, 520, 1.03]], // big brain, pan to the small one, pull back to compare
    cues: [["thud", 15], ["ui_pop", 30], ["thud", 90, 0.6], ["ui_pop", 105]],
    C: ({f}) => (
      <Scene f={f} bg={BG.scale} seed="s61">
        <Svg>
          <PopG x={640} y={430} p={snap(f, 15)}>
            <Brain id="big" x={640} y={430} s={1.7} />
          </PopG>
          <PopG x={1340} y={490} p={snap(f, 90)}>
            <Brain id="small" x={1340} y={490} s={0.72} />
          </PopG>
        </Svg>
        <Rule frame={f} start={15} y={720} half={300} cx={640} />
        <Rule frame={f} start={90} y={720} half={300} cx={1340} />
        <ScaleLabel text="~8 KG" frame={f} start={30} left={340} width={600} top={744} size={64} />
        <ScaleLabel text="< 1.5 KG" frame={f} start={105} left={1040} width={600} top={744} size={64} />
        <ScaleLabel text="തിമിംഗലം" frame={f} start={30} left={340} width={600} top={834} size={40} />
        <ScaleLabel text="മനുഷ്യൻ" frame={f} start={105} left={1040} width={600} top={834} size={40} />
      </Scene>
    ),
  },
  {
    dur: 240,
    link: {kind: "tilt", dir: 1},
    cam: [[0, 960, 470, 1.06], [60, 960, 470, 1.08], [70, 960, 430, 1.16, "snap"], [128, 960, 430, 1.17], [150, 960, 500, 1, "ease"], [239, 960, 500, 1.04]], // punch in on the strike, pull back for the turn
    cues: [["ui_pop", 8], ["ui_alert", 60], ["ui_pop", 130]],
    C: ({f}) => (
      <Scene f={f} bg={BG.scale} seed="s62">
        <div style={{position: "absolute", top: 370, width: "100%", textAlign: "center", opacity: snap(f, 8)}}>
          <Strike p={snap(f, 60, 12)} size={72}>
            വലിയ തലച്ചോർ = കൂടുതൽ ബുദ്ധി
          </Strike>
        </div>
        <ScaleLabel text="പക്ഷേ, സാമൂഹിക ജീവിതം അത്ഭുതപ്പെടുത്തുന്നതാണ്" frame={f} start={130} top={540} size={52} />
      </Scene>
    ),
  },
  {
    dur: 270,
    link: {kind: "pan", dir: 1},
    cam: [[0, 1120, 560, 1.2], [118, 1060, 560, 1.2], [150, 960, 540, 1, "ease"], [269, 960, 540, 1.04]], // track the family, pull back for the clicks
    cues: [["ui_pop", 10], ["sonar_ping", 120, 0.4], ["ui_pop", 125], ...codaCues(135, 0)],
    C: ({f}) => {
      const tx = lerp(f, 0, 270, 720, 600);
      const [color, gaps] = CODA[0];
      return (
        <Sea f={f} seed="s63">
          <Svg>
            <W f={f} x={tx} y={470} s={0.7} id="s63a" />
            <W f={f + 40} x={tx + 150} y={640} s={0.5} id="s63b" />
            <W f={f + 80} x={tx - 30} y={660} s={0.26} id="s63c" />
            {[0, 1, 2].map((i) => {
              const age = f - (120 + i * 20);
              if (age < 0) return null;
              return <circle key={i} cx={tx + 280} cy={540} r={80 + age * 6} fill="none" stroke={color} strokeWidth="3" opacity={Math.max(0, 0.7 * (1 - age / 110))} />;
            })}
            {gaps.map((d) => {
              const dot = snap(f, clickFrame(135, d), 4);
              return <circle key={d} cx={875 + d} cy="900" r={13 * dot} fill={color} />;
            })}
          </Svg>
          <Title text="പെൺതിമിംഗലങ്ങളും കുഞ്ഞുങ്ങളും" frame={f} start={10} />
          <Pill text="കോഡ" x={960} y={980} frame={f} start={125} />
        </Sea>
      );
    },
  },
  {
    dur: 180,
    link: {kind: "push", from: [360, 540], to: [784, 344]},
    cam: [[0, 640, 680, 1.5], [50, 640, 680, 1.5], [66, 960, 680, 1.5, "ease"], [90, 960, 680, 1.5], [106, 1280, 680, 1.5, "ease"], [140, 1280, 680, 1.5], [165, 960, 540, 1, "ease"], [179, 960, 540, 1]], // visit each group as it speaks, then show all three
    cues: [["ui_pop", 8], ...codaCues(24, 0), ...codaCues(64, 1), ...codaCues(104, 2)],
    C: ({f}) => (
      <Sea f={f} seed="s64">
        <Svg>
          <Family f={f} cx={360} g={0} start={24} />
          <Family f={f} cx={960} g={1} start={64} />
          <Family f={f} cx={1560} g={2} start={104} />
        </Svg>
        <Title text="ഓരോ കൂട്ടത്തിനും സ്വന്തം ശൈലി" frame={f} start={8} />
      </Sea>
    ),
  },
  {
    dur: 180,
    link: {kind: "pan", dir: 1},
    cam: [[0, 686, 680, 1.4], [70, 686, 680, 1.4], [86, 1234, 680, 1.4, "ease"], [140, 1234, 680, 1.4], [165, 960, 540, 1, "ease"], [179, 960, 540, 1]], // Thrissur, then Kannur, then both
    cues: [["ui_pop", 8], ...codaCues(24, 0), ["ui_pop", 30], ...codaCues(84, 1), ["ui_pop", 90]],
    C: ({f}) => (
      <Sea f={f} seed="s65">
        <Svg>
          <Family f={f} cx={560} g={0} start={24} />
          <Family f={f} cx={1360} g={1} start={84} />
        </Svg>
        <Title text="തൃശൂർ ശൈലിയും കണ്ണൂർ ശൈലിയും" frame={f} start={8} />
        <Pill text="തൃശൂർ" x={560} y={960} frame={f} start={30} color={C.green} />
        <Pill text="കണ്ണൂർ" x={1360} y={960} frame={f} start={90} color={C.amber} />
      </Sea>
    ),
  },
  {
    dur: 300,
    link: {kind: "tilt", dir: 1},
    cam: [[0, 640, 360, 1.7], [180, 960, 540, 1, "ease"], [299, 960, 540, 1.04]], // start on the first dots, pull out as the count grows
    cues: [["ui_pop", 8], ["scan_typing", 30], ["scan_typing", 52], ["scan_typing", 74], ["scan_typing", 96], ["scan_typing", 118], ["scan_typing", 140], ["scan_typing", 162], ["ui_pop", 182], ["ui_pop", 210]],
    C: ({f}) => {
      const shown = Math.round(lerp(f, 30, 180, 0, 8719));
      const rows = Math.floor(shown / GRID.cols);
      return (
        <Scene f={f} bg={BG.scale} seed="s66">
          {/* One dot per coda */}
          <div
            style={{
              position: "absolute",
              left: GRID.x,
              top: GRID.y,
              width: GRID.cols * GRID.d,
              height: rows * GRID.d,
              backgroundImage: `radial-gradient(circle at 50% 50%, ${C.title} 1.6px, rgba(0,0,0,0) 2.2px)`,
              backgroundSize: `${GRID.d}px ${GRID.d}px`,
              opacity: 0.72,
            }}
          />
          <Svg>
            {shown > FULL &&
              Array.from({length: shown - FULL}).map((_, i) => <circle key={i} cx={GRID.x + 4 + i * GRID.d} cy={GRID.y + GRID.rows * GRID.d + 4} r="1.9" fill={C.title} opacity="0.72" />)}
          </Svg>
          <Title text="2024 · ഡൊമിനിക്ക" frame={f} start={8} top={60} />
          <Fixed>
            <div style={{position: "absolute", top: 690, width: "100%", textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 72, color: C.scale, textShadow: "0 0 18px #03090D, 0 0 18px #03090D", opacity: snap(f, 30)}}>
              {shown.toLocaleString("en-US")} CODAS
            </div>
          </Fixed>
          <RedCaption text="താളം + വേഗം = ഘടന" frame={f} start={210} top={830} size={56} />
        </Scene>
      );
    },
  },
  {
    dur: 270,
    link: {kind: "tilt", dir: 1},
    cam: [[0, 960, 470, 1.1], [168, 960, 500, 1.16], [182, 960, 620, 1.18, "snap"], [269, 960, 625, 1.2]], // slow push, then punch into the red box
    cues: [["ui_pop", 8], ["ui_pop", 40], ["ui_pop", 95], ["ui_alert", 170]],
    C: ({f}) => (
      <Scene f={f} bg={BG.scale} seed="s67">
        <Title text="അക്ഷരമാല?" frame={f} start={8} world />
        <Row text="ചിലർ: അക്ഷരമാല പോലെ" y={290} f={f} start={40} />
        <Row text="മറ്റു ചിലർ: ആ ഉപമയോട് വിയോജിപ്പ്" y={420} f={f} start={95} />
        <RedBox text="അവർ പറയുന്നത് ഇന്നും ആർക്കും അറിയില്ല" x={210} y={610} w={1500} h={130} size={56} frame={f} start={170} />
      </Scene>
    ),
  },
  {
    dur: 300,
    link: {kind: "tilt", dir: -1},
    cam: [[0, 960, 660, 1.3], [299, 960, 440, 1.3]], // tilt up from the tails to the raised heads
    cues: [["ui_pop", 10], ["ui_pop", 170]],
    C: ({f}) => {
      const bob = (i: number) => Math.sin(f * 0.03 + i * 1.8) * 7;
      const whales = [
        [470, 330, 0.72, 90],
        [850, 270, 0.8, 87],
        [1230, 360, 0.66, 92],
        [1540, 300, 0.7, 89],
      ];
      return (
        <Sea f={f} seed="s68">
          <Svg>
            {whales.map(([x, y, s, r], i) => (
              <W key={x} f={f} x={x} y={y + bob(i)} s={s} r={r} id={`s68${i}`} amp={6} opacity={lerp(f, 24 + i * 22, 54 + i * 22, 0, 1)} />
            ))}
          </Svg>
          {f < 170 ? <Title text="ഉറക്കവും വിചിത്രം" frame={f} start={10} top={120} /> : <Title text="കുറച്ചു മിനിറ്റുകൾ മാത്രം" frame={f} start={170} top={120} />}
        </Sea>
      );
    },
  },
];

/* ---------- Section 7: ഇവ മനുഷ്യർക്ക് അപകടകാരികളാണോ? ---------- */

// Whale strikes the bow at `hit`. after = 0 at the moment of impact, 1 when the ship has settled.
const Wreck = ({f, id, approach, after, mirror = false}: {f: number; id: string; approach: number; after: number; mirror?: boolean}) => {
  const jolt = after > 0 && after < 0.1 ? Math.sin(after * 120) * (0.1 - after) * 90 : 0;
  return (
    <>
      <Svg style={{transform: `translateX(${jolt}px)`}}>
        <g transform={mirror ? "translate(1920 0) scale(-1 1)" : undefined}>
          <g transform={`translate(1290 ${640 + after * 44}) scale(-1 1)`}>
            <Ship x={0} y={0} s={1} tilt={-7 - 9 * after} />
          </g>
          <W f={f} x={260 + (910 - 260) * approach - after * 40} y={716} s={0.86} id={id} r={-5} flip />
          <rect y="700" width="1920" height="380" fill="#061318" opacity="0.62" />
          <path d="M0 700Q240 680 480 700T960 700T1440 700T1920 700" stroke="#6E98A6" strokeWidth="2" fill="none" opacity="0.7" />
        </g>
      </Svg>
    </>
  );
};

const SwimScene = ({f, seed, swim, gap}: {f: number; seed: string; swim: number; gap: number}) => (
  <Svg>
    <W f={f} x={640} y={540} s={1.1} id={seed} />
    <Swimmer x={swim} y={540 + Math.sin(f * 0.06) * 8} s={1} />
    <Lead x1={swim + 120} y1={540} x2={630} y2={540} p={gap} />
  </Svg>
);

export const s7: Shot[] = [
  {
    dur: 300,
    link: {kind: "blend"},
    cam: [[0, 711, 650, 1.35], [140, 900, 650, 1.35], [160, 900, 620, 1.5, "snap"], [200, 900, 620, 1.5], [299, 960, 580, 1.12, "ease"]], // follow the whale in, punch on the impact, ease back
    cues: [["ui_pop", 8], ["ui_pop", 40], ["thud", 150]],
    C: ({f}) => (
      <Scene f={f} bg={BG.scale} seed="s71">
        <Wreck f={f} id="s71" approach={lerp(f, 0, 150, 0, 1)} after={lerp(f, 150, 300, 0, 0.7)} />
        <Title text="1820 · ESSEX" frame={f} start={8} />
        <Fixed>
          <Pill text="പസഫിക് സമുദ്രം" x={960} y={960} frame={f} start={40} />
        </Fixed>
      </Scene>
    ),
  },
  {
    dur: 120,
    link: {kind: "pan", dir: 1},
    cam: [[0, 960, 580, 1.12], [119, 1120, 520, 1.25]], // slow push on the sinking ship
    cues: [["ui_pop", 6], ["ui_pop", 36]],
    C: ({f}) => (
      <Scene f={f} bg={BG.scale} seed="s72">
        <Wreck f={f + 300} id="s72" approach={1} after={lerp(f, 0, 120, 0.7, 1)} />
        <Title text="മോബി ഡിക്ക്" frame={f} start={6} />
        <Fixed>
          <Pill text="നോവലിന് പ്രചോദനം" x={960} y={960} frame={f} start={36} />
        </Fixed>
      </Scene>
    ),
  },
  {
    dur: 120,
    link: {kind: "pan", dir: 1},
    cam: [[0, 1209, 650, 1.35], [36, 1040, 650, 1.35], [48, 1020, 620, 1.5, "snap"], [119, 1020, 580, 1.35]], // same strike, mirrored
    cues: [["ui_pop", 6], ["thud", 40]],
    C: ({f}) => (
      <Scene f={f} bg={BG.scale} seed="s73">
        <Wreck f={f} id="s73" approach={lerp(f, 0, 40, 0.5, 1)} after={lerp(f, 40, 120, 0, 0.6)} mirror />
        <Title text="1851 · ANN ALEXANDER" frame={f} start={6} />
      </Scene>
    ),
  },
  {
    dur: 120,
    link: {kind: "tilt", dir: 1},
    cam: [[0, 700, 520, 1.3], [119, 1220, 520, 1.3]], // linear pan across both ships
    cues: [["ui_pop", 8], ["ui_alert", 50]],
    C: ({f}) => (
      <Scene f={f} bg={BG.scale} seed="s74">
        <Svg>
          <Ship x={560} y={620} s={0.72} />
          <Ship x={1380} y={620} s={0.72} />
          <rect y="680" width="1920" height="400" fill="#061318" opacity="0.62" />
          <path d="M0 680Q240 660 480 680T960 680T1440 680T1920 680" stroke="#6E98A6" strokeWidth="2" fill="none" opacity="0.7" />
        </Svg>
        <Title text="രണ്ടും വേട്ടയ്ക്ക് വന്ന കപ്പലുകൾ" frame={f} start={8} />
        <Fixed>
          <RedCaption text="തിമിംഗലങ്ങളെ കൊല്ലാൻ" frame={f} start={50} top={880} size={56} />
        </Fixed>
      </Scene>
    ),
  },
  {
    dur: 150,
    link: {kind: "pan", dir: -1},
    cam: [[0, 960, 560, 1], [149, 960, 560, 1.35]], // slow push into the eye
    cues: [["ui_pop", 8], ["ui_pop", 80]],
    C: ({f}) => (
      <Scene f={f} bg={BG.deep} seed="s75">
        <Svg>
          <W f={f} x={960 - 282 * 5} y={560 - 40 * 5} s={5} id="s75" amp={0} />
        </Svg>
        <Title text="ആ മനസ്സിൽ എന്തായിരുന്നു?" frame={f} start={8} />
        <Fixed>
          <Pill text="നമുക്കറിയില്ല" x={960} y={930} frame={f} start={80} />
        </Fixed>
      </Scene>
    ),
  },
  {
    dur: 300,
    link: {kind: "blend"},
    cam: [[0, 480, 540, 2], [120, 960, 540, 1, "ease"], [299, 960, 540, 1.05]], // tiny swimmer, pull out to the huge whale
    cues: [["ui_pop", 10], ["ui_pop", 150]],
    C: ({f}) => (
      <Sea f={f} seed="s76">
        <SwimScene f={f} seed="s76" swim={lerp(f, 0, 300, 190, 260)} gap={0} />
        <Title text="മനുഷ്യരെ തേടി ആക്രമിക്കാറില്ല" frame={f} start={10} />
        <Pill text="ഡൊമിനിക്ക · അനുമതിയോടെ" x={960} y={880} frame={f} start={150} />
      </Sea>
    ),
  },
  {
    dur: 240,
    link: {kind: "pan", dir: 1},
    cam: [[0, 960, 540, 1.05], [30, 686, 540, 1.4, "ease"], [84, 686, 540, 1.4], [130, 960, 560, 1, "ease"], [239, 960, 560, 1.04]], // on the gap, then back out
    cues: [["ui_pop", 8], ["ui_pop", 30], ["ui_alert", 90]],
    C: ({f}) => (
      <Sea f={f} seed="s77">
        <SwimScene f={f + 300} seed="s77" swim={260} gap={snap(f, 30, 18)} />
        <Title text="അകലം പാലിക്കുക" frame={f} start={8} />
        <ScaleLabel text="40 TONNES" frame={f} start={90} top={830} />
      </Sea>
    ),
  },
];

/* ---------- Section 8: കണക്ക് നേരെ തിരിച്ചാണ് ---------- */

export const s8: Shot[] = [
  {
    dur: 180,
    link: {kind: "tilt", dir: 1},
    cam: [[0, 960, 400, 1.15], [90, 960, 420, 1.18], [100, 960, 500, 1.4, "snap"], [179, 960, 520, 1.46]], // punch in on the answer
    cues: [["ui_pop", 8], ["ui_alert", 90]],
    C: ({f}) => (
      <Scene f={f} bg={BG.scale} seed="s81">
        <Title text="അപകടം ശരിക്കും ആർക്ക്?" frame={f} start={8} top={300} />
        <RedBox text="തിമിംഗലങ്ങൾക്ക്" x={510} y={480} w={900} h={130} size={64} frame={f} start={90} />
      </Scene>
    ),
  },
  {
    dur: 300,
    link: {kind: "pan", dir: 1},
    cam: [[0, 960, 400, 1.35], [186, 960, 440, 1.25], [205, 960, 540, 1, "ease"], [299, 960, 540, 1.05]], // close on the fading rows, pull back for the ban
    cues: [["ui_pop", 8], ["scan_typing", 20], ["scan_typing", 60], ["scan_typing", 100], ["scan_typing", 140], ["ui_alert", 190]],
    C: ({f}) => {
      const gone = Math.round(lerp(f, 20, 190, 0, 26)); // a picture of decline, not a count
      return (
        <Scene f={f} bg={BG.scale} seed="s82">
          <Svg>
            {Array.from({length: 40}).map((_, i) => (
              <Icon key={i} x={240 + (i % 10) * 150} y={260 + Math.floor(i / 10) * 96} s={0.13} color={i >= gone ? "#555A5D" : "#1C2023"} />
            ))}
          </Svg>
          <Title text="നൂറ്റാണ്ടുകളുടെ വേട്ട" frame={f} start={8} />
          <RedBox text="1986 · വാണിജ്യ വേട്ട നിരോധനം" x={420} y={700} w={1080} h={120} size={52} frame={f} start={190} />
        </Scene>
      );
    },
  },
  {
    dur: 540,
    link: {kind: "tilt", dir: 1},
    cam: [[0, 960, 440, 1], [60, 960, 440, 1], [76, 640, 470, 1.5, "ease"], [190, 640, 470, 1.55], [214, 1371, 470, 1.75, "ease"], [320, 1371, 470, 1.78], [345, 960, 540, 1, "ease"], [539, 960, 540, 1.06]], // left figure, pan to the right figure, back for the caveat
    cues: [["ui_pop", 8], ["thud", 60, 0.6], ["ui_pop", 66], ["thud", 200], ["ui_pop", 206], ["ui_alert", 340], ["ui_pop", 430]],
    C: ({f}) => (
      <Scene f={f} bg={BG.scale} seed="s83">
        <Rule frame={f} start={60} y={500} half={300} cx={560} />
        <Rule frame={f} start={200} y={500} half={300} cx={1360} />
        <ScaleLabel text="~3.5 LAKH" frame={f} start={66} left={260} width={600} top={370} size={72} />
        <ScaleLabel text="8 LAKH+" frame={f} start={206} left={1060} width={600} top={370} size={72} />
        <ScaleLabel text="2002" frame={f} start={66} left={260} width={600} top={530} />
        <ScaleLabel text="2022" frame={f} start={206} left={1060} width={600} top={530} />
        <Title text="എത്ര തിമിംഗലങ്ങൾ ബാക്കി?" frame={f} start={8} />
        <RedCaption text="കാരണം മെച്ചപ്പെട്ട കണക്കെടുപ്പ്" frame={f} start={340} top={700} />
        <ScaleLabel text="എണ്ണം കുതിച്ചുയർന്നതല്ല" frame={f} start={430} top={810} size={44} />
      </Scene>
    ),
  },
  {
    dur: 330,
    link: {kind: "tilt", dir: -1},
    cam: [[0, 960, 560, 1.3], [50, 960, 560, 1.3], [66, 738, 415, 1.3, "ease"], [110, 738, 415, 1.3], [126, 1182, 415, 1.3, "ease"], [170, 1182, 415, 1.3], [186, 738, 665, 1.3, "ease"], [230, 738, 665, 1.3], [246, 1182, 665, 1.3, "ease"], [275, 1182, 665, 1.3], [305, 960, 540, 1, "ease"], [329, 960, 540, 1]], // visit each threat, then show all four
    cues: [["ui_pop", 8], ["ui_pop", 50], ["ui_pop", 110], ["ui_pop", 170], ["ui_pop", 230]],
    C: ({f}) => (
      <Scene f={f} bg={BG.scale} seed="s84">
        <Svg>
          <W f={f} x={560} y={560} s={0.8} id="s84" />
          <Lead x1={960} y1={560} x2={300} y2={290} p={snap(f, 50, 12)} />
          <Lead x1={960} y1={560} x2={1620} y2={290} p={snap(f, 110, 12)} />
          <Lead x1={960} y1={560} x2={300} y2={880} p={snap(f, 170, 12)} />
          <Lead x1={960} y1={560} x2={1620} y2={880} p={snap(f, 230, 12)} />
        </Svg>
        <Title text="ഇന്ന് ഭീഷണികൾ വേറെ" frame={f} start={8} top={60} world />
        <Pill text="കപ്പലുകൾ" x={300} y={290} frame={f} start={56} />
        <Pill text="വലകൾ" x={1620} y={290} frame={f} start={116} />
        <Pill text="ശബ്ദമലിനീകരണം" x={320} y={880} frame={f} start={176} />
        <Pill text="പ്ലാസ്റ്റിക്" x={1620} y={880} frame={f} start={236} />
      </Scene>
    ),
  },
];

/* ---------- Section 9: കടലിലെ കൃഷിക്കാരൻ ---------- */

const Plankton = ({n, seed}: {n: number; seed: string}) => (
  <>
    {Array.from({length: n}).map((_, i) => {
      const r = (k: string) => random(`${seed}${i}${k}`);
      return <circle key={i} cx={r("x") * 1920} cy={40 + r("y") * r("y") * 340} r={2 + r("r") * 6} fill={C.green} opacity={0.3 + r("o") * 0.6} />;
    })}
  </>
);

export const s9: Shot[] = [
  {
    dur: 510,
    link: {kind: "tilt", dir: -1},
    cam: [[0, 960, 640, 1.25], [130, 960, 640, 1.25], [215, 900, 432, 1.25, "ease"], [400, 900, 432, 1.3], [440, 960, 540, 1, "ease"], [509, 960, 540, 1.03]], // rise with the whale to the surface, then back out
    cues: [["ui_pop", 10], ["ui_pop", 215], ["ui_check", 240], ["ui_check", 280], ["ui_check", 320], ["ui_check", 360], ["ui_pop", 400]],
    C: ({f}) => {
      const plume = lerp(f, 130, 290, 0, 1);
      return (
        <Sea f={f} seed="s91">
          <Svg>
            <defs>
              <filter id="plume" x="-30%" y="-60%" width="160%" height="220%">
                <feGaussianBlur stdDeviation="24" />
              </filter>
            </defs>
            <ellipse cx="760" cy="130" rx={40 + 480 * plume} ry={20 + 60 * plume} fill="#674337" opacity={0.75 * Math.min(1, plume * 4)} filter="url(#plume)" />
            <Plankton n={Math.round(lerp(f, 230, 400, 0, 130))} seed="a" />
            <W f={f} x={520} y={lerp(f, 0, 130, 1040, 680)} s={0.9} id="s91" />
          </Svg>
          {f < 215 ? <Title text="ജീവനോടെ കടലിൽ: ഒരു വലിയ ഗുണം" frame={f} start={10} top={260} /> : <Title text="ഇരുമ്പ് സസ്യപ്ലവകങ്ങൾക്ക് വളമാകും" frame={f} start={215} top={260} />}
          <Fixed>
            <ScaleLabel text="ആ പ്ലവകങ്ങൾ കാർബൺ വലിച്ചെടുക്കും" frame={f} start={400} top={880} size={48} />
          </Fixed>
        </Sea>
      );
    },
  },
  {
    dur: 390,
    link: {kind: "pan", dir: 1},
    cam: [[0, 960, 432, 1.25], [110, 960, 540, 1, "ease"], [118, 960, 540, 1], [128, 960, 560, 1.08, "snap"], [389, 960, 570, 1.14]], // from the bloom down to the figure, bump on the number
    cues: [["ui_pop", 30], ["thud", 120], ["ui_pop", 190], ["ui_pop", 260]],
    C: ({f}) => (
      <Sea f={f} seed="s92">
        <Svg>
          <defs>
            <linearGradient id="bloom" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={C.green} stopOpacity="0.16" />
              <stop offset="1" stopColor={C.green} stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width="1920" height="460" fill="url(#bloom)" />
          <Plankton n={Math.round(lerp(f, 0, 200, 130, 420))} seed="a" />
        </Svg>
        <Title text="2 LAKH+ TONNES CARBON" frame={f} start={120} top={470} size={72} world />
        <ScaleLabel text="ഓരോ വർഷവും" frame={f} start={190} top={590} />
        <Pill text="~12,000 തിമിംഗലങ്ങൾ · ദക്ഷിണ സമുദ്രം" x={960} y={760} frame={f} start={30} />
        <ScaleLabel text="ഒരു പഠനത്തിന്റെ കണക്ക്" frame={f} start={260} top={840} size={40} />
      </Sea>
    ),
  },
];

/* ---------- Section 10: ആ കട്ടയുടെ യഥാർത്ഥ വില ---------- */

export const s10: Shot[] = [
  {
    dur: 270,
    link: {kind: "tilt", dir: 1},
    cam: [[0, 960, 500, 1], [118, 940, 400, 1.5, "ease"], [135, 940, 400, 1.6, "snap"], [150, 940, 400, 1.6], [215, 960, 520, 1, "ease"], [269, 960, 520, 1.03]], // push into the price, then back away from it
    cues: [["ui_pop", 0], ["ui_alert", 120], ["ui_pop", 150]],
    C: ({f}) => {
      const strike = snap(f, 120, 12);
      return (
        <Scene f={f} bg={BG.deep} seed="s101">
          <Clipping
            id="s101"
            x={400}
            y={200}
            w={1120}
            h={600}
            rotate={-1.5}
            p={snap(f, 0)}
            seed={7}
            size={70}
            lines={2}
            dim={lerp(f, 150, 240, 1, 0.42)}
            headline={
              <>
                തിമിംഗല ഛർദ്ദി പിടികൂടി,
                <br />
                <span style={{position: "relative", display: "inline-block"}}>
                  വില കോടികൾ
                  <span style={{position: "absolute", left: -10, top: "54%", height: 8, width: `calc(${100 * strike}% + ${20 * strike}px)`, background: C.red}} />
                </span>
              </>
            }
          />
          <ScaleLabel text="കഥ കോടികളുടേതല്ല" frame={f} start={150} top={860} size={56} />
        </Scene>
      );
    },
  },
  {
    dur: 630,
    cam: [[0, 860, 620, 1.4], [629, 960, 540, 1]], // one long pull back, leaving the whale alone in the dark
    cues: [
      ["ui_pop", 20],
      ["sonar_ping", 10],
      ["sonar_ping", 110],
      ["sonar_ping", 210],
      ["ui_pop", 230],
      ["sonar_ping", 310],
      ["sonar_ping", 410],
      ["ui_pop", 420],
      ["sonar_ping", 510, 0.4],
    ],
    C: ({f}) => {
      const x = lerp(f, 0, 630, 700, 780);
      const y = lerp(f, 0, 630, 640, 840); // constant linear sink
      const s = lerp(f, 0, 630, 0.62, 0.42);
      return (
        <AbsoluteFill>
          <Scene f={f} bg="radial-gradient(ellipse 60% 55% at 50% 40%, #071419 0%, #020507 80%)" seed="s102">
            <SonarRings frame={f} starts={[10, 110, 210, 310, 410, 510]} cx={x + 20} cy={y - 40} r0={40} fadeAt={980} />
            <Svg>
              <W f={f} x={x} y={y} s={s} id="s102" r={-18} opacity={lerp(f, 0, 630, 1, 0.55)} />
            </Svg>
            {f < 230 ? (
              <Title text="ഒരു തരി വെളിച്ചമില്ലാത്ത ഇരുട്ടിൽ" frame={f} start={20} />
            ) : f < 420 ? (
              <Title text="ശബ്ദം കൊണ്ട് ലോകം കാണുന്ന ഒരു ജീവി" frame={f} start={230} />
            ) : (
              <Title text="ഇപ്പോഴും സംസാരിച്ചുകൊണ്ടിരിക്കുന്നു" frame={f} start={420} />
            )}
          </Scene>
          <Fade p={lerp(f, 560, 629, 0, 1)} />
        </AbsoluteFill>
      );
    },
  },
];

