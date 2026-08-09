// ─────────────────────────────────────────────────────────────────────────
// «Mi línea de Vida» — el segundo cuaderno de Psicología.
//
// «Mi mapa» (generatePsicologiaPdf) resume el recorrido entero: el problema, el
// ACE, las heridas, los dones, la carta… pero de la línea de Vida solo se lleva
// las huellas marcadas. Todo lo demás —lo que la persona escribió año por año,
// que suele ser lo más largo y lo más suyo— no cabía en ningún sitio.
//
// Este documento es exactamente eso: la Vida año a año, tal cual la contó.
// Se abre en la gestación (el nodo −1: lo que le contaron de antes de nacer) y
// va bajando por las etapas vitales, capítulo a capítulo. Dentro de cada año,
// cada pregunta con su respuesta y, al final, lo que ese año dejó de huella.
//
// La portada dibuja la línea entera: un punto por año, lleno si lo escribió,
// hueco si lo marcó sin recuerdos, con halo si dejó huella. Se ve de un vistazo
// dónde está llena su Vida y dónde está en blanco.
// ─────────────────────────────────────────────────────────────────────────
import type jsPDF from "jspdf";
import { Taller, MARGEN, ANCHO, A4_W } from "./pdf/atelier";
import { TEMA_PSICOLOGIA } from "./pdf/temas";
import { conAlfa } from "./pdf/formas";
import type { RGB } from "./pdf/temas";
import {
  ANO_GESTACION,
  ETAPAS_VITALES,
  EXPERIENCIAS,
  anoNatural,
  estadoDelAno,
  itemsDeRespuesta,
  preguntasDeAno,
  type EstadoAno,
  type LineaDeVidaData,
} from "../components/metodo/psicologiaRecorrido";
import { GARAMOND } from "./fonts/ebGaramond";

const limpio = (s: string) => (s || "").replace(/\*\*/g, "").replace(/\*/g, "").trim();

/** Un nodo de la línea dibujada en la portada. */
interface NodoLinea {
  estado: EstadoAno;
  huella: boolean;
}

/**
 * La línea de Vida dibujada: filas de puntos, uno por año. Lleno = lo escribió,
 * hueco = lo marcó sin recuerdos, tenue = ni lo abrió. El halo marca los años
 * que dejaron huella.
 */
function laminaLinea(
  doc: jsPDF,
  cx: number,
  yTop: number,
  ancho: number,
  nodos: NodoLinea[],
  color: RGB,
  colorPunto: RGB,
): void {
  const PORFILA = 20;
  const paso = ancho / (PORFILA - 1);
  const gap = 13;
  const x0 = cx - ancho / 2;
  const filas = Math.max(1, Math.ceil(nodos.length / PORFILA));

  for (let f = 0; f < filas; f++) {
    const trozo = nodos.slice(f * PORFILA, (f + 1) * PORFILA);
    if (!trozo.length) continue;
    const y = yTop + f * gap;
    const xFin = x0 + Math.max(1, trozo.length - 1) * paso;

    conAlfa(doc, 0.55, () => {
      doc.setDrawColor(...color);
      doc.setLineWidth(0.4);
      doc.line(x0, y, xFin, y);
    });

    trozo.forEach((n, i) => {
      const x = x0 + i * paso;
      if (n.huella) {
        conAlfa(doc, 0.3, () => {
          doc.setFillColor(...colorPunto);
          doc.circle(x, y, 2.7, "F");
        });
      }
      if (n.estado === "completado") {
        doc.setFillColor(...colorPunto);
        doc.circle(x, y, 1.5, "F");
      } else if (n.estado === "sin-recuerdos") {
        doc.setDrawColor(...colorPunto);
        doc.setLineWidth(0.3);
        doc.circle(x, y, 1.3, "S");
      } else {
        conAlfa(doc, 0.3, () => {
          doc.setFillColor(...colorPunto);
          doc.circle(x, y, 0.7, "F");
        });
      }
    });
  }
}

