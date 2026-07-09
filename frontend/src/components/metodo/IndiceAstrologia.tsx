// Botón «Índice» del recorrido de ASTROLOGÍA. Reutiliza IndiceRecorrido con el
// índice y los colores de astrología. Añádelo en cada página del recorrido de
// astrología (junto a BotonCompania), igual que psicología lo tiene en todas.
import React from "react";
import { IndiceRecorrido } from "./IndiceRecorrido";
import { ASTROLOGIA_INDICE, ASTROLOGIA_TOTAL } from "./astrologiaRecorrido";
import { astrologiaBg, astrologiaNom, astrologiaTxt } from "../../GlobalVariables";

export function IndiceAstrologia() {
  return (
    <IndiceRecorrido
      indice={ASTROLOGIA_INDICE}
      total={ASTROLOGIA_TOTAL}
      tinta={astrologiaTxt}
      bg={astrologiaBg}
      nom={astrologiaNom}
    />
  );
}
