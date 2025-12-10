// Function to open the lightbox with smooth animation
function openLightbox(imgElement) {
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('expandedImg');

  // Add loading class
  modalImg.classList.add('loading');

  // Show modal
  modal.classList.add('active');
  modal.style.display = 'flex';

  // Set image source and alt text
  modalImg.src = imgElement.src;
  modalImg.alt = imgElement.alt || 'Expanded image';

  // Remove loading class once image loads
  modalImg.onload = function () {
    modalImg.classList.remove('loading');
  };

  // Disable scrolling on background
  document.body.style.overflow = 'hidden';

  // Add smooth fade-in
  setTimeout(() => {
    modal.style.opacity = '1';
  }, 10);
}

// Function to close the lightbox with smooth animation
function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('expandedImg');

  // Fade out animation
  modal.style.opacity = '0';

  // Wait for animation then hide
  setTimeout(() => {
    modal.classList.remove('active');
    modal.style.display = 'none';
    modalImg.src = '';

    // Re-enable scrolling
    document.body.style.overflow = 'auto';
  }, 300);
}

// Close when clicking outside the image (on the backdrop)
document
  .getElementById('lightboxModal')
  ?.addEventListener('click', function (e) {
    // Close if clicking the modal backdrop or the image itself
    if (
      e.target === this ||
      e.target.classList.contains('image-modal-content')
    ) {
      closeLightbox();
    }
  });

// Close on Escape key
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' || event.key === 'Esc') {
    const modal = document.getElementById('lightboxModal');
    if (modal && modal.classList.contains('active')) {
      closeLightbox();
    }
  }
});

// Prevent context menu on images in lightbox
document
  .getElementById('expandedImg')
  ?.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    return false;
  });

// Optional: Add keyboard navigation for gallery images
document.addEventListener('keydown', function (event) {
  const modal = document.getElementById('lightboxModal');
  if (!modal || !modal.classList.contains('active')) return;

  const allImages = document.querySelectorAll(
    '.project-hero-image img, .project-gallery img'
  );
  const modalImg = document.getElementById('expandedImg');
  let currentIndex = -1;

  // Find current image index
  allImages.forEach((img, index) => {
    if (img.src === modalImg.src) {
      currentIndex = index;
    }
  });

  // Navigate with arrow keys
  if (event.key === 'ArrowRight' && currentIndex < allImages.length - 1) {
    openLightbox(allImages[currentIndex + 1]);
  } else if (event.key === 'ArrowLeft' && currentIndex > 0) {
    openLightbox(allImages[currentIndex - 1]);
  }
});
