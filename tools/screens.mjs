// Full-page screenshots of one or all pages at desktop / tablet / mobile widths.
// usage: node tools/screens.mjs [senior|caregiver|check|all] [--server]   (expects server on :4173 unless --server)
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
const pages = { senior: '/senior/', caregiver: '/caregiver/', check: '/check/' };
const which = process.argv[2] && process.argv[2] !== 'all' ? [process.argv[2]] : Object.keys(pages);
const widths = [[1920, 1080, 'desktop'], [834, 1112, 'tablet'], [375, 812, 'mobile']];
let server;
if (process.argv.includes('--server')) { server = spawn('node', ['server.js'], { stdio: 'ignore' }); await new Promise(r => setTimeout(r, 600)); }
mkdirSync('screens', { recursive: true });
const browser = await chromium.launch();
for (const key of which) {
  for (const [w, h, name] of widths) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto('http://localhost:4173' + pages[key], { waitUntil: 'networkidle' });
    await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-in')));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    await page.screenshot({ path: `screens/${key}-${name}.png`, fullPage: true });
    await page.screenshot({ path: `screens/${key}-${name}-fold.png`, fullPage: false });
    console.log(`${key} @${w}: overflow=${overflow}px errors=${errors.length}${errors.length ? ' ' + errors.join(' | ') : ''}`);
    await ctx.close();
  }
}
await browser.close();
if (server) server.kill();
