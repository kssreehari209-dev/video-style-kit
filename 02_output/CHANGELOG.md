# Changelog

## humpback_doc_pieces/ (in progress)
The Malayalam humpback film, മുപ്പത് ടൺ സൗമ്യത, built one clip at a time. Clip 1 exists: `humpback_piece_01.mp4`, section 1 in full. Script: `humpback_doc_script.md`. Shot list and plan for about 22 clips: `humpback_doc_shotlist.md`. Brief: `new_scene_brief.md` (the sperm whale brief moved to `new_scene_brief_whale.md`). Source: `humpback_doc/src/`.

`humpback_doc/node_modules` is a link to `whale_doc/node_modules`, not a copy. If that folder is removed, run `npm install` in `humpback_doc/`.

To redo a clip, from `02_output/humpback_doc/`:

    bash render_pieces.sh 1

### Checked in clip 1
- 1920 x 1080, 30 fps, 1,200 frames, 40.0 s of picture and of sound
- All 43 sounds are on their frames. 40 matched by waveform within 5 ms. The other three pings sit under other sounds, so they were measured by onset: about 1 ms from the frame
- True peak -3.6 dBFS, -18.8 LUFS, no clipping. The mix must be redone when narration exists
- Reviewed by 18 frames from the final MP4, plus stills of both joins inside the clip and its end. Nobody has watched it at speed or listened to it, so nothing is claimed to match the original's sound

### Matched
- Sonar rings (2a, 2b), water surface and shafts (2b), red brackets shrinking onto the subject, "LOCKED" in dim maroon and the sage timer (1a to 1c), dark label pills (7a to 7c)
- 300 ms ease-out entrances, cream titles near the top, red only for brackets, green for the tracked dot and the diver
- Rule 11: the whale and boat are flat shapes with painted soft light. Rules 12 and 13: every shot moves, and scenes join by push and tilt, with no hard cuts

| Area | This clip | Reference |
|---|---|---|
| Whale flank | `#3D3E40` | `#393A3C` (guide) |
| Lock-on background | `#010504` | `#020403` |
| Sea, upper right | `#11252F` | `#06171E` |
| Sea, middle right | `#091B24` | `#05141A` |

### Approximated or invented
- All timing, because there is no narration. Section 1 is 40 s, not the script's 45 s, so that it fits one clip
- The humpback's drawing and its pale throat, flipper and baleen colors. The guide has no humpback
- The map look. Land is `#0C2B3A` with a `#385F6C` coast, both guide colors in a new role. Coastlines are Natural Earth (public domain, from the world-atlas package), clipped by `humpback_doc/tools/make_maps.py`
- Luban's start point and the curve of her track. The notes give neither, so the track is illustrative
- "TRACKING: 25 DEC 2017" and "NOV 2017" reuse the guide's timer as a date readout, using dates from the fact notes
- New wording to check: "ഒമാനിലെ ഗവേഷകരുടെ ടാഗ്" and "പണം കൊടുത്ത് കാണാൻ പോകും" are condensed from the script. A Malayalam reader should check all on-screen text
- `whale_song.wav` is used under "പാട്ടുപാടും". It is synthesized and not a real humpback recording
- No Google Flow PNGs or HyperFrames were needed for this clip. All art is code-drawn, because the whale must swim and open its mouth

### Differences still visible
- The sea is lighter than frame 2b at the points measured, because the whale needs to stand out against it
- Edges are cleaner than the reference, which looks softer and slightly rough
- The surface is one simple wavy line; the reference has broken, tiled glints
- Malayalam titles look rounder than the reference's all-caps Latin titles
- There is no rotating teal line in the lock-on shot, because its meaning is unknown
- Played alone, the clip stops in mid-move, because it is made to continue into clip 2. Its last frames show the Cape Cod map opening inside the mouth

## Cleanup, 2026-11-07
The user approved removing old versions. Sections further down that describe these files are kept as history; the files themselves are no longer in the project.

Sent to the Recycle Bin:
- `whale_doc_full.mp4`, `whale_doc_full_no_camera.mp4` (identical), `whale_doc_first30s.mp4`, `whale_doc_section1.mp4`
- `whale_doc_pieces_v1_hard_cuts/`, `whale_doc/sections/`, `whale_doc/sections.txt`
- `greenland_shark_5s.mp4`, `greenland_shark_5s_3d.mp4`, `storyboard.jpg`, `storyboard_3d.jpg`

Deleted: `shark_5s/node_modules/`. Run `npm install` in `shark_5s/` before rendering the shark video again.

No single-file version of the sperm whale film exists now. The film is the 12 clips in `whale_doc_pieces/`.

