// ─────────────────────────────────────────────────────────────────────────
// Diagnóstico Final de Cábala — el recuerdo que la persona se lleva.
//
// La portada NO es un adorno: es SU Árbol de la Vida dibujado en vectores
// sobre la acuarela de la disciplina, con los 22 senderos trazados y cada una
// de las diez dimensiones rellena según su nivel. La portada ya es el
// diagnóstico; todo lo demás lo desarrolla.
//
// Sale del taller común (utils/pdf): papel oscuro con veta, lavado de acuarela
// en la cabecera, versalitas, capitulares y ornamento. Lo único propio de este
// documento es el Árbol y las transiciones «de → a», que van con flecha
// DIBUJADA porque EB Garamond no trae «→» (ni «✓», ni hebreo: por eso los
// senderos van por su nombre latino, Aleph, Beth…).
// ─────────────────────────────────────────────────────────────────────────
import type jsPDF from "jspdf";
import { Taller, MARGEN, ANCHO, A4_W, A4_H } from "./pdf/atelier";
import { TEMA_CABALA, type RGB } from "./pdf/temas";
import { conAlfa, flecha } from "./pdf/formas";
import { CABALA_SENDEROS } from "../components/metodo/cabalaSenderos";
import { GARAMOND } from "./fonts/ebGaramond";

/* ── Lo que la página le pasa ─────────────────────────────────────────────── */

export interface CabalaPdfDimension {
  key: string;
  numero: number;
  titulo: string;
  etiqueta: string;
  completo: boolean;
  /** 0-10 (o -1 si no está respondida). */
  nivel: number;
  /** «Integrada», «Poco desarrollada», «Sobrecargada»… */
  estado: string;
}

export interface CabalaPdfSendero {
  orden: number;
  letra: string;
  de: string;
  a: string;
  completo: boolean;
  total: number;
  banda?: string;
  texto?: string;
}

export interface CabalaPdfDatos {
  nombre?: string;
  dimensiones: CabalaPdfDimension[];
  bloqueo?: { de: string; a: string; tipo: string; narrativa: string } | null;
  senderos: CabalaPdfSendero[];
  senderosPrioritarios: CabalaPdfSendero[];
  /** Ruta de la acuarela de Cábala (la misma que se ve en la web). */
  imgFondo?: string;
}

/* ── El Árbol dibujado a mano ─────────────────────────────────────────────── */

// Mismas posiciones que el Árbol de la web (viewBox 400 × 720).
const NODOS: Record<string, { x: number; y: number }> = {
  kether:   { x: 200, y: 45 },
  chokmah:  { x: 340, y: 140 },
  binah:    { x: 60,  y: 140 },
  daat:     { x: 200, y: 215 },
  chesed:   { x: 340, y: 300 },
  geburah:  { x: 60,  y: 300 },
  tipharet: { x: 200, y: 370 },
  netzach:  { x: 340, y: 500 },
  hod:      { x: 60,  y: 500 },
  yesod:    { x: 200, y: 570 },
  malkuth:  { x: 200, y: 660 },
};
const ARBOL_W = 400;
const ARBOL_H = 705;
/** Proporción del Árbol: hace falta para reservarle sitio antes de dibujarlo. */
export const ARBOL_RATIO = ARBOL_H / ARBOL_W;

/**
 * Dibuja el Árbol con la esquina superior izquierda de su caja en (cx − ancho/2,
 * yTop). Cada sefirá se rellena según su nivel (0-10): el Árbol ES el diagnóstico.
 */
function dibujarArbol(
  doc: jsPDF,
  niveles: Record<string, number>,
  cx: number,
  yTop: number,
  ancho: number,
  color: RGB,
  colorClaro: RGB,
  fondo: RGB,
  apagado: RGB,
): void {
  const k = ancho / ARBOL_W;
  const px = (x: number) => cx - ancho / 2 + x * k;
  const py = (y: number) => yTop + y * k;
  const R = 17 * k;

  // Los 22 senderos.
  doc.setDrawColor(...color);
  doc.setLineWidth(0.3);
  for (const s of CABALA_SENDEROS) {
    const a = NODOS[s.from];
    const b = NODOS[s.to];
    if (!a || !b) continue;
    doc.line(px(a.x), py(a.y), px(b.x), py(b.y));
  }

  // Da'at: la sefirá oculta, en línea de puntos y sin relleno.
  doc.setLineDashPattern([0.7, 0.7], 0);
  doc.setDrawColor(...apagado);
  doc.circle(px(NODOS.daat.x), py(NODOS.daat.y), R * 0.72, "S");
  doc.setLineDashPattern([], 0);

  // Las diez dimensiones.
  for (const [key, n] of Object.entries(NODOS)) {
    if (key === "daat") continue;
    const x = px(n.x);
    const y = py(n.y);
    // Disco de fondo: que el sendero no se vea cruzando la sefirá.
    doc.setFillColor(...fondo);
    doc.circle(x, y, R, "F");
    const nivel = niveles[key] ?? -1;
    if (nivel > 0) {
      // Halo proporcional + disco: se lee el nivel de un vistazo.
      conAlfa(doc, 0.22, () => {
        doc.setFillColor(...color);
        doc.circle(x, y, R * 0.98, "F");
      });
      doc.setFillColor(...color);
      doc.circle(x, y, R * (0.25 + 0.75 * Math.min(1, nivel / 10)), "F");
    }
    doc.setDrawColor(...colorClaro);
    doc.setLineWidth(0.45);
    doc.circle(x, y, R, "S");
  }
  doc.setLineWidth(0.2);
}

