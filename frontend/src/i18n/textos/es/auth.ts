/** Pantallas de acceso: iniciar sesión, crear cuenta y recuperar contraseña. */
export const auth = {
  // ── Etiquetas de campo (van en mayúsculas) ─────────────────────────────
  "auth.campo.nombreOEmail": "NOMBRE O EMAIL",
  "auth.campo.nombre": "NOMBRE",
  "auth.campo.email": "EMAIL",
  "auth.campo.contrasena": "CONTRASEÑA",
  "auth.campo.repiteContrasena": "REPITE LA CONTRASEÑA",
  "auth.campo.nuevaContrasena": "NUEVA CONTRASEÑA",
  "auth.campo.repitela": "REPÍTELA",
  "auth.contrasena.mostrar": "Mostrar contraseña",
  "auth.contrasena.ocultar": "Ocultar contraseña",

  // ── Iniciar sesión ─────────────────────────────────────────────────────
  "auth.login.titulo": "Iniciar sesión",
  "auth.login.subtitulo": "Entra a tu cuenta de El Mapa",
  "auth.login.entrar": "Entrar",
  "auth.login.olvidada": "¿Has olvidado tu contraseña?",
  "auth.login.sinCuenta": "¿No tienes cuenta? Crear cuenta",
  "auth.login.bienvenido": "Bienvenido",
  "auth.login.preparando": "Lo estoy preparando para ti",

  // ── Crear cuenta ───────────────────────────────────────────────────────
  "auth.signin.titulo": "Crear cuenta",
  "auth.signin.subtitulo": "Crea tu cuenta sin coste ninguno",
  "auth.signin.trato": "¿CÓMO PREFIERES QUE ME DIRIJA HACIA TI?",
  "auth.signin.tratoEl": "Él",
  "auth.signin.tratoElla": "Ella",
  "auth.signin.boton": "Registrarme",
  "auth.signin.yaTienes": "¿Ya tienes cuenta? Iniciar sesión",
  "auth.signin.creada": "¡Cuenta creada!",
  "auth.signin.creadaTexto": "Continuamos en un instante...",

  // ── Recuperar contraseña ───────────────────────────────────────────────
  "auth.recuperar.titulo": "Recuperar contraseña",
  "auth.recuperar.tituloNueva": "Nueva contraseña",
  "auth.recuperar.subtitulo": "Te enviamos un enlace al email de tu cuenta",
  "auth.recuperar.subtituloNueva": "Elige la contraseña con la que entrarás a partir de ahora",
  "auth.recuperar.enviarEnlace": "Enviar enlace",
  "auth.recuperar.volver": "Volver a iniciar sesión",
  "auth.recuperar.faltaEmail": "Falta el email",
  "auth.recuperar.escribeEmail": "Escribe el email de tu cuenta",
  "auth.recuperar.miraCorreo": "Mira tu correo",
  "auth.recuperar.enlaceEnviado":
    "Si ese email tiene una cuenta, te acabamos de enviar un enlace para elegir una contraseña nueva. Caduca en una hora.",
  "auth.recuperar.cambiada": "Contraseña cambiada",
  "auth.recuperar.cambiadaTexto": "Ya puedes entrar con la nueva. Te llevamos al inicio de sesión…",

  // ── Avisos de validación ───────────────────────────────────────────────
  "auth.error.faltanDatos": "Faltan datos",
  "auth.error.rellena": "Rellena todos los campos",
  "auth.error.emailInvalido": "Email no válido",
  "auth.error.emailCorrecto": "Introduce un email correcto",
  "auth.error.contraCorta": "Contraseña muy corta",
  "auth.error.contraCorta4": "Usa al menos 4 caracteres",
  "auth.error.contraCorta6": "Tiene que tener al menos 6 caracteres",
  "auth.error.noCoinciden": "Las contraseñas no coinciden",
  "auth.error.noCoincidenTexto": "Repite la misma contraseña en los dos campos",
  "auth.error.noCoincidenCorto": "No coinciden",
  "auth.error.dosIguales": "Las dos contraseñas tienen que ser iguales",

  // ── Errores del servidor (gestionaError) ───────────────────────────────
  // OJO: cuando el backend manda su propio `message`, ese texto llega en
  // español y NO pasa por aquí. Traducirlo es trabajo del backend.
  "auth.error.generico": "Error",
  "auth.error.masTarde": "Inténtalo de nuevo más tarde",
  "auth.error.desconocido": "Error desconocido",
} as const;
