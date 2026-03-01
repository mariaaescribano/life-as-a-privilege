import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import SiteHeader from "../../global/SiteHeader";
import { tcmBg, TCMIcon, tcmNom, tcmTxt } from "../../../GlobalVariables";
import TCMElementModal from "./TCMElementModal";
import type { TCMElementData } from "./TCMElementModal";
import TCMArrowModal from "./TCMArrowModal";
import type { ArrowRelation } from "./TCMArrowModal";
import { DisciplineHeader } from "../../global/DisciplineHeader";

/* ─── Glow azul (igual que PhotoMandala) ─── */
const GLOW_BLUE =
  "0 4px 16px rgba(0,0,0,0.28), 0 0 20px rgba(107,196,200,0.5), 0 0 45px rgba(107,196,200,0.2)";

/* ─── Estilos de las tarjetas principales ─── */
const CARD_BG     = tcmBg;
const textoColor     = tcmTxt;
const CARD_BORDER = "rgba(255,255,255,0.45)";
const CARD_SHADOW = "0 8px 36px rgba(107,196,200,0.45)";

/* ═══════════════════════════════════════════
   ICONOS (Material Symbols · fill="currentColor")
═══════════════════════════════════════════ */
const EarthIcon = () => (
  <svg width="26" height="26" viewBox="0 -960 960 960" fill="currentColor">
    <path d="M200-80v-80h240v-160h-80q-83 0-141.5-58.5T160-520q0-60 33-110.5t89-73.5q9-75 65.5-125.5T480-880q76 0 132.5 50.5T678-704q56 23 89 73.5T800-520q0 83-58.5 141.5T600-320h-80v160h240v80H200Zm160-320h240q50 0 85-35t35-85q0-36-20.5-66T646-630l-42-18-6-46q-6-45-39.5-75.5T480-800q-45 0-78.5 30.5T362-694l-6 46-42 18q-33 14-53.5 44T240-520q0 50 35 85t85 35Zm120-200Z" />
  </svg>
);
const FireIcon = () => (
  <svg width="26" height="26" viewBox="0 -960 960 960" fill="currentColor">
    <path d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z" />
  </svg>
);
const WoodIcon = () => (
  <svg width="26" height="26" viewBox="0 -960 960 960" fill="currentColor">
    <path d="M440-690v-100q0-42 29-71t71-29h100v100q0 42-29 71t-71 29H440ZM220-450q-58 0-99-41t-41-99v-140h140q58 0 99 41t41 99v140H220ZM640-90q-39 0-74.5-12T501-135l-33 33q-11 11-28 11t-28-11q-11-11-11-28t11-28l33-33q-21-29-33-64.5T400-330q0-100 70-170.5T640-571h241v241q0 100-70.5 170T640-90Zm0-80q67 0 113-47t46-113v-160H640q-66 0-113 46.5T480-330q0 23 5.5 43.5T502-248l110-110q11-11 28-11t28 11q11 11 11 28t-11 28L558-192q18 11 38.5 16.5T640-170Zm1-161Z" />
  </svg>
);
const MetalIcon = () => (
  <svg width="26" height="26" viewBox="0 -960 960 960" fill="currentColor">
    <path d="M480-80q-134 0-227-93t-93-227v-200q0-122 96-201t224-79q128 0 224 79t96 201v520H480Zm0-80h80q-19-25-29.5-55.5T520-280v-42q-10 1-20 1.5t-20 .5q-67 0-129.5-23.5T240-415v15q0 100 70 170t170 70Zm120-120q0 50 35 85t85 35v-255q-26 26-56 44.5T600-340v60ZM440-560q0-66-45-111t-109-48q-22 24-34 54t-12 65q0 89 72.5 144.5T480-400q95 0 167.5-55.5T720-600q0-35-12-65.5T674-720q-64 2-109 48t-45 112h-80Zm-128.5-11.5Q300-583 300-600t11.5-28.5Q323-640 340-640t28.5 11.5Q380-617 380-600t-11.5 28.5Q357-560 340-560t-28.5-11.5Zm280 0Q580-583 580-600t11.5-28.5Q603-640 620-640t28.5 11.5Q660-617 660-600t-11.5 28.5Q637-560 620-560t-28.5-11.5ZM370-778q34 14 62 37t48 52q20-29 47.5-52t61.5-37q-25-11-52.5-16.5T480-800q-29 0-56.5 5.5T370-778Zm430 618H520h280Zm-320 0q-100 0-170-70t-70-170q0 100 70 170t170 70h80-80Zm120-120q0 50 35 85t85 35q-50 0-85-35t-35-85ZM480-689Z" />
  </svg>
);
const WaterIcon = () => (
  <svg width="26" height="26" viewBox="0 -960 960 960" fill="currentColor">
    <path d="M491-200q12-1 20.5-9.5T520-230q0-14-9-22.5t-23-7.5q-41 3-87-22.5T343-375q-2-11-10.5-18t-19.5-7q-14 0-23 10.5t-6 24.5q17 91 80 130t127 35Zm-239.5 26Q160-268 160-408q0-100 79.5-217.5T480-880q161 137 240.5 254.5T800-408q0 140-91.5 234T480-80q-137 0-228.5-94ZM652-230.5Q720-301 720-408q0-73-60.5-165T480-774Q361-665 300.5-573T240-408q0 107 68 177.5T480-160q104 0 172-70.5ZM480-480Z" />
  </svg>
);

