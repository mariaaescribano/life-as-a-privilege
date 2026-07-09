// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · INTEGRACIÓN  (ruta interna /mapa)
//
// El mapa completo de ti mismo. Por primera vez, todo el recorrido se une en
// un solo lugar: un hilo vertical que enhebra, en orden, las piezas que la
// persona ha ido creando —y deja ver las conexiones entre ellas—:
//
//   1. El problema con el que llegó       ·  data["problema-actual"]
//   2. Lo que cargó (ACE)                 ·  data.ace
//   3. Lo que dejó huella                 ·  data.anos[·].huellas
//   4. Los nudos                          ·  data.nudos
//   5. Lo que le faltó (necesidades)      ·  data.necesidades
//   6. Sus heridas                        ·  data.heridas
//   7. Cómo se relaciona                  ·  data.constelaciones
//   8. Sus miedos                         ·  data.miedos
//   9. Sus dones                          ·  data.dones.lista
//
// No se «rellena» nada nuevo aquí: es una página de contemplación. La única
// interacción que se conserva es la transformación de cada RELACIÓN (el popup
// guiado de 4 preguntas), porque su resultado (verdadSana / coste) es lo que
// lee la página de Compromiso. Por eso las tarjetas de «Relación» siguen
// abriéndolo.
// ─────────────────────────────────────────────────────────────────────────
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text, Textarea } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import { AutoguardadoIndicador, type EstadoGuardado } from "../../components/global/AutoguardadoIndicador";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IntroRecorrido } from "../../components/metodo/IntroRecorrido";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { arquetipoLabel } from "../../components/metodo/integracionSimbolos";
import {
  experienciaById,
  aceScore,
  aceBanda,
  aceCompleto,
  necesidadesNoCubiertas,
  arquetipoKey,
  type LineaDeVidaData,
  type Constelacion,
  type RelacionHuellaNudo,
} from "../../components/metodo/psicologiaRecorrido";
import { glowHeader, glowPanel, azulBorde } from "../../components/metodo/psicologiaGlow";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt; // #5e2d10 — marrón tinta
const PAPEL = "#fbf4e8";          // crema claro
const ORO = "#c79a3c";            // acento dorado (el reverso luminoso: los dones)
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

// Corazón — se usa en el popup de felicitación.
const Corazon = ({ size = 22, color = TINTA }: { size?: number; color?: string }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={`${size}px`} h={`${size}px`} fill={color} flexShrink={0}>
    <path d="M480-120 424-171q-101-91-167-157T152-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T884-447.5Q843-395 777-329T536-171l-56 51Z" />
  </Box>
);

// Los cuatro bloques del ejercicio de transformación (se conservan: alimentan
// la página de Compromiso). La `key` es el campo de la constelación.
const BLOQUES: {
  key: "proteger" | "coste" | "verdadSana" | "recordatorio";
  pregunta: string;
  apoyo: string;
  ejemplos: string[];
  placeholder: string;
}[] = [
  {
    key: "proteger",
    pregunta: "¿Qué intentaba proteger este patrón?",
    apoyo: "Reconoce la intención positiva que había detrás del mecanismo.",
    ejemplos: ["Evitar críticas", "Sentirme suficiente", "No decepcionar", "Sentirme seguro"],
    placeholder: "Lo que en el fondo intentaba cuidar de mí…",
  },
  {
    key: "coste",
    pregunta: "¿Qué coste tiene mantener este patrón?",
    apoyo: "Toma conciencia de las consecuencias que tiene hoy en tu vida.",
    ejemplos: ["Ansiedad", "Agotamiento", "Relaciones superficiales", "Falta de autenticidad"],
    placeholder: "Lo que me cuesta seguir sosteniéndolo…",
  },
  {
    key: "verdadSana",
    pregunta: "¿Qué verdad más sana quieres practicar?",
    apoyo: "El núcleo: transforma la narrativa antigua en una nueva.",
    ejemplos: [
      "«Mi valor depende de hacerlo perfecto» → «Mi valor no depende de hacerlo perfecto»",
      "«Necesito agradar para ser querido» → «Puedo ser querido siendo yo mismo»",
    ],
    placeholder: "La nueva verdad que quiero empezar a creer…",
  },
  {
    key: "recordatorio",
    pregunta: "¿Qué te gustaría recordar cuando vuelvas a caer en este patrón?",
    apoyo: "Una frase breve de apoyo personal.",
    ejemplos: ["Está bien equivocarme", "Mi voz también importa", "Puedo poner límites con amor"],
    placeholder: "Una frase que quiero recordar…",
  },
];

