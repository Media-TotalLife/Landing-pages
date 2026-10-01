# Ads launch — three themes, one Google Search campaign and one Meta campaign each

## Pre-flight (must all pass before any campaign is enabled)

Both ad platforms treat visible bracketed text or a non-functional booking element as a destination under
construction, which disapproves the whole ad group. Ads stay off until every item below passes.

1. `assets/js/config.js` has the real `hubspot.meetingsLink` and `hubspot.portalId`.
2. `node tools/audit.mjs --launch` prints `LAUNCH GATE: PASS` for caregiver, depression and grief (no bracketed
   placeholder in the booking card, calendar configured and connected, no `[HIPAA NOTICE` / `[CONSUMER HEALTH`
   placeholder in the footer).
3. `node tools/states.mjs` and `node tools/tracking-test.mjs` pass.
4. The HubSpot booking form asks only first name, last name, email, phone, date of birth and state
   (`docs/hubspot-setup.md` §8), and no reason-for-visit, symptom, medication or diagnosis question. The card's
   form-fields sentence must match the live form the same day it changes.
5. The live confirmation email has been read. The sentence "The confirmation email also has a link to change it."
   (FAQ, last answer) and "The email has a link to change the time." (/thanks/, first check) are restored only if
   that link exists.

Ask the client for the meetings link (or a HubSpot sandbox link) before the next design review, so the verdict is on
the live widget, not the skeleton.

## Events

Every `data-track` id on the pages, and where it lives. `Care call booked` is the **only primary** conversion.
Define one **secondary** conversion `phone_click` in GA4 / Google Ads = any click on `a[href^="tel:+18005675433"]`
(card_phone, final_phone, sticky_phone, header_phone, footer_phone, thanks_phone). Use a Google forwarding number
on the call asset so phone leads are keyword-attributable. Record a baseline of these events and the current
booking rate before the redesign ships, so the phone-button changes do not read as a conversion drop.

| Event | Where |
|---|---|
| `header_phone` | header phone link (all pages) |
| `header_cta` | desktop header "Book a call", appears when the booking card is off screen |
| `card_phone` | booking card phone button (quiet link once the live calendar is in) |
| `final_cta` | final section "Book a call" |
| `final_phone` | final section phone button |
| `sticky_cta` | mobile sticky bar "Book a call" |
| `sticky_phone` | mobile sticky bar phone |
| `footer_phone` | footer phone link |
| `thanks_phone` | /thanks/ phone link |
| `care_call_booked` | tl.js, on HubSpot's `meetingBookSucceeded` message |
| `thanks_view` / `thanks_view_unbooked` | /thanks/ inline script |
| `tl_conversion` kind `lead` / `booked` | track.js `tlConvert`, fired once on /thanks/ |

`hero_cta` and `hero_phone` no longer exist (the hero has one call to action: the booking card). `gclid` is stored in
sessionStorage `tl_attr` by track.js and appended to the meetings link with the UTMs, so offline booked-call
imports can match.

Three landing pages, each with one event: book a call in the embedded HubSpot widget. Every ad lands on the page
whose hero headline the ad repeats. The Google headline is the live `<h1>` or a shortened version that keeps its
words (Google allows 30 characters); the Meta headline is the live `<h1>` word for word.

| Theme | `utm_campaign` | Lands on | Hero eyebrow | Hero headline (`<h1>`) |
|---|---|---|---|---|
| **Caregiver stress** | `caregiver` | `/caregiver/` | For caregivers 65 and over | Caregiver stress therapy, covered by Medicare. |
| **Depression** | `depression` | `/depression/` | For adults 65 and over | Depression therapy, covered by Medicare. |
| **Grief and loss** | `grief` | `/grief/` | For adults 65 and over | Grief counseling, covered by Medicare. |

**One theme, one campaign, one page.** The caregiver theme is caregiver stress therapy for adults 65+ who look
after a spouse, a parent or another loved one (totallife.com/caregiver-stress). The caregiver is the member and the
person who books. Nothing in this plan targets adult children looking for therapy for a parent.

There is no general senior page in this test (`/senior/` was removed on 30 Sept 2026). No ad may point at
`/senior/` or at a `?v=` variant: a click there lands on a 404, which Meta and Google both treat as a broken
landing page.

## Budgets and scope

