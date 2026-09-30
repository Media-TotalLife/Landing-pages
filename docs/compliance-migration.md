# Compliance migration from totallife.com

Goal: every legal and compliance element on the existing Total Life site is present on the landing pages, and the
landing pages are set up as a HubSpot-tracked channel with the same identity (legal name, contact points, policies).

## What could be confirmed from here

The build environment cannot reach totallife.com (outbound requests are blocked), so the pages themselves could
not be scraped from this session. From public search results, these are the live policy URLs and facts:

| Item | Value | Status |
|---|---|---|
| Legal entity | **Total Life Inc.** (named in the Terms and Conditions) | Used in the footer copyright |
| Privacy Policy | https://totallife.com/privacy/ | Reproduced on `/privacy/` (text pending: run the scrape with `--write`); every footer links there |
| Terms and Conditions | https://totallife.com/termsandconditions/ | Linked in every footer |
| Consent to Telehealth and Therapy | https://totallife.com/consent-to-telehealth-and-therapy/ | Linked in every footer |
| Notice of Privacy Practices (HIPAA) | Referenced by the Terms and the Consent page; URL not found in search | **Placeholder `[HIPAA NOTICE OF PRIVACY PRACTICES]` in footers. Find the URL on the live site's footer and replace.** |
| Provider Terms and Conditions | https://totallife.com/provider-terms-and-conditions/ | Not needed on consumer pages |
| Privacy contact email | Present in the Privacy Policy (redacted in search snippets) | Add to `docs/compliance/` once scraped |
| Phone | 1-800-567-5433 (1-800-567-5433) | On every page, header, footer, sticky bar |
| California privacy notice | The Privacy Policy includes a CCPA supplement; a "Do Not Sell or Share" link may be required in the footer if the live site has one | Check the live footer |
| Crisis line | 988 | In every footer and on the confirmation page |
| Medicare language | "Total Life is an enrolled Medicare provider. Most members are covered up to 100% with Medicare + supplemental insurance." | Verbatim from the brand book, in every footer |

## Run the scrape from a machine that can reach the site

`tools/scrape-compliance.mjs` pulls the policy pages and the home page footer with Playwright and saves the text
and every footer link into `docs/compliance/`. From the repo root, on your own machine:

```bash
npm i            # once, installs Playwright
npx playwright install chromium   # once
node tools/scrape-compliance.mjs --write
```

`--write` also copies the policy text into `privacy/index.html` between the `POLICY-START` / `POLICY-END` markers.

It writes `docs/compliance/<slug>.txt` for each policy, `docs/compliance/footer-links.json` with every footer
link on the home page, and prints anything it found that looks like a legal name, address, email, or
"Notice of Privacy Practices" link. Then:

1. Copy the HIPAA notice URL into the three footers and `thanks/index.html`
   (search for `[HIPAA NOTICE OF PRIVACY PRACTICES]`).
2. If the live footer has a **Do Not Sell or Share My Personal Information** or **Accessibility** link, add the same
   link to the `.legal` block in each footer.
3. If the Privacy Policy names a mailing address and privacy email, add them to the footer's first column under the
   phone number so the landing pages carry the same contact points.
4. Read the Privacy Policy's section on cookies and tracking. If it does not yet mention Meta Pixel, Google Ads
   tags or HubSpot tracking, legal must add them before the ads run (these pages now load all three when configured).

## Consent and data handling on the landing pages

- **Contact consent line** on the phone/email step: "By continuing, you agree that Total Life may call, text or
  email you about your care using the details above. Message and data rates may apply. You can opt out at any time.
  See our Privacy Policy." Legal may prefer an unticked checkbox; the form supports one by adding a required
  checkbox field to that step.
- **Fields collected:** first name, last name, phone, email, date of birth, ZIP. No health information is collected
  by the book-a-call form. The self-check page's four questions are answered before any identity is given and are
  sent to HubSpot only if HubSpot properties `q1` to `q4` exist on the form; otherwise they are dropped by the
  retry-with-core-fields logic. Decide with legal whether those answers may be stored at all; if not, do not create
  those properties.
- **Where data goes:** HubSpot (contact record, calendar), Google Ads and Meta (a conversion event with no personal
  fields), GA4 if enabled (events, no personal fields). HubSpot is the only system that receives identity, and a
  HIPAA-eligible HubSpot configuration or BAA should be confirmed by legal since date of birth plus a therapy
  inquiry can be treated as PHI.
- **Confirmation page** is `noindex`.

## The channel in HubSpot

See `docs/hubspot-setup.md` section 6. In short: connect the ad accounts under Marketing > Ads, keep the UTMs on
every ad URL, and use the two saved contact views as the operational reporting. If Marketing Hub Professional is
available, group everything under a Campaign named `Caregiver test — Sept 2026`.
