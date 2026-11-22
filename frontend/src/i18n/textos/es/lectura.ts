/** Pedir la carta de la lectura (Astrología → Adquirir) y su confirmación. */
export const lectura = {
  "lectura.titulo": "Tu carta",
  "lectura.nombre": "Tu nombre",
  "lectura.email": "Tu email",
  "lectura.fecha": "Fecha de nacimiento",
  "lectura.hora": "Hora de nacimiento",
  "lectura.lugar": "Lugar de nacimiento (ciudad y país)",
  "lectura.todoObligatorio": "Todos los datos son obligatorios: de ellos sale tu carta.",
  // El aviso sobre la hora y el certificado: el texto que ya tenía María para el estudio.
  "lectura.horaAviso":
    "La hora de nacimiento es el dato más delicado de toda la carta. De ella dependen tu Ascendente y las doce casas: media hora de diferencia puede cambiarte el Ascendente entero. Si la pones «más o menos», la lectura no será correcta.",
  "lectura.certificadoTitulo": "Si naciste en España: ¡PIDE TU CERTIFICADO!",
  "lectura.certificadoTexto":
    "Pide el certificado literal de nacimiento en el Registro Civil (se solicita gratis y en línea) y mira la hora que figura ahí. No la de memoria, ni la que recuerda la familia: la del certificado.",
  "lectura.certificadoBoton": "Pedir mi certificado de nacimiento",
  // PROVISIONAL (propuesto, a revisar por María): el aviso de responsabilidad sobre la hora.
  "lectura.responsabilidad":
    "Si la hora de nacimiento que indico no es la correcta, la lectura saldrá distinta de la real y María no se hace responsable del resultado.",
  "lectura.acepto": "He leído el aviso y lo entiendo",
  "lectura.pagar": "Continuar al pago →",
  "lectura.enviando": "Un momento…",
  "lectura.cancelado": "Has cancelado el pago. No se ha cobrado nada ni se ha enviado tu pedido.",
  "lectura.error.datos": "Revisa los datos: faltan campos o alguno no es válido.",
  "lectura.error.generico": "No se pudo iniciar el pago. Inténtalo de nuevo en un momento.",
  "lectura.error.aviso": "Tienes que aceptar el aviso para continuar.",
  "lectura.confirmando": "Confirmando tu pago…",
  "lectura.confirmado": "Registro confirmado",
  // PROVISIONAL (propuesto, a revisar por María): lo que ve la persona al acabar de pagar.
  "lectura.confirmadoTexto":
    "He recibido tu pago y tus datos. Te acabo de enviar un correo de confirmación. Cuando tu carta esté lista, te llegará el acceso a tu cuenta.",
  "lectura.confirmadoError": "No se pudo confirmar el pago. Escríbeme y lo resolvemos.",
} as const;
