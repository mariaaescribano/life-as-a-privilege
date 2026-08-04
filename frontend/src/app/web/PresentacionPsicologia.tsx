import React, { useMemo, useRef, useState } from "react";
import { Box, Flex, Grid, SimpleGrid, Text } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { ComicModal } from "../../components/metodo/ComicModal";
import { IlustracionCard } from "../../components/metodo/IlustracionCard";
import {
  CursoCard,
  STRIPE_PAYMENT_LINK_CURSOS_PSICOLOGIA,
} from "../../components/metodo/CursosPsicologiaModal";
import { PsicologiaLoader } from "../../components/metodo/comicLoaders";
import { recordarOrigenCurso } from "../../components/global/VolverAlMapa";
import { useCursosData } from "../../data/cursosApi";
import type { Curso } from "../../hardCoded/cursos";
import {
  ILUSTRACIONES,
  PSICOLOGIA_COMICS_RECORRIDO,
  type IlustracionEntry,
} from "../../components/metodo/ilustracionesGaleria";
import {
  BLANCO_GLOW_SUAVE,
  CierreCrearCuenta,
  SeparadorSeccion,
  VideoMuestra,
} from "../../components/metodo/presentacionUi";
import { NeuropsicologiaIcon, neuropsicologiaBg, neuropsicologiaNom } from "../../GlobalVariables";
import type { PresentacionDisciplina } from "../../data/presentacionDisciplinas";

// ─────────────────────────────────────────────────────────────────────────────
// /d/psicologia — presentación de Psicología (destino del QR de su cartel).
//
// Aquí el peso lo llevan los CÓMICS: son lo que hace que un psicólogo entienda
// de qué material está hecho el recorrido y que una persona vea dónde se mete.
//
// Orden:
//   1. Header de la disciplina, sin botones.
//   2. El box de la disciplina con su precio + el vídeo al lado.
//   3. «Basado en la Psicoterapia Breve»: las herramientas del recorrido, una a
//      una, con su nombre y su referencia cuando la tiene (ACE, Línea de Vida…).
//   4. Los cómics, grandes, a dos columnas.
//   5. Llamada a la acción.
// ─────────────────────────────────────────────────────────────────────────────

/** Las nueve herramientas que se enseñan, en el orden en que se atraviesan.
 *  Salen de psicologiaRecorrido.ts (RECORRIDO_INDICE y sus bloques de datos):
 *  solo el nombre de cada una, sin explicaciones, y nueve exactas para que la
 *  rejilla salga cuadrada (3 × 3). El recorrido tiene más pasos: estos son los
 *  que lo cuentan. */
const HERRAMIENTAS: string[] = [
  "Test ACE",
  "Línea de Vida",
  "Las Huellas",
  "Los Nudos",
  "Necesidades del niño",
  "Heridas",
  "Narra",
  "Integración",
  "Dones",
];

