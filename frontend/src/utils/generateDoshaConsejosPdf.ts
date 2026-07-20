import jsPDF from "jspdf";
import { registerEbGaramond, GARAMOND } from "./fonts/ebGaramond";
import type { DoshaRecs } from "../hardCoded/espacio/DoshaConsejos";

const HEADER_COLOR: [number, number, number] = [0, 128, 128];
const PAGE_BG: [number, number, number] = [255, 255, 255];
const TEXT_COLOR: [number, number, number] = [0, 80, 80];
const MUTED_COLOR: [number, number, number] = [80, 155, 155];
const SECTION_COLOR: [number, number, number] = [0, 100, 100];
const VATA_COLOR: [number, number, number] = [124, 92, 191];
const PITTA_COLOR: [number, number, number] = [192, 82, 42];
const KAPHA_COLOR: [number, number, number] = [58, 138, 92];

const DOSHA_COLORS: Record<string, [number, number, number]> = {
  vata: VATA_COLOR,
  pitta: PITTA_COLOR,
  kapha: KAPHA_COLOR,
};

const MARGIN = 18;
const PAGE_W = 210;
const CONTENT_W = PAGE_W - MARGIN * 2;

function sanitize(text: string): string {
  return text;
}

function splitLines(doc: jsPDF, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(sanitize(text), maxWidth) as string[];
}

export function generateDoshaConsejosPdf(dosha: string, recs: DoshaRecs): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  registerEbGaramond(doc);
  const pageH = doc.internal.pageSize.getHeight();
  const doshaColor = DOSHA_COLORS[dosha] ?? TEXT_COLOR;
  const doshaLabel = dosha.charAt(0).toUpperCase() + dosha.slice(1);
  let page = 1;

  const fillBackground = () => {
    doc.setFillColor(...PAGE_BG);
    doc.rect(0, 0, PAGE_W, pageH, "F");
  };

  const drawPageNum = (p: number) => {
    doc.setFont(GARAMOND, "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED_COLOR);
    doc.text(`${p}`, PAGE_W / 2, pageH - 6, { align: "center" });
  };

  const drawHeader = () => {
    doc.setFillColor(...HEADER_COLOR);
    doc.rect(0, 0, PAGE_W, 22, "F");
    doc.setFont(GARAMOND, "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("Life as a Privilege  \u00b7  Ayurveda", MARGIN, 10);
    doc.setFont(GARAMOND, "normal");
    doc.setFontSize(9);
    doc.setTextColor(236, 213, 237);
    doc.text(sanitize("Consejos personalizados"), MARGIN, 17);
  };

  let y = 0;
  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - 14) {
      drawPageNum(page);
      doc.addPage();
      page++;
      fillBackground();
      drawHeader();
      y = 30;
    }
  };

  /* PAGE 1 */
  fillBackground();
  drawHeader();
  y = 30;

  /* Title */
  doc.setFont(GARAMOND, "bold");
  doc.setFontSize(18);
  doc.setTextColor(...TEXT_COLOR);
  doc.text(sanitize("Tus consejos personalizados"), MARGIN, y);
  y += 10;

  /* Dosha result */
  ensureSpace(14);
  doc.setDrawColor(...doshaColor);
  doc.setLineWidth(0.5);
  doc.roundedRect(MARGIN, y - 4, CONTENT_W, 12, 2, 2, "S");
  doc.setFont(GARAMOND, "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED_COLOR);
  doc.text("Tu Doṣha:", MARGIN + 4, y + 3);
  doc.setFont(GARAMOND, "bold");
  doc.setFontSize(13);
  doc.setTextColor(...doshaColor);
  doc.text(doshaLabel, MARGIN + 26, y + 3);
  y += 16;

  /* Description */
  const descLines = splitLines(doc, recs.descripcion, CONTENT_W - 8);
  const descH = descLines.length * 5 + 10;
  ensureSpace(descH);
  doc.setDrawColor(...doshaColor);
  doc.setLineWidth(0.4);
  doc.roundedRect(MARGIN, y - 2, CONTENT_W, descH, 3, 3, "S");
  doc.setFont(GARAMOND, "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...TEXT_COLOR);
  y += 5;
  descLines.forEach((line) => {
    doc.text(line, MARGIN + 4, y);
    y += 5;
  });
  y += 8;

  /* Categories */
  const categories: Array<{ key: keyof DoshaRecs; label: string }> = [
    { key: "alimentacion", label: "Alimentación" },
    { key: "hierbas", label: "Hierbas" },
    { key: "estiloDeVida", label: "Estilo de Vida" },
    { key: "evitar", label: "Evitar" },
  ];

  for (const cat of categories) {
    const items = recs[cat.key];
    if (!items || !Array.isArray(items) || items.length === 0) continue;

    ensureSpace(12);
    doc.setFont(GARAMOND, "bold");
    doc.setFontSize(13);
    doc.setTextColor(...SECTION_COLOR);
    doc.text(sanitize(cat.label), MARGIN, y);
    y += 2;
    doc.setDrawColor(...doshaColor);
    doc.setLineWidth(0.25);
    doc.line(MARGIN, y, MARGIN + 35, y);
    y += 6;

    for (const item of items) {
      const lines = splitLines(doc, item, CONTENT_W - 8);
      ensureSpace(lines.length * 5 + 4);
      doc.setFont(GARAMOND, "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...TEXT_COLOR);

      doc.setFillColor(...doshaColor);
      doc.circle(MARGIN + 2, y - 1.2, 1, "F");

      lines.forEach((line, li) => {
        doc.text(line, MARGIN + 6, y + li * 5);
      });
      y += lines.length * 5 + 2;
    }
    y += 5;
  }

  drawPageNum(page);
  doc.save(`ayurveda_consejos_${dosha}.pdf`);
}
