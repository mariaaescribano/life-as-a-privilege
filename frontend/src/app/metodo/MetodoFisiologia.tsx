import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { PagoFisiologiaModal } from "../../components/metodo/PagoFisiologiaModal";
import { IntroComicModal } from "../../components/metodo/IntroComicModal";
import { ORIGEN_CIENCIA } from "../../components/metodo/ComicCienciaModal";
import { useIntroComic } from "../../hooks/useIntroComic";
import { BotonCompania } from "../../components/global/BotonCompania";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { useTusCelulas } from "../../components/metodo/TusCelulasModal";
import { Reveal } from "../../components/global/Reveal";
import {
  API_URL,
  fisiologiaBg,
  fisiologiaNom,
  fisiologiaTxt,
  FisiologiaIcon,
} from "../../GlobalVariables";

// Halo oscuro para leer el texto claro sobre el fondo morado de Fisiología.
const INK_SHADOW = `0 1px 3px ${fisiologiaBg}f5, 0 0 8px ${fisiologiaBg}cc, 0 2px 16px ${fisiologiaBg}88`;
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(200,181,209,0.12), 0 0 20px ${fisiologiaTxt}1a, 0 0 48px ${fisiologiaTxt}10`;

export default function MetodoFisiologia() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [suscrito, setSuscrito] = useState(false);
  const [pagoOpen, setPagoOpen] = useState(false);
  const [pagoLoading, setPagoLoading] = useState(false);
  const [pagoError, setPagoError] = useState<string | null>(null);
  const [testPagos, setTestPagos] = useState(false);
  const intro = useIntroComic("metodo-fisiologia"); // cómic del Origen «según la ciencia», 1ª vez
  const { extra: celulasBtn, modal: celulasModal } = useTusCelulas();

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
        setTestPagos(testEnabled);

        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Prerrequisito: hay que haber pagado Medicina China (4ª disciplina). En
        // modo test dejamos ver el pago igualmente (el fake-pay desbloquea la cadena).
        if (!me.data?.tcm_suscrito && !testEnabled) { navigate("/home"); return; }

        const fisioSuscrito = !!me.data?.fisiologia_suscrito;
        setSuscrito(fisioSuscrito);
        if (!fisioSuscrito) { setPagoOpen(true); return; }

        // Ya tiene acceso: si es la 1ª vez, muestra el cómic del Origen (ciencia).
        void intro.checkAndOpen();
      } catch {
        navigate("/home");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const pagarFisiologia = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    setPagoLoading(true);
    setPagoError(null);
    try {
      const res = await axios.post(
        `${API_URL}/payment/fisiologia/checkout`,
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
          ? "Necesitas completar el pago de Medicina China antes de adquirir la Fisiología."
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
        { scope: "fisiologia" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSuscrito(true);
      setPagoOpen(false);
      void intro.checkAndOpen();
    } catch (err: any) {
      setPagoError(err?.response?.data?.message || "No se pudo activar el modo test.");
    }
  };

  const comenzar = () => {
    // En modo test dejamos avanzar aunque la BD no reporte la suscripción todavía
    // (columna fisiologia_suscrito pendiente de crear).
    if (!suscrito && !testPagos) { setPagoOpen(true); return; }
    navigate("/metodo/fisiologia/niveles");
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
            icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
            title="Fisiología"
            compact
            bgColor={`${fisiologiaBg}dd`}
            color={fisiologiaTxt}
            nom={fisiologiaNom}
            mb={0}
            prev={{ label: "← Med. China", onClick: () => navigate("/metodo/tcm/cursos") }}
            extra={celulasBtn}
            next={{ label: "Comenzar →", onClick: comenzar }}
          />

          {/* ── Bienvenida contemplativa ── */}
          <Reveal w="100%">
            <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
              <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1} px={{ base: 7, md: 12 }} pt={{ base: 6, md: 8 }} pb={{ base: 10, md: 14 }} textAlign="center">
                <Text
                  color="white"
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight="1.95"
                  opacity={0.92}
                  maxW="600px"
                  mx="auto"
                  mb={4}
                  style={{ textShadow: INK_SHADOW }}
                >
                  No tenemos un cuerpo: somos un cuerpo. Todo lo que existe —incluido tú— está construido a
                  partir de las mismas partículas que nacieron en el corazón de las estrellas.
                </Text>
                <Text
                  color="white"
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight="1.95"
                  opacity={0.92}
                  maxW="600px"
                  mx="auto"
                  style={{ textShadow: INK_SHADOW }}
                >
                  En este recorrido descenderás hasta lo más pequeño que te forma y volverás a subir, nivel a
                  nivel, hasta el milagro entero que eres. Empecemos por el principio de todo.
                </Text>
              </Box>
            </Box>
          </Reveal>
        </Flex>
      </Flex>

      {/* Intro (1ª vez): cómic del Origen según la ciencia. */}
      <IntroComicModal
        isOpen={intro.open}
        vinetas={ORIGEN_CIENCIA}
        themeColor={fisiologiaTxt}
        disciplinaBgImage="/img/fondos/fisio.png"
        disciplinaBgColor={fisiologiaBg}
        onFinish={intro.finish}
        onClose={intro.close}
      />

      {celulasModal}

      <BotonCompania color={fisiologiaTxt} bgColor={fisiologiaBg} disciplinaNom={fisiologiaNom} />

      <SiteFooter />

      <PagoFisiologiaModal
        isOpen={pagoOpen && !suscrito}
        onClose={() => setPagoOpen(false)}
        onPagar={pagarFisiologia}
        loading={pagoLoading}
        error={pagoError}
        onTest={testPagos ? testUnlock : undefined}
      />
    </Box>
  );
}
