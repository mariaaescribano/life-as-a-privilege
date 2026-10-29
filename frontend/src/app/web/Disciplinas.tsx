import React, { useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import BotonContactame from "../../components/global/BotonContactame";
import BandaMarmol from "../../components/global/BandaMarmol";
import { BloqueDiferido } from "../../components/global/BloqueDiferido";
import { Reveal } from "../../components/global/Reveal";
import { RecorridoMandalaVideo } from "../../components/global/MandalaRecorrido";
import { PruebasBloque } from "../../components/metodo/elMetodoVenta";
import SeparadorFlor from "../../components/welcome/SeparadorFlor";
import FormularioAsesoria from "../../components/web/FormularioAsesoria";
import { useT } from "../../i18n";

/**
 * Disciplinas. De arriba abajo:
 *   0. «Con acceso a contenido exclusivo que acompañará tu camino».
 *   1. El mandala con las ocho disciplinas y, a la derecha, la caja de la que
 *      pinches (con su vídeo): el mismo bloque de El Mapa.
 *   2. Debajo, los vídeos de cada disciplina (los de «La prueba» de El Mapa).
 *   3. Y al final, el formulario para la persona, sobre el mármol.
 */
const Disciplinas = () => {
  const t = useT();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      <Box flex="1">
        {/* ── 0 · ENCABEZADO, encima de las disciplinas ── */}
        <Reveal direction="up" distance={20} duration={0.9} delay={0.1}>
          <Text
            textAlign="center"
            color="white"
            fontFamily="'EB Garamond', serif"
            fontWeight="700"
            fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
            letterSpacing="0.03em"
            lineHeight="1.2"
            maxW="980px"
            mx="auto"
            px={{ base: 5, md: 10 }}
            pt={{ base: 10, md: 14 }}
            // Todos los títulos de página van al 70% del glow original.
            textShadow="0 0 14px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.39), 0 0 56px rgba(180,255,245,0.32)"
          >
            {t("disciplinasPagina.encabezado")}
          </Text>
        </Reveal>

        {/* ── 1 · EL MANDALA CON LAS OCHO DISCIPLINAS + LA CAJA DE CADA UNA ── */}
        <Box px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 10 }}>
          <Box maxW="1200px" mx="auto">
            <BloqueDiferido minH={{ base: "760px", md: "560px" }}>
              <Reveal inView amount={0.06} direction="up" distance={26} scaleFrom={0.98} duration={0.8}>
                <RecorridoMandalaVideo />
              </Reveal>
            </BloqueDiferido>
          </Box>
        </Box>

        <SeparadorFlor />

        {/* ── 2 · LOS VÍDEOS DE CADA DISCIPLINA ── */}
        <Box px={{ base: 5, md: 10, lg: 16 }}>
          <Box maxW="1200px" mx="auto">
            <PruebasBloque />
          </Box>
        </Box>

        <SeparadorFlor />

        {/* ── 3 · EL FORMULARIO, SOBRE EL MÁRMOL ──
            El mármol sale primero al hacer scroll y el formulario después. */}
        <BandaMarmol>
          {(visible) => <FormularioAsesoria marmol activo={visible} asunto={t("header.disciplinas")} />}
        </BandaMarmol>
      </Box>

      <SiteFooter />
      <BotonContactame />
    </Box>
  );
};

export default Disciplinas;
