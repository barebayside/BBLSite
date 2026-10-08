/* "Want to know more?" sign-up -> Catalyst bbl_lead_capture with form:"signup" (2026-10-06).

   Lands in CRM as a Lead tagged Source_of_submission = "Website Sign-up". No snapshot, no
   Lead_Magnets, no journey (Edward decides the marketing flow first). Name + email only.

   Two ways to place it, both from one element:
     <div data-bbl-signup></div>                 an inline box (footer, end of a page)
     <div data-bbl-signup data-mode="popup"></div> a small card that slides in once the
         visitor has scrolled half the page or stayed 30 s; closing it hides it for 30 days
   Wording comes from data-heading / data-text / data-button, so copy changes need no JS.
   data-asset-code carries the placement's registered code (e.g. BBL-AWR-GEN-1.0A_WEB_POPUP).
   text/plain keeps the POST a CORS-"simple" request, the same as the Contact page. */
(function () {
  var ENDPOINT = 'https://bbl-pipeline-7006497428.catalystserverless.com.au/server/bbl_lead_capture/';
  var KEYS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','fbclid','msclkid'];
  var HIDE_KEY = 'bbl_signup_hidden_until';
  var DONE_KEY = 'bbl_signup_done';
  var ART = '/assets/images/popup/popup-beaker-wide.webp';

  var stored = {};
  try { stored = JSON.parse(sessionStorage.getItem('bbl_tracking') || '{}') || {}; } catch (e) {}
  try { var u = new URL(location.href); KEYS.forEach(function (k) { var v = u.searchParams.get(k); if (v) stored[k] = v; });
        sessionStorage.setItem('bbl_tracking', JSON.stringify(stored)); } catch (e) {}

  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  var css = '' +
    '.bbl-su{background:var(--white,#fff);border:1px solid var(--line,#e5e7eb);border-radius:var(--r-md,14px);padding:clamp(18px,3vw,28px);color:var(--ink,#111)}' +
    '.bbl-su h4{font-family:"Bebas Neue",sans-serif;font-size:26px;letter-spacing:.04em;text-transform:uppercase;margin:0 0 6px}' +
    '.bbl-su p.t{margin:0 0 16px;color:var(--muted,#555);font-size:15px;line-height:1.5}' +
    '.bbl-su form{display:flex;flex-wrap:wrap;gap:10px}' +
    '.bbl-su input[type=text],.bbl-su input[type=email]{flex:1 1 180px;min-width:0;background:var(--mist,#f6f7f8);border:1px solid var(--line,#e5e7eb);border-radius:10px;padding:12px 14px;font:16px "Plus Jakarta Sans",sans-serif;color:var(--ink,#111)}' +
    '.bbl-su button[type=submit]{flex:1 1 140px;justify-content:center;border:none}' +
    '.bbl-su .s{display:none;flex-basis:100%;margin:4px 0 0;font-size:14px}' +
    '.bbl-su .hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}' +
    '.bbl-su-pop{position:fixed;right:16px;bottom:16px;z-index:60;width:min(380px,calc(100vw - 32px));box-shadow:0 18px 50px rgba(0,0,0,.18);transform:translateY(130%);transition:transform .45s cubic-bezier(.2,.8,.2,1)}' +
    '.bbl-su-pop.on{transform:none}' +
    '.bbl-su-x{position:absolute;top:8px;right:10px;background:none;border:0;font-size:22px;line-height:1;cursor:pointer;color:var(--muted,#555);padding:6px}' +
    '@media (prefers-reduced-motion:reduce){.bbl-su-pop{transition:none}}' +
    // The pop-up IS the beaker (Edward 2026-10-08): a generated image, cut to the beaker + smoke shape
    // (products/image-pipeline template popup-beaker-wide). The form sits in the dark middle of the glass.
    // Short + wide on purpose: the first, tall beaker took 66% of a phone screen (old card: 39%).
    // Glass position in the art, as fractions: rim 40%, walls 20%-80% across (marks from 70%), liquid from 81% down.
    '.bbl-su-beaker{background:url(' + ART + ') center/100% 100% no-repeat;border:0;border-radius:0;padding:0;box-shadow:none;' +
      'width:min(400px,calc(100vw - 24px),calc(100vh - 24px));aspect-ratio:1;right:4px;bottom:4px;' +
      'filter:drop-shadow(0 26px 30px rgba(14,22,38,.28));container-type:inline-size;color:#fff;' +
      // the art's top and right edges cut through the smoke: fade both so it drifts off into the page
      '-webkit-mask-image:linear-gradient(to bottom,transparent,#000 15%),linear-gradient(to left,transparent,#000 9%);-webkit-mask-composite:source-in;' +
      'mask-image:linear-gradient(to bottom,transparent,#000 15%),linear-gradient(to left,transparent,#000 9%);mask-composite:intersect}' +
    '.bbl-su-beaker .bbl-su-in{position:absolute;left:23.5%;right:30.5%;top:44.5%;bottom:19.5%;display:flex;flex-direction:column;justify-content:flex-end}' +
    '.bbl-su-beaker p.t:empty{display:none}' +
    '.bbl-su-beaker h4{font-size:5.6cqw;line-height:1;margin:0 0 2.2cqw;color:#fff;text-shadow:0 0 18px rgba(167,139,250,.55)}' +
    '.bbl-su-beaker p.t{font-size:2.9cqw;line-height:1.3;margin:0 0 2cqw;color:rgba(255,255,255,.74)}' +
    '.bbl-su-beaker form{flex-direction:column;flex-wrap:nowrap;gap:1.3cqw}' +
    '.bbl-su-beaker input[type=text],.bbl-su-beaker input[type=email]{flex:none;width:100%;padding:1cqw 2.4cqw;font-size:16px;color:#fff;' +
      'background:rgba(255,255,255,.07);border:1px solid rgba(167,139,250,.5);border-radius:9px}' +
    '.bbl-su-beaker input::placeholder{color:rgba(255,255,255,.5)}' +
    '.bbl-su-beaker input:focus{outline:none;border-color:#c4b5fd;box-shadow:0 0 0 3px rgba(167,139,250,.28)}' +
    '.bbl-su-beaker button[type=submit]{flex:none;width:100%;padding:1.5cqw 2cqw;font-size:min(14px,3.5cqw);white-space:nowrap}' +
    '.bbl-su-beaker .s{font-size:2.9cqw;margin:0}' +
    '.bbl-su-beaker .bbl-su-x{top:35%;right:13%;width:28px;height:28px;padding:0;display:grid;place-items:center;border-radius:50%;background:rgba(8,12,20,.6);color:#fff;font-size:20px}';
  var styled = false;
  function addStyle() { if (styled) return; styled = true; var s = document.createElement('style'); s.textContent = css; document.head.appendChild(s); }

  function build(host) {
    var popup = host.getAttribute('data-mode') === 'popup';
    if (popup && (get(DONE_KEY) || Number(get(HIDE_KEY) || 0) > Date.now())) return;
    addStyle();
    var heading = host.getAttribute('data-heading') || 'Want to know more?';
    var text = host.getAttribute('data-text') || 'Leave your email and we will tell you when there is something worth reading. No spam, and you can leave any time.';
    // The beaker's glass only fits the heading and the form (2026-10-08): no text line unless data-popup-text sets one.
    if (popup) text = host.getAttribute('data-popup-text') || '';
    var button = host.getAttribute('data-button') || 'Keep me posted';

    var box = document.createElement('div');
    box.className = 'bbl-su' + (popup ? ' bbl-su-pop bbl-su-beaker' : '');
    box.setAttribute('role', popup ? 'dialog' : 'region');
    box.setAttribute('aria-label', heading);
    box.innerHTML =
      (popup ? '<button type="button" class="bbl-su-x" aria-label="Close">&times;</button>' : '') +
      '<div class="bbl-su-in"><h4></h4><p class="t"></p>' +
      '<form novalidate>' +
        '<div class="hp" aria-hidden="true"><input type="text" name="company_url" tabindex="-1" autocomplete="off"></div>' +
        '<input type="text" name="full_name" autocomplete="name" placeholder="Your name" aria-label="Your name">' +
        '<input type="email" name="email" autocomplete="email" required placeholder="' + (popup ? 'Your email' : 'you@business.com') + '" aria-label="Email">' +
        '<button type="submit" class="btn ' + (popup ? 'btn-light' : 'btn-primary') + '"></button>' +
        '<p class="s" role="status" aria-live="polite"></p>' +
      '</form></div>';
    box.querySelector('h4').textContent = heading;
    box.querySelector('p.t').textContent = text;
    box.querySelector('button[type=submit]').textContent = button;
    host.appendChild(box);

    var form = box.querySelector('form');
    var status = box.querySelector('.s');
    var btn = box.querySelector('button[type=submit]');
    var openedAt = Date.now();

    function say(msg, ok) { status.textContent = msg; status.style.display = 'block';
      status.style.color = popup ? (ok ? '#5FE0B6' : '#ffb4a8') : (ok ? 'var(--emerald,#047857)' : '#b42318'); }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = String(v).trim(); });
      if (!data.email || data.email.indexOf('@') < 1) { say('Please enter your email.', false); return; }
      KEYS.forEach(function (k) { if (stored[k]) data[k] = stored[k]; });
      data.form = 'signup';
      // The pop-up's own registered code (docs/registry/marketing-assets/), the join key for the dashboard.
      if (host.getAttribute('data-asset-code')) data.LP_Asset_Code = host.getAttribute('data-asset-code');
      data.page = location.pathname;
      data.referrer = document.referrer || '';
      data.fill_seconds = Math.round((Date.now() - openedAt) / 1000);
      btn.disabled = true; say('Sending…', true);
      fetch(host.getAttribute('data-webhook-url') || ENDPOINT,
            { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body: JSON.stringify(data) })
        .then(function (r) { return r.json().then(function (j) { if (!r.ok || j.status !== 'ok') throw new Error(j.message || r.status); return j; }); })
        .then(function () {
          form.reset(); set(DONE_KEY, '1');
          say("Thanks, you're on the list.", true);
          (function ps(i){try{var q=window.pagesense=window.pagesense||[];if(q.push!==Array.prototype.push||i>=60){q.push(['trackEvent','signup_submitted']);return;}setTimeout(function(){ps(i+1);},250);}catch(e){}})(0);
          if (popup) setTimeout(function () { box.classList.remove('on'); }, 2500);
        })
        .catch(function () {
          btn.disabled = false;
          say("That didn't send. Please try again, or email service@barebaysidelabs.com.", false);
        });
    });

    if (!popup) return;
    var shown = false, waiting = false;
    // Zoho's cookie banner (#zcb-banner) is a full-width bottom bar on the top layer.
    // Found by the live test 2026-10-06: it sat over the pop-up's button on a phone.
    // The cookie choice comes first, so the pop-up waits until the banner is gone.
    // querySelector, not getElementById: once cookies are accepted PageSense wraps
    // document.getElementById, and its wrapper threw in the live test. Any error here
    // counts as "no banner", so the pop-up can never be stuck behind a failing check.
    function cookieBannerUp() {
      try {
        var c = document.querySelector('#zcb-banner');
        if (!c) return false;
        var r = c.getBoundingClientRect(), st = getComputedStyle(c);
        return r.height > 0 && st.display !== 'none' && st.visibility !== 'hidden' && r.top < window.innerHeight;
      } catch (e) { return false; }
    }
    function show() {
      if (shown) return;
      if (cookieBannerUp()) {
        if (!waiting) { waiting = true; var t = setInterval(function () {
          if (!cookieBannerUp()) { clearInterval(t); waiting = false; show(); } }, 1000); }
        return;
      }
      shown = true;
      // The anti-bot clock keeps running from page load: restarting it here made a fast human (or autofill) look like a bot and get silently dropped (live test 2026-10-06).
      // The beaker art is fetched only now, and the pop-up slides in once it has loaded (no empty glass).
      // If the image fails, it still slides in: a sign-up form is worth more than the picture.
      var art = new Image(), slid = false;
      function slide() { if (slid) return; slid = true; requestAnimationFrame(function () { box.classList.add('on'); }); }
      art.onload = art.onerror = slide; art.src = ART; setTimeout(slide, 4000);
      window.removeEventListener('scroll', onScroll);
    }
    function onScroll() {
      var h = document.documentElement;
      if ((h.scrollTop + window.innerHeight) / Math.max(h.scrollHeight, 1) >= 0.5) show();
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    setTimeout(show, 30000);
    box.querySelector('.bbl-su-x').addEventListener('click', function () {
      box.classList.remove('on');
      set(HIDE_KEY, String(Date.now() + 30 * 24 * 3600 * 1000));
    });
  }

  function init() { Array.prototype.forEach.call(document.querySelectorAll('[data-bbl-signup]'), build); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
