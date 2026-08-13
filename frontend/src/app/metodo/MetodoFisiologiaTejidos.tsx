import React from "react";
import ConstruirFisio from "../../components/metodo/ConstruirFisio";
import { useT, TextoRico } from "../../i18n";

const PRE = "/recorrido/fisiologia/pre";

// Nivel 2 · La Vida — Tejidos: muchas células iguales forman un tejido.
export default function MetodoFisiologiaTejidos() {
  const t = useT();
  return (
    <ConstruirFisio
      title={t("fisiologia.tejidos.titulo")}
      pageLabel="3/4"
      prev={{ label: `← ${t("fisiologia.lasCelulas.corto")}`, ruta: "/metodo/fisiologia/todas-tus-celulas" }}
      introTitulo={t("fisiologia.tejidos.introTitulo")}
      instruccion={t("fisiologia.tejidos.instruccion")}
      zonaLabel={t("fisiologia.tejidos.zona")}
      forma="cluster"
      glow="#8fd6a8"
      piezas={[
        { tipo: "celula", color: "#8fd6a8", glyph: "C", label: t("fisiologia.pieza.celula"), n: 6, img: `${PRE}/celula.png` },
      ]}
      resultImg={`${PRE}/tejido.png`}
      resultTitulo={t("fisiologia.tejidos.hecho")}
      resultParrafos={[
        <TextoRico>{t("fisiologia.tejidos.p1")}</TextoRico>,
        <TextoRico>{t("fisiologia.tejidos.p2")}</TextoRico>,
      ]}
      dataKey="tejidos_hecho"
      next={{ label: `${t("fisiologia.organos.titulo")} →`, ruta: "/metodo/fisiologia/organos" }}
    />
  );
}
