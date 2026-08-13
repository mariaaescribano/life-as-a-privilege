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
import { PsicologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IntroRecorrido } from "../../components/metodo/IntroRecorrido";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import {
  experienciaById,
  opcionNecesidad,
  necesidadesRespondidas,
  necesidadesCompletas,
  necesidadDesbloqueada,
  type LineaDeVidaData,
  type Necesidad,
  type EstadoNecesidad,
} from "../../components/metodo/psicologiaRecorrido";
import { useEstadosNecesidad, useNecesidades, useNecesidadesIntro } from "../../components/metodo/psicologiaRecorrido.en";
import { AZUL, glowHeader } from "../../components/metodo/psicologiaGlow";
import { flushSaves } from "../../utils/flushSaves";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";
import { useT } from "../../i18n";

const TINTA = neuropsicologiaTxt;
const PAPEL = "#fbf4e8";
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

export default function MetodoPsicologiaNecesidades() {
  const t = useT();
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");
  // Las necesidades en el idioma activo; las `key` y los colores los sigue
  // poniendo el español, que es lo que se guarda.
  const necesidades = useNecesidades();
  const necesidadesIntro = useNecesidadesIntro();
  const estadosNecesidad = useEstadosNecesidad();

  const [loading, setLoading] = useState(true);
  const [respuestas, setRespuestas] = useState<Record<string, EstadoNecesidad>>({});
  const [abierta, setAbierta] = useState<Necesidad | null>(null);
  const dataRef = useRef<LineaDeVidaData>({});
  // Último guardado en vuelo: se espera (flush) antes de ir a Heridas, cuya
  // página rebota si lee del backend unas necesidades aún incompletas.
  const savePromiseRef = useRef<Promise<unknown>>(Promise.resolve());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
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

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    const payload = { ...dataRef.current, necesidades: next };
    dataRef.current = payload;
    savePromiseRef.current = axios.patch(
      `${API_URL}/metodo-psicologia/${userId}`,
      { data: payload },
      { headers: { Authorization: `Bearer ${token}` } },
    ).catch(() => { /* silencioso */ });
  };

  if (loading) {
    return <PsicologiaLoading />;
  }
  if (!exp) return null;

  const respondidas = necesidadesRespondidas({ necesidades: respuestas });
  const total = necesidades.length;
  const completas = necesidadesCompletas({ necesidades: respuestas });

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
        <Flex direction="column" align="center" w="100%" maxW="1040px" gap={{ base: 7, md: 9 }}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
            title={t("metodo.psico.paso.necesidades")}
            bgColor={`${neuropsicologiaBg}f0`}
            color={neuropsicologiaTxt}
            nom={neuropsicologiaNom}
            step={{ current: 12, total: 25 }}
            mb={0}
            boxShadow={glowHeader}
            prev={{ label: `← ${t("metodo.psico.paso.nudos")}`, onClick: () => navigate(`/metodo/psicologia/${exp.id}/nudos`) }}
            next={{
              label: `${t("metodo.psico.paso.heridas")} →`,
              onClick: async () => { await savePromiseRef.current; await flushSaves(); navigate(`/metodo/psicologia/${exp.id}/huellas-nudos`); },
              disabled: !completas,
              disabledTooltip: t("metodo.psico.faltaNecesidades"),
            }}
          />
          </Reveal>

          {/* ── Directo sobre el turquesa: subtítulo + acceso a la explicación + progreso ── */}
          <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%" display="flex" justifyContent="center">
          <Flex direction="column" align="center" gap={{ base: 4, md: 5 }} w="100%" maxW="640px">
            <IntroRecorrido>{necesidadesIntro.subtitulo}</IntroRecorrido>

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
            {necesidades.map((n, idx) => {
              const op = opcionNecesidad(respuestas[n.key]);
              const marcada = !!op;
              const acento = op?.color ?? AZUL;
              const desbloqueada = necesidadDesbloqueada({ necesidades: respuestas }, idx);
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
                  opacity={desbloqueada ? 1 : 0.55}
                  boxShadow={marcada ? `inset 0 0 0 9999px ${acento}14` : "none"}
                  transition="box-shadow 0.3s ease, border-color 0.3s ease, transform 0.2s ease, opacity 0.3s ease"
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

                  {/* Botón central — bloqueado hasta que se responda la anterior */}
                  {desbloqueada ? (
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
                  ) : (
                    <Flex
                      position="relative"
                      zIndex={1}
                      align="center"
                      justify="center"
                      gap={2}
                      px={6}
                      py={2.5}
                      borderRadius="full"
                      bg="rgba(255,251,243,0.3)"
                      border={`1.5px solid ${TINTA}33`}
                      color={`${TINTA}aa`}
                      fontFamily="'EB Garamond', serif"
                      fontWeight="700"
                      fontSize={{ base: "sm", md: "md" }}
                      letterSpacing="0.03em"
                      whiteSpace="nowrap"
                      cursor="not-allowed"
                      title={t("metodo.psico.respondeAnterior")}
                    >
                      <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                           w="15px" h="15px" fill="currentColor" flexShrink={0}>
                        <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z" />
                      </Box>{t("metodo.psico.bloqueada")}</Flex>
                  )}
                </Flex>
                </Reveal>
              );
            })}
          </Box>
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
                  <Text color={TINTA} fontSize="2xs" fontWeight="700" letterSpacing="0.22em" textTransform="uppercase" opacity={0.65}>{t("metodo.psico.necesidadDelNino")}</Text>
                  <Text color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1.25" style={{ textShadow: INK_SHADOW }}>
                    {abierta.necesidad}
                  </Text>

                  <Box h="1px" w="55%" maxW="240px" bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />
                  <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} lineHeight="1.7" maxW="460px" style={{ textShadow: INK_SHADOW }}>
                    {abierta.respuesta}
                  </Text>

                  <Box h="1px" w="55%" maxW="240px" bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} mt={1} />

                  <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="700" style={{ textShadow: INK_SHADOW }}>{t("metodo.psico.comoLoViviste")}</Text>

                  <Flex direction={{ base: "column", sm: "row" }} gap={3} w="100%" maxW="460px" justify="center">
                    {estadosNecesidad.map((o) => {
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