Test budget from the call notes: **$50 a day on Google in total and $30 a day on Meta in total**, across the three
theme campaigns. Plan of record: an even split, **$16.67 a day per Google campaign** and **$10 a day per Meta
campaign**, because the client asked for independent campaigns per theme and even spend makes cost per booked call
comparable on day one.

Alternative to put to Neelam before launch: run **two themes at a time** ($25 a day Google, $15 a day Meta per
campaign) for the first two weeks, then the third theme against the better of the two. Reason: at $3 to $6 a
click, $16.67 buys three to five Google clicks a day, and a Meta ad set at $10 a day rarely leaves the learning
phase, so three parallel campaigns take a month to say anything. Either way the total stays at $50 + $30.

Google is **Search only**: no Performance Max, no Display, no Search partners. Psychiatry, medication and GLP-1
are not offered in this funnel and appear only as negatives.

**Negatives on every campaign (both platforms where the platform allows keyword exclusions):** `psychiatry`,
`psychiatrist`, `medication`, `antidepressant`, `GLP-1`, `Ozempic`, `Wegovy`, `semaglutide`, `job`, `jobs`,
`free`, `medicaid`, `near me`. Add as a shared negative list in Google Ads and attach it to all three campaigns.
Sensible extras in the same list: `salary`, `nursing home`, `hospice`, `crisis`, `hotline`.

Replace `DOMAIN` below with the domain the pages are hosted on. Phone everywhere: **1-800-567-5433**.

## Meta compliance rules every headline follows

Meta's **Personal Attributes** standard rejects copy that asserts or implies something about the reader: age,
health or mental state, family situation, or a struggle, including indirect second-person framing. The pages and
ads therefore:

- **Describe the service and the condition in general statements, never the reader.** "Therapy for adults 65+"
  and "Depression therapy for adults 65+" are allowed; "Are you over 65?" and "Feeling low?" are not.
- **No rhetorical questions** in a headline or primary text.
- **"You" only for the action, never for an attribute.** "Book a call. A real person calls you." is fine;
  "You're carrying a lot" is not.
