// Botón «Índice» del recorrido de MEDICINA CHINA (TCM). Reutiliza IndiceRecorrido
// con el índice y los colores de TCM. Se añade en cada página del recorrido de
// TCM (junto a BotonCompania), igual que astrología y psicología lo tienen.
import React from "react";
import { IndiceRecorrido } from "./IndiceRecorrido";
import { TCM_INDICE, TCM_TOTAL } from "./tcmRecorrido";
import { tcmBg, tcmNom, tcmTxt } from "../../GlobalVariables";

export function IndiceTcm() {
  return (
    <IndiceRecorrido
      indice={TCM_INDICE}
      total={TCM_TOTAL}
      tinta={tcmTxt}
      bg={tcmBg}
      nom={tcmNom}
      luz={false}
    />
  );
}
