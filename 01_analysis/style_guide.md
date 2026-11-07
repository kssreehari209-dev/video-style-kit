# Style Guide: "Why You'd Never Want To Meet A Sperm Whale"

Sources, in order of trust:
1. 21 screenshots (1280 x 720) in `00_reference/frames/`, named with their timestamps (for example `1b_lockon_LOCKED_0620` is 06:20). Overview: `screenshots_contact_sheet.jpg`.
2. Two Gemini text analyses, used only for things the screenshots cannot show (sound, transitions, motion).

Where the sources disagree, the screenshots win. Items marked **[unknown]** are not visible in any source.

## Corrections: what the screenshots showed that Gemini got wrong or missed

| Gemini said | The frames show |
|---|---|
| Characters are flat, with no texture or shading | Soft gradients and highlights on the squid, a faint rim light on the whale, ridged skin lines, bubbles on the head-on whale, grainy speckle. Flat-ish, not flat |
| Backgrounds are blue-to-black gradients | Most scenes are near-black with a slight teal tint. Only the sonar scenes are blue |
| Lock-on brackets start neon green, then turn red | Brackets are red in all three lock-on frames (06:19, 06:20, 06:22). Green appears on the diver, the timer and the volume meters |
| "LOCKED" sits above the top-right corner | It is centered above the brackets, in dim maroon, low contrast |
| Text is pure white | Titles are warm cream (`#EBE9E2` to `#F1EFEB`). Only the selected menu item is near pure white |
| Bus matches the whale's width, with the elephants beneath it | Bus is about 70% of the whale's width and the elephants take its slot after it leaves (frames 5a, 5c) |
| Diver has a dark grey suit, white tank, yellow flippers | In the lock-on scene the diver is rendered entirely in night-vision green. The suit, tank and flippers described are not visible in these frames |
| Squid has a triangular mantle | Mantle is a rounded blob and tube. Tentacles are long, tapering and fan out, with small white hook marks |
| Whale has white triangular teeth on the lower jaw; forehead is "exactly one-third" | No teeth visible in these frames. Head proportion is unverified |
| Only hard cuts, no dips to black | Frame 3e (07:00) shows the whole scene fading almost to black, so there is at least one fade |

Gemini missed these entirely: floating dust particles, soft light shafts, the diver's flashlight cone, a rotating teal line in the lock-on scene, a ghosted seventh elephant, a "WINNER" stamp, and a vignette.

## Overview
- Type: vector motion graphics with soft lighting effects, built to be recreated with SVG and Remotion
- Aspect ratio 16:9. Screenshots are 1280 x 720; work at 1920 x 1080 (multiply every pixel value below by 1.5)
- Duration 9 min 58 s
- Frame rate **[unknown]**, use 30 fps until confirmed
- Mood: tense documentary explainer with a sonar/tracking interface over a dark ocean

## Lighting and atmosphere
- Floating dust: soft blurred circles (roughly 10 to 40 px, low opacity) plus tiny pinprick specks, in nearly every frame. Position and drift speed **[unknown]**
- Vignette: edges darker than the center
- Underwater sonar scenes (06:03 to 06:09): soft vertical light shafts from the top, a thin wavy surface line along the top edge, and a translucent white-grey flashlight cone coming from the lower right, with a white pill-shaped flashlight at its tip
- Lock-on scene (06:19 to 06:22): almost pure black with a green tint, drawn as a night-vision/tracking view
- Menu, scale and volume scenes: near-black with faint teal at the top and a vignette

## Palette (measured from the screenshots)
Thin lines and small text read darker than their true color in compressed screenshots, so thin-element values are lower bounds.

