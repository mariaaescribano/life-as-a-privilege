import React, { useMemo, useRef, useState } from "react";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import CreadoraCard from "../../components/welcome/CreadoraCard";
import { LifeLoading } from "../../components/global/LifeLoading";
import { SubscribeBox } from "../../components/global/SubscribeBox";
import { Reveal, RevealItem, RevealStagger } from "../../components/global/Reveal";
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
  BLANCO_GLOW_SUAVE,
  CierreCrearCuenta,
  IdeasConMuestra,
  MosaicoMuestra,
  SeparadorSeccion,
  VideoMuestra,
  type IdeaPresentacion,
} from "../../components/metodo/presentacionUi";
import { NutricionIcon, nutricionBg, nutricionNom, nutricionTxt } from "../../GlobalVariables";
import type { PresentacionDisciplina } from "../../data/presentacionDisciplinas";

// ─────────────────────────────────────────────────────────────────────────────
// /d/nutricion — presentación de Nutrición.
//
// Orden:
//   1. Header de la disciplina, sin botones.
//   2. El box de la disciplina con su precio + el vídeo al lado.
//   3. LOS NUTRIENTES: los CUATRO primeros (dentro están los once). Se pulsan y
//      se abre su ficha real (el visor de Nutrición, con la manzana de espera).
//   4. MITO O VERDAD: cuatro de las 64 preguntas del material, sin caja detrás.
//      Es el bloque que engancha: todo el mundo tiene una opinión.
//   5. Las ilustraciones (cuatro).
//   6. LO QUE HAY DENTRO: tres ideas + un mosaico de fotos que NO se abre.
//   7. Llamada a la acción.
// ─────────────────────────────────────────────────────────────────────────────

/** Los cuatro mitos que se enseñan: los que más se dan por sabidos. */
const MITOS_MUESTRA = [
  "carbohidratos-engordan",
  "huevos-colesterol",
  "grasa-engorda",
  "calorias-iguales",
];

/** De los once nutrientes se enseñan los CUATRO primeros: dentro están todos. */
const NUTRIENTES_MUESTRA = NUTRIENTES.slice(0, 4);

/** Mosaico de muestra: unas cuantas fotos bonitas de lo que hay dentro. No se
 *  abren (ver MosaicoMuestra). ✍️ Cambia las fotos o los títulos a gusto. */
const FOTOS_MUESTRA = [
  { foto: "/recorrido/nutricion/bacterias/bifidobacterium.png", titulo: "Microbiota" },
  { foto: "/recorrido/nutricion/portadas/agua.webp", titulo: "Agua" },
  { foto: "/recorrido/nutricion/portadas/fibra.webp", titulo: "Fibra" },
  { foto: "/recorrido/nutricion/portadas/fitoquimico.webp", titulo: "Fitoquímicos" },
];

