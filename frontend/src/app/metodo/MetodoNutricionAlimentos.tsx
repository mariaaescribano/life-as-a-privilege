import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text, SimpleGrid } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceNutricion } from "../../components/metodo/IndiceNutricion";
import { Reveal, Float } from "../../components/global/Reveal";
import { NutricionIlustracionesModal } from "../../components/metodo/NutricionIlustracionesModal";
import { NutricionMaterialesModal } from "../../components/metodo/NutricionMaterialesModal";
import { NutrienteFichaModal } from "../../components/metodo/NutrienteFichaModal";
import { glowSuave, glowSuaveHover } from "../../components/metodo/FotoBox";
import { MITOS_NUTRICION } from "../../hardCoded/espacio/MitosNutricion";
import { API_URL, nutricionBg, nutricionNom, nutricionTxt, NutricionIcon } from "../../GlobalVariables";

// ═════════════════════════════════════════════════════════════════════════
// BIBLIOTECA DE NUTRICIÓN. Es el hub que se abre desde el botón «Biblioteca» de
// cualquier página del recorrido. Un título y TRES caminos:
//   · ALIMENTACIÓN MOLECULAR → rejilla de alimentos (con foto); al pulsar uno,
//     su desglose molecular (NutricionMaterialesModal).
//   · ILUSTRACIONES          → galería con TODOS los cómics de Nutrición
//     (NutricionIlustracionesModal); al pulsar uno, su visor.
//   · RESPUESTAS             → los mitos, un box por mito, navegable con las
//     flechas (mismo visor de Ilustraciones, sobre MITOS_NUTRICION).
// ═════════════════════════════════════════════════════════════════════════

// Una de las tres cartas del hub: icono grande + título + «Ver →».
function BibliotecaCard({
  titulo, subtitulo, icono, onClick, delay,
}: {
  titulo: string;
  subtitulo: string;
  icono: React.ReactNode;
  onClick: () => void;
  delay: number;
}) {
  return (
    <Reveal direction="up" distance={22} delay={delay} duration={0.55} w="100%" display="flex">
      <Box
        as="button"
        onClick={onClick}
        position="relative"
        overflow="hidden"
        w="100%"
        h="100%"
        borderRadius="2xl"
        cursor="pointer"
        fontFamily="'EB Garamond', serif"
        boxShadow={glowSuave(nutricionTxt)}
        transition="all 0.2s ease"
        _hover={{ transform: "translateY(-4px)", boxShadow: glowSuaveHover(nutricionTxt) }}
        _active={{ transform: "translateY(-1px)" }}
      >
        <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" overlay={`${nutricionBg}c4`} />

        <Flex position="relative" zIndex={1} direction="column" align="center" justify="center"
              gap={{ base: 3, md: 3.5 }} px={{ base: 6, md: 7 }} py={{ base: 8, md: 10 }} h="100%" textAlign="center">
          <Float amplitude={6} duration={4.5} delay={delay * 4} flexShrink={0}>
            <Flex align="center" justify="center"
                  w={{ base: "66px", md: "78px" }} h={{ base: "66px", md: "78px" }} borderRadius="full"
                  bg={`${nutricionTxt}14`} border={`1px solid ${nutricionTxt}33`} color={nutricionTxt}
                  boxShadow={`inset 0 0 12px ${nutricionTxt}12`}>
              {icono}
            </Flex>
          </Float>
          <Text color={nutricionTxt} fontWeight={800} fontSize={{ base: "md", md: "lg" }} lineHeight="1.2"
                letterSpacing="0.06em" textTransform="uppercase">
            {titulo}
          </Text>
          <Text color={`${nutricionTxt}cc`} fontSize={{ base: "xs", md: "sm" }} fontStyle="italic"
                lineHeight="1.45" maxW="240px">
            {subtitulo}
          </Text>
          <Flex align="center" gap={1} color={nutricionTxt} mt={0.5}
                fontSize="2xs" letterSpacing="0.16em" textTransform="uppercase">
            <Text as="span">Ver</Text>
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="12px" h="12px" fill="currentColor">
              <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
            </Box>
          </Flex>
        </Flex>
      </Box>
    </Reveal>
  );
}

