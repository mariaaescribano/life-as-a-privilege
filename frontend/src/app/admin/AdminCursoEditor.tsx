import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Flex, Text, Input, Textarea, Select, Checkbox, useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { useAdminGuard, adminHeaders } from "./useAdminGuard";
import { API_URL } from "../../GlobalVariables";
import { DISCIPLINAS_CURSO, disciplinaCursoBySlug } from "../../data/disciplinasCurso";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../../components/global/DisciplinaBgLayer";
import { Markdown } from "../../components/global/Markdown";
import { CursoTestEditor } from "../../components/aprendizaje/CursoTestEditor";
import type { Ejercicio } from "../../dtos/aprendizaje.type";

interface Leccion { id: string; nom: string; tipo: "texto" | "video" | "test"; contenido?: string; video?: string; ejercicios?: Ejercicio[]; }
interface Modulo { title: string; submodules: Leccion[]; }
interface Curso {
  id: string; modalidad: string; titulo: string; foto: string; descripcion: string;
  descripcion_contenido?: string;
  de_pago: boolean; publicado: boolean; completado: boolean; orden: number; contenido: Modulo[];
}

const genId = () => "l-" + Math.random().toString(36).slice(2, 9);

const fieldStyle = {
  bg: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.25)",
  _placeholder: { color: "rgba(255,255,255,0.45)" },
} as const;

const btn = {
  fontFamily: "'EB Garamond', serif", fontWeight: 700, letterSpacing: "0.05em",
  borderRadius: "full", cursor: "pointer", transition: "all 0.2s",
} as const;

// Botones de subir/bajar para reordenar módulos o lecciones.
function MoveBtns({ onUp, onDown, canUp, canDown }: {
  onUp: () => void; onDown: () => void; canUp: boolean; canDown: boolean;
}) {
  const base = {
    ...btn,
    w: "30px", h: "30px", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "md", border: "1px solid rgba(255,255,255,0.3)", flexShrink: 0,
  } as const;
  return (
    <Flex gap={1.5} flexShrink={0}>
      <Box as="button" {...base} onClick={onUp} aria-label="Subir"
           opacity={canUp ? 1 : 0.3} pointerEvents={canUp ? "auto" : "none"}
           _hover={canUp ? { bg: "rgba(255,255,255,0.12)" } : {}}>↑</Box>
      <Box as="button" {...base} onClick={onDown} aria-label="Bajar"
           opacity={canDown ? 1 : 0.3} pointerEvents={canDown ? "auto" : "none"}
           _hover={canDown ? { bg: "rgba(255,255,255,0.12)" } : {}}>↓</Box>
    </Flex>
  );
}

