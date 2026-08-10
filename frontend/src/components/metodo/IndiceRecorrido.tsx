// ─────────────────────────────────────────────────────────────────────────
// IndiceRecorrido · botón flotante «☰ Índice» + popup con todas las páginas del
// recorrido, numeradas y pulsables. La página actual se detecta por la ruta y
// se resalta. Al pulsar una página, salta directamente.
//
// Se renderiza desde AyudaRecorrido (presente en todas las páginas), así que
// aparece en todo el recorrido sin tocar cada página.
// ─────────────────────────────────────────────────────────────────────────
import React, { useEffect, useState } from "react";
import { useT } from "../../i18n";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { comicLoaderPorColor } from "./comicLoaders";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { useRecorridoProgreso } from "../../hooks/useRecorridoProgreso";
import { useRecorridoAlcanzable } from "../../hooks/useRecorridoAlcanzable";
import { RECORRIDO_INDICE, RECORRIDO_TOTAL, pasoAlcanzablePsicologia, type PasoRecorrido } from "./psicologiaRecorrido";
import { flushSaves } from "../../utils/flushSaves";
import { API_URL, neuropsicologiaBg, neuropsicologiaNom, neuropsicologiaTxt } from "../../GlobalVariables";

const PAPEL = "#fbf4e8";

/** Un bloque del índice. Sirve para los recorridos de DOS NIVELES (ayurveda:
 *  el mapa común y el submapa de un doṣha): cada sección se pinta con su título
 *  y sus propias reglas, dentro del mismo popup. */
