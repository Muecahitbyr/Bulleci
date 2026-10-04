import { gsap, ScrollTrigger, motionEnabled } from '../core/motion.js';
import { business } from '../../config/business.js';

export function initTuning() {
  document.querySelectorAll('[data-car]').forEach(initCar);
  initRequestForm();
}

/** Beispiel-Karte: Balken wachsen beim Erscheinen, Stage 1/2 umschaltbar. */
function initCar(car) {
  const bars = car.querySelectorAll('[data-car-bar]');
  const tunedBar = car.querySelector('[data-car-tuned-bar]');
  const gainEl = car.querySelector('[data-car-gain]');
  const tunedEl = car.querySelector('[data-car-tuned]');
  const priceEl = car.querySelector('[data-car-price]');
  const label = car.querySelector('[data-car-label]');
  const buttons = car.querySelectorAll('[data-car-stage]');
  const stock = Number(car.dataset.stock);
  const max = Number(car.dataset.max);
  // data-stage-1 / data-price-1 … (Bindestrich vor Ziffer bleibt im dataset-Namen erhalten)
  const values = (stage) => ({ ps: Number(car.dataset[`stage-${stage}`]), price: Number(car.dataset[`price-${stage}`]) });

  // Angezeigte Zahlen als animierbarer Zustand
  const state = { ps: values(1).ps, price: values(1).price };
  const render = () => {
    tunedEl.textContent = Math.round(state.ps);
    gainEl.textContent = `+${Math.round(state.ps - stock)}`;
    priceEl.textContent = Math.round(state.price);
  };

  const setStage = (stage) => {
    const { ps, price } = values(stage);
    buttons.forEach((btn) => btn.setAttribute('aria-pressed', String(btn.dataset.carStage === stage)));
    label.textContent = `Stage ${stage}`;
    car.dataset.stage = stage;

    if (!motionEnabled) {
      Object.assign(state, { ps, price });
      tunedBar.style.setProperty('--w', ps / max);
      render();
      return;
    }
    gsap.to(state, { ps, price, duration: 0.9, ease: 'power3.out', onUpdate: render, overwrite: true });
    gsap.to(tunedBar, { '--w': ps / max, duration: 0.9, ease: 'expo.out', overwrite: true });
    gsap.fromTo(gainEl, { scale: 0.85 }, { scale: 1, duration: 0.7, ease: 'back.out(3)' });
  };
  buttons.forEach((btn) => btn.addEventListener('click', () => setStage(btn.dataset.carStage)));

  // „Anfragen“ füllt das Formular mit Fahrzeug und gewählter Stufe vor
  car.querySelector('[data-car-ask]')?.addEventListener('click', () => {
    const form = document.querySelector('[data-tuning-form]');
    if (!form) return;
    form.elements.fahrzeug.value = car.querySelector('[data-car-ask]').dataset.carAsk;
    form.elements.wunsch.value = `Stage ${car.dataset.stage ?? '1'}`;
  });

  if (!motionEnabled) return;

  // Einstieg: Balken wachsen, Mehrleistung zählt hoch
  const intro = { ps: stock };
  gsap.set(bars, { scaleX: 0 });
  gsap.set(gainEl, { scale: 0.4, opacity: 0 });
  tunedEl.textContent = stock;

  ScrollTrigger.create({
    trigger: car,
    start: 'top 80%',
    once: true,
    onEnter: () =>
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .to(bars[0], { scaleX: 1, duration: 1.2 }, 0.2)
        .to(bars[1], { scaleX: 1, duration: 1.6 }, 0.55)
        .to(intro, { ps: state.ps, duration: 1.6, ease: 'power3.out', onUpdate: () => (tunedEl.textContent = Math.round(intro.ps)) }, 0.55)
        .to(gainEl, { scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(2.4)' }, 1.1),
  });
}

/** Anfrage: öffnet das E-Mail-Programm mit vorausgefüllter Nachricht. */
function initRequestForm() {
  const form = document.querySelector('[data-tuning-form]');
  if (!form) return;
  const status = form.querySelector('[data-form-status]');

  form.addEventListener('input', (e) => e.target.closest('.field')?.classList.remove('is-invalid'));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { fahrzeug, baujahr, wunsch, name, telefon, nachricht } = form.elements;

    if (!fahrzeug.value.trim()) {
      fahrzeug.closest('.field').classList.add('is-invalid');
      status.textContent = 'Bitte geben Sie Ihr Fahrzeug an.';
      status.classList.add('is-error');
      fahrzeug.focus();
      if (motionEnabled) gsap.fromTo(form, { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
      return;
    }

    const line = (label, field) => (field.value.trim() ? `${label}: ${field.value.trim()}` : null);
    const body = [
      'Hallo,',
      '',
      'ich interessiere mich für eine Softwareoptimierung.',
      '',
      line('Fahrzeug', fahrzeug),
      line('Baujahr', baujahr),
      `Wunsch: ${wunsch.value}`,
      line('Name', name),
      line('Telefon', telefon),
      nachricht.value.trim() ? `\nNachricht:\n${nachricht.value.trim()}` : null,
      '',
      'Ein Foto vom Fahrzeugschein habe ich angehängt.',
      '',
      'Viele Grüße',
    ]
      .filter((l) => l !== null)
      .join('\r\n');

    const subject = `Anfrage Softwareoptimierung – ${fahrzeug.value.trim()} (${wunsch.value})`;
    window.location.href = `mailto:${business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    status.classList.remove('is-error');
    status.textContent = 'Ihr E-Mail-Programm öffnet sich – bitte hängen Sie noch das Foto vom Fahrzeugschein an.';
  });
}
