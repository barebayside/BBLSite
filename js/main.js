/* BBL — Scroll reveals + Count-up animations */

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('revealed');
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Count-up numbers
function countUp(el) {
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  if (el.dataset.static === 'true') return;
  const start = performance.now();
  (function update(now) {
    const progress = Math.min((now - start) / 1500, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  })(start);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      countUp(entry.target);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

// Mobile menu toggle
function toggleMenu() {
  document.querySelector('.mobile-menu').classList.toggle('open');
}

// Theme toggle (dark/light)
(function() {
  var saved = localStorage.getItem('bbl-theme');
  if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light');

  var btn = document.getElementById('theme-toggle');
  var mobileBtn = document.getElementById('mobile-theme-toggle');

  function updateLabels() {
    var isLight = document.documentElement.getAttribute('data-theme') === 'light';
    var label = isLight ? '\u2600 LIGHT' : '\u263D DARK';
    if (btn) btn.textContent = label;
    if (mobileBtn) mobileBtn.textContent = isLight ? '\u2600 SWITCH TO DARK' : '\u263D SWITCH TO LIGHT';
  }

  function toggle() {
    var isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('bbl-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('bbl-theme', 'light');
    }
    updateLabels();
  }

  if (btn) btn.addEventListener('click', toggle);
  if (mobileBtn) mobileBtn.addEventListener('click', toggle);
  updateLabels();
})();

// Blog table of contents — auto-generated from headings
(function() {
  const article = document.querySelector('.article-main');
  const tocContainer = document.getElementById('toc-container');
  if (!article || !tocContainer) return;

  const skipTexts = ['KEY TAKEAWAYS', 'RELATED ARTICLES', 'COMMON QUESTIONS'];
  const headings = article.querySelectorAll('h2, h3');
  const tocLinks = [];

  headings.forEach(function(heading) {
    var text = heading.textContent.trim();
    if (skipTexts.indexOf(text) !== -1) return;
    if (heading.closest('.surface-cta')) return;

    var id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    heading.id = id;

    var link = document.createElement('a');
    link.href = '#' + id;
    link.className = 'toc-link' + (heading.tagName === 'H3' ? ' toc-link-h3' : '');
    link.textContent = text.length > 45 ? text.substring(0, 42) + '...' : text;
    link.addEventListener('click', function(e) {
      e.preventDefault();
      heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    tocContainer.appendChild(link);
    tocLinks.push({ link: link, heading: heading });
  });

  if (tocLinks.length === 0) { tocContainer.style.display = 'none'; return; }

  // Scroll spy
  var currentActive = null;
  var scrollSpy = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        if (currentActive) currentActive.classList.remove('active');
        var match = tocLinks.find(function(t) { return t.heading === entry.target; });
        if (match) { match.link.classList.add('active'); currentActive = match.link; }
      }
    });
  }, { rootMargin: '-80px 0px -60% 0px', threshold: 0 });

  tocLinks.forEach(function(t) { scrollSpy.observe(t.heading); });
})();

// How It Works — toggle individual steps
document.querySelectorAll('.hiw-card-header').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var step = this.closest('.hiw-step');
    var isExpanded = step.classList.contains('expanded');
    step.classList.toggle('expanded');
    this.setAttribute('aria-expanded', String(!isExpanded));
    step.querySelector('.hiw-step-detail').setAttribute('aria-hidden', String(isExpanded));
  });
});

// How It Works — timeline scroll fill
(function() {
  var track = document.querySelector('.hiw-timeline-track');
  var fill = document.querySelector('.hiw-timeline-fill');
  if (!track || !fill) return;
  var ticking = false;
  function updateFill() {
    var rect = track.getBoundingClientRect();
    var trigger = window.innerHeight * 0.6;
    var progress = (trigger - rect.top) / rect.height;
    fill.style.height = Math.max(0, Math.min(100, progress * 100)) + '%';
    ticking = false;
  }
  window.addEventListener('scroll', function() {
    if (!ticking) { requestAnimationFrame(updateFill); ticking = true; }
  }, { passive: true });
  updateFill();
})();

// How It Works — node activation on scroll
(function() {
  var nodes = document.querySelectorAll('.hiw-node');
  if (!nodes.length) return;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) { entry.target.classList.add('active'); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.5, rootMargin: '0px 0px -20% 0px' });
  nodes.forEach(function(n) { obs.observe(n); });
})();
