import React from "react";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { Reveal } from "../global/Reveal";
import { focoBlanco } from "../global/foco";
import { FONDO_PAGINA_BEIGE as BEIGE } from "../../GlobalVariables";
import { useT, type ClaveTexto } from "../../i18n";

/**
 * Los servicios de la página de Astrología: cuatro cajas sobre la foto de la disciplina, con la letra en el
 * beige de la página. Cada una: título y descripción arriba; abajo, el precio a la derecha y, debajo, un botón
 * de ancho completo.
 *
 * Título y precio salen de `astro.serv.N.*` en i18n (los de María); el destino de cada botón, de esta lista. Si un
 * servicio lleva `texto` (descripción), se pinta bajo el título; los de ahora no la llevan.
 */
const SERVICIOS: { titulo: ClaveTexto; texto?: ClaveTexto; precio: ClaveTexto; link: string }[] = [
  { titulo: "astro.serv.1.titulo", precio: "astro.serv.1.precio", link: "/reservar-cita" },
  { titulo: "astro.serv.2.titulo", precio: "astro.serv.2.precio", link: "/reservar-cita" },
  { titulo: "astro.serv.3.titulo", precio: "astro.serv.3.precio", link: "/reservar-cita" },
  { titulo: "astro.serv.4.titulo", precio: "astro.serv.4.precio", link: "/reservar-cita" },
];

const ServiciosAstrologia = ({ activo }: { activo: boolean }) => {
  const t = useT();
  return (
    <Grid templateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))", xl: "repeat(4, minmax(0, 1fr))" }} gap={{ base: 6, md: 7 }} alignItems="stretch">
      {SERVICIOS.map((s, i) => (
        <Reveal key={s.titulo} activo={activo} direction="up" distance={30} scaleFrom={0.96} blur duration={0.9} delay={0.15 + i * 0.15} h="100%" display="flex">
          <Flex
            direction="column"
            flex="1"
            gap={4}
            px={{ base: 6, md: 6 }}
            py={{ base: 7, md: 8 }}
            border={`1.5px solid ${BEIGE}80`}
            borderRadius="2xl"
            bg="transparent"
            color={BEIGE}
            fontFamily="'EB Garamond', serif"
            transition="background 0.28s ease, border-color 0.28s ease, transform 0.28s ease"
            _hover={{ bg: `${BEIGE}12`, borderColor: `${BEIGE}cc`, transform: "translateY(-4px)" }}
          >
            <Text fontWeight="700" fontSize={{ base: "xl", md: "2xl" }} lineHeight="1.25" letterSpacing="0.03em">
              {t(s.titulo)}
            </Text>
            {s.texto ? (
              <Text fontSize={{ base: "md", md: "lg" }} lineHeight="1.6" flex="1">
                {t(s.texto)}
              </Text>
            ) : (
              <Box flex="1" />
            )}
            {/* Precio, abajo a la derecha */}
            <Text alignSelf="flex-end" fontWeight="700" fontSize={{ base: "xl", md: "2xl" }} letterSpacing="0.04em">
              {t(s.precio)}
            </Text>
            {/* «Adquirir»: una franja horizontal de borde a borde de la caja, transparente (el fondo es la propia
                caja), separada del resto por una línea fina; la letra, en beige. */}
            <Box
              as="a"
              href={s.link}
              display="block"
              mx={{ base: -6, md: -6 }}
              mb={{ base: -7, md: -8 }}
              mt={2}
              textAlign="center"
              py="16px"
              borderTop={`1px solid ${BEIGE}80`}
              borderBottomRadius="2xl"
              bg="transparent"
              color={BEIGE}
              fontWeight="700"
              fontSize={{ base: "md", md: "lg" }}
              letterSpacing="0.22em"
              textTransform="uppercase"
              textDecoration="none"
              transition="background 0.25s ease"
              _hover={{ bg: `${BEIGE}18`, textDecoration: "none" }}
              _focusVisible={focoBlanco}
            >
              {t("astro.serv.adquirir")}
            </Box>
          </Flex>
        </Reveal>
      ))}
    </Grid>
  );
};

export default ServiciosAstrologia;
