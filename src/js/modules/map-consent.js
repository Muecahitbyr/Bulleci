import { links } from '../../config/business.js';

const STORAGE_KEY = 'bulleci:map-consent';

const storage = {
  get: () => {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  },
  set: () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* Speicher nicht verfügbar – Karte trotzdem laden */
    }
  },
};

/** Google Maps erst nach aktiver Zustimmung laden (DSGVO). */
export function initMapConsent() {
  const map = document.querySelector('[data-map]');
  if (!map) return;

  const load = () => {
    const iframe = document.createElement('iframe');
    iframe.src = links.mapEmbed;
    iframe.title = 'Standort auf Google Maps';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.allowFullscreen = true;
    map.querySelector('[data-map-placeholder]').replaceWith(iframe);
    map.classList.add('is-loaded');
  };

  map.querySelector('[data-map-load]')?.addEventListener('click', () => {
    storage.set();
    load();
  });

  if (storage.get()) load();
}
