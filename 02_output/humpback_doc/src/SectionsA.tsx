import React from "react";
import {AbsoluteFill, Easing, interpolate} from "remotion";
import {BG} from "./atmosphere";
import {camAt, Cam, Fixed, Key} from "./cam";
import {Arrow, Big, Gone, MapDot, MapStage, Readout, ScreenPill, SonarSea, Stage, T} from "./common";
import {FIN_PATH, OUTLINE} from "./Humpback";
import {AShot, Icon, PopG, Row, seq, Svg, W} from "./kit";
import {Diver, ll, MapPill, SplitSea} from "./Objects";
import {Auto, Bus, CastNet, Kayak, Krill, Meter, RecFrame, School, Splash, TopWhale, Tusker} from "./Props";
import {LOCK} from "./Section1";
import {C, FONT, lerp, P, snap, spline} from "./theme";
import {Brackets, RedBox, RedCaption, Rule, ScaleLabel, Strike} from "./ui";
import {at, SEC} from "./voice";

// Sections 2 (second half) to 5. Frames are film frames; narration times come from voice.ts.

const ease = Easing.inOut(Easing.cubic);
const go = (F: number, a: number, b: number, from: number, to: number, e: (t: number) => number = ease) =>
  interpolate(F, [a, b], [from, to], {easing: e, extrapolateLeft: "clamp", extrapolateRight: "clamp"});
const screenOf = (keys: Key[], F: number, x: number, y: number): P => {
  const v = camAt(keys, F);
  return [x * v.z + v.tx, y * v.z + v.ty];
};
const MOUTH = spline([[46, 30], [90, 6], [160, -2], [240, 10], [300, 40], [306, 84], [250, 104], [170, 98], [100, 78], [60, 54]], true);

// ================= Section 2, second half: inside the mouth, spat out, Jonah, the record =================
const G0 = 1930;
const kGrip: Key[] = [[G0, 960, 540, 1.2], [at(2, 13), 960, 540, 1.5]];
const timer = (F: number) => `TRACKING: 00:${String(Math.floor(go(F, G0 - 460, 2398, 0, 38, (t) => t))).padStart(2, "0")}`;

const Walls = ({F}: {F: number}) => {
  const edge = (top: boolean) => {
    const pts: P[] = [];
    for (let x = -40; x <= 1960; x += 80) {
      const y = 250 + 40 * Math.sin(F * 0.08) + 22 * Math.sin(x * 0.008 + F * 0.05);
      pts.push([x, top ? y : 1080 - y]);
    }
    return spline(pts, false);
  };
  return (
    <g>
      {[true, false].map((top) => (
        <g key={String(top)}>
          <path d={`${edge(top)}L1960 ${top ? -40 : 1120}L-40 ${top ? -40 : 1120}Z`} fill={C.redFill} />
          <path d={edge(top)} stroke={C.maroon} strokeWidth="4" fill="none" />
          <path d={edge(top)} stroke={C.maroon} strokeWidth="60" strokeDasharray="3 26" fill="none" opacity="0.5" transform={`translate(0 ${top ? -40 : 40})`} />
        </g>
      ))}
    </g>
  );
};

const GripShot = ({F}: {F: number}) => {
  const fight = snap(F, at(2, 12), 12);
  const kickF = F < at(2, 12) ? F : at(2, 12) + (F - at(2, 12)) * 3;
  return (
    <AbsoluteFill>
      <Cam keys={kGrip} f={F} style={{background: LOCK}}>
        <Svg>
          <Walls F={F} />
          <Diver f={kickF} x={960} y={540} s={1.0} r={Math.sin(F * 0.035) * 9 * (1 - fight) + Math.sin(F * 0.35) * 24 * fight} />
        </Svg>
        <T F={F} text={'"തീർന്നു, ഞാൻ മരിച്ചു"'} start={G0 + 10} end={at(2, 11) - 8} />
        <T F={F} text="ഓർമ്മ വന്നത് സ്വന്തം മക്കളെ" start={at(2, 11) + 4} end={at(2, 12) - 6} />
        <T F={F} text="സർവ്വശക്തിയും എടുത്ത് പിടഞ്ഞു" start={at(2, 12) + 6} end={at(2, 13) - 14} />
        <Readout F={F} text={timer(F)} start={G0 + 4} />
      </Cam>
    </AbsoluteFill>
  );
};

// Spat out at the surface.
const SP = {rise: at(2, 13), up: at(2, 13, 0.8), spit: at(2, 13, 0.9), sink: at(2, 14) - 10, bruise: at(2, 14) + 3, bones: at(2, 15) + 2, end: at(2, 16)};
const SURF = 440;
const kSpit: Key[] = [[SP.rise, 960, 760, 1.25], [SP.up, 960, 560, 1.2, "ease"], [SP.spit + 30, 900, 470, 1.45, "ease"], [SP.end + 10, 870, 455, 1.6]];
const SpitShot = ({F}: {F: number}) => {
  const headY = F < SP.sink ? go(F, SP.rise, SP.up, 1400, 470, Easing.out(Easing.cubic)) : go(F, SP.sink, SP.sink + 120, 470, 1350, Easing.in(Easing.cubic));
  const gape = 0.7 * snap(F, SP.spit - 4, 10) * (1 - snap(F, SP.spit + 36, 14));
  const out = snap(F, SP.spit, 34);
  const dx = 1080 - 300 * out;
  const dy = 520 - 80 * out + Math.sin(F * 0.06) * 3 * out;
  return (
    <SplitSea f={F} seed="spit" keys={kSpit} surface={SURF}>
      <Svg>
        <W f={F} x={1000} y={headY} s={0.9} r={-82} id="spit" flip gape={gape} amp={20} />
        <Splash x={1010} y={SURF} p={(F - (SP.up - 14)) / 40} seed="sp1" w={0.9} />
        {F >= SP.spit && <Diver f={F} x={dx} y={dy} s={0.5} r={90 - 90 * out} />}
        <Splash x={dx} y={SURF} p={(F - SP.spit - 20) / 30} seed="sp2" w={0.5} />
      </Svg>
      <T F={F} text="30–40 സെക്കൻഡ് കഴിഞ്ഞ്" start={SP.rise + 6} end={SP.spit - 10} />
      <T F={F} text="പുറത്തേക്ക് തുപ്പി" start={SP.spit} end={SP.bruise - 8} />
      <ScreenPill F={F} text="ദേഹം നിറയെ ചതവ്" x={960} y={220} start={SP.bruise} end={SP.end - 12} />
      <ScreenPill F={F} text="ഒരു എല്ലുപോലും ഒടിഞ്ഞില്ല" x={960} y={320} start={SP.bones} end={SP.end - 12} color={C.green} />
      <Readout F={F} text={timer(F)} start={SP.rise} end={SP.bruise} />
    </SplitSea>
  );
};

