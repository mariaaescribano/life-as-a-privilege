import type { Detalles, ModuloContenido } from "../../dtos/aprendizaje.type";
import { neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaTxt, MadreIcon, AdultIcon, ChildIcon, FamilyIcon } from "../../GlobalVariables";

const detalles: Detalles = { color: neuropsicologiaTxt, icon: NeuropsicologiaIcon, bgColor: neuropsicologiaBg };

const basePath = "/aprendizaje/videoLessonPage/neuropsicologia";

export const modulosNeuroPsicologia: ModuloContenido[] = [
  {
    title: "1. La Madre y el Niño",
    icon: MadreIcon,
    submodules: [
      { 
        id:"np1",
        nom: "1.1 El vínculo entre la Madre y el Hijo",
        link:`${basePath}/np1`,
        linkAnterior:"",
        linkNext:`${basePath}/np2`,
        descripcion:"",
        video:"1B0eFrj4gKI",
        detalles: detalles
      },
      { 
        id:"np2",
        nom: "1.2 El nacimiento y la insuficiencia",
        link:`${basePath}/np2`,
        linkAnterior:`${basePath}/np1`,
        linkNext:`${basePath}/np3`,
        descripcion:"",
        video:"tmWeghUViLs",
        detalles: detalles
      },
    ],
  },
  {
    title: "2. La Infancia",
    icon: FamilyIcon,
    submodules: [
      { 
        id:"np3",
        nom: "2.1 Los primeros años de Vida",
        link:`${basePath}/np3`,
        linkAnterior:`${basePath}/np2`,
        linkNext:`${basePath}/np4`,
        descripcion:"",
        video:"VvF407OJ6BU",
        detalles: detalles
      },
      { 
        id:"np4",
        nom: "2.2 Las figuras de apego y el autoabandono",
        link:`${basePath}/np4`,
        linkAnterior:`${basePath}/np3`,
        linkNext:`${basePath}/np5`,
        descripcion:"",
        video:"5RyfN75hMPc",
        detalles: detalles
      },
    ],
  },
  {
    title: "3. El adulto joven",
    icon: ChildIcon,
    submodules: [
      { 
        id:"np5",
        nom: "3.1 Los trastornos y la adolescencia",
        link:`${basePath}/np5`,
        linkAnterior:`${basePath}/np4`,
        linkNext:`${basePath}/np6`,
        descripcion:"",
        video:"WwDeog6eSVg",
        detalles: detalles
      },
      { 
        id:"np6",
        nom: "3.2 El corazón ya estaba roto",
        link:`${basePath}/np6`,
        linkAnterior:`${basePath}/np5`,
        linkNext:`${basePath}/np7`,
        descripcion:"",
        video:"JRFWroLQX5A",
        detalles: detalles
      },
      { 
        id:"np7",
        nom: "3.3 Amigos y proyecciones",
        link:`${basePath}/np7`,
        linkAnterior:`${basePath}/np6`,
        linkNext:`${basePath}/np8`,
        descripcion:"",
        video:"SxKNwEVcqtA",
        detalles: detalles
      },
    ],
  },
  {
    title: "4. El adulto",
    icon: AdultIcon,
    submodules: [
      { 
        id:"np8",
        nom: "4.1 La adultez, la decadencia y el bucle del sinsentido",
        link:`${basePath}/np8`,
        linkAnterior:`${basePath}/np7`,
        linkNext:`${basePath}/np9`,
        descripcion:"",
        video:"xr9gnO5df0g",
        detalles: detalles
      },
      { 
        id:"np9",
        nom: "4.2 La vejez y el olvido",
        link:`${basePath}/np9`,
        linkAnterior:`${basePath}/np8`,
        linkNext:`${basePath}/np10`,
        descripcion:"",
        video:"Laamt7B4KMY",
        detalles: detalles
      },
      { 
        id:"np10",
        nom: "4.3 Mirada desde la espiritualidad práctica",
        link:`${basePath}/np10`,
        linkAnterior:`${basePath}/np9`,
        linkNext:"",
        descripcion:"",
        video:"FGQQYxbFu9A",
        detalles: detalles
      },
    ],
  },
];