import { business, dayNames } from '../../config/business.js';

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

const WEEKDAY_INDEX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

/** Aktueller Wochentag & Minuten in der Zeitzone des Betriebs (unabhängig vom Besucher). */
function nowInBusinessTz(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: business.timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type).value;
  return { day: WEEKDAY_INDEX[get('weekday')], minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

export function getOpenStatus(date = new Date()) {
  const { day, minutes } = nowInBusinessTz(date);
  const today = business.hours[day] ?? [];

  const current = today.find(([from, to]) => minutes >= toMinutes(from) && minutes < toMinutes(to));
  if (current) {
    const minsLeft = toMinutes(current[1]) - minutes;
    return {
      open: true,
      soon: minsLeft <= 30,
      text: minsLeft <= 30 ? `Schließt bald · ${current[1]} Uhr` : `Geöffnet · bis ${current[1]} Uhr`,
    };
  }

  const laterToday = today.find(([from]) => minutes < toMinutes(from));
  if (laterToday) {
    const hadSlotBefore = today.some(([, to]) => minutes >= toMinutes(to));
    return {
      open: false,
      text: hadSlotBefore ? `Mittagspause · ab ${laterToday[0]} Uhr` : `Geschlossen · öffnet ${laterToday[0]} Uhr`,
    };
  }

  for (let offset = 1; offset <= 7; offset++) {
    const nextDay = (day + offset) % 7;
    const slots = business.hours[nextDay] ?? [];
    if (slots.length) {
      const when = offset === 1 ? 'morgen' : dayNames[nextDay].slice(0, 2) + '.';
      return { open: false, text: `Geschlossen · öffnet ${when} ${slots[0][0]} Uhr` };
    }
  }
  return { open: false, text: 'Geschlossen' };
}

function renderStatus() {
  const status = getOpenStatus();
  document.querySelectorAll('[data-open-status]').forEach((el) => {
    el.classList.toggle('is-open', status.open && !status.soon);
    el.classList.toggle('is-soon', Boolean(status.soon));
    el.classList.toggle('is-closed', !status.open);
    const text = el.querySelector('[data-open-status-text]');
    if (text) text.textContent = status.text;
  });
}

function renderTable() {
  const table = document.querySelector('[data-hours-table] tbody');
  if (!table) return;
  const { day: today } = nowInBusinessTz();
  const order = [1, 2, 3, 4, 5, 6, 0];

  table.innerHTML = order
    .map((day) => {
      const slots = business.hours[day] ?? [];
      const value = slots.length ? slots.map(([a, b]) => `${a}–${b}`).join(', ') : 'Geschlossen';
      const isToday = day === today;
      return `<tr class="${isToday ? 'is-today' : ''}${slots.length ? '' : ' is-closed'}">
        <th scope="row">${dayNames[day]}${isToday ? ' <span class="hours__today">Heute</span>' : ''}</th>
        <td>${value}</td>
      </tr>`;
    })
    .join('');
}

export function initOpeningHours() {
  renderTable();
  renderStatus();
  setInterval(renderStatus, 60_000);
}
