import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { useTusCelulas } from "../../components/metodo/TusCelulasModal";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal } from "../../components/global/Reveal";
import { FichaExploraModal } from "../../components/metodo/FichaExploraModal";
import { ComicTemaModal } from "../../components/metodo/ComicTemaModal";
import { VolverFisio } from "../../components/metodo/VolverFisio";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { API_URL, fisiologiaBg, fisiologiaNom, fisiologiaTxt, FisiologiaIcon, noSelectSx} from "../../GlobalVariables";
import { temaByKey, PROFUNDIZA_LEIDAS_KEY, type Ficha, type TemaProfundiza } from "../../hardCoded/espacio/ProfundizaFisiologia";

// Tarjeta de una ficha (neurotransmisor, hormona…): imagen + nombre. Rejilla de 3.
function FichaBox({ ficha, temaColor, active, leido = false, onClick, coloreado }: {
  ficha: Ficha; temaColor: string; active: boolean; leido?: boolean; onClick: () => void; coloreado?: boolean;
}) {
  const [imgErr, setImgErr] = useState(false);
  const accent = ficha.color || temaColor;
  return (
    <Box
      as="button"
      onClick={onClick}
      position="relative"
      overflow="hidden"
      w="100%"
      h="100%"
      borderRadius="2xl"
      border={coloreado ? `1px solid ${active ? accent : `${accent}66`}` : "none"}
      cursor="pointer"
      fontFamily="'EB Garamond', serif"
      transition="all 0.2s ease"
      boxShadow={coloreado
        ? (active
            ? `0 6px 24px rgba(0,0,0,0.3), 0 0 26px ${accent}, 0 0 14px ${accent}88`
            : `0 4px 16px rgba(0,0,0,0.22), 0 0 16px ${accent}55`)
        : (active
            ? "0 6px 24px rgba(0,0,0,0.3), 0 0 24px rgba(255,255,255,0.35)"
            : "0 4px 16px rgba(0,0,0,0.22), 0 0 14px rgba(255,255,255,0.12)")}
      _hover={{ transform: "translateY(-4px)",
                ...(coloreado ? { borderColor: accent } : {}),
                boxShadow: coloreado
                  ? `0 10px 30px rgba(0,0,0,0.32), 0 0 24px ${accent}`
                  : "0 10px 30px rgba(0,0,0,0.32), 0 0 22px rgba(255,255,255,0.35)" }}
      _active={{ transform: "translateY(-1px)" }}
      // Solo en temas NO coloreados (todos menos Neurotransmisores y Hormonas):
      // al hacer hover, encender un brillo INTERIOR del color propio de la caja.
      sx={!coloreado ? { "&:hover .fichaGlowInset": { opacity: 1 } } : undefined}
    >
      <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />

      {/* Brillo interior (por dentro) del color de la caja, solo al hover.
          Va sobre el fondo pero bajo el contenido (el texto se lee igual). */}
      {!coloreado && (
        <Box className="fichaGlowInset" position="absolute" inset={0} borderRadius="2xl"
             pointerEvents="none" zIndex={1} opacity={0} transition="opacity 0.25s ease"
             boxShadow={`inset 0 0 30px ${accent}aa, inset 0 0 12px ${accent}66`} />
      )}

      {/* Sello de "ficha ya leída" */}
      {leido && (
        <Flex position="absolute" top="9px" right="9px" zIndex={2} align="center" justify="center"
              w="24px" h="24px" borderRadius="full" bg={fisiologiaTxt}
              boxShadow={`0 0 10px ${fisiologiaTxt}, 0 1px 4px rgba(0,0,0,0.5)`}>
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="14px" h="14px" fill="#1a1226">
            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
          </Box>
        </Flex>
      )}

      <Flex position="relative" zIndex={1} direction="column" align="center" gap={{ base: 2.5, md: 3 }}
            p={{ base: 4, md: 5 }} h="100%">
        <Box w="100%" aspectRatio={1} borderRadius="xl" overflow="hidden" flexShrink={0}
             bg={`${accent}22`}
             border={coloreado ? `1px solid ${accent}66` : "none"}
             boxShadow={coloreado ? `0 0 12px ${accent}55` : "0 0 12px rgba(255,255,255,0.12)"}
             display="flex" alignItems="center" justifyContent="center">
          {ficha.foto && !imgErr ? (
            <Image src={encodeURI(ficha.foto)} alt={ficha.nombre} w="100%" h="100%" objectFit="cover"
                   onError={() => setImgErr(true)} />
          ) : (
            <Text color={fisiologiaTxt} fontWeight="800" fontSize={{ base: "3xl", md: "4xl" }}
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>
              {ficha.nombre.charAt(0)}
            </Text>
          )}
        </Box>
        {ficha.eyebrow && (
          <Text color={accent} fontSize="3xs" fontWeight={700} letterSpacing="0.12em" textTransform="uppercase"
                textAlign="center" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.7)" }}>
            {ficha.eyebrow}
          </Text>
        )}
        <Text color={fisiologiaTxt} fontWeight="700" lineHeight="1.2" textAlign="center"
              fontSize={{ base: "md", md: "lg" }} letterSpacing="0.02em"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.65)" }}>
          {ficha.nombre}
        </Text>
      </Flex>
    </Box>
  );
}

