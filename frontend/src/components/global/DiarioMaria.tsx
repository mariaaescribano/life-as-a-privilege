import React, { useCallback, useEffect, useState } from "react";
import { Box, Flex, Text, Textarea } from "@chakra-ui/react";
import axios from "axios";
import { API_URL } from "../../GlobalVariables";
import { LifeLoader } from "../metodo/comicLoaders";
import { focoBlanco } from "./foco";

/**
 * El DIARIO de María: lo que apunta de sí misma. SOLO lo ve ella (el servidor lo
 * comprueba: ninguna persona tiene ruta). Se escribe desde «Notas» (pestaña DIARIO) y
 * se lee en una caja del inicio de administración; las dos comparten estos datos.
 */
export interface EntradaMaria {
  id: string;
  contenido: string;
  created_at: string;
}

const TQ = "#004f4f";
const ORO = "#b08d3f";
/** Aviso entre la ventana de «Notas» y la caja del inicio: una nota nueva o borrada. */
const EVENTO = "diario-maria-cambio";

const fmtFecha = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
};

export function useDiarioMaria() {
  const [entradas, setEntradas] = useState<EntradaMaria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/diario-maria`);
      setEntradas(Array.isArray(data) ? data : []);
    } catch {
      setEntradas([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
    window.addEventListener(EVENTO, cargar);
    return () => window.removeEventListener(EVENTO, cargar);
  }, [cargar]);

  const crear = async (contenido: string): Promise<boolean> => {
    setError(null);
    try {
      const { data } = await axios.post(`${API_URL}/diario-maria`, { contenido });
      if (!data?.success) { setError(data?.error ?? "No se pudo guardar"); return false; }
      window.dispatchEvent(new Event(EVENTO));
      return true;
    } catch {
      setError("No se pudo guardar. Inténtalo de nuevo.");
      return false;
    }
  };

  const borrar = async (id: string) => {
    setEntradas((prev) => prev.filter((e) => e.id !== id)); // optimista
    try {
      await axios.delete(`${API_URL}/diario-maria/${id}`);
    } catch {
      /* si falla, la recarga deja el estado real */
    }
    window.dispatchEvent(new Event(EVENTO));
  };

  return { entradas, cargando, error, crear, borrar };
}

/** Una entrada del diario: tarjeta de mármol, letra turquesa oscuro. */
export function EntradaDiario({ e, onBorrar, plana = false }: { e: EntradaMaria; onBorrar: (id: string) => void; plana?: boolean }) {
  return (
    <Box
      position="relative"
      flexShrink={0}
      px={plana ? 1 : 4}
      py={plana ? 2 : 3}
      // Suelta (en el popup): su propia tarjeta de mármol. «plana» (dentro de la caja del inicio, que ya es mármol): sin fondo, con una raya fina.
      bgColor={plana ? "transparent" : "#efe5cf"}
      bgImage={plana ? undefined : "url('/img/fondos/marmolfondo.webp')"}
      bgSize="cover"
      bgPosition="center"
      border={plana ? "none" : `1px solid ${TQ}55`}
      borderBottom={plana ? `1px solid ${TQ}33` : undefined}
      borderRadius={plana ? "0" : "xl"}
      boxShadow={plana ? "none" : `0 0 14px ${ORO}2e`}
    >
      <Flex justify="space-between" align="flex-start" gap={3}>
        <Text color={TQ} fontSize={{ base: "lg", md: "xl" }} lineHeight="1.65" whiteSpace="pre-wrap"
              sx={{ overflowWrap: "anywhere", wordBreak: "break-word" }}>
          {e.contenido}
        </Text>
        <Box
          as="button"
          type="button"
          onClick={() => onBorrar(e.id)}
          flexShrink={0}
          w="26px"
          h="26px"
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color={`${TQ}aa`}
          fontSize="sm"
          lineHeight="1"
          transition="all 0.18s"
          _hover={{ color: "#9b2c2c", bg: `${TQ}14` }}
          _focusVisible={focoBlanco}
          aria-label="✕"
        >
          ✕
        </Box>
      </Flex>
      <Text color={`${TQ}99`} fontSize="xs" mt={2} fontStyle="italic">{fmtFecha(e.created_at)}</Text>
    </Box>
  );
}

/** La pestaña DIARIO dentro de «Notas»: escribir sobre una misma y ver lo apuntado. */
export function VistaDiarioMaria() {
  const { entradas, cargando, error, crear, borrar } = useDiarioMaria();
  const [texto, setTexto] = useState("");
  const [guardando, setGuardando] = useState(false);
  const puede = !!texto.trim() && !guardando;

  const guardar = async () => {
    if (!puede) return;
    setGuardando(true);
    if (await crear(texto)) setTexto("");
    setGuardando(false);
  };

  return (
    <Flex direction="column" gap={4} flex="1" minH={0} overflowY="auto" pr={1}
          sx={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.4) transparent",
                "&::-webkit-scrollbar": { width: "8px" }, "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.35)", borderRadius: "8px" } }}>
      <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight="800" letterSpacing="0.08em" textAlign="center" textTransform="uppercase">
        Diario
      </Text>

      <Box borderRadius="xl" overflow="hidden" flexShrink={0} minH={{ base: "150px", md: "170px" }}
           bgColor="#f2e9d9" bgImage="url('/img/fondos/marmolfondo.webp')" bgSize="cover" bgPosition="center"
           border={`1px solid ${TQ}55`} boxShadow={`0 0 18px ${ORO}33`}>
        <Textarea
          value={texto}
          onChange={(ev) => setTexto(ev.target.value)}
          placeholder="Hoy he sentido…"
          variant="unstyled"
          px={4}
          py={3}
          minH={{ base: "150px", md: "170px" }}
          color={TQ}
          fontSize={{ base: "md", md: "lg" }}
          lineHeight="1.7"
          resize="none"
          _placeholder={{ color: `${TQ}99`, fontStyle: "italic" }}
        />
      </Box>

      {error && <Text color="#ffb4b4" fontSize="sm" textAlign="center" fontStyle="italic">{error}</Text>}

      <Flex justify="flex-end">
        <Box
          as="button"
          type="button"
          onClick={guardar}
          px={9}
          py={2.5}
          borderRadius="full"
          bg="white"
          color="#008080"
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="700"
          letterSpacing="0.06em"
          cursor={puede ? "pointer" : "not-allowed"}
          opacity={puede ? 1 : 0.55}
          boxShadow="0 4px 24px rgba(255,255,255,0.28)"
          transition="all 0.22s"
          _hover={puede ? { transform: "translateY(-2px)" } : {}}
          _focusVisible={focoBlanco}
        >
          {guardando ? "Guardando…" : "Guardar"}
        </Box>
      </Flex>

      {cargando ? (
        <Flex justify="center" py={4}><LifeLoader color="#ffffff" size="40px" /></Flex>
      ) : (
        entradas.map((e) => <EntradaDiario key={e.id} e={e} onBorrar={borrar} />)
      )}
    </Flex>
  );
}


/** La lista completa del DIARIO (página /admin/mi-diario): las entradas, de la más reciente a la más antigua. */
export function ListaDiarioMaria() {
  const { entradas, cargando, borrar } = useDiarioMaria();
  return (
    <Flex direction="column" gap={4} w="100%">
      {cargando ? (
        <Flex justify="center" py={6}><LifeLoader color="#ffffff" size="48px" /></Flex>
      ) : entradas.length === 0 ? (
        <Text color="rgba(255,255,255,0.85)" fontSize="lg" fontStyle="italic" textAlign="center">Todavía no has apuntado nada.</Text>
      ) : (
        entradas.map((e) => <EntradaDiario key={e.id} e={e} onBorrar={borrar} />)
      )}
    </Flex>
  );
}

/** Lo último que apuntaste, para la tarjeta DIARIO del inicio (null si aún no hay nada). */
export function useUltimaEntradaDiario(): string | null {
  const { entradas } = useDiarioMaria();
  return entradas[0]?.contenido ?? null;
}
