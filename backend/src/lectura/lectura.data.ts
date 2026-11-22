// Los servicios de «la carta de tu lectura» (Astrología), con su PRECIO FIJADO AQUÍ, en el servidor.
// El frontend solo envía la clave del servicio; nunca el importe (igual que con los libros y las llamadas).
export type LecturaServicio = 'pdf_parcial' | 'pdf_completo' | 'plataforma';

export interface LecturaTarifa {
  servicio: LecturaServicio;
  /** Nombre tal y como sale en Stripe y en los correos. */
  nombre: string;
  /** EUR en céntimos (20 € → 2000). */
  precioCentimos: number;
}

export const LECTURAS: Record<LecturaServicio, LecturaTarifa> = {
  pdf_parcial: { servicio: 'pdf_parcial', nombre: 'Carta en pdf parcial escrita a mano', precioCentimos: 2000 },
  pdf_completo: { servicio: 'pdf_completo', nombre: 'Carta pdf completa escrita a mano', precioCentimos: 3000 },
  plataforma: { servicio: 'plataforma', nombre: 'Carta a través de la plataforma (incluye contenido exclusivo)', precioCentimos: 3500 },
};

export function findLectura(servicio?: string): LecturaTarifa | undefined {
  return servicio ? LECTURAS[servicio as LecturaServicio] : undefined;
}

export const ESTADOS_LECTURA = ['recibido', 'en_proceso', 'lista'] as const;
export type LecturaEstado = (typeof ESTADOS_LECTURA)[number];