export const ELEMENTS: TCMElementData[] = [
  {
    id: 1, name: "Tierra", chinese: "土 Tǔ",
    bgColor: "#3d1a08", iconColor: "#d4895a",
    leftPct: "39%", topPct: "6%",
    icon: <EarthIcon />,
    description:
      "La Tierra representa el centro, la estabilidad y la nutrición. En TCM, el Bazo y el Estómago transforman y transportan los alimentos en Qi y Sangre. Un Bazo equilibrado piensa con claridad; desequilibrado, nos atrapa en la preocupación crónica y el pensamiento circular.",
    fields: [
      { label: "Estación",         value: "Final de verano · Centro" },
      { label: "Órganos",          value: "Bazo · Estómago" },
      { label: "Emoción",          value: "Preocupación · Obsesión" },
      { label: "Virtud",           value: "Integridad · Confianza" },
      { label: "Sabor",            value: "Dulce" },
      { label: "Clima",            value: "Humedad" },
      { label: "Tejidos · Sentidos", value: "Músculos · Tejido conectivo · Boca" },
    ],
  },
  {
    id: 2, name: "Fuego", chinese: "火 Huǒ",
    bgColor: "#3d0808", iconColor: "#e06060",
    leftPct: "68%", topPct: "30%",
    icon: <FireIcon />,
    description:
      "El Fuego es el elemento de la conexión, la alegría y la consciencia. El Corazón alberga el Shen —la mente y el espíritu—. Cuando el Fuego arde en equilibrio, hay calidez, presencia y comunicación genuina. La gran medicina del Fuego es el amor sin condiciones.",
    fields: [
      { label: "Estación",         value: "Verano" },
      { label: "Órganos",          value: "Corazón · Intestino Delgado" },
      { label: "Emoción",          value: "Alegría · Júbilo excesivo" },
      { label: "Virtud",           value: "Amor · Sabiduría" },
      { label: "Sabor",            value: "Amargo" },
      { label: "Clima",            value: "Calor" },
      { label: "Tejidos · Sentidos", value: "Vasos sanguíneos · Lengua · Rostro" },
    ],
  },
  {
    id: 3, name: "Madera", chinese: "木 Mù",
    bgColor: "#082d08", iconColor: "#5ab85a",
    leftPct: "57%", topPct: "63%",
    icon: <WoodIcon />,
    description:
      "La Madera representa el impulso vital, el crecimiento y la visión. El Hígado mueve el Qi; cuando fluye libremente, hay creatividad y flexibilidad. La Madera nos enseña a crecer sin rigidez, como el bambú: fuerte y flexible a la vez.",
    fields: [
      { label: "Estación",         value: "Primavera" },
      { label: "Órganos",          value: "Hígado · Vesícula Biliar" },
      { label: "Emoción",          value: "Ira · Frustración" },
      { label: "Virtud",           value: "Benevolencia · Visión" },
      { label: "Sabor",            value: "Ácido" },
      { label: "Clima",            value: "Viento" },
      { label: "Tejidos · Sentidos", value: "Tendones · Uñas · Ojos" },
    ],
  },
  {
    id: 4, name: "Metal", chinese: "金 Jīn",
    bgColor: "#083030", iconColor: "#5ecfca",
    leftPct: "16%", topPct: "63%",
    icon: <MetalIcon />,
    description:
      "El Metal encarna la pureza, los límites y la capacidad de soltar. Los Pulmones reciben el Qi del cielo en cada respiración. Respirar profundo, aceptar las pérdidas y reconocer el valor de cada experiencia es su medicina.",
    fields: [
      { label: "Estación",         value: "Otoño" },
      { label: "Órganos",          value: "Pulmón · Intestino Grueso" },
      { label: "Emoción",          value: "Tristeza · Duelo" },
      { label: "Virtud",           value: "Rectitud · Claridad" },
      { label: "Sabor",            value: "Picante" },
      { label: "Clima",            value: "Sequedad" },
      { label: "Tejidos · Sentidos", value: "Piel · Vello corporal · Nariz" },
    ],
  },
  {
    id: 5, name: "Agua", chinese: "水 Shuǐ",
    bgColor: "#08102d", iconColor: "#5a90e0",
    leftPct: "11%", topPct: "30%",
    icon: <WaterIcon />,
    description:
      "El Agua es la fuente primordial. Los Riñones guardan el Jing —la esencia vital— y gobiernan el envejecimiento y la voluntad. El invierno es su estación: tiempo de recogerse y conectar con la profundidad de quiénes somos.",
    fields: [
      { label: "Estación",         value: "Invierno" },
      { label: "Órganos",          value: "Riñón · Vejiga" },
      { label: "Emoción",          value: "Miedo · Inseguridad" },
      { label: "Virtud",           value: "Sabiduría · Voluntad" },
      { label: "Sabor",            value: "Salado" },
      { label: "Clima",            value: "Frío" },
      { label: "Tejidos · Sentidos", value: "Huesos · Dientes · Cabello · Oídos" },
    ],
  },
];

