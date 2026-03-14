import type { Detalles, ModuloContenido } from "../../../dtos/aprendizaje.type";
import { cabalaNom, RecursosIconCabala, cabalaTxt, CabalaIcon, cabalaBg } from "../../../GlobalVariables";
import { cabalaLetra, tikunOlamLetra, orkliLetra, ketherLetra, chokmahLetra, chesedLetra, geburahLetra, tiferetLetra, netzachLetra, yesodLetra, malkhutLetra } from "./LetraCabala";

const detalles: Detalles = { color: cabalaTxt, icon: CabalaIcon, bgColor: cabalaBg };

const basePath = "/aprendizaje/videoLessonPage/" + cabalaNom;

export const modulosCabala: ModuloContenido[] = [
  {
    title: "Recursos",
    icon: RecursosIconCabala,
    submodules: [
      { 
        id:"cabala0",
        nom: "Recursos a tu disposición",
        link:`/recursos/` + cabalaNom,
        linkAnterior:"",
        linkNext:"",
        descripcion:"Recursos esenciales para acompañar tu aprendizaje.",
        video:"",
        letra: null,
        detalles: detalles,
        icon:null
      },
    ],
  },
  {
    title: "1. Los fundamentos",
    icon: CabalaIcon,
    submodules: [
      { 
        id:"cabala1",
        nom: "1.1 ¿Qué es la Cábala?",
        link:`${basePath}/cabala1`,
        linkAnterior:"",
        linkNext:`${basePath}/cabala2`,
        descripcion:"La Cábala es la sabiduría mística que explica el propósito del alma y la unidad de todo con el Ein Sof.",
        video:"h91IKB8GLh4",
        letra: cabalaLetra,
        detalles: detalles,
        icon: CabalaIcon
      },
      { 
        id:"cabala2",
        nom: "1.2 Tikkun Olam",
        link:`${basePath}/cabala2`,
        linkAnterior:`${basePath}/cabala1`,
        linkNext:`${basePath}/cabala3`,
        descripcion:"Tikkun Olam nos enseña que la reparación del universo comienza con nuestro amor propio y respeto hacia los demás.",
        video:"7QcXrDyqGjI",
        letra: tikunOlamLetra,
        detalles: detalles,
        icon: CabalaIcon,
      },
      { 
        id:"cabala3",
        nom: "1.3 Or & Kli",
        link:`${basePath}/cabala3`,
        linkAnterior:`${basePath}/cabala2`,
        linkNext:`${basePath}/cabala4`,
        descripcion:"Or y Kli representan las energías masculina y femenina que, al unirse, dan forma al Árbol de la Vida y al universo.",
        video:"6ulm1lcYg6c",
        letra: orkliLetra,
        detalles: detalles,
        icon: CabalaIcon,
      },
    ],
  },
  {
    title: "2. El Árbol de la Vida",
    icon: CabalaIcon,
    submodules: [
      { 
        id:"cabala4",
        nom: "2.1 Keter",
        link:`${basePath}/cabala4`,
        linkAnterior:`${basePath}/cabala3`,
        linkNext:`${basePath}/cabala5`,
        descripcion:"Keter representa la conexión con el Uno y la manifestación del amor propio y la aceptación del plan divino.",
        video:"Y3yz43ypGrQ", 
        letra: ketherLetra,
        detalles: detalles,
        icon: CabalaIcon
      },
      { 
        id:"cabala5",
        nom: "2.2 Chokmah, Binah & Da'at",
        link:`${basePath}/cabala5`,
        linkAnterior:`${basePath}/cabala4`,
        linkNext:`${basePath}/cabala6`,
        descripcion:"Chokmah es la sabiduría infinita y Binah la estructura que nos permite vivir coherentemente.",
        video:"IrZ5eZ7QdwA", 
        letra: chokmahLetra,
        detalles: detalles,
        icon: CabalaIcon
      },
      { 
        id:"cabala6",
        nom: "2.3 Chesed",
        link:`${basePath}/cabala6`,
        linkAnterior:`${basePath}/cabala5`,
        linkNext:`${basePath}/cabala7`,
        descripcion:"Chesed es la capacidad de dar con amabilidad y proporcionalidad.",
        video:"yXbpB4AfmRw", 
        letra: chesedLetra,
        detalles: detalles,
        icon: CabalaIcon
      },
      { 
        id:"cabala7",
        nom: "2.4 Gevurah",
        link:`${basePath}/cabala7`,
        linkAnterior:`${basePath}/cabala6`,
        linkNext:`${basePath}/cabala8`,
        descripcion:"Gevurah enseña a recibir de forma consciente para crecer.",
        video:"9gATLqT5qFY", 
        letra: geburahLetra,
        detalles: detalles,
        icon: CabalaIcon
      },
      { 
        id:"cabala8",
        nom: "2.5 Tiferet",
        link:`${basePath}/cabala8`,
        linkAnterior:`${basePath}/cabala7`,
        linkNext:`${basePath}/cabala9`,
        descripcion:"Tiferet es la armonía y la paz interna que nos permite reconocer desequilibrios.",
        video:"a2oykvOoTB0", 
        letra: tiferetLetra,
        detalles: detalles,
        icon: CabalaIcon
      },
      { 
        id:"cabala9",
        nom: "2.6 Netzach & Hod",
        link:`${basePath}/cabala9`,
        linkAnterior:`${basePath}/cabala8`,
        linkNext:`${basePath}/cabala10`,
        descripcion:"Netzach y Hod nos ayudan a gestionar emociones y comunicarlas de manera consciente.",
        video:"PoXe_VzFth8", 
        letra: netzachLetra,
        detalles: detalles,
        icon: CabalaIcon
      },
      { 
        id:"cabala10",
        nom: "2.7 Yesod",
        link:`${basePath}/cabala10`,
        linkAnterior:`${basePath}/cabala9`,
        linkNext:`${basePath}/cabala11`,
        descripcion:"Yesod filtra nuestra percepción del mundo a través del ego, que puede ser un aliado.",
        video:"f1cy0UWBsV8", 
        letra: yesodLetra,
        detalles: detalles,
        icon: CabalaIcon
      },
      { 
        id:"cabala11",
        nom: "2.8 Malkhut",
        link:`${basePath}/cabala11`,
        linkAnterior:`${basePath}/cabala10`,
        linkNext:`${basePath}/cabala12`,
        descripcion:"Malkhut manifiesta la energía divina en la materia, recordándonos que todo es sagrado.",
        video:"zmBsovd2dKk", 
        letra: malkhutLetra,
        detalles: detalles,
        icon: CabalaIcon
      },  
    ],
  },
];