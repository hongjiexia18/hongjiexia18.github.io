(function () {
  var root = document.querySelector('[data-photo-journal]');
  if (!root) return;
  var cards = Array.prototype.slice.call(root.querySelectorAll('.photo-card'));
  var count = root.querySelector('[data-photo-count]');
  var empty = root.querySelector('[data-photo-empty]');
  var lightbox = document.querySelector('[data-photo-lightbox]');
  var lightboxImage = lightbox ? lightbox.querySelector('[data-photo-lightbox-image]') : null;
  var active = { subjects: 'all', locations: 'all' };
  var lastTrigger = null;

  function matches(card, group, value) {
    if (value === 'all') return true;
    var values = (card.getAttribute('data-' + group) || '').split(',');
    return values.indexOf(value) !== -1;
  }

  function render() {
    var visible = 0;
    cards.forEach(function (card) {
      var show = matches(card, 'subjects', active.subjects) && matches(card, 'locations', active.locations);
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (count) count.textContent = (visible < 10 ? '0' : '') + visible + ' / ' + (cards.length < 10 ? '0' : '') + cards.length + ' 张作品';
    if (empty) empty.hidden = visible > 0;
  }

  Array.prototype.forEach.call(root.querySelectorAll('[data-filter-group]'), function (group) {
    var key = group.getAttribute('data-filter-group');
    Array.prototype.forEach.call(group.querySelectorAll('[data-filter]'), function (button) {
      button.addEventListener('click', function () {
        active[key] = button.getAttribute('data-filter');
        Array.prototype.forEach.call(group.querySelectorAll('[data-filter]'), function (item) {
          var selected = item === button;
          item.classList.toggle('is-active', selected);
          item.setAttribute('aria-pressed', String(selected));
        });
        render();
      });
    });
  });

  function close() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lastTrigger) lastTrigger.focus();
  }

  cards.forEach(function (card) {
    var trigger = card.querySelector('[data-photo-open]');
    if (!trigger) return;
    trigger.addEventListener('click', function () {
      var image = card.querySelector('img');
      if (!lightbox || !lightboxImage || !image) return;
      lastTrigger = trigger;
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      var closeButton = lightbox.querySelector('[data-photo-close]');
      if (closeButton) closeButton.focus();
    });
  });

  if (lightbox) {
    var closeButton = lightbox.querySelector('[data-photo-close]');
    if (closeButton) closeButton.addEventListener('click', close);
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) close();
    });
  }
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') close();
  });

  var observer = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px' }) : null;

  cards.forEach(function (card, index) {
    if (observer) {
      card.style.transitionDelay = Math.min(index * 45, 500) + 'ms';
      observer.observe(card);
    } else {
      card.classList.add('is-visible');
    }
  });
  render();
})();
