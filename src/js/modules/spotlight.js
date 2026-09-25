/** Lichtkegel, der auf Karten dem Mauszeiger folgt. */
export function initSpotlight() {
  if (!window.matchMedia('(hover: hover)').matches) return;

  document.querySelectorAll('[data-spotlight]').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });
}
