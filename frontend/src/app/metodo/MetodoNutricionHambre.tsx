import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { NutricionLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceNutricion } from "../../components/metodo/IndiceNutricion";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import { glowSuave } from "../../components/metodo/FotoBox";
import { ComicIntegralModal } from "../../components/metodo/ComicIntegralModal";
import { HAMBRE_HOLISTICA, HAMBRE_CIERRE } from "../../components/metodo/hambreHolistica";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import type { Vineta } from "../../components/metodo/ComicViewer";
import { API_URL, nutricionBg, nutricionNom, nutricionTxt, NutricionIcon } from "../../GlobalVariables";

// ═════════════════════════════════════════════════════════════════════════
// Apartado «El hambre» del recorrido de Nutrición. Va ENTRE la Microbiota y el
// plato de Harvard. Contenido: «El hambre, una mirada holística» — 4 boxes tipo
// ilustración (foto a la izquierda + texto a la derecha con scroll vertical) y,
// al final, una frase directamente sobre el fondo turquesa (sin box).
// Los mismos 4 bloques (HAMBRE_HOLISTICA) se muestran también como un cómic en
// «Ilustraciones» de Nutrición.
// ═════════════════════════════════════════════════════════════════════════

const SCROLL_SX = {
  "&::-webkit-scrollbar": { width: "6px" },
  "&::-webkit-scrollbar-thumb": { background: `${nutricionTxt}55`, borderRadius: "3px" },
  "&::-webkit-scrollbar-track": { background: "transparent" },
  scrollbarWidth: "thin" as const,
  scrollbarColor: `${nutricionTxt}55 transparent`,
};

// Pinta un párrafo con soporte de **negrita** (misma emphasis que pidió la usuaria).
function renderNegrita(texto: string): React.ReactNode {
  return texto.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <Box as="span" key={i} fontWeight={700}>{p.slice(2, -2)}</Box>
    ) : (
      <React.Fragment key={i}>{p}</React.Fragment>
    ),
  );
}

// Placeholder mientras la foto no está subida (icono suave sobre fondo tenue).
function FotoPlaceholder() {
  return (
    <Flex direction="column" align="center" justify="center" gap={2} w="100%" h="100%"
          bg={`${nutricionTxt}12`} border={`1px dashed ${nutricionTxt}55`} borderRadius="lg">
      <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
           w={{ base: "34px", md: "40px" }} h={{ base: "34px", md: "40px" }} fill={`${nutricionTxt}88`}>
        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
      </Box>
    </Flex>
  );
}

