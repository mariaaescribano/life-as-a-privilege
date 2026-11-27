import React, { useEffect, useState } from "react";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import { Flecha } from "./LineaTiempoAstrologia";
import TituloSeccion from "../global/TituloSeccion";
import { ARTE_ASTROLOGIA } from "../../data/astrologiaArte";
import { FONDO_PAGINA_BEIGE as BEIGE } from "../../GlobalVariables";
import { useIdioma, useT } from "../../i18n";

/**
 * «Astrología en el arte», sobre el cielo estrellado: sobre todo imágenes. De una pieza en una (una o dos imágenes
 * en cada una, a todo lo grande que deja la pantalla) y, debajo, su pie: el nombre en negrita y el lugar y la época.
 * Flechas a los lados (debajo, en móvil) para pasar de pieza; al pasar entran las imágenes nuevas con un fundido.
 * Datos en `data/astrologiaArte.ts`.
 */
export default function ArteAstrologia() {
  const t = useT();
  const { idioma } = useIdioma();
  const [i, setI] = useState(0);
  const total = ARTE_ASTROLOGIA.length;
  const pieza = ARTE_ASTROLOGIA[i];
  const anterior = () => setI((n) => Math.max(0, n - 1));
  const siguiente = () => setI((n) => Math.min(total - 1, n + 1));

  // Precarga las imágenes de la pieza siguiente.
  useEffect(() => {
    ARTE_ASTROLOGIA[i + 1]?.fotos.forEach((src) => { const img = new window.Image(); img.src = src; });
  }, [i]);

  const en = idioma === "en";
  return (
    <Flex direction="column" w="100%" maxW="1180px" mx="auto" gap={{ base: 8, md: 10 }} color={BEIGE} fontFamily="'EB Garamond', serif">
      <TituloSeccion color={BEIGE}>{t("astroArte.titulo")}</TituloSeccion>

      <Flex w="100%" align="center" gap={{ base: 2, md: 6 }}>
        <Box display={{ base: "none", md: "block" }}>
          <Flecha dir="prev" onClick={anterior} desactivada={i === 0} label="‹" />
        </Box>

        <Flex direction="column" flex="1" minW={0} gap={{ base: 5, md: 6 }}>
          <Flex
            key={i}
            direction="column"
            gap={{ base: 5, md: 6 }}
            align="center"
            sx={{
              "@keyframes arteEntra": { from: { opacity: 0, transform: "translateY(14px)" }, to: { opacity: 1, transform: "none" } },
              animation: "arteEntra 0.6s cubic-bezier(0.22,1,0.36,1) both",
              "@media (prefers-reduced-motion: reduce)": { animation: "none" },
            }}
          >
            {pieza.fotos.length === 2 ? (
              // Dos imágenes: MISMO tamaño exacto (misma proporción 5:4 y mismo ancho), recortando al centro con `cover`
              // si hace falta (un pequeño zoom en la que sea más cuadrada o más apaisada), para que queden alineadas y limpias.
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))" }} gap={{ base: 4, md: 6 }} w="100%" maxW={{ base: "420px", md: "1000px" }} mx="auto">
                {pieza.fotos.map((src) => (
                  <Box key={src} borderRadius="xl" overflow="hidden" border={`1.5px solid ${BEIGE}99`} bg={`${BEIGE}14`} lineHeight={0} sx={{ aspectRatio: "5 / 4" }}>
                    <Image src={src} alt={en ? pieza.nombre.en : pieza.nombre.es} display="block" w="100%" h="100%" objectFit="cover" objectPosition="center" />
                  </Box>
                ))}
              </Grid>
            ) : (
              // Una sola imagen: entera, todo lo grande que deja la pantalla.
              <Flex justify="center" w="100%">
                {pieza.fotos.map((src) => (
                  <Box key={src} borderRadius="xl" overflow="hidden" border={`1.5px solid ${BEIGE}99`} maxW="100%" bg={`${BEIGE}14`} lineHeight={0}>
                    <Image src={src} alt={en ? pieza.nombre.en : pieza.nombre.es} display="block" w="auto" h="auto" maxW="100%" maxH={{ base: "420px", md: "500px" }} objectFit="contain" />
                  </Box>
                ))}
              </Flex>
            )}

            <Text textAlign="center" fontSize={{ base: "md", md: "xl" }} lineHeight="1.5" maxW="760px">
              <Text as="span" fontWeight="700">{en ? pieza.nombre.en : pieza.nombre.es}</Text>
              {" · "}
              {en ? pieza.detalle.en : pieza.detalle.es}
            </Text>
          </Flex>

          {/* Móvil: flechas debajo con el contador en medio; escritorio: a los lados. */}
          <Flex align="center" justify="center" gap={5}>
            <Box display={{ base: "block", md: "none" }}>
              <Flecha dir="prev" onClick={anterior} desactivada={i === 0} label="‹" />
            </Box>
            <Text fontSize={{ base: "sm", md: "md" }} letterSpacing="0.2em" opacity={0.8}>
              {i + 1} / {total}
            </Text>
            <Box display={{ base: "block", md: "none" }}>
              <Flecha dir="next" onClick={siguiente} desactivada={i === total - 1} label="›" />
            </Box>
          </Flex>
        </Flex>

        <Box display={{ base: "none", md: "block" }}>
          <Flecha dir="next" onClick={siguiente} desactivada={i === total - 1} label="›" />
        </Box>
      </Flex>
    </Flex>
  );
}