// Jonah, then "this really happened".
const J = {start: at(2, 16), real: at(2, 17) + 2, end: at(2, 18)};
const kJonah: Key[] = [[J.start, 960, 540, 1.0], [J.end + 10, 960, 540, 1.1]];
const JonahShot = ({F}: {F: number}) => (
  <Stage F={F} keys={kJonah} seed="jonah">
    <Svg>
      <g opacity={0.9}>
        <Icon x={682} y={440} s={0.55} color="#2C3033" />
      </g>
    </Svg>
    <T F={F} text="ബൈബിളിലെ യോനായുടെ കഥ" start={J.start + 4} end={J.end - 12} />
    <RedBox text="ഇത് നടന്ന സംഭവം · 2021" x={510} y={650} w={900} frame={F} start={J.real} />
  </Stage>
);

// No record of hunting people, and still a long list.
const R = {start: at(2, 18), zero: at(2, 18) + 20, none: at(2, 18, 0.6), list: at(2, 19), why: at(2, 20), end: at(2, 21)};
const INCIDENTS = ["2021 · കേപ് കോഡ്", "2025 · മഗല്ലൻ കടലിടുക്ക്", "2024 · ന്യൂ ഹാംഷെയർ", "2023 · സിഡ്നി", "2020 · നിംഗലൂ", "2017 · കുക്ക് ദ്വീപുകൾ"];
const kRecord: Key[] = [[R.start, 960, 540, 1.0], [R.end + 10, 960, 540, 1.08]];
const RecordShot = ({F}: {F: number}) => (
  <Stage F={F} keys={kRecord} seed="record">
    <T F={F} text="ഹംപ്ബാക്ക് മനുഷ്യരെ വേട്ടയാടിയതിന്" start={R.start + 4} end={R.list - 8} />
    <Big F={F} text="0" start={R.zero} end={R.list - 8} top={300} size={220} />
    <Big F={F} text="ഒരു രേഖയുമില്ല" start={R.none} end={R.list - 8} top={620} size={60} color={C.title} />
    <T F={F} text="എന്നിട്ടും പട്ടിക ചെറുതല്ല" start={R.list + 4} end={R.why - 8} />
    {F >= R.list && (
      <Fixed>
        <AbsoluteFill style={{opacity: (1 - 0.65 * snap(F, R.why, 10)) * (1 - snap(F, R.end - 10, 8))}}>
          {INCIDENTS.map((t, i) => (
            <Row key={t} text={t} y={232 + i * 118} f={F} start={R.list + 10 + i * 8} size={50} x={560} />
          ))}
        </AbsoluteFill>
      </Fixed>
    )}
    <T F={F} text="കാരണം കേൾക്കുമ്പോഴാണ് പേടി" start={R.why + 4} end={R.end - 10} />
  </Stage>
);

// It does not even know you are there.
const U = {start: at(2, 21) - 6, end: SEC[3]};
const kUnaware: Key[] = [[U.start, 960, 560, 1.1], [U.end + 10, 960, 540, 1.0]];
const UnawareShot = ({F}: {F: number}) => (
  <SonarSea F={F} keys={kUnaware} seed="unaware">
    <Svg>
      <Diver f={F} x={1260} y={430} s={0.34} />
      <W f={F} x={720 + (F - U.start) * 4.2} y={650} s={0.95} id="unaware" flip />
    </Svg>
    <T F={F} text="നിങ്ങൾ അവിടെയുണ്ടെന്ന് ഇത് അറിയുന്നുപോലുമില്ല" start={U.start + 10} end={U.end - 10} size={56} />
  </SonarSea>
);

export const s2b: AShot[] = [
  {
    from: G0,
    C: GripShot,
    link: {kind: "tilt", dir: -1},
    cues: [["ui_pop", G0 + 10], ["thud", at(2, 11), 0.4], ["ui_pop", at(2, 11) + 4], ["ui_pop", at(2, 12) + 6], ["thud", at(2, 12) + 10, 0.5], ["thud", at(2, 12) + 40, 0.55], ["thud", at(2, 12) + 70, 0.6]],
  },
  {
    from: SP.rise,
    C: SpitShot,
    link: {kind: "push", from: [960, 540], to: [960, 540]},
    cues: [["scan_typing", SP.rise + 6, 0.3], ["ui_pop", SP.rise + 6], ["thud", SP.up - 14, 0.7], ["thud", SP.spit, 0.9], ["ui_pop", SP.spit], ["ui_pop", SP.bruise], ["ui_check", SP.bones]],
  },
  {from: J.start, C: JonahShot, link: {kind: "blend"}, cues: [["ui_pop", J.start + 4], ["ui_alert", J.real, 0.5], ["ui_pop", J.real]]},
  {
    from: R.start,
    C: RecordShot,
    link: {kind: "pan", dir: 1},
    cues: [["ui_pop", R.start + 4], ["thud", R.zero, 0.8], ["ui_pop", R.none], ["ui_pop", R.list + 4], ["scan_typing", R.list + 10, 0.4], ["ui_pop", R.why + 4]],
  },
  {from: U.start, C: UnawareShot, link: {kind: "blend"}, cues: [["ui_pop", U.start + 10]]},
];

