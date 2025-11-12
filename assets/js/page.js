// assets/js/page.js
window.addEventListener('load', function () {
  const loader = document.getElementById('loader');
  const DURATION = 500;

  if (loader) loader.classList.remove('hidden');

  setTimeout(function () {
    if (loader) loader.classList.add('hidden');

    const activePage = document.querySelector('.page.active');
    if (activePage) activePage.classList.add('visible');

    // (Optional) footer year
    const y = document.getElementById('current-year');
    if (y) y.textContent = new Date().getFullYear();
  }, DURATION);
});

// (Optional) smart Back to Projects
(function () {
  const btn = document.getElementById('backBtn');
  if (!btn) return;
  if (!loader) return;
  try {
    const sameOriginReferrer =
      document.referrer &&
      new URL(document.referrer).origin === location.origin;
    if (sameOriginReferrer) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        history.back();
      });
    }
  } catch {
  }
})();
