// ─────────────────────────────────────────────────────────────────────────
// «Tus necesidades» — el PDF de la calculadora de Nutrición.
//
// Un número solo (2.140 kcal) no vale nada: lo que hace útil este documento es
// el REPARTO. Por eso la portada es una corona de macronutrientes con el gasto
// diario en el centro —se entiende de un vistazo y sin leer— y dentro va la
// ficha de partida, la lectura de cada macro y las equivalencias en comida real.
// ─────────────────────────────────────────────────────────────────────────
import type jsPDF from "jspdf";
import { Taller, MARGEN, ANCHO, A4_W } from "./pdf/atelier";
import { TEMA_NUTRICION, type RGB } from "./pdf/temas";
import { anillo, polar, conAlfa } from "./pdf/formas";
import { GARAMOND } from "./fonts/ebGaramond";

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

const COLOR_PROT: RGB = [72, 118, 156];
const COLOR_CARB: RGB = [204, 154, 62];
const COLOR_GRASA: RGB = [176, 106, 68];

const MACROS_INFO = [
  {
    nombre: "Proteínas",
    color: COLOR_PROT,
    porQue:
      "Son el material de construcción: músculo, piel, enzimas, defensas. Es el macro que más " +
      "sacia y el que conviene repartir a lo largo del día, no concentrar en una sola comida.",
    donde: "Huevo, pescado, legumbre, carne, lácteo, tofu, tempeh",
  },
  {
    nombre: "Carbohidratos",
    color: COLOR_CARB,
    porQue:
      "El combustible más rápido y el que alimenta al cerebro. La diferencia no está en la " +
      "cantidad, sino en la forma: cuanto menos procesado y más fibra, más estable la energía.",
    donde: "Cereal integral, patata, legumbre, fruta, verdura",
  },
  {
    nombre: "Grasas",
    color: COLOR_GRASA,
    porQue:
      "Hormonas, membranas celulares y la absorción de las vitaminas A, D, E y K dependen de " +
      "ellas. Bajarlas demasiado no adelgaza más: desregula.",
    donde: "Aceite de oliva, aguacate, frutos secos, pescado azul, semillas",
  },
];

/** La corona de macros con el gasto diario en el centro. */
function laminaAnillo(
  doc: jsPDF,
  cx: number,
  cy: number,
  r: number,
  partes: { valor: number; color: RGB; etiqueta: string; gramos: number }[],
  tdee: number,
  colorTexto: RGB,
  colorSuave: RGB,
  /** Color del nombre de cada macro. En portada va en crema: los colores de la
   *  corona se apagan sobre la acuarela. Dentro, cada uno con el suyo. */
  colorEtiqueta?: RGB,
): void {
  const grosor = r * 0.3;
  const marcas = anillo(doc, cx, cy, r - grosor, r, partes, 2.6);
  const total = partes.reduce((s, p) => s + p.valor, 0) || 1;

  // El número que importa, en el hueco.
  doc.setFont(GARAMOND, "bold");
  doc.setFontSize(r * 0.72);
  doc.setTextColor(...colorTexto);
  doc.text(tdee.toLocaleString("es-ES"), cx, cy + r * 0.06, { align: "center" });
  doc.setFont(GARAMOND, "normal");
  doc.setFontSize(r * 0.2);
  doc.setTextColor(...colorSuave);
  doc.setCharSpace(r * 0.03);
  doc.text("KCAL AL DÍA", cx, cy + r * 0.28, { align: "center" });
  doc.setCharSpace(0);

  // Etiquetas colgando de cada porción, hacia fuera. El tirador se alarga
  // según lo vertical que sea el ángulo: cuando una porción cae justo arriba o
  // justo abajo, la etiqueta se apoyaba encima del anillo y no se leía.
  partes.forEach((p, i) => {
    const ang = marcas[i].angulo;
    const vertical = Math.abs(Math.cos((ang * Math.PI) / 180)); // 1 arriba/abajo
    const tirador = 7 + vertical * 6;
    const fuera = polar(cx, cy, r + tirador, ang);
    const dentro = polar(cx, cy, r + 1, ang);
    conAlfa(doc, 0.7, () => {
      doc.setDrawColor(...p.color);
      doc.setLineWidth(0.3);
      doc.line(dentro[0], dentro[1], fuera[0], fuera[1]);
    });
    // Arriba y abajo del todo la etiqueta se centra; a los lados, se alinea.
    const centrada = vertical > 0.86;
    const derecha = ang < 180;
    const align: "left" | "right" | "center" = centrada ? "center" : derecha ? "left" : "right";
    const tx = fuera[0] + (centrada ? 0 : derecha ? 1.8 : -1.8);
    const abajo = Math.cos((ang * Math.PI) / 180) < 0;
    const ty = fuera[1] + (centrada ? (abajo ? 4.4 : -3.4) : -0.6);
    doc.setFont(GARAMOND, "bold");
    doc.setFontSize(9.2);
    doc.setTextColor(...(colorEtiqueta ?? p.color));
    doc.text(p.etiqueta, tx, ty, { align });
    doc.setFont(GARAMOND, "normal");
    doc.setFontSize(8.4);
    doc.setTextColor(...colorSuave);
    doc.text(
      `${p.gramos} g  ·  ${Math.round((p.valor / total) * 100)}%`,
      tx, ty + 4, { align },
    );
  });
}

