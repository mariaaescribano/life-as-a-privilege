import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import { EstudioLayout } from "../../components/estudio/EstudioLayout";
import { SpaceBg, SPACE_IMG } from "../../components/metodo/SpaceBg";
import { Glifo, GlifoSigno } from "../../components/metodo/Glifo";
import { CUERPOS, ZODIAC_SIGNS, type Cuerpo } from "../../components/metodo/astrologiaData";
import { Reveal, RevealItem, RevealStagger } from "../../components/global/Reveal";
import { useImagesReady } from "../../hooks/useImagesReady";
import { LifeLoading } from "../../components/global/LifeLoading";
import { resultadosDeEjemplo } from "../../data/estudioDemo";
import { AstrologiaIcon, astrologiaTxt } from "../../GlobalVariables";
import {
  getResultadosPublicos,
  type GrupoPublico,
  type ResultadosPublicos,
} from "../../data/estudioApi";

/** Debajo de esta muestra un porcentaje no dice nada: se enseña la fila, pero sin cifra. */
const MUESTRA_MINIMA = 5;

/** Alto del header de la web: lo que hay que dejar libre al saltar con el índice. */
const HUECO_ANCLA = { base: "84px", md: "104px" };

const anclaDe = (key: string) => `arquetipo-${key}`;

/** Orden del zodíaco para las filas de signo (Aries primero, no alfabético). */
const ORDEN_SIGNO = new Map(ZODIAC_SIGNS.map((s, i) => [s.name, i]));

/**
 * ESTADÍSTICAS PÚBLICAS DEL ESTUDIO
 *
 * El estudio entero en totales, arquetipo por arquetipo: de todas las personas
 * que tienen (por ejemplo) el Sol en Leo, qué porcentaje de sus respuestas sobre
 * ese arquetipo han sido «sí».
 *
 * No hay nadie dentro de estos números: son medias de grupo, sin email, sin
 * carta y sin pregunta a pregunta. Es exactamente lo que se le promete a quien
 * participa —«los resultados se publican siempre en conjunto»—, así que la
 * página es pública y no pide cuenta.
 */
