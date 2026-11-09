import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL, turquesa } from "../../GlobalVariables";
import { ADMIN_DISCIPLINAS, disciplinaByKey } from "../../data/adminDisciplinas";
import { DisciplinaBgLayer, hasDisciplinaBg } from "./DisciplinaBgLayer";
import { LifeLoader } from "../metodo/comicLoaders";
import { useT } from "../../i18n";
import { focoBlanco } from "./foco";
import { personaActiva, esMariaMirando } from "../../api/persona";
import { useNotaPagina, NotaPaginaContenido } from "./NotaPagina";
import { VistaDiarioMaria } from "./DiarioMaria";

const MARMOL_ESCRIBIR = "/img/fondos/marmolfondo.webp";
let marmolListo: Promise<void> | null = null;
/** Carga el mármol de la caja donde se escribe. El popup NO se abre hasta que está cargado (con un tope de
 *  5 s por si la red falla: mejor abrir sin él que no abrir). Se guarda la promesa: solo se pide una vez. */
function precargarMarmol(): Promise<void> {
  if (!marmolListo) {
    marmolListo = new Promise<void>((ok) => {
      const img = new window.Image();
      const fin = () => ok();
      img.onload = fin;
      img.onerror = fin;
      img.src = MARMOL_ESCRIBIR;
      window.setTimeout(fin, 5000);
    });
  }
  return marmolListo;
}

/** Icono del diario (libro abierto). El color se adapta vía `fill`.
 *  Exportado: lo usa también el pin de «Mis notas» del /home. */
export function DiarioIcon({ fill = "currentColor", size = "24px" }: { fill?: string; size?: string }) {
  return (
    <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" w={size} h={size} fill={fill}>
      <path d="M8,20q-0.82,0-1.41-0.59T6,18V15H9V12.75Q8.13,12.7 7.34,12.36T5.9,11.35v-1.1H4.75L1.5,7Q2.4,5.85 3.73,5.38T6.4,4.9Q7.08,4.9 7.71,5T9,5.38V4H21V17q0,1.25-0.88,2.13T18,20H8Zm3-5h6v2q0,0.43 0.29,0.71T18,18t0.71-0.29Q19,17.43 19,17V6H11V6.6l6,6V14H15.6l-2.85-2.85l-0.2,0.2q-0.35,0.35-0.74,0.63T11,12.4V15ZM5.6,8.25H7.9V10.4q0.3,0.2 0.63,0.28T9.2,10.75q0.57,0 1.04-0.18t0.91-0.63l0.2-0.2l-1.4-1.4Q9.23,7.63 8.33,7.26T6.4,6.9q-0.5,0-0.95,0.07T4.55,7.2L5.6,8.25ZM15,17H8v1h7.15q-0.07-0.23-0.11-0.48T15,17ZM8,18q0-0.23 0-0.48T8,17q0,0.25 0,0.5T8,18Z" />
    </Box>
  );
}

// ── Ejemplos que inspiran al usuario (se pueden pulsar para arrancar) ──
const EJEMPLOS = [
  "Me acabo de acordar de esto…",
  "Hoy he sentido…",
  "Quiero recordar que…",
  "Me ha resonado esta idea…",
];

export interface Nota {
  id: string;
  contenido: string;
  categoria: string | null;
  created_at: string;
  /** Quién la escribió: 'maria', o null/ausente si fue la propia persona. */
  autor?: string | null;
}

const fmtFecha = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

/** «Notas»: el bloc que comparten María y la persona (los dos escriben y ven lo
 *  mismo). Botón flotante abajo a la izquierda, siempre en el mismo sitio, + popup.
 *  Se monta una sola vez a nivel de app. */
