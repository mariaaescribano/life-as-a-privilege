// Botón «Índice» del recorrido de ASTROLOGÍA. Reutiliza IndiceRecorrido con el
// índice y los colores de astrología. Añádelo en cada página del recorrido de
// astrología (junto a BotonCompania), igual que psicología lo tiene en todas.
import React from "react";
import { IndiceRecorrido } from "./IndiceRecorrido";
import { ASTROLOGIA_INDICE, ASTROLOGIA_TOTAL } from "./astrologiaRecorrido";
import { useAstrologiaProgreso } from "../../hooks/useAstrologiaProgreso";
import { astrologiaBg, astrologiaNom, astrologiaTxt } from "../../GlobalVariables";

export function IndiceAstrologia() {
  // Marca con candado (y bloquea el acceso) las páginas que aún no están
  // desbloqueadas según el progreso del recorrido.
  const { bloqueada, cargado } = useAstrologiaProgreso();
  const indice = ASTROLOGIA_INDICE.map((p) => ({ ...p, bloqueado: bloqueada(p.n) }));

  return (
    <IndiceRecorrido
      indice={indice}
      total={ASTROLOGIA_TOTAL}
      tinta={astrologiaTxt}
      bg={astrologiaBg}
      nom={astrologiaNom}
      luz={false}
      cargando={!cargado}
    />
  );
}
