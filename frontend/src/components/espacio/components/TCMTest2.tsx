import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import TCMTestPage from "./TCMTestPage";

/* ══════════════════════════════════════════════
   DATOS DEL TEST
══════════════════════════════════════════════ */
const SCALE_LABELS = [
  "No me describe",
  "Leve tendencia",
  "Moderadamente característico",
  "Muy característico",
];

const ELEMENTOS = [
  {
    nombre: "Madera",
    numero: "I",
    dominio: "Impulso vital, dirección, capacidad decisional",
    preguntas: [
      "Tendencia natural al liderazgo o iniciativa.",
      "Necesidad de progreso y crecimiento constante.",
      "Reactividad emocional rápida ante obstáculos.",
      "Personalidad competitiva o orientada a metas.",
      "Expresión directa de opiniones.",
      "Energía que se activa rápidamente ante estímulo.",
      "Incomodidad ante la pasividad prolongada.",
      "Facilidad para planificar o proyectar a futuro.",
    ],
  },
  {
    nombre: "Fuego",
    numero: "II",
    dominio: "Expresión emocional, vínculo, vitalidad relacional",
    preguntas: [
      "Carácter expresivo y comunicativo.",
      "Búsqueda natural de conexión emocional.",
      "Facilidad para entusiasmarse.",
      "Sensibilidad emocional marcada.",
      "Presencia social cálida o carismática.",
      "Necesidad de compartir experiencias internas.",
      "Intensidad afectiva en vínculos.",
      "Tendencia a experimentar alegría como emoción dominante.",
    ],
  },
  {
    nombre: "Tierra",
    numero: "III",
    dominio: "Nutrición, sostén, estabilidad",
    preguntas: [
      "Tendencia a cuidar o sostener a otros.",
      "Búsqueda de estabilidad y rutina.",
      "Personalidad confiable y constante.",
      "Empatía desarrollada.",
      "Preferencia por entornos armoniosos.",
      "Sentido práctico en la toma de decisiones.",
      "Capacidad de contención emocional.",
      "Necesidad de seguridad estructural.",
    ],
  },
  {
    nombre: "Metal",
    numero: "IV",
    dominio: "Orden interno, ética, introspección",
    preguntas: [
      "Autoexigencia o estándares elevados.",
      "Valoración marcada del orden y la estructura.",
      "Sentido ético fuerte.",
      "Tendencia a la reserva emocional.",
      "Incomodidad ante el caos.",
      "Orientación hacia profundidad más que superficialidad.",
      "Necesidad de claridad y definición.",
      "Personalidad introspectiva.",
    ],
  },
  {
    nombre: "Agua",
    numero: "V",
    dominio: "Voluntad, profundidad, conservación de energía",
    preguntas: [
      "Tendencia natural a la introspección.",
      "Necesidad frecuente de soledad para recargar energía.",
      "Interés por temas existenciales o profundos.",
      "Prudencia antes de confiar.",
      "Sensación de voluntad fuerte ante lo importante.",
      "Preferencia por entornos tranquilos.",
      "Energía interna intensa aunque poco expresiva.",
      "Intuición desarrollada.",
    ],
  },
];

const INTERPRETACIONES = [
  {
    nombre: "Madera",
    descripcion:
      "Tu terreno constitucional es el Movimiento Madera. Tu naturaleza tiende al impulso, la dirección y la iniciativa. El Hígado rige tu capacidad de planificar y avanzar. Cuida el exceso de tensión y frustración como señales de desequilibrio.",
  },
  {
    nombre: "Fuego",
    descripcion:
      "Tu terreno constitucional es el Movimiento Fuego. Tu naturaleza es expresiva, relacional y cálida. El Corazón rige tu vitalidad emocional y la conexión. Cuida la intensidad afectiva y la sobre-estimulación como señales de desequilibrio.",
  },
  {
    nombre: "Tierra",
    descripcion:
      "Tu terreno constitucional es el Movimiento Tierra. Tu naturaleza tiende al sostén, la estabilidad y el cuidado. El Bazo rige tu capacidad nutritiva y de contención. Cuida la rumiación y el agotamiento por cuidar a otros como señales de desequilibrio.",
  },
  {
    nombre: "Metal",
    descripcion:
      "Tu terreno constitucional es el Movimiento Metal. Tu naturaleza es introspectiva, precisa y ética. El Pulmón rige tu sentido del orden y los límites. Cuida la rigidez y la dificultad para soltar como señales de desequilibrio.",
  },
  {
    nombre: "Agua",
    descripcion:
      "Tu terreno constitucional es el Movimiento Agua. Tu naturaleza es profunda, intuitiva y reservada. El Riñón rige tu voluntad y la energía vital de base. Cuida el agotamiento y el miedo como señales de desequilibrio.",
  },
];

