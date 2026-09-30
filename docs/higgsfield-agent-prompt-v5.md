# Image plan and Higgsfield agent prompt — v5 (definitive: 21 stills, 3 loops, one person per page)

Replaces `docs/higgsfield-agent-prompt-v4.md`. Covers `/caregiver/`, `/depression/`, `/grief/` and `/thanks/`.
Written 30 Sept 2026 by the creative-direction pass. The page HTML, CSS and JS were **not** touched by this pass;
everything the coordinator must change is in "Slot changes for the coordinator". The paste-ready agent prompt starts
below the horizontal rule and is mirrored, on its own, at
`scratchpad/higgsfield-prompt-v5-paste.md`.

What changed since v4, in one paragraph: the scene band is now 16:9 in CSS (v4's change #1 landed in `c564f7c`),
so the ratio warning is gone. Every slot was re-measured with Playwright at 375, 834, 1280, 1440 and 1920 rather
than estimated; the numbers below are those. The steps photo sits to the **right** of the four step cards on
desktop, so its subject now faces frame-left (v4 had every subject facing right). Three placeholder briefs still
contradict the prompts (depression final, grief final, caregiver final "arm in arm"); they are listed for the
coordinator. The grief page's recurring woman no longer wears rust, because the installed `/thanks/` woman is a
grey-haired woman in a rust cardigan and the two would read as a near-twin. Delivery now includes web-sized
copies (the pages load the file as-is; a 2k JPEG per slot is too heavy for phones). Model facts were re-verified
against today's MODELS.md; the credit cap is gone at the user's request, but the priority order stays so the
shots that do the most conversion work are made first, and spend is still logged.

## 1. Break-up of each landing page

### How the frames work (read this before the tables)

Every photo slot is a `.portrait[data-asset]` element. `assets/js/tl.js` fetches `assets/img/people/index.json`,
and attaches an `<img>` only when the filename in `data-asset` is listed there; frames whose file is missing keep
showing the bracketed `data-placeholder` brief. If `data-video` is also listed (and the visitor has not asked for
reduced motion or reduced data on a phone), a muted, looping, autoplaying `<video>` is layered over the still with
`data-poster` as its poster, and the frame's aspect ratio is snapped to the clip's own ratio on `loadedmetadata`.
Every frame has a soft-light radial overlay (`.portrait::before`): a warm highlight centred at about 62% across
and 36% down, and a darkening at 40% across, 80% down, i.e. the lower-left corner. Faces belong in the upper
third, right of centre; nothing important goes bottom-left.

The rendered widths are the same on every page because the layout is shared. Measured on the local server with
`reducedMotion: reduce`, placeholders showing (the calendar placeholder is 857 px tall on phones, 733 px on
desktop; a live HubSpot calendar is similar).

| Slot | CSS ratio | 1280 wide (800 tall) | 834 wide | 375 wide | Position in the layout |
|---|---|---|---|---|---|
| hero | 3:2 | 520×347, top ≈ 758–848 px | 520×347, ≈ 1 290 px down | 343×229, ≈ 1 636–1 669 px down | Left column, under the reassurance note; the booking card is the right column (145–878 px). On phones the order is headline → calendar → lede → CTA → note → photo |
| scene | 16:9 | 1200×675, top ≈ 1 182–1 271 px | 767×432, ≈ 1 690 px down | **not rendered** (0×0) | Full-width band directly under the hero; carries the only motion |
| steps | 3:2 | 460×307, **right** of the four step cards (x = 780) | 520×347 below the cards | 343×229 below the cards | "How it works" |
| portrait | 4:5 | 360×450, left of the theme cards | 420×525 above the cards | 343×429 above the cards | Theme block |
| detail | 1:1 | 320×320, left of the stat band | 420×420 above the stats | 343×343 above the stats | Proof band |
| faq | 4:5 (sticky) | 320×400, left of the questions | 320×400 above them | 320×400 above them | FAQ |
| final | 3:2 | 574×383, left of the "Book a call" copy and button | 520×347 above it | 343×229 above it | Final CTA |
| thanks | 4:5 | 400×500, top 145 px, right column, above the fold | 320×400, ≈ 1 160 px down | 320×400, ≈ 1 550 px down | `/thanks/`, installed `senior-hero.*` |

Fold facts that drive the plan (measured):

- **The hero photo is under the fold on every common desktop size.** 1280×720: 0 px visible. 1280×800: top at
  758–848 px. 1440×900: 44–101 px visible. 1920×1080: 224–281 px visible. The visitor sees the headline, lede, CTA,
  stamp and the calendar first; the photo appears as they scroll into the decision, level with the foot of the
  booking card (which ends at about 878 px) and its opt-in and privacy lines. So the hero's job is not "stop the
  scroll", it is "this is who does this, and it is fine".
- **On phones the hero photo arrives after the calendar** (card 257–268 px from the top, 857 px tall), about
  1.65 k px down, and is the first photograph on the page because the scene band is hidden below 640 px. Meta 65+
  traffic is mostly phones, so for most paid visitors the hero photo is the first face they see, and it is seen
  after they have already been offered the calendar once.
- **Page heights at 375 px:** caregiver 8 152, depression 7 978, grief 8 209, with six photos each. See the cut
  recommendation in §2.
- Tablet (834) stacks everything in one column; the scene renders at 767×432 about 1 690 px down.
- These figures are from the working tree as it stood during this pass (the other agent's uncommitted edits to the
  calendar placeholder and hero spacing included); a later copy change moves them by tens of pixels, not more.

### 1a. `/caregiver/` (eyebrow "For caregivers 65+", H1 "Caregiver stress therapy, covered by Medicare.")

The member is the carer, an adult 65+ looking after a spouse or parent. Not the adult-daughter funnel
(`docs/targeting.md`). So the spouse appears, upright and equal, never as a patient.

| Section | Slot today (`data-asset` · placeholder brief · `aria-label`) | Conversion job at this point | The shot (v5) |
|---|---|---|---|
| Hero with booking card | `caregiver-hero.jpg` · "[PHOTO 3:2: A woman in her seventies on the phone at her kitchen table, listening, reading glasses, a mug and notepad, side window light, seen at eye level from across the table.]" · "A woman listening on the phone at her kitchen table" | Level with the foot of the calendar on desktop, first face on phones. Answers "is this for someone like me, and what is the call like?" Gaze frame-right leads the eye to the calendar. | The recurring woman on a plain cordless phone at her kitchen table, three-quarter view toward frame-right, window light from the right, calm and listening. **Still, no clip.** |
| Scene band | `caregiver-scene.jpg` + `caregiver-scene.mp4` + `caregiver-scene-poster.jpg` · "An older couple settling side by side into two porch chairs in morning light, each with a mug, a quiet street softly out of focus." · "An older couple on a porch" | Desktop only, 1200×675, straight under the hero: the one place for motion; sets "ordinary life continues". | Same woman and her husband on the porch, both at ease, both holding their own mug, nobody helped. 5 s locked-off loop, start frame = end frame. |
| How it works | `caregiver-steps.jpg` · "A woman in her early seventies answering a cordless phone in a sunlit hallway, calm and attentive, cream cardigan, oak floor." · "A woman answering the phone in her hallway" | Illustrates step 02 "We call you": the thing that happens after booking. On desktop the photo is to the **right** of the cards, so she faces frame-left, toward the steps. | Same woman picking up the cordless phone in her hallway, body and face turned frame-left, light from the front-door glass on the left. |
| Theme block ("What the sessions help with.") | `caregiver-portrait.jpg` · "An older couple doing a crossword together at a kitchen table, morning light, mugs of tea, relaxed and absorbed." · "A couple doing a crossword at their kitchen table" | Left of five cards about spouse/parent/dementia caregiving. Must show the relationship without illustrating illness or strain. | Same woman and her husband on a crossword, equal partners, one pencil, two mugs; she looks at the page, he looks at her; frame-right open. |
| Proof band (200+ / 49 / 92%) | `caregiver-detail.jpg` · "Two mugs and a folded newspaper on a small porch table, a knitted blanket over the chair arm behind, warm side light, no person." · "Two mugs on a porch table" | Lets the numbers stand without a face competing; signals company (two mugs). Desktop only if §2 cut is applied. | Object still life: two mugs, one steaming, folded paper, blanket on the chair arm. No person, no hands. |
| FAQ | `caregiver-faq.jpg` · "A woman in her seventies at a dining table talking on a video call, the tablet propped on a stand and angled away from camera so no screen is visible, soft window light." · "A woman on a video call at her dining table" | Answers "phone or video?" visually and repeats the recurring face beside "Can sessions fit around caregiving?". Gaze frame-right toward the questions. | Same woman on a video call, tablet angled away, screen invisible. |
| Final CTA ("Book a call.") | `caregiver-final.jpg` · "An older couple walking slowly arm in arm along a garden path in late afternoon light, seen from behind at a little distance, unhurried." · "An older couple walking arm in arm in a garden" | Left of the last "Book my call". Closes the story: life after the call, moving toward frame-right (the button). | Same couple walking side by side on a garden path, **not arm in arm** (reads as support), each walking easily, seen from the side and slightly behind, moving frame-right. |

### 1b. `/depression/` (eyebrow "Therapy by phone or video", H1 "Depression therapy, covered by Medicare.")

Rule for every frame on this page: warmth, daylight, ordinary activity. Nothing that a reviewer could call a
depiction of low mood: no slumping, no dark rooms, no staring at nothing, nobody in bed, no closed curtains.

| Section | Slot today | Conversion job | The shot (v5) |
|---|---|---|---|
| Hero with booking card | `depression-hero.jpg` · "A man in his seventies on a sofa by a window with a phone to his ear, listening, a plant on the sill and a mug on the side table, soft daylight on his face, eye level." · "A man listening on the phone on his sofa" | As caregiver hero. | The recurring man, upright on an oatmeal sofa by a tall window, phone to ear, open calm expression, three-quarter toward frame-right, daylight from the right. Still. |
| Scene band | `depression-scene.jpg` + `.mp4` + `-poster.jpg` · "An older man opening the curtains in a quiet bedroom, morning light spilling across the floor and a made bed, seen from behind." · "An older man opening curtains in the morning" | Desktop-only motion under the hero. Light coming in is the safest possible "morning" metaphor; from behind means the loop never has to hold a face. | Same man drawing sheer curtains open, bed made, light across the floor; loop = curtains drifting, light brightening, one breath. |
| How it works | `depression-steps.jpg` · "A man in his mid-seventies answering the phone at a wooden desk by a window, silver hair, warm grey cardigan, calm." · "A man answering the phone at his desk" | Step 02. Right of the cards on desktop → he faces frame-left. | Same man at a small desk answering a cordless phone, turned frame-left, blank wall calendar, plant, window light from the left. |
| Theme block ("What depression therapy covers.") | `depression-portrait.jpg` · "A woman in her seventies reading in an armchair by a window, soft daylight, a plant on the sill, at ease." · "A woman in an armchair by a window with a book" | Beside four "sessions work on…" cards. Second person for diversity; must show engagement, not stillness. | A Black woman in her seventies actually reading, glasses on, book open, a faint amused warmth, daylight from the right; frame-right open toward the cards. |
| Proof band | `depression-detail.jpg` · "Potted herbs on a sunny kitchen windowsill, cream wall, soft morning light, no person." · "Herbs on a sunny kitchen windowsill" | Alive, tended, sunlit; no face. | Three terracotta herb pots, mug, small watering can, light from the left. |
| FAQ | `depression-faq.jpg` · "A man in his seventies in an armchair on a video call, the tablet on a small table angled away from camera so no screen is visible, a bookshelf and window light." · "A man on a video call in his armchair" | "Phone or video?" answered; recurring face. Gaze frame-right. | Same man, armchair, tablet angled away. |
| Final CTA ("Book a call, from home.") | `depression-final.jpg` · "A woman in her seventies watering plants on a sunlit balcony in the morning, seen from the side, unhurried, warm light." · "A woman watering plants on a balcony" | Closes the story beside the last button. **Placeholder says a woman; the plan says the recurring man** (the page reads as one story). Coordinator item. | Same man watering geraniums on a sunlit balcony, absorbed, body angled frame-right. |

### 1c. `/grief/` (eyebrow "Therapy by phone or video", H1 "Grief counseling, covered by Medicare.")

Rule: loss is the subject of the copy, never of the picture. No empty chair, no single place setting, no
photograph-in-a-frame being held, no cut flowers laid down, no black clothing, no cemetery, no rain. Warm,
forward, companionable. The small dog carries continuity and "someone to come home to" without saying it.

| Section | Slot today | Conversion job | The shot (v5) |
|---|---|---|---|
| Hero with booking card | `grief-hero.jpg` · "A woman in her seventies in a reading chair by a window with a phone to her ear, listening with a steady expression, a small dog asleep at her feet, soft afternoon light, eye level." · "A woman on the phone in her reading chair" | As above. | The recurring woman (white bob, **sage** cardigan, see §3) in a reading chair, phone to ear, steady and calm, three-quarter toward frame-right, terrier asleep on the rug. Still. |
| Scene band | `grief-scene.jpg` + `.mp4` + `-poster.jpg` · "An older woman walking a small dog along a quiet tree-lined street in soft autumn light, seen from a little distance." · "An older woman walking a dog" | Desktop-only motion; forward movement is the metaphor. | Same woman walking the terrier on a tree-lined street, steady stride, profile visible; loop = two easy steps, leaves, branches. |
| How it works | `grief-steps.jpg` · "A woman in her mid-seventies answering the phone in her kitchen, white bob, rust cardigan, small terrier at her feet, morning light." · "A woman answering the phone in her kitchen" | Step 02; faces frame-left on desktop. Placeholder says "rust cardigan": coordinator item (sage). | Same woman at the kitchen counter answering the phone, turned frame-left, kettle and two mugs, terrier at her feet. |
| Theme block ("What grief counseling helps with.") | `grief-portrait.jpg` · "A man in his seventies at a kitchen table with a mug of tea, looking toward a window, thoughtful and steady, morning light." · "A man at his kitchen table in morning light" | Beside five loss cards (spouse, friend, anniversaries, long illness, pet). The one frame most at risk of reading as mourning; the second person must be doing something. | A Black man in his seventies at the kitchen table, mug in one hand, a folded crossword and pencil in front of him, watching a bird feeder outside the window with a faint smile; morning light from the right. |
| Proof band | `grief-detail.jpg` · "A cream mug and a leather dog lead on a small porch table, late afternoon light, no person." · "A mug and a dog lead on a porch table" | Objects that imply a routine that continues (the walk is about to happen). | Steaming mug, coiled lead, folded reading glasses, garden behind. Steam = someone is here. |
| FAQ | `grief-faq.jpg` · "A woman in her seventies at a kitchen table on a video call, the tablet propped on a stand angled away from camera so no screen is visible, a vase of garden flowers, window light." · "A woman on a video call at her kitchen table" | "Phone or video?"; recurring face; gaze frame-right. | Same woman, kitchen table, tablet angled away, terrier on the chair cushion. |
| Final CTA ("Book a call with us.") | `grief-final.jpg` · "A man in his seventies and an adult friend sitting on a porch step with mugs of coffee, talking, morning light, seen from a little distance." · "Two friends talking on a porch step" | Closes the story beside the last button. **Placeholder says a man; the plan says the recurring woman with a friend.** Coordinator item. | Same woman and an East Asian woman friend on a porch step with coffee, mid-conversation, terrier on the path, open toward frame-right. |

### 1d. `/thanks/`

One slot: `senior-hero.jpg` + `senior-hero.mp4` + `senior-hero-poster.jpg`, 4:5, installed (1600×2000 still,
834×1112 poster). A grey-haired woman in a rust cardigan in an armchair by a window, glasses on a cord, mug in
hand, looking frame-left toward the window, which on desktop is toward the confirmation copy. Above the fold on
desktop (top 145 px, right column), about 1.55 k px down on phones. No form beside it, so the loop is fine.
**Keep as is; generate nothing for this page.** It follows all three pages, which is why the grief woman must
not look like her (§3).

## 2. Slot changes for the coordinator (HTML/CSS/JS; this pass did not edit them)

Ordered by how much they matter. 1–3 are needed for the delivered files to match the page; 4–6 are opinions.

1. **Placeholder briefs and `aria-label`s that contradict the shot list.** Change the wording so the visible brief
   and the alt text match what will arrive:
   - `depression/index.html` final: `depression-final.jpg` brief → "[PHOTO 3:2: A man in his seventies watering
     geraniums on a sunlit balcony in the morning, seen from the side, unhurried, warm light.]", aria-label →
     "A man watering plants on his balcony".
   - `grief/index.html` final: `grief-final.jpg` brief → "[PHOTO 3:2: Two women in their seventies sitting on a
     porch step with mugs of coffee, talking, a small dog on the path, morning light, seen from a little distance.]",
     aria-label → "Two friends talking on a porch step" (unchanged).
   - `caregiver/index.html` final: replace "arm in arm" (reads as physical support, which the shot must avoid) →
     "[PHOTO 3:2: An older couple walking side by side along a garden path in late afternoon light, seen from the
     side at a little distance, unhurried.]", aria-label → "An older couple walking side by side in a garden".
   - `grief/index.html` steps: "rust cardigan" → "sage cardigan" (the grief woman's cardigan changes, §3).
   - `grief/index.html` portrait: brief → "[PHOTO 4:5: A man in his seventies at his kitchen table with a mug and a
     crossword, watching a bird feeder outside the window, morning light.]", aria-label → "A man at his kitchen
     table with a crossword".
   - `depression/index.html` portrait: brief → "[PHOTO 4:5: A woman in her seventies reading in an armchair by a
     window, glasses on, soft daylight, a plant on the sill.]" (aria-label unchanged).
