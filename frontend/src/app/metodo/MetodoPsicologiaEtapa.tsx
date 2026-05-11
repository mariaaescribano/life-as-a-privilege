import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text, Textarea, VStack } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { etapaByKey } from "../../components/metodo/psicologiaData";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

export default function MetodoPsicologiaEtapa() {
  const navigate = useNavigate();
  const { etapaKey } = useParams<{ etapaKey: string }>();
  const etapa = etapaByKey(etapaKey || "");

  const [loading, setLoading] = useState(true);
  const [completada, setCompletada] = useState(false);
  const [notas, setNotas] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!etapa) { navigate("/metodo/psicologia", { replace: true }); return; }

    (async () => {
      try {
        const res = await axios.get(`${API_URL}/metodo-psicologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data?.data || {};
        const v = data[etapa.key] || {};
        setCompletada(!!v.completada);
        setNotas(v.notas || "");
      } catch {
        // Silencioso
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const guardar = async (cambios: { completada?: boolean; notas?: string }) => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token || !etapa) return;

    setGuardando(true);
    try {
      // Lee, modifica, escribe (mantiene el resto del data intacto)
      const res = await axios.get(`${API_URL}/metodo-psicologia/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data?.data || {};
      const existente = data[etapa.key] || {};
      const next = {
        ...existente,
        ...cambios,
        ...(cambios.completada && !existente.completada
          ? { fecha: new Date().toISOString() }
          : {}),
      };
      const nextData = { ...data, [etapa.key]: next };
      await axios.patch(
        `${API_URL}/metodo-psicologia/${userId}`,
        { data: nextData },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch {
      // Silencioso
    } finally {
      setGuardando(false);
    }
  };

  const marcarCompletada = async () => {
    setCompletada(true);
    await guardar({ completada: true, notas });
    navigate("/metodo/psicologia");
  };

  const onNotasBlur = () => {
    void guardar({ notas });
  };

  if (loading) {
    return (
      <Box minH="100vh" bg="#008080">
        <SpinnerTurquesa />
      </Box>
    );
  }
  if (!etapa) return null;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={6}>

          {/* ── HEADER ── */}
          <MetodoStepHeader
            icon={<NeuropsicologiaIcon size={{ base: "40px", md: "56px" }} />}
            title={`Psicología: ${etapa.label}`}
            bgColor={`${neuropsicologiaBg}dd`}
            color={neuropsicologiaTxt}
            mb={0}
            prev={{ label: "← Volver a la cronología", onClick: () => navigate("/metodo/psicologia") }}
            next={{
              label: completada ? "Etapa completada ✓" : "Marcar como completada",
              onClick: marcarCompletada,
              disabled: completada || guardando,
            }}
          />

          {/* ── Rango y descripción ── */}
          <Flex direction="column" align="center" gap={2}>
            <Text
              color="rgba(255,255,255,0.85)"
              fontSize={{ base: "md", md: "lg" }}
              letterSpacing="0.08em"
              fontStyle="italic"
            >
              {etapa.rango}
            </Text>
            {etapa.intro && (
              <Text
                color="rgba(255,255,255,0.85)"
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="1.7"
                textAlign="center"
                maxW="640px"
              >
                {etapa.intro}
              </Text>
            )}
          </Flex>

          {/* ── BOX DE PREGUNTAS ── */}
          <Box
            w="100%"
            bg={`${neuropsicologiaBg}eb`}
            border={`1px solid ${neuropsicologiaTxt}33`}
            borderRadius="2xl"
            boxShadow={`0 0 28px ${neuropsicologiaBg}55, 0 0 72px ${neuropsicologiaBg}33`}
            px={{ base: 7, md: 12 }}
            py={{ base: 8, md: 10 }}
          >
            <Text
              color={neuropsicologiaTxt}
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="700"
              letterSpacing="0.04em"
              mb={5}
              textAlign="center"
            >
              Preguntas para tu libreta
            </Text>

            <Box h="1px" mb={6} mx="auto" w="60%" bgGradient={`linear(to-r, transparent, ${neuropsicologiaTxt}55, transparent)`} />

            <VStack align="stretch" spacing={4}>
              {etapa.preguntas.map((p, i) => (
                <Flex key={i} align="flex-start" gap={3}>
                  <Box
                    flexShrink={0}
                    w="30px"
                    h="30px"
                    borderRadius="full"
                    bg={neuropsicologiaTxt}
                    color={neuropsicologiaBg}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontFamily="'EB Garamond', serif"
                    fontWeight="700"
                    fontSize="sm"
                    mt="2px"
                  >
                    {i + 1}
                  </Box>
                  <Text
                    color={neuropsicologiaTxt}
                    fontSize={{ base: "md", md: "lg" }}
                    lineHeight="1.75"
                    letterSpacing="0.015em"
                    flex="1"
                  >
                    {p}
                  </Text>
                </Flex>
              ))}
            </VStack>
          </Box>

          {/* ── NOTAS (opcional) ── */}
          <Box w="100%">
            <Text
              color={`${neuropsicologiaBg}`}
              fontSize="sm"
              letterSpacing="0.12em"
              fontWeight="600"
              mb={2}
              textTransform="uppercase"
              textAlign="center"
            >
              Notas breves (opcional)
            </Text>
            <Textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              onBlur={onNotasBlur}
              placeholder="Si quieres, resume aquí lo más importante de lo que has escrito en tu libreta…"
              minH="140px"
              bg={`${neuropsicologiaBg}1f`}
              border={`1px solid ${neuropsicologiaBg}55`}
              color="white"
              borderRadius="xl"
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.7"
              _placeholder={{ color: "rgba(255,255,255,0.5)" }}
              _hover={{ borderColor: `${neuropsicologiaBg}aa` }}
              _focus={{
                borderColor: neuropsicologiaBg,
                boxShadow: `0 0 0 1px ${neuropsicologiaBg}55, 0 0 14px ${neuropsicologiaBg}44`,
                bg: `${neuropsicologiaBg}2a`,
              }}
            />
            <Text color="rgba(255,255,255,0.5)" fontSize="xs" mt={2} fontStyle="italic" textAlign="center">
              {guardando ? "Guardando…" : "Las notas se guardan al salir del campo."}
            </Text>
          </Box>

        </Flex>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
