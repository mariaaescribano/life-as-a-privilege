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
  { key: "loba",      nombre: "Loba",      grupo: "Animales" },
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

/** Nombre visible de una clave guardada (si ya no está en el catálogo, la key). */
export const simboloNombre = (key: string): string => simboloByKey(key)?.nombre ?? key;

/** Los grupos en el orden en que se pintan en el selector. */
export const SIMBOLOS_GRUPOS: SimboloFamilia["grupo"][] = ["Animales", "Personajes"];
