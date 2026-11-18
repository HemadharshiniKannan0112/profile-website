(function () {
  'use strict';

  document.documentElement.classList.add('js-ready');

  /* ---------- Navigation ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  function closeMenu() {
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  /* ---------- Theme button: Lilac > Warm > Dark > Lilac ---------- */
  const THEMES = [
    { id: 'lilac', label: 'Lilac', icon: '\uD83C\uDF38' },
    { id: 'warm', label: 'Warm', icon: '\uD83C\uDF51' },
    { id: 'dark', label: 'Dark', icon: '\uD83C\uDF19' }
  ];
  const THEME_KEY = 'profile-theme';
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themeName = document.getElementById('theme-name');
  let themeIndex = 0;

  function applyTheme(index) {
    const theme = THEMES[index];
    const next = THEMES[(index + 1) % THEMES.length];
    document.documentElement.setAttribute('data-theme', theme.id);
    themeIcon.textContent = theme.icon;
    themeName.textContent = theme.label;
    themeToggle.setAttribute('aria-label', 'Theme: ' + theme.label + '. Press to switch to ' + next.label);
  }

  try {
    const saved = localStorage.getItem(THEME_KEY);
    const found = THEMES.findIndex((theme) => theme.id === saved);
    themeIndex = found >= 0 ? found : 0;
  } catch (error) {
    themeIndex = 0;
  }

  applyTheme(themeIndex);

  themeToggle.addEventListener('click', () => {
    themeIndex = (themeIndex + 1) % THEMES.length;
    applyTheme(themeIndex);

    try {
      localStorage.setItem(THEME_KEY, THEMES[themeIndex].id);
    } catch (error) {
      // Storage may be blocked; the theme still applies for this visit.
    }
  });

  /* ---------- Scroll reveal ---------- */
  const revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  /* ---------- Show more ---------- */
  document.querySelectorAll('.show-more').forEach((button) => {
    const target = document.getElementById(button.getAttribute('aria-controls'));

    button.addEventListener('click', () => {
      target.hidden = !target.hidden;
      button.setAttribute('aria-expanded', String(!target.hidden));
      button.textContent = target.hidden ? 'Show more' : 'Show less';
    });
  });

  /* ---------- Flip cards ---------- */
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

  /* ---------- Interest picture pop-ups ---------- */
  let openPopup = null;
  let popupOpener = null;

  function closePopup() {
    if (!openPopup) {
      return;
    }

    openPopup.hidden = true;
    document.body.style.overflow = '';
    openPopup = null;

    if (popupOpener) {
      popupOpener.focus();
    }
  }

  function showPopup(popup, opener) {
    popupOpener = opener;
    openPopup = popup;
    popup.hidden = false;
    document.body.style.overflow = 'hidden';
    const close = popup.querySelector('.modal-close, .lightbox-close');

    if (close) {
      close.focus();
    }
  }

  document.querySelectorAll('[data-modal]').forEach((button) => {
    button.addEventListener('click', () => {
      showPopup(document.getElementById(button.dataset.modal), button);
    });
  });

  document.querySelectorAll('.modal-close').forEach((button) => {
    button.addEventListener('click', closePopup);
  });

  document.querySelectorAll('.modal').forEach((popup) => {
    popup.addEventListener('click', (event) => {
      if (event.target === popup) {
        closePopup();
      }
    });
  });

  /* ---------- Hobby lightbox ---------- */
  const galleryButtons = Array.from(document.querySelectorAll('.gallery-btn'));
  const lightbox = document.getElementById('lightbox');
  const stage = document.getElementById('lightbox-stage');
  const lightboxTitle = document.getElementById('lightbox-title');
  let currentIndex = 0;

  function showItem(index) {
    currentIndex = (index + galleryButtons.length) % galleryButtons.length;
    const button = galleryButtons[currentIndex];

    stage.replaceChildren(button.querySelector('img').cloneNode(true));
    lightboxTitle.textContent = button.dataset.title || '';
  }

  galleryButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      showItem(index);
      showPopup(lightbox, button);
    });
  });

  document.getElementById('lightbox-close').addEventListener('click', closePopup);
  document.getElementById('lightbox-prev').addEventListener('click', () => showItem(currentIndex - 1));
  document.getElementById('lightbox-next').addEventListener('click', () => showItem(currentIndex + 1));

  document.addEventListener('keydown', (event) => {
    if (!openPopup) {
      return;
    }

    if (event.key === 'Escape') {
      closePopup();
    } else if (openPopup === lightbox && event.key === 'ArrowLeft') {
      showItem(currentIndex - 1);
    } else if (openPopup === lightbox && event.key === 'ArrowRight') {
      showItem(currentIndex + 1);
    }
  });

  /* ---------- More of me feed (photos and short videos) ---------- */
  const feed = document.getElementById('feed');

  if (feed) {
    const slides = Array.from(feed.querySelectorAll('.feed-slide'));
    const count = document.getElementById('feed-count');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let feedIndex = 0;
    let timer = null;

    function showSlide(index) {
      feedIndex = (index + slides.length) % slides.length;

      slides.forEach((slide, position) => {
        const isActive = position === feedIndex;
        const video = slide.querySelector('video');

        slide.classList.toggle('is-active', isActive);

        if (video) {
          if (isActive) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      });

      count.textContent = (feedIndex + 1) + ' / ' + slides.length;
    }

    function stopFeed() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function startFeed() {
      stopFeed();

      if (!reduceMotion) {
        timer = setInterval(() => showSlide(feedIndex + 1), 4500);
      }
    }

    document.getElementById('feed-prev').addEventListener('click', () => {
      showSlide(feedIndex - 1);
      startFeed();
    });

    document.getElementById('feed-next').addEventListener('click', () => {
      showSlide(feedIndex + 1);
      startFeed();
    });

    feed.addEventListener('mouseenter', stopFeed);
    feed.addEventListener('mouseleave', startFeed);
    feed.addEventListener('focusin', stopFeed);
    feed.addEventListener('focusout', startFeed);

    showSlide(0);
    startFeed();
  }

  /* ---------- Footer year ---------- */
  const yearElement = document.getElementById('year');

  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }
})();
