// assets/js/modal.js
(function () {
  const modal = document.getElementById('codeModal');
  if (!modal) return;

  const focusable =
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let lastFocused = null;

  function openModal() {
    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    // focus first interactive
    const first = modal.querySelector(focusable);
    if (first) first.focus();
    document.addEventListener('keydown', onKeyDown);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', onKeyDown);
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
      return;
    }
    // Basic focus trap
    if (e.key === 'Tab') {
      const nodes = Array.from(modal.querySelectorAll(focusable)).filter(
        (el) => el.offsetParent !== null
      );
      if (!nodes.length) return;
      const first = nodes[0],
        last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  // Delegated open
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-view-code]');
    if (trigger) {
      e.preventDefault();
      openModal();
    }
  });

  // Close interactions
  modal.addEventListener('click', (e) => {
    if (
      e.target.matches('[data-close]') ||
      e.target === modal.querySelector('.mk-modal__backdrop')
    ) {
      closeModal();
    }
  });
})();