## whale_doc_pieces/ (current)
The sperm whale film as 12 separate clips of 30 to 39 seconds with sound: 12,150 frames, 6:45 in all. It has camera moves on every shot, and every scene is connected to the next by the camera. Each clip ends mid-move and the next opens on the very next frame. Clip list and link types: `whale_doc_shotlist.md`. Storyboard: `whale_doc_storyboard.jpg`, one frame per shot from the clips.

The user's workflow is clip by clip, with a full video only when they allow it, so no full video with this camera work exists. All 12 clips were rendered one at a time, in order, with `render_pieces.sh`. To redo clips, from `02_output/whale_doc/`:

    bash render_pieces.sh 3 7

Older versions, removed in the cleanup above:
- `whale_doc_pieces_v1_hard_cuts/`: camera moves within shots, hard cuts between them
- `whale_doc_full.mp4`, identical to `whale_doc_full_no_camera.mp4`: no camera moves
- `whale_doc_section1.mp4`, `whale_doc_first30s.mp4`: earlier cuts of the opening

### Camera
44 shots have a `cam` list in `whale_doc/src/`, using `cam.tsx`. The depth shot in section 4 keeps its own vertical move. All 44 joins between shots have a `link` in `kit.tsx`: `push`, `tilt`, `pan` or `blend`, 20 frames each, centered on the old cut frame. Sounds placed on a cut now land in the middle of the move. Style guide rules 12 and 13 record this as user direction. It departs from the reference on purpose: the reference is mostly hard cuts, with linear pans, vertical moves and slow push-ins. Titles stay pinned to the screen within a shot, and the picture moves as one flat plane with no parallax.

Section 1's fade to near-black is gone, because that scene now connects to the next. The only fade left is at the very end.

### Checked in the clips
- Every clip has the right frame count, 12,150 in all, and its picture and sound are the same length
- All 213 sounds found by matching their waveforms, the worst 1.7 ms from its frame. No clipping; the highest peak is -4.2 dBFS
- Across all 11 joins, the step from a clip's last frame to the next clip's first is no larger than a normal step in the same move (worst ratio 1.05)
- The middle frame of all 44 links was reviewed, plus the push-through moves frame by frame. A fault where the next scene showed a rectangular edge was found and fixed
- Nobody has watched the clips at full speed or listened to them, so how the moves feel is not yet judged

### Differences still visible
- Everything listed for the versions below
- During a pan or tilt, the lighter sea scenes show a straight edge against the dark gap. It is on screen for only a few frames, and it reads as the water's edge on a tilt
- Some moves arrive on a near-empty frame, because the shot's first element has not landed yet. An example is 0:42, before the tiny squid appears
- Played alone, a clip starts and stops in mid-move, because it is made to continue into the next one

## whale_doc_full.mp4 (older version, no camera moves)
The whole Malayalam sperm whale film: all 10 sections and 45 shots. Source: `whale_doc/src/`. Storyboard: `whale_doc_storyboard.jpg`, one frame per shot from the film. Shot list: `whale_doc_shotlist.md`. Brief: `new_scene_brief.md`.

1920 x 1080, 30 fps, 12,150 frames, 6:45, H.264 + AAC. There is no narration, so all timing is estimated from the script's sentences.

`render_all.sh` has since been replaced by `render_pieces.sh`.

Sections render silently into `whale_doc/sections/`. The sound is mixed once across the film, so the drone never restarts at a section break. `S01.mp4` is the video from `whale_doc_section1.mp4`, unchanged.

### Checked in the MP4
- 12,150 frames, 405.0 s of picture and of sound
- All 213 sounds found in the final audio by matching their waveforms, all within 2 ms of their frames
- Drone loop joins measured at all 16 repeats: 14 are clean, and the other two (24 s and 216 s) fall on sound effects, so a click there can only be ruled out by ear
- Peak -4.2 dBFS, -24.0 LUFS, no clipping. This is quiet because the narration is missing, so the mix must be redone with the voice
- Reviewed by sampled frames: one every 9 seconds, plus stills from each shot before rendering. It has not been watched in full motion at speed
- Nobody has listened to it, so nothing here is claimed to match the original's sound

### Matched
Beyond section 1's list below:
- Meter: 13 segments, 8 green, 3 amber, 2 red, rays above it and a mixed-case dB pill (frame 6c)
- Red strike-through that overshoots the text, red selected box and left-aligned list at x 480 (frames 3b to 3d)
- Rotated red stamp (frame 6c), radial dashed lines ending in dark pills (frames 7a to 7c)
- Statistics set against a familiar object, as the guide's rule 7 asks: the bus, and a human brain
- Red for danger and decisions, green for positive readouts (echoes, plankton, the swimmer)

