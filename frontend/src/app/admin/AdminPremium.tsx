import React, { useCallback, useEffect, useState } from "react";
import { Box, Flex, Input, Text, Textarea } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { focoBlanco } from "../../components/global/foco";
import { API_URL } from "../../GlobalVariables";
import { useAdminGuard, adminHeaders } from "./useAdminGuard";

/**
 * /admin/premium — publicar un podcast o un reel del contenido premium.
 *
 * No se sube ningún archivo: se pega el ENLACE de YouTube (reel, short, vídeo del podcast…).
 * Al publicar, se manda el aviso a quien tenga el acceso al día, por email automáticamente y,
 * por WhatsApp, desde la lista de abajo (cada botón abre tu WhatsApp con el mensaje escrito).
 */
type Tipo = "podcast" | "reel";
type Fila = { id: string; tipo: Tipo; titulo: string; avisados: number; created_at: string };
type Pendiente = { nombre: string; telefono: string; eligio?: boolean };
type Resumen = { email: number; whatsapp: number; whatsappConfigurado: boolean; textoWhatsapp: string; manual: Pendiente[] };

const RESPALDO: Record<Tipo, string> = {
  podcast: "Hay un podcast nuevo: «tu título». Ya puedes escucharlo.",
  reel: "Hay un reel nuevo: «tu título». Ya puedes verlo.",
};