/* ═══════════════════════════════════════════
   SVG — TAIJITU
═══════════════════════════════════════════ */
const YinYangIcon = ({ size = 40, isDark = false }: { size?: number; isDark?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" aria-hidden="true">
    <circle cx="100" cy="100" r="100" fill={isDark ? "white" : "#111"} />
    <path
      d="M 100 0 A 100 100 0 0 1 100 200 A 50 50 0 0 1 100 100 A 50 50 0 0 0 100 0 Z"
      fill={isDark ? "#111" : "white"}
    />
    <circle cx="100" cy="50"  r="16.67" fill={isDark ? "white" : "#111"} />
    <circle cx="100" cy="150" r="16.67" fill={isDark ? "#111" : "white"} />
  </svg>
);


/* Acceso rápido por id */
const EL = Object.fromEntries(ELEMENTS.map(e => [e.id, e]));

/* ═══════════════════════════════════════════
   DATOS — CICLO GENERADOR (相生 Shēng)
   Agua→Madera→Fuego→Tierra→Metal→Agua
═══════════════════════════════════════════ */
const SHEN_RELATIONS: Record<string, ArrowRelation> = {
  "5-3": {
    fromName: EL[5].name, fromChinese: EL[5].chinese,
    toName:   EL[3].name, toChinese:   EL[3].chinese,
    color1: EL[5].iconColor, color2: EL[3].iconColor,
    cycleLabel: "Ciclo Generador · 相生 Shēng",
    verb: "engendra",
    description:
      "El Agua nutre a la Madera, como la lluvia hace crecer el árbol. En TCM, el Riñón (Agua) nutre al Hígado (Madera), proporcionando el Yin esencial que permite a la Madera crecer con raíces profundas. Cuando el Agua escasea, la Madera se reseca, se vuelve rígida y pierde su capacidad de fluir con libertad.",
  },
  "3-2": {
    fromName: EL[3].name, fromChinese: EL[3].chinese,
    toName:   EL[2].name, toChinese:   EL[2].chinese,
    color1: EL[3].iconColor, color2: EL[2].iconColor,
    cycleLabel: "Ciclo Generador · 相生 Shēng",
    verb: "engendra",
    description:
      "La Madera alimenta al Fuego, como la leña nutre la llama. El Hígado (Madera) nutre y respalda al Corazón (Fuego). Un Hígado sano mueve el Qi y la Sangre, permitiendo que el Corazón lata con ritmo y claridad. Si la Madera se estanca, el Fuego pierde sustento y el espíritu se agita.",
  },
  "2-1": {
    fromName: EL[2].name, fromChinese: EL[2].chinese,
    toName:   EL[1].name, toChinese:   EL[1].chinese,
    color1: EL[2].iconColor, color2: EL[1].iconColor,
    cycleLabel: "Ciclo Generador · 相生 Shēng",
    verb: "engendra",
    description:
      "El Fuego calienta y transforma la Tierra, como las cenizas enriquecen el suelo. El Corazón (Fuego) sostiene al Bazo/Estómago (Tierra) con el calor yang necesario para la digestión. Sin el calor del Fuego, la Tierra se enfría, la digestión se estanca y la energía vital disminuye.",
  },
  "1-4": {
    fromName: EL[1].name, fromChinese: EL[1].chinese,
    toName:   EL[4].name, toChinese:   EL[4].chinese,
    color1: EL[1].iconColor, color2: EL[4].iconColor,
    cycleLabel: "Ciclo Generador · 相生 Shēng",
    verb: "engendra",
    description:
      "La Tierra contiene y produce al Metal, como la roca lo guarda en su interior. El Bazo (Tierra) produce la energía que nutre los Pulmones (Metal). Una Tierra fuerte alimenta los Pulmones con Qi abundante; si la Tierra falla, los Pulmones se debilitan y la voz pierde fuerza.",
  },
  "4-5": {
    fromName: EL[4].name, fromChinese: EL[4].chinese,
    toName:   EL[5].name, toChinese:   EL[5].chinese,
    color1: EL[4].iconColor, color2: EL[5].iconColor,
    cycleLabel: "Ciclo Generador · 相生 Shēng",
    verb: "engendra",
    description:
      "El Metal purifica y enriquece el Agua, como los minerales que fluyen a los ríos. Los Pulmones (Metal) dirigen el Qi hacia los Riñones (Agua), llenando la reserva esencial de Jing. Una respiración profunda y consciente es la forma más directa de nutrir la energía vital más primordial.",
  },
};

/* ═══════════════════════════════════════════
   DATOS — CICLO CONTROLADOR (相克 Kè)
   Madera→Tierra→Agua→Fuego→Metal→Madera
═══════════════════════════════════════════ */
const KE_RELATIONS: Record<string, ArrowRelation> = {
  "3-1": {
    fromName: EL[3].name, fromChinese: EL[3].chinese,
    toName:   EL[1].name, toChinese:   EL[1].chinese,
    color1: EL[3].iconColor, color2: EL[1].iconColor,
    cycleLabel: "Ciclo Controlador · 相克 Kè",
    verb: "controla",
    description:
      "La Madera controla la Tierra, como las raíces del árbol contienen el suelo. El Hígado (Madera) regula las funciones del Bazo/Estómago (Tierra). Cuando el Hígado se estanca o se excita en exceso, invade la Tierra y aparecen síntomas digestivos: acidez, náuseas, distensión y diarrea.",
  },
  "1-5": {
    fromName: EL[1].name, fromChinese: EL[1].chinese,
    toName:   EL[5].name, toChinese:   EL[5].chinese,
    color1: EL[1].iconColor, color2: EL[5].iconColor,
    cycleLabel: "Ciclo Controlador · 相克 Kè",
    verb: "controla",
    description:
      "La Tierra controla el Agua, como los diques regulan los ríos. El Bazo (Tierra) mantiene los fluidos en circulación, evitando su acumulación patológica. Si la Tierra es débil, el Agua se estanca y aparecen edemas, retención de líquidos y sensación de pesadez.",
  },
  "5-2": {
    fromName: EL[5].name, fromChinese: EL[5].chinese,
    toName:   EL[2].name, toChinese:   EL[2].chinese,
    color1: EL[5].iconColor, color2: EL[2].iconColor,
    cycleLabel: "Ciclo Controlador · 相克 Kè",
    verb: "controla",
    description:
      "El Agua controla al Fuego, como el río apaga las llamas. El Riñón (Agua) refrigera al Corazón (Fuego), evitando que su calor se dispare. Este equilibrio Agua-Fuego es la base del sueño reparador. Cuando el Agua es insuficiente, el Fuego se eleva: insomnio, palpitaciones y ansiedad.",
  },
  "2-4": {
    fromName: EL[2].name, fromChinese: EL[2].chinese,
    toName:   EL[4].name, toChinese:   EL[4].chinese,
    color1: EL[2].iconColor, color2: EL[4].iconColor,
    cycleLabel: "Ciclo Controlador · 相克 Kè",
    verb: "controla",
    description:
      "El Fuego funde y da forma al Metal. El Corazón (Fuego) controla los Pulmones (Metal), regulando el Qi del pecho. Cuando el Fuego es excesivo, el calor invade los Pulmones y pueden aparecer tos, asma o enfermedades respiratorias de origen emocional.",
  },
  "4-3": {
    fromName: EL[4].name, fromChinese: EL[4].chinese,
    toName:   EL[3].name, toChinese:   EL[3].chinese,
    color1: EL[4].iconColor, color2: EL[3].iconColor,
    cycleLabel: "Ciclo Controlador · 相克 Kè",
    verb: "controla",
    description:
      "El Metal corta y da forma a la Madera. Los Pulmones (Metal) controlan el Hígado (Madera), limitando su tendencia al exceso. La respiración consciente es una de las herramientas más poderosas para calmar la ira y el estrés hepático. Cuando el Metal es fuerte, la Madera crece con límites saludables.",
  },
};

/* ═══════════════════════════════════════════
   DATOS — TABLAS A / B / C
═══════════════════════════════════════════ */
type TCMTableOption = { label: string; description: string };
type TCMTableData   = { header: string; options: TCMTableOption[] };

const TABLES: TCMTableData[] = [
  {
    header: "A",
    options: [
      { label: "Opción A1", description: "Descripción detallada de la opción A1. Aquí irá el contenido real de este punto." },
      { label: "Opción A2", description: "Descripción detallada de la opción A2." },
      { label: "Opción A3", description: "Descripción detallada de la opción A3." },
      { label: "Opción A4", description: "Descripción detallada de la opción A4." },
      { label: "Opción A5", description: "Descripción detallada de la opción A5." },
    ],
  },
  {
    header: "B",
    options: [
      { label: "Opción B1", description: "Descripción detallada de la opción B1." },
      { label: "Opción B2", description: "Descripción detallada de la opción B2." },
      { label: "Opción B3", description: "Descripción detallada de la opción B3." },
      { label: "Opción B4", description: "Descripción detallada de la opción B4." },
      { label: "Opción B5", description: "Descripción detallada de la opción B5." },
    ],
  },
  {
    header: "C",
    options: [
      { label: "Opción C1", description: "Descripción detallada de la opción C1." },
      { label: "Opción C2", description: "Descripción detallada de la opción C2." },
      { label: "Opción C3", description: "Descripción detallada de la opción C3." },
      { label: "Opción C4", description: "Descripción detallada de la opción C4." },
      { label: "Opción C5", description: "Descripción detallada de la opción C5." },
    ],
  },
];

/* ═══════════════════════════════════════════
   GEOMETRÍA DEL PENTAGRAMA (SVG 100×100)
═══════════════════════════════════════════ */
const CENTERS: Record<number, [number, number]> = {
  1: [50, 17],   // Tierra  — top
  2: [79, 41],   // Fuego   — upper right
  3: [68, 74],   // Madera  — lower right
  4: [27, 74],   // Metal   — lower left
  5: [22, 41],   // Agua    — upper left
};
const ELEM_R = 11; // radio del círculo en coords SVG

const getArrow = (fromId: number, toId: number) => {
  const [x1c, y1c] = CENTERS[fromId];
  const [x2c, y2c] = CENTERS[toId];
  const dx = x2c - x1c, dy = y2c - y1c;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return {
    x1: x1c + (dx / dist) * ELEM_R,
    y1: y1c + (dy / dist) * ELEM_R,
    x2: x2c - (dx / dist) * ELEM_R,
    y2: y2c - (dy / dist) * ELEM_R,
  };
};

/* ═══════════════════════════════════════════
   CONTENIDO DEL MODAL YIN / YANG
═══════════════════════════════════════════ */
const MODAL_CONTENT = {
  light: {
    subtitle: "Yang 陽",
    paragraphs: [
      "La Medicina Tradicional China es un sistema con más de tres mil años de historia, nacido de una observación profunda del ser humano como parte inseparable del universo. Desde esta visión taoísta, la salud no es la ausencia de enfermedad, sino el flujo armonioso del Qi a través de los meridianos que recorren el cuerpo.",
      "El yang representa la luz, el movimiento, el calor y la función. Cuando está en equilibrio hay vitalidad, claridad mental y capacidad de transformación. La acupuntura, la moxibustión y el movimiento consciente mueven lo que se estanca, estimulan lo que se debilita y refrescan lo que arde en exceso.",
      "Comprender el yang es comprender cómo actuamos en el mundo, cómo transformamos lo que recibimos en energía, propósito y presencia.",
    ],
  },
  dark: {
    subtitle: "Yin 阴",
    paragraphs: [
      "Bajo cada acción, cada pensamiento, cada emoción, existe una sustancia que los sostiene. La medicina china lo llama Yin: la raíz, la esencia, el fluido nutritivo que da forma a todo lo que existe. Sin yin, el yang se dispersa; sin raíces, no hay crecimiento posible.",
      "El yin nos habla del descanso profundo, de la sangre que nutre el corazón y calma la mente, del Jing ancestral que guarda nuestra reserva vital. En una era de exceso yang —velocidad, ruido, sobreestimulación— recuperar el yin es el mayor acto de medicina preventiva.",
      "Desde la mirada yin de la TCM, sanar no es hacer más, sino aprender a ser. El silencio, el sueño reparador y la escucha interior son tratamientos tan poderosos como cualquier aguja.",
    ],
  },
};

/* ═══════════════════════════════════════════
   MODAL YIN/YANG
═══════════════════════════════════════════ */
const TCMInfoModal = ({ onClose }: { onClose: () => void }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const content     = isDark ? MODAL_CONTENT.dark : MODAL_CONTENT.light;
  const panelBg     = isDark ? "#0c0202"  : "#ffffff";
  const subtitleClr = isDark ? tcmTxt     : "#8b0000";
  const textColor   = isDark ? "rgba(245,224,224,0.88)" : "rgba(26,2,2,0.80)";
  const closeBg     = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const closeBdr    = isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.12)";
  const closeClr    = isDark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.45)";
  const divClr      = isDark ? "rgba(218,113,113,0.35)" : "rgba(107,4,4,0.18)";

  return (
    <Box
      position="fixed" inset={0} zIndex={1000}
      bg="rgba(0,0,0,0.68)"
      sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4} py={6}
      onClick={onClose}
    >
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        position="relative"
        w="95vw"
        maxW="720px"
        maxH="90vh"
        overflowY="auto"
        borderRadius="24px"
        bg={panelBg}
        boxShadow="0 32px 80px rgba(0,0,0,0.65)"
        sx={{
          transition: "background-color 0.38s ease",
          "&::-webkit-scrollbar": { width: "5px" },
          "&::-webkit-scrollbar-thumb": { background: "rgba(107,4,4,0.4)", borderRadius: "999px" },
        }}
      >
        <Box
          as="button"
          position="absolute" top="13px" right="13px"
          w="34px" h="34px" borderRadius="full"
          bg={closeBg} border={`1px solid ${closeBdr}`}
          display="flex" alignItems="center" justifyContent="center"
          color={closeClr} fontSize="15px" fontWeight="700"
          cursor="pointer" zIndex={10}
          _hover={{ bg: isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.10)" }}
          onClick={onClose}
        >✕</Box>

        <Box px={{ base: 6, md: 10 }} pt={10} pb={14}>
          <Box textAlign="center" mb={7}>
            <Text color={textoColor} fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700"
              fontFamily="'EB Garamond', serif" sx={{ transition: "color 0.38s ease" }}>
              Medicina Tradicional China
            </Text>
            <Text color={subtitleClr} fontSize={{ base: "xl", md: "2xl" }} fontStyle="italic"
              letterSpacing="0.1em" mt={2} sx={{ transition: "color 0.38s ease" }}>
              {content.subtitle}
            </Text>
            <Flex justify="center" mt={3} gap={1}>
              <Box w="18px" h="1.5px" borderRadius="full" bg={subtitleClr} opacity={0.3} />
              <Box w="38px" h="1.5px" borderRadius="full" bg={subtitleClr} opacity={0.6} />
              <Box w="18px" h="1.5px" borderRadius="full" bg={subtitleClr} opacity={0.3} />
            </Flex>
          </Box>
          <Box h="1px" bg={divClr} mb={7} />
          <Flex direction="column" gap={5}>
            {content.paragraphs.map((p, i) => (
              <Text key={`${isDark ? "d" : "l"}-${i}`} color={textColor}
                fontSize={{ base: "lg", md: "xl" }} lineHeight="1.88"
                fontFamily="'EB Garamond', serif" sx={{ transition: "color 0.38s ease" }}>
                {p}
              </Text>
            ))}
          </Flex>
        </Box>

        <Box
          as="button"
          position="absolute" bottom="13px" right="13px"
          w="46px" h="46px" borderRadius="full"
          display="flex" alignItems="center" justifyContent="center"
          cursor="pointer" bg="transparent" border="none" p={0}
          sx={{ transition: "transform 0.35s ease" }}
          _hover={{ transform: "rotate(90deg)" }}
          onClick={() => setIsDark(d => !d)}
        >
          <YinYangIcon size={42} isDark={isDark} />
        </Box>
      </Box>
    </Box>
  );
};

