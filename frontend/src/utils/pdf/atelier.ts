// ─────────────────────────────────────────────────────────────────────────
// EL TALLER — la maquinaria común de todos los PDF descargables.
//
// La idea: que cada documento parezca un libro pequeño hecho a mano, no el
// volcado de un formulario. Para eso, todo PDF comparte cuatro cosas:
//
//  1. PAPEL. Ninguna página es blanco plano. Se genera una vez una textura de
//     papel (crema o tinta oscura según la disciplina) con vetas suaves, grano
//     fino y viñeta en los bordes, y se reutiliza en todas las páginas con el
//     mismo alias: pesa una sola vez en el archivo.
//  2. ACUARELA. La misma ilustración que la persona ha visto en la web: a
//     sangre en la portada, y como lavado que se funde con el papel en la
//     cabecera de las páginas interiores. Nunca con corte duro.
//  3. TIPOGRAFÍA. EB Garamond embebida, la de la casa. Antetítulos en
//     versalitas espaciadas, capitulares al abrir capítulo, cursivas para la
//     voz del documento y filetes finos para separar. Nada de negritas
//     gigantes: el ritmo lo pone el espacio en blanco.
//  4. ORNAMENTO. Filigranas de esquina, rombos de separación y el emblema de
//     la disciplina como marca de agua. Todo vectorial (formas.ts).
//
// El texto va como TEXTO de verdad (se busca, se copia, se imprime nítido).
// Solo el papel y la acuarela son mapas de bits.
// ─────────────────────────────────────────────────────────────────────────
import jsPDF from "jspdf";
import { registerEbGaramond, GARAMOND } from "../fonts/ebGaramond";
import type { Tema, RGB } from "./temas";
import { blindarFuente } from "./glifos";
import {
  conAlfa,
  divisorRombo,
  filete,
  filigranaEsquina,
  barra,
} from "./formas";

export const A4_W = 210;
export const A4_H = 297;
export const MARGEN = 21;
export const ANCHO = A4_W - MARGEN * 2;

const rgbCss = (c: RGB) => `rgb(${c[0]},${c[1]},${c[2]})`;

/* ── Imágenes ─────────────────────────────────────────────────────────────── */

function cargarImagen(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (!src) { resolve(null); return; }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** Recorta la foto «a cover» dentro de un lienzo de w×h. */
function pintarCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) {
  const escala = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const iw = img.naturalWidth * escala;
  const ih = img.naturalHeight * escala;
  ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);
}

/**
 * Textura de papel. Se genera a 620×877 (unos 75 ppp) a propósito: lo que
 * imita es una FIBRA, no un detalle, y a esa resolución el archivo pesa poco y
 * al imprimir se lee como grano natural en vez de como píxeles.
 */
function texturaPapel(tema: Tema): string {
  const W = 620;
  const H = 877;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;

  ctx.fillStyle = rgbCss(tema.papel);
  ctx.fillRect(0, 0, W, H);

  // Vetas: manchas grandes y muy suaves, como el papel hecho a mano.
  const veta = rgbCss(tema.papelVeta);
  for (let i = 0; i < 110; i++) {
    // Ruido determinista (nada de Math.random: dos descargas iguales deben
    // producir el mismo archivo).
    const s = Math.sin(i * 12.9898) * 43758.5453;
    const t = Math.sin(i * 78.233) * 12345.6789;
    const x = ((s - Math.floor(s)) * W);
    const y = ((t - Math.floor(t)) * H);
    const r = 40 + ((s * 7 - Math.floor(s * 7)) * 150);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, veta);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Grano fino.
  const datos = ctx.getImageData(0, 0, W, H);
  const px = datos.data;
  for (let i = 0; i < px.length; i += 4) {
    const n = ((i * 1103515245 + 12345) >> 8) % 11 - 5;
    px[i] = Math.max(0, Math.min(255, px[i] + n));
    px[i + 1] = Math.max(0, Math.min(255, px[i + 1] + n));
    px[i + 2] = Math.max(0, Math.min(255, px[i + 2] + n));
  }
  ctx.putImageData(datos, 0, 0);

  // Viñeta: los bordes de una hoja siempre están un punto más apagados.
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.32, W / 2, H / 2, H * 0.78);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, tema.oscuro ? "rgba(0,0,0,0.34)" : "rgba(120,96,64,0.10)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);

  return c.toDataURL("image/jpeg", 0.82);
}

