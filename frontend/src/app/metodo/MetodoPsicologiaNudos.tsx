import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Input, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { NudoEspiralIcon } from "../../components/metodo/NudoEspiralIcon";
import {
  experienciaById,
  NUDOS,
  type LineaDeVidaData,
} from "../../components/metodo/psicologiaRecorrido";
import { AZUL, glowPanel, glowHeader, azulBorde } from "../../components/metodo/psicologiaGlow";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt;
const PAPEL = "#fbf4e8";
// Halo claro (crema + color de la disciplina) para despegar la tinta del fondo.
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

export default function MetodoPsicologiaNudos() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  const [nudos, setNudos] = useState<string[]>([]);
  const [entrada, setEntrada] = useState("");
  const [guardando, setGuardando] = useState(false);
  const dataRef = useRef<LineaDeVidaData>({});

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
        dataRef.current = d;
        setNudos(Array.isArray(d.nudos) ? d.nudos : []);
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  const persistir = async (nuevosNudos: string[]) => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    setGuardando(true);
    try {
      const next = { ...dataRef.current, nudos: nuevosNudos };
      await axios.patch(
        `${API_URL}/metodo-psicologia/${userId}`,
        { data: next },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dataRef.current = next;
    } catch {
      // silencioso
    } finally {
      setGuardando(false);
    }
  };

  const añadirNudo = (texto: string) => {
    const t = texto.trim();
    if (!t) return;
    if (nudos.some((n) => n.toLowerCase() === t.toLowerCase())) { setEntrada(""); return; }
    const next = [...nudos, t];
    setNudos(next);
    setEntrada("");
    void persistir(next);
  };

  const quitarNudo = (i: number) => {
    const next = nudos.filter((_, idx) => idx !== i);
    setNudos(next);
    void persistir(next);
  };

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }
  if (!exp) return null;

  const ejemplosDisponibles = NUDOS.ejemplos.filter(
    (e) => !nudos.some((n) => n.toLowerCase() === e.toLowerCase()),
  );

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box position="relative" flex="1">
        <Flex position="relative" zIndex={1} justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
          <Flex direction="column" align="center" w="100%" maxW="760px" gap={{ base: 7, md: 9 }}>

            <MetodoStepHeader
              icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
              title="Nudos"
              bgColor={`${neuropsicologiaBg}f0`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              step={{ current: 5, total: 13 }}
              mb={0}
              boxShadow={glowHeader}
              prev={{ label: "← Huellas", onClick: () => navigate(`/metodo/psicologia/${exp.id}/huellas`) }}
              next={{ label: "Necesidades →", onClick: () => navigate(`/metodo/psicologia/${exp.id}/necesidades`) }}
            />


            {/* Box principal: pregunta + entrada + ejemplos + nudos seleccionados */}
            <Box
              position="relative"
              w="100%"
              borderRadius="2xl"
              overflow="hidden"
              border={azulBorde}
              boxShadow={glowPanel}
            >
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
              <Flex position="relative" zIndex={1} direction="column" align="center" gap={{ base: 6, md: 7 }} px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}>

                {/* Pregunta principal */}
                <Flex direction="column" align="center" textAlign="center" gap={3} maxW="620px">
                  <Flex align="center" justify="center" gap={3}>
                    <NudoEspiralIcon size={34} color={TINTA} strokeWidth={1.7} />
                    <Text color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1.3" style={{ textShadow: INK_SHADOW }}>
                      {NUDOS.pregunta}
                    </Text>
                  </Flex>
                </Flex>

                {/* Entrada para añadir nudos */}
                <Flex w="100%" maxW="560px" gap={3} direction={{ base: "column", sm: "row" }}>
                  <Input
                    value={entrada}
                    onChange={(e) => setEntrada(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") añadirNudo(entrada); }}
                    placeholder="Escribe un nudo y pulsa Añadir…"
                    flex="1"
                    bg="rgba(255,251,243,0.72)"
                    border={`1px solid ${TINTA}33`}
                    color={TINTA}
                    borderRadius="xl"
                    size="lg"
                    fontFamily="'EB Garamond', serif"
                    fontSize={{ base: "md", md: "lg" }}
                    sx={{ caretColor: TINTA }}
                    _placeholder={{ color: `${TINTA}66`, fontStyle: "italic" }}
                    _hover={{ borderColor: `${TINTA}55` }}
                    _focus={{ borderColor: `${TINTA}88`, boxShadow: `0 0 0 1px ${TINTA}33`, bg: "rgba(255,251,243,0.85)" }}
                  />
                  <Box
                    as="button"
                    onClick={() => añadirNudo(entrada)}
                    position="relative"
                    overflow="hidden"
                    px={8}
                    borderRadius="xl"
                    bg={TINTA}
                    border={`1.5px solid ${TINTA}`}
                    fontFamily="'EB Garamond', serif"
                    fontWeight="700"
                    fontSize={{ base: "md", md: "lg" }}
                    letterSpacing="0.04em"
                    cursor="pointer"
                    py={{ base: 3, sm: 0 }}
                    boxShadow={`0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a`}
                    transition="all 0.2s"
                    _hover={{ transform: "translateY(-2px)", boxShadow: `0 4px 18px rgba(0,0,0,0.28), 0 0 22px ${TINTA}5a` }}
                  >
                    <Box as="span" position="relative" zIndex={1} color={neuropsicologiaBg}
                         style={{ textShadow: `0 1px 2px rgba(0,0,0,0.3)` }}>
                      Añadir
                    </Box>
                  </Box>
                </Flex>

                {/* Ejemplos sugeridos (opcionales) — punteados */}
                {ejemplosDisponibles.length > 0 && (
                  <Flex direction="column" align="center" gap={3} w="100%" maxW="620px">
                    <Text color={TINTA} fontSize="xs" letterSpacing="0.14em" textTransform="uppercase" opacity={0.6} fontWeight="600">
                      Si te sirven de inspiración
                    </Text>
                    <Flex wrap="wrap" justify="center" gap={2}>
                      {ejemplosDisponibles.map((e) => (
                        <Box
                          key={e}
                          as="button"
                          onClick={() => añadirNudo(e)}
                          px={4}
                          py={2}
                          borderRadius="full"
                          bg="rgba(255,251,243,0.35)"
                          color={TINTA}
                          border={`1px dashed ${TINTA}55`}
                          fontFamily="'EB Garamond', serif"
                          fontSize={{ base: "sm", md: "md" }}
                          cursor="pointer"
                          transition="all 0.18s"
                          _hover={{ bg: "rgba(255,251,243,0.6)", borderColor: TINTA }}
                        >
                          + {e}
                        </Box>
                      ))}
                    </Flex>
                  </Flex>
                )}

              </Flex>
            </Box>

            {/* Box «Mis Nudos»: la selección final del usuario */}
            <Box
              position="relative"
              w="100%"
              borderRadius="2xl"
              overflow="hidden"
              border={azulBorde}
              boxShadow={glowPanel}
            >
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
              <Flex position="relative" zIndex={1} direction="column" align="center" gap={{ base: 4, md: 5 }} px={{ base: 6, md: 10 }} py={{ base: 7, md: 9 }}>
                <Flex align="center" justify="center" gap={2.5}>
                  <NudoEspiralIcon size={28} color={TINTA} strokeWidth={1.8} />
                  <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.04em" style={{ textShadow: INK_SHADOW }}>
                    Mis Nudos
                    {nudos.length > 0 && (
                      <Box as="span" ml={2} fontSize={{ base: "sm", md: "md" }} fontWeight="600" opacity={0.7}>({nudos.length})</Box>
                    )}
                  </Text>
                </Flex>
                <Box h="1px" w="70%" maxW="340px" bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />

                {nudos.length > 0 ? (
                  <Flex wrap="wrap" justify="center" gap={2.5} w="100%" maxW="620px">
                    {nudos.map((n, i) => (
                      <Flex
                        key={`${n}-${i}`}
                        align="center"
                        gap={2}
                        pl={4}
                        pr={2}
                        py={2}
                        borderRadius="full"
                        bg="rgba(255,251,243,0.6)"
                        border={`1px solid ${TINTA}66`}
                        boxShadow={`0 0 10px ${AZUL}26`}
                      >
                        <NudoEspiralIcon size={18} color={TINTA} strokeWidth={1.9} />
                        <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} lineHeight="1.3" style={{ textShadow: INK_SHADOW }}>
                          {n}
                        </Text>
                        <Box
                          as="button"
                          onClick={() => quitarNudo(i)}
                          w="22px"
                          h="22px"
                          borderRadius="full"
                          bg="rgba(94,45,16,0.1)"
                          color={TINTA}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          fontSize="xs"
                          cursor="pointer"
                          flexShrink={0}
                          transition="all 0.18s"
                          _hover={{ bg: "rgba(94,45,16,0.22)" }}
                          title="Quitar"
                        >
                          ✕
                        </Box>
                      </Flex>
                    ))}
                  </Flex>
                ) : (
                  <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" opacity={0.7} textAlign="center" style={{ textShadow: INK_SHADOW }}>
                    Aquí aparecerán los nudos que vayas seleccionando.
                  </Text>
                )}

                <Text color={TINTA} fontSize="xs" opacity={0.55} fontStyle="italic" minH="1.2em">
                  {guardando ? "Guardando…" : nudos.length > 0 ? "Cada nudo se guarda según lo seleccionas." : ""}
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Flex>
      </Box>

      <AyudaRecorrido pagina="nudos" />

      <SiteFooter />
    </Box>
  );
}