/** Lo que hay dentro, en tres ideas. ✍️ Textos editables. */
const IDEAS: IdeaPresentacion[] = [
  {
    titulo: "Macronutrientes y micronutrientes",
    parrafos: [
      "Déjate de pensar en «esto es sano y esto no». Comprenderás, de forma sencilla, qué moléculas componen los alimentos y qué función cumplen en tu organismo.",
    ],
  },
  {
    titulo: "Microbiota",
    parrafos: [
      "Entenderás por qué la microbiota va mucho más allá de la digestión y cómo se relaciona con tu salud, energía y bienestar general.",
    ],
  },
  {
    titulo: "Sesiones individuales",
    parrafos: [
      "Adaptaremos el conocimiento a tu realidad. No te diré qué comer; resolveremos tus dudas sobre los alimentos, cómo funcionan y cómo aplicarlo a tu día a día. Si lo deseas, también podremos explorar la relación entre ciertos hábitos alimentarios y factores emocionales o experiencias personales.",
    ],
    nota: "Opcional. Se cobra aparte.",
  },
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
    () => NUTRIENTES_MUESTRA.map((n) => ({
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
    ...NUTRIENTES_MUESTRA.map((n) => n.img),
    ...mitos.map((m) => m.foto),
    ...FOTOS_MUESTRA.map((f) => f.foto),
    ...comics.map((c) => c.cover),
  ]);
  if (!fotosListas) return <LifeLoading variant="auto" />;

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
              fontSize={{ base: "lg", md: "2xl" }}
              fontStyle="italic"
              fontWeight="700"
              lineHeight="1.15"
              letterSpacing="0.04em"
              maxW="760px"
            >
              {d.gancho}
            </Text>
          </RevealItem>
        </RevealStagger>

        {/* ══ 2. BOX DE LA DISCIPLINA (con su precio) + VÍDEO ══ */}
        <Grid
          w="100%"
          maxW="1180px"
          templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
          gap={{ base: 8, md: 8 }}
          alignItems="stretch"
          // `1fr` es en realidad `minmax(auto, 1fr)`: un item de rejilla NO se
          // encoge por debajo del mínimo de su contenido. El <video> de la
          // muestra mide 1080×1080 de verdad, así que reclamaba 784px y dejaba
          // la columna del box en 364; con esa anchura el texto del box pedía
          // 1147px de alto, se salía de la rejilla y la sección de abajo se
          // pintaba encima. Con `minWidth: 0` las dos columnas son de verdad
          // 1fr, iguales, y de ahí salen las cajas cuadradas.
          //
          // Quién manda el alto: el CUADRADO, no el contenido. El box no cambia
          // de tamaño; lo que se estira es la letra, hasta llenarlo. El vídeo
          // sigue al box (`h="100%"` y recorta con `object-fit: cover`).
          sx={{
            "& > *": { minWidth: 0 },
            // El box va CUADRADO y no cambia de tamaño: su alto sale de la
            // anchura de la columna, no del contenido. Es lo que le da al texto
            // un hueco fijo que llenar (ver el autoajuste de
            // DisciplinaVideoBox) y lo que mantiene las dos cajas iguales.
            // Hace falta ponerlo AQUÍ y no dentro del vídeo: el suyo lo anula
            // su propio `h="100%"`.
            // Solo de `lg` para arriba; en móvil se apilan y crecen a lo alto.
            "@media (min-width: 62em)": { "& > *": { aspectRatio: "1 / 1" } },
          }}
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
              Estas son las moléculas que componen lo que comes: pulsa cualquiera y lee qué hace
              de verdad dentro de ti.
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
            {NUTRIENTES_MUESTRA.map((n, i) => (
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

          <Reveal inView direction="up" distance={14} duration={0.65}>
            <Text
              color="rgba(255,255,255,0.9)"
              fontSize={{ base: "md", md: "lg" }}
              fontStyle="italic"
              textAlign="center"
              lineHeight="1.65"
              maxW="700px"
              textShadow={BLANCO_GLOW_SUAVE}
            >
              Dentro conocerás los secretos de la nutrición…
            </Text>
          </Reveal>
        </Flex>

        {/* ══ 4. MITO O VERDAD ══
            Cuatro preguntas de las 64 del material, sin caja detrás. Cada una
            abre su respuesta entera, con la ilustración. */}
        {mitos.length > 0 && (
          <Flex direction="column" align="center" w="100%" maxW="1180px" gap={{ base: 6, md: 8 }}>
            <SeparadorSeccion maxW="1180px">Mito o verdad</SeparadorSeccion>

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
                Sobre estas cosas todo el mundo tiene una opinión. Pulsa una y lee la respuesta,
                con lo que dice la evidencia y sin titulares. Dentro hay {MITOS_NUTRICION.length}{" "}
                preguntas respondidas así.
              </Text>
            </Reveal>

            <RevealStagger
              inView
              stagger={0.06}
              delayChildren={0.1}
              amount={0.1}
              w="100%"
              display="grid"
              gridTemplateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
              gap={{ base: 4, md: 5 }}
            >
              {mitos.map((m, i) => (
                <RevealItem key={m.key} direction="up" distance={18} scaleFrom={0.96} duration={0.6}>
                  <FotoBox
                    titulo={m.titulo}
                    foto={m.foto}
                    nom={nutricionNom}
                    tinta={nutricionTxt}
                    bg={nutricionBg}
                    onClick={() => setMitoIdx(i)}
                  />
                </RevealItem>
              ))}
            </RevealStagger>
          </Flex>
        )}

        {/* ══ 5. ILUSTRACIONES ══ cuatro, aunque dentro haya más ══ */}
        {comics.length > 0 && (
          <Flex direction="column" align="center" w="100%" maxW="1180px" gap={{ base: 6, md: 8 }}>
            <SeparadorSeccion>Ilustraciones de Nutrición</SeparadorSeccion>
            <Grid
              w="100%"
              templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
              gap={{ base: 6, md: 6 }}
            >
              {comics.slice(0, 4).map((entry, i) => (
                <IlustracionCard key={entry.id} entry={entry} i={i} onOpen={() => setAbierta(entry)} />
              ))}
            </Grid>
          </Flex>
        )}

        {/* ══ 6. LO QUE HAY DENTRO ══
            Tres ideas y, al lado, unas fotos de muestra que NO se abren. */}
        <Flex direction="column" align="center" w="100%" maxW="1180px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion maxW="1180px">Lo que hay dentro</SeparadorSeccion>
          <IdeasConMuestra d={d} ideas={IDEAS}>
            <MosaicoMuestra d={d} fotos={FOTOS_MUESTRA} />
          </IdeasConMuestra>
        </Flex>

        {/* ══ QUIÉN LO HA HECHO ══
            Antes de pedir la cuenta: quién está detrás. La MISMA tarjeta de
            /welcome y /elMetodo (components/welcome/CreadoraCard), con
            `sinMargenes` porque esta página ya pone los suyos. */}
        <Flex direction="column" align="center" w="100%" maxW="1180px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion maxW="1100px">La creadora</SeparadorSeccion>
          <CreadoraCard sinMargenes />
        </Flex>

        {/* ══ 7. LLAMADA A LA ACCIÓN ══ */}
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
