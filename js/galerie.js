document.addEventListener('DOMContentLoaded', () => {
  const tabs = [...document.querySelectorAll('[data-filter]')];
  const items = [...document.querySelectorAll('.gallery-item')];
  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  let visibleItems = items;
  let currentIndex = 0;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;
      tabs.forEach((entry) => {
        entry.classList.toggle('active', entry === tab);
        entry.setAttribute('aria-selected', String(entry === tab));
      });
      items.forEach((item) => {
        item.hidden = filter !== 'all' && item.dataset.category !== filter;
      });
      visibleItems = items.filter((item) => !item.hidden);
    });
  });

  const show = (index) => {
    if (!visibleItems.length || !lightboxImage) return;
    currentIndex = (index + visibleItems.length) % visibleItems.length;
    const image = visibleItems[currentIndex].querySelector('img');
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
  };
  const close = () => {
    lightbox?.classList.remove('open');
    lightbox?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  items.forEach((item) => {
    item.addEventListener('click', () => {
      visibleItems = items.filter((entry) => !entry.hidden);
      show(visibleItems.indexOf(item));
      lightbox?.classList.add('open');
      lightbox?.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lightbox?.querySelector('.lightbox-close')?.focus();
    });
  });

  lightbox?.querySelector('.lightbox-close')?.addEventListener('click', close);
  lightbox?.querySelector('.lightbox-prev')?.addEventListener('click', () => show(currentIndex - 1));
  lightbox?.querySelector('.lightbox-next')?.addEventListener('click', () => show(currentIndex + 1));
  lightbox?.addEventListener('click', (event) => { if (event.target === lightbox) close(); });
  document.addEventListener('keydown', (event) => {
    if (!lightbox?.classList.contains('open')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') show(currentIndex - 1);
    if (event.key === 'ArrowRight') show(currentIndex + 1);
  });
});