export default function MetodoFisiologiaTema() {
  const navigate = useNavigate();
  const { temaKey } = useParams<{ temaKey: string }>();
  const [loading, setLoading] = useState(true);
  const [ficha, setFicha] = useState<Ficha | null>(null);
  const [leidas, setLeidas] = useState<Set<string>>(new Set());
  const [comicAbierto, setComicAbierto] = useState(false);
  const { extra: celulasBtn, modal: celulasModal } = useTusCelulas();
  const dataRef = useRef<Record<string, any>>({});

  const tema: TemaProfundiza | undefined = temaByKey(temaKey || "");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!tema) { navigate("/metodo/fisiologia/profundiza", { replace: true }); return; }
    (async () => {
      try {
        let testEnabled = false;
        try { const t = await axios.get(`${API_URL}/payment/test/enabled`); testEnabled = !!t.data?.enabled; } catch { /* */ }
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.fisiologia_suscrito && !testEnabled) { navigate("/metodo/fisiologia"); return; }

        // Cargamos las fichas ya leídas de este tema (para los checks).
        try {
          const r = await axios.get(`${API_URL}/metodo-fisiologia/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          dataRef.current = r.data?.data ?? {};
          const mapa = dataRef.current?.[PROFUNDIZA_LEIDAS_KEY] ?? {};
          const arr: string[] = Array.isArray(mapa?.[temaKey || ""]) ? mapa[temaKey || ""] : [];
          if (arr.length) setLeidas(new Set(arr));
        } catch { /* sin fila todavía */ }

        // No mostramos la página hasta que TODAS las fotos de las fichas estén
        // descargadas: así la página y las fotos aparecen a la vez, nunca una
        // rejilla que se rellena de golpe. (onerror también cuenta, no se cuelga.)
        await precargarImagenes((tema?.fichas ?? []).map((f) => (f.foto ? encodeURI(f.foto) : null)));
      } catch { navigate("/metodo/fisiologia"); return; }
      finally { setLoading(false); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, temaKey]);

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  if (!tema) return null;

  const tieneComic = (tema.comicIntro?.length ?? 0) > 0;
  const tieneFichas = tema.fichas.length > 0;

  // Abre una ficha y la marca como leída (se guarda en BD). Se usa tanto al
  // pulsar la caja como al navegar con las flechas dentro del modal.
  const verFicha = (f: Ficha) => {
    setFicha(f);
    if (leidas.has(f.key)) return;
    const next = new Set(leidas);
    next.add(f.key);
    setLeidas(next);
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    const mapa = { ...(dataRef.current?.[PROFUNDIZA_LEIDAS_KEY] ?? {}) };
    mapa[tema.key] = Array.from(next);
    const data = { ...dataRef.current, [PROFUNDIZA_LEIDAS_KEY]: mapa };
    dataRef.current = data;
    axios.patch(`${API_URL}/metodo-fisiologia/${userId}`, { data }, {
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => { /* se reintenta la próxima vez */ });
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif" sx={noSelectSx}>
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1100px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
              title={tema.label}
              compact
              bgColor={`${fisiologiaBg}dd`}
              color={fisiologiaTxt}
              nom={fisiologiaNom}
              mb={0}
              prev={{ label: "← Volver", onClick: () => navigate("/metodo/fisiologia/profundiza") }}
              extra={celulasBtn}
            />
          </Reveal>

          {tema.intro && (
            <Reveal direction="up" distance={18} delay={0.12} duration={0.6} w="100%" display="flex" justifyContent="center">
              <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "md", md: "lg" }} fontStyle="italic"
                    textAlign="center" lineHeight="1.8" maxW="660px"
                    style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
                {tema.intro}
              </Text>
            </Reveal>
          )}

          {/* Botón «antes de empezar»: abre el cómic de síntesis. */}
          {tieneComic && (
            <Reveal direction="up" distance={16} delay={0.2} duration={0.55} display="flex" justifyContent="center">
              <Box
                as="button"
                onClick={() => setComicAbierto(true)}
                display="inline-flex"
                alignItems="center"
                gap={2.5}
                px={{ base: 5, md: 7 }}
                py={{ base: 2.5, md: 3 }}
                borderRadius="full"
                bg={fisiologiaTxt}
                color={fisiologiaBg}
                border={`1px solid ${fisiologiaTxt}`}
                fontWeight="700"
                fontSize={{ base: "sm", md: "md" }}
                letterSpacing="0.03em"
                cursor="pointer"
                boxShadow={`0 0 18px ${fisiologiaTxt}66, 0 0 40px ${fisiologiaTxt}33, 0 2px 12px rgba(0,0,0,0.45)`}
                transition="all 0.2s"
                _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 28px ${fisiologiaTxt}88, 0 0 58px ${fisiologiaTxt}44` }}
              >
                <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                     w={{ base: "18px", md: "20px" }} h={{ base: "18px", md: "20px" }} fill="currentColor">
                  <path d="M320-200v-560l440 280-440 280Z" />
                </Box>
                Antes de empezar: mira cómo se fabrican
              </Box>
            </Reveal>
          )}

          {/* Rejilla de fichas, o mensaje de «en construcción». */}
          {tieneFichas ? (
            <>
              {tema.pista && (
                <Reveal direction="up" distance={12} delay={0.26} duration={0.5} display="flex" justifyContent="center">
                  <Text color={`${fisiologiaTxt}cc`} fontSize={{ base: "xs", md: "sm" }} fontStyle="italic"
                        textAlign="center" style={{ textShadow: `0 1px 4px ${fisiologiaBg}` }}>
                    {tema.pista}
                  </Text>
                </Reveal>
              )}
              <SimpleGrid columns={{ base: 2, md: 3 }} spacing={{ base: 4, md: 6 }} w="100%">
                {tema.fichas.map((f, i) => (
                  <Reveal key={f.key} direction="up" distance={20} delay={0.05 * i} duration={0.5} w="100%" display="flex">
                    <FichaBox ficha={f} temaColor={tema.color} active={ficha?.key === f.key}
                              leido={leidas.has(f.key)}
                              coloreado={tema.fichasColoreadas} onClick={() => verFicha(f)} />
                  </Reveal>
                ))}
              </SimpleGrid>
            </>
          ) : (
            <Reveal direction="up" distance={16} delay={0.2} duration={0.6} w="100%" display="flex" justifyContent="center">
              <Flex direction="column" align="center" gap={3} maxW="520px" textAlign="center"
                    position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                    border={`1px dashed ${fisiologiaTxt}44`} px={{ base: 6, md: 10 }} py={{ base: 10, md: 12 }}>
                <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" overlay={`${fisiologiaBg}88`} />
                <Text position="relative" zIndex={1} fontSize="4xl">🔬</Text>
                <Text position="relative" zIndex={1} color={fisiologiaTxt} fontWeight={700} fontSize={{ base: "lg", md: "xl" }}
                      style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}>
                  Estamos construyendo este apartado
                </Text>
                <Text position="relative" zIndex={1} color="rgba(255,255,255,0.82)" fontSize={{ base: "sm", md: "md" }}
                      fontStyle="italic" lineHeight="1.7" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                  Muy pronto podrás explorarlo aquí. Sigue avanzando por el resto del recorrido.
                </Text>
              </Flex>
            </Reveal>
          )}

          <VolverFisio onClick={() => navigate("/metodo/fisiologia/profundiza")} />

        </Flex>
      </Flex>

      {/* Modal de la ficha (foto + explicación, con flechas). */}
      <FichaExploraModal ficha={ficha} fichas={tema.fichas} temaColor={tema.color}
                         onSelect={verFicha} onClose={() => setFicha(null)} />

      {/* Cómic «antes de empezar». */}
      {tieneComic && (
        <ComicTemaModal isOpen={comicAbierto} vinetas={tema.comicIntro!} onClose={() => setComicAbierto(false)} />
      )}

      {celulasModal}
      <BotonCompania color={fisiologiaTxt} bgColor={fisiologiaBg} disciplinaNom={fisiologiaNom} />
      <SiteFooter />
    </Box>
  );
}
