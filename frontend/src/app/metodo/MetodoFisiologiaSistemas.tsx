import React from "react";
import ConstruirFisio from "../../components/metodo/ConstruirFisio";

const PRE = "/recorrido/fisiologia/pre";

// Nivel 3 · El cuerpo — Sistemas: varios órganos que colaboran forman un sistema.
export default function MetodoFisiologiaSistemas() {
  return (
    <ConstruirFisio
      title="Sistemas"
      pageLabel="10/"
      prev={{ label: "← Órganos", ruta: "/metodo/fisiologia/organos" }}
      introTitulo="Forma un sistema"
      instruccion="Reúne varios órganos que colaboran para formar un sistema."
      zonaLabel="reúne los órganos"
      forma="cluster"
      glow="#e3a6a6"
      emoji="🩺"
      piezas={[
        { tipo: "organo", color: "#e3a6a6", glyph: "O", label: "órgano", n: 4, img: `${PRE}/organo.png` },
      ]}
      resultImg={`${PRE}/sistema.png`}
      resultTitulo="¡Has formado un sistema!"
      resultParrafos={[
        <>Varios <b>órganos que colaboran</b> forman un <b>sistema</b> (o aparato): el digestivo, el circulatorio, el respiratorio…</>,
        <>Juntos resuelven una gran tarea del cuerpo, como nutrirte, oxigenarte o moverte.</>,
      ]}
      dataKey="sistemas_hecho"
      next={{ label: "El cuerpo →", ruta: "/metodo/fisiologia/organismo" }}
    />
  );
}
