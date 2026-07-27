import jsPDF from "jspdf";
import { registerEbGaramond, GARAMOND } from "./fonts/ebGaramond";

const PAGE_BG: [number, number, number] = [255, 255, 255];
const INK: [number, number, number] = [133, 62, 11];     // ayurvedaTxt (marrón)
const INK_SOFT: [number, number, number] = [150, 96, 50];
const MUTED: [number, number, number] = [165, 120, 80];

const VATA_COLOR: [number, number, number] = [124, 92, 191];
const PITTA_COLOR: [number, number, number] = [192, 82, 42];
const KAPHA_COLOR: [number, number, number] = [58, 138, 92];
const DOSHA_COLORS: Record<string, [number, number, number]> = {
  vata: VATA_COLOR, pitta: PITTA_COLOR, kapha: KAPHA_COLOR,
};

const MARGIN = 20;
const PAGE_W = 210;
const CONTENT_W = PAGE_W - MARGIN * 2;
const BG_IMG = "/img/fondos/hinduismo.webp";

export interface DiaBloque { hora: string; actividad: string; comida: boolean; alimentos: string[] }

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// Dibuja `draw` con opacidad (si el visor soporta GState); si no, opaco. Para
// tintes suaves (tarjetas de momento) sin romper nada en visores antiguos.
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

