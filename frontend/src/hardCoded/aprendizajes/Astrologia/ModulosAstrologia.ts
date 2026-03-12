import type { Detalles, ModuloContenido } from "../../../dtos/aprendizaje.type";
import { neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaTxt, AstrologiaIcon, AscendenteIcon, SunIcon, astrologiaNom, MoonIcon } from "../../../GlobalVariables";
import { 
  asc1, asc2, asc3, asc4, asc5, asc6, asc7, asc8, asc9, asc10, asc11, asc12, 
  astrologia1, astrologia2, 
  sol1, sol2, sol3, sol4, sol5, sol6, sol7, sol8, sol9, sol10, sol11, sol12, 
  luna1, luna2, luna3, luna4, luna5, luna6, luna7, luna8, luna9, luna10, luna11, luna12
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
      { id:"sol1", nom: "Sol en ♈︎ Aries", link:`${basePath}/sol1`, linkAnterior:`${basePath}/asc12`, linkNext:`${basePath}/sol2`, descripcion:"Un Sol en Aries es valiente e independiente, guiado por su iniciativa y la libertad.", video:"zbyC_x43Qx0", letra: sol1, detalles: detalles, icon: SunIcon },
      { id:"sol2", nom: "Sol en ♉︎ Tauro", link:`${basePath}/sol2`, linkAnterior:`${basePath}/sol1`, linkNext:`${basePath}/sol3`, descripcion:"Un Sol en Tauro es paciente y leal, debe de valorar la Vida más allá de las posesiones.", video:"Zd0gtDOfFBU", letra: sol2, detalles: detalles, icon: SunIcon },
      { id:"sol3", nom: "Sol en ♊︎ Géminis", link:`${basePath}/sol3`, linkAnterior:`${basePath}/sol2`, linkNext:`${basePath}/sol4`, descripcion:"Un Sol en Géminis es curioso e inteligente, debe de integrar el conocimiento con el corazón.", video:"P-y8MOFR2wI", letra: sol3, detalles: detalles, icon: SunIcon },
      { id:"sol4", nom: "Sol en ♋︎ Cáncer", link:`${basePath}/sol4`, linkAnterior:`${basePath}/sol3`, linkNext:`${basePath}/sol5`, descripcion:"Un Sol en Cáncer es nutridor y sensible, debe diferenciar lo propio de lo ajeno.", video:"wRO7-7Z0zsM", letra: sol4, detalles: detalles, icon: SunIcon },
      { id:"sol5", nom: "Sol en ♌︎ Leo", link:`${basePath}/sol5`, linkAnterior:`${basePath}/sol4`, linkNext:`${basePath}/sol6`, descripcion:"Un Sol en Leo es creativo y brillante, debe de reconocerse y dar Amor sin depender de otros.", video:"wRO7-7Z0zsM", letra: sol5, detalles: detalles, icon: SunIcon },
      { id:"sol6", nom: "Sol en ♍︎ Virgo", link:`${basePath}/sol6`, linkAnterior:`${basePath}/sol5`, linkNext:`${basePath}/sol7`, descripcion:"Un Sol en Virgo es analítico y servicial, debe de poner sus dones meticulosos al servicio de algo mayor.", video:"2na3Wq4wGiY", letra: sol6, detalles: detalles, icon: SunIcon },
      { id:"sol7", nom: "Sol en ♎︎ Libra", link:`${basePath}/sol7`, linkAnterior:`${basePath}/sol6`, linkNext:`${basePath}/sol8`, descripcion:"Un Sol en Libra es diplomático y social, debe de encontrar la armonía en sí mismo.", video:"jjkhJwSbaxU", letra: sol7, detalles: detalles, icon: SunIcon },
      { id:"sol8", nom: "Sol en ♏︎ Escorpio", link:`${basePath}/sol8`, linkAnterior:`${basePath}/sol7`, linkNext:`${basePath}/sol9`, descripcion:"Un Sol en Escorpio es intenso y transformador, capaz de convertir su sufrimiento en crecimiento.", video:"Q_zzeWeWwKk", letra: sol8, detalles: detalles, icon: SunIcon },
      { id:"sol9", nom: "Sol en ♐︎ Sagitario", link:`${basePath}/sol9`, linkAnterior:`${basePath}/sol8`, linkNext:`${basePath}/sol10`, descripcion:"Un Sol en Sagitario es entusiasta y buscador de verdad, expandiendo su conciencia con optimismo.", video:"M3gTOQr_UAY", letra: sol9, detalles: detalles, icon: SunIcon },
      { id:"sol10", nom: "Sol en ♑︎ Capricornio", link:`${basePath}/sol10`, linkAnterior:`${basePath}/sol9`, linkNext:`${basePath}/sol11`, descripcion:"Un Sol en Capricornio es responsable y estable, orientado al legado y a la disciplina.", video:"pT7crWfsF3I", letra: sol10, detalles: detalles, icon: SunIcon },
      { id:"sol11", nom: "Sol en ♒︎ Acuario", link:`${basePath}/sol11`, linkAnterior:`${basePath}/sol10`, linkNext:`${basePath}/sol12`, descripcion:"Un Sol en Acuario es individualista y visionario, debe de integrar su valía dentro de un grupo.", video:"oMuiKav8CKM", letra: sol11, detalles: detalles, icon: SunIcon },
      { id:"sol12", nom: "Sol en ♓︎ Piscis", link:`${basePath}/sol12`, linkAnterior:`${basePath}/sol11`, linkNext:`${basePath}/luna1`, descripcion:"Un Sol en Piscis es sensible y trascendental, debe de aprender a no sacrificarse y a no hacerse pequeño.", video:"QiP6zlkeWLg", letra: sol12, detalles: detalles, icon: SunIcon }
    ]
  },
  {
    title: "4. La Luna",
    icon: MoonIcon,
    submodules: [
      {
      id:"luna1",
      nom: "Luna en ♈︎ Aries",
      link:`${basePath}/luna1`,
      linkAnterior:`${basePath}/sol12`,
      linkNext:`${basePath}/luna2`,
      descripcion:"La Luna en Aries siente que debe defenderse sola, reaccionando con independencia e impulsiVidad emocional.",
      video:"5u_eDK03nxw",
      letra: luna1,
      detalles: detalles,
      icon: MoonIcon
      },

      {
      id:"luna2",
      nom: "Luna en ♉︎ Tauro",
      link:`${basePath}/luna2`,
      linkAnterior:`${basePath}/luna1`,
      linkNext:`${basePath}/luna3`,
      descripcion:"La Luna en Tauro busca seguridad emocional en lo material, desarrollando apego a la estabilidad y a los recursos.",
      video:"yzj1MoluTiE",
      letra: luna2,
      detalles: detalles,
      icon: MoonIcon
      },

      {
      id:"luna3",
      nom: "Luna en ♊︎ Géminis",
      link:`${basePath}/luna3`,
      linkAnterior:`${basePath}/luna2`,
      linkNext:`${basePath}/luna4`,
      descripcion:"La Luna en Géminis intelectualiza las emociones porque no aprendió a expresarlas afectivamente.",
      video:"-nKmbn68i0k",
      letra: luna3,
      detalles: detalles,
      icon: MoonIcon
      },

      {
      id:"luna4",
      nom: "Luna en ♋︎ Cáncer",
      link:`${basePath}/luna4`,
      linkAnterior:`${basePath}/luna3`,
      linkNext:`${basePath}/luna5`,
      descripcion:"La Luna en Cáncer vive un fuerte apego materno que puede generar dependencia emocional y necesidad de refugio.",
      video:"WunkXx2KAxM",
      letra: luna4,
      detalles: detalles,
      icon: MoonIcon
      },

      {
      id:"luna5",
      nom: "Luna en ♌︎ Leo",
      link:`${basePath}/luna5`,
      linkAnterior:`${basePath}/luna4`,
      linkNext:`${basePath}/luna6`,
      descripcion:"La Luna en Leo necesita sentirse admirada para sentirse amada y aprender a desarrollar su propia autoestima.",
      video:"rE8ufNQMzmg",
      letra: luna5,
      detalles: detalles,
      icon: MoonIcon
      },

      {
      id:"luna6",
      nom: "Luna en ♍︎ Virgo",
      link:`${basePath}/luna6`,
      linkAnterior:`${basePath}/luna5`,
      linkNext:`${basePath}/luna7`,
      descripcion:"La Luna en Virgo cree que solo merece Amor si es útil, desarrollando perfeccionismo y autoexigencia.",
      video:"qjG1k3_94xg",
      letra: luna6,
      detalles: detalles,
      icon: MoonIcon
      },

      {
      id:"luna7",
      nom: "Luna en ♎︎ Libra",
      link:`${basePath}/luna7`,
      linkAnterior:`${basePath}/luna6`,
      linkNext:`${basePath}/luna8`,
      descripcion:"La Luna en Libra busca armonía emocional en las relaciones, evitando el conflicto y priorizando la diplomacia.",
      video:"tJa4nHwHYcI",
      letra: luna7,
      detalles: detalles,
      icon: MoonIcon
      },

      {
      id:"luna8",
      nom: "Luna en ♏︎ Escorpio",
      link:`${basePath}/luna8`,
      linkAnterior:`${basePath}/luna7`,
      linkNext:`${basePath}/luna9`,
      descripcion:"La Luna en Escorpio vive emociones intensas y complejas, donde el Amor puede confundirse con control o pérdida.",
      video:"oJ4w1IcZ6XM",
      letra: luna8,
      detalles: detalles,
      icon: MoonIcon
      },

      {
      id:"luna9",
      nom: "Luna en ♐︎ Sagitario",
      link:`${basePath}/luna9`,
      linkAnterior:`${basePath}/luna8`,
      linkNext:`${basePath}/luna10`,
      descripcion:"La Luna en Sagitario busca libertad emocional y sentido, pero puede evitar profundizar en sus sentimientos.",
      video:"uno3h94XJ2o",
      letra: luna9,
      detalles: detalles,
      icon: MoonIcon
      },

      {
      id:"luna10",
      nom: "Luna en ♑︎ Capricornio",
      link:`${basePath}/luna10`,
      linkAnterior:`${basePath}/luna9`,
      linkNext:`${basePath}/luna11`,
      descripcion:"La Luna en Capricornio aprende a reprimir sus emociones y a buscar valor a través del esfuerzo y la responsabilidad.",
      video:"vSqpdFimvV0",
      letra: luna10,
      detalles: detalles,
      icon: MoonIcon
      },

      {
      id:"luna11",
      nom: "Luna en ♒︎ Acuario",
      link:`${basePath}/luna11`,
      linkAnterior:`${basePath}/luna10`,
      linkNext:`${basePath}/luna12`,
      descripcion:"La Luna en Acuario desarrolla distancia emocional y apego evitativo para proteger su libertad.",
      video:"N2t3zsuQXNw",
      letra: luna11,
      detalles: detalles,
      icon: MoonIcon
      },

      {
      id:"luna12",
      nom: "Luna en ♓︎ Piscis",
      link:`${basePath}/luna12`,
      linkAnterior:`${basePath}/luna11`,
      linkNext:`${basePath}/luna13`,
      descripcion:"La Luna en Piscis es profundamente sensible y empática, pero necesita aprender a poner límites emocionales.",
      video:"Tca57If-0NI",
      letra: luna12,
      detalles: detalles,
      icon: MoonIcon
      }

]
  }
];