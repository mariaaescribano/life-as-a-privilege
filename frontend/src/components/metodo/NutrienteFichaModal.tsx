import React from "react";
import { Text } from "@chakra-ui/react";
import { FichaFisioModal } from "./celulasUi";
import { disciplinaBgImg } from "../global/DisciplinaBgLayer";
import { nutricionBg, nutricionNom, nutricionTxt } from "../../GlobalVariables";
import type { NutrienteTarjeta } from "../../hardCoded/espacio/NutrientesNutricion";

// ─────────────────────────────────────────────────────────────────────────
// Ficha tipo cómic de una tarjeta de nutriente (Glucosa, Fructosa…). Reutiliza
// EXACTAMENTE la misma caja que las fichas de Fisiología y el visor de
// «Ilustraciones» (FichaFisioModal): foto a la izquierda, título + texto a la
// derecha, flechas/teclado y contador. Solo cambia el tema: fondo con la foto
// de Nutrición (nutri.png) y colores de la disciplina.
// ─────────────────────────────────────────────────────────────────────────

const NUTRI_IMG = disciplinaBgImg(nutricionNom) ?? "/img/fondos/nutri.png";

export function NutrienteFichaModal({
  tarjetas,
  index,
  onClose,
  onSelect,
}: {
  tarjetas: NutrienteTarjeta[];
  index: number;
  onClose: () => void;
  onSelect: (i: number) => void;
}) {
  const total = tarjetas.length;
  const t = tarjetas[index];
  const puedeNavegar = total > 1;
  const salta = (d: number) => onSelect((index + d + total) % total);
  const accent = t.color || nutricionTxt;

  return (
    <FichaFisioModal
      foto={t.foto || ""}
      alt={t.titulo}
      titulo={t.titulo}
      parrafos={t.parrafos}
      accent={accent}
      bgImage={NUTRI_IMG}
      bgColor={nutricionBg}
      txtColor={nutricionTxt}
      onClose={onClose}
      onPrev={puedeNavegar ? () => salta(-1) : undefined}
      onNext={puedeNavegar ? () => salta(1) : undefined}
      contador={puedeNavegar ? `${index + 1} / ${total}` : null}
      fotoFallback={
        <Text color={accent} fontWeight="800" fontSize={{ base: "4xl", md: "5xl" }}
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
          {t.titulo.charAt(0)}
        </Text>
      }
    />
  );
}
