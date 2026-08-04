// ─────────────────────────────────────────────────────────────────────────
// RECETAS TRADICIONALES · una cocina por elemento (paso 8 del recorrido TCM)
//
// En Medicina China la cocina es la primera farmacia: se elige el alimento por
// su sabor, su naturaleza (fría/templada/caliente) y el órgano al que entra.
// Aquí van recetas clásicas de la dietética china (shi liao, 食療), agrupadas
// por el elemento al que nutren.
//
// ✍️  EDITAR CONTENIDO: cambia los textos aquí. No cambies las `key`.
// ─────────────────────────────────────────────────────────────────────────
import type { Elemento } from "./tcmRecorrido";

export interface Receta {
  /** Clave estable (no cambiar tras publicar). */
  key: string;
  nombre: string;
  /** Nombre chino, si la receta es clásica. */
  hanzi?: string;
  /** Para qué se usa tradicionalmente (una línea). */
  para: string;
  /** Tiempo aproximado de preparación. */
  tiempo: string;
  /** Naturaleza del plato: templado, neutro, refrescante… */
  naturaleza: string;
  ingredientes: string[];
  pasos: string[];
  /** Cuándo tomarla (estación, momento del día, frecuencia). */
  cuando: string;
  /** Nota o precaución. */
  nota?: string;
}

/** Cómo se cocina para cada elemento (cabecera de cada bloque). */
export const COCINA_ELEMENTO: Record<Elemento, { sabor: string; principio: string }> = {
  madera: {
    sabor: "Ácido",
    principio:
      "La Madera pide verde, ligero y ligeramente ácido: lo que ayuda al hígado a mover el Qi y a soltar la tensión. Cocciones cortas, al vapor o al salteado rápido, sobre todo en primavera.",
  },
  fuego: {
    sabor: "Amargo",
    principio:
      "El Fuego se calma con lo amargo y lo ligeramente refrescante: lo que baja el calor del corazón y devuelve el sueño. Nada de exceso de picante ni de alcohol, y cenas ligeras.",
  },
  tierra: {
    sabor: "Dulce",
    principio:
      "La Tierra se nutre con lo dulce natural, templado y cocinado: cereales, raíces y calabazas. El bazo odia el frío y los crudos; todo lo que entra caliente le ahorra trabajo.",
  },
  metal: {
    sabor: "Picante",
    principio:
      "El Metal pide blanco, jugoso y ligeramente picante: lo que humedece el pulmón y abre la respiración. En otoño, cuando la sequedad aprieta, lo dulce-húmedo es medicina.",
  },
  agua: {
    sabor: "Salado",
    principio:
      "El Agua se rellena con lo oscuro, lo mineral y lo cocinado largo: caldos, legumbres negras, semillas y frutos secos. En invierno, cocciones lentas y calor en la zona lumbar.",
  },
};

