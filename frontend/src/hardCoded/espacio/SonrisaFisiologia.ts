// ── La sonrisa interior (Fisiología) ─────────────────────────────────────────
// Datos de la práctica que va DESPUÉS de Niveles y ANTES de Cursos: el usuario
// se ve «en un espejo» (la figura anatómica) y va agradeciendo sus órganos uno a
// uno. El objetivo no es aprender nada nuevo: es reconocer que todo lo que ha
// visto en el recorrido está dentro de él ahora mismo.
//
// Por eso los textos están en SEGUNDA PERSONA y en PRESENTE («ahora mismo, tu
// hígado está…»), y cada órgano cierra con una frase de gratitud que el usuario
// le dice. La página es data-driven: añadir o quitar órganos aquí es suficiente.
//
// Las fotos son las que ya usa el recorrido: /recorrido/fisiologia/organos/*.png
// El `hotspot` es la posición del punto pulsable sobre anatomia.png, en % (0-100).

export interface OrganoSonrisa {
  key: string;
  /** Nombre corto (chips, tooltip del punto). */
  nombre: string;
  /** Título de la ficha, en posesivo: «Tu hígado», «Tus pulmones». */
  titulo: string;
  foto: string;
  hotspot: { top: number; left: number };
  /** Tres datos concretos (cajas blancas de la ficha). */
  claves: string[];
  /** Qué está haciendo por ti AHORA MISMO. */
  texto: string;
  /** Frase de gratitud que el usuario le dice al órgano. */
  gracias: string;
}

const F = "/recorrido/fisiologia/organos";

