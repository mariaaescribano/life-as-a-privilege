import React from "react";
import ConstruirFisio from "../../components/metodo/ConstruirFisio";

const PRE = "/recorrido/fisiologia/pre";

// Nivel 2 · La Vida — Tejidos: muchas células iguales forman un tejido.
export default function MetodoFisiologiaTejidos() {
  return (
    <ConstruirFisio
      title="Tejidos"
      pageLabel="3/4"
      prev={{ label: "← Las células", ruta: "/metodo/fisiologia/todas-tus-celulas" }}
      introTitulo="Forma un tejido"
      instruccion="Reúne varias células iguales para formar un tejido."
      zonaLabel="agrupa las células"
      forma="cluster"
      glow="#8fd6a8"
      piezas={[
        { tipo: "celula", color: "#8fd6a8", glyph: "C", label: "célula", n: 6, img: `${PRE}/celula.png` },
      ]}
      resultImg={`${PRE}/tejido.png`}
      resultTitulo="¡Has formado un tejido!"
      resultParrafos={[
        <>Muchas <b>células iguales</b> que trabajan juntas forman un <b>tejido</b>.</>,
        <>Hay tejido muscular que se contrae, tejido nervioso que transmite señales, tejido que recubre y protege… cada uno con su función.</>,
      ]}
      dataKey="tejidos_hecho"
      next={{ label: "Órganos →", ruta: "/metodo/fisiologia/organos" }}
    />
  );
}
