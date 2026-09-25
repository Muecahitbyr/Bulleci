import '@fontsource-variable/inter';
import './styles/main.css';

import { initSmoothScroll } from './js/core/smooth-scroll.js';
import { initNav } from './js/modules/nav.js';
import { initOpeningHours } from './js/modules/opening-hours.js';
import { initReveal } from './js/modules/reveal.js';
import { initMisc } from './js/modules/misc.js';

initSmoothScroll();
initNav();
initOpeningHours();
initReveal();
initMisc();
