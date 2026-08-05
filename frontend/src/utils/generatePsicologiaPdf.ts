// ─────────────────────────────────────────────────────────────────────────
// «Mi mapa» — el recorrido entero de Psicología en un cuaderno.
//
// Es el documento más íntimo de toda la web: aquí no hay contenido nuestro,
// solo lo que la persona escribió sobre su propia historia. Por eso el diseño
// se aparta: papel crema, tinta marrón, mucho blanco y ni un adorno que
// compita con sus palabras. Lo único que decora es la acuarela de la disciplina
// y la espiral —el camino hacia dentro— como emblema.
//
// Dos cosas que no existían y cambian el documento:
//  · La ESPIRAL DE LA PORTADA lleva un punto por cada paso que dejó escrito:
//    la portada cuenta cuánto recorrió antes de abrir la primera página.
//  · «Tu mapa de un vistazo» resume en una página lo que hay dentro (cuántas
//    huellas, cuántos nudos, cuántas heridas, cuántos dones) y coloca el ACE en
//    un medidor. Sirve para volver meses después sin releerlo entero.
// ─────────────────────────────────────────────────────────────────────────
import type jsPDF from "jspdf";
import { Taller, MARGEN, ANCHO } from "./pdf/atelier";
import { TEMA_PSICOLOGIA } from "./pdf/temas";
import { polar, conAlfa, medidorArco } from "./pdf/formas";
import {
  aceScore,
  aceBanda,
  aceCompleto,
  necesidadesNoCubiertas,
  MIEDOS_PREGUNTAS,
  type LineaDeVidaData,
} from "../components/metodo/psicologiaRecorrido";
import { arquetipoLabel } from "../components/metodo/integracionSimbolos";
import { GARAMOND } from "./fonts/ebGaramond";

const limpio = (s: string) => (s || "").replace(/\*\*/g, "").replace(/\*/g, "").trim();

/** Todas las huellas marcadas a lo largo de la línea de Vida (sin duplicar). */
function todasLasHuellas(d: LineaDeVidaData): string[] {
  const set = new Set<string>();
  for (const ano of Object.values(d.anos || {})) {
    // Blindaje: `huellas` heredado podría no ser array (un string suelto) y un
    // for..of lo rompería en caracteres. Solo iteramos arrays reales.
    const huellas = Array.isArray(ano?.huellas) ? ano!.huellas : [];
    for (const t of huellas) {
      const s = (typeof t === "string" ? t : "").trim();
      if (s) set.add(s);
    }
  }
  return Array.from(set);
}

/** Espiral con un punto por paso recorrido: el camino hacia dentro. */
function espiralDeRecorrido(
  doc: jsPDF,
  cx: number,
  cy: number,
  r: number,
  pasos: number,
  color: [number, number, number],
  colorPunto: [number, number, number],
): void {
  const VUELTAS = 2.7;
  const punto = (t: number) => polar(cx, cy, r * (0.1 + 0.9 * t), t * 360 * VUELTAS);

  const linea: [number, number][] = [];
  for (let i = 0; i <= 260; i++) linea.push(punto(i / 260));
  conAlfa(doc, 0.75, () => {
    doc.setDrawColor(...color);
    doc.setLineWidth(0.5);
    for (let i = 1; i < linea.length; i++) {
      doc.line(linea[i - 1][0], linea[i - 1][1], linea[i][0], linea[i][1]);
    }
  });

  const n = Math.max(1, pasos);
  for (let i = 0; i < n; i++) {
    const p = punto(n === 1 ? 1 : i / (n - 1));
    const tamano = 1 + (1.6 * i) / Math.max(1, n - 1);
    conAlfa(doc, 0.3, () => {
      doc.setFillColor(...colorPunto);
      doc.circle(p[0], p[1], tamano + 1.7, "F");
    });
    doc.setFillColor(...colorPunto);
    doc.circle(p[0], p[1], tamano, "F");
  }
  doc.setFillColor(...colorPunto);
  doc.circle(cx, cy, 1.1, "F");
}

