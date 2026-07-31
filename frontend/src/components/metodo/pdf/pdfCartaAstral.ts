// ─────────────────────────────────────────────────────────────────────────
// «Toda mi carta» en un PDF que el usuario se lleva para siempre.
//
// Cómo está montado y por qué:
//
//  · PORTADA → un canvas (mapa de bits) con la foto del cielo de fondo y la
//    rueda de la carta dibujada encima. La foto es CUADRADA y el A4 no, así que
//    se pinta DOS VECES —la de abajo espejada— en vez de estirarla: se aprovecha
//    entera y no se deforma nada.
//  · TODO LO DEMÁS → texto de PDF de verdad (no imágenes). Así se puede buscar,
//    copiar y se imprime nítido, y 60 páginas pesan poco.
//
//  · Una lectura por página, en el orden del cómic de los planetas: Ascendente,
//    Sol, Luna, Mercurio… y de cada uno primero su signo y luego su casa. Si un
//    texto no cabe en una página, sigue en la siguiente marcada «(continúa)»:
//    nunca se corta ni se mezcla con la lectura siguiente.
//
//  · MEDIR Y PINTAR SON EL MISMO CÓDIGO (`cabecera`, `repartirBloque`) llamado
//    con `dibujar` a false o a true. Es lo que hace que los números del índice
//    sean exactos: con dos cálculos separados, en cuanto uno se desviara un
//    milímetro el índice empezaría a mentir.
//
//  · Los tipos de letra son los internos del PDF (Times), que solo entienden
//    Latin-1: por eso `latin1()` traduce lo que se salga de ahí (comillas
//    tipográficas, flechas, símbolos). Sin eso saldrían caracteres raros.
// ─────────────────────────────────────────────────────────────────────────
import jsPDF from "jspdf";
import { CUERPOS, ZODIAC_SIGNS } from "../astrologiaData";
import { textoEstatico } from "../../../data/astrologiaTextosApi";
import { cargarOverridesRemotos } from "../../../data/astrologiaOverridesRemotos";
import { ASPECTO_LABEL, NUMEROS_ROMANOS, aspectoKey, infoCasa } from "../casasAspectos";
import type { Aspecto, CartaNatal } from "../CartaAstral3D/types";
import { dibujarRuedaCarta } from "./ruedaCarta";

export interface RetoPdf {
  id: string;
  titulo: string;
  texto: string;
}

export interface DatosPdfCarta {
  nombre: string;
  carta: CartaNatal;
  retos: RetoPdf[];
  casasTexto: Record<string, string>;
  aspectosTexto: Record<string, string>;
  nacimiento?: { fecha?: string | null; hora?: string | null; lugar?: string | null };
  /** Foto del cielo para la portada. */
  imgFondo?: string;
}

// ── Medidas de la página (A4 en mm) ───────────────────────────────────────
const A4_W = 210;
const A4_H = 297;
const MARGEN_X = 22;
const MARGEN_SUP = 24;
const MARGEN_INF = 20;
const ANCHO_TEXTO = A4_W - MARGEN_X * 2;
const Y_TOPE = A4_H - MARGEN_INF - 6;

// ── Paleta: la de Astrología (cielo de noche + oro) ───────────────────────
const FONDO: [number, number, number] = [7, 11, 26];
const CREMA: [number, number, number] = [239, 235, 224];
const ORO: [number, number, number] = [255, 217, 125];
const APAGADO: [number, number, number] = [150, 168, 190];

const INTERLINEA = 5.5;
const TAM_CUERPO = 10.5;
const INTERLINEA_RESUMEN = 5.8;

type Seccion = "Arquetipos" | "Puntos clave" | "Casas" | "Aspectos";

interface Bloque {
  seccion: Seccion;
  /** Antetítulo pequeño (p. ej. «VENUS»). */
  etiqueta: string;
  titulo: string;
  /** Frase-resumen que el popup del recorrido muestra arriba, si la hay. */
  resumen?: string;
  texto: string;
  /** Página en la que empieza. Se rellena al paginar. */
  pagina?: number;
}

/** Una línea ya colocada: el cuerpo, el resumen en cursiva o un hueco. */
type Linea = { tipo: "cuerpo" | "resumen"; texto: string } | { tipo: "hueco"; alto: number };

/**
 * Traduce a Latin-1 lo que los tipos internos del PDF no saben pintar. Lo que no
 * tiene equivalente se quita: mejor una frase limpia que un símbolo roto.
 */
