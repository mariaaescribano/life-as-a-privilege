// Botón «Índice» del recorrido de FISIOLOGÍA. A diferencia de las otras
// disciplinas, el índice NO muestra todo el recorrido: solo los pasos del NIVEL
// en el que está el usuario (La materia / La Vida / El cuerpo). Se coloca encima
// de «Mis notas», igual que el índice del resto de disciplinas.
import React from "react";
import { useLocation } from "react-router-dom";
import { useT, type ClaveTexto } from "../../i18n";
import { IndiceRecorrido } from "./IndiceRecorrido";
import { useTusCelulasAbierto } from "./TusCelulasModal";
import type { PasoRecorrido } from "./psicologiaRecorrido";
import { fisiologiaBg, fisiologiaNom, fisiologiaTxt } from "../../GlobalVariables";

// Pasos agrupados por nivel del recorrido de Fisiología. El nombre de cada paso
// se cita por su clave —la misma que usan los botones «← anterior / siguiente →»
// de cada página—, así que el Índice y los botones dicen siempre lo mismo.
const NIVELES: { label: string; pasos: { clave: ClaveTexto; path: string }[] }[] = [
  {
    label: "MATERIA",
    pasos: [
      { clave: "fisiologia.particulas.titulo",     path: "/metodo/fisiologia/particulas" },
      { clave: "fisiologia.atomos.titulo",         path: "/metodo/fisiologia/atomos" },
      { clave: "fisiologia.moleculas.titulo",      path: "/metodo/fisiologia/moleculas" },
      { clave: "fisiologia.macromoleculas.titulo", path: "/metodo/fisiologia/macromoleculas" },
      { clave: "fisiologia.estructuras.corto",     path: "/metodo/fisiologia/estructuras" },
    ],
  },
  {
    label: "VIDA",
    pasos: [
      { clave: "fisiologia.celula.titulo",     path: "/metodo/fisiologia/celula" },
      { clave: "fisiologia.lasCelulas.corto",  path: "/metodo/fisiologia/todas-tus-celulas" },
      { clave: "fisiologia.sistemas.titulo",   path: "/metodo/fisiologia/sistemas" },
      { clave: "fisiologia.organismo.titulo",  path: "/metodo/fisiologia/organismo" },
    ],
  },
];

export function IndiceFisiologia() {
  const t = useT();
  const { pathname } = useLocation();
  const clean = pathname.replace(/\/+$/, "");
  // Con el popup «Tus células» abierto (pantalla completa) el Índice no pinta
  // nada: lo ocultamos mientras esté abierto.
  const tusCelulasAbierto = useTusCelulasAbierto();

  // Nivel actual = el que contiene el paso de la ruta actual. Si estamos fuera
  // de un paso (intro, niveles…), no mostramos índice.
  const nivel = NIVELES.find((g) => g.pasos.some((p) => p.path === clean));
  if (!nivel || tusCelulasAbierto) return null;

  const indice: PasoRecorrido[] = nivel.pasos.map((p, i) => ({
    n: i + 1,
    titulo: t(p.clave),
    ruta: () => p.path,
  }));

  return (
    <IndiceRecorrido
      indice={indice}
      total={indice.length}
      tinta={fisiologiaTxt}
      bg={fisiologiaBg}
      nom={fisiologiaNom}
      luz={false}
    />
  );
}
