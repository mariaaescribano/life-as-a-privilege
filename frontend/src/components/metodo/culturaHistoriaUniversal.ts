import type { Vineta } from "./ComicViewer";

// ─────────────────────────────────────────────────────────────────────────
// HISTORIA UNIVERSAL (Cultura) — datos de la línea de tiempo.
//
// DOS NIVELES:
//   1. ERAS  → los círculos de /metodo/cultura/historia/universal. Cada era
//              tiene título + época. Al pulsarla se abre SU PROPIA página
//              (/metodo/cultura/historia/universal/:eraKey) con su mini línea
//              del tiempo.
//   2. SUB-HITOS → los círculos de la página de una era. Cada uno tiene SOLO
//              una frase de título (sin fecha) + una foto redonda. Al pulsarlo
//              se abre su cómic (foto + texto a la derecha) con ComicViewer.
//              La fecha de cada sub-hito se muestra como antetítulo del cómic.
//
// Fotos de los círculos de sub-hito y de las viñetas del cómic (mismo archivo):
//   /recorrido/cultura/historiageneral/<subKey>.png   (todas en la misma carpeta)
// Las PORTADAS de cada era van en la subcarpeta /eras:
//   /recorrido/cultura/historiageneral/eras/<eraKey>.png
// Mientras no exista la foto, el círculo pinta un marcador y el cómic un
// placeholder «próximamente» (el ComicViewer ya lo maneja).
//
// El texto de los cómics se pinta con `separarFrases` (salto de línea tras cada
// punto), así que cada sub-hito guarda su texto como un único párrafo.
// ─────────────────────────────────────────────────────────────────────────

/** Un hito DENTRO de una era (círculo de la mini línea del tiempo). */
export interface SubHito {
  key: string;
  /** Frase de título del círculo (sin fecha). */
  titulo: string;
  /** Foto redonda del círculo (opcional; si falta, se pinta un marcador). */
  foto?: string;
  /** Cómic de este sub-hito (foto + texto). Vacío = aún sin cómic. */
  vinetas: Vineta[];
}

/** Una era de la Historia (círculo de la línea de tiempo principal). */
export interface HitoHistoria {
  key: string;
  /** Título que se muestra junto al círculo. */
  titulo: string;
  /** Año / época que se muestra bajo el título. */
  anio: string;
  /** Foto redonda del círculo (opcional; si falta, se pinta un marcador). */
  foto?: string;
  /** Texto introductorio de la etapa (opcional). Se muestra en su página, sobre
   *  la mini línea del tiempo. */
  intro?: string;
  /** Mini línea del tiempo de la era (sus hitos, cada uno con su cómic). */
  subhitos: SubHito[];
}

// Ruta de la foto (círculo + viñeta) de un sub-hito. Todas viven juntas en la
// misma carpeta, así que la era no interviene en la ruta (se conserva en la
// firma para que cada llamada siga documentando a qué era pertenece el hito).
const foto = (_era: string, sub: string) =>
  `/recorrido/cultura/historiageneral/${sub}.webp`;

// Ruta de la portada (círculo) de una era.
const fotoEra = (eraKey: string) =>
  `/recorrido/cultura/historiageneral/eras/${eraKey}.webp`;

// Construye un sub-hito con su cómic de una sola viñeta (foto + fecha + texto).
const hito = (era: string, key: string, titulo: string, fecha: string, texto: string): SubHito => ({
  key,
  titulo,
  foto: foto(era, key),
  vinetas: [{ src: foto(era, key), eyebrow: fecha, titulo, paragraphs: [texto] }],
});

