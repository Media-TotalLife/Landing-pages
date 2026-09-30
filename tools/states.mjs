// Walk every book-a-call form: empty error, field errors, each step, submit -> /thanks/. Screens into screens/.
// usage: node tools/states.mjs   (expects server on :4173)
import { chromium } from 'playwright';
const pages = {
  senior:    { url: '/senior/',    radios: [] },
  caregiver: { url: '/caregiver/', radios: [] },
  check:     { url: '/check/',     radios: ['q1', 'q2', 'q3', 'q4'] },
};
const browser = await chromium.launch();
let failures = 0;
for (const [key, cfg] of Object.entries(pages)) {
  for (const w of [1280, 375]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    const errors = []; page.on('pageerror', e => errors.push(String(e))); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto('http://localhost:4173' + cfg.url, { waitUntil: 'networkidle' });
    const form = page.locator('#coverage-form');
    const card = form.locator('xpath=..');
    const shot = async (name) => { await card.scrollIntoViewIfNeeded(); await page.screenshot({ path: `screens/state-${key}-${name}-${w}.png`, clip: await card.boundingBox() }); };
    const next = () => form.locator('.tl-step.is-active [data-next]').click();
    // 1. empty submit error on the first step
    await next(); await shot('error');
    for (const r of cfg.radios) { await form.locator(`input[name=${r}]`).first().check({ force: true }); await next(); }
    // name step
    await next(); const nameErr = await form.locator('.tl-step.is-active .field.has-error').count();
    await form.locator('#first_name').fill('Margaret'); await form.locator('#last_name').fill('Hale'); await shot('name'); await next();
    // contact step: bad phone + bad email first
    await form.locator('#phone').fill('555'); await form.locator('#email').fill('margaret@'); await next();
    const contactErr = await form.locator('.tl-step.is-active .field.has-error').count(); await shot('field-error');
    await form.locator('#phone').fill('5551234567'); await form.locator('#email').fill('margaret.hale@example.com'); await next();
    // about step: bad dob first
    await form.locator('#dob').fill('13/45/1950'); await form.locator('#zip').fill('123'); await next();
    const aboutErr = await form.locator('.tl-step.is-active .field.has-error').count();
    await form.locator('#dob').fill(''); await form.locator('#dob').pressSequentially('03141954'); await form.locator('#zip').fill('10001'); await shot('about');
    const dobShown = await form.locator('#dob').inputValue();
    const progress = await form.locator('.progress span').textContent();
    await Promise.all([page.waitForURL(/\/thanks\/\?p=/, { timeout: 8000 }), next()]);
    await page.waitForLoadState('networkidle');
    const greeting = await page.locator('h1').textContent();
    const attr = await page.evaluate(() => JSON.parse(sessionStorage.getItem('tl_lead') || '{}'));
    await page.screenshot({ path: `screens/state-${key}-thanks-${w}.png`, fullPage: true });
    const ok = nameErr === 2 && contactErr === 2 && aboutErr === 2 && /03 \/ 14 \/ 1954/.test(dobShown) && /Margaret/.test(greeting) && attr.email === 'margaret.hale@example.com' && errors.length === 0;
    if (!ok) failures++;
    console.log(`${key} @${w}: ${ok ? 'OK' : 'FAIL'} nameErr=${nameErr} contactErr=${contactErr} aboutErr=${aboutErr} dob="${dobShown}" last="${progress.trim()}" greeting="${greeting.trim()}" errors=${errors.length}${errors.length ? ' ' + errors.join(' | ') : ''}`);
    await ctx.close();
  }
}
// hero variants on the senior page
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
for (const v of ['', 'caregiver-stress', 'caregiver-support', 'nonsense']) {
  await page.goto('http://localhost:4173/senior/' + (v ? `?v=${v}&utm_source=test&utm_campaign=c1&gclid=abc` : ''), { waitUntil: 'networkidle' });
  const h1s = await page.locator('h1:visible').allTextContents();
  const attr = await page.evaluate(() => window.tlAttribution());
  console.log(`variant "${v}": visible h1 = ${JSON.stringify(h1s)} attribution=${JSON.stringify(attr)}`);
  if (h1s.length !== 1) failures++;
}
await browser.close();
console.log(failures ? `FAILURES: ${failures}` : 'ALL OK');
process.exit(failures ? 1 : 0);
