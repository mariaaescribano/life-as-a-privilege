import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Collapse, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import { getUserMe } from "../../api/userMe";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { BotonCompania } from "../../components/global/BotonCompania";
import { FisiologiaLoading, FisiologiaLoader } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { IndiceFisiologia } from "../../components/metodo/IndiceFisiologia";
import { BotonPaso } from "../../components/metodo/BotonPaso";
import { FiguraHumana } from "../../components/metodo/FiguraHumana";
import { TestVidaModal } from "../../components/metodo/TestVidaModal";
import { ComicPasoModal } from "../../components/metodo/ComicPasoModal";
import { ReelInmersivo, marcarVideoVisto, videoYaVisto } from "../../components/metodo/VideoMateriaModal";
import { VIDA_INTRO } from "../../components/metodo/comicVida";
import { glowHeader } from "../../components/metodo/FotoBox";
import { Reveal } from "../../components/global/Reveal";
import { sombraTexto } from "../../components/global/disciplinaSombras";
import { focoBlanco } from "../../components/global/foco";
import { youtubeId } from "../../components/aprendizaje/youtube";
import { useT, type ClaveTexto } from "../../i18n";
import { useComic } from "../../i18n/comics";
import {
  API_URL, fisiologiaBg, fisiologiaNom, fisiologiaTxt, FisiologiaIcon, noSelectSx,
} from "../../GlobalVariables";
import {
  CATEGORIAS_VIDA, COLOR_CATEGORIA, leerVida, organoVida, rankingVida,
  type CategoriaVida, type RespuestasVida, type VidaGuardada,
} from "../../hardCoded/espacio/OrganosVida";

const FONDO = "/img/fondos/fisio.webp";
const SOMBRA = sombraTexto(fisiologiaNom, fisiologiaBg);
/** Lo mínimo que se ve «Preparando tu recorrido…» (aunque el guardado sea rápido). */
const ESPERA_MS = 3200;

type Fase = "cargando" | "comic" | "test" | "preparando" | "hub";

