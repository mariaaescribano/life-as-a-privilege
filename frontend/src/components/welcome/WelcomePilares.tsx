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
 * Las cajas se definen por el halo, sin sombra negra ni filo (DISENO.md §5).
 */
const CAJA_GLOW =
  "0 0 16px rgba(255,255,255,0.11), 0 0 34px rgba(255,255,255,0.06), 0 0 60px rgba(180,255,245,0.06)";

const PILARES: { titulo: ClaveTexto; texto: ClaveTexto }[] = [
  { titulo: "welcome.pilar.1.titulo", texto: "welcome.pilar.1.texto" },
  { titulo: "welcome.pilar.2.titulo", texto: "welcome.pilar.2.texto" },
  { titulo: "welcome.pilar.3.titulo", texto: "welcome.pilar.3.texto" },
];

const WelcomePilares = () => {
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
          inView
          amount={0.2}
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
              src="/img/me/leyendo.webp"
              alt="María Escribano"
              position="absolute"
              inset={0}
              w="100%"
              h="100%"
              objectFit="cover"
              objectPosition="center 30%"
              display="block"
              transition="transform 0.9s cubic-bezier(0.22,1,0.36,1)"
              _groupHover={{ transform: "scale(1.04)" }}
            />
          </Box>
        </Reveal>

        {/* ── Las tres cajas, repartiéndose el alto de la foto ── */}
        <Flex direction="column" gap={{ base: 4, md: 5 }} order={{ base: 1, md: 2 }}>
          {PILARES.map((p, i) => (
            <Reveal
              key={p.titulo}
              inView
              amount={0.25}
              direction="up"
              distance={26}
              scaleFrom={0.97}
              duration={0.8}
              delay={i * 0.12}
              flex="1"
              display="flex"
            >
              <Flex
                flex="1"
                direction="column"
                justify="center"
                gap={{ base: 2, md: 3 }}
                px={{ base: 6, md: 8 }}
                py={{ base: 6, md: 7 }}
                borderRadius="2xl"
                bg="rgba(255,255,255,0.05)"
                // Filo blanco ligero de 2 px: lo pidió María para las tres cajas.
                border="2px solid rgba(255,255,255,0.32)"
                boxShadow={CAJA_GLOW}
              >
                <Text
                  color="white"
                  fontFamily="'EB Garamond', serif"
                  fontWeight="700"
                  fontSize={{ base: "xl", md: "2xl" }}
                  letterSpacing="0.04em"
                  lineHeight="1.2"
                >
                  {t(p.titulo)}
                </Text>
                <Text
                  color="rgba(255,255,255,0.92)"
                  fontFamily="'EB Garamond', serif"
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight="1.6"
                  letterSpacing="0.01em"
                >
                  {t(p.texto)}
                </Text>
              </Flex>
            </Reveal>
          ))}
        </Flex>
      </Grid>
    </Box>
  );
};

export default WelcomePilares;