export interface SeccionIndice {
  /** Encabezado del bloque. Vacío = sin encabezado. */
  titulo: string;
  pasos: PasoRecorrido[];
  /** Id de recorrido con el que se construyen las rutas de ESTA sección (el
   *  doṣha, la experiencia…). Si no se pasa, el del componente. */
  expId?: string;
  /** false → la sección entera sale con candado y no navega. Es lo que hace que
   *  el submapa de un doṣha no sea pulsable mientras no estés dentro de uno. */
  habilitada?: boolean;
  /** Frase bajo el título cuando la sección no está habilitada («entra en un
   *  doṣha para abrir su recorrido»). */
  nota?: string;
  /** true → sin bloqueo secuencial: la sección se abre entera y solo respeta el
   *  flag `bloqueado` de cada paso. Lo usa el nivel neutral del mapa. */
  libre?: boolean;
}

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
  alcanzableUrl = (userId: string) => `${API_URL}/metodo-psicologia/${userId}`,
  alcanzableDe = pasoAlcanzablePsicologia,
  cargando = false,
  onOpen,
  secciones,
}: {
  /** Recorridos de DOS NIVELES: en vez de una lista plana, varios bloques con
   *  su título y sus reglas (ver SeccionIndice). Si se pasa, manda sobre
   *  `indice`. */
  secciones?: SeccionIndice[];
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
  /** Endpoint (por userId) del que leer los datos del recorrido para calcular la
   *  alcanzabilidad. Por defecto, el de psicología. */
  alcanzableUrl?: (userId: string) => string;
  /** Dado el `data` del recorrido y el id de recorrido, devuelve el paso máximo
   *  ALCANZABLE (respetando los requisitos de cada paso). Por defecto, psicología. */
  alcanzableDe?: (data: any, expId: string) => number;
  /** SOLO modo por flags (sin `progresoKey`): true mientras el padre aún está
   *  averiguando qué páginas están bloqueadas. Mientras es true (y el índice está
   *  abierto), se muestra la animación de espera de la disciplina en vez de la
   *  lista, para no enseñar los candados a medio calcular. */
  cargando?: boolean;
  /** SOLO modo por flags: se llama cada vez que se ABRE el índice. El padre lo
   *  usa para releer el progreso, para que lo que la usuaria acaba de responder
   *  en esta misma página ya cuente en los candados (si no, el índice enseñaría
   *  la foto del progreso de cuando cargó la página). */
  onOpen?: () => void;
} = {}) {
  const t = useT();
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

  // Un índice plano es, simplemente, una sección única sin título: así el resto
  // del componente trabaja SIEMPRE con secciones y no hay dos caminos de render.
  const grupos: SeccionIndice[] = secciones ?? [{ titulo: "", pasos: indice }];
  const idDe = (sec: SeccionIndice) => sec.expId ?? expId;

  // Página actual: la ruta más larga que casa con la URL, mirando TODAS las
  // secciones (la más larga, para que «/…/linea-de-Vida» no la robe la base).
  // Guardamos también en qué sección está: con dos niveles, el número de paso
  // por sí solo es ambiguo (hay un «1» en cada uno).
  const pathname = location.pathname.replace(/\/+$/, "");
  let actual: number | null = null;
  let actualGrupo: number | null = null;
  let mejorLargo = -1;
  grupos.forEach((sec, gi) => {
    sec.pasos.forEach((p) => {
      const r = p.ruta(idDe(sec)).replace(/\/+$/, "");
      if (r === pathname && r.length > mejorLargo) { mejorLargo = r.length; actual = p.n; actualGrupo = gi; }
    });
  });
  const esActual = (p: PasoRecorrido, gi: number) => actualGrupo === gi && p.n === actual;
  // El paso actual solo cuenta para el progreso SECUENCIAL si su sección lo usa
  // (la sección «libre» del mapa no debe tocar el progreso del submapa).
  const actualSecuencial =
    actualGrupo != null && !grupos[actualGrupo]?.libre && grupos[actualGrupo]?.habilitada !== false
      ? actual
      : null;

  // Bloqueo secuencial persistido en BD (solo si se pasa `progresoKey`).
  const { pasoMax, cargado: progresoCargado, avanzar } = useRecorridoProgreso(progresoKey);

  // «Hasta dónde puede llegar»: al abrir el Índice, leemos los datos del recorrido
  // y calculamos el paso máximo ALCANZABLE respetando los requisitos de cada paso.
  // Así el Índice abre las páginas a las que el usuario YA PUEDE llegar (no solo
  // las que ya ha visitado). Se carga perezosamente (solo con el popup abierto).
  const { maxAlcanzable, cargado: alcanzableCargado } = useRecorridoAlcanzable(
    open && !!progresoKey,
    alcanzableUrl,
    alcanzableDe,
    expId,
  );

  // ¿Seguimos AVERIGUANDO a qué páginas se puede llegar? Mientras sea así (y el
  // índice esté abierto), no enseñamos la lista con los candados a medio calcular:
  // mostramos la animación de espera de la disciplina.
  //   · Con `progresoKey` (psicología, ayurveda): hay que esperar al progreso
  //     secuencial (pasoMax) Y a la consulta de alcanzabilidad (perezosa, al abrir).
  //   · Sin él (astrología, cábala, nutrición…): lo dice el padre con `cargando`.
  const revisando = progresoKey ? (!progresoCargado || !alcanzableCargado) : cargando;

  // Al LLEGAR a una página (vía la navegación de la app), desbloquea ese paso y
  // todos los anteriores. Así la página actual nunca queda bloqueada, y el Índice
  // sigue bloqueando los pasos a los que aún no se ha llegado. La navegación
  // adelante de la app es la que va abriendo pasos; el Índice nunca deja saltar a
  // uno bloqueado (ir() lo impide).
  useEffect(() => {
    if (!progresoKey || !progresoCargado || actualSecuencial == null) return;
    if (actualSecuencial > pasoMax) avanzar(actualSecuencial);
  }, [progresoKey, progresoCargado, actualSecuencial, pasoMax, avanzar]);

  // ¿Está bloqueado el paso n? Con `progresoKey`: todo lo posterior al máximo
  // desbloqueado. Sin él: el flag `bloqueado` de la propia entrada (astrología).
  // IMPORTANTE: mientras el progreso aún NO ha cargado, tratamos como bloqueados
  // todos los pasos salvo la página actual, para no permitir saltar por el índice
  // (y romper el recorrido) en ese instante previo a conocer `pasoMax`.
  const estaBloqueado = (p: PasoRecorrido, sec: SeccionIndice, gi: number): boolean => {
    // Sección entera cerrada (el submapa de un doṣha visto desde fuera).
    if (sec.habilitada === false) return true;
    // Sección libre (el mapa común): solo su propio flag por paso.
    if (sec.libre) return !!p.bloqueado;
    // Modo por flags: la página en la que ESTÁS nunca sale con candado (estás
    // en ella; enseñarla bloqueada es mentir y además impide volver a ella).
    if (!progresoKey) return !!p.bloqueado && !esActual(p, gi);
    // Aún sin datos de progreso NI de alcanzabilidad: solo la actual abierta.
    if (!progresoCargado && maxAlcanzable == null) return !esActual(p, gi);
    // Techo abierto = lo más lejos entre: lo que YA PUEDE alcanzar por requisitos
    // (maxAlcanzable), lo ya visitado (pasoMax, para no re-bloquear) y la actual.
    const techo = Math.max(pasoMax, maxAlcanzable ?? 0, actualSecuencial ?? 0);
    return p.n > techo;
  };

  const ir = async (p: PasoRecorrido, sec: SeccionIndice, gi: number) => {
    if (estaBloqueado(p, sec, gi)) return; // página aún bloqueada: no navega
    setOpen(false);
    // Espera a que termine cualquier guardado en vuelo de la página actual antes
    // de saltar: si no, la página destino leería datos viejos y los pisaría.
    await flushSaves();
    navigate(p.ruta(idDe(sec)));
  };

  const totalPaginas = secciones
    ? grupos.reduce((a, s) => a + s.pasos.length, 0)
    : total;

  return (
    <>
      {/* Botón flotante (abajo a la izquierda, sobre «Mis notas») */}
      <Flex
        as="button"
        onClick={() => { setOpen(true); onOpen?.(); }}
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
        // Trazo más fino y algo apagado en móvil (ver «Mis notas» y «Agenda una
        // llamada», los otros dos flotantes: los tres van igual).
        border={{ base: `1px solid ${TINTA}80`, md: `2px solid ${TINTA}` }}
        boxShadow={`0 4px 20px rgba(0,0,0,0.28), 0 0 18px ${bg}66`}
        cursor="pointer"
        transition="all 0.22s ease"
        _hover={{ transform: "translateY(-2px)", boxShadow: `0 6px 28px rgba(0,0,0,0.35), 0 0 26px ${bg}aa` }}
        aria-label={t("metodo.abrirIndice")}
      >
        <DisciplinaBgLayer nom={nom} borderRadius="full" />
        <Box as="span" position="relative" zIndex={1} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1"
             style={{ textShadow: BTN_TEXT_SHADOW }}>☰</Box>
        <Text position="relative" zIndex={1} color={TINTA} fontFamily="'EB Garamond', serif" fontWeight="700"
              fontSize={{ base: "sm", md: "md" }} letterSpacing="0.06em" lineHeight="1"
              style={{ textShadow: BTN_TEXT_SHADOW }}>
          {t("metodo.indice")}
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

              {/* Mientras se averigua qué páginas están abiertas, solo la animación
                  de espera de la disciplina (nada de lista a medio calcular). */}
              {revisando ? (
                <Flex minH={{ base: "180px", md: "220px" }} align="center" justify="center">
                  {comicLoaderPorColor(TINTA)}
                </Flex>
              ) : (
              <>
              <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" textAlign="center" pr={6}>
                {t("metodo.indiceMapa")}
              </Text>
              <Box h="1px" w="55%" maxW="220px" mx="auto" my={5} bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />

              {grupos.map((sec, gi) => (
                <Box key={sec.titulo || gi} mt={gi === 0 ? 0 : 6}>
                  {/* Encabezado del bloque (solo en índices de dos niveles). */}
                  {sec.titulo && (
                    <Flex align="center" gap={3} mb={sec.habilitada === false && sec.nota ? 1.5 : 3}>
                      <Text color={TINTA} fontSize={{ base: "xs", md: "sm" }} fontWeight="700"
                            letterSpacing="0.16em" textTransform="uppercase" whiteSpace="nowrap"
                            opacity={sec.habilitada === false ? 0.7 : 1}>
                        {sec.titulo}
                      </Text>
                      <Box h="1px" flex="1" bgGradient={`linear(to-r, ${TINTA}55, transparent)`} />
                    </Flex>
                  )}
                  {sec.habilitada === false && sec.nota && (
                    <Text color={TINTA} fontSize="xs" fontStyle="italic" opacity={0.7} mb={3}>
                      {sec.nota}
                    </Text>
                  )}

                  <Box display="grid" gridTemplateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }} gap={{ base: 2.5, md: 3 }}>
                    {sec.pasos.map((p) => {
                      const activo = esActual(p, gi);
                      const bloqueado = estaBloqueado(p, sec, gi);
                      return (
                        <Flex key={p.n} as="button" onClick={() => ir(p, sec, gi)} disabled={bloqueado}
                              align="center" gap={3} textAlign="left" w="100%"
                              px={{ base: 3, md: 3.5 }} py={{ base: 2.5, md: 3 }} borderRadius="xl"
                              bg={activo ? ACENTO : "rgba(255,251,243,0.62)"}
                              border={`1.5px solid ${activo ? ACENTO : `${TINTA}2e`}`}
                              boxShadow="none"
                              opacity={bloqueado ? 0.5 : 1}
                              cursor={bloqueado ? "not-allowed" : "pointer"} transition="all 0.16s"
                              _hover={bloqueado ? undefined : { transform: "translateY(-1px)", bg: activo ? ACENTO : "rgba(255,251,243,0.82)" }}>
                          <Flex flexShrink={0} align="center" justify="center" w={{ base: "26px", md: "28px" }} h={{ base: "26px", md: "28px" }}
                                borderRadius="full" bg={activo ? PAPEL : ACENTO}
                                color={contraste(activo ? PAPEL : ACENTO)} fontWeight="700" fontSize={{ base: "xs", md: "sm" }}>
                            {p.n}
                          </Flex>
                          <Text flex="1" minW={0} color={activo ? contraste(ACENTO) : OSCURO} fontWeight={activo ? "700" : "600"}
                                fontSize={{ base: "sm", md: "md" }} lineHeight="1.25" noOfLines={1}
                                style={activo && contraste(ACENTO) === PAPEL ? { textShadow: "0 1px 2px rgba(0,0,0,0.3)" } : undefined}>
                            {/* En móvil, la versión corta del título si el paso la
                                trae (los largos se cortaban con noOfLines={1}). */}
                            <Box as="span" display={{ base: "none", md: "inline" }}>{p.titulo}</Box>
                            <Box as="span" display={{ base: "inline", md: "none" }}>{p.tituloCorto ?? p.titulo}</Box>
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
                </Box>
              ))}

              <Text color={TINTA} fontSize="xs" textAlign="center" opacity={0.6} mt={5}>
                {totalPaginas} páginas · pulsa una para ir
              </Text>
              </>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
