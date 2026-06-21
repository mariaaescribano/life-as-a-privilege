// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · SÍNTESIS DEL CAMINO  (cierre del recorrido · 9/9)
//
// No es una página de trabajo: es de contemplación. El usuario observa toda su
// historia psicológica resumida en un solo lugar y reconoce el recorrido.
//
// Estructura:
//   · Cabecera con el problema principal (el punto de partida del viaje).
//   · Tabla de integración: una fila por relación, cada una una cadena completa
//     de significado (Nudo → Herida → Arquetipo → Relación → Integración →
//     Aprendizaje). Cada fila se expande para ver el detalle.
//   · Cierre: «¿Qué capítulo quieres empezar a escribir ahora?» (texto libre).
//
// Datos: lee data.constelaciones + data.heridas + data["problema-actual"].
// Escribe: aprendizaje por relación (constelaciones[i].aprendizaje) y el
// próximo capítulo (data.proximoCapitulo).
// ─────────────────────────────────────────────────────────────────────────
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text, Input, Textarea } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Glifo } from "../../components/metodo/Glifo";
import { RelacionIcon } from "../../components/metodo/RelacionIcon";
import { cuerpoByKey } from "../../components/metodo/astrologiaData";
import {
  experienciaById,
  heridaByLabel,
  APRENDIZAJES_SUGERIDOS,
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

const TINTA = neuropsicologiaTxt; // #5e2d10
const PAPEL = "#fbf4e8";
const CREMA = "rgba(255,255,255,0.92)";
const ORO = "#caa24a";
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

// Cada relación se presenta en su propio box, con un color de esta paleta
// (misma familia que la página «Relación»), para que la síntesis respire.
const PALETA = [
  "#e7c4ad", // melocotón
  "#cfe0d2", // menta suave
  "#d9cde8", // lavanda
  "#e8dcb0", // mantequilla
  "#bfd6e6", // cielo
  "#ecc7cf", // rosa palo
  "#cdd9b8", // pistacho
  "#e3cdbf", // arena rosada
];
function colorPorId(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return PALETA[h % PALETA.length];
}

// Datos ya resueltos de una fila (cadena completa).
interface Fila {
  c: Constelacion;
  nudos: string[];
  heridas: string[];
  arquetipos: string[];
  // Detalle (expandible)
  comprension: string;
  proteger: string;
  coste: string;
  recordatorio: string;
  huellas: string[];
}

function construirFila(data: LineaDeVidaData, c: Constelacion): Fila {
  const heridasLabels = c.nudos || [];
  const nudosSet = new Set<string>();
  const huellasSet = new Set<string>();
  for (const label of heridasLabels) {
    const h = heridaByLabel(data, label);
    h?.nudos?.forEach((n) => n && nudosSet.add(n));
    h?.huellas?.forEach((hu) => hu && huellasSet.add(hu));
  }
  return {
    c,
    nudos: [...nudosSet],
    heridas: heridasLabels,
    arquetipos: (c.arquetipos || []).map((a) => arquetipoLabel(a)),
    comprension: (c.texto || "").trim(),
    proteger: (c.proteger || "").trim(),
    coste: (c.coste || "").trim(),
    recordatorio: (c.recordatorio || "").trim(),
    huellas: [...huellasSet],
  };
}

export default function MetodoPsicologiaSintesis() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  const [problema, setProblema] = useState("");
  const [relaciones, setRelaciones] = useState<Constelacion[]>([]);
  const [capitulo, setCapitulo] = useState("");
  const [expandida, setExpandida] = useState<string | null>(null);
  const [guardadoOk, setGuardadoOk] = useState(false);
  const dataRef = useRef<LineaDeVidaData>({});

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendiente = useRef<{ rels: Constelacion[]; cap: string } | null>(null);

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
        setProblema(typeof d["problema-actual"] === "string" ? (d["problema-actual"] as string) : "");
        setRelaciones(Array.isArray(d.constelaciones) ? d.constelaciones.map((c) => ({ ...c })) : []);
        setCapitulo(typeof d.proximoCapitulo === "string" ? d.proximoCapitulo : "");
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  const persistir = async (rels: Constelacion[], cap: string) => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    try {
      const data = { ...dataRef.current, constelaciones: rels, proximoCapitulo: cap };
      await axios.patch(`${API_URL}/metodo-psicologia/${userId}`, { data },
        { headers: { Authorization: `Bearer ${token}` } });
      dataRef.current = data;
    } catch {
      // silencioso
    }
  };

  // Guarda en estado y agenda persistencia (debounce).
  const commit = (rels: Constelacion[], cap: string) => {
    setRelaciones(rels);
    setCapitulo(cap);
    setGuardadoOk(false);
    pendiente.current = { rels, cap };
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (pendiente.current) { void persistir(pendiente.current.rels, pendiente.current.cap); pendiente.current = null; }
    }, 900);
  };

  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (pendiente.current) void persistir(pendiente.current.rels, pendiente.current.cap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setAprendizaje = (id: string, valor: string) =>
    commit(relaciones.map((c) => (c.id === id ? { ...c, aprendizaje: valor } : c)), capitulo);

  const guardarAhora = async () => {
    if (saveTimer.current) { clearTimeout(saveTimer.current); saveTimer.current = null; }
    pendiente.current = null;
    await persistir(relaciones, capitulo);
    setGuardadoOk(true);
  };

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  if (!exp) return null;

  const filas = relaciones.map((c) => construirFila(dataRef.current, c));
  // El usuario suele escribir varios problemas en un mismo texto (uno por línea).
  const problemas = problema.split(/\n+/).map((s) => s.trim()).filter(Boolean);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box position="relative" flex="1">
        <Flex position="relative" zIndex={1} justify="center" px={{ base: 4, md: 8, lg: 12 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
          <Flex direction="column" align="center" w="100%" maxW="1180px" gap={{ base: 8, md: 11 }}>

            <MetodoStepHeader
              icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
              title="Síntesis"
              bgColor={`${neuropsicologiaBg}f0`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              step={{ current: 9, total: 9 }}
              mb={0}
              boxShadow={`0 0 22px ${ORO}66, 0 0 55px ${ORO}3a, 0 0 90px ${ORO}1f, 0 0 18px rgba(255,255,255,0.22)`}
              prev={{ label: "← Integración", onClick: () => navigate(`/metodo/psicologia/${exp.id}/mapa`) }}
            />

            {/* Frase de contemplación */}
            <Text color={CREMA} fontSize={{ base: "lg", md: "xl" }} fontStyle="italic" textAlign="center" maxW="640px"
                  lineHeight="1.7" style={{ textShadow: "0 1px 12px rgba(0,0,0,0.35)" }}>
              Ya no estás perdido dentro de tu historia. Ahora puedes verla completa.
            </Text>

            {/* ── De dónde partí: los problemas ── */}
            <Box position="relative" w="100%" maxW="760px" borderRadius="2xl" overflow="hidden"
                 border={`1px solid ${ORO}55`} boxShadow={`0 0 22px ${ORO}3a, 0 0 55px ${ORO}1f`}>
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 7, md: 9 }}>
                <Text color={ORO} fontSize="2xs" fontWeight="700" letterSpacing="0.24em" textTransform="uppercase"
                      textAlign="center" mb={1} style={{ textShadow: `0 1px 2px ${PAPEL}` }}>
                  De aquí partí
                </Text>
                <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" textAlign="center" mb={5}
                      style={{ textShadow: INK_SHADOW }}>
                  Lo que me trajo hasta aquí
                </Text>
                {problemas.length > 0 ? (
                  <Flex direction="column" gap={3}>
                    {problemas.map((p, i) => (
                      <Flex key={i} align="flex-start" gap={3} borderRadius="xl"
                            bg="rgba(255,251,243,0.6)" border={`1px solid ${TINTA}26`}
                            px={{ base: 4, md: 5 }} py={{ base: 3, md: 3.5 }}>
                        <Box flexShrink={0} mt="9px" w="7px" h="7px" borderRadius="full" bg={ORO}
                             boxShadow={`0 0 8px ${ORO}aa`} />
                        <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.65">
                          {p}
                        </Text>
                      </Flex>
                    ))}
                  </Flex>
                ) : (
                  <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" opacity={0.7}
                        textAlign="center" style={{ textShadow: INK_SHADOW }}>
                    Aquí aparecerán los problemas con los que empezaste tu camino.
                  </Text>
                )}
              </Box>
            </Box>

            {/* ── La síntesis: un box de color por relación ── */}
            {filas.length === 0 ? (
              <Box position="relative" w="100%" maxW="760px" borderRadius="2xl" overflow="hidden"
                   border={`1px solid ${ORO}55`} boxShadow={`0 0 22px ${ORO}3a, 0 0 55px ${ORO}1f`}>
                <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                <Flex position="relative" zIndex={1} direction="column" align="center" gap={4}
                      px={{ base: 7, md: 11 }} py={{ base: 12, md: 16 }} textAlign="center">
                  <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.7"
                        style={{ textShadow: INK_SHADOW }}>
                    Tu síntesis aparecerá cuando hayas creado tus relaciones e integraciones.
                  </Text>
                  <Box as="button" onClick={() => navigate(`/metodo/psicologia/${exp.id}/mapa`)}
                       px={6} py={2.5} borderRadius="full" bg={TINTA} color={PAPEL} fontWeight="700"
                       fontSize={{ base: "sm", md: "md" }} letterSpacing="0.04em" cursor="pointer"
                       boxShadow={`0 0 16px ${ORO}66`} transition="all 0.18s"
                       _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 24px ${ORO}88` }}>
                    Ir a Integración →
                  </Box>
                </Flex>
              </Box>
            ) : (
              <Flex direction="column" w="100%" gap={{ base: 7, md: 9 }}>
                {filas.map((fila) => (
                  <TarjetaSintesis
                    key={fila.c.id}
                    fila={fila}
                    color={colorPorId(fila.c.id)}
                    expandida={expandida === fila.c.id}
                    onToggle={() => setExpandida((id) => (id === fila.c.id ? null : fila.c.id))}
                    onAprendizaje={(v) => setAprendizaje(fila.c.id, v)}
                  />
                ))}
              </Flex>
            )}

            {/* ── Cierre: el próximo capítulo ── */}
            <Box position="relative" w="100%" maxW="760px" borderRadius="2xl" overflow="hidden"
                 border={`1px solid ${ORO}66`}
                 boxShadow={`0 0 26px ${ORO}55, 0 0 60px ${ORO}2f`}>
              <Box position="absolute" inset="0" zIndex={0}
                   bgGradient={`linear(135deg, ${PAPEL}, ${ORO}33)`} />
              <Box position="relative" zIndex={1} px={{ base: 7, md: 11 }} py={{ base: 9, md: 12 }} textAlign="center">
                <Text color={TINTA} fontSize={{ base: "xl", md: "3xl" }} fontWeight="700" lineHeight="1.35" mb={2}
                      style={{ textShadow: `0 1px 2px ${PAPEL}` }}>
                  ¿Qué capítulo quieres empezar a escribir ahora?
                </Text>
                <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" opacity={0.8} mb={6}>
                  No se trata de analizar el pasado. Se trata de mirar hacia adelante.
                </Text>
                <Textarea
                  value={capitulo}
                  onChange={(e) => commit(relaciones, e.target.value)}
                  placeholder="Lo que quiero empezar a vivir desde hoy…"
                  w="100%" maxW="600px" mx="auto" minH={{ base: "140px", md: "170px" }}
                  bg="rgba(255,251,243,0.75)" border={`1px solid ${TINTA}3a`} color={TINTA}
                  borderRadius="xl" px={{ base: 5, md: 6 }} py={{ base: 4, md: 5 }}
                  fontFamily="'EB Garamond', serif" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8"
                  sx={{ caretColor: TINTA }}
                  _placeholder={{ color: `${TINTA}66`, fontStyle: "italic" }}
                  _hover={{ borderColor: `${TINTA}55` }}
                  _focus={{ borderColor: ORO, boxShadow: `0 0 0 1px ${ORO}66`, bg: "rgba(255,251,243,0.9)" }}
                />
                <Box as="button" onClick={guardarAhora} position="relative" overflow="hidden"
                     display="block" mx="auto" mt={7} px={{ base: 9, md: 11 }} py={3} borderRadius="full"
                     border={`1.5px solid ${ORO}`} fontFamily="'EB Garamond', serif" fontWeight="700"
                     fontSize={{ base: "md", md: "lg" }} letterSpacing="0.05em" cursor="pointer"
                     boxShadow={`0 0 18px ${ORO}66, 0 0 44px ${ORO}33`} transition="all 0.18s"
                     _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 26px ${ORO}88, 0 0 60px ${ORO}44` }}>
                  <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="full" />
                  <Box as="span" position="relative" zIndex={1} color={TINTA}
                       style={{ textShadow: `0 1px 2px ${PAPEL}, 0 0 8px ${PAPEL}` }}>
                    {guardadoOk ? "Guardado ✓" : "Guardar"}
                  </Box>
                </Box>
              </Box>
            </Box>

          </Flex>
        </Flex>
      </Box>

      <AyudaRecorrido pagina="sintesis" />

      <SiteFooter />
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Una tarjeta de color por relación (una cadena completa de significado).
// Respira: cada una es su propio box, con su color y su glow. Expandible.
// ─────────────────────────────────────────────────────────────────────────
function TarjetaSintesis({ fila, color, expandida, onToggle, onAprendizaje }: {
  fila: Fila;
  color: string;
  expandida: boolean;
  onToggle: () => void;
  onAprendizaje: (v: string) => void;
}) {
  const { c } = fila;
  const titulo = (c.titulo || "").trim() || "Relación sin título";
  const integracion = (c.verdadSana || "").trim();
  const aprendizaje = (c.aprendizaje || "").trim();
  const hayDetalle =
    fila.comprension || fila.proteger || fila.coste || fila.recordatorio || fila.huellas.length > 0;

  return (
    <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
         bgGradient={`linear(135deg, ${PAPEL}, ${color}80)`}
         border={`1px solid ${color}`}
         boxShadow={`0 0 24px ${color}99, 0 0 60px ${color}44`}>
      <Box px={{ base: 5, md: 8 }} py={{ base: 6, md: 8 }}>

        {/* Título de la relación */}
        <Flex align="center" gap={2.5} mb={{ base: 5, md: 6 }}>
          <RelacionIcon size={20} color={TINTA} />
          <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" lineHeight="1.25"
                style={{ textShadow: `0 1px 2px ${PAPEL}` }}>
            {titulo}
          </Text>
        </Flex>

        {/* Las celdas de la cadena (respiran en su propio recuadro) */}
        <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={{ base: 3.5, md: 4 }}>
          <Campo label="Nudo">
            {fila.nudos.length ? <ListaTexto items={fila.nudos} /> : <Vacio />}
          </Campo>
          <Campo label="Herida">
            {fila.heridas.length ? <ListaTexto items={fila.heridas} italic /> : <Vacio />}
          </Campo>
          <Campo label="Arquetipo">
            {fila.arquetipos.length ? (
              <Flex direction="column" gap={1.5}>
                {c.arquetipos.map((a, idx) => (
                  <Flex key={idx} align="center" gap={1.5}>
                    <Glifo symbol={cuerpoByKey(a.cuerpoKey)?.symbol || "✦"} color={TINTA} size={14} />
                    <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} lineHeight="1.4">{fila.arquetipos[idx]}</Text>
                  </Flex>
                ))}
              </Flex>
            ) : <Vacio />}
          </Campo>
          <Campo label="Integración" destacado>
            {integracion ? (
              <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" fontWeight="600" lineHeight="1.45">
                «{integracion}»
              </Text>
            ) : <Vacio />}
          </Campo>
        </Box>

        {/* Aprendizaje: la esencia que el usuario se lleva */}
        <Box mt={{ base: 4, md: 5 }}>
          <Text color={ORO} fontSize="2xs" fontWeight="700" letterSpacing="0.16em" textTransform="uppercase" mb={2}
                style={{ textShadow: `0 1px 2px ${PAPEL}` }}>
            Aprendizaje · la esencia que me llevo
          </Text>
          <AprendizajeEditor valor={aprendizaje} onChange={onAprendizaje} />
        </Box>

        {/* Ver detalle */}
        {hayDetalle && (
          <Flex mt={4} justify="flex-end">
            <Box as="button" onClick={onToggle}
                 display="inline-flex" alignItems="center" gap={1.5} px={3} py={1} borderRadius="full"
                 color={TINTA} fontSize="xs" fontWeight="600" letterSpacing="0.03em" opacity={0.85}
                 cursor="pointer" transition="all 0.15s" _hover={{ bg: `${TINTA}10`, opacity: 1 }}>
              {expandida ? "Ocultar detalle" : "Ver detalle"}
              <Box as="span" transform={expandida ? "rotate(180deg)" : "none"} transition="transform 0.2s">▾</Box>
            </Box>
          </Flex>
        )}

        {/* Panel de detalle */}
        {expandida && hayDetalle && (
          <Box mt={3} borderRadius="xl" bg="rgba(255,251,243,0.6)" border={`1px solid ${TINTA}26`}
               px={{ base: 4, md: 6 }} py={{ base: 4, md: 5 }}>
            <Flex direction="column" gap={4}>
              {fila.huellas.length > 0 && <Detalle label="Huellas" items={fila.huellas} />}
              {fila.comprension && <Detalle label="Lo que comprendí" texto={fila.comprension} />}
              {fila.proteger && <Detalle label="Qué protegía" texto={fila.proteger} />}
              {fila.coste && <Detalle label="Su coste" texto={fila.coste} />}
              {fila.recordatorio && <Detalle label="Recordatorio" texto={fila.recordatorio} />}
            </Flex>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// Recuadro de un campo de la cadena, con su etiqueta. `destacado` resalta la
// Integración (el resultado de la transformación).
function Campo({ label, children, destacado }: { label: string; children: React.ReactNode; destacado?: boolean }) {
  return (
    <Box minW={0} borderRadius="xl" px={{ base: 4, md: 5 }} py={{ base: 3, md: 3.5 }}
         bg={destacado ? "rgba(255,251,243,0.82)" : "rgba(255,251,243,0.52)"}
         border={`1px solid ${destacado ? `${ORO}88` : `${TINTA}1f`}`}
         boxShadow={destacado ? `0 0 16px ${ORO}33` : "none"}>
      <Text color={destacado ? ORO : `${TINTA}`} opacity={destacado ? 1 : 0.7} fontSize="2xs" fontWeight="700"
            letterSpacing="0.16em" textTransform="uppercase" mb={1.5} style={{ textShadow: `0 1px 2px ${PAPEL}` }}>
        {label}
      </Text>
      {children}
    </Box>
  );
}

function ListaTexto({ items, italic }: { items: string[]; italic?: boolean }) {
  return (
    <Flex direction="column" gap={1}>
      {items.map((t, i) => (
        <Text key={i} color={TINTA} fontSize={{ base: "sm", md: "md" }} fontStyle={italic ? "italic" : "normal"} lineHeight="1.45">
          {t}
        </Text>
      ))}
    </Flex>
  );
}

const Vacio = () => <Text color={`${TINTA}66`} fontSize="sm" fontStyle="italic">—</Text>;

function Detalle({ label, texto, items }: { label: string; texto?: string; items?: string[] }) {
  return (
    <Box>
      <Text color={TINTA} fontSize="2xs" fontWeight="700" letterSpacing="0.16em" textTransform="uppercase" opacity={0.6} mb={0.5}>
        {label}
      </Text>
      {texto && <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} lineHeight="1.6" whiteSpace="pre-wrap">{texto}</Text>}
      {items && (
        <Flex direction="column" gap={0.5}>
          {items.map((it, i) => (
            <Text key={i} color={TINTA} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" lineHeight="1.5">· {it}</Text>
          ))}
        </Flex>
      )}
    </Box>
  );
}

// Editor de la columna Aprendizaje: una esencia que el usuario elige. Chips
// sugeridos (selección rápida) + campo libre para escribir la suya.
function AprendizajeEditor({ valor, onChange }: { valor: string; onChange: (v: string) => void }) {
  const sugeridoActivo = (s: string) => valor.trim().toLowerCase() === s.toLowerCase();
  return (
    <Flex direction="column" gap={2}>
      <Input
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tu esencia…"
        bg="rgba(255,251,243,0.7)" border={`1px solid ${ORO}66`} color={TINTA}
        borderRadius="lg" px={3} py={2} size="sm" h="auto"
        fontFamily="'EB Garamond', serif" fontSize={{ base: "sm", md: "md" }} fontWeight="700"
        sx={{ caretColor: TINTA }}
        _placeholder={{ color: `${TINTA}66`, fontStyle: "italic", fontWeight: 400 }}
        _hover={{ borderColor: ORO }}
        _focus={{ borderColor: ORO, boxShadow: `0 0 0 1px ${ORO}66`, bg: "rgba(255,251,243,0.9)" }}
      />
      <Flex wrap="wrap" gap={1.5}>
        {APRENDIZAJES_SUGERIDOS.map((s) => {
          const activo = sugeridoActivo(s);
          return (
            <Box as="button" key={s} onClick={() => onChange(activo ? "" : s)}
                 px={2} py={0.5} borderRadius="full" fontSize="2xs" fontWeight="600" cursor="pointer"
                 bg={activo ? ORO : `${TINTA}0d`} color={activo ? PAPEL : TINTA}
                 border={`1px solid ${activo ? ORO : `${TINTA}33`}`} transition="all 0.14s"
                 _hover={{ borderColor: ORO, bg: activo ? ORO : `${ORO}1f` }}>
              {s}
            </Box>
          );
        })}
      </Flex>
    </Flex>
  );
}
