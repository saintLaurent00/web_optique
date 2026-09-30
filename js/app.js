(() => {
  'use strict';

  const TRANSITION_KEY = 'web-optique-page-transition';
  const TRANSITION_MS = 560;

  const loader = document.getElementById('loader');
  const finishLoader = () => {
    if (loader) loader.classList.add('done');
  };

  const cameFromTransition = sessionStorage.getItem(TRANSITION_KEY) === '1';

  if (cameFromTransition) {
    sessionStorage.removeItem(TRANSITION_KEY);
    requestAnimationFrame(() => finishLoader());
  } else {
    const loaderPercent = document.getElementById('loaderPercent');
    if (loaderPercent) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 8;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        loaderPercent.textContent = String(Math.floor(progress)).padStart(2, '0');
      }, 60);
    }

    window.addEventListener('load', () => setTimeout(finishLoader, 450), { once: true });
    setTimeout(finishLoader, 1800);
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
      sessionStorage.setItem(TRANSITION_KEY, '1');
      transition.classList.remove('active');
      void transition.offsetWidth;
      transition.classList.add('active');

      window.setTimeout(() => {
        window.location.href = url.href;
      }, TRANSITION_MS);
    });
  });
})();