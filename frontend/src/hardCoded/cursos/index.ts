import { neuropsicologiaNom, astrologiaNom, tcmNomLink, cabalaNom, nutricionNomLink, ayurvedaNomLink, fisiologiaNom, culturaNom, culturaNomLink } from "../../GlobalVariables";

export const neuropsicologiaEsqNom = neuropsicologiaNom + "cursoEsq";
export const neuropsicologiaAnxNom = neuropsicologiaNom + "cursoAnx";
import type { ModalidadInfo } from "./cursos.type";
import { neuropsicologiaCursos } from "./NeuropsicologiaCursos";
import { astrologiaCursos } from "./AstrologiaCursos";
import { tcmCursos } from "./TCMCursos";
import { cabalaCursos } from "./CabalaCursos";
import { nutricionCursos } from "./NutricionCursos";
import { ayurvedaCursos } from "./AyurvedaCursos";
import { fisiologiaCursos } from "./FisiologiaCursos";
import { culturaCursos } from "./CulturaCursos";

export type { Curso, ModalidadInfo } from "./cursos.type";

export const cursosData: Record<string, ModalidadInfo> = {
  [neuropsicologiaNom]: neuropsicologiaCursos,
  [neuropsicologiaEsqNom]: neuropsicologiaCursos,
  [neuropsicologiaAnxNom]: neuropsicologiaCursos,
  [astrologiaNom]: astrologiaCursos,
  [tcmNomLink]: tcmCursos,
  [cabalaNom]: cabalaCursos,
  [nutricionNomLink]: nutricionCursos,
  [ayurvedaNomLink]: ayurvedaCursos,
  [fisiologiaNom]: fisiologiaCursos,
  [culturaNomLink]: culturaCursos,
};
