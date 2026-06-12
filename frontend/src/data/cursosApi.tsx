import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../GlobalVariables";
import type { Curso, ModalidadInfo } from "../hardCoded/cursos";
import type { ModuloContenido, Submodulo } from "../dtos/aprendizaje.type";
import { DISCIPLINAS_CURSO, disciplinaCursoBySlug, type DisciplinaCurso } from "./disciplinasCurso";

// Todos los cursos de pago valen lo mismo (de_pago = checkbox en el admin).
export const PRECIO_CURSO = 5;

// ── Formas que llegan del API (tabla `curso`) ──
export interface LeccionApi { id: string; nom: string; tipo: "texto" | "video"; contenido?: string; video?: string; }
export interface ModuloApi { title: string; submodules: LeccionApi[]; }
export interface CursoApi {
  id: string;
  modalidad: string;
  titulo: string;
  foto: string;
  descripcion: string;
  de_pago: boolean;
  publicado: boolean;
  orden: number;
  contenido: ModuloApi[];
}

function buildSubmodulo(modalidad: string, cursoId: string, det: Submodulo["detalles"], l: LeccionApi): Submodulo {
  return {
    id: l.id,
    cursoId,
    nom: l.nom,
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
  };
}

function buildCurso(row: CursoApi, disc: DisciplinaCurso): Curso {
  const det = { color: disc.color, bgColor: disc.bg, icon: disc.Icon };
  const modulos: ModuloContenido[] = (row.contenido ?? []).map((m) => ({
    title: m.title,
    icon: disc.Icon,
    submodules: (m.submodules ?? []).map((l) => buildSubmodulo(row.modalidad, row.id, det, l)),
  }));
  const numLecciones = modulos.reduce((a, m) => a + m.submodules.length, 0);
  return {
    id: row.id,
    titulo: row.titulo,
    foto: row.foto,
    descripcion: row.descripcion,
    precio: row.de_pago ? PRECIO_CURSO : null,
    numLecciones,
    icon: <disc.Icon size={{ base: "40px", md: "48px" }} />,
    cursoLink: `/aprendizaje/modulosPage/${row.modalidad}/${row.id}`,
    modulos,
  };
}

/** Construye el `cursosData` (Record<slug, ModalidadInfo>) a partir de las filas del API. */
export function buildCursosData(rows: CursoApi[]): Record<string, ModalidadInfo> {
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
    out[disc.slug].cursos.push(buildCurso(row, disc));
  }
  return out;
}

// ── Caché a nivel de módulo: se trae una vez por sesión ──
let cache: Record<string, ModalidadInfo> | null = null;
let inflight: Promise<Record<string, ModalidadInfo>> | null = null;

export async function fetchCursosData(force = false): Promise<Record<string, ModalidadInfo>> {
  if (cache && !force) return cache;
  if (inflight && !force) return inflight;
  inflight = axios
    .get<CursoApi[]>(`${API_URL}/cursos`)
    .then((r) => {
      cache = buildCursosData(r.data ?? []);
      inflight = null;
      return cache;
    })
    .catch((e) => {
      console.warn("[cursosApi] error:", e?.message ?? e);
      inflight = null;
      return cache ?? {};
    });
  return inflight;
}

/** Hook para la web pública: devuelve el cursosData (ya transformado) y un flag de carga. */
export function useCursosData() {
  const [cursosData, setCursosData] = useState<Record<string, ModalidadInfo>>(cache ?? {});
  const [loading, setLoading] = useState(!cache);
  useEffect(() => {
    let alive = true;
    fetchCursosData().then((d) => {
      if (alive) { setCursosData(d); setLoading(false); }
    });
    return () => { alive = false; };
  }, []);
  return { cursosData, loading };
}

// Para uso fuera de React (no usado de momento).
export { DISCIPLINAS_CURSO };