// ================= Section 3: longer than a bus, heavier than a herd =================
const S3 = {start: SEC[3], rule: at(3, 0, 0.55), bus: at(3, 1), busOut: at(3, 2) - 8, tonnes: at(3, 2) + 4, tuskers: at(3, 3) + 4, fin: at(3, 4), autos: at(3, 5), none: at(3, 6), food: at(3, 7), how: at(3, 8), end: SEC[4]};
const kScale: Key[] = [[S3.start, 960, 540, 1.06], [S3.fin, 960, 560, 1.0]];
const ScaleShot = ({F}: {F: number}) => {
  const busX = F < S3.busOut ? go(F, S3.bus, S3.bus + 20, 2000, 455, Easing.out(Easing.cubic)) : go(F, S3.busOut, S3.busOut + 20, 455, -1100, Easing.in(Easing.cubic));
  return (
    <Stage F={F} keys={kScale} bg={BG.scale} seed="scale">
      <Svg>
        <W f={F} x={455} y={360} s={1.0} id="scale" />
        {F >= S3.bus && F < S3.busOut + 22 && <Bus x={busX} y={690} w={808} />}
        {Array.from({length: 7}).map((_, i) => (
          <PopG key={i} x={960 + (i - 3) * 238} y={940} p={snap(F, S3.tuskers + i * 6)}>
            <Tusker x={960 + (i - 3) * 238} y={1010} s={0.9} ghost={i === 6} />
          </PopG>
        ))}
      </Svg>
      <Rule frame={F} start={S3.rule} y={598} half={505} />
      <ScaleLabel text="~15 M" frame={F} start={S3.rule + 10} top={620} />
      <T F={F} text="ഒരു മുതിർന്ന ഹംപ്ബാക്ക്" start={S3.start + 18} end={S3.bus - 8} />
      <T F={F} text="ബസിനേക്കാൾ നീളം" start={S3.bus + 4} end={S3.busOut} />
      <Gone F={F} at={S3.tuskers - 2} d={2}>
        <RedCaption text="30+ TONNES" frame={F} start={S3.tonnes} top={736} />
      </Gone>
      {F >= S3.tuskers - 2 && <RedCaption text="30+ TONNES = 6–7 കൊമ്പനാനകൾ" frame={F} start={S3.tuskers - 2} top={736} />}
    </Stage>
  );
};

const kFin: Key[] = [[S3.fin, 960, 540, 1.12], [S3.food, 960, 560, 1.0]];
const FinShot = ({F}: {F: number}) => (
  <Stage F={F} keys={kFin} bg={BG.scale} seed="fin">
    <Svg>
      <defs>
        <linearGradient id="finClose" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#8E9393" />
          <stop offset="0.5" stopColor="#6F7374" />
          <stop offset="1" stopColor="#3F4042" />
        </linearGradient>
      </defs>
      <PopG x={960} y={380} p={snap(F, S3.fin + 4, 12)}>
        <g transform="translate(610 380) rotate(-42.5) scale(1.95)">
          <path d={FIN_PATH} fill="url(#finClose)" />
        </g>
      </PopG>
      {[0, 1].map((k) => (
        <PopG key={k} x={785 + k * 350} y={900} p={snap(F, S3.autos + k * 6)}>
          <Auto x={610 + k * 350} y={960} s={1.346} />
        </PopG>
      ))}
    </Svg>
    <Rule frame={F} start={S3.fin + 26} y={560} half={350} />
    <ScaleLabel text="~5 M" frame={F} start={S3.fin + 36} top={582} />
    <T F={F} text="മുൻചിറക്" start={S3.fin + 6} end={S3.autos - 8} />
    <T F={F} text="രണ്ട് ഓട്ടോറിക്ഷകളുടെ നീളം" start={S3.autos + 4} end={S3.none - 8} />
    <T F={F} text="ഒരു തിമിംഗലത്തിനും ഇത്ര നീളമുള്ള ചിറകില്ല" start={S3.none + 4} end={S3.food - 8} size={56} />
  </Stage>
);

const kFood: Key[] = [[S3.food, 960, 540, 1.0], [S3.end + 10, 960, 520, 1.3]];
const FoodShot = ({F}: {F: number}) => {
  const g = snap(F, S3.food + 4, 40);
  return (
    <Stage F={F} keys={kFood} bg={BG.scale} seed="food">
      <Svg>
        <Krill f={F} cx={960} cy={470} n={280} rx={80 + 260 * g} ry={(80 + 260 * g) * 0.55} seed="food" />
      </Svg>
      <T F={F} text="ദിവസം ഏകദേശം ഒരു ടൺ ഭക്ഷണം" start={S3.food + 4} end={S3.how - 8} />
      <Big F={F} text="~1 TONNE / ദിവസം" start={S3.food + 18} end={S3.how - 8} top={700} size={64} />
      <T F={F} text="പല്ലില്ലാതെ, എങ്ങനെ?" start={S3.how + 4} end={S3.end - 4} />
    </Stage>
  );
};

export const s3: AShot[] = [
  {
    from: S3.start,
    C: ScaleShot,
    link: {kind: "pan", dir: 1},
    cues: [
      ["ui_pop", S3.start + 18], ["thud", S3.rule, 0.9], ["ui_pop", S3.rule + 10], ["thud", S3.bus, 0.9], ["ui_pop", S3.bus + 4], ["ui_alert", S3.tonnes, 0.5],
      ["thud", S3.tuskers, 0.7], ...Array.from({length: 7}, (_, i) => ["ui_pop", S3.tuskers + i * 6, 0.35] as [string, number, number]),
    ],
  },
  {from: S3.fin, C: FinShot, link: {kind: "pan", dir: 1}, cues: [["ui_pop", S3.fin + 6], ["thud", S3.fin + 26, 0.9], ["ui_pop", S3.fin + 36], ["thud", S3.autos, 0.8], ["thud", S3.autos + 6, 0.6], ["ui_pop", S3.autos + 4], ["ui_pop", S3.none + 4]]},
  {from: S3.food, C: FoodShot, link: {kind: "push", from: [960, 475], to: [1450, 560]}, cues: [["ui_pop", S3.food + 4], ["thud", S3.food + 18, 0.8], ["ui_pop", S3.how + 4]]},
];

