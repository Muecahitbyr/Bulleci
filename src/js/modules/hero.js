import { gsap, motionEnabled } from '../core/motion.js';

export function initHero() {
  const hero = document.querySelector('[data-hero]');
  if (!hero || !motionEnabled) return;

  const content = hero.querySelector('[data-hero-content]');
  const media = hero.querySelector('[data-hero-media]');
  const img = hero.querySelector('[data-hero-img]');
  const badge = hero.querySelector('[data-hero-badge]');

  // 1) Einstiegsanimation beim Laden
  gsap
    .timeline({ defaults: { ease: 'expo.out', duration: 1.4 } })
    .from(hero.querySelectorAll('[data-hero-line]'), { yPercent: 110, stagger: 0.12, duration: 1.3 })
    .from(hero.querySelectorAll('[data-hero-intro]'), { y: 24, opacity: 0, stagger: 0.08 }, 0.25)
    .from(media, { y: 120, opacity: 0, duration: 1.8 }, 0.35)
    .from(badge, { y: 30, opacity: 0, duration: 1.2 }, 1);

  // 2) Scroll: Bild öffnet sich von der abgerundeten Karte auf volle Breite
  const mm = gsap.matchMedia();
  mm.add({ desktop: '(min-width: 700px)', mobile: '(max-width: 699px)' }, ({ conditions }) => {
    const inset = conditions.desktop ? 4 : 3;
    const radius = conditions.desktop ? 32 : 24;

    gsap.fromTo(
      media,
      { clipPath: `inset(0% ${inset}% 0% ${inset}% round ${radius}px)` },
      {
        clipPath: 'inset(0% 0% 0% 0% round 0px)',
        ease: 'none',
        scrollTrigger: { trigger: media, start: 'top 85%', end: 'top top', scrub: true },
      },
    );

    gsap.fromTo(
      img,
      { scale: 1.2 },
      {
        scale: 1,
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );

    gsap.to(content, {
      yPercent: -18,
      opacity: 0.2,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: '+=70%', scrub: true },
    });
  });
}