- **No negative self-perception, no before/after, no cure or guarantee language.**
- **Medicare wording** stays on the approved lines ("Covered by Medicare", "Most members are covered up to 100% with
  Medicare + supplemental insurance", "Total Life is an enrolled Medicare provider"). Nothing suggests government
  affiliation or an official Medicare programme. Never "free therapy", "no cost", "Medicare-approved", urgency.
- **Health data**: the pixel sends only the standard events `PageView`, `Lead` and `Schedule`, with no custom
  parameters. `PageView` carries the full page URL, so Meta sees the path **and the query string**
  (`/depression/?utm_campaign=depression`). Legal must accept path-level data, or the slugs **and** the
  `utm_campaign` / `utm_content` values get renamed to neutral codes together before launch; renaming only the slug
  changes nothing (see `docs/compliance-migration.md`).
- **Landing page must match the ad**: the headline on each URL is the ad headline.

## 0. Tags and conversions (do this before the ads)

Everything is switched on from `assets/js/config.js`. Empty value = that tag is not loaded.

### How a booking becomes a conversion (what the code does)

- **Nothing fires on the landing page.** `track.js` loads the tags and fires Meta `PageView` and the Google tag
  page view. That is all a page visit sends.
- When the HubSpot widget posts `meetingBookSucceeded`, `tl.js` sets `sessionStorage.tl_booked` and sends the
  browser to `/thanks/?p=<page>`.
- `/thanks/` fires Meta **`Lead` + `Schedule`** and Google Ads **`leadLabel` + `bookedLabel`** once per session,
  and **only if** `tl_booked` is set **or** the URL carries `?b=hs`. Direct visits to `/thanks/` fire nothing.
- `?b=hs` exists for HubSpot's own post-booking redirect, which runs if the widget's message is missed. **Set the
  meetings link's confirmation redirect to `https://DOMAIN/thanks/?b=hs`** (`docs/hubspot-setup.md` §2a).
- Because Lead and Schedule fire together, they are the same event counted twice. On Google, leave `leadLabel`
  empty so only one conversion is counted.

### Google Ads
1. Tools > **Conversions** > New conversion action > **Website** > enter the domain > **Add a conversion action
   manually**: `Care call booked`, category **Book appointment**, value none, count **One**, click-through window
   30 days. This is the **only** conversion action and it is **Primary**.
2. Open it > **Tag setup** > "Use Google tag" > copy the **conversion ID** (`AW-XXXXXXXXX`) and the **label**.
   Put them in `config.js` as `google.adsId` and `google.bookedLabel`. **Leave `google.leadLabel` empty.**
3. **Enhanced conversions stay off** (`track.js` sets `allow_enhanced_conversions: false`). Google's healthcare
   policy does not allow hashed personal data for a therapy inquiry, and the page has no form to read it from.
4. Optional GA4: create a property, put its `G-` ID in `google.ga4Id`. CTA clicks (`header_cta`, `card_phone`, `final_cta`, `final_phone`, `sticky_cta`, `sticky_phone`, `header_phone`, `footer_phone`),
   `care_call_booked` and `thanks_view` are sent as events, with page name only.

### Meta
1. Events Manager > **Connect data sources > Web > Meta Pixel**. Name `Total Life landing pages`. Copy the
   **Pixel / dataset ID** into `config.js` as `meta.pixelId`.
2. The site fires `PageView` on every page and both **`Schedule`** and **`Lead`** on `/thanks/`. No custom
   parameters are sent; do not add any. **`Schedule` is the optimisation event**; `Lead` is secondary.
3. **Health and wellness data-source category.** Meta classifies mental-health domains as health and wellness and
   assigns the dataset a restriction tier (Events Manager > dataset > **Settings** or **Manage Data Source
   Categories**). Under **Core setup** the standard events pass and `Schedule` can be optimised for. Under the
   **Standard Events restriction** tier, `Schedule` and `Lead` may be dropped and URL parameters stripped;
   `PageView` still arrives. If `Schedule` is dropped, optimise the ad sets for **Landing page views** and read
   bookings from HubSpot (Paid Social) instead. Do not try to work around the restriction: Meta is not a HIPAA
   business associate.
4. Verify the domain: Business settings > Brand safety > **Domains** > add and verify with the meta tag or DNS.
   Then **Aggregated Event Measurement** > configure web events: rank `Schedule` first, `Lead` second.

### HubSpot
Portal ID and meetings link per `docs/hubspot-setup.md`. HubSpot's own attribution (not the pixels) is the count
every decision is read from.

### Smoke test
See **Day-one verification** at the end of this document. `node tools/tracking-test.mjs` is a stubbed check of
the site's plumbing; it does not prove that HubSpot, Google or Meta received anything.

## 1. Google Ads — one Search campaign per theme

Each campaign: **Search** > goal Leads > `TL — <theme>`. Networks: **Search only** (untick Display and Search
partners). No Performance Max. Locations: United States (or the states Total Life serves). Language: English.
Bidding: **Maximise clicks** with a **max CPC cap of $6** for the first two weeks, then Maximise conversions on
`Care call booked` once a campaign has 15+ bookings. Budget: **$16.67 a day per campaign** ($50 total). Ad
schedule: **9 am to 9 pm Eastern** every day (the widget only shows slots in that window). Audience:
**Observation** only, age 45+ where available. Attach the shared negative list above.

Final URL pattern:
`https://DOMAIN/<page>/?utm_source=google&utm_medium=cpc&utm_campaign=<theme>&utm_content=<ad group>&utm_term={keyword}`

HubSpot reads Paid Search from `utm_medium=cpc` or the `gclid` Google appends. `utm_campaign` becomes Original
source drill-down 1 and `utm_term` (the keyword) drill-down 2, so keep `utm_term={keyword}` on every URL.

Common assets on every RSA: Callouts `Enrolled Medicare Provider` · `Phone or Video` · `Real People, Not Bots`.
Sitelinks: How it works · Questions · Book a call → `#book`. Call asset: 1-800-567-5433,
schedule 9 am to 9 pm ET. All three pages use `#how-it-works` and `#questions` as sitelink anchors (a wrong anchor scrolls to the top,
which reads as a dead link).
Common headlines, added to every ad after the pinned ones: `Covered by Medicare` ·
`Book a Call With Our Care Team` · `By Phone or Video, From Home` · `Real Person, 9am–9pm ET` ·
`Specialists in Adults 65+` · `Enrolled Medicare Provider`. Common descriptions: `Book a call. A real person from our care team calls you, 9 am to 9 pm ET, 7 days a week.` (88 characters) · `Most members are covered up to 100% with Medicare +
supplemental insurance.`

### Campaign `TL — caregiver` (→ `/caregiver/`)

One ad group, `caregiver-stress`. Final URL:
`https://DOMAIN/caregiver/?utm_source=google&utm_medium=cpc&utm_campaign=caregiver&utm_content=caregiver-stress&utm_term={keyword}`

The searcher is the caregiver. Keywords (phrase match): `caregiver stress`, `caregiver stress therapy`, `caregiver
burnout help`, `therapy for caregivers`, `counseling for caregivers`, `caregiver support therapy`, `caregiver
counseling medicare`, `caring for spouse with dementia stress`, `caregiver depression`, `support for family
caregivers`.
Negatives: shared list plus `respite care`, `paid caregiver`, `caregiver agency`, `become a caregiver`, and the
adult-child queries this theme must not buy: `elderly parent`, `aging parent`, `my mom`, `my dad`, `for my mother`,
`for my father`.

Responsive search ad
- Headline pinned to position 1: `Caregiver Stress Therapy` (the h1's opening words; the full h1 is over
  30 characters). Position 2: `Covered by Medicare` (together they are the h1). Also `Caregiver Stress Therapy, 65+` (the eyebrow) and
  `Support for Family Caregivers`. Nothing that asserts a struggle ("hard work", "exhausted"). Then the common
  headlines.
- Theme description: `Talk therapy for adults 65+ who look after a spouse, a parent or a loved one. From home.`
  Then the common descriptions.

### Campaign `TL — depression` (→ `/depression/`)

One ad group, `depression`. Final URL:
`https://DOMAIN/depression/?utm_source=google&utm_medium=cpc&utm_campaign=depression&utm_content=depression&utm_term={keyword}`

Keywords (phrase match): `depression therapy for seniors`, `depression counseling medicare`, `therapy for
depression older adults`, `medicare covered depression treatment`, `talk therapy for depression elderly`,
`depression in elderly treatment`, `late life depression therapy`, `counseling for low mood seniors`.
Negatives: shared list plus `antidepressants`, `SSRI`, `prescription`, `test`, `quiz`.

Responsive search ad
- Headline pinned to position 1: `Depression Therapy` (the h1's opening words; the full h1 is over 30
  characters). Position 2: `Covered by Medicare` (together they are the h1). Also `Depression Therapy, Adults 65+` (the eyebrow). Then the
  common headlines.
- Theme description: `Depression therapy for adults 65+ with therapists who specialize in older adults.` Then the
  common descriptions.

### Campaign `TL — grief` (→ `/grief/`)

One ad group, `grief`. Final URL:
`https://DOMAIN/grief/?utm_source=google&utm_medium=cpc&utm_campaign=grief&utm_content=grief&utm_term={keyword}`

Keywords (phrase match): `grief counseling`, `grief counseling medicare`, `grief therapy for seniors`, `bereavement
counseling for older adults`, `grief counseling after loss of spouse`, `grief support therapy`, `counseling after
death of spouse`, `grief counselor covered by medicare`.
Negatives: shared list plus `funeral`, `funeral home`, `support group`, `pet loss hotline`, `chaplain`.

Responsive search ad
- Headline pinned to position 1: `Grief Counseling`. Position 2: `Covered by Medicare` (together they are the h1).
  Also `Grief Counseling, Adults 65+` (the eyebrow). Then the common headlines.
- Theme description: `Grief counseling for adults 65+ after the loss of a spouse, a friend, a sibling or a pet.`
  Then the common descriptions.

Compliance: never "free therapy", urgency ("act now", "limited") or guarantees. "Covered by Medicare" and "up to
100% with Medicare + supplemental insurance" are the approved lines. Pairing the Medicare line with the caregiver
stress and grief themes is on the legal sign-off list (`docs/compliance-migration.md`).

## 2. Meta — one campaign per theme, one ad set and one ad each

Each campaign: **Leads** objective, name `TL — <theme>`, **Special ad category: none** (not credit, employment,
housing or politics). Advantage+ campaign budget **off**. Budget **$10 a day per campaign** ($30 total).

Ad set `Adults 65+ — US`: conversion location **Website**, pixel = the dataset above, performance goal
**Maximise number of conversions**, conversion event **Schedule** (if the dataset is under the Standard Events
restriction, use **Landing page views**). Schedule: run continuously (Meta only allows dayparting with lifetime
budgets; the widget shows the next open 9 am to 9 pm slot, so a night click still books). Location: United States.
Age **65+** for depression and grief; **55 to 65+** for caregiver (spouses caring for a partner). Gender
all. Detailed targeting: leave broad. Do not use health, grief or caregiving interest targeting: it is restricted
for health advertisers and unnecessary at this budget. Placements: **Advantage+**, but exclude Audience Network.
Attribution: 7-day click, 1-day view.

URL pattern: `https://DOMAIN/<page>/?utm_source=facebook&utm_medium=paid_social&utm_campaign=<theme>&utm_content=<ad>`.
HubSpot reads Paid Social from `utm_medium=paid_social` (or the `fbclid`); `utm_campaign` becomes Original source
drill-down 2. `utm_content` is not stored on the contact, so one ad per campaign keeps the read clean.

Creative for every ad until theme stills are installed: the existing home still (`assets/img/people/senior-hero.jpg`)
cropped 1:1 and 4:5, and the 5-second `senior-hero.mp4` for Reels/Stories. **No text on the image or video**: the
headline lives in the ad's headline field, not as an overlay (text on a health ad's image is a common reject
trigger and the photography brief forbids it). No caption may present the AI-generated people as members,
patients or real customers. CTA button on every ad: **Book Now**.

