# Image generation brief — Total Life landing pages

For: an image-generation model or operator (GPT Image, Higgsfield, or similar) producing the portrait
assets for the three landing pages in this repository. Read this whole file before generating anything.
Deliver files into `assets/img/people/` using the exact filenames below; the frames in the HTML are
already sized and styled to receive them.

## The brand in one paragraph

Total Life is a Medicare-covered talk-therapy practice for adults 65+. The brand feels like "quiet sunlight,
warm air, generous space." Photography is **documentary, not stock**: real-looking older adults and clinicians,
candid expressions, natural window light, homes not clinics. No posed grins, no white coats, no stethoscopes,
no lab-white rooms, no blue-tinted "healthcare" look. Warm neutrals dominate: cream, sand, soft brown, muted
coral accents in clothing or furnishings are welcome. Skin tones must render naturally and warmly.

## Global rules for every image

- **Style:** photorealistic documentary portrait. 35mm or 50mm feel, shallow but not extreme depth of field,
  soft directional daylight from a window, gentle shadow falloff. Slight film warmth. No HDR, no heavy retouching,
  no cinematic teal-orange grade, no vignettes baked in (the site adds its own soft radial light overlay).
- **Palette:** background and wardrobe in cream, oatmeal, sand, soft rust, muted sage, warm grey. Avoid pure
  white walls, black clothing, saturated blues, reds, or purples.
- **Setting:** lived-in homes. A reading chair by a window, a kitchen table with tea, a porch, a sunlit hallway,
  a home office with books and a plant. Tidy but real. No hospital, exam room, or corporate office.
