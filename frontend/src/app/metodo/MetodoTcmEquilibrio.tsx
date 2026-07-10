import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesTcm } from "../../components/metodo/IlustracionesTcm";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceTcm } from "../../components/metodo/IndiceTcm";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { API_URL, tcmBg, tcmNom, tcmTxt, TCMIcon } from "../../GlobalVariables";
import {
  TEST_INICIAL, puntuarTest, testInicialCompleto, type DatosTcm,
} from "../../components/metodo/tcmRecorrido";

const TINTA = tcmTxt;
const INK_SHADOW = `0 1px 3px ${tcmBg}f5, 0 0 8px ${tcmBg}cc`;
// Mismo glow ligero que el header, para uniformar los boxes.
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${tcmTxt}1a, 0 0 48px ${tcmTxt}10`;

export default function MetodoTcmEquilibrio() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const dataRef = useRef<DatosTcm>({});
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesTcm();

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
        if (!me.data?.tcm_suscrito) { navigate("/metodo/tcm"); return; }

        // GET del progreso + prerrelleno de lo ya contestado (que no repita).
        const res = await axios.get(`${API_URL}/metodo-tcm/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: DatosTcm = res.data?.data ?? {};
        dataRef.current = data;
        setRespuestas(data.testInicial?.respuestas ?? {});
      } catch {
        navigate("/metodo/tcm");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const elegir = (preguntaKey: string, opcionKey: string) => {
    setRespuestas((prev) => ({ ...prev, [preguntaKey]: opcionKey }));
  };

  const guardar = async (): Promise<boolean> => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return false;
    const next: DatosTcm = {
      ...dataRef.current,
      testInicial: { respuestas, puntos: puntuarTest(TEST_INICIAL, respuestas) },
    };
    dataRef.current = next;
    try {
      await axios.patch(
        `${API_URL}/metodo-tcm/${userId}`,
        { data: next },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return true;
    } catch {
      return false;
    }
  };

  const completo = testInicialCompleto({ testInicial: { respuestas, puntos: {} } });

  const irAlMapa = async () => {
    if (!completo) return;
    await guardar();
    navigate("/metodo/tcm/mapa");
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
            title="Equilibrio"
            pageLabel="2/14"
            compact
            bgColor={`${tcmBg}dd`}
            color={tcmTxt}
            nom={tcmNom}
            mb={0}
            prev={{ label: "← Bienvenida", onClick: () => { void guardar(); navigate("/metodo/tcm"); } }}
            extra={ilustracionesBtn}
            next={{
              label: "Mapa →",
              onClick: irAlMapa,
              disabled: !completo,
              disabledTooltip: "Responde a todas las preguntas para ver tu mapa energético",
            }}
          />

          <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                textAlign="center" lineHeight="1.8" maxW="640px">
            No buscamos “qué elemento eres”, sino cómo está tu equilibrio en este momento. Responde con lo
            primero que sientas: no hay respuestas correctas.
          </Text>

          {/* ── Preguntas ── */}
          {TEST_INICIAL.map((p, i) => (
            <Box key={p.key} position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
              <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1} px={{ base: 6, md: 9 }} py={{ base: 6, md: 7 }}>
                <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" mb={4}
                      style={{ textShadow: INK_SHADOW }}>
                  {i + 1}. {p.pregunta}
                </Text>
                <Flex direction="column" gap={2.5}>
                  {p.opciones.map((op) => {
                    const sel = respuestas[p.key] === op.key;
                    return (
                      <Box
                        key={op.key}
                        as="button"
                        onClick={() => elegir(p.key, op.key)}
                        textAlign="left"
                        px={{ base: 4, md: 5 }}
                        py={{ base: 2.5, md: 3 }}
                        borderRadius="xl"
                        bg={sel ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.07)"}
                        color="white"
                        fontFamily="'EB Garamond', serif"
                        fontSize={{ base: "sm", md: "md" }}
                        lineHeight="1.6"
                        cursor="pointer"
                        transition="all 0.15s"
                        boxShadow={sel ? `0 0 16px ${tcmTxt}66` : "none"}
                        _hover={{ bg: "rgba(255,255,255,0.16)" }}
                        style={{ textShadow: "0 1px 4px rgba(58,10,10,0.9)" }}
                      >
                        {op.texto}
                      </Box>
                    );
                  })}
                </Flex>
              </Box>
            </Box>
          ))}

          {/* Botón de continuar: aparece cuando ya se ha respondido todo. */}
          {completo && (
            <Box
              as="button"
              onClick={irAlMapa}
              position="relative"
              overflow="hidden"
              mt={2}
              px={12}
              py={3.5}
              borderRadius="full"
              bgImage="url('/img/fondos/tcm.png')"
              bgSize="cover"
              bgPosition="center"
              border={`1.5px solid ${tcmTxt}`}
              color={tcmTxt}
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="700"
              letterSpacing="0.06em"
              cursor="pointer"
              transition="all 0.2s"
              boxShadow={`0 0 18px ${tcmTxt}55, 0 4px 16px rgba(0,0,0,0.32)`}
              style={{ textShadow: `0 1px 4px rgba(58,10,10,0.95), 0 0 8px rgba(58,10,10,0.85)` }}
              _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 24px ${tcmTxt}66, 0 6px 22px rgba(0,0,0,0.36)` }}
              _active={{ transform: "scale(0.97)" }}
            >
              Mapa →
            </Box>
          )}
        </Flex>
      </Flex>

      {ilustracionesModal}

      <IndiceTcm />

      <BotonCompania color={tcmTxt} bgColor={tcmBg} disciplinaNom={tcmNom} />

      <SiteFooter />
    </Box>
  );
}
