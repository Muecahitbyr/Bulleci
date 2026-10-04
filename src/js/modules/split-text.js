import { gsap, ScrollTrigger, motionEnabled } from '../core/motion.js';

/** Überschriften mit [data-split]: Wörter fahren einzeln aus einer Maske hoch. */
export function initSplitText() {
  if (!motionEnabled) return;

  document.querySelectorAll('[data-split]').forEach((el) => {
    const words = splitWords(el);
    gsap.set(words, { yPercent: 115, rotate: 6 });

    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () =>
        gsap.to(words, { yPercent: 0, rotate: 0, duration: 1.2, ease: 'expo.out', stagger: 0.07 }),
    });
  });
}

/** Zerlegt alle Textknoten in Wörter (Maske + Wort), verschachtelte Spans bleiben erhalten. */
function splitWords(root) {
  const words = [];

  const walk = (node, gradient) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        // Verlaufstext: Verlauf pro Wort, sonst greift background-clip nicht durch die Masken
        const isGradient = child.classList.contains('text-gradient');
        if (isGradient) child.classList.remove('text-gradient');
        walk(child, gradient || isGradient);
        return;
      }
      if (child.nodeType !== Node.TEXT_NODE) return;

      const frag = document.createDocumentFragment();
      child.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (!part.trim()) {
          frag.append(' ');
          return;
        }
        const mask = document.createElement('span');
        const word = document.createElement('span');
        mask.className = 'split-mask';
        word.className = gradient ? 'split-word text-gradient' : 'split-word';
        word.textContent = part;
        mask.append(word);
        frag.append(mask);
        words.push(word);
      });
      child.replaceWith(frag);
    });
  };

  walk(root, false);
  return words;
}
