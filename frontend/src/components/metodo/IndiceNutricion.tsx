// Botón «Índice» del recorrido de NUTRICIÓN. Muestra TODAS las páginas del
// recorrido, numeradas y pulsables, resaltando la actual. Se coloca encima de
// «Mis notas», igual que el índice del resto de disciplinas.
import React from "react";
import { IndiceRecorrido } from "./IndiceRecorrido";
import type { PasoRecorrido } from "./psicologiaRecorrido";
import { nutricionBg, nutricionNom, nutricionTxt } from "../../GlobalVariables";

// Todas las páginas del recorrido de Nutrición, en orden.
const PASOS: { titulo: string; path: string }[] = [
  { titulo: "Nutrición",              path: "/metodo/nutricion" },
  { titulo: "Los nutrientes",         path: "/metodo/nutricion/nutrientes" },
  { titulo: "Nutrientes secundarios", path: "/metodo/nutricion/nutrientes-secundarios" },
  { titulo: "La microbiota",          path: "/metodo/nutricion/microbiota" },
  { titulo: "El hambre",              path: "/metodo/nutricion/hambre" },
  { titulo: "Tu plato",               path: "/metodo/nutricion/plato" },
  { titulo: "Tus calorías y macros",  path: "/metodo/nutricion/calorias" },
  { titulo: "Preguntas y mitos",      path: "/metodo/nutricion/mitos" },
  { titulo: "Cursos para profundizar", path: "/metodo/nutricion/cursos" },
];

export function IndiceNutricion() {
  const indice: PasoRecorrido[] = PASOS.map((p, i) => ({
    n: i + 1,
    titulo: p.titulo,
    ruta: () => p.path,
  }));

  return (
    <IndiceRecorrido
      indice={indice}
      total={indice.length}
      tinta={nutricionTxt}
      bg={nutricionBg}
      nom={nutricionNom}
      luz={false}
    />
  );
}