// ================= Section 4: a net made of bubbles =================
const S4 = {
  start: SEC[4], simple: at(4, 0), lunge: at(4, 1), aim: at(4, 2), folds: at(4, 3), swell: at(4, 4), litres: at(4, 5), shut: at(4, 6), net: at(4, 7), stays: at(4, 8),
  smart: at(4, 9), alaska: at(4, 10), tag: at(4, 11), knobs: at(4, 12), result: at(4, 13), seven: at(4, 14), claim: at(4, 15), tool: at(4, 16), end: SEC[5],
};
const kLunge: Key[] = [
  [S4.start, 960, 540, 1.0], [S4.lunge, 1000, 560, 1.0], [S4.aim + 60, 1120, 560, 1.08, "ease"], [S4.folds + 2, 1140, 618, 2.1, "snap"], [S4.swell - 6, 1140, 620, 2.2],
  [S4.swell + 30, 1150, 590, 1.35, "ease"], [S4.shut - 10, 1150, 590, 1.4], [S4.shut + 30, 1110, 575, 1.7, "ease"], [S4.smart + 10, 1090, 570, 1.55],
];
const LungeShot = ({F}: {F: number}) => {
  const z = camAt(kLunge, F).z;
  const snout = F < S4.lunge ? go(F, S4.start, S4.lunge, 150, 760, (t) => t) : go(F, S4.lunge, S4.aim + 60, 760, 1310, Easing.out(Easing.cubic)) + Math.max(0, F - S4.aim - 60) * 0.05;
  const gape = snap(F, S4.lunge + 6, 40) * (1 - 0.82 * snap(F, S4.shut, 24));
  const swell = snap(F, S4.swell + 6, 60) * (1 - 0.8 * snap(F, S4.shut + 20, 150));
  const pull = lerp(F, S4.litres + 4, S4.litres + 90, 0, 1);
  const water = F >= S4.shut + 20 && F < S4.smart;
  return (
    <SonarSea F={F} keys={kLunge} seed="lunge">
      <Svg>
        <School f={F} cx={1480} cy={560} n={70} rx={170} ry={90} seed="lunge" pull={pull} to={[1180, 600]} dir={-1} />
        <W f={F} x={snout} y={560} s={0.95} id="lunge" flip gape={gape} swell={swell} amp={22} />
        {water &&
          Array.from({length: 15}).map((_, i) => {
            const y = 600 + ((F * 3 + i * 13) % 90);
            return <line key={i} x1={1066 + i * 15} y1={y} x2={1070 + i * 15} y2={y + 16} stroke="#C7D6DA" strokeWidth="2.4" opacity={0.55 * (1 - (y - 600) / 90)} />;
          })}
      </Svg>
      <MapPill text="മീൻകൂട്ടം · ക്രിൽ" at={[1480, 450]} z={z} f={F} start={S4.aim + 8} dy={-50} out={S4.folds - 6} />
      <MapPill text="അക്കോർഡിയൻ പോലെ മടക്കുകൾ" at={[1140, 680]} z={z} f={F} start={S4.folds + 10} dy={110} out={S4.swell - 6} />
      <MapPill text="ബലീൻ" at={[1180, 575]} z={z} f={F} start={S4.shut + 24} dy={-90} out={S4.net - 6} />
      <T F={F} text="ഉത്തരം ലളിതമാണ്" start={S4.simple + 4} end={S4.lunge - 6} />
      <T F={F} text="വായ മലർക്കെ തുറന്ന് ഒറ്റ കുതിപ്പ്" start={S4.lunge + 4} end={S4.aim + 60} />
      <T F={F} text="ബലൂൺ പോലെ വീർക്കും" start={S4.swell + 4} end={S4.litres - 6} />
      <T F={F} text="ആയിരക്കണക്കിന് ലിറ്റർ വെള്ളം" start={S4.litres + 4} end={S4.shut - 8} />
      <T F={F} text="ബലീൻ എന്ന അരിപ്പ" start={S4.shut + 6} end={S4.net - 6} />
      {F >= S4.net && F < S4.smart + 8 && (
        <Fixed>
          <svg width="1920" height="1080" style={{position: "absolute", opacity: snap(F, S4.net) * (1 - snap(F, S4.smart - 6, 8))}}>
            <CastNet x={1580} y={290} s={0.9} />
          </svg>
        </Fixed>
      )}
      <ScreenPill F={F} text="വീശുവല പോലെ" x={1580} y={240} start={S4.net + 2} end={S4.smart - 6} />
      <ScreenPill F={F} text="വെള്ളം പോകും" x={700} y={900} start={S4.stays + 2} end={S4.smart - 6} />
      <ScreenPill F={F} text="മീൻ നിൽക്കും" x={1220} y={900} start={S4.stays + 20} end={S4.smart - 6} color={C.green} />
    </SonarSea>
  );
};

