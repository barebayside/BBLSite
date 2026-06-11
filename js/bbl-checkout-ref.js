/* BBL checkout attribution — carries the landing-page code into Stripe checkout.
 *
 * THE MISSING PIECE: Stripe doesn't know which landing page / variant a buyer saw. This script
 * tells it, by appending the LP code to the Stripe payment link as `client_reference_id`. Stripe
 * then echoes it back in the `checkout.session.completed` webhook, where the Flow maps it to the
 * Deal's LP_Asset_Code (+ parses the variant letter into LP_Variant).
 *
 * Where the code comes from (in order):
 *   1. sessionStorage 'bbl_lp' — set by bbl-attribution.js on the landing page the buyer came
 *      through (so the variant they actually saw follows them to checkout).
 *   2. this page's own <meta name="bbl-asset-code"> — fallback if they landed straight here.
 *
 * Buy-button markup — when you create the Stripe Payment Link, paste it into data-stripe:
 *     <a class="bbl-buy" data-stripe="https://buy.stripe.com/XXXXXXXX">Order my report</a>
 *   (a plain href to buy.stripe.com also works; this script decorates either.)
 *
 * NOTE: client_reference_id allows letters/numbers/-/_ only. The code's ONLY illegal char is the
 * version dot (1.0B), so it's encoded as a DOUBLE underscore (1__0B) — codes never contain a real
 * double underscore, so the Flow restores it losslessly with a literal replace of "__" → ".".
 */
(function () {
  function lpCode() {
    var stored = '';
    try { stored = sessionStorage.getItem('bbl_lp') || ''; } catch (e) {}
    if (stored) return stored;
    var meta = document.querySelector('meta[name="bbl-asset-code"]');
    return meta ? (meta.getAttribute('content') || '').trim() : '';
  }
  function ref() {
    var code = lpCode();
    if (!code || code.indexOf('REPLACE') === 0) return '';
    // Encode the version dot as "__" (lossless — codes have no real double underscore),
    // then drop anything else Stripe's client_reference_id disallows.
    return code.replace(/\./g, '__').replace(/[^A-Za-z0-9_-]/g, '');
  }
  function decorate() {
    var value = ref();
    if (!value) return;
    var links = document.querySelectorAll('a[data-stripe], a[href*="buy.stripe.com"]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var base = a.getAttribute('data-stripe') || a.getAttribute('href') || '';
      if (base.indexOf('stripe.com') === -1) continue;
      if (base.indexOf('client_reference_id=') !== -1) continue; // already set
      var sep = base.indexOf('?') === -1 ? '?' : '&';
      a.href = base + sep + 'client_reference_id=' + encodeURIComponent(value);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', decorate);
  } else {
    decorate();
  }
})();
