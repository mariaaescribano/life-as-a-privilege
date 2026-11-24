// ─────────────────────────────────────────────────────────────────────────
// «Toda mi carta» en un PDF que la persona se lleva para siempre.
//
//  · SOLO lleva lo que María ha escrito para ella: la bienvenida, el texto de cada Casa y la despedida.
//  · TODO en beige (el de la web): el texto, los símbolos de los planetas que haya dentro del texto, los emojis
//    (a color, como son) y la rueda de la portada, sin colores por planeta ni por aspecto.
//  · PORTADA → un canvas con la foto del cielo de fondo y la rueda de la carta dibujada encima (la foto se pinta dos
//    veces, la de abajo espejada, para no deformarla). Las demás páginas llevan la misma foto con un velo oscuro,
//    incrustada UNA sola vez (mismo `alias`).
//  · EL TEXTO es texto de PDF de verdad (se puede buscar y copiar). Una lectura por página; si no cabe, sigue en la
//    siguiente marcada «(continúa)». Una línea «---» del texto es una separación (un respiro, no se imprime).
//  · MEDIR Y PINTAR SON EL MISMO CÓDIGO (`cabecera`, `repartirBloque`) llamado con `dibujar` a false o a true: así los
//    números del índice son exactos.
//  · Los tipos de letra son los internos del PDF (Times), que solo entienden Latin-1: `latin1()` traduce lo que se
//    salga de ahí, y los símbolos (☉ ☽ ♄…) y emojis se pintan como imagen pequeña en la misma línea.
//  · Se respeta el **negrita** del texto; los asteriscos sueltos no se imprimen.
// ─────────────────────────────────────────────────────────────────────────
import jsPDF from "jspdf";
import type { CartaNatal } from "../CartaAstral3D/types";
import { dibujarRuedaCarta } from "./ruedaCarta";
import { rasterGlifo } from "../../../utils/pdf/glifosTexto";
import { traducir } from "../../../i18n";
import { AREAS_TOTAL, tituloArea } from "../astrologiaAreas";

/**
 * Lo ÚNICO que lleva el PDF es lo que María escribe para esa persona en su editor: la bienvenida, el texto de cada
 * Casa y la despedida. Nada se coge de otro sitio (ni arquetipos, ni puntos clave, ni textos de casas o aspectos).
 */
export interface DatosPdfCarta {
  nombre: string;
  /** Solo para dibujar la rueda de la portada. */
  carta: CartaNatal;
  bienvenida?: string;
  /** El texto de cada Casa (1-12). */
  areas: Record<string, string>;
  despedida?: string;
  nacimiento?: { fecha?: string | null; hora?: string | null; lugar?: string | null };
  /** Foto del cielo para la portada y para el fondo de todas las páginas. */
  imgFondo?: string;
}

/** El mandala de la marca, que va arriba en la portada. */
const IMG_MANDALA = "/img/icono/life.webp";

// ── Medidas de la página (A4 en mm) ───────────────────────────────────────
const A4_W = 210;
const A4_H = 297;
const MARGEN_X = 22;
const MARGEN_SUP = 24;
const MARGEN_INF = 20;
const ANCHO_TEXTO = A4_W - MARGEN_X * 2;
const Y_TOPE = A4_H - MARGEN_INF - 6;

// ── Paleta: cielo de noche de fondo y TODO el texto (y los símbolos) en el beige de la web ──
const FONDO: [number, number, number] = [7, 11, 26];
const TINTA: [number, number, number] = [240, 220, 192];

const INTERLINEA = 5.5;
const TAM_CUERPO = 10.5;
const INTERLINEA_RESUMEN = 5.8;
/** De puntos de tipografía a milímetros (72 pt = 1 pulgada = 25,4 mm). */
const PT = 25.4 / 72;

type Seccion = "Bienvenida" | "Casas" | "Despedida";

interface Bloque {
  seccion: Seccion;
  titulo: string;
  /** Frase-resumen que se muestra arriba, si la hay (no se usa: solo va lo que escribe María). */
  resumen?: string;
  texto: string;
  /** Página en la que empieza. Se rellena al paginar. */
  pagina?: number;
}

