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

  mm.add('(max-width: 899px)', () => {
    if (!motionEnabled) return;
    gsap.utils.toArray(track.children).forEach((step) => {
      gsap.from(step, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: step, start: 'top 85%', once: true },
      });
    });
  });
}
