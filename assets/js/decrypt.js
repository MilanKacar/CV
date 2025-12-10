(function () {
  const isMobile = window.matchMedia('(max-width: 767px)').matches;

  const parseBool = (v, f = false) =>
    v == null ? f : String(v).toLowerCase() === 'true';
  const parseIntSafe = (v, f) => {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : f;
  };

  function attachDecryptedText(el, opts = {}) {
    const text = opts.text ?? el.dataset.text ?? el.textContent ?? '';
    const speed = parseIntSafe(opts.speed ?? el.dataset.speed, 50);
    const maxIterations = parseIntSafe(
      opts.maxIterations ?? el.dataset.maxIterations,
      10
    );
    const sequential = parseBool(
      opts.sequential ?? el.dataset.sequential,
      false
    );
    const revealDirection = (
      opts.revealDirection ??
      el.dataset.revealDirection ??
      'start'
    ).toLowerCase();
    const useOriginalCharsOnly = parseBool(
      opts.useOriginalCharsOnly ?? el.dataset.useOriginalCharsOnly,
      false
    );
    const characters =
      opts.characters ??
      el.dataset.characters ??
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+';
    const animateOn = (
      opts.animateOn ??
      el.dataset.animateOn ??
      'hover'
    ).toLowerCase(); // 'hover' | 'view' | 'both' | 'load'

    const baseDelay = parseIntSafe(opts.delay ?? el.dataset.delay, 0);

    // build
    el.textContent = '';
    const wrapper = document.createElement('span');
    wrapper.className = 'decrypted-wrapper';
    const srOnly = document.createElement('span');
    srOnly.className = 'visually-hidden';
    srOnly.textContent = text;
    const visible = document.createElement('span');
    visible.setAttribute('aria-hidden', 'true');
    wrapper.appendChild(srOnly);
    wrapper.appendChild(visible);
    el.appendChild(wrapper);

    let displayText = text;
    let isHovering = false;
    let isScrambling = false;
    let revealed = new Set();
    let hasAnimated = false;
    let interval = null;
    let currentIteration = 0;

    const availableChars = useOriginalCharsOnly
      ? Array.from(new Set(text.split(''))).filter((c) => c !== ' ')
      : characters.split('');

    function renderVisible() {
      visible.innerHTML = '';
      for (let i = 0; i < displayText.length; i++) {
        const span = document.createElement('span');
        const revealedOrDone = revealed.has(i) || !isScrambling || !isHovering;
        span.className = revealedOrDone ? 'dec-revealed' : 'dec-encrypted';
        span.textContent = displayText[i];
        visible.appendChild(span);
      }
    }

    function getNextIndex(revealedSet) {
      const len = text.length;
      switch (revealDirection) {
        case 'start':
          return revealedSet.size;
        case 'end':
          return len - 1 - revealedSet.size;
        case 'center': {
          const middle = Math.floor(len / 2);
          const offset = Math.floor(revealedSet.size / 2);
          const nextIdx =
            revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;
          if (nextIdx >= 0 && nextIdx < len && !revealedSet.has(nextIdx))
            return nextIdx;
          for (let i = 0; i < len; i++) if (!revealedSet.has(i)) return i;
          return 0;
        }
        default:
          return revealedSet.size;
      }
    }

    function shuffleText(original, revealedSet) {
      if (useOriginalCharsOnly) {
        const positions = original.split('').map((ch, i) => ({
          ch,
          i,
          isSpace: ch === ' ',
          isRevealed: revealedSet.has(i),
        }));
        const pool = positions
          .filter((p) => !p.isSpace && !p.isRevealed)
          .map((p) => p.ch);
        for (let i = pool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        let k = 0;
        return positions
          .map((p) =>
            p.isSpace
              ? ' '
              : p.isRevealed
              ? original[p.i]
              : pool[k++] ?? original[p.i]
          )
          .join('');
      } else {
        return original
          .split('')
          .map((ch, i) => {
            if (ch === ' ') return ' ';
            if (revealedSet.has(i)) return original[i];
            return availableChars[
              Math.floor(Math.random() * availableChars.length)
            ];
          })
          .join('');
      }
    }

    function startScramble() {
      if (interval) clearInterval(interval);
      isScrambling = true;
      currentIteration = 0;
      interval = setInterval(() => {
        if (sequential) {
          if (revealed.size < text.length) {
            const idx = getNextIndex(revealed);
            revealed.add(idx);
            displayText = shuffleText(text, revealed);
            renderVisible();
          } else {
            stopScramble();
          }
        } else {
          displayText = shuffleText(text, revealed);
          renderVisible();
          currentIteration++;
          if (currentIteration >= maxIterations) {
            displayText = text;
            stopScramble();
          }
        }
      }, speed);
    }

    function stopScramble() {
      if (interval) clearInterval(interval);
      interval = null;
      isScrambling = false;
      renderVisible();
    }

    function reset() {
      displayText = text;
      revealed = new Set();
      isScrambling = false;
      renderVisible();
    }

    // initial render
    renderVisible();

    // HOVER
    if (animateOn === 'hover' || animateOn === 'both' || animateOn === 'load') {
      wrapper.addEventListener('mouseenter', () => {
        isHovering = true;
        startScramble();
      });
      wrapper.addEventListener('mouseleave', () => {
        isHovering = false;
        reset();
      });
    }

    // VIEW (IntersectionObserver)
    if (animateOn === 'view' || animateOn === 'both') {
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && !hasAnimated) {
              hasAnimated = true;
              isHovering = true; // reuse same path
              setTimeout(startScramble, baseDelay); // respect data-delay on view too
            }
          }
        },
        { root: null, rootMargin: '0px', threshold: 0.1 }
      );
      io.observe(wrapper);
    }

    // LOAD — start as soon as we initialize (we'll init after loader hides)
    if (animateOn === 'load') {
      setTimeout(startScramble, baseDelay);
    }

    return {
      destroy() {
        if (interval) clearInterval(interval);
      },
    };
  }

  function attachAllOnce(root = document) {
    if (isMobile) {
      root.querySelectorAll('.decrypted').forEach((el) => {
        el.classList.remove('decrypted');
      });
      return;
    }

    // Desktop / tablet → normal behavior
    root.querySelectorAll('.decrypted').forEach((el) => {
      if (el.dataset.decInit === '1') return; // guard against double-wrapping
      attachDecryptedText(el);
      el.dataset.decInit = '1';
    });
  }

  // keep your original export name
  window.attachDecryptedText = attachDecryptedText;
  // add helper used by MAIN SCRIPT
  window.DecryptedText = {
    attachAllOnce,
    attach: attachDecryptedText,
  };
})();
