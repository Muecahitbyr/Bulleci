import { gsap, motionEnabled } from '../core/motion.js';

/** Ablauf-Schritte: auf dem Desktop horizontal scrollend (gepinnt), mobil vertikal. */
export function initProcess() {
  const section = document.querySelector('[data-process]');
  if (!section) return;

  const track = section.querySelector('[data-process-track]');
  const progress = section.querySelector('[data-process-progress]');
  const mm = gsap.matchMedia();

  mm.add('(min-width: 900px)', () => {
    if (!motionEnabled) return;
    const viewport = track.parentElement;
    // Strecke, bis die letzte Karte rechts bündig mit dem Inhaltsbereich abschließt
    const distance = () => {
      const style = getComputedStyle(viewport);
      const inner = viewport.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      return Math.max(0, track.scrollWidth - inner);
    };

    gsap
      .timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 0.8,
          pin: true,
          invalidateOnRefresh: true,
        },
      })
      .to(track, { x: () => -distance() }, 0)
      .fromTo(progress, { scaleX: 0 }, { scaleX: 1 }, 0);
  });

  // Mobil: Karten stapeln sich (sticky, siehe CSS), die verdeckte Karte tritt zurück
  mm.add('(max-width: 899px)', () => {
    if (!motionEnabled) return;
    const steps = gsap.utils.toArray(track.children);

    steps.forEach((step, i) => {
      gsap.from(step, {
        y: 80,
        opacity: 0,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: step, start: 'top 90%', once: true },
      });
      gsap.from(step.querySelector('.step__num'), {
        xPercent: -40,
        opacity: 0,
        duration: 1.3,
        ease: 'expo.out',
        scrollTrigger: { trigger: step, start: 'top 80%', once: true },
      });

      const next = steps[i + 1];
      if (!next) return;
      gsap.to(step, {
        scale: 0.9,
        '--dim': 0.6,
        ease: 'none',
        scrollTrigger: { trigger: next, start: 'top 85%', end: () => `top ${parseFloat(getComputedStyle(next).top) || 0}px`, scrub: true },
      });
    });
  });
}
