/**
 * Fisiología · El Mapa (/metodo/fisiologia) — TEXTO DE LAS PÁGINAS.
 *
 * Aquí vive el andamiaje del recorrido: los títulos de los pasos, los botones
 * «← anterior / siguiente →», las instrucciones de cada montaje y los textos de
 * celebración. El CONTENIDO gordo (los 12 sistemas, los órganos de la sonrisa,
 * las células de cada órgano, los temas de Profundiza) NO cabe en un
 * diccionario de cadenas: va en ficheros `.en.ts` paralelos a su fichero de
 * datos, como manda la regla de siempre.
 *
 * Los títulos de los pasos están aquí y no en cada página porque los pasos se
 * citan unos a otros en los botones «← anterior» / «siguiente →»: si se
 * escribieran a mano en cada sitio, bastaría cambiar un título para que el
 * botón de la página de al lado dejara de coincidir.
 */
export const fisiologia = {
  // ── Títulos de los pasos ───────────────────────────────────────────────
  "fisiologia.particulas.titulo": "Partículas",
  "fisiologia.atomos.titulo": "Átomos",
  "fisiologia.moleculas.titulo": "Moléculas",
  "fisiologia.macromoleculas.titulo": "Macromoléculas",
  "fisiologia.estructuras.titulo": "Estructuras celulares",
  /** Versión corta: el botón «← Estructuras» del paso siguiente. */
  "fisiologia.estructuras.corto": "Estructuras",
  "fisiologia.celula.titulo": "Célula",
  "fisiologia.lasCelulas.titulo": "Las células de tus órganos",
  /** Versión corta: el botón «← Las células». */
  "fisiologia.lasCelulas.corto": "Las células",
  "fisiologia.tejidos.titulo": "Tejidos",
  "fisiologia.organos.titulo": "Órganos",
  "fisiologia.sistemas.titulo": "Sistemas",
  "fisiologia.organismo.titulo": "El cuerpo",
  "fisiologia.niveles.titulo": "Niveles",
  "fisiologia.sonrisa.titulo": "La sonrisa interior",
  "fisiologia.sonrisa.corto": "Sonrisa",
  "fisiologia.profundiza.titulo": "Profundiza",
  "fisiologia.cursos.titulo": "Cursos de Fisiología",
  "fisiologia.introduccion": "Introducción",
  /** Botón de avance de la portada de la disciplina. */
  "fisiologia.comenzar": "Comenzar",

  /** Cierre del cómic de las estrellas: la tabla periódica a pantalla completa. */
  "fisiologia.tablaFrase": "Nunca más mirarás la tabla periódica con los mismos ojos...",
  "fisiologia.tablaAlt": "La tabla periódica de los elementos",

  // ── Niveles ────────────────────────────────────────────────────────────
  "fisiologia.niveles.intro":
    "Descubre poco a poco, de las partículas que te forman hasta el ecosistema complejo y magnífico que eres.",
  /** Antetítulo de una tarjeta: «Nivel 1», «Nivel 2»… */
  "fisiologia.niveles.nivel": "Nivel {n}",
  "fisiologia.niveles.avanzado": "Avanzado",
  "fisiologia.niveles.bloqueado": "Bloqueado",
  "fisiologia.niveles.entrar": "Entrar",
  "fisiologia.niveles.superado": "Superado",
  "fisiologia.niveles.materia": "MATERIA",
  "fisiologia.niveles.materia.sub": "De qué estás hecho.",
  "fisiologia.niveles.vida": "VIDA",
  "fisiologia.niveles.vida.sub": "El milagro de ser un cuerpo.",
  "fisiologia.niveles.profundiza": "PROFUNDIZA",
  "fisiologia.niveles.profundiza.sub": "Para los que quieren toda la verdad.",

  // ── Partículas (paso 1/5 del nivel MATERIA) ────────────────────────────
  "fisiologia.particulas.instruccion": "Construye una partícula.",
  "fisiologia.particulas.bloqueo": "Primero construye la partícula",
  "fisiologia.particulas.nucleo": "el núcleo",
  "fisiologia.particulas.uniendose": "…uniéndose…",
  "fisiologia.particulas.hecho": "¡Enhorabuena! Has construido una partícula.",
  "fisiologia.particulas.p1":
    "Las partículas están formadas por **quarks**, unas partículas fundamentales que aparecen y desaparecen constantemente, y por **gluones**, que los mantienen unidos.",
  "fisiologia.particulas.p2":
    "Todo lo que existe, incluido tu cuerpo, está construido a partir de estas partículas.",
  "fisiologia.particulas.protonAlt": "Protón: dos quarks up y un quark down unidos por gluones",
  /** Nombres de las piezas que se arrastran. */
  "fisiologia.pieza.quarkUp": "quark up",
  "fisiologia.pieza.quarkDown": "quark down",
  "fisiologia.pieza.gluon": "gluón",
  "fisiologia.pieza.proton": "protón",
  "fisiologia.pieza.neutron": "neutrón",
  "fisiologia.pieza.electron": "electrón",

  // ── Átomos (2/5) ───────────────────────────────────────────────────────
  /** El nombre del átomo entra donde va {atomo}: «Construye un átomo de Helio». */
  "fisiologia.atomos.instruccionGeneral": "Construye un átomo de {atomo}.",
  "fisiologia.atomos.bloqueo": "Primero construye los dos átomos",
  "fisiologia.atomos.nucleo": "el núcleo",
  "fisiologia.atomos.formandose": "…formándose…",
  "fisiologia.atomos.siguiente": "Ahora, el Helio →",
  "fisiologia.atomos.hidrogeno": "Hidrógeno",
  "fisiologia.atomos.hidrogeno.instruccion": "Lleva el protón al núcleo y el electrón a su órbita.",
  "fisiologia.atomos.hidrogeno.hecho": "¡Has construido un átomo de Hidrógeno!",
  "fisiologia.atomos.hidrogeno.p1":
    "El **hidrógeno** es el átomo más simple y abundante del universo: un solo **protón** en el núcleo y un **electrón** orbitando a su alrededor. Fue el primer elemento en existir tras el Big Bang.",
  "fisiologia.atomos.helio": "Helio",
  "fisiologia.atomos.helio.instruccion":
    "Lleva los 2 protones y 2 neutrones al núcleo, y los 2 electrones a su órbita.",
  "fisiologia.atomos.helio.hecho": "¡Has construido un átomo de Helio!",
  "fisiologia.atomos.helio.p1": "El **helio** fue el segundo elemento del universo en ser creado.",
  "fisiologia.atomos.helio.p2":
    "Cambiando el número de protones se obtienen todos los elementos: tu cuerpo es, sobre todo, hidrógeno, oxígeno, carbono y nitrógeno, los mismos átomos que forman las estrellas.",
  /** Alt de la foto del átomo terminado. */
  "fisiologia.atomos.alt": "Átomo de {atomo}",

  // ── Moléculas (3/5) ────────────────────────────────────────────────────
  "fisiologia.moleculas.intro":
    "Las moléculas son la unión de varios átomos. Son el fundamento de la Vida y forman parte de ti.",
  "fisiologia.moleculas.bloqueo": "Primero forma las tres moléculas de la Vida",
  "fisiologia.moleculas.zona": "zona de enlace",
  "fisiologia.moleculas.enlazando": "…enlazando…",
  /** Botón que pasa a la molécula siguiente. */
  "fisiologia.moleculas.ahora": "Ahora, {molecula} →",
  "fisiologia.moleculas.verLasTres": "Ver las moléculas de la Vida →",
  "fisiologia.moleculas.instruccionGeneral":
    "Una molécula es la unión de átomos. Forma una molécula de {molecula}.",
  "fisiologia.pieza.hidrogeno": "hidrógeno",
  "fisiologia.pieza.oxigeno": "oxígeno",
  "fisiologia.pieza.carbono": "carbono",
  "fisiologia.moleculas.agua": "agua",
  "fisiologia.moleculas.agua.articulo": "el agua",
  "fisiologia.moleculas.agua.instruccion": "Une un oxígeno y dos hidrógenos dentro de la zona de enlace.",
  "fisiologia.moleculas.agua.hecho": "¡Has formado una molécula de agua!",
  "fisiologia.moleculas.agua.p1":
    "El agua es la **molécula de la Vida**: disuelve, transporta y hace posible casi todo lo que ocurre dentro de tus células. Alrededor del **60% de tu cuerpo es agua**. En buena parte, eres agua.",
  "fisiologia.moleculas.co2": "dióxido de carbono",
  "fisiologia.moleculas.co2.articulo": "el dióxido de carbono",
  "fisiologia.moleculas.co2.instruccion": "Une un carbono y dos oxígenos dentro de la zona de enlace.",
  "fisiologia.moleculas.co2.hecho": "¡Has formado dióxido de carbono!",
  "fisiologia.moleculas.co2.p1":
    "Tus células lo liberan al obtener energía, y las plantas lo capturan para crecer. Es una pieza clave del **ciclo de la Vida**.",
  "fisiologia.moleculas.o2": "oxígeno",
  "fisiologia.moleculas.o2.articulo": "el oxígeno",
  "fisiologia.moleculas.o2.instruccion": "Une dos oxígenos dentro de la zona de enlace.",
  "fisiologia.moleculas.o2.hecho": "¡Has formado una molécula de oxígeno!",
  "fisiologia.moleculas.o2.p1":
    "Cada célula lo necesita para **transformar los alimentos en energía**. Sin él, la Vida tal como la conoces no existiría.",

  // ── Macromoléculas (4/5) ───────────────────────────────────────────────
  "fisiologia.macro.intro": "Las grandes moléculas de la Vida.",
  "fisiologia.macro.bloqueo": "Primero forma las cuatro macromoléculas",
  "fisiologia.macro.volver": "Las 4 macromoléculas",
  "fisiologia.macro.explicacion": "Explicación",
  "fisiologia.macro.bandeja": "bandeja de ensamblaje",
  "fisiologia.macro.plegandose": "…plegándose…",
  "fisiologia.macro.formada": "Formada",
  "fisiologia.macro.verDeNuevo": "Formada · ver de nuevo",
  "fisiologia.macro.construir": "Construir · {n} {monomeros}",
  /** Instrucción de la estación: una para las que se montan con piezas
   *  distintas (el fosfolípido) y otra para las que se encadenan. */
  "fisiologia.macro.instruccionPiezas":
    "Arrastra las {total} piezas a la bandeja para formar el {monomero}.",
  "fisiologia.macro.instruccionCadena":
    "Arrastra {total} {monomeros} a la bandeja para encadenarlos.",
  /** «{macro}» llega en minúscula y «{Macro}» tal cual: el español dice «¡Has
   *  formado enzimas!» y el inglés conserva la mayúscula del nombre. */
  "fisiologia.macro.hecho": "¡Has formado {macro}!",
  /** Botón que abre una macromolécula: «Ahora, las Enzimas →». */
  "fisiologia.macro.ahora": "Ahora, {macro} →",
  "fisiologia.macro.proteina": "Enzimas",
  "fisiologia.macro.proteina.articulo": "las Enzimas",
  "fisiologia.macro.proteina.desc": "Realizan la mayoría de las funciones de la célula.",
  "fisiologia.macro.proteina.monomero": "aminoácido",
  "fisiologia.macro.proteina.monomeroPl": "aminoácidos",
  "fisiologia.macro.proteina.r1":
    "Una proteína es una larga cadena de aminoácidos que se construye voluntariamente cuando la célula lo necesita y que cumple una función concreta.",
  "fisiologia.macro.proteina.r2":
    "De esa forma depende su función: hay proteínas que transportan, defienden, construyen o aceleran reacciones. Son las obreras de la célula.",
  "fisiologia.macro.adn": "ADN",
  "fisiologia.macro.adn.articulo": "el ADN",
  "fisiologia.macro.adn.desc": "Contiene la información genética.",
  "fisiologia.macro.adn.monomero": "nucleótido",
  "fisiologia.macro.adn.monomeroPl": "nucleótidos",
  "fisiologia.macro.adn.r1":
    "El ADN es una cadena de nucleótidos —las letras A, T, C y G— enrollada en una doble hélice.",
  "fisiologia.macro.adn.r2":
    "El orden de esas letras es el manual de instrucciones para fabricar todas tus proteínas: es tu información genética.",
  "fisiologia.macro.lipido": "Lípidos",
  "fisiologia.macro.lipido.articulo": "los Lípidos",
  "fisiologia.macro.lipido.desc": "Forman las membranas celulares.",
  "fisiologia.macro.lipido.monomero": "fosfolípido",
  "fisiologia.macro.lipido.monomeroPl": "piezas",
  "fisiologia.macro.lipido.r1":
    "Un fosfolípido se forma uniendo un fosfato y un glicerol (la cabeza, que ama el agua) con dos ácidos grasos (las colas, que la repelen).",
  "fisiologia.macro.lipido.r2":
    "Por eso los fosfolípidos se ordenan solos en una doble capa: la membrana que envuelve y protege cada una de tus células.",
  "fisiologia.macro.carbohidrato": "Carbohidratos",
  "fisiologia.macro.carbohidrato.articulo": "los Carbohidratos",
  "fisiologia.macro.carbohidrato.desc": "Almacenan y proporcionan energía.",
  "fisiologia.macro.carbohidrato.monomero": "glucosa",
  "fisiologia.macro.carbohidrato.monomeroPl": "glucosas",
  "fisiologia.macro.carbohidrato.r1":
    "Uniendo muchas glucosas se forman los carbohidratos, como el glucógeno.",
  "fisiologia.macro.carbohidrato.r2":
    "Son la reserva de energía rápida del cuerpo: se guardan cuando sobra y se rompen cuando hace falta combustible.",
  /** Piezas sueltas del fosfolípido. */
  "fisiologia.pieza.nucleotidoA": "A",
  "fisiologia.pieza.nucleotidoT": "T",
  "fisiologia.pieza.nucleotidoC": "C",
  "fisiologia.pieza.nucleotidoG": "G",
  "fisiologia.pieza.fosfato": "fosfato",
  "fisiologia.pieza.glicerol": "glicerol",
  "fisiologia.pieza.grasaSaturada": "ácido graso saturado",
  "fisiologia.pieza.grasaInsaturada": "ácido graso insaturado",

  // ── Estructuras celulares (5/5) ────────────────────────────────────────
  "fisiologia.estructuras.intro":
    "Proteínas, ADN y lípidos se ensamblan para formar las partes de la célula. Construye las cuatro.",
  "fisiologia.estructuras.instruccion": "Arrastra las macromoléculas a la zona para ensamblarla.",
  "fisiologia.estructuras.bloqueo": "Primero construye las cuatro estructuras",
  "fisiologia.estructuras.volver": "Las 4 estructuras",
  "fisiologia.estructuras.zona": "zona de ensamblaje",
  "fisiologia.estructuras.organizandose": "…organizándose…",
  "fisiologia.estructuras.construida": "Construida",
  "fisiologia.estructuras.verDeNuevo": "Construida · ver de nuevo",
  "fisiologia.estructuras.construir": "Construir",
  /** Las cuatro estructuras de la célula. */
  "fisiologia.est.nucleo": "Núcleo",
  "fisiologia.est.nucleo.desc": "Guarda y protege tu información genética.",
  "fisiologia.est.nucleo.r1":
    "El ADN se enrolla sobre sí mismo y se compacta dentro de una envoltura de membrana: así nace el núcleo.",
  "fisiologia.est.nucleo.r2":
    "Es la sala de control de la célula: ahí se guardan, letra a letra, las instrucciones para fabricar cada una de tus proteínas: es donde vive tu manual de la Vida.",
  "fisiologia.est.membrana": "Membrana celular",
  "fisiologia.est.membrana.desc": "Envuelve la célula y decide qué entra y qué sale.",
  "fisiologia.est.membrana.r1":
    "Los fosfolípidos se ordenan solos en una doble capa, y las proteínas se incrustan como puertas y sensores.",
  "fisiologia.est.membrana.r2":
    "Así nace la membrana: la frontera viva que separa el interior de la célula del mundo exterior y controla el paso.",
  "fisiologia.est.mitocondria": "Mitocondria",
  "fisiologia.est.mitocondria.desc": "La central de energía de la célula.",
  "fisiologia.est.mitocondria.r1":
    "Con sus membranas plegadas y muchísimas proteínas y enzimas, la mitocondria transforma los nutrientes y el oxígeno en energía.",
  "fisiologia.est.mitocondria.r2":
    "Es la central eléctrica que fabrica el ATP, el combustible que mantiene en marcha cada proceso de tu cuerpo.",
  "fisiologia.est.ribosoma": "Ribosoma",
  "fisiologia.est.ribosoma.desc": "La fábrica de enzimas.",
  "fisiologia.est.ribosoma.r1":
    "Hecho de proteínas y de ARN(r), el ribosoma lee las instrucciones ARN(m), que vienen del ADN.",
  "fisiologia.est.ribosoma.r2":
    "Con ellas ensambla aminoácidos uno tras otro y fabrica nuevas enzimas: convierte la información genética en materia viva.",
  "fisiologia.estructuras.siguiente": "Siguiente →",
  "fisiologia.estructuras.crearCelula": "Crea la célula →",
  /** Piezas propias de cada estructura. */
  "fisiologia.pieza.adn": "ADN",
  "fisiologia.pieza.arn": "ARN",
  "fisiologia.pieza.lipido": "lípido",
  "fisiologia.pieza.barreraNuclear": "Barrera nuclear",
  "fisiologia.pieza.receptoresHormonales": "Receptores hormonales",
  "fisiologia.pieza.membranaMitocondrial": "Membrana mitocondrial",
  "fisiologia.pieza.receptores": "Receptores",
  "fisiologia.pieza.enzimas": "Enzimas",

  // ── Célula (nivel VIDA · 1/4) ──────────────────────────────────────────
  "fisiologia.celula.instruccion": "Construye una célula.",
  "fisiologia.celula.zona": "el citoplasma",
  "fisiologia.celula.hecho": "¡Has construido una célula!",
  "fisiologia.celula.p1":
    "Una **célula** es la unidad más pequeña con Vida propia: dentro de su membrana, el núcleo guarda el ADN con las instrucciones, los ribosomas fabrican proteínas y las mitocondrias generan energía.",
  "fisiologia.celula.p2":
    "Todo funciona a la vez, como una ciudad diminuta. Tu cuerpo tiene alrededor de **37 billones** de ellas.",
  "fisiologia.celula.bloqueo": "Primero crea la célula",
  "fisiologia.celula.nota":
    "Una célula real tiene muchos más orgánulos; aquí la hemos simplificado con fines de estudio.",
  "fisiologia.pieza.nucleo": "núcleo",
  "fisiologia.pieza.membrana": "membrana",
  "fisiologia.pieza.mitocondria": "mitocondria",
  "fisiologia.pieza.ribosoma": "ribosoma",
  "fisiologia.pieza.celula": "célula",
  "fisiologia.pieza.tejido": "tejido",

  // ── Las células de tus órganos (2/4) ───────────────────────────────────
  /* El CONTENIDO de los 18 órganos (nombre, descripción, curiosidades y fichas)
     no está aquí: va en `todasCelulasContenido.en.ts`. Aquí solo el andamiaje. */
  /** Barra de progreso global y contador de la ficha del órgano. */
  "fisiologia.lasCelulas.progreso": "{hechas} de {total} células descubiertas",
  "fisiologia.lasCelulas.completo": "✓ Has recorrido todas tus células",
  "fisiologia.lasCelulas.organoCompleto": "✓ Has descubierto todas sus células",
  /** Pie de la tarjeta de órgano: «3/8 células». */
  "fisiologia.lasCelulas.tarjeta": "{hechas}/{total} células",
  /** Tarjeta de un órgano que todavía no tiene células que explorar. */
  "fisiologia.lasCelulas.pronto": "próximamente",
  "fisiologia.lasCelulas.sinFoto": "Foto del órgano (próximamente)",
  "fisiologia.lasCelulas.sinDescripcion": "Descripción del {organo} (próximamente).",
  "fisiologia.lasCelulas.sinCelulas": "Pronto podrás explorar las células de este órgano.",
  /** Título por defecto de la fila de fichas propias del órgano. */
  "fisiologia.lasCelulas.enDetalle": "En detalle",
  "fisiologia.lasCelulas.sinConsejos": "Consejos para cuidar tu {organo} (próximamente)",
  "fisiologia.lasCelulas.leerMas": "Leer más →",
  "fisiologia.lasCelulas.leerDeNuevo": "Leer de nuevo →",
  /** Marca de curiosidad ya leída (femenino: «la curiosidad»). */
  "fisiologia.lasCelulas.leida": "Leída",
  "fisiologia.lasCelulas.consejoAnterior": "Consejo anterior",
  "fisiologia.lasCelulas.consejoSiguiente": "Consejo siguiente",

  // ── Tejidos (3/4) y Órganos (4/4) ──────────────────────────────────────
  "fisiologia.tejidos.introTitulo": "Forma un tejido",
  "fisiologia.tejidos.instruccion": "Reúne varias células iguales para formar un tejido.",
  "fisiologia.tejidos.zona": "agrupa las células",
  "fisiologia.tejidos.hecho": "¡Has formado un tejido!",
  "fisiologia.tejidos.p1":
    "Muchas **células iguales** que trabajan juntas forman un **tejido**.",
  "fisiologia.tejidos.p2":
    "Hay tejido muscular que se contrae, tejido nervioso que transmite señales, tejido que recubre y protege… cada uno con su función.",
  "fisiologia.organos.introTitulo": "Forma un órgano",
  "fisiologia.organos.instruccion": "Combina varios tejidos para formar un órgano.",
  "fisiologia.organos.zona": "reúne los tejidos",
  "fisiologia.organos.hecho": "¡Has formado un órgano!",
  "fisiologia.organos.p1":
    "Varios **tejidos distintos** se combinan y forman un **órgano**, como el corazón, el pulmón o el estómago.",
  "fisiologia.organos.p2":
    "Cada órgano realiza un trabajo concreto que ninguna célula podría hacer sola.",
  /** Tooltip por defecto del botón bloqueado de ConstruirFisio. */
  "fisiologia.construir.bloqueo": "Termina de construirlo primero",

  // ── Sistemas ───────────────────────────────────────────────────────────
  "fisiologia.sistemas.intro":
    "Varios órganos que colaboran forman un sistema. Pulsa cada sistema para conocerlo.",
  "fisiologia.sistemas.bloqueo": "Primero lee todos los sistemas",
  /** Título de la ficha de un sistema. `{sistema}` llega en minúscula y
   *  `{Sistema}` tal cual, porque el inglés abre la frase con el nombre. */
  "fisiologia.sistemas.ficha": "Sistema {sistema}",

  // ── El cuerpo (organismo) ──────────────────────────────────────────────
  "fisiologia.organismo.instruccion": "Construye un ser humano.",
  "fisiologia.organismo.zona": "su lugar en el cuerpo",
  "fisiologia.organismo.hecho": "Has construido un ser humano.",
  "fisiologia.organismo.p1":
    "Todos los **sistemas**, funcionando en armonía, forman un **organismo** completo.",
  "fisiologia.organismo.p2":
    "Has subido desde una sola partícula: átomos, moléculas, células, tejidos, órganos y sistemas.",
  "fisiologia.organismo.p3":
    "Ese organismo entero, vivo y en marcha en este mismo instante, **eres tú**.",
  "fisiologia.organismo.tu": "Tú",
  "fisiologia.organismo.bloqueo": "Primero crea al ser humano",
  "fisiologia.organismo.losSistemas": "Los sistemas",
  "fisiologia.organismo.alt": "Un ser humano",

  // ── La sonrisa interior ────────────────────────────────────────────────
  "fisiologia.sonrisa.intro":
    "Has recorrido tu cuerpo de la partícula al organismo. Ahora mírate: todo eso está dentro de ti mientras lees esto. Esta práctica es antigua y se llama «la sonrisa interior»: consiste en visitar tus órganos uno a uno y darles las gracias.",
  "fisiologia.sonrisa.paso1": "Mira",
  "fisiologia.sonrisa.paso1.texto": "Pulsa un órgano y míralo. Eso está dentro de ti ahora mismo.",
  "fisiologia.sonrisa.paso2": "Respira",
  "fisiologia.sonrisa.paso2.texto":
    "Toma aire despacio y llévalo, con la atención, hasta ese lugar de tu cuerpo.",
  "fisiologia.sonrisa.paso3": "Agradece",
  "fisiologia.sonrisa.paso3.texto": "Dale las gracias por lo que lleva haciendo por ti toda tu vida.",
  "fisiologia.sonrisa.progreso": "Has sonreído a {hechos} de {total}",
  "fisiologia.sonrisa.completo": "Has sonreído a todo tu cuerpo",
  "fisiologia.sonrisa.todoElCuerpo": "Todo tu cuerpo ha recibido tu sonrisa",
  "fisiologia.sonrisa.cierre":
    "Nada de lo que has leído en este recorrido era teoría: todo estaba pasando dentro de ti mientras lo leías, y sigue pasando ahora. Vuelve a esta página cuando quieras acordarte.",
  "fisiologia.sonrisa.gracias": "Gracias",
  "fisiologia.sonrisa.yaSonreido": "Ya le has sonreído",
  "fisiologia.sonrisa.graciasDadas": "Gracias dadas",
  "fisiologia.sonrisa.cuerpoAlt": "Tu cuerpo",

  // ── Profundiza ─────────────────────────────────────────────────────────
  "fisiologia.profundiza.intro": "Para los que quieren toda la verdad. Elige por dónde empezar.",
  "fisiologia.profundiza.volverArriba": "Volver a arriba",
  "fisiologia.tema.construyendo": "Estamos construyendo este apartado",
  "fisiologia.tema.construyendoPie":
    "Muy pronto podrás explorarlo aquí. Sigue avanzando por el resto del recorrido.",

  // ── Cursos ─────────────────────────────────────────────────────────────
  "fisiologia.cursos.intro":
    "Si quieres profundizar en la Fisiología, estos cursos te acompañan paso a paso.",
  "fisiologia.cursos.pronto":
    "Pronto podrás profundizar aquí con cursos avanzados de Fisiología. Mientras tanto, sigue explorando el recorrido.",
  "fisiologia.cursos.entrar": "Entrar →",
} as const;
