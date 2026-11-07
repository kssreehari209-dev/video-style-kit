// Sections 2 to 5. Beats are estimated from the script's sentences, in frames at 30 fps.
import {AbsoluteFill} from "remotion";
import {BG, Dust, SonarRings, Vignette} from "./atmosphere";
import {Fixed} from "./cam";
import {Lead, PopG, Scene, Sea, Shot, Svg, W} from "./kit";
import {Lump} from "./Objects";
import {BeakedWhale, Beak, Bus, Meter, Squid, Stamp} from "./Props";
import {C, lerp, snap} from "./theme";
import {Whale} from "./Whale";
import {Brackets, Pill, RedBox, RedCaption, Rule, ScaleLabel, Strike, Title} from "./ui";

/* ---------- Section 2: ഛർദ്ദിയല്ലാത്ത ഛർദ്ദി ---------- */

export const s2: Shot[] = [
  {
    dur: 210,
    link: {kind: "tilt", dir: 1},
    cam: [[0, 960, 600, 1], [209, 960, 610, 1.12]], // slow push on the lump
    cues: [["ui_pop", 6], ["ui_pop", 120]],
    C: ({f}) => (
      <Scene f={f} bg={BG.deep} seed="s21">
        <Svg>
          <g transform="translate(960 610)">
            <Lump id="s21" scale={1.1} />
          </g>
        </Svg>
        {f < 120 ? <Title text="ആ കട്ട എങ്ങനെയുണ്ടായി?" frame={f} start={6} /> : <Title text="ആദ്യം, ഇതിന്റെ ഭക്ഷണം" frame={f} start={120} />}
      </Scene>
    ),
  },
  {
    dur: 180,
    link: {kind: "blend"},
    cam: [[0, 480, 760, 2], [75, 480, 760, 1.9], [90, 960, 540, 1, "snap"], [179, 1000, 560, 1.06]], // close on the tiny squid, snap wide as the giant rises
    cues: [["ui_pop", 12], ["ui_pop", 26], ["thud", 75], ["ui_pop", 82]],
    C: ({f}) => {
      const rise = snap(f, 75, 18);
      return (
        <Scene f={f} bg={BG.deep} seed="s22">
          <Svg>
            <PopG x={330} y={720} p={snap(f, 12)}>
              <g transform="translate(330 720) rotate(38) scale(0.14)">
                <Squid id="s22s" frame={f} />
              </g>
            </PopG>
            <g transform={`translate(${1260 + (1 - rise) * 240} ${520 + (1 - rise) * 900}) rotate(38) scale(1.1)`}>
              <Squid id="s22" frame={f} />
            </g>
          </Svg>
          <ScaleLabel text="മീൻചട്ടിയിലെ കണവ" frame={f} start={26} left={30} width={600} top={810} size={40} />
          <Title text="ഭീമൻ കണവ" frame={f} start={82} />
        </Scene>
      );
    },
  },
  {
    dur: 240,
    link: {kind: "push", from: [960, 570], to: [600, 540]},
    cam: [[0, 1000, 560, 1.06], [118, 1120, 555, 1.2], [145, 960, 570, 1, "ease"], [239, 960, 570, 1.22]], // drift to the beak, re-center, push in behind the brackets
    cues: [["ui_pop", 10], ["ui_pop", 132], ["ui_pop", 150]],
    C: ({f}) => {
      const body = lerp(f, 60, 115, 1, 0);
      const move = snap(f, 118, 22);
      const b = snap(f, 150, 12);
      const bx = 1233 + (960 - 1233) * move;
      const by = 555 + (570 - 555) * move;
      return (
        <Scene f={f} bg={BG.deep} seed="s23">
          <Svg>
            <g transform="translate(1260 520) rotate(38) scale(1.1)" opacity={body}>
              <Squid id="s23" frame={f + 180} />
            </g>
            <Beak x={bx} y={by} r={-20 + 20 * move} s={1 + 3.6 * move} />
          </Svg>
          <Brackets x={960 - 190 - (1 - b) * 120} y={570 - 150 - (1 - b) * 70} w={380 + (1 - b) * 240} h={300 + (1 - b) * 140} opacity={snap(f, 150, 6)} />
          {f < 130 ? <Title text="ദേഹം ദഹിക്കും" frame={f} start={10} /> : <Title text="കൊക്ക് ദഹിക്കില്ല" frame={f} start={132} />}
        </Scene>
      );
    },
  },
  {
    dur: 270,
    link: {kind: "pan", dir: 1},
    cam: [[0, 738, 540, 1.3], [100, 740, 540, 1.3], [240, 1180, 540, 1.3], [269, 1180, 540, 1.34]], // travel down the gut with the beaks
    cues: [["ui_pop", 8], ["ui_pop", 20], ["ui_pop", 30], ["ui_pop", 40], ["ui_pop", 50], ["ui_pop", 60], ["ui_pop", 70], ["ui_pop", 80], ["ui_pop", 180], ["ui_pop", 215]],
    C: ({f}) => {
      const beaks: [number, number, number][] = [[360, 520, 10], [470, 560, -30], [590, 510, 40], [700, 560, 120], [800, 520, 200], [900, 556, 70], [1000, 520, -60]];
      return (
        <Scene f={f} bg={BG.scale} seed="s24">
          <Svg>
            <defs>
              <linearGradient id="gut" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#4F3229" />
                <stop offset="0.5" stopColor="#674337" />
                <stop offset="1" stopColor="#33201A" />
              </linearGradient>
            </defs>
            <path d="M-40 430Q300 400 620 430T1300 420T1960 440V650Q1600 640 1300 660T620 650T-40 660Z" fill="url(#gut)" />
            <path d="M-40 490Q300 462 620 490T1300 480T1960 500V594Q1600 584 1300 604T620 594T-40 602Z" fill="#3A2219" />
            {beaks.map(([x, y, r], i) => {
              const start = 20 + i * 10;
              const go = lerp(f, 100 + i * 12, 190 + i * 7, 0, 1);
              const px = x + (1370 - x) * go;
              const py = y + (540 - y) * go;
              return (
                <g key={x} opacity={snap(f, start) * (go > 0.96 ? 0 : 1)}>
                  <Beak x={px} y={py} r={r + f * 1.4} s={1.7} />
                </g>
              );
            })}
            <g transform="translate(1390 540)">
              <Lump id="s24" scale={lerp(f, 110, 240, 0.1, 0.42)} shadow={false} />
            </g>
          </Svg>
          <Title text="കുടലിൽ ഉരസുമ്പോൾ" frame={f} start={8} />
          <Pill text="കൊക്കുകൾ" x={640} y={770} frame={f} start={30} />
          <Pill text="ആംബർഗ്രിസ്" x={1390} y={770} frame={f} start={180} />
          <Fixed>
            <ScaleLabel text="ശാസ്ത്രജ്ഞരുടെ നിഗമനം" frame={f} start={215} top={950} size={40} />
          </Fixed>
        </Scene>
      );
    },
  },
  {
    dur: 150,
    link: {kind: "tilt", dir: 1},
    cam: [[0, 960, 470, 1.08], [50, 960, 470, 1.12], [60, 960, 420, 1.3, "snap"], [149, 960, 430, 1.36]], // punch in on the strike
    cues: [["ui_pop", 6], ["ui_alert", 50], ["ui_pop", 78]],
    C: ({f}) => (
      <Scene f={f} bg={BG.scale} seed="s25">
        <div style={{position: "absolute", top: 320, width: "100%", textAlign: "center", opacity: snap(f, 6)}}>
          <Strike p={snap(f, 50, 12)} size={150}>
            ഛർദ്ദി
          </Strike>
        </div>
        <ScaleLabel text="പേര് തന്നെ കൃത്യമല്ല" frame={f} start={78} top={640} size={56} />
      </Scene>
    ),
  },
  {
    dur: 300,
    link: {kind: "pan", dir: -1},
    cam: [[0, 960, 390, 1.35], [85, 960, 400, 1.3], [108, 960, 540, 1, "ease"], [299, 960, 540, 1.04]], // start on the lump, pull back for the red box
    cues: [["ui_pop", 8], ["ui_pop", 40], ["ui_alert", 90], ["ui_pop", 130]],
    C: ({f}) => (
      <Scene f={f} bg={BG.scale} seed="s26">
        <Svg>
          <g transform="translate(960 390)">
            <Lump id="s26" scale={0.72} />
          </g>
        </Svg>
        <Brackets x={760} y={270} w={400} h={250} opacity={snap(f, 40, 6)} />
        <Title text="ഒരു കാര്യം കൂടി" frame={f} start={8} />
        <RedBox text="ഇന്ത്യയിൽ കൈവശം വെക്കുന്നതും വിൽക്കുന്നതും കുറ്റം" x={160} y={610} w={1600} h={120} size={48} frame={f} start={90} />
        <ScaleLabel text="WILDLIFE PROTECTION ACT" frame={f} start={130} top={760} size={36} />
      </Scene>
    ),
  },
];

