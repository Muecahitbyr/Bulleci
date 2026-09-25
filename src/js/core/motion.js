import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** true, wenn der Nutzer reduzierte Bewegung wünscht (im <head> gesetzt). */
export const motionEnabled = document.documentElement.classList.contains('has-motion');

export const ease = {
  out: 'power3.out',
  apple: 'expo.out',
};

export { gsap, ScrollTrigger };
