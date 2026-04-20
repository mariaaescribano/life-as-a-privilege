import type { Detalles, FloatingButtonConfig, ModuloContenido } from "../../../dtos/aprendizaje.type";
import { NutricionIcon, nutricionBg, nutricionNomLink, nutricionTxt } from "../../../GlobalVariables";

const detalles: Detalles = { color: nutricionTxt, icon: NutricionIcon, bgColor: nutricionBg };

const basePath = "/aprendizaje/videoLessonPage/" + nutricionNomLink;

const respetarme: FloatingButtonConfig = {
  label: "Respetarme",
  action: "espacio-auth",
  route: "/espacio/questions/" + nutricionNomLink,
};

export const modulosGrasas: ModuloContenido[] = [
  {
    title: "1. Qué son las grasas",
    icon: NutricionIcon,
    floatingButton: respetarme,
    submodules: [
      {
        id: "nut-g1",
        nom: "1.1 Qué son y para qué sirven",
        link: `${basePath}/nut-g1`,
        linkAnterior: "",
        linkNext: `${basePath}/nut-g2`,
        descripcion: "Las grasas construyen la membrana de nuestras células, determinando cómo se comunican entre ellas y con el sistema inmunitario.",
        video: "XG1vkys8H80",
        letra: "Las grasas de la dieta son transformadas por el hígado en bloques de construcción para la membrana protectora de las células. A través de esta membrana, las células se comunican entre ellas y con el sistema inmunitario, por lo que las grasas que elegimos son verdaderamente importantes e influyen en todo nuestro cuerpo.",
        cursoId: "nut-curso-3",
        detalles: detalles,
        icon: NutricionIcon,
        floatingButton: respetarme,
      },
      {
        id: "nut-g2",
        nom: "1.2 Las neuronas y las grasas",
        link: `${basePath}/nut-g2`,
        linkAnterior: `${basePath}/nut-g1`,
        linkNext: `${basePath}/nut-g3`,
        descripcion: "Las grasas que comemos reconstruyen las carreteras neuronales y afectan directamente a nuestra velocidad de pensamiento.",
        video: "IYbjj0q--OA",
        letra: "Las grasas que comemos influyen en nuestra velocidad de pensamiento. Las neuronas usan las grasas para reconstruir las carreteras por las cuales se comunican entre ellas. Por lo tanto, las grasas pueden acelerar o ralentizar nuestro pensamiento y actividad.",
        cursoId: "nut-curso-3",
        detalles: detalles,
        icon: NutricionIcon,
        floatingButton: respetarme,
      },
    ],
  },
  {
    title: "2. Tipos de grasas",
    icon: NutricionIcon,
    floatingButton: respetarme,
    submodules: [
      {
        id: "nut-g3",
        nom: "2.1 Grasas saturadas",
        link: `${basePath}/nut-g3`,
        linkAnterior: `${basePath}/nut-g2`,
        linkNext: `${basePath}/nut-g4`,
        descripcion: "Las grasas saturadas son rígidas y ralentizan el pensamiento, el movimiento y nuestras defensas naturales.",
        video: "bvTwzUFoRcU",
        letra: "Las grasas saturadas hacen más lento nuestro pensamiento. Por su estructura molecular, las grasas saturadas son rígidas, por lo que si nuestras células y neuronas se reconstruyen con ellas, nuestro pensamiento, movimiento, defensas naturales y energía se verán muy influenciados, haciendo que no seamos nuestra mejor versión. Las grasas saturadas se encuentran en la carne, el queso, los lácteos, la mantequilla y la bollería.",
        cursoId: "nut-curso-3",
        detalles: detalles,
        icon: NutricionIcon,
        floatingButton: respetarme,
      },
      {
        id: "nut-g4",
        nom: "2.2 Grasas trans",
        link: `${basePath}/nut-g4`,
        linkAnterior: `${basePath}/nut-g3`,
        linkNext: `${basePath}/nut-g5`,
        descripcion: "Las grasas trans no son naturales: alteran el metabolismo y activan el sistema inmunitario en estado de alerta.",
        video: "mto8wPZTGEY",
        letra: "La comida ultraprocesada pone a nuestro cuerpo en estado de alerta. Esto se debe a que las grasas trans no son naturales, fueron inventadas en laboratorios a través de reacciones químicas, por lo que no son bien digeridas, activando así nuestro sistema inmunitario. No solo esto, sino que empeora el metabolismo y la detoxificación hepática, incrementando el colesterol malo en la sangre, causando problemas en el corazón. Las grasas trans se encuentran en bollerías, snacks industriales y margarinas.",
        cursoId: "nut-curso-3",
        detalles: detalles,
        icon: NutricionIcon,
        floatingButton: respetarme,
      },
      {
        id: "nut-g5",
        nom: "2.3 Grasas insaturadas",
        link: `${basePath}/nut-g5`,
        linkAnterior: `${basePath}/nut-g4`,
        linkNext: `${basePath}/nut-g6`,
        descripcion: "Las grasas insaturadas, flexibles y naturales, aceleran la comunicación celular y neuronal.",
        video: "b-t3JIrVLKY",
        letra: "Las grasas insaturadas nos hacen más rápidos e inteligentes. Gracias a su estructura molecular flexible, nuestras células y neuronas se vuelven más rápidas y eficientes, mejorando la comunicación entre ellas y con el sistema inmunitario. Se encuentran en frutos secos, aceites, aguacates y en la soja.",
        cursoId: "nut-curso-3",
        detalles: detalles,
        icon: NutricionIcon,
        floatingButton: respetarme,
      },
    ],
  },
  {
    title: "3. El colesterol",
    icon: NutricionIcon,
    floatingButton: respetarme,
    submodules: [
      {
        id: "nut-g6",
        nom: "3.1 El colesterol",
        link: `${basePath}/nut-g6`,
        linkAnterior: `${basePath}/nut-g5`,
        linkNext: "",
        descripcion: "El colesterol es necesario como cemento celular; el problema surge cuando una dieta insana sobrecarga al hígado.",
        video: "xNsKH8bNoHU",
        letra: "El colesterol es absolutamente necesario porque hace de cemento para reforzar la membrana de las células. El problema es cuando, debido a una dieta insana, el metabolismo del hígado no es óptimo, causando el aumento de colesterol en la sangre, haciendo que las arterias se peguen entre ellas.",
        cursoId: "nut-curso-3",
        detalles: detalles,
        icon: NutricionIcon,
        floatingButton: respetarme,
      },
    ],
  },
];
