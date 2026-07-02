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
// Acento luminoso/dorado: esta página marca el inicio de la transformación y
// debe sentirse más esperanzadora que las anteriores.
const ORO = "#caa24a";
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
  const irACompromiso = () => navigate(`/metodo/psicologia/${exp.id}/compromiso`);

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
              step={{ current: 9, total: 10 }}
              mb={0}
              boxShadow={glowHeader}
              prev={{ label: "← Relación", onClick: irARelacion }}
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
              <Flex direction="column" w="100%" gap={{ base: 8, md: 10 }}>
                {relaciones.map((c) => (
                  <TarjetaIntegracion key={c.id} c={c}
                                      onCampo={(campo, v) => updateCampo(c.id, campo, v)}
                                      estadoGuardado={estadoGuardado} />
                ))}
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
function TarjetaIntegracion({ c, onCampo, estadoGuardado }: {
  c: Constelacion;
  onCampo: (campo: keyof Constelacion, valor: string) => void;
  estadoGuardado: EstadoGuardado;
}) {
  const verdad = (c.verdadSana || "").trim();
  const recordatorio = (c.recordatorio || "").trim();
  const hayResultado = verdad.length > 0 || recordatorio.length > 0;
  // Cada box llega CERRADO: el usuario va abriendo las relaciones poco a poco.
  const [abierto, setAbierto] = useState(false);

  return (
    <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
         bgColor={neuropsicologiaBg}
         border={azulBorde}
         boxShadow={glowPanel}>

      {/* Cabecera plegable — fondo de psicología (acuarela), título grande y
          centrado en color tinta, con una flecha a la derecha que cambia según
          el box esté abierto o cerrado. */}
      <Box as="button" type="button" onClick={() => setAbierto((o) => !o)}
           position="relative" overflow="hidden" w="100%" display="block" cursor="pointer"
           transition="filter 0.15s ease" _hover={{ filter: "brightness(1.04)" }}>
        <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="0" />
        <Flex position="relative" zIndex={1} align="center" px={{ base: 4, md: 6 }} py={{ base: 4, md: 5 }}>
          <Box flexShrink={0} w={{ base: "28px", md: "34px" }} display="flex" alignItems="center">
            <RelacionIcon size={22} color={TINTA} />
          </Box>
          <Text flex="1" px={2} textAlign="center" color={TINTA}
                fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1.25"
                style={{ textShadow: INK_SHADOW }}>
            {relTitulo(c)}
          </Text>
          <Box flexShrink={0} w={{ base: "28px", md: "34px" }} display="flex" justifyContent="flex-end"
               color={TINTA} transform={abierto ? "rotate(180deg)" : "rotate(0deg)"}
               transition="transform 0.25s ease">
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="24px" h="24px" fill="currentColor">
              <path d="M480-360 280-560h400L480-360Z" />
            </Box>
          </Box>
        </Flex>
      </Box>

      {abierto && (
        <>
      <Linea />

      {/* Piezas (heridas + arquetipos) SIEMPRE en una línea, con scroll horizontal. */}
      <Banda py={{ base: 4, md: 5 }}>
        <Flex gap={2} overflowX="auto" pb={1}
              sx={{ scrollbarWidth: "thin", scrollbarColor: `${TINTA}99 transparent`,
                    "&::-webkit-scrollbar": { height: "6px" },
                    "&::-webkit-scrollbar-track": { background: "transparent" },
                    "&::-webkit-scrollbar-thumb": { background: `${TINTA}99`, borderRadius: "8px" } }}>
          {c.nudos.map((n) => (
            <Pieza key={`n-${n}`} icon={<HeridaIcon size={13} color={TINTA} />} label={n} />
          ))}
          {c.arquetipos.map((a) => (
            <Pieza key={`a-${arquetipoKey(a)}`}
                   icon={<Glifo symbol={cuerpoByKey(a.cuerpoKey)?.symbol || "✦"} color={TINTA} size={13} />}
                   label={arquetipoLabel(a)} />
          ))}
        </Flex>
      </Banda>

      {/* Una banda por pregunta — cada una repinta la imagen y va separada por
          una raya horizontal entera (de borde a borde). */}
      {BLOQUES.map((b) => (
        <Box key={b.key}>
          <Linea />
          <Banda>
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
                      fontSize={{ base: "sm", md: "md" }} lineHeight="1.7"
                      sx={{ caretColor: TINTA, scrollbarWidth: "thin", scrollbarColor: `${TINTA}99 transparent`,
                            "&::-webkit-scrollbar": { width: "8px" },
                            "&::-webkit-scrollbar-track": { background: "transparent" },
                            "&::-webkit-scrollbar-thumb": { background: `${TINTA}99`, borderRadius: "8px" } }}
                      _placeholder={{ color: `${TINTA}66`, fontStyle: "italic" }}
                      _hover={{ borderColor: `${TINTA}55` }}
                      _focus={{ borderColor: ORO, boxShadow: `0 0 0 1px ${ORO}66`, bg: "rgba(255,251,243,0.88)" }} />
          </Banda>
        </Box>
      ))}

      {/* Resultado: la nueva narrativa, luminosa (banda dorada a todo el ancho) */}
      {hayResultado && (
        <>
          <Linea />
          <Box position="relative" overflow="hidden" bgGradient={`linear(135deg, ${PAPEL}, ${ORO}3a)`}>
            <Box position="relative" zIndex={1} px={{ base: 5, md: 9 }} py={{ base: 6, md: 7 }}>
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
          </Box>
        </>
      )}

      {/* Autoguardado — indicador dentro del box, abajo a la derecha */}
      <Linea />
      <Banda py={{ base: 4, md: 5 }}>
        <Flex justify="flex-end">
          <AutoguardadoIndicador estado={estadoGuardado} color={TINTA} />
        </Flex>
      </Banda>
        </>
      )}
    </Box>
  );
}

// Banda a todo el ancho que REPINTA la imagen de la disciplina (como los boxes
// de los tests). Al ser cada banda baja, la acuarela se pinta a escala natural y
// no se deforma como cuando una sola imagen cubría toda la tarjeta.
function Banda({ children, py }: { children: React.ReactNode; py?: any }) {
  return (
    <Box position="relative" overflow="hidden">
      <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="0" />
      <Box position="relative" zIndex={1} px={{ base: 5, md: 9 }} py={py ?? { base: 5, md: 6 }}>
        {children}
      </Box>
    </Box>
  );
}

// Separación entre bandas: una fina franja del marrón de psicología (de borde a
// borde), a media intensidad para que se lea como marrón y no como una raya dura.
function Linea() {
  return <Box position="relative" zIndex={1} h="2px" w="100%" bg={`${TINTA}55`} />;
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
