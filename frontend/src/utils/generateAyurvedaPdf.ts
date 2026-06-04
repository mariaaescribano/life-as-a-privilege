import jsPDF from "jspdf";
import { registerEbGaramond, GARAMOND } from "./fonts/ebGaramond";

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
const PAGE_BG:     [number, number, number] = [255, 255, 255];
const HEADER_BG:   [number, number, number] = [0, 128, 128];     // #008080
const TEXT_COLOR:  [number, number, number] = [0, 80, 80];
const MUTED_COLOR: [number, number, number] = [80, 155, 155];
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
   DOSHA SVG PATHS (viewBox: 0 -960 960 960)
────────────────────────────────────────────── */
const DOSHA_PATH: Record<string, string> = {
  vata:  "M460-160q-50 0-85-35t-35-85h80q0 17 11.5 28.5T460-240q17 0 28.5-11.5T500-280q0-17-11.5-28.5T460-320H80v-80h380q50 0 85 35t35 85q0 50-35 85t-85 35ZM80-560v-80h540q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43h-80q0-59 40.5-99.5T620-840q59 0 99.5 40.5T760-700q0 59-40.5 99.5T620-560H80Zm660 320v-80q26 0 43-17t17-43q0-26-17-43t-43-17H80v-80h660q59 0 99.5 40.5T880-380q0 59-40.5 99.5T740-240Z",
  pitta: "M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z",
  kapha: "M80-160v-80h230q-22-85-83.5-146.5T80-470q20-5 39.5-7.5T160-480q134 0 227 93t93 227H80Zm480 0q0-42-9-83.5T525-323q42-71 114.5-114T800-480q21 0 40.5 2.5T880-470q-85 22-146 83.5T650-240h230v80H560Zm-80-239q0-65 24-122t66-100.5q42-43.5 98.5-69.5T789-719q-56 35-98 86t-65 114q-44 21-80.5 51.5T480-399Zm-73-75q-12-9-24-17t-25-16q0-6 1-12.5t1-12.5q0-76-24-144t-68-124q66 27 114.5 77.5T457-606q-18 30-31 63.5T407-474Z",
};

function svgToPngDataUrl(pathD: string, color: [number, number, number], sizePx: number): Promise<string> {
  return new Promise((resolve) => {
    const hex = "#" + color.map(c => c.toString(16).padStart(2, "0")).join("");
    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="${sizePx}" height="${sizePx}" fill="${hex}"><path d="${pathD}"/></svg>`;
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = sizePx;
      canvas.height = sizePx;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(""); };
    img.src = url;
  });
}

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
export async function generateAyurvedaPdf(
  respuestas: AyurvedaRespuesta[],
  resultado: string,
  scores: { vata: number; pitta: number; kapha: number },
): Promise<void> {
  const ICON_PX = 48;
  const ICON_MM = 5;
  const doshaIcons: Record<string, string> = {};
  for (const d of ["vata", "pitta", "kapha"] as const) {
    doshaIcons[d] = await svgToPngDataUrl(DOSHA_PATH[d], DOSHA_COLOR[d], ICON_PX);
  }

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
    doc.setFillColor(...HEADER_BG);
    doc.rect(0, 0, PAGE_W, 22, "F");
    doc.setFont(GARAMOND, "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("Life as a Privilege  \u00b7  Ayurveda", MARGIN, 10);
    doc.setFont(GARAMOND, "normal");
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
  doc.setFont(GARAMOND, "bold");
  doc.setFontSize(16);
  doc.setTextColor(...TEXT_COLOR);
  doc.text("Descubre tu Dosha", MARGIN, y);
  y += 9;

  /* Resultado box */
  ensureSpace(20);
  doc.setDrawColor(...HEADER_BG);
  doc.setLineWidth(0.5);
  doc.roundedRect(MARGIN, y - 4, CONTENT_W, 14, 2, 2, "S");

  doc.setFont(GARAMOND, "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED_COLOR);
  doc.text("Dosha predominante:", MARGIN + 3, y + 3);

  const resColor = DOSHA_COLOR[resultado.toLowerCase()] ?? TEXT_COLOR;
  doc.setFont(GARAMOND, "bold");
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

    if (doshaIcons[dosha]) {
      doc.addImage(doshaIcons[dosha], "PNG", MARGIN, y - ICON_MM + 0.5, ICON_MM, ICON_MM);
    }
    doc.setFont(GARAMOND, "bold");
    doc.setFontSize(9);
    doc.setTextColor(...color);
    doc.text(`${label}`, MARGIN + ICON_MM + 1.5, y);
    doc.setFont(GARAMOND, "normal");
    doc.setTextColor(...MUTED_COLOR);
    doc.text(`${count}`, PAGE_W - MARGIN, y, { align: "right" });

    // bar background
    doc.setFillColor(200, 230, 230);
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

    doc.setFont(GARAMOND, "bold");
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

      doc.setFont(GARAMOND, chosen ? "bold" : "normal");
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
