
export type FloatingButtonConfig = {
  label: string;
  action: "route" | "espacio" | "espacio-auth" | "modal" | "astrologia-services";
  route?: string;
  modalTitle?: string;
  modalSubtitle?: string;
  emailSubject?: string;
};

export type Detalles = {
  color: string;
  icon: any;
  bgColor:string;
};

export type Submodulo = {
  id:string;
  cursoId: string;
  nom: string;
  link:string;
  descripcion: string;
  video: string;
  letra: string | null;
  detalles: Detalles;
  linkAnterior:string;
  linkNext:string;
  icon:any | null;
  floatingButton?: FloatingButtonConfig;
  /** Tipo de lección. Por defecto 'video' (compatibilidad con los cursos existentes). */
  tipo?: "video" | "texto";
  /** Contenido en Markdown — solo para lecciones de tipo 'texto'. */
  contenido?: string;
};

export type ModuloContenido = {
  title: string;
  icon:any;
  submodules: Submodulo[];
  floatingButton?: FloatingButtonConfig;
};

export type Modulo = {
  nom: string;
  nomModalidad: string;
  bgColor: string;
  color: string;
  icon: any;
  cursor?: string;
  modulos?: ModuloContenido[];
  disciplina?: string;
};

export type ModuloDesdeHome = {
  nom: string;
  bgColor: string;
  color: string;
  icon: any;
  cursor: string;
  modulos?: ModuloContenido[];
};





