# Ads launch — one Google ad, one Meta ad set, a few dollars a day

Two angles, both about caregivers, both landing on pages whose headline matches the ad word for word:

| Angle | Ad says | Lands on | Who it is for |
|---|---|---|---|
| **A. Caregiver support** | Therapy for older adults. We make the first call. | `/caregiver/` (default hero) | Adults 65+, and the family members who book with them |
| **B. Caregiver stress, covered by Medicare** | Caregiver stress support for adults 65+. Covered by Medicare. | `/senior/?v=caregiver-stress` | Adults 65+ caring for a spouse, parent or grandchild |

## Meta compliance rules every headline follows

Meta's **Personal Attributes** standard rejects copy that asserts or implies something about the reader: age,
health or mental state, family situation, or a struggle. Since March 2026 that includes indirect second-person
framing. The pages and ads therefore:

- **Describe the service, never the reader.** "Therapy for adults 65+" (audience statement) is allowed;
  "Are you over 65?" is not. "Caregiver stress support, covered by Medicare" is allowed; "Caregiver stress? Talk to
  someone" and "You look after everyone. Who looks after you?" are not.
- **No questions that presume a condition or situation.** "Worried about Mom?" and "Sound familiar?" were removed
  for this reason. "Do you feel…" never appears in a headline.
- **"You" only for the action, never for an attribute.** "Book a call. A real person calls you." is fine.
  "You're carrying a lot" is not.
- **No negative self-perception, no before/after, no cure or guarantee language.** Outcomes are quoted with their
  source line only.
