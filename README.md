# Total Life — landing pages

Three high-converting landing pages built on the **Total Life Brand & Marketing System (Edition 01 · 2026)**.
Static HTML/CSS/JS, no build step, no framework.

## Run locally

```bash
npm start          # serves the repo at http://localhost:4173
```

| Page | URL | Audience · job |
|---|---|---|
| Senior coverage check | http://localhost:4173/senior/ | Adults 65+ · start a Medicare coverage check |
| Caregiver funnel | http://localhost:4173/caregiver/ | Adult daughters/sons · "we make the first call" |
| Self-check | http://localhost:4173/check/ | Adults 65+ who dismiss how they feel · 4 gentle questions, then coverage |
| Review index | http://localhost:4173/ | Internal links to all three |

## Structure

```
assets/css/tl.css      shared design system (tokens + components) — the brand rules live here
assets/js/tl.js        multi-step form, FAQ, reveal, stat count-up, sticky mobile CTA, tracking hook
assets/fonts/          self-hosted Inter + Inter Tight (brand type)
assets/img/            logo.png and flower.png, cropped from the master brand file
senior/ caregiver/ check/   one index.html each; page-scoped CSS lives in the <head>
docs/conversion-principles.md   research and the ten rules every page follows (with sources)
docs/build-brief.md             the brief each page was built to
docs/brand-book-extract.txt     text of the brand book, for reference
tools/                 Playwright checks (see below)
```

## Placeholders

Copy that depends on decisions not yet made is left in square brackets and must be replaced before launch:
`[THERAPIST NAME]`, `[LCSW · 14 yrs with older adults]`, `[PORTRAIT: …]` (photo direction inside every `.portrait` frame),
`[FORM ENDPOINT]` (on each `form.tl-form`), footer links `[PRIVACY POLICY]`, `[TERMS]`, `[HIPAA NOTICE]`, `[ABOUT US]`, etc.
Stats, the member quote, founder quotes, and carrier names come from the brand book and are used verbatim with their source line.

## Wiring the form and analytics

- **Form submit:** in `assets/js/tl.js`, `complete()` collects `data` (all radio + text answers). Replace the commented `fetch` with your CRM / intake POST.
- **Analytics:** every CTA and form step calls `window.tlTrack(name, data)`. It pushes to `window.dataLayer` if present. Override `window.tlTrack` before `tl.js` loads to send to GA4, Segment, CallRail, etc. Every CTA carries a stable `data-track` id.

## Verification tools (need `npm i` for Playwright)

```bash
node tools/screens.mjs all      # full-page + above-fold PNGs at 1920 / 834 / 375 → screens/, reports overflow + console errors
node tools/states.mjs           # walks every form: error, field error, mid-step, success, FAQ open, sticky bar
node tools/audit.mjs            # headings, labels, alt, text size, tap targets, banned Medicare phrases, stamp above fold
node tools/motion.mjs           # reveal + stat count-up with motion enabled
```

## Compliance

All copy was written against Part V of the brand book: no "free therapy", no urgency, qualified coverage language
("Most members are covered up to 100% with Medicare + supplemental insurance"), "Total Life is an enrolled Medicare
provider", sources on every number, 988 crisis line in every footer. The self-check page shows no score or result tier.
Final sign-off from Total Life legal/compliance is still required before publication.
