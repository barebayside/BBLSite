/* BBL page attribution — stamps LP_Asset_Code + LP_Variant into every <form> on the page.
 *
 * What it does:
 *   - Reads the page's registered code from <meta name="bbl-asset-code"> (e.g. BBL-AWR-COMP-1.0A_WEB_LP).
 *   - Writes hidden field  LP_Asset_Code = the full code (variant letter swapped to the live variant).
 *   - Writes hidden field  LP_Variant    = the variant letter (default = the code's own letter, e.g. "A").
 *   These ride the form submission → Zoho Flow webhook → bbl_inbound_lead → CRM Lead, so every lead
 *   records which page + which version it came from. Pairs with the LP_Variant/LP_Asset_Code writes in
 *   products/competitor-intel/funnel/bbl_inbound_lead.deluge.
 *
 * Running an A/B test (PageSense): in each variant's custom JS box, set the served variant ONE of two ways
 * (the script handles whichever fires first — no detection guesswork):
 *     window.bblVariant = 'B';            // simplest — a global the script reads on load
 *     if (window.bblSetVariant) window.bblSetVariant('B');   // if this script already ran
 *   The "original/control" variant needs no JS — it keeps the page's default letter (A).
 *
 * Manual QA / split-URL tests: append ?v=B to the URL to force a variant.
 *
 * No A/B test running = every visitor is on the page's default version (its code letter). That's correct.
 */
(function () {
  var meta = document.querySelector('meta[name="bbl-asset-code"]');
  var baseCode = meta ? (meta.getAttribute('content') || '').trim() : '';
  if (!baseCode || baseCode.indexOf('REPLACE') === 0) return; // page not registered — nothing to stamp

  // The variant slot is the UPPERCASE letter right after {seq}.{ver}: ...-1.0A_WEB_LP -> "A".
  function variantOf(code) {
    var m = code.match(/\d+\.\d+([A-Z])?_/);
    return (m && m[1]) ? m[1] : '';
  }
  function withVariant(code, letter) {
    if (!letter) return code;
    return code.replace(/(\d+\.\d+)[A-Z]?(_)/, '$1' + letter + '$2');
  }

  var defaultVariant = variantOf(baseCode);

  var urlVariant = '';
  try { urlVariant = ((new URL(window.location.href)).searchParams.get('v') || '').toUpperCase(); } catch (e) {}

  var current = urlVariant || (window.bblVariant ? String(window.bblVariant).toUpperCase() : '') || defaultVariant;

  function setField(form, name, value) {
    var f = form.querySelector('input[name="' + name + '"]');
    if (!f) {
      f = document.createElement('input');
      f.type = 'hidden';
      f.name = name;
      form.appendChild(f);
    }
    f.value = value;
  }
  function stamp(letter) {
    var code = withVariant(baseCode, letter);
    var forms = document.querySelectorAll('form');
    for (var i = 0; i < forms.length; i++) {
      setField(forms[i], 'LP_Asset_Code', code);
      if (letter) setField(forms[i], 'LP_Variant', letter);
    }
  }

  // Remember the resolved code for THIS visit so it survives the hop from the
  // landing page to the product/checkout page (read by bbl-checkout-ref.js).
  function persist(letter) {
    try { sessionStorage.setItem('bbl_lp', withVariant(baseCode, letter)); } catch (e) { /* private mode */ }
  }

  // PageSense per-variant custom JS can call this once the script is present.
  window.bblSetVariant = function (letter) {
    if (!letter) return;
    current = String(letter).toUpperCase();
    stamp(current);
    persist(current);
  };

  function init() { stamp(current); persist(current); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
