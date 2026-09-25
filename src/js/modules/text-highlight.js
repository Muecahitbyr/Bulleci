import { gsap, motionEnabled } from '../core/motion.js';

/** Apple-typischer Effekt: Text leuchtet Wort für Wort beim Scrollen auf. */
export function initTextHighlight() {
  document.querySelectorAll('[data-highlight]').forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', words.join(' '));
    el.innerHTML = words.map((w) => `<span class="hl-word" aria-hidden="true">${w}</span>`).join(' ');

    if (!motionEnabled) return;

    gsap.fromTo(
      el.querySelectorAll('.hl-word'),
      { opacity: 0.16 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 45%', scrub: true },
      },
    );
  });
}