// Top view: one whale blows a spiral of bubbles around the krill, then lunges up through the middle.
const NC: P = [960, 560];
const SPIN = {a: S4.smart + 10, b: S4.knobs - 40};
const spot = (t: number): {x: number; y: number; r: number} => {
  const th = -Math.PI / 2 + t * 2.3 * Math.PI;
  const R = 380 - 220 * t;
  return {x: NC[0] + R * Math.cos(th), y: NC[1] + R * Math.sin(th), r: ((th + Math.PI / 2) * 180) / Math.PI};
};
const kNet: Key[] = [[S4.smart, 960, 540, 1.15], [SPIN.b, 960, 540, 1.0, "ease"], [S4.knobs + 6, 780, 560, 1.0, "ease"], [S4.result + 10, 780, 560, 1.05]];
const NetShot = ({F}: {F: number}) => {
  const t = Math.max(0, Math.min(1, (F - SPIN.a) / (SPIN.b - SPIN.a)));
  const w = spot(t);
  const up = snap(F, SPIN.b, 30);
  const wx = w.x + (NC[0] - w.x) * up;
  const wy = w.y + (NC[1] - w.y) * up;
  const bubbles: React.ReactNode[] = [];
  for (let tau = SPIN.a; tau <= Math.min(F - 6, SPIN.b); tau += 5) {
    const p = spot((tau - SPIN.a) / (SPIN.b - SPIN.a));
    const age = F - tau;
    bubbles.push(<circle key={tau} cx={p.x + Math.sin(tau) * 8} cy={p.y + Math.cos(tau * 1.3) * 8} r={3 + Math.min(age, 40) * 0.2} fill="none" stroke="#E8ECEC" strokeWidth="2.2" opacity={0.7} />);
  }
  return (
    <Stage F={F} keys={kNet} bg="radial-gradient(ellipse 70% 70% at 50% 50%, #0E2A36 0%, #0B1F28 50%, #040F15 100%)" seed="net">
      <Svg>
        <Krill f={F} cx={NC[0]} cy={NC[1]} n={160} rx={130} ry={110} seed="net" o={1 - snap(F, SPIN.b + 10, 20)} />
        {bubbles}
        <g opacity={1 - snap(F, SPIN.b + 40, 20)}>
          <TopWhale f={F} x={wx} y={wy} s={0.55 + 0.35 * up} r={w.r} tag={F >= S4.tag} />
        </g>
      </Svg>
      <T F={F} text="ഇത് വെറും കരുത്തല്ല, ബുദ്ധിയുമാണ്" start={S4.smart + 4} end={S4.alaska - 8} />
      <ScreenPill F={F} text="അലാസ്ക" x={230} y={230} start={S4.alaska + 6} end={S4.end} />
      <T F={F} text="കുമിളകൾ കൊണ്ടൊരു വല" start={S4.alaska + 10} end={S4.tag - 8} />
      <T F={F} text="2024 പഠനം: ദേഹത്ത് ടാഗ്" start={S4.tag + 4} end={S4.knobs - 8} />
      <T F={F} text="ഇവ നിയന്ത്രിക്കുന്നു" start={S4.knobs + 4} end={S4.result - 4} />
      {F >= S4.knobs && (
        <Fixed>
          <AbsoluteFill style={{opacity: 1 - snap(F, S4.result - 4, 8)}}>
            {["വലിപ്പം", "ആഴം", "വളയങ്ങളുടെ എണ്ണം", "കുമിളകൾ തമ്മിലുള്ള അകലം"].map((t, i) => (
              <Row key={t} text={t} y={300 + i * 130} f={F} start={S4.knobs + 8 + i * 42} x={120} size={48} />
            ))}
          </AbsoluteFill>
        </Fixed>
      )}
    </Stage>
  );
};

const kMeter: Key[] = [[S4.result, 960, 540, 1.06], [S4.end + 10, 960, 540, 1.0]];
const MeterShot = ({F}: {F: number}) => {
  const lit = Math.min(7, Math.floor(lerp(F, S4.seven + 10, S4.seven + 50, 0, 7.99)));
  return (
    <Stage F={F} keys={kMeter} bg={BG.scale} seed="meter">
      <Svg>
        <PopG x={693} y={560} p={snap(F, S4.seven)}>
          <Meter x={600} y={230} lit={F >= S4.seven + 6 ? 1 : 0} />
        </PopG>
        <PopG x={1227} y={560} p={snap(F, S4.seven + 4)}>
          <Meter x={1134} y={230} lit={lit} />
        </PopG>
      </Svg>
      {[
        ["സാധാരണ", 693],
        ["കുമിളവല", 1227],
      ].map(([t, x], i) => (
        <div key={String(t)} style={{position: "absolute", left: Number(x) - 200, width: 400, top: 880, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: C.dim, opacity: snap(F, S4.seven + 6 + i * 4)}}>
          {t}
        </div>
      ))}
      <ScreenPill F={F} text="×7" x={1460} y={330} start={S4.seven + 52} size={56} />
      <T F={F} text="ഫലമോ?" start={S4.result + 2} end={S4.seven - 4} />
      <T F={F} text="ഒരു കുതിപ്പിലെ ഭക്ഷണം: ശരാശരി ഏഴിരട്ടി" start={S4.seven + 2} end={S4.claim - 8} size={56} />
      <T F={F} text="ഗവേഷകരുടെ വാദം" start={S4.claim + 2} end={S4.tool - 4} />
      <T F={F} text="ഈ തിമിംഗലങ്ങൾ ഉപകരണം നിർമ്മിക്കുന്നു" start={S4.tool + 2} end={S4.end - 2} size={60} />
    </Stage>
  );
};

