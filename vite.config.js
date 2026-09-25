import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

const root = import.meta.dirname;
const partialsDir = resolve(root, 'partials');
const INCLUDE_RE = /<!--\s*@include\s+([\w./-]+)\s*-->/g;

/**
 * Ersetzt <!-- @include datei.html --> durch den Inhalt aus /partials.
 * So werden Header, Footer & Co. nur an einer Stelle gepflegt.
 */
function htmlPartials() {
  const render = (html, depth = 0) => {
    if (depth > 10) throw new Error('Partials: zu tiefe Verschachtelung');
    return html.replace(INCLUDE_RE, (_, file) =>
      render(readFileSync(resolve(partialsDir, file), 'utf-8'), depth + 1),
    );
  };

  return {
    name: 'html-partials',
    transformIndexHtml: { order: 'pre', handler: (html) => render(html) },
    handleHotUpdate({ file, server }) {
      if (file.startsWith(partialsDir)) {
        server.ws.send({ type: 'full-reload' });
        return [];
      }
    },
  };
}

export default defineConfig({
  plugins: [htmlPartials()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        impressum: resolve(root, 'impressum.html'),
        datenschutz: resolve(root, 'datenschutz.html'),
        notFound: resolve(root, '404.html'),
      },
    },
  },
});
