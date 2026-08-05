// ─────────────────────────────────────────────────────────────────────────
// «Mi día equilibrado» — la rutina que la persona ha diseñado para su doṣha.
//
// El hallazgo de este documento es la portada: un RELOJ DE 24 HORAS con todos
// sus momentos colocados donde caen de verdad. De un vistazo se ve si el día
// está bien repartido o si hay cinco cosas amontonadas por la mañana y un
// desierto por la tarde. Ninguna lista consigue eso.
//
// Dentro, la misma información como línea del tiempo: hora en el margen, hilo
// vertical continuo y cada momento en su tarjeta. Las comidas van marcadas con
// un disco lleno; el resto, con un anillo.
// ─────────────────────────────────────────────────────────────────────────
import type jsPDF from "jspdf";
import { Taller, MARGEN, ANCHO } from "./pdf/atelier";
import { TEMA_AYURVEDA, COLOR_DOSHA, type Tema, type RGB } from "./pdf/temas";
import { polar, conAlfa, arco } from "./pdf/formas";
import { GARAMOND } from "./fonts/ebGaramond";

export interface DiaBloque { hora: string; actividad: string; comida: boolean; alimentos: string[] }

const ACUARELA: Record<string, string> = {
  vata: "/img/fondos/vata.webp",
  pitta: "/img/fondos/pitta.webp",
  kapha: "/img/fondos/kapha.webp",
};

/** «07:30» → 7.5. Devuelve null si no hay hora legible. */
function horaDecimal(hora: string): number | null {
  const m = /^(\d{1,2})(?::(\d{2}))?/.exec((hora || "").trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2] ?? 0);
  if (!Number.isFinite(h) || h > 23) return null;
  return h + min / 60;
}

/**
 * Reloj de 24 horas con los momentos del día colocados en su ángulo real.
 * Medianoche arriba, mediodía abajo: se lee como un reloj normal, pero de día
 * entero.
 */
export function relojDelDia(
  doc: jsPDF,
  cx: number,
  cy: number,
  r: number,
  bloques: DiaBloque[],
  color: RGB,
  aro: RGB,
  texto: RGB,
): void {
  // Corona: apenas un velo. Más tinta que esto y compite con la caja de la
  // lámina que hay debajo.
  conAlfa(doc, 0.08, () => {
    doc.setFillColor(...color);
    doc.circle(cx, cy, r, "F");
  });
  doc.setDrawColor(...aro);
  doc.setLineWidth(0.4);
  doc.circle(cx, cy, r, "S");
  doc.setLineWidth(0.2);
  doc.circle(cx, cy, r * 0.82, "S");

  // Muescas: una por hora, más largas cada seis.
  for (let h = 0; h < 24; h++) {
    const ang = (h / 24) * 360;
    const grande = h % 6 === 0;
    const p1 = polar(cx, cy, r * (grande ? 0.72 : 0.78), ang);
    const p2 = polar(cx, cy, r * 0.82, ang);
    doc.setLineWidth(grande ? 0.4 : 0.15);
    doc.setDrawColor(...aro);
    doc.line(p1[0], p1[1], p2[0], p2[1]);
  }

  // Las cuatro horas cardinales.
  doc.setFont(GARAMOND, "normal");
  doc.setFontSize(8.4);
  doc.setTextColor(...texto);
  ([[0, "00"], [6, "06"], [12, "12"], [18, "18"]] as [number, string][]).forEach(([h, txt]) => {
    const p = polar(cx, cy, r * 0.63, (h / 24) * 360);
    doc.text(txt, p[0], p[1] + 1.4, { align: "center" });
  });

  // Los momentos.
  const conHora = bloques
    .map((b) => ({ b, h: horaDecimal(b.hora) }))
    .filter((x): x is { b: DiaBloque; h: number } => x.h !== null)
    .sort((a, b) => a.h - b.h);

  // Hilo que une el día: un arco de la primera a la última hora.
  if (conHora.length > 1) {
    conAlfa(doc, 0.5, () => {
      doc.setDrawColor(...color);
      doc.setLineWidth(0.6);
      arco(doc, cx, cy, r, (conHora[0].h / 24) * 360, (conHora[conHora.length - 1].h / 24) * 360, 60);
    });
  }

  for (const { b, h } of conHora) {
    const ang = (h / 24) * 360;
    const p = polar(cx, cy, r, ang);
    // Comida y momento se distinguen por TAMAÑO, no por relleno: el reloj se
    // dibuja lo mismo sobre la acuarela de la portada que sobre el papel, y un
    // anillo «vacío» necesitaría saber de qué color es el fondo en ese punto.
    if (b.comida) {
      conAlfa(doc, 0.3, () => { doc.setFillColor(...color); doc.circle(p[0], p[1], 3.6, "F"); });
      doc.setFillColor(...color);
      doc.circle(p[0], p[1], 2, "F");
    } else {
      doc.setFillColor(...color);
      doc.circle(p[0], p[1], 1, "F");
    }
    // Radio corto hacia dentro: ancla el punto al reloj.
    const dentro = polar(cx, cy, r * 0.84, ang);
    conAlfa(doc, 0.45, () => {
      doc.setDrawColor(...color);
      doc.setLineWidth(0.2);
      doc.line(dentro[0], dentro[1], p[0], p[1]);
    });
  }

  // Centro.
  doc.setFillColor(...aro);
  doc.circle(cx, cy, 1, "F");
}

