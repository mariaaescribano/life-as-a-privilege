/** /home — el mandala de las ocho disciplinas tras iniciar sesión. */
export const home = {
  // Ordinales del Mapa. Como clave y no calculados, porque en inglés no se
  // forman añadiendo una letra («1ª» → «1st», «2ª» → «2nd», «3ª» → «3rd»…).
  "comun.ordinal.1": "1ª",
  "comun.ordinal.2": "2ª",
  "comun.ordinal.3": "3ª",
  "comun.ordinal.4": "4ª",
  "comun.ordinal.5": "5ª",
  "comun.ordinal.6": "6ª",
  "comun.ordinal.7": "7ª",
  "comun.ordinal.8": "8ª",

  "home.desbloquea.astrologia":
    "Desbloquea Astrología, la 1ª disciplina que aconsejamos para empezar.",
  "home.desbloquea.otra":
    "Desbloquea {disciplina} cuando quieras — es la {ordinal} que aconsejamos, pero puedes empezar por aquí.",

  /** Saludo grande del Mapa. `{coma}` trae ", Nombre" cuando se sabe el nombre. */
  "home.bienvenida": "Te damos la bienvenida al Mapa{coma}",
  "home.continuar": "Continuar →",
  "home.foto": "Tu foto",
  "home.fotoError": "No se pudo subir la foto",
  "home.fotoErrorTexto": "Inténtalo de nuevo en un momento.",

  "home.pago.titulo": "Pago de {disciplina} realizado",
  "home.pago.puedesEmpezar": "Ya puedes empezar la {ordinal} disciplina del Mapa.",
  "home.pago.lineaDeVida": "Ya puedes empezar tu Línea de Vida.",
} as const;
