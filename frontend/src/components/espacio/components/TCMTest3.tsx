import React from "react";
import { Text } from "@chakra-ui/react";
import TCMTestPage from "./TCMTestPage";
import { RECS_DESEQUILIBRIOS } from "../data/tcmRecommendations";
import { RECS_DESEQUILIBRIOS_EN } from "../data/tcmRecommendations.en";
import {
  TEST3_INTERPRETACIONES_EN,
  TEST3_SECCIONES_EN,
  useInterpretacionesTcm,
  useRecsTcm,
  useSeccionesTcm,
} from "../data/tcmEspacio.en";
import { useT } from "../../../i18n";

/* ══════════════════════════════════════════════
   DATOS DEL TEST
   El nombre del elemento es la clave que se guarda: se queda en
   español y se traduce solo para pintar (`tcmEspacio.en.ts`).
══════════════════════════════════════════════ */

const ELEMENTOS = [
  {
    nombre: "Madera",
    numero: "I",
    dominio: "Ira, estancamiento, tensión muscular",
    preguntas: [
      "Irritabilidad o frustración frecuente.",
      "Tensión en cuello, hombros o mandíbula.",
      "Cefaleas temporales o migrañas.",
      "Suspiros frecuentes.",
      "Digestión alterada por estrés.",
      "Sensación de estar bloqueado(a) en proyectos.",
      "Despertares nocturnos entre 1–3 de la madrugada.",
      "Cambios bruscos de humor.",
    ],
  },
  {
    nombre: "Fuego",
    numero: "II",
    dominio: "Agitación del Shen, calor interno",
    preguntas: [
      "Insomnio o sueño ligero.",
      "Palpitaciones.",
      "Ansiedad o agitación mental nocturna.",
      "Sensación de calor o rubor facial.",
      "Emociones intensas difíciles de modular.",
      "Sudoración espontánea.",
      "Lengua roja o punta roja (si se observa).",
      "Nerviosismo social o afectivo.",
    ],
  },
  {
    nombre: "Tierra",
    numero: "III",
    dominio: "Deficiencia de Qi, humedad interna",
    preguntas: [
      "Pesadez corporal.",
      "Distensión abdominal después de comer.",
      "Fatiga después de comer.",
      "Rumiación mental excesiva.",
      "Antojos de dulce.",
      "Heces pastosas o blandas.",
      "Dificultad de concentración.",
      "Sensación de agotamiento por sobrecarga emocional.",
    ],
  },
  {
    nombre: "Metal",
    numero: "IV",
    dominio: "Tristeza, alteración del Qi respiratorio",
    preguntas: [
      "Melancolía persistente.",
      "Dificultad para soltar eventos pasados.",
      "Congestión o tos leve recurrente.",
      "Piel seca.",
      "Opresión torácica leve.",
      "Tendencia al estreñimiento.",
      "Suspiros profundos.",
      "Rigidez emocional ante cambios.",
    ],
  },
  {
    nombre: "Agua",
    numero: "V",
    dominio: "Deficiencia de Jing o Qi",
    preguntas: [
      "Cansancio profundo o crónico.",
      "Dolor lumbar o debilidad en rodillas.",
      "Sensación de frío frecuente.",
      "Miedo o inseguridad persistente.",
      "Disminución de motivación.",
      "Despertar no reparador.",
      "Micción frecuente o nocturna.",
      "Tendencia al aislamiento excesivo.",
    ],
  },
];

