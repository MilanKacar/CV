// Loader
window.addEventListener('load', function () {
  const loader = document.getElementById('loader');

  // Keep loader visible briefly so users can see it
  const DURATION = 500; // ms (adjust to taste)
  const AFTER_LOADER_DELAY = 200; // ✅ decrypt after fade

  // Make sure the loader is actually visible (remove .hidden if present)
  if (loader) loader.classList.remove('hidden');

  setTimeout(function () {
    if (loader) {
      loader.classList.add('hidden'); // fades out using your CSS
    }
    // Reveal the active page (home or project page)
    const activePage = document.querySelector('.page.active');
    if (activePage) {
      activePage.classList.add('visible');
    }

    // ✅ INIT DECRYPT AFTER LOADER IS HIDDEN
    setTimeout(function () {
      if (
        window.DecryptedText &&
        typeof window.DecryptedText.attachAllOnce === 'function'
      ) {
        window.DecryptedText.attachAllOnce(); // runs once per element
      }
    }, AFTER_LOADER_DELAY);
  }, DURATION);
});

// Navigation function
function navigateTo(page, section) {
  const loader = document.getElementById('loader');
  loader.classList.remove('hidden');

  setTimeout(() => {
    // Hide all pages
    document.querySelectorAll('.page').forEach((p) => {
      p.classList.remove('active', 'visible');
    });

    // Show target page
    let targetPage;
    if (page === 'home') {
      targetPage = document.getElementById('homePage');
    } else {
      targetPage = document.getElementById(page + 'Page');
    }

    if (targetPage) {
      targetPage.classList.add('active');
      setTimeout(() => {
        targetPage.classList.add('visible');
        loader.classList.add('hidden');

        // ✅ INIT DECRYPT AFTER LOADER IS HIDDEN (navigation too)
        setTimeout(function () {
          if (
            window.DecryptedText &&
            typeof window.DecryptedText.attachAllOnce === 'function'
          ) {
            window.DecryptedText.attachAllOnce(targetPage); // only new/visible page
          }
        }, 200);

        // Scroll to section if specified
        if (section && page === 'home') {
          setTimeout(() => {
            const sectionEl = document.getElementById(section);
            if (sectionEl) {
              const offsetTop = sectionEl.offsetTop - 80;
              window.scrollTo({
                top: offsetTop,
                behavior: 'smooth',
              });
            }
          }, 100);
        } else {
          window.scrollTo(0, 0);
        }
      }, 100);
    }
  }, 800);
}

// Animate elements on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px',
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document
  .querySelectorAll('.skill-card, .project-card, .timeline-item, .feature-item')
  .forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
  });

document.addEventListener('DOMContentLoaded', () => {
  const currentYear = new Date().getFullYear();
  const years = Math.max(0, currentYear - 2018);
  const yearsExp = document.getElementById('years-exp');
  if (yearsExp) yearsExp.textContent = String(years);
  document.getElementById('current-year').textContent = String(currentYear);
});

(function () {
  const btn = document.querySelector('.nav-toggle');
  const list = document.querySelector('[data-nav]');
  if (!btn || !list) return;

  btn.addEventListener('click', () => {
    const open = list.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // close after click on a link (mobile)
  list.addEventListener('click', (e) => {
    if (e.target.matches('a')) {
      list.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();
