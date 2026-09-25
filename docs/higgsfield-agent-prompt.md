# Agent prompt — generate Total Life portrait assets with Higgsfield

Copy everything below the line into the agent that holds the Higgsfield key.

---

You are producing photographic and motion assets for three landing pages for **Total Life**, a Medicare-covered
talk-therapy practice for adults 65+. The pages are already built; every image slot has an exact size and aspect
ratio, and your files will be dropped straight into them. Precision on ratios and filenames matters more than
creativity. Read this entire brief before generating anything, then work through the checklist at the end.

## 0. Tooling and constraints (verified against the Higgsfield CLI model reference)

Use the **Higgsfield CLI** (`higgsfield`), or the Higgsfield MCP if that is what you have. Install and authenticate:

```bash
curl -fsSL https://raw.githubusercontent.com/higgsfield-ai/cli/main/install.sh | sh   # or: npm i -g @higgsfield/cli
higgsfield auth login
higgsfield account        # confirm credits before starting
```

Model choices are fixed by what supports our ratios. Do not substitute without checking `MODELS.md` in the CLI repo.

| Job | Model | Why |
|---|---|---|
| All 12 still images | `gpt_image_2_5` (first choice) or `nano_banana_2` (fallback) | Both support the exact `4:5`, `5:4`, and `1:1` ratios we need, at `2k` resolution. **Do not use `text2image_soul_v2` or `soul_cinematic` for finals**: Soul supports 3:4 and 4:3 but not 4:5 or 5:4, so its output would be cropped by the site. |
| Founder motion (1:1) | `kling3_0` with `--start-image` and `--end-image`, `--mode pro`, `--sound off` | Kling 3.0 supports 1:1 and start/end frames. |
| Senior hero motion (portrait) | `seedance_2_0` or `cinematic_studio_video_3_5` at `--aspect_ratio 3:4` with start/end image | Kling 3.0 does **not** support 3:4 or 4:5. Seedance and Cinematic Studio do. |
| Check hero motion (landscape) | `seedance_2_0` or `cinematic_studio_video_3_5` at `--aspect_ratio 4:3` with start/end image | Same reason. 4:3 is the closest supported ratio to our 5:4 frame. |

Known limits to plan around:
- **No seed parameter** on the image or video models, so runs are not reproducible. Generate 3 to 4 candidates per slot and pick the best; keep the runner-up.
- **No negative-prompt field.** Put exclusions into the positive prompt as "no …" clauses (they are already in the prompt template below).
- **Video aspect ratios are limited.** Our frames are 4:5, 1:1, and 5:4. Video will be delivered at 3:4, 1:1, and 4:3. The site's frames use `object-fit: cover`, so a 3:4 clip in a 4:5 frame loses about 6% at top and bottom, and a 4:3 clip in a 5:4 frame loses about 6% at left and right. Keep faces centred and away from edges so this crop is harmless.
- **Identical start and end frames often produce almost no motion.** See the loop technique in section 4.
- Always pass `--wait`. Outputs come back as URLs; download each with `curl -L -o <filename> <url>` immediately, since URLs may expire.

## 1. Brand and photographic direction

Total Life feels like "quiet sunlight, warm air, generous space." Photography is **documentary, not stock**.

- **Subjects:** real-looking older adults (65–80) for members; therapists aged 40–65. Diverse ethnicities across the set. Grey hair, reading glasses, natural skin texture and wrinkles are wanted. Expressions are thoughtful, calm, gently warm, listening. At most one soft closed-mouth smile per group of three; never teeth-forward grins.
- **Light:** soft directional daylight from a window, gentle shadow falloff, slight film warmth. No studio flash, no HDR, no cinematic teal-orange grade, no baked-in vignette (the site adds its own soft radial light overlay).
- **Palette:** cream, oatmeal, sand, soft rust, muted sage, warm grey in walls, furnishings and clothing. No pure white walls, no black clothing, no saturated blue, red, or purple.
- **Setting:** lived-in homes. A reading chair by a window, a kitchen table with tea, a porch, a sunlit hallway, a home office with books and a plant. Tidy but real. **Never** a hospital, exam room, clinic, or corporate office.
- **Framing:** subject occupies roughly the middle 60% of the frame, head in the upper third, room around them. Keep the **top 22%** and **bottom 18%** of every frame visually simple (wall, soft bokeh), because the site overlays a caption chip top-left and, on some frames, a caption at the bottom.
- **Never include:** text, logos, watermarks, brand marks, lab coats, stethoscopes, medication or pill bottles, wheelchairs, hospital beds, anyone crying, hands gesturing at camera.
- **Lens feel:** 50mm, shallow but not extreme depth of field, eye-level camera.

## 2. Prompt template

Use this structure for every still. Fill the bracketed parts from the table in section 3. Keep the closing clauses verbatim.

