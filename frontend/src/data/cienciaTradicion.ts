/**
 * Reparto de las disciplinas en dos bloques para /ilustraciones y los cursos: CIENCIA y TRADICIÓN.
 * TRADICIÓN: Astrología, Hinduismo (Ayurveda), Medicina China y Cábala. Todo lo demás (Psicología, Fisiología,
 * Nutrición, Cultura, Fitoterapia…) va en CIENCIA. Se compara por el nombre de la disciplina, que aparece con
 * variantes (`Hinduismo`/`Ayurveda`), así que están las dos. Para mover una disciplina de bloque, tocar SOLO esta lista.
 */
const TRADICION = new Set(["Astrología", "Hinduismo", "Ayurveda", "Medicina China", "Cábala"]);

export const esTradicion = (nomDisciplina: string): boolean => TRADICION.has(nomDisciplina);

/** Parte una lista en [ciencia, tradición] conservando su orden. */
export function repartirCienciaTradicion<T>(items: T[], nomDe: (item: T) => string): { ciencia: T[]; tradicion: T[] } {
  return {
    ciencia: items.filter((x) => !esTradicion(nomDe(x))),
    tradicion: items.filter((x) => esTradicion(nomDe(x))),
  };
}
