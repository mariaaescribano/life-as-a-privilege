// ─────────────────────────────────────────────────────────────────────────────
// LA NOTA DE MARÍA EN CADA PÁGINA del recorrido (/metodo/...).
//
// Cada página tiene asociada una nota que María escribe PARA la persona. Vive en
// una pestaña en el borde derecho de la pantalla que se despliega como un panel
// lateral (en móvil, desde abajo): así no ocupa sitio en la página ni compite con
// «Índice» y «Mis notas», que están a la izquierda.
//
//   · María ve la pestaña SIEMPRE y escribe en un borrador que la persona NO ve.
//     Solo al pulsar «Publicar» lo que hay en el borrador pasa a verlo ella; puede
//     retirarlo cuando quiera.
//   · La persona solo ve la pestaña si hay algo publicado en esa página, con un
//     puntito hasta que lo abre. No puede modificarlo.
//
// ¿Quién es María aquí? La sesión de admin desbloqueada, para la persona que
// eligió en su panel (`notasPersona` en sessionStorage, lo pone el camino de esa
// persona), o dentro del camino de esa persona (api/persona.ts). Una admin sin persona
// elegida no tiene a quién escribir y no ve la pestaña.
//
// La clave de la nota es la ruta de la página, sin barra final.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Box, Flex, Text, Textarea } from "@chakra-ui/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { API_URL } from "../../GlobalVariables";
import { esAdminDesbloqueado } from "../../api/sesion";
import { personaActiva } from "../../api/persona";
import { useT } from "../../i18n";
import { fechaDMA } from "../../utils/fechas";
import { focoBlanco } from "./foco";

const MotionBox = motion(Box) as any;

/** A quién escribe María desde el panel (lo guarda el camino de esa persona). */
export const CLAVE_PERSONA_NOTAS = "notasPersona";

interface Contexto { maria: boolean; userId: string | null; nombre: string }

function contextoNota(): Contexto {
  const sup = personaActiva();
  if (sup) return { maria: true, userId: sup.id, nombre: sup.name ?? "" };
  if (esAdminDesbloqueado()) {
    try {
      const p = JSON.parse(sessionStorage.getItem(CLAVE_PERSONA_NOTAS) ?? "null") as { id?: string; name?: string } | null;
      if (p?.id) return { maria: true, userId: p.id, nombre: p.name ?? "" };
    } catch { /* sin persona elegida */ }
    return { maria: false, userId: null, nombre: "" };
  }
  let id: string | null = null;
  try { id = localStorage.getItem("userId"); } catch { /* modo privado */ }
  return { maria: false, userId: id, nombre: "" };
}

interface Nota {
  borrador: string;
  publicada: string | null;
  publicada_at: string | null;
  sinTabla?: boolean;
}

const VACIA: Nota = { borrador: "", publicada: null, publicada_at: null };
type Guardado = "quieto" | "guardando" | "guardado" | "error";