// ── Texto con negrita dentro ──────────────────────────────────────────────

type Estilo = "cuerpo" | "resumen";
/** Una palabra (o un espacio) con su estilo. La unidad con la que se mide. */
interface Ficha {
  t: string;
  bold: boolean;
  /** Símbolo (☉ ☽ ♄…) o emoji: se pinta como imagen pequeña en la misma línea. */
  glifo?: boolean;
}
/** Una línea ya colocada: sus fichas, o un hueco en blanco. */
type Linea = { tipo: Estilo; fichas: Ficha[] } | { tipo: "hueco"; alto: number };

/** Símbolos de planeta/punto y emojis. */
const GLIFO = /[☉☽☾☿♀♁♂♃♄♅♆♇⚷⚸☊☋⚳⚴⚵⚶]|\p{Extended_Pictographic}/u;
const GLIFO_PARTIR = /([☉☽☾☿♀♁♂♃♄♅♆♇⚷⚸☊☋⚳⚴⚵⚶]|\p{Extended_Pictographic})/u;

/**
 * Traduce a Latin-1 lo que los tipos internos del PDF no saben pintar. Lo que no
 * tiene equivalente se quita: mejor una frase limpia que un símbolo roto.
 */
function latin1(s: string): string {
  const mapa: Record<string, string> = {
    "‘": "'", "’": "'", "“": '"', "”": '"',
    "–": "-", "—": "-", "…": "...", " ": " ",
    "•": "·", "→": "->", "←": "<-", "↑": "^", "↓": "v",
    "✓": "-", "✗": "x",
  };
  return s
    .replace(/[‘’“”–—… •→←↑↓✓✗]/g,
      (c) => mapa[c] ?? "")
    // Fuera del Latin-1 imprimible no hay letra posible: se descarta, salvo los símbolos y emojis, que se pintan como imagen.
    .replace(/[^\t\n\r\x20-\x7E¡-ÿ]/gu, (c) => (GLIFO.test(c) ? c : ""));
}

/**
 * Parte un texto en fichas (palabras y espacios) marcando las que van en
 * negrita porque el original las escribió como `**así**`. Los asteriscos que
 * queden sin pareja se tiran: no se imprimen nunca.
 */
function fichasDe(texto: string): Ficha[] {
  const tramos: Ficha[] = [];
  const re = /\*\*([\s\S]+?)\*\*/g;
  let ultimo = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(texto))) {
    if (m.index > ultimo) tramos.push({ t: texto.slice(ultimo, m.index), bold: false });
    tramos.push({ t: m[1], bold: true });
    ultimo = re.lastIndex;
  }
  if (ultimo < texto.length) tramos.push({ t: texto.slice(ultimo), bold: false });

  const fichas: Ficha[] = [];
  for (const tramo of tramos) {
    for (const p of tramo.t.replace(/\*/g, "").split(/(\s+)/)) {
      if (p === "") continue;
      if (/^\s+$/.test(p)) { fichas.push({ t: p, bold: tramo.bold }); continue; }
      for (const trozo of p.split(GLIFO_PARTIR)) {
        if (trozo === "") continue;
        fichas.push(GLIFO.test(trozo) ? { t: trozo, bold: tramo.bold, glifo: true } : { t: trozo, bold: tramo.bold });
      }
    }
  }
  return fichas;
}

/** Deja el documento con la letra del estilo pedido (redonda/negrita). */
function fuente(doc: jsPDF, estilo: Estilo, bold: boolean) {
  if (estilo === "resumen") {
    doc.setFont("times", bold ? "bolditalic" : "italic");
    doc.setFontSize(11.5);
  } else {
    doc.setFont("times", bold ? "bold" : "normal");
    doc.setFontSize(TAM_CUERPO);
  }
}

/** El lado (mm) de un símbolo o emoji metido en una línea: lo que mide la letra de ese momento. */
const ladoGlifo = (doc: jsPDF) => doc.getFontSize() * PT * 1.1;

