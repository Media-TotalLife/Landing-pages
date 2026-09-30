# Total Life — landing pages

Three high-converting landing pages built on the **Total Life Brand & Marketing System (Edition 01 · 2026)**.
Static HTML/CSS/JS, no build step, no framework.

## Run locally

```bash
npm start          # serves the repo at http://localhost:4173
```

| Page | URL | Audience · job |
|---|---|---|
| Senior (general) | http://localhost:4173/senior/ | Adults 65+ · variants `?v=caregiver-stress`, `?v=caregiver-support` |
| Caregiver support | http://localhost:4173/caregiver/ | Adults 65+ caring for someone, family welcome to book |
| Depression | http://localhost:4173/depression/ | Adults 65+ · depression therapy theme |
| Grief and loss | http://localhost:4173/grief/ | Adults 65+ · grief counseling theme |
| Privacy Policy | http://localhost:4173/privacy/ | Total Life Inc. policy text, filled by `node tools/scrape-compliance.mjs --write` |
| Confirmation | http://localhost:4173/thanks/ | After booking in the HubSpot widget: conversion events fire here |
| Review index | http://localhost:4173/ | Internal links to all pages |

Every page has one event: **book a call**. The HubSpot round-robin booking widget (Peggy + Angela, 9 am to
9 pm Eastern) sits in the hero beside the headline; its booking form collects first name, last name, email, phone,
date of birth and state. Booking redirects to `/thanks/`, where the Meta and Google conversions fire. The full spec
is `docs/build-plan-v2.md`.

## Structure

```
assets/css/tl.css      shared design system (tokens + components) — the brand rules live here
assets/js/config.js    every ID in one place: HubSpot portal ID and meetings link, Meta Pixel, Google Ads, GA4
assets/js/track.js     UTM + click-id capture, Meta Pixel, Google tag, HubSpot tracking code, conversion events
assets/js/tl.js        HubSpot booking embed + booked redirect, hero variants, FAQ, reveal, sticky CTA, asset attach
assets/fonts/          self-hosted Inter + Inter Tight (brand type)
assets/img/            logo.png and flower.png, cropped from the master brand file
senior/ caregiver/ depression/ grief/ thanks/ privacy/   one index.html each; page-scoped CSS lives in the <head>
docs/conversion-principles.md   research and the ten rules every page follows (with sources)
docs/build-brief.md             the original brief
docs/build-plan-v2.md           the current spec: page anatomy, copy rules, technical contract, review gates
docs/targeting.md               who each page targets, with evidence from the call notes and totallife.com; requirements traceability
docs/hubspot-setup.md           access needed, round-robin calendar, form, lead views, channel
docs/ads-launch.md              Google Search ad group + Meta ad set per angle, UTMs, conversions, stop rule
docs/compliance-migration.md    what carries over from totallife.com, what is still a placeholder, scrape tool
docs/brand-book-extract.txt     text of the brand book, for reference
tools/                 Playwright checks (see below)
```

## Placeholders

Copy that depends on decisions not yet made is left in square brackets and must be replaced before launch:
`[THERAPIST NAME]`, `[LCSW · 14 yrs with older adults]`, `[PORTRAIT: …]` (photo direction inside every `.portrait` frame),
`[VETTED OPT-IN LANGUAGE]` under every booking widget, and the footer link `[HIPAA NOTICE OF PRIVACY PRACTICES]` (URL to be taken from the live site, see `docs/compliance-migration.md`).
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

- **Booking widget:** `hubspot.meetingsLink` is embedded in every page's `.booking-card` with `embed=true`. When HubSpot posts `meetingBookSucceeded`, `tl.js` fires the booked conversion and sends the visitor to `/thanks/`. Also set HubSpot's own post-booking redirect to `/thanks/` (see `docs/hubspot-setup.md`).
- **Tracking code:** `hubspot.portalId` loads `js.hs-scripts.com/<id>.js` so bookings attach to the visit source (UTMs, gclid).
- **Conversions:** `/thanks/` fires `tlConvert('lead')` and `tlConvert('booked')` once per session: Meta `Lead` + `Schedule`, Google Ads `leadLabel` + `bookedLabel`, GA4 events. No health parameters are ever sent.
- **Events:** every CTA calls `window.tlTrack(name, data)` → `dataLayer` and GA4 when configured.

## Verification tools (need `npm i` for Playwright)

```bash
node tools/screens.mjs all      # full-page + above-fold PNGs at 1920 / 834 / 375 → screens/, reports overflow + console errors
node tools/states.mjs           # booking card present, CTAs target #book, phone digits, no <form>, sticky bar, variants, thanks conversions; exits 1 on failure
node tools/tracking-test.mjs    # stubs HubSpot, Meta and Google with a test config: proves embed, attribution, booking redirect, one-time conversions
node tools/scrape-compliance.mjs # from a machine that can reach totallife.com: saves policy text + footer links into docs/compliance/
node tools/audit.mjs            # headings, labels, alt, text size, tap targets, banned Medicare phrases, stamp above fold
node tools/motion.mjs           # reveal + stat count-up with motion enabled
```

## Compliance

All copy was written against Part V of the brand book: no "free therapy", no urgency, qualified coverage language
("Most members are covered up to 100% with Medicare + supplemental insurance"), "Total Life is an enrolled Medicare
provider", sources on every number, 988 crisis line in every footer. 
Final sign-off from Total Life legal/compliance is still required before publication.
