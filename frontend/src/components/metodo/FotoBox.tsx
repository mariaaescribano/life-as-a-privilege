import React, { useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { culturaNom, fisiologiaNom, nutricionNom } from "../../GlobalVariables";

// Glow suave de la tarjeta, SOLO con el color de la disciplina (`c` = <disc>Txt).
// Antes llevaba capas blancas + menta claro, pero sobre el turquesa del recorrido
// esos halos claros se fundían entre tarjetas y pintaban un "box clarito"; sobre
// los fondos claros (Nutrición) eran invisibles de todos modos. Así que se
// quitan: queda un glow tintado del acento y el turquesa se mantiene limpio.
export const glowSuave = (c: string): string =>
  `0 0 14px ${c}26, 0 0 32px ${c}14`;

// Glow de la CABECERA (halo blanco + menta suave con el tinte de la disciplina).
// Es el mismo que usa MetodoStepHeader; se centraliza aquí para que TODAS las
// cajas puedan llevar glow (nunca sombra plana) y queden a juego con el header.
export const glowHeader = (c: string): string =>
  `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${c}1a, 0 0 48px ${c}10`;

// Variante más intensa para el hover.
export const glowSuaveHover = (c: string): string =>
  `0 0 20px ${c}3a, 0 0 42px ${c}1e`;

// Variante para «visto» (algo más de color).
export const glowSuaveVisto = (c: string): string =>
  `0 0 16px ${c}40, 0 0 36px ${c}20`;

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
  glow,
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
  /** Glow a medida (sustituye al glowSuave por defecto). P.ej. el glow de la
   *  cabecera. Se usa también en hover para que no cambie a otro tono. */
  glow?: string;
}) {
  const [imgErr, setImgErr] = useState(false);
  const hayFoto = !!foto && !imgErr;
  // Sin líneas (ni borde exterior ni raya separadora): solo el glow define la
  // tarjeta. En Nutrición porque el fondo claro hace cantar cualquier línea; en
  // Cultura y Fisiología porque así se pidió (mantener el glow, quitar los
  // border line).
  const sinLineas = nom === nutricionNom || nom === culturaNom || nom === fisiologiaNom;

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
      border={sinLineas ? "none" : (visto ? `1px solid ${tinta}aa` : `1px solid ${tinta}33`)}
      boxShadow={glow ?? (visto ? glowSuaveVisto(tinta) : glowSuave(tinta))}
      transition="all 0.22s ease"
      _hover={{ transform: "translateY(-4px)", ...(sinLineas ? {} : { borderColor: `${tinta}88` }),
                boxShadow: glow ?? glowSuaveHover(tinta) }}
      _active={{ transform: "translateY(-1px)" }}
    >
      {/* Fondo temático de la disciplina (se ve en el pie, bajo el título). */}
      <DisciplinaBgLayer nom={nom} borderRadius="2xl" overlay={`${bg}55`} />

      {/* Tick de «visto» (arriba a la derecha). */}
      {visto && (
        <Flex position="absolute" top="9px" right="9px" zIndex={2} align="center" justify="center"
              w="24px" h="24px" borderRadius="full" bg={bg} border={`1px solid ${tinta}`}
              boxShadow={`0 0 10px ${tinta}66, 0 1px 4px rgba(0,0,0,0.5)`}>
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="14px" h="14px" fill={tinta}>
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
        ) : null}
      </Box>

      {/* Línea separadora a todo el ancho (en Nutrición se omite). */}
      {!sinLineas && (
        <Box position="relative" zIndex={1} h="1px" bg={`${tinta}33`} flexShrink={0} />
      )}

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
