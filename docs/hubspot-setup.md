# HubSpot setup — book-a-call funnel

What this covers: the access you need, the round-robin calendar for Peggy and Angela, the form the landing
pages post to, where the leads land, and how the Google and Meta campaigns show up as
a channel in HubSpot. Work top to bottom. Every ID you collect goes into `assets/js/config.js`.

## 0. Access you need (verify this first)

| Task | Minimum HubSpot role / tier |
|---|---|
| Create the form, copy Portal ID + Form GUID, install tracking code | **Marketing tools access** (Forms) + **Settings > Tracking code**. Free CRM is enough. |
| Create a **round-robin** meetings link across Peggy + Angela | **Sales Hub Starter** (or Service Hub Starter) paid seats for **both** Peggy and Angela. Round robin is not in the free tier; free gives one personal link per user. |
| Assign Peggy as owner automatically, create a "call now" task, send a mobile push | **Workflows**, which need **Starter** (simple form-triggered automation) or **Professional** (full workflows). Free allows one follow-up action per form. |
| Campaigns tool (group ads + landing pages + form under one campaign) | **Marketing Hub Professional**. Not required: UTMs and "Original source" work on Free. |
| Connect Google Ads and Meta ad accounts to HubSpot (Ads tool) | **Free** for read-only ad tracking. |
| Do any of the above | You must be a **user in the portal** with the relevant permission set. To do all of it in one sitting, ask for **Super Admin**. |

Quick check of what you have: Settings (gear) > Account Management > **Account & Billing** shows the subscription
per Hub. Settings > **Users & Teams** > your name shows your permission set. If "Sales Hub Starter" is absent,
the round-robin step will not appear and you need either the upgrade (two seats) or the fallback in 2b.

## 1. Users and hours

1. Settings > Users & Teams. Confirm **Peggy** and **Angela** exist as users. If not, **Create user**, give each a
   Sales Hub Starter seat and the "Sales" permission set (Meetings, Calling, Tasks).
2. Each of them must **connect their calendar**: Settings > General > **Calendar** > Connect (Google or Outlook).
   Round robin only offers times that are free on the connected calendar.
3. Each sets **working hours**: Settings > General > Calendar > **Availability**, or on the meetings link itself
   (step 2). Care line hours are **9:00 am to 9:00 pm Eastern, seven days a week**. Set the time zone to
   America/New_York explicitly so DST does not shift the window.
4. Create a team: Settings > Users & Teams > **Teams** > "Care team" with Peggy and Angela. Used for views and
   routing.

## 2. The calendar (round robin: Peggy + Angela)

### 2a. Round-robin link (Sales Hub Starter or above)

1. Sales > **Meetings** > **Create scheduling page** > **Round robin**.
2. **Team members:** Peggy, Angela. Turn **on** "Prioritise contact owner" so a lead who already has Peggy as
   owner books with Peggy again. Everyone else alternates by availability.
3. **Overview**
   - Internal name: `Care call — round robin`
   - Title shown to visitors: `Your call with the Total Life care team`
   - Location: **Phone**. Description: `A real person from our care team will call you at the number you gave us.`
   - Duration: **15 minutes** (offer 15 only; more options create hesitation).
   - Link slug: `care-call` (full link becomes `https://meetings.hubspot.com/<account>/care-call`).
4. **Scheduling**
   - Availability window: **Mon to Sun, 9:00 am to 9:00 pm, America/New_York**.
   - Minimum notice: **15 minutes**. Rolling window: **2 weeks**. Buffer: **5 min**. Start time increments: **15 min**.
   - Booking limit per day: leave unlimited for the test spend.
5. **Form** (this is the mini-form inside the calendar, after the visitor picks a time)
   - Keep only **First name, Last name, Email**. Add **Phone number** as required. Do **not** add Date of birth or
     ZIP here: the landing page already collected them and pre-fills name and email into this form.
   - Turn on **Privacy and consent** if legal wants an extra checkbox. The landing page already shows a consent
     line, so the default is off.
6. **Confirmation**: **Display confirmation in the scheduler** (do not redirect; the landing site listens for the
   booking event and shows its own "You're booked" state). Confirmation email: on, from the assigned team member.
   Reminder emails: **24 h and 1 h** before.
7. **Save**. Copy the link. Paste into `assets/js/config.js` as `hubspot.meetingsLink`.

The site embeds the link with `?embed=true&firstname=…&lastname=…&email=…`, so the visitor only picks a time.

### 2b. Fallback if you only have Free

