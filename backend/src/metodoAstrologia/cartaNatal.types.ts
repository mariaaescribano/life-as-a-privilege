export type CuerpoKey =
  | 'ascendente'
  | 'sol' | 'luna' | 'mercurio' | 'venus' | 'marte'
  | 'jupiter' | 'saturno' | 'urano' | 'neptuno' | 'pluton'
  | 'quiron' | 'nodoNorte' | 'nodoSur';

export type TipoAspecto =
  | 'conjuncion' | 'oposicion' | 'trigono' | 'cuadratura' | 'sextil'
  | 'semisextil' | 'quincuncio';

export interface PosicionPlaneta {
  planeta: CuerpoKey;
  grado: number;     // 0-360 longitud eclíptica
  signoIdx: number;  // 0-11 (Aries=0)
  casa: number;      // 1-12
}

export interface Aspecto {
  a: CuerpoKey;
  b: CuerpoKey;
  tipo: TipoAspecto;
}

export interface CartaNatal {
  ascendente: number;
  cusps: number[];
  planetas: PosicionPlaneta[];
  aspectos: Aspecto[];
}

export interface LugarNacimiento {
  lat: number;
  lng: number;
  timezone: string;
}
