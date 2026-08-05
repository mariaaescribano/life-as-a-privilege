// ─────────────────────────────────────────────────────────────────────────
// Los PDF de Medicina China: el perfil del test y el vademécum de consejos.
//
// Papel oscuro —la MTC es una medicina de tinta y sello rojo, no de folio
// blanco— con la acuarela de la disciplina a sangre en la portada.
//
// La gracia está en el gráfico: si el test es el de los cinco movimientos, el
// documento dibuja el CICLO WU XING de verdad (anillo de generación fuera,
// estrella de control dentro) con cada nodo hinchado según lo que ha salido en
// las respuestas. Para el resto de tests, un radar con un eje por sección. En
// los dos casos el diagnóstico se ve antes de leerlo.
//
// Las respuestas no se listan como un formulario: cada pregunta lleva una
// REGLA con tantas muescas como valores tiene la escala y solo la elegida
// encendida. Ocupa una línea, se entiende de un vistazo y la escala se explica
// una sola vez al abrir el capítulo.
// ─────────────────────────────────────────────────────────────────────────
import type jsPDF from "jspdf";
import { Taller, MARGEN, ANCHO, A4_W } from "./pdf/atelier";
import { TEMA_TCM, COLOR_ELEMENTO, type RGB } from "./pdf/temas";
import { cicloWuXing, radar, conAlfa, polar } from "./pdf/formas";
import { GARAMOND } from "./fonts/ebGaramond";

export type TcmRespuesta = {
  seccion: string;
  pregunta_idx: number;
  pregunta: string;
  respuesta: number;
};

const TCM_TESTS: Record<number, { title: string; scaleValues: number[]; scaleLabels: string[]; intro: string }> = {
  1: {
    title: "Conoce tu constitución",
    scaleValues: [0, 1, 2],
    scaleLabels: ["Rara vez", "A veces", "Frecuentemente"],
    intro:
      "La constitución es el terreno con el que llegaste: no cambia con la estación, " +
      "pero explica por qué te desequilibras siempre por el mismo sitio.",
  },
  2: {
    title: "Tu elemento predominante",
    scaleValues: [0, 1, 2, 3],
    scaleLabels: ["No me describe", "Leve tendencia", "Moderadamente característico", "Muy característico"],
    intro:
      "Los cinco movimientos no son cinco cajones: son cinco fases de un mismo ciclo. " +
      "Lo que buscas aquí no es tu etiqueta, es dónde se está atascando la rueda.",
  },
  3: {
    title: "Tu desequilibrio actual",
    scaleValues: [0, 1, 2, 3],
    scaleLabels: ["Ausente", "Ocasional", "Frecuente", "Persistente / intenso"],
    intro:
      "Esto no retrata quién eres, sino cómo estás HOY. Repítelo dentro de unos meses: " +
      "la diferencia entre las dos fotos es el tratamiento.",
  },
};

