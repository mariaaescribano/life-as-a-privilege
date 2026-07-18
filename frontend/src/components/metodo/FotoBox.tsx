import React, { useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";

// Glow suave y blanquito del header (nada de sombras oscuras). `c` es el acento
// de la disciplina (<disc>Txt). Reutilizado por todas las cajas del recorrido.
export const glowSuave = (c: string): string =>
  `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${c}1a, 0 0 48px ${c}10`;

// Variante más intensa para el hover.
export const glowSuaveHover = (c: string): string =>
  `0 0 22px rgba(255,255,255,0.3), 0 0 44px rgba(255,255,255,0.15), 0 0 66px rgba(180,255,245,0.13), 0 0 28px ${c}33, 0 0 60px ${c}1c`;

// Variante para «visto» (algo más de color, sigue siendo blanquito).
export const glowSuaveVisto = (c: string): string =>
  `0 0 16px rgba(255,255,255,0.18), 0 0 34px rgba(255,255,255,0.09), 0 0 60px rgba(180,255,245,0.10), 0 0 24px ${c}40, 0 0 52px ${c}20`;

// ─────────────────────────────────────────────────────────────────────────
// FotoBox — el box POR DEFECTO de las tarjetas con foto (Nutrición y Fisiología:
// grupos de nutrientes, alimentos, moléculas, células, órganos…). Diseño:
//
//   ┌────────────────────┐
//   │       Imagen       │   ← foto a sangre arriba (cover)
//   ├────────────────────┤   ← línea separadora a todo el ancho
//   │ Título             │   ← título abajo, alineado a la izquierda
//   └────────────────────┘
//
// Temático por disciplina: `nom` para el fondo, `tinta` (color del texto/borde)
// y `bg` (color base para el velo del pie). Admite tick de «visto», badge de
// número (secuencias), emoji de reserva y un color de fondo propio de la imagen.
// ─────────────────────────────────────────────────────────────────────────

export function FotoBox({
  titulo,
  foto,
  nom,
  tinta,
  bg,
  onClick,
  visto = false,
  numero,
  emoji,
  colorTint,
  aspect = 1,
}: {
  titulo: React.ReactNode;
  foto?: string;
  /** Disciplina para el fondo temático del pie (DisciplinaBgLayer). */
  nom: string;
  /** Color del texto y del borde (el <disc>Txt). */
  tinta: string;
  /** Color base de la disciplina (el <disc>Bg), para el velo del pie. */
  bg: string;
  onClick?: () => void;
  /** Marca de «ya visto/descubierto»: tick arriba a la derecha. */
  visto?: boolean;
  /** Número de orden (secuencias, p.ej. la ruta del etanol): badge arriba-izq. */
  numero?: number;
  /** Emoji de reserva si no hay foto (o falla). Si tampoco hay, sale un icono. */
  emoji?: string;
  /** Color de fondo del área de la imagen (p.ej. el color propio del grupo). */
  colorTint?: string;
  /** Relación de aspecto de la imagen (por defecto cuadrada). */
  aspect?: number;
}) {
  const [imgErr, setImgErr] = useState(false);
  const hayFoto = !!foto && !imgErr;

  return (
    <Box
      as="button"
      onClick={onClick}
      textAlign="left"
      position="relative"
      overflow="hidden"
      display="flex"
      flexDirection="column"
      w="100%"
      h="100%"
      borderRadius="2xl"
      cursor="pointer"
      fontFamily="'EB Garamond', serif"
      border={visto ? `1px solid ${tinta}aa` : `1px solid ${tinta}33`}
      boxShadow={visto ? glowSuaveVisto(tinta) : glowSuave(tinta)}
      transition="all 0.22s ease"
      _hover={{ transform: "translateY(-4px)", borderColor: `${tinta}88`,
                boxShadow: glowSuaveHover(tinta) }}
      _active={{ transform: "translateY(-1px)" }}
    >
      {/* Fondo temático de la disciplina (se ve en el pie, bajo el título). */}
      <DisciplinaBgLayer nom={nom} borderRadius="2xl" overlay={`${bg}55`} />

      {/* Tick de «visto» (arriba a la derecha). */}
      {visto && (
        <Flex position="absolute" top="9px" right="9px" zIndex={2} align="center" justify="center"
              w="24px" h="24px" borderRadius="full" bg={tinta}
              boxShadow={`0 0 10px ${tinta}, 0 1px 4px rgba(0,0,0,0.5)`}>
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="14px" h="14px" fill={bg}>
            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
          </Box>
        </Flex>
      )}

      {/* Badge de número de orden (arriba a la izquierda). */}
      {numero != null && (
        <Flex position="absolute" top="9px" left="9px" zIndex={2} align="center" justify="center"
              w={{ base: "26px", md: "30px" }} h={{ base: "26px", md: "30px" }} borderRadius="full"
              bg={tinta} color={bg} fontWeight="800" fontSize={{ base: "sm", md: "md" }} lineHeight="1"
              boxShadow={`0 0 10px ${tinta}, 0 1px 4px rgba(0,0,0,0.5)`}>
          {numero}
        </Flex>
      )}

      {/* Imagen a sangre en la parte superior. */}
      <Box position="relative" zIndex={1} w="100%" aspectRatio={aspect} overflow="hidden"
           flexShrink={0} bg={colorTint ?? `${tinta}12`}
           display="flex" alignItems="center" justifyContent="center">
        {hayFoto ? (
          <Image src={encodeURI(foto!)} alt={typeof titulo === "string" ? titulo : ""} w="100%" h="100%"
                 objectFit="cover" onError={() => setImgErr(true)} />
        ) : emoji ? (
          <Box as="span" fontSize={{ base: "44px", md: "60px" }} lineHeight="1">{emoji}</Box>
        ) : (
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
               w={{ base: "36px", md: "44px" }} h={{ base: "36px", md: "44px" }} fill={`${tinta}55`}>
            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
          </Box>
        )}
      </Box>

      {/* Línea separadora a todo el ancho. */}
      <Box position="relative" zIndex={1} h="1px" bg={`${tinta}33`} flexShrink={0} />

      {/* Pie: título alineado a la izquierda. */}
      <Flex position="relative" zIndex={1} flex="1" align="center"
            px={{ base: 3.5, md: 4 }} py={{ base: 3, md: 3.5 }}>
        <Text color={tinta} fontWeight="700" fontSize={{ base: "sm", md: "md" }} lineHeight="1.25"
              letterSpacing="0.02em" style={{ textShadow: `0 1px 4px ${bg}` }}>
          {titulo}
        </Text>
      </Flex>
    </Box>
  );
}
