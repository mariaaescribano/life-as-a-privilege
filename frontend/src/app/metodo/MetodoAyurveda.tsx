import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Flex, Text,
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { Reveal } from "../../components/global/Reveal";
import { PagoAyurvedaModal } from "../../components/metodo/PagoAyurvedaModal";
import { useIlustracionesAyurveda } from "../../components/metodo/IlustracionesAyurveda";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { BotonCompania } from "../../components/global/BotonCompania";
import {
  API_URL,
  ayurvedaBg,
  ayurvedaNom,
  ayurvedaTxt,
  AyurvedaIcon,
} from "../../GlobalVariables";

// Tinta cálida con halo crema para que se lea sobre el fondo de acuarela de
// Hinduismo (mismo lenguaje visual que el recorrido de Psicología).
const TINTA = ayurvedaTxt;
const PAPEL = "#fbf4e8";
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${ayurvedaBg}`;
const glowPanel = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${ayurvedaTxt}1a, 0 0 48px ${ayurvedaTxt}10`;

export default function MetodoAyurveda() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [suscrito, setSuscrito] = useState(false);
  const [pagoOpen, setPagoOpen] = useState(false);
  const [pagoLoading, setPagoLoading] = useState(false);
  const [pagoError, setPagoError] = useState<string | null>(null);
  const [testPagos, setTestPagos] = useState(false);
  const [avisoOpen, setAvisoOpen] = useState(false);
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesAyurveda();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    axios.get(`${API_URL}/payment/test/enabled`)
      .then((r) => setTestPagos(!!r.data?.enabled))
      .catch(() => setTestPagos(false));

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Prerrequisito: hay que haber pagado Psicología para llegar aquí.
        if (!me.data?.psicologia_suscrito) { navigate("/home"); return; }

        const ayurSuscrito = !!me.data?.ayurveda_suscrito;
        setSuscrito(ayurSuscrito);
        if (!ayurSuscrito) { setPagoOpen(true); return; }
      } catch {
        navigate("/home");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const pagarAyurveda = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    setPagoLoading(true);
    setPagoError(null);
    try {
      const res = await axios.post(
        `${API_URL}/payment/ayurveda/checkout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data?.url) { window.location.href = res.data.url; return; }
      setPagoError("No se pudo obtener la URL de pago. Inténtalo de nuevo.");
      setPagoLoading(false);
    } catch (err: any) {
      const status = err?.response?.status;
      setPagoError(
        status === 403
          ? "Necesitas completar el pago de Psicología antes de adquirir Ayurveda."
          : err?.response?.data?.message || err?.message || "Error desconocido",
      );
      setPagoLoading(false);
    }
  };

  const testUnlock = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    try {
      await axios.post(
        `${API_URL}/payment/test/unlock`,
        { scope: "ayurveda" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSuscrito(true);
      setPagoOpen(false);
    } catch (err: any) {
      setPagoError(err?.response?.data?.message || "No se pudo activar el modo test.");
    }
  };

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
            icon={<AyurvedaIcon size={{ base: "40px", md: "56px" }} />}
            title="Equilibra tu naturaleza"
            pageLabel="1/4"
            bgColor={`${ayurvedaBg}dd`}
            color={ayurvedaTxt}
            nom={ayurvedaNom}
            mb={0}
            prev={{ label: "← Compromiso", onClick: () => navigate("/metodo/psicologia/linea-de-vida/compromiso") }}
            extra={ilustracionesBtn}
            next={{
              label: "Test →",
              onClick: () => navigate("/metodo/ayurveda/test"),
            }}
          />
          </Reveal>

          {/* ── Intro contemplativa ── */}
          <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
          <Box
            position="relative"
            w="100%"
            borderRadius="2xl"
            overflow="hidden"
            boxShadow={glowPanel}
          >
            <DisciplinaBgLayer nom={ayurvedaNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 7, md: 12 }} pt={{ base: 6, md: 8 }} pb={{ base: 10, md: 14 }} textAlign="center">
              <Text
                color={TINTA}
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="1.85"
                opacity={1}
                maxW="600px"
                mx="auto"
              >
                El Ayurveda enseña que cada persona nace con una constitución única —su dosha— y que la salud es el equilibrio de esa naturaleza. Esta tercera etapa de El Recorrido es para reconocer tu constitución, entender tus desequilibrios y aprender a vivir en armonía contigo mismo.
              </Text>
            </Box>
          </Box>
          </Reveal>

          {/* ── Disparador del aviso ── */}
          <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%" display="flex" justifyContent="center">
          <Box
            as="button"
            onClick={() => setAvisoOpen(true)}
            display="inline-flex"
            alignItems="center"
            gap={2}
            px={6}
            py={2.5}
            borderRadius="full"
            bg="rgba(255,255,255,0.08)"
            border="1px solid rgba(255,255,255,0.4)"
            color="rgba(255,255,255,0.92)"
            fontFamily="'EB Garamond', serif"
            fontWeight="600"
            fontSize={{ base: "sm", md: "md" }}
            letterSpacing="0.04em"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ bg: "rgba(255,255,255,0.16)", transform: "translateY(-1px)" }}
          >
            <Box as="span" fontSize="md">⚠</Box> Aviso importante
          </Box>
          </Reveal>
        </Flex>
      </Flex>

      <BotonCompania color={ayurvedaTxt} bgColor={ayurvedaBg} disciplinaNom={ayurvedaNom} precio={20} llamadaTitulo="Reserva tu llamada" />

      <SiteFooter />

      <PagoAyurvedaModal
        isOpen={pagoOpen && !suscrito}
        onClose={() => { setPagoOpen(false); navigate("/home"); }}
        onPagar={pagarAyurveda}
        loading={pagoLoading}
        error={pagoError}
        onTest={testPagos ? testUnlock : undefined}
      />

      {ilustracionesModal}

      {/* ── Aviso importante (popup centrado, estilo acuarela) ── */}
      <Modal isOpen={avisoOpen} onClose={() => setAvisoOpen(false)} isCentered scrollBehavior="inside" size={{ base: "sm", md: "lg" }}>
        <ModalOverlay bg="rgba(0,0,0,0.82)" sx={{ backdropFilter: "blur(6px)" }} />
        <ModalContent bg="transparent" boxShadow="none" overflow="visible" mx={4} fontFamily="'EB Garamond', serif">
          <Box position="relative" borderRadius="2xl" overflow="hidden" boxShadow={`0 26px 70px rgba(40,18,4,0.55)`}>
            <DisciplinaBgLayer nom={ayurvedaNom} borderRadius="2xl" />
            <ModalCloseButton color={TINTA} zIndex={3} />
            <ModalBody position="relative" zIndex={1} px={{ base: 6, md: 9 }} py={{ base: 8, md: 10 }}>
              <Flex direction="column" gap={4}>
                <Flex align="center" justify="center" gap={2.5}>
                  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="28px" h="28px" fill={TINTA} flexShrink={0}
                       style={{ filter: `drop-shadow(0 1px 2px ${PAPEL}) drop-shadow(0 0 6px ${PAPEL})` }}>
                    <path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z" />
                  </Box>
                  <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.04em"
                        style={{ textShadow: INK_SHADOW }}>
                    Importante
                  </Text>
                </Flex>
                <Box h="1px" w="55%" maxW="220px" mx="auto" bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />
                <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="700" lineHeight="1.75"
                      style={{ textShadow: INK_SHADOW }}>
                  El Ayurveda es un saber milenario de autoconocimiento, no un sustituto de la medicina.
                </Text>
                <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" opacity={0.92}
                      style={{ textShadow: INK_SHADOW }}>
                  Su propósito en El Recorrido es ayudarte a observar tu constitución y tus hábitos, y a cuidarte con más conciencia día a día.
                </Text>
                <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" opacity={0.92}
                      style={{ textShadow: INK_SHADOW }}>
                  Ante cualquier síntoma o problema de salud, consulta siempre con un profesional sanitario.
                </Text>
              </Flex>
            </ModalBody>
          </Box>
        </ModalContent>
      </Modal>
    </Box>
  );
}
