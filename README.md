# M. Bulleci Fahrzeugpflege & Smartrepair – Website

Moderne One-Page-Website im hellen Apple-Stil mit Parallax-Bildern, gepinnten Scroll-Szenen
und flüssigem Smooth-Scrolling.

## Tech-Stack

| Bereich       | Werkzeug                                                          |
| ------------- | ----------------------------------------------------------------- |
| Build / Dev   | [Vite](https://vitejs.dev) (Multi-Page)                           |
| Animationen   | [GSAP](https://gsap.com) + ScrollTrigger                          |
| Smooth Scroll | [Lenis](https://lenis.darkroom.engineering)                       |
| Schrift       | Inter (lokal via Fontsource, DSGVO-konform), auf Apple-Geräten SF |

## Loslegen

```bash
npm install
npm start         # startet das Projekt und öffnet den Browser (http://localhost:5173)
npm run dev       # wie start, nur ohne automatisches Öffnen
npm run build     # Produktions-Build nach /dist
npm run preview   # Build lokal testen
```

Der Inhalt von `dist/` kann auf jeden statischen Hoster hochgeladen werden
(z. B. Netlify, Vercel, IONOS, Strato, All-Inkl).

## Projektstruktur

```
├── index.html              Startseite
├── impressum.html          Impressum (Platzhalter ergänzen!)
├── datenschutz.html        Datenschutz (Vorlage – rechtlich prüfen lassen!)
├── 404.html                Fehlerseite
├── partials/               Wiederverwendbare HTML-Teile (<!-- @include … -->)
│   ├── head.html  header.html  footer.html
├── public/                 Statische Dateien (Favicon, robots.txt, Manifest)
│   └── images/             ⭐ Logo + alle Fotos (siehe images/README.md)
├── src/
│   ├── main.js             Einstieg Startseite
│   ├── legal.js            Einstieg Unterseiten
│   ├── config/business.js  ⭐ Öffnungszeiten, Telefon, Adresse
│   ├── js/core/            GSAP-Setup, Smooth-Scroll
│   ├── js/modules/         Ein Modul pro Feature (Hero, Parallax, Slider …)
│   └── styles/             base / layout / components / sections
└── vite.config.js          Multi-Page-Build + Partial-Plugin
```

## Inhalte pflegen

- **Öffnungszeiten:** nur in `src/config/business.js` ändern. Tabelle und der
  Live-Status („Geöffnet · bis 18:00 Uhr“, „Mittagspause“ …) aktualisieren sich
  automatisch – immer in deutscher Zeit, egal wo der Besucher ist.
- **Bilder:** in `public/images/` mit gleichem Dateinamen ersetzen – fertig.
  Übersicht aller Bilder und Formate: `public/images/README.md`.
- **Header / Footer:** in `partials/` – gilt sofort für alle Seiten.
- **Leistungen:** direkt in `index.html` im Abschnitt `#leistungen`.
- **Farben, Schriftgrößen, Abstände:** zentral in `src/styles/base/tokens.css`.

## Animationen

| Effekt                              | Modul                         |
| ----------------------------------- | ----------------------------- |
| Hero: Intro + Bild öffnet sich auf volle Breite | `js/modules/hero.js` |
| Bild-Parallax (`data-parallax-img`, `data-band-img`) | `js/modules/parallax.js` |
| Text leuchtet Wort für Wort auf     | `js/modules/text-highlight.js`|
| „Glanz.“-Zoom (gepinnt)             | `js/modules/gloss.js`         |
| Horizontaler Ablauf-Scroll          | `js/modules/process.js`       |
| Vorher/Nachher-Slider               | `js/modules/compare.js`       |
| Einblenden beim Scrollen (`data-reveal`) | `js/modules/reveal.js`   |
| Zähler, Karten-Spotlight            | `counters.js`, `spotlight.js` |

Bei aktivierter Systemeinstellung „Bewegung reduzieren“ werden alle
Animationen automatisch deaktiviert und alle Inhalte sofort angezeigt.

## Vor dem Go-live

- [ ] Impressum: Inhabername, E-Mail, ggf. USt-IdNr. und Handwerkskammer ergänzen
- [ ] Datenschutzerklärung: Hoster eintragen und rechtlich prüfen lassen
- [ ] Leistungsumfang mit dem Betrieb abstimmen
- [ ] Eigene Fotos einsetzen (aktuell Unsplash-Platzhalter), v. a. echtes Vorher/Nachher
- [ ] Domain in `public/robots.txt` eintragen, ggf. `sitemap.xml` ergänzen