export default function EstudioEstadisticas() {
  const navigate = useNavigate();
  const location = useLocation();
  const [datos, setDatos] = useState<ResultadosPublicos | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const fotosListas = useImagesReady([SPACE_IMG]);

  // Vista de ejemplo (/estudio/estadisticas?demo): números inventados, para
  // poder mirar la pantalla mientras el estudio no tiene muestra.
  const esEjemplo = new URLSearchParams(location.search).has("demo");

  useEffect(() => {
    if (esEjemplo) {
      setDatos(resultadosDeEjemplo());
      setCargando(false);
      return;
    }
    (async () => {
      try {
        setDatos(await getResultadosPublicos());
      } catch {
        setError(true);
      } finally {
        setCargando(false);
      }
    })();
  }, [esEjemplo]);

  /**
   * Los grupos, ordenados como la carta: primero los Ascendentes, luego los
   * Soles, las Lunas… y dentro de cada arquetipo primero sus doce signos y
   * después sus doce casas. Se queda fuera el arquetipo del que todavía no hay
   * ni una respuesta: una tarjeta vacía no cuenta nada.
   */
  const porArquetipo = useMemo(() => {
    const porPlaneta = new Map<string, GrupoPublico[]>();
    for (const g of datos?.grupos ?? []) {
      porPlaneta.set(g.planeta, [...(porPlaneta.get(g.planeta) ?? []), g]);
    }

    return CUERPOS.map((cuerpo) => {
      const suyos = porPlaneta.get(cuerpo.key) ?? [];
      const signos = suyos
        .filter((g) => g.eje === "signo")
        .sort((a, b) => (ORDEN_SIGNO.get(a.posicion) ?? 99) - (ORDEN_SIGNO.get(b.posicion) ?? 99));
      const casas = suyos
        .filter((g) => g.eje === "casa")
        .sort((a, b) => Number(a.posicion) - Number(b.posicion));
      return { cuerpo, signos, casas };
    }).filter((a) => a.signos.length > 0 || a.casas.length > 0);
  }, [datos]);

  const irA = (key: string) => {
    document.getElementById(anclaDe(key))?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (cargando || !fotosListas) return <LifeLoading />;

  return (
    <EstudioLayout>
      <Flex direction="column" align="center" w="100%" maxW="980px" gap={{ base: 7, md: 9 }}>
        {/* ── CABECERA ── */}
        <Reveal direction="down" distance={16} duration={0.75}>
          <Flex direction="column" align="center" gap={{ base: 3, md: 4 }} textAlign="center">
            <AstrologiaIcon size={{ base: "38px", md: "52px" }} />
            <Text color="white" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="700"
                  letterSpacing="0.06em" textTransform="uppercase" lineHeight="1.15"
                  textShadow="0 0 14px rgba(255,255,255,0.55), 0 0 32px rgba(180,255,245,0.3)">
              Estadísticas del estudio
            </Text>
            <Box w="100%" maxW="460px" h="1px"
                 bgGradient="linear(to-r, transparent, rgba(255,255,255,0.55), transparent)" />
            <Text color="rgba(255,255,255,0.88)" fontSize={{ base: "md", md: "lg" }} maxW="740px" lineHeight="1.8">
              Cada porcentaje es una media de grupo: de todas las personas que tienen ese arquetipo
              en esa misma posición, cuántas de sus respuestas sobre él han sido <b>sí</b>. Aquí no
              hay nadie en concreto —ni nombres, ni cartas, ni pregunta a pregunta—: solo el conjunto.
            </Text>
            {esEjemplo ? (
              <Box px={4} py={1.5} borderRadius="full" bg="rgba(255,255,255,0.14)"
                   border="1px solid rgba(255,255,255,0.4)">
                <Text color="white" fontSize="xs" letterSpacing="0.18em" textTransform="uppercase" fontWeight="600">
                  Vista de ejemplo · datos inventados
                </Text>
              </Box>
            ) : (
              !!datos?.participantesTotales && (
                <Text color="rgba(255,255,255,0.6)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic">
                  {datos.participantesTotales === 1
                    ? "1 persona ha participado hasta ahora."
                    : `${datos.participantesTotales} personas han participado hasta ahora.`}
                </Text>
              )
            )}
          </Flex>
        </Reveal>

        {/* ── ÍNDICE ──
            Son quince arquetipos: sin índice, encontrar el suyo es bajar a
            ciegas. Cada chapa salta a su tarjeta. */}
        {porArquetipo.length > 0 && (
          <Reveal direction="up" distance={16} duration={0.7} delay={0.1} w="100%">
            <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                 boxShadow={`0 0 18px rgba(255,255,255,0.14), 0 0 40px ${astrologiaTxt}22`}>
              <SpaceBg overlay="rgba(8,13,30,0.72)" />
              <Box position="relative" zIndex={1} px={{ base: 5, md: 7 }} py={{ base: 5, md: 6 }}>
                <Text color={`${astrologiaTxt}aa`} fontSize={{ base: "xs", md: "sm" }} fontWeight="700"
                      letterSpacing="0.18em" textTransform="uppercase" mb={4} textAlign="center">
                  Índice de arquetipos
                </Text>
                <Flex wrap="wrap" justify="center" gap={{ base: 2, md: 2.5 }}>
                  {porArquetipo.map(({ cuerpo: c }) => (
                    <Flex
                      key={c.key}
                      as="button"
                      onClick={() => irA(c.key)}
                      align="center"
                      gap={2}
                      px={{ base: 3, md: 3.5 }}
                      py={{ base: 1.5, md: 2 }}
                      borderRadius="full"
                      bg={`${c.color}14`}
                      border={`1px solid ${c.color}55`}
                      cursor="pointer"
                      transition="all 0.2s"
                      _hover={{ bg: `${c.color}2e`, borderColor: c.color, transform: "translateY(-1px)" }}
                    >
                      <Glifo symbol={c.symbol} color={c.color} size={16} />
                      <Text color={c.color} fontSize={{ base: "sm", md: "md" }} fontWeight="600" whiteSpace="nowrap">
                        {c.label}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              </Box>
            </Box>
          </Reveal>
        )}

        {/* ── UN BLOQUE POR ARQUETIPO ── */}
        {porArquetipo.length === 0 ? (
          <Reveal direction="up" distance={14} duration={0.7} w="100%">
            <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden">
              <SpaceBg overlay="rgba(8,13,30,0.72)" />
              <Flex position="relative" zIndex={1} direction="column" align="center" gap={4}
                    textAlign="center" px={{ base: 6, md: 10 }} py={{ base: 9, md: 12 }}>
                <Text color="white" fontSize={{ base: "lg", md: "2xl" }} fontWeight="700" letterSpacing="0.04em">
                  El estudio acaba de empezar
                </Text>
                <Text color="rgba(255,255,255,0.85)" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" maxW="560px">
                  Todavía no hay respuestas suficientes para publicar ninguna media. En cuanto las
                  haya, aparecerán aquí solas.
                </Text>
                <Box as="button" onClick={() => navigate("/estudio/datos")} mt={2}
                     px={{ base: 7, md: 9 }} py={{ base: 3, md: 3.5 }} borderRadius="full"
                     bg={`${astrologiaTxt}22`} border={`1px solid ${astrologiaTxt}`} color={astrologiaTxt}
                     fontSize={{ base: "md", md: "lg" }} fontWeight="700" letterSpacing="0.12em"
                     textTransform="uppercase" cursor="pointer" transition="all 0.22s"
                     _hover={{ bg: `${astrologiaTxt}33`, boxShadow: `0 0 24px ${astrologiaTxt}55` }}>
                  Ser de los primeros
                </Box>
              </Flex>
            </Box>
          </Reveal>
        ) : (
          <RevealStagger display="flex" flexDirection="column" w="100%" gap={{ base: 8, md: 10 }}
                         stagger={0.06} delayChildren={0.15}>
            {porArquetipo.map(({ cuerpo, signos, casas }, i) => (
              <RevealItem key={cuerpo.key}>
                {/* Separación horizontal entre arquetipos: una raya del color del
                    siguiente, para que se vea de un golpe dónde empieza cada uno. */}
                {i > 0 && (
                  <Box h="1px" mb={{ base: 8, md: 10 }}
                       bgGradient={`linear(to-r, transparent, ${cuerpo.color}88, transparent)`} />
                )}
                <BloqueArquetipo cuerpo={cuerpo} signos={signos} casas={casas} />
              </RevealItem>
            ))}
          </RevealStagger>
        )}

        {error && (
          <Text color="#ffb8b8" fontSize={{ base: "sm", md: "md" }} textAlign="center" fontStyle="italic">
            No he podido cargar los resultados. Prueba a recargar en un momento.
          </Text>
        )}

        {/* ── PIE ── */}
        <Reveal direction="up" distance={12} duration={0.6} delay={0.25}>
          <Flex direction="column" align="center" gap={3}>
            <Box as="button" onClick={() => navigate("/estudio")}
                 color="rgba(255,255,255,0.72)" fontSize={{ base: "sm", md: "md" }} bg="transparent"
                 border="none" cursor="pointer" _hover={{ color: "white" }}>
              ← Volver a la portada del estudio
            </Box>
            <Text color="rgba(255,255,255,0.55)" fontSize="xs" fontStyle="italic" textAlign="center" maxW="620px">
              Los porcentajes se recalculan solos cada vez que alguien participa, así que estos
              números cambian con el tiempo. Los grupos con muy poca gente se muestran sin cifra:
              con tres respuestas, un porcentaje engaña más de lo que explica.
            </Text>
          </Flex>
        </Reveal>
      </Flex>
    </EstudioLayout>
  );
}

/* ── Un arquetipo: su tarjeta con los signos y las casas ───────────────────── */

function BloqueArquetipo({
  cuerpo: c,
  signos,
  casas,
}: {
  cuerpo: Cuerpo;
  signos: GrupoPublico[];
  casas: GrupoPublico[];
}) {
  return (
    <Box
      id={anclaDe(c.key)}
      scrollMarginTop={HUECO_ANCLA}
      position="relative"
      w="100%"
      borderRadius="2xl"
      overflow="hidden"
      boxShadow={`0 0 20px ${c.color}44, 0 0 52px ${c.color}22`}
    >
      <SpaceBg overlay="rgba(8,13,30,0.74)" />

      <Box position="relative" zIndex={1} px={{ base: 5, md: 7 }} py={{ base: 5, md: 6 }}>
        {/* Cabecera del arquetipo */}
        <Flex align="center" gap={3} mb={{ base: 4, md: 5 }}>
          <Flex w={{ base: "42px", md: "48px" }} h={{ base: "42px", md: "48px" }} borderRadius="full"
                flexShrink={0} align="center" justify="center"
                bg={`${c.color}1f`} border={`1px solid ${c.color}55`}>
            <Glifo symbol={c.symbol} color={c.color} size={28} />
          </Flex>
          <Text color={c.color} fontSize={{ base: "xl", md: "3xl" }} fontWeight="700" letterSpacing="0.05em"
                style={{ textShadow: `0 0 12px rgba(255,255,255,0.5), 0 0 28px ${c.color}66` }}>
            {c.label}
          </Text>
        </Flex>

        <Flex direction="column" gap={{ base: 5, md: 6 }}>
          {signos.length > 0 && <Lista cuerpo={c} titulo="Por signo" grupos={signos} />}
          {signos.length > 0 && casas.length > 0 && <Box h="1px" bg={`${c.color}44`} />}
          {casas.length > 0 && <Lista cuerpo={c} titulo="Por casa" grupos={casas} />}
        </Flex>
      </Box>
    </Box>
  );
}

/** Las filas de un eje (los signos, o las casas) con su barra y su porcentaje. */
function Lista({ cuerpo: c, titulo, grupos }: { cuerpo: Cuerpo; titulo: string; grupos: GrupoPublico[] }) {
  return (
    <Box>
      <Text color={`${c.color}ee`} fontSize={{ base: "sm", md: "md" }} fontWeight="700"
            letterSpacing="0.16em" textTransform="uppercase" mb={3}
            style={{ textShadow: "0 0 10px rgba(0,0,0,0.85)" }}>
        {titulo}
      </Text>

      <Flex direction="column" gap={{ base: 2.5, md: 3 }}>
        {grupos.map((g) => {
          const hayMuestra = g.personas >= MUESTRA_MINIMA;
          return (
            <Flex key={`${g.eje}-${g.posicion}`} align="center" gap={{ base: 2.5, md: 4 }}>
              {/* Quién: el signo con su icono dibujado, o el número de la casa */}
              <Flex align="center" gap={2} minW={{ base: "104px", md: "150px" }} flexShrink={0}>
                {g.eje === "signo" ? (
                  <>
                    <GlifoSigno nombre={g.posicion} size={16} color={c.color} />
                    <Text color={`${c.color}dd`} fontSize={{ base: "sm", md: "md" }} noOfLines={1}>
                      {g.posicion}
                    </Text>
                  </>
                ) : (
                  <Text color={`${c.color}dd`} fontSize={{ base: "sm", md: "md" }}>
                    Casa {g.posicion}
                  </Text>
                )}
              </Flex>

              <Box flex="1" h="10px" borderRadius="full" bg={`${c.color}1a`} overflow="hidden">
                <Box h="100%" borderRadius="full" bg={hayMuestra ? c.color : "transparent"}
                     w={`${hayMuestra ? g.porcentajeSi : 0}%`}
                     boxShadow={hayMuestra ? `0 0 10px ${c.color}aa` : "none"}
                     transition="width 0.6s ease" />
              </Box>

              <Text color={hayMuestra ? c.color : `${c.color}66`} fontSize={{ base: "md", md: "lg" }}
                    fontWeight="700" minW={{ base: "46px", md: "56px" }} textAlign="right" flexShrink={0}>
                {hayMuestra ? `${g.porcentajeSi}%` : "—"}
              </Text>

              {/* Cuánta gente sostiene esa media: en móvil no cabe y se calla. */}
              <Text color={`${c.color}88`} fontSize="xs" fontStyle="italic" minW="86px" flexShrink={0}
                    textAlign="right" display={{ base: "none", md: "block" }}>
                {hayMuestra
                  ? `${g.personas} ${g.personas === 1 ? "persona" : "personas"}`
                  : "aún sois pocos"}
              </Text>
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
}