export function MiniDiario() {
  const t = useT();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [vista, setVista] = useState<"escribir" | "notas" | "pagina" | "diario">("escribir");
  // Abierto desde el botón «Diario» (solo María): el popup es solo su DIARIO, sin pestañas.
  const [soloDiario, setSoloDiario] = useState(false);
  // La nota de María de ESTA página (vive aquí dentro, en su propia pestaña del popup).
  const np = useNotaPagina();

  // Estado de escritura
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado de la lista
  const [notas, setNotas] = useState<Nota[]>([]);
  const [cargandoNotas, setCargandoNotas] = useState(false);

  const userId = localStorage.getItem("userId");
  // María, mirando: con el panel desbloqueado O dentro del camino de una persona (ahí `isAdmin` no está
  // puesto, pero el servidor la reconoce por X-Persona). Tiene además el botón «Diario» y el del correo.
  const esMaria = esMariaMirando();

  const disciplinaSel = categoria ? disciplinaByKey(categoria) : undefined;

  const { pathname } = useLocation();

  // El mármol se pide en cuanto aparece el botón, para que al pulsar ya esté (y el popup salga al momento).
  useEffect(() => { void precargarMarmol(); }, []);

  const resetEscritura = () => {
    setTexto("");
    setCategoria(null);
    setError(null);
  };

  const cerrar = () => {
    onClose();
    // Deja el estado listo para la próxima vez
    setTimeout(() => {
      setVista("escribir");
      setSoloDiario(false);
      resetEscritura();
    }, 200);
  };

  const cargarNotas = async () => {
    if (!userId) return;
    setCargandoNotas(true);
    try {
      const { data } = await axios.get(`${API_URL}/notas/${userId}`);
      setNotas(Array.isArray(data) ? data : []);
    } catch {
      setNotas([]);
    } finally {
      setCargandoNotas(false);
    }
  };

  // Quien tiene una nota nueva de María en esta página, al abrir va derecho a ella.
  const abrir = async () => {
    if (np.visible && np.sinLeer) { setVista("pagina"); np.marcarVista(); }
    await precargarMarmol();
    onOpen();
  };

  const abrirDiario = async () => {
    setSoloDiario(true);
    setVista("diario");
    await precargarMarmol();
    onOpen();
  };

  const irANotas = () => {
    setVista("notas");
    cargarNotas();
  };

  const guardar = async () => {
    if (!userId || !texto.trim() || guardando) return;
    setGuardando(true);
    setError(null);
    try {
      const { data } = await axios.post(`${API_URL}/notas/${userId}`, {
        contenido: texto.trim(),
        categoria,
      });
      if (data?.success) {
        resetEscritura();
        irANotas(); // muestra la nota recién guardada arriba del todo
      } else {
        setError(data?.error ?? "No se pudo guardar la nota");
      }
    } catch {
      setError("No se pudo guardar la nota. Inténtalo de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  const borrar = async (id: string) => {
    if (!userId) return;
    setNotas((prev) => prev.filter((n) => n.id !== id)); // optimista
    try {
      await axios.delete(`${API_URL}/notas/${userId}/${id}`);
    } catch {
      cargarNotas(); // si falla, recargamos el estado real
    }
  };

  // No mostramos el bloc sin sesión (las notas son de una persona), ni a la admin
  // sin persona abierta (`userId` «admin»: no hay a quién escribirle).
  if (!userId || userId === "admin") return null;
  // «Notas» está en /home y dentro de El Recorrido (/metodo/...), siempre en el
  // mismo sitio. En la web pública y el panel /admin no se muestra.
  if (!/^\/(home|metodo)(\/|$)/i.test(pathname)) return null;

  return (
    <>
      {/* ── Botón flotante abajo a la DERECHA, siempre en el mismo sitio. Del color
          del fondo de la web (el turquesa), con letra e icono blancos y un halo de
          luz (la casa se define con luz, no con sombra). Encima de él se apilan
          «¿Qué es esto?» / «Agenda una llamada» y la barra de María. ── */}
      <Flex
        as="button"
        onClick={abrir}
        position="fixed"
        bottom={{ base: "18px", md: "26px" }}
        right={{ base: "16px", md: "26px" }}
        zIndex={1000}
        align="center"
        gap={{ base: 2, md: 3 }}
        pl={{ base: 3, md: 4 }}
        pr={{ base: 4, md: 6 }}
        py={{ base: "10px", md: "13px" }}
        borderRadius="full"
        bg="#008080"
        border={{ base: "1.5px solid rgba(255,255,255,0.8)", md: "2px solid rgba(255,255,255,0.9)" }}
        boxShadow="0 0 18px rgba(255,255,255,0.28), 0 0 40px rgba(180,255,245,0.14)"
        cursor="pointer"
        transition="all 0.22s ease"
        _hover={{
          transform: "translateY(-2px)",
          boxShadow: "0 0 26px rgba(255,255,255,0.45), 0 0 54px rgba(180,255,245,0.22)",
        }}
        _active={{ transform: "translateY(0)" }}
        _focusVisible={focoBlanco}
        aria-label={t("diario.abrir")}
      >
        <Box
          flexShrink={0}
          w={{ base: "24px", md: "27px" }}
          h={{ base: "24px", md: "27px" }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <DiarioIcon fill="white" size="100%" />
        </Box>
        <Text
          color="white"
          fontFamily="'EB Garamond', serif"
          fontWeight="700"
          fontSize={{ base: "sm", md: "lg" }}
          letterSpacing="0.06em"
          lineHeight="1"
        >
          {t("diario.titulo")}
        </Text>
        {np.visible && np.sinLeer && (
          <Box as="span" w="9px" h="9px" borderRadius="full" bg="#ffe7bd" boxShadow="0 0 10px #ffe7bd" aria-hidden />
        )}
      </Flex>

      {/* ── «Correo»: solo María, encima de «Diario». Abre el editor del resumen de sesión en OTRA pestaña,
          para ir preparándolo sin cerrar la página en la que está con la persona. ── */}
      {esMaria && (
        <Flex
          as="button"
          onClick={() => window.open(`/admin/asesorias/${userId}/correo`, "_blank", "noopener")}
          position="fixed"
          bottom={{ base: "198px", md: "246px" }}
          right={{ base: "16px", md: "26px" }}
          zIndex={1000}
          align="center"
          gap={{ base: 2, md: 3 }}
          pl={{ base: 3, md: 4 }}
          pr={{ base: 4, md: 6 }}
          py={{ base: "10px", md: "13px" }}
          borderRadius="full"
          bg="#008080"
          border={{ base: "1.5px solid rgba(255,255,255,0.8)", md: "2px solid rgba(255,255,255,0.9)" }}
          boxShadow="0 0 18px rgba(255,255,255,0.28), 0 0 40px rgba(180,255,245,0.14)"
          cursor="pointer"
          transition="all 0.22s ease"
          _hover={{ transform: "translateY(-2px)", boxShadow: "0 0 26px rgba(255,255,255,0.45), 0 0 54px rgba(180,255,245,0.22)" }}
          _active={{ transform: "translateY(0)" }}
          _focusVisible={focoBlanco}
          aria-label="Correo"
        >
          <Box as="svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" flexShrink={0} w={{ base: "24px", md: "27px" }} h={{ base: "24px", md: "27px" }}>
            <rect x="3" y="5" width="18" height="14" rx="2.2" />
            <path d="M3.6 6.8 12 13l8.4-6.2" />
          </Box>
          <Text color="white" fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "lg" }} letterSpacing="0.06em" lineHeight="1">
            Correo
          </Text>
        </Flex>
      )}

      {/* ── «Diario»: solo María, justo encima de «Notas» (y de la barra de compañía). Escribe en su DIARIO. ── */}
      {esMaria && (
        <Flex
          as="button"
          onClick={abrirDiario}
          position="fixed"
          bottom={{ base: "140px", md: "172px" }}
          right={{ base: "16px", md: "26px" }}
          zIndex={1000}
          align="center"
          gap={{ base: 2, md: 3 }}
          pl={{ base: 3, md: 4 }}
          pr={{ base: 4, md: 6 }}
          py={{ base: "10px", md: "13px" }}
          borderRadius="full"
          bg="#008080"
          border={{ base: "1.5px solid rgba(255,255,255,0.8)", md: "2px solid rgba(255,255,255,0.9)" }}
          boxShadow="0 0 18px rgba(255,255,255,0.28), 0 0 40px rgba(180,255,245,0.14)"
          cursor="pointer"
          transition="all 0.22s ease"
          _hover={{ transform: "translateY(-2px)", boxShadow: "0 0 26px rgba(255,255,255,0.45), 0 0 54px rgba(180,255,245,0.22)" }}
          _active={{ transform: "translateY(0)" }}
          _focusVisible={focoBlanco}
          aria-label="Diario"
        >
          <Box flexShrink={0} w={{ base: "24px", md: "27px" }} h={{ base: "24px", md: "27px" }} display="flex" alignItems="center" justifyContent="center">
            <Box as="svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" w="100%" h="100%">
              <path d="M6.5 3.5h11a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19V5a1.5 1.5 0 0 1 1.5-1.5Z" />
              <path d="M9 3.5v17" />
              <path d="M12.6 9.2c0-1 .8-1.7 1.7-1.7s1.7.7 1.7 1.7c0 1.4-1.7 2.4-1.7 2.4s-1.7-1-1.7-2.4Z" />
            </Box>
          </Box>
          <Text color="white" fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "lg" }} letterSpacing="0.06em" lineHeight="1">
            Diario
          </Text>
        </Flex>
      )}

      {/* ── Popup ── */}
      <Modal isOpen={isOpen} onClose={cerrar} size="lg" isCentered scrollBehavior="inside">
        <ModalOverlay bg="rgba(0,0,0,0.82)" sx={{ backdropFilter: "blur(8px)" }} />
        <ModalContent
          bg="#008080"
          border="1px solid rgba(255,255,255,0.32)"
          borderRadius="2xl"
          boxShadow="0 16px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.15)"
          mx={{ base: 4, md: 0 }}
          fontFamily="'EB Garamond', serif"
          overflow="hidden"
          // Altura MÁXIMA (no fija): el box se ajusta a su contenido (termina
          // justo debajo de "Guardar nota", sin hueco vacío) y solo llega a este
          // tope cuando hay muchas notas — entonces la lista hace scroll vertical
          // dentro sin crecer más el box.
          maxH={{ base: "min(86dvh, 600px)", md: "min(88dvh, 640px)" }}
        >
          {/* Botón X para cerrar (arriba a la derecha) */}
          <Box
            as="button"
            onClick={cerrar}
            position="absolute"
            top={3}
            right={3}
            zIndex={2}
            w="34px"
            h="34px"
            borderRadius="full"
            bg="rgba(0,0,0,0.15)"
            border="1px solid rgba(255,255,255,0.5)"
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="md"
            lineHeight="1"
            cursor="pointer"
            transition="all 0.18s"
            _hover={{ bg: "rgba(255,255,255,0.22)", borderColor: "white" }}
            aria-label={t("comun.cerrar")}
          >
            ✕
          </Box>

          <ModalBody
            px={{ base: 5, md: 8 }}
            py={{ base: 6, md: 8 }}
            flex="1"
            minH={0}
            display="flex"
            flexDirection="column"
            overflow="hidden"
          >
            {/* Pestañas: «Notas» y, si la página tiene nota de María, su nota (siempre para ella);
                y DIARIO, solo para María. */}
            {np.visible && !soloDiario && (
              <Flex gap={2} mb={4} justify="center" flexShrink={0} wrap="wrap">
                {([
                  ...[["escribir", t("diario.titulo")]],
                  ...(np.visible ? [["pagina", np.maria ? "Nota" : t("metodo.notaMaria.titulo")]] : []),
                ] as [("escribir" | "pagina"), string][]).map(([v, etiqueta]) => {
                  const activa = v === "escribir" ? vista === "escribir" || vista === "notas" : vista === v;
                  return (
                    <Box
                      key={v}
                      as="button"
                      type="button"
                      onClick={() => { if (v === "pagina") { setVista("pagina"); np.marcarVista(); } else setVista(v); }}
                      display="inline-flex"
                      alignItems="center"
                      gap={2}
                      px={4}
                      py="5px"
                      borderRadius="full"
                      border="1.5px solid rgba(255,255,255,0.75)"
                      bg={activa ? "white" : "rgba(255,255,255,0.12)"}
                      color={activa ? "#008080" : "white"}
                      fontWeight="700"
                      fontSize="sm"
                      letterSpacing="0.04em"
                      cursor="pointer"
                      transition="all 0.2s"
                      _focusVisible={focoBlanco}
                    >
                      {etiqueta}
                      {v === "pagina" && np.sinLeer && !activa && (
                        <Box as="span" w="8px" h="8px" borderRadius="full" bg="#ffe7bd" boxShadow="0 0 8px #ffe7bd" aria-hidden />
                      )}
                    </Box>
                  );
                })}
              </Flex>
            )}
            {soloDiario && esMaria ? (
              <VistaDiarioMaria />
            ) : vista === "pagina" && np.visible ? (
              <>
                {np.maria && np.nombre && (
                  <Text fontSize="sm" opacity={0.8} fontStyle="italic" textAlign="center" mb={3} noOfLines={1}>para {np.nombre}</Text>
                )}
                <NotaPaginaContenido n={np} />
              </>
            ) : vista === "escribir" || vista === "pagina" ? (
              <VistaEscribir
                texto={texto}
                setTexto={setTexto}
                categoria={categoria}
                setCategoria={setCategoria}
                disciplinaSel={disciplinaSel}
                guardando={guardando}
                error={error}
                onGuardar={guardar}
                onVerNotas={irANotas}
              />
            ) : (
              <VistaNotas
                notas={notas}
                cargando={cargandoNotas}
                onVolver={() => setVista("escribir")}
                onBorrar={borrar}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

// ─────────────────────────── Vista: Escribir ───────────────────────────

function VistaEscribir({
  texto,
  setTexto,
  categoria,
  setCategoria,
  disciplinaSel,
  guardando,
  error,
  onGuardar,
  onVerNotas,
}: {
  texto: string;
  setTexto: (v: string) => void;
  categoria: string | null;
  setCategoria: (v: string | null) => void;
  disciplinaSel: ReturnType<typeof disciplinaByKey>;
  guardando: boolean;
  error: string | null;
  onGuardar: () => void;
  onVerNotas: () => void;
}) {
  const t = useT();
  // Placeholder rotatorio entre los ejemplos, para que "vivan".
  const [ejIdx, setEjIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setEjIdx((i) => (i + 1) % EJEMPLOS.length), 3200);
    return () => clearInterval(t);
  }, []);

  const nom = disciplinaSel?.nombre;
  // Sin disciplina elegida, el box de escribir va sobre el mármol (horizontal) con letra turquesa oscuro.
  const marmol = !disciplinaSel;
  const txtColor = disciplinaSel?.txt ?? "#004f4f";
  const conFondo = !!nom && hasDisciplinaBg(nom);

  return (
    <Flex
      direction="column"
      gap={4}
      flex="1"
      minH={0}
      overflowY="auto"
      pr={1}
      sx={{
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255,255,255,0.4) transparent",
        "&::-webkit-scrollbar": { width: "8px" },
        "&::-webkit-scrollbar-track": { background: "transparent" },
        "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.35)", borderRadius: "8px" },
        "&::-webkit-scrollbar-thumb:hover": { background: "rgba(255,255,255,0.55)" },
      }}
    >
      <Flex align="center" justify="center" gap={2.5}>
        <Box w={{ base: "26px", md: "30px" }} h={{ base: "26px", md: "30px" }} flexShrink={0}>
          <DiarioIcon fill="white" size="100%" />
        </Box>
        <Text
          color="white"
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="800"
          letterSpacing="0.04em"
          textAlign="center"
          style={{ textShadow: "1px 2px 12px rgba(255,255,255,0.2)" }}
        >
          {t("diario.escribir")}
        </Text>
      </Flex>

      {/* El "box" donde se escribe. Al elegir categoría, su fondo se transforma
          en la imagen de la disciplina (difuminada) y el texto toma su color. */}
      <Box
        position="relative"
        overflow="hidden"
        borderRadius="xl"
        minH={{ base: "150px", md: "170px" }}
        bg={disciplinaSel ? disciplinaSel.bg : "#f2e9d9"}
        bgImage={marmol ? "url('/img/fondos/marmolfondo.webp')" : undefined}
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        border={marmol ? "1px solid #004f4f55" : "1px solid rgba(255,255,255,0.18)"}
        boxShadow={marmol ? "0 0 18px #b08d3f33" : undefined}
        transition="background 0.4s ease"
      >
        {conFondo && nom && <DisciplinaBgLayer nom={nom} borderRadius="xl" />}
        <Box position="relative" zIndex={1} h="100%">
          <Textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder={EJEMPLOS[ejIdx]}
            variant="unstyled"
            px={4}
            py={3}
            minH={{ base: "150px", md: "170px" }}
            color={txtColor}
            fontSize={{ base: "md", md: "lg" }}
            lineHeight="1.7"
            resize="none"
            _placeholder={{ color: `${txtColor}99`, fontStyle: "italic" }}
            sx={{ textShadow: conFondo ? "0 1px 8px rgba(0,0,0,0.35)" : "none" }}
          />
        </Box>
      </Box>

      {/* Ejemplos pulsables */}
      <Flex gap={2} wrap="wrap">
        {EJEMPLOS.map((ej) => (
          <Box
            key={ej}
            as="button"
            onClick={() => setTexto(texto ? texto : ej + " ")}
            px={3}
            py={1}
            borderRadius="full"
            bg="rgba(255,255,255,0.08)"
            border="1px solid rgba(255,255,255,0.18)"
            color="rgba(255,255,255,0.75)"
            fontSize="xs"
            fontStyle="italic"
            transition="all 0.18s"
            _hover={{ bg: "rgba(255,255,255,0.16)", color: "white" }}
          >
            {ej}
          </Box>
        ))}
      </Flex>

      {/* Selector de las 8 disciplinas */}
      <Box>
        <Text color="rgba(255,255,255,0.7)" fontSize="sm" mb={2} letterSpacing="0.03em">
          Clasifícala en una disciplina
          {disciplinaSel && (
            <Text as="span" color={turquesa} fontWeight="700">
              {"  ·  " + disciplinaSel.nombre}
            </Text>
          )}
        </Text>
        <Flex gap={2} wrap="wrap">
          {ADMIN_DISCIPLINAS.map((d) => {
            const activa = categoria === d.key;
            return (
              <Tooltip key={d.key} label={d.nombre} placement="top" hasArrow>
                <Flex
                  as="button"
                  onClick={() => setCategoria(activa ? null : d.key)}
                  position="relative"
                  overflow="hidden"
                  align="center"
                  justify="center"
                  w="46px"
                  h="46px"
                  borderRadius="lg"
                  bg={d.bg}
                  border={activa ? "2.5px solid white" : "1px solid rgba(255,255,255,0.35)"}
                  boxShadow={activa ? "0 0 14px rgba(255,255,255,0.65)" : "none"}
                  opacity={activa ? 1 : 0.9}
                  transition="all 0.18s"
                  _hover={{ transform: "translateY(-2px)", opacity: 1 }}
                  aria-label={d.nombre}
                >
                  {hasDisciplinaBg(d.nombre) && <DisciplinaBgLayer nom={d.nombre} borderRadius="lg" />}
                  <Box position="relative" zIndex={1} display="flex" alignItems="center" justifyContent="center">
                    <d.Icon size={{ base: "22px", md: "22px" }} />
                  </Box>
                </Flex>
              </Tooltip>
            );
          })}
        </Flex>
      </Box>

      {error && (
        <Text color="#ffb4b4" fontSize="sm" textAlign="center" fontStyle="italic">
          {error}
        </Text>
      )}

      {/* Acciones */}
      <Flex justify="space-between" align="center" mt={1} gap={3} wrap="wrap">
        <Box
          as="button"
          onClick={onVerNotas}
          color="rgba(255,255,255,0.9)"
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="600"
          letterSpacing="0.04em"
          borderBottom="1px solid transparent"
          transition="all 0.18s"
          _hover={{ color: "white", borderBottom: "1px solid white" }}
        >
          {t("diario.verNotas")}
        </Box>
        <Box
          as="button"
          onClick={texto.trim() && !guardando ? onGuardar : undefined}
          px={9}
          py={2.5}
          borderRadius="full"
          bg="white"
          color="#008080"
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="700"
          letterSpacing="0.06em"
          cursor={texto.trim() && !guardando ? "pointer" : "not-allowed"}
          opacity={texto.trim() && !guardando ? 1 : 0.55}
          boxShadow="0 4px 24px rgba(255,255,255,0.28)"
          transition="all 0.22s"
          _hover={texto.trim() && !guardando ? { transform: "translateY(-2px)", boxShadow: "0 8px 32px rgba(255,255,255,0.4)" } : {}}
        >
          {guardando ? "Guardando…" : "Guardar nota"}
        </Box>
      </Flex>
    </Flex>
  );
}

