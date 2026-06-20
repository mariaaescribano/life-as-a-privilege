import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text, Textarea, Input } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { SpaceBg } from "../../components/metodo/SpaceBg";
import { Glifo } from "../../components/metodo/Glifo";
import { RelacionIcon } from "../../components/metodo/RelacionIcon";
import { HeridaIcon } from "../../components/metodo/HeridaIcon";
import { SaberMasModal } from "../../components/metodo/Planetas/SaberMasModal";
import { CUERPOS, cuerpoByKey, type Cuerpo } from "../../components/metodo/astrologiaData";
import { type CartaData } from "../../components/metodo/Planetas/useCartaPlanetas";
import {
  experienciaById,
  arquetipoKey,
  type LineaDeVidaData,
  type Constelacion,
  type ArquetipoRef,
  type RelacionHuellaNudo,
} from "../../components/metodo/psicologiaRecorrido";
import { arquetipoLabel } from "../../components/metodo/integracionSimbolos";
import {
  API_URL,
  AstrologiaIcon,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt;
const PAPEL = "#fbf4e8";
// Altura máxima común de las tres columnas; el resto se ve con scroll interno.
const COL_H = { base: "440px", md: "520px", lg: "640px" } as const;
const SCROLL_SX = {
  scrollbarWidth: "thin" as const,
  scrollbarColor: `${TINTA}66 transparent`,
  "&::-webkit-scrollbar": { width: "7px" },
  "&::-webkit-scrollbar-thumb": { background: `${TINTA}66`, borderRadius: "8px" },
};

interface ArqPlaneta {
  cuerpoKey: string;
  symbol: string;
  color: string;
  signo: string | null;
  casa: number | null;
}
interface ArqItem extends ArquetipoRef { symbol: string }

type Arrastre =
  | { tipo: "nudo"; nudo: string }
  | { tipo: "arquetipo"; arq: ArqItem }
  | null;

const nuevoId = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `c-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

const relVacia = (): Constelacion => ({ id: nuevoId(), titulo: "", nudos: [], arquetipos: [], texto: "" });

// Etiqueta visible de una herida (reutilizamos el campo `nudos` de la
// constelación para guardar estas etiquetas, que es lo que el usuario relaciona).
const heridaLabel = (h: RelacionHuellaNudo): string => (h.titulo || "").trim() || "Herida sin título";

// Cada box de relación toma un color distinto (misma paleta que las heridas).
const PALETA_RELACION = [
  "#e7c4ad", // melocotón
  "#cfe0d2", // menta suave
  "#d9cde8", // lavanda
  "#e8dcb0", // mantequilla
  "#bfd6e6", // cielo
  "#ecc7cf", // rosa palo
  "#cdd9b8", // pistacho
  "#e3cdbf", // arena rosada
];
function colorRelacion(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return PALETA_RELACION[h % PALETA_RELACION.length];
}

function facetasDe(p: ArqPlaneta): ArqItem[] {
  const out: ArqItem[] = [];
  if (p.signo) out.push({ cuerpoKey: p.cuerpoKey, faceta: "signo", signo: p.signo, casa: null, symbol: p.symbol });
  if (p.casa != null) out.push({ cuerpoKey: p.cuerpoKey, faceta: "casa", signo: null, casa: p.casa, symbol: p.symbol });
  return out;
}

const EyeIcon = ({ color }: { color: string }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="13px" h="13px" fill={color}>
    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
  </Box>
);

// Cabecera DENTRO del box, separada del contenido por una raya horizontal.
// `dark` para la columna con fondo de estrellas (texto claro).
function ColumnaHeaderBox({ icono, titulo, apoyo, dark }: { icono: React.ReactNode; titulo: string; apoyo?: string; dark?: boolean }) {
  const tinta = dark ? PAPEL : TINTA;
  const shadow = dark ? `0 1px 6px rgba(0,0,0,0.5)` : `0 1px 2px ${PAPEL}`;
  return (
    <Box flexShrink={0} px={{ base: 4, md: 5 }} pt={{ base: 4, md: 5 }} pb={3}>
      <Flex direction="column" align="center" gap={1} textAlign="center">
        <Flex align="center" gap={2.5}>
          <Box flexShrink={0} display="flex" alignItems="center" justifyContent="center"
               style={{ filter: `drop-shadow(${shadow})` }}>{icono}</Box>
          <Text color={tinta} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.03em"
                style={{ textShadow: shadow }}>{titulo}</Text>
        </Flex>
        {apoyo && (
          <Text color={tinta} fontSize="xs" fontStyle="italic" opacity={0.85} maxW="300px"
                style={{ textShadow: shadow }}>{apoyo}</Text>
        )}
      </Flex>
      <Box mt={3} h="1px" w="82%" maxW="260px" mx="auto"
           bgGradient={`linear(to-r, transparent, ${tinta}88, transparent)`} />
    </Box>
  );
}

export default function MetodoPsicologiaIntegracion() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  const [, setGuardando] = useState(false);
  const [heridas, setHeridas] = useState<RelacionHuellaNudo[]>([]);
  const [arquetipos, setArquetipos] = useState<ArqPlaneta[]>([]);
  const [relaciones, setRelaciones] = useState<Constelacion[]>([]);
  const [activaId, setActivaId] = useState<string | null>(null);
  const dataRef = useRef<LineaDeVidaData>({});

  const [saberMas, setSaberMas] = useState<{ cuerpo: Cuerpo; signo?: string; casa?: number; facet: "signo" | "casa" } | null>(null);
  const arrastreRef = useRef<Arrastre>(null);
  const [sobreMesa, setSobreMesa] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendiente = useRef<Constelacion[] | null>(null);

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

        const [psiRes, astroRes] = await Promise.allSettled([
          axios.get(`${API_URL}/metodo-psicologia/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/metodo-astrologia/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (psiRes.status === "fulfilled") {
          const d: LineaDeVidaData = psiRes.value.data?.data || {};
          dataRef.current = d;
          setHeridas(Array.isArray(d.heridas) ? d.heridas : []);
          const rels = Array.isArray(d.constelaciones)
            ? d.constelaciones.map((c) => ({ ...c, titulo: c.titulo ?? "" }))
            : [];
          setRelaciones(rels);
          if (rels.length > 0) setActivaId(rels[rels.length - 1].id);
        }

        if (astroRes.status === "fulfilled") {
          const carta: CartaData = astroRes.value.data?.data || {};
          const lista: ArqPlaneta[] = [];
          for (const c of CUERPOS) {
            const v = carta[c.key];
            if (!v) continue;
            const signo = v.signo || null;
            const casa = c.conCasa && v.casa != null ? v.casa : null;
            if (signo || casa != null) lista.push({ cuerpoKey: c.key, symbol: c.symbol, color: c.color, signo, casa });
          }
          setArquetipos(lista);
        }
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
    setGuardando(true);
    try {
      const data = { ...dataRef.current, constelaciones: next };
      await axios.patch(`${API_URL}/metodo-psicologia/${userId}`, { data },
        { headers: { Authorization: `Bearer ${token}` } });
      dataRef.current = data;
    } catch {
      // silencioso
    } finally {
      setGuardando(false);
    }
  };

  // Guarda en estado y agenda persistencia (debounce) para no llamar en cada tecla.
  const commit = (next: Constelacion[]) => {
    setRelaciones(next);
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

  // Aplica una mutación a la relación activa (creándola si no hay ninguna).
  const conActiva = (mut: (c: Constelacion) => Constelacion) => {
    let id = activaId;
    let base = relaciones;
    if (!id || !base.some((c) => c.id === id)) {
      const nueva = relVacia(); base = [...base, nueva]; id = nueva.id; setActivaId(id);
    }
    commit(base.map((c) => (c.id === id ? mut(c) : c)));
  };

  const toggleNudo = (n: string) =>
    conActiva((c) => ({ ...c, nudos: c.nudos.includes(n) ? c.nudos.filter((x) => x !== n) : [...c.nudos, n] }));
  const addNudo = (n: string) =>
    conActiva((c) => (c.nudos.includes(n) ? c : { ...c, nudos: [...c.nudos, n] }));
  const toggleArq = (a: ArqItem) =>
    conActiva((c) => ({
      ...c,
      arquetipos: c.arquetipos.some((x) => arquetipoKey(x) === arquetipoKey(a))
        ? c.arquetipos.filter((x) => arquetipoKey(x) !== arquetipoKey(a))
        : [...c.arquetipos, { cuerpoKey: a.cuerpoKey, faceta: a.faceta, signo: a.signo, casa: a.casa }],
    }));
  const addArq = (a: ArqItem) =>
    conActiva((c) => (c.arquetipos.some((x) => arquetipoKey(x) === arquetipoKey(a))
      ? c
      : { ...c, arquetipos: [...c.arquetipos, { cuerpoKey: a.cuerpoKey, faceta: a.faceta, signo: a.signo, casa: a.casa }] }));

  const updateBox = (id: string, partial: Partial<Constelacion>) =>
    commit(relaciones.map((c) => (c.id === id ? { ...c, ...partial } : c)));
  const removeNudo = (id: string, n: string) =>
    commit(relaciones.map((c) => (c.id === id ? { ...c, nudos: c.nudos.filter((x) => x !== n) } : c)));
  const removeArq = (id: string, a: ArquetipoRef) =>
    commit(relaciones.map((c) => (c.id === id ? { ...c, arquetipos: c.arquetipos.filter((x) => arquetipoKey(x) !== arquetipoKey(a)) } : c)));
  const borrarRelacion = (id: string) => {
    const next = relaciones.filter((c) => c.id !== id);
    commit(next);
    if (activaId === id) setActivaId(next.length ? next[next.length - 1].id : null);
  };
  const añadirRelacion = () => {
    const nueva = relVacia();
    commit([...relaciones, nueva]);
    setActivaId(nueva.id);
  };

  // Guardado inmediato (botón Guardar): cancela el debounce y persiste ya.
  const guardarAhora = () => {
    if (saveTimer.current) { clearTimeout(saveTimer.current); saveTimer.current = null; }
    pendiente.current = null;
    void persistir(relaciones);
  };

  const abrirSaberMas = (a: ArqItem) => {
    const c = cuerpoByKey(a.cuerpoKey);
    if (!c) return;
    if (a.faceta === "signo") setSaberMas({ cuerpo: c, signo: a.signo || undefined, facet: "signo" });
    else setSaberMas({ cuerpo: c, casa: a.casa ?? undefined, facet: "casa" });
  };

  const soltarEnMesa = () => {
    const a = arrastreRef.current;
    arrastreRef.current = null;
    setSobreMesa(false);
    if (a?.tipo === "nudo") addNudo(a.nudo);
    else if (a?.tipo === "arquetipo") addArq(a.arq);
  };

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  if (!exp) return null;

  const irAlMapa = () => navigate(`/metodo/psicologia/${exp.id}/mapa`);
  const activa = relaciones.find((c) => c.id === activaId) || null;
  const nudoEnActiva = (n: string) => !!activa?.nudos.includes(n);
  const arqEnActiva = (a: ArqItem) => !!activa?.arquetipos.some((x) => arquetipoKey(x) === arquetipoKey(a));

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box position="relative" flex="1">
        <Flex position="relative" zIndex={1} justify="center" px={{ base: 4, md: 8, lg: 12 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
          <Flex direction="column" align="center" w="100%" maxW="1240px" gap={{ base: 8, md: 10 }}>

            <MetodoStepHeader
              icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
              title="Relación"
              bgColor={`${neuropsicologiaBg}f0`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              step={{ current: 7, total: 9 }}
              mb={0}
              prev={{ label: "← Heridas", onClick: () => navigate(`/metodo/psicologia/${exp.id}/huellas-nudos`) }}
              next={{ label: "Mapa →", onClick: irAlMapa }}
            />

            {/* ════════ TRES COLUMNAS ════════ */}
            <Flex w="100%" direction={{ base: "column", lg: "row" }} gap={{ base: 8, lg: 6 }} align="stretch">

              {/* ── COLUMNA 1 · HERIDAS ── */}
              <Flex direction="column" flex="1" minW={0}>
                <Box position="relative" h={COL_H} borderRadius="2xl" overflow="hidden"
                     border={`1px solid ${PAPEL}33`} boxShadow={`0 10px 36px rgba(94,45,16,0.22)`}>
                  <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                  <Flex position="relative" zIndex={1} direction="column" h="100%">
                    <ColumnaHeaderBox icono={<HeridaIcon size={22} color={TINTA} />} titulo="Tus heridas" apoyo="Tócalas o arrástralas para relacionarlas." />
                    <Box flex="1" overflowY="auto" px={{ base: 4, md: 5 }} pb={{ base: 5, md: 6 }} sx={SCROLL_SX}>
                      {heridas.length === 0 ? (
                        <EstadoVacio texto="Aún no has creado tus heridas." accion="Ir a Heridas →"
                                     onClick={() => navigate(`/metodo/psicologia/${exp.id}/huellas-nudos`)} />
                      ) : (
                        <Flex direction="column" gap={2.5}>
                          {heridas.map((h) => {
                            const label = heridaLabel(h);
                            return (
                              <HeridaRect key={h.id} texto={label} activo={nudoEnActiva(label)}
                                          onTap={() => toggleNudo(label)}
                                          onDragStart={() => { arrastreRef.current = { tipo: "nudo", nudo: label }; }}
                                          onDragEnd={() => { arrastreRef.current = null; }} />
                            );
                          })}
                        </Flex>
                      )}
                    </Box>
                  </Flex>
                </Box>
              </Flex>

              {/* ── COLUMNA 2 · ARQUETIPOS ── */}
              <Flex direction="column" flex="1" minW={0}>
                <Box position="relative" h={COL_H} borderRadius="2xl" overflow="hidden"
                     border={`1px solid ${PAPEL}26`} boxShadow={`0 10px 36px rgba(0,0,0,0.34)`}>
                  {/* Fondo: imagen de astrología a opacidad completa */}
                  <Box position="absolute" inset="0" zIndex={0} bgImage="url('/img/astrologia/space.jpg')"
                       bgSize="cover" bgPosition="center" />
                  <Flex position="relative" zIndex={1} direction="column" h="100%">
                    <ColumnaHeaderBox dark icono={<AstrologiaIcon size={{ base: "24px", md: "24px" }} />} titulo="Tus arquetipos" apoyo="Toca una carta para relacionarla; el ojo abre su lectura." />
                    <Box flex="1" overflowY="auto" px={{ base: 4, md: 5 }} pb={{ base: 5, md: 6 }}
                         sx={{ ...SCROLL_SX, scrollbarColor: `${PAPEL}55 transparent`,
                               "&::-webkit-scrollbar": { width: "7px" },
                               "&::-webkit-scrollbar-thumb": { background: `${PAPEL}55`, borderRadius: "8px" } }}>
                      {arquetipos.length === 0 ? (
                        <Flex h="100%" align="center">
                          <EstadoVacio texto="Tus arquetipos aparecerán cuando completes tu carta astral."
                                       accion="Ir a Astrología →" onClick={() => navigate("/metodo/astrologia")} />
                        </Flex>
                      ) : (
                        <Flex direction="column" gap={{ base: 4, md: 5 }}>
                          {arquetipos.map((p) => (
                            <Flex key={p.cuerpoKey} gap={{ base: 3, md: 3.5 }}>
                              {facetasDe(p).map((it) => (
                                <MiniCard key={arquetipoKey(it)} item={it} color={p.color} symbol={p.symbol}
                                          activo={arqEnActiva(it)} onTap={() => toggleArq(it)} onLeer={() => abrirSaberMas(it)}
                                          onDragStart={() => { arrastreRef.current = { tipo: "arquetipo", arq: it }; }}
                                          onDragEnd={() => { arrastreRef.current = null; }} />
                              ))}
                            </Flex>
                          ))}
                        </Flex>
                      )}
                    </Box>
                  </Flex>
                </Box>
              </Flex>

              {/* ── COLUMNA 3 · RELACIONES ── */}
              <Flex direction="column" flex="1.05" minW={0}>
                <Box position="relative" borderRadius="2xl" overflow="hidden" h={COL_H}
                     border={`1px solid ${sobreMesa ? PAPEL : `${TINTA}33`}`}
                     boxShadow={sobreMesa ? `0 0 0 3px ${PAPEL}66, 0 14px 44px rgba(94,45,16,0.3)` : `0 14px 44px rgba(94,45,16,0.28)`}
                     transition="box-shadow 0.18s, border-color 0.18s"
                     onDragOver={(e: React.DragEvent) => { e.preventDefault(); if (!sobreMesa) setSobreMesa(true); }}
                     onDragLeave={() => setSobreMesa(false)}
                     onDrop={soltarEnMesa}>
                  <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />

                  <Flex position="relative" zIndex={1} direction="column" h="100%">
                    <ColumnaHeaderBox icono={<RelacionIcon size={22} color={TINTA} opacity={0.9} />} titulo="Tus relaciones" apoyo="Cada relación es un box. Ponle título y escribe lo que tú ves." />
                    <Box flex="1" overflowY="auto" px={{ base: 3.5, md: 4 }} pb={{ base: 4, md: 5 }} sx={SCROLL_SX}>
                      {relaciones.length === 0 ? (
                        <Flex direction="column" align="center" justify="center" h="100%" gap={2} textAlign="center" px={4}>
                          <RelacionIcon size={26} color={TINTA} opacity={0.45} />
                          <Text color={TINTA} opacity={0.7} fontStyle="italic" fontSize="sm">
                            Pulsa «Añadir relación» y empieza a reunir heridas y arquetipos.
                          </Text>
                        </Flex>
                      ) : (
                        relaciones.map((c) => (
                          <RelacionBox key={c.id} c={c} activa={c.id === activaId} sobreMesa={sobreMesa && c.id === activaId}
                                       onActivar={() => setActivaId(c.id)}
                                       onTitulo={(v) => updateBox(c.id, { titulo: v })}
                                       onTexto={(v) => updateBox(c.id, { texto: v })}
                                       onQuitarNudo={(n) => removeNudo(c.id, n)}
                                       onQuitarArq={(a) => removeArq(c.id, a)}
                                       onBorrar={() => borrarRelacion(c.id)} />
                        ))
                      )}
                    </Box>

                    {/* Barra inferior: botón Añadir relación (marrón) sobre la imagen */}
                    <Flex flexShrink={0} align="center" justify="center" gap={3}
                          px={{ base: 3.5, md: 4 }} pt={6} pb={{ base: 3, md: 4 }}>
                      <Box as="button" onClick={añadirRelacion}
                           px={{ base: 5, md: 6 }} py={2.5} borderRadius="full" bg={`${PAPEL}d9`} color={TINTA}
                           border={`1.5px solid ${TINTA}`} fontFamily="'EB Garamond', serif" fontWeight="700"
                           fontSize={{ base: "sm", md: "md" }} letterSpacing="0.04em" cursor="pointer"
                           boxShadow={`0 5px 16px rgba(94,45,16,0.28)`} transition="all 0.18s"
                           _hover={{ transform: "translateY(-2px)", boxShadow: `0 9px 24px rgba(94,45,16,0.4)` }}>
                        + Añadir relación
                      </Box>
                      <Box as="button" onClick={guardarAhora}
                           px={{ base: 6, md: 7 }} py={2.5} borderRadius="full" bg={TINTA} color={PAPEL}
                           border={`1.5px solid ${TINTA}`} fontFamily="'EB Garamond', serif" fontWeight="700"
                           fontSize={{ base: "sm", md: "md" }} letterSpacing="0.04em" cursor="pointer"
                           boxShadow={`0 5px 16px rgba(94,45,16,0.34)`} transition="all 0.18s"
                           _hover={{ transform: "translateY(-2px)", boxShadow: `0 9px 24px rgba(94,45,16,0.46)` }}>
                        Guardar
                      </Box>
                    </Flex>
                  </Flex>
                </Box>
              </Flex>
            </Flex>

          </Flex>
        </Flex>
      </Box>

      <SaberMasModal isOpen={!!saberMas} onClose={() => setSaberMas(null)}
                     cuerpo={saberMas?.cuerpo || null} signo={saberMas?.signo} casa={saberMas?.casa} facet={saberMas?.facet} />

      <AyudaRecorrido pagina="integracion" />

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

// Herida: rectángulo sobrio, icono de herida a la izquierda. Tocar = seleccionar
// (se ilumina). Arrastrable.
function HeridaRect({ texto, activo, onTap, onDragStart, onDragEnd }: {
  texto: string; activo: boolean; onTap: () => void; onDragStart: () => void; onDragEnd: () => void;
}) {
  return (
    <Flex as="button" draggable onDragStart={onDragStart} onDragEnd={onDragEnd} onClick={onTap}
          align="center" gap={3} px={4} py={3} borderRadius="lg" textAlign="left" w="100%"
          bg={TINTA} color={PAPEL}
          border={`1.5px solid ${activo ? PAPEL : `${PAPEL}33`}`}
          boxShadow={activo ? `0 0 0 3px ${PAPEL}66, 0 8px 22px rgba(94,45,16,0.4)` : `0 2px 8px rgba(94,45,16,0.2)`}
          cursor="grab" transition="all 0.16s"
          _hover={{ boxShadow: activo ? `0 0 0 3px ${PAPEL}66, 0 8px 22px rgba(94,45,16,0.45)` : `0 4px 14px rgba(94,45,16,0.3)` }}
          _active={{ cursor: "grabbing" }}>
      <HeridaIcon size={20} color={PAPEL} />
      <Text fontSize={{ base: "sm", md: "md" }} fontWeight="600" lineHeight="1.3">{texto}</Text>
    </Flex>
  );
}

// Tarjeta de UNA faceta del arquetipo (signo o casa). Fondo de estrellas, ojo propio
// (su propio popup), tocar = seleccionar (se ilumina en su color), arrastrable.
function MiniCard({ item, color, symbol, activo, onTap, onLeer, onDragStart, onDragEnd }: {
  item: ArqItem; color: string; symbol: string; activo: boolean;
  onTap: () => void; onLeer: () => void; onDragStart: () => void; onDragEnd: () => void;
}) {
  return (
    <Box position="relative" flex="1" minW={0} borderRadius="14px" overflow="hidden"
         border={`1.5px solid ${activo ? color : `${color}77`}`}
         boxShadow={activo
           ? `0 0 0 2px ${color}, 0 0 30px ${color}aa, 0 0 60px ${color}55, 0 10px 26px rgba(0,0,0,0.5)`
           : `0 0 18px ${color}55, 0 8px 22px rgba(0,0,0,0.45)`}
         transition="box-shadow 0.16s, border-color 0.16s">
      <SpaceBg overlay="rgba(8,13,30,0.62)" />
      {/* Ojo: abre el popup de ESTA faceta */}
      <Box as="button" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onLeer(); }}
           position="absolute" top="6px" right="6px" zIndex={2} w="24px" h="24px" borderRadius="full"
           bg="rgba(0,0,0,0.5)" border={`1px solid ${color}66`} display="flex" alignItems="center" justifyContent="center"
           cursor="pointer" title="Leer" _hover={{ bg: "rgba(0,0,0,0.78)", borderColor: color }}>
        <EyeIcon color={color} />
      </Box>

      <Flex as="button" draggable onDragStart={onDragStart} onDragEnd={onDragEnd} onClick={onTap}
            position="relative" zIndex={1} direction="column" align="center" justify="center" gap={1.5}
            w="100%" px={2} py={4} minH={{ base: "108px", md: "118px" }}
            bg={activo ? `${color}26` : "transparent"} cursor="grab"
            transition="background 0.16s" _hover={{ bg: activo ? `${color}33` : "rgba(255,255,255,0.06)" }}
            _active={{ cursor: "grabbing" }}>
        <Box sx={{ filter: `drop-shadow(0 0 9px ${color}cc)` }}>
          <Glifo symbol={symbol} color={color} size={34} />
        </Box>
        <Text color="#fff" fontWeight="700" fontSize={{ base: "xs", md: "sm" }} textAlign="center" lineHeight="1.2"
              style={{ textShadow: `0 0 10px ${color}aa` }}>
          {arquetipoLabel(item)}
        </Text>
      </Flex>
    </Box>
  );
}

// Box de una relación: título arriba, piezas reunidas, texto. Editable.
function RelacionBox({ c, activa, sobreMesa, onActivar, onTitulo, onTexto, onQuitarNudo, onQuitarArq, onBorrar }: {
  c: Constelacion; activa: boolean; sobreMesa: boolean;
  onActivar: () => void; onTitulo: (v: string) => void; onTexto: (v: string) => void;
  onQuitarNudo: (n: string) => void; onQuitarArq: (a: ArquetipoRef) => void; onBorrar: () => void;
}) {
  const vacio = c.nudos.length === 0 && c.arquetipos.length === 0;
  const color = colorRelacion(c.id);
  return (
    <Box onClick={onActivar} position="relative" mb={4} borderRadius="xl" overflow="hidden"
         bgGradient={`linear(135deg, ${PAPEL}f2, ${color}66)`}
         boxShadow={activa ? `0 0 0 2px ${color}, 0 10px 28px rgba(94,45,16,0.3)` : `0 4px 14px rgba(94,45,16,0.14)`}
         opacity={activa ? 1 : 0.85} transition="all 0.16s" cursor="pointer">
      <Box px={{ base: 4, md: 5 }} py={{ base: 3.5, md: 4 }}>

        {/* Box del título (icono en el color de esta relación) */}
        <Flex align="center" gap={2} mb={3}>
          <RelacionIcon size={18} color={color} />
          <Input value={c.titulo} onChange={(e) => onTitulo(e.target.value)} onClick={(e: React.MouseEvent) => e.stopPropagation()}
                 placeholder="Título de la relación…" variant="unstyled" flex="1"
                 color={TINTA} fontFamily="'EB Garamond', serif" fontWeight="700"
                 fontSize={{ base: "md", md: "lg" }} sx={{ caretColor: TINTA }}
                 _placeholder={{ color: `${TINTA}66`, fontStyle: "italic", fontWeight: 600 }} />
          <Box as="button" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onBorrar(); }}
               w="22px" h="22px" borderRadius="full" bg={`${TINTA}14`} color={TINTA} flexShrink={0}
               display="flex" alignItems="center" justifyContent="center" fontSize="11px" cursor="pointer"
               _hover={{ bg: `${TINTA}26` }} title="Borrar relación">✕</Box>
        </Flex>

        {/* Piezas reunidas */}
        <Box borderRadius="lg" border={`1.5px dashed ${sobreMesa ? TINTA : `${TINTA}40`}`}
             bg={sobreMesa ? `${TINTA}10` : `${TINTA}06`} px={3} py={3} mb={3} minH="54px" transition="all 0.16s">
          {vacio ? (
            <Flex align="center" justify="center" h="100%" minH="38px" textAlign="center">
              <Text color={TINTA} opacity={0.6} fontStyle="italic" fontSize="sm">
                {activa ? "Toca o arrastra aquí heridas y arquetipos." : "Pulsa este box para activarlo."}
              </Text>
            </Flex>
          ) : (
            <Flex wrap="wrap" gap={2}>
              {c.nudos.map((n) => (
                <Chip key={`n-${n}`} fuerte onRemove={() => onQuitarNudo(n)}
                      icon={<HeridaIcon size={13} color={PAPEL} />} label={n} />
              ))}
              {c.arquetipos.map((a) => (
                <Chip key={`a-${arquetipoKey(a)}`} onRemove={() => onQuitarArq(a)}
                      icon={<Glifo symbol={cuerpoByKey(a.cuerpoKey)?.symbol || "✦"} color={TINTA} size={14} />}
                      label={arquetipoLabel(a)} />
              ))}
            </Flex>
          )}
        </Box>

        <Textarea value={c.texto} onChange={(e) => onTexto(e.target.value)} onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  placeholder="¿Qué relación encuentras? Escribe lo que tú ves…"
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

function Chip({ icon, label, onRemove, fuerte }: {
  icon: React.ReactNode; label: string; onRemove: () => void; fuerte?: boolean;
}) {
  return (
    <Flex align="center" gap={1.5} pl={2.5} pr={1.5} py={1} borderRadius="full"
          bg={fuerte ? TINTA : `${TINTA}12`} color={fuerte ? PAPEL : TINTA}
          border={`1px solid ${fuerte ? TINTA : `${TINTA}44`}`} boxShadow={`0 1px 6px rgba(94,45,16,0.14)`}>
      {icon}
      <Text fontSize="xs" fontWeight="600" lineHeight="1.2">{label}</Text>
      <Box as="button" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onRemove(); }} w="18px" h="18px" borderRadius="full"
           bg={fuerte ? `${PAPEL}33` : `${TINTA}1a`} display="flex" alignItems="center" justifyContent="center"
           fontSize="10px" cursor="pointer" flexShrink={0} _hover={{ opacity: 0.8 }} title="Quitar">✕</Box>
    </Flex>
  );
}