function latin1(s: string): string {
  const mapa: Record<string, string> = {
    "‘": "'", "’": "'", "“": '"', "”": '"',
    "–": "-", "—": "-", "…": "...", " ": " ",
    "•": "·", "→": "->", "←": "<-", "↑": "^", "↓": "v",
    "✓": "-", "✗": "x",
  };
  return s
    .replace(/[‘’“”–—… •→←↑↓✓✗]/g,
      (c) => mapa[c] ?? "")
    // Fuera del Latin-1 imprimible no hay glifo posible: se descarta.
    .replace(/[^\t\n\r\x20-\x7E¡-ÿ]/g, "");
}

/** Parte «resumen --- texto» en sus dos mitades (el popup usa ese separador). */
function partirResumen(t: string): { resumen?: string; cuerpo: string } {
  const trozos = t.split(/^[ \t]*---[ \t]*$/m);
  if (trozos.length >= 2) {
    return { resumen: trozos[0].trim() || undefined, cuerpo: trozos.slice(1).join("\n").trim() };
  }
  return { cuerpo: t.trim() };
}

// ── Qué entra en el documento y en qué orden ───────────────────────────────

function construirBloques(d: DatosPdfCarta): Bloque[] {
  const bloques: Bloque[] = [];

  // Arquetipos: el orden de CUERPOS es el del cómic (Ascendente, Sol, Luna…) y
  // de cada cuerpo va primero su signo y después su casa.
  for (const cuerpo of CUERPOS) {
    const pos = d.carta.planetas?.find((p) => p.planeta === cuerpo.key);
    if (!pos) continue;

    const signo = ZODIAC_SIGNS[pos.signoIdx]?.name;
    if (signo) {
      const t = textoEstatico(cuerpo.key, "signo", signo);
      if (t?.trim()) {
        const { resumen, cuerpo: body } = partirResumen(t);
        bloques.push({
          seccion: "Arquetipos",
          etiqueta: cuerpo.label.toUpperCase(),
          titulo: `${cuerpo.label} en ${signo}`,
          resumen,
          texto: body,
        });
      }
    }

    if (cuerpo.conCasa && pos.casa) {
      const t = textoEstatico(cuerpo.key, "casa", String(pos.casa));
      if (t?.trim()) {
        const { resumen, cuerpo: body } = partirResumen(t);
        bloques.push({
          seccion: "Arquetipos",
          etiqueta: cuerpo.label.toUpperCase(),
          titulo: `${cuerpo.label} en la Casa ${pos.casa}`,
          resumen,
          texto: body,
        });
      }
    }
  }

  // Puntos clave: los escribe la administradora para esta carta concreta.
  for (const reto of d.retos ?? []) {
    if (!reto?.texto?.trim()) continue;
    bloques.push({
      seccion: "Puntos clave",
      etiqueta: "PUNTO CLAVE",
      titulo: reto.titulo?.trim() || "Punto clave",
      texto: reto.texto.trim(),
    });
  }

  // Casas.
  for (let n = 1; n <= 12; n++) {
    const texto = (d.casasTexto?.[String(n)] ?? "").trim();
    if (!texto) continue;
    const signo = infoCasa(d.carta.cusps ?? [], n)?.signo?.name;
    bloques.push({
      seccion: "Casas",
      etiqueta: `CASA ${NUMEROS_ROMANOS[n - 1]}`,
      titulo: signo ? `Casa ${n} en ${signo}` : `Casa ${n}`,
      texto,
    });
  }

  // Aspectos.
  const nombreCuerpo = (k: string) => CUERPOS.find((c) => c.key === k)?.label ?? k;
  for (const asp of d.carta.aspectos ?? []) {
    const texto = (d.aspectosTexto?.[aspectoKey(asp as Aspecto)] ?? "").trim();
    if (!texto) continue;
    const etiqueta = ASPECTO_LABEL[asp.tipo] ?? "Aspecto";
    bloques.push({
      seccion: "Aspectos",
      etiqueta: etiqueta.toUpperCase(),
      titulo: `${nombreCuerpo(asp.a)} ${etiqueta.toLowerCase()} ${nombreCuerpo(asp.b)}`,
      texto,
    });
  }

  return bloques;
}

// ── Piezas comunes de página ──────────────────────────────────────────────

const fondoPagina = (doc: jsPDF) => {
  doc.setFillColor(...FONDO);
  doc.rect(0, 0, A4_W, A4_H, "F");
};

function filete(doc: jsPDF, y: number, ancho: number) {
  doc.setDrawColor(...ORO);
  doc.setLineWidth(0.25);
  const x = (A4_W - ancho) / 2;
  doc.line(x, y, x + ancho, y);
}

