// ─────────────────────────────────────────────────────────────────────────
// PERSONAJES Y ANIMALES de la página «Tu familia» (paso 6 de psicología).
//
// La usuaria coloca a su familia en el mapa y asocia a cada miembro uno o dos
// de estos personajes/animales. La plataforma NO interpreta lo que significa
// cada imagen: solo guarda la asociación que ella hace.
//
// ✍️  CÓMO AÑADIR O CAMBIAR LAS FOTOS
//   1. Deja el archivo en   frontend/public/recorrido/psicologia/familia/
//      con el mismo nombre que su `key` (p. ej. `leon.webp` → key "leon").
//   2. Añade o edita su entrada aquí abajo (key, nombre y grupo).
//   · Formato recomendado: .webp cuadrada (unos 600×600) y ligera.
//   · Las entradas cuyo archivo aún no exista NO rompen nada: en el selector
//     aparecen con su nombre y sin imagen, hasta que subas la foto.
//   · NO cambies una `key` ya publicada: es lo que queda guardado en el
//     recorrido de cada usuaria (se perdería su elección).
// ─────────────────────────────────────────────────────────────────────────

import { useMemo } from "react";
import { getIdioma, useIdioma, type Idioma } from "../../i18n";

export interface SimboloFamilia {
  /** Clave estable = nombre del archivo sin extensión (no cambiar tras publicar). */
  key: string;
  /** Nombre visible bajo la imagen. */
  nombre: string;
  /** Grupo con el que se agrupa en el selector. */
  grupo: "Animales" | "Personajes";
}

/** Carpeta pública donde viven las fotos. */
export const SIMBOLOS_DIR = "/recorrido/psicologia/familia";

/** Ruta de la foto de un personaje/animal. */
export const simboloSrc = (key: string): string => `${SIMBOLOS_DIR}/${key}.webp`;

export const SIMBOLOS_FAMILIA: SimboloFamilia[] = [
  // ── Animales ──
  { key: "leon",      nombre: "León",      grupo: "Animales" },
  { key: "lobo",      nombre: "Lobo",      grupo: "Animales" },
  { key: "oso",       nombre: "Oso",       grupo: "Animales" },
  { key: "ciervo",    nombre: "Ciervo",    grupo: "Animales" },
  { key: "buho",      nombre: "Búho",      grupo: "Animales" },
  { key: "gato",      nombre: "Gato",      grupo: "Animales" },
  { key: "perro",     nombre: "Perro",     grupo: "Animales" },
  { key: "caballo",   nombre: "Caballo",   grupo: "Animales" },
  { key: "aguila",    nombre: "Águila",    grupo: "Animales" },
  { key: "tortuga",   nombre: "Tortuga",   grupo: "Animales" },
  { key: "zorro",     nombre: "Zorro",     grupo: "Animales" },
  { key: "oveja",     nombre: "Oveja",     grupo: "Animales" },
  { key: "elefante",  nombre: "Elefante",  grupo: "Animales" },
  { key: "serpiente", nombre: "Serpiente", grupo: "Animales" },
  { key: "erizo",     nombre: "Erizo",     grupo: "Animales" },
  { key: "mariposa",  nombre: "Mariposa",  grupo: "Animales" },

  // ── Personajes ──
  { key: "rey",       nombre: "Rey",       grupo: "Personajes" },
  { key: "reina",     nombre: "Reina",     grupo: "Personajes" },
  { key: "guerrero",  nombre: "Guerrero",  grupo: "Personajes" },
  { key: "sabio",     nombre: "Sabio",     grupo: "Personajes" },
  { key: "mago",      nombre: "Mago",      grupo: "Personajes" },
  { key: "payaso",    nombre: "Payaso",    grupo: "Personajes" },
  { key: "angel",     nombre: "Ángel",     grupo: "Personajes" },
  { key: "gigante",   nombre: "Gigante",   grupo: "Personajes" },
  { key: "nina",      nombre: "Niña",      grupo: "Personajes" },
  { key: "sombra",    nombre: "Sombra",    grupo: "Personajes" },
];

export const simboloByKey = (key: string): SimboloFamilia | undefined =>
  SIMBOLOS_FAMILIA.find((s) => s.key === key);

/** Los grupos en el orden en que se pintan en el selector. */
export const SIMBOLOS_GRUPOS: SimboloFamilia["grupo"][] = ["Animales", "Personajes"];

// ─────────────────────────────────────────────────────────────────────────
// EN INGLÉS (solo el rótulo)
//
// La `key` es el dato: es lo que queda guardado en el recorrido de cada
// usuaria, así que no se traduce nunca. Aquí solo está su nombre visible,
// indexado por esa misma clave. Lo que no esté traducido se queda en español
// en vez de desaparecer. Misma regla que en astrologiaNombres.ts.
// ─────────────────────────────────────────────────────────────────────────
const NOMBRES_EN: Record<string, string> = {
  // Animales
  leon: "Lion", lobo: "Wolf", oso: "Bear", ciervo: "Deer", buho: "Owl",
  gato: "Cat", perro: "Dog", caballo: "Horse", aguila: "Eagle",
  tortuga: "Turtle", zorro: "Fox", oveja: "Sheep", elefante: "Elephant",
  serpiente: "Snake", erizo: "Hedgehog", mariposa: "Butterfly",
  // Personajes
  rey: "King", reina: "Queen", guerrero: "Warrior", sabio: "Sage",
  mago: "Magician", payaso: "Clown", angel: "Angel", gigante: "Giant",
  nina: "Child", sombra: "Shadow",
};

const GRUPOS_EN: Record<SimboloFamilia["grupo"], string> = {
  Animales: "Animals",
  Personajes: "Characters",
};

/** Nombre visible de una clave guardada (si ya no está en el catálogo, la key). */
export const simboloNombre = (key: string, idioma: Idioma = getIdioma()): string => {
  const es = simboloByKey(key)?.nombre ?? key;
  return idioma === "en" ? NOMBRES_EN[key] ?? es : es;
};

/** El rótulo del grupo en el selector («Animales» / "Animals"). */
export const grupoLabel = (
  grupo: SimboloFamilia["grupo"],
  idioma: Idioma = getIdioma(),
): string => (idioma === "en" ? GRUPOS_EN[grupo] ?? grupo : grupo);

/**
 * El catálogo con los nombres del idioma activo. Es un hook: el selector y el
 * mapa repintan solos al cambiar de idioma. La `key` y el `grupo` (con los que
 * se filtra y se guarda) siguen siendo los del español.
 */
export function useSimbolosFamilia() {
  const { idioma } = useIdioma();
  return useMemo(() => ({
    simbolos: SIMBOLOS_FAMILIA.map((s) => ({ ...s, nombre: simboloNombre(s.key, idioma) })),
    nombre: (key: string) => simboloNombre(key, idioma),
    grupo: (g: SimboloFamilia["grupo"]) => grupoLabel(g, idioma),
  }), [idioma]);
}
