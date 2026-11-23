// ─────────────────────────────────────────────────────────────────────────
// LOS INFORMES DE /admin/informes — los documentos que María escribe a mano para sus clientes.
//
// Es el mismo taller de PDF que usan las ocho disciplinas, en «modo informe» (ver `informe` en
// TallerOpts, atelier.ts): la foto de la disciplina llena TODA la hoja (si es horizontal se gira para
// ponerla en vertical), sin cajas encima; la cabecera lleva el mandala y MARÍA ESCRIBANO a la izquierda y
// el icono con la disciplina a la derecha. TODA la letra es el Txt de la disciplina (el de la web).
// Cambiar de disciplina cambia la foto, el color de la letra y el icono; el texto se recompone solo.
//
// Mini-formato del texto (una marca por línea, párrafos separados por una línea en blanco):
//   # Título de sección      ## Antetítulo en versalitas      - elemento de lista
//   --- raya                 > frase de cierre (centrada, en cursiva)
//   === salto de página (empieza una hoja nueva)
// Dentro de un párrafo valen **negrita** y *cursiva*, y se respetan los saltos de línea. Los símbolos
// de los planetas (☉ ☽ ☿ ♀ ♆ ♅…) y los emoji se pintan como imagen en su sitio (ver pdf/glifosTexto.ts).
//
// OJO al importarlo: arrastra jsPDF y la tipografía. La pantalla lo carga con `await import(...)`.
// ─────────────────────────────────────────────────────────────────────────
import { Taller } from "./pdf/atelier";
import {
  astrologiaTxt, neuropsicologiaTxt, ayurvedaTxt, tcmTxt, fisiologiaTxt, nutricionTxt, cabalaTxt, culturaTxt,
} from "../GlobalVariables";
import {
  TEMA_ASTROLOGIA,
  TEMA_AYURVEDA,
  TEMA_CABALA,
  TEMA_CULTURA,
  TEMA_FISIOLOGIA,
  TEMA_NUTRICION,
  TEMA_PSICOLOGIA,
  TEMA_TCM,
  type Tema,
} from "./pdf/temas";

export interface DisciplinaInforme {
  clave: string;
  /** El color de letra de la disciplina (Txt de la web), en hexadecimal. */
  txt: string;
  /** El nombre que se lee en la cabecera y en el botón. */
  nombre: string;
  tema: Tema;
  /** La foto que queda de fondo en todas las páginas. */
  fondo: string;
}

export const DISCIPLINAS_INFORME: DisciplinaInforme[] = [
  { clave: "astrologia", txt: astrologiaTxt, nombre: "Astrología", tema: TEMA_ASTROLOGIA, fondo: "/img/astrologia/space.webp" },
  { clave: "psicologia", txt: neuropsicologiaTxt, nombre: "Psicología", tema: TEMA_PSICOLOGIA, fondo: TEMA_PSICOLOGIA.acuarela },
  { clave: "ayurveda", txt: ayurvedaTxt, nombre: "Ayurveda", tema: TEMA_AYURVEDA, fondo: TEMA_AYURVEDA.acuarela },
  { clave: "tcm", txt: tcmTxt, nombre: "Medicina China", tema: TEMA_TCM, fondo: TEMA_TCM.acuarela },
  { clave: "fisiologia", txt: fisiologiaTxt, nombre: "Fisiología", tema: TEMA_FISIOLOGIA, fondo: TEMA_FISIOLOGIA.acuarela },
  { clave: "nutricion", txt: nutricionTxt, nombre: "Nutrición", tema: TEMA_NUTRICION, fondo: TEMA_NUTRICION.acuarela },
  { clave: "cabala", txt: cabalaTxt, nombre: "Cábala", tema: TEMA_CABALA, fondo: TEMA_CABALA.acuarela },
  { clave: "cultura", txt: culturaTxt, nombre: "Cultura", tema: TEMA_CULTURA, fondo: TEMA_CULTURA.acuarela },
];

export interface InformeDatos {
  /** La `clave` de la disciplina elegida. */
  disciplina: string;
  titulo: string;
  /** Nombre de la persona a quien va dirigido (opcional). */
  para?: string;
  /** true = sin título ni «Para X · fecha»: el texto arranca directamente bajo la cabecera. */
  sinTitulo?: boolean;
  /** El texto, con el mini-formato de arriba. */
  cuerpo: string;
  /** Una imagen (PNG en base64) justo bajo el título, sobre una tarjeta blanca (p. ej. la rueda de una carta). */
  imagen?: { data: string; w: number; h: number };
}

/** Quita las marcas de negrita y cursiva en mitad de la línea. */
const sinMarcas = (s: string) => s.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1").trim();

type Bloque =
  | { tipo: "h1" | "h2" | "p" | "cierre"; texto: string }
  | { tipo: "lista"; items: string[] }
  | { tipo: "raya" }
  | { tipo: "pagina" }
  /** Líneas en blanco de MÁS (a partir de la segunda seguida): aire extra entre dos párrafos. */
  | { tipo: "espacio"; lineas: number };

