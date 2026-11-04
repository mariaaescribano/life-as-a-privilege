// Botón «Índice» del recorrido de CÁBALA. Muestra TODAS las páginas del mapa,
// numeradas y pulsables, resaltando la actual. Las páginas que aún no están
// desbloqueadas (según el progreso del usuario) salen con un candado y no son
// pulsables. Se coloca encima de «Mis notas», igual que el resto de disciplinas.
// Los pasos y sus candados salen de useCabalaIndice (los comparte con el camino).
import React from "react";
import { IndiceRecorrido } from "./IndiceRecorrido";
import { useCabalaIndice } from "./useCabalaIndice";
import { cabalaBg, cabalaNom, cabalaTxt } from "../../GlobalVariables";

export function IndiceCabala() {
  const { indice, cargado, releyendo, alAbrir } = useCabalaIndice();

  return (
    <IndiceRecorrido
      indice={indice}
      total={indice.length}
      tinta={cabalaTxt}
      bg={cabalaBg}
      nom={cabalaNom}
      registroKey="cabala"
      luz={false}
      glow={cabalaTxt}
      onOpen={alAbrir}
      cargando={!cargado || releyendo}
    />
  );
}
