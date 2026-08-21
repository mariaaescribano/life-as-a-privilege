/**
 * /aprendizaje — cursos, lecciones, herbario y alimentos.
 * Incluye también las dos páginas sueltas de /espacio (Mi Espacio y Tus células).
 *
 * OJO: el CONTENIDO de los cursos (títulos, descripciones, lecciones) vive en la
 * base de datos, no aquí; y las fichas de plantas y alimentos están en
 * `components/recursos/**`. Esto es solo el marco de la sección.
 */
export const aprendizaje = {
  // ── Portada de cursos (/aprendizaje/aprendizajeHome) ────────────────────
  // En mayúsculas porque el título va con `textTransform: uppercase`; se deja
  // así en el diccionario para que se vea igual que en pantalla.
  "aprendizaje.titulo": "CURSOS Y DISCIPLINAS",
  "aprendizaje.lema": "Ocho perspectivas. Un ser humano.",

  // ── Cursos de una disciplina (/aprendizaje/cursos/:disciplina) ──────────
  "aprendizaje.enConstruccion": "Disciplina en construcción.",
  "aprendizaje.cursoNoEncontrado": "Curso no encontrado.",
  "aprendizaje.leccionNoEncontrada": "Lección no encontrada.",
  "aprendizaje.sinContenido": "Este curso aún no tiene contenido.",
  "aprendizaje.cursosDe": "Cursos de {disciplina}",

  // Botones extra del header de cada disciplina.
  "aprendizaje.btn.ilustraciones": "Ilustraciones",
  "aprendizaje.btn.testDoshas": "Test de los Doṣhas",
  "aprendizaje.btn.cartasHistoricas": "Cartas de Personajes Históricos",
  "aprendizaje.btn.herbario": "Herbario",
  "aprendizaje.btn.alimentos": "Alimentos",
  "aprendizaje.btn.calcularNecesidades": "Calcular necesidades",

  // ── Tarjeta de curso ────────────────────────────────────────────────────
  "curso.accesoLibre": "Acceso Libre",
  "curso.comenzar": "Comenzar",
  "curso.pagar": "Pagar",
  // Singular y plural como claves separadas: en inglés no se forma igual y
  // calcularlo con una «s» al final solo funciona por casualidad.
  "curso.leccion": "lección",
  "curso.lecciones": "lecciones",
  "curso.ejercicio": "ejercicio",
  "curso.ejercicios": "ejercicios",
  "curso.contenido": "Contenido del curso",

  // ── Lección (/aprendizaje/leccion/...) ──────────────────────────────────
  "leccion.volverAlCurso": "Volver al curso",
  "leccion.esLaPrimera": "Es la primera lección",
  "leccion.esLaUltima": "Es la última lección",
  "leccion.transcripcion": "Transcripción",
  "leccion.velocidad": "Velocidad",
  "leccion.videoNoDisponible": "Este vídeo todavía no está disponible.",

  // ── Test dentro de un curso ─────────────────────────────────────────────
  "test.sinEjercicios": "Este test todavía no tiene ejercicios.",
  "test.verdadero": "Verdadero",
  "test.falso": "Falso",
  "test.elige": "Elige…",

  // ── Popup de los tests de Medicina China ────────────────────────────────
  "tcmTests.titulo": "Tests de Medicina China",
  "tcmTests.subtitulo": "Elige el test que quieras hacer.",
  "tcmTests.constitucion": "Constitución",
  "tcmTests.elemento": "Elemento",
  "tcmTests.desequilibrio": "Desequilibrio",

  // ── Herbario (/aprendizaje/herbario) ────────────────────────────────────
  "herbario.titulo": "Herbario",
  "herbario.favoritos": "Mis plantas favoritas",
  "herbario.sinFavoritos": "Aún no tienes plantas marcadas como favoritas.",

  // ── Alimentos (/aprendizaje/alimentos) ──────────────────────────────────
  "alimentos.titulo": "Alimentos",
  "alimentos.favoritos": "Mis alimentos favoritos",
  "alimentos.sinFavoritos": "Aún no tienes alimentos marcados como favoritos.",

  // Secciones de la ficha de una planta o un alimento.
  // ── Modal de servicios de astrología (lecturas de carta) ───────────────
  // El precio NO está aquí: lo pone el propio modal, con su moneda.
  "astroServicios.titulo": "✦ Servicios Astrológicos ✦",
  "astroServicios.ascSolLuna": "Conocer mi Ascendente, Sol y Luna en profundidad",
  "astroServicios.lectura": "Lectura de carta astral",
  "astroServicios.lecturaProfunda": "Lectura en profundidad de carta astral",
  "astroServicios.tuEmail": "Tu email",
  "astroServicios.enviado": "¡Mensaje enviado!",
  "astroServicios.enviadoPie": "Muy pronto me pondré en contacto contigo.",
  "astroServicios.error": "Ha ocurrido un error. Por favor, inténtalo de nuevo.",

  "ficha.beneficios": "Beneficios",
  "ficha.formaDeUso": "Forma de uso",
  "ficha.comoConsumirlo": "Cómo consumirlo",
  "ficha.datosCuriosos": "Datos curiosos",
  "ficha.precauciones": "Precauciones",
  "ficha.tipo.fruta": "fruta",
  "ficha.tipo.verdura": "verdura",

  // ── Mi Espacio (/espacio/espacioHome) ───────────────────────────────────
  "espacio.titulo": "Mi Espacio",
  "espacio.tusCelulas": "Tus células",
} as const;
