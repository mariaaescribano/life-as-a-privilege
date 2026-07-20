import jsPDF from "jspdf";
import { registerEbGaramond, GARAMOND } from "./fonts/ebGaramond";

/* ══════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════ */
export type TcmRespuesta = {
  seccion: string;
  pregunta_idx: number;
  pregunta: string;
  respuesta: number;
};

/* ══════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════ */
const TCM_TESTS: Record<
  number,
  {
    title: string;
    scaleValues: number[];
    scaleLabels: string[];
  }
> = {
  1: {
    title: "Conoce tu constitución",
    scaleValues: [0, 1, 2],
    scaleLabels: ["Rara vez", "A veces", "Frecuentemente"],
  },
  2: {
    title: "Tu elemento predominante",
    scaleValues: [0, 1, 2, 3],
    scaleLabels: [
      "No me describe",
      "Leve tendencia",
      "Moderadamente característico",
      "Muy característico",
    ],
  },
  3: {
    title: "Tu desequilibrio actual",
    scaleValues: [0, 1, 2, 3],
    scaleLabels: ["Ausente", "Ocasional", "Frecuente", "Persistente / intenso"],
  },
};

const HEADER_COLOR: [number, number, number] = [0, 128, 128]; // teal #008080
const SECTION_COLOR: [number, number, number] = [218, 113, 113]; // #da7171
const PAGE_BG: [number, number, number] = [22, 14, 14]; // near-black
const TEXT_COLOR: [number, number, number] = [230, 210, 210];
const MUTED_COLOR: [number, number, number] = [130, 100, 100];
const CHOSEN_COLOR: [number, number, number] = [0, 200, 200]; // teal chosen
const MARGIN = 18;
const PAGE_W = 210;
const CONTENT_W = PAGE_W - MARGIN * 2;

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */

/** Ensure accented characters are encoded properly for jsPDF latin1 */
function sanitize(text: string): string {
  // Replace common Spanish accented chars with latin1 equivalents
  return text
    .replace(/\u00e1/g, "\u00e1") // á
    .replace(/\u00e9/g, "\u00e9") // é
    .replace(/\u00ed/g, "\u00ed") // í
    .replace(/\u00f3/g, "\u00f3") // ó
    .replace(/\u00fa/g, "\u00fa") // ú
    .replace(/\u00fc/g, "\u00fc") // ü
    .replace(/\u00f1/g, "\u00f1") // ñ
    .replace(/\u00c1/g, "\u00c1") // Á
    .replace(/\u00c9/g, "\u00c9") // É
    .replace(/\u00cd/g, "\u00cd") // Í
    .replace(/\u00d3/g, "\u00d3") // Ó
    .replace(/\u00da/g, "\u00da") // Ú
    .replace(/\u00dc/g, "\u00dc") // Ü
    .replace(/\u00d1/g, "\u00d1") // Ñ
    .replace(/\u00bf/g, "\u00bf") // ¿
    .replace(/\u00a1/g, "\u00a1"); // ¡
}

/** Split text into lines that fit within maxWidth */
function splitLines(
  doc: jsPDF,
  text: string,
  maxWidth: number
): string[] {
  return doc.splitTextToSize(sanitize(text), maxWidth) as string[];
}

