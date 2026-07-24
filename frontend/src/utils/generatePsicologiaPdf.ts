import jsPDF from "jspdf";
import { registerEbGaramond, GARAMOND } from "./fonts/ebGaramond";
import {
  aceScore,
  aceBanda,
  aceCompleto,
  necesidadesNoCubiertas,
  MIEDOS_PREGUNTAS,
  type LineaDeVidaData,
} from "../components/metodo/psicologiaRecorrido";
import { arquetipoLabel } from "../components/metodo/integracionSimbolos";

// PDF completo de «Mi recorrido» (Psicología): reúne, en orden, todo lo que la
// persona dejó escrito a lo largo del camino — su problema, lo que cargó, sus
// huellas, nudos, necesidades, heridas, relaciones, miedos, dones, su
// compromiso y su brújula. Comparte el lenguaje visual del resto de PDFs
// (acuarela + tinta marrón de psicología).

const PAGE_BG: [number, number, number] = [255, 255, 255];
const INK: [number, number, number] = [94, 45, 16];       // #5e2d10 — tinta psicología
const INK_SOFT: [number, number, number] = [133, 80, 45];
const MUTED: [number, number, number] = [158, 118, 84];
const ACCENT = INK;

const MARGIN = 20;
const PAGE_W = 210;
const CONTENT_W = PAGE_W - MARGIN * 2;
const BG_IMG = "/img/fondos/psciologia.png";

const plain = (s: string) => (s || "").replace(/\*\*/g, "").replace(/\*/g, "").trim();

