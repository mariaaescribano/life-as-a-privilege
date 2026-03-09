import type { Detalles, ModuloContenido } from "../../../dtos/aprendizaje.type";
import { neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaTxt, AstrologiaIcon, AscendenteIcon, SunIcon, astrologiaNom } from "../../../GlobalVariables";
import { 
  asc1, asc2, asc3, asc4, asc5, asc6, asc7, asc8, asc9, asc10, asc11, asc12, 
  astrologia1, astrologia2, 
  sol1, sol2, sol3, sol4, sol5, sol6, sol7, sol8, sol9, sol10, sol11, sol12 
} from "./LetraAstrologia";

const detalles: Detalles = { color: neuropsicologiaTxt, icon: NeuropsicologiaIcon, bgColor: neuropsicologiaBg };

const basePath = "/aprendizaje/videoLessonPage/" + astrologiaNom;

export const modulosAstrologia: ModuloContenido[] = [
  {
    title: "1. Introducción",
    icon: AstrologiaIcon,
    submodules: [
      { 
        id:"astro1",
        nom: "1.1 La historia de la Astrología",
        link:`${basePath}/astro1`,
        linkAnterior:"",
        linkNext:`${basePath}/astro2`,
        descripcion:"La Astrología nos revela los arquetipos que nuestra Alma ha elegido.",
        video:"J2tQEea8vpM",
        letra: astrologia1,
        detalles: detalles,
        icon: AstrologiaIcon
      },
      { 
        id:"astro2",
        nom: "1.2 El Sol, el Ascendente y la Luna",
        link:`${basePath}/astro2`,
        linkAnterior:`${basePath}/astro1`,
        linkNext:`${basePath}/asc1`,
        descripcion:"El Ascendente es el camino, el Sol nuestra esencia y Luna las raíces tempranas.",
        video:"aBav2XmgGpE",
        letra: astrologia2,
        detalles: detalles,
        icon: AstrologiaIcon
      },
    ],
  },
  {
    title: "2. El Ascendente",
    icon: AscendenteIcon,
    submodules: [
      { id:"asc1", nom: "Ascendente ♈︎ Aries", link:`${basePath}/asc1`, linkAnterior:`${basePath}/astro2`, linkNext:`${basePath}/asc2`, descripcion: "Un Ascendente Aries avanza con fuerza pero se frustra con facilidad.", video:"_3WF7lxVAz4", letra: asc1, detalles: detalles, icon: AscendenteIcon },
      { id:"asc2", nom: "Ascendente ♉︎ Tauro", link:`${basePath}/asc2`, linkAnterior:`${basePath}/asc1`, linkNext:`${basePath}/asc3`, descripcion: "Un Ascendente Tauro progresa lento y constante, aferrado a lo seguro.", video:"AlWk6ZVFhA4", letra: asc2, detalles: detalles, icon: AscendenteIcon },
      { id:"asc3", nom: "Ascendente ♊︎ Géminis", link:`${basePath}/asc3`, linkAnterior:`${basePath}/asc2`, linkNext:`${basePath}/asc4`, descripcion: "Un Ascendente Géminis es curioso y comunicativo, pero disperso y nervioso.", video:"zD_oRgpl9_A", letra: asc3, detalles: detalles, icon: AscendenteIcon },
      { id:"asc4", nom: "Ascendente ♋︎ Cáncer", link:`${basePath}/asc4`, linkAnterior:`${basePath}/asc3`, linkNext:`${basePath}/asc5`, descripcion: "Un Ascendente Cáncer es sensible y protector, debe de aprender a perdonar el pasado.", video:"w7ESpg_dwx4", letra: asc4, detalles: detalles, icon: AscendenteIcon },
      { id:"asc5", nom: "Ascendente ♌︎ Leo", link:`${basePath}/asc5`, linkAnterior:`${basePath}/asc4`, linkNext:`${basePath}/asc6`, descripcion: "Un Ascendente Leo es creativo y seguro, y debe aprender a reconocerse y a validarse.", video:"NRDrA91MqHE", letra: asc5, detalles: detalles, icon: AscendenteIcon },
      { id:"asc6", nom: "Ascendente ♍︎ Virgo", link:`${basePath}/asc6`, linkAnterior:`${basePath}/asc5`, linkNext:`${basePath}/asc7`, descripcion: "Un Ascendente Virgo es crítico y analítico, debe de aprender a soltar y poner sus dones al servicio.", video:"8XGSOZE3vaA", letra: asc6, detalles: detalles, icon: AscendenteIcon },
      { id:"asc7", nom: "Ascendente ♎︎ Libra", link:`${basePath}/asc7`, linkAnterior:`${basePath}/asc6`, linkNext:`${basePath}/asc8`, descripcion: "Un Ascendente Libra es dulce y dependiente, y debe aprender a decidir y sostenerse a él mismo.", video:"WnzBfpvXqgA", letra: asc7, detalles: detalles, icon: AscendenteIcon },
      { id:"asc8", nom: "Ascendente ♏︎ Escorpio", link:`${basePath}/asc8`, linkAnterior:`${basePath}/asc7`, linkNext:`${basePath}/asc9`, descripcion: "Un Ascendente Escorpio es misterioso y observador, transformando resentimientos en fortaleza.", video:"7Ng-go2w-S0", letra: asc8, detalles: detalles, icon: AscendenteIcon },
      { id:"asc9", nom: "Ascendente ♐︎ Sagitario", link:`${basePath}/asc9`, linkAnterior:`${basePath}/asc8`, linkNext:`${basePath}/asc10`, descripcion: "Un Ascendente Sagitario es generoso y filosófico, busca la verdad universal.", video:"a5zmxZbPk6A", letra: asc9, detalles: detalles, icon: AscendenteIcon },
      { id:"asc10", nom: "Ascendente ♑︎ Capricornio", link:`${basePath}/asc10`, linkAnterior:`${basePath}/asc9`, linkNext:`${basePath}/asc11`, descripcion: "Un Ascendente Capricornio es disciplinado y responsable, orientado a sus metas y al futuro.", video:"vThhLbA_VL8", letra: asc10, detalles: detalles, icon: AscendenteIcon },
      { id:"asc11", nom: "Ascendente ♒︎ Acuario", link:`${basePath}/asc11`, linkAnterior:`${basePath}/asc10`, linkNext:`${basePath}/asc12`, descripcion: "Un Ascendente Acuario busca su individualidad mientras conecta con un grupo.", video:"pgH9o-lP5Y0", letra: asc11, detalles: detalles, icon: AscendenteIcon },
      { id:"asc12", nom: "Ascendente ♓︎ Piscis", link:`${basePath}/asc12`, linkAnterior:`${basePath}/asc11`, linkNext:`${basePath}/sol1`, descripcion: "Un Ascendente Piscis es compasivo y sensible, debe de aprender a cuidarse sin sacrificarse.", video:"hJZflzNjxYo", letra: asc12, detalles: detalles, icon: AscendenteIcon },
    ],
  },
  {
    title: "3. El Sol",
    icon: SunIcon,
    submodules: [
      { id:"sol1", nom: "Sol ♈︎ Aries", link:`${basePath}/sol1`, linkAnterior:`${basePath}/asc12`, linkNext:`${basePath}/sol2`, descripcion:"Un Sol en Aries es valiente e independiente, guiado por su iniciativa y la libertad.", video:"zbyC_x43Qx0", letra: sol1, detalles: detalles, icon: SunIcon },
      { id:"sol2", nom: "Sol ♉︎ Tauro", link:`${basePath}/sol2`, linkAnterior:`${basePath}/sol1`, linkNext:`${basePath}/sol3`, descripcion:"Un Sol en Tauro es paciente y leal, debe de valorar la Vida más allá de las posesiones.", video:"Zd0gtDOfFBU", letra: sol2, detalles: detalles, icon: SunIcon },
      { id:"sol3", nom: "Sol ♊︎ Géminis", link:`${basePath}/sol3`, linkAnterior:`${basePath}/sol2`, linkNext:`${basePath}/sol4`, descripcion:"Un Sol en Géminis es curioso e inteligente, debe de integrar el conocimiento con el corazón.", video:"P-y8MOFR2wI", letra: sol3, detalles: detalles, icon: SunIcon },
      { id:"sol4", nom: "Sol ♋︎ Cáncer", link:`${basePath}/sol4`, linkAnterior:`${basePath}/sol3`, linkNext:`${basePath}/sol5`, descripcion:"Un Sol en Cáncer es nutridor y sensible, debe diferenciar lo propio de lo ajeno.", video:"wRO7-7Z0zsM", letra: sol4, detalles: detalles, icon: SunIcon },
      { id:"sol5", nom: "Sol ♌︎ Leo", link:`${basePath}/sol5`, linkAnterior:`${basePath}/sol4`, linkNext:`${basePath}/sol6`, descripcion:"Un Sol en Leo es creativo y brillante, debe de reconocerse y dar Amor sin depender de otros.", video:"wRO7-7Z0zsM", letra: sol5, detalles: detalles, icon: SunIcon },
      { id:"sol6", nom: "Sol ♍︎ Virgo", link:`${basePath}/sol6`, linkAnterior:`${basePath}/sol5`, linkNext:`${basePath}/sol7`, descripcion:"Un Sol en Virgo es analítico y servicial, debe de poner sus dones meticulosos al servicio de algo mayor.", video:"2na3Wq4wGiY", letra: sol6, detalles: detalles, icon: SunIcon },
      { id:"sol7", nom: "Sol ♎︎ Libra", link:`${basePath}/sol7`, linkAnterior:`${basePath}/sol6`, linkNext:`${basePath}/sol8`, descripcion:"Un Sol en Libra es diplomático y social, debe de encontrar la armonía en sí mismo.", video:"jjkhJwSbaxU", letra: sol7, detalles: detalles, icon: SunIcon },
      { id:"sol8", nom: "Sol ♏︎ Escorpio", link:`${basePath}/sol8`, linkAnterior:`${basePath}/sol7`, linkNext:`${basePath}/sol9`, descripcion:"Un Sol en Escorpio es intenso y transformador, capaz de convertir su sufrimiento en crecimiento.", video:"Q_zzeWeWwKk", letra: sol8, detalles: detalles, icon: SunIcon },
      { id:"sol9", nom: "Sol ♐︎ Sagitario", link:`${basePath}/sol9`, linkAnterior:`${basePath}/sol8`, linkNext:`${basePath}/sol10`, descripcion:"Un Sol en Sagitario es entusiasta y buscador de verdad, expandiendo su conciencia con optimismo.", video:"M3gTOQr_UAY", letra: sol9, detalles: detalles, icon: SunIcon },
      { id:"sol10", nom: "Sol ♑︎ Capricornio", link:`${basePath}/sol10`, linkAnterior:`${basePath}/sol9`, linkNext:`${basePath}/sol11`, descripcion:"Un Sol en Capricornio es responsable y estable, orientado al legado y a la disciplina.", video:"pT7crWfsF3I", letra: sol10, detalles: detalles, icon: SunIcon },
      { id:"sol11", nom: "Sol ♒︎ Acuario", link:`${basePath}/sol11`, linkAnterior:`${basePath}/sol10`, linkNext:`${basePath}/sol12`, descripcion:"Un Sol en Acuario es individualista y visionario, debe de integrar su valía dentro de un grupo.", video:"oMuiKav8CKM", letra: sol11, detalles: detalles, icon: SunIcon },
      { id:"sol12", nom: "Sol ♓︎ Piscis", link:`${basePath}/sol12`, linkAnterior:`${basePath}/sol11`, linkNext:`${basePath}/sol13`, descripcion:"Un Sol en Piscis es sensible y trascendental, debe de aprender a no sacrificarse y a no hacerse pequeño.", video:"QiP6zlkeWLg", letra: sol12, detalles: detalles, icon: SunIcon }
    ]
  }
  // {
  // title: "4. La Luna",
  // icon: MoonIcon,
  // submodules: [
  //           { 
  //     id:"np27",
  //     nom: "4.1 Luna en Aries",
  //     link:`${basePath}/np27`,
  //     linkAnterior:`${basePath}/np26`,
  //     linkNext:`${basePath}/np28`,
  //     descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
  //     video:"wRO7-7Z0zsM",
  //     letra: letranp10,
  //     detalles: detalles,
  //     icon: MoonIcon
  //     },

  //     { 
  //     id:"np28",
  //     nom: "4.2 Luna en Tauro",
  //     link:`${basePath}/np28`,
  //     linkAnterior:`${basePath}/np27`,
  //     linkNext:`${basePath}/np29`,
  //     descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
  //     video:"wRO7-7Z0zsM",
  //     letra: letranp10,
  //     detalles: detalles,
  //     icon: MoonIcon
  //     },

  //     { 
  //     id:"np29",
  //     nom: "4.3 Luna en Géminis",
  //     link:`${basePath}/np29`,
  //     linkAnterior:`${basePath}/np28`,
  //     linkNext:`${basePath}/np30`,
  //     descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
  //     video:"wRO7-7Z0zsM",
  //     letra: letranp10,
  //     detalles: detalles,
  //     icon: MoonIcon
  //     },

  //     { 
  //     id:"np30",
  //     nom: "4.4 Luna en Cáncer",
  //     link:`${basePath}/np30`,
  //     linkAnterior:`${basePath}/np29`,
  //     linkNext:`${basePath}/np31`,
  //     descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
  //     video:"wRO7-7Z0zsM",
  //     letra: letranp10,
  //     detalles: detalles,
  //     icon: MoonIcon
  //     },

  //     { 
  //     id:"np31",
  //     nom: "4.5 Luna en Leo",
  //     link:`${basePath}/np31`,
  //     linkAnterior:`${basePath}/np30`,
  //     linkNext:`${basePath}/np32`,
  //     descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
  //     video:"wRO7-7Z0zsM",
  //     letra: letranp10,
  //     detalles: detalles,
  //     icon: MoonIcon
  //     },

  //     { 
  //     id:"np32",
  //     nom: "4.6 Luna en Virgo",
  //     link:`${basePath}/np32`,
  //     linkAnterior:`${basePath}/np31`,
  //     linkNext:`${basePath}/np33`,
  //     descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
  //     video:"wRO7-7Z0zsM",
  //     letra: letranp10,
  //     detalles: detalles,
  //     icon: MoonIcon
  //     },

  //     { 
  //     id:"np33",
  //     nom: "4.7 Luna en Libra",
  //     link:`${basePath}/np33`,
  //     linkAnterior:`${basePath}/np32`,
  //     linkNext:`${basePath}/np34`,
  //     descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
  //     video:"wRO7-7Z0zsM",
  //     letra: letranp10,
  //     detalles: detalles,
  //     icon: MoonIcon
  //     },

  //     { 
  //     id:"np34",
  //     nom: "4.8 Luna en Escorpio",
  //     link:`${basePath}/np34`,
  //     linkAnterior:`${basePath}/np33`,
  //     linkNext:`${basePath}/np35`,
  //     descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
  //     video:"wRO7-7Z0zsM",
  //     letra: letranp10,
  //     detalles: detalles,
  //     icon: MoonIcon
  //     },

  //     { 
  //     id:"np35",
  //     nom: "4.9 Luna en Sagitario",
  //     link:`${basePath}/np35`,
  //     linkAnterior:`${basePath}/np34`,
  //     linkNext:`${basePath}/np36`,
  //     descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
  //     video:"wRO7-7Z0zsM",
  //     letra: letranp10,
  //     detalles: detalles,
  //     icon: MoonIcon
  //     },

  //     { 
  //     id:"np36",
  //     nom: "4.10 Luna en Capricornio",
  //     link:`${basePath}/np36`,
  //     linkAnterior:`${basePath}/np35`,
  //     linkNext:`${basePath}/np37`,
  //     descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
  //     video:"wRO7-7Z0zsM",
  //     letra: letranp10,
  //     detalles: detalles,
  //     icon: MoonIcon
  //     },

  //     { 
  //     id:"np37",
  //     nom: "4.11 Luna en Acuario",
  //     link:`${basePath}/np37`,
  //     linkAnterior:`${basePath}/np36`,
  //     linkNext:`${basePath}/np38`,
  //     descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
  //     video:"wRO7-7Z0zsM",
  //     letra: letranp10,
  //     detalles: detalles,
  //     icon: MoonIcon
  //     },

  //     { 
  //     id:"np38",
  //     nom: "4.12 Luna en Piscis",
  //     link:`${basePath}/np38`,
  //     linkAnterior:`${basePath}/np37`,
  //     linkNext:`${basePath}/np39`,
  //     descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
  //     video:"wRO7-7Z0zsM",
  //     letra: letranp10,
  //     detalles: detalles,
  //     icon: MoonIcon
  //     },
  //   ]
  // }

];