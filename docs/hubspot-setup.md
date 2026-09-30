# HubSpot setup — book-a-call funnel

What this covers: the access you need, the round-robin calendar for Peggy and Angela, the booking form inside
that calendar, where the bookings land, daily operations, and how the Google and Meta campaigns show up as a
channel in HubSpot. Work top to bottom. The two IDs you collect go into `assets/js/config.js`.

The landing pages have no form of their own. The HubSpot meetings widget is embedded in the hero of `/senior/`,
`/caregiver/`, `/depression/` and `/grief/`; the visitor picks a time, answers the booking questions inside the
widget, and lands on `/thanks/`, where the ad conversions fire. Booked contacts in HubSpot are the internal source
of truth for every marketing decision.

## 0. Access you need (verify this first)

| Task | Minimum HubSpot role / tier |
|---|---|
| Copy the Portal ID, install tracking code | **Settings > Tracking code**. Free CRM is enough. |
| Create a **round-robin** meetings link across Peggy + Angela | **Sales Hub Starter** (or Service Hub Starter) paid seats for **both** Peggy and Angela. Round robin is not in the free tier; free gives one personal link per user. |
| Add questions (Date of birth, State) to the booking form | An **assigned Sales or Service seat** on the user editing the link. Without one, only the default name/email/phone fields are available. |
| Create the `state` dropdown property | **Edit property settings** permission (Settings > Properties). |
| SMS reminders, extra automation beyond confirmation and reminder emails | **SMS add-on** or **Workflows** (Starter for simple, Professional for full). |
| Store raw `utm_*` values as contact properties | **Marketing Hub Professional**. Without it HubSpot keeps only Original source and its two drill-downs (section 7), which is enough for this test. |
| Connect Google Ads and Meta ad accounts to HubSpot (Ads tool) | **Free** for read-only ad tracking. |
| Do any of the above | You must be a **user in the portal** with the relevant permission set. To do all of it in one sitting, ask for **Super Admin**. |

Quick check of what you have: Settings (gear) > Account Management > **Account & Billing** shows the subscription
per Hub. Settings > **Users & Teams** > your name shows your permission set. If "Sales Hub Starter" is absent,
the round-robin step will not appear and you need either the upgrade (two seats) or the fallback in 2b.

## 1. Users and hours

1. Settings > Users & Teams. Confirm **Peggy** and **Angela** exist as users. If not, **Create user**, give each a
   Sales Hub Starter seat and the "Sales" permission set (Meetings, Calling, Tasks).
2. **Tammy: ask Peggy or Neelam which of these she is.** The call notes have Peggy and Tammy setting evening-shift
   availability. Tammy can maintain availability on the connected calendars without a paid seat, but she is **not
   in the round robin** and cannot receive bookings unless she also has a Sales Hub Starter seat. If she should
   take evening calls, buy a third seat and add her in step 2a; if she only manages the calendars, add her as a
   free user with calendar access.
3. Peggy and Angela (and Tammy if seated) must each **connect their calendar**: Settings > General > **Calendar** >
   Connect (Google or Outlook). Round robin only offers times that are free on the connected calendar.
4. Each sets **working hours**: Settings > General > Calendar > **Availability**, or on the meetings link itself
   (step 2). Care line hours are **9:00 am to 9:00 pm Eastern, seven days a week**. Set the time zone to
   America/New_York explicitly so DST does not shift the window.
5. Create a team: Settings > Users & Teams > **Teams** > "Care team" with Peggy, Angela and Tammy. Used for views.

## 2. The calendar (round robin: Peggy + Angela)

### 2a. Round-robin link (Sales Hub Starter or above)

1. Sales > **Meetings** > **Create scheduling page** > **Round robin**.
2. **Team members:** Peggy, Angela (Tammy only if she has a seat, see §1). Turn **on** "Prioritise contact owner"
   so a returning contact books with the same person. Peggy reassigns the day's calls each morning anyway
   (section 5), so the automatic split only has to be roughly even.
3. **Overview**
   - Internal name: `Care call — round robin`
   - Title shown to visitors: `Your call with the Total Life care team`
   - Location: **Phone**. Description: `A real person from our care team will call you at the number you gave us.
     Questions: 1-800-567-5433.`
   - Duration: **15 minutes** (offer 15 only; more options create hesitation).
   - Link slug: `care-call` (full link becomes `https://meetings.hubspot.com/<account>/care-call`).
4. **Scheduling**
   - Availability window: **Mon to Sun, 9:00 am to 9:00 pm, America/New_York**.
   - Minimum notice: **15 minutes**. Rolling window: **2 weeks**. Buffer: **5 min**. Start time increments: **15 min**.
   - Booking limit per day: leave unlimited for the test spend.
