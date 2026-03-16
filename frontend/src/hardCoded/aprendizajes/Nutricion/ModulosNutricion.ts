import type { Detalles, ModuloContenido } from "../../../dtos/aprendizaje.type";
import { NutricionIcon, nutricionBg, nutricionNomLink, nutricionTxt } from "../../../GlobalVariables";

const detalles: Detalles = { color: nutricionTxt, icon: NutricionIcon, bgColor: nutricionBg };

const basePath = "/aprendizaje/videoLessonPage/" + nutricionNomLink;

export const modulosNutricion: ModuloContenido[] = [
  {
    title: "Recursos",
    icon: NutricionIcon,
    submodules: [
      {
        id: "nut-rec",
        nom: "Recursos a tu disposición",
        link: `/recursos/` + nutricionNomLink,
        linkAnterior: "",
        linkNext: "",
        descripcion: "",
        video: "",
        letra: null,
        detalles: detalles,
        icon: null,
      },
    ],
  },
  {
    title: "1. Respétate",
    icon: NutricionIcon,
    submodules: [
      {
        id: "nut-r1",
        nom: "Somos lo que comemos",
        link: `${basePath}/nut-r1`,
        linkAnterior: "",
        linkNext: `${basePath}/nut-m1`,
        descripcion: "Descubre por qué los alimentos que elegimos cada día no solo construyen nuestro cuerpo, sino también nuestra claridad mental y nuestro estado emocional.",
        video: "",
        letra: null,
        detalles: detalles,
        icon: NutricionIcon,
      },
    ],
  },
  {
    title: "2. Macronutrientes",
    icon: NutricionIcon,
    submodules: [
      {
        id: "nut-m1",
        nom: "Proteínas",
        link: `${basePath}/nut-m1`,
        linkAnterior: `${basePath}/nut-r1`,
        linkNext: `${basePath}/nut-m2`,
        descripcion: "Entiende qué son las proteínas, para qué las necesita tu cuerpo y cuáles son las mejores fuentes para mantener tu salud y energía.",
        video: "",
        letra: null,
        detalles: detalles,
        icon: NutricionIcon,
      },
      {
        id: "nut-m2",
        nom: "Carbohidratos",
        link: `${basePath}/nut-m2`,
        linkAnterior: `${basePath}/nut-m1`,
        linkNext: `${basePath}/nut-m3`,
        descripcion: "Aprende a distinguir los carbohidratos que te nutren de los que te desgastan, y cómo elegirlos para sostener tu energía a lo largo del día.",
        video: "",
        letra: null,
        detalles: detalles,
        icon: NutricionIcon,
      },
      {
        id: "nut-m3",
        nom: "Grasas",
        link: `${basePath}/nut-m3`,
        linkAnterior: `${basePath}/nut-m2`,
        linkNext: `${basePath}/nut-mi1`,
        descripcion: "Rompe con los mitos sobre las grasas y descubre cuáles son esenciales para tu cerebro, tus hormonas y tu bienestar general.",
        video: "",
        letra: null,
        detalles: detalles,
        icon: NutricionIcon,
      },
    ],
  },
  {
    title: "3. Micronutrientes",
    icon: NutricionIcon,
    submodules: [
      {
        id: "nut-mi1",
        nom: "Vitaminas",
        link: `${basePath}/nut-mi1`,
        linkAnterior: `${basePath}/nut-m3`,
        linkNext: `${basePath}/nut-mi2`,
        descripcion: "Descubre el papel fundamental de las vitaminas en tu salud, cuáles necesitas y cómo obtenerlas de forma natural a través de tu alimentación.",
        video: "",
        letra: null,
        detalles: detalles,
        icon: NutricionIcon,
      },
      {
        id: "nut-mi2",
        nom: "Minerales",
        link: `${basePath}/nut-mi2`,
        linkAnterior: `${basePath}/nut-mi1`,
        linkNext: "",
        descripcion: "Comprende qué minerales necesita tu cuerpo para funcionar en equilibrio y cómo una carencia puede afectar tu energía, tu ánimo y tu salud.",
        video: "",
        letra: null,
        detalles: detalles,
        icon: NutricionIcon,
      },
    ],
  },
];
