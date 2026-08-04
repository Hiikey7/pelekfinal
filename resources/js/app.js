import './bootstrap';
import { createIcons, icons } from 'lucide';

let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
});

window.addEventListener('DOMContentLoaded', () => {
  createIcons({ icons });

  const installBanner = document.querySelector('[data-pwa-install-banner]');
  const dismissInstallBanner = () => {
    if (!installBanner) return;
    installBanner.classList.add('hidden');
  };

  if (installBanner) {
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isInstalled) {
      dismissInstallBanner();
    } else {
      const dismissTimer = window.setTimeout(dismissInstallBanner, 5000);
      window.addEventListener('scroll', () => {
        window.clearTimeout(dismissTimer);
        dismissInstallBanner();
      }, { once: true, passive: true });
    }

    installBanner.querySelector('[data-pwa-dismiss]')?.addEventListener('click', dismissInstallBanner);
    installBanner.querySelector('[data-pwa-install]')?.addEventListener('click', async () => {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        await deferredInstallPrompt.userChoice;
        deferredInstallPrompt = null;
        dismissInstallBanner();
        return;
      }

      const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
      window.alert(isIos
        ? 'To install this app, tap Share and then “Add to Home Screen”.'
        : 'Use your browser menu and choose “Install app” or “Add to Home screen”.');
    });
  }

  window.addEventListener('appinstalled', dismissInstallBanner);

  const allowedRichTextTags = new Set(['P', 'BR', 'STRONG', 'B', 'EM', 'I', 'U', 'H2', 'H3', 'BLOCKQUOTE', 'UL', 'OL', 'LI']);
  const cleanRichText = (html) => {
    const parsed = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
    const root = parsed.body.firstElementChild;
    root?.querySelectorAll('*').forEach((element) => {
      if (!allowedRichTextTags.has(element.tagName)) {
        element.replaceWith(...element.childNodes);
        return;
      }
      Array.from(element.attributes).forEach((attribute) => element.removeAttribute(attribute.name));
    });
    return root?.innerHTML || '';
  };

  document.querySelectorAll('[data-rich-text-editor]').forEach((editor) => {
    const content = editor.querySelector('[data-rich-text-content]');
    const input = editor.querySelector('[data-rich-text-input]');
    if (!content || !input) return;

    content.innerHTML = cleanRichText(input.value);
    const sync = () => {
      input.value = cleanRichText(content.innerHTML);
    };

    editor.querySelectorAll('[data-rich-text-command]').forEach((button) => {
      button.addEventListener('click', () => {
        content.focus();
        document.execCommand(
          button.getAttribute('data-rich-text-command'),
          false,
          button.getAttribute('data-rich-text-value') || null,
        );
        sync();
      });
    });

    content.addEventListener('input', sync);
    content.addEventListener('blur', sync);
    editor.closest('form')?.addEventListener('submit', sync);
  });

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
    const jumpButtons = Array.from(carousel.querySelectorAll('[data-property-carousel-jump]'));
    if (!track || slides.length <= 1) return;

    let index = 0;
    let timer;

    const syncJumpButtons = () => {
      jumpButtons.forEach((button, buttonIndex) => {
        const isActive = buttonIndex === index;
        button.classList.toggle('border-secondary', isActive);
        button.classList.toggle('border-transparent', !isActive);
        button.classList.toggle('opacity-100', isActive);
        button.classList.toggle('opacity-70', !isActive);
        button.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    };

    const showSlide = (nextIndex) => {
      index = (nextIndex + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      syncJumpButtons();
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

    jumpButtons.forEach((button) => {
      button.addEventListener('click', () => {
        showSlide(Number(button.getAttribute('data-property-carousel-jump') || 0));
        start();
      });
    });

    carousel.addEventListener('mouseenter', () => window.clearInterval(timer));
    carousel.addEventListener('mouseleave', start);
    syncJumpButtons();
    start();
  });

  document.querySelectorAll('[data-reviews-carousel]').forEach((carousel) => {
    const track = carousel.querySelector('[data-reviews-track]');
    const cards = Array.from(track?.children || []);
    if (!track || cards.length <= 1) return;

    const stepSize = () => cards[0].getBoundingClientRect().width + 16;
    const move = (direction) => {
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
      const atStart = track.scrollLeft <= 8;

      if (direction > 0 && atEnd) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else if (direction < 0 && atStart) {
        track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: stepSize() * direction, behavior: 'smooth' });
      }
    };

    let reviewsTimer;
    const startReviews = () => {
      window.clearInterval(reviewsTimer);
      reviewsTimer = window.setInterval(() => move(1), 4500);
    };

    carousel.querySelector('[data-reviews-prev]')?.addEventListener('click', () => {
      move(-1);
      startReviews();
    });
    carousel.querySelector('[data-reviews-next]')?.addEventListener('click', () => {
      move(1);
      startReviews();
    });
    carousel.addEventListener('mouseenter', () => window.clearInterval(reviewsTimer));
    carousel.addEventListener('mouseleave', startReviews);
    carousel.addEventListener('touchstart', () => window.clearInterval(reviewsTimer), { passive: true });
    carousel.addEventListener('touchend', startReviews, { passive: true });
    startReviews();
  });

  const lightbox = document.querySelector('[data-image-lightbox]');
  const lightboxImage = lightbox?.querySelector('[data-lightbox-image]');
  const lightboxTriggers = Array.from(document.querySelectorAll('[data-lightbox-open]'));
  const lightboxSources = [...new Set(lightboxTriggers
    .map((trigger) => trigger.getAttribute('data-lightbox-src') || trigger.getAttribute('src'))
    .filter(Boolean))];
  let lightboxIndex = 0;

  const showLightboxImage = (index) => {
    if (!lightboxImage || lightboxSources.length === 0) return;
    lightboxIndex = (index + lightboxSources.length) % lightboxSources.length;
    lightboxImage.setAttribute('src', lightboxSources[lightboxIndex]);
  };

  const openLightbox = (source) => {
    if (!lightbox || !lightboxImage) return;
    showLightboxImage(Math.max(0, lightboxSources.indexOf(source)));
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('[data-lightbox-close]')?.focus();
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    document.body.style.overflow = '';
  };

  lightboxTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      openLightbox(trigger.getAttribute('data-lightbox-src') || trigger.getAttribute('src'));
    });
  });

  lightbox?.querySelector('[data-lightbox-close]')?.addEventListener('click', closeLightbox);
  lightbox?.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => showLightboxImage(lightboxIndex - 1));
  lightbox?.querySelector('[data-lightbox-next]')?.addEventListener('click', () => showLightboxImage(lightboxIndex + 1));
  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox || lightbox.classList.contains('hidden')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') showLightboxImage(lightboxIndex - 1);
    if (event.key === 'ArrowRight') showLightboxImage(lightboxIndex + 1);
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
