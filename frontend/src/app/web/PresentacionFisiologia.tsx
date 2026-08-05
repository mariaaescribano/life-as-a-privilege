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
import { FichaFisioModal } from "../../components/metodo/celulasUi";
import { SistemaModal } from "../../components/metodo/SistemaModal";
import { ComicModal } from "../../components/metodo/ComicModal";
import { IlustracionCard } from "../../components/metodo/IlustracionCard";
import { ILUSTRACIONES, type IlustracionEntry } from "../../components/metodo/ilustracionesGaleria";
import { SISTEMAS, type Sistema } from "../../hardCoded/espacio/SistemasFisiologia";
import { celulas, type Celula } from "../../hardCoded/espacio/CelulasCuerpoData";
import { TEMAS_PROFUNDIZA } from "../../hardCoded/espacio/ProfundizaFisiologia";
import {
  BLANCO_GLOW_SUAVE,
  CierreCrearCuenta,
  IdeasConMuestra,
  MosaicoMuestra,
  SeparadorSeccion,
  VideoMuestra,
  type IdeaPresentacion,
} from "../../components/metodo/presentacionUi";
import { FisiologiaIcon, fisiologiaBg, fisiologiaNom, fisiologiaTxt } from "../../GlobalVariables";
import type { PresentacionDisciplina } from "../../data/presentacionDisciplinas";

// ─────────────────────────────────────────────────────────────────────────────
// /d/fisiologia — presentación de Fisiología.
//
// Orden:
//   1. Header de la disciplina, sin botones.
//   2. El box de la disciplina con su precio + el vídeo al lado.
//   3. LOS SISTEMAS: los CUATRO primeros del recorrido (dentro están los doce).
//      Se pulsan y se abren de verdad, con su foto y su explicación.
//   4. LAS CÉLULAS: de qué estás hecho por dentro. Ocho fichas reales de las 76
//      que hay dentro, sin caja detrás.
//   5. Las ilustraciones de la disciplina.
//   6. LO QUE HAY DENTRO: tres ideas + un mosaico de temas de «Profundiza» que
//      NO se abre (es una ventana, no un menú).
//   7. Llamada a la acción.
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

/** De los doce sistemas se enseñan los CUATRO primeros: dentro están todos. */
const SISTEMAS_MUESTRA = SISTEMAS.slice(0, 4);

/** Cuatro temas de «Profundiza» como ventana a lo que hay dentro (no se abren:
 *  solo se ven, para que se note que la página no cabe en la página). */
const TEMAS_MUESTRA = ["hormonas", "neurotransmisores", "metabolismo", "inmunitario"];

/** Lo que hay dentro, en tres ideas. ✍️ Textos editables. */
const IDEAS: IdeaPresentacion[] = [
  {
    titulo: "Eres tu cuerpo, deja de ser un misterio",
    parrafos: [
      "Entenderás qué ocurre realmente en ti cuando tienes energía, inflamación, fatiga o enfermedad. Eres tu cuerpo, deja de ser un misterio.",
    ],
  },
  {
    titulo: "Desequilibrios frecuentes",
    parrafos: [
      "Aprenderás a reconocer los mecanismos detrás de muchos de los problemas que afectan a millones de personas hoy.",
    ],
  },
  {
    titulo: "Sesiones individuales",
    parrafos: [
      "Un espacio para traducir la teoría a tu situación concreta y comprender mejor lo que ocurre en tu propio organismo.",
    ],
  },
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

  // Los cuatro temas de «Profundiza» del mosaico, con su portada y su nombre.
  const temasMuestra = useMemo(
    () => TEMAS_MUESTRA
      .map((k) => TEMAS_PROFUNDIZA.find((t) => t.key === k))
      .filter((t): t is NonNullable<typeof t> => !!t)
      .map((t) => ({ foto: t.foto, titulo: t.label })),
    [],
  );

  const fotosListas = useImagesReady([
    "/img/icono/life.png",
    "/img/fondos/fisio.webp",
    ...SISTEMAS_MUESTRA.map((s) => s.foto),
    ...muestra.map((c) => c.foto),
    ...temasMuestra.map((t) => t.foto),
    ...comics.map((c) => c.cover),
  ]);
  if (!fotosListas) return <LifeLoading variant="auto" />;

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
          <SeparadorSeccion maxW="1180px">Los sistemas</SeparadorSeccion>

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
            {SISTEMAS_MUESTRA.map((s) => (
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
              Dentro los conocerás todos…
            </Text>
          </Reveal>
        </Flex>

        {/* ══ 4. LAS CÉLULAS ══ de qué estás hecho por dentro ══
            Sin caja detrás: las células se presentan solas sobre el turquesa
            (una caja más ahí solo pesaba). */}
        <Flex direction="column" align="center" w="100%" maxW="1180px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion maxW="1180px">De qué estás hecho</SeparadorSeccion>

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
              Tu cuerpo no es una idea: son células trabajando ahora mismo, cada una con su
              oficio. Dentro hay {celulas.length} tipos con su ficha. Aquí van ocho.
            </Text>
          </Reveal>

          {/* Ocho células reales. Se pulsan y se abre su ficha, con flechas
              para pasar de una a la siguiente. */}
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
            {muestra.map((c, i) => (
              <RevealItem key={c.id} direction="up" distance={18} scaleFrom={0.96} duration={0.6}>
                <FotoBox
                  titulo={c.nombre}
                  foto={c.foto}
                  nom={fisiologiaNom}
                  tinta={fisiologiaTxt}
                  bg={fisiologiaBg}
                  onClick={() => setCelulaIdx(i)}
                />
              </RevealItem>
            ))}
          </RevealStagger>
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

        {/* ══ 6. LO QUE HAY DENTRO ══
            Tres ideas de lo que se aprende y, al lado, cuatro temas de
            «Profundiza» solo para verse: no se abren (ver MosaicoMuestra). */}
        <Flex direction="column" align="center" w="100%" maxW="1180px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion maxW="1180px">Lo que hay dentro</SeparadorSeccion>
          <IdeasConMuestra d={d} ideas={IDEAS}>
            <MosaicoMuestra d={d} fotos={temasMuestra} />
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

      {/* Sistema abierto: el mismo popup inmersivo del recorrido, con flechas
          para recorrer los doce. */}
      {/* Solo los cuatro de la muestra: las flechas no destapan los doce (para
          eso está el recorrido). */}
      <SistemaModal
        sistema={sistema}
        sistemas={SISTEMAS_MUESTRA}
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
