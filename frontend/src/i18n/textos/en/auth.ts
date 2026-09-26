export const auth = {
  // ── Field labels (uppercase) ───────────────────────────────────────────
  "auth.campo.nombreOEmail": "NAME OR EMAIL",
  "auth.campo.nombre": "NAME",
  "auth.campo.email": "EMAIL",
  "auth.campo.telefono": "PHONE (OPTIONAL)",
  "auth.campo.fechaNacimiento": "DATE OF BIRTH (OPTIONAL)",
  "auth.campo.contrasena": "PASSWORD",
  "auth.campo.repiteContrasena": "REPEAT PASSWORD",
  "auth.campo.nuevaContrasena": "NEW PASSWORD",
  "auth.campo.repitela": "REPEAT IT",
  "auth.contrasena.mostrar": "Show password",
  "auth.contrasena.ocultar": "Hide password",

  // ── Log in ─────────────────────────────────────────────────────────────
  "auth.login.titulo": "Log in",
  "auth.login.subtitulo": "Log in to your Map account",
  // «Entrar» en español es más corto que el título; en inglés lo natural es
  // repetir «Log in» en el botón — «Enter» suena a puerta, no a sesión.
  "auth.login.entrar": "Log in",
  "auth.login.olvidada": "Forgotten your password?",
  "auth.login.sinCuenta": "No account yet? Create one",
  "auth.login.bienvenido": "Welcome",
  "auth.login.preparando": "I'm getting it ready for you",
  "auth.login.confirmada": "Account confirmed",
  "auth.login.confirmadaTexto": "You can now log in with your name or email and your password.",
  "auth.login.pendienteTexto": "Click the link we've sent you to confirm your account, then log in here with your name or email and your password.",
  "auth.login.sinConfirmar": "Your account isn't confirmed yet",
  "auth.login.sinConfirmarTexto": "Click the link in the email we sent you when you signed up. Check your spam or promotions folder too.",
  "auth.login.reenviar": "Didn't get it? Send it again",
  "auth.login.reenviado": "Done. If the account is waiting to be confirmed, a new email is on its way.",

  // ── Create account ─────────────────────────────────────────────────────
  "auth.signin.titulo": "Create account",
  "auth.signin.subtitulo": "Create your account at no cost",
  "auth.signin.trato": "HOW WOULD YOU LIKE ME TO ADDRESS YOU?",
  "auth.signin.tratoEl": "He",
  "auth.signin.tratoElla": "She",
  "auth.signin.boton": "Sign up",
  "auth.signin.yaTienes": "Already have an account? Log in",
  "auth.signin.creada": "Account created!",
  "auth.signin.creadaTexto": "We'll carry on in a moment...",
  "auth.signin.fechaRegalo": "On your birthday you'll get a gift by email: 50% off one discipline.",
  "auth.signin.miraCorreo": "Check your email",
  "auth.signin.miraCorreoTexto": "Your account has been created. To activate it, click the link we've just sent to:",
  "auth.signin.miraCorreoSpam": "After that you can log in with your name or email and your password. If you can't see it in a few minutes, check your spam or promotions folder.",
  "auth.signin.entendido": "Got it",

  // ── Reset password ─────────────────────────────────────────────────────
  "auth.recuperar.titulo": "Reset password",
  "auth.recuperar.tituloNueva": "New password",
  "auth.recuperar.subtitulo": "We'll send a link to your account's email",
  "auth.recuperar.subtituloNueva": "Choose the password you'll use from now on",
  "auth.recuperar.enviarEnlace": "Send link",
  "auth.recuperar.volver": "Back to log in",
  "auth.recuperar.faltaEmail": "Email missing",
  "auth.recuperar.escribeEmail": "Type your account's email",
  "auth.recuperar.miraCorreo": "Check your inbox",
  "auth.recuperar.enlaceEnviado":
    "If that email has an account, we've just sent a link to choose a new password. It expires in one hour.",
  "auth.recuperar.cambiada": "Password changed",
  "auth.recuperar.cambiadaTexto": "You can log in with the new one now. Taking you to the login page…",

  // ── Validation notices ─────────────────────────────────────────────────
  "auth.error.faltanDatos": "Missing details",
  "auth.error.rellena": "Fill in every field",
  "auth.error.emailInvalido": "Invalid email",
  "auth.error.emailCorrecto": "Enter a valid email address",
  "auth.error.contraCorta": "Password too short",
  "auth.error.contraCorta4": "Use at least 4 characters",
  "auth.error.contraCorta6": "It must be at least 6 characters",
  "auth.error.noCoinciden": "The passwords don't match",
  "auth.error.noCoincidenTexto": "Type the same password in both fields",
  "auth.error.noCoincidenCorto": "They don't match",
  "auth.error.dosIguales": "Both passwords have to be the same",
  "auth.error.telefonoInvalido": "Invalid phone number",
  "auth.error.telefonoCorrecto": "Use numbers only, with the country code if you like (+44…), or leave it blank",

  // ── Server errors (gestionaError) ──────────────────────────────────────
  "auth.error.generico": "Error",
  "auth.error.masTarde": "Please try again later",
  "auth.error.desconocido": "Unknown error",

  // ── My account (/cuenta) ───────────────────────────────────────────────
  "cuenta.titulo": "My account",
  "cuenta.foto.tocaParaCambiar": "Tap the photo to change it",
  "cuenta.foto.subiendo": "Uploading…",
  "cuenta.nuevaContrasena": "New password",
  "cuenta.cambiosGuardados": "Changes saved",
  "cuenta.panelAdmin": "Admin panel",
  "cuenta.cerrarSesion": "Log out",
  "cuenta.eliminarCuenta": "Delete account",
  "cuenta.error.cargar": "Couldn't load your details",
  "cuenta.error.guardar": "Couldn't save your changes",
  "cuenta.error.foto": "Couldn't upload the photo",
  "cuenta.error.eliminar": "Couldn't delete the account",

  // ── My account · the delete pop-up ─────────────────────────────────────
  // The word to type is translated too, and the check reads it from here: in
  // English the form has to ask for DELETE, not for BORRAR.
  "cuenta.borrar.titulo": "Are you sure you want to delete your account?",
  "cuenta.borrar.aviso":
    "All your data will be erased and you won't be able to get it back. Nothing you've paid will be refunded. None of your personalized information will be kept.",
  "cuenta.borrar.tuContrasena": "YOUR PASSWORD",
  "cuenta.borrar.contrasena": "Password",
  "cuenta.borrar.palabra": "DELETE",
  "cuenta.borrar.escribe": "TYPE",
  "cuenta.borrar.paraConfirmar": "TO CONFIRM",
  "cuenta.borrar.eliminando": "Deleting…",

  // ── Community popup (first time in) ──────────────────────────────────
  "comunidadPopup.titulo": "Will you join the community?",
  "comunidadPopup.texto": "We have a WhatsApp community where we share the journey, questions and news about the Map. We'd love to have you.",
  "comunidadPopup.soloUnaVez": "This message won't appear again. If you want to join later, go to Contact and tap Community.",
  "comunidadPopup.unirme": "Join",
  "comunidadPopup.ahoraNo": "Not now",

  // ── Birthday gift (/cumple) ──────────────────────────────────────────
  "cumple.titulo": "Happy birthday",
  "cumple.subtitulo": "Choose any discipline: today it's yours at half price.",
  "cumple.nota": "The gift is valid for one discipline.",
  "cumple.todasTuyas": "You already have every discipline! Thank you for walking the whole Map. Happy birthday.",
  "cumple.motivo.invalido": "This link isn't valid. Open the button in your birthday email exactly as it arrived.",
  "cumple.motivo.otraCuenta": "This gift belongs to another account. Log in with the account the email was sent to.",
  "cumple.motivo.caducado": "This gift has expired: it lasted seven days from your birthday.",
  "cumple.motivo.usado": "You've already used this gift. Enjoy your discipline!",
};
