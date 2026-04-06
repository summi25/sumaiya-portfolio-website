const revealItems = document.querySelectorAll('.reveal');
const counterItems = document.querySelectorAll('[data-counter]');
const lightboxButtons = document.querySelectorAll('[data-lightbox-src]');
const lightbox = document.getElementById('lightbox');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const element = entry.target;
      const target = Number(element.dataset.counter);
      const startTime = performance.now();
      const duration = 1000;

      const step = (time) => {
        const progress = Math.min((time - startTime) / duration, 1);
        const current = Math.floor(progress * target);
        element.textContent = target === 100 ? `${current}%` : `${current}+`;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          element.textContent = target === 100 ? `${target}%` : `${target}+`;
        }
      };

      requestAnimationFrame(step);
      counterObserver.unobserve(element);
    });
  },
  { threshold: 0.45 }
);

counterItems.forEach((item) => counterObserver.observe(item));

function closeLightbox() {
  lightbox.hidden = true;
  lightboxTitle.textContent = '';
  lightboxImage.src = '';
  lightboxImage.alt = '';
  document.body.style.overflow = '';
}

lightboxButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    lightbox.hidden = false;
    lightboxTitle.textContent = button.dataset.lightboxTitle;
    lightboxImage.src = button.dataset.lightboxSrc;
    lightboxImage.alt = button.dataset.lightboxTitle;
    document.body.style.overflow = 'hidden';
  });
});

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !lightbox.hidden) {
    closeLightbox();
  }
});
