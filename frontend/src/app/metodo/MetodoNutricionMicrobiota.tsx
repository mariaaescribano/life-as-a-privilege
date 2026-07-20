import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceNutricion } from "../../components/metodo/IndiceNutricion";
import { Reveal } from "../../components/global/Reveal";
import { TarjetaNutri } from "../../components/metodo/TarjetaNutri";
import { NutrienteFichaModal } from "../../components/metodo/NutrienteFichaModal";
import { ComicHambreModal } from "../../components/metodo/ComicHambreModal";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { API_URL, nutricionBg, nutricionNom, nutricionTxt, NutricionIcon } from "../../GlobalVariables";
import { MICROBIOTA_BACTERIAS, MICROBIOTA_TARJETAS } from "../../hardCoded/espacio/MicrobiotaNutricion";

// ═════════════════════════════════════════════════════════════════════════
// Apartado «Microbiota» del recorrido de Nutrición. Se llega desde Los
// nutrientes (botón «Microbiota →» → cómic de transición → aquí). Primero las
// bacterias más conocidas de la microbiota; tras un separador con el mandala,
// las moléculas que fabrican. Cada tarjeta abre su ficha tipo cómic.
// ═════════════════════════════════════════════════════════════════════════
export default function MetodoNutricionMicrobiota() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [fichaIdx, setFichaIdx] = useState<number | null>(null);
  const [bacteriaIdx, setBacteriaIdx] = useState<number | null>(null);
  // Cómic de transición hacia «El hambre» (se abre al pulsar «El hambre →»).
  const [comicHambreOpen, setComicHambreOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        let testEnabled = false;
        try { const t = await axios.get(`${API_URL}/payment/test/enabled`); testEnabled = !!t.data?.enabled; } catch { /* */ }
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.nutricion_suscrito && !testEnabled) { navigate("/metodo/nutricion"); return; }

        // No mostramos la página hasta que TODAS las fotos de las tarjetas estén
        // descargadas: si no, se queda en el spinner (no aparecen de golpe).
        await precargarImagenes(
          [...MICROBIOTA_BACTERIAS, ...MICROBIOTA_TARJETAS].map((t) => encodeURI(t.foto)),
        );
      } catch { navigate("/metodo/nutricion"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NutricionIcon size={{ base: "40px", md: "56px" }} />}
              title="La microbiota"
              compact
              maxW="1000px"
              bgColor={`${nutricionBg}dd`}
              color={nutricionTxt}
              nom={nutricionNom}
              mb={0}
              prev={{ label: "← Nutrientes secundarios", onClick: () => navigate("/metodo/nutricion/nutrientes-secundarios") }}
              extra={{ label: "Biblioteca", onClick: () => navigate("/metodo/nutricion/alimentos") }}
              next={{ label: "El hambre →", onClick: () => setComicHambreOpen(true) }}
            />
          </Reveal>

          {/* ── Las bacterias más conocidas de tu microbiota ── */}
          <Reveal direction="up" distance={18} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="620px" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
              Algunas de las bacterias más conocidas que habitan tu intestino, cada una con su función.
            </Text>
          </Reveal>

          {/* Nota: qué es una bacteria (una sola célula… y sorprendentemente lista). */}
          <Reveal direction="up" distance={14} delay={0.13} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Box
              w="100%"
              maxW="680px"
              borderRadius="xl"
              px={{ base: 5, md: 7 }}
              py={{ base: 4, md: 5 }}
              bg={`${nutricionBg}55`}
              border={`1px solid ${nutricionTxt}44`}
              style={{ boxShadow: `inset 0 0 24px rgba(0,0,0,0.18), 0 0 18px ${nutricionTxt}18` }}
            >
              <Text color="rgba(255,255,255,0.94)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.9"
                    textAlign="center" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}>
                Cada bacteria es <b>una única célula</b>: sin órganos, sin cerebro. Y aun así es
                sorprendentemente <b style={{ color: nutricionTxt }}>inteligente</b> — percibe su entorno,
                se comunica con sus vecinas, decide cuándo dividirse o defenderse y coopera contigo.
                Toda una vida resuelta en una sola célula.
              </Text>
            </Box>
          </Reveal>

          <Reveal direction="up" distance={20} delay={0.16} duration={0.6} w="100%">
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 4, md: 6 }} w="100%">
              {MICROBIOTA_BACTERIAS.map((bac, i) => (
                <TarjetaNutri key={bac.key} titulo={bac.titulo} foto={bac.foto}
                              onClick={() => setBacteriaIdx(i)} />
              ))}
            </SimpleGrid>
          </Reveal>

          {/* ── Separador horizontal con el mandala en medio ── */}
          <Reveal direction="up" distance={12} delay={0.1} duration={0.6} w="100%">
            <Flex align="center" justify="center" gap={{ base: 4, md: 6 }} w="100%" py={{ base: 2, md: 3 }}>
              <Box flex="1" h="1px" bg={`linear-gradient(to right, transparent, ${nutricionTxt}bb)`} />
              <Image
                src="/img/icono/life.png"
                alt=""
                h={{ base: "44px", md: "56px" }}
                objectFit="contain"
                flexShrink={0}
                style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.5)) drop-shadow(0 0 24px rgba(180,255,245,0.28))" }}
              />
              <Box flex="1" h="1px" bg={`linear-gradient(to left, transparent, ${nutricionTxt}bb)`} />
            </Flex>
          </Reveal>

          {/* ── Las moléculas que fabrican ── */}
          <Reveal direction="up" distance={18} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="620px" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
              Tres de las moléculas más importantes que fabrican las bacterias de tu intestino.
            </Text>
          </Reveal>

          <Reveal direction="up" distance={20} delay={0.16} duration={0.6} w="100%">
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 4, md: 6 }} w="100%">
              {MICROBIOTA_TARJETAS.map((tar, i) => (
                <TarjetaNutri key={tar.key} titulo={tar.titulo} foto={tar.foto}
                              onClick={() => setFichaIdx(i)} />
              ))}
            </SimpleGrid>
          </Reveal>

        </Flex>
      </Flex>

      {/* Ficha tipo cómic de la bacteria seleccionada. */}
      {bacteriaIdx !== null && (
        <NutrienteFichaModal tarjetas={MICROBIOTA_BACTERIAS} index={bacteriaIdx}
                             onClose={() => setBacteriaIdx(null)} onSelect={setBacteriaIdx} />
      )}

      {/* Ficha tipo cómic de la molécula seleccionada. */}
      {fichaIdx !== null && (
        <NutrienteFichaModal tarjetas={MICROBIOTA_TARJETAS} index={fichaIdx}
                             onClose={() => setFichaIdx(null)} onSelect={setFichaIdx} />
      )}

      {/* Cómic de transición hacia «El hambre». */}
      <ComicHambreModal
        isOpen={comicHambreOpen}
        onClose={() => setComicHambreOpen(false)}
        onContinue={() => navigate("/metodo/nutricion/hambre")}
      />

      <IndiceNutricion />

      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />
      <SiteFooter />
    </Box>
  );
}
