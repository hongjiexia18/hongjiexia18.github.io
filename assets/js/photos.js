(() => {
  const root = document.querySelector('[data-photo-journal]');
  if (!root) return;
  const cards = [...root.querySelectorAll('.photo-card')];
  const count = root.querySelector('[data-photo-count]');
  const empty = root.querySelector('[data-photo-empty]');
  const lightbox = document.querySelector('[data-photo-lightbox]');
  const lightboxImage = lightbox?.querySelector('[data-photo-lightbox-image]');
  let active = { subjects: 'all', locations: 'all' };
  let lastTrigger = null;

  const matches = (card, group, value) => value === 'all' || (card.dataset[group] || '').split(',').includes(value);
  const render = () => {
    let visible = 0;
    cards.forEach((card) => {
      const show = matches(card, 'subjects', active.subjects) && matches(card, 'locations', active.locations);
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (count) count.textContent = `${String(visible).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')} 张作品`;
    if (empty) empty.hidden = visible > 0;
  };
  root.querySelectorAll('[data-filter-group]').forEach((group) => {
    const key = group.dataset.filterGroup;
    group.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => {
      active[key] = button.dataset.filter;
      group.querySelectorAll('[data-filter]').forEach((item) => {
        const selected = item === button;
        item.classList.toggle('is-active', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      render();
    }));
  });

  const close = () => {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.style.overflow = '';
    lastTrigger?.focus();
  };
  cards.forEach((card) => card.querySelector('[data-photo-open]')?.addEventListener('click', (event) => {
    const image = card.querySelector('img');
    if (!lightbox || !lightboxImage || !image) return;
    lastTrigger = event.currentTarget;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('[data-photo-close]')?.focus();
  }));
  lightbox?.querySelector('[data-photo-close]')?.addEventListener('click', close);
  lightbox?.addEventListener('click', (event) => { if (event.target === lightbox) close(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });

  const observer = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { rootMargin: '0px 0px -8% 0px' }) : null;
  cards.forEach((card, index) => {
    if (observer) { card.style.transitionDelay = `${Math.min(index * 45, 500)}ms`; observer.observe(card); } else card.classList.add('is-visible');
  });
  render();
})();
