import React, { useMemo, useRef, useState } from "react";
import { Box, Flex, Grid, SimpleGrid, Text } from "@chakra-ui/react";
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
import { FotoBox } from "../../components/metodo/FotoBox";
import { FichaFisioModal } from "../../components/metodo/celulasUi";
import { SistemaModal } from "../../components/metodo/SistemaModal";
import { ComicModal } from "../../components/metodo/ComicModal";
import { IlustracionCard } from "../../components/metodo/IlustracionCard";
import { ILUSTRACIONES, type IlustracionEntry } from "../../components/metodo/ilustracionesGaleria";
import { SISTEMAS, type Sistema } from "../../hardCoded/espacio/SistemasFisiologia";
import { celulas, type Celula } from "../../hardCoded/espacio/CelulasCuerpoData";
import {
  BLANCO_GLOW,
  BLANCO_GLOW_SUAVE,
  CierreCrearCuenta,
  SeparadorSeccion,
  VideoMuestra,
} from "../../components/metodo/presentacionUi";
import { FisiologiaIcon, fisiologiaBg, fisiologiaNom, fisiologiaTxt } from "../../GlobalVariables";
import type { PresentacionDisciplina } from "../../data/presentacionDisciplinas";

// ─────────────────────────────────────────────────────────────────────────────
// /d/fisiologia — presentación de Fisiología.
//
// Orden:
//   1. Header de la disciplina, sin botones.
//   2. El box de la disciplina con su precio + el vídeo al lado.
//   3. LOS DOCE SISTEMAS: la rejilla de tarjetas del recorrido. Se pulsan y se
//      abren de verdad, con su foto y su explicación (SistemaModal).
//   4. LAS CÉLULAS: de qué estás hecho por dentro. Ocho fichas reales de las 76
//      que hay dentro, con sus tres claves, qué hacen y cómo cuidarlas.
//   5. Las ilustraciones de la disciplina.
//   6. Llamada a la acción.
// ─────────────────────────────────────────────────────────────────────────────

/** Ocho células escogidas para que se vea el recorrido entero del cuerpo: del
 *  cerebro a la sangre, del hígado al hueso. Las claves y los textos son los del
 *  material (CelulasCuerpoData), no un resumen aparte. */
const CELULAS_MUESTRA = [
  "neuronas",
  "cardiomiocitos",
  "hepatocitos",
  "eritrocitos",
  "linfocitos-t",
  "osteoblastos",
  "celulas-beta",
  "adipocitos-marrones",
];

