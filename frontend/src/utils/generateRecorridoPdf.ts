// ─────────────────────────────────────────────────────────────────────────
// «Mi mapa» — todo el recorrido de Ayurveda en un cuaderno.
//
// Es el documento más personal de la disciplina: reúne, en orden, lo que la
// persona fue escribiendo paso a paso, su compromiso, el día que diseñó y —de
// regalo— el recordatorio de qué desequilibra y qué devuelve el eje a su doṣha.
//
// La portada lleva su compromiso escrito a mano dentro de un cartucho: es la
// frase que quiso dejarse a sí misma, y merece ser lo primero que vea. Si no
// escribió ninguna, la portada cae en el emblema del loto.
// ─────────────────────────────────────────────────────────────────────────
import { Taller, MARGEN, ANCHO, A4_W, A4_H } from "./pdf/atelier";
import { TEMA_AYURVEDA, COLOR_DOSHA, type Tema } from "./pdf/temas";
import { conAlfa, filigranaEsquina } from "./pdf/formas";
import { relojDelDia, type DiaBloque } from "./generateDiaPdf";
import { GARAMOND } from "./fonts/ebGaramond";

const ACUARELA: Record<string, string> = {
  vata: "/img/fondos/vata.webp",
  pitta: "/img/fondos/pitta.webp",
  kapha: "/img/fondos/kapha.webp",
};

const limpio = (s: string) => (s || "").replace(/\*\*/g, "").replace(/\*/g, "").trim();

export interface RecorridoData {
  entradas: { pregunta: string; respuesta: string }[];
  compromiso: string;
  diaBloques: DiaBloque[];
  /** «Lo que aumenta / desequilibra tu doṣha». */
  desequilibra: { titulo: string; items: string[] };
  /** «Las primeras señales» de desequilibrio. */
  senales: { titulo: string; items: string[] };
  /** «Cómo volver al equilibrio». */
  equilibra: { titulo: string; items: string[] };
}

