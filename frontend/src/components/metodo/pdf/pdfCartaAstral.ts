// ─────────────────────────────────────────────────────────────────────────
// «Toda mi carta» en un PDF que el usuario se lleva para siempre.
//
// Cómo está montado y por qué:
//
//  · PORTADA → un canvas (mapa de bits) con la foto del cielo de fondo y la
//    rueda de la carta dibujada encima. La foto es CUADRADA y el A4 no, así que
//    se pinta DOS VECES —la de abajo espejada— en vez de estirarla: se aprovecha
//    entera y no se deforma nada.
//  · EL RESTO DE PÁGINAS lleva la MISMA foto de fondo, doblada igual y con un
//    velo oscuro encima para que el texto se lea. Se rasteriza UNA sola vez y se
//    coloca en cada página con el mismo `alias`: jsPDF entonces la incrusta una
//    única vez y las 60 páginas solo la referencian (si no, el archivo pesaría
//    sesenta veces más).
//  · EL TEXTO es texto de PDF de verdad (no imágenes). Así se puede buscar,
//    copiar y se imprime nítido. Siempre en BLANCO: es lo único que se lee bien
//    sobre la foto en todas las páginas.
//
//  · Una lectura por página, en el orden del cómic de los planetas: Ascendente,
//    Sol, Luna, Mercurio… y de cada uno primero su signo y luego su casa. Si un
//    texto no cabe en una página, sigue en la siguiente marcada «(continúa)»:
//    nunca se corta ni se mezcla con la lectura siguiente.
//  · Una ÚNICA línea horizontal por página, larga, justo debajo del título. Nada
//    más corta el texto.
//  · Al lado del título va el SÍMBOLO del planeta de esa lectura (dos, en los
//    aspectos), con su color y un poco de brillo; el título toma ese mismo color
//    cuando hay un planeta solo. El símbolo se rasteriza en un canvas porque los
//    tipos internos del PDF no tienen glifo para ☉ ☽ ♀ — igual que en la rueda.
//
//  · MEDIR Y PINTAR SON EL MISMO CÓDIGO (`cabecera`, `repartirBloque`) llamado
//    con `dibujar` a false o a true. Es lo que hace que los números del índice
//    sean exactos: con dos cálculos separados, en cuanto uno se desviara un
//    milímetro el índice empezaría a mentir.
//
//  · Los tipos de letra son los internos del PDF (Times), que solo entienden
//    Latin-1: por eso `latin1()` traduce lo que se salga de ahí (comillas
//    tipográficas, flechas, símbolos). Sin eso saldrían caracteres raros.
//  · Del texto escrito a mano se respeta el **negrita** de Markdown: se pinta en
//    negrita de verdad, y los asteriscos sueltos no se imprimen nunca. Como una
//    misma línea mezcla redonda y negrita, las líneas se parten a mano midiendo
//    palabra por palabra (`lineasDe`) en vez de con `splitTextToSize`.
// ─────────────────────────────────────────────────────────────────────────
import jsPDF from "jspdf";
import { CUERPOS, ZODIAC_SIGNS, cuerpoByKey, type Cuerpo } from "../astrologiaData";
import { textoEstatico } from "../../../data/astrologiaTextosApi";
import { cargarOverridesRemotos } from "../../../data/astrologiaOverridesRemotos";
import { ASPECTO_LABEL, aspectoKey, infoCasa } from "../casasAspectos";
import type { Aspecto, CartaNatal } from "../CartaAstral3D/types";
import { FUENTE_SIMBOLOS, dibujarRuedaCarta } from "./ruedaCarta";

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
  /** Foto del cielo para la portada y para el fondo de todas las páginas. */
  imgFondo?: string;
}

/** El mandala de la marca, que va arriba en la portada. */
const IMG_MANDALA = "/img/icono/life.png";

// ── Medidas de la página (A4 en mm) ───────────────────────────────────────
const A4_W = 210;
const A4_H = 297;
const MARGEN_X = 22;
const MARGEN_SUP = 24;
const MARGEN_INF = 20;
const ANCHO_TEXTO = A4_W - MARGEN_X * 2;
const Y_TOPE = A4_H - MARGEN_INF - 6;

// ── Paleta: cielo de noche de fondo y TODO el texto en blanco ─────────────
const FONDO: [number, number, number] = [7, 11, 26];
const BLANCO: [number, number, number] = [255, 255, 255];

