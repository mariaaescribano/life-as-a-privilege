import React from "react";
import ConstruirFisio from "../../components/metodo/ConstruirFisio";

const PRE = "/recorrido/fisiologia/pre";

// Nivel 2 · La Vida — Órganos: varios tejidos distintos forman un órgano.
export default function MetodoFisiologiaOrganos() {
  return (
    <ConstruirFisio
      title="Órganos"
      pageLabel="4/4"
      prev={{ label: "← Tejidos", ruta: "/metodo/fisiologia/tejidos" }}
      introTitulo="Forma un órgano"
      instruccion="Combina varios tejidos para formar un órgano."
      zonaLabel="reúne los tejidos"
      forma="cluster"
      glow="#cfa6e0"
      piezas={[
        { tipo: "tejido", color: "#cfa6e0", glyph: "T", label: "tejido", n: 4, img: `${PRE}/tejido.png` },
      ]}
      resultImg={`${PRE}/organo.png`}
      resultTitulo="¡Has formado un órgano!"
      resultParrafos={[
        <>Varios <b>tejidos distintos</b> se combinan y forman un <b>órgano</b>, como el corazón, el pulmón o el estómago.</>,
        <>Cada órgano realiza un trabajo concreto que ninguna célula podría hacer sola.</>,
      ]}
      dataKey="organos_hecho"
      next={{ label: "Sistemas →", ruta: "/metodo/fisiologia/sistemas" }}
    />
  );
}