/* ---------- Section 3: ഒരു ബസിനേക്കാൾ വലിയ വേട്ടക്കാരൻ ---------- */

export const s3: Shot[] = [
  {
    dur: 360,
    link: {kind: "blend"},
    cam: [[0, 700, 380, 1.5], [70, 960, 540, 1, "ease"], [233, 960, 540, 1], [242, 960, 560, 1.06, "snap"], [359, 960, 565, 1.09]], // from the head out to the full scale, bump on the bus
    cues: [["thud", 12], ["ui_pop", 24], ["ui_alert", 120], ["thud", 235]],
    C: ({f}) => {
      const bus = snap(f, 235);
      return (
        <Scene f={f} bg={BG.scale} seed="s31">
          <Svg>
            <W f={f} x={335 + f * 0.05} y={320} s={1.25} id="s31" />
            <PopG x={960} y={880} p={bus}>
              <Bus x={516} y={800} />
            </PopG>
          </Svg>
          <Rule frame={f} start={12} />
          <ScaleLabel text="~16 M" frame={f} start={24} />
          {f < 225 && <RedCaption text="≈ 40 TONNES" frame={f} start={120} top={736} size={72} />}
        </Scene>
      );
    },
  },
  {
    dur: 240,
    link: {kind: "tilt", dir: 1},
    cam: [[0, 960, 565, 1.09], [30, 960, 420, 1.08, "ease"], [60, 700, 400, 1.45, "ease"], [239, 680, 400, 1.52]], // push in on the head third
    cues: [["ui_pop", 30]],
    C: ({f}) => {
      const p = snap(f, 30, 12);
      return (
        <Scene f={f} bg={BG.scale} seed="s32">
          <Svg>
            <W f={f + 360} x={353 + f * 0.05} y={320} s={1.25} id="s32" />
            {/* Darken only the whale behind the head, using its own outline */}
            <clipPath id="rearThird">
              <rect x="770" y="0" width="1150" height="1080" />
            </clipPath>
            <g clipPath="url(#rearThird)" opacity={0.62 * p}>
              <g transform={`translate(${353 + f * 0.05} 320) scale(1.25)`} style={{color: "#061218"}}>
                <Whale frame={f + 360} id="s32d" silhouette />
              </g>
            </g>
            <path d={`M353 508V530H${353 + 416 * p}V508`} stroke={C.red} strokeWidth="5" fill="none" opacity={p} />
          </Svg>
          <ScaleLabel text="തല = 1/3" frame={f} start={30} left={261} width={600} top={544} size={64} />
        </Scene>
      );
    },
  },
  {
    dur: 300,
    link: {kind: "push", from: [401, 514], to: [540, 455]},
    cam: [[0, 1120, 640, 1.2], [299, 1000, 640, 1.3]], // track the whale as the brackets close
    cues: [["ui_pop", 10], ["ui_pop", 60], ["ui_pop", 92]],
    C: ({f}) => {
      const tx = lerp(f, 0, 300, 660, 420); // constant linear speed
      const ty = 650;
      const b = snap(f, 66, 26);
      return (
        <Sea f={f} seed="s33">
          <Svg>
            <W f={f} x={tx} y={ty} s={1.15} id="s33" />
          </Svg>
          <Brackets x={120 + (tx - 50 - 120) * b} y={250 + (ty - 190 - 250) * b} w={1680 + (1260 - 1680) * b} h={740 + (390 - 740) * b} opacity={snap(f, 60, 6)} />
          <Title text="പല്ലുള്ള വേട്ടക്കാരിൽ ഏറ്റവും വലുത്" frame={f} start={10} />
        </Sea>
      );
    },
  },
];

