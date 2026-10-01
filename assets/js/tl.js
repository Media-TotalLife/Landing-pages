/* Total Life — shared landing page behaviour (no dependencies)
   - HubSpot booking widget embed with booked-event redirect to /thanks/.
   - Reveal: gentle opt-in fade for [data-reveal]; off under reduced motion.
   - Sticky mobile CTA and desktop header CTA: appear once the booking card has scrolled away; hidden while the card or the final button is on screen.
   - Tracking: every [data-track] click and the booking event call window.tlTrack(name, data).
*/
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Tracking hook ----------------------------------------------------
  // Replace this function body with your analytics call (GA4, Segment, CallRail…).
  window.tlTrack = window.tlTrack || function (name, data) {
    if (window.dataLayer) window.dataLayer.push(Object.assign({ event: name }, data || {}));
    if (window.location.hostname === 'localhost') console.debug('[tlTrack]', name, data || {});
  };
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track]');
    if (el) window.tlTrack(el.getAttribute('data-track'), { page: document.body.dataset.page || '' });
  });

  // ---- Portrait assets ---------------------------------------------------
  // Frames declare data-asset / data-video / data-poster. Only files listed in
  // assets/img/people/index.json are attached (run `npm run assets` after adding files),
  // so nothing 404s before the assets exist and the placeholder stays visible.
  (function attachAssets() {
    var frames = document.querySelectorAll('.portrait[data-asset]'); if (!frames.length) return;
    var base = document.querySelector('script[src*="tl.js"]').getAttribute('src').replace(/js\/tl\.js.*$/, 'img/people/');
    fetch(base + 'index.json').then(function (r) { return r.ok ? r.json() : []; }).then(function (list) {
      var have = {}; (list || []).forEach(function (f) { have[f] = true; });
      var firstDone = false;
      // Frames that are display:none (hero photo and scene on phones, FAQ photo on tablets) are skipped, so the
      // hidden slots never download; the matchMedia re-run below attaches them if the viewport grows.
      function attach(frame) {
        if (frame.querySelector('img') || !frame.getClientRects().length) return;
        var still = frame.getAttribute('data-asset'); if (!have[still]) return;
        var img = document.createElement('img'); img.alt = ''; img.decoding = 'async';
        if (!firstDone) { img.loading = 'eager'; img.setAttribute('fetchpriority', 'high'); firstDone = true; } else { img.loading = 'lazy'; }
        // Responsive variants (<stem>-480/800/1200.jpg) when index.json lists them; srcset and sizes are set before src
        // so no engine starts a master fetch first. Missing variants fall back to the master unchanged.
        var stem = still.replace(/\.jpg$/, '');
        var cands = [480, 800, 1200].filter(function (w) { return have[stem + '-' + w + '.jpg']; });
        if (cands.length) {
          img.srcset = cands.map(function (w) { return base + stem + '-' + w + '.jpg ' + w + 'w'; }).join(', ') + ', ' + base + still + ' 1600w';
          img.sizes = frame.getAttribute('data-sizes') || '(max-width: 900px) 100vw, 460px';
        }
        img.addEventListener('load', function () { frame.classList.add('has-photo'); });
        img.addEventListener('error', function () { img.remove(); });
        img.src = base + still;
        frame.insertBefore(img, frame.firstChild);
        var clip = frame.getAttribute('data-video');
        if (clip && have[clip] && !reduced && !window.matchMedia('(max-width: 640px) and (prefers-reduced-data: reduce)').matches) {
          var v = document.createElement('video');
          v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true; v.setAttribute('playsinline', '');
          v.setAttribute('aria-hidden', 'true'); v.preload = 'metadata';
          var poster = frame.getAttribute('data-poster'); if (poster && have[poster]) v.poster = base + poster;
          v.src = base + clip;
          v.addEventListener('loadedmetadata', function () {
            if (v.videoWidth && v.videoHeight) frame.style.aspectRatio = v.videoWidth + ' / ' + v.videoHeight;
          });
          v.addEventListener('canplay', function () { v.classList.add('is-ready'); v.play().catch(function () {}); });
          v.addEventListener('error', function () { v.remove(); });
          frame.insertBefore(v, img.nextSibling);
        }
      }
      frames.forEach(attach);
      ['(min-width: 641px)', '(min-width: 901px)'].forEach(function (q) {
        var mq = window.matchMedia(q); var run = function () { frames.forEach(attach); };
        if (mq.addEventListener) mq.addEventListener('change', run); else mq.addListener(run);
      });
    }).catch(function () {});
  })();

  // ---- Section textures ------------------------------------------------------
  (function attachTextures() {
    var slots = document.querySelectorAll('.texture[data-texture]');
    if (!slots.length) return;
    var base = document.querySelector('script[src*="tl.js"]').getAttribute('src').replace(/js\/tl\.js.*$/, 'img/textures/');
    fetch(base + 'index.json').then(function (r) { return r.ok ? r.json() : []; }).then(function (list) {
      var have = {}; (list || []).forEach(function (f) { have[f] = true; });
      slots.forEach(function (slot) {
        var name = slot.getAttribute('data-texture');
        if (have[name + '.mp4'] && !reduced) {
          var v = document.createElement('video');
          v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true'); v.preload = 'metadata';
          if (have[name + '-poster.jpg']) v.poster = base + name + '-poster.jpg';
          v.src = base + name + '.mp4';
          v.addEventListener('canplay', function () { v.classList.add('is-ready'); v.play().catch(function () {}); });
          v.addEventListener('error', function () { v.remove(); });
          slot.appendChild(v);
        }
        if (have[name + '.jpg']) {
          var img = document.createElement('img'); img.alt = ''; img.loading = 'lazy'; img.decoding = 'async';
          img.src = base + name + '.jpg';
          img.addEventListener('load', function () { img.classList.add('is-in'); });
          img.addEventListener('error', function () { img.remove(); });
          slot.appendChild(img);
        }
      });
    }).catch(function () {});
  })();

  // ---- Reveal -----------------------------------------------------------
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (reduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // ---- Sticky mobile CTA ---------------------------------------------------
  // Keyed to the booking card itself (the hero button is hidden on phones, where the card sits directly
  // under the headline): the bar shows once the card has scrolled off the top, and hides whenever a quarter
  // or more of the card is on screen, so there are never two calls to action in view at once.
  var sticky = document.querySelector('.sticky-cta');
  var bookCard = document.querySelector('.booking-card');
  var finalBtn = document.querySelector('.final-actions .btn--primary');
  if (sticky && bookCard && 'IntersectionObserver' in window) {
    document.body.classList.add('has-sticky');
    sticky.setAttribute('inert', '');
    var updateSticky = function () {
      var r = bookCard.getBoundingClientRect();
      var seen = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
      var onScreen = seen > Math.min(r.height, window.innerHeight) * 0.25;
      var fr = finalBtn ? finalBtn.getBoundingClientRect() : null; var finalOn = !!fr && fr.bottom > 0 && fr.top < window.innerHeight;
      var show = !onScreen && !finalOn && r.bottom < window.innerHeight * 0.5;
      sticky.classList.toggle('is-visible', show);
      sticky.toggleAttribute('inert', !show);
      document.body.classList.toggle('card-away', show);
      var hc = document.querySelector('.header-cta'); if (hc) { hc.setAttribute('aria-hidden', show ? 'false' : 'true'); hc.tabIndex = show ? 0 : -1; }
    };
    var sio = new IntersectionObserver(updateSticky, { threshold: [0, 0.25, 0.5, 1] });
    sio.observe(bookCard);
    if (finalBtn) sio.observe(finalBtn);
    window.addEventListener('resize', updateSticky);
  }

  // Message-match variant: ?v=name shows [data-v="name"] blocks and hides their [data-v="default"] siblings.
  (function applyVariant() {
    var v = window.tlVariant ? window.tlVariant() : (new URLSearchParams(window.location.search).get('v') || '');
    if (!v) return;
    var matches = document.querySelectorAll('[data-v="' + v.replace(/"/g, '') + '"]');
    if (!matches.length) return;
    document.querySelectorAll('[data-v="default"]').forEach(function (el) { el.hidden = true; });
    matches.forEach(function (el) { el.hidden = false; });
    // Point the hero's accessible name at the visible headline
    var h = document.querySelector('[data-v="' + v.replace(/"/g, '') + '"] h1');
    var section = h && h.closest('section[aria-labelledby]');
    if (h && section) { if (!h.id) h.id = 'hero-h-' + v.replace(/[^a-z0-9]+/gi, '-'); section.setAttribute('aria-labelledby', h.id); }
    document.body.setAttribute('data-variant', v);
  })();

  // ---- HubSpot booking widget --------------------------------------------------
  // <div class="booking-card" id="book" data-booking> with [data-meetings] and [data-calendar-placeholder].
  // The HubSpot tracking code (track.js) sets the hubspotutk cookie; MeetingsEmbedCode.js copies it into the
  // iframe URL (parentHubspotUtk) so the booked contact keeps its Original source. We wait for that cookie before
  // loading the embed, and also append the visit's UTMs to the meetings link as a cookie-independent second path.
  // On HubSpot's meetingBookSucceeded message we mark the booking in sessionStorage and go to /thanks/, where the
  // conversions fire (once) with the page fully loaded.
  (function booking() {
    if (/[?&]dev=1(&|$)/.test(location.search)) document.documentElement.setAttribute('data-dev', '');
    var card = document.querySelector('[data-booking]'); if (!card) return;
    var cfg = window.TL_CONFIG || {}; var hs = cfg.hubspot || {};
    var slot = card.querySelector('[data-meetings]'); var ph = card.querySelector('[data-calendar-placeholder]');
    var page = document.body.dataset.page || '';
    var status = ph && ph.querySelector('.cal-status');
    var month = ph && ph.querySelector('[data-month]');
    if (month) { try { month.textContent = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }); } catch (e) {} }
    function widgetReady() {
      if (ph) { ph.classList.remove('is-failed'); ph.classList.add('is-live'); if (status) status.textContent = 'Available times are shown below.'; }
      card.classList.remove('is-loading'); card.classList.add('has-widget');
    }
    function widgetFailed() {
      if (!ph) return;
      ph.classList.add('is-failed');
      if (status) status.textContent = 'The calendar did not load.';
      card.classList.remove('is-loading');
    }
    function embed() {
      var url;
      try { url = new URL(String(hs.meetingsLink).trim()); } catch (e) { console.error('[tl] hubspot.meetingsLink is not a valid URL:', hs.meetingsLink); widgetFailed(); return; }
      url.searchParams.set('embed', 'true');
      var attr = {}; try { attr = JSON.parse(sessionStorage.getItem('tl_attr') || '{}') || {}; } catch (e) {}
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid'].forEach(function (k) { if (attr[k]) url.searchParams.set(k, attr[k]); });
      slot.setAttribute('data-src', url.toString());
      // The placeholder stays as the loading state (calendar outline + "Loading available times") until
      // HubSpot's script injects its iframe, so the card never collapses or shows an empty box.
      card.classList.add('is-loading');
      if (status) status.textContent = 'Loading available times\u2026';
      var done = false;
      function check() { if (!done && slot.querySelector('iframe')) { done = true; widgetReady(); } return done; }
      if ('MutationObserver' in window) { var mo = new MutationObserver(function () { if (check()) mo.disconnect(); }); mo.observe(slot, { childList: true, subtree: true }); }
      var s = document.createElement('script'); s.src = 'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js'; s.async = true;
      s.addEventListener('load', function () { check(); });
      s.addEventListener('error', function () { done = true; widgetFailed(); });
      document.body.appendChild(s);
      // Recoverable: done stays false and the MutationObserver stays attached, so a late iframe still calls widgetReady.
      setTimeout(function () { if (!check()) widgetFailed(); }, 15000);
    }
    if (hs.meetingsLink && slot) {
      if (!hs.portalId) embed();
      else {
        var tries = 0;
        (function waitForUtk() {
          if (/(^|;\s*)hubspotutk=/.test(document.cookie) || tries++ > 20) embed(); else setTimeout(waitForUtk, 100);
        })();
      }
    } else if (slot) {
      slot.remove();
      if (ph) { ph.classList.add('is-unconfigured'); if (status) status.textContent = 'Book by phone.'; }
    }
    window.addEventListener('message', function (e) {
      var host = ''; try { host = new URL(e.origin).hostname; } catch (err) { return; }
      if (!/(^|\.)hubspot\.com$/.test(host)) return;
      var d = e.data; if (!d || typeof d !== 'object') return;
      if (d.meetingBookSucceeded) {
        try { sessionStorage.setItem('tl_booked', page || '1'); } catch (err) {}
        window.tlTrack('care_call_booked', { page: page });
        var to = (card.getAttribute('data-thanks') || cfg.thanksPath || '../thanks/') + '?p=' + encodeURIComponent(page);
        window.location.assign(to);
      }
    });
  })();

  // CTA links to #book: move focus to the booking card heading after the scroll so screen readers land on it
  document.querySelectorAll('a[href="#book"]').forEach(function (a) {
    a.addEventListener('click', function () {
      var target = document.getElementById('book'); if (!target) return;
      var h = target.querySelector('.cal-head .cal-h'); if (!h) return;
      h.setAttribute('tabindex', '-1');
      setTimeout(function () { h.focus({ preventScroll: true }); }, reduced ? 0 : 600);
    });
  });
})();