### `TL — caregiver` (→ `/caregiver/`)
`utm_content=caregiver-stress`
- Primary text: `Caregiver stress therapy, covered by Medicare. Total Life
  offers talk therapy for adults 65+ who look after a spouse, a parent or another loved one, with therapists who
  specialize in older adults, from home, by phone or video. Book a call. A real person from our care team calls you, 9 am to 9 pm ET, 7 days a week.`
- Headline: `Caregiver stress therapy, covered by Medicare.` (the live h1, word for word) · Description: `Caregiver stress therapy for adults 65+`
- Creative: the caregiver scene still when installed; until then the existing home still.

### `TL — depression` (→ `/depression/`)
`utm_content=depression`
- Primary text: `Total Life offers talk therapy for depression in later life: for adults 65+, with licensed
  therapists who specialize in older adults, from home, by phone or video. Covered by Medicare. Book a call. A real person from our care team calls you, 9 am to 9 pm ET, 7 days a week.`
  (Not "low mood, loss of interest, poor sleep and worry are common in later life, and talk therapy helps": to an
  audience targeted at 65+ that lists the reader's symptoms and promises an outcome, which is what Meta's Personal
  Attributes and Personal Health rules reject.)
- Headline: `Depression therapy, covered by Medicare.` (the live h1, word for word) · Description: `Depression therapy for adults 65+`

