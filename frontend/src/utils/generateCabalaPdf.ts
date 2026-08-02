// ─────────────────────────────────────────────────────────────────────────
// Diagnóstico Final de Cábala en PDF — el recuerdo que la persona se lleva.
//
// Cómo está montado y por qué:
//
//  · PORTADA → la acuarela de Cábala (cabala.webp) a sangre, con un velo suave,
//    y encima SU Árbol de la Vida dibujado en vectores: los 22 senderos y las
//    diez dimensiones, cada una rellena según su nivel. No es un adorno
//    genérico: la portada ya es su diagnóstico.
//  · PÁGINAS → texto de PDF de verdad (se busca, se copia, se imprime nítido) y,
//    de detalle, una franja de la misma acuarela en la cabecera de cada página.
//  · TIPOGRAFÍA → EB Garamond, la de la casa (va embebida). OJO: esa fuente NO
//    trae flecha «→», ni «✓», ni hebreo, así que las flechas se DIBUJAN a mano
//    (vectores) y los senderos van por su nombre latino (Aleph, Beth…).
// ─────────────────────────────────────────────────────────────────────────
import jsPDF from "jspdf";
import { registerEbGaramond, GARAMOND } from "./fonts/ebGaramond";
import { CABALA_SENDEROS } from "../components/metodo/cabalaSenderos";

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

/* ── Medidas y paleta ─────────────────────────────────────────────────────── */

const A4_W = 210;
const A4_H = 297;
const MARGEN = 20;
const ANCHO = A4_W - MARGEN * 2;
const Y_TOPE = A4_H - 22;

// Marrón MÁS oscuro que el de la web (#3b2612): en papel y en pantalla el texto
// ámbar necesita algo más de fondo para no cansar en páginas enteras de texto.
const FONDO: [number, number, number] = [28, 18, 10];
const ORO: [number, number, number] = [189, 129, 77];      // cabalaTxt
const ORO_CLARO: [number, number, number] = [226, 178, 128];
const CREMA: [number, number, number] = [240, 229, 214];
const APAGADO: [number, number, number] = [150, 118, 92];

/* ── Utilidades de imagen ─────────────────────────────────────────────────── */

function cargarImagen(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
    img.src = src;
  });
}

/** Recorta la foto «a cover» dentro de un lienzo de w×h píxeles. */
function pintarCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) {
  const escala = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const iw = img.naturalWidth * escala;
  const ih = img.naturalHeight * escala;
  ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);
}

/** Lienzo de la portada: acuarela a sangre + velo para que el texto respire. */
function lienzoPortada(img: HTMLImageElement | null): string {
  const W = 1240;
  const H = 1754; // A4 a 150 ppp
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#1c120a";
  ctx.fillRect(0, 0, W, H);
  if (img) pintarCover(ctx, img, W, H);
  const velo = ctx.createLinearGradient(0, 0, 0, H);
  velo.addColorStop(0, "rgba(20,12,6,0.78)");
  velo.addColorStop(0.45, "rgba(20,12,6,0.46)");
  velo.addColorStop(1, "rgba(20,12,6,0.86)");
  ctx.fillStyle = velo;
  ctx.fillRect(0, 0, W, H);
  return c.toDataURL("image/jpeg", 0.86);
}

/** Franja fina de la acuarela para la cabecera de las páginas interiores. */
function lienzoFranja(img: HTMLImageElement | null): string {
  const W = 1240;
  const H = 150;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#1c120a";
  ctx.fillRect(0, 0, W, H);
  if (img) pintarCover(ctx, img, W, H);
  // Se funde con el fondo de la página por abajo: sin corte duro.
  const velo = ctx.createLinearGradient(0, 0, 0, H);
  velo.addColorStop(0, "rgba(28,18,10,0.55)");
  velo.addColorStop(1, "rgba(28,18,10,1)");
  ctx.fillStyle = velo;
  ctx.fillRect(0, 0, W, H);
  return c.toDataURL("image/jpeg", 0.86);
}

/* ── El Árbol dibujado a mano (vectores) ──────────────────────────────────── */

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

/**
 * Dibuja el Árbol centrado en (cx, cyTop) con `ancho` mm.
 * Cada sefirá se rellena según su nivel (0-10): el Árbol ES el diagnóstico.
 */