- **Medicare wording** stays on the approved lines ("Covered by Medicare", "Most members are covered up to 100% with
  Medicare + supplemental insurance", "Total Life is an enrolled Medicare provider"). Nothing suggests government
  affiliation or an official Medicare programme.
- **Health data**: the pixel sends only PageView, Lead and Schedule, with no parameters, and the ad never links
  directly to a page that asks health questions before identity (the self-check page is not in this test).
- **Landing page must match the ad**: the hero headline on each URL below repeats the ad headline.

The `?v=` parameter swaps only the hero eyebrow, headline and lede so the first screen repeats the ad. Everything
else on the page is unchanged. `?v=caregiver-support` is also available on `/senior/` if angle A ever needs a
65+ version.

Replace `https://YOUR-DOMAIN` below with the domain the pages are hosted on.

## 0. Tags and conversions (do this before the ads)

Everything is switched on from `assets/js/config.js`. Empty value = that tag is not loaded.

### Google Ads
1. Tools > **Conversions** > New conversion action > **Website** > enter the domain > **Add a conversion action
   manually**.
   - `Care call requested` — category **Submit lead form**, value none, count **One**, click-through window 30 days.
   - `Care call booked` — category **Book appointment**, count **One**.
2. Open each action > **Tag setup** > "Use Google tag" > copy the **conversion ID** (`AW-XXXXXXXXX`) and each
   **label**. Put them in `config.js` as `google.adsId`, `google.leadLabel`, `google.bookedLabel`.
3. Set `Care call requested` as **Primary** (used for bidding) and `Care call booked` as **Secondary** for now.
   Once bookings exceed roughly 30 a month, flip them.
4. Optional GA4: create a property, put its `G-` ID in `google.ga4Id`. Every CTA click and form step is sent as an
   event (`hero_cta`, `book_step_name`, `book_submit`, `lead_submitted`, `care_call_booked`).

### Meta
1. Events Manager > **Connect data sources > Web > Meta Pixel**. Name `Total Life landing pages`. Copy the
   **Pixel / dataset ID** into `config.js` as `meta.pixelId`.
2. The site fires `PageView` on every page, **`Lead`** on `/thanks/` after a real submission and **`Schedule`**
   when the HubSpot calendar reports a booking. No custom parameters are sent. Do not add any.
3. **Health and wellness restriction**: Meta classifies mental-health domains as health and wellness and may
   restrict the domain to "core setup". Under core setup, `PageView` still arrives, `Lead` and `Schedule` may be
   dropped and URL parameters are stripped. Check Events Manager > the dataset > **Overview** for a "data sharing
   restrictions" banner. If `Lead` is blocked, optimise the ad set for **Landing page views** and read
   conversions from HubSpot (utm_source=facebook) instead. Do not try to work around the restriction; it exists
   because Meta is not a HIPAA business associate.
4. Verify the domain: Business settings > Brand safety > **Domains** > add and verify with the meta tag or DNS.
   Then **Aggregated Event Measurement** > configure web events: rank `Lead` first, `Schedule` second.

### HubSpot
Portal ID, form GUID and meetings link per `docs/hubspot-setup.md`. Connect the Google Ads and Meta ad accounts
under Marketing > Ads so HubSpot attributes contacts to each campaign.

### Smoke test
Open the live page with a fake `gclid`, submit, book. Expect: Google Ads conversion diagnostics show a tag hit
within a few hours; Meta Events Manager > Test events shows PageView + Lead (or PageView only under restriction);
HubSpot shows the contact with utm fields and a meeting.

## 1. Google Ads — Search campaign, one ad group per angle

Campaign: **Search** > goal Leads > `TL — Caregiver test`. Networks: **Search only** (untick Display and Search
partners). Locations: United States (or the states Total Life serves). Language: English. Bidding: **Maximise
clicks** with a **max CPC cap of $4** for the first two weeks, then switch to Maximise conversions once there are
15+ conversions. Budget: **$5/day**. Ad schedule: **9 am to 9 pm Eastern** every day (calls are answered live
only in that window). Audience: **Observation** only, no targeting restrictions, age 45+ where available.

### Ad group A — Caregiver support (→ `/caregiver/`)

Final URL:
`https://YOUR-DOMAIN/caregiver/?utm_source=google&utm_medium=cpc&utm_campaign=caregiver-test&utm_content=caregiver-support&utm_term={keyword}`

Keywords (phrase match): `therapy for elderly parent`, `counseling for my mom`, `mental health help for aging parent`,
`depression in elderly parent what to do`, `senior therapist medicare`, `therapy for seniors covered by medicare`,
`online therapy for elderly parents`, `help for mom with anxiety`.
Negatives: `job`, `jobs`, `salary`, `free`, `near me` (we are telehealth), `dementia care facility`, `nursing home`,
`hospice`, `medicaid`.

Responsive search ad
- Headlines (pin 1 to position 1): `Therapy for Older Adults` · `We Make the First Call` · `Covered by Medicare` ·
  `Book a Call With Our Care Team` · `Senior-Specialized Therapists` · `By Phone or Video, From Home` ·
  `Talk to a Real Person Today` · `9am–9pm ET, 7 Days` · `No Computer Needed`
- Descriptions: `Book a 15-minute call. A real person listens first. Family members are welcome to book with you.
  Covered by Medicare.` · `Licensed therapists who specialize in older adults. Sessions by phone or video from home.`
  · `Most members are covered up to 100% with Medicare + supplemental insurance. Book a call today.`
- Sitelinks: How it works → `#how` · Signs it might be time → `#signs` · Our founder → `#founder` · Questions → `#faq`
- Callout: `Enrolled Medicare provider` · `Phone or video` · `Real people, not bots`
- Call asset: 1-800-567-LIFE, schedule 9 am to 9 pm ET.

### Ad group B — Caregiver stress, covered by Medicare (→ `/senior/?v=caregiver-stress`)

Final URL:
`https://YOUR-DOMAIN/senior/?v=caregiver-stress&utm_source=google&utm_medium=cpc&utm_campaign=caregiver-test&utm_content=caregiver-stress&utm_term={keyword}`

Keywords (phrase match): `caregiver stress`, `caregiver burnout help`, `caregiver support therapy`, `caring for
spouse with dementia stress`, `caregiver counseling medicare`, `therapy for caregivers`, `caregiver depression`,
`support for family caregivers`.
Negatives: as above plus `respite care`, `paid caregiver`, `caregiver agency`, `become a caregiver`.

Responsive search ad
- Headlines (pin 1): `Caregiver Stress Support, 65+` · `Therapy for Older Adult Caregivers` · `Covered by Medicare` ·
  `Therapy by Phone, From Home` · `Book a Call With Our Care Team` · `Therapists Who Understand Caregiving` ·
  `Real Person, 9am–9pm ET` · `Medicare + Supplemental: Up to 100%`
- Descriptions: `Talk therapy for adults 65+ who look after a loved one, with therapists who specialize in older
  adults. Covered by Medicare.` · `Book a 15-minute call. We check coverage together and match you with a therapist.`
  · `Most members are covered up to 100% with Medicare + supplemental insurance. No computer needed.`

Compliance: never use "free therapy", urgency ("act now", "limited"), or guarantees. "Covered by Medicare" and
"up to 100% with Medicare + supplemental insurance" are the approved lines.

## 2. Meta — one campaign, one ad set, two ads

Campaign: **Leads** objective, name `TL — Caregiver test`, **Special ad category: none** (this is not credit,
employment, housing or politics). Advantage+ campaign budget **off**.

Ad set `Adults 65+ — US`: conversion location **Website**, pixel = the dataset above, performance goal
**Maximise number of conversions**, conversion event **Lead** (if restricted, use **Landing page views**).
Budget **$5/day**. Schedule: run continuously (Meta only allows dayparting with lifetime budgets; the landing
page and HubSpot handle after-hours leads by letting them pick a time). Location: United States. Age **55 to 65+** (Meta caps the top bracket at 65+; 55 catches spouses booking together).
Gender all. Detailed targeting: leave broad. Do not use health or caregiving interest targeting: it is both restricted for health advertisers and unnecessary at this budget.
Placements: **Advantage+**, but exclude Audience Network. Attribution: 7-day click, 1-day view.

### Ad A — Caregiver support (→ `/caregiver/`)
URL: `https://YOUR-DOMAIN/caregiver/?utm_source=facebook&utm_medium=paid_social&utm_campaign=caregiver-test&utm_content=caregiver-support`
- Primary text: `Talk therapy for adults 65+, from home, by phone or video. Book a call and a real person from our
  care team calls at a time you choose. We listen first, then match you with a therapist who specializes in older
  adults. Family members are welcome to book with you. Covered by Medicare.`
- Headline: `Therapy for older adults. We make the first call.` · Description: `Covered by Medicare · Book a call`
- CTA button: **Book Now**
- Creative: the caregiver hero still when installed; until then the senior hero (`assets/img/people/senior-hero.jpg`)
  cropped 1:1 and 4:5, and the 5-second `senior-hero.mp4` for Reels/Stories with the headline as an overlay in
  brand teal on cream. No text over faces.

### Ad B — Caregiver stress, covered by Medicare (→ `/senior/?v=caregiver-stress`)
URL: `https://YOUR-DOMAIN/senior/?v=caregiver-stress&utm_source=facebook&utm_medium=paid_social&utm_campaign=caregiver-test&utm_content=caregiver-stress`
- Primary text: `Looking after a spouse, a parent or a grandchild is hard work. Total Life offers talk therapy for
  adults 65+ who care for someone else, with therapists who specialize in older adults, from home, by phone or video.
  Most members are covered up to 100% with Medicare + supplemental insurance. Book a short call with our care team.`
- Headline: `Caregiver stress support for adults 65+. Covered by Medicare.` · Description: `Book a 15-minute call`
- CTA button: **Book Now**
- Creative: `senior-hero.jpg` / `senior-hero.mp4` as above.

See the Meta compliance rules at the top. Ad copy and the matching hero headline were written together so review of one covers the other.

## 3. Reading the results

Every lead carries `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `gclid`/`fbclid`, `landing_page` and
`landing_variant` into HubSpot. Compare in HubSpot (Contacts by Original source drill-down) rather than in the ad
platforms, since Meta may be under-reporting.

| Metric | Where | Good sign in week 1 at $5/day each |
|---|---|---|
| Clicks and CPC | Google Ads, Meta Ads Manager | Google CPC $2 to $5; Meta CPC $0.80 to $2.50 |
| Landing page → form start | GA4 `book_step_name` / page views | 15%+ |
| Form start → submitted | GA4 `lead_submitted` / `book_step_name` | 60%+ |
| Submitted → booked a time | HubSpot meetings vs form submissions | 40%+ |
| Called within 5 min | HubSpot call logs vs create time | 90%+ (this is the one that matters) |
| Connected → intake | Lead status `Booked first session` | 30%+ of connected |

Stop rule for the test: after $150 total or two weeks, whichever comes first, decide per angle on
**cost per connected call**, not on clicks.