5. **Form**: see section 3. This is the only form in the funnel.
6. **Confirmation**: **Redirect to another page** > **`https://DOMAIN/thanks/?b=hs`** (the `?b=hs` matters).
   The site normally redirects itself when the widget posts `meetingBookSucceeded`, and `/thanks/` fires the
   conversions only when that happened in the same tab **or** the URL carries `?b=hs`. If the widget's message is
   ever missed, HubSpot's redirect with `?b=hs` is what still counts the booking. Without `?b=hs`, the visitor
   lands on `/thanks/` and nothing fires.
7. **Automation**: confirmation email **on**, from the assigned team member. Reminder emails **24 h and 1 h**
   before. SMS reminders: turn on if the portal has HubSpot's **SMS add-on**; otherwise build a workflow
   (Automation > Workflows, trigger "Meeting booked", action "Send SMS") if a connected SMS integration exists.
   If neither is available, email reminders are enough for the test.
8. **Save**. Copy the link. Paste into `assets/js/config.js` as `hubspot.meetingsLink`.

The site embeds the link with `embed=true` and appends the visit's `utm_source`, `utm_medium`, `utm_campaign`,
`utm_content` and `utm_term`. Nothing is pre-filled and there are no hidden fields: attribution comes from the
HubSpot tracking cookie plus those UTMs (section 7). The page only accepts the booked message from a
`*.hubspot.com` origin; **if the meetings link is ever moved to a custom domain, the origin check in
`assets/js/tl.js` must be changed** or the redirect to `/thanks/` stops working.

### 2b. Fallback if you only have Free

