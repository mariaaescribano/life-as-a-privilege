// ─────────────────────────────────────────────────────────────────────────
// Los 12 signos del zodíaco DIBUJADOS (iconos vectoriales), no escritos.
//
// Antes se pintaban con los caracteres ♈♉♊…, y esos caracteres tienen una
// versión emoji: Windows los resolvía con su fuente de emoji y salían morados,
// con recuadro, ignorando el color que les pedía el código. Ya no se usan en
// ninguna parte: cada signo es un trazo SVG, así que se ve igual en cualquier
// dispositivo, del color que le pidamos y sin depender de ninguna fuente.
//
// Cada signo son uno o varios trazos («path») dentro de un lienzo de 24×24,
// pensados para pintarse con `stroke` (sin relleno) y extremos redondeados.
// El mismo dato sirve para React (<path d=…>) y para el canvas de la carta 3D
// (new Path2D(d)), así que no hay dos versiones que puedan descuadrarse.
// ─────────────────────────────────────────────────────────────────────────

/** Orden del zodíaco (Aries → Piscis). */
export const SIGNOS_ORDEN = [
  "Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo",
  "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis",
] as const;

/** Trazos de cada signo en un lienzo de 24×24 (para `stroke`). */
export const SIGNO_TRAZOS: Record<string, string[]> = {
  // Los cuernos del carnero: tallo central y dos volutas hacia fuera.
  Aries: [
    "M12 21.5 V12",
    "M12 12 C12 6.6 9.6 3.6 7 3.6 C4.7 3.6 3.2 5.6 3.2 8 C3.2 10.2 4.6 11.9 6.5 12.5",
    "M12 12 C12 6.6 14.4 3.6 17 3.6 C19.3 3.6 20.8 5.6 20.8 8 C20.8 10.2 19.4 11.9 17.5 12.5",
  ],
  // Cabeza de toro: círculo con los cuernos encima.
  Tauro: [
    "M17.6 16 A5.6 5.6 0 1 1 6.4 16 A5.6 5.6 0 1 1 17.6 16",
    "M5.6 9.2 C5.6 4.2 8.8 3 12 6.6",
    "M18.4 9.2 C18.4 4.2 15.2 3 12 6.6",
  ],
  // Los gemelos: dos columnas unidas por arriba y por abajo.
  Géminis: [
    "M6 4.2 C9 2.8 15 2.8 18 4.2",
    "M6 19.8 C9 21.2 15 21.2 18 19.8",
    "M9.3 3.6 V20.4",
    "M14.7 3.6 V20.4",
  ],
  // Las pinzas del cangrejo: dos espirales enfrentadas.
  Cáncer: [
    "M20 9.6 C17.2 6.6 9.6 6.6 7 9.6",
    "M7.6 11.7 A2.1 2.1 0 1 1 3.4 11.7 A2.1 2.1 0 1 1 7.6 11.7",
    "M4 14.4 C6.8 17.4 14.4 17.4 17 14.4",
    "M20.6 12.3 A2.1 2.1 0 1 1 16.4 12.3 A2.1 2.1 0 1 1 20.6 12.3",
  ],
  // La melena del león: círculo y cola enroscada.
  Leo: [
    "M11.2 15.2 A3.7 3.7 0 1 1 3.8 15.2 A3.7 3.7 0 1 1 11.2 15.2",
    "M10.8 12.6 C11.1 7.4 13 3.8 15.8 3.8 C18.2 3.8 19.5 6.1 18.8 8.5 C18.2 10.7 16.2 12.3 14.2 13.3 C12.6 14.1 12.8 16.5 14.8 17.5 C16.6 18.4 18.6 17.9 19.8 16.5",
  ],
  // La «m» de la virgen, con el lazo que la cierra.
  Virgo: [
    "M4 7.6 V18",
    "M4 9.6 C4 7 8 7 8 9.6 V18",
    "M8 9.6 C8 7 12 7 12 9.6 V15.6",
    "M12 15.6 C12 19.4 16 21 18.4 18.6 C20.4 16.5 18.6 13.1 15.6 13.7 C13.4 14.2 12.7 16.6 14.4 18.4 L19 21.2",
  ],
  // La balanza: el fiel sobre la línea del equilibrio.
  Libra: [
    "M3 20 H21",
    "M3.6 16.2 H9.2 C6.6 12.4 8.2 7.6 12 7.6 C15.8 7.6 17.4 12.4 14.8 16.2 H20.4",
  ],
  // Como Virgo, pero acabado en el aguijón (la flecha).
  Escorpio: [
    "M4 7.6 V18",
    "M4 9.6 C4 7 8 7 8 9.6 V18",
    "M8 9.6 C8 7 12 7 12 9.6 V19",
    "M12 19 L20.4 12.6",
    "M15.9 12.6 H20.4 V17.2",
  ],
  // La flecha del arquero, con su travesaño.
  Sagitario: [
    "M4 20 L18.6 5.4",
    "M12.6 5.4 H18.6 V11.4",
    "M7.2 11.8 L13.4 18",
  ],
  // La cabra con cola de pez: el trazo quebrado y el lazo.
  Capricornio: [
    "M4 8 V16.6",
    "M4 9.8 C4 7.2 7.6 6.6 9 9.4 L11.6 14.6",
    "M11.6 14.6 C13 17.6 16.6 17.8 18 15.2 C19.2 13 17.4 10.6 15 11.2 C13 11.7 12.6 14 14.4 15.2",
  ],
  // Las dos ondas del agua.
  Acuario: [
    "M3 10.6 L6.6 7.9 L10.2 10.6 L13.8 7.9 L17.4 10.6 L21 7.9",
    "M3 16.4 L6.6 13.7 L10.2 16.4 L13.8 13.7 L17.4 16.4 L21 13.7",
  ],
  // Los dos peces atados.
  Piscis: [
    "M7.6 3.6 C4.2 7.6 4.2 16.4 7.6 20.4",
    "M16.4 3.6 C19.8 7.6 19.8 16.4 16.4 20.4",
    "M5 12 H19",
  ],
};

/** Trazos de un signo por su nombre (null si el nombre no es un signo). */
export function trazosSigno(nombre: string | null | undefined): string[] | null {
  if (!nombre) return null;
  return SIGNO_TRAZOS[nombre] ?? null;
}
