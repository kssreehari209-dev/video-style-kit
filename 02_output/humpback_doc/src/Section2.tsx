import React from "react";
import {AbsoluteFill, Easing, interpolateColors} from "remotion";
import {BG, Dust, Vignette} from "./atmosphere";
import {camAt, Cam, Fixed, Key} from "./cam";
import {Row, Shot, Svg, W} from "./kit";
import {OUTLINE} from "./Humpback";
import {Boat, Diver, Land, ll, Lobster, MapPill, Seabed, SplitSea} from "./Objects";
import {LOCK, Out} from "./Section1";
import {C, FONT, lerp, P, snap, spline} from "./theme";
import {Brackets, ScaleLabel, Strike, Title} from "./ui";

// Section 2, clip 2: Cape Cod, the dive to 14 M, the hit, the dark, and the reveal that he is inside a whale.
// All timing is estimated from the script. Beats are frames from each shot's first frame.

// ---------- Shot 1: the map. Its first frames are already in clip 1, so the first camera key and the
// title and pill beats must stay as they are.
const CAPE = ll("capecod", -70.05, 41.95);
const SPOT = ll("capecod", -70.25, 42.06); // off the tip of the Cape. Approximate: the notes give no position
const A = {title: 14, pill: 84, dot: 96, name: 150, labelsOut: 168, dur: 190};
const camCape: Key[] = [
  [0, 1024, 520, 1.5],
  [96, 1000, 515, 1.74],
  [A.dur - 6, SPOT[0], SPOT[1], 3.1, "ease"],
  [A.dur + 10, SPOT[0], SPOT[1], 3.3],
];

const CapeShot = ({f}: {f: number}) => {
  const {z} = camAt(camCape, f);
  const inv = 1 / z;
  return (
    <AbsoluteFill>
      <Cam keys={camCape} f={f} style={{background: BG.deep}}>
        <Land map="capecod" />
        <Dust frame={f} seed="cape" />
        <Svg>
          {[A.dot, A.dot + 30, A.dot + 60].map((p) => {
            const age = f - p;
            if (age < 0 || age > 44) return null;
            return <circle key={p} cx={SPOT[0]} cy={SPOT[1]} r={(14 + age * 7.67) * inv} fill="none" stroke="#C7D6DA" strokeWidth={3 * inv} opacity={0.62 * (1 - age / 44)} />;
          })}
          <g opacity={snap(f, A.dot, 6)}>
            <circle cx={SPOT[0]} cy={SPOT[1]} r={24 * inv} fill={C.green} opacity="0.2" />
            <circle cx={SPOT[0]} cy={SPOT[1]} r={8 * inv} fill="#D9FBE7" />
          </g>
        </Svg>
        <MapPill text="കേപ് കോഡ്" at={CAPE} z={z} f={f} start={A.pill} dx={190} dy={0} out={A.labelsOut} />
        <MapPill text="മൈക്കൽ പാക്കാർഡ്" at={SPOT} z={z} f={f} start={A.name} dx={-20} dy={-96} size={40} color={C.green} out={A.dur - 12} />
        <Out f={f} at={A.labelsOut}>
          <Title text="2021 ജൂൺ · അമേരിക്ക" frame={f} start={A.title} />
        </Out>
      </Cam>
      <Vignette strength={0.85} />
    </AbsoluteFill>
  );
};

// ---------- Shot 2: down the line from the boat to the sea floor, then the mouth shuts around him
const B = {title: 10, drop: 16, land: 70, shade: 122, close: 146, shut: 160, dur: 170};
const SURFACE = 240;
const FLOOR = 890;
const HERE: P = [1000, 842];
const camDive: Key[] = [
  [0, 960, 245, 2.2],
  [B.drop, 960, 245, 2.2],
  [B.land, 980, 760, 2.2, "ease"],
  [B.close, 985, 785, 2.5],
  [B.shut, HERE[0], HERE[1] - 10, 3.3, "snap"],
  [B.dur + 10, HERE[0], HERE[1] - 10, 3.4],
];
const dropT = (f: number) => Easing.inOut(Easing.cubic)(Math.max(0, Math.min(1, (f - B.drop) / (B.land - B.drop))));

