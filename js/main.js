// Scroll-triggered fade-ins via Intersection Observer
(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  // Stagger grid items (e.g. project cards) by 0.1s per item, based on their
  // order among reveal-enabled siblings (cards already visible on load are
  // excluded from the grid entirely, so this only covers rows still animating).
  const staggerGroups = new Map();
  document.querySelectorAll('.projects-grid').forEach((grid) => {
    const revealChildren = Array.from(grid.children).filter((child) => child.classList.contains('reveal'));
    revealChildren.forEach((child, index) => {
      staggerGroups.set(child, index * 0.1);
    });
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = staggerGroups.get(el) || 0;
        el.style.transitionDelay = `${delay}s`;
        el.classList.add('is-visible');
        obs.unobserve(el);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  // Elements already in the viewport on page load should never be hidden —
  // skip the fade-in treatment for them entirely instead of animating in place.
  revealEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
    if (isInViewport) {
      el.classList.remove('reveal');
    } else {
      observer.observe(el);
    }
  });
})();
