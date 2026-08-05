// ─────────────────────────────────────────────────────────────────────────
// «Tu constitución» — el PDF del test de doṣhas.
//
// El test no da un resultado binario y el PDF no debe fingir que sí: casi nadie
// es Vata puro. Por eso la portada no es un rótulo con el nombre del doṣha, es
// un DIAGRAMA TERNARIO: un triángulo con un punto que dice exactamente dónde
// está la persona entre las tres fuerzas. Ese dibujo es el documento.
//
// Dentro: la proporción de cada doṣha en barras, la lectura honesta de la
// mezcla (dominante / bidóshico / tridóshico) y el registro completo de las
// respuestas con las tres opciones a la vista, para que se pueda repetir el
// test dentro de un año y comparar.
// ─────────────────────────────────────────────────────────────────────────
import type jsPDF from "jspdf";
import { Taller, MARGEN, ANCHO } from "./pdf/atelier";
import { TEMA_AYURVEDA, COLOR_DOSHA, type RGB } from "./pdf/temas";
import { ternario, conAlfa } from "./pdf/formas";
import { GARAMOND } from "./fonts/ebGaramond";

export type AyurvedaRespuesta = {
  pregunta_idx: number;
  pregunta: string;
  dosha_elegida: "vata" | "pitta" | "kapha";
};

type Clave = "vata" | "pitta" | "kapha";
const ORDEN: Clave[] = ["vata", "pitta", "kapha"];
const ETIQUETA: Record<Clave, string> = { vata: "Vata", pitta: "Pitta", kapha: "Kapha" };
const ELEMENTOS: Record<Clave, string> = {
  vata: "aire y éter",
  pitta: "fuego y agua",
  kapha: "tierra y agua",
};
const CUALIDAD: Record<Clave, string> = {
  vata: "movimiento, ligereza, cambio",
  pitta: "transformación, fuego, precisión",
  kapha: "estructura, calma, sostén",
};

/** Cómo se lee una mezcla, sin fingir pureza donde no la hay. */
function lecturaMezcla(pct: Record<Clave, number>): { titulo: string; texto: string } {
  const orden = [...ORDEN].sort((a, b) => pct[b] - pct[a]);
  const [p, s, t] = orden;
  const dif1 = pct[p] - pct[s];
  const dif2 = pct[s] - pct[t];

  if (dif1 < 8 && dif2 < 8) {
    return {
      titulo: "Constitución tridóshica",
      texto:
        "Las tres fuerzas conviven en ti en proporciones parecidas. Es la constitución menos " +
        "frecuente y la más versátil: te adaptas bien a contextos muy distintos, pero también " +
        "te desequilibras por vías muy distintas. Tu trabajo no es corregir un exceso fijo, " +
        "sino aprender a leer cuál de las tres se ha desbordado en cada temporada.",
    };
  }
  if (dif1 < 10) {
    return {
      titulo: `Constitución ${ETIQUETA[p]}-${ETIQUETA[s]}`,
      texto:
        `${ETIQUETA[p]} y ${ETIQUETA[s]} mandan casi por igual en ti, y eso no es indecisión del ` +
        `test: es tu forma. Vives entre ${CUALIDAD[p].split(",")[0]} y ${CUALIDAD[s].split(",")[0]}. ` +
        `Cuando te cuides, ten en cuenta a las dos: lo que calma a ${ETIQUETA[p]} a veces despierta ` +
        `a ${ETIQUETA[s]}, y ahí está el equilibrio fino que te toca a ti.`,
    };
  }
  return {
    titulo: `Constitución ${ETIQUETA[p]} predominante`,
    texto:
      `${ETIQUETA[p]} —${ELEMENTOS[p]}— es la fuerza que más te define: ${CUALIDAD[p]}. ` +
      `${ETIQUETA[s]} te acompaña en segundo plano y aparece sobre todo bajo presión. ` +
      `${ETIQUETA[t]} es tu reserva: es lo que menos te sale de forma natural y, justamente por eso, ` +
      `lo que más te conviene cultivar a conciencia cuando pierdes el eje.`,
  };
}

/** Alto total que ocupa el ternario con sus rótulos, para reservarle sitio. */
const altoTernario = (lado: number) => (lado * Math.sqrt(3)) / 2 + 28;

