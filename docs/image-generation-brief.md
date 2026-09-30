# Image generation brief — Total Life landing pages (GPT Image)

For whoever generates the photographs with GPT Image (ChatGPT image generation or the Images API). Supersedes
`docs/higgsfield-agent-prompt-v3.md`. Twenty-one stills across `/caregiver/`, `/depression/`, `/grief/` and the
confirmation page. Every frame on the pages already exists and shows a bracketed brief until the file lands, so
the pages are reviewable today and fill in as files are uploaded.

## Rules for every image (read once, they apply to all 21 prompts)

Style
- Documentary photograph, not stock and not advertising. 35mm or 50mm feel, eye level, shallow but not extreme
  depth of field, soft window or morning light. Gentle film warmth and fine grain like Kodak Portra 400.
- No HDR, no teal-orange grade, no vignette, no bokeh balls, no lens flare, no black-and-white.
- Palette: cream, sand, oatmeal, soft rust, muted sage, warm grey, oak. No pure white walls, no black clothing,
  no saturated blue, red or purple.
- No text, letters, numbers, logos, brand marks, watermarks or captions anywhere in the frame.

People
- Adults 65 to 80, natural grey or white hair, reading glasses welcome, real skin texture. Skin tones rendered warmly
  and truthfully. Diverse across the set (each page has at least one Black, one white and one Asian, Latino or
  South Asian subject; the prompts below say who).
- Expressions calm and unposed: listening, thoughtful, at ease, a faint natural smile at most. No grinning at the
  camera, no laughing, no crying, no one looking sad, slumped, tired or in pain, no head in hands.
- Ordinary clothes at home: cardigans, knits, shirts. Nothing that reads as a patient, a nurse or a doctor.
- Where a phone appears it is a plain cordless or mobile phone held to the ear, or resting on a table. Never a screen
  facing the camera. Where a tablet appears for a video call, it is angled away so the screen is not visible.

Setting
- Lived-in homes, porches, gardens, quiet streets. Tidy but real. Plants, mugs, books, quilts, wooden furniture.
- Never: clinic, exam room, hospital bed, wheelchair, walker, pill bottle, medication, stethoscope, lab coat, scrubs,
  medical chart, laptop screen, phone screen, hearing aid close-up, bandages.

Composition
- Subject in the middle 60% of the frame. Keep the top 20% and bottom 15% of every frame simple (plain wall, floor,
  sky, table top): the page overlays a caption on the bottom band of placeholders and the frames crop slightly on
  phones.
- Exact aspect ratio as listed. Filenames exactly as listed.

Meta advertising rules (the landing page is reviewed together with the ad)
- Nothing that draws attention to a health condition or a struggle: no imagery of distress, isolation, illness,
  frailty or loneliness, no empty bed or single chair framed as absence, no one staring at a phone waiting.
- No before/after, no contrast between "then" and "now".
- Nothing that implies a diagnosis or a treatment: no therapist figures, no notepads with the word therapy, no
  clinical settings, no medication.
- Every image shows the service or ordinary life: a person on a phone call at home, a video call at a kitchen
  table, a walk, a porch, a garden. These are generated images and are never captioned as real members.

Output
- JPEG quality 90, sRGB, at least the pixel size listed. GPT Image's native sizes are 1024×1024, 1536×1024 and
  1024×1536; where the tool offers only those, generate the larger native size and crop to the listed ratio (16:9
  from 1536×1024 becomes 1536×864; 4:5 from 1024×1536 becomes 1024×1280; 3:2 is native at 1536×1024). Do not
  stretch. Larger is always fine; the frames use `object-fit: cover`.
- One image per prompt. Regenerate only when a rule above is broken (text in frame, a screen facing camera, a grin,
  a clinical object), not for taste.

## The 21 slots

Priority marks the first eight to generate if only some can be made: the three hero photos (above the fold, the
only eager-loaded image, a face at eye level beside the booking calendar), the three theme portraits (the second
face on each page, beside the "what therapy helps with" cards) and two scene photos. The remaining scene, the
steps, FAQ and final photos follow.

