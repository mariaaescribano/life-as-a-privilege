import React, { useEffect, useState } from "react";
import { Box, Flex, Image, Text, useBreakpointValue } from "@chakra-ui/react";
import { useT } from "../../i18n";
import { Reveal } from "../global/Reveal";
import { LetrasVivas } from "../global/LetrasVivas";

/**
 * Lo primero que se ve en la portada: el mandala (entra girando desde muy
 * pequeño y se enfoca; luego se queda quieto), el titular grande, la frase en cursiva y la
 * separación con el mandala pequeño. Es la misma cabecera de /elMetodo y usa sus
 * mismos textos (`elMetodo.hero.*`): una sola frase en los dos sitios.
 */
const WelcomeCabecera = ({
  activo,
  titulo: tituloTexto,
  subtitulo,
  mayusculas = false,
}: {
  activo: boolean;
  /** Titular. Por defecto, el de El Mapa (`elMetodo.hero.principal`). */
  titulo?: string;
  /** Frase en cursiva. Por defecto, la de El Mapa (`elMetodo.hero.secundaria`). */
  subtitulo?: string;
  /** Titular en mayúsculas (la página de Asesorías). */
  mayusculas?: boolean;
}) => {
  const t = useT();
  const esMovil = useBreakpointValue({ base: true, md: false }) ?? true;

  // La entrada es una secuencia: primero el mandala, luego el titular, luego la
  // frase en cursiva y, al final, la separación. Cada paso espera al anterior.
  const [tituloListo, setTitulo] = useState(false);
  const [frase, setFrase] = useState(false);
  const [separador, setSeparador] = useState(false);
  useEffect(() => {
    if (!activo) return;
    const ids = [
      setTimeout(() => setTitulo(true), 800),
      setTimeout(() => setFrase(true), 1700),
      setTimeout(() => setSeparador(true), 2400),
    ];
    return () => ids.forEach(clearTimeout);
  }, [activo]);

  return (
    <Box>
      <Flex justify="center" pt={{ base: 10, md: 14 }}>
        {/* Entra girando y se enfoca; luego se queda QUIETO. */}
        <Box>
          <Image
            src="/img/icono/life.webp"
            alt=""
            h={{ base: "63px", md: "86px" }}
            objectFit="contain"
            style={{
              opacity: activo ? 1 : 0,
              transform: activo ? "scale(1) rotate(0deg)" : "scale(0.25) rotate(-45deg)",
              // glow (drop-shadow) siempre + blur solo durante la entrada.
              filter:
                "drop-shadow(0 0 10px rgba(255,255,255,0.59)) drop-shadow(0 0 23px rgba(255,255,255,0.32)) drop-shadow(0 0 47px rgba(180,255,245,0.24))" +
                (activo ? "" : " blur(6px)"),
              transition: "opacity 1.1s ease, transform 1.3s cubic-bezier(0.22,1.5,0.36,1), filter 1s ease",
            }}
          />
        </Box>
      </Flex>

      <Flex direction="column" align="center" textAlign="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 7, md: 9 }} gap={{ base: 3, md: 4 }}>
        <Text
          color="white"
          fontFamily="'EB Garamond', serif"
          fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
          fontWeight="700"
          letterSpacing="0.03em"
          lineHeight="1.15"
          maxW="1000px"
          textTransform={mayusculas ? "uppercase" : undefined}
          textShadow="0 0 12px rgba(255,255,255,0.26), 0 0 26px rgba(180,255,245,0.12)"
          opacity={tituloListo ? 1 : 0}
          transition="opacity 0.9s ease"
        >
          {/* El titular NO se mueve: ni sube al entrar ni se ondula. Se enfoca al
              entrar y después se queda quieto: SOLO la luz lo repasa, una y otra
              vez (`altura={0}` = ninguna letra se eleva; `sinSubida`). */}
          <LetrasVivas texto={tituloTexto ?? t("elMetodo.hero.principal")} entrada sinSubida activo={tituloListo} onda={!esMovil} altura={0} />
        </Text>

        <Text
          color="rgba(255,255,255,0.9)"
          fontFamily="'EB Garamond', serif"
          fontSize={{ base: "md", md: "xl" }}
          fontStyle="italic"
          letterSpacing="0.03em"
          lineHeight="1.6"
          maxW="720px"
          opacity={frase ? 1 : 0}
          transform={frase ? "translateY(0)" : "translateY(14px)"}
          transition="opacity 0.9s ease, transform 0.9s ease"
        >
          {subtitulo ?? t("elMetodo.hero.secundaria")}
        </Text>
      </Flex>

      {/* Separación con el mandala pequeño, mismo aire arriba que abajo. */}
      <Reveal activo={separador} direction="none" scaleFrom={0.86} duration={0.9} mt={{ base: "48px", md: "67px" }}>
        <Flex align="center" justify="center" gap={{ base: 4, md: 6 }}>
          <Box h="1px" w={{ base: "60px", md: "150px" }} bg="linear-gradient(to right, transparent, rgba(255,255,255,0.55))" />
          <Box>
            <Image
              src="/img/icono/life.webp"
              alt=""
              h={{ base: "26px", md: "34px" }}
              objectFit="contain"
              flexShrink={0}
              style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.45)) drop-shadow(0 0 18px rgba(255,255,255,0.22))" }}
            />
          </Box>
          <Box h="1px" w={{ base: "60px", md: "150px" }} bg="linear-gradient(to left, transparent, rgba(255,255,255,0.55))" />
        </Flex>
      </Reveal>
    </Box>
  );
};

export default WelcomeCabecera;
