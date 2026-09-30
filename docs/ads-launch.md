# Ads launch — four themes, one Google campaign and one Meta campaign each

Four landing pages, each with one event: book a call in the embedded HubSpot widget. Every ad lands on the page
whose hero headline repeats the ad word for word.

| Theme | `utm_campaign` | Lands on | Hero eyebrow | Hero headline (= ad headline) |
|---|---|---|---|---|
| **Senior (general)** | `senior` | `/senior/` | Therapy for adults 65+. Covered by Medicare. | Hope is closer than you think. |
| **Caregiver support** | `caregiver` | `/caregiver/` | — | Therapy for older adults. We make the first call. |
| **Depression** | `depression` | `/depression/` | Depression therapy for adults 65+. Covered by Medicare. | Low mood isn't just part of getting older. |
| **Grief and loss** | `grief` | `/grief/` | Grief counseling for adults 65+. Covered by Medicare. | Grief doesn't keep a schedule. Support can. |

`/senior/` also has `?v=caregiver-stress` and `?v=caregiver-support` variants that swap only the hero eyebrow,
headline and lede. The caregiver-stress variant is used by the existing ad group B below inside the senior campaign.

Budgets: **Google $50/day per campaign, Meta $30/day per campaign**, so $200/day Google and $120/day Meta across
the four themes. Google is **Search only**: no Performance Max, no Display, no Search partners. Psychiatry and
GLP-1 are not offered in this funnel and appear only as negatives.

Replace `https://YOUR-DOMAIN` below with the domain the pages are hosted on. Phone everywhere: **1-800-567-5433**.

## Meta compliance rules every headline follows

Meta's **Personal Attributes** standard rejects copy that asserts or implies something about the reader: age,
health or mental state, family situation, or a struggle. Since March 2026 that includes indirect second-person
framing. The pages and ads therefore:

- **Describe the service and the condition in general statements, never the reader.** "Therapy for adults 65+"
  and "Depression therapy for adults 65+" are allowed; "Are you over 65?" and "Feeling low?" are not. "Caregiver
  stress support, covered by Medicare" is allowed; "You look after everyone. Who looks after you?" is not.
- **No rhetorical questions.** "Worried about Mom?", "Sound familiar?", "Do you feel…" never appear in a headline
  or primary text.
- **"You" only for the action, never for an attribute.** "Book a call. A real person calls you." is fine.
  "You're carrying a lot" is not.
- **No negative self-perception, no before/after, no cure or guarantee language.** Outcomes are quoted with their
  source line only.