export const HISTORIA_UNIVERSAL_HITOS: HitoHistoria[] = [
  {
    key: "prehistoria",
    titulo: "Prehistoria",
    anio: "hasta ~3500 a. C.",
    foto: fotoEra("prehistoria"),
    subhitos: [
      hito("prehistoria", "primeros-hominidos", "Primeros homínidos", "Hace 7 millones de años",
        "Hace unos siete millones de años, algunos primates que vivían en África comenzaron a evolucionar por un camino diferente al de los chimpancés. Aquellos seres aún no eran humanos, pero fueron los primeros homínidos, los antepasados de nuestra especie. Con ellos empezó un proceso evolutivo que duraría millones de años y acabaría dando lugar al Homo sapiens."),
      hito("prehistoria", "bipedismo", "Bipedismo", "Hace 6-4 millones de años",
        "Uno de los cambios más importantes fue empezar a caminar sobre dos piernas. Al dejar las manos libres, los homínidos pudieron transportar alimentos, fabricar herramientas y cuidar mejor de sus crías. Además, caminar erguidos les permitía ver por encima de la vegetación y recorrer largas distancias con menos esfuerzo. Esta adaptación fue un paso decisivo hacia la evolución humana."),
      hito("prehistoria", "herramientas-piedra", "Primeras herramientas de piedra", "Hace 2,6 millones de años",
        "Los primeros homínidos comenzaron a tallar piedras para obtener filos con los que cortar carne, romper huesos o trabajar la madera. Eran herramientas muy simples, pero marcaron el nacimiento de la tecnología. A diferencia de otros animales, nuestros antepasados empezaron a modificar su entorno utilizando objetos fabricados por ellos mismos."),
      hito("prehistoria", "dominio-fuego", "Dominio del fuego", "Hace 1 millón-400.000 años",
        "Aprender a controlar el fuego cambió por completo la vida humana. Permitía cocinar los alimentos, haciéndolos más fáciles de digerir, calentarse durante los inviernos y ahuyentar a muchos depredadores. Además, reunirse alrededor del fuego favoreció la convivencia, la comunicación y la transmisión de conocimientos entre generaciones. Muchos científicos creen que este avance contribuyó incluso al desarrollo del cerebro humano."),
      hito("prehistoria", "homo-sapiens", "Aparición del Homo sapiens", "Hace 300.000 años",
        "Hace unos 300.000 años apareció en África el Homo sapiens, nuestra especie. Su mayor ventaja no era la fuerza, sino su extraordinaria capacidad para aprender, cooperar y comunicarse mediante un lenguaje cada vez más complejo. Gracias a ello pudo fabricar mejores herramientas, adaptarse a distintos entornos y, con el tiempo, convertirse en la única especie humana que sobrevivió."),
      hito("prehistoria", "expansion-africa", "Expansión fuera de África", "Hace 70.000-60.000 años",
        "Miles de años después, pequeños grupos de Homo sapiens comenzaron a abandonar África en busca de nuevos territorios. Poco a poco llegaron a Asia, Europa, Oceanía y, finalmente, a América. Durante este viaje se adaptaron a climas tan distintos como desiertos, selvas o regiones heladas. En apenas unos miles de años, los seres humanos habían colonizado casi todo el planeta."),
    ],
  },
  {
    key: "edad-antigua",
    titulo: "Edad Antigua",
    anio: "3500 a. C. – 476 d. C.",
    foto: fotoEra("edad-antigua"),
    subhitos: [
      hito("edad-antigua", "invencion-escritura", "Invención de la escritura", "≈3500 a. C.",
        "Con el crecimiento de las primeras ciudades, ya no bastaba con recordar de memoria impuestos, cosechas o acuerdos comerciales. En Mesopotamia surgió la escritura como una forma de registrar toda esa información en tablillas de arcilla. Con el tiempo también sirvió para escribir leyes, relatos y conocimientos. Por eso, este invento marca el comienzo de la Historia: desde entonces los seres humanos pudieron dejar un testimonio escrito de su pasado."),
      hito("edad-antigua", "ciudades-estado", "Primeras ciudades-Estado", "≈3500-3000 a. C.",
        "A medida que la agricultura producía más alimentos, miles de personas empezaron a concentrarse en un mismo lugar. Así nacieron ciudades como Uruk o Ur, con gobernantes, templos, mercados y leyes propias. Cada ciudad funcionaba como un pequeño país independiente, por eso se conocen como ciudades-Estado. Fue la primera vez que la humanidad vivió en grandes núcleos urbanos organizados."),
      hito("edad-antigua", "unificacion-egipto", "Unificación de Egipto", "≈3100 a. C.",
        "Durante mucho tiempo, Egipto estaba dividido en dos reinos: el Alto Egipto, al sur, y el Bajo Egipto, al norte. Según la tradición, el faraón Menes logró unir ambos territorios bajo un único gobierno. Gracias a la riqueza que proporcionaba el río Nilo, Egipto disfrutó de una estabilidad excepcional durante más de tres mil años. Esa continuidad permitió levantar monumentos impresionantes y desarrollar una de las civilizaciones más duraderas de la historia."),
      hito("edad-antigua", "piramides-guiza", "Pirámides de Guiza", "≈2600-2500 a. C.",
        "Los faraones ordenaron construir enormes pirámides para que sirvieran como sus tumbas y garantizaran su viaje al más allá. Levantar estos monumentos exigía coordinar a miles de trabajadores, arquitectos y artesanos durante años. La Gran Pirámide de Keops fue la construcción más alta del mundo durante casi 4.000 años. Aún hoy sigue siendo una de las Siete Maravillas del Mundo Antiguo que permanece en pie."),
      hito("edad-antigua", "codigo-hammurabi", "Código de Hammurabi", "≈1754 a. C.",
        "En la antigua Babilonia, el rey Hammurabi reunió las leyes de su reino y las mandó grabar en una gran estela de piedra para que todos pudieran conocerlas. Así se evitaba que la justicia dependiera únicamente del criterio de cada gobernante. Su famoso principio del «ojo por ojo, diente por diente» buscaba que el castigo fuera proporcional al delito. Fue uno de los primeros grandes códigos legales de la historia."),
      hito("edad-antigua", "nacimiento-hinduismo", "Nacimiento del hinduismo", "≈1500-500 a. C.",
        "En la India fue tomando forma una compleja tradición religiosa que hoy conocemos como hinduismo. A diferencia de otras religiones, no tuvo un único fundador ni nació en un momento concreto, sino que fue evolucionando durante siglos. Introdujo ideas como el karma, la reencarnación y el dharma, que siguen siendo fundamentales para millones de personas. Actualmente es una de las religiones más antiguas y con más seguidores del mundo."),
      hito("edad-antigua", "invencion-alfabeto", "Invención del alfabeto", "≈1200 a. C.",
        "Hasta entonces, aprender a escribir era muy difícil porque muchos sistemas utilizaban cientos de símbolos distintos. Los fenicios simplificaron ese proceso creando un alfabeto con un número reducido de signos, cada uno asociado a un sonido. Esto facilitó enormemente el comercio y la comunicación entre distintos pueblos. Más tarde, griegos y romanos lo adaptaron y dieron origen a muchos de los alfabetos que usamos hoy."),
      hito("edad-antigua", "imperio-asirio", "Imperio Asirio", "≈911-609 a. C.",
        "Los asirios construyeron uno de los primeros grandes imperios militares de la historia. Su ejército era permanente, estaba muy bien organizado y utilizaba armas de hierro, máquinas de asedio y tácticas innovadoras para conquistar ciudades. Aunque gobernaron con gran dureza, también desarrollaron una administración eficaz que les permitió controlar un enorme territorio. Su forma de hacer la guerra influyó en muchos imperios posteriores."),
      hito("edad-antigua", "imperio-persa", "Imperio Persa", "≈550-330 a. C.",
        "Cuando Ciro el Grande conquistó numerosos pueblos, creó uno de los mayores imperios que el mundo había conocido. En lugar de imponer una única cultura, permitió que muchos pueblos conservaran su religión y sus costumbres mientras pagaran impuestos y obedecieran al rey. Para gobernar un territorio tan inmenso construyeron carreteras, organizaron un eficiente sistema de correos y dividieron el imperio en provincias. Esa organización facilitó el comercio y el control de millones de personas."),
      hito("edad-antigua", "nacimiento-budismo", "Nacimiento del budismo", "≈Siglo VI a. C.",
        "Siddhartha Gautama, un príncipe de la India, abandonó su vida de lujo al descubrir el sufrimiento que existía en el mundo. Tras años de reflexión alcanzó la iluminación y pasó a ser conocido como Buda, «el Iluminado». Enseñó que el sufrimiento podía superarse mediante el autocontrol, la comprensión y el desapego. Sus enseñanzas se difundieron por gran parte de Asia y dieron origen a una de las grandes religiones del mundo."),
      hito("edad-antigua", "democracia-ateniense", "Democracia ateniense", "≈508 a. C.",
        "En Atenas surgió una forma de gobierno muy diferente a las monarquías de la época. Muchos ciudadanos podían reunirse para debatir y votar directamente las leyes de la ciudad. Sin embargo, no todos participaban: mujeres, esclavos y extranjeros quedaban excluidos. Aun con esas limitaciones, fue el primer gran experimento democrático de la historia y una inspiración para las democracias modernas."),
      hito("edad-antigua", "guerras-medicas", "Guerras Médicas", "499-449 a. C.",
        "El poderoso Imperio Persa intentó conquistar las ciudades griegas para ampliar su dominio sobre el Mediterráneo. Aunque Persia tenía un ejército mucho mayor, ciudades como Atenas y Esparta unieron fuerzas para resistir. Sus victorias en batallas como Maratón y Salamina frenaron la expansión persa y permitieron que la cultura griega siguiera desarrollándose. Gracias a ello florecieron la filosofía, el teatro y la ciencia que tanto influirían en la civilización occidental."),
      hito("edad-antigua", "alejandro-magno", "Alejandro Magno", "336-323 a. C.",
        "Con solo veinte años, Alejandro heredó el reino de Macedonia y emprendió una serie de conquistas extraordinarias. En poco más de una década derrotó al Imperio Persa y llegó hasta la India, creando uno de los mayores imperios de la Antigüedad. Aunque murió con apenas treinta y dos años, difundió la lengua y la cultura griegas por todo Oriente. Esa mezcla de culturas dio origen al llamado mundo helenístico, que marcaría la historia durante siglos."),
      hito("edad-antigua", "imperio-maurya", "Fundación del Imperio Maurya", "≈322 a. C.",
        "Mientras Alejandro conquistaba Asia, en la India surgía el primer gran imperio que logró unificar gran parte del subcontinente. Su momento de mayor esplendor llegó con el emperador Aśoka, quien, tras presenciar los horrores de una guerra, renunció a nuevas conquistas y abrazó el budismo. Desde entonces promovió la paz y ayudó a difundir esta religión por gran parte de Asia. Gracias a él, el budismo dejó de ser una creencia local para convertirse en una religión internacional."),
      hito("edad-antigua", "fundacion-roma", "Fundación de Roma", "753 a. C. (tradicionalmente)",
        "Según la leyenda, Roma fue fundada por los hermanos Rómulo y Remo, criados por una loba. Más allá del mito, comenzó siendo una pequeña ciudad a orillas del río Tíber, en un lugar estratégico para el comercio. Con el paso de los siglos fue conquistando a sus vecinos hasta convertirse en la capital de uno de los mayores imperios de la historia. Su lengua, sus leyes y sus costumbres siguen influyendo en el mundo actual."),
      hito("edad-antigua", "republica-romana", "República Romana", "509-27 a. C.",
        "Los romanos expulsaron a su último rey y decidieron que el poder no debía depender de una sola persona. Crearon una república gobernada por magistrados y un Senado, donde las familias más poderosas tomaban las principales decisiones. Gracias a este sistema, Roma fue expandiendo poco a poco su territorio por toda la península itálica y, más tarde, por el Mediterráneo. Muchas instituciones políticas modernas tienen parte de su origen en este modelo."),
      hito("edad-antigua", "imperio-romano", "Imperio Romano", "27 a. C.-476 d. C.",
        "Tras años de guerras civiles, Octavio Augusto se convirtió en el primer emperador de Roma. Bajo el Imperio, Roma alcanzó su máxima extensión, dominando territorios desde Britania hasta Oriente Próximo y el norte de África. Para mantener unido un territorio tan inmenso construyó carreteras, puentes, acueductos y ciudades conectadas por una misma administración y un mismo sistema legal. Su influencia fue tan profunda que todavía hoy hablamos lenguas derivadas del latín y utilizamos principios del derecho romano."),
      hito("edad-antigua", "nacimiento-jesucristo", "Nacimiento de Jesucristo", "≈4-6 a. C.",
        "En la provincia romana de Judea nació Jesús de Nazaret, cuya predicación se centró en el amor al prójimo, el perdón y la esperanza. Sus enseñanzas atrajeron a numerosos seguidores, aunque también despertaron el rechazo de algunas autoridades religiosas y romanas. Tras su muerte, sus discípulos continuaron difundiendo su mensaje. Así nació el cristianismo, una religión que acabaría transformando profundamente la historia de Europa y de buena parte del mundo."),
      hito("edad-antigua", "expansion-cristianismo", "Expansión del cristianismo", "Siglos I-IV",
        "Al principio, los cristianos fueron una pequeña minoría y, en ocasiones, sufrieron persecuciones por negarse a rendir culto al emperador romano. Sin embargo, su número fue creciendo poco a poco por todo el Imperio. En el siglo IV, el emperador Constantino permitió practicar libremente el cristianismo y, pocos años después, se convirtió en la religión oficial del Imperio Romano. Lo que había comenzado como un pequeño movimiento religioso pasó a convertirse en uno de los pilares de la civilización occidental."),
      hito("edad-antigua", "dinastia-han", "Dinastía Han", "206 a. C.-220 d. C.",
        "Mientras Roma dominaba el Mediterráneo, la dinastía Han consolidaba uno de los periodos más brillantes de la historia de China. Sus emperadores organizaron una administración basada en funcionarios elegidos por sus conocimientos y no solo por su origen familiar. También impulsaron el comercio a través de la Ruta de la Seda y favorecieron importantes avances científicos y tecnológicos. Aún hoy, la mayoría de la población china se identifica culturalmente como han."),
      hito("edad-antigua", "invencion-papel", "Invención del papel", "≈105 d. C.",
        "Hasta entonces, escribir resultaba caro y poco práctico porque se utilizaban materiales como bambú, seda o pergamino. En China se desarrolló un nuevo soporte fabricado con fibras vegetales: el papel. Era mucho más ligero, barato y fácil de producir, lo que facilitó la copia de libros y la difusión del conocimiento. Siglos después, este invento llegaría a Europa y cambiaría para siempre la historia de la educación y la cultura."),
      hito("edad-antigua", "caida-roma-occidente", "Caída del Imperio Romano de Occidente", "476 d. C.",
        "Durante siglos, el Imperio Romano sufrió invasiones, crisis económicas, luchas internas y dificultades para defender unas fronteras cada vez más extensas. Finalmente, en el año 476, el último emperador de Occidente fue depuesto por un jefe germano. Aunque el Imperio desapareció en Europa occidental, muchas de sus leyes, su lengua y su cultura sobrevivieron durante siglos. Este acontecimiento suele marcar el final de la Edad Antigua y el comienzo de la Edad Media."),
    ],
  },
  {
    key: "edad-media",
    titulo: "Edad Media",
    anio: "476 – 1453/1492",
    foto: fotoEra("edad-media"),
    subhitos: [
      hito("edad-media", "imperio-bizantino", "Imperio Bizantino", "330-1453",
        "Cuando el Imperio romano se dividió, la parte oriental logró sobrevivir mientras Occidente acabó desapareciendo. Con capital en Constantinopla, el Imperio Bizantino conservó las leyes, la cultura y muchas tradiciones romanas durante casi mil años. Gracias a su posición entre Europa y Asia, se convirtió en un importante centro de comercio y conocimiento. Mientras gran parte de Europa atravesaba siglos de inestabilidad, Bizancio siguió siendo una de las ciudades más ricas y avanzadas del mundo."),
      hito("edad-media", "nacimiento-islam", "Nacimiento del islam", "610-632",
        "A comienzos del siglo VII, Arabia estaba dividida en numerosas tribus que con frecuencia luchaban entre sí. En ese contexto, Mahoma afirmó haber recibido revelaciones de un único Dios, Alá, y comenzó a predicar una nueva religión: el islam. Su mensaje no solo transformó la vida religiosa de los árabes, sino que también logró unir políticamente a muchos de ellos. Tras su muerte, esa unión daría lugar a una de las civilizaciones más influyentes de la historia."),
      hito("edad-media", "expansion-islamica", "Expansión islámica", "Siglos VII-VIII",
        "Después de la muerte de Mahoma, los califas dirigieron una rápida expansión que llevó al mundo islámico desde la península ibérica hasta la India. Sin embargo, su influencia no fue solo militar. En ciudades como Bagdad o Córdoba florecieron la medicina, las matemáticas, la astronomía y la filosofía, conservando además muchos textos griegos y romanos que en Europa se habían perdido. Gracias a ellos, gran parte de ese conocimiento llegaría siglos después al mundo occidental."),
      hito("edad-media", "dinastia-tang", "Dinastía Tang", "618-907",
        "Mientras Europa vivía los primeros siglos de la Edad Media, China atravesaba una de las etapas más brillantes de su historia. La dinastía Tang fortaleció el imperio, impulsó el comercio a través de la Ruta de la Seda y convirtió ciudades como Chang'an en algunas de las más grandes del mundo. También florecieron la poesía, la pintura y numerosos avances tecnológicos. Para muchos historiadores, fue la auténtica edad de oro de la China clásica."),
      hito("edad-media", "carlomagno", "Carlomagno", "800",
        "Tras la caída de Roma, Europa occidental había quedado dividida en numerosos reinos. Carlomagno consiguió conquistar y unir gran parte de esos territorios bajo un mismo gobierno. En el año 800, el papa lo coronó emperador, simbolizando el intento de recuperar la grandeza del antiguo Imperio romano en Occidente. Durante su reinado también impulsó la educación y la copia de libros, ayudando a conservar parte del conocimiento clásico."),
      hito("edad-media", "feudalismo", "Feudalismo", "Siglos IX-XV",
        "Las invasiones de vikingos, magiares y musulmanes, junto con la debilidad de los reyes, hicieron que muchas personas buscaran protección donde podían encontrarla. Los nobles ofrecían seguridad y tierras a cambio de fidelidad y trabajo, creando una red de relaciones entre señores y vasallos. La riqueza ya no dependía tanto del dinero como de la posesión de tierras. Durante siglos, este sistema organizó la política, la economía y la vida cotidiana de casi toda Europa."),
      hito("edad-media", "era-vikinga", "Era vikinga", "793-1066",
        "Procedentes de Escandinavia, los vikingos eran extraordinarios navegantes que construían barcos rápidos y resistentes capaces de recorrer mares y ríos. Al principio fueron conocidos por sus ataques sorpresa contra monasterios y ciudades costeras, pero también comerciaron, fundaron asentamientos y exploraron territorios desconocidos. Llegaron a Islandia, Groenlandia e incluso a América del Norte casi cinco siglos antes que Colón. Su expansión dejó una profunda huella en la historia europea."),
      hito("edad-media", "cisma-oriente", "Cisma de Oriente", "1054",
        "Aunque todos eran cristianos, las iglesias de Oriente y Occidente llevaban siglos acumulando diferencias. Utilizaban idiomas distintos —griego en Oriente y latín en Occidente—, seguían algunas tradiciones diferentes y, sobre todo, discutían sobre quién debía tener la máxima autoridad: el papa de Roma o el patriarca de Constantinopla. En 1054 ambas iglesias se excomulgaron mutuamente y la ruptura se hizo definitiva. Desde entonces existen dos grandes ramas del cristianismo: la Iglesia Católica y la Iglesia Ortodoxa."),
      hito("edad-media", "cruzadas", "Cruzadas", "1096-1291",
        "A finales del siglo XI, el papa pidió a los cristianos europeos que recuperaran Jerusalén y otros lugares sagrados que estaban bajo dominio musulmán. Miles de caballeros, campesinos e incluso niños emprendieron largos viajes hacia Oriente convencidos de que cumplían una misión religiosa. Aunque las Cruzadas no lograron mantener Tierra Santa bajo control cristiano, aumentaron enormemente el contacto entre Europa y el mundo islámico. Gracias a ese intercambio llegaron nuevos productos, conocimientos científicos e incluso técnicas comerciales."),
      hito("edad-media", "fundacion-universidades", "Fundación de las universidades", "Siglos XI-XIII",
        "Con el crecimiento de las ciudades surgió la necesidad de formar juristas, médicos, filósofos y miembros del clero. Así nacieron universidades como Bolonia, París u Oxford, donde profesores y estudiantes se reunían para estudiar y debatir. Las clases se impartían casi siempre en latín, lo que permitía que alumnos de distintos países pudieran aprender juntos. Estas instituciones sentaron las bases de las universidades que conocemos hoy."),
      hito("edad-media", "imperio-mongol", "Imperio Mongol", "Siglo XIII",
        "Gengis Kan consiguió unir a las tribus nómadas de Mongolia y comenzó una expansión que dio lugar al mayor imperio contiguo de la historia. Sus ejércitos conquistaron territorios desde China hasta Europa del Este con una velocidad asombrosa. Aunque sus campañas fueron muy destructivas, también hicieron más seguras muchas rutas comerciales entre Asia y Europa. Gracias a esa estabilidad aumentó el intercambio de mercancías, ideas, inventos e incluso enfermedades."),
      hito("edad-media", "ruta-seda", "La Ruta de la Seda", "Siglos II a. C.-XV",
        "La Ruta de la Seda no era un único camino, sino una enorme red de rutas terrestres y marítimas que conectaba China con Asia Central, Oriente Próximo y Europa. Por ella viajaban seda, especias, porcelana y piedras preciosas, pero también religiones, inventos y conocimientos. Gracias a estas rutas, inventos chinos como el papel llegaron a Occidente. Incluso algunas enfermedades, como la peste, se propagaron siguiendo estos mismos caminos comerciales."),
      hito("edad-media", "peste-negra", "La Peste Negra", "1347-1353",
        "A mediados del siglo XIV, una epidemia de peste bubónica llegó a Europa, probablemente transportada por pulgas que vivían en ratas presentes en barcos mercantes procedentes de Asia. En apenas unos años murió entre un tercio y la mitad de la población europea. La falta de trabajadores obligó a muchos señores feudales a ofrecer mejores condiciones a los campesinos, debilitando poco a poco el sistema feudal. Fue una de las mayores catástrofes demográficas de toda la historia."),
      hito("edad-media", "guerra-cien-anos", "Guerra de los Cien Años", "1337-1453",
        "Los reyes de Inglaterra y Francia llevaban décadas enfrentados por el control de territorios franceses y por el derecho a ocupar el trono. Aunque recibe ese nombre, la guerra duró en realidad 116 años, con largos periodos de tregua. Durante el conflicto apareció la figura de Juana de Arco, cuya participación levantó la moral francesa y cambió el rumbo de la guerra. El enfrentamiento fortaleció las monarquías y marcó el final de la caballería como fuerza dominante en los campos de batalla."),
      hito("edad-media", "caida-constantinopla", "Caída de Constantinopla", "1453",
        "Tras siglos de decadencia, el Imperio Bizantino quedó reducido prácticamente a su capital: Constantinopla. En 1453, el sultán otomano Mehmed II conquistó la ciudad utilizando enormes cañones capaces de derribar sus famosas murallas, consideradas casi inexpugnables durante siglos. Con la caída de Constantinopla desapareció definitivamente el Imperio Bizantino. Además, el control otomano sobre las rutas comerciales hacia Asia impulsó a los europeos a buscar nuevas rutas marítimas, un proceso que pocos años después llevaría al descubrimiento de América."),
    ],
  },
  {
    key: "edad-moderna",
    titulo: "Edad Moderna",
    anio: "1450/1492 – 1789",
    foto: fotoEra("edad-moderna"),
    subhitos: [
      hito("edad-moderna", "imprenta-gutenberg", "La imprenta de Gutenberg", "≈1450",
        "Antes de la imprenta, copiar un libro podía llevar meses o incluso años, ya que se hacía completamente a mano. Johannes Gutenberg perfeccionó un sistema de tipos móviles metálicos que permitió imprimir cientos de copias en mucho menos tiempo y a un coste mucho menor. Los libros dejaron de ser un lujo reservado a monasterios y nobles, y el conocimiento empezó a difundirse por toda Europa. Muchos historiadores consideran este invento tan revolucionario como Internet en nuestra época."),
      hito("edad-moderna", "renacimiento", "Renacimiento", "Siglos XV-XVI",
        "Tras siglos en los que la religión había dominado gran parte del pensamiento europeo, artistas e intelectuales comenzaron a recuperar el interés por la cultura de la antigua Grecia y Roma. El ser humano pasó a ocupar el centro de la reflexión, sin abandonar necesariamente la fe. Figuras como Leonardo da Vinci o Miguel Ángel combinaron arte, ciencia e ingeniería como nunca antes. Fue una época de enorme creatividad que cambió para siempre la forma de entender el conocimiento."),
      hito("edad-moderna", "descubrimiento-america", "Descubrimiento de América", "1492",
        "A finales del siglo XV, los europeos buscaban nuevas rutas para llegar a Asia sin depender de las rutas controladas por los otomanos. Cristóbal Colón creyó que podía alcanzar Oriente navegando hacia el oeste, pero encontró un continente desconocido para los europeos. A partir de ese momento comenzó el contacto permanente entre Europa y América. Este encuentro transformó la alimentación, la economía, las enfermedades, las culturas y el equilibrio de poder mundial."),
      hito("edad-moderna", "primera-vuelta-mundo", "Primera vuelta al mundo", "1519-1522",
        "La expedición dirigida por Fernando de Magallanes partió de España con el objetivo de encontrar una ruta hacia las islas de las especias navegando hacia el oeste. Magallanes murió durante el viaje, pero Juan Sebastián Elcano consiguió regresar con una sola de las cinco naves que habían salido. Era la primera vez que una expedición daba la vuelta completa al planeta. El viaje demostró de forma práctica la verdadera dimensión de la Tierra y confirmó que todos los océanos estaban conectados."),
      hito("edad-moderna", "reforma-protestante", "Reforma Protestante", "1517",
        "A comienzos del siglo XVI, muchas personas criticaban la corrupción de algunos miembros de la Iglesia católica y la venta de indulgencias, documentos que prometían reducir el castigo por los pecados a cambio de dinero. El monje alemán Martín Lutero publicó sus famosas 95 tesis, denunciando estos abusos y defendiendo que la fe debía estar por encima de esas prácticas. Lo que comenzó como una protesta terminó provocando una profunda división del cristianismo occidental. Desde entonces surgieron nuevas iglesias protestantes, como la luterana o la anglicana."),
      hito("edad-moderna", "contrarreforma", "Contrarreforma", "Siglo XVI",
        "La Iglesia católica respondió a la Reforma iniciando un profundo proceso de renovación interna. En el Concilio de Trento revisó algunos abusos, reforzó la formación del clero y reafirmó las principales doctrinas católicas frente al protestantismo. También aparecieron nuevas órdenes religiosas, como los jesuitas, que impulsaron la educación y la evangelización. Europa quedó dividida entre territorios católicos y protestantes durante siglos."),
      hito("edad-moderna", "revolucion-cientifica", "Revolución Científica", "Siglos XVI-XVII",
        "Durante mucho tiempo, muchas explicaciones sobre la naturaleza se aceptaban simplemente porque las habían defendido antiguos filósofos o autoridades religiosas. Poco a poco, científicos de distintos países empezaron a confiar más en la observación, la experimentación y las matemáticas para comprobar si una idea era correcta. Así nació el método científico moderno, basado en las pruebas y no en la autoridad. Esta nueva forma de investigar cambió para siempre la ciencia."),
      hito("edad-moderna", "galileo-galilei", "Galileo Galilei", "Siglo XVII",
        "Galileo fue uno de los primeros científicos en utilizar el telescopio para estudiar el cielo de forma sistemática. Descubrió montañas en la Luna, satélites alrededor de Júpiter y otras observaciones que apoyaban la teoría de que la Tierra gira alrededor del Sol. Estas ideas chocaban con la interpretación oficial de la Iglesia en aquella época, por lo que fue juzgado por la Inquisición y obligado a retractarse públicamente. Hoy se le considera uno de los padres de la ciencia moderna."),
      hito("edad-moderna", "newton-principia", "Isaac Newton y los Principia", "1687",
        "Isaac Newton reunió en un solo libro las leyes que explicaban tanto el movimiento de los objetos en la Tierra como el de los planetas en el espacio. Su teoría de la gravitación universal mostró que las mismas leyes físicas gobiernan todo el universo. Fue una idea revolucionaria porque unificaba fenómenos que hasta entonces parecían independientes. Durante más de dos siglos, su obra fue la base de la física."),
      hito("edad-moderna", "colonizacion-europea", "Colonización europea", "Siglos XVI-XVIII",
        "Tras los grandes viajes de exploración, las potencias europeas comenzaron a establecer colonias en América, África y Asia. Buscaban nuevas tierras, materias primas y rutas comerciales, pero esta expansión también implicó guerras, explotación de las poblaciones indígenas y el desarrollo del comercio de esclavos. Al mismo tiempo, productos como el maíz, la patata o el cacao llegaron a Europa, mientras que caballos, trigo y otras especies viajaron hacia América. El mundo empezó a estar conectado como nunca antes."),
      hito("edad-moderna", "comercio-atlantico", "Comercio atlántico", "Siglos XVI-XVIII",
        "Con el descubrimiento de América, el océano Atlántico sustituyó al Mediterráneo como principal eje del comercio mundial. Cada año cruzaban el océano barcos cargados de metales preciosos, alimentos, tejidos y otras mercancías. También se desarrolló el comercio triangular, en el que millones de africanos fueron esclavizados y transportados a América para trabajar en plantaciones. Este sistema enriqueció a muchas potencias europeas, pero tuvo un enorme coste humano."),
      hito("edad-moderna", "ilustracion", "Ilustración", "Siglo XVIII",
        "Durante el siglo XVIII, muchos pensadores defendieron que la razón y la ciencia debían guiar el progreso de la sociedad. Filósofos como Voltaire, Montesquieu o Rousseau criticaron el absolutismo y defendieron ideas como la libertad, la igualdad ante la ley y la separación de poderes. Sus obras circularon por toda Europa gracias a la imprenta. Estas ideas inspirarían poco después las grandes revoluciones políticas de finales del siglo XVIII."),
      hito("edad-moderna", "maquina-vapor", "Máquina de vapor", "1769",
        "Aunque ya existían modelos anteriores, James Watt consiguió diseñar una máquina de vapor mucho más eficiente. Por primera vez era posible transformar el calor en movimiento de forma continua y aprovechar esa energía para mover máquinas, bombas o vehículos. Este invento redujo la dependencia de la fuerza humana, animal o del agua. Se convirtió en el motor de la Revolución Industrial."),
      hito("edad-moderna", "revolucion-industrial", "Revolución Industrial", "Siglos XVIII-XIX",
        "La invención de nuevas máquinas cambió por completo la forma de fabricar productos. Muchos trabajadores abandonaron los talleres artesanales y comenzaron a trabajar en grandes fábricas, mientras las ciudades crecían rápidamente alrededor de ellas. La producción aumentó de manera espectacular, pero también aparecieron largas jornadas laborales y duras condiciones de trabajo. Fue una transformación económica y social comparable a la revolución digital que vivimos en la actualidad."),
      hito("edad-moderna", "independencia-eeuu", "Independencia de Estados Unidos", "1776",
        "Las trece colonias británicas de Norteamérica estaban cansadas de pagar impuestos al Reino Unido sin tener representación en su Parlamento. Tras varios enfrentamientos, proclamaron su independencia y comenzaron una guerra contra Gran Bretaña. Al vencer, fundaron un nuevo país basado en una constitución y en principios como la separación de poderes y los derechos de los ciudadanos. Su éxito demostró que era posible romper con una monarquía y crear una república moderna."),
      hito("edad-moderna", "revolucion-francesa", "Revolución Francesa", "1789",
        "Francia atravesaba una grave crisis económica mientras la nobleza y el clero conservaban numerosos privilegios que el resto de la población no tenía. El descontento estalló cuando el pueblo tomó la prisión de la Bastilla, símbolo del poder absoluto del rey. La Revolución acabó con el Antiguo Régimen y proclamó ideales como la libertad, la igualdad y la fraternidad. Sus consecuencias se extendieron por toda Europa y marcan tradicionalmente el inicio de la Edad Contemporánea."),
    ],
  },
  {
    key: "era-industrial",
    titulo: "Era Industrial",
    anio: "1789 – 1945",
    foto: fotoEra("era-industrial"),
    subhitos: [
      hito("era-industrial", "guerras-napoleonicas", "Guerras Napoleónicas", "1803-1815",
        "Tras la Revolución Francesa, muchos reyes europeos temían que las ideas de libertad e igualdad se extendieran a sus propios países. En ese contexto, Napoleón Bonaparte tomó el poder en Francia y lanzó una serie de campañas militares que le permitieron dominar gran parte de Europa. Allí donde llegaban sus ejércitos también se difundían muchas de las reformas nacidas de la Revolución. Aunque Napoleón fue derrotado en Waterloo, el nacionalismo y las ideas liberales que había extendido siguieron transformando Europa."),
      hito("era-industrial", "independencias-hispanoamerica", "Independencias de Hispanoamérica", "1808-1826",
        "La invasión napoleónica de España debilitó enormemente a la monarquía española. Aprovechando esa situación, muchas colonias americanas iniciaron movimientos para gobernarse por sí mismas. Líderes como Simón Bolívar o José de San Martín dirigieron las guerras de independencia que dieron origen a numerosos países de América Latina. El enorme imperio español en América prácticamente desapareció en apenas dos décadas."),
      hito("era-industrial", "ferrocarril", "Ferrocarril", "Siglo XIX",
        "La máquina de vapor encontró una de sus aplicaciones más revolucionarias en el ferrocarril. Por primera vez era posible transportar personas y mercancías de forma rápida, barata y durante todo el año, sin depender de caballos o barcos. Las ciudades crecieron alrededor de las estaciones y el comercio se multiplicó. El mundo comenzó a hacerse mucho más pequeño porque las distancias parecían reducirse."),
      hito("era-industrial", "electricidad", "Electricidad", "Siglos XIX-XX",
        "Durante siglos, la actividad humana dependía casi por completo de la luz del Sol. El desarrollo de la electricidad permitió iluminar calles y hogares, mover fábricas mediante motores eléctricos y hacer funcionar una enorme variedad de inventos. Poco a poco transformó la industria, las comunicaciones y la vida cotidiana. La noche dejó de marcar el final de la jornada para millones de personas."),
      hito("era-industrial", "telegrafo", "Telégrafo", "1837",
        "Antes del telégrafo, un mensaje solo podía viajar tan rápido como una persona, un caballo o un barco. Gracias a los impulsos eléctricos enviados por cables, la información empezó a recorrer enormes distancias en cuestión de minutos. Gobiernos, empresas y periódicos pudieron comunicarse casi al instante. Fue el primer gran paso hacia el mundo hiperconectado en el que vivimos hoy."),
      hito("era-industrial", "teoria-evolucion", "Teoría de la evolución", "1859",
        "Hasta el siglo XIX, muchas personas creían que las especies habían permanecido siempre iguales. Charles Darwin propuso que todos los seres vivos evolucionan lentamente mediante un proceso llamado selección natural, en el que los individuos mejor adaptados tienen más posibilidades de sobrevivir y reproducirse. Su teoría revolucionó la biología y cambió nuestra forma de entender el origen y la diversidad de la vida. Hoy sigue siendo uno de los pilares de la ciencia."),
      hito("era-industrial", "telefono", "Teléfono", "1876",
        "Si el telégrafo permitía enviar mensajes escritos, el teléfono hizo posible escuchar la voz de otra persona a cientos o miles de kilómetros de distancia. La comunicación pasó a ser inmediata y mucho más personal. En pocas décadas, hogares, empresas y administraciones comenzaron a conectarse mediante redes telefónicas. Fue uno de los inventos que más redujo las distancias entre las personas."),
      hito("era-industrial", "segunda-revolucion-industrial", "Segunda Revolución Industrial", "1870-1914",
        "A finales del siglo XIX apareció una nueva oleada de innovaciones impulsadas por la electricidad, el acero, el petróleo y la química. Surgieron industrias capaces de producir bienes a una escala nunca vista y nacieron grandes empresas que transformaron la economía mundial. También mejoraron el transporte y las comunicaciones, acelerando todavía más el crecimiento industrial. El ritmo del progreso tecnológico empezó a aumentar como nunca antes."),
      hito("era-industrial", "motor-combustion", "Motor de combustión", "Finales del siglo XIX",
        "Los motores de gasolina y diésel permitieron construir vehículos mucho más ligeros y prácticos que las máquinas de vapor. Gracias a ellos aparecieron los primeros automóviles modernos, camiones, tractores y, más tarde, aviones. La movilidad dejó de depender del caballo o del tren. La forma de viajar, trabajar y transportar mercancías cambió por completo."),
      hito("era-industrial", "radio", "Radio", "Finales del siglo XIX - principios del XX",
        "Por primera vez, la información podía transmitirse sin necesidad de cables. La radio permitió que millones de personas escucharan al mismo tiempo noticias, música o discursos desde cualquier lugar. Los gobiernos descubrieron una poderosa herramienta para informar... y también para hacer propaganda. Había nacido la comunicación de masas."),
      hito("era-industrial", "vacunas-modernas", "Vacunas modernas", "Siglos XIX-XX",
        "A medida que avanzaba la medicina, los científicos desarrollaron vacunas capaces de prevenir enfermedades que durante siglos habían causado millones de muertes. En lugar de esperar a que apareciera la enfermedad para tratarla, ahora era posible evitarla. Gracias a ello aumentó la esperanza de vida y disminuyó enormemente la mortalidad infantil. La prevención se convirtió en una parte esencial de la medicina."),
      hito("era-industrial", "avion", "Avión", "1903",
        "Los hermanos Wright consiguieron realizar el primer vuelo controlado y sostenido de un avión con motor. Aquel vuelo apenas duró unos segundos, pero demostró que el ser humano podía volar utilizando máquinas más pesadas que el aire. En pocas décadas los aviones se utilizarían para transportar pasajeros, mercancías e incluso en las guerras. El planeta quedó unido por rutas aéreas."),
      hito("era-industrial", "primera-guerra-mundial", "Primera Guerra Mundial", "1914-1918",
        "Europa llevaba años acumulando tensiones por rivalidades económicas, coloniales y nacionalistas. El asesinato del archiduque Francisco Fernando de Austria fue la chispa que desencadenó un conflicto que implicó a las principales potencias mundiales. La guerra introdujo armas como los tanques, las ametralladoras y los gases tóxicos, provocando una destrucción sin precedentes. Al terminar desaparecieron grandes imperios como el alemán, el austrohúngaro, el ruso y el otomano."),
      hito("era-industrial", "revolucion-rusa", "Revolución Rusa", "1917",
        "Mientras Rusia sufría las consecuencias de la Primera Guerra Mundial, el hambre, la pobreza y el descontento provocaron una revolución contra el zar. Los bolcheviques, dirigidos por Lenin, tomaron el poder con la promesa de construir una sociedad comunista basada en la igualdad económica. Poco después nació la Unión Soviética, el primer gran Estado comunista del mundo. Durante gran parte del siglo XX, el comunismo y el capitalismo competirían por la influencia mundial."),
      hito("era-industrial", "penicilina", "Penicilina", "1928",
        "Alexander Fleming observó por casualidad que un moho había impedido crecer a unas bacterias en su laboratorio. A partir de ese descubrimiento se desarrolló la penicilina, el primer antibiótico utilizado de forma masiva. Enfermedades que antes eran mortales pasaron a poder curarse con relativa facilidad. La medicina dio uno de los mayores saltos de toda su historia."),
      hito("era-industrial", "gran-depresion", "Gran Depresión", "1929",
        "En octubre de 1929 se desplomó la Bolsa de Nueva York, desencadenando una crisis económica que rápidamente se extendió por gran parte del mundo. Miles de empresas quebraron y millones de personas perdieron su empleo y sus ahorros. La desesperación favoreció el auge de movimientos políticos extremistas en varios países. Sus consecuencias serían decisivas en los años que precedieron a la Segunda Guerra Mundial."),
      hito("era-industrial", "nazismo-fascismo", "Nazismo y fascismo", "Décadas de 1920 y 1930",
        "La crisis económica, el descontento social y el deseo de recuperar el prestigio nacional facilitaron la llegada al poder de regímenes totalitarios en países como Italia y Alemania. El fascismo de Mussolini y el nazismo de Hitler defendían un Estado autoritario, rechazaban la democracia y utilizaban una intensa propaganda para controlar a la población. En el caso del nazismo, además, se promovió una ideología racista y antisemita que acabaría teniendo consecuencias terribles. Estas dictaduras empujaron al mundo hacia una nueva guerra."),
      hito("era-industrial", "segunda-guerra-mundial", "Segunda Guerra Mundial", "1939-1945",
        "La invasión alemana de Polonia marcó el comienzo del conflicto más devastador de la historia. Durante seis años se combatió en Europa, África, Asia y el océano Pacífico, implicando a decenas de países. La guerra impulsó enormes avances tecnológicos, pero también provocó un nivel de destrucción y sufrimiento nunca visto. Al terminar, Europa quedó devastada y Estados Unidos y la Unión Soviética emergieron como las dos grandes superpotencias."),
      hito("era-industrial", "holocausto", "Holocausto", "1941-1945",
        "Durante la Segunda Guerra Mundial, el régimen nazi llevó a cabo el exterminio sistemático de seis millones de judíos, además de millones de personas perseguidas por motivos políticos, étnicos, religiosos o sociales. Para ello creó guetos, campos de concentración y campos de exterminio donde se asesinó de forma organizada a millones de víctimas. El Holocausto se convirtió en el mayor símbolo de hasta dónde pueden llegar el odio, el racismo y el totalitarismo. Su recuerdo sigue siendo una advertencia para toda la humanidad."),
      hito("era-industrial", "bomba-atomica", "Bomba atómica", "1945",
        "En los últimos días de la guerra, Estados Unidos lanzó dos bombas atómicas sobre las ciudades japonesas de Hiroshima y Nagasaki. Nunca antes una sola arma había causado una destrucción tan enorme en tan poco tiempo. Japón se rindió pocos días después, poniendo fin a la Segunda Guerra Mundial. Al mismo tiempo comenzó la era nuclear, en la que la humanidad adquirió por primera vez la capacidad de destruirse a sí misma."),
    ],
  },
  {
    key: "era-digital",
    titulo: "Era Global y Digital",
    anio: "1945 – presente",
    foto: fotoEra("era-digital"),
    subhitos: [
      hito("era-digital", "fundacion-onu", "Fundación de la ONU", "1945",
        "Tras la devastación de la Segunda Guerra Mundial, muchos países llegaron a la conclusión de que era necesario crear un organismo internacional que ayudara a evitar nuevos conflictos. Así nació la Organización de las Naciones Unidas (ONU), un lugar donde los Estados pudieran dialogar antes de recurrir a la guerra. Además de trabajar por la paz, la ONU promueve la cooperación en ámbitos como los derechos humanos, la salud o la ayuda humanitaria. Aunque no ha conseguido impedir todas las guerras, sigue siendo la principal organización internacional del mundo."),
      hito("era-digital", "guerra-fria", "Guerra Fría", "1947-1991",
        "Después de la Segunda Guerra Mundial, Estados Unidos y la Unión Soviética se convirtieron en las dos grandes superpotencias. Representaban sistemas muy distintos: el capitalismo y la democracia liberal frente al comunismo y el partido único. Aunque nunca llegaron a enfrentarse directamente en una guerra abierta por el riesgo de una guerra nuclear, compitieron en todos los ámbitos: armamento, economía, influencia política, deporte, ciencia e incluso exploración espacial. El mundo quedó dividido en dos grandes bloques durante más de cuarenta años."),
      hito("era-digital", "descolonizacion", "Descolonización", "1945-1975",
        "Tras la Segunda Guerra Mundial, los grandes imperios coloniales europeos comenzaron a debilitarse. Muchas colonias de Asia y África reclamaron el derecho a gobernarse por sí mismas y lograron la independencia, a veces mediante negociaciones y otras tras largas guerras. En apenas unas décadas aparecieron decenas de nuevos países. El mapa político del mundo cambió por completo y Europa dejó de dominar gran parte del planeta."),
      hito("era-digital", "carrera-espacial", "Carrera espacial", "1957-1975",
        "La rivalidad entre Estados Unidos y la Unión Soviética también llegó al espacio. Todo comenzó cuando los soviéticos lanzaron el Sputnik, el primer satélite artificial de la historia, sorprendiendo al mundo. A partir de entonces ambos países compitieron por conseguir nuevos hitos: enviar animales, poner al primer ser humano en órbita y llegar a la Luna. Más allá del prestigio político, esta competición impulsó enormes avances científicos y tecnológicos que aún utilizamos hoy."),
      hito("era-digital", "llegada-luna", "Llegada a la Luna", "1969",
        "El 20 de julio de 1969, la misión Apolo 11 consiguió que el ser humano caminara por primera vez sobre la superficie de la Luna. Neil Armstrong pronunció la famosa frase: «Es un pequeño paso para un hombre, pero un gran salto para la humanidad.» El acontecimiento fue seguido por cientos de millones de personas en televisión y simbolizó la victoria estadounidense en la carrera espacial. Sigue siendo uno de los mayores logros tecnológicos de la historia."),
      hito("era-digital", "microprocesador", "Microprocesador", "1971",
        "Hasta entonces, los ordenadores ocupaban habitaciones enteras y estaban formados por miles de componentes. La invención del microprocesador permitió concentrar toda la unidad de procesamiento en un pequeño chip de silicio. Gracias a ello los ordenadores pudieron hacerse mucho más pequeños, baratos y potentes. Este invento hizo posibles los ordenadores personales, los teléfonos móviles y prácticamente toda la electrónica moderna."),
      hito("era-digital", "internet", "Internet", "Décadas de 1970-1990",
        "Internet nació como una red que permitía conectar ordenadores situados en distintos lugares del mundo para compartir información. Con el paso de los años fue creciendo hasta convertirse en una enorme red global. Por primera vez era posible enviar mensajes, compartir archivos o acceder a información casi al instante desde cualquier lugar conectado. La forma de comunicarnos, trabajar y aprender cambió para siempre."),
      hito("era-digital", "caida-muro-berlin", "Caída del Muro de Berlín", "1989",
        "Tras la Segunda Guerra Mundial, Alemania quedó dividida en dos países y Berlín fue separada por un muro que impedía el paso entre el este comunista y el oeste democrático. Durante casi treinta años, el muro simbolizó la división del mundo en dos bloques enfrentados. En 1989, las protestas ciudadanas y el debilitamiento de la Unión Soviética llevaron a su apertura. Las imágenes de miles de personas derribando el muro se convirtieron en el símbolo del final de la Guerra Fría."),
      hito("era-digital", "disolucion-urss", "Disolución de la URSS", "1991",
        "Las dificultades económicas, las reformas políticas y el creciente deseo de independencia de varias repúblicas provocaron la desaparición de la Unión Soviética. Tras casi setenta años de existencia, el mayor Estado comunista del mundo dejó de existir y fue sustituido por quince países independientes, entre ellos Rusia, Ucrania y Kazajistán. Con este acontecimiento terminó oficialmente la Guerra Fría. Estados Unidos quedó como la principal superpotencia mundial."),
      hito("era-digital", "world-wide-web", "World Wide Web", "1991",
        "Aunque Internet ya existía, su uso estaba reservado sobre todo a universidades y centros de investigación. El científico británico Tim Berners-Lee creó la World Wide Web, un sistema de páginas enlazadas mediante hipervínculos que hizo la navegación mucho más sencilla. Gracias a ello cualquier persona podía acceder a información con solo hacer clic en un enlace. Es importante no confundir ambos conceptos: Internet es la red y la Web es uno de los servicios que funciona sobre ella, igual que el correo electrónico."),
      hito("era-digital", "globalizacion", "Globalización", "Finales del siglo XX",
        "Los avances en el transporte y las comunicaciones hicieron que el mundo estuviera más conectado que nunca. Empresas, personas, mercancías, capitales e información comenzaron a moverse entre países con una rapidez sin precedentes. Hoy un producto puede diseñarse en un continente, fabricarse en otro y venderse en todo el planeta. La economía mundial pasó a funcionar como un sistema cada vez más interdependiente."),
      hito("era-digital", "genoma-humano", "Proyecto Genoma Humano", "1990-2003",
        "Durante más de una década, científicos de numerosos países colaboraron para descifrar la mayor parte del ADN humano, es decir, las instrucciones biológicas que contienen nuestras células. Comprender ese «manual de funcionamiento» abrió nuevas posibilidades para diagnosticar enfermedades, desarrollar tratamientos y estudiar la evolución humana. Fue uno de los mayores proyectos científicos internacionales de la historia. Marcó el comienzo de una nueva era para la genética y la medicina."),
      hito("era-digital", "atentados-11s", "Atentados del 11-S", "2001",
        "El 11 de septiembre de 2001, miembros del grupo terrorista Al Qaeda secuestraron cuatro aviones comerciales en Estados Unidos. Dos de ellos impactaron contra las Torres Gemelas de Nueva York, otro contra el Pentágono y un cuarto se estrelló en Pensilvania tras la intervención de los pasajeros. Los atentados causaron miles de muertos y conmocionaron al mundo. Como respuesta, Estados Unidos inició la llamada guerra contra el terrorismo, que marcaría gran parte de la política internacional del siglo XXI."),
      hito("era-digital", "smartphones", "Smartphones", "Desde 2007",
        "Aunque ya existían teléfonos móviles, la llegada de los smartphones popularizó dispositivos capaces de combinar teléfono, cámara, GPS, navegador de Internet y miles de aplicaciones en un solo aparato. Millones de personas pasaron a llevar un auténtico ordenador en el bolsillo. Esto cambió la forma de comunicarnos, trabajar, estudiar y acceder a la información. Hoy son una de las tecnologías más utilizadas del mundo."),
      hito("era-digital", "redes-sociales", "Redes sociales", "Desde la década de 2000",
        "Con la expansión de Internet aparecieron plataformas que permitían a cualquier persona crear y compartir contenido con millones de usuarios. La información comenzó a difundirse en cuestión de segundos, sin depender únicamente de periódicos o televisiones. Las redes sociales transformaron la comunicación, el entretenimiento, la política e incluso la forma en que nos relacionamos. También plantearon nuevos desafíos, como la desinformación o la protección de la privacidad."),
      hito("era-digital", "crisis-2008", "Crisis financiera de 2008", "2008",
        "Durante años, muchos bancos concedieron hipotecas de alto riesgo y realizaron inversiones cada vez más arriesgadas. Cuando millones de personas dejaron de poder pagar sus préstamos, el sistema financiero empezó a colapsar. La quiebra del banco Lehman Brothers desencadenó una crisis que se extendió rápidamente por todo el mundo. Millones de personas perdieron su empleo y quedó claro hasta qué punto las economías de los distintos países estaban conectadas."),
      hito("era-digital", "covid-19", "COVID-19", "2020",
        "A comienzos de 2020, un nuevo coronavirus se propagó rápidamente por todo el planeta y fue declarado pandemia por la Organización Mundial de la Salud. Muchos países cerraron fronteras, decretaron confinamientos y limitaron la actividad económica para frenar los contagios. Al mismo tiempo, la comunidad científica desarrolló vacunas en un tiempo récord gracias a la colaboración internacional. La pandemia aceleró el teletrabajo, la digitalización y cambió numerosos hábitos sociales."),
      hito("era-digital", "ia-generativa", "Inteligencia artificial generativa", "Desde 2022",
        "Aunque la inteligencia artificial llevaba décadas desarrollándose, a partir de 2022 comenzaron a popularizarse sistemas capaces de generar texto, imágenes, música, código y otros contenidos con una calidad sorprendente. Estas herramientas ya están transformando la educación, la programación, la investigación, el diseño y muchas otras profesiones. Al igual que ocurrió con la imprenta, la máquina de vapor o Internet, muchos expertos consideran que estamos viviendo el comienzo de una nueva revolución tecnológica. Su impacto definitivo todavía está por escribirse."),
    ],
  },
];