/* ---------- Section 4: ശബ്ദം കൊണ്ട് കാണുന്ന കണ്ണ് ---------- */

export const s4: Shot[] = [
  {
    dur: 240,
    link: {kind: "tilt", dir: 1},
    cam: [[0, 960, 540, 1], [85, 770, 470, 1.25, "ease"], [239, 770, 470, 1.3]], // ease in on the oil organ
    cues: [["ui_pop", 8], ["ui_pop", 90], ["ui_pop", 135]],
    C: ({f}) => (
      <Scene f={f} bg={BG.scale} seed="s41">
        <Svg>
          <defs>
            <radialGradient id="oil" cx="0.4" cy="0.3" r="0.8">
              <stop offset="0" stopColor="#F1E2B4" />
              <stop offset="0.6" stopColor={C.amber} />
              <stop offset="1" stopColor="#8F6A1C" />
            </radialGradient>
          </defs>
          <W f={f} x={140} y={600} s={3} id="s41" amp={10} />
          <path d="M210 410Q420 345 760 355Q900 370 880 470Q820 560 500 556Q240 560 200 500Q180 440 210 410Z" fill="url(#oil)" opacity={0.85 * lerp(f, 40, 75, 0, 1)} />
          <Lead x1={1020} y1={310} x2={760} y2={430} p={snap(f, 90, 14)} />
        </Svg>
        <Title text="തലയ്ക്കുള്ളിൽ" frame={f} start={8} />
        <Pill text="സ്പെർമസെറ്റി" x={1140} y={290} frame={f} start={90} />
        <Pill text="മെഴുകുപോലുള്ള എണ്ണ" x={1140} y={392} frame={f} start={135} size={36} />
      </Scene>
    ),
  },
  {
    dur: 180,
    link: {kind: "pan", dir: 1},
    cues: [["ui_pop", 8], ["ui_pop", 95]],
    C: ({f}) => {
      const down = lerp(f, 0, 150, 0, 1);
      return (
        <AbsoluteFill style={{background: BG.deep}}>
          {/* Vertical camera move: the lit water slides up and out of reach */}
          <AbsoluteFill style={{transform: `translateY(${-down * 620}px)`, opacity: 1 - down}}>
            <Sea f={f} seed="s42">
              <></>
            </Sea>
          </AbsoluteFill>
          <Dust frame={f} seed="s42d" />
          <Svg>
            <W f={f} x={540} y={600} s={0.84} id="s42" opacity={1 - 0.5 * down} />
          </Svg>
          <Vignette strength={0.85} />
          <Title text="സൂര്യപ്രകാശം എത്താത്ത ആഴം" frame={f} start={8} />
          <ScaleLabel text="കണ്ണുകൊണ്ട് വലിയ കാര്യമില്ല" frame={f} start={95} top={840} size={48} />
        </AbsoluteFill>
      );
    },
  },
  {
    dur: 330,
    link: {kind: "pan", dir: 1},
    cam: [[0, 740, 560, 1.3], [34, 740, 560, 1.3], [90, 1180, 520, 1.3, "ease"], [120, 1180, 520, 1.3], [160, 740, 560, 1.3, "ease"], [196, 740, 560, 1.3], [226, 1274, 470, 1.4, "ease"], [329, 1274, 470, 1.46]], // pan out with the clicks, back with the echoes, then onto the squid
    cues: [["ui_pop", 6], ["sonar_ping", 30], ["ui_pop", 34], ["sonar_ping", 60], ["sonar_ping", 90], ["ui_check", 150], ["ui_pop", 152], ["ui_check", 180], ["ui_check", 210], ["ui_pop", 214]],
    C: ({f}) => {
      const speed = 21.5;
      const arc = (x: number) => `M${x} 320Q${x + 120} 540 ${x} 760`;
      const seen = lerp(f, 90, 130, 0.12, 1);
      const b = snap(f, 214, 12);
      return (
        <Scene f={f} bg={BG.deep} seed="s43">
          <Svg>
            <W f={f} x={120} y={590} s={0.72} id="s43" />
            <g transform="translate(1660 450) rotate(90) scale(0.32)" opacity={seen}>
              <Squid id="s43" frame={f} />
            </g>
            {[30, 60, 90].map((start) => {
              const age = f - start;
              const x = 150 + age * speed;
              if (age < 0 || x > 1470) return null;
              return <path key={start} d={arc(x)} stroke="#C7D6DA" strokeWidth="3" fill="none" opacity="0.65" />;
            })}
            {[90, 120, 150].map((start) => {
              const age = f - start;
              const x = 1470 - age * speed;
              if (age < 0 || x < 150) return null;
              return <path key={start} d={arc(x)} transform={`translate(${2 * x + 120} 0) scale(-1 1)`} stroke={C.green} strokeWidth="3" fill="none" opacity="0.8" />;
            })}
          </Svg>
          <Brackets x={1440 - (1 - b) * 80} y={330 - (1 - b) * 60} w={380 + (1 - b) * 160} h={240 + (1 - b) * 120} opacity={snap(f, 214, 6)} />
          <Title text="ശബ്ദം കൊണ്ട് കാണുന്നു" frame={f} start={6} />
          <Fixed>
            <Pill text="ക്ലിക്ക്" x={700} y={960} frame={f} start={34} />
            <Pill text="പ്രതിധ്വനി" x={1180} y={960} frame={f} start={152} color={C.green} />
          </Fixed>
        </Scene>
      );
    },
  },
  {
    dur: 450,
    link: {kind: "tilt", dir: 1},
    cam: [[0, 960, 720, 1.5], [150, 960, 360, 1.5], [285, 960, 360, 1.54], [320, 960, 540, 1, "ease"], [449, 960, 540, 1.05]], // tilt up the meter as it fills, pull back for the note
    cues: [["scan_typing", 30], ["scan_typing", 52], ["scan_typing", 74], ["scan_typing", 96], ["scan_typing", 118], ["ui_alert", 150], ["ui_pop", 156], ["ui_pop", 300]],
    C: ({f}) => {
      const rays = snap(f, 150);
      return (
        <Scene f={f} bg={BG.scale} seed="s44">
          <Svg>
            <Meter x={867} y={236} lit={Math.floor(lerp(f, 30, 150, 0, 13))} />
            {[-48, -32, -16, 0, 16, 32, 48].map((a) => (
              <line key={a} x1="960" y1="224" x2={960 + Math.sin((a * Math.PI) / 180) * 62 * rays} y2={224 - Math.cos((a * Math.PI) / 180) * 62 * rays} stroke={C.title} strokeWidth="3" opacity={rays} />
            ))}
          </Svg>
          <Title text="ഏറ്റവും ശക്തമായ ശബ്ദം" frame={f} start={4} top={40} />
          <Pill text="236 dB" x={1220} y={290} frame={f} start={156} size={52} />
          <ScaleLabel text="വെള്ളത്തിലെ dB ≠ വായുവിലെ dB" frame={f} start={300} top={896} size={46} />
        </Scene>
      );
    },
  },
  {
    dur: 300,
    link: {kind: "tilt", dir: 1},
    cam: [[0, 760, 600, 1.35], [30, 760, 600, 1.33], [210, 960, 540, 1, "ease"], [299, 960, 540, 1.03]], // pull back as the rings spread
    cues: [["ui_pop", 10], ["sonar_ping", 30], ["sonar_ping", 90], ["sonar_ping", 150]],
    C: ({f}) => {
      const tx = lerp(f, 0, 300, 520, 400);
      return (
        <Sea f={f} seed="s45">
          <Svg>
            <W f={f} x={tx} y={640} s={1} id="s45" />
          </Svg>
          <SonarRings frame={f} starts={[30, 90, 150, 210]} cx={tx + 20} cy={590} r0={40} fadeAt={1300} />
          <Title text="ഇതിലും ശക്തമായ ശബ്ദം അറിയപ്പെടുന്നില്ല" frame={f} start={10} />
          <Fixed>
            <ScaleLabel text="ജന്തുലോകത്ത്" frame={f} start={10} top={200} size={44} />
          </Fixed>
        </Sea>
      );
    },
  },
];

