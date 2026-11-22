import React from "react";
import { Box, Flex, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Reveal } from "../global/Reveal";
import { focoBlanco } from "../global/foco";
import WelcomeCabecera from "./WelcomeCabecera";
import { useT } from "../../i18n";
import { FONDO_PAGINA_BEIGE, FONDO_PAGINA_TURQUESA } from "../../GlobalVariables";

/**
 * Apertura de la portada: a la izquierda la foto de María; a la derecha, en medio,
 * el mandala con el titular y la frase (la cabecera de El Mapa), centrados.
 * En móvil se apila: primero la foto (con el alto limitado para que debajo asome
 * ya el texto) y luego el texto.
 *
 * La foto solo ENTRA con dinamismo (desliza, se enfoca y se dibuja su filo); después
 * se queda quieta.
 */
const FILO = "#004f4f40";
const HALO_FOTO = "0 0 16px rgba(255,255,255,0.11), 0 0 34px rgba(255,255,255,0.06), 0 0 60px rgba(180,255,245,0.06)";

const WelcomeHero = ({ activo, compacto = false }: { activo: boolean; marmol?: boolean; compacto?: boolean }) => {
  const navigate = useNavigate();
  const t = useT();

  return (
    <Flex
      w="100%"
      maxW="1240px"
      mx="auto"
      px={{ base: 6, md: 10, lg: 16 }}
      pt={compacto ? { base: 6, md: 8, lg: 12 } : { base: 10, md: 14, lg: 20 }}
      pb={0}
      direction={{ base: "column", lg: "row" }}
      align={{ base: "stretch", lg: "center" }}
      justify="center"
      gap={{ base: 8, lg: 16 }}
    >
      {/* ── Izquierda: la foto ── */}
      <Flex direction="column" align="center" flexShrink={0} w={{ base: "100%", lg: "320px" }} mx={{ base: "auto", lg: 0 }}>
        <Reveal activo={activo} direction="right" distance={46} scaleFrom={0.92} blur duration={1.5} delay={0.15}>
          <Box
            as="button"
            type="button"
            onClick={() => navigate("/quienSoy")}
            aria-label="María Escribano"
            position="relative"
            display="block"
            cursor="pointer"
            borderRadius="22px"
            // Móvil: grande, pero el ancho sale también del alto (≈ 56 vh) para que no se coma la pantalla.
            w={{ base: "min(82vw, 42vh)", md: "min(46vw, 34vh)", lg: "320px" }}
            role="group"
            _focusVisible={focoBlanco}
          >
            {/* Filo fino desplazado: se dibuja un instante después de la foto */}
            <Box
              position="absolute"
              inset="-10px"
              borderRadius="31px"
              border={`1px solid ${FILO}`}
              pointerEvents="none"
              sx={{
                "@keyframes filoEntra": { from: { opacity: 0, transform: "scale(0.94)" }, to: { opacity: 1, transform: "scale(1)" } },
                animation: activo ? "filoEntra 1.2s cubic-bezier(0.22,1,0.36,1) 0.9s both" : "none",
                "@media (prefers-reduced-motion: reduce)": { animation: "none" },
              }}
            />
            <Box position="relative" borderRadius="22px" overflow="hidden" boxShadow={HALO_FOTO} sx={{ aspectRatio: "850 / 1129" }}>
              <Image
                src="/img/me/maria-portada.webp"
                alt="María Escribano"
                w="100%"
                h="100%"
                objectFit="cover"
                objectPosition="center top"
                display="block"
              />
            </Box>
          </Box>
        </Reveal>
      </Flex>

      {/* ── Derecha: mandala, titular y frase, centrados en medio junto a la foto ── */}
      <Flex direction="column" align="center" justify="center" textAlign="center" flex={{ base: "1", lg: "0 1 640px" }} minW={0}>
        <WelcomeCabecera activo={activo} izquierda sinSeparador />
        {/* Pedir cita: botón turquesa oscuro, letra en el color del fondo.
            Entra cuando la frase ya está escrita; lleva a la página para reservar la cita. */}
        <Reveal activo={activo} direction="up" distance={16} duration={0.9} delay={4.4} mt={{ base: 12, md: 14 }}>
          <Flex
            as="button"
            type="button"
            onClick={() => navigate("/reservar-cita")}
            align="center"
            gap={3}
            px={{ base: 7, md: 9 }}
            py="13px"
            borderRadius="full"
            bg={FONDO_PAGINA_TURQUESA}
            color={FONDO_PAGINA_BEIGE}
            fontFamily="'EB Garamond', serif"
            fontWeight="700"
            fontSize={{ base: "md", md: "lg" }}
            letterSpacing="0.16em"
            textTransform="uppercase"
            whiteSpace="nowrap"
            cursor="pointer"
            transition="transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease"
            _hover={{ transform: "translateY(-2px)", opacity: 0.92 }}
            _active={{ transform: "translateY(0)" }}
            _focusVisible={focoBlanco}
          >
            {t("welcome.hero.pedirCita")}
          </Flex>
        </Reveal>
      </Flex>
    </Flex>
  );
};

export default WelcomeHero;