/* ══════════════════════════════════════════════
   PÁGINA
══════════════════════════════════════════════ */
const ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#da7171">
    <path d="M480-480Zm0 360q-18 0-34.5-6.5T416-146L148-415q-35-35-51.5-80T80-589q0-103 67-177t167-74q48 0 90.5 19t75.5 53q32-34 74.5-53t90.5-19q100 0 167.5 74T880-590q0 49-17 94t-51 80L543-146q-13 13-29 19.5t-34 6.5Zm40-520q10 0 19 5t14 13l68 102h166q7-17 10.5-34.5T801-590q-2-69-46-118.5T645-758q-31 0-59.5 12T536-711l-27 29q-5 6-13 9.5t-16 3.5q-8 0-16-3.5t-14-9.5l-27-29q-21-23-49-36t-60-13q-66 0-110 50.5T160-590q0 18 3 35.5t10 34.5h187q10 0 19 5t14 13l35 52 54-162q4-12 14.5-20t23.5-8Zm12 130-54 162q-4 12-15 20t-24 8q-10 0-19-5t-14-13l-68-102H236l237 237q2 2 3.5 2.5t3.5.5q2 0 3.5-.5t3.5-2.5l236-237H600q-10 0-19-5t-15-13l-34-52Z"/>
  </svg>
);

export default function TCMTest2() {
  return (
    <TCMTestPage
      pageIcon={ICON}
      tcmField="elemento"
      pageTitle="Tu elemento predominante"
      instruccionesTitle="Terreno Constitucional"
      instruccionesText="Evaluación de Tendencia Energética Base según los Cinco Movimientos. Responde según cómo ha sido la mayor parte de tu Vidaadulta, no según el estado actual."
      scaleValues={[0, 1, 2, 3]}
      scaleLabels={SCALE_LABELS}
      scaleMobileHint="0 = No me describe · 3 = Muy característico"
      secciones={ELEMENTOS}
      resultadosNota={(totals) => {
        const sortedIdx = [...totals.map((t, i) => ({ t, i }))].sort((a, b) => b.t - a.t);
        const isMixed = sortedIdx.length >= 2 && sortedIdx[0] && sortedIdx[1] &&
          Math.abs((sortedIdx[0].t ?? 0) - (sortedIdx[1].t ?? 0)) < 3;
        return (
          <Flex direction="column" gap={1.5}>
            <Text color="rgba(255,255,255,0.48)" fontSize="md" fontStyle="italic" lineHeight="1.9">
              El mayor puntaje indica tu terreno constitucional predominante.
              El segundo puntaje corresponde al movimiento de soporte.
              {isMixed && " La diferencia menor a 3 puntos entre los dos primeros sugiere constitución mixta."}
            </Text>
            <Text color="rgba(255,255,255,0.35)" fontSize="md" fontStyle="italic">
              Esta lectura se alinea con los principios del Huangdi Neijing respecto a la diferenciación del terreno energético.
            </Text>
          </Flex>
        );
      }}
      interpretacionTitle="Interpretación Constitucional"
      interpretaciones={INTERPRETACIONES}
      resultadoEtiqueta="Tu Terreno"
      localStorageKey="tcm_test2_result"
      savePrimaryKey="primaryElemento"
       backToSpaceLink="/espacio/questions/medicinachina"
    />
  );
}
