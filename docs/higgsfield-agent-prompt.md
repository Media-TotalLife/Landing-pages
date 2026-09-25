# Agent prompt — generate Total Life portrait assets with Higgsfield (low-credit edition)

Copy everything below the line into the agent that holds the Higgsfield login. This version assumes the account
is on Higgsfield's cheapest paid plan and that credits are scarce. It was rewritten after an adversarial
fact-check of Higgsfield's pricing and CLI; the numbers below are deliberately pessimistic.

---

You are producing photographic assets for three landing pages for **Total Life**, a Medicare-covered talk-therapy
practice for adults 65+. The pages are built; every image slot has an exact aspect ratio and filename, and your
files drop straight into them. **Credits are the scarce resource.** Your job is to deliver the 12 stills within a
hard budget, and one optional motion clip only if the budget clearly allows. Read everything before generating.

## 0. Budget rules (non-negotiable)

- **Hard cap: 80 credits total** for this whole job. If the account has fewer than 110 credits at the start,
  the cap becomes 65% of the balance. Stop and report the moment the cap is reached, even mid-task.
- **Reserve:** never let the balance drop below 30% of what it was when you started. Stuck jobs are not always
  refunded, and retries are where budgets die (a documented case burned 792 credits in one agent session).
- **Never retry automatically.** If a job fails or sits in "waiting" for more than 10 minutes, record the job id,
  check the balance, and move on. One manual retry per slot at most, and only after confirming the balance.
- **Check the balance before and after every generation:** `higgsfield account --json`. Log each charge in the
  manifest. If any single generation costs more than the estimate in the table below by more than 50%, stop
  and report before continuing.
- **Pass every cost-affecting flag explicitly.** Defaults are traps: Kling defaults to `--sound on`, GPT Image and
  the Nano Banana Pro id default to `2k`, Seedance defaults to `--generate_audio true`. Duration is an unclamped
  integer, so a typo can multiply the cost.
- **Do not upgrade the plan or buy a credit pack.** If a required model is not available on this plan, report it
  and stop that part of the job. The decision to spend more money is the owner's, not yours.

## 1. Preflight (do this first, spend nothing)

```bash
curl -fsSL https://raw.githubusercontent.com/higgsfield-ai/cli/main/install.sh | sh   # or: npm i -g @higgsfield/cli
higgsfield auth login
higgsfield workspace                 # confirm which workspace will be billed
higgsfield account --json            # record starting balance and plan
higgsfield model list                # record which models THIS account can use
higgsfield generate --help           # look for a `cost` subcommand
```

Record in the manifest: plan name, starting credits, and whether each of these models is listed for this account:
`nano_banana_flash`, `nano_banana_2_lite`, `nano_banana_2`, `gpt_image_2_5`, `text2image_soul_v2`, `kling3_0`.