const cabecera = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` } });

export function NotaPagina() {
  const t = useT();
  const { pathname } = useLocation();
  const reducir = useReducedMotion();
  const ruta = pathname.replace(/\/+$/, "");
  const enRecorrido = ruta.startsWith("/metodo/");
  const ctx = contextoNota();

  const [nota, setNota] = useState<Nota | null>(null);
  const [texto, setTexto] = useState("");
  const [abierto, setAbierto] = useState(false);
  const [estado, setEstado] = useState<Guardado>("quieto");
  const [aviso, setAviso] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const [visto, setVisto] = useState<string | null>(null);
  const baseRef = useRef("");        // lo último que se sabe guardado como borrador
  const textoRef = useRef("");
  textoRef.current = texto;

  const userId = ctx.userId;
  const maria = ctx.maria;
  const claveVisto = userId ? `notaVista:${userId}:${ruta}` : "";

  // Lee la nota al llegar a una página (y al cambiar de página).
  useEffect(() => {
    setNota(null);
    setAbierto(false);
    setAviso(null);
    setEstado("quieto");
    if (!enRecorrido || !userId) return;
    let cancel = false;
    axios
      .get<Nota>(`${API_URL}/notas-pagina/${userId}`, { ...cabecera(), params: { pagina: ruta } })
      .then((r) => {
        if (cancel) return;
        const n = { ...VACIA, ...r.data, borrador: r.data?.borrador ?? "" };
        setNota(n);
        setTexto(n.borrador);
        baseRef.current = n.borrador;
        try { setVisto(localStorage.getItem(claveVisto)); } catch { setVisto(null); }
      })
      .catch(() => { /* sin nota o sin red: la pestaña no sale */ });
    return () => { cancel = true; };
  }, [ruta, userId, enRecorrido, maria, claveVisto]);

  // Guarda el borrador (María). Devuelve true si quedó guardado.
  const guardar = useCallback(async (): Promise<boolean> => {
    if (!maria || !userId) return false;
    const actual = textoRef.current;
    if (actual === baseRef.current) return true;
    setEstado("guardando");
    try {
      await axios.put(`${API_URL}/notas-pagina/${userId}`, { pagina: ruta, borrador: actual }, cabecera());
      baseRef.current = actual;
      setNota((n) => (n ? { ...n, borrador: actual, sinTabla: false } : n));
      setEstado("guardado");
      return true;
    } catch (e: any) {
      setEstado("error");
      setAviso(e?.response?.data?.message ?? "No se pudo guardar.");
      return false;
    }
  }, [maria, userId, ruta]);

  // Autoguardado: un momento después de dejar de escribir.
  useEffect(() => {
    if (!maria || !nota || texto === baseRef.current) return;
    setEstado("quieto");
    const id = setTimeout(() => { void guardar(); }, 800);
    return () => clearTimeout(id);
  }, [texto, maria, nota, guardar]);

  // Escape cierra el panel.
  useEffect(() => {
    if (!abierto) return;
    const alTeclear = (e: KeyboardEvent) => { if (e.key === "Escape") setAbierto(false); };
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [abierto]);

  if (!enRecorrido || !userId || !nota) return null;

  const hayPublicada = !!nota.publicada?.trim();
  // La persona solo ve la pestaña si hay algo publicado.
  if (!maria && !hayPublicada) return null;

  const sinLeer = !maria && hayPublicada && visto !== nota.publicada_at;

  const abrir = () => {
    const ahora = !abierto;
    setAbierto(ahora);
    if (ahora && !maria && nota.publicada_at) {
      try { localStorage.setItem(claveVisto, nota.publicada_at); } catch { /* modo privado */ }
      setVisto(nota.publicada_at);
    }
  };

  const publicar = async () => {
    setOcupado(true);
    setAviso(null);
    try {
      if (!(await guardar())) return;
      const { data } = await axios.post<{ publicada_at: string }>(`${API_URL}/notas-pagina/${userId}/publicar`, { pagina: ruta }, cabecera());
      setNota((n) => (n ? { ...n, publicada: textoRef.current, publicada_at: data.publicada_at } : n));
      setAviso("Publicada: ya la ve.");
    } catch (e: any) {
      setAviso(e?.response?.data?.message ?? "No se pudo publicar.");
    } finally {
      setOcupado(false);
    }
  };

  const retirar = async () => {
    setOcupado(true);
    setAviso(null);
    try {
      await axios.post(`${API_URL}/notas-pagina/${userId}/retirar`, { pagina: ruta }, cabecera());
      setNota((n) => (n ? { ...n, publicada: null, publicada_at: null } : n));
      setAviso("Retirada: ya no la ve. El borrador se queda.");
    } catch (e: any) {
      setAviso(e?.response?.data?.message ?? "No se pudo retirar.");
    } finally {
      setOcupado(false);
    }
  };

  const estadoNota = !hayPublicada ? "Borrador: no la ve" : nota.publicada === texto ? "Publicada" : "Cambios sin publicar";
  const pildora = (children: React.ReactNode, onClick: () => void, opts: { solido?: boolean; peligro?: boolean; off?: boolean } = {}) => (
    <Box
      as="button"
      type="button"
      onClick={opts.off ? undefined : onClick}
      disabled={opts.off}
      px={5}
      py="8px"
      borderRadius="full"
      border={opts.peligro ? "1.5px solid rgba(255,200,200,0.8)" : "1.5px solid rgba(255,255,255,0.75)"}
      bg={opts.solido ? "white" : opts.peligro ? "rgba(255,160,160,0.1)" : "rgba(255,255,255,0.14)"}
      color={opts.solido ? "#008080" : opts.peligro ? "#ffd6d6" : "white"}
      fontWeight="700"
      fontSize="sm"
      letterSpacing="0.04em"
      cursor={opts.off ? "not-allowed" : "pointer"}
      opacity={opts.off ? 0.5 : 1}
      transition="all 0.2s"
      _hover={opts.off ? undefined : { transform: "translateY(-1px)", bg: opts.solido ? "#e8fffc" : "rgba(255,255,255,0.26)" }}
      _focusVisible={focoBlanco}
    >
      {children}
    </Box>
  );

  return (
    <>
      {/* ── La pestaña del borde derecho ── */}
      <Box
        as="button"
        type="button"
        onClick={abrir}
        aria-expanded={abierto}
        aria-label={maria ? "Nota para esta página" : t("metodo.notaMaria.titulo")}
        position="fixed"
        right={0}
        top={{ base: "42%", md: "46%" }}
        zIndex={990}
        display="flex"
        alignItems="center"
        gap={2}
        px={{ base: "7px", md: "9px" }}
        py={{ base: "14px", md: "18px" }}
        bg="#006b6b"
        color="white"
        border="1px solid rgba(255,255,255,0.6)"
        borderRight="none"
        borderRadius="16px 0 0 16px"
        fontFamily="'EB Garamond', serif"
        fontWeight="700"
        fontSize={{ base: "sm", md: "md" }}
        letterSpacing="0.12em"
        textTransform="uppercase"
        boxShadow="0 0 18px rgba(255,255,255,0.28)"
        cursor="pointer"
        transition="all 0.25s ease"
        _hover={{ paddingRight: "14px", boxShadow: "0 0 26px rgba(255,255,255,0.45)" }}
        _focusVisible={focoBlanco}
        sx={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        {sinLeer && (
          <MotionBox
            as="span"
            w="9px"
            h="9px"
            borderRadius="full"
            bg="#ffe7bd"
            boxShadow="0 0 10px #ffe7bd"
            animate={reducir ? undefined : { scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        {maria ? "Nota" : t("metodo.notaMaria.titulo")}
      </Box>

      {/* ── El panel que se despliega ── */}
      <AnimatePresence>
        {abierto && (
          <MotionBox
            key="panel"
            role="dialog"
            aria-label={maria ? "Nota para esta página" : t("metodo.notaMaria.titulo")}
            initial={reducir ? { opacity: 0 } : { opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducir ? { opacity: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: reducir ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            position="fixed"
            zIndex={1300}
            bg="#008080"
            color="white"
            fontFamily="'EB Garamond', serif"
            display="flex"
            flexDirection="column"
            // Escritorio: panel a la derecha, de arriba abajo. Móvil: hoja desde abajo.
            top={{ base: "auto", md: 0 }}
            bottom={0}
            right={0}
            left={{ base: 0, md: "auto" }}
            w={{ base: "100%", md: "400px" }}
            maxH={{ base: "78vh", md: "100vh" }}
            h={{ base: "auto", md: "100vh" }}
            borderTop={{ base: "1px solid rgba(255,255,255,0.45)", md: "none" }}
            borderLeft={{ base: "none", md: "1px solid rgba(255,255,255,0.45)" }}
            borderRadius={{ base: "24px 24px 0 0", md: "0" }}
            boxShadow="0 0 40px rgba(255,255,255,0.18), 0 0 90px rgba(180,255,245,0.1)"
          >
            <Flex align="center" justify="space-between" gap={3} px={6} pt={6} pb={3}>
              <Box minW={0}>
                <Text fontSize="xl" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" textShadow="0 0 12px rgba(255,255,255,0.4)">
                  {maria ? "Nota" : t("metodo.notaMaria.titulo")}
                </Text>
                {maria && ctx.nombre && <Text fontSize="sm" opacity={0.8} fontStyle="italic" noOfLines={1}>para {ctx.nombre}</Text>}
              </Box>
              <Box
                as="button"
                type="button"
                onClick={() => setAbierto(false)}
                aria-label={t("metodo.notaMaria.cerrar")}
                w="36px"
                h="36px"
                borderRadius="full"
                border="1px solid rgba(255,255,255,0.5)"
                fontSize="xl"
                lineHeight="1"
                cursor="pointer"
                _hover={{ bg: "rgba(255,255,255,0.18)" }}
                _focusVisible={focoBlanco}
              >
                ×
              </Box>
            </Flex>
            <Box h="1px" mx={6} bg="rgba(255,255,255,0.35)" />

            <Box flex="1" overflowY="auto" px={6} py={5}>
              {!maria ? (
                <>
                  <Text fontSize="lg" lineHeight="1.7" whiteSpace="pre-wrap">{nota.publicada}</Text>
                  {nota.publicada_at && (
                    <Text fontSize="sm" opacity={0.7} fontStyle="italic" mt={4}>{fechaDMA(nota.publicada_at)}</Text>
                  )}
                </>
              ) : (
                <>
                  <Flex align="center" justify="space-between" gap={3} mb={3} wrap="wrap">
                    <Box
                      px={3}
                      py="3px"
                      borderRadius="full"
                      fontSize="sm"
                      fontWeight="600"
                      border="1px solid rgba(255,255,255,0.55)"
                      bg={estadoNota === "Publicada" ? "rgba(255,255,255,0.22)" : "rgba(255,231,189,0.14)"}
                    >
                      {estadoNota}
                    </Box>
                    <Text fontSize="sm" opacity={0.75} fontStyle="italic" role="status">
                      {estado === "guardando" ? "Guardando…" : estado === "guardado" ? "Guardado" : estado === "error" ? "Sin guardar" : ""}
                    </Text>
                  </Flex>
                  <Textarea
                    value={texto}
                    onChange={(e) => { setTexto(e.target.value); setAviso(null); }}
                    onBlur={() => { void guardar(); }}
                    placeholder="Escribe aquí. Nadie lo ve hasta que pulses «Publicar»."
                    aria-label="Nota para esta página"
                    autoFocus
                    rows={11}
                    resize="vertical"
                    bg="rgba(255,255,255,0.09)"
                    border="1px solid rgba(255,255,255,0.34)"
                    color="white"
                    borderRadius="20px"
                    fontFamily="'EB Garamond', serif"
                    fontSize="lg"
                    lineHeight="1.6"
                    px={5}
                    py={4}
                    _placeholder={{ color: "rgba(255,255,255,0.45)" }}
                    _hover={{ borderColor: "rgba(255,255,255,0.55)" }}
                    _focus={{ borderColor: "white", boxShadow: "0 0 0 2px rgba(255,255,255,0.55), 0 0 18px rgba(255,255,255,0.3)", outline: "none" }}
                    _focusVisible={{ borderColor: "white", boxShadow: "0 0 0 2px rgba(255,255,255,0.55), 0 0 18px rgba(255,255,255,0.3)", outline: "none" }}
                  />
                  {nota.sinTabla && (
                    <Text color="#ffe7bd" fontSize="sm" fontStyle="italic" mt={3}>
                      Falta crear la tabla de notas en la base de datos (backend/sql/nota-pagina.sql). Hasta entonces no se guarda nada.
                    </Text>
                  )}
                  {aviso && <Text role="alert" color="#ffe7bd" fontSize="sm" fontStyle="italic" mt={3}>{aviso}</Text>}
                  <Flex gap={3} mt={5} wrap="wrap">
                    {pildora(ocupado ? "Publicando…" : "Publicar", publicar, { solido: true, off: ocupado || !texto.trim() || (hayPublicada && nota.publicada === texto) })}
                    {hayPublicada && pildora("Quitar de su vista", retirar, { peligro: true, off: ocupado })}
                  </Flex>
                </>
              )}
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>
    </>
  );
}
