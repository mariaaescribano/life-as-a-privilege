/**
 * Autores y autoras de la historia de la Astrología (página de Astrología, tercera sección).
 * Cada uno: nombre, fechas, foto (ruta en `/public/img/autores/`) y su historia en español e inglés.
 * El texto admite `**negrita**`, `*cursiva*` y `***ambas***`; un salto de línea doble separa párrafos.
 * Se enseñan de DOS en DOS, en zigzag: el primero con la foto a la izquierda y el segundo con la foto a la derecha.
 *
 * FOTOS: cada autor apunta a `/img/autores/<nombre>.webp`. Mientras ese fichero no exista, su tarjeta enseña el
 * mandala en su lugar (no sale ninguna imagen rota). Al subir la foto, aparece sola. Textos en inglés: traducción
 * provisional, pendiente de revisar.
 */
export type AutorAstrologia = {
  nombre: string;
  /** Si el nombre se escribe distinto en inglés. */
  nombreEn?: string;
  fechas: { es: string; en: string };
  foto: string;
  texto: { es: string; en: string };
};

const F = (n: string) => `/img/autores/${n}.webp`;

export const AUTORES_ASTROLOGIA: AutorAstrologia[] = [
  {
    nombre: "Platón",
    nombreEn: "Plato",
    fechas: { es: "c. 427-347 a. C.", en: "c. 427–347 BC" },
    foto: F("platon"),
    texto: {
      es: "Filósofo griego y fundador de la Academia de Atenas. En el *Timeo* describe un cosmos ordenado y dotado de alma. Cuenta que su creador asignó cada alma a un astro, y que quien viviera con justicia regresaría a él. Su visión del vínculo entre el ser humano y el cielo influyó en siglos de pensamiento posterior.",
      en: "Greek philosopher and founder of the Academy of Athens. In the *Timaeus* he describes an ordered cosmos endowed with a soul. He says that its creator assigned each soul to a star, and that whoever lived justly would return to it. His vision of the bond between human beings and the sky influenced centuries of later thought.",
    },
  },
  {
    nombre: "Hipatia de Alejandría",
    nombreEn: "Hypatia of Alexandria",
    fechas: { es: "", en: "" },
    foto: F("hipatia"),
    texto: {
      es: "Hipatia editó y comentó el Libro III del Almagesto (dedicado al movimiento del Sol y la duración del año), simplificando cálculos matemáticos complejos y corrigiendo errores de copia. Su labor se centró en la matemática y la filosofía neoplatónica.",
      en: "Hypatia edited and commented on Book III of the Almagest (devoted to the motion of the Sun and the length of the year), simplifying complex mathematical calculations and correcting copying errors. Her work focused on mathematics and Neoplatonic philosophy.",
    },
  },
  {
    nombre: "Ptolomeo",
    nombreEn: "Ptolemy",
    fechas: { es: "siglo II", en: "2nd century" },
    foto: F("ptolomeo"),
    texto: {
      es: "Astrónomo, matemático y geógrafo de Alejandría. Escribió el ***Tetrabiblos***, una gran síntesis ordenada de principios astrológicos heredados de una larga tradición. Distinguió entre calcular los movimientos de los astros y estudiar sus efectos.",
      en: "Astronomer, mathematician and geographer of Alexandria. He wrote the ***Tetrabiblos***, a great ordered synthesis of astrological principles inherited from a long tradition. He distinguished between calculating the movements of the stars and studying their effects.",
    },
  },
  {
    nombre: "Carlomagno",
    nombreEn: "Charlemagne",
    fechas: { es: "c. 747-814", en: "c. 747–814" },
    foto: F("carlomagno"),
    texto: {
      es: "Rey de los francos y emperador, impulsó una gran renovación cultural en Europa. Según su biógrafo Eginardo, dedicó mucho tiempo y esfuerzo a la astronomía, que estudió con el sabio Alcuino. Investigó con interés los movimientos de los astros, en una época en la que ese saber estaba ligado a la tradición astrológica.",
      en: "King of the Franks and emperor, he drove a great cultural renewal in Europe. According to his biographer Einhard, he devoted much time and effort to astronomy, which he studied with the scholar Alcuin. He took a keen interest in the movements of the stars, at a time when that knowledge was bound up with the astrological tradition.",
    },
  },
  {
    nombre: "Abu Ma'shar",
    fechas: { es: "787-886", en: "787–886" },
    foto: F("abu-mashar"),
    texto: {
      es: "Astrólogo persa afincado en Bagdad. Escribió la ***Gran introducción a la astrología***, una exposición amplia de sus fundamentos. Sus traducciones latinas, desde el siglo XII, se leyeron ampliamente en Europa. Su obra influyó en pensadores como Alberto Magno y Roger Bacon.",
      en: "Persian astrologer based in Baghdad. He wrote the ***Great Introduction to Astrology***, a broad account of its foundations. His Latin translations, from the 12th century onwards, were widely read in Europe. His work influenced thinkers such as Albertus Magnus and Roger Bacon.",
    },
  },
  {
    nombre: "Abraham ibn Ezra",
    fechas: { es: "siglo XII", en: "12th century" },
    foto: F("ibn-ezra"),
    texto: {
      es: "Sabio judío nacido en la península ibérica, fue poeta, comentarista bíblico, matemático y astrólogo. Viajó por distintos países europeos, donde compuso buena parte de su obra. En ***El comienzo de la sabiduría*** explicó de forma introductoria los signos, los planetas y la técnica astrológica.",
      en: "Jewish scholar born in the Iberian Peninsula, he was a poet, biblical commentator, mathematician and astrologer. He travelled through several European countries, where he composed much of his work. In ***The Beginning of Wisdom*** he gave an introductory account of the signs, the planets and astrological technique.",
    },
  },
  {
    nombre: "Alfonso X el Sabio",
    nombreEn: "Alfonso X the Wise",
    fechas: { es: "1221-1284", en: "1221–1284" },
    foto: F("alfonso-x"),
    texto: {
      es: "Rey de Castilla y León, hizo de su corte un gran centro de traducción y conocimiento. Impulsó obras astrológicas como el ***Libro conplido en los iudizios de las estrellas*** y una versión del tratado de Ptolomeo. También promovió las **Tablas alfonsíes** para calcular las posiciones de los astros.",
      en: "King of Castile and León, he made his court a great centre of translation and learning. He promoted astrological works such as the ***Libro conplido en los iudizios de las estrellas*** and a version of Ptolemy's treatise. He also sponsored the **Alfonsine Tables** for calculating the positions of the stars.",
    },
  },
  {
    nombre: "Marsilio Ficino",
    fechas: { es: "1433-1499", en: "1433–1499" },
    foto: F("ficino"),
    texto: {
      es: "Filósofo florentino, sacerdote y traductor de Platón al latín. En ***De vita*** unió filosofía, medicina y astrología. Prestó especial atención a la melancolía de los estudiosos, que asociaba a Saturno. Propuso remedios para equilibrarla mediante las cualidades de otros planetas.",
      en: "Florentine philosopher, priest and translator of Plato into Latin. In ***De vita*** he joined philosophy, medicine and astrology. He paid special attention to the melancholy of scholars, which he associated with Saturn. He proposed remedies to balance it through the qualities of other planets.",
    },
  },
  {
    nombre: "Paracelso",
    nombreEn: "Paracelsus",
    fechas: { es: "1493-1541", en: "1493–1541" },
    foto: F("paracelso"),
    texto: {
      es: "Médico suizo que desafió buena parte de la medicina de su tiempo. En ***Paragranum*** situó la astronomía, estrechamente unida a la interpretación astrológica, entre los cuatro pilares de la medicina. Los otros eran la filosofía, la alquimia y la virtud. Consideraba la influencia de los astros una de las causas de enfermedad.",
      en: "Swiss physician who challenged much of the medicine of his time. In ***Paragranum*** he placed astronomy, closely tied to astrological interpretation, among the four pillars of medicine. The others were philosophy, alchemy and virtue. He considered the influence of the stars one of the causes of illness.",
    },
  },
  {
    nombre: "Girolamo Cardano",
    fechas: { es: "1501-1576", en: "1501–1576" },
    foto: F("cardano"),
    texto: {
      es: "Médico, matemático y astrólogo italiano, conocido por sus aportaciones al álgebra. Reunió e interpretó cartas astrales de personajes destacados. Entre ellas, la de **Eduardo VI de Inglaterra**, a quien pronosticó una larga vida. El rey murió poco después, con 15 años.",
      en: "Italian physician, mathematician and astrologer, known for his contributions to algebra. He collected and interpreted the birth charts of prominent figures. Among them, that of **Edward VI of England**, for whom he predicted a long life. The king died shortly afterwards, aged 15.",
    },
  },
  {
    nombre: "Tycho Brahe",
    fechas: { es: "1546-1601", en: "1546–1601" },
    foto: F("tycho-brahe"),
    texto: {
      es: "Astrónomo danés célebre por la precisión de sus observaciones. Hizo horóscopos para sus mecenas y la familia real. En 1574 defendió la astrología en una conferencia en Copenhague. Creía en la influencia de los astros, pero no que determinara los acontecimientos, y desconfiaba de muchas interpretaciones.",
      en: "Danish astronomer famous for the precision of his observations. He cast horoscopes for his patrons and the royal family. In 1574 he defended astrology in a lecture in Copenhagen. He believed in the influence of the stars, but not that it determined events, and he distrusted many interpretations.",
    },
  },
  {
    nombre: "Galileo Galilei",
    fechas: { es: "1564-1642", en: "1564–1642" },
    foto: F("galileo"),
    texto: {
      es: "Figura clave de la ciencia moderna, revolucionó la observación del cielo con el telescopio. En Padua enseñó a estudiantes de medicina, que aplicaban la astrología al estudio de la enfermedad. También interpretó cartas astrales, entre ellas la de **Cosme II de Médici**. En 1610 le dedicó su descubrimiento de las lunas de Júpiter.",
      en: "A key figure of modern science, he revolutionised the observation of the sky with the telescope. In Padua he taught medical students, who applied astrology to the study of illness. He also interpreted birth charts, among them that of **Cosimo II de' Medici**. In 1610 he dedicated to him his discovery of the moons of Jupiter.",
    },
  },
  {
    nombre: "Johannes Kepler",
    fechas: { es: "1571-1630", en: "1571–1630" },
    foto: F("kepler"),
    texto: {
      es: "Astrónomo alemán que formuló las leyes del movimiento planetario. Levantó cartas astrales, como la del general **Wallenstein** en 1608. Criticó buena parte de la astrología tradicional y quiso reformarla. Pedía no «tirar al niño con el agua del baño»: descartar los errores sin rechazarlo todo.",
      en: "German astronomer who formulated the laws of planetary motion. He cast birth charts, such as that of General **Wallenstein** in 1608. He criticised much of traditional astrology and wanted to reform it. He asked not to «throw out the baby with the bathwater»: to discard the errors without rejecting everything.",
    },
  },
  {
    nombre: "Carl Gustav Jung",
    fechas: { es: "1875-1961", en: "1875–1961" },
    foto: F("jung"),
    texto: {
      es: "Psiquiatra suizo y fundador de la psicología analítica. En 1911 contó a Freud que dedicaba sus tardes a la astrología. La relacionó con el saber psicológico de la Antigüedad y con los arquetipos. En 1947 escribió que solía consultar la carta para tener **otro punto de vista**.",
      en: "Swiss psychiatrist and founder of analytical psychology. In 1911 he told Freud that he spent his afternoons on astrology. He linked it to the psychological knowledge of Antiquity and to the archetypes. In 1947 he wrote that he usually consulted the chart to get **another point of view**.",
    },
  },
];