- **People:** older adults aged 65–80 for members; therapists aged 40–65. Diverse ethnicities across the set
  (each page's three therapists should not all look alike). Reading glasses, grey hair, natural wrinkles are good.
  Expressions: thoughtful, calm, gently warm, listening. At most one soft smile per set of three.
- **Framing:** subject occupies the middle 60% of the frame, head in the upper third, room to breathe around them.
  Keep the **top 22% of the frame relatively simple** (a caption chip overlays the top-left) and the **bottom
  18% simple** (a caption overlays the bottom on placeholders; final images do not carry it, but keep it clean).
- **No text, logos, watermarks, or brand marks** in the image. No hands making gestures at the camera.
- **Never** depict medication, pill bottles, wheelchairs, hospital beds, or anyone crying. This is hope, not
  illness.
- **Output:** PNG or high-quality JPEG (quality 90), sRGB, at the pixel sizes below. If the tool only produces a
  fixed size, generate larger than needed at the correct aspect ratio and we will downscale.

## The 12 images

Aspect ratios are exact; the CSS frames use `aspect-ratio`, so a mismatched image would be cropped by `object-fit: cover`.
Portrait frames are 4:5. The founder is 1:1. The check-page hero is 5:4 (landscape).

### Senior page (`/senior/`) — register: warm, empowering, hopeful

| # | Filename | Size (px) | Ratio | Direction |
|---|---|---|---|---|
| 1 | `senior-hero.jpg` | 1200×1500 | 4:5 | A Total Life member, woman or man 68–75, seated at home in natural window light, three-quarter view, looking slightly off camera as if listening to someone kind. Cardigan in oatmeal or soft rust. A cup of tea or a book nearby. The light lands on their face from the window side. Candid, unposed, quietly hopeful. This is the most important image in the set. |
| 2 | `senior-therapist-1.jpg` | 900×1125 | 4:5 | Therapist, 50s, seated in a warm living-room style home office, looking directly at camera with a calm, attentive expression. Warm indoor light. Soft knit top. |
| 3 | `senior-therapist-2.jpg` | 900×1125 | 4:5 | Therapist, 40s, in a home office with books and a plant, soft daylight, gentle closed-mouth smile, looking at camera. |
| 4 | `senior-therapist-3.jpg` | 900×1125 | 4:5 | Therapist, 60s, seated by a window, relaxed posture, head slightly tilted, listening, looking just off camera. |

### Caregiver page (`/caregiver/`) — register: founder-led, daughter to daughter, warm

| # | Filename | Size (px) | Ratio | Direction |
|---|---|---|---|---|
| 5 | `founder.jpg` | 1200×1200 | 1:1 | **Neelam Brar, founder & CEO.** Do not invent a likeness. Generate a placeholder only if a real photograph is not yet available: a South Asian woman in her 40s, intimate square portrait, warm side light from a window, looking directly at camera with a steady, kind expression. Cream or sand background. This image carries the whole page's trust, so a real photograph must replace it before launch. |
| 6 | `caregiver-therapist-1.jpg` | 900×1125 | 4:5 | Therapist, 50s, seated in a home office, soft expression, looking at camera. Documentary lighting. |
| 7 | `caregiver-therapist-2.jpg` | 900×1125 | 4:5 | Therapist, 40s–50s, natural window light, thoughtful, looking off-frame to the left. |
| 8 | `caregiver-therapist-3.jpg` | 900×1125 | 4:5 | Therapist, 60s, in a warm room, a candid soft smile, looking at camera. |

### Self-check page (`/check/`) — register: reflective, gentle reframe

| # | Filename | Size (px) | Ratio | Direction |
|---|---|---|---|---|
| 9 | `check-hero.jpg` | 1500×1200 | 5:4 | A Total Life member in their 70s on a porch or beside a large window, seated, thoughtful, gaze into the middle distance, morning light. Landscape framing with the person on the left or right third and soft, simple space on the other side. A porch chair, a mug, a garden or street softly out of focus. Not sad: pensive, on the edge of deciding something. |
| 10 | `check-therapist-1.jpg` | 900×1125 | 4:5 | Therapist, 50s, warm, seated, natural window light, looking at camera. |
| 11 | `check-therapist-2.jpg` | 900×1125 | 4:5 | Therapist, 40s, soft smile, home office, documentary light. |
| 12 | `check-therapist-3.jpg` | 900×1125 | 4:5 | Therapist, 60s, listening, calm, soft daylight, looking just off camera. |

Nine therapist portraits across three pages: they may be the same nine people or repeats, but within any one
page the three must be visibly different people.

## Prompt template

Use this and fill the bracketed parts from the table:

> Documentary portrait photograph, [subject and age], [setting], [light], [expression and gaze]. Natural film
> warmth, soft window light, shallow depth of field, 50mm lens, warm neutral palette of cream, sand and soft
> brown, lived-in home interior, unposed and candid, no text, no logos. Aspect ratio [4:5 / 1:1 / 5:4].

Negative prompt where supported: stock photo, studio lighting, white background, hospital, clinic, lab coat,
stethoscope, medication, wheelchair, blue color grade, HDR, oversaturated, watermark, text, logo, smiling with teeth,
looking sad, crying.

## Optional motion (Higgsfield or similar)

If animating, produce subtle **cinemagraph-style loops of 6–8 seconds** for images 1, 5, and 9 only:
slow breathing, a blink, hair or a curtain moving in a breeze, light shifting slightly. No head turns, no
camera moves larger than a 2% push. Export MP4 (H.264, no audio) at the image's size, plus keep the still.
The site respects `prefers-reduced-motion` and will fall back to the still. Filenames: `senior-hero.mp4`,
`founder.mp4`, `check-hero.mp4`.

## Where they go

Each image replaces a `.portrait` frame in `senior/index.html`, `caregiver/index.html`, or `check/index.html`.
Drop the files into `assets/img/people/` with the filenames above and tell the developer; wiring them in is a
one-line change per frame (an `<img>` inside the frame, `data-placeholder` removed). Do not resize the frames.

## Acceptance checklist

- [ ] Correct aspect ratio and at least the listed pixel size
- [ ] Warm neutral palette, natural window light, no blue grade
- [ ] Reads as a real home, not a clinic or studio
- [ ] Top and bottom bands of the frame are visually simple
- [ ] No text, logos, medical props, or forced smiles
- [ ] Three visibly different therapists per page
- [ ] Founder image flagged as placeholder until a real photograph arrives