// ─────────────────────────── Vista: Mis notas ───────────────────────────

function VistaNotas({
  notas,
  cargando,
  onVolver,
  onBorrar,
}: {
  notas: Nota[];
  cargando: boolean;
  onVolver: () => void;
  onBorrar: (id: string) => void;
}) {
  const t = useT();
  return (
    <Flex direction="column" gap={4} flex="1" minH={0}>
      <Flex align="center" gap={3} flexShrink={0}>
        <Box
          as="button"
          onClick={onVolver}
          color="white"
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="700"
          letterSpacing="0.04em"
          transition="all 0.18s"
          _hover={{ color: turquesa }}
        >
          {t("diario.volverEscribir")}
        </Box>
      </Flex>

      {cargando ? (
        <Flex justify="center" align="center" flex="1" minH={0}>
          <LifeLoader color="#ffffff" size="56px" />
        </Flex>
      ) : notas.length === 0 ? (
        <Flex justify="center" align="center" flex="1" minH={0}>
          <Text color="rgba(255,255,255,0.6)" textAlign="center" fontStyle="italic">
            {t("diario.vacio")}
          </Text>
        </Flex>
      ) : (
        <Flex
          direction="column"
          gap={3}
          flex="1"
          minH={0}
          overflowY="auto"
          pr={2}
          sx={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.4) transparent",
            "&::-webkit-scrollbar": { width: "8px" },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.35)", borderRadius: "8px" },
            "&::-webkit-scrollbar-thumb:hover": { background: "rgba(255,255,255,0.55)" },
          }}
        >
          {notas.map((n) => (
            <NotaCard key={n.id} nota={n} onBorrar={onBorrar} />
          ))}
        </Flex>
      )}
    </Flex>
  );
}