Where the images appear (same on all three pages):

| Slot | Ratio | Where it appears | Job |
|---|---|---|---|
| hero | 3:2 | Left hero column under the reassurance note, beside the booking calendar on desktop; under the note, after the calendar, on phones | A face at eye level next to the action, showing the phone call happening |
| scene | 16:9 | Full-width band under the hero (desktop and tablet; hidden on phones so the hero photo is the one above-the-fold image) | Ordinary life, sets the tone |
| steps | 3:2 | Beside the four "How it works" cards | Shows step 2, "We call you" |
| portrait | 4:5 | Beside the theme cards ("What ... helps with") | Second face, on the phone, calm |
| detail | 1:1 | Beside the stat band (200+ providers, 49 states, 92%) | Quiet object detail, no face, lets the numbers breathe |
| faq | 4:5 | Beside the FAQ questions | Answers "can I do it by phone or video" visually: a video call, screen turned away |
| final | 3:2 | Beside the final "Ready when you are. Book a call." block above the footer | Steady, forward-looking, unhurried |

### Caregiver page (`/caregiver/`)

| Priority | Filename | Ratio | Size (px) | Prompt (paste as is) |
|---|---|---|---|---|
| 1 | `caregiver-hero.jpg` | 3:2 | 1800×1200 | Documentary photograph, 50mm, eye level from across a kitchen table: a Black woman in her early seventies with short natural grey hair and reading glasses, in a cream cardigan, holding a plain cordless phone to her ear and listening with a calm, attentive expression, eyes toward the window light coming from the left. A ceramic mug and a small notepad with a pen on the oak table, a sand-coloured wall behind her, a plant on the sill softly out of focus. Warm neutral palette of cream, sand and oak, soft morning light, shallow depth of field, gentle Portra 400 grain. Unposed, not smiling for the camera, not sad. Top fifth and bottom sixth of the frame plain. No phone screen visible, no text, no logos, no watermark, no clinic, no medication. |
| 2 | `caregiver-portrait.jpg` | 4:5 | 1200×1500 | Documentary portrait, 50mm, eye level: a white woman in her seventies with grey hair seated at a kitchen table, holding a plain phone to her ear, listening, calm and attentive, eyes toward soft side light from a window. A mug and a folded newspaper on the table, a sand-coloured wall behind her, a cream cardigan and reading glasses. Warm neutral palette, shallow depth of field, gentle film grain. Natural and unposed, no smile for the camera, not sad. Top fifth and bottom sixth of the frame plain. No phone screen visible, no text, no logos, no watermark, no clinic, no medication. |
| 3 | `caregiver-scene.jpg` | 16:9 | 1792×1008 | Documentary photograph, 35mm, eye level from a few metres away: an older couple, a Latino man and woman in their seventies, on a wooden front porch in soft morning light, the man and the woman settling side by side into two porch chairs, each with a mug, both in cardigans in oatmeal and soft rust, a quiet tree-lined street softly out of focus behind the railing. Unposed, mid-movement, neither looking at the camera, both at ease. Warm neutral palette, gentle Portra 400 grain. Top fifth and bottom sixth of the frame plain. No text, no logos, no watermark, no wheelchair, no walker, no clinic. |
| | `caregiver-steps.jpg` | 3:2 | 1800×1200 | Documentary photograph, 50mm, eye level: an East Asian man in his seventies seated in a hallway chair by a front door, answering a plain cordless phone, calm and attentive, morning light from the door's glass panel across an oak floor, a coat rack and a small table with keys behind him. Warm grey knit, cream wall. Warm neutral palette, shallow depth of field, gentle film grain. Unposed, no smile for the camera, not sad. Top fifth and bottom sixth of the frame plain. No phone screen visible, no text, no logos, no watermark, no clinic. |
| | `caregiver-detail.jpg` | 1:1 | 1200×1200 | Documentary photograph, 50mm, f/2.8: two cream ceramic mugs and a folded newspaper on a small oak porch table, a knitted oatmeal blanket over the arm of a porch chair behind, warm side light from the left, shallow depth of field, cream and sand palette, gentle Portra 400 grain. No person, no hands, no text, no logos, no watermark. |
| | `caregiver-faq.jpg` | 4:5 | 1200×1500 | Documentary photograph, 50mm, eye level: a white woman in her seventies with white hair at a dining table on a video call, a tablet propped on a small stand in front of her and angled away from the camera so its screen is not visible, her expression calm and engaged, soft window light from the side, a mug and a vase of garden flowers on the table, a sand-coloured wall. Warm neutral palette, shallow depth of field, gentle film grain. Unposed, not grinning, not sad. Top fifth and bottom sixth of the frame plain. No visible screen, no text, no logos, no watermark, no clinic. |
| | `caregiver-final.jpg` | 3:2 | 1800×1200 | Documentary photograph, 35mm, eye level from a little distance: an older Black couple in their seventies walking slowly arm in arm along a garden path in late afternoon light, seen from behind and slightly to the side, cardigans in oatmeal and soft rust, roses and a wooden fence softly out of focus. Unhurried and at ease. Warm neutral palette, gentle Portra 400 grain. Top fifth and bottom sixth of the frame plain. No text, no logos, no watermark, no wheelchair, no walker. |