/** Parte el texto en bloques: la línea en blanco separa; las marcas del principio mandan. */
export function bloquesDeTexto(cuerpo: string): Bloque[] {
  const out: Bloque[] = [];
  let parrafo: string[] = [];
  let lista: string[] = [];
  // Los saltos de línea de María se respetan: una línea escrita debajo de otra queda debajo en el PDF.
  const cerrarParrafo = () => {
    // El párrafo conserva sus **negritas** y *cursivas*: las pinta `parrafoRico`.
    if (parrafo.length) out.push({ tipo: "p", texto: parrafo.join("\n") });
    parrafo = [];
  };
  let enBlanco = 0;
  const cerrarLista = () => {
    if (lista.length) out.push({ tipo: "lista", items: lista });
    lista = [];
  };
  for (const crudo of (cuerpo || "").replace(/\r/g, "").split("\n")) {
    const l = crudo.trim();
    if (!l) {
      cerrarParrafo(); cerrarLista();
      enBlanco++;
      if (enBlanco >= 2 && out.length) {
        const ult = out[out.length - 1];
        if (ult.tipo === "espacio") ult.lineas++;
        else out.push({ tipo: "espacio", lineas: 1 });
      }
      continue;
    }
    enBlanco = 0;
    if (/^={3,}$/.test(l)) { cerrarParrafo(); cerrarLista(); out.push({ tipo: "pagina" }); continue; }
    if (/^-{3,}$/.test(l)) { cerrarParrafo(); cerrarLista(); out.push({ tipo: "raya" }); continue; }
    if (l.startsWith("## ")) { cerrarParrafo(); cerrarLista(); out.push({ tipo: "h2", texto: sinMarcas(l.slice(3)) }); continue; }
    if (l.startsWith("# ")) { cerrarParrafo(); cerrarLista(); out.push({ tipo: "h1", texto: sinMarcas(l.slice(2)) }); continue; }
    if (l.startsWith("> ")) { cerrarParrafo(); cerrarLista(); out.push({ tipo: "cierre", texto: sinMarcas(l.slice(2)) }); continue; }
    if (/^[-•] /.test(l)) { cerrarParrafo(); lista.push(sinMarcas(l.slice(2))); continue; }
    cerrarLista();
    parrafo.push(l);
  }
  cerrarParrafo();
  cerrarLista();
  return out;
}

const hexARgb = (h: string): [number, number, number] => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];

/** El tema de la disciplina con TODA la tinta del color Txt (el papel original se queda para el icono). */
function temaInforme(d: DisciplinaInforme): Tema {
  const c = hexARgb(d.txt);
  return { ...d.tema, tinta: c, tintaSuave: c, apagado: c, acento: c, acentoSuave: c, trama: c };
}

// Los iconos de siempre de cada disciplina (los de GlobalVariables: los de la portada y el mapa), ya
// pintados en su color de letra en /img/correo/informe-icono-<clave>.png. Se cargan como imagen (no se
// renderizan aquí con React: así no dependen de nada del navegador). Si se cambia un icono o un color
// en GlobalVariables, hay que volver a generar esos PNG (los mismos sirven para los correos).
async function iconoPng(clave: string): Promise<string | null> {
  try {
    const img = await new Promise<HTMLImageElement | null>((resolve) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => resolve(null);
      i.src = `/img/correo/informe-icono-${clave}.png`;
    });
    if (!img) return null;
    const c = document.createElement("canvas");
    c.width = img.naturalWidth || 320; c.height = img.naturalHeight || 320;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    // El icono de Astrología va en el beige de la casa (como la letra se ve sobre el cielo), no en el crema casi blanco.
    if (clave === "astrologia") {
      ctx.globalCompositeOperation = "source-in";
      ctx.fillStyle = "#F0DCC0";
      ctx.fillRect(0, 0, c.width, c.height);
    }
    return c.toDataURL("image/png");
  } catch {
    return null;
  }
}

const slug = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/** Monta el PDF y lo devuelve como blob (para la vista previa, la descarga y el correo). */
export async function generarInforme(d: InformeDatos): Promise<{ blob: Blob; nombre: string }> {
  const disc = DISCIPLINAS_INFORME.find((x) => x.clave === d.disciplina) ?? DISCIPLINAS_INFORME[0];
  const titulo = d.titulo.trim() || "Informe";

  const taller = await Taller.abrir(temaInforme(disc), {
    titulo,
    fondo: disc.fondo,
    informe: { disciplina: disc.nombre, icono: (await iconoPng(disc.clave)) ?? undefined },
  });

  taller.nuevaPagina();
  if (!d.sinTitulo) taller.tituloInforme(titulo, d.para);
  if (d.imagen) taller.imagenTarjeta(d.imagen.data, d.imagen.w, d.imagen.h, 118);

  for (const b of bloquesDeTexto(d.cuerpo)) {
    switch (b.tipo) {
      case "h1": taller.encabezado(b.texto); break;
      case "h2": taller.antetitulo(b.texto); break;
      case "p": taller.parrafoRico(b.texto); break;
      case "lista": taller.lista(b.items); break;
      case "raya": taller.separador(); break;
      case "pagina": taller.nuevaPagina(); break;
      case "espacio": taller.espacio(5.5 * b.lineas); break;
      case "cierre": taller.cierre(b.texto); break;
    }
  }

  const fecha = new Date().toISOString().slice(0, 10);
  const nombre = `${slug(titulo) || "informe"}-${disc.clave}-${fecha}.pdf`;
  return { blob: taller.blob(), nombre };
}
