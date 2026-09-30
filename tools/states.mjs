// Booking-funnel checks for every page. Exits 1 on any failure. usage: node tools/states.mjs (server on :4173)
import { chromium } from 'playwright';
const pages = { senior: '/senior/', caregiver: '/caregiver/', depression: '/depression/', grief: '/grief/' };
const browser = await chromium.launch();
let failures = 0;
const fail = (m) => { failures++; console.log('  FAIL ' + m); };
for (const [key, url] of Object.entries(pages)) {
  for (const w of [1280, 375]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w === 375 ? 812 : 900 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    const errors = []; page.on('pageerror', e => errors.push(String(e))); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    const res = await page.goto('http://localhost:4173' + url, { waitUntil: 'networkidle' });
    console.log(`${key} @${w}`);
    if (!res || res.status() !== 200) { fail('status ' + (res && res.status())); await ctx.close(); continue; }
    const r = await page.evaluate(() => {
      const card = document.querySelector('[data-booking]#book');
      const ctas = [...document.querySelectorAll('a.btn--primary')];
      const heroCta = document.querySelector('[data-hero-cta]');
      const text = document.body.innerText;
      return {
        card: !!card,
        placeholder: !!(card && card.querySelector('[data-calendar-placeholder]')),
        meetingsSlotRemoved: !card || !card.querySelector('[data-meetings]'),
        optin: !!(card && card.querySelector('.optin')),
        ctas: ctas.length,
        ctasToBook: ctas.filter(a => a.getAttribute('href') === '#book').length,
        ctaText: [...new Set(ctas.map(a => a.textContent.trim()))],
        heroCtaTop: heroCta ? heroCta.getBoundingClientRect().bottom : null,
        cardTop: card ? card.getBoundingClientRect().top + window.scrollY : null,
        vanity: /567-LIFE/.test(text),
        digits: (text.match(/1-800-567-5433/g) || []).length,
        forms: document.querySelectorAll('form').length,
        psych: /psychiatr|medication/i.test(text),
        h1: [...document.querySelectorAll('h1')].filter(h => h.offsetParent !== null).length,
        words: (document.querySelector('main') || document.body).innerText.split(/\s+/).length,
      };
    });
    if (!r.card) fail('no booking card #book[data-booking]');
    if (!r.placeholder) fail('calendar placeholder missing while unconfigured');
    if (!r.meetingsSlotRemoved) fail('[data-meetings] should be removed when unconfigured');
    if (!r.optin) fail('opt-in line missing in booking card');
    if (r.ctas !== r.ctasToBook) fail(`${r.ctas - r.ctasToBook} primary CTAs do not point to #book`);
    if (r.ctaText.some(t => t !== 'Book my call')) fail('CTA text not "Book my call": ' + JSON.stringify(r.ctaText));
    if (r.heroCtaTop === null || r.heroCtaTop > (w === 375 ? 812 : 900)) fail('hero CTA not above the fold (' + r.heroCtaTop + ')');
    if (w === 375 && r.cardTop > 812 * 2.2) fail('booking card further than ~2 screens down on mobile (' + Math.round(r.cardTop) + 'px)');
    if (r.vanity) fail('567-LIFE still present');
    if (r.digits < 3) fail('phone digits appear only ' + r.digits + ' times');
    if (r.forms) fail(r.forms + ' <form> elements remain');
    if (r.psych) fail('psychiatry/medication mention');
    if (r.h1 !== 1) fail('visible h1 count ' + r.h1);
    if (errors.length) fail('console errors: ' + errors.join(' | '));
    console.log(`  ok: ctas=${r.ctas} cardTop=${Math.round(r.cardTop)} words=${r.words}`);
    // sticky bar hidden while card on screen (mobile)
    if (w === 375) {
      await page.evaluate(() => document.getElementById('book').scrollIntoView());
      await page.waitForTimeout(300);
      const stickyVisible = await page.evaluate(() => { const s = document.querySelector('.sticky-cta'); return !!s && s.classList.contains('is-visible'); });
      if (stickyVisible) fail('sticky CTA visible while booking card on screen');
    }
    await ctx.close();
  }
}
// variants
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
for (const v of ['', 'caregiver-stress', 'caregiver-support', 'nonsense']) {
  await page.goto('http://localhost:4173/senior/' + (v ? `?v=${v}&utm_source=t&gclid=x` : ''), { waitUntil: 'networkidle' });
  const h1s = await page.locator('h1:visible').allTextContents();
  console.log(`variant "${v}": ${JSON.stringify(h1s)}`);
  if (h1s.length !== 1) fail('variant h1 count ' + h1s.length);
}
// thanks page
await page.goto('http://localhost:4173/thanks/?p=senior', { waitUntil: 'networkidle' });
const conv = await page.evaluate(() => window.dataLayer.filter(e => e.event === 'tl_conversion').map(e => e.kind));
console.log('thanks conversions:', JSON.stringify(conv));
if (!(conv.includes('lead') && conv.includes('booked'))) fail('thanks page did not fire lead+booked');
await browser.close();
console.log(failures ? `FAILURES: ${failures}` : 'ALL OK');
process.exit(failures ? 1 : 0);
