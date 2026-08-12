import React, { useEffect, useState } from "react";
import { useT } from "../../i18n";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Portal, Text, useBreakpointValue } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { IndiceAstrologia } from "../../components/metodo/IndiceAstrologia";
import { RecorridoLoading } from "../../components/metodo/RecorridoLoading";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { SpaceBg, SPACE_IMG } from "../../components/metodo/SpaceBg";
import { useImagesReady } from "../../hooks/useImagesReady";
import { Glifo } from "../../components/metodo/Glifo";
import { ComicAstrologiaModal } from "../../components/metodo/ComicAstrologiaModal";
import { cuerpoByKey, CUERPOS } from "../../components/metodo/astrologiaData";
import type { CartaNatal, Aspecto } from "../../components/metodo/CartaAstral3D/types";
import { COLOR_ASPECTO } from "../../components/metodo/CartaAstral3D/types";
import { ASPECTO_LABEL, ASPECTO_SYMBOL, aspectoKey } from "../../components/metodo/casasAspectos";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { useAstroLeidos } from "../../hooks/useAstroLeidos";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal, RevealStagger, RevealItem } from "../../components/global/Reveal";
import { API_URL, astrologiaBg, astrologiaNom, astrologiaTxt, AstrologiaIcon } from "../../GlobalVariables";

// Check pequeño para marcar un elemento ya leído.
const CheckIcon = ({ color, size = 14 }: { color: string; size?: number }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={`${size}px`} h={`${size}px`} fill={color}
       style={{ filter: `drop-shadow(0 0 4px ${color}aa)` }}>
    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
  </Box>
);

// Candado para los planetas aún bloqueados (desbloqueo secuencial).
const LockIcon = ({ color, size = 18 }: { color: string; size?: number }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={`${size}px`} h={`${size}px`} fill={color}
       style={{ filter: `drop-shadow(0 0 4px ${color}77)` }}>
    <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z" />
  </Box>
);

