/* Purity Testing Centre — progressive enhancement only.
   Every section works with JavaScript disabled; this file adds the extras. */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Header shadow on scroll ---------- */
const header = document.getElementById('site-header');

if (header) {
  const setHeaderState = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });
}

/* ---------- Mobile navigation ---------- */
const navToggle = document.getElementById('nav-toggle');
const nav = document.getElementById('site-nav');

if (navToggle && nav) {
  const closeNav = () => {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  };

  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeNav();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      closeNav();
      navToggle.focus();
    }
  });
}

/* ---------- Active section in the navigation ---------- */
const navLinks = Array.from(document.querySelectorAll('.nav-list a[href^="#"]'));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && sections.length) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach((section) => spy.observe(section));
}

/* ---------- Purity guide tabs ---------- */
const tabs = Array.from(document.querySelectorAll('.purity-tab'));
const karatEl = document.getElementById('purity-karat');
const percentEl = document.getElementById('purity-percent');
const textEl = document.getElementById('purity-text');
const fillEl = document.getElementById('purity-fill');
const meterValueEl = document.getElementById('purity-meter-value');
const panelEl = document.getElementById('purity-panel');

const selectTab = (tab, { focus = false } = {}) => {
  tabs.forEach((item) => {
    const isActive = item === tab;
    item.classList.toggle('is-active', isActive);
    item.setAttribute('aria-selected', String(isActive));
    item.tabIndex = isActive ? 0 : -1;
  });

  const { karat, percent, text } = tab.dataset;
  if (karatEl) karatEl.textContent = karat;
  if (percentEl) percentEl.textContent = percent;
  if (textEl) textEl.textContent = text;
  if (meterValueEl) meterValueEl.textContent = `${percent}%`;
  if (fillEl) fillEl.style.setProperty('--fill', `${percent}%`);
  if (panelEl) panelEl.setAttribute('aria-labelledby', tab.id);
  if (focus) tab.focus();
};

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));

  tab.addEventListener('keydown', (event) => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (step) {
      event.preventDefault();
      selectTab(tabs[(index + step + tabs.length) % tabs.length], { focus: true });
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      selectTab(event.key === 'Home' ? tabs[0] : tabs[tabs.length - 1], { focus: true });
    }
  });
});

/* ---------- Scroll reveal ---------- */
const revealables = Array.from(document.querySelectorAll('.reveal'));

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealables.forEach((el) => el.classList.add('is-visible'));
} else {
  const revealer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

  revealables.forEach((el) => revealer.observe(el));
}

/* ---------- Footer year ---------- */
const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
