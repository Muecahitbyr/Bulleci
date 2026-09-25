import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap, ScrollTrigger, motionEnabled } from './motion.js';

const NAV_OFFSET = -64;
let lenis = null;

const samePage = (url) => {
  const normalize = (p) => p.replace(/index\.html$/, '');
  return url.origin === location.origin && normalize(url.pathname) === normalize(location.pathname);
};

/** Scrollt weich zu einem Ziel (Element, Selektor oder Zahl). */
export function scrollTo(target, options = {}) {
  if (lenis) {
    lenis.scrollTo(target, { offset: NAV_OFFSET, duration: 1.4, ...options });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (typeof el === 'number') window.scrollTo({ top: el, behavior: 'smooth' });
  else el?.scrollIntoView({ behavior: motionEnabled ? 'smooth' : 'auto' });
}

export const getLenis = () => lenis;

export function initSmoothScroll() {
  if (motionEnabled) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Anker-Links (auch "/#abschnitt" auf der Startseite) weich scrollen
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href*="#"]');
    if (!link) return;
    const url = new URL(link.href, location.href);
    if (!samePage(url) || !url.hash) return;

    const target = url.hash === '#top' ? 0 : document.querySelector(decodeURIComponent(url.hash));
    if (target === null) return;

    event.preventDefault();
    scrollTo(target);
    history.pushState(null, '', url.hash);
  });

  // Beim Laden mit Hash (z. B. von Unterseite kommend) korrekt positionieren
  if (location.hash) {
    window.addEventListener('load', () => {
      const target = document.querySelector(decodeURIComponent(location.hash));
      if (target) {
        ScrollTrigger.refresh();
        scrollTo(target, { immediate: true });
      }
    });
  }

  return lenis;
}
