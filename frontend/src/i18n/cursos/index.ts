import type { Ejercicio } from "../../dtos/aprendizaje.type";

/**
 * Traducción al inglés de los cursos (ver README.md de esta carpeta).
 *
 * El catálogo (títulos) se carga entero; el cuerpo de las lecciones, solo el
 * del curso que se abre. Lo que no esté traducido cae al español del API.
 */

export interface LeccionTraducida {
  id: string;
  nom: string;
  tipo?: "texto" | "video" | "test";
  contenido?: string;
  video?: string;
  ejercicios?: Ejercicio[];
}

export interface ModuloTraducido {
  title: string;
  submodules: LeccionTraducida[];
}

export interface CursoTraducido {
  id: string;
  modalidad: string;
  titulo: string;
  descripcion: string;
  descripcion_contenido?: string;
  contenido: ModuloTraducido[];
}

/** Lo justo para pintar el catálogo y el índice de módulos sin cargar el cuerpo. */
export interface EntradaCatalogo {
  /** Nombre del fichero dentro de `en/`, para poder cargar el curso entero. */
  fichero: string;
  titulo: string;
  descripcion: string;
  descripcionContenido: string;
  /** Títulos de los módulos, en el mismo orden que en la BD. */
  modulos: string[];
  /** Nombre de cada lección, por su id. */
  lecciones: Record<string, string>;
}

export type CatalogoEn = Record<string, EntradaCatalogo>;

// Vite crea un chunk por curso; solo se descarga el que se pide.
const CURSOS_EN = import.meta.glob<{ default: CursoTraducido }>("./en/*.json");

let catalogo: CatalogoEn | null = null;
let catalogoEnCurso: Promise<CatalogoEn> | null = null;

/** Catálogo en inglés (títulos). Se carga una vez por sesión. */
export function cargarCatalogoEn(): Promise<CatalogoEn> {
  if (catalogo) return Promise.resolve(catalogo);
  if (!catalogoEnCurso) {
    catalogoEnCurso = import("./catalogo-en.json")
      .then((m) => {
        catalogo = (m.default ?? {}) as CatalogoEn;
        return catalogo;
      })
      .catch((e) => {
        console.warn("[i18n/cursos] no se pudo cargar el catálogo en inglés:", e?.message ?? e);
        catalogo = {};
        return catalogo;
      });
  }
  return catalogoEnCurso;
}

const cursosCargados = new Map<string, CursoTraducido | null>();

/**
 * Curso entero en inglés (con el cuerpo de las lecciones), o `null` si no está
 * traducido. Se descarga la primera vez que se pide.
 */
export async function cargarCursoEn(cursoId: string): Promise<CursoTraducido | null> {
  if (cursosCargados.has(cursoId)) return cursosCargados.get(cursoId) ?? null;

  const cat = await cargarCatalogoEn();
  const entrada = cat[cursoId];
  const cargador = entrada ? CURSOS_EN[`./en/${entrada.fichero}`] : undefined;
  if (!cargador) {
    cursosCargados.set(cursoId, null);
    return null;
  }
  try {
    const mod = await cargador();
    const curso = (mod.default ?? null) as CursoTraducido | null;
    cursosCargados.set(cursoId, curso);
    return curso;
  } catch (e) {
    console.warn(`[i18n/cursos] error cargando «${entrada!.fichero}»:`, (e as Error)?.message ?? e);
    cursosCargados.set(cursoId, null);
    return null;
  }
}

/** La lección `leccionId` del curso, en inglés, o `null` si no está traducida. */
export async function cargarLeccionEn(
  cursoId: string,
  leccionId: string,
): Promise<LeccionTraducida | null> {
  const curso = await cargarCursoEn(cursoId);
  if (!curso) return null;
  for (const modulo of curso.contenido ?? []) {
    const leccion = (modulo.submodules ?? []).find((l) => l.id === leccionId);
    if (leccion) return leccion;
  }
  return null;
}