/** Lavado de acuarela para la cabecera interior: se funde con el papel. */
function lavadoCabecera(tema: Tema, img: HTMLImageElement | null): string | null {
  if (!img) return null;
  const W = 1240;
  const H = 170;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = rgbCss(tema.papel);
  ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = tema.oscuro ? 1 : 0.55;
  pintarCover(ctx, img, W, H);
  ctx.globalAlpha = 1;
  // Degradado hasta el color del papel: sin corte duro por abajo.
  const g = ctx.createLinearGradient(0, 0, 0, H);
  const papel = tema.papel;
  g.addColorStop(0, `rgba(${papel[0]},${papel[1]},${papel[2]},${tema.oscuro ? 0.42 : 0.46})`);
  g.addColorStop(0.55, `rgba(${papel[0]},${papel[1]},${papel[2]},${tema.oscuro ? 0.72 : 0.78})`);
  g.addColorStop(1, `rgba(${papel[0]},${papel[1]},${papel[2]},1)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  return c.toDataURL("image/jpeg", 0.84);
}

/** Acuarela a sangre para la portada, con el velo del tema. */
function lienzoPortada(tema: Tema, img: HTMLImageElement | null): string {
  const W = 1240;
  const H = 1754; // A4 a 150 ppp
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = rgbCss(tema.papel);
  ctx.fillRect(0, 0, W, H);
  if (img) pintarCover(ctx, img, W, H);

  const velo = ctx.createLinearGradient(0, 0, 0, H);
  velo.addColorStop(0, tema.veloPortada[0]);
  velo.addColorStop(0.45, tema.veloPortada[1]);
  velo.addColorStop(1, tema.veloPortada[2]);
  ctx.fillStyle = velo;
  ctx.fillRect(0, 0, W, H);

  // Claro central: la zona donde va el emblema respira un poco más.
  const foco = ctx.createRadialGradient(W / 2, H * 0.46, 0, W / 2, H * 0.46, W * 0.62);
  foco.addColorStop(0, "rgba(255,255,255,0.10)");
  foco.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = foco;
  ctx.fillRect(0, 0, W, H);

  // Viñeta de bordes: encuadra la portada.
  const vin = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.8);
  vin.addColorStop(0, "rgba(0,0,0,0)");
  vin.addColorStop(1, "rgba(0,0,0,0.42)");
  ctx.fillStyle = vin;
  ctx.fillRect(0, 0, W, H);

  return c.toDataURL("image/jpeg", 0.86);
}

/* ── Opciones ─────────────────────────────────────────────────────────────── */

export interface PortadaOpts {
  /** Versalitas de arriba. Por defecto, «LIFE AS A PRIVILEGE». */
  antetitulo?: string;
  titulo: string;
  subtitulo?: string;
  /** Nombre de la persona, si lo hay. */
  nombre?: string;
  /** Frase corta bajo la lámina. */
  pieLamina?: string;
  /**
   * Lámina central de la portada: el diagnóstico dibujado (el Árbol, la rueda,
   * el ternario…). Recibe el eje central, la Y donde puede empezar a dibujar y
   * el ancho disponible. Si no se pasa, se dibuja el emblema de la disciplina.
   */
  lamina?: (doc: jsPDF, cx: number, yTop: number, ancho: number) => void;
  /** Versalitas del pie de portada. Por defecto, «EL MAPA». */
  cierre?: string;
}

export interface TallerOpts {
  /** Lo que se lee arriba a la derecha en las páginas interiores. */
  titulo: string;
  /** Acuarela distinta a la del tema (p. ej. la del doṣha concreto). */
  acuarela?: string;
}

/* ── El taller ────────────────────────────────────────────────────────────── */

export class Taller {
  readonly doc: jsPDF;
  readonly tema: Tema;
  y = 0;
  private pagina = 0;
  private readonly titulo: string;
  private readonly papel: string;
  private readonly lavado: string | null;
  private readonly portadaImg: string;
  private readonly fecha: string;
  /** Numeral fantasma del capítulo en curso (marca de agua de la página). */
  private capituloNum = 0;

  private constructor(tema: Tema, opts: TallerOpts, img: HTMLImageElement | null) {
    this.tema = tema;
    this.titulo = opts.titulo;
    this.doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });
    registerEbGaramond(this.doc);
    // Antes de imprimir una sola letra: la fuente embebida es un subconjunto y
    // se come en silencio lo que no tiene (ver glifos.ts).
    blindarFuente(this.doc);
    this.papel = texturaPapel(tema);
    this.lavado = lavadoCabecera(tema, img);
    this.portadaImg = lienzoPortada(tema, img);
    this.fecha = new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
  }

  static async abrir(tema: Tema, opts: TallerOpts): Promise<Taller> {
    const img = await cargarImagen(opts.acuarela ?? tema.acuarela);
    return new Taller(tema, opts, img);
  }

  /* ── Tipografía ─────────────────────────────────────────────────────── */

  private fuente(estilo: "normal" | "bold" | "italic" | "bolditalic", tam: number, color: RGB) {
    this.doc.setFont(GARAMOND, estilo);
    this.doc.setFontSize(tam);
    this.doc.setTextColor(...color);
  }

  /** Versalitas espaciadas: el antetítulo de la casa. */
  versalitas(texto: string, x: number, y: number, tam = 8, color?: RGB, alineado: "left" | "center" | "right" = "left") {
    this.fuente("normal", tam, color ?? this.tema.apagado);
    this.doc.setCharSpace(tam * 0.16);
    this.doc.text(texto.toUpperCase(), x, y, { align: alineado });
    this.doc.setCharSpace(0);
  }

  /* ── Páginas ────────────────────────────────────────────────────────── */

  /** Fondo, lavado, marca de agua, cabecera y pie. Deja `y` lista para escribir. */
  nuevaPagina(): void {
    const doc = this.doc;
    if (this.pagina > 0) doc.addPage();
    this.pagina++;
    const t = this.tema;

    doc.addImage(this.papel, "JPEG", 0, 0, A4_W, A4_H, "papel", "FAST");
    if (this.lavado) doc.addImage(this.lavado, "JPEG", 0, 0, A4_W, 28, "lavado", "FAST");

    // Marca de agua: el emblema de la disciplina, apenas insinuado.
    conAlfa(doc, t.oscuro ? 0.07 : 0.055, () => {
      t.emblema(doc, A4_W / 2, 168, 56, t.acento, t.papel);
    });

    // Numeral fantasma del capítulo, mordiendo el margen exterior.
    if (this.capituloNum > 0) {
      conAlfa(doc, t.oscuro ? 0.055 : 0.05, () => {
        this.fuente("bold", 88, t.acento);
        doc.text(String(this.capituloNum).padStart(2, "0"), A4_W - 3, 52, { align: "right" });
      });
    }

    // Cabecera.
    this.versalitas("Life as a Privilege", MARGEN, 15, 7.4, t.apagado);
    this.fuente("italic", 9.5, t.acento);
    doc.text(this.titulo, A4_W - MARGEN, 15, { align: "right" });
    doc.setDrawColor(...t.acento);
    doc.setLineWidth(0.3);
    doc.line(MARGEN, 19.5, A4_W - MARGEN, 19.5);
    doc.setLineWidth(0.15);
    doc.line(MARGEN, 20.6, A4_W - MARGEN, 20.6);

    // Pie.
    doc.setDrawColor(...t.trama);
    doc.setLineWidth(0.2);
    doc.line(MARGEN, A4_H - 15, A4_W - MARGEN, A4_H - 15);
    this.versalitas(t.disciplina, MARGEN, A4_H - 10, 7.2, t.apagado);
    this.fuente("normal", 9, t.apagado);
    doc.text(String(this.pagina), A4_W - MARGEN, A4_H - 10, { align: "right" });
    doc.setFillColor(...t.acento);
    const dx = A4_W - MARGEN - 7.5;
    doc.triangle(dx, A4_H - 11.6, dx + 1.1, A4_H - 10.5, dx, A4_H - 9.4, "F");
    doc.triangle(dx, A4_H - 11.6, dx - 1.1, A4_H - 10.5, dx, A4_H - 9.4, "F");

    this.y = 36;
  }

  /** Si no caben `alto` mm, salta de página. */
  reservar(alto: number): void {
    if (this.y + alto > A4_H - 22) this.nuevaPagina();
  }

  espacio(mm: number): void { this.y += mm; }

  /* ── Portada ────────────────────────────────────────────────────────── */

  portada(o: PortadaOpts): void {
    const doc = this.doc;
    const t = this.tema;
    const cx = A4_W / 2;

    doc.addImage(this.portadaImg, "JPEG", 0, 0, A4_W, A4_H, "portada", "FAST");

    // Marco doble con filigranas en las cuatro esquinas.
    doc.setDrawColor(...t.acentoSuave);
    doc.setLineWidth(0.5);
    doc.rect(11, 11, A4_W - 22, A4_H - 22);
    doc.setLineWidth(0.18);
    doc.rect(13.2, 13.2, A4_W - 26.4, A4_H - 26.4);
    filigranaEsquina(doc, 11, 11, 1, 1, t.acentoSuave);
    filigranaEsquina(doc, A4_W - 11, 11, -1, 1, t.acentoSuave);
    filigranaEsquina(doc, 11, A4_H - 11, 1, -1, t.acentoSuave);
    filigranaEsquina(doc, A4_W - 11, A4_H - 11, -1, -1, t.acentoSuave);

    this.versalitas(o.antetitulo ?? "Life as a Privilege", cx, 30, 9, t.acentoSuave, "center");
    filete(doc, cx, 34.5, 34, t.acentoSuave, 0.25);

    // Sobre la acuarela no vale el acento del tema: en las disciplinas de
    // acuarela clara (Ayurveda, Psicología, Nutrición) el subtítulo en color
    // desaparecía. Todo el texto secundario de la portada va en crema.
    const tituloColor: RGB = [255, 250, 242];
    const cremaSuave: RGB = [246, 236, 222];
    this.fuente("bold", o.titulo.length > 26 ? 27 : 33, tituloColor);
    const lineasTitulo = doc.splitTextToSize(o.titulo, ANCHO - 10) as string[];
    let yt = 52;
    lineasTitulo.forEach((l) => { doc.text(l, cx, yt, { align: "center" }); yt += 12; });

    if (o.subtitulo) {
      this.fuente("italic", 13, cremaSuave);
      doc.text(o.subtitulo, cx, yt + 1, { align: "center" });
      yt += 9;
    }
    divisorRombo(doc, cx, yt + 5, 46, t.acentoSuave);

    // Lámina central: entre el rombo y el bloque del nombre (~A4_H − 70).
    const laminaTop = yt + 16;
    if (o.lamina) {
      o.lamina(doc, cx, laminaTop, ANCHO - 24);
    } else {
      const hueco = A4_H - 70 - laminaTop;
      t.emblema(doc, cx, laminaTop + hueco / 2, Math.min(46, hueco / 2), t.acentoSuave, t.papel);
    }

    if (o.pieLamina) {
      this.fuente("italic", 9.8, cremaSuave);
      const lp = doc.splitTextToSize(o.pieLamina, ANCHO - 30) as string[];
      lp.forEach((l, i) => doc.text(l, cx, A4_H - 62 + i * 5.4, { align: "center" }));
    }

    if (o.nombre) {
      this.fuente("bold", 17, tituloColor);
      doc.text(o.nombre, cx, A4_H - 44, { align: "center" });
    }
    filete(doc, cx, A4_H - 38, 22, t.acentoSuave, 0.25);
    this.fuente("normal", 10, cremaSuave);
    doc.text(this.fecha, cx, A4_H - 31, { align: "center" });
    this.versalitas(o.cierre ?? "El Mapa", cx, A4_H - 20, 8, t.acentoSuave, "center");

    this.pagina = 1;
  }

  /* ── Bloques de contenido ───────────────────────────────────────────── */

  /**
   * Abre capítulo. Panel con tinte suave, numeral, barra de acento y filete.
   * A partir de aquí, el numeral fantasma de las páginas es el de este capítulo.
   */
  capitulo(titulo: string, subtitulo?: string): void {
    const doc = this.doc;
    const t = this.tema;
    this.capituloNum++;
    this.reservar(subtitulo ? 46 : 36);
    this.y += 6;

    const alto = 15;
    const arriba = this.y - 8.5;
    conAlfa(doc, t.oscuro ? 0.16 : 0.075, () => {
      doc.setFillColor(...t.acento);
      doc.roundedRect(MARGEN, arriba, ANCHO, alto, 2.6, 2.6, "F");
    });
    doc.setFillColor(...t.acento);
    doc.roundedRect(MARGEN, arriba, 2.2, alto, 1.1, 1.1, "F");

    this.fuente("bold", 9.5, t.acento);
    doc.text(String(this.capituloNum).padStart(2, "0"), MARGEN + 7.5, this.y);
    this.fuente("bold", 16, t.tinta);
    doc.text(titulo, MARGEN + 17, this.y);

    this.y = arriba + alto + 7;
    if (subtitulo) {
      this.fuente("italic", 10.5, t.tintaSuave);
      const l = doc.splitTextToSize(subtitulo, ANCHO) as string[];
      l.forEach((x) => { this.reservar(6); doc.text(x, MARGEN, this.y); this.y += 5.4; });
      this.y += 3;
    }
  }

  /** Antetítulo de bloque: versalitas + filete corto. */
  antetitulo(texto: string): void {
    this.reservar(14);
    this.versalitas(texto, MARGEN, this.y, 8, this.tema.acento);
    this.y += 2.6;
    this.doc.setDrawColor(...this.tema.acento);
    this.doc.setLineWidth(0.35);
    this.doc.line(MARGEN, this.y, MARGEN + 18, this.y);
    this.y += 6.5;
  }

  parrafo(
    texto: string,
    o?: { cursiva?: boolean; tam?: number; color?: RGB; ancho?: number; x?: number; capitular?: boolean },
  ): void {
    const doc = this.doc;
    const t = this.tema;
    const tam = o?.tam ?? 11;
    const salto = tam * 0.5;
    const x = o?.x ?? MARGEN;
    const ancho = o?.ancho ?? ANCHO;
    const color = o?.color ?? t.tinta;
    const limpio = (texto || "").trim();
    if (!limpio) return;

    if (o?.capitular && limpio.length > 3) {
      // Capitular de dos líneas: la letra inicial grande, en el acento, con el
      // texto abrazándola. Es el detalle que convierte una página en una página
      // de libro.
      const letra = limpio[0];
      const resto = limpio.slice(1);
      const tamCap = tam * 4.1;
      this.fuente("bold", tamCap, t.acento);
      const anchoCap = doc.getTextWidth(letra) + 2.6;

      this.fuente(o.cursiva ? "italic" : "normal", tam, color);
      const estrechas = doc.splitTextToSize(resto, ancho - anchoCap) as string[];
      // Con menos de tres líneas la capitular queda colgando de un párrafo que
      // no la sostiene: se cae sola y se compone en redonda.
      if (estrechas.length < 3) {
        this.parrafo(limpio, { ...o, capitular: false });
        return;
      }
      const primeras = estrechas.slice(0, 2);
      const sobra = estrechas.slice(2).join(" ").trim();

      this.reservar(salto * 2 + 6);
      const yBase = this.y;
      this.fuente("bold", tamCap, t.acento);
      doc.text(letra, x, yBase + salto);
      this.fuente(o.cursiva ? "italic" : "normal", tam, color);
      primeras.forEach((l, i) => doc.text(l, x + anchoCap, yBase + i * salto));
      this.y = yBase + primeras.length * salto;

      if (sobra) this.parrafo(sobra, { ...o, capitular: false });
      else this.y += 2.4;
      return;
    }

    this.fuente(o?.cursiva ? "italic" : "normal", tam, color);
    const lineas = doc.splitTextToSize(limpio, ancho) as string[];
    for (const l of lineas) {
      this.reservar(salto + 1);
      this.fuente(o?.cursiva ? "italic" : "normal", tam, color);
      doc.text(l, x, this.y);
      this.y += salto;
    }
    this.y += 2.4;
  }

  /** Lista con viñeta de rombo. */
  lista(items: string[], o?: { tam?: number; color?: RGB }): void {
    const doc = this.doc;
    const t = this.tema;
    const tam = o?.tam ?? 11;
    const salto = tam * 0.52;
    for (const it of items) {
      const texto = (it || "").trim();
      if (!texto) continue;
      this.fuente("normal", tam, o?.color ?? t.tinta);
      const lineas = doc.splitTextToSize(texto, ANCHO - 9) as string[];
      this.reservar(lineas.length * salto + 2.5);
      doc.setFillColor(...t.acento);
      const yv = this.y - 1.4;
      doc.triangle(MARGEN + 1.6, yv - 1.15, MARGEN + 2.75, yv, MARGEN + 1.6, yv + 1.15, "F");
      doc.triangle(MARGEN + 1.6, yv - 1.15, MARGEN + 0.45, yv, MARGEN + 1.6, yv + 1.15, "F");
      this.fuente("normal", tam, o?.color ?? t.tinta);
      lineas.forEach((l, i) => doc.text(l, MARGEN + 9, this.y + i * salto));
      this.y += lineas.length * salto + 2.2;
    }
    this.y += 1.5;
  }

  /**
   * Lista en dos columnas: para inventarios largos (alimentos, hierbas) que en
   * una sola columna dejan media página vacía a la derecha.
   */
  listaDoble(items: string[], o?: { tam?: number }): void {
    const doc = this.doc;
    const t = this.tema;
    const tam = o?.tam ?? 10;
    const salto = tam * 0.52;
    const colW = (ANCHO - 8) / 2;
    const limpios = items.map((i) => (i || "").trim()).filter(Boolean);
    // Si algún elemento es largo, no merece la pena partir en columnas.
    this.fuente("normal", tam, t.tinta);
    const cabeLargo = limpios.every((i) => doc.getTextWidth(i) < colW - 9);
    if (!cabeLargo) { this.lista(limpios, { tam }); return; }

    for (let i = 0; i < limpios.length; i += 2) {
      this.reservar(salto + 3);
      const yv = this.y - 1.3;
      for (let col = 0; col < 2; col++) {
        const texto = limpios[i + col];
        if (!texto) continue;
        const x = MARGEN + col * (colW + 8);
        doc.setFillColor(...t.acento);
        doc.triangle(x + 1.6, yv - 1.05, x + 2.6, yv, x + 1.6, yv + 1.05, "F");
        doc.triangle(x + 1.6, yv - 1.05, x + 0.6, yv, x + 1.6, yv + 1.05, "F");
        this.fuente("normal", tam, t.tinta);
        doc.text(texto, x + 7, this.y);
      }
      this.y += salto + 1.6;
    }
    this.y += 2;
  }

  /**
   * Glosario: entradas del tipo «Ashwagandha · adaptógeno que calma…».
   * El texto de la app ya viene con ese punto medio separando el nombre de la
   * explicación, así que aquí se aprovecha para componerlo como un diccionario:
   * el nombre en negrita, la explicación en redonda y sangría francesa.
   */
  glosario(items: string[], o?: { tam?: number }): void {
    const doc = this.doc;
    const t = this.tema;
    const tam = o?.tam ?? 10.2;
    const salto = tam * 0.52;
    const limpios = items.map((i) => (i || "").trim()).filter(Boolean);

    limpios.forEach((item, idx) => {
      const corte = item.indexOf("·");
      const lead = corte > 0 ? item.slice(0, corte).trim() : item;
      const resto = corte > 0 ? item.slice(corte + 1).trim() : "";

      this.fuente("bold", tam, t.tinta);
      const anchoLead = doc.getTextWidth(lead);
      // Si el nombre ocupa más de media línea, no hay sangría francesa que valga.
      const enLinea = anchoLead < ANCHO - 46 && !!resto;
      const sangria = 6;

      if (enLinea) {
        this.fuente("normal", tam, t.tintaSuave);
        const primera = doc.splitTextToSize(resto, ANCHO - sangria - anchoLead - 3) as string[];
        const sobra = primera.slice(1).join(" ");
        const lineas = sobra ? (doc.splitTextToSize(sobra, ANCHO - sangria) as string[]) : [];
        this.reservar((lineas.length + 1) * salto + 5);

        const yPrimera = this.y;
        this.fuente("bold", tam, t.tinta);
        doc.text(lead, MARGEN + sangria, this.y);
        this.fuente("normal", tam, t.tintaSuave);
        doc.text(`· ${primera[0] ?? ""}`, MARGEN + sangria + anchoLead + 2, this.y);
        this.y += salto;
        lineas.forEach((l) => { doc.text(l, MARGEN + sangria, this.y); this.y += salto; });
        doc.setFillColor(...t.acento);
        doc.circle(MARGEN + 1.6, yPrimera - 1.2, 0.85, "F");
      } else {
        this.fuente("bold", tam, t.tinta);
        const lb = doc.splitTextToSize(lead, ANCHO - sangria) as string[];
        this.fuente("normal", tam, t.tintaSuave);
        const lr = resto ? (doc.splitTextToSize(resto, ANCHO - sangria) as string[]) : [];
        this.reservar((lb.length + lr.length) * salto + 5);
        const yPrimera = this.y;
        this.fuente("bold", tam, t.tinta);
        lb.forEach((l) => { doc.text(l, MARGEN + sangria, this.y); this.y += salto; });
        this.fuente("normal", tam, t.tintaSuave);
        lr.forEach((l) => { doc.text(l, MARGEN + sangria, this.y); this.y += salto; });
        doc.setFillColor(...t.acento);
        doc.circle(MARGEN + 1.6, yPrimera - 1.2, 0.85, "F");
      }

      // Filete finísimo entre entradas: el aire de un diccionario.
      if (idx < limpios.length - 1) {
        this.y += 1.6;
        conAlfa(doc, 0.5, () => {
          doc.setDrawColor(...t.trama);
          doc.setLineWidth(0.15);
          doc.line(MARGEN + 6, this.y, A4_W - MARGEN, this.y);
        });
        this.y += 3.4;
      } else {
        this.y += 3;
      }
    });
    this.y += 2;
  }

  /**
   * Tarjeta: tinte suavísimo, barra de acento a la izquierda y esquinas
   * redondeadas. Es el envase de todo lo que la persona escribió.
   */
  tarjeta(o: { titulo?: string; cuerpo?: string; extra?: string; cursivaCuerpo?: boolean }): void {
    const doc = this.doc;
    const t = this.tema;
    const innerW = ANCHO - 17;
    const medir = (txt: string | undefined, estilo: "bold" | "italic" | "normal", tam: number) => {
      if (!txt || !txt.trim()) return [] as string[];
      this.fuente(estilo, tam, t.tinta);
      return doc.splitTextToSize(txt.trim(), innerW) as string[];
    };
    const lt = medir(o.titulo, "bold", 12.5);
    const lc = medir(o.cuerpo, o.cursivaCuerpo === false ? "normal" : "italic", 11);
    const le = medir(o.extra, "normal", 9.5);
    if (!lt.length && !lc.length && !le.length) return;

    const altoTexto = lt.length * 6 + lc.length * 5.6 + (le.length ? 3 + le.length * 4.8 : 0);
    const alto = altoTexto + 11;
    this.reservar(alto + 5);

    const arriba = this.y - 3.5;
    conAlfa(doc, t.oscuro ? 0.13 : 0.05, () => {
      doc.setFillColor(...t.acento);
      doc.roundedRect(MARGEN, arriba, ANCHO, alto, 2.8, 2.8, "F");
    });
    conAlfa(doc, t.oscuro ? 0.5 : 0.35, () => {
      doc.setDrawColor(...t.acento);
      doc.setLineWidth(0.2);
      doc.roundedRect(MARGEN, arriba, ANCHO, alto, 2.8, 2.8, "S");
    });
    doc.setFillColor(...t.acento);
    doc.roundedRect(MARGEN, arriba, 2.1, alto, 1.05, 1.05, "F");

    let yy = arriba + 8.5;
    if (lt.length) {
      this.fuente("bold", 12.5, t.tinta);
      lt.forEach((l) => { doc.text(l, MARGEN + 9.5, yy); yy += 6; });
    }
    if (lc.length) {
      this.fuente(o.cursivaCuerpo === false ? "normal" : "italic", 11, t.tintaSuave);
      lc.forEach((l) => { doc.text(l, MARGEN + 9.5, yy); yy += 5.6; });
    }
    if (le.length) {
      yy += 3;
      this.fuente("normal", 9.5, t.acento);
      le.forEach((l) => { doc.text(l, MARGEN + 9.5, yy); yy += 4.8; });
    }
    this.y = arriba + alto + 6;
  }

  /** Pregunta en versalitas + respuesta en cursiva con filete lateral. */
  preguntaRespuesta(pregunta: string, respuesta: string): void {
    const doc = this.doc;
    const t = this.tema;
    const resp = (respuesta || "").trim();
    if (!resp) return;

    this.fuente("bold", 9.2, t.acento);
    doc.setCharSpace(1.1);
    const lp = doc.splitTextToSize(pregunta.toUpperCase(), ANCHO - 6) as string[];
    doc.setCharSpace(0);
    this.fuente("italic", 11.5, t.tinta);
    const lr = doc.splitTextToSize(resp, ANCHO - 9) as string[];

    this.reservar(lp.length * 4.8 + lr.length * 5.8 + 9);
    const arriba = this.y - 3;
    this.fuente("bold", 9.2, t.acento);
    doc.setCharSpace(1.1);
    lp.forEach((l) => { doc.text(l, MARGEN + 8, this.y); this.y += 4.8; });
    doc.setCharSpace(0);
    this.y += 1.6;
    this.fuente("italic", 11.5, t.tinta);
    lr.forEach((l) => { doc.text(l, MARGEN + 8, this.y); this.y += 5.8; });

    doc.setDrawColor(...t.acento);
    doc.setLineWidth(0.9);
    doc.line(MARGEN + 1.6, arriba, MARGEN + 1.6, this.y - 4.2);
    this.y += 5;
  }

  /** Fila «etiqueta — valor» con barra proporcional. El lenguaje de la web. */
  filaBarra(o: {
    etiqueta: string;
    coletilla?: string;
    valor: string;
    fraccion: number;
    color?: RGB;
  }): void {
    const doc = this.doc;
    const t = this.tema;
    this.reservar(13);
    const color = o.color ?? t.acento;
    this.fuente("bold", 11.5, color);
    doc.text(o.etiqueta, MARGEN, this.y);
    if (o.coletilla) {
      const w = doc.getTextWidth(o.etiqueta);
      this.fuente("italic", 9.2, t.apagado);
      doc.text(o.coletilla, MARGEN + w + 4, this.y);
    }
    this.fuente("bold", 10.5, t.tinta);
    doc.text(o.valor, A4_W - MARGEN, this.y, { align: "right" });
    this.y += 3.2;
    barra(doc, MARGEN, this.y, ANCHO, 1.9, o.fraccion, color, t.trama);
    this.y += 9;
  }

  /** Separador de aire: rombo entre dos filetes. */
  divisor(): void {
    this.reservar(14);
    this.y += 5;
    divisorRombo(this.doc, A4_W / 2, this.y, 40, this.tema.acentoSuave);
    this.y += 10;
  }

  /**
   * Lámina: reserva un hueco de `alto` mm, lo enmarca con un filete finísimo y
   * llama a `dibujar` con el centro. Para los gráficos.
   */
  lamina(alto: number, dibujar: (doc: jsPDF, cx: number, cy: number, ancho: number) => void, pie?: string): void {
    this.reservar(alto + (pie ? 14 : 6));
    const arriba = this.y;
    const t = this.tema;
    conAlfa(this.doc, t.oscuro ? 0.1 : 0.04, () => {
      this.doc.setFillColor(...t.acento);
      this.doc.roundedRect(MARGEN, arriba, ANCHO, alto, 3, 3, "F");
    });
    dibujar(this.doc, A4_W / 2, arriba + alto / 2, ANCHO - 16);
    this.y = arriba + alto + 5;
    if (pie) {
      this.fuente("italic", 9.2, this.tema.apagado);
      const l = this.doc.splitTextToSize(pie, ANCHO - 24) as string[];
      l.forEach((x) => { this.doc.text(x, A4_W / 2, this.y, { align: "center" }); this.y += 4.8; });
      this.y += 3;
    }
  }

  /** Frase de cierre, centrada y en cursiva, con su rombo encima. */
  cierre(texto: string): void {
    this.reservar(34);
    this.y += 6;
    divisorRombo(this.doc, A4_W / 2, this.y, 40, this.tema.acentoSuave);
    this.y += 11;
    this.fuente("italic", 11.5, this.tema.tintaSuave);
    const l = this.doc.splitTextToSize(texto, ANCHO - 26) as string[];
    l.forEach((x) => { this.doc.text(x, A4_W / 2, this.y, { align: "center" }); this.y += 6; });
  }

  /* ── Salida ─────────────────────────────────────────────────────────── */

  guardar(nombre: string): void { this.doc.save(nombre); }
  blob(): Blob { return this.doc.output("blob"); }
}
