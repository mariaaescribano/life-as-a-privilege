/* ─────────────────────────────────────────────────────────────────────────────
 *  LA RUEDA DE LA CARTA NATAL, DIBUJADA EN EL SERVIDOR
 *
 *  Hace falta para poder MANDARLA POR CORREO: un email no pinta SVG (Gmail y
 *  Outlook lo bloquean) ni ejecuta nada, así que la carta tiene que salir de
 *  aquí ya convertida en PNG (ver cartaPng.ts).
 *
 *  Es el mismo dibujo que ve en pantalla —misma geometría y mismas piezas que
 *  frontend/components/metodo/pdf/ruedaCarta.ts— pero escrito como SVG en vez de
 *  sobre un canvas, porque en Node no hay canvas:
 *    · gradoAVisualRad  → el reparto de grados por casa (Placidus «igualado»)
 *    · SIGNO_TRAZOS     → los signos a trazo, nunca los caracteres ♈♉♊
 *    · COLOR_ASPECTO    → el color de cada tipo de aspecto
 *
 *  Si algún día cambia el dibujo de la web, hay que cambiarlo aquí también: son
 *  dos lienzos distintos (canvas y SVG) que tienen que contar lo mismo.
 * ───────────────────────────────────────────────────────────────────────────── */

import type { CartaNatal, TipoAspecto } from '../metodoAstrologia/cartaNatal.types';

/* ── Piezas compartidas con el frontend ─────────────────────────────────────── */

/** Orden del zodíaco (Aries → Piscis). */
const SIGNOS_ORDEN = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
  'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis',
];

/** Trazos de cada signo en un lienzo de 24×24, para pintar con `stroke`.
 *  Copia literal de frontend/components/metodo/signosIconos.ts. */
const SIGNO_TRAZOS: Record<string, string[]> = {
  Aries: [
    'M12 19 C12 13.4 11.2 9 9 7 C7.2 5.4 5.2 6 4.6 7.9 C4.1 9.5 4.8 11.1 6.1 11.9',
    'M12 19 C12 13.4 12.8 9 15 7 C16.8 5.4 18.8 6 19.4 7.9 C19.9 9.5 19.2 11.1 17.9 11.9',
  ],
  Tauro: [
    'M16.6 15.1 A4.6 4.6 0 1 1 7.4 15.1 A4.6 4.6 0 1 1 16.6 15.1',
    'M5.6 5.4 C5.6 9.4 8.4 10.8 12 10.8 C15.6 10.8 18.4 9.4 18.4 5.4',
  ],
  'Géminis': [
    'M6.6 5 C8.6 6.7 15.4 6.7 17.4 5',
    'M6.6 19 C8.6 17.3 15.4 17.3 17.4 19',
    'M9.6 5.8 V18.2',
    'M14.4 5.8 V18.2',
  ],
  'Cáncer': [
    'M9.85 10.2 A2.05 2.05 0 1 1 5.75 10.2 A2.05 2.05 0 1 1 9.85 10.2',
    'M5.75 9.9 C7 6.6 14 5.6 20 8.8',
    'M18.25 13.8 A2.05 2.05 0 1 1 14.15 13.8 A2.05 2.05 0 1 1 18.25 13.8',
    'M18.25 14.1 C17 17.4 10 18.4 4 15.2',
  ],
  Leo: [
    'M10.6 15.4 A3.2 3.2 0 1 1 4.2 15.4 A3.2 3.2 0 1 1 10.6 15.4',
    'M10.4 13 C10.6 8.5 12.4 5.4 15.2 5.4 C17.6 5.4 18.9 7.6 18.1 9.8 C17.4 11.7 15.4 13.1 14 14 C12.6 14.9 12.9 17 14.8 17.8 C16.4 18.5 18.2 18 19.3 16.8',
  ],
  Virgo: [
    'M5 8 V17.6',
    'M5 9.8 C5 7.4 8.4 7.4 8.4 9.8 V17.6',
    'M8.4 9.8 C8.4 7.4 11.8 7.4 11.8 9.8 V15.2',
    'M11.8 15.2 C11.8 18.4 14.9 19.7 16.9 17.9 C18.6 16.3 17.2 13.5 14.8 14 C13 14.4 12.5 16.3 13.9 17.7 L17.8 19.4',
  ],
  Libra: [
    'M4 19.2 H20',
    'M4 15 H8.1 A3.95 3.95 0 0 1 15.9 15 H20',
  ],
  Escorpio: [
    'M5 8 V17.6',
    'M5 9.8 C5 7.4 8.4 7.4 8.4 9.8 V17.6',
    'M8.4 9.8 C8.4 7.4 11.8 7.4 11.8 9.8 V18.4',
    'M11.8 18.4 L19.4 12.5',
    'M15.6 12.5 H19.4 V16.3',
  ],
  Sagitario: [
    'M5 19 L18.4 5.6',
    'M12.8 5.6 H18.4 V11.2',
    'M7.4 10.8 L12.8 16.2',
  ],
  Capricornio: [
    'M5 8.4 V16.4',
    'M5 10 C5 7.6 8.2 7.2 9.5 9.8 L11.9 14.6',
    'M11.9 14.6 C13.2 17.3 16.6 17.5 17.8 15.1 C18.9 13 17.2 10.9 15 11.4 C13.2 11.9 12.8 14 14.5 15.1',
  ],
  Acuario: [
    'M4 11.2 L7.2 8.8 L10.4 11.2 L13.6 8.8 L16.8 11.2 L20 8.8',
    'M4 16.4 L7.2 14 L10.4 16.4 L13.6 14 L16.8 16.4 L20 14',
  ],
  Piscis: [
    'M5.4 5.4 A7.8 7.8 0 0 1 5.4 18.6',
    'M18.6 5.4 A7.8 7.8 0 0 0 18.6 18.6',
    'M6.6 12 H17.4',
  ],
};

