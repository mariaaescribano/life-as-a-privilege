/**
 * Nombres de las 8 disciplinas TAL COMO SE MUESTRAN.
 *
 * OJO: no confundir con las constantes `astrologiaNom`, `tcmNomLink`… de
 * GlobalVariables. Esas viajan en las URLs (`/aprendizaje/cursos/Astrología`)
 * y en la base de datos, así que NO se traducen nunca. Aquí solo está la
 * etiqueta que ve el usuario.
 */
export const disciplinas = {
  "disciplina.astrologia": "Astrología",
  "disciplina.psicologia": "Autoconocimiento",
  /** El nombre interno sigue siendo «Hinduismo» (URLs, BD), pero en pantalla
   *  la disciplina se llama «Ayurveda» en toda la web (2026-09-29). */
  "disciplina.ayurveda": "Ayurveda",
  "disciplina.medicinaChina": "Tradición Oriental",
  /** Versión corta para móvil, donde «Tradición Oriental» no cabe en la tarjeta. */
  "disciplina.medicinaChina.corto": "Tradición Oriental",
  "disciplina.fisiologia": "Cuerpo Humano",
  "disciplina.nutricion": "Alimentación",
  "disciplina.cultura": "Cultura",
  "disciplina.cabala": "Cábala",
  "disciplina.fitoterapia": "Fitoterapia",
} as const;
