import React from "react";
import ConstruirFisio from "../../components/metodo/ConstruirFisio";
import { fisiologiaTxt } from "../../GlobalVariables";

const PRE = "/recorrido/fisiologia/pre";

// Nivel 3 · El cuerpo — Organismo: todos los sistemas forman un ser humano. Tú.
export default function MetodoFisiologiaOrganismo() {
  return (
    <ConstruirFisio
      title="El cuerpo"
      pageLabel="11/"
      prev={{ label: "← Sistemas", ruta: "/metodo/fisiologia/sistemas" }}
      introTitulo="Construye un ser humano"
      instruccion="Reúne todos los sistemas para formar un organismo completo."
      zonaLabel="reúne los sistemas"
      forma="cluster"
      glow={fisiologiaTxt}
      emoji="🌟"
      piezas={[
        { tipo: "sistema", color: fisiologiaTxt, glyph: "S", label: "sistema", n: 5, img: `${PRE}/sistema.png` },
      ]}
      resultImg={`${PRE}/cuerpo.png`}
      resultTitulo="Has construido un ser humano."
      resultParrafos={[
        <>Todos los <b>sistemas</b> funcionando en armonía forman un <b>organismo</b> completo.</>,
        <>Has subido desde una sola partícula hasta aquí: átomos, moléculas, células, tejidos, órganos y sistemas.</>,
        <>Y ese organismo entero, vivo y en marcha en este mismo instante, <b>eres tú</b>.</>,
      ]}
      dataKey="organismo_hecho"
      next={{ label: "Volver a los niveles →", ruta: "/metodo/fisiologia/niveles" }}
    />
  );
}