/* ---------- Section 5: ആഴത്തിലെ രണ്ടാം സ്ഥാനക്കാരൻ ---------- */

const depthY = (km: number) => 120 + km * 280;
const DEPTH_BG = "linear-gradient(180deg, #1A3A47 0%, #0E222C 22%, #040F15 55%, #020608 100%)";

const DepthScale = ({f}: {f: number}) => (
  <>
    <Svg>
      <line x1="340" y1={depthY(0)} x2="340" y2={depthY(3.2)} stroke={C.rule} strokeWidth="4" />
      {[0, 1, 2, 3].map((km) => (
        <line key={km} x1="316" y1={depthY(km)} x2="364" y2={depthY(km)} stroke={C.rule} strokeWidth="4" />
      ))}
    </Svg>
    {[0, 1, 2, 3].map((km) => (
      <ScaleLabel key={km} text={`${km} KM`} frame={f} start={-20} left={70} width={230} top={depthY(km) - 30} size={40} />
    ))}
  </>
);

export const s5: Shot[] = [
  {
    dur: 300,
    link: {kind: "blend"},
    cam: [[0, 760, 400, 1.35], [170, 760, 680, 1.35], [299, 800, 640, 1.38]], // vertical follow down the depth scale
    cues: [["sonar_ping", 0], ["ui_pop", 175], ["ui_pop", 215]],
    C: ({f}) => (
      <Scene f={f} bg={DEPTH_BG} seed="s51" vig={0.8}>
        <DepthScale f={f} />
        <Svg>
          <W f={f} x={lerp(f, 0, 170, 1120, 860)} y={lerp(f, 0, 170, 60, depthY(2))} s={0.56} id="s51" r={-62} />
        </Svg>
        <Pill text="2 KM+" x={1320} y={depthY(2)} frame={f} start={175} />
        <Pill text="1 HR+" x={1320} y={depthY(2) + 96} frame={f} start={215} />
      </Scene>
    ),
  },
  {
    dur: 120,
    link: {kind: "blend"},
    cam: [[0, 800, 640, 1.38], [119, 960, 540, 1, "ease"]], // ease back out to the whole scale
    cues: [["ui_pop", 6], ["ui_alert", 62]],
    C: ({f}) => (
      <Scene f={f} bg={DEPTH_BG} seed="s52" vig={0.8}>
        <DepthScale f={f} />
        <Svg>
          <W f={f + 300} x={860} y={depthY(2)} s={0.56} id="s52" r={-62} />
        </Svg>
        <Fixed>
          <div style={{position: "absolute", top: 60, left: 200, width: 1520, textAlign: "center", opacity: snap(f, 6)}}>
            <Strike p={snap(f, 62, 12)} size={64}>
              ആഴത്തിലെ ചാമ്പ്യൻ?
            </Strike>
          </div>
        </Fixed>
      </Scene>
    ),
  },
  {
    dur: 480,
    link: {kind: "push", from: [770, 560], to: [960, 315]},
    cam: [[0, 960, 540, 1], [30, 960, 540, 1], [170, 900, 600, 1.15, "ease"], [238, 900, 600, 1.15], [246, 900, 600, 1.18, "snap"], [479, 900, 600, 1.18]], // tilt down with the beaked whale, bump on the stamp
    cues: [["sonar_ping", 30], ["ui_pop", 110], ["ui_pop", 180], ["thud", 240], ["ui_pop", 300]],
    C: ({f}) => {
      const dive = lerp(f, 30, 170, 0, 1);
      return (
        <Scene f={f} bg={DEPTH_BG} seed="s53" vig={0.8}>
          <DepthScale f={f} />
          <Svg>
            <W f={f} x={620} y={depthY(2) - 60} s={0.46} id="s53" />
            <g transform={`translate(${1100 + (760 - 1100) * dive} ${180 + (depthY(3) - 30 - 180) * dive}) rotate(${-48 * (1 - dive)}) scale(0.5)`}>
              <BeakedWhale id="s53" />
            </g>
          </Svg>
          <Pill text="കൂവിയേഴ്സ് ബീക്ക്ഡ് തിമിംഗലം" x={985} y={depthY(3) - 120} frame={f} start={110} size={34} />
          <Pill text="~3 KM" x={1460} y={depthY(3) - 90} frame={f} start={180} />
          <Stamp text="ചാമ്പ്യൻ" x={1450} y={depthY(2) - 40} p={snap(f, 240, 7)} />
          <Pill text="~3¾ HR" x={1460} y={depthY(3) + 4} frame={f} start={300} />
        </Scene>
      );
    },
  },
];

