import {
  astrologiaNom,
  ayurvedaNom,
  cabalaNom,
  culturaNom,
  fisiologiaNom,
  fitoterapiaNom,
  neuropsicologiaNom,
  nutricionNom,
  tcmNom,
} from "../GlobalVariables";
import { traducir, useIdioma, type ClaveTexto } from "./IdiomaProvider";

/**
 * Puente entre el nombre INTERNO de una disciplina (el de GlobalVariables, que
 * viaja en URLs y en la base de datos y por eso nunca se traduce) y la clave de
 * texto con la que se muestra.
 */
const CLAVE_POR_NOMBRE: Record<string, ClaveTexto> = {
  [astrologiaNom]: "disciplina.astrologia",
  [neuropsicologiaNom]: "disciplina.psicologia",
  // El nombre interno sigue siendo «Hinduismo» (URLs, BD, claves de fondo),
  // pero EN PANTALLA la disciplina se llama «Ayurveda» en toda la web.
  [ayurvedaNom]: "disciplina.ayurveda",
  [tcmNom]: "disciplina.medicinaChina",
  [fisiologiaNom]: "disciplina.fisiologia",
  [nutricionNom]: "disciplina.nutricion",
  [culturaNom]: "disciplina.cultura",
  [cabalaNom]: "disciplina.cabala",
  [fitoterapiaNom]: "disciplina.fitoterapia",
};

/**
 * Nombre de la disciplina para mostrar en pantalla.
 *
 * @param nom    nombre interno (`astrologiaNom`, `tcmNom`…)
 * @param corto  usa la versión abreviada si la hay (móvil)
 *
 * Si llega un nombre desconocido lo devuelve tal cual: preferimos enseñar algo
 * en español antes que un hueco vacío.
 */
export const nombreDisciplina = (nom: string, corto = false): string => {
  const clave = CLAVE_POR_NOMBRE[nom];
  if (!clave) return nom;
  if (corto) {
    const claveCorta = `${clave}.corto` as ClaveTexto;
    const abreviado = traducir(claveCorta);
    // `traducir` devuelve la propia clave cuando no existe: eso significa que
    // esta disciplina no tiene versión corta y vale la larga.
    if (abreviado !== claveCorta) return abreviado;
  }
  return traducir(clave);
};

/**
 * Versión para componentes. Igual que `nombreDisciplina`, pero suscrita al
 * contexto: al cambiar de idioma el componente se vuelve a pintar. Fuera de
 * React (datos, PDFs) usa directamente `nombreDisciplina`.
 */
export const useNombreDisciplina = () => {
  useIdioma(); // suscripción: fuerza el repintado al cambiar de idioma
  return nombreDisciplina;
};

/**
 * Igual que `nombreDisciplina`. Antes tenía una excepción (dentro de /elMetodo
 * «Hinduismo» se enseñaba como «Ayurveda»); desde que la disciplina se llama
 * «Ayurveda» en TODA la web ya no hay diferencia, pero se conserva para no
 * tocar a sus llamadores. Sustituye al antiguo `nombreEnMapa`.
 */
export const nombreDisciplinaEnMapa = (nom: string, corto = false): string =>
  nombreDisciplina(nom, corto);

export const useNombreDisciplinaEnMapa = () => {
  useIdioma();
  return nombreDisciplinaEnMapa;
};
