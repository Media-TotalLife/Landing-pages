/* Total Life — shared landing page behaviour (no dependencies)
   - HubSpot booking widget embed with booked-event redirect to /thanks/.
   - FAQ: native <details>, enhanced with single-open behaviour.
   - Reveal: gentle opt-in fade for [data-reveal]; off under reduced motion.
   - Sticky mobile CTA: appears after the hero CTA scrolls out of view.
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
    var frames = document.querySelectorAll('.portrait[data-asset]');
    if (!frames.length) return;
    var base = document.querySelector('script[src*="tl.js"]').getAttribute('src').replace(/js\/tl\.js.*$/, 'img/people/');
    fetch(base + 'index.json').then(function (r) { return r.ok ? r.json() : []; }).then(function (list) {
      var have = {}; (list || []).forEach(function (f) { have[f] = true; });
      frames.forEach(function (frame, i) {
        var still = frame.getAttribute('data-asset');
        if (!have[still]) return;
        var img = document.createElement('img');
        img.alt = ''; img.decoding = 'async'; img.loading = i === 0 ? 'eager' : 'lazy';
        img.src = base + still;
        img.addEventListener('load', function () { frame.classList.add('has-photo'); });
        img.addEventListener('error', function () { img.remove(); });
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

  // ---- Stat count-up (reduced-motion safe) ---------------------------------
  function countUp(el) {
    var node = el.firstChild; if (!node || node.nodeType !== 3) return;
    var m = /^(\d+(?:\.\d+)?)(.*)$/.exec(node.nodeValue.trim()); if (!m) return;
    var target = parseFloat(m[1]), suffix = m[2];
    var start = null, dur = 1100;
    function tick(t) {
      if (!start) start = t; var p = Math.min(1, (t - start) / dur); p = 1 - Math.pow(1 - p, 3);
      node.nodeValue = String(Math.round(target * p)) + suffix;
      if (p < 1) requestAnimationFrame(tick); else node.nodeValue = m[1] + suffix;
    }
    node.nodeValue = '0' + suffix; requestAnimationFrame(tick);
  }
  var stats = document.querySelectorAll('.stat b');
  if (stats.length && !reduced && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.4 });
    stats.forEach(function (s) { cio.observe(s); });
  }

  // ---- FAQ single-open ----------------------------------------------------
  document.querySelectorAll('.faq').forEach(function (faq) {
    faq.addEventListener('toggle', function (e) {
      if (e.target.open) faq.querySelectorAll('details[open]').forEach(function (d) { if (d !== e.target) d.open = false; });
    }, true);
  });

  // ---- Sticky mobile CTA ---------------------------------------------------
  var sticky = document.querySelector('.sticky-cta');
  var heroCta = document.querySelector('[data-hero-cta]');
  if (sticky && heroCta && 'IntersectionObserver' in window) {
    document.body.classList.add('has-sticky');
    sticky.setAttribute('inert', '');
    var sio = new IntersectionObserver(function (entries) {
      var cardVisible = false;
      var card = document.querySelector('.booking-card');
      if (card) { var r = card.getBoundingClientRect(); var vis = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0); cardVisible = vis > Math.min(r.height, window.innerHeight) * 0.25; }
      sticky.classList.toggle('is-visible', !entries[0].isIntersecting && !cardVisible);
      sticky.toggleAttribute('inert', !sticky.classList.contains('is-visible'));
    }, { threshold: 0 });
    sio.observe(heroCta);
    // hide while the form itself is on screen so we never show two CTAs at once
    var formCard = document.querySelector('.booking-card');
    if (formCard) {
      var fio = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) sticky.classList.remove('is-visible');
        else { var hr = heroCta.getBoundingClientRect(); if (hr.bottom < 0) sticky.classList.add('is-visible'); }
        sticky.toggleAttribute('inert', !sticky.classList.contains('is-visible'));
      }, { threshold: 0.25 });
      fio.observe(formCard);
    }
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
  // When TL_CONFIG.hubspot.meetingsLink is set, the round-robin scheduler is embedded; when HubSpot reports a
  // booking (postMessage meetingBookSucceeded) the booked conversion fires and the visitor goes to /thanks/.
  (function booking() {
    var card = document.querySelector('[data-booking]'); if (!card) return;
    var cfg = window.TL_CONFIG || {}; var hs = cfg.hubspot || {};
    var slot = card.querySelector('[data-meetings]'); var ph = card.querySelector('[data-calendar-placeholder]');
    var page = document.body.dataset.page || '';
    if (hs.meetingsLink && slot) {
      var url = new URL(hs.meetingsLink); url.searchParams.set('embed', 'true');
      slot.setAttribute('data-src', url.toString());
      if (ph) ph.remove();
      var s = document.createElement('script'); s.src = 'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js'; s.async = true;
      document.body.appendChild(s);
      card.classList.add('has-widget');
    } else if (slot) { slot.remove(); }
    window.addEventListener('message', function (e) {
      var host = ''; try { host = new URL(e.origin).hostname; } catch (err) { return; }
      if (!/(^|\.)hubspot\.com$/.test(host) && !/(^|\.)hsforms\.com$/.test(host)) return;
      var d = e.data; if (!d || typeof d !== 'object') return;
      if (d.meetingBookSucceeded || d.type === 'hsMeetingBookSucceeded') {
        window.tlTrack('care_call_booked', { page: page });
        if (window.tlConvert) window.tlConvert('booked');
        var to = (card.getAttribute('data-thanks') || cfg.thanksPath || '../thanks/') + '?p=' + encodeURIComponent(page);
        setTimeout(function () { window.location.assign(to); }, 1200);
      }
    });
  })();

  // CTA links to #book: move focus to the booking card heading after the scroll so screen readers land on it
  document.querySelectorAll('a[href="#book"]').forEach(function (a) {
    a.addEventListener('click', function () {
      var target = document.getElementById('book'); if (!target) return;
      var h = target.querySelector('.cal-head b'); if (!h) return;
      h.setAttribute('tabindex', '-1');
      setTimeout(function () { h.focus({ preventScroll: true }); }, reduced ? 0 : 600);
    });
  });
})();