export const s4: AShot[] = [
  {
    from: S4.start,
    C: LungeShot,
    link: {kind: "tilt", dir: -1},
    cues: [
      ["ui_pop", S4.simple + 4], ["ui_pop", S4.lunge + 4], ["thud", S4.lunge + 6, 0.8], ["ui_pop", S4.aim + 8], ["thud", S4.folds + 2, 0.6], ["ui_pop", S4.folds + 10],
      ["ui_pop", S4.swell + 4], ["thud", S4.swell + 6, 0.5], ["scan_typing", S4.litres + 4, 0.3], ["ui_pop", S4.litres + 4], ["thud", S4.shut, 0.7], ["ui_pop", S4.shut + 6],
      ["ui_pop", S4.shut + 24], ["ui_pop", S4.net + 2], ["ui_check", S4.stays + 2], ["ui_check", S4.stays + 20],
    ],
  },
  {
    from: S4.smart,
    C: NetShot,
    link: {kind: "pan", dir: 1},
    cues: [
      ["ui_pop", S4.smart + 4], ["ui_pop", S4.alaska + 6], ["scan_typing", S4.alaska + 20, 0.25], ["ui_pop", S4.tag + 4], ["sonar_ping", S4.tag + 4, 0.4], ["thud", SPIN.b, 0.8],
      ["ui_pop", S4.knobs + 4], ...[0, 1, 2, 3].map((i) => ["ui_pop", S4.knobs + 8 + i * 42, 0.5] as [string, number, number]),
    ],
  },
  {
    from: S4.result,
    C: MeterShot,
    link: {kind: "push", from: [960, 540], to: [960, 600]},
    cues: [["ui_pop", S4.result + 2], ["ui_pop", S4.seven + 2], ["scan_typing", S4.seven + 10, 0.4], ["ui_check", S4.seven + 52], ["ui_pop", S4.claim + 2], ["thud", S4.tool + 2, 0.8]],
  },
];

// ================= Section 5: you are not the prey =================
const S5 = {
  start: SEC[5], imagine: at(5, 0), rise: at(5, 1), eyes: at(5, 2), prey: at(5, 3), thing: at(5, 4), feb: at(5, 5), strait: at(5, 6), adrian: at(5, 7), dad: at(5, 8), split: at(5, 9),
  gulp: at(5, 10), gone: at(5, 11), out: at(5, 12), up: at(5, 13), good: at(5, 14), cant: at(5, 15), throat: at(5, 16), human: at(5, 17), bad: at(5, 18), decide: at(5, 19), lucky: at(5, 20), end: SEC[6],
};
const IM_SURF = 300;
const imHead = (F: number) => (F < S5.eyes ? go(F, S5.rise, S5.eyes, 1500, 560, Easing.out(Easing.cubic)) : F < S5.thing + 20 ? go(F, S5.eyes, S5.thing + 20, 560, 530, (t) => t) : go(F, S5.thing + 20, S5.feb, 530, 380, Easing.in(Easing.quad)));
const EYE: P = [1000 + 24 * 0.8, 560 + 288 * 0.8];
const kImagine: Key[] = [[S5.start, 960, 620, 1.15], [S5.eyes - 4, 960, 600, 1.1], [S5.eyes + 10, EYE[0], EYE[1] - 40, 2.2, "snap"], [S5.prey - 4, EYE[0], EYE[1] - 40, 2.3], [S5.thing, 960, 540, 1.1, "ease"], [S5.feb + 10, 960, 420, 1.4, "ease"]];
const ImagineShot = ({F}: {F: number}) => {
  const hy = imHead(F);
  const z = camAt(kImagine, F).z;
  const [bx, by] = screenOf(kImagine, F, 960, IM_SURF + 14);
  const eye: P = [1000 + 24 * 0.8, hy + 288 * 0.8];
  const look = snap(F, S5.eyes + 6, 14) * (1 - snap(F, S5.prey, 10));
  return (
    <SplitSea f={F} seed="imagine" keys={kImagine} surface={IM_SURF}>
      <Svg>
        <Krill f={F} cx={960} cy={IM_SURF + 90} n={220} rx={430} ry={80} seed="imagine" />
        <Diver f={F} x={960} y={IM_SURF + 14} s={0.55} />
        <W f={F} x={1000} y={hy} s={0.8} r={-90} id="imagine" flip gape={0.6 * snap(F, S5.rise + 20, 30)} amp={18} />
        {look > 0 && (
          <g opacity={look}>
            {[-1, 1].map((d) => (
              <path key={d} d={`M${eye[0]} ${eye[1]}L${eye[0] + d * 520} ${eye[1] - 200}L${eye[0] + d * 520} ${eye[1] + 200}Z`} fill="#C7D6DA" opacity="0.12" />
            ))}
          </g>
        )}
      </Svg>
      <MapPill text="കണ്ണ്" at={eye} z={z} f={F} start={S5.eyes + 10} dx={130} out={S5.prey - 4} />
      {F >= S5.thing && (
        <Fixed>
          <Brackets x={bx - 130} y={by - 80} w={260} h={160} opacity={snap(F, S5.thing, 6) * (1 - snap(F, S5.feb - 8, 6))} />
        </Fixed>
      )}
      <T F={F} text="ഇനി ഇതൊന്ന് സങ്കൽപ്പിക്കൂ" start={S5.imagine + 2} end={S5.rise - 4} />
      <T F={F} text="മുപ്പത് ടൺ, താഴെ നിന്ന്" start={S5.rise + 4} end={S5.eyes - 6} />
      <T F={F} text="കണ്ണുകൾ തലയുടെ വശങ്ങളിൽ, ഏറെ പിന്നിൽ" start={S5.eyes + 4} end={S5.prey - 6} size={56} />
      <T F={F} text="നിങ്ങൾ ഇരയല്ല" start={S5.prey + 2} end={S5.thing - 4} />
      <T F={F} text="വഴിയിൽ പെട്ടുപോയ ഒരു സാധനം മാത്രം" start={S5.thing + 2} end={S5.feb - 6} size={56} />
    </SplitSea>
  );
};

