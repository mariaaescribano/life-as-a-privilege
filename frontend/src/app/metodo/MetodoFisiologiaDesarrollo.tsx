import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import axios from "axios";
import { getUserMe } from "../../api/userMe";
import { FisiologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { IndiceFisiologia } from "../../components/metodo/IndiceFisiologia";
import { BotonPaso } from "../../components/metodo/BotonPaso";
import { MarcaLeido } from "../../components/metodo/MarcaLeido";
import { ReelInmersivo, useVideoMateria } from "../../components/metodo/VideoMateriaModal";
import { ComicPasoModal } from "../../components/metodo/ComicPasoModal";
import type { Vineta } from "../../components/metodo/ComicViewer";
import { CELULAS_ORGANOS } from "../../components/metodo/comicCelulasOrganos";
import { glowHeader } from "../../components/metodo/FotoBox";
import { Reveal } from "../../components/global/Reveal";
import { sombraTexto } from "../../components/global/disciplinaSombras";
import { focoBlanco } from "../../components/global/foco";
import { useComic } from "../../i18n/comics";
import { useT } from "../../i18n";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import {
  API_URL, fisiologiaBg, fisiologiaNom, fisiologiaTxt, FisiologiaIcon, noSelectSx,
} from "../../GlobalVariables";
import {
  VIDEOS_DESARROLLO, hayVideoDesarrollo, leerVistosDesarrollo,
  videoDesarrolloAbierto, videoDesarrolloVisto,
} from "../../hardCoded/espacio/VideosDesarrollo";

const FONDO = "/img/fondos/fisio.webp";
const PORTADA_CELULA = "/recorrido/fisiologia/pre/celulaentera.webp";
const SOMBRA = sombraTexto(fisiologiaNom, fisiologiaBg);

const Candado = () => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="28px" h="28px" fill={fisiologiaTxt}>
    <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z" />
  </Box>
);

const Play = () => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="30px" h="30px" fill={fisiologiaTxt}>
    <path d="M320-200v-560l440 280-440 280Z" />
  </Box>
);

