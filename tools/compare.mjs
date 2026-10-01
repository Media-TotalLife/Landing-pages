// Pixel-diff the replica against the captured reference: the full page and every scroll-step viewport (so sticky
// headers, reveals and parallax are checked at each scroll position). Prints mismatch % and writes diff PNGs.
// usage: node tools/compare.mjs [--ref reference] [--local http://localhost:4173] [--only home,therapy] [--out screens/diff]
//        [--threshold 0.5] [--no-scroll]    Exit code 1 while any shot exceeds the threshold.
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { WIDTHS, launch, newContext, settle, scrollSteps, pad5 } from './lib/shots.mjs';

const argv = process.argv.slice(2);
const opt = (name, def) => { const i = argv.indexOf(name); return i > -1 ? argv[i + 1] : def; };
const REF = opt('--ref', 'reference'); const LOCAL = opt('--local', 'http://localhost:4173').replace(/\/$/, '');
const OUT = opt('--out', 'screens/diff'); const THRESH = Number(opt('--threshold', 0.5));
const ONLY = opt('--only', '') ? opt('--only', '').split(',') : null; const SCROLL = !argv.includes('--no-scroll');
const manifest = JSON.parse(readFileSync(join(REF, 'manifest.json'), 'utf8'));
mkdirSync(OUT, { recursive: true });

const pad = (png, w, h) => { if (png.width === w && png.height === h) return png; const o = new PNG({ width: w, height: h }); o.data.fill(255); PNG.bitblt(png, o, 0, 0, Math.min(png.width, w), Math.min(png.height, h), 0, 0); return o; };
// Returns mismatch % and writes the diff image only when it matters (over threshold or a full-page shot).
const diff = (refFile, localBuf, outFile, always) => {
  const a = PNG.sync.read(readFileSync(refFile)), b = PNG.sync.read(localBuf);
  const W = Math.max(a.width, b.width), H = Math.max(a.height, b.height);
  const A = pad(a, W, H), B = pad(b, W, H), D = new PNG({ width: W, height: H });
  const bad = pixelmatch(A.data, B.data, D.data, W, H, { threshold: 0.1, includeAA: false });
  const pct = +(100 * bad / (W * H)).toFixed(2);
  if (always || pct > THRESH) writeFileSync(outFile, PNG.sync.write(D));
  return { pct, refH: a.height, localH: b.height };
};

const browser = await launch();
let worst = 0; const rows = [];
for (const [slug, info] of Object.entries(manifest.pages)) {
  if (info.error || (ONLY && !ONLY.includes(slug))) continue;
  const path = new URL(info.url).pathname; const shots = join(info.dir, 'shots');
  for (const [w, h] of WIDTHS) {
    const refFull = join(shots, `full-${w}.png`); if (!existsSync(refFull)) continue;
    const ctx = await newContext(browser, w, h); const page = await ctx.newPage();
    try {
      await page.goto(LOCAL + path, { waitUntil: 'networkidle', timeout: 30000 }); await settle(page);
      const steps = [];
      await scrollSteps(page, h, async (y) => {
        if (!SCROLL) return; const refStep = join(shots, `scroll-${w}-${pad5(y)}.png`); if (!existsSync(refStep)) { steps.push({ y, missing: true }); return; }
        const r = diff(refStep, await page.screenshot(), join(OUT, `${slug}-${w}-scroll-${pad5(y)}.png`), false); steps.push({ y, ...r });
      });
      const localBuf = await page.screenshot({ fullPage: true });
      const full = diff(refFull, localBuf, join(OUT, `${slug}-${w}.png`), true);
      writeFileSync(join(OUT, `${slug}-${w}-local.png`), localBuf);
      const stepWorst = Math.max(0, ...steps.filter(s => !s.missing).map(s => s.pct));
      const extra = steps.filter(s => s.missing).length; // local page longer than the reference
      worst = Math.max(worst, full.pct, stepWorst);
      rows.push({ slug, w, full: full.pct, refH: full.refH, localH: full.localH, steps, stepWorst, extraSteps: extra });
      console.log(`${slug.padEnd(28)} @${String(w).padStart(4)}  full ${String(full.pct).padStart(6)}%  ref ${full.refH}px / local ${full.localH}px` + (SCROLL ? `  worst scroll step ${stepWorst}%${extra ? ` (+${extra} steps past reference)` : ''}` : ''));
    } catch (e) { console.log(`${slug} @${w}: FAILED ${e.message}`); rows.push({ slug, w, error: e.message }); }
    await ctx.close();
  }
}
await browser.close();
writeFileSync(join(OUT, 'report.json'), JSON.stringify(rows, null, 2));
console.log(`\nworst mismatch ${worst}% (threshold ${THRESH}%) → ${OUT}/`);
process.exit(worst > THRESH || rows.some(r => r.error) ? 1 : 0);