### Depression page (`/depression/`)

| Priority | Filename | Ratio | Size (px) | Prompt (paste as is) |
|---|---|---|---|---|
| 4 | `depression-hero.jpg` | 3:2 | 1800×1200 | Documentary photograph, 50mm, eye level: a white man in his seventies with grey hair and a warm grey cardigan seated on an oatmeal sofa beside a window, holding a plain mobile phone to his ear and listening with a calm, open expression, soft daylight on his face from the window, a small plant on the sill and a mug on a wooden side table. Cream wall, lived-in living room. Warm neutral palette, shallow depth of field, gentle Portra 400 grain. Unposed, not smiling for the camera, not sad, not slumped. Top fifth and bottom sixth of the frame plain. No phone screen visible, no text, no logos, no watermark, no clinic, no medication. |
| 5 | `depression-portrait.jpg` | 4:5 | 1200×1500 | Documentary portrait, 50mm, eye level: a Black woman in her seventies with silver hair seated in a sand-coloured armchair beside a window, holding a plain phone to her ear in mid-conversation, expression calm and open, soft daylight on her face, a small plant and a closed book on the sill, a cream cardigan. Warm neutral palette, shallow depth of field, gentle film grain. Natural and unposed, no smile for the camera, not sad. Top fifth and bottom sixth of the frame plain. No phone screen visible, no text, no logos, no watermark, no clinic, no medication. |
| 6 | `depression-scene.jpg` | 16:9 | 1792×1008 | Documentary photograph, 35mm, eye level: a South Asian man in his seventies opening linen curtains in a quiet bedroom, seen from behind and slightly to the side, morning light spilling across a wooden floor and a neatly made bed with an oatmeal quilt, cream walls, a wooden chair with a folded cardigan. Quiet, unposed, hopeful in tone, an ordinary morning. Warm neutral palette, gentle Portra 400 grain. Top fifth and bottom sixth of the frame plain. No text, no logos, no watermark, no medication, no clinic. |
| | `depression-steps.jpg` | 3:2 | 1800×1200 | Documentary photograph, 50mm, eye level: a Latina woman in her seventies with grey hair at a small wooden desk at home answering a plain cordless phone, a paper wall calendar and a pen beside her, calm and attentive, morning light from a window to the side, a plant and a few books on a shelf, cream wall, sage cardigan. Warm neutral palette, shallow depth of field, gentle film grain. Unposed, no smile for the camera, not sad. Top fifth and bottom sixth of the frame plain. No phone screen visible, no readable writing on the calendar, no text, no logos, no watermark, no clinic. |
| | `depression-detail.jpg` | 1:1 | 1200×1200 | Documentary photograph, 50mm, f/4: a reading chair beside a window with a folded oatmeal blanket and a closed hardback book on the seat, late-morning light across the chair and a wooden floor, a cream wall, a small plant on the sill, no person. Inviting and quiet, a chair someone is about to return to, not an empty room. Warm neutral palette, gentle film grain. Top fifth and bottom sixth of the frame plain. No text on the book, no logos, no watermark, no medical objects. |
| | `depression-faq.jpg` | 4:5 | 1200×1500 | Documentary photograph, 50mm, eye level: an East Asian man in his seventies with grey hair in an armchair on a video call, a tablet standing on a small side table in front of him angled away from the camera so its screen is not visible, his expression calm and engaged, a bookshelf and window light behind him, an oatmeal knit. Warm neutral palette, shallow depth of field, gentle film grain. Unposed, not grinning, not sad. Top fifth and bottom sixth of the frame plain. No visible screen, no text, no logos, no watermark, no clinic. |
| | `depression-final.jpg` | 3:2 | 1800×1200 | Documentary photograph, 35mm, eye level from the side: a white woman in her seventies with white hair watering potted plants on a sunlit balcony in the morning, a small watering can, geraniums and herbs in terracotta pots, a warm grey cardigan, a quiet street softly out of focus beyond the railing. Unhurried and at ease, absorbed in the task. Warm neutral palette, gentle Portra 400 grain. Top fifth and bottom sixth of the frame plain. No text, no logos, no watermark, no medical objects. |

