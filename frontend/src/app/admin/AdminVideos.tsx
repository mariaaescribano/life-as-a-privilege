import React, { useEffect, useRef, useState } from "react";
import {
  Box, Flex, Text, Image, Badge, Input, Select, Checkbox,
  Modal, ModalOverlay, ModalContent, ModalCloseButton,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { LifeLoader } from "../../components/metodo/comicLoaders";
import { useAdminGuard, adminHeaders } from "./useAdminGuard";
import { API_URL } from "../../GlobalVariables";
import { DISCIPLINAS_CURSO, disciplinaCursoBySlug } from "../../data/disciplinasCurso";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../../components/global/DisciplinaBgLayer";
import { portadaDe, youtubeId, type VideoApi } from "../../data/videosApi";

const btnStyle = {
  fontFamily: "'EB Garamond', serif", fontWeight: 700, letterSpacing: "0.06em",
  borderRadius: "full", cursor: "pointer", transition: "all 0.2s",
} as const;

const inputStyle = {
  bg: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.25)",
} as const;

type Form = {
  disciplina: string;
  titulo: string;
  portada: string;
  url: string;
  publicado: boolean;
  orden: number;
};

const FORM_VACIO: Form = {
  disciplina: DISCIPLINAS_CURSO[0].slug,
  titulo: "",
  portada: "",
  url: "",
  publicado: true,
  orden: 0,
};

