/**
 * El Recorrido (/metodo) — piezas COMPARTIDAS por las ocho disciplinas.
 *
 * Aquí va el andamiaje que sale en todas las páginas: el índice, la marca de
 * leído, el visor de cómic, los botones de ayuda, los modales de pago y los
 * popups de ilustraciones. El contenido propio de cada disciplina (las lecturas,
 * los tests, las fichas) NO cabe en un diccionario de cadenas: eso va en
 * ficheros `.en.ts` paralelos, como en `OrganosFisiologia.en.ts`.
 */
export const metodo = {
  // ── Índice del mapa ────────────────────────────────────────────────────
  "metodo.indice": "Índice",
  "metodo.indiceMapa": "Índice del mapa",
  "metodo.abrirIndice": "Abrir índice del mapa",

  // ── Marca de leído ─────────────────────────────────────────────────────
  /** En femenino: acompaña a «viñeta», «ficha», «ilustración». */
  "metodo.leida": "Leída",

  // ── Visor de cómic ─────────────────────────────────────────────────────
  "metodo.volverMenu": "Volver al menú",
  "metodo.vinetaProximamente": "Viñeta {n} próximamente",

  // ── Botones de ayuda de cada paso (AyudaRecorrido) ─────────────────────
  "metodo.ayuda.orientacion": "Orientación",
  "metodo.ayuda.ejemplo": "Ejemplo",
  "metodo.ayuda.orientacionLibre": "Orientación de acceso libre",
  "metodo.ayuda.cursoPronto": "El curso estará disponible pronto.",
  "metodo.ayuda.prefieresCompania": "¿Prefieres compañía?",
  "metodo.ayuda.recorreConmigo":
    "Recorre el camino conmigo. Agenda una llamada · horario peninsular España",
  /** Rótulos de la ficha de un arquetipo (astrología dentro de psicología). */
  "metodo.ayuda.herida": "Herida",
  "metodo.ayuda.arquetipo": "Arquetipo",
  "metodo.ayuda.relacion": "Relación",

  // ── Compromisos (psicología, y su recordatorio en otras disciplinas) ───
  "metodo.compromiso.noOlvides": "No olvides tus compromisos contigo mismo",
  "metodo.compromiso.tuCompromiso": "Tu compromiso contigo",
  "metodo.compromiso.loQueNecesite": "Lo que necesité que nadie pudo darme",
  "metodo.compromiso.comoDarmelo": "Cómo puedo empezar a dármelo hoy",
  "metodo.compromiso.mio": "Mi compromiso",
  "metodo.compromiso.noLoOlvides": "No lo olvides",
  "metodo.compromiso.recordatorio":
    "Esto es lo que te comprometiste a vivir en Psicología. Que te acompañe mientras diseñas tu día.",
  "metodo.compromiso.presente": "Lo tengo presente",
  "metodo.compromiso.ver": "Ver mi compromiso",

  // ── Popups de ilustraciones ────────────────────────────────────────────
  "metodo.ilustraciones": "Ilustraciones",
  "metodo.ilustracionesDe": "Ilustraciones de {disciplina}",
  "metodo.ilustracionesElige": "Elige un capítulo para empezar a leer.",
  "metodo.ilustracionesPronto": "Las ilustraciones de {disciplina} llegarán muy pronto.",
  "metodo.leer": "Leer",
  "metodo.ver": "Ver",
  "metodo.nutriIlustraciones": "Todos los cómics de Nutrición reunidos. Pulsa uno para leerlo.",

  // ── Cursos de la disciplina ────────────────────────────────────────────
  "metodo.cursosOrientativos": "Cursos orientativos de {disciplina}",
  "metodo.cursosPronto": "Pronto encontrarás aquí los cursos de {disciplina}.",
  "metodo.cursosIntro": "Si quieres profundizar en {disciplina}, estos cursos te acompañan paso a paso.",
  /** Estado vacío de la página de cursos: dos frases, título y explicación. */
  "metodo.cursosPreparando": "Estoy preparando los cursos",
  "metodo.cursosDe": "Cursos de {disciplina}",
  "metodo.cursosAvanzadosPronto":
    "Pronto podrás profundizar aquí con cursos avanzados de {disciplina}. Mientras tanto, continúa el Mapa con la siguiente disciplina.",

  // ── «Crea tus propios apuntes» · la pantalla compartida ────────────────
  // Solo los rótulos de la pantalla: los capítulos del cuaderno (su título y su
  // resumen) los pone cada disciplina en su `libroApuntes…`, y de momento van
  // en español —el PDF entero se compone en español—.
  "metodo.apuntes.portada": "La portada",
  "metodo.apuntes.queTeLlevas": "Qué te llevas",
  "metodo.apuntes.todo": "Todo",
  "metodo.apuntes.nada": "Nada",
  "metodo.apuntes.foto": "foto",
  "metodo.apuntes.fotos": "fotos",
  "metodo.apuntes.comoLoQuieres": "Cómo lo quieres",
  "metodo.apuntes.conFotos": "Con ilustraciones",
  "metodo.apuntes.conFotosPie": "como se ve en la web",
  "metodo.apuntes.soloTexto": "Solo texto",
  "metodo.apuntes.soloTextoPie": "ligero para el móvil",
  "metodo.apuntes.sinMarcar": "No has marcado nada todavía: elige arriba lo que quieres llevarte.",
  /** El resumen de abajo: «3 capítulos · 12 ilustraciones · unos 4,2 MB». */
  "metodo.apuntes.capitulo": "capítulo",
  "metodo.apuntes.capitulos": "capítulos",
  "metodo.apuntes.nIlustraciones": "{n} ilustraciones",
  "metodo.apuntes.sinIlustraciones": "sin ilustraciones",
  "metodo.apuntes.unos": "unos {peso}",
  "metodo.apuntes.preparandoFotos": "Preparando las ilustraciones… {hechas}/{total}",
  "metodo.apuntes.componiendo": "Componiendo el cuaderno… {hechas}/{total}",
  "metodo.apuntes.error":
    "No hemos podido montar el PDF. Vuelve a intentarlo; si sigue fallando, prueba sin ilustraciones.",
  "metodo.apuntes.descargar": "Descargar mis apuntes",
  "metodo.apuntes.verlo": "Verlo antes",
  "metodo.apuntes.cerrar": "Cerrar",

  // ── Botones que salen de un cómic hacia el paso siguiente ──────────────
  "metodo.irA": "Ir a {destino}",
  "metodo.destino.nutrientes": "los nutrientes",
  "metodo.destino.moleculas": "Moléculas",
  "metodo.destino.hambre": "El hambre",
  "metodo.destino.plato": "Tu plato",
  "metodo.destino.microbiota": "la microbiota",
  "metodo.destino.test": "el test",

  // ── Botones del recorrido de NUTRICIÓN ─────────────────────────────────
  // El NOMBRE del paso va suelto, sin flecha: el mismo nombre sirve para el
  // botón de ir (`Nombre →`) y para el de volver (`← Nombre`), que es como
  // aparece en cada página vecina. Así un paso se escribe una vez.
  "metodo.nutri.paso.nutricion": "Nutrición",
  "metodo.nutri.paso.nutrientes": "Los nutrientes",
  "metodo.nutri.paso.secundarios": "Nutrientes secundarios",
  "metodo.nutri.paso.secundariosCorto": "Secundarios",
  "metodo.nutri.paso.microbiota": "Microbiota",
  "metodo.nutri.paso.hambre": "El hambre",
  "metodo.nutri.paso.plato": "Tu plato",
  "metodo.nutri.paso.platoCrear": "Crea tu plato",
  "metodo.nutri.paso.calorias": "Tus calorías",
  "metodo.nutri.paso.azucar": "Tu azúcar",
  "metodo.nutri.paso.test": "Test",
  "metodo.nutri.paso.dia": "Diseña tu día",
  "metodo.nutri.paso.macros": "Cuenta lo que comes",
  "metodo.nutri.paso.mitos": "Preguntas y mitos",
  /** Frase bajo el header de la página de mitos. */
  "metodo.nutri.mitos.intro":
    "Estas son algunas de las preguntas y mitos que más se repiten. Toca cada uno para descubrir qué dice de verdad la ciencia.",
  "metodo.nutri.paso.origen": "¿De dónde vienen?",
  "metodo.nutri.paso.cursos": "Cursos",
  /** Los dos nombres largos que solo se ven en el Índice. */
  "metodo.nutri.paso.prediabetes": "Test de prevención",
  "metodo.nutri.paso.cursosProfundizar": "Cursos para profundizar",
  "metodo.nutri.paso.biblioteca": "Biblioteca",
  "metodo.nutri.paso.bibliotecaTitulo": "Biblioteca de Nutrición",
  "metodo.nutri.paso.hambreTitulo": "El hambre: una mirada holística",
  "metodo.nutri.paso.microbiotaTitulo": "La microbiota",
  "metodo.nutri.paso.platoTitulo": "Crea el plato de Harvard",
  "metodo.nutri.paso.caloriasTitulo": "Tus calorías y macros",
  "metodo.nutri.paso.origenTitulo": "¿Cómo se crean los alimentos?",

  // ── Nutrición · la Biblioteca ──────────────────────────────────────────
  "metodo.nutri.biblioteca.intro":
    "Todo lo que has descubierto en Nutrición, reunido en un mismo sitio. Elige por dónde entrar.",
  "metodo.nutri.biblioteca.molecular": "Alimentación molecular",
  "metodo.nutri.biblioteca.molecularPie":
    "Elige un alimento y descubre de qué moléculas está hecho.",
  "metodo.nutri.biblioteca.ilustracionesPie":
    "Todos los cómics de Nutrición reunidos para releerlos.",
  "metodo.nutri.biblioteca.respuestas": "Respuestas",
  "metodo.nutri.biblioteca.respuestasPie":
    "Las preguntas y mitos más frecuentes, uno a uno.",

  // ── Nutrición · sueltos de los pasos ───────────────────────────────────
  "metodo.nutri.entendido": "Entendido",
  "metodo.nutri.tocaMolecula": "Toca cada molécula para ver qué hace dentro de ti.",
  "metodo.nutri.tocaGrupo":
    "Toca cada grupo para descubrir sus tipos, qué hacen dentro de ti y dónde encontrarlo.",
  "metodo.nutri.verIlustracion": "Ver ilustración",
  "metodo.nutri.foto": "Foto",
  "metodo.nutri.crearAlimento": "Crea tu alimento",
  "metodo.nutri.microbiotaIntro":
    "No estás viendo bacterias. Estás viendo a los habitantes de tu intestino.",
  "metodo.nutri.microbiotaMoleculas":
    "Tres de las moléculas más importantes que fabrican las bacterias de tu intestino.",
  /** «Crea el plato de Harvard». */
  "metodo.nutri.platoIntro":
    "Pulsa cada parte del plato para ver sus alimentos y arrástralos encima. Construye un plato equilibrado con algo de cada grupo.",
  "metodo.nutri.platoHecho": "¡Plato equilibrado! 🎉 Tienes algo de cada grupo.",
  "metodo.nutri.platoVaciar": "Vaciar plato",
  "metodo.nutri.platoArrastra": "Arrastra estos alimentos al plato",
  /** «Cuenta lo que comes». */
  "metodo.nutri.macros.lema": "Aprende lo que de verdad te ayudará a ser tu mejor versión...",
  "metodo.nutri.macros.intro":
    "Nadie te enseñó a mirar un plato y saber lo que lleva. Se aprende como se aprende a calcular distancias: fallando y volviendo a mirar. No hace falta acertar el gramo exacto —basta con no equivocarte de tamaño—.",
  "metodo.nutri.macros.cuantosGramos": "¿Cuántos gramos crees que lleva esta ración?",
  "metodo.nutri.macros.comprobar": "Comprobar",
  "metodo.nutri.macros.tuApuesta": "Tu apuesta (hueco) y el dato real (macizo)",
  "metodo.nutri.macros.otraRonda": "Otra ronda de diez",
  "metodo.nutri.macros.ronda": "Ronda",
  /** Frase de cierre de «El hambre», sobre el turquesa y sin caja. */
  "metodo.nutri.hambreCierre":
    "Lo has visto tú mismo; te reconstruyes con lo que comes, ¿cómo eliges hoy reconstruirte?",

  // ── Nutrición · «¿De dónde vienen los nutrientes?» ─────────────────────
  // Título y frase corta de cada una de las seis lecturas del paso. Están en
  // claves porque el array de lecturas (comicsOrigenNutrientes.ts) se calcula al
  // importar el módulo: un texto ya resuelto ahí se quedaría congelado en el
  // idioma con el que arrancó la página.
  "metodo.nutri.origen.ciclos.titulo": "Los grandes ciclos de la naturaleza",
  "metodo.nutri.origen.ciclos.resumen":
    "El agua, el carbono, el oxígeno, el nitrógeno y el fósforo dando vueltas: tus átomos son prestados.",
  "metodo.nutri.origen.tierra.titulo": "La tierra y la raíz",
  "metodo.nutri.origen.tierra.resumen":
    "Cómo sale un mineral de una roca, se disuelve en el suelo y entra en una planta.",
  "metodo.nutri.origen.planta.titulo": "Una planta por dentro",
  "metodo.nutri.origen.planta.resumen":
    "Dos tuberías, una pared de fibra y una despensa. Y sube el agua sin tener corazón.",
  "metodo.nutri.origen.hoja.titulo": "Una hoja por dentro",
  "metodo.nutri.origen.hoja.resumen":
    "La fábrica: aire, agua y luz entran; salen comida y el oxígeno que respiras.",
  "metodo.nutri.origen.fruta.titulo": "La fruta, la verdura y sus colores",
  "metodo.nutri.origen.fruta.resumen":
    "De la flor al fruto, la orden de madurar y qué hace cada color.",
  "metodo.nutri.origen.animal.titulo": "Cuando el nutriente pasa por un animal",
  "metodo.nutri.origen.animal.resumen":
    "La otra rama: la cadena, lo que el animal concentra, la B12 y el omega-3 que era de un alga.",

  // ── Calculadora de calorías (botones de elección) ──────────────────────
  "metodo.nutri.act.sentada": "Sobre todo sentada/o",
  "metodo.nutri.act.andando": "De pie o andando",
  "metodo.nutri.act.fisico": "Trabajo físico",
  "metodo.nutri.int.suave": "Suave",
  "metodo.nutri.int.moderado": "Moderado",
  "metodo.nutri.int.intenso": "Intenso",
  "metodo.nutri.obj.mantener": "Mantener",
  "metodo.nutri.obj.perder": "Perder grasa",
  "metodo.nutri.obj.ganar": "Ganar músculo",
  "metodo.nutri.macro.proteina": "Proteína",
  "metodo.nutri.macro.hidratos": "Hidratos",
  "metodo.nutri.macro.grasa": "Grasa",
  "metodo.crearCelula": "Crea la célula",

  // ── Biblioteca de alimentos (nutrición) ────────────────────────────────
  "metodo.alimentos.materiales": "Los materiales de los alimentos",
  "metodo.alimentos.elige": "Elige un alimento y descubre de qué moléculas está hecho.",
  "metodo.alimentos.todos": "Todos los alimentos",
  "metodo.alimentos.deQueEstaHecho": "De qué está hecho",
  "metodo.alimentos.moleculas": "Las moléculas que lo forman",

  // ── Sueltos de los pasos ───────────────────────────────────────────────
  "metodo.tocaEjemplo": "Toca un ejemplo para añadirlo",
  "metodo.tocaCadaUna": "Toca cada una",
  "metodo.guardadoOk": "Guardado ✓",
  "metodo.foto": "FOTO",
  "metodo.subiendo": "Subiendo…",
  "metodo.sinPiezas": "Sin piezas.",
  "metodo.borrarHerida": "Borrar herida",
  "metodo.uniendose": "…uniéndose…",
  "metodo.volverAHacer": "↺ Volver a hacer",
  "metodo.tusCelulas": "Tus células",
  "metodo.celulasPronto": "Pronto podrás explorar las células de este órgano.",
  "metodo.cartaParaTi": "Tu carta para ti",
  "metodo.cartaCuandoVuelvas": "Para cuando vuelvas a sentirte bloqueado:",
  "metodo.porQueExiste": "¿Por qué existe Life as a Privilege?",

  // ── Astrología · los nueve pasos del recorrido ─────────────────────────
  // Cada clave es el título de una página: lo pintan su cabecera, el índice y
  // los botones «anterior/siguiente» que llevan hasta ella. Los `…Corto` son la
  // versión de móvil, cuando el largo no cabe de una línea en un botón.
  /** Botón «volver» de un paso 2 hacia la portada de su disciplina. */
  "metodo.introCorto": "Intro",
  "metodo.astro.paso.astrologia": "Astrología",
  "metodo.astro.paso.loPrimero": "Lo primero de tu carta",
  "metodo.astro.paso.loPrimeroCorto": "Lo primero",
  "metodo.astro.paso.arquetipos": "Arquetipos",
  "metodo.astro.paso.puntosClave": "Puntos clave",
  "metodo.astro.paso.casas": "Casas",
  "metodo.astro.paso.aspectos": "Aspectos",
  "metodo.astro.paso.pdf": "Tu carta en PDF",
  "metodo.astro.paso.pdfCorto": "PDF",
  "metodo.astro.paso.llamada": "Llamada",
  "metodo.astro.paso.cursos": "Cursos",

  // ── Astrología · arquetipos (el popup de «Luna en Géminis») ────────────
  "metodo.astro.textoNoDisponible": "Texto de {arquetipo} aún no disponible.",
  "metodo.astro.signoSinElegir": "Signo aún no elegido",
  "metodo.astro.casaSinElegir": "Casa aún no elegida",
  "metodo.astro.leer": "Leer",
  "metodo.astro.yaLeido": "Ya leído",
  "metodo.astro.yaLeida": "Ya leída",
  "metodo.astro.leida": "Leída",
  "metodo.astro.completado": "Completado",
  "metodo.astro.regente": "Regente",
  "metodo.astro.regenteCorto": "Reg.",
  "metodo.astro.giraLaRueda": "Gira la rueda o toca una Casa",
  "metodo.astro.sinAspectos": "No hay aspectos calculados todavía.",
  "metodo.astro.aspectoSinLectura":
    "Aún no he escrito la lectura de este aspecto. Estará disponible pronto.",
  "metodo.astro.casaSinLectura":
    "Aún no he escrito la lectura de esta Casa. Estará disponible pronto.",
  "metodo.astro.profundizarSinTexto":
    "El texto de profundización para esta combinación aún no está disponible. Lo añadiré pronto.",
  /** Bloqueo secuencial de los aspectos: se lee planeta a planeta. */
  "metodo.astro.terminaAspectosDe":
    "Termina de leer los aspectos de {planeta} para desbloquear este planeta.",
  "metodo.astro.pulsaEstrella": "Pulsa sobre cada estrella para descubrir tus puntos clave.",
  "metodo.astro.puntosClavePronto": "Tus puntos clave aparecerán aquí muy pronto.",
  "metodo.astro.llamadaIntro":
    "Integra tus arquetipos: agenda una llamada y no te quedes con dudas.",
  "metodo.astro.pdfIntro": "Tu lectura entera, en un archivo que ya es tuyo para siempre.",
  "metodo.astro.pdfTitular": "Toda tu carta, página a página",
  "metodo.astro.pdfSinLecturas":
    "Tu carta todavía no tiene lecturas escritas. En cuanto estén, aquí podrás descargarla completa.",
  "metodo.astro.pdfDescargado":
    "Descargado. Si no lo ves, mira en la carpeta de descargas de tu navegador.",
  "metodo.astro.pdfAviso":
    "Se monta en tu propio dispositivo, así que puede tardar unos segundos y conviene no cerrar la página mientras avanza.",
  "metodo.astro.releer": "Releer",

  // ── Astrología · «Lo primero de tu carta» (Sol · Luna · Ascendente) ────
  "metodo.astro.trioIntro":
    "Tu carta se lee por partes, y esta es la primera: tu **Luna** (el trato que recibiste por parte de tu madre y tu mundo emocional), tu **Sol** (tu esencia) y tu **Ascendente** (cómo percibes el mundo).",
  "metodo.astro.trioLeeLosTres": "Lee los tres para continuar",
  "metodo.astro.trioLeeLosTresTooltip": "Lee tu Sol, tu Luna y tu Ascendente antes de seguir",
  "metodo.astro.trioQueEs1":
    "Ya has conocido a los doce Signos, que de una forma u otra viven en ti. Aquí empiezas por los tres arquetipos más básicos de la Astrología: tu Ascendente, tu Sol y tu Luna.",
  "metodo.astro.trioQueEs2":
    "Léetelos con calma: esto es el calentamiento. En cuanto termines seguirás con el resto de tus arquetipos.",

  // ── Astrología · «Arquetipos» (la rueda de la carta) ───────────────────
  "metodo.astro.arquetiposQueEs1":
    "Ya sabes qué Planetas viven en tu carta. Aquí los recorres uno a uno, profundizando en lo que cada uno significa en ti.",
  "metodo.astro.arquetiposQueEs2":
    "Léelos sin prisa: mientras tú avanzas, yo estoy acabando de escribir tu carta.",
  "metodo.astro.leeTodosLosPlanetas": "Lee todos los planetas antes de continuar",
  "metodo.astro.cartaEnLectura":
    "Estoy leyendo tu carta. Cuando esté lista se te hará saber a través de un email y podrás acceder a tu lectura especializada.",

  // ── Astrología · la llamada ────────────────────────────────────────────
  "metodo.astro.reservaLlamada": "Reserva tu llamada de astrología",

  // ── Astrología · datos de nacimiento ───────────────────────────────────
  "metodo.astro.fechaNacimiento": "Fecha de nacimiento",
  "metodo.astro.horaNacimiento": "Hora de nacimiento",
  "metodo.astro.dia": "Día",
  "metodo.astro.mes": "Mes",
  "metodo.astro.anio": "Año",
  "metodo.astro.pais": "País",
  "metodo.astro.paisEj": "Ej: España",
  "metodo.astro.lugar": "Lugar (ciudad)",
  "metodo.astro.lugarEj": "Ej: Madrid",
  "metodo.astro.region": "Región / provincia",
  "metodo.astro.regionEj": "Ej: Comunidad de Madrid",
  "metodo.astro.cambiar": "Cambiar",
  "metodo.astro.seguroDatos": "¿Seguro que estos son tus datos?",
  "metodo.astro.volverRevisar": "Volver a revisar",
  "metodo.astro.aspectosPulsa": "Cada aspecto es una relación entre dos planetas. Pulsa para leer.",

  // ── Puertas de entrada de cada disciplina ──────────────────────────────
  // El aviso legal («esto no sustituye a un profesional») lo llevan casi todas:
  // el encabezado es el mismo y el cuerpo cambia según la disciplina.
  "metodo.gate.avisoImportante": "Aviso importante",
  "metodo.gate.importante": "Importante",

  "metodo.gate.psico.intro":
    "Nuestra historia marca nuestra Vida, todo lo que no hemos gestionado o que hemos callado sigue pulsando y guiando nuestro pensamiento. En este mapa te conocerás en profundidad y verás con claridad dónde estás, por qué y para qué. El propósito es volver a unir tus fragmentaciones.",
  "metodo.gate.psico.noIndividual": "Se recomienda no hacer este mapa de manera individual.",
  "metodo.gate.psico.noIndividualTexto":
    "Aunque si llevas años en terapia y trabajando en ti, es posible. Sea como sea, siempre tendrás el botón abajo a la derecha por si necesitas mi ayuda.",
  "metodo.gate.psico.aviso1": "Este mapa no sustituye una terapia psicológica ni una evaluación profesional.",
  "metodo.gate.psico.aviso2":
    "Su propósito es ayudarte a ordenar tu historia, comprender mejor tus patrones y construir una narrativa más consciente sobre tu Vida.",
  "metodo.gate.psico.aviso3":
    "Si estás atravesando un momento de sufrimiento importante o necesitas apoyo especializado, te recomiendo buscar ayuda profesional.",
  "metodo.gate.psico.titulo": "Vuelve a ti",

  "metodo.gate.ayurveda.intro1":
    "El Ayurveda enseña que cada persona nace con una constitución única —su Doṣha— y que la salud es el equilibrio de esa naturaleza.",
  "metodo.gate.ayurveda.intro2":
    "Esta tercera etapa de El Mapa es para reconocer tu constitución, entender tus desequilibrios y aprender a vivir en armonía contigo mismo.",
  "metodo.gate.ayurveda.aviso1":
    "El Ayurveda es un saber milenario de autoconocimiento, no un sustituto de la medicina.",
  "metodo.gate.ayurveda.aviso2":
    "Su propósito en El Mapa es ayudarte a observar tu constitución y tus hábitos, y a cuidarte con más conciencia día a día.",
  "metodo.gate.ayurveda.aviso3":
    "Ante cualquier síntoma o problema de salud, consulta siempre con un profesional sanitario.",
  "metodo.gate.ayurveda.titulo": "Equilibra tu naturaleza",

  "metodo.gate.tcm.intro1":
    "La Medicina Tradicional China lleva miles de años observando la naturaleza y al ser humano. Según esta visión, la salud es el equilibrio dinámico entre tu cuerpo, tus emociones y el entorno que te forma.",
  "metodo.gate.tcm.intro2":
    "En este mapa descubrirás tu equilibrio actual entre los cinco elementos, aprenderás a reconocer tus desequilibrios y sabrás cómo cuidarte desde esta sabiduría milenaria.",
  "metodo.gate.tcm.aviso1": "Este mapa tiene un fin educativo y de autoconocimiento.",
  "metodo.gate.tcm.aviso2":
    "No constituye un diagnóstico clínico ni sustituye la valoración realizada por un profesional cualificado en medicina tradicional china o en medicina convencional. Si atraviesas un problema de salud, busca acompañamiento profesional.",

  "metodo.gate.fisio.intro1":
    "No tenemos un cuerpo: somos un cuerpo. Todo lo que existe —incluido tú— está construido a partir de las mismas partículas que nacieron en el corazón de las estrellas.",
  "metodo.gate.fisio.intro2":
    "En este recorrido descenderás hasta lo más pequeño que te forma y volverás a subir, nivel a nivel, hasta el milagro entero que eres. Empecemos por el principio de todo.",

  "metodo.gate.nutri.aviso":
    "Todo lo que encontrarás aquí es contenido educativo para que entiendas mejor tu cuerpo y tu alimentación. No sustituye el consejo médico. Si de verdad necesitas una ayuda concreta con tu dieta —por una condición, un objetivo de salud o cualquier duda personal— acude a un profesional (médico o dietista-nutricionista colegiado) que pueda acompañarte de forma individual.",

  "metodo.gate.cabala.intro1":
    "La Cábala es una de las tradiciones místicas más antiguas; es un mapa simbólico de cómo la luz infinita desciende hasta la materia y de cómo el alma puede recorrer ese mismo camino de vuelta a su origen.",
  "metodo.gate.cabala.corazon": "Su corazón es el",
  "metodo.gate.cabala.arbol": "Árbol de la Vida",
  "metodo.gate.cabala.intro2":
    ": diez esferas —las sefirot— unidas por senderos que representan las fuerzas que nos habitan. En este recorrido las iremos descubriendo una a una, para reconocerlas en ti y que estén al servicio de tu crecimiento personal.",

  "metodo.gate.cultura.ultimoPaso": "El último paso de",
  "metodo.gate.cultura.elMapa": "El Mapa",
  "metodo.gate.cultura.intro1":
    ". Recorre la historia de la filosofía, la medicina, la religión y del mundo entero. Recordar de dónde venimos es lo que nos permite comprender dónde estamos y sembrar, entre todos, un futuro más hermoso.",
  "metodo.gate.cultura.intro2":
    "Quizá casi todo ya fue pensado y dicho alguna vez. A nosotros nos corresponde recordarlo, comprenderlo y traer esa sabiduría de vuelta al presente.",

  // ── Nutrición · calorías y macros ──────────────────────────────────────
  "metodo.nutri.caloriasIntro":
    "Cada cuerpo necesita una cantidad distinta de energía. Calcula tu propia medición: tus calorías diarias y cómo repartir los macronutrientes según tu objetivo.",
  "metodo.nutri.sexo": "Sexo",
  "metodo.nutri.mujer": "Mujer",
  "metodo.nutri.hombre": "Hombre",
  "metodo.nutri.edad": "Edad",
  "metodo.nutri.peso": "Peso",
  "metodo.nutri.altura": "Altura",
  "metodo.nutri.diaADia": "Tu día a día",
  "metodo.nutri.ejercicio": "Ejercicio",
  "metodo.nutri.diasSemana": "Días por semana",
  "metodo.nutri.minutosSesion": "Minutos por sesión",
  "metodo.nutri.alMenosUnDia": "Pon al menos 1 día para contar el ejercicio.",
  "metodo.nutri.objetivo": "Objetivo",
  "metodo.nutri.objetivoDiario": "Tu objetivo diario aproximado",
  "metodo.nutri.guardadoSigue": "Guardado. Ya puedes seguir con el resto del recorrido.",
  "metodo.nutri.caloriasAviso":
    "Este cálculo es orientativo y con fin educativo. Es una estimación estadística: tus necesidades reales pueden variar. No sustituye la valoración de un profesional de la nutrición.",

  // ── Nutrición · test de prevención ─────────────────────────────────────
  "metodo.nutri.prediabetes": "Prediabetes: qué es y qué no",
  "metodo.nutri.tusDatos": "Tus datos",
  "metodo.nutri.corregirNoCambia": "Corregirlos aquí no cambia el cálculo de tus calorías.",
  "metodo.nutri.tuCintura": "Tu cintura",
  "metodo.nutri.perimetro": "Perímetro",
  "metodo.nutri.comoMedirme": "Cómo medirme",
  "metodo.nutri.noPuedoMedirme": "Ahora no puedo medirme",
  "metodo.nutri.sinCintura":
    "Sin este dato el test funciona igual, pero puede quedarse corto: la cintura es uno de los factores que más pesa. Si puedes, vuelve con una cinta métrica.",
  "metodo.nutri.tuPuntuacion": "Tu puntuación",
  "metodo.nutri.queHariaYo": "Qué haría yo ahora",
  "metodo.nutri.recuerdaSinCintura":
    "Recuerda que has hecho el test sin medirte la cintura: tu puntuación real podría ser algo más alta.",
  "metodo.nutri.loQueNoElegiste": "Lo que no elegiste",
  "metodo.nutri.loQueNoElegisteTexto":
    "Tu edad y tu familia no se cambian, y no dicen absolutamente nada de cómo te cuidas. Aparecen solo para que veas de dónde sale el número. Que sumen es justo la razón por la que conviene cuidar lo de abajo, que sí depende de ti.",
  "metodo.nutri.enTuMano": "Lo que está en tu mano",
  "metodo.nutri.enTuManoNada":
    "Nada de lo que puntúa en tu resultado depende de tus hábitos: ya estás haciendo bien la parte que te toca. Sigue así.",

  // ── Nutrición · «Diseña tu día» ────────────────────────────────────────
  "metodo.dia.primeroCalorias": "Primero, tus calorías",
  "metodo.dia.primeroCaloriasTexto":
    "Para diseñar tu día necesitamos saber cuánta energía necesitas. Calcula tu objetivo y vuelve: repartiremos esas calorías entre tus comidas.",
  "metodo.dia.calcular": "Calcular mis calorías →",
  "metodo.dia.repartePre":
    "Aprender a comer no es contar: es saber **cuánto** y **cómo**. Reparte tus",
  "metodo.dia.repartePost":
    "entre las comidas del día y dale a tu cuerpo —es decir, a ti— lo que de verdad necesitas.",
  "metodo.dia.tuDiaSuma": "Tu día suma",
  "metodo.dia.arrastraAqui": "Arrastra alimentos aquí",
  "metodo.dia.eligeArrastra": "Elige buenos alimentos · arrástralos a cada comida",
  "metodo.dia.creaAlimento": "Crea tu alimento",
  "metodo.dia.elTuyo": "el tuyo, las veces que quieras",
  "metodo.dia.aOjo": "A ojo:",
  "metodo.dia.manoBascula":
    "Tu mano es tu báscula: un puño ≈ una ración de fruta o cereal cocido · la palma ≈ tu proteína · el pulgar ≈ una cucharada de grasa · dos manos ahuecadas ≈ tus verduras. Aprende a mirar el plato, no la báscula. Esto es orientativo y educativo; no sustituye a un profesional.",
  "metodo.dia.susMoleculas": "Sus moléculas",
  "metodo.dia.loHasCreado": "Este alimento lo has creado tú.",
  "metodo.dia.deQueEs": "De qué es (opcional, %)",
  "metodo.dia.crearAlimento": "Crear alimento",
  "metodo.dia.cuantasComidas": "¿Cuántas comidas haces al día?",
  "metodo.dia.verFicha": "Ver ficha",
  "metodo.dia.nombre": "Nombre",
  "metodo.dia.nombreEj": "p. ej. mi bocadillo",
  "metodo.dia.kcalRacion": "kcal por ración",
  "metodo.dia.kcalEj": "p. ej. 320",
  "metodo.dia.racionG": "Ración (g)",
  "metodo.dia.medirAOjo": "Cómo medirla a ojo (opcional)",
  "metodo.dia.medirEj": "p. ej. un puño",
  "metodo.dia.carb": "Carb.",
  "metodo.dia.proteina": "Proteína",
  "metodo.dia.grasa": "Grasa",

  // ── Medicina China · textos de página (no van en cómic) ────────────────
  /** Apertura de la página del taoísmo: la cita y la intro bajo el header. */
  "metodo.tcm.tao.titulo": "Taoísmo",
  "metodo.tcm.tao.citaApertura": "«El Tao que puede ser nombrado no es el Tao eterno.»",
  "metodo.tcm.tao.citaAperturaAutor": "— Lao-Tse",
  "metodo.tcm.tao.intro1":
    "El taoísmo no es una religión: es una forma de mirar. Lao-Tse llamó Tao al «camino», el orden natural que rige todo lo que existe. De esa mirada nace lo que ya has recorrido: el Qi que nos une, el Yin y el Yang que se equilibran, los cinco elementos que se generan y se controlan.",
  "metodo.tcm.tao.intro2":
    "No son normas que haya que obedecer, sino cómo funciona la naturaleza. Puedes ignorarlas, igual que puedes ignorar la gravedad: la diferencia la paga tu cuerpo.",
  "metodo.tcm.tao.cierreTitulo": "Y entonces, ¿qué es curarse?",
  /** Cierre de la página del taoísmo, con su cita del Tao Te King. */
  "metodo.tcm.tao.cierre":
    "El taoísmo no te pide ser mejor que ayer, sino dejar de ir en contra de ti. La salud, desde esta mirada, no es un premio: es lo que ocurre cuando dejas de estorbarte.",
  "metodo.tcm.tao.cita":
    "«El hombre sigue a la tierra, la tierra sigue al cielo, el cielo sigue al Tao, y el Tao se sigue a sí mismo.»",
  "metodo.tcm.tao.citaAutor": "— Lao-Tse, Tao Te King",
  /** Intro y nota al pie de la página del Qigong. */
  "metodo.tcm.qigong.intro": "Qi (氣) es la energía que circula por ti. Gong (功) es el trabajo constante.",
  "metodo.tcm.qigong.nota":
    "El qigong es una práctica de salud, no un tratamiento: acompaña, no sustituye. Si estás embarazada, tienes hipertensión no controlada, una hernia, vértigos o una lesión reciente, adapta las posturas con alguien que sepa antes de hacerlas por tu cuenta.",
  "metodo.tcm.qigong.titulo": "Qigong",
  /** La línea del Dao Yin (la franja que abre su cómic). */
  "metodo.tcm.qigong.daoYinLinea":
    "La integración en el ser humano de la energía femenina del Dao (Dios)",
  /** Las tres regulaciones (三調): la base de cualquier práctica. */
  "metodo.tcm.qigong.reg.cuerpo": "Regular el cuerpo",
  "metodo.tcm.qigong.reg.cuerpoTexto":
    "Pies al ancho de las caderas, rodillas blandas, coxis abajo, coronilla arriba. Antes de mover nada, colócate.",
  "metodo.tcm.qigong.reg.respiracion": "Regular la respiración",
  "metodo.tcm.qigong.reg.respiracionTexto":
    "Por la nariz, al vientre, lenta y silenciosa. No la fuerces: acompáñala hasta que sea larga sola.",
  "metodo.tcm.qigong.reg.mente": "Regular la mente",
  "metodo.tcm.qigong.reg.menteTexto":
    "La atención dentro del movimiento, no en la lista de la compra. Cuando las tres se funden, eso es la práctica (三調合一).",
  /** Qué es (y qué no es) el qigong. Tres frases; ni una más. */
  "metodo.tcm.qigong.queEs1":
    "En China no es una moda: es la cuarta rama de su medicina, junto con la acupuntura, la farmacopea y la dietética. Se practica en los parques a las siete de la mañana.",
  "metodo.tcm.qigong.queEs2":
    "El movimiento es lento a propósito: la lentitud te obliga a sostener, y sostener es lo que mueve el Qi.",
  "metodo.tcm.qigong.queEs3": "No busca fuerza, busca circulación. No te añade nada: te desatasca.",

  // ── Medicina China · Tu cocina diaria ──────────────────────────────────
  // El contenido (los gestos, el principio y las veinte formas de cocinar) va
  // en tcmCocinaContenido(.en).ts; aquí solo los rótulos de la página.
  "metodo.tcm.cocina.titulo": "Tu cocina diaria",
  "metodo.tcm.cocina.cita":
    "«El médico excelente trata primero la enfermedad mediante la alimentación; solo cuando la alimentación no basta, utiliza medicamentos.»",
  "metodo.tcm.cocina.citaAutor": "— Sun Simiao,",
  "metodo.tcm.cocina.citaObra": "Qianjin Yaofang",
  "metodo.tcm.cocina.gestoHoy": "Un gesto para hoy",
  "metodo.tcm.cocina.dameOtro": "Dame otro",
  "metodo.tcm.cocina.hechoHoy": "Hecho hoy",
  "metodo.tcm.cocina.loHagoHoy": "Lo hago hoy",
  "metodo.tcm.cocina.formas": "Formas de cocinar",
  "metodo.tcm.cocina.aviso":
    "Todo esto tiene un fin educativo y de autocuidado: no sustituye la valoración de un profesional cualificado ni un tratamiento médico.",

  // ── Medicina China · la página de cada elemento ────────────────────────
  // Los rótulos de los diez «momentos» y de la guía práctica. El contenido de
  // cada elemento (las siete secciones) va en tcmElementosContenido(.en).ts.
  "metodo.tcm.el.elemento": "El elemento",
  "metodo.tcm.el.rige": "Qué rige",
  "metodo.tcm.el.funciones": "Funciones",
  "metodo.tcm.el.equilibrio": "En equilibrio",
  "metodo.tcm.el.exceso": "En exceso",
  "metodo.tcm.el.deficiencia": "En deficiencia",
  "metodo.tcm.el.desequilibrio": "Señales de desequilibrio",
  "metodo.tcm.el.cuidarlo": "Cómo cuidarlo",
  "metodo.tcm.el.guia": "Guía práctica",
  "metodo.tcm.el.test": "¿Cómo está este elemento en ti?",
  "metodo.tcm.el.guiaNutricion": "Nutrición",
  "metodo.tcm.el.guiaEvitar": "Evita",
  "metodo.tcm.el.guiaEstiloDeVida": "Estilo de Vida",
  "metodo.tcm.el.guiaEjercicio": "Ejercicio",
  "metodo.tcm.el.guiaTerapia": "Terapia",
  "metodo.tcm.el.guiaDescanso": "Mejor momento para descansar",
  "metodo.tcm.el.laEstrella": "La estrella",
  "metodo.tcm.el.atras": "‹ Atrás",
  "metodo.tcm.el.seguir": "Seguir ›",
  "metodo.tcm.el.heLeido": "He leído ✓",
  "metodo.tcm.el.respondeTest": "Responde el mini-test para terminar",

  // ── Medicina China · nombres de paso (los botones de los cómics) ────────
  "metodo.tcm.paso.elementos": "Los 5 elementos",
  "metodo.tcm.paso.diagnostico": "Diagnóstico final",
  "metodo.tcm.paso.taoismo": "Taoísmo",
  "metodo.tcm.paso.cocina": "Tu cocina",
  "metodo.tcm.paso.qigong": "Qigong",
  "metodo.tcm.paso.lengua": "Lee tu lengua",
  "metodo.tcm.paso.cursos": "Cursos",
  /** Nombre largo del paso 2 (el del índice y del header de su página). El
   *  corto, «Los 5 elementos», es el que cabe en un botón de al lado. */
  "metodo.tcm.paso.cincoElementos": "Los Cinco Elementos",
  "metodo.tcm.paso.ciclos": "Los ciclos",
  /** Paso 5 (aprender a leer una lengua). El 6, donde se lee la propia, es
   *  `metodo.tcm.paso.lengua`. */
  "metodo.tcm.paso.tuLengua": "Tu lengua",
  "metodo.tcm.paso.apuntes": "Crea tus apuntes",
  "metodo.tcm.paso.apuntesCorto": "Tus apuntes",

  // ── Medicina China · Los Cinco Elementos (la estrella, paso 2) ──────────
  "metodo.tcm.elementos.queSon": "¿Qué son los Cinco Elementos?",
  "metodo.tcm.elementos.orden":
    "Los elementos se abren en orden (Madera → Fuego → Tierra → Metal → Agua). Al leer cada uno, se marca con ✓.",
  "metodo.tcm.elementos.testsPendientes": "Rellena los tests de los cinco elementos para continuar",

  // ── Medicina China · Los ciclos (paso 3) ───────────────────────────────
  // Los dos ciclos salen también en el Diagnóstico final, con los mismos
  // rótulos: de ahí que no vivan en la página.
  "metodo.tcm.ciclos.titulo": "Los Ciclos",
  "metodo.tcm.ciclos.intro":
    "Los Cinco Elementos no viven aislados: se relacionan en dos ciclos. Cuando fluyen, hay equilibrio; cuando se alteran, aparece el desequilibrio. Toca cada flechita para descubrir la relación.",
  "metodo.tcm.ciclos.nota":
    "En el ciclo generador la energía avanza por el perímetro (Madera → Fuego → Tierra → Metal → Agua). En el ciclo de control cruza la estrella: cada elemento frena al que tiene enfrente para mantener el conjunto en armonía.",
  "metodo.tcm.ciclos.flechitas": "Toca todas las flechitas para descubrir cada relación",
  "metodo.tcm.ciclos.sheng": "Ciclo generador",
  "metodo.tcm.ciclos.ke": "Ciclo de control",
  /** El verbo del título de una relación: «La Madera GENERA el Fuego». En
   *  inglés no lleva artículos: «Wood generates Fire». */
  "metodo.tcm.ciclos.genera": "genera",
  "metodo.tcm.ciclos.controla": "controla a",

  // ── Medicina China · Diagnóstico final (paso 4) ─────────────────────────
  "metodo.tcm.diag.cita":
    "«Antes de sanar a alguien, pregúntale si está dispuesto a renunciar a las cosas que lo enferman.»",
  "metodo.tcm.diag.citaAutor": "— Hipócrates",
  "metodo.tcm.diag.iluminados": "Los elementos iluminados son los que más necesitan de tu atención.",
  "metodo.tcm.diag.barras":
    "Cada elemento tira hacia un lado: hacia arriba si le sobra energía, hacia abajo si le falta. Cuanto más cerca de la línea, más en equilibrio.",
  "metodo.tcm.diag.repasa":
    "Repasa cada relación con calma. Todas te interesan, pues todas forman parte de ti.",
  "metodo.tcm.diag.aviso":
    "Esta valoración tiene un fin educativo y de autoconocimiento. No constituye un diagnóstico clínico ni sustituye la valoración de un profesional cualificado.",
  /** Cuando un elemento no tiene su mini-test respondido. */
  "metodo.tcm.diag.sinDatos": "sin datos",
  "metodo.tcm.diag.sinDatosSuficientes": "sin datos suficientes",

  // ── Medicina China · El diagnóstico de la lengua (paso 5) ───────────────
  // Las variantes de lengua (el color, la forma, la saburra…) NO van aquí:
  // son contenido y viven en tcmLenguaContenido(.en).ts.
  "metodo.tcm.lengua.titulo": "El diagnóstico de la lengua",
  "metodo.tcm.lengua.intro":
    "La lengua es el espejo de las vísceras. Se lee por capas: el color, la forma, el movimiento, la saburra, la humedad y los pequeños detalles. Aprende a reconocer cada una y luego mira la tuya.",
  "metodo.tcm.lengua.comoMirar": "Cómo mirar tu lengua",
  "metodo.tcm.lengua.mirar1": "Por la mañana, antes de lavarte los dientes y antes de comer o beber.",
  "metodo.tcm.lengua.mirar2": "Con luz natural siempre que puedas.",
  "metodo.tcm.lengua.mirar3": "Saca la lengua relajada y sin forzarla.",
  "metodo.tcm.lengua.mirar4": "Fíjate también en dónde aparece el cambio: cada zona habla de un órgano.",
  "metodo.tcm.lengua.mapa": "El mapa de la lengua",
  "metodo.tcm.lengua.mapaAlt": "Mapa de la lengua",
  "metodo.tcm.lengua.mapaPie": "El mapa de la lengua: cada zona se corresponde con unos órganos.",
  "metodo.tcm.lengua.mapaTexto":
    "No solo importa qué cambia, sino en qué parte de la lengua aparece: cada zona se relaciona con unos órganos.",
  /** Los tres grupos de cajitas que NO son una dimensión entera (mezclan
   *  variantes de dos capas para que las filas queden completas). */
  "metodo.tcm.lengua.grupoForma": "El cuerpo · la forma",
  "metodo.tcm.lengua.grupoMovimiento": "El movimiento",
  "metodo.tcm.lengua.grupoSuperficie": "La superficie · humedad y detalles",
  /** Marca de la variante de referencia (la lengua sana de cada capa). */
  "metodo.tcm.lengua.sana": "· sana",
  "metodo.tcm.lengua.aviso":
    "Material con fin formativo. El diagnóstico por la lengua es una herramienta propia de la Medicina Tradicional China; no constituye un diagnóstico médico ni sustituye la valoración de un profesional sanitario cualificado.",

  // ── Medicina China · Lee tu lengua (paso 6) ─────────────────────────────
  "metodo.tcm.leer.intro":
    "Ahora que sabes leer una lengua, mira la tuya. Colócate frente a un espejo con buena luz natural, por la mañana y antes de comer o beber, y saca la lengua sin forzar.",
  "metodo.tcm.leer.rotulo": "Lee tu propia lengua",
  "metodo.tcm.leer.elige": "Elige lo que más se parezca a la tuya en cada apartado. No hay respuestas correctas.",
  "metodo.tcm.leer.hoy": "Tu lengua hoy",
  "metodo.tcm.leer.sano":
    "Tu lengua refleja un buen equilibrio: la Sangre nutre, el Qi circula y el Yin y el Yang se sostienen. Cuídalo con lo que ya sabes de tu recorrido y vuelve a observarte de vez en cuando: la lengua cambia contigo.",
  "metodo.tcm.leer.sugiere":
    "Esto es lo que tu lengua sugiere hoy y cómo puedes acompañar tu equilibrio. Cuantas más señales apuntan a un mismo patrón, más presente está.",
  "metodo.tcm.leer.comoEquilibrarlo": "Cómo equilibrarlo",
  /** Cuántos signos de la lengua apuntan a un mismo patrón. */
  "metodo.tcm.leer.senal": "señal",
  "metodo.tcm.leer.senales": "señales",
  "metodo.tcm.leer.vuelve":
    "Vuelve a mirar tu lengua dentro de unos días y compara: es tu forma de ver, poco a poco, cómo tus cuidados van reequilibrándote.",
  "metodo.tcm.leer.aviso":
    "La lectura de la lengua es una herramienta de autoconocimiento con fines educativos. No constituye un diagnóstico clínico ni sustituye la valoración de un profesional cualificado.",

  // ── Medicina China · Crea tus apuntes (paso 11) ─────────────────────────
  "metodo.tcm.apuntes.intro1":
    "Has recorrido la Medicina China entera. Ahora decide qué te llevas: marca lo que quieras —tu diagnóstico, la lectura de tu lengua, las cocinas, las leyes del Tao, las prácticas— y te lo montamos en un cuaderno para leer sin pantalla.",
  "metodo.tcm.apuntes.intro2":
    "Se prepara aquí mismo, en tu navegador. Puedes volver y montarlo otra vez cuantas veces quieras.",

  // ── Medicina China · capítulos de sus Ilustraciones ────────────────────
  // Diecisiete capítulos: los cuatro de teoría, los cinco elementos uno a uno,
  // lo que se rompe (enfermedades) y lo que se hace (Tao, cocina, Qigong).
  "metodo.tcmIlus.origen": "El Origen",
  "metodo.tcmIlus.yinYang": "El Yin Yang",
  "metodo.tcmIlus.elementos": "Los Cinco Elementos",
  "metodo.tcmIlus.alma": "El Alma Humana",
  "metodo.tcmIlus.wuXing": "El Wu Xing",
  "metodo.tcmIlus.madera": "La Madera",
  "metodo.tcmIlus.fuego": "El Fuego",
  "metodo.tcmIlus.tierra": "La Tierra",
  "metodo.tcmIlus.metal": "El Metal",
  "metodo.tcmIlus.agua": "El Agua",
  "metodo.tcmIlus.enfermedades": "Las Enfermedades",
  "metodo.tcmIlus.leyesTao": "Las Leyes del Tao",
  "metodo.tcmIlus.cocina": "Formas de Cocinar",
  "metodo.tcmIlus.qigongHistoria": "La Historia del Qigong",
  "metodo.tcmIlus.daoYin": "El Dao Yin",
  "metodo.tcmIlus.brocados": "Los Brocados",
  "metodo.tcmIlus.animales": "Los Cinco Animales",

  // ── Ayurveda · capítulos de sus Ilustraciones ──────────────────────────
  "metodo.ayurIlus.origen": "1. El Origen",
  "metodo.ayurIlus.elementos": "2. Los Elementos",
  "metodo.ayurIlus.doshas": "3. Los Doṣhas",

  // ── Ayurveda · nombres de paso (los botones que salen de un cómic) ──────
  "metodo.ayur.paso.descubrete": "Descúbrete",
  "metodo.ayur.paso.doshas": "Doṣhas",
  "metodo.ayur.paso.pranayama": "Prāṇāyāma",
  "metodo.ayur.paso.cuerpo": "Cuerpo",
  "metodo.ayur.paso.equilibrio": "Equilibrio",
  "metodo.ayur.paso.cuidarte": "Cuidarte",
  "metodo.ayur.paso.estilo": "Estilo de Vida",
  "metodo.ayur.paso.tuDia": "Tu día",
  "metodo.ayur.paso.tuMapa": "Tu Mapa",
  "metodo.ayur.paso.resultado": "Resultado",
  "metodo.ayur.paso.test": "Test",
  "metodo.ayur.paso.testDoshas": "Test de los Doṣhas",
  "metodo.ayur.paso.equilibra": "Equilibra",
  "metodo.ayur.paso.naturaleza": "Naturaleza",
  "metodo.ayur.elMapa": "El mapa de Ayurveda",
  "metodo.ayur.tuDosha": "Tu doṣha · {dosha}",
  "metodo.ayur.recorridoDosha": "El recorrido de un doṣha",
  "metodo.ayur.notaSubmapa":
    "Estas páginas son de cada doṣha. Entra en uno desde «Doṣhas» y se abren aquí.",
  "metodo.ayur.paso.alimentacion": "Alimentación",
  "metodo.ayur.paso.energias": "Energías",
  "metodo.ayur.paso.tresDoshas": "Los tres Doṣhas",
  "metodo.ayur.paso.cursos": "Cursos de Ayurveda",

  // ── Ayurveda · las páginas del doṣha (las seis comparten andamiaje) ─────
  /** Cabecera de cada página: «Doṣha: Vata». El nombre lo pinta la página con
   *  el color del doṣha, así que la clave solo trae el rótulo de delante. */
  "metodo.ayur.doshaRotulo": "Doṣha:",
  "metodo.ayur.preparando": "Estoy preparando esta sección",
  "metodo.ayur.escribela": "Escríbela aquí…",
  "metodo.ayur.escribelo": "Escríbelo aquí…",
  "metodo.ayur.guardaReflexion": "Guarda tu reflexión de arriba para continuar.",
  "metodo.ayur.guardaRespuesta": "Guarda tu respuesta de arriba para continuar.",
  /** Aviso del botón bloqueado (más corto: cabe en un tooltip). */
  "metodo.ayur.guardaReflexionCorto": "Guarda tu reflexión para continuar.",
  "metodo.ayur.guardaRespuestaCorto": "Guarda tu respuesta para continuar.",
  "metodo.ayur.bienvenido": "Bienvenido a tu naturaleza",
  "metodo.ayur.hasMarcado": "Has marcado",
  "metodo.ayur.tuDoshaPrincipal": "Tu Doṣha principal es",
  "metodo.ayur.resultadoPie":
    "Esta es tu constitución según el test. En los siguientes pasos del Mapa iremos descubriendo qué significa para ti.",
  "metodo.ayur.tarjetasIntro":
    "Los tres Doṣhas viven en ti, pero unos predominan más que otros. Descúbrelos primero.",
  "metodo.ayur.predomina": "Predomina en ti",
  "metodo.ayur.mapaTitulo": "Este ha sido tu mapa",
  "metodo.ayur.mapaIntro":
    "A lo largo del camino te has ido escuchando. Estas son las palabras que te dejaste a ti mismo.",
  "metodo.ayur.descargarMapa": "Descargar mi mapa",
  /** Prāṇāyāma. */
  "metodo.ayur.practicado": "Practicado ✓",
  "metodo.ayur.empezar": "Empezar",
  "metodo.ayur.parar": "Parar",
  "metodo.ayur.repetir": "Repetir",
  "metodo.ayur.yaHicisteTest": "Ya hiciste el test",
  "metodo.ayur.verMiResultado": "Ver mi resultado →",
  "metodo.ayur.repetirTest": "Repetir el test",
  "metodo.ayur.cuidado": "Cuidado: ",
  "metodo.ayur.sigueElCirculo":
    "Sigue el círculo: crece cuando entra el aire y se encoge cuando sale. Si te agobia, para.",
  "metodo.ayur.pararEsPracticar": "Parar también es practicar.",

  // ── Ayurveda · «Crea tu día equilibrado» ───────────────────────────────
  "metodo.ayurDia.titulo": "Crea tu día equilibrado",
  "metodo.ayurDia.intro":
    "Diseña tu propio día, a tu manera. Añade los momentos que quieras —cuándo te levantas, cuándo respiras, tus comidas, tu descanso— con la hora que mejor encaje en tu Vida. Cada momento te llega con recomendaciones para tu Doṣha, pero el día lo escribes tú.",
  "metodo.ayurDia.tuDia": "Tu día",
  "metodo.ayurDia.verEjemplo": "Ver ejemplo",
  "metodo.ayurDia.anadirMomento": "Añadir momento",
  "metodo.ayurDia.enBlanco":
    "Tu día está en blanco. Pulsa «Añadir momento» y empieza a construir la rutina que de verdad encaja contigo.",
  "metodo.ayurDia.verDiaEjemplo": "Ver un día de ejemplo",
  "metodo.ayurDia.noPerfecto":
    "Tu día no tiene que ser perfecto. Basta con que, poco a poco, se parezca un poco más a lo que tu cuerpo necesita.",
  "metodo.ayurDia.guardaParaSeguir": "Guarda tu día para continuar.",
  "metodo.ayurDia.esComida": "¿Es una comida?",
  "metodo.ayurDia.alimentosEquilibran": "Alimentos que te equilibran",
  "metodo.ayurDia.pulsaPuntoPartida":
    "Pulsa una para usarla como punto de partida. Puedes cambiarla a tu gusto.",
  "metodo.ayurDia.diaEjemplo": "Un día de ejemplo",
  "metodo.ayurDia.soloInspirarte": "Solo para inspirarte. Tu día lo escribes tú, a tu manera.",
  "metodo.ayurDia.crearElMio": "Crear el mío",
  "metodo.ayurDia.editar": "Editar",
  "metodo.ayurDia.quitar": "Quitar",
  "metodo.ayurDia.queHaras": "¿Qué harás en este momento?",

  // ── Cábala · mapa evolutivo ────────────────────────────────────────────
  "metodo.cabala.diagIntro":
    "Las sefirot son estados; los senderos, transiciones. El crecimiento no ocurre en una capacidad aislada, sino en el paso de una a la siguiente. Este mapa busca qué transición evolutiva está bloqueada.",
  "metodo.cabala.faltanRespuestas": "Aún faltan respuestas",
  "metodo.cabala.faltanRespuestasTexto":
    "Completa la «Escala de equilibrio» de al menos dos dimensiones consecutivas para empezar a ver tus transiciones. Cuantas más completes, más preciso será tu mapa.",
  "metodo.cabala.pasoPrioritario": "Tu paso evolutivo prioritario",
  "metodo.cabala.siguientePaso": "Tu siguiente paso",
  "metodo.cabala.transicionesFluyen": "Tus transiciones fluyen",
  "metodo.cabala.transicionesFluyenTexto":
    "En las dimensiones que has respondido no aparece un bloqueo claro entre una capacidad y la siguiente. Sigue completando el resto para afinar el mapa.",
  "metodo.cabala.otrasTransiciones": "Otras transiciones a observar",
  "metodo.cabala.tusCapacidades": "Tus capacidades",
  "metodo.cabala.numeroDice": "El número dice",
  "metodo.cabala.cuanto": "cuánto",
  "metodo.cabala.tienesDesarrollada": "tienes desarrollada la capacidad. La palabra dice",
  "metodo.cabala.haciaDonde": "hacia dónde",
  "metodo.cabala.seDesequilibra":
    "se desequilibra — no es una nota, y ninguna de las tres es peor que otra:",
  "metodo.cabala.sinResponder": "sin responder",
  "metodo.cabala.mapaEvolutivo": "Mapa Evolutivo",
  "metodo.cabala.desarrolladas": "Capacidades desarrolladas",
  "metodo.cabala.porFortalecer": "Capacidades por fortalecer",
  "metodo.cabala.falta": "esa energía te falta. El trabajo es construirla.",
  "metodo.cabala.equilibrio": "la usas de forma proporcionada a lo que pide cada situación.",
  "metodo.cabala.exceso":
    "la tienes de sobra y empieza a volverse en tu contra (rigidez, autoexigencia, no saber parar). El trabajo es soltar, no añadir.",

  // ── Cábala · capítulos de sus Ilustraciones ────────────────────────────
  "metodo.cabalaIlus.origen": "El Origen",
  "metodo.cabalaIlus.sefirot": "Las 10 Sefirot",
  "metodo.cabalaIlus.senderos": "Los 22 Senderos",

  // ── Cábala · el relato de cada transición del Mapa Evolutivo ───────────
  // Cuando la transición NO es un bloqueo, el texto se arma con el nombre de las
  // dos sefirot y su tema. El relato de los bloqueos es contenido y vive en
  // cabalaDiagnostico(.en).ts.
  "metodo.cabala.diag.sinBase":
    "Todavía no hay base suficiente en {from}. Antes de trabajar este sendero conviene desarrollar primero {from} ({eFrom}).",
  "metodo.cabala.diag.invertida":
    "Has desarrollado más {eTo} ({to}) que {eFrom} ({from}). Conviene reforzar la base de {from} para que {to} tenga una dirección más sólida.",
  "metodo.cabala.diag.fluida":
    "Conviertes con fluidez {eFrom} en {eTo}. Esta transición fluye bien.",
  "metodo.cabala.diag.repasar": "Repasar {sefira}",
  "metodo.cabala.diag.trabajar": "Trabajar {sefira}",
  "metodo.cabala.diag.ningunaDestaca": "Ninguna destaca todavía.",
  "metodo.cabala.diag.ningunaBaja": "Ninguna especialmente baja.",

  // ── Cábala · nombres de paso (índice y botones «anterior/siguiente») ────
  // Un paso se escribe UNA vez: el mismo nombre sirve para el índice, para el
  // botón que lleva a él («Nombre →») y para el que vuelve («← Nombre») desde
  // la página vecina. Los títulos del índice salen de aquí, así que `cabalaIndice`
  // es una función (ver la nota en cabalaRecorrido.ts).
  "metodo.cabala.paso.intro": "Introducción",
  "metodo.cabala.paso.arbol": "El Árbol de la Vida",
  "metodo.cabala.paso.arbolCorto": "El Árbol",
  "metodo.cabala.paso.diagnostico": "Diagnóstico",
  "metodo.cabala.paso.senderos": "Los Senderos",
  "metodo.cabala.paso.senderos22": "Los 22 Senderos",
  "metodo.cabala.paso.senderosDiag": "Diagnóstico de los Senderos",
  "metodo.cabala.paso.senderosDiagCorto": "Senderos",
  "metodo.cabala.paso.final": "Diagnóstico final",
  "metodo.cabala.paso.dias": "10 días con tus dimensiones",
  "metodo.cabala.paso.diasCorto": "10 días",

  // ── Cábala · El Árbol de la Vida (paso 2) ──────────────────────────────
  "metodo.cabala.arbolDesbloquea":
    "Descubre la ilustración de todas las sefirot para desbloquear el recorrido",

  // ── Cábala · la página de cada sefirá ──────────────────────────────────
  // Solo los rótulos: el contenido de cada dimensión (su intro, sus listas, su
  // clave de desarrollo) vive en cabalaSefirot(.en).ts.
  "metodo.cabala.sefira.escala": "Escala de equilibrio",
  "metodo.cabala.sefira.puntua": "Puntúa cada frase del **1** (nunca) al **10** (siempre).",
  "metodo.cabala.sefira.equilibrado": "Equilibrado",
  "metodo.cabala.sefira.desequilibrado": "Desequilibrado",
  "metodo.cabala.sefira.autoevaluacion": "Autoevaluación (1–10)",
  "metodo.cabala.sefira.autoevalCorto": "Autoevaluación",
  "metodo.cabala.sefira.clave": "Clave de desarrollo",
  "metodo.cabala.sefira.contenidoPronto": "Contenido próximamente.",
  "metodo.cabala.sefira.noGuardado":
    "No se ha podido guardar. Revisa tu conexión y vuelve a intentarlo.",
  "metodo.cabala.sefira.teQueda": "Para seguir te queda por completar {falta}.",
  "metodo.cabala.sefira.faltaAutoeval": "la autoevaluación",
  "metodo.cabala.sefira.faltaEscala": "la escala de equilibrio",
  "metodo.cabala.sefira.faltaOtra":
    "Para ver tu Diagnóstico falta el contenido de alguna otra sefirá.",
  "metodo.cabala.sefira.completaDimension":
    "Completa todo lo que se pide en esta dimensión para continuar",
  "metodo.cabala.sefira.rellenaTodas":
    "Rellena el contenido de todas las sefirot para ver tu Diagnóstico",

  // ── Cábala · Los 22 Senderos (el Árbol en modo senderos) ───────────────
  "metodo.cabala.senderos.intro":
    "Si las sefirot son estados, los senderos son el movimiento entre ellos. Toca cualquiera de los 22 caminos para ver su ilustración. Cuando los hayas descubierto todos, se desbloqueará el recorrido.",
  "metodo.cabala.senderos.recorrer": "Recorrer",
  "metodo.cabala.senderos.desbloquea":
    "Descubre la ilustración de los 22 senderos para recorrerlos uno a uno",
  "metodo.cabala.senderos.comenzarPor": "Comenzar por {letra}",
  "metodo.cabala.senderos.descubreTodos": "Descubre los 22 senderos para empezar",

  // ── Cábala · la página de cada sendero ─────────────────────────────────
  // Rótulos de la plantilla. El contenido de los 22 (significado, test, bandas)
  // vive en cabalaSenderos(.en).ts.
  "metodo.cabala.sendero.sendero": "Sendero {letra}",
  "metodo.cabala.sendero.significado": "Significado tradicional",
  "metodo.cabala.sendero.psicologica": "Traducción psicológica",
  "metodo.cabala.sendero.queUne": "¿Qué une este sendero?",
  "metodo.cabala.sendero.test": "Test",
  "metodo.cabala.sendero.interpretacion": "Interpretación",
  "metodo.cabala.sendero.tuPuntuacion": "Tu puntuación: {total}",
  "metodo.cabala.sendero.responde5": "Responde las 5 preguntas para ver tu interpretación.",
  "metodo.cabala.sendero.senales": "Señales de desequilibrio",
  "metodo.cabala.sendero.observaSi": "Durante esta semana observa si…",
  "metodo.cabala.sendero.umbral": "Has cruzado este umbral cuando…",
  "metodo.cabala.sendero.siguiente": "Siguiente sendero",
  "metodo.cabala.sendero.verDiagnostico": "Ver diagnóstico",
  "metodo.cabala.sendero.respuestaN": "Respuesta pregunta {n} (1 a 5)",
  "metodo.cabala.sendero.completaEste":
    "Completa el test de este sendero para pasar a la siguiente letra",
  "metodo.cabala.sendero.completaLos22":
    "Completa el test de los 22 senderos para ver tu Diagnóstico",

  // ── Cábala · Diagnóstico de los Senderos ───────────────────────────────
  "metodo.cabala.senderosDiag.intro":
    "Cada sendero es una transición entre dos capacidades. Aquí se reúne el resultado de tus 22 tests para mostrar qué caminos fluyen y cuáles piden más trabajo.",
  "metodo.cabala.senderosDiag.completados": "{n}/{total} senderos completados",
  "metodo.cabala.senderosDiag.faltan": "Aún faltan senderos por recorrer",
  "metodo.cabala.senderosDiag.faltanTexto":
    "Completa el test de los 22 senderos para recibir tu diagnóstico final. Cada respuesta se guarda automáticamente; puedes continuar cuando quieras.",
  "metodo.cabala.senderosDiag.prioritarios": "Tus senderos prioritarios",
  "metodo.cabala.senderosDiag.fluyen": "Tus transiciones fluyen",
  "metodo.cabala.senderosDiag.fluyenTexto":
    "No aparece ningún sendero con una resistencia marcada. Sigue observándote: el equilibrio se sostiene practicándolo.",
  "metodo.cabala.senderosDiag.los22": "Los 22 senderos",

  // ── Cábala · Diagnóstico final ─────────────────────────────────────────
  "metodo.cabala.final.intro":
    "Aquí se reúne todo tu recorrido: tus dimensiones (las sefirot) y tus transiciones (los senderos). Puedes descargarlo para guardarlo y volver a él cuando quieras.",
  "metodo.cabala.final.descargar": "Descargar mi diagnóstico",
  "metodo.cabala.final.preparando": "Preparando tu PDF…",
  "metodo.cabala.final.tusDimensiones": "Tus dimensiones",
  "metodo.cabala.final.tusSenderos": "Tus senderos",

  // ── Cábala · 10 días con tus dimensiones ───────────────────────────────
  "metodo.cabala.dias.intro":
    "Diez días, una dimensión cada día. Dedica la jornada a observar y practicar la sefirá que toca, apoyándote en su ejercicio. No se trata de hacerlo perfecto, sino de habitar cada energía un día entero.",
  "metodo.cabala.dias.omerTitulo": "Una tradición: la Cuenta del Omer (Sefirat HaOmer)",
  /** Las **negritas** se pintan en cursiva aquí: es el nombre de la práctica. */
  "metodo.cabala.dias.omerTexto":
    "En la Cábala existe una práctica milenaria en la que, día a día, uno se centra en un atributo concreto del alma: la **Cuenta del Omer** (Sefirat HaOmer). Dura 49 días (siete semanas por siete sefirot) y cada jornada trabaja una combinación —por ejemplo, «Gevurah dentro de Chesed»—. Este trabajo de 10 días es una adaptación más breve: una sefirá por día, para que empieces a reconocer cada energía en tu Vida cotidiana.",
  "metodo.cabala.dias.dia": "Día {n}",
  "metodo.cabala.dias.reflexiona": "Reflexiona a lo largo del día",
  "metodo.cabala.dias.cierre":
    "“Al décimo día, el Árbol ya no está fuera de ti: lo reconoces en tu forma de vivir.”",

  // ── Psicología · Línea de Vida ─────────────────────────────────────────
  "metodo.psico.lineaEnhorabuena": "Has reconstruido tu Vida entera. Enhorabuena por no abandonarte.",
  "metodo.psico.buscaFotos": "Se recomienda buscar fotos de todas las edades de tu Vida.",
  "metodo.psico.miLinea": "Mi línea de tiempo",
  "metodo.psico.antesDeContinuar": "Antes de continuar",
  "metodo.psico.cuantoMasCompletes":
    "Cuanto más completes tu línea de Vida, más claro verás después tus huellas, tus nudos y tus heridas.",
  "metodo.psico.rellenaEntera": "Rellénala entera, o todo lo que puedas.",
  "metodo.psico.siRemueve":
    "Y si te resulta muy difícil recordar o remueve demasiado, no tienes que hacerlo solo: puedes pedir una llamada y lo hacemos juntos.",
  "metodo.psico.seguirRellenando": "Seguir rellenando",
  "metodo.psico.pedirLlamada": "Pedir una llamada",
  "metodo.psico.continuarIgual": "Continuar de todas formas →",
  "metodo.psico.antesDeNacer": "Antes de nacer",
  "metodo.psico.empiezaAntes": "Tu historia empieza mucho antes de nacer.",
  "metodo.psico.guardarCerrar": "Guardar y cerrar",
  "metodo.psico.lineaDeVida": "Línea de Vida",
  "metodo.psico.recorreLinea":
    "Recorre tu línea de Vida conmigo. Agenda una llamada · horario peninsular España",
  "metodo.psico.quitar": "Quitar",

  // ── Psicología · regulación ────────────────────────────────────────────
  "metodo.psico.bilateral": "Estimulación bilateral · usa auriculares",
  "metodo.psico.audioPronto": "El audio estará disponible muy pronto. Puedes escribir igualmente.",
  "metodo.psico.juntaFragmentos":
    "Junta los fragmentos de tus recuerdos. Pon en palabras tu dolor para darle sentido y empezar a integrarlo.",
  "metodo.psico.anadir": "+ Añadir",
  "metodo.psico.hacerCierre": "Hacer el cierre",
  "metodo.psico.estoyMejor": "Estoy mejor",
  "metodo.psico.narra": "Narra",
  "metodo.psico.desdeElPrincipio": "Volver a poner desde el principio",
  "metodo.psico.progresoAudio": "Progreso del audio",
  "metodo.psico.volumen": "Volumen",
  "metodo.psico.quitarFragmento": "Quitar este fragmento",

  // ── Psicología · nombres de los pasos ──────────────────────────────────
  // Los pinta la cabecera de cada página, el índice y los botones que llevan
  // de un paso al de al lado: una sola clave para los tres sitios.
  "metodo.psico.paso.vuelveATi": "Vuelve a ti",
  "metodo.psico.paso.problemas": "Problemas",
  "metodo.psico.paso.resultadoAce": "Resultado ACE",
  "metodo.psico.paso.cursosCorto": "Cursos",
  "metodo.psico.paso.ace": "ACE",
  "metodo.psico.paso.aceResultado": "Tu resultado",
  "metodo.psico.paso.familia": "Tu familia",
  "metodo.psico.paso.genograma": "Genograma",
  "metodo.psico.paso.huellas": "Huellas",
  "metodo.psico.paso.nudos": "Nudos",
  "metodo.psico.paso.necesidades": "Necesidades",
  "metodo.psico.paso.heridas": "Heridas",
  "metodo.psico.paso.tusHeridas": "Tus heridas",
  "metodo.psico.paso.relacion": "Relación",
  "metodo.psico.paso.recuerdate": "Recuérdate",
  "metodo.psico.paso.dones": "Dones",
  "metodo.psico.paso.miedos": "Miedos",
  "metodo.psico.paso.atrevete": "Atrévete",
  "metodo.psico.paso.integracion": "Integración",
  "metodo.psico.paso.compromiso": "Compromiso",
  "metodo.psico.paso.carta": "Carta",
  "metodo.psico.paso.sintesis": "Síntesis",
  "metodo.psico.paso.cursos": "Cursos para profundizar",

  // ── Psicología · test ACE ──────────────────────────────────────────────
  "metodo.psico.guardando": "Guardando…",
  "metodo.psico.testTerminado": "Has terminado el test.",
  "metodo.psico.testTerminadoPie":
    "Vamos a ver qué significa tu resultado y cómo estas experiencias influyen en ti hoy.",
  "metodo.psico.verMiResultado": "Ver mi resultado →",
  "metodo.psico.queSignificaAce": "¿Qué significa tu resultado ACE?",
  "metodo.psico.tuPuntuacionAce": "Tu puntuación ACE",
  "metodo.psico.aceRiesgo":
    "Cuantas más experiencias adversas, mayor es el riesgo de enfermedades y dificultades.",
  "metodo.psico.continuarLinea": "Continuar a Línea de Vida →",

  // ── Psicología · la carta a tu yo del futuro ───────────────────────────
  "metodo.psico.cartaIntro":
    "Escríbete una carta para el próximo momento difícil. No para juzgarte: para recordar el camino que ya conoces.",
  "metodo.psico.cartaTitular": "Cuando vuelvas a bloquearte, recuerda...",
  "metodo.psico.cartaGracias": "Gracias por no abandonarte.",
  "metodo.psico.cartaPlaceholder":
    "Yo del futuro, cuando vuelvas a sentirte bloqueado, recuerda…",

  // ── Psicología · compromiso ────────────────────────────────────────────
  "metodo.psico.compromisoIntro":
    "Ya entiendes tu historia. Toma conciencia de lo que no pudieron darte y comprométete a tratarte con un poco más de cariño cada día.",
  "metodo.psico.compromisoFalta": "Lo que más eché en falta fue…",
  "metodo.psico.compromisoHoy": "Hoy puedo empezar a dármelo…",

  // ── Psicología · cursos ────────────────────────────────────────────────
  "metodo.psico.cursosIntro":
    "Si quieres profundizar en la psicología humana, estos cursos te acompañarán paso a paso.",

  // ── Psicología · Recuérdate y Dones ────────────────────────────────────
  "metodo.psico.sinIdeas": "Sin ideas",
  "metodo.psico.escribeLoPrimero": "Escribe lo primero que te venga, sin pensarlo mucho…",
  "metodo.psico.loQueRecordaste": "Lo que recordaste de ti",
  "metodo.psico.tocaParaUnir": "Toca lo que quieras unir al don activo.",
  "metodo.psico.sinRecuerdate": "Aún no has respondido las preguntas de «Recuérdate».",
  "metodo.psico.irARecuerdate": "Ir a Recuérdate →",
  "metodo.psico.donesVacio":
    "Pulsa «Añadir don», ponle nombre y toca las cartas de «Tus arquetipos» para unirlas.",
  "metodo.psico.anadirDon": "+ Añadir don",
  "metodo.psico.tusArquetipos": "Tus arquetipos",
  "metodo.psico.tusDones": "Tus dones",
  "metodo.psico.nombraTuDon": "Nombra tu don…",
  "metodo.psico.borrarDon": "Borrar don",

  // ── Psicología · familia y genograma ───────────────────────────────────
  "metodo.psico.tocaParaCambiarla": "· toca una elegida para cambiarla",
  "metodo.psico.genogramaIntro":
    "Toca un «+» junto a tu foto para colocar a alguien: arriba tus padres y abuelos, a los lados tus hermanos o tu pareja.",
  "metodo.psico.quitarDelMapa": "¿Quitarla del mapa?",
  "metodo.psico.siQuitar": "Sí, quitar",
  "metodo.psico.no": "No",
  "metodo.psico.hecho": "Hecho ✓",
  "metodo.psico.suNombre": "Su nombre…",
  "metodo.psico.parentesco": "Parentesco (madre, abuelo…)",

  // ── Psicología · huellas, nudos y heridas ──────────────────────────────
  "metodo.psico.sinHeridas": "Todavía no has guardado ninguna herida.",
  "metodo.psico.crearMisHeridas": "← Crear mis heridas",
  "metodo.psico.huellasIntro": "Recorre tu historia. Marca con ◈ los recuerdos que dejaron huella en ti.",
  "metodo.psico.sinRecuerdos":
    "Todavía no has escrito recuerdos en tu línea de Vida. Vuelve atrás y visita los años que quieras recordar.",
  "metodo.psico.sinRecuerdosAnio": "Sin recuerdos escritos este año.",
  "metodo.psico.marcarHuella": "Marcar que dejó huella",
  "metodo.psico.heridasIntro":
    "Una experiencia que deja Huella puede dejar una necesidad emocional sin cubrir. Para dar sentido a ese dolor y evitar que vuelva a repetirse, la mente crea un Nudo: una creencia protectora que, aunque nace para ayudarnos, acaba limitando nuestra forma de vivir. La unión de la experiencia, la necesidad no cubierta y ese nudo constituye una Herida emocional.",
  "metodo.psico.heridaEnCurso": "Tu herida en curso",
  "metodo.psico.tocaParaReunir": "Toca huellas, nudos y necesidades para reunir una herida.",
  "metodo.psico.heTerminadoHerida": "He terminado esta herida",
  "metodo.psico.ponleNombreHerida": "Ponle nombre a tu herida",
  "metodo.psico.seguirEligiendo": "Seguir eligiendo",
  "metodo.psico.guardarHerida": "Guardar herida",
  "metodo.psico.ejHerida": "Ej.: La herida del abandono…",

  // ── Psicología · relación e integración ────────────────────────────────
  "metodo.psico.relacionIntro":
    "Tus arquetipos muestran dónde y cómo fuiste herido. Relaciona tus Heridas con tus Arquetipos, ponles nombre y deja de cargar con ellas en silencio.",
  "metodo.psico.relacionVacio": "Pulsa «Añadir relación» y empieza a reunir heridas y arquetipos.",
  "metodo.psico.anadirRelacion": "+ Añadir relación",
  "metodo.psico.sinHeridasAun": "Aún no has creado tus heridas.",
  "metodo.psico.tusRelaciones": "Tus relaciones",
  "metodo.psico.tituloRelacion": "Título de la relación…",
  "metodo.psico.borrarRelacion": "Borrar relación",
  "metodo.psico.queRelacion": "¿Qué relación encuentras? Escribe lo que tú ves…",
  "metodo.psico.integracionIntro":
    "Nada de lo que has vivido puede cambiarse. Pero sí puedes cambiar el significado que tiene en tu historia. Dale un sentido a tu dolor para que deje de convertirse en sufrimiento.",
  "metodo.psico.sinRelaciones":
    "Aún no has compuesto tus relaciones. Vuelve a la página «Relación» para reunirlas y aquí les darás un sentido.",
  "metodo.psico.irARelacion": "Ir a Relación →",
  "metodo.psico.enhorabuenaLlegar": "Enhorabuena por haber llegado hasta aquí.",
  "metodo.psico.eresValiente": "Eres muy valiente.",
  "metodo.psico.continuar": "Continuar →",
  "metodo.psico.tuRelacion": "Tu relación",
  "metodo.psico.anterior": "‹ Anterior",

  // ── Psicología · miedos y nudos (las dos listas se escriben igual) ─────
  "metodo.psico.anadirCorto": "Añadir",
  "metodo.psico.siTeSirven": "Si te sirven de inspiración",
  "metodo.psico.todosLosEjemplos": "Ya has añadido todos los ejemplos ✓",
  "metodo.psico.aquiMiedos": "Aquí aparecerán los miedos que vayas escribiendo.",
  "metodo.psico.escribeMiedo": "Escribe un miedo y pulsa Añadir…",
  "metodo.psico.aquiNudos": "Aquí aparecerán los nudos que vayas seleccionando.",
  "metodo.psico.escribeNudo": "Escribe un nudo y pulsa Añadir…",
  "metodo.psico.sinMiedos": "Aún no has nombrado tus miedos. Vuelve a la página anterior para escribirlos.",
  "metodo.psico.irAMiedos": "Ir a Miedos →",

  // ── Psicología · necesidades ───────────────────────────────────────────
  "metodo.psico.bloqueada": "Bloqueada",
  "metodo.psico.necesidadDelNino": "Necesidad del niño",
  "metodo.psico.comoLoViviste": "¿Cómo lo viviste tú?",
  "metodo.psico.respondeAnterior": "Responde la necesidad anterior para desbloquearla.",

  // ── Psicología · síntesis ──────────────────────────────────────────────
  /** Las 4 preguntas de integración por relación (se ven en Integración y en Síntesis). */
  "metodo.psico.integra.proteger": "Qué intentaba proteger",
  "metodo.psico.integra.coste": "Qué me cuesta mantenerlo",
  "metodo.psico.integra.verdadSana": "La verdad más sana que quiero practicar",
  "metodo.psico.integra.recordatorio": "Lo que quiero recordar",
  "metodo.psico.deDiez": "DE 10",
  "metodo.psico.paraCuandoVuelva": "Para cuando vuelva a sentirme bloqueado:",
  "metodo.psico.sintesisIntro":
    "Aquí está todo tu mapa, de principio a fin. Desde el problema con el que llegaste hasta la carta que te escribiste. Léelo entero: esto eres tú.",
  "metodo.psico.sintesisVacia":
    "Aún no hay nada que sintetizar. A medida que recorras el camino, aquí aparecerá todo lo que escribas.",
  "metodo.psico.llevateMapa": "Llévate todo tu mapa",
  "metodo.psico.llevateLinea": "Llévate tu línea de Vida",
  "metodo.psico.descargaCuaderno":
    "Descárgalo en un cuaderno en PDF, cuidado y bonito, para releerlo siempre que lo necesites.",
  "metodo.psico.volverArriba": "Volver arriba",
  "metodo.psico.leer": "Leer",

  // ── Cultura · nombres de paso ──────────────────────────────────────────
  // Un paso se escribe UNA vez: el mismo nombre sirve para el título de su
  // cabecera y para el botón que vuelve a él («← Nombre») desde la página
  // vecina. El CONTENIDO de las seis Historias (eras, momentos y sus viñetas)
  // no cabe aquí: vive en los `culturaHistoria*.ts`, y lo que no esté traducido
  // se sigue leyendo en español.
  "metodo.cultura.paso.intro": "Introducción",
  "metodo.cultura.paso.historias": "Las Historias",
  "metodo.cultura.paso.historia": "La Historia",
  "metodo.cultura.paso.apuntes": "Tus apuntes",

  // ── Cultura · las seis Historias ───────────────────────────────────────
  // El título sale de aquí y no de `culturaHistorias.ts` porque se cita en tres
  // sitios —la rejilla de Historias, la cabecera de su línea del tiempo y el
  // taller de apuntes— y los tres tienen que decir lo mismo. La rejilla lo pinta
  // en mayúsculas ella sola.
  "metodo.cultura.historia.universal": "Historia Universal",
  "metodo.cultura.historia.religiones": "Historia de las religiones",
  "metodo.cultura.historia.filosofia": "Historia de la filosofía",
  "metodo.cultura.historia.ciencia": "Historia de la ciencia",
  "metodo.cultura.historia.medicina": "Historia de la medicina",
  "metodo.cultura.historia.arte": "Historia del arte y la literatura",

  // ── Cultura · la página de una era ─────────────────────────────────────
  // En la primera y en la última era el botón se queda puesto pero apagado (con
  // su explicación), para que no baile la fila de botones de una era a otra.
  "metodo.cultura.era.anterior": "Era anterior",
  "metodo.cultura.era.siguiente": "Era siguiente",
  "metodo.cultura.era.esPrimera": "Es la primera era de la Historia",
  "metodo.cultura.era.esUltima": "Es la última era de la Historia",

  // ── Cultura · Tus apuntes ──────────────────────────────────────────────
  "metodo.cultura.apuntes.intro1":
    "Llévate por escrito lo que has recorrido. Elige de qué Historia quieres los apuntes y dentro marcas las etapas que te interesan: se te monta un cuaderno con eso y nada más.",
  "metodo.cultura.apuntes.intro2":
    "Un cuaderno por Historia, porque las seis juntas no caben en un solo archivo. Puedes volver y montarlos cuantas veces quieras.",
  /** Lo que trae dentro cada Historia, para decidir sin entrar. */
  "metodo.cultura.apuntes.etapa": "{n} etapa",
  "metodo.cultura.apuntes.etapas": "{n} etapas",
  "metodo.cultura.apuntes.momentos": "{n} momentos",

  // ── Pago de una disciplina ─────────────────────────────────────────────
  "metodo.pago.precioReducido": "Aprovecha que está en un precio reducido",
  "metodo.pago.ahoraNo": "Ahora no",
  "metodo.pago.stripe": "Pago seguro a través de Stripe",
  "metodo.pago.palabra":
    "Doy mi palabra de honor de que todos los textos son obra mía, escritos por mí. Aunque me he apoyado en herramientas de inteligencia artificial, las ideas, las palabras y el contenido son enteramente míos.",
  "metodo.pago.realizado": "Pago de {disciplina} realizado",
  "metodo.pago.yaPuedes": "Ya puedes acceder.",

  // Fisiología tiene módulo propio: `textos/es/fisiologia.ts`.

  // Ordinal de cada disciplina en la cabecera del box de pago. Va como frase
  // entera y no «{n}ª disciplina» porque en inglés el ordinal es irregular.
  "metodo.pago.ordinal.1": "Primera disciplina",
  "metodo.pago.ordinal.2": "Segunda disciplina",
  "metodo.pago.ordinal.3": "Tercera disciplina",
  "metodo.pago.ordinal.4": "Cuarta disciplina",
  "metodo.pago.ordinal.5": "Quinta disciplina",
  "metodo.pago.ordinal.6": "Sexta disciplina",
  "metodo.pago.ordinal.7": "Séptima disciplina",
  "metodo.pago.ordinal.8": "Octava disciplina",

  // Resumen de cada disciplina en su box de pago.
  "metodo.pago.resumen.astrologia":
    "Empieza el mapa con tu carta natal: descubre tus puntos clave, tus dones y tus conflictos. Encuentra dónde nacieron tus heridas y qué arquetipos te habitan.",
  "metodo.pago.resumen.psicologia":
    "Continúa el Mapa con Psicología: reconstruye tu historia y comprende cómo se fue construyendo tu mente, recorriendo tus vínculos, tus etapas y tus heridas.",
  "metodo.pago.resumen.ayurveda":
    "Continúa el Mapa con el Hinduismo: descubre tu Doṣha —tu constitución— y la naturaleza que te define, y aprende a comer, moverte y descansar de acuerdo con ella.",
  "metodo.pago.resumen.tcm":
    "Continúa el Mapa con la Medicina China: descubre cómo los Cinco Elementos y sus ciclos te habitan, y lee las señales de tu cuerpo antes de que se conviertan en síntoma.",
  "metodo.pago.resumen.fisiologia":
    "Continúa el Mapa con la Fisiología: viaja desde las partículas que te forman hasta el milagro de ser un cuerpo vivo, conoce tus células y tus sistemas y redescúbrete como el ser complejo y fascinante que eres.",
  "metodo.pago.resumen.nutricion":
    "Continúa el Mapa con la Nutrición: descubre qué hay más allá de lo que comes cada día y nútrete con lo que de verdad te reconstruye. Recuerda cómo no destruirte con los alimentos.",
  "metodo.pago.resumen.cabala":
    "Adéntrate en la Cábala y recorre el Árbol de la Vida: descubre las diez sefirot que te habitan, los 22 senderos de la consciencia y aprende a reconocer en ti esas fuerzas para vivir desde tu esencia.",
  "metodo.pago.resumen.cultura":
    "Cierra El Mapa recorriendo la Historia de la Filosofía, la Medicina, la Religión y la cultura general: recuerda de dónde venimos para entender dónde estamos y poder crear un futuro más bonito.",
} as const;
