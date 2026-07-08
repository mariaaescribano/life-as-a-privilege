export type FacetaAstro = 'signo' | 'casa';

export interface AstroTextoRow {
  cuerpo: string;
  faceta: FacetaAstro;
  valor: string;
  texto: string;
  updated_at?: string;
}

/** Payload para guardar/upsert una interpretación. */
export interface AstroTextoInput {
  cuerpo: string;
  faceta: FacetaAstro;
  valor: string;
  texto: string;
}
