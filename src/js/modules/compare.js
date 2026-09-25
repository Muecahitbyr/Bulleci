import { gsap, ScrollTrigger, motionEnabled } from '../core/motion.js';

/** Vorher/Nachher-Slider – per Maus, Touch und Tastatur (range input) bedienbar. */
export function initCompare() {
  document.querySelectorAll('[data-compare]').forEach((el) => {
    const range = el.querySelector('[data-compare-range]');
    const state = { pos: 50 };
    const apply = () => {
      el.style.setProperty('--pos', `${state.pos}%`);
      range.value = state.pos;
    };

    range.addEventListener('input', () => {
      gsap.killTweensOf(state);
      state.pos = Number(range.value);
      apply();
    });

    // Kurze Demo-Bewegung, sobald der Slider sichtbar wird
    if (motionEnabled) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 70%',
        once: true,
        onEnter: () =>
          gsap
            .timeline({ onUpdate: apply })
            .to(state, { pos: 22, duration: 0.9, ease: 'power2.inOut' })
            .to(state, { pos: 78, duration: 1.2, ease: 'power2.inOut' })
            .to(state, { pos: 50, duration: 0.9, ease: 'power2.inOut' }),
      });
    }
  });
}
