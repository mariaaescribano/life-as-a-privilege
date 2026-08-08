import React, { useEffect, useRef, useState } from "react";
import { useT } from "../../i18n";
import { Box, Flex, Text } from "@chakra-ui/react";
import type { IlustracionEntry } from "./ilustracionesGaleria";
import { StarsLayer } from "../global/StarsLayer";

// ─────────────────────────────────────────────────────────────────────────
// Tarjeta de una serie de ilustraciones: portada arriba, y al pie el nombre de
// la disciplina + el título sobre el fondo de esa disciplina. Al pulsarla, el
// llamante abre el <ComicModal> inmersivo.
//
// Vive aquí (y no dentro de /ilustraciones) porque la usan DOS páginas: la
// galería completa y la presentación de cada disciplina (/d/:disciplina).
// ─────────────────────────────────────────────────────────────────────────

// Reveal por scroll: cada tarjeta se enciende al entrar en el viewport, así la
// galería va "brotando" según el usuario baja. rootMargin negativo abajo → se
// dispara un pelín antes de estar del todo dentro.
const useReveal = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

export function IlustracionCard({
  entry,
  i,
  onOpen,
  columnas = 4,
}: {
  entry: IlustracionEntry;
  /** Índice en la rejilla: escalona la entrada de las tarjetas de una fila. */
  i: number;
  onOpen: () => void;
  /** Nº de columnas de la rejilla, para que la cascada reinicie en cada fila. */
  columnas?: number;
}) {
  const t = useT();
  const [coverFailed, setCoverFailed] = useState(false);
  const { ref, visible } = useReveal();
  // Color del texto/borde de la tarjeta: `cardColor` si la entrada lo define
  // (p.ej. Nutrición, cuyo acento de cómic es claro e ilegible aquí), si no el
  // acento del cómic (themeColor).
  const c = entry.cardColor ?? entry.themeColor;
  const retraso = (i % columnas) * 0.08;
  return (
    <Box
      ref={ref}
      h="100%"
      opacity={visible ? 1 : 0}
      transform={visible ? "translateY(0)" : "translateY(24px)"}
      transition={`opacity 0.7s ease ${retraso}s, transform 0.7s ease ${retraso}s`}
    >
    <Box
      as="button"
      onClick={onOpen}
      position="relative"
      w="100%"
      h="100%"
      display="flex"
      flexDirection="column"
      borderRadius="2xl"
      overflow="hidden"
      border={`1px solid ${c}55`}
      bg="rgba(255,255,255,0.06)"
      cursor="pointer"
      fontFamily="'EB Garamond', serif"
      sx={{
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        transition: "all 0.25s ease",
        boxShadow: `0 0 16px ${c}2e, 0 0 40px ${c}1a, inset 0 0 24px rgba(255,255,255,0.04)`,
        _hover: {
          transform: "translateY(-4px)",
          borderColor: c,
          boxShadow: `0 0 26px ${c}99, 0 0 64px ${c}4d, inset 0 0 24px rgba(255,255,255,0.08)`,
        },
        _active: { transform: "translateY(-1px)" },
      }}
    >
      {/* Portada */}
      <Box position="relative" w="100%" aspectRatio={1} flexShrink={0} overflow="hidden" borderBottom="1px solid rgba(255,255,255,0.9)" bg="rgba(0,0,0,0.35)">
        {!coverFailed ? (
          <Box
            as="img"
            src={encodeURI(entry.cover)}
            alt={entry.titulo}
            loading="eager"
            position="absolute"
            inset="0"
            w="100%"
            h="100%"
            style={{ objectFit: "cover", objectPosition: "top" }}
            onError={() => setCoverFailed(true)}
          />
        ) : (
          <Flex position="absolute" inset="0" align="center" justify="center">
            <Text fontSize="4xl" opacity={0.6}>✨</Text>
          </Flex>
        )}
      </Box>

      {/* Pie: disciplina + título. Su fondo es la imagen de la disciplina a la
          que pertenece (o el cielo estrellado en Astrología, que no tiene
          imagen), con un velo oscuro para que el texto siga legible. */}
      <Flex
        direction="column"
        align="center"
        justify="center"
        flex="1"
        gap={1}
        py={{ base: 4, md: 4 }}
        px={3}
        position="relative"
        overflow="hidden"
      >
        {/* Fondo de la disciplina */}
        <Box position="absolute" inset="0" zIndex={0} pointerEvents="none">
          {entry.disciplinaBgImage ? (
            <Box
              position="absolute"
              inset="0"
              bgColor={entry.disciplinaBgColor}
              bgImage={`url('${encodeURI(entry.disciplinaBgImage)}')`}
              bgSize="cover"
              bgPosition="center"
              bgRepeat="no-repeat"
            />
          ) : (
            <StarsLayer borderRadius="0" overlay="rgba(8,13,30,0.32)" />
          )}
        </Box>

        <Text color={c} fontSize="2xs" fontWeight="700" letterSpacing="0.18em" textTransform="uppercase" position="relative" zIndex={1}>
          {entry.disciplina}
        </Text>
        <Text
          color={c}
          fontSize={{ base: "md", md: "md" }}
          fontWeight="700"
          letterSpacing="0.04em"
          textAlign="center"
          lineHeight="1.2"
          position="relative"
          zIndex={1}
        >
          {entry.titulo}
        </Text>
        <Flex align="center" gap={1.5} mt={1.5} color={c} fontSize="2xs" letterSpacing="0.18em" textTransform="uppercase"
              position="relative" zIndex={1}>
          <Text as="span">{t("metodo.ver")}</Text>
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="13px" h="13px" fill="currentColor">
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
          </Box>
        </Flex>
      </Flex>
    </Box>
    </Box>
  );
}