const COLOR_ASPECTO: Record<TipoAspecto, string> = {
  conjuncion: '#ffd97d',
  oposicion: '#ff6b6b',
  cuadratura: '#ff8a4c',
  trigono: '#6ec1ff',
  sextil: '#80efd8',
  semisextil: '#a8d8a0',
  quincuncio: '#d0a0c8',
};

/** Los cuerpos, con su símbolo y su color (como en astrologiaData.ts). */
const CUERPOS: { key: string; symbol: string; color: string }[] = [
  { key: 'ascendente', symbol: '↑', color: '#feffe4' },
  { key: 'sol',        symbol: '☉', color: '#FFD97D' },
  { key: 'luna',       symbol: '☽', color: '#C8C8E8' },
  { key: 'mercurio',   symbol: '☿', color: '#A8B8C8' },
  { key: 'venus',      symbol: '♀', color: '#FFB8D0' },
  { key: 'marte',      symbol: '♂', color: '#FF7055' },
  { key: 'jupiter',    symbol: '♃', color: '#FFBA60' },
  { key: 'saturno',    symbol: '♄', color: '#E0CC80' },
  { key: 'urano',      symbol: '♅', color: '#80EFD8' },
  { key: 'neptuno',    symbol: '♆', color: '#6090FF' },
  { key: 'pluton',     symbol: '♇', color: '#B080E0' },
  { key: 'quiron',     symbol: '⚷', color: '#A8324A' },
  { key: 'lilith',     symbol: '⚸', color: '#8A5FA8' },
  { key: 'nodoNorte',  symbol: '☊', color: '#7BB8E0' },
  { key: 'nodoSur',    symbol: '☋', color: '#C8806A' },
];

/**
 * Grado eclíptico → ángulo de la carta. Las cuatro cúspides angulares quedan
 * ancladas (AC a la izquierda, IC abajo, DC a la derecha, MC arriba) y cada casa
 * ocupa 30° del dibujo, aunque en el cielo mida más o menos.
 */
