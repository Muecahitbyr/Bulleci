/** Kleinkram: aktuelles Jahr im Footer. */
export function initMisc() {
  document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
}
