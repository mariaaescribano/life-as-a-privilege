import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IndiceCabala } from "../../components/metodo/IndiceCabala";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal } from "../../components/global/Reveal";
import { cabalaSefirotMap, CABALA_SEFIROT_ORDEN, CABALA_TOTAL_PAGINAS, CABALA_PAG } from "../../components/metodo/cabalaSefirot";
import { CABALA_TEST, testCompleto } from "../../components/metodo/cabalaTest";
import {
  calcularTransiciones,
  nivelCombinado,
  sefiraEvaluable,
  sefirotContenidoCompleto,
  polaridadSefira,
  POLARIDAD_LABEL,
  TIPO_LABEL,
  esBloqueo,
  type TransicionResultado,
  type Polaridad,
} from "../../components/metodo/cabalaDiagnostico";
import { API_URL, cabalaBg, cabalaNom, cabalaTxt, CabalaIcon } from "../../GlobalVariables";
import { CAJA_GLOW, CAJA_GLOW_FUERTE } from "../../components/metodo/cabalaGlow";

// Sombra OSCURA (casi negra), no del color del fondo: da contraste real al
// texto ámbar (cabalaTxt) sobre el fondo marrón, para que se lea bien.
const INK_SHADOW = "0 1px 4px rgba(0,0,0,0.9), 0 2px 12px rgba(0,0,0,0.72), 0 0 22px rgba(0,0,0,0.5)";

const nombre = (k: string) => cabalaSefirotMap[k as keyof typeof cabalaSefirotMap]?.titulo ?? k;
const etiquetaDe = (k: string) => CABALA_TEST[k as keyof typeof CABALA_TEST]?.etiqueta ?? "";

/* ── Barra de nivel (0-10) ── */
function BarraNivel({ nivel }: { nivel: number }) {
  const pct = Math.max(0, Math.min(100, (nivel / 10) * 100));
  return (
    <Box w="100%" h="7px" borderRadius="full" bg={`${cabalaTxt}1c`} overflow="hidden">
      <Box h="100%" borderRadius="full" bg={cabalaTxt} w={`${pct}%`} boxShadow={`0 0 10px ${cabalaTxt}aa`} transition="width 0.6s ease" />
    </Box>
  );
}

/* ── Texto del diagnóstico según el tipo de transición ── */
function narrativaTransicion(t: TransicionResultado): string {
  const from = nombre(t.from), to = nombre(t.to);
  const eFrom = etiquetaDe(t.from), eTo = etiquetaDe(t.to);
  switch (t.tipo) {
    case "sin_base":
      return `Todavía no hay base suficiente en ${from}. Antes de trabajar este sendero conviene desarrollar primero ${from} (${eFrom}).`;
    case "invertida":
      return `Has desarrollado más ${eTo} (${to}) que ${eFrom} (${from}). Conviene reforzar la base de ${from} para que ${to} tenga una dirección más sólida.`;
    case "integrada":
    case "parcial":
      return `Conviertes con fluidez ${eFrom} en ${eTo}. Esta transición fluye bien.`;
    default:
      return t.narrativa; // bloqueos: relato del paso evolutivo
  }
}