function dibujarArbol(
  doc: jsPDF,
  niveles: Record<string, number>,
  cx: number,
  yTop: number,
  ancho: number,
) {
  const k = ancho / ARBOL_W;
  const px = (x: number) => cx - ancho / 2 + x * k;
  const py = (y: number) => yTop + y * k;
  const R = 17 * k; // radio de la sefirá

  // 22 senderos
  doc.setDrawColor(...ORO);
  doc.setLineWidth(0.3);
  for (const s of CABALA_SENDEROS) {
    const a = NODOS[s.from];
    const b = NODOS[s.to];
    if (!a || !b) continue;
    doc.line(px(a.x), py(a.y), px(b.x), py(b.y));
  }

  // Da'at: la sefirá oculta, en línea de puntos y sin relleno.
  doc.setLineDashPattern([0.7, 0.7], 0);
  doc.setDrawColor(...APAGADO);
  doc.circle(px(NODOS.daat.x), py(NODOS.daat.y), R * 0.72, "S");
  doc.setLineDashPattern([], 0);

  // Las diez dimensiones
  for (const [key, n] of Object.entries(NODOS)) {
    if (key === "daat") continue;
    const x = px(n.x);
    const y = py(n.y);
    // Disco de fondo para que el sendero no se vea cruzando la sefirá
    doc.setFillColor(...FONDO);
    doc.circle(x, y, R, "F");
    const nivel = niveles[key] ?? -1;
    if (nivel > 0) {
      // Relleno proporcional al nivel: de un 25 % (nivel 1) al 100 % (nivel 10).
      doc.setFillColor(...ORO);
      doc.circle(x, y, R * (0.25 + 0.75 * Math.min(1, nivel / 10)), "F");
    }
    doc.setDrawColor(...ORO_CLARO);
    doc.setLineWidth(0.45);
    doc.circle(x, y, R, "S");
  }
  doc.setLineWidth(0.2);
}

/** Flecha de transición dibujada (la fuente no trae «→»). Devuelve su ancho. */
function flecha(doc: jsPDF, x: number, y: number, largo = 5): number {
  doc.setLineWidth(0.35);
  doc.line(x, y, x + largo, y);
  doc.line(x + largo - 1.4, y - 1.1, x + largo, y);
  doc.line(x + largo - 1.4, y + 1.1, x + largo, y);
  return largo;
}

