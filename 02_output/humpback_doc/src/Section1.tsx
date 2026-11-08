import React, {useContext} from "react";
import {AbsoluteFill, Easing, interpolate} from "remotion";
import {BG, Dust, SonarRings, Vignette} from "./atmosphere";
import {camAt, Cam, Fixed, Key, ShotKeys} from "./cam";
import {Shot, Svg, W} from "./kit";
import {Boat, Diver, Land, ll, MapPill, SplitSea} from "./Objects";
import {C, FONT, lerp, snap} from "./theme";
import {Brackets, Pill, ScaleLabel, Title} from "./ui";

// Section 1 runs 40 s, the clip limit, and is clip 1 in full. All timing is estimated from the script.
// Beats are frames from each shot's first frame. Move them when narration is recorded.

export const Out = ({f, at, d = 8, children}: {f: number; at: number; d?: number; children: React.ReactNode}) => {
  const o = 1 - snap(f, at, d);
  return o <= 0 ? null : <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

// ---------- Shot 1: the signal, then the track across the Arabian Sea
const KANNUR = ll("arabian", 75.35, 11.87);
const SIGNAL = ll("arabian", 74.9, 11.9); // about 50 km off Kannur
const START = ll("arabian", 57.6, 17.6); // off Oman. Exact tagging spot not in the notes, so this is approximate
const CTRL: [number, number] = [1010, 640];

const M = {
  dot: 10, title: 20, kannur: 100, km50: 170, signal: 236, track: 250,
  rewind: 280, rewound: 334, oman: 304, luban: 356, titleOut: 268,
  play: 424, played: 574, cross: 428, kerala: 578, push: 590, dur: 600,
};

const route = (t: number): [number, number] => {
  const u = 1 - t;
  return [u * u * START[0] + 2 * u * t * CTRL[0] + t * t * SIGNAL[0], u * u * START[1] + 2 * u * t * CTRL[1] + t * t * SIGNAL[1]];
};
const easeIO = Easing.inOut(Easing.cubic);
const trackT = (f: number) => {
  if (f < M.rewind) return 1;
  if (f < M.rewound) return 1 - easeIO((f - M.rewind) / (M.rewound - M.rewind));
  if (f < M.play) return 0;
  if (f < M.played) return Easing.inOut(Easing.sin)((f - M.play) / (M.played - M.play));
  return 1;
};
const line = (a: number, b: number) => {
  let d = "";
  for (let i = 0; i <= 60; i++) {
    const [x, y] = route(a + ((b - a) * i) / 60);
    d += `${d ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
};

const camMap: Key[] = [
  [0, SIGNAL[0] + 8, SIGNAL[1], 6.2],
  [66, SIGNAL[0] + 8, SIGNAL[1], 5.6],
  [110, SIGNAL[0] + 12, SIGNAL[1] - 4, 5, "ease"],
  [200, SIGNAL[0] + 12, SIGNAL[1] - 4, 4.3],
  [270, SIGNAL[0], SIGNAL[1], 3.8, "ease"],
  [M.rewound, START[0] + 40, START[1] - 110, 2.5, "ease"],
  [M.play, START[0] + 60, START[1] - 110, 2.2],
  [500, 960, 540, 1, "ease"],
  [M.played, 960, 540, 1.04],
  [M.dur + 10, SIGNAL[0], SIGNAL[1], 2.6, "ease"],
];

const MapShot = ({f}: {f: number}) => {
  const {z} = camAt(camMap, f);
  const t = trackT(f);
  const [dx, dy] = route(t);
  const inv = 1 / z;
  const pings = [M.dot, M.dot + 34, M.signal, M.signal + 26, M.luban, M.played, M.played + 22];
  const box = snap(f, M.signal + 6, 22);
  const half = (150 + (1 - box) * 210) * inv;
  const km = Math.round((f < M.play ? 0 : t * 1500) / 10) * 10;
  const counting = f >= M.play;
  return (
    <AbsoluteFill>
      <Cam keys={camMap} f={f} style={{background: BG.deep}}>
        <Land map="arabian" />
        <Dust frame={f} seed="m1" />
        <Svg>
          {/* Whole track, faint, drawn behind the dot as it rewinds */}
          {f >= M.rewind && <path d={line(t, 1)} stroke={C.green} strokeWidth={2.4 * inv} strokeDasharray={`${9 * inv} ${9 * inv}`} fill="none" opacity={f < M.play ? 0.55 : 0.28} />}
          {/* Track as she swims it */}
          {f >= M.play && <path d={line(0, t)} stroke={C.green} strokeWidth={4 * inv} fill="none" strokeLinecap="round" />}
          {/* Kannur pin and the 50 km gap */}
          <circle cx={KANNUR[0]} cy={KANNUR[1]} r={7 * inv} fill={C.title} opacity={snap(f, M.kannur)} />
          {f >= M.km50 && f < M.rewind && (
            <line x1={SIGNAL[0]} y1={SIGNAL[1]} x2={SIGNAL[0] + (KANNUR[0] - SIGNAL[0]) * snap(f, M.km50, 14)} y2={SIGNAL[1] + (KANNUR[1] - SIGNAL[1]) * snap(f, M.km50, 14)} stroke={C.rule} strokeWidth={3 * inv} strokeDasharray={`${10 * inv} ${8 * inv}`} />
          )}
          {/* Rings stay a fixed size on screen */}
          {pings.map((p) => {
            const age = f - p;
            if (age < 0 || age > 44) return null;
            const r = (14 + age * 7.67) * inv;
            return <circle key={p} cx={dx} cy={dy} r={r} fill="none" stroke="#C7D6DA" strokeWidth={3 * inv} opacity={0.62 * (1 - age / 44)} />;
          })}
          {/* The glowing dot */}
          <g opacity={snap(f, M.dot, 6)}>
            <circle cx={dx} cy={dy} r={26 * inv} fill={C.green} opacity={0.16 + 0.06 * Math.sin(f * 0.2)} />
            <circle cx={dx} cy={dy} r={15 * inv} fill={C.green} opacity="0.3" />
            <circle cx={dx} cy={dy} r={8 * inv} fill="#D9FBE7" />
          </g>
        </Svg>
        {f >= M.signal && f < M.rewind + 6 && (
          <div style={{position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: 1 - snap(f, M.rewind - 4, 8)}}>
            <Svg>
              {(() => {
                const a = 42 * inv;
                const [x0, x1, y0, y1] = [dx - half, dx + half, dy - half * 0.72, dy + half * 0.72];
                return [`M${x0} ${y0 + a}V${y0}H${x0 + a}`, `M${x1 - a} ${y0}H${x1}V${y0 + a}`, `M${x0} ${y1 - a}V${y1}H${x0 + a}`, `M${x1 - a} ${y1}H${x1}V${y1 - a}`].map((d) => (
                  <path key={d} d={d} stroke={C.red} strokeWidth={4.5 * inv} fill="none" opacity={snap(f, M.signal, 6)} />
                ));
              })()}
            </Svg>
          </div>
        )}
        <MapPill text="കണ്ണൂർ" at={KANNUR} z={z} f={f} start={M.kannur} dx={150} dy={-6} out={M.rewind + 40} />
        <MapPill text="~50 KM" at={SIGNAL} z={z} f={f} start={M.km50 + 10} dx={0} dy={118} out={M.signal} size={40} />
        <MapPill text="ഉപഗ്രഹ സിഗ്നൽ" at={SIGNAL} z={z} f={f} start={M.signal + 12} dx={-20} dy={-168} out={M.rewind} size={40} />
        <MapPill text="ഒമാൻ" at={ll("arabian", 54.6, 19.6)} z={z} f={f} start={M.oman} out={M.played} />
        <MapPill text="ലുബാൻ" at={START} z={z} f={f} start={M.luban} dx={0} dy={84} out={M.play + 8} size={44} color={C.green} />
        <MapPill text="അറബിക്കടൽ" at={ll("arabian", 65.2, 11.2)} z={z} f={f} start={496} size={34} color={C.dim} out={M.dur - 12} />
        <MapPill text="ഇന്ത്യ" at={ll("arabian", 77.6, 18.6)} z={z} f={f} start={502} size={34} color={C.dim} out={M.dur - 12} />
        <MapPill text="കേരളം" at={KANNUR} z={z} f={f} start={M.kerala} dx={150} dy={36} out={M.dur - 12} />
        <Out f={f} at={M.titleOut}>
          <Title text="2017 · ക്രിസ്മസ് രാത്രി" frame={f} start={M.title} />
        </Out>
        <Out f={f} at={M.cross - 8}>
          <Title text="ഒമാനിലെ ഗവേഷകരുടെ ടാഗ്" frame={f} start={M.oman + 6} />
        </Out>
        <Out f={f} at={M.dur - 18}>
          <Title text="അറബിക്കടൽ മുറിച്ചുകടന്ന്" frame={f} start={M.cross} />
          {counting && (
            <Fixed>
              <ScaleLabel text={km >= 1500 ? "1,500+ KM" : `${km.toLocaleString("en-US")} KM`} frame={f} start={M.play} top={186} />
            </Fixed>
          )}
          <Fixed>
            <div style={{position: "absolute", right: 72, bottom: 54, fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 1.5, color: "#6A947E", opacity: snap(f, M.track)}}>
              TRACKING: {f < M.rewind + 30 || f >= M.played ? "25 DEC 2017" : "NOV 2017"}
            </div>
          </Fixed>
        </Out>
      </Cam>
      <Vignette strength={0.85} />
    </AbsoluteFill>
  );
};

// ---------- Shot 2: Luban under water, then the pull-back to the boat
const L = {title: 14, titleOut: 80, mouth: 82, open: 86, pill: 91, close: 112, song: 114, songOut: 146, boat: 140, people: 148, gentle: 234, dur: 330};
const camSea: Key[] = [
  [0, 1040, 700, 1.5],
  [L.mouth - 2, 1100, 690, 1.56],
  [L.mouth + 10, 1370, 700, 2.7, "snap"],
  [L.close, 1370, 700, 2.8],
  [L.boat + 46, 960, 540, 1, "ease"],
  [L.dur + 10, 960, 556, 1.05],
];

const SeaShot = ({f}: {f: number}) => {
  const snoutX = 1450 + f * 0.24;
  const gape = snap(f, L.open, 20) * (1 - snap(f, L.close, 18));
  const led = Math.sin(f * 0.26) > 0.2 ? 1 : 0.25;
  const songs = [L.song, L.song + 20, L.song + 40];
  return (
    <SplitSea f={f} seed="sea1" keys={camSea}>
      <Svg>
        <Boat f={f} x={1260} y={330} s={0.92} people={lerp(f, L.people, L.people + 26, 0, 1)} />
      </Svg>
      <SonarRings frame={f} starts={songs} cx={snoutX - 240} cy={712} r0={40} fadeAt={620} />
      <Svg>
        <W f={f} x={snoutX} y={690} s={1} id="luban" flip gape={gape} />
        {/* Satellite tag on her back, its light blinking green */}
        <g transform={`translate(${snoutX - 540} ${607})`}>
          <rect x="-7" y="-16" width="14" height="20" rx="4" fill="#17191B" />
          <circle cx="0" cy="-20" r="9" fill={C.green} opacity={0.22 * led} />
          <circle cx="0" cy="-20" r="4" fill="#D9FBE7" opacity={led} />
        </g>
      </Svg>
      <Out f={f} at={L.titleOut}>
        <Title text="ലുബാൻ: ഒരു ഹംപ്ബാക്ക് തിമിംഗലം" frame={f} start={L.title} />
      </Out>
      <Out f={f} at={L.song}>
        <Fixed>
          <Pill text="പല്ലില്ല" x={960} y={196} frame={f} start={L.pill} size={56} />
        </Fixed>
      </Out>
      <Out f={f} at={L.songOut}>
        <Fixed>
          <Pill text="പാട്ടുപാടും" x={960} y={196} frame={f} start={L.song + 8} size={56} />
        </Fixed>
      </Out>
      <Out f={f} at={L.gentle - 6}>
        <Fixed>
          <Pill text="പണം കൊടുത്ത് കാണാൻ പോകും" x={960} y={140} frame={f} start={L.people + 8} size={44} />
        </Fixed>
      </Out>
      <Title text="സൗമ്യനായ ഭീമൻ" frame={f} start={L.gentle} size={84} top={72} />
    </SplitSea>
  );
};

// ---------- Shot 3: the turn. Lock-on view: a lone diver, and a mouth coming up from below
const D = {title: 14, brackets: 30, land: 60, rise: 66, line: 114, shut: 166, dur: 180};
const camTurn: Key[] = [
  [0, 960, 570, 1.3],
  [D.rise, 960, 550, 1.14],
  [D.shut, 960, 540, 1.04, "ease"],
  [D.dur + 10, 960, 540, 1.5, "ease"],
];
export const LOCK = "radial-gradient(ellipse 80% 70% at 50% 45%, #041009 0%, #020806 72%, #010403 100%)";

const TurnShot = ({f}: {f: number}) => {
  const b = snap(f, D.brackets + 4, D.land - D.brackets - 4);
  const rise = interpolate(f, [D.rise, D.shut - 8], [0, 1], {easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const box = {x: 330 + (800 - 330) * b, y: 240 + (428 - 240) * b, w: 1260 + (320 - 1260) * b, h: 660 + (224 - 660) * b};
  // The whale lunges up along its own axis, 40 degrees off level, so the diver ends up between the jaws.
  const back = (1 - rise) * 1700;
  const gape = snap(f, D.rise, 40) * (1 - 0.5 * snap(f, D.shut, 14));
  return (
    <AbsoluteFill>
      <Cam keys={camTurn} f={f} style={{background: LOCK}}>
        <SonarRings frame={f + 200} starts={[120, 150, 180, 210, 240]} cx={960} cy={540} r0={60} fadeAt={1100} />
        <Dust frame={f} seed="turn" />
        <Svg>
          <g style={{filter: "brightness(0.66) saturate(0.7)"}}>
            <W f={f} x={1137 - 0.766 * back} y={266 + 0.643 * back} s={2.4} r={-40} id="rise" flip gape={gape} amp={10} />
          </g>
          <Diver f={f} x={960} y={540} s={0.62} flip r={-28 * snap(f, D.rise, 50)} />
        </Svg>
        <Brackets {...box} opacity={snap(f, D.brackets, 6)} />
        <div style={{position: "absolute", left: box.x, width: box.w, top: box.y - 44, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 24, letterSpacing: 4, color: C.maroon, opacity: snap(f, D.land)}}>LOCKED</div>
        <Out f={f} at={D.line - 8}>
          <Title text="പക്ഷേ" frame={f} start={D.title} />
        </Out>
        <Out f={f} at={D.dur - 14}>
          <Title text="ഒരു മനുഷ്യനെ ജീവനോടെ വായിലാക്കി" frame={f} start={D.line} />
        </Out>
      </Cam>
      <Vignette strength={0.9} />
    </AbsoluteFill>
  );
};

export const s1: Shot[] = [
  {
    dur: M.dur,
    C: MapShot,
    cam: camMap,
    link: {kind: "push", from: [960, 540], to: [960, 560]},
    cues: [
      ["sonar_ping", M.dot], ["sonar_ping", M.dot + 34], ["ui_pop", M.title], ["ui_pop", M.kannur], ["ui_pop", M.km50 + 10],
      ["sonar_ping", M.signal], ["ui_alert", M.signal + 6, 0.45], ["sonar_ping", M.signal + 26], ["ui_pop", M.signal + 12], ["ui_pop", M.track, 0.4],
      ["scan_typing", M.rewind], ["scan_typing", M.rewind + 34], ["ui_pop", M.oman], ["ui_pop", M.oman + 6], ["sonar_ping", M.luban], ["ui_pop", M.luban],
      ["scan_typing", M.play, 0.3], ["ui_pop", M.cross], ["ui_pop", 470, 0.4], ["ui_pop", 476, 0.4],
      ["sonar_ping", M.played], ["thud", M.played, 0.7], ["sonar_ping", M.played + 22], ["ui_pop", M.kerala],
    ],
  },
  {
    dur: L.dur,
    C: SeaShot,
    cam: camSea,
    link: {kind: "tilt", dir: 1},
    cues: [
      ["thud", 0, 0.5], ["ui_pop", L.title], ["ui_alert", L.pill, 0.35], ["ui_pop", L.pill],
      ["whale_song", L.song - 6, 0.5], ["sonar_ping", L.song, 0.3], ["ui_pop", L.song + 6],
      ["ui_pop", L.people + 8], ["thud", L.gentle, 0.7], ["ui_pop", L.gentle],
    ],
  },
  {
    dur: D.dur,
    C: TurnShot,
    cam: camTurn,
    link: {kind: "push", from: [960, 540], to: [960, 540]},
    cues: [
      ["sonar_ping", 0, 0.5], ["ui_pop", D.title], ["ui_pop", D.brackets], ["ui_pop", D.land], ["ui_alert", D.land, 0.5],
      ["thud", D.rise, 0.6], ["thud", D.line, 0.9], ["ui_alert", D.line, 0.6], ["thud", D.shut, 0.9],
    ],
  },
];