const INTERLINEA = 5.5;
const TAM_CUERPO = 10.5;
const INTERLINEA_RESUMEN = 5.8;
/** De puntos de tipografía a milímetros (72 pt = 1 pulgada = 25,4 mm). */
const PT = 25.4 / 72;

type Seccion = "Arquetipos" | "Puntos clave" | "Casas" | "Aspectos";

interface Bloque {
  seccion: Seccion;
  titulo: string;
  /** Frase-resumen que el popup del recorrido muestra arriba, si la hay. */
  resumen?: string;
  texto: string;
  /** Planetas cuyo símbolo va al lado del título (dos, en los aspectos). */
  cuerpos: string[];
  /** Página en la que empieza. Se rellena al paginar. */
  pagina?: number;
}

// ── Texto con negrita dentro ──────────────────────────────────────────────

type Estilo = "cuerpo" | "resumen";
/** Una palabra (o un espacio) con su estilo. La unidad con la que se mide. */
interface Ficha {
  t: string;
  bold: boolean;
}
/** Una línea ya colocada: sus fichas, o un hueco en blanco. */
type Linea = { tipo: Estilo; fichas: Ficha[] } | { tipo: "hueco"; alto: number };

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
      if (p !== "") fichas.push({ t: p, bold: tramo.bold });
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
    const w = doc.getTextWidth(f.t);
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
    if (f.t.trim() !== "") {
      doc.setTextColor(...BLANCO);
      doc.text(f.t, x, y);
    }
    x += doc.getTextWidth(f.t);
  }
}

// ── Color de cada planeta, subido de luz para que se lea sobre el cielo ────

/** Mezcla el color con blanco hasta que tenga luz suficiente sobre el fondo. */
function aclarar(hex: string): [number, number, number] {
  const n = hex.replace("#", "");
  const c = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
  const lum = (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255;
  const minimo = 0.62;
  if (lum >= minimo) return [c[0], c[1], c[2]];
  const k = (minimo - lum) / (1 - lum);
  return c.map((v) => Math.round(v + (255 - v) * k)) as [number, number, number];
}

const aHex = ([r, g, b]: [number, number, number]) =>
  `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;

/**
 * El símbolo del planeta rasterizado en un PNG con su brillo. Va en mapa de bits
 * porque los tipos internos del PDF no tienen glifo para ☉ ☽ ♀ ♂ — los mismos
 * símbolos y la misma fuente que la rueda de la portada.
 */
function glifoPlaneta(cuerpo: Cuerpo): string {
  const S = 128;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;
  const color = aHex(aclarar(cuerpo.color));

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${Math.round(S * 0.66)}px ${FUENTE_SIMBOLOS}`;
  ctx.shadowColor = color;
  ctx.shadowBlur = S * 0.16;
  ctx.fillStyle = color;
  // Dos pasadas: la segunda asienta el brillo sin quemar el trazo.
  ctx.fillText(cuerpo.symbol, S / 2, S * 0.52);
  ctx.fillText(cuerpo.symbol, S / 2, S * 0.52);
  return canvas.toDataURL("image/png");
}

/** Los glifos ya rasterizados de esta tirada (uno por planeta, no por página). */
const glifos = new Map<string, string>();

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
          titulo: `${cuerpo.label} en ${signo}`,
          resumen,
          texto: body,
          cuerpos: [cuerpo.key],
        });
      }
    }

    if (cuerpo.conCasa && pos.casa) {
      const t = textoEstatico(cuerpo.key, "casa", String(pos.casa));
      if (t?.trim()) {
        const { resumen, cuerpo: body } = partirResumen(t);
        bloques.push({
          seccion: "Arquetipos",
          titulo: `${cuerpo.label} en la Casa ${pos.casa}`,
          resumen,
          texto: body,
          cuerpos: [cuerpo.key],
        });
      }
    }
  }

  // Puntos clave: los escribe la administradora para esta carta concreta.
  for (const reto of d.retos ?? []) {
    if (!reto?.texto?.trim()) continue;
    bloques.push({
      seccion: "Puntos clave",
      titulo: reto.titulo?.trim() || "Punto clave",
      texto: reto.texto.trim(),
      cuerpos: [],
    });
  }

  // Casas.
  for (let n = 1; n <= 12; n++) {
    const texto = (d.casasTexto?.[String(n)] ?? "").trim();
    if (!texto) continue;
    const signo = infoCasa(d.carta.cusps ?? [], n)?.signo?.name;
    bloques.push({
      seccion: "Casas",
      titulo: signo ? `Casa ${n} en ${signo}` : `Casa ${n}`,
      texto,
      cuerpos: [],
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
      titulo: `${nombreCuerpo(asp.a)} ${etiqueta.toLowerCase()} ${nombreCuerpo(asp.b)}`,
      texto,
      cuerpos: [asp.a, asp.b],
    });
  }

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

