import React from "react";
import { Box } from "@chakra-ui/react";
import { SpaceBg } from "../metodo/SpaceBg";
void React;

interface Props {
  onClose: () => void;
  /** Color del planeta (o el de astrología). Tiñe el borde, el glow y la X. */
  color: string;
  /** Velo sobre el cielo del fondo. */
  overlay?: string;
  children: React.ReactNode;
}

/** Lado máximo del popup. Es el MISMO a lo ancho y a lo alto: cuando el
 *  contenido llena la caja, el popup sale cuadrado en cualquier pantalla. */
const LADO = "560px";

/**
 * Caja común de TODOS los popups de /estudio (arquetipo, preguntas, lectura):
 * cielo de fondo, borde y glow del color del planeta, y la X arriba a la derecha.
 *
 * La forma es lo importante: la altura la manda el CONTENIDO (no hay `h` fija).
 * Si el texto es corto, la caja se encoge y queda un popup pequeño y centrado;
 * si es largo, crece hasta el lado máximo (cuadrado) y a partir de ahí el
 * contenido hace scroll vertical dentro. Antes se estiraba a toda la altura de
 * la pantalla (móvil) o a 560px fijos (escritorio) y el texto se quedaba flotando
 * en el centro con medio popup vacío.
 *
 * Los hijos maquetan así: cabecera y pie con `flexShrink={0}`, y el cuerpo con
 * `flex="1"`, `minH={0}` y `overflowY="auto"` (el que hace el scroll).
 */
export function EstudioPopup({ onClose, color, overlay = "rgba(8,13,30,0.75)", children }: Props) {
  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={500}
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ base: 4, md: 10 }}
      py={{ base: 6, md: 10 }}
      bg="rgba(0,0,0,0.82)"
      sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
      onClick={onClose}
    >
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        position="relative"
        w="100%"
        maxW={LADO}
        // El tope de alto es el lado del cuadrado y, en pantallas pequeñas, lo
        // que quepa (ancho o alto disponible): nunca una sábana de punta a punta.
        maxH={{
          base: `min(calc(100dvh - 48px), calc(100vw - 32px), ${LADO})`,
          md: `min(calc(100vh - 80px), ${LADO})`,
        }}
        borderRadius="2xl"
        overflow="hidden"
        border={`1px solid ${color}66`}
        boxShadow={`0 0 32px ${color}55, 0 0 80px ${color}28, 0 12px 60px rgba(0,0,0,0.6)`}
        fontFamily="'EB Garamond', serif"
        display="flex"
        flexDirection="column"
      >
        <SpaceBg overlay={overlay} />

        {/* X cerrar */}
        <Box
          position="absolute" top={3} right={3} zIndex={3}
          as="button" onClick={onClose}
          w="36px" h="36px" borderRadius="full"
          display="flex" alignItems="center" justifyContent="center"
          bg="rgba(0,0,0,0.6)" border={`1px solid ${color}66`} color={color}
          cursor="pointer" transition="all 0.15s" boxShadow={`0 0 14px ${color}44`}
          _hover={{ bg: "rgba(0,0,0,0.85)", borderColor: color, boxShadow: `0 0 22px ${color}88` }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14" fill="currentColor">
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        </Box>

        {children}
      </Box>
    </Box>
  );
}
