# Agent prompt — generate Total Life portrait assets with Higgsfield

Copy everything below the line into the agent that holds the Higgsfield login.

---

You are producing photographic and motion assets for three landing pages for **Total Life**, a Medicare-covered
talk-therapy practice for adults 65+. The pages are built; every slot has an exact aspect ratio and filename, and
your files drop straight into them. Use the full Higgsfield model set. Spend credits deliberately: check the price
of each model with the account's own tooling before the first paid call, work in priority order, and never retry
automatically. Read everything before generating.

## 0. Preflight (spend nothing)

```bash
curl -fsSL https://raw.githubusercontent.com/higgsfield-ai/cli/main/install.sh | sh   # or: npm i -g @higgsfield/cli
higgsfield auth login
higgsfield workspace                 # confirm the workspace that will be billed
higgsfield account --json            # record starting balance and plan
higgsfield model list                # record the models available to this account
higgsfield generate --help           # check for a `cost` subcommand
```

Before the first paid generation of each model, get its price for the exact flags you will use: `higgsfield
generate cost ...` if the CLI supports it for `create`, otherwise open the same model and settings in the web UI
and read the credit figure on the Generate button. Record every price in the manifest. Then set the working
budget: **stills first, then motion; pause and report after the stills with credits used and remaining before
starting motion.** Hard cap for the whole job: **160 credits**. If the starting balance is under 200, the cap is
75% of the balance.

Model facts verified against the CLI's `MODELS.md`:
- Image models that support our exact ratios 4:5, 5:4 and 1:1: `gpt_image_2_5`, `gpt_image_2`, `nano_banana_2` (Nano Banana Pro), `nano_banana_flash` (Nano Banana 2), `nano_banana_2_lite`, `cinematic_studio_2_5`, `marketing_studio_image`, `recraft_v4_1`. `text2image_soul_v2` and `soul_cinematic` do **not** offer 4:5 or 5:4.
- `nano_banana_2` is Nano Banana Pro (default `2k`). `nano_banana_flash` is Nano Banana 2 (default `1k`).
- `gpt_image_2_5` defaults to `1k` and `quality low`; `2k` and `high` cost more, `4k` far more. Pass resolution and quality explicitly.
- Video: `kling3_0` supports 16:9, 9:16, 1:1 with `--start-image`, `--end-image`, `--mode std|pro|4k`, `--sound on|off` (default on), integer `--duration`. `seedance_2_0` supports 3:4 and 4:3 with start/end image, `--resolution 480p|720p|1080p|4k`, `--mode std|fast` (fast is 480p/720p only), `--generate_audio` (default true). `cinematic_studio_video_3_5` supports 3:4 and 4:3 with start/end image. `wan2_7` supports 3:4 and 4:3 with start/end image.
- No `--seed` and no negative prompt on any image or video model. Exclusions go in the positive prompt.
- Defaults are cost traps: set `--sound off`, `--generate_audio false`, `--duration 5`, and an explicit `--resolution` on every video call.

Safety rules that hold regardless of price:
- **Never retry automatically.** A stuck or failed job: record the job id, check `higgsfield account --json`, confirm the refund appeared, then decide. One manual retry per slot at most. (A documented agent session lost 792 credits to retry loops.)
- Check the balance before and after every paid call and log the charge.
- If a single charge exceeds its checked price by more than 25%, stop and report.
- Do not buy credit packs or change the plan. Report and stop instead.

## 1. Brand and photographic direction

Total Life feels like "quiet sunlight, warm air, generous space." Photography is documentary, not stock.

- **Subjects:** real-looking older adults (65–80) for members; therapists aged 40–65. Vary ethnicity across the set. Grey hair, reading glasses, natural skin texture and wrinkles are wanted. Expressions thoughtful, calm, gently warm, listening. At most one soft closed-mouth smile per group of three; never teeth-forward grins.
- **Light:** soft directional daylight from a window, gentle falloff, slight film warmth. No studio flash, no HDR, no teal-orange grade, no baked-in vignette (the site adds its own soft radial light).
- **Palette:** cream, oatmeal, sand, soft rust, muted sage, warm grey in walls, furnishings and clothing. No pure white walls, black clothing, or saturated blue, red, purple.
- **Setting:** lived-in homes: a reading chair by a window, a kitchen table with tea, a porch, a sunlit hallway, a home office with books and a plant. Never a hospital, exam room, clinic, or corporate office.
- **Framing:** subject fills roughly the middle 60% of the frame, head in the upper third. Keep the **top 22%** and **bottom 18%** of every frame visually simple; the site overlays caption chips there. Faces centred and away from edges, because video frames will be cropped a few percent to fit.
- **Never include:** text, logos, watermarks, lab coats, stethoscopes, medication, wheelchairs, hospital beds, anyone crying, hands gesturing at camera.
- **Lens feel:** 50mm, shallow but not extreme depth of field, eye-level camera.

