# Conversion principles — Total Life landing pages

Written before design began. Every page decision is checked against this list and against the
Total Life Brand & Marketing System (Edition 01, 2026), which takes precedence on brand and
Medicare-compliance questions.

## What the research says (Sept 2026)

| Finding | Design consequence |
|---|---|
| Median health & wellness landing page converts at ~5.1%; top quartile ~21%. Wellness sub-category median 8.2%. | The gap is craft, not budget. One job per page. |
| Pages written at a 5th–7th grade reading level convert best (10.8% median). | Senior copy at 6th–8th grade, sentences under 20 words, every clinical term translated. |
| Multi-step forms beat single-page forms with the same fields by ~21%; one-field first step converts highest (18.2%). | Coverage check is a 3-step, one-question-per-screen widget. First step is a single tap. |
| 3 fields ≈ 10% conversion; 7+ fields collapses to ~3.6%. | Never more than 3 inputs total: name, phone, one preference. Everything else is earned after the call. |
| Click-to-call converts 10–15× typical web conversion for 65+ and is the #1 above-the-fold element for older audiences. | Phone number in the header of every page, tap-to-call, repeated in hero, sticky on mobile. |
| Ad-to-page claim mirroring (headline, image, CTA) is the strongest single predictor in health verticals. | Each page mirrors one brand-book headline family exactly, so paid creative and page match. |
| Families choosing senior care are "coping, not shopping"; they need proof of trust near the ask, not more information. | Proof (Medicare stamp, carrier bar, real member quote, named therapists) sits within one viewport of every CTA. |
| Older users: 16px minimum body, 18–19px preferred; 4.5:1 contrast; 48px+ tap targets; labels above fields; plain-English errors. | Body 18px, primary CTA 56px tall, labels above inputs, "Let's try that again" errors. |
| No fear or false urgency to Medicare beneficiaries (CMS, AKS). No "free therapy". | Urgency is replaced with certainty: "A real person will call you within one business day." |

## The ten rules every page follows

1. One page, one decision, one primary CTA (coral, fully rounded, single instance per viewport).
2. Hero answers three questions in the first viewport: what is this, is it for me, is it covered.
3. "Covered by Medicare" stamp above the fold on every consumer page.
4. Phone number visible in the header, the hero, the final CTA, and a mobile sticky bar. Always tap-to-call.
5. Multi-step form, one question per screen, progress shown ("Step 1 of 3"), 3 inputs maximum.
6. Proof within one viewport of every ask: stat band with cited source, member quote, carrier bar, named therapists.
7. Objections handled in a plain-language FAQ: cost, "is therapy for me", phone vs video, privacy, what happens next.
8. Reading level 6th–8th grade for senior pages, 8th–10th for caregiver. Headlines under 8 words, one coral word.
9. No dark blocks, no urgency, no discounts, no "free sessions", no stock clinician photos, sources on every number.
10. Every CTA and form carries a stable `data-track` id; one `window.tlTrack` hook for analytics.

## Page angles

| Page | Audience | Mirrors brand-book | Primary CTA | First form step |
|---|---|---|---|---|
| `/senior/` | Senior B2C, 65+ | "Therapy that takes Medicare." / "Hope is closer than you think." | Check my coverage | Which Medicare do you have? |
| `/caregiver/` | Adult daughter/son, 45–65 | "Worried about Mom? We'll call her." founder register | Tell us about your mom | Who are you worried about? |
| `/check/` | Senior B2C retargeting | "It's not just getting older." reframe | Take the 2-minute check | First self-check question |

## Sources

- Unbounce Conversion Benchmark Report, Healthcare & Wellness: https://unbounce.com/conversion-benchmark-report/healthcare-wellness-conversion-rate/
- Landerlab landing page benchmarks 2026: https://landerlab.io/blog/landing-page-conversion-rate
- Web Tonic health & wellness landing page statistics 2026: https://www.webtonic.io/blog/health-wellness-landing-page-statistics
- Foundry CRO healthcare benchmarks: https://foundrycro.com/blog/healthcare-marketing-benchmarks-by-specialty/
- Digital Applied form conversion benchmarks 2026: https://www.digitalapplied.com/blog/form-conversion-rate-benchmarks-2026-data-points
- Venture Harbour form length studies: https://ventureharbour.com/how-form-length-impacts-conversion-rates/
- Invoca click-to-call landing pages: https://www.invoca.com/blog/7-awesome-examples-of-landing-pages-that-drive-click-to-call
- Toptal, interface design for older adults: https://www.toptal.com/designers/ui/ui-design-for-older-adults
- ODPHP Health Literacy Online, 16px minimum: https://odphp.health.gov/healthliteracyonline/design-easy-scanning/use-readable-font-thats-least-16-pixels
- Direction.com senior care landing page practices: https://direction.com/landing-page-best-practices/
- Senior Living Smart, marketing to seniors and adult kids: https://seniorlivingsmart.com/blog/marketing-to-seniors-and-adult-kids/
- Care Marketing trust-signal audit: https://www.caremarketing.com/trust-signal-audit-caregiver-credentials-convert/

## Addendum — what moves older adults specifically (second research pass)

| Finding | Where it lives on the pages |
|---|---|
| Top hesitations older adults report about seeking care: "I won't need it", "it wouldn't help", embarrassment, cost (29% hesitant; logistic barriers and cost cited most). | "I don't need it" → reframe copy ("You don't have to ignore it", "It's not just getting older", "You don't need to be in crisis to talk to someone"). "Wouldn't help" → sourced outcomes stats within one viewport of every ask. Embarrassment → "Talk to someone who gets it", "Is it for someone like me?" FAQ, private-by-default language. Cost → qualified coverage line beside every CTA and first in every FAQ. |
| Older adults are far more likely than younger adults to use telehealth by phone; about half of 65+ telehealth users are phone-only, and comfort with audio-only is high even when video comfort is low. | "By phone if you prefer. No computer needed." is now an explicit reassurance beside the form on senior and check pages, in how-it-works, and in the FAQ. Every CTA has a tap-to-call alternative. |
| Reframing therapy as practical support for grief, retirement, health changes and loneliness, and treating life experience as a strength, outperforms clinical framing. | "What therapy can help with" grid uses everyday language; therapist section states life experience is an asset. |
| Goal-setting increases acceptance of a mental-health referral among older adults. | Success states name the concrete next step and time ("a real person will call you in the morning, within one business day"). |

Sources: AARP PRI, barriers to behavioral health for older adults (https://www.aarp.org/pri/topics/health/coverage-access/mental-health-substance-use-disorder-accessible-affordable-care-older-adults/); Perceptions of mental health and barriers to treatment among U.S. older adults, PMC8938292 (https://pmc.ncbi.nlm.nih.gov/articles/PMC8938292/); Postpandemic telehealth use among older adults 2024, PMC13296669 (https://pmc.ncbi.nlm.nih.gov/articles/PMC13296669/); Older patient preferences and comfort with telemedicine, PMC12554828 (https://pmc.ncbi.nlm.nih.gov/articles/PMC12554828/); NCOA, online therapy guide for older adults (https://www.ncoa.org/article/online-therapy-a-mental-health-guide-for-older-adults/); Commonwealth Fund, older adults' mental health needs and access (https://www.commonwealthfund.org/publications/issue-briefs/2022/jan/comparing-older-adults-mental-health-needs-and-access-treatment).
