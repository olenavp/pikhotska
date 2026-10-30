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

  const ACTIVATION_OFFSET = 120;

  function updateActiveLink() {
    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (windowHeight + scrollY >= documentHeight - 50) {
      setActive(sectionItems[sectionItems.length - 1].link);
      return;
    }

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

  updateActiveLink();
  window.addEventListener('load', updateActiveLink, { once: true });
}
