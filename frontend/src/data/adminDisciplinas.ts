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
  /** si ya tiene panel admin implementado (editor de contenido en astrología;
   *  páginas de solo lectura en psicología y ayurveda). */
  disponible: boolean;
}

export const ADMIN_DISCIPLINAS: AdminDisciplina[] = [
  { key: "astrologia", nombre: astrologiaNom,        bg: astrologiaBg,       txt: astrologiaTxt,       Icon: AstrologiaIcon,      disponible: true  },
  { key: "psicologia", nombre: neuropsicologiaNom,   bg: neuropsicologiaBg,  txt: neuropsicologiaTxt,  Icon: NeuropsicologiaIcon, disponible: true  },
  { key: "fisiologia", nombre: fisiologiaNom,        bg: fisiologiaBg,       txt: fisiologiaTxt,       Icon: FisiologiaIcon,      disponible: false },
  { key: "nutricion",  nombre: nutricionNom,         bg: nutricionBg,        txt: nutricionTxt,        Icon: NutricionIcon,       disponible: false },
  { key: "ayurveda",   nombre: ayurvedaNom,          bg: ayurvedaBg,         txt: ayurvedaTxt,         Icon: AyurvedaIcon,        disponible: true  },
  { key: "tcm",        nombre: tcmNom,               bg: tcmBg,              txt: tcmTxt,              Icon: TCMIcon,             disponible: false },
  { key: "cabala",     nombre: cabalaNom,            bg: cabalaBg,           txt: cabalaTxt,           Icon: CabalaIcon,          disponible: false },
  { key: "cultura",    nombre: culturaNom,           bg: culturaBg,          txt: culturaTxt,          Icon: CulturaIcon,         disponible: false },
];

export const disciplinaByKey = (key: string): AdminDisciplina | undefined =>
  ADMIN_DISCIPLINAS.find((d) => d.key === key);

/**
 * Las ocho disciplinas con su SCOPE de pago, en el orden del recorrido.
 *
 * El scope es el nombre de la columna en la tabla `user` (`<scope>_suscrito`,
 * `<scope>_fecha_compra`), y NO siempre coincide con el slug del panel: la
 * primera, Astrología, se guarda como `metodo` porque fue la del Mapa. Esa es
 * la única excepción, y es justo la que se olvida, así que vive escrita en un
 * solo sitio: lo usan /admin/accesos y /admin/usuarios.
 */
export interface DisciplinaPago {
  /** Columna de la cuenta: `<scope>_suscrito`. */
  scope: string;
  /** Slug del panel: /admin/<adminKey>. */
  adminKey: string;
  nombre: string;
  txt: string;
  bg: string;
}

export const DISCIPLINAS_PAGO: DisciplinaPago[] = [
  { scope: "metodo", adminKey: "astrologia" },
  { scope: "psicologia", adminKey: "psicologia" },
  { scope: "ayurveda", adminKey: "ayurveda" },
  { scope: "tcm", adminKey: "tcm" },
  { scope: "fisiologia", adminKey: "fisiologia" },
  { scope: "nutricion", adminKey: "nutricion" },
  { scope: "cabala", adminKey: "cabala" },
  { scope: "cultura", adminKey: "cultura" },
].map((d) => {
  const disc = disciplinaByKey(d.adminKey) ?? ADMIN_DISCIPLINAS[0];
  return { ...d, nombre: disc.nombre, txt: disc.txt, bg: disc.bg };
});
