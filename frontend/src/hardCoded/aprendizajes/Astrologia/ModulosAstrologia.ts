import type { Detalles, ModuloContenido } from "../../../dtos/aprendizaje.type";
import { neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaTxt, MadreIcon, AdultIcon, ChildIcon, FamilyIcon, neuropsicologiaNom, AstrologiaIcon, AscendenteIcon, SunIcon, MoonIcon, astrologiaNom } from "../../../GlobalVariables";
import { letranp1, letranp10, letranp2, letranp3, letranp4, letranp5, letranp6, letranp7, letranp8, letranp9 } from "./LetraAstrologia";

const detalles: Detalles = { color: neuropsicologiaTxt, icon: NeuropsicologiaIcon, bgColor: neuropsicologiaBg };

const basePath = "/aprendizaje/videoLessonPage/" + astrologiaNom;

export const modulosAstrologia: ModuloContenido[] = [
  {
    title: "1. Introducción",
    icon: AstrologiaIcon,
    submodules: [
      { 
        id:"np1",
        nom: "1.1 La historia de la Astrología",
        link:`${basePath}/np1`,
        linkAnterior:"",
        linkNext:`${basePath}/np2`,
        descripcion:"Pequeño resumen de cómo esta sabiduría ancestral empezó a menospreciarse.",
        video:"J2tQEea8vpM",
        letra: letranp1,
        detalles: detalles,
        icon: MadreIcon
      },
      { 
        id:"np2",
        nom: "1.2 El Sol, el Ascendente y la Luna",
        link:`${basePath}/np2`,
        linkAnterior:`${basePath}/np1`,
        linkNext:`${basePath}/np3`,
        descripcion:"Nuestros arquetipos fundamentales.",
        video:"aBav2XmgGpE",
        letra: letranp2,
        detalles: detalles,
        icon: MadreIcon
      },
    ],
  },
  {
    title: "2. El Ascendente",
    icon: AscendenteIcon,
    submodules: [
      { 
        id:"np3",
        nom: " Ascendente ♈︎ Aries",
        link:`${basePath}/np3`,
        linkAnterior:`${basePath}/np2`,
        linkNext:`${basePath}/np4`,
        descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
        video:"_3WF7lxVAz4",
        letra: letranp3,
        detalles: detalles,
        icon: AscendenteIcon
      },
      { 
      id:"np4",
      nom: "♉︎ Ascendente Tauro",
      link:`${basePath}/np4`,
      linkAnterior:`${basePath}/np3`,
      linkNext:`${basePath}/np5`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"AlWk6ZVFhA4",
      letra: letranp4,
      detalles: detalles,
      icon: AscendenteIcon
      },

      { 
      id:"np5",
      nom: "♊︎ Ascendente Géminis",
      link:`${basePath}/np5`,
      linkAnterior:`${basePath}/np4`,
      linkNext:`${basePath}/np6`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"zD_oRgpl9_A",
      letra: letranp5,
      detalles: detalles,
      icon: AscendenteIcon
      },

      { 
      id:"np6",
      nom: "♋︎ Ascendente Cáncer",
      link:`${basePath}/np6`,
      linkAnterior:`${basePath}/np5`,
      linkNext:`${basePath}/np7`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"w7ESpg_dwx4",
      letra: letranp6,
      detalles: detalles,
      icon: AscendenteIcon
      },

      { 
      id:"np7",
      nom: "♌︎ Ascendente Leo",
      link:`${basePath}/np7`,
      linkAnterior:`${basePath}/np6`,
      linkNext:`${basePath}/np8`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"NRDrA91MqHE",
      letra: letranp7,
      detalles: detalles,
      icon: AscendenteIcon
      },

      { 
      id:"np8",
      nom: "♍︎ Ascendente Virgo",
      link:`${basePath}/np8`,
      linkAnterior:`${basePath}/np7`,
      linkNext:`${basePath}/np9`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"8XGSOZE3vaA",
      letra: letranp8,
      detalles: detalles,
      icon: AscendenteIcon
      },

      { 
      id:"np9",
      nom: "♎︎ Ascendente Libra",
      link:`${basePath}/np9`,
      linkAnterior:`${basePath}/np8`,
      linkNext:`${basePath}/np10`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"WnzBfpvXqgA",
      letra: letranp9,
      detalles: detalles,
      icon: AscendenteIcon
      },

      { 
      id:"np10",
      nom: "♏︎ Ascendente Escorpio",
      link:`${basePath}/np10`,
      linkAnterior:`${basePath}/np9`,
      linkNext:`${basePath}/np11`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"7Ng-go2w-S0",
      letra: letranp10,
      detalles: detalles,
      icon: AscendenteIcon
      },

      { 
      id:"np11",
      nom: "♐︎ Ascendente Sagitario",
      link:`${basePath}/np11`,
      linkAnterior:`${basePath}/np10`,
      linkNext:`${basePath}/np12`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"a5zmxZbPk6A",
      letra: letranp10,
      detalles: detalles,
      icon: AscendenteIcon
      },

      { 
      id:"np12",
      nom: "♑︎ Ascendente Capricornio",
      link:`${basePath}/np12`,
      linkAnterior:`${basePath}/np11`,
      linkNext:`${basePath}/np13`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"vThhLbA_VL8",
      letra: letranp10,
      detalles: detalles,
      icon: AscendenteIcon
      },

      { 
      id:"np13",
      nom: "♒︎ Ascendente Acuario",
      link:`${basePath}/np13`,
      linkAnterior:`${basePath}/np12`,
      linkNext:`${basePath}/np14`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"pgH9o-lP5Y0",
      letra: letranp10,
      detalles: detalles,
      icon: AscendenteIcon
      },

      { 
      id:"np14",
      nom: "♓︎ Ascendente Piscis",
      link:`${basePath}/np14`,
      linkAnterior:`${basePath}/np13`,
      linkNext:`${basePath}/np15`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"hJZflzNjxYo",
      letra: letranp10,
      detalles: detalles,
      icon: AscendenteIcon
      },
    ],
  },
   {
    title: "3. El Sol",
    icon: SunIcon,
    submodules: [
     { 
      id:"np15",
      nom: "♈︎ Sol en Aries",
      link:`${basePath}/np15`,
      linkAnterior:`${basePath}/np14`,
      linkNext:`${basePath}/np16`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"zbyC_x43Qx0",
      letra: letranp10,
      detalles: detalles,
      icon: SunIcon
      },

      { 
      id:"np16",
      nom: "3.2 Sol en Tauro",
      link:`${basePath}/np16`,
      linkAnterior:`${basePath}/np15`,
      linkNext:`${basePath}/np17`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"Zd0gtDOfFBU",
      letra: letranp10,
      detalles: detalles,
      icon: SunIcon
      },

      { 
      id:"np17",
      nom: "3.3 Sol en Géminis",
      link:`${basePath}/np17`,
      linkAnterior:`${basePath}/np16`,
      linkNext:`${basePath}/np18`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"P-y8MOFR2wI",
      letra: letranp10,
      detalles: detalles,
      icon: SunIcon
      },

      { 
      id:"np18",
      nom: "3.4 Sol en Cáncer",
      link:`${basePath}/np18`,
      linkAnterior:`${basePath}/np17`,
      linkNext:`${basePath}/np19`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"wRO7-7Z0zsM",
      letra: letranp10,
      detalles: detalles,
      icon: SunIcon
      },

      { 
      id:"np19",
      nom: "3.5 Sol en Leo",
      link:`${basePath}/np19`,
      linkAnterior:`${basePath}/np18`,
      linkNext:`${basePath}/np20`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"wRO7-7Z0zsM",
      letra: letranp10,
      detalles: detalles,
      icon: SunIcon
      },

      { 
      id:"np20",
      nom: "3.6 Sol en Virgo",
      link:`${basePath}/np20`,
      linkAnterior:`${basePath}/np19`,
      linkNext:`${basePath}/np21`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"2na3Wq4wGiY",
      letra: letranp10,
      detalles: detalles,
      icon: SunIcon
      },

      { 
      id:"np21",
      nom: "3.7 Sol en Libra",
      link:`${basePath}/np21`,
      linkAnterior:`${basePath}/np20`,
      linkNext:`${basePath}/np22`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"jjkhJwSbaxU",
      letra: letranp10,
      detalles: detalles,
      icon: SunIcon
      },

      { 
      id:"np22",
      nom: "3.8 Sol en Escorpio",
      link:`${basePath}/np22`,
      linkAnterior:`${basePath}/np21`,
      linkNext:`${basePath}/np23`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"Q_zzeWeWwKk",
      letra: letranp10,
      detalles: detalles,
      icon: SunIcon
      },

      { 
      id:"np23",
      nom: "3.9 Sol en Sagitario",
      link:`${basePath}/np23`,
      linkAnterior:`${basePath}/np22`,
      linkNext:`${basePath}/np24`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"M3gTOQr_UAY",
      letra: letranp10,
      detalles: detalles,
      icon: SunIcon
      },

      { 
      id:"np24",
      nom: "3.10 Sol en Capricornio",
      link:`${basePath}/np24`,
      linkAnterior:`${basePath}/np23`,
      linkNext:`${basePath}/np25`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"pT7crWfsF3I",
      letra: letranp10,
      detalles: detalles,
      icon: SunIcon
      },

      { 
      id:"np25",
      nom: "3.11 Sol en Acuario",
      link:`${basePath}/np25`,
      linkAnterior:`${basePath}/np24`,
      linkNext:`${basePath}/np26`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"oMuiKav8CKM",
      letra: letranp10,
      detalles: detalles,
      icon: SunIcon
      },

      { 
      id:"np26",
      nom: "3.12 Sol en Piscis",
      link:`${basePath}/np26`,
      linkAnterior:`${basePath}/np25`,
      linkNext:`${basePath}/np27`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"QiP6zlkeWLg",
      letra: letranp10,
      detalles: detalles,
      icon: SunIcon
      },
        ], 
      },
        {
          title: "4. La Luna",
          icon: MoonIcon,
          submodules: [
            { 
      id:"np27",
      nom: "4.1 Luna en Aries",
      link:`${basePath}/np27`,
      linkAnterior:`${basePath}/np26`,
      linkNext:`${basePath}/np28`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"wRO7-7Z0zsM",
      letra: letranp10,
      detalles: detalles,
      icon: MoonIcon
      },

      { 
      id:"np28",
      nom: "4.2 Luna en Tauro",
      link:`${basePath}/np28`,
      linkAnterior:`${basePath}/np27`,
      linkNext:`${basePath}/np29`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"wRO7-7Z0zsM",
      letra: letranp10,
      detalles: detalles,
      icon: MoonIcon
      },

      { 
      id:"np29",
      nom: "4.3 Luna en Géminis",
      link:`${basePath}/np29`,
      linkAnterior:`${basePath}/np28`,
      linkNext:`${basePath}/np30`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"wRO7-7Z0zsM",
      letra: letranp10,
      detalles: detalles,
      icon: MoonIcon
      },

      { 
      id:"np30",
      nom: "4.4 Luna en Cáncer",
      link:`${basePath}/np30`,
      linkAnterior:`${basePath}/np29`,
      linkNext:`${basePath}/np31`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"wRO7-7Z0zsM",
      letra: letranp10,
      detalles: detalles,
      icon: MoonIcon
      },

      { 
      id:"np31",
      nom: "4.5 Luna en Leo",
      link:`${basePath}/np31`,
      linkAnterior:`${basePath}/np30`,
      linkNext:`${basePath}/np32`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"wRO7-7Z0zsM",
      letra: letranp10,
      detalles: detalles,
      icon: MoonIcon
      },

      { 
      id:"np32",
      nom: "4.6 Luna en Virgo",
      link:`${basePath}/np32`,
      linkAnterior:`${basePath}/np31`,
      linkNext:`${basePath}/np33`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"wRO7-7Z0zsM",
      letra: letranp10,
      detalles: detalles,
      icon: MoonIcon
      },

      { 
      id:"np33",
      nom: "4.7 Luna en Libra",
      link:`${basePath}/np33`,
      linkAnterior:`${basePath}/np32`,
      linkNext:`${basePath}/np34`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"wRO7-7Z0zsM",
      letra: letranp10,
      detalles: detalles,
      icon: MoonIcon
      },

      { 
      id:"np34",
      nom: "4.8 Luna en Escorpio",
      link:`${basePath}/np34`,
      linkAnterior:`${basePath}/np33`,
      linkNext:`${basePath}/np35`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"wRO7-7Z0zsM",
      letra: letranp10,
      detalles: detalles,
      icon: MoonIcon
      },

      { 
      id:"np35",
      nom: "4.9 Luna en Sagitario",
      link:`${basePath}/np35`,
      linkAnterior:`${basePath}/np34`,
      linkNext:`${basePath}/np36`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"wRO7-7Z0zsM",
      letra: letranp10,
      detalles: detalles,
      icon: MoonIcon
      },

      { 
      id:"np36",
      nom: "4.10 Luna en Capricornio",
      link:`${basePath}/np36`,
      linkAnterior:`${basePath}/np35`,
      linkNext:`${basePath}/np37`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"wRO7-7Z0zsM",
      letra: letranp10,
      detalles: detalles,
      icon: MoonIcon
      },

      { 
      id:"np37",
      nom: "4.11 Luna en Acuario",
      link:`${basePath}/np37`,
      linkAnterior:`${basePath}/np36`,
      linkNext:`${basePath}/np38`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"wRO7-7Z0zsM",
      letra: letranp10,
      detalles: detalles,
      icon: MoonIcon
      },

      { 
      id:"np38",
      nom: "4.12 Luna en Piscis",
      link:`${basePath}/np38`,
      linkAnterior:`${basePath}/np37`,
      linkNext:`${basePath}/np39`,
      descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
      video:"wRO7-7Z0zsM",
      letra: letranp10,
      detalles: detalles,
      icon: MoonIcon
      },
    ]
  }

];