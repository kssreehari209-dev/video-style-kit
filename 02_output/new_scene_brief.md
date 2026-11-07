# New Scene Brief

Earlier briefs are kept in `new_scene_brief_shark.md` and `new_scene_brief_whale.md`.

## What to make
- Topic / story: മുപ്പത് ടൺ സൗമ്യത, the story of the humpback whale, opened and closed by Luban, the tagged whale that reached the Kerala coast
- Length: 12 to 13 minutes in 12 sections
- Aspect ratio: 16:9, 1920 x 1080
- Output format: MP4 with sound, delivered as separate clips of 30 to 40 seconds in `humpback_doc_pieces/`

## Decisions
- Build order: clip 1 first so the new look can be approved, then each clip in order. No full video until the user allows it
- Voiceover: none yet, as on the sperm whale film. All timing is estimated from the script and must be re-timed when narration exists
- On-screen text: Malayalam titles and captions, with numbers and units in the guide's English style (`~50 KM`, `1,500+ KM`, `30 TONNES`)
- PNGs: the user allows Google Flow for any PNG the film needs, and HyperFrames if useful. Subjects that must animate stay as code-drawn vector shapes unless they look weak against the frames

## Content
- Script: `humpback_doc_script.md`, with the user's fact notes
- Characters and objects, all drawn new: humpback whale, diver, tourist boat and more per the shot list
- The script's "confirm before publishing" facts are still unconfirmed

## Style rules
Follow `01_analysis/style_guide.md`. Anything this brief changes on purpose:
- Titles are Malayalam, so the all-caps rule cannot apply. They use Noto Sans Malayalam Black in the same color, size and position. Latin numbers and units stay in Montserrat Black
- The humpback has no guide colors of its own. Its back uses the side-view whale colors and its pale parts use the guide's greys and creams. These are listed as invented in the changelog
- Maps have no reference frame. They are built from the guide's background and shaft colors, sonar rings, pills, brackets and timer
- The bus and elephants are in the script (section 3), so here they are the film's own KSRTC bus and tusker drawings, not copies of the reference's

## Deliverables
- `humpback_doc_shotlist.md`
- Clips in `humpback_doc_pieces/`
- A changelog note on what matches the reference and what is approximated
