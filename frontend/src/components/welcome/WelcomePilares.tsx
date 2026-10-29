import React from "react";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import { useT, type ClaveTexto } from "../../i18n";
import { Reveal } from "../global/Reveal";

/**
 * Segunda sección de la portada: las tres ideas de fondo (autoconocimiento,
 * autoaceptación y automejora) en tres cajas, con una foto de María a la
 * izquierda.
 *
 * En ordenador la foto y las tres cajas van en la misma fila y miden lo mismo
 * de alto: la fila la estira la que más necesite (si el texto crece, la foto se
 * recorta un poco más, nunca se queda un hueco). En móvil la foto baja DEBAJO
 * de las cajas, centrada, para no apretar texto y foto uno contra otro.
 *
 * Va dentro de una BandaMarmol (el mármol de María): la letra es turquesa oscuro y
 * las cajas son de cristal claro con un filo fino del mismo turquesa y un halo
 * dorado muy suave. Todo tiene movimiento al asomar:
 *  · la foto entra desde la izquierda y, ya colocada, se acerca muy despacio
 *    (zoom lento que va y viene);
 *  · las cajas salen UNA DETRÁS DE OTRA (0,6 s entre cada una, después de la
 *    foto): llega desde la derecha, una barra de luz dorada crece por su lado
 *    izquierdo, un destello la cruza de lado a lado, y dentro entran el título,
 *    su rayita y el texto, en ese orden;
 *  · al pasar por encima NO cambia nada (ni se mueve ni se enciende).
 * Con `prefers-reduced-motion` no se mueve nada.
 */
const TINTA = "#004f4f";
const CAJA_GLOW = "0 0 16px #b08d3f22, 0 0 36px #b08d3f12";

/** Segundos entre una caja y la siguiente, y espera inicial (la foto sale antes). */
const PASO = 0.6;
const INICIO = 0.5;

const PILARES: { titulo: ClaveTexto; texto: ClaveTexto }[] = [
  { titulo: "welcome.pilar.1.titulo", texto: "welcome.pilar.1.texto" },
  { titulo: "welcome.pilar.2.titulo", texto: "welcome.pilar.2.texto" },
  { titulo: "welcome.pilar.3.titulo", texto: "welcome.pilar.3.texto" },
];

