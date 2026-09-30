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
| Confirmation | http://localhost:4173/thanks/ | After the form: HubSpot calendar (Peggy + Angela round robin), conversion events |
| Review index | http://localhost:4173/ | Internal links to all pages |

Every page's job is now the same: **book a call with the care team**. The form collects first name, last name,
phone, email, date of birth and ZIP over three steps (the self-check page asks its four questions first), posts
the lead to HubSpot, and sends the visitor to `/thanks/` to pick a time. Hero variants for ad message match:
`/senior/?v=caregiver-stress`, `/senior/?v=caregiver-support`.

## Structure

```
assets/css/tl.css      shared design system (tokens + components) — the brand rules live here
assets/js/config.js    every ID in one place: HubSpot portal / form / meetings link, Meta Pixel, Google Ads, GA4
assets/js/track.js     UTM + click-id capture, Meta Pixel, Google tag, HubSpot tracking code, conversion events
assets/js/tl.js        multi-step form (validation, HubSpot submit, redirect), variants, FAQ, reveal, sticky CTA
assets/fonts/          self-hosted Inter + Inter Tight (brand type)
assets/img/            logo.png and flower.png, cropped from the master brand file
senior/ caregiver/ check/   one index.html each; page-scoped CSS lives in the <head>
docs/conversion-principles.md   research and the ten rules every page follows (with sources)
docs/build-brief.md             the brief each page was built to
docs/hubspot-setup.md           access needed, round-robin calendar, form, lead views, channel
docs/ads-launch.md              Google Search ad group + Meta ad set per angle, UTMs, conversions, stop rule
docs/compliance-migration.md    what carries over from totallife.com, what is still a placeholder, scrape tool
docs/brand-book-extract.txt     text of the brand book, for reference
tools/                 Playwright checks (see below)
```

## Placeholders

Copy that depends on decisions not yet made is left in square brackets and must be replaced before launch:
`[THERAPIST NAME]`, `[LCSW · 14 yrs with older adults]`, `[PORTRAIT: …]` (photo direction inside every `.portrait` frame),
and the footer link `[HIPAA NOTICE OF PRIVACY PRACTICES]` (URL to be taken from the live site, see `docs/compliance-migration.md`).
Stats, the member quote, founder quotes, and carrier names come from the brand book and are used verbatim with their source line.

## Installing generated assets

Drop the files from the generation job into `assets/img/people/` (stills, `*.mp4`, `*-poster.jpg`), then run
`npm run assets` to rebuild `assets/img/people/index.json`. Frames pick up any listed file automatically; unlisted
frames keep their placeholder. Clips play muted and looped, switch the frame to the clip's ratio so the still and
clip share one crop, and are skipped under `prefers-reduced-motion`. **Do not install the generated founder
placeholder**: the caregiver page labels that frame as Neelam Brar, so only a real photograph belongs there. All
therapist images are placeholders until named Total Life providers replace them (brand book: no stock clinicians).
The generation brief lives in `docs/higgsfield-agent-prompt.md`.

## Wiring HubSpot, Meta and Google

Fill `assets/js/config.js`. Nothing else needs editing.

- **HubSpot form:** the last step POSTs to the Forms API (`api.hsforms.com/submissions/v3/integration/submit/<portalId>/<formGuid>`) with the six fields plus hidden attribution fields (`utm_*`, `gclid`, `fbclid`, `landing_page`, `landing_variant`). If the HubSpot form lacks a hidden field the request is retried with the six core fields. The `hubspotutk` cookie is attached when the tracking code has loaded.
- **Calendar:** `/thanks/` embeds `hubspot.meetingsLink` with `embed=true` and the visitor's first name, last name and email pre-filled. When HubSpot posts `meetingBookSucceeded`, the page shows "You're booked" and fires the booked conversion.
- **Conversions:** `tlConvert('lead')` on `/thanks/` (Meta `Lead`, Google Ads `leadLabel`, GA4 `generate_lead`), `tlConvert('booked')` on calendar booking (Meta `Schedule`, Google Ads `bookedLabel`). Each fires once per session. No health parameters are ever sent.
- **Events:** every CTA and form step calls `window.tlTrack(name, data)` → `dataLayer` and GA4 when configured.

## Verification tools (need `npm i` for Playwright)

```bash
node tools/screens.mjs all      # full-page + above-fold PNGs at 1920 / 834 / 375 → screens/, reports overflow + console errors
node tools/states.mjs           # walks every form end to end (errors, dob/zip formatting, redirect to /thanks/) and the hero variants; exits 1 on failure
node tools/scrape-compliance.mjs # from a machine that can reach totallife.com: saves policy text + footer links into docs/compliance/
node tools/audit.mjs            # headings, labels, alt, text size, tap targets, banned Medicare phrases, stamp above fold
node tools/motion.mjs           # reveal + stat count-up with motion enabled
```

## Compliance

All copy was written against Part V of the brand book: no "free therapy", no urgency, qualified coverage language
("Most members are covered up to 100% with Medicare + supplemental insurance"), "Total Life is an enrolled Medicare
provider", sources on every number, 988 crisis line in every footer. The self-check page shows no score or result tier.
Final sign-off from Total Life legal/compliance is still required before publication.
