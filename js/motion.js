/* =========================================================
   Precision in Motion
   Progressive enhancement layer for web_optique
   ========================================================= */

(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarsePointer = window.matchMedia('(hover: none), (pointer: coarse)');

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

  function revealEngine() {
    const targets = qsa('.reveal, .reveal-up, .reveal-left, .reveal-right, .motion-reveal, .motion-stagger');

    if (!targets.length) return;

    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

    targets.forEach(el => observer.observe(el));
  }

  function addSemanticRevealHooks() {
    const selectors = [
      '.section-title',
      '.section-heading',
      '.about-content',
      '.about-visual',
      '.service-card',
      '.pathology-card',
      '.tech-card',
      '.timeline-item',
      '.faq-item',
      '.contact-item'
    ];

    selectors.forEach(selector => {
      qsa(selector).forEach(el => {
        if (!el.classList.contains('reveal') &&
            !el.classList.contains('reveal-up') &&
            !el.classList.contains('reveal-left') &&
            !el.classList.contains('reveal-right') &&
            !el.classList.contains('motion-reveal')) {
          el.classList.add('motion-reveal');
        }
      });
    });
  }

  function headerMotion() {
    const header = qs('.header');
    if (!header) return;

    let ticking = false;

    const update = () => {
      header.classList.toggle('scrolled', window.scrollY > 32);
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    update();
  }

  function scrollProgress() {
    const bar = qs('.progress-bar');
    if (!bar) return;

    let ticking = false;

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.width = (progress * 100) + '%';
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    update();
  }

  function heroIris() {
    if (reduceMotion.matches || coarsePointer.matches) return;

    const iris = qs('.hero-iris, .iris, .hero-eye');
    const pupil = qs('.hero-pupil, .iris-pupil, .pupil');

    if (!iris || !pupil) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let raf = 0;

    const move = (event) => {
      const rect = iris.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width - .5) * 2;
      const ny = ((event.clientY - rect.top) / rect.height - .5) * 2;

      targetX = Math.max(-1, Math.min(1, nx));
      targetY = Math.max(-1, Math.min(1, ny));
    };

    const render = () => {
      currentX += (targetX - currentX) * .08;
      currentY += (targetY - currentY) * .08;

      const px = currentX * 9;
      const py = currentY * 9;
      pupil.style.transform = 'translate(' + px + 'px,' + py + 'px)';

      raf = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', move, { passive: true });
    raf = requestAnimationFrame(render);

    window.addEventListener('beforeunload', () => cancelAnimationFrame(raf), { once: true });
  }

  function magneticCursor() {
    if (reduceMotion.matches || coarsePointer.matches) return;

    const ring = qs('.cursor-ring');
    const dot = qs('.cursor-dot');
    if (!ring && !dot) return;

    qsa('a, button, .slot, .calendar-day').forEach(el => {
      el.addEventListener('mouseenter', () => ring && ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring && ring.classList.remove('hover'));
    });
  }

  function timelineMotion() {
    const line = qs('.timeline-line');
    const nodes = qsa('.timeline-node');

    if (!line && !nodes.length) return;

    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      line && line.classList.add('is-active');
      nodes.forEach(n => n.classList.add('is-active'));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        line && line.classList.add('is-active');

        nodes.forEach((node, index) => {
          window.setTimeout(() => node.classList.add('is-active'), index * 120);
        });

        observer.disconnect();
      });
    }, { threshold: .25 });

    const root = line || nodes[0];
    observer.observe(root);
  }

  function technologyScanner() {
    const targets = qsa('.technology-scan, .tech-scan, .scanner-line');
    if (!targets.length) return;

    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('is-scanning'));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-scanning');
        observer.unobserve(entry.target);
      });
    }, { threshold: .25 });

    targets.forEach(el => observer.observe(el));
  }

  function pathologyFocus() {
    qsa('.pathology-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        qsa('.pathology-card.is-focused').forEach(other => {
          if (other !== card) other.classList.remove('is-focused');
        });
        card.classList.add('is-focused');
      });

      card.addEventListener('mouseleave', () => card.classList.remove('is-focused'));
      card.addEventListener('focusin', () => card.classList.add('is-focused'));
      card.addEventListener('focusout', () => card.classList.remove('is-focused'));
    });
  }

  function bookingMotion() {
    const container = qs('#booking, .booking');
    if (!container) return;

    const observer = new MutationObserver(() => {
      qsa('.slot, .calendar-day', container).forEach(el => {
        if (el.dataset.motionBound) return;
        el.dataset.motionBound = 'true';

        el.addEventListener('click', () => {
          el.animate(
            [
              { transform: 'scale(1)' },
              { transform: 'scale(.97)' },
              { transform: 'scale(1)' }
            ],
            { duration: 220, easing: 'cubic-bezier(.16,1,.3,1)' }
          );
        });
      });
    });

    observer.observe(container, { childList: true, subtree: true });
  }

  function pageTransition() {
    const loader = qs('.loader');
    if (!loader) return;

    const finish = () => loader.classList.add('done');

    if (document.readyState === 'complete') {
      window.setTimeout(finish, 350);
    } else {
      window.addEventListener('load', () => window.setTimeout(finish, 350), { once: true });
    }
  }

  function init() {
    addSemanticRevealHooks();
    revealEngine();
    headerMotion();
    scrollProgress();
    heroIris();
    magneticCursor();
    timelineMotion();
    technologyScanner();
    pathologyFocus();
    bookingMotion();
    pageTransition();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
