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
