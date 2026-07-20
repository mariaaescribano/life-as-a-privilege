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
import { BotonCompania } from "../../components/global/BotonCompania";
import AyurvedaTestPage from "../../components/espacio/components/AyurvedaTestPage";
import {
  API_URL,
  AyurvedaIcon, ayurvedaBg, ayurvedaNom, ayurvedaTxt,
  vataColor, pittaColor, kaphaColor,
} from "../../GlobalVariables";

type Dosha = "vata" | "pitta" | "kapha";
const DOSHA_LABEL: Record<Dosha, { label: string; color: string }> = {
  vata:  { label: "Vata",  color: vataColor },
  pitta: { label: "Pitta", color: pittaColor },
  kapha: { label: "Kapha", color: kaphaColor },
};
const TINTA = ayurvedaTxt;
const PAPEL = "#fbf4e8";
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${ayurvedaBg}`;

// 1ª etapa del recorrido de Ayurveda: el test de los doshas. Reutiliza el
// componente del test (que ya guarda el resultado en la tabla `ayurveda` vía
// POST /ayurveda/resultado) y, al terminar, lleva a la página de resultado.
export default function MetodoAyurvedaTest() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // ¿El backend ya conoce tu dosha? Hasta entonces, el botón "Resultado →" del
  // header queda bloqueado (solo se puede avanzar tras completar el test).
  const [doshaGuardada, setDoshaGuardada] = useState<Dosha | null>(null);
  // Si el usuario ya tiene resultado, mostramos un aviso en vez de las preguntas;
  // "Repetir el test" pone esto en true para volver a verlas.
  const [repetir, setRepetir] = useState(false);
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
        // Solo accesible si ya se pagó Ayurveda; si no, de vuelta a la entrada
        // (que abre el pago). El prerrequisito de Psicología ya lo cubre la entrada.
        if (!me.data?.ayurveda_suscrito) { navigate("/metodo/ayurveda"); return; }

        // ¿Ya hizo el test antes? Entonces mostramos el aviso "ya hiciste el test".
        try {
          const r = await axios.get(`${API_URL}/ayurveda/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const d = r.data?.dosha as Dosha | undefined;
          if (d && DOSHA_LABEL[d]) setDoshaGuardada(d);
        } catch { /* sin resultado todavía */ }
      } catch {
        navigate("/metodo/ayurveda");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  // Ya tiene dosha y no ha pedido repetir → aviso.
  if (doshaGuardada && !repetir) {
    const cfg = DOSHA_LABEL[doshaGuardada];
    return (
      <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
        <SiteHeader variant="private" />
        <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
          <Flex direction="column" align="center" w="100%" maxW="760px" gap={{ base: 6, md: 7 }}>
            <MetodoStepHeader
              icon={<AyurvedaIcon size={{ base: "40px", md: "56px" }} />}
              title="Test de los Doṣhas"
              pageLabel="2/4"
              bgColor={`${ayurvedaBg}dd`}
              color={ayurvedaTxt}
              nom={ayurvedaNom}
              mb={0}
              prev={{ label: "← Equilibra", onClick: () => navigate("/metodo/ayurveda") }}
              extra={ilustracionesBtn}
              next={{ label: "Resultado →", onClick: () => navigate("/metodo/ayurveda/resultado") }}
            />

            <Box
              position="relative"
              w="100%"
              borderRadius="2xl"
              overflow="hidden"
              boxShadow={`0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${ayurvedaTxt}1a, 0 0 48px ${ayurvedaTxt}10`}
            >
              <DisciplinaBgLayer nom={ayurvedaNom} borderRadius="2xl" overlay={`${ayurvedaBg}22`} />
              <Flex position="relative" zIndex={1} direction="column" align="center" textAlign="center"
                    px={{ base: 7, md: 12 }} py={{ base: 10, md: 14 }} gap={5}>
                <Flex
                  align="center" justify="center"
                  w={{ base: "72px", md: "84px" }} h={{ base: "72px", md: "84px" }}
                  borderRadius="full"
                  bg={`${ayurvedaTxt}14`}
                  border={`2px solid ${ayurvedaTxt}`}
                  boxShadow={`0 0 0 6px ${ayurvedaTxt}12, 0 0 24px ${ayurvedaTxt}44, inset 0 0 16px ${ayurvedaTxt}10`}
                >
                  <Box as="svg" viewBox="0 0 24 24" w={{ base: "36px", md: "42px" }} h={{ base: "36px", md: "42px" }}
                       fill="none" stroke={ayurvedaTxt} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"
                       style={{ filter: `drop-shadow(0 1px 1px ${PAPEL})` }}>
                    <polyline points="20 6 9 17 4 12" />
                  </Box>
                </Flex>
                <Text color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1.25"
                      style={{ textShadow: INK_SHADOW }}>
                  Ya hiciste el test
                </Text>
                <Text color={`${TINTA}d0`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" maxW="520px">
                  Tu Doṣha ya está calculada:{" "}
                  <Box as="span" fontWeight="700" color={cfg.color}>{cfg.label}</Box>.
                  Puedes ver tu resultado o repetir el test si quieres volver a calcularla.
                </Text>

                <Flex gap={4} wrap="wrap" justify="center" mt={2}>
                  <Box
                    as="button"
                    onClick={() => navigate("/metodo/ayurveda/resultado")}
                    px={9} py={3} borderRadius="full"
                    bg={ayurvedaTxt} color="#fff"
                    fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "md", md: "lg" }}
                    letterSpacing="0.05em" cursor="pointer"
                    boxShadow={`0 4px 18px rgba(0,0,0,0.25), 0 0 18px ${ayurvedaTxt}55`}
                    transition="all 0.2s" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.35)" }}
                    _hover={{ transform: "translateY(-2px)" }}
                  >
                    Ver mi resultado →
                  </Box>
                  <Box
                    as="button"
                    onClick={() => setRepetir(true)}
                    px={8} py={3} borderRadius="full"
                    bg="transparent" color={TINTA}
                    border={`1.5px solid ${ayurvedaTxt}88`}
                    fontFamily="'EB Garamond', serif" fontWeight="600" fontSize={{ base: "md", md: "lg" }}
                    letterSpacing="0.05em" cursor="pointer"
                    transition="all 0.2s"
                    _hover={{ transform: "translateY(-2px)", borderColor: ayurvedaTxt, bg: "rgba(255,251,243,0.35)" }}
                  >
                    Repetir el test
                  </Box>
                </Flex>
              </Flex>
            </Box>
          </Flex>
        </Flex>
        {ilustracionesModal}
        <BotonCompania color={ayurvedaTxt} bgColor={ayurvedaBg} disciplinaNom={ayurvedaNom} precio={20} llamadaTitulo="Reserva tu llamada" />
        <SiteFooter />
      </Box>
    );
  }

  return (
    <>
      <AyurvedaTestPage
        prevTo="/metodo/ayurveda"
        prevLabel="← Equilibra"
        pageLabel="2/4"
        onComplete={async () => { navigate("/metodo/ayurveda/resultado"); }}
        headerNext={doshaGuardada
          ? { label: "Resultado →", onClick: () => navigate("/metodo/ayurveda/resultado") }
          : { label: "Resultado →", onClick: () => {}, disabled: true, disabledTooltip: "Completa el test para ver tu resultado." }}
      />
      <BotonCompania color={ayurvedaTxt} bgColor={ayurvedaBg} disciplinaNom={ayurvedaNom} precio={20} llamadaTitulo="Reserva tu llamada" />
    </>
  );
}