export default function MetodoCabalaDiagnostico() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<Record<string, number[]>>({});
  const [autoeval, setAutoeval] = useState<Record<string, number[]>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.cabala_suscrito) { navigate("/metodo/cabala"); return; }
        try {
          const res = await axios.get(`${API_URL}/metodo-cabala/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          const prev = res.data?.data ?? {};
          // Puerta: no se puede entrar al Diagnóstico sin haber rellenado el
          // contenido (test/autoevaluación) de TODAS las sefirot. Si falta algo,
          // se vuelve al Árbol para completarlo.
          if (!sefirotContenidoCompleto(prev.test, prev.autoeval)) {
            navigate("/metodo/cabala/arbol");
            return;
          }
          const t = prev.test;
          if (t && typeof t === "object") setTest(t);
          const a = prev.autoeval;
          if (a && typeof a === "object") setAutoeval(a);
          // Marca el Diagnóstico como visitado: Los Senderos se desbloquean en el
          // índice sólo tras pasar por aquí, para avanzar poco a poco.
          if (!prev.diagnosticoVisto) {
            const data = { ...prev, diagnosticoVisto: true };
            axios.patch(`${API_URL}/metodo-cabala/${userId}`, { data }, { headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
          }
        } catch { /* sin respuestas todavía */ }
      } catch {
        navigate("/metodo/cabala");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  // Niveles por sefirá. El nivel combina la Escala de Equilibrio (test) y la
  // autoevaluación (1-10); la polaridad (déficit/exceso) solo la aporta el test.
  const niveles = useMemo(() => {
    return CABALA_SEFIROT_ORDEN.map((key) => {
      const r = test[key] ?? [];
      const a = autoeval[key] ?? [];
      const completo = sefiraEvaluable(r, a);
      return {
        key,
        titulo: cabalaSefirotMap[key].titulo,
        numero: cabalaSefirotMap[key].numero,
        etiqueta: CABALA_TEST[key].etiqueta,
        completo,
        nivel: completo ? nivelCombinado(r, a) : -1,
        polaridad: (testCompleto(r) ? polaridadSefira(r) : "equilibrio") as Polaridad,
      };
    });
  }, [test, autoeval]);

  const respondidas = niveles.filter((n) => n.completo).length;
  const total = niveles.length;

  const transiciones = useMemo(() => calcularTransiciones(test, autoeval), [test, autoeval]);
  const bloqueos = useMemo(
    () => transiciones.filter((t) => t.completa && esBloqueo(t.tipo)).sort((a, b) => b.gravedad - a.gravedad),
    [transiciones],
  );
  const principal = bloqueos[0] ?? null;
  const secundarios = bloqueos.slice(1, 3);

  const desarrolladas = niveles.filter((n) => n.completo && n.nivel >= 7);
  const porFortalecer = niveles.filter((n) => n.completo && n.nivel <= 4);

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="900px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<CabalaIcon size={{ base: "40px", md: "56px" }} />}
              title="Mapa Evolutivo"
              pageLabel={`${CABALA_PAG.diagnostico}/${CABALA_TOTAL_PAGINAS}`}
              compact
              bgColor={`${cabalaBg}dd`}
              color={cabalaTxt}
              nom={cabalaNom}
              mb={0}
              prev={{ label: "← Malkhut", onClick: () => navigate("/metodo/cabala/sefira/malkuth") }}
              extra={{ label: "El Árbol", onClick: () => navigate("/metodo/cabala/arbol") }}
              next={{ label: "Los Senderos →", onClick: () => navigate("/metodo/cabala/senderos") }}
            />
          </Reveal>

          {/* Filosofía */}
          <Reveal direction="up" distance={16} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "md", md: "lg" }} fontStyle="italic" textAlign="center"
                  lineHeight="1.85" maxW="660px" style={{ textShadow: INK_SHADOW }}>
              Las sefirot son estados; los senderos, transiciones. El crecimiento no ocurre en una capacidad aislada,
              sino en el paso de una a la siguiente. Este mapa busca qué transición evolutiva está bloqueada.
            </Text>
          </Reveal>

          <Reveal direction="up" distance={14} delay={0.14} duration={0.5} display="flex" justifyContent="center">
            <Text color={`${cabalaTxt}cc`} fontSize="sm" letterSpacing="0.1em" textTransform="uppercase"
                  bg={`${cabalaBg}cc`} border={`1px solid ${cabalaTxt}44`} borderRadius="full" px={4} py={1.5}>
              {respondidas}/{total} dimensiones respondidas
            </Text>
          </Reveal>

          {respondidas < 2 ? (
            <Reveal direction="up" distance={16} delay={0.2} duration={0.6} w="100%">
              <Box w="100%" bg={cabalaBg} border={`1px dashed ${cabalaTxt}55`} borderRadius="2xl" boxShadow={CAJA_GLOW}
                   px={{ base: 6, md: 10 }} py={{ base: 12, md: 14 }} textAlign="center">
                <Text color={cabalaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" mb={2} style={{ textShadow: INK_SHADOW }}>
                  Aún faltan respuestas
                </Text>
                <Text color={`${cabalaTxt}bb`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.7" style={{ textShadow: INK_SHADOW }}>
                  Completa la «Escala de equilibrio» de al menos dos dimensiones consecutivas para empezar a ver tus
                  transiciones. Cuantas más completes, más preciso será tu mapa.
                </Text>
              </Box>
            </Reveal>
          ) : (
            <>
              {/* ── Cuello de botella principal ── */}
              {principal ? (
                <Reveal direction="up" distance={22} delay={0.18} duration={0.7} w="100%">
                  <Box w="100%" bg={cabalaBg} border={`1.5px solid ${cabalaTxt}`} borderRadius="2xl"
                       boxShadow={CAJA_GLOW_FUERTE}
                       px={{ base: 6, md: 9 }} py={{ base: 7, md: 8 }}>
                    <Text color={`${cabalaTxt}99`} fontSize="xs" letterSpacing="0.16em" textTransform="uppercase" mb={2}>
                      Tu paso evolutivo prioritario
                    </Text>
                    <Flex align="center" gap={3} wrap="wrap" mb={1}>
                      <Text color={cabalaTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700"
                            style={{ textShadow: `0 0 20px ${cabalaTxt}66` }}>
                        {nombre(principal.from)} → {nombre(principal.to)}
                      </Text>
                    </Flex>
                    <Text color={`${cabalaTxt}aa`} fontSize="sm" letterSpacing="0.08em" textTransform="uppercase" mb={4}>
                      {etiquetaDe(principal.from)} → {etiquetaDe(principal.to)} · {TIPO_LABEL[principal.tipo]}
                    </Text>

                    <Flex gap={5} mb={5} wrap="wrap">
                      <Box flex="1" minW="120px">
                        <Flex justify="space-between" mb={1}>
                          <Text color={`${cabalaTxt}cc`} fontSize="sm">{nombre(principal.from)}</Text>
                          <Text color={cabalaTxt} fontSize="sm" fontWeight="700">{principal.origen}/10</Text>
                        </Flex>
                        <BarraNivel nivel={principal.origen} />
                      </Box>
                      <Box flex="1" minW="120px">
                        <Flex justify="space-between" mb={1}>
                          <Text color={`${cabalaTxt}cc`} fontSize="sm">{nombre(principal.to)}</Text>
                          <Text color={cabalaTxt} fontSize="sm" fontWeight="700">{principal.destino}/10</Text>
                        </Flex>
                        <BarraNivel nivel={principal.destino} />
                      </Box>
                    </Flex>

                    <Text color="rgba(255,255,255,0.95)" fontSize={{ base: "lg", md: "xl" }} lineHeight="1.9"
                          bg={`${cabalaTxt}0d`} border={`1px solid ${cabalaTxt}22`} borderRadius="xl" p={{ base: 4, md: 5 }} style={{ textShadow: INK_SHADOW }}>
                      {narrativaTransicion(principal)}
                    </Text>

                    {/* Siguiente paso concreto */}
                    <Text color={`${cabalaTxt}99`} fontSize="xs" letterSpacing="0.14em" textTransform="uppercase" mt={5} mb={2}>
                      Tu siguiente paso
                    </Text>
                    <Flex gap={3} wrap="wrap">
                      <BotonSefira label={`Repasar ${nombre(principal.from)}`} onClick={() => navigate(`/metodo/cabala/sefira/${principal.from}`)} />
                      <BotonSefira label={`Trabajar ${nombre(principal.to)}`} onClick={() => navigate(`/metodo/cabala/sefira/${principal.to}`)} />
                    </Flex>
                  </Box>
                </Reveal>
              ) : (
                <Reveal direction="up" distance={18} delay={0.18} duration={0.6} w="100%">
                  <Box w="100%" bg={cabalaBg} border={`1.5px solid ${cabalaTxt}55`} borderRadius="2xl" boxShadow={CAJA_GLOW}
                       px={{ base: 6, md: 9 }} py={{ base: 7, md: 8 }} textAlign="center">
                    <Text color={cabalaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" mb={2} style={{ textShadow: INK_SHADOW }}>
                      Tus transiciones fluyen
                    </Text>
                    <Text color={`${cabalaTxt}bb`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.7" style={{ textShadow: INK_SHADOW }}>
                      En las dimensiones que has respondido no aparece un bloqueo claro entre una capacidad y la
                      siguiente. Sigue completando el resto para afinar el mapa.
                    </Text>
                  </Box>
                </Reveal>
              )}

              {/* ── Otras transiciones a observar ── */}
              {secundarios.length > 0 && (
                <Reveal direction="up" distance={18} delay={0.22} duration={0.6} w="100%">
                  <Box w="100%">
                    <Text color={`${cabalaTxt}cc`} fontSize={{ base: "lg", md: "xl" }} fontWeight="700"
                          letterSpacing="0.08em" mb={3} style={{ textShadow: INK_SHADOW }}>
                      Otras transiciones a observar
                    </Text>
                    <Flex direction="column" gap={3}>
                      {secundarios.map((t) => (
                        <Box key={`${t.from}-${t.to}`} bg={cabalaBg} border={`1px solid ${cabalaTxt}44`} borderRadius="xl"
                             boxShadow={CAJA_GLOW} px={{ base: 5, md: 6 }} py={{ base: 4, md: 5 }}>
                          <Flex align="baseline" justify="space-between" gap={3} wrap="wrap" mb={2}>
                            <Text color={cabalaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" style={{ textShadow: INK_SHADOW }}>
                              {nombre(t.from)} → {nombre(t.to)}
                            </Text>
                            <Text color={`${cabalaTxt}88`} fontSize="xs" letterSpacing="0.1em" textTransform="uppercase">
                              {TIPO_LABEL[t.tipo]} · {t.origen}/10 → {t.destino}/10
                            </Text>
                          </Flex>
                          <Text color={`${cabalaTxt}cc`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.75" style={{ textShadow: INK_SHADOW }}>
                            {narrativaTransicion(t)}
                          </Text>
                        </Box>
                      ))}
                    </Flex>
                  </Box>
                </Reveal>
              )}

              {/* ── Mapa evolutivo: capacidades ── */}
              <Reveal direction="up" distance={18} delay={0.26} duration={0.6} w="100%">
                <Flex direction={{ base: "column", md: "row" }} gap={{ base: 4, md: 5 }} w="100%">
                  <ListaChips titulo="Capacidades desarrolladas"
                              items={desarrolladas.map((n) => `${n.titulo} · ${n.etiqueta}`)}
                              vacio="Ninguna destaca todavía." />
                  <ListaChips titulo="Capacidades por fortalecer"
                              items={porFortalecer.map((n) => `${n.titulo} · ${n.etiqueta}`)}
                              vacio="Ninguna especialmente baja." />
                </Flex>
              </Reveal>

              {/* ── Tus capacidades (niveles + polaridad) ── */}
              <Reveal direction="up" distance={18} delay={0.3} duration={0.6} w="100%">
                <Box w="100%" bg={cabalaBg} border={`1px solid ${cabalaTxt}44`} borderRadius="2xl" boxShadow={CAJA_GLOW}
                     px={{ base: 5, md: 8 }} py={{ base: 5, md: 6 }}>
                  <Text color={cabalaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.08em" mb={4} style={{ textShadow: INK_SHADOW }}>
                    Tus capacidades
                  </Text>
                  <Flex direction="column" gap={3.5}>
                    {niveles.map((n) => (
                      <Box key={n.key}>
                        <Flex justify="space-between" align="baseline" mb={1} gap={2} wrap="wrap">
                          <Text color={`${cabalaTxt}dd`} fontSize={{ base: "md", md: "lg" }} style={{ textShadow: INK_SHADOW }}>
                            <Box as="span" color={`${cabalaTxt}77`} fontWeight="700" mr={1.5}>{n.numero}.</Box>
                            {n.titulo} <Box as="span" color={`${cabalaTxt}77`}>· {n.etiqueta}</Box>
                          </Text>
                          {n.completo ? (
                            <Text color={cabalaTxt} fontSize="xs" fontWeight="700">
                              {n.nivel}/10 · <Box as="span" color={`${cabalaTxt}99`}>{POLARIDAD_LABEL[n.polaridad]}</Box>
                            </Text>
                          ) : (
                            <Text color={`${cabalaTxt}66`} fontSize="xs" fontStyle="italic">sin responder</Text>
                          )}
                        </Flex>
                        {n.completo ? <BarraNivel nivel={n.nivel} /> : (
                          <Box w="100%" h="7px" borderRadius="full" bg={`${cabalaTxt}12`} />
                        )}
                      </Box>
                    ))}
                  </Flex>
                </Box>
              </Reveal>
            </>
          )}
        </Flex>
      </Flex>

      <BotonCompania color={cabalaTxt} bgColor={cabalaBg} disciplinaNom={cabalaNom} />
      <SiteFooter />

      <IndiceCabala />
    </Box>
  );
}

function BotonSefira({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Box as="button" onClick={onClick} px={4} py={2} borderRadius="full" bg={`${cabalaTxt}18`}
         border={`1.5px solid ${cabalaTxt}66`} color={cabalaTxt} fontSize={{ base: "sm", md: "md" }} fontWeight="600"
         cursor="pointer" transition="all 0.15s" _hover={{ bg: `${cabalaTxt}2e`, borderColor: cabalaTxt }}>
      {label} →
    </Box>
  );
}

function ListaChips({ titulo, items, vacio }: { titulo: string; items: string[]; vacio: string }) {
  return (
    <Box flex="1" bg={cabalaBg} border={`1px solid ${cabalaTxt}44`} borderRadius="2xl" boxShadow={CAJA_GLOW}
         px={{ base: 5, md: 6 }} py={{ base: 5, md: 6 }}>
      <Text color={cabalaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.06em" mb={3} style={{ textShadow: INK_SHADOW }}>
        {titulo}
      </Text>
      {items.length === 0 ? (
        <Text color={`${cabalaTxt}88`} fontSize="sm" fontStyle="italic" style={{ textShadow: INK_SHADOW }}>{vacio}</Text>
      ) : (
        <Flex wrap="wrap" gap={2}>
          {items.map((it, i) => (
            <Text key={i} color={`${cabalaTxt}dd`} fontSize="sm" bg={`${cabalaTxt}14`} border={`1px solid ${cabalaTxt}33`}
                  borderRadius="full" px={3} py={1}>
              {it}
            </Text>
          ))}
        </Flex>
      )}
    </Box>
  );
}