/** «De → A» en una línea, con la flecha dibujada. Devuelve el ancho total. */
function transicion(
  doc: jsPDF, de: string, a: string, x: number, y: number, color: RGB,
): number {
  doc.setTextColor(...color);
  doc.text(de, x, y);
  const xf = x + doc.getTextWidth(de) + 2;
  doc.setDrawColor(...color);
  const w = flecha(doc, xf, y - 1.1);
  const xa = xf + w + 2;
  doc.text(a, xa, y);
  return xa + doc.getTextWidth(a) - x;
}

/* ── El documento ─────────────────────────────────────────────────────────── */

export async function generarPdfCabala(d: CabalaPdfDatos): Promise<void> {
  const t = { ...TEMA_CABALA, acuarela: d.imgFondo || TEMA_CABALA.acuarela };
  const taller = await Taller.abrir(t, { titulo: "El Árbol de la Vida" });
  const doc = taller.doc;

  const nivelPorKey: Record<string, number> = {};
  d.dimensiones.forEach((x) => { nivelPorKey[x.key] = x.completo ? x.nivel : -1; });

  const respondidas = d.dimensiones.filter((x) => x.completo);
  const media = respondidas.length
    ? respondidas.reduce((s, x) => s + x.nivel, 0) / respondidas.length
    : 0;

  /* ═══════════ PORTADA ═══════════ */
  taller.portada({
    titulo: "Diagnóstico Final",
    subtitulo: "El Árbol de la Vida",
    nombre: d.nombre,
    pieLamina: "Cada dimensión se llena según tu nivel; las líneas son tus 22 senderos.",
    cierre: "El Mapa",
    lamina: (doc2, cx, yTop, ancho) => {
      // El Árbol es muy alto (1,76 de alto por 1 de ancho): el ancho sale del
      // hueco real que queda hasta el bloque del nombre, para que quepa entero.
      const hueco = 297 - 76 - yTop;
      const w = Math.min(ancho - 18, hueco / ARBOL_RATIO);
      dibujarArbol(
        doc2, nivelPorKey, cx, yTop, w,
        t.acento, [240, 214, 184], [22, 14, 8], t.apagado,
      );
    },
  });

  /* ═══════════ TUS DIMENSIONES ═══════════ */
  taller.nuevaPagina();
  taller.capitulo(
    "Tus dimensiones",
    "Las diez sefirot son los estados del alma. Este es el nivel al que hoy vive cada una " +
      "en ti, del 1 al 10, cruzando lo que respondiste en el test con tu propia mirada.",
  );

  for (const dim of d.dimensiones) {
    taller.filaBarra({
      etiqueta: `${dim.numero}. ${dim.titulo}`,
      coletilla: dim.etiqueta,
      valor: dim.completo ? `${dim.nivel}/10 · ${dim.estado}` : "sin responder",
      fraccion: dim.completo ? Math.min(10, dim.nivel) / 10 : 0,
    });
  }

  if (respondidas.length >= 3) {
    taller.espacio(2);
    taller.parrafo(
      `Tu media está en ${media.toFixed(1)} sobre 10. Lo que importa no es ese número, ` +
        "sino el desnivel: el Árbol se sostiene por el equilibrio entre columnas, no por " +
        "la altura de una sola sefirá.",
      { cursiva: true, color: t.apagado, tam: 10.4 },
    );
  }

  /* ═══════════ PASO EVOLUTIVO PRIORITARIO ═══════════ */
  if (d.bloqueo) {
    taller.espacio(4);
    doc.setFont(GARAMOND, "normal");
    doc.setFontSize(11);
    const lineas = doc.splitTextToSize(d.bloqueo.narrativa, ANCHO - 18) as string[];
    const alto = 28 + lineas.length * 5.8;
    taller.reservar(alto + 8);

    const arriba = taller.y;
    conAlfa(doc, 0.2, () => {
      doc.setFillColor(...t.acento);
      doc.roundedRect(MARGEN, arriba, ANCHO, alto, 3, 3, "F");
    });
    doc.setDrawColor(...t.acento);
    doc.setLineWidth(0.5);
    doc.roundedRect(MARGEN, arriba, ANCHO, alto, 3, 3, "S");

    let yc = arriba + 10;
    taller.versalitas("Paso evolutivo prioritario", MARGEN + 9, yc, 8, t.apagado);
    yc += 9;

    doc.setFont(GARAMOND, "bold");
    doc.setFontSize(14.5);
    const w = transicion(doc, d.bloqueo.de, d.bloqueo.a, MARGEN + 9, yc, t.acentoSuave);
    doc.setFont(GARAMOND, "italic");
    doc.setFontSize(9.5);
    doc.setTextColor(...t.apagado);
    doc.text(d.bloqueo.tipo, MARGEN + 9 + w + 6, yc);
    yc += 8.5;

    doc.setFont(GARAMOND, "normal");
    doc.setFontSize(11);
    doc.setTextColor(...t.tinta);
    lineas.forEach((l) => { doc.text(l, MARGEN + 9, yc); yc += 5.8; });
    taller.y = arriba + alto + 10;
  }

  /* ═══════════ SENDEROS PRIORITARIOS ═══════════ */
  if (d.senderosPrioritarios.length) {
    taller.capitulo(
      "Tus senderos prioritarios",
      "Las transiciones que hoy más se te resisten. No son un defecto: son el trabajo que " +
        "tienes delante.",
    );

    for (const s of d.senderosPrioritarios) {
      doc.setFont(GARAMOND, "normal");
      doc.setFontSize(11);
      const lineas = doc.splitTextToSize(s.texto ?? "", ANCHO - 6) as string[];
      taller.reservar(lineas.length * 5.6 + 20);

      doc.setFont(GARAMOND, "bold");
      doc.setFontSize(13);
      const w = transicion(doc, s.de, s.a, MARGEN + 6, taller.y, t.acentoSuave);
      doc.setFont(GARAMOND, "italic");
      doc.setFontSize(9.5);
      doc.setTextColor(...t.apagado);
      doc.text(`${s.letra} · ${s.banda ?? ""} · ${s.total}`, MARGEN + 6 + w + 6, taller.y);
      const arriba = taller.y - 4;
      taller.y += 7;

      doc.setFont(GARAMOND, "normal");
      doc.setFontSize(11);
      doc.setTextColor(...t.tinta);
      lineas.forEach((l) => { doc.text(l, MARGEN + 6, taller.y); taller.y += 5.6; });

      doc.setDrawColor(...t.acento);
      doc.setLineWidth(0.9);
      doc.line(MARGEN, arriba, MARGEN, taller.y - 4);
      taller.y += 7;
    }
  }

  /* ═══════════ LOS 22 SENDEROS ═══════════ */
  // La tabla entera son ~200 mm: si no queda media página, mejor empezarla en
  // una nueva que partirla a los dos renglones.
  if (taller.y > 105) taller.nuevaPagina();
  taller.capitulo(
    "Los 22 senderos",
    "El resultado de tus veintidós tests. Cuanto más alto el número, más resistencia en " +
      "esa transición.",
  );

  for (const s of d.senderos) {
    taller.reservar(10);
    doc.setFont(GARAMOND, "normal");
    doc.setFontSize(10);
    doc.setTextColor(...t.apagado);
    doc.text(`${s.orden}.`, MARGEN, taller.y);
    doc.setFont(GARAMOND, "bold");
    doc.setTextColor(...t.acentoSuave);
    doc.text(s.letra, MARGEN + 8, taller.y);

    doc.setFont(GARAMOND, "normal");
    doc.setFontSize(9.6);
    transicion(doc, s.de, s.a, MARGEN + 32, taller.y, t.tintaSuave);

    doc.setFont(GARAMOND, s.completo ? "bold" : "italic");
    doc.setFontSize(9.6);
    doc.setTextColor(...(s.completo ? t.tinta : t.apagado));
    doc.text(
      s.completo ? `${s.banda} · ${s.total}` : "sin responder",
      A4_W - MARGEN, taller.y, { align: "right" },
    );
    taller.y += 4;
    conAlfa(doc, 0.6, () => {
      doc.setDrawColor(...t.trama);
      doc.setLineWidth(0.15);
      doc.line(MARGEN, taller.y, A4_W - MARGEN, taller.y);
    });
    taller.y += 5.4;
  }

  /* ═══════════ EL ÁRBOL, OTRA VEZ ═══════════ */
  // Cierra el documento como lo abrió: con su Árbol, ya leído.
  taller.nuevaPagina();
  taller.capitulo("Tu Árbol", "El mismo de la portada, ahora que ya sabes leerlo.");
  // El ancho sale de lo que queda de página DESPUÉS de reservar el cierre: si
  // no, el Árbol se come la hoja y la frase final se va sola a una página nueva.
  const anchoArbol = Math.min(ANCHO - 40, (A4_H - 22 - 46 - (taller.y + 4)) / ARBOL_RATIO);
  dibujarArbol(
    doc, nivelPorKey, A4_W / 2, taller.y + 4, anchoArbol,
    t.acento, t.acentoSuave, t.papel, t.apagado,
  );
  taller.y += anchoArbol * ARBOL_RATIO + 12;

  taller.cierre(
    "«El Árbol no se recorre una vez. Se vuelve a él cada temporada, y cada vez dice algo " +
      "distinto, porque quien mira ya no es el mismo.»",
  );

  taller.guardar("diagnostico-cabala.pdf");
}
