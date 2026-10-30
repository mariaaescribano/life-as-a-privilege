/**
 * CONTÁCTAME (/contacto).
 *
 * Mandala, título y frase; después, sobre el mármol, mi foto a la izquierda y a la
 * derecha las cuatro vías: la llamada, escribirme, WhatsApp e Instagram. El
 * formulario tiene su propia página (/contacto/escribir), a la que lleva la tarjeta
 * de escribirme.
 */
import React, { useEffect, useState } from "react";
import { Box, Flex, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import ViasDeContacto from "../../components/contacto/ViasDeContacto";
import { Reveal } from "../../components/global/Reveal";
import WelcomeCabecera from "../../components/welcome/WelcomeCabecera";
import BandaMarmol from "../../components/global/BandaMarmol";
import { useT } from "../../i18n";

const TINTA = "#004f4f";
const ORO = "#b08d3f";

const Contacto = () => {
  const t = useT();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const id = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(id);
  }, []);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      {/* ── MANDALA + TÍTULO + FRASE (la misma cabecera de la portada) ── */}
      <WelcomeCabecera activo={mounted} titulo={t("contacto.titulo")} subtitulo={t("contacto.subtitulo")} mayusculas />

      {/* ── SOBRE EL MÁRMOL: mi foto a la izquierda y, a la derecha, las cuatro vías
          (llamada, escribirme, WhatsApp e Instagram). ── */}
      <Box flex="1">
        <BandaMarmol>
          {(visible) => (
            <Flex
              w="100%"
              maxW="1100px"
              mx="auto"
              px={{ base: 5, md: 10, lg: 16 }}
              direction={{ base: "column", md: "row" }}
              align="center"
              gap={{ base: 12, md: 14, lg: 20 }}
            >
              {/* La foto ENTERA, con un filo fino desplazado que la enmarca. */}
              <Reveal activo={visible} direction="right" distance={30} scaleFrom={0.94} duration={1} w={{ base: "250px", md: "300px", lg: "340px" }} flexShrink={0}>
                <Box position="relative">
                  <Box position="absolute" inset="-9px" borderRadius="30px" border={`1px solid ${TINTA}66`} pointerEvents="none" />
                  <Box borderRadius="22px" overflow="hidden" boxShadow={`0 0 22px ${ORO}55, 0 0 48px ${ORO}28`}>
                    <Image src="/img/me/asesoria.webp" alt="María Escribano" w="100%" h="auto" display="block" />
                  </Box>
                </Box>
              </Reveal>
              <Box flex="1" minW={0} w="100%">
                <ViasDeContacto onEscribir={() => navigate("/contacto/escribir")} activo={visible} />
              </Box>
            </Flex>
          )}
        </BandaMarmol>
      </Box>

      <SiteFooter />
    </Box>
  );
};

export default Contacto;
