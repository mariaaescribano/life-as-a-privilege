export const auth = {
  // ── Field labels (uppercase) ───────────────────────────────────────────
  "auth.campo.nombreOEmail": "NAME OR EMAIL",
  "auth.campo.nombre": "NAME",
  "auth.campo.email": "EMAIL",
  "auth.campo.telefono": "PHONE (OPTIONAL)",
  "auth.campo.fechaNacimiento": "DATE OF BIRTH (OPTIONAL)",
  "auth.campo.contrasena": "PASSWORD",
  "auth.campo.repiteContrasena": "REPEAT THE PASSWORD",
  "auth.campo.nuevaContrasena": "NEW PASSWORD",
  "auth.campo.repitela": "REPEAT IT",
  "auth.contrasena.mostrar": "Show password",
  "auth.contrasena.ocultar": "Hide password",

  // ── Log in ─────────────────────────────────────────────────────────────
  "auth.login.titulo": "Log in",
  "auth.login.subtitulo": "Log in to your account on The Map",
  // «Entrar» is shorter than the title in Spanish; in English the natural
  // thing is to repeat "Log in" on the button — "Enter" sounds like a door,
  // not a session.
  "auth.login.entrar": "Log in",
  "auth.login.olvidada": "Forgot your password?",
  "auth.login.sinCuenta": "Don't have an account? Create account",
  "auth.login.bienvenido": "Welcome",
  "auth.login.preparando": "I'm getting it ready for you",
  "auth.login.confirmada": "Account confirmed",
  "auth.login.confirmadaTexto": "You can now log in with your name or your email and your password.",
  "auth.login.pendienteTexto": "Click the link we've sent you to confirm your account, then log in here with your name or your email and your password.",
  "auth.login.sinConfirmar": "Your account isn't confirmed yet",
  "auth.login.sinConfirmarTexto": "Click the link in the email we sent you when you created it. Check spam or promotions too.",
  "auth.login.reenviar": "Didn't get it? Send it to me again",
  "auth.login.reenviado": "Done. If the account is waiting to be confirmed, a new email just arrived for you.",

  // ── Create account ─────────────────────────────────────────────────────
  "auth.signin.titulo": "Create account",
  "auth.signin.subtitulo": "No cost at all",
  "auth.signin.trato": "HOW WOULD YOU PREFER I ADDRESS YOU?",
  "auth.signin.tratoEl": "He",
  "auth.signin.tratoElla": "She",
  "auth.signin.boton": "Sign up",
  "auth.signin.yaTienes": "Already have an account? Log in",
  "auth.signin.creada": "Account created!",
  "auth.signin.creadaTexto": "We'll continue in a moment...",
  "auth.signin.fechaRegalo": "On your birthday you'll get 50% off one discipline.",
  "auth.signin.miraCorreo": "Check your email",
  "auth.signin.miraCorreoTexto": "Your account is created. To activate it, click the link we just sent to:",
  "auth.signin.miraCorreoSpam": "After that you'll be able to log in with your name or your email and your password. If you don't see it within a few minutes, check spam or promotions.",
  "auth.signin.entendido": "Got it",
  /** The required terms checkbox. The full legal text (the fine print that
   *  used to sit under the form) lives in the "learn more" popup, which
   *  reuses privacidad.infoRegistro. */
  "auth.signin.aceptar": "Accept the terms",
  "auth.signin.saberMas": "learn more",
  "auth.signin.condiciones.titulo": "Terms and privacy",

  // ── Reset password ─────────────────────────────────────────────────────
  "auth.recuperar.titulo": "Reset password",
  "auth.recuperar.tituloNueva": "New password",
  "auth.recuperar.subtitulo": "We'll send a link to your account's email",
  "auth.recuperar.subtituloNueva": "Choose the password you'll log in with from now on",
  "auth.recuperar.enviarEnlace": "Send link",
  "auth.recuperar.volver": "Back to log in",
  "auth.recuperar.faltaEmail": "Missing email",
  "auth.recuperar.escribeEmail": "Type your account's email",
  "auth.recuperar.miraCorreo": "Check your email",
  "auth.recuperar.enlaceEnviado":
    "If that email has an account, we just sent you a link to choose a new password. It expires in one hour.",
  "auth.recuperar.cambiada": "Password changed",
  "auth.recuperar.cambiadaTexto": "You can now log in with the new one. Taking you to the login page…",

  // ── Validation notices ─────────────────────────────────────────────────
  "auth.error.faltanDatos": "Missing information",
  "auth.error.rellena": "Fill in all the fields",
  "auth.error.condiciones": "You haven't accepted the terms",
  "auth.error.condicionesTexto": "Check the “Accept the terms” box to create your account.",
  "auth.error.emailInvalido": "Invalid email",
  "auth.error.emailCorrecto": "Enter a valid email",
  "auth.error.contraCorta": "Password too short",
  "auth.error.contraCorta4": "Use at least 4 characters",
  "auth.error.contraCorta6": "It has to be at least 6 characters",
  "auth.error.noCoinciden": "The passwords don't match",
  "auth.error.noCoincidenTexto": "Type the same password in both fields",
  "auth.error.noCoincidenCorto": "They don't match",
  "auth.error.dosIguales": "The two passwords have to be the same",
  "auth.error.telefonoInvalido": "Invalid phone number",
  "auth.error.telefonoCorrecto": "Type numbers only, with the country code if you want (+34…), or leave it blank",

  // ── Server errors (gestionaError) ──────────────────────────────────────
  // NOTE: when the backend sends its own `message`, that text arrives in
  // Spanish and does NOT pass through here. Translating it is the backend's job.
  "auth.error.generico": "Error",
  "auth.error.masTarde": "Try again later",
  "auth.error.desconocido": "Unknown error",

  // ── My account (/cuenta) ───────────────────────────────────────────────
  // The field labels are the same ones above (`auth.campo.*`): it's the same
  // form, only here it gets edited instead of filled in.
  "cuenta.titulo": "My account",
  "cuenta.foto.tocaParaCambiar": "Tap the photo to change it",
  "cuenta.foto.subiendo": "Uploading…",
  "cuenta.nuevaContrasena": "New password",
  /** The box next to the date: you don't type it, it's calculated from the date. */
  "cuenta.edad": "AGE",
  "cuenta.edad.anios": "years old",
  "cuenta.cambiosGuardados": "Changes saved",
  "cuenta.panelAdmin": "Admin panel",
  "cuenta.cerrarSesion": "Log out",
  "cuenta.eliminarCuenta": "Delete account",
  "cuenta.error.cargar": "Couldn't load the data",
  "cuenta.error.guardar": "Couldn't save the changes",
  "cuenta.error.foto": "Couldn't upload the photo",
  "cuenta.error.eliminar": "Couldn't delete the account",

  // ── My account · the delete pop-up ─────────────────────────────────────
  // Deleting takes two things: the password and typing an exact word. The
  // word is translated (`cuenta.borrar.palabra`) and the check reads it from
  // here: if it were hardcoded, in English the form would ask for a Spanish
  // word and there'd be no way to get it right.
  "cuenta.borrar.titulo": "Are you sure you want to delete your account?",
  "cuenta.borrar.aviso":
    "All your data will be erased and you won't be able to get it back. Payments won't be refunded. Your personalized information won't be kept.",
  "cuenta.borrar.tuContrasena": "YOUR PASSWORD",
  "cuenta.borrar.contrasena": "Password",
  "cuenta.borrar.palabra": "DELETE",
  /** "TYPE **DELETE** TO CONFIRM", split up because the word goes in bold. */
  "cuenta.borrar.escribe": "TYPE",
  "cuenta.borrar.paraConfirmar": "TO CONFIRM",
  "cuenta.borrar.eliminando": "Deleting…",

  // ── Community popup (first time in) ────────────────────────────────────
  "comunidadPopup.titulo": "JOIN THE COMMUNITY",
  "comunidadPopup.texto": "We have a WhatsApp community where we share the journey, our questions and news about The Map. We'd love to have you.",
  "comunidadPopup.soloUnaVez": "This notice won't show up again. If you want to join later on, go to Contact and tap Community.",
  "comunidadPopup.unirme": "Join",
  "comunidadPopup.ahoraNo": "Not now",

  // ── Birthday gift (/cumple) ────────────────────────────────────────────
  "cumple.titulo": "Happy birthday",
  "cumple.subtitulo": "Pick whichever discipline you want: today it's yours at half price.",
  "cumple.nota": "The gift is good for one discipline.",
  "cumple.todasTuyas": "You already have every discipline! Thank you for doing the whole of The Map. Happy birthday.",
  "cumple.motivo.invalido": "This link isn't valid. Open the button in the birthday email exactly as it arrived.",
  "cumple.motivo.otraCuenta": "This gift belongs to another account. Log in with the account the email went to.",
  "cumple.motivo.caducado": "This gift has expired: it lasted seven days from your birthday.",
  "cumple.motivo.usado": "You've already used this gift. Enjoy your discipline!",
};
