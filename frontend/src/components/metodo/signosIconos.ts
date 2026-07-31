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

// Los trazos siguen una rejilla como la de una tipografía, para que los doce
// signos se lean como una misma familia y no como doce dibujos sueltos:
//   · línea de base  y = 19        · altura de mayúscula  y = 5
//   · eje vertical   x = 12        · ancho útil  x ∈ [4, 20]
// Nada sobresale de esa caja (antes algunos bajaban a 21 y se veían torcidos
// al alinearlos), las curvas van cerradas y el trazo es fino: eso es lo que
// separa un glifo de un garabato.

/** Trazos de cada signo en un lienzo de 24×24 (para `stroke`). */
export const SIGNO_TRAZOS: Record<string, string[]> = {
  // Los cuernos del carnero: sin tallo central, las dos astas nacen juntas en
  // la base y se abren en voluta (la V estrecha del glifo clásico).
  Aries: [
    "M12 19 C12 13.4 11.2 9 9 7 C7.2 5.4 5.2 6 4.6 7.9 C4.1 9.5 4.8 11.1 6.1 11.9",
    "M12 19 C12 13.4 12.8 9 15 7 C16.8 5.4 18.8 6 19.4 7.9 C19.9 9.5 19.2 11.1 17.9 11.9",
  ],
  // Cabeza de toro: el círculo abajo y la luna abierta apoyada encima.
  Tauro: [
    "M16.6 15.1 A4.6 4.6 0 1 1 7.4 15.1 A4.6 4.6 0 1 1 16.6 15.1",
    "M5.6 5.4 C5.6 9.4 8.4 10.8 12 10.8 C15.6 10.8 18.4 9.4 18.4 5.4",
  ],
  // Los gemelos: dos columnas estrechas y los arcos que las abrazan.
  Géminis: [
    "M6.6 5 C8.6 6.7 15.4 6.7 17.4 5",
    "M6.6 19 C8.6 17.3 15.4 17.3 17.4 19",
    "M9.6 5.8 V18.2",
    "M14.4 5.8 V18.2",
  ],
  // El «69» tumbado: los dos aros JUNTOS en el centro (en diagonal) y la cola
  // de cada uno saliendo de su aro y barriendo hacia fuera, como el rabo de un
  // 6. Los dos trazos son el mismo girado 180° sobre el centro (12,12).
  Cáncer: [
    "M9.85 10.2 A2.05 2.05 0 1 1 5.75 10.2 A2.05 2.05 0 1 1 9.85 10.2",
    "M5.75 9.9 C7 6.6 14 5.6 20 8.8",
    "M18.25 13.8 A2.05 2.05 0 1 1 14.15 13.8 A2.05 2.05 0 1 1 18.25 13.8",
    "M18.25 14.1 C17 17.4 10 18.4 4 15.2",
  ],
  // La melena del león: el círculo pequeño y la cola que se enrosca al final.
  Leo: [
    "M10.6 15.4 A3.2 3.2 0 1 1 4.2 15.4 A3.2 3.2 0 1 1 10.6 15.4",
    "M10.4 13 C10.6 8.5 12.4 5.4 15.2 5.4 C17.6 5.4 18.9 7.6 18.1 9.8 C17.4 11.7 15.4 13.1 14 14 C12.6 14.9 12.9 17 14.8 17.8 C16.4 18.5 18.2 18 19.3 16.8",
  ],
  // La «m» de la virgen: tres astas iguales y el lazo que cierra la tercera.
  Virgo: [
    "M5 8 V17.6",
    "M5 9.8 C5 7.4 8.4 7.4 8.4 9.8 V17.6",
    "M8.4 9.8 C8.4 7.4 11.8 7.4 11.8 9.8 V15.2",
    "M11.8 15.2 C11.8 18.4 14.9 19.7 16.9 17.9 C18.6 16.3 17.2 13.5 14.8 14 C13 14.4 12.5 16.3 13.9 17.7 L17.8 19.4",
  ],
  // La balanza: la base y, sobre el travesaño, la media luna del fiel.
  Libra: [
    "M4 19.2 H20",
    "M4 15 H8.1 A3.95 3.95 0 0 1 15.9 15 H20",
  ],
  // Como Virgo, pero la tercera asta sale disparada en el aguijón.
  Escorpio: [
    "M5 8 V17.6",
    "M5 9.8 C5 7.4 8.4 7.4 8.4 9.8 V17.6",
    "M8.4 9.8 C8.4 7.4 11.8 7.4 11.8 9.8 V18.4",
    "M11.8 18.4 L19.4 12.5",
    "M15.6 12.5 H19.4 V16.3",
  ],
  // La flecha del arquero: el asta en diagonal y el travesaño cruzándola.
  Sagitario: [
    "M5 19 L18.4 5.6",
    "M12.8 5.6 H18.4 V11.2",
    "M7.4 10.8 L12.8 16.2",
  ],
  // La cabra con cola de pez: el quiebro del cuerpo y el lazo de la cola.
  Capricornio: [
    "M5 8.4 V16.4",
    "M5 10 C5 7.6 8.2 7.2 9.5 9.8 L11.9 14.6",
    "M11.9 14.6 C13.2 17.3 16.6 17.5 17.8 15.1 C18.9 13 17.2 10.9 15 11.4 C13.2 11.9 12.8 14 14.5 15.1",
  ],
  // Las dos ondas del agua, de amplitud corta y paso regular.
  Acuario: [
    "M4 11.2 L7.2 8.8 L10.4 11.2 L13.6 8.8 L16.8 11.2 L20 8.8",
    "M4 16.4 L7.2 14 L10.4 16.4 L13.6 14 L16.8 16.4 L20 14",
  ],
  // Los dos peces atados por el cordón. Las lunas se curvan HACIA DENTRO (las
  // puntas abiertas hacia fuera, arriba y abajo) y el cordón cruza justo por
  // donde se estrechan; al contrario salía una lente, no dos peces.
  Piscis: [
    "M5.4 5.4 A7.8 7.8 0 0 1 5.4 18.6",
    "M18.6 5.4 A7.8 7.8 0 0 0 18.6 18.6",
    "M6.6 12 H17.4",
  ],
};

/** Trazos de un signo por su nombre (null si el nombre no es un signo). */
export function trazosSigno(nombre: string | null | undefined): string[] | null {
  if (!nombre) return null;
  return SIGNO_TRAZOS[nombre] ?? null;
}