export default function PresentacionPsicologia({ d }: { d: PresentacionDisciplina }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [abierta, setAbierta] = useState<IlustracionEntry | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Los cómics de Psicología: los dos de la galería + los cuatro que van
  // intercalados en el recorrido (esos no están en /ilustraciones a propósito,
  // pero aquí son justamente los que explican el método).
  const comics = useMemo(() => {
    const galeria = ILUSTRACIONES.filter((i) => i.disciplina === d.ilustracionesLabel);
    const intro = galeria.filter((i) => i.id === "psicologia-intro");
    // Cuatro, no todas: el bloque tiene que abrir el apetito, no vaciar la
    // despensa. El origen del sufrimiento + los tres que explican el método.
    return [...intro, ...PSICOLOGIA_COMICS_RECORRIDO].slice(0, 4);
  }, [d.ilustracionesLabel]);

  // Cuatro cursos de Psicología, los más recientes. El resto, en su página.
  // Cuatro y no tres porque la rejilla llega a 4 columnas en pantalla ancha y
  // así la fila queda completa; en tablet se ven 2 y en ordenador normal 3.
  const { cursosData, loading: cargandoCursos } = useCursosData();
  const cursos = useMemo(() => {
    const todos = [...(cursosData[neuropsicologiaNom]?.cursos ?? [])].sort(
      (a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
    );
    return { visibles: todos.slice(0, 4), total: todos.length };
  }, [cursosData]);

  const abrirCurso = (curso: Curso) => {
    if (curso.precio === null) {
      recordarOrigenCurso();
      navigate(`${curso.cursoLink}?volver=${encodeURIComponent(location.pathname)}`);
    } else {
      window.open(STRIPE_PAYMENT_LINK_CURSOS_PSICOLOGIA, "_blank");
    }
  };

  const fotosListas = useImagesReady([
    "/img/icono/life.png",
    "/img/fondos/psciologia.webp",
    ...comics.map((c) => c.cover),
  ]);
  if (!fotosListas) return <LifeLoading variant="auto" />;

  const sombra = sombraTexto(d.nom, d.bg);
  const renderIcon = (size: string) => <NeuropsicologiaIcon size={{ base: size, md: size }} />;

  // El box va con `sinBoton`, así que esto solo entra en juego si algún día se
  // vuelve a enseñar el botón de muestra: pone en marcha el vídeo de al lado.
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
            icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
            title={neuropsicologiaNom}
            bgColor={neuropsicologiaBg}
            color={d.txt}
            nom={neuropsicologiaNom}
            maxW="900px"
            mb={0}
            // Psicología añade por defecto un botón «Cursos» al header. Aquí no:
            // los cursos tienen su propio bloque más abajo, en la página.
            hideCursos
          />
        </Reveal>

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
              nom={neuropsicologiaNom}
              bg={neuropsicologiaBg}
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

        {/* ══ 3. BASADO EN LA PSICOTERAPIA BREVE ══
            Las herramientas del recorrido con su nombre. Es el bloque que un
            profesional lee para decidir si esto le sirve. */}
        <Flex direction="column" align="center" w="100%" maxW="1100px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion maxW="1100px">Basado en la Psicoterapia Breve</SeparadorSeccion>

          {/* Nueve mini boxes, 3 × 3, SUELTOS sobre el turquesa (sin caja
              contenedora). Cada uno lleva el fondo de la disciplina, que es lo
              que hace legible su letra. Se encienden uno a uno cuando la rejilla
              asoma en pantalla: entran desenfocados y creciendo, no de golpe. */}
          <RevealStagger
            inView
            stagger={0.085}
            delayChildren={0.12}
            amount={0.2}
            w="100%"
            display="grid"
            gridTemplateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
            gap={{ base: 4, md: 6 }}
          >
            {HERRAMIENTAS.map((h) => (
              <RevealItem
                key={h}
                direction="up"
                distance={20}
                scaleFrom={0.94}
                blur
                duration={0.7}
                position="relative"
                overflow="hidden"
                display="flex"
                alignItems="center"
                justifyContent="center"
                minH={{ base: "96px", md: "132px" }}
                px={{ base: 3, md: 5 }}
                py={{ base: 4, md: 6 }}
                textAlign="center"
                borderRadius="2xl"
                border={`1.5px solid ${d.txt}66`}
                sx={{
                  boxShadow: `0 0 0 1px ${d.txt}33, 0 0 26px ${d.txt}3d, 0 0 60px ${d.txt}1f`,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
                  _hover: {
                    transform: "translateY(-5px)",
                    borderColor: d.txt,
                    boxShadow: `0 0 0 1px ${d.txt}55, 0 0 34px ${d.txt}77, 0 0 76px ${d.txt}44`,
                  },
                }}
              >
                <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                <Text
                  position="relative"
                  zIndex={1}
                  color={d.txt}
                  fontSize={{ base: "md", md: "xl" }}
                  fontWeight="700"
                  letterSpacing="0.02em"
                  lineHeight="1.25"
                  textShadow={sombra}
                >
                  {h}
                </Text>
              </RevealItem>
            ))}
          </RevealStagger>
        </Flex>

        {/* ══ 4. LOS CÓMICS, grandes ══
            Dos columnas y a todo lo ancho de la tarjeta: aquí es donde se
            entiende de verdad dónde se mete quien empieza. */}
        {comics.length > 0 && (
          <Flex direction="column" align="center" w="100%" maxW="1000px" gap={{ base: 6, md: 8 }}>
            <SeparadorSeccion>Ilustraciones de Psicología</SeparadorSeccion>
            <Reveal inView direction="up" distance={16} duration={0.7}>
              <Text
                color="rgba(255,255,255,0.9)"
                fontSize={{ base: "md", md: "lg" }}
                fontStyle="italic"
                textAlign="center"
                lineHeight="1.6"
                maxW="680px"
                textShadow={BLANCO_GLOW_SUAVE}
              >
                Los cómics que acompañan cada paso del recorrido. Pulsa cualquiera para leerlo
                entero: son los mismos que se encuentran dentro.
              </Text>
            </Reveal>
            <Grid w="100%" templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={{ base: 6, md: 8 }}>
              {comics.map((entry, i) => (
                <IlustracionCard
                  key={entry.id}
                  entry={entry}
                  i={i}
                  columnas={2}
                  onOpen={() => setAbierta(entry)}
                />
              ))}
            </Grid>
          </Flex>
        )}

        {/* ══ 5. CURSOS ══
            Tres, y una flecha a la página con todos. No están para venderse
            aquí: están para que se vea que el recorrido no se acaba en sí mismo. */}
        <Flex direction="column" align="center" w="100%" maxW="1180px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion>Cursos de Psicología</SeparadorSeccion>

          {/* La rejilla espera a que lleguen los cursos del catálogo; mientras,
              la animación de espera de Psicología. El botón de abajo NO espera:
              si el catálogo falla, sigue habiendo por dónde entrar. */}
          {cargandoCursos ? (
            <Flex w="100%" minH={{ base: "160px", md: "220px" }} align="center" justify="center">
              <PsicologiaLoader />
            </Flex>
          ) : cursos.visibles.length > 0 ? (
            // Las tarjetas NO van envueltas en <Reveal inView>: CursoCard ya trae
            // su propia entrada (fadeInScale, escalonada con `delay`), y añadir
            // encima un whileInView sobre contenido que se monta DESPUÉS de la
            // carga es la forma de que se queden invisibles si el observer no
            // dispara. Una sola animación, la de la tarjeta.
            <SimpleGrid
              w="100%"
              columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
              spacing={{ base: 5, md: 6 }}
              alignItems="start"
            >
              {cursos.visibles.map((curso, i) => (
                <CursoCard
                  key={curso.id}
                  curso={curso}
                  onAcceder={() => abrirCurso(curso)}
                  delay={`${i * 0.08}s`}
                />
              ))}
            </SimpleGrid>
          ) : (
            // Nunca en silencio: si el catálogo no trae cursos (o la llamada
            // falló), se dice. Un hueco vacío parece un fallo de la web.
            <Text
              color="rgba(255,255,255,0.9)"
              fontSize={{ base: "md", md: "lg" }}
              fontStyle="italic"
              textAlign="center"
              textShadow={BLANCO_GLOW_SUAVE}
            >
              Los cursos se están preparando. Entra a verlos con el botón de abajo.
            </Text>
          )}

          {/* «Mucho más en el interior…» + flecha a la página de cursos */}
            <Reveal inView direction="up" distance={16} duration={0.65}>
              <Flex
                as="button"
                onClick={() => navigate(`/aprendizaje/cursos/${encodeURIComponent(neuropsicologiaNom)}`)}
                align="center"
                justify="center"
                gap={{ base: 3, md: 4 }}
                px={{ base: 6, md: 9 }}
                py={{ base: 3, md: 3.5 }}
                borderRadius="full"
                border={`1.5px solid ${d.txt}aa`}
                bg={`${d.txt}1f`}
                color={d.txt}
                cursor="pointer"
                boxShadow={`0 0 18px ${d.txt}44`}
                transition="all 0.25s ease"
                _hover={{
                  bg: `${d.txt}33`,
                  borderColor: d.txt,
                  transform: "translateY(-2px)",
                  boxShadow: `0 0 26px ${d.txt}77`,
                }}
                _active={{ transform: "translateY(0)" }}
              >
                <Text
                  fontSize={{ base: "md", md: "xl" }}
                  fontStyle="italic"
                  letterSpacing="0.04em"
                  textShadow={sombra}
                >
                  Mucho más en el interior…
                </Text>
                <Box
                  as="svg"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  w={{ base: "20px", md: "24px" }}
                  h={{ base: "20px", md: "24px" }}
                  fill="currentColor"
                  flexShrink={0}
                >
                  <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                </Box>
              </Flex>
            </Reveal>
        </Flex>

        {/* ══ 6. LLAMADA A LA ACCIÓN ══ */}
        <Flex direction="column" align="center" w="100%" maxW="900px" gap={{ base: 6, md: 8 }}>
          <SeparadorSeccion>Empieza por aquí</SeparadorSeccion>
          <CierreCrearCuenta d={d} />
        </Flex>

        <SubscribeBox />
      </Flex>

      <SiteFooter />

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
