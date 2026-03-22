/**
 * Minimal JS: nav, scroll progress, reveal, counters
 */
(function () {
  'use strict';

  // ── Nav scroll + progress bar ──
  const nav = document.querySelector('.nav');
  const links = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');
  const progressBar = document.getElementById('scroll-progress');

  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 50);

    // Scroll spy
    let current = '';
    sections.forEach((s) => {
      if (y >= s.offsetTop - 120) current = s.id;
    });
    links.forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });

    // Progress bar
    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (y / docHeight) * 100 : 0;
      progressBar.style.width = progress + '%';
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Mobile menu with backdrop ──
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-links');
  const backdrop = document.getElementById('nav-backdrop');

  function closeMenu() {
    toggle.classList.remove('open');
    menu.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        toggle.classList.add('open');
        menu.classList.add('open');
        if (backdrop) backdrop.classList.add('open');
      }
    });

    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
    if (backdrop) backdrop.addEventListener('click', closeMenu);
  }

  // ── Scroll reveal with stagger ──
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );

  // Assign stagger delays to sibling reveal elements
  const groups = {};
  reveals.forEach((el) => {
    const parent = el.parentElement;
    if (!parent) return;
    const key = parent.className || 'root';
    if (!groups[key]) groups[key] = [];
    groups[key].push(el);
  });

  Object.values(groups).forEach((group) => {
    group.forEach((el, i) => {
      if (group.length > 1) {
        el.style.setProperty('--delay', (i * 0.08) + 's');
        el.style.transitionDelay = 'var(--delay)';
      }
      observer.observe(el);
    });
  });

  // ── Counter animation ──
  const counters = document.querySelectorAll('[data-count]');
  const cObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animate(e.target);
          cObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((el) => cObserver.observe(el));

  function animate(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const dur = 1200;
    const start = performance.now();

    (function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.floor(ease * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }

  // ── Year ──
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
