import { gsap, ScrollTrigger, motionEnabled } from '../core/motion.js';

/** Kleine Akzente: Scroll-Fortschritt, Sterne, Icons, Checkliste, Öffnungszeiten, Band. */
export function initAccents() {
  if (!motionEnabled) return;

  const onEnter = (trigger, callback, start = 'top 85%') =>
    ScrollTrigger.create({ trigger, start, once: true, onEnter: callback });

  // Fortschrittsbalken unter der Navigation
  const progress = document.querySelector('[data-scroll-progress]');
  if (progress) {
    gsap.to(progress, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
    });
  }

  // Sterne füllen sich von links
  document.querySelectorAll('.stars__fill').forEach((fill) => {
    gsap.set(fill, { clipPath: 'inset(0 100% 0 0)' });
    onEnter(fill, () => gsap.to(fill, { clipPath: 'inset(0 0% 0 0)', duration: 1.8, ease: 'power3.out', delay: 0.2 }));
  });

  // Icons zeichnen sich Strich für Strich
  document.querySelectorAll('.card__icon').forEach((icon) => {
    const shapes = icon.querySelectorAll('path, circle');
    shapes.forEach((shape) => shape.setAttribute('pathLength', '1'));
    gsap.set(shapes, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(icon, { scale: 0.5, rotate: -20 });
    onEnter(icon, () =>
      gsap
        .timeline()
        .to(icon, { scale: 1, rotate: 0, duration: 0.9, ease: 'back.out(2)' })
        .to(shapes, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', stagger: 0.2 }, 0.1),
    );
  });

  // Checkliste: Punkte gleiten nacheinander herein, Haken ploppen auf
  document.querySelectorAll('.checklist').forEach((list) => {
    const items = list.querySelectorAll('li');
    items.forEach((li, i) => li.style.setProperty('--i', i));
    gsap.set(items, { x: -30, opacity: 0 });
    onEnter(list, () => {
      list.classList.add('is-in');
      gsap.to(items, { x: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.1 });
    });
  });

  // Öffnungszeiten: Zeilen bauen sich nacheinander auf
  const table = document.querySelector('[data-hours-table]');
  if (table) {
    const cells = [...table.querySelectorAll('tr')].map((row) => row.children);
    gsap.set(table.querySelectorAll('th, td'), { opacity: 0, y: 14 });
    onEnter(table, () =>
      cells.forEach((rowCells, i) =>
        gsap.to(rowCells, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', delay: 0.15 + i * 0.06 }),
      ),
    );
  }

  // Bild-Band: Foto zoomt beim Hereinscrollen heraus
  document.querySelectorAll('.band__media').forEach((media) => {
    gsap.fromTo(
      media,
      { scale: 1.25 },
      { scale: 1, ease: 'none', scrollTrigger: { trigger: media.parentElement, start: 'top bottom', end: 'top top', scrub: true } },
    );
  });
}
