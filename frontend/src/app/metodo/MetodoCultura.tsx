import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { CulturaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { BotonCompania } from "../../components/global/BotonCompania";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { CulturaIlustracionesModal } from "../../components/metodo/CulturaIlustracionesModal";
import { PagoCulturaModal } from "../../components/metodo/PagoCulturaModal";
import { Reveal } from "../../components/global/Reveal";
import { API_URL, culturaBg, culturaNom, culturaTxt, CulturaIcon } from "../../GlobalVariables";

// Halo oscuro (verde profundo) para que el texto se lea sobre el fondo de Cultura.
const INK_SHADOW = `0 1px 3px ${culturaBg}f5, 0 0 8px ${culturaBg}cc, 0 2px 16px ${culturaBg}88`;
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.14), 0 0 34px rgba(255,255,255,0.07), 0 0 20px ${culturaTxt}22, 0 0 48px ${culturaTxt}14`;

// Ojo del botón "Ilustraciones" (se pinta a la izquierda del texto).
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="16" height="16" fill="currentColor"
       style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))", flexShrink: 0 }}>
    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
  </svg>
);

export default function MetodoCultura() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [suscrito, setSuscrito] = useState(false);
  const [pagoOpen, setPagoOpen] = useState(false);
  const [pagoLoading, setPagoLoading] = useState(false);
  const [pagoError, setPagoError] = useState<string | null>(null);
  const [testPagos, setTestPagos] = useState(false);
  const [ilustracionesOpen, setIlustracionesOpen] = useState(false);

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

        // Prerrequisito: hay que haber pagado Cábala (7ª disciplina). En modo
        // test dejamos ver el pago igualmente (el fake-pay desbloquea la cadena).
        if (!me.data?.cabala_suscrito && !testEnabled) { navigate("/home"); return; }

        const culturaSuscrito = !!me.data?.cultura_suscrito;
        setSuscrito(culturaSuscrito);
        if (!culturaSuscrito) { setPagoOpen(true); return; }
      } catch {
        navigate("/home");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const pagarCultura = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    setPagoLoading(true);
    setPagoError(null);
    try {
      const res = await axios.post(
        `${API_URL}/payment/cultura/checkout`,
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
          ? "Necesitas completar el pago de Cábala antes de adquirir Cultura."
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
        { scope: "cultura" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSuscrito(true);
      setPagoOpen(false);
    } catch (err: any) {
      setPagoError(err?.response?.data?.message || "No se pudo activar el modo test.");
    }
  };

  if (loading) {
    return <CulturaLoading />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<CulturaIcon size={{ base: "40px", md: "56px" }} />}
              title="Cultura"
              bgColor={`${culturaBg}dd`}
              color={culturaTxt}
              nom={culturaNom}
              mb={0}
              prev={{ label: "← Cábala", onClick: () => navigate("/metodo/cabala/cursos") }}
              extra={{ label: "Ilustraciones", onClick: () => setIlustracionesOpen(true), icon: <EyeIcon /> }}
              next={{ label: "Las Historias →", onClick: () => {
                if (!suscrito) { setPagoError(null); setPagoOpen(true); return; }
                navigate("/metodo/cultura/historias");
              } }}
            />
          </Reveal>

          {/* ── Introducción ── */}
          <Reveal direction="up" distance={28} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%">
            <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
              <DisciplinaBgLayer nom={culturaNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1} px={{ base: 7, md: 12 }} pt={{ base: 6, md: 8 }} pb={{ base: 10, md: 14 }} textAlign="center">
                <Text
                  color={culturaTxt}
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight="1.9"
                  opacity={0.92}
                  maxW="620px"
                  mx="auto"
                  mb={4}
                  style={{ textShadow: INK_SHADOW }}
                >
                  El último paso de <Box as="span" fontStyle="italic" color={culturaTxt}>El Mapa</Box>.
                  Recorre la historia de la filosofía, la medicina, la religión y del mundo entero.
                  Recordar de dónde venimos es lo que nos permite comprender dónde estamos y sembrar,
                  entre todos, un futuro más hermoso.
                </Text>
                <Text
                  color={culturaTxt}
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight="1.9"
                  opacity={0.92}
                  maxW="620px"
                  mx="auto"
                  fontStyle="italic"
                  style={{ textShadow: INK_SHADOW }}
                >
                  Quizá casi todo ya fue pensado y dicho alguna vez. A nosotros nos corresponde
                  recordarlo, comprenderlo y traer esa sabiduría de vuelta al presente.
                </Text>
              </Box>
            </Box>
          </Reveal>
        </Flex>
      </Flex>

      <CulturaIlustracionesModal isOpen={ilustracionesOpen} onClose={() => setIlustracionesOpen(false)} />

      <BotonCompania color={culturaTxt} bgColor={culturaBg} disciplinaNom={culturaNom} />

      <SiteFooter />

      <PagoCulturaModal
        isOpen={pagoOpen && !suscrito}
        onClose={() => { setPagoOpen(false); navigate("/home"); }}
        onPagar={pagarCultura}
        loading={pagoLoading}
        error={pagoError}
        onTest={testPagos ? testUnlock : undefined}
      />
    </Box>
  );
}
