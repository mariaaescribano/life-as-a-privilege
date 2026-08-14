import React from "react";
import TCMTestPage from "./TCMTestPage";
import { RECS_CONSTITUCIONES } from "../data/tcmRecommendations";
import { RECS_CONSTITUCIONES_EN } from "../data/tcmRecommendations.en";
import {
  TEST1_INTERPRETACIONES_EN,
  TEST1_SECCIONES_EN,
  useInterpretacionesTcm,
  useRecsTcm,
  useSeccionesTcm,
} from "../data/tcmEspacio.en";
import { useT } from "../../../i18n";

/* ══════════════════════════════════════════════
   DATOS DEL TEST
══════════════════════════════════════════════ */
// El nombre de cada constitución es lo que se guarda en la base de datos: se
// queda en español y se traduce solo para pintar (`tcmEspacio.en.ts`).

const CONSTITUCIONES = [
  {
    nombre: "Equilibrado",
    numero: "1",
    preguntas: [
      "Me siento con energía estable durante todo el día.",
      "Duermo bien y me despierto descansado(a).",
      "Mi digestión es buena y regular.",
      "No tengo problemas frecuentes de frío, calor, cansancio o emociones extremas.",
    ],
  },
  {
    nombre: "Deficiencia de Qi",
    numero: "2",
    preguntas: [
      "Me canso fácilmente con actividad física o mental.",
      "Tengo voz baja o débil.",
      "Me resfrío con frecuencia.",
      "Sudor espontáneo incluso sin calor.",
      "Palidez en la cara o lengua.",
    ],
  },
  {
    nombre: "Deficiencia de Yang",
    numero: "3",
    preguntas: [
      "Siento frío en manos y pies, especialmente en invierno.",
      "Me canso fácilmente, incluso en reposo.",
      "Orino claro y abundante.",
      "Hinchazón en piernas o párpados por la mañana.",
      "Lengua pálida y húmeda.",
    ],
  },
  {
    nombre: "Deficiencia de Yin",
    numero: "4",
    preguntas: [
      "Tengo sensación de calor interno, sudor nocturno o manos y pies calientes.",
      "Boca o garganta seca.",
      "Palpitaciones o insomnio.",
      "Lengua roja sin capa o con grietas.",
      "Emociones inestables, ansiedad o inquietud.",
    ],
  },
  {
    nombre: "Flema-Humedad",
    numero: "5",
    preguntas: [
      "Me siento pesado(a) o lento(a) después de comer.",
      "Tengo exceso de mucosidad, resfriados frecuentes o congestión.",
      "Digestión lenta, sensación de hinchazón o gases.",
      "Obesidad o tendencia a retención de líquidos.",
      "Lengua hinchada con capa blanca y pegajosa.",
    ],
  },
  {
    nombre: "Calor-Humedad",
    numero: "6",
    preguntas: [
      "Siento calor interno acompañado de sudoración o enrojecimiento.",
      "Problemas digestivos con acidez o diarrea.",
      "Acné, inflamación o infecciones frecuentes.",
      "Orina amarilla o sensación de calor en el cuerpo.",
      "Lengua amarilla, húmeda o pegajosa.",
    ],
  },
  {
    nombre: "Estancamiento de Qi",
    numero: "7",
    preguntas: [
      "Me siento tenso(a), irritado(a) o frustrado(a) con facilidad.",
      "Dolor o presión en pecho, abdomen o costados.",
      "Digestión irregular, gases o sensación de plenitud.",
      "Cambios de humor repentinos.",
      "Movimientos intestinales irregulares.",
    ],
  },
];

