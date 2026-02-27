
export type Detalles = {
  color: string;
  icon: any;
  bgColor:string;
};

export type Submodulo = {
  id:string;
  nom: string;
  link:string;
  descripcion: string;
  video: string;
  letra: string;
  detalles: Detalles;
  linkAnterior:string;
  linkNext:string;
};

export type ModuloContenido = {
  title: string;
  icon:any;
  submodules: Submodulo[];
};

export type Modulo = {
  nom: string;
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





