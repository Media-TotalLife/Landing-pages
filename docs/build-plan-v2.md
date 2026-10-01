# Build plan v2 — book-a-call funnel, four themed pages

Source of truth: the Neelam / Daschel call notes (30 Sept 2026) plus the Total Life Brand & Marketing System.
Where they conflict, the call wins. This plan is what the build and review agents are held to.

## 1. The deliverable, in one line each

- Four landing pages, one theme each: **senior (general)**, **caregiver support**, **depression**, **grief and loss**.
- Every page has exactly one event: **book a call**. The HubSpot booking widget (round robin, Peggy + Angela,
  9 am to 9 pm Eastern) is embedded on the page. No other form, no survey, no lead-capture step before it.
- Fields live inside the HubSpot booking form: first name, last name, email (HubSpot requires it and sends the
  confirmation to it), phone, date of birth, state. Nothing else.
- Confirmation page `/thanks/` after booking. Pixels (Meta Lead + Schedule, Google Ads conversion) fire there.
- Phone shown as **1-800-567-5433** everywhere. Never "LIFE".
- Vetted opt-in language sits directly under the widget, marked `[VETTED OPT-IN LANGUAGE]` until Total Life's
  existing text is pasted in.
- Compliance footer identical on every page: Privacy, Terms, Consent to Telehealth, HIPAA notice (URL pending),
  "Total Life Inc.", enrolled Medicare provider line, 988.

## 2. Page anatomy (same order on every page, top to bottom)

Research basis: one action per page, CTA above the fold and repeated, trust signals near the action, short pages
for older adults, 18px+ body, 56px targets, high contrast, no carousels or motion that competes with the action.

1. **Header**: logo, phone (digits), nothing else on mobile. Desktop nav: How it works · Questions.
2. **Hero** (headline left, booking card right; on phones headline, then card, then lede and note), followed by a
   full-width 16:9 scene photograph. **Theme block** carries a 4:5 portrait beside its cards.
   Original hero note: eyebrow (audience + Medicare), headline (theme, one coral word, Meta-compliant), one lede (2 sentences
   max), primary CTA "Book a call" scrolling to the widget, Covered by Medicare stamp, reassurance line with phone,
   portrait frame (real member imagery, or placeholder).
3. **Booking card in the hero** (`#book`, target of every CTA): the hero's right column is the HubSpot widget with
   the opt-in and privacy lines under it; the left column carries eyebrow, headline, lede, CTA, stamp, phone and
   one note (Medicare and insurance, hours, no obligation). On mobile the card follows the note, about one screen
   down. No separate booking section.
4. **How it works**: four steps, one line each. Book · We call · We check coverage · Matched with a therapist.
5. **Theme block**: one short section specific to the theme (what therapy helps with, in statements). Max six
   cards, one sentence each.
6. **Proof**: a 1:1 detail photograph beside the stat band (200+ licensed providers · 49 states · 92% stay with
   their assigned therapist, with the source line). No testimonials of any kind, no therapist strip, no carrier
   logos: Total Life has not supplied them and fabricated proof is disqualifying.
7. **FAQ**: five questions max, theme-specific where it matters (coverage, phone-only, privacy, what happens next).
8. **Final CTA**: headline, "Book a call", phone.
9. **Footer**: compliance block.
10. **Sticky mobile bar**: "Book a call" + phone icon, hidden while the booking card is on screen.

Cut from the current pages: the multi-step form, the self-check survey and its "not a test" copy, the caregiver
"signs" grid, the founder card on the caregiver page (see 4), any psychiatry or medication mention, the "what
therapy can help with" grid on pages where the theme block replaces it.

## 3. Copy rules (all agents)

- **Meta Personal Attributes**: never assert or imply the reader's age, health, mood, family situation or
  struggle. Describe the service and the audience ("Therapy for adults 65+"), never the reader ("Feeling low?").
  No rhetorical questions in headlines. "You" only for actions (book, call, choose).
- **Medicare / CMS / TCPA (brand book Part V)**: approved lines only. "Covered by Medicare." "Most members are
  covered up to 100% with Medicare + supplemental insurance." "Total Life is an enrolled Medicare provider."
  Never "free therapy", "no cost", "Medicare-approved", urgency, guarantees, cure language, official-looking
  Medicare marks. Inbound only, with documented consent.
