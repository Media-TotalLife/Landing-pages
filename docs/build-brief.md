# Build brief — one landing page, Total Life

You are building ONE landing page inside `/home/user/Landing-pages`. It must use the shared system
in `assets/css/tl.css` and `assets/js/tl.js` (read both fully first — every class you need exists).
Read `docs/conversion-principles.md` and `docs/brand-book-extract.txt` (pages 10–18, 20–23, 25, 29–30, 33, 36–38)
before writing a line. The two reference mockups are `docs/ref-landing-senior.png` and `docs/ref-landing-caregiver.png`:
match their register, then exceed their polish.

## Non-negotiable brand rules
- Page background `var(--bg)` (#FFFAF6). Never pure white. Cream (#F7F3F0) for cards, sand (#F6E8D4) for callout sections. No dark blocks anywhere. No navy backgrounds. No teal or coral filled sections (the only coral fill is the primary button).
- Headings teal (default `h1–h4`). Exactly ONE coral word/phrase per headline via `<span class="accent">`. Headlines under 8 words.
- Body text navy, 18px minimum (already the default). Never body text in coral/teal/sand.
- Primary CTA: `class="btn btn--primary"`, one per viewport. Secondary only as `btn--secondary`.
- "Covered by Medicare" stamp (`<div class="stamp">Covered<br>by<br>Medicare</div>`) above the fold beside the hero CTA.
- Phone `1-800-567-LIFE` in header (`.phone` with `href="tel:+18005675433"`), in the hero reassurance line, in the success state, in the final CTA and footer. Never hidden.
- Gradients only inside `.portrait` frames. Solid colors everywhere else.
- No urgency, no "limited spots", no "free therapy", no "no cost" without the supplemental qualifier, no absolute outcome claims, no discounts. Coverage line to use verbatim: "Most members are covered up to 100% with Medicare + supplemental insurance." Use "Total Life is an enrolled Medicare provider." in the footer legal.
- Stats allowed (they come from the brand book, cite the source line under them): 200+ licensed therapists across 49 states · 92% therapist retention · 3 sessions to feel hope, on average · 68% of members report meaningful improvement after 3 sessions (Internal outcomes data, Q3 2024, N=2,847) · 3× more likely to feel hopeful after three sessions.
- Real member quote allowed (brand book): "As a senior, it was difficult to find resources that cater to my experience. Total Life does. I feel like I am in good hands and can trust that my therapist will help me work through any challenges I may be facing." — Total Life Member · joined March 2024.
- Founder: Neelam Brar, Founder & CEO. Her quotes from the brand book may be used verbatim.
- Carriers accepted (carrier bar): Medicare · Mutual of Omaha · Humana · HCSC · BCBS · AARP · UHC.
- Everything else that is not in the brand book is a PLACEHOLDER in square brackets: `[THERAPIST NAME]`, `[LCSW · 14 yrs with older adults]`, `[SECOND TESTIMONIAL]`, `[CITY, STATE]`, `[FORM ENDPOINT]`. Photos are `.portrait` frames with `data-placeholder="[PORTRAIT: …describe the exact shot…]"`. Never invent realistic-looking specifics.
- Icons: inline SVG, always paired with a text label. No icon-only buttons. No hamburger menu. No carousel. No chatbot. No autoplay video.
- `prefers-reduced-motion` is handled by the system; keep `[data-reveal]` usage light (section headers and cards, not body copy). Senior page: almost none.
- Crisis line in the footer: "If you or someone you love is in crisis, call or text 988."

## Page skeleton (every page)
```
<a class="skip" href="#main">Skip to main content</a>
<header class="header"> .wrap > a.logo(img assets/img/logo.png alt "Total Life") · nav.nav (2–3 anchor links) · a.phone[href=tel:+18005675433] (svg + <span><small>Call us today</small><b>1-800-567-LIFE</b></span>)
<main id="main">
  hero .section (eyebrow · h1 with one .accent · .lede · primary CTA with data-hero-cta data-track · .stamp · .reassure line with phone) + .portrait on the right
  trust .stat-band (3 stats, coral figures, cited .source)
  how-it-works .section--sand (4 .step cards, numbered 01–04)
  the coverage-check / intake form: .form-card containing form.tl-form#coverage-form[data-endpoint="[FORM ENDPOINT]"]
      .progress (span "Step 1 of 3" + .bar > i) → .tl-step ×3 → .tl-step.tl-step--success .success
      Step buttons: <button type="button" class="btn btn--primary" data-next>Continue</button> and <button type="button" class="btn btn--back" data-back>Back</button>
      Radio choices: <label class="choice"><input type="radio" name="…" value="…"><span class="dot"></span><span>Label<small>help</small></span></label>
      Text fields: <div class="field"><label for="x">Label</label><input class="input" id="x" name="x" type="tel" required autocomplete="tel" inputmode="tel"><div class="error"><svg…/><span></span></div></div>
      Each step has a <div class="error"> directly inside for radio errors.
      .privacy line: lock icon + "We only use this to call you about your coverage. We never sell your information."
      Success: .tick, h3 "Thank you, <span data-fill="first_name" data-fallback="friend">friend</span>.", body copy with what happens next, .phone-big tel link.
  proof: member .quote + named therapist .portrait grid (3, placeholders, .chip with [THERAPIST NAME] · [CREDENTIAL]) + .carriers bar
  FAQ .faq (5–6 <details><summary>Question<span class="plus">+</span></summary><div class="answer">…</div></details>)
  final CTA .section (h2 mirroring the hero, primary CTA linking to #coverage-form with data-focus-form, phone)
</main>
<div class="sticky-cta"> a.btn.btn--primary[href=#coverage-form][data-focus-form] · a.call[href=tel:…][aria-label="Call 1-800-567-LIFE"] </div>
<footer class="footer"> logo + one-line descriptor · two link columns · .legal (Medicare provider disclosure, coverage qualifier, stat source, crisis 988, © 2026 Total Life · [PRIVACY POLICY] · [TERMS] · [HIPAA NOTICE]) </footer>
<script src="../assets/js/tl.js" defer></script>
```
`<body data-page="senior|caregiver|check">`. Put a `<style>` block in the head only for page-specific layout (hero grid, page-unique components). Keep page CSS under ~200 lines; prefer the system.

## Head
```
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>[Page title] | Total Life</title>
<meta name="description" content="…">
<link rel="icon" href="../assets/img/flower.png">
<link rel="preload" href="../assets/fonts/InterTight-700-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="../assets/fonts/Inter-400-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="../assets/css/tl.css">
```

## Quality bar
- Every CTA and form has a `data-track="…"` id (e.g. `hero_cta`, `sticky_cta`, `final_cta`, `header_phone`).
- Responsive 1920 → 375 with no horizontal overflow. Hero stacks under 900px (copy first, portrait second). Test mentally at 375: h1 ~40px, CTA full-width.
- Semantic landmarks, one h1, headings in order, alt text on the logo, aria-labels on icon links, `<label for>` on every input, `aria-live="polite"` on the form card.
- Reading level: senior pages 6th–8th grade (sentences under 20 words). Caregiver 8th–10th.
- Craft: generous whitespace, balanced measure (`.lede` ≤ 36em), a coral-dot `.divider` between major sections where it helps rhythm, an oversized `.stamp-bg` flower behind one or two sections (never behind the form), portraits with `.chip` captions.
- When done, run `cd /home/user/Landing-pages && node tools/screens.mjs <page>` and look at the PNGs in `screens/` at all three widths. Fix anything off before you finish. Report: what you built, what you checked, any open questions.
