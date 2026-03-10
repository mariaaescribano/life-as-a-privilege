import { neuropsicologiaNom, astrologiaNom, tcmNomLink, fitoterapiaNom, cabalaNom } from "../../GlobalVariables";
import type { ModalidadInfo } from "./cursos.type";
import { neuropsicologiaCursos } from "./NeuropsicologiaCursos";
import { astrologiaCursos } from "./AstrologiaCursos";
import { tcmCursos } from "./TCMCursos";
import { fitoterapiaCursos } from "./FitoterapiaCursos";
import { cabalaCursos } from "./CabalaCursos";

export type { Curso, ModalidadInfo } from "./cursos.type";

export const cursosData: Record<string, ModalidadInfo> = {
  [neuropsicologiaNom]: neuropsicologiaCursos,
  [astrologiaNom]: astrologiaCursos,
  [tcmNomLink]: tcmCursos,
  [fitoterapiaNom]: fitoterapiaCursos,
  [cabalaNom]: cabalaCursos,
};