> Documentary portrait photograph of [subject: age, gender presentation, ethnicity varied across set], [setting], [light], [pose, expression and gaze]. Wearing [wardrobe in cream, oatmeal, soft rust, or sage]. Natural film warmth, soft window light, shallow depth of field, 50mm lens, eye-level camera, warm neutral palette of cream, sand and soft brown, lived-in home interior, unposed and candid. Subject centred with head in the upper third and simple uncluttered space at the top and bottom of the frame. Photorealistic, natural skin texture, no retouching. No text, no logos, no watermark, no studio lighting, no white background, no hospital or clinic, no lab coat, no medication, no blue color grade, no HDR, no teeth-showing smile.

CLI pattern for a still:

```bash
higgsfield generate create gpt_image_2_5 \
  --prompt "<filled template>" \
  --aspect_ratio 4:5 --resolution 2k --quality high --wait
```

## 3. The 12 stills

Deliver as JPEG quality 90 (or PNG), sRGB. Minimum sizes are listed; `2k` output exceeds them, which is fine. Do **not** crop to a different ratio afterward.

### Senior page — warm, empowering, hopeful

| # | Filename | Ratio | Min px | Direction |
|---|---|---|---|---|
| 1 | `senior-hero.jpg` | 4:5 | 1200×1500 | Total Life member, 68–75, seated at home in natural window light, three-quarter view, looking slightly off camera as if listening to someone kind. Oatmeal or soft-rust cardigan. A cup of tea or a book nearby. Window light on the face. Candid, quietly hopeful. **Most important image in the set; generate at least 4 candidates.** |
| 2 | `senior-therapist-1.jpg` | 4:5 | 900×1125 | Therapist, 50s, seated in a warm living-room-style home office, looking directly at camera, calm and attentive. Soft knit top. |
| 3 | `senior-therapist-2.jpg` | 4:5 | 900×1125 | Therapist, 40s, home office with books and a plant, soft daylight, gentle closed-mouth smile, looking at camera. |
| 4 | `senior-therapist-3.jpg` | 4:5 | 900×1125 | Therapist, 60s, seated by a window, relaxed, head slightly tilted, listening, gaze just off camera. |

### Caregiver page — founder-led, daughter to daughter

| # | Filename | Ratio | Min px | Direction |
|---|---|---|---|---|
| 5 | `founder.jpg` | 1:1 | 1200×1200 | **Placeholder for Neelam Brar, founder and CEO. Do not attempt her likeness.** A South Asian woman in her 40s, intimate square portrait, warm side light from a window, looking directly at camera with a steady, kind expression. Cream or sand wall behind. Label this file as a placeholder in the manifest; a real photograph must replace it before launch. |
| 6 | `caregiver-therapist-1.jpg` | 4:5 | 900×1125 | Therapist, 50s, seated in a home office, soft expression, looking at camera. |
| 7 | `caregiver-therapist-2.jpg` | 4:5 | 900×1125 | Therapist, 40s–50s, natural window light, thoughtful, looking off-frame to the left. |
| 8 | `caregiver-therapist-3.jpg` | 4:5 | 900×1125 | Therapist, 60s, warm room, a candid soft smile, looking at camera. |

### Self-check page — reflective, gentle reframe

| # | Filename | Ratio | Min px | Direction |
|---|---|---|---|---|
| 9 | `check-hero.jpg` | 5:4 | 1500×1200 | Total Life member in their 70s on a porch or beside a large window, seated, thoughtful, gaze into the middle distance, morning light. Person on the left or right third, soft simple space on the other side. A porch chair, a mug, a garden or street softly out of focus. Pensive, on the edge of deciding something. Not sad. **Generate at least 4 candidates.** |
| 10 | `check-therapist-1.jpg` | 4:5 | 900×1125 | Therapist, 50s, warm, seated, natural window light, looking at camera. |
| 11 | `check-therapist-2.jpg` | 4:5 | 900×1125 | Therapist, 40s, soft smile, home office, documentary light. |
| 12 | `check-therapist-3.jpg` | 4:5 | 900×1125 | Therapist, 60s, listening, calm, soft daylight, gaze just off camera. |

Within any one page the three therapists must be visibly different people (age, ethnicity, hair, setting). Across pages they may repeat or differ.

## 4. Motion (three clips only)

Produce subtle cinemagraph-style motion for images **1, 5, and 9** only. The site plays these muted, respects
`prefers-reduced-motion`, and falls back to the still, so the still and the clip must match.

**Motion direction (same for all three):** the subject breathes slowly, blinks once or twice, and shifts weight or
gaze by a few degrees at most. A curtain or plant leaf may move in a light breeze. Light may shift very slightly as
if a cloud passes. **No** head turns, no speech, no hand movement toward camera, no camera movement larger than a
2% slow push, no zoom, no pan, no cuts, no added objects. The subject never leaves the frame.

