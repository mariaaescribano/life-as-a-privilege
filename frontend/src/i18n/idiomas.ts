/**
 * Idiomas de la web.
 *
 * El español es el idioma ORIGINAL y la fuente de verdad: define todas las
 * claves. El inglés es secundario y puede estar incompleto — lo que falte se
 * muestra en español (respaldo automático), así nunca sale una clave pelada
 * ni un hueco en blanco mientras vamos traduciendo.
 */

export type Idioma = "es" | "en";

/**
 * Un mismo texto en los dos idiomas, para el contenido que va PEGADO a un dato
 * y no tiene sentido sacar a un diccionario aparte (el pie de una captura
 * concreta, por ejemplo). Se lee con `segunIdioma(...)` de `useIdioma()`.
 * El inglés es opcional: si falta, se muestra el español.
 */
export type Texto = { es: string; en?: string };

export const IDIOMAS: Idioma[] = ["es", "en"];

export const IDIOMA_ORIGINAL: Idioma = "es";

/** Etiqueta corta para el selector del header. */
export const IDIOMA_ETIQUETA: Record<Idioma, string> = {
  es: "ES",
  en: "EN",
};

/** Nombre del idioma en su propio idioma (para el `title` del selector). */
export const IDIOMA_NOMBRE: Record<Idioma, string> = {
  es: "Español",
  en: "English",
};

/** Valor de `<html lang>` y de `og:locale`. */
export const IDIOMA_LOCALE: Record<Idioma, string> = {
  es: "es_ES",
  en: "en_US",
};

/** Clave de localStorage donde se recuerda el idioma elegido. */
export const CLAVE_IDIOMA = "idioma";

export const esIdioma = (v: unknown): v is Idioma =>
  typeof v === "string" && (IDIOMAS as string[]).includes(v);

/**
 * Idioma con el que arranca la web, por orden de prioridad:
 *   1. `?lang=en` en la URL (para compartir un enlace ya en inglés)
 *   2. lo que el usuario eligió la última vez (localStorage)
 *   3. el idioma del navegador
 *   4. español
 */
export const detectarIdioma = (): Idioma => {
  try {
    const enUrl = new URLSearchParams(window.location.search).get("lang");
    if (esIdioma(enUrl)) return enUrl;
  } catch { /* noop */ }

  try {
    const guardado = localStorage.getItem(CLAVE_IDIOMA);
    if (esIdioma(guardado)) return guardado;
  } catch { /* noop */ }

  try {
    const navegador = (navigator.language || "").slice(0, 2).toLowerCase();
    if (esIdioma(navegador)) return navegador;
  } catch { /* noop */ }

  return IDIOMA_ORIGINAL;
};
