/**
 * Contenido APARCADO por ahora en las páginas de listado: no se borra nada, solo se deja de enseñar.
 * Para volver a mostrarlo, quitar la disciplina de la lista que toque.
 *
 *   · Ilustraciones: por la ETIQUETA de la galería (Hinduismo se etiqueta «Ayurveda»).
 *   · Cursos: por el NOMBRE interno de la disciplina (`cabalaNom`, `ayurvedaNom`…).
 */
export const ILUSTRACIONES_APARCADAS = new Set<string>(["Cábala", "Ayurveda"]);
export const CURSOS_APARCADOS = new Set<string>(["Cábala"]);
