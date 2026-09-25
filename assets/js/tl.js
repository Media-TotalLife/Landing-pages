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

    function complete() {
      window.tlTrack('form_complete', { page: page, form: form.id || '' });
      // [FORM ENDPOINT] — POST `data` to your CRM / call-center intake here.
      // fetch(form.dataset.endpoint, { method: 'POST', body: JSON.stringify(data) })
      steps.forEach(function (s) { s.classList.remove('is-active'); });
      if (progressWrap) progressWrap.style.display = 'none';
      if (success) {
        success.querySelectorAll('[data-fill]').forEach(function (el) {
          var key = el.getAttribute('data-fill'); var v = data[key];
          if (v) el.textContent = (el.dataset.prefix || '') + v + (el.dataset.suffix || '');
          else if (el.dataset.fallback) el.textContent = el.dataset.fallback;
        });
        success.classList.add('is-active');
        var h = success.querySelector('h3'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
      }
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
