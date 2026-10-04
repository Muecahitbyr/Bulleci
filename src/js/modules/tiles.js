import { gsap, ScrollTrigger, motionEnabled } from '../core/motion.js';

/**
 * Leistungs-Kacheln:
 * - Bild zoomt beim Erscheinen heraus, Text und Chips folgen gestaffelt
 * - Handy: Karten wachsen beim Scrollen auf volle Größe (Tiefen-Effekt)
 */
export function initTiles() {
  if (!motionEnabled) return;

  gsap.utils.toArray('.tile').forEach((tile) => {
    const img = tile.querySelector('.tile__media img');
    const body = gsap.utils.toArray(tile.querySelectorAll('.tile__body > *:not(.chips)'));
    const chips = tile.querySelectorAll('.chips li');

    if (img) gsap.set(img, { scale: 1.3 });
    gsap.set(body, { y: 28, opacity: 0 });
    gsap.set(chips, { scale: 0.6, opacity: 0 });

    ScrollTrigger.create({
      trigger: tile,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
        if (img) tl.to(img, { scale: 1, duration: 1.8 }, 0);
        tl.to(body, { y: 0, opacity: 1, duration: 1.1, stagger: 0.08 }, 0.15);
        if (chips.length) tl.to(chips, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(2.2)', stagger: 0.05 }, 0.5);
      },
    });
  });

  // Tiefen-Effekt nur im einspaltigen Layout
  gsap.matchMedia().add('(max-width: 699px)', () => {
    gsap.utils.toArray('.tile, .stat, .contact .card, .compare').forEach((el) => {
      gsap.fromTo(
        el,
        { scale: 0.88, borderRadius: 40 },
        {
          scale: 1,
          borderRadius: 24,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 60%', scrub: true },
        },
      );
    });
  });
}