export async function generatePsicologiaPdf(data: LineaDeVidaData): Promise<void> {
  const t = TEMA_PSICOLOGIA;
  const taller = await Taller.abrir(t, { titulo: "Mi mapa" });
  const doc = taller.doc;

  /* ── Se recoge todo primero: hace falta para el resumen y para la portada ── */
  const problemas = (typeof data["problema-actual"] === "string" ? (data["problema-actual"] as string) : "")
    .split(/\n+/).map((s) => s.trim()).filter(Boolean);
  const huellas = todasLasHuellas(data);
  const nudos = (Array.isArray(data.nudos) ? data.nudos : [])
    .map((n) => (typeof n === "string" ? n : "").trim()).filter(Boolean);
  const necesidades = necesidadesNoCubiertas(data);
  const heridas = (Array.isArray(data.heridas) ? data.heridas : [])
    .filter((h) => (h.titulo || "").trim() || (h.texto || "").trim());

  const INTEGRACION_PREGUNTAS: { key: "proteger" | "coste" | "verdadSana" | "recordatorio"; label: string }[] = [
    { key: "proteger", label: "Qué intentaba proteger" },
    { key: "coste", label: "Qué me cuesta mantenerlo" },
    { key: "verdadSana", label: "La verdad más sana que quiero practicar" },
    { key: "recordatorio", label: "Lo que quiero recordar" },
  ];
  const relaciones = (Array.isArray(data.constelaciones) ? data.constelaciones : []).filter(
    (c) => (c.titulo || "").trim() || (c.texto || "").trim() ||
      INTEGRACION_PREGUNTAS.some((p) => ((c[p.key] as string) || "").trim()),
  );
  const miedos = (Array.isArray(data.miedos) ? data.miedos : []).filter((m) => (m.texto || "").trim());
  const dones = (Array.isArray(data.dones?.lista) ? data.dones!.lista! : [])
    .map((x) => (typeof x === "string" ? x : (x?.texto || "")).trim())
    .filter(Boolean);
  const b = data.brujula || {};
  const comp = data.compromiso || {};
  const aceHecho = aceCompleto(data);
  const ace = aceHecho ? aceScore(data) : 0;

  const bloquesConContenido = [
    problemas.length, aceHecho ? 1 : 0, huellas.length, nudos.length, necesidades.length,
    heridas.length, relaciones.length, miedos.length, dones.length,
    (b.mensaje || b.herida || b.necesidad || b.miedo || b.don) ? 1 : 0,
    (comp.necesitaste || comp.dartelo) ? 1 : 0,
  ].filter((n) => n > 0).length;

  /* ── PORTADA ── */
  taller.portada({
    titulo: "Mi mapa",
    subtitulo: "Psicología · Tu historia, contada por ti",
    pieLamina:
      bloquesConContenido > 1
        ? `Cada punto es uno de los ${bloquesConContenido} pasos que dejaste escritos.`
        : undefined,
    cierre: "Mi recorrido",
    lamina: (d, cx, yTop, ancho) => {
      const r = Math.min(ancho / 2 - 18, 46);
      espiralDeRecorrido(d, cx, yTop + r + 14, r, bloquesConContenido, [246, 226, 206], [255, 246, 236]);
    },
  });

  /* ── TU MAPA DE UN VISTAZO ── */
  taller.nuevaPagina();
  taller.capitulo(
    "De un vistazo",
    "Lo que hay dentro de este cuaderno. Sirve para volver dentro de unos meses sin " +
      "tener que releerlo entero.",
  );

  const inventario: [string, number][] = [
    ["Huellas", huellas.length],
    ["Nudos", nudos.length],
    ["Necesidades", necesidades.length],
    ["Heridas", heridas.length],
    ["Relaciones", relaciones.length],
    ["Miedos", miedos.length],
    ["Dones", dones.length],
  ].filter(([, n]) => (n as number) > 0) as [string, number][];

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

  if (aceHecho) {
    const banda = aceBanda(ace);
    taller.espacio(2);
    taller.reservar(46);
    const arriba = taller.y;
    // Medidor a la izquierda, lectura a la derecha.
    medidorArco(doc, MARGEN + 22, arriba + 19, 16, ace / 10, t.acento, t.trama);
    doc.setFont(GARAMOND, "bold");
    doc.setFontSize(20);
    doc.setTextColor(...t.tinta);
    doc.text(`${ace}`, MARGEN + 22, arriba + 33.5, { align: "center" });
    doc.setFont(GARAMOND, "normal");
    doc.setFontSize(9);
    doc.setTextColor(...t.apagado);
    doc.text("de 10", MARGEN + 22, arriba + 38.5, { align: "center" });

    const x = MARGEN + 48;
    const w = ANCHO - 48;
    taller.versalitas("Puntuación ACE", x, arriba + 6, 8, t.apagado);
    doc.setFont(GARAMOND, "bold");
    doc.setFontSize(14);
    doc.setTextColor(...t.acento);
    doc.text(banda.titulo, x, arriba + 14);
    // Aquí solo el titular: el texto completo de la banda va en su capítulo,
    // y repetirlo dos veces en el mismo cuaderno lo abarata.
    doc.setFont(GARAMOND, "italic");
    doc.setFontSize(10.2);
    doc.setTextColor(...t.tintaSuave);
    const lineas = doc.splitTextToSize(
      `De las diez preguntas del cuestionario ACE respondiste que sí a ${ace}. ` +
        "En «Lo que cargué» tienes qué significa eso y qué no.",
      w,
    ) as string[];
    lineas.forEach((l, i) => doc.text(l, x, arriba + 21 + i * 5));
    taller.y = Math.max(arriba + 46, arriba + 21 + lineas.length * 5 + 4);
  }

  taller.espacio(2);
  taller.parrafo(
    "Nada de lo que sigue es un diagnóstico. Son tus palabras, ordenadas. El valor de este " +
      "cuaderno no está en lo que dice, sino en que lo escribiste tú y puedes volver a él.",
    { cursiva: true, color: t.apagado, tam: 10.4 },
  );

  /* ── 1 · DE DÓNDE VENGO ── */
  if (problemas.length > 0) {
    taller.capitulo("De dónde vengo");
    problemas.forEach((p, i) => taller.parrafo(p, { cursiva: true, capitular: i === 0, tam: 11.5 }));
  }

  /* ── 2 · LO QUE CARGUÉ ── */
  if (aceHecho) {
    const banda = aceBanda(ace);
    taller.capitulo("Lo que cargué");
    taller.filaBarra({
      etiqueta: "Puntuación ACE",
      coletilla: banda.titulo,
      valor: `${ace} / 10`,
      fraccion: ace / 10,
    });
    taller.parrafo(banda.texto, { color: t.tintaSuave });
  }

  /* ── 3 · LO QUE DEJÓ HUELLA ── */
  if (huellas.length > 0) {
    taller.capitulo("Lo que dejó huella");
    taller.listaDoble(huellas);
  }

  /* ── 4 · LOS NUDOS ── */
  if (nudos.length > 0) {
    taller.capitulo("Los nudos");
    taller.listaDoble(nudos);
  }

  /* ── 5 · LO QUE ME FALTÓ ── */
  if (necesidades.length > 0) {
    taller.capitulo("Lo que me faltó");
    taller.listaDoble(necesidades);
  }

  /* ── 6 · MIS HERIDAS ── */
  if (heridas.length > 0) {
    taller.capitulo("Mis heridas");
    heridas.forEach((h) => {
      const piezas = [...(h.huellas || []), ...(h.nudos || []), ...(h.necesidades || [])].join("   ·   ");
      taller.tarjeta({
        titulo: limpio(h.titulo) || "Herida",
        cuerpo: limpio(h.texto),
        extra: piezas || undefined,
      });
    });
  }

  /* ── 7 · CÓMO ME RELACIONO ── */
  if (relaciones.length > 0) {
    taller.capitulo("Cómo me relaciono");
    relaciones.forEach((c) => {
      const piezas = [
        ...(c.nudos || []),
        ...(c.arquetipos || []).map((a) => arquetipoLabel(a)),
      ].join("   ·   ");
      taller.tarjeta({
        titulo: limpio(c.titulo) || "Relación",
        cuerpo: limpio(c.texto),
        extra: piezas || undefined,
      });
      INTEGRACION_PREGUNTAS.forEach((p) => {
        const r = limpio((c[p.key] as string) || "");
        if (r) taller.preguntaRespuesta(p.label, r);
      });
      taller.espacio(2);
    });
  }

  /* ── 8 · MIS MIEDOS ── */
  if (miedos.length > 0) {
    taller.capitulo("Mis miedos");
    miedos.forEach((m) => {
      taller.reservar(14);
      doc.setFont(GARAMOND, "bold");
      doc.setFontSize(13.5);
      doc.setTextColor(...t.tinta);
      const lineas = doc.splitTextToSize(limpio(m.texto), ANCHO - 8) as string[];
      taller.reservar(lineas.length * 6.4 + 5);
      doc.setFillColor(...t.acento);
      doc.circle(MARGEN + 1.8, taller.y - 1.6, 1.5, "F");
      doc.setFont(GARAMOND, "bold");
      doc.setFontSize(13.5);
      doc.setTextColor(...t.tinta);
      lineas.forEach((l, i) => doc.text(l, MARGEN + 7, taller.y + i * 6.4));
      taller.y += lineas.length * 6.4 + 3;
      MIEDOS_PREGUNTAS.forEach((p) => {
        const r = limpio(m.respuestas?.[p.key] || "");
        if (r) taller.preguntaRespuesta(p.pregunta, r);
      });
      taller.espacio(2);
    });
  }

  /* ── 9 · MIS DONES ── */
  if (dones.length > 0) {
    taller.capitulo("Mis dones", "Lo que sabes que tienes, escrito por ti y no por nadie más.");
    taller.lista(dones, { tam: 11.5 });
  }

  /* ── 10 · MI CARTA ── */
  if (limpio(b.mensaje as string)) {
    // Formato nuevo: un mensaje libre a su yo del futuro. Va en papel de carta.
    taller.capitulo("Mi carta", "Para cuando vuelva a sentirme bloqueado.");
    taller.reservar(40);
    const arriba = taller.y - 3;
    doc.setFont(GARAMOND, "italic");
    doc.setFontSize(12.5);
    const lineas = doc.splitTextToSize(limpio(b.mensaje as string), ANCHO - 28) as string[];
    const alto = lineas.length * 6.8 + 22;
    conAlfa(doc, 0.05, () => {
      doc.setFillColor(...t.acento);
      doc.roundedRect(MARGEN, arriba, ANCHO, alto, 3, 3, "F");
    });
    doc.setDrawColor(...t.acento);
    doc.setLineWidth(0.3);
    doc.roundedRect(MARGEN, arriba, ANCHO, alto, 3, 3, "S");
    conAlfa(doc, 0.28, () => {
      doc.setFont(GARAMOND, "bold");
      doc.setFontSize(40);
      doc.setTextColor(...t.acento);
      doc.text("“", MARGEN + 7, arriba + 22);
    });
    doc.setFont(GARAMOND, "italic");
    doc.setFontSize(12.5);
    doc.setTextColor(...t.tinta);
    lineas.forEach((l, i) => doc.text(l, MARGEN + 14, arriba + 15 + i * 6.8));
    taller.y = arriba + alto + 8;
  } else {
    // Formato antiguo (recorridos guardados con las cuatro preguntas guía).
    const brujula: [string, string | undefined][] = [
      ["¿Qué herida se ha activado?", b.herida],
      ["¿Qué necesidad hay debajo?", b.necesidad],
      ["¿Qué miedo está hablando?", b.miedo],
      ["¿Qué don puedes utilizar ahora?", b.don],
    ];
    if (brujula.some(([, v]) => limpio(v || ""))) {
      taller.capitulo("Mi carta", "Para cuando vuelva a sentirme bloqueado.");
      brujula.forEach(([q, v]) => { if (limpio(v || "")) taller.preguntaRespuesta(q, v as string); });
    }
  }

  /* ── 11 · MI COMPROMISO ── */
  if (limpio(comp.necesitaste as string) || limpio(comp.dartelo as string)) {
    taller.capitulo("Mi compromiso conmigo mismo");
    if (limpio(comp.necesitaste as string)) {
      taller.preguntaRespuesta("¿Qué necesitaste que nadie pudo darte?", comp.necesitaste as string);
    }
    if (limpio(comp.dartelo as string)) {
      taller.preguntaRespuesta("¿Cómo puedes empezar a dártelo hoy?", comp.dartelo as string);
    }
  }

  taller.cierre(
    "No mirabas tu historia para quedarte en ella, sino para transformarla. " +
      "Este mapa es la prueba de que ya empezaste.",
  );

  taller.guardar("mi-mapa-psicologia.pdf");
}
