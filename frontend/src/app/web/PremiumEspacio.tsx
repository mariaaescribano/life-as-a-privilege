import React, { useEffect, useState } from "react";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import BandaMarmol from "../../components/global/BandaMarmol";
import { Reveal } from "../../components/global/Reveal";
import WelcomeCabecera from "../../components/welcome/WelcomeCabecera";
import { focoBlanco } from "../../components/global/foco";
import { LifeLoading } from "../../components/global/LifeLoading";
import { usePremiumAcceso } from "../../hooks/usePremiumAcceso";
import { useT } from "../../i18n";

/**
 * Espacio premium (/premium/espacio): el home de quien ya tiene el contenido premium.
 * La misma cabecera que /premium y, sobre el mármol, dos puertas: PODCASTS y REELS.
 * Solo entra quien tiene `premium_suscrito` (GET /user/me); el resto vuelve a /premium.
 * Una puerta sin `link` se ve apagada («Próximamente»).
 */
const TINTA = "#004f4f";
const ORO = "#b08d3f";

type Puerta = {
  clave: string;
  titulo: string;
  link: string;
  renderIcon: () => React.ReactNode;
};

/** Icono de PODCASTS: el micrófono. */
const IconoPodcasts = () => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="52px" height="52px" fill={TINTA}>
    <path d="M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35Zm0-240Zm-40 520v-123q-104-14-172-93t-68-184h80q0 83 58.500 141.500T480-320q83 0 141.500-58.500T680-520h80q0 105-68 184t-172 93v123h-80Zm40-360q17 0 28.500-11.500T520-520v-240q0-17-11.500-28.500T480-800q-17 0-28.500 11.500T440-760v240q0 17 11.500 28.500T480-480Z" />
  </Box>
);

/** Icono de REELS: la pantalla con el play (el mismo de la portada de disciplina). */
const IconoReels = () => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="52px" height="52px" fill={TINTA}>
    <path d="m380-300 280-180-280-180v360ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z" />
  </Box>
);

const PremiumEspacio = () => {
  const t = useT();
  const navigate = useNavigate();

  // La cabecera arranca un instante después de montar, para que se vea entrar.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const id = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(id);
  }, []);

  // Sin el acceso vigente no se entra: el hook pregunta fresco y, si no, manda a /premium.
  const pagado = usePremiumAcceso();

  const puertas: Puerta[] = [
    { clave: "podcasts", titulo: t("premium.espacio.podcasts"), link: "/premium/podcasts", renderIcon: IconoPodcasts },
    { clave: "reels", titulo: t("premium.espacio.reels"), link: "/premium/reels", renderIcon: IconoReels },
  ];

  if (!pagado) {
    return (
      <Box position="fixed" inset={0} bg="#008080">
        <LifeLoading variant="private" />
      </Box>
    );
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      <Box flex="1">
        {/* ── MANDALA + TITULAR + FRASE ── */}
        <WelcomeCabecera activo={mounted} titulo={t("premium.titulo")} subtitulo={t("premium.subtitulo")} mayusculas />

        {/* ── SOBRE EL MÁRMOL: LAS DOS PUERTAS ── */}
        <BandaMarmol mt={{ base: 2, md: 4 }}>
          {(visible) => (
            <Grid
              w="100%"
              maxW="900px"
              mx="auto"
              px={{ base: 5, md: 10 }}
              templateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))" }}
              gap={{ base: 6, md: 9 }}
            >
              {puertas.map((p, i) => {
                const apagada = !p.link;
                return (
                  <Reveal key={p.clave} activo={visible} direction="up" distance={24} scaleFrom={0.96} duration={0.8} delay={0.1 + i * 0.15} h="100%">
                    <Flex
                      as="button"
                      type="button"
                      onClick={apagada ? undefined : () => navigate(p.link)}
                      aria-disabled={apagada}
                      role="group"
                      w="100%"
                      h="100%"
                      direction="column"
                      align="center"
                      justify="center"
                      gap={{ base: 4, md: 5 }}
                      px={{ base: 6, md: 8 }}
                      py={{ base: 8, md: 12 }}
                      bg="transparent"
                      border={`1.5px solid ${TINTA}`}
                      borderRadius="3xl"
                      boxShadow={`0 0 20px ${ORO}2a, 0 0 44px ${ORO}14`}
                      cursor={apagada ? "default" : "pointer"}
                      opacity={apagada ? 0.7 : 1}
                      transition="transform 0.28s ease, background 0.28s ease"
                      _hover={apagada ? {} : { transform: "translateY(-3px)", bg: `${TINTA}14` }}
                      _focusVisible={focoBlanco}
                    >
                      <Box
                        w={{ base: "84px", md: "96px" }}
                        h={{ base: "84px", md: "96px" }}
                        borderRadius="full"
                        border={`1.5px solid ${TINTA}66`}
                        bg={`${TINTA}0d`}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        transition="transform 0.28s ease"
                        _groupHover={apagada ? {} : { transform: "scale(1.05)" }}
                        sx={{ "& svg": { width: "48px", height: "48px" } }}
                      >
                        {p.renderIcon()}
                      </Box>
                      <Text color={TINTA} fontWeight="700" fontSize={{ base: "xl", md: "2xl" }} letterSpacing="0.18em" textTransform="uppercase" lineHeight="1.25">
                        {p.titulo}
                      </Text>
                      {apagada && (
                        <Text color={TINTA} fontStyle="italic" fontSize={{ base: "md", md: "lg" }} letterSpacing="0.04em" mt={-2}>
                          {t("comun.proximamente")}
                        </Text>
                      )}
                    </Flex>
                  </Reveal>
                );
              })}
            </Grid>
          )}
        </BandaMarmol>
        {/* Hueco turquesa de la página entre el mármol y el pie. */}
        <Box h={{ base: "56px", md: "88px" }} />
      </Box>

      <SiteFooter />
    </Box>
  );
};

export default PremiumEspacio;
