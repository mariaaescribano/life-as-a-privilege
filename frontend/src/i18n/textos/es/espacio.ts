/**
 * Mi Espacio (/espacio) — la zona privada.
 *
 * Por ahora, los textos de la página del Doṣha (`AyurvedaMiEspacio`): el
 * resultado guardado del test de Ayurveda, con su descripción y sus consejos.
 *
 * Los NOMBRES de los doṣhas (Vata, Pitta, Kapha) no están aquí a propósito:
 * son términos sánscritos, no se traducen y viven en el propio componente.
 */
export const espacio = {
  // ── Página del Doṣha: rótulos ──────────────────────────────────────────
  "espacio.dosha.titulo": "Tu Dosha",
  "espacio.dosha.consejos": "Consejos para tu Prakriti ~ Constitución",
  "espacio.dosha.distribucion": "Distribución de tu Prakriti ~ Constitución",
  "espacio.dosha.predominante": "Predominante",
  "espacio.dosha.descargarPdf": "Descargar PDF",
  "espacio.dosha.borrando": "Borrando…",
  "espacio.dosha.borrar": "Borrar y repetir el test",

  // ── Fisiología · los ocho órganos y su test ────────────────────────────
  // El nombre, la descripción, las preguntas y los remedios de cada órgano NO
  // están aquí: son datos, y viven en `OrganosFisiologia.en.ts`.
  "espacio.fisio.celulas": "Las células de tu cuerpo",
  "espacio.fisio.plantas": "Plantas y remedios naturales",
  "espacio.fisio.bien": "Tu {organo} parece estar bien",
  "espacio.fisio.bienTexto":
    "No has marcado síntomas significativos. Sigue cuidándote con una alimentación natural y descanso suficiente.",
  "espacio.fisio.repetir": "Repetir test",

  // ── Fitoterapia · las plantas favoritas ────────────────────────────────
  "espacio.fito.inicia": "Inicia sesión para ver tus plantas favoritas.",
  "espacio.fito.cargando": "Cargando tus favoritas…",
  "espacio.fito.explorar": "Explorar el herbario",

  // ── Astrología · la carta guardada ─────────────────────────────────────
  "espacio.astro.arquetipos": "¿Quieres saber qué arquetipos te forman?",
  "espacio.astro.lectura": "¿Quieres una lectura profesional de tu Carta Astral?",
  "espacio.astro.transcripcion": "Transcripción",
  "espacio.astro.tuCartaNatal": "Tu Carta Natal",
  "espacio.astro.perfil": "Perfil",
  /** Los tres campos de la carta que se guardan en Mi Espacio. */
  /** «Sol en» ~ «Luna en»: el rótulo del signo elegido. El español pega la
   *  preposición al final y el inglés no siempre, así que va con hueco. */
  "espacio.astro.campoEn": "{campo} en",
  "espacio.astro.tuCampo": "Tu {campo}",
  "espacio.astro.sol": "Sol",
  "espacio.astro.luna": "Luna",
  "espacio.astro.ascendente": "Ascendente",

  // ── Cábala · el test del Árbol ─────────────────────────────────────────
  "espacio.cabala.autoconocimiento": "Autoconocimiento · {n} preguntas",
  "espacio.cabala.comenzar": "Comenzar el test →",
  "espacio.cabala.repetir": "Repetir el test",

  // ── Botón compartido por las páginas de Mi Espacio ─────────────────────
  "espacio.descargarPdf": "Descargar PDF",

  // ── Las categorías de «Tus consejos personalizados» ────────────────────
  // Las comparten el test de los Doṣhas y los tres de Medicina China.
  "espacio.cons.infusiones": "Infusiones",
  "espacio.cons.hierbas": "Hierbas",
  "espacio.cons.nutricion": "Nutrición",
  "espacio.cons.alimentacion": "Alimentación",
  "espacio.cons.estiloDeVida": "Estilo de Vida",
  "espacio.cons.evitar": "Evitar",

  // ── Medicina China · Mi Espacio y los tres test ────────────────────────
  // Los NOMBRES de los resultados (Madera, Deficiencia de Qi…) no están aquí:
  // son la clave con la que se guardan en la base de datos y se traducen para
  // pintar en `data/tcmEspacio.en.ts`.
  "espacio.tcm.tests": "Tests para el Autoconocimiento",
  "espacio.tcm.bloqueado": "Completa el test para desbloquear tu resultado personalizado",
  /** Botón del test que aún no se ha hecho. {test} = el nombre del test. */
  "espacio.tcm.hacerTest": "Hacer test de {test}",
  "espacio.tcm.recomendaciones": "Recomendaciones",
  "espacio.tcm.rec.infusiones": "Infusiones y Tés",
  "espacio.tcm.rec.hierbas": "Hierbas Medicinales",
  "espacio.tcm.rec.estiloDeVida": "Estilo de Vida",
  "espacio.tcm.rec.nutricion": "Nutrición",
  "espacio.tcm.saberMas": "Quiero saber más",
  "espacio.tcm.rehacer": "Rehacer test",
  "espacio.tcm.evaluacion": "Evaluación personalizada",
  "espacio.tcm.evaluacion.placeholder": "¿Te gustaría contarme algo por adelantado?",
  "espacio.tcm.diagnostico": "Diagnóstico completo",
  "espacio.tcm.diagnostico.sub":
    "Déjame tus datos y me pondré en contacto contigo para ofrecerte un diagnóstico personalizado de Medicina China.",

  // Los tres test: el rótulo de la tarjeta y el título de su sección.
  "espacio.tcm.t1.tarjeta": "Conoce tu constitución",
  "espacio.tcm.t1.seccion": "Tu Constitución",
  "espacio.tcm.t2.tarjeta": "Tu elemento predominante",
  "espacio.tcm.t2.seccion": "Tu Elemento Predominante",
  "espacio.tcm.t3.tarjeta": "Tu desequilibrio actual",
  "espacio.tcm.t3.seccion": "Tu Desequilibrio Actual",

  // Test 1 · «Conoce tu constitución»
  "espacio.tcm.t1.instruccionesTitulo": "Instrucciones",
  "espacio.tcm.t1.instrucciones":
    "Responde cada afirmación eligiendo la opción que mejor te describa en este momento de tu Vida. Suma los puntos de cada patrón: el que mayor puntaje obtenga indica tu constitución predominante.",
  "espacio.tcm.t1.nota":
    "Los resultados son orientativos, no diagnósticos. Si hay empates, puede indicar constituciones mixtas, lo cual es muy común.",
  "espacio.tcm.t1.escala1": "Rara vez",
  "espacio.tcm.t1.escala2": "A veces",
  "espacio.tcm.t1.escala3": "Frecuente",
  "espacio.tcm.t1.escalaMovil": "0 = Nunca · 2 = Siempre",
  "espacio.tcm.t1.interpretacion": "Interpretación Orientativa",
  "espacio.tcm.t1.etiqueta": "Tu Constitución",

  // Test 2 · «Tu elemento predominante»
  "espacio.tcm.t2.instruccionesTitulo": "Terreno Constitucional",
  "espacio.tcm.t2.instrucciones":
    "Evaluación de Tendencia Energética Base según los Cinco Movimientos. Responde según cómo ha sido la mayor parte de tu Vida adulta, no según el estado actual.",
  "espacio.tcm.t2.escala1": "No me describe",
  "espacio.tcm.t2.escala2": "Leve tendencia",
  "espacio.tcm.t2.escala3": "Moderadamente característico",
  "espacio.tcm.t2.escala4": "Muy característico",
  "espacio.tcm.t2.escalaMovil": "0 = No me describe · 3 = Muy característico",
  "espacio.tcm.t2.nota1":
    "El mayor puntaje indica tu terreno constitucional predominante. El segundo puntaje corresponde al movimiento de soporte.",
  /** Solo sale si los dos primeros puntajes se diferencian en menos de 3. */
  "espacio.tcm.t2.notaMixta":
    " La diferencia menor a 3 puntos entre los dos primeros sugiere constitución mixta.",
  "espacio.tcm.t2.nota2":
    "Esta lectura se alinea con los principios del Huangdi Neijing respecto a la diferenciación del terreno energético.",
  "espacio.tcm.t2.interpretacion": "Interpretación Constitucional",
  "espacio.tcm.t2.etiqueta": "Tu Terreno",

  // Test 3 · «Tu desequilibrio actual»
  "espacio.tcm.t3.instruccionesTitulo": "Patrón de Desequilibrio Actual",
  "espacio.tcm.t3.instrucciones":
    "Evaluación sintomática según diferenciación por Cinco Movimientos. Responde según los últimos 2–3 meses.",
  "espacio.tcm.t3.escala1": "Ausente",
  "espacio.tcm.t3.escala2": "Ocasional",
  "espacio.tcm.t3.escala3": "Frecuente",
  "espacio.tcm.t3.escala4": "Persistente / intenso",
  "espacio.tcm.t3.escalaMovil": "0 = Ausente · 3 = Persistente",
  "espacio.tcm.t3.nota":
    "El puntaje más alto indica el patrón de desequilibrio predominante en este momento. Dos puntajes elevados pueden sugerir interacción entre ciclos de generación o control. La coincidencia entre terreno constitucional (Test II) y patrón actual puede indicar sobrecarga del movimiento base.",
  "espacio.tcm.t3.interpretacion": "Interpretación Clínica Orientativa",
  "espacio.tcm.t3.etiqueta": "Actual",

  // ── Nutrición · «Calcula tus necesidades» ──────────────────────────────
  /** Título cuando se entra como invitada, sin cuenta. */
  "espacio.nutri.invitada": "Calcular necesidades",
  "espacio.nutri.misPlantas": "Mis plantas",
  "espacio.nutri.misAlimentos": "Mis alimentos",
  "espacio.nutri.calc.titulo": "Calcula tus necesidades",
  "espacio.nutri.calc.sub": "Estimación de calorías diarias y distribución de macronutrientes.",
  /** ⚠️ Kilos y centímetros en los DOS idiomas: son los números que entran en
   *  la fórmula de Mifflin-St Jeor y los que se guardan en la base de datos.
   *  Poner libras y pulgadas en el rótulo inglés daría un resultado falso. */
  "espacio.nutri.campo.peso": "Peso (kg)",
  "espacio.nutri.campo.altura": "Altura (cm)",
  "espacio.nutri.campo.edad": "Edad (años)",
  "espacio.nutri.genero": "Género",
  "espacio.nutri.genero.mujer": "Mujer",
  "espacio.nutri.genero.hombre": "Hombre",
  "espacio.nutri.actividad": "Nivel de actividad",
  "espacio.nutri.act1.label": "Sedentario",
  "espacio.nutri.act1.desc": "Poco o sin ejercicio",
  "espacio.nutri.act2.label": "Ligeramente activo",
  "espacio.nutri.act2.desc": "1–3 días por semana",
  "espacio.nutri.act3.label": "Moderadamente activo",
  "espacio.nutri.act3.desc": "3–5 días por semana",
  "espacio.nutri.act4.label": "Muy activo",
  "espacio.nutri.act4.desc": "6–7 días por semana",
  "espacio.nutri.act5.label": "Extremadamente activo",
  "espacio.nutri.act5.desc": "Trabajo físico intenso",
  "espacio.nutri.calcular": "Calcular",
  "espacio.nutri.err.campos": "Por favor completa todos los campos.",
  "espacio.nutri.err.peso": "Introduce un peso válido (20–300 kg).",
  "espacio.nutri.err.altura": "Introduce una altura válida (100–250 cm).",
  "espacio.nutri.err.edad": "Introduce una edad válida (10–120 años).",
  "espacio.nutri.tdee": "Calorías diarias estimadas",
  "espacio.nutri.tdee.unidad": "kcal / día",
  "espacio.nutri.macro.proteinas": "Proteínas",
  "espacio.nutri.macro.carbos": "Carbohidratos",
  "espacio.nutri.macro.grasas": "Grasas",
  "espacio.nutri.fuentes": "Fuentes recomendadas",
  "espacio.nutri.valores": "Valores nutricionales (por 100 g)",
  "espacio.nutri.recalcular": "Recalcular",
  "espacio.nutri.disclaimer":
    "Esta estimación es orientativa. Las necesidades reales varían según la composición corporal y el metabolismo individual.",
  "espacio.nutri.info.titulo": "Información importante",
  "espacio.nutri.info.texto":
    "Esto es solo una orientación para conocerse mejor, si deseas una dieta personalizada, contacta con un nutricionista. Si deseas entender más tu cuerpo y profundizar en el efecto de los alimentos en el cuerpo humano, contáctame.",
  "espacio.nutri.info.gracias": "Gracias por querer cuidarte con coherencia.",

  // ── Nutrición · los rótulos de la tabla de cada alimento ───────────────
  // Se repiten en los doce alimentos, así que van una sola vez.
  "espacio.nutri.v.calorias": "Calorías",
  "espacio.nutri.v.proteinas": "Proteínas",
  "espacio.nutri.v.insaturadas": "G. insaturadas",
  "espacio.nutri.v.saturadas": "G. saturadas",
  "espacio.nutri.v.carbohidratos": "Carbohidratos",
  "espacio.nutri.v.grasas": "Grasas",
  "espacio.nutri.v.fibra": "Fibra",
  "espacio.nutri.v.fibraSoluble": "Fibra soluble",
  "espacio.nutri.v.fibraInsoluble": "Fibra insoluble",

  // ── Nutrición · los doce alimentos de las «Fuentes recomendadas» ───────
  // Las legumbres salen dos veces (proteínas y carbohidratos) y en cada sitio
  // se cuentan de otra manera: por eso tienen dos entradas.
  "espacio.nutri.al.huevo.nom": "Huevo",
  "espacio.nutri.al.huevo.desc":
    "Una de las proteínas más completas y biodisponibles que existen. Contiene todos los aminoácidos esenciales en proporciones casi perfectas.",
  "espacio.nutri.al.legumbres.nom": "Legumbres",
  "espacio.nutri.al.legumbres.desc":
    "Fuente excelente de proteína vegetal combinada con fibra y carbohidratos complejos. Lentejas, garbanzos y alubias son básicos de una dieta equilibrada.",
  "espacio.nutri.al.pescado.nom": "Pescado",
  "espacio.nutri.al.pescado.desc":
    "Proteína de alta calidad combinada con omega-3, que reduce la inflamación y protege el sistema cardiovascular.",
  "espacio.nutri.al.tofu.nom": "Tofu",
  "espacio.nutri.al.tofu.desc":
    "Proteína vegetal completa derivada de la soja. Versátil y suave, es una excelente alternativa a la proteína animal.",
  "espacio.nutri.al.soja.nom": "Soja",
  "espacio.nutri.al.soja.desc":
    "Una de las pocas proteínas vegetales completas. Rica en todos los aminoácidos esenciales, además de fibra y grasas saludables.",
  "espacio.nutri.al.guisantes.nom": "Guisantes",
  "espacio.nutri.al.guisantes.desc":
    "Proteína vegetal acompañada de fibra, lo que ralentiza su absorción y ayuda a mantener la saciedad por más tiempo.",
  "espacio.nutri.al.verduras.nom": "Verduras",
  "espacio.nutri.al.verduras.desc": "Fuente de fibra, vitaminas y energía de calidad.",
  "espacio.nutri.al.frutas.nom": "Frutas",
  "espacio.nutri.al.frutas.desc":
    "Su fibra es perfecta para permitir que su fructosa sea incorporada en nosotros poco a poco.",
  "espacio.nutri.al.legumbresCarb.nom": "Legumbres",
  "espacio.nutri.al.legumbresCarb.desc":
    "A pesar de su mala fama, son de las mejores fuentes de carbohidratos además de venir acompañada de fibra y proteína.",
  "espacio.nutri.al.aguacate.nom": "Aguacate",
  "espacio.nutri.al.aguacate.desc":
    "Rico en ácido oleico, el mismo del aceite de oliva. Nutre la membrana celular y tiene un efecto antiinflamatorio natural.",
  "espacio.nutri.al.aceite.nom": "Aceite de oliva",
  "espacio.nutri.al.aceite.desc":
    "Su alto contenido en ácido oleico protege las células y reduce la inflamación crónica. Uno de los pilares de la alimentación saludable.",
  "espacio.nutri.al.frutosSecos.nom": "Frutos secos",
  "espacio.nutri.al.frutosSecos.desc":
    "Concentran grasas insaturadas, proteína y fibra en pequeñas dosis. Un snack que nutre de verdad.",

  // ── Los dos test guardados (Doṣhas y Medicina China) ───────────────────
  "espacio.test.doshas": "Test de los Doṣhas",
  "espacio.test.descubreDosha": "Descubre tu Doṣha",
  "espacio.test.doshaPrincipal": "Tu Doṣha principal es",
  "espacio.test.eligeOpcion":
    "Para cada pregunta, elige la opción que mejor te describa. No hay respuestas correctas ni incorrectas: confía en tu primera intuición.",
  "espacio.test.recalcular": "Recalcular",
  "espacio.test.consejos": "Tus consejos personalizados",
  "espacio.test.descargarConsejos": "Descargar consejos",
  "espacio.test.descargarRespuestas": "Descargar mis respuestas",
  "espacio.test.verResultados": "Ver mis resultados",
  "espacio.test.tusResultados": "Tus Resultados",
  "espacio.test.predominante": "PREDOMINANTE",
  "espacio.test.volver": "Volver a Mi Espacio",
  /** Aviso mientras quedan preguntas del test de los Doṣhas por responder. */
  "espacio.ayur.responde": "Responde todas las preguntas para ver tu Doṣha ({hechas} / {total})",

  // ── Vata ───────────────────────────────────────────────────────────────
  "espacio.dosha.vata.subtitulo": "Aire y Éter · Movimiento y Creatividad",
  "espacio.dosha.vata.descripcion":
    "Vata es la energía del movimiento: ligera, rápida, creativa e intuitiva. Las personas con predominancia Vata son entusiastas, imaginativas y aprenden con rapidez, aunque también tienden a la dispersión, la ansiedad y la irregularidad en sus hábitos. Su mente viaja constantemente. Para equilibrarse, Vata necesita rutina, calor, descanso y alimentos nutritivos que anclen su energía.",
  "espacio.dosha.vata.consejo1.titulo": "Alimentación",
  "espacio.dosha.vata.consejo1.texto":
    "Prioriza alimentos calientes, oleosos y nutritivos. Sopas, guisos, ghee y especias cálidas como jengibre o canela son tus aliados. Evita los alimentos fríos, crudos o muy ligeros.",
  "espacio.dosha.vata.consejo2.titulo": "Rutina y descanso",
  "espacio.dosha.vata.consejo2.texto":
    "Establece horarios fijos para comer, dormir y despertar. La regularidad calma tu naturaleza dispersa. Duerme al menos 7 horas y evita el exceso de estimulación nocturna.",
  "espacio.dosha.vata.consejo3.titulo": "Movimiento",
  "espacio.dosha.vata.consejo3.texto":
    "Opta por ejercicios que te hagan enraizarte: yoga, entrenamiento de fuerza, artes marciales. Evita el ejercicio extenuante o irregular, que agota tu energía.",
  "espacio.dosha.vata.consejo4.titulo": "Mente y emociones",
  "espacio.dosha.vata.consejo4.texto":
    "Practica la meditación y la respiración profunda para calmar el exceso mental.",

  // ── Pitta ──────────────────────────────────────────────────────────────
  "espacio.dosha.pitta.subtitulo": "Fuego y Agua · Transformación y Determinación",
  "espacio.dosha.pitta.descripcion":
    "Pitta es la energía de la transformación: intensa, decidida, apasionada y precisa. Las personas Pitta son líderes naturales con gran capacidad de ejecución, pero pueden caer en la irritabilidad, el perfeccionismo y el exceso de calor interno. Su mayor fortaleza es también su mayor reto: la intensidad. Para equilibrarse, Pitta necesita frescor, moderación, actividades que relajen la mente y un entorno sin demasiada competencia.",
  "espacio.dosha.pitta.consejo1.titulo": "Alimentación",
  "espacio.dosha.pitta.consejo1.texto":
    "Elige alimentos frescos y de sabor suave. Frutas dulces, verduras de hoja verde y refrescantes. Reduce el picante, el alcohol, los alimentos muy salados o ácidos.",
  "espacio.dosha.pitta.consejo2.titulo": "Temperatura y entorno",
  "espacio.dosha.pitta.consejo2.texto":
    "Evita el calor excesivo: sol directo, saunas o ejercicio intenso a mediodía. Busca entornos frescos, naturales y tranquilos para recuperar el equilibrio.",
  "espacio.dosha.pitta.consejo3.titulo": "Movimiento",
  "espacio.dosha.pitta.consejo3.texto":
    "El deporte moderado y no competitivo es ideal: natación, ciclismo suave, senderismo. Evita entrenar en exceso o convertir el ejercicio en una batalla contigo mismo.",
  "espacio.dosha.pitta.consejo4.titulo": "Mente y emociones",
  "espacio.dosha.pitta.consejo4.texto":
    "Aprende a soltar el control y la perfección. La meditación compasiva, el contacto con la naturaleza y las actividades lúdicas sin objetivo te ayudan a enfriar el fuego interior.",

  // ── Kapha ──────────────────────────────────────────────────────────────
  "espacio.dosha.kapha.subtitulo": "Tierra y Agua · Estabilidad y Amor",
  "espacio.dosha.kapha.descripcion":
    "Kapha es la energía de la estructura: estable, resistente, leal y profundamente afectuosa. Las personas Kapha son constantes, pacientes y tienen una memoria excelente. Su sombra es la tendencia al apego, la lentitud y la resistencia al cambio. Para equilibrarse, Kapha necesita movimiento, estimulación, nuevos retos y una dieta ligera que avive su fuego interno.",
  "espacio.dosha.kapha.consejo1.titulo": "Alimentación",
  "espacio.dosha.kapha.consejo1.texto":
    "Prioriza alimentos ligeros, poco calóricos y con especias estimulantes: jengibre, pimienta negra, cúrcuma, mostaza. Reduce los lácteos, los dulces, los fritos y los alimentos pesados o muy oleosos.",
  "espacio.dosha.kapha.consejo2.titulo": "Movimiento",
  "espacio.dosha.kapha.consejo2.texto":
    "El movimiento vigoroso y constante es esencial para ti: correr, bailar, deportes de equipo. Muévete cada día aunque no tengas ganas — tu cuerpo lo necesita más que ningún otro Doṣha.",
  "espacio.dosha.kapha.consejo3.titulo": "Estimulación mental",
  "espacio.dosha.kapha.consejo3.texto":
    "Busca nuevas experiencias, viajes, cursos o proyectos que saquen a Kapha de su zona de confort. El aburrimiento y la monotonía son tus mayores enemigos.",
  "espacio.dosha.kapha.consejo4.titulo": "Mente y emociones",
  "espacio.dosha.kapha.consejo4.texto":
    "Trabaja el desapego gradual de objetos, hábitos y relaciones que ya no te nutren. La generosidad activa y el voluntariado canalizan muy bien tu energía amorosa y transformadora, pero no olvides de sostenerte a ti mismo primero.",
};
