// Los 12 sistemas del cuerpo que rodean al ser humano en /metodo/fisiologia/sistemas.
// Cada uno tendrá (María lo irá pasando):
//   · su propio CÓMIC (viñetas)
//   · un TEST de autorregistro: cómo se siente el usuario / qué tal va ese sistema.
// Las fotos (foto) llegan mañana; de momento se muestra la inicial con el color.
import type { Vineta } from "../../components/metodo/ComicViewer";

export type PreguntaTest = {
  texto: string;
  /** Opcional: etiquetas de la escala (por defecto 0-4 / nunca→siempre). */
  opciones?: string[];
};

export type Sistema = {
  key: string;
  label: string;
  /** Color de acento del sistema. */
  color: string;
  /** Foto del sistema (pendiente). */
  foto: string;
  /** Texto que explica qué es y qué hace el sistema (se muestra en el modal
   *  inmersivo, a la derecha de la imagen). */
  descripcion: string;
  /** Las 3 ideas clave del sistema (resumen de la descripción). Se muestran en
   *  cajas blancas bajo el título, para captarlo en 3-5 s. */
  claves?: string[];
  /** Viñetas del cómic del sistema (pendiente de texto e imágenes). */
  comic: Vineta[];
  /** Preguntas del test de autorregistro (pendiente de contenido definitivo). */
  test: PreguntaTest[];
};

const FOTO = (k: string) => `/recorrido/fisiologia/sistemas/${k}.png`;

export const SISTEMAS: Sistema[] = [
  { key: "nervioso",      label: "Nervioso",      color: "#c9a7ff", foto: FOTO("nervioso"),
    claves: ["Conecta todo el cuerpo", "Recibe, procesa y ordena", "Nos hace movernos y sentir"],
    descripcion: "Abarca desde nuestro cerebro hasta el último centímetro de nuestro cuerpo. Todo está conectado a través de la médula espinal y los nervios periféricos. Cualquier cascada de neurotransmisores comienza con una señal eléctrica generada por las neuronas. Controla y coordina todas las funciones del cuerpo. Recibe información del entorno, la procesa y envía órdenes para que podamos movernos, pensar, sentir y reaccionar.",
    comic: [], test: [] },
  { key: "cardiovascular", label: "Cardiovascular", color: "#f28b8b", foto: FOTO("cardiovascular"),
    claves: ["Corazón y red de vasos", "Transporta oxígeno y CO₂", "Reparte nutrientes y hormonas"],
    descripcion: "Está formado por el corazón y una extensa red de arterias, venas y capilares. La hemoglobina de los glóbulos rojos transporta oxígeno desde los pulmones hasta las células y, posteriormente, recoge parte del dióxido de carbono para llevarlo de vuelta a los pulmones, donde será expulsado. Además, transporta nutrientes, hormonas y otras sustancias esenciales por todo el organismo.",
    comic: [], test: [] },
  { key: "respiratorio",  label: "Respiratorio",  color: "#8fd0e6", foto: FOTO("respiratorio"),
    claves: ["Capta oxígeno, suelta CO₂", "Da energía a las células", "Se defiende con moco y cilios"],
    descripcion: "Permite obtener oxígeno del aire y expulsar dióxido de carbono. Es esencial para que las células produzcan la energía que necesita el organismo. Además, cuenta con mecanismos propios de defensa, como el moco, los cilios y diversas células del sistema inmunitario, que ayudan a protegernos frente a microorganismos y partículas.",
    comic: [], test: [] },
  { key: "digestivo",     label: "Digestivo",     color: "#f2c86b", foto: FOTO("digestivo"),
    claves: ["Transforma alimentos en nutrientes", "Fuente de energía", "Alberga el «segundo cerebro»"],
    descripcion: "Se encarga de transformar los alimentos en nutrientes que el cuerpo puede absorber y utilizar como fuente de energía y para su funcionamiento. Además, contiene el sistema nervioso entérico, una extensa red de neuronas capaz de funcionar de forma bastante independiente, por lo que a menudo se le conoce como el «segundo cerebro».",
    comic: [], test: [] },
  { key: "urinario",      label: "Urinario",      color: "#a7d9f2", foto: FOTO("urinario"),
    claves: ["Filtra la sangre", "Elimina desechos y agua", "Mantiene el equilibrio interno"],
    descripcion: "Filtra la sangre para eliminar sustancias de desecho y el exceso de agua mediante la orina, ayudando a mantener el equilibrio interno del organismo. En otras palabras, la orina es el resultado del filtrado de la sangre y de los procesos de reabsorción y secreción que realizan los riñones.",
    comic: [], test: [] },
  { key: "endocrino",     label: "Endocrino",     color: "#e6a7d9", foto: FOTO("endocrino"),
    claves: ["Produce hormonas", "Regula metabolismo y sueño", "Coordina estrés y crecimiento"],
    descripcion: "Produce hormonas que regulan funciones como el crecimiento, el metabolismo, el sueño, el estrés y la reproducción.",
    comic: [], test: [] },
  { key: "linfatico",     label: "Linfático / Inmune", color: "#9fe6b8", foto: FOTO("linfatico"),
    claves: ["Red inmune de vasos y ganglios", "Transporta las grasas del intestino", "Recoge el líquido sobrante"],
    descripcion: "Es una gran red de vasos y ganglios por la que circulan células del sistema inmunitario, siempre preparadas para actuar frente a infecciones. También está estrechamente conectado con el intestino, ya que transporta las grasas absorbidas antes de que lleguen a la sangre. Además, recoge el exceso de líquido de los tejidos y lo devuelve a la circulación para mantener el equilibrio del organismo.",
    comic: [], test: [] },
  { key: "muscular",      label: "Muscular",      color: "#e3a6a6", foto: FOTO("muscular"),
    claves: ["Permite el movimiento", "Mantiene la postura y da calor", "Trabaja junto a los huesos"],
    descripcion: "Es un sistema complejo, regulado de forma muy precisa por neurotransmisores como la acetilcolina y por el calcio. Permite el movimiento del cuerpo, mantiene la postura y genera calor. Trabaja junto con los huesos para realizar cualquier movimiento.",
    comic: [], test: [] },
  { key: "oseo",          label: "Óseo",          color: "#e8e0cf", foto: FOTO("oseo"),
    claves: ["Da soporte y protección", "Se reconstruye sin cesar", "Fabrica sangre y guarda calcio"],
    descripcion: "Proporciona soporte y protección al cuerpo. Está formado por millones de células en constante comunicación. El hueso se destruye y se reconstruye continuamente mediante un proceso llamado remodelación ósea, por lo que el ejercicio de fuerza es fundamental para mantener unos huesos fuertes y saludables. Además, participa en la producción de células sanguíneas y almacena minerales como el calcio.",
    comic: [], test: [] },
  { key: "tegumentario",  label: "Tegumentario (piel)", color: "#f2b48f", foto: FOTO("tegumentario"),
    claves: ["Barrera frente al exterior", "Regula temperatura y tacto", "Ligada a las emociones"],
    descripcion: "Forma la barrera protectora del cuerpo frente al exterior. Ayuda a regular la temperatura corporal y permite percibir sensaciones como el tacto, el frío y el calor. También está muy relacionada con nuestras emociones y con la respuesta al estrés, ya que hormonas como el cortisol influyen en el funcionamiento de la piel.",
    comic: [], test: [] },
  { key: "reproductor",   label: "Reproductor",   color: "#d9a7c9", foto: FOTO("reproductor"),
    claves: ["Hace posible la reproducción", "Produce las células sexuales", "Fabrica hormonas sexuales"],
    descripcion: "Hace posible la reproducción y produce las células sexuales y las hormonas relacionadas con el desarrollo y la función reproductiva.",
    comic: [], test: [] },
  { key: "sensorial",     label: "Sensorial",     color: "#b8d98f", foto: FOTO("sensorial"),
    claves: ["Capta con los cinco sentidos", "Envía la señal al cerebro", "Incluye equilibrio y posición"],
    descripcion: "Capta los estímulos del entorno mediante los sentidos (vista, oído, olfato, gusto y tacto) y envía esa información al sistema nervioso para interpretarla. También incluye la propiocepción, un sentido que nos permite conocer la posición y el movimiento de nuestro cuerpo sin necesidad de mirar, haciendo posibles el equilibrio y la coordinación.",
    comic: [], test: [] },
];