### Grief page (`/grief/`)

| Priority | Filename | Ratio | Size (px) | Prompt (paste as is) |
|---|---|---|---|---|
| 7 | `grief-hero.jpg` | 3:2 | 1800×1200 | Documentary photograph, 50mm, eye level: a Latina woman in her seventies with grey hair in a reading chair beside a window, holding a plain phone to her ear and listening with a steady, calm expression, soft afternoon light on her face, a small dog asleep at her feet on a woven rug, a cardigan in soft rust, a cream wall and a wooden side table with a mug. Warm neutral palette, shallow depth of field, gentle Portra 400 grain. Unposed, not smiling for the camera, not sad. Top fifth and bottom sixth of the frame plain. No phone screen visible, no text, no logos, no watermark, no clinic, no medication. |
| 8 | `grief-portrait.jpg` | 4:5 | 1200×1500 | Documentary portrait, 50mm, eye level: a Black man in his seventies with grey hair at a kitchen table with a mug of tea, looking toward a window with a thoughtful, steady expression, morning light from the side, a cream wall, a wooden table and a cardigan in warm grey. Warm neutral palette, shallow depth of field, gentle film grain. Natural and unposed, not sad, not smiling. Top fifth and bottom sixth of the frame plain. No text, no logos, no watermark, no clinic, no medication. |
| | `grief-scene.jpg` | 16:9 | 1792×1008 | Documentary photograph, 35mm, eye level from a little distance and slightly behind: a white woman in her seventies walking a small dog along a quiet tree-lined residential street in soft autumn light, a cardigan in soft rust, leaves on the pavement, houses softly out of focus. Unposed, steady, gentle in tone, an ordinary walk. Warm neutral palette, gentle Portra 400 grain. Top fifth and bottom sixth of the frame plain. No text, no logos, no watermark, no walker, no clinic. |
| | `grief-steps.jpg` | 3:2 | 1800×1200 | Documentary photograph, 50mm, eye level: a South Asian man in his seventies at a kitchen counter answering a plain cordless phone, calm and attentive, a kettle and two ceramic mugs on the counter, morning light through a window over the sink, cream cabinets and a wooden counter, a sage knit. Warm neutral palette, shallow depth of field, gentle film grain. Unposed, no smile for the camera, not sad. Top fifth and bottom sixth of the frame plain. No phone screen visible, no text, no logos, no watermark, no clinic. |
| | `grief-detail.jpg` | 1:1 | 1200×1200 | Documentary photograph, 50mm, f/2.8: a wooden garden bench in late afternoon light with a folded oatmeal cardigan and a closed book on the seat, roses and a hedge softly out of focus behind, no person. Warm and inviting, a place someone sits every afternoon, not an empty memorial. Warm neutral palette, gentle film grain. Top fifth and bottom sixth of the frame plain. No text, no logos, no watermark, no plaque, no flowers laid down. |
| | `grief-faq.jpg` | 4:5 | 1200×1500 | Documentary photograph, 50mm, eye level: an East Asian woman in her seventies with grey hair at a kitchen table on a video call, a tablet propped on a stand in front of her angled away from the camera so its screen is not visible, her expression calm and engaged, a vase of garden flowers and a mug on the table, window light from the side, a cream wall, a cardigan in oatmeal. Warm neutral palette, shallow depth of field, gentle film grain. Unposed, not grinning, not sad. Top fifth and bottom sixth of the frame plain. No visible screen, no text, no logos, no watermark, no clinic. |
| | `grief-final.jpg` | 3:2 | 1800×1200 | Documentary photograph, 35mm, eye level from a little distance: a white man in his seventies and a Black woman of about the same age, friends, sitting side by side on a wooden porch step with mugs of coffee, talking, in morning light, cardigans in warm grey and soft rust, a garden softly out of focus. Relaxed, unposed, mid-conversation, neither looking at the camera. Warm neutral palette, gentle Portra 400 grain. Top fifth and bottom sixth of the frame plain. No text, no logos, no watermark, no wheelchair, no walker. |

