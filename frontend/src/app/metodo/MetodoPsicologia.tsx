import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import {
  ETAPAS,
  type Etapa,
  type EtapaKey,
  calcularEdad,
  etapasParaEdad,
} from "../../components/metodo/psicologiaData";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

/* Datos por etapa guardados en BD */
interface EtapaEstado {
  completada?: boolean;
  notas?: string;
  fecha?: string; // cuando se marcó completada
}
type CronologiaData = Partial<Record<EtapaKey, EtapaEstado>>;

const valorOf = (data: CronologiaData, key: EtapaKey): EtapaEstado => data[key] || {};

function esEtapaCompleta(v: EtapaEstado): boolean {
  return !!v.completada;
}

function siguienteEtapaIndex(etapas: Etapa[], data: CronologiaData): number {
  for (let i = 0; i < etapas.length; i++) {
    if (!esEtapaCompleta(valorOf(data, etapas[i].key))) return i;
  }
  return -1;
}

export default function MetodoPsicologia() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CronologiaData>({});
  const [etapasVisibles, setEtapasVisibles] = useState<Etapa[]>(ETAPAS);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        // 1) Sacamos la fecha de nacimiento del módulo de astrología para calcular edad
        const astro = await axios.get(`${API_URL}/metodo-astrologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const edad = calcularEdad(astro.data?.fecha_nacimiento);
        setEtapasVisibles(etapasParaEdad(edad));

        // 2) Sacamos los datos de psicología
        const psi = await axios.get(`${API_URL}/metodo-psicologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (psi.data?.data) setData(psi.data.data);
      } catch {
        // Silencioso: si falla la edad, mostramos todas las etapas
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <Box minH="100vh" bg="#008080">
        <SpinnerTurquesa />
      </Box>
    );
  }

  const siguienteIdx = siguienteEtapaIndex(etapasVisibles, data);
  const todoCompletado = siguienteIdx === -1;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      {/* ── CABECERA ── */}
      <Flex justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }}>
        <MetodoStepHeader
          icon={<NeuropsicologiaIcon size={{ base: "40px", md: "56px" }} />}
          title="Psicología"
          bgColor={`${neuropsicologiaBg}dd`}
          color={neuropsicologiaTxt}
          mb={0}
          prev={{ label: "← Volver a Astrología", onClick: () => navigate("/metodo/astrologia/planetas") }}
          next={{
            label: todoCompletado ? "Continuar a Hinduismo →" : "Completa primero tu cronología",
            onClick: () => navigate("/metodo/hinduismo"),
            disabled: !todoCompletado,
          }}
        />
      </Flex>

      {/* Subtítulo / aviso de orden */}
      <Flex direction="column" align="center" px={{ base: 5, md: 10, lg: 16 }} pt={4} gap={3}>
        <Text
          color="rgba(255,255,255,0.92)"
          fontSize={{ base: "md", md: "lg" }}
          lineHeight="1.7"
          fontStyle="italic"
          letterSpacing="0.015em"
          textAlign="center"
          maxW="720px"
        >
          Construye tu cronología de vida etapa a etapa. Toma una libreta, responde a las preguntas a mano y, cuando termines cada etapa, márcala como completada para abrir la siguiente.
        </Text>
        <Box
          px={5}
          py={2.5}
          borderRadius="full"
          bg={`${neuropsicologiaBg}24`}
          border={`1px solid ${neuropsicologiaBg}66`}
          boxShadow={`0 0 16px ${neuropsicologiaBg}33`}
        >
          <Text color={neuropsicologiaBg} fontSize={{ base: "sm", md: "md" }} letterSpacing="0.08em" fontStyle="italic" textAlign="center">
            ✦ Hay que ir por orden — empieza por la primera etapa.
          </Text>
        </Box>
      </Flex>

      {/* ── CRONOLOGÍA: lista de etapas ── */}
      <Box px={{ base: 5, md: 10, lg: 16 }} py={{ base: 8, md: 12 }}>
        <VStack spacing={5} align="stretch" maxW="850px" mx="auto">
          {etapasVisibles.map((e, index) => {
            const v = valorOf(data, e.key);
            const desbloqueado = index <= siguienteIdx || todoCompletado;
            const esActual = index === siguienteIdx;
            const bloqueado = !desbloqueado;
            const completa = esEtapaCompleta(v);

            const borderColor = bloqueado
              ? `${neuropsicologiaBg}22`
              : esActual
              ? neuropsicologiaBg
              : `${neuropsicologiaBg}66`;
            const boxShadow = bloqueado
              ? "none"
              : esActual
              ? `0 0 32px ${neuropsicologiaBg}cc, 0 0 80px ${neuropsicologiaBg}77, 0 0 140px ${neuropsicologiaBg}44`
              : `0 0 22px ${neuropsicologiaBg}55, 0 0 60px ${neuropsicologiaBg}33`;

            return (
              <Box
                key={e.key}
                position="relative"
                borderRadius="2xl"
                overflow="hidden"
                bg={`${neuropsicologiaBg}eb`}
                border={`${esActual ? 2 : 1.5}px solid ${borderColor}`}
                boxShadow={boxShadow}
                opacity={bloqueado ? 0.4 : 1}
                filter={bloqueado ? "grayscale(0.45)" : "none"}
                pointerEvents={bloqueado ? "none" : "auto"}
                cursor={bloqueado ? "not-allowed" : "pointer"}
                onClick={bloqueado ? undefined : () => navigate(`/metodo/psicologia/${e.key}`)}
                transition="all 0.3s ease"
                _hover={bloqueado ? undefined : {
                  transform: "translateY(-2px)",
                  boxShadow: esActual
                    ? `0 0 40px ${neuropsicologiaBg}, 0 0 100px ${neuropsicologiaBg}88`
                    : `0 0 30px ${neuropsicologiaBg}88, 0 0 70px ${neuropsicologiaBg}55`,
                }}
                px={{ base: 6, md: 8 }}
                py={{ base: 5, md: 6 }}
              >
                <Flex align="center" gap={{ base: 4, md: 6 }}>
                  {/* Número de etapa */}
                  <Box
                    flexShrink={0}
                    w={{ base: "44px", md: "54px" }}
                    h={{ base: "44px", md: "54px" }}
                    borderRadius="full"
                    bg={neuropsicologiaTxt}
                    color={neuropsicologiaBg}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontFamily="'EB Garamond', serif"
                    fontWeight="700"
                    fontSize={{ base: "lg", md: "xl" }}
                    boxShadow={`0 0 14px ${neuropsicologiaTxt}66`}
                  >
                    {index + 1}
                  </Box>

                  {/* Texto */}
                  <Box flex="1">
                    <Flex align="center" gap={2}>
                      <Text
                        color={neuropsicologiaTxt}
                        fontSize={{ base: "lg", md: "2xl" }}
                        fontWeight="700"
                        letterSpacing="0.04em"
                      >
                        {e.label}
                      </Text>
                      {completa && (
                        <Box as="span" color={neuropsicologiaTxt} fontSize="lg" opacity={0.85} title="Completada">
                          ✓
                        </Box>
                      )}
                    </Flex>
                    <Text
                      color={neuropsicologiaTxt}
                      fontSize={{ base: "sm", md: "md" }}
                      opacity={0.75}
                      letterSpacing="0.04em"
                      mt={0.5}
                    >
                      {e.rango}
                    </Text>
                  </Box>

                  {/* Flecha */}
                  {!bloqueado && (
                    <Box color={neuropsicologiaTxt} fontSize="2xl" opacity={0.7} flexShrink={0}>
                      →
                    </Box>
                  )}
                </Flex>
              </Box>
            );
          })}
        </VStack>
      </Box>

      <SiteFooter />
    </Box>
  );
}
