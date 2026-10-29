import React from "react";
import type { ClaveTexto } from "../../i18n";
import {
  astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaTxt,
  culturaBg, CulturaIcon, culturaNom, culturaTxt,
  cabalaBg, CabalaIcon, cabalaNom, cabalaTxt,
  fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
  nutricionBg, NutricionIcon, nutricionNom, nutricionTxt,
  tcmBg, TCMIcon, tcmNom, tcmTxt,
} from "../../GlobalVariables";

/* ═════════════════════════════════════════════════════════════════════════════
 *  DATOS DEL MAPA DE DISCIPLINAS (página «Asesorías 1:1»)  ·  PARA EL PRÓXIMO CLAUDE
 * ═════════════════════════════════════════════════════════════════════════════
 *
 *  El componente `MapaDisciplinas.tsx` ya está hecho y es 100 % guiado por este
 *  archivo. Lo único que falta son LOS TEXTOS, que los pasa María poco a poco:
 *
 *    1. Por cada disciplina de `MAPA`, rellena su array `cajitas` (las cajas que
 *       salen al desplegarla). Cada cajita lleva CLAVES de i18n, nunca texto a pelo:
 *
 *         { titulo: "mapaDisc.psicologia.1.titulo",
 *           texto:  "mapaDisc.psicologia.1.texto",      // opcional (una línea)
 *           flecha: "mapaDisc.psicologia.1.flecha" }    // opcional: el texto de la
 *                                                       // flecha hacia la SIGUIENTE
 *
 *    2. Las claves van en `src/i18n/textos/es/asesoria.ts` (fuente de verdad) y en
 *       `.../en/asesoria.ts`. Los textos visibles son de María: no los inventes ni
 *       los «mejores»; si falta uno, proponlo en el chat.
 *    3. `flecha` (en la propia disciplina) es el texto de la flecha que BAJA hacia
 *       la disciplina siguiente. Opcional.
 *
 *  Reglas del diseño (ya cumplidas por el componente; no las rompas):
 *    · De 2 a 4 cajitas por disciplina: a más, la fila de flechas se parte.
 *    · Una sola disciplina abierta a la vez. La primera sale abierta.
 *    · Una disciplina SIN cajitas no se despliega (no es un botón). Y si NINGUNA
 *      tiene cajitas, la sección entera no se pinta (así no se publica a medias).
 *    · Sin hover de ningún tipo: María lo ha pedido para todas las cajas.
 *    · Para VER el diseño sin tener textos: añade ?mapaDemo a la URL
 *      (/asesoria?mapaDemo): rellena cajitas de ejemplo solo en ese modo.
 *
 *  El orden es el de la portada: Psicología → Fisiología → Nutrición → Cultura →
 *  Medicina China → Astrología → Cábala → Ayurveda.
 * ═════════════════════════════════════════════════════════════════════════════ */

export type Cajita = {
  titulo: ClaveTexto;
  texto?: ClaveTexto;
  /** Texto de la flecha hacia la cajita siguiente (no se usa en la última). */
  flecha?: ClaveTexto;
};

export type DisciplinaMapa = {
  /** Nombre INTERNO (GlobalVariables): da el fondo y el nombre en pantalla. */
  name: string;
  bg: string;
  txt: string;
  renderIcon: (size: string) => React.ReactNode;
  /** Su frase corta (la misma de la portada). */
  lemaKey: ClaveTexto;
  /** Las cajas que salen al desplegarla. VACÍO hasta que María pase los textos. */
  cajitas: Cajita[];
  /** Texto de la flecha que baja hacia la disciplina siguiente. */
  flecha?: ClaveTexto;
};

export const MAPA: DisciplinaMapa[] = [
  { name: neuropsicologiaNom, bg: neuropsicologiaBg, txt: neuropsicologiaTxt, renderIcon: (s) => <NeuropsicologiaIcon size={{ base: s, md: s }} />, lemaKey: "welcome.lema.psicologia", cajitas: [] },
  { name: fisiologiaNom, bg: fisiologiaBg, txt: fisiologiaTxt, renderIcon: (s) => <FisiologiaIcon size={s} />, lemaKey: "welcome.lema.fisiologia", cajitas: [] },
  { name: nutricionNom, bg: nutricionBg, txt: nutricionTxt, renderIcon: (s) => <NutricionIcon size={{ base: s, md: s }} />, lemaKey: "welcome.lema.nutricion", cajitas: [] },
  { name: culturaNom, bg: culturaBg, txt: culturaTxt, renderIcon: (s) => <CulturaIcon size={{ base: s, md: s }} />, lemaKey: "welcome.lema.cultura", cajitas: [] },
  { name: tcmNom, bg: tcmBg, txt: tcmTxt, renderIcon: (s) => <TCMIcon size={s} />, lemaKey: "welcome.lema.medicinaChina", cajitas: [] },
  { name: astrologiaNom, bg: astrologiaBg, txt: astrologiaTxt, renderIcon: (s) => <AstrologiaIcon size={s} />, lemaKey: "welcome.lema.astrologia", cajitas: [] },
  { name: cabalaNom, bg: cabalaBg, txt: cabalaTxt, renderIcon: (s) => <CabalaIcon size={s} />, lemaKey: "welcome.lema.cabala", cajitas: [] },
  { name: ayurvedaNom, bg: ayurvedaBg, txt: ayurvedaTxt, renderIcon: (s) => <AyurvedaIcon size={{ base: s, md: s }} />, lemaKey: "welcome.lema.hinduismo", cajitas: [] },
];
