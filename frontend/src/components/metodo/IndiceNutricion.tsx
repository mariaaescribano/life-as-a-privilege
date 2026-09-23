// Botón «Índice» del recorrido de NUTRICIÓN. Muestra TODAS las páginas del
// recorrido, numeradas y pulsables, resaltando la actual. Se coloca encima de
// «Mis notas», igual que el índice del resto de disciplinas.
//
// Bloqueo SECUENCIAL: una página se abre cuando se llega a ella, y además se
// abre sola en cuanto se cumple el requisito del paso anterior (ver
// nutricionRecorrido.ts, que es donde viven el orden y los requisitos).
import React from "react";
import { useIdioma } from "../../i18n";
import { IndiceRecorrido } from "./IndiceRecorrido";
import { nutricionIndice, NUTRICION_TOTAL, pasoAlcanzableNutricion } from "./nutricionRecorrido";
import { API_URL, nutricionBg, nutricionNom, nutricionTxt } from "../../GlobalVariables";

export function IndiceNutricion() {
  // Los títulos del índice vienen del diccionario: al cambiar de idioma hay que
  // volver a construirlo, y para eso hace falta estar suscrito al contexto.
  useIdioma();
  return (
    <IndiceRecorrido
      indice={nutricionIndice()}
      total={NUTRICION_TOTAL}
      tinta={nutricionTxt}
      bg={nutricionBg}
      nom={nutricionNom}
      luz={false}
      progresoKey="nutricion"
      registroKey="nutricion"
      alcanzableUrl={(userId) => `${API_URL}/metodo-nutricion/${userId}`}
      alcanzableDe={pasoAlcanzableNutricion}
    />
  );
}