const ELEMENTOS_ORDEN = ["madera", "fuego", "tierra", "metal", "agua"];
const normaliza = (s: string) =>
  (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

/** Agrupa las respuestas por sección conservando el orden de aparición. */
function porSeccion(respuestas: TcmRespuesta[]) {
  const secciones: { nombre: string; preguntas: TcmRespuesta[]; total: number }[] = [];
  const indice: Record<string, number> = {};
  for (const r of respuestas) {
    if (!(r.seccion in indice)) {
      indice[r.seccion] = secciones.length;
      secciones.push({ nombre: r.seccion, preguntas: [], total: 0 });
    }
    const s = secciones[indice[r.seccion]];
    s.preguntas.push(r);
    s.total += r.respuesta;
  }
  return secciones;
}

/** ¿Las secciones son los cinco movimientos? Entonces toca el ciclo Wu Xing. */
function esWuXing(secciones: { nombre: string }[]): boolean {
  return (
    secciones.length === 5 &&
    secciones.every((s, i) => normaliza(s.nombre) === ELEMENTOS_ORDEN[i])
  );
}

const colorSeccion = (nombre: string, fallback: RGB): RGB =>
  COLOR_ELEMENTO[normaliza(nombre)] ?? fallback;

/**
 * Lámina del perfil: ciclo Wu Xing si procede, radar si no. Devuelve el radio
 * usado por si el llamante quiere colocar algo alrededor.
 */
function laminaPerfil(
  doc: jsPDF,
  cx: number,
  cy: number,
  r: number,
  secciones: { nombre: string; total: number }[],
  max: number,
  tinta: RGB,
  trama: RGB,
  acento: RGB,
): void {
  const etiquetar = (p: [number, number], texto: string, valor: number, color: RGB, ang: number) => {
    const derecha = ang > 5 && ang < 175;
    const centro = ang <= 5 || ang >= 355 || (ang > 175 && ang < 185);
    doc.setFont(GARAMOND, "bold");
    doc.setFontSize(9.6);
    doc.setTextColor(...color);
    const align = centro ? "center" : derecha ? "left" : "right";
    doc.text(texto, p[0], p[1], { align });
    doc.setFont(GARAMOND, "normal");
    doc.setFontSize(8.4);
    doc.setTextColor(...tinta);
    doc.text(String(valor), p[0], p[1] + 3.8, { align });
  };

  if (esWuXing(secciones)) {
    const nodos = secciones.map((s) => ({
      etiqueta: s.nombre,
      color: colorSeccion(s.nombre, acento),
      valor: s.total,
    }));
    cicloWuXing(doc, cx, cy, r, nodos, max, trama);
    secciones.forEach((_, i) => {
      const ang = (i * 360) / 5;
      // r + 16: los nodos del Wu Xing son discos de 7,4 mm, así que la etiqueta
      // tiene que salir bastante más lejos que en el radar para no pisarlos.
      const fuera = polar(cx, cy, r + 16, ang);
      etiquetar(fuera, secciones[i].nombre, secciones[i].total, nodos[i].color, ang);
    });
    return;
  }

  const bordes = radar(
    doc, cx, cy, r,
    secciones.map((s) => s.total),
    max, acento, trama,
  );
  bordes.forEach((p, i) => {
    const ang = (i * 360) / secciones.length;
    etiquetar(p, secciones[i].nombre, secciones[i].total, acento, ang);
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   1 · EL PERFIL DEL TEST
═══════════════════════════════════════════════════════════════════════════ */

export async function generateTcmPdf(
  testNum: number,
  respuestas: TcmRespuesta[],
  resultado?: string,
  consejo?: string,
): Promise<void> {
  const info = TCM_TESTS[testNum];
  if (!info) return;

  const t = TEMA_TCM;
  const taller = await Taller.abrir(t, { titulo: info.title });
  const doc = taller.doc;

  const secciones = porSeccion(respuestas);
  const maxPosible = Math.max(
    1,
    ...secciones.map((s) => s.preguntas.length * Math.max(...info.scaleValues)),
  );
  const maxObtenido = Math.max(1, ...secciones.map((s) => s.total));
  const colorResultado = resultado ? colorSeccion(resultado, t.acento) : t.acento;

  /* ── PORTADA ── */
  taller.portada({
    titulo: info.title,
    subtitulo: "Medicina Tradicional China",
    nombre: resultado,
    pieLamina: esWuXing(secciones)
      ? "El anillo es el ciclo de generación; la estrella de puntos, el de control. " +
        "Cada disco crece con lo que has respondido."
      : "Cada eje es una de las áreas del test. La forma del polígono es tu perfil.",
    cierre: "Tu perfil",
    lamina: (d, cx, yTop, ancho) => {
      const r = Math.min(ancho / 2 - 24, 42);
      laminaPerfil(
        d, cx, yTop + r + 16, r, secciones, maxObtenido,
        [255, 246, 242], [206, 150, 142], t.acentoSuave,
      );
    },
  });

  /* ── LO QUE DICE ── */
  taller.nuevaPagina();
  taller.capitulo("Lo que dice tu test", info.intro);

  if (resultado) {
    taller.reservar(26);
    const arriba = taller.y - 3;
    const alto = 20;
    conAlfa(doc, 0.18, () => {
      doc.setFillColor(...colorResultado);
      doc.roundedRect(MARGEN, arriba, ANCHO, alto, 3, 3, "F");
    });
    doc.setDrawColor(...colorResultado);
    doc.setLineWidth(0.4);
    doc.roundedRect(MARGEN, arriba, ANCHO, alto, 3, 3, "S");
    taller.versalitas("Predominante", MARGEN + 9, arriba + 7.5, 7.6, t.apagado);
    doc.setFont(GARAMOND, "bold");
    doc.setFontSize(17);
    doc.setTextColor(...colorResultado);
    doc.text(resultado, MARGEN + 9, arriba + 15.5);
    taller.y = arriba + alto + 9;
  }

  if (consejo) taller.parrafo(consejo, { capitular: true, tam: 11.2 });

  /* ── EL PERFIL ── */
  taller.capitulo(
    esWuXing(secciones) ? "Tu rueda de los cinco movimientos" : "Tu perfil",
    esWuXing(secciones)
      ? "Un movimiento muy cargado tira del que genera y ahoga al que controla: por eso se lee la rueda entera, no el nodo más alto."
      : "La puntuación de cada área, en bruto y en proporción.",
  );

  taller.lamina(
    118,
    // La geometría del gráfico va en `apagado`: `trama` es el carril de las
    // barras y sobre el papel apenas se ve.
    (d, cx, cy) => laminaPerfil(d, cx, cy, 40, secciones, maxObtenido, t.tinta, t.apagado, t.acento),
  );

  for (const s of secciones) {
    taller.filaBarra({
      etiqueta: s.nombre,
      coletilla: `${s.preguntas.length} preguntas`,
      valor: `${s.total} / ${s.preguntas.length * Math.max(...info.scaleValues)}`,
      fraccion: s.total / maxPosible,
      color: colorSeccion(s.nombre, t.acento),
    });
  }

  /* ── LAS RESPUESTAS ── */
  taller.capitulo("Tus respuestas", "El registro completo, para poder repetir el test y comparar.");

  // La escala, explicada una sola vez.
  taller.reservar(10 + info.scaleValues.length * 5);
  taller.versalitas("La escala", MARGEN, taller.y, 8, t.acento);
  taller.y += 5.5;
  info.scaleValues.forEach((v) => {
    taller.reservar(6);
    doc.setDrawColor(...t.acento);
    doc.setLineWidth(0.3);
    doc.circle(MARGEN + 3, taller.y - 1.2, 2.2, "S");
    doc.setFont(GARAMOND, "bold");
    doc.setFontSize(7.6);
    doc.setTextColor(...t.acento);
    doc.text(String(v), MARGEN + 3, taller.y - 0.2, { align: "center" });
    doc.setFont(GARAMOND, "normal");
    doc.setFontSize(9.6);
    doc.setTextColor(...t.tintaSuave);
    doc.text(info.scaleLabels[v] ?? "", MARGEN + 10, taller.y);
    taller.y += 6;
  });
  taller.y += 5;

  const REGLA_X = A4_W - MARGEN - 34;
  for (const sec of secciones) {
    const colorSec = colorSeccion(sec.nombre, t.acento);
    taller.reservar(16);
    taller.y += 2;
    taller.versalitas(sec.nombre, MARGEN, taller.y, 8.6, colorSec);
    taller.y += 2.4;
    doc.setDrawColor(...colorSec);
    doc.setLineWidth(0.35);
    doc.line(MARGEN, taller.y, MARGEN + 22, taller.y);
    taller.y += 7;

    const ordenadas = [...sec.preguntas].sort((a, b) => a.pregunta_idx - b.pregunta_idx);
    for (const item of ordenadas) {
      doc.setFont(GARAMOND, "normal");
      doc.setFontSize(10);
      const lineas = doc.splitTextToSize(item.pregunta, REGLA_X - MARGEN - 8) as string[];
      const alto = Math.max(lineas.length * 5, 6);
      taller.reservar(alto + 4.5);

      doc.setFont(GARAMOND, "normal");
      doc.setFontSize(10);
      doc.setTextColor(...t.tinta);
      lineas.forEach((l, i) => doc.text(l, MARGEN, taller.y + i * 5));

      // La regla de la escala, alineada a la derecha.
      const n = info.scaleValues.length;
      const paso = 30 / (n - 1);
      const yr = taller.y - 1.3;
      conAlfa(doc, 0.55, () => {
        doc.setDrawColor(...t.trama);
        doc.setLineWidth(0.35);
        doc.line(REGLA_X, yr, REGLA_X + 30, yr);
      });
      info.scaleValues.forEach((v, i) => {
        const x = REGLA_X + i * paso;
        if (item.respuesta === v) {
          // La muesca elegida se enciende con el color de su sección: la página
          // se lee como cinco columnas de color, no como una lista gris.
          conAlfa(doc, 0.3, () => {
            doc.setFillColor(...colorSec);
            doc.circle(x, yr, 3.1, "F");
          });
          doc.setFillColor(...colorSec);
          doc.circle(x, yr, 1.75, "F");
        } else {
          doc.setDrawColor(...t.trama);
          doc.setLineWidth(0.3);
          doc.circle(x, yr, 1.35, "S");
        }
      });

      taller.y += alto + 3.4;
      conAlfa(doc, 0.4, () => {
        doc.setDrawColor(...t.trama);
        doc.setLineWidth(0.12);
        doc.line(MARGEN, taller.y - 2.2, A4_W - MARGEN, taller.y - 2.2);
      });
    }
    taller.y += 4;
  }

  taller.cierre(
    "«El buen médico trata la enfermedad que aún no ha aparecido.» — Huangdi Neijing",
  );

  taller.guardar(`mi-perfil-mtc-${testNum}.pdf`);
}

/* ═══════════════════════════════════════════════════════════════════════════
   2 · EL VADEMÉCUM DE CONSEJOS
═══════════════════════════════════════════════════════════════════════════ */

const BLOQUES_CONSEJOS: {
  key: "infusiones" | "hierbas" | "nutricion" | "estiloDeVida";
  titulo: string;
  intencion: string;
}[] = [
  {
    key: "infusiones",
    titulo: "Infusiones",
    intencion: "Lo más suave y lo más diario: agua caliente con intención.",
  },
  {
    key: "hierbas",
    titulo: "Plantas",
    intencion:
      "La farmacopea tradicional asociada a tu patrón. Consúltalas con un profesional si tomas medicación.",
  },
  {
    key: "nutricion",
    titulo: "En la mesa",
    intencion: "En MTC la comida se clasifica por su naturaleza térmica y su sabor, no por sus calorías.",
  },
  {
    key: "estiloDeVida",
    titulo: "En el día a día",
    intencion: "El ritmo, el descanso y el movimiento: lo que sostiene todo lo anterior.",
  },
];

export async function generateTcmConsejosPdf(
  testNum: number,
  resultado: string,
  recs: { infusiones: string[]; hierbas: string[]; estiloDeVida: string[]; nutricion: string[] },
  interpretacion?: string,
): Promise<void> {
  const info = TCM_TESTS[testNum];
  if (!info) return;

  const color = colorSeccion(resultado, TEMA_TCM.acento);
  const tema = {
    ...TEMA_TCM,
    acento: color,
    acentoSuave: [
      Math.round(color[0] + (255 - color[0]) * 0.34),
      Math.round(color[1] + (255 - color[1]) * 0.34),
      Math.round(color[2] + (255 - color[2]) * 0.34),
    ] as RGB,
  };

  const taller = await Taller.abrir(tema, { titulo: "Tus consejos" });

  /* ── PORTADA ── */
  taller.portada({
    titulo: "Cuidarte",
    subtitulo: `Medicina China · ${info.title}`,
    nombre: resultado,
    pieLamina: "Infusiones, plantas, mesa y ritmo — lo que la tradición asocia a tu patrón.",
    cierre: "Tu vademécum",
  });

  /* ── TU PATRÓN ── */
  taller.nuevaPagina();
  taller.capitulo(`Tu patrón · ${resultado}`);
  if (interpretacion) {
    taller.parrafo(interpretacion, { capitular: true, tam: 11.5 });
    taller.espacio(3);
  }
  taller.parrafo(
    "La MTC no receta contra un síntoma: mueve un terreno. Elige dos o tres cosas de las que " +
      "siguen, sostenlas unas semanas y observa qué cambia. Si estás en tratamiento médico o " +
      "tomas medicación, consulta antes las plantas.",
    { cursiva: true, color: tema.apagado, tam: 10.5 },
  );

  /* ── LOS BLOQUES ── */
  for (const bloque of BLOQUES_CONSEJOS) {
    const items = recs[bloque.key];
    if (!Array.isArray(items) || items.length === 0) continue;
    taller.capitulo(bloque.titulo, bloque.intencion);
    taller.glosario(items);
  }

  taller.cierre(
    "«Cuando el qi fluye, no hay dolor; donde hay dolor, el qi no fluye.»",
  );

  taller.guardar(`mis-consejos-mtc-${testNum}.pdf`);
}