/* ══════════════════════════════════════════════
   MAIN GENERATOR
══════════════════════════════════════════════ */
export function generateTcmPdf(
  testNum: number,
  respuestas: TcmRespuesta[],
  resultado?: string,
  consejo?: string
): void {
  const testInfo = TCM_TESTS[testNum];
  if (!testInfo) return;

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  registerEbGaramond(doc);
  const pageH = doc.internal.pageSize.getHeight();
  let page = 1;

  /* ── draw background ── */
  const fillBackground = () => {
    doc.setFillColor(...PAGE_BG);
    doc.rect(0, 0, PAGE_W, pageH, "F");
  };

  /* ── draw page number ── */
  const drawPageNum = (p: number) => {
    doc.setFont(GARAMOND, "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED_COLOR);
    doc.text(`${p}`, PAGE_W / 2, pageH - 6, { align: "center" });
  };

  /* ── draw header bar ── */
  const drawHeader = () => {
    doc.setFillColor(...HEADER_COLOR);
    doc.rect(0, 0, PAGE_W, 22, "F");
    doc.setFont(GARAMOND, "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("Life as a Privilege  ·  TCM", MARGIN, 10);
    doc.setFont(GARAMOND, "normal");
    doc.setFontSize(9);
    doc.setTextColor(220, 240, 240);
    doc.text(sanitize(testInfo.title), MARGIN, 17);
  };

  /* ── check page overflow and add new page ── */
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

  /* ═══════════════════ PAGE 1 SETUP ═══════════════════ */
  fillBackground();
  drawHeader();
  y = 30;

  /* ── test title ── */
  doc.setFont(GARAMOND, "bold");
  doc.setFontSize(16);
  doc.setTextColor(...TEXT_COLOR);
  const titleLines = splitLines(doc, testInfo.title, CONTENT_W);
  titleLines.forEach((line) => {
    ensureSpace(8);
    doc.text(line, MARGIN, y);
    y += 7;
  });
  y += 3;

  /* ── resultado ── */
  if (resultado) {
    ensureSpace(14);
    doc.setFillColor(0, 128, 128, 0.15);
    // draw a subtle box
    doc.setDrawColor(...HEADER_COLOR);
    doc.setLineWidth(0.4);
    doc.roundedRect(MARGIN, y - 4, CONTENT_W, 11, 2, 2, "S");
    doc.setFont(GARAMOND, "normal");
    doc.setFontSize(9);
    doc.setTextColor(...MUTED_COLOR);
    doc.text("Resultado predominante:", MARGIN + 3, y + 2);
    doc.setFont(GARAMOND, "bold");
    doc.setFontSize(11);
    doc.setTextColor(...CHOSEN_COLOR);
    doc.text(sanitize(resultado), MARGIN + 52, y + 2);
    y += 14;
  }

  /* ── consejo / advice ── */
  if (consejo) {
    ensureSpace(30);
    // box background
    const consejoLines = splitLines(doc, consejo, CONTENT_W - 12);
    const boxH = consejoLines.length * 5.5 + 20;
    ensureSpace(boxH);
    doc.setDrawColor(...HEADER_COLOR);
    doc.setLineWidth(0.5);
    doc.roundedRect(MARGIN, y - 2, CONTENT_W, boxH, 3, 3, "S");
    // title
    doc.setFont(GARAMOND, "bold");
    doc.setFontSize(11);
    doc.setTextColor(...CHOSEN_COLOR);
    doc.text(sanitize("Tu consejo personalizado"), MARGIN + 6, y + 6);
    y += 14;
    // body
    doc.setFont(GARAMOND, "normal");
    doc.setFontSize(10);
    doc.setTextColor(...TEXT_COLOR);
    consejoLines.forEach((line) => {
      doc.text(line, MARGIN + 6, y);
      y += 5.5;
    });
    y += 10;
  }

  /* ── thin separator ── */
  doc.setDrawColor(...HEADER_COLOR);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 6;

  /* ═══════════════════ GROUP BY SECTION ═══════════════════ */
  // Build section → questions map preserving order
  const sections: Array<{ nombre: string; preguntas: TcmRespuesta[] }> = [];
  const sectionIndex: Record<string, number> = {};
  for (const r of respuestas) {
    if (!(r.seccion in sectionIndex)) {
      sectionIndex[r.seccion] = sections.length;
      sections.push({ nombre: r.seccion, preguntas: [] });
    }
    sections[sectionIndex[r.seccion]].preguntas.push(r);
  }

  for (const sec of sections) {
    /* ── section header ── */
    ensureSpace(10);
    doc.setFont(GARAMOND, "bold");
    doc.setFontSize(12);
    doc.setTextColor(...SECTION_COLOR);
    const secLines = splitLines(doc, sec.nombre, CONTENT_W);
    secLines.forEach((line) => {
      doc.text(line, MARGIN, y);
      y += 6;
    });
    y += 1;

    // thin underline
    doc.setDrawColor(...SECTION_COLOR);
    doc.setLineWidth(0.25);
    doc.line(MARGIN, y, MARGIN + 40, y);
    y += 5;

    /* ── questions ── */
    // Sort by pregunta_idx
    const sorted = [...sec.preguntas].sort(
      (a, b) => a.pregunta_idx - b.pregunta_idx
    );

    for (const item of sorted) {
      /* question text */
      doc.setFont(GARAMOND, "bold");
      doc.setFontSize(9);
      doc.setTextColor(...TEXT_COLOR);
      const qText = `${item.pregunta_idx + 1}. ${item.pregunta}`;
      const qLines = splitLines(doc, qText, CONTENT_W);

      const optionCount = testInfo.scaleValues.length;
      const blockHeight = qLines.length * 5 + optionCount * 6 + 6;
      ensureSpace(blockHeight);

      qLines.forEach((line) => {
        doc.text(line, MARGIN, y);
        y += 5;
      });

      /* scale options */
      const circleR = 1.8;
      const circleX = MARGIN + 5;
      const labelX = MARGIN + 11;
      testInfo.scaleValues.forEach((v) => {
        const chosen = item.respuesta === v;
        const label = testInfo.scaleLabels[v];

        // Draw circle
        const cy = y - circleR + 0.3;
        if (chosen) {
          doc.setFillColor(...CHOSEN_COLOR);
          doc.circle(circleX, cy, circleR, "F");
        } else {
          doc.setDrawColor(...MUTED_COLOR);
          doc.setLineWidth(0.3);
          doc.circle(circleX, cy, circleR, "S");
        }

        // Draw label
        doc.setFont(GARAMOND, chosen ? "bold" : "normal");
        doc.setFontSize(9);
        doc.setTextColor(chosen ? CHOSEN_COLOR[0] : MUTED_COLOR[0], chosen ? CHOSEN_COLOR[1] : MUTED_COLOR[1], chosen ? CHOSEN_COLOR[2] : MUTED_COLOR[2]);

        const labelLines = splitLines(doc, label, CONTENT_W - (labelX - MARGIN));
        labelLines.forEach((lline, li) => {
          doc.text(lline, labelX, y + li * 4.5);
        });
        y += labelLines.length * 4.5 + 1;
      });

      y += 4; // space between questions
    }

    y += 3; // space between sections
  }

  /* ── final page number ── */
  drawPageNum(page);

  doc.save(`tcm_test${testNum}_respuestas.pdf`);
}

/* ══════════════════════════════════════════════
   CONSEJOS PDF GENERATOR
══════════════════════════════════════════════ */
export function generateTcmConsejosPdf(
  testNum: number,
  resultado: string,
  recs: { infusiones: string[]; hierbas: string[]; estiloDeVida: string[]; nutricion: string[] },
  interpretacion?: string
): void {
  const testInfo = TCM_TESTS[testNum];
  if (!testInfo) return;

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  registerEbGaramond(doc);
  const pageH = doc.internal.pageSize.getHeight();
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
    doc.text("Life as a Privilege  ·  TCM", MARGIN, 10);
    doc.setFont(GARAMOND, "normal");
    doc.setFontSize(9);
    doc.setTextColor(220, 240, 240);
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

  /* ═══════════════════ PAGE 1 ═══════════════════ */
  fillBackground();
  drawHeader();
  y = 30;

  /* ── title ── */
  doc.setFont(GARAMOND, "bold");
  doc.setFontSize(16);
  doc.setTextColor(...TEXT_COLOR);
  const titleLines = splitLines(doc, "Tus consejos personalizados", CONTENT_W);
  titleLines.forEach((line) => {
    doc.text(line, MARGIN, y);
    y += 7;
  });
  y += 2;

  /* ── resultado ── */
  ensureSpace(14);
  doc.setDrawColor(...HEADER_COLOR);
  doc.setLineWidth(0.4);
  doc.roundedRect(MARGIN, y - 4, CONTENT_W, 11, 2, 2, "S");
  doc.setFont(GARAMOND, "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED_COLOR);
  doc.text("Resultado predominante:", MARGIN + 3, y + 2);
  doc.setFont(GARAMOND, "bold");
  doc.setFontSize(11);
  doc.setTextColor(...CHOSEN_COLOR);
  doc.text(sanitize(resultado), MARGIN + 52, y + 2);
  y += 14;

  /* ── interpretación ── */
  if (interpretacion) {
    const iLines = splitLines(doc, interpretacion, CONTENT_W - 8);
    const boxH = iLines.length * 5 + 12;
    ensureSpace(boxH);
    doc.setDrawColor(...HEADER_COLOR);
    doc.setLineWidth(0.4);
    doc.roundedRect(MARGIN, y - 2, CONTENT_W, boxH, 3, 3, "S");
    doc.setFont(GARAMOND, "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...TEXT_COLOR);
    y += 6;
    iLines.forEach((line) => {
      doc.text(line, MARGIN + 4, y);
      y += 5;
    });
    y += 10;
  }

  /* ── categories ── */
  const categories: Array<{ key: keyof typeof recs; label: string }> = [
    { key: "infusiones", label: "Infusiones" },
    { key: "hierbas", label: "Hierbas" },
    { key: "nutricion", label: "Nutrición" },
    { key: "estiloDeVida", label: "Estilo de Vida" },
  ];

  for (const cat of categories) {
    const items = recs[cat.key];
    if (!items || items.length === 0) continue;

    /* section title */
    ensureSpace(12);
    doc.setFont(GARAMOND, "bold");
    doc.setFontSize(13);
    doc.setTextColor(...SECTION_COLOR);
    doc.text(sanitize(cat.label), MARGIN, y);
    y += 2;
    doc.setDrawColor(...SECTION_COLOR);
    doc.setLineWidth(0.25);
    doc.line(MARGIN, y, MARGIN + 35, y);
    y += 6;

    /* items */
    for (const item of items) {
      const lines = splitLines(doc, item, CONTENT_W - 8);
      ensureSpace(lines.length * 5 + 4);
      doc.setFont(GARAMOND, "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...TEXT_COLOR);

      // bullet
      doc.setFillColor(...CHOSEN_COLOR);
      doc.circle(MARGIN + 2, y - 1.2, 1, "F");

      lines.forEach((line, li) => {
        doc.text(line, MARGIN + 6, y + li * 5);
      });
      y += lines.length * 5 + 2;
    }

    y += 5;
  }

  drawPageNum(page);
  doc.save(`tcm_test${testNum}_consejos.pdf`);
}