// ─────────────────────────────────────────────────────────────────────────
// Frase "memorable" de cada sistema, para la página del ORGANISMO
// (/metodo/fisiologia/organismo): al colocar cada sistema aparece su frase,
// dicha como si un «creador» estuviese construyendo el cuerpo, pieza a pieza.
// Editable aquí; keyed por el `key` del sistema.
// ─────────────────────────────────────────────────────────────────────────
export const FRASE_ORGANISMO: Record<string, string> = {
  nervioso:       "Que una red lo conecte todo: por ella viajarán el pensamiento y cada orden.",
  cardiovascular: "El corazón nutrirá cada una de las células.",
  respiratorio:   "Con cada aliento entrará la Vida y saldrá lo que ya no sirve.",
  digestivo:      "Transformará el alimento en la energía que lo sostiene todo.",
  urinario:       "Purificará la sangre y guardará el equilibrio del agua.",
  endocrino:      "Mensajeros invisibles llevarán la orden justa a cada rincón.",
  linfatico:      "Un ejército silencioso velará por cada célula.",
  muscular:       "Le daré la fuerza para moverse por el mundo.",
  oseo:           "Sobre estos pilares se sostendrá en pie.",
  tegumentario:   "Una frontera viva lo separará del mundo y, a la vez, lo abrazará.",
  reproductor:    "En él guardaré la promesa de la Vida que vendrá.",
  sensorial:      "Y así podrá ver, oír y sentir toda la creación.",
};
