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

  const syncMultiselectLabel = (select) => {
    const label = select.querySelector('[data-multiselect-label]');
    if (!label) return;

    const checkedLabels = Array.from(select.querySelectorAll('input[type="checkbox"]:checked'))
      .map((input) => input.getAttribute('data-multiselect-option-label') || input.value);

    label.textContent = checkedLabels.length
      ? (checkedLabels.length <= 2 ? checkedLabels.join(', ') : `${checkedLabels.length} selected`)
      : (label.getAttribute('data-placeholder') || 'Select');
  };

  document.querySelectorAll('[data-multiselect]').forEach((select) => {
    const trigger = select.querySelector('[data-multiselect-trigger]');
    const panel = select.querySelector('[data-multiselect-panel]');

    trigger?.addEventListener('click', (event) => {
      event.stopPropagation();
      document.querySelectorAll('[data-multiselect-panel]').forEach((otherPanel) => {
        if (otherPanel !== panel) otherPanel.classList.add('hidden');
      });
      panel?.classList.toggle('hidden');
    });

    select.querySelectorAll('input[type="checkbox"]').forEach((input) => {
      input.addEventListener('change', () => syncMultiselectLabel(select));
    });

    syncMultiselectLabel(select);
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('[data-multiselect-panel]').forEach((panel) => panel.classList.add('hidden'));
  });

  const isStandaloneApp = () => (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator && Boolean(window.navigator.standalone))
  );

  const pwaPopup = document.querySelector('[data-pwa-install-popup]');
  const pwaAction = document.querySelector('[data-pwa-install-action]');
  const pwaClose = document.querySelector('[data-pwa-install-close]');
  let pwaInstallPrompt = null;

  const hidePwaPopup = () => pwaPopup?.classList.add('hidden');
  const showPwaPopup = () => {
    if (!isStandaloneApp()) pwaPopup?.classList.remove('hidden');
  };

  if (pwaPopup && !isStandaloneApp()) {
    const showTimer = window.setTimeout(showPwaPopup, 600);
    const hideTimer = window.setTimeout(hidePwaPopup, 5600);

    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      pwaInstallPrompt = event;
      showPwaPopup();
    });

    window.addEventListener('scroll', hidePwaPopup, { once: true, passive: true });
    pwaClose?.addEventListener('click', hidePwaPopup);
    pwaAction?.addEventListener('click', async () => {
      if (!pwaInstallPrompt) {
        hidePwaPopup();
        return;
      }

      await pwaInstallPrompt.prompt();
      await pwaInstallPrompt.userChoice.catch(() => null);
      pwaInstallPrompt = null;
      hidePwaPopup();
    });

    window.addEventListener('beforeunload', () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    });
  }

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

  document.querySelectorAll('[data-horizontal-carousel]').forEach((carousel) => {
    const track = carousel.querySelector('[data-horizontal-carousel-track]');
    const section = carousel.closest('section');
    const previous = section?.querySelector('[data-horizontal-carousel-prev]');
    const next = section?.querySelector('[data-horizontal-carousel-next]');
    if (!track) return;

    const scrollByCard = (direction) => {
      const card = track.querySelector(':scope > *');
      const distance = card ? card.getBoundingClientRect().width + 16 : track.clientWidth * 0.85;
      track.scrollBy({ left: direction * distance, behavior: 'smooth' });
    };

    previous?.addEventListener('click', () => scrollByCard(-1));
    next?.addEventListener('click', () => scrollByCard(1));
  });

  const imageLightbox = document.querySelector('[data-image-lightbox]');
  const imageLightboxImage = document.querySelector('[data-image-lightbox-image]');
  const closeImageLightbox = () => {
    imageLightbox?.classList.add('hidden');
    imageLightbox?.classList.remove('flex');
    if (imageLightboxImage) imageLightboxImage.src = '';
    document.body.classList.remove('overflow-hidden');
  };

  document.querySelectorAll('[data-image-lightbox-open]').forEach((button) => {
    button.addEventListener('click', () => {
      const imageSrc = button.getAttribute('data-image-src');
      if (!imageLightbox || !imageLightboxImage || !imageSrc) return;

      imageLightboxImage.src = imageSrc;
      imageLightbox.classList.remove('hidden');
      imageLightbox.classList.add('flex');
      document.body.classList.add('overflow-hidden');
      createIcons({ icons });
    });
  });

  document.querySelectorAll('[data-image-lightbox-close]').forEach((button) => {
    button.addEventListener('click', closeImageLightbox);
  });

  imageLightbox?.addEventListener('click', (event) => {
    if (event.target === imageLightbox) closeImageLightbox();
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeImageLightbox();
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

  document.querySelectorAll('[data-rich-text-editor]').forEach((editor) => {
    const input = editor.querySelector('[data-rich-text-input]');
    const output = editor.querySelector('[data-rich-text-output]');
    if (!input || !output) return;

    const syncOutput = () => {
      output.value = input.innerHTML.trim();
    };

    editor.querySelectorAll('[data-rich-text-command]').forEach((button) => {
      button.addEventListener('click', () => {
        input.focus();
        const command = button.getAttribute('data-rich-text-command');
        const value = button.getAttribute('data-rich-text-value');

        if (command === 'createLink') {
          const url = window.prompt('Paste the link URL');
          if (!url) return;
          document.execCommand(command, false, url);
        } else if (command === 'formatBlock') {
          document.execCommand(command, false, value || 'p');
        } else {
          document.execCommand(command, false, value || null);
        }

        syncOutput();
        createIcons({ icons });
      });
    });

    input.addEventListener('input', syncOutput);
    input.closest('form')?.addEventListener('submit', syncOutput);
    syncOutput();
  });
});