/* ═══════════════════════════════════════════
   HOOK — REVEAL ON SCROLL
═══════════════════════════════════════════ */
const useReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.06 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
};

/* ═══════════════════════════════════════════
   ESTILOS COMPARTIDOS PARA CÍRCULOS
═══════════════════════════════════════════ */
const circleStyle = (iconColor: string, bgColor: string) => ({
  w: "100%", h: "100%",
  borderRadius: "full",
  bg: bgColor,
  border: `2px solid ${iconColor}90`,
  boxShadow: `0 4px 20px rgba(0,0,0,0.45), 0 0 18px ${iconColor}99, 0 0 38px ${iconColor}40`,
  sx: {
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    transition: "transform 0.22s ease, box-shadow 0.22s ease",
  },
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

/* ═══════════════════════════════════════════
   TARJETA IZQUIERDA — foto circular yin/yang
═══════════════════════════════════════════ */
const LeftCard = ({ onOpen }: { onOpen: () => void }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <Box
      flex="1" bg={CARD_BG} border={`1px solid ${CARD_BORDER}`}
      borderRadius="2xl"
      sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
      boxShadow={CARD_SHADOW}
      display="flex" flexDirection="column"
      alignItems="flex-start"
      minH={{ base: "300px", md: "420px" }}
      p={{ base: 6, md: 8 }}
    >
      <Text color={textoColor} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700"
        fontFamily="'EB Garamond', serif" letterSpacing="0.04em" mb={0.5}>
        Yin · Yang
      </Text>
      <Text color={textoColor} fontSize={{ base: "md", md: "lg" }} fontStyle="italic"
        letterSpacing="0.08em" fontFamily="'EB Garamond', serif" mb={4}>
        阴阳 · Filosofía Taoísta
      </Text>

      <Box flex="1" w="100%" display="flex" flexDirection="column"
        alignItems="center" justifyContent="center" gap={5}>
      <Box
        as="button" onClick={onOpen}
        borderRadius="full" overflow="hidden"
        w={{ base: "165px", md: "195px", lg: "215px" }}
        h={{ base: "165px", md: "195px", lg: "215px" }}
        boxShadow={GLOW_BLUE}
        cursor="pointer" bg="rgba(107,4,4,0.3)" p={0}
        display="flex" alignItems="center" justifyContent="center" flexShrink={0}
        sx={{ transition: "transform 0.28s ease, box-shadow 0.28s ease" }}
        _hover={{ transform: "scale(1.06)", boxShadow: `${GLOW_BLUE}, 0 0 55px rgba(107,196,200,0.35)` }}
        _focus={{ outline: "none" }}
      >
        {!imgError ? (
          <Image src="/img/yinyang.png" alt="TCM" w="100%" h="100%"
            objectFit="cover" onError={() => setImgError(true)} draggable={false} />
        ) : (
          <Box color={tcmTxt} opacity={0.5}>
            <svg width="52" height="52" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </Box>
        )}
      </Box>
      <Text color={textoColor} fontSize="sm" letterSpacing="0.15em"
        textTransform="uppercase" fontStyle="italic" textAlign="center" userSelect="none">
        Haz click para explorar
      </Text>
      </Box>
    </Box>
  );
};

/* ═══════════════════════════════════════════
   TARJETA DERECHA — Wu Xing pentagrama
═══════════════════════════════════════════ */
const WuXingCard = ({ onSelectElement }: { onSelectElement: (el: TCMElementData) => void }) => {
  return (
    <Box
      flex="1" bg={CARD_BG} border={`1px solid ${CARD_BORDER}`}
      borderRadius="2xl"
      sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
      boxShadow={CARD_SHADOW}
      display="flex" flexDirection="column" alignItems="flex-start"
      minH={{ base: "300px", md: "420px" }}
      p={{ base: 6, md: 8 }}
    >
      <Text color={textoColor} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700"
        fontFamily="'EB Garamond', serif" letterSpacing="0.04em" mb={0.5}>
        Los Cinco Elementos
      </Text>
      <Text color={textoColor} fontSize={{ base: "md", md: "lg" }} fontStyle="italic"
        letterSpacing="0.08em" fontFamily="'EB Garamond', serif" mb={4}>
        五行 Wǔ Xíng
      </Text>

      <Box w="100%" display="flex" justifyContent="center" flex="1" alignItems="center">
        <Box position="relative" w={{ base: "78%", md: "82%", lg: "76%" }} sx={{ aspectRatio: "1" }}>
          {/* Líneas del pentagrama */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }}
            viewBox="0 0 100 100">
            <path d="M 50,17 L 68,74 L 22,41 L 79,41 L 32,74 Z"
              fill="none" stroke={`${tcmTxt}28`} strokeWidth="0.9" />
            <path d="M 50,17 L 79,41 L 68,74 L 32,74 L 22,41 Z"
              fill="none" stroke={`${tcmTxt}14`} strokeWidth="0.7" />
          </svg>

          {ELEMENTS.map((el) => (
            <Box key={el.id} position="absolute" left={el.leftPct} top={el.topPct}
              w="22%" sx={{ aspectRatio: "1" }}
              display="flex" alignItems="center" justifyContent="center">
              <Box
                {...circleStyle(el.iconColor, el.bgColor)}
                cursor="pointer" color={el.iconColor}
                _hover={{ transform: "scale(1.18)", boxShadow: `0 4px 20px rgba(0,0,0,0.50), 0 0 30px ${el.iconColor}ee, 0 0 60px ${el.iconColor}66` }}
                onClick={() => onSelectElement(el)}
                title={el.name}
              >
                {el.icon}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

/* ═══════════════════════════════════════════
   TARJETA DE CICLO (generador o controlador)
═══════════════════════════════════════════ */
const CycleCard = ({
  title, chinese, subtitle,
  connections,
  relations,
  onSelectRelation,
}: {
  title: string;
  chinese: string;
  subtitle: string;
  connections: [number, number][];
  relations: Record<string, ArrowRelation>;
  onSelectRelation: (rel: ArrowRelation) => void;
}) => {

  return (
    <Box
      flex="1" bg={CARD_BG} border={`1px solid ${CARD_BORDER}`}
      borderRadius="2xl"
      sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
      boxShadow={CARD_SHADOW}
      display="flex" flexDirection="column" alignItems="flex-start"
      minH={{ base: "300px", md: "420px" }}
      p={{ base: 6, md: 8 }}
    >
      <Text color={tcmTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700"
        fontFamily="'EB Garamond', serif" letterSpacing="0.04em" mb={0.5}>
        {title}
      </Text>
      <Text color={`${tcmTxt}80`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic"
        letterSpacing="0.08em" fontFamily="'EB Garamond', serif" mb={0.5}>
        {chinese}
      </Text>
      <Text color={`${tcmTxt}55`} fontSize="xl" letterSpacing="0.06em"
        fontFamily="'EB Garamond', serif" mb={4}>
        {subtitle}
      </Text>

      <Box w="100%" display="flex" justifyContent="center" flex="1" alignItems="center">
        <Box position="relative" w={{ base: "78%", md: "82%", lg: "76%" }} sx={{ aspectRatio: "1" }}>

          {/* SVG flechas + área de clic */}
          <svg
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
            viewBox="0 0 100 100"
          >
            <defs>
              {connections.map(([f, t]) => {
                const el = EL[f];
                return (
                  <marker key={`m-${f}-${t}`}
                    id={`arr-${f}-${t}`}
                    markerWidth="7" markerHeight="7"
                    refX="6" refY="3.5" orient="auto"
                  >
                    <path d="M 0 0 L 7 3.5 L 0 7 Z" fill={el.iconColor} opacity="0.75" />
                  </marker>
                );
              })}
            </defs>

            {connections.map(([f, t]) => {
              const { x1, y1, x2, y2 } = getArrow(f, t);
              const rel = relations[`${f}-${t}`];
              const color = EL[f].iconColor;
              return (
                <g key={`a-${f}-${t}`}>
                  {/* Flecha visible */}
                  <line x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={color} strokeWidth="1.6" opacity="0.65"
                    markerEnd={`url(#arr-${f}-${t})`}
                  />
                  {/* Área clicable ancha + translúcida (hover) */}
                  {rel && (
                    <line x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke="transparent" strokeWidth="12"
                      style={{ cursor: "pointer" }}
                      onClick={() => onSelectRelation(rel)}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Círculos (no clicables en este card, sólo decorativos) */}
          {ELEMENTS.map((el) => (
            <Box key={el.id} position="absolute" left={el.leftPct} top={el.topPct}
              w="22%" sx={{ aspectRatio: "1" }}
              display="flex" alignItems="center" justifyContent="center"
              pointerEvents="none"
            >
              <Box {...circleStyle(el.iconColor, el.bgColor)} color={el.iconColor}>
                {el.icon}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Text color={`${tcmTxt}85`} fontSize="xl" letterSpacing="0.10em"
        fontFamily="'EB Garamond', serif" mt={3} alignSelf="center" fontStyle="italic">
        Pulsa las flechas para explorar
      </Text>

    </Box>
  );
};

/* ═══════════════════════════════════════════
   MODAL — OPCIÓN DE TABLA (fondo blanco)
═══════════════════════════════════════════ */
const TCMOptionModal = ({
  option,
  onClose,
}: {
  option: TCMTableOption;
  onClose: () => void;
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <Box
      position="fixed" inset={0} zIndex={1300}
      bg="rgba(0,0,0,0.65)"
      sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4} py={6}
      onClick={onClose}
    >
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        position="relative"
        w="95vw"
        maxW="680px"
        maxH="90vh"
        overflowY="auto"
        borderRadius="24px"
        bg="white"
        boxShadow="0 32px 80px rgba(0,0,0,0.55)"
        sx={{
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-thumb": { background: "rgba(0,0,0,0.18)", borderRadius: "999px" },
        }}
      >
        <Box
          as="button"
          position="absolute" top="13px" right="13px"
          w="34px" h="34px" borderRadius="full"
          bg="rgba(0,0,0,0.06)" border="1px solid rgba(0,0,0,0.12)"
          display="flex" alignItems="center" justifyContent="center"
          color="rgba(0,0,0,0.45)" fontSize="15px" fontWeight="700"
          cursor="pointer"
          _hover={{ bg: "rgba(0,0,0,0.10)" }}
          onClick={onClose}
        >✕</Box>

        <Box px={{ base: 6, md: 10 }} pt={10} pb={10}>
          <Text color="rgba(0,0,0,0.85)" fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="700" fontFamily="'EB Garamond', serif" lineHeight="1.25" mb={5}>
            {option.label}
          </Text>
          <Box h="1px" bg="rgba(0,0,0,0.10)" mb={5} />
          <Text color="rgba(0,0,0,0.75)" fontSize={{ base: "lg", md: "xl" }}
            lineHeight="1.88" fontFamily="'EB Garamond', serif">
            {option.description}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

/* ═══════════════════════════════════════════
   CARD — TABLAS A / B / C + FOTO
═══════════════════════════════════════════ */
const TriTablesCard = ({ onSelect }: { onSelect: (opt: TCMTableOption) => void }) => {
  const [imgError, setImgError]  = useState(false);

  return (
    <Box
      bg={CARD_BG} border={`1px solid ${CARD_BORDER}`}
      borderRadius="2xl"
      sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
      boxShadow={CARD_SHADOW}
      p={{ base: 6, md: 8 }}
    >
      {/* ── Título — arriba del todo ── */}
      <Text color={tcmTxt} fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700"
        fontFamily="'EB Garamond', serif" letterSpacing="0.04em" mb={0.5}>
        El diagnóstico de la lengua
      </Text>
      <Text color={`${tcmTxt}80`} fontSize={{ base: "xl", md: "2xl" }} fontStyle="italic"
        letterSpacing="0.08em" fontFamily="'EB Garamond', serif" mb={8}>
        La lengua como espejo de las vísceras
      </Text>

      <Flex
        direction={{ base: "column", md: "row" }}
        gap={{ base: 7, md: 9 }}
        align={{ base: "stretch", md: "flex-start" }}
      >
        {/* ── Columna izquierda: foto ── */}
        <Box flexShrink={0} w={{ base: "100%", md: "34%" }}>
          <Box
            borderRadius="xl" overflow="hidden"
            w="100%"
            sx={{ aspectRatio: "4/3" }}
            bg="rgba(107,4,4,0.30)"
            border={`1px solid ${CARD_BORDER}`}
            boxShadow={GLOW_BLUE}
            minH="180px"
            display="flex" alignItems="center" justifyContent="center"
          >
            {!imgError ? (
              <Image
                src="/img/lengua.png"
                alt=""
                w="100%" h="100%"
                objectFit="cover"
                onError={() => setImgError(true)}
                draggable={false}
              />
            ) : (
              <Box color={tcmTxt} opacity={0.3}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
              </Box>
            )}
          </Box>
        </Box>

        {/* ── Columna derecha: 3 tablas ── */}
        <Flex flex="1" gap={{ base: 3, md: 4 }} direction={{ base: "column", sm: "row" }} align="flex-start">
          {TABLES.map((table) => (
            <Box key={table.header} flex="1" w={{ base: "100%", sm: "auto" }}>
              {/* Cabecera de tabla */}
              <Box
                bg={tcmTxt}
                borderTopRadius="lg"
                px={3} py={3}
                textAlign="center"
              >
                <Text color="#3d0000" fontWeight="700" fontSize="xl"
                  fontFamily="'EB Garamond', serif" letterSpacing="0.14em">
                  {table.header}
                </Text>
              </Box>

              {/* Opciones */}
              <Flex direction="column">
                {table.options.map((opt, idx) => (
                  <Box
                    key={idx}
                    as="button"
                    w="100%"
                    px={3} py={3}
                    bg={idx % 2 === 0 ? `${tcmTxt}30` : `${tcmTxt}1c`}
                    borderLeft={`1px solid ${tcmTxt}45`}
                    borderRight={`1px solid ${tcmTxt}45`}
                    borderBottom={`1px solid ${tcmTxt}30`}
                    borderBottomRadius={idx === table.options.length - 1 ? "lg" : "0"}
                    textAlign="left"
                    cursor="pointer"
                    _hover={{ bg: `${tcmTxt}50` }}
                    sx={{
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                      transition: "background 0.18s ease",
                    }}
                    onClick={() => onSelect(opt)}
                  >
                    <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "md", md: "lg" }}
                      fontFamily="'EB Garamond', serif" lineHeight="1.4"
                      sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {opt.label}
                    </Text>
                  </Box>
                ))}
              </Flex>
            </Box>
          ))}
        </Flex>
      </Flex>
    </Box>
  );
};

const TriTablesCard2 = ({ onSelect }: { onSelect: (opt: TCMTableOption) => void }) => {
  const [imgError, setImgError]  = useState(false);

  return (
    <Box
      bg={CARD_BG} border={`1px solid ${CARD_BORDER}`}
      borderRadius="2xl"
      sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
      boxShadow={CARD_SHADOW}
      p={{ base: 6, md: 8 }}
    >
      {/* ── Título — arriba del todo ── */}
      <Text color={tcmTxt} fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700"
        fontFamily="'EB Garamond', serif" letterSpacing="0.04em" mb={0.5}>
        El diagnóstico del pulso
      </Text>
      <Text color={`${tcmTxt}80`} fontSize={{ base: "xl", md: "2xl" }} fontStyle="italic"
        letterSpacing="0.08em" fontFamily="'EB Garamond', serif" mb={8}>
        Los pulsos revelan el estado de los órganos
      </Text>

      <Flex
        direction={{ base: "column", md: "row" }}
        gap={{ base: 7, md: 9 }}
        align={{ base: "stretch", md: "flex-start" }}
      >
        {/* ── Columna izquierda: foto ── */}
        <Box flexShrink={0} w={{ base: "100%", md: "34%" }}>
          <Box
            borderRadius="xl" overflow="hidden"
            w="100%"
            sx={{ aspectRatio: "4/3" }}
            bg="rgba(107,4,4,0.30)"
            border={`1px solid ${CARD_BORDER}`}
            boxShadow={GLOW_BLUE}
            minH="180px"
            display="flex" alignItems="center" justifyContent="center"
          >
            {!imgError ? (
              <Image
                src="/img/pulso.png"
                alt=""
                w="100%" h="100%"
                objectFit="cover"
                onError={() => setImgError(true)}
                draggable={false}
              />
            ) : (
              <Box color={tcmTxt} opacity={0.3}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
              </Box>
            )}
          </Box>
        </Box>

        {/* ── Columna derecha: 3 tablas ── */}
        <Flex flex="1" gap={{ base: 3, md: 4 }} direction={{ base: "column", sm: "row" }} align="flex-start">
          {TABLES.map((table) => (
            <Box key={table.header} flex="1" w={{ base: "100%", sm: "auto" }}>
              {/* Cabecera de tabla */}
              <Box
                bg={tcmTxt}
                borderTopRadius="lg"
                px={3} py={3}
                textAlign="center"
              >
                <Text color="#3d0000" fontWeight="700" fontSize="xl"
                  fontFamily="'EB Garamond', serif" letterSpacing="0.14em">
                  {table.header}
                </Text>
              </Box>

              {/* Opciones */}
              <Flex direction="column">
                {table.options.map((opt, idx) => (
                  <Box
                    key={idx}
                    as="button"
                    w="100%"
                    px={3} py={3}
                    bg={idx % 2 === 0 ? `${tcmTxt}30` : `${tcmTxt}1c`}
                    borderLeft={`1px solid ${tcmTxt}45`}
                    borderRight={`1px solid ${tcmTxt}45`}
                    borderBottom={`1px solid ${tcmTxt}30`}
                    borderBottomRadius={idx === table.options.length - 1 ? "lg" : "0"}
                    textAlign="left"
                    cursor="pointer"
                    _hover={{ bg: `${tcmTxt}50` }}
                    sx={{
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                      transition: "background 0.18s ease",
                    }}
                    onClick={() => onSelect(opt)}
                  >
                    <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "md", md: "lg" }}
                      fontFamily="'EB Garamond', serif" lineHeight="1.4"
                      sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {opt.label}
                    </Text>
                  </Box>
                ))}
              </Flex>
            </Box>
          ))}
        </Flex>
      </Flex>
    </Box>
  );
};

// #region main

const TCMPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState<TCMElementData | null>(null);
  const [selectedRelation, setSelectedRelation] = useState<ArrowRelation | null>(null);
  const [selectedOption, setSelectedOption] = useState<TCMTableOption | null>(null);
  const cardsReveal    = useReveal();
  const cycles1Reveal  = useReveal();
  const tablesReveal   = useReveal();
  const tables2Reveal  = useReveal();
  const ctaReveal      = useReveal();
  const navigate       = useNavigate();

  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, []);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">

      {/* ── HEADER ── */}
      <SiteHeader variant="auto" />

      {/* ── MAIN ── */}
      <Flex
        direction="column"
        alignItems="center"
        flex="1"
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 10, md: 14 }}
      >

        {/* ── TÍTULO ── */}
        <DisciplineHeader
          icon={<TCMIcon size={{base: "40px", md:"50px"}}/>}
          title={tcmNom}
          bgColor={tcmBg}
          color={tcmTxt}
        />

        {/* ── FILA 1: foto + pentagrama ── */}
        <Box
          ref={cardsReveal.ref}
          w="100%" maxW="960px"
          pb={{ base: 5, md: 7 }}
          opacity={cardsReveal.visible ? 1 : 0}
          transform={cardsReveal.visible ? "none" : "translateY(22px)"}
          transition="opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s"
        >
          <Flex direction={{ base: "column", md: "row" }} gap={{ base: 5, md: 7 }} align="stretch">
            <LeftCard onOpen={() => setModalOpen(true)} />
            <WuXingCard onSelectElement={setSelectedElement} />
          </Flex>
        </Box>

        {/* ── FILA 2: ciclos ── */}
        <Box
          ref={cycles1Reveal.ref}
          w="100%" maxW="960px"
          pb={{ base: 5, md: 7 }}
          opacity={cycles1Reveal.visible ? 1 : 0}
          transform={cycles1Reveal.visible ? "none" : "translateY(22px)"}
          transition="opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s"
        >
          <Flex direction={{ base: "column", md: "row" }} gap={{ base: 5, md: 7 }} align="stretch">

            <CycleCard
              title="Ciclo Generador"
              chinese="相生 Shēng"
              subtitle="Agua → Madera → Fuego → Tierra → Metal → Agua"
              connections={[[5,3],[3,2],[2,1],[1,4],[4,5]]}
              relations={SHEN_RELATIONS}
              onSelectRelation={setSelectedRelation}
            />

            <CycleCard
              title="Ciclo Controlador"
              chinese="相克 Kè"
              subtitle="Madera → Tierra → Agua → Fuego → Metal → Madera"
              connections={[[3,1],[1,5],[5,2],[2,4],[4,3]]}
              relations={KE_RELATIONS}
              onSelectRelation={setSelectedRelation}
            />

          </Flex>
        </Box>

        {/* ── FILA 3: tablas ── */}
        <Box
          ref={tablesReveal.ref}
          w="100%" maxW="960px"
          pb={{ base: 5, md: 7 }}
          opacity={tablesReveal.visible ? 1 : 0}
          transform={tablesReveal.visible ? "none" : "translateY(22px)"}
          transition="opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s"
        >
          <TriTablesCard onSelect={setSelectedOption} />
        </Box>

        <Box
          ref={tables2Reveal.ref}
          w="100%" maxW="960px"
          pb={{ base: 5, md: 7 }}
          opacity={tables2Reveal.visible ? 1 : 0}
          transform={tables2Reveal.visible ? "none" : "translateY(22px)"}
          transition="opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s"
        >
          <TriTablesCard2 onSelect={setSelectedOption} />
        </Box>

        {/* ── SIGUE APRENDIENDO ── */}
        <Box
          ref={ctaReveal.ref}
          w="100%"
          pb={{ base: 10, md: 14 }}
          opacity={ctaReveal.visible ? 1 : 0}
          transform={ctaReveal.visible ? "none" : "translateY(22px)"}
          transition="opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s"
        >
          <Flex justify="center">
            <Flex
              as="button"
              align="center"
              gap={3}
              px={{ base: 8, md: 12 }}
              py={{ base: 3, md: 4 }}
              borderRadius="full"
              border="2px solid rgba(255,255,255,0.7)"
              bg={tcmBg}
              cursor="pointer"
              color={tcmTxt}
              fontFamily="'EB Garamond', serif"
              fontWeight="700"
              fontSize={{ base: "lg", md: "xl" }}
              letterSpacing="0.12em"
              textShadow="0 2px 8px rgba(0,0,0,0.2)"
              boxShadow="0 8px 32px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.1)"
              onClick={() => navigate("/aprendizaje/modulosPage/medicinachina")}
              _hover={{
                bg: {tcmBg},
                borderColor: "white",
                boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
                transform: "translateY(-2px)",
              }}
              transition="all 0.25s ease"
            >
              <Box flexShrink={0}>
                <TCMIcon size={{ base: "24px", md: "28px" }} />
              </Box>
              Sigue aprendiendo
            </Flex>
          </Flex>
        </Box>

        {/* ── FOOTER ── */}
        <Box as="footer" w="100%" borderTop="1px solid rgba(255,255,255,0.11)"
          px={{ base: 6, md: 16 }} py={{ base: 8, md: 10 }}>
          <Text color="rgba(255,255,255,0.42)" fontSize="xs" letterSpacing="0.05em" textAlign="center">
            © 2026 Life as a Privilege · María Escribano · Todos los derechos reservados
          </Text>
        </Box>

      </Flex>

      {/* ── MODALES — al nivel raíz para evitar problemas de stacking context ── */}
      {modalOpen && <TCMInfoModal onClose={() => setModalOpen(false)} />}
      {selectedElement && <TCMElementModal element={selectedElement} onClose={() => setSelectedElement(null)} />}
      {selectedRelation && <TCMArrowModal relation={selectedRelation} onClose={() => setSelectedRelation(null)} />}
      {selectedOption && <TCMOptionModal option={selectedOption} onClose={() => setSelectedOption(null)} />}

    </Box>
  );
};

export default TCMPage;
