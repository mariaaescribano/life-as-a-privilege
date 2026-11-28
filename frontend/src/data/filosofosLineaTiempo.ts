/**
 * Grandes pensadores de la línea del tiempo de Filosofía (portada /disciplina/filosofia), en orden cronológico.
 * Cada uno: nombre, años y foto (`/public/img/autores/<slug>.webp`). Mientras ese fichero no exista, su arco enseña
 * el mandala (no sale ninguna imagen rota); al subir la foto, aparece sola.
 * Al final de la línea, la componente va aparte: «Tú · Hoy».
 */
export type Filosofo = {
  nombre: string;
  nombreEn?: string;
  anos: { es: string; en: string };
  foto: string;
};

const F = (n: string) => `/img/autores/${n}.webp`;

export const FILOSOFOS_LINEA: Filosofo[] = [
  { nombre: "Sócrates", nombreEn: "Socrates", anos: { es: "470-399 a. C.", en: "470–399 BC" }, foto: F("socrates") },
  { nombre: "Platón", nombreEn: "Plato", anos: { es: "427-347 a. C.", en: "427–347 BC" }, foto: F("platon") },
  { nombre: "Aristóteles", nombreEn: "Aristotle", anos: { es: "384-322 a. C.", en: "384–322 BC" }, foto: F("aristoteles") },
  { nombre: "Epicuro", nombreEn: "Epicurus", anos: { es: "341-270 a. C.", en: "341–270 BC" }, foto: F("epicuro") },
  { nombre: "Séneca", nombreEn: "Seneca", anos: { es: "4 a. C.-65 d. C.", en: "4 BC–65 AD" }, foto: F("seneca") },
  { nombre: "Descartes", anos: { es: "1596-1650", en: "1596–1650" }, foto: F("descartes") },
  { nombre: "Kant", anos: { es: "1724-1804", en: "1724–1804" }, foto: F("kant") },
  { nombre: "Nietzsche", anos: { es: "1844-1900", en: "1844–1900" }, foto: F("nietzsche") },
];