### Approximated or invented
- All timing, shot lengths and shot count. The guide's average shot length is still unknown
- All new drawings: squid, beaks, gut, spermaceti organ, brains, ships, swimmer, beaked whale, click patterns
- Short on-screen phrases are condensed from the script, and a few are new wording: "ആദ്യം, ഇതിന്റെ ഭക്ഷണം", "നൂറ്റാണ്ടുകളുടെ വേട്ട", "രണ്ടും വേട്ടയ്ക്ക് വന്ന കപ്പലുകൾ", "ജീവനോടെ കടലിൽ: ഒരു വലിയ ഗുണം". A Malayalam reader should check them all
- Section 8's whale icons show decline in general. Their numbers are not data
- Amber for the spermaceti oil and rust for the plume reuse guide colors in new roles
- The Essex and Ann Alexander strikes are drawn alike. The ships are generic, not historical likenesses

### Differences still visible
- Everything listed for section 1 below
- Meter scene has one meter; the reference has two
- The new props are simpler than the reference's squid and whale, and the ships and gut have the least soft lighting
- "≈" and "≠" use a system font, so they look thinner than the text around them

### Not done
- No narration or music. The guide describes only a drone and effects
- The script's "confirm before publishing" facts are still unconfirmed

## whale_doc_section1.mp4 (now part of the full film)
Section 1 of the Malayalam sperm whale script (0:00 to 0:35) on its own, with its own drone fade.

1920 x 1080, 30 fps, 1050 frames, 35.0 s, H.264 + AAC. There is no narration yet, so all timing is estimated from the script. Every timing is one number in the `T` table at the top of `whale_doc/src/Section1.tsx`.

To re-render, from `02_output/whale_doc/`:

    npx remotion render src/index.ts Section1 ../whale_doc_section1.mp4 --codec=h264 --crf=16 --audio-codec=aac --audio-bitrate=192k

### Timeline
| Frame | Time | Picture | Sound |
|---|---|---|---|
| 12, 48 | 0.40, 1.60 s | Two small clippings | `ui_pop` |
| 84 | 2.80 s | Main clipping | `thud` |
| 135 | 4.50 s | Red underline on the price | `ui_alert` |
| 210 | 7.00 s | Hard cut to the lump and 19 KG | `thud`, then `ui_pop` at 222 and 252 |
| 276, 300 | 9.20, 10.00 s | Brackets appear, land on the lump | `ui_pop` |
| 400 | 13.33 s | Hard cut to the close-up | `thud`, `ui_pop` at 412 |
| 490, 520, 550 | 16.33-18.33 s | Rings leave the lump, the whale shape looms | `sonar_ping` |
| 600 | 20.00 s | Hard cut to blue water | `thud` |
| 636 | 21.20 s | Brain label | `ui_pop` |
| 720, 736, 752 | 24.00-25.07 s | Sound label, rings from the snout | `ui_pop` at 720, `sonar_ping` on all three |
| 840 | 28.00 s | Hard cut to the title | `thud`, `ui_pop` at 852 and 925 |
| 1015-1049 | 33.83-34.97 s | Fade to near-black | Drone fades out |

`ocean_drone` loops under everything. It is 24 s long, so it repeats once. No music: the guide describes only a drone bed and effects.

### Checked in the MP4
- 1050 frames, 35.0 s. Hard cuts land at frames 210, 400, 600 and 840. The only other jump is the main clipping landing at frame 85
- All 23 sounds found in the final audio by matching their waveforms: the worst is 1.7 ms from its frame
- Peak -5.0 dBFS, -21.4 LUFS, no clipping. It is quieter than the shark clip because it is sparser, and the mix must be redone once narration exists
- Nobody has listened to it yet, so nothing here is claimed to match the original's sound

### Matched
- Scale layout from frames 5a to 5c, rings from 2a, surface and shafts from 2b, brackets shrinking onto the subject from 1a and 1b, dark label pills and dashed lines from 7a to 7c
- 300 ms ease-out entrances, hard cuts, fade to near-black rather than full black (frame 3e)
- Red only for the price underline and brackets. Titles in warm cream, near the top
- Rule 11: the whale, lump and clippings are flat shapes with painted soft light

Colors measured from the MP4 against the frames:

| Area | This video | Reference |
|---|---|---|
| Whale body | `#3C3D41` | `#38393B` |
| Scale background, top | `#081A21` | `#091D26` |
| Scale background, corner | `#020305` | `#000201` |
| Sonar background, upper right | `#0C2027` | `#05151C` |
| Sonar background, middle right | `#09181F` | `#061319` |