export async function generateDiaPdf(
  dosha: string,
  doshaLabel: string,
  bloques: DiaBloque[],
): Promise<void> {
  const clave = (dosha || "").toLowerCase();
  const color = COLOR_DOSHA[clave] ?? TEMA_AYURVEDA.acento;
  const tema: Tema = {
    ...TEMA_AYURVEDA,
    acento: color,
    acentoSuave: [
      Math.round(color[0] + (255 - color[0]) * 0.46),
      Math.round(color[1] + (255 - color[1]) * 0.46),
      Math.round(color[2] + (255 - color[2]) * 0.46),
    ],
    acuarela: ACUARELA[clave] ?? TEMA_AYURVEDA.acuarela,
  };

  const taller = await Taller.abrir(tema, { titulo: "Mi día equilibrado" });
  const doc = taller.doc;

  const orden = [...bloques]
    .filter((b) => (b.actividad && b.actividad.trim()) || (b.alimentos && b.alimentos.length > 0) || b.hora)
    .sort((a, b) => (a.hora || "99").localeCompare(b.hora || "99"));

  const comidas = orden.filter((b) => b.comida).length;

  /* ── PORTADA ── */
  taller.portada({
    titulo: "Mi día equilibrado",
    subtitulo: `Ayurveda · Doṣha ${doshaLabel}`,
    nombre: orden.length
      ? `${orden.length} momentos  ·  ${comidas} comidas`
      : undefined,
    pieLamina: orden.length
      ? "Tu día entero en un reloj de 24 horas. Los puntos grandes son las comidas."
      : undefined,
    cierre: "Mi rutina",
    lamina: (d, cx, yTop, ancho) => {
      const r = Math.min(ancho / 2 - 20, 44);
      relojDelDia(
        d, cx, yTop + r + 14, r, orden,
        [255, 250, 244], [240, 218, 192], [255, 250, 244],
      );
    },
  });

  /* ── LA LÍNEA DEL DÍA ── */
  taller.nuevaPagina();

  if (orden.length === 0) {
    taller.capitulo("Tu día");
    taller.parrafo("Aún no has añadido momentos a tu día.", { cursiva: true, color: tema.apagado });
    taller.guardar(`mi-dia-ayurveda-${clave || "dosha"}.pdf`);
    return;
  }

  taller.capitulo(
    "Tu día, hora a hora",
    "El Ayurveda no pide gestas: pide repetición. Esto es lo que has decidido sostener.",
  );

  // El reloj va PRIMERO: es la lectura de un vistazo, y además así la lista no
  // deja media página en blanco cuando la lámina no cabe detrás.
  taller.lamina(
    104,
    (d, cx, cy) => relojDelDia(d, cx, cy, 41, orden, color, tema.apagado, tema.tintaSuave),
    "Si todo se te amontona en una franja del día, ahí tienes el primer ajuste.",
  );

  const HORA_X = MARGEN;
  const HILO_X = MARGEN + 21;
  const TEXTO_X = MARGEN + 28;
  const TEXTO_W = ANCHO - 28;

  orden.forEach((b, i) => {
    const actividad = (b.actividad || (b.comida ? "Comida" : "Momento")).trim();
    doc.setFont(GARAMOND, b.comida ? "bold" : "normal");
    doc.setFontSize(12);
    const lineasAct = doc.splitTextToSize(actividad, TEXTO_W) as string[];
    const comida = b.comida && b.alimentos.length > 0 ? b.alimentos.join("   ·   ") : "";
    doc.setFont(GARAMOND, "italic");
    doc.setFontSize(10);
    const lineasCom = comida ? (doc.splitTextToSize(comida, TEXTO_W) as string[]) : [];
    const alto = lineasAct.length * 6 + (lineasCom.length ? lineasCom.length * 5 + 1.5 : 0);

    taller.reservar(alto + 12);
    const arriba = taller.y;

    // Hora, en el margen.
    doc.setFont(GARAMOND, "bold");
    doc.setFontSize(12.5);
    doc.setTextColor(...color);
    doc.text(b.hora || "—", HORA_X, arriba + 1);

    // Nodo del hilo.
    if (b.comida) {
      conAlfa(doc, 0.25, () => { doc.setFillColor(...color); doc.circle(HILO_X, arriba - 1.2, 3.2, "F"); });
      doc.setFillColor(...color);
      doc.circle(HILO_X, arriba - 1.2, 1.9, "F");
    } else {
      doc.setFillColor(...tema.papel);
      doc.circle(HILO_X, arriba - 1.2, 1.7, "F");
      doc.setDrawColor(...color);
      doc.setLineWidth(0.45);
      doc.circle(HILO_X, arriba - 1.2, 1.7, "S");
    }

    // Texto.
    doc.setFont(GARAMOND, b.comida ? "bold" : "normal");
    doc.setFontSize(12);
    doc.setTextColor(...tema.tinta);
    lineasAct.forEach((l, j) => doc.text(l, TEXTO_X, arriba + j * 6));
    let yy = arriba + lineasAct.length * 6;
    if (lineasCom.length) {
      doc.setFont(GARAMOND, "italic");
      doc.setFontSize(10);
      doc.setTextColor(...tema.tintaSuave);
      lineasCom.forEach((l, j) => doc.text(l, TEXTO_X, yy + 1.5 + j * 5));
      yy += lineasCom.length * 5 + 1.5;
    }

    // Hilo hasta el siguiente momento.
    const abajo = yy + 5;
    if (i < orden.length - 1) {
      conAlfa(doc, 0.45, () => {
        doc.setDrawColor(...color);
        doc.setLineWidth(0.3);
        doc.line(HILO_X, arriba + 2.2, HILO_X, abajo + 2.5);
      });
    }
    taller.y = abajo + 3;
  });

  taller.cierre("El equilibrio no aparece: se construye con pequeños hábitos repetidos cada día.");

  taller.guardar(`mi-dia-ayurveda-${clave || "dosha"}.pdf`);
}