### Confirmation page (`/thanks/`)

| Filename | Ratio | Status |
|---|---|---|
| `senior-hero.jpg` + `senior-hero.mp4` + `senior-hero-poster.jpg` | 4:5 | **Already installed, do not regenerate.** The existing photograph of an older woman seated by a window in a rust cardigan now sits in the right column of the confirmation page above "What happens on the call" (the person who has booked and is at ease, waiting for the call). The 5-second loop plays where motion is allowed and the still shows otherwise. |

Optional later: the three `<page>-scene.mp4` loops from the earlier brief (5 s, locked-off camera, only light, fabric or
leaves moving, exported H.264 without audio with `<page>-scene-poster.jpg` as the first frame) still attach
automatically to the scene frames if supplied. GPT Image does not make video; skip unless another tool is used.

## Delivery and install

Upload the files with exactly these names into one folder:

```
assets/img/people/
  caregiver-hero.jpg   caregiver-scene.jpg   caregiver-steps.jpg   caregiver-portrait.jpg
  caregiver-detail.jpg caregiver-faq.jpg     caregiver-final.jpg
  depression-hero.jpg  depression-scene.jpg  depression-steps.jpg  depression-portrait.jpg
  depression-detail.jpg depression-faq.jpg   depression-final.jpg
  grief-hero.jpg       grief-scene.jpg       grief-steps.jpg       grief-portrait.jpg
  grief-detail.jpg     grief-faq.jpg         grief-final.jpg
  (already there: senior-hero.jpg, senior-hero.mp4, senior-hero-poster.jpg)
```

Then, from the repository root:

```
npm run assets
```

That rebuilds `assets/img/people/index.json`. Every frame picks up its file by name, the bracketed brief disappears,
and nothing changes in the HTML. Partial deliveries are fine: frames without a file keep showing their brief.

## Acceptance checklist (per image)

- [ ] Exact aspect ratio and at least the listed pixel size, JPEG, sRGB
- [ ] Warm neutral palette, natural window or morning light, no blue grade, no HDR
- [ ] Reads as a real home, porch or street, not a studio, clinic or stock set
- [ ] Phone held to the ear or resting; no screen visible anywhere
- [ ] Expression calm; no grin, no tears, no slump
- [ ] Nothing medical, nothing that reads as a condition, nothing before/after
- [ ] Top fifth and bottom sixth of the frame simple
- [ ] No text, logos or watermarks
- [ ] Filename matches the table exactly
