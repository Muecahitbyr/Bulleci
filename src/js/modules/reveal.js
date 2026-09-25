import { gsap, ScrollTrigger, motionEnabled } from '../core/motion.js';

/** Elemente mit [data-reveal] sanft einblenden, sobald sie in den Viewport kommen. */
export function initReveal() {
  const items = gsap.utils.toArray('[data-reveal]');
  if (!items.length) return;

  if (!motionEnabled) {
    gsap.set(items, { clearProps: 'all' });
    return;
  }

  ScrollTrigger.batch(items, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.08,
        overwrite: true,
      }),
  });
}
