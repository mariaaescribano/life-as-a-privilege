import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
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
import { API_URL, nutricionBg, nutricionNom, nutricionTxt, NutricionIcon } from "../../GlobalVariables";
import { MICROBIOTA_TARJETAS } from "../../hardCoded/espacio/MicrobiotaNutricion";

// ═════════════════════════════════════════════════════════════════════════
// Apartado «Microbiota» del recorrido de Nutrición. Se llega desde Los
// nutrientes (botón «Microbiota →» → cómic de transición → aquí). Muestra 3
// tarjetas (glutamato, acetato, butirato); cada una abre su ficha tipo cómic.
// ═════════════════════════════════════════════════════════════════════════
export default function MetodoNutricionMicrobiota() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [fichaIdx, setFichaIdx] = useState<number | null>(null);

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
              next={{ label: "Crea tu plato →", onClick: () => navigate("/metodo/nutricion/plato") }}
            />
          </Reveal>

          <Reveal direction="up" distance={18} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="620px" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
              Tres de las moléculas que fabrican las bacterias de tu intestino. Toca cada una para descubrir qué hacen por ti.
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

      {/* Ficha tipo cómic de la molécula seleccionada. */}
      {fichaIdx !== null && (
        <NutrienteFichaModal tarjetas={MICROBIOTA_TARJETAS} index={fichaIdx}
                             onClose={() => setFichaIdx(null)} onSelect={setFichaIdx} />
      )}

      <IndiceNutricion />

      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />
      <SiteFooter />
    </Box>
  );
}