Free gives one **personal** link per user, no round robin. Use Peggy's personal link
(Sales > Meetings > Peggy's default link, same settings as above) as `hubspot.meetingsLink`, and have Angela cover
overflow by phone from the lead view in section 4. Switch to round robin once the Starter seats are in place.

## 3. The form the landing pages post to

The pages do not use HubSpot's embedded form. They post to the **Forms API** so the design stays ours and the
step-by-step flow works for older visitors. HubSpot still needs a form definition to receive the fields.

1. Marketing > **Forms** > Create form > **Regular form** > blank template. Name: `Book a care call (landing pages)`.
2. Add these fields, using the **default** contact properties so nothing needs creating:
   `First name` (firstname), `Last name` (lastname), `Email` (email), `Phone number` (phone),
   `Date of birth` (date_of_birth), `Postal code` (zip).
3. Add these **hidden** fields for attribution. Create each as a **single-line text contact property** in
   Settings > Properties (group: "Contact information" or a new "Attribution" group), then add to the form as hidden:
   `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid`, `fbclid`, `landing_page`,
   `landing_variant`.
   If you skip this step the site still works: on a 400 error it retries with the six core fields only.
4. Options: **Set contacts created as marketing contacts** = off (they are leads for a call, saves marketing-contact
   quota). Lifecycle stage: **Lead**. Do not set a redirect or thank-you message (the API ignores it).
5. Publish. Then **Share** > **Embed code**. Inside it you will find `portalId: "XXXXXXX"` and
   `formId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"`. Put them into `assets/js/config.js` as `hubspot.portalId`
   and `hubspot.formGuid`.
6. Settings > **Tracking & Analytics > Tracking code**. Confirm the Hub ID matches `portalId`. The site loads
   `js.hs-scripts.com/<portalId>.js` automatically once `portalId` is set, so the submission carries the
   `hubspotutk` cookie and HubSpot attributes the contact to the ad click (Original source = Paid Search /
   Paid Social).

Test: open a landing page on the live domain with `?utm_source=test&utm_campaign=smoke`, submit the form, and
confirm a contact appears within a minute with the attribution fields filled. Then book a time in the calendar
and confirm the meeting appears on the contact's timeline and in Peggy's or Angela's calendar.

## 4. Where the leads sit and how to see them

A submission creates (or updates) a **Contact**. There is no Deal or Ticket unless you add one. Three places to look:

- **Contacts > Contacts**, filter **Create date = today** and **Original source = Paid Search or Paid Social**.
- The **form's Submissions tab**: Marketing > Forms > `Book a care call (landing pages)` > Submissions.
- **Sales > Meetings > Scheduled**: everything booked through the calendar, per team member.

Make two saved views (Contacts > **Advanced filters** > Save view, share with team "Care team"):

1. **`Care calls — booked`**: `Recent conversion` contains `Book a care call` AND has an upcoming meeting
   (property `Next activity date` is known). These will be called at the booked time.
2. **`Care calls — not booked yet`**: `Recent conversion` contains `Book a care call` AND `Number of meetings` = 0
   (or `Next activity date` unknown). **This is the call-now list.** Sort by
   Create date, newest first.


## 5. Notifications

On the form, Options > **Send submission notifications to** Peggy and Angela. Routing, call scripts and lead
statuses are out of scope for now.

## 6. The ads as a channel inside HubSpot

1. Marketing > **Ads** > Connect accounts > **Google Ads** and **Facebook Ads**. Turn on **auto-tracking** so
   HubSpot appends its own tracking to the ad URLs and reports contacts per campaign.
2. Keep the UTMs from `docs/ads-launch.md` on every final URL anyway. HubSpot maps `utm_medium=cpc` to
   **Paid Search** and `utm_medium=paid_social` to **Paid Social**, and the campaign name to
   `Original source drill-down 2`. This works on every tier and is what the saved views filter on.
3. If you have Marketing Hub Professional: Marketing > **Campaigns** > Create `Caregiver test — Sept 2026`, add the
   form, the two ad campaigns and the landing page URLs. Otherwise the Ads tool plus the views above are the channel.
4. Report to watch weekly: Reports > **Contacts by Original source** and Ads > **Contacts** per campaign, with
   cost per contact from the Ads tool.

## 7. Checklist before spending a dollar

- [ ] `config.js` has portalId, formGuid, meetingsLink (and pixel / Ads IDs from `docs/ads-launch.md`).
- [ ] Test submission appears as a contact with utm fields and Original source.
- [ ] Test booking lands on Peggy's or Angela's calendar and the confirmation email arrives.
- [ ] Working hours on both calendars set to 9 am to 9 pm Eastern, seven days.
- [ ] Form notifications go to both Peggy and Angela.
- [ ] Privacy, Terms, Consent and HIPAA links in the footer point at the live totallife.com pages (see `docs/compliance-migration.md`).
