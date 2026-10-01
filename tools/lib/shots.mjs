// Shared browser routine for capture-site.mjs and compare.mjs: both must settle, scroll and shoot the page the
// same way, or sticky / reveal state alone would show up as a mismatch.
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
export const WIDTHS = [[1440, 900], [1024, 768], [390, 844]];
export const STEP = 0.5;          // scroll-step shots every half viewport
export const STEP_WAIT = 350;     // ms to let scroll-driven state settle at each step
export const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
// Pinned Playwright may not match the preinstalled browser build: use the system Chromium when present.
const EXE = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
export const launch = () => chromium.launch({ executablePath: EXE });
export const newContext = (browser, w, h) => browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, userAgent: UA, reducedMotion: 'reduce' });
export async function settle(page) {
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(300);
}
export const stepsFor = (total, h) => { const ys = []; for (let y = 0; y <= Math.max(0, total - h) + 1; y += Math.round(h * STEP)) ys.push(y); return ys; };
// Walk the page half a viewport at a time, calling fn(y) at each settled position; ends back at the top.
export async function scrollSteps(page, h, fn) {
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (const y of stepsFor(total, h)) { await page.evaluate(v => window.scrollTo(0, v), y); await page.waitForTimeout(STEP_WAIT); if (fn) await fn(y); }
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(500);
}
export const pad5 = (y) => String(y).padStart(5, '0');
