import { getLenis } from '../core/smooth-scroll.js';

export function initNav() {
  const nav = document.querySelector('[data-nav]');
  if (!nav) return;

  const toggle = nav.querySelector('[data-nav-toggle]');
  const menu = nav.querySelector('[data-mobile-menu]');
  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    const menuOpen = nav.classList.contains('is-open');
    nav.classList.toggle('is-scrolled', y > 20);
    // Beim Runterscrollen ausblenden, beim Hochscrollen wieder zeigen
    if (!menuOpen) nav.classList.toggle('is-hidden', y > 400 && y > lastY + 2);
    if (y < lastY - 2) nav.classList.remove('is-hidden');
    lastY = y;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true },
  );
  update();

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.sr-only').textContent = open ? 'Menü schließen' : 'Menü öffnen';
    document.body.classList.toggle('no-scroll', open);
    const lenis = getLenis();
    if (lenis) open ? lenis.stop() : lenis.start();
  };

  toggle?.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  menu?.addEventListener('click', (e) => e.target.closest('a') && setOpen(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 900px)').addEventListener('change', (e) => e.matches && setOpen(false));
}