Free gives one **personal** link per user, no round robin. Use Peggy's personal link
(Sales > Meetings > Peggy's default link, same settings as above) as `hubspot.meetingsLink`. Peggy hands calls
to Angela in the morning reassignment (section 5). Switch to round robin once the Starter seats are in place.

## 3. The booking form inside the widget

The questions the visitor answers after picking a time are the whole intake. Meetings link > **Form** tab:

1. Default questions, all **required**: **First name**, **Last name**, **Email** (HubSpot requires it and sends
   the confirmation to it), **Phone number**.
2. **Add question** > contact property **Date of birth** (`date_of_birth`; the default property is single-line
   text, a date picker is cleaner). Required.
3. **Add question** > contact property **State**. Either use HubSpot's default **State/Region** (`state`) as a
   single-line field, or, preferred, first edit `state` in Settings > **Properties** into a **dropdown select** with
   the 50 US states + DC so the value is clean for reporting. Required.
4. Nothing else. No ZIP, no reason for the call, no health questions.
5. **Privacy and consent**: turn on **Consent checkbox** (or "Legitimate interest" text if legal prefers no
   checkbox) and paste **Total Life's vetted opt-in language** verbatim into the consent text. It must include a
   line that the person booking **owns the phone number given or has the owner's permission** to be contacted on
   it, because a family member may book with the member (TCPA). This records consent on the contact, which is what
   the outbound call and any SMS reminder rely on. The landing page repeats the same text under the widget
   (`docs/compliance-migration.md`).

Adding questions requires the editing user to hold an assigned Sales or Service seat. If the **Add question**
button is missing, that is why.

Test: `docs/ads-launch.md` §4 (Day-one verification) is the full live test, including what the contact record
must show within a minute of booking.

## 4. Where the bookings sit and how to see them

A booking creates (or updates) a **Contact** and a **Meeting** on its timeline. There is no Deal or Ticket
unless you add one. Two places to look:

- **Sales > Meetings > Scheduled**: everything booked through the widget, per team member. This is the daily list.
- **Contact record > Activity**: the meeting, the booking form answers, consent, and Original source.

Make one saved view (Contacts > **Advanced filters** > Save view, share with team "Care team"):

- **`Care calls — booked`**: contacts with a **meeting booked from the `Care call — round robin` link**
  (filter: Meetings > Meeting source or Meeting name contains `Care call`; or `Number of meetings` ≥ 1 AND
  `Original source` = Paid Search or Paid Social). Columns: Create date, Next activity date, Contact owner, Phone,
  State, **Original source**, **Original source drill-down 1**, **Original source drill-down 2**. Sort by Next
  activity date. Group by drill-down 1 for Paid Search (the campaign) and by drill-down 2 for Paid Social (the
  campaign); see section 7 for why they differ.

This view is the count that every marketing decision is read from (`docs/ads-launch.md` §3).

## 5. Daily operations

- Every booking lands on Peggy's or Angela's calendar via round robin. **Each morning Peggy reviews the day in
  Sales > Meetings > Scheduled and reassigns calls** (open the meeting > change owner/attendee) so the split matches
  who is actually working.
- **Peggy and Tammy maintain evening-shift availability** (roughly 5 pm to 9 pm Eastern) on the connected
  calendars: block time that is not covered, unblock time that is. The widget only ever shows open slots, so a
  call cannot be booked at a time nobody is available. There is no after-hours "call me back" path.
- Nobody needs to watch a lead list: if it is not on the calendar, it did not happen.

## 6. Notifications

On the meetings link the booked team member gets the calendar invite and HubSpot's booking notification by
default. Add Peggy to notifications for every booking so she can reassign: Settings > **Notifications** >
Meetings > "Meeting booked" for Peggy (email + mobile push). Call scripts and lead statuses are out of scope.

## 7. The ads as a channel inside HubSpot

1. Settings > **Tracking & Analytics > Tracking code**. Copy the Hub ID into `assets/js/config.js` as
   `hubspot.portalId`. `assets/js/track.js` loads `js.hs-scripts.com/<portalId>.js` on every page, which sets the
   first-party **`hubspotutk`** cookie.
2. **Cookie ordering.** `assets/js/tl.js` waits for `hubspotutk` (up to 2 seconds) before loading
   `MeetingsEmbedCode.js`. HubSpot's embed copies the cookie into the iframe URL as `parentHubspotUtk` and the
   landing URL as `parentPageUrl`, which is how the booked contact keeps the visit's source. If the embed loaded
   first, the contact would attribute to Direct or Offline. `tl.js` also appends the visit's UTMs to the meetings
   link as a cookie-independent second path.
3. **Original source mapping.** HubSpot detects **Paid Search** from `utm_medium=cpc` or a `gclid`, and
   **Paid Social** from `utm_medium=paid_social` (or an `fbclid`). Then:
   - Paid Search: **drill-down 1 = campaign** (`utm_campaign`), **drill-down 2 = search term** (`utm_term`, the
     keyword).
   - Paid Social: **drill-down 1 = network** (facebook), **drill-down 2 = campaign** (`utm_campaign`).
   - `utm_content` is **not** stored on the contact. Raw UTMs are not stored as properties without Marketing Hub
     Professional. This is why the saved view groups by drill-down 1 for Paid Search and drill-down 2 for Paid
     Social, and why `docs/ads-launch.md` runs one ad per Meta campaign.
4. Marketing > **Ads** > Connect accounts > **Google Ads** and **Facebook Ads**. Turn on **auto-tracking** so
   HubSpot adds its own click IDs and reports contacts per campaign in the Ads tool as well. Keep the UTMs from
   `docs/ads-launch.md` on every final URL regardless; they are what the saved view reads.
5. **Jason maps bookings to keyword and campaign** from Original source and the two drill-downs: Google keyword
   from Paid Search drill-down 2 (`utm_term={keyword}`), campaign from drill-down 1 (Google) or drill-down 2 (Meta).
   Without the UTMs and the tracking cookie a booking cannot be traced to a keyword.
6. Report **weekly**: booked contacts by source. Export the `Care calls — booked` view or use Reports >
   **Contacts by Original source** with the drill-downs above. Cost per booked call = platform spend ÷ this count.

## 8. Checklist before spending a dollar

- [ ] `config.js` has `hubspot.portalId` and `hubspot.meetingsLink` (and pixel / Ads IDs from `docs/ads-launch.md`).
- [ ] Round-robin link: Peggy + Angela, 9 am to 9 pm Eastern seven days, 15-minute calls, phone location.
- [ ] Tammy's role settled with Peggy or Neelam: seat in the round robin, or calendar availability only.
- [ ] Booking form asks First name, Last name, Email, Phone, Date of birth, State, all required; nothing else.
- [ ] Vetted opt-in language, including the phone-owner / permission line, in the booking form's consent text and
      under the widget on every page.
- [ ] Confirmation redirect set to `https://DOMAIN/thanks/?b=hs`; confirmation email plus 24 h and 1 h reminders on.
- [ ] **Day-one verification** (`docs/ads-launch.md` §4) passed in Chrome and Safari: cookies present, iframe `src`
      carries `parentHubspotUtk`, contact shows Paid Search with campaign and term, then Paid Social, test contact deleted.
- [ ] `Care calls — booked` view saved with both drill-down columns and shared with the Care team; Peggy gets
      "meeting booked" notifications.
- [ ] Peggy and Tammy have blocked/unblocked evening availability for the first two weeks.
- [ ] Google Ads and Meta accounts connected under Marketing > Ads.
- [ ] Phone reads 1-800-567-5433 on every page and in the meeting description.
- [ ] Footer links to Privacy, Terms and Consent to Telehealth resolve; HIPAA notice placeholder replaced
      (see `docs/compliance-migration.md`).