export async function generateRecorridoPdf(
  dosha: string,
  doshaLabel: string,
  data: RecorridoData,
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

  const taller = await Taller.abrir(tema, { titulo: "Mi mapa" });
  const doc = taller.doc;
  const compromiso = limpio(data.compromiso);

  /* ── PORTADA ── */
  taller.portada({
    titulo: "Mi mapa",
    subtitulo: `Ayurveda · Doṣha ${doshaLabel}`,
    cierre: "Mi recorrido",
    pieLamina: compromiso ? "Tu compromiso, con tus palabras." : undefined,
    lamina: compromiso
      ? (d, cx, yTop, ancho) => {
          // Cartucho: la frase enmarcada como una inscripción, centrada en todo
          // el hueco que queda entre el rombo y el bloque del pie.
          const largo = compromiso.length > 130;
          const tam = largo ? 14 : 17;
          const salto = largo ? 7.6 : 9.2;
          d.setFont(GARAMOND, "italic");
          d.setFontSize(tam);
          const lineas = d.splitTextToSize(`«${compromiso}»`, ancho - 34) as string[];
          const alto = lineas.length * salto + 32;
          const w = ancho - 8;
          const x = cx - w / 2;
          // Centro vertical del hueco disponible (hasta el pie de portada).
          const y = yTop + Math.max(0, (A4_H - 74 - yTop - alto) / 2);

          conAlfa(d, 0.34, () => {
            d.setFillColor(22, 10, 4);
            d.roundedRect(x, y, w, alto, 3.5, 3.5, "F");
          });
          d.setDrawColor(...tema.acentoSuave);
          d.setLineWidth(0.45);
          d.roundedRect(x, y, w, alto, 3.5, 3.5, "S");
          d.setLineWidth(0.16);
          d.roundedRect(x + 2.6, y + 2.6, w - 5.2, alto - 5.2, 2.4, 2.4, "S");
          filigranaEsquina(d, x + 6, y + 6, 1, 1, tema.acentoSuave, 8, false);
          filigranaEsquina(d, x + w - 6, y + alto - 6, -1, -1, tema.acentoSuave, 8, false);

          d.setFont(GARAMOND, "italic");
          d.setFontSize(tam);
          d.setTextColor(255, 250, 244);
          lineas.forEach((l, i) => d.text(l, cx, y + 21 + i * salto, { align: "center" }));
        }
      : undefined,
  });

  /* ── TUS PALABRAS ── */
  taller.nuevaPagina();
  const entradas = (data.entradas || []).filter((e) => limpio(e.respuesta));
  if (entradas.length) {
    taller.capitulo(
      "Tus palabras",
      "Lo que fuiste escribiendo paso a paso, sin retocar. Léelo dentro de un tiempo: " +
        "vas a reconocerte y a la vez vas a ver cuánto te has movido.",
    );
    entradas.forEach((e) => taller.preguntaRespuesta(e.pregunta, e.respuesta));
  }

  /* ── TU COMPROMISO ── */
  if (compromiso) {
    taller.capitulo("Tu compromiso");
    taller.reservar(30);
    const arriba = taller.y - 3;
    doc.setFont(GARAMOND, "italic");
    doc.setFontSize(15);
    const lineas = doc.splitTextToSize(compromiso, ANCHO - 26) as string[];
    const alto = lineas.length * 8 + 15;
    conAlfa(doc, 0.07, () => {
      doc.setFillColor(...color);
      doc.roundedRect(MARGEN, arriba, ANCHO, alto, 3, 3, "F");
    });
    doc.setDrawColor(...color);
    doc.setLineWidth(0.35);
    doc.roundedRect(MARGEN, arriba, ANCHO, alto, 3, 3, "S");
    // Comillas grandes, de libro.
    conAlfa(doc, 0.3, () => {
      doc.setFont(GARAMOND, "bold");
      doc.setFontSize(38);
      doc.setTextColor(...color);
      doc.text("“", MARGEN + 6, arriba + 20);
    });
    doc.setFont(GARAMOND, "italic");
    doc.setFontSize(15);
    doc.setTextColor(...tema.tinta);
    lineas.forEach((l, i) => doc.text(l, A4_W / 2, arriba + 13 + i * 8, { align: "center" }));
    taller.y = arriba + alto + 8;
  }

  /* ── TU DÍA IDEAL ── */
  const orden = [...(data.diaBloques || [])]
    .filter((b) => (b.actividad && b.actividad.trim()) || (b.alimentos && b.alimentos.length > 0) || b.hora)
    .sort((a, b) => (a.hora || "99").localeCompare(b.hora || "99"));

  taller.capitulo("Tu día ideal", "La rutina que diseñaste para sostener tu equilibrio.");
  if (orden.length === 0) {
    taller.parrafo("Aún no has creado tu día ideal.", { cursiva: true, color: tema.apagado });
  } else {
    taller.lamina(
      104,
      (d, cx, cy) => relojDelDia(d, cx, cy, 41, orden, color, tema.apagado, tema.tintaSuave),
      "Los puntos grandes son tus comidas; los pequeños, el resto de momentos.",
    );

    const HILO_X = MARGEN + 21;
    const TEXTO_X = MARGEN + 28;
    orden.forEach((b, i) => {
      const actividad = (b.actividad || (b.comida ? "Comida" : "Momento")).trim();
      doc.setFont(GARAMOND, b.comida ? "bold" : "normal");
      doc.setFontSize(11.5);
      const lineasAct = doc.splitTextToSize(actividad, ANCHO - 28) as string[];
      const comidaTxt = b.comida && b.alimentos.length > 0 ? b.alimentos.join("   ·   ") : "";
      doc.setFont(GARAMOND, "italic");
      doc.setFontSize(9.6);
      const lineasCom = comidaTxt ? (doc.splitTextToSize(comidaTxt, ANCHO - 28) as string[]) : [];
      const alto = lineasAct.length * 5.8 + (lineasCom.length ? lineasCom.length * 4.8 + 1.5 : 0);
      taller.reservar(alto + 10);
      const arriba = taller.y;

      doc.setFont(GARAMOND, "bold");
      doc.setFontSize(11.5);
      doc.setTextColor(...color);
      doc.text(b.hora || "—", MARGEN, arriba + 1);

      if (b.comida) {
        doc.setFillColor(...color);
        doc.circle(HILO_X, arriba - 1.2, 1.8, "F");
      } else {
        doc.setFillColor(...tema.papel);
        doc.circle(HILO_X, arriba - 1.2, 1.6, "F");
        doc.setDrawColor(...color);
        doc.setLineWidth(0.4);
        doc.circle(HILO_X, arriba - 1.2, 1.6, "S");
      }

      doc.setFont(GARAMOND, b.comida ? "bold" : "normal");
      doc.setFontSize(11.5);
      doc.setTextColor(...tema.tinta);
      lineasAct.forEach((l, j) => doc.text(l, TEXTO_X, arriba + j * 5.8));
      let yy = arriba + lineasAct.length * 5.8;
      if (lineasCom.length) {
        doc.setFont(GARAMOND, "italic");
        doc.setFontSize(9.6);
        doc.setTextColor(...tema.tintaSuave);
        lineasCom.forEach((l, j) => doc.text(l, TEXTO_X, yy + 1.5 + j * 4.8));
        yy += lineasCom.length * 4.8 + 1.5;
      }
      const abajo = yy + 4;
      if (i < orden.length - 1) {
        conAlfa(doc, 0.4, () => {
          doc.setDrawColor(...color);
          doc.setLineWidth(0.28);
          doc.line(HILO_X, arriba + 2, HILO_X, abajo + 2.5);
        });
      }
      taller.y = abajo + 2.5;
    });
  }

  /* ── EL REGALO: TU MAPA DE EQUILIBRIO ── */
  taller.divisor();
  taller.reservar(16);
  taller.versalitas("Un regalo para tu camino", A4_W / 2, taller.y, 8.6, tema.apagado, "center");
  taller.y += 10;

  if (data.desequilibra?.items?.length) {
    taller.capitulo(
      data.desequilibra.titulo || `Lo que desequilibra tu ${doshaLabel}`,
      "Reconocerlo a tiempo es la mitad del trabajo.",
    );
    taller.lista(data.desequilibra.items);
  }
  if (data.senales?.items?.length) {
    taller.capitulo(
      data.senales.titulo || "Las primeras señales",
      "El cuerpo avisa mucho antes de romperse. Estas son tus alarmas tempranas.",
    );
    taller.lista(data.senales.items);
  }
  if (data.equilibra?.items?.length) {
    taller.capitulo(
      data.equilibra.titulo || "Cómo volver al equilibrio",
      "Cuando reconozcas alguna de las señales de arriba, empieza por aquí.",
    );
    taller.lista(data.equilibra.items);
  }

  taller.cierre(
    "El equilibrio no aparece sin más: se construye con pequeñas decisiones repetidas cada día.",
  );

  taller.guardar(`mi-mapa-ayurveda-${clave || "dosha"}.pdf`);
}
