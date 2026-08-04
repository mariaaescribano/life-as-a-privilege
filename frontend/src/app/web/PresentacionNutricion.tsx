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
import { NutrienteFichaModal } from "../../components/metodo/NutrienteFichaModal";
import { ComicModal } from "../../components/metodo/ComicModal";
import { IlustracionCard } from "../../components/metodo/IlustracionCard";
import { ILUSTRACIONES, type IlustracionEntry } from "../../components/metodo/ilustracionesGaleria";
import { NUTRIENTES, type NutrienteTarjeta } from "../../hardCoded/espacio/NutrientesNutricion";
import { MITOS_NUTRICION } from "../../hardCoded/espacio/MitosNutricion";
import {
  BLANCO_GLOW,
  BLANCO_GLOW_SUAVE,
  CierreCrearCuenta,
  SeparadorSeccion,
  VideoMuestra,
} from "../../components/metodo/presentacionUi";
import { NutricionIcon, nutricionBg, nutricionNom, nutricionTxt } from "../../GlobalVariables";
import type { PresentacionDisciplina } from "../../data/presentacionDisciplinas";

// ─────────────────────────────────────────────────────────────────────────────
// /d/nutricion — presentación de Nutrición.
//
// Orden:
//   1. Header de la disciplina, sin botones.
//   2. El box de la disciplina con su precio + el vídeo al lado.
//   3. LOS NUTRIENTES: los once, con su foto y su color. Se pulsan y se abre su
//      ficha real (el visor de Nutrición, con la manzana de espera).
//   4. MITO O VERDAD: ocho de las 64 preguntas del material. Es el bloque que
//      engancha: todo el mundo tiene una opinión sobre estas ocho cosas.
//   5. Las ilustraciones (Nutrición es la que más tiene).
//   6. Llamada a la acción.
// ─────────────────────────────────────────────────────────────────────────────

/** Los ocho mitos que se enseñan: los que más se dan por sabidos. */
const MITOS_MUESTRA = [
  "carbohidratos-engordan",
  "huevos-colesterol",
  "grasa-engorda",
  "calorias-iguales",
  "detox",
  "edulcorantes",
  "cafe-malo",
  "sin-gluten",
];

