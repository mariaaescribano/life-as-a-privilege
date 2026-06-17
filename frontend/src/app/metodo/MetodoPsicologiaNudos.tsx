import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Input, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { PsicologiaBg } from "../../components/metodo/PsicologiaBg";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import {
  experienciaById,
  NUDOS,
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

      <Box position="relative" flex="1" overflow="hidden">
        <PsicologiaBg overlay="rgba(247,236,220,0.26)" />

        <Flex position="relative" zIndex={1} justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
          <Flex direction="column" align="center" w="100%" maxW="760px" gap={{ base: 7, md: 9 }}>

            <MetodoStepHeader
              icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
              title="Los Nudos"
              bgColor={`${neuropsicologiaBg}f0`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              mb={0}
              prev={{ label: "← Las Huellas", onClick: () => navigate(`/metodo/psicologia/${exp.id}/huellas`) }}
              next={{ label: "La Integración →", onClick: () => navigate(`/metodo/psicologia/${exp.id}/integracion`) }}
            />

            {/* Intro contemplativa */}
            <Box
              position="relative"
              w="100%"
              borderRadius="2xl"
              overflow="hidden"
              border={`1px solid ${TINTA}33`}
              boxShadow={`0 10px 40px rgba(94,45,16,0.18), 0 0 0 1px ${neuropsicologiaBg}55`}
            >
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1} px={{ base: 7, md: 11 }} py={{ base: 8, md: 11 }} textAlign="center">
                <Text color={TINTA} fontSize="xl" mb={4} opacity={0.8} style={{ filter: `drop-shadow(0 0 6px ${TINTA}44)` }}>✦</Text>
                <Flex direction="column" gap={3} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.9" opacity={0.92} maxW="560px" mx="auto">
                  {NUDOS.intro.map((p, i) => (
                    <Text key={i} fontStyle={i === NUDOS.intro.length - 1 ? "italic" : "normal"} style={{ textShadow: INK_SHADOW }}>{p}</Text>
                  ))}
                </Flex>
              </Box>
            </Box>

            {/* Pregunta principal + apoyo */}
            <Flex direction="column" align="center" textAlign="center" gap={3} maxW="620px">
              <Text color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1.3" style={{ textShadow: INK_SHADOW }}>
                {NUDOS.pregunta}
              </Text>
              <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" opacity={0.78} lineHeight="1.8" style={{ textShadow: INK_SHADOW }}>
                {NUDOS.apoyo}
              </Text>
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
                px={8}
                borderRadius="xl"
                bg={TINTA}
                color={PAPEL}
                fontFamily="'EB Garamond', serif"
                fontWeight="700"
                fontSize={{ base: "md", md: "lg" }}
                letterSpacing="0.04em"
                cursor="pointer"
                py={{ base: 3, sm: 0 }}
                boxShadow={`0 4px 16px rgba(94,45,16,0.28)`}
                transition="all 0.2s"
                _hover={{ transform: "translateY(-2px)", boxShadow: `0 8px 22px rgba(94,45,16,0.38)` }}
              >
                Añadir
              </Box>
            </Flex>

            {/* Ejemplos sugeridos (opcionales) */}
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
                      bg="rgba(255,251,243,0.4)"
                      color={TINTA}
                      border={`1px dashed ${TINTA}55`}
                      fontFamily="'EB Garamond', serif"
                      fontSize={{ base: "sm", md: "md" }}
                      cursor="pointer"
                      transition="all 0.18s"
                      _hover={{ bg: "rgba(255,251,243,0.7)", borderColor: TINTA }}
                    >
                      + {e}
                    </Box>
                  ))}
                </Flex>
              </Flex>
            )}

            {/* Nudos añadidos */}
            {nudos.length > 0 && (
              <Flex direction="column" w="100%" maxW="620px" gap={3}>
                {nudos.map((n, i) => (
                  <Flex
                    key={`${n}-${i}`}
                    align="center"
                    gap={4}
                    px={{ base: 5, md: 6 }}
                    py={{ base: 4, md: 4 }}
                    borderRadius="xl"
                    position="relative"
                    overflow="hidden"
                    border={`1px solid ${TINTA}33`}
                    boxShadow={`0 6px 22px rgba(94,45,16,0.14)`}
                  >
                    <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="xl" />
                    <Box position="relative" zIndex={1} as="span" color={TINTA} fontSize="lg" opacity={0.7}>✦</Box>
                    <Text position="relative" zIndex={1} flex="1" color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.6" style={{ textShadow: INK_SHADOW }}>
                      {n}
                    </Text>
                    <Box
                      as="button"
                      position="relative"
                      zIndex={1}
                      onClick={() => quitarNudo(i)}
                      w="30px"
                      h="30px"
                      borderRadius="full"
                      bg="rgba(94,45,16,0.08)"
                      color={TINTA}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize="md"
                      cursor="pointer"
                      flexShrink={0}
                      transition="all 0.18s"
                      _hover={{ bg: "rgba(94,45,16,0.18)" }}
                      title="Quitar"
                    >
                      ✕
                    </Box>
                  </Flex>
                ))}
              </Flex>
            )}

            <Text color={TINTA} fontSize="xs" opacity={0.55} fontStyle="italic" minH="1.2em">
              {guardando ? "Guardando…" : nudos.length > 0 ? "Cada nudo se guarda por separado." : ""}
            </Text>
          </Flex>
        </Flex>
      </Box>

      <SiteFooter />
    </Box>
  );
}
