# Who each page targets, and where that comes from

Decided from the 30 Sept 2026 Neelam / Daschel call notes, cross-checked against totallife.com and the brand book.
Every agent building or reviewing a page holds it to this.

## The audience is the member: adults 65+ on Medicare

Evidence
- Call notes, redefined deliverable: the booking form asks for **first name, last name, date of birth, phone, state**.
  Date of birth and state are the patient's (Medicare eligibility and therapist licensing). The person booking is
  the person who will be treated.
- totallife.com/therapy: "therapists specialize in the mental health needs of adults 65 and older, including
  depression, anxiety, grief, caregiver stress, and life transitions."
- Brand book: "Senior B2C" is the primary register; the daughter-to-daughter "Caregiver B2C" funnel is a
  seasonal campaign (Mother's Day, Father's Day), not this test.
- Your instruction: position every page for seniors.

Family involvement is real but secondary: totallife.com says family members can make the first call "together or
for their loved one with their blessing," and the call notes require vetted opt-ins. So every page may say a family
member is welcome to book with the member and join the call. No page is written to the adult child as the
customer.

## The three themes are Total Life's own specialty list

The call notes name **depression, grief and loss, and caregiver support** as the ad-set themes. Those are three of
the five specialties on totallife.com/therapy. Each theme page speaks about that specialty in general statements
(Meta Personal Attributes rule) and books the same call.

| Page | Theme | Target | Live totallife.com analogue | Ad targeting |
|---|---|---|---|---|
| `/senior/` | Therapy covered by Medicare (general) | Adults 65+ | totallife.com/therapy | Google head terms ("therapy covered by medicare", "therapist for seniors"); Meta 65+ |
| `/caregiver/` | **Caregiver stress** | Adults 65+ caring for a spouse, parent or other loved one, including dementia caregivers | totallife.com/caregiver-stress ("Caring for someone you love is a full-time job. So is taking care of yourself.") | Google "caregiver stress", "caregiver burnout support", "therapy for caregivers"; Meta 55 to 65+ |
| `/depression/` | Depression | Adults 65+ | totallife.com/therapy (depression) | Google "depression therapy medicare", "therapy for depression seniors"; Meta 65+ |
| `/grief/` | Grief and loss | Adults 65+ | totallife.com/therapy (grief) | Google "grief counseling medicare", "grief counseling for seniors"; Meta 65+ |

`/senior/?v=caregiver-stress` and `?v=caregiver-support` remain as message-match variants for Google ad groups; the
caregiver page is the primary landing for that theme.

## What "caregiver support" is not, in this test

Not the "Worried about Mom? We'll call her." funnel. That page targets adult daughters 45 to 65 as the customer and
would need the parent's date of birth and state on the booking form, which the redefined deliverable does not
collect. It stays a brand-book campaign for later. If Neelam wants it in this test, it is a fifth page with its own
booking form fields, not a rewrite of `/caregiver/`.

## Requirements from the call notes, traced to the build

| Requirement (call notes) | Where it lives | Status |
|---|---|---|
| Landing page on HubSpot with embedded booking | Pages are static HTML with the HubSpot meetings widget embedded in the hero; can be hosted on any domain or pasted into a HubSpot landing page as a custom module | Built; hosting decision pending domain access |
| Fields: first name, last name, date of birth, phone, state (email required by HubSpot) | HubSpot booking form questions, `docs/hubspot-setup.md` §3 | Documented; configure in HubSpot |
| Vetted opt-in language | `[VETTED OPT-IN LANGUAGE]` under every widget, and in the HubSpot consent text | Placeholder until Total Life supplies the text |
| Bookings into Peggy's and Angela's calendars, 9 am to 9 pm Eastern, manual daily assignment | Round-robin link, `docs/hubspot-setup.md` §1, §2, §5 | Documented |
| Evening shifts on Peggy's and Tammy's calendars | `docs/hubspot-setup.md` §1 | Documented |
| Confirmation page where pixels fire | `/thanks/`; `tools/tracking-test.mjs` proves Lead + Schedule and both Google conversions fire once | Built and tested |
| Ads match landing page themes: depression, grief and loss, caregiver support | Four pages, `docs/ads-launch.md` | Built |
| Independent Google and Meta campaigns per theme, $50 and $30 a day | `docs/ads-launch.md` | Documented |
| No psychiatry (or GLP-1) keywords or ads | Pages carry no psychiatry mention; negatives in `docs/ads-launch.md` | Done |
| Booking data mapped to keywords and campaign source (Jason) | UTMs + gclid on every ad URL, HubSpot tracking code on every page, sessionStorage attribution; `docs/hubspot-setup.md` §7 | Built; Jason's tagging on HubSpot side |
| Internal HubSpot booking data as the source of truth | `Care calls — booked` view, `docs/hubspot-setup.md` §4 | Documented |
| Compliance language carried from the existing site | Footer links to Privacy, Terms, Consent to Telehealth; `/privacy/` page; HIPAA notice URL pending; `docs/compliance-migration.md` | Partial: policy text and HIPAA URL need the scrape run from a machine that can reach totallife.com |
| Phone as digits | 1-800-567-5433 everywhere | Done |
| Domain access | Needed to host and to verify the Meta domain | Pending, Daschel to request |
