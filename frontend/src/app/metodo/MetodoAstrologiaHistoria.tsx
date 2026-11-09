import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { IndiceAstrologia } from "../../components/metodo/IndiceAstrologia";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { FotoBox } from "../../components/metodo/FotoBox";
import { IntroComicModal } from "../../components/metodo/IntroComicModal";
import { ReelInmersivo } from "../../components/metodo/VideoMateriaModal";
import { SPACE_IMG } from "../../components/metodo/SpaceBg";
import { HISTORIA_ASTROLOGIA } from "../../components/metodo/comicHistoriaAstrologia";
import { REELS_ASTROLOGIA } from "../../hardCoded/metodo/reelsAstrologia";
import { useComic } from "../../i18n/comics";
import { Reveal } from "../../components/global/Reveal";
import { useAstrologiaProgreso } from "../../hooks/useAstrologiaProgreso";
import { esMariaMirando } from "../../api/persona";
import { astrologiaBg, astrologiaNom, astrologiaTxt, AstrologiaIcon } from "../../GlobalVariables";
import { useT } from "../../i18n";

/**
 * Paso 2 del recorrido de Astrología: la Historia. UNA caja del camino con las dos
 * formas de ver lo mismo: el cómic (siempre) y el reel (cuando tenga enlace en
 * hardCoded/metodo/reelsAstrologia.ts; sin enlace, esa tarjeta no sale).
 */
export default function MetodoAstrologiaHistoria() {
  const t = useT();
  const navigate = useNavigate();
  const vinetas = useComic("astrologia-historia", HISTORIA_ASTROLOGIA);
  const [comicOpen, setComicOpen] = useState(false);
  const [reelOpen, setReelOpen] = useState(false);
  const { bloqueada, cargado } = useAstrologiaProgreso();
  const reel = REELS_ASTROLOGIA.historia;

  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, []);

  // «Siguiente» cerrado hasta que María abra el paso 3 (ella entra siempre).
  const siguienteCerrado = !esMariaMirando() && cargado && bloqueada(2);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 28, md: 36 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={{ base: 8, md: 10 }}>
          <Reveal direction="down" distance={16} duration={0.6} w="100%">
            <MetodoStepHeader
              icon={<AstrologiaIcon size={{ base: "40px", md: "52px" }} />}
              title={t("metodo.astro.paso.historia")}
              bgColor={`${astrologiaBg}dd`}
              color={astrologiaTxt}
              space
              step={{ current: 1, total: 12 }}
              mb={0}
              next={{
                label: `${t("metodo.astro.paso.explicacion")} →`,
                onClick: () => navigate("/metodo/astrologia/explicacion"),
                disabled: siguienteCerrado,
              }}
            />
          </Reveal>

          {/* Fuera de las cajas: blanco y sin sombra. */}
          <Reveal direction="up" distance={18} delay={0.4} duration={1} blur w="100%" maxW="680px">
            <Text color="white" fontSize={{ base: "lg", md: "xl" }} lineHeight="1.8" textAlign="center" fontStyle="italic">
              {t("metodo.astro.historia.intro")}
            </Text>
          </Reveal>

          {/* Con reel: dos tarjetas lado a lado. Sin reel: el cómic solo, centrado. */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 6, md: 8 }} w="100%" maxW="720px">
            <Reveal inView direction="up" distance={30} scaleFrom={0.95} delay={0.5} duration={0.9}>
              <Box h="100%">
                <FotoBox
                  titulo={t("metodo.astro.historia.leer")}
                  foto={vinetas[0]?.src}
                  nom={astrologiaNom}
                  tinta={astrologiaTxt}
                  bg={astrologiaBg}
                  aspect={1}
                  onClick={() => setComicOpen(true)}
                  vivo
                />
              </Box>
            </Reveal>
            {/* Las dos opciones salen siempre. Sin enlace de reel aún, la tarjeta queda
                apagada y no hace nada. */}
            <Reveal inView direction="up" distance={30} scaleFrom={0.95} delay={0.68} duration={0.9}>
              <Box h="100%" opacity={reel ? 1 : 0.55} cursor={reel ? "pointer" : "not-allowed"}>
                <FotoBox
                  titulo={t("metodo.astro.historia.reel")}
                  foto={vinetas[0]?.src}
                  nom={astrologiaNom}
                  tinta={astrologiaTxt}
                  bg={astrologiaBg}
                  aspect={1}
                  onClick={reel ? () => setReelOpen(true) : undefined}
                  vivo={!!reel}
                />
              </Box>
            </Reveal>
          </SimpleGrid>
        </Flex>
      </Flex>

      <IntroComicModal
        isOpen={comicOpen}
        vinetas={vinetas}
        onClose={() => setComicOpen(false)}
        onComplete={() => setComicOpen(false)}
      />
      {reelOpen && reel && <ReelInmersivo url={reel} fondo={SPACE_IMG} onClose={() => setReelOpen(false)} />}

      <IndiceAstrologia />
      <SiteFooter />
    </Box>
  );
}
