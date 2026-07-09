// Botón «Índice» del recorrido de AYURVEDA. Reutiliza IndiceRecorrido con el
// índice y los colores de ayurveda. Como cada dosha (vata/pitta/kapha) tiene su
// propio recorrido, lee el dosha de la URL y le pasa SU color como acento, para
// que los botones del índice se diferencien por dosha. Añádelo en cada página
// del recorrido de ayurveda (junto a BotonCompania).
import React from "react";
import { useParams } from "react-router-dom";
import { IndiceRecorrido } from "./IndiceRecorrido";
import { AYURVEDA_INDICE, AYURVEDA_TOTAL } from "./ayurvedaRecorrido";
import {
  ayurvedaBg, ayurvedaNom, ayurvedaTxt,
  vataColor, pittaColor, kaphaColor,
} from "../../GlobalVariables";

const DOSHA_COLOR: Record<string, string> = {
  vata: vataColor,
  pitta: pittaColor,
  kapha: kaphaColor,
};

export function IndiceAyurveda() {
  const { dosha } = useParams<{ dosha: string }>();
  const acento = DOSHA_COLOR[dosha || ""] || ayurvedaTxt;
  return (
    <IndiceRecorrido
      indice={AYURVEDA_INDICE}
      total={AYURVEDA_TOTAL}
      tinta={ayurvedaTxt}
      bg={ayurvedaBg}
      nom={ayurvedaNom}
      paramKey="dosha"
      acento={acento}
    />
  );
}