2. **Nothing else about the slots changes.** The seven `data-asset` names per page, the three `data-video` /
   `data-poster` pairs, and all ratios (3:2, 16:9, 3:2, 4:5, 1:1, 4:5, 3:2) stay exactly as they are. The scene
   band is already `aspect-ratio: 16 / 9` at every width where it renders; v4's change #1 is done.
3. **Delivered file sizes.** `tl.js` loads the file as-is, so the agent delivers web-sized JPEGs (dimensions in the
   prompt's Delivery section) plus the full-size originals in a separate folder. Install only the web-sized set.
   If the coordinator prefers to own resizing, the originals are there; but do not ship 2k JPEGs to a 65+ mobile
   audience.
4. **Cut the detail (1:1) slot on phones.** Recommended: `@media (max-width: 640px) { .portrait--square { display:
   none; } }`, the same treatment the scene already gets. Reasoning: on phones it is a 343×343 object still life
   sitting between the theme block and the stat band, 3.8–4.0 k px down, on pages that are 8.0–8.2 k px tall with
   six photos. It has no face, no service and no CTA near it; the stat band reads fine alone (it did before pass 4).
   It saves about 380 px and one image request per phone visit. Keep it on tablet and desktop, where it sits beside
   the numbers and stops the band looking bare. Do not cut the FAQ photo on phones: it is the only frame that shows
   the video-call option, and "phone or video" is a real question for this audience.
5. **Do not add a hero clip, and do not move the hero photo above the calendar.** Re-verified for v5: 2026 tests
   put autoplay video heroes at about −7% against a still ([Digital Applied, 2 000 pages](https://www.digitalapplied.com/blog/landing-page-conversion-study-2000-pages-tested-2026)),
   video without a visible CTA at −4 to −9% ([roast.page](https://roast.page/stats/hero-section-statistics)),
   and background video slightly negative overall ([Unbounce](https://unbounce.com/landing-pages/do-video-backgrounds-help-or-hurt-conversions/)),
   with autoplay hero video now discouraged for vestibular reasons ([Harvard design system](https://designsystem.harvardsites.harvard.edu/news/2025/02/autoplaying-hero-background-videos-digital-design)).
   The healthcare guidance is "one CTA above the fold, trust signals beside the booking action"
   ([Landingi](https://landingi.com/landing-page/healthcare-best-practices/), [Linear Design](https://lineardesign.com/blog/medical-landing-page/)):
   the calendar *is* the action, so it keeps the fold, and the still keeps its place beside it. Motion lives in
   the scene band only: no form beside it, hidden on phones, reduced-motion fallback built in.
6. **Optional, if the coordinator wants a stronger desktop first screen:** the sand `hero-art::before` disc and the
   coral dot are fine, but on 1280×800 the visitor sees no photograph at all until they scroll. If that is felt to
   be a problem, the fix is copy length (a shorter lede pulls the photo up ~60 px), not moving the photo. The
   4:5 or 1:1 re-ratio of the hero was considered and rejected: taller frames push the phone layout further down.

## 3. Decisions behind the shot list (with sources)

**Faces and gaze.** People follow a pictured person's gaze; a face looking out at the visitor holds attention on
the face, a face looking at the form or headline moves it there ([Attention Insight](https://attentioninsight.com/the-cognitive-science-of-visual-hierarchy-why-your-users-eyes-skip-your-cta/),
[Unbounce](https://unbounce.com/design/9-landing-page-design-techniques-conversion-hero/),
[Disruptive Advertising](https://disruptiveadvertising.com/blog/conversion-rate-optimization/4-ways-to-get-more-out-of-your-hero-shot/),
[KlientBoost](https://www.klientboost.com/landing-pages/landing-page-hero-shots/)). So: no lens-stare anywhere,
and the gaze follows the measured layout. Hero, portrait, FAQ and final are left of their copy or CTA on desktop →
gaze and body toward frame-right. Steps is right of the cards → frame-left. On phones everything stacks, where a
three-quarter face is simply a calmer, more candid picture than a stare.

**Realism for 65+.** Operators who replaced stock with real photography report better engagement, and the
audience reads gloss as "generic" ([Care Marketing, 1 Sept 2026](https://www.caremarketing.com/senior-living-resident-images-authenticity-marketing/),
[Senior Care Business Growth](https://seniorcarebusinessgrowth.com/original-photography-home-care-website/)).
AI imagery is acceptable for mood if it is never presented as real residents or members
([LTC News](https://www.ltcnews.com/articles/using-ai-generated-images-in-senior-care-marketing-what-families-should-know)).
Hence: documentary look, real skin texture, grey hair, glasses, lived-in rooms, film grain, no captions, no names,
no "member" wording near any picture. Warm ordinary homes with window light, and the palette sits with cream
`#F7F3F0`, sand `#F6E8D4`, coral `#FA7268`, teal `#17484E` by using cream, sand, oak, oatmeal, rust, terracotta
and sage in the scene, never by painting the brand colours in.

**Showing the service.** The pages promise "a phone call from home, therapy by phone or video". The pictures that
do conversion work show that: phone to ear (hero, steps), tablet angled away (FAQ). Everything else is "ordinary
life around it". No medical objects anywhere, which also keeps every frame on the service side of Meta's line.

**Meta health imagery, 2026.** Ads and their landing pages are reviewed together; personal-attributes enforcement
covers implied conditions; health creative must not draw attention to a condition, generate negative
self-perception, use before/after framing, or show distress ([Meta, Personal Health policy](https://www.facebook.com/business/help/2489235377779939),
[wetracked](https://www.wetracked.io/post/meta-ads-new-sensitive-categories-restrictions),
[Adligator](https://adligator.com/blog/meta-health-wellness-ad-policy-update-2026),
[AuditSocials](https://www.auditsocials.com/blog/meta-ad-misleading-claims-personal-attributes-prohibited-content-policy-2026),
[Accelerated Digital Media](https://www.accelerateddigitalmedia.com/insights/guide-to-social-media-health-ad-restrictions-2026/)).
Consequences: no crying, head in hands, slumping, frailty, walkers or canes, nobody physically supported, no empty
chair or bench framed as absence, no lone figure in a dark room, no screens, no text.

**Hero stays a still.** See §2 item 5.

**Higgsfield models (verified against [MODELS.md](https://raw.githubusercontent.com/higgsfield-ai/cli/main/MODELS.md)
and the [README](https://github.com/higgsfield-ai/cli) on 30 Sept 2026).** `nano_banana_2` (Nano Banana Pro):
`--aspect_ratio` 1:1 3:2 2:3 4:3 3:4 4:5 5:4 9:16 16:9 21:9, `--resolution 1k|2k|4k` (default 2k), 0–14 reference
images via `--image-references` / alias `--image`, local paths auto-uploaded. `gpt_image_2_5`: same ratios and
more, `--quality low…max`, `--variant flare|sunburst`, up to 16 references; retry model only. `kling3_0`:
16:9 | 9:16 | 1:1, `--start-image` and `--end-image`, integer `--duration` (default 5), `--mode std|pro|4k`,
`--sound on|off` (default on). `seedance_2_0`: 16:9 etc., start and end image, `--resolution` up to 4k,
`--generate_audio` defaults true, `--mode std|fast`; stronger on physically believable scene motion, weaker than
Kling on holding a face, several times the price ([fal.ai](https://fal.ai/learn/tools/seedance-2-0-vs-kling-3-0),
[EachLabs](https://www.eachlabs.ai/blog/seedance-2-0-vs-kling-3-0-ai-video-generator-comparison),
[Multic](https://www.multic.com/guides/seedance-2-vs-kling/)). Third-party price reports for Higgsfield: Nano
Banana Pro about 2 credits per image, Kling 3.0 5 s about 7 credits, Seedance 2.0 1080p 5 s about 45
([Luma](https://lumalabs.ai/news/higgsfield-pricing), [Scopeful](https://www.scopeful.org/blog/higgsfield-pricing-2026)).
No model accepts a seed or a separate negative prompt; `generate cost` is documented only for workflows, not for
models. Decision: every still on Nano Banana Pro at 2k with the chosen hero as the reference; every clip on Kling
3.0 `--mode pro` with start = end frame; Seedance 2.0 as the one retry for a clip that comes back static.

**One person per page.** Nano Banana Pro's reference-image input is the documented way to hold one likeness across
scenes. Method: generate the hero with the identity block in words, pick, then pass the chosen hero (and, once it
exists, the chosen steps still) as `--image` on every later slot with the identity block repeated verbatim and the
sentence "the same person as in the reference images…". The scene still is made the same way and then animated, so
the loop inherits the likeness. Soul ID (face-trained characters) exists in the CLI and is not needed for 21 stills.

| Page | Recurring person (internal reference only, never a caption) | Appears in | Second person |
|---|---|---|---|
| caregiver | Black woman, early seventies, short natural silver-grey hair, round tortoiseshell reading glasses, cream ribbed cardigan over a soft rust top, small gold studs | hero, scene, steps, portrait, faq, final | her husband: Black man of the same age, close-cropped white hair and short white beard, oatmeal cardigan over a sand shirt |
| depression | Latino man, mid-seventies, thick silver hair combed back, trimmed grey moustache, warm grey shawl-collar cardigan over a sand shirt | hero, scene (from behind), steps, faq, final | portrait: Black woman in her seventies, short silver hair, sage cardigan, tortoiseshell glasses |
| grief | White woman, mid-seventies, soft white hair in a short bob, no glasses, **muted sage cardigan** over an oatmeal blouse, thin silver chain; a small scruffy tan terrier | hero, scene, steps, faq, final | portrait: Black man in his seventies, short grey hair and beard, warm grey cardigan; final: East Asian woman friend, grey hair pinned back, oatmeal cardigan |

Why sage for the grief woman: the installed `/thanks/` still is a grey-haired white woman in a rust cardigan by a
window; v4's grief woman was a white-haired white woman in a rust cardigan by a window. Every grief booker lands
on `/thanks/` seconds later. Two near-twins in a row read as a mistake.

**Priority order.** P1–P3 the three heroes (decision-time face, first face on phones). P4–P6 the three steps
stills (they show the thing booking leads to, and every later slot references them). P7–P9 finals (beside the
last button). P10–P12 the scene stills (largest pixels on desktop, but desktop-only). P13–P15 FAQ, P16–P18
portraits, P19–P21 details, then the three clips. Credits are not capped for this job, but spend is logged.

---

You are a production assistant generating photographic and motion assets for three Total Life landing pages and
their confirmation page. Total Life is a Medicare-covered talk-therapy practice for adults 65+. The pages are
built; each slot has an exact aspect ratio and filename. You will generate 21 stills (30 generations including
candidates) and 3 looping clips using the prompts in Sections 4 and 5 verbatim. Do not rewrite, shorten or
"improve" a prompt. Your judgment is for selecting candidates, logging spend, and stopping when told to.

## 1. Tooling

Use the Higgsfield CLI. If you only have an MCP tool rather than the CLI, stop and report before any paid call.

```bash
curl -fsSL https://raw.githubusercontent.com/higgsfield-ai/cli/main/install.sh | sh   # or: npm i -g @higgsfield/cli
higgsfield auth login
higgsfield workspace                 # confirm the workspace that will be billed
higgsfield account --json            # record starting balance and plan in the manifest
higgsfield model list                # confirm nano_banana_2, gpt_image_2_5, kling3_0, seedance_2_0 are listed
higgsfield model get nano_banana_2 --json   # confirm ratios 3:2 4:5 1:1 16:9, --resolution 2k, --image / --image-references (0–14)
higgsfield model get kling3_0 --json        # confirm --start-image, --end-image, --duration, --mode std|pro|4k, --sound
higgsfield generate --help                  # note whether `generate cost` accepts a model id (it is documented only for workflows)
```

Model facts (verified against the CLI's MODELS.md on 30 Sept 2026; re-check with the commands above):
- `nano_banana_2` (Nano Banana Pro): `--aspect_ratio` in `1:1 3:2 2:3 4:3 3:4 4:5 5:4 9:16 16:9 21:9`,
  `--resolution 1k|2k|4k` (default 2k), `--image-references` or the alias `--image`, repeatable, 0–14 references,
  local path (auto-uploaded) or upload id. `--aspect_ratio` and `--aspect-ratio` are both accepted.
- `gpt_image_2_5`: same ratios plus more, `--resolution 1k|2k|4k` (default 1k), `--quality low|medium|high|xhigh|max`
  (default low), `--variant flare|sunburst`, `--image` up to 16. Retry model only (Section 4).
- `kling3_0`: `--aspect_ratio 16:9|9:16|1:1`, `--start-image`, `--end-image` (one each), integer `--duration`
  (default 5), `--mode std|pro|4k`, `--sound on|off` (default on: always pass `off`). No `--resolution` flag.
- `seedance_2_0`: `--aspect_ratio` includes 16:9, `--start-image`, `--end-image`, `--resolution 480p|720p|1080p|4k`,
  `--mode std|fast` (1080p needs `std`), `--generate_audio` (default true: always pass `false`). Retry model for
  clips only (Section 5).
- No model here accepts a seed or a separate negative prompt. Exclusions are written into each prompt; the shared
  exclusion block in Section 3 is already appended to every prompt.
- Always pass `--wait --json --wait-timeout 30m`. If `--wait` times out, the job is still running and already
  charged: poll `higgsfield generate get <job_id> --json` (or `higgsfield generate wait <job_id>`) until it
  completes. **Never re-issue `generate create` for a job that timed out.** Download every result immediately with
  `curl -L -o <filename> <url>`; result URLs expire.

## 2. Spend discipline (no cap, full log)

There is no credit cap on this job. There is still a log. Third-party reports put Nano Banana Pro at about 2
credits per image, Kling 3.0 5 s std at about 7, pro higher, and Seedance 2.0 1080p 5 s at about 45; the checked
figures replace them.

- Run `higgsfield account --json` before the first paid call and after every paid call; write the delta into the
  manifest next to the job id. The first call of each model is its price check.
- Never retry automatically. A failed job: record the job id, wait up to 15 minutes checking the balance for the
  refund; if none appears, log `refunded: false` and continue. At most two manual retries per slot.
- If a single charge exceeds 10× the checked price for that model, stop and report (it means a flag was wrong).
- Do not buy credit packs or change the plan. Report and stop instead.
- **Checkpoint.** After the last still (Section 4, slot 21), send the checkpoint report (files delivered, credits
  spent and remaining, the three chosen scene stills attached) and **STOP. Do not run any video call until the
  operator replies with an explicit go-ahead in this conversation.**

## 3. Quality bar, exclusion block and selection rules

Every image must read as a documentary photograph of a real person in a real home, porch, garden or street.
Reject a candidate, and regenerate, if it shows any of:

- **Medical or clinical:** clinic, exam room, hospital bed, wheelchair, walker, cane, pill bottle, medication,
  stethoscope, lab coat, scrubs, chart, bandage, hearing-aid close-up, blood-pressure cuff.
- **Distress or frailty:** crying, head in hands, slumped posture, staring at a phone waiting, anyone being
  physically helped, held up or steadied, anyone in bed, an empty chair or bench framed as absence, a lone figure in
  a dark room, closed curtains as the subject, a held photograph, cut flowers laid down, black clothing.
- **Screens and text:** any phone or tablet screen facing the camera, any readable text, letters, numbers, logos,
  brand marks, calendars with writing, book titles, street signs, watermarks.
- **Body parts:** a crop that isolates hands, eyes, a mouth or an ear; faces within 5% of a frame edge.
- **Look:** teeth-forward grin, plastic or airbrushed skin, a blue or teal grade, HDR, lens flare, bokeh balls,
  black-and-white, a pure white studio wall, saturated blue, red or purple, fisheye or wide distortion.
- **Gaze:** eyes on the lens. Every person looks toward window light or toward the other person, never at the
  camera. Direction per slot is in the prompt (frame-right for hero, portrait, FAQ and final; frame-left for steps).
- **Identity:** on a slot that carries reference images, a person whose face, hair, glasses or cardigan visibly
  differ from the chosen hero.

Skin tones must render warmly and truthfully for every subject; reject grey, ashen or over-lightened skin. Keep the
top fifth and bottom sixth of every frame simple (plain wall, floor, sky, table top); keep critical detail out of
the lower-left corner (the site's radial overlay darkens it) and put faces in the upper third, right of centre
(the overlay's highlight sits there).

**Shared exclusion block.** Every prompt in Sections 4 and 5 ends with this sentence; it is part of the prompt and
is pasted with it: *"No text, no letters, no numbers, no logos, no watermark, no visible screen, no clinic, no
medication, no wheelchair, no walker, no cane, nobody being supported, no black clothing, no blue or teal colour
grade, no HDR, no lens flare, no smoothing of skin, nobody looking at the camera."*

**Candidates.** 3 for each hero, 2 for each scene still (pick the calmer one whose subject is easiest to animate:
no motion blur, hands and hems visible), 1 for everything else. Regenerate for a rule above, or when the
likeness has drifted; not for taste. Keep the full-size originals; web-sized copies are made in Section 6.

**Generation order.** Work in P1–P21 order. The only constraint on top of that is the reference dependency: a page's hero must be generated and chosen before any slot on that page that takes the hero as a reference, and its steps still before any slot that references the steps. P1–P21 already respects this; if it ever does not, generate the reference first, then return to the priority order.

## 4. The 21 stills — exact prompts and calls

**Model routing.** Every still uses Nano Banana Pro at 2k. Use GPT Image 2.5 (`--resolution 2k --quality high`,
same prompt, same `--image` references) only as the retry when a Nano Banana Pro slot has failed Section 3 twice.

```bash
# Heroes (no reference)
higgsfield generate create nano_banana_2 --prompt "<PROMPT>" --aspect_ratio 3:2 --resolution 2k --wait --json --wait-timeout 30m
# Slots that show the page's recurring person, before the steps still exists (scene)
higgsfield generate create nano_banana_2 --prompt "<PROMPT>" --image ./<page>-hero.jpg --aspect_ratio <RATIO> --resolution 2k --wait --json --wait-timeout 30m
# Slots that show the page's recurring person, once the steps still exists (portrait, faq, final)
higgsfield generate create nano_banana_2 --prompt "<PROMPT>" --image ./<page>-hero.jpg --image ./<page>-steps.jpg --aspect_ratio <RATIO> --resolution 2k --wait --json --wait-timeout 30m
# Second-person portraits and object details (no reference)
higgsfield generate create nano_banana_2 --prompt "<PROMPT>" --aspect_ratio <RATIO> --resolution 2k --wait --json --wait-timeout 30m
```

Each prompt below is complete. Paste it as `<PROMPT>` unchanged. `--image` is passed only where the heading says
**ref: hero** or **ref: hero + steps**.

### Caregiver page (`/caregiver/`)

Identity block (already inside each prompt): *a Black woman in her early seventies, short natural silver-grey
hair, round tortoiseshell reading glasses, a cream ribbed cardigan over a soft rust top, small gold stud earrings.*
Her husband: *a Black man of about the same age, close-cropped white hair and a short white beard, an oatmeal
cardigan over a sand shirt.*

#### Slot 1 — `caregiver-hero.jpg` — 3:2 — 3 candidates — **P1**

> Documentary photograph, 50mm lens at f/2.8, eye level from across a kitchen table: a Black woman in her early seventies, short natural silver-grey hair, round tortoiseshell reading glasses, a cream ribbed cardigan over a soft rust top, small gold stud earrings, seated at an oak kitchen table holding a plain cordless phone to her left ear and listening with a calm, attentive expression, her face in three-quarter view turned toward frame right, eyes toward soft morning window light coming from the right. A ceramic mug and a closed notebook with a pen on the table, a sand-coloured wall behind her, a small plant on the windowsill softly out of focus. She sits a little right of centre with her head in the upper third and plain wall above. Natural skin texture with fine lines and visible pores, warm truthful skin tone. Warm neutral palette of cream, sand, oak and soft rust, shallow depth of field, gentle film grain like Kodak Portra 400. Unposed and candid, lips closed, a settled expression. Top fifth and bottom sixth of the frame plain. No text, no letters, no numbers, no logos, no watermark, no visible screen, no clinic, no medication, no wheelchair, no walker, no cane, nobody being supported, no black clothing, no blue or teal colour grade, no HDR, no lens flare, no smoothing of skin, nobody looking at the camera.

#### Slot 2 — `caregiver-scene.jpg` — 16:9 — 2 candidates — ref: hero — **P10** (becomes `caregiver-scene.mp4`)

> Documentary photograph, 35mm lens at f/4, eye level from a few metres away: the same person as in the reference image, a Black woman in her early seventies with short natural silver-grey hair, round tortoiseshell reading glasses, a cream ribbed cardigan over a soft rust top and small gold stud earrings, same face, hair, glasses and cardigan, in a new scene, do not copy the reference's composition. She sits in a wooden porch chair on a covered front porch in soft morning light beside her husband, a Black man of about the same age with close-cropped white hair and a short white beard in an oatmeal cardigan over a sand shirt, each holding their own ceramic mug, both upright and at ease and mid-conversation, neither looking at the camera. A quiet tree-lined street softly out of focus behind the porch railing, a knitted oatmeal blanket over the arm of her chair, a potted fern by the steps. Both figures in the middle of the frame, feet and chair legs fully visible, calm sky and porch ceiling in the top fifth, plain porch boards in the bottom sixth. Natural skin texture, warm truthful skin tones. Warm neutral palette of cream, sand, oatmeal and soft rust, gentle film grain like Kodak Portra 400. Unposed, ordinary morning, no motion blur. No text, no letters, no numbers, no logos, no watermark, no visible screen, no clinic, no medication, no wheelchair, no walker, no cane, nobody being supported, no black clothing, no blue or teal colour grade, no HDR, no lens flare, no smoothing of skin, nobody looking at the camera.

#### Slot 3 — `caregiver-steps.jpg` — 3:2 — ref: hero — **P4**

> Documentary photograph, 50mm lens at f/2.8, eye level: the same person as in the reference image, a Black woman in her early seventies with short natural silver-grey hair, round tortoiseshell reading glasses, a cream ribbed cardigan over a soft rust top and small gold stud earrings, same face, hair, glasses and cardigan, in a new scene, do not copy the reference's composition. She stands in a bright hallway beside a small oak side table, having just picked up a plain cordless phone from its cradle and bringing it to her right ear, her body and face turned toward frame left, eyes toward the morning light coming through the glass panel of a front door on the left, calm and attentive with a faint natural warmth. Light falls across an oak floor, a coat rack and a bowl of keys behind her, a cream wall. She stands a little right of centre with her head in the upper third and plain wall above. Natural skin texture, warm truthful skin tone. Warm neutral palette, shallow depth of field, gentle film grain like Kodak Portra 400. Unposed, lips closed. Top fifth and bottom sixth of the frame plain. No text, no letters, no numbers, no logos, no watermark, no visible screen, no clinic, no medication, no wheelchair, no walker, no cane, nobody being supported, no black clothing, no blue or teal colour grade, no HDR, no lens flare, no smoothing of skin, nobody looking at the camera.

#### Slot 4 — `caregiver-portrait.jpg` — 4:5 — ref: hero + steps — **P16**

> Documentary portrait photograph, 50mm lens at f/2.8, eye level: the same person as in the reference images, a Black woman in her early seventies with short natural silver-grey hair, round tortoiseshell reading glasses, a cream ribbed cardigan over a soft rust top and small gold stud earrings, same face, hair, glasses and cardigan, in a new scene, do not copy the references' composition. She sits at a kitchen table beside her husband, a Black man of about the same age with close-cropped white hair and a short white beard in an oatmeal cardigan, the two of them working on a folded newspaper crossword together with one pencil, both relaxed and absorbed, she looking down at the page and he looking at her, soft window light from the right, a sand-coloured wall, two mugs on the table. Both upright and comfortable, nobody helping or supporting the other. Heads in the upper third of the frame with plain wall above. Natural skin texture, warm truthful skin tones. Warm neutral palette, shallow depth of field, gentle film grain like Kodak Portra 400. Unposed, lips closed, no grin. Top fifth and bottom sixth of the frame plain. No readable print on the newspaper. No text, no letters, no numbers, no logos, no watermark, no visible screen, no clinic, no medication, no wheelchair, no walker, no cane, nobody being supported, no black clothing, no blue or teal colour grade, no HDR, no lens flare, no smoothing of skin, nobody looking at the camera.

#### Slot 5 — `caregiver-detail.jpg` — 1:1 — **P19**

> Documentary still-life photograph, 50mm lens at f/2.8: two cream ceramic mugs of tea, one with a little steam, and a folded newspaper turned so no print is readable, on a small oak porch table in warm side light from the left, a knitted oatmeal blanket over the arm of a porch chair softly out of focus behind, a hint of green garden beyond. Objects in the middle of the frame, plain table top below and soft plain background above. Warm neutral palette of cream, sand, oatmeal and oak, shallow depth of field, gentle film grain like Kodak Portra 400. No person, no hands. No text, no letters, no numbers, no logos, no watermark, no visible screen, no clinic, no medication, no wheelchair, no walker, no cane, nobody being supported, no black clothing, no blue or teal colour grade, no HDR, no lens flare, no smoothing of skin, nobody looking at the camera.

#### Slot 6 — `caregiver-faq.jpg` — 4:5 — ref: hero + steps — **P13**

> Documentary photograph, 50mm lens at f/2.8, eye level: the same person as in the reference images, a Black woman in her early seventies with short natural silver-grey hair, round tortoiseshell reading glasses, a cream ribbed cardigan over a soft rust top and small gold stud earrings, same face, hair, glasses and cardigan, in a new scene, do not copy the references' composition. She sits at a dining table on a video call, a tablet propped on a small stand in front of her and angled away from the camera so its screen is not visible at all, her face turned toward frame right toward the tablet, her expression calm and engaged as she listens, soft window light from the right, a mug and a small vase of garden flowers on the table, a sand-coloured wall. She sits a little right of centre with her head in the upper third and plain wall above. Natural skin texture, warm truthful skin tone. Warm neutral palette, shallow depth of field, gentle film grain like Kodak Portra 400. Unposed, lips closed, no grin. Top fifth and bottom sixth of the frame plain. No text, no letters, no numbers, no logos, no watermark, no visible screen, no clinic, no medication, no wheelchair, no walker, no cane, nobody being supported, no black clothing, no blue or teal colour grade, no HDR, no lens flare, no smoothing of skin, nobody looking at the camera.

#### Slot 7 — `caregiver-final.jpg` — 3:2 — ref: hero + steps — **P7**

> Documentary photograph, 35mm lens at f/4, eye level from a little distance: the same person as in the reference images, a Black woman in her early seventies with short natural silver-grey hair, round tortoiseshell reading glasses, a cream ribbed cardigan over a soft rust top and small gold stud earrings, same face, hair, glasses and cardigan, in a new scene, do not copy the references' composition. She walks unhurried along a garden path in late afternoon light beside her husband, a Black man of about the same age with close-cropped white hair and a short white beard in an oatmeal cardigan, the two of them side by side with a hand's width between them and turned slightly toward each other in conversation, walking toward frame right, seen from the side and a little behind, both walking steadily and easily on their own, roses and a wooden fence softly out of focus. Both figures in the middle of the frame with soft sky and foliage above and plain path below. Natural skin texture, warm truthful skin tones. Warm neutral palette of cream, sand, oatmeal and soft rust, gentle film grain like Kodak Portra 400. Unposed and at ease. No linked arms, nobody holding anyone. No text, no letters, no numbers, no logos, no watermark, no visible screen, no clinic, no medication, no wheelchair, no walker, no cane, nobody being supported, no black clothing, no blue or teal colour grade, no HDR, no lens flare, no smoothing of skin, nobody looking at the camera.

### Depression page (`/depression/`)

Identity block: *a Latino man in his mid-seventies, thick silver hair combed back, a trimmed grey moustache, a
warm grey shawl-collar cardigan over a sand shirt.*

#### Slot 8 — `depression-hero.jpg` — 3:2 — 3 candidates — **P2**

> Documentary photograph, 50mm lens at f/2.8, eye level: a Latino man in his mid-seventies, thick silver hair combed back, a trimmed grey moustache, a warm grey shawl-collar cardigan over a sand shirt, seated upright on an oatmeal sofa beside a tall window, holding a plain mobile phone to his left ear and listening with a calm, open expression, his face in three-quarter view turned toward frame right, eyes toward the soft daylight from the window on the right. A small plant on the sill, a mug on a wooden side table, a cream wall, a lived-in living room. He sits a little right of centre with his head in the upper third and plain wall above. Natural skin texture with fine lines and visible pores, warm truthful skin tone. Warm neutral palette of cream, sand, oak and warm grey, shallow depth of field, gentle film grain like Kodak Portra 400. Unposed and candid, lips closed, a settled expression, upright posture. Top fifth and bottom sixth of the frame plain. No text, no letters, no numbers, no logos, no watermark, no visible screen, no clinic, no medication, no wheelchair, no walker, no cane, nobody being supported, no black clothing, no blue or teal colour grade, no HDR, no lens flare, no smoothing of skin, nobody looking at the camera.

#### Slot 9 — `depression-scene.jpg` — 16:9 — 2 candidates — ref: hero — **P11** (becomes `depression-scene.mp4`)

> Documentary photograph, 35mm lens at f/4, eye level: the same person as in the reference image, a Latino man in his mid-seventies with thick silver hair combed back, a trimmed grey moustache and a warm grey shawl-collar cardigan over a sand shirt, same face, hair and cardigan, in a new scene, do not copy the reference's composition. He stands at a tall bedroom window drawing open sheer linen curtains with both hands, seen from behind and slightly to the side so the edge of his face and moustache are visible, bright morning light already spilling across a wooden floor and a neatly made bed with an oatmeal quilt, cream walls, a wooden chair with a folded cardigan, a small plant on a dresser. An ordinary, bright morning, his posture upright and easy. He stands in the middle third of the frame, plain ceiling and wall in the top fifth, plain floor in the bottom sixth, curtain hems and his feet fully visible. Warm neutral palette of cream, sand, oatmeal and oak, gentle film grain like Kodak Portra 400. Unposed, no motion blur, nobody in the bed. No text, no letters, no numbers, no logos, no watermark, no visible screen, no clinic, no medication, no wheelchair, no walker, no cane, nobody being supported, no black clothing, no blue or teal colour grade, no HDR, no lens flare, no smoothing of skin, nobody looking at the camera.

#### Slot 10 — `depression-steps.jpg` — 3:2 — ref: hero — **P5**

> Documentary photograph, 50mm lens at f/2.8, eye level: the same person as in the reference image, a Latino man in his mid-seventies with thick silver hair combed back, a trimmed grey moustache and a warm grey shawl-collar cardigan over a sand shirt, same face, hair and cardigan, in a new scene, do not copy the reference's composition. He sits at a small wooden desk at home answering a plain cordless phone, bringing it to his right ear, his body and face turned toward frame left, eyes toward morning light from a window on the left, calm and attentive with a faint natural warmth, a blank paper wall calendar and a pen beside him, a plant and a few books with plain spines on a shelf, a cream wall. He sits a little right of centre with his head in the upper third and plain wall above. Natural skin texture, warm truthful skin tone. Warm neutral palette, shallow depth of field, gentle film grain like Kodak Portra 400. Unposed, lips closed. Top fifth and bottom sixth of the frame plain. No readable writing on the calendar or books. No text, no letters, no numbers, no logos, no watermark, no visible screen, no clinic, no medication, no wheelchair, no walker, no cane, nobody being supported, no black clothing, no blue or teal colour grade, no HDR, no lens flare, no smoothing of skin, nobody looking at the camera.

#### Slot 11 — `depression-portrait.jpg` — 4:5 — **P17**

> Documentary portrait photograph, 50mm lens at f/2.8, eye level: a Black woman in her seventies with short silver hair, tortoiseshell reading glasses, a muted sage cardigan over a cream top, seated in a sand-coloured armchair beside a window reading an open hardback book held in both hands, her eyes on the page and a faint amused warmth in her expression, the book and her face turned a little toward frame right, soft daylight on her face from the right, a small plant on the sill, a mug on a side table, a cream wall. She sits a little right of centre with her head in the upper third and plain wall above. Natural skin texture with fine lines and visible pores, warm truthful skin tone. Warm neutral palette of cream, sand and sage, shallow depth of field, gentle film grain like Kodak Portra 400. Natural and unposed, lips closed, upright and at ease. Top fifth and bottom sixth of the frame plain. No readable text on the book. No text, no letters, no numbers, no logos, no watermark, no visible screen, no clinic, no medication, no wheelchair, no walker, no cane, nobody being supported, no black clothing, no blue or teal colour grade, no HDR, no lens flare, no smoothing of skin, nobody looking at the camera.

#### Slot 12 — `depression-detail.jpg` — 1:1 — **P20**

> Documentary still-life photograph, 50mm lens at f/4: a kitchen windowsill in late-morning light with three terracotta pots of fresh herbs, basil, rosemary and thyme, a cream ceramic mug and a small brass watering can, sunlight falling across a wooden counter from the left, a sheer linen curtain softly out of focus at one side, cream wall. Objects in the middle of the frame, plain counter below and plain wall and window light above. Alive and cared for. Warm neutral palette of cream, sand, terracotta and muted sage, gentle film grain like Kodak Portra 400. No person, no hands. No text, no letters, no numbers, no logos, no watermark, no visible screen, no clinic, no medication, no wheelchair, no walker, no cane, nobody being supported, no black clothing, no blue or teal colour grade, no HDR, no lens flare, no smoothing of skin, nobody looking at the camera.

#### Slot 13 — `depression-faq.jpg` — 4:5 — ref: hero + steps — **P14**

> Documentary photograph, 50mm lens at f/2.8, eye level: the same person as in the reference images, a Latino man in his mid-seventies with thick silver hair combed back, a trimmed grey moustache and a warm grey shawl-collar cardigan over a sand shirt, same face, hair and cardigan, in a new scene, do not copy the references' composition. He sits upright in an armchair on a video call, a tablet standing on a small side table in front of him and angled away from the camera so its screen is not visible at all, his face turned toward frame right toward the tablet, his expression calm and engaged as he listens, a bookshelf with plain-spined books and soft window light from the right, a cream wall. He sits a little right of centre with his head in the upper third and plain wall above. Natural skin texture, warm truthful skin tone. Warm neutral palette, shallow depth of field, gentle film grain like Kodak Portra 400. Unposed, lips closed, no grin. Top fifth and bottom sixth of the frame plain. No text, no letters, no numbers, no logos, no watermark, no visible screen, no clinic, no medication, no wheelchair, no walker, no cane, nobody being supported, no black clothing, no blue or teal colour grade, no HDR, no lens flare, no smoothing of skin, nobody looking at the camera.

#### Slot 14 — `depression-final.jpg` — 3:2 — ref: hero + steps — **P8**

> Documentary photograph, 35mm lens at f/4, eye level from the side: the same person as in the reference images, a Latino man in his mid-seventies with thick silver hair combed back, a trimmed grey moustache and a warm grey shawl-collar cardigan over a sand shirt, same face, hair and cardigan, in a new scene, do not copy the references' composition. He stands on a sunlit balcony in the morning watering geraniums and herbs in terracotta pots with a small watering can, absorbed in the task, upright and unhurried, his body angled toward frame right, a quiet street and trees softly out of focus beyond the railing. He stands a little left of centre with soft sky above and plain balcony floor below. Natural skin texture, warm truthful skin tone. Warm neutral palette of cream, sand, terracotta and warm grey, gentle film grain like Kodak Portra 400. Unposed and at ease. No text, no letters, no numbers, no logos, no watermark, no visible screen, no clinic, no medication, no wheelchair, no walker, no cane, nobody being supported, no black clothing, no blue or teal colour grade, no HDR, no lens flare, no smoothing of skin, nobody looking at the camera.

### Grief page (`/grief/`)

Identity block: *a white woman in her mid-seventies, soft white hair in a short bob, no glasses, a muted sage
cardigan over an oatmeal blouse, a thin silver chain.* Her dog: *a small scruffy tan terrier.*

#### Slot 15 — `grief-hero.jpg` — 3:2 — 3 candidates — **P3**

> Documentary photograph, 50mm lens at f/2.8, eye level: a white woman in her mid-seventies, soft white hair in a short bob, no glasses, a muted sage cardigan over an oatmeal blouse, a thin silver chain, seated in a cushioned reading chair beside a window, holding a plain cordless phone to her left ear and listening with a steady, calm expression, her face in three-quarter view turned toward frame right, eyes toward soft afternoon window light from the right. A small scruffy tan terrier asleep on a woven rug at her feet, a wooden side table with a mug, a cream wall, a shelf with a plant. She sits a little right of centre with her head in the upper third and plain wall above. Natural skin texture with fine lines and visible pores, warm truthful skin tone. Warm neutral palette of cream, sand, oak and sage, shallow depth of field, gentle film grain like Kodak Portra 400. Unposed and candid, lips closed, a settled expression. Top fifth and bottom sixth of the frame plain. No text, no letters, no numbers, no logos, no watermark, no visible screen, no clinic, no medication, no wheelchair, no walker, no cane, nobody being supported, no black clothing, no blue or teal colour grade, no HDR, no lens flare, no smoothing of skin, nobody looking at the camera.

#### Slot 16 — `grief-scene.jpg` — 16:9 — 2 candidates — ref: hero — **P12** (becomes `grief-scene.mp4`)

> Documentary photograph, 35mm lens at f/4, eye level from a little distance and slightly behind: the same person as in the reference image, a white woman in her mid-seventies with soft white hair in a short bob, no glasses, a muted sage cardigan over an oatmeal blouse, same face, hair and cardigan, in a new scene, do not copy the reference's composition. She walks a small scruffy tan terrier on a loose lead along a quiet tree-lined residential street in soft autumn light, her stride steady and easy, the dog trotting a step ahead, fallen leaves on the pavement, houses and parked cars softly out of focus, her face turned slightly so her profile shows. She and the dog stand in the middle third of the frame, soft sky and branches in the top fifth, plain pavement in the bottom sixth, feet and paws fully visible. Natural skin texture, warm truthful skin tone. Warm neutral palette of cream, sand, oatmeal, soft rust leaves and sage, gentle film grain like Kodak Portra 400. Unposed, an ordinary walk, no motion blur. No street signs. No text, no letters, no numbers, no logos, no watermark, no visible screen, no clinic, no medication, no wheelchair, no walker, no cane, nobody being supported, no black clothing, no blue or teal colour grade, no HDR, no lens flare, no smoothing of skin, nobody looking at the camera.

#### Slot 17 — `grief-steps.jpg` — 3:2 — ref: hero — **P6**

> Documentary photograph, 50mm lens at f/2.8, eye level: the same person as in the reference image, a white woman in her mid-seventies with soft white hair in a short bob, no glasses, a muted sage cardigan over an oatmeal blouse and a thin silver chain, same face, hair and cardigan, in a new scene, do not copy the reference's composition. She stands at a kitchen counter answering a plain cordless phone, bringing it to her right ear, her body and face turned toward frame left, eyes toward morning light through a window over the sink on the left, calm and attentive with a faint natural warmth, a kettle and two ceramic mugs on the wooden counter, cream cabinets, a small pot of herbs on the sill, the small tan terrier sitting on the floor at her feet. She stands a little right of centre with her head in the upper third and plain wall above. Natural skin texture, warm truthful skin tone. Warm neutral palette, shallow depth of field, gentle film grain like Kodak Portra 400. Unposed, lips closed. Top fifth and bottom sixth of the frame plain. No text, no letters, no numbers, no logos, no watermark, no visible screen, no clinic, no medication, no wheelchair, no walker, no cane, nobody being supported, no black clothing, no blue or teal colour grade, no HDR, no lens flare, no smoothing of skin, nobody looking at the camera.

#### Slot 18 — `grief-portrait.jpg` — 4:5 — **P18**

> Documentary portrait photograph, 50mm lens at f/2.8, eye level: a Black man in his seventies with short grey hair and a neatly trimmed grey beard, a cardigan in warm grey over a cream shirt, seated at a wooden kitchen table with a mug of tea in one hand and a folded newspaper crossword and a pencil in front of him, looking toward frame right out of a window at a bird feeder in the garden with a faint smile, morning light from the right on his face, a cream wall, a small vase of garden flowers on the table. He sits a little right of centre with his head in the upper third and plain wall above. Natural skin texture with fine lines and visible pores, warm truthful skin tone. Warm neutral palette of cream, sand, oak and warm grey, shallow depth of field, gentle film grain like Kodak Portra 400. Natural and unposed, lips closed, upright and at ease. Top fifth and bottom sixth of the frame plain. No readable print on the newspaper. No text, no letters, no numbers, no logos, no watermark, no visible screen, no clinic, no medication, no wheelchair, no walker, no cane, nobody being supported, no black clothing, no blue or teal colour grade, no HDR, no lens flare, no smoothing of skin, nobody looking at the camera.

#### Slot 19 — `grief-detail.jpg` — 1:1 — **P21**

> Documentary still-life photograph, 50mm lens at f/2.8: a small wooden porch table in late afternoon light with a cream ceramic mug of tea with a little steam rising, a coiled tan leather dog lead and a pair of folded reading glasses, roses and a garden hedge softly out of focus behind, warm side light from the left. Objects in the middle of the frame, plain table top below and soft plain background above. A place someone sits every afternoon before a walk, the tea just made. Warm neutral palette of cream, sand, oak and sage, shallow depth of field, gentle film grain like Kodak Portra 400. No person, no hands, no plaque, no cut flowers laid down. No text, no letters, no numbers, no logos, no watermark, no visible screen, no clinic, no medication, no wheelchair, no walker, no cane, nobody being supported, no black clothing, no blue or teal colour grade, no HDR, no lens flare, no smoothing of skin, nobody looking at the camera.

#### Slot 20 — `grief-faq.jpg` — 4:5 — ref: hero + steps — **P15**

> Documentary photograph, 50mm lens at f/2.8, eye level: the same person as in the reference images, a white woman in her mid-seventies with soft white hair in a short bob, no glasses, a muted sage cardigan over an oatmeal blouse and a thin silver chain, same face, hair and cardigan, in a new scene, do not copy the references' composition. She sits at a kitchen table on a video call, a tablet propped on a stand in front of her and angled away from the camera so its screen is not visible at all, her face turned toward frame right toward the tablet, her expression calm and engaged as she listens, a small vase of garden flowers and a mug on the table, window light from the right, a cream wall, the small tan terrier curled on a chair cushion beside her softly out of focus. She sits a little right of centre with her head in the upper third and plain wall above. Natural skin texture, warm truthful skin tone. Warm neutral palette, shallow depth of field, gentle film grain like Kodak Portra 400. Unposed, lips closed, no grin. Top fifth and bottom sixth of the frame plain. No text, no letters, no numbers, no logos, no watermark, no visible screen, no clinic, no medication, no wheelchair, no walker, no cane, nobody being supported, no black clothing, no blue or teal colour grade, no HDR, no lens flare, no smoothing of skin, nobody looking at the camera.

#### Slot 21 — `grief-final.jpg` — 3:2 — ref: hero + steps — **P9**

> Documentary photograph, 35mm lens at f/4, eye level from a little distance: the same person as in the reference images, a white woman in her mid-seventies with soft white hair in a short bob, no glasses, a muted sage cardigan over an oatmeal blouse and a thin silver chain, same face, hair and cardigan, in a new scene, do not copy the references' composition. She sits side by side with a friend, an East Asian woman of about the same age with grey hair pinned back in an oatmeal cardigan, on a wooden porch step in morning light, each holding a mug of coffee, mid-conversation and relaxed, both turned a little toward frame right, neither looking at the camera, the small tan terrier lying on the path in front of them, a garden softly out of focus. Both sit upright and at ease, nobody helping the other. Both figures in the middle of the frame with plain porch and foliage above and plain path below. Natural skin texture, warm truthful skin tones. Warm neutral palette of cream, sand, oatmeal and sage, gentle film grain like Kodak Portra 400. Unposed. No text, no letters, no numbers, no logos, no watermark, no visible screen, no clinic, no medication, no wheelchair, no walker, no cane, nobody being supported, no black clothing, no blue or teal colour grade, no HDR, no lens flare, no smoothing of skin, nobody looking at the camera.

### Confirmation page (`/thanks/`)

`senior-hero.jpg`, `senior-hero.mp4`, `senior-hero-poster.jpg` (4:5) are **already installed. Do not regenerate.**

**Checkpoint.** Report delivered files (with the three chosen scene stills attached), credits spent and remaining,
and the checked Kling price, then **stop and wait for the operator's explicit go-ahead** before any video call.

## 5. The 3 clips — Kling 3.0 pro, 16:9, 5 s, exact prompts and calls

The site plays each clip muted and looped inside the scene frame, honours `prefers-reduced-motion`, and shows the
still otherwise, so a clip must begin and end on its chosen still. Pass the same file as `--start-image` and
`--end-image`; the motion in the prompt keeps the clip alive between the two and the return to the start frame
must be smooth. Camera locked off; motion is only light, fabric, leaves, steam, a slow breath, a small turn of the
head or two easy steps. 5 seconds, `--mode pro`, `--sound off`.

```bash
higgsfield generate create kling3_0 --prompt "<CLIP PROMPT>" --start-image ./<page>-scene.jpg --end-image ./<page>-scene.jpg --aspect_ratio 16:9 --duration 5 --mode pro --sound off --wait --json --wait-timeout 30m
```

### `caregiver-scene.mp4` — from `caregiver-scene.jpg`

> Locked-off camera, no camera movement. The woman and the man on the porch stay seated and stay in frame. Subtle motion only: both breathe slowly, she lifts her mug a few centimetres and lowers it again, he turns his head a few degrees toward her and back, the knitted blanket on the chair arm stirs faintly, leaves on the street trees move in a light breeze and the morning light warms almost imperceptibly. Smooth and continuous; the motion returns to the starting composition. Preserve composition, colours, faces, glasses and clothing exactly as in the image. Photorealistic, calm, documentary. No speech, no standing up, no hand gesture toward camera, no zoom, no pan, no cuts, no new people or objects, no text, nobody looking at the camera.

### `depression-scene.mp4` — from `depression-scene.jpg`

> Locked-off camera, no camera movement. The man at the window stays standing and stays in frame. Subtle motion only: the sheer linen curtains drift slowly in a faint breeze as he holds them open, the morning light on the wooden floor and the quilt brightens very slowly as if a thin cloud passes, his shoulders rise and fall with one slow breath, the plant on the dresser stirs faintly. Smooth and continuous; the motion returns to the starting composition. Preserve composition, colours, clothing and the room exactly as in the image. Photorealistic, calm, documentary. No turning around, no speech, no zoom, no pan, no cuts, no new people or objects, no text.

### `grief-scene.mp4` — from `grief-scene.jpg`

> Locked-off camera, no camera movement. The woman and the small dog take two slow, easy steps forward along the pavement and settle, staying in frame, her cardigan and the lead moving naturally with the steps, the dog's tail and ears moving; fallen leaves drift across the pavement in a light breeze and the branches above sway gently. Smooth and continuous; the motion returns close to the starting composition. Preserve composition, colours, face, hair and clothing exactly as in the image. Photorealistic, calm, documentary. No stumble, no looking at the camera, no speech, no zoom, no pan, no cuts, no new people or objects, no text.

**Selection.** Reject a clip if it contains a camera move, a new person or object, speech, a face that drifts from
the still, or a visible jump at the loop point. If a clip is essentially static, the first retry keeps Kling, keeps
both start and end image and appends to the prompt: "Motion must be clearly visible: the breath is deep, the leaves
move noticeably, the fabric visibly stirs." If the second attempt is still static or the face drifts, the last retry
is Seedance 2.0 with the same prompt and images:

```bash
higgsfield generate create seedance_2_0 --prompt "<CLIP PROMPT>" --start-image ./<page>-scene.jpg --end-image ./<page>-scene.jpg --aspect_ratio 16:9 --duration 5 --resolution 1080p --mode std --generate_audio false --wait --json --wait-timeout 30m
```

Never drop `--end-image`; the site loops every clip and a non-loop would jump-cut.

**Post-processing (no re-encode):**
```bash
ffmpeg -i in.mp4 -c:v copy -an -movflags +faststart <page>-scene.mp4
ffmpeg -i <page>-scene.mp4 -frames:v 1 -q:v 2 <page>-scene-poster.jpg
```

## 6. Delivery

Filenames must match the pages' `data-asset`, `data-video` and `data-poster` values exactly. The pages load each
file as-is (no server-side resizing), so deliver a **web-sized set** (this is what gets installed) and keep the
originals beside it.

Web sizes (long edge, sRGB, JPEG quality 85, metadata stripped; never upscale, never crop to another ratio):
`*-scene.jpg` and `*-scene-poster.jpg` 2400×1350 · `*-hero.jpg`, `*-steps.jpg`, `*-final.jpg` 1600×1067 ·
`*-portrait.jpg`, `*-faq.jpg` 1200×1500 · `*-detail.jpg` 1200×1200. For example with ImageMagick:
`magick original.jpg -resize 1600x1600\> -strip -colorspace sRGB -quality 85 caregiver-hero.jpg`. Clips stay as
Kling delivers them (1080p for `--mode pro`), stripped of audio as in Section 5.

```
total-life-v5/
  web/                       ← install this folder's contents
    caregiver-hero.jpg   caregiver-scene.jpg   caregiver-scene.mp4   caregiver-scene-poster.jpg
    caregiver-steps.jpg  caregiver-portrait.jpg caregiver-detail.jpg caregiver-faq.jpg caregiver-final.jpg
    depression-hero.jpg  depression-scene.jpg  depression-scene.mp4  depression-scene-poster.jpg
    depression-steps.jpg depression-portrait.jpg depression-detail.jpg depression-faq.jpg depression-final.jpg
    grief-hero.jpg       grief-scene.jpg       grief-scene.mp4       grief-scene-poster.jpg
    grief-steps.jpg      grief-portrait.jpg    grief-detail.jpg      grief-faq.jpg      grief-final.jpg
  originals/               ← full-size 2k stills, same names
  alternates/              ← caregiver-hero-alt1.jpg … grief-scene-alt1.jpg, and any rejected clip as <page>-scene-rejected1.mp4
  manifest.json
```

`manifest.json`: plan, starting and ending balance, checked prices, and one entry per generation including
failures: `file`, `slot`, `model`, `prompt`, `reference_images`, `aspect_ratio`, `resolution_or_duration`,
`job_id`, `credits_charged`, `refunded`, `generated_at`, `notes`, `generated: true`. Every image is AI-generated
and is never to be captioned or described as a real member, patient or client.

**Install (coordinator).** Copy everything in `web/` into `assets/img/people/` in the repository (nothing goes in a
subfolder; `alternates/` and `originals/` are not installed). Then run `npm run assets` from the repository root.
That script (`tools/assets-index.mjs`) rebuilds `assets/img/people/index.json` (and `assets/img/textures/index.json`)
as a sorted JSON array of every `.jpg/.jpeg/.png/.webp/.mp4/.webm` filename in the folder; `assets/js/tl.js` only
attaches a still or clip whose exact filename appears in that array, so a file that is not indexed is never
requested and its frame keeps its placeholder. After the run, `assets/img/people/index.json` must list the existing
`senior-hero.jpg`, `senior-hero.mp4`, `senior-hero-poster.jpg` plus the 21 stills, 3 clips and 3 posters above
(the `senior-therapist-*.jpg` files are legacy and harmless). Partial deliveries are fine: index only what exists.
Verify with `node tools/screens.mjs all` (expects the local server on :4173) and check that the scene band shows
the clip on desktop and the still under reduced motion.

## 7. Final checklist

- [ ] Preflight recorded: plan, balance, workspace, model availability, `--image` accepted by `nano_banana_2`, checked prices
- [ ] Prompts used verbatim, including the shared exclusion sentence; each page's hero generated and chosen before its referenced slots; P1–P21 order respected (reference-dependency exception only)
- [ ] 21 stills at exactly 3:2 / 16:9 / 4:5 / 1:1 (verified with an image tool), web-sized copies at the stated long edges, originals kept
- [ ] Every still passes Section 3; the recurring person is recognisably the same across hero, scene, steps, faq, final (and portrait on the caregiver page)
- [ ] Gaze: frame-right on hero, portrait, FAQ, final; frame-left on steps; no one looks at the lens
- [ ] Checkpoint report sent and operator go-ahead received before any clip
- [ ] 3 clips, 16:9, 5 s, MP4 without audio, subtle motion only, start = end frame, posters saved
- [ ] Every charge logged with its balance delta; no automatic retries
- [ ] Final report: delivered, skipped and why, credits used, credits remaining, and the install instruction repeated