// Dibuja `draw` con opacidad (si el visor soporta GState); si no, lo dibuja opaco.
// Sirve para tintes suaves (paneles de sección, tarjetas de cita) sin romper nada
// en visores antiguos.
function withAlpha(doc: jsPDF, opacity: number, draw: () => void): void {
  const GS = (doc as any).GState;
  if (GS) {
    try {
      doc.saveGraphicsState();
      doc.setGState(new GS({ opacity }));
      draw();
      doc.restoreGraphicsState();
      return;
    } catch { /* sin soporte de GState: se dibuja opaco */ }
  }
  draw();
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** Todas las huellas marcadas a lo largo de la línea de Vida (sin duplicar). */
function todasLasHuellas(d: LineaDeVidaData): string[] {
  const set = new Set<string>();
  for (const ano of Object.values(d.anos || {})) {
    // Blindaje: `huellas` heredado podría no ser array (string suelto) → un
    // for..of lo rompería en caracteres. Solo iteramos arrays reales.
    const huellas = Array.isArray(ano?.huellas) ? ano!.huellas : [];
    for (const t of huellas) {
      const s = (typeof t === "string" ? t : "").trim();
      if (s) set.add(s);
    }
  }
  return Array.from(set);
}

export async function generatePsicologiaPdf(data: LineaDeVidaData): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  registerEbGaramond(doc);
  const pageH = doc.internal.pageSize.getHeight();
  const img = await loadImage(BG_IMG);
  let page = 1;
  const fecha = new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });

  const fillBackground = () => { doc.setFillColor(...PAGE_BG); doc.rect(0, 0, PAGE_W, pageH, "F"); };

  const drawWatercolorBand = (h: number) => {
    if (img && img.naturalWidth) {
      const drawH = PAGE_W * (img.naturalHeight / img.naturalWidth);
      doc.addImage(img, "PNG", 0, 0, PAGE_W, drawH);
      doc.setFillColor(...PAGE_BG);
      doc.rect(0, h, PAGE_W, Math.max(0, drawH - h) + 1, "F");
    } else {
      doc.setFillColor(245, 238, 225);
      doc.rect(0, 0, PAGE_W, h, "F");
    }
    doc.setDrawColor(...ACCENT); doc.setLineWidth(0.6);
    doc.line(0, h, PAGE_W, h);
  };

  const ornament = (y: number) => {
    doc.setDrawColor(...ACCENT); doc.setLineWidth(0.4);
    doc.line(PAGE_W / 2 - 26, y, PAGE_W / 2 - 5, y);
    doc.line(PAGE_W / 2 + 5, y, PAGE_W / 2 + 26, y);
    doc.setFillColor(...ACCENT);
    doc.circle(PAGE_W / 2, y, 1.1, "F");
  };

  const drawFooter = (p: number) => {
    // Hairline de cortesía sobre el pie.
    doc.setDrawColor(214, 198, 180); doc.setLineWidth(0.2);
    doc.line(MARGIN, pageH - 12.5, PAGE_W - MARGIN, pageH - 12.5);
    doc.setFont(GARAMOND, "italic"); doc.setFontSize(8.5); doc.setTextColor(...MUTED);
    doc.text("Life as a Privilege  ·  Psicología", MARGIN, pageH - 8);
    doc.text(`${p}`, PAGE_W - MARGIN, pageH - 8, { align: "right" });
  };

  // Membrete de las páginas interiores: una banda fina de la acuarela de
  // psicología (la misma imagen de la portada), atenuada con un velo claro para
  // que el texto se lea, más el título y la disciplina. Da un aire de cuaderno.
  const drawMiniHeader = () => {
    const bandH = 26;
    if (img && img.naturalWidth) {
      const drawH = PAGE_W * (img.naturalHeight / img.naturalWidth);
      doc.addImage(img, "PNG", 0, 0, PAGE_W, drawH);
      doc.setFillColor(...PAGE_BG);
      doc.rect(0, bandH, PAGE_W, Math.max(0, drawH - bandH) + 1, "F");
      // Velo claro sobre la banda para legibilidad del texto del membrete.
      try {
        const GS = (doc as any).GState;
        if (GS) {
          doc.saveGraphicsState();
          doc.setGState(new GS({ opacity: 0.62 }));
          doc.setFillColor(...PAGE_BG);
          doc.rect(0, 0, PAGE_W, bandH, "F");
          doc.restoreGraphicsState();
        }
      } catch { /* sin GState: se deja la banda tal cual */ }
    }
    doc.setDrawColor(...ACCENT); doc.setLineWidth(0.5);
    doc.line(MARGIN, bandH, PAGE_W - MARGIN, bandH);
    doc.setFont(GARAMOND, "bold"); doc.setFontSize(11); doc.setTextColor(...INK);
    doc.text("Mi mapa", MARGIN, 15);
    doc.setFont(GARAMOND, "italic"); doc.setFontSize(10); doc.setTextColor(...ACCENT);
    doc.text("Psicología", PAGE_W - MARGIN, 15, { align: "right" });
  };

  let y = 0;
  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - 18) {
      drawFooter(page); doc.addPage(); page++;
      fillBackground(); drawMiniHeader(); y = 34;
    }
  };

  // ── Bloques reutilizables ──────────────────────────────────────────────
  // Cada sección va precedida de un adorno de separación (menos la primera),
  // para que el documento respire y cada bloque quede bien delimitado.
  let primeraSeccion = true;
  let sectionNum = 0;
  const sectionTitle = (title: string) => {
    ensureSpace(34);
    if (!primeraSeccion) {
      y += 9;
      ornament(y);
      y += 12;
    } else {
      y += 6;
      primeraSeccion = false;
    }
    sectionNum++;
    // Panel de sección: banda redondeada con un tinte muy suave + barra de acento
    // a la izquierda + un pequeño numeral. Da a cada bloque aire de «capítulo».
    const panelH = 12.5;
    const panelTop = y - 7;
    withAlpha(doc, 0.09, () => {
      doc.setFillColor(...INK);
      doc.roundedRect(MARGIN, panelTop, CONTENT_W, panelH, 2.8, 2.8, "F");
    });
    doc.setFillColor(...ACCENT);
    doc.roundedRect(MARGIN, panelTop, 2.4, panelH, 1.2, 1.2, "F");
    doc.setFont(GARAMOND, "bold"); doc.setFontSize(9); doc.setTextColor(...MUTED);
    doc.text(String(sectionNum).padStart(2, "0"), MARGIN + 7, y);
    doc.setFont(GARAMOND, "bold"); doc.setFontSize(15.5); doc.setTextColor(...INK);
    doc.text(title, MARGIN + 16, y);
    y = panelTop + panelH + 7;
  };

  const paragraph = (text: string, opts?: { italic?: boolean; size?: number; color?: [number, number, number] }) => {
    const size = opts?.size ?? 11.5;
    doc.setFont(GARAMOND, opts?.italic ? "italic" : "normal"); doc.setFontSize(size);
    doc.setTextColor(...(opts?.color ?? INK));
    const lines = doc.splitTextToSize(plain(text), CONTENT_W) as string[];
    lines.forEach((line) => { ensureSpace(size * 0.55); doc.text(line, MARGIN, y); y += size * 0.52; });
    y += 2;
  };

  const bulletList = (items: string[]) => {
    doc.setFont(GARAMOND, "normal"); doc.setFontSize(11.5); doc.setTextColor(...INK);
    for (const it of items) {
      const lines = doc.splitTextToSize(plain(it), CONTENT_W - 8) as string[];
      ensureSpace(lines.length * 6 + 1);
      doc.setFillColor(...ACCENT);
      doc.circle(MARGIN + 1.5, y - 1.4, 1, "F");
      lines.forEach((line, i) => doc.text(line, MARGIN + 8, y + i * 6));
      y += lines.length * 6 + 1.5;
    }
  };

  // Cita como TARJETA (para heridas, relaciones): fondo con un tinte muy suave,
  // barra de acento a la izquierda y las esquinas redondeadas.
  const quote = (titulo: string, cuerpo: string, extra?: string) => {
    const innerW = CONTENT_W - 16;
    const tLines = titulo ? (doc.splitTextToSize(plain(titulo), innerW) as string[]) : [];
    const cLines = cuerpo ? (doc.splitTextToSize(plain(cuerpo), innerW) as string[]) : [];
    const eLines = extra ? (doc.splitTextToSize(plain(extra), innerW) as string[]) : [];
    const textH = tLines.length * 6 + cLines.length * 5.8 + (eLines.length ? 1 + eLines.length * 5.8 : 0);
    const padY = 5.5;
    const cardH = textH + padY * 2;
    ensureSpace(cardH + 6);
    const cardTop = y - 4;
    withAlpha(doc, 0.055, () => {
      doc.setFillColor(...INK);
      doc.roundedRect(MARGIN, cardTop, CONTENT_W, cardH, 3, 3, "F");
    });
    doc.setFillColor(...ACCENT);
    doc.roundedRect(MARGIN, cardTop, 2.2, cardH, 1.1, 1.1, "F");
    let yy = cardTop + padY + 3.5;
    if (tLines.length) {
      doc.setFont(GARAMOND, "bold"); doc.setFontSize(12.5); doc.setTextColor(...INK);
      tLines.forEach((line) => { doc.text(line, MARGIN + 9, yy); yy += 6; });
    }
    if (cLines.length) {
      doc.setFont(GARAMOND, "italic"); doc.setFontSize(11.5); doc.setTextColor(...INK_SOFT);
      cLines.forEach((line) => { doc.text(line, MARGIN + 9, yy); yy += 5.8; });
    }
    if (eLines.length) {
      yy += 1;
      doc.setFont(GARAMOND, "bold"); doc.setFontSize(11.5); doc.setTextColor(...ACCENT);
      eLines.forEach((line) => { doc.text(line, MARGIN + 9, yy); yy += 5.8; });
    }
    y = cardTop + cardH + 6;
  };

  const qaBlock = (pregunta: string, respuesta: string) => {
    const pLines = doc.splitTextToSize(plain(pregunta), CONTENT_W) as string[];
    const rLines = doc.splitTextToSize(plain(respuesta), CONTENT_W - 8) as string[];
    ensureSpace(pLines.length * 5.5 + rLines.length * 6 + 8);
    doc.setFont(GARAMOND, "bold"); doc.setFontSize(11); doc.setTextColor(...INK_SOFT);
    pLines.forEach((line) => { doc.text(line, MARGIN, y); y += 5.5; });
    y += 1;
    const barTop = y - 3;
    doc.setFont(GARAMOND, "italic"); doc.setFontSize(12); doc.setTextColor(...INK);
    rLines.forEach((line) => { doc.text(line, MARGIN + 8, y); y += 6; });
    doc.setDrawColor(...ACCENT); doc.setLineWidth(1.2);
    doc.line(MARGIN + 2, barTop, MARGIN + 2, y - 5);
    y += 5;
  };

  /* ── PÁGINA 1 · portada ── */
  fillBackground();
  drawWatercolorBand(58);
  // Marco fino doble de cortesía (aire de documento cuidado).
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(0.5); doc.rect(10, 10, PAGE_W - 20, pageH - 20);
  doc.setLineWidth(0.2); doc.rect(12.4, 12.4, PAGE_W - 24.8, pageH - 24.8);
  doc.setFont(GARAMOND, "bold"); doc.setFontSize(26); doc.setTextColor(...INK);
  doc.text("Mi mapa", PAGE_W / 2, 76, { align: "center", charSpace: 0.5 });
  doc.setFont(GARAMOND, "italic"); doc.setFontSize(12); doc.setTextColor(...ACCENT);
  doc.text("Psicología  ·  Tu historia, contada por ti", PAGE_W / 2, 85, { align: "center" });
  ornament(93);
  y = 106;

  doc.setFont(GARAMOND, "italic"); doc.setFontSize(11.5); doc.setTextColor(...MUTED);
  const intro = doc.splitTextToSize(
    "Este es el mapa completo de todo lo que has recorrido: las palabras que te dejaste a ti mismo, lo que comprendiste y lo que decidiste llevarte. Es tuyo. Vuelve a él siempre que lo necesites.",
    CONTENT_W - 10,
  ) as string[];
  intro.forEach((line) => { doc.text(line, PAGE_W / 2, y, { align: "center" }); y += 6; });
  y += 3;

  // Fecha de generación, discreta bajo la introducción de la portada.
  doc.setFont(GARAMOND, "italic"); doc.setFontSize(9.5); doc.setTextColor(...MUTED);
  doc.text(fecha, PAGE_W / 2, y, { align: "center" });
  y += 3;

  /* ── 1 · De dónde vengo ── */
  const problemas = (typeof data["problema-actual"] === "string" ? (data["problema-actual"] as string) : "")
    .split(/\n+/).map((s) => s.trim()).filter(Boolean);
  if (problemas.length > 0) {
    sectionTitle("De dónde vengo");
    problemas.forEach((p) => paragraph(p, { italic: true }));
  }

  /* ── 2 · Lo que cargué (ACE) ── */
  if (aceCompleto(data)) {
    const score = aceScore(data);
    const banda = aceBanda(score);
    sectionTitle("Lo que cargué");
    doc.setFont(GARAMOND, "bold"); doc.setFontSize(13.5); doc.setTextColor(...ACCENT);
    ensureSpace(9);
    doc.text(`Puntuación ACE: ${score} / 10  ·  ${banda.titulo}`, MARGIN, y); y += 8;
    paragraph(banda.texto, { color: INK_SOFT });
  }

  /* ── 3 · Lo que dejó huella ── */
  const huellas = todasLasHuellas(data);
  if (huellas.length > 0) {
    sectionTitle("Lo que dejó huella");
    bulletList(huellas);
  }

  /* ── 4 · Los nudos ── */
  const nudos = (Array.isArray(data.nudos) ? data.nudos : []).map((n) => (typeof n === "string" ? n : "").trim()).filter(Boolean);
  if (nudos.length > 0) {
    sectionTitle("Los nudos");
    bulletList(nudos);
  }

  /* ── 5 · Lo que me faltó (necesidades) ── */
  const necesidades = necesidadesNoCubiertas(data);
  if (necesidades.length > 0) {
    sectionTitle("Lo que me faltó");
    bulletList(necesidades);
  }

  /* ── 6 · Mis heridas ── */
  const heridas = (Array.isArray(data.heridas) ? data.heridas : []).filter((h) => (h.titulo || "").trim() || (h.texto || "").trim());
  if (heridas.length > 0) {
    sectionTitle("Mis heridas");
    heridas.forEach((h) => {
      const piezas = [...(h.huellas || []), ...(h.nudos || []), ...(h.necesidades || [])].join("   ·   ");
      quote((h.titulo || "").trim() || "Herida", (h.texto || "").trim(), piezas || undefined);
    });
  }

  /* ── 7 · Cómo me relaciono ── */
  const INTEGRACION_PREGUNTAS: { key: "proteger" | "coste" | "verdadSana" | "recordatorio"; label: string }[] = [
    { key: "proteger", label: "Qué intentaba proteger" },
    { key: "coste", label: "Qué me cuesta mantenerlo" },
    { key: "verdadSana", label: "La verdad más sana que quiero practicar" },
    { key: "recordatorio", label: "Lo que quiero recordar" },
  ];
  const relaciones = (Array.isArray(data.constelaciones) ? data.constelaciones : []).filter(
    (c) => (c.titulo || "").trim() || (c.texto || "").trim() ||
      INTEGRACION_PREGUNTAS.some((p) => ((c[p.key] as string) || "").trim()),
  );
  if (relaciones.length > 0) {
    sectionTitle("Cómo me relaciono");
    relaciones.forEach((c) => {
      const piezas = [
        ...(c.nudos || []),
        ...(c.arquetipos || []).map((a) => arquetipoLabel(a)),
      ].join("   ·   ");
      quote((c.titulo || "").trim() || "Relación", (c.texto || "").trim(), piezas || undefined);
      INTEGRACION_PREGUNTAS.forEach((p) => {
        const r = ((c[p.key] as string) || "").trim();
        if (r) qaBlock(p.label, r);
      });
      y += 2;
    });
  }

  /* ── 8 · Mis miedos ── */
  const miedos = (Array.isArray(data.miedos) ? data.miedos : []).filter((m) => (m.texto || "").trim());
  if (miedos.length > 0) {
    sectionTitle("Mis miedos");
    miedos.forEach((m) => {
      doc.setFont(GARAMOND, "bold"); doc.setFontSize(13); doc.setTextColor(...INK);
      const mLines = doc.splitTextToSize(plain(m.texto), CONTENT_W) as string[];
      ensureSpace(mLines.length * 6 + 3);
      mLines.forEach((line) => { doc.text(line, MARGIN, y); y += 6; });
      y += 1;
      MIEDOS_PREGUNTAS.forEach((p) => {
        const r = (m.respuestas?.[p.key] || "").trim();
        if (r) qaBlock(p.pregunta, r);
      });
      y += 2;
    });
  }

  /* ── 9 · Mis dones ── */
  // Acepta la forma nueva (objetos {texto}) y la antigua (string[]).
  const dones = (Array.isArray(data.dones?.lista) ? data.dones!.lista! : [])
    .map((x) => (typeof x === "string" ? x : (x?.texto || "")).trim())
    .filter(Boolean);
  if (dones.length > 0) {
    sectionTitle("Mis dones");
    bulletList(dones);
  }

  /* ── 10 · Mi carta ── */
  const b = data.brujula || {};
  if ((b.mensaje || "").trim()) {
    // Formato nuevo: un mensaje libre a su yo del futuro.
    sectionTitle("Mi carta");
    paragraph("Para cuando vuelva a sentirme bloqueado:", { italic: true, color: MUTED, size: 11 });
    paragraph(b.mensaje as string);
  } else {
    // Formato antiguo (recorridos guardados con las cuatro preguntas guía).
    const brujulaPreg: [string, string | undefined][] = [
      ["¿Qué herida se ha activado?", b.herida],
      ["¿Qué necesidad hay debajo?", b.necesidad],
      ["¿Qué miedo está hablando?", b.miedo],
      ["¿Qué don puedes utilizar ahora?", b.don],
    ];
    if (brujulaPreg.some(([, v]) => (v || "").trim())) {
      sectionTitle("Mi carta");
      paragraph("Para cuando vuelva a sentirme bloqueado:", { italic: true, color: MUTED, size: 11 });
      brujulaPreg.forEach(([q, v]) => { if ((v || "").trim()) qaBlock(q, v as string); });
    }
  }

  /* ── 11 · Mi compromiso ── */
  const comp = data.compromiso || {};
  if ((comp.necesitaste || "").trim() || (comp.dartelo || "").trim()) {
    sectionTitle("Mi compromiso conmigo mismo");
    if ((comp.necesitaste || "").trim()) qaBlock("¿Qué necesitaste que nadie pudo darte?", comp.necesitaste as string);
    if ((comp.dartelo || "").trim()) qaBlock("¿Cómo puedes empezar a dártelo hoy?", comp.dartelo as string);
  }

  /* Cierre */
  ensureSpace(24);
  y += 6;
  ornament(y);
  y += 8;
  doc.setFont(GARAMOND, "italic"); doc.setFontSize(10.5); doc.setTextColor(...MUTED);
  const cierre = doc.splitTextToSize(
    "No mirabas tu historia para quedarte en ella, sino para transformarla. Este mapa es la prueba de que ya empezaste.",
    CONTENT_W - 20,
  ) as string[];
  cierre.forEach((line, i) => doc.text(line, PAGE_W / 2, y + i * 5.5, { align: "center" }));

  drawFooter(page);
  doc.save("mi_recorrido_psicologia.pdf");
}
