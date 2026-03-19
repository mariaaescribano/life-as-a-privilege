
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
};

export type ModuloContenido = {
  title: string;
  icon:any;
  submodules: Submodulo[];
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





