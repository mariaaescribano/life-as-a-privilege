import React, { useEffect, useState } from "react";
import {
  Box, Flex, Text, Image, Badge, Input, Textarea, Select, Checkbox,
  Modal, ModalOverlay, ModalContent, ModalCloseButton,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { useAdminGuard, adminHeaders } from "./useAdminGuard";
import { API_URL } from "../../GlobalVariables";
import { DISCIPLINAS_CURSO, disciplinaCursoBySlug } from "../../data/disciplinasCurso";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../../components/global/DisciplinaBgLayer";

interface CursoRow {
  id: string; modalidad: string; titulo: string; foto: string; descripcion: string;
  de_pago: boolean; publicado: boolean; completado: boolean; orden: number;
  contenido: { title: string; submodules: any[] }[];
}

const nLecciones = (c: CursoRow) => (c.contenido ?? []).reduce((a, m) => a + (m.submodules?.length ?? 0), 0);

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

  const toggleCompletado = async (c: CursoRow) => {
    try {
      await axios.patch(`${API_URL}/cursos/${c.id}`, { completado: !c.completado }, { headers: adminHeaders() });
      setCursos((prev) => prev.map((x) => (x.id === c.id ? { ...x, completado: !c.completado } : x)));
    } catch {
      toast({ title: "No se pudo actualizar", status: "error", duration: 3000 });
    }
  };

  // Una fila de curso, con el fondo y el icono de su disciplina.
  const renderFila = (c: CursoRow) => {
    const disc = disciplinaCursoBySlug(c.modalidad);
    const color = disc?.color ?? "#ffffff";
    const bg = disc?.bg ?? "#003535";
    const Icon = disc?.Icon;
    const hasBg = !!disc && hasDisciplinaBg(disc.nom);
    const tShadow = `0 1px 4px ${bg}, 0 0 10px ${bg}, 0 0 20px ${bg}`;
    return (
      <Box key={c.id} position="relative" overflow="hidden" borderRadius="xl" bg="#05403f"
           boxShadow={`0 0 18px rgba(255,255,255,0.22), 0 0 45px rgba(255,255,255,0.1), 0 0 78px rgba(180,255,245,0.14), 0 0 28px ${color}40`}>
        {hasBg && disc && <DisciplinaBgLayer nom={disc.nom} borderRadius="xl" />}
        <Flex position="relative" zIndex={1} align="center" gap={4} p={{ base: 4, md: 5 }}>
          {Icon && (
            <Flex flexShrink={0} w={{ base: "42px", md: "48px" }} h={{ base: "42px", md: "48px" }} borderRadius="full"
                  align="center" justify="center" bg={`${color}1c`} border={`2px solid ${color}`} boxShadow={`0 0 12px ${color}88`}>
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
              <Badge colorScheme={c.publicado ? "teal" : "gray"}>{c.publicado ? "Publicado" : "Oculto"}</Badge>
              <Text color={color} fontSize="sm" opacity={0.85} style={{ textShadow: tShadow }}>{nLecciones(c)} lecciones</Text>
            </Flex>
          </Box>
          <Box as="button" onClick={() => toggleCompletado(c)} {...btnStyle}
               color="white" bg="rgba(0,0,0,0.28)" border="1px solid rgba(255,255,255,0.4)" px={4} py="7px" fontSize="sm"
               _hover={{ borderColor: "white" }}>
            {c.completado ? "↩ Reabrir" : "✓ Completar"}
          </Box>
          <Box as="button" onClick={() => navigate(`/admin/cursos/${c.id}`)} {...btnStyle}
               color="#008080" bg="rgba(255,255,255,0.92)" px={5} py="8px" fontSize="sm" _hover={{ bg: "white" }}>
            Editar
          </Box>
          <Box as="button" onClick={() => setABorrar(c)} {...btnStyle}
               color="white" bg="rgba(0,0,0,0.28)" border="1px solid rgba(255,255,255,0.4)" px={4} py="7px" fontSize="sm"
               _hover={{ borderColor: "#ff8a8a", color: "#ff8a8a" }}>
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
        <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.08em"
              textTransform="uppercase" whiteSpace="nowrap" textShadow="0 0 12px rgba(255,255,255,0.5)">
          {titulo}
        </Text>
        <Box flex="1" h="1px" bg="rgba(255,255,255,0.22)" />
        <Text color="rgba(255,255,255,0.6)" fontSize="sm" flexShrink={0}>{list.length}</Text>
      </Flex>
      {list.length ? (
        <Flex direction="column" gap={3}>{list.map(renderFila)}</Flex>
      ) : (
        <Text color="rgba(255,255,255,0.55)" fontStyle="italic" fontSize="sm">Ninguno todavía.</Text>
      )}
    </Box>
  );

  if (verificando) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      {/* ── MANDALA ── */}
      <Flex justify="center" pt={{ base: 8, md: 12 }}>
        <Image
          src="/img/icono/life.png"
          alt=""
          h={{ base: "48px", md: "64px" }}
          objectFit="contain"
          style={{ filter: "drop-shadow(0 0 9px rgba(255,255,255,0.59)) drop-shadow(0 0 21px rgba(255,255,255,0.32)) drop-shadow(0 0 42px rgba(180,255,245,0.24))" }}
        />
      </Flex>

      {/* ── TÍTULO + NUEVO CURSO ── */}
      <Flex direction="column" align="center" textAlign="center" px={{ base: 5, md: 10 }} pt={{ base: 5, md: 7 }} gap={{ base: 4, md: 5 }}>
        <Text color="white" fontSize={{ base: "3xl", md: "5xl" }} fontWeight="700" letterSpacing="0.1em"
              textTransform="uppercase" textShadow="0 0 14px rgba(255,255,255,0.6), 0 0 30px rgba(180,255,245,0.3)">
          Cursos
        </Text>
        <Box as="button" onClick={() => setCrearOpen(true)} {...btnStyle}
             color="#008080" bg="white" px={6} py="11px" fontSize={{ base: "md", md: "lg" }}
             boxShadow="0 0 16px rgba(255,255,255,0.4)" _hover={{ transform: "translateY(-1px)", boxShadow: "0 0 24px rgba(255,255,255,0.6)" }}>
          + Nuevo curso
        </Box>
      </Flex>

      <Flex flex="1" justify="center" px={{ base: 5, md: 10 }} pt={{ base: 8, md: 10 }} pb={{ base: 10, md: 14 }}>
        <Box w="100%" maxW="920px">
          {loading ? (
            <SpinnerTurquesa />
          ) : cursos.length === 0 ? (
            <Text color="rgba(255,255,255,0.75)" fontStyle="italic" textAlign="center" mt={10}>
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
        <ModalOverlay bg="rgba(0,0,0,0.8)" sx={{ backdropFilter: "blur(8px)" }} />
        <ModalContent
          bg="#008080"
          color="white"
          fontFamily="'EB Garamond', serif"
          border="1px solid rgba(255,255,255,0.22)"
          borderRadius="2xl"
          boxShadow="0 0 42px rgba(180,255,245,0.2), 0 0 100px rgba(255,255,255,0.1), 0 22px 60px rgba(0,0,0,0.6)"
          mx={4}
          overflow="hidden"
        >
          <ModalCloseButton color="white" />
          <Box p={{ base: 6, md: 8 }}>
              {/* Título con el mandala como pequeño adorno a la izquierda */}
              <Flex align="center" gap={3}>
                <Image src="/img/icono/life.png" alt="" h="30px" w="auto" flexShrink={0} objectFit="contain"
                  style={{ filter: "drop-shadow(0 0 7px rgba(255,255,255,0.5)) drop-shadow(0 0 16px rgba(180,255,245,0.3))" }} />
                <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.12em" textTransform="uppercase"
                      textShadow="0 0 12px rgba(255,255,255,0.5)">
                  Nuevo curso
                </Text>
              </Flex>
              {/* Línea elegante de separación */}
              <Box h="1px" mt={3} mb={5}
                   bgGradient="linear(to-r, rgba(255,255,255,0.7), rgba(255,255,255,0.15) 70%, transparent)"
                   boxShadow="0 0 8px rgba(255,255,255,0.3)" />

              <Flex direction="column" gap={4}>
                <Box>
                  <Text fontSize="sm" mb={1} opacity={0.8}>Disciplina</Text>
                  <Select value={form.modalidad} onChange={(e) => setForm({ ...form, modalidad: e.target.value })}
                          bg="rgba(255,255,255,0.1)" border="1px solid rgba(255,255,255,0.25)" sx={{ option: { color: "black" } }}>
                    {DISCIPLINAS_CURSO.map((d) => <option key={d.slug} value={d.slug}>{d.nom}</option>)}
                  </Select>
                </Box>
                <Box>
                  <Text fontSize="sm" mb={1} opacity={0.8}>Título</Text>
                  <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                         placeholder="Fundamentos de la Astrología" bg="rgba(255,255,255,0.1)" border="1px solid rgba(255,255,255,0.25)" />
                </Box>
                <Box>
                  <Text fontSize="sm" mb={1} opacity={0.8}>Foto (ruta o URL)</Text>
                  <Input value={form.foto} onChange={(e) => setForm({ ...form, foto: e.target.value })}
                         placeholder="/img/astrologia/space.jpg" bg="rgba(255,255,255,0.1)" border="1px solid rgba(255,255,255,0.25)" />
                </Box>
                <Box>
                  <Text fontSize="sm" mb={1} opacity={0.8}>Descripción</Text>
                  <Textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                            placeholder="Breve frase del curso" bg="rgba(255,255,255,0.1)" border="1px solid rgba(255,255,255,0.25)" rows={2} />
                </Box>
                <Flex gap={6} align="center">
                  <Checkbox isChecked={form.de_pago} onChange={(e) => setForm({ ...form, de_pago: e.target.checked })}>De pago</Checkbox>
                  <Checkbox isChecked={form.publicado} onChange={(e) => setForm({ ...form, publicado: e.target.checked })}>Publicado</Checkbox>
                </Flex>
              </Flex>

              <Flex justify="flex-end" gap={3} mt={6}>
                <Box as="button" onClick={() => setCrearOpen(false)} {...btnStyle} px={5} py="9px"
                     border="1px solid rgba(255,255,255,0.4)" color="white">Cancelar</Box>
                <Box as="button" onClick={crear} {...btnStyle} px={6} py="9px" bg="white" color="#008080"
                     opacity={guardando ? 0.6 : 1} pointerEvents={guardando ? "none" : "auto"}>
                  {guardando ? "Creando…" : "Crear y editar"}
                </Box>
              </Flex>
          </Box>
        </ModalContent>
      </Modal>

      {/* ── Modal confirmar borrado ── */}
      <Modal isOpen={!!aBorrar} onClose={() => setABorrar(null)} isCentered size="md">
        <ModalOverlay bg="rgba(0,0,0,0.8)" sx={{ backdropFilter: "blur(8px)" }} />
        <ModalContent
          bg="#008080"
          color="white"
          fontFamily="'EB Garamond', serif"
          border="1px solid rgba(255,255,255,0.22)"
          borderRadius="2xl"
          boxShadow="0 0 42px rgba(255,140,140,0.18), 0 0 100px rgba(255,255,255,0.08), 0 22px 60px rgba(0,0,0,0.6)"
          mx={4}
          overflow="hidden"
        >
          <ModalCloseButton color="white" />
          <Box p={{ base: 6, md: 8 }} textAlign="center">
            <Image src="/img/icono/life.png" alt="" h="34px" mx="auto" mb={4} objectFit="contain"
              style={{ filter: "drop-shadow(0 0 7px rgba(255,255,255,0.5)) drop-shadow(0 0 16px rgba(180,255,245,0.3))" }} />
            <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.06em" mb={2}
                  textShadow="0 0 12px rgba(255,255,255,0.45)">
              ¿Borrar este curso?
            </Text>
            <Text fontSize="md" opacity={0.85} mb={1}>
              “{aBorrar?.titulo || "(sin título)"}”
            </Text>
            <Text fontSize="sm" opacity={0.7} mb={6} fontStyle="italic">
              Esta acción no se puede deshacer.
            </Text>
            <Flex justify="center" gap={3}>
              <Box as="button" onClick={() => setABorrar(null)} {...btnStyle} px={6} py="9px"
                   border="1px solid rgba(255,255,255,0.45)" color="white" _hover={{ bg: "rgba(255,255,255,0.1)" }}>
                Cancelar
              </Box>
              <Box as="button" onClick={() => aBorrar && borrar(aBorrar)} {...btnStyle} px={6} py="9px"
                   bg="#e05a5a" color="white" boxShadow="0 0 16px rgba(224,90,90,0.55)"
                   _hover={{ bg: "#d44b4b", boxShadow: "0 0 24px rgba(224,90,90,0.8)" }}>
                Borrar
              </Box>
            </Flex>
          </Box>
        </ModalContent>
      </Modal>
    </Box>
  );
}
