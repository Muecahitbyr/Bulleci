import { gsap, ScrollTrigger, motionEnabled } from '../core/motion.js';
import { business } from '../../config/business.js';

const MAX_UPLOAD = 10 * 1024 * 1024;

export function initTuning() {
  initCars();
  initRequestForm();
}

/** Beispiel-Karten: Balken wachsen, Mehrleistung und PS zählen hoch. */
function initCars() {
  if (!motionEnabled) return;

  document.querySelectorAll('[data-car]').forEach((car) => {
    const bars = car.querySelectorAll('[data-car-bar]');
    const gain = car.querySelector('[data-car-gain]');
    const tunedEl = car.querySelector('[data-car-tuned]');
    const stock = Number(car.dataset.stock);
    const tuned = Number(car.dataset.tuned);
    const state = { ps: stock };

    gsap.set(bars, { scaleX: 0 });
    gsap.set(gain, { scale: 0.4, opacity: 0 });
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
          .to(state, { ps: tuned, duration: 1.6, ease: 'power3.out', onUpdate: () => (tunedEl.textContent = Math.round(state.ps)) }, 0.55)
          .to(gain, { scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(2.4)' }, 1.1),
    });
  });
}

/** Anfrage mit Foto vom Fahrzeugschein. */
function initRequestForm() {
  const form = document.querySelector('[data-tuning-form]');
  if (!form) return;

  const upload = form.querySelector('[data-upload]');
  const input = form.querySelector('[data-upload-input]');
  const empty = upload.querySelector('.upload__empty');
  const preview = upload.querySelector('[data-upload-preview]');
  const previewImg = upload.querySelector('[data-upload-img]');
  const previewName = upload.querySelector('[data-upload-name]');
  const status = form.querySelector('[data-form-status]');
  const submit = form.querySelector('[type="submit"]');
  const done = form.parentElement.querySelector('[data-form-done]');
  let previewUrl = null;

  const setStatus = (html, isError = false) => {
    status.innerHTML = html;
    status.classList.toggle('is-error', isError);
  };
  const callHint = `Rufen Sie uns gerne an: <a href="${business.phoneHref}">${business.phone}</a>`;

  // Vorschau des gewählten Fotos
  const showFile = () => {
    const file = input.files[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = null;
    upload.classList.toggle('has-file', Boolean(file));
    upload.classList.remove('is-invalid');
    empty.hidden = Boolean(file);
    preview.hidden = !file;
    if (!file) return;

    previewName.textContent = file.name;
    if (file.type.startsWith('image/')) {
      previewUrl = URL.createObjectURL(file);
      previewImg.src = previewUrl;
    } else {
      previewImg.removeAttribute('src');
    }
    if (motionEnabled) gsap.from(preview, { y: 12, opacity: 0, duration: 0.6, ease: 'expo.out' });
  };
  input.addEventListener('change', showFile);

  // Desktop: Datei per Drag & Drop
  ['dragenter', 'dragover'].forEach((type) =>
    upload.addEventListener(type, (e) => {
      e.preventDefault();
      upload.classList.add('is-dragover');
    }),
  );
  ['dragleave', 'drop'].forEach((type) => upload.addEventListener(type, () => upload.classList.remove('is-dragover')));
  upload.addEventListener('drop', (e) => {
    e.preventDefault();
    if (!e.dataTransfer?.files.length) return;
    input.files = e.dataTransfer.files;
    showFile();
  });

  // Fehlermarkierung verschwindet, sobald korrigiert wird
  form.addEventListener('input', (e) => e.target.closest('.field, .check')?.classList.remove('is-invalid'));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const invalid = [...form.elements].filter((el) => el.willValidate && !el.checkValidity());
    invalid.forEach((el) => el.closest('.field, .check, .upload')?.classList.add('is-invalid'));
    if (invalid.length) {
      const first = invalid[0];
      const message =
        first === input
          ? 'Bitte laden Sie ein Foto Ihres Fahrzeugscheins hoch.'
          : first.type === 'checkbox'
            ? 'Bitte stimmen Sie der Verarbeitung Ihrer Angaben zu.'
            : 'Bitte füllen Sie die markierten Felder aus.';
      setStatus(message, true);
      first.focus();
      if (motionEnabled) gsap.fromTo(form, { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
      return;
    }

    if (!business.tuningFormEndpoint) {
      setStatus(`Die Online-Anfrage ist gerade nicht verfügbar. ${callHint}`, true);
      return;
    }

    submit.disabled = true;
    setStatus('Wird gesendet …');

    try {
      const data = new FormData(form);
      const file = await compressImage(input.files[0]);
      if (file.size > MAX_UPLOAD) {
        throw new Error('too-large');
      }
      data.set('fahrzeugschein', file, file.name);

      const response = await fetch(business.tuningFormEndpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      showDone();
    } catch (error) {
      setStatus(
        error.message === 'too-large'
          ? 'Das Foto ist zu groß (max. 10 MB). Bitte wählen Sie ein kleineres Bild.'
          : `Das hat leider nicht geklappt. ${callHint}`,
        true,
      );
      submit.disabled = false;
    }
  });

  const showDone = () => {
    form.hidden = true;
    done.hidden = false;
    done.focus();
    if (!motionEnabled) return;
    const check = done.querySelectorAll('.request__check circle, .request__check path');
    check.forEach((el) => el.setAttribute('pathLength', '1'));
    gsap
      .timeline()
      .from(done, { y: 20, opacity: 0, duration: 0.7, ease: 'expo.out' })
      .fromTo(check, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut', stagger: 0.3 }, 0.1);
  };
}

/** Handyfotos verkleinern (schnellerer Upload), PDFs und kleine Bilder bleiben unverändert. */
async function compressImage(file, maxSize = 2200, quality = 0.85) {
  if (!file.type.startsWith('image/') || file.size < 1.5 * 1024 * 1024) return file;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.jpg`, { type: 'image/jpeg' });
  } catch {
    return file;
  }
}