function gradoAVisualRad(grado: number, cusps: number[]): number {
  const lon = ((grado % 360) + 360) % 360;
  for (let h = 0; h < 12; h++) {
    const a = cusps[h];
    const b = cusps[(h + 1) % 12];
    const span = (((b - a) % 360) + 360) % 360 || 360;
    const offset = (((lon - a) % 360) + 360) % 360;
    if (offset < span) {
      const f = offset / span;
      return Math.PI + h * (Math.PI / 6) + f * (Math.PI / 6);
    }
  }
  return Math.PI;
}

/**
 * Separa los símbolos que caen casi encima (conjunciones): si no, se solapan y
 * no se lee ninguno. Solo se mueve el SÍMBOLO: la marca del grado exacto y las
 * líneas de aspecto se quedan en su ángulo real.
 */
function separar(angulos: { key: string; ang: number }[], minSep: number) {
  const orden = [...angulos].sort((a, b) => a.ang - b.ang);
  for (let vuelta = 0; vuelta < 4; vuelta++) {
    let movido = false;
    for (let i = 0; i < orden.length; i++) {
      const a = orden[i];
      const b = orden[(i + 1) % orden.length];
      let d = b.ang - a.ang;
      if (i === orden.length - 1) d += Math.PI * 2;
      if (d < minSep) {
        const empuje = (minSep - d) / 2;
        a.ang -= empuje;
        b.ang += empuje;
        movido = true;
      }
    }
    if (!movido) break;
  }
  return new Map(orden.map((o) => [o.key, o.ang]));
}

/* ── El SVG ─────────────────────────────────────────────────────────────────── */

/** Familia con la que se escriben los símbolos y los números (ver cartaPng.ts). */
export const FUENTE_CARTA = 'DejaVu Sans';

const num = (n: number) => (Math.round(n * 100) / 100).toString();

/**
 * Números pseudoaleatorios REPETIBLES (mismo generador → misma secuencia).
 *
 * El cielo de fondo se dibuja con esto y no con Math.random a propósito: así la
 * carta de una misma persona sale idéntica cada vez que se genera, y un cambio
 * de diseño se puede comparar con el anterior sin que se muevan las estrellas.
 */