function pie(doc: jsPDF, pagina: number, seccion: string) {
  doc.setFont("times", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...BLANCO);
  doc.text(latin1(seccion), MARGEN_X, A4_H - 10);
  doc.text(String(pagina), A4_W - MARGEN_X, A4_H - 10, { align: "right" });
}

/** El color del título: el del planeta si la lectura es de uno solo. */
function colorTitulo(b: Bloque): [number, number, number] {
  if (b.cuerpos.length !== 1) return BLANCO;
  const c = cuerpoByKey(b.cuerpos[0]);
  return c ? aclarar(c.color) : BLANCO;
}

/**
 * Cabecera de una página de lectura. Con `dibujar` en false solo devuelve la
 * altura: medir y pintar comparten este código a propósito.
 */
function cabecera(doc: jsPDF, b: Bloque, continua: boolean, dibujar: boolean): number {
  // Arriba va el título y nada más: ni sección ni antetítulo (la sección ya está
  // en el pie y en el índice).
  let y = MARGEN_SUP + 4;
  const color = colorTitulo(b);

  const tam = continua ? 15 : 19;
  doc.setFont("times", "bold");
  doc.setFontSize(tam);
  const titulo = latin1(continua ? `${b.titulo} (continúa)` : b.titulo);
  const lineas: string[] = doc.splitTextToSize(titulo, ANCHO_TEXTO);
  if (dibujar) {
    doc.setTextColor(...color);
    doc.text(lineas, MARGEN_X, y);

    // Los símbolos, pegados al final de la última línea del título.
    const lado = tam * PT * 1.15;
    const presentes = b.cuerpos.filter((k) => glifos.has(k));
    if (presentes.length) {
      const ultima = lineas[lineas.length - 1] ?? "";
      const base = y + (lineas.length - 1) * tam * PT * 1.15;
      const hueco = lado * 0.18;
      const total = presentes.length * lado + (presentes.length - 1) * hueco;
      let x = MARGEN_X + doc.getTextWidth(ultima) + lado * 0.28;
      // Si no cabe detrás del título, se pega al margen derecho.
      if (x + total > A4_W - MARGEN_X) x = A4_W - MARGEN_X - total;
      for (const k of presentes) {
        doc.addImage(glifos.get(k)!, "PNG", x, base - lado * 0.82, lado, lado, `glifo-${k}`, "FAST");
        x += lado + hueco;
      }
    }
  }
  y += lineas.length * (continua ? 6.5 : 8);

  if (dibujar) filete(doc, y, color);
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
      doc.setTextColor(...BLANCO);
      doc.text(latin1("Índice"), MARGEN_X, y);
    }
    y += 5;
    if (dibujar) filete(doc, y, BLANCO);
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
        doc.setTextColor(...BLANCO);
        doc.text(latin1(b.seccion.toUpperCase()), MARGEN_X, y);
      }
      y += 5.6;
    }

    if (dibujar) {
      doc.setFont("times", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...BLANCO);
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

  // Arriba, el mandala de la marca (donde antes iba el nombre escrito).
  try {
    const mandala = await cargarImagen(IMG_MANDALA);
    const lado = W * 0.072;
    ctx.save();
    ctx.shadowColor = "rgba(255,255,255,0.45)";
    ctx.shadowBlur = W * 0.014;
    ctx.drawImage(mandala, (W - lado) / 2, H * 0.075 - lado / 2, lado, lado);
    ctx.restore();
  } catch {
    /* sin mandala: la portada arranca directamente en el título */
  }

  ctx.textAlign = "center";
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

  // El símbolo de cada planeta que aparezca, rasterizado una sola vez.
  glifos.clear();
  for (const b of bloques) {
    for (const k of b.cuerpos) {
      if (glifos.has(k)) continue;
      const cuerpo = cuerpoByKey(k);
      if (cuerpo) glifos.set(k, glifoPlaneta(cuerpo));
    }
  }

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