/** «De → A» en una línea, con la flecha dibujada. Devuelve el ancho total. */
function transicion(
  doc: jsPDF,
  de: string,
  a: string,
  x: number,
  y: number,
  color: [number, number, number] = ORO_CLARO,
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
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });
  registerEbGaramond(doc);

  let img: HTMLImageElement | null = null;
  if (d.imgFondo) {
    try { img = await cargarImagen(d.imgFondo); } catch { /* sin foto: fondo liso */ }
  }
  const franja = lienzoFranja(img);

  const nivelPorKey: Record<string, number> = {};
  d.dimensiones.forEach((x) => { nivelPorKey[x.key] = x.completo ? x.nivel : -1; });

  let pagina = 0;
  let y = 0;

  /** Fondo + franja de acuarela + pie. Devuelve la y de arranque del contenido. */
  const nuevaPagina = () => {
    if (pagina > 0) doc.addPage();
    pagina++;
    doc.setFillColor(...FONDO);
    doc.rect(0, 0, A4_W, A4_H, "F");
    doc.addImage(franja, "JPEG", 0, 0, A4_W, 25, `fr${pagina}`, "FAST");
    doc.setFont(GARAMOND, "normal");
    doc.setFontSize(8);
    doc.setTextColor(...ORO_CLARO);
    doc.setCharSpace(1.2);
    doc.text("CÁBALA · EL ÁRBOL DE LA VIDA", MARGEN, 14);
    doc.setCharSpace(0);
    // Hilo dorado bajo la franja
    doc.setDrawColor(...ORO);
    doc.setLineWidth(0.25);
    doc.line(MARGEN, 25, A4_W - MARGEN, 25);
    // Pie
    doc.setFontSize(8);
    doc.setTextColor(...APAGADO);
    doc.text(String(pagina), A4_W / 2, A4_H - 10, { align: "center" });
    y = 38;
  };

  const espacio = (alto: number) => {
    if (y + alto > Y_TOPE) nuevaPagina();
  };

  const titulo = (t: string) => {
    espacio(20);
    doc.setFont(GARAMOND, "bold");
    doc.setFontSize(17);
    doc.setTextColor(...CREMA);
    doc.text(t, MARGEN, y);
    y += 3;
    doc.setDrawColor(...ORO);
    doc.setLineWidth(0.4);
    doc.line(MARGEN, y, MARGEN + 26, y);
    y += 8;
  };

  const parrafo = (t: string, tam = 10.5, color = CREMA, cursiva = false) => {
    doc.setFont(GARAMOND, cursiva ? "italic" : "normal");
    doc.setFontSize(tam);
    doc.setTextColor(...color);
    for (const linea of doc.splitTextToSize(t, ANCHO) as string[]) {
      espacio(6);
      doc.text(linea, MARGEN, y);
      y += tam * 0.52;
    }
  };

  /* ═══════════ PORTADA ═══════════ */
  doc.setFillColor(...FONDO);
  doc.rect(0, 0, A4_W, A4_H, "F");
  doc.addImage(lienzoPortada(img), "JPEG", 0, 0, A4_W, A4_H, "portada", "FAST");

  doc.setFont(GARAMOND, "normal");
  doc.setFontSize(9);
  doc.setTextColor(...ORO_CLARO);
  doc.setCharSpace(2.4);
  doc.text("LIFE AS A PRIVILEGE", A4_W / 2, 26, { align: "center" });
  doc.setCharSpace(0);

  doc.setFont(GARAMOND, "bold");
  doc.setFontSize(34);
  doc.setTextColor(255, 245, 235);
  doc.text("Diagnóstico Final", A4_W / 2, 44, { align: "center" });

  doc.setFont(GARAMOND, "italic");
  doc.setFontSize(13);
  doc.setTextColor(...ORO_CLARO);
  doc.text("El Árbol de la Vida", A4_W / 2, 54, { align: "center" });

  // Filete dorado
  doc.setDrawColor(...ORO);
  doc.setLineWidth(0.4);
  doc.line(A4_W / 2 - 18, 60, A4_W / 2 + 18, 60);

  // SU Árbol, con cada dimensión rellena según su nivel. El ancho sale del hueco
  // que queda entre el filete y el nombre (el Árbol es muy alto: 1,76 de alto por
  // 1 de ancho), para que quepa entero sin comerse el pie de la portada.
  const arbolY = 68;
  const arbolW = 96;
  dibujarArbol(doc, nivelPorKey, A4_W / 2, arbolY, arbolW);

  doc.setFont(GARAMOND, "italic");
  doc.setFontSize(9.5);
  doc.setTextColor(...ORO_CLARO);
  doc.text(
    "Cada dimensión se llena según tu nivel; las líneas son tus 22 senderos.",
    A4_W / 2, arbolY + arbolW * (ARBOL_H / ARBOL_W) + 10, { align: "center" },
  );

  if (d.nombre) {
    doc.setFont(GARAMOND, "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 245, 235);
    doc.text(d.nombre, A4_W / 2, A4_H - 34, { align: "center" });
  }
  doc.setFont(GARAMOND, "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...ORO_CLARO);
  doc.text(
    new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }),
    A4_W / 2, A4_H - 26, { align: "center" },
  );
  doc.setFontSize(8);
  doc.setTextColor(...APAGADO);
  doc.setCharSpace(2);
  doc.text("EL MAPA", A4_W / 2, A4_H - 14, { align: "center" });
  doc.setCharSpace(0);
  pagina = 1;

  /* ═══════════ TUS DIMENSIONES ═══════════ */
  nuevaPagina();
  titulo("Tus dimensiones");
  parrafo(
    "Las diez sefirot son los estados del alma. Este es el nivel al que hoy vive cada una en ti, " +
    "del 1 al 10, cruzando lo que respondiste en el test con tu propia mirada.",
    10.5, CREMA, true,
  );
  y += 6;

  for (const dim of d.dimensiones) {
    espacio(15);
    doc.setFont(GARAMOND, "bold");
    doc.setFontSize(11.5);
    doc.setTextColor(...ORO_CLARO);
    doc.text(`${dim.numero}. ${dim.titulo}`, MARGEN, y);
    doc.setFont(GARAMOND, "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...APAGADO);
    doc.text(dim.etiqueta, MARGEN + doc.getTextWidth(`${dim.numero}. ${dim.titulo}`) + 24, y);

    doc.setFont(GARAMOND, "bold");
    doc.setFontSize(10);
    doc.setTextColor(...CREMA);
    doc.text(
      dim.completo ? `${dim.nivel}/10 · ${dim.estado}` : "sin responder",
      A4_W - MARGEN, y, { align: "right" },
    );
    y += 3.2;

    // Barra: mismo lenguaje visual que la web
    const alto = 1.8;
    doc.setFillColor(64, 44, 28);
    doc.roundedRect(MARGEN, y, ANCHO, alto, alto / 2, alto / 2, "F");
    if (dim.completo && dim.nivel > 0) {
      doc.setFillColor(...ORO);
      doc.roundedRect(MARGEN, y, (ANCHO * Math.min(10, dim.nivel)) / 10, alto, alto / 2, alto / 2, "F");
    }
    y += 9;
  }

  /* ═══════════ PASO EVOLUTIVO PRIORITARIO ═══════════ */
  if (d.bloqueo) {
    y += 4;
    const lineas = doc.splitTextToSize(d.bloqueo.narrativa, ANCHO - 16) as string[];
    const altoCaja = 26 + lineas.length * 5.6;
    espacio(altoCaja + 6);

    doc.setFillColor(44, 29, 17);
    doc.setDrawColor(...ORO);
    doc.setLineWidth(0.5);
    doc.roundedRect(MARGEN, y, ANCHO, altoCaja, 3, 3, "FD");

    let yc = y + 10;
    doc.setFont(GARAMOND, "normal");
    doc.setFontSize(8);
    doc.setTextColor(...APAGADO);
    doc.setCharSpace(1.1);
    doc.text("PASO EVOLUTIVO PRIORITARIO", MARGEN + 8, yc);
    doc.setCharSpace(0);
    yc += 8;

    doc.setFont(GARAMOND, "bold");
    doc.setFontSize(14);
    const ancho = transicion(doc, d.bloqueo.de, d.bloqueo.a, MARGEN + 8, yc, ORO_CLARO);
    doc.setFont(GARAMOND, "italic");
    doc.setFontSize(9);
    doc.setTextColor(...APAGADO);
    doc.text(d.bloqueo.tipo, MARGEN + 8 + ancho + 5, yc);
    yc += 8;

    doc.setFont(GARAMOND, "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...CREMA);
    lineas.forEach((l) => { doc.text(l, MARGEN + 8, yc); yc += 5.6; });
    y += altoCaja + 10;
  }

  /* ═══════════ SENDEROS PRIORITARIOS ═══════════ */
  if (d.senderosPrioritarios.length) {
    nuevaPagina();
    titulo("Tus senderos prioritarios");
    parrafo(
      "Las transiciones que hoy más se te resisten. No son un defecto: son el trabajo que tienes delante.",
      10.5, CREMA, true,
    );
    y += 6;

    for (const s of d.senderosPrioritarios) {
      const lineas = doc.splitTextToSize(s.texto ?? "", ANCHO) as string[];
      espacio(18 + lineas.length * 5.4);

      doc.setFont(GARAMOND, "bold");
      doc.setFontSize(12.5);
      const ancho = transicion(doc, s.de, s.a, MARGEN, y, ORO_CLARO);
      doc.setFont(GARAMOND, "italic");
      doc.setFontSize(9);
      doc.setTextColor(...APAGADO);
      doc.text(`${s.letra} · ${s.banda ?? ""} · ${s.total}`, MARGEN + ancho + 5, y);
      y += 6.5;

      doc.setFont(GARAMOND, "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(...CREMA);
      lineas.forEach((l) => { doc.text(l, MARGEN, y); y += 5.4; });
      y += 7;
    }
  }

  /* ═══════════ LOS 22 SENDEROS ═══════════ */
  // La tabla entera son ~200 mm: si no queda media página, empieza en una nueva
  // en vez de partirse a los dos renglones.
  if (y > 90) nuevaPagina();
  titulo("Los 22 senderos");
  parrafo(
    "El resultado de tus veintidós tests. Cuanto más alto el número, más resistencia en esa transición.",
    10.5, CREMA, true,
  );
  y += 5;

  for (const s of d.senderos) {
    espacio(9);
    doc.setFont(GARAMOND, "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...APAGADO);
    doc.text(`${s.orden}.`, MARGEN, y);
    doc.setTextColor(...ORO_CLARO);
    doc.setFont(GARAMOND, "bold");
    doc.text(s.letra, MARGEN + 8, y);

    doc.setFont(GARAMOND, "normal");
    doc.setFontSize(9.5);
    transicion(doc, s.de, s.a, MARGEN + 32, y, [176, 146, 118]);

    doc.setFont(GARAMOND, s.completo ? "bold" : "italic");
    doc.setFontSize(9.5);
    doc.setTextColor(...(s.completo ? CREMA : APAGADO));
    doc.text(
      s.completo ? `${s.banda} · ${s.total}` : "sin responder",
      A4_W - MARGEN, y, { align: "right" },
    );
    y += 4;
    doc.setDrawColor(58, 40, 25);
    doc.setLineWidth(0.2);
    doc.line(MARGEN, y, A4_W - MARGEN, y);
    y += 5;
  }

  /* ═══════════ CIERRE ═══════════ */
  y += 10;
  espacio(30);
  doc.setFont(GARAMOND, "italic");
  doc.setFontSize(12);
  doc.setTextColor(...ORO_CLARO);
  const cierre = doc.splitTextToSize(
    "«El Árbol no se recorre una vez. Se vuelve a él cada temporada, y cada vez dice algo distinto, " +
    "porque quien mira ya no es el mismo.»",
    ANCHO - 20,
  ) as string[];
  cierre.forEach((l) => { doc.text(l, A4_W / 2, y, { align: "center" }); y += 6.4; });

  doc.save("diagnostico-cabala.pdf");
}