export async function generateLineaDeVidaPdf(data: LineaDeVidaData): Promise<void> {
  const t = TEMA_PSICOLOGIA;
  const exp = EXPERIENCIAS[0];
  const taller = await Taller.abrir(t, { titulo: "Mi línea de Vida" });
  const doc = taller.doc;

  const edad = Math.max(0, Math.floor(Number(data.edad) || 0));
  const anioActual = new Date().getFullYear();

  /** Las huellas de un año (blindado: heredado podría no ser array). */
  const huellasDe = (edadAno: number): string[] => {
    const ano = data?.anos?.[String(edadAno)];
    const lista = Array.isArray(ano?.huellas) ? ano!.huellas! : [];
    return lista.map((x) => (typeof x === "string" ? x.trim() : "")).filter(Boolean);
  };

  /** Las respuestas escritas de un año, pregunta a pregunta. */
  const respuestasDe = (edadAno: number): { pregunta: string; items: string[] }[] =>
    preguntasDeAno(exp, edadAno)
      .map((p) => ({
        pregunta: p.pregunta,
        items: itemsDeRespuesta(data?.anos?.[String(edadAno)]?.respuestas?.[p.key])
          .map((x) => limpio(x))
          .filter(Boolean),
      }))
      .filter((x) => x.items.length > 0);

  /* ── Recuento: hace falta para la portada y para el vistazo ── */
  const anios: number[] = [];
  for (let a = 0; a <= edad; a++) anios.push(a);

  const escritos = anios.filter((a) => estadoDelAno(data, a) === "completado");
  const sinRecuerdos = anios.filter((a) => estadoDelAno(data, a) === "sin-recuerdos");
  const recorridos = escritos.length + sinRecuerdos.length;
  const totalHuellas = anios.reduce((n, a) => n + huellasDe(a).length, 0);

  const gestacion = respuestasDe(ANO_GESTACION);
  const huellasGestacion = huellasDe(ANO_GESTACION);
  const hayGestacion = gestacion.length > 0 || huellasGestacion.length > 0;

  const nodos: NodoLinea[] = [];
  if (hayGestacion || estadoDelAno(data, ANO_GESTACION) !== "vacio") {
    nodos.push({ estado: estadoDelAno(data, ANO_GESTACION), huella: huellasGestacion.length > 0 });
  }
  anios.forEach((a) => nodos.push({ estado: estadoDelAno(data, a), huella: huellasDe(a).length > 0 }));

  /* ── PORTADA ── */
  taller.portada({
    titulo: "Mi línea de Vida",
    subtitulo: "Psicología · Año a año, contado por ti",
    pieLamina:
      recorridos > 0
        ? `${recorridos} de ${edad + 1} años recorridos` +
          (totalHuellas > 0
            ? `. ${totalHuellas} ${totalHuellas === 1 ? "recuerdo dejó huella" : "recuerdos dejaron huella"}.`
            : ".")
        : undefined,
    cierre: "Mi historia",
    lamina: (d, cx, yTop, ancho) => {
      laminaLinea(d, cx, yTop + 12, ancho - 10, nodos, [246, 226, 206], [255, 246, 236]);
    },
  });

  /* ── DE UN VISTAZO ── */
  taller.nuevaPagina();
  taller.capitulo(
    "De un vistazo",
    "Cuánta Vida hay escrita aquí dentro. Los años en blanco no son un fallo: " +
      "son sitio que dejaste para cuando vuelvas.",
  );

  const inventario: [string, number][] = ([
    ["Años escritos", escritos.length],
    ["Sin recuerdos", sinRecuerdos.length],
    ["Huellas", totalHuellas],
    ["Años de Vida", edad + 1],
  ] as [string, number][]).filter(([, n]) => n > 0);

  if (inventario.length) {
    const cols = Math.min(4, inventario.length);
    const anchoCel = ANCHO / cols;
    const filas = Math.ceil(inventario.length / cols);
    taller.reservar(filas * 21 + 6);
    const arriba = taller.y;
    inventario.forEach(([etiqueta, n], i) => {
      const fila = Math.floor(i / cols);
      const col = i % cols;
      const cx = MARGEN + col * anchoCel + anchoCel / 2;
      const cy = arriba + fila * 21;
      doc.setFont(GARAMOND, "bold");
      doc.setFontSize(25);
      doc.setTextColor(...t.acento);
      doc.text(String(n), cx, cy + 6, { align: "center" });
      taller.versalitas(etiqueta, cx, cy + 12.5, 7.6, t.apagado, "center");
      if (col < cols - 1 && i < inventario.length - 1) {
        conAlfa(doc, 0.6, () => {
          doc.setDrawColor(...t.trama);
          doc.setLineWidth(0.15);
          doc.line(cx + anchoCel / 2, cy - 2, cx + anchoCel / 2, cy + 13);
        });
      }
    });
    taller.y = arriba + filas * 21 + 5;
  }

  if (edad > 0) {
    taller.espacio(2);
    taller.filaBarra({
      etiqueta: "Vida recorrida",
      coletilla: recorridos >= edad + 1 ? "entera" : undefined,
      valor: `${recorridos} / ${edad + 1}`,
      fraccion: recorridos / (edad + 1),
    });
  }

  taller.parrafo(
    "Todo lo que sigue lo escribiste tú, con tus palabras y en el orden en que pasó. " +
      "Nadie ha interpretado nada: esto es tu memoria, puesta en limpio.",
    { cursiva: true, color: t.apagado, tam: 10.4 },
  );

  /* ── El encabezado de cada año, con su año natural al lado ── */
  const encabezadoAno = (titulo: string, natural?: string) => {
    taller.reservar(20);
    const y = taller.y;
    doc.setFillColor(...t.acento);
    doc.circle(MARGEN + 1.9, y - 1.6, 1.6, "F");
    doc.setFont(GARAMOND, "bold");
    doc.setFontSize(14);
    doc.setTextColor(...t.tinta);
    doc.text(titulo, MARGEN + 7.5, y);
    if (natural) {
      const w = doc.getTextWidth(titulo);
      doc.setFont(GARAMOND, "normal");
      doc.setFontSize(10);
      doc.setTextColor(...t.apagado);
      doc.text(natural, MARGEN + 7.5 + w + 4.5, y);
    }
    taller.y = y + 3.2;
    conAlfa(doc, 0.6, () => {
      doc.setDrawColor(...t.trama);
      doc.setLineWidth(0.15);
      doc.line(MARGEN, taller.y, A4_W - MARGEN, taller.y);
    });
    taller.y += 7;
  };

  /* ── El cuerpo de un año: sus preguntas y lo que dejó huella ── */
  const cuerpoAno = (edadAno: number) => {
    respuestasDe(edadAno).forEach(({ pregunta, items }) => {
      taller.preguntaRespuesta(pregunta, items.join("\n"));
    });
    const huellas = huellasDe(edadAno);
    if (huellas.length > 0) {
      taller.antetitulo("Lo que dejó huella");
      taller.lista(huellas, { tam: 10.8, color: t.tintaSuave });
    }
    taller.espacio(3);
  };

  /* ── ANTES DE NACER (la gestación) ── */
  if (hayGestacion) {
    taller.capitulo(
      "Antes de nacer",
      "Lo que sabes, te contaron o imaginas del tiempo en que te esperaban.",
    );
    cuerpoAno(ANO_GESTACION);
  }

  /* ── UNA ETAPA VITAL POR CAPÍTULO ── */
  ETAPAS_VITALES.forEach((etapa) => {
    const deLaEtapa = anios.filter((a) => a >= etapa.min && a <= etapa.max);
    const conTexto = deLaEtapa.filter((a) => estadoDelAno(data, a) === "completado");
    const enBlanco = deLaEtapa.filter((a) => estadoDelAno(data, a) === "sin-recuerdos");
    if (conTexto.length === 0 && enBlanco.length === 0) return;

    const desde = deLaEtapa[0];
    const hasta = deLaEtapa[deLaEtapa.length - 1];
    taller.capitulo(
      etapa.nombre,
      desde === hasta ? `${desde} años` : `De los ${desde} a los ${hasta} años`,
    );

    conTexto.forEach((a) => {
      encabezadoAno(
        a === 1 ? "1 año" : `${a} años`,
        String(anoNatural(edad, a, anioActual)),
      );
      cuerpoAno(a);
    });

    if (enBlanco.length > 0) {
      taller.parrafo(
        (enBlanco.length === 1
          ? `De los ${enBlanco[0]} años no guardas recuerdos.`
          : `De estos años no guardas recuerdos: ${enBlanco.join(", ")}.`) +
          " Dejarlos en blanco también es contar tu historia.",
        { cursiva: true, color: t.apagado, tam: 10.2 },
      );
    }
  });

  /* ── Si aún no hay nada escrito, el cuaderno lo dice sin dramatismo ── */
  if (!hayGestacion && escritos.length === 0) {
    taller.capitulo("Tu línea, todavía en blanco");
    taller.parrafo(
      "Aún no hay ningún año escrito. En cuanto empieces a recorrer tu línea de Vida, " +
        "cada año que cuentes aparecerá aquí, con sus preguntas y tus palabras.",
      { cursiva: true },
    );
  }

  taller.cierre(
    "Esta es tu Vida contada por ti, que es la única versión que importa. " +
      "Vuelve cuando quieras: siempre queda un año por escribir.",
  );

  taller.guardar("mi-linea-de-vida.pdf");
}
