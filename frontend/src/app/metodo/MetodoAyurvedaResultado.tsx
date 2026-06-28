import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesAyurveda } from "../../components/metodo/IlustracionesAyurveda";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import {
  API_URL,
  AyurvedaIcon, ayurvedaBg, ayurvedaNom, ayurvedaTxt,
  VataIcon, PittaIcon, KaphaIcon,
  vataColor, pittaColor, kaphaColor,
} from "../../GlobalVariables";
import { preguntasAyurveda } from "../../hardCoded/espacio/PreguntasAyurveda";

type Dosha = "vata" | "pitta" | "kapha";
const GLOW = "0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)";

const DOSHA_CONFIG: Record<Dosha, { label: string; color: string; Icon: any }> = {
  vata:  { label: "Vata",  color: vataColor,  Icon: VataIcon },
  pitta: { label: "Pitta", color: pittaColor, Icon: PittaIcon },
  kapha: { label: "Kapha", color: kaphaColor, Icon: KaphaIcon },
};
const DOSHAS: Dosha[] = ["vata", "pitta", "kapha"];

interface Resultado {
  dosha: Dosha;
  vata_score: number;
  pitta_score: number;
  kapha_score: number;
  fecha: string;
}

export default function MetodoAyurvedaResultado() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesAyurveda();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!me.data?.ayurveda_suscrito) { navigate("/metodo/ayurveda"); return; }

        // Lee el resultado del test ya guardado. Si aún no hizo el test, al test.
        const res = await axios.get(`${API_URL}/ayurveda/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.data) { navigate("/metodo/ayurveda/test"); return; }
        setResultado(res.data as Resultado);
      } catch {
        navigate("/metodo/ayurveda/test");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading || !resultado) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  const total = preguntasAyurveda.length;
  const scores: Record<Dosha, number> = {
    vata: resultado.vata_score,
    pitta: resultado.pitta_score,
    kapha: resultado.kapha_score,
  };
  const cfg = DOSHA_CONFIG[resultado.dosha];
  const PrincipalIcon = cfg.Icon;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box flex="1">
        <Flex
          direction="column"
          alignItems="center"
          gap={{ base: 4, md: 5 }}
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 8, md: 12 }}
          pb={{ base: 14, md: 20 }}
        >
          <MetodoStepHeader
            icon={<AyurvedaIcon size={{ base: "40px", md: "56px" }} />}
            title="Tu resultado"
            pageLabel="3/—"
            bgColor={`${ayurvedaBg}dd`}
            color={ayurvedaTxt}
            nom={ayurvedaNom}
            mb={0}
            prev={{ label: "← Repetir test", onClick: () => navigate("/metodo/ayurveda/test") }}
            extra={ilustracionesBtn}
            next={{ label: "Continuar →", onClick: () => navigate("/metodo/ayurveda/tarjetas") }}
          />

          {/* Resultado principal — solo el resultado, sin consejos */}
          <Box
            position="relative"
            overflow="hidden"
            w="100%" maxW="850px"
            border={`2px solid ${cfg.color}55`}
            borderRadius="2xl"
            boxShadow={GLOW}
            textAlign="center"
            mt={{ base: 2, md: 4 }}
          >
            <DisciplinaBgLayer nom={ayurvedaNom} borderRadius="2xl" overlay={`${ayurvedaBg}22`} />
            <Box position="relative" zIndex={1} px={{ base: 5, md: 8 }} py={{ base: 6, md: 8 }}>
              <Text color={ayurvedaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.15em" textTransform="uppercase" mb={4}>
                Tu Dosha principal es
              </Text>
              <Flex align="center" justify="center" gap={3} mb={6}>
                <PrincipalIcon size="38px" color={cfg.color} />
                <Text color={cfg.color} fontSize={{ base: "4xl", md: "5xl" }} fontWeight="700" letterSpacing="0.1em" fontStyle="italic">
                  {cfg.label}
                </Text>
              </Flex>

              {/* Barras de puntuación */}
              {DOSHAS.map((d) => {
                const pct = total > 0 ? Math.round((scores[d] / total) * 100) : 0;
                const dc = DOSHA_CONFIG[d];
                return (
                  <Box key={d} mb={3} textAlign="left">
                    <Flex justify="space-between" mb={1}>
                      <Text color={dc.color} fontWeight="600" fontSize="md">{dc.label}</Text>
                      <Text color={dc.color} fontWeight="600" fontSize="md">{scores[d]} / {total}</Text>
                    </Flex>
                    <Box bg={`${dc.color}22`} borderRadius="full" h="8px" overflow="hidden">
                      <Box bg={dc.color} h="100%" borderRadius="full" w={`${pct}%`} transition="width 0.6s ease" />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Nota breve, sin consejos todavía */}
          <Text
            color="rgba(255,255,255,0.75)"
            fontSize={{ base: "sm", md: "md" }}
            fontStyle="italic"
            textAlign="center"
            maxW="620px"
            lineHeight="1.7"
            mt={1}
          >
            Esta es tu constitución según el test. En los siguientes pasos del Recorrido iremos descubriendo qué significa para ti.
          </Text>
        </Flex>
      </Box>

      {ilustracionesModal}

      <SiteFooter />
    </Box>
  );
}
