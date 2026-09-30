/* Total Life — attribution + tags. Loads before tl.js (both deferred, order preserved).
   - Captures utm_*, gclid/gbraid/wbraid, fbclid and the message-match variant (?v=) into sessionStorage
     (the HubSpot tracking cookie ties the booking to the visit source; the values are kept for GA4 events).
   - Loads Meta Pixel, Google tag (Ads + GA4) and the HubSpot tracking code only when an ID is configured.
   - window.tlConvert('lead' | 'booked') -> fires the matching conversion on every configured tag, once per session
   - window.tlTrack(name, data) -> dataLayer + GA4 event (tl.js reuses this)
   Health & wellness note: Meta restricts what health advertisers may send. Only standard events (PageView, Lead,
   Schedule) with no custom parameters are fired here. Never add health-related parameters to these calls. */
(function () {
  'use strict';
  var cfg = window.TL_CONFIG || {};
  var hs = cfg.hubspot || {}, meta = cfg.meta || {}, g = cfg.google || {};
  var qs = new URLSearchParams(window.location.search);
  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'v'];
  var store = {};
  try { store = JSON.parse(sessionStorage.getItem('tl_attr') || '{}') || {}; } catch (e) { store = {}; }
  var touched = false;
  KEYS.forEach(function (k) { if (qs.has(k)) { store[k] = qs.get(k).slice(0, 200); touched = true; } });
  if (touched || !store.landing_page) {
    store.landing_page = window.location.pathname;
    store.landing_variant = store.v || '';
    store.landed_at = new Date().toISOString();
    if (document.referrer) store.referrer = document.referrer.slice(0, 200);
  }
  try { sessionStorage.setItem('tl_attr', JSON.stringify(store)); } catch (e) {}

  window.tlVariant = function () { return store.landing_variant || ''; };

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  // ---- Google tag (Ads + GA4) ----
  var firstG = g.adsId || g.ga4Id;
  if (firstG) {
    var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(firstG);
    document.head.appendChild(s);
    gtag('js', new Date());
    if (g.adsId) gtag('config', g.adsId, { allow_enhanced_conversions: false });
    if (g.ga4Id) gtag('config', g.ga4Id, { send_page_view: true });
    window.gtag = window.gtag || gtag;
  }

  // ---- Meta Pixel ----
  if (meta.pixelId) {
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', meta.pixelId);
    window.fbq('track', 'PageView');
  }

  // ---- HubSpot tracking code (sets hubspotutk so form submissions attach to the visitor's source) ----
  if (hs.portalId && !document.getElementById('hs-script-loader')) {
    var h = document.createElement('script'); h.id = 'hs-script-loader'; h.async = true; h.defer = true;
    h.src = 'https://js.hs-scripts.com/' + encodeURIComponent(hs.portalId) + '.js';
    document.head.appendChild(h);
  }

  // ---- Tracking hook used by tl.js ----
  window.tlTrack = function (name, data) {
    var payload = Object.assign({ event: name }, data || {});
    window.dataLayer.push(payload);
    if (g.ga4Id && window.gtag) window.gtag('event', name, data || {});
    if (window.location.hostname === 'localhost') console.debug('[tlTrack]', name, data || {});
  };

  // ---- Conversions ----
  window.tlConvert = function (kind) {
    var flag = 'tl_conv_' + kind;
    try { if (sessionStorage.getItem(flag)) return false; sessionStorage.setItem(flag, '1'); } catch (e) {}
    if (kind === 'lead') {
      if (window.fbq) window.fbq('track', 'Lead');
      if (g.adsId && g.leadLabel) gtag('event', 'conversion', { send_to: g.adsId + '/' + g.leadLabel });
      if (g.ga4Id) gtag('event', 'generate_lead', { method: 'care_call_form' });
    } else if (kind === 'booked') {
      if (window.fbq) window.fbq('track', 'Schedule');
      if (g.adsId && g.bookedLabel) gtag('event', 'conversion', { send_to: g.adsId + '/' + g.bookedLabel });
      if (g.ga4Id) gtag('event', 'care_call_booked');
    }
    window.dataLayer.push({ event: 'tl_conversion', kind: kind });
    if (window.location.hostname === 'localhost') console.debug('[tlConvert]', kind);
    return true;
  };
})();
