// Un vídeo corto (short de YouTube) de la sección «Vídeos».
//
// No se aloja nada: el vídeo vive en YouTube y aquí solo se guarda el enlace,
// la portada que sube la admin y a qué disciplina pertenece (mismo slug que
// usan los cursos, para poder pintar su icono y su color).
export interface VideoDB {
  id: string;
  disciplina: string;  // slug de la disciplina (el mismo de `curso.modalidad`)
  titulo: string;
  portada: string;     // URL de la portada subida (o ruta a /img)
  url: string;         // enlace al short de YouTube
  publicado: boolean;
  orden: number;
  created_at?: string;
  updated_at?: string;
}

// Campos aceptados al crear/actualizar (todos opcionales en el PATCH).
export interface VideoInput {
  disciplina?: string;
  titulo?: string;
  portada?: string;
  url?: string;
  publicado?: boolean;
  orden?: number;
}
