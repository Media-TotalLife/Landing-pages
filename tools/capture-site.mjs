// Capture totallife.com as a reference for the replica: rendered HTML, every asset the page loads, full-page, fold
// and scroll-step screenshots at three widths, a DOM/computed-style snapshot, and which animation libraries run.
// usage: node tools/capture-site.mjs [--out reference] [--base https://totallife.com] [--max 40] [--only /,/therapy/]
//   Run from a machine that can reach totallife.com (this container's egress policy blocks the host).
//   Output: <out>/manifest.json, <out>/pages/<slug>/{page.html,server.html,libs.json,snapshot-<w>.json,motion-<w>.json}
//           <out>/pages/<slug>/shots/{full,fold}-<w>.png and scroll-<w>-<y>.png, <out>/assets/<host>/<path>
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { WIDTHS, launch, newContext, settle, scrollSteps, pad5 } from './lib/shots.mjs';

const argv = process.argv.slice(2);
const opt = (name, def) => { const i = argv.indexOf(name); return i > -1 ? argv[i + 1] : def; };
const OUT = opt('--out', 'reference');
const BASE = opt('--base', 'https://totallife.com').replace(/\/$/, '');
const MAX = Number(opt('--max', 40));
const ONLY = opt('--only', '') ? opt('--only', '').split(',') : null;

const slugOf = (url) => { const p = new URL(url).pathname.replace(/^\/|\/$/g, ''); return p ? p.replace(/[^a-z0-9]+/gi, '-').toLowerCase() : 'home'; };
const sameSite = (url) => { try { const u = new URL(url); return u.hostname.replace(/^www\./, '') === new URL(BASE).hostname.replace(/^www\./, ''); } catch { return false; } };
const write = (file, data) => { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, data); };

const manifest = existsSync(join(OUT, 'manifest.json')) ? JSON.parse(readFileSync(join(OUT, 'manifest.json'), 'utf8')) : { base: BASE, pages: {}, assets: {} };
const browser = await launch();
const ctx = await newContext(browser, 1440, 900);

// Every response the site loads is saved once, keyed by URL, so the replica can serve the same bytes.
ctx.on('response', async (res) => {
  try {
    const url = res.url(); if (!/^https?:/.test(url) || manifest.assets[url] || res.status() !== 200) return;
    const type = res.headers()['content-type'] || '';
    if (/text\/html/.test(type)) return;
    const body = await res.body(); const u = new URL(url);
    let file = join(OUT, 'assets', u.hostname, u.pathname.replace(/\/$/, '/index')); if (u.search) file += '_' + Buffer.from(u.search).toString('base64url').slice(0, 24);
    write(file, body); manifest.assets[url] = { file, type, bytes: body.length };
  } catch {}
});

