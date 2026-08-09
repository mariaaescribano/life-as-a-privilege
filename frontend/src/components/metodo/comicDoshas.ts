import type { Vineta } from "./ComicViewer";
import type { DoshaKey } from "../../hardCoded/metodo/doshaIntro";

// ─────────────────────────────────────────────────────────────────────────
// Cómics de los tres Doṣhas. Uno por dosha, 4 viñetas cada uno. Se intercalan
// al final de la «Introducción a tu dosha» (paso 1/7 del recorrido de Ayurveda),
// justo antes de «Descúbrete»: la intro le ha contado el principio en abstracto
// y aquí lo ve pasarle a alguien.
//
// El arco es el mismo en los tres, porque es el arco del recorrido entero:
//   1. el don en acción   →  2. la sombra del don  →
//   3. lo que enseña el Ayurveda  →  4. el mismo don, en equilibrio
//
// PERSONAJES (que se mantengan reconocibles en las cuatro viñetas de cada uno):
//   · Vata  — una CHICA joven. Aire y Éter: pelo suelto y en movimiento, ropa
//             ligera, ventanas abiertas, papeles volando. Paleta fría y aireada.
//   · Pitta — un CHICO joven. Fuego y Agua: mirada intensa, postura firme, luz
//             cálida y focal (lámpara, sol de mediodía). Paleta ámbar/rojiza.
//   · Kapha — una MUJER adulta. Agua y Tierra: presencia serena y estable,
//             manos que sostienen, plantas, cocina, hogar. Paleta verde/tierra.
//
// Sin títulos: solo ilustración y texto, como el resto de cómics de Ayurveda.
//
// Imágenes: /viñetas/hinduismo/<dosha>/<dosha>1.webp … <dosha>4.webp
// ─────────────────────────────────────────────────────────────────────────

const V = "/viñetas/hinduismo/vata";
const P = "/viñetas/hinduismo/pitta";
const K = "/viñetas/hinduismo/kapha";

// ── VATA · el viento ─────────────────────────────────────────────────────
export const COMIC_VATA: Vineta[] = [
  {
    // Viñeta 1: la chica de espaldas a una ventana abierta, cuaderno en las
    // rodillas, ideas dibujadas alrededor como hojas llevadas por el aire.
    src: `${V}/vata1.webp`,
    paragraphs: [
      "Hay personas que no eligen sus ideas: sus ideas llegan solas.",
      "Ella siempre ha sido así. Una conversación cualquiera le abre tres caminos nuevos, y antes de terminar el primero ya está imaginando el siguiente.",
      "Aprende deprisa. Se entusiasma deprisa. Ve posibilidades donde otros solo ven un problema.",
      "Eso es Vata: el Aire y el Éter moviéndose dentro de alguien.",
      "*Donde hay movimiento, está actuando Vata.*",
    ],
  },
  {
    // Viñeta 2: la misma chica de noche, la habitación llena de cosas
    // empezadas, ella despierta mirando el techo.
    src: `${V}/vata2.webp`,
    paragraphs: [
      "Pero el viento no sabe parar.",
      "— «Tengo diez cosas empezadas y ninguna terminada. Como que no duermo bien. Como cuando me acuerdo.»",
      "El mismo aire que le trae las ideas también le trae la dispersión, el sueño ligero, la preocupación que da vueltas de madrugada.",
      "Y entonces aparece el pensamiento de siempre: *quizá el problema soy yo.*",
      "No lo es. Es que el viento lleva demasiado tiempo soplando sin nada que lo sostenga.",
    ],
  },
  {
    // Viñeta 3: metáfora — un árbol alto con las ramas agitadas por el viento
    // y las raíces bien hondas; la chica sentada al pie, quieta.
    src: `${V}/vata3.webp`,
    paragraphs: [
      "El Ayurveda no le pide que deje de moverse.",
      "Al viento no se le sujeta: se le da un lugar donde soplar.",
      "Un horario. Comida caliente. Una hora de dormir. Unos minutos de silencio antes de que el día empiece a tirar de ella.",
      "Cosas pequeñas, repetidas. Nada espectacular.",
      "**Vata no necesita ir más deprisa. Necesita raíces.**",
    ],
  },
  {
    // Viñeta 4: la chica, la misma, en calma: luz de mañana, comida caliente,
    // el cuaderno abierto por una sola página, terminada.
    src: `${V}/vata4.webp`,
    paragraphs: [
      "Meses después su mente sigue siendo rápida. No ha perdido nada.",
      "Pero ahora las ideas aterrizan. Termina lo que empieza. Descansa sin sentir que está perdiendo el tiempo.",
      "Su imaginación se ha vuelto inspiración; su sensibilidad, intuición; su facilidad para cambiar, una de sus mayores fortalezas.",
      "*No necesitas perder tu creatividad. Necesitas darle raíces.*",
    ],
  },
];

