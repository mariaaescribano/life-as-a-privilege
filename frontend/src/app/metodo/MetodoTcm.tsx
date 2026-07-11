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
import { PagoTcmModal } from "../../components/metodo/PagoTcmModal";
import { useIlustracionesTcm } from "../../components/metodo/IlustracionesTcm";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceTcm } from "../../components/metodo/IndiceTcm";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { API_URL, tcmBg, tcmNom, tcmTxt, TCMIcon } from "../../GlobalVariables";

// Tinta rojiza clara con halo oscuro (granate) para leer sobre el fondo de TCM.
const TINTA = tcmTxt;
const INK_SHADOW = `0 1px 3px ${tcmBg}f5, 0 0 8px ${tcmBg}cc, 0 2px 16px ${tcmBg}88`;
// Mismo glow ligero que el header (MetodoStepHeader, rama con fondo de disciplina),
// para que todos los boxes queden uniformes.
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${tcmTxt}1a, 0 0 48px ${tcmTxt}10`;

export default function MetodoTcm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [suscrito, setSuscrito] = useState(false);
  const [pagoOpen, setPagoOpen] = useState(false);
  const [pagoLoading, setPagoLoading] = useState(false);
  const [pagoError, setPagoError] = useState<string | null>(null);
  const [testPagos, setTestPagos] = useState(false);
  const [avisoOpen, setAvisoOpen] = useState(false);
  // Al volver a Ayurveda, aterrizamos en su ÚLTIMA página (la de cursos del
  // dosha del usuario), no en el inicio. Se resuelve con el dosha guardado.
  const [volverAyurvedaUrl, setVolverAyurvedaUrl] = useState("/metodo/ayurveda");
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesTcm();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        // ¿Modo test de pagos habilitado? (nos deja fake-pay sin la cadena previa).
        let testEnabled = false;
        try {
          const t = await axios.get(`${API_URL}/payment/test/enabled`);
          testEnabled = !!t.data?.enabled;
        } catch { /* sin modo test */ }
        setTestPagos(testEnabled);

        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Resolvemos la última página de Ayurveda a partir del dosha del usuario.
        try {
          const ay = await axios.get(`${API_URL}/ayurveda/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const d = String(ay.data?.dosha ?? "").toLowerCase();
          if (["vata", "pitta", "kapha"].includes(d)) {
            setVolverAyurvedaUrl(`/metodo/ayurveda/dosha/${d}/cursos`);
          }
        } catch { /* sin dosha: se queda el inicio de Ayurveda */ }

        // Prerrequisito: hay que haber pagado Ayurveda (3ª disciplina). En modo
        // test dejamos ver el pago igualmente (el fake-pay desbloquea la cadena).
        if (!me.data?.ayurveda_suscrito && !testEnabled) { navigate("/home"); return; }

        const tcmSuscrito = !!me.data?.tcm_suscrito;
        setSuscrito(tcmSuscrito);
        if (!tcmSuscrito) { setPagoOpen(true); return; }
      } catch {
        navigate("/home");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const pagarTcm = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    setPagoLoading(true);
    setPagoError(null);
    try {
      const res = await axios.post(
        `${API_URL}/payment/tcm/checkout`,
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
          ? "Necesitas completar el pago de Ayurveda antes de adquirir la Medicina China."
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
        { scope: "tcm" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSuscrito(true);
      setPagoOpen(false);
    } catch (err: any) {
      setPagoError(err?.response?.data?.message || "No se pudo activar el modo test.");
    }
  };

  const comenzar = () => {
    if (!suscrito) { setPagoOpen(true); return; }
    navigate("/metodo/tcm/elementos");
  };

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={7}>

          <MetodoStepHeader
            icon={<TCMIcon size={{ base: "40px", md: "56px" }} />}
            title="Medicina China"
            pageLabel="1/12"
            compact
            bgColor={`${tcmBg}dd`}
            color={tcmTxt}
            nom={tcmNom}
            mb={0}
            prev={{ label: "← Ayurveda", onClick: () => navigate(volverAyurvedaUrl) }}
            extra={ilustracionesBtn}
            next={{ label: "Los 5 elementos →", onClick: comenzar }}
          />

          {/* ── Bienvenida contemplativa ── */}
          <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
            <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 7, md: 12 }} pt={{ base: 6, md: 8 }} pb={{ base: 10, md: 14 }} textAlign="center">
              <Text
                color="white"
                fontSize={{ base: "sm", md: "md" }}
                lineHeight="1.9"
                opacity={0.9}
                maxW="600px"
                mx="auto"
                mb={4}
                style={{ textShadow: INK_SHADOW }}
              >
                La Medicina Tradicional China lleva miles de años observando la naturaleza y al ser humano.
                Según esta visión, la salud es el equilibrio dinámico entre tu cuerpo, tus emociones y el entorno que te forma.
              </Text>
              <Text
                color="white"
                fontSize={{ base: "sm", md: "md" }}
                lineHeight="1.9"
                opacity={0.9}
                maxW="600px"
                mx="auto"
                style={{ textShadow: INK_SHADOW }}
              >
                En este mapa descubrirás tu equilibrio actual entre los cinco elementos, aprenderás a
                reconocer tus desequilibrios y sabrás cómo cuidarte desde esta sabiduría milenaria.
              </Text>
            </Box>
          </Box>

          {/* ── Disparador del aviso ── */}
          <Box
            as="button"
            onClick={() => setAvisoOpen(true)}
            display="inline-flex"
            alignItems="center"
            gap={2}
            px={6}
            py={2.5}
            borderRadius="full"
            bg="rgba(255,255,255,0.12)"
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
        </Flex>
      </Flex>

      {ilustracionesModal}

      <IndiceTcm />

      <BotonCompania color={tcmTxt} bgColor={tcmBg} disciplinaNom={tcmNom} />

      <SiteFooter />

      <PagoTcmModal
        isOpen={pagoOpen && !suscrito}
        onClose={() => setPagoOpen(false)}
        onPagar={pagarTcm}
        loading={pagoLoading}
        error={pagoError}
        onTest={testPagos ? testUnlock : undefined}
      />

      {/* ── Aviso importante ── */}
      <Modal isOpen={avisoOpen} onClose={() => setAvisoOpen(false)} isCentered scrollBehavior="inside" size={{ base: "sm", md: "lg" }}>
        <ModalOverlay bg="rgba(0,0,0,0.82)" sx={{ backdropFilter: "blur(6px)" }} />
        <ModalContent bg="transparent" boxShadow="none" overflow="visible" mx={4} fontFamily="'EB Garamond', serif">
          <Box position="relative" borderRadius="2xl" overflow="hidden" boxShadow={`0 0 24px ${tcmTxt}40, 0 0 60px ${tcmTxt}26, 0 26px 70px rgba(40,4,4,0.6)`}>
            <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
            <ModalCloseButton color={TINTA} zIndex={3} />
            <ModalBody position="relative" zIndex={1} px={{ base: 6, md: 9 }} py={{ base: 8, md: 10 }}>
              <Flex direction="column" gap={4}>
                <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.04em"
                      textAlign="center" style={{ textShadow: INK_SHADOW }}>
                  Importante
                </Text>
                <Box h="1px" w="55%" maxW="220px" mx="auto" bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />
                <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="700" lineHeight="1.75"
                      style={{ textShadow: INK_SHADOW }}>
                  Este mapa tiene un fin educativo y de autoconocimiento.
                </Text>
                <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" opacity={0.92}
                      style={{ textShadow: INK_SHADOW }}>
                  No constituye un diagnóstico clínico ni sustituye la valoración realizada por un profesional
                  cualificado en medicina tradicional china o en medicina convencional. Si atraviesas un problema
                  de salud, busca acompañamiento profesional.
                </Text>
              </Flex>
            </ModalBody>
          </Box>
        </ModalContent>
      </Modal>
    </Box>
  );
}
