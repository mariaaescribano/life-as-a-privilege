/**
 * Piezas comunes del sitio público: la tarjeta de la creadora, la caja de
 * suscripción y la página 404. Las páginas grandes tienen su propio módulo.
 */
export const web = {
  // ── 404 ────────────────────────────────────────────────────────────────
  "web.404.titulo": "Esta página no existe",
  "web.404.texto":
    "Puede que el enlace esté mal escrito o que la página se haya movido de sitio. Vuelve al inicio y sigue el camino desde ahí.",
  "web.404.inicio": "Ir al inicio",
  "web.404.recorrido": "Ver El Recorrido",

  // ── Páginas legales ────────────────────────────────────────────────────
  // El cuerpo de los textos legales NO se traduce (ver el aviso de abajo): son
  // documentos que obligan y citan la ley española (LSSI, RGPD, TRLGDCU).
  "legal.ultimaActualizacion": "Última actualización: {fecha}",
  "legal.soloEspanol":
    "Los textos legales de este sitio están disponibles únicamente en español, que es su versión válida.",

  // ── Materiales (/materiales) ───────────────────────────────────────────
  "materiales.subtitulo": "Contenido creado y seleccionado por María",
  "materiales.ilustraciones": "Ilustraciones",
  "materiales.libros": "Libros",

  // ── Vídeos (/videos) ───────────────────────────────────────────────────
  "videos.subtitulo": "",
  "videos.vacio": "Todavía no hay vídeos publicados. Vuelve pronto.",
  "videos.fuera": "Este vídeo no se puede ver aquí dentro.",
  "videos.abrirEn": "Abrir en {red}",

  // ── Tarjeta de la creadora (CreadoraCard) ──────────────────────────────
  "creadora.accion": "Conocer a la creadora",
  "creadora.bio":
    "Ingeniera informática. Reconstruí el camino que muchas personas recorremos durante años intentando comprendernos: un mapa donde la psicología, la biología y los conocimientos tradicionales se combinan en vez de pelearse. Ahora son aliados al servicio de tu crecimiento.",

  // ── Caja de suscripción (SubscribeBox) ─────────────────────────────────
  "suscribir.titulo": "No te pierdas nada.",
  "suscribir.texto": "Cuando publique nuevos contenidos serás el primero en saberlo.",
  "suscribir.placeholder": "Tu email",
  "suscribir.boton": "Suscribirme",
  "suscribir.ok": "Registrado correctamente",
  "suscribir.gracias": "Gracias por querer aprender",
  "suscribir.invalido": "Introduce un email válido",
  "suscribir.error": "No se pudo enviar. Inténtalo de nuevo en un momento.",

  // ── Aviso de cookies (la barra de abajo, no la página legal) ───────────
  "cookies.aviso":
    "Usamos cookies propias necesarias para que la web funcione y para mantener tu sesión iniciada. Nos gustaría usar también cookies de Google Analytics para entender cómo se usa el sitio y mejorarlo, pero **solo si tú lo autorizas**.",
  "cookies.masInfo": "Más información",
  "cookies.rechazar": "Rechazar",
  "cookies.aceptar": "Aceptar",

  // ── Pantalla de error (ErrorBoundary) ──────────────────────────────────
  "error.titulo": "Algo se ha torcido por un momento",
  "error.texto":
    "No te preocupes: tus datos están guardados. Vuelve a cargar la página para continuar.",
  "error.recargar": "Recargar",

  // ── Reservar una llamada (BookCallModal, AgendarLlamada, BotonCompania) ─
  "llamada.agenda": "Agenda una llamada",
  "llamada.reserva": "Reserva tu llamada",
  "llamada.gratis": "20 minutos, sin coste · horario peninsular España",
  "llamada.elegirDia": "Elige un día",
  "llamada.elegirHora": "Elige una hora",
  "llamada.cambiarDia": "← Cambiar día",
  "llamada.tusDatos": "Tus datos",
  "llamada.nombre": "Tu nombre",
  "llamada.email": "Tu email",
  "llamada.tema": "¿De qué te gustaría hablar? (opcional)",
  "llamada.pagoSeguro": "Pago seguro con tarjeta a través de Stripe.",
  "llamada.confirmada": "¡Reserva confirmada!",
  "llamada.reservada": "¡Llamada reservada!",
  "llamada.confirmandoPago": "Confirmando tu pago…",
  "llamada.confirmandoTexto": "Un momento, estamos confirmando tu reserva.",
  "llamada.reservarOtra": "Reservar otra",
  "llamada.continuarPago": "Continuar al pago →",
  "llamada.pago": "Pago",
  "llamada.fecha": "Fecha",
  "llamada.hora": "Hora",
  "llamada.total": "Total",
  "llamada.cambiarHora": "← Cambiar hora",
  "llamada.volver": "← Volver",
  "llamada.entendido": "Entendido",
  "llamada.queEsEsto": "¿Qué es esto?",
  "llamada.acompanar": "Agenda tu llamada →",
  "llamada.acompanarTexto":
    "Puedes recorrer este tramo conmigo. Agenda una llamada, no hace falta hacerlo todo de forma individual.",

  // ── Modal de salida (ExitIntentSubscribeModal) ─────────────────────────
  "salida.titulo": "Antes de irte...",
  "salida.texto": "Suscríbete y recibe un email cuando haya contenido nuevo.",
  "salida.noGracias": "No, gracias",

  // ── Hace falta cuenta (LoginRequiredModal) ─────────────────────────────
  "login.necesaria": "Crea una cuenta o inicia sesión",
  "login.entrar": "Iniciar sesión →",

  // ── Mis notas (MiniDiario) ─────────────────────────────────────────────
  "diario.titulo": "Mis notas",
  "diario.abrir": "Abrir mis notas",
  "diario.borrarNota": "Borrar nota",
  "diario.volverEscribir": "← Volver a escribir",
  "diario.escribir": "¿Qué quieres escribir?",
  "diario.verNotas": "← Ver mis notas",
  "diario.vacio": "Todavía no has escrito ninguna nota.",

  // ── Banner de productos ────────────────────────────────────────────────
  "productos.titulo": "Productos Naturales",
  "productos.lema": "Cuídate con ingredientes naturales y el Amor de la madre tierra.",
  "productos.texto":
    "Descubre todos los productos hechos con ingredientes naturales y Amor. Cuídate con las herramientas que nos ha dado la madre tierra.",
  "productos.verMas": "Ver más →",

  // ── Compra de acceso (SubscribeModal) ──────────────────────────────────
  "acceso.email":
    "Introduce el email con el que quieres acceder a los cursos. Después te llevaremos al pago seguro y, una vez confirmado, recibirás tu código de acceso por correo.",
  "acceso.apuntarme": "Quiero apuntarme",
  "acceso.preparando": "Preparando…",
  "acceso.continuarPago": "Continuar al pago",
  "acceso.recibidos": "Datos recibidos",
  "acceso.irPago": "Ir al pago →",
  "acceso.pack": "Pack completo",
  "acceso.incluye": "acceso 1 año a cursos y materiales · consultas aparte",
  "acceso.pagarTexto":
    "Pulsa el botón para completar el pago de **{precio}** en Stripe. Una vez confirmado, recibirás tu código de acceso por email.",

  // ── Lista de espera (WaitlistModal) ────────────────────────────────────
  "espera.texto":
    "Actualmente está en proceso de desarrollo. Deja tu email para ser de los primeros en avisar.",
  "espera.gracias": "¡Gracias!",
  "espera.aviso": "Te avisaré en cuanto El Mapa esté disponible.",

  // ── Sueltos ────────────────────────────────────────────────────────────
  "foto.etiqueta": "Ampliar",
  "foto.ampliar": "Pulsa para verla más grande",
  "experiencias.titulo": "Experiencias reales",
  "experiencias.cierre": "Si ellos encontraron respuestas aquí, tú también puedes.",
  "experiencias.verMas": "Ver más experiencias →",
  "libros.descargarPdf": "Descargar PDF",
  "libros.condiciones": "condiciones de compra",
} as const;
