// Verify real-motion behaviour: reveals fire while scrolling, stat count-up lands on the right numbers, no console errors.
import { chromium } from 'playwright';
const browser = await chromium.launch();
for (const key of ['senior', 'caregiver', 'check']) {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'no-preference' })).newPage();
  const errors = []; page.on('pageerror', e => errors.push(String(e)));
  await page.goto(`http://localhost:4173/${key}/`, { waitUntil: 'networkidle' });
  const expected = await page.$$eval('.stat b', els => els.map(e => e.firstChild.nodeValue.trim()));
  for (let y = 0; y < await page.evaluate(() => document.body.scrollHeight); y += 500) { await page.evaluate(v => window.scrollTo(0, v), y); await page.waitForTimeout(120); }
  await page.waitForTimeout(1400);
  const revealed = await page.evaluate(() => [document.querySelectorAll('[data-reveal]').length, document.querySelectorAll('[data-reveal].is-in').length]);
  const final = await page.$$eval('.stat b', els => els.map(e => e.firstChild.nodeValue.trim()));
  console.log(key, 'reveal', revealed.join('/'), 'stats', JSON.stringify(final), 'errors', errors.length);
}
await browser.close();
