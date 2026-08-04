/* ─────────────────────────────────────────────────────────────────────────────
 *  LA CARTA COMO PNG
 *
 *  Un correo no pinta SVG: Gmail y Outlook lo descartan. Así que la rueda se
 *  dibuja como SVG (ruedaCartaSvg.ts) y aquí se convierte en PNG, que es lo
 *  único que cualquier cliente de correo abre sin pedir permiso.
 *
 *  La fuente se le pasa EXPLÍCITA (el .ttf que viene con `dejavu-fonts-ttf`, no
 *  una del sistema): en el servidor no hay Segoe UI Symbol ni ninguna otra con
 *  ☉ ☽ ♀ ♃, y si se dejase elegir a la máquina el dibujo saldría distinto en
 *  local y en producción, o con cuadraditos en vez de planetas.
 * ───────────────────────────────────────────────────────────────────────────── */

import { Resvg } from '@resvg/resvg-js';
import * as path from 'path';
import type { CartaNatal } from '../metodoAstrologia/cartaNatal.types';
import { FUENTE_CARTA, ruedaCartaSvg } from './ruedaCartaSvg';

/** El .ttf del paquete `dejavu-fonts-ttf` (se instala con el backend). */
function ficheroFuente(): string {
  // require.resolve y no una ruta a mano: así vale igual desde src/ y desde dist/.
  const raiz = path.dirname(require.resolve('dejavu-fonts-ttf/package.json'));
  return path.join(raiz, 'ttf', 'DejaVuSans.ttf');
}

/**
 * La carta natal en PNG, cuadrada. `lado` es el tamaño del SVG de partida; el
 * PNG sale al doble de lo que se muestra en el correo (560 px) para que no se
 * vea pixelado en pantallas retina.
 */
export function cartaPng(carta: CartaNatal, lado = 1120): Buffer {
  const svg = ruedaCartaSvg(carta, lado);

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: lado },
    // Fondo transparente: la tarjeta de noche ya la dibuja el propio SVG, con
    // sus esquinas redondeadas, y así se apoya en el turquesa del correo.
    font: {
      fontFiles: [ficheroFuente()],
      loadSystemFonts: false,
      defaultFontFamily: FUENTE_CARTA,
    },
  });

  return resvg.render().asPng();
}