const INTERPRETACIONES = [
  {
    nombre: "Equilibrado",
    descripcion: "Tu cuerpo está en buena armonía. Mantén tus hábitos de Viday sigue escuchando tu cuerpo con regularidad.",
  },
  {
    nombre: "Deficiencia de Qi",
    descripcion: "El Qi (energía vital) está disminuido. Descansa más, come caliente y nutritivo, y evita el sobreesfuerzo físico y mental.",
  },
  {
    nombre: "Deficiencia de Yang",
    descripcion: "El Yang (fuerza calórica) está débil. Abrígate, prioriza alimentos calientes, y evita crudos, frío y humedad.",
  },
  {
    nombre: "Deficiencia de Yin",
    descripcion: "El Yin (fluidos y refrigeración interna) está disminuido. Descansa, hidrátate, reduce el estrés y evita los picantes.",
  },
  {
    nombre: "Flema-Humedad",
    descripcion: "Hay exceso de Humedad interna. Evita lácteos y azúcares refinados, muévete a diario y come ligero y caliente.",
  },
  {
    nombre: "Calor-Humedad",
    descripcion: "Hay Calor y Humedad acumulados. Evita frituras, alcohol y picantes; come fresco, ligero y reduce el estrés.",
  },
  {
    nombre: "Estancamiento de Qi",
    descripcion: "El Qi está bloqueado. Muévete con regularidad, expresa tus emociones, practica respiración consciente y evita el sedentarismo.",
  },
];

/* ══════════════════════════════════════════════
   PÁGINA
══════════════════════════════════════════════ */
const ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#ffa2a2">
    <path d="M343.5-743.5Q320-767 320-800t23.5-56.5Q367-880 400-880t56.5 23.5Q480-833 480-800t-23.5 56.5Q433-720 400-720t-56.5-23.5ZM731-269q29-29 29-71t-29-71q-29-29-71-29t-71 29q-29 29-29 71t29 71q29 29 71 29t71-29ZM864-80 756-188q-22 14-46 21t-50 7q-75 0-127.5-52.5T480-340q0-75 52.5-127.5T660-520q75 0 127.5 52.5T840-340q0 26-7 50t-21 46l108 108-56 56Zm-424 0v-121q15 24 35.5 44t44.5 36v41h-80Zm-160 0v-520q-61-5-121-14.5T40-640l20-80q84 23 168.5 31.5T400-680q87 0 171.5-8.5T740-720l20 80q-59 16-119 25.5T520-600v41q-54 35-87 92.5T400-340v10q0 5 1 10h-41v240h-80Z"/>
  </svg>
);

export default function TCMTest1() {
  const t = useT();
  const secciones = useSeccionesTcm(CONSTITUCIONES, TEST1_SECCIONES_EN);
  const interpretaciones = useInterpretacionesTcm(INTERPRETACIONES, TEST1_INTERPRETACIONES_EN);
  const recs = useRecsTcm(RECS_CONSTITUCIONES, RECS_CONSTITUCIONES_EN);
  return (
    <TCMTestPage
      pageBg="#008080"
      pageIcon={ICON}
      tcmField="constitucion"
      pageTitle={t("espacio.tcm.t1.tarjeta")}
      instruccionesTitle={t("espacio.tcm.t1.instruccionesTitulo")}
      instruccionesText={t("espacio.tcm.t1.instrucciones")}
      instruccionesNota={t("espacio.tcm.t1.nota")}
      scaleValues={[0, 1, 2]}
      scaleLabels={[
        t("espacio.tcm.t1.escala1"),
        t("espacio.tcm.t1.escala2"),
        t("espacio.tcm.t1.escala3"),
      ]}
      scaleMobileHint={t("espacio.tcm.t1.escalaMovil")}
      secciones={secciones}
      interpretacionTitle={t("espacio.tcm.t1.interpretacion")}
      interpretaciones={interpretaciones}
      resultadoEtiqueta={t("espacio.tcm.t1.etiqueta")}
      localStorageKey="tcm_test1_result"
      savePrimaryKey="primaryConstitution"
      monoColor={true}
      showInterpretacion={false}
      recsMap={recs}
      backToSpaceLink="/espacio/questions/medicinachina"
    />
  );
}
