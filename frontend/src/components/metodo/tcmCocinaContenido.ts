// ─────────────────────────────────────────────────────────────────────────
// TU COCINA DIARIA · una forma de comer por elemento (paso 8 del recorrido TCM)
//
// Aquí NO hay recetas cerradas: hay INGREDIENTES que aportar cada día y FORMAS
// DE COCINAR que cambian lo que un mismo alimento hace en ti. En Medicina China
// el alimento se elige por su sabor, su naturaleza (fría/templada/caliente) y el
// órgano al que entra; y la cocción es la mitad del remedio.
//
// QUÉ SE VE Y DÓNDE:
//   · `cadaDia` + `grupos` → dentro de la caja «Un gesto para hoy»: el gesto del
//     día y, debajo, todos los ingredientes del elemento.
//   · `principio` → la única línea de texto suelto de la página (bajo esa caja).
//   · `cocciones` → las tarjetas de «Formas de cocinar».
//   · `sabor`, `baja` y `dia` se quedan aquí escritos pero NO se muestran: la
//     página se estaba yendo de texto.
//
// ✍️  EDITAR CONTENIDO: cambia los textos aquí. No cambies las `key`.
// ─────────────────────────────────────────────────────────────────────────
import type { Elemento } from "./tcmRecorrido";

/** Un ingrediente y lo que hace en ti (una línea corta). */
export interface Alimento {
  nombre: string;
  aporta: string;
}

/** Los ingredientes agrupados por familia (verduras, cereales, infusiones…). */
export interface GrupoAlimentos {
  /** Clave estable (no cambiar tras publicar). */
  key: string;
  titulo: string;
  alimentos: Alimento[];
}

/** Una forma de cocinar: cómo se hace y por qué le sirve a este elemento. */
export interface Coccion {
  key: string;
  nombre: string;
  como: string;
  porque: string;
}

/** Un momento del día con lo que le va bien a este elemento. */
export interface MomentoDia {
  momento: string;
  texto: string;
}

export interface CocinaElemento {
  /** Sabor que rige el elemento. */
  sabor: string;
  /** Cómo se cocina para este elemento (cabecera del bloque). */
  principio: string;
  /** Gestos pequeños para hoy mismo (lo que de verdad se repite cada día). */
  cadaDia: string[];
  grupos: GrupoAlimentos[];
  cocciones: Coccion[];
  /** Lo que conviene bajar (no prohibir: bajar). */
  baja: string[];
  /** Cómo queda un día cualquiera. */
  dia: MomentoDia[];
}