const WelcomePilares = ({ activo }: { activo: boolean }) => {
  const t = useT();

  return (
    <Box w="100%" maxW="1180px" mx="auto" px={{ base: 5, md: 10, lg: 16 }}>
      <Grid
        templateColumns={{ base: "1fr", md: "minmax(0, 5fr) minmax(0, 7fr)" }}
        gap={{ base: 5, md: 7, lg: 8 }}
        alignItems="stretch"
      >
        {/* ── Foto (izquierda en ordenador; debajo de las cajas en móvil) ── */}
        <Reveal
          activo={activo}
          direction="left"
          distance={28}
          scaleFrom={0.96}
          duration={0.9}
          order={{ base: 2, md: 1 }}
          w="100%"
          maxW={{ base: "340px", md: "none" }}
          mx={{ base: "auto", md: 0 }}
        >
          <Box
            position="relative"
            h="100%"
            minH={{ base: "420px", md: "460px" }}
            borderRadius="2xl"
            overflow="hidden"
            boxShadow={CAJA_GLOW}
            role="group"
          >
            <Image
              src="/img/me/asesora-grande.webp"
              alt="María Escribano"
              position="absolute"
              inset={0}
              w="100%"
              h="100%"
              objectFit="cover"
              objectPosition="center 22%"
              display="block"
              sx={{
                "@keyframes fotoZoomLento": { from: { scale: "1" }, to: { scale: "1.06" } },
                animation: "fotoZoomLento 14s ease-in-out infinite alternate",
                "@media (prefers-reduced-motion: reduce)": { animation: "none" },
              }}
            />
          </Box>
        </Reveal>

        {/* ── Las tres cajas, repartiéndose el alto de la foto ── */}
        <Flex direction="column" gap={{ base: 4, md: 5 }} order={{ base: 1, md: 2 }}>
          {PILARES.map((p, i) => {
            const B = INICIO + i * PASO;
            return (
            <Reveal
              key={p.titulo}
              activo={activo}
              direction="left"
              distance={60}
              scaleFrom={0.96}
              duration={1}
              delay={B}
              flex="1"
              display="flex"
            >
              <Flex
                position="relative"
                overflow="hidden"
                flex="1"
                direction="column"
                justify="center"
                gap={{ base: 2, md: 3 }}
                px={{ base: 6, md: 8 }}
                py={{ base: 6, md: 7 }}
                borderRadius="2xl"
                bg="transparent"
                border={`1.5px solid ${TINTA}55`}
                boxShadow={CAJA_GLOW}
                // Al pasar el ratón NO cambia nada: ni se mueve ni se enciende.
              >
                {/* Barra de luz dorada: crece de arriba abajo por el lado izquierdo. */}
                <Box
                  position="absolute"
                  left={0}
                  top="14%"
                  bottom="14%"
                  w="3px"
                  borderRadius="full"
                  bgGradient="linear(to-b, #b08d3f00, #b08d3fcc, #b08d3f00)"
                  pointerEvents="none"
                  sx={{
                    transformOrigin: "center top",
                    transform: activo ? undefined : "scaleY(0)",
                    "@keyframes barraPilar": { from: { transform: "scaleY(0)" }, to: { transform: "scaleY(1)" } },
                    animation: activo ? `barraPilar 0.9s cubic-bezier(0.22,1,0.36,1) ${B + 0.5}s both` : "none",
                    "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                  }}
                />
                {/* Destello: una pasada de luz que cruza la caja al llegar. */}
                <Box
                  position="absolute"
                  top={0}
                  bottom={0}
                  left={0}
                  w="38%"
                  pointerEvents="none"
                  bgGradient="linear(to-r, #ffffff00, #ffffff80, #ffffff00)"
                  sx={{
                    transform: "translateX(-130%) skewX(-18deg)",
                    opacity: 0,
                    "@keyframes destelloPilar": {
                      "0%": { transform: "translateX(-130%) skewX(-18deg)", opacity: 0 },
                      "15%": { opacity: 1 },
                      "100%": { transform: "translateX(330%) skewX(-18deg)", opacity: 0 },
                    },
                    animation: activo ? `destelloPilar 1.4s ease-out ${B + 0.7}s 1 both` : "none",
                    "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                  }}
                />
                <Reveal activo={activo} direction="right" distance={22} duration={0.8} delay={B + 0.35}>
                  <Text
                    color={TINTA}
                    fontFamily="'EB Garamond', serif"
                    fontWeight="700"
                    fontSize={{ base: "xl", md: "2xl" }}
                    letterSpacing="0.04em"
                    lineHeight="1.2"
                  >
                    {t(p.titulo)}
                  </Text>
                </Reveal>
                {/* La rayita se dibuja de izquierda a derecha. */}
                <Box
                  h="2px"
                  w={{ base: "64px", md: "90px" }}
                  borderRadius="full"
                  bgGradient={`linear(to-r, ${TINTA}cc, ${TINTA}00)`}
                  sx={{
                    transformOrigin: "left center",
                    "@keyframes rayaPilar": { from: { transform: "scaleX(0)" }, to: { transform: "scaleX(1)" } },
                    animation: activo ? `rayaPilar 0.9s cubic-bezier(0.22,1,0.36,1) ${B + 0.75}s both` : "none",
                    transform: activo ? undefined : "scaleX(0)",
                    "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                  }}
                />
                <Reveal activo={activo} direction="up" distance={14} duration={0.8} delay={B + 0.7}>
                  <Text
                    color={TINTA}
                    fontFamily="'EB Garamond', serif"
                    fontSize={{ base: "md", md: "lg" }}
                    lineHeight="1.6"
                    letterSpacing="0.01em"
                  >
                    {t(p.texto)}
                  </Text>
                </Reveal>
              </Flex>
            </Reveal>
            );
          })}
        </Flex>
      </Grid>
    </Box>
  );
};

export default WelcomePilares;
