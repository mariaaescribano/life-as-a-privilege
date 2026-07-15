import React from "react";
import { Text } from "@chakra-ui/react";
import { FichaFisioModal } from "./celulasUi";
import type { Ficha } from "../../hardCoded/espacio/ProfundizaFisiologia";

/**
 * Modal de una FICHA de PROFUNDIZA (neurotransmisor, hormona…). Reutiliza el
 * box ÚNICO de Fisiología (FichaFisioModal), que es la misma caja que el visor
 * de «Ilustraciones». Solo aporta el color de acento propio de cada ficha y la
 * navegación cíclica entre las fichas del tema.
 */
export function FichaExploraModal({
  ficha,
  fichas,
  temaColor,
  onSelect,
  onClose,
}: {
  ficha: Ficha | null;
  /** Lista completa para navegar con flechas. */
  fichas?: Ficha[];
  /** Color del tema (por si la ficha no trae color propio). */
  temaColor: string;
  onSelect?: (f: Ficha) => void;
  onClose: () => void;
}) {
  const puedeNavegar = !!fichas && fichas.length > 1 && !!onSelect;
  const idx = ficha && fichas ? fichas.findIndex((f) => f.key === ficha.key) : -1;
  const salta = (d: number) => {
    if (!puedeNavegar || idx < 0 || !fichas) return;
    onSelect!(fichas[(idx + d + fichas.length) % fichas.length]);
  };

  if (!ficha) return null;
  const accent = ficha.color || temaColor;

  return (
    <FichaFisioModal
      foto={ficha.foto || ""}
      alt={ficha.nombre}
      titulo={ficha.nombre}
      claves={ficha.claves}
      parrafos={ficha.explicacion}
      accent={accent}
      onClose={onClose}
      onPrev={puedeNavegar ? () => salta(-1) : undefined}
      onNext={puedeNavegar ? () => salta(1) : undefined}
      contador={puedeNavegar && fichas ? `${idx + 1} / ${fichas.length}` : null}
      fotoFallback={
        <Text color={accent} fontWeight="800" fontSize={{ base: "4xl", md: "5xl" }}
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
          {ficha.nombre.charAt(0)}
        </Text>
      }
    />
  );
}