function pie(doc: jsPDF, pagina: number, seccion: string) {
  doc.setFont("times", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...APAGADO);
  doc.text(latin1(seccion), MARGEN_X, A4_H - 10);
  doc.text(String(pagina), A4_W - MARGEN_X, A4_H - 10, { align: "right" });
}

/**
 * Cabecera de una página de lectura. Con `dibujar` en false solo devuelve la
 * altura: medir y pintar comparten este código a propósito.
 */
function cabecera(doc: jsPDF, b: Bloque, continua: boolean, dibujar: boolean): number {
  let y = MARGEN_SUP;

  if (dibujar) {
    doc.setFont("times", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...APAGADO);
    doc.text(latin1(`${b.seccion.toUpperCase()}   ·   ${b.etiqueta}`), MARGEN_X, y);
  }
  y += 8;

  doc.setFont("times", "bold");
  doc.setFontSize(continua ? 15 : 19);
  const titulo = latin1(continua ? `${b.titulo} (continúa)` : b.titulo);
  const lineas = doc.splitTextToSize(titulo, ANCHO_TEXTO);
  if (dibujar) {
    doc.setTextColor(...ORO);
    doc.text(lineas, MARGEN_X, y);
  }
  y += lineas.length * (continua ? 6.5 : 8);

  if (dibujar) filete(doc, y, ANCHO_TEXTO * 0.28);
  return y + 8;
}

/**
 * Reparte el bloque en páginas. Devuelve, por página, la `y` de arranque y las
 * líneas que caben. El pintado recorre esto tal cual, así que lo que se mide es
 * exactamente lo que se imprime.
 */
function repartirBloque(doc: jsPDF, b: Bloque): { continua: boolean; lineas: Linea[] }[] {
  const cola: Linea[] = [];

  if (b.resumen) {
    doc.setFont("times", "italic");
    doc.setFontSize(11.5);
    for (const t of doc.splitTextToSize(latin1(b.resumen), ANCHO_TEXTO)) {
      cola.push({ tipo: "resumen", texto: t });
    }
    cola.push({ tipo: "hueco", alto: 9 });
  }

  doc.setFont("times", "normal");
  doc.setFontSize(TAM_CUERPO);
  const parrafos = b.texto
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, " ").trim())
    .filter(Boolean);
  parrafos.forEach((p, i) => {
    for (const t of doc.splitTextToSize(latin1(p), ANCHO_TEXTO)) {
      cola.push({ tipo: "cuerpo", texto: t });
    }
    if (i < parrafos.length - 1) cola.push({ tipo: "hueco", alto: INTERLINEA * 0.55 });
  });

  const paginas: { continua: boolean; lineas: Linea[] }[] = [];
  let actual: Linea[] = [];
  let continua = false;
  let y = cabecera(doc, b, false, false);

  for (const linea of cola) {
    const alto = linea.tipo === "hueco" ? linea.alto : linea.tipo === "resumen" ? INTERLINEA_RESUMEN : INTERLINEA;
    if (y + alto > Y_TOPE && actual.length) {
      paginas.push({ continua, lineas: actual });
      actual = [];
      continua = true;
      y = cabecera(doc, b, true, false);
    }
    actual.push(linea);
    y += alto;
  }
  paginas.push({ continua, lineas: actual });
  return paginas;
}

/** Pinta el bloque ya repartido. La primera página debe estar creada y con fondo. */
function pintarBloque(
  doc: jsPDF,
  b: Bloque,
  paginas: { continua: boolean; lineas: Linea[] }[],
  primeraPagina: number,
) {
  paginas.forEach((pag, i) => {
    if (i > 0) {
      doc.addPage();
      fondoPagina(doc);
    }
    let y = cabecera(doc, b, pag.continua, true);

    for (const linea of pag.lineas) {
      if (linea.tipo === "hueco") {
        // El hueco tras el resumen lleva su filete corto de separación.
        if (linea.alto === 9) filete(doc, y - 3, ANCHO_TEXTO * 0.16);
        y += linea.alto;
        continue;
      }
      if (linea.tipo === "resumen") {
        doc.setFont("times", "italic");
        doc.setFontSize(11.5);
        doc.setTextColor(...CREMA);
        doc.text(linea.texto, MARGEN_X, y);
        y += INTERLINEA_RESUMEN;
        continue;
      }
      doc.setFont("times", "normal");
      doc.setFontSize(TAM_CUERPO);
      doc.setTextColor(...CREMA);
      doc.text(linea.texto, MARGEN_X, y);
      y += INTERLINEA;
    }

    pie(doc, primeraPagina + i, b.seccion);
  });
}

