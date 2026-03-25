
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
};

export type ModuloDesdeHome = {
  nom: string;
  bgColor: string;
  color: string;
  icon: any;
  cursor: string;
  modulos?: ModuloContenido[];
};





