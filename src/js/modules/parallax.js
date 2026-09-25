import { gsap, motionEnabled } from '../core/motion.js';

/**
 * Parallax-Ebenen:
 * - data-speed="-0.3": Element bewegt sich relativ zu seinem Abschnitt
 * - data-parallax-img: Bild wandert innerhalb seines Rahmens (Rahmen braucht overflow: hidden)
 * - data-band-img: stärkere Variante für vollflächige Bilder
 */
export function initParallax() {
  if (!motionEnabled) return;

  gsap.utils.toArray('[data-speed]').forEach((el) => {
    const speed = parseFloat(el.dataset.speed) || 0;
    gsap.to(el, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: { trigger: el.closest('section') ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  const imageParallax = (selector, amount) =>
    gsap.utils.toArray(selector).forEach((img) => {
      gsap.fromTo(
        img,
        { yPercent: -amount },
        {
          yPercent: amount,
          ease: 'none',
          scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    });

  imageParallax('[data-parallax-img]', 6);
  imageParallax('[data-band-img]', 9);
}
