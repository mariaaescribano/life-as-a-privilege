import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConstruirFisio from "../../components/metodo/ConstruirFisio";
import { ComicPasoModal } from "../../components/metodo/ComicPasoModal";
import { CELULAS_ORGANOS } from "../../components/metodo/comicCelulasOrganos";
import { useComic } from "../../i18n/comics";
import { useT } from "../../i18n";
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
        title="Célula"
        pageLabel="1/4"
        prev={{ label: "← Estructuras", ruta: "/metodo/fisiologia/estructuras" }}
        introTitulo=""
        instruccion="Construye una célula."
        zonaLabel="el citoplasma"
        forma="cluster"
        glow="#8fd6a8"
        piezas={[
          { tipo: "nucleo", color: "#b79af0", glyph: "Nu", label: "núcleo", n: 1, img: `${PRE}/nucleo.webp` },
          { tipo: "adn", color: "#9ab6f0", glyph: "N", label: "ADN", n: 1, img: `${PRE}/adn.webp` },
          { tipo: "membrana", color: "#f2c86b", glyph: "L", label: "membrana", n: 1, img: `${PRE}/membrana.webp` },
          { tipo: "mitocondria", color: "#e08a8a", glyph: "M", label: "mitocondria", n: 2, img: `${PRE}/mitocondria.webp` },
          { tipo: "ribosoma", color: "#7fd6c2", glyph: "R", label: "ribosoma", n: 3, img: `${PRE}/ribosoma.webp` },
        ]}
        resultImg={`${PRE}/celulaentera.webp`}
        resultTitulo="¡Has construido una célula!"
        resultParrafos={[
          <>Una <b>célula</b> es la unidad más pequeña con Vida propia: dentro de su membrana, el núcleo guarda el ADN con las instrucciones, los ribosomas fabrican proteínas y las mitocondrias generan energía.</>,
          <>Todo funciona a la vez, como una ciudad diminuta. Tu cuerpo tiene alrededor de <b>37 billones</b> de ellas.</>,
        ]}
        dataKey="celula_hecho"
        headerNext={{ label: "Órganos →", onClick: () => setComicOpen(true) }}
        lockNextUntilComplete
        lockNextTooltip="Primero crea la célula"
        notaPie="Una célula real tiene muchos más orgánulos; aquí la hemos simplificado con fines de estudio."
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
