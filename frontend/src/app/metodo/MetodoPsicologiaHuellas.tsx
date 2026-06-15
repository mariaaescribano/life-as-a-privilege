import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { PsicologiaBg } from "../../components/metodo/PsicologiaBg";
import {
  experienciaById,
  ETAPAS_VITALES,
  aniosConRecuerdo,
  recuerdoDeAno,
  huellaMarcada,
  anoNatural,
  type LineaDeVidaData,
  type EtapaVital,
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
const INK_SHADOW = `0 1px 2px rgba(94,45,16,0.18)`;

const pasarPagina = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

type Pagina =
  | { tipo: "portada"; etapa: EtapaVital }
  | { tipo: "recuerdo"; edadAno: number }
  | { tipo: "resumen" };

export default function MetodoPsicologiaHuellas() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LineaDeVidaData>({});
  const [idx, setIdx] = useState(0);
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

  const edad = typeof data.edad === "number" ? data.edad : 0;

  // Construye el libro: portada de capítulo + páginas de recuerdo por etapa, y resumen final.
  const paginas = useMemo<Pagina[]>(() => {
    const anios = aniosConRecuerdo(data, edad);
    const out: Pagina[] = [];
    for (const etapa of ETAPAS_VITALES) {
      const deEtapa = anios.filter((a) => a >= etapa.min && a <= etapa.max);
      if (deEtapa.length === 0) continue;
      out.push({ tipo: "portada", etapa });
      for (const a of deEtapa) out.push({ tipo: "recuerdo", edadAno: a });
    }
    out.push({ tipo: "resumen" });
    return out;
  }, [data, edad]);

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

  const pagina = paginas[Math.min(idx, paginas.length - 1)];
  const numeradas = paginas.filter((p) => p.tipo !== "resumen").length;
  const irA = (n: number) => {
    setIdx(Math.max(0, Math.min(paginas.length - 1, n)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box position="relative" flex="1" overflow="hidden">
        <PsicologiaBg overlay="rgba(247,236,220,0.24)" />

        <Flex position="relative" zIndex={1} justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
          <Flex direction="column" align="center" w="100%" maxW="780px" gap={{ base: 7, md: 9 }}>

            <MetodoStepHeader
              icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
              title="Las Huellas"
              bgColor={`${neuropsicologiaBg}f0`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              mb={0}
              prev={{ label: "← Recorrido", onClick: () => navigate("/metodo/psicologia") }}
            />

            <Text color={TINTA} fontSize={{ base: "xs", md: "sm" }} letterSpacing="0.22em" textTransform="uppercase" opacity={0.6} fontWeight="600" mt={-2}>
              {exp.titulo}
            </Text>

            {/* La página actual del libro */}
            <Box
              key={idx}
              w="100%"
              minH={{ base: "46vh", md: "52vh" }}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              animation={`${pasarPagina} 0.5s ease`}
            >
              {pagina.tipo === "portada" && (
                <Flex direction="column" align="center" gap={5} py={{ base: 8, md: 12 }}>
                  <Text color={TINTA} fontSize="2xl" opacity={0.8} style={{ filter: `drop-shadow(0 0 6px ${TINTA}44)` }}>✦</Text>
                  <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} letterSpacing="0.28em" textTransform="uppercase" opacity={0.65} fontWeight="600">
                    Capítulo
                  </Text>
                  <Text color={TINTA} fontSize={{ base: "4xl", md: "6xl" }} fontWeight="700" letterSpacing="0.02em" lineHeight="1.1" style={{ textShadow: INK_SHADOW }}>
                    {pagina.etapa.nombre}
                  </Text>
                  <Box h="1px" w="140px" bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />
                  <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" opacity={0.8}>
                    {pagina.etapa.min}–{pagina.etapa.max >= 200 ? "" : pagina.etapa.max} {pagina.etapa.max >= 200 ? "años en adelante" : "años"}
                  </Text>
                </Flex>
              )}

              {pagina.tipo === "recuerdo" && (() => {
                const texto = recuerdoDeAno(data, pagina.edadAno, exp.preguntasPorAno);
                const marcada = huellaMarcada(data, pagina.edadAno);
                return (
                  <Flex direction="column" align="center" gap={{ base: 7, md: 9 }} py={{ base: 6, md: 10 }} maxW="600px">
                    <Text color={TINTA} fontSize={{ base: "5xl", md: "7xl" }} fontWeight="700" lineHeight="1" opacity={0.92} style={{ textShadow: INK_SHADOW }}>
                      {anoNatural(edad, pagina.edadAno, anioActual)}
                    </Text>
                    <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} lineHeight="1.85" whiteSpace="pre-line" fontStyle="italic">
                      “{texto}”
                    </Text>

                    {/* Única acción: marcar huella */}
                    <Box
                      as="button"
                      onClick={() => toggleHuella(pagina.edadAno)}
                      mt={2}
                      px={7}
                      py={3}
                      borderRadius="full"
                      bg={marcada ? TINTA : "rgba(255,251,243,0.55)"}
                      color={marcada ? PAPEL : TINTA}
                      border={`1px solid ${marcada ? TINTA : `${TINTA}55`}`}
                      fontFamily="'EB Garamond', serif"
                      fontSize={{ base: "md", md: "lg" }}
                      letterSpacing="0.04em"
                      cursor="pointer"
                      boxShadow={marcada ? `0 0 18px ${TINTA}66, 0 6px 18px rgba(94,45,16,0.3)` : "none"}
                      transition="all 0.28s ease"
                      _hover={{ transform: "translateY(-2px)", borderColor: TINTA, boxShadow: marcada ? `0 0 26px ${TINTA}88` : `0 4px 14px rgba(94,45,16,0.2)` }}
                      display="inline-flex"
                      alignItems="center"
                      gap={2}
                    >
                      <Box as="span" style={marcada ? { filter: `drop-shadow(0 0 6px ${PAPEL}88)` } : undefined}>✦</Box>
                      {marcada ? "Dejó huella" : "Este recuerdo dejó huella"}
                    </Box>
                  </Flex>
                );
              })()}

              {pagina.tipo === "resumen" && (() => {
                const marcados = aniosConRecuerdo(data, edad).filter((a) => huellaMarcada(data, a));
                return (
                  <Flex direction="column" align="center" gap={6} py={{ base: 6, md: 10 }} w="100%" maxW="620px">
                    <Text color={TINTA} fontSize="2xl" opacity={0.8}>✦</Text>
                    <Text color={TINTA} fontSize={{ base: "3xl", md: "5xl" }} fontWeight="700" letterSpacing="0.02em" lineHeight="1.15" style={{ textShadow: INK_SHADOW }}>
                      Las huellas de tu historia
                    </Text>
                    <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.9" opacity={0.9} maxW="460px">
                      Has señalado aquellos recuerdos que todavía viven en ti. Observémoslos juntos.
                    </Text>
                    <Box h="1px" w="140px" bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} my={2} />

                    {marcados.length === 0 ? (
                      <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" opacity={0.75}>
                        Aún no has marcado ninguna huella. Vuelve atrás y señala los recuerdos que todavía viven en ti.
                      </Text>
                    ) : (
                      <Flex direction="column" gap={6} w="100%">
                        {marcados.map((a) => (
                          <Box key={a} textAlign="center">
                            <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.04em" mb={1}>
                              <Box as="span" mr={2} style={{ filter: `drop-shadow(0 0 5px ${TINTA}55)` }}>✦</Box>
                              {anoNatural(edad, a, anioActual)}
                            </Text>
                            <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" whiteSpace="pre-line" fontStyle="italic" opacity={0.92}>
                              {recuerdoDeAno(data, a, exp.preguntasPorAno)}
                            </Text>
                          </Box>
                        ))}
                      </Flex>
                    )}

                    <Box
                      as="button"
                      mt={6}
                      onClick={() => navigate(`/metodo/psicologia/${exp.id}/nudos`)}
                      px={10}
                      py={3}
                      borderRadius="full"
                      bg={TINTA}
                      color={PAPEL}
                      border={`1px solid ${TINTA}`}
                      fontFamily="'EB Garamond', serif"
                      fontWeight="700"
                      fontSize={{ base: "md", md: "lg" }}
                      letterSpacing="0.06em"
                      cursor="pointer"
                      boxShadow={`0 6px 20px rgba(94,45,16,0.32)`}
                      transition="all 0.2s"
                      _hover={{ transform: "translateY(-2px)", boxShadow: `0 10px 28px rgba(94,45,16,0.42)` }}
                    >
                      Continuar a Los Nudos →
                    </Box>
                  </Flex>
                );
              })()}
            </Box>

            {/* Navegación del libro */}
            {pagina.tipo !== "resumen" && (
              <Flex align="center" justify="center" gap={{ base: 5, md: 8 }} w="100%">
                <Box
                  as="button"
                  onClick={idx === 0 ? undefined : () => irA(idx - 1)}
                  opacity={idx === 0 ? 0.35 : 1}
                  cursor={idx === 0 ? "not-allowed" : "pointer"}
                  color={TINTA}
                  fontSize={{ base: "sm", md: "md" }}
                  letterSpacing="0.04em"
                  px={2}
                  transition="all 0.2s"
                  _hover={idx === 0 ? {} : { opacity: 0.7 }}
                >
                  ← Página anterior
                </Box>
                <Text color={TINTA} fontSize={{ base: "xs", md: "sm" }} opacity={0.7} letterSpacing="0.06em" whiteSpace="nowrap">
                  Página {idx + 1} de {numeradas}
                </Text>
                <Box
                  as="button"
                  onClick={() => irA(idx + 1)}
                  color={TINTA}
                  fontSize={{ base: "sm", md: "md" }}
                  letterSpacing="0.04em"
                  px={2}
                  transition="all 0.2s"
                  _hover={{ opacity: 0.7 }}
                >
                  Página siguiente →
                </Box>
              </Flex>
            )}

            <Text color={TINTA} fontSize="xs" opacity={0.55} fontStyle="italic" minH="1.2em">
              {guardando ? "Guardando…" : ""}
            </Text>
          </Flex>
        </Flex>
      </Box>

      <SiteFooter />
    </Box>
  );
}