/**
 * Parte las fichas en líneas que caben en `ancho`. Hace a mano lo que haría
 * `splitTextToSize`, porque aquí una línea puede mezclar redonda y negrita y hay
 * que medir cada palabra con SU letra.
 */
function lineasDe(doc: jsPDF, fichas: Ficha[], estilo: Estilo, ancho: number): Ficha[][] {
  const lineas: Ficha[][] = [];
  let actual: Ficha[] = [];
  let x = 0;
  let espacio: Ficha | null = null; // espacio a la espera: no se pinta si toca cortar

  for (const f of fichas) {
    if (/^\s+$/.test(f.t)) {
      if (actual.length) espacio = { t: " ", bold: f.bold };
      continue;
    }
    fuente(doc, estilo, f.bold);
    const w = f.glifo ? ladoGlifo(doc) : doc.getTextWidth(f.t);
    let wEsp = 0;
    if (espacio) {
      fuente(doc, estilo, espacio.bold);
      wEsp = doc.getTextWidth(" ");
    }
    if (actual.length && x + wEsp + w > ancho) {
      lineas.push(actual);
      actual = [];
      x = 0;
    } else if (espacio) {
      actual.push(espacio);
      x += wEsp;
    }
    espacio = null;
    actual.push(f);
    x += w;
  }
  if (actual.length) lineas.push(actual);
  return lineas;
}

/** Pinta una línea, cada ficha con su letra, avanzando por su ancho medido. */
function pintarLinea(doc: jsPDF, fichas: Ficha[], estilo: Estilo, y: number) {
  let x = MARGEN_X;
  for (const f of fichas) {
    fuente(doc, estilo, f.bold);
    if (f.glifo) {
      const lado = ladoGlifo(doc);
      doc.addImage(rasterGlifo(f.t, TINTA), "PNG", x, y - lado * 0.82, lado, lado, `g-${f.t}`, "FAST");
      x += lado;
      continue;
    }
    if (f.t.trim() !== "") {
      doc.setTextColor(...TINTA);
      doc.text(f.t, x, y);
    }
    x += doc.getTextWidth(f.t);
  }
}

// ── Qué entra en el documento y en qué orden ───────────────────────────────

/** Bienvenida, las doce Casas (en orden) y despedida: solo lo que María ha escrito para esa persona. */
function construirBloques(d: DatosPdfCarta): Bloque[] {
  const bloques: Bloque[] = [];
  const limpio = (t?: string | null) => (typeof t === "string" ? t.replace(/\r/g, "").trim() : "");

  const bienvenida = limpio(d.bienvenida);
  if (bienvenida) bloques.push({ seccion: "Bienvenida", titulo: traducir("metodo.astro.paso.bienvenida"), texto: bienvenida });

  for (let n = 1; n <= AREAS_TOTAL; n++) {
    const texto = limpio(d.areas?.[String(n)]);
    if (texto) bloques.push({ seccion: "Casas", titulo: tituloArea(n), texto });
  }

  const despedida = limpio(d.despedida);
  if (despedida) bloques.push({ seccion: "Despedida", titulo: traducir("metodo.astro.paso.sintesis"), texto: despedida });
  return bloques;
}

// ── Piezas comunes de página ──────────────────────────────────────────────

/** La foto del cielo velada, del tamaño del A4, para el fondo de cada página. */
let fondoFoto: string | null = null;

const fondoPagina = (doc: jsPDF, conFoto = true) => {
  doc.setFillColor(...FONDO);
  doc.rect(0, 0, A4_W, A4_H, "F");
  // Mismo alias en todas las páginas: la foto se incrusta UNA vez.
  if (conFoto && fondoFoto) {
    doc.addImage(fondoFoto, "JPEG", 0, 0, A4_W, A4_H, "fondoPag", "FAST");
  }
};

/** La única raya del documento: larga, debajo del título. */
function filete(doc: jsPDF, y: number, color: [number, number, number]) {
  doc.setDrawColor(...color);
  doc.setLineWidth(0.3);
  doc.line(MARGEN_X, y, MARGEN_X + ANCHO_TEXTO, y);
}