const SPOT5 = ll("magellan", -70.95, -53.65);
const DAD: P = [SPOT5[0] + 44, SPOT5[1] - 24];
const kMag: Key[] = [[S5.feb, 960, 540, 1.0], [S5.adrian - 20, SPOT5[0], SPOT5[1], 2.2, "ease"], [S5.split + 10, SPOT5[0] + 10, SPOT5[1], 2.8]];
const MagellanShot = ({F}: {F: number}) => {
  const z = camAt(kMag, F).z;
  return (
    <MapStage F={F} keys={kMag} map="magellan" seed="mag">
      <MapDot F={F} at={SPOT5} keys={kMag} start={S5.strait + 30} pings={[S5.strait + 30, S5.adrian]} />
      <MapDot F={F} at={DAD} keys={kMag} start={S5.dad} pings={[S5.dad]} color={C.title} />
      <MapPill text="മഗല്ലൻ കടലിടുക്ക്" at={ll("magellan", -71.6, -53.2)} z={z} f={F} start={S5.strait} dy={-70} out={S5.adrian - 10} />
      <MapPill text="അഡ്രിയാൻ · 24" at={SPOT5} z={z} f={F} start={S5.adrian + 4} dy={90} color={C.green} out={S5.split - 12} />
      <MapPill text="അച്ഛൻ: വീഡിയോ" at={DAD} z={z} f={F} start={S5.dad + 4} dy={-80} out={S5.split - 12} />
      <T F={F} text="2025 ഫെബ്രുവരി · ചിലി" start={S5.feb + 4} end={S5.adrian - 8} />
      <T F={F} text="അച്ഛനോടൊപ്പം കയാക്കിങ്" start={S5.adrian + 4} end={S5.split - 12} />
    </MapStage>
  );
};

const K_SURF = 430;
const kKayak: Key[] = [[S5.split, 960, 470, 1.2], [S5.gulp + 20, 960, 470, 1.32], [S5.gulp + 100, 960, 520, 1.15, "ease"], [S5.up, 960, 500, 1.2], [S5.good + 10, 960, 480, 1.3]];
const KayakShot = ({F}: {F: number}) => {
  const top = S5.gulp + 30;
  const shut = S5.gulp + 80;
  const head = F < shut + 20 ? go(F, S5.split + 6, top, 1000, 330, Easing.out(Easing.cubic)) : F < S5.out + 40 ? go(F, shut + 20, shut + 110, 330, 1100, Easing.in(Easing.cubic)) : go(F, S5.out + 40, S5.out + 60, 1100, 520, Easing.out(Easing.cubic)) + go(F, S5.out + 64, S5.out + 120, 0, 700, Easing.in(Easing.cubic));
  const gape = 0.85 * snap(F, S5.split + 20, 30) * (1 - snap(F, shut - 8, 10)) + 0.4 * snap(F, S5.out + 50, 6) * (1 - snap(F, S5.out + 66, 10));
  const kx = go(F, top, shut, 990, 940);
  const popped = snap(F, S5.up + 2, 20);
  return (
    <SplitSea f={F} seed="kayak" keys={kKayak} surface={K_SURF}>
      <Svg>
        {F < shut - 2 && <Kayak f={F} x={kx} y={K_SURF} s={0.75} />}
        <W f={F} x={880} y={head} s={0.85} r={-78} id="kayak" flip gape={gape} amp={18} />
        <Splash x={880} y={K_SURF} p={(F - S5.split) / 40} seed="k1" w={1.1} />
        <Splash x={900} y={K_SURF} p={(F - shut - 30) / 50} seed="k2" w={0.9} />
        <Splash x={880} y={K_SURF} p={(F - S5.out - 50) / 40} seed="k3" w={0.8} />
        {F >= S5.up && (
          <g>
            <Kayak f={0} x={1200} y={K_SURF + 4} s={0.75} r={180} />
            <Diver f={F} x={1060} y={K_SURF + 70 - 60 * popped} s={0.5} r={90} />
          </g>
        )}
      </Svg>
      <Fixed>
        <RecFrame f={F} start={S5.split} o={snap(F, S5.split, 6) * (1 - snap(F, S5.good - 6, 6))} />
      </Fixed>
      <T F={F} text="പെട്ടെന്ന് പിന്നിലെ വെള്ളം പിളർന്നു" start={S5.split + 4} end={S5.gulp - 4} size={56} />
      <T F={F} text="കയാക്കോടെ വായിലാക്കി" start={S5.gulp + 20} end={S5.gone - 8} />
      <T F={F} text="വീഡിയോയിൽ അയാൾ അപ്രത്യക്ഷനാകുന്നു" start={S5.gone + 2} end={S5.out - 6} size={56} />
      <T F={F} text="ഏതാനും സെക്കൻഡുകൾക്കുള്ളിൽ പുറത്തുവിട്ടു" start={S5.out + 4} end={S5.up - 6} size={56} />
      <ScreenPill F={F} text="ഒരു പോറലുമില്ലാതെ" x={960} y={250} start={S5.up + 10} end={S5.good - 6} color={C.green} />
    </SplitSea>
  );
};

