/**
 * Zentrale Unternehmensdaten.
 * Öffnungszeiten hier ändern – Tabelle und „Jetzt geöffnet“-Status
 * auf der Website aktualisieren sich automatisch.
 */
export const business = {
  name: 'M. Bulleci Fahrzeugpflege & Smartrepair',
  shortName: 'Bulleci',
  phone: '08341 9546110',
  phoneHref: 'tel:+4983419546110',
  street: 'Wolftrigelstraße 1 A',
  zip: '87600',
  city: 'Kaufbeuren',
  rating: 4.9,
  reviewCount: 66,
  timeZone: 'Europe/Berlin',

  // 0 = Sonntag … 6 = Samstag
  hours: {
    1: [['08:00', '12:00'], ['13:00', '18:00']],
    2: [['08:00', '12:00'], ['13:00', '18:00']],
    3: [['08:00', '12:00'], ['13:00', '18:00']],
    4: [['08:00', '12:00'], ['13:00', '18:00']],
    5: [['08:00', '16:00']],
    6: [['09:30', '12:00']],
    0: [],
  },
};

const query = encodeURIComponent(`${business.name}, ${business.street}, ${business.zip} ${business.city}`);

export const links = {
  maps: `https://www.google.com/maps/search/?api=1&query=${query}`,
  route: `https://www.google.com/maps/dir/?api=1&destination=${query}`,
  mapEmbed: `https://www.google.com/maps?q=${query}&output=embed`,
};

export const dayNames = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
