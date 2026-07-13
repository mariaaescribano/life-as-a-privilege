import React from "react";
import { Text } from "@chakra-ui/react";
import { fisiologiaTxt } from "../../GlobalVariables";
import { FichaFisioModal } from "./celulasUi";
import type { Sistema } from "../../hardCoded/espacio/SistemasFisiologia";

const TXT = fisiologiaTxt;

/**
 * Modal de un SISTEMA del cuerpo. Usa la ficha común de Fisiología
 * (FichaFisioModal) para tener exactamente el mismo estilo que las células
 * y los consejos: foto a la izquierda + título y descripción a la derecha,
 * con flechas para pasar de un sistema a otro sin cerrar el modal.
 */
export function SistemaModal({
  sistema,
  sistemas,
  onSelect,
  onClose,
}: {
  sistema: Sistema | null;
  /** Lista completa de sistemas para poder navegar con flechas. */
  sistemas?: Sistema[];
  /** Cambia el sistema mostrado (lo usan las flechas). */
  onSelect?: (s: Sistema) => void;
  onClose: () => void;
}) {
  const puedeNavegar = !!sistemas && sistemas.length > 1 && !!onSelect;
  const idx = sistema && sistemas ? sistemas.findIndex((s) => s.key === sistema.key) : -1;
  const salta = (d: number) => {
    if (!puedeNavegar || idx < 0 || !sistemas) return;
    onSelect!(sistemas[(idx + d + sistemas.length) % sistemas.length]);
  };

  if (!sistema) return null;

  return (
    <FichaFisioModal
      foto={sistema.foto}
      alt={sistema.label}
      titulo={`Sistema ${sistema.label.toLowerCase()}`}
      parrafos={[sistema.descripcion]}
      onClose={onClose}
      onPrev={puedeNavegar ? () => salta(-1) : undefined}
      onNext={puedeNavegar ? () => salta(1) : undefined}
      fotoFallback={
        <Text color={TXT} fontWeight="800" fontSize={{ base: "4xl", md: "5xl" }}
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
          {sistema.label.charAt(0)}
        </Text>
      }
    />
  );
}
