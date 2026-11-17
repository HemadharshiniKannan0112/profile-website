(function () {
  'use strict';

  document.documentElement.classList.add('js-ready');

  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');

  function closeMenu() {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  const revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }
  
  document.querySelectorAll('.show-more').forEach((button) => {
    const target = document.getElementById(button.getAttribute('aria-controls'));

    button.addEventListener('click', () => {
      target.hidden = !target.hidden;
      const isOpen = !target.hidden;
      button.setAttribute('aria-expanded', String(isOpen));
      button.textContent = isOpen ? 'Show less' : 'Show more';
    });
  });
  
  document.querySelectorAll('.flip-card').forEach((card) => {
    const flip = () => {
      const isFlipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', String(isFlipped));
    };

    card.addEventListener('click', flip);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        flip();
      }
    });
  });
})();