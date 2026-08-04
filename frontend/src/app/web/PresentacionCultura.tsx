import React, { useMemo, useRef, useState } from "react";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { SubscribeBox } from "../../components/global/SubscribeBox";
import { Reveal, RevealItem, RevealStagger } from "../../components/global/Reveal";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { sombraTexto } from "../../components/global/disciplinaSombras";
import { useImagesReady } from "../../hooks/useImagesReady";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaVideoBox } from "../../components/metodo/DisciplinaVideoBox";
import { LineaTiempoCultura } from "../../components/metodo/LineaTiempoCultura";
import { HISTORIAS_CULTURA } from "../../components/metodo/culturaHistorias";
import type { HitoHistoria } from "../../components/metodo/culturaHistoriaUniversal";
import { FichaFisioModal } from "../../components/metodo/celulasUi";
import {
  BLANCO_GLOW,
  BLANCO_GLOW_SUAVE,
  CierreCrearCuenta,
  SeparadorSeccion,
  VideoMuestra,
} from "../../components/metodo/presentacionUi";
import { CulturaIcon, culturaBg, culturaNom, culturaTxt } from "../../GlobalVariables";
import type { PresentacionDisciplina } from "../../data/presentacionDisciplinas";

// ─────────────────────────────────────────────────────────────────────────────
// /d/cultura — presentación de Cultura, el cierre de El Mapa.
//
// Orden:
//   1. Header de la disciplina, sin botones.
//   2. El box de la disciplina con su precio + el vídeo al lado.
//   3. LAS SEIS HISTORIAS: universal, religiones, filosofía, ciencia, medicina y
//      arte. Cada una con sus eras contadas y su párrafo de apertura.
//   4. LA LÍNEA DEL TIEMPO de verdad (la de la Historia Universal). Se pulsa una
//      era y se abre con su texto y los hitos que contiene.
//   5. Llamada a la acción.
//
// Cultura es la única disciplina SIN ilustraciones en la galería, así que aquí no
// hay bloque de cómics: no se enseña un hueco vacío.
// ─────────────────────────────────────────────────────────────────────────────

const CULTURA_IMG = "/img/fondos/cultura.webp";

/** Las seis Historias, en el orden en que se recorren. */
const ORDEN_HISTORIAS = ["universal", "religiones", "filosofia", "ciencia", "medicina", "arte"];

/** Primera frase de un texto largo: sirve de resumen sin escribir uno nuevo. */
const primeraFrase = (texto?: string): string => {
  if (!texto) return "";
  const corte = texto.indexOf(". ");
  return corte > 0 ? texto.slice(0, corte + 1) : texto;
};

