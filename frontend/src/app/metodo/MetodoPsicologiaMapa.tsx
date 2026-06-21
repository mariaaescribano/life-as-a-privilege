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
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Glifo } from "../../components/metodo/Glifo";
import { RelacionIcon } from "../../components/metodo/RelacionIcon";
import { HeridaIcon } from "../../components/metodo/HeridaIcon";
import { cuerpoByKey } from "../../components/metodo/astrologiaData";
import {
  experienciaById,
  arquetipoKey,
  type LineaDeVidaData,
  type Constelacion,
} from "../../components/metodo/psicologiaRecorrido";
import { arquetipoLabel } from "../../components/metodo/integracionSimbolos";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt; // #5e2d10 — marrón tinta
const PAPEL = "#fbf4e8";          // crema claro
const CREMA = "rgba(255,255,255,0.92)";
// Acento luminoso/dorado: esta página marca el inicio de la transformación y
// debe sentirse más esperanzadora que las anteriores.
const ORO = "#caa24a";
// Glow azul clásico para el header y los boxes (en vez del tono cálido).
const AZUL = "#2f6fe0";
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
  const dataRef = useRef<LineaDeVidaData>({});

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendiente = useRef<Constelacion[] | null>(null);
  const [guardadoOk, setGuardadoOk] = useState(false);

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

  const persistir = async (next: Constelacion[]) => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    try {
      const data = { ...dataRef.current, constelaciones: next };
      await axios.patch(`${API_URL}/metodo-psicologia/${userId}`, { data },
        { headers: { Authorization: `Bearer ${token}` } });
      dataRef.current = data;
    } catch {
      // silencioso
    }
  };

  // Guarda en estado y agenda persistencia (debounce) para no llamar en cada tecla.
  const commit = (next: Constelacion[]) => {
    setRelaciones(next);
    setGuardadoOk(false);
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

  const guardarAhora = async () => {
    if (saveTimer.current) { clearTimeout(saveTimer.current); saveTimer.current = null; }
    pendiente.current = null;
    await persistir(relaciones);
    setGuardadoOk(true);
  };

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  if (!exp) return null;

  const irARelacion = () => navigate(`/metodo/psicologia/${exp.id}/integracion`);
  const irASintesis = () => navigate(`/metodo/psicologia/${exp.id}/sintesis`);

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
              step={{ current: 8, total: 9 }}
              mb={0}
              boxShadow={`0 0 22px ${AZUL}77, 0 0 55px ${AZUL}44, 0 0 90px ${AZUL}26, 0 0 18px rgba(255,255,255,0.22)`}
              prev={{ label: "← Relación", onClick: irARelacion }}
              next={{ label: "Síntesis →", onClick: irASintesis }}
            />

            {/* Intro luminosa */}
            <Flex direction="column" align="center" gap={3} textAlign="center" maxW="640px">
              <Text color={CREMA} fontSize={{ base: "lg", md: "xl" }} lineHeight="1.7" style={{ textShadow: "0 1px 12px rgba(0,0,0,0.35)" }}>
                Ya entiendes tu historia. Ahora puedes empezar a escribir una nueva.
              </Text>
              <Text color={CREMA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" opacity={0.92} lineHeight="1.7">
                «Ahora que entiendo por qué actúo así, ¿qué quiero empezar a creer y vivir?»
              </Text>
            </Flex>

            {relaciones.length === 0 ? (
              <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                   border={`1px solid ${AZUL}55`} boxShadow={`0 0 22px ${AZUL}3a, 0 0 55px ${AZUL}1f`}>
                <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                <Flex position="relative" zIndex={1} direction="column" align="center" gap={4}
                      px={{ base: 7, md: 11 }} py={{ base: 12, md: 16 }} textAlign="center">
                  <RelacionIcon size={28} color={TINTA} opacity={0.5} />
                  <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.7" style={{ textShadow: INK_SHADOW }}>
                    Aún no has creado tus relaciones. Vuelve a la página anterior para reunir tus heridas y arquetipos.
                  </Text>
                  <Box as="button" onClick={irARelacion} position="relative" overflow="hidden"
                       px={6} py={2.5} borderRadius="full" border={`1.5px solid ${AZUL}`}
                       fontWeight="700" fontSize={{ base: "sm", md: "md" }} letterSpacing="0.04em" cursor="pointer"
                       boxShadow={`0 0 16px ${AZUL}66, 0 0 40px ${AZUL}33`} transition="all 0.18s"
                       _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 24px ${AZUL}88, 0 0 56px ${AZUL}44` }}>
                    <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="full" />
                    <Box as="span" position="relative" zIndex={1} color={TINTA}
                         style={{ textShadow: `0 1px 2px ${PAPEL}, 0 0 8px ${PAPEL}` }}>
                      Ir a Relación →
                    </Box>
                  </Box>
                </Flex>
              </Box>
            ) : (
              <Flex direction="column" w="100%" gap={{ base: 8, md: 10 }}>
                {relaciones.map((c) => (
                  <TarjetaIntegracion key={c.id} c={c}
                                      onCampo={(campo, v) => updateCampo(c.id, campo, v)} />
                ))}

                {/* Guardar — fondo con la imagen de psicología + glow azul */}
                <Flex justify="center" pt={1}>
                  <Box as="button" onClick={guardarAhora} position="relative" overflow="hidden"
                       px={{ base: 9, md: 11 }} py={3} borderRadius="full"
                       border={`1.5px solid ${AZUL}`} fontFamily="'EB Garamond', serif" fontWeight="700"
                       fontSize={{ base: "md", md: "lg" }} letterSpacing="0.05em" cursor="pointer"
                       boxShadow={`0 0 18px ${AZUL}66, 0 0 44px ${AZUL}33`} transition="all 0.18s"
                       _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 26px ${AZUL}88, 0 0 60px ${AZUL}44` }}>
                    <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="full" />
                    <Box as="span" position="relative" zIndex={1} color={TINTA}
                         style={{ textShadow: `0 1px 2px ${PAPEL}, 0 0 8px ${PAPEL}` }}>
                      {guardadoOk ? "Guardado ✓" : "Guardar"}
                    </Box>
                  </Box>
                </Flex>
              </Flex>
            )}

          </Flex>
        </Flex>
      </Box>

      <AyudaRecorrido pagina="mapa" />

      <SiteFooter />
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Una tarjeta de integración por relación.
// ─────────────────────────────────────────────────────────────────────────
function TarjetaIntegracion({ c, onCampo }: {
  c: Constelacion;
  onCampo: (campo: keyof Constelacion, valor: string) => void;
}) {
  const verdad = (c.verdadSana || "").trim();
  const recordatorio = (c.recordatorio || "").trim();
  const hayResultado = verdad.length > 0 || recordatorio.length > 0;

  return (
    <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
         border={`1px solid ${AZUL}66`}
         boxShadow={`0 0 24px ${AZUL}66, 0 0 60px ${AZUL}33`}>
      <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
      <Box position="relative" zIndex={1} px={{ base: 5, md: 9 }} py={{ base: 7, md: 9 }}>

        {/* Cabecera: título de la relación */}
        <Flex align="center" gap={2.5}>
          <RelacionIcon size={20} color={TINTA} />
          <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" lineHeight="1.25"
                style={{ textShadow: INK_SHADOW }}>
            {relTitulo(c)}
          </Text>
        </Flex>

        {/* Raya bajo el título */}
        <Box h="1px" w="100%" my={{ base: 4, md: 5 }} bgGradient={`linear(to-r, transparent, ${TINTA}55, transparent)`} />

        {/* Piezas (heridas + arquetipos) SIEMPRE en una línea, con scroll horizontal. */}
        <Flex gap={2} overflowX="auto" pb={2}
              sx={{ scrollbarWidth: "thin",
                    "&::-webkit-scrollbar": { height: "6px" },
                    "&::-webkit-scrollbar-thumb": { background: `${TINTA}40`, borderRadius: "8px" } }}>
          {c.nudos.map((n) => (
            <Pieza key={`n-${n}`} icon={<HeridaIcon size={13} color={TINTA} />} label={n} />
          ))}
          {c.arquetipos.map((a) => (
            <Pieza key={`a-${arquetipoKey(a)}`}
                   icon={<Glifo symbol={cuerpoByKey(a.cuerpoKey)?.symbol || "✦"} color={TINTA} size={13} />}
                   label={arquetipoLabel(a)} />
          ))}
        </Flex>

        {/* Raya bajo las piezas */}
        <Box h="1px" w="100%" mt={2} mb={{ base: 6, md: 7 }} bgGradient={`linear(to-r, transparent, ${TINTA}55, transparent)`} />

        {/* Los cuatro bloques */}
        <Flex direction="column" gap={{ base: 5, md: 6 }}>
          {BLOQUES.map((b) => (
            <Box key={b.key}>
              <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="800" lineHeight="1.3" mb={2}
                    style={{ textShadow: INK_SHADOW }}>{b.pregunta}</Text>
              <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} opacity={0.95} mb={2.5}
                    lineHeight="1.55" style={{ textShadow: INK_SHADOW }}>
                {b.apoyo} <Box as="span" fontStyle="italic">Ej.: {b.ejemplos.join(" · ")}.</Box>
              </Text>
              <Textarea value={(c[b.key] as string) || ""} onChange={(e) => onCampo(b.key, e.target.value)}
                        placeholder={b.placeholder}
                        minH={b.key === "recordatorio" ? "56px" : "78px"}
                        bg="rgba(255,251,243,0.7)" border={`1px solid ${TINTA}3a`} color={TINTA}
                        borderRadius="lg" px={3.5} py={2.5} fontFamily="'EB Garamond', serif"
                        fontSize={{ base: "sm", md: "md" }} lineHeight="1.7" sx={{ caretColor: TINTA }}
                        _placeholder={{ color: `${TINTA}66`, fontStyle: "italic" }}
                        _hover={{ borderColor: `${TINTA}55` }}
                        _focus={{ borderColor: ORO, boxShadow: `0 0 0 1px ${ORO}66`, bg: "rgba(255,251,243,0.88)" }} />
            </Box>
          ))}
        </Flex>

        {/* Resultado: la nueva narrativa, luminosa */}
        {hayResultado && (
          <Box mt={{ base: 7, md: 8 }} borderRadius="xl" overflow="hidden"
               bgGradient={`linear(135deg, ${PAPEL}, ${ORO}3a)`}
               border={`1px solid ${ORO}88`} boxShadow={`0 0 24px ${ORO}44, 0 0 50px ${ORO}22`}
               px={{ base: 5, md: 7 }} py={{ base: 5, md: 6 }}>
            <Text color={ORO} fontSize="2xs" fontWeight="700" letterSpacing="0.22em" textTransform="uppercase"
                  mb={3} style={{ textShadow: `0 1px 2px ${PAPEL}` }}>
              ✦ Tu integración
            </Text>
            {verdad && (
              <Box mb={recordatorio ? 4 : 0}>
                <Text color={TINTA} fontSize="2xs" fontWeight="700" letterSpacing="0.18em" textTransform="uppercase" opacity={0.6} mb={0.5}>
                  Integración
                </Text>
                <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontStyle="italic" fontWeight="600" lineHeight="1.5">
                  «{verdad}»
                </Text>
              </Box>
            )}
            {recordatorio && (
              <Box>
                <Text color={TINTA} fontSize="2xs" fontWeight="700" letterSpacing="0.18em" textTransform="uppercase" opacity={0.6} mb={0.5}>
                  Recordatorio
                </Text>
                <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.6">
                  {recordatorio}
                </Text>
              </Box>
            )}
          </Box>
        )}

      </Box>
    </Box>
  );
}

// Chip sobrio para mostrar herida / arquetipo (no editable aquí).
function Pieza({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Flex flexShrink={0} align="center" gap={1.5} px={2.5} py={1} borderRadius="full"
          bg={`${TINTA}12`} color={TINTA} border={`1px solid ${TINTA}33`}>
      {icon}
      <Text fontSize="xs" fontWeight="600" lineHeight="1.2" whiteSpace="nowrap">{label}</Text>
    </Flex>
  );
}
