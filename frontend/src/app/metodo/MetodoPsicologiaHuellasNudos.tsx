import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text, Textarea, Input } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { NudoEspiralIcon } from "../../components/metodo/NudoEspiralIcon";
import { HeridaIcon } from "../../components/metodo/HeridaIcon";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { AutoguardadoIndicador, type EstadoGuardado } from "../../components/global/AutoguardadoIndicador";
import {
  experienciaById,
  type LineaDeVidaData,
  type RelacionHuellaNudo,
} from "../../components/metodo/psicologiaRecorrido";
import { AZUL, glowPanel, glowHeader, azulBorde } from "../../components/metodo/psicologiaGlow";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt;
const PAPEL = "#fbf4e8";
const COL_H = { base: "440px", md: "520px", lg: "640px" } as const;
const SCROLL_SX = {
  scrollbarWidth: "thin" as const,
  scrollbarColor: `${TINTA}66 transparent`,
  "&::-webkit-scrollbar": { width: "7px" },
  "&::-webkit-scrollbar-thumb": { background: `${TINTA}66`, borderRadius: "8px" },
};

type Arrastre = { tipo: "huella" | "nudo"; texto: string } | null;

const nuevoId = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `h-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

const heridaVacia = (): RelacionHuellaNudo => ({ id: nuevoId(), titulo: "", huellas: [], nudos: [], texto: "" });

// Paleta pastel discreta: cada herida toma un color estable (según su id).
const PALETA_HERIDA = [
  "#e7c4ad", // melocotón
  "#cfe0d2", // menta suave
  "#d9cde8", // lavanda
  "#e8dcb0", // mantequilla
  "#bfd6e6", // cielo
  "#ecc7cf", // rosa palo
  "#cdd9b8", // pistacho
  "#e3cdbf", // arena rosada
];
function colorHerida(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return PALETA_HERIDA[h % PALETA_HERIDA.length];
}

/** Todas las huellas marcadas (ítems), aplanadas de todos los años. */
function todasLasHuellas(d: LineaDeVidaData): string[] {
  const out: string[] = [];
  const anos = d?.anos || {};
  for (const k of Object.keys(anos)) {
    const h = anos[k]?.huellas;
    if (Array.isArray(h)) for (const t of h) { const s = (t || "").trim(); if (s) out.push(s); }
  }
  return out;
}

// ◈ icono de huella, en color psicología.
const HuellaIcon = ({ size = 16, color = TINTA, opacity = 1 }: { size?: number; color?: string; opacity?: number }) => (
  <Box as="span" lineHeight="1" flexShrink={0} style={{ fontSize: `${size}px`, color, opacity }}>◈</Box>
);

// Cabecera DENTRO del box. Lleva su PROPIA imagen de psicología (independiente
// de la del cuerpo) y se separa de él con una raya horizontal sólida a lo ancho.
// Así cada zona tiene su propio recorte de la imagen (menos distorsión).
function ColumnaHeaderBox({ icono, titulo, apoyo }: { icono: React.ReactNode; titulo: string; apoyo?: string }) {
  return (
    <Box flexShrink={0} position="relative" overflow="hidden" borderBottom={`1px solid ${TINTA}55`}>
      {/* Imagen propia de la cabecera */}
      <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="0" />
      <Box position="relative" zIndex={1} px={{ base: 4, md: 5 }} pt={{ base: 4, md: 5 }} pb={{ base: 3, md: 3.5 }}>
        <Flex direction="column" align="center" gap={1} textAlign="center">
          <Flex align="center" gap={2.5}>
            <Box flexShrink={0} display="flex" alignItems="center" justifyContent="center"
                 style={{ filter: `drop-shadow(0 1px 2px ${PAPEL})` }}>{icono}</Box>
            <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.03em"
                  style={{ textShadow: `0 1px 2px ${PAPEL}` }}>{titulo}</Text>
          </Flex>
          {apoyo && (
            <Text color={TINTA} fontSize="xs" fontStyle="italic" opacity={0.8} maxW="300px"
                  style={{ textShadow: `0 1px 2px ${PAPEL}` }}>{apoyo}</Text>
          )}
        </Flex>
      </Box>
    </Box>
  );
}

export default function MetodoPsicologiaHuellasNudos() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  const [estadoGuardado, setEstadoGuardado] = useState<EstadoGuardado>("idle");
  const [nudos, setNudos] = useState<string[]>([]);
  const [huellas, setHuellas] = useState<string[]>([]);
  const [heridas, setHeridas] = useState<RelacionHuellaNudo[]>([]);
  const [activaId, setActivaId] = useState<string | null>(null);
  const [pasosOpen, setPasosOpen] = useState(false); // popup «¿Cómo se hace?»
  const dataRef = useRef<LineaDeVidaData>({});
  useLockBodyScroll(pasosOpen);

  const arrastreRef = useRef<Arrastre>(null);
  const [sobreMesa, setSobreMesa] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendiente = useRef<RelacionHuellaNudo[] | null>(null);
  const okTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const montado = useRef(true);
  useEffect(() => () => {
    montado.current = false;
    if (okTimer.current) clearTimeout(okTimer.current);
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

        const psi = await axios.get(`${API_URL}/metodo-psicologia/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        const d: LineaDeVidaData = psi.data?.data || {};
        dataRef.current = d;
        setNudos(Array.isArray(d.nudos) ? d.nudos : []);
        setHuellas(todasLasHuellas(d));
        const hs = Array.isArray(d.heridas) ? d.heridas.map((h) => ({ ...h, titulo: h.titulo ?? "" })) : [];
        setHeridas(hs);
        if (hs.length > 0) setActivaId(hs[hs.length - 1].id);
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  const persistir = async (next: RelacionHuellaNudo[]): Promise<boolean> => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return false;
    if (montado.current) setEstadoGuardado("guardando");
    try {
      const data = { ...dataRef.current, heridas: next };
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

  const commit = (next: RelacionHuellaNudo[]) => {
    setHeridas(next);
    setEstadoGuardado("guardando"); // hay un cambio pendiente de guardar
    pendiente.current = next;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (pendiente.current) { void persistir(pendiente.current); pendiente.current = null; }
    }, 900);
  };

  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (pendiente.current) void persistir(pendiente.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Aplica una mutación a la herida activa (creándola si no hay ninguna).
  const conActiva = (mut: (h: RelacionHuellaNudo) => RelacionHuellaNudo) => {
    let id = activaId;
    let base = heridas;
    if (!id || !base.some((h) => h.id === id)) {
      const nueva = heridaVacia(); base = [...base, nueva]; id = nueva.id; setActivaId(id);
    }
    commit(base.map((h) => (h.id === id ? mut(h) : h)));
  };

  const toggleHuella = (t: string) =>
    conActiva((h) => ({ ...h, huellas: h.huellas.includes(t) ? h.huellas.filter((x) => x !== t) : [...h.huellas, t] }));
  const toggleNudo = (t: string) =>
    conActiva((h) => ({ ...h, nudos: h.nudos.includes(t) ? h.nudos.filter((x) => x !== t) : [...h.nudos, t] }));
  const addHuella = (t: string) => conActiva((h) => (h.huellas.includes(t) ? h : { ...h, huellas: [...h.huellas, t] }));
  const addNudo = (t: string) => conActiva((h) => (h.nudos.includes(t) ? h : { ...h, nudos: [...h.nudos, t] }));

  const updateBox = (id: string, partial: Partial<RelacionHuellaNudo>) =>
    commit(heridas.map((h) => (h.id === id ? { ...h, ...partial } : h)));
  const removeHuella = (id: string, t: string) =>
    commit(heridas.map((h) => (h.id === id ? { ...h, huellas: h.huellas.filter((x) => x !== t) } : h)));
  const removeNudo = (id: string, t: string) =>
    commit(heridas.map((h) => (h.id === id ? { ...h, nudos: h.nudos.filter((x) => x !== t) } : h)));
  const borrarHerida = (id: string) => {
    const next = heridas.filter((h) => h.id !== id);
    commit(next);
    if (activaId === id) setActivaId(next.length ? next[next.length - 1].id : null);
  };
  const añadirHerida = () => {
    const nueva = heridaVacia();
    commit([...heridas, nueva]);
    setActivaId(nueva.id);
  };


  const soltarEnMesa = () => {
    const a = arrastreRef.current;
    arrastreRef.current = null;
    setSobreMesa(false);
    if (a?.tipo === "huella") addHuella(a.texto);
    else if (a?.tipo === "nudo") addNudo(a.texto);
  };

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  if (!exp) return null;

  const activa = heridas.find((h) => h.id === activaId) || null;
  const colorActiva = activa ? colorHerida(activa.id) : TINTA;
  const huellaEnActiva = (t: string) => !!activa?.huellas.includes(t);
  const nudoEnActiva = (t: string) => !!activa?.nudos.includes(t);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box position="relative" flex="1">
        <Flex position="relative" zIndex={1} justify="center" px={{ base: 4, md: 8, lg: 12 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
          <Flex direction="column" align="center" w="100%" maxW="1240px" gap={{ base: 8, md: 10 }}>

            <MetodoStepHeader
              icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
              title="Heridas"
              bgColor={`${neuropsicologiaBg}f0`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              step={{ current: 7, total: 15 }}
              mb={0}
              boxShadow={glowHeader}
              prev={{ label: "← Necesidades", onClick: () => navigate(`/metodo/psicologia/${exp.id}/necesidades`) }}
              next={{ label: "Regulación →", onClick: () => navigate(`/metodo/psicologia/${exp.id}/regulacion`) }}
            />

            {/* Intro: texto sobre el fondo turquesa */}
            <Flex direction="column" align="center" textAlign="center" gap={3} maxW="720px" mx="auto">
              <Text color={PAPEL} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" opacity={0.92} lineHeight="1.7"
                    style={{ textShadow: `0 1px 8px rgba(0,0,0,0.35)` }}>
                Una herida surge cuando una experiencia importante (huella) se une a la creencia que nació de ella (nudo). No es solo lo que viviste, sino lo que aprendiste a creer sobre ti, los demás o el mundo.
              </Text>
              {/* Icono «ⓘ» → abre el popup con los pasos de cómo se hace */}
              <Flex
                as="button"
                onClick={() => setPasosOpen(true)}
                align="center"
                gap={2}
                px={3}
                py={1.5}
                borderRadius="full"
                bg="rgba(255,255,255,0.14)"
                border={`1px solid ${PAPEL}55`}
                cursor="pointer"
                transition="all 0.18s"
                _hover={{ bg: "rgba(255,255,255,0.24)", borderColor: PAPEL, transform: "translateY(-1px)" }}
              >
                <Flex
                  align="center"
                  justify="center"
                  w="20px"
                  h="20px"
                  borderRadius="full"
                  border={`1.5px solid ${PAPEL}`}
                  color={PAPEL}
                  fontSize="13px"
                  fontWeight="700"
                  fontStyle="italic"
                  lineHeight="1"
                  flexShrink={0}
                >
                  i
                </Flex>
                <Text color={PAPEL} fontSize={{ base: "sm", md: "md" }} fontWeight="600" letterSpacing="0.02em"
                      style={{ textShadow: `0 1px 6px rgba(0,0,0,0.35)` }}>
                  ¿Cómo se hace?
                </Text>
              </Flex>
            </Flex>

            {/* ════════ TRES COLUMNAS ════════ */}
            <Flex w="100%" direction={{ base: "column", lg: "row" }} gap={{ base: 8, lg: 6 }} align="stretch">

              {/* ── COLUMNA 1 · HUELLAS ── */}
              <Flex direction="column" flex="1" minW={0}>
                <Box position="relative" h={COL_H} borderRadius="2xl" overflow="hidden"
                     border={azulBorde} boxShadow={glowPanel}>
                  <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                  <Flex position="relative" zIndex={1} direction="column" h="100%">
                    <ColumnaHeaderBox icono={<HuellaIcon size={22} color={TINTA} />} titulo="Tus huellas" apoyo="Tócalas o arrástralas para clasificarlas." />
                    <Box flex="1" overflowY="auto" px={{ base: 4, md: 5 }} pt={{ base: 4, md: 5 }} pb={{ base: 5, md: 6 }} sx={SCROLL_SX}>
                      {huellas.length === 0 ? (
                        <EstadoVacio texto="Aún no has marcado huellas en tu línea de vida." accion="Ir a Huellas →"
                                     onClick={() => navigate(`/metodo/psicologia/${exp.id}/huellas`)} />
                      ) : (
                        <Flex direction="column" gap={2.5}>
                          {huellas.map((t, i) => (
                            <PiezaRect key={`${t}-${i}`} texto={t} activo={huellaEnActiva(t)} colorSel={colorActiva}
                                       icono={<HuellaIcon size={18} color={TINTA} />}
                                       onTap={() => toggleHuella(t)}
                                       onDragStart={() => { arrastreRef.current = { tipo: "huella", texto: t }; }}
                                       onDragEnd={() => { arrastreRef.current = null; }} />
                          ))}
                        </Flex>
                      )}
                    </Box>
                  </Flex>
                </Box>
              </Flex>

              {/* ── COLUMNA 2 · NUDOS (icono a la derecha) ── */}
              <Flex direction="column" flex="1" minW={0}>
                <Box position="relative" h={COL_H} borderRadius="2xl" overflow="hidden"
                     border={azulBorde} boxShadow={glowPanel}>
                  <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                  <Flex position="relative" zIndex={1} direction="column" h="100%">
                    <ColumnaHeaderBox icono={<NudoEspiralIcon size={22} color={TINTA} strokeWidth={1.7} opacity={0.9} />} titulo="Tus nudos" apoyo="La creencia o conflicto que dejó esa experiencia." />
                    <Box flex="1" overflowY="auto" px={{ base: 4, md: 5 }} pt={{ base: 4, md: 5 }} pb={{ base: 5, md: 6 }} sx={SCROLL_SX}>
                      {nudos.length === 0 ? (
                        <EstadoVacio texto="Aún no has nombrado tus nudos." accion="Ir a Nudos →"
                                     onClick={() => navigate(`/metodo/psicologia/${exp.id}/nudos`)} />
                      ) : (
                        <Flex direction="column" gap={2.5}>
                          {nudos.map((t, i) => (
                            <PiezaRect key={`${t}-${i}`} texto={t} activo={nudoEnActiva(t)} colorSel={colorActiva}
                                       icono={<NudoEspiralIcon size={20} color={TINTA} strokeWidth={1.7} opacity={0.9} />}
                                       onTap={() => toggleNudo(t)}
                                       onDragStart={() => { arrastreRef.current = { tipo: "nudo", texto: t }; }}
                                       onDragEnd={() => { arrastreRef.current = null; }} />
                          ))}
                        </Flex>
                      )}
                    </Box>
                  </Flex>
                </Box>
              </Flex>

              {/* ── COLUMNA 3 · HERIDAS ── */}
              <Flex direction="column" flex="1.05" minW={0}>
                <Box position="relative" borderRadius="2xl" overflow="hidden" h={COL_H}
                     border={`1px solid ${sobreMesa ? AZUL : `${AZUL}44`}`}
                     boxShadow={sobreMesa ? `0 0 0 3px ${AZUL}, 0 0 34px ${AZUL}88, 0 0 70px ${AZUL}44` : glowPanel}
                     transition="box-shadow 0.18s, border-color 0.18s"
                     onDragOver={(e: React.DragEvent) => { e.preventDefault(); if (!sobreMesa) setSobreMesa(true); }}
                     onDragLeave={() => setSobreMesa(false)}
                     onDrop={soltarEnMesa}>
                  <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />

                  <Flex position="relative" zIndex={1} direction="column" h="100%">
                    <ColumnaHeaderBox icono={<HeridaIcon size={22} color={TINTA} />} titulo="Tus heridas" apoyo="Cada herida une una experiencia con lo que dejó en ti." />
                    <Box flex="1" overflowY="auto" px={{ base: 3.5, md: 4 }} pt={{ base: 4, md: 5 }} pb={{ base: 4, md: 5 }} sx={SCROLL_SX}>
                      {heridas.length === 0 ? (
                        <Flex direction="column" align="center" justify="center" h="100%" gap={2} textAlign="center" px={4}>
                          <HeridaIcon size={28} color={TINTA} opacity={0.45} />
                          <Text color={TINTA} opacity={0.7} fontStyle="italic" fontSize="sm">
                            Pulsa «Añadir herida» y reúne una huella con su nudo.
                          </Text>
                        </Flex>
                      ) : (
                        heridas.map((h) => (
                          <HeridaBox key={h.id} h={h} activa={h.id === activaId} sobreMesa={sobreMesa && h.id === activaId}
                                     onActivar={() => setActivaId(h.id)}
                                     onTitulo={(v) => updateBox(h.id, { titulo: v })}
                                     onTexto={(v) => updateBox(h.id, { texto: v })}
                                     onQuitarHuella={(t) => removeHuella(h.id, t)}
                                     onQuitarNudo={(t) => removeNudo(h.id, t)}
                                     onBorrar={() => borrarHerida(h.id)} />
                        ))
                      )}
                    </Box>

                    {/* Barra inferior: Añadir herida (sin tapar la imagen) */}
                    <Flex flexShrink={0} align="center" justify="center" gap={3}
                          px={{ base: 3.5, md: 4 }} pt={4} pb={{ base: 3, md: 4 }}>
                      <Box as="button" onClick={añadirHerida} position="relative" overflow="hidden"
                           px={{ base: 5, md: 6 }} py={2.5} borderRadius="full"
                           bg={TINTA} border={`1.5px solid ${TINTA}`} fontFamily="'EB Garamond', serif" fontWeight="700"
                           fontSize={{ base: "sm", md: "md" }} letterSpacing="0.04em" cursor="pointer"
                           boxShadow={`0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a`} transition="all 0.18s"
                           _hover={{ transform: "translateY(-2px)", boxShadow: `0 4px 18px rgba(0,0,0,0.28), 0 0 22px ${TINTA}5a` }}>
                        <Box as="span" position="relative" zIndex={1} color={neuropsicologiaBg}
                             style={{ textShadow: `0 1px 2px rgba(0,0,0,0.3)` }}>+ Añadir herida</Box>
                      </Box>
                      <AutoguardadoIndicador estado={estadoGuardado} color={TINTA} />
                    </Flex>
                  </Flex>
                </Box>
              </Flex>
            </Flex>

          </Flex>
        </Flex>
      </Box>

      {/* Popup «¿Cómo se hace?» — pasos para crear una herida */}
      {pasosOpen && (
        <Box position="fixed" inset={0} zIndex={2300} display="flex" alignItems="center" justifyContent="center"
             px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }} bg="rgba(0,0,0,0.82)"
             sx={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
             onClick={() => setPasosOpen(false)} fontFamily="'EB Garamond', serif" overflowY="auto">
          <Box onClick={(e: React.MouseEvent) => e.stopPropagation()} position="relative" w="100%" maxW="500px" my="auto"
               borderRadius="2xl" overflow="hidden" boxShadow={`0 30px 80px rgba(40,18,4,0.55)`}>
            <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}
                 maxH={{ base: "calc(100vh - 64px)", md: "calc(100vh - 96px)" }} overflowY="auto">
              <Box as="button" onClick={() => setPasosOpen(false)} position="absolute" top={3} right={3} zIndex={2}
                   w="34px" h="34px" borderRadius="full" bg="rgba(255,251,243,0.7)" border={`1px solid ${TINTA}44`}
                   color={TINTA} display="flex" alignItems="center" justifyContent="center" fontSize="md" cursor="pointer"
                   _hover={{ bg: "rgba(255,251,243,0.95)", borderColor: TINTA }}>✕</Box>
              <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" textAlign="center" pr={6}
                    style={{ textShadow: `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}` }}>
                ¿Cómo se hace?
              </Text>
              <Box h="1px" w="55%" maxW="220px" mx="auto" my={5}
                   bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />
              <Flex direction="column" gap={3.5}>
                {[
                  "Crea una nueva herida con «+ Añadir herida».",
                  "Toca (o arrastra) las huellas y los nudos que sientas relacionados: se añaden a la herida activa y se iluminan con su color.",
                  "Ponle un título y describe qué dejó en ti esa experiencia.",
                  "Si creas más heridas, recuerda pulsar la herida antes de añadirle elementos: así sabrás a cuál se están sumando.",
                ].map((paso, i) => (
                  <Flex key={i} align="flex-start" gap={3}>
                    <Flex align="center" justify="center" flexShrink={0} w="26px" h="26px" borderRadius="full"
                          bg={`${TINTA}`} color={PAPEL} fontSize="sm" fontWeight="700" mt="2px">
                      {i + 1}
                    </Flex>
                    <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.6"
                          style={{ textShadow: `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}` }}>
                      {paso}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </Box>
          </Box>
        </Box>
      )}

      <AyudaRecorrido pagina="heridas" />

      <SiteFooter />
    </Box>
  );
}


// ─────────────────────────────────────────────────────────────────────────
// Subcomponentes
// ─────────────────────────────────────────────────────────────────────────

function EstadoVacio({ texto, accion, onClick }: { texto: string; accion: string; onClick: () => void }) {
  return (
    <Flex direction="column" align="center" gap={3} px={4} py={8} w="100%">
      <Text color={PAPEL} fontStyle="italic" textAlign="center" opacity={0.92} fontSize="sm">{texto}</Text>
      <Box as="button" onClick={onClick} px={5} py={2} borderRadius="full" bg={PAPEL} color={TINTA}
           fontWeight="700" fontSize="sm" cursor="pointer">{accion}</Box>
    </Flex>
  );
}

// Pieza (huella o nudo): rectángulo sobrio con icono. Al seleccionar se tiñe
// suavemente con el color (pastel) de la herida activa; el texto sigue marrón.
function PiezaRect({ texto, activo, colorSel, icono, iconoDerecha, onTap, onDragStart, onDragEnd }: {
  texto: string; activo: boolean; colorSel: string; icono: React.ReactNode; iconoDerecha?: boolean;
  onTap: () => void; onDragStart: () => void; onDragEnd: () => void;
}) {
  return (
    <Flex as="button" draggable onDragStart={onDragStart} onDragEnd={onDragEnd} onClick={onTap}
          align="center" gap={3} px={4} py={3} borderRadius="lg" textAlign="left" w="100%"
          bg={activo ? colorSel : `${PAPEL}d9`} color={TINTA}
          border={`1.5px solid ${activo ? `${TINTA}55` : `${TINTA}33`}`}
          boxShadow={activo ? `0 0 14px ${AZUL}55` : "none"}
          cursor="grab" transition="all 0.16s"
          _hover={{ transform: "translateY(-1px)", boxShadow: activo ? `0 0 18px ${AZUL}77` : `0 0 10px ${AZUL}33` }}
          _active={{ cursor: "grabbing" }}>
      {!iconoDerecha && icono}
      <Text flex="1" fontSize={{ base: "sm", md: "md" }} fontWeight="600" lineHeight="1.3">{texto}</Text>
      {iconoDerecha && icono}
    </Flex>
  );
}

// Box de una herida: título arriba, piezas reunidas (medio), descripción. Editable.
function HeridaBox({ h, activa, sobreMesa, onActivar, onTitulo, onTexto, onQuitarHuella, onQuitarNudo, onBorrar }: {
  h: RelacionHuellaNudo; activa: boolean; sobreMesa: boolean;
  onActivar: () => void; onTitulo: (v: string) => void; onTexto: (v: string) => void;
  onQuitarHuella: (t: string) => void; onQuitarNudo: (t: string) => void; onBorrar: () => void;
}) {
  const vacio = h.huellas.length === 0 && h.nudos.length === 0;
  const color = colorHerida(h.id);
  return (
    <Box onClick={onActivar} position="relative" mb={4} borderRadius="xl" overflow="hidden"
         bgGradient={`linear(135deg, ${PAPEL}f2, ${color}66)`}
         boxShadow={activa ? `0 0 0 2px ${color}, 0 0 24px ${AZUL}55` : `0 0 12px ${AZUL}26`}
         opacity={activa ? 1 : 0.85} transition="all 0.16s" cursor="pointer">
      <Box px={{ base: 4, md: 5 }} py={{ base: 3.5, md: 4 }}>

        {/* Título (con el icono de herida en el color de esta herida) */}
        <Flex align="center" gap={2} mb={3}>
          <HeridaIcon size={18} color={color} />
          <Input value={h.titulo} onChange={(e) => onTitulo(e.target.value)} onClick={(e: React.MouseEvent) => e.stopPropagation()}
                 placeholder="Título de la herida…" variant="unstyled" flex="1"
                 color={TINTA} fontFamily="'EB Garamond', serif" fontWeight="700"
                 fontSize={{ base: "md", md: "lg" }} sx={{ caretColor: TINTA }}
                 _placeholder={{ color: `${TINTA}66`, fontStyle: "italic", fontWeight: 600 }} />
          <Box as="button" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onBorrar(); }}
               w="22px" h="22px" borderRadius="full" bg={`${TINTA}14`} color={TINTA} flexShrink={0}
               display="flex" alignItems="center" justifyContent="center" fontSize="11px" cursor="pointer"
               _hover={{ bg: `${TINTA}26` }} title="Borrar herida">✕</Box>
        </Flex>

        {/* Piezas reunidas (en el medio) */}
        <Box borderRadius="lg" border={`1.5px dashed ${sobreMesa ? TINTA : `${TINTA}40`}`}
             bg={sobreMesa ? `${TINTA}10` : `${TINTA}06`} px={3} py={3} mb={3} minH="54px" transition="all 0.16s">
          {vacio ? (
            <Flex align="center" justify="center" h="100%" minH="38px" textAlign="center">
              <Text color={TINTA} opacity={0.6} fontStyle="italic" fontSize="sm">
                {activa ? "Toca o arrastra aquí huellas y nudos." : "Pulsa este box para activarlo."}
              </Text>
            </Flex>
          ) : (
            <Flex wrap="wrap" gap={2}>
              {h.huellas.map((t) => (
                <Chip key={`h-${t}`} tint={color} onRemove={() => onQuitarHuella(t)}
                      icon={<HuellaIcon size={13} color={TINTA} />} label={t} />
              ))}
              {h.nudos.map((t) => (
                <Chip key={`n-${t}`} tint={color} onRemove={() => onQuitarNudo(t)}
                      icon={<NudoEspiralIcon size={13} color={TINTA} strokeWidth={2} />} label={t} />
              ))}
            </Flex>
          )}
        </Box>

        {/* Descripción */}
        <Textarea value={h.texto} onChange={(e) => onTexto(e.target.value)} onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  placeholder="Descripción: ¿qué dejó en ti esa experiencia?"
                  minH="78px" bg="rgba(255,255,255,0.6)" border={`1px solid ${TINTA}3a`} color={TINTA}
                  borderRadius="lg" px={3} py={2} fontFamily="'EB Garamond', serif"
                  fontSize={{ base: "sm", md: "md" }} lineHeight="1.7" sx={{ caretColor: TINTA }}
                  _placeholder={{ color: `${TINTA}66`, fontStyle: "italic" }}
                  _hover={{ borderColor: `${TINTA}55` }}
                  _focus={{ borderColor: `${TINTA}88`, boxShadow: `0 0 0 1px ${TINTA}33`, bg: "rgba(255,255,255,0.78)" }} />
      </Box>
    </Box>
  );
}

function Chip({ icon, label, onRemove, tint }: {
  icon: React.ReactNode; label: string; onRemove: () => void; tint?: string;
}) {
  return (
    <Flex align="center" gap={1.5} pl={2.5} pr={1.5} py={1} borderRadius="full"
          bg={tint || `${TINTA}12`} color={TINTA}
          border={`1px solid ${TINTA}40`} boxShadow="none">
      {icon}
      <Text fontSize="xs" fontWeight="600" lineHeight="1.2">{label}</Text>
      <Box as="button" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onRemove(); }} w="18px" h="18px" borderRadius="full"
           bg={`${TINTA}1a`} display="flex" alignItems="center" justifyContent="center"
           fontSize="10px" cursor="pointer" flexShrink={0} _hover={{ opacity: 0.8 }} title="Quitar">✕</Box>
    </Flex>
  );
}
