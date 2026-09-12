/** Ilustraciones, Libros, la descarga tras comprar y Productos naturales. */
export const tienda = {
  // ── Ilustraciones (/ilustraciones) ─────────────────────────────────────
  "ilustraciones.titulo": "Ilustraciones",
  "ilustraciones.subtitulo": "Todas las ilustraciones del Mapa, reunidas. Pulsa una para leerla.",
  // Subtítulo cuando la galería va filtrada por una disciplina
  // (/ilustraciones/:disciplina). El titular es el nombre de la disciplina.
  "ilustraciones.deDisciplina": "Las ilustraciones de esta disciplina. Pulsa una para leerla.",
  "ilustraciones.vacio": "Esta disciplina todavía no tiene ilustraciones. Están de camino.",

  // ── Libros (/libros) ───────────────────────────────────────────────────
  "libros.titulo": "Libros",
  "libros.subtitulo": "Más de 40 libros para acompañar tu camino",
  "libros.pagoError": "No se pudo iniciar el pago",
  "libros.pagoErrorTexto": "Inténtalo de nuevo en un momento.",

  // ── Descarga del libro comprado (/descargar-libro) ─────────────────────
  "descarga.verificando": "Verificando tu compra…",
  "descarga.unMomento": "Un momento, por favor.",
  "descarga.gracias": "¡Gracias por tu compra!",
  "descarga.instrucciones":
    "Tu descarga de **{titulo}** debería haberse iniciado automáticamente. Si no ha ocurrido, pulsa el botón:",
  "descarga.boton": "Descargar PDF ↓",
  "descarga.fallo": "No hemos podido completar la descarga",
  "descarga.volver": "← Volver a libros",
  "descarga.sinSesion": "Falta el identificador de sesión.",
  "descarga.sinPagar": "El pago aún no se ha completado.",
  "descarga.sinVerificar": "No hemos podido verificar la compra.",
  "descarga.sinVerificarContacto":
    "No hemos podido verificar la compra. Contacta con nosotros si el cobro se hizo.",

  // ── Productos naturales (/productos) ───────────────────────────────────
  "productos.titulo": "Productos Naturales",
  "productos.intro":
    "Cada producto nace de un proceso artesanal, con ingredientes seleccionados por su pureza y su poder sanador. Porque cuidarse es un acto de Amor propio, y mereces lo mejor que la madre tierra tiene para ofrecerte.",
  "productos.verMas": "Ver más →",
  "productos.guardarFavorito": "Guardar en favoritos",
  "productos.quitarFavorito": "Quitar de favoritos",
} as const;
