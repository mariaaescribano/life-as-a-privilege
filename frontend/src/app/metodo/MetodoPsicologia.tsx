import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { PagoPsicologiaModal } from "../../components/metodo/PagoPsicologiaModal";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { EXPERIENCIAS, type LineaDeVidaData } from "../../components/metodo/psicologiaRecorrido";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

// Tinta cálida con halo claro (crema + color de la disciplina) para que se lea
// bien sobre el fondo de acuarela.
const TINTA = neuropsicologiaTxt;
const INK_SHADOW = `0 1px 2px #fbf4e8, 0 0 6px #fbf4e8, 0 0 13px ${neuropsicologiaBg}`;

// Latido al pulsar «Voy a ser valiente»: la pieza late y emite un anillo.
const latido = keyframes`
  0%   { transform: scale(1);    box-shadow: 0 8px 26px rgba(94,45,16,0.4), 0 0 0 0 rgba(94,45,16,0.35); }
  45%  { transform: scale(1.07); box-shadow: 0 12px 34px rgba(94,45,16,0.5), 0 0 0 16px rgba(94,45,16,0); }
  100% { transform: scale(1);    box-shadow: 0 8px 26px rgba(94,45,16,0.4), 0 0 0 0 rgba(94,45,16,0); }
`;

export default function MetodoPsicologia() {
  const navigate = useNavigate();
  const experiencia = EXPERIENCIAS[0];
  const [loading, setLoading] = useState(true);
  const [suscrito, setSuscrito] = useState(false);
  const [pagoOpen, setPagoOpen] = useState(false);
  const [pagoLoading, setPagoLoading] = useState(false);
  const [pagoError, setPagoError] = useState<string | null>(null);
  const [testPagos, setTestPagos] = useState(false);
  // «Voy a ser valiente»: desbloquea la página de Problema (persistido en BD).
  const [valiente, setValiente] = useState(false);
  const [animando, setAnimando] = useState(false);
  const dataRef = useRef<LineaDeVidaData>({});

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
        // Prerrequisito: hay que haber pagado Astrología para llegar aquí.
        if (!me.data?.metodo_suscrito) { navigate("/home"); return; }

        const psicoSuscrito = !!me.data?.psicologia_suscrito;
        setSuscrito(psicoSuscrito);
        if (!psicoSuscrito) { setPagoOpen(true); return; }

        // Cargamos el progreso para saber si ya pulsó «Voy a ser valiente».
        try {
          const psi = await axios.get(`${API_URL}/metodo-psicologia/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const d: LineaDeVidaData = psi.data?.data || {};
          dataRef.current = d;
          setValiente(!!d.valiente);
        } catch { /* silencioso */ }
      } catch {
        navigate("/home");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const pagarPsicologia = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    setPagoLoading(true);
    setPagoError(null);
    try {
      const res = await axios.post(
        `${API_URL}/payment/psicologia/checkout`,
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
          ? "Necesitas completar el pago de Astrología antes de adquirir Psicología."
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
        { scope: "psicologia" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSuscrito(true);
      setPagoOpen(false);
    } catch (err: any) {
      setPagoError(err?.response?.data?.message || "No se pudo activar el modo test.");
    }
  };

  // «Voy a ser valiente»: anima, persiste el flag y desbloquea Problema.
  const serValiente = () => {
    if (valiente || animando) return;
    if (!suscrito) { setPagoOpen(true); return; }
    setAnimando(true);
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");
    const next = { ...dataRef.current, valiente: true };
    dataRef.current = next;
    if (token && userId) {
      axios.patch(
        `${API_URL}/metodo-psicologia/${userId}`,
        { data: next },
        { headers: { Authorization: `Bearer ${token}` } },
      ).catch(() => { /* silencioso */ });
    }
    // Tras el latido, fija el estado «valiente» (desbloquea Problema).
    window.setTimeout(() => { setValiente(true); setAnimando(false); }, 850);
  };

  // Continuar a la página de Problema (solo cuando ya ha sido valiente).
  const irAProblema = () => {
    if (!suscrito) { setPagoOpen(true); return; }
    if (valiente) navigate(`/metodo/psicologia/${experiencia.id}/problema`);
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
            icon={<NeuropsicologiaIcon size={{ base: "40px", md: "56px" }} />}
            title="Vuelve"
            pageLabel="1/9"
            bgColor={`${neuropsicologiaBg}dd`}
            color={neuropsicologiaTxt}
            nom={neuropsicologiaNom}
            mb={0}
            prev={{ label: "← Volver a Astrología", onClick: () => navigate("/metodo/astrologia/llamada") }}
            next={{
              label: "Problema →",
              onClick: irAProblema,
              disabled: !valiente,
              disabledTooltip: "Pulsa «Voy a ser valiente» para empezar",
            }}
          />

          {/* ── Intro contemplativa (misma fuerza que el header: sin velo) ── */}
          <Box
            position="relative"
            w="100%"
            borderRadius="2xl"
            overflow="hidden"
            boxShadow={`0 10px 40px rgba(94,45,16,0.18)`}
          >
            <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 7, md: 12 }} pt={{ base: 6, md: 8 }} pb={{ base: 10, md: 14 }} textAlign="center">
              <Text
                color={TINTA}
                fontSize={{ base: "3xl", md: "5xl" }}
                fontWeight="700"
                letterSpacing="0.02em"
                lineHeight="1.2"
                mb={5}
                style={{ textShadow: INK_SHADOW }}
              >
                Vuelve a tu historia
              </Text>
              <Text
                color={TINTA}
                fontSize={{ base: "sm", md: "md" }}
                lineHeight="1.8"
                opacity={0.72}
                maxW="560px"
                mx="auto"
              >
                Antes de comprender tu mente, hay que recordar la Vida que te formó. Esta sección de El Recorrido es para reconstruir tu historia. El propósito es volver a unir tus fragmentaciones.
              </Text>

              {/* Botón: «Voy a ser valiente» → (con latido) pasa a «Ir a mi
                  problema →», que ya navega a la página de Problema. */}
              <Box
                as="button"
                onClick={() => { if (animando) return; if (valiente) irAProblema(); else serValiente(); }}
                disabled={animando}
                mt={{ base: 8, md: 10 }}
                px={{ base: 10, md: 14 }}
                py={4}
                borderRadius="full"
                bg={TINTA}
                color="#fbf4e8"
                fontFamily="'EB Garamond', serif"
                fontWeight="700"
                fontSize={{ base: "lg", md: "xl" }}
                letterSpacing="0.08em"
                cursor={animando ? "wait" : "pointer"}
                boxShadow={valiente
                  ? `0 8px 26px rgba(94,45,16,0.4), 0 0 22px ${neuropsicologiaBg}`
                  : `0 8px 26px rgba(94,45,16,0.4)`}
                animation={animando ? `${latido} 0.85s ease` : undefined}
                transition="all 0.22s"
                _hover={animando ? {} : { transform: "translateY(-2px)", boxShadow: `0 12px 34px rgba(94,45,16,0.5)` }}
              >
                {valiente ? "Ir a mi problema →" : "Voy a ser valiente"}
              </Box>
            </Box>
          </Box>
        </Flex>
      </Flex>

      <AyudaRecorrido pagina="inicio" />

      <SiteFooter />

      <PagoPsicologiaModal
        isOpen={pagoOpen && !suscrito}
        onClose={() => setPagoOpen(false)}
        onPagar={pagarPsicologia}
        loading={pagoLoading}
        error={pagoError}
        onTest={testPagos ? testUnlock : undefined}
      />
    </Box>
  );
}
