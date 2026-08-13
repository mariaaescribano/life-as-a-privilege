import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Input, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import { PsicologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import { NudoEspiralIcon } from "../../components/metodo/NudoEspiralIcon";
import {
  experienciaById,
  NUDOS,
  type LineaDeVidaData,
} from "../../components/metodo/psicologiaRecorrido";
import { AZUL, glowPanel, glowHeader, azulBorde } from "../../components/metodo/psicologiaGlow";
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
// Halo claro (crema + color de la disciplina) para despegar la tinta del fondo.
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

export default function MetodoPsicologiaNudos() {
  const t = useT();
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
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
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
    return <PsicologiaLoading />;
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

            <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
              title={t("metodo.psico.paso.nudos")}
              bgColor={`${neuropsicologiaBg}f0`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              step={{ current: 9, total: 23 }}
              mb={0}
              boxShadow={glowHeader}
              prev={{ label: `← ${t("metodo.psico.paso.huellas")}`, onClick: () => navigate(`/metodo/psicologia/${exp.id}/huellas`) }}
              next={{
                label: `${t("metodo.psico.paso.necesidades")} →`,
                onClick: async () => { await flushSaves(); navigate(`/metodo/psicologia/${exp.id}/necesidades`); },
                // Hasta que no haya al menos un nudo (elegido o escrito), la
                // siguiente página queda bloqueada. Si los borra todos, se vuelve
                // a bloquear (nudos.length se recalcula).
                disabled: nudos.length === 0,
                disabledTooltip: "Elige o escribe al menos un nudo para continuar.",
              }}
            />
            </Reveal>


            {/* Box principal: pregunta + entrada + ejemplos + nudos seleccionados */}
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%">
            <Box
              position="relative"
              w="100%"
              borderRadius="2xl"
              overflow="hidden"
              border={azulBorde}
              boxShadow={glowPanel}
            >
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
              <Flex position="relative" zIndex={1} direction="column" align="center" gap={{ base: 7, md: 9 }} px={{ base: 6, md: 10 }} py={{ base: 10, md: 14 }}>

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
                    placeholder={t("metodo.psico.escribeNudo")}
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
                    _focus={{ borderColor: TINTA, boxShadow: `0 0 0 1px ${TINTA}66`, bg: "rgba(255,251,243,0.85)" }}
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
                         style={{ textShadow: `0 1px 2px rgba(0,0,0,0.3)` }}>{t("metodo.psico.anadirCorto")}</Box>
                  </Box>
                </Flex>

                {/* Ejemplos sugeridos (opcionales) — punteados. Se ven TODOS a la
                    vez: aquí no hay scroll.
                    Para que el box no dé un salto cada vez que se elige uno, el
                    elegido no se quita de la rejilla: se vuelve invisible y deja
                    su hueco. Así el alto lo fija siempre la lista completa. */}
                <>
                  {/* Separador horizontal completo (ancho del box) */}
                  <Box w="100%" h="1px" bgGradient={`linear(to-r, transparent, ${TINTA}55, transparent)`} />
                  <Flex direction="column" align="center" gap={3} w="100%" maxW="620px" pt={{ base: 1, md: 2 }}>
                    <Text color={TINTA} fontSize="xs" letterSpacing="0.14em" textTransform="uppercase" opacity={0.6} fontWeight="600">{t("metodo.psico.siTeSirven")}</Text>
                    <Box w="100%" position="relative">
                      <Flex wrap="wrap" justify="center" gap={2} py={1}>
                        {NUDOS.ejemplos.map((e) => {
                          const usado = !ejemplosDisponibles.includes(e);
                          return (
                            <Box
                              key={e}
                              as="button"
                              onClick={() => añadirNudo(e)}
                              aria-hidden={usado || undefined}
                              tabIndex={usado ? -1 : undefined}
                              visibility={usado ? "hidden" : "visible"}
                              pointerEvents={usado ? "none" : undefined}
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
                          );
                        })}
                      </Flex>

                      {/* Cuando ya no queda ninguno, el aviso va ENCIMA de los
                          huecos (posición absoluta): si ocupara sitio, el box
                          cambiaría de alto justo al final. */}
                      {ejemplosDisponibles.length === 0 && (
                        <Flex position="absolute" inset={0} align="center" justify="center" pointerEvents="none">
                          <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" opacity={0.6} textAlign="center">{t("metodo.psico.todosLosEjemplos")}</Text>
                        </Flex>
                      )}
                    </Box>
                  </Flex>
                </>

              </Flex>
            </Box>
            </Reveal>

            {/* Box «Mis Nudos»: la selección final del usuario */}
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.22} duration={0.75} w="100%">
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

                {/* Zona de chips con ALTURA FIJA + scroll vertical: al añadir o
                    borrar nudos el box NO cambia de alto (evita el mareo). */}
                <Box
                  w="100%"
                  maxW="620px"
                  h={{ base: "180px", md: "220px" }}
                  overflowY="auto"
                  overflowX="hidden"
                  sx={{
                    "&::-webkit-scrollbar": { width: "6px" },
                    "&::-webkit-scrollbar-thumb": { background: `${TINTA}44`, borderRadius: "9999px" },
                    scrollbarWidth: "thin",
                    scrollbarColor: `${TINTA}44 transparent`,
                  }}
                >
                  {nudos.length > 0 ? (
                    <Flex wrap="wrap" justify="center" gap={2.5} py={1}>
                      {nudos.map((n, i) => (
                        <Flex
                          key={`${n}-${i}`}
                          align="center"
                          gap={2}
                          pl={4}
                          pr={2}
                          py={2}
                          h="fit-content"
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
                            title={t("metodo.psico.quitar")}
                          >
                            ✕
                          </Box>
                        </Flex>
                      ))}
                    </Flex>
                  ) : (
                    <Flex h="100%" align="center" justify="center">
                      <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" opacity={0.7} textAlign="center" style={{ textShadow: INK_SHADOW }}>{t("metodo.psico.aquiNudos")}</Text>
                    </Flex>
                  )}
                </Box>

                <Text color={TINTA} fontSize="xs" opacity={0.55} fontStyle="italic" minH="1.2em">
                  {guardando ? "Guardando…" : nudos.length > 0 ? "Cada nudo se guarda según lo seleccionas." : ""}
                </Text>
              </Flex>
            </Box>
            </Reveal>
          </Flex>
        </Flex>
      </Box>

      <AyudaRecorrido pagina="nudos" />

      <SiteFooter />
    </Box>
  );
}