// ─────────────────────────────────────────────────────────────────────────
// DESARROLLO · nivel 2 de Fisiología (/metodo/fisiologia/desarrollo).
//
// Popup inmersivo (foto de Fisiología a pantalla completa) con los SEIS vídeos de
// María: 3 arriba y 3 abajo. Se abren EN ORDEN: el siguiente se desbloquea al
// acabar de ver el anterior. Al terminar el sexto salta el cómic «La vida
// secreta de las células» y, al acabarlo, se pasa al juego de la célula.
// Los vídeos sin enlace aún (VideosDesarrollo.ts) cuentan como vistos.
//
// Lo visto vive en `data.desarrollo_videos` (blob único de metodo_fisiologia:
// se guarda desde la copia leída al cargar).
// ─────────────────────────────────────────────────────────────────────────
export default function MetodoFisiologiaDesarrollo() {
  const t = useT();
  const navigate = useNavigate();
  const videoEntrada = useVideoMateria("celulas"); // «de estructuras a células»
  const [loading, setLoading] = useState(true);
  const [vistos, setVistos] = useState<string[]>([]);
  const [reel, setReel] = useState<number | null>(null);
  const [comicOpen, setComicOpen] = useState(false);
  const dataRef = useRef<Record<string, any>>({});
  const guardado = useRef<Promise<unknown>>(Promise.resolve());

  // «La vida secreta de las células»: la pregunta con la portada de la célula y,
  // detrás, la historia (de la 1ª célula hasta los tejidos).
  const historia = useComic("fisiologia-celulas-organos", CELULAS_ORGANOS);
  const vinetas = useMemo<Vineta[]>(
    () => [{ src: PORTADA_CELULA, paragraphs: [t("fisiologia.desarrollo.pregunta")] }, ...historia.slice(0, 5)],
    [historia, t],
  );

  const completo = VIDEOS_DESARROLLO.every((v) => videoDesarrolloVisto(v, vistos));

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
        const v = leerVistosDesarrollo(dataRef.current);
        setVistos(v);
        await precargarImagenes([FONDO, PORTADA_CELULA]);
        // Sin ningún vídeo pendiente (todavía sin enlaces) el cómic sale al entrar.
        if (VIDEOS_DESARROLLO.every((x) => videoDesarrolloVisto(x, v))) setComicOpen(true);
      } catch {
        navigate("/metodo/fisiologia");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const guardar = useCallback((nuevos: string[]) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    const data = { ...dataRef.current, desarrollo_videos: nuevos };
    dataRef.current = data;
    guardado.current = axios
      .patch(`${API_URL}/metodo-fisiologia/${userId}`, { data }, { headers: { Authorization: `Bearer ${token}` } })
      .catch(() => { /* se reintenta con el siguiente guardado */ });
  }, []);

  const alAcabarVideo = useCallback(() => {
    if (reel === null) return;
    const key = VIDEOS_DESARROLLO[reel].key;
    setVistos((prev) => {
      if (prev.includes(key)) return prev;
      const nuevos = [...prev, key];
      guardar(nuevos);
      return nuevos;
    });
  }, [reel, guardar]);

  const cerrarVideo = useCallback(() => {
    setReel(null);
    // Al cerrar el último, el cómic.
    if (VIDEOS_DESARROLLO.every((v) => videoDesarrolloVisto(v, vistos))) setComicOpen(true);
  }, [vistos]);

  const ir = async (ruta: string) => { await guardado.current; navigate(ruta); };

  if (loading) return <FisiologiaLoading />;

  return (
    <Box
      position="fixed" inset={0} zIndex={10} overflowY="auto" bg={fisiologiaBg}
      fontFamily="'EB Garamond', serif" sx={noSelectSx}
    >
      <Box position="fixed" inset={0} overflow="hidden" pointerEvents="none">
        <Box as="img" src={FONDO} alt="" loading="eager" position="absolute" inset={0} w="100%" h="100%"
             style={{ objectFit: "cover", objectPosition: "center" }} />
      </Box>

      <Flex position="relative" direction="column" align="center" minH="100%"
            px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 5, md: 8 }} pb={{ base: 28, md: 36 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={{ base: 6, md: 9 }}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
              title={t("fisiologia.desarrollo.titulo")}
              pageLabel="1/3"
              compact
              bgColor={`${fisiologiaBg}dd`}
              color={fisiologiaTxt}
              nom={fisiologiaNom}
              mb={0}
              prev={{ label: `← ${t("fisiologia.niveles.titulo")}`, onClick: () => ir("/metodo/fisiologia/niveles") }}
              next={{
                label: `${t("fisiologia.celula.titulo")} →`,
                onClick: () => setComicOpen(true),
                disabled: !completo,
              }}
            />
          </Reveal>

          {/* Los seis vídeos: 3 arriba y 3 abajo (en móvil, de dos en dos). */}
          <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
                gap={{ base: 4, md: 6 }} w="100%">
            {VIDEOS_DESARROLLO.map((v, i) => {
              const abierto = videoDesarrolloAbierto(i, vistos);
              const visto = videoDesarrolloVisto(v, vistos) && hayVideoDesarrollo(v);
              const hay = hayVideoDesarrollo(v);
              const puede = abierto && hay;
              return (
                <Reveal key={v.key} inView once amount={0.25} direction="up" distance={30} scaleFrom={0.96}
                        duration={0.8} delay={0.1 + (i % 3) * 0.14} display="flex">
                  <Box
                    as="button"
                    onClick={puede ? () => setReel(i) : undefined}
                    aria-disabled={!puede}
                    position="relative" overflow="hidden" w="100%" borderRadius="2xl"
                    sx={{ aspectRatio: "4 / 5" }}
                    boxShadow={glowHeader(fisiologiaTxt)}
                    opacity={abierto ? 1 : 0.6}
                    cursor={puede ? "pointer" : "default"}
                    transition="transform 0.25s ease, opacity 0.4s ease"
                    _hover={puede ? { transform: "translateY(-4px)" } : undefined}
                    _active={puede ? { transform: "scale(0.985)" } : undefined}
                    _focusVisible={focoBlanco}
                  >
                    <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
                    {visto && <MarcaLeido tinta={fisiologiaTxt} bg={fisiologiaBg} />}
                    <Flex position="relative" zIndex={1} direction="column" align="center" justify="center"
                          h="100%" gap={{ base: 2, md: 3 }} px={{ base: 3, md: 5 }} textAlign="center">
                      <Text color={fisiologiaTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight={700}
                            letterSpacing="0.08em" style={{ textShadow: SOMBRA }}>
                        {i + 1}
                      </Text>
                      {!abierto ? <Candado /> : hay ? <Play /> : null}
                      <Text color={fisiologiaTxt} fontSize={{ base: "md", md: "xl" }} fontWeight={700}
                            lineHeight="1.25" style={{ textShadow: SOMBRA }}>
                        {t(v.titulo)}
                      </Text>
                      {abierto && !hay && (
                        <Text color={fisiologiaTxt} fontSize={{ base: "xs", md: "sm" }} fontStyle="italic"
                              style={{ textShadow: SOMBRA }}>
                          {t("comun.proximamente")}
                        </Text>
                      )}
                    </Flex>
                  </Box>
                </Reveal>
              );
            })}
          </Grid>

          <BotonPaso
            label={t("fisiologia.celula.titulo")}
            onClick={() => setComicOpen(true)}
            nom={fisiologiaNom}
            color={fisiologiaTxt}
            bg={fisiologiaBg}
            disabled={!completo}
            title={t("fisiologia.desarrollo.pregunta")}
          />
        </Flex>
      </Flex>

      <IndiceFisiologia />
      {videoEntrada}

      {reel !== null && (
        <ReelInmersivo url={VIDEOS_DESARROLLO[reel].url} onClose={cerrarVideo} onEnded={alAcabarVideo} />
      )}

      <ComicPasoModal
        isOpen={comicOpen}
        onClose={() => setComicOpen(false)}
        onContinue={() => ir("/metodo/fisiologia/celula")}
        vinetas={vinetas}
        continueLabel={t("fisiologia.celula.titulo")}
        themeColor={fisiologiaTxt}
        textColor={fisiologiaTxt}
        disciplinaBgImage={FONDO}
        disciplinaBgColor={fisiologiaBg}
      />
    </Box>
  );
}
