import { gsap, motionEnabled } from '../core/motion.js';

/** Gepinnter Abschnitt: „Glanz.“ zoomt heran, der Farbverlauf wandert durch die Buchstaben. */
export function initGloss() {
  const section = document.querySelector('[data-gloss]');
  if (!section || !motionEnabled) return;

  const word = section.querySelector('[data-gloss-word]');
  const sub = section.querySelector('[data-gloss-sub]');

  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: section, start: 'top top', end: '+=120%', scrub: 0.8, pin: true },
    })
    .fromTo(word, { scale: 0.45, opacity: 0.1, letterSpacing: '0.08em' }, { scale: 1, opacity: 1, letterSpacing: '-0.05em', duration: 1 })
    .fromTo(word, { backgroundPosition: '0% 50%' }, { backgroundPosition: '100% 50%', duration: 1.6 }, 0)
    .fromTo(sub, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5 }, 0.7)
    .to({}, { duration: 0.3 });
}
