import React from "react";
import { IconButton, Box } from "@chakra-ui/react";
import { useT } from "../../i18n";
import { fondoDeDisciplina } from "../../utils/fondoDisciplina";

const X = "m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z";

// ─────────────────────────────────────────────────────────────────────────
// BotonCerrarDisciplina — LA X redonda de los popups de Fisiología y Nutrición.
//
//   · fondo  →  la acuarela de la disciplina (`bg` = su <disc>Bg)
//   · borde y X  →  `txt` (su <disc>Txt)
//
// Va fija arriba a la derecha; con `flotante={false}` se pinta en el flujo.
// ─────────────────────────────────────────────────────────────────────────
export function BotonCerrarDisciplina({
  onClose,
  bg,
  txt,
  zIndex = 12,
  flotante = true,
  absoluta = false,
}: {
  onClose: (e: React.MouseEvent) => void;
  bg: string;
  txt: string;
  zIndex?: number;
  flotante?: boolean;
  /** Dentro de un contenedor `relative` (esquina superior derecha de una caja). */
  absoluta?: boolean;
}) {
  const t = useT();
  const img = fondoDeDisciplina(bg);
  return (
    <IconButton
      aria-label={t("comun.cerrar")}
      onClick={onClose}
      position={absoluta ? "absolute" : flotante ? "fixed" : "relative"}
      top={flotante || absoluta ? { base: 3, md: 5 } : undefined}
      right={flotante || absoluta ? { base: 3, md: 5 } : undefined}
      zIndex={zIndex}
      variant="ghost"
      borderRadius="full"
      w={{ base: "42px", md: "48px" }}
      h={{ base: "42px", md: "48px" }}
      minW={{ base: "42px", md: "48px" }}
      bg={bg}
      backgroundImage={img ? `url('${img}')` : undefined}
      backgroundSize="cover"
      backgroundPosition="center"
      border={`2px solid ${txt}`}
      boxShadow={`0 0 12px ${txt}55, 0 2px 10px rgba(0,0,0,0.4)`}
      transition="transform 0.18s ease, box-shadow 0.18s ease"
      _hover={{ bg, transform: "scale(1.08)", boxShadow: `0 0 16px ${txt}88, 0 2px 10px rgba(0,0,0,0.4)` }}
      _active={{ bg }}
      _focus={{ boxShadow: `0 0 12px ${txt}55, 0 2px 10px rgba(0,0,0,0.4)` }}
      _focusVisible={{ boxShadow: `0 0 0 2px ${txt}` }}
      icon={
        <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="24px" h="24px" fill={txt}>
          <path d={X} />
        </Box>
      }
    />
  );
}
