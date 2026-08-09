/**
 * Portada (/) — Welcome.tsx.
 *
 * Aquí viven las frases de las 8 disciplinas que antes estaban en
 * `data/welcomeDisciplinas.ts`: el lema de la tarjeta (`lema`) y el texto del
 * modal que se abre al pincharla (`desc`). Se editan libremente; al tocar una
 * frase, acuérdate de tocar también su versión inglesa en `../en/welcome.ts`.
 */
export const welcome = {
  // El titular de la portada es el nombre de la casa y sale de `header.marca`
  // (ahí también se lee el rótulo del header): un solo sitio donde cambiarlo.
  "welcome.subtitulo": "Un mapa de ocho disciplinas para comprenderte, integrando ciencia y tradición.",
  "welcome.explorar": "Explorar",
  "welcome.explorarDisciplina": "Explorar disciplina",
  "welcome.modal.cuenta": "Crea una cuenta o inicia sesión",
  "welcome.modal.iniciarSesion": "Iniciar sesión →",

  // ── Lemas de las tarjetas ──────────────────────────────────────────────
  "welcome.lema.astrologia": "Los patrones que te forman.",
  "welcome.lema.psicologia": "Cómo funciona tu mente.",
  "welcome.lema.hinduismo": "Tu constitución única.",
  "welcome.lema.medicinaChina": "El origen de tus desequilibrios.",
  "welcome.lema.fisiologia": "Eres un cuerpo.",
  "welcome.lema.nutricion": "Cómo te reconstruyes.",
  "welcome.lema.cabala": "La arquitectura del alma.",
  "welcome.lema.cultura": "Las historias de la humanidad.",

  // ── Descripción del modal de cada disciplina ───────────────────────────
  "welcome.desc.astrologia":
    "Los arquetipos que actúan en cada área de tu Vida. Entiende cómo funcionan en ti y deja de pelearte contigo.",
  "welcome.desc.psicologia":
    "El porqué de tus hábitos, tus enfados y tus repeticiones. No para justificarlos: para dejar de necesitarlos.",
  "welcome.desc.hinduismo":
    "Cinco mil años leyendo al ser humano como parte de la naturaleza, puesto que no es algo separado de ella.",
  "welcome.desc.medicinaChina":
    "Cinco elementos. Una naturaleza. Un ser humano. Un sistema de 3000 años para entender el origen de tus desequilibrios.",
  "welcome.desc.fisiologia":
    "No tenemos un cuerpo. Somos un cuerpo. Entiende cómo funcionas.",
  "welcome.desc.nutricion":
    "Qué hace cada alimento dentro de ti. Cómo te reconstruyes con tu alimentación. Conoce más para temer menos y elegir mejor.",
  "welcome.desc.cabala":
    "El mapa del alma humana. Diez Sefirot para entender qué te equilibra y qué te desequilibra.",
  "welcome.desc.cultura":
    "Las historias de la humanidad que marcaron un antes y un después. Entiéndelas y crea la tuya propia.",
} as const;
