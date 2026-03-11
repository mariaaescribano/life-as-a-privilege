import type { ReactNode } from "react";
import type { ModuloContenido } from "../../dtos/aprendizaje.type";

export interface Curso {
  id: string;
  titulo: string;
  foto: string;
  descripcion: string;
  precio: number | null; // null = gratis
  numLecciones: number;
  icon: ReactNode;
  cursoLink : string;
  modulos?: ModuloContenido[];
}

export interface ModalidadInfo {
  nom: string;
  bgColor: string;
  color: string;
  icon: ReactNode;
  cursos: Curso[];
}
