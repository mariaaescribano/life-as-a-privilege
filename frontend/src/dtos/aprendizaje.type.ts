
export type Submodulo = {
  nom: string;
  link:string;
  descripcion: string;
  video: string;
  detalles: Detalles;
};

export type ModuloContenido = {
  title: string;
  submodules: Submodulo[];
};

export type Modulo = {
  nom: string;
  bgColor: string;
  color: string;
  icon: any;
  modulos?: ModuloContenido[];
};

export type Detalles = {
  color: string;
  icon: any;
  bgColor:string;
};

