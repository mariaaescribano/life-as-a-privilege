import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../GlobalVariables";
import type { Curso, ModalidadInfo } from "../hardCoded/cursos";
import type { Ejercicio, ModuloContenido, Submodulo } from "../dtos/aprendizaje.type";
import { DISCIPLINAS_CURSO, disciplinaCursoBySlug, type DisciplinaCurso } from "./disciplinasCurso";
import { useIdioma } from "../i18n";
import { IDIOMA_ORIGINAL, type Idioma } from "../i18n/idiomas";
import { cargarCatalogoEn, cargarLeccionEn, type CatalogoEn, type LeccionTraducida } from "../i18n/cursos";

// Todos los cursos de pago valen lo mismo (de_pago = checkbox en el admin).
export const PRECIO_CURSO = 5;

// ── Formas que llegan del API (tabla `curso`) ──
export interface LeccionApi { id: string; nom: string; tipo: "texto" | "video" | "test"; contenido?: string; video?: string; ejercicios?: Ejercicio[]; }
export interface ModuloApi { title: string; submodules: LeccionApi[]; }
export interface CursoApi {
  id: string;
  modalidad: string;
  titulo: string;
  foto: string;
  descripcion: string;
  descripcion_contenido?: string;
  de_pago: boolean;
  publicado: boolean;
  orden: number;
  contenido: ModuloApi[];
  created_at?: string;
}

/** Títulos traducidos de un curso (o nada, si se está en español o falta la traducción). */
type Traduccion = CatalogoEn[string] | undefined;

function buildSubmodulo(
  modalidad: string,
  cursoId: string,
  det: Submodulo["detalles"],
  l: LeccionApi,
  trad: Traduccion,
): Submodulo {
  return {
    id: l.id,
    cursoId,
    nom: trad?.lecciones[l.id] || l.nom,
    link: `/aprendizaje/leccion/${modalidad}/${cursoId}/${l.id}`,
    descripcion: "",
    video: l.video ?? "",
    letra: null,
    detalles: det,
    linkAnterior: "",
    linkNext: "",
    icon: null,
    tipo: l.tipo,
    contenido: l.contenido,
    ejercicios: l.ejercicios,
  };
}

function buildCurso(row: CursoApi, disc: DisciplinaCurso, trad: Traduccion): Curso {
  const det = { color: disc.color, bgColor: disc.bg, icon: disc.Icon };
  const modulos: ModuloContenido[] = (row.contenido ?? []).map((m, i) => ({
    title: trad?.modulos[i] || m.title,
    icon: disc.Icon,
    submodules: (m.submodules ?? []).map((l) => buildSubmodulo(row.modalidad, row.id, det, l, trad)),
  }));
  const numLecciones = modulos.reduce((a, m) => a + m.submodules.length, 0);
  return {
    id: row.id,
    titulo: trad?.titulo || row.titulo,
    foto: row.foto,
    descripcion: trad?.descripcion || row.descripcion,
    descripcionContenido: trad?.descripcionContenido || row.descripcion_contenido || "",
    precio: row.de_pago ? PRECIO_CURSO : null,
    numLecciones,
    icon: <disc.Icon size={{ base: "40px", md: "48px" }} />,
    cursoLink: `/aprendizaje/modulosPage/${row.modalidad}/${row.id}`,
    modulos,
    createdAt: row.created_at,
  };
}

/**
 * Construye el `cursosData` (Record<slug, ModalidadInfo>) a partir de las filas
 * del API. Si se pasa un catálogo traducido, los títulos salen en ese idioma y
 * lo que no esté traducido se queda en español.
 */
