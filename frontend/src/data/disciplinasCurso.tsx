import React from "react";
import {
  astrologiaNom, astrologiaBg, astrologiaTxt, AstrologiaIcon,
  neuropsicologiaNom, neuropsicologiaBg, neuropsicologiaTxt, NeuropsicologiaIcon,
  ayurvedaNom, ayurvedaNomLink, ayurvedaBg, ayurvedaTxt, AyurvedaIcon,
  tcmNom, tcmNomLink, tcmBg, tcmTxt, TCMIcon,
  fisiologiaNom, fisiologiaBg, fisiologiaTxt, FisiologiaIcon,
  nutricionNom, nutricionNomLink, nutricionBg, nutricionTxt, NutricionIcon,
  cabalaNom, cabalaBg, cabalaTxt, CabalaIcon,
  culturaNom, culturaBg, culturaTxt, CulturaIcon,
} from "../GlobalVariables";

export interface DisciplinaCurso {
  /** Slug usado en las rutas y como clave de modalidad (debe coincidir con el
   *  que usan las tarjetas de /aprendizaje/aprendizajeHome). */
  slug: string;
  /** Nombre para mostrar. */
  nom: string;
  bg: string;
  color: string;
  Icon: React.ComponentType<any>;
}

// Fuente única de las 8 disciplinas. El `slug` es el mismo que ya usan las
// tarjetas de la página de cursos, así toda la navegación encaja.
export const DISCIPLINAS_CURSO: DisciplinaCurso[] = [
  { slug: astrologiaNom,      nom: astrologiaNom,      bg: astrologiaBg,      color: astrologiaTxt,      Icon: AstrologiaIcon },
  { slug: neuropsicologiaNom, nom: neuropsicologiaNom, bg: neuropsicologiaBg, color: neuropsicologiaTxt, Icon: NeuropsicologiaIcon },
  { slug: ayurvedaNomLink,    nom: ayurvedaNom,        bg: ayurvedaBg,        color: ayurvedaTxt,        Icon: AyurvedaIcon },
  { slug: tcmNomLink,         nom: tcmNom,             bg: tcmBg,             color: tcmTxt,             Icon: TCMIcon },
  { slug: fisiologiaNom,      nom: fisiologiaNom,      bg: fisiologiaBg,      color: fisiologiaTxt,      Icon: FisiologiaIcon },
  { slug: nutricionNomLink,   nom: nutricionNom,       bg: nutricionBg,       color: nutricionTxt,       Icon: NutricionIcon },
  { slug: cabalaNom,          nom: cabalaNom,          bg: cabalaBg,          color: cabalaTxt,          Icon: CabalaIcon },
  { slug: culturaNom,         nom: culturaNom,         bg: culturaBg,         color: culturaTxt,         Icon: CulturaIcon },
];

export const disciplinaCursoBySlug = (slug: string): DisciplinaCurso | undefined =>
  DISCIPLINAS_CURSO.find((d) => d.slug === slug);
