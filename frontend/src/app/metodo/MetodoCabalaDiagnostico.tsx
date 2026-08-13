import React, { useEffect, useMemo, useState } from "react";
import { useT } from "../../i18n";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { CabalaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IndiceCabala } from "../../components/metodo/IndiceCabala";
import { CabalaIlustracionesModal } from "../../components/metodo/CabalaIlustracionesModal";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal } from "../../components/global/Reveal";
import { CABALA_SEFIROT_ORDEN, CABALA_TOTAL_PAGINAS, CABALA_PAG } from "../../components/metodo/cabalaSefirot";
import { testCompleto, testsAEscala10 } from "../../components/metodo/cabalaTest";
import {
  useNarrativa, usePolaridadLabel, useSefirotMap, useTestCabala, useTipoLabel,
} from "../../components/metodo/cabalaEn";
import {
  calcularTransiciones,
  nivelCombinado,
  sefiraEvaluable,
  sefirotContenidoCompleto,
  polaridadSefira,
  esBloqueo,
  type TransicionResultado,
  type Polaridad,
} from "../../components/metodo/cabalaDiagnostico";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { API_URL, cabalaBg, cabalaNom, cabalaTxt, CabalaIcon } from "../../GlobalVariables";
import { CAJA_GLOW } from "../../components/metodo/cabalaGlow";

// Sombra OSCURA (casi negra), no del color del fondo: da contraste real al
// texto ámbar (cabalaTxt) sobre el fondo marrón, para que se lea bien.
const INK_SHADOW = "0 1px 4px rgba(0,0,0,0.9), 0 2px 12px rgba(0,0,0,0.72), 0 0 22px rgba(0,0,0,0.5)";

// Velo de las cajas: EL MISMO que el header (el que pone DisciplinaBgLayer para
// Cábala, un negro al 40 %). Nada de velo marrón casi opaco: la acuarela tiene
// que verse igual de nítida en la caja que en el header. El contraste del texto
// ámbar lo pone INK_SHADOW.

/**
 * Caja ÚNICA de esta página: la acuarela de Cábala de fondo (la misma del
 * header), SIN línea de contorno y con el halo suave del header (CAJA_GLOW).
 * Todos los boxes del diagnóstico pasan por aquí, así que se ven como piezas
 * del mismo material y no como recuadros sueltos.
 */
function Caja({
  children,
  radius = "2xl",
  px = { base: 6, md: 8 },
  py = { base: 6, md: 7 },
  ...rest
}: React.ComponentProps<typeof Box> & { radius?: any }) {
  return (
    <Box position="relative" overflow="hidden" w="100%" borderRadius={radius} boxShadow={CAJA_GLOW} {...rest}>
      <DisciplinaBgLayer nom={cabalaNom} borderRadius={radius} />
      <Box position="relative" zIndex={1} px={px} py={py}>{children}</Box>
    </Box>
  );
}

/* ── Barra de nivel (0-10) ── */
function BarraNivel({ nivel }: { nivel: number }) {
  const pct = Math.max(0, Math.min(100, (nivel / 10) * 100));
  return (
    <Box w="100%" h="7px" borderRadius="full" bg={`${cabalaTxt}1c`} overflow="hidden">
      <Box h="100%" borderRadius="full" bg={cabalaTxt} w={`${pct}%`} boxShadow={`0 0 10px ${cabalaTxt}aa`} transition="width 0.6s ease" />
    </Box>
  );
}