// Pliega el texto (sin acentos, en minúsculas) conservando un mapa de índices
// al string original, para localizar y seleccionar la frase exacta.
const COMBINING = new RegExp("[\\u0300-\\u036f]", "g");
function fold(s: string): { folded: string; map: number[] } {
  let folded = "";
  const map: number[] = [];
  for (let i = 0; i < s.length; i++) {
    const dec = s[i].normalize("NFD").replace(COMBINING, "").toLowerCase();
    for (let k = 0; k < dec.length; k++) { folded += dec[k]; map.push(i); }
  }
  return { folded, map };
}
function limpiarMd(s: string): string {
  return s.replace(/^#{1,6}\s+/gm, "").replace(/[*_`>]/g, "").replace(/\s+/g, " ").trim();
}

interface ResultadoBusqueda {
  mi: number; li: number; lecId: string; moduloTitle: string; leccionNom: string;
  antes: string; match: string; despues: string;
}

export default function AdminCursoEditor() {
  const { id } = useParams<{ id: string }>();
  const { verificando } = useAdminGuard();
  const navigate = useNavigate();
  const toast = useToast();

  const [curso, setCurso] = useState<Curso | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [previews, setPreviews] = useState<Record<string, boolean>>({});
  const [busqueda, setBusqueda] = useState("");
  const [mostrarRes, setMostrarRes] = useState(false);
  const buscadorRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (verificando || !id) return;
    (async () => {
      try {
        const r = await axios.get(`${API_URL}/cursos/${id}`, { headers: adminHeaders() });
        const c = r.data;
        setCurso({ ...c, contenido: Array.isArray(c.contenido) ? c.contenido : [] });
      } catch {
        toast({ title: "No se pudo cargar el curso", status: "error", duration: 3000 });
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line
  }, [verificando, id]);

  const set = (patch: Partial<Curso>) => setCurso((c) => (c ? { ...c, ...patch } : c));

  // ── Módulos ──
  const setModulos = (modulos: Modulo[]) => set({ contenido: modulos });
  const addModulo = () => curso && setModulos([...curso.contenido, { title: "Nuevo módulo", submodules: [] }]);
  const updModulo = (mi: number, patch: Partial<Modulo>) =>
    curso && setModulos(curso.contenido.map((m, i) => (i === mi ? { ...m, ...patch } : m)));
  const delModulo = (mi: number) => curso && setModulos(curso.contenido.filter((_, i) => i !== mi));
  const moveModulo = (mi: number, dir: -1 | 1) => {
    if (!curso) return;
    const j = mi + dir;
    if (j < 0 || j >= curso.contenido.length) return;
    const arr = [...curso.contenido];
    [arr[mi], arr[j]] = [arr[j], arr[mi]];
    setModulos(arr);
  };
  // Inserta un módulo nuevo justo después del índice indicado.
  const insertModulo = (mi: number) => {
    if (!curso) return;
    const arr = [...curso.contenido];
    arr.splice(mi + 1, 0, { title: "Nuevo módulo", submodules: [] });
    setModulos(arr);
  };

  // ── Lecciones ──
  const addLeccion = (mi: number) =>
    curso && updModulo(mi, {
      submodules: [...curso.contenido[mi].submodules, { id: genId(), nom: "Nueva lección", tipo: "texto", contenido: "" }],
    });
  const updLeccion = (mi: number, li: number, patch: Partial<Leccion>) =>
    curso && updModulo(mi, {
      submodules: curso.contenido[mi].submodules.map((s, i) => (i === li ? { ...s, ...patch } : s)),
    });
  const delLeccion = (mi: number, li: number) =>
    curso && updModulo(mi, { submodules: curso.contenido[mi].submodules.filter((_, i) => i !== li) });
  const moveLeccion = (mi: number, li: number, dir: -1 | 1) => {
    if (!curso) return;
    const subs = curso.contenido[mi].submodules;
    const j = li + dir;
    if (j < 0 || j >= subs.length) return;
    const arr = [...subs];
    [arr[li], arr[j]] = [arr[j], arr[li]];
    updModulo(mi, { submodules: arr });
  };
  // Inserta una lección nueva justo después del índice indicado.
  const insertLeccion = (mi: number, li: number) => {
    if (!curso) return;
    const arr = [...curso.contenido[mi].submodules];
    arr.splice(li + 1, 0, { id: genId(), nom: "Nueva lección", tipo: "texto", contenido: "" });
    updModulo(mi, { submodules: arr });
  };

  // ── Buscador interno del editor ──
  const resultados: ResultadoBusqueda[] = useMemo(() => {
    const query = busqueda.trim();
    if (!curso || query.length < 2) return [];
    const foldedQ = fold(query).folded;
    const out: ResultadoBusqueda[] = [];
    curso.contenido.forEach((mod, mi) => {
      mod.submodules.forEach((lec, li) => {
        const texto = lec.contenido ?? "";
        const objetivo = texto || lec.nom;
        const { folded, map } = fold(objetivo);
        const idx = folded.indexOf(foldedQ);
        if (idx === -1) {
          if (fold(lec.nom).folded.includes(foldedQ) && texto) {
            out.push({ mi, li, lecId: lec.id, moduloTitle: mod.title, leccionNom: lec.nom, antes: "", match: lec.nom, despues: "" });
          }
          return;
        }
        const start = map[idx];
        const end = map[idx + foldedQ.length - 1] + 1;
        out.push({
          mi, li, lecId: lec.id, moduloTitle: mod.title, leccionNom: lec.nom,
          antes: limpiarMd(objetivo.slice(Math.max(0, start - 50), start)),
          match: objetivo.slice(start, end),
          despues: limpiarMd(objetivo.slice(end, end + 80)),
        });
      });
    });
    return out.slice(0, 40);
  }, [busqueda, curso]);

  // Salta a la lección: la desplaza al centro, la resalta y selecciona la frase.
  const saltarA = (r: ResultadoBusqueda) => {
    if (!curso) return;
    const lec = curso.contenido[r.mi]?.submodules[r.li];
    if (!lec) return;
    setPreviews((p) => ({ ...p, [lec.id]: false })); // asegura que se ve el textarea
    setMostrarRes(false);
    const query = busqueda.trim();
    window.setTimeout(() => {
      const el = document.getElementById(`lec-${lec.id}`);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.animate(
        [
          { boxShadow: "0 0 0 0 rgba(255,245,150,0)" },
          { boxShadow: "0 0 0 3px rgba(255,245,150,0.95)", offset: 0.2 },
          { boxShadow: "0 0 0 3px rgba(255,245,150,0.95)", offset: 0.75 },
          { boxShadow: "0 0 0 0 rgba(255,245,150,0)" },
        ],
        { duration: 2600, easing: "ease-in-out" },
      );
      const ta = el.querySelector("textarea") as HTMLTextAreaElement | null;
      const texto = lec.contenido ?? "";
      if (ta && texto && query) {
        const { folded, map } = fold(texto);
        const idx = folded.indexOf(fold(query).folded);
        if (idx >= 0) {
          const start = map[idx];
          const end = map[idx + fold(query).folded.length - 1] + 1;
          ta.focus();
          ta.setSelectionRange(start, end);
        }
      }
    }, 130);
  };

  const guardar = async () => {
    if (!curso) return;
    setGuardando(true);
    try {
      await axios.patch(`${API_URL}/cursos/${curso.id}`, {
        modalidad: curso.modalidad, titulo: curso.titulo, foto: curso.foto, descripcion: curso.descripcion,
        descripcion_contenido: curso.descripcion_contenido,
        de_pago: curso.de_pago, publicado: curso.publicado, completado: curso.completado, orden: curso.orden, contenido: curso.contenido,
      }, { headers: adminHeaders() });
      toast({ title: "Guardado", status: "success", duration: 2000 });
    } catch {
      toast({ title: "No se pudo guardar", status: "error", duration: 3000 });
    } finally {
      setGuardando(false);
    }
  };

  if (verificando || loading) return <LifeLoading variant="private" />;
  if (!curso) {
    return (
      <Box minH="100vh" bg="#008080" display="flex" flexDirection="column" fontFamily="'EB Garamond', serif">
        <SiteHeader variant="private" />
        <Box flex="1" display="flex" alignItems="center" justifyContent="center">
          <Text color="white" fontStyle="italic">Curso no encontrado.</Text>
        </Box>
      </Box>
    );
  }

  // Fondo de la disciplina del curso (para los boxes del editor).
  const disc = disciplinaCursoBySlug(curso.modalidad);
  const discNom = disc?.nom ?? "";
  const color = disc?.color ?? "#ffffff";
  const bg = disc?.bg ?? "#003535";
  const hasBg = hasDisciplinaBg(discNom);
  // Glow brillante (blanco/aguamarina + color), como el resto de la app — sin negro.
  const GLOW = `0 0 18px rgba(255,255,255,0.22), 0 0 45px rgba(255,255,255,0.1), 0 0 78px rgba(180,255,245,0.14), 0 0 28px ${color}40`;
  // Sombra/brillo del texto con el color de fondo de la disciplina.
  const TEXT_SHADOW = `0 1px 4px ${bg}, 0 0 10px ${bg}, 0 0 22px ${bg}`;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif" color="white">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }} sx={{ zoom: 1.15 }}>
        <Box w="100%" maxW="820px">
          {/* Barra superior */}
          <Flex justify="space-between" align="center" mb={6} gap={3} flexWrap="wrap">
            <Box as="button" onClick={() => navigate("/admin/cursos")} {...btn} px={4} py="7px"
                 border="1px solid rgba(255,255,255,0.35)" fontSize="sm">← Cursos</Box>
            <Flex gap={3} align="center">
              <Box as="button" onClick={() => window.open(`/aprendizaje/modulosPage/${curso.modalidad}/${curso.id}`, "_blank")}
                   {...btn} px={4} py="7px" border="1px solid rgba(255,255,255,0.35)" fontSize="sm">Ver curso ↗</Box>
              <Box as="button" onClick={guardar} {...btn} px={6} py="9px" bg="white" color="#008080"
                   boxShadow="0 0 16px rgba(255,255,255,0.4)" opacity={guardando ? 0.6 : 1} pointerEvents={guardando ? "none" : "auto"}>
                {guardando ? "Guardando…" : "Guardar"}
              </Box>
            </Flex>
          </Flex>

          {/* ── Datos del curso ── */}
          <Box position="relative" overflow="hidden" bg="#05403f" borderRadius="xl" p={{ base: 5, md: 6 }} mb={6} boxShadow={GLOW} color={color} sx={{ textShadow: TEXT_SHADOW }}>
            {hasBg && <DisciplinaBgLayer nom={discNom} borderRadius="xl" />}
            <Box position="relative" zIndex={1}>
            <Text fontSize="lg" fontWeight="700" mb={4} letterSpacing="0.04em">Datos del curso</Text>
            <Flex direction="column" gap={4}>
              <Flex gap={4} direction={{ base: "column", md: "row" }}>
                <Box flex="1">
                  <Text fontSize="sm" mb={1} opacity={0.8}>Disciplina</Text>
                  <Select value={curso.modalidad} onChange={(e) => set({ modalidad: e.target.value })} {...fieldStyle} sx={{ option: { color: "black" } }}>
                    {DISCIPLINAS_CURSO.map((d) => <option key={d.slug} value={d.slug}>{d.nom}</option>)}
                  </Select>
                </Box>
                <Box flex="1">
                  <Text fontSize="sm" mb={1} opacity={0.8}>Título</Text>
                  <Input value={curso.titulo} onChange={(e) => set({ titulo: e.target.value })} {...fieldStyle} />
                </Box>
              </Flex>
              <Box>
                <Text fontSize="sm" mb={1} opacity={0.8}>Foto (ruta o URL)</Text>
                <Input value={curso.foto} onChange={(e) => set({ foto: e.target.value })} placeholder="/img/astrologia/space.jpg" {...fieldStyle} />
              </Box>
              <Box>
                <Text fontSize="sm" mb={1} opacity={0.8}>Descripción</Text>
                <Textarea value={curso.descripcion} onChange={(e) => set({ descripcion: e.target.value })} rows={2} {...fieldStyle} />
              </Box>
              <Box>
                <Text fontSize="sm" mb={1} opacity={0.8}>Frase bajo «Contenido del curso»</Text>
                <Textarea value={curso.descripcion_contenido ?? ""} onChange={(e) => set({ descripcion_contenido: e.target.value })} rows={2}
                          placeholder="Si lo dejas vacío, se usa la descripción de arriba." {...fieldStyle} />
              </Box>
              <Flex gap={6} align="center" flexWrap="wrap">
                <Checkbox isChecked={curso.de_pago} onChange={(e) => set({ de_pago: e.target.checked })}>De pago (5 €)</Checkbox>
                <Checkbox isChecked={curso.publicado} onChange={(e) => set({ publicado: e.target.checked })}>Publicado</Checkbox>
                <Checkbox isChecked={curso.completado} onChange={(e) => set({ completado: e.target.checked })}>Completado</Checkbox>
                <Flex align="center" gap={2}>
                  <Text fontSize="sm" opacity={0.8}>Orden</Text>
                  <Input type="number" value={curso.orden} onChange={(e) => set({ orden: Number(e.target.value) })} w="80px" {...fieldStyle} />
                </Flex>
              </Flex>
            </Flex>
            </Box>
          </Box>

          {/* ── Módulos y lecciones ── */}
          <Flex justify="space-between" align="center" mb={3}>
            <Text fontSize="lg" fontWeight="700" letterSpacing="0.04em">Contenido</Text>
            <Box as="button" onClick={addModulo} {...btn} px={5} py="8px" bg="rgba(255,255,255,0.92)" color="#008080" fontSize="sm">+ Módulo</Box>
          </Flex>

          {/* Buscador interno: encuentra una frase en cualquier lección y salta a ella */}
          <Box ref={buscadorRef} position="relative" mb={5} zIndex={5}
               onBlur={(e) => { if (!buscadorRef.current?.contains(e.relatedTarget as Node)) setMostrarRes(false); }}>
            <Input
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setMostrarRes(true); }}
              onFocus={() => setMostrarRes(true)}
              placeholder="🔍 Buscar una frase en el curso y saltar a ella…"
              {...fieldStyle}
            />
            {mostrarRes && busqueda.trim().length >= 2 && (
              <Box position="absolute" top="calc(100% + 6px)" left={0} right={0} bg="#05403f"
                   borderRadius="lg" border="1px solid rgba(255,255,255,0.25)"
                   boxShadow="0 12px 40px rgba(0,0,0,0.45)" maxH="360px" overflowY="auto" zIndex={20}>
                {resultados.length === 0 ? (
                  <Text opacity={0.7} fontStyle="italic" px={4} py={3}>Sin resultados para «{busqueda.trim()}».</Text>
                ) : (
                  resultados.map((r, i) => (
                    <Box key={r.lecId + "-" + i} as="button" onClick={() => saltarA(r)} display="block" textAlign="left" w="100%"
                         px={4} py={3} borderTop={i === 0 ? undefined : "1px solid rgba(255,255,255,0.1)"}
                         transition="background 0.15s" _hover={{ bg: "rgba(255,255,255,0.1)" }}>
                      <Text fontSize="xs" opacity={0.65} mb={0.5}>
                        Módulo {r.mi + 1} · {r.moduloTitle} → <Box as="span" fontWeight="700">{r.leccionNom}</Box>
                      </Text>
                      <Text fontSize="sm" lineHeight="1.5" noOfLines={2}>
                        {r.antes && <Box as="span" opacity={0.7}>…{r.antes} </Box>}
                        <Box as="span" fontWeight="700" bg="rgba(255,245,150,0.35)" px="2px" borderRadius="2px">{r.match}</Box>
                        {r.despues && <Box as="span" opacity={0.7}> {r.despues}…</Box>}
                      </Text>
                    </Box>
                  ))
                )}
              </Box>
            )}
          </Box>

          {curso.contenido.length === 0 && (
            <Text opacity={0.7} fontStyle="italic" mb={4}>Sin módulos todavía. Añade el primero.</Text>
          )}

          <Flex direction="column" gap={5}>
            {curso.contenido.map((mod, mi) => (
              <Box key={mi} position="relative" overflow="hidden" bg="#05403f" borderRadius="xl" p={{ base: 4, md: 5 }} boxShadow={GLOW} color={color} sx={{ textShadow: TEXT_SHADOW }}>
                {hasBg && <DisciplinaBgLayer nom={discNom} borderRadius="xl" />}
                <Box position="relative" zIndex={1}>
                <Flex gap={3} align="center" mb={4} flexWrap="wrap">
                  <Box fontWeight="700" fontSize="sm" opacity={0.7} flexShrink={0}>Módulo {mi + 1}</Box>
                  <Input value={mod.title} onChange={(e) => updModulo(mi, { title: e.target.value })}
                         fontWeight="700" fontSize={{ base: "md", md: "lg" }} flex="1" minW="160px" {...fieldStyle} />
                  <MoveBtns
                    onUp={() => moveModulo(mi, -1)} onDown={() => moveModulo(mi, 1)}
                    canUp={mi > 0} canDown={mi < curso.contenido.length - 1}
                  />
                  <Box as="button" onClick={() => insertModulo(mi)} {...btn} px={3} py="6px" fontSize="xs"
                       border="1px solid rgba(255,255,255,0.3)" _hover={{ bg: "rgba(255,255,255,0.12)" }} flexShrink={0} title="Insertar módulo debajo">
                    + aquí
                  </Box>
                  <Box as="button" onClick={() => delModulo(mi)} {...btn} px={3} py="6px" fontSize="xs"
                       border="1px solid rgba(255,255,255,0.3)" _hover={{ borderColor: "#ff8a8a", color: "#ff8a8a" }} flexShrink={0}>
                    Borrar módulo
                  </Box>
                </Flex>

                <Flex direction="column" gap={4} pl={{ base: 0, md: 3 }}>
                  {mod.submodules.map((lec, li) => {
                    const key = lec.id;
                    const previewOn = previews[key];
                    return (
                      <Box key={lec.id} id={`lec-${lec.id}`} bg="rgba(0,0,0,0.2)" border="1px solid rgba(255,255,255,0.12)" borderRadius="lg" p={4}>
                        <Flex gap={3} align="center" mb={3} flexWrap="wrap">
                          <Box fontSize="xs" opacity={0.6} flexShrink={0}>{mi + 1}.{li + 1}</Box>
                          <Input value={lec.nom} onChange={(e) => updLeccion(mi, li, { nom: e.target.value })}
                                 placeholder="Nombre de la lección" flex="1" minW="160px" {...fieldStyle} />
                          <Select value={lec.tipo} onChange={(e) => updLeccion(mi, li, { tipo: e.target.value as "texto" | "video" | "test" })}
                                  w="130px" {...fieldStyle} sx={{ option: { color: "black" } }}>
                            <option value="texto">Texto</option>
                            <option value="video">Vídeo</option>
                            <option value="test">Test</option>
                          </Select>
                          <MoveBtns
                            onUp={() => moveLeccion(mi, li, -1)} onDown={() => moveLeccion(mi, li, 1)}
                            canUp={li > 0} canDown={li < mod.submodules.length - 1}
                          />
                          <Box as="button" onClick={() => insertLeccion(mi, li)} {...btn} px={3} py="6px" fontSize="xs"
                               border="1px solid rgba(255,255,255,0.3)" _hover={{ bg: "rgba(255,255,255,0.12)" }} title="Insertar lección debajo">
                            + aquí
                          </Box>
                          <Box as="button" onClick={() => delLeccion(mi, li)} {...btn} px={3} py="6px" fontSize="xs"
                               border="1px solid rgba(255,255,255,0.3)" _hover={{ borderColor: "#ff8a8a", color: "#ff8a8a" }}>
                            ✕
                          </Box>
                        </Flex>

                        {lec.tipo === "video" ? (
                          <Box>
                            <Text fontSize="xs" mb={1} opacity={0.7}>ID de YouTube (lo que va después de v=)</Text>
                            <Input value={lec.video ?? ""} onChange={(e) => updLeccion(mi, li, { video: e.target.value })}
                                   placeholder="dQw4w9WgXcQ" {...fieldStyle} />
                          </Box>
                        ) : lec.tipo === "test" ? (
                          <CursoTestEditor
                            ejercicios={lec.ejercicios ?? []}
                            onChange={(ej) => updLeccion(mi, li, { ejercicios: ej })}
                          />
                        ) : (
                          <Box>
                            <Flex justify="space-between" align="center" mb={1}>
                              <Text fontSize="xs" opacity={0.7}>Contenido (Markdown)</Text>
                              <Box as="button" onClick={() => setPreviews((p) => ({ ...p, [key]: !p[key] }))}
                                   fontSize="xs" textDecoration="underline" cursor="pointer" opacity={0.85}>
                                {previewOn ? "Editar" : "Vista previa"}
                              </Box>
                            </Flex>
                            <Text color={color} fontSize="xs" mb={2} opacity={0.9} style={{ textShadow: TEXT_SHADOW }}>
                              Negrita: <Box as="span" fontWeight="700">**texto**</Box> · Cursiva: <Box as="span" fontStyle="italic">*texto*</Box> o <Box as="span" fontStyle="italic">_texto_</Box> · Raya de separación: <Box as="span" fontFamily="monospace">---</Box> (en una línea aparte) · Imagen: <Box as="span" fontFamily="monospace">![](/img/cursos/mi-foto.jpg)</Box> (el archivo va en <Box as="span" fontFamily="monospace">frontend/public/</Box>)
                            </Text>
                            {previewOn ? (
                              <Box bg="rgba(0,0,0,0.25)" borderRadius="md" p={4} minH="120px">
                                <Markdown text={lec.contenido ?? ""} color="white" />
                              </Box>
                            ) : (
                              <Textarea value={lec.contenido ?? ""} onChange={(e) => updLeccion(mi, li, { contenido: e.target.value })}
                                        rows={8} fontFamily="monospace" fontSize="sm"
                                        placeholder={"# Título\n\nTexto en **Markdown**…"} {...fieldStyle} />
                            )}
                          </Box>
                        )}
                      </Box>
                    );
                  })}

                  <Box as="button" onClick={() => addLeccion(mi)} {...btn} alignSelf="flex-start" px={4} py="7px" fontSize="sm"
                       border="1px dashed rgba(255,255,255,0.4)" _hover={{ bg: "rgba(255,255,255,0.08)" }}>
                    + Lección
                  </Box>
                </Flex>
                </Box>
              </Box>
            ))}
          </Flex>

          {/* Guardar abajo también */}
          <Flex justify="flex-end" mt={8}>
            <Box as="button" onClick={guardar} {...btn} px={8} py="11px" bg="white" color="#008080"
                 boxShadow="0 0 16px rgba(255,255,255,0.4)" fontSize="lg"
                 opacity={guardando ? 0.6 : 1} pointerEvents={guardando ? "none" : "auto"}>
              {guardando ? "Guardando…" : "Guardar"}
            </Box>
          </Flex>
        </Box>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
