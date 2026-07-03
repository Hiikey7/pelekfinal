import './bootstrap';
import { createIcons, icons } from 'lucide';

window.addEventListener('DOMContentLoaded', () => {
  createIcons({ icons });

  document.querySelectorAll('[data-mobile-menu-button]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelector('[data-mobile-menu]')?.classList.toggle('hidden');
    });
  });

  let logoTimer;
  document.querySelectorAll('[data-admin-logo]').forEach((logo) => {
    const clear = () => window.clearTimeout(logoTimer);
    logo.addEventListener('pointerdown', () => {
      logoTimer = window.setTimeout(() => {
        window.location.href = '/admin/login';
      }, 3000);
    });
    logo.addEventListener('pointerup', clear);
    logo.addEventListener('pointerleave', clear);
    logo.addEventListener('pointercancel', clear);
  });

  document.querySelectorAll('[data-faq-trigger]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      trigger.closest('[data-faq-item]')?.querySelector('[data-faq-panel]')?.classList.toggle('hidden');
    });
  });

  const readWishlist = () => {
    try {
      return JSON.parse(localStorage.getItem('pelek-favorites') || '[]');
    } catch {
      return [];
    }
  };

  const writeWishlist = (items) => {
    localStorage.setItem('pelek-favorites', JSON.stringify(items));
  };

  const syncFavoritesPage = () => {
    const savedItems = readWishlist();
    const cards = document.querySelectorAll('[data-favorite-card]');
    const emptyState = document.querySelector('[data-favorites-empty]');
    const grid = document.querySelector('[data-favorites-grid]');
    let visibleCount = 0;

    cards.forEach((card) => {
      const isSaved = savedItems.includes(card.getAttribute('data-favorite-card'));
      card.classList.toggle('hidden', !isSaved);
      if (isSaved) visibleCount += 1;
    });

    emptyState?.classList.toggle('hidden', visibleCount > 0);
    grid?.classList.toggle('hidden', visibleCount === 0);
  };

  document.querySelectorAll('[data-wishlist-toggle]').forEach((button) => {
    const propertyId = button.getAttribute('data-property-id');
    if (!propertyId) return;
    const isIconButton = button.hasAttribute('data-wishlist-icon');
    const activeClass = button.getAttribute('data-wishlist-active-class') || 'bg-secondary';

    const syncWishlistButton = () => {
      const isSaved = readWishlist().includes(propertyId);
      if (isIconButton) {
        const icon = button.querySelector('svg');
        icon?.classList.toggle('fill-current', isSaved);
        button.setAttribute('aria-label', isSaved ? 'Remove from Wishlist' : 'Add to Wishlist');
      } else {
        button.textContent = isSaved ? 'Added to Wishlist' : 'Add to Wishlist';
      }
      button.classList.toggle(activeClass, isSaved);
      button.classList.toggle('bg-secondary/10', !isSaved && isIconButton);
      button.classList.toggle('text-white', isSaved && activeClass === 'bg-secondary');
      button.classList.toggle('text-secondary', !isSaved || activeClass !== 'bg-secondary');
    };

    button.addEventListener('click', () => {
      const items = readWishlist();
      const nextItems = items.includes(propertyId)
        ? items.filter((item) => item !== propertyId)
        : [...items, propertyId];

      writeWishlist(nextItems);
      syncWishlistButton();
      syncFavoritesPage();
    });

    syncWishlistButton();
  });

  syncFavoritesPage();

  document.querySelectorAll('[data-property-carousel]').forEach((carousel) => {
    const track = carousel.querySelector('[data-property-carousel-track]');
    const slides = Array.from(track?.children || []);
    const previous = carousel.querySelector('[data-property-carousel-prev]');
    const next = carousel.querySelector('[data-property-carousel-next]');
    if (!track || slides.length <= 1) return;

    let index = 0;
    let timer;

    const showSlide = (nextIndex) => {
      index = (nextIndex + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
    };

    const start = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => showSlide(index + 1), 3000);
    };

    previous?.addEventListener('click', () => {
      showSlide(index - 1);
      start();
    });

    next?.addEventListener('click', () => {
      showSlide(index + 1);
      start();
    });

    carousel.addEventListener('mouseenter', () => window.clearInterval(timer));
    carousel.addEventListener('mouseleave', start);
    start();
  });

  const offerPopup = document.querySelector('[data-offer-popup]');
  if (offerPopup && !sessionStorage.getItem('pelek-offer-seen')) {
    window.setTimeout(() => {
      offerPopup.classList.remove('hidden');
      offerPopup.classList.add('flex');
      sessionStorage.setItem('pelek-offer-seen', '1');
    }, 900);
  }

  document.querySelectorAll('[data-offer-close]').forEach((button) => {
    button.addEventListener('click', () => {
      offerPopup?.classList.add('hidden');
      offerPopup?.classList.remove('flex');
    });
  });

  offerPopup?.addEventListener('click', (event) => {
    if (event.target === offerPopup) {
      offerPopup.classList.add('hidden');
      offerPopup.classList.remove('flex');
    }
  });

  document.querySelectorAll('[data-copy-offer]').forEach((button) => {
    button.addEventListener('click', async () => {
      const code = button.getAttribute('data-copy-offer') || '';
      try {
        await navigator.clipboard.writeText(code);
        button.textContent = 'Copied';
      } catch {
        window.prompt('Copy this voucher code', code);
      }
    });
  });

  const offerTypeInputs = document.querySelectorAll('[data-offer-type]');
  const ctaFields = document.querySelector('[data-offer-cta-fields]');
  const promoFields = document.querySelector('[data-offer-promo-fields]');
  const syncOfferFields = () => {
    const selected = document.querySelector('[data-offer-type]:checked')?.value;
    ctaFields?.classList.toggle('hidden', selected !== 'cta_button');
    promoFields?.classList.toggle('hidden', selected !== 'promo_code');
  };

  offerTypeInputs.forEach((input) => {
    input.addEventListener('change', syncOfferFields);
  });
  syncOfferFields();

  const propertyImagesInput = document.querySelector('[data-property-images-input]');
  const propertyImagesPanel = document.querySelector('[data-property-images-panel]');
  const propertyImagesPreview = document.querySelector('[data-property-images-preview]');
  const coverImageIndex = document.querySelector('[data-cover-image-index]');
  let propertyImageFiles = [];
  let coverFileKey = null;

  const syncPropertyImageInput = () => {
    if (!propertyImagesInput) return;
    const transfer = new DataTransfer();
    propertyImageFiles.forEach((file) => transfer.items.add(file));
    propertyImagesInput.files = transfer.files;
    const coverIndex = propertyImageFiles.findIndex((file) => `${file.name}-${file.lastModified}` === coverFileKey);
    if (coverImageIndex) coverImageIndex.value = String(Math.max(0, coverIndex));
  };

  const renderPropertyImages = () => {
    if (!propertyImagesPreview || !propertyImagesPanel) return;
    propertyImagesPanel.classList.toggle('hidden', propertyImageFiles.length === 0);
    propertyImagesPreview.innerHTML = '';

    propertyImageFiles.forEach((file, index) => {
      const key = `${file.name}-${file.lastModified}`;
      const item = document.createElement('div');
      item.className = 'rounded-lg bg-white p-2 shadow-card';
      item.draggable = true;
      item.dataset.index = String(index);

      const image = document.createElement('img');
      image.src = URL.createObjectURL(file);
      image.alt = file.name;
      image.className = 'h-28 w-full rounded-md object-cover';
      image.onload = () => URL.revokeObjectURL(image.src);

      const controls = document.createElement('div');
      controls.className = 'mt-2 flex items-center justify-between gap-2 text-xs';

      const label = document.createElement('label');
      label.className = 'flex cursor-pointer items-center gap-2 font-semibold';
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'cover-preview';
      radio.checked = key === coverFileKey;
      radio.addEventListener('change', () => {
        coverFileKey = key;
        syncPropertyImageInput();
        renderPropertyImages();
      });
      label.append(radio, document.createTextNode('Cover'));

      const handle = document.createElement('span');
      handle.className = 'text-muted-foreground';
      handle.textContent = 'Drag';

      controls.append(label, handle);
      item.append(image, controls);

      item.addEventListener('dragstart', (event) => {
        event.dataTransfer?.setData('text/plain', String(index));
      });
      item.addEventListener('dragover', (event) => event.preventDefault());
      item.addEventListener('drop', (event) => {
        event.preventDefault();
        const from = Number(event.dataTransfer?.getData('text/plain'));
        const to = Number(item.dataset.index);
        if (Number.isNaN(from) || Number.isNaN(to) || from === to) return;
        const [moved] = propertyImageFiles.splice(from, 1);
        propertyImageFiles.splice(to, 0, moved);
        syncPropertyImageInput();
        renderPropertyImages();
      });

      propertyImagesPreview.append(item);
    });
  };

  propertyImagesInput?.addEventListener('change', () => {
    propertyImageFiles = Array.from(propertyImagesInput.files || []);
    coverFileKey = propertyImageFiles[0] ? `${propertyImageFiles[0].name}-${propertyImageFiles[0].lastModified}` : null;
    syncPropertyImageInput();
    renderPropertyImages();
  });
});