/**
 * CRÍTICOS de la Astrología: mismo formato que los defensores. Si se vaciara, su bloque enseñaría dos de EJEMPLO
 * («TEMPORAL») para ver el diseño. Fotos en `/img/autores/<nombre>.webp`.
 */
export const CRITICOS_ASTROLOGIA: AutorAstrologia[] = [
  {
    nombre: "Maimónides",
    nombreEn: "Maimonides",
    fechas: { es: "1138-1204", en: "1138–1204" },
    foto: F("maimonides"),
    texto: {
      es: "Rechazó la astrología porque al estudiar astrología judicial vio que se usaba la astrología para defender al acusado. Consideraba estúpido a aquel que se justificaba con las estrellas porque abocaba por la responsabilidad de las personas.",
      en: "He rejected astrology because, when studying judicial astrology, he saw that it was used to defend the accused. He considered anyone who justified himself with the stars to be foolish, because it did away with people's responsibility.",
    },
  },
  {
    nombre: "Cicerón",
    nombreEn: "Cicero",
    fechas: { es: "106-43 a. C.", en: "106–43 BC" },
    foto: F("ciceron"),
    texto: {
      es: "Criticó la astrología porque no encontraba pruebas de que los astros pudieran predecir el futuro. Además, señaló que personas nacidas bajo las mismas estrellas tenían destinos muy diferentes.",
      en: "He criticised astrology because he found no evidence that the stars could predict the future. He also pointed out that people born under the same stars had very different destinies.",
    },
  },
  {
    nombre: "San Agustín",
    nombreEn: "Saint Augustine",
    fechas: { es: "354-430", en: "354–430" },
    foto: F("san-agustin"),
    texto: {
      es: "Rechazó la astrología porque creía que amenazaba el libre albedrío y la responsabilidad moral. Si los astros determinaban nuestras acciones, ¿cómo podía Dios juzgar nuestros pecados?",
      en: "He rejected astrology because he believed it threatened free will and moral responsibility. If the stars determined our actions, how could God judge our sins?",
    },
  },
  {
    nombre: "Giovanni Pico della Mirandola",
    fechas: { es: "1463-1494", en: "1463–1494" },
    foto: F("pico-della-mirandola"),
    texto: {
      es: "Criticó la astrología porque consideraba que sus predicciones eran poco fiables y que los astrólogos se contradecían. También defendía que el ser humano podía decidir su propio destino.",
      en: "He criticised astrology because he considered its predictions unreliable and thought that astrologers contradicted one another. He also argued that human beings could decide their own destiny.",
    },
  },
];
