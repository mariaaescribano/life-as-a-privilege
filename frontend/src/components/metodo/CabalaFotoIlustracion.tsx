import React, { useState } from "react";
import { Box, Flex, Image } from "@chakra-ui/react";
import { cabalaTxt } from "../../GlobalVariables";

// ─────────────────────────────────────────────────────────────────────────
// La foto que representa a una sefirá o a un sendero, DENTRO de su página.
//
// Hasta ahora estas ilustraciones solo se veían en el visor a pantalla completa
// (el botón «Ilustraciones» del header). Aquí se pintan en la propia página:
//  · en la sefirá, a la izquierda del carrusel de intro;
//  · en el sendero, en su cabecera, junto a la letra hebrea.
//
// Es pinchable: abre la ilustración a pantalla completa por esa misma pieza.
// Un componente común para las dos páginas, para que no se separen nunca.
// ─────────────────────────────────────────────────────────────────────────

export function CabalaFotoIlustracion({
  src,
  alt,
  onClick,
  size = { base: "100%", md: "240px" },
  maxW = { base: "300px", md: "240px" },
}: {
  src: string;
  alt: string;
  /** Abre la ilustración a pantalla completa. Si no se pasa, la foto no es pinchable. */
  onClick?: () => void;
  size?: any;
  maxW?: any;
}) {
  const [cargada, setCargada] = useState(false);
  const [fallo, setFallo] = useState(false);
  if (fallo) return null; // sin foto, la página se queda como estaba (solo texto)

  return (
    <Box
      as={onClick ? "button" : "div"}
      onClick={onClick}
      aria-label={onClick ? `Ver la ilustración de ${alt}` : undefined}
      title={onClick ? "Ver la ilustración" : undefined}
      position="relative"
      flexShrink={0}
      w={size}
      maxW={maxW}
      aspectRatio={1}
      borderRadius="lg"
      overflow="hidden"
      cursor={onClick ? "pointer" : "default"}
      // Halo del material de Cábala alrededor de la ilustración (nada de sombra
      // oscura): la despega del fondo de la caja sin ensuciarla.
      filter={`drop-shadow(0 0 10px rgba(255,255,255,0.22)) drop-shadow(0 0 26px ${cabalaTxt}4c) drop-shadow(0 0 54px ${cabalaTxt}26)`}
      transition="transform 0.22s, filter 0.22s"
      _hover={onClick
        ? {
            transform: "translateY(-2px) scale(1.02)",
            filter: `drop-shadow(0 0 14px rgba(255,255,255,0.3)) drop-shadow(0 0 34px ${cabalaTxt}77) drop-shadow(0 0 66px ${cabalaTxt}3a)`,
          }
        : undefined}
      _active={onClick ? { transform: "scale(0.98)" } : undefined}
      sx={{ WebkitTapHighlightColor: "transparent" }}
    >
      <Image
        src={encodeURI(src)}
        alt={alt}
        w="100%"
        h="100%"
        objectFit="cover"
        borderRadius="lg"
        opacity={cargada ? 1 : 0}
        transition="opacity 0.45s ease"
        onLoad={() => setCargada(true)}
        onError={() => setFallo(true)}
      />

      {/* Ojo discreto en la esquina: dice que la foto se puede abrir. */}
      {onClick && cargada && (
        <Flex
          position="absolute"
          bottom="8px"
          right="8px"
          align="center"
          justify="center"
          w="30px"
          h="30px"
          borderRadius="full"
          bg="rgba(0,0,0,0.45)"
          border={`1px solid ${cabalaTxt}88`}
          color={cabalaTxt}
          pointerEvents="none"
          sx={{ backdropFilter: "blur(3px)" }}
        >
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="16px" h="16px" fill="currentColor">
            <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
          </Box>
        </Flex>
      )}
    </Box>
  );
}

export default CabalaFotoIlustracion;