/**
 * Diagrama ternario con sus tres nombres. `cyCaja` es el centro de la CAJA
 * (no el del triángulo): el vértice de arriba queda 2/3 de la altura por
 * encima del baricentro, así que sin esta corrección el dibujo se sube y se
 * come lo que tenga encima.
 */
function dibujarTernario(
  doc: jsPDF,
  cx: number,
  cyCaja: number,
  lado: number,
  scores: Record<Clave, number>,
  colorTexto: RGB,
  colorTrama: RGB,
  /** Color de los porcentajes. En portada van en crema: el color del doṣha se
   *  pierde sobre la acuarela. Dentro, cada uno con el suyo. */
  colorValor?: RGB,
): void {
  const h = (lado * Math.sqrt(3)) / 2;
  const { vertices } = ternario(
    doc, cx, cyCaja + h / 6 - 1, lado,
    [scores.vata, scores.pitta, scores.kapha],
    [COLOR_DOSHA.vata, COLOR_DOSHA.pitta, COLOR_DOSHA.kapha],
    colorTrama,
  );
  const total = scores.vata + scores.pitta + scores.kapha || 1;
  const pct = (n: number) => `${Math.round((n / total) * 100)}%`;

  const rotulo = (
    p: [number, number], nombre: string, valor: string, color: RGB, dy: number, dx: number,
  ) => {
    doc.setFont(GARAMOND, "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...colorTexto);
    doc.text(nombre, p[0] + dx, p[1] + dy, { align: "center", charSpace: 0.9 });
    doc.setFont(GARAMOND, "bold");
    doc.setFontSize(10);
    doc.setTextColor(...(colorValor ?? color));
    doc.text(valor, p[0] + dx, p[1] + dy + (dy < 0 ? -4.8 : 5), { align: "center" });
  };

  rotulo(vertices[0], "VATA", pct(scores.vata), COLOR_DOSHA.vata, -6.5, 0);
  rotulo(vertices[1], "PITTA", pct(scores.pitta), COLOR_DOSHA.pitta, 7.5, 2);
  rotulo(vertices[2], "KAPHA", pct(scores.kapha), COLOR_DOSHA.kapha, 7.5, -2);
}

export async function generateAyurvedaPdf(
  respuestas: AyurvedaRespuesta[],
  resultado: string,
  scores: { vata: number; pitta: number; kapha: number },
): Promise<void> {
  const t = TEMA_AYURVEDA;
  const taller = await Taller.abrir(t, { titulo: "Tu constitución" });
  const doc = taller.doc;

  const total = scores.vata + scores.pitta + scores.kapha || 1;
  const pct: Record<Clave, number> = {
    vata: (scores.vata / total) * 100,
    pitta: (scores.pitta / total) * 100,
    kapha: (scores.kapha / total) * 100,
  };
  const dominante = (ORDEN.find((k) => k === resultado.toLowerCase()) ??
    ORDEN.reduce((a, b) => (pct[a] >= pct[b] ? a : b))) as Clave;

  /* ── PORTADA ── */
  taller.portada({
    titulo: "Tu constitución",
    subtitulo: "Ayurveda · Prakriti",
    nombre: ETIQUETA[dominante],
    pieLamina:
      "El punto marca dónde estás exactamente entre las tres fuerzas. " +
      "Cuanto más cerca de un vértice, más pura la constitución.",
    lamina: (d, cx, yTop, ancho) => {
      const lado = Math.min(ancho - 26, 112);
      dibujarTernario(
        d, cx, yTop + altoTernario(lado) / 2, lado, scores,
        [255, 250, 244], [232, 208, 178], [246, 236, 222],
      );
    },
    // Nada de versalitas con «ṣ»: EB Garamond no trae la mayúscula y se cae el
    // glifo («TU DOṢHA» salía «TU DOHA»).
    cierre: "Tu constitución",
  });

  /* ── LA MEZCLA ── */
  taller.nuevaPagina();
  const lectura = lecturaMezcla(pct);
  taller.capitulo("Tu mezcla", lectura.titulo);
  taller.parrafo(lectura.texto, { capitular: true });
  taller.espacio(4);

  for (const k of ORDEN) {
    taller.filaBarra({
      etiqueta: ETIQUETA[k],
      coletilla: ELEMENTOS[k],
      valor: `${Math.round(pct[k])}%   ·   ${scores[k]} de ${total}`,
      fraccion: pct[k] / 100,
      color: COLOR_DOSHA[k],
    });
  }

  taller.espacio(2);
  const LADO = 84;
  taller.lamina(
    altoTernario(LADO),
    // La trama va en `apagado`, no en `trama`: sobre papel crema el carril de
    // las barras es casi invisible y el triángulo se quedaba sin dibujo.
    (d, cx, cy) => dibujarTernario(d, cx, cy, LADO, scores, t.tinta, t.apagado),
    "Tu constitución no es una etiqueta: es una posición. Repite el test dentro de un año " +
      "y verás cuánto se ha movido este punto.",
  );

  /* ── LAS TRES FUERZAS ── */
  taller.capitulo("Las tres fuerzas", "Qué gobierna cada una y cómo se nota cuando manda.");
  for (const k of ORDEN) {
    taller.tarjeta({
      titulo: `${ETIQUETA[k]} · ${ELEMENTOS[k]}`,
      cuerpo: CUALIDAD[k],
      extra:
        k === dominante
          ? `Tu fuerza dominante — ${Math.round(pct[k])}% de tus respuestas`
          : `${Math.round(pct[k])}% de tus respuestas`,
      cursivaCuerpo: true,
    });
  }

  /* ── LAS RESPUESTAS ── */
  const ordenadas = [...respuestas].sort((a, b) => a.pregunta_idx - b.pregunta_idx);
  if (ordenadas.length) {
    taller.capitulo(
      "Tus respuestas",
      "El registro completo, con las tres opciones a la vista: así puedes volver a leerlo " +
        "y ver qué ha cambiado.",
    );

    const anchoChip = (ANCHO - 8) / 3;
    for (const item of ordenadas) {
      doc.setFont(GARAMOND, "normal");
      doc.setFontSize(10.5);
      const lineas = doc.splitTextToSize(item.pregunta, ANCHO - 12) as string[];
      taller.reservar(lineas.length * 5.2 + 14);

      // Número de pregunta en un disco de acento.
      doc.setFillColor(...t.acento);
      doc.circle(MARGEN + 3, taller.y - 1.4, 3, "F");
      doc.setFont(GARAMOND, "bold");
      doc.setFontSize(7.6);
      doc.setTextColor(...t.papel);
      doc.text(String(item.pregunta_idx + 1), MARGEN + 3, taller.y + 0.3, { align: "center" });

      doc.setFont(GARAMOND, "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(...t.tinta);
      lineas.forEach((l, i) => doc.text(l, MARGEN + 9, taller.y + i * 5.2));
      taller.y += lineas.length * 5.2 + 1.4;

      // Las tres opciones como pastillas; la elegida, llena.
      ORDEN.forEach((k, i) => {
        const x = MARGEN + i * (anchoChip + 4);
        const elegida = item.dosha_elegida === k;
        const color = COLOR_DOSHA[k];
        if (elegida) {
          doc.setFillColor(...color);
          doc.roundedRect(x, taller.y, anchoChip, 6.4, 3.2, 3.2, "F");
          doc.setFont(GARAMOND, "bold");
          doc.setTextColor(255, 252, 246);
        } else {
          doc.setDrawColor(...color);
          doc.setLineWidth(0.25);
          conAlfa(doc, 0.38, () => doc.roundedRect(x, taller.y, anchoChip, 6.4, 3.2, 3.2, "S"));
          doc.setFont(GARAMOND, "normal");
          doc.setTextColor(...t.apagado);
        }
        doc.setFontSize(9);
        doc.text(ETIQUETA[k], x + anchoChip / 2, taller.y + 4.4, { align: "center" });
      });
      taller.y += 13;
    }
  }

  /* ── CIERRE ── */
  taller.cierre(
    "«Prakriti es la constitución con la que naciste; vikriti, el estado en el que estás hoy. " +
      "El camino del Ayurveda es acortar la distancia entre las dos.»",
  );

  taller.guardar("mi-constitucion-ayurveda.pdf");
}
