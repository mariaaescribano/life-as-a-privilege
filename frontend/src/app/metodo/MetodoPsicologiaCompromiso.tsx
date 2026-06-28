// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · COMPROMISO  (cierre del recorrido · 11/11)
//
// El último paso: del entender al comprometerse. Recoge el problema con el que
// el usuario llegó («Lo que me trajo hasta aquí») y, frente a él, todos los
// nuevos patrones que ha decidido vivir a partir de ahora (uno por relación).
// Es una página de lectura/contemplación: no se edita nada aquí.
//
// Datos: lee data["problema-actual"] + data.constelaciones[i].{titulo,nuevoPatron}.
// ─────────────────────────────────────────────────────────────────────────
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
  type LineaDeVidaData,
  type Constelacion,
} from "../../components/metodo/psicologiaRecorrido";
import { glowPanel, glowHeader, azulBorde } from "../../components/metodo/psicologiaGlow";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt; // marrón tinta
const PAPEL = "#fbf4e8";          // crema claro
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

const relTitulo = (c: Constelacion): string => (c.titulo || "").trim() || "Relación sin título";

export default function MetodoPsicologiaCompromiso() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  const [problema, setProblema] = useState("");
  const [relaciones, setRelaciones] = useState<Constelacion[]>([]);
  const [ayurvedaSuscrito, setAyurvedaSuscrito] = useState(false);
  const dataRef = useRef<LineaDeVidaData>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!exp) { navigate("/metodo/psicologia", { replace: true }); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.psicologia_suscrito) { navigate("/metodo/psicologia", { replace: true }); return; }
        setAyurvedaSuscrito(!!me.data?.ayurveda_suscrito);

        const psi = await axios.get(`${API_URL}/metodo-psicologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d: LineaDeVidaData = psi.data?.data || {};
        dataRef.current = d;
        setProblema(typeof d["problema-actual"] === "string" ? (d["problema-actual"] as string) : "");
        setRelaciones(Array.isArray(d.constelaciones) ? d.constelaciones.map((c) => ({ ...c })) : []);
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  if (!exp) return null;

  // El usuario suele escribir varios problemas en un mismo texto (uno por línea).
  const problemas = problema.split(/\n+/).map((s) => s.trim()).filter(Boolean);
  // Solo las relaciones con un nuevo patrón escrito.
  const compromisos = relaciones
    .map((c) => ({ titulo: relTitulo(c), patron: (c.nuevoPatron || "").trim() }))
    .filter((x) => x.patron.length > 0);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box position="relative" flex="1">
        <Flex position="relative" zIndex={1} justify="center" px={{ base: 4, md: 8, lg: 12 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
          <Flex direction="column" align="center" w="100%" maxW="860px" gap={{ base: 6, md: 8 }}>

            <MetodoStepHeader
              icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
              title="Compromiso"
              bgColor={`${neuropsicologiaBg}f0`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              maxW="100%"
              step={{ current: 10, total: 10 }}
              mb={0}
              boxShadow={glowHeader}
              prev={{ label: "← Integración", onClick: () => navigate(`/metodo/psicologia/${exp.id}/mapa`) }}
              next={ayurvedaSuscrito
                ? { label: "Ayurveda →", onClick: () => navigate("/metodo/ayurveda") }
                : { label: "Ayurveda →", onClick: () => {}, disabled: true, disabledTooltip: "Desbloquea Ayurveda para empezar la 3ª disciplina." }}
            />

            {/* Intro */}
            <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "lg", md: "xl" }} textAlign="center"
                  lineHeight="1.7" maxW="640px" style={{ textShadow: "0 1px 12px rgba(0,0,0,0.35)" }}>
              Ya entiendes tu historia. Este es tu compromiso: frente a lo que te trajo hasta aquí,
              esto es lo que eliges vivir a partir de ahora.
            </Text>

            {/* ── Lo que me trajo hasta aquí: el problema ── */}
            <Box position="relative" w="100%" maxW="100%" borderRadius="2xl" overflow="hidden"
                 border={azulBorde} boxShadow={glowPanel} bgColor={neuropsicologiaBg}>
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 7, md: 9 }}>
                <Text color={TINTA} fontSize={{ base: "xs", md: "sm" }} fontWeight="700" letterSpacing="0.18em"
                      textTransform="uppercase" textAlign="center" opacity={0.8} mb={{ base: 5, md: 6 }}
                      style={{ textShadow: INK_SHADOW }}>
                  Lo que me trajo hasta aquí
                </Text>
                {problemas.length > 0 ? (
                  <Flex direction="column" gap={{ base: 3, md: 3.5 }}>
                    {problemas.map((p, i) => (
                      <Flex key={i} align="flex-start" gap={3} borderRadius="xl"
                            bg="rgba(255,251,243,0.6)" border={`1px solid ${TINTA}26`}
                            px={{ base: 4, md: 5 }} py={{ base: 3, md: 3.5 }}>
                        <Box flexShrink={0} mt="9px" w="7px" h="7px" borderRadius="full" bg={TINTA} />
                        <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.65">
                          {p}
                        </Text>
                      </Flex>
                    ))}
                  </Flex>
                ) : (
                  <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" opacity={0.7}
                        textAlign="center" style={{ textShadow: INK_SHADOW }}>
                    Aquí aparecerá el problema con el que empezaste tu camino.
                  </Text>
                )}
              </Box>
            </Box>

            {/* ── Mi compromiso: los nuevos patrones ── */}
            <Box position="relative" w="100%" maxW="100%" borderRadius="2xl" overflow="hidden"
                 border={azulBorde} boxShadow={glowPanel} bgColor={neuropsicologiaBg}>
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}>
                <Flex direction="column" align="center" gap={2} mb={{ base: 7, md: 8 }}>
                  <Text color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" textAlign="center"
                        lineHeight="1.3" style={{ textShadow: INK_SHADOW }}>
                    Me comprometo a vivir
                  </Text>
                  <Box h="2px" w="72px" bg={`${TINTA}66`} borderRadius="full" />
                </Flex>

                {compromisos.length > 0 ? (
                  <Flex direction="column" gap={{ base: 4, md: 5 }}>
                    {compromisos.map((x, i) => (
                      <Box key={i} position="relative" borderRadius="xl" overflow="hidden"
                           bg="rgba(255,251,243,0.72)" border={`1px solid ${TINTA}33`}
                           pl={{ base: 5, md: 6 }} pr={{ base: 4, md: 5 }} py={{ base: 4, md: 5 }}>
                        <Box position="absolute" left="0" top="0" bottom="0" w="4px" bg={TINTA} />
                        <Text color={TINTA} fontSize="2xs" fontWeight="700" letterSpacing="0.16em"
                              textTransform="uppercase" opacity={0.7} mb={1.5}>
                          {x.titulo}
                        </Text>
                        <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="600" fontStyle="italic"
                              lineHeight="1.55">
                          «{x.patron}»
                        </Text>
                      </Box>
                    ))}
                  </Flex>
                ) : (
                  <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" opacity={0.7}
                        textAlign="center" style={{ textShadow: INK_SHADOW }}>
                    Aquí aparecerán los nuevos patrones que escribas en la Síntesis, en
                    «Nuevo patrón a partir de ahora».
                  </Text>
                )}
              </Box>
            </Box>

          </Flex>
        </Flex>
      </Box>

      <SiteFooter />
    </Box>
  );
}
