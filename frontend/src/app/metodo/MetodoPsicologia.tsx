import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { PagoPsicologiaModal } from "../../components/metodo/PagoPsicologiaModal";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { EXPERIENCIAS } from "../../components/metodo/psicologiaRecorrido";
import { glowPanel, glowHeader, azulBorde } from "../../components/metodo/psicologiaGlow";
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

export default function MetodoPsicologia() {
  const navigate = useNavigate();
  const experiencia = EXPERIENCIAS[0];
  const [loading, setLoading] = useState(true);
  const [suscrito, setSuscrito] = useState(false);
  const [pagoOpen, setPagoOpen] = useState(false);
  const [pagoLoading, setPagoLoading] = useState(false);
  const [pagoError, setPagoError] = useState<string | null>(null);
  const [testPagos, setTestPagos] = useState(false);

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

  // Continuar a la página de Problema.
  const irAProblema = () => {
    if (!suscrito) { setPagoOpen(true); return; }
    navigate(`/metodo/psicologia/${experiencia.id}/problema`);
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
            pageLabel="1/10"
            bgColor={`${neuropsicologiaBg}dd`}
            color={neuropsicologiaTxt}
            nom={neuropsicologiaNom}
            mb={0}
            boxShadow={glowHeader}
            prev={{ label: "← Volver a Astrología", onClick: () => navigate("/metodo/astrologia/cursos") }}
            next={{
              label: "Problema →",
              onClick: irAProblema,
            }}
          />

          {/* ── Intro contemplativa (misma fuerza que el header: sin velo) ── */}
          <Box
            position="relative"
            w="100%"
            borderRadius="2xl"
            overflow="hidden"
            border={azulBorde}
            boxShadow={glowPanel}
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
