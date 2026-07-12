import React from "react";
import ConstruirFisio from "../../components/metodo/ConstruirFisio";

const PRE = "/recorrido/fisiologia/pre";

// Nivel 2 · La vida — Célula: reúne las estructuras en una célula viva.
export default function MetodoFisiologiaCelula() {
  return (
    <ConstruirFisio
      title="Célula"
      pageLabel="1/2"
      prev={{ label: "← Estructuras", ruta: "/metodo/fisiologia/estructuras" }}
      introTitulo="Construye una célula"
      instruccion="Reúne las estructuras dentro del citoplasma para formar una célula viva."
      zonaLabel="el citoplasma"
      forma="cluster"
      glow="#8fd6a8"
      piezas={[
        { tipo: "adn", color: "#9ab6f0", glyph: "N", label: "ADN", n: 1, img: `${PRE}/adn.png` },
        { tipo: "membrana", color: "#f2c86b", glyph: "L", label: "membrana", n: 1, img: `${PRE}/membrana.png` },
        { tipo: "mitocondria", color: "#e08a8a", glyph: "M", label: "mitocondria", n: 2, img: `${PRE}/mitocondria.png` },
        { tipo: "ribosoma", color: "#7fd6c2", glyph: "R", label: "ribosoma", n: 3, img: `${PRE}/ribosoma.png` },
      ]}
      resultImg={`${PRE}/celula.png`}
      resultTitulo="¡Has construido una célula!"
      resultParrafos={[
        <>Una <b>célula</b> es la unidad más pequeña con vida propia: dentro de su membrana, el ADN guarda las instrucciones, los ribosomas fabrican proteínas y las mitocondrias generan energía.</>,
        <>Todo funciona a la vez, como una ciudad diminuta. Tu cuerpo tiene alrededor de <b>37 billones</b> de ellas.</>,
      ]}
      dataKey="celula_hecho"
      next={{ label: "Todas tus células →", ruta: "/metodo/fisiologia/todas-tus-celulas" }}
      headerNext={{ label: "Todas tus células →", ruta: "/metodo/fisiologia/todas-tus-celulas" }}
    />
  );
}
