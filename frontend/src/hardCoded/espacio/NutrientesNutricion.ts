// ── Datos de la Página 1 del recorrido de Nutrición: los 6 grupos de nutrientes.
// Cada uno con sus tipos, qué hacen en el cuerpo y dónde encontrarlo.

export interface NutrienteTipo {
  nombre: string;
  desc: string;
}

// Tarjeta de la página de detalle (p.ej. Glucosa, Fructosa…). Al pincharla se
// abre una ficha tipo cómic (foto + título + texto), como en Fisiología.
export interface NutrienteTarjeta {
  key: string;
  titulo: string;
  /** Foto cuadrada de la molécula/tipo. PENDIENTE de subir:
   *  /img/nutri/nutrientes/<grupo>/<key>.png */
  foto: string;
  parrafos: string[];
  /** Color propio de la tarjeta (para el círculo de vitaminas: cada una uno). */
  color?: string;
  /** Etiqueta corta para el nodo del círculo (p.ej. «A», «B»). */
  sigla?: string;
  /** Subgrupo al que pertenece la tarjeta (p.ej. «⚡ Electrolitos», «🧱 Minerales»).
   *  Si varias tarjetas tienen distinto `grupo`, la rejilla los separa con un
   *  encabezado y una línea horizontal entre subgrupos. */
  grupo?: string;
  /** Número de orden (1, 2, 3…) para secuencias, p.ej. la ruta metabólica del
   *  etanol. Si se define, la tarjeta muestra un badge con ese número. */
  numero?: number;
}

export interface Nutriente {
  key: string;
  label: string;
  color: string;
  /** Foto de alimentos de este grupo donde se ven sus moléculas. Va en la
   *  tarjeta de la cuadrícula (con el título debajo). */
  img: string;
  resumen: string;
  /** Descripción larga (uno o varios párrafos) que se muestra en el box de
   *  detalle, a la derecha de la foto. Se lee al tamaño de las ilustraciones. */
  descripcion?: string[];
  tipos: NutrienteTipo[];
  queHacen: string[];
  donde: string[];
  /** Tarjetas de detalle (moléculas/tipos), cada una abre su ficha cómic. */
  tarjetas?: NutrienteTarjeta[];
  /** Si true, las tarjetas se muestran como un CÍRCULO de colores (p.ej. las
   *  vitaminas), en vez de la rejilla de tarjetas. */
  tarjetasCirculo?: boolean;
}