// The mouth seen from inside it, pinned to the screen. Both jaws come together around the diver.
const Jaws = ({p}: {p: number}) => {
  if (p <= 0) return null;
  const h = 860 * (1 - p); // half the height of the gap at screen center
  const edge = (x: number) => h * (1 - ((x - 960) / 1240) ** 2);
  const top: P[] = [];
  const low: P[] = [];
  for (let x = -40; x <= 1960; x += 100) {
    top.push([x, 540 - edge(x)]);
    low.push([x, 540 + edge(x)]);
  }
  const plates: [number, number, number, number][] = [];
  for (let x = -20; x < 1940; x += 15) {
    const n = Math.sin(x * 12.9898) * 43758.5453;
    const r = n - Math.floor(n);
    plates.push([x, 540 - edge(x) - 6, 66 + 40 * r, 0.45 + 0.45 * r]);
  }
  const topLine = spline(top, false);
  const lowLine = spline(low, false);
  return (
    <svg width="1920" height="1080" style={{position: "absolute"}}>
      <path d={`${topLine}L1960 -40L-40 -40Z`} fill="#120B0B" />
      <path d={`${lowLine}L1960 1120L-40 1120Z`} fill="#120B0B" />
      {plates.map(([x, y, l, o]) => (
        <line key={x} x1={x} y1={y} x2={x + 5} y2={y + l} stroke="#7C786C" strokeWidth="6" strokeLinecap="round" opacity={o} />
      ))}
      <path d={lowLine} stroke="#8F9494" strokeWidth="16" fill="none" opacity="0.8" />
      <path d={topLine} stroke={C.rim} strokeWidth="12" fill="none" />
    </svg>
  );
};

const DiveShot = ({f}: {f: number}) => {
  const t = dropT(f);
  const m = t * 14;
  const lineEnd = SURFACE + 8 + (HERE[1] - 40 - SURFACE - 8) * t;
  const shade = snap(f, B.shade, 26) * 0.6;
  const jaws = Easing.in(Easing.quad)(Math.max(0, Math.min(1, (f - B.close) / (B.shut - B.close))));
  return (
    <SplitSea f={f} seed="dive" keys={camDive} surface={SURFACE}>
      <Svg>
        <Boat f={f} x={960} y={SURFACE} s={0.56} people={0.2} />
        <line x1={960} y1={SURFACE + 8} x2={960 + ((HERE[0] - 960) * (lineEnd - SURFACE)) / (HERE[1] - SURFACE)} y2={lineEnd} stroke={C.rule} strokeWidth="1.6" strokeDasharray="6 5" opacity="0.7" />
        <Seabed top={FLOOR} />
        <Lobster f={f} x={908} y={884} s={0.46} />
        <Diver f={f} x={HERE[0]} y={HERE[1]} s={0.62} r={-10} />
      </Svg>
      <Out f={f} at={B.shade + 6}>
        <Title text="ലോബ്സ്റ്റർ മുങ്ങൽക്കാരൻ" frame={f} start={B.title} />
        <Fixed>
          <ScaleLabel text={`${t >= 1 ? 14 : m.toFixed(0)} M`} frame={f} start={B.drop} top={186} size={f >= B.land ? 48 + 12 * (1 - snap(f, B.land, 12)) : 48} />
        </Fixed>
      </Out>
      <Fixed>
        <AbsoluteFill style={{background: "#010304", opacity: shade}} />
        <Jaws p={jaws} />
      </Fixed>
    </SplitSea>
  );
};

// ---------- Shot 3: one world, the whale. The camera starts deep inside its mouth, where the picture is black,
// and pulls all the way back out at the end.
const K = {dark: 10, darkOut: 46, diver: 30, first: 51, shark: 80, teeth: 150, pain: 174, air: 206, strike: 232, listOut: 256, sq: 262, sqTitle: 268, reveal: 330, revealed: 394, inside: 386, box: 398, leave: 430, dur: 460};
const WHALE = {x: 1810, y: 500, s: 1.7};
const CENTER: P = [175, 50]; // middle of the mouth, in the whale's own units
const WHERE: P = [WHALE.x - CENTER[0] * WHALE.s, WHALE.y + (CENTER[1] - 2) * WHALE.s]; // the diver, in the picture
const MOUTH = spline([[46, 30], [90, 6], [160, -2], [240, 10], [300, 40], [306, 84], [250, 104], [170, 98], [100, 78], [60, 54]], true);

