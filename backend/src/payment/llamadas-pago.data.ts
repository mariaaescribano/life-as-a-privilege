// Precios de las llamadas de acompañamiento, FIJADOS AQUÍ (en el servidor).
// El frontend NO puede modificar el importe — solo envía el `tipo`, igual que
// con los libros. Antes mandaba los euros en el body y el checkout se los creía,
// así que cualquiera podía reservar una llamada por un céntimo.
export type LlamadaTipo = 'estandar' | 'compania';

export interface LlamadaPago {
  tipo: LlamadaTipo;
  /** Nombre del producto tal y como aparece en Stripe. */
  nombre: string;
  /** EUR en céntimos (20 € → 2000). */
  precioCentimos: number;
}

export const LLAMADAS_PAGO: Record<LlamadaTipo, LlamadaPago> = {
  // La llamada suelta que se ofrece dentro de cada disciplina.
  estandar: { tipo: 'estandar', nombre: 'Llamada de acompañamiento', precioCentimos: 2000 },
  // La de «¿Prefieres compañía?» del recorrido (AyudaRecorrido).
  compania: { tipo: 'compania', nombre: 'Llamada de acompañamiento del recorrido', precioCentimos: 6000 },
};

export function findLlamadaPago(tipo?: string): LlamadaPago | undefined {
  if (!tipo) return LLAMADAS_PAGO.estandar;
  return LLAMADAS_PAGO[tipo as LlamadaTipo];
}