/** El trazado del icono de Astrología (el de los headers de la web), en un lienzo «0 -960 960 960». */
const ICONO_ASTRO_PATH =
  "m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm457-560 21-89-71-59 94-8 36-84 36 84 94 8-71 59 21 89-80-47-80 47ZM480-481Z";

/** El pie de cada página: solo el número, abajo a la derecha. Arriba no hay decoración (solo la lleva la portada). */
function pie(doc: jsPDF, pagina: number, _seccion: string) {
  doc.setFont("times", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...TINTA);
  doc.text(String(pagina), A4_W - MARGEN_X, A4_H - 10, { align: "right" });
}

/**
 * Cabecera de una página de lectura. Con `dibujar` en false solo devuelve la
 * altura: medir y pintar comparten este código a propósito.
 */
function cabecera(doc: jsPDF, b: Bloque, continua: boolean, dibujar: boolean): number {
  // Arriba va el título y nada más (la sección ya está en el pie y en el índice).
  let y = MARGEN_SUP + 4;
  const tam = continua ? 15 : 19;
  doc.setFont("times", "bold");
  doc.setFontSize(tam);

  const titulo = latin1(continua ? `${b.titulo} (continúa)` : b.titulo);
  const lineas: string[] = doc.splitTextToSize(titulo, ANCHO_TEXTO);
  if (dibujar) {
    doc.setTextColor(...TINTA);
    doc.text(lineas, MARGEN_X, y);
  }
  y += lineas.length * (continua ? 6.5 : 8);

  if (dibujar) filete(doc, y, TINTA);
  // Aire generoso entre la raya y la primera línea: la página respira.
  return y + 16;
}

/**
 * Reparte el bloque en páginas. Devuelve, por página, la `y` de arranque y las
 * líneas que caben. El pintado recorre esto tal cual, así que lo que se mide es
 * exactamente lo que se imprime.
 */
function repartirBloque(doc: jsPDF, b: Bloque): { continua: boolean; lineas: Linea[] }[] {
  const cola: Linea[] = [];

  if (b.resumen) {
    for (const l of lineasDe(doc, fichasDe(latin1(b.resumen)), "resumen", ANCHO_TEXTO)) {
      cola.push({ tipo: "resumen", fichas: l });
    }
    cola.push({ tipo: "hueco", alto: 9 });
  }

  const parrafos = b.texto
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, " ").trim())
    .filter(Boolean);
  parrafos.forEach((p, i) => {
    // Una línea «---» del texto es una separación: no se imprime, deja un respiro más grande.
    if (/^-{3,}$/.test(p)) {
      cola.push({ tipo: "hueco", alto: INTERLINEA * 1.6 });
      return;
    }
    for (const l of lineasDe(doc, fichasDe(latin1(p)), "cuerpo", ANCHO_TEXTO)) {
      cola.push({ tipo: "cuerpo", fichas: l });
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
        y += linea.alto;
        continue;
      }
      pintarLinea(doc, linea.fichas, linea.tipo, y);
      y += linea.tipo === "resumen" ? INTERLINEA_RESUMEN : INTERLINEA;
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
  dibujar: boolean,
): number {
  let paginas = 1;
  // Arranca donde arrancan las páginas de contenido: el índice ya no lleva el
  // antetítulo «TU CARTA COMPLETA · N páginas», solo su título.
  let y = MARGEN_SUP + 4;
  let seccionActual: Seccion | null = null;

  const cabeceraIndice = () => {
    doc.setFont("times", "bold");
    doc.setFontSize(22);
    if (dibujar) {
      doc.setTextColor(...TINTA);
      doc.text(latin1("Índice"), MARGEN_X, y);
    }
    y += 5;
    if (dibujar) filete(doc, y, TINTA);
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
      y = MARGEN_SUP + 4;
      seccionActual = null;
      cabeceraIndice();
    }

    if (b.seccion !== seccionActual) {
      seccionActual = b.seccion;
      y += 3;
      if (dibujar) {
        doc.setFont("times", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...TINTA);
        doc.text(latin1(b.seccion.toUpperCase()), MARGEN_X, y);
      }
      y += 5.6;
    }

    if (dibujar) {
      doc.setFont("times", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...TINTA);
      const titulo = latin1(b.titulo);
      const num = String(b.pagina ?? "");
      doc.text(titulo, MARGEN_X + 4, y);

      // Puntitos de guía hasta el número, como en el índice de un libro.
      const xIni = MARGEN_X + 4 + doc.getTextWidth(titulo) + 2;
      const xFin = A4_W - MARGEN_X - doc.getTextWidth(num) - 2;
      const anchoPunto = doc.getTextWidth(". ");
      const cuantos = Math.floor((xFin - xIni) / anchoPunto);
      if (cuantos > 0) doc.text(Array(cuantos).fill(".").join(" "), xIni, y);
      doc.text(num, A4_W - MARGEN_X, y, { align: "right" });
    }
    y += 5.4;
  }

  if (dibujar) pie(doc, paginaInicial + paginas - 1, "Índice");
  return paginas;
}

