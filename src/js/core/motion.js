import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Mobile Browser: Ein-/Ausblenden der Adressleiste soll keine Neuberechnung auslösen
ScrollTrigger.config({ ignoreMobileResize: true });

/** true, wenn der Nutzer reduzierte Bewegung wünscht (im <head> gesetzt). */
export const motionEnabled = document.documentElement.classList.contains('has-motion');

export const ease = {
  out: 'power3.out',
  apple: 'expo.out',
};

export { gsap, ScrollTrigger };