// Recorrido de arriba abajo, como en la práctica: cabeza → garganta → pecho →
// abdomen → estructura. Doce paradas.
export const ORGANOS_SONRISA: OrganoSonrisa[] = [
  {
    key: "cerebro",
    nombre: "Cerebro",
    titulo: "Tu cerebro",
    foto: `${F}/cerebro.png`,
    hotspot: { top: 10, left: 47 },
    claves: [
      "Pesa poco más de un kilo y gasta cerca de una quinta parte de tu energía",
      "Unos 86.000 millones de neuronas",
      "No se apaga nunca: también trabaja mientras duermes",
    ],
    texto: "Mientras lees esta frase, tu cerebro la está entendiendo. Al mismo tiempo sostiene tu respiración, tu latido y tu temperatura sin que tengas que acordarte de nada. Todo lo que has vivido está guardado ahí dentro.",
    gracias: "Gracias, cerebro, por pensarme y por sostenerme incluso cuando no me doy cuenta.",
  },
  {
    key: "tiroides",
    nombre: "Tiroides",
    titulo: "Tu tiroides",
    foto: `${F}/tiroides.png`,
    hotspot: { top: 18, left: 47 },
    claves: [
      "Una mariposa de 20-25 gramos en tu garganta",
      "Marca el ritmo al que quema energía cada célula tuya",
      "Sus hormonas viajan por toda tu sangre",
    ],
    texto: "Es pequeña y decide algo enorme: a qué velocidad vive tu cuerpo. Tu temperatura, la energía con la que te levantas y hasta tu ánimo pasan por ella. Ahora mismo está ajustando ese ritmo por ti.",
    gracias: "Gracias, tiroides, por darme el ritmo justo para vivir el día.",
  },
  {
    key: "pulmones",
    nombre: "Pulmones",
    titulo: "Tus pulmones",
    foto: `${F}/pulmones.png`,
    hotspot: { top: 27, left: 42 },
    claves: [
      "Unas 20.000 respiraciones al día",
      "Cerca de 300 millones de alvéolos",
      "Su superficie de intercambio ocupa como una pista de tenis",
    ],
    texto: "Respira ahora, despacio. Ese aire que acaba de entrar llega hasta los alvéolos y pasa a tu sangre en menos de un segundo. Tus pulmones no han dejado de hacerlo desde tu primer llanto.",
    gracias: "Gracias, pulmones, por traerme el aire una y otra vez sin pedirme nada.",
  },
  {
    key: "corazon",
    nombre: "Corazón",
    titulo: "Tu corazón",
    foto: `${F}/corazon.png`,
    hotspot: { top: 29, left: 50 },
    claves: [
      "Unos 100.000 latidos al día",
      "Mueve alrededor de 7.000 litros de sangre cada día",
      "Empezó a latir antes de que tú nacieras",
    ],
    texto: "Pon la mano en el pecho y siéntelo. Late desde la tercera semana en el vientre de tu madre y no ha parado ni un solo día. Cada latido lleva oxígeno hasta el último rincón de ti.",
    gracias: "Gracias, corazón, por latir por mí desde antes de que yo supiera que existías.",
  },
  {
    key: "higado",
    nombre: "Hígado",
    titulo: "Tu hígado",
    foto: `${F}/higado.png`,
    hotspot: { top: 35, left: 42.5 },
    claves: [
      "Más de 500 funciones distintas",
      "Por él pasa más de un litro de sangre por minuto",
      "Es el único órgano capaz de regenerarse",
    ],
    texto: "Es tu gran laboratorio: limpia, transforma, almacena y reparte. Todo lo que comes y bebes pasa por él antes de llegar al resto de tu cuerpo. Y lo hace en silencio, sin que lo notes nunca.",
    gracias: "Gracias, hígado, por limpiar sin descanso lo que yo ni siquiera veo.",
  },
  {
    key: "estomago",
    nombre: "Estómago",
    titulo: "Tu estómago",
    foto: `${F}/estomago.png`,
    hotspot: { top: 36, left: 55 },
    claves: [
      "Fabrica un ácido tan fuerte que podría dañar un metal",
      "Su mucosa se renueva cada pocos días",
      "Se dilata para acoger lo que comes",
    ],
    texto: "Recibe lo que le das y lo deshace en piezas tan pequeñas que tu sangre pueda usarlas. Y se protege a sí mismo del ácido que fabrica, rehaciendo su pared una y otra vez.",
    gracias: "Gracias, estómago, por recibir lo que te doy y convertirlo en vida.",
  },
  {
    key: "pancreas",
    nombre: "Páncreas",
    titulo: "Tu páncreas",
    foto: `${F}/pancreas.png`,
    hotspot: { top: 40.5, left: 49 },
    claves: [
      "Fabrica la insulina y el glucagón",
      "Suelta las enzimas que digieren grasas, proteínas e hidratos",
      "Regula tu azúcar minuto a minuto",
    ],
    texto: "Cada vez que comes, decide cuánta energía entra en tus células y cuánta se guarda para después. Nunca has tenido que pensar en tu nivel de azúcar: él lo ha hecho por ti.",
    gracias: "Gracias, páncreas, por medir mi energía con una precisión que yo no sabría igualar.",
  },
  {
    key: "bazo",
    nombre: "Bazo",
    titulo: "Tu bazo",
    foto: `${F}/bazo.png`,
    hotspot: { top: 39.5, left: 59 },
    claves: [
      "Retira los glóbulos rojos viejos y recicla su hierro",
      "Guarda y entrena parte de tus defensas",
      "Es un filtro de tu propia sangre",
    ],
    texto: "Es el órgano del que casi nadie habla. Limpia tu sangre de células gastadas, aprovecha lo que aún sirve y mantiene defensas listas para cuando aparezca una infección.",
    gracias: "Gracias, bazo, por cuidarme desde el silencio, sin que nadie te nombre.",
  },
  {
    key: "rinones",
    nombre: "Riñones",
    titulo: "Tus riñones",
    foto: `${F}/rinones.png`,
    hotspot: { top: 44, left: 43 },
    claves: [
      "Filtran unos 180 litros de sangre al día",
      "Un millón de nefronas en cada uno",
      "Deciden cuánta agua y cuánta sal se quedan en ti",
    ],
    texto: "Filtran tu sangre entera muchas veces al día y te devuelven casi todo, quedándose solo con lo que sobra. También cuidan tu tensión y el equilibrio de tus minerales.",
    gracias: "Gracias, riñones, por dejar limpio lo que corre por dentro de mí.",
  },
  {
    key: "intestino",
    nombre: "Intestinos",
    titulo: "Tus intestinos",
    foto: `${F}/intestino.png`,
    hotspot: { top: 48, left: 50 },
    claves: [
      "Entre siete y ocho metros de largo",
      "Más de cien millones de neuronas propias",
      "Billones de bacterias viven contigo aquí dentro",
    ],
    texto: "Aquí lo que comiste se convierte en ti: en tus músculos, en tus hormonas, en tus pensamientos. Tienen su propio sistema nervioso, y por eso a veces sientes las emociones en la barriga.",
    gracias: "Gracias, intestinos, por convertir la comida en mí y por avisarme cuando algo no va bien.",
  },
  {
    key: "huesos",
    nombre: "Huesos",
    titulo: "Tus huesos",
    foto: `${F}/huesos.png`,
    hotspot: { top: 77, left: 55 },
    claves: [
      "206 huesos sosteniéndote ahora mismo",
      "Dentro de ellos se fabrica tu sangre",
      "Se rehacen por completo a lo largo de unos diez años",
    ],
    texto: "No son piedras: son tejido vivo que se deshace y se vuelve a construir cada día según cómo te muevas. Y en su interior, la médula fabrica la sangre que te mantiene vivo.",
    gracias: "Gracias, huesos, por sostenerme en pie y por darme la sangre desde dentro.",
  },
  {
    key: "piel",
    nombre: "Piel",
    titulo: "Tu piel",
    foto: `${F}/piel.png`,
    hotspot: { top: 22, left: 32 },
    claves: [
      "Tu órgano más grande: unos dos metros cuadrados",
      "Se renueva por completo cada tres o cuatro semanas",
      "Millones de receptores del tacto",
    ],
    texto: "Es tu frontera y tu primer contacto con el mundo: te protege, regula tu temperatura y te deja sentir una caricia. Ahora mismo está tocando el aire que tienes alrededor.",
    gracias: "Gracias, piel, por guardarme entero y por dejarme sentir.",
  },
];

/** Figura del «espejo»: el cuerpo entero con sus órganos dentro. */
export const ESPEJO_FOTO = `${F}/anatomia.png`;

/** Clave de metodo_fisiologia.data donde se guardan los órganos agradecidos. */
export const SONRISA_CAMPO = "sonrisa_agradecidos";