export default function AdminPremium() {
  const { verificando } = useAdminGuard();
  const [tipo, setTipo] = useState<Tipo>("reel");
  const [video, setVideo] = useState("");
  const [titulo, setTitulo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState<{ ok: boolean; texto: string } | null>(null);
  const [lista, setLista] = useState<Fila[]>([]);
  // Sin WhatsApp automático, María los manda desde su móvil: estos son a quién y qué texto.
  const [gente, setGente] = useState<Pendiente[]>([]);
  const [ultimoTexto, setUltimoTexto] = useState<string | null>(null);
  const [yaEscritos, setYaEscritos] = useState<string[]>([]);

  const cargar = useCallback(async () => {
    try {
      const r = await axios.get<Fila[]>(`${API_URL}/premium/admin/contenido`, { headers: adminHeaders() });
      setLista(r.data ?? []);
    } catch {
      setLista([]);
    }
  }, []);
  const cargarGente = useCallback(async () => {
    try {
      const r = await axios.get<Pendiente[]>(`${API_URL}/premium/admin/whatsapp`, { headers: adminHeaders() });
      setGente(r.data ?? []);
    } catch {
      setGente([]);
    }
  }, []);
  useEffect(() => { if (!verificando) { cargar(); cargarGente(); } }, [verificando, cargar, cargarGente]);

  if (verificando) return <LifeLoading variant="private" />;

  const publicar = async () => {
    if (!video.trim()) { setAviso({ ok: false, texto: "Pega el enlace de YouTube." }); return; }
    if (!titulo.trim()) { setAviso({ ok: false, texto: "Escribe un título." }); return; }
    setEnviando(true);
    setAviso(null);
    try {
      const pub = await axios.post(
        `${API_URL}/premium/admin/contenido`,
        { tipo, titulo: titulo.trim(), video: video.trim(), mensaje: mensaje.trim() },
        { headers: adminHeaders() },
      );
      const r: Resumen = pub.data.avisos;
      const partes = [`Publicado. Avisando a ${r.email} por email.`];
      if (r.whatsapp > 0) partes.push(r.whatsappConfigurado ? `Y a ${r.whatsapp} por WhatsApp.` : `Los ${r.whatsapp} WhatsApp los mandas tú: pulsa cada nombre aquí abajo.`);
      setAviso({ ok: true, texto: partes.join(" ") });
      setUltimoTexto(r.textoWhatsapp ?? null);
      setYaEscritos([]);
      cargarGente();
      setVideo("");
      setTitulo("");
      setMensaje("");
      cargar();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? "No se pudo publicar.";
      setAviso({ ok: false, texto: `No se pudo publicar: ${Array.isArray(msg) ? msg.join(", ") : msg}` });
    } finally {
      setEnviando(false);
    }
  };

  const borrar = async (f: Fila) => {
    if (!window.confirm(`¿Borrar «${f.titulo}»? No se puede deshacer.`)) return;
    try {
      await axios.delete(`${API_URL}/premium/admin/contenido/${f.id}`, { headers: adminHeaders() });
      cargar();
    } catch {
      setAviso({ ok: false, texto: "No se pudo borrar." });
    }
  };

  const pildora = (t: Tipo, texto: string) => (
    <Box
      as="button"
      type="button"
      onClick={() => setTipo(t)}
      flex="1"
      py="14px"
      borderRadius="full"
      border="1.5px solid white"
      bg={tipo === t ? "white" : "transparent"}
      color={tipo === t ? "#004f4f" : "white"}
      fontWeight="700"
      fontSize="lg"
      letterSpacing="0.12em"
      textTransform="uppercase"
      _focusVisible={focoBlanco}
    >
      {texto}
    </Box>
  );

  const campo = {
    bg: "rgba(255,255,255,0.1)",
    border: "1.5px solid rgba(255,255,255,0.6)",
    borderRadius: "2xl",
    color: "white",
    fontFamily: "'EB Garamond', serif",
    fontSize: "xl",
    _placeholder: { color: "rgba(255,255,255,0.6)" },
    _focusVisible: { outline: "2px solid white", boxShadow: "none" },
  } as const;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />
      <Flex flex="1" direction="column" align="center" px={{ base: 4, md: 10 }} py={{ base: 8, md: 12 }}>
        <Text color="white" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" textAlign="center">
          Publicar contenido premium
        </Text>

        <Flex direction="column" gap={5} w="100%" maxW="560px" mt={{ base: 6, md: 8 }}>
          <Flex gap={3}>
            {pildora("reel", "Reel")}
            {pildora("podcast", "Podcast")}
          </Flex>

          <Input
            value={video}
            onChange={(e) => setVideo(e.target.value)}
            placeholder="Enlace de YouTube"
            inputMode="url"
            autoCapitalize="none"
            autoCorrect="off"
            h="58px"
            {...campo}
          />
          <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título" h="58px" {...campo} />

          <Box>
            <Text color="white" fontSize="lg" mb={2}>
              Mensaje para quien se suscribió a los avisos
            </Text>
            <Textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} placeholder={RESPALDO[tipo]} rows={5} {...campo} />
            <Text color="rgba(255,255,255,0.7)" fontSize="md" fontStyle="italic" mt={2}>
              Si lo dejas vacío se envía el texto gris de arriba.
            </Text>
          </Box>

          {aviso && (
            <Text color="white" fontSize="lg" textAlign="center" fontStyle={aviso.ok ? "normal" : "italic"} role="status">
              {aviso.texto}
            </Text>
          )}

          <Box
            as="button"
            type="button"
            onClick={publicar}
            disabled={enviando}
            opacity={enviando ? 0.6 : 1}
            py="18px"
            borderRadius="full"
            bg="white"
            color="#004f4f"
            fontWeight="700"
            fontSize="xl"
            letterSpacing="0.16em"
            textTransform="uppercase"
            _focusVisible={focoBlanco}
          >
            {enviando ? "Publicando…" : "Publicar y avisar"}
          </Box>
        </Flex>

        {gente.length > 0 && (
          <Flex direction="column" gap={3} w="100%" maxW="560px" mt={{ base: 8, md: 10 }}>
            <Text color="white" fontSize="xl" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase">
              Avisar por WhatsApp
            </Text>
            <Text color="rgba(255,255,255,0.8)" fontSize="md" fontStyle="italic">
              Cada botón abre tu WhatsApp con ese número. Lleva el mensaje que estás escribiendo arriba (o el del último contenido publicado); solo tienes que enviarlo.
            </Text>
            {gente.map((p) => {
              const hecho = yaEscritos.includes(p.telefono);
              const texto = mensaje.trim() ? `${mensaje.trim()}
${window.location.origin}/premium/espacio` : ultimoTexto;
              return (
                <Box
                  key={p.telefono}
                  as="a"
                  href={`https://wa.me/${p.telefono.replace(/D/g, "")}${texto ? `?text=${encodeURIComponent(texto)}` : ""}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setYaEscritos((v) => (v.includes(p.telefono) ? v : [...v, p.telefono]))}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={3}
                  px={4}
                  py={3}
                  borderRadius="2xl"
                  border="1.5px solid white"
                  bg={hecho ? "transparent" : "rgba(255,255,255,0.14)"}
                  opacity={hecho ? 0.6 : 1}
                  color="white"
                  textDecoration="none"
                  _hover={{ textDecoration: "none", bg: "rgba(255,255,255,0.22)" }}
                  _focusVisible={focoBlanco}
                >
                  <Box minW={0}>
                    <Text fontSize="lg" noOfLines={1}>{p.nombre || p.telefono}</Text>
                    <Text fontSize="sm" opacity={0.75}>{p.telefono}{p.eligio ? "" : " · no ha pedido WhatsApp"}</Text>
                  </Box>
                  <Text fontSize="md" flexShrink={0}>{hecho ? "Abierto ✓" : "Enviar →"}</Text>
                </Box>
              );
            })}
          </Flex>
        )}

        {lista.length > 0 && (
          <Flex direction="column" gap={3} w="100%" maxW="560px" mt={{ base: 10, md: 14 }}>
            <Text color="white" fontSize="xl" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase">
              Publicado
            </Text>
            {lista.map((f) => (
              <Flex key={f.id} align="center" justify="space-between" gap={3} px={4} py={3} borderRadius="2xl" border="1px solid rgba(255,255,255,0.45)">
                <Box minW={0}>
                  <Text color="white" fontSize="lg" noOfLines={1}>{f.titulo}</Text>
                  <Text color="rgba(255,255,255,0.7)" fontSize="sm">
                    {f.tipo === "reel" ? "Reel" : "Podcast"} · {new Date(f.created_at).toLocaleDateString("es-ES")} · {f.avisados} avisos
                  </Text>
                </Box>
                <Box as="button" type="button" onClick={() => borrar(f)} color="white" textDecoration="underline" fontSize="md" flexShrink={0} _focusVisible={focoBlanco}>
                  Borrar
                </Box>
              </Flex>
            ))}
          </Flex>
        )}
      </Flex>
      <SiteFooter />
    </Box>
  );
}
