// Capture interaction states for every page: form error, mid-step, success, FAQ open, sticky bar (mobile).
// usage: node tools/states.mjs   (expects server on :4173)
import { chromium } from 'playwright';
const pages = {
  senior:    { url: '/senior/',    radios: ['medicare_type', 'call_time'], contactStep: 2 },
  caregiver: { url: '/caregiver/', radios: ['relationship', 'medicare'],   contactStep: 2 },
  check:     { url: '/check/',     radios: ['q1', 'q2', 'q3', 'q4'],        contactStep: 5 },
};
const browser = await chromium.launch();
for (const [key, cfg] of Object.entries(pages)) {
  for (const w of [1280, 375]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    const errors = []; page.on('pageerror', e => errors.push(String(e))); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto('http://localhost:4173' + cfg.url, { waitUntil: 'networkidle' });
    const form = page.locator('#coverage-form');
    const card = form.locator('xpath=..');
    const shot = async (name) => { await card.scrollIntoViewIfNeeded(); await page.screenshot({ path: `screens/state-${key}-${name}-${w}.png`, clip: await card.boundingBox() }); };
    // 1. empty submit error
    await form.locator('.tl-step.is-active [data-next]').click();
    await shot('error');
    // 2. walk radios in order, contact step in between
    const steps = form.locator('.tl-step:not(.tl-step--success)');
    const n = await steps.count();
    let r = 0;
    for (let i = 1; i <= n; i++) {
      const active = form.locator('.tl-step.is-active');
      const hasRadio = await active.locator('input[type=radio]').count();
      if (hasRadio) { await active.locator('input[type=radio]').first().check({ force: true }); r++; }
      else {
        await active.locator('[data-next]').click(); // trigger field errors
        await shot('field-error');
        await active.locator('#first_name').fill('Margaret');
        await active.locator('#phone').fill('5551234567');
      }
      if (i === 2) await shot('step2');
      await active.locator('[data-next]').click();
    }
    const ok = await form.locator('.tl-step--success.is-active').isVisible();
    await shot('success');
    // FAQ open
    const faq = page.locator('.faq details').first();
    await faq.locator('summary').click();
    await faq.scrollIntoViewIfNeeded();
    await page.screenshot({ path: `screens/state-${key}-faq-${w}.png`, clip: await page.locator('.faq').boundingBox() });
    // sticky bar (mobile): scroll to middle
    if (w === 375) { await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.35)); await page.waitForTimeout(400); await page.screenshot({ path: `screens/state-${key}-sticky-375.png` }); }
    console.log(`${key} @${w}: success=${ok} successText="${(await form.locator('.tl-step--success h3').textContent()).trim()}" errors=${errors.length}${errors.length ? ' ' + errors.join(' | ') : ''}`);
    await ctx.close();
  }
}
await browser.close();
