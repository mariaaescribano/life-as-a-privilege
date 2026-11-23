import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Reveal } from "../../components/global/Reveal";
import { MandalaTinte } from "../../components/global/MandalaTinte";
import { SpaceBg } from "../../components/metodo/SpaceBg";
import { AstrologiaIcon, astrologiaTxt, FONDO_PAGINA_TURQUESA as T } from "../../GlobalVariables";
import { rutaCamino } from "../../data/camino";
import { useNombreDisciplina } from "../../i18n/nombreDisciplina";
import { useT } from "../../i18n";

/**
 * Lo que ve en su home la persona que se acompaña: DOS cajas, una al lado de la otra.
 *   · La de la izquierda, «La lectura de mi carta»: el cielo estrellado (con menos intensidad) y, arriba, el icono
 *     de Astrología a la izquierda y su nombre en pequeño. Lleva al camino de Astrología.
 *   · La de la derecha, «Diario de sesiones»: borde turquesa oscuro y, arriba, solo el mandala.
 * En móvil, una debajo de la otra.
 */
const ALTO = { base: "240px", md: "340px" };

export default function HomeCajas() {
  const t = useT();
  const navigate = useNavigate();
  const nombreDisciplina = useNombreDisciplina();

  return (
    <Flex direction={{ base: "column", md: "row" }} gap={{ base: 5, md: 7 }} w="100%" maxW="1040px" mx="auto" px={{ base: 0, md: 4 }} fontFamily="'EB Garamond', serif">
      {/* ── La lectura de mi carta ── */}
      <Reveal direction="up" distance={22} duration={0.8} delay={0.3} flex="1" display="flex">
        <Flex
          as="button"
          type="button"
          onClick={() => navigate(rutaCamino("metodo"))}
          position="relative"
          overflow="hidden"
          direction="column"
          flex="1"
          h={ALTO}
          px={{ base: 5, md: 6 }}
          py={{ base: 4, md: 5 }}
          borderRadius="3xl"
          border={`1.5px solid ${T}`}
          cursor="pointer"
          transition="transform 0.28s ease"
          _hover={{ transform: "translateY(-3px)" }}
          _focusVisible={{ outline: `2px solid ${T}cc`, outlineOffset: "2px" }}
          role="group"
        >
          {/* El cielo de Astrología, a su intensidad normal. */}
          <Box position="absolute" inset={0} borderRadius="inherit" overflow="hidden">
            <SpaceBg overlay="rgba(8,13,30,0.25)" escala={0.45} />
          </Box>

          <Flex position="relative" zIndex={1} align="center" gap={2.5}>
            <AstrologiaIcon size={{ base: "24px", md: "30px" }} />
            <Text color={astrologiaTxt} fontSize={{ base: "xs", md: "sm" }} fontWeight="600" letterSpacing="0.2em" textTransform="uppercase">
              {nombreDisciplina("Astrología")}
            </Text>
          </Flex>

          <Flex position="relative" zIndex={1} flex="1" align="center" justify="center">
            <Text color={astrologiaTxt} fontSize={{ base: "2xl", md: "4xl" }} fontWeight="700" letterSpacing="0.1em" textTransform="uppercase" lineHeight="1.25" textAlign="center">
              {t("home.cajas.lectura")}
            </Text>
          </Flex>
        </Flex>
      </Reveal>

      {/* ── Diario de sesiones ── */}
      <Reveal direction="up" distance={22} duration={0.8} delay={0.45} flex="1" display="flex">
        <Flex
          direction="column"
          flex="1"
          h={ALTO}
          px={{ base: 5, md: 6 }}
          py={{ base: 4, md: 5 }}
          borderRadius="3xl"
          border={`1.5px solid ${T}`}
          color={T}
        >
          {/* El mandala y el título, juntos y en el MEDIO de la caja. */}
          <Flex flex="1" direction="column" align="center" justify="center" gap={{ base: 3, md: 4 }}>
            <MandalaTinte h={{ base: "44px", md: "64px" }} />
            <Text fontSize={{ base: "2xl", md: "4xl" }} fontWeight="700" letterSpacing="0.1em" textTransform="uppercase" lineHeight="1.25" textAlign="center">
              {t("home.cajas.diario")}
            </Text>
          </Flex>
        </Flex>
      </Reveal>
    </Flex>
  );
}
