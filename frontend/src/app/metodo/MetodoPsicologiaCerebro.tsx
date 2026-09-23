// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · El trauma en tu cerebro  ·  7/27
//
// Entre los dos tests (ACE, desconexión) y la Línea de Vida. Acaba de ver dos
// cifras sobre sí mismo; aquí ve qué hicieron por dentro esas experiencias.
//
// Aquí NO se le mide nada: no hay barras ni porcentajes por zona. Se intentó
// (una mezcla de su ACE y su DES-II) y se quitó a propósito — no existe ninguna
// fórmula validada que traduzca esos dos tests a «cuánto te pasa en la
// amígdala», y una cifra inventada sobre el propio cerebro pesa demasiado.
//
// Lo que esta página tiene que conseguir: que deje de leerse como defectos de
// carácter («soy exagerado», «no me acuerdo de nada», «me quedo en blanco») y
// empiece a leerse como lo que es — un cerebro que aprendió a sobrevivir. Por
// eso cada zona termina en «lo que la cambia», y la página entera termina en la
// neuroplasticidad: nadie se queda mirando su herida sin salida.
//
// Cada zona se lee en un POPUP con su foto (CerebroZonaModal), no dentro de la
// página: se abre tocándola en el dibujo, en la leyenda o en su barra.
//
// El aviso de que esto NO es un escáner va en la página, en su caja, no en letra
// pequeña (ver CEREBRO_AVISO).
// ─────────────────────────────────────────────────────────────────────────
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import { PsicologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IntroRecorrido } from "../../components/metodo/IntroRecorrido";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { ComicPasoModal } from "../../components/metodo/ComicPasoModal";
import { COMIC_LINEA_TIEMPO } from "../../components/metodo/comicLineaTiempo";
import { useComic } from "../../i18n/comics";
import { useT } from "../../i18n";
import {
  experienciaById,
  aceCompleto,
  desCompleto,
  type LineaDeVidaData,
} from "../../components/metodo/psicologiaRecorrido";
import {
  CEREBRO_AVISO,
  CEREBRO_ESPERANZA,
  CEREBRO_INTRO,
  type ZonaKey,
} from "../../components/metodo/psicologiaCerebro";
import { CerebroTrauma } from "../../components/metodo/CerebroTrauma";
import { CerebroZonaModal } from "../../components/metodo/CerebroZonaModal";
import { glowPanel, glowHeader, azulBorde } from "../../components/metodo/psicologiaGlow";
import { Reveal } from "../../components/global/Reveal";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt;
const PAPEL = "#fbf4e8";
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

/** Caja de papel del recorrido de psicología (la misma de los demás pasos). */
function Panel({ children }: { children: React.ReactNode }) {
  return (
    <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
         border={azulBorde} boxShadow={glowPanel}>
      <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
      <Flex position="relative" zIndex={1} direction="column" gap={{ base: 4, md: 5 }}
            px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}>
        {children}
      </Flex>
    </Box>
  );
}

