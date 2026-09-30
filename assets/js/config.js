/* Total Life landing pages — one place for every ID.
   Fill these in from HubSpot, Meta and Google (see docs/hubspot-setup.md and docs/ads-launch.md).
   Leave a value empty and that integration is simply skipped: nothing loads, nothing errors. */
window.TL_CONFIG = {
  hubspot: {
    portalId: '',        // HubSpot Hub ID, e.g. '12345678' (Settings > Account defaults). Loads the tracking code.
    meetingsLink: ''     // Round-robin meetings link for Peggy + Angela, e.g. 'https://meetings.hubspot.com/total-life/care-call'
  },
  meta: {
    pixelId: ''          // Meta Pixel / dataset ID
  },
  google: {
    adsId: '',           // 'AW-XXXXXXXXX'
    leadLabel: '',       // optional second label; /thanks/ fires lead + booked together, so leave empty to count one conversion
    bookedLabel: '',     // conversion label for "Care call booked" (fires on /thanks/)
    ga4Id: ''            // 'G-XXXXXXXXXX' (optional)
  },
  careHours: '9 am to 9 pm Eastern, seven days a week',
  thanksPath: '../thanks/'
};