export const NUTRIENTES: Nutriente[] = [
  {
    key: "carbohidratos",
    label: "Carbohidratos",
    color: "#e0a92e",
    img: "/recorrido/nutricion/portadas/carbs.webp",
    resumen: "Tu principal fuente de energía.",
    descripcion: [
      "Los carbohidratos son la principal fuente de energía del cuerpo.",
      "Durante la digestión, las enzimas los descomponen en moléculas simples, principalmente glucosa. Esta permite que las células obtengan energía mediante la respiración celular.",
      "Cuando se consume más de la necesaria, el exceso se almacena como glucógeno o se transforma en triglicéridos los cuales se almacenan en las células de grasa blanca.",
    ],
    tipos: [
      { nombre: "Simples (azúcares)", desc: "Glucosa, fructosa, sacarosa. Energía rápida, pico y bajada." },
      { nombre: "Complejos (almidón)", desc: "Cadenas largas de glucosa. Energía lenta y sostenida." },
    ],
    queHacen: [
      "Son el combustible preferido del cuerpo: se rompen en glucosa.",
      "La glucosa alimenta sobre todo al cerebro y a los músculos.",
      "El exceso se guarda como glucógeno (hígado y músculo) o como grasa.",
    ],
    donde: ["Avena", "Arroz y pan integral", "Legumbres", "Fruta", "Patata y boniato"],
    tarjetas: [
      {
        key: "glucosa",
        titulo: "Glucosa",
        foto: "/recorrido/nutricion/moleculas/glucosa.webp",
        parrafos: [
          "Es la molécula que nuestras células utilizan con más frecuencia para fabricar ATP, la energía.",
          "Cuando la ingerimos, pasa a la sangre y se libera insulina, la hormona que les dice a las células que capten la glucosa para usarla. Si hay más glucosa de la que el organismo necesita y las reservas de glucógeno están llenas, el hígado transforma la glucosa en triglicéridos y los almacena en grasa para guardarlo como reserva.",
        ],
      },
      {
        key: "fructosa",
        titulo: "Fructosa",
        foto: "/recorrido/nutricion/moleculas/fructosa.webp",
        parrafos: [
          "Es la molécula característica de las frutas y la miel.",
          "A diferencia de la glucosa, la mayor parte de la fructosa se procesa primero en el hígado.",
          "Cuando se consume dentro de una fruta, la fibra hace que se absorba lentamente.",
          " Sin embargo, cuando se consume en grandes cantidades y sin fibra (como en refrescos o zumos), el hígado recibe una carga muy rápida que favorece la producción de grasa, gasta las reservas y altera el metabolismo.",
        ],
      },
      {
        key: "galactosa",
        titulo: "Galactosa",
        foto: "/recorrido/nutricion/moleculas/galactosa.webp",
        parrafos: [
          "La galactosa forma parte de la lactosa, la molécula de carbohidratos presente en la leche.",
          "Para absorberla, primero debemos romper la lactosa gracias a una enzima llamada lactasa, que la divide en glucosa y galactosa.",
          "Las personas con intolerancia a la lactosa producen poca lactasa, por lo que la lactosa llega al intestino sin digerir y provoca síntomas como gases, hinchazón o diarrea.",
          "Una vez absorbida, la galactosa suele transformarse en glucosa para que el organismo pueda utilizarla.",
        ],
      },
    ],
  },
  {
    key: "grasas",
    label: "Grasas",
    color: "#e58a3c",
    img: "/recorrido/nutricion/portadas/grasas.webp",
    resumen: "Energía densa y ladrillos de tus membranas.",
    descripcion: [
      "Las grasas forman parte de la membrana de todas tus células. También transportan las vitaminas A, D, E y K y son la base para fabricar muchas hormonas.",
      "No todas son iguales: las insaturadas son las más beneficiosas para la salud, las saturadas conviene moderarlas y las grasas trans, evitarlas.",
    ],
    tipos: [
      { nombre: "Insaturadas", desc: "Mono y poliinsaturadas (omega-3, omega-6). Las más beneficiosas." },
      { nombre: "Saturadas", desc: "En carnes y lácteos. Con moderación." },
      { nombre: "Trans", desc: "Industriales (ultraprocesados). Las que conviene evitar." },
    ],
    queHacen: [
      "Reserva de energía más concentrada que tiene el cuerpo.",
      "Forman las membranas de todas tus células.",
      "Transportan las vitaminas A, D, E y K, y son base de muchas hormonas.",
    ],
    donde: ["Aceite de oliva", "Aguacate", "Frutos secos y semillas", "Pescado azul", "Huevo"],
    tarjetas: [
      {
        key: "insaturadas",
        titulo: "Grasas insaturadas",
        foto: "/recorrido/nutricion/moleculas/insaturado.webp",
        parrafos: [
          "Son las grasas más habituales en alimentos como el aceite de oliva, los frutos secos, las semillas, el aguacate y el pescado azul.",
          "Su estructura presenta una o varias curvaturas que ayudan a mantener las membranas celulares flexibles y favorecen el funcionamiento normal de las células.",
          "Son las grasas más eficientes para nuestras células y con las que ha evolucionado durante millones de años.",
        ],
      },
      {
        key: "saturadas",
        titulo: "Grasas saturadas",
        foto: "/recorrido/nutricion/moleculas/saturado.webp",
        parrafos: [
          "Se encuentran principalmente en productos de origen animal, como la carne o los lácteos, aunque también en algunos vegetales como el aceite de coco.",
          "Sus moléculas son rectas y pueden empaquetarse con mayor facilidad, haciendo que las membranas celulares sean más rígidas y menos eficientes.",
          "Nuestro cuerpo también las utiliza, pero un consumo elevado y mantenido puede favorecer alteraciones cardiovasculares, especialmente cuando su consumo desplaza a las grasas insaturadas.",
        ],
      },
      {
        key: "trans",
        titulo: "Grasas trans",
        foto: "/recorrido/nutricion/moleculas/trans.webp",
        parrafos: [
          "La mayoría de las grasas trans presentes en la alimentación se generan durante procesos industriales que modifican aceites vegetales para hacerlos más estables. Es decir, esa forma molecular apenas existe en la naturaleza: se fabricó en un laboratorio.",
          "Para entender qué es «trans» hay que mirar la molécula. En una grasa insaturada natural, el doble enlace deja los dos hidrógenos del mismo lado, y eso obliga a la cadena a doblarse: es la famosa curvatura, la forma «cis». En una grasa trans los hidrógenos quedan en lados opuestos y la cadena se queda recta. Ese es todo el cambio, y es enorme: una molécula que se comporta como una grasa saturada rígida aunque técnicamente siga siendo insaturada.",
          "¿Cómo se llega ahí? Con la hidrogenación parcial. Se coge un aceite vegetal líquido y barato, se le inyecta hidrógeno a presión con un catalizador metálico y calor. Si el proceso se completara, el aceite quedaría totalmente saturado; al dejarlo a medias, parte de los dobles enlaces que sobreviven se giran de cis a trans. El resultado era justo lo que la industria quería: una grasa sólida y untuosa a temperatura ambiente, que no se enrancia, que aguanta frituras repetidas y que alarga meses la caducidad del producto.",
          "Tiene su ironía histórica: las margarinas hidrogenadas se promocionaron durante décadas como la alternativa moderna y saludable a la mantequilla y a la grasa animal. Acabaron siendo peores que aquello que venían a sustituir.",
          "El daño empieza en la membrana. Tus células fabrican sus membranas con las grasas que les llegan, y no saben distinguir: al ser rectas, colocan las moléculas trans en el sitio de las insaturadas. Pero una membrana que debería ser fluida se vuelve rígida, y con ella dejan de funcionar bien los receptores, los canales y las enzimas que están incrustados en ella. El material es defectuoso, pero la obra sigue.",
          "En la sangre hacen algo que ninguna otra grasa hace: suben el colesterol LDL y, a la vez, bajan el HDL. La grasa saturada sube el LDL pero también sube algo el HDL; las trans empeoran los dos lados a la vez, así que dejan el peor perfil de todas las grasas conocidas. Además elevan la lipoproteína(a), favorecen la inflamación y dañan el endotelio, la capa que recubre las arterias por dentro.",
          "Y todo eso con dosis diminutas. La Organización Mundial de la Salud recomienda que no superen el 1 % de la energía diaria: unos 2 gramos al día. Los grandes análisis estiman que cada 2 % de la energía que venga de grasas trans se asocia a un aumento de en torno al 20-25 % del riesgo de enfermedad coronaria. Muy poca cantidad para tanto efecto.",
          "Un matiz honesto: sí existen grasas trans naturales, en pequeñas cantidades, en la carne y la leche de los rumiantes, porque las fabrican las bacterias de su estómago. A las dosis en que se comen no parecen tener el mismo efecto que las industriales. El problema es la versión de fábrica.",
          "La buena noticia es que esto se ha regulado. Dinamarca fue la primera en limitarlas en 2003 y, desde abril de 2021, en toda la Unión Europea ningún alimento puede llevar más de 2 gramos de grasas trans industriales por cada 100 gramos de grasa. En Europa el problema es hoy mucho menor que hace quince años.",
          "Aun así, conviene saber leer, porque el etiquetado europeo NO obliga a declarar cuántas grasas trans lleva un producto: no las vas a encontrar en la tabla nutricional. Donde sí aparecen es en la lista de ingredientes. Busca las palabras «parcialmente hidrogenado» o «parcialmente hidrogenada»: ahí es donde están. Ojo, si pone solo «hidrogenado» sin el «parcialmente», esa grasa está completamente saturada y no es trans. Sospecha sobre todo de la bollería industrial, las margarinas duras, las galletas rellenas, las coberturas, los precocinados y los productos importados de fuera de la UE.",
          "Recuerda que no cumplen ninguna función beneficiosa conocida y su consumo debe minimizarse. No hay una cantidad recomendada de grasas trans, porque no hacen falta para nada: es el único componente de la dieta del que lo ideal, sencillamente, es cero.",
        ],
      },
    ],
  },
  {
    key: "proteinas",
    label: "Proteínas",
    color: "#d75f5a",
    img: "/recorrido/nutricion/portadas/prote.webp",
    resumen: "El material con el que te reconstruyes.",
    descripcion: [
      "Las proteínas son el material con el que tu cuerpo construye y repara tejidos.",
      "Durante la digestión se descomponen en aminoácidos, los ladrillos con los que el organismo fabrica músculo, piel, enzimas, anticuerpos y muchas hormonas.",
    ],
    tipos: [
      { nombre: "Completas", desc: "De origen animal: aportan todos los aminoácidos esenciales." },
      { nombre: "Incompletas", desc: "De origen vegetal: se combinan (legumbre + cereal) para completarlas." },
    ],
    queHacen: [
      "Se descomponen en aminoácidos, los ladrillos del cuerpo.",
      "Construyen y reparan músculo, piel, pelo y órganos.",
      "Forman enzimas, anticuerpos y muchas hormonas.",
    ],
    donde: ["Huevo", "Pescado y carne", "Lácteos", "Legumbres y tofu", "Frutos secos"],
    tarjetas: [
      {
        key: "esenciales",
        titulo: "Aminoácidos esenciales",
        foto: "/recorrido/nutricion/moleculas/aesencial.webp",
        parrafos: [
          "Son los aminoácidos que nuestro cuerpo no puede fabricar o no puede producir en cantidad suficiente pero son necesarios. Por eso debemos obtenerlos a través de la alimentación.",
          "Son imprescindibles para fabricar músculos, enzimas, hormonas, anticuerpos y miles de proteínas diferentes.",
        ],
      },
      {
        key: "no-esenciales",
        titulo: "Aminoácidos no esenciales",
        foto: "/recorrido/nutricion/moleculas/noaesencial.webp",
        parrafos: [
          "Nuestro cuerpo puede fabricar estos aminoácidos a partir de otras moléculas, por lo que no es imprescindible obtenerlos directamente de los alimentos.",
          "Aun así, siguen siendo igual de importantes, ya que participan en la construcción y reparación de todos los tejidos.",
        ],
      },
      {
        key: "condicionalmente-esenciales",
        titulo: "Aminoácidos condicionalmente esenciales",
        foto: "/recorrido/nutricion/moleculas/acondesencial.webp",
        parrafos: [
          "Normalmente nuestro cuerpo puede producirlos, pero en determinadas situaciones —como el crecimiento, una enfermedad, una infección o una lesión importante— la demanda aumenta tanto que es necesario obtener una mayor cantidad a través de la alimentación.",
        ],
      },
    ],
  },
  {
    key: "vitaminas",
    label: "Vitaminas",
    color: "#e8b52e",
    img: "/recorrido/nutricion/portadas/vitaminas.webp",
    resumen: "Reguladoras: sin ellas nada funciona.",
    descripcion: [
      "Las vitaminas no aportan energía, pero sin ellas nada funciona correctamente. Permiten que se produzcan las reacciones químicas del organismo, desde la visión hasta las defensas o la coagulación de la sangre.",
      "Las hidrosolubles (grupo B y vitamina C) deben obtenerse regularmente mediante la alimentación, mientras que las liposolubles (A, D, E y K) pueden almacenarse en la grasa corporal.",
    ],
    tipos: [
      { nombre: "Hidrosolubles", desc: "Vitamina C y grupo B. No se almacenan: hay que reponerlas a diario." },
      { nombre: "Liposolubles", desc: "A, D, E y K. Se guardan en la grasa del cuerpo." },
    ],
    queHacen: [
      "No dan energía, pero permiten que las reacciones del cuerpo ocurran.",
      "Intervienen en la visión, las defensas, la coagulación y la energía celular.",
      "La vitamina D se fabrica en la piel con la luz del sol.",
    ],
    donde: ["Fruta y verdura", "Verduras de hoja verde", "Huevo e hígado", "Sol (vitamina D)", "Cereales integrales"],
    // Rejilla de boxes, igual que el resto de grupos (el círculo de colores se
    // descartó). `color` y `sigla` de cada tarjeta se conservan por si se
    // recupera: solo los usa NutrienteCirculo.
    tarjetas: [
      {
        key: "a", sigla: "A", titulo: "Vitamina A (Retinol)", color: "#ef8e3a",
        foto: "/recorrido/nutricion/moleculas/vitaminaa.webp",
        parrafos: [
          "Sin la vitamina A no podríamos ver.",
          "La vitamina A se transforma en retinal, una molécula que forma parte de la rodopsina, el pigmento de la retina que nos permite ver.",
          "Es esencial para el desarrollo del sistema inmunitario y para que su respuesta no sea exagerada.",
          "La vitamina A regula qué genes se activan en las células epiteliales. Gracias a ello, las células de la piel se renuevan correctamente (protegiéndonos eficazmente) y las mucosas producen la cantidad adecuada de moco.",
        ],
      },
      {
        key: "b1", sigla: "B1", titulo: "Vitamina B1 (Tiamina)", color: "#f2c230",
        foto: "/recorrido/nutricion/moleculas/vitb1.webp",
        parrafos: [
          "Activa las enzimas que transforman los carbohidratos en energía y es imprescindible para el funcionamiento del cerebro, los nervios y los músculos. Sin ella, las células tendrían muchas dificultades para obtener energía de la glucosa.",
        ],
      },
      {
        key: "b2", sigla: "B2", titulo: "Vitamina B2 (Riboflavina)", color: "#ecbb2f",
        foto: "/recorrido/nutricion/moleculas/vitb2.webp",
        parrafos: [
          "Participa en numerosas reacciones metabólicas relacionadas con la producción de energía, para ser exactos que se convierten en activadores de las enzimas que transportan electrones durante la respiración celular.",
          "También ayuda a mantener la piel, los ojos y las mucosas en buen estado y contribuye a proteger las células frente al estrés oxidativo.",
        ],
      },
      {
        key: "b3", sigla: "B3", titulo: "Vitamina B3 (Niacina)", color: "#e6b02c",
        foto: "/recorrido/nutricion/moleculas/vitb3.webp",
        parrafos: [
          "Es necesaria para fabricar las moléculas que permiten obtener energía a partir de los alimentos.",
          "Es decir, se transforma en NAD⁺ y NADP⁺, moléculas que transportan electrones entre enzimas durante cientos de reacciones metabólicas.",
          "Además, participa en la reparación del ADN (viendo cuándo está roto, activando el sistema de reparación y usando el NAD como 'combustible' para arreglar los genes rotos) y en el funcionamiento normal del sistema nervioso (ayudando a transformar los alimentos en la energía que el cerebro necesita, protegiendo a las neuronas del estrés oxidativo -activa al glutatión, el principal antioxidante- y fabricando neurotransmisores) y la piel (al mantener su barrera de humedad mediante la producción de ceramidas -lípidos naturales (grasas) que forman la mayor parte de la barrera protectora de la piel-, reducir la inflamación y prevenir el daño celular causado por los rayos ultravioleta del sol).",
        ],
      },
      {
        key: "b5", sigla: "B5", titulo: "Vitamina B5 (Ácido pantoténico)", color: "#dda829",
        foto: "/recorrido/nutricion/moleculas/vitb5.webp",
        parrafos: [
          "Forma parte de la coenzima A (CoA), una molécula imprescindible para que las enzimas puedan fabricar y degradar grasas, producir energía y sintetizar colesterol y hormonas.",
        ],
      },
      {
        key: "b6", sigla: "B6", titulo: "Vitamina B6 (Piridoxina)", color: "#efc94c",
        foto: "/recorrido/nutricion/moleculas/vitb6.webp",
        parrafos: [
          "Activa a las enzimas que participan en la transformación de los aminoácidos y en la fabricación de neurotransmisores, hemoglobina (la proteína de los glóbulos rojos que transporta oxígeno) y anticuerpos.",
          "Debido a esto, es fundamental para el sistema nervioso y el sistema inmunitario.",
        ],
      },
      {
        key: "b7", sigla: "B7", titulo: "Vitamina B7 (Biotina)", color: "#e4be3c",
        foto: "/recorrido/nutricion/moleculas/vitb7.webp",
        parrafos: [
          "Actúa como coenzima de las carboxilasas, un grupo de enzimas que permiten fabricar glucosa, sintetizar ácidos grasos y aprovechar algunos aminoácidos para obtener energía. Por ello, participa en el mantenimiento de la piel, el cabello y las uñas.",
        ],
      },
      {
        key: "b9", sigla: "B9", titulo: "Vitamina B9 (Ácido fólico o Folato)", color: "#d6a336",
        foto: "/recorrido/nutricion/moleculas/vitb9.webp",
        parrafos: [
          "Activa a la enzima que transporta pequeños fragmentos de carbono necesarios para fabricar ADN y ARN. Sin ella, las células no podrían dividirse correctamente.",
          "Durante el embarazo es especialmente importante porque participa en el correcto desarrollo del sistema nervioso del bebé. Sin esta vitamina, el bebé podría fallecer.",
          "El folato se queda atrapado porque su transformación en la forma de almacenamiento es irreversible, y la vitamina B12 es la única capaz de retirar el grupo químico que lo bloquea para devolverlo a su estado activo: Ácido fólico (suplemento) o Folato (comida) → Forma atrapada → Vitamina B12 → Folato activo.",
        ],
      },
      {
        key: "b12", sigla: "B12", titulo: "Vitamina B12 (Cobalamina)", color: "#c99a32",
        foto: "/recorrido/nutricion/moleculas/vitb12.webp",
        parrafos: [
          "La vitamina B12 funciona como una coenzima esencial que activa a la metionina sintasa, una enzima que libera el folato atrapado, permitiendo la síntesis de ADN necesaria para la producción de glóbulos rojos, y activa también a la metilmalonil-CoA mutasa, la enzima que procesa grasas, evitando la acumulación de compuestos tóxicos que destruyen la capa protectora de mielina en las neuronas.",
          "Solo la producen ciertos microorganismos, por lo que se obtiene principalmente de alimentos de origen animal o de alimentos suplementados.",
        ],
      },
      {
        key: "c", sigla: "C", titulo: "Vitamina C (Ácido ascórbico)", color: "#6fb84c",
        foto: "/recorrido/nutricion/moleculas/vitc.webp",
        parrafos: [
          "Actúa como antioxidante, dona electrones a enzimas que fabrican colágeno, permitiendo estabilizar sus fibras. Mejora la absorción del hierro de origen vegetal, manteniéndolo en una forma más fácil de absorber.",
          "Contribuye al funcionamiento normal del sistema inmunitario, es decir ayuda a estimular la producción y función de las células inmunes, además de actuar como antioxidante que protege a estas células de daños.",
        ],
      },
      {
        key: "d", sigla: "D", titulo: "Vitamina D (Calciferol)", color: "#4a90d9",
        foto: "/recorrido/nutricion/moleculas/vitd.webp",
        parrafos: [
          "Facilita la absorción del calcio y del fósforo, ayudando a mantener huesos y dientes fuertes.",
          "Además, participa en el funcionamiento del sistema inmunitario y de los músculos. Nuestro cuerpo puede fabricarla gracias a la luz solar, pero es muy complicada de fabricar por lo que se recomienda tomarla como suplemento.",
        ],
      },
      {
        key: "e", sigla: "E", titulo: "Vitamina E (Tocoferol)", color: "#9b6fc7",
        foto: "/recorrido/nutricion/moleculas/vite.webp",
        parrafos: [
          "Es uno de los principales antioxidantes del organismo.",
          "Protege las membranas celulares porque se incorpora a ellas y dona electrones para calmar a los radicales libres antes de que puedan dañar los lípidos que forman la membrana.",
        ],
      },
      {
        key: "k", sigla: "K", titulo: "Vitamina K (Filoquinona y Menaquinonas)", color: "#d9534f",
        foto: "/recorrido/nutricion/moleculas/vitk.webp",
        parrafos: [
          "Es imprescindible para que la sangre coagule correctamente cuando sufrimos una herida. También participa en el mantenimiento de los huesos regulando el uso del calcio.",
          "Parte de la vitamina K también puede ser producida por algunas bacterias de nuestra microbiota intestinal.",
        ],
      },
    ],
  },
  {
    key: "minerales",
    label: "Minerales",
    color: "#6f93b8",
    img: "/recorrido/nutricion/portadas/minerales.webp",
    resumen: "Estructura, transporte y equilibrio.",
    descripcion: [
      "Los minerales dan estructura, transportan sustancias y mantienen el equilibrio del organismo. Muchos actúan como cofactores, ayudando a que las enzimas funcionen correctamente.",
      "Forman huesos y dientes, permiten el impulso nervioso y la contracción muscular, y el hierro transporta el oxígeno en la sangre.",
    ],
    tipos: [
      { nombre: "Macrominerales", desc: "Calcio, fósforo, magnesio, potasio, sodio. En cantidades mayores." },
      { nombre: "Oligoelementos", desc: "Hierro, zinc, yodo, selenio. En cantidades diminutas, pero esenciales." },
    ],
    queHacen: [
      "Dan estructura a huesos y dientes (calcio, fósforo).",
      "El hierro transporta el oxígeno en la sangre.",
      "Permiten el impulso nervioso, la contracción muscular y el equilibrio de líquidos.",
    ],
    donde: ["Lácteos", "Verduras de hoja", "Legumbres", "Marisco y pescado", "Frutos secos"],
    tarjetas: [
      {
        key: "sodio",
        titulo: "Sodio (Na⁺)",
        foto: "/recorrido/nutricion/moleculas/sodio.webp",
        grupo: "⚡ Electrolitos",
        parrafos: [
          "Es el principal electrolito fuera de las células.",
          "Regula la cantidad de agua del organismo y permite que los nervios transmitan impulsos eléctricos.",
          "El sodio sube la presión arterial porque retiene agua y, por eso, aumenta el volumen de la sangre, debido a que el plasma sigue al sodio, manteniéndose en los vasos sanguíneos en lugar de entrar a las células.",
          "Profundiza: La bomba sodio-potasio (Na⁺/K⁺-ATPasa) utiliza ATP para expulsar sodio de la célula e introducir potasio, creando lo necesario para la transmisión de impulsos nerviosos, la contracción muscular y el transporte de muchas moléculas, como la glucosa o algunos aminoácidos.",
        ],
      },
      {
        key: "potasio",
        titulo: "Potasio (K⁺)",
        foto: "/recorrido/nutricion/moleculas/potasio.webp",
        grupo: "⚡ Electrolitos",
        parrafos: [
          "Es el principal electrolito dentro de las células.",
          "Gracias a la diferencia generada por la bomba sodio-potasio, el potasio puede salir temporalmente de la célula durante un impulso nervioso y volver después a su estado inicial.",
          "Este movimiento permite que neuronas, músculos y corazón transmitan señales eléctricas de forma coordinada.",
        ],
      },
      {
        key: "calcio",
        titulo: "Calcio (Ca²⁺)",
        foto: "/recorrido/nutricion/moleculas/calcio.webp",
        grupo: "⚡ Electrolitos",
        parrafos: [
          "Además de formar parte de los huesos y dientes, el calcio actúa como una señal química dentro de las células.",
          "Permite que los músculos se contraigan, que las neuronas liberen neurotransmisores y que la sangre pueda coagular correctamente.",
        ],
      },
      {
        key: "magnesio",
        titulo: "Magnesio (Mg²⁺)",
        foto: "/recorrido/nutricion/moleculas/magnesio.webp",
        grupo: "⚡ Electrolitos",
        parrafos: [
          "El ATP casi nunca existe libre dentro de las células. Normalmente está unido a un ion de magnesio formando Mg-ATP, la forma que necesitan la mayoría de las enzimas.",
          "Sin magnesio, muchas de ellas no podrían utilizar la energía almacenada en el ATP, por lo que la célula sería mucho menos eficiente.",
          "Además, se necesita para activar cientos de enzimas implicadas en la síntesis de ADN, ARN y proteínas, así como en la respiración celular y la producción de energía.",
        ],
      },
      {
        key: "cloruro",
        titulo: "Cloruro (Cl⁻)",
        foto: "/recorrido/nutricion/moleculas/cloruro.webp",
        grupo: "⚡ Electrolitos",
        parrafos: [
          "Presente en gran parte del líquido que rodea a las células y acompaña al sodio para mantener el equilibrio eléctrico y el movimiento del agua entre los distintos tejidos.",
          "También desempeña una función esencial en el estómago: las células de la mucosa gástrica combinan cloruro con protones (H⁺) para formar ácido clorhídrico (HCl), imprescindible para desnaturalizar las proteínas de los alimentos, activar la enzima pepsina y destruir muchos microorganismos que ingerimos.",
        ],
      },
      {
        key: "fosfato",
        titulo: "Fosfato (PO₄³⁻)",
        foto: "/recorrido/nutricion/moleculas/fosfato.webp",
        grupo: "⚡ Electrolitos",
        parrafos: [
          "El fosfato es uno de los componentes más importantes de la Vida.",
          "Forma parte del ATP, donde almacena la energía química; del ADN y el ARN, donde une los nucleótidos formando su estructura; y de los fosfolípidos, que construyen las membranas celulares.",
          "Además, las enzimas cambian completamente de rol o misión si se le añade un fosfato. Por eso, también se considera un interruptor molecular.",
          "Esto lo logra gracias a los 'dedos de zinc', unas estructuras que se acoplan directamente al ADN para activar o desactivar su lectura, y a su capacidad para actuar como un director de orquesta en nuestras defensas, regulando la maduración de los linfocitos T y frenando la inflamación exagerada.",
        ],
      },
      {
        key: "hierro",
        titulo: "Hierro (Fe)",
        foto: "/recorrido/nutricion/moleculas/hierro.webp",
        grupo: "🧱 Minerales",
        parrafos: [
          "Es un componente esencial de la hemoglobina de los glóbulos rojos y de la mioglobina de los músculos.",
          "Permite transportar oxígeno desde los pulmones hasta los tejidos y participar en la producción de energía dentro de las mitocondrias.",
          "Además, forma parte de numerosas enzimas implicadas en la respiración celular y en la síntesis de ADN.",
        ],
      },
      {
        key: "zinc",
        titulo: "Zinc (Zn)",
        foto: "/recorrido/nutricion/moleculas/zinc.webp",
        grupo: "🧱 Minerales",
        parrafos: [
          "Participa como cofactor en más de 300 enzimas implicadas en la síntesis de ADN y proteínas, la división celular, la cicatrización y el metabolismo de los nutrientes.",
          "Además, es fundamental para el correcto funcionamiento del sistema inmunitario y ayuda a regular la expresión de numerosos genes.",
        ],
      },
      {
        key: "cobre",
        titulo: "Cobre (Cu)",
        foto: "/recorrido/nutricion/moleculas/cobre.webp",
        grupo: "🧱 Minerales",
        parrafos: [
          "El cobre participa en enzimas que intervienen en la producción de energía, la formación del tejido conectivo y la protección frente al estrés oxidativo.",
          "También es necesario para el metabolismo del hierro y para la síntesis de hemoglobina, por lo que contribuye indirectamente al transporte de oxígeno.",
        ],
      },
      {
        key: "yodo",
        titulo: "Yodo (I)",
        foto: "/recorrido/nutricion/moleculas/yodo.webp",
        grupo: "🧱 Minerales",
        parrafos: [
          "El yodo es imprescindible para fabricar las hormonas tiroideas (T₃ y T₄).",
          "Estas hormonas regulan el metabolismo, el crecimiento, el desarrollo del sistema nervioso y el consumo de energía por las células.",
        ],
      },
      {
        key: "selenio",
        titulo: "Selenio (Se)",
        foto: "/recorrido/nutricion/moleculas/selenio.webp",
        grupo: "🧱 Minerales",
        parrafos: [
          "Forma parte de varias enzimas antioxidantes que protegen a las células frente al daño causado por los radicales libres.",
          "Además, participa en el funcionamiento de la glándula tiroides y contribuye al correcto funcionamiento del sistema inmunitario.",
        ],
      },
      {
        key: "manganeso",
        titulo: "Manganeso (Mn)",
        foto: "/recorrido/nutricion/moleculas/manganeso.webp",
        grupo: "🧱 Minerales",
        parrafos: [
          "Actúa como cofactor de diversas enzimas implicadas en el metabolismo de carbohidratos, proteínas y grasas.",
          "También participa en la formación del hueso y en mecanismos antioxidantes celulares.",
        ],
      },
    ],
  },
  {
    key: "fibra",
    label: "Fibra",
    color: "#6fa86b",
    img: "/recorrido/nutricion/portadas/fibra.webp",
    resumen: "No se absorbe, pero lo ordena todo.",
    descripcion: [
      "La fibra apenas se digiere ni se absorbe como el resto de nutrientes, pero desempeña un papel fundamental en la salud global del organismo. Regula la digestión, prolonga la sensación de saciedad y sirve de alimento para las bacterias beneficiosas del intestino.",
      "La fibra soluble forma un gel que ayuda a regular el azúcar y el colesterol, mientras que la fibra insoluble aporta volumen a las heces y acelera el tránsito intestinal.",
    ],
    tipos: [
      { nombre: "Soluble", desc: "Forma un gel: regula el azúcar y el colesterol, y alimenta a la microbiota." },
      { nombre: "Insoluble", desc: "Da volumen y acelera el tránsito intestinal." },
    ],
    queHacen: [
      "No se digiere ni se absorbe como el resto de nutrientes.",
      "Regula la digestión y prolonga la sensación de saciedad.",
      "Es el alimento de las bacterias buenas de tu intestino.",
    ],
    donde: ["Verduras", "Fruta con piel", "Legumbres", "Avena", "Cereales integrales"],
    tarjetas: [
      {
        key: "soluble",
        titulo: "Fibra soluble",
        foto: "/recorrido/nutricion/moleculas/fibrasoluble.webp",
        parrafos: [
          "Se disuelve en agua y forma un gel dentro del intestino. Ese gel ralentiza la digestión, hace que la glucosa llegue más lentamente a la sangre y ayuda a reducir los niveles de colesterol.",
          "Se encuentra en alimentos como la avena, las legumbres, las manzanas o las semillas de chía.",
        ],
      },
      {
        key: "insoluble",
        titulo: "Fibra insoluble",
        foto: "/recorrido/nutricion/moleculas/fibrainsoluble.webp",
        parrafos: [
          "No se disuelve en agua y apenas cambia durante la digestión. Aumenta el volumen del contenido intestinal y facilita su paso, ayudando a mantener un tránsito intestinal saludable.",
          "Se encuentra sobre todo en cereales integrales, verduras, frutos secos y la piel de muchas frutas.",
        ],
      },
      {
        key: "fermentable",
        titulo: "Fibra fermentable",
        foto: "/recorrido/nutricion/moleculas/fibrafermentable.webp",
        parrafos: [
          "Algunas fibras pueden ser fermentadas por las bacterias del intestino grueso. Al hacerlo producen ácidos grasos de cadena corta, como el butirato, el propionato y el acetato, que ayudan a mantener sana la pared intestinal y participan en la regulación del metabolismo y del sistema inmunitario.",
        ],
      },
    ],
  },
  {
    key: "colesterol",
    label: "Colesterol",
    color: "#e6c34d",
    img: "/recorrido/nutricion/portadas/colesterolportada.webp",
    resumen: "Ni bueno ni malo: materia prima esencial.",
    descripcion: [
      "El colesterol es esencial para el organismo. Forma parte de la membrana de todas tus células y es la base para fabricar hormonas, vitamina D y sales biliares.",
      "El hígado produce la mayor parte del colesterol que necesitas. Lo importante no es solo la cantidad de colesterol, sino también la forma en que se transporta por la sangre, mediante las lipoproteínas HDL y LDL.",
    ],
    tipos: [
      { nombre: "HDL", desc: "Mitad proteína: densa. Recoge el colesterol sobrante y lo devuelve al hígado." },
      { nombre: "LDL", desc: "Mitad colesterol: ligera. Lo reparte a las células y en exceso se queda en las arterias." },
    ],
    queHacen: [
      "Forma parte de la membrana de todas tus células y les da firmeza.",
      "Es la base con la que se fabrican hormonas, vitamina D y sales biliares.",
      "El cuerpo fabrica la mayor parte en el hígado; solo una parte viene de la dieta.",
    ],
    donde: ["Huevo", "Vísceras", "Marisco", "Lácteos enteros", "Carnes grasas"],
    tarjetas: [
      {
        key: "colesterol",
        titulo: "Colesterol",
        foto: "/recorrido/nutricion/moleculas/colesterol.webp",
        parrafos: [
          "El colesterol es una molécula grasa (un lípido) que forma parte de la membrana de todas tus células, dándoles firmeza y a la vez flexibilidad, es como el cemento de la membrana celular.",
          "Es la materia prima con la que el cuerpo fabrica hormonas (como los estrógenos, la testosterona o el cortisol), también fabrica vitamina D y las sales biliares que ayudan a digerir las grasas.",
          "La mayor parte del colesterol la fabrica tu propio hígado; solo una pequeña parte procede de los alimentos. Por eso no es ni bueno ni malo: es imprescindible. El problema no es el colesterol en sí, sino cómo viaja por la sangre.",
          "Como es grasa, no se disuelve en la sangre (que es agua). Para poder moverse, viaja empaquetado dentro de unas partículas llamadas lipoproteínas: las dos principales son la LDL y la HDL.",
          "Imagina cada lipoproteína como una pelotita: por dentro la carga de grasa, y por fuera una cáscara de proteínas que hace de envoltorio y de etiqueta. Todas llevan las dos cosas; lo que cambia entre ellas es la proporción.",
          "Y de ahí salen sus nombres, que no tienen nada que ver con «bueno» y «malo». La grasa flota y la proteína pesa. Una partícula con mucha grasa y poca proteína es ligera: baja densidad, LDL (Low Density Lipoprotein). Una con mucha proteína y poca grasa es pesada: alta densidad, HDL (High Density Lipoprotein). Se llaman así, literalmente, porque se descubrieron separándolas por peso en una centrifugadora.",
          "En números redondos: en una LDL, alrededor de la mitad de su peso es colesterol y solo un cuarto es proteína. En una HDL es justo al revés, en torno a la mitad es proteína y el colesterol es la parte pequeña. Misma carga, proporciones opuestas.",
        ],
      },
      {
        key: "hdl",
        titulo: "HDL",
        foto: "/recorrido/nutricion/moleculas/hdl.webp",
        parrafos: [
          "La HDL (lipoproteína de alta densidad) es la partícula que hace el camino de vuelta: recoge el colesterol sobrante de los tejidos y de las paredes de las arterias y lo devuelve al hígado para reciclarlo o eliminarlo.",
          "Qué lleva dentro: es la más densa porque es la que MÁS proteína tiene, alrededor de la mitad de su peso. Su proteína principal se llama apoA-I. El colesterol es en ella la parte pequeña, en torno a un quinto. Mucho envase y poca carga: por eso pesa y por eso es «de alta densidad».",
          "Tiene sentido si piensas en su trabajo. La HDL sale del hígado casi vacía, como un camión que va a recoger, y se va llenando por el camino con el colesterol que va retirando de los tejidos. Empieza siendo casi solo proteína y se va cargando.",
          "Por eso se le llama coloquialmente «colesterol bueno»: ayuda a retirar el exceso y a mantener las arterias limpias.",
          "Unos niveles altos de HDL se asocian con una mejor salud cardiovascular. El ejercicio físico y las grasas saludables (aceite de oliva, pescado azul, tofu, frutos secos) ayudan a elevarla.",
          "Un matiz que conviene conocer: cuando se han probado fármacos para subir la HDL, no se han reducido los infartos. Eso sugiere que una HDL alta es sobre todo la señal de un metabolismo que funciona bien, más que la causa de esa buena salud. Sube por hacer las cosas bien; no basta con subirla.",
        ],
      },
      {
        key: "ldl",
        titulo: "LDL",
        foto: "/recorrido/nutricion/moleculas/ldl.webp",
        parrafos: [
          "La LDL (lipoproteína de baja densidad) es la partícula que reparte el colesterol desde el hígado hacia las células que lo necesitan.",
          "Qué lleva dentro: es la que MÁS colesterol transporta, en torno a la mitad de su peso, y solo alrededor de un cuarto es proteína. Al ir tan cargada de grasa y llevar tan poco envase, pesa poco: por eso es «de baja densidad». Lleva una única proteína grande, la apoB-100, que funciona como etiqueta de reparto: es la que reconocen las células para engancharla y quedarse con su carga.",
          "Fíjate en la simetría con la HDL: la LDL sale del hígado llena y va repartiendo, mientras que la HDL sale vacía y va recogiendo. Una es el camión de reparto y la otra el de recogida. Y como el colesterol pesa menos que la proteína, la que va cargada de colesterol es precisamente la ligera.",
          "Se le llama coloquialmente «colesterol malo», pero cumple una función necesaria: sin ella tus células no recibirían el colesterol con el que fabrican sus membranas y tus hormonas. El problema aparece cuando hay demasiadas partículas LDL circulando durante demasiado tiempo: acaban colándose en la pared de la arteria, oxidándose allí y atrayendo a células inmunitarias que se las tragan y se quedan atrapadas, formando la placa que va estrechando el vaso (aterosclerosis).",
          "De ahí una idea importante: lo que más cuenta no es solo cuánto colesterol llevan, sino cuántas partículas hay. Como cada LDL lleva exactamente una apoB-100, medir la apoB es contar partículas, y suele reflejar el riesgo mejor que el colesterol LDL a secas. Si aparece en tu analítica, ya sabes qué está contando.",
          "Por eso interesa mantener la LDL en niveles adecuados, sobre todo evitando el exceso de grasas trans, el tabaco y el sobrepeso.",
        ],
      },
    ],
  },
  {
    key: "etanol",
    label: "Etanol",
    color: "#b56576",
    img: "/recorrido/nutricion/portadas/alcohol.webp",
    resumen: "Alcohol: energía vacía que el cuerpo prioriza.",
    descripcion: [
      "El etanol es el alcohol presente en las bebidas alcohólicas. Aporta 7 kcal por gramo, pero no contiene vitaminas ni minerales, por lo que se considera una fuente de «calorías vacías». Es más, el organismo lo trata como una sustancia potencialmente tóxica y lo metaboliza en el hígado con prioridad sobre otros nutrientes.",
    ],
    tipos: [
      { nombre: "Etanol", desc: "El único alcohol que bebemos. Se forma al fermentar azúcares." },
      { nombre: "Metanol y otros", desc: "Tóxicos: no son aptos para el consumo." },
    ],
    queHacen: [
      "Aporta 7 kcal por gramo, pero sin vitaminas ni minerales: «calorías vacías».",
      "El cuerpo lo trata como un tóxico y lo procesa en el hígado antes que nada.",
      "Mientras lo elimina, frena la quema de grasa y sobrecarga el hígado.",
    ],
    donde: ["Vino", "Cerveza", "Licores y destilados", "Fermentados alcohólicos"],
    tarjetas: [
      {
        key: "etanol",
        titulo: "Etanol (CH₃CH₂OH)",
        numero: 1,
        foto: "/recorrido/nutricion/moleculas/etanol.webp",
        parrafos: [
          "Es la molécula presente en las bebidas alcohólicas.",
          "Aporta energía (7 kcal por gramo, casi las mismas que la grasa, es decir el alcohol es muy calórico), pero no es un nutriente esencial ni participa en la construcción de tejidos.",
          "Cuando llega al hígado, el organismo prioriza eliminarlo porque puede resultar tóxico para las células. Es más, aunque lo elimine rápidamente, siempre causa algún daño secundario. Nuestras acciones no son gratis.",
        ],
      },
      {
        key: "acetaldehido",
        titulo: "Acetaldehído (CH₃CHO)",
        numero: 2,
        foto: "/recorrido/nutricion/moleculas/acetaldehido.webp",
        parrafos: [
          "Es la primera molécula que se forma cuando el hígado metaboliza el etanol.",
          "Es mucho más reactiva y tóxica que el propio alcohol, pudiendo dañar proteínas, membranas y ADN si permanece demasiado tiempo en las células. Por eso el organismo intenta transformarla rápidamente.",
        ],
      },
      {
        key: "acetato",
        titulo: "Acetato (CH₃COO⁻)",
        numero: 3,
        foto: "/recorrido/nutricion/moleculas/acetatoalcohol.webp",
        parrafos: [
          "Es el producto final del metabolismo del alcohol. Es una molécula mucho menos tóxica que puede utilizarse para producir energía o eliminarse.",
          "Transformar el acetaldehído en acetato es uno de los principales objetivos del hígado tras consumir alcohol.",
        ],
      },
    ],
  },
  {
    key: "agua",
    label: "Agua",
    color: "#4aa3c7",
    img: "/recorrido/nutricion/portadas/agua.webp",
    resumen: "El medio donde ocurre toda la Vida.",
    descripcion: [
      "El agua es una molécula asimétrica: dos hidrógenos unidos a un oxígeno formando una uve. Como el oxígeno tira más de los electrones, un extremo queda con carga negativa y el otro positiva, así que cada molécula funciona como un imán diminuto. De esa asimetría sale todo lo demás: por eso rodea a las sales y los azúcares y los mantiene disueltos y en movimiento, y por eso no puede agarrar a las grasas, que al huir de ella forman las membranas de tus células.",
      "En el cuerpo hace tres trabajos a la vez: es el medio donde ocurren todas las reacciones químicas (y participa en muchas de ellas), es el sistema de transporte, porque la sangre es agua con cosas dentro, y es el regulador de la temperatura. Además lubrica articulaciones y ojos y amortigua el cerebro.",
      "Y da volumen: el agua del plasma es la que llena los vasos y sostiene la tensión arterial. Cómo se reparte entre la sangre, los tejidos y el interior de las células lo decide el sodio, porque el agua siempre se mueve hacia donde hay más sales. Por eso hidratarse no es solo beber, es beber con sales.",
    ],
    tipos: [
      { nombre: "Agua intracelular", desc: "Dentro de las células: unos dos tercios del total." },
      { nombre: "Agua del plasma", desc: "La que llena los vasos y da volumen a la sangre." },
      { nombre: "Agua intersticial", desc: "La que baña a las células por fuera, entre unas y otras." },
    ],
    queHacen: [
      "Es el medio de toda reacción química, y participa en muchas de ellas.",
      "Da volumen a la sangre y transporta todo lo que va disuelto.",
      "Regula la temperatura, lubrica y amortigua.",
    ],
    donde: ["Agua", "Frutas y verduras", "Caldos y sopas", "Infusiones", "Lácteos"],
  },
  {
    key: "fitoquimicos",
    label: "Fitoquímicos",
    color: "#8e5aa8",
    img: "/recorrido/nutricion/portadas/fitoquimico.webp",
    resumen: "La defensa de las plantas, a tu favor.",
    descripcion: [
      "Los fitoquímicos son compuestos naturales que las plantas producen para protegerse y que también benefician a nuestra salud. Muchos actúan como antioxidantes que neutralizan los radicales libres, mientras que otros activan mecanismos de defensa del propio organismo. Cada color de frutas y verduras esconde una familia distinta de fitoquímicos. Por eso, una alimentación variada y rica en vegetales aporta una mayor diversidad de estos compuestos beneficiosos.",
    ],
    tipos: [
      { nombre: "Flavonoides", desc: "Pigmentos antioxidantes de frutas, verduras y té." },
      { nombre: "Carotenoides", desc: "Los pigmentos naranjas y rojos (zanahoria, tomate)." },
      { nombre: "Glucosinolatos", desc: "De las crucíferas (brócoli): activan enzimas protectoras." },
    ],
    queHacen: [
      "Muchos actúan como antioxidantes y neutralizan radicales libres.",
      "Otros activan genes que hacen fabricar enzimas protectoras propias.",
      "Cada color esconde una familia distinta con funciones distintas.",
    ],
    donde: ["Frutas de colores", "Verduras", "Legumbres", "Frutos secos", "Especias (cúrcuma)"],
    tarjetas: [
      {
        key: "antocianinas",
        titulo: "Antocianinas",
        foto: "/recorrido/nutricion/moleculas/antocianinas.webp",
        parrafos: [
          "Son los pigmentos que dan el color morado, azul y rojo intenso a alimentos como los arándanos, las moras, las cerezas o la col lombarda.",
          "En las plantas ayudan a proteger frente a la radiación ultravioleta y al estrés ambiental.",
          "En nuestro organismo actúan como antioxidantes, es decir, donan electrones a radicales libres (moléculas que buscan electrones) antes de que dañen proteínas, grasas o ADN.",
          "Además, pueden mejorar la función del endotelio, la capa que recubre el interior de los vasos sanguíneos, favoreciendo una buena salud cardiovascular. Lo hacen porque estimulan una enzima que eleva la disponibilidad de óxido nítrico, un gas que relaja y dilata los vasos sanguíneos.",
        ],
      },
      {
        key: "carotenoides",
        titulo: "Carotenoides",
        foto: "/recorrido/nutricion/moleculas/carotenoides.webp",
        parrafos: [
          "Son pigmentos amarillos, naranjas y rojos presentes en zanahorias, calabazas, tomates, pimientos y muchas frutas.",
          "En las plantas capturan parte de la energía de la luz y las protegen del exceso de radiación solar.",
          "Algunos, como el betacaroteno, pueden transformarse en vitamina A. Otros, como la luteína y la zeaxantina, se acumulan en la retina, donde ayudan a filtrar la luz azul y protegen las células fotorreceptoras frente al daño oxidativo.",
        ],
      },
      {
        key: "flavonoides",
        titulo: "Flavonoides",
        foto: "/recorrido/nutricion/moleculas/flavonoides.webp",
        parrafos: [
          "Constituyen una de las familias más abundantes de fitoquímicos y se encuentran en frutas, verduras, cebolla, cacao, té y cítricos.",
          "Muchas de estas moléculas actúan como antioxidantes, pero también regulan la actividad de enzimas y proteínas implicadas en la inflamación, la coagulación y la función de los vasos sanguíneos.",
          "Algunos incluso favorecen la producción de óxido nítrico, ayudando a que las arterias se relajen.",
          "Profundiza: Los flavonoides son capaces de hacer esto porque inhiben las enzimas que fabrican prostaglandinas, que regulan la contracción y el dolor; frenan las señales que activan la formación de trombos; favorece la producción de óxido nítrico, el cual relaja las arterias, porque activa una enzima encargada de fabricarlo."
        ],
      },
      {
        key: "glucosinolatos",
        titulo: "Glucosinolatos",
        foto: "/recorrido/nutricion/moleculas/glucosinolatos.webp",
        parrafos: [
          "Son compuestos característicos del brócoli, la col, la coliflor o las coles de Bruselas.",
          "Mientras la planta permanece intacta apenas reaccionan, pero al cortarla o masticarla entran en contacto con una enzima, que los transforma en moléculas como el sulforafano.",
          "Estas aumentan la producción de enzimas antioxidantes y de desintoxicación propias de nuestras células.",
        ],
      },
      {
        key: "polifenoles",
        titulo: "Polifenoles",
        foto: "/recorrido/nutricion/moleculas/polifenoles.webp",
        parrafos: [
          "Los polifenoles son una gran familia que engloba miles de fitoquímicos, incluidos muchos flavonoides.",
          "Se encuentran en el aceite de oliva virgen extra, el cacao, el café, las uvas, el té y numerosos frutos.",
          "Más que actuar directamente como antioxidantes, muchos funcionan como moléculas señalizadoras que modifican la expresión de genes relacionados con la inflamación, el metabolismo y la protección frente al estrés oxidativo.",
        ],
      },
      {
        key: "fitoesteroles",
        titulo: "Fitoesteroles",
        foto: "/recorrido/nutricion/moleculas/fitoesteroles.webp",
        parrafos: [
          "Son moléculas vegetales con una estructura muy parecida al colesterol.",
          "Durante la digestión compiten con él por los mismos transportadores del intestino, reduciendo así la cantidad de colesterol que conseguimos absorber.",
          "Como consecuencia, el hígado capta más colesterol de la sangre para compensar esa pérdida, contribuyendo a disminuir los niveles de colesterol LDL.",
        ],
      },
      {
        key: "terpenos",
        titulo: "Terpenos",
        foto: "/recorrido/nutricion/moleculas/terpenos.webp",
        parrafos: [
          "Son una enorme familia de moléculas aromáticas presentes en hierbas, especias, cítricos y muchas plantas medicinales.",
          "En la naturaleza sirven para atraer polinizadores, repeler insectos o defenderse de microorganismos.",
          "Algunos, como el limoneno, el mentol o el pineno, también muestran propiedades antioxidantes, antiinflamatorias y antimicrobianas para nosotros.",
        ],
      },
      {
        key: "licopeno",
        titulo: "Licopeno",
        foto: "/recorrido/nutricion/moleculas/licopeno.webp",
        parrafos: [
          "El licopeno es un carotenoide responsable del intenso color rojo del tomate, la sandía y el pomelo rosa.",
          "Destaca por su capacidad para neutralizar el oxígeno singlete, una forma muy reactiva del oxígeno que puede dañar las membranas celulares y el ADN.",
          "Diversos estudios lo relacionan con una mejor salud cardiovascular y con la protección de algunos tejidos, como la próstata, aunque todavía se sigue investigando su papel exacto.",
        ],
      },
      {
        key: "isoflavonas",
        titulo: "Isoflavonas",
        foto: "/recorrido/nutricion/moleculas/isoflavonas.webp",
        parrafos: [
          "Son flavonoides presentes principalmente en la soja, el tofu, el tempeh y otros derivados.",
          "Su estructura se parece a la de los estrógenos humanos, por lo que pueden unirse a algunos de sus receptores, aunque con una intensidad mucho menor.",
          "Dependiendo del tejido, pueden activar o bloquear parcialmente esos receptores, motivo por el que se estudian por su posible papel en la salud ósea, cardiovascular y en el alivio de algunos síntomas de la menopausia.",
        ],
      },
    ],
  },
  {
    key: "edulcorantes",
    label: "Edulcorantes",
    color: "#c94f7c",
    img: "/recorrido/nutricion/portadas/edulcorantes.webp",
    resumen: "Dulzor sin azúcar: qué le hacen al cerebro.",
    descripcion: [
      "Los edulcorantes no son un nutriente: son moléculas que encajan en tu receptor del dulce sin ser un combustible. Tu lengua las lee como azúcar, tu metabolismo no puede usarlas, y casi todas salen del cuerpo tal como entraron. De ahí sus cero calorías: no son mágicas, simplemente son moléculas que no sabes digerir.",
      "Su potencia es enorme. La sacarina endulza unas 300 veces más que el azúcar, la sucralosa unas 600 y hay algunas que superan las 20.000 veces. Por eso la cantidad que llevas encima en un refresco «zero» es minúscula, y por eso los edulcorantes de mesa vienen mezclados con un relleno: solos serían imposibles de dosificar.",
      "Lo interesante no es lo que aportan, sino lo que descolocan. El dulce, para tu cuerpo, no es un sabor: es un anuncio de que viene energía. Cuando el anuncio llega y la energía no, el cuerpo responde a esa contradicción, y ahí está toda la discusión sobre ellos.",
    ],
    tipos: [
      { nombre: "Intensos artificiales", desc: "Aspartamo, sucralosa, sacarina, acesulfamo K. Sintéticos y potentísimos." },
      { nombre: "Intensos de planta", desc: "Estevia y fruta del monje. Naturales, pero igual de intensos." },
      { nombre: "Polialcoholes", desc: "Eritritol, xilitol, sorbitol, maltitol. Dulzor suave y efecto laxante." },
    ],
    queHacen: [
      "Activan tu receptor del dulce sin aportar energía utilizable.",
      "Disparan una predicción de glucosa que luego no se cumple.",
      "No dan caries ni suben el azúcar, pero mantienen el hábito del dulce.",
    ],
    donde: ["Refrescos «zero»", "Yogures y postres 0%", "Chicles «sin azúcar»", "Proteína en polvo", "Salsas y galletas light"],
    tarjetas: [
      {
        key: "aspartamo",
        titulo: "Aspartamo",
        foto: "/recorrido/nutricion/moleculas/aspartamo.webp",
        parrafos: [
          "Es el edulcorante de los refrescos «light» clásicos y endulza unas 200 veces más que el azúcar.",
          "Es el único que sí se digiere: está hecho de dos aminoácidos (ácido aspártico y fenilalanina) más un poco de metanol, y el intestino lo parte en esas piezas, que ya existen en la comida normal. Por eso técnicamente sí tiene calorías, pero se usa en cantidades tan pequeñas que no cuentan.",
          "Por esa fenilalanina lleva un aviso en la etiqueta: las personas con fenilcetonuria, una enfermedad genética que impide procesarla, deben evitarlo.",
          "En 2023 la Organización Mundial de la Salud lo clasificó como «posiblemente cancerígeno» a partir de evidencia limitada, y al mismo tiempo mantuvo intacta la cantidad diaria admisible. Traducido: la señal es débil y el consumo habitual se sigue considerando aceptable, pero no es un producto sobre el que apoyarse.",
        ],
      },
      {
        key: "sucralosa",
        titulo: "Sucralosa",
        foto: "/recorrido/nutricion/moleculas/sucralosa.webp",
        parrafos: [
          "Se fabrica a partir del azúcar, sustituyendo tres de sus piezas por cloro. Ese pequeño cambio la vuelve unas 600 veces más dulce y, sobre todo, indigerible: tus enzimas ya no la reconocen.",
          "La mayor parte atraviesa el intestino sin absorberse y sale por las heces, lo que la hace muy estable, también al calor, y por eso es la habitual en productos horneados «sin azúcar».",
          "Es una de las que más se ha estudiado por su posible efecto sobre la microbiota, con resultados que varían mucho de una persona a otra.",
        ],
      },
      {
        key: "estevia",
        titulo: "Estevia",
        foto: "/recorrido/nutricion/moleculas/estevia.webp",
        parrafos: [
          "Lo que se usa no es la hoja, sino unas moléculas extraídas de ella, los glucósidos de esteviol, unas 300 veces más dulces que el azúcar.",
          "Que venga de una planta no cambia lo esencial: sigue siendo un dulzor intenso sin energía detrás, y tu cerebro no distingue el origen. La bacteria del intestino le quita los azúcares que lleva colgando y el resto se absorbe, pasa por el hígado y se elimina por la orina.",
          "Su punto débil es el sabor: deja un regusto amargo o metálico, y por eso casi siempre viene mezclada con eritritol.",
        ],
      },
      {
        key: "eritritol",
        titulo: "Eritritol",
        foto: "/recorrido/nutricion/moleculas/eritritol.webp",
        parrafos: [
          "Es un polialcohol: ni azúcar ni edulcorante intenso, sino algo intermedio. Endulza un 70% de lo que endulza el azúcar, así que se usa a cucharadas y no a gotas, y deja una sensación fresca en la boca.",
          "A diferencia de sus hermanos, se absorbe en el intestino delgado y se elimina casi intacto por la orina, así que sienta mejor y apenas fermenta. Tu propio cuerpo, además, fabrica pequeñas cantidades a partir de la glucosa.",
          "En 2023 se publicó un trabajo que asoció niveles altos de eritritol en sangre con más agregación de plaquetas y más eventos cardiovasculares. Es un hallazgo por confirmar y no una condena, pero es la razón por la que ha dejado de tratarse como el edulcorante inofensivo por defecto.",
        ],
      },
      {
        key: "xilitol",
        titulo: "Xilitol",
        foto: "/recorrido/nutricion/moleculas/xilitol.webp",
        parrafos: [
          "Otro polialcohol, con un dulzor casi idéntico al del azúcar. Es el de los chicles y las pastas de dientes «sin azúcar», y ahí tiene una ventaja real: las bacterias de la boca no pueden fermentarlo, así que no produce caries e incluso dificulta que se formen.",
          "Se absorbe solo en parte, así que buena parte llega al colon, donde la microbiota lo fermenta. De ahí los gases, la hinchazón y el efecto laxante si se pasa de cantidad.",
          "Un aviso importante que casi nadie conoce: es muy tóxico para los perros, incluso en dosis pequeñas. Un chicle olvidado en un bolso puede ser un problema serio.",
        ],
      },
    ],
  },
];

// El recorrido de nutrientes se divide en DOS páginas para hacer más trayecto:
//   · /metodo/nutricion/nutrientes            → NUTRIENTES_PRINCIPALES (hasta Fibra)
//   · /metodo/nutricion/nutrientes-secundarios → NUTRIENTES_SECUNDARIOS (el resto)
// La página de detalle sigue buscando en NUTRIENTES (la lista completa), así que
// ambos grupos funcionan igual al abrir una tarjeta.
const CORTE_SECUNDARIOS = NUTRIENTES.findIndex((n) => n.key === "fibra") + 1;
export const NUTRIENTES_PRINCIPALES = NUTRIENTES.slice(0, CORTE_SECUNDARIOS);
export const NUTRIENTES_SECUNDARIOS = NUTRIENTES.slice(CORTE_SECUNDARIOS);

// Dado un key de nutriente, indica a qué página de la rejilla pertenece (para
// que el botón «Volver» del detalle regrese a la página correcta).
export const rutaListaNutriente = (key: string): string =>
  NUTRIENTES_SECUNDARIOS.some((n) => n.key === key)
    ? "/metodo/nutricion/nutrientes-secundarios"
    : "/metodo/nutricion/nutrientes";
