const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');
const links = document.querySelectorAll('.nav-link');

function toggleMenu() {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
  navOverlay.classList.toggle('active');
  document.body.style.overflow = navLinks.classList.contains('active')
    ? 'hidden'
    : '';
}

hamburger.addEventListener('click', toggleMenu);
navOverlay.addEventListener('click', toggleMenu);

function handleNavClick(event, section, projectPage=false) {
  if (!projectPage) event.preventDefault();

  // Close mobile menu if open
  if (navLinks.classList.contains('active')) {
    toggleMenu();
  }

  // Update active link
  links.forEach((link) => link.classList.remove('active'));
  event.target.classList.add('active');

  // Scroll to top for home, otherwise scroll to section
  if (section === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    const target = document.getElementById(section);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

function navigateTo(section) {
  if (navLinks.classList.contains('active')) {
    toggleMenu();
  }

  if (section === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    const target = document.getElementById(section);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

// Close menu on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('active')) {
    toggleMenu();
  }
});
