import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import {
  experienciaById,
  ETAPAS_VITALES,
  aniosConRecuerdo,
  recuerdoDeAno,
  huellaMarcada,
  anoNatural,
  type LineaDeVidaData,
} from "../../components/metodo/psicologiaRecorrido";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt;
const PAPEL = "#fbf4e8";
const CREMA = "rgba(255,255,255,0.92)";    // texto sobre el fondo teal de la página
// Halo claro (crema + color de la disciplina) para despegar la tinta del fondo.
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

export default function MetodoPsicologiaHuellas() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LineaDeVidaData>({});
  const [guardando, setGuardando] = useState(false);
  const guardadoRef = useRef<LineaDeVidaData>({});

  const anioActual = new Date().getFullYear();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!exp) { navigate("/metodo/psicologia", { replace: true }); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!me.data?.psicologia_suscrito) { navigate("/metodo/psicologia", { replace: true }); return; }

        const psi = await axios.get(`${API_URL}/metodo-psicologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d: LineaDeVidaData = psi.data?.data || {};
        setData(d);
        guardadoRef.current = JSON.parse(JSON.stringify(d));
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  const persistir = async (next: LineaDeVidaData) => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    setGuardando(true);
    try {
      await axios.patch(
        `${API_URL}/metodo-psicologia/${userId}`,
        { data: next },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      guardadoRef.current = JSON.parse(JSON.stringify(next));
    } catch {
      // silencioso
    } finally {
      setGuardando(false);
    }
  };

  const toggleHuella = async (edadAno: number) => {
    const anos = { ...(data.anos || {}) };
    const ano = { ...(anos[String(edadAno)] || {}) };
    ano.huella = !ano.huella;
    anos[String(edadAno)] = ano;
    const next = { ...data, anos };
    setData(next);
    await persistir(next);
  };

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }
  if (!exp) return null;

  const edad = typeof data.edad === "number" ? data.edad : 0;
  const anios = aniosConRecuerdo(data, edad);
  // Agrupamos los recuerdos por capítulo vital (solo capítulos con recuerdos).
  const capitulos = ETAPAS_VITALES
    .map((et) => ({ et, anios: anios.filter((a) => a >= et.min && a <= et.max) }))
    .filter((c) => c.anios.length > 0);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
        <Flex direction="column" align="center" w="100%" maxW="820px" gap={{ base: 6, md: 8 }}>

          {/* Botones de navegación arriba (en el header) */}
          <MetodoStepHeader
            icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
            title="Las Huellas"
            pageLabel="4/9"
            bgColor={`${neuropsicologiaBg}f0`}
            color={neuropsicologiaTxt}
            nom={neuropsicologiaNom}
            mb={0}
            prev={{ label: "← Línea de Vida", onClick: () => navigate(`/metodo/psicologia/${exp.id}`) }}
            next={{ label: "Los Nudos →", onClick: () => navigate(`/metodo/psicologia/${exp.id}/nudos`) }}
          />

          {/* Intro (sobre el fondo teal → texto crema) */}
          <Flex direction="column" align="center" textAlign="center" gap={3} maxW="600px">
            <Text color={CREMA} fontSize={{ base: "2xl", md: "4xl" }} fontWeight="700" letterSpacing="0.02em" lineHeight="1.2" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.3)" }}>
              Las huellas de tu historia
            </Text>
            <Text color={CREMA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" opacity={0.9} lineHeight="1.8">
              Recorre de nuevo tu historia. No busques los acontecimientos más importantes: marca aquellos que dejaron huella.
            </Text>
          </Flex>

          {/* BOX delimitado con TODOS los recuerdos, agrupados por capítulo */}
          <Box
            position="relative"
            w="100%"
            borderRadius="2xl"
            overflow="hidden"
            border={`1px solid ${TINTA}33`}
            boxShadow={`0 12px 44px rgba(94,45,16,0.2), 0 0 0 1px ${neuropsicologiaBg}55`}
          >
            <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 6, md: 11 }} py={{ base: 8, md: 11 }}>
              {capitulos.length === 0 ? (
                <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" opacity={0.8} textAlign="center" py={6}>
                  Todavía no has escrito recuerdos en tu línea de vida. Vuelve atrás y visita los años que quieras recordar.
                </Text>
              ) : (
                <Flex direction="column" gap={{ base: 9, md: 11 }}>
                  {capitulos.map(({ et, anios: aniosCap }) => (
                    <Box key={et.id}>
                      {/* Portada de capítulo */}
                      <Flex direction="column" align="center" textAlign="center" gap={1} mb={{ base: 6, md: 7 }}>
                        <Text color={TINTA} fontSize={{ base: "2xs", md: "xs" }} letterSpacing="0.28em" textTransform="uppercase" opacity={0.6} fontWeight="600">
                          Capítulo
                        </Text>
                        <Text color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" letterSpacing="0.02em" lineHeight="1.15" style={{ textShadow: INK_SHADOW }}>
                          {et.nombre}
                        </Text>
                        <Box mt={2} h="1px" w="120px" bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />
                      </Flex>

                      {/* Recuerdos del capítulo */}
                      <Flex direction="column" gap={{ base: 5, md: 6 }}>
                        {aniosCap.map((a) => {
                          const texto = recuerdoDeAno(data, a, exp.preguntasPorAno);
                          const marcada = huellaMarcada(data, a);
                          return (
                            <Box
                              key={a}
                              borderRadius="xl"
                              px={{ base: 5, md: 7 }}
                              py={{ base: 5, md: 6 }}
                              border={`1px solid ${marcada ? TINTA : `${TINTA}22`}`}
                              bg={marcada ? `${TINTA}12` : "rgba(255,251,243,0.28)"}
                              boxShadow={marcada ? `0 0 16px ${TINTA}33, inset 0 0 0 1px ${TINTA}33` : "none"}
                              transition="all 0.28s ease"
                            >
                              <Flex align="baseline" gap={3} mb={2} wrap="wrap">
                                <Text color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1" style={{ textShadow: INK_SHADOW }}>
                                  {anoNatural(edad, a, anioActual)}
                                </Text>
                                <Text color={TINTA} fontSize="sm" opacity={0.55}>· {a} años</Text>
                              </Flex>
                              <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" whiteSpace="pre-line" fontStyle="italic" opacity={0.92} style={{ textShadow: INK_SHADOW }}>
                                “{texto}”
                              </Text>

                              {/* Marca de huella */}
                              <Flex justify="flex-end" mt={4}>
                                <Box
                                  as="button"
                                  onClick={() => toggleHuella(a)}
                                  px={5}
                                  py={2.5}
                                  borderRadius="full"
                                  bg={marcada ? TINTA : "rgba(255,251,243,0.55)"}
                                  color={marcada ? PAPEL : TINTA}
                                  border={`1px solid ${marcada ? TINTA : `${TINTA}55`}`}
                                  fontFamily="'EB Garamond', serif"
                                  fontSize={{ base: "sm", md: "md" }}
                                  letterSpacing="0.03em"
                                  cursor="pointer"
                                  boxShadow={marcada ? `0 0 16px ${TINTA}66` : "none"}
                                  transition="all 0.24s ease"
                                  _hover={{ transform: "translateY(-1px)", borderColor: TINTA }}
                                  display="inline-flex"
                                  alignItems="center"
                                  gap={2}
                                >
                                  <Box as="span" style={marcada ? { filter: `drop-shadow(0 0 6px ${PAPEL}88)` } : undefined}>✦</Box>
                                  {marcada ? "Dejó huella" : "Este recuerdo dejó huella"}
                                </Box>
                              </Flex>
                            </Box>
                          );
                        })}
                      </Flex>
                    </Box>
                  ))}
                </Flex>
              )}
            </Box>
          </Box>

          <Text color={CREMA} fontSize="xs" opacity={0.6} fontStyle="italic" minH="1.2em">
            {guardando ? "Guardando…" : "Tus huellas se guardan solas."}
          </Text>
        </Flex>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
