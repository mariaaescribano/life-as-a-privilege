import jsPDF from "jspdf";

interface NutricionResult {
  tdee: number;
  protG: number; protKcal: number;
  carbG: number; carbKcal: number;
  fatG: number;  fatKcal: number;
}

interface NutricionInput {
  peso: string;
  altura: string;
  edad: string;
  genero: string;
  actividad: string;
}

const HEADER_COLOR: [number, number, number] = [0, 128, 128];
const PAGE_BG: [number, number, number] = [22, 30, 28];
const TEXT_COLOR: [number, number, number] = [220, 240, 235];
const MUTED_COLOR: [number, number, number] = [140, 160, 155];
const ACCENT: [number, number, number] = [107, 196, 200];
const MARGIN = 18;
const PAGE_W = 210;
const CONTENT_W = PAGE_W - MARGIN * 2;

function sanitize(text: string): string {
  return text;
}

export function generateNutricionPdf(result: NutricionResult, input: NutricionInput): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageH = doc.internal.pageSize.getHeight();

  // Background
  doc.setFillColor(...PAGE_BG);
  doc.rect(0, 0, PAGE_W, pageH, "F");

  // Header bar
  doc.setFillColor(...HEADER_COLOR);
  doc.rect(0, 0, PAGE_W, 22, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("Life as a Privilege  ·  Nutrición", MARGIN, 10);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(220, 240, 240);
  doc.text(sanitize("Tus necesidades nutricionales"), MARGIN, 17);

  let y = 34;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...TEXT_COLOR);
  doc.text(sanitize("Tus necesidades nutricionales"), MARGIN, y);
  y += 10;

  // Date
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED_COLOR);
  doc.text(new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }), MARGIN, y);
  y += 10;

  // Input data box
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(0.4);
  doc.roundedRect(MARGIN, y - 3, CONTENT_W, 32, 3, 3, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...ACCENT);
  doc.text("Datos personales", MARGIN + 5, y + 4);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...TEXT_COLOR);
  const col1 = MARGIN + 5;
  const col2 = MARGIN + CONTENT_W / 2;
  y += 12;
  doc.text(`Peso: ${input.peso} kg`, col1, y);
  doc.text(`Altura: ${input.altura} cm`, col2, y);
  y += 6;
  doc.text(`Edad: ${input.edad} años`, col1, y);
  doc.text(`Género: ${input.genero === "mujer" ? "Mujer" : "Hombre"}`, col2, y);
  y += 6;
  doc.text(sanitize(`Actividad: ${input.actividad}`), col1, y);
  y += 14;

  // TDEE big number
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(0.5);
  doc.roundedRect(MARGIN, y - 3, CONTENT_W, 28, 3, 3, "S");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED_COLOR);
  doc.text(sanitize("CALORÍAS DIARIAS ESTIMADAS"), PAGE_W / 2, y + 4, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(...ACCENT);
  doc.text(`${result.tdee.toLocaleString()}`, PAGE_W / 2, y + 17, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...MUTED_COLOR);
  doc.text("kcal / día", PAGE_W / 2, y + 23, { align: "center" });
  y += 36;

  // Macros
  const macros = [
    { label: "Proteínas", g: result.protG, kcal: result.protKcal, pct: 25 },
    { label: "Carbohidratos", g: result.carbG, kcal: result.carbKcal, pct: 45 },
    { label: "Grasas", g: result.fatG, kcal: result.fatKcal, pct: 30 },
  ];

  for (const macro of macros) {
    doc.setDrawColor(...ACCENT);
    doc.setLineWidth(0.3);
    doc.roundedRect(MARGIN, y - 3, CONTENT_W, 18, 3, 3, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...TEXT_COLOR);
    doc.text(sanitize(macro.label), MARGIN + 5, y + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...MUTED_COLOR);
    doc.text(`${macro.pct}%`, MARGIN + 5, y + 12);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...ACCENT);
    doc.text(`${macro.g} g`, PAGE_W - MARGIN - 5, y + 5, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...MUTED_COLOR);
    doc.text(`${macro.kcal} kcal`, PAGE_W - MARGIN - 5, y + 12, { align: "right" });

    y += 22;
  }

  // Disclaimer
  y += 4;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED_COLOR);
  const disclaimer = doc.splitTextToSize(
    sanitize("Esta estimación es orientativa. Las necesidades reales varían según la composición corporal y el metabolismo individual. Si deseas una dieta personalizada, contacta con un nutricionista."),
    CONTENT_W
  );
  (disclaimer as string[]).forEach((line: string) => {
    doc.text(line, MARGIN, y);
    y += 4;
  });

  // Page number
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED_COLOR);
  doc.text("1", PAGE_W / 2, pageH - 6, { align: "center" });

  doc.save("mis_necesidades_nutricionales.pdf");
}
