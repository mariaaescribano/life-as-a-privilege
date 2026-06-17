import type { ReactNode } from "react";
import type { ModuloContenido } from "../../dtos/aprendizaje.type";

export interface Curso {
  id: string;
  titulo: string;
  foto: string;
  descripcion: string;
  /** Frase que aparece bajo "Contenido del curso" (si está vacía, se usa `descripcion`). */
  descripcionContenido?: string;
  precio: number | null; // null = gratis
  numLecciones: number;
  icon: ReactNode;
  cursoLink : string;
  modulos?: ModuloContenido[];
  /** Fecha de creación (ISO). Se usa para ordenar los cursos más nuevos primero. */
  createdAt?: string;
}

export interface ModalidadInfo {
  nom: string;
  bgColor: string;
  color: string;
  icon: ReactNode;
  cursos: Curso[];
}