// Keep the diver on screen all the way through the pull-back: his screen position is eased, and the camera solves for it.
const END_Z = 1.04;
const END: P = [(WHERE[0] - 960) * END_Z + 960, (WHERE[1] - 540) * END_Z + 540];
const pullBack: Key[] = Array.from({length: 16}, (_, i) => {
  const e = Easing.inOut(Easing.cubic)((i + 1) / 16);
  const z = Math.exp(Math.log(10.8) * (1 - e) + Math.log(END_Z) * e);
  const [sx, sy] = [960 + (END[0] - 960) * e, 540 + (END[1] - 540) * e];
  return [K.reveal + (i + 1) * 4, WHERE[0] - (sx - 960) / z, WHERE[1] - (sy - 540) / z, z] as Key;
});
const camMouth: Key[] = [
  [0, WHERE[0] - 66, WHERE[1], 9.2],
  [K.listOut, WHERE[0] - 66, WHERE[1], 9.9],
  [K.sq + 26, WHERE[0], WHERE[1], 9.9, "ease"],
  [K.reveal, WHERE[0], WHERE[1], 10.8],
  ...pullBack,
  [K.leave, 960, 540, 1.08],
  [K.dur, WHERE[0], WHERE[1], 2.6, "ease"],
  [K.dur + 10, WHERE[0], WHERE[1], 2.9],
];
const pulses = [K.sq + 18, K.sq + 42, K.sq + 66];
const squeezeAt = (f: number) => {
  // Wider than the view at first, so the screen is fully black. Then the walls come in.
  const tight = 1.25 - 0.75 * snap(f, K.sq, 28);
  const pulse = pulses.reduce((sum, p) => sum + (f >= p && f < p + 36 ? 0.14 * Math.sin(((f - p) / 36) * Math.PI) : 0), 0);
  return tight - pulse + 0.12 * lerp(f, K.reveal, K.reveal + 40, 0, 1);
};

const Mouth = ({f}: {f: number}) => {
  const sq = squeezeAt(f);
  const wall = lerp(f, K.reveal, K.reveal + 34, 150, 30);
  const shape = `translate(${CENTER[0]} ${CENTER[1]}) scale(${0.5 + 0.5 * sq} ${sq}) translate(${-CENTER[0]} ${-CENTER[1]})`;
  return (
    <g transform={`translate(${WHALE.x} ${WHALE.y}) scale(${-WHALE.s} ${WHALE.s})`}>
      <defs>
        <clipPath id="body">
          <path d={OUTLINE} />
        </clipPath>
      </defs>
      <g clipPath="url(#body)">
        <g transform={shape}>
          <path d={MOUTH} stroke={C.redFill} strokeWidth={wall} strokeLinejoin="round" fill="none" />
          <path d={MOUTH} stroke={C.maroon} strokeWidth={wall * 0.55} strokeDasharray="1.4 5" fill="none" opacity="0.5" />
          <path d={MOUTH} fill={interpolateColors(f, [K.reveal, K.reveal + 40], ["#020806", "#120B0B"])} stroke={C.maroon} strokeWidth="1.4" />
        </g>
      </g>
    </g>
  );
};

const Bubbles = ({f}: {f: number}) => (
  <g>
    {Array.from({length: 8}).map((_, i) => {
      const age = (f - K.air + i * 6) % 48;
      if (f < K.air || f >= K.sq + 10) return null;
      return <circle key={i} cx={WHERE[0] - 14 + Math.sin(i * 2.1 + age * 0.16) * 2.4} cy={WHERE[1] - 6 - age * 1.1} r={0.8 + (i % 3) * 0.5} fill="none" stroke="#C7D6DA" strokeWidth="0.32" opacity={0.75 * (1 - age / 48)} />;
    })}
  </g>
);