// Box tipo ilustración: foto a la izquierda + texto a la derecha con su propio
// scroll vertical (idéntico al box de las ilustraciones / cómics de Nutrición).
function HambreBox({ v }: { v: Vineta }) {
  return (
    <Box position="relative" overflow="hidden" w="100%" borderRadius="2xl" boxShadow={glowSuave(nutricionTxt)}>
      <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" overlay={`${nutricionBg}55`} />

      {/* Líneas de luz arriba/abajo (como el visor de ilustraciones) */}
      <Box position="absolute" top="-1px" left="15%" right="15%" h="1px" zIndex={2}
           bgGradient={`linear(to-r, transparent, ${nutricionTxt}aa, transparent)`} />
      <Box position="absolute" bottom="-1px" left="15%" right="15%" h="1px" zIndex={2}
           bgGradient={`linear(to-r, transparent, ${nutricionTxt}aa, transparent)`} />

      <Flex position="relative" zIndex={1} direction={{ base: "column", md: "row" }}
            align={{ base: "center", md: "stretch" }} justify="center" gap={{ base: 5, md: 10 }}
            px={{ base: 5, md: 10 }} py={{ base: 6, md: 9 }} h={{ base: "auto", md: "440px" }}>

        {/* Foto (izquierda) */}
        <Box flexShrink={0} w={{ base: "100%", md: "400px" }} maxW={{ base: "320px", md: "400px" }}
             aspectRatio={1} alignSelf={{ base: "auto", md: "center" }} position="relative"
             filter={`drop-shadow(0 0 12px rgba(255,255,255,0.14)) drop-shadow(0 0 30px ${nutricionTxt}33)`}>
          <Image src={encodeURI(v.src)} alt={v.titulo ?? ""} w="100%" h="100%" objectFit="cover"
                 borderRadius="lg" fallback={<FotoPlaceholder />} />
        </Box>

        {/* Texto (derecha) con scroll propio */}
        <Box flex="1" minW={0} w={{ base: "100%", md: "auto" }} alignSelf={{ base: "auto", md: "stretch" }}
             display="flex" flexDirection="column" justifyContent="flex-start"
             maxH={{ base: "none", md: "100%" }} overflowY={{ base: "visible", md: "auto" }} overflowX="hidden"
             pr={{ base: 0, md: 3 }} sx={SCROLL_SX}>
          <Text color={nutricionTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight={700} lineHeight="1.25"
                mb={{ base: 4, md: 5 }} textAlign={{ base: "center", md: "left" }}>
            {v.titulo}
          </Text>
          {v.paragraphs.map((p, i) => (
            <Text key={i} color={nutricionTxt} textAlign={{ base: "center", md: "left" }}
                  fontSize={{ base: "2xl", md: "3xl" }} lineHeight="1.85" letterSpacing="0.01em"
                  fontWeight="400" mt={i === 0 ? 0 : { base: 4, md: 5 }}>
              {renderNegrita(p)}
            </Text>
          ))}
        </Box>
      </Flex>
    </Box>
  );
}

export default function MetodoNutricionHambre() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // Cómic de transición «Lo integral» (se abre al pulsar «Crea tu plato →»).
  const [comicIntegralOpen, setComicIntegralOpen] = useState(false);

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

        // No mostramos la página hasta que TODAS las fotos de los 4 boxes estén
        // descargadas: mientras, se ve la animación de Nutrición (no aparecen
        // de golpe ni sale un hueco vacío).
        await precargarImagenes(HAMBRE_HOLISTICA.map((v) => encodeURI(v.src)));
      } catch { navigate("/metodo/nutricion"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  if (loading) return <NutricionLoading />;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NutricionIcon size={{ base: "40px", md: "56px" }} />}
              title="El hambre"
              compact
              maxW="1000px"
              bgColor={`${nutricionBg}dd`}
              color={nutricionTxt}
              nom={nutricionNom}
              mb={0}
              prev={{ label: "← Microbiota", onClick: () => navigate("/metodo/nutricion/microbiota") }}
              extra={{ label: "Biblioteca", onClick: () => navigate("/metodo/nutricion/alimentos") }}
              next={{ label: "Crea tu plato →", onClick: () => setComicIntegralOpen(true) }}
            />
          </Reveal>

          <Reveal direction="up" distance={18} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} fontWeight={600}
                  textAlign="center" lineHeight="1.7" maxW="720px">
              El hambre: una mirada holística
            </Text>
          </Reveal>

          {/* 4 boxes tipo ilustración, uno debajo del otro */}
          {HAMBRE_HOLISTICA.map((v, i) => (
            <Reveal key={v.src} direction="up" distance={22} scaleFrom={0.98} delay={0.12 + i * 0.06}
                    duration={0.65} w="100%">
              <HambreBox v={v} />
            </Reveal>
          ))}

          {/* Frase de cierre, directamente sobre el fondo turquesa (sin box) */}
          <Reveal direction="up" distance={18} delay={0.2} duration={0.7} w="100%" display="flex" justifyContent="center">
            <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontStyle="italic" fontWeight="600"
                  textAlign="center" maxW="740px" lineHeight="1.7" mt={{ base: 2, md: 4 }}
                  style={{ textShadow: "0 1px 12px rgba(0,0,0,0.4)" }}>
              {HAMBRE_CIERRE}
            </Text>
          </Reveal>

        </Flex>
      </Flex>

      {/* Cómic de transición «Lo integral» hacia el plato de Harvard. */}
      <ComicIntegralModal
        isOpen={comicIntegralOpen}
        onClose={() => setComicIntegralOpen(false)}
        onContinue={() => navigate("/metodo/nutricion/plato")}
      />

      <IndiceNutricion />
      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />
      <SiteFooter />
    </Box>
  );
}
