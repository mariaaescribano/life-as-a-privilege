export type Celula = {
  id: string;
  nombre: string;
  foto: string;
  descripcion: string;
};

export type SistemaOrgano = {
  id: string;
  nombre: string;
  iconKey: string;
  celulas: Celula[];
};

export const celulasCuerpoData: SistemaOrgano[] = [
  {
    id: "piel",
    nombre: "Piel",
    iconKey: "layers",
    celulas: [
      {
        id: "queratinocitos",
        nombre: "Queratinocitos",
        foto: "/img/fisio/celulas/queratinocitos.png",
        descripcion:
          "La célula más abundante de la piel, forma el 90% de la epidermis. Produce queratina, la proteína que protege nuestra piel de agresiones externas, agua y patógenos. Se renuevan constantemente, viajando desde la capa basal hasta la superficie donde se descaman.",
      },
      {
        id: "madre-piel",
        nombre: 'Células madre de la piel',
        foto: "/img/fisio/celulas/celulasmadre.png",
        descripcion:
          "Células de renovación ubicadas en la capa basal de la epidermis. Son las responsables de regenerar continuamente la piel, reemplazando las células que se pierden cada día. Su capacidad de autorrenovación es fundamental para la cicatrización y el mantenimiento de la barrera cutánea.",
      },
    ],
  },
  {
    id: "cartilago",
    nombre: "Cartílago",
    iconKey: "bone",
    celulas: [
      {
        id: "condrocitos",
        nombre: "Condrocitos",
        foto: "/img/fisio/celulas/condrocitos.png",
        descripcion:
          "La única célula propia del cartílago. Viven aislados en pequeñas cápsulas llamadas lagunas y mantienen la matriz extracelular que da firmeza y elasticidad a articulaciones, nariz y orejas. A diferencia de otros tejidos, el cartílago carece de vasos sanguíneos, lo que dificulta su reparación.",
      },
      {
        id: "fibroblastos",
        nombre: "Fibroblastos",
        foto: "/img/fisio/celulas/fibroblastos.png",
        descripcion:
          "Células del tejido conectivo que fabrican colágeno, elastina y otras proteínas estructurales. Son esenciales para la cicatrización y el mantenimiento de la piel, tendones y ligamentos. Cuando se activan tras una lesión, se transforman en miofibroblastos que contraen la herida.",
      },
    ],
  },
  {
    id: "hueso",
    nombre: "Hueso",
    iconKey: "activity",
    celulas: [
      {
        id: "osteocitos",
        nombre: "Osteocitos",
        foto: "/img/fisio/celulas/osteocitos.png",
        descripcion:
          "Células maduras del hueso, atrapadas en la matriz mineralizada que ellos mismos crearon. Actúan como sensores mecánicos, detectando las fuerzas a las que está sometido el esqueleto, y regulan el remodelado óseo enviando señales a otras células. Son las más longevas del tejido óseo.",
      },
      {
        id: "osteoblastos",
        nombre: "Osteoblastos",
        foto: "/img/fisio/celulas/osteoblastos.png",
        descripcion:
          "Los 'constructores' del hueso. Sintetizan la matriz ósea y la mineralizan con calcio y fósforo. Son fundamentales en el crecimiento durante la infancia y en la reparación de fracturas. Cuando quedan atrapados en la matriz que generan, maduran y se convierten en osteocitos.",
      },
      {
        id: "osteoclastos",
        nombre: "Osteoclastos",
        foto: "/img/fisio/celulas/osteoclastos.png",
        descripcion:
          "Los 'demoledores' del hueso. Células gigantes multinucleadas derivadas de los monocitos que disuelven y reabsorben la matriz ósea secretando ácidos y enzimas. Trabajan en equilibrio constante con los osteoblastos en el proceso de remodelado óseo, esencial para mantener la densidad y la resistencia del esqueleto a lo largo de toda la vida.",
      },
    ],
  },
  {
    id: "vasos",
    nombre: "La sangre",
    iconKey: "droplets",
    celulas: [
      {
        id: "celulas-endoteliales",
        nombre: "Células endoteliales",
        foto: "/img/fisio/celulas/endoteliales.png",
        descripcion:
          "Revisten el interior de todos los vasos sanguíneos formando una barrera selectiva. Regulan el intercambio de nutrientes, gases y células entre la sangre y los tejidos. También controlan el tono vascular, la coagulación y la respuesta inflamatoria. Su disfunción está en el origen de muchas enfermedades cardiovasculares.",
      },
    ],
  },
  {
    id: "corazon",
    nombre: "Corazón",
    iconKey: "heart",
    celulas: [
      {
        id: "cardiomiocitos",
        nombre: "Cardiomiocitos",
        foto: "/img/fisio/celulas/cardiomiocito.png",
        descripcion:
          "Las células musculares del corazón. Se contraen de forma rítmica e involuntaria durante toda la vida, impulsando la sangre a través del cuerpo. Son altamente especializadas y prácticamente incapaces de regenerarse tras un infarto, lo que hace que el daño cardíaco sea en gran medida permanente.",
      },
    ],
  },
  {
    id: "grasa",
    nombre: "Grasa",
    iconKey: "circle",
    celulas: [
      {
        id: "adipocitos-blancos",
        nombre: "Adipocitos blancos",
        foto: "/img/fisio/celulas/adipocitosblancos.png",
        descripcion:
          "Almacenan energía en forma de triglicéridos dentro de una gran gota lipídica que ocupa casi todo su volumen. Regulan el metabolismo energético y secretan hormonas como la leptina, que controla el apetito y la saciedad. Son células metabólicamente activas, no simples depósitos pasivos de grasa.",
      },
      {
        id: "adipocitos-marrones",
        nombre: "Adipocitos marrones",
        foto: "/img/fisio/celulas/adipocitosmarrones.png",
        descripcion:
          "A diferencia de los adipocitos blancos, no almacenan energía sino que la queman para generar calor, un proceso llamado termogénesis. Su color marrón se debe a la gran cantidad de mitocondrias que contienen. Abundantes en recién nacidos para protegerlos del frío, persisten en pequeñas cantidades en adultos y se activan con el frío y el ejercicio.",
      },
    ],
  },
  {
    id: "sangre",
    nombre: "Sangre",
    iconKey: "droplet",
    celulas: [
      {
        id: "eritrocitos",
        nombre: "Glóbulos rojos / Eritrocitos",
        foto: "/img/fisio/celulas/globulosrojos.png",
        descripcion:
          "Los transportadores de oxígeno del cuerpo. Cargados de hemoglobina, recogen el O₂ en los pulmones y lo llevan a cada célula del organismo. Carecen de núcleo para maximizar el espacio para la hemoglobina. Tienen una vida de aproximadamente 120 días, tras los cuales son reciclados en el bazo.",
      },
    ],
  },
  {
    id: "inmunitario",
    nombre: "Sistema inmunitario",
    iconKey: "shield",
    celulas: [
      {
        id: "leucocitos",
        nombre: "Glóbulos blancos / Leucocitos",
        foto: "/img/fisio/celulas/leucocitos.png",
        descripcion:
          "El ejército del sistema inmunitario. Patrullan la sangre y los tejidos buscando patógenos, células dañadas o cuerpos extraños. Son un grupo diverso de células con funciones complementarias que trabajan en coordinación para defender el organismo ante cualquier amenaza.",
      },
      {
        id: "linfocitos",
        nombre: "Linfocitos",
        foto: "/img/fisio/celulas/linfocitos.png",
        descripcion:
          "Coordinan la respuesta inmunitaria adaptativa. Distinguen entre lo propio y lo extraño, generan anticuerpos y tienen memoria inmunológica, lo que nos protege ante reinfecciones. Se dividen en células B y células T, con funciones perfectamente especializadas y complementarias.",
      },
      {
        id: "macrofagos",
        nombre: "Macrófagos",
        foto: "/img/fisio/celulas/macrofagos.png",
        descripcion:
          "Los 'comedores' del sistema inmunitario. Engullen y digieren patógenos, células muertas y detritus celular mediante fagocitosis. También presentan antígenos a los linfocitos T y secretan citoquinas que coordinan la respuesta inflamatoria. Están presentes en prácticamente todos los tejidos del cuerpo.",
      },
      {
        id: "neutrofilos",
        nombre: "Neutrófilos",
        foto: "/img/fisio/celulas/neutrofilos.png",
        descripcion:
          "Los más abundantes de los glóbulos blancos (50-70%). Son la primera respuesta ante una infección bacteriana, acudiendo rápidamente al foco infeccioso para atacar y destruir microorganismos mediante fagocitosis y liberación de enzimas destructivas. Viven solo unas horas una vez activados.",
      },
      {
        id: "dendriticas",
        nombre: "Células dendríticas",
        foto: "/img/fisio/celulas/dendriticas.png",
        descripcion:
          "Los 'mensajeros' del sistema inmunitario. Capturan antígenos en los tejidos y los transportan a los ganglios linfáticos, donde los presentan a los linfocitos T para activar la respuesta inmune adaptativa. Son el puente esencial entre la inmunidad innata y la inmunidad adquirida.",
      },
      {
        id: "celulas-t",
        nombre: "Células T",
        foto: "/img/fisio/celulas/celulas-t.png",
        descripcion:
          "Coordinan y ejecutan la respuesta inmunitaria celular. Las células T helper dirigen el ataque orquestando a otras células inmunitarias; las T reguladoras evitan respuestas excesivas que podrían dañar tejidos propios; y las T citotóxicas eliminan directamente células infectadas o cancerosas.",
      },
      {
        id: "celulas-b",
        nombre: "Células B",
        foto: "/img/fisio/celulas/celulas-b.png",
        descripcion:
          "Producen anticuerpos altamente específicos contra los antígenos detectados. Cuando son activadas, se convierten en células plasmáticas que secretan grandes cantidades de anticuerpos. Su memoria inmunológica permite una respuesta más rápida y potente ante futuras exposiciones al mismo patógeno.",
      },
      {
        id: "nk",
        nombre: "Células NK / Natural Killer",
        foto: "/img/fisio/celulas/nk.png",
        descripcion:
          "Eliminan células infectadas por virus y células tumorales sin necesidad de reconocimiento previo específico. Son parte de la inmunidad innata y constituyen la primera línea de defensa frente al cáncer. Detectan la ausencia o alteración de los marcadores de 'identidad propia' en la superficie celular.",
      },
      {
        id: "t-citotoxicas",
        nombre: "Células T citotóxicas",
        foto: "/img/fisio/celulas/t-citotoxicas.png",
        descripcion:
          "Especializadas en destruir células infectadas, cancerosas o trasplantadas. Reconocen antígenos presentados en la superficie celular y liberan perforinas y granzimas que inducen la muerte de la célula diana. Son fundamentales en la defensa antiviral y en el control inmunológico del cáncer.",
      },
    ],
  },
  {
    id: "cerebro",
    nombre: "Cerebro",
    iconKey: "brain",
    celulas: [
      {
        id: "neuronas",
        nombre: "Neuronas",
        foto: "/img/fisio/celulas/neuronas.png",
        descripcion:
          "Las células del pensamiento y la comunicación. Transmiten señales eléctricas y químicas a través de redes de una complejidad extraordinaria. Son la base de todo lo que sentimos, pensamos y recordamos. El cerebro humano contiene unos 86.000 millones de neuronas interconectadas.",
      },
      {
        id: "astrocitos",
        nombre: "Astrocitos",
        foto: "/img/fisio/celulas/astrocitos.png",
        descripcion:
          "Las células de soporte más abundantes del cerebro. Nutren a las neuronas, mantienen la barrera hematoencefálica, regulan las sinapsis y responden a lesiones del tejido nervioso. Lejos de ser mero 'relleno', participan activamente en el procesamiento y la modulación de la información.",
      },
      {
        id: "microglia",
        nombre: "Microglia",
        foto: "/img/fisio/celulas/microglia.png",
        descripcion:
          "Los macrófagos del sistema nervioso central. Vigilan el tejido nervioso en busca de patógenos o daños, eliminan células muertas y sinapsis obsoletas, y participan en la plasticidad neuronal. Su activación crónica se asocia a enfermedades neurodegenerativas como el Alzheimer y el Parkinson.",
      },
      {
        id: "baston",
        nombre: "Células de bastón",
        foto: "/img/fisio/celulas/baston.png",
        descripcion:
          "Fotorreceptores de la retina sensibles a la luz tenue. Permiten la visión nocturna y periférica. Contienen rodopsina, un pigmento fotosensible que se activa incluso con cantidades mínimas de luz. Son las células más fotosensibles del cuerpo humano, superando en número a los conos.",
      },
      {
        id: "cono",
        nombre: "Células cono",
        foto: "/img/fisio/celulas/cono.png",
        descripcion:
          "Fotorreceptores de la retina especializados en la visión en color y de alta resolución. Hay tres tipos, cada uno sensible a una longitud de onda diferente (rojo, verde, azul). Se concentran en la fóvea central, el punto de máxima agudeza visual, y requieren buena iluminación para funcionar.",
      },
    ],
  },
  {
    id: "genitales-femeninos",
    nombre: "Genitales femeninos",
    iconKey: "moon",
    celulas: [
      {
        id: "ovulo",
        nombre: "Óvulo",
        foto: "/img/fisio/celulas/ovulo.png",
        descripcion:
          "La célula reproductora femenina y la más grande del cuerpo humano. Contiene la mitad del material genético necesario para crear una nueva vida. Es la única célula que puede ser fecundada por un espermatozoide para originar, a partir de una sola célula, un ser humano completo.",
      },
    ],
  },
  {
    id: "genitales-masculinos",
    nombre: "Genitales masculinos",
    iconKey: "sun",
    celulas: [
      {
        id: "sertoli",
        nombre: "Células de Sertoli",
        foto: "/img/fisio/celulas/sertoli.png",
        descripcion:
          "Las 'nodrizas' de los espermatozoides. Nutren, protegen y dirigen el desarrollo de las células espermáticas dentro de los túbulos seminíferos del testículo. Crean la barrera hematotesticular que protege a los espermatozoides en desarrollo del sistema inmunitario del propio cuerpo.",
      },
      {
        id: "leydig",
        nombre: "Células de Leydig",
        foto: "/img/fisio/celulas/leydig.png",
        descripcion:
          "Productoras de testosterona. Ubicadas entre los túbulos seminíferos, responden a la hormona luteinizante (LH) para regular la producción de hormona sexual masculina. Son fundamentales para el desarrollo de los caracteres sexuales masculinos, la libido y la fertilidad.",
      },
      {
        id: "cancerosas",
        nombre: "Células cancerosas",
        foto: "/img/fisio/celulas/cancerosas.png",
        descripcion:
          "Células con mutaciones acumuladas que han perdido el control del ciclo celular. Se dividen sin límite, evaden el sistema inmunitario y pueden invadir otros tejidos originando metástasis. Son células propias del organismo que han 'olvidado' las reglas de convivencia y cooperación celular.",
      },
    ],
  },
];
