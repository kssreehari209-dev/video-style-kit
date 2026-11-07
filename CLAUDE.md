# Instructions for Claude

This folder exists to reproduce the animation style of a reference video.

## Before making anything

1. Read `01_analysis/style_guide.md`. If it does not exist, say so and ask the user to run the Gemini step from `README.md`.
2. Look at `00_reference/frames/screenshots_contact_sheet.jpg` (and `contact_sheet.jpg` if it exists), then open individual frames in `00_reference/frames/` for any element you are about to build. File names carry the video timestamp (for example `..._0620` is 06:20).
   When a text description and a frame disagree, the frame wins. Text analyses from AI tools have been wrong about this video before; the style guide lists the corrections.
3. Read `02_output/new_scene_brief.md` if present.

## Rules

- The style guide is the source of truth. If it conflicts with your own taste, follow the guide.
- Reuse exact values from the guide: hex colors, font names, durations, easing curves, frame rate, aspect ratio.
- Do not invent style details that are not in the guide or visible in the frames. List any gaps as open questions.
- Do not copy characters, logos or artwork from the reference. Reproduce the *style* (line, color, motion, composition) with original content.
- Match: palette, line weight and texture, shading, character proportions, camera moves, transition types, timing and easing, pacing, sound mood.

## Sound

- Sound effects are synthesized by `scripts/generate_sfx.py` into `02_output/audio/`. Read `02_output/audio/SFX_MAP.md` for which file goes where.
- To change a sound, edit its function in the script and re-run it. Do not claim a sound "matches the original" unless the user has listened and confirmed.
- Start each effect on the exact frame where its animation starts. With hard cuts, put the sound on the cut frame.

## Output

- Put finished work in `02_output/`.
- After building, compare against the reference frames and list differences you can still see.
- Keep a short `02_output/CHANGELOG.md` of what you matched and what you approximated.
