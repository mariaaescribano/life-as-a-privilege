import jsPDF from "jspdf";

/* ──────────────────────────────────────────────
   TYPES
────────────────────────────────────────────── */
export type AyurvedaRespuesta = {
  pregunta_idx: number;
  pregunta: string;
  dosha_elegida: "vata" | "pitta" | "kapha";
};

/* ──────────────────────────────────────────────
   COLORS
────────────────────────────────────────────── */
const PAGE_BG:     [number, number, number] = [26, 10, 30];
const HEADER_BG:   [number, number, number] = [103, 45, 103];   // #672d67
const TEXT_COLOR:  [number, number, number] = [236, 213, 237];   // #ecd5ed
const MUTED_COLOR: [number, number, number] = [160, 120, 160];
const VATA_COLOR:  [number, number, number] = [124, 92, 191];
const PITTA_COLOR: [number, number, number] = [192, 82, 42];
const KAPHA_COLOR: [number, number, number] = [58, 138, 92];

const DOSHA_COLOR: Record<string, [number, number, number]> = {
  vata:  VATA_COLOR,
  pitta: PITTA_COLOR,
  kapha: KAPHA_COLOR,
};

const MARGIN   = 18;
const PAGE_W   = 210;
const CONTENT_W = PAGE_W - MARGIN * 2;

/* ──────────────────────────────────────────────
   HELPERS
────────────────────────────────────────────── */
function sanitize(text: string): string {
  return text; // jsPDF handles UTF-8 fine with standard fonts
}

function splitLines(doc: jsPDF, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(sanitize(text), maxWidth) as string[];
}

/* ──────────────────────────────────────────────
   MAIN
────────────────────────────────────────────── */
export function generateAyurvedaPdf(
  respuestas: AyurvedaRespuesta[],
  resultado: string,
  scores: { vata: number; pitta: number; kapha: number },
): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageH = doc.internal.pageSize.getHeight();
  let page = 1;

  const fillBackground = () => {
    doc.setFillColor(...PAGE_BG);
    doc.rect(0, 0, PAGE_W, pageH, "F");
  };

  const drawPageNum = (p: number) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED_COLOR);
    doc.text(`${p}`, PAGE_W / 2, pageH - 6, { align: "center" });
  };

  const drawHeader = () => {
    doc.setFillColor(...HEADER_BG);
    doc.rect(0, 0, PAGE_W, 22, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("Life as a Privilege  \u00b7  Ayurveda", MARGIN, 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(236, 213, 237);
    doc.text("Descubre tu Dosha", MARGIN, 17);
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
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...TEXT_COLOR);
  doc.text("Descubre tu Dosha", MARGIN, y);
  y += 9;

  /* Resultado box */
  ensureSpace(20);
  doc.setDrawColor(...HEADER_BG);
  doc.setLineWidth(0.5);
  doc.roundedRect(MARGIN, y - 4, CONTENT_W, 14, 2, 2, "S");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED_COLOR);
  doc.text("Dosha predominante:", MARGIN + 3, y + 3);

  const resColor = DOSHA_COLOR[resultado.toLowerCase()] ?? TEXT_COLOR;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...resColor);
  doc.text(resultado.charAt(0).toUpperCase() + resultado.slice(1), MARGIN + 48, y + 3);
  y += 18;

  /* Scores */
  ensureSpace(22);
  const barW = CONTENT_W - 30;
  const total = scores.vata + scores.pitta + scores.kapha;

  (["vata", "pitta", "kapha"] as const).forEach((dosha) => {
    const count = scores[dosha];
    const pct = total > 0 ? count / total : 0;
    const color = DOSHA_COLOR[dosha];
    const label = dosha.charAt(0).toUpperCase() + dosha.slice(1);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...color);
    doc.text(`${label}`, MARGIN, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED_COLOR);
    doc.text(`${count}`, PAGE_W - MARGIN, y, { align: "right" });

    // bar background
    doc.setFillColor(50, 30, 55);
    doc.roundedRect(MARGIN + 20, y - 3.5, barW, 4, 1, 1, "F");
    // bar fill
    if (pct > 0) {
      doc.setFillColor(...color);
      doc.roundedRect(MARGIN + 20, y - 3.5, barW * pct, 4, 1, 1, "F");
    }
    y += 8;
  });

  /* Separator */
  y += 2;
  doc.setDrawColor(...HEADER_BG);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 6;

  /* Questions */
  const doshaLabels: Record<string, string> = {
    vata: "Vata",
    pitta: "Pitta",
    kapha: "Kapha",
  };
  const OPTIONS_ORDER: Array<"vata" | "pitta" | "kapha"> = ["vata", "pitta", "kapha"];

  const sorted = [...respuestas].sort((a, b) => a.pregunta_idx - b.pregunta_idx);

  for (const item of sorted) {
    const qText = `${item.pregunta_idx + 1}. ${item.pregunta}`;
    const qLines = splitLines(doc, qText, CONTENT_W);
    const blockH = qLines.length * 5 + OPTIONS_ORDER.length * 5.5 + 5;
    ensureSpace(blockH);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...TEXT_COLOR);
    qLines.forEach((line) => {
      doc.text(line, MARGIN, y);
      y += 5;
    });

    const circleR = 1.8;
    const circleX = MARGIN + 5;
    const labelX   = MARGIN + 11;

    OPTIONS_ORDER.forEach((dosha) => {
      const chosen = item.dosha_elegida === dosha;
      const color  = DOSHA_COLOR[dosha];
      const cy = y - circleR + 0.3;

      if (chosen) {
        doc.setFillColor(...color);
        doc.circle(circleX, cy, circleR, "F");
      } else {
        doc.setDrawColor(...MUTED_COLOR);
        doc.setLineWidth(0.3);
        doc.circle(circleX, cy, circleR, "S");
      }

      doc.setFont("helvetica", chosen ? "bold" : "normal");
      doc.setFontSize(9);
      const tc = chosen ? color : MUTED_COLOR;
      doc.setTextColor(...tc);
      doc.text(doshaLabels[dosha], labelX, y);
      y += 5.5;
    });

    y += 3;
  }

  drawPageNum(page);
  doc.save("ayurveda_dosha_test.pdf");
}
