/* Total Life — shared landing page behaviour (no dependencies)
   - Multi-step forms: one question per screen, plain-English errors, progress text.
   - FAQ: native <details>, enhanced with single-open behaviour.
   - Reveal: gentle opt-in fade for [data-reveal]; off under reduced motion.
   - Sticky mobile CTA: appears after the hero CTA scrolls out of view.
   - Tracking: every [data-track] click and each form step/complete calls window.tlTrack(name, data).
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
    fetch(base + 'index.json', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : []; }).then(function (list) {
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
    fetch(base + 'index.json', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : []; }).then(function (list) {
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
    var target = parseFloat(node.nodeValue); if (isNaN(target)) return;
    var start = null, dur = 1100;
    function tick(t) {
      if (!start) start = t; var p = Math.min(1, (t - start) / dur); p = 1 - Math.pow(1 - p, 3);
      node.nodeValue = String(Math.round(target * p));
      if (p < 1) requestAnimationFrame(tick); else node.nodeValue = String(target);
    }
    node.nodeValue = '0'; requestAnimationFrame(tick);
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
    var sio = new IntersectionObserver(function (entries) {
      var formVisible = false;
      var form = document.querySelector('.form-card');
      if (form) { var r = form.getBoundingClientRect(); formVisible = r.top < window.innerHeight && r.bottom > 0; }
      sticky.classList.toggle('is-visible', !entries[0].isIntersecting && !formVisible);
    }, { threshold: 0 });
    sio.observe(heroCta);
    // hide while the form itself is on screen so we never show two CTAs at once
    var formCard = document.querySelector('.form-card');
    if (formCard) {
      var fio = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) sticky.classList.remove('is-visible');
        else { var hr = heroCta.getBoundingClientRect(); if (hr.bottom < 0) sticky.classList.add('is-visible'); }
      }, { threshold: 0.15 });
      fio.observe(formCard);
    }
  }

  // ---- Multi-step form -------------------------------------------------------
  function dobAge(v) {
    var m = v.replace(/\s/g, '').match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/); if (!m) return null;
    var mo = +m[1], d = +m[2], y = +m[3]; var dt = new Date(y, mo - 1, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
    var now = new Date(); var age = now.getFullYear() - y - ((now.getMonth() < mo - 1 || (now.getMonth() === mo - 1 && now.getDate() < d)) ? 1 : 0);
    return age;
  }
  function normalizeDob(v) { var m = v.replace(/\s/g, '').match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/); if (!m) return v; return ('0' + m[1]).slice(-2) + '/' + ('0' + m[2]).slice(-2) + '/' + m[3]; }

  // Message-match variant: ?v=name shows [data-v="name"] blocks and hides their [data-v="default"] siblings.
  (function applyVariant() {
    var v = window.tlVariant ? window.tlVariant() : (new URLSearchParams(window.location.search).get('v') || '');
    if (!v) return;
    var matches = document.querySelectorAll('[data-v="' + v.replace(/"/g, '') + '"]');
    if (!matches.length) return;
    document.querySelectorAll('[data-v="default"]').forEach(function (el) { el.hidden = true; });
    matches.forEach(function (el) { el.hidden = false; });
    document.body.setAttribute('data-variant', v);
  })();

  // Submit the lead to HubSpot (Forms API v3, unauthenticated, CORS). Resolves {ok, mode}.
  function submitLead(data, page) {
    var cfg = window.TL_CONFIG || {}; var hs = cfg.hubspot || {};
    var attrib = window.tlAttribution ? window.tlAttribution() : {};
    var payload = Object.assign({}, attrib, data, { landing_page: page });
    if (!hs.portalId || !hs.formGuid) {
      if (window.location.hostname === 'localhost') console.debug('[lead] HubSpot not configured; would send', payload);
      return Promise.resolve({ ok: true, mode: 'unconfigured' });
    }
    var CORE = ['firstname', 'lastname', 'email', 'phone', 'date_of_birth', 'zip'];
    function body(keys) {
      var fields = keys.filter(function (k) { return payload[k] !== undefined && payload[k] !== ''; })
        .map(function (k) { return { objectTypeId: '0-1', name: k, value: String(payload[k]) }; });
      var ctx = { pageUri: window.location.href, pageName: document.title };
      var hutk = (document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/) || [])[1]; if (hutk) ctx.hutk = hutk;
      return JSON.stringify({ submittedAt: Date.now(), fields: fields, context: ctx });
    }
    var url = 'https://api.hsforms.com/submissions/v3/integration/submit/' + hs.portalId + '/' + hs.formGuid;
    function post(keys) {
      return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body(keys) })
        .then(function (r) { return r.ok ? { ok: true, mode: 'hubspot' } : r.json().then(function (j) { return { ok: false, status: r.status, error: j }; }, function () { return { ok: false, status: r.status }; }); });
    }
    // If a hidden attribution field is missing from the HubSpot form definition, retry with the six core fields only.
    return post(Object.keys(payload)).then(function (res) { return res.ok || res.status !== 400 ? res : post(CORE); })
      .catch(function (e) { return { ok: false, error: String(e) }; });
  }

  function initForm(form) {
    var steps = Array.prototype.slice.call(form.querySelectorAll('.tl-step:not(.tl-step--success)'));
    var success = form.querySelector('.tl-step--success');
    var progressText = form.querySelector('.progress span');
    var progressBar = form.querySelector('.progress .bar i');
    var progressWrap = form.querySelector('.progress');
    var index = 0;
    var data = {};
    var page = document.body.dataset.page || '';

    function show(i) {
      steps.forEach(function (s, n) { s.classList.toggle('is-active', n === i); });
      if (success) success.classList.remove('is-active');
      index = i;
      if (progressText) progressText.textContent = 'Step ' + (i + 1) + ' of ' + steps.length;
      if (progressBar) progressBar.style.width = ((i + 1) / steps.length * 100) + '%';
      if (progressWrap) progressWrap.style.display = '';
      var focusTarget = steps[i].querySelector('h3, .q');
      if (focusTarget) { focusTarget.setAttribute('tabindex', '-1'); if (i > 0) focusTarget.focus({ preventScroll: true }); }
      window.tlTrack('form_step_view', { page: page, form: form.id || '', step: i + 1 });
    }

    function setError(step, field, message) {
      var target = field || step;
      target.classList.add('has-error');
      var err = target.querySelector(':scope > .error') || target.querySelector('.error');
      if (err && message) { var m = err.querySelector('span'); if (m) m.textContent = message; else err.appendChild(document.createTextNode(message)); }
      if (field) { var input = target.querySelector('.input'); if (input) input.focus({ preventScroll: true }); }
      else if (err) { err.setAttribute('tabindex', '-1'); err.focus({ preventScroll: true }); }
    }
    function clearErrors(step) { step.classList.remove('has-error'); step.querySelectorAll('.has-error').forEach(function (f) { f.classList.remove('has-error'); }); }

    function validate(step) {
      clearErrors(step);
      var ok = true;
      // radio groups
      var radios = step.querySelectorAll('input[type=radio]');
      if (radios.length) {
        var name = radios[0].name; var checked = step.querySelector('input[name="' + name + '"]:checked');
        if (!checked) { setError(step, null, 'Please choose one to continue.'); return false; }
        data[name] = checked.value;
      }
      // text inputs
      step.querySelectorAll('.field').forEach(function (field) {
        var input = field.querySelector('.input'); if (!input) return;
        var v = input.value.trim(); var type = input.dataset.validate || input.type;
        var required = input.required;
        var msg = '';
        if (required && !v) msg = input.dataset.emptyMessage || "Let's try that again — this one is needed.";
        else if (v && type === 'tel' && v.replace(/\D/g, '').length < 10) msg = 'That number looks short. Please add your area code.';
        else if (v && type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) msg = "That email doesn't look right. Let's try that again.";
        else if (v && type === 'zip' && !/^\d{5}$/.test(v.replace(/\D/g, ''))) msg = 'Please enter your 5-digit ZIP code.';
        else if (v && type === 'dob') { var age = dobAge(v); if (age === null) msg = 'Please enter your date of birth as MM / DD / YYYY.'; else if (age < 18) msg = 'You need to be 18 or older to book a call. A family member can book for you.'; else if (age > 115) msg = 'That date looks off. Please check the year.'; }
        if (msg) { ok = false; setError(step, field, msg); }
        else data[input.name] = v;
      });
      return ok;
    }

    form.addEventListener('click', function (e) {
      var next = e.target.closest('[data-next]');
      var back = e.target.closest('[data-back]');
      if (next) {
        e.preventDefault();
        var step = steps[index];
        if (!validate(step)) return;
        if (index < steps.length - 1) show(index + 1); else complete();
      }
      if (back) { e.preventDefault(); if (index > 0) show(index - 1); }
    });
    form.addEventListener('input', function (e) {
      var field = e.target.closest('.field.has-error'); if (field) field.classList.remove('has-error');
      var step = e.target.closest('.tl-step.has-error'); if (step && e.target.type === 'radio') step.classList.remove('has-error');
    });
    form.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.classList.contains('input')) { e.preventDefault(); var b = steps[index].querySelector('[data-next]'); if (b) b.click(); }
    });
    // Format phone as the user types: (555) 123-4567
    form.querySelectorAll('input[type=tel]').forEach(function (tel) {
      tel.addEventListener('input', function () {
        var d = tel.value.replace(/\D/g, '').slice(0, 10);
        var out = d;
        if (d.length > 6) out = '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6);
        else if (d.length > 3) out = '(' + d.slice(0, 3) + ') ' + d.slice(3);
        else if (d.length > 0) out = '(' + d;
        tel.value = out;
      });
    });

    // Format date of birth as the user types: MM / DD / YYYY
    form.querySelectorAll('input[data-validate=dob]').forEach(function (dob) {
      dob.addEventListener('input', function () {
        var d = dob.value.replace(/\D/g, '').slice(0, 8); var out = d;
        if (d.length > 4) out = d.slice(0, 2) + ' / ' + d.slice(2, 4) + ' / ' + d.slice(4);
        else if (d.length > 2) out = d.slice(0, 2) + ' / ' + d.slice(2);
        dob.value = out;
      });
    });
    form.querySelectorAll('input[data-validate=zip]').forEach(function (zip) {
      zip.addEventListener('input', function () { zip.value = zip.value.replace(/\D/g, '').slice(0, 5); });
    });

    var submitting = false;
    function complete() {
      if (submitting) return; submitting = true;
      window.tlTrack('form_complete', { page: page, form: form.id || '' });
      var last = steps[steps.length - 1];
      var btn = last.querySelector('[data-next]'); var label = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'One moment…'; }
      if (data.date_of_birth) data.date_of_birth = normalizeDob(data.date_of_birth);
      var lead = { firstname: data.firstname || '', lastname: data.lastname || '', email: data.email || '', phone: data.phone || '', page: page };
      try { sessionStorage.setItem('tl_lead', JSON.stringify(lead)); } catch (e) {}
      submitLead(data, page).then(function (res) {
        if (res.ok) {
          window.tlTrack('lead_submitted', { page: page, mode: res.mode });
          var cfg = window.TL_CONFIG || {};
          var to = (form.dataset.thanks || cfg.thanksPath || '../thanks/') + '?p=' + encodeURIComponent(page);
          window.location.assign(to);
          return;
        }
        submitting = false;
        if (btn) { btn.disabled = false; btn.textContent = label; }
        window.tlTrack('lead_submit_failed', { page: page, status: res.status || 0 });
        setError(last, null, "We couldn't send that just now. Please try once more, or call 1-800-567-LIFE and we'll book you by phone.");
      });
    }

    show(0);
  }
  document.querySelectorAll('.tl-form').forEach(initForm);

  // Smooth-scroll helper for "Check my coverage" links that point at the form, then focus its first control
  document.querySelectorAll('a[href^="#"][data-focus-form]').forEach(function (a) {
    a.addEventListener('click', function () {
      var target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      setTimeout(function () {
        var first = target.querySelector('.tl-step.is-active .choice input, .tl-step.is-active .input');
        if (first) first.focus({ preventScroll: true });
      }, reduced ? 0 : 600);
    });
  });
})();
