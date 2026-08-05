// ─────────────────────────────────────────────────────────────────────────
// Formas vectoriales para los PDF: ornamentos, emblemas y gráficos.
//
// Todo lo de aquí se dibuja con VECTORES (nada de imágenes): pesa casi nada,
// se imprime nítido a cualquier tamaño y se puede teñir con el color de cada
// disciplina. jsPDF solo sabe dibujar líneas, curvas de Bézier, círculos y
// rectángulos, así que las formas curvas (pétalos, arcos, coronas) se muestrean
// como polígonos de muchos lados: a la vista son curvas perfectas.
// ─────────────────────────────────────────────────────────────────────────
import type jsPDF from "jspdf";

export type RGB = [number, number, number];
export type Punto = [number, number];

/* ── Utilidades base ──────────────────────────────────────────────────────── */

/**
 * Dibuja con opacidad si el visor soporta GState; si no, dibuja opaco.
 * Es la pieza que permite los velos, las marcas de agua y los tintes suaves
 * sin romper nada en visores antiguos.
 *
 * OJO: en jsPDF `opacity` es SOLO la del relleno (`ca`). Si no se pasa también
 * `stroke-opacity` (`CA`), las líneas salen a plena tinta y una marca de agua
 * hecha de trazos —el loto, la espiral, el yin-yang— aparece encima del texto
 * como si nada. Van siempre las dos.
 */
export function conAlfa(doc: jsPDF, opacidad: number, dibujar: () => void): void {
  const GS = (doc as any).GState;
  if (GS) {
    try {
      doc.saveGraphicsState();
      doc.setGState(new GS({ opacity: opacidad, "stroke-opacity": opacidad }));
      dibujar();
      doc.restoreGraphicsState();
      return;
    } catch { /* sin soporte: se dibuja opaco */ }
  }
  dibujar();
}

