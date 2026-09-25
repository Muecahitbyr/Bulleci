import { gsap, motionEnabled } from '../core/motion.js';

/**
 * Einfache Parallax-Ebenen: data-speed="-0.3" bewegt ein Element
 * relativ zu seinem Abschnitt langsamer/schneller als den Scroll.
 */
export function initParallax() {
  if (!motionEnabled) return;

  gsap.utils.toArray('[data-speed]').forEach((el) => {
    const speed = parseFloat(el.dataset.speed) || 0;
    gsap.to(el, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('section') ?? el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}