| Role | Hex |
|---|---|
| Deep background (most frames) | `#03090D` |
| Lock-on scene background | `#020806` |
| Mid background (top of menu/scale frames) | `#0B1F28` |
| Brighter blue-teal (radial top) | `#0C2B3A` |
| Sonar light shafts / surface | `#315968` to `#385F6C` |
| Title text (warm cream) | `#F1EFEB` |
| Selected / emphasized text | `#FFFCFD` |
| Unselected menu text | `#BABDBA` |
| Scale labels ("~16 M") | `#F9F7F2` |
| Alert red (strike-through, caption, box border, meter top) | `#DB4043` |
| Red box fill | `#271516` |
| "LOCKED" label (dim maroon) | `#512123` |
| Green (meter fill, diver accents) | `#48CD80` |
| Diver body (night-vision green) | `#094513` |
| "TRACKING" timer (muted sage) | `#6A947E` |
| Amber (meter middle) | `#DFB33B` |
| Meter housing / empty segment | `#212A31` / `#2D363E` |
| Label pill background | `#131517` |
| City bus body / windows | `#C99629` / `#2B3635` |
| Elephants / ghosted seventh elephant | `#555A5D` / `#2C3033` |
| Whale, side view / rim light | `#393A3C` / `#3C484E` |
| Whale, head-on / radial view | `#45423D` / `#4F4C48` |
| Squid (brightest body area) | `#674337` |
| Scale rule line | `#ADBBC2` |

## Characters and objects
- **Sperm whale**: seen from the side (blocky head, narrow jaw line, dorsal hump, tail flukes, pectoral fin, faint horizontal skin ridges), head-on (round body, blowhole, fins, wrinkles, bubbles) and in the radial diagram (lighter taupe). Side view spans about x 165 to 1000 at 720p.
- **Colossal squid** (02:05): rust red, rounded mantle with soft highlight, large round eye with a glossy highlight set in a lighter ring, long tapering tentacles with small white hooks, grainy speckle.
- **Diver** (06:19 to 06:22): night-vision green silhouette with bright green hands, feet and eye, and a white-cyan flashlight tip at the front. Other colors **[unknown]**.
- **City bus**: flat yellow body, nine dark windows, two dark wheels, white "CITY BUS" label. About 592 px wide at 720p.
- **Elephants**: seven grey icons in an evenly spaced row (about 159 px apart at 720p), the seventh ghosted to show "6 to 7".

## UI components (positions at 1280 x 720)
- **Lock-on brackets**: thin red corner marks, about 3 px stroke and 28 px arms. At 06:19 they frame a large empty area (about 438 x 306). By 06:20 they have shrunk onto the diver (about 214 x 150) and follow him. A thin teal line rotates from steep diagonal (06:19) to horizontal (06:22); its meaning **[unknown]**.
- **"LOCKED"**: small, letter-spaced, dim maroon, centered about 20 px above the brackets.
- **"TRACKING: 00:41"** timer: bottom right, muted sage, about 14 px cap height. It counts up one step per second (00:41, 00:42, 00:43). Its position drifts about 40 px right and 25 px down across the scene, so a slow push-in is likely.
- **Sonar rings**: thin pale circles centered on the subject. Radii in 2a are about 63, 215 and 368 px, drawn as one expanding ring over time.
- **Option menu** (06:11 to 07:00): title "YOUR OPTIONS" centered at about y 85. Four left-aligned lines starting at x 320, spaced about 97 px apart. Eliminated options get a thick red line through the middle that overshoots the text slightly and the text dims. The selected option gets a rounded red-bordered box (about 736 x 74, x 273 to 1009) with a dark red fill, and its text turns white.
- **Volume contest** (06:54 to 06:59): title at top center. Two vertical meters at x about 403 and 871, each with 13 rounded segments inside a dark rounded housing (about 124 x 415). Left meter fills one green segment. Right meter fills 8 green, then 3 amber, then 2 red, with seven thin white rays fanning above it, a rotated red outlined "WINNER" stamp across it, and a "~230 dB" pill beside the top (mixed case, medium weight). Labels "YOU (SPLASHING)" and "SPERM WHALE" below.
- **Scale comparisons** (01:13 to 01:17): side-view whale at top, thin horizontal rule below it with "~16 M" under the rule. The bus appears in the next slot and is replaced by a red caption "≈ 40 TONNES = 6-7 ELEPHANTS" (underlined in red) above the elephant row.
- **Radial diagram** (08:54 to 08:57): the whale sits near the center and three dashed lines cross at its middle, giving six rays 60 degrees apart, ending in small dark rounded label pills: SURFACE and DEEP SEA (bright), PLANKTON, FISH, SQUID and SEABIRDS (greyer).

