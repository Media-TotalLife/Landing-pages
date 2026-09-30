# Compliance migration from totallife.com

Goal: every legal and compliance element on the existing Total Life site is present on the landing pages, the
pages collect nothing the booking does not need, and legal has signed off on the few lines that are new.

## What the pages carry today

The build environment cannot reach totallife.com, so the policy text itself has not been copied yet. The links
and identity below come from public search results and the brand book.

| Item | Where it lives on the landing pages | Status |
|---|---|---|
| Legal entity | `© 2026 Total Life Inc.` in every footer | Done |
| Privacy Policy | Footer link to **https://totallife.com/privacy/** on every page. `/privacy/` exists on the landing domain with `POLICY-START` / `POLICY-END` markers and no text yet. | Live link until `/privacy/` carries the approved text; then `node tools/scrape-compliance.mjs --write` copies the text in and flips every footer link to `/privacy/` |
| Terms and Conditions | Footer link to https://totallife.com/termsandconditions/ | Done |
| Consent to Telehealth and Therapy | Footer link to https://totallife.com/consent-to-telehealth-and-therapy/ | Done |
| Notice of Privacy Practices (HIPAA) | `[HIPAA NOTICE OF PRIVACY PRACTICES]` placeholder in every footer and on `/thanks/` | **URL pending.** Take it from the live site's footer (the scrape prints it) and replace the placeholder in the five pages |
| Vetted opt-in language | `[VETTED OPT-IN LANGUAGE]` placeholder under the booking widget on every page, plus the consent text inside the HubSpot booking form (`docs/hubspot-setup.md` §3) | **Text pending** from Total Life; see the TCPA note below |
| Privacy line under the widget | `[PRIVACY LINE — PENDING LEGAL] We use this information only to arrange the call.` | Pending legal |
| Phone | 1-800-567-5433 in header, footer and sticky bar | Done |
| Crisis line | 988 in every footer and on `/thanks/` | Done |
| Medicare language | "Total Life is an enrolled Medicare provider … Most members are covered up to 100% with Medicare + supplemental insurance." in every footer and FAQ | Verbatim from the brand book |
| Confirmation page | `/thanks/` is `noindex` | Done |

What the pages do **not** have, by design: no form of their own, no ZIP field, no self-check or screening
questions, no health question anywhere. The only intake is the HubSpot booking form (first name, last name, email,
phone, date of birth, state).

## Run the scrape from a machine that can reach the site

`tools/scrape-compliance.mjs` pulls the three policy pages and the home-page footer with Playwright and saves the
text into `docs/compliance/`. From the repo root, on your own machine:

```bash
npm i                              # once, installs Playwright
npx playwright install chromium    # once
node tools/scrape-compliance.mjs   # read-only: docs/compliance/*.txt and footer-links.json
node tools/scrape-compliance.mjs --write   # also fills /privacy/ and repoints the footer links
```

`--write` copies the privacy policy into `privacy/index.html` between the `POLICY-START` / `POLICY-END` markers
and rewrites the footer Privacy Policy link on `senior`, `caregiver`, `depression`, `grief`, `thanks` and
`privacy` from `https://totallife.com/privacy/` to `/privacy/`. Only run it with `--write` once legal has said the
copied text may be republished on the landing domain; otherwise leave the footer pointing at the live page.

The scrape also prints anything that looks like a legal name, mailing address, email, "Notice of Privacy
Practices" link, "Do Not Sell" link or "Last updated" date. Then:

1. Replace `[HIPAA NOTICE OF PRIVACY PRACTICES]` in the four theme pages and `thanks/index.html` with the link.
2. If the live footer has a **Do Not Sell or Share My Personal Information** or **Accessibility** link, add the
   same link to the `.legal` block in each footer.
3. If the Privacy Policy names a privacy email or mailing address, add them to `/privacy/`'s meta line
   (`[PRIVACY CONTACT FROM THE POLICY]`, `[EFFECTIVE DATE]`).
4. Read the Privacy Policy's section on cookies and tracking against the data flows below.

## Opt-in and consent

The same vetted opt-in text goes in two places: the `.optin` paragraph under every booking widget, and the
consent text inside the HubSpot booking form, so the consent is both visible before booking and recorded on the
contact. Total Life supplies the text (the call notes: compliant opt-ins already exist and should be mimicked).

Before it is pasted, check it covers:

- Permission for Total Life to **call, text and email** about the care call using the details given, that message
  and data rates may apply, and how to opt out. The confirmation and reminder messages from HubSpot rely on this.
- A statement that the person booking **owns the phone number given, or has the owner's permission** for Total
  Life to contact them on it. Every page says a family member is welcome to book with the member, so the number
  entered may belong to someone other than the person typing. TCPA consent must come from the subscriber or the
  customary user of the number, and this line is what documents it.
- A link to the Privacy Policy.

If the existing Total Life text lacks the phone-owner line, legal adds one sentence rather than the pages
inventing wording.

## Data flows

| System | What it receives | Identity? |
|---|---|---|
| **HubSpot** | Contact (first name, last name, email, phone, date of birth, state, consent record) and the Meeting; Original source from the `hubspotutk` cookie and the UTMs on the ad URL | Yes. The only system that holds who booked. |
| **Meta Pixel** | Standard events `PageView` (every page), `Lead` and `Schedule` (`/thanks/`, after a booking only). No custom parameters. | No personal fields. **Page paths are visible to Meta** through `PageView` (`/depression/`, `/grief/`, `/caregiver/`, `/senior/`, `/thanks/`). |
| **Google Ads tag** | Page view and one conversion, `Care call booked`, on `/thanks/`. Enhanced conversions off. | No personal fields. Page URLs are visible to Google. |
| **GA4** (optional) | Page views and CTA / booking events with the page name | No personal fields. |

Two consequences for legal:

- HubSpot holds date of birth next to a therapy inquiry. Confirm the HubSpot configuration or BAA position with
  legal; Total Life already books through HubSpot, so this should be the same answer as for totallife.com.
- Meta and Google see the **path** of the page visited, and the paths name a condition. If legal does not accept
  path-level data, the slugs (`/depression/`, `/grief/`, `/caregiver/`) get renamed to neutral ones before launch.
  The pixel itself cannot be made to send less than the URL.

## Items needing legal sign-off before the ads run

1. **Medicare stamp and "covered by Medicare" line on the caregiver stress and grief themes.** All four heroes
   carry the `Covered by Medicare` stamp, and the caregiver and grief headlines say "covered by Medicare". Talk
   therapy for those concerns is covered when medically necessary; legal confirms the pairing is acceptable as
   general statements, or the headlines are softened to the senior page's form.
2. **"Covered by Medicare and most supplemental insurance plans"** (hero note on every page) alongside the
   brand-book line "Most members are covered up to 100% with Medicare + supplemental insurance". Confirm both are
   approved claims.
3. **Privacy Policy coverage of these pixels.** The policy's cookies and tracking section must name Meta Pixel,
   Google Ads / Google tag and HubSpot tracking, and the page-path point above. If it does not, legal updates the
   policy before launch; the pages then link to the updated text.
4. The vetted opt-in text, including the phone-owner / permission line.
5. The `[PRIVACY LINE — PENDING LEGAL]` sentence under the widget.
6. The HIPAA Notice of Privacy Practices URL.

## The channel in HubSpot

See `docs/hubspot-setup.md` §7. In short: the tracking code on every page, the UTMs on every ad URL, and the
`Care calls — booked` saved view are the reporting. No form submissions, no Forms API, no extra properties beyond
`date_of_birth` and `state`.