// ─────────────────────────────────────────────────────────────────────────
// LAS RECETAS
// ─────────────────────────────────────────────────────────────────────────
export const RECETAS_ELEMENTO: Record<Elemento, Receta[]> = {
  // ── MADERA · hígado y vesícula biliar ────────────────────────────────────
  madera: [
    {
      key: "madera-te-crisantemo-goji",
      nombre: "Té de crisantemo y goji",
      hanzi: "菊花枸杞茶",
      para: "Aclarar el hígado y descansar los ojos cansados.",
      tiempo: "5 min",
      naturaleza: "Refrescante",
      ingredientes: [
        "1 cucharada de flores de crisantemo secas",
        "1 cucharada de bayas de goji",
        "300 ml de agua muy caliente (sin llegar a hervir)",
        "Opcional: 2 rodajas finas de regaliz o un poco de miel",
      ],
      pasos: [
        "Enjuaga las flores y las bayas con un poco de agua caliente y descarta esa primera agua.",
        "Vierte los 300 ml de agua caliente sobre ellas y tapa.",
        "Deja reposar 5 minutos y bebe a sorbos, mirando lejos de la pantalla.",
      ],
      cuando: "A media tarde, sobre todo en primavera o en épocas de mucho ordenador.",
      nota: "Si tiendes al frío y a las digestiones lentas, tómalo con moderación: el crisantemo es refrescante.",
    },
    {
      key: "madera-salteado-verdes",
      nombre: "Salteado de verdes con jengibre y limón",
      para: "Mover el Qi del hígado cuando hay tensión y sensación de estancamiento.",
      tiempo: "15 min",
      naturaleza: "Templada",
      ingredientes: [
        "Un manojo de verdes de hoja (pak choi, acelga, espinaca o brócoli)",
        "2 rodajas de jengibre fresco en juliana",
        "1 diente de ajo laminado",
        "1 cucharadita de aceite de sésamo",
        "Ralladura y unas gotas de limón",
        "Una pizca de sal marina",
      ],
      pasos: [
        "Calienta el aceite y saltea el jengibre y el ajo 30 segundos, sin que se quemen.",
        "Añade los verdes cortados grandes y saltea a fuego vivo 2-3 minutos: deben quedar brillantes y aún firmes.",
        "Retira del fuego, sala y termina con la ralladura y unas gotas de limón.",
      ],
      cuando: "En la comida, 3-4 veces por semana en primavera.",
      nota: "La cocción corta es parte del remedio: el verde muy hervido pierde su cualidad ascendente.",
    },
    {
      key: "madera-congee-menta",
      nombre: "Congee de arroz con menta y brotes",
      hanzi: "薄荷粥",
      para: "Suavizar la irritabilidad y las digestiones que se cierran con el estrés.",
      tiempo: "60 min",
      naturaleza: "Neutra",
      ingredientes: [
        "1/2 taza de arroz redondo",
        "6 tazas de agua",
        "Un puñado de brotes (soja verde, alfalfa)",
        "Unas hojas de menta fresca",
        "Sal al gusto",
      ],
      pasos: [
        "Cuece el arroz con el agua a fuego muy bajo, tapado, hasta que quede cremoso (unos 50-60 min).",
        "Añade los brotes en los últimos 5 minutos.",
        "Apaga el fuego, echa la menta picada, tapa 2 minutos y sirve caliente.",
      ],
      cuando: "En la cena, en épocas de mucha frustración o tensión mandibular.",
    },
  ],

  // ── FUEGO · corazón e intestino delgado ──────────────────────────────────
  fuego: [
    {
      key: "fuego-loto-lirio",
      nombre: "Sopa dulce de semilla de loto y lirio",
      hanzi: "蓮子百合湯",
      para: "Calmar el corazón, aquietar la mente y ayudar a dormir.",
      tiempo: "45 min",
      naturaleza: "Refrescante",
      ingredientes: [
        "30 g de semillas de loto secas (sin el germen amargo central)",
        "20 g de bulbo de lirio seco (bai he)",
        "8 dátiles rojos (jujube) sin hueso",
        "1 litro de agua",
        "Azúcar de roca o miel al final, muy poca",
      ],
      pasos: [
        "Remoja el loto y el lirio 2 horas y escúrrelos.",
        "Llévalos a ebullición con el agua y los dátiles, y baja a fuego lento 40 minutos.",
        "Endulza muy ligeramente al apagar el fuego y toma templado.",
      ],
      cuando: "Por la tarde-noche, en verano o en temporadas de insomnio y agitación.",
      nota: "Clásico del verano chino. Si te cuesta encontrar bai he, dobla la cantidad de semilla de loto.",
    },
    {
      key: "fuego-te-crisantemo-menta",
      nombre: "Infusión de crisantemo y menta",
      para: "Bajar el calor que sube a la cabeza: sofocos, cara roja, mente acelerada.",
      tiempo: "7 min",
      naturaleza: "Refrescante",
      ingredientes: [
        "1 cucharada de flores de crisantemo",
        "Unas hojas de menta fresca",
        "1 cucharadita de té verde (opcional)",
        "300 ml de agua caliente",
      ],
      pasos: [
        "Pon las flores y el té en la taza y vierte el agua caliente.",
        "Tapa 3 minutos, añade la menta y deja otros 2 minutos.",
        "Bebe templado, sin azúcar.",
      ],
      cuando: "Al mediodía o a media tarde, en verano. Evítalo justo antes de dormir si lleva té verde.",
    },
    {
      key: "fuego-quinoa-granada",
      nombre: "Quinoa tibia con granada y cacao",
      para: "Nutrir la sangre del corazón con los sabores rojos y amargos del Fuego.",
      tiempo: "25 min",
      naturaleza: "Neutra",
      ingredientes: [
        "1 taza de quinoa roja o blanca",
        "2 tazas de agua o caldo suave",
        "Granos de media granada",
        "Un puñado de cerezas o arándanos",
        "1 cucharadita de nibs de cacao",
        "Aceite de oliva y sal",
      ],
      pasos: [
        "Enjuaga bien la quinoa y cuécela 15 minutos con el agua y una pizca de sal; deja reposar tapada 5 minutos.",
        "Mézclala tibia con la granada y la fruta roja.",
        "Termina con los nibs de cacao y un hilo de aceite.",
      ],
      cuando: "En la comida, en verano y a final de primavera.",
      nota: "Amargo en poca cantidad: el amargo drena, y en exceso enfría demasiado el corazón.",
    },
  ],

  // ── TIERRA · bazo y estómago ─────────────────────────────────────────────
  tierra: [
    {
      key: "tierra-congee-mijo-calabaza",
      nombre: "Congee de mijo y calabaza",
      hanzi: "小米南瓜粥",
      para: "Reforzar el bazo y el estómago: el plato base de las digestiones débiles.",
      tiempo: "40 min",
      naturaleza: "Templada",
      ingredientes: [
        "1/2 taza de mijo",
        "200 g de calabaza en dados",
        "5-6 tazas de agua",
        "3 dátiles rojos (opcional)",
        "Una pizca de sal",
      ],
      pasos: [
        "Lava el mijo y ponlo a hervir con el agua y los dátiles.",
        "Baja el fuego, añade la calabaza y cuece tapado 30-35 minutos, removiendo de vez en cuando.",
        "Debe quedar cremoso, casi como una papilla suelta. Sala muy poco y toma caliente.",
      ],
      cuando: "En el desayuno, sobre todo al final del verano y en los cambios de estación.",
      nota: "La receta más clásica de la dietética china para el bazo. Si hay mucha humedad, quita los dátiles.",
    },
    {
      key: "tierra-caldo-jengibre-datil",
      nombre: "Caldo de jengibre y dátil rojo",
      hanzi: "薑棗茶",
      para: "Calentar el centro cuando hay frío, cansancio y digestiones lentas.",
      tiempo: "25 min",
      naturaleza: "Caliente",
      ingredientes: [
        "5 rodajas de jengibre fresco",
        "6 dátiles rojos abiertos por la mitad",
        "600 ml de agua",
        "Opcional: un trozo pequeño de azúcar moreno de caña",
      ],
      pasos: [
        "Pon todo en un cazo y lleva a ebullición.",
        "Baja el fuego y cuece 20 minutos tapado.",
        "Bebe caliente, a sorbos, y cómete los dátiles.",
      ],
      cuando: "Por la mañana, en días fríos o los primeros días de la regla.",
      nota: "Si tienes mucho calor interno (boca seca, cara roja, insomnio), reduce el jengibre.",
    },
    {
      key: "tierra-boniato-vapor",
      nombre: "Boniato al vapor con sésamo",
      para: "Dulce natural que sacia sin cargar: alternativa a los antojos de azúcar.",
      tiempo: "25 min",
      naturaleza: "Neutra",
      ingredientes: [
        "1 boniato mediano",
        "1 cucharadita de semillas de sésamo tostadas",
        "Una pizca de canela o de jengibre en polvo",
        "Un poco de aceite de sésamo (opcional)",
      ],
      pasos: [
        "Corta el boniato en rodajas gruesas con piel, bien lavado.",
        "Cuécelo al vapor 20 minutos, hasta que se atraviese con un tenedor.",
        "Sirve caliente con el sésamo y la especia por encima.",
      ],
      cuando: "Como merienda o guarnición, todo el año; especialmente si hay antojo de dulce.",
    },
  ],

  // ── METAL · pulmón e intestino grueso ────────────────────────────────────
  metal: [
    {
      key: "metal-pera-vapor",
      nombre: "Pera al vapor con miel",
      hanzi: "冰糖雪梨",
      para: "Humedecer el pulmón: tos seca, garganta rasposa, sequedad de otoño.",
      tiempo: "35 min",
      naturaleza: "Refrescante",
      ingredientes: [
        "1 pera grande y jugosa",
        "1 cucharadita de miel o azúcar de roca",
        "3 bayas de goji (opcional)",
        "Opcional: 2 semillas de albaricoque dulces o unas gotas de zumo de jengibre",
      ],
      pasos: [
        "Corta la parte de arriba de la pera a modo de tapa y vacía el corazón con una cuchara.",
        "Rellena el hueco con la miel y las bayas, y vuelve a tapar con la parte cortada.",
        "Cuece al vapor 30 minutos, en un cuenco que recoja el jugo.",
        "Come la pera y bebe todo el jugo, templado.",
      ],
      cuando: "Por la noche, en otoño o cuando el ambiente está muy seco.",
      nota: "El remedio casero más extendido de China para la tos seca. No es para la tos con mucha mucosidad y frío.",
    },
    {
      key: "metal-tremella",
      nombre: "Sopa de hongo blanco con goji",
      hanzi: "銀耳羹",
      para: "Nutrir el Yin del pulmón y la piel: sequedad, cutis apagado, garganta seca.",
      tiempo: "60 min",
      naturaleza: "Neutra",
      ingredientes: [
        "1 hongo blanco (tremella) seco",
        "1 puñado de bayas de goji",
        "6 dátiles rojos",
        "1 litro de agua",
        "Azúcar de roca al gusto (poca)",
      ],
      pasos: [
        "Remoja la tremella 1 hora, quítale la base dura y trocéala.",
        "Cuécela con el agua y los dátiles a fuego lento 45-60 minutos, hasta que la sopa esté gelatinosa.",
        "Añade el goji los últimos 5 minutos y endulza ligeramente.",
      ],
      cuando: "Dos o tres veces por semana en otoño e invierno seco.",
    },
    {
      key: "metal-caldo-daikon",
      nombre: "Caldo de nabo daikon y jengibre",
      para: "Abrir el pecho y ayudar a soltar mucosidad y pesadez.",
      tiempo: "30 min",
      naturaleza: "Templada",
      ingredientes: [
        "1/2 nabo daikon en rodajas",
        "3 rodajas de jengibre",
        "1 puerro (la parte blanca)",
        "700 ml de agua",
        "Sal y un poco de pimienta blanca",
      ],
      pasos: [
        "Pon el agua a hervir con el jengibre y el puerro cortado.",
        "Añade el daikon y cuece a fuego medio 20 minutos.",
        "Sala al final y toma el caldo bien caliente, respirando el vapor.",
      ],
      cuando: "En los primeros fríos, o cuando notas el pecho cargado.",
      nota: "El vapor forma parte de la receta: acerca la cara al bol antes del primer sorbo.",
    },
  ],

  // ── AGUA · riñón y vejiga ────────────────────────────────────────────────
  agua: [
    {
      key: "agua-caldo-huesos",
      nombre: "Caldo largo de huesos con goji y jengibre",
      para: "Rellenar la esencia y la reserva: agotamiento de fondo, frío, lumbares débiles.",
      tiempo: "3-4 h",
      naturaleza: "Templada",
      ingredientes: [
        "1 kg de huesos (ternera, pollo o pescado según lo que toleres)",
        "1 cucharada de vinagre de manzana",
        "4 rodajas de jengibre",
        "1 puñado de bayas de goji",
        "Opcional: unas rodajas de raíz de bardana o de zanahoria",
        "Sal marina al final",
      ],
      pasos: [
        "Escalda los huesos 5 minutos en agua hirviendo y desecha esa agua.",
        "Cúbrelos con agua limpia, añade el vinagre y el jengibre y lleva a ebullición suave.",
        "Cuece 3-4 horas a fuego muy bajo, retirando la espuma; añade el goji la última media hora.",
        "Cuela, sala y bebe una taza caliente.",
      ],
      cuando: "En invierno, 2-3 veces por semana, mejor a mediodía.",
      nota: "Si eres vegetariana, sustituye por un caldo largo de alga kombu, shiitake y raíces.",
    },
    {
      key: "agua-judia-negra",
      nombre: "Guiso de judía negra y castañas",
      hanzi: "黑豆栗子",
      para: "El color negro entra en el riñón: refuerza huesos, rodillas y voluntad.",
      tiempo: "90 min",
      naturaleza: "Templada",
      ingredientes: [
        "1 taza de judía negra (remojada la noche anterior)",
        "10 castañas peladas",
        "1 trozo de alga kombu",
        "2 rodajas de jengibre",
        "Agua, sal marina y un chorrito de tamari",
      ],
      pasos: [
        "Escurre las judías y ponlas a cocer con agua nueva, el alga y el jengibre.",
        "Cuece 60-70 minutos, hasta que estén tiernas; añade las castañas a media cocción.",
        "Sala al final (nunca antes) y termina con unas gotas de tamari.",
      ],
      cuando: "En invierno, una o dos veces por semana.",
      nota: "Salar al final evita que la piel de la legumbre se endurezca y facilita la digestión.",
    },
    {
      key: "agua-sesamo-negro",
      nombre: "Crema de sésamo negro y nuez",
      hanzi: "黑芝麻糊",
      para: "Nutrir la médula y el cabello; clásico contra el envejecimiento prematuro.",
      tiempo: "20 min",
      naturaleza: "Templada",
      ingredientes: [
        "4 cucharadas de sésamo negro",
        "4 nueces",
        "2 cucharadas de arroz glutinoso (o arroz redondo)",
        "400 ml de agua o bebida vegetal",
        "Un poco de miel o azúcar moreno",
      ],
      pasos: [
        "Tuesta el sésamo, las nueces y el arroz en seco, a fuego bajo, hasta que huelan.",
        "Muélelos finos y mézclalos con el líquido.",
        "Cuece removiendo 5-8 minutos, hasta que espese como unas natillas ligeras.",
        "Endulza poco y toma caliente.",
      ],
      cuando: "En el desayuno de invierno, o al final del día en épocas de mucho desgaste.",
    },
  ],
};

/** Nota general de la página (al pie). */
export const RECETAS_NOTA =
  "La dietética china no busca contar calorías, sino elegir el alimento por lo que hace en ti: su sabor, su temperatura y el órgano al que entra. Cocina lo que tu elemento más necesita esta temporada, no todo a la vez.";

export const recetasDe = (el: Elemento): Receta[] => RECETAS_ELEMENTO[el] ?? [];