- **Medicare wording** stays on the approved lines ("Covered by Medicare", "Most members are covered up to 100% with
  Medicare + supplemental insurance", "Total Life is an enrolled Medicare provider"). Nothing suggests government
  affiliation or an official Medicare programme. Never "free therapy", "no cost", "Medicare-approved", urgency.
- **Health data**: the pixel sends only PageView, Lead and Schedule, with no parameters. No page asks a health
  question; the booking form asks name, email, phone, date of birth and state only.
- **Landing page must match the ad**: the hero headline on each URL repeats the ad headline.

## 0. Tags and conversions (do this before the ads)

Everything is switched on from `assets/js/config.js`. Empty value = that tag is not loaded.

There is no separate lead step. Booking is the only event, and both the Lead and the booked conversion fire on
`/thanks/`, where the visitor lands after the HubSpot widget reports `meetingBookSucceeded` (and via HubSpot's own
post-booking redirect as a fallback).

### Google Ads
1. Tools > **Conversions** > New conversion action > **Website** > enter the domain > **Add a conversion action
   manually**: `Care call booked`, category **Book appointment**, value none, count **One**, click-through window
   30 days. This is the **only** conversion action, set as **Primary**.
2. Open it > **Tag setup** > "Use Google tag" > copy the **conversion ID** (`AW-XXXXXXXXX`) and the **label**.
   Put them in `config.js` as `google.adsId` and `google.bookedLabel`. Leave `google.leadLabel` empty so the
   booking is not counted twice.
3. Optional GA4: create a property, put its `G-` ID in `google.ga4Id`. CTA clicks (`hero_cta` etc.) and
   `care_call_booked` are sent as events.

### Meta
1. Events Manager > **Connect data sources > Web > Meta Pixel**. Name `Total Life landing pages`. Copy the
   **Pixel / dataset ID** into `config.js` as `meta.pixelId`.
2. The site fires `PageView` on every page and both **`Schedule`** and **`Lead`** on `/thanks/`. No custom
   parameters are sent. Do not add any. **Schedule** is the optimisation event; **Lead** is secondary.
3. **Health and wellness restriction**: Meta classifies mental-health domains as health and wellness and may
   restrict the domain to "core setup". Under core setup, `PageView` still arrives, `Lead` and `Schedule` may be
   dropped and URL parameters are stripped. Check Events Manager > the dataset > **Overview** for a "data sharing
   restrictions" banner. If `Schedule` is blocked, optimise the ad sets for **Landing page views** and read
   bookings from HubSpot (utm_source=facebook) instead. Do not try to work around the restriction; it exists
   because Meta is not a HIPAA business associate.
4. Verify the domain: Business settings > Brand safety > **Domains** > add and verify with the meta tag or DNS.
   Then **Aggregated Event Measurement** > configure web events: rank `Schedule` first, `Lead` second.

### HubSpot
Portal ID and meetings link per `docs/hubspot-setup.md`. Connect the Google Ads and Meta ad accounts under
Marketing > Ads so HubSpot attributes booked contacts to each campaign.

### Smoke test
Open the live page with a fake `gclid` and `?utm_source=google&utm_medium=cpc&utm_campaign=smoke`, book a time.
Expect: the browser lands on `/thanks/`; Google Ads conversion diagnostics show a tag hit within a few hours; Meta
Events Manager > Test events shows PageView + Schedule + Lead (or PageView only under restriction); HubSpot shows
the booked contact with Original source and the meeting.

## 1. Google Ads — one Search campaign per theme

Each campaign: **Search** > goal Leads > `TL — <theme>`. Networks: **Search only** (untick Display and Search
partners). No Performance Max. Locations: United States (or the states Total Life serves). Language: English.
Bidding: **Maximise clicks** with a **max CPC cap of $6** for the first two weeks, then Maximise conversions on
`Care call booked` once a campaign has 15+ bookings. Budget: **$50/day per campaign**. Ad schedule: **9 am to
9 pm Eastern** every day (the widget only shows slots in that window, and a click at 11 pm books for tomorrow at
best). Audience: **Observation** only, age 45+ where available.

Final URL pattern:
`https://YOUR-DOMAIN/<page>/?utm_source=google&utm_medium=cpc&utm_campaign=<theme>&utm_content=<ad group>&utm_term={keyword}`

Shared negatives (add to every campaign as a list): `psychiatry`, `psychiatrist`, `medication`, `GLP-1`,
`Ozempic`, `Wegovy`, `semaglutide`, `job`, `jobs`, `salary`, `free`, `medicaid`, `near me`, `dementia care
facility`, `nursing home`, `hospice`, `crisis`, `hotline`.

Common assets on every RSA: Callout `Enrolled Medicare provider` · `Phone or video` · `Real people, not bots`.
Sitelinks: How it works → `#how` · Questions → `#faq` · Book a call → `#book`. Call asset: 1-800-567-5433,
schedule 9 am to 9 pm ET.

### Campaign `TL — senior` (→ `/senior/`)

Ad group `senior-general`. Final URL:
`https://YOUR-DOMAIN/senior/?utm_source=google&utm_medium=cpc&utm_campaign=senior&utm_content=senior-general&utm_term={keyword}`

Keywords (phrase match): `therapy for seniors`, `therapy for seniors covered by medicare`, `medicare therapist`,
`counseling for older adults`, `medicare mental health coverage`, `online therapy medicare`, `therapist for
elderly`, `talk therapy medicare`.

Responsive search ad
- Headlines (pin 1 to position 1): `Hope Is Closer Than You Think` · `Therapy for Adults 65+` · `Covered by Medicare` ·
  `Book a Call With Our Care Team` · `Senior-Specialized Therapists` · `By Phone or Video, From Home` ·
  `Real Person, 9am–9pm ET` · `No Computer Needed` · `Medicare + Supplemental: Up to 100%`
- Descriptions: `Talk therapy for adults 65+ with therapists who specialize in older adults. Book a 15-minute call
  and a real person calls you. Covered by Medicare.` · `Sessions by phone or video from home. Most members are
  covered up to 100% with Medicare + supplemental insurance.` · `Total Life is an enrolled Medicare provider. Pick a
  time and a real person from our care team calls, 9am to 9pm ET, seven days.`

Ad group `caregiver-stress` (→ `/senior/?v=caregiver-stress`). Final URL:
`https://YOUR-DOMAIN/senior/?v=caregiver-stress&utm_source=google&utm_medium=cpc&utm_campaign=senior&utm_content=caregiver-stress&utm_term={keyword}`

Keywords (phrase match): `caregiver stress`, `caregiver burnout help`, `caregiver support therapy`, `caring for
spouse with dementia stress`, `caregiver counseling medicare`, `therapy for caregivers`, `caregiver depression`,
`support for family caregivers`.
Negatives: shared list plus `respite care`, `paid caregiver`, `caregiver agency`, `become a caregiver`.

Responsive search ad
- Headlines (pin 1): `Caregiver Stress Support, 65+` · `Therapy for Older Adult Caregivers` · `Covered by Medicare` ·
  `Therapy by Phone, From Home` · `Book a Call With Our Care Team` · `Therapists Who Understand Caregiving` ·
  `Real Person, 9am–9pm ET` · `Medicare + Supplemental: Up to 100%`
- Descriptions: `Talk therapy for adults 65+ who look after a loved one, with therapists who specialize in older
  adults. Covered by Medicare.` · `Book a 15-minute call. We check coverage together and match you with a therapist.`
  · `Most members are covered up to 100% with Medicare + supplemental insurance. No computer needed.`

### Campaign `TL — caregiver` (→ `/caregiver/`)

Ad group `caregiver-support`. Final URL:
`https://YOUR-DOMAIN/caregiver/?utm_source=google&utm_medium=cpc&utm_campaign=caregiver&utm_content=caregiver-support&utm_term={keyword}`

Keywords (phrase match): `therapy for elderly parent`, `counseling for my mom`, `mental health help for aging parent`,
`depression in elderly parent what to do`, `senior therapist medicare`, `therapy for seniors covered by medicare`,
`online therapy for elderly parents`, `help for mom with anxiety`.

Responsive search ad
- Headlines (pin 1): `Therapy for Older Adults` · `We Make the First Call` · `Covered by Medicare` ·
  `Book a Call With Our Care Team` · `Senior-Specialized Therapists` · `By Phone or Video, From Home` ·
  `Talk to a Real Person Today` · `9am–9pm ET, 7 Days` · `No Computer Needed`
- Descriptions: `Book a 15-minute call. A real person listens first. Family members are welcome to book with you.
  Covered by Medicare.` · `Licensed therapists who specialize in older adults. Sessions by phone or video from home.`
  · `Most members are covered up to 100% with Medicare + supplemental insurance. Book a call today.`

### Campaign `TL — depression` (→ `/depression/`)

Ad group `depression`. Final URL:
`https://YOUR-DOMAIN/depression/?utm_source=google&utm_medium=cpc&utm_campaign=depression&utm_content=depression&utm_term={keyword}`

Keywords (phrase match): `depression therapy for seniors`, `depression counseling medicare`, `therapy for
depression older adults`, `medicare covered depression treatment`, `talk therapy for depression elderly`,
`depression in elderly treatment`, `late life depression therapy`, `counseling for low mood seniors`.
Negatives: shared list plus `antidepressant`, `antidepressants`, `SSRI`, `prescription`, `test`, `quiz`.

Responsive search ad
- Headlines (pin 1): `Low Mood Isn't Just Part of Aging` · `Depression Therapy for Adults 65+` · `Covered by Medicare` ·
  `Talk Therapy by Phone or Video` · `Book a Call With Our Care Team` · `Therapists Who Specialize in 65+` ·
  `Real Person, 9am–9pm ET` · `No Computer Needed` · `Medicare + Supplemental: Up to 100%`
- Descriptions: `Depression therapy for adults 65+ with licensed therapists who specialize in older adults. Book a
  15-minute call. Covered by Medicare.` · `Talk therapy helps with low mood, loss of interest, sleep and worry.
  Sessions by phone or video from home.` · `Most members are covered up to 100% with Medicare + supplemental
  insurance. Total Life is an enrolled Medicare provider.`

### Campaign `TL — grief` (→ `/grief/`)

Ad group `grief`. Final URL:
`https://YOUR-DOMAIN/grief/?utm_source=google&utm_medium=cpc&utm_campaign=grief&utm_content=grief&utm_term={keyword}`

Keywords (phrase match): `grief counseling`, `grief counseling medicare`, `grief therapy for seniors`, `bereavement
counseling for older adults`, `grief counseling after loss of spouse`, `grief support therapy`, `counseling after
death of spouse`, `grief counselor covered by medicare`.
Negatives: shared list plus `funeral`, `funeral home`, `support group`, `pet loss hotline`, `chaplain`.

Responsive search ad
- Headlines (pin 1): `Grief Doesn't Keep a Schedule` · `Grief Counseling for Adults 65+` · `Covered by Medicare` ·
  `Support Can Be Scheduled` · `Talk to a Grief Counselor by Phone` · `Book a Call With Our Care Team` ·
  `Real Person, 9am–9pm ET` · `Therapists Who Specialize in 65+` · `Medicare + Supplemental: Up to 100%`
- Descriptions: `Grief counseling for adults 65+, by phone or video from home, with therapists who specialize in
  older adults. Covered by Medicare.` · `Counseling after the loss of a spouse, a friend, a sibling or a pet, in
  the first year and beyond. Book a 15-minute call.` · `Most members are covered up to 100% with Medicare +
  supplemental insurance. A real person calls at the time you pick.`

Compliance: never use "free therapy", urgency ("act now", "limited"), or guarantees. "Covered by Medicare" and
"up to 100% with Medicare + supplemental insurance" are the approved lines.

## 2. Meta — one campaign per theme, one ad set each

Each campaign: **Leads** objective, name `TL — <theme>`, **Special ad category: none** (this is not credit,
employment, housing or politics). Advantage+ campaign budget **off**.

Ad set `Adults 65+ — US`: conversion location **Website**, pixel = the dataset above, performance goal
**Maximise number of conversions**, conversion event **Schedule** (if restricted, use **Landing page views**).
Budget **$30/day per campaign**. Schedule: run continuously (Meta only allows dayparting with lifetime budgets;
the widget shows the next open 9 am to 9 pm slot, so a night click still books). Location: United States. Age
**55 to 65+** (Meta caps the top bracket at 65+; 55 catches spouses and adult children booking together). Gender
all. Detailed targeting: leave broad. Do not use health, grief or caregiving interest targeting: it is restricted
for health advertisers and unnecessary at this budget. Placements: **Advantage+**, but exclude Audience Network.
Attribution: 7-day click, 1-day view.

Creative for every ad until theme stills are installed: the senior hero (`assets/img/people/senior-hero.jpg`)
cropped 1:1 and 4:5, and the 5-second `senior-hero.mp4` for Reels/Stories with the headline as an overlay in brand
teal on cream. No text over faces.

### Campaign `TL — senior` — Ad: Senior general (→ `/senior/`)
URL: `https://YOUR-DOMAIN/senior/?utm_source=facebook&utm_medium=paid_social&utm_campaign=senior&utm_content=senior-general`
- Primary text: `Talk therapy for adults 65+, from home, by phone or video, with therapists who specialize in
  older adults. Book a 15-minute call and a real person from our care team calls at the time you choose. We check
  coverage together, then match you with a therapist. Covered by Medicare.`
- Headline: `Hope is closer than you think.` · Description: `Therapy for adults 65+ · Covered by Medicare`
- CTA button: **Book Now**

### Campaign `TL — senior` — Ad: Caregiver stress (→ `/senior/?v=caregiver-stress`)
URL: `https://YOUR-DOMAIN/senior/?v=caregiver-stress&utm_source=facebook&utm_medium=paid_social&utm_campaign=senior&utm_content=caregiver-stress`
- Primary text: `Looking after a spouse, a parent or a grandchild is hard work. Total Life offers talk therapy for
  adults 65+ who care for someone else, with therapists who specialize in older adults, from home, by phone or video.
  Most members are covered up to 100% with Medicare + supplemental insurance. Book a short call with our care team.`
- Headline: `Caregiver stress support for adults 65+. Covered by Medicare.` · Description: `Book a 15-minute call`
- CTA button: **Book Now**

### Campaign `TL — caregiver` — Ad: Caregiver support (→ `/caregiver/`)
URL: `https://YOUR-DOMAIN/caregiver/?utm_source=facebook&utm_medium=paid_social&utm_campaign=caregiver&utm_content=caregiver-support`
- Primary text: `Talk therapy for adults 65+, from home, by phone or video. Book a call and a real person from our
  care team calls at a time you choose. We listen first, then match you with a therapist who specializes in older
  adults. Family members are welcome to book with you. Covered by Medicare.`
- Headline: `Therapy for older adults. We make the first call.` · Description: `Covered by Medicare · Book a call`
- CTA button: **Book Now**
- Creative: the caregiver hero still when installed; until then the senior hero as above.

### Campaign `TL — depression` — Ad: Depression (→ `/depression/`)
URL: `https://YOUR-DOMAIN/depression/?utm_source=facebook&utm_medium=paid_social&utm_campaign=depression&utm_content=depression`
- Primary text: `Low mood, loss of interest, poor sleep and worry are common in later life, and talk therapy helps.
  Total Life offers depression therapy for adults 65+ with licensed therapists who specialize in older adults, from
  home, by phone or video. Book a 15-minute call and a real person from our care team calls at the time you choose.
  Covered by Medicare.`
- Headline: `Low mood isn't just part of getting older.` · Description: `Depression therapy for adults 65+ · Covered by Medicare`
- CTA button: **Book Now**

### Campaign `TL — grief` — Ad: Grief and loss (→ `/grief/`)
URL: `https://YOUR-DOMAIN/grief/?utm_source=facebook&utm_medium=paid_social&utm_campaign=grief&utm_content=grief`
- Primary text: `Grief after losing a spouse, a friend, a sibling or a pet does not follow a timetable, and grief
  counseling is a covered service. Total Life offers grief counseling for adults 65+ with therapists who specialize
  in older adults, from home, by phone or video. Book a 15-minute call and a real person from our care team calls at
  the time you choose. Covered by Medicare.`
- Headline: `Grief doesn't keep a schedule. Support can.` · Description: `Grief counseling for adults 65+ · Covered by Medicare`
- CTA button: **Book Now**

Ad copy and the matching hero headline were written together so review of one covers the other.

## 3. Reading the results

**The only number that matters is cost per booked call, per theme.** Bookings are counted in HubSpot, not in the
ad platforms: open the `Care calls — booked` view (`docs/hubspot-setup.md` section 4) and group by
`Original source drill-down 2` (= `utm_campaign`, one of `senior`, `caregiver`, `depression`, `grief`), split by
Original source (Paid Search vs Paid Social). Divide that platform's spend on the campaign by the count. Jason's
keyword and campaign tags on each booked contact give the keyword-level view for Google.

Platform numbers (clicks, CPC, reported conversions) are for troubleshooting only. Meta may under-report under
the health and wellness restriction; Google may double-count a repeat booking. HubSpot booked contacts win.

| Check | Where | Good sign in week 1 |
|---|---|---|
| Clicks and CPC | Google Ads, Meta Ads Manager | Google CPC $2 to $6; Meta CPC $0.80 to $2.50 |
| Page → booking | HubSpot booked ÷ platform clicks | 3%+ |
| Cost per booked call | Campaign spend ÷ HubSpot booked contacts for that `utm_campaign` | under $150 by end of week 2 |
| Booked → call happened | Meeting outcome logged by Peggy / Angela | 80%+ |

Stop rule per theme: after **$300 on that theme (Google + Meta combined) or two weeks**, whichever comes first,
decide on cost per booked call from HubSpot. Pause the theme or move its budget to the theme that books cheapest.