const MouthShot = ({f}: {f: number}) => {
  const {z, tx, ty} = camAt(camMouth, f);
  const [sx, sy] = [WHERE[0] * z + tx, WHERE[1] * z + ty];
  const b = snap(f, K.box, 18);
  const [bw, bh] = [240 + (1 - b) * 240, 170 + (1 - b) * 160];
  return (
    <AbsoluteFill>
      <Cam keys={camMouth} f={f} style={{background: LOCK}}>
        {z < 3.2 && (
          <div style={{position: "absolute", inset: 0, opacity: lerp(z, 2.6, 3.2, 1, 0)}}>
            <Dust frame={f} seed="mouth" />
          </div>
        )}
        <Svg>
          {/* Zoomed in far, the whale is drawn without its blurred light layers, which are too slow at that size.
              The full drawing fades in over them as the camera pulls back. */}
          {z > 2.6 && <W f={f} x={WHALE.x} y={WHALE.y} s={WHALE.s} id="mouthLite" flip amp={16} lite />}
          {z < 3.6 && <W f={f} x={WHALE.x} y={WHALE.y} s={WHALE.s} id="mouth" flip amp={16} opacity={lerp(z, 2.6, 3.6, 1, 0)} />}
          <Mouth f={f} />
          <Bubbles f={f} />
          <g opacity={snap(f, K.diver, 26) * (1 - snap(f, K.dur - 8, 8))}>
            <Diver f={f} x={WHERE[0]} y={WHERE[1]} s={lerp(f, K.reveal, K.revealed, 0.16, 0.34)} r={Math.sin(f * 0.035) * 9} />
          </g>
        </Svg>
        <Out f={f} at={K.darkOut}>
          <Title text="ചുറ്റും ഇരുട്ട്" frame={f} start={K.dark} />
        </Out>
        <Out f={f} at={K.listOut}>
          <Title text="ആദ്യം മനസ്സിൽ വന്നത്" frame={f} start={K.first} />
          <Fixed>
            <div style={{position: "absolute", left: 480, top: 262, opacity: snap(f, K.shark), transform: `translateX(${(1 - snap(f, K.shark)) * -16}px)`}}>
              <Strike p={snap(f, K.strike, 10)} color={C.title}>
                സ്രാവ്?
              </Strike>
            </div>
            <Row text="പല്ലില്ല" y={410} f={f} start={K.teeth} />
            <Row text="വേദനയില്ല" y={555} f={f} start={K.pain} />
            <Row text="ഓക്സിജൻ ഇപ്പോഴും കിട്ടുന്നുണ്ട്" y={700} f={f} start={K.air} color={C.green} />
          </Fixed>
        </Out>
        <Out f={f} at={K.reveal - 6}>
          <Title text="ചുറ്റും പേശികൾ മുറുകുന്നു" frame={f} start={K.sqTitle} />
        </Out>
        <Out f={f} at={K.leave + 6}>
          <Title text="തിമിംഗലത്തിന്റെ വായ്ക്കുള്ളിൽ" frame={f} start={K.inside} />
          {f >= K.box && (
            <Fixed>
              <Brackets x={sx - bw / 2} y={sy - bh / 2} w={bw} h={bh} opacity={snap(f, K.box, 6)} />
              <div style={{position: "absolute", left: sx - 200, width: 400, top: sy - bh / 2 - 44, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 24, letterSpacing: 4, color: C.maroon, opacity: snap(f, K.box + 18)}}>LOCKED</div>
            </Fixed>
          )}
        </Out>
      </Cam>
      <Vignette strength={0.9} />
    </AbsoluteFill>
  );
};

// ---------- First shot of clip 3. Only its opening is built so far, so clip 2 can run into it.
const camGrip: Key[] = [
  [0, 960, 540, 1.2],
  [150, 960, 540, 1.4],
];
const GripShot = ({f}: {f: number}) => (
  <AbsoluteFill>
    <Cam keys={camGrip} f={f} style={{background: LOCK}}>
      <Dust frame={f} seed="grip" />
      <Svg>
        <Diver f={f} x={960} y={540} s={1.1} r={Math.sin(f * 0.035) * 9} />
      </Svg>
    </Cam>
    <Vignette strength={0.9} />
  </AbsoluteFill>
);

export const s2: Shot[] = [
  {
    dur: A.dur,
    C: CapeShot,
    cam: camCape,
    link: {kind: "push", from: [960, 540], to: [960, 540]},
    cues: [["ui_pop", A.title], ["ui_pop", A.pill], ["sonar_ping", A.dot], ["sonar_ping", A.dot + 30, 0.4], ["sonar_ping", A.dot + 60, 0.3], ["ui_pop", A.name]],
  },
  {
    dur: B.dur,
    C: DiveShot,
    cam: camDive,
    link: {kind: "blend"},
    cues: [["thud", 0, 0.5], ["ui_pop", B.title], ["scan_typing", B.drop, 0.3], ["scan_typing", B.drop + 40, 0.3], ["thud", B.land, 0.9], ["ui_pop", B.land], ["thud", B.shade, 0.35], ["thud", B.shut, 1], ["ui_alert", B.shut, 0.6]],
  },
  {
    dur: K.dur,
    C: MouthShot,
    cam: camMouth,
    link: {kind: "push", from: [960, 540], to: [960, 540]},
    cues: [
      ["ui_pop", K.dark], ["ui_pop", K.first], ["ui_pop", K.shark], ["ui_pop", K.teeth], ["ui_pop", K.pain], ["ui_pop", K.air], ["ui_alert", K.strike, 0.6],
      ["ui_pop", K.sqTitle], ["thud", pulses[0], 0.6], ["thud", pulses[1], 0.7], ["thud", pulses[2], 0.8],
      ["whale_song", K.reveal, 0.5], ["ui_pop", K.inside], ["thud", K.revealed, 0.9], ["ui_pop", K.box], ["ui_alert", K.box + 18, 0.5],
    ],
  },
];