export default function MetodoCabalaDiagnostico() {
  const t = useT();
  const navigate = useNavigate();
  // Contenido y etiquetas en el idioma activo: los niveles, los umbrales y la
  // clasificación de cada transición siguen saliendo del cálculo español.
  const sefirotMap = useSefirotMap();
  const testCabala = useTestCabala();
  const polaridadLabel = usePolaridadLabel();
  const tipoLabel = useTipoLabel();
  const narrativaBloqueo = useNarrativa();

  const nombre = (k: string) => sefirotMap[k as keyof typeof sefirotMap]?.titulo ?? k;
  const etiquetaDe = (k: string) => testCabala[k as keyof typeof testCabala]?.etiqueta ?? "";

  /* Texto del diagnóstico según el tipo de transición. Cuando NO es un bloqueo
     se arma con el nombre de las dos sefirot y su tema; el relato de los
     bloqueos es contenido y viene ya traducido. */
  const narrativaTransicion = (tr: TransicionResultado): string => {
    const valores = {
      from: nombre(tr.from), to: nombre(tr.to),
      eFrom: etiquetaDe(tr.from), eTo: etiquetaDe(tr.to),
    };
    switch (tr.tipo) {
      case "sin_base":
        return t("metodo.cabala.diag.sinBase", valores);
      case "invertida":
        return t("metodo.cabala.diag.invertida", valores);
      case "integrada":
      case "parcial":
        return t("metodo.cabala.diag.fluida", valores);
      default:
        return narrativaBloqueo(tr); // bloqueos: relato del paso evolutivo
    }
  };

  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<Record<string, number[]>>({});
  const [autoeval, setAutoeval] = useState<Record<string, number[]>>({});
  const [ilustracionesOpen, setIlustracionesOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
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
          // Las respuestas anteriores al cambio de escala vienen en 1-5: se
          // reescalan a 1-10 ANTES de la puerta y del cálculo, o el diagnóstico
          // de quien ya había contestado saldría distorsionado.
          const testEscalado = testsAEscala10(prev.test, prev.escalaTest);
          if (!sefirotContenidoCompleto(testEscalado, prev.autoeval)) {
            navigate("/metodo/cabala/arbol");
            return;
          }
          setTest(testEscalado);
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
        titulo: sefirotMap[key].titulo,
        numero: sefirotMap[key].numero,
        etiqueta: testCabala[key].etiqueta,
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
    return <CabalaLoading />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="900px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<CabalaIcon size={{ base: "40px", md: "56px" }} />}
              title={t("metodo.cabala.mapaEvolutivo")}
              pageLabel={`${CABALA_PAG.diagnostico}/${CABALA_TOTAL_PAGINAS}`}
              compact
              bgColor={`${cabalaBg}dd`}
              color={cabalaTxt}
              nom={cabalaNom}
              mb={0}
              prev={{ label: "← Malkhut", onClick: () => navigate("/metodo/cabala/sefira/malkuth") }}
              extra={{ label: t("metodo.ilustraciones"), onClick: () => setIlustracionesOpen(true)}}
              next={{ label: `${t("metodo.cabala.paso.senderos")} →`, onClick: () => navigate("/metodo/cabala/senderos") }}
            />
          </Reveal>

          {/* Filosofía */}
          <Reveal direction="up" distance={16} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            {/* Sin sombra: el texto de debajo del header va sobre el turquesa limpio. */}
            <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "md", md: "lg" }} fontStyle="italic" textAlign="center"
                  lineHeight="1.85" maxW="660px">
              {t("metodo.cabala.diagIntro")}
            </Text>
          </Reveal>

          <Reveal direction="up" distance={14} delay={0.14} duration={0.5} display="flex" justifyContent="center">
            <Caja radius="full" w="auto" px={4} py={1.5}>
              <Text color={`${cabalaTxt}cc`} fontSize="sm" letterSpacing="0.1em" textTransform="uppercase">
                {respondidas}/{total} dimensiones respondidas
              </Text>
            </Caja>
          </Reveal>

          {respondidas < 2 ? (
            <Reveal direction="up" distance={16} delay={0.2} duration={0.6} w="100%">
              <Caja px={{ base: 6, md: 10 }} py={{ base: 12, md: 14 }} textAlign="center">
                <Text color={cabalaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" mb={2} style={{ textShadow: INK_SHADOW }}>
                  {t("metodo.cabala.faltanRespuestas")}
                </Text>
                <Text color={`${cabalaTxt}bb`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.7" style={{ textShadow: INK_SHADOW }}>
                  {t("metodo.cabala.faltanRespuestasTexto")}
                </Text>
              </Caja>
            </Reveal>
          ) : (
            <>
              {/* ── Cuello de botella principal ── */}
              {principal ? (
                <Reveal direction="up" distance={22} delay={0.18} duration={0.7} w="100%">
                  <Caja px={{ base: 6, md: 9 }} py={{ base: 7, md: 8 }}>
                    <Text color={`${cabalaTxt}99`} fontSize="xs" letterSpacing="0.16em" textTransform="uppercase" mb={2}>
                      {t("metodo.cabala.pasoPrioritario")}
                    </Text>
                    <Flex align="center" gap={3} wrap="wrap" mb={1}>
                      <Text color={cabalaTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700"
                            style={{ textShadow: `0 0 20px ${cabalaTxt}66` }}>
                        {nombre(principal.from)} → {nombre(principal.to)}
                      </Text>
                    </Flex>
                    <Text color={`${cabalaTxt}aa`} fontSize="sm" letterSpacing="0.08em" textTransform="uppercase" mb={4}>
                      {etiquetaDe(principal.from)} → {etiquetaDe(principal.to)} · {tipoLabel[principal.tipo]}
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

                    <Caja radius="xl" px={{ base: 4, md: 5 }} py={{ base: 4, md: 5 }}>
                      <Text color="rgba(255,255,255,0.95)" fontSize={{ base: "lg", md: "xl" }} lineHeight="1.9"
                            style={{ textShadow: INK_SHADOW }}>
                        {narrativaTransicion(principal)}
                      </Text>
                    </Caja>

                    {/* Siguiente paso concreto */}
                    <Text color={`${cabalaTxt}99`} fontSize="xs" letterSpacing="0.14em" textTransform="uppercase" mt={5} mb={2}>
                      {t("metodo.cabala.siguientePaso")}
                    </Text>
                    <Flex gap={3} wrap="wrap">
                      <BotonSefira label={t("metodo.cabala.diag.repasar", { sefira: nombre(principal.from) })} onClick={() => navigate(`/metodo/cabala/sefira/${principal.from}`)} />
                      <BotonSefira label={t("metodo.cabala.diag.trabajar", { sefira: nombre(principal.to) })} onClick={() => navigate(`/metodo/cabala/sefira/${principal.to}`)} />
                    </Flex>
                  </Caja>
                </Reveal>
              ) : (
                <Reveal direction="up" distance={18} delay={0.18} duration={0.6} w="100%">
                  <Caja px={{ base: 6, md: 9 }} py={{ base: 7, md: 8 }} textAlign="center">
                    <Text color={cabalaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" mb={2} style={{ textShadow: INK_SHADOW }}>
                      {t("metodo.cabala.transicionesFluyen")}
                    </Text>
                    <Text color={`${cabalaTxt}bb`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.7" style={{ textShadow: INK_SHADOW }}>
                      {t("metodo.cabala.transicionesFluyenTexto")}
                    </Text>
                  </Caja>
                </Reveal>
              )}

              {/* ── Otras transiciones a observar ── */}
              {secundarios.length > 0 && (
                <Reveal direction="up" distance={18} delay={0.22} duration={0.6} w="100%">
                  <Box w="100%">
                    <Text color={`${cabalaTxt}cc`} fontSize={{ base: "lg", md: "xl" }} fontWeight="700"
                          letterSpacing="0.08em" mb={3} style={{ textShadow: INK_SHADOW }}>
                      {t("metodo.cabala.otrasTransiciones")}
                    </Text>
                    <Flex direction="column" gap={3}>
                      {secundarios.map((t) => (
                        <Caja key={`${t.from}-${t.to}`} radius="xl" px={{ base: 5, md: 6 }} py={{ base: 4, md: 5 }}>
                          <Flex align="baseline" justify="space-between" gap={3} wrap="wrap" mb={2}>
                            <Text color={cabalaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" style={{ textShadow: INK_SHADOW }}>
                              {nombre(t.from)} → {nombre(t.to)}
                            </Text>
                            <Text color={`${cabalaTxt}88`} fontSize="xs" letterSpacing="0.1em" textTransform="uppercase">
                              {tipoLabel[t.tipo]} · {t.origen}/10 → {t.destino}/10
                            </Text>
                          </Flex>
                          <Text color={`${cabalaTxt}cc`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.75" style={{ textShadow: INK_SHADOW }}>
                            {narrativaTransicion(t)}
                          </Text>
                        </Caja>
                      ))}
                    </Flex>
                  </Box>
                </Reveal>
              )}

              {/* ── Mapa evolutivo: capacidades ── */}
              <Reveal direction="up" distance={18} delay={0.26} duration={0.6} w="100%">
                <Flex direction={{ base: "column", md: "row" }} gap={{ base: 4, md: 5 }} w="100%">
                  <ListaChips titulo={t("metodo.cabala.desarrolladas")}
                              items={desarrolladas.map((n) => `${n.titulo} · ${n.etiqueta}`)}
                              vacio={t("metodo.cabala.diag.ningunaDestaca")} />
                  <ListaChips titulo={t("metodo.cabala.porFortalecer")}
                              items={porFortalecer.map((n) => `${n.titulo} · ${n.etiqueta}`)}
                              vacio={t("metodo.cabala.diag.ningunaBaja")} />
                </Flex>
              </Reveal>

              {/* ── Tus capacidades (niveles + polaridad) ── */}
              <Reveal direction="up" distance={18} delay={0.3} duration={0.6} w="100%">
                <Caja px={{ base: 5, md: 8 }} py={{ base: 5, md: 6 }}>
                  <Text color={cabalaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.08em" mb={3} style={{ textShadow: INK_SHADOW }}>
                    {t("metodo.cabala.tusCapacidades")}
                  </Text>

                  {/* Sin esta leyenda, «Sobreexpresada» se lee como un suspenso.
                      Son dos medidas distintas y hay que decirlo: el número es
                      CUÁNTO, la palabra es HACIA DÓNDE. */}
                  <Text color={`${cabalaTxt}bb`} fontSize={{ base: "sm", md: "md" }} lineHeight="1.7" mb={2.5}
                        style={{ textShadow: INK_SHADOW }}>
                    {t("metodo.cabala.numeroDice")}{" "}
                    <Box as="span" fontWeight="700" color={cabalaTxt}>{t("metodo.cabala.cuanto")}</Box>{" "}
                    {t("metodo.cabala.tienesDesarrollada")}{" "}
                    <Box as="span" fontWeight="700" color={cabalaTxt}>{t("metodo.cabala.haciaDonde")}</Box>{" "}
                    {t("metodo.cabala.seDesequilibra")}
                  </Text>
                  <Flex direction="column" gap={1.5} mb={5}>
                    <LeyendaPolaridad label={polaridadLabel.deficit}
                                      texto={t("metodo.cabala.falta")} />
                    <LeyendaPolaridad label={polaridadLabel.equilibrio}
                                      texto={t("metodo.cabala.equilibrio")} />
                    <LeyendaPolaridad label={polaridadLabel.exceso}
                                      texto={t("metodo.cabala.exceso")} />
                  </Flex>

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
                              {n.nivel}/10 · <Box as="span" color={`${cabalaTxt}99`}>{polaridadLabel[n.polaridad]}</Box>
                            </Text>
                          ) : (
                            <Text color={`${cabalaTxt}66`} fontSize="xs" fontStyle="italic">{t("metodo.cabala.sinResponder")}</Text>
                          )}
                        </Flex>
                        {n.completo ? <BarraNivel nivel={n.nivel} /> : (
                          <Box w="100%" h="7px" borderRadius="full" bg={`${cabalaTxt}12`} />
                        )}
                      </Box>
                    ))}
                  </Flex>
                </Caja>
              </Reveal>
            </>
          )}
        </Flex>
      </Flex>

      <CabalaIlustracionesModal isOpen={ilustracionesOpen} onClose={() => setIlustracionesOpen(false)} />

      <BotonCompania color={cabalaTxt} bgColor={cabalaBg} disciplinaNom={cabalaNom} />
      <SiteFooter />

      <IndiceCabala />
    </Box>
  );
}

/* Una línea de la leyenda de polaridades: el nombre tal como sale en la lista
   («Sobreexpresada») y qué significa. */
function LeyendaPolaridad({ label, texto }: { label: string; texto: string }) {
  return (
    <Flex align="flex-start" gap={2.5}>
      <Box flexShrink={0} mt="9px" w="5px" h="5px" borderRadius="full" bg={cabalaTxt} boxShadow={`0 0 8px ${cabalaTxt}aa`} />
      <Text color={`${cabalaTxt}cc`} fontSize={{ base: "sm", md: "md" }} lineHeight="1.65" style={{ textShadow: INK_SHADOW }}>
        <Box as="span" fontWeight="700" color={cabalaTxt}>{label}</Box> — {texto}
      </Text>
    </Flex>
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
    <Caja flex="1" px={{ base: 5, md: 6 }} py={{ base: 5, md: 6 }}>
      <Text color={cabalaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.06em" mb={3} style={{ textShadow: INK_SHADOW }}>
        {titulo}
      </Text>
      {items.length === 0 ? (
        <Text color={`${cabalaTxt}88`} fontSize="sm" fontStyle="italic" style={{ textShadow: INK_SHADOW }}>{vacio}</Text>
      ) : (
        <Flex wrap="wrap" gap={2}>
          {items.map((it, i) => (
            <Text key={i} color={`${cabalaTxt}dd`} fontSize="sm" bg={`${cabalaTxt}24`}
                  borderRadius="full" px={3} py={1}>
              {it}
            </Text>
          ))}
        </Flex>
      )}
    </Caja>
  );
}
