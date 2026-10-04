import { gsap, ScrollTrigger, motionEnabled } from '../core/motion.js';

const SWEEP = 240; // Winkel des Skalenbogens
const REST = 0.82; // Endstellung (0 … 1), passend zum statischen Zustand im HTML

/** Drehzahlmesser: Nadel dreht hoch wie beim Gasgeben und pendelt danach leicht. */
export function initGauge() {
  const gauge = document.querySelector('[data-gauge]');
  if (!gauge || !motionEnabled) return;

  const value = gauge.querySelector('[data-gauge-value]');
  const needle = gauge.querySelector('[data-gauge-needle]');
  const state = { v: 0 };
  const apply = () => {
    value.style.strokeDashoffset = 1 - state.v;
    needle.setAttribute('transform', `rotate(${-SWEEP / 2 + SWEEP * state.v} 100 100)`);
  };
  apply();

  const tl = gsap
    .timeline({ paused: true, onUpdate: apply, defaults: { ease: 'power2.inOut' } })
    .to(state, { v: 0.96, duration: 0.9, ease: 'power3.in' })
    .to(state, { v: 0.32, duration: 0.6, ease: 'power2.out' })
    .to(state, { v: 0.9, duration: 0.7 })
    .to(state, { v: REST, duration: 0.8, ease: 'elastic.out(1, 0.5)' })
    .to(state, { v: REST + 0.025, duration: 0.25, repeat: -1, yoyo: true, ease: 'sine.inOut' });

  // Startet beim ersten Erscheinen; außerhalb des Viewports pausiert das Pendeln
  ScrollTrigger.create({
    trigger: gauge,
    start: 'top 80%',
    end: 'bottom top',
    onToggle: ({ isActive }) => tl.paused(!isActive),
  });
}
