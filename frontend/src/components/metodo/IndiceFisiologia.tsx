// Botón «Índice» del recorrido de FISIOLOGÍA. A diferencia de las otras
// disciplinas, el índice NO muestra todo el recorrido: solo los pasos del NIVEL
// en el que está el usuario (La materia / La vida / El cuerpo). Se coloca encima
// de «Mis notas», igual que el índice del resto de disciplinas.
import React from "react";
import { useLocation } from "react-router-dom";
import { IndiceRecorrido } from "./IndiceRecorrido";
import type { PasoRecorrido } from "./psicologiaRecorrido";
import { fisiologiaBg, fisiologiaNom, fisiologiaTxt } from "../../GlobalVariables";

// Pasos agrupados por nivel del recorrido de Fisiología.
const NIVELES: { label: string; pasos: { titulo: string; path: string }[] }[] = [
  {
    label: "MATERIA",
    pasos: [
      { titulo: "Partículas",     path: "/metodo/fisiologia/particulas" },
      { titulo: "Átomos",         path: "/metodo/fisiologia/atomos" },
      { titulo: "Moléculas",      path: "/metodo/fisiologia/moleculas" },
      { titulo: "Macromoléculas", path: "/metodo/fisiologia/macromoleculas" },
      { titulo: "Estructuras",    path: "/metodo/fisiologia/estructuras" },
    ],
  },
  {
    label: "VIDA",
    pasos: [
      { titulo: "Célula",            path: "/metodo/fisiologia/celula" },
      { titulo: "Todas tus células", path: "/metodo/fisiologia/todas-tus-celulas" },
    ],
  },
  {
    label: "CUERPO",
    pasos: [
      { titulo: "Sistemas",  path: "/metodo/fisiologia/sistemas" },
      { titulo: "Organismo", path: "/metodo/fisiologia/organismo" },
    ],
  },
];

export function IndiceFisiologia() {
  const { pathname } = useLocation();
  const clean = pathname.replace(/\/+$/, "");

  // Nivel actual = el que contiene el paso de la ruta actual. Si estamos fuera
  // de un paso (intro, niveles…), no mostramos índice.
  const nivel = NIVELES.find((g) => g.pasos.some((p) => p.path === clean));
  if (!nivel) return null;

  const indice: PasoRecorrido[] = nivel.pasos.map((p, i) => ({
    n: i + 1,
    titulo: p.titulo,
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
