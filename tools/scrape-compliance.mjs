// Pull Total Life's policy pages and home-page footer into docs/compliance/ for the migration checklist.
// usage: node tools/scrape-compliance.mjs        (run from a machine that can reach totallife.com)
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
const pages = {
  'privacy': 'https://totallife.com/privacy/',
  'terms-and-conditions': 'https://totallife.com/termsandconditions/',
  'consent-to-telehealth': 'https://totallife.com/consent-to-telehealth-and-therapy/',
  'home': 'https://totallife.com/',
};
mkdirSync('docs/compliance', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ userAgent: 'Mozilla/5.0 (compatible; TotalLifeComplianceCheck/1.0)' });
const findings = [];
for (const [slug, url] of Object.entries(pages)) {
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    const text = await page.evaluate(() => document.querySelector('main, article, #content, body').innerText);
    writeFileSync(`docs/compliance/${slug}.txt`, `${url}\nFetched ${new Date().toISOString()}\n\n${text}`);
    const hits = [...new Set((text.match(/Total Life[^.\n]{0,40}(Inc\.?|LLC|Corporation)|[\w.+-]+@[\w-]+\.[\w.]+|\b\d{1,5} [A-Z][\w .]+,? [A-Z]{2} \d{5}\b|Notice of Privacy Practices[^\n]{0,80}|Do Not Sell[^\n]{0,60}|Last (updated|revised)[^\n]{0,40}/gi) || []))];
    findings.push({ slug, url, hits });
    if (slug === 'home') {
      const links = await page.evaluate(() => [...document.querySelectorAll('footer a, [class*="footer"] a')].map(a => ({ text: a.textContent.trim(), href: a.href })).filter(l => l.text));
      writeFileSync('docs/compliance/footer-links.json', JSON.stringify(links, null, 2));
      findings.push({ slug: 'footer-links', count: links.length, hipaa: links.filter(l => /hipaa|privacy practices/i.test(l.text + l.href)) });
    }
    console.log(`saved ${slug} (${text.length} chars)`);
  } catch (e) { console.error(`FAILED ${slug}: ${e.message}`); findings.push({ slug, url, error: e.message }); }
}
writeFileSync('docs/compliance/findings.json', JSON.stringify(findings, null, 2));
console.log(JSON.stringify(findings, null, 2));
await browser.close();