### `TL — grief` (→ `/grief/`)
`utm_content=grief`
- Primary text: `Total Life offers grief counseling for adults 65+ after the loss of a spouse, a friend, a sibling
  or a pet, with therapists who specialize in older adults, from home, by phone or video. Grief counseling is
  covered by Medicare. Book a call. A real person from our care team calls you, 9 am to 9 pm ET, 7 days a week.`
- Headline: `Grief counseling, covered by Medicare.` (the live h1, word for word) · Description: `Grief counseling for adults 65+`

Ad copy and the matching hero were written together so review of one covers the other.

## 3. Reading the results

**The only number that matters is cost per booked call, per theme.** Bookings are counted in HubSpot, not in the
ad platforms: open the `Care calls — booked` view (`docs/hubspot-setup.md` §4), split by Original source, and
group by **drill-down 1 for Paid Search** (= `utm_campaign`) and **drill-down 2 for Paid Social** (= `utm_campaign`).
For Paid Search, drill-down 2 is the keyword (`utm_term`), which is Jason's keyword-level view. Divide the
platform's spend on that campaign by the count.

Platform numbers (clicks, CPC, reported conversions) are for troubleshooting only. Meta may under-report under
the health restriction; Google may count a repeat booking twice. HubSpot booked contacts win.

| Check | Where | Good sign in week 1 |
|---|---|---|
| Clicks and CPC | Google Ads, Meta Ads Manager | Google CPC $2 to $6; Meta CPC $0.80 to $2.50 |
| Page → booking | HubSpot booked ÷ platform clicks | 3%+ |
| Cost per booked call | Campaign spend ÷ HubSpot booked contacts for that `utm_campaign` | under $150 by end of week 2 |
| Booked → call happened | Meeting outcome logged by Peggy / Angela | 80%+ |

Stop rule per theme: after **two weeks** (about $375 per theme at the even split, Google + Meta combined),
decide on cost per booked call from HubSpot. Pause the theme or move its budget to the theme that books cheapest,
keeping the $50 + $30 daily totals.

## 4. Day-one verification