export default function AdminVideos() {
  const { verificando } = useAdminGuard();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [videos, setVideos] = useState<VideoApi[]>([]);
  const [loading, setLoading] = useState(true);
  // null = cerrado · "nuevo" = creando · un id = editando ese vídeo.
  const [editando, setEditando] = useState<string | null>(null);
  const [form, setForm] = useState<Form>(FORM_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [aBorrar, setABorrar] = useState<VideoApi | null>(null);

  const cargar = async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API_URL}/videos/admin/todos`, { headers: adminHeaders() });
      setVideos(Array.isArray(r.data) ? r.data : []);
    } catch {
      toast({ title: "No se pudieron cargar los vídeos", status: "error", duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (!verificando) cargar(); /* eslint-disable-next-line */ }, [verificando]);

  const abrirNuevo = () => {
    // El nuevo vídeo va el último de la lista.
    setForm({ ...FORM_VACIO, orden: videos.length ? Math.max(...videos.map((v) => v.orden ?? 0)) + 1 : 0 });
    setEditando("nuevo");
  };

  const abrirEditar = (v: VideoApi) => {
    setForm({
      disciplina: v.disciplina || DISCIPLINAS_CURSO[0].slug,
      titulo: v.titulo ?? "",
      portada: v.portada ?? "",
      url: v.url ?? "",
      publicado: !!v.publicado,
      orden: v.orden ?? 0,
    });
    setEditando(v.id);
  };

  // Subir la portada. Va a su propio endpoint (bucket 'img', carpeta videos/):
  // lo que se guarda en la fila del vídeo es solo la URL que devuelve.
  const subirPortada = async (file: File) => {
    setSubiendo(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await axios.post(`${API_URL}/upload/portada-video`, fd, { headers: adminHeaders() });
      if (!r.data?.url) throw new Error("sin url");
      setForm((f) => ({ ...f, portada: r.data.url }));
      toast({ title: "Portada subida", status: "success", duration: 2000 });
    } catch {
      toast({ title: "No se pudo subir la portada", status: "error", duration: 3000 });
    } finally {
      setSubiendo(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const guardar = async () => {
    if (!form.titulo.trim()) {
      toast({ title: "Ponle un título al vídeo", status: "warning", duration: 2500 });
      return;
    }
    if (!form.url.trim()) {
      toast({ title: "Falta el enlace del short de YouTube", status: "warning", duration: 2500 });
      return;
    }
    setGuardando(true);
    try {
      if (editando === "nuevo") {
        const r = await axios.post(`${API_URL}/videos`, form, { headers: adminHeaders() });
        setVideos((prev) => [...prev, r.data as VideoApi]);
      } else {
        const r = await axios.patch(`${API_URL}/videos/${editando}`, form, { headers: adminHeaders() });
        setVideos((prev) => prev.map((v) => (v.id === editando ? (r.data as VideoApi) : v)));
      }
      setEditando(null);
    } catch {
      toast({ title: "No se pudo guardar el vídeo", status: "error", duration: 3000 });
    } finally {
      setGuardando(false);
    }
  };

  const borrar = async (v: VideoApi) => {
    try {
      await axios.delete(`${API_URL}/videos/${v.id}`, { headers: adminHeaders() });
      setVideos((prev) => prev.filter((x) => x.id !== v.id));
      toast({ title: "Vídeo borrado", status: "success", duration: 2000 });
    } catch {
      toast({ title: "No se pudo borrar", status: "error", duration: 3000 });
    } finally {
      setABorrar(null);
    }
  };

  // Una fila de vídeo, con el fondo y el icono de su disciplina.
  const renderFila = (v: VideoApi) => {
    const disc = disciplinaCursoBySlug(v.disciplina);
    const color = disc?.color ?? "#ffffff";
    const bg = disc?.bg ?? "#003535";
    const Icon = disc?.Icon;
    const hasBg = !!disc && hasDisciplinaBg(disc.nom);
    const tShadow = `0 1px 4px ${bg}, 0 0 10px ${bg}, 0 0 20px ${bg}`;
    const foto = portadaDe(v);
    return (
      <Box key={v.id} position="relative" overflow="hidden" borderRadius="xl" bg="#05403f"
           boxShadow={`0 0 18px rgba(255,255,255,0.22), 0 0 45px rgba(255,255,255,0.1), 0 0 78px rgba(180,255,245,0.14), 0 0 28px ${color}40`}>
        {hasBg && disc && <DisciplinaBgLayer nom={disc.nom} borderRadius="xl" />}
        <Flex position="relative" zIndex={1} align="center" gap={3} p={{ base: 4, md: 5 }} flexWrap="wrap">
          {/* Portada en miniatura */}
          <Box flexShrink={0} w="54px" h="72px" borderRadius="md" overflow="hidden"
               bg="rgba(0,0,0,0.3)" border={`1px solid ${color}66`}>
            {foto && <Image src={foto} alt="" w="100%" h="100%" objectFit="cover" />}
          </Box>

          {Icon && (
            <Flex flexShrink={0} w={{ base: "42px", md: "48px" }} h={{ base: "42px", md: "48px" }} borderRadius="full"
                  align="center" justify="center" bg={`${color}1c`} border={`2px solid ${color}`} boxShadow={`0 0 12px ${color}88`}>
              <Icon size="26px" />
            </Flex>
          )}

          <Box flex="1" minW={0}>
            <Text color={color} fontSize={{ base: "md", md: "lg" }} fontWeight="700" noOfLines={1}
                  style={{ textShadow: tShadow }}>
              {v.titulo || "(sin título)"}
            </Text>
            <Flex gap={2} mt={1.5} align="center" flexWrap="wrap">
              <Badge colorScheme={v.publicado ? "teal" : "gray"}>{v.publicado ? "Publicado" : "Oculto"}</Badge>
              {!v.portada?.trim() && <Badge colorScheme="orange">Sin portada propia</Badge>}
              {!youtubeId(v.url) && <Badge colorScheme="red">Enlace raro</Badge>}
              <Text color={color} fontSize="sm" opacity={0.85} noOfLines={1} style={{ textShadow: tShadow }}>
                {v.url}
              </Text>
            </Flex>
          </Box>

          <Box as="button" onClick={() => window.open(v.url, "_blank", "noopener,noreferrer")} {...btnStyle}
               color="white" bg="rgba(0,0,0,0.28)" border="1px solid rgba(255,255,255,0.4)" px={4} py="7px" fontSize="sm"
               _hover={{ borderColor: "white" }}>
            Abrir
          </Box>
          <Box as="button" onClick={() => abrirEditar(v)} {...btnStyle}
               color="#008080" bg="rgba(255,255,255,0.92)" px={5} py="8px" fontSize="sm" _hover={{ bg: "white" }}>
            Editar
          </Box>
          <Box as="button" onClick={() => setABorrar(v)} {...btnStyle}
               color="white" bg="rgba(0,0,0,0.28)" border="1px solid rgba(255,255,255,0.4)" px={4} py="7px" fontSize="sm"
               _hover={{ borderColor: "#ff8a8a", color: "#ff8a8a" }}>
            Borrar
          </Box>
        </Flex>
      </Box>
    );
  };

  if (verificando) return <LifeLoading variant="private" />;

  const previa = portadaDe({ portada: form.portada, url: form.url });

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

      {/* ── TÍTULO + NUEVO VÍDEO ── */}
      <Flex direction="column" align="center" textAlign="center" px={{ base: 5, md: 10 }} pt={{ base: 5, md: 7 }} gap={{ base: 4, md: 5 }}>
        <Text color="white" fontSize={{ base: "3xl", md: "5xl" }} fontWeight="700" letterSpacing="0.1em"
              textTransform="uppercase" textShadow="0 0 14px rgba(255,255,255,0.6), 0 0 30px rgba(180,255,245,0.3)">
          Vídeos
        </Text>
        <Text color="rgba(255,255,255,0.72)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" maxW="620px">
          Cada vídeo es un short de YouTube: aquí se guardan el enlace, la portada y la disciplina a la que pertenece.
        </Text>
        <Box as="button" onClick={abrirNuevo} {...btnStyle}
             color="#008080" bg="white" px={6} py="11px" fontSize={{ base: "md", md: "lg" }}
             boxShadow="0 0 16px rgba(255,255,255,0.4)" _hover={{ transform: "translateY(-1px)", boxShadow: "0 0 24px rgba(255,255,255,0.6)" }}>
          + Nuevo vídeo
        </Box>
      </Flex>

      <Flex flex="1" justify="center" px={{ base: 5, md: 10 }} pt={{ base: 8, md: 10 }} pb={{ base: 10, md: 14 }}>
        <Box w="100%" maxW="920px">
          {loading ? (
            <LifeLoader color="#ffffff" />
          ) : videos.length === 0 ? (
            <Text color="rgba(255,255,255,0.75)" fontStyle="italic" textAlign="center" mt={10}>
              Aún no hay vídeos. Añade el primero con “+ Nuevo vídeo”.
            </Text>
          ) : (
            <Flex direction="column" gap={3}>{videos.map(renderFila)}</Flex>
          )}
        </Box>
      </Flex>

      <SiteFooter />

      {/* ── Modal crear / editar ── */}
      <Modal isOpen={!!editando} onClose={() => setEditando(null)} isCentered size="xl">
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
            <Flex align="center" gap={3}>
              <Image src="/img/icono/life.png" alt="" h="30px" w="auto" flexShrink={0} objectFit="contain"
                     style={{ filter: "drop-shadow(0 0 7px rgba(255,255,255,0.5)) drop-shadow(0 0 16px rgba(180,255,245,0.3))" }} />
              <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.12em" textTransform="uppercase"
                    textShadow="0 0 12px rgba(255,255,255,0.5)">
                {editando === "nuevo" ? "Nuevo vídeo" : "Editar vídeo"}
              </Text>
            </Flex>
            <Box h="1px" mt={3} mb={5}
                 bgGradient="linear(to-r, rgba(255,255,255,0.7), rgba(255,255,255,0.15) 70%, transparent)"
                 boxShadow="0 0 8px rgba(255,255,255,0.3)" />

            <Flex gap={5} align="flex-start" direction={{ base: "column", md: "row" }}>
              {/* Portada: previsualización + subir archivo */}
              <Flex direction="column" align="center" gap={3} flexShrink={0} w={{ base: "100%", md: "180px" }}>
                <Box w="150px" h="200px" borderRadius="lg" overflow="hidden" bg="rgba(0,0,0,0.3)"
                     border="1px solid rgba(255,255,255,0.3)" display="flex" alignItems="center" justifyContent="center">
                  {previa
                    ? <Image src={previa} alt="" w="100%" h="100%" objectFit="cover" />
                    : <Text fontSize="xs" opacity={0.6} textAlign="center" px={2}>Sin portada</Text>}
                </Box>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) subirPortada(f); }}
                />
                <Box as="button" onClick={() => fileRef.current?.click()} {...btnStyle}
                     w="100%" px={4} py="9px" fontSize="sm" bg="rgba(255,255,255,0.12)"
                     border="1px solid rgba(255,255,255,0.4)" color="white"
                     opacity={subiendo ? 0.6 : 1} pointerEvents={subiendo ? "none" : "auto"}
                     _hover={{ bg: "rgba(255,255,255,0.2)" }}>
                  {subiendo ? "Subiendo…" : "Subir portada"}
                </Box>
                {/* La portada también puede ser una ruta de `frontend/public`
                    (p. ej. /miniaturas/psicologia/loquesea.webp): así se puede
                    dejar la imagen en el repo en vez de subirla al bucket. */}
                <Input value={form.portada} onChange={(e) => setForm({ ...form, portada: e.target.value })}
                       placeholder="…o una ruta: /miniaturas/…" size="sm" {...inputStyle} />
                {!form.portada.trim() && (
                  <Text fontSize="xs" opacity={0.65} textAlign="center" fontStyle="italic">
                    Si no pones ninguna, se usa la miniatura de YouTube.
                  </Text>
                )}
              </Flex>

              <Flex direction="column" gap={4} flex="1" minW={0} w="100%">
                <Box>
                  <Text fontSize="sm" mb={1} opacity={0.8}>Disciplina</Text>
                  <Select value={form.disciplina} onChange={(e) => setForm({ ...form, disciplina: e.target.value })}
                          {...inputStyle} sx={{ option: { color: "black" } }}>
                    {DISCIPLINAS_CURSO.map((d) => <option key={d.slug} value={d.slug}>{d.nom}</option>)}
                  </Select>
                </Box>
                <Box>
                  <Text fontSize="sm" mb={1} opacity={0.8}>Título</Text>
                  <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                         placeholder="Qué es el dosha Vata" {...inputStyle} />
                </Box>
                <Box>
                  <Text fontSize="sm" mb={1} opacity={0.8}>Enlace del short de YouTube</Text>
                  <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })}
                         placeholder="https://www.youtube.com/shorts/XXXXXXXXXXX" {...inputStyle} />
                </Box>
                <Flex gap={4} align="flex-end" flexWrap="wrap">
                  <Box w="120px">
                    <Text fontSize="sm" mb={1} opacity={0.8}>Orden</Text>
                    <Input type="number" value={form.orden}
                           onChange={(e) => setForm({ ...form, orden: Number(e.target.value) || 0 })}
                           {...inputStyle} />
                  </Box>
                  <Checkbox isChecked={form.publicado} onChange={(e) => setForm({ ...form, publicado: e.target.checked })} pb={2}>
                    Publicado
                  </Checkbox>
                </Flex>
              </Flex>
            </Flex>

            <Flex justify="flex-end" gap={3} mt={6}>
              <Box as="button" onClick={() => setEditando(null)} {...btnStyle} px={5} py="9px"
                   border="1px solid rgba(255,255,255,0.4)" color="white">Cancelar</Box>
              <Box as="button" onClick={guardar} {...btnStyle} px={6} py="9px" bg="white" color="#008080"
                   opacity={guardando ? 0.6 : 1} pointerEvents={guardando ? "none" : "auto"}>
                {guardando ? "Guardando…" : "Guardar"}
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
              ¿Borrar este vídeo?
            </Text>
            <Text fontSize="md" opacity={0.85} mb={1}>“{aBorrar?.titulo || "(sin título)"}”</Text>
            <Text fontSize="sm" opacity={0.7} mb={6} fontStyle="italic">
              Se quita de la página; el vídeo sigue en YouTube.
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