## 2. Prompt template for stills

> Documentary portrait photograph of [subject: age, gender presentation, ethnicity], [setting], [light], [pose, expression and gaze]. Wearing [wardrobe in cream, oatmeal, soft rust, or sage]. Natural film warmth, soft window light, shallow depth of field, 50mm lens, eye-level camera, warm neutral palette of cream, sand and soft brown, lived-in home interior, unposed and candid. Subject centred with head in the upper third and simple uncluttered space at the top and bottom of the frame. Photorealistic, natural skin texture, no retouching. No text, no logos, no watermark, no studio lighting, no white background, no hospital or clinic, no lab coat, no medication, no blue color grade, no HDR, no teeth-showing smile.

## 3. The 12 stills

**Model choice.** Price `gpt_image_2_5` (`--resolution 2k --quality high`) and `nano_banana_2` (`--resolution 2k`)
in preflight. Use GPT Image 2.5 for the three Tier A images if it costs no more than 4× Nano Banana Pro per image;
otherwise use Nano Banana Pro for everything. Use Nano Banana Pro at `2k` for Tier B in either case. Generate
3 candidates for each Tier A image and 1 for each Tier B image; regenerate a Tier B image once only if it is
plainly off-brief (clinic, white wall, grin, text), never for taste.

```bash
# Tier A example
higgsfield generate create gpt_image_2_5 --prompt "<filled template>" --aspect_ratio 4:5 --resolution 2k --quality high --wait
# Tier B example
higgsfield generate create nano_banana_2 --prompt "<filled template>" --aspect_ratio 4:5 --resolution 2k --wait
```

Download each result immediately with `curl -L -o <filename> <url>`; result URLs can expire. Deliver JPEG quality 90
or PNG, sRGB, at the generated size. Do not crop to a different ratio.

### Tier A — the images that carry the pages (3 candidates each)

| # | Filename | Ratio | Direction |
|---|---|---|---|
| 1 | `senior-hero.jpg` | 4:5 | Total Life member, 68–75, seated at home in natural window light, three-quarter view, looking slightly off camera as if listening to someone kind. Oatmeal or soft-rust cardigan, a cup of tea or a book nearby, window light on the face. Candid, quietly hopeful. The single most important image. |
| 2 | `check-hero.jpg` | 5:4 | Member in their 70s on a porch or beside a large window, seated, thoughtful, gaze into the middle distance, morning light. Person on the left or right third, soft simple space on the other side. Porch chair, a mug, garden softly out of focus. Pensive, on the edge of deciding something. Not sad. |
| 3 | `founder.jpg` | 1:1 | **Placeholder for Neelam Brar, founder and CEO. Do not attempt her likeness.** A South Asian woman in her 40s, intimate square portrait, warm side light from a window, direct steady kind gaze, cream or sand wall behind. Mark as placeholder in the manifest; a real photograph replaces it before launch. |

### Tier B — therapists (1 candidate each; three visibly different people per page)

| # | Filename | Ratio | Direction |
|---|---|---|---|
| 4 | `senior-therapist-1.jpg` | 4:5 | Therapist, 50s, seated in a warm living-room-style home office, looking at camera, calm and attentive, soft knit top. |
| 5 | `senior-therapist-2.jpg` | 4:5 | Therapist, 40s, home office with books and a plant, soft daylight, gentle closed-mouth smile, at camera. |
| 6 | `senior-therapist-3.jpg` | 4:5 | Therapist, 60s, by a window, relaxed, head slightly tilted, listening, gaze just off camera. |
| 7 | `caregiver-therapist-1.jpg` | 4:5 | Therapist, 50s, seated in a home office, soft expression, at camera. |
| 8 | `caregiver-therapist-2.jpg` | 4:5 | Therapist, 40s–50s, natural window light, thoughtful, looking off-frame left. |
| 9 | `caregiver-therapist-3.jpg` | 4:5 | Therapist, 60s, warm room, candid soft smile, at camera. |
| 10 | `check-therapist-1.jpg` | 4:5 | Therapist, 50s, warm, seated, natural window light, at camera. |
| 11 | `check-therapist-2.jpg` | 4:5 | Therapist, 40s, soft smile, home office, documentary light. |
| 12 | `check-therapist-3.jpg` | 4:5 | Therapist, 60s, listening, calm, soft daylight, gaze just off camera. |

**Checkpoint.** After the stills, report: images delivered, credits spent, credits remaining, and the checked
prices for the video models below. Then proceed to motion unless remaining credits are below the cap minus what
the three clips will cost.

## 4. Motion: three subtle clips

Cinemagraph-style motion for images 1, 2 and 3. The site plays them muted, honours `prefers-reduced-motion`, and
falls back to the still, so still and clip must match.

