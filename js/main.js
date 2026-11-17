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
  
  const galleryButtons = Array.from(document.querySelectorAll('.gallery-btn'));
  const lightbox = document.getElementById('lightbox');
  const stage = document.getElementById('lightbox-stage');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxText = document.getElementById('lightbox-text');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeButton = document.getElementById('lightbox-close');
  let currentIndex = 0;
  let lastFocused = null;

  function showItem(index) {
    currentIndex = (index + galleryButtons.length) % galleryButtons.length;
    const button = galleryButtons[currentIndex];
    const media = button.querySelector('.gallery-media').cloneNode(true);

    stage.replaceChildren(media);
    lightboxTitle.textContent = button.dataset.title || '';
    lightboxText.textContent = button.dataset.text || '';
    lightboxCaption.textContent = button.dataset.caption || '';
  }

  function openLightbox(index) {
    lastFocused = document.activeElement;
    showItem(index);
    lightbox.hidden = false;
    document.body.classList.add('no-scroll');
    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove('no-scroll');
    if (lastFocused) {
      lastFocused.focus();
    }
  }

  galleryButtons.forEach((button, index) => {
    button.addEventListener('click', () => openLightbox(index));
  });

  closeButton.addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev').addEventListener('click', () => showItem(currentIndex - 1));
  document.getElementById('lightbox-next').addEventListener('click', () => showItem(currentIndex + 1));

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (lightbox.hidden) {
      return;
    }
    if (event.key === 'Escape') {
      closeLightbox();
    } else if (event.key === 'ArrowLeft') {
      showItem(currentIndex - 1);
    } else if (event.key === 'ArrowRight') {
      showItem(currentIndex + 1);
    }
  });
  
  const yearElement = document.getElementById('year');

  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }
})();