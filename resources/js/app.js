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
});
