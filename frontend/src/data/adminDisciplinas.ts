import {
  astrologiaBg, astrologiaTxt, astrologiaNom, AstrologiaIcon,
  neuropsicologiaBg, neuropsicologiaTxt, neuropsicologiaNom, NeuropsicologiaIcon,
  ayurvedaBg, ayurvedaTxt, ayurvedaNom, AyurvedaIcon,
  tcmBg, tcmTxt, tcmNom, TCMIcon,
  fisiologiaBg, fisiologiaTxt, fisiologiaNom, FisiologiaIcon,
  nutricionBg, nutricionTxt, nutricionNom, NutricionIcon,
  cabalaBg, cabalaTxt, cabalaNom, CabalaIcon,
  culturaBg, culturaTxt, culturaNom, CulturaIcon,
} from "../GlobalVariables";

export interface AdminDisciplina {
  /** slug usado en la ruta /admin/:disciplina */
  key: string;
  nombre: string;
  bg: string;
  txt: string;
  Icon: React.ComponentType<{ size?: any }>;
  /** si ya tiene editor de contenido implementado */
  editable: boolean;
}

export const ADMIN_DISCIPLINAS: AdminDisciplina[] = [
  { key: "astrologia", nombre: astrologiaNom,        bg: astrologiaBg,       txt: astrologiaTxt,       Icon: AstrologiaIcon,      editable: true  },
  { key: "psicologia", nombre: neuropsicologiaNom,   bg: neuropsicologiaBg,  txt: neuropsicologiaTxt,  Icon: NeuropsicologiaIcon, editable: false },
  { key: "ayurveda",   nombre: ayurvedaNom,          bg: ayurvedaBg,         txt: ayurvedaTxt,         Icon: AyurvedaIcon,        editable: false },
  { key: "tcm",        nombre: tcmNom,               bg: tcmBg,              txt: tcmTxt,              Icon: TCMIcon,             editable: false },
  { key: "fisiologia", nombre: fisiologiaNom,        bg: fisiologiaBg,       txt: fisiologiaTxt,       Icon: FisiologiaIcon,      editable: false },
  { key: "nutricion",  nombre: nutricionNom,         bg: nutricionBg,        txt: nutricionTxt,        Icon: NutricionIcon,       editable: false },
  { key: "cabala",     nombre: cabalaNom,            bg: cabalaBg,           txt: cabalaTxt,           Icon: CabalaIcon,          editable: false },
  { key: "cultura",    nombre: culturaNom,           bg: culturaBg,          txt: culturaTxt,          Icon: CulturaIcon,         editable: false },
];

export const disciplinaByKey = (key: string): AdminDisciplina | undefined =>
  ADMIN_DISCIPLINAS.find((d) => d.key === key);