// ── PITTA · el fuego ─────────────────────────────────────────────────────
export const COMIC_PITTA: Vineta[] = [
  {
    // Viñeta 1: el chico concentrado bajo una lámpara, todo ordenado,
    // resolviendo algo; el resto de la sala en penumbra.
    src: `${P}/pitta1.webp`,
    paragraphs: [
      "Hay personas que necesitan entender cómo funcionan las cosas.",
      "Él es de esos. Se le da bien decidir, organizar, ver el error que nadie ha visto y arreglarlo. Cuando algo le importa, no lo suelta hasta que sale bien.",
      "Los demás le buscan cuando hay que tomar una decisión difícil.",
      "Eso es Pitta: el Fuego y el Agua transformando todo lo que tocan.",
      "*Donde hay transformación, está actuando Pitta.*",
    ],
  },
  {
    // Viñeta 2: el mismo chico tarde por la noche, tenso, la misma lámpara
    // demasiado cerca; sombras duras, mandíbula apretada.
    src: `${P}/pitta2.webp`,
    paragraphs: [
      "Pero el fuego, cuando nadie lo cuida, deja de calentar y empieza a quemar.",
      "— «Ha salido bien, sí. Pero podría haber salido mejor.»",
      "Come tarde o no come. Se irrita con lo que no avanza. Le cuesta desconectar, pedir ayuda, perdonarse un error que a cualquier otro le habría perdonado sin pensarlo.",
      "Y por dentro, la misma frase repitiéndose: *debería estar haciendo más.*",
      "No es una persona enfadada. Es un fuego que lleva mucho tiempo sin descansar.",
    ],
  },
  {
    // Viñeta 3: metáfora — una hoguera contenida en un círculo de piedras, de
    // noche; alrededor, gente calentándose. El chico atizándola despacio.
    src: `${P}/pitta3.webp`,
    paragraphs: [
      "El Ayurveda no le pide que se apague.",
      "Un fuego sin límites arrasa el bosque; el mismo fuego, dentro de un círculo de piedras, da luz y calor a todos los que se sientan alrededor.",
      "Comer a sus horas. Parar antes de estar vacío. Elegir lo fresco cuando todo arde. Tratarse con la misma compasión con la que trata a los demás.",
      "**Pitta no necesita ser más intenso. Necesita aprender a descansar.**",
    ],
  },
  {
    // Viñeta 4: el chico a plena luz del día, fuera, relajado, explicando algo
    // a alguien; la intensidad sigue en la mirada, pero ya no le consume.
    src: `${P}/pitta4.webp`,
    paragraphs: [
      "Sigue siendo exigente. Sigue queriendo hacer las cosas bien. No ha perdido nada.",
      "Pero ya no confunde su valor con lo que consigue.",
      "Su inteligencia se ha vuelto sabiduría; su disciplina, un ejemplo; su liderazgo, una forma de servir en lugar de una forma de exigirse.",
      "*No necesitas apagar tu fuego. Necesitas aprender a dirigirlo.*",
    ],
  },
];

// ── KAPHA · la tierra ────────────────────────────────────────────────────
export const COMIC_KAPHA: Vineta[] = [
  {
    // Viñeta 1: la mujer en una cocina cálida, sirviendo algo, alguien
    // sentado a su lado hablándole; plantas, luz suave.
    src: `${K}/kapha1.webp`,
    paragraphs: [
      "Hay personas a las que los demás acuden cuando el suelo se mueve.",
      "Ella es una de ellas. Escucha antes de hablar. No se altera. Está cuando dice que va a estar, y eso hace que la gente respire distinto a su lado.",
      "Cuida, sostiene, acompaña. Su casa es un sitio donde apetece quedarse.",
      "Eso es Kapha: el Agua y la Tierra manteniendo unido lo que la Vida ha construido.",
      "*Donde hay estabilidad, nutrición y cuidado, está actuando Kapha.*",
    ],
  },
  {
    // Viñeta 2: la misma mujer sentada, quieta, con la casa igual que siempre;
    // una caja sin abrir, una carta sin contestar, la luz un poco apagada.
    src: `${K}/kapha2.webp`,
    paragraphs: [
      "Pero la tierra que lleva demasiado tiempo sin moverse termina pesando.",
      "— «Sé que tengo que hacer ese cambio. Lo sé desde hace dos años. Ya lo haré.»",
      "Guarda lo que ya no usa, sostiene lo que ya no la sostiene, carga con lo de todos y aplaza lo suyo. Se acostumbra. Y acostumbrarse se parece mucho a estar bien.",
      "Y por dentro: *si cambio algo, puedo perder lo que tengo.*",
      "No es una persona perezosa. Es la tierra buscando quedarse quieta.",
    ],
  },
  {
    // Viñeta 3: metáfora — un río bajando entre la tierra, un árbol perdiendo
    // hojas y brotando a la vez; la mujer de pie, mirándolo, en movimiento.
    src: `${K}/kapha3.webp`,
    paragraphs: [
      "El Ayurveda no le pide que pierda su calma.",
      "Los árboles crecen, las estaciones cambian, los ríos no dejan de fluir. Y aun así siguen siendo ellos mismos.",
      "Levantarse un poco antes. Caminar cada día. Comer más ligero. Hacer una sola cosa distinta esta semana. Soltar algo, aunque sea pequeño.",
      "**Kapha no necesita desaparecer. Necesita volver a ponerse en movimiento.**",
    ],
  },
  {
    // Viñeta 4: la mujer fuera de casa, andando por la mañana temprano, ligera;
    // la misma serenidad de siempre, pero en marcha.
    src: `${K}/kapha4.webp`,
    paragraphs: [
      "Sigue siendo tranquila. Sigue siendo el sitio al que los demás acuden. No ha perdido nada.",
      "Pero ya no confunde quedarse con estar a salvo.",
      "Su calma se ha vuelto presencia; su constancia, fortaleza; y su manera de cuidar ha dejado de ser sacrificio para convertirse en una forma consciente de amar.",
      "*No necesitas perder tu calma. Necesitas recordar que la Vida también crece cuando cambia.*",
    ],
  },
];

/** Cómic de cada dosha, para la intro de su recorrido. */
export const COMIC_DOSHA: Record<DoshaKey, Vineta[]> = {
  vata: COMIC_VATA,
  pitta: COMIC_PITTA,
  kapha: COMIC_KAPHA,
};
