(() => {
  'use strict';

  const TRANSITION_KEY = 'web-optique-page-transition';
  const TRANSITION_MS = 560;
  let navigating = false;

  const loader = document.getElementById('loader');
  let loaderTimer = null;
  let loaderFallback = null;

  const finishLoader = () => {
    if (loaderTimer) clearTimeout(loaderTimer);
    if (loaderFallback) clearTimeout(loaderFallback);
    if (loader) loader.classList.add('done');
  };

  const cameFromTransition = sessionStorage.getItem(TRANSITION_KEY) === '1';

  if (cameFromTransition) {
    sessionStorage.removeItem(TRANSITION_KEY);
    requestAnimationFrame(finishLoader);
  } else {
    const loaderPercent = document.getElementById('loaderPercent');
    let progressInterval = null;

    if (loaderPercent) {
      let progress = 0;
      progressInterval = setInterval(() => {
        progress = Math.min(100, progress + Math.random() * 12);
        loaderPercent.textContent = String(Math.floor(progress)).padStart(2, '0');
        if (progress >= 100) clearInterval(progressInterval);
      }, 50);
    }

    loaderTimer = setTimeout(finishLoader, 500);
    loaderFallback = setTimeout(finishLoader, 1200);

    if (document.readyState !== 'loading') {
      requestAnimationFrame(() => setTimeout(finishLoader, 180));
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(finishLoader, 180);
      }, { once: true });
    }
  }

  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');

  burger?.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileMenu?.classList.toggle('open');
    document.body.style.overflow = mobileMenu?.classList.contains('open') ? 'hidden' : '';
  });

  document.querySelectorAll('a[data-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      burger?.classList.remove('open');
      mobileMenu?.classList.remove('open');
      document.body.style.overflow = '';

      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:')) return;

      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;

      const transition = document.getElementById('pageTransition');
      if (!transition) return;

      event.preventDefault();
      if (navigating) return;
      navigating = true;
      sessionStorage.setItem(TRANSITION_KEY, '1');
      transition.classList.remove('active');
      void transition.offsetWidth;
      transition.classList.add('active');

      window.setTimeout(() => {
        window.location.assign(url.href);
      }, TRANSITION_MS);
    });
  });
})();