// Big mouth, narrow throat. Then who decides where you go.
const TW = {x: 300, y: 480, s: 1.4};
const wpt = (lx: number, ly: number): P => [TW.x + lx * TW.s, TW.y + ly * TW.s];
const kThroat: Key[] = [[S5.good, 960, 540, 1.0], [S5.throat, 900, 540, 1.25, "ease"], [S5.bad - 10, 900, 540, 1.3], [S5.bad + 30, 960, 540, 1.0, "ease"], [S5.end + 10, 960, 520, 1.05]];
const ThroatShot = ({F}: {F: number}) => {
  const z = camAt(kThroat, F).z;
  const tries = go(F, S5.human, S5.human + 34, 0, 1);
  const [dx, dy] = [wpt(175, 56)[0] + (wpt(400, 62)[0] - wpt(175, 56)[0]) * tries, wpt(175, 56)[1]];
  const upP = snap(F, S5.decide + 30, 20);
  const dnP = snap(F, S5.decide + 60, 20);
  const won = snap(F, S5.lucky + 4, 10);
  const A: P = wpt(560, -60);
  return (
    <Stage F={F} keys={kThroat} seed="throat">
      <Svg>
        <W f={F} x={TW.x} y={TW.y} s={TW.s} id="throat" amp={10} />
        <g transform={`translate(${TW.x} ${TW.y}) scale(${TW.s})`}>
          <defs>
            <clipPath id="throatBody">
              <path d={OUTLINE} />
            </clipPath>
          </defs>
          <g clipPath="url(#throatBody)" opacity={snap(F, S5.cant, 16)}>
            <path d="M300 62L580 66" stroke={C.maroon} strokeWidth="15" strokeLinecap="round" />
            <path d="M300 62L580 66" stroke="#120B0B" strokeWidth="9" strokeLinecap="round" />
            <path d={MOUTH} fill="#120B0B" stroke={C.maroon} strokeWidth="6" />
          </g>
        </g>
        {F >= S5.human && <Diver f={F} x={dx} y={dy} s={0.2} />}
        {F >= S5.human + 6 && (
          <g opacity={snap(F, S5.human + 6, 6)} transform={`translate(${wpt(330, 62)[0]} ${wpt(330, 62)[1]})`}>
            <path d="M-26 -26L26 26M26 -26L-26 26" stroke={C.red} strokeWidth="9" strokeLinecap="round" />
          </g>
        )}
        <Arrow x1={A[0]} y1={A[1]} x2={A[0]} y2={240} p={upP} color={won > 0 ? C.green : C.rule} w={4 + 3 * won} />
        <Arrow x1={A[0]} y1={wpt(560, 120)[1]} x2={A[0]} y2={1000} p={dnP} o={1 - 0.75 * won} />
      </Svg>
      <MapPill text="വായ: ഭീമം" at={wpt(175, 50)} z={z} f={F} start={S5.throat + 4} dy={-170} out={S5.bad - 8} />
      <MapPill text="തൊണ്ട: ഇടുങ്ങിയത്" at={wpt(450, 64)} z={z} f={F} start={S5.throat + 30} dy={150} out={S5.bad - 8} color={C.red} />
      <MapPill text="മുകളിലേക്ക്?" at={[A[0], 240]} z={z} f={F} start={S5.decide + 46} dx={170} color={won > 0 ? C.green : C.title} />
      <MapPill text="താഴേക്ക്?" at={[A[0], 1000]} z={z} f={F} start={S5.decide + 76} dx={150} out={S5.lucky + 10} />
      <T F={F} text="നല്ല വാർത്ത ഒന്നുണ്ട്" start={S5.good + 2} end={S5.cant - 4} color={C.green} />
      <T F={F} text="ഹംപ്ബാക്കിന് നിങ്ങളെ വിഴുങ്ങാൻ കഴിയില്ല" start={S5.cant + 2} end={S5.throat - 6} size={56} />
      <T F={F} text="വായ ഭീമം, തൊണ്ട ഇടുങ്ങിയത്" start={S5.throat + 2} end={S5.human - 6} />
      <T F={F} text="മനുഷ്യൻ അതിലൂടെ പോകില്ല" start={S5.human + 2} end={S5.bad - 6} />
      <T F={F} text="മോശം വാർത്ത" start={S5.bad + 2} end={S5.decide - 4} color={C.red} />
      <T F={F} text="എത്ര നേരം, ഏത് ദിശ: തീരുമാനിക്കുന്നത് തിമിംഗലം" start={S5.decide + 4} end={S5.lucky - 6} size={52} />
      <T F={F} text="പാക്കാർഡിന്റെ ഭാഗ്യം: മുകളിലേക്ക്" start={S5.lucky + 4} end={S5.end - 4} />
    </Stage>
  );
};

export const s5: AShot[] = [
  {
    from: S5.start,
    C: ImagineShot,
    link: {kind: "push", from: [960, 540], to: [960, 540]},
    cues: [["ui_pop", S5.imagine + 2], ["thud", S5.rise + 4, 0.6], ["ui_pop", S5.rise + 4], ["thud", S5.eyes + 10, 0.5], ["ui_pop", S5.eyes + 4], ["ui_pop", S5.eyes + 10], ["ui_pop", S5.prey + 2], ["ui_alert", S5.thing, 0.6], ["ui_pop", S5.thing + 2]],
  },
  {
    from: S5.feb,
    C: MagellanShot,
    link: {kind: "push", from: [960, 540], to: [960, 470]},
    cues: [["ui_pop", S5.feb + 4], ["ui_pop", S5.strait], ["sonar_ping", S5.strait + 30], ["sonar_ping", S5.adrian, 0.4], ["ui_pop", S5.adrian + 4], ["sonar_ping", S5.dad, 0.4], ["ui_pop", S5.dad + 4]],
  },
  {
    from: S5.split,
    C: KayakShot,
    link: {kind: "pan", dir: 1},
    cues: [
      ["thud", S5.split + 2, 0.9], ["ui_alert", S5.split + 4, 0.5], ["ui_pop", S5.split + 4], ["thud", S5.gulp + 30, 0.8], ["ui_pop", S5.gulp + 20], ["thud", S5.gulp + 72, 1],
      ["ui_pop", S5.gone + 2], ["ui_pop", S5.out + 4], ["thud", S5.out + 50, 0.7], ["ui_check", S5.up + 10],
    ],
  },
  {
    from: S5.good,
    C: ThroatShot,
    link: {kind: "tilt", dir: -1},
    cues: [
      ["ui_check", S5.good + 2], ["ui_pop", S5.cant + 2], ["ui_pop", S5.throat + 2], ["ui_pop", S5.throat + 4], ["ui_alert", S5.throat + 30, 0.4], ["ui_pop", S5.human + 2], ["ui_alert", S5.human + 6, 0.6],
      ["ui_alert", S5.bad + 2, 0.6], ["scan_typing", S5.decide + 4, 0.3], ["ui_pop", S5.decide + 46], ["ui_pop", S5.decide + 76], ["ui_check", S5.lucky + 4],
    ],
  },
];

export const sectionsA = (end: number) => seq([...s2b, ...s3, ...s4, ...s5], end);
