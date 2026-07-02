import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner,
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

/** Icono del diario (libro abierto). El color se adapta vía `fill`. */
function DiarioIcon({ fill = "currentColor", size = "24px" }: { fill?: string; size?: string }) {
  return (
    <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={size} h={size} fill={fill}>
      <path d="M480-160q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740v484q51-32 107-48t113-16q36 0 70.5 6t69.5 18v-480q15 5 29.5 10.5T898-752q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59Zm80-200v-380l200-200v400L560-360Zm-160 65v-396q-33-14-68.5-21.5T260-720q-37 0-72 7t-68 21v397q35-13 69.5-19t70.5-6q36 0 70.5 6t69.5 19Zm0 0v-396 396Z" />
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

interface Nota {
  id: string;
  contenido: string;
  categoria: string | null;
  created_at: string;
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

/** Botón flotante (abajo a la derecha) + popup del mini-diario. Se monta una
 *  sola vez a nivel de app y aparece en todas las páginas con sesión iniciada. */
export function MiniDiario() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [vista, setVista] = useState<"escribir" | "notas">("escribir");

  // Estado de escritura
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado de la lista
  const [notas, setNotas] = useState<Nota[]>([]);
  const [cargandoNotas, setCargandoNotas] = useState(false);

  const userId = sessionStorage.getItem("userId");

  const disciplinaSel = categoria ? disciplinaByKey(categoria) : undefined;

  // Disciplina de la página actual (astrología / psicología / ayurveda…), para
  // que el botón flotante adopte sus colores. Turquesa por defecto en el resto.
  const { pathname } = useLocation();
  const disciplinaRuta = useMemo(() => {
    const m = pathname.match(/\/(?:metodo|admin)\/([a-z]+)/i);
    return m ? disciplinaByKey(m[1].toLowerCase()) : undefined;
  }, [pathname]);
  const btnBg = disciplinaRuta?.bg ?? turquesa;
  const btnFg = disciplinaRuta?.txt ?? "#0f2f2c";
  const btnConImg = !!disciplinaRuta && hasDisciplinaBg(disciplinaRuta.nombre);

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

  // No mostramos el diario sin sesión (las notas son por usuario).
  if (!userId) return null;

  return (
    <>
      {/* ── Botón flotante abajo a la izquierda (fondo = img de la disciplina) ── */}
      <Flex
        as="button"
        onClick={onOpen}
        position="fixed"
        bottom={{ base: "18px", md: "26px" }}
        left={{ base: "16px", md: "26px" }}
        zIndex={1000}
        overflow="hidden"
        align="center"
        gap={{ base: 2, md: 3 }}
        pl={{ base: 3, md: 4 }}
        pr={{ base: 4, md: 6 }}
        py={{ base: "10px", md: "13px" }}
        borderRadius="full"
        bg={btnBg}
        border={`1.5px solid ${btnFg}66`}
        boxShadow="0 4px 20px rgba(0,0,0,0.28), 0 0 20px rgba(72,192,181,0.5)"
        cursor="pointer"
        transition="all 0.22s ease"
        _hover={{
          transform: "translateY(-2px)",
          boxShadow: "0 6px 28px rgba(0,0,0,0.35), 0 0 30px rgba(72,192,181,0.85)",
        }}
        _active={{ transform: "translateY(0)" }}
        aria-label="Abrir mis notas"
      >
        {btnConImg && <DisciplinaBgLayer nom={disciplinaRuta!.nombre} borderRadius="full" />}
        <Box
          flexShrink={0}
          position="relative"
          zIndex={1}
          w={{ base: "24px", md: "27px" }}
          h={{ base: "24px", md: "27px" }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <DiarioIcon fill={btnFg} size="100%" />
        </Box>
        <Text
          position="relative"
          zIndex={1}
          color={btnFg}
          fontFamily="'EB Garamond', serif"
          fontWeight="700"
          fontSize={{ base: "sm", md: "lg" }}
          letterSpacing="0.06em"
          lineHeight="1"
          style={{ textShadow: `0 1px 6px ${btnBg}cc` }}
        >
          Mis notas
        </Text>
      </Flex>

      {/* ── Popup ── */}
      <Modal isOpen={isOpen} onClose={cerrar} size="lg" isCentered scrollBehavior="inside">
        <ModalOverlay bg="rgba(0,0,0,0.72)" sx={{ backdropFilter: "blur(8px)" }} />
        <ModalContent
          bg="#008080"
          border="1px solid rgba(255,255,255,0.32)"
          borderRadius="2xl"
          boxShadow="0 16px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.15)"
          mx={{ base: 4, md: 0 }}
          fontFamily="'EB Garamond', serif"
          overflow="hidden"
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
            aria-label="Cerrar"
          >
            ✕
          </Box>

          <ModalBody px={{ base: 5, md: 8 }} py={{ base: 6, md: 8 }}>
            {vista === "escribir" ? (
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
  // Placeholder rotatorio entre los ejemplos, para que "vivan".
  const [ejIdx, setEjIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setEjIdx((i) => (i + 1) % EJEMPLOS.length), 3200);
    return () => clearInterval(t);
  }, []);

  const nom = disciplinaSel?.nombre;
  const txtColor = disciplinaSel?.txt ?? "white";
  const conFondo = !!nom && hasDisciplinaBg(nom);

  return (
    <Flex direction="column" gap={4}>
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
          ¿Qué quieres escribir?
        </Text>
      </Flex>

      {/* El "box" donde se escribe. Al elegir categoría, su fondo se transforma
          en la imagen de la disciplina (difuminada) y el texto toma su color. */}
      <Box
        position="relative"
        overflow="hidden"
        borderRadius="xl"
        minH={{ base: "150px", md: "170px" }}
        bg={disciplinaSel ? disciplinaSel.bg : "rgba(255,255,255,0.06)"}
        border="1px solid rgba(255,255,255,0.18)"
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
          ← Ver mis notas
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
  return (
    <Flex direction="column" gap={4}>
      <Flex align="center" justify="space-between" gap={3}>
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
          ← Volver a escribir
        </Box>
        <Text color="rgba(255,255,255,0.6)" fontSize="sm">
          {notas.length} {notas.length === 1 ? "nota" : "notas"}
        </Text>
      </Flex>

      {cargando ? (
        <Flex justify="center" py={10}>
          <Spinner color={turquesa} />
        </Flex>
      ) : notas.length === 0 ? (
        <Text color="rgba(255,255,255,0.6)" textAlign="center" py={10} fontStyle="italic">
          Todavía no has escrito ninguna nota.
        </Text>
      ) : (
        <Flex direction="column" gap={3} maxH="55vh" overflowY="auto" pr={1}>
          {notas.map((n) => (
            <NotaCard key={n.id} nota={n} onBorrar={onBorrar} />
          ))}
        </Flex>
      )}
    </Flex>
  );
}

function NotaCard({ nota, onBorrar }: { nota: Nota; onBorrar: (id: string) => void }) {
  const disc = nota.categoria ? disciplinaByKey(nota.categoria) : undefined;
  const nom = disc?.nombre;
  const conFondo = !!nom && hasDisciplinaBg(nom);
  const txtColor = disc?.txt ?? "white";

  return (
    <Box
      position="relative"
      overflow="hidden"
      borderRadius="xl"
      bg={disc ? disc.bg : "rgba(255,255,255,0.06)"}
      border="1px solid rgba(255,255,255,0.15)"
    >
      {conFondo && nom && <DisciplinaBgLayer nom={nom} borderRadius="xl" />}
      <Box position="relative" zIndex={1} px={4} py={3}>
        <Flex justify="space-between" align="center" mb={1.5} gap={2}>
          <Flex align="center" gap={2}>
            {disc && <disc.Icon size={{ base: "18px", md: "18px" }} />}
            <Text
              color={txtColor}
              fontSize="xs"
              fontWeight="700"
              letterSpacing="0.05em"
              textTransform="uppercase"
              opacity={0.9}
            >
              {disc?.nombre ?? "Sin clasificar"}
            </Text>
          </Flex>
          <Box
            as="button"
            onClick={() => onBorrar(nota.id)}
            color={`${txtColor}aa`}
            fontSize="sm"
            transition="all 0.18s"
            _hover={{ color: "#ffb4b4" }}
            aria-label="Borrar nota"
          >
            🗑
          </Box>
        </Flex>
        <Text
          color={txtColor}
          fontSize={{ base: "md", md: "md" }}
          lineHeight="1.6"
          whiteSpace="pre-wrap"
          sx={{ textShadow: conFondo ? "0 1px 8px rgba(0,0,0,0.35)" : "none" }}
        >
          {nota.contenido}
        </Text>
        <Text color={`${txtColor}99`} fontSize="xs" mt={2} fontStyle="italic">
          {fmtFecha(nota.created_at)}
        </Text>
      </Box>
    </Box>
  );
}
