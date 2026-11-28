import React, { useEffect, useState } from "react";
import {
  Box, Flex, Text, Badge, Input, Textarea, Select, Checkbox,
  Modal, ModalOverlay, ModalContent, ModalCloseButton,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { LifeLoader } from "../../components/metodo/comicLoaders";
import { useAdminGuard, adminHeaders } from "./useAdminGuard";
import { API_URL, FONDO_PAGINA_TURQUESA as T } from "../../GlobalVariables";
import { DISCIPLINAS_CURSO, disciplinaCursoBySlug } from "../../data/disciplinasCurso";
import { MandalaTurquesa } from "./PildorasAdmin";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../../components/global/DisciplinaBgLayer";

interface CursoRow {
  id: string; modalidad: string; titulo: string; foto: string; descripcion: string;
  de_pago: boolean; publicado: boolean; completado: boolean; orden: number;
  contenido: { title: string; submodules: any[] }[];
  /** Check personal del admin: si ya lo has revisado. */
  revisado?: boolean;
}

const nLecciones = (c: CursoRow) => (c.contenido ?? []).reduce((a, m) => a + (m.submodules?.length ?? 0), 0);

// Convierte los ejercicios de una lección 'test' en texto legible.
function testATexto(ejs: any[]): string {
  return (ejs ?? []).map((e, i) => {
    const cab = `${i + 1}. ${e.enunciado ?? ""}`.trim();
    if (e.tipo === "opcion") {
      const ops = (e.opciones ?? []).map((o: string, k: number) =>
        `   ${String.fromCharCode(97 + k)}) ${o}${k === e.correcta ? "  ✓" : ""}`).join("\n");
      return `${cab}\n${ops}`;
    }
    if (e.tipo === "verdadero") return `${cab}\n   (Respuesta: ${e.correcta ? "Verdadero" : "Falso"})`;
    if (e.tipo === "relacionar") {
      const pares = (e.pares ?? []).map((p: any) => `   ${p.izquierda} ↔ ${p.derecha}`).join("\n");
      return `${cab}\n${pares}`;
    }
    return cab;
  }).join("\n\n");
}

// Vuelca TODO el texto del curso (título, módulos y todas las lecciones) a un string.
function cursoATexto(c: CursoRow): string {
  const p: string[] = [];
  p.push((c.titulo || "(sin título)").toUpperCase());
  if (c.descripcion?.trim()) p.push(c.descripcion.trim());
  (c.contenido ?? []).forEach((mod, mi) => {
    p.push("\n" + "═".repeat(44));
    p.push(`MÓDULO ${mi + 1}: ${mod.title ?? ""}`.trim());
    p.push("═".repeat(44));
    (mod.submodules ?? []).forEach((lec: any, li: number) => {
      p.push(`\n— ${mi + 1}.${li + 1}  ${lec.nom ?? ""} —`.trim());
      if (lec.tipo === "video") {
        p.push(lec.video ? `[Vídeo de YouTube: ${lec.video}]` : "[Vídeo]");
      } else if (lec.tipo === "test") {
        p.push(testATexto(lec.ejercicios ?? []));
      } else {
        p.push((lec.contenido ?? "").trim());
      }
    });
  });
  return p.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

async function copiarAlPortapapeles(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = texto;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

// Foco de teclado sobre el beige (el focoBlanco no se ve).
const focoT = { outline: "2px solid #3B2418cc", outlineOffset: "2px" } as const;
// Campos de los popups.
const campoSx = {
  bg: "#F7EBD9", border: "1.5px solid #3B241866", color: T, borderRadius: "lg",
  _placeholder: { color: "#3B24188c" }, _hover: { borderColor: "#3B2418aa" },
  _focus: { borderColor: T, boxShadow: "none" }, _focusVisible: { borderColor: T, boxShadow: "none" },
} as const;
// Botón secundario (contorno) y principal (relleno), en turquesa oscuro.
const btnSec = { color: T, bg: "transparent", border: `1.5px solid ${T}`, _hover: { bg: "#3B241814" }, _focusVisible: focoT } as const;
const btnPri = { color: "#F0DCC0", bg: T, border: `1.5px solid ${T}`, _hover: { bg: "#5a3624" }, _focusVisible: focoT } as const;

const btnStyle = {
  fontFamily: "'EB Garamond', serif", fontWeight: 700, letterSpacing: "0.06em",
  borderRadius: "full", cursor: "pointer", transition: "all 0.2s",
} as const;

export default function AdminCursos() {
  const { verificando } = useAdminGuard();
  const navigate = useNavigate();
  const toast = useToast();
  const [cursos, setCursos] = useState<CursoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [crearOpen, setCrearOpen] = useState(false);
  const [aBorrar, setABorrar] = useState<CursoRow | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState({
    modalidad: DISCIPLINAS_CURSO[0].slug,
    titulo: "", foto: "", descripcion: "", de_pago: false, publicado: true,
  });

  const cargar = async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API_URL}/cursos/admin/todos`, { headers: adminHeaders() });
      setCursos(r.data ?? []);
    } catch {
      toast({ title: "No se pudieron cargar los cursos", status: "error", duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (!verificando) cargar(); /* eslint-disable-next-line */ }, [verificando]);

  const crear = async () => {
    if (!form.titulo.trim()) {
      toast({ title: "Ponle un título al curso", status: "warning", duration: 2500 });
      return;
    }
    setGuardando(true);
    try {
      const r = await axios.post(`${API_URL}/cursos`, { ...form, contenido: [] }, { headers: adminHeaders() });
      setCrearOpen(false);
      setForm({ modalidad: DISCIPLINAS_CURSO[0].slug, titulo: "", foto: "", descripcion: "", de_pago: false, publicado: true });
      navigate(`/admin/cursos/${r.data.id}`);
    } catch {
      toast({ title: "No se pudo crear el curso", status: "error", duration: 3000 });
    } finally {
      setGuardando(false);
    }
  };

  const borrar = async (c: CursoRow) => {
    try {
      await axios.delete(`${API_URL}/cursos/${c.id}`, { headers: adminHeaders() });
      setCursos((prev) => prev.filter((x) => x.id !== c.id));
      toast({ title: "Curso borrado", status: "success", duration: 2000 });
    } catch {
      toast({ title: "No se pudo borrar", status: "error", duration: 3000 });
    } finally {
      setABorrar(null);
    }
  };

  const copiarCurso = async (c: CursoRow) => {
    const texto = cursoATexto(c);
    const ok = await copiarAlPortapapeles(texto);
    toast({
      title: ok ? "Texto copiado al portapapeles" : "No se pudo copiar",
      description: ok ? `${nLecciones(c)} lecciones · ${texto.length} caracteres` : undefined,
      status: ok ? "success" : "error",
      duration: 2500,
    });
  };

  const toggleCompletado = async (c: CursoRow) => {
    try {
      await axios.patch(`${API_URL}/cursos/${c.id}`, { completado: !c.completado }, { headers: adminHeaders() });
      setCursos((prev) => prev.map((x) => (x.id === c.id ? { ...x, completado: !c.completado } : x)));
    } catch {
      toast({ title: "No se pudo actualizar", status: "error", duration: 3000 });
    }
  };

  // Check personal del admin: marcar/desmarcar un curso como revisado.
  // Optimista: pinta el cambio al instante y lo revierte si el guardado falla.
  const toggleRevisado = async (c: CursoRow) => {
    const nuevo = !c.revisado;
    setCursos((prev) => prev.map((x) => (x.id === c.id ? { ...x, revisado: nuevo } : x)));
    try {
      await axios.patch(`${API_URL}/cursos/${c.id}/revisado`, { revisado: nuevo }, { headers: adminHeaders() });
    } catch {
      setCursos((prev) => prev.map((x) => (x.id === c.id ? { ...x, revisado: !nuevo } : x)));
      toast({ title: "No se pudo guardar la revisión", status: "error", duration: 3000 });
    }
  };

  // Una fila de curso, con el fondo y el icono de su disciplina.
  const renderFila = (c: CursoRow) => {
    const disc = disciplinaCursoBySlug(c.modalidad);
    const hasBg = !!disc && hasDisciplinaBg(disc.nom);
    // Con foto de disciplina se conservan sus colores; sin foto, turquesa oscuro sobre el beige.
    const color = hasBg ? (disc?.color ?? "#ffffff") : T;
    const bg = disc?.bg ?? "#3B2418";
    const Icon = disc?.Icon;
    const tShadow = hasBg ? `0 1px 4px ${bg}, 0 0 10px ${bg}, 0 0 20px ${bg}` : "none";
    // Botones: sobre la foto, translúcidos oscuros con letra blanca; sobre el beige, turquesa.
    const bSec = hasBg
      ? { color: "white", bg: "rgba(0,0,0,0.28)", border: "1px solid rgba(255,255,255,0.4)", _hover: { borderColor: "white" } }
      : btnSec;
    const bPri = hasBg ? { color: "#3B2418", bg: "rgba(255,255,255,0.92)", _hover: { bg: "white" } } : btnPri;
    return (
      <Box key={c.id} position="relative" overflow="hidden" borderRadius="xl"
           bg={hasBg ? "#2a1810" : "transparent"} border={hasBg ? undefined : `1.5px solid ${T}`}
           boxShadow={hasBg ? `0 0 28px ${color}40` : undefined}>
        {hasBg && disc && <DisciplinaBgLayer nom={disc.nom} borderRadius="xl" />}
        <Flex position="relative" zIndex={1} align="center" gap={3} p={{ base: 4, md: 5 }} flexWrap="wrap">
          {Icon && (
            <Flex flexShrink={0} w={{ base: "42px", md: "48px" }} h={{ base: "42px", md: "48px" }} borderRadius="full"
                  align="center" justify="center" bg={`${color}1c`} border={`2px solid ${color}`} boxShadow={hasBg ? `0 0 12px ${color}88` : undefined}>
              <Icon size="26px" />
            </Flex>
          )}
          <Box flex="1" minW={0}>
            <Text color={color} fontSize={{ base: "md", md: "lg" }} fontWeight="700" noOfLines={1}
                  style={{ textShadow: tShadow }}>
              {c.titulo || "(sin título)"}
            </Text>
            <Flex gap={2} mt={1.5} align="center" flexWrap="wrap">
              <Badge colorScheme={c.de_pago ? "yellow" : "green"}>{c.de_pago ? "De pago" : "Gratis"}</Badge>
              <Badge colorScheme={c.publicado ? "orange" : "gray"}>{c.publicado ? "Publicado" : "Oculto"}</Badge>
              <Text color={color} fontSize="sm" opacity={0.85} style={{ textShadow: tShadow }}>{nLecciones(c)} lecciones</Text>
            </Flex>
          </Box>
          {/* Check personal del admin: marcar si ya lo has revisado. */}
          <Checkbox
            isChecked={!!c.revisado}
            onChange={() => toggleRevisado(c)}
            colorScheme="orange"
            size="lg"
            title="Marca los cursos que ya has revisado (solo lo ves tú)"
            sx={{
              "& .chakra-checkbox__label": {
                color: hasBg ? "white" : T, fontWeight: 700, fontSize: "sm", textShadow: tShadow,
              },
              "& .chakra-checkbox__control": {
                borderColor: hasBg ? "rgba(255,255,255,0.7)" : T, bg: hasBg ? "rgba(0,0,0,0.28)" : "#F7EBD9",
              },
            }}
          >
            Revisado
          </Checkbox>
          <Box as="button" onClick={() => copiarCurso(c)} {...btnStyle}
               {...bSec} px={4} py="7px" fontSize="sm" title="Copiar todo el texto del curso al portapapeles">
            ⧉ Copiar texto
          </Box>
          <Box as="button" onClick={() => toggleCompletado(c)} {...btnStyle}
               {...bSec} px={4} py="7px" fontSize="sm">
            {c.completado ? "↩ Reabrir" : "✓ Completar"}
          </Box>
          <Box as="button" onClick={() => navigate(`/admin/cursos/${c.id}`)} {...btnStyle}
               {...bPri} px={5} py="8px" fontSize="sm">
            Editar
          </Box>
          <Box as="button" onClick={() => setABorrar(c)} {...btnStyle}
               {...bSec} px={4} py="7px" fontSize="sm"
               _hover={hasBg ? { borderColor: "#ff8a8a", color: "#ff8a8a" } : { bg: "#b3261e14", borderColor: "#b3261e", color: "#b3261e" }}>
            Borrar
          </Box>
        </Flex>
      </Box>
    );
  };

  // Un "espacio": En progreso / Completados.
  const Seccion = ({ titulo, list }: { titulo: string; list: CursoRow[] }) => (
    <Box mb={{ base: 10, md: 12 }}>
      <Flex align="center" gap={4} mb={{ base: 5, md: 6 }}>
        <Text color={T} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.08em"
              textTransform="uppercase" whiteSpace="nowrap">
          {titulo}
        </Text>
        <Box flex="1" h="1px" bg={`${T}40`} />
        <Text color={`${T}99`} fontSize="sm" flexShrink={0}>{list.length}</Text>
      </Flex>
      {list.length ? (
        <Flex direction="column" gap={3}>{list.map(renderFila)}</Flex>
      ) : (
        <Text color={`${T}99`} fontStyle="italic" fontSize="sm">Ninguno todavía.</Text>
      )}
    </Box>
  );

  if (verificando) return <LifeLoading variant="private" />;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#F0DCC0" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      {/* ── MANDALA ── */}
      <Flex justify="center" pt={{ base: 8, md: 12 }}>
        <MandalaTurquesa tam="64px" />
      </Flex>

      {/* ── TÍTULO + NUEVO CURSO ── */}
      <Flex direction="column" align="center" textAlign="center" px={{ base: 5, md: 10 }} pt={{ base: 5, md: 7 }} gap={{ base: 4, md: 5 }}>
        <Text color={T} fontSize={{ base: "3xl", md: "5xl" }} fontWeight="700" letterSpacing="0.1em"
              textTransform="uppercase">
          Cursos
        </Text>
        <Box as="button" onClick={() => setCrearOpen(true)} {...btnStyle}
             {...btnPri} px={6} py="11px" fontSize={{ base: "md", md: "lg" }}
             _hover={{ transform: "translateY(-1px)", bg: "#5a3624" }}>
          + Nuevo curso
        </Box>
      </Flex>

      <Flex flex="1" justify="center" px={{ base: 5, md: 10 }} pt={{ base: 8, md: 10 }} pb={{ base: 10, md: 14 }}>
        <Box w="100%" maxW="920px">
          {loading ? (
            <LifeLoader />
          ) : cursos.length === 0 ? (
            <Text color={`${T}bb`} fontStyle="italic" textAlign="center" mt={10}>
              Aún no hay cursos. Crea el primero con “+ Nuevo curso”.
            </Text>
          ) : (
            <>
              <Seccion titulo="En progreso" list={cursos.filter((c) => !c.completado)} />
              <Seccion titulo="Completados" list={cursos.filter((c) => c.completado)} />
            </>
          )}
        </Box>
      </Flex>

      <SiteFooter />

      {/* ── Modal crear curso ── */}
      <Modal isOpen={crearOpen} onClose={() => setCrearOpen(false)} isCentered size="xl">
        <ModalOverlay bg="#F0DCC0d9" />
        <ModalContent
          bg="#F0DCC0"
          color={T}
          fontFamily="'EB Garamond', serif"
          border={`1.5px solid ${T}`}
          borderRadius="2xl"
          boxShadow="none"
          mx={4}
          overflow="hidden"
        >
          <ModalCloseButton color={T} _focusVisible={focoT} />
          <Box p={{ base: 6, md: 8 }}>
              {/* Título con el mandala como pequeño adorno a la izquierda */}
              <Flex align="center" gap={3}>
                <MandalaTurquesa tam="30px" />
                <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.12em" textTransform="uppercase">
                  Nuevo curso
                </Text>
              </Flex>
              {/* Línea elegante de separación */}
              <Box h="1px" mt={3} mb={5}
                   bgGradient={`linear(to-r, ${T}aa, ${T}26 70%, ${T}00)`} />

              <Flex direction="column" gap={4}>
                <Box>
                  <Text fontSize="sm" mb={1} opacity={0.8}>Disciplina</Text>
                  <Select value={form.modalidad} onChange={(e) => setForm({ ...form, modalidad: e.target.value })}
                          {...campoSx} sx={{ option: { color: "black" } }}>
                    {DISCIPLINAS_CURSO.map((d) => <option key={d.slug} value={d.slug}>{d.nom}</option>)}
                  </Select>
                </Box>
                <Box>
                  <Text fontSize="sm" mb={1} opacity={0.8}>Título</Text>
                  <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                         placeholder="Fundamentos de la Astrología" {...campoSx} />
                </Box>
                <Box>
                  <Text fontSize="sm" mb={1} opacity={0.8}>Foto (ruta o URL)</Text>
                  <Input value={form.foto} onChange={(e) => setForm({ ...form, foto: e.target.value })}
                         placeholder="/img/astrologia/space.webp" {...campoSx} />
                </Box>
                <Box>
                  <Text fontSize="sm" mb={1} opacity={0.8}>Descripción</Text>
                  <Textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                            placeholder="Breve frase del curso" {...campoSx} rows={2} />
                </Box>
                <Flex gap={6} align="center">
                  <Checkbox colorScheme="orange" isChecked={form.de_pago} onChange={(e) => setForm({ ...form, de_pago: e.target.checked })}>De pago</Checkbox>
                  <Checkbox colorScheme="orange" isChecked={form.publicado} onChange={(e) => setForm({ ...form, publicado: e.target.checked })}>Publicado</Checkbox>
                </Flex>
              </Flex>

              <Flex justify="flex-end" gap={3} mt={6}>
                <Box as="button" onClick={() => setCrearOpen(false)} {...btnStyle} {...btnSec} px={5} py="9px">Cancelar</Box>
                <Box as="button" onClick={crear} {...btnStyle} {...btnPri} px={6} py="9px"
                     opacity={guardando ? 0.6 : 1} pointerEvents={guardando ? "none" : "auto"}>
                  {guardando ? "Creando…" : "Crear y editar"}
                </Box>
              </Flex>
          </Box>
        </ModalContent>
      </Modal>

      {/* ── Modal confirmar borrado ── */}
      <Modal isOpen={!!aBorrar} onClose={() => setABorrar(null)} isCentered size="md">
        <ModalOverlay bg="#F0DCC0d9" />
        <ModalContent
          bg="#F0DCC0"
          color={T}
          fontFamily="'EB Garamond', serif"
          border={`1.5px solid ${T}`}
          borderRadius="2xl"
          boxShadow="none"
          mx={4}
          overflow="hidden"
        >
          <ModalCloseButton color={T} _focusVisible={focoT} />
          <Box p={{ base: 6, md: 8 }} textAlign="center">
            <Flex justify="center" mb={4}><MandalaTurquesa tam="34px" /></Flex>
            <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.06em" mb={2}>
              ¿Borrar este curso?
            </Text>
            <Text fontSize="md" opacity={0.85} mb={1}>
              “{aBorrar?.titulo || "(sin título)"}”
            </Text>
            <Text fontSize="sm" opacity={0.7} mb={6} fontStyle="italic">
              Esta acción no se puede deshacer.
            </Text>
            <Flex justify="center" gap={3}>
              <Box as="button" onClick={() => setABorrar(null)} {...btnStyle} {...btnSec} px={6} py="9px">
                Cancelar
              </Box>
              <Box as="button" onClick={() => aBorrar && borrar(aBorrar)} {...btnStyle} px={6} py="9px"
                   bg="transparent" color="#b3261e" border="1.5px solid #b3261e"
                   _hover={{ bg: "#b3261e14" }} _focusVisible={focoT}>
                Borrar
              </Box>
            </Flex>
          </Box>
        </ModalContent>
      </Modal>
    </Box>
  );
}