export async function generateDiaPdf(dosha: string, doshaLabel: string, bloques: DiaBloque[]): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  registerEbGaramond(doc);
  const pageH = doc.internal.pageSize.getHeight();
  const doshaColor = DOSHA_COLORS[dosha] ?? INK;
  const img = await loadImage(BG_IMG);
  let page = 1;
  const fecha = new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });

  const fillBackground = () => { doc.setFillColor(...PAGE_BG); doc.rect(0, 0, PAGE_W, pageH, "F"); };

  // Cabecera con la acuarela (banda superior). Se dibuja a su proporción natural
  // y se enmascara por debajo de `h` para que no se distorsione.
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
    // Línea fina inferior en el color del dosha.
    doc.setDrawColor(...doshaColor); doc.setLineWidth(0.6);
    doc.line(0, h, PAGE_W, h);
  };

  // Ornamento central: pequeña línea — rombo — línea.
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

  // Mini-cabecera para páginas siguientes.
  const drawMiniHeader = () => {
    doc.setDrawColor(...doshaColor); doc.setLineWidth(0.5);
    doc.line(MARGIN, 18, PAGE_W - MARGIN, 18);
    doc.setFont(GARAMOND, "bold"); doc.setFontSize(11); doc.setTextColor(...INK);
    doc.text("Mi día equilibrado", MARGIN, 14);
    doc.setFont(GARAMOND, "normal"); doc.setFontSize(10); doc.setTextColor(...doshaColor);
    doc.text(doshaLabel, PAGE_W - MARGIN, 14, { align: "right" });
  };

  let y = 0;
  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - 18) {
      drawFooter(page); doc.addPage(); page++;
      fillBackground(); drawMiniHeader(); y = 28;
    }
  };

  /* ── PÁGINA 1 ── */
  fillBackground();
  drawWatercolorBand(58);
  // Marco fino doble de cortesía (aire de documento cuidado).
  doc.setDrawColor(...doshaColor);
  doc.setLineWidth(0.5); doc.rect(10, 10, PAGE_W - 20, pageH - 20);
  doc.setLineWidth(0.2); doc.rect(12.4, 12.4, PAGE_W - 24.8, pageH - 24.8);

  // Título
  doc.setFont(GARAMOND, "bold"); doc.setFontSize(26); doc.setTextColor(...INK);
  doc.text("Mi día equilibrado", PAGE_W / 2, 76, { align: "center", charSpace: 0.4 });
  doc.setFont(GARAMOND, "italic"); doc.setFontSize(12); doc.setTextColor(...doshaColor);
  doc.text(`Ayurveda  ·  Doṣha ${doshaLabel}`, PAGE_W / 2, 85, { align: "center" });
  ornament(93);
  doc.setFont(GARAMOND, "italic"); doc.setFontSize(9.5); doc.setTextColor(...MUTED);
  doc.text(fecha, PAGE_W / 2, 100, { align: "center" });
  y = 110;

  const orden = [...bloques]
    .filter((b) => (b.actividad && b.actividad.trim()) || (b.alimentos && b.alimentos.length > 0) || b.hora)
    .sort((a, b) => (a.hora || "99").localeCompare(b.hora || "99"));

  if (orden.length === 0) {
    doc.setFont(GARAMOND, "italic"); doc.setFontSize(12); doc.setTextColor(...MUTED);
    doc.text("Aún no has añadido momentos a tu día.", PAGE_W / 2, y, { align: "center" });
    drawFooter(page);
    doc.save(`mi_dia_ayurveda_${dosha}.pdf`);
    return;
  }

  const HORA_X = MARGIN + 6;
  const TEXT_X = MARGIN + 28;
  const TEXT_W = CONTENT_W - 32;

  // Cada momento del día en una tarjeta suave con barra de acento a la izquierda.
  for (const b of orden) {
    const actividad = (b.actividad || (b.comida ? "Comida" : "Momento")).trim();
    const actLines = doc.splitTextToSize(actividad, TEXT_W) as string[];
    const foodsStr = b.comida && b.alimentos.length > 0 ? b.alimentos.join("   ·   ") : "";
    const foodLines = foodsStr ? (doc.splitTextToSize(foodsStr, TEXT_W) as string[]) : [];
    const innerH = actLines.length * 6 + (foodLines.length ? foodLines.length * 5 + 1 : 0);
    const cardH = innerH + 9;
    ensureSpace(cardH + 4);

    const cardTop = y;
    withAlpha(doc, 0.06, () => {
      doc.setFillColor(...INK);
      doc.roundedRect(MARGIN, cardTop, CONTENT_W, cardH, 3, 3, "F");
    });
    doc.setFillColor(...doshaColor);
    doc.roundedRect(MARGIN, cardTop, 2.4, cardH, 1.2, 1.2, "F");

    const baseY = cardTop + 6.5;
    // Hora
    doc.setFont(GARAMOND, "bold"); doc.setFontSize(11); doc.setTextColor(...doshaColor);
    doc.text(b.hora || "—", HORA_X, baseY + 1.5);
    // Punto guía
    doc.setFillColor(...doshaColor);
    doc.circle(TEXT_X - 6, baseY, 1.2, "F");
    // Actividad
    doc.setFont(GARAMOND, b.comida ? "bold" : "normal"); doc.setFontSize(12); doc.setTextColor(...INK);
    actLines.forEach((line, i) => doc.text(line, TEXT_X, baseY + i * 6));
    let yy = baseY + actLines.length * 6;
    // Alimentos
    if (foodLines.length) {
      doc.setFont(GARAMOND, "italic"); doc.setFontSize(10); doc.setTextColor(...INK_SOFT);
      foodLines.forEach((line, i) => doc.text(line, TEXT_X, yy + 0.5 + i * 5));
    }
    y = cardTop + cardH + 4;
  }

  /* Cierre */
  ensureSpace(20);
  y += 6;
  ornament(y);
  y += 8;
  doc.setFont(GARAMOND, "italic"); doc.setFontSize(10.5); doc.setTextColor(...MUTED);
  const cierre = doc.splitTextToSize(
    "El equilibrio se construye con pequeños hábitos repetidos cada día.",
    CONTENT_W - 20,
  ) as string[];
  cierre.forEach((line, i) => doc.text(line, PAGE_W / 2, y + i * 5.5, { align: "center" }));

  drawFooter(page);
  doc.save(`mi_dia_ayurveda_${dosha}.pdf`);
}