export function buildCursosData(rows: CursoApi[], catalogo?: CatalogoEn): Record<string, ModalidadInfo> {
  const out: Record<string, ModalidadInfo> = {};
  for (const row of rows) {
    const disc = disciplinaCursoBySlug(row.modalidad);
    if (!disc) continue;
    if (!out[disc.slug]) {
      out[disc.slug] = {
        nom: disc.nom,
        bgColor: disc.bg,
        color: disc.color,
        icon: <disc.Icon size={{ base: "40px", md: "50px" }} />,
        cursos: [],
      };
    }
    out[disc.slug].cursos.push(buildCurso(row, disc, catalogo?.[row.id]));
  }
  return out;
}

// ── Caché a nivel de módulo: las filas se traen una vez por sesión, y el
//    cursosData se guarda por idioma (los títulos cambian, las filas no) ──
let filasCache: CursoApi[] | null = null;
const cachePorIdioma: Partial<Record<Idioma, Record<string, ModalidadInfo>>> = {};
const inflightPorIdioma: Partial<Record<Idioma, Promise<Record<string, ModalidadInfo>>>> = {};

async function traerFilas(force: boolean): Promise<CursoApi[]> {
  if (filasCache && !force) return filasCache;
  const r = await axios.get<CursoApi[]>(`${API_URL}/cursos`);
  filasCache = r.data ?? [];
  return filasCache;
}

export async function fetchCursosData(
  idioma: Idioma = IDIOMA_ORIGINAL,
  force = false,
): Promise<Record<string, ModalidadInfo>> {
  const cache = cachePorIdioma[idioma];
  if (cache && !force) return cache;
  const enCurso = inflightPorIdioma[idioma];
  if (enCurso && !force) return enCurso;

  const promesa = (async () => {
    const [filas, catalogo] = await Promise.all([
      traerFilas(force),
      idioma === IDIOMA_ORIGINAL ? Promise.resolve(undefined) : cargarCatalogoEn(),
    ]);
    const datos = buildCursosData(filas, catalogo);
    cachePorIdioma[idioma] = datos;
    return datos;
  })()
    .catch((e) => {
      console.warn("[cursosApi] error:", e?.message ?? e);
      return cachePorIdioma[idioma] ?? {};
    })
    .finally(() => { delete inflightPorIdioma[idioma]; });

  inflightPorIdioma[idioma] = promesa;
  return promesa;
}

/** Hook para la web pública: devuelve el cursosData (ya transformado) y un flag de carga. */
export function useCursosData() {
  const { idioma } = useIdioma();
  const [cursosData, setCursosData] = useState<Record<string, ModalidadInfo>>(cachePorIdioma[idioma] ?? {});
  const [loading, setLoading] = useState(!cachePorIdioma[idioma]);
  useEffect(() => {
    let alive = true;
    // Al cambiar de idioma volvemos a "cargando" solo si no lo teníamos ya.
    if (!cachePorIdioma[idioma]) setLoading(true);
    else setCursosData(cachePorIdioma[idioma]!);
    fetchCursosData(idioma).then((d) => {
      if (alive) { setCursosData(d); setLoading(false); }
    });
    return () => { alive = false; };
  }, [idioma]);
  return { cursosData, loading };
}

/**
 * Cuerpo de una lección en el idioma activo. Devuelve `null` mientras carga, en
 * español, o si esa lección todavía no está traducida — en todos esos casos la
 * página se queda con el contenido que vino del API.
 */
export function useLeccionTraducida(cursoId?: string, leccionId?: string): LeccionTraducida | null {
  const { idioma } = useIdioma();
  const [leccion, setLeccion] = useState<LeccionTraducida | null>(null);
  useEffect(() => {
    if (idioma === IDIOMA_ORIGINAL || !cursoId || !leccionId) { setLeccion(null); return; }
    let alive = true;
    setLeccion(null);
    cargarLeccionEn(cursoId, leccionId).then((l) => { if (alive) setLeccion(l); });
    return () => { alive = false; };
  }, [idioma, cursoId, leccionId]);
  return leccion;
}

// Para uso fuera de React (no usado de momento).
export { DISCIPLINAS_CURSO };
