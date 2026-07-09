// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · INTEGRACIÓN  (ruta interna /mapa — antes «Mapa de consciencia»)
//
// El puente entre la comprensión y la transformación. Toma cada RELACIÓN que
// el usuario compuso en la página anterior y le ofrece transformar ese patrón
// en una narrativa más sana, mediante cuatro preguntas de texto libre.
//
// La pregunta central: «Ahora que entiendo por qué actúo así, ¿qué quiero
// empezar a creer y vivir?»
//
// Datos: se guardan DENTRO de cada constelación (data.constelaciones[i]):
//   proteger · coste · verdadSana (la Integración) · recordatorio.
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
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { RelacionIcon } from "../../components/metodo/RelacionIcon";
import {
  experienciaById,
  type LineaDeVidaData,
  type Constelacion,
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
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

// Los cuatro bloques del ejercicio. La `key` es el campo de la constelación.
const BLOQUES: {
  key: "proteger" | "coste" | "verdadSana" | "recordatorio";
  n: number;
  pregunta: string;
  apoyo: string;
  ejemplos: string[];
  placeholder: string;
}[] = [
  {
    key: "proteger",
    n: 1,
    pregunta: "¿Qué intentaba proteger este patrón?",
    apoyo: "Reconoce la intención positiva que había detrás del mecanismo.",
    ejemplos: ["Evitar críticas", "Sentirme suficiente", "No decepcionar", "Sentirme seguro"],
    placeholder: "Lo que en el fondo intentaba cuidar de mí…",
  },
  {
    key: "coste",
    n: 2,
    pregunta: "¿Qué coste tiene mantener este patrón?",
    apoyo: "Toma conciencia de las consecuencias que tiene hoy en tu vida.",
    ejemplos: ["Ansiedad", "Agotamiento", "Relaciones superficiales", "Falta de autenticidad"],
    placeholder: "Lo que me cuesta seguir sosteniéndolo…",
  },
  {
    key: "verdadSana",
    n: 3,
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
    n: 4,
    pregunta: "¿Qué te gustaría recordar cuando vuelvas a caer en este patrón?",
    apoyo: "Una frase breve de apoyo personal.",
    ejemplos: ["Está bien equivocarme", "Mi voz también importa", "Puedo poner límites con amor"],
    placeholder: "Una frase que quiero recordar…",
  },
];

const relTitulo = (c: Constelacion): string => (c.titulo || "").trim() || "Relación sin título";

export default function MetodoPsicologiaIntegracionEjercicio() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  const [relaciones, setRelaciones] = useState<Constelacion[]>([]);
  const [abiertoId, setAbiertoId] = useState<string | null>(null);
  const [estadoGuardado, setEstadoGuardado] = useState<EstadoGuardado>("idle");
  const dataRef = useRef<LineaDeVidaData>({});

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendiente = useRef<Constelacion[] | null>(null);
  const okTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const montado = useRef(true);
  useEffect(() => {
    // Reactivamos la bandera en CADA montaje: bajo React.StrictMode (dev) el
    // componente se monta, se desmonta y se vuelve a montar; si solo confiáramos
    // en el valor inicial del useRef, el primer cleanup dejaría `montado` en
    // false para siempre y el estado "ok"/"idle" (protegidos por montado) nunca
    // se aplicarían → el indicador se quedaría en "Guardando…" eternamente.
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
      const data = { ...dataRef.current, constelaciones: next };
      await axios.patch(`${API_URL}/metodo-psicologia/${userId}`, { data },
        { headers: { Authorization: `Bearer ${token}` } });
      dataRef.current = data;
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
    setEstadoGuardado("guardando"); // hay un cambio pendiente de guardar
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

  const irARelacion = () => navigate(`/metodo/psicologia/${exp.id}/integracion`);
  const irAMiedosPreguntas = () => navigate(`/metodo/psicologia/${exp.id}/miedos-preguntas`);
  const irACompromiso = () => navigate(`/metodo/psicologia/${exp.id}/compromiso`);
  const abierta = relaciones.find((c) => c.id === abiertoId) || null;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box position="relative" flex="1">
        <Flex position="relative" zIndex={1} justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
          <Flex direction="column" align="center" w="100%" maxW="820px" gap={{ base: 8, md: 10 }}>

            <MetodoStepHeader
              icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
              title="Integración"
              bgColor={`${neuropsicologiaBg}f0`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              step={{ current: 15, total: 16 }}
              mb={0}
              boxShadow={glowHeader}
              prev={{ label: "← Miedos", onClick: irAMiedosPreguntas }}
              next={{ label: "Compromiso →", onClick: irACompromiso }}
            />

            {/* Intro luminosa */}
            {/* <Flex direction="column" align="center" gap={3} textAlign="center" maxW="640px">
              <Text color={CREMA} fontSize={{ base: "lg", md: "xl" }} lineHeight="1.7" style={{ textShadow: "0 1px 12px rgba(0,0,0,0.35)" }}>
                Ya entiendes tu historia. Ahora puedes empezar a integrar en ti 
              </Text>
            </Flex> */}

            {relaciones.length === 0 ? (
              <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                   border={azulBorde} boxShadow={glowPanel}>
                <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                <Flex position="relative" zIndex={1} direction="column" align="center" gap={4}
                      px={{ base: 7, md: 11 }} py={{ base: 12, md: 16 }} textAlign="center">
                  <RelacionIcon size={28} color={TINTA} opacity={0.5} />
                  <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.7" style={{ textShadow: INK_SHADOW }}>
                    Aún no has creado tus relaciones. Vuelve a la página anterior para reunir tus heridas y arquetipos.
                  </Text>
                  <Box as="button" onClick={irARelacion} position="relative" overflow="hidden"
                       px={6} py={2.5} borderRadius="full" bg={TINTA} border={`1.5px solid ${TINTA}`}
                       fontWeight="700" fontSize={{ base: "sm", md: "md" }} letterSpacing="0.04em" cursor="pointer"
                       boxShadow={`0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a`} transition="all 0.18s"
                       _hover={{ transform: "translateY(-2px)", boxShadow: `0 4px 18px rgba(0,0,0,0.28), 0 0 22px ${TINTA}5a` }}>
                    <Box as="span" position="relative" zIndex={1} color={neuropsicologiaBg}
                         style={{ textShadow: `0 1px 2px rgba(0,0,0,0.3)` }}>
                      Ir a Relación →
                    </Box>
                  </Box>
                </Flex>
              </Box>
            ) : (
              <>
                {/* Tarjetas de relación — limpias. Al tocar, se abre el popup guiado. */}
                <Flex direction="column" w="100%" gap={{ base: 3.5, md: 4 }}>
                  {relaciones.map((c) => {
                    const hechas = BLOQUES.filter((b) => ((c[b.key] as string) || "").trim().length > 0).length;
                    const completo = hechas >= BLOQUES.length;
                    return (
                      <Box key={c.id} as="button" onClick={() => setAbiertoId(c.id)}
                           position="relative" w="100%" borderRadius="2xl" overflow="hidden" textAlign="left"
                           bgColor={neuropsicologiaBg} border={azulBorde} boxShadow={glowPanel}
                           cursor="pointer" transition="transform 0.16s, filter 0.16s"
                           _hover={{ transform: "translateY(-2px)", filter: "brightness(1.04)" }}>
                        <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                        <Flex position="relative" zIndex={1} align="center" gap={3}
                              px={{ base: 5, md: 7 }} py={{ base: 4, md: 5 }}>
                          <RelacionIcon size={22} color={TINTA} />
                          <Text flex="1" minW={0} color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700"
                                lineHeight="1.3" style={{ textShadow: INK_SHADOW }}>
                            {relTitulo(c)}
                          </Text>
                          <Flex align="center" gap={2} flexShrink={0}>
                            <Text color={TINTA} fontSize={{ base: "xs", md: "sm" }} fontWeight="700"
                                  opacity={completo ? 1 : 0.65} style={{ textShadow: INK_SHADOW }}>
                              {completo ? "✓" : `${hechas}/${BLOQUES.length}`}
                            </Text>
                            <Box color={TINTA} opacity={0.8} transform="translateY(1px)">
                              <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="22px" h="22px" fill="currentColor">
                                <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                              </Box>
                            </Box>
                          </Flex>
                        </Flex>
                      </Box>
                    );
                  })}
                </Flex>

                <Flex justify="center">
                  <AutoguardadoIndicador estado={estadoGuardado} color="rgba(255,255,255,0.9)" />
                </Flex>
              </>
            )}

          </Flex>
        </Flex>
      </Box>

      {/* ── POPUP GUIADO ── */}
      {abierta && (
        <PopupIntegracion
          key={abierta.id}
          c={abierta}
          estadoGuardado={estadoGuardado}
          onUpdate={(campo, v) => updateCampo(abierta.id, campo, v)}
          onClose={() => setAbiertoId(null)}
        />
      )}

      <AyudaRecorrido pagina="mapa" />

      <SiteFooter />
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Popup guiado por relación: conversación con el guía (misma estructura que
// «Enfréntate»). Las preguntas ya respondidas quedan arriba como un hilo.
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

  // El hilo crece hacia abajo: al avanzar llevamos la vista y el foco a la
  // pregunta actual, como en un chat.
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
