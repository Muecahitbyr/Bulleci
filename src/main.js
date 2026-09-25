import '@fontsource-variable/inter';
import './styles/main.css';

import { ScrollTrigger } from './js/core/motion.js';
import { initSmoothScroll } from './js/core/smooth-scroll.js';
import { initNav } from './js/modules/nav.js';
import { initOpeningHours } from './js/modules/opening-hours.js';
import { initHero } from './js/modules/hero.js';
import { initTextHighlight } from './js/modules/text-highlight.js';
import { initReveal } from './js/modules/reveal.js';
import { initParallax } from './js/modules/parallax.js';
import { initGloss } from './js/modules/gloss.js';
import { initProcess } from './js/modules/process.js';
import { initCompare } from './js/modules/compare.js';
import { initCounters } from './js/modules/counters.js';
import { initSpotlight } from './js/modules/spotlight.js';
import { initMapConsent } from './js/modules/map-consent.js';
import { initMisc } from './js/modules/misc.js';

initSmoothScroll();
initNav();
initOpeningHours();
initMisc();

// Reihenfolge wichtig: gepinnte Abschnitte von oben nach unten anlegen
initHero();
initTextHighlight();
initGloss();
initProcess();

initReveal();
initParallax();
initCompare();
initCounters();
initSpotlight();
initMapConsent();

// Nach dem Laden von Schriften/Bildern Positionen neu berechnen
window.addEventListener('load', () => ScrollTrigger.refresh());
document.fonts?.ready.then(() => ScrollTrigger.refresh());
