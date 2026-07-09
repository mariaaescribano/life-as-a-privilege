import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box, Flex, Text,
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IntroRecorrido } from "../../components/metodo/IntroRecorrido";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import {
  experienciaById,
  NECESIDADES,
  NECESIDADES_INTRO,
  ESTADOS_NECESIDAD,
  opcionNecesidad,
  necesidadesRespondidas,
  type LineaDeVidaData,
  type Necesidad,
  type EstadoNecesidad,
} from "../../components/metodo/psicologiaRecorrido";
import { AZUL, glowHeader } from "../../components/metodo/psicologiaGlow";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt;
const PAPEL = "#fbf4e8";
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

export default function MetodoPsicologiaNecesidades() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  const [respuestas, setRespuestas] = useState<Record<string, EstadoNecesidad>>({});
  const [abierta, setAbierta] = useState<Necesidad | null>(null);
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
        setRespuestas(d.necesidades && typeof d.necesidades === "object" ? { ...d.necesidades } : {});
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  const marcar = (key: string, value: EstadoNecesidad) => {
    const next = { ...respuestas, [key]: value };
    setRespuestas(next);
    setAbierta(null);

    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    setGuardando(true);
    const payload = { ...dataRef.current, necesidades: next };
    dataRef.current = payload;
    axios.patch(
      `${API_URL}/metodo-psicologia/${userId}`,
      { data: payload },
      { headers: { Authorization: `Bearer ${token}` } },
    ).catch(() => { /* silencioso */ }).finally(() => setGuardando(false));
  };

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }
  if (!exp) return null;

  const respondidas = necesidadesRespondidas({ necesidades: respuestas });
  const total = NECESIDADES.length;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
        <Flex direction="column" align="center" w="100%" maxW="1040px" gap={{ base: 7, md: 9 }}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
            title="Necesidades"
            bgColor={`${neuropsicologiaBg}f0`}
            color={neuropsicologiaTxt}
            nom={neuropsicologiaNom}
            step={{ current: 8, total: 20 }}
            mb={0}
            boxShadow={glowHeader}
            prev={{ label: "← Nudos", onClick: () => navigate(`/metodo/psicologia/${exp.id}/nudos`) }}
            next={{ label: "Heridas →", onClick: () => navigate(`/metodo/psicologia/${exp.id}/huellas-nudos`) }}
          />
          </Reveal>

          {/* ── Directo sobre el turquesa: subtítulo + acceso a la explicación + progreso ── */}
          <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%" display="flex" justifyContent="center">
          <Flex direction="column" align="center" gap={{ base: 4, md: 5 }} w="100%" maxW="640px">
            <IntroRecorrido>{NECESIDADES_INTRO.subtitulo}</IntroRecorrido>

            {/* Progreso — sobre el turquesa, en color psicología */}
            <Flex align="center" gap={3} w="100%" maxW="380px">
              <Box flex="1" h="7px" borderRadius="full" bg="rgba(255,255,255,0.22)" overflow="hidden">
                <Box h="100%" borderRadius="full" w={`${(respondidas / total) * 100}%`}
                     bg={TINTA} boxShadow={`0 0 10px ${TINTA}cc`} transition="width 0.4s ease" />
              </Box>
              <Text color={TINTA} fontSize="sm" fontWeight="700" whiteSpace="nowrap"
                    style={{ textShadow: "0 0 10px rgba(255,255,255,0.55), 0 1px 2px rgba(255,255,255,0.7)" }}>
                {respondidas}/{total}
              </Text>
            </Flex>
          </Flex>
          </Reveal>

          {/* ── Grid de celdas · van apareciendo una a una al bajar el scroll
                 (con un leve desfase izquierda→derecha dentro de cada fila) ── */}
          <Box
            display="grid"
            w="100%"
            gridTemplateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
            gap={{ base: 4, md: 5 }}
          >
            {NECESIDADES.map((n, idx) => {
              const op = opcionNecesidad(respuestas[n.key]);
              const marcada = !!op;
              const acento = op?.color ?? AZUL;
              return (
                <Reveal key={n.key} inView direction="up" distance={26} duration={0.5} amount={0.25} delay={(idx % 3) * 0.06} display="flex">
                <Flex
                  flex="1"
                  minW={0}
                  direction="column"
                  align="center"
                  justify="space-between"
                  textAlign="center"
                  position="relative"
                  overflow="hidden"
                  borderRadius="2xl"
                  minH={{ base: "140px", md: "170px" }}
                  px={{ base: 5, md: 6 }}
                  py={{ base: 5, md: 6 }}
                  gap={3}
                  border="none"
                  boxShadow={marcada ? `inset 0 0 0 9999px ${acento}14` : "none"}
                  transition="box-shadow 0.3s ease, border-color 0.3s ease, transform 0.2s ease"
                >
                  <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />

                  {/* Punto de estado (esquina) */}
                  {marcada && (
                    <Box position="absolute" zIndex={2} top={3} right={3} w="13px" h="13px" borderRadius="full"
                         bg={acento} boxShadow={`0 0 10px ${acento}`} border={`2px solid ${PAPEL}`} />
                  )}

                  <Text position="relative" zIndex={1} color={TINTA} fontSize={{ base: "lg", md: "xl" }}
                        fontWeight="700" lineHeight="1.25" style={{ textShadow: INK_SHADOW }}>
                    {n.necesidad}
                  </Text>

                  {/* Botón central */}
                  <Box
                    as="button"
                    onClick={() => setAbierta(n)}
                    position="relative"
                    zIndex={1}
                    px={6}
                    py={2.5}
                    borderRadius="full"
                    bg={marcada ? acento : "rgba(255,251,243,0.55)"}
                    border={`1.5px solid ${marcada ? acento : `${TINTA}55`}`}
                    color={marcada ? PAPEL : TINTA}
                    fontFamily="'EB Garamond', serif"
                    fontWeight="700"
                    fontSize={{ base: "sm", md: "md" }}
                    letterSpacing="0.03em"
                    whiteSpace="nowrap"
                    cursor="pointer"
                    boxShadow={marcada ? `0 4px 16px ${acento}66` : `0 0 10px ${AZUL}22`}
                    transition="all 0.2s"
                    _hover={{ transform: "translateY(-2px)", boxShadow: marcada ? `0 6px 22px ${acento}88` : `0 0 16px ${AZUL}44` }}
                    style={marcada ? { textShadow: "0 1px 3px rgba(60,28,10,0.45)" } : { textShadow: `0 1px 2px ${PAPEL}` }}
                  >
                    {marcada ? `${op!.label} ✓` : "Reflexionar"}
                  </Box>
                </Flex>
                </Reveal>
              );
            })}
          </Box>

          {guardando && (
            <Text color="rgba(255,255,255,0.7)" fontSize="xs" fontStyle="italic">Guardando…</Text>
          )}
        </Flex>
      </Flex>

      {/* ── Popup: respuesta sana + marcar cómo lo viví ── */}
      <Modal isOpen={!!abierta} onClose={() => setAbierta(null)} isCentered scrollBehavior="inside" size={{ base: "sm", md: "lg" }}>
        <ModalOverlay bg="rgba(0,0,0,0.82)" sx={{ backdropFilter: "blur(6px)" }} />
        <ModalContent bg="transparent" boxShadow="none" overflow="visible" mx={4} fontFamily="'EB Garamond', serif">
          <Box position="relative" borderRadius="2xl" overflow="hidden" boxShadow={`0 26px 70px rgba(40,18,4,0.55)`}>
            <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
            <ModalCloseButton color={TINTA} zIndex={3} />
            <ModalBody position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}>
              {abierta && (
                <Flex direction="column" align="center" textAlign="center" gap={4}>
                  <Text color={TINTA} fontSize="2xs" fontWeight="700" letterSpacing="0.22em" textTransform="uppercase" opacity={0.65}>
                    Necesidad del niño
                  </Text>
                  <Text color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1.25" style={{ textShadow: INK_SHADOW }}>
                    {abierta.necesidad}
                  </Text>

                  <Box h="1px" w="55%" maxW="240px" bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />
                  <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.7" maxW="460px" style={{ textShadow: INK_SHADOW }}>
                    {abierta.respuesta}
                  </Text>

                  <Box h="1px" w="55%" maxW="240px" bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} mt={1} />

                  <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="700" style={{ textShadow: INK_SHADOW }}>
                    ¿Cómo lo viviste tú?
                  </Text>

                  <Flex direction={{ base: "column", sm: "row" }} gap={3} w="100%" maxW="460px" justify="center">
                    {ESTADOS_NECESIDAD.map((o) => {
                      const elegido = respuestas[abierta.key] === o.value;
                      return (
                        <Box
                          key={o.value}
                          as="button"
                          onClick={() => marcar(abierta.key, o.value)}
                          flex="1"
                          px={4}
                          py={3}
                          borderRadius="xl"
                          bg={elegido ? o.color : "rgba(255,251,243,0.6)"}
                          border={`1.5px solid ${o.color}`}
                          color={elegido ? PAPEL : TINTA}
                          fontFamily="'EB Garamond', serif"
                          fontWeight="700"
                          fontSize={{ base: "md", md: "md" }}
                          cursor="pointer"
                          boxShadow={elegido ? `0 4px 18px ${o.color}77` : "none"}
                          transition="all 0.18s"
                          _hover={{ transform: "translateY(-2px)", bg: elegido ? o.color : `${o.color}26`, boxShadow: `0 6px 20px ${o.color}55` }}
                          style={elegido ? { textShadow: "0 1px 3px rgba(60,28,10,0.45)" } : undefined}
                        >
                          <Text>{o.label}</Text>
                          <Text fontSize="2xs" fontWeight="500" opacity={elegido ? 0.92 : 0.7} mt={0.5} lineHeight="1.2">
                            {o.descripcion}
                          </Text>
                        </Box>
                      );
                    })}
                  </Flex>
                </Flex>
              )}
            </ModalBody>
          </Box>
        </ModalContent>
      </Modal>

      <AyudaRecorrido pagina="necesidades" />

      <SiteFooter />
    </Box>
  );
}