export async function generateNutricionPdf(
  result: NutricionResult,
  input: NutricionInput,
): Promise<void> {
  const t = TEMA_NUTRICION;
  const taller = await Taller.abrir(t, { titulo: "Tus necesidades" });
  const doc = taller.doc;

  const partes = [
    { valor: result.protKcal, color: COLOR_PROT, etiqueta: "Proteínas", gramos: result.protG },
    { valor: result.carbKcal, color: COLOR_CARB, etiqueta: "Carbohidratos", gramos: result.carbG },
    { valor: result.fatKcal, color: COLOR_GRASA, etiqueta: "Grasas", gramos: result.fatG },
  ];
  const totalKcal = partes.reduce((s, p) => s + p.valor, 0) || 1;

  /* ── PORTADA ── */
  taller.portada({
    titulo: "Tus necesidades",
    subtitulo: "Nutrición · Gasto y reparto diario",
    pieLamina:
      "Las calorías dicen cuánto. La corona dice de qué. Lo segundo importa más que lo primero.",
    cierre: "Tu punto de partida",
    lamina: (d, cx, yTop, ancho) => {
      const r = Math.min(ancho / 2 - 22, 46);
      laminaAnillo(
        d, cx, yTop + r + 12, r, partes, result.tdee,
        [255, 252, 246], [220, 234, 218], [246, 240, 228],
      );
    },
  });

  /* ── TU PUNTO DE PARTIDA ── */
  taller.nuevaPagina();
  taller.capitulo("Tu punto de partida", "Los datos con los que está hecho este cálculo.");

  const ficha: [string, string][] = [
    ["Peso", `${input.peso} kg`],
    ["Altura", `${input.altura} cm`],
    ["Edad", `${input.edad} años`],
    ["Sexo biológico", input.genero === "mujer" ? "Mujer" : "Hombre"],
    ["Nivel de actividad", input.actividad],
  ];
  ficha.forEach(([etiqueta, valor], i) => {
    taller.reservar(9);
    taller.versalitas(etiqueta, MARGEN + 2, taller.y, 8, t.apagado);
    doc.setFont(GARAMOND, "bold");
    doc.setFontSize(11.5);
    doc.setTextColor(...t.tinta);
    doc.text(valor, A4_W - MARGEN - 2, taller.y, { align: "right" });
    taller.y += 2.8;
    if (i < ficha.length - 1) {
      conAlfa(doc, 0.7, () => {
        doc.setDrawColor(...t.trama);
        doc.setLineWidth(0.15);
        doc.line(MARGEN + 2, taller.y, A4_W - MARGEN - 2, taller.y);
      });
    }
    taller.y += 6.2;
  });

  taller.espacio(4);
  taller.parrafo(
    "El gasto se estima con la ecuación de Mifflin-St Jeor —la más fiable en población general— " +
      "y se multiplica por tu nivel de actividad. Es una estimación de partida, no una verdad " +
      "sobre tu cuerpo: dos personas con estos mismos datos pueden gastar un 10 % distinto.",
    { capitular: true },
  );

  /* ── EL REPARTO ── */
  taller.capitulo("El reparto", "De dónde salen esas calorías.");
  taller.lamina(
    112,
    (d, cx, cy) => laminaAnillo(d, cx, cy, 44, partes, result.tdee, t.tinta, t.apagado),
  );

  // Barra apilada: las mismas calorías, vistas como una jornada.
  taller.reservar(22);
  taller.versalitas("Las mismas calorías, en una línea", MARGEN, taller.y, 8, t.apagado);
  taller.y += 4.5;
  let x = MARGEN;
  partes.forEach((p, i) => {
    const w = (ANCHO * p.valor) / totalKcal;
    doc.setFillColor(...p.color);
    // Solo se redondean los extremos de la barra completa.
    if (i === 0) doc.roundedRect(x, taller.y, w + 2, 5, 2.5, 2.5, "F");
    else if (i === partes.length - 1) doc.roundedRect(x - 2, taller.y, w + 2, 5, 2.5, 2.5, "F");
    else doc.rect(x, taller.y, w, 5, "F");
    if (w > 16) {
      doc.setFont(GARAMOND, "bold");
      doc.setFontSize(8);
      doc.setTextColor(255, 253, 248);
      doc.text(`${Math.round((p.valor / totalKcal) * 100)}%`, x + w / 2, taller.y + 3.5, { align: "center" });
    }
    x += w;
  });
  taller.y += 12;

  /* ── QUÉ HACE CADA UNO ── */
  taller.capitulo("Qué hace cada uno", "Para que el número tenga sentido en el plato.");
  MACROS_INFO.forEach((m, i) => {
    const p = partes[i];
    taller.reservar(16);
    // Cabecera de macro: disco de color, nombre, gramos y kcal.
    doc.setFillColor(...m.color);
    doc.circle(MARGEN + 2.6, taller.y - 1.5, 2.6, "F");
    doc.setFont(GARAMOND, "bold");
    doc.setFontSize(13);
    doc.setTextColor(...t.tinta);
    doc.text(m.nombre, MARGEN + 8.5, taller.y);
    doc.setFont(GARAMOND, "bold");
    doc.setFontSize(13);
    doc.setTextColor(...m.color);
    doc.text(`${p.gramos} g`, A4_W - MARGEN, taller.y, { align: "right" });
    const wG = doc.getTextWidth(`${p.gramos} g`);
    doc.setFont(GARAMOND, "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...t.apagado);
    doc.text(`${p.valor} kcal`, A4_W - MARGEN - wG - 5, taller.y, { align: "right" });
    taller.y += 5;

    taller.parrafo(m.porQue, { tam: 10.3, color: t.tintaSuave, x: MARGEN + 8.5, ancho: ANCHO - 8.5 });
    taller.reservar(8);
    taller.versalitas("Dónde", MARGEN + 8.5, taller.y, 7.4, t.apagado);
    doc.setFont(GARAMOND, "italic");
    doc.setFontSize(10);
    doc.setTextColor(...m.color);
    doc.text(m.donde, MARGEN + 24, taller.y);
    taller.y += 9;
  });

  /* ── LA LETRA PEQUEÑA ── */
  taller.espacio(2);
  taller.reservar(34);
  taller.antetitulo("La letra pequeña");
  taller.parrafo(
    "Esta estimación es orientativa. Las necesidades reales cambian con la composición corporal, " +
      "la genética, el sueño, el estrés, la medicación y cualquier condición de salud. Si tienes " +
      "un objetivo clínico —o simplemente quieres afinar—, esto es un buen punto de partida para " +
      "llevarle a un profesional de la nutrición, no un sustituto de esa consulta.",
    { tam: 9.6, color: t.apagado },
  );

  taller.cierre(
    "«Comer bien no es acertar todos los días: es acertar la mayoría, durante años.»",
  );

  taller.guardar("mis-necesidades-nutricionales.pdf");
}