/** Punto en un círculo. El ángulo va en grados y 0° es ARRIBA (como un reloj). */
export function polar(cx: number, cy: number, r: number, grados: number): Punto {
  const a = ((grados - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

/** Polilínea/polígono a partir de puntos absolutos. */
export function poligono(doc: jsPDF, pts: Punto[], estilo: "F" | "S" | "FD", cerrado = true): void {
  if (pts.length < 2) return;
  const deltas: number[][] = [];
  for (let i = 1; i < pts.length; i++) {
    deltas.push([pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]]);
  }
  doc.lines(deltas, pts[0][0], pts[0][1], [1, 1], estilo, cerrado);
}

/** Muestrea un arco de circunferencia como lista de puntos. */
export function puntosArco(
  cx: number, cy: number, r: number, desde: number, hasta: number, pasos = 48,
): Punto[] {
  const pts: Punto[] = [];
  for (let i = 0; i <= pasos; i++) {
    pts.push(polar(cx, cy, r, desde + ((hasta - desde) * i) / pasos));
  }
  return pts;
}

/** Arco dibujado (solo trazo). */
export function arco(
  doc: jsPDF, cx: number, cy: number, r: number, desde: number, hasta: number, pasos = 48,
): void {
  poligono(doc, puntosArco(cx, cy, r, desde, hasta, pasos), "S", false);
}

/** Sector de corona circular (el trozo de un donut). */
export function sectorAnillo(
  doc: jsPDF,
  cx: number, cy: number,
  rInt: number, rExt: number,
  desde: number, hasta: number,
  estilo: "F" | "S" | "FD" = "F",
): void {
  const pasos = Math.max(8, Math.round(Math.abs(hasta - desde) / 3));
  const fuera = puntosArco(cx, cy, rExt, desde, hasta, pasos);
  const dentro = puntosArco(cx, cy, rInt, hasta, desde, pasos);
  poligono(doc, [...fuera, ...dentro], estilo);
}

/* ── Ornamentos ───────────────────────────────────────────────────────────── */

/**
 * Filigrana de esquina: dos trazos en ángulo, un arco interior y un punto.
 * `sx`/`sy` valen 1 o -1 y dicen hacia dónde crece la esquina.
 */
export function filigranaEsquina(
  doc: jsPDF, x: number, y: number, sx: 1 | -1, sy: 1 | -1, color: RGB, largo = 16,
  /** Los dos puntitos del remate. Se quitan en filigranas pequeñas: sueltos y
   *  fuera del trazo parecen suciedad en vez de ornamento. */
  puntos = true,
): void {
  doc.setDrawColor(...color);
  doc.setLineWidth(0.5);
  doc.line(x, y, x + sx * largo, y);
  doc.line(x, y, x, y + sy * largo);

  doc.setLineWidth(0.22);
  const d = 2.6;
  doc.line(x + sx * d, y + sy * d, x + sx * (largo * 0.62), y + sy * d);
  doc.line(x + sx * d, y + sy * d, x + sx * d, y + sy * (largo * 0.62));

  // Volutita: un cuarto de arco que remata la esquina hacia dentro.
  const r = largo * 0.34;
  const cx = x + sx * (d + r);
  const cy = y + sy * (d + r);
  const base = sx > 0 ? (sy > 0 ? 180 : 90) : (sy > 0 ? 270 : 0);
  arco(doc, cx, cy, r, base, base + 90, 14);

  if (puntos) {
    doc.setFillColor(...color);
    doc.circle(x + sx * (largo + 2.4), y, 0.7, "F");
    doc.circle(x, y + sy * (largo + 2.4), 0.7, "F");
  }
}

/** Separador clásico: filete — rombo — filete. */
export function divisorRombo(doc: jsPDF, cx: number, y: number, ancho: number, color: RGB): void {
  const mitad = ancho / 2;
  doc.setDrawColor(...color);
  doc.setLineWidth(0.35);
  doc.line(cx - mitad, y, cx - 5, y);
  doc.line(cx + 5, y, cx + mitad, y);
  doc.setFillColor(...color);
  poligono(doc, [[cx, y - 1.9], [cx + 1.9, y], [cx, y + 1.9], [cx - 1.9, y]], "F");
  doc.setLineWidth(0.2);
  doc.circle(cx - mitad - 2.2, y, 0.55, "F");
  doc.circle(cx + mitad + 2.2, y, 0.55, "F");
}

/** Filete fino centrado. */
export function filete(doc: jsPDF, cx: number, y: number, ancho: number, color: RGB, grosor = 0.3): void {
  doc.setDrawColor(...color);
  doc.setLineWidth(grosor);
  doc.line(cx - ancho / 2, y, cx + ancho / 2, y);
}

/** Flecha dibujada a mano (EB Garamond no trae «→»). Devuelve su largo. */
export function flecha(doc: jsPDF, x: number, y: number, largo = 5): number {
  doc.setLineWidth(0.35);
  doc.line(x, y, x + largo, y);
  doc.line(x + largo - 1.4, y - 1.1, x + largo, y);
  doc.line(x + largo - 1.4, y + 1.1, x + largo, y);
  return largo;
}

/* ── Emblemas de disciplina ───────────────────────────────────────────────── */
// Cada emblema se dibuja centrado en (cx, cy) dentro de un círculo de radio r.
// Se usan grandes en la portada y minúsculos (o como marca de agua) dentro.

// `fondo` es el color del papel: hace falta para «vaciar» formas (el lado claro
// del yin-yang, por ejemplo), porque jsPDF no sabe recortar.
export type Emblema = (doc: jsPDF, cx: number, cy: number, r: number, color: RGB, fondo: RGB) => void;

/** Loto de ocho pétalos con corazón — Ayurveda. */
export const emblemaLoto: Emblema = (doc, cx, cy, r, color) => {
  doc.setDrawColor(...color);
  doc.setLineWidth(0.4);
  const petalo = (giro: number, largo: number, ancho: number) => {
    const pts: Punto[] = [];
    for (let i = 0; i <= 28; i++) {
      const t = i / 28;
      // Perfil de pétalo: seno para el ancho, recorrido lineal para el largo.
      const d = t * largo;
      const w = Math.sin(Math.PI * t) * ancho;
      pts.push(polar(cx, cy, Math.hypot(d, w), giro + (Math.atan2(w, d) * 180) / Math.PI));
    }
    for (let i = 28; i >= 0; i--) {
      const t = i / 28;
      const d = t * largo;
      const w = Math.sin(Math.PI * t) * ancho;
      pts.push(polar(cx, cy, Math.hypot(d, w), giro - (Math.atan2(w, d) * 180) / Math.PI));
    }
    poligono(doc, pts, "S");
  };
  for (let i = 0; i < 8; i++) petalo(i * 45, r, r * 0.32);
  for (let i = 0; i < 8; i++) petalo(i * 45 + 22.5, r * 0.62, r * 0.2);
  doc.setFillColor(...color);
  doc.circle(cx, cy, r * 0.1, "F");
};

/**
 * Taijitu (yin-yang) — Medicina China. Se construye por capas, de fuera a
 * dentro, porque jsPDF no sabe recortar: media luna rellena, el lóbulo que
 * entra y el lóbulo que se vacía con el color del papel.
 */
export const emblemaYinYang: Emblema = (doc, cx, cy, r, color, fondo) => {
  // Lado oscuro: media circunferencia izquierda.
  doc.setFillColor(...color);
  poligono(doc, puntosArco(cx, cy, r, 180, 360, 60), "F");
  // La ese: un lóbulo que invade el lado claro y otro que se vacía.
  doc.circle(cx, cy - r / 2, r / 2, "F");
  doc.setFillColor(...fondo);
  doc.circle(cx, cy + r / 2, r / 2, "F");
  // Los dos ojos.
  doc.setFillColor(...fondo);
  doc.circle(cx, cy - r / 2, r * 0.15, "F");
  doc.setFillColor(...color);
  doc.circle(cx, cy + r / 2, r * 0.15, "F");
  // Aro exterior, siempre por encima.
  doc.setDrawColor(...color);
  doc.setLineWidth(0.5);
  doc.circle(cx, cy, r, "S");
};

/** Espiral abierta con puntos — Psicología (el camino hacia dentro). */
export const emblemaEspiral: Emblema = (doc, cx, cy, r, color) => {
  doc.setDrawColor(...color);
  doc.setLineWidth(0.45);
  const pts: Punto[] = [];
  const vueltas = 2.6;
  for (let i = 0; i <= 220; i++) {
    const t = i / 220;
    pts.push(polar(cx, cy, r * (0.08 + 0.92 * t), t * 360 * vueltas));
  }
  poligono(doc, pts, "S", false);
  doc.setFillColor(...color);
  doc.circle(cx, cy, r * 0.07, "F");
  const fin = pts[pts.length - 1];
  doc.circle(fin[0], fin[1], r * 0.055, "F");
};

/** Hoja nervada dentro de un círculo — Nutrición. */
export const emblemaHoja: Emblema = (doc, cx, cy, r, color) => {
  doc.setDrawColor(...color);
  doc.setLineWidth(0.45);
  doc.circle(cx, cy, r, "S");
  const alto = r * 1.32;
  const ancho = r * 0.62;
  const y0 = cy + alto / 2;
  const pts: Punto[] = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    pts.push([cx + Math.sin(Math.PI * t) * ancho * (1 - t * 0.18), y0 - alto * t]);
  }
  for (let i = 40; i >= 0; i--) {
    const t = i / 40;
    pts.push([cx - Math.sin(Math.PI * t) * ancho * (1 - t * 0.18), y0 - alto * t]);
  }
  doc.setLineWidth(0.4);
  poligono(doc, pts, "S");
  doc.setLineWidth(0.25);
  doc.line(cx, y0, cx, y0 - alto);
  for (let i = 1; i <= 5; i++) {
    const t = i / 6.5;
    const yy = y0 - alto * t;
    const w = Math.sin(Math.PI * t) * ancho * 0.72;
    doc.line(cx, yy, cx + w, yy - alto * 0.11);
    doc.line(cx, yy, cx - w, yy - alto * 0.11);
  }
};

/** Sol radiante con anillo de casas — Astrología. */
export const emblemaSol: Emblema = (doc, cx, cy, r, color) => {
  doc.setDrawColor(...color);
  doc.setLineWidth(0.35);
  doc.circle(cx, cy, r, "S");
  doc.circle(cx, cy, r * 0.86, "S");
  for (let i = 0; i < 12; i++) {
    const a = i * 30;
    const p1 = polar(cx, cy, r * 0.86, a);
    const p2 = polar(cx, cy, r, a);
    doc.line(p1[0], p1[1], p2[0], p2[1]);
  }
  for (let i = 0; i < 24; i++) {
    const a = i * 15 + 7.5;
    const p1 = polar(cx, cy, r * 0.62, a);
    const p2 = polar(cx, cy, r * 0.8, a);
    doc.setLineWidth(i % 2 ? 0.18 : 0.3);
    doc.line(p1[0], p1[1], p2[0], p2[1]);
  }
  doc.setLineWidth(0.45);
  doc.circle(cx, cy, r * 0.2, "S");
  doc.setFillColor(...color);
  doc.circle(cx, cy, r * 0.07, "F");
};

/** Mandala de anillos y pétalos — emblema de la casa (genérico). */
export const emblemaMandala: Emblema = (doc, cx, cy, r, color) => {
  doc.setDrawColor(...color);
  doc.setLineWidth(0.35);
  doc.circle(cx, cy, r, "S");
  doc.setLineWidth(0.2);
  doc.circle(cx, cy, r * 0.93, "S");
  for (let i = 0; i < 12; i++) {
    const c = polar(cx, cy, r * 0.55, i * 30);
    doc.setLineWidth(0.28);
    doc.circle(c[0], c[1], r * 0.3, "S");
  }
  doc.setLineWidth(0.4);
  doc.circle(cx, cy, r * 0.24, "S");
  doc.setFillColor(...color);
  doc.circle(cx, cy, r * 0.08, "F");
};

/* ── Gráficos: los datos como obra ────────────────────────────────────────── */

/**
 * Corona de porciones (donut). Devuelve, por porción, el punto medio de su arco
 * por si quien llama quiere poner ahí una etiqueta.
 */
export function anillo(
  doc: jsPDF,
  cx: number, cy: number, rInt: number, rExt: number,
  partes: { valor: number; color: RGB }[],
  separacion = 2.2,
): { angulo: number; medio: Punto }[] {
  const total = partes.reduce((s, p) => s + p.valor, 0) || 1;
  let a = 0;
  const marcas: { angulo: number; medio: Punto }[] = [];
  for (const p of partes) {
    const barrido = (p.valor / total) * 360;
    doc.setFillColor(...p.color);
    sectorAnillo(doc, cx, cy, rInt, rExt, a + separacion / 2, a + barrido - separacion / 2, "F");
    const medioAng = a + barrido / 2;
    marcas.push({ angulo: medioAng, medio: polar(cx, cy, (rInt + rExt) / 2, medioAng) });
    a += barrido;
  }
  return marcas;
}

/**
 * Diagrama ternario: un triángulo equilátero con un punto que dice EXACTAMENTE
 * dónde está la persona entre las tres fuerzas. Es la forma honesta de contar
 * una constitución mixta (un 40/35/25 no es «eres Vata»).
 * `pesos` van en el orden [arriba, abajo-derecha, abajo-izquierda].
 */
export function ternario(
  doc: jsPDF,
  cx: number, cy: number, lado: number,
  pesos: [number, number, number],
  colores: [RGB, RGB, RGB],
  trama: RGB,
): { vertices: [Punto, Punto, Punto]; marca: Punto } {
  const h = (lado * Math.sqrt(3)) / 2;
  const A: Punto = [cx, cy - (h * 2) / 3];              // arriba
  const B: Punto = [cx + lado / 2, cy + h / 3];         // abajo derecha
  const C: Punto = [cx - lado / 2, cy + h / 3];         // abajo izquierda

  // Malla interior: tres familias de líneas paralelas a los lados.
  doc.setDrawColor(...trama);
  doc.setLineWidth(0.14);
  const mezcla = (p: Punto, q: Punto, t: number): Punto => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  for (let i = 1; i < 5; i++) {
    const t = i / 5;
    let p = mezcla(A, B, t), q = mezcla(A, C, t); doc.line(p[0], p[1], q[0], q[1]);
    p = mezcla(B, C, t); q = mezcla(B, A, t); doc.line(p[0], p[1], q[0], q[1]);
    p = mezcla(C, A, t); q = mezcla(C, B, t); doc.line(p[0], p[1], q[0], q[1]);
  }

  // Contorno.
  doc.setDrawColor(...trama);
  doc.setLineWidth(0.45);
  poligono(doc, [A, B, C], "S");

  // Vértices teñidos con su color.
  ([[A, colores[0]], [B, colores[1]], [C, colores[2]]] as [Punto, RGB][]).forEach(([p, col]) => {
    doc.setFillColor(...col);
    doc.circle(p[0], p[1], 1.5, "F");
  });

  // La marca: baricentro ponderado por los tres pesos.
  const total = pesos[0] + pesos[1] + pesos[2] || 1;
  const [wa, wb, wc] = pesos.map((p) => p / total);
  const marca: Punto = [
    A[0] * wa + B[0] * wb + C[0] * wc,
    A[1] * wa + B[1] * wb + C[1] * wc,
  ];

  // Líneas guía desde la marca a cada vértice, tenues.
  conAlfa(doc, 0.62, () => {
    doc.setLineWidth(0.3);
    ([[A, colores[0]], [B, colores[1]], [C, colores[2]]] as [Punto, RGB][]).forEach(([p, col]) => {
      doc.setDrawColor(...col);
      doc.line(marca[0], marca[1], p[0], p[1]);
    });
  });

  // Halo + punto: el color dominante manda.
  const dominante = colores[pesos.indexOf(Math.max(...pesos)) as 0 | 1 | 2];
  conAlfa(doc, 0.22, () => {
    doc.setFillColor(...dominante);
    doc.circle(marca[0], marca[1], 4.6, "F");
  });
  doc.setFillColor(...dominante);
  doc.circle(marca[0], marca[1], 2.1, "F");

  return { vertices: [A, B, C], marca };
}

/**
 * Radar de N ejes (para los cinco elementos, los tres doshas…). Dibuja la
 * telaraña, los ejes y el polígono de la persona relleno.
 */
export function radar(
  doc: jsPDF,
  cx: number, cy: number, r: number,
  valores: number[],
  max: number,
  color: RGB,
  trama: RGB,
  giro = 0,
): Punto[] {
  const n = valores.length;
  const paso = 360 / n;
  const eje = (i: number) => giro + i * paso;

  // Telaraña.
  doc.setDrawColor(...trama);
  for (let k = 1; k <= 4; k++) {
    doc.setLineWidth(k === 4 ? 0.35 : 0.14);
    poligono(doc, Array.from({ length: n }, (_, i) => polar(cx, cy, (r * k) / 4, eje(i))), "S");
  }
  doc.setLineWidth(0.14);
  for (let i = 0; i < n; i++) {
    const p = polar(cx, cy, r, eje(i));
    doc.line(cx, cy, p[0], p[1]);
  }

  // Perfil.
  const pts = valores.map((v, i) => polar(cx, cy, (r * Math.max(0, Math.min(1, v / (max || 1)))) || 0.001, eje(i)));
  conAlfa(doc, 0.28, () => { doc.setFillColor(...color); poligono(doc, pts, "F"); });
  doc.setDrawColor(...color);
  doc.setLineWidth(0.7);
  poligono(doc, pts, "S");
  doc.setFillColor(...color);
  pts.forEach((p) => doc.circle(p[0], p[1], 1.15, "F"));
  return Array.from({ length: n }, (_, i) => polar(cx, cy, r + 7, eje(i)));
}

/**
 * Los cinco elementos chinos: el pentágono con el ciclo de generación (el
 * anillo exterior) y el de control (la estrella interior).
 */
export function cicloWuXing(
  doc: jsPDF,
  cx: number, cy: number, r: number,
  nodos: { etiqueta: string; color: RGB; valor: number }[],
  max: number,
  trama: RGB,
): Punto[] {
  const n = nodos.length;
  const centros = nodos.map((_, i) => polar(cx, cy, r, (i * 360) / n));

  // Ciclo de control (la estrella): cada elemento domina al de dos posiciones más allá.
  doc.setDrawColor(...trama);
  doc.setLineWidth(0.22);
  doc.setLineDashPattern([1.2, 1.2], 0);
  for (let i = 0; i < n; i++) {
    const a = centros[i];
    const b = centros[(i + 2) % n];
    doc.line(a[0], a[1], b[0], b[1]);
  }
  doc.setLineDashPattern([], 0);

  // Ciclo de generación (el anillo).
  doc.setLineWidth(0.35);
  doc.setDrawColor(...trama);
  for (let i = 0; i < n; i++) {
    const desde = (i * 360) / n + 13;
    const hasta = ((i + 1) * 360) / n - 13;
    arco(doc, cx, cy, r, desde, hasta, 16);
  }

  // Los nodos: disco proporcional a la carga del elemento.
  centros.forEach((c, i) => {
    const t = Math.max(0, Math.min(1, nodos[i].valor / (max || 1)));
    conAlfa(doc, 0.2, () => {
      doc.setFillColor(...nodos[i].color);
      doc.circle(c[0], c[1], 7.4, "F");
    });
    doc.setFillColor(...nodos[i].color);
    doc.circle(c[0], c[1], 2.2 + 4.6 * t, "F");
    doc.setDrawColor(...nodos[i].color);
    doc.setLineWidth(0.4);
    doc.circle(c[0], c[1], 7.4, "S");
  });

  return centros;
}

/**
 * Barra fina con relleno proporcional, en el lenguaje visual de la web.
 * `pista` es el color del carril vacío.
 */
export function barra(
  doc: jsPDF, x: number, y: number, ancho: number, alto: number,
  fraccion: number, color: RGB, pista: RGB,
): void {
  doc.setFillColor(...pista);
  doc.roundedRect(x, y, ancho, alto, alto / 2, alto / 2, "F");
  const f = Math.max(0, Math.min(1, fraccion));
  if (f > 0.001) {
    doc.setFillColor(...color);
    doc.roundedRect(x, y, Math.max(alto, ancho * f), alto, alto / 2, alto / 2, "F");
  }
}

/** Medidor de arco (0-1) con aguja: para puntuaciones sueltas. */
export function medidorArco(
  doc: jsPDF, cx: number, cy: number, r: number, fraccion: number, color: RGB, pista: RGB,
): void {
  const DESDE = -120;
  const HASTA = 120;
  doc.setFillColor(...pista);
  sectorAnillo(doc, cx, cy, r - 3.2, r, DESDE, HASTA, "F");
  const f = Math.max(0, Math.min(1, fraccion));
  if (f > 0.002) {
    doc.setFillColor(...color);
    sectorAnillo(doc, cx, cy, r - 3.2, r, DESDE, DESDE + (HASTA - DESDE) * f, "F");
  }
  const punta = polar(cx, cy, r - 1.6, DESDE + (HASTA - DESDE) * f);
  doc.setDrawColor(...color);
  doc.setLineWidth(0.6);
  doc.line(cx, cy, punta[0], punta[1]);
  doc.setFillColor(...color);
  doc.circle(cx, cy, 1.3, "F");
}
