(function () {
  const DURATION = 500;

  function hideLoader() {
    const loaderEl = document.getElementById('loader');
    if (loaderEl) loaderEl.classList.add('hidden');
    const activePage = document.querySelector('.page.active');
    if (activePage) activePage.classList.add('visible');

    // footer year
    const y = document.getElementById('current-year');
    if (y) y.textContent = new Date().getFullYear();
  }

  function showLoader() {
    const loaderEl = document.getElementById('loader');
    if (loaderEl) loaderEl.classList.remove('hidden');
  }

  // On normal load
  window.addEventListener('load', function () {
    showLoader();
    setTimeout(hideLoader, DURATION);
  });

  // On back/forward navigation (bfcache restore), load may NOT fire.
  window.addEventListener('pageshow', function (e) {
    // If coming from bfcache, ensure loader ends up hidden quickly.
    if (e.persisted) {
      // Optionally show briefly then hide, or just hide immediately:
      // showLoader(); setTimeout(hideLoader, 50);
      hideLoader();
    }
  });

  // (Optional) smart Back to Projects
  (function () {
    const btn = document.getElementById('backBtn');
    if (!btn) return;

    try {
      const ref = document.referrer;
      const sameOriginReferrer = ref && new URL(ref).origin === location.origin;

      if (sameOriginReferrer) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          history.back();
        });
      }
    } catch {
      // ignore referrer URL parse errors
    }
  })();
})();
