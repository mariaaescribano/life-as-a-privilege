// Botón «Índice» del recorrido de MEDICINA CHINA (TCM). Reutiliza IndiceRecorrido
// con el índice y los colores de TCM. Se añade en cada página del recorrido de
// TCM (junto a BotonCompania), igual que astrología y psicología lo tienen.
import React from "react";
import { IndiceRecorrido } from "./IndiceRecorrido";
import { tcmIndice, TCM_TOTAL, pasoAlcanzableTcm } from "./tcmRecorrido";
import { useIdioma } from "../../i18n";
import { API_URL, tcmBg, tcmNom, tcmTxt } from "../../GlobalVariables";

export function IndiceTcm() {
  // Los títulos del índice vienen del diccionario: al cambiar de idioma hay que
  // volver a construirlo, y para eso hace falta estar suscrito al contexto.
  useIdioma();
  return (
    <IndiceRecorrido
      indice={tcmIndice()}
      total={TCM_TOTAL}
      tinta={tcmTxt}
      bg={tcmBg}
      nom={tcmNom}
      luz={false}
      // Bloqueo secuencial: hasta rellenar los cinco tests de elementos, el Índice
      // solo abre «Los Cinco Elementos» (paso 2); el resto queda con candado.
      progresoKey="tcm"
      alcanzableUrl={(userId) => `${API_URL}/metodo-tcm/${userId}`}
      alcanzableDe={(data) => pasoAlcanzableTcm(data)}
    />
  );
}