- **No fabrication**: no invented testimonials, names, review counts, ratings, badges, "as seen in", awards,
  or quotes. Founder quotes must be verbatim from the brand book or absent. The only numbers are the brand book's
  200+ / 49 states, 92%, 3 sessions, 68%, 3×, each with "Internal outcomes data · Q3 2024 · N=2,847".
- **No AI slop**: no "journey", "empower", "unlock", "seamless", "holistic", "thrive", "transform", "embrace",
  no triads of adjectives, no em-dash cadence in headlines, no "it's not X, it's Y" constructions, no
  exclamation marks. Plain sentences an 80-year-old reads once.
- **Minimal**: if a sentence does not help someone decide to book, delete it. Target under 350 words of body
  copy per page excluding FAQ answers and footer.
- **Depression and grief pages are specific**: name the theme in the eyebrow, headline, theme block and two FAQ
  answers. Depression page speaks about low mood, loss of interest, sleep, worry, in general statements. Grief page
  speaks about losing a spouse, a friend, a sibling, a pet, about the first year, anniversaries, and about grief
  counselling as a covered service. Neither page diagnoses or promises outcomes.

## 4. Founder content

The brand-book founder quotes contain "If you're worried about yours" and "I get what you're carrying", which
fail the Meta rule. Use only the first sentence verbatim, with attribution, where a founder line appears:
"I built Total Life because I couldn't find behavioral health support for my own mom inside Medicare." — Neelam
Brar, Founder & CEO. The founder portrait stays a placeholder until a real photograph is supplied.

## 5. Technical contract

- Booking card markup on every page:
  ```html
  <div class="booking-card" id="book" data-booking>
    <div class="cal-head"><b>Pick a time for your call</b><span>Times shown in your time zone</span></div>
    <div class="meetings-iframe-container" data-meetings></div>
    <div class="calendar-placeholder" data-calendar-placeholder>…</div>
    <p class="optin">[VETTED OPT-IN LANGUAGE]</p>
  </div>
  ```
  `tl.js` fills `[data-meetings]` from `TL_CONFIG.hubspot.meetingsLink` (`?embed=true`), removes the placeholder,
  listens for HubSpot's `meetingBookSucceeded` message, fires `tlConvert('booked')` and redirects to `/thanks/`.
- All CTAs: `href="#book"`, `data-track` id, text "Book a call".
- `config.js`: `hubspot.portalId` (tracking code), `hubspot.meetingsLink`, `meta.pixelId`, `google.*`.
- Attribution: `track.js` stores utm_*, gclid, fbclid, `v` in sessionStorage; the HubSpot tracking cookie ties the
  booking to the visit source. Meetings links have no hidden fields; Jason's tagging covers keyword mapping.
- Pages: `/senior/`, `/caregiver/`, `/depression/`, `/grief/`, `/thanks/`, `/privacy/`. `/check/` is removed.
- Tools must pass: `node tools/states.mjs` (booking card present, placeholder shown when unconfigured, every CTA
  targets `#book`, phone digits, no "LIFE", variants), `node tools/audit.mjs`, `node tools/screens.mjs all`
  (0 overflow, 0 console errors at 1920/834/375).

## 6. Review gates (adversarial agents, each reports blockers and fixes)

1. **Compliance**: Meta personal attributes and health policy; brand book Part V; TCPA opt-in placement; no
   fabricated claims; HIPAA language; footer parity across pages; psychiatry removed.
2. **Mobile and conversion**: 375 px walk of every page; CTA above fold; booking card within one scroll; tap
   targets ≥ 44 px; text ≥ 18 px body; sticky bar behaviour; no layout shift from the embed; contrast.
3. **Copy and slop**: fabricated content hunt; slop-word list; word counts; theme specificity on depression and
   grief; plain-language pass at grade 6 to 8.
4. **Accessibility and code**: headings order, labels, focus order into the iframe, reduced motion, skip link,
   HTML validity, console errors, unused CSS/JS left from the form engine.

Every finding is fixed before the pages are republished. Findings that need Total Life input (opt-in text, HIPAA
URL, founder photo, therapist names) stay as bracketed placeholders and are listed in the final report.
