import React from "react";
import { Box, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { useT, type ClaveTexto } from "../../i18n";
import { Reveal } from "../global/Reveal";

/**
 * Tercer apartado de la portada: cuatro cajas cuadradas juntas, en la misma línea
 * (en móvil, dos filas de dos). La foto va SOLA dentro de la caja, sin texto
 * encima, y apenas desenfocada (`blur(0.5px)`); la palabra (Cuerpo, Mente,
 * Tradición, Cultura) va debajo, en blanco sobre el turquesa.
 *
 * Entran de una en una, de izquierda a derecha, y cada una arrastra su palabra.
 * Sobre el turquesa el halo (luz, no sombra) las define. Sin padding propio: el
 * aire de arriba y el de abajo lo ponen los dos separadores, y es el mismo.
 *
 * Las fotos viven en /img/welcome/ (WebP a resolución completa).
 */
const CAJAS: { clave: ClaveTexto; foto: string; posicion?: string }[] = [
  { clave: "welcome.cuatro.cuerpo", foto: "/img/welcome/cuerpo.webp" },
  { clave: "welcome.cuatro.mente", foto: "/img/welcome/mente.webp", posicion: "62% center" },
  { clave: "welcome.cuatro.tradicion", foto: "/img/welcome/tradicion.webp" },
  { clave: "welcome.cuatro.cultura", foto: "/img/welcome/cultura.webp" },
];

const HALO = "0 0 16px rgba(255,255,255,0.14), 0 0 34px rgba(255,255,255,0.07), 0 0 60px rgba(180,255,245,0.08)";

/** Segundos entre una caja y la siguiente: se ven llegar de una en una. */
const PASO = 0.45;

const WelcomeCuatro = () => {
  const t = useT();
  return (
    <Box w="100%" maxW="1240px" mx="auto" px={{ base: 5, md: 10, lg: 16 }}>
      <SimpleGrid columns={{ base: 2, md: 4 }} columnGap={{ base: 3, md: 5 }} rowGap={{ base: 6, md: 5 }}>
        {CAJAS.map((c, i) => (
          <Reveal key={c.clave} inView amount={0.3} direction="up" distance={30} scaleFrom={0.95} duration={0.9} delay={i * PASO} w="100%">
            <Flex direction="column" align="center" gap={{ base: 3, md: 4 }}>
              <Box
                position="relative"
                overflow="hidden"
                w="100%"
                borderRadius="2xl"
                bg="rgba(255,255,255,0.08)"
                boxShadow={HALO}
                sx={{ aspectRatio: "1 / 1" }}
              >
                <Image
                  src={c.foto}
                  alt=""
                  aria-hidden="true"
                  position="absolute"
                  // Un pelín más grande que la caja para que el desenfoque no deje un borde claro.
                  inset="-3px"
                  w="calc(100% + 6px)"
                  h="calc(100% + 6px)"
                  maxW="none"
                  objectFit="cover"
                  objectPosition={c.posicion ?? "center"}
                  style={{ filter: "blur(0.5px)" }}
                />
              </Box>
              <Text
                color="white"
                fontFamily="'EB Garamond', serif"
                fontWeight="700"
                fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                letterSpacing="0.12em"
                textAlign="center"
                textTransform="uppercase"
              >
                {t(c.clave)}
              </Text>
            </Flex>
          </Reveal>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default WelcomeCuatro;