export default function PresentacionFisiologia({ d }: { d: PresentacionDisciplina }) {
  const [abierta, setAbierta] = useState<IlustracionEntry | null>(null);
  const [sistema, setSistema] = useState<Sistema | null>(null);
  const [celulaIdx, setCelulaIdx] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const comics = useMemo(
    () => ILUSTRACIONES.filter((i) => i.disciplina === d.ilustracionesLabel),
    [d.ilustracionesLabel],
  );

  // Las células que se enseñan, en el orden de CELULAS_MUESTRA.
  const muestra = useMemo(
    () => CELULAS_MUESTRA.map((id) => celulas.find((c) => c.id === id)).filter(Boolean) as Celula[],
    [],
  );
  const celula = celulaIdx != null ? muestra[celulaIdx] : null;
  const saltaCelula = (paso: number) =>
    setCelulaIdx((i) => (i == null ? i : (i + paso + muestra.length) % muestra.length));

  const fotosListas = useImagesReady([
    "/img/icono/life.png",
    "/img/fondos/fisio.webp",
    ...SISTEMAS.map((s) => s.foto),
    ...muestra.map((c) => c.foto),
    ...comics.map((c) => c.cover),
  ]);
  if (!fotosListas) return <LifeLoading variant="auto" />;

  const sombra = sombraTexto(d.nom, d.bg);
  const renderIcon = (size: string) => <FisiologiaIcon size={{ base: size, md: size }} />;

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
            icon={<FisiologiaIcon size={{ base: "38px", md: "52px" }} />}
            title={d.titulo}
            bgColor={fisiologiaBg}
            color={d.txt}
            nom={fisiologiaNom}
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
              nom={fisiologiaNom}
              bg={fisiologiaBg}
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

        {/* ══ 3. LOS DOCE SISTEMAS ══
            La rejilla del recorrido, con sus fotos. Se pulsan y se abren de
            verdad: foto grande, las tres claves y la explicación, con flechas
            para pasar de un sistema al siguiente sin salir. */}
        <Flex direction="column" align="center" w="100%" maxW="1180px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion maxW="1180px">Los doce sistemas</SeparadorSeccion>

          <Reveal inView direction="up" distance={16} duration={0.7}>
            <Text
              color="rgba(255,255,255,0.9)"
              fontSize={{ base: "md", md: "lg" }}
              fontStyle="italic"
              textAlign="center"
              lineHeight="1.65"
              maxW="700px"
              textShadow={BLANCO_GLOW_SUAVE}
            >
              Varios órganos que colaboran forman un sistema. Pulsa cualquiera y lo lees entero,
              igual que dentro del recorrido.
            </Text>
          </Reveal>

          <RevealStagger
            inView
            stagger={0.06}
            delayChildren={0.1}
            amount={0.1}
            w="100%"
            display="grid"
            gridTemplateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }}
            gap={{ base: 4, md: 6 }}
          >
            {SISTEMAS.map((s) => (
              <RevealItem key={s.key} direction="up" distance={18} scaleFrom={0.96} duration={0.6}>
                <FotoBox
                  titulo={s.label}
                  foto={s.foto}
                  nom={fisiologiaNom}
                  tinta={fisiologiaTxt}
                  bg={fisiologiaBg}
                  colorTint={`${s.color}22`}
                  onClick={() => setSistema(s)}
                />
              </RevealItem>
            ))}
          </RevealStagger>
        </Flex>

        {/* ══ 4. LAS CÉLULAS ══ de qué estás hecho por dentro ══ */}
        <Flex direction="column" align="center" w="100%" maxW="1180px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion maxW="1180px">De qué estás hecho</SeparadorSeccion>

          <Reveal inView direction="up" distance={22} scaleFrom={0.98} duration={0.75} w="100%">
            <Box
              position="relative"
              w="100%"
              borderRadius="3xl"
              overflow="hidden"
              border={`1.5px solid ${d.txt}66`}
              boxShadow={`0 0 0 1px ${d.txt}55, 0 0 45px ${d.txt}66, 0 0 90px ${d.txt}33`}
            >
              <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="3xl" />

              <Flex
                direction="column"
                align="center"
                gap={{ base: 6, md: 8 }}
                position="relative"
                zIndex={1}
                px={{ base: 5, md: 10 }}
                py={{ base: 8, md: 11 }}
              >
                <Text
                  color={d.txt}
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight={{ base: "1.75", md: "1.8" }}
                  textAlign="center"
                  maxW="780px"
                  textShadow={sombra}
                >
                  Tu cuerpo no es una idea: son células trabajando ahora mismo, cada una con su
                  oficio. Dentro hay <b>{celulas.length} tipos</b> con su ficha: qué hacen, cómo
                  lo hacen y cómo cuidarlas. Aquí van ocho.
                </Text>

                {/* Ocho células reales. Se pulsan y se abre su ficha, con flechas
                    para pasar de una a la siguiente. */}
                <SimpleGrid
                  w="100%"
                  columns={{ base: 2, md: 4 }}
                  spacing={{ base: 4, md: 5 }}
                >
                  {muestra.map((c, i) => (
                    <FotoBox
                      key={c.id}
                      titulo={c.nombre}
                      foto={c.foto}
                      nom={fisiologiaNom}
                      tinta={fisiologiaTxt}
                      bg={fisiologiaBg}
                      onClick={() => setCelulaIdx(i)}
                    />
                  ))}
                </SimpleGrid>
              </Flex>
            </Box>
          </Reveal>
        </Flex>

        {/* ══ 5. ILUSTRACIONES ══ */}
        {comics.length > 0 && (
          <Flex direction="column" align="center" w="100%" maxW="1180px" gap={{ base: 6, md: 8 }}>
            <SeparadorSeccion>Ilustraciones de Fisiología</SeparadorSeccion>
            <Grid
              w="100%"
              templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
              gap={{ base: 6, md: 6 }}
            >
              {comics.map((entry, i) => (
                <IlustracionCard key={entry.id} entry={entry} i={i} onOpen={() => setAbierta(entry)} />
              ))}
            </Grid>
          </Flex>
        )}

        {/* ══ 6. LLAMADA A LA ACCIÓN ══ */}
        <Flex direction="column" align="center" w="100%" maxW="900px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion>Empieza por aquí</SeparadorSeccion>
          <CierreCrearCuenta d={d} />
        </Flex>

        <SubscribeBox />
      </Flex>

      <SiteFooter />

      {/* Sistema abierto: el mismo popup inmersivo del recorrido, con flechas
          para recorrer los doce. */}
      <SistemaModal
        sistema={sistema}
        sistemas={SISTEMAS}
        onSelect={setSistema}
        onClose={() => setSistema(null)}
      />

      {/* Ficha de la célula: la misma que dentro (foto + claves + qué hace +
          cómo cuidarla), navegable con las flechas. */}
      {celula && (
        <FichaFisioModal
          foto={celula.foto}
          alt={celula.nombre}
          titulo={celula.nombre}
          claves={celula.claves}
          parrafos={[celula.descripcion, ...(celula.cuidados ? [celula.cuidados] : [])]}
          contador={`${(celulaIdx ?? 0) + 1} / ${muestra.length}`}
          onPrev={() => saltaCelula(-1)}
          onNext={() => saltaCelula(1)}
          onClose={() => setCelulaIdx(null)}
        />
      )}

      <ComicModal
        isOpen={!!abierta}
        onClose={() => setAbierta(null)}
        vinetas={abierta?.vinetas ?? []}
        themeColor={abierta?.themeColor}
        disciplinaBgImage={abierta?.disciplinaBgImage}
        disciplinaBgColor={abierta?.disciplinaBgColor}
        textShadow={abierta?.textShadow}
        textColor={abierta?.textColor}
      />
    </Box>
  );
}