export default function MetodoPsicologiaCerebro() {
  const t = useT();
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  // La zona abierta EN EL POPUP. Arranca cerrado: la página se lee entera y
  // cada zona se abre cuando se toca (en el dibujo, en la leyenda o en su barra).
  const [zonaKey, setZonaKey] = useState<ZonaKey | null>(null);
  // Cómic antesala de la Línea de Vida: ahora se intercala AQUÍ, que es el paso
  // que precede a la timeline.
  const [comicOpen, setComicOpen] = useState(false);
  const comicVinetas = useComic("psicologia-linea-tiempo", COMIC_LINEA_TIEMPO);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!exp) { navigate("/metodo/psicologia", { replace: true }); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!me.data?.psicologia_suscrito) { navigate("/metodo/psicologia", { replace: true }); return; }

        const psi = await axios.get(`${API_URL}/metodo-psicologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d: LineaDeVidaData = psi.data?.data || {};
        // Los dos tests van ANTES que esta página en el recorrido: si faltan,
        // se vuelve a ellos. (Aquí no se leen: esta página no mide nada suyo.)
        if (!aceCompleto(d)) { navigate(`/metodo/psicologia/${exp.id}/ace`, { replace: true }); return; }
        if (!desCompleto(d)) { navigate(`/metodo/psicologia/${exp.id}/des`, { replace: true }); return; }
      } catch {
        // silencioso: si falla la lectura, la página se queda con lo que haya
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  if (loading) return <PsicologiaLoading />;
  if (!exp) return null;

  /** Tocar una zona abre su popup, con su foto. */
  const abrirZona = (key: ZonaKey) => setZonaKey(key);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
        <Flex direction="column" align="center" w="100%" maxW="820px" gap={{ base: 7, md: 9 }}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
              title={t("metodo.psico.paso.cerebro")}
              bgColor={`${neuropsicologiaBg}f0`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              step={{ current: 7, total: 27 }}
              mb={0}
              boxShadow={glowHeader}
              prev={{ label: `← ${t("metodo.psico.paso.desResultado")}`, onClick: () => navigate(`/metodo/psicologia/${exp.id}/des-resultado`) }}
              next={{ label: `${t("metodo.psico.lineaDeVida")} →`, onClick: () => setComicOpen(true) }}
            />
          </Reveal>

          <Reveal direction="up" distance={20} delay={0.12} duration={0.7} w="100%" display="flex" justifyContent="center">
            <IntroRecorrido>{t("metodo.psico.cerebroIntro")}</IntroRecorrido>
          </Reveal>

          <Flex direction="column" w="100%" gap={{ base: 5, md: 6 }}>

            {/* ── Qué le pasó a tu cerebro + el dibujo ── */}
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.22} duration={0.75} w="100%">
            <Panel>
              {CEREBRO_INTRO.map((p, i) => (
                <Text key={i} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" opacity={0.92}
                      textAlign="center" maxW="620px" mx="auto" style={{ textShadow: INK_SHADOW }}>
                  {p}
                </Text>
              ))}

              <Box h="1px" w="55%" maxW="240px" mx="auto"
                   bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />

              <CerebroTrauma activa={zonaKey} onZona={abrirZona} tinta={TINTA} />

              <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" opacity={0.85}
                    textAlign="center" style={{ textShadow: INK_SHADOW }}>
                {t("metodo.psico.cerebroToca")}
              </Text>
            </Panel>
            </Reveal>

            {/* ── El aviso, a la vista y no en letra pequeña ── */}
            <Reveal direction="up" distance={20} delay={0.1} duration={0.7} w="100%">
            <Text color="white" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" fontWeight="600"
                  textAlign="center" lineHeight="1.7" maxW="620px" mx="auto">
              {CEREBRO_AVISO}
            </Text>
            </Reveal>

            {/* ── El cierre: lo que se aprendió se puede reaprender ── */}
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.16} duration={0.75} w="100%">
            <Panel>
              <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" textAlign="center"
                    lineHeight="1.3" style={{ textShadow: INK_SHADOW }}>
                {CEREBRO_ESPERANZA.titulo}
              </Text>
              <Box h="1px" w="55%" maxW="240px" mx="auto"
                   bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />
              {CEREBRO_ESPERANZA.texto.map((p, i) => (
                <Text key={i} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" opacity={0.92}
                      style={{ textShadow: INK_SHADOW }}>
                  {p}
                </Text>
              ))}

              <Flex justify="center" pt={2}>
                <Box as="button" onClick={() => setComicOpen(true)}
                     position="relative" overflow="hidden" px={8} py={3} borderRadius="full"
                     bg={TINTA} border={`1.5px solid ${TINTA}`} fontFamily="'EB Garamond', serif"
                     fontWeight="700" fontSize={{ base: "md", md: "lg" }} letterSpacing="0.04em" cursor="pointer"
                     boxShadow={`0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a`} transition="all 0.2s"
                     _hover={{ transform: "translateY(-2px)", boxShadow: `0 4px 18px rgba(0,0,0,0.28), 0 0 22px ${TINTA}5a` }}>
                  <Box as="span" position="relative" zIndex={1} color={neuropsicologiaBg}
                       style={{ textShadow: `0 1px 2px rgba(0,0,0,0.3)` }}>{t("metodo.psico.continuarLinea")}</Box>
                </Box>
              </Flex>
            </Panel>
            </Reveal>
          </Flex>
        </Flex>
      </Flex>

      <AyudaRecorrido pagina="cerebro" />

      {/* La ficha de cada zona: popup con su foto. Las flechas pasan de una a
          otra sin cerrarlo. */}
      <CerebroZonaModal zonaKey={zonaKey} onZona={setZonaKey} onClose={() => setZonaKey(null)} />

      {/* Cómic antesala de la Línea de Vida — sale al pasar de página, antes de
          cargar la timeline y su popup de edad. Se puede saltar (Saltar →). */}
      <ComicPasoModal
        isOpen={comicOpen}
        onClose={() => setComicOpen(false)}
        onContinue={() => navigate(`/metodo/psicologia/${exp.id}`)}
        vinetas={comicVinetas}
        continueLabel={t("comun.continuar")}
        botonNitido
        themeColor={neuropsicologiaTxt}
        disciplinaBgImage="/img/fondos/psciologia.webp"
        disciplinaBgColor={neuropsicologiaBg}
        textShadow={INK_SHADOW}
      />

      <SiteFooter />
    </Box>
  );
}
