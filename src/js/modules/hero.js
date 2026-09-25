import { gsap, motionEnabled } from '../core/motion.js';

export function initHero() {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;

  const content = hero.querySelector('[data-hero-content]');
  const car = hero.querySelector('[data-hero-car]');
  const shine = hero.querySelector('[data-car-shine]');
  const wheels = hero.querySelectorAll('[data-car-wheel]');
  const hint = hero.querySelector('[data-scroll-hint]');

  if (!motionEnabled) return;

  gsap.set(wheels, { transformOrigin: '50% 50%' });

  // 1) Einstiegsanimation beim Laden
  const intro = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.4 } });
  intro
    .from(hero.querySelectorAll('[data-hero-line]'), { yPercent: 110, stagger: 0.12, duration: 1.3 })
    .from(hero.querySelectorAll('[data-hero-intro]'), { y: 24, opacity: 0, stagger: 0.08 }, 0.25)
    .from(car, { x: '-18vw', opacity: 0, duration: 1.8 }, 0.3)
    .from(wheels, { rotation: -540, duration: 1.8 }, 0.3)
    .fromTo(shine, { attr: { x: -320 } }, { attr: { x: 900 }, duration: 1.6, ease: 'power2.inOut' }, 1.1)
    .from(hint, { opacity: 0, duration: 1 }, 1.4);

  // 2) Scroll-Szene: Hero wird gepinnt, Text weicht, Auto fährt nach vorn
  const mm = gsap.matchMedia();
  mm.add(
    { desktop: '(min-width: 900px)', mobile: '(max-width: 899px)' },
    ({ conditions }) => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: conditions.desktop ? '+=110%' : '+=60%',
          scrub: 0.6,
          pin: true,
        },
      });

      tl.to(content, { yPercent: -30, opacity: 0, scale: 0.94 }, 0)
        .to(hint, { opacity: 0, duration: 0.2 }, 0)
        .to(car, { scale: conditions.desktop ? 1.6 : 1.25, yPercent: conditions.desktop ? -45 : -20 }, 0)
        .fromTo(wheels, { rotation: 0 }, { rotation: 360, immediateRender: false }, 0)
        .fromTo(shine, { attr: { x: -320 } }, { attr: { x: 1000 }, immediateRender: false }, 0.1);
    },
  );
}