### Approximated or invented
These are not in the guide or the frames, so they are choices, not matches:
- All timing, including every entrance and cut, because narration does not exist yet
- Noto Sans Malayalam Black for Malayalam text. All caps cannot apply. Its match to the reference's heavy titles is judged by eye
- Paper color and clipping design, the lump's shape and colors, the table, and the whale's swimming motion
- 30 fps, which is still the guide's working assumption
- The whale is new and faces left, but it uses the guide's side-view colors and is the same species as the reference
- Placing the brain near the eye and starting clicks at the snout is from general knowledge, so confirm both with the script's other facts

### Differences still visible
- Sonar background is lighter than frame 2b at the points measured, and there is no flashlight cone, because this scene has no diver
- The surface is one simple wavy line; the reference has broken, tiled glints
- Edges are cleaner than the reference, which looks softer and slightly rough
- The reference's whale has more visible vertical skin texture
- Malayalam titles look rounder and less blocky than the reference's all-caps Latin titles

## greenland_shark_5s_2d.mp4 (current)
The version the user asked for: 2D illustration with soft, 3D-style lighting on the main subjects (style guide rule 11). Built from the flat version, not the 3D one. Same format, timeline and sound as the first version. Source: `shark_5s/src/`. Storyboard: `storyboard_2d.jpg`.

To re-render, from `02_output/shark_5s/`:

    npx remotion render src/index.ts Shark5s ../greenland_shark_5s_2d.mp4 --codec=h264 --crf=16 --audio-codec=aac --audio-bitrate=192k

### Soft light added to main subjects
- Shark: top highlight, forehead highlight, soft shadow underneath, teal bounce on the belly, soft fin shadow on the flank, gentle gradient on the fin, faint pool of flashlight on the body
- Person icons: the same flat shapes with a soft off-center light on each part

### Back to the reference
Background, cone, rings, dust, text and rule are the flat version's, with no glow or parallax. Shafts and the cone's middle were also toned down toward frame 2b.

### Checked in the MP4
- 150 frames, 5.0 s. One hard cut at frame 63, nothing else jumps
- All 11 sounds within one frame; peak -6.2 dBFS, -18.2 LUFS. Still not listened to

| Area | This video | Reference |
|---|---|---|
| Body, mid | `#333437` | `#393A3C` |
| Scale background, top | `#0A1D25` | `#0B1F28` |
| Scale background, middle | `#08141A` | `#09181F` |
| Sonar background, upper | `#152D39` | `#132F3B` |
| Sonar background, middle | `#0E222C` | `#0E222C` |
| Sonar shaft | `#152D37` | `#11272F` |
| Icon, brightest | `#838990` | `#99A2A9` (elephant) |
| Ghosted icon | `#212427` | `#282C2F` (elephant) |

### Differences still visible
- Body and icons are slightly darker than the reference's whale and elephants
- Light shafts are still slightly brighter than frame 2b
- The items listed for the first version below still apply: simple surface line, cleaner edges, thinner icons, centered rule

## greenland_shark_5s_3d.mp4 (not wanted)
The user rejected this look: it reads as a 3D render. It went further than asked. Its source is kept in `shark_5s/archive_v2_3d/`; copy those two files into `src/` to render it again. Storyboard: `storyboard_3d.jpg`.

### Added
- Shark shaded as a rounded form: an SVG lighting filter uses the silhouette as a height map, under a soft top light
- Teal bounce light on the belly, rim light on the back, the pectoral fin's soft shadow on the flank, a far-side fin, recessed eye and gills
- Tail tapers in perspective and fades into water haze
- Three parallax planes of dust; the near plane passes in front of the shark
- Soft glow behind the shark, soft-edged flashlight cone with a brighter core, glowing lens, glowing rings
- Light shafts blurred and screened, with one in front of the shark
- Slow push-in on the scale shot
- Person icons shaded as solid figures, standing on a soft floor with contact shadows
- Soft shadows and glow on text, rule and underline

### Checked in the MP4
- 150 frames, 5.0 s. One hard cut at frame 63, nothing else jumps
- All 11 sounds still within one frame; peak -6.2 dBFS, -18.2 LUFS. Still not listened to
- No banding in the shading. The first lighting pass had contour lines, fixed by smoothing the light before applying it