/**
 * Índice: una línea por lectura con su número de página. Igual que los bloques,
 * con `dibujar` en false solo cuenta las páginas que va a necesitar (hace falta
 * saberlo ANTES, porque el índice va delante de todo el contenido).
 */
function indice(
  doc: jsPDF,
  bloques: Bloque[],
  paginaInicial: number,
  totalPaginas: number,
  dibujar: boolean,
): number {
  let paginas = 1;
  let y = MARGEN_SUP;
  let seccionActual: Seccion | null = null;

  const cabeceraIndice = () => {
    if (dibujar) {
      doc.setFont("times", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...APAGADO);
      doc.text(latin1(`TU CARTA COMPLETA   ·   ${totalPaginas} páginas`), MARGEN_X, y);
    }
    y += 9;
    doc.setFont("times", "bold");
    doc.setFontSize(22);
    if (dibujar) {
      doc.setTextColor(...ORO);
      doc.text(latin1("Índice"), MARGEN_X, y);
    }
    y += 5;
    if (dibujar) filete(doc, y, ANCHO_TEXTO * 0.28);
    y += 9;
  };

  cabeceraIndice();

  for (const b of bloques) {
    if (y > A4_H - MARGEN_INF - 12) {
      if (dibujar) {
        pie(doc, paginaInicial + paginas - 1, "Índice");
        doc.addPage();
        fondoPagina(doc);
      }
      paginas++;
      y = MARGEN_SUP;
      seccionActual = null;
      cabeceraIndice();
    }

    if (b.seccion !== seccionActual) {
      seccionActual = b.seccion;
      y += 3;
      if (dibujar) {
        doc.setFont("times", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...CREMA);
        doc.text(latin1(b.seccion.toUpperCase()), MARGEN_X, y);
      }
      y += 5.6;
    }

    if (dibujar) {
      doc.setFont("times", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...CREMA);
      const titulo = latin1(b.titulo);
      const num = String(b.pagina ?? "");
      doc.text(titulo, MARGEN_X + 4, y);

      // Puntitos de guía hasta el número, como en el índice de un libro.
      const xIni = MARGEN_X + 4 + doc.getTextWidth(titulo) + 2;
      const xFin = A4_W - MARGEN_X - doc.getTextWidth(num) - 2;
      const anchoPunto = doc.getTextWidth(". ");
      const cuantos = Math.floor((xFin - xIni) / anchoPunto);
      if (cuantos > 0) {
        doc.setTextColor(...APAGADO);
        doc.text(Array(cuantos).fill(".").join(" "), xIni, y);
        doc.setTextColor(...CREMA);
      }
      doc.text(num, A4_W - MARGEN_X, y, { align: "right" });
    }
    y += 5.4;
  }

  if (dibujar) pie(doc, paginaInicial + paginas - 1, "Índice");
  return paginas;
}

// ── Portada ───────────────────────────────────────────────────────────────

function cargarImagen(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
    img.src = src;
  });
}

/**
 * Pinta la foto cubriendo TODO el A4 sin deformarla: a todo lo ancho con su
 * proporción intacta, repetida a lo alto y con las copias pares espejadas para
 * que la unión no se note.
 */
function fondoDoblado(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) {
  const alto = (img.naturalHeight / img.naturalWidth) * w;
  let y = 0;
  let vuelta = 0;
  while (y < h && vuelta < 8) {
    ctx.save();
    if (vuelta % 2 === 1) {
      ctx.translate(0, y + alto);
      ctx.scale(1, -1);
      ctx.drawImage(img, 0, 0, w, alto);
    } else {
      ctx.drawImage(img, 0, y, w, alto);
    }
    ctx.restore();
    y += alto;
    vuelta++;
  }
}

