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

  // ── Botones que salen de un cómic hacia el paso siguiente ──────────────
  "metodo.irA": "Ir a {destino}",
  "metodo.destino.nutrientes": "los nutrientes",
  "metodo.destino.moleculas": "Moléculas",
  "metodo.destino.hambre": "El hambre",
  "metodo.destino.plato": "Tu plato",
  "metodo.destino.microbiota": "la microbiota",
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

  // ── Pago de una disciplina ─────────────────────────────────────────────
  "metodo.pago.precioReducido": "Aprovecha que está en un precio reducido",
  "metodo.pago.ahoraNo": "Ahora no",
  "metodo.pago.stripe": "Pago seguro a través de Stripe",
  "metodo.pago.palabra":
    "Doy mi palabra de honor de que todos los textos son obra mía, escritos por mí. Aunque me he apoyado en herramientas de inteligencia artificial, las ideas, las palabras y el contenido son enteramente míos.",
  "metodo.pago.realizado": "Pago de {disciplina} realizado",
  "metodo.pago.yaPuedes": "Ya puedes acceder.",

  // ── Fisiología · nivel «La Vida» ────────────────────────────────────────
  // Títulos de los pasos. Están aquí y no en cada página porque los pasos se
  // citan unos a otros en los botones «← anterior» / «siguiente →»: si se
  // escribieran a mano en cada sitio, bastaría cambiar un título para que el
  // botón de la página de al lado dejara de coincidir.
  "fisiologia.celula.titulo": "Célula",
  "fisiologia.lasCelulas.titulo": "Las células de tus órganos",
  "fisiologia.sistemas.titulo": "Sistemas",
  "fisiologia.organismo.titulo": "El cuerpo",

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
