import React from "react";
import { Box, Flex, Text, type FlexProps } from "@chakra-ui/react";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../global/DisciplinaBgLayer";
import { nombreEnMapa, type VideoIntro } from "../../data/recorridoContenido";
import { PrecioConAntes } from "./PrecioConAntes";

// ─────────────────────────────────────────────────────────────────────────────
// BOX DE LA DISCIPLINA con su precio — el que va al lado del mandala en
// /elMetodo y, ahora también, arriba en la presentación de la disciplina
// (/d/:disciplina) junto al vídeo.
//
// Fondo = imagen propia de la disciplina. Cabecera «nº. Nombre» + separador y,
// debajo, el texto introductorio (título + puntos con ✓), el botón de muestra y
// el precio abajo a la derecha.
//
// Vive aquí (y no dentro de MandalaRecorrido) porque lo usan DOS páginas y tiene
// que verse EXACTAMENTE igual en las dos: es el box donde se decide la compra.
// ─────────────────────────────────────────────────────────────────────────────

export function DisciplinaVideoBox({
  nom,
  bg,
  txt,
  videoIntro,
  paso,
  renderIcon,
  tieneVideo,
  onVerVideo,
  sinBoton = false,
  textoGrande = false,
  onSaberMas,
  ...rest
}: {
  nom: string;
  bg: string;
  txt: string;
  videoIntro: VideoIntro;
  /** Número de paso en el Mapa (1..8). Se pinta antes del nombre. */
  paso: number;
  renderIcon: (size: string) => React.ReactNode;
  /** Si no hay vídeo, en lugar del botón sale «Vídeo próximamente». */
  tieneVideo: boolean;
  onVerVideo: () => void;
  /** Sin el botón de muestra: en /d/:disciplina el vídeo ya está al lado, así que
   *  la fila de cierre se queda solo con el precio. */
  sinBoton?: boolean;
  /** Letra más grande en ordenador, para que el texto llene el box cuando va a
   *  media página (en el mandala de /elMetodo el box es estrecho y no toca). */
  textoGrande?: boolean;
  /** Si se pasa, sale un «Saber más ›» discreto arriba a la derecha del box, que
   *  lleva a la presentación de la disciplina (/d/:disciplina). No se pone en la
   *  propia presentación: allí ya estás dentro. */
  onSaberMas?: () => void;
  // Solo lo que necesitan los dos sitios donde se usa. Aceptar FlexProps entero
  // hace explotar el chequeo de tipos («union type too complex»).
} & Pick<FlexProps, "h" | "minH" | "flex">) {
  const accent = txt;
  const hasBg = hasDisciplinaBg(nom);
  const textGlow = `0 1px 3px ${bg}, 0 0 10px ${bg}, 0 0 20px ${bg}`;

  return (
    <Flex
      direction="column"
      position="relative"
      borderRadius="2xl"
      overflow="hidden"
      bg={bg}
      boxShadow={`0 10px 34px rgba(0,0,0,0.32), 0 0 26px ${accent}44`}
      {...rest}
    >
      {/* Fondo del box: imagen propia de la disciplina */}
      <DisciplinaBgLayer nom={nom} borderRadius="2xl" />

      {/* Cabecera: nº + icono + nombre */}
      <Flex align="center" gap={3} px={{ base: 5, md: 6 }} pt={{ base: 4, md: 5 }} pb={{ base: 3, md: 3 }} position="relative" zIndex={1}>
        <Box
          position="relative"
          w={{ base: "40px", md: "46px" }}
          h={{ base: "40px", md: "46px" }}
          borderRadius="full"
          overflow="hidden"
          flexShrink={0}
          bg={hasBg ? "transparent" : bg}
          border={`2px solid ${accent}`}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {hasBg && <DisciplinaBgLayer nom={nom} borderRadius="full" />}
          <Box position="relative" zIndex={1} display="flex" alignItems="center" justifyContent="center">
            {renderIcon("28px")}
          </Box>
        </Box>
        <Flex align="baseline" gap={2} minW={0} overflow="hidden">
          <Text
            color={accent}
            fontFamily="'EB Garamond', serif"
            fontWeight="700"
            fontSize={{ base: "xl", md: "2xl" }}
            lineHeight="1.1"
            opacity={0.9}
            textShadow={textGlow}
          >
            {paso}.
          </Text>
          <Text
            color={accent}
            fontFamily="'EB Garamond', serif"
            fontWeight="700"
            fontSize={{ base: "xl", md: "2xl" }}
            lineHeight="1.35"
            letterSpacing="0.02em"
            pb="0.12em"
            whiteSpace="nowrap"
            textShadow={textGlow}
          >
            {nombreEnMapa(nom)}
          </Text>
        </Flex>

        {/* «Saber más ›» — arriba a la derecha. Discreto a propósito: no compite
            con el precio, que es lo que decide abajo. */}
        {onSaberMas && (
          <Flex
            as="button"
            onClick={onSaberMas}
            ml="auto"
            flexShrink={0}
            align="center"
            gap={1.5}
            px={{ base: 2.5, md: 3.5 }}
            py={{ base: 1, md: 1.5 }}
            borderRadius="full"
            border={`1px solid ${accent}66`}
            color={accent}
            cursor="pointer"
            sx={{
              WebkitTapHighlightColor: "transparent",
              transition: "all 0.2s ease",
              _hover: { bg: `${accent}22`, borderColor: accent, transform: "translateY(-1px)" },
              _active: { transform: "translateY(0)" },
            }}
          >
            <Text
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "2xs", md: "sm" }}
              fontStyle="italic"
              letterSpacing="0.06em"
              whiteSpace="nowrap"
              textShadow={textGlow}
            >
              Saber más
            </Text>
            <Box
              as="svg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              w={{ base: "12px", md: "14px" }}
              h={{ base: "12px", md: "14px" }}
              fill="currentColor"
              flexShrink={0}
            >
              <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
            </Box>
          </Flex>
        )}
      </Flex>

      {/* Separador horizontal */}
      <Box
        mx={{ base: 5, md: 6 }}
        h="1px"
        position="relative"
        zIndex={1}
        bg={`linear-gradient(to right, transparent, ${accent}bb, transparent)`}
      />

      {/* Texto introductorio (título + puntos con ✓) + botón al final */}
      <Flex
        direction="column"
        position="relative"
        zIndex={1}
        px={{ base: 5, md: 7 }}
        pt={{ base: 5, md: 6 }}
        pb={{ base: 5, md: 6 }}
        gap={{ base: 4, md: 5 }}
        flex="1"
      >
        {/* Título (puede ser una frase larga que introduce el recorrido).
            En `textoGrande` (las presentaciones, donde el box va a media página
            y su alto lo impone el vídeo cuadrado de al lado) la letra sube para
            que el texto LLENE la caja en vez de quedarse un bloque pequeño
            arriba con medio box vacío. */}
        <Text
          color={accent}
          fontFamily="'EB Garamond', serif"
          fontWeight="700"
          fontSize={textoGrande ? { base: "2xl", md: "4xl" } : { base: "lg", md: "xl" }}
          lineHeight="1.35"
          letterSpacing="0.01em"
          textShadow={textGlow}
        >
          {videoIntro.titulo}
        </Text>

        {/* Puntos con ✓ */}
        <Flex direction="column" gap={textoGrande ? { base: 3, md: 4 } : { base: 2.5, md: 3 }}>
          {videoIntro.puntos.map((p, i) => (
            <Flex key={i} align="flex-start" gap={{ base: 2.5, md: 3 }}>
              <Text
                color={accent}
                fontWeight="700"
                fontSize={textoGrande ? { base: "lg", md: "2xl" } : { base: "md", md: "lg" }}
                lineHeight="1.45"
                flexShrink={0}
                textShadow={textGlow}
              >
                ✓
              </Text>
              <Text
                color={accent}
                fontFamily="'EB Garamond', serif"
                fontSize={textoGrande ? { base: "lg", md: "2xl" } : { base: "sm", md: "md" }}
                lineHeight="1.45"
                textShadow={textGlow}
              >
                {p}
              </Text>
            </Flex>
          ))}
        </Flex>

        {/* Fila de cierre: a la izquierda el botón (ver una muestra de la
            plataforma); abajo a la derecha, el precio de la disciplina. Así el
            «cuánto cuesta» sale justo donde se decide, sin un box de precio
            aparte. `mt="auto"` la empuja al fondo cuando el box tiene un alto
            impuesto por el vídeo de al lado (en /d/:disciplina). */}
        <Flex
          mt="auto"
          pt={{ base: 1, md: 2 }}
          direction={{ base: "column", md: "row" }}
          align={{ base: "stretch", md: "flex-end" }}
          justify={sinBoton ? "flex-end" : "space-between"}
          gap={{ base: 4, md: 5 }}
          w="100%"
        >
          {sinBoton ? null : tieneVideo ? (
            <Flex
              as="button"
              onClick={onVerVideo}
              align="center"
              justify="center"
              gap={2.5}
              alignSelf={{ base: "stretch", md: "flex-end" }}
              px={{ base: 5, md: 6 }}
              py={{ base: "10px", md: "11px" }}
              borderRadius="full"
              border={`1.5px solid ${accent}aa`}
              bg={`${accent}1f`}
              color={accent}
              cursor="pointer"
              boxShadow={`0 0 14px ${accent}33, 0 2px 12px rgba(0,0,0,0.25)`}
              sx={{ WebkitTapHighlightColor: "transparent", userSelect: "none", backdropFilter: "blur(4px)" }}
              _hover={{ bg: `${accent}33`, borderColor: accent, boxShadow: `0 0 22px ${accent}55, 0 4px 16px rgba(0,0,0,0.3)`, transform: "translateY(-2px)" }}
              _active={{ transform: "translateY(0) scale(0.98)" }}
              transition="all 0.2s ease"
            >
              <Box as="span" fontSize={{ base: "sm", md: "md" }} lineHeight="1" style={{ textShadow: textGlow }}>▶</Box>
              <Text
                fontFamily="'EB Garamond', serif"
                fontWeight="600"
                fontSize={{ base: "sm", md: "md" }}
                letterSpacing="0.03em"
                textShadow={textGlow}
              >
                {videoIntro.boton ?? "Muestra"}
              </Text>
            </Flex>
          ) : (
            <Text
              color={accent}
              fontFamily="'EB Garamond', serif"
              fontStyle="italic"
              fontSize={{ base: "sm", md: "md" }}
              letterSpacing="0.12em"
              textTransform="uppercase"
              opacity={0.8}
              alignSelf={{ base: "center", md: "flex-end" }}
              textShadow={textGlow}
            >
              Vídeo próximamente
            </Text>
          )}

          {/* Precio de la disciplina (sale de pagoDisciplinaLink, el mismo sitio
              del que bebe el box de pago: web y cobro no se desincronizan). */}
          <Flex direction="column" align={{ base: "center", md: "flex-end" }} gap={0.5} flexShrink={0}>
            <Flex align="baseline" gap={2}>
              <PrecioConAntes
                color={accent}
                sombra={textGlow}
                tamano={{ base: "3xl", md: "4xl" }}
                tamanoAntes={{ base: "md", md: "lg" }}
              />
              <Text
                color={accent}
                fontFamily="'EB Garamond', serif"
                fontStyle="italic"
                fontSize={{ base: "sm", md: "md" }}
                opacity={0.9}
                textShadow={textGlow}
              >
                por disciplina
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
