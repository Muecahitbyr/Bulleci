import { gsap, ScrollTrigger, motionEnabled } from '../core/motion.js';

/** Zahlen hochzählen (deutsches Zahlenformat), sobald sie sichtbar werden. */
export function initCounters() {
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = Number(el.dataset.decimals ?? 0);
    const format = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    el.textContent = format.format(target);
    if (!motionEnabled) return;

    const state = { value: 0 };
    el.textContent = format.format(0);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () =>
        gsap.to(state, {
          value: target,
          duration: 1.8,
          ease: 'expo.out',
          onUpdate: () => (el.textContent = format.format(state.value)),
          onComplete: () => (el.textContent = format.format(target)),
        }),
    });
  });
}
