import type { NutrienteTarjeta } from "./NutrientesNutricion";

// ── Página «Preguntas y mitos» del recorrido de Nutrición.
// Cada mito es una tarjeta (misma forma que NutrienteTarjeta): la pregunta como
// título, su viñeta y la respuesta en párrafos. Se abre en el visor de
// ilustración (NutrienteFichaModal), con el fondo de la disciplina cambiado.
//
// Fotos (pendientes de subir): /recorrido/nutricion/mitos/<key>.png
// Mientras no existan, el visor muestra la inicial de la pregunta como marcador.

export const MITOS_NUTRICION: NutrienteTarjeta[] = [
  {
    key: "soja-cancer",
    titulo: "¿La soja causa cáncer?",
    foto: "/recorrido/nutricion/mitos/soja-cancer.png",
    parrafos: [
      "La soja contiene isoflavonas, unas moléculas llamadas fitoestrógenos porque se parecen a los estrógenos humanos. Por eso pueden unirse a algunos de sus receptores, aunque con una fuerza muchísimo menor.",
      "El miedo nació de experimentos en ratones a los que se daban dosis enormes de isoflavonas aisladas, muy lejos de lo que aporta un plato de tofu o edamame. En personas, los estudios no encuentran que el consumo habitual de soja aumente el riesgo de cáncer.",
      "De hecho, en el cáncer de mama la evidencia apunta a un efecto neutro o incluso ligeramente protector. Comer soja como alimento (tofu, tempeh, edamame, bebida de soja) en cantidades normales es seguro.",
    ],
  },
  {
    key: "soja-hombres",
    titulo: "¿La soja es mala para los hombres?",
    foto: "/recorrido/nutricion/mitos/soja-hombres.png",
    parrafos: [
      "El mito dice que, al contener fitoestrógenos, la soja «feminiza» o baja la testosterona. Pero recuerda: esas moléculas son estrógenos muy débiles y nuestro cuerpo los regula.",
      "Los análisis que reúnen muchos estudios en hombres no encuentran cambios en los niveles de testosterona ni de estrógenos, ni efectos sobre la fertilidad, con un consumo normal de soja.",
      "Los pocos casos llamativos que circulan venían de consumos extremos y muy poco realistas. Para la inmensa mayoría, la soja es una fuente de proteína vegetal perfectamente saludable.",
    ],
  },
  {
    key: "azucar-adictivo",
    titulo: "¿Por qué el azúcar «engancha»?",
    foto: "/recorrido/nutricion/mitos/azucar-adictivo.png",
    parrafos: [
      "El azúcar activa el circuito de recompensa del cerebro liberando dopamina, la misma señal que nos empuja a repetir lo que nos gusta. Es un mecanismo natural: la energía rápida siempre fue valiosa para sobrevivir.",
      "En los ultraprocesados ese efecto se dispara, porque combinan azúcar, grasa y sal en proporciones que casi no existen en la naturaleza y que resultan enormemente apetecibles.",
      "Además, el azúcar provoca un pico de glucosa seguido de una bajada brusca. Esa «montaña rusa» genera más hambre y antojos al poco rato. No es una adicción química como la de las drogas, pero sí un potente impulso a querer más.",
    ],
  },
  {
    key: "azucar-energia",
    titulo: "¿De verdad el azúcar da energía?",
    foto: "/recorrido/nutricion/mitos/azucar-energia.png",
    parrafos: [
      "Sí y no. La glucosa es la molécula con la que nuestras células fabrican ATP con más facilidad, así que el azúcar da energía de forma muy rápida.",
      "El problema es que esa energía dura poco: el pico de glucosa dispara la insulina, la glucosa baja de golpe y a menudo acabamos más cansados y con más hambre que antes.",
      "La energía estable y sostenida viene de los carbohidratos acompañados de fibra (avena, legumbres, fruta entera), que se absorben poco a poco. El famoso «subidón de azúcar» es breve y, en buena parte, un mito.",
    ],
  },
  {
    key: "sueno-comer",
    titulo: "¿Por qué me da sueño después de comer?",
    foto: "/recorrido/nutricion/mitos/sueno-comer.png",
    parrafos: [
      "Tras una comida, el cuerpo dedica recursos a la digestión y libera insulina. Esa insulina facilita que un aminoácido llamado triptófano entre en el cerebro, donde se transforma en serotonina y melatonina, moléculas que invitan al descanso.",
      "Si la comida es abundante y rica en azúcares o harinas refinadas, el pico y la bajada de glucosa acentúan ese bajón de energía.",
      "A todo esto se suma el ritmo circadiano: a primera hora de la tarde hay una somnolencia natural, comas lo que comas. Platos más ligeros y equilibrados ayudan a notarlo menos.",
    ],
  },
  {
    key: "huevos-colesterol",
    titulo: "¿Los huevos suben el colesterol?",
    foto: "/recorrido/nutricion/mitos/huevos-colesterol.png",
    parrafos: [
      "El huevo tiene colesterol, pero el colesterol que comemos influye mucho menos en el de la sangre de lo que se pensaba. Nuestro hígado fabrica la mayor parte y ajusta su producción según lo que llega de la dieta.",
      "Para la mayoría de las personas, comer huevos con normalidad no aumenta el riesgo cardiovascular. Lo que más eleva el colesterol «malo» (LDL) es un exceso de grasas trans y saturadas.",
      "Existe una minoría de personas que responden más al colesterol de la dieta, pero incluso ahí el contexto global de la alimentación pesa mucho más que el huevo en sí.",
    ],
  },
  {
    key: "grasa-engorda",
    titulo: "¿Comer grasa engorda?",
    foto: "/recorrido/nutricion/mitos/grasa-engorda.png",
    parrafos: [
      "La grasa es el nutriente con más calorías por gramo, así que en exceso, como cualquier alimento, contribuye a engordar. Pero la grasa de la comida no se convierte directamente en grasa corporal.",
      "Lo que hace ganar o perder peso es el balance total de energía a lo largo del tiempo, no un nutriente aislado.",
      "Además, las grasas saludables (aceite de oliva, aguacate, frutos secos, pescado azul) son imprescindibles: forman tus membranas, transportan vitaminas y son la base de muchas hormonas. Quitarlas del todo no es ni necesario ni sano.",
    ],
  },
  {
    key: "detox",
    titulo: "¿Los zumos «detox» limpian el cuerpo?",
    foto: "/recorrido/nutricion/mitos/detox.png",
    parrafos: [
      "Tu cuerpo ya tiene un sistema de desintoxicación potentísimo: el hígado y los riñones trabajan sin descanso para transformar y eliminar lo que no necesita. Ningún zumo hace ese trabajo por ellos.",
      "Muchos «detox» son, además, zumos de fruta sin su fibra, así que aportan una gran carga de azúcar de absorción rápida, justo lo contrario de lo que buscan.",
      "Lo que de verdad ayuda a tu hígado y a tus riñones es beber agua, comer fruta y verdura enteras, dormir bien y moderar el alcohol. No hay atajos milagrosos.",
    ],
  },
];
