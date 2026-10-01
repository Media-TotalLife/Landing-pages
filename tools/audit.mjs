// DOM audit: headings, labels, alt, tap targets, body font size, primary CTA per viewport, placeholders count, banned phrases.
// usage: node tools/audit.mjs            (server on :4173)
//        node tools/audit.mjs --launch   launch gate: exits 1 while a placeholder or an unconfigured calendar is public
import { chromium } from 'playwright';
if (process.argv.includes('--launch')) {
  const browser = await chromium.launch();
  const reasons = [];
  for (const key of ['caregiver', 'depression', 'grief']) {
    const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
    await page.goto(`http://localhost:4173/${key}/`, { waitUntil: 'networkidle' });
    const r = await page.evaluate(() => {
      const card = document.querySelector('.booking-card');
      const legal = document.querySelector('.footer .legal');
      return {
        cardPlaceholder: !!card && /\[[A-Z][A-Z0-9 ·:,'’&\-–]+\]/.test(card.innerText),
        unconfigured: !!document.querySelector('[data-calendar-placeholder].is-unconfigured'),
        noLink: !(window.TL_CONFIG && window.TL_CONFIG.hubspot && window.TL_CONFIG.hubspot.meetingsLink),
        legalPlaceholder: !!legal && /\[HIPAA NOTICE|\[CONSUMER HEALTH/.test(legal.textContent),
      };
    });
    if (r.cardPlaceholder) reasons.push(`${key}: bracketed placeholder text in the booking card`);
    if (r.unconfigured) reasons.push(`${key}: calendar placeholder is-unconfigured (no HubSpot meetings link)`);
    if (r.noLink) reasons.push(`${key}: TL_CONFIG.hubspot.meetingsLink is empty`);
    if (r.legalPlaceholder) reasons.push(`${key}: footer legal block still has [HIPAA NOTICE / [CONSUMER HEALTH placeholder`);
  }
  await browser.close();
  if (reasons.length) { console.log('LAUNCH GATE: FAIL'); reasons.forEach(m => console.log('  ' + m)); process.exit(1); }
  console.log('LAUNCH GATE: PASS'); process.exit(0);
}
const banned = [/567-LIFE/i, /psychiatr/i, /medication/i, /free (coverage )?check/i, /journey|empower|unlock|seamless|holistic|thrive|transform|embrace/i, /free therapy/i, /free session/i, /limited spots/i, /act now/i, /guaranteed/i, /will cure/i, /elderly/i, /no cost(?! .*supplemental)/i, /medicare-approved discount/i, /#fff\b|#ffffff/i];
const browser = await chromium.launch();
for (const key of ['caregiver', 'depression', 'grief', 'thanks']) {
  const page = await (await browser.newContext({ viewport: { width: 375, height: 812 } })).newPage();
  await page.goto(`http://localhost:4173/${key}/`, { waitUntil: 'networkidle' });
  const r = await page.evaluate(() => {
    const out = {};
    out.h1 = [...document.querySelectorAll('h1')].filter(h => h.offsetParent !== null).length;
    const hs = [...document.querySelectorAll('h1,h2,h3,h4')].map(h => +h.tagName[1]);
    out.headingJumps = hs.filter((l, i) => i && l > hs[i - 1] + 1).length;
    out.inputsWithoutLabel = [...document.querySelectorAll('input:not([type=radio]):not([type=hidden])')].filter(i => !document.querySelector(`label[for="${i.id}"]`)).length;
    out.imgsNoAlt = [...document.querySelectorAll('img')].filter(i => !i.hasAttribute('alt')).length;
    const small = [...document.querySelectorAll('p, li, span, a, label, summary, button')].filter(el => el.closest('.sr-only, .stamp, [aria-hidden]') === null && el.textContent.trim().length > 20 && parseFloat(getComputedStyle(el).fontSize) < 15);
    out.textUnder15px = small.length; out.smallSamples = small.slice(0, 3).map(e => e.textContent.trim().slice(0, 40) + ' @' + getComputedStyle(e).fontSize);
    const tappable = [...document.querySelectorAll('a, button, .choice, summary')].filter(el => el.offsetParent !== null);
    out.tapUnder44 = tappable.filter(el => { const b = el.getBoundingClientRect(); return b.height < 44 && b.width > 0; }).map(el => el.textContent.trim().slice(0, 30) + ' ' + Math.round(el.getBoundingClientRect().height) + 'px');
    out.placeholders = (document.body.innerText.match(/\[[A-Z][A-Z0-9 ·:,'’&\-–]+\]/g) || []).length;
    out.trackIds = document.querySelectorAll('[data-track]').length;
    out.telLinks = document.querySelectorAll('a[href^="tel:"]').length;
    out.bodyText = document.body.innerText;
    return out;
  });
  const bodyText = r.bodyText; delete r.bodyText;
  r.bannedPhrases = banned.map(re => (bodyText.match(re) || [])[0]).filter(Boolean);
  console.log(key, JSON.stringify(r, null, 0));
}
await browser.close();
