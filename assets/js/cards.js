// assets/js/cards.js
function showLoaderThenGo(url) {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.classList.remove('hidden'); // show immediately
    // Force a reflow so the browser paints the loader before navigating
    // eslint-disable-next-line no-unused-expressions
    loader.offsetHeight;
    // Give the UI one paint frame, then navigate
    requestAnimationFrame(() => {
      window.location.href = url;
    });
  } else {
    window.location.href = url;
  }
}

// Click/keyboard handler for cards
document.addEventListener('click', (e) => {
  const card = e.target.closest('.project-card[data-href]');
  if (!card) return;
  const url = card.getAttribute('data-href');
  if (url) {
    e.preventDefault();
    showLoaderThenGo(url);
  }
});

document.addEventListener('keydown', (e) => {
  const card = e.target.closest('.project-card[data-href]');
  if (!card) return;
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    const url = card.getAttribute('data-href');
    if (url) showLoaderThenGo(url);
  }
});
