import type { Detalles, ModuloContenido } from "../../dtos/aprendizaje.type";
import { neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaTxt, MadreIcon, AdultIcon, ChildIcon, FamilyIcon } from "../../GlobalVariables";
import { letranp1, letranp10, letranp2, letranp3, letranp4, letranp5, letranp6, letranp7, letranp8, letranp9 } from "./LetraNeuroPsicologia";

const detalles: Detalles = { color: neuropsicologiaTxt, icon: NeuropsicologiaIcon, bgColor: neuropsicologiaBg };

const basePath = "/aprendizaje/videoLessonPage/neuropsicologia";

export const modulosNeuroPsicologia: ModuloContenido[] = [
  {
    title: "1. La madre y el niño",
    icon: MadreIcon,
    submodules: [
      { 
        id:"np1",
        nom: "1.1 El vínculo entre la madre y el hijo",
        link:`${basePath}/np1`,
        linkAnterior:"",
        linkNext:`${basePath}/np2`,
        descripcion:"El estado de la madre influye a su hijo desde antes del embarazo.",
        video:"-w67yUcj_SM",
        letra: letranp1,
        detalles: detalles
      },
      { 
        id:"np2",
        nom: "1.2 El nacimiento y la insuficiencia",
        link:`${basePath}/np2`,
        linkAnterior:`${basePath}/np1`,
        linkNext:`${basePath}/np3`,
        descripcion:"Los padres tienen que ser seres completos antes del nacimiento o cargarán al hijo con su infelicidad y sueños rotos.",
        video:"apYqTnx9kiM",
        letra: letranp2,
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
        descripcion:"La seguridad y el Amor no deberían ser un objetivo a alcanzar dentro de la familia, sino la base desde la que cada hijo comienza su Vida.",
        video:"JqnJlu6L6mc",
        letra: letranp3,
        detalles: detalles
      },
      { 
        id:"np4",
        nom: "2.2 Las figuras de apego y el autoabandono",
        link:`${basePath}/np4`,
        linkAnterior:`${basePath}/np3`,
        linkNext:`${basePath}/np5`,
        descripcion:"Los niños se desvalidan a sí mismos antes que desvalidar a sus padres.",
        video:"wRO7-7Z0zsM",
        letra: letranp4,
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
        descripcion:"En la individualización, la falta de Amor propio de los niños aflora, y la sociedad trata de tacharles de rotos asignándoles enfermedades mentales.",
        video:"MK9lQqogmbY",
        letra: letranp5,
        detalles: detalles
      },
      { 
        id:"np6",
        nom: "3.2 El corazón ya estaba roto",
        link:`${basePath}/np6`,
        linkAnterior:`${basePath}/np5`,
        linkNext:`${basePath}/np7`,
        descripcion:"Usamos a los demás para darnos cuenta de lo rotos que ya estamos. Nadie nos rompe el corazón, solo nos muestra dónde lo estaba.",
        video:"CEE_gCwAdDM",
        letra: letranp6,
        detalles: detalles
      },
      { 
        id:"np7",
        nom: "3.3 Amigos y proyecciones",
        link:`${basePath}/np7`,
        linkAnterior:`${basePath}/np6`,
        linkNext:`${basePath}/np8`,
        descripcion:"Atraemos a personas para que nos muestren dónde no nos aceptamos.",
        video:"jmLKf9E-X6A",
        letra: letranp7,
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
        descripcion:"La gran mayoría de los adultos se menosprecian y desvaloran, hundiéndose en la pereza, pensando que por cumplir años condenados a la decadencia.",
        video:"YezjA0ZSK2Y",
        letra: letranp8,
        detalles: detalles
      },
      { 
        id:"np9",
        nom: "4.2 La vejez y el olvido",
        link:`${basePath}/np9`,
        linkAnterior:`${basePath}/np8`,
        linkNext:`${basePath}/np10`,
        descripcion:"Si te maltratas todos los días, cuando llegues a tu vejez, preferirás olvidar lo que te has hecho a tener que asumir que te has arruinado la Vida.",
        video:"xWWqi6GDH8A",
        letra: letranp9,
        detalles: detalles
      },
      { 
        id:"np10",
        nom: "4.3 Mirada desde la espiritualidad práctica",
        link:`${basePath}/np10`,
        linkAnterior:`${basePath}/np9`,
        linkNext:"",
        descripcion:"Todo tiene un sentido. La Vida nos habla en cada instante. Escúchala y no te abandones. Eres mucho más que un cuerpo físico.",
        video:"TjFVYfroda4",
        letra: letranp10,
        detalles: detalles
      },
    ],
  },
];