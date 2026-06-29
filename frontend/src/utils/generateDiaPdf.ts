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
const BG_IMG = "/img/fondos/hinduismo.png";

export interface DiaBloque { hora: string; actividad: string; comida: boolean; alimentos: string[] }

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export async function generateDiaPdf(dosha: string, doshaLabel: string, bloques: DiaBloque[]): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  registerEbGaramond(doc);
  const pageH = doc.internal.pageSize.getHeight();
  const doshaColor = DOSHA_COLORS[dosha] ?? INK;
  const img = await loadImage(BG_IMG);
  let page = 1;

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

  // Título
  doc.setFont(GARAMOND, "bold"); doc.setFontSize(26); doc.setTextColor(...INK);
  doc.text("Mi día equilibrado", PAGE_W / 2, 76, { align: "center" });
  doc.setFont(GARAMOND, "italic"); doc.setFontSize(12); doc.setTextColor(...doshaColor);
  doc.text(`Ayurveda  ·  Dosha ${doshaLabel}`, PAGE_W / 2, 85, { align: "center" });
  ornament(93);
  y = 106;

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

  const HORA_X = MARGIN;
  const TEXT_X = MARGIN + 24;
  const TEXT_W = CONTENT_W - 24;

  for (const b of orden) {
    const actividad = (b.actividad || (b.comida ? "Comida" : "Momento")).trim();
    const actLines = doc.splitTextToSize(actividad, TEXT_W) as string[];
    const foodsStr = b.comida && b.alimentos.length > 0 ? b.alimentos.join("   ·   ") : "";
    const foodLines = foodsStr ? (doc.splitTextToSize(foodsStr, TEXT_W) as string[]) : [];
    const blockH = actLines.length * 6 + foodLines.length * 5 + 9;
    ensureSpace(blockH);

    const topY = y;

    // Hora
    doc.setFont(GARAMOND, "bold"); doc.setFontSize(12); doc.setTextColor(...doshaColor);
    doc.text(b.hora || "—", HORA_X, y + 1.5);

    // Punto guía
    doc.setFillColor(...doshaColor);
    doc.circle(TEXT_X - 6, y, 1.2, "F");

    // Actividad
    doc.setFont(GARAMOND, b.comida ? "bold" : "normal"); doc.setFontSize(12); doc.setTextColor(...INK);
    actLines.forEach((line, i) => doc.text(line, TEXT_X, y + i * 6));
    let yy = y + actLines.length * 6;

    // Alimentos
    if (foodLines.length) {
      doc.setFont(GARAMOND, "italic"); doc.setFontSize(10); doc.setTextColor(...INK_SOFT);
      foodLines.forEach((line, i) => doc.text(line, TEXT_X, yy + 0.5 + i * 5));
      yy += foodLines.length * 5 + 0.5;
    }

    y = yy + 6;

    // Línea vertical suave que une la hora con el bloque (toque elegante).
    doc.setDrawColor(...doshaColor); doc.setLineWidth(0.2);
    doc.line(TEXT_X - 6, topY + 3, TEXT_X - 6, y - 4);

    // Separador horizontal tenue entre momentos.
    doc.setDrawColor(...MUTED);
    doc.setLineWidth(0.1);
    doc.line(TEXT_X, y - 2.5, PAGE_W - MARGIN, y - 2.5);
    y += 3;
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
