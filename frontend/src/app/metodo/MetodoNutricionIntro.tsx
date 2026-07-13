import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { BotonCompania } from "../../components/global/BotonCompania";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import {
  API_URL,
  nutricionBg,
  nutricionNom,
  nutricionTxt,
  NutricionIcon,
} from "../../GlobalVariables";

// nutri.png es clara → velo oscuro + sombra oscura fija para que el texto blanco
// se lea sin depender del bg claro de la disciplina.
const INK_SHADOW = `0 1px 3px rgba(20,32,20,0.95), 0 0 8px rgba(20,32,20,0.8), 0 2px 16px rgba(20,32,20,0.55)`;
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,222,170,0.14), 0 0 20px ${nutricionTxt}1a`;

const PARRAFOS = [
  "En esta disciplina explorarás cómo eres lo que comes; para ser exactos, eres lo que absorbes.",
  "Descubrirás cómo las moléculas que componen tus alimentos están al servicio de tu reconstrucción o de tu destrucción.",
  "Aquí no hay juicios: ningún alimento es, por sí mismo, bueno o malo, pero sus moléculas sí pueden ser dañinas o beneficiosas.",
  "Comprenderás cómo las moléculas de tu comida se transforman, literalmente, en ti.",
];

export default function MetodoNutricionIntro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        let testEnabled = false;
        try {
          const t = await axios.get(`${API_URL}/payment/test/enabled`);
          testEnabled = !!t.data?.enabled;
        } catch { /* sin modo test */ }

        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!me.data?.nutricion_suscrito && !testEnabled) { navigate("/metodo/nutricion"); return; }
      } catch {
        navigate("/metodo/nutricion");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<NutricionIcon size={{ base: "40px", md: "56px" }} />}
            title="Introducción"
            compact
            bgColor={`${nutricionBg}dd`}
            color={nutricionTxt}
            nom={nutricionNom}
            mb={0}
            prev={{ label: "← Nutrición", onClick: () => navigate("/metodo/nutricion") }}
            next={{ label: "Nutrientes →", onClick: () => navigate("/metodo/nutricion/nutrientes") }}
          />
          </Reveal>

          <Reveal direction="up" distance={28} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%">
            <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
              <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" overlay="rgba(0,0,0,0.5)" />
              <Box position="relative" zIndex={1} px={{ base: 7, md: 12 }} pt={{ base: 8, md: 10 }} pb={{ base: 10, md: 14 }} textAlign="center">
                {PARRAFOS.map((p, i) => (
                  <Text
                    key={i}
                    color="white"
                    fontSize={{ base: "md", md: "lg" }}
                    lineHeight="1.95"
                    opacity={0.94}
                    maxW="620px"
                    mx="auto"
                    mb={i < PARRAFOS.length - 1 ? 5 : 0}
                    style={{ textShadow: INK_SHADOW }}
                  >
                    {p}
                  </Text>
                ))}
              </Box>
            </Box>
          </Reveal>
        </Flex>
      </Flex>

      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />

      <SiteFooter />
    </Box>
  );
}
