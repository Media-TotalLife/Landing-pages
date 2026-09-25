// Click through the /check/ self-check form and screenshot key states.
// usage: node tools/formwalk.mjs [width]   (expects server on :4173)
import { chromium } from 'playwright';
const w = Number(process.argv[2] || 1280);
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
const page = await ctx.newPage();
const errors = []; page.on('pageerror', e => errors.push(String(e))); page.on('console', m => { if (m.type()==='error') errors.push(m.text()); });
await page.goto('http://localhost:4173/check/', { waitUntil: 'networkidle' });
const form = page.locator('#coverage-form');
const progress = () => form.locator('.progress span').textContent();
const activeQ = () => form.locator('.tl-step.is-active .q').first().textContent();
console.log('start:', await progress(), '|', (await activeQ()).slice(0, 40));
// try to continue without answering -> error should show
await form.locator('.tl-step.is-active [data-next]').click();
console.log('empty submit error visible:', await form.locator('.tl-step.is-active.has-error > .error').isVisible(), JSON.stringify(await form.locator('.tl-step.is-active > .error span').textContent()));
for (let i = 1; i <= 4; i++) {
  await form.locator(`input[name=q${i}][value=some_days]`).check({ force: true });
  await form.locator('.tl-step.is-active [data-next]').click();
  console.log(`after q${i}:`, await progress(), '|', (await activeQ()).slice(0, 40));
}
// Back then forward
await form.locator('.tl-step.is-active [data-back]').click(); console.log('back:', await progress());
await form.locator('.tl-step.is-active [data-next]').click(); console.log('fwd:', await progress());
await form.scrollIntoViewIfNeeded();
await page.screenshot({ path: `screens/check-form-step5-${w}.png`, clip: await form.locator('xpath=..').boundingBox() });
await form.locator('.tl-step.is-active [data-next]').click();
console.log('empty contact errors:', await form.locator('.field.has-error').count());
await page.fill('#first_name', 'Margaret');
await page.fill('#phone', '5551234567');
console.log('phone formatted:', await page.inputValue('#phone'));
await form.locator('.tl-step.is-active [data-next]').click();
const ok = await form.locator('.tl-step--success.is-active').isVisible();
console.log('success visible:', ok, '| h3:', await form.locator('.tl-step--success h3').textContent(), '| progress hidden:', await form.locator('.progress').isHidden());
await page.screenshot({ path: `screens/check-form-success-${w}.png`, clip: await form.locator('xpath=..').boundingBox() });
console.log('errors:', errors.length ? errors : 'none');
await browser.close();
