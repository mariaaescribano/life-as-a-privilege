import React from "react";
import { Text } from "@chakra-ui/react";
import TCMTestPage from "./TCMTestPage";

/* ══════════════════════════════════════════════
   DATOS DEL TEST
══════════════════════════════════════════════ */
const SCALE_LABELS = ["Ausente", "Ocasional", "Frecuente", "Persistente / intenso"];

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
    subtitulo: "Estancamiento de Hígado",
    descripcion:
      "El patrón predominante es la desarmonía de Madera. El Qi de Hígado se encuentra estancado o ascendente. Prioriza movimiento físico, expresión emocional y técnicas de gestión del estrés. Evita exceso de trabajo sin descanso y alimentos muy grasos o picantes.",
  },
  {
    nombre: "Fuego",
    subtitulo: "Agitación del Shen",
    descripcion:
      "El patrón predominante es la desarmonía de Fuego. El Shen (mente-espíritu) muestra signos de agitación o calor. Prioriza la calidad del descanso nocturno, la meditación y alimentos refrescantes. Evita el exceso de estimulación y las emociones intensas sin espacio de integración.",
  },
  {
    nombre: "Tierra",
    subtitulo: "Deficiencia de Qi de Bazo",
    descripcion:
      "El patrón predominante es la desarmonía de Tierra. El Qi de Bazo está debilitado con tendencia a la humedad interna. Prioriza comidas calientes y regulares, masticación pausada y reducción de la rumiación mental. Evita crudos, lácteos en exceso y el comer deprisa o con ansiedad.",
  },
  {
    nombre: "Metal",
    subtitulo: "Deficiencia de Qi de Pulmón",
    descripcion:
      "El patrón predominante es la desarmonía de Metal. El Qi de Pulmón muestra signos de debilidad o bloqueo emocional. Prioriza la respiración consciente, la expresión de la tristeza y el contacto con la naturaleza. Evita el exceso de introspección sin acción y los entornos cerrados y secos.",
  },
  {
    nombre: "Agua",
    subtitulo: "Deficiencia de Riñón",
    descripcion:
      "El patrón predominante es la desarmonía de Agua. El Jing o el Qi de Riñón muestran signos de agotamiento. Prioriza el descanso profundo, los alimentos tonificantes (semillas, legumbres, algas) y la reducción del estrés crónico. Evita el exceso de actividad nocturna y el frío directo en zona lumbar.",
  },
];

/* ══════════════════════════════════════════════
   PÁGINA
══════════════════════════════════════════════ */
const ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#da7171">
    <path d="M824-120 636-308q-41 32-90.5 50T440-240q-90 0-162.5-44T163-400h98q34 37 79.5 58.5T440-320q100 0 170-70t70-170q0-100-70-170t-170-70q-94 0-162.5 63.5T201-580h-80q8-127 99.5-213.5T440-880q134 0 227 93t93 227q0 56-18 105.5T692-364l188 188-56 56ZM397-400l-63-208-52 148H80v-60h160l66-190h60l61 204 43-134h60l60 120h30v60h-67l-47-94-50 154h-59Z"/>
  </svg>
);

export default function TCMTest3() {
  return (
    <TCMTestPage
      pageIcon={ICON}
      tcmField="desequilibrio"
      pageTitle="Tu desequilibrio actual"
      instruccionesTitle="Patrón de Desequilibrio Actual"
      instruccionesText="Evaluación sintomática según diferenciación por Cinco Movimientos. Responde según los últimos 2–3 meses."
      scaleValues={[0, 1, 2, 3]}
      scaleLabels={SCALE_LABELS}
      scaleMobileHint="0 = Ausente · 3 = Persistente"
      secciones={ELEMENTOS}
      resultadosNota={() => (
        <Text color="rgba(255,255,255,0.48)" fontSize="xs" fontStyle="italic" letterSpacing="0.03em" lineHeight="1.9">
          El puntaje más alto indica el patrón de desequilibrio predominante en este momento.
          Dos puntajes elevados pueden sugerir interacción entre ciclos de generación o control.
          La coincidencia entre terreno constitucional (Test II) y patrón actual puede indicar sobrecarga del movimiento base.
        </Text>
      )}
      interpretacionTitle="Interpretación Clínica Orientativa"
      interpretaciones={INTERPRETACIONES}
      resultadoEtiqueta="Actual"
      localStorageKey="tcm_test3_result"
      savePrimaryKey="primaryDesequilibrio"
    />
  );
}