// ─────────────────────────────────────────────────────────────────────────
// VIDA · tu recorrido individualizado (/metodo/fisiologia/vida), nivel 3.
//
//   cómic de entrada (si lo hay) → test → «Preparando tu recorrido…» → el
//   recorrido: la figura humana a la izquierda y, a su derecha, tres cajas
//   plegables (Imprescindible · Te puede interesar · No obligatorio…) con los
//   órganos de cada categoría, que se encienden en el cuerpo al desplegarlas.
//
// Al pulsar un órgano: primero el vídeo de María (si lo tiene) y luego su ficha
// (células y curiosidades, o su estación). Lo contestado vive en `data.vida`
// (blob único de metodo_fisiologia: se guarda desde la copia leída al cargar).
// ─────────────────────────────────────────────────────────────────────────
export default function MetodoFisiologiaVida() {
  const t = useT();
  const navigate = useNavigate();
  const [fase, setFase] = useState<Fase>("cargando");
  const [vida, setVida] = useState<VidaGuardada | null>(null);
  const [abierta, setAbierta] = useState<CategoriaVida | null>("imprescindible");
  const [resaltado, setResaltado] = useState<string | null>(null);
  const [reel, setReel] = useState<string | null>(null);
  const dataRef = useRef<Record<string, any>>({});
  const intro = useComic("fisiologia-vida-intro", VIDA_INTRO);

  const nombre = (k: string) => t(`fisiologia.vida.organo.${k}` as ClaveTexto);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await getUserMe();
        if (!me.data?.fisiologia_suscrito) { navigate("/metodo/fisiologia"); return; }
        try {
          const r = await axios.get(`${API_URL}/metodo-fisiologia/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          dataRef.current = r.data?.data && typeof r.data.data === "object" ? r.data.data : {};
        } catch { /* sin fila todavía */ }
        const v = leerVida(dataRef.current);
        setVida(v);
        setFase(v ? "hub" : VIDA_INTRO.length ? "comic" : "test");
      } catch {
        navigate("/metodo/fisiologia");
      }
    })();
  }, [navigate]);

  const categorias = useMemo(() => {
    const m: Record<string, CategoriaVida> = {};
    if (vida) for (const c of CATEGORIAS_VIDA) for (const k of vida.ranking[c]) m[k] = c;
    return m;
  }, [vida]);

  // El test acabado: se calcula el ranking, se guarda y se espera un momento
  // (el recorrido es «individualizado» y la persona tiene que notarlo).
  const terminarTest = async (respuestas: RespuestasVida) => {
    const nuevo: VidaGuardada = { respuestas, ranking: rankingVida(respuestas) };
    setFase("preparando");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const data = { ...dataRef.current, vida: nuevo, vida_test_hecho: true };
    dataRef.current = data;
    const guardado = userId && token
      ? axios.patch(`${API_URL}/metodo-fisiologia/${userId}`, { data }, { headers: { Authorization: `Bearer ${token}` } }).catch(() => undefined)
      : Promise.resolve();
    await Promise.all([guardado, new Promise((r) => setTimeout(r, ESPERA_MS))]);
    setVida(nuevo);
    setAbierta("imprescindible");
    setFase("hub");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const irFicha = (key: string) => {
    const o = organoVida(key);
    if (o?.ficha === "estacion") navigate(`/metodo/fisiologia/cuerpo/${key}?libre=1`);
    else navigate(`/metodo/fisiologia/todas-tus-celulas?organo=${key}`);
  };

  // Un órgano pulsado: su vídeo (la primera vez) y luego su ficha.
  const abrirOrgano = (key: string) => {
    const o = organoVida(key);
    if (!o || !o.ficha) return;
    // Las estaciones ya abren su propio vídeo en su página.
    if (o.ficha === "celulas" && youtubeId(o.video) && !videoYaVisto(`organo-${key}`)) { setReel(key); return; }
    irFicha(key);
  };
  const cerrarReel = () => {
    if (!reel) return;
    marcarVideoVisto(`organo-${reel}`);
    const k = reel;
    setReel(null);
    irFicha(k);
  };

  if (fase === "cargando") return <FisiologiaLoading />;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif" sx={noSelectSx}>
      <SiteHeader variant="private" />

      {fase === "hub" && vida && (
        <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 28, md: 36 }}>
          <Flex direction="column" align="center" w="100%" maxW="1000px" gap={{ base: 6, md: 9 }}>

            <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
              <MetodoStepHeader
                icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
                title={t("fisiologia.vida.titulo")}
                pageLabel="1/4"
                compact
                bgColor={`${fisiologiaBg}dd`}
                color={fisiologiaTxt}
                nom={fisiologiaNom}
                mb={0}
                prev={{ label: `← ${t("fisiologia.organos.titulo")}`, onClick: () => navigate("/metodo/fisiologia/organos") }}
                next={{ label: `${t("fisiologia.lasCelulas.corto")} →`, onClick: () => navigate("/metodo/fisiologia/todas-tus-celulas") }}
              />
            </Reveal>

            <Flex w="100%" direction={{ base: "column", md: "row" }} align={{ md: "flex-start" }} gap={{ base: 6, md: 9 }}>
              {/* El cuerpo: se ilumina lo de la caja abierta. */}
              <Reveal direction="up" distance={24} duration={0.8} delay={0.5}
                      flex={{ md: "0 0 34%" }} w="100%" maxW={{ base: "260px", md: "none" }} mx={{ base: "auto", md: 0 }}
                      position={{ md: "sticky" }} top={{ md: "24px" }}>
                <FiguraHumana categorias={categorias} abierta={abierta} resaltado={resaltado}
                              onOrgano={abrirOrgano} onResaltar={setResaltado} nombre={nombre} maxW="340px" />
              </Reveal>

              {/* Las tres cajas plegables. */}
              <Flex direction="column" flex="1" gap={{ base: 4, md: 5 }} minW={0}>
                {CATEGORIAS_VIDA.map((cat, i) => {
                  const col = COLOR_CATEGORIA[cat];
                  const lista = vida.ranking[cat];
                  const on = abierta === cat;
                  return (
                    <Reveal key={cat} direction="up" distance={26} scaleFrom={0.97} duration={0.8} delay={0.6 + i * 0.14}>
                      <Box position="relative" overflow="hidden" borderRadius="2xl" boxShadow={glowHeader(fisiologiaTxt)}>
                        <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
                        <Box position="relative" zIndex={1}>
                          <Box as="button" onClick={() => setAbierta(on ? null : cat)} aria-expanded={on}
                               w="100%" display="flex" alignItems="center" gap={3.5} textAlign="left"
                               px={{ base: 4, md: 6 }} py={{ base: 4, md: 5 }}
                               borderLeft={`4px solid ${col}`} cursor="pointer" _focusVisible={focoBlanco}>
                            <Box flexShrink={0} w="12px" h="12px" borderRadius="full" bg={col} boxShadow={`0 0 12px ${col}`} />
                            <Text flex="1" color={fisiologiaTxt} fontWeight={700} lineHeight="1.25"
                                  fontSize={{ base: "lg", md: "xl" }} style={{ textShadow: SOMBRA }}>
                              {t(`fisiologia.vida.cat.${cat}` as ClaveTexto)}
                            </Text>
                            <Text color={fisiologiaTxt} fontSize={{ base: "md", md: "lg" }} style={{ textShadow: SOMBRA }}>
                              {lista.length}
                            </Text>
                            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="22px" h="22px" fill={fisiologiaTxt}
                                 flexShrink={0} transition="transform 0.3s ease" transform={on ? "rotate(180deg)" : "none"}>
                              <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
                            </Box>
                          </Box>

                          <Collapse in={on} animateOpacity>
                            <Flex direction="column" gap={1.5} px={{ base: 3, md: 5 }} pb={{ base: 4, md: 5 }}>
                              {lista.map((k) => {
                                const o = organoVida(k);
                                const hay = !!o?.ficha;
                                return (
                                  <Box key={k} as="button" onClick={hay ? () => abrirOrgano(k) : undefined}
                                       onMouseEnter={() => setResaltado(k)} onMouseLeave={() => setResaltado(null)}
                                       aria-disabled={!hay}
                                       display="flex" alignItems="center" gap={3} textAlign="left"
                                       px={3.5} py={2.5} borderRadius="xl" bg={`${fisiologiaBg}80`}
                                       border={`1px solid ${resaltado === k ? col : `${fisiologiaTxt}33`}`}
                                       cursor={hay ? "pointer" : "default"} opacity={hay ? 1 : 0.6}
                                       transition="all 0.18s ease"
                                       _hover={hay ? { borderColor: col, transform: "translateY(-1px)" } : undefined}
                                       _active={hay ? { transform: "scale(0.985)" } : undefined}
                                       _focusVisible={focoBlanco}>
                                    <Box flexShrink={0} w="8px" h="8px" borderRadius="full" bg={col} />
                                    <Text flex="1" color={fisiologiaTxt} fontSize={{ base: "md", md: "lg" }} style={{ textShadow: SOMBRA }}>
                                      {nombre(k)}
                                    </Text>
                                    {!hay && (
                                      <Text color={fisiologiaTxt} fontSize="xs" fontStyle="italic" style={{ textShadow: SOMBRA }}>
                                        {t("comun.proximamente")}
                                      </Text>
                                    )}
                                  </Box>
                                );
                              })}
                            </Flex>
                          </Collapse>
                        </Box>
                      </Box>
                    </Reveal>
                  );
                })}

                <Flex justify="flex-end">
                  <Box as="button" onClick={() => setFase("test")}
                       display="inline-flex" alignItems="center" px={5} py={2} borderRadius="full"
                       bg="rgba(255,255,255,0.08)" color="white" border="1px solid rgba(255,255,255,0.28)"
                       fontWeight={600} fontSize={{ base: "xs", md: "sm" }} letterSpacing="0.03em" cursor="pointer"
                       transition="all 0.2s" _hover={{ bg: "rgba(255,255,255,0.16)" }} _focusVisible={focoBlanco}>
                    {t("metodo.volverAHacer")}
                  </Box>
                </Flex>
              </Flex>
            </Flex>

            <BotonPaso label={t("fisiologia.lasCelulas.corto")} onClick={() => navigate("/metodo/fisiologia/todas-tus-celulas")}
                       nom={fisiologiaNom} color={fisiologiaTxt} bg={fisiologiaBg} />
          </Flex>
        </Flex>
      )}

      {fase !== "hub" && <Box flex="1" />}

      <IndiceFisiologia />
      <BotonCompania color={fisiologiaTxt} bgColor={fisiologiaBg} disciplinaNom={fisiologiaNom} />
      <SiteFooter />

      {/* El cómic de entrada: de momento vacío (se salta solo). */}
      <ComicPasoModal
        isOpen={fase === "comic"}
        onClose={() => setFase("test")}
        onContinue={() => setFase("test")}
        vinetas={intro}
        continueLabel={t("comun.continuar")}
        themeColor={fisiologiaTxt}
        textColor={fisiologiaTxt}
        disciplinaBgImage={FONDO}
        disciplinaBgColor={fisiologiaBg}
      />

      {fase === "test" && (
        <TestVidaModal
          inicial={vida?.respuestas}
          nombreOrgano={nombre}
          onFinish={terminarTest}
          onCancelar={() => (vida ? setFase("hub") : navigate("/metodo/fisiologia/niveles"))}
        />
      )}

      {/* «Preparando tu recorrido individualizado». */}
      {fase === "preparando" && (
        <Flex position="fixed" inset={0} zIndex={300} bg={fisiologiaBg} align="center" justify="center" px={6}
              fontFamily="'EB Garamond', serif">
          <Box position="absolute" inset={0} overflow="hidden" pointerEvents="none">
            <Box as="img" src={FONDO} alt="" position="absolute" inset={0} w="100%" h="100%"
                 style={{ objectFit: "cover", objectPosition: "center" }} />
          </Box>
          <Flex position="relative" overflow="hidden" direction="column" align="center" gap={6} borderRadius="2xl"
                px={{ base: 8, md: 14 }} py={{ base: 9, md: 12 }} boxShadow={glowHeader(fisiologiaTxt)}>
            <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1}><FisiologiaLoader size="72px" /></Box>
            <Text position="relative" zIndex={1} color={fisiologiaTxt} textAlign="center" fontStyle="italic"
                  fontSize={{ base: "xl", md: "2xl" }} lineHeight="1.4" maxW="420px" style={{ textShadow: SOMBRA }}>
              {t("fisiologia.vida.preparando")}
            </Text>
          </Flex>
        </Flex>
      )}

      {reel && <ReelInmersivo url={organoVida(reel)?.video ?? ""} onClose={cerrarReel} />}
    </Box>
  );
}