### Now further from the reference, on purpose
- Shark body is a little lighter and bluer than the whale: `#3E4348` vs `#393A3C`
- Brightest icon is darker: `#80878C` vs `#99A2A9`. Ghosted icon: `#202326` vs `#282C2F`
- Scale background is slightly bluer in the middle: `#091C27` vs `#09181F`
- Cone and shafts are soft-edged; the reference's are hard-edged. Sonar shafts are brighter: `#193540` vs `#11272F`, measured before the final render
- The reference looks like flat vector art with light effects. This looks closer to soft 3D

The filters give the look of depth; these are still 2D shapes, so the camera can't orbit the shark.

## greenland_shark_5s.mp4
The first, flat version. Its source is kept in `shark_5s/archive_v1_flat/`; copy those two files into `src/` to render it again. Storyboard: `storyboard.jpg`. Brief: `new_scene_brief.md`.

1920 x 1080, 30 fps, 150 frames, 5.0 s, H.264 + AAC.

To re-render, from `02_output/shark_5s/`:

    npx remotion render src/index.ts Shark5s ../greenland_shark_5s.mp4 --codec=h264 --crf=16 --audio-codec=aac --audio-bitrate=192k

### Timeline
| Frame | Time | Picture | Sound |
|---|---|---|---|
| 0 | 0.00 s | Sonar scene opens, ring leaves the shark | `sonar_ping` |
| 24 | 0.80 s | Title snaps in | `ui_pop` |
| 30 | 1.00 s | Second ring | `sonar_ping` |
| 63 | 2.10 s | Hard cut to scale scene, rule starts | `thud` |
| 69 | 2.30 s | "~5 M" | `ui_pop` |
| 81 | 2.70 s | Red caption and underline | `ui_alert` |
| 93, 99, 105, 111 | 3.10-3.70 s | Four person icons | `ui_pop` |
| 120 | 4.00 s | Ghosted fifth icon | `ui_pop` (quieter) |
| 138-149 | 4.60-4.97 s | Fade to near-black | Drone fades out |

`ocean_drone` runs under everything.

### Matched
- Layout of the scale scene, from frame 5c at 1.5x: rule y 600, label y 652, caption y 768, underline y 804, 238 px icon spacing
- Sonar rings: center and the 95 / 325 / 555 px radii from frame 2a
- Flashlight tip position and cone edges, from frame 2b
- 300 ms ease-out entrances, hard cut, fade to near-black rather than full black (frame 3e)
- Red and cream used as the guide's rules describe; the fifth icon is ghosted as the seventh elephant is

Colors measured from the MP4 against the frames:

| Area | This video | Reference |
|---|---|---|
| Body, mid | `#36373A` | `#393A3C` |
| Scale background, top | `#0A1D25` | `#0B1F28` |
| Scale background, middle | `#08141A` | `#09181F` |
| Scale background, corner | `#000304` | `#000201` |
| Sonar background, upper | `#152D39` | `#132F3B` |
| Sonar background, middle | `#112430` | `#0E222C` |
| Icon, brightest | `#8D939A` | `#99A2A9` (elephant) |
| Ghosted icon | `#232629` | `#282C2F` (elephant) |

### Sound check
Measured from the final MP4. All 11 effects start within one frame of their animation: ten within 2 ms, the thud at +15 ms. Peak -6.2 dBFS, loudness -18.2 LUFS, no clipping. Nobody has listened to it yet, so nothing here is claimed to match the original's sound.

### Approximated or invented
These are not in the guide or the frames, so they are choices, not matches:
- Ring speed and spacing over time (only the radii are known)
- Dust drift speed
- The shark's swimming wave and its slow growth in the sonar shot
- The timing of the scale scene's pop-ins
- 30 fps, which is still the guide's working assumption
- Shark colors, borrowed from the side-view whale
- Montserrat Black was picked over Poppins by eye, from one side-by-side still. The guide's open question is narrowed, not closed

### Differences still visible
- Sonar scene: the cone's middle is slightly brighter (`#505050` vs `#474C50`) and light shafts are slightly stronger (`#18303B` vs `#11272F`)
- The surface is one simple wavy line; the reference has broken, tiled glints
- Edges are cleaner than the reference, which looks softer and slightly rough
- Person icons are smaller and thinner than the elephants, so the bottom row carries less visual weight
- The rule and label are centered; in frame 5c they sit about 20 px right of center
- The "≈" falls back to a system font, because the Montserrat subset used doesn't include it. It looks thin like the reference, but could differ on another machine
- The reference's elephants fade darker toward the row's edges more strongly than these icons do

### Unused
`scan_typing.wav` and `ui_check.wav`: nothing in this scene calls for them.

### Licensing
Remotion is free for individuals and small teams. A larger company should check remotion.dev/license before commercial use.