`node tools/tracking-test.mjs` runs the pages against a local server with stubbed HubSpot, Meta and Google scripts.
It proves the site's plumbing: tags load from `config.js`, UTMs are captured, the embed waits for the cookie and
carries the UTMs, the booking message redirects to `/thanks/`, and each conversion fires exactly once and never on
a direct visit. **It is not proof that HubSpot, Google or Meta received anything.** That needs the live test below.

### T-1: smoke test on the live domain

Do it in **Chrome and Safari**, from a browser profile that is not logged into the office HubSpot or Meta
accounts (a fresh profile or a personal device on mobile data), with real IDs in `config.js`.

1. Open
   `https://DOMAIN/depression/?utm_source=google&utm_medium=cpc&utm_campaign=depression&utm_content=depression&utm_term=smoke+test&gclid=TEST123`.
2. DevTools > Application > Cookies: expect **`hubspotutk`**, **`_gcl_aw`** (Google) and **`_fbp`** (Meta). If
   `hubspotutk` is missing, the portal ID is wrong or a consent banner is blocking the tracking code.
3. Inspect the booking iframe. Its `src` must contain **`embed=true`**, **`parentHubspotUtk=`** (the cookie
   value) and **`parentPageUrl=`** (the landing URL with its UTMs). If `parentHubspotUtk` is missing, the embed
   loaded before the cookie existed and the contact will attribute to Direct or Offline.
4. Book a real slot with a test email (`smoke+<date>@…`) and a real phone that will not mind the confirmation.
   Expect the browser on `/thanks/` within about 2 seconds and the confirmation email in the inbox.
5. In HubSpot, open the contact within a minute. Expect: **Original source = Paid Search**, **drill-down 1 =
   `depression`**, **drill-down 2 = `smoke test`**, Date of birth, State and consent recorded, and the meeting on
   the timeline and on Peggy's or Angela's calendar.
6. Repeat once from a new private window with
   `?utm_source=facebook&utm_medium=paid_social&utm_campaign=depression&utm_content=depression&fbclid=TEST`.
   Expect **Original source = Paid Social**, drill-down 1 = the network, **drill-down 2 = `depression`**.
7. **Google**: Tag Assistant (Chrome extension or tagassistant.google.com) on the landing page and on `/thanks/`
   shows the Google tag connected and the `Care call booked` conversion hit once. Google Ads > Conversions shows
   the action's status move from "Inactive / Unverified" to "Recording conversions" within a few hours.
8. **Meta**: Pixel Helper shows `PageView` on the landing page and `Schedule` + `Lead` on `/thanks/`. Events
   Manager > dataset > **Overview** shows the events arriving (Test events tab if you set a test code), and
   **Manage Data Source Categories** shows which tier the domain is in. If it says Standard Events restriction,
   switch the ad sets to Landing page views before launch.
9. **GA4** (if configured): Realtime shows `page_view`, `care_call_booked` and `thanks_view`.
10. Delete the test contact and its meeting in HubSpot, and cancel the calendar slot.

### T+24 h: compare the counts

| HubSpot `Care calls — booked` by source | Google Ads conversions | Meta results (Schedule) | Sales > Meetings > Scheduled |
|---|---|---|---|

They will not match exactly; each mismatch means something:

- **Bookings with Original source Direct or Offline** while UTMs were on every ad URL: the embed loaded before
  `hubspotutk` existed (cookie race; `tl.js` waits up to 2 s) or a consent banner blocked the tracking code.
  Check `parentHubspotUtk` in the iframe `src` on that browser.
- **Google conversions > HubSpot Paid Search bookings**: duplicates (a visitor booked twice, or opened `/thanks/`
  in two browsers) or `leadLabel` was filled in and both labels count. Leave `leadLabel` empty.
- **Google 0 while HubSpot Paid Search > 0**: the redirect or the tag. Either the widget's `meetingBookSucceeded`
  message did not reach the page and HubSpot's redirect is not set to `/thanks/?b=hs`, or `adsId` /
  `bookedLabel` is wrong. Re-run step 7.
- **Meta results 0 while HubSpot Paid Social > 0**: the dataset is under the Standard Events restriction; use
  Landing page views and read Meta bookings from HubSpot only.
- **Meetings > Scheduled > HubSpot booked view**: bookings that came in with no ad source (organic, direct, or
  the cookie race above). The saved view filters on Paid Search / Paid Social, so this gap is the untracked share.
