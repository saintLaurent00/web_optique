(() => {
  'use strict';

  const finishLoader = () => {
    const el = document.getElementById('loader');
    if (el) el.classList.add('done');
  };

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

  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');

  burger?.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileMenu?.classList.toggle('open');
    document.body.style.overflow = mobileMenu?.classList.contains('open') ? 'hidden' : '';
  });

  document.querySelectorAll('a[data-link]').forEach((link) => {
    link.addEventListener('click', () => {
      burger?.classList.remove('open');
      mobileMenu?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();