const relTitulo = (c: Constelacion): string => (c.titulo || "").trim() || "Relación sin título";
const heridaTitulo = (h: RelacionHuellaNudo): string => (h.titulo || "").trim() || "Herida sin título";

// Todas las huellas marcadas a lo largo de la línea de vida (sin duplicar).
function todasLasHuellas(d: LineaDeVidaData): string[] {
  const set = new Set<string>();
  for (const ano of Object.values(d.anos || {})) {
    for (const t of ano?.huellas || []) {
      const s = (t || "").trim();
      if (s) set.add(s);
    }
  }
  return Array.from(set);
}

export default function MetodoPsicologiaMapa() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LineaDeVidaData>({});
  const [relaciones, setRelaciones] = useState<Constelacion[]>([]);
  const [abiertoId, setAbiertoId] = useState<string | null>(null);
  const [felicitarOpen, setFelicitarOpen] = useState(false);
  const [estadoGuardado, setEstadoGuardado] = useState<EstadoGuardado>("idle");
  const dataRef = useRef<LineaDeVidaData>({});

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendiente = useRef<Constelacion[] | null>(null);
  const okTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const montado = useRef(true);
  useEffect(() => {
    montado.current = true;
    return () => {
      montado.current = false;
      if (okTimer.current) clearTimeout(okTimer.current);
    };
  }, []);

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

        const psi = await axios.get(`${API_URL}/metodo-psicologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d: LineaDeVidaData = psi.data?.data || {};
        dataRef.current = d;
        setData(d);
        const rels = Array.isArray(d.constelaciones)
          ? d.constelaciones.map((c) => ({ ...c, titulo: c.titulo ?? "" }))
          : [];
        setRelaciones(rels);
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  const persistir = async (next: Constelacion[]): Promise<boolean> => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return false;
    if (montado.current) setEstadoGuardado("guardando");
    try {
      const nuevo = { ...dataRef.current, constelaciones: next };
      await axios.patch(`${API_URL}/metodo-psicologia/${userId}`, { data: nuevo },
        { headers: { Authorization: `Bearer ${token}` } });
      dataRef.current = nuevo;
      if (montado.current) {
        setEstadoGuardado("ok");
        if (okTimer.current) clearTimeout(okTimer.current);
        okTimer.current = setTimeout(() => { if (montado.current) setEstadoGuardado("idle"); }, 2200);
      }
      return true;
    } catch {
      if (montado.current) setEstadoGuardado("idle");
      return false;
    }
  };

  // Guarda en estado y agenda persistencia (debounce) para no llamar en cada tecla.
  const commit = (next: Constelacion[]) => {
    setRelaciones(next);
    setEstadoGuardado("guardando");
    pendiente.current = next;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (pendiente.current) { void persistir(pendiente.current); pendiente.current = null; }
    }, 900);
  };

  // Flush al desmontar.
  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (pendiente.current) void persistir(pendiente.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateCampo = (id: string, campo: keyof Constelacion, valor: string) =>
    commit(relaciones.map((c) => (c.id === id ? { ...c, [campo]: valor } : c)));

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  if (!exp) return null;

  const ir = (ruta: string) => navigate(`/metodo/psicologia/${exp.id}/${ruta}`);

  // ── Las piezas del mapa ──
  const problemas = (typeof data["problema-actual"] === "string" ? (data["problema-actual"] as string) : "")
    .split(/\n+/).map((s) => s.trim()).filter(Boolean);
  const aceHecho = aceCompleto(data);
  const score = aceScore(data);
  const banda = aceBanda(score);
  const huellas = todasLasHuellas(data);
  const nudos = (data.nudos || []).map((n) => (n || "").trim()).filter(Boolean);
  const necesidades = necesidadesNoCubiertas(data);
  const heridas = (data.heridas || []).filter((h) => heridaTitulo(h) || h.texto?.trim());
  const miedos = (data.miedos || []).map((m) => (m.texto || "").trim()).filter(Boolean);
  const dones = (data.dones?.lista || []).map((x) => (x.texto || "").trim()).filter(Boolean);

  const abierta = relaciones.find((c) => c.id === abiertoId) || null;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box position="relative" flex="1">
        <Flex position="relative" zIndex={1} justify="center" px={{ base: 4, md: 8, lg: 12 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
          <Flex direction="column" align="center" w="100%" maxW="880px" gap={{ base: 8, md: 10 }}>

            <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
              <MetodoStepHeader
                icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
                title="Integración"
                bgColor={`${neuropsicologiaBg}f0`}
                color={neuropsicologiaTxt}
                nom={neuropsicologiaNom}
                step={{ current: 17, total: 20 }}
                mb={0}
                boxShadow={glowHeader}
                prev={{ label: "← Miedos", onClick: () => ir("miedos-preguntas") }}
                next={{ label: "Compromiso →", onClick: () => setFelicitarOpen(true) }}
              />
            </Reveal>

            {/* Intro: el sentido de la página */}
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%">
              <IntroRecorrido>Cada pieza que fuiste reuniendo se enhebra aquí. El mapa de ti mismo.</IntroRecorrido>
            </Reveal>

            {/* ════════ EL HILO ════════ */}
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.22} duration={0.75} w="100%">
            <Box position="relative" w="100%">

              <Estacion num={1} label="De dónde vengo" apoyo="El problema con el que llegaste">
                {problemas.length > 0 ? (
                  <Flex direction="column" gap={3}>
                    {problemas.map((p, i) => (
                      <Box key={i} pl={{ base: 4, md: 5 }} borderLeft={`3px solid ${TINTA}55`}>
                        <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.7"
                              style={{ textShadow: INK_SHADOW }}>
                          {p}
                        </Text>
                      </Box>
                    ))}
                  </Flex>
                ) : (
                  <Vacio texto="Aún no has escrito tu problema." accion="Ir al problema →" onClick={() => ir("problema")} />
                )}
              </Estacion>

              <Estacion num={2} label="Lo que cargué" apoyo="Experiencias adversas en la infancia (ACE)">
                {aceHecho ? (
                  <Flex align="center" gap={{ base: 4, md: 5 }}>
                    <Flex flexShrink={0} direction="column" align="center" justify="center"
                          w={{ base: "68px", md: "76px" }} h={{ base: "68px", md: "76px" }} borderRadius="full"
                          bg={`${banda.color}22`} border={`2px solid ${banda.color}`}>
                      <Text color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1">{score}</Text>
                      <Text color={TINTA} fontSize="2xs" fontWeight="600" opacity={0.65}>/ 10</Text>
                    </Flex>
                    <Box minW={0}>
                      <Text color={TINTA} fontSize="2xs" fontWeight="700" letterSpacing="0.14em" textTransform="uppercase"
                            opacity={0.65} mb={0.5}>{banda.etiqueta}</Text>
                      <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="700" lineHeight="1.35"
                            style={{ textShadow: INK_SHADOW }}>{banda.titulo}</Text>
                    </Box>
                  </Flex>
                ) : (
                  <Vacio texto="Aún no has completado el test ACE." accion="Ir al test →" onClick={() => ir("ace")} />
                )}
              </Estacion>

              <Estacion num={3} label="Lo que dejó huella" apoyo="Los recuerdos que aún resuenan">
                {huellas.length > 0 ? (
                  <Pildoras items={huellas} />
                ) : (
                  <Vacio texto="Aún no has marcado tus huellas." accion="Ir a Huellas →" onClick={() => ir("huellas")} />
                )}
              </Estacion>

              <Estacion num={4} label="Los nudos" apoyo="Los patrones que se repiten hoy">
                {nudos.length > 0 ? (
                  <Pildoras items={nudos} />
                ) : (
                  <Vacio texto="Aún no has nombrado tus nudos." accion="Ir a Nudos →" onClick={() => ir("nudos")} />
                )}
              </Estacion>

              <Estacion num={5} label="Lo que me faltó" apoyo="Necesidades del niño no cubiertas">
                {necesidades.length > 0 ? (
                  <Pildoras items={necesidades} />
                ) : (
                  <Vacio texto="Aún no has marcado tus necesidades." accion="Ir a Necesidades →" onClick={() => ir("necesidades")} />
                )}
              </Estacion>

              <Estacion num={6} label="Mis heridas" apoyo="Dónde nace cada nudo: huella + creencia + necesidad">
                {heridas.length > 0 ? (
                  <Flex direction="column" gap={3}>
                    {heridas.map((h) => (
                      <Box key={h.id} borderRadius="xl" bg="rgba(255,251,243,0.62)" border={`1px solid ${TINTA}2e`}
                           px={{ base: 4, md: 5 }} py={{ base: 3.5, md: 4 }}>
                        <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="700" lineHeight="1.3" mb={2}
                              style={{ textShadow: INK_SHADOW }}>{heridaTitulo(h)}</Text>
                        <Flex wrap="wrap" gap={1.5} mb={h.texto?.trim() ? 2.5 : 0}>
                          {(h.huellas || []).map((x) => <MiniChip key={`hu-${x}`} label={x} />)}
                          {(h.nudos || []).map((x) => <MiniChip key={`nu-${x}`} label={x} />)}
                          {(h.necesidades || []).map((x) => <MiniChip key={`ne-${x}`} label={x} />)}
                        </Flex>
                        {h.texto?.trim() && (
                          <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" lineHeight="1.6" opacity={0.88}>
                            {h.texto.trim()}
                          </Text>
                        )}
                      </Box>
                    ))}
                  </Flex>
                ) : (
                  <Vacio texto="Aún no has compuesto tus heridas." accion="Ir a Heridas →" onClick={() => ir("heridas-lista")} />
                )}
              </Estacion>

              <Estacion num={7} label="Cómo me relaciono"
                        apoyo="Tus heridas unidas a los arquetipos de tu carta">
                {relaciones.length > 0 ? (
                  <Flex direction="column" gap={3}>
                    {relaciones.map((c) => {
                      const hechas = BLOQUES.filter((b) => ((c[b.key] as string) || "").trim().length > 0).length;
                      const completo = hechas >= BLOQUES.length;
                      return (
                        <Box key={c.id} as="button" onClick={() => setAbiertoId(c.id)} textAlign="left" w="100%"
                             borderRadius="xl" bg="rgba(255,251,243,0.62)" border={`1px solid ${TINTA}2e`}
                             px={{ base: 4, md: 5 }} py={{ base: 3.5, md: 4 }} cursor="pointer" transition="all 0.16s"
                             _hover={{ bg: "rgba(255,251,243,0.8)", transform: "translateY(-1px)" }}>
                          <Flex align="center" gap={2} mb={2}>
                            <Text flex="1" minW={0} color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="700" lineHeight="1.3"
                                  style={{ textShadow: INK_SHADOW }}>{relTitulo(c)}</Text>
                            <Text flexShrink={0} color={TINTA} fontSize="2xs" fontWeight="700"
                                  opacity={completo ? 1 : 0.6}>{completo ? "transformada ✓" : `transformar ${hechas}/${BLOQUES.length} ›`}</Text>
                          </Flex>
                          <Flex wrap="wrap" gap={1.5} mb={c.texto?.trim() ? 2.5 : 0}>
                            {(c.nudos || []).map((x) => <MiniChip key={`n-${x}`} label={x} />)}
                            {(c.arquetipos || []).map((a) => (
                              <MiniChip key={`a-${arquetipoKey(a)}`} label={arquetipoLabel(a)} />
                            ))}
                          </Flex>
                          {c.texto?.trim() && (
                            <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" lineHeight="1.6" opacity={0.88}>
                              {c.texto.trim()}
                            </Text>
                          )}
                        </Box>
                      );
                    })}
                  </Flex>
                ) : (
                  <Vacio texto="Aún no has compuesto tus relaciones." accion="Ir a Relación →" onClick={() => ir("integracion")} />
                )}
              </Estacion>

              <Estacion num={8} label="Mis miedos" apoyo="Lo que temes, mirado de frente">
                {miedos.length > 0 ? (
                  <Pildoras items={miedos} />
                ) : (
                  <Vacio texto="Aún no has nombrado tus miedos." accion="Ir a Miedos →" onClick={() => ir("miedos")} />
                )}
              </Estacion>

              <Estacion num={9} label="Mis dones" apoyo="El reverso luminoso de todo lo anterior"
                        dorado last>
                {dones.length > 0 ? (
                  <Flex wrap="wrap" gap={2}>
                    {dones.map((x, i) => (
                      <Flex key={i} align="center" px={{ base: 3.5, md: 4 }} py={2} borderRadius="full"
                            bg={`${ORO}1f`} border={`1px solid ${ORO}88`}>
                        <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontWeight="600" lineHeight="1.2">{x}</Text>
                      </Flex>
                    ))}
                  </Flex>
                ) : (
                  <Vacio texto="Aún no has reconocido tus dones." accion="Ir a Dones →" onClick={() => ir("dones")} />
                )}
              </Estacion>

            </Box>
            </Reveal>

            {/* Cierre + autoguardado (del ejercicio de transformación) */}
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.32} duration={0.75} w="100%" display="flex" justifyContent="center">
            <Flex direction="column" align="center" gap={4} textAlign="center" maxW="640px">
              <Text color={PAPEL} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.7"
                    style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
                Esto eres tú, entero. No para quedarte a mirarlo, sino para seguir desde aquí.
              </Text>
              {relaciones.length > 0 && <AutoguardadoIndicador estado={estadoGuardado} color="rgba(255,255,255,0.9)" />}
            </Flex>
            </Reveal>

          </Flex>
        </Flex>
      </Box>

      {/* ── POPUP GUIADO (transformación de la relación · alimenta Compromiso) ── */}
      {abierta && (
        <PopupIntegracion
          key={abierta.id}
          c={abierta}
          estadoGuardado={estadoGuardado}
          onUpdate={(campo, v) => updateCampo(abierta.id, campo, v)}
          onClose={() => setAbiertoId(null)}
        />
      )}

      {/* ── POPUP DE FELICITACIÓN (al pulsar «Compromiso →») ── */}
      {felicitarOpen && (
        <PopupFelicitacion
          onClose={() => setFelicitarOpen(false)}
          onContinuar={() => ir("compromiso")}
        />
      )}

      <AyudaRecorrido pagina="mapa" />

      <SiteFooter />
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Popup de felicitación: se abre al pulsar «Compromiso →». Reconoce el logro
// de haber recorrido todo el camino antes de dar el último paso.
// ─────────────────────────────────────────────────────────────────────────
function PopupFelicitacion({ onClose, onContinuar }: { onClose: () => void; onContinuar: () => void }) {
  useLockBodyScroll(true);
  return (
    <Box position="fixed" inset={0} zIndex={2100} display="flex" alignItems="center" justifyContent="center"
         px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }} bg="rgba(0,0,0,0.78)"
         sx={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
         onClick={onClose} fontFamily="'EB Garamond', serif">
      <Box onClick={(e: React.MouseEvent) => e.stopPropagation()} position="relative" w="100%" maxW="460px"
           borderRadius="2xl" overflow="hidden" boxShadow={`0 0 44px ${TINTA}55, 0 30px 80px rgba(0,0,0,0.55)`}>
        <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
        <Box position="relative" zIndex={1} px={{ base: 8, md: 12 }} py={{ base: 11, md: 14 }} textAlign="center">
          <Box as="button" onClick={onClose} position="absolute" top={3} right={3}
               w="34px" h="34px" borderRadius="full" bg="rgba(255,251,243,0.7)" border={`1px solid ${TINTA}44`}
               color={TINTA} display="flex" alignItems="center" justifyContent="center" fontSize="md" cursor="pointer"
               _hover={{ bg: "rgba(255,251,243,0.95)", borderColor: TINTA }}>✕</Box>

          <Flex align="center" justify="center" gap={{ base: 2.5, md: 3 }} mb={3}>
            <Corazon size={30} color={TINTA} />
            <Text color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1.3"
                  style={{ textShadow: INK_SHADOW }}>
              Enhorabuena por haber llegado hasta aquí.
            </Text>
          </Flex>
          <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontStyle="italic" lineHeight="1.7" mb={8}
                style={{ textShadow: INK_SHADOW }}>
            Eres muy valiente.
          </Text>

          <Box as="button" onClick={onContinuar} position="relative" overflow="hidden"
               px={9} py={3} borderRadius="full" bg={TINTA} color={PAPEL} border={`1px solid ${TINTA}`}
               fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "md", md: "lg" }} letterSpacing="0.05em"
               cursor="pointer" boxShadow={`0 6px 20px rgba(94,45,16,0.32)`} transition="all 0.2s"
               _hover={{ transform: "translateY(-2px)", boxShadow: `0 10px 28px rgba(94,45,16,0.42)` }}>
            Continuar →
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Estación del hilo: una tarjeta a todo el ancho. El título lleva debajo una
// separación horizontal, y las tarjetas se relacionan entre sí mediante una
// línea vertical que va de una a la siguiente (sin iconos).
// ─────────────────────────────────────────────────────────────────────────
function Estacion({ num, label, apoyo, dorado, last, children }: {
  num: number; label: string; apoyo?: string;
  dorado?: boolean; last?: boolean; children: React.ReactNode;
}) {
  const acento = dorado ? ORO : TINTA;
  return (
    // Cada estación se revela al asomar en pantalla: el hilo se va dibujando de
    // arriba abajo, una estación tras otra, según haces scroll.
    <Reveal inView direction="up" distance={24} duration={0.55} amount={0.3} w="100%">
      {/* Tarjeta */}
      <Box position="relative" borderRadius="2xl" overflow="hidden" border={azulBorde} boxShadow={glowPanel}>
        <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
        <Box position="relative" zIndex={1} px={{ base: 5, md: 7 }} py={{ base: 5, md: 6 }}>
          <Flex align="baseline" gap={2}>
            <Text color={acento} fontSize="2xs" fontWeight="700" opacity={0.6}>{String(num).padStart(2, "0")}</Text>
            <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" lineHeight="1.25"
                  style={{ textShadow: INK_SHADOW }}>{label}</Text>
          </Flex>
          {apoyo && (
            <Text color={TINTA} fontSize={{ base: "xs", md: "sm" }} fontStyle="italic" opacity={0.72} mt={0.5}
                  style={{ textShadow: INK_SHADOW }}>{apoyo}</Text>
          )}
          {/* Separación horizontal bajo el título */}
          <Box h="1px" w="100%" my={{ base: 3.5, md: 4 }} bg={`${TINTA}2e`} />
          {children}
        </Box>
      </Box>

      {/* Línea vertical que relaciona esta caja con la siguiente */}
      {!last && (
        <Flex justify="center">
          <Box w="2px" h={{ base: "28px", md: "38px" }} borderRadius="full"
               bgGradient={`linear(to-b, ${TINTA}66, ${TINTA}22)`} />
        </Flex>
      )}
    </Reveal>
  );
}

// Fila de píldoras (chips) crema — para listas cortas (huellas, nudos, miedos…).
function Pildoras({ items }: { items: string[] }) {
  return (
    <Flex wrap="wrap" gap={2}>
      {items.map((x, i) => (
        <Box key={i} px={{ base: 3.5, md: 4 }} py={2} borderRadius="full"
             bg="rgba(255,251,243,0.66)" border={`1px solid ${TINTA}30`}>
          <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontWeight="600" lineHeight="1.2">{x}</Text>
        </Box>
      ))}
    </Flex>
  );
}

// Chip pequeño (dentro de las tarjetas de herida / relación).
function MiniChip({ label }: { label: string }) {
  return (
    <Box px={2.5} py={1} borderRadius="full" bg={`${TINTA}12`} border={`1px solid ${TINTA}33`}>
      <Text color={TINTA} fontSize="xs" fontWeight="600" lineHeight="1.2">{label}</Text>
    </Box>
  );
}

// Estado vacío de una estación: invita a completar el paso correspondiente.
function Vacio({ texto, accion, onClick }: { texto: string; accion: string; onClick: () => void }) {
  return (
    <Flex align="center" gap={3} wrap="wrap">
      <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" opacity={0.7}
            style={{ textShadow: INK_SHADOW }}>{texto}</Text>
      <Box as="button" onClick={onClick} px={4} py={1.5} borderRadius="full" bg={TINTA} color={PAPEL}
           fontWeight="700" fontSize={{ base: "xs", md: "sm" }} cursor="pointer" transition="all 0.16s"
           _hover={{ transform: "translateY(-1px)", filter: "brightness(1.08)" }}>{accion}</Box>
    </Flex>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Popup guiado por relación: conversación con el guía (se conserva del mapa
// anterior). Las preguntas ya respondidas quedan arriba como un hilo. Su
// resultado (verdadSana / coste) es lo que lee la página de Compromiso.
// ─────────────────────────────────────────────────────────────────────────
function PopupIntegracion({ c, estadoGuardado, onUpdate, onClose }: {
  c: Constelacion;
  estadoGuardado: EstadoGuardado;
  onUpdate: (campo: keyof Constelacion, valor: string) => void;
  onClose: () => void;
}) {
  const total = BLOQUES.length;
  const [paso, setPaso] = useState(0);
  const esPrimero = paso === 0;
  const esUltimo = paso === total - 1;

  useLockBodyScroll(true);

  const cuerpoRef = useRef<HTMLDivElement | null>(null);
  const actualRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    cuerpoRef.current?.scrollTo({ top: cuerpoRef.current.scrollHeight, behavior: "smooth" });
    const t = setTimeout(() => actualRef.current?.focus(), 220);
    return () => clearTimeout(t);
  }, [paso]);

  const anterior = () => setPaso((i) => Math.max(0, i - 1));
  const siguiente = () => { if (esUltimo) onClose(); else setPaso((i) => Math.min(total - 1, i + 1)); };

  return (
    <Box position="fixed" inset={0} zIndex={2000} display="flex" alignItems="center" justifyContent="center"
         px={{ base: 4, md: 10 }} py={{ base: 5, md: 10 }} bg="rgba(0,0,0,0.72)"
         sx={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
         onClick={onClose} fontFamily="'EB Garamond', serif">
      <Box onClick={(e: React.MouseEvent) => e.stopPropagation()}
           position="relative" w="100%" maxW={{ base: "440px", md: "500px" }}
           maxH={{ base: "calc(100vh - 48px)", md: "calc(100vh - 120px)" }}
           borderRadius="2xl" overflow="hidden" display="flex" flexDirection="column"
           boxShadow={`0 0 40px ${TINTA}66, 0 24px 70px rgba(0,0,0,0.5)`}>
        <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />

        {/* Cerrar */}
        <Box as="button" onClick={onClose} position="absolute" top={3} right={3} zIndex={3}
             w="34px" h="34px" borderRadius="full" bg="rgba(255,251,243,0.7)" border={`1px solid ${TINTA}44`}
             color={TINTA} display="flex" alignItems="center" justifyContent="center" fontSize="md" cursor="pointer"
             _hover={{ bg: "rgba(255,251,243,0.95)", borderColor: TINTA }}>
          ✕
        </Box>

        {/* Cabecera: la relación, separada por una raya sólida a lo ancho */}
        <Box position="relative" zIndex={1} flexShrink={0} borderBottom={`1px solid ${TINTA}55`}
             px={{ base: 6, md: 9 }} pt={{ base: 6, md: 7 }} pb={{ base: 3.5, md: 4 }}>
          <Flex direction="column" align="center" textAlign="center" gap={0.5}>
            <Text color={TINTA} fontSize="2xs" fontWeight="700" letterSpacing="0.22em" textTransform="uppercase"
                  opacity={0.6} style={{ textShadow: INK_SHADOW }}>
              Tu relación
            </Text>
            <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" lineHeight="1.25"
                  style={{ textShadow: INK_SHADOW }}>
              {relTitulo(c)}
            </Text>
          </Flex>
        </Box>

        {/* Cuerpo scrollable: la conversación con el guía, acumulativa */}
        <Box ref={cuerpoRef} position="relative" zIndex={1} flex="1" overflowY="auto" overscrollBehavior="contain"
             px={{ base: 5, md: 8 }} py={{ base: 5, md: 6 }}
             sx={{ scrollbarWidth: "thin", "&::-webkit-scrollbar": { width: "8px" },
                   "&::-webkit-scrollbar-thumb": { background: `${TINTA}55`, borderRadius: "8px" } }}>
          <Flex direction="column" gap={{ base: 5, md: 6 }}>
            {BLOQUES.slice(0, paso + 1).map((b, i) => {
              const esActual = i === paso;
              const respuesta = (c[b.key] as string) || "";
              return (
                <Box key={b.key}>
                  {/* Mensaje del guía: la pregunta */}
                  <Flex align="flex-start" gap={{ base: 2.5, md: 3 }}>
                    <Flex flexShrink={0} w={{ base: "30px", md: "34px" }} h={{ base: "30px", md: "34px" }}
                          borderRadius="full" bg={`${TINTA}`} align="center" justify="center"
                          boxShadow={`0 2px 10px ${TINTA}44`}>
                      <NeuropsicologiaIcon size={{ base: "17px", md: "19px" }} />
                    </Flex>
                    <Box flex="1" pt={{ base: 0.5, md: 1 }} minW={0}>
                      <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="700" lineHeight="1.35"
                            style={{ textShadow: INK_SHADOW }}>
                        {b.pregunta}
                      </Text>
                      {esActual && (
                        <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} opacity={0.85} mt={1} lineHeight="1.55"
                              style={{ textShadow: INK_SHADOW }}>
                          {b.apoyo} <Box as="span" fontStyle="italic">Ej.: {b.ejemplos.join(" · ")}.</Box>
                        </Text>
                      )}
                    </Box>
                  </Flex>

                  {/* La respuesta: campo activo si es la pregunta actual; si no,
                      la cita de lo que la persona ya escribió (clicable para volver). */}
                  {esActual ? (
                    <Textarea
                      ref={actualRef}
                      value={respuesta}
                      onChange={(e) => onUpdate(b.key, e.target.value)}
                      placeholder={b.placeholder}
                      mt={3}
                      minH={{ base: "96px", md: "112px" }}
                      bg="rgba(255,251,243,0.78)" border={`1px solid ${TINTA}3a`} color={TINTA}
                      borderRadius="lg" px={4} py={3} fontFamily="'EB Garamond', serif"
                      fontSize={{ base: "md", md: "lg" }} lineHeight="1.7"
                      sx={{ caretColor: TINTA, scrollbarWidth: "thin", scrollbarColor: `${TINTA}99 transparent`,
                            "&::-webkit-scrollbar": { width: "8px" },
                            "&::-webkit-scrollbar-thumb": { background: `${TINTA}99`, borderRadius: "8px" } }}
                      _placeholder={{ color: `${TINTA}66`, fontStyle: "italic" }}
                      _hover={{ borderColor: `${TINTA}55` }}
                      _focus={{ borderColor: `${TINTA}88`, boxShadow: `0 0 0 1px ${TINTA}33`, bg: "rgba(255,251,243,0.92)" }}
                    />
                  ) : (
                    <Flex justify="flex-end" mt={2.5} pl={{ base: 6, md: 9 }}>
                      <Box as="button" onClick={() => setPaso(i)} textAlign="left" maxW="88%"
                           bg={respuesta.trim() ? `${TINTA}` : "transparent"}
                           color={respuesta.trim() ? PAPEL : `${TINTA}88`}
                           border={respuesta.trim() ? "none" : `1px dashed ${TINTA}55`}
                           borderRadius="xl" borderBottomRightRadius="sm"
                           px={{ base: 4, md: 4.5 }} py={{ base: 2.5, md: 3 }}
                           fontSize={{ base: "sm", md: "md" }} lineHeight="1.6" cursor="pointer"
                           boxShadow={respuesta.trim() ? `0 2px 12px ${TINTA}3a` : "none"}
                           transition="all 0.16s" _hover={{ transform: "translateY(-1px)", filter: "brightness(1.04)" }}
                           sx={{ whiteSpace: "pre-wrap" }}>
                        {respuesta.trim() ? respuesta : "Sin responder — toca para escribir"}
                      </Box>
                    </Flex>
                  )}
                </Box>
              );
            })}
          </Flex>
        </Box>

        {/* Footer: navegación abajo del todo + autoguardado */}
        <Box position="relative" zIndex={1} flexShrink={0} borderTop={`1px solid ${TINTA}44`}
             px={{ base: 6, md: 9 }} pt={{ base: 3.5, md: 4 }} pb={{ base: 3.5, md: 4 }}>
          <Flex justify="space-between" align="center" gap={3}>
            <Box as="button" onClick={anterior} disabled={esPrimero}
                 px={{ base: 4, md: 5 }} py={2} borderRadius="full" bg="transparent"
                 border={`1.5px solid ${TINTA}${esPrimero ? "22" : "88"}`}
                 color={esPrimero ? `${TINTA}44` : TINTA}
                 fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                 cursor={esPrimero ? "not-allowed" : "pointer"} transition="all 0.18s"
                 _hover={esPrimero ? {} : { bg: `${TINTA}14` }}>
              ‹ Anterior
            </Box>
            <Flex align="center" gap={2.5} flexShrink={0}>
              <Text color={TINTA} fontSize="xs" fontWeight="600" opacity={0.6}>{paso + 1} / {total}</Text>
              <AutoguardadoIndicador estado={estadoGuardado} color={TINTA} />
            </Flex>
            <Box as="button" onClick={siguiente}
                 px={{ base: 5, md: 6 }} py={2} borderRadius="full" bg={TINTA} color={PAPEL}
                 fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                 letterSpacing="0.04em" cursor="pointer"
                 boxShadow={`0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a`} transition="all 0.18s"
                 _hover={{ transform: "translateY(-2px)", boxShadow: `0 4px 18px rgba(0,0,0,0.28), 0 0 22px ${TINTA}5a` }}>
              {esUltimo ? "Hecho ✓" : "Siguiente ›"}
            </Box>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