Prompt for the clip (adapt the subject clause to the still):

> Subtle cinemagraph. The [woman/man] sits almost still, breathing slowly, blinks gently once, gaze drifts a few degrees and returns. Soft window light shifts very slightly. A curtain edge moves in a light breeze. Camera locked off with an extremely slow, barely perceptible push in. Photorealistic, calm, warm, documentary. No talking, no head turn, no hand movement, no camera pan, no cuts, no text.

### Prepare start frames

Video ratios differ from the stills, so make a video-ratio crop of each chosen still first (centre crop, keep the face centred):

- `senior-hero.jpg` (4:5) → centre-crop to **3:4** → `senior-hero-3x4.jpg`
- `founder.jpg` (1:1) → use as is
- `check-hero.jpg` (5:4) → centre-crop to **4:3** → `check-hero-4x3.jpg`

### Generate

```bash
# Founder, 1:1, Kling 3.0
higgsfield generate create kling3_0 \
  --prompt "<clip prompt>" \
  --start-image ./founder.jpg --end-image ./founder.jpg \
  --aspect_ratio 1:1 --duration 5 --mode pro --sound off --wait

# Senior hero, 3:4, Seedance 2.0 (or cinematic_studio_video_3_5 with the same flags)
higgsfield generate create seedance_2_0 \
  --prompt "<clip prompt>" \
  --start-image ./senior-hero-3x4.jpg --end-image ./senior-hero-3x4.jpg \
  --aspect_ratio 3:4 --wait

# Check hero, 4:3
higgsfield generate create seedance_2_0 \
  --prompt "<clip prompt>" \
  --start-image ./check-hero-4x3.jpg --end-image ./check-hero-4x3.jpg \
  --aspect_ratio 4:3 --wait
```

Check `MODELS.md` for each model's exact `--duration` and `--resolution` enums before running; use the longest
duration the model allows up to 10 seconds, and 1080p or the highest available.

### Loop strategy (deliver A; attempt B)

- **A, required:** one clip of 5–10 seconds with the start image as `--start-image` and the same image as `--end-image`. If the model returns near-zero motion (a common failure when start and end are identical), rerun with only `--start-image` and accept a clip that ends slightly away from the still. The site will play it once and hold the last frame, which is acceptable.
- **B, if credits allow:** a true seamless loop using the two-half method. Generate clip 1 from the still with only `--start-image`. Extract its last frame. Generate clip 2 with `--start-image` = that last frame and `--end-image` = the original still. Concatenate 1 then 2. The seam lands exactly on the still, so the loop is invisible. Deliver as `*-loop.mp4`.

Export every clip as **MP4, H.264, no audio track**, at the generated resolution. Filenames: `senior-hero.mp4`, `founder.mp4`, `check-hero.mp4` (and `-loop.mp4` variants if B succeeds). Also save the first frame of each delivered clip as `*-poster.jpg` so the site can show it before playback.

## 5. Delivery

Put everything in one folder named `total-life-assets/`:

```
total-life-assets/
  stills/            the 12 final JPEGs, exact filenames above
  alternates/        runner-up candidates, named <slot>-alt1.jpg, -alt2.jpg …
  motion/            senior-hero.mp4, founder.mp4, check-hero.mp4, optional *-loop.mp4, *-poster.jpg
  manifest.json      one entry per delivered file
```

`manifest.json` entries must include: `file`, `slot` (the # from the tables), `model`, `prompt` (the exact text sent),
`aspect_ratio`, `resolution_or_duration`, `job_id`, `generated_at`, and `notes` (e.g. "founder placeholder, replace with real photo",
"loop attempt produced no motion, delivered start-only clip").

## 6. Acceptance checklist (run before you hand off)

- [ ] 12 stills present with exact filenames; ratios are exactly 4:5, 1:1, or 5:4 as specified, verified with an image tool, not by eye
- [ ] Every still: warm neutral palette, window light, real home, no clinic or studio look, no blue grade
- [ ] Top 22% and bottom 18% of each frame are visually simple; faces are centred and not near edges
- [ ] No text, logos, medical props, teeth-forward smiles, or anyone distressed
- [ ] Three visibly different therapists within each page
- [ ] Founder image flagged as placeholder in the manifest
- [ ] Three clips: MP4, H.264, no audio, subtle motion only, subject stays in frame, poster frames saved
- [ ] Video ratios are 3:4, 1:1, 4:3 respectively; faces centred so the site's 6% crop is harmless
- [ ] `manifest.json` complete, including the exact prompts used
- [ ] `higgsfield account` run at the end and remaining credits noted in the manifest

When done, hand the `total-life-assets/` folder back. Nothing in the site needs to change to receive it; the developer will wire the files into the existing frames.