export function NotaCard({ nota, onBorrar }: { nota: Nota; onBorrar: (id: string) => void }) {
  const t = useT();
  const disc = nota.categoria ? disciplinaByKey(nota.categoria) : undefined;
  const nom = disc?.nombre;
  const conFondo = !!nom && hasDisciplinaBg(nom);
  // Sin disciplina: mármol de fondo y letra turquesa oscuro (sin etiqueta).
  const txtColor = disc?.txt ?? "#004f4f";
  // Quién la escribió: las de María llevan su nombre; si es María quien mira, las
  // de la persona llevan el suyo. Si ve la persona sus propias notas, ninguno.
  const persona = personaActiva();
  const autor = nota.autor === "maria" ? "María" : persona ? persona.name : localStorage.getItem("name");

  return (
    <Box
      position="relative"
      flexShrink={0}
      overflow="hidden"
      borderRadius="xl"
      bg={disc ? disc.bg : "#efe5cf"}
      bgImage={disc ? undefined : "url('/img/fondos/marmolfondo.webp')"}
      bgSize="cover"
      bgPosition="center"
      border={disc ? "1px solid rgba(255,255,255,0.15)" : "1px solid #004f4f55"}
    >
      {conFondo && nom && <DisciplinaBgLayer nom={nom} borderRadius="xl" />}
      <Box position="relative" zIndex={1} px={4} py={3}>
        <Flex justify={disc ? "space-between" : "flex-end"} align="center" mb={1.5} gap={2}>
          {disc && (
            <Flex align="center" gap={2}>
              <disc.Icon size={{ base: "18px", md: "18px" }} />
              <Text
                color={txtColor}
                fontSize="xs"
                fontWeight="700"
                letterSpacing="0.05em"
                textTransform="uppercase"
                opacity={0.9}
              >
                {disc.nombre}
              </Text>
            </Flex>
          )}
          <Box
            as="button"
            onClick={() => onBorrar(nota.id)}
            flexShrink={0}
            w="26px"
            h="26px"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color={`${txtColor}aa`}
            fontSize="sm"
            lineHeight="1"
            transition="all 0.18s"
            _hover={{ color: disc ? "#ffb4b4" : "#9b2c2c", bg: `${txtColor}1a` }}
            aria-label={t("diario.borrarNota")}
          >
            ✕
          </Box>
        </Flex>
        <Text
          color={txtColor}
          fontSize={{ base: "lg", md: "xl" }}
          lineHeight="1.65"
          whiteSpace="pre-wrap"
          sx={{ textShadow: conFondo ? "0 1px 8px rgba(0,0,0,0.35)" : "none", overflowWrap: "anywhere", wordBreak: "break-word" }}
        >
          {autor && <Text as="span" fontWeight="700">{autor} - </Text>}
          {nota.contenido}
        </Text>
        <Text color={`${txtColor}99`} fontSize="xs" mt={2} fontStyle="italic">
          {fmtFecha(nota.created_at)}
        </Text>
      </Box>
    </Box>
  );
}
