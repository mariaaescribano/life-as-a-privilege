import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { BotonCompania } from "../../components/global/BotonCompania";
import { LineaTiempoCultura } from "../../components/metodo/LineaTiempoCultura";
import { IntroComicModal } from "../../components/metodo/IntroComicModal";
import { HISTORIA_UNIVERSAL_HITOS } from "../../components/metodo/culturaHistoriaUniversal";
import { Reveal } from "../../components/global/Reveal";
import { culturaBg, culturaNom, culturaTxt, CulturaIcon } from "../../GlobalVariables";

const INK_SHADOW = `0 1px 3px ${culturaBg}f5, 0 0 8px ${culturaBg}cc, 0 2px 16px ${culturaBg}88`;
const CULTURA_IMG = "/img/fondos/cultura.png";

export default function MetodoCulturaHistoriaUniversal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // Hito abierto (su cómic). null = ninguno.
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    setLoading(false);
  }, [navigate]);

  const activo = useMemo(
    () => HISTORIA_UNIVERSAL_HITOS.find((h) => h.key === activeKey) ?? null,
    [activeKey],
  );

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={8}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<CulturaIcon size={{ base: "40px", md: "56px" }} />}
              title="Historia Universal"
              compact
              maxW="1000px"
              bgColor={`${culturaBg}dd`}
              color={culturaTxt}
              nom={culturaNom}
              mb={0}
              prev={{ label: "← Las Historias", onClick: () => navigate("/metodo/cultura/historias") }}
            />
          </Reveal>

          {/* Introducción breve */}
          <Reveal direction="up" distance={18} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color={culturaTxt} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" textAlign="center"
                  lineHeight="1.8" maxW="620px" opacity={0.92} style={{ textShadow: INK_SHADOW }}>
              Recorre la línea del tiempo y pulsa cada etapa para descubrir su historia.
            </Text>
          </Reveal>

          {/* Línea de tiempo (centrada) */}
          <Reveal direction="up" distance={26} scaleFrom={0.98} delay={0.16} duration={0.75} w="100%"
                  display="flex" justifyContent="center" flex="1" alignItems="center">
            <LineaTiempoCultura
              hitos={HISTORIA_UNIVERSAL_HITOS}
              tinta={culturaTxt}
              bg={culturaBg}
              // Solo abrimos el cómic si el hito tiene viñetas (ahora las eras
              // no tienen cómic todavía; así no se abre un modal vacío).
              onSelect={(key) => {
                const hito = HISTORIA_UNIVERSAL_HITOS.find((h) => h.key === key);
                if (hito && hito.vinetas.length > 0) setActiveKey(key);
              }}
            />
          </Reveal>
        </Flex>
      </Flex>

      {/* Cómic del hito seleccionado, con el estilo de Cultura. */}
      <IntroComicModal
        isOpen={!!activo}
        vinetas={activo?.vinetas ?? []}
        onClose={() => setActiveKey(null)}
        themeColor={culturaTxt}
        textColor={culturaTxt}
        disciplinaBgImage={CULTURA_IMG}
        disciplinaBgColor={culturaBg}
      />

      <BotonCompania color={culturaTxt} bgColor={culturaBg} disciplinaNom={culturaNom} />

      <SiteFooter />
    </Box>
  );
}