async function pintarPortada(d: DatosPdfCarta): Promise<HTMLCanvasElement> {
  // A4 a 150 ppp: nítido al imprimir sin que el archivo se vaya de las manos.
  const W = 1240;
  const H = 1754;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#070b1a";
  ctx.fillRect(0, 0, W, H);

  if (d.imgFondo) {
    try {
      fondoDoblado(ctx, await cargarImagen(d.imgFondo), W, H);
    } catch {
      /* sin foto: se queda el cielo liso */
    }
  }

  const velo = ctx.createLinearGradient(0, 0, 0, H);
  velo.addColorStop(0, "rgba(4,7,20,0.66)");
  velo.addColorStop(0.42, "rgba(4,7,20,0.30)");
  velo.addColorStop(1, "rgba(4,7,20,0.74)");
  ctx.fillStyle = velo;
  ctx.fillRect(0, 0, W, H);

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.86)";
  ctx.font = `500 ${Math.round(W * 0.019)}px 'EB Garamond', Georgia, serif`;
  ctx.fillText("L I F E   A S   A   P R I V I L E G E", W / 2, H * 0.075);

  ctx.fillStyle = "#ffffff";
  ctx.font = `600 ${Math.round(W * 0.062)}px 'EB Garamond', Georgia, serif`;
  ctx.shadowColor = "rgba(255,255,255,0.5)";
  ctx.shadowBlur = W * 0.02;
  ctx.fillText("Tu carta astral", W / 2, H * 0.14);
  ctx.shadowBlur = 0;

  if (d.nombre) {
    ctx.fillStyle = "#ffd97d";
    ctx.font = `500 ${Math.round(W * 0.032)}px 'EB Garamond', Georgia, serif`;
    ctx.fillText(d.nombre, W / 2, H * 0.182);
  }

  dibujarRuedaCarta(ctx, d.carta, W / 2, H * 0.535, W * 0.86);

  const partes = [d.nacimiento?.fecha, d.nacimiento?.hora, d.nacimiento?.lugar]
    .map((p) => (p ?? "").trim())
    .filter(Boolean);
  if (partes.length) {
    ctx.fillStyle = "rgba(255,255,255,0.84)";
    ctx.font = `400 ${Math.round(W * 0.023)}px 'EB Garamond', Georgia, serif`;
    ctx.fillText(partes.join("   ·   "), W / 2, H * 0.9);
  }

  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = `400 ${Math.round(W * 0.017)}px 'EB Garamond', Georgia, serif`;
  ctx.fillText("E L   M A P A", W / 2, H * 0.945);

  return canvas;
}

// ── Montaje ───────────────────────────────────────────────────────────────

/**
 * Monta el PDF completo y lo devuelve como Blob.
 * `onPaso` va contando el avance (la página muestra el progreso).
 */
export async function generarPdfCarta(
  d: DatosPdfCarta,
  onPaso?: (hecho: number, total: number) => void,
): Promise<Blob> {
  // Los textos editados desde /admin viven en la BD: que el PDF lleve los últimos.
  await cargarOverridesRemotos();

  const bloques = construirBloques(d);
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });

  // 1) Paginación en seco (sin dibujar nada): cuántas páginas ocupa el índice y
  //    en qué página empieza cada lectura.
  const paginasIndice = indice(doc, bloques, 2, 0, false);
  const reparto = bloques.map((b) => repartirBloque(doc, b));
  let cursor = 2 + paginasIndice; // 1 = portada
  bloques.forEach((b, i) => {
    b.pagina = cursor;
    cursor += reparto[i].length;
  });
  const totalPaginas = cursor - 1;

  const totalPasos = bloques.length + 2;
  let hechos = 0;
  const paso = () => onPaso?.(++hechos, totalPasos);

  // 2) Portada. Se pasa ya como JPEG con calidad 0,85: la portada es lo único
  //    que va en mapa de bits y a calidad por defecto se comía casi todo el peso
  //    del archivo (una foto del cielo no necesita más).
  fondoPagina(doc);
  const portada = (await pintarPortada(d)).toDataURL("image/jpeg", 0.85);
  doc.addImage(portada, "JPEG", 0, 0, A4_W, A4_H, "portada", "FAST");
  paso();

  // 3) Índice.
  doc.addPage();
  fondoPagina(doc);
  indice(doc, bloques, 2, totalPaginas, true);
  paso();

  // 4) Contenido: cada lectura empieza en página nueva.
  bloques.forEach((b, i) => {
    doc.addPage();
    fondoPagina(doc);
    pintarBloque(doc, b, reparto[i], b.pagina ?? doc.getNumberOfPages());
    paso();
  });

  return doc.output("blob");
}

/** Cuántas lecturas y páginas tendrá el PDF (para avisar antes de generarlo). */
export function resumenPdf(d: DatosPdfCarta): { lecturas: number; secciones: Record<string, number> } {
  const bloques = construirBloques(d);
  const secciones: Record<string, number> = {};
  for (const b of bloques) secciones[b.seccion] = (secciones[b.seccion] ?? 0) + 1;
  return { lecturas: bloques.length, secciones };
}

/** Nombre de archivo con el nombre de la persona, sin acentos ni espacios. */
export function nombreArchivoPdf(nombre: string): string {
  const limpio = (nombre || "carta")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return `carta-astral-${limpio || "completa"}.pdf`;
}
