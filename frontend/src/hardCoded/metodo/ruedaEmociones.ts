// ─────────────────────────────────────────────────────────────────────────
// LA RUEDA DE LAS EMOCIONES · el contenido (paso 25 de psicología)
//
// Tres anillos, como la rueda clásica (Gloria Willcox):
//   · Centro   → 6 emociones básicas.
//   · Anillo 2 → en qué se convierte cada una (las secundarias).
//   · Anillo 3 → la palabra fina, la que de verdad se parece a lo que sientes.
//
// La página NO GUARDA NADA: se entra, se toca una palabra y se lee. Al pulsar
// cualquier palabra se abre un popup con esa emoción y TRES características que
// la definen — para no tener que andar buscando qué significa.
//
// ✍️  EDITAR CONTENIDO: aquí. `define` son siempre TRES frases cortas, en
//     segunda persona y sin lenguaje clínico (así suena todo el recorrido).
//     Las `key` son estables por si algún día se enlazan desde otra página.
//
// El dibujo (los sectores, los ángulos, el texto radial) lo hace
// `components/metodo/RuedaEmocionesSvg.tsx` a partir de estos datos: el número
// de hijas de cada emoción decide lo ancho que sale su trozo de rueda.
// ─────────────────────────────────────────────────────────────────────────

/** Una emoción de la rueda (vale para los tres anillos). */
export interface EmocionRueda {
  /** Clave estable. */
  key: string;
  /** La palabra, tal cual se pinta en la rueda. */
  nombre: string;
  /** Las TRES características que la definen (popup). */
  define: string[];
  /** Las emociones en las que se abre (vacío en el anillo exterior). */
  hijas?: EmocionRueda[];
}

/** Una de las 6 emociones básicas: además de su contenido, trae sus colores. */
export interface EmocionBasica extends EmocionRueda {
  /** Color del centro (el más saturado de los tres). */
  color: string;
  /** Color del anillo de las secundarias. */
  colorMedio: string;
  /** Color del anillo exterior (el más claro). */
  colorClaro: string;
  hijas: EmocionRueda[];
}