// ── Portada y fondo de las páginas ────────────────────────────────────────

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

/**
 * La foto de fondo de las páginas de texto: la misma del cielo, doblada igual
 * que en la portada y con un velo oscuro parejo encima. Se rasteriza una vez y
 * se reutiliza; si la foto no carga, las páginas se quedan en cielo liso.
 */
async function prepararFondoPaginas(imgFondo?: string) {
  fondoFoto = null;
  if (!imgFondo) return;
  // Menos resolución que la portada: aquí lo que manda es el texto.
  const W = 900;
  const H = Math.round((W * A4_H) / A4_W);
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#070b1a";
  ctx.fillRect(0, 0, W, H);
  try {
    fondoDoblado(ctx, await cargarImagen(imgFondo), W, H);
  } catch {
    return; // sin foto: cielo liso, como antes
  }

  // Velo justo: el cielo se ve de verdad y el texto blanco sigue leyéndose.
  const velo = ctx.createLinearGradient(0, 0, 0, H);
  velo.addColorStop(0, "rgba(5,8,22,0.66)");
  velo.addColorStop(0.5, "rgba(5,8,22,0.58)");
  velo.addColorStop(1, "rgba(5,8,22,0.66)");
  ctx.fillStyle = velo;
  ctx.fillRect(0, 0, W, H);

  fondoFoto = canvas.toDataURL("image/jpeg", 0.7);
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

  const BEIGE = "#F0DCC0";
  const mm = W / A4_W; // píxeles por milímetro
  const margenX = 20 * mm;
  const arriba = 14 * mm;
  const px = (pt: number) => Math.round(pt * PT * mm); // puntos de letra → píxeles

  // Arriba a la izquierda: el mandala (en beige), el nombre de la persona y, debajo, «con María Escribano».
  const lado = 14 * mm;
  try {
    const mandala = await cargarImagen(IMG_MANDALA);
    const tinte = document.createElement("canvas");
    tinte.width = Math.round(lado);
    tinte.height = Math.round(lado);
    const t = tinte.getContext("2d")!;
    t.drawImage(mandala, 0, 0, tinte.width, tinte.height);
    t.globalCompositeOperation = "source-in";
    t.fillStyle = BEIGE;
    t.fillRect(0, 0, tinte.width, tinte.height);
    ctx.drawImage(tinte, margenX, arriba, lado, lado);
  } catch {
    /* sin mandala: queda solo el nombre */
  }
  const xTexto = margenX + lado + 3.6 * mm;
  const marca = traducir("header.marca").toLowerCase().replace(/(^|\s)\p{L}/gu, (m) => m.toUpperCase());
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = BEIGE;
  ctx.font = `600 ${px(11.5)}px 'EB Garamond', Georgia, serif`;
  (ctx as unknown as { letterSpacing: string }).letterSpacing = `${(px(11.5) * 0.18).toFixed(1)}px`;
  if (d.nombre) ctx.fillText(d.nombre.toUpperCase(), xTexto, arriba + lado * 0.45);
  ctx.font = `italic 500 ${px(9)}px 'EB Garamond', Georgia, serif`;
  (ctx as unknown as { letterSpacing: string }).letterSpacing = `${(px(9) * 0.06).toFixed(1)}px`;
  ctx.fillText(`${traducir("header.con")} ${marca}`, xTexto, arriba + lado * 0.45 + px(9) * 1.55);

  // Arriba a la derecha: el icono de Astrología y ASTROLOGÍA.
  ctx.textAlign = "right";
  ctx.font = `600 ${px(11.5)}px 'EB Garamond', Georgia, serif`;
  (ctx as unknown as { letterSpacing: string }).letterSpacing = `${(px(11.5) * 0.18).toFixed(1)}px`;
  const yAstro = arriba + 3 * mm + 8 * mm * 0.62;
  ctx.fillText(traducir("disciplina.astrologia").toUpperCase(), W - margenX, yAstro);
  const anchoAstro = ctx.measureText(traducir("disciplina.astrologia").toUpperCase()).width;
  (ctx as unknown as { letterSpacing: string }).letterSpacing = "0px";
  ctx.save();
  const lIcono = 8 * mm;
  ctx.translate(W - margenX - anchoAstro - 2.6 * mm - lIcono, arriba + 3 * mm);
  ctx.scale(lIcono / 960, lIcono / 960);
  ctx.translate(0, 960);
  ctx.fillStyle = BEIGE;
  ctx.fill(new Path2D(ICONO_ASTRO_PATH));
  ctx.restore();

  // En medio: «Tu Carta Astral», al tamaño de siempre.
  ctx.textAlign = "center";
  ctx.fillStyle = BEIGE;
  ctx.font = `600 ${Math.round(W * 0.062)}px 'EB Garamond', Georgia, serif`;
  ctx.shadowColor = "rgba(240,220,192,0.5)";
  ctx.shadowBlur = W * 0.02;
  ctx.fillText(traducir("metodo.astro.paso.introduccion"), W / 2, H * 0.165);
  ctx.shadowBlur = 0;

  dibujarRuedaCarta(ctx, d.carta, W / 2, H * 0.535, W * 0.86);

  const partes = [d.nacimiento?.fecha, d.nacimiento?.hora, d.nacimiento?.lugar]
    .map((p) => (p ?? "").trim())
    .filter(Boolean);
  if (partes.length) {
    ctx.fillStyle = "rgba(240,220,192,0.84)";
    ctx.font = `400 ${Math.round(W * 0.023)}px 'EB Garamond', Georgia, serif`;
    ctx.fillText(partes.join("   ·   "), W / 2, H * 0.9);
  }

  ctx.fillStyle = "rgba(240,220,192,0.5)";
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
  const bloques = construirBloques(d);
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });

  // 1) Paginación en seco (sin dibujar nada): cuántas páginas ocupa el índice y
  //    en qué página empieza cada lectura.
  const paginasIndice = indice(doc, bloques, 2, false);
  const reparto = bloques.map((b) => repartirBloque(doc, b));
  let cursor = 2 + paginasIndice; // 1 = portada
  bloques.forEach((b, i) => {
    b.pagina = cursor;
    cursor += reparto[i].length;
  });

  const totalPasos = bloques.length + 2;
  let hechos = 0;
  const paso = () => onPaso?.(++hechos, totalPasos);

  // 2) Portada. Se pasa ya como JPEG con calidad 0,85: la portada es lo único
  //    que va en mapa de bits a resolución alta, y a calidad por defecto se
  //    comía casi todo el peso del archivo (una foto del cielo no necesita más).
  await prepararFondoPaginas(d.imgFondo);
  fondoPagina(doc, false);
  const portada = (await pintarPortada(d)).toDataURL("image/jpeg", 0.85);
  doc.addImage(portada, "JPEG", 0, 0, A4_W, A4_H, "portada", "FAST");
  paso();

  // 3) Índice.
  doc.addPage();
  fondoPagina(doc);
  indice(doc, bloques, 2, true);
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