function renderParrafos(texto: string, color: string): React.ReactNode {
  return texto
    .split(/\n\s*\n+/g)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((parrafo, pi) => (
      <Text key={pi} color={`${color}ee`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8"
            whiteSpace="pre-wrap" mt={pi === 0 ? 0 : 3} style={{ textShadow: `0 0 8px ${color}33` }}>
        {parrafo.split(/(\*\*[^*]+\*\*)/g).map((parte, i) =>
          parte.startsWith("**") && parte.endsWith("**") ? (
            <span key={i} style={{ fontWeight: 700, color, textShadow: `0 0 8px ${color}55` }}>{parte.slice(2, -2)}</span>
          ) : (
            <React.Fragment key={i}>{parte}</React.Fragment>
          ),
        )}
      </Text>
    ));
}

interface Row {
  link_carta?: string | null;
  aspectos_texto?: Record<string, string> | null;
  casas_texto?: Record<string, string> | null;
  retos?: { id: string }[];
}

// Clave de "leído" ESPECÍFICA DEL BOX (planeta del box + aspecto). Cada aspecto
// une dos planetas y aparece en los dos boxes; con `aspectoKey` a secas, leerlo
// en el box del planeta A lo marcaba también como leído en el box del planeta B
// (que aún no se ha abierto), haciendo que el siguiente box apareciera con su
// primer aspecto ya leído. Prefijando la clave con el planeta del box, el
// usuario debe leer el aspecto en CADA box por separado.
const boxAspectoKey = (cuerpoKey: string, a: Aspecto): string => `${cuerpoKey}|${aspectoKey(a)}`;

export default function MetodoAstrologiaAspectos() {
  const t = useT();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [aspectos, setAspectos] = useState<Aspecto[]>([]);
  const [textos, setTextos] = useState<Record<string, string>>({});
  const [comicOpen, setComicOpen] = useState(false);
  const [abierto, setAbierto] = useState<Aspecto | null>(null);
  const [casasTexto, setCasasTexto] = useState<Record<string, string>>({});
  const { leidos, marcarLeido, cargado } = useAstroLeidos("aspectos");
  const fotosListas = useImagesReady([SPACE_IMG]);
  // En móvil el viewport es corto: si escalonamos los items con un `delay` fijo,
  // los de más abajo terminan su animación estando aún fuera de pantalla y, al
  // bajar, ya aparecen puestos (sin dinamismo). Por eso en móvil cada item se
  // anima por su PROPIA entrada en pantalla (delay 0); en desktop mantenemos el
  // escalonado en cascada, que ahí sí se ve bien.
  const esMovil = useBreakpointValue({ base: true, md: false }) ?? false;
  // Para bloquear la ENTRADA a Aspectos: hay que haber leído todas las casas.
  const { leidos: casasLeidos, cargado: cargadoCasas } = useAstroLeidos("casas");
  // …y también todos los Puntos clave (retos): es la precondición del paso
  // anterior (Casas), así que por URL directa tampoco se puede saltar.
  const { leidos: retosLeidos, cargado: cargadoRetos } = useAstroLeidos("retos");
  const [retos, setRetos] = useState<{ id: string }[]>([]);

  // Abre el aspecto (si su planeta está desbloqueado) y lo marca como leído
  // EN ESTE BOX (la clave lleva el planeta del box como prefijo).
  const abrirAspecto = (a: Aspecto, cuerpoKey: string) => {
    setAbierto(a);
    marcarLeido(boxAspectoKey(cuerpoKey, a));
  };

  // Bloquea el scroll del fondo mientras el popup está abierto (solo scrollea la tarjeta).
  useLockBodyScroll(!!abierto);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        const rowRes = await axios.get<Row | null>(`${API_URL}/metodo-astrologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Abierta si la carta está procesada (hay PDF O retos), igual que el
        // resto del recorrido. Es el GET quien decide: si hay info, se entra.
        const lista = Array.isArray(rowRes.data?.retos) ? rowRes.data!.retos! : [];
        if (!rowRes.data?.link_carta && lista.length === 0) { navigate("/metodo/astrologia"); return; }
        setRetos(lista);
        setTextos((rowRes.data?.aspectos_texto ?? {}) as Record<string, string>);
        setCasasTexto((rowRes.data?.casas_texto ?? {}) as Record<string, string>);

        const cartaRes = await axios.get<CartaNatal | null>(`${API_URL}/metodo-astrologia/carta-natal/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAspectos(cartaRes.data?.aspectos ?? []);
      } catch {
        setAspectos([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  // Bloqueo de ENTRADA: si no ha leído todas sus casas (con lectura escrita),
  // no puede estar en Aspectos (vale también para acceso directo por URL). Se le
  // devuelve a Casas. Esperamos a tener cargados los datos y los leídos.
  useEffect(() => {
    if (loading || !cargadoCasas || !cargadoRetos) return;
    // Si aún no ha leído todos sus Puntos clave, se le devuelve a Puntos clave.
    if (retos.length > 0 && !retos.every((r) => retosLeidos.has(r.id))) {
      navigate("/metodo/astrologia/lectura", { replace: true });
      return;
    }
    const casasEscritas = Array.from({ length: 12 }, (_, i) => String(i + 1))
      .filter((n) => (casasTexto[n] ?? "").trim().length > 0);
    if (casasEscritas.length > 0 && !casasEscritas.every((n) => casasLeidos.has(n))) {
      navigate("/metodo/astrologia/casas", { replace: true });
    }
  }, [loading, cargadoCasas, cargadoRetos, retos, retosLeidos, casasTexto, casasLeidos, navigate]);

  // Esperamos a que carguen los "leídos" de la BD (aspectos y casas) y, si aún
  // no ha leído todas sus casas, mostramos spinner mientras el efecto redirige.
  const retosCompletos = retos.length === 0 || retos.every((r) => retosLeidos.has(r.id));
  const casasEscritasGate = Array.from({ length: 12 }, (_, i) => String(i + 1))
    .filter((n) => (casasTexto[n] ?? "").trim().length > 0);
  const casasCompletas = casasEscritasGate.length === 0 || casasEscritasGate.every((n) => casasLeidos.has(n));
  if (loading || !cargado || !cargadoCasas || !cargadoRetos || !retosCompletos || !casasCompletas || !fotosListas) {
    return <RecorridoLoading />;
  }

  const headerNext = {
    label: "Tu carta en PDF →",
    onClick: () => navigate("/metodo/astrologia/pdf"),
  };

  const textoAbierto = abierto ? (textos[aspectoKey(abierto)] ?? "").trim() : "";

  // Agrupamos los aspectos por planeta. Cada aspecto une dos planetas, así que
  // aparece en los dos boxes (el del planeta A y el del B). Mantenemos el orden
  // canónico de CUERPOS y descartamos los planetas sin aspectos.
  const gruposBase = CUERPOS.map((c) => ({
    cuerpo: c,
    items: aspectos
      .filter((a) => a.a === c.key || a.b === c.key)
      .map((a) => ({ aspecto: a, otro: a.a === c.key ? a.b : a.a })),
  })).filter((g) => g.items.length > 0);

  // Desbloqueo secuencial POR PLANETA (box): el primero está abierto; cada
  // planeta se desbloquea cuando TODOS los aspectos del anterior están leídos.
  // Solo cuentan los aspectos con lectura escrita (los vacíos no bloquean, no
  // hay nada que leer). Al completar un planeta, se marca visualmente.
  let anterioresCompletas = true;
  const gruposPorPlaneta = gruposBase.map((g) => {
    // El box se completa cuando el usuario ha ABIERTO todos sus aspectos, uno a
    // uno (al abrir cualquiera —tenga o no lectura escrita— se marca leído). Se
    // cuentan TODOS los aspectos del box, no solo los que ya tienen texto: así
    // no sale "Completado" al llegar y el desbloqueo del siguiente planeta es
    // secuencial de verdad. `gruposBase` garantiza items.length > 0, de modo que
    // `every` nunca opera sobre un array vacío (evita el falso "completado").
    const completa = g.items.every(({ aspecto }) => leidos.has(boxAspectoKey(g.cuerpo.key, aspecto)));
    const desbloqueada = anterioresCompletas;
    anterioresCompletas = anterioresCompletas && completa;
    return { ...g, completa, desbloqueada, totalLeibles: g.items.length };
  });

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={6}>
          <Reveal direction="down" distance={16} duration={0.6} w="100%">
            <MetodoStepHeader
              icon={<AstrologiaIcon size={{ base: "40px", md: "52px" }} />}
              title="Aspectos"
              bgColor={`${astrologiaBg}dd`}
              color={astrologiaTxt}
              space
              step={{ current: 6, total: 9 }}
              mb={0}
              prev={{ label: "← Casas", onClick: () => navigate("/metodo/astrologia/casas") }}
              extra={{ label: "Ilustraciones", onClick: () => setComicOpen(true)}}
              next={headerNext}
            />
          </Reveal>

          {/* Título + subtítulo centrados */}
          <Reveal direction="up" distance={18} delay={0.12} duration={0.6}
                  display="flex" flexDirection="column" alignItems="center" textAlign="center" mb={{ base: 2, md: 4 }}>
            {/* Sin sombra: el texto de debajo del header va sobre el fondo limpio. */}
            <Text color={astrologiaTxt} fontSize={{ base: "md", md: "lg" }} mb={2} fontStyle="italic"
                  letterSpacing="0.04em">
              {t("metodo.astro.aspectosPulsa")}
            </Text>
            {/* <Text color={`${astrologiaTxt}cc`} fontSize={{ base: "sm", md: "md" }} maxW="560px">
              Cada aspecto es una conversación entre dos planetas. Pulsa para leer.
            </Text> */}
          </Reveal>

          {aspectos.length === 0 ? (
            <Text color={`${astrologiaTxt}aa`} fontStyle="italic" textAlign="center" py={6}>
              No hay aspectos calculados todavía.
            </Text>
          ) : (
            <RevealStagger w="100%" display="flex" flexDirection="column" gap={{ base: 5, md: 6 }}
                           stagger={0.1} delayChildren={0.25} inView={false}>
              {gruposPorPlaneta.map(({ cuerpo, items, desbloqueada, completa }, gi) => {
                const anterior = gi > 0 ? gruposPorPlaneta[gi - 1].cuerpo.label : null;
                return (
                <RevealItem key={cuerpo.key} direction="up" distance={28} scaleFrom={0.97} duration={0.65}>
                <Box
                  position="relative"
                  borderRadius="2xl"
                  overflow="hidden"
                  boxShadow={`0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${astrologiaTxt}1a, 0 0 48px ${astrologiaTxt}10`}
                  opacity={desbloqueada ? 1 : 0.55}
                  transition="opacity 0.25s, box-shadow 0.25s"
                >
                  {/* Fondo de astrología (estrellado) sin blur, recortado sin deformar */}
                  <DisciplinaBgLayer nom={astrologiaNom} borderRadius="2xl" overlay="rgba(8,13,30,0.58)" />

                  <Box position="relative" zIndex={1} px={{ base: 4, md: 5 }} py={{ base: 5, md: 6 }}>
                    {/* Cabecera del planeta */}
                    <Flex align="center" justify="center" gap={3} mb={2}>
                      <Glifo symbol={cuerpo.symbol} color={cuerpo.color} size={36} />
                      <Text color={cuerpo.color} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700"
                            letterSpacing="0.03em" style={{ textShadow: `0 0 12px ${cuerpo.color}66` }}>
                        {cuerpo.label}
                      </Text>
                      {completa && (
                        <Flex align="center" gap={1} px={2.5} py={1} borderRadius="full"
                              bg={`${cuerpo.color}22`} border={`1px solid ${cuerpo.color}66`} ml={1}>
                          <CheckIcon color={cuerpo.color} size={12} />
                          <Text color={cuerpo.color} fontSize="2xs" fontWeight="700" letterSpacing="0.1em" textTransform="uppercase">
                            Completado
                          </Text>
                        </Flex>
                      )}
                      {!desbloqueada && <LockIcon color={`${astrologiaTxt}bb`} size={20} />}
                    </Flex>
                    {!desbloqueada && anterior && (
                      <Text color={`${astrologiaTxt}aa`} fontSize={{ base: "2xs", md: "xs" }} textAlign="center" mb={2}
                            fontStyle="italic" letterSpacing="0.04em">
                        Termina de leer los aspectos de <b>{anterior}</b> para desbloquear este planeta.
                      </Text>
                    )}
                    <Box h="1px" mb={4} bgGradient={`linear(to-r, transparent, ${cuerpo.color}55, transparent)`} />

                    {/* Aspectos de este planeta — el box se adapta a su contenido */}
                    <Flex direction="column" gap={2.5}>
                        {items.map(({ aspecto, otro }, idx) => {
                          const co = cuerpoByKey(otro);
                          const colorAsp = COLOR_ASPECTO[aspecto.tipo];
                          const escrito = (textos[aspectoKey(aspecto)] ?? "").trim().length > 0;
                          // Leído = el usuario ya lo abrió (persiste en la BD vía
                          // marcarLeido). En cuanto lo lee mostramos el acento de
                          // color a la izquierda + el check, tenga o no lectura
                          // escrita, para que vea de un vistazo lo que ya ha leído.
                          const leido = leidos.has(boxAspectoKey(cuerpo.key, aspecto));
                          return (
                            // Cada aspecto se revela al asomar en pantalla: aparecen
                            // de uno en uno según haces scroll (rueda o dedo).
                            <Reveal
                              key={`${aspectoKey(aspecto)}-${idx}`}
                              inView
                              direction="up"
                              distance={24}
                              duration={0.55}
                              delay={esMovil ? 0 : idx * 0.05}
                              amount={0.3}
                              w="100%"
                            >
                            <Flex
                              as="button"
                              onClick={desbloqueada ? () => abrirAspecto(aspecto, cuerpo.key) : undefined}
                              disabled={!desbloqueada}
                              position="relative"
                              w="100%"
                              align="center"
                              gap={{ base: 2, md: 3 }}
                              px={{ base: 3, md: 4 }}
                              py={{ base: 2.5, md: 3 }}
                              borderRadius="lg"
                              bg={leido ? "rgba(8,13,30,0.28)" : "rgba(8,13,30,0.4)"}
                              border={`1px solid ${colorAsp}44`}
                              borderLeft={leido ? `3px solid ${colorAsp}` : `1px solid ${colorAsp}44`}
                              boxShadow={`0 0 10px ${colorAsp}1a`}
                              cursor={desbloqueada ? "pointer" : "not-allowed"}
                              flexShrink={0}
                              opacity={leido ? 0.82 : !escrito ? 0.6 : 1}
                              transition="all 0.18s"
                              _hover={desbloqueada ? {
                                bg: "rgba(8,13,30,0.55)",
                                borderColor: `${colorAsp}88`,
                                boxShadow: `0 0 18px ${colorAsp}44`,
                                transform: "translateY(-1px)",
                                opacity: 1,
                              } : {}}
                            >
                              {leido && (
                                <Box position="absolute" top={{ base: 1, md: 1.5 }} right={{ base: 1.5, md: 2 }}
                                     title="Ya leído" pointerEvents="none">
                                  <CheckIcon color={colorAsp} size={13} />
                                </Box>
                              )}
                              {/* Planeta del box (este) — ancho fijo para que todos
                                  empiecen en el mismo sitio */}
                              <Flex align="center" gap={2.5} flexShrink={0}>
                                <Glifo symbol={cuerpo.symbol} color={cuerpo.color} size={30} />
                                <Text display={{ base: "none", md: "block" }} w={{ md: "120px" }} flexShrink={0}
                                      color={`${cuerpo.color}ee`} fontSize="md" fontWeight="600" noOfLines={1}
                                      style={{ textShadow: `0 0 8px ${cuerpo.color}55` }}>
                                  {cuerpo.label}
                                </Text>
                              </Flex>

                              {/* Aspecto: símbolo + nombre con ancho fijo, para que
                                  queden siempre en la misma posición */}
                              <Flex align="center" gap={2} justify="center" flex="1" minW={0}>
                                <Text w="28px" textAlign="center" flexShrink={0} fontSize={{ base: "xl", md: "2xl" }}
                                      color={colorAsp} fontFamily="'Times New Roman', serif"
                                      style={{ filter: `drop-shadow(0 0 6px ${colorAsp}aa)`, lineHeight: 1 }}>
                                  {ASPECTO_SYMBOL[aspecto.tipo]}
                                </Text>
                                <Text w={{ md: "110px" }} flexShrink={0} fontSize={{ base: "2xs", md: "sm" }}
                                      color={`${colorAsp}dd`} letterSpacing="0.08em"
                                      textTransform="uppercase" whiteSpace="nowrap">
                                  {ASPECTO_LABEL[aspecto.tipo]}
                                </Text>
                              </Flex>

                              {/* Otro planeta — ancho fijo, alineado */}
                              <Flex align="center" gap={2.5} flexShrink={0}>
                                {co && <Glifo symbol={co.symbol} color={co.color} size={30} />}
                                {co && (
                                  <Text display={{ base: "none", md: "block" }} w={{ md: "120px" }} flexShrink={0}
                                        color={`${co.color}ee`} fontSize="md" fontWeight="600" noOfLines={1}
                                        style={{ textShadow: `0 0 8px ${co.color}55` }}>
                                    {co.label}
                                  </Text>
                                )}
                              </Flex>
                            </Flex>
                            </Reveal>
                          );
                        })}
                    </Flex>
                  </Box>
                </Box>
                </RevealItem>
                );
              })}
            </RevealStagger>
          )}
        </Flex>
      </Flex>

      {/* ── POPUP del aspecto ── */}
      {abierto && (() => {
        const cuerpoA = cuerpoByKey(abierto.a);
        const cuerpoB = cuerpoByKey(abierto.b);
        const colorAsp = COLOR_ASPECTO[abierto.tipo];
        return (
          <Portal>
          <Box
            position="fixed" inset={0} zIndex={2000}
            display="flex" alignItems="center" justifyContent="center"
            px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }}
            bg="rgba(0,0,0,0.82)"
            sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
            onClick={() => setAbierto(null)}
            fontFamily="'EB Garamond', serif"
          >
            <Box
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              position="relative" w="100%" maxW="620px"
              // Mismo tamaño fijo que el resto de popups del recorrido (620×560
              // en escritorio); el contenido que sobra hace scroll dentro. Móvil
              // (sin h en base) igual que antes: crece con el contenido hasta maxH.
              h={{ md: "560px" }}
              maxH={{ base: "calc(100vh - 48px)", md: "calc(100vh - 80px)" }}
              borderRadius="2xl" overflow="hidden"
              border={`1px solid ${colorAsp}66`}
              boxShadow={`0 0 32px ${colorAsp}55, 0 0 80px ${colorAsp}28, 0 12px 60px rgba(0,0,0,0.6)`}
              display="flex" flexDirection="column"
            >
              <SpaceBg overlay="rgba(8,13,30,0.74)" />

              <Box as="button" onClick={() => setAbierto(null)} position="absolute" top={3} right={3} zIndex={3}
                   w="36px" h="36px" borderRadius="full" display="flex" alignItems="center" justifyContent="center"
                   bg="rgba(0,0,0,0.6)" border={`1px solid ${colorAsp}66`} color={colorAsp} cursor="pointer"
                   _hover={{ bg: "rgba(0,0,0,0.85)", borderColor: colorAsp }}>
                <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14" fill="currentColor">
                  <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
              </Box>

              <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}
                   flex="1 1 auto" minH={0}
                   overflowY="auto" overscrollBehavior="contain"
                   sx={{ "&::-webkit-scrollbar": { width: "8px" }, "&::-webkit-scrollbar-thumb": { background: `${colorAsp}55`, borderRadius: "8px" } }}>
                <Flex align="center" justify="center" gap={3} mb={5} flexWrap="wrap">
                  {cuerpoA && <Glifo symbol={cuerpoA.symbol} color={cuerpoA.color} size={34} />}
                  <Text fontSize="2xl" color={colorAsp} fontFamily="'Times New Roman', serif"
                        style={{ filter: `drop-shadow(0 0 8px ${colorAsp}aa)` }}>
                    {ASPECTO_SYMBOL[abierto.tipo]}
                  </Text>
                  {cuerpoB && <Glifo symbol={cuerpoB.symbol} color={cuerpoB.color} size={34} />}
                </Flex>
                <Text color={colorAsp} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" textAlign="center" mb={4}
                      letterSpacing="0.04em" style={{ textShadow: `0 0 12px ${colorAsp}66` }}>
                  {cuerpoA?.label} {ASPECTO_LABEL[abierto.tipo].toLowerCase()} {cuerpoB?.label}
                </Text>

                {/* línea separadora con el color del aspecto */}
                <Box h="1px" mb={5} bgGradient={`linear(to-r, transparent, ${colorAsp}66, transparent)`} />

                {textoAbierto ? (
                  renderParrafos(textoAbierto, astrologiaTxt)
                ) : (
                  <Text color={`${astrologiaTxt}aa`} fontStyle="italic" textAlign="center" fontSize={{ base: "md", md: "lg" }}>
                    Aún no he escrito la lectura de este aspecto. Estará disponible pronto.
                  </Text>
                )}
              </Box>
            </Box>
          </Box>
          </Portal>
        );
      })()}

      <ComicAstrologiaModal isOpen={comicOpen} onClose={() => setComicOpen(false)} />
      <BotonCompania color={astrologiaTxt} bgColor={astrologiaBg} disciplinaNom={astrologiaNom} precio={20} llamadaTitulo="Reserva tu llamada de astrología" />
      <IndiceAstrologia />
      <SiteFooter />
    </Box>
  );
}