const INTERPRETACIONES = [
  {
    nombre: "Madera",
    subtitulo: "Estancamiento de hígado",
    descripcion:
      "El patrón predominante es la desarmonía de Madera. El Qi de hígado se encuentra estancado o ascendente. Prioriza movimiento físico, expresión emocional y técnicas de gestión del estrés. Evita exceso de trabajo sin descanso y alimentos muy grasos o picantes.",
  },
  {
    nombre: "Fuego",
    subtitulo: "Agitación del Shen",
    descripcion:
      "El patrón predominante es la desarmonía de Fuego. El Shen (mente-espíritu) muestra signos de agitación o calor. Prioriza la calidad del descanso nocturno, la meditación y alimentos refrescantes. Evita el exceso de estimulación y las emociones intensas sin espacio de integración.",
  },
  {
    nombre: "Tierra",
    subtitulo: "Deficiencia de Qi de bazo",
    descripcion:
      "El patrón predominante es la desarmonía de Tierra. El Qi de bazo está debilitado con tendencia a la humedad interna. Prioriza comidas calientes y regulares, masticación pausada y reducción de la rumiación mental. Evita crudos, lácteos en exceso y el comer deprisa o con ansiedad.",
  },
  {
    nombre: "Metal",
    subtitulo: "Deficiencia de Qi de pulmón",
    descripcion:
      "El patrón predominante es la desarmonía de Metal. El Qi de pulmón muestra signos de debilidad o bloqueo emocional. Prioriza la respiración consciente, la expresión de la tristeza y el contacto con la naturaleza. Evita el exceso de introspección sin acción y los entornos cerrados y secos.",
  },
  {
    nombre: "Agua",
    subtitulo: "Deficiencia de riñón",
    descripcion:
      "El patrón predominante es la desarmonía de Agua. El Jing o el Qi de riñón muestran signos de agotamiento. Prioriza el descanso profundo, los alimentos tonificantes (semillas, legumbres, algas) y la reducción del estrés crónico. Evita el exceso de actividad nocturna y el frío directo en zona lumbar.",
  },
];

/* ══════════════════════════════════════════════
   PÁGINA
══════════════════════════════════════════════ */
const ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#ffa2a2">
    <path d="M824-120 636-308q-41 32-90.5 50T440-240q-90 0-162.5-44T163-400h98q34 37 79.5 58.5T440-320q100 0 170-70t70-170q0-100-70-170t-170-70q-94 0-162.5 63.5T201-580h-80q8-127 99.5-213.5T440-880q134 0 227 93t93 227q0 56-18 105.5T692-364l188 188-56 56ZM397-400l-63-208-52 148H80v-60h160l66-190h60l61 204 43-134h60l60 120h30v60h-67l-47-94-50 154h-59Z"/>
  </svg>
);

export default function TCMTest3() {
  const t = useT();
  const secciones = useSeccionesTcm(ELEMENTOS, TEST3_SECCIONES_EN);
  const interpretaciones = useInterpretacionesTcm(INTERPRETACIONES, TEST3_INTERPRETACIONES_EN);
  const recs = useRecsTcm(RECS_DESEQUILIBRIOS, RECS_DESEQUILIBRIOS_EN);
  return (
    <TCMTestPage
      pageIcon={ICON}
      tcmField="desequilibrio"
      pageTitle={t("espacio.tcm.t3.tarjeta")}
      instruccionesTitle={t("espacio.tcm.t3.instruccionesTitulo")}
      instruccionesText={t("espacio.tcm.t3.instrucciones")}
      scaleValues={[0, 1, 2, 3]}
      scaleLabels={[
        t("espacio.tcm.t3.escala1"),
        t("espacio.tcm.t3.escala2"),
        t("espacio.tcm.t3.escala3"),
        t("espacio.tcm.t3.escala4"),
      ]}
      scaleMobileHint={t("espacio.tcm.t3.escalaMovil")}
      secciones={secciones}
      resultadosNota={() => (
        <Text color="rgba(255,255,255,0.48)" fontSize="xs" fontStyle="italic" letterSpacing="0.03em" lineHeight="1.9">
          {t("espacio.tcm.t3.nota")}
        </Text>
      )}
      interpretacionTitle={t("espacio.tcm.t3.interpretacion")}
      interpretaciones={interpretaciones}
      resultadoEtiqueta={t("espacio.tcm.t3.etiqueta")}
      localStorageKey="tcm_test3_result"
      savePrimaryKey="primaryDesequilibrio"
      recsMap={recs}
      backToSpaceLink="/espacio/questions/medicinachina"
    />
  );
}