export default function PresentacionCultura({ d }: { d: PresentacionDisciplina }) {
  const [era, setEra] = useState<HitoHistoria | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const historias = useMemo(
    () => ORDEN_HISTORIAS
      .map((k) => ({ key: k, ...HISTORIAS_CULTURA[k] }))
      .filter((h) => h.hitos?.length),
    [],
  );

  const totalEras = useMemo(
    () => historias.reduce((n, h) => n + h.hitos.length, 0),
    [historias],
  );

  // La línea del tiempo que se enseña: la Historia Universal, que son seis eras
  // — justo las que caben de una vez en la fila de escritorio.
  const universal = HISTORIAS_CULTURA.universal;

  const fotosListas = useImagesReady(["/img/icono/life.png", CULTURA_IMG]);
  if (!fotosListas) return <LifeLoading variant="auto" />;

  const sombra = sombraTexto(d.nom, d.bg);
  const renderIcon = (size: string) => <CulturaIcon size={{ base: size, md: size }} />;

  const verVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    v.scrollIntoView({ behavior: "smooth", block: "center" });
    void v.play().catch(() => { /* si el navegador lo bloquea, quedan los controles */ });
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      <Flex
        flex="1"
        direction="column"
        align="center"
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 6, md: 10 }}
        pb={{ base: 16, md: 24 }}
        gap={{ base: 12, md: 16 }}
      >
        {/* ══ 1. HEADER de la disciplina ══ */}
        <Reveal direction="down" distance={18} duration={0.8} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<CulturaIcon size={{ base: "38px", md: "52px" }} />}
            title={d.titulo}
            bgColor={culturaBg}
            color={d.txt}
            nom={culturaNom}
            maxW="900px"
            mb={0}
          />
        </Reveal>

        {/* La frase del cartel */}
        <RevealStagger
          stagger={0.12}
          delayChildren={0.2}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={{ base: 4, md: 5 }}
          w="100%"
          maxW="900px"
          textAlign="center"
          mt={{ base: -6, md: -8 }}
        >
          <RevealItem>
            <Text
              color="white"
              fontSize={{ base: "2xl", md: "4xl" }}
              fontWeight="700"
              lineHeight="1.15"
              letterSpacing="0.04em"
              maxW="760px"
              textShadow={BLANCO_GLOW}
            >
              {d.gancho}
            </Text>
          </RevealItem>
          <RevealItem w="100%" maxW="420px">
            <Box h="1px" bgGradient="linear(to-r, transparent, #ffffff8c, transparent)" />
          </RevealItem>
        </RevealStagger>

        {/* ══ 2. BOX DE LA DISCIPLINA (con su precio) + VÍDEO ══ */}
        <Grid
          w="100%"
          maxW="1180px"
          templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
          gap={{ base: 8, md: 8 }}
          alignItems="stretch"
        >
          <Reveal inView direction="right" distance={26} duration={0.7} h="100%">
            <DisciplinaVideoBox
              nom={culturaNom}
              bg={culturaBg}
              txt={d.txt}
              videoIntro={d.videoIntro}
              paso={d.paso}
              renderIcon={renderIcon}
              tieneVideo={!!d.video}
              onVerVideo={verVideo}
              sinBoton
              textoGrande
              h="100%"
            />
          </Reveal>
          <Reveal inView direction="left" distance={26} duration={0.7} delay={0.1} h="100%">
            <VideoMuestra d={d} videoRef={videoRef} />
          </Reveal>
        </Grid>

        {/* ══ 3. LAS SEIS HISTORIAS ══
            Cada una con sus eras contadas y su primera frase. Los números son
            reales: salen de los propios datos. */}
        <Flex direction="column" align="center" w="100%" maxW="1180px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion maxW="1180px">Seis maneras de contar lo mismo</SeparadorSeccion>

          <Reveal inView direction="up" distance={16} duration={0.7}>
            <Text
              color="rgba(255,255,255,0.9)"
              fontSize={{ base: "md", md: "lg" }}
              fontStyle="italic"
              textAlign="center"
              lineHeight="1.65"
              maxW="740px"
              textShadow={BLANCO_GLOW_SUAVE}
            >
              Seis historias de la humanidad, {totalEras} eras en total, cada una con su línea del
              tiempo. Conocer el pasado no es memorizar fechas: es entender por qué pensamos como
              pensamos.
            </Text>
          </Reveal>

          <RevealStagger
            inView
            stagger={0.09}
            delayChildren={0.1}
            amount={0.1}
            w="100%"
            display="grid"
            gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
            gap={{ base: 5, md: 6 }}
          >
            {historias.map((h) => (
              <RevealItem
                key={h.key}
                direction="up"
                distance={20}
                scaleFrom={0.96}
                blur
                duration={0.7}
                position="relative"
                overflow="hidden"
                borderRadius="2xl"
                h="100%"
                border={`1.5px solid ${d.txt}66`}
                sx={{
                  boxShadow: `0 0 0 1px ${d.txt}33, 0 0 26px ${d.txt}3d, 0 0 60px ${d.txt}1f`,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
                  _hover: {
                    transform: "translateY(-5px)",
                    borderColor: d.txt,
                    boxShadow: `0 0 0 1px ${d.txt}55, 0 0 36px ${d.txt}77, 0 0 80px ${d.txt}44`,
                  },
                }}
              >
                <DisciplinaBgLayer nom={culturaNom} borderRadius="2xl" />
                <Flex
                  direction="column"
                  gap={3}
                  position="relative"
                  zIndex={1}
                  px={{ base: 5, md: 6 }}
                  py={{ base: 6, md: 7 }}
                  h="100%"
                >
                  <Text
                    color={`${d.txt}b3`}
                    fontSize={{ base: "2xs", md: "xs" }}
                    fontWeight="700"
                    letterSpacing="0.22em"
                    textTransform="uppercase"
                    textShadow={sombra}
                  >
                    {h.hitos.length} eras
                  </Text>
                  <Text
                    color={d.txt}
                    fontSize={{ base: "xl", md: "2xl" }}
                    fontWeight="700"
                    letterSpacing="0.03em"
                    lineHeight="1.2"
                    textShadow={sombra}
                  >
                    {h.titulo}
                  </Text>
                  <Box h="1px" w="46px" bg={`${d.txt}77`} />
                  <Text
                    color={d.txt}
                    fontSize={{ base: "sm", md: "md" }}
                    lineHeight={{ base: "1.7", md: "1.75" }}
                    textShadow={sombra}
                  >
                    {primeraFrase(h.intro) || "Recorre su línea del tiempo, era por era."}
                  </Text>
                </Flex>
              </RevealItem>
            ))}
          </RevealStagger>
        </Flex>

        {/* ══ 4. LA LÍNEA DEL TIEMPO ══
            La de verdad, con la Historia Universal. En escritorio es una fila de
            círculos con sus flechas; en móvil, una lista que se va cargando al
            bajar. Al pulsar una era se abre con su texto y sus hitos. */}
        {universal && (
          <Flex direction="column" align="center" w="100%" maxW="1180px" gap={{ base: 6, md: 8 }}>
            <SeparadorSeccion maxW="1180px">La línea del tiempo</SeparadorSeccion>

            <Reveal inView direction="up" distance={22} scaleFrom={0.98} duration={0.75} w="100%">
              <Box
                position="relative"
                w="100%"
                borderRadius="3xl"
                overflow="hidden"
                border={`1.5px solid ${d.txt}66`}
                boxShadow={`0 0 0 1px ${d.txt}55, 0 0 45px ${d.txt}66, 0 0 90px ${d.txt}33`}
              >
                <DisciplinaBgLayer nom={culturaNom} borderRadius="3xl" />

                <Flex
                  direction="column"
                  align="center"
                  gap={{ base: 6, md: 8 }}
                  position="relative"
                  zIndex={1}
                  px={{ base: 4, md: 10 }}
                  py={{ base: 8, md: 11 }}
                >
                  <Flex direction="column" align="center" gap={2}>
                    <Text
                      color={d.txt}
                      fontSize={{ base: "xl", md: "2xl" }}
                      fontWeight="700"
                      letterSpacing="0.05em"
                      textAlign="center"
                      textShadow={sombra}
                    >
                      {universal.titulo}
                    </Text>
                    <Text
                      color={`${d.txt}d9`}
                      fontSize={{ base: "sm", md: "md" }}
                      fontStyle="italic"
                      textAlign="center"
                      maxW="620px"
                      lineHeight="1.65"
                      textShadow={sombra}
                    >
                      De la Prehistoria a hoy. Pulsa una era y verás qué contiene.
                    </Text>
                  </Flex>

                  <Box w="100%">
                    <LineaTiempoCultura
                      hitos={universal.hitos}
                      tinta={culturaTxt}
                      bg={culturaBg}
                      onSelect={(key) => setEra(universal.hitos.find((h) => h.key === key) ?? null)}
                    />
                  </Box>
                </Flex>
              </Box>
            </Reveal>
          </Flex>
        )}

        {/* ══ 5. LLAMADA A LA ACCIÓN ══ */}
        <Flex direction="column" align="center" w="100%" maxW="900px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion>Empieza por aquí</SeparadorSeccion>
          <CierreCrearCuenta d={d} />
        </Flex>

        <SubscribeBox />
      </Flex>

      <SiteFooter />

      {/* Era abierta: el mismo popup de ficha del recorrido, vestido con los
          colores de Cultura. Los «claves» son los hitos que contiene la era, así
          que se ve de un golpe cuánto hay dentro de cada una. */}
      {era && (
        <FichaFisioModal
          foto={era.foto ?? ""}
          alt={era.titulo}
          titulo={`${era.titulo} · ${era.anio}`}
          claves={era.subhitos.slice(0, 6).map((s) => s.titulo)}
          parrafos={[
            era.intro ??
              `Esta era se recorre hito a hito: ${era.subhitos.length} momentos, cada uno con su ilustración.`,
          ]}
          onClose={() => setEra(null)}
          accent={culturaTxt}
          bgImage={CULTURA_IMG}
          bgColor={culturaBg}
          txtColor={culturaTxt}
          fotoFallback={
            <Text color={culturaTxt} fontSize={{ base: "3xl", md: "5xl" }} fontWeight="700" letterSpacing="0.06em">
              {era.anio}
            </Text>
          }
        />
      )}
    </Box>
  );
}