const queue = ONLY ? ONLY.map(p => BASE + p) : [BASE + '/', BASE + '/sitemap/'];
const seen = new Set();
while (queue.length && seen.size < MAX) {
  const url = queue.shift(); const key = url.replace(/\/$/, ''); if (seen.has(key)) continue; seen.add(key);
  const slug = slugOf(url); const dir = join(OUT, 'pages', slug);
  const page = await ctx.newPage();
  try {
    const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    write(join(dir, 'server.html'), await res.text());
    const title = await page.title();
    console.log(`${slug}: ${res.status()} "${title}"`);
    if (!ONLY) for (const href of await page.$$eval('a[href]', as => as.map(a => a.href))) {
      if (sameSite(href) && !/\.(pdf|jpe?g|png|svg|zip)$/i.test(href) && !/#|\?|\/wp-|\/feed/.test(href)) queue.push(href.split('#')[0]);
    }
    write(join(dir, 'libs.json'), JSON.stringify(await page.evaluate(() => {
      const w = window; const libs = {};
      for (const k of ['gsap','ScrollTrigger','Lenis','AOS','Webflow','jQuery','Swiper','LocomotiveScroll','ScrollReveal','Rellax','Splide','barba','elementorFrontend','wp','Vue','React','__NEXT_DATA__','__nuxt','framer','Alpine']) if (w[k] !== undefined) libs[k] = typeof w[k] === 'object' && w[k] && w[k].version ? String(w[k].version) : typeof w[k];
      return { generator: document.querySelector('meta[name=generator]')?.content || null, libs,
        scripts: [...document.scripts].map(s => s.src).filter(Boolean), styles: [...document.querySelectorAll('link[rel=stylesheet]')].map(l => l.href),
        fonts: [...new Set([...document.fonts].map(f => `${f.family} ${f.weight} ${f.style}`))], bodyClass: document.body.className, htmlClass: document.documentElement.className };
    }), null, 2));
    for (const [w, h] of WIDTHS) {
      await page.setViewportSize({ width: w, height: h });
      await page.evaluate(() => window.scrollTo(0, 0)); await settle(page);
      await page.screenshot({ path: join(dir, 'shots', `fold-${w}.png`) });
      // Scroll-step shots: what the viewport shows at every half-screen of scrolling, with sticky/reveal state intact,
      // plus a record of every element whose transform/opacity/position looks scroll-driven at that position.
      const motion = [];
      await scrollSteps(page, h, async (y) => {
        await page.screenshot({ path: join(dir, 'shots', `scroll-${w}-${pad5(y)}.png`) });
        motion.push(await page.evaluate((y) => {
          const out = [];
          for (const el of document.querySelectorAll('body *')) {
            const cs = getComputedStyle(el); if (cs.display === 'none') continue;
            const moving = cs.transform !== 'none' || cs.opacity !== '1' || cs.position === 'sticky' || cs.position === 'fixed' || cs.transitionDuration !== '0s' || cs.animationName !== 'none';
            if (!moving) continue; const r = el.getBoundingClientRect(); if (r.width === 0 && r.height === 0) continue;
            out.push({ sel: el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).join('.') : ''), top: Math.round(r.top), left: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height), transform: cs.transform, opacity: cs.opacity, position: cs.position, transition: cs.transition, animation: cs.animation, bgY: cs.backgroundPositionY });
          }
          return { y, els: out.slice(0, 400) };
        }, y));
      });
      write(join(dir, `motion-${w}.json`), JSON.stringify(motion));
      await page.screenshot({ path: join(dir, 'shots', `full-${w}.png`), fullPage: true });
      // DOM + computed-style snapshot at this width: the ground truth the replica's CSS is checked against.
      write(join(dir, `snapshot-${w}.json`), JSON.stringify(await page.evaluate(() => {
        const props = ['display','position','top','left','width','height','margin','padding','fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','color','backgroundColor','backgroundImage','backgroundSize','backgroundPosition','borderRadius','border','boxShadow','opacity','transform','zIndex','textAlign','textTransform','gap','flexDirection','justifyContent','alignItems','gridTemplateColumns','maxWidth','overflow'];
        const out = []; let n = 0;
        for (const el of document.querySelectorAll('body, body *')) {
          if (++n > 6000) break; const cs = getComputedStyle(el); if (cs.display === 'none') continue; const r = el.getBoundingClientRect();
          const s = {}; for (const p of props) s[p] = cs[p];
          out.push({ tag: el.tagName.toLowerCase(), id: el.id || undefined, cls: typeof el.className === 'string' ? el.className : undefined, rect: [Math.round(r.left), Math.round(r.top + scrollY), Math.round(r.width), Math.round(r.height)], text: el.children.length === 0 ? (el.textContent || '').trim().slice(0, 200) : undefined, src: el.currentSrc || el.src || undefined, href: el.href || undefined, style: s });
        }
        return { scrollHeight: document.documentElement.scrollHeight, els: out };
      })));
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    write(join(dir, 'page.html'), '<!-- rendered DOM after load, 1440px -->\n' + await page.content());
    manifest.pages[slug] = { url, title, status: res.status(), dir };
  } catch (e) { console.error(`${slug}: FAILED ${e.message}`); manifest.pages[slug] = { url, error: e.message }; }
  await page.close();
  write(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
}
await browser.close();
console.log(`\n${Object.keys(manifest.pages).length} pages, ${Object.keys(manifest.assets).length} assets → ${OUT}/`);
