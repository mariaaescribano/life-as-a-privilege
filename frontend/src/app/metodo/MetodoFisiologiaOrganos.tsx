import React from "react";
import ConstruirFisio from "../../components/metodo/ConstruirFisio";
import { useT, TextoRico } from "../../i18n";

const PRE = "/recorrido/fisiologia/pre";

// Nivel 2 · La Vida — Órganos: varios tejidos distintos forman un órgano.
export default function MetodoFisiologiaOrganos() {
  const t = useT();
  return (
    <ConstruirFisio
      title={t("fisiologia.organos.titulo")}
      pageLabel="4/4"
      prev={{ label: `← ${t("fisiologia.tejidos.titulo")}`, ruta: "/metodo/fisiologia/tejidos" }}
      introTitulo={t("fisiologia.organos.introTitulo")}
      instruccion={t("fisiologia.organos.instruccion")}
      zonaLabel={t("fisiologia.organos.zona")}
      forma="cluster"
      glow="#cfa6e0"
      piezas={[
        { tipo: "tejido", color: "#cfa6e0", glyph: "T", label: t("fisiologia.pieza.tejido"), n: 4, img: `${PRE}/tejido.png` },
      ]}
      resultImg={`${PRE}/organo.png`}
      resultTitulo={t("fisiologia.organos.hecho")}
      resultParrafos={[
        <TextoRico>{t("fisiologia.organos.p1")}</TextoRico>,
        <TextoRico>{t("fisiologia.organos.p2")}</TextoRico>,
      ]}
      dataKey="organos_hecho"
      next={{ label: `${t("fisiologia.sistemas.titulo")} →`, ruta: "/metodo/fisiologia/sistemas" }}
    />
  );
}
