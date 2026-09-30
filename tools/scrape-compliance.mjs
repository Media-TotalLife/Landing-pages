// Pull Total Life's policy pages and home-page footer into docs/compliance/ for the migration checklist.
// usage: node tools/scrape-compliance.mjs [--write]   (run from a machine that can reach totallife.com)
//        --write also copies the privacy policy HTML into privacy/index.html between the POLICY markers
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
const WRITE = process.argv.includes('--write');
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
    if (slug === 'privacy' && WRITE) {
      // Keep only headings, paragraphs and lists; strip attributes, scripts and styles.
      const html = await page.evaluate(() => {
        const root = document.querySelector('main, article, #content, body');
        const keep = new Set(['H1','H2','H3','H4','P','UL','OL','LI','STRONG','EM','B','I','A','BR','TABLE','THEAD','TBODY','TR','TH','TD']);
        const walk = (node) => { let out = ''; node.childNodes.forEach(n => {
          if (n.nodeType === 3) out += n.nodeValue.replace(/[<>]/g, c => c === '<' ? '&lt;' : '&gt;');
          else if (n.nodeType === 1 && !['SCRIPT','STYLE','NAV','HEADER','FOOTER','FORM','BUTTON','IMG','SVG'].includes(n.tagName)) {
            const inner = walk(n); if (!inner.trim() && n.tagName !== 'BR') return;
            if (keep.has(n.tagName)) { const tag = n.tagName === 'H1' ? 'h2' : n.tagName.toLowerCase(); const href = n.tagName === 'A' && n.href ? ` href="${n.href}" rel="noopener"` : ''; out += `<${tag}${href}>${inner}</${tag}>`; }
            else out += inner;
          } }); return out; };
        return walk(root);
      });
      const file = 'privacy/index.html'; const src = readFileSync(file, 'utf8');
      const a = src.indexOf('<!-- POLICY-START -->') + '<!-- POLICY-START -->'.length; const b = src.indexOf('<!-- POLICY-END -->');
      writeFileSync(file, src.slice(0, a) + `\n        <p class="meta">Copied ${new Date().toISOString().slice(0,10)} from ${url}</p>\n        ` + html + '\n        ' + src.slice(b));
      console.log('wrote privacy/index.html');
    }
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