export default function PresentacionNutricion({ d }: { d: PresentacionDisciplina }) {
  const [abierta, setAbierta] = useState<IlustracionEntry | null>(null);
  // Índice dentro de la lista de tarjetas que esté abierta (nutrientes o mitos).
  const [nutriIdx, setNutriIdx] = useState<number | null>(null);
  const [mitoIdx, setMitoIdx] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const comics = useMemo(
    () => ILUSTRACIONES.filter((i) => i.disciplina === d.ilustracionesLabel),
    [d.ilustracionesLabel],
  );

  // Los nutrientes, como tarjetas para el visor de Nutrición: su foto de portada
  // y su descripción larga (si no la tiene, su resumen de una línea).
  const nutrientesTarjetas: NutrienteTarjeta[] = useMemo(
    () => NUTRIENTES.map((n) => ({
      key: n.key,
      titulo: n.label,
      foto: n.img,
      parrafos: n.descripcion?.length ? n.descripcion : [n.resumen],
    })),
    [],
  );

  // Los ocho mitos escogidos, en el orden de MITOS_MUESTRA.
  const mitos = useMemo(
    () => MITOS_MUESTRA
      .map((k) => MITOS_NUTRICION.find((m) => m.key === k))
      .filter(Boolean) as NutrienteTarjeta[],
    [],
  );

  const fotosListas = useImagesReady([
    "/img/icono/life.png",
    "/img/fondos/nutri.webp",
    ...NUTRIENTES.map((n) => n.img),
    ...mitos.map((m) => m.foto),
    ...comics.map((c) => c.cover),
  ]);
  if (!fotosListas) return <LifeLoading variant="auto" />;

  const sombra = sombraTexto(d.nom, d.bg);
  const renderIcon = (size: string) => <NutricionIcon size={{ base: size, md: size }} />;

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
            icon={<NutricionIcon size={{ base: "38px", md: "52px" }} />}
            title={d.titulo}
            bgColor={nutricionBg}
            color={d.txt}
            nom={nutricionNom}
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
              nom={nutricionNom}
              bg={nutricionBg}
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

        {/* ══ 3. LOS NUTRIENTES ══
            Los once, con su foto y su color. Se pulsan y se abre su ficha real,
            con las flechas para pasar de uno a otro. */}
        <Flex direction="column" align="center" w="100%" maxW="1180px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion maxW="1180px">Los nutrientes</SeparadorSeccion>

          <Reveal inView direction="up" distance={16} duration={0.7}>
            <Text
              color="rgba(255,255,255,0.9)"
              fontSize={{ base: "md", md: "lg" }}
              fontStyle="italic"
              textAlign="center"
              lineHeight="1.65"
              maxW="720px"
              textShadow={BLANCO_GLOW_SUAVE}
            >
              Déjate de «esto es sano y esto no». Estas son las moléculas que componen lo que
              comes: pulsa cualquiera y lee qué hace de verdad dentro de ti.
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
            {NUTRIENTES.map((n, i) => (
              <RevealItem key={n.key} direction="up" distance={18} scaleFrom={0.96} duration={0.6}>
                <FotoBox
                  titulo={n.label}
                  foto={n.img}
                  nom={nutricionNom}
                  tinta={nutricionTxt}
                  bg={nutricionBg}
                  colorTint={`${n.color}22`}
                  onClick={() => setNutriIdx(i)}
                />
              </RevealItem>
            ))}
          </RevealStagger>
        </Flex>

        {/* ══ 4. MITO O VERDAD ══
            Ocho preguntas de las 64 del material. Cada una abre su respuesta
            entera, con la ilustración. */}
        {mitos.length > 0 && (
          <Flex direction="column" align="center" w="100%" maxW="1180px" gap={{ base: 6, md: 8 }}>
            <SeparadorSeccion maxW="1180px">Mito o verdad</SeparadorSeccion>

            <Reveal inView direction="up" distance={22} scaleFrom={0.98} duration={0.75} w="100%">
              <Box
                position="relative"
                w="100%"
                borderRadius="3xl"
                overflow="hidden"
                border={`1.5px solid ${d.txt}66`}
                boxShadow={`0 0 0 1px ${d.txt}55, 0 0 45px ${d.txt}66, 0 0 90px ${d.txt}33`}
              >
                <DisciplinaBgLayer nom={nutricionNom} borderRadius="3xl" />

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
                    Sobre estas ocho cosas todo el mundo tiene una opinión. Pulsa una y lee la
                    respuesta, con lo que dice la evidencia y sin titulares.
                    Dentro hay <b>{MITOS_NUTRICION.length} preguntas</b> respondidas así.
                  </Text>

                  <SimpleGrid w="100%" columns={{ base: 2, md: 4 }} spacing={{ base: 4, md: 5 }}>
                    {mitos.map((m, i) => (
                      <FotoBox
                        key={m.key}
                        titulo={m.titulo}
                        foto={m.foto}
                        nom={nutricionNom}
                        tinta={nutricionTxt}
                        bg={nutricionBg}
                        onClick={() => setMitoIdx(i)}
                      />
                    ))}
                  </SimpleGrid>
                </Flex>
              </Box>
            </Reveal>
          </Flex>
        )}

        {/* ══ 5. ILUSTRACIONES ══ Nutrición es la que más tiene ══ */}
        {comics.length > 0 && (
          <Flex direction="column" align="center" w="100%" maxW="1180px" gap={{ base: 6, md: 8 }}>
            <SeparadorSeccion>Ilustraciones de Nutrición</SeparadorSeccion>
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

      {/* Ficha de un nutriente: el visor de Nutrición (fondo claro, letra verde
          oscura y la manzana como animación de espera). Navega por dentro. */}
      {nutriIdx != null && (
        <NutrienteFichaModal
          tarjetas={nutrientesTarjetas}
          index={nutriIdx}
          onClose={() => setNutriIdx(null)}
          sinSaltar
        />
      )}

      {/* Respuesta de un mito: mismo visor, sobre los ocho de la muestra (no los
          64: aquí se abre boca, no se vacía la despensa). */}
      {mitoIdx != null && (
        <NutrienteFichaModal
          tarjetas={mitos}
          index={mitoIdx}
          onClose={() => setMitoIdx(null)}
          sinSaltar
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
