import React from "react";
import { useNavigate } from "react-router-dom";
import ConstruirFisio from "../../components/metodo/ConstruirFisio";
import { useT, TextoRico } from "../../i18n";

const PRE = "/recorrido/fisiologia/pre";

// Nivel 2 · Desarrollo — Célula (paso 2/3, «el juego de las células»): reúne las
// estructuras en una célula viva. Su cómic de salida («De una célula a un órgano»)
// se partió: la primera parte abre el nivel (MetodoFisiologiaDesarrollo) y el final
// es la página de los órganos (MetodoFisiologiaOrganos), a la que lleva el header.
export default function MetodoFisiologiaCelula() {
  const t = useT();
  const navigate = useNavigate();

  return (
    <ConstruirFisio
      title={t("fisiologia.celula.titulo")}
      pageLabel="2/3"
      prev={{ label: `← ${t("fisiologia.desarrollo.titulo")}`, ruta: "/metodo/fisiologia/desarrollo" }}
      introTitulo=""
      instruccion={t("fisiologia.celula.instruccion")}
      zonaLabel={t("fisiologia.celula.zona")}
      forma="cluster"
      glow="#8fd6a8"
      piezas={[
        { tipo: "nucleo", color: "#b79af0", glyph: "Nu", label: t("fisiologia.pieza.nucleo"), n: 1, img: `${PRE}/nucleo.webp` },
        { tipo: "adn", color: "#9ab6f0", glyph: "N", label: t("fisiologia.pieza.adn"), n: 1, img: `${PRE}/adn.webp` },
        { tipo: "membrana", color: "#f2c86b", glyph: "L", label: t("fisiologia.pieza.membrana"), n: 1, img: `${PRE}/membrana.webp` },
        { tipo: "mitocondria", color: "#e08a8a", glyph: "M", label: t("fisiologia.pieza.mitocondria"), n: 2, img: `${PRE}/mitocondria.webp` },
        { tipo: "ribosoma", color: "#a884e8", glyph: "R", label: t("fisiologia.pieza.ribosoma"), n: 3, img: `${PRE}/ribosoma.webp` },
      ]}
      resultImg={`${PRE}/celulaentera.webp`}
      resultTitulo={t("fisiologia.celula.hecho")}
      resultParrafos={[
        <TextoRico>{t("fisiologia.celula.p1")}</TextoRico>,
        <TextoRico>{t("fisiologia.celula.p2")}</TextoRico>,
      ]}
      dataKey="celula_hecho"
      headerNext={{ label: `${t("fisiologia.organos.titulo")} →`, onClick: () => navigate("/metodo/fisiologia/organos") }}
      lockNextUntilComplete
      lockNextTooltip={t("fisiologia.celula.bloqueo")}
      notaPie={t("fisiologia.celula.nota")}
    />
  );
}
