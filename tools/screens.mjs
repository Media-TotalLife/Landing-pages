// Full-page screenshots of one or all pages at desktop / laptop / tablet / mobile widths, plus the A3 metrics line.
// usage: node tools/screens.mjs [caregiver|depression|grief|thanks|all] [--server] [--tag <name>] [--dev]
//   --server  start server.js for the run (otherwise expects it on :4173)
//   --tag x   prefix output files: screens/x-<page>-<width>.png (before / css / final layers)
//   --dev     append ?dev=1 so the [CALENDAR NOT CONNECTED] note shows in internal captures (client captures: omit)
// Metrics per capture: card = .booking-card height, page = document height, coral = elements in the first viewport
// whose color or background is #FA7268 / #D64B41, sizes = distinct computed font sizes in the first viewport.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
const pages = { caregiver: '/caregiver/', depression: '/depression/', grief: '/grief/', thanks: '/thanks/?p=caregiver' };
const argv = process.argv.slice(2);
const tagIx = argv.indexOf('--tag');
const tag = tagIx > -1 ? argv[tagIx + 1] : '';
const dev = argv.includes('--dev');
const target = argv.find(a => !a.startsWith('--') && a !== tag);
const which = target && target !== 'all' ? [target] : Object.keys(pages);
const widths = [[1280, 900, 'desktop'], [1024, 768, 'laptop'], [768, 1024, 'tablet'], [375, 812, 'mobile']];
let server;
if (argv.includes('--server')) { server = spawn('node', ['server.js'], { stdio: 'ignore' }); await new Promise(r => setTimeout(r, 600)); }
mkdirSync('screens', { recursive: true });
const browser = await chromium.launch();
const prefix = tag ? tag + '-' : '';
for (const key of which) {
  for (const [w, h] of widths) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(String(e)));
    const url = 'http://localhost:4173' + pages[key] + (dev ? (pages[key].includes('?') ? '&dev=1' : '?dev=1') : '');
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-in')));
    // scroll through so lazy images attach, then return to top
    const total = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < total; y += 700) { await page.evaluate(v => window.scrollTo(0, v), y); await page.waitForTimeout(40); }
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(400);
    const m = await page.evaluate((vh) => {
      const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      const card = document.querySelector('.booking-card');
      const inView = (el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && b.top < vh && b.bottom > 0; };
      const coralRe = /rgb\(250,\s*114,\s*104\)|rgb\(214,\s*75,\s*65\)/;
      const els = [...document.querySelectorAll('body *')].filter(el => !el.closest('.sticky-cta') && inView(el));
      const coral = els.filter(el => { const cs = getComputedStyle(el); return coralRe.test(cs.color) || coralRe.test(cs.backgroundColor) || coralRe.test(cs.borderTopColor) && cs.borderTopWidth !== '0px'; }).length;
      const sizes = new Set(els.filter(el => [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())).map(el => getComputedStyle(el).fontSize));
      return { overflow, card: card ? card.offsetHeight : null, page: document.documentElement.scrollHeight, coral, sizes: sizes.size, placeholders: (document.body.innerText.match(/\[[A-Z][A-Z0-9 ·:,'’&\-–]+\]/g) || []).length };
    }, h);
    await page.addStyleTag({ content: '.sticky-cta{display:none!important}' });
    await page.screenshot({ path: `screens/${prefix}${key}-${w}.png`, fullPage: true });
    await page.evaluate(() => document.querySelector('style:last-of-type')?.remove());
    await page.screenshot({ path: `screens/${prefix}${key}-${w}-fold.png`, fullPage: false });
    console.log(`${key} @${w}: overflow=${m.overflow}px card=${m.card}px page=${m.page}px coral=${m.coral} sizes=${m.sizes} placeholders=${m.placeholders} errors=${errors.length}${errors.length ? ' ' + errors.join(' | ') : ''}`);
    await ctx.close();
  }
}
await browser.close();
if (server) server.kill();
