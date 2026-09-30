# Compliance migration from totallife.com

Goal: every legal and compliance element on the existing Total Life site is present on the landing pages, the
pages collect nothing the booking does not need, and legal has signed off on the few lines that are new.

## What the pages carry today

The build environment cannot reach totallife.com (egress blocked, including archive mirrors), so the policy text
itself has not been copied yet. Everything below comes from indexed search snippets of the live site (URL cited per
row; checked 2026-09-30) and the brand book. Footer legal block is byte-identical on `caregiver`, `depression`,
`grief`, `thanks`, `privacy` (verify: `for p in caregiver depression grief thanks privacy; do sed -n '/<div class="legal">/,/<\/div>/p' $p/index.html | md5sum; done` prints one hash).

| Item | totallife.com (source) | Landing pages | Status |
|---|---|---|---|
| Legal entity | "owned and operated by Total Life Inc."; Delaware law (https://totallife.com/termsandconditions/). Footer: "Copyright 2025 Total Life Inc. All Rights Reserved" (https://totallife.com/). Clinical entity in provider terms: "Total Life FL, P.A." (https://totallife.com/provider-terms-and-conditions/) | `Total Life Inc.` identity line + `© 2026 Total Life Inc.` in every footer | Done |
| Mailing address | Privacy policy only: "Total Life Inc. Data Protection Officer, 136 Madison Avenue, 5th floor, New York, NY, 10016" (https://totallife.com/privacy/). **Not confirmed in the live footer.** learning.totallife.com/contact-us and third-party directories list "110 Front Street, Suite 300, Jupiter FL, 33477" as the organisation address | `136 Madison Avenue, 5th floor, New York, NY 10016` in every footer identity line | Done, **confirm with legal which address is the public one** (the policy address dates from a Nov 20, 2020 policy) |
| Phone | 1-800-567-5433 / "1-800-567-LIFE" (https://totallife.com/contact/) | 1-800-567-5433 in header, hero, footer, sticky bar and identity line (`567-LIFE` is a banned phrase in `tools/audit.mjs`, keep digits) | Done |
| Email | Contact page lists an email (redacted in snippets); indexed as care@totallife.com / info@totallife.com (https://totallife.com/contact/, https://learning.totallife.com/contact-us) | None | **Pending**: confirm the care-team address from the live contact page, then add to the footer identity line |
| Not affiliated with Medicare | "Total Life is not affiliated with Medicare or any government agency … a private telehealth practice that accepts Medicare as a payer … enrolled as a provider under Medicare Part B" (https://totallife.com/not-affiliated-with-medicare/, linked from the site footer) | Same statement in every footer legal block, linked to the live page | Done |
| Privacy Policy | https://totallife.com/privacy/ (last updated / effective November 20, 2020; "does not sell and has not sold any Personal Information in the preceding twelve (12) months"; cookies and web beacons "to enable the technical operation of the Platform, to administer log-in … and to collect Log Data") | Footer link to the live URL on every page. `/privacy/` exists on the landing domain with `POLICY-START` / `POLICY-END` markers and no text yet | Live link until `/privacy/` carries the approved text; then `node tools/scrape-compliance.mjs --write` copies the text in and flips every footer link to `/privacy/` |
| Terms and Conditions | https://totallife.com/termsandconditions/ | Footer link | Done |
| Consent to Telehealth and Therapy | https://totallife.com/consent-to-telehealth-and-therapy/ | Footer link | Done |
| Notice of Privacy Practices (HIPAA) | Listed on https://totallife.com/sitemap/ as "HIPAA NOTICE OF PRIVACY PRACTICES" / "HIPAA Privacy Notice"; referenced from the referral form (https://my.totallife.com/refer/) and provider policies. Slug never appears in any indexed result | `[HIPAA NOTICE OF PRIVACY PRACTICES]` placeholder in every footer | **URL pending.** The scrape now saves the sitemap and prints its policy links |
| Consumer Health Data Privacy Policy | Listed on https://totallife.com/sitemap/; footer link text "Consumer Health Data" on wellness.totallife.com pages. Slug not indexed | `[CONSUMER HEALTH DATA PRIVACY POLICY]` placeholder in every footer | **URL pending**, same scrape |
| Do Not Sell / Accessibility links | No such footer link or accessibility statement found in any indexed page; the policy states Total Life does not sell personal information | None | Nothing to add |
| Crisis line | "Total Life is not an emergency service. If you or someone you love is in immediate danger, call 911, or call or text 988 to reach the Suicide and Crisis Lifeline." (https://totallife.com/contact/); consent page: "CALL 911, THE SUICIDE & CRISIS LIFELINE AT 988, OR GO TO THE NEAREST HOSPITAL EMERGENCY ROOM" (https://totallife.com/consent-to-telehealth-and-therapy/) | Live wording adopted in every footer and on `/thanks/` | Done |
| Medicare language | "Total Life is a Medicare provider" (https://totallife.com/conditions/caregiver-stress/); "Medicare Part B covers outpatient online therapy at 80% after your annual deductible … Most Total Life members with a Medicare Advantage or Medigap supplement plan pay $0 per session" (https://totallife.com/therapy/) | "Total Life is an enrolled Medicare provider … Most members are covered up to 100% with Medicare + supplemental insurance." in every footer and FAQ | Brand-book wording kept; the live "$0" / "80%" figures are not copied without legal sign-off |
| Vetted opt-in language | No public totallife.com form shows SMS/call consent wording in indexed results. Closest: referral form "I confirm I have the authority to submit this referral and I agree that Total Life may contact this person regarding mental health services in accordance with the Privacy Policy, HIPAA Notice of Privacy Practices, and Terms of Use." (https://my.totallife.com/refer/) | `[VETTED OPT-IN LANGUAGE]` placeholder under the booking widget, plus the HubSpot form consent (`docs/hubspot-setup.md` §3) | **Text pending** from Total Life; see the TCPA note below |
| Privacy line under the widget | — | `[PRIVACY LINE — PENDING LEGAL] We use this information only to arrange the call.` | Pending legal |
| Cookie / tracking disclosure | Policy names cookies and web beacons only; no Meta, Google or HubSpot named in indexed text; no cookie banner found | Pixels documented under Data flows below | Legal to confirm the policy covers the pixels (item 3 below) |
| Confirmation page | — | `/thanks/` is `noindex` | Done |

Copy differences found in the same check, **not** changed here (they go through the compliance agent):

- Match time: live says "matched with a therapist within 48 hours" (https://totallife.com/therapy/) and "within 24 hours" (https://totallife.com/, https://totallife.com/about/); ours says "Matched with a therapist" with no time. Keep ours unless legal wants a figure.
- How it works: live is contact → verify coverage → licensed professional discusses needs → matched (https://totallife.com/therapy/); ours is Book a time → We call you → We check coverage together → Matched with a therapist. Same sequence, our wording.
- Coverage: live "covered by Medicare and most major insurance plans" and "covered by Original Medicare, most Medicare Advantage plans, and many PPOs" (https://totallife.com/faq/); ours "Covered by Medicare and most supplemental insurance plans" (hero note). Brand-book line governs.
- Family booking: live "Make the first call together (or for them, with their blessing) … everything proceeds with the older adult's consent" (https://totallife.com/blog/telehealth-therapy-elderly/); ours "as long as the member knows about the call and agrees to it". Equivalent.
- Hours: no hours indexed anywhere on totallife.com; ours "9 am to 9 pm Eastern, seven days a week" is from the call notes. Confirm before launch.

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
and rewrites the footer Privacy Policy link on `caregiver`, `depression`, `grief`, `thanks` and
`privacy` from `https://totallife.com/privacy/` to `/privacy/`. Only run it with `--write` once legal has said the
copied text may be republished on the landing domain; otherwise leave the footer pointing at the live page.

The scrape also prints anything that looks like a legal name, mailing address, email, "Notice of Privacy
Practices" link, "Do Not Sell" link or "Last updated" date. Then:

1. Replace `[HIPAA NOTICE OF PRIVACY PRACTICES]` and `[CONSUMER HEALTH DATA PRIVACY POLICY]` in the three theme pages,
   `thanks/index.html` and `privacy/index.html` with the links the sitemap scrape prints.
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
6. The HIPAA Notice of Privacy Practices URL and the Consumer Health Data Privacy Policy URL.
7. Which mailing address is public: the privacy policy's 136 Madison Avenue (New York) or the Jupiter, FL address on
   learning.totallife.com; and the care-team email for the footer.

## The channel in HubSpot

See `docs/hubspot-setup.md` §7. In short: the tracking code on every page, the UTMs on every ad URL, and the
`Care calls — booked` saved view are the reporting. No form submissions, no Forms API, no extra properties beyond
`date_of_birth` and `state`.