function azarEstable(semilla: number) {
  let s = semilla;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

/**
 * El fondo estrellado.
 *
 * Estrellas pequeñas repartidas por toda la tarjeta, más unas pocas grandes con
 * halo. Dentro del disco de los aspectos se aclaran mucho: ahí van las líneas de
 * colores y con estrellas detrás no se leerían.
 */
function estrellas(lado: number, rDespejado: number): string {
  const azar = azarEstable(20240712);
  const cx = lado / 2;
  const cy = lado / 2;
  const salida: string[] = [];

  // Dos nubes de polvo enormes y casi invisibles: es lo que le da hondura al
  // fondo. Si se ven como manchas, están demasiado fuertes.
  salida.push(
    `<circle cx="${num(lado * 0.24)}" cy="${num(lado * 0.2)}" r="${num(lado * 0.3)}" fill="#2a3a86" fill-opacity="0.12" filter="url(#brilloAncho)"/>`,
    `<circle cx="${num(lado * 0.8)}" cy="${num(lado * 0.78)}" r="${num(lado * 0.26)}" fill="#1f4a72" fill-opacity="0.1" filter="url(#brilloAncho)"/>`,
  );

  const TENUES = 620;
  for (let i = 0; i < TENUES; i++) {
    const x = azar() * lado;
    const y = azar() * lado;
    const t = azar();
    const brillo = azar();

    // En el centro (donde van los aspectos) solo se queda una de cada cinco.
    const dentro = Math.hypot(x - cx, y - cy) < rDespejado;
    if (dentro && brillo > 0.2) continue;

    const r = lado * (0.0005 + t * 0.0011);
    const opacidad = 0.18 + brillo * 0.6;
    // Alguna con un matiz frío o cálido: un cielo de estrellas todas iguales se
    // ve fabricado.
    const color = t > 0.9 ? '#cfe4ff' : t < 0.08 ? '#ffe8c8' : '#ffffff';
    salida.push(
      `<circle cx="${num(x)}" cy="${num(y)}" r="${num(r)}" fill="${color}" fill-opacity="${num(opacidad)}"/>`,
    );
  }

  // Las brillantes: pocas, con un halo CORTO (con el ancho salían como manchas
  // de humedad) y un destello en cruz, que es lo que las lee como estrella.
  for (let i = 0; i < 16; i++) {
    const x = azar() * lado;
    const y = azar() * lado;
    if (Math.hypot(x - cx, y - cy) < rDespejado * 1.06) continue;
    const r = lado * (0.0013 + azar() * 0.0011);
    const rayo = r * 5.2;
    salida.push(
      `<circle cx="${num(x)}" cy="${num(y)}" r="${num(r * 2.1)}" fill="#dfeaff" fill-opacity="0.5" filter="url(#brilloTenue)"/>`,
      `<path d="M${num(x - rayo)} ${num(y)} H${num(x + rayo)} M${num(x)} ${num(y - rayo)} V${num(y + rayo)}" stroke="#eaf3ff" stroke-opacity="0.42" stroke-width="${num(r * 0.5)}" stroke-linecap="round"/>`,
      `<circle cx="${num(x)}" cy="${num(y)}" r="${num(r)}" fill="#ffffff" fill-opacity="0.98"/>`,
    );
  }

  return salida.join('\n');
}

/** Punto del lienzo para un ángulo de carta y un radio (y crece hacia abajo). */
const punto = (cx: number, cy: number, ang: number, r: number) => ({
  x: cx + Math.cos(ang) * r,
  y: cy - Math.sin(ang) * r,
});

/**
 * La carta entera como SVG cuadrado de `lado` píxeles, sobre una tarjeta de
 * noche con las esquinas redondeadas (fuera de la tarjeta el PNG queda
 * transparente, para que se apoye en el turquesa del correo).
 */
export function ruedaCartaSvg(carta: CartaNatal, lado = 1100): string {
  const cusps = carta.cusps ?? [];
  const cx = lado / 2;
  const cy = lado / 2;

  // La rueda no llena la tarjeta: deja aire alrededor.
  const size = lado * 0.9;
  const R = size / 2;
  const rZodiacoExt = R;
  const rZodiacoInt = R * 0.855;
  const rCasasInt = R * 0.70;
  const rPlanetas = R * 0.60;
  const rMarcaFuera = rCasasInt;
  const rMarcaDentro = R * 0.665;
  const rAspectos = R * 0.505;

  const partes: string[] = [];

  // ── Fondo: noche estrellada + el velo del disco central ──
  partes.push(`<rect x="0" y="0" width="${lado}" height="${lado}" rx="${num(lado * 0.03)}" fill="#040814"/>`);
  partes.push(`<rect x="0" y="0" width="${lado}" height="${lado}" rx="${num(lado * 0.03)}" fill="url(#cielo)"/>`);
  partes.push(estrellas(lado, rAspectos));
  // Velo sobre el disco de los aspectos: las líneas de colores se leen sobre
  // negro, no sobre un campo de estrellas.
  partes.push(`<circle cx="${num(cx)}" cy="${num(cy)}" r="${num(rCasasInt)}" fill="url(#velo)"/>`);

  if (cusps.length < 12) {
    // Sin cúspides no hay carta que dibujar: se devuelve la tarjeta vacía antes
    // de intentar repartir grados por casas que no existen.
    return envolver(lado, partes.join('\n'));
  }

  // ── Círculos del armazón ──
  const circulo = (r: number, color: string, ancho: number, opacidad: number) =>
    `<circle cx="${num(cx)}" cy="${num(cy)}" r="${num(r)}" fill="none" stroke="${color}" stroke-opacity="${opacidad}" stroke-width="${num(ancho)}"/>`;
  partes.push(circulo(rZodiacoExt, '#ffffff', size * 0.0022, 0.62));
  partes.push(circulo(rZodiacoInt, '#ffffff', size * 0.0014, 0.42));
  partes.push(circulo(rCasasInt, '#ffffff', size * 0.0018, 0.5));
  partes.push(circulo(rAspectos, '#ffffff', size * 0.001, 0.16));

  const linea = (
    a: number, r1: number, r2: number, color: string, ancho: number, opacidad: number,
  ) => {
    const p1 = punto(cx, cy, a, r1);
    const p2 = punto(cx, cy, a, r2);
    return `<line x1="${num(p1.x)}" y1="${num(p1.y)}" x2="${num(p2.x)}" y2="${num(p2.y)}" stroke="${color}" stroke-opacity="${opacidad}" stroke-width="${num(ancho)}" stroke-linecap="round"/>`;
  };

  // ── Divisiones de signo y su glifo, tangente al anillo ──
  const inicioSigno: number[] = [];
  for (let i = 0; i < 12; i++) inicioSigno.push(gradoAVisualRad(i * 30, cusps));

  for (const a of inicioSigno) {
    partes.push(linea(a, rZodiacoInt, rZodiacoExt, '#ffffff', size * 0.0012, 0.34));
  }

  const ladoGlifo = size * 0.042;
  const escala = ladoGlifo / 24;
  for (let i = 0; i < 12; i++) {
    const a1 = inicioSigno[i];
    let a2 = inicioSigno[(i + 1) % 12];
    if (a2 <= a1) a2 += Math.PI * 2;
    const medio = (a1 + a2) / 2;
    const p = punto(cx, cy, medio, (rZodiacoInt + rZodiacoExt) / 2);
    const giro = ((-medio + Math.PI / 2) * 180) / Math.PI;
    const trazos = SIGNO_TRAZOS[SIGNOS_ORDEN[i]] ?? [];
    partes.push(
      `<g transform="translate(${num(p.x)} ${num(p.y)}) rotate(${num(giro)}) scale(${num(escala)}) translate(-12 -12)" fill="none" stroke="#ffffff" stroke-opacity="0.92" stroke-width="${num((size * 0.0026) / escala)}" stroke-linecap="round" stroke-linejoin="round">` +
      trazos.map((d) => `<path d="${d}"/>`).join('') +
      `</g>`,
    );
  }

  // ── Casas: las cúspides caen en π + h·π/6 por construcción ──
  for (let h = 0; h < 12; h++) {
    const a = Math.PI + h * (Math.PI / 6);
    const angular = h === 0 || h === 3 || h === 6 || h === 9; // AC, IC, DC, MC
    partes.push(
      linea(
        a,
        angular ? 0 : rCasasInt,
        rZodiacoInt,
        '#ffffff',
        angular ? size * 0.0016 : size * 0.001,
        angular ? 0.5 : 0.22,
      ),
    );
  }

  const tamNumero = Math.round(size * 0.026);
  for (let h = 0; h < 12; h++) {
    const a = Math.PI + (h + 0.5) * (Math.PI / 6);
    const p = punto(cx, cy, a, (rCasasInt + rZodiacoInt) / 2);
    partes.push(
      `<text x="${num(p.x)}" y="${num(p.y + tamNumero * 0.35)}" text-anchor="middle" font-family="${FUENTE_CARTA}" font-size="${tamNumero}" fill="#ffffff" fill-opacity="0.6">${h + 1}</text>`,
    );
  }

  // ── Ángulos reales de cada cuerpo presente en la carta ──
  const presentes = CUERPOS.map((c) => {
    const pos = carta.planetas?.find((p) => p.planeta === c.key);
    return pos ? { cuerpo: c, grado: pos.grado } : null;
  }).filter((x): x is { cuerpo: (typeof CUERPOS)[number]; grado: number } => x !== null);

  const angReal = new Map(presentes.map((p) => [p.cuerpo.key, gradoAVisualRad(p.grado, cusps)]));

  // ── Aspectos: en el ángulo REAL, nunca en el separado ──
  for (const asp of carta.aspectos ?? []) {
    const a1 = angReal.get(asp.a);
    const a2 = angReal.get(asp.b);
    if (a1 == null || a2 == null) continue;
    const p1 = punto(cx, cy, a1, rAspectos);
    const p2 = punto(cx, cy, a2, rAspectos);
    partes.push(
      `<line x1="${num(p1.x)}" y1="${num(p1.y)}" x2="${num(p2.x)}" y2="${num(p2.y)}" stroke="${COLOR_ASPECTO[asp.tipo] ?? '#ffffff'}" stroke-opacity="0.72" stroke-width="${num(size * 0.0016)}" stroke-linecap="round"/>`,
    );
  }

  // ── Cuerpos: marca en su grado exacto + símbolo, separado si se amontonan ──
  const angSimbolo = separar(
    presentes.map((p) => ({ key: p.cuerpo.key, ang: angReal.get(p.cuerpo.key)! })),
    (size * 0.052) / rPlanetas,
  );
  const tamSimbolo = Math.round(size * 0.044);

  for (const { cuerpo } of presentes) {
    const real = angReal.get(cuerpo.key)!;
    const suave = angSimbolo.get(cuerpo.key) ?? real;

    partes.push(linea(real, rMarcaFuera, rMarcaDentro, cuerpo.color, size * 0.0018, 0.9));

    const p = punto(cx, cy, suave, rPlanetas);
    if (Math.abs(suave - real) > 0.012) {
      const g1 = punto(cx, cy, real, rMarcaDentro);
      partes.push(
        `<line x1="${num(g1.x)}" y1="${num(g1.y)}" x2="${num(p.x)}" y2="${num(p.y)}" stroke="${cuerpo.color}" stroke-opacity="0.4" stroke-width="${num(size * 0.0009)}"/>`,
      );
    }

    // El planeta BRILLA: un halo redondo de su color detrás, el glifo difuminado
    // dos veces encima (ancho y corto) y por último el glifo nítido. Cuatro capas
    // porque un solo desenfoque se ve sucio y no luminoso.
    partes.push(
      `<circle cx="${num(p.x)}" cy="${num(p.y)}" r="${num(tamSimbolo * 0.62)}" fill="${cuerpo.color}" fill-opacity="0.26" filter="url(#brilloAncho)"/>`,
    );
    const texto = (extra: string) =>
      `<text x="${num(p.x)}" y="${num(p.y + tamSimbolo * 0.35)}" text-anchor="middle" font-family="${FUENTE_CARTA}" font-size="${tamSimbolo}" fill="${cuerpo.color}"${extra}>${escapar(cuerpo.symbol)}</text>`;
    partes.push(texto(` filter="url(#brilloAncho)" fill-opacity="0.9"`));
    partes.push(texto(` filter="url(#brilloTenue)" fill-opacity="0.95"`));
    partes.push(texto(''));
  }

  return envolver(lado, partes.join('\n'));
}

/** `&` y `<` de los símbolos, por si algún día alguno lleva un carácter así. */
const escapar = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function envolver(lado: number, cuerpo: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}" viewBox="0 0 ${lado} ${lado}">
  <defs>
    <radialGradient id="cielo" cx="50%" cy="46%" r="62%">
      <stop offset="0%" stop-color="#101a44"/>
      <stop offset="55%" stop-color="#0a1030"/>
      <stop offset="100%" stop-color="#03060f"/>
    </radialGradient>
    <radialGradient id="velo" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#040714" stop-opacity="0.94"/>
      <stop offset="72%" stop-color="#040714" stop-opacity="0.88"/>
      <stop offset="100%" stop-color="#040714" stop-opacity="0.6"/>
    </radialGradient>
    <filter id="brilloAncho" x="-120%" y="-120%" width="340%" height="340%">
      <feGaussianBlur stdDeviation="${num(lado * 0.011)}"/>
    </filter>
    <filter id="brilloTenue" x="-90%" y="-90%" width="280%" height="280%">
      <feGaussianBlur stdDeviation="${num(lado * 0.0034)}"/>
    </filter>
  </defs>
${cuerpo}
</svg>`;
}