## Typography
- Heavy geometric sans-serif, all caps for titles, options and labels. Montserrat and Poppins are both close; the stills cannot tell them apart, so test both against the frames. Inter Black is less likely.
- Estimated sizes at 1080p (from cap heights at 720p): titles and options about 64 px, scale labels about 48 px, timer about 30 px. Treat as starting points.
- Titles are centered near the top (about y 85 at 720p).
- Mixed case is used for "~230 dB" only.

## Motion and timing
- Background tracking (the diver swimming): constant linear speed.
- UI overlays: ease-out snap-in, about 200 to 500 ms (two Gemini passes disagreed; use 300 ms).
- Entrance technique: quick opacity fade or scale jump from 0 to 1.
- Camera: linear horizontal pan or vertical translate, plus a slow push-in in the lock-on scene.
- Ring, bracket and meter timing beyond this **[unknown]**.

## Transitions and pacing
- Mostly hard cuts (Gemini, not checked in motion).
- At least one fade to near-black (07:00, after all menu options are struck out).
- Average shot length **[unknown]**.

## Sound
- Bed: deep, low-frequency ambient drones that suggest ocean currents.
- UI sound effects on top: high-pitched sonar pings and digital scanning or typing sounds.
- Scale comparisons are punctuated by low-end thuds.
- Sync rule: visual hits land on distinct beats. Place each sound effect on the exact frame where its animation triggers.
- Confidence: from Gemini only, never verified by listening.
- Production: all effects are synthesized in code (`scripts/generate_sfx.py`, output in `02_output/audio/`). They are approximations, not copies of the original audio.

## Rules that define this style
1. Dark: near-black scenes with a teal tint, blue only in the sonar scenes.
2. Soft atmosphere: floating dust, vignette, light shafts.
3. Characters are simple vector shapes with subtle gradients and highlights, never outlined.
4. Red is for danger and decisions: brackets, strike-throughs, selected box, top meter segments.
5. Green is for the diver and positive readouts: meter fill, diver accents, tracking timer.
6. Titles are warm-cream heavy sans-serif, all caps, centered near the top.
7. Statistics are shown against familiar objects (bus, elephants), and the last item can be ghosted to show a range.
8. Interface pieces are simple: rounded boxes, segmented meters, thin rings, dashed lines, dark label pills.
9. Layouts are centered or a clean left-aligned list.
10. Everything stays legible on a phone screen.
11. **User direction, not from the reference:** stay 2D, and give main subjects soft, 3D-style lighting. Main subjects are the characters, creatures and key objects a shot is about. Keep their flat vector shapes and paint soft light over them: a gentle top highlight, a soft shadow underneath, a faint rim and bounce light, soft cast shadows. Never make them look like a 3D render. Backgrounds, text and UI follow the rest of this guide.
12. **User direction, not from the reference:** give every shot an engaging camera move. Beyond the reference's linear pans, vertical moves and slow push-ins, this allows pull-backs for scale reveals, eased re-framing between beats, and fast punch-ins (about 300 ms, ease-out) on key beats. Titles stay pinned to the screen, and the whole picture moves as one flat plane, with no parallax.
13. **User direction, not from the reference:** connect every scene by camera instead of a hard cut. The camera pushes through an object, tilts or pans across a dark gap, or runs on as one continuous shot where two shots share a place. This replaces the reference's mostly hard cuts. When a video is delivered as clips, each clip ends mid-move and the next opens on the very next frame of that move.

## Rendering engine
- Remotion (React). Drive everything from frame numbers so audio can sync to exact frames.
- Canvas 1920 x 1080, 30 fps working assumption.
- Suggested components: `Dust`, `Vignette`, `LightShafts`, `FlashlightCone`, `Whale` (side and head-on), `Squid`, `Diver`, `LockOnBrackets`, `TrackingTimer`, `SonarRings`, `OptionMenu`, `VolumeMeter`, `ScaleRow`, `RadialDiagram`, `TextBox`.

## Open questions
- Frame rate
- Diver colors outside the lock-on scene, and whether the whale ever shows teeth
- What the rotating teal line in the lock-on scene represents
- Ring, bracket and meter timings; average shot length
- Which font (Montserrat or Poppins), after a side-by-side test
- Whether the video has other fades besides 07:00
