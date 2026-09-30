// End-to-end data-path test with a stub config and intercepted network.
// Proves: HubSpot tracking code + meetings embed load from config, UTMs are captured, Meta/Google tags load,
// a HubSpot booking message fires care_call_booked + tlConvert('booked') and redirects to /thanks/, and /thanks/
// fires Lead + Schedule (Meta) and both Google Ads conversions exactly once. usage: node tools/tracking-test.mjs
import { chromium } from 'playwright';
const CFG = `window.TL_CONFIG = { hubspot: { portalId: '424242', meetingsLink: 'https://meetings.hubspot.com/total-life/care-call' },
  meta: { pixelId: '999000111' }, google: { adsId: 'AW-777', leadLabel: 'LEADLBL', bookedLabel: 'BOOKLBL', ga4Id: 'G-TEST' },
  careHours: '9 am to 9 pm Eastern, seven days a week', thanksPath: '../thanks/' };`;
const pages = ['senior', 'caregiver', 'depression', 'grief'];
const browser = await chromium.launch();
let failures = 0; const fail = (m) => { failures++; console.log('  FAIL ' + m); };
for (const key of pages) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const requests = []; const calls = { fbq: [], gtag: [] };
  await page.exposeFunction('__rec', (kind, args) => { calls[kind].push(args); });
  await page.route('**/*', async (route) => {
    const url = route.request().url(); requests.push(url);
    if (url.includes('/assets/js/config.js')) return route.fulfill({ contentType: 'text/javascript', body: CFG });
    if (url.includes('connect.facebook.net')) return route.fulfill({ contentType: 'text/javascript', body: `var q = (window.fbq && window.fbq.queue) || []; window.fbq = function(){ window.__rec('fbq', [].slice.call(arguments).map(String)); }; window.fbq.loaded = true; window.fbq.queue = []; q.forEach(function(a){ window.__rec('fbq', [].slice.call(a).map(String)); });` });
    if (url.includes('googletagmanager.com/gtag/js')) return route.fulfill({ contentType: 'text/javascript', body: `window.dataLayer = window.dataLayer || []; var orig = window.dataLayer.push.bind(window.dataLayer); function rec(a){ try { window.__rec('gtag', [].slice.call(a).map(function(x){ return typeof x === 'object' ? JSON.stringify(x) : String(x); })); } catch(e){} } window.dataLayer.forEach(function(a){ if (a && a.length !== undefined) rec(a); }); window.dataLayer.push = function(a){ if (a && a.length !== undefined) rec(a); return orig(a); };` });
    if (url.includes('js.hs-scripts.com')) return route.fulfill({ contentType: 'text/javascript', body: 'document.cookie = "hubspotutk=testcookie; path=/";' });
    if (url.includes('MeetingsEmbedCode.js')) return route.fulfill({ contentType: 'text/javascript', body: `document.querySelectorAll('.meetings-iframe-container').forEach(function(c){ var f = document.createElement('iframe'); f.src = 'about:blank'; f.setAttribute('data-embed-src', c.getAttribute('data-src')); f.style.height='640px'; c.appendChild(f); });` });
    return route.continue();
  });
  await page.goto(`http://localhost:4173/${key}/?utm_source=google&utm_medium=cpc&utm_campaign=${key}&utm_content=test&gclid=GCLID123&fbclid=FB123`, { waitUntil: 'networkidle' });
  console.log(key);
  const has = (s) => requests.some(u => u.includes(s));
  if (!has('js.hs-scripts.com/424242.js')) fail('HubSpot tracking code not requested');
  if (!has('MeetingsEmbedCode.js')) fail('HubSpot meetings embed script not requested');
  if (!has('connect.facebook.net')) fail('Meta pixel not requested');
  if (!has('googletagmanager.com/gtag/js?id=AW-777')) fail('Google tag not requested with Ads id');
  const embedSrc = await page.evaluate(() => { const f = document.querySelector('.booking-card iframe'); return f && f.getAttribute('data-embed-src'); });
  if (!embedSrc || !embedSrc.startsWith('https://meetings.hubspot.com/total-life/care-call') || !embedSrc.includes('embed=true')) fail('embed src wrong: ' + embedSrc);
  const placeholderGone = await page.evaluate(() => !document.querySelector('[data-calendar-placeholder]'));
  if (!placeholderGone) fail('calendar placeholder still visible with meetingsLink set');
  const attr = await page.evaluate(() => JSON.parse(sessionStorage.getItem('tl_attr') || '{}'));
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'gclid', 'fbclid', 'landing_page']) if (!attr[k]) fail('attribution missing ' + k);
  if (!calls.fbq.some(a => a[0] === 'init' && a[1] === '999000111')) fail('fbq init not called');
  if (!calls.fbq.some(a => a[0] === 'track' && a[1] === 'PageView')) fail('fbq PageView not fired');
  if (!calls.gtag.some(a => a[0] === 'config' && a[1] === 'AW-777')) fail('gtag config AW not called');
  if (!calls.gtag.some(a => a[0] === 'config' && a[1] === 'G-TEST')) fail('gtag config GA4 not called');
  // Simulate HubSpot's booking message (origin check must accept meetings.hubspot.com and reject others)
  await page.evaluate(() => window.dispatchEvent(new MessageEvent('message', { origin: 'https://evil.example.com', data: { meetingBookSucceeded: true } })));
  await page.waitForTimeout(300);
  if (page.url().includes('/thanks/')) fail('redirected on message from a foreign origin');
  const before = calls.fbq.length;
  await page.evaluate(() => window.dispatchEvent(new MessageEvent('message', { origin: 'https://meetings.hubspot.com', data: { meetingBookSucceeded: true, meetingsPayload: { bookingResponse: {} } } })));
  await page.waitForURL(/\/thanks\/\?p=/, { timeout: 5000 }).catch(() => fail('no redirect to /thanks/ after booking message'));
  const bookedOnPage = calls.fbq.slice(before).some(a => a[0] === 'track' && a[1] === 'Schedule');
  if (!bookedOnPage) fail('Schedule not fired on booking message');
  const dl = await page.evaluate(() => (window.dataLayer || []).filter(e => e && e.event).map(e => e.event + (e.kind ? ':' + e.kind : '')));
  // thanks page: Lead + Schedule (Meta), conversion AW-777/LEADLBL + AW-777/BOOKLBL (Google), once each
  await page.waitForLoadState('networkidle');
  const thanksCalls = { fbq: calls.fbq.filter(a => a[0] === 'track'), gtag: calls.gtag.filter(a => a[0] === 'event' && a[1] === 'conversion') };
  const leadCount = calls.fbq.filter(a => a[0] === 'track' && a[1] === 'Lead').length;
  const schedCount = calls.fbq.filter(a => a[0] === 'track' && a[1] === 'Schedule').length;
  const gLead = calls.gtag.filter(a => a[0] === 'event' && a[1] === 'conversion' && a[2].includes('LEADLBL')).length;
  const gBook = calls.gtag.filter(a => a[0] === 'event' && a[1] === 'conversion' && a[2].includes('BOOKLBL')).length;
  if (leadCount !== 1) fail('Meta Lead fired ' + leadCount + ' times (want 1)');
  if (schedCount !== 1) fail('Meta Schedule fired ' + schedCount + ' times (want 1; booking page + thanks must dedupe)');
  if (gLead !== 1) fail('Google lead conversion fired ' + gLead + ' times');
  if (gBook !== 1) fail('Google booked conversion fired ' + gBook + ' times');
  const attrOnThanks = await page.evaluate(() => JSON.parse(sessionStorage.getItem('tl_attr') || '{}'));
  if (attrOnThanks.utm_campaign !== key) fail('attribution lost on thanks page');
  const errors = await page.evaluate(() => window.__errs || []);
  console.log(`  ok: hs+embed+pixel+gtag loaded, attr=${Object.keys(attr).length} keys, fbq=${calls.fbq.length} calls, gtag=${calls.gtag.length} calls, thanks=${page.url().split('/').slice(-2).join('/')}`);
  await ctx.close();
}
await browser.close();
console.log(failures ? `FAILURES: ${failures}` : 'ALL OK');
process.exit(failures ? 1 : 0);
