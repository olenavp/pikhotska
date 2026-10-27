/**
 * Scrollspy module for single-page navigation.
 * Dynamically highlights the active menu link based on viewport scroll position.
 */
export function initScrollspy() {
  const navLinks = Array.from(document.querySelectorAll('.main-nav__link[href^="#"]'));
  if (!navLinks.length) return;

  const sectionItems = navLinks
    .map(link => {
      const id = link.getAttribute('href').slice(1);
      const section = document.getElementById(id);
      return section ? { id, link, section } : null;
    })
    .filter(Boolean);

  if (!sectionItems.length) return;

  const ACTIVATION_OFFSET = 120; // 60px header + 60px threshold

  function updateActiveLink() {
    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // If reached bottom of the page, activate the last menu item
    if (windowHeight + scrollY >= documentHeight - 50) {
      setActive(sectionItems[sectionItems.length - 1].link);
      return;
    }

    // Find the latest section that has reached the activation line
    let activeItem = null;
    for (let i = 0; i < sectionItems.length; i++) {
      const item = sectionItems[i];
      const rect = item.section.getBoundingClientRect();
      if (rect.top <= ACTIVATION_OFFSET) {
        activeItem = item;
      } else {
        break;
      }
    }

    if (activeItem) {
      setActive(activeItem.link);
    } else {
      // User is at the top of the page (Hero section)
      clearActive();
    }
  }

  function setActive(activeLink) {
    navLinks.forEach(link => {
      if (link === activeLink) {
        link.classList.add('main-nav__link--current');
      } else {
        link.classList.remove('main-nav__link--current');
      }
    });
  }

  function clearActive() {
    navLinks.forEach(link => link.classList.remove('main-nav__link--current'));
  }

  // Smooth click interaction
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      setActive(link);
    });
  });

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Initial check once DOM and layout are ready
  updateActiveLink();
  window.addEventListener('load', updateActiveLink, { once: true });
}
