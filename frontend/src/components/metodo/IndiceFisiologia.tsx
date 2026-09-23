// Botón «Índice» del recorrido de FISIOLOGÍA. Muestra el recorrido entero en
// DOS BLOQUES (La materia · La Vida), con bloqueo SECUENCIAL: un paso solo se
// abre cuando se ha llegado a él (o cuando ya se cumple su requisito, el mismo
// que pide el botón «siguiente» de la página anterior). Se coloca encima de
// «Mis notas», igual que el índice del resto de disciplinas.
import React from "react";
import { useLocation } from "react-router-dom";
import { useIdioma } from "../../i18n";
import { IndiceRecorrido, type SeccionIndice } from "./IndiceRecorrido";
import { useTusCelulasAbierto } from "./TusCelulasModal";
import {
  fisiologiaNiveles,
  fisiologiaRutas,
  pasoAlcanzableFisiologia,
  FISIOLOGIA_TOTAL,
} from "./fisiologiaRecorrido";
import { API_URL, fisiologiaBg, fisiologiaNom, fisiologiaTxt } from "../../GlobalVariables";

export function IndiceFisiologia() {
  // Los títulos del índice salen del diccionario: al cambiar de idioma hay que
  // volver a construirlo, y para eso hace falta estar suscrito al contexto.
  useIdioma();
  const { pathname } = useLocation();
  const clean = pathname.replace(/\/+$/, "");
  // Con el popup «Tus células» abierto (pantalla completa) el Índice no pinta
  // nada: lo ocultamos mientras esté abierto.
  const tusCelulasAbierto = useTusCelulasAbierto();

  // Fuera de un paso del recorrido (intro, niveles…) no hay índice que enseñar.
  const enUnPaso = fisiologiaRutas().includes(clean);
  if (!enUnPaso || tusCelulasAbierto) return null;

  const secciones: SeccionIndice[] = fisiologiaNiveles().map((g) => ({
    titulo: g.label,
    pasos: g.pasos,
  }));

  return (
    <IndiceRecorrido
      secciones={secciones}
      total={FISIOLOGIA_TOTAL}
      tinta={fisiologiaTxt}
      bg={fisiologiaBg}
      nom={fisiologiaNom}
      luz={false}
      // Bloqueo secuencial: cada página se abre al llegar a ella, y además se
      // abre sola en cuanto se cumple el requisito del paso anterior (montar el
      // átomo, la célula, abrir los 12 sistemas…).
      progresoKey="fisiologia"
      registroKey="fisiologia"
      alcanzableUrl={(userId) => `${API_URL}/metodo-fisiologia/${userId}`}
      alcanzableDe={pasoAlcanzableFisiologia}
    />
  );
}
