import type { ReactNode } from "react";

export interface Curso {
  id: string;
  titulo: string;
  foto: string;
  descripcion: string;
  precio: number | null; // null = gratis
  numLecciones: number;
  icon: ReactNode;
}

export interface ModalidadInfo {
  moduloLink: string;
  nom: string;
  bgColor: string;
  color: string;
  icon: ReactNode;
  cursos: Curso[];
}