// El orden es el de la rueda, en el sentido de las agujas del reloj empezando
// arriba: IRA · ASCO · TRISTEZA · FELICIDAD · SORPRESA · MIEDO.
export const RUEDA_EMOCIONES: EmocionBasica[] = [
  // ── IRA ────────────────────────────────────────────────────────────────
  {
    key: "ira",
    nombre: "Ira",
    color: "#f4aeb1",
    colorMedio: "#f9c6c7",
    colorClaro: "#fcdedf",
    define: [
      "Es la energía que salta cuando algo te parece injusto.",
      "Aparece para defender un límite tuyo que alguien ha pasado.",
      "El cuerpo se activa: calor, tensión, ganas de actuar.",
    ],
    hijas: [
      {
        key: "herido",
        nombre: "Herido",
        define: [
          "Alguien a quien querías te ha hecho daño.",
          "Debajo de la rabia hay dolor y decepción.",
          "Duele más porque venía de quien no lo esperabas.",
        ],
        hijas: [
          {
            key: "apenado",
            nombre: "Apenado",
            define: [
              "Un peso triste que se queda después del golpe.",
              "Repites la escena por dentro buscando entender.",
              "Te da pena lo que se ha roto entre los dos.",
            ],
          },
          {
            key: "devastado",
            nombre: "Devastado",
            define: [
              "Sientes que algo dentro se ha roto del todo.",
              "Se te caen las fuerzas y las ganas.",
              "Cuesta imaginar que esto pueda arreglarse.",
            ],
          },
        ],
      },
      {
        key: "amenazado",
        nombre: "Amenazado",
        define: [
          "Notas que algo tuyo está en peligro.",
          "Estás en guardia, esperando el siguiente golpe.",
          "El cuerpo se prepara para defenderse.",
        ],
        hijas: [
          {
            key: "atacado",
            nombre: "Atacado",
            define: [
              "Sientes que van contra ti, no contra lo que hiciste.",
              "Te pones a la defensiva casi sin querer.",
              "Cada palabra la oyes como un reproche.",
            ],
          },
          {
            key: "celoso",
            nombre: "Celoso",
            define: [
              "Temes perder tu lugar con alguien que te importa.",
              "Comparas, y en la comparación sales perdiendo.",
              "Vigilas más de lo que te gustaría vigilar.",
            ],
          },
        ],
      },
      {
        key: "lleno-de-odio",
        nombre: "Lleno de odio",
        define: [
          "El enfado se ha quedado y se ha vuelto espeso.",
          "Deseas que el otro también lo pase mal.",
          "Te ocupa la cabeza más de lo que quisieras.",
        ],
        hijas: [
          {
            key: "resentido",
            nombre: "Resentido",
            define: [
              "Una cuenta pendiente que no acaba de cerrarse.",
              "Vuelves a lo que pasó aunque haga tiempo.",
              "Perdonar te suena a traicionarte.",
            ],
          },
          {
            key: "ultrajado",
            nombre: "Ultrajado",
            define: [
              "Sientes que se ha pasado una raya sagrada.",
              "Se mezclan la rabia y la vergüenza.",
              "Necesitas que alguien reconozca que no estuvo bien.",
            ],
          },
        ],
      },
      {
        key: "enfadado",
        nombre: "Enfadado",
        define: [
          "Algo no ha salido como necesitabas y protestas.",
          "Sube el tono, la prisa, el gesto.",
          "Quieres que cambie, y que cambie ya.",
        ],
        hijas: [
          {
            key: "furioso",
            nombre: "Furioso",
            define: [
              "La rabia manda y tú vas detrás.",
              "El cuerpo empuja: gritar, golpear, salir.",
              "Después suele venir el arrepentimiento.",
            ],
          },
          {
            key: "rabioso",
            nombre: "Rabioso",
            define: [
              "Enfado a flor de piel: salta con cualquier cosa.",
              "Todo molesta más de lo normal.",
              "Mientras dura, te cuesta escuchar.",
            ],
          },
        ],
      },
      {
        key: "agresivo",
        nombre: "Agresivo",
        define: [
          "La rabia sale hacia fuera y busca a alguien.",
          "Hablas para herir, aunque luego no lo sostengas.",
          "Es una defensa disfrazada de ataque.",
        ],
        hijas: [
          {
            key: "provocador",
            nombre: "Provocador",
            define: [
              "Pinchas para ver si el otro salta.",
              "Buscas pelea aunque digas que no.",
              "Debajo suele haber miedo a que te ignoren.",
            ],
          },
          {
            key: "hostil",
            nombre: "Hostil",
            define: [
              "Tratas al otro como enemigo antes de conocerlo.",
              "El gesto va cerrado y la voz cortante.",
              "Cuesta creer que alguien venga en son de paz.",
            ],
          },
        ],
      },
      {
        key: "frustrado",
        nombre: "Frustrado",
        define: [
          "Lo intentas y algo se interpone otra vez.",
          "La energía no encuentra salida.",
          "Aparecen prisa, impotencia y ganas de rendirte.",
        ],
        hijas: [
          {
            key: "enfurecido",
            nombre: "Enfurecido",
            define: [
              "La frustración acumulada revienta.",
              "Estallas por algo pequeño después de aguantar mucho.",
              "Luego cuesta explicar la desproporción.",
            ],
          },
          {
            key: "irritado",
            nombre: "Irritado",
            define: [
              "Todo roza: los ruidos, las preguntas, la gente.",
              "Poca paciencia y respuestas cortas.",
              "Suele avisar de que estás al límite.",
            ],
          },
        ],
      },
      {
        key: "distante",
        nombre: "Distante",
        define: [
          "La rabia se enfría y te apartas.",
          "Cierras la puerta para no discutir.",
          "Estás presente, pero ya no del todo.",
        ],
        hijas: [
          {
            key: "introvertido",
            nombre: "Introvertido",
            define: [
              "Te metes hacia dentro y hablas menos.",
              "Prefieres tu silencio a exponerte.",
              "Lo que sientes se queda sin salir.",
            ],
          },
          {
            key: "desconfiado",
            nombre: "Desconfiado",
            define: [
              "Esperas que tarde o temprano te fallen.",
              "Compruebas antes de creer.",
              "Guardas una parte de ti a salvo.",
            ],
          },
        ],
      },
      {
        key: "critico",
        nombre: "Crítico",
        define: [
          "La rabia se convierte en juicio.",
          "Ves antes el fallo que lo que está bien.",
          "Señalar fuera calma un poco lo de dentro.",
        ],
        hijas: [
          {
            key: "esceptico",
            nombre: "Escéptico",
            define: [
              "Dudas de las buenas intenciones.",
              "Pides pruebas antes de confiar.",
              "Preferirías creer, pero no te atreves.",
            ],
          },
          {
            key: "sarcastico",
            nombre: "Sarcástico",
            define: [
              "Dices la verdad envuelta en broma para no exponerte.",
              "El humor pincha en vez de acercar.",
              "Debajo hay algo dolido que no se nombra.",
            ],
          },
        ],
      },
    ],
  },

  // ── ASCO ───────────────────────────────────────────────────────────────
  {
    key: "asco",
    nombre: "Asco",
    color: "#9de3c9",
    colorMedio: "#bcedda",
    colorClaro: "#d8f5ea",
    define: [
      "Un «esto no» del cuerpo, casi antes de pensarlo.",
      "Aparece para alejarte de lo que te daña.",
      "Te señala dónde está tu límite y lo que no negocias.",
    ],
    hijas: [
      {
        key: "disconforme",
        nombre: "Disconforme",
        define: [
          "Algo no encaja con lo que crees justo.",
          "No te sale asentir, aunque sería más cómodo.",
          "Sientes la necesidad de decir que no.",
        ],
        hijas: [
          {
            key: "moralista",
            nombre: "Moralista",
            define: [
              "Mides al otro con tu propia vara.",
              "Se te endurece la mirada y juzgas rápido.",
              "Debajo hay un valor tuyo que sientes pisado.",
            ],
          },
          {
            key: "reacio",
            nombre: "Reacio",
            define: [
              "El cuerpo se echa atrás antes de aceptar.",
              "Te resistes aunque no sepas explicar por qué.",
              "Necesitas más tiempo del que te dan.",
            ],
          },
        ],
      },
      {
        key: "decepcionado",
        nombre: "Decepcionado",
        define: [
          "Esperabas otra cosa de alguien o de algo.",
          "Se cae una imagen que sostenías.",
          "Queda un sabor amargo y algo de vergüenza.",
        ],
        hijas: [
          {
            key: "repugnante",
            nombre: "Repugnante",
            define: [
              "Algo te revuelve de verdad, hasta el estómago.",
              "Quieres apartarlo de tu vista cuanto antes.",
              "Sientes que va contra lo que tú eres.",
            ],
          },
          {
            key: "revoltoso",
            nombre: "Revoltoso",
            define: [
              "El rechazo se te vuelve inquietud y ruido.",
              "Te mueves, incordias, no puedes quedarte quieto.",
              "Es una forma de sacar lo que no dices.",
            ],
          },
        ],
      },
      {
        key: "horrible",
        nombre: "Horrible",
        define: [
          "Lo que ves te parece intolerable.",
          "El cuerpo se cierra y quiere huir.",
          "Cuesta mirar y cuesta olvidar.",
        ],
        hijas: [
          {
            key: "asco-fisico",
            nombre: "Asco",
            define: [
              "Rechazo físico, inmediato, sin argumentos.",
              "Se te tuerce la cara sola.",
              "Es el «no» más antiguo del cuerpo.",
            ],
          },
          {
            key: "odioso",
            nombre: "Odioso",
            define: [
              "Lo que ves te resulta detestable.",
              "Quieres que desaparezca de tu vida.",
              "El rechazo se vuelve duro y frío.",
            ],
          },
        ],
      },
      {
        key: "abstinencia",
        nombre: "Abstinencia",
        define: [
          "Te retiras para no seguir tragando.",
          "Dejas de participar aunque sigas ahí.",
          "Es la forma callada de decir basta.",
        ],
        hijas: [
          {
            key: "aversion",
            nombre: "Aversión",
            define: [
              "Evitas sin dar explicaciones.",
              "Solo de pensarlo, te apartas.",
              "El cuerpo elige antes que la cabeza.",
            ],
          },
          {
            key: "vacilante",
            nombre: "Vacilante",
            define: [
              "Ni entras ni sales: te quedas en el borde.",
              "Algo te frena y no sabes ponerle nombre.",
              "Decidir te cuesta más de lo normal.",
            ],
          },
        ],
      },
    ],
  },

  // ── TRISTEZA ───────────────────────────────────────────────────────────
  {
    key: "tristeza",
    nombre: "Tristeza",
    color: "#c3b4ef",
    colorMedio: "#d9cdf6",
    colorClaro: "#eae3fb",
    define: [
      "Aparece cuando pierdes algo que te importaba.",
      "Baja el ritmo del cuerpo para que puedas mirar hacia dentro.",
      "No es debilidad: es la forma de despedirte.",
    ],
    hijas: [
      {
        key: "culpable",
        nombre: "Culpable",
        define: [
          "Sientes que hiciste daño o que no hiciste bastante.",
          "Te repasas por dentro buscando el fallo.",
          "Pesa aunque nadie te esté acusando.",
        ],
        hijas: [
          {
            key: "arrepentido",
            nombre: "Arrepentido",
            define: [
              "Volverías atrás para hacerlo distinto.",
              "Duele la parte que ya no puedes deshacer.",
              "Necesitas repararlo de alguna manera.",
            ],
          },
          {
            key: "avergonzado",
            nombre: "Avergonzado",
            define: [
              "No es lo que hiciste: es lo que crees que eres.",
              "Querrías desaparecer de la escena.",
              "Cuesta contárselo a alguien.",
            ],
          },
        ],
      },
      {
        key: "abandonado",
        nombre: "Abandonado",
        define: [
          "Te quedaste solo cuando más necesitabas a alguien.",
          "Sientes que no fuiste importante para quien lo era todo.",
          "La ausencia sigue doliendo hoy.",
        ],
        hijas: [
          {
            key: "ignorado",
            nombre: "Ignorado",
            define: [
              "Estás delante y aun así no te ven.",
              "Hablas y parece que no llega.",
              "Te hace dudar de si molestas.",
            ],
          },
          {
            key: "victimizado",
            nombre: "Victimizado",
            define: [
              "Sientes que siempre te toca la peor parte.",
              "El dolor se convierte en un lugar donde quedarse.",
              "Cuesta ver la parte que sí depende de ti.",
            ],
          },
        ],
      },
      {
        key: "desesperado",
        nombre: "Desesperado",
        define: [
          "No ves salida y el tiempo se hace largo.",
          "O pides ayuda con urgencia, o dejas de pedirla.",
          "El futuro se pone en blanco.",
        ],
        hijas: [
          {
            key: "desvalido",
            nombre: "Desvalido",
            define: [
              "Sientes que con esto no puedes tú solo.",
              "Necesitas que alguien te sostenga.",
              "La fuerza no aparece cuando la llamas.",
            ],
          },
          {
            key: "vulnerable",
            nombre: "Vulnerable",
            define: [
              "Estás sin coraza y se te nota.",
              "Cualquier cosa entra más adentro de lo normal.",
              "Es también lo que permite que te cuiden.",
            ],
          },
        ],
      },
      {
        key: "deprimido",
        nombre: "Deprimido",
        define: [
          "Se apagan las ganas, hasta las de lo que te gustaba.",
          "El cuerpo pesa y el día cuesta.",
          "Todo se ve gris, y tú también.",
        ],
        hijas: [
          {
            key: "melancolico",
            nombre: "Melancólico",
            define: [
              "Una tristeza suave que no se va del todo.",
              "Añoras algo que ya no está.",
              "Tiene su parte dulce y su parte de duelo.",
            ],
          },
          {
            key: "vacio",
            nombre: "Vacío",
            define: [
              "No sientes casi nada, y eso asusta.",
              "Las cosas pasan pero no te llegan.",
              "Es la tristeza que se quedó sin lágrimas.",
            ],
          },
        ],
      },
      {
        key: "solo",
        nombre: "Solo",
        define: [
          "No tienes a quién contarle esto.",
          "Puede pasarte también rodeado de gente.",
          "Se echa de menos ser visto tal como eres.",
        ],
        hijas: [
          {
            key: "desamparado",
            nombre: "Desamparado",
            define: [
              "Sientes que no hay nadie que te proteja.",
              "Vuelve la sensación de ser pequeño.",
              "Todo parece más grande que tú.",
            ],
          },
          {
            key: "aislado",
            nombre: "Aislado",
            define: [
              "Te has ido apartando poco a poco.",
              "Cada vez cuesta más volver a acercarse.",
              "Una parte tuya prefiere no molestar.",
            ],
          },
        ],
      },
      {
        key: "aburrido",
        nombre: "Aburrido",
        define: [
          "Nada tira de ti, ni lo bueno ni lo malo.",
          "El tiempo se estira y no encuentras dónde ponerte.",
          "A veces tapa una tristeza que no quiere mirarse.",
        ],
        hijas: [
          {
            key: "apatico",
            nombre: "Apático",
            define: [
              "Te da igual una cosa u otra.",
              "No hay impulso para empezar nada.",
              "Es cansancio del alma, no del cuerpo.",
            ],
          },
          {
            key: "indiferente",
            nombre: "Indiferente",
            define: [
              "Lo que antes te movía ahora te resbala.",
              "Te proteges no queriendo nada.",
              "Debajo suele haber una decepción.",
            ],
          },
        ],
      },
    ],
  },

  // ── FELICIDAD ──────────────────────────────────────────────────────────
  {
    key: "felicidad",
    nombre: "Felicidad",
    color: "#f5b478",
    colorMedio: "#fbcd99",
    colorClaro: "#fde2c2",
    define: [
      "Aparece cuando algo importante para ti está en su sitio.",
      "El cuerpo se abre: respiras mejor y la cara se suelta.",
      "No hace falta que sea grande para que cuente.",
    ],
    hijas: [
      {
        key: "optimista",
        nombre: "Optimista",
        define: [
          "Confías en que esto puede salir bien.",
          "Ves puertas donde antes veías muros.",
          "Te da fuerza para intentarlo otra vez.",
        ],
        hijas: [
          {
            key: "inspirado",
            nombre: "Inspirado",
            define: [
              "Se te ocurren cosas y quieres hacerlas ya.",
              "Algo te ha encendido por dentro.",
              "El cansancio se olvida un rato.",
            ],
          },
          {
            key: "abierto",
            nombre: "Abierto",
            define: [
              "Puedes escuchar sin defenderte.",
              "Te caben lo nuevo y lo distinto.",
              "Es cuando de verdad aprendes algo.",
            ],
          },
        ],
      },
      {
        key: "intimo",
        nombre: "Íntimo",
        define: [
          "Con alguien puedes ser tú, sin adornos.",
          "El silencio no incomoda.",
          "Sientes que estás a salvo.",
        ],
        hijas: [
          {
            key: "bromista",
            nombre: "Bromista",
            define: [
              "La confianza se te sale en forma de broma.",
              "Reír juntos acerca más que hablar.",
              "Es cariño en lenguaje de juego.",
            ],
          },
          {
            key: "sensible",
            nombre: "Sensible",
            define: [
              "Notas lo que le pasa al otro sin que lo diga.",
              "Te emocionas con facilidad y no lo escondes.",
              "Es una forma fina de estar presente.",
            ],
          },
        ],
      },
      {
        key: "pacifico",
        nombre: "Pacífico",
        define: [
          "Nada te tira: estás donde estás.",
          "El cuerpo suelta la tensión que traía.",
          "Es la calma que llega cuando confías.",
        ],
        hijas: [
          {
            key: "esperanzado",
            nombre: "Esperanzado",
            define: [
              "Crees que lo bueno todavía es posible.",
              "Sostienes el presente mirando adelante.",
              "Ayuda a esperar sin desesperarse.",
            ],
          },
          {
            key: "carinoso",
            nombre: "Cariñoso",
            define: [
              "Te apetece cuidar y que te cuiden.",
              "Sale en gestos pequeños.",
              "Es amor sin necesidad de motivo.",
            ],
          },
        ],
      },
      {
        key: "poderoso",
        nombre: "Poderoso",
        define: [
          "Sientes que puedes con lo que viene.",
          "La fuerza está disponible cuando la llamas.",
          "Ocupas tu sitio sin pedir permiso.",
        ],
        hijas: [
          {
            key: "provocativo",
            nombre: "Provocativo",
            define: [
              "Te atreves a mover lo que estaba quieto.",
              "Juegas con el límite y te gusta.",
              "Hay chispa, y también riesgo.",
            ],
          },
          {
            key: "valiente",
            nombre: "Valiente",
            define: [
              "Sigues adelante aunque tengas miedo.",
              "Haces lo que crees justo aun con coste.",
              "El miedo no desaparece: deja de mandar.",
            ],
          },
        ],
      },
      {
        key: "aceptado",
        nombre: "Aceptado",
        define: [
          "Estás, y no tienes que ganarte el sitio.",
          "Puedes equivocarte sin perder el cariño.",
          "Descansas de fingir.",
        ],
        hijas: [
          {
            key: "satisfecho",
            nombre: "Satisfecho",
            define: [
              "Lo que hay te basta hoy.",
              "No falta nada urgente.",
              "Puedes disfrutar sin querer más.",
            ],
          },
          {
            key: "respetado",
            nombre: "Respetado",
            define: [
              "Tu palabra y tu límite cuentan.",
              "Te tratan como alguien de valor.",
              "No hace falta levantar la voz.",
            ],
          },
        ],
      },
      {
        key: "orgulloso",
        nombre: "Orgulloso",
        define: [
          "Reconoces lo que has hecho y lo que te ha costado.",
          "Puedes mirarte con cariño.",
          "No es vanidad: es justicia contigo.",
        ],
        hijas: [
          {
            key: "seguro",
            nombre: "Seguro",
            define: [
              "Sabes lo que vales sin tener que demostrarlo.",
              "El error no te derrumba.",
              "Puedes decir «no sé» sin sentirte menos.",
            ],
          },
          {
            key: "importante",
            nombre: "Importante",
            define: [
              "Sientes que tu presencia cambia algo.",
              "Alguien nota si tú faltas.",
              "Todos necesitamos contar para alguien.",
            ],
          },
        ],
      },
      {
        key: "interesado",
        nombre: "Interesado",
        define: [
          "Algo te llama y quieres saber más.",
          "El tiempo se pasa sin notarlo.",
          "Es la puerta de todo lo que aprendes.",
        ],
        hijas: [
          {
            key: "curioso",
            nombre: "Curioso",
            define: [
              "Preguntas antes de opinar.",
              "Te atrae lo que todavía no entiendes.",
              "Mantiene la mirada joven.",
            ],
          },
          {
            key: "entretenido",
            nombre: "Entretenido",
            define: [
              "Estás a gusto en lo que haces.",
              "La cabeza descansa de darle vueltas.",
              "Esto también hace falta.",
            ],
          },
        ],
      },
      {
        key: "alegre",
        nombre: "Alegre",
        define: [
          "La alegría se te ve por fuera.",
          "Te apetece compartirla con alguien.",
          "El cuerpo se mueve más ligero.",
        ],
        hijas: [
          {
            key: "euforico",
            nombre: "Eufórico",
            define: [
              "La alegría sube muy alto y muy rápido.",
              "Todo te parece posible.",
              "Conviene aterrizar sin apagarla.",
            ],
          },
          {
            key: "liberado",
            nombre: "Liberado",
            define: [
              "Se te ha quitado un peso de encima.",
              "Respiras como hacía tiempo que no respirabas.",
              "Aparece después de soltar algo.",
            ],
          },
        ],
      },
    ],
  },

  // ── SORPRESA ───────────────────────────────────────────────────────────
  {
    key: "sorpresa",
    nombre: "Sorpresa",
    color: "#f2e26a",
    colorMedio: "#f8ee9c",
    colorClaro: "#fbf6c6",
    define: [
      "Algo que no esperabas te para en seco.",
      "El cuerpo se abre un instante: ojos, aire, atención.",
      "Dura poco y en seguida se convierte en otra emoción.",
    ],
    hijas: [
      {
        key: "entusiasmado",
        nombre: "Entusiasmado",
        define: [
          "Lo nuevo te enciende y quieres más.",
          "Tienes energía de sobra para empezar.",
          "Cuesta parar y ordenar.",
        ],
        hijas: [
          {
            key: "energico",
            nombre: "Enérgico",
            define: [
              "El cuerpo pide movimiento.",
              "Haces en un día lo de una semana.",
              "Ojo con no escuchar el cansancio.",
            ],
          },
          {
            key: "entusiasta",
            nombre: "Entusiasta",
            define: [
              "Contagias las ganas a quien tienes al lado.",
              "Te lanzas con todo.",
              "A veces prometes más de lo que cabe.",
            ],
          },
        ],
      },
      {
        key: "asombrado",
        nombre: "Asombrado",
        define: [
          "Lo que ves es más grande de lo que esperabas.",
          "Te quedas sin palabras un momento.",
          "Te recuerda que no lo sabes todo.",
        ],
        hijas: [
          {
            key: "impresionado",
            nombre: "Impresionado",
            define: [
              "Algo se te queda grabado.",
              "Reconoces el valor de lo que has visto.",
              "Te mueve a mirar distinto.",
            ],
          },
          {
            key: "estupefacto",
            nombre: "Estupefacto",
            define: [
              "No te cabe en la cabeza lo que acaba de pasar.",
              "Te quedas en blanco unos segundos.",
              "La reacción llega después.",
            ],
          },
        ],
      },
      {
        key: "confundido",
        nombre: "Confundido",
        define: [
          "Las piezas no encajan.",
          "Quieres entender y no llegas.",
          "Es incómodo, y es el principio de comprender.",
        ],
        hijas: [
          {
            key: "perplejo",
            nombre: "Perplejo",
            define: [
              "Te quedas mirando sin saber qué pensar.",
              "Nada de lo que sabías sirve aquí.",
              "Necesitas tiempo antes de responder.",
            ],
          },
          {
            key: "desilusionado",
            nombre: "Desilusionado",
            define: [
              "Se ha caído la idea que tenías.",
              "Duele el hueco entre lo esperado y lo real.",
              "Después de esto se ve más claro.",
            ],
          },
        ],
      },
      {
        key: "sorprendido",
        nombre: "Sorprendido",
        define: [
          "Ha pasado algo que no viste venir.",
          "El cuerpo se sobresalta antes de entender.",
          "Todavía no sabes si es bueno o malo.",
        ],
        hijas: [
          {
            key: "abatido",
            nombre: "Abatido",
            define: [
              "La sorpresa te ha dejado sin fuerzas.",
              "Te sientas y se te cae el ánimo.",
              "Necesitas parar antes de seguir.",
            ],
          },
          {
            key: "conmocionado",
            nombre: "Conmocionado",
            define: [
              "El golpe ha sido demasiado grande.",
              "El cuerpo se queda frío y lejano.",
              "Es la manera en que te protege del impacto.",
            ],
          },
        ],
      },
    ],
  },

  // ── MIEDO ──────────────────────────────────────────────────────────────
  {
    key: "miedo",
    nombre: "Miedo",
    color: "#c9c9c9",
    colorMedio: "#dcdcdc",
    colorClaro: "#ededed",
    define: [
      "Se enciende cuando algo importante puede perderse.",
      "Prepara el cuerpo para protegerte: huir, luchar o quedarte quieto.",
      "No viene a fastidiarte: viene a cuidarte.",
    ],
    hijas: [
      {
        key: "asustado",
        nombre: "Asustado",
        define: [
          "Sientes el peligro cerca, aunque no lo veas.",
          "El corazón va rápido y la respiración se corta.",
          "Buscas un sitio seguro.",
        ],
        hijas: [
          {
            key: "aterrado",
            nombre: "Aterrado",
            define: [
              "El miedo lo ocupa todo.",
              "El cuerpo se bloquea o quiere salir corriendo.",
              "Cuesta pensar hasta que baja.",
            ],
          },
          {
            key: "espantado",
            nombre: "Espantado",
            define: [
              "Un susto que te deja el cuerpo temblando.",
              "Tardas en volver a la calma.",
              "Después llega el cansancio de golpe.",
            ],
          },
        ],
      },
      {
        key: "ansioso",
        nombre: "Ansioso",
        define: [
          "El miedo se adelanta a lo que aún no ha pasado.",
          "La cabeza da vueltas y el cuerpo no descansa.",
          "Intentas controlarlo todo para calmarte.",
        ],
        hijas: [
          {
            key: "agobiado",
            nombre: "Agobiado",
            define: [
              "Todo junto y a la vez: no cabe.",
              "Te falta aire y te falta tiempo.",
              "El cuerpo pide quitar cosas, no aguantar más.",
            ],
          },
          {
            key: "preocupado",
            nombre: "Preocupado",
            define: [
              "Le das vueltas a lo que podría salir mal.",
              "Cuidas por adelantado a quien quieres.",
              "Descansa poco quien vigila siempre.",
            ],
          },
        ],
      },
      {
        key: "inseguro",
        nombre: "Inseguro",
        define: [
          "Dudas de si vas a estar a la altura.",
          "Miras a los demás para saber cómo estás.",
          "Cuesta decidir sin aprobación.",
        ],
        hijas: [
          {
            key: "insuficiente",
            nombre: "Insuficiente",
            define: [
              "Hagas lo que hagas, sientes que falta algo.",
              "La vara con la que te mides no la pusiste tú.",
              "El logro dura poco y vuelve la duda.",
            ],
          },
          {
            key: "inferior",
            nombre: "Inferior",
            define: [
              "Te comparas y sales perdiendo.",
              "Sientes que los demás valen más.",
              "Te hace pequeño incluso ante quien no te juzga.",
            ],
          },
        ],
      },
      {
        key: "sumiso",
        nombre: "Sumiso",
        define: [
          "Te achicas para que no haya conflicto.",
          "Dices sí cuando querías decir no.",
          "Es lo que aprendiste para estar a salvo.",
        ],
        hijas: [
          {
            key: "inutil",
            nombre: "Inútil",
            define: [
              "Sientes que lo que haces no sirve.",
              "Cuesta reconocer lo que sí aportas.",
              "Se apaga el impulso de intentarlo.",
            ],
          },
          {
            key: "insignificante",
            nombre: "Insignificante",
            define: [
              "Sientes que da igual que estés o no.",
              "Hablas y parece que no cuenta.",
              "Duele más el olvido que el rechazo.",
            ],
          },
        ],
      },
      {
        key: "rechazado",
        nombre: "Rechazado",
        define: [
          "Sientes que no te quieren cerca.",
          "Te retiras antes de que te aparten.",
          "Vuelve un dolor antiguo.",
        ],
        hijas: [
          {
            key: "marginado",
            nombre: "Marginado",
            define: [
              "Estás fuera del grupo y se nota.",
              "Nadie lo dice, pero lo sientes.",
              "Cuesta volver a acercarse.",
            ],
          },
          {
            key: "alienado",
            nombre: "Alienado",
            define: [
              "No te reconoces en el sitio donde estás.",
              "Sientes que no eres de aquí.",
              "Ni contigo te sientes en casa.",
            ],
          },
        ],
      },
      {
        key: "humillado",
        nombre: "Humillado",
        define: [
          "Te han hecho pequeño delante de otros.",
          "Se mezclan la vergüenza y la rabia.",
          "El recuerdo vuelve con la cara caliente.",
        ],
        hijas: [
          {
            key: "irrespetado",
            nombre: "Irrespetado",
            define: [
              "Han pasado por encima de tu límite.",
              "Tu palabra no ha contado.",
              "Deja ganas de volver a poner ese límite.",
            ],
          },
          {
            key: "ridiculizado",
            nombre: "Ridiculizado",
            define: [
              "Han hecho broma de lo que te dolía.",
              "Aprendiste a esconder lo que sientes.",
              "La risa de otros se te quedó dentro.",
            ],
          },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────

/** En qué anillo vive una emoción: 1 el centro, 2 las secundarias, 3 el borde. */
export type NivelEmocion = 1 | 2 | 3;

/** Una emoción con su contexto: de qué básica viene y por qué camino. */
export interface EmocionElegida {
  emocion: EmocionRueda;
  nivel: NivelEmocion;
  /** La emoción básica de su sector (para el color y la etiqueta del popup). */
  basica: EmocionBasica;
  /** El camino completo desde el centro («Ira › Herido › Apenado»). */
  camino: string[];
}

/** Cuántas emociones tiene la rueda en total (las tres coronas). */
export const EMOCIONES_TOTAL: number = RUEDA_EMOCIONES.reduce(
  (n, b) => n + 1 + b.hijas.length + b.hijas.reduce((m, h) => m + (h.hijas?.length ?? 0), 0),
  0,
);