**Motion direction (all three):** the subject breathes slowly, blinks once or twice, gaze drifts a few degrees and
returns. A curtain or plant leaf may move in a light breeze. Light may shift very slightly. **No** head turns, no
speech, no hand movement toward camera, no camera move larger than a barely perceptible 2% push, no zoom, no pan,
no cuts, no added objects. Subject never leaves frame.

Clip prompt (adapt the subject clause):

> Subtle cinemagraph. The [woman/man] sits almost still, breathing slowly, blinks gently once, gaze drifts a few degrees and returns. Soft window light shifts very slightly. A curtain edge moves in a light breeze. Camera locked off with an extremely slow, barely perceptible push in. Photorealistic, calm, warm, documentary. No talking, no head turn, no hand movement, no camera pan, no cuts, no text.

### Prepare start frames

Video ratios differ from two of the stills. Centre-crop, keeping the face centred:
- `senior-hero.jpg` (4:5) → **3:4** → `senior-hero-3x4.jpg`
- `check-hero.jpg` (5:4) → **4:3** → `check-hero-4x3.jpg`
- `founder.jpg` (1:1) → use as is

The site's frames use `object-fit: cover`, so a 3:4 clip in the 4:5 frame loses about 6% top and bottom and a 4:3
clip in the 5:4 frame loses about 6% left and right. That is why faces stay centred.

### Model choice and commands

Price these in preflight and pick per slot: for 1:1 use `kling3_0`. For 3:4 and 4:3 choose the cheapest of
`seedance_2_0` (std, 720p), `cinematic_studio_video_3_5`, and `wan2_7` that supports start and end image at that
ratio; prefer Seedance 2.0 if prices are close. Use 720p; go to 1080p only if it costs less than 1.5× the 720p price.
Use the same start image as the end image: this is Kling's documented loop technique, and the motion prompt is what
keeps the clip from being static. Duration 5 seconds.

```bash
# Founder, 1:1
higgsfield generate create kling3_0 \
  --prompt "<clip prompt>" --start-image ./founder.jpg --end-image ./founder.jpg \
  --aspect_ratio 1:1 --duration 5 --mode std --sound off --wait

# Senior hero, 3:4
higgsfield generate create seedance_2_0 \
  --prompt "<clip prompt>" --start-image ./senior-hero-3x4.jpg --end-image ./senior-hero-3x4.jpg \
  --aspect_ratio 3:4 --duration 5 --resolution 720p --mode std --generate_audio false --wait

# Check hero, 4:3
higgsfield generate create seedance_2_0 \
  --prompt "<clip prompt>" --start-image ./check-hero-4x3.jpg --end-image ./check-hero-4x3.jpg \
  --aspect_ratio 4:3 --duration 5 --resolution 720p --mode std --generate_audio false --wait
```

Confirm each model's exact `--duration` and `--resolution` enums in `MODELS.md` or `higgsfield model get <id>`
before running. If a clip comes back with almost no motion, one retry is allowed with `--start-image` only (no end
image); the site will play it once and hold the last frame. If a clip comes back with a head turn, camera move, or
added objects, do not retry; deliver the still only for that slot and note it.

Export each clip as **MP4, H.264, audio track stripped**, at the generated resolution, plus its first frame as
`*-poster.jpg`. Filenames: `senior-hero.mp4`, `founder.mp4`, `check-hero.mp4`. Optional, only if credits clearly
remain: a true seamless loop for `founder` using the two-half method (clip 1 from the still with start image only;
clip 2 with start = last frame of clip 1 and end = the still; concatenate), delivered as `founder-loop.mp4`.

## 5. Delivery

```
total-life-assets/
  stills/            the 12 finals, exact filenames above
  alternates/        Tier A runner-ups, named <slot>-alt1.jpg, -alt2.jpg
  motion/            *.mp4, *-poster.jpg
  manifest.json
```

`manifest.json`: plan name, starting and ending balance, the checked price of every model used, and one entry per
generation including failures: `file`, `slot`, `model`, `prompt`, `aspect_ratio`, `resolution_or_duration`,
`job_id`, `credits_charged`, `refunded`, `generated_at`, `notes`. Flag the founder image as a placeholder.

## 6. Acceptance checklist

- [ ] Preflight recorded: plan, balance, workspace, model availability, checked prices
- [ ] Tier A before Tier B; checkpoint report sent before any motion
- [ ] 12 stills, ratios exactly 4:5 / 5:4 / 1:1, verified with an image tool
- [ ] Warm neutral palette, window light, real home, simple top and bottom bands, no text, medical props, or grins
- [ ] Three visibly different therapists per page; founder flagged as placeholder
- [ ] Three clips: MP4, no audio, subtle motion only, subject stays in frame, posters saved; video ratios 3:4 / 1:1 / 4:3
- [ ] Every charge logged; total within cap; no automatic retries
- [ ] Final report: delivered, skipped and why, credits used, credits remaining
