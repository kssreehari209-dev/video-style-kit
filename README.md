# Video Style Replication Kit

Goal: take a reference animation video, turn its look and motion into a written **style guide**, then have Claude (or a video generator) reproduce that style in new work.

## Why this works in two steps

Claude cannot watch video files directly. Gemini can. So the workflow is:

1. **Gemini** (or you, manually) watches the video and writes a detailed style guide.
2. **Claude** reads that guide plus still frames from the video and builds new animation in the same style.

## Folder layout

```
00_reference/        Put your reference video here (reference.mp4)
  frames/            Extracted still frames land here
01_analysis/
  gemini_analysis_prompt.md   Paste this into Gemini with your video
  style_guide_TEMPLATE.md     Copy to style_guide.md and fill in
02_output/
  new_scene_brief_TEMPLATE.md Describe the new scene you want
scripts/
  extract_frames.sh           Pulls frames + a contact sheet with ffmpeg
  sample_colors.py            Reads real hex codes from the frames (needs Pillow)
  generate_sfx.py             Synthesizes the sound effects with code (needs numpy)
02_output/audio/              Generated WAV files and SFX_MAP.md (what to use where)
CLAUDE.md            Standing instructions Claude follows in this folder
```

## Steps

1. Copy your video to `00_reference/reference.mp4`.
2. Run `bash scripts/extract_frames.sh` (needs ffmpeg). This makes frames and `contact_sheet.jpg`.
3. Open Gemini (Google AI Studio or the Gemini app), upload the video, paste `01_analysis/gemini_analysis_prompt.md`.
4. Save Gemini's answer as `01_analysis/style_guide.md`.
   Then run `python3 scripts/sample_colors.py` to check the hex codes against the real frames (needs Pillow). AI-estimated colors are often a few shades off.
   Sound effects need no recording: `python3 scripts/generate_sfx.py` writes drone, sonar ping, UI sounds, typing and thud WAVs. Listen to them and ask Claude to adjust any parameter.
5. Open this folder in Claude. Claude reads `CLAUDE.md`, the style guide and the frames.
6. Fill in `02_output/new_scene_brief_TEMPLATE.md` and ask Claude to build the scene.

## Trust the frames over text descriptions

AI video analysis can be confidently wrong. In this project Gemini's text called the characters flat, the brackets green and the bus the same width as the whale; the screenshots showed otherwise. Keep screenshots of every key scene in `00_reference/frames/` (name them with the timestamp) and let Claude check its work against them.

## Be realistic about "exact"

Matching a style closely is achievable. Matching it pixel for pixel is not guaranteed, because the original may use proprietary tools, custom brushes or hand-drawn frames. The more frames and the more precise the style guide, the closer the result.

If you want a generated video (not code-built animation), use a video model that accepts a reference image or clip (Runway, Kling, Luma, Pika) and feed it the frames plus the style guide as the prompt.
