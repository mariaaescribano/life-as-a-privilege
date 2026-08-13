import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConstruirFisio from "../../components/metodo/ConstruirFisio";
import { ComicPasoModal } from "../../components/metodo/ComicPasoModal";
import { CELULAS_ORGANOS } from "../../components/metodo/comicCelulasOrganos";
import { useComic } from "../../i18n/comics";
import { useT, TextoRico } from "../../i18n";
import { fisiologiaBg, fisiologiaTxt } from "../../GlobalVariables";

const PRE = "/recorrido/fisiologia/pre";

// Nivel 2 · La Vida — Célula: reúne las estructuras en una célula viva.
export default function MetodoFisiologiaCelula() {
  const t = useT();
  const navigate = useNavigate();
  // Cómic «De una célula a un órgano»: se intercala al pulsar «Órganos →», antes
  // de entrar a «Todas tus células».
  const [comicOpen, setComicOpen] = useState(false);
  // Sus viñetas en el idioma activo.
  const comicVinetas = useComic("fisiologia-celulas-organos", CELULAS_ORGANOS);

  return (
    <>
      <ConstruirFisio
        title={t("fisiologia.celula.titulo")}
        pageLabel="1/4"
        prev={{ label: `← ${t("fisiologia.estructuras.corto")}`, ruta: "/metodo/fisiologia/estructuras" }}
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
          { tipo: "ribosoma", color: "#7fd6c2", glyph: "R", label: t("fisiologia.pieza.ribosoma"), n: 3, img: `${PRE}/ribosoma.webp` },
        ]}
        resultImg={`${PRE}/celulaentera.webp`}
        resultTitulo={t("fisiologia.celula.hecho")}
        resultParrafos={[
          <TextoRico>{t("fisiologia.celula.p1")}</TextoRico>,
          <TextoRico>{t("fisiologia.celula.p2")}</TextoRico>,
        ]}
        dataKey="celula_hecho"
        headerNext={{ label: `${t("fisiologia.organos.titulo")} →`, onClick: () => setComicOpen(true) }}
        lockNextUntilComplete
        lockNextTooltip={t("fisiologia.celula.bloqueo")}
        notaPie={t("fisiologia.celula.nota")}
      />

      {/* Cómic de paso: de una sola célula (cigoto) a un órgano completo. Al
          terminarlo (o pulsar «Continuar»), avanza a «Todas tus células». */}
      <ComicPasoModal
        isOpen={comicOpen}
        onClose={() => setComicOpen(false)}
        onContinue={() => navigate("/metodo/fisiologia/todas-tus-celulas")}
        vinetas={comicVinetas}
        continueLabel={t("fisiologia.organos.titulo")}
        themeColor={fisiologiaTxt}
        disciplinaBgImage="/img/fondos/fisio.webp"
        disciplinaBgColor={fisiologiaBg}
      />
    </>
  );
}
