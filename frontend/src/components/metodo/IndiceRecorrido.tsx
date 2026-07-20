// ─────────────────────────────────────────────────────────────────────────
// IndiceRecorrido · botón flotante «☰ Índice» + popup con todas las páginas del
// recorrido, numeradas y pulsables. La página actual se detecta por la ruta y
// se resalta. Al pulsar una página, salta directamente.
//
// Se renderiza desde AyudaRecorrido (presente en todas las páginas), así que
// aparece en todo el recorrido sin tocar cada página.
// ─────────────────────────────────────────────────────────────────────────
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { useRecorridoProgreso } from "../../hooks/useRecorridoProgreso";
import { RECORRIDO_INDICE, RECORRIDO_TOTAL, type PasoRecorrido } from "./psicologiaRecorrido";
import { neuropsicologiaBg, neuropsicologiaNom, neuropsicologiaTxt } from "../../GlobalVariables";

const PAPEL = "#fbf4e8";

// Botón + índice, reutilizable por cualquier disciplina. Por defecto usa el
// recorrido y los colores de psicología; pásale `indice`/`total` y los colores
// de otra disciplina para reutilizarlo (p. ej. astrología).
export function IndiceRecorrido({
  indice = RECORRIDO_INDICE,
  total = RECORRIDO_TOTAL,
  tinta = neuropsicologiaTxt,
  bg = neuropsicologiaBg,
  nom = neuropsicologiaNom,
  defaultExpId = "linea-de-Vida",
  paramKey = "experienciaId",
  acento,
  luz = true,
  progresoKey,
}: {
  indice?: PasoRecorrido[];
  total?: number;
  tinta?: string;
  bg?: string;
  nom?: string;
  defaultExpId?: string;
  /** Nombre del parámetro de ruta que identifica el recorrido (psicología usa
   *  «experienciaId»; ayurveda usa «dosha»). */
  paramKey?: string;
  /** Color de acento para resaltar la página actual y los números. Por defecto
   *  la propia tinta; ayurveda le pasa el color del dosha para diferenciarlo. */
  acento?: string;
  /** Si es false, el texto del botón «Índice» no lleva halo claro: usa una
   *  sombra tenue con el color de fondo (como «Mis notas»). Astrología lo pide. */
  luz?: boolean;
  /** Clave de disciplina para el bloqueo SECUENCIAL persistido en BD (p.ej.
   *  «psicologia»). Si se pasa, el Índice bloquea los pasos posteriores al máximo
   *  desbloqueado y va desbloqueando cada paso al llegar al siguiente. Si NO se
   *  pasa, se usa el flag `bloqueado` de cada entrada del índice (astrología). */
  progresoKey?: string;
} = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<Record<string, string>>();
  const [open, setOpen] = useState(false);
  useLockBodyScroll(open);

  const TINTA = tinta;
  const ACENTO = acento || tinta;

  // Contraste: algunas disciplinas tienen la «tinta» clara (astrología) y otras
  // oscura (psicología). Para que los números y títulos SIEMPRE se vean, elegimos
  // el color según la luminancia del fondo: sobre fondo claro → el color oscuro
  // de la disciplina (que suele ser su `bg`); sobre fondo oscuro → crema.
  const hexLum = (hex: string): number => {
    const h = (hex || "").replace("#", "");
    const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const r = parseInt(n.slice(0, 2), 16), g = parseInt(n.slice(2, 4), 16), b = parseInt(n.slice(4, 6), 16);
    return Number.isFinite(r + g + b) ? 0.299 * r + 0.587 * g + 0.114 * b : 128;
  };
  const OSCURO = hexLum(TINTA) <= hexLum(bg) ? TINTA : bg;
  const contraste = (fondo: string) => (hexLum(fondo) < 140 ? PAPEL : OSCURO);
  // Sombra del texto del botón flotante: por defecto un halo claro (PAPEL);
  // si `luz` es false, una sombra tenue con el fondo, igual que «Mis notas».
  const BTN_TEXT_SHADOW = luz ? `0 1px 6px ${PAPEL}` : `0 1px 6px ${bg}cc`;

  // El id del recorrido: el de la URL (según `paramKey`) o el por defecto.
  const expId = params[paramKey] || defaultExpId;

  // Página actual: la del índice cuya ruta coincide con la URL (la más larga
  // que casa, para que «/…/linea-de-Vida» no la robe la página base).
  const pathname = location.pathname.replace(/\/+$/, "");
  const actual = indice
    .filter((p) => p.ruta(expId).replace(/\/+$/, "") === pathname)
    .sort((a, b) => b.ruta(expId).length - a.ruta(expId).length)[0]?.n ?? null;

  // Bloqueo secuencial persistido en BD (solo si se pasa `progresoKey`).
  const { pasoMax, cargado: progresoCargado, avanzar } = useRecorridoProgreso(progresoKey);

  // Al LLEGAR a una página (vía la navegación de la app), desbloquea ese paso y
  // todos los anteriores. Así la página actual nunca queda bloqueada, y el Índice
  // sigue bloqueando los pasos a los que aún no se ha llegado. La navegación
  // adelante de la app es la que va abriendo pasos; el Índice nunca deja saltar a
  // uno bloqueado (ir() lo impide).
  useEffect(() => {
    if (!progresoKey || !progresoCargado || actual == null) return;
    if (actual > pasoMax) avanzar(actual);
  }, [progresoKey, progresoCargado, actual, pasoMax, avanzar]);

  // ¿Está bloqueado el paso n? Con `progresoKey`: todo lo posterior al máximo
  // desbloqueado. Sin él: el flag `bloqueado` de la propia entrada (astrología).
  // IMPORTANTE: mientras el progreso aún NO ha cargado, tratamos como bloqueados
  // todos los pasos salvo la página actual, para no permitir saltar por el índice
  // (y romper el recorrido) en ese instante previo a conocer `pasoMax`.
  const estaBloqueado = (p: PasoRecorrido): boolean => {
    if (!progresoKey) return !!p.bloqueado;
    if (!progresoCargado) return p.n !== actual; // aún cargando: solo la actual abierta
    return p.n > pasoMax;
  };

  const ir = (p: PasoRecorrido) => {
    if (estaBloqueado(p)) return; // página aún bloqueada: no navega
    setOpen(false);
    navigate(p.ruta(expId));
  };

  return (
    <>
      {/* Botón flotante (abajo a la izquierda, sobre «Mis notas») */}
      <Flex
        as="button"
        onClick={() => setOpen(true)}
        position="fixed"
        bottom={{ base: "74px", md: "88px" }}
        left={{ base: "16px", md: "26px" }}
        zIndex={1000}
        align="center"
        gap={2}
        pl={{ base: 3, md: 4 }}
        pr={{ base: 4, md: 5 }}
        py={{ base: "9px", md: "12px" }}
        borderRadius="full"
        overflow="hidden"
        border={`1.5px solid ${TINTA}`}
        boxShadow={`0 4px 20px rgba(0,0,0,0.28), 0 0 18px ${bg}66`}
        cursor="pointer"
        transition="all 0.22s ease"
        _hover={{ transform: "translateY(-2px)", boxShadow: `0 6px 28px rgba(0,0,0,0.35), 0 0 26px ${bg}aa` }}
        aria-label="Abrir índice del mapa"
      >
        <DisciplinaBgLayer nom={nom} borderRadius="full" />
        <Box as="span" position="relative" zIndex={1} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1"
             style={{ textShadow: BTN_TEXT_SHADOW }}>☰</Box>
        <Text position="relative" zIndex={1} color={TINTA} fontFamily="'EB Garamond', serif" fontWeight="700"
              fontSize={{ base: "sm", md: "md" }} letterSpacing="0.06em" lineHeight="1"
              style={{ textShadow: BTN_TEXT_SHADOW }}>
          Índice
        </Text>
      </Flex>

      {/* Popup con el índice */}
      {open && (
        <Box position="fixed" inset={0} zIndex={2500} display="flex" alignItems="center" justifyContent="center"
             px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }} bg="rgba(0,0,0,0.82)"
             sx={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
             onClick={() => setOpen(false)} fontFamily="'EB Garamond', serif" overflowY="auto">
          <Box onClick={(e: React.MouseEvent) => e.stopPropagation()} position="relative" w="100%" maxW="640px" my="auto"
               borderRadius="2xl" overflow="hidden" boxShadow={`0 30px 80px rgba(40,18,4,0.55)`}>
            <DisciplinaBgLayer nom={nom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 5, md: 9 }} py={{ base: 7, md: 9 }}
                 maxH={{ base: "calc(100vh - 64px)", md: "calc(100vh - 96px)" }} overflowY="auto"
                 sx={{ scrollbarWidth: "thin", "&::-webkit-scrollbar": { width: "8px" },
                       "&::-webkit-scrollbar-thumb": { background: `${TINTA}55`, borderRadius: "8px" } }}>
              <Box as="button" onClick={() => setOpen(false)} position="absolute" top={3} right={3} zIndex={2}
                   color={TINTA} display="flex" alignItems="center" justifyContent="center" fontSize="lg" lineHeight="1"
                   cursor="pointer" opacity={0.8} transition="all 0.15s"
                   _hover={{ opacity: 1, transform: "scale(1.12)" }}>✕</Box>

              <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" textAlign="center" pr={6}>
                Índice del mapa
              </Text>
              <Box h="1px" w="55%" maxW="220px" mx="auto" my={5} bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />

              <Box display="grid" gridTemplateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }} gap={{ base: 2.5, md: 3 }}>
                {indice.map((p) => {
                  const esActual = p.n === actual;
                  const bloqueado = estaBloqueado(p);
                  return (
                    <Flex key={p.n} as="button" onClick={() => ir(p)} disabled={bloqueado}
                          align="center" gap={3} textAlign="left" w="100%"
                          px={{ base: 3, md: 3.5 }} py={{ base: 2.5, md: 3 }} borderRadius="xl"
                          bg={esActual ? ACENTO : "rgba(255,251,243,0.62)"}
                          border={`1.5px solid ${esActual ? ACENTO : `${TINTA}2e`}`}
                          boxShadow="none"
                          opacity={bloqueado ? 0.5 : 1}
                          cursor={bloqueado ? "not-allowed" : "pointer"} transition="all 0.16s"
                          _hover={bloqueado ? undefined : { transform: "translateY(-1px)", bg: esActual ? ACENTO : "rgba(255,251,243,0.82)" }}>
                      <Flex flexShrink={0} align="center" justify="center" w={{ base: "26px", md: "28px" }} h={{ base: "26px", md: "28px" }}
                            borderRadius="full" bg={esActual ? PAPEL : ACENTO}
                            color={contraste(esActual ? PAPEL : ACENTO)} fontWeight="700" fontSize={{ base: "xs", md: "sm" }}>
                        {p.n}
                      </Flex>
                      <Text flex="1" minW={0} color={esActual ? contraste(ACENTO) : OSCURO} fontWeight={esActual ? "700" : "600"}
                            fontSize={{ base: "sm", md: "md" }} lineHeight="1.25" noOfLines={1}
                            style={esActual && contraste(ACENTO) === PAPEL ? { textShadow: "0 1px 2px rgba(0,0,0,0.3)" } : undefined}>
                        {p.titulo}
                      </Text>
                      {bloqueado && (
                        <Box as="svg" flexShrink={0} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                             w={{ base: "16px", md: "18px" }} h={{ base: "16px", md: "18px" }} fill={OSCURO} opacity={0.75}>
                          <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z" />
                        </Box>
                      )}
                    </Flex>
                  );
                })}
              </Box>

              <Text color={TINTA} fontSize="xs" textAlign="center" opacity={0.6} mt={5}>
                {total} páginas · pulsa una para ir
              </Text>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
