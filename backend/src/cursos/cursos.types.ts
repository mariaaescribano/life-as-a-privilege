// Una lección = submódulo. De texto (Markdown), de vídeo (YouTube) o un test.
export interface LeccionDB {
  id: string;
  nom: string;
  tipo: 'texto' | 'video' | 'test';
  contenido?: string; // Markdown — para tipo 'texto' (y notas del vídeo)
  video?: string;     // enlace de YouTube tal cual se pegó (o el id suelto)
  ejercicios?: unknown[]; // para tipo 'test'
}

export interface ModuloDB {
  title: string;
  submodules: LeccionDB[];
}

export interface CursoDB {
  id: string;
  modalidad: string;   // slug de la disciplina (clave de cursosData en el front)
  titulo: string;
  foto: string;
  descripcion: string;
  descripcion_contenido?: string; // frase que aparece bajo "Contenido del curso"
  de_pago: boolean;
  publicado: boolean;
  completado: boolean;
  orden: number;
  contenido: ModuloDB[];
  created_at?: string;
  updated_at?: string;
  /** Check PERSONAL del admin: si ya lo ha revisado. No es una columna de
   *  `curso`, se calcula desde la tabla `curso_revisado` en listarTodos. */
  revisado?: boolean;
}

// Campos aceptados al crear/actualizar (todos opcionales en el PATCH).
export interface CursoInput {
  modalidad?: string;
  titulo?: string;
  foto?: string;
  descripcion?: string;
  descripcion_contenido?: string;
  de_pago?: boolean;
  publicado?: boolean;
  completado?: boolean;
  orden?: number;
  contenido?: ModuloDB[];
}