Facts about model ids you must not get wrong (verified against the CLI's `MODELS.md`):
- `nano_banana_2` is **Nano Banana Pro**, default resolution `2k`. It is not the cheap model.
- `nano_banana_flash` is **Nano Banana 2** (default `1k`). `nano_banana_2_lite` is Nano Banana 2 Lite (`1k` only). These are the cheap path.
- `text2image_soul_v2` (Soul 2) does **not** support 4:5 or 5:4. Do not use it for finals.
- `gpt_image_2_5` supports our ratios but is the most expensive image model (48 credits per 4K image has been reported). Do not use it.
- `kling3_0` supports only 16:9, 9:16, 1:1; flags are `--mode std|pro|4k`, `--sound on|off`, `--duration <int>`, `--start-image`, `--end-image`. There is no seed and no negative prompt on any image or video model.
- `MODELS.md` has no price column. If `higgsfield generate cost` works for `create`, use it before every paid call. If it doesn't, the web UI's Generate button shows the exact cost for the same model and settings; check there once per model before spending.

## 2. Brand and photographic direction

Total Life feels like "quiet sunlight, warm air, generous space." Photography is documentary, not stock.

- **Subjects:** real-looking older adults (65–80) for members; therapists aged 40–65. Vary ethnicity across the set. Grey hair, reading glasses, natural skin texture and wrinkles are wanted. Expressions thoughtful, calm, gently warm, listening. At most one soft closed-mouth smile per group of three; never teeth-forward grins.
- **Light:** soft directional daylight from a window, gentle falloff, slight film warmth. No studio flash, no HDR, no teal-orange grade, no baked-in vignette.
- **Palette:** cream, oatmeal, sand, soft rust, muted sage, warm grey. No pure white walls, black clothing, or saturated blue, red, purple.
- **Setting:** lived-in homes: reading chair by a window, kitchen table with tea, porch, sunlit hallway, home office with books and a plant. Never a hospital, exam room, clinic, or corporate office.
- **Framing:** subject fills roughly the middle 60% of the frame, head in the upper third. Keep the **top 22%** and **bottom 18%** visually simple; the site overlays caption chips there.
- **Never include:** text, logos, watermarks, lab coats, stethoscopes, medication, wheelchairs, hospital beds, anyone crying, hands gesturing at camera.

## 3. Prompt template

> Documentary portrait photograph of [subject: age, gender presentation, ethnicity], [setting], [light], [pose, expression and gaze]. Wearing [wardrobe in cream, oatmeal, soft rust, or sage]. Natural film warmth, soft window light, shallow depth of field, 50mm lens, eye-level camera, warm neutral palette of cream, sand and soft brown, lived-in home interior, unposed and candid. Subject centred with head in the upper third and simple uncluttered space at the top and bottom of the frame. Photorealistic, natural skin texture, no retouching. No text, no logos, no watermark, no studio lighting, no white background, no hospital or clinic, no lab coat, no medication, no blue color grade, no HDR, no teeth-showing smile.

## 4. The 12 stills, in priority order

Two tiers. Tier A is the three images that carry the pages; generate 2 candidates each at higher resolution.
Tier B is the nine therapist portraits; one candidate each at `1k`. Work strictly in this order so that if the
budget runs out, the most important images exist.

**Commands**

```bash
# Tier A (heroes + founder): Nano Banana Pro at 2k. Estimated 2 credits each.
higgsfield generate create nano_banana_2 --prompt "<filled template>" --aspect_ratio 4:5 --resolution 2k --wait

# Tier B (therapists): Nano Banana 2 at 1k. Estimated 1–2 credits each.
higgsfield generate create nano_banana_flash --prompt "<filled template>" --aspect_ratio 4:5 --resolution 1k --wait
# If nano_banana_flash is not listed for this account, use nano_banana_2_lite with the same flags.
# If neither is listed, use nano_banana_2 --resolution 1k.
```

Download each result immediately: `curl -L -o <filename> <url>`. URLs may expire.

| Order | Filename | Ratio | Model / res | Candidates | Est. credits | Direction |
|---|---|---|---|---|---|---|
| 1 | `senior-hero.jpg` | 4:5 | nano_banana_2 / 2k | 2 | 4 | Total Life member, 68–75, seated at home in natural window light, three-quarter view, looking slightly off camera as if listening to someone kind. Oatmeal or soft-rust cardigan, a cup of tea or a book nearby, window light on the face. Candid, quietly hopeful. |
| 2 | `check-hero.jpg` | 5:4 | nano_banana_2 / 2k | 2 | 4 | Member in their 70s on a porch or beside a large window, seated, thoughtful, gaze into the middle distance, morning light. Person on the left or right third, soft simple space on the other side. A porch chair, a mug, garden softly out of focus. Pensive, deciding something. Not sad. |
| 3 | `founder.jpg` | 1:1 | nano_banana_2 / 2k | 2 | 4 | **Placeholder for Neelam Brar, founder and CEO. Do not attempt her likeness.** A South Asian woman in her 40s, intimate square portrait, warm side light from a window, direct steady kind gaze, cream or sand wall. Mark as placeholder in the manifest; a real photograph replaces it before launch. |
| 4 | `senior-therapist-1.jpg` | 4:5 | nano_banana_flash / 1k | 1 | 2 | Therapist, 50s, seated in a warm living-room-style home office, looking at camera, calm and attentive, soft knit top. |
| 5 | `senior-therapist-2.jpg` | 4:5 | same | 1 | 2 | Therapist, 40s, home office with books and a plant, soft daylight, gentle closed-mouth smile, at camera. |
| 6 | `senior-therapist-3.jpg` | 4:5 | same | 1 | 2 | Therapist, 60s, by a window, relaxed, head slightly tilted, listening, gaze just off camera. |
| 7 | `caregiver-therapist-1.jpg` | 4:5 | same | 1 | 2 | Therapist, 50s, seated in a home office, soft expression, at camera. |
| 8 | `caregiver-therapist-2.jpg` | 4:5 | same | 1 | 2 | Therapist, 40s–50s, natural window light, thoughtful, looking off-frame left. |
| 9 | `caregiver-therapist-3.jpg` | 4:5 | same | 1 | 2 | Therapist, 60s, warm room, candid soft smile, at camera. |
| 10 | `check-therapist-1.jpg` | 4:5 | same | 1 | 2 | Therapist, 50s, warm, seated, natural window light, at camera. |
| 11 | `check-therapist-2.jpg` | 4:5 | same | 1 | 2 | Therapist, 40s, soft smile, home office, documentary light. |
| 12 | `check-therapist-3.jpg` | 4:5 | same | 1 | 2 | Therapist, 60s, listening, calm, soft daylight, gaze just off camera. |

**Estimated total for stills: about 30 credits** (pessimistic: 40). Within each page the three therapists must be
visibly different people. A `1k` 4:5 image is about 820×1024; that is enough for the therapist frames, which
display at under 400px wide. Do not upscale.

If a Tier B image comes back clearly off-brief (clinic, white wall, grin, text), you may regenerate it once.
Never regenerate for taste alone.

## 5. Optional motion: one clip, only if the budget allows

Motion is a nice-to-have. Do it only when **all** of these are true after the stills are done:
- `kling3_0` appears in `higgsfield model list` for this account;
- the remaining balance is at least 45 credits above the reserve;
- a cost check (CLI `cost` or the web UI) shows the clip at 15 credits or less.

Generate exactly one clip, the founder (1:1 is the only one of our frames Kling supports):

```bash
higgsfield generate create kling3_0 \
  --prompt "Subtle cinemagraph. The woman sits almost still, breathing slowly, blinks gently once, gaze drifts a few degrees and returns. Soft window light shifts very slightly. Camera locked off. Photorealistic, calm, warm, documentary. No talking, no head turn, no hand movement, no camera pan, no cuts, no text." \
  --start-image ./founder.jpg --end-image ./founder.jpg \
  --aspect_ratio 1:1 --duration 5 --mode std --sound off --wait
```

Estimated 12.5 credits (optimistic 7). Same start and end frame is Kling's documented loop technique; the motion
prompt is what keeps it from being static. Deliver as `founder.mp4` (H.264, strip audio) plus `founder-poster.jpg`
(first frame). **Do not** generate hero motion: our hero frames are 4:5 and 5:4, Kling cannot produce those, and
the models that can (Seedance 2.0, Cinema Studio) cost 17–45 credits per clip and are often locked below the mid
plan. **Do not** use Seedance or Cinema Studio at all on this job.

## 6. Delivery

```
total-life-assets/
  stills/            the 12 finals, exact filenames above
  alternates/        the runner-up Tier A candidates, named <slot>-alt1.jpg
  motion/            founder.mp4 and founder-poster.jpg, if produced
  manifest.json
```

`manifest.json` must contain: plan name, starting balance, ending balance, and one entry per generation (including
failures) with `file`, `slot`, `model`, `prompt`, `aspect_ratio`, `resolution_or_duration`, `job_id`,
`credits_charged`, `refunded` (true/false/unknown), `generated_at`, `notes`. Mark the founder image as a placeholder.

## 7. Stop conditions and reporting

Stop immediately and report if: the cap is hit; a single charge exceeds its estimate by more than 50%; a job is
stuck for 10 minutes and no refund appears; a required model is not listed for the account; or `higgsfield
workspace` shows a workspace you did not expect. In the report, state what was delivered, what was skipped and
why, credits used, and credits remaining. Do not spend to "finish" a tier once a stop condition has fired.

## 8. Acceptance checklist

- [ ] Preflight recorded: plan, starting credits, model availability, workspace
- [ ] Tier A first, Tier B second, motion last and only if the conditions in section 5 held
- [ ] 12 stills present, ratios exactly 4:5 / 5:4 / 1:1 (verify with an image tool)
- [ ] Warm neutral palette, window light, real home; top and bottom bands simple; no text, medical props, or grins
- [ ] Three visibly different therapists per page
- [ ] Founder image marked as placeholder
- [ ] Every charge logged; total within the cap; reserve intact
- [ ] No automatic retries occurred