export const COCINA_ELEMENTO: Record<Elemento, CocinaElemento> = {
  // ── MADERA · hígado y vesícula biliar ────────────────────────────────────
  madera: {
    sabor: "Ácido",
    principio:
      "La Madera pide verde, ligero y ligeramente ácido: lo que ayuda al hígado a mover el Qi y a soltar la tensión. Cocciones cortas, al vapor o al salteado rápido, sobre todo en primavera.",
    cadaDia: [
      "Un puñado de verde de hoja en la comida, salteado dos o tres minutos: que quede brillante y aún firme.",
      "Algo ácido, pero pequeño: unas gotas de limón, una cucharada de chucrut, un encurtido al lado del plato.",
      "Hierbas frescas o germinados por encima de lo que ya cocinas: es la energía que sube.",
      "Cena pronto y ligera. El hígado se ocupa de sí mismo de una a tres de la madrugada y no quiere una digestión abierta.",
      "Agua templada al despertar (con limón si te sienta bien): nunca fría en ayunas.",
    ],
    grupos: [
      {
        key: "madera-verdes",
        titulo: "Verdes de hoja y brotes",
        alimentos: [
          { nombre: "Pak choi, acelga, espinaca", aporta: "El verde entra en el hígado; cocción corta para no perder su empuje." },
          { nombre: "Brócoli y sus hojas", aporta: "Mueve y limpia sin enfriar demasiado." },
          { nombre: "Alcachofa", aporta: "La gran aliada del hígado y de la bilis." },
          { nombre: "Apio", aporta: "Baja el Yang que sube: cabeza cargada, ojos rojos, tensión." },
          { nombre: "Germinados (soja verde, alfalfa)", aporta: "Brote puro: energía de primavera aunque no sea primavera." },
        ],
      },
      {
        key: "madera-acidos",
        titulo: "Ácidos y fermentados",
        alimentos: [
          { nombre: "Limón y lima", aporta: "Despiertan el hígado y ayudan a digerir la grasa." },
          { nombre: "Chucrut y encurtidos vivos", aporta: "Ácido que además siembra el intestino." },
          { nombre: "Vinagre de manzana", aporta: "Unas gotas bastan: el ácido en exceso contrae." },
          { nombre: "Ciruela umeboshi", aporta: "Clásico del ácido que recoge y ordena el centro." },
        ],
      },
      {
        key: "madera-aromaticos",
        titulo: "Aromáticos que mueven",
        alimentos: [
          { nombre: "Menta fresca", aporta: "Abre el estancamiento y suelta la irritabilidad." },
          { nombre: "Hinojo y albahaca", aporta: "Mueven el Qi cuando la digestión se cierra con el estrés." },
          { nombre: "Cúrcuma", aporta: "Mueve la Sangre y acompaña al hígado." },
          { nombre: "Ralladura de cítricos", aporta: "Aroma que desatasca; se echa al final, fuera del fuego." },
        ],
      },
      {
        key: "madera-infusiones",
        titulo: "Infusiones",
        alimentos: [
          { nombre: "Flor de crisantemo", aporta: "Aclara el hígado y descansa los ojos de pantalla." },
          { nombre: "Bayas de goji", aporta: "Nutren la Sangre del hígado; van bien con el crisantemo." },
          { nombre: "Diente de león", aporta: "Amargo que drena el calor del hígado." },
          { nombre: "Rosa mosqueta / capullo de rosa", aporta: "Suaviza el estancamiento emocional." },
        ],
      },
    ],
    cocciones: [
      {
        key: "madera-salteado",
        nombre: "Salteado corto y vivo",
        como: "Sartén muy caliente, un hilo de aceite, aromáticos 30 segundos y el verde 2-3 minutos removiendo.",
        porque: "La cocción corta conserva la cualidad ascendente del verde: hervido mucho tiempo, la pierde.",
      },
      {
        key: "madera-escaldado",
        nombre: "Escaldado (30-60 segundos)",
        como: "Agua hirviendo, dentro el verde, fuera enseguida y aliño en frío con limón y sésamo.",
        porque: "Quita el crudo sin cocinar de más: digerible y todavía crujiente.",
      },
      {
        key: "madera-vapor",
        nombre: "Vapor corto",
        como: "Verduras enteras o en trozos grandes, 4-6 minutos, sin ahogarlas en agua.",
        porque: "Cocina sin apagar: es lo más suave para un hígado tenso.",
      },
      {
        key: "madera-infusion",
        nombre: "Infusión tapada, sin hervir",
        como: "Agua muy caliente pero sin llegar a hervir sobre flores y bayas; tapar 5 minutos.",
        porque: "Las flores pierden su aceite volátil si hierven: tapar es parte de la receta.",
      },
    ],
    baja: ["Alcohol", "Fritos y salsas pesadas", "Cenas tardías", "Comer con prisa o enfadada", "Exceso de café"],
    dia: [
      { momento: "Al despertar", texto: "Agua templada con unas gotas de limón, antes de nada." },
      { momento: "Comida", texto: "Un cereal ligero + verde salteado corto, y algo ácido pequeño al lado." },
      { momento: "Media tarde", texto: "Infusión de crisantemo y goji, mirando lejos de la pantalla." },
      { momento: "Cena", texto: "Pronto y ligera: sopa clara de apio y shiitake, o arroz caldoso con menta." },
    ],
  },

  // ── FUEGO · corazón e intestino delgado ──────────────────────────────────
  fuego: {
    sabor: "Amargo",
    principio:
      "El Fuego se calma con lo amargo y lo ligeramente refrescante: lo que baja el calor del corazón y devuelve el sueño. Nada de exceso de picante ni de alcohol, y cenas ligeras.",
    cadaDia: [
      "Un toque amargo al día y en poca cantidad: unas hojas de escarola o endivia antes del plato principal.",
      "Algo rojo cada día: granada, cereza, arándanos, remolacha, judía azuki.",
      "Cambia el segundo café por una infusión de crisantemo y menta.",
      "Cena ligera y temprana: el corazón necesita que la digestión esté cerrada al acostarse.",
      "Come sentada, despacio y acompañada cuando puedas: el Fuego también se nutre de la mesa.",
    ],
    grupos: [
      {
        key: "fuego-amargos",
        titulo: "Amargos suaves",
        alimentos: [
          { nombre: "Escarola, endivia, achicoria", aporta: "El amargo drena el calor y desciende: en poca cantidad." },
          { nombre: "Rúcula y berros", aporta: "Amargo fresco que abre el apetito." },
          { nombre: "Cacao puro (una onza)", aporta: "Amargo del Fuego; en exceso agita en vez de calmar." },
          { nombre: "Té verde suave", aporta: "Refresca y aclara; nunca a última hora del día." },
        ],
      },
      {
        key: "fuego-rojos",
        titulo: "Rojos que nutren la Sangre",
        alimentos: [
          { nombre: "Granada y cerezas", aporta: "Rojo que nutre la Sangre del corazón." },
          { nombre: "Arándanos y frutos del bosque", aporta: "Sostienen los vasos y la tez." },
          { nombre: "Remolacha", aporta: "Nutre la Sangre y mueve; mejor cocida." },
          { nombre: "Judía azuki", aporta: "Roja y drenante: nutre sin cargar." },
          { nombre: "Dátil rojo (jujube)", aporta: "El clásico para nutrir Sangre y calmar el ánimo." },
        ],
      },
      {
        key: "fuego-shen",
        titulo: "Lo que aquieta la mente",
        alimentos: [
          { nombre: "Semilla de loto", aporta: "Serena el corazón y ayuda a dormir." },
          { nombre: "Bulbo de lirio (bai he)", aporta: "Humedece y calma la agitación del verano." },
          { nombre: "Trigo en grano", aporta: "Base del caldo dulce clásico para el llanto fácil." },
          { nombre: "Semilla de jujube (suan zao ren)", aporta: "Tradicionalmente, para el sueño roto." },
        ],
      },
      {
        key: "fuego-refrescantes",
        titulo: "Refrescantes de verano",
        alimentos: [
          { nombre: "Pepino y sandía", aporta: "Bajan el calor y reponen líquidos." },
          { nombre: "Judía mungo", aporta: "El gran refrescante del verano chino." },
          { nombre: "Menta", aporta: "Baja el calor que sube a la cabeza." },
          { nombre: "Flor de crisantemo", aporta: "Sofocos, cara roja, ojos calientes." },
        ],
      },
    ],
    cocciones: [
      {
        key: "fuego-hervido",
        nombre: "Hervido corto y caldos claros",
        como: "Agua, verdura y poco tiempo; se bebe el caldo templado, no ardiendo.",
        porque: "Alimenta sin añadir calor: lo contrario de la brasa y el horno.",
      },
      {
        key: "fuego-dulce-lento",
        nombre: "Sopa dulce a fuego lento",
        como: "Loto, lirio y dátil rojo 40 minutos a fuego muy bajo; se endulza al apagar, muy poco.",
        porque: "El dulce suave y la cocción larga es lo que calma el corazón por la tarde-noche.",
      },
      {
        key: "fuego-escaldado",
        nombre: "Escaldar y aliñar",
        como: "Las hojas amargas 20 segundos en agua hirviendo y aliño con aceite de oliva y limón.",
        porque: "Suaviza el amargo justo lo necesario para que no enfríe de más.",
      },
      {
        key: "fuego-infusion",
        nombre: "Infusión tapada y templada",
        como: "Crisantemo y menta 5 minutos tapados; se bebe sin azúcar y templado.",
        porque: "Templado, no helado: lo helado apaga la digestión y el calor rebota.",
      },
    ],
    baja: ["Alcohol", "Picante fuerte", "Barbacoa y muy tostado", "Café por la tarde", "Cenar tarde", "Pantallas mientras comes"],
    dia: [
      { momento: "Antes de comer", texto: "Unas hojas amargas aliñadas: abren el apetito y descienden." },
      { momento: "Comida", texto: "Cereal + algo rojo: granada, remolacha, azuki, cerezas." },
      { momento: "Media tarde", texto: "Infusión de crisantemo y menta en lugar del segundo café." },
      { momento: "Noche", texto: "Caldo dulce de loto y lirio, o de trigo y dátil, dos horas antes de dormir." },
    ],
  },

  // ── TIERRA · bazo y estómago ─────────────────────────────────────────────
  tierra: {
    sabor: "Dulce",
    principio:
      "La Tierra se nutre con lo dulce natural, templado y cocinado: cereales, raíces y calabazas. El bazo odia el frío y los crudos; todo lo que entra caliente le ahorra trabajo.",
    cadaDia: [
      "Desayuno caliente y cocinado, siempre. Es el gesto que más cambia una digestión débil.",
      "Un cereal cocinado al día, mejor en forma de papilla suelta (congee): mijo, arroz, avena.",
      "El dulce, de la comida: calabaza, boniato, zanahoria, castaña, dátil. No de azúcar.",
      "Mastica hasta que el bocado sea casi líquido y levántate al 70-80% de lleno.",
      "Nada de bebida fría con la comida: agua templada, caldo o nada.",
    ],
    grupos: [
      {
        key: "tierra-cereales",
        titulo: "Cereales que centran",
        alimentos: [
          { nombre: "Mijo", aporta: "El cereal del bazo por excelencia; alcalino y muy digerible." },
          { nombre: "Arroz redondo", aporta: "Base del congee: nutre el centro sin cargarlo." },
          { nombre: "Avena", aporta: "Templada y sostenida: energía estable toda la mañana." },
          { nombre: "Cebada", aporta: "Drena la humedad cuando hay pesadez e hinchazón." },
        ],
      },
      {
        key: "tierra-raices",
        titulo: "Raíces y calabazas",
        alimentos: [
          { nombre: "Calabaza", aporta: "Dulce natural que tonifica el centro." },
          { nombre: "Boniato", aporta: "Sacia y quita el antojo de azúcar." },
          { nombre: "Zanahoria y chirivía", aporta: "Dulce templado, perfecto en guiso." },
          { nombre: "Castaña", aporta: "Dulce que además calienta y llega al riñón." },
          { nombre: "Ñame chino (shan yao)", aporta: "Tonifica bazo y pulmón; clásico del centro." },
        ],
      },
      {
        key: "tierra-legumbres",
        titulo: "Legumbres que drenan",
        alimentos: [
          { nombre: "Judía azuki", aporta: "Drena el exceso de agua: hinchazón, piernas cargadas." },
          { nombre: "Judía mungo", aporta: "Drena y refresca; para la humedad con calor." },
          { nombre: "Garbanzo", aporta: "Nutritivo; siempre bien cocido y con especias." },
          { nombre: "Alga kombu", aporta: "En la olla, ablanda la legumbre y la hace digerible." },
        ],
      },
      {
        key: "tierra-especias",
        titulo: "Lo que despierta la digestión",
        alimentos: [
          { nombre: "Jengibre", aporta: "Calienta el centro y quita el frío del estómago." },
          { nombre: "Canela y cardamomo", aporta: "Dulce cálido que mueve la humedad." },
          { nombre: "Comino e hinojo", aporta: "Para los gases y la sensación de plenitud." },
          { nombre: "Piel de mandarina (chen pi)", aporta: "Mueve el Qi del centro; un trocito en el guiso." },
        ],
      },
    ],
    cocciones: [
      {
        key: "tierra-congee",
        nombre: "Congee (papilla larga)",
        como: "Una parte de cereal por diez de agua, tapado y a fuego mínimo 40-60 minutos.",
        porque: "El cereal llega medio digerido: el bazo casi no tiene que trabajar.",
      },
      {
        key: "tierra-guiso",
        nombre: "Guiso lento en olla",
        como: "Raíz, legumbre y especias cubiertas de agua, a fuego bajo; la sal, al final.",
        porque: "Calor húmedo y tiempo: la forma más nutritiva de comer para el centro.",
      },
      {
        key: "tierra-vapor",
        nombre: "Vapor",
        como: "Boniato, calabaza o zanahoria enteros, 20 minutos, con un poco de sésamo por encima.",
        porque: "Concentra el dulce del alimento sin añadir grasa.",
      },
      {
        key: "tierra-tostado",
        nombre: "Tostar el cereal antes de cocer",
        como: "Mijo o arroz en la olla en seco, a fuego bajo, hasta que huelan; luego el agua.",
        porque: "Un truco de cocina china: el tostado calienta el plato y lo hace aún más digerible.",
      },
    ],
    baja: ["Azúcar y bollería", "Lácteos fríos", "Ensaladas crudas en exceso", "Bebidas con hielo", "Picar entre horas", "Comer de pie"],
    dia: [
      { momento: "Desayuno", texto: "Congee de mijo y calabaza, caliente. Nada frío al levantarte." },
      { momento: "Comida", texto: "Raíz + cereal cocinado + una pizca de jengibre. Mastica de más." },
      { momento: "Merienda", texto: "Boniato al vapor con sésamo, si aparece el antojo de dulce." },
      { momento: "Cena", texto: "Guiso ligero temprano y diez minutos de paseo después." },
    ],
  },

  // ── METAL · pulmón e intestino grueso ────────────────────────────────────
  metal: {
    sabor: "Picante",
    principio:
      "El Metal pide blanco, jugoso y ligeramente picante: lo que humedece el pulmón y abre la respiración. En otoño, cuando la sequedad aprieta, lo dulce-húmedo es medicina.",
    cadaDia: [
      "Algo blanco y jugoso al día: pera, nabo daikon, coliflor, hongo blanco, almendra.",
      "Un picante suave que abra el pecho: jengibre, puerro, cebolla, rábano. Abrir, no quemar.",
      "Una elaboración al vapor: el vapor es humedad que entra por el plato y por la cara.",
      "Fibra suave para el intestino grueso: manzana cocida, lino remojado, avena.",
      "Bebe caliente y a sorbos a lo largo del día; el pulmón odia la sequedad.",
    ],
    grupos: [
      {
        key: "metal-blancos",
        titulo: "Blancos que humedecen",
        alimentos: [
          { nombre: "Pera", aporta: "El remedio casero chino para la tos seca y la garganta rasposa." },
          { nombre: "Hongo blanco (tremella)", aporta: "Nutre el Yin del pulmón y de la piel." },
          { nombre: "Coliflor y nabo", aporta: "Blancos suaves que entran en pulmón e intestino." },
          { nombre: "Almendra dulce", aporta: "Humedece y calma la tos; mejor triturada en leche." },
          { nombre: "Miel", aporta: "Humecta de verdad, pero solo fuera del fuego." },
        ],
      },
      {
        key: "metal-picantes",
        titulo: "Picantes suaves que abren",
        alimentos: [
          { nombre: "Jengibre", aporta: "Abre la superficie y suelta el frío de los primeros días." },
          { nombre: "Puerro y cebolleta", aporta: "Abren el pecho y ayudan con la mucosidad." },
          { nombre: "Nabo daikon", aporta: "El gran deshacedor de flema y pesadez." },
          { nombre: "Pimienta blanca", aporta: "Una pizca en el caldo: calienta el pulmón." },
        ],
      },
      {
        key: "metal-semillas",
        titulo: "Semillas y frutos",
        alimentos: [
          { nombre: "Sésamo blanco", aporta: "Lubrica el intestino y la piel." },
          { nombre: "Lino remojado", aporta: "Fibra húmeda: el intestino grueso es Metal." },
          { nombre: "Nuez", aporta: "Nutre pulmón y riñón a la vez." },
          { nombre: "Pipa de calabaza", aporta: "Aceite bueno para piel y mucosas." },
        ],
      },
      {
        key: "metal-infusiones",
        titulo: "Infusiones y aromáticas",
        alimentos: [
          { nombre: "Tomillo", aporta: "Antiséptico suave de las vías respiratorias." },
          { nombre: "Regaliz (poco)", aporta: "Suaviza la garganta y armoniza el resto." },
          { nombre: "Piel de mandarina (chen pi)", aporta: "Seca la flema sin resecar el pecho." },
          { nombre: "Jengibre con miel", aporta: "La miel se añade fuera del fuego, siempre." },
        ],
      },
    ],
    cocciones: [
      {
        key: "metal-vapor",
        nombre: "Al vapor",
        como: "Pera o verdura en un cuenco que recoja el jugo, 20-30 minutos tapado.",
        porque: "El vapor es la cocción húmeda por excelencia: justo lo que el pulmón necesita.",
      },
      {
        key: "metal-gelatinosa",
        nombre: "Cocción larga gelatinosa",
        como: "Tremella remojada y cocida 45-60 minutos hasta que la sopa espese sola.",
        porque: "Esa textura gelatinosa es la que humedece por dentro en el otoño seco.",
      },
      {
        key: "metal-caldo-vapor",
        nombre: "Caldo humeante (y respirarlo)",
        como: "Daikon, puerro y jengibre 20 minutos; acerca la cara al bol antes del primer sorbo.",
        porque: "El vapor entra por la nariz y abre el pecho antes de que llegue el caldo.",
      },
      {
        key: "metal-compota",
        nombre: "Fruta cocida y compotas",
        como: "Manzana o pera con un poco de agua y canela, a fuego bajo, hasta deshacerse.",
        porque: "La fruta cocida hidrata y regula el intestino sin enfriar como la cruda.",
      },
    ],
    baja: ["Fritos", "Lácteos si hay mucosidad", "Azúcar", "Crudos fríos en otoño", "Tabaco y aire muy seco"],
    dia: [
      { momento: "Desayuno", texto: "Papilla de almendra o avena con pera cocida." },
      { momento: "Comida", texto: "Algo al vapor y un picante suave (jengibre, puerro) que abra el pecho." },
      { momento: "Media tarde", texto: "Pera al vapor con miel, o tomillo con miel fuera del fuego." },
      { momento: "Cena", texto: "Caldo de daikon y jengibre, respirando el vapor antes del primer sorbo." },
    ],
  },

  // ── AGUA · riñón y vejiga ────────────────────────────────────────────────
  agua: {
    sabor: "Salado",
    principio:
      "El Agua se rellena con lo oscuro, lo mineral y lo cocinado largo: caldos, legumbres negras, semillas y frutos secos. En invierno, cocciones lentas y calor en la zona lumbar.",
    cadaDia: [
      "Algo negro u oscuro al día: sésamo negro, judía negra, arroz negro, alga, mora.",
      "Una cocción larga al día en invierno: caldo, guiso u olla lenta. El tiempo es el ingrediente.",
      "Un puñado de frutos secos y semillas: nuez, castaña, sésamo, pipa de calabaza.",
      "Sal buena y justa: sal marina o alga. El exceso de sal agota lo mismo que quiere nutrir.",
      "Nada helado, nada con hielo. Y calor en la zona lumbar mientras comes y trabajas.",
    ],
    grupos: [
      {
        key: "agua-negros",
        titulo: "Oscuros que entran en el riñón",
        alimentos: [
          { nombre: "Judía negra", aporta: "El color negro entra en el riñón: huesos, rodillas, voluntad." },
          { nombre: "Sésamo negro", aporta: "Nutre la médula y el cabello; tostado y molido." },
          { nombre: "Arroz negro y quinoa negra", aporta: "Cereal oscuro para el invierno." },
          { nombre: "Mora, ciruela, arándano", aporta: "Fruta oscura que nutre Sangre y esencia." },
          { nombre: "Seta shiitake y seta negra", aporta: "Mineral y profunda; base del caldo largo." },
        ],
      },
      {
        key: "agua-mar",
        titulo: "Del mar (el sabor salado)",
        alimentos: [
          { nombre: "Alga kombu", aporta: "Mineraliza el caldo y ablanda la legumbre." },
          { nombre: "Wakame y nori", aporta: "Salado suave: reponen minerales sin sobrecargar." },
          { nombre: "Pescado azul", aporta: "Grasa buena para cerebro y médula." },
          { nombre: "Marisco (con moderación)", aporta: "Tonifica el Yang del riñón; poca cantidad." },
        ],
      },
      {
        key: "agua-frutos",
        titulo: "Frutos secos y semillas",
        alimentos: [
          { nombre: "Nuez", aporta: "La forma del cerebro: nutre médula y pulmón." },
          { nombre: "Castaña", aporta: "Dulce y cálida; refuerza rodillas y lumbares." },
          { nombre: "Pipa de calabaza", aporta: "Zinc y grasa buena para la reserva." },
          { nombre: "Piñón", aporta: "Nutre y lubrica; bueno en la sequedad del invierno." },
        ],
      },
      {
        key: "agua-calor",
        titulo: "Calor de fondo",
        alimentos: [
          { nombre: "Jengibre y canela", aporta: "Calientan el Yang sin agitar." },
          { nombre: "Clavo e hinojo", aporta: "Calor que llega al bajo vientre y a las lumbares." },
          { nombre: "Bayas de goji", aporta: "Nutren el Yin del riñón y del hígado." },
          { nombre: "Ñame chino (shan yao)", aporta: "Tonifica la esencia sin calentar de más." },
        ],
      },
    ],
    cocciones: [
      {
        key: "agua-caldo-largo",
        nombre: "Caldo largo (3-4 horas)",
        como: "Huesos, algas y raíces a fuego mínimo, retirando la espuma; la sal, al final.",
        porque: "Lo que se cuece muchas horas rellena la reserva: es comida de fondo, no de día.",
      },
      {
        key: "agua-legumbre-kombu",
        nombre: "Legumbre con kombu",
        como: "Remojo de noche, agua nueva, un trozo de alga y jengibre; salar solo al final.",
        porque: "Salar antes endurece la piel de la legumbre; el alga la ablanda y la mineraliza.",
      },
      {
        key: "agua-tostado-molido",
        nombre: "Tostar y moler",
        como: "Sésamo negro, nuez y arroz tostados en seco, molidos y cocidos con agua hasta espesar.",
        porque: "Tostar calienta y moler hace asimilable lo que el cuerpo no rompería solo.",
      },
      {
        key: "agua-estofado",
        nombre: "Estofado con especias cálidas",
        como: "Raíces y legumbre con jengibre, canela e hinojo, tapado y a fuego muy bajo.",
        porque: "Calor húmedo y sostenido: es lo que pide el invierno y una lumbar fría.",
      },
    ],
    baja: ["Crudos y helados en invierno", "Exceso de sal y ultraprocesados", "Café que tira de la reserva", "Alcohol", "Acostarse tarde"],
    dia: [
      { momento: "Desayuno", texto: "Crema caliente de sésamo negro y nuez." },
      { momento: "Comida", texto: "Guiso largo: legumbre oscura con kombu, sal solo al final." },
      { momento: "Media tarde", texto: "Un puñado de nueces y castañas; infusión de goji y jengibre." },
      { momento: "Cena", texto: "Caldo bien caliente, pronto, y calor en las lumbares hasta dormir." },
    ],
  },
};

/**
 * Ilustración de cada FORMA DE COCINAR (4 por elemento, 20 en total). Son
 * CUADRADAS (1:1) y van numeradas por elemento y posición, tal y como llegaron:
 * `/public/recorrido/tcm/cocina/<elemento><1-4>.webp` — madera1, madera2…
 *
 * O sea: el ORDEN de `cocciones` en cada elemento manda. Si reordenas la lista,
 * cambias también la ilustración. Las cajas de ingredientes van sin foto a
 * propósito: son listas y se sostienen solas.
 */
export const FOTO_COCINA = (el: Elemento, indice: number) =>
  `/recorrido/tcm/cocina/${el}${indice + 1}.webp`;

/** Nota general de la página (al pie). */
export const COCINA_NOTA =
  "La dietética china no cuenta calorías: elige el alimento por lo que hace en ti —su sabor, su temperatura y el órgano al que entra— y la cocción por cómo lo transforma. No lo cambies todo a la vez: empieza por un ingrediente y una forma de cocinar.";

export const cocinaDe = (el: Elemento): CocinaElemento => COCINA_ELEMENTO[el];
