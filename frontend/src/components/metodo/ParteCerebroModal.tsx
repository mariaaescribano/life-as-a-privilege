import React from "react";
import { Text } from "@chakra-ui/react";
import { fisiologiaTxt } from "../../GlobalVariables";
import { FichaFisioModal } from "./celulasUi";
import type { ParteCerebro } from "../../hardCoded/espacio/CerebroFisiologia";

const TXT = fisiologiaTxt;

/**
 * Modal de una PARTE DEL CEREBRO. Usa la ficha común de Fisiología
 * (FichaFisioModal), igual que las células, los consejos y los sistemas: foto a
 * la izquierda + título, claves y explicación a la derecha, con flechas para
 * pasar de una parte a otra sin cerrar.
 *
 * Las flechas recorren TODAS las partes seguidas (de la corteza a la base), sin
 * parar en los saltos de zona: dentro del modal el recorrido es una sola línea.
 */
export function ParteCerebroModal({
  parte,
  partes,
  onSelect,
  onClose,
  leida = false,
}: {
  parte: ParteCerebro | null;
  /** Lista completa de partes para poder navegar con flechas. */
  partes?: ParteCerebro[];
  /** Cambia la parte mostrada (lo usan las flechas). */
  onSelect?: (p: ParteCerebro) => void;
  onClose: () => void;
  /** Ya se había leído antes de abrirla → aviso «✓ Leída» arriba. */
  leida?: boolean;
}) {
  const puedeNavegar = !!partes && partes.length > 1 && !!onSelect;
  const idx = parte && partes ? partes.findIndex((p) => p.key === parte.key) : -1;
  const salta = (d: number) => {
    if (!puedeNavegar || idx < 0 || !partes) return;
    onSelect!(partes[(idx + d + partes.length) % partes.length]);
  };

  if (!parte) return null;

  return (
    <FichaFisioModal
      foto={parte.foto}
      alt={parte.label}
      titulo={parte.label}
      claves={parte.claves}
      parrafos={[parte.descripcion]}
      onClose={onClose}
      onPrev={puedeNavegar ? () => salta(-1) : undefined}
      onNext={puedeNavegar ? () => salta(1) : undefined}
      contador={idx >= 0 && partes ? `${idx + 1} / ${partes.length}` : null}
      leida={leida}
      accent={parte.color}
      fotoFallback={
        <Text color={TXT} fontWeight="800" fontSize={{ base: "4xl", md: "5xl" }}
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
          {parte.label.charAt(0)}
        </Text>
      }
    />
  );
}