// Iconos de cada carta (Material Symbols).
const IconoMolecular = (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={{ base: "34px", md: "40px" }} h={{ base: "34px", md: "40px" }} fill="currentColor">
    <path d="M440-120v-240h80v80h320v80H520v80h-80Zm-320-80v-80h240v80H120Zm160-160v-80H120v-80h160v-80h80v240h-80Zm160-80v-80h400v80H440Zm160-160v-240h80v80h160v80H680v80h-80Zm-480-80v-80h400v80H120Z" />
  </Box>
);
const IconoIlustraciones = (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={{ base: "34px", md: "40px" }} h={{ base: "34px", md: "40px" }} fill="currentColor">
    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
  </Box>
);
const IconoRespuestas = (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={{ base: "34px", md: "40px" }} h={{ base: "34px", md: "40px" }} fill="currentColor">
    <path d="M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
  </Box>
);

// ═════════════════════════════════════════════════════════════════════════
export default function MetodoNutricionAlimentos() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [molecularOpen, setMolecularOpen] = useState(false);   // alimentos + desglose
  const [ilustracionesOpen, setIlustracionesOpen] = useState(false); // galería de cómics
  const [respuestasOpen, setRespuestasOpen] = useState(false); // mitos (un box por mito)

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
      } catch { navigate("/metodo/nutricion"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="960px" gap={{ base: 6, md: 8 }}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NutricionIcon size={{ base: "40px", md: "56px" }} />}
              title="Biblioteca de Nutrición"
              compact
              maxW="960px"
              bgColor={`${nutricionBg}dd`}
              color={nutricionTxt}
              nom={nutricionNom}
              mb={0}
              prev={{ label: "← Volver", onClick: () => navigate(-1) }}
            />
          </Reveal>

          <Reveal direction="up" distance={18} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="620px" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
              Todo lo que has descubierto en Nutrición, reunido en un mismo sitio. Elige por dónde entrar.
            </Text>
          </Reveal>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, md: 6 }} w="100%">
            <BibliotecaCard
              titulo="Alimentación molecular"
              subtitulo="Elige un alimento y descubre de qué moléculas está hecho."
              icono={IconoMolecular}
              onClick={() => setMolecularOpen(true)}
              delay={0.06}
            />
            <BibliotecaCard
              titulo="Ilustraciones"
              subtitulo="Todos los cómics de Nutrición reunidos para releerlos."
              icono={IconoIlustraciones}
              onClick={() => setIlustracionesOpen(true)}
              delay={0.12}
            />
            <BibliotecaCard
              titulo="Respuestas"
              subtitulo="Las preguntas y mitos más frecuentes, uno a uno."
              icono={IconoRespuestas}
              onClick={() => setRespuestasOpen(true)}
              delay={0.18}
            />
          </SimpleGrid>

        </Flex>
      </Flex>

      {/* ALIMENTACIÓN MOLECULAR: rejilla de alimentos (con foto) + desglose. */}
      <NutricionMaterialesModal isOpen={molecularOpen} onClose={() => setMolecularOpen(false)} />

      {/* ILUSTRACIONES: galería con TODOS los cómics de Nutrición. */}
      <NutricionIlustracionesModal isOpen={ilustracionesOpen} onClose={() => setIlustracionesOpen(false)} />

      {/* RESPUESTAS: los mitos, un box por mito, navegable con las flechas. */}
      {respuestasOpen && (
        <NutrienteFichaModal tarjetas={MITOS_NUTRICION} index={0} onClose={() => setRespuestasOpen(false)} />
      )}

      <IndiceNutricion />

      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />
      <SiteFooter />
    </Box>
  );
}
