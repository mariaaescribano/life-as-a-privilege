/** Pantallas de acceso: iniciar sesión, crear cuenta, recuperar contraseña y «Mi cuenta». */
export const auth = {
  // ── Etiquetas de campo (van en mayúsculas) ─────────────────────────────
  "auth.campo.nombreOEmail": "NOMBRE O EMAIL",
  "auth.campo.nombre": "NOMBRE",
  "auth.campo.email": "EMAIL",
  "auth.campo.telefono": "TELÉFONO (OPCIONAL)",
  "auth.campo.fechaNacimiento": "FECHA DE NACIMIENTO (OPCIONAL)",
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
  "auth.login.confirmada": "Cuenta confirmada",
  "auth.login.confirmadaTexto": "Ya puedes iniciar sesión con tu nombre o tu email y tu contraseña.",
  "auth.login.pendienteTexto": "Pulsa el enlace que te hemos enviado para confirmar tu cuenta, y luego entra aquí con tu nombre o tu email y tu contraseña.",
  "auth.login.sinConfirmar": "Falta confirmar tu cuenta",
  "auth.login.sinConfirmarTexto": "Pulsa el enlace del correo que te enviamos al crearla. Mira también en spam o promociones.",
  "auth.login.reenviar": "¿No te ha llegado? Envíamelo otra vez",
  "auth.login.reenviado": "Hecho. Si la cuenta está pendiente de confirmar, te acaba de llegar un correo nuevo.",

  // ── Crear cuenta ───────────────────────────────────────────────────────
  "auth.signin.titulo": "Crear cuenta",
  "auth.signin.subtitulo": "Sin coste ninguno",
  "auth.signin.trato": "¿CÓMO PREFIERES QUE ME DIRIJA HACIA TI?",
  "auth.signin.tratoEl": "Él",
  "auth.signin.tratoElla": "Ella",
  "auth.signin.boton": "Registrarme",
  "auth.signin.yaTienes": "¿Ya tienes cuenta? Iniciar sesión",
  "auth.signin.creada": "¡Cuenta creada!",
  "auth.signin.creadaTexto": "Continuamos en un instante...",
  "auth.signin.fechaRegalo": "El día de tu cumpleaños te llegará un regalo por email: un 50 % en una disciplina.",
  "auth.signin.miraCorreo": "Mira tu correo",
  "auth.signin.miraCorreoTexto": "Tu cuenta está creada. Para activarla, pulsa el enlace que te acabamos de enviar a:",
  "auth.signin.miraCorreoSpam": "Después ya podrás iniciar sesión con tu nombre o tu email y tu contraseña. Si no lo ves en unos minutos, mira en spam o en promociones.",
  "auth.signin.entendido": "Entendido",

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
  "auth.error.telefonoInvalido": "Teléfono no válido",
  "auth.error.telefonoCorrecto": "Escribe solo números, con el prefijo si quieres (+34…), o déjalo en blanco",

  // ── Errores del servidor (gestionaError) ───────────────────────────────
  // OJO: cuando el backend manda su propio `message`, ese texto llega en
  // español y NO pasa por aquí. Traducirlo es trabajo del backend.
  "auth.error.generico": "Error",
  "auth.error.masTarde": "Inténtalo de nuevo más tarde",
  "auth.error.desconocido": "Error desconocido",

  // ── Mi cuenta (/cuenta) ────────────────────────────────────────────────
  // Los rótulos de los campos son los mismos de arriba (`auth.campo.*`): es la
  // misma ficha, solo que aquí se edita en vez de rellenarse.
  "cuenta.titulo": "Mi cuenta",
  "cuenta.foto.tocaParaCambiar": "Toca la foto para cambiarla",
  "cuenta.foto.subiendo": "Subiendo…",
  "cuenta.nuevaContrasena": "Nueva contraseña",
  "cuenta.cambiosGuardados": "Cambios guardados",
  "cuenta.panelAdmin": "Panel de administración",
  "cuenta.cerrarSesion": "Cerrar sesión",
  "cuenta.eliminarCuenta": "Eliminar cuenta",
  "cuenta.error.cargar": "Error al cargar los datos",
  "cuenta.error.guardar": "Error al guardar los cambios",
  "cuenta.error.foto": "Error al subir la foto",
  "cuenta.error.eliminar": "Error al eliminar la cuenta",

  // ── Mi cuenta · el pop-up de eliminar ──────────────────────────────────
  // Para borrar hacen falta dos cosas: la contraseña y escribir una palabra
  // exacta. La palabra se traduce (`cuenta.borrar.palabra`) y la comprobación
  // la lee de aquí: si se escribiera a mano en el código, en inglés pediría una
  // palabra española y no habría manera de acertarla.
  "cuenta.borrar.titulo": "¿Seguro que quieres eliminar tu cuenta?",
  "cuenta.borrar.aviso":
    "Todos tus datos se borrarán y no podrás recuperarlos. No se devolverá lo abonado. No se guardará tu información personalizada.",
  "cuenta.borrar.tuContrasena": "TU CONTRASEÑA",
  "cuenta.borrar.contrasena": "Contraseña",
  "cuenta.borrar.palabra": "BORRAR",
  /** «ESCRIBE **BORRAR** PARA CONFIRMAR», partido porque la palabra va en negrita. */
  "cuenta.borrar.escribe": "ESCRIBE",
  "cuenta.borrar.paraConfirmar": "PARA CONFIRMAR",
  "cuenta.borrar.eliminando": "Eliminando…",

  // ── Popup de la comunidad (primera vez que entra) ─────────────────────
  "comunidadPopup.titulo": "¿Te unes a la comunidad?",
  "comunidadPopup.texto": "Tenemos una comunidad de WhatsApp donde compartimos el camino, las dudas y las novedades de El Mapa. Nos encantaría tenerte.",
  "comunidadPopup.soloUnaVez": "Este aviso no volverá a salir. Si más adelante quieres unirte, ve a Contactar y pulsa en Comunidad.",
  "comunidadPopup.unirme": "Unirme",
  "comunidadPopup.ahoraNo": "Ahora no",

  // ── Regalo de cumpleaños (/cumple) ────────────────────────────────────
  "cumple.titulo": "Feliz cumpleaños",
  "cumple.subtitulo": "Elige la disciplina que quieras: hoy es tuya a mitad de precio.",
  "cumple.nota": "El regalo vale para una disciplina.",
  "cumple.todasTuyas": "¡Ya tienes todas las disciplinas! Gracias por hacer El Mapa entero. Feliz cumpleaños.",
  "cumple.motivo.invalido": "Este enlace no es válido. Abre el botón del correo de felicitación tal cual te llegó.",
  "cumple.motivo.otraCuenta": "Este regalo es de otra cuenta. Inicia sesión con la cuenta a la que llegó el correo.",
  "cumple.motivo.caducado": "Este regalo ha caducado: tenía siete días desde tu cumpleaños.",
  "cumple.motivo.usado": "Este regalo ya lo has usado. ¡Que disfrutes de tu disciplina!",
} as const;
