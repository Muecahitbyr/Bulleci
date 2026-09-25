import { gsap, ScrollTrigger, motionEnabled } from '../core/motion.js';

/**
 * Vorher/Nachher-Slider.
 * - Maus & Touch: Ziehen irgendwo auf dem Bild (Pointer Events, auch iOS)
 * - Tastatur: unsichtbarer range-Input (Pfeiltasten)
 */
export function initCompare() {
  document.querySelectorAll('[data-compare]').forEach((el) => {
    const range = el.querySelector('[data-compare-range]');
    const state = { pos: 50 };
    const apply = () => {
      el.style.setProperty('--pos', `${state.pos}%`);
      range.value = Math.round(state.pos);
    };

    const setFromPointer = (event) => {
      const rect = el.getBoundingClientRect();
      state.pos = gsap.utils.clamp(0, 100, ((event.clientX - rect.left) / rect.width) * 100);
      apply();
    };

    let dragging = false;
    el.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      dragging = true;
      gsap.killTweensOf(state);
      el.setPointerCapture(event.pointerId);
      el.classList.add('is-dragging');
      setFromPointer(event);
    });
    el.addEventListener('pointermove', (event) => dragging && setFromPointer(event));
    const stop = () => {
      dragging = false;
      el.classList.remove('is-dragging');
    };
    el.addEventListener('pointerup', stop);
    el.addEventListener('pointercancel', stop);

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
