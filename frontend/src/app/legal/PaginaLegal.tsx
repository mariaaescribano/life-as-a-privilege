// PaginaLegal.tsx — armazón común de las cuatro páginas legales.
//
// Mismo lenguaje visual que el resto del sitio (fondo turquesa, EB Garamond,
// header público + footer anclado abajo) pero con el texto alineado a la
// izquierda y ancho de lectura cómodo: son textos largos, no páginas de venta.
import React, { useEffect } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";

/** Datos identificativos del titular del sitio (los exige el art. 10 de la LSSI).
 *  Se muestran tal cual en el aviso legal, la privacidad y los términos, así que
 *  cambiarlos aquí los cambia en las tres páginas a la vez. */
export const TITULAR = {
  nombre: "María Escribano",
  nif: "48790731A",
  domicilio: "Calle Deportista Juan Matos, nº 4, Alicante",
  email: "darkcake141@gmail.com",
  web: "https://lifeasaprivilege.onrender.com",
};

/** Última revisión de los textos legales. Actualízala si cambias el contenido. */
export const ULTIMA_ACTUALIZACION = "27 de julio de 2026";

export const Seccion = ({ titulo, children }: { titulo: string; children: React.ReactNode }) => (
  <Box mb={{ base: 8, md: 10 }}>
    <Text
      color="white"
      fontSize={{ base: "xl", md: "2xl" }}
      fontWeight="700"
      letterSpacing="0.06em"
      mb={3}
      textShadow="0 0 12px rgba(255,255,255,0.5)"
    >
      {titulo}
    </Text>
    <Box color="rgba(255,255,255,0.9)" fontSize={{ base: "md", md: "lg" }} lineHeight="1.85">
      {children}
    </Box>
  </Box>
);

export const P = ({ children }: { children: React.ReactNode }) => (
  <Text mb={3}>{children}</Text>
);

export const Lista = ({ items }: { items: React.ReactNode[] }) => (
  <Box as="ul" pl={6} mb={3} style={{ listStyleType: "disc" }}>
    {items.map((item, i) => (
      <Box as="li" key={i} mb={2}>
        {item}
      </Box>
    ))}
  </Box>
);

export default function PaginaLegal({
  titulo,
  entradilla,
  children,
}: {
  titulo: string;
  entradilla?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="public" />

      <Box flex="1">
        <Flex justify="center" pt={{ base: 8, md: 12 }}>
          <Image
            src="/img/icono/life.png"
            alt=""
            h={{ base: "48px", md: "62px" }}
            objectFit="contain"
            style={{ filter: "drop-shadow(0 0 11px rgba(255,255,255,0.7)) drop-shadow(0 0 26px rgba(255,255,255,0.35))" }}
          />
        </Flex>

        <Flex direction="column" align="center" textAlign="center" px={{ base: 5, md: 10 }} pt={{ base: 6, md: 8 }}>
          <Text
            color="white"
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="700"
            letterSpacing="0.09em"
            lineHeight="1.15"
            textTransform="uppercase"
            textShadow="0 0 18px rgba(255,255,255,0.8), 0 0 38px rgba(255,255,255,0.5)"
          >
            {titulo}
          </Text>
          {entradilla && (
            <Text
              color="rgba(255,255,255,0.86)"
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.7"
              maxW="640px"
              mt={4}
              textShadow="0 0 10px rgba(255,255,255,0.35)"
            >
              {entradilla}
            </Text>
          )}
          <Text color="rgba(255,255,255,0.55)" fontSize="xs" letterSpacing="0.14em" mt={4} textTransform="uppercase">
            Última actualización: {ULTIMA_ACTUALIZACION}
          </Text>
        </Flex>

        <Flex justify="center" px={{ base: 5, md: 10 }} pt={{ base: 10, md: 14 }} pb={{ base: 16, md: 24 }}>
          <Box w="100%" maxW="760px">
            {children}
          </Box>
        </Flex>
      </Box>

      <SiteFooter />
    </Box>
  );
}
