import jsPDF from "jspdf";
import { registerEbGaramond, GARAMOND } from "./fonts/ebGaramond";
import type { DiaBloque } from "./generateDiaPdf";

// PDF completo de «Tu recorrido» (Ayurveda): reúne las palabras que el usuario
// dejó en cada paso, su compromiso, su día ideal y —de regalo— un recordatorio
// de qué equilibra y qué desequilibra a su dosha.
// Comparte el lenguaje visual del PDF del día (acuarela + tinta marrón).

const PAGE_BG: [number, number, number] = [255, 255, 255];
const INK: [number, number, number] = [133, 62, 11];
const INK_SOFT: [number, number, number] = [150, 96, 50];
const MUTED: [number, number, number] = [165, 120, 80];

const DOSHA_COLORS: Record<string, [number, number, number]> = {
  vata: [124, 92, 191],
  pitta: [192, 82, 42],
  kapha: [58, 138, 92],
};

const MARGIN = 20;
const PAGE_W = 210;
const CONTENT_W = PAGE_W - MARGIN * 2;
const BG_IMG = "/img/fondos/hinduismo.png";

const plain = (s: string) => (s || "").replace(/\*\*/g, "").replace(/\*/g, "").trim();

export interface RecorridoData {
  entradas: { pregunta: string; respuesta: string }[];
  compromiso: string;
  diaBloques: DiaBloque[];
  /** «Lo que aumenta / desequilibra tu dosha». */
  desequilibra: { titulo: string; items: string[] };
  /** «Las primeras señales» de desequilibrio. */
  senales: { titulo: string; items: string[] };
  /** «Cómo volver al equilibrio». */
  equilibra: { titulo: string; items: string[] };
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// Dibuja `draw` con opacidad (si el visor soporta GState); si no, opaco. Para
// tintes suaves (paneles de sección, tarjetas) sin romper visores antiguos.
function withAlpha(doc: jsPDF, opacity: number, draw: () => void): void {
  const GS = (doc as any).GState;
  if (GS) {
    try {
      doc.saveGraphicsState();
      doc.setGState(new GS({ opacity }));
      draw();
      doc.restoreGraphicsState();
      return;
    } catch { /* sin GState: opaco */ }
  }
  draw();
}

export async function generateRecorridoPdf(
  dosha: string,
  doshaLabel: string,
  data: RecorridoData,
): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  registerEbGaramond(doc);
  const pageH = doc.internal.pageSize.getHeight();
  const doshaColor = DOSHA_COLORS[dosha] ?? INK;
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
    doc.setDrawColor(...doshaColor); doc.setLineWidth(0.6);
    doc.line(0, h, PAGE_W, h);
  };

  const ornament = (y: number) => {
    doc.setDrawColor(...doshaColor); doc.setLineWidth(0.4);
    doc.line(PAGE_W / 2 - 26, y, PAGE_W / 2 - 5, y);
    doc.line(PAGE_W / 2 + 5, y, PAGE_W / 2 + 26, y);
    doc.setFillColor(...doshaColor);
    doc.circle(PAGE_W / 2, y, 1.1, "F");
  };

  const drawFooter = (p: number) => {
    doc.setDrawColor(224, 205, 178); doc.setLineWidth(0.2);
    doc.line(MARGIN, pageH - 12.5, PAGE_W - MARGIN, pageH - 12.5);
    doc.setFont(GARAMOND, "italic"); doc.setFontSize(8.5); doc.setTextColor(...MUTED);
    doc.text("Life as a Privilege  ·  Ayurveda", MARGIN, pageH - 8);
    doc.text(`${p}`, PAGE_W - MARGIN, pageH - 8, { align: "right" });
  };

  const drawMiniHeader = () => {
    doc.setDrawColor(...doshaColor); doc.setLineWidth(0.5);
    doc.line(MARGIN, 18, PAGE_W - MARGIN, 18);
    doc.setFont(GARAMOND, "bold"); doc.setFontSize(11); doc.setTextColor(...INK);
    doc.text("Mi mapa", MARGIN, 14);
    doc.setFont(GARAMOND, "normal"); doc.setFontSize(10); doc.setTextColor(...doshaColor);
    doc.text(`Dosha ${doshaLabel}`, PAGE_W - MARGIN, 14, { align: "right" });
  };

  let y = 0;
  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - 18) {
      drawFooter(page); doc.addPage(); page++;
      fillBackground(); drawMiniHeader(); y = 28;
    }
  };

  // ── Bloques reutilizables ──────────────────────────────────────────────
  // Cabecera de sección: banda redondeada con un tinte muy suave + barra de
  // acento (color del dosha) + numeral. Aire de «capítulo».
  let sectionNum = 0;
  const sectionTitle = (title: string) => {
    ensureSpace(24);
    y += 6;
    sectionNum++;
    const panelH = 12.5;
    const panelTop = y - 7;
    withAlpha(doc, 0.09, () => {
      doc.setFillColor(...doshaColor);
      doc.roundedRect(MARGIN, panelTop, CONTENT_W, panelH, 2.8, 2.8, "F");
    });
    doc.setFillColor(...doshaColor);
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
  };

  const bulletList = (items: string[]) => {
    doc.setFont(GARAMOND, "normal"); doc.setFontSize(11.5); doc.setTextColor(...INK);
    for (const it of items) {
      const lines = doc.splitTextToSize(plain(it), CONTENT_W - 8) as string[];
      ensureSpace(lines.length * 6 + 1);
      doc.setFillColor(...doshaColor);
      doc.circle(MARGIN + 1.5, y - 1.4, 1, "F");
      lines.forEach((line, i) => doc.text(line, MARGIN + 8, y + i * 6));
      y += lines.length * 6 + 1.5;
    }
  };

  // Pregunta + respuesta como TARJETA (tinte suave + barra de acento).
  const qaBlock = (pregunta: string, respuesta: string) => {
    const innerW = CONTENT_W - 16;
    const pLines = doc.splitTextToSize(plain(pregunta), innerW) as string[];
    const rLines = doc.splitTextToSize(plain(respuesta), innerW) as string[];
    const textH = pLines.length * 5.5 + 1 + rLines.length * 6;
    const padY = 5.5;
    const cardH = textH + padY * 2;
    ensureSpace(cardH + 5);
    const cardTop = y - 4;
    withAlpha(doc, 0.055, () => {
      doc.setFillColor(...doshaColor);
      doc.roundedRect(MARGIN, cardTop, CONTENT_W, cardH, 3, 3, "F");
    });
    doc.setFillColor(...doshaColor);
    doc.roundedRect(MARGIN, cardTop, 2.2, cardH, 1.1, 1.1, "F");
    let yy = cardTop + padY + 3.5;
    doc.setFont(GARAMOND, "bold"); doc.setFontSize(11); doc.setTextColor(...INK_SOFT);
    pLines.forEach((line) => { doc.text(line, MARGIN + 9, yy); yy += 5.5; });
    yy += 1;
    doc.setFont(GARAMOND, "italic"); doc.setFontSize(12); doc.setTextColor(...INK);
    rLines.forEach((line) => { doc.text(line, MARGIN + 9, yy); yy += 6; });
    y = cardTop + cardH + 5;
  };

  /* ── PÁGINA 1 · portada ── */
  fillBackground();
  drawWatercolorBand(58);
  // Marco fino doble de cortesía.
  doc.setDrawColor(...doshaColor);
  doc.setLineWidth(0.5); doc.rect(10, 10, PAGE_W - 20, pageH - 20);
  doc.setLineWidth(0.2); doc.rect(12.4, 12.4, PAGE_W - 24.8, pageH - 24.8);
  doc.setFont(GARAMOND, "bold"); doc.setFontSize(26); doc.setTextColor(...INK);
  doc.text("Mi mapa", PAGE_W / 2, 76, { align: "center", charSpace: 0.5 });
  doc.setFont(GARAMOND, "italic"); doc.setFontSize(12); doc.setTextColor(...doshaColor);
  doc.text(`Ayurveda  ·  Doṣha ${doshaLabel}`, PAGE_W / 2, 85, { align: "center" });
  ornament(93);
  y = 104;

  doc.setFont(GARAMOND, "italic"); doc.setFontSize(11.5); doc.setTextColor(...MUTED);
  const intro = doc.splitTextToSize(
    "A lo largo del camino te has ido escuchando. Estas son las palabras que te dejaste a ti mismo, tu día ideal y un recordatorio de lo que cuida tu equilibrio.",
    CONTENT_W - 10,
  ) as string[];
  intro.forEach((line) => { doc.text(line, PAGE_W / 2, y, { align: "center" }); y += 6; });
  y += 2;
  doc.setFont(GARAMOND, "italic"); doc.setFontSize(9.5); doc.setTextColor(...MUTED);
  doc.text(fecha, PAGE_W / 2, y, { align: "center" });
  y += 3;

  /* ── Tus palabras ── */
  if (data.entradas.length > 0) {
    sectionTitle("Tus palabras");
    data.entradas.forEach((e) => qaBlock(e.pregunta, e.respuesta));
  }

  /* ── Tu compromiso ── */
  if (data.compromiso.trim()) {
    sectionTitle("Tu compromiso");
    doc.setFont(GARAMOND, "bold"); doc.setFontSize(13.5); doc.setTextColor(...doshaColor);
    const cl = doc.splitTextToSize(plain(data.compromiso), CONTENT_W) as string[];
    cl.forEach((line) => { ensureSpace(8); doc.text(line, MARGIN, y); y += 7; });
    y += 3;
  }

  /* ── Tu día ideal ── */
  sectionTitle("Tu día ideal");
  const orden = [...data.diaBloques]
    .filter((b) => (b.actividad && b.actividad.trim()) || (b.alimentos && b.alimentos.length > 0) || b.hora)
    .sort((a, b) => (a.hora || "99").localeCompare(b.hora || "99"));
  if (orden.length === 0) {
    paragraph("Aún no has creado tu día ideal.", { italic: true, color: MUTED });
  } else {
    const TEXT_X = MARGIN + 24;
    const TEXT_W = CONTENT_W - 24;
    for (const b of orden) {
      const actividad = (b.actividad || (b.comida ? "Comida" : "Momento")).trim();
      const actLines = doc.splitTextToSize(actividad, TEXT_W) as string[];
      const foodsStr = b.comida && b.alimentos.length > 0 ? b.alimentos.join("   ·   ") : "";
      const foodLines = foodsStr ? (doc.splitTextToSize(foodsStr, TEXT_W) as string[]) : [];
      ensureSpace(actLines.length * 6 + foodLines.length * 5 + 9);
      const topY = y;
      doc.setFont(GARAMOND, "bold"); doc.setFontSize(12); doc.setTextColor(...doshaColor);
      doc.text(b.hora || "—", MARGIN, y + 1.5);
      doc.setFillColor(...doshaColor);
      doc.circle(TEXT_X - 6, y, 1.2, "F");
      doc.setFont(GARAMOND, b.comida ? "bold" : "normal"); doc.setFontSize(12); doc.setTextColor(...INK);
      actLines.forEach((line, i) => doc.text(line, TEXT_X, y + i * 6));
      let yy = y + actLines.length * 6;
      if (foodLines.length) {
        doc.setFont(GARAMOND, "italic"); doc.setFontSize(10); doc.setTextColor(...INK_SOFT);
        foodLines.forEach((line, i) => doc.text(line, TEXT_X, yy + 0.5 + i * 5));
        yy += foodLines.length * 5 + 0.5;
      }
      y = yy + 6;
      doc.setDrawColor(...doshaColor); doc.setLineWidth(0.2);
      doc.line(TEXT_X - 6, topY + 3, TEXT_X - 6, y - 4);
      doc.setDrawColor(...MUTED); doc.setLineWidth(0.1);
      doc.line(TEXT_X, y - 2.5, PAGE_W - MARGIN, y - 2.5);
      y += 3;
    }
  }

  /* ── Regalo: equilibrio / desequilibrio del dosha ── */
  ensureSpace(24);
  y += 6;
  ornament(y);
  y += 9;
  doc.setFont(GARAMOND, "italic"); doc.setFontSize(10.5); doc.setTextColor(...MUTED);
  doc.text("Un regalo para tu camino", PAGE_W / 2, y, { align: "center" });
  y += 8;

  sectionTitle(data.desequilibra.titulo || `Lo que desequilibra tu ${doshaLabel}`);
  bulletList(data.desequilibra.items);

  if (data.senales.items.length > 0) {
    sectionTitle(data.senales.titulo || "Las primeras señales");
    bulletList(data.senales.items);
  }

  sectionTitle(data.equilibra.titulo || "Cómo volver al equilibrio");
  bulletList(data.equilibra.items);

  /* Cierre */
  ensureSpace(22);
  y += 6;
  ornament(y);
  y += 8;
  doc.setFont(GARAMOND, "italic"); doc.setFontSize(10.5); doc.setTextColor(...MUTED);
  const cierre = doc.splitTextToSize(
    "El equilibrio no aparece sin más: se construye con pequeñas decisiones repetidas cada día.",
    CONTENT_W - 20,
  ) as string[];
  cierre.forEach((line, i) => doc.text(line, PAGE_W / 2, y + i * 5.5, { align: "center" }));

  drawFooter(page);
  doc.save(`mi_recorrido_ayurveda_${dosha}.pdf`);
}
