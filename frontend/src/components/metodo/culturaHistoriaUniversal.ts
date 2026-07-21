import type { Vineta } from "./ComicViewer";

// ─────────────────────────────────────────────────────────────────────────
// HISTORIA UNIVERSAL (Cultura) — datos de la línea de tiempo.
//
// Cada "hito" es un círculo de la línea de tiempo (con foto, título y año) y,
// al pulsarlo, abre SU PROPIO cómic (vinetas), con el estilo de Cultura.
//
// Los hitos de abajo son de EJEMPLO (las grandes edades de la Historia) para ver
// el diseño; sustitúyelos por los definitivos. Fotos del círculo en
// /img/cultura/historia/universal/<key>.png y viñetas del cómic en
// /viñetas/cultura/historiauniversal/<key>/…  (todo pendiente de momento).
// ─────────────────────────────────────────────────────────────────────────

export interface HitoHistoria {
  key: string;
  /** Título que se muestra junto al círculo. */
  titulo: string;
  /** Año / época que se muestra bajo el título. */
  anio: string;
  /** Foto redonda del círculo (opcional; si falta, se pinta un marcador). */
  foto?: string;
  /** Cómic de este hito (se abre al pulsar el círculo). */
  vinetas: Vineta[];
}

export const HISTORIA_UNIVERSAL_HITOS: HitoHistoria[] = [
  {
    key: "prehistoria",
    titulo: "Prehistoria",
    anio: "hasta 10 000 a.C.",
    foto: "/img/cultura/historia/universal/prehistoria.png",
    // Cómic 1 · fotos en /recorrido/cultura/historiaUniversal/comic1/comic11…comic14.png
    vinetas: [
      {
        src: "/recorrido/cultura/historiaUniversal/comic1/comic11.png",
        titulo: "Primeros homínidos",
        paragraphs: [
          "Durante millones de años el ser humano caminó a gachas.",
          "Al levantarse sobre dos piernas, sus manos quedaron libres para explorar.",
          "Con el tiempo, el cerebro creció y las caderas se adaptaron para dar a luz a bebés con cerebros cada vez mayores.",
          "Cada paso cambió la evolución.",
        ],
      },
      {
        src: "/recorrido/cultura/historiaUniversal/comic1/comic12.png",
        titulo: "Homo habilis",
        paragraphs: [
          "Con sus manos comenzaron a crear herramientas de piedra. Pero el mayor avance no fue fabricarlas, sino enseñar a otros cómo hacerlo.",
          "Por primera vez, el conocimiento empezó a sobrevivir a quien lo descubría.",
          "La humanidad comenzó a dejar legado, de esta forma, los siguientes serían capaces de ir más allá.",
        ],
      },
      {
        src: "/recorrido/cultura/historiaUniversal/comic1/comic13.png",
        titulo: "Homo erectus",
        paragraphs: [
          "Descubrieron el fuego.",
          "Cocinar hizo los alimentos más seguros y fáciles de digerir, redujo muchos riesgos asociados a alimentos crudos y permitió obtener más energía.",
          "También era símbolo de familia y protección, pues se reunían al anochecer, protegidos alrededor de una llama.",
        ],
      },
      {
        src: "/recorrido/cultura/historiaUniversal/comic1/comic14.png",
        titulo: "Homo sapiens",
        paragraphs: [
          "El ser humano aprendió a contar historias.",
          "Hablaban de quién ayudaba, quién engañaba, dónde había comida o qué tribu era fiable.",
          "Ese intercambio constante de información permitió cooperar con muchas más personas que cualquier otra especie.",
          "Las palabras y las historias construyeron las primeras alianzas.",
        ],
      },
    ],
  },
  {
    key: "revolucion-agricola",
    titulo: "Revolución Agrícola",
    anio: "≈10 000 a.C.",
    foto: "/img/cultura/historia/universal/revolucion-agricola.png",
    // Cómic 2 · fotos en /recorrido/cultura/historiaUniversal/comic2/comic21…comic23.png
    // (sin títulos de viñeta, solo texto).
    vinetas: [
      {
        src: "/recorrido/cultura/historiaUniversal/comic2/comic21.png",
        paragraphs: [
          "Durante miles de años, los seres humanos vivieron como cazadores-recolectores.",
          "Seguían el ritmo de las estaciones y se desplazaban con largas caminatas allí donde la naturaleza ofrecía alimento.",
          "El bipedismo fue una ventaja biológica.",
          "La dieta era variada: frutos, raíces, verduras y semillas a diario, peces y carne solo cuando era posible.",
          "Observaron los ciclos de la naturaleza aprendiendo así a sobrevivir.",
          "Nacieron los primeros mitos y leyendas.",
        ],
      },
      {
        src: "/recorrido/cultura/historiaUniversal/comic2/comic22.png",
        paragraphs: [
          "Hace unos 12.000 años, algunos grupos comenzaron a cultivar la tierra y domesticar animales.",
          "Por primera vez, era posible producir alimentos de forma constante y almacenar excedentes.",
          "Dejaron de ser nómadas y surgieron los primeros asentamientos permanentes, que con el tiempo crecerían hasta convertirse en pueblos y ciudades.",
        ],
      },
      {
        src: "/recorrido/cultura/historiaUniversal/comic2/comic23.png",
        paragraphs: [
          "La agricultura permitió alimentar a muchas más personas, pero también transformó profundamente la sociedad.",
          "Con la propiedad de la tierra, la herencia y la acumulación de riqueza aparecieron diferencias sociales cada vez más marcadas.",
          "Muchos historiadores consideran que estos cambios también contribuyeron a limitar la posición social de las mujeres.",
        ],
      },
    ],
  },
  {
    key: "aldeas-imperios",
    titulo: "De las aldeas a los imperios",
    anio: "≈3300 a.C.",
    foto: "/img/cultura/historia/universal/aldeas-imperios.png",
    // Cómic 3 · fotos en /recorrido/cultura/historiaUniversal/comic3/comic31…comic35.png
    vinetas: [
      {
        src: "/recorrido/cultura/historiaUniversal/comic3/comic31.png",
        titulo: "Las primeras ciudades",
        paragraphs: [
          "Cuando la agricultura produjo excedentes, las aldeas comenzaron a crecer. Cada vez vivían más personas en un mismo lugar y ya no bastaba con conocerse personalmente para resolver los problemas del día a día.",
          "La convivencia exigía nuevas formas de organización. Aparecieron jefes, sacerdotes y especialistas encargados de tomar decisiones, repartir recursos y coordinar el trabajo de la comunidad.",
          "Por primera vez, el poder dejó de depender únicamente de la fuerza física y comenzó a apoyarse en la organización.",
        ],
      },
      {
        src: "/recorrido/cultura/historiaUniversal/comic3/comic32.png",
        titulo: "La escritura y el nacimiento del Estado",
        paragraphs: [
          "A medida que crecían el comercio y la población, la memoria humana ya no era suficiente. Era necesario registrar quién poseía la tierra, cuánto grano se almacenaba, qué impuestos debía pagar cada familia o qué acuerdos se habían firmado.",
          "La escritura nació como una herramienta práctica para administrar sociedades cada vez más complejas. Gracias a ella aparecieron leyes, censos, registros y una burocracia capaz de gobernar miles de personas.",
          "El verdadero poder ya no estaba solo en los ejércitos, sino también en la información.",
        ],
      },
      {
        src: "/recorrido/cultura/historiaUniversal/comic3/comic33.png",
        titulo: "Religión y legitimidad",
        paragraphs: [
          "Las primeras grandes civilizaciones eran politeístas y cada ciudad rendía culto a diferentes dioses relacionados con la naturaleza, la guerra o la fertilidad.",
          "Los gobernantes solían presentar su autoridad como parte de un orden sagrado. Obedecer al rey o al faraón significaba también respetar el equilibrio establecido por los dioses, reforzando la cohesión de la comunidad.",
          "Con el paso de los siglos surgieron tradiciones monoteístas. Estas ofrecieron una identidad común basada en un único Dios, capaz de unir bajo el mandato del miedo y el castigo a comunidades mucho más amplias y diversas.",
        ],
      },
      {
        src: "/recorrido/cultura/historiaUniversal/comic3/comic34.png",
        titulo: "Los primeros imperios",
        paragraphs: [
          "Algunas ciudades crecieron hasta dominar vastos territorios y millones de habitantes. Administrar espacios tan grandes requería mucho más que un ejército.",
          "Fue necesario construir carreteras, crear funcionarios, establecer leyes comunes, recaudar impuestos y desarrollar instituciones capaces de mantener unido el imperio incluso cuando el gobernante estaba lejos.",
          "La estabilidad dependía de que millones de personas confiaran en un mismo sistema de normas y autoridad. Bajo tales demandas, lo más eficiente era el miedo y el castigo para controlar.",
        ],
      },
      {
        src: "/recorrido/cultura/historiaUniversal/comic3/comic35.png",
        titulo: "El gran invento invisible",
        paragraphs: [
          "Las pirámides, los templos y las murallas fueron impresionantes, pero no fueron el mayor logro de aquellas civilizaciones.",
          "Su verdadera innovación fue crear sistemas de cooperación que permitieron a personas desconocidas trabajar juntas durante generaciones. Las leyes, la escritura, las instituciones y las creencias compartidas hicieron posible construir sociedades de una escala nunca vista.",
        ],
      },
    ],
  },
  {
    key: "civilizaciones",
    titulo: "Las civilizaciones que cambiaron el mundo",
    anio: "≈3000 a.C.",
    foto: "/img/cultura/historia/universal/civilizaciones.png",
    // Cómic 4 · fotos en /recorrido/cultura/historiaUniversal/comic4/comic41…comic44.png
    vinetas: [
      {
        src: "/recorrido/cultura/historiaUniversal/comic4/comic41.png",
        titulo: "El nacimiento de las grandes civilizaciones",
        paragraphs: [
          "Después de la Revolución Agrícola, las ciudades comenzaron a crecer en diferentes regiones del planeta. Aunque estaban separadas por miles de kilómetros y apenas tenían contacto entre sí, muchas se enfrentaron al mismo desafío: gobernar poblaciones cada vez más numerosas y garantizar su supervivencia.",
          "Cada una encontró respuestas distintas. Algunas destacaron por su capacidad para organizar enormes territorios, otras por crear leyes, otras por desarrollar nuevas formas de pensar.",
          "La historia de la civilización no pertenece a un solo pueblo, sino al esfuerzo colectivo de muchas culturas.",
        ],
      },
      {
        src: "/recorrido/cultura/historiaUniversal/comic4/comic42.png",
        titulo: "Egipto y Mesopotamia: aprender a organizar una civilización",
        paragraphs: [
          "En Egipto, las crecidas regulares del río Nilo permitieron planificar la agricultura y sostener una sociedad estable durante miles de años. Para administrar ese territorio fueron necesarios escribas, ingenieros, médicos, arquitectos y una administración sorprendentemente eficiente para su época.",
          "Mientras tanto, entre los ríos Tigris y Éufrates surgieron las primeras grandes ciudades de Mesopotamia. Allí nacieron la escritura cuneiforme y algunos de los primeros códigos legales, herramientas que permitieron registrar impuestos, controlar el comercio y aplicar normas comunes a miles de personas.",
          "Ambas civilizaciones demostraron que una sociedad no podía crecer solo gracias a la fuerza: necesitaba organización, conocimiento y reglas compartidas.",
        ],
      },
      {
        src: "/recorrido/cultura/historiaUniversal/comic4/comic43.png",
        titulo: "India: comprender el mundo interior",
        paragraphs: [
          "Mientras otras civilizaciones centraban gran parte de sus esfuerzos en construir Estados o expandir territorios, en la India florecieron profundas tradiciones filosóficas y espirituales.",
          "Corrientes como el hinduismo, el budismo y el jainismo intentaron responder preguntas universales: ¿por qué sufrimos?, ¿qué significa vivir bien?, ¿cómo alcanzar la paz interior? La meditación, el yoga y la reflexión filosófica se convirtieron en herramientas para comprender la mente y la existencia.",
          "Sus enseñanzas han influido durante más de dos mil años en la espiritualidad, la filosofía y, hoy en día, incluso en campos como la psicología y el bienestar.",
        ],
      },
      {
        src: "/recorrido/cultura/historiaUniversal/comic4/comic44.png",
        titulo: "China: gobernar mediante el conocimiento",
        paragraphs: [
          "China desarrolló uno de los Estados más duraderos de la historia. Pensadores como Confucio defendieron que una sociedad funcionaba mejor cuando quienes gobernaban actuaban con virtud, responsabilidad y educación.",
          "Con el tiempo, el mérito y la formación adquirieron un papel cada vez más importante en la administración pública mediante los exámenes imperiales. Al mismo tiempo, China realizó avances tecnológicos extraordinarios, como el papel, la imprenta, la brújula o la pólvora, inventos que terminarían transformando el mundo entero.",
          "Su legado demuestra que el conocimiento también puede convertirse en una herramienta de gobierno y progreso.",
        ],
      },
    ],
  },
  {
    key: "ideas-antiguo-medieval",
    titulo: "Las ideas que transformaron el mundo antiguo y medieval",
    anio: "≈500 a.C.",
    foto: "/img/cultura/historia/universal/ideas-antiguo-medieval.png",
    // Cómic 5 · fotos en /recorrido/cultura/historiaUniversal/comic5/comic51…comic55.png
    vinetas: [
      {
        src: "/recorrido/cultura/historiaUniversal/comic5/comic51.png",
        titulo: "Grecia: el nacimiento de la razón",
        paragraphs: [
          "En la antigua Grecia surgió una forma diferente de comprender el mundo: hacer preguntas y buscar respuestas mediante la observación, el razonamiento y el debate.",
          "La filosofía, la lógica y la democracia ateniense sentaron las bases de muchas ideas que aún hoy influyen en nuestra forma de pensar.",
        ],
      },
      {
        src: "/recorrido/cultura/historiaUniversal/comic5/comic52.png",
        titulo: "Roma: el poder de las instituciones",
        paragraphs: [
          "Roma construyó un inmenso imperio gracias a sus carreteras, ciudades y una administración capaz de gobernar enormes territorios.",
          "Su sistema jurídico y sus instituciones demostraron que las leyes podían mantener unida a una sociedad mucho más allá de sus gobernantes.",
        ],
      },
      {
        src: "/recorrido/cultura/historiaUniversal/comic5/comic53.png",
        titulo: "El cristianismo: una nueva visión del ser humano",
        paragraphs: [
          "En los últimos siglos del Imperio romano, el cristianismo difundió una nueva concepción de la dignidad humana y de la responsabilidad hacia los demás.",
          "Con el tiempo, sus valores y sus instituciones transformaron profundamente la cultura, la moral y la organización de Europa.",
        ],
      },
      {
        src: "/recorrido/cultura/historiaUniversal/comic5/comic54.png",
        titulo: "La Edad Media y el mundo islámico: conservar y ampliar el saber",
        paragraphs: [
          "Tras la caída de Roma, Europa atravesó un periodo de fragmentación política, mientras monasterios y, más tarde, universidades preservaban gran parte del conocimiento antiguo.",
          "Al mismo tiempo, en ciudades como Bagdad y Córdoba, sabios del mundo islámico tradujeron, desarrollaron y ampliaron los conocimientos heredados de Grecia, Persia e India, realizando importantes avances en medicina, matemáticas, astronomía y filosofía.",
        ],
      },
      {
        src: "/recorrido/cultura/historiaUniversal/comic5/comic55.png",
        titulo: "Un legado compartido",
        paragraphs: [
          "La razón griega, las instituciones romanas, la tradición cristiana y las aportaciones del mundo islámico no sustituyeron unas a otras: se fueron acumulando y transformando con el tiempo.",
          "Juntas sentaron muchas de las bases del pensamiento, la ciencia, el derecho y la cultura.",
        ],
      },
    ],
  },
  {
    key: "pensamiento-moderno",
    titulo: "El despertar del pensamiento moderno",
    anio: "≈1450",
    foto: "/img/cultura/historia/universal/pensamiento-moderno.png",
    // Cómic 6 · fotos en /recorrido/cultura/historiaUniversal/comic6/comic61…comic64.png
    vinetas: [
      {
        src: "/recorrido/cultura/historiaUniversal/comic6/comic61.png",
        titulo: "Renacimiento",
        paragraphs: [
          "Europa redescubrió el conocimiento de Grecia y Roma.",
          "Artistas, inventores y pensadores volvieron a observar la naturaleza con curiosidad, colocando al ser humano y su capacidad de aprender en el centro del conocimiento.",
        ],
      },
      {
        src: "/recorrido/cultura/historiaUniversal/comic6/comic62.png",
        titulo: "Revolución Científica",
        paragraphs: [
          "Los científicos comenzaron a comprobar sus ideas mediante la observación y los experimentos.",
          "El método científico transformó nuestra comprensión del universo y sentó las bases de la ciencia moderna.",
        ],
      },
      {
        src: "/recorrido/cultura/historiaUniversal/comic6/comic63.png",
        titulo: "La Ilustración",
        paragraphs: [
          "Filósofos defendieron que la razón también podía mejorar la sociedad.",
          "Ideas como la libertad, los derechos, la igualdad ante la ley y la separación de poderes inspiraron nuevas formas de gobierno.",
        ],
      },
      {
        src: "/recorrido/cultura/historiaUniversal/comic6/comic64.png",
        titulo: "Una nueva manera de avanzar",
        paragraphs: [
          "La curiosidad, la ciencia y el pensamiento crítico aceleraron el progreso humano como nunca antes.",
          "Las grandes transformaciones comienzan cuando nos atrevemos a cuestionar lo que creemos saber.",
        ],
      },
    ],
  },
  {
    key: "revolucion-maquinas",
    titulo: "La revolución de las máquinas",
    anio: "≈1760",
    foto: "/img/cultura/historia/universal/revolucion-maquinas.png",
    // Cómic 7 · fotos en /recorrido/cultura/historiaUniversal/comic7/comic71…comic74.png
    vinetas: [
      {
        src: "/recorrido/cultura/historiaUniversal/comic7/comic71.png",
        titulo: "Revolución Industrial",
        paragraphs: [
          "«La tecnología multiplicó nuestras capacidades… y también nuestras responsabilidades.»",
          "Las máquinas de vapor transformaron la producción y las ciudades crecieron rápidamente.",
          "La industria cambió para siempre la forma de trabajar y de vivir.",
        ],
      },
      {
        src: "/recorrido/cultura/historiaUniversal/comic7/comic72.png",
        titulo: "El siglo XIX",
        paragraphs: [
          "La ciencia comenzó a mejorar la Vida cotidiana mediante avances en medicina, higiene, electricidad, transporte y educación.",
          "El conocimiento dejó de ser un privilegio de unos pocos y empezó a llegar a una parte cada vez mayor de la sociedad.",
        ],
      },
      {
        src: "/recorrido/cultura/historiaUniversal/comic7/comic73.png",
        titulo: "Las Guerras Mundiales",
        paragraphs: [
          "El enorme desarrollo científico e industrial también hizo posible una destrucción sin precedentes.",
          "Tras el conflicto surgieron nuevos esfuerzos por proteger la paz, la cooperación internacional y los derechos humanos.",
        ],
      },
      {
        src: "/recorrido/cultura/historiaUniversal/comic7/comic74.png",
        titulo: "El doble filo del progreso",
        paragraphs: [
          "Cada avance tecnológico abre nuevas oportunidades, pero también plantea desafíos que exigen responsabilidad.",
          "La tecnología no decide el futuro: son las personas quienes deciden cómo utilizarla.",
        ],
      },
    ],
  },
  {
    key: "era-informacion",
    titulo: "La era de la información",
    anio: "≈1945",
    foto: "/img/cultura/historia/universal/era-informacion.png",
    // Cómic 8 · fotos en /recorrido/cultura/historiaUniversal/comic8/comic81…comic84.png
    vinetas: [
      {
        src: "/recorrido/cultura/historiaUniversal/comic8/comic81.png",
        titulo: "Guerra Fría",
        paragraphs: [
          "La competencia entre las grandes potencias impulsó enormes avances científicos y tecnológicos.",
          "La carrera espacial, la informática y las telecomunicaciones aceleraron la innovación.",
        ],
      },
      {
        src: "/recorrido/cultura/historiaUniversal/comic8/comic82.png",
        titulo: "Era Digital",
        paragraphs: [
          "Internet conectó al mundo como nunca antes.",
          "La información, el aprendizaje y la comunicación comenzaron a viajar casi al instante entre millones de personas.",
        ],
      },
      {
        src: "/recorrido/cultura/historiaUniversal/comic8/comic83.png",
        titulo: "Inteligencia Artificial",
        paragraphs: [
          "Por primera vez, desarrollamos herramientas capaces de aprender de los datos, reconocer patrones y colaborar con las personas en tareas cada vez más complejas.",
          "Al mismo tiempo, surgieron nuevos retos relacionados con la ética, la privacidad, el empleo y la desinformación.",
        ],
      },
      {
        src: "/recorrido/cultura/historiaUniversal/comic8/comic84.png",
        titulo: "El siguiente capítulo",
        paragraphs: [
          "Hoy la humanidad posee más conocimiento y más capacidad tecnológica que nunca.",
          "El futuro dependerá de cómo decidamos utilizar esas herramientas para mejorar la vida de las personas y afrontar los grandes desafíos globales.",
        ],
      },
    ],
  },
];
