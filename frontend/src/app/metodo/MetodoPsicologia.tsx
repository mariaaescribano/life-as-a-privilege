import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { PagoPsicologiaModal } from "../../components/metodo/PagoPsicologiaModal";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import {
  EXPERIENCIAS,
  aniosRecorridos,
  lineaCompleta,
  type LineaDeVidaData,
} from "../../components/metodo/psicologiaRecorrido";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

// Tinta cálida: sombras suaves marrones en vez de glows claros (es papel, no cosmos).
const TINTA = neuropsicologiaTxt;
const INK_SHADOW = `0 1px 2px rgba(94,45,16,0.18)`;

export default function MetodoPsicologia() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [suscrito, setSuscrito] = useState(false);
  const [data, setData] = useState<LineaDeVidaData>({});
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
        if (!psicoSuscrito) {
          setPagoOpen(true);
        } else {
          // Cargamos el progreso (respuestas guardadas) para mostrar avance.
          try {
            const psi = await axios.get(`${API_URL}/metodo-psicologia/${userId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (psi.data?.data) setData(psi.data.data);
          } catch { /* silencioso */ }
        }
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
      const userId = sessionStorage.getItem("userId");
      const psi = await axios.get(`${API_URL}/metodo-psicologia/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (psi.data?.data) setData(psi.data.data);
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

          <MetodoStepHeader
            icon={<NeuropsicologiaIcon size={{ base: "40px", md: "56px" }} />}
            title="Psicología"
            bgColor={`${neuropsicologiaBg}dd`}
            color={neuropsicologiaTxt}
            nom={neuropsicologiaNom}
            mb={0}
            prev={{ label: "← Volver al Recorrido", onClick: () => navigate("/home") }}
          />

          {/* ── Intro contemplativa ── */}
          <Box
            position="relative"
            w="100%"
            borderRadius="2xl"
            overflow="hidden"
            border={`1px solid ${TINTA}33`}
            boxShadow={`0 10px 40px rgba(94,45,16,0.18), 0 0 0 1px ${neuropsicologiaBg}55`}
          >
            <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" overlay="rgba(247,236,220,0.45)" />
            <Box position="relative" zIndex={1} px={{ base: 7, md: 12 }} py={{ base: 9, md: 12 }} textAlign="center">
              <Text
                color={TINTA}
                fontSize={{ base: "sm", md: "md" }}
                letterSpacing="0.22em"
                textTransform="uppercase"
                fontWeight="600"
                opacity={0.7}
                mb={4}
              >
                El Recorrido · Psicología
              </Text>
              <Text
                color={TINTA}
                fontSize={{ base: "2xl", md: "4xl" }}
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
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="1.95"
                opacity={0.9}
                maxW="640px"
                mx="auto"
              >
                Antes de comprender tu mente, hay que recordar la vida que te formó. Este recorrido es para reconstruirte.
              </Text>
            </Box>
          </Box>

          {/* ── Experiencias ── */}
          <Flex direction="column" w="100%" gap={5}>
            {EXPERIENCIAS.map((exp, i) => {
              const edad = typeof data.edad === "number" ? data.edad : 0;
              const total = edad > 0 ? edad + 1 : 0;
              const respondidas = edad > 0 ? aniosRecorridos(data, edad) : 0;
              const problemaEscrito =
                typeof data["problema-actual"] === "string" &&
                (data["problema-actual"] as string).trim().length > 0;
              const empezada = problemaEscrito || edad > 0;
              const completada = edad > 0 && lineaCompleta(data, edad);
              return (
                <Box
                  key={exp.id}
                  position="relative"
                  borderRadius="2xl"
                  overflow="hidden"
                  cursor={suscrito ? "pointer" : "not-allowed"}
                  onClick={suscrito ? () => navigate(`/metodo/psicologia/${exp.id}`) : () => setPagoOpen(true)}
                  border={`1.5px solid ${TINTA}44`}
                  boxShadow={`0 10px 40px rgba(94,45,16,0.2), 0 0 0 1px ${neuropsicologiaBg}55`}
                  transition="transform 0.28s ease, box-shadow 0.28s ease"
                  _hover={{
                    transform: "translateY(-3px)",
                    boxShadow: `0 16px 52px rgba(94,45,16,0.28), 0 0 0 1px ${TINTA}55`,
                  }}
                >
                  <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" overlay="rgba(247,236,220,0.3)" />
                  <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 7, md: 9 }}>
                    <Flex align="center" gap={{ base: 4, md: 6 }}>
                      {/* Número de la experiencia */}
                      <Flex
                        flexShrink={0}
                        w={{ base: "52px", md: "64px" }}
                        h={{ base: "52px", md: "64px" }}
                        borderRadius="full"
                        bg={`${TINTA}`}
                        color={neuropsicologiaBg}
                        align="center"
                        justify="center"
                        fontWeight="700"
                        fontSize={{ base: "xl", md: "2xl" }}
                        boxShadow={`0 4px 14px rgba(94,45,16,0.35)`}
                      >
                        {i + 1}
                      </Flex>

                      <Box flex="1" minW={0}>
                        <Text color={TINTA} fontSize={{ base: "xs", md: "sm" }} letterSpacing="0.16em" textTransform="uppercase" opacity={0.65} fontWeight="600">
                          Experiencia {i + 1}
                        </Text>
                        <Text color={TINTA} fontSize={{ base: "xl", md: "3xl" }} fontWeight="700" letterSpacing="0.02em" lineHeight="1.15" style={{ textShadow: INK_SHADOW }}>
                          {exp.titulo}
                        </Text>
                        <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} opacity={0.85} mt={0.5} fontStyle="italic">
                          {exp.subtitulo}
                        </Text>

                        {/* Progreso de la línea de vida (años recorridos) */}
                        {suscrito && total > 0 && (
                          <Flex align="center" gap={3} mt={3}>
                            <Box flex="1" maxW="220px" h="6px" borderRadius="full" bg={`${TINTA}26`} overflow="hidden">
                              <Box h="100%" w={`${(respondidas / total) * 100}%`} bg={TINTA} borderRadius="full" transition="width 0.4s ease" />
                            </Box>
                            <Text color={TINTA} fontSize="sm" opacity={0.8} whiteSpace="nowrap">
                              {respondidas}/{total} años
                            </Text>
                          </Flex>
                        )}
                      </Box>

                      {/* CTA */}
                      <Flex flexShrink={0} align="center" gap={2} color={TINTA} fontWeight="600" fontSize={{ base: "sm", md: "md" }} letterSpacing="0.04em">
                        <Box as="span" display={{ base: "none", sm: "block" }}>
                          {!suscrito ? "Desbloquear" : completada ? "Repasar" : empezada ? "Continuar" : "Comenzar"}
                        </Box>
                        <Box as="span" fontSize="xl">→</Box>
                      </Flex>
                    </Flex>
                  </Box>
                </Box>
              );
            })}
          </Flex>
        </Flex>
      </Flex>

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
