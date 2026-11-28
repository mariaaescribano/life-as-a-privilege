import React, { useEffect, useState } from "react";
import { Box, Flex, Grid, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { Reveal } from "../../components/global/Reveal";
import { focoBlanco } from "../../components/global/foco";
import { sombraTexto } from "../../components/global/disciplinaSombras";
import { BotonPaso } from "../../components/metodo/BotonPaso";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../../components/global/DisciplinaBgLayer";
import { presentacionPorKey, type PresentacionDisciplina } from "../../data/presentacionDisciplinas";
import { AprendizajeIcon, FONDO_PAGINA_BEIGE, FONDO_PAGINA_TURQUESA } from "../../GlobalVariables";
import { TusCelulasModal } from "../../components/metodo/TusCelulasModal";
import FotoDisciplina from "../../components/web/FotoDisciplina";
import LineaTiempoAstrologia from "../../components/web/LineaTiempoAstrologia";
import QueEsCartaAstral from "../../components/web/QueEsCartaAstral";
import AutoresAstrologia from "../../components/web/AutoresAstrologia";
import ArteAstrologia from "../../components/web/ArteAstrologia";
import { AUTORES_ASTROLOGIA, CRITICOS_ASTROLOGIA } from "../../data/autoresAstrologia";
import WelcomeCabecera from "../../components/welcome/WelcomeCabecera";
import { useCabeceraEscribiendo } from "../../components/global/cabeceraEntrada";
import { useNombreDisciplina } from "../../i18n/nombreDisciplina";
import { getUserMe } from "../../api/userMe";
import { useIdioma, useT } from "../../i18n";
import TextoRico from "../../components/global/TextoRico";
import PalabrasVivas from "../../components/global/PalabrasVivas";
import FotoViva from "../../components/global/FotoViva";

/** Lo que tarda en encenderse la foto de fondo de una banda (FondoBanda, 0,5 s): lo de encima entra DESPUÉS, nunca antes. */
const FONDO_ESPERA = 0.45;
import CarruselCelulas from "../../components/web/CarruselCelulas";
import { FotoBox } from "../../components/metodo/FotoBox";
import { SistemaModal } from "../../components/metodo/SistemaModal";
import { ORIGEN_CIENCIA } from "../../components/metodo/ComicCienciaModal";
import ComicEnLinea from "../../components/web/ComicEnLinea";
import { INTRO_PSICOLOGIA } from "../../components/metodo/comicPsicologiaIntro";
import { useComic } from "../../i18n/comics";
import { type Sistema } from "../../hardCoded/espacio/SistemasFisiologia";
import { useSistemas } from "../../hardCoded/espacio/SistemasFisiologia.en";
import { useTemasProfundiza } from "../../hardCoded/espacio/useTemaProfundiza";
import type { TemaProfundiza } from "../../hardCoded/espacio/ProfundizaFisiologia";
import { TemaProfundizaModal } from "../../components/metodo/TemaProfundizaModal";
import { MandalaTinte } from "../../components/global/MandalaTinte";
import { BotonesLectura } from "../../components/web/QueEsCartaAstral";
import TituloSeccion from "../../components/global/TituloSeccion";
import { BandaParalaje, RayaMandala, FotoPsico, BotonReserva } from "../../components/web/PsicologiaVida";
import LineaTiempoFilosofia from "../../components/web/LineaTiempoFilosofia";

// ─────────────────────────────────────────────────────────────────────────────
// /disciplina/:disciplina — PORTADA COMÚN de una disciplina.
//
// Es el sitio al que se llega al pulsar una disciplina (en la portada, tarjeta o
// «Explorar disciplina →», y en el Mapa). La página es la MISMA para las ocho: el
// nombre de la disciplina de titular y tres puertas en fila —Reels · El
// Recorrido · Teoría—, cada una con el color y el fondo de su disciplina.
//   · Reels: aún no existen; la puerta se ve apagada («Próximamente»).
//   · El Recorrido: la página escaparate del recorrido (/d/<disciplina>), no el
//     recorrido por dentro.
//   · Teoría: /disciplina/<slug>/teoria, la misma cabecera con dos puertas
//     —Ilustraciones y Cursos— y un botón para volver.
//
// SIN PAGAR (o sin sesión) la portada es la de siempre: Ilustraciones · Cursos ·
// El Recorrido («El pack», que lleva a la presentación /d/<disciplina>, donde se
// compra). Reels, El Recorrido de verdad y Teoría solo existen una vez pagada la
// disciplina.
//
// Lo único que cambia entre una y otra sale de `presentacionDisciplinas.ts`
// (colores, icono, frase y a dónde van sus cursos): aquí no hay nada escrito
// disciplina a disciplina, salvo la ruta de su recorrido (RECORRIDO_RUTA).
// ─────────────────────────────────────────────────────────────────────────────

type Puerta = {
  clave: string;
  titulo: string;
  /** Segunda línea pequeña bajo el título («Próximamente» en Reels). */
  pie?: string;
  link: string;
  /** Sin destino todavía: se ve, pero apagada y sin poder pulsarse (Reels). */
  apagada?: boolean;
  delay: number;
  renderIcon: (color: string) => React.ReactNode;
};

/** Icono de ILUSTRACIONES: el marco de foto (el mismo de /materiales). */
const IconoIlustraciones = (color: string) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="52px" height="52px" fill={color}>
    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
  </Box>
);

/** Icono de REELS: la pantalla con el play. */
const IconoReels = (color: string) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="52px" height="52px" fill={color}>
    <path d="m380-300 280-180-280-180v360ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z" />
  </Box>
);

/** Icono de TEORÍA: el libro abierto. */
const IconoTeoria = (color: string) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="52px" height="52px" fill={color}>
    <path d="M480-160q-48-38-104-59t-116-21q-42 0-82.500 11T100-198q-21 11-40.500-1T40-236v-488q0-11 5.500-21T62-760q46-24 96-36t102-12q58 0 113.500 15T480-760q51-30 106.500-45T700-820q52 0 102 12t96 36q11 5 16.500 15t5.500 21v488q0 23-19.500 35t-40.500 1q-37-20-77.500-31T700-240q-60 0-116 21t-104 59Zm0-80q42-26 87-40t93-14q36 0 70.500 7t69.500 20v-398q-33-14-68.500-21t-71.500-7q-48 0-93 14t-87 40v399Zm-40 0v-399q-42-26-87-40t-93-14q-36 0-71.500 7T120-682v398q35-13 69.500-20t70.500-7q48 0 93 14t87 40Z" />
  </Box>
);

/** Clave de la portada → scope de pago (el de `<scope>_suscrito` en /user/me). */
const SCOPE_PAGO: Record<string, string> = {
  astrologia: "metodo",
  psicologia: "psicologia",
  ayurveda: "ayurveda",
  medicinachina: "tcm",
  fisiologia: "fisiologia",
  nutricion: "nutricion",
  cabala: "cabala",
  cultura: "cultura",
};

/** ¿Tiene pagada esta disciplina? null = todavía comprobando. */
function usePagada(key: string): boolean | null {
  const [pagada, setPagada] = useState<boolean | null>(null);
  useEffect(() => {
    let vivo = true;
    let uid: string | null = null;
    try { uid = localStorage.getItem("userId"); } catch { /* modo privado */ }
    // Sin sesión: no hay nada pagado.
    if (!uid) { setPagada(false); return; }
    // Fresca: puede que acabe de pagar y la caché de 5 min diga que no.
    getUserMe({ fresca: true })
      .then(({ data }) => {
        if (vivo) setPagada(data?.[`${SCOPE_PAGO[key] ?? key}_suscrito`] === true);
      })
      // Sin red: se enseña la de siempre; el pago lo vigila el guardia aparte.
      .catch(() => { if (vivo) setPagada(false); });
    return () => { vivo = false; };
  }, [key]);
  return pagada;
}

/** Las portadas de Profundiza que se enseñan en la portada de Fisiología. */
const PORTADAS_PROFUNDIZA = ["cerebro", "hormonas", "metabolismo", "inmunitario"];

function Portada({ d, modo = "portada" }: { d: PresentacionDisciplina; modo?: "portada" | "teoria" }) {
  const navigate = useNavigate();
  const t = useT();
  const { segunIdioma } = useIdioma();
  const conFondo = hasDisciplinaBg(d.nom);
  // Astrología tiene su propia portada: cuatro cajas de servicios sobre su foto, con letra beige y sin la raya del mandala.
  const esAstro = d.key === "astrologia" && modo === "portada";
  // Fisiología también tiene su propia portada: un texto de apertura en grande, sin puertas por ahora.
  const esFisio = d.key === "fisiologia" && modo === "portada";
  // Filosofía (en el menú; la disciplina interna es Cultura): apertura, cinco citas sobre su foto y un cierre.
  const esFilo = d.key === "cultura" && modo === "portada";
  // Psicología: su portada propia (mármol de la disciplina con foto a la izquierda, texto con foto a la derecha, el origen del sufrimiento y el botón).
  const esPsico = d.key === "psicologia" && modo === "portada";
  const [celulasAbierto, setCelulasAbierto] = useState(false);
  const [sistemaAbierto, setSistemaAbierto] = useState<Sistema | null>(null);
  const [temaAbierto, setTemaAbierto] = useState<TemaProfundiza | null>(null);
  // Sistemas (dos filas de cuatro) y portadas de Profundiza, en el idioma activo.
  const sistemasPortada = useSistemas().slice(0, 4);
  const temasProfundiza = useTemasProfundiza();
  const portadasProfundiza = PORTADAS_PROFUNDIZA.map((k) => temasProfundiza.find((x) => x.key === k)).filter((x): x is NonNullable<typeof x> => !!x);
  // El cómic del origen según la ciencia, en el idioma activo.
  const vinetasCiencia = useComic("origen-ciencia", ORIGEN_CIENCIA);
  const vinetasSufrimiento = useComic("psicologia-intro", INTRO_PSICOLOGIA);
  const nombreDe = useNombreDisciplina();
  // Secuencia de entrada: mandala, título, frase, línea con mandala... y DESPUÉS la banda con
  // la foto de la disciplina de fondo (la cabecera avisa cuando termina), y luego su contenido.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(id);
  }, []);
  const cabeceraEscribiendo = useCabeceraEscribiendo();
  const banda = mounted && !cabeceraEscribiendo;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  // Izquierda · centro · derecha (en móvil se apilan en el mismo orden).
  const puertasPortada: Puerta[] = [
    {
      clave: "reels",
      titulo: t("portada.reels"),
      pie: t("comun.proximamente"),
      link: "",
      apagada: true,
      delay: 0.05,
      renderIcon: IconoReels,
    },
    // APARCADO (nov-2026): la puerta «El Recorrido» llevaba a /d/<slug>, que está comentado.
    // {
    //   clave: "recorrido",
    //   titulo: t("portada.recorrido"),
    //   link: `/d/${d.key}`,
    //   delay: 0.15,
    //   renderIcon: () => <d.Icon size="52px" />,
    // },
    {
      clave: "teoria",
      titulo: t("portada.teoria"),
      link: `/disciplina/${d.key}/teoria`,
      delay: 0.25,
      renderIcon: IconoTeoria,
    },
  ];
  // Dentro de Teoría: lo que ya existía, las ilustraciones y los cursos.
  const puertasTeoria: Puerta[] = [
    {
      clave: "ilustraciones",
      titulo: t("portada.ilustraciones"),
      link: `/ilustraciones/${d.key}`,
      delay: 0.05,
      renderIcon: IconoIlustraciones,
    },
    {
      clave: "cursos",
      titulo: t("portada.cursos"),
      link: `/aprendizaje/cursos/${d.cursosLink}`,
      delay: 0.15,
      renderIcon: (color) => <AprendizajeIcon color={color} size="52px" shadow={false} />,
    },
  ];
  // La de siempre, para quien no ha pagado: Ilustraciones · Cursos · El Recorrido.
  const puertasSinPagar: Puerta[] = [
    { ...puertasTeoria[0], delay: 0.05 },
    { ...puertasTeoria[1], delay: 0.15 },
    // APARCADO (nov-2026): la puerta del pack llevaba a /d/<slug>, que está comentado.
    // {
    //   clave: "recorrido",
    //   titulo: t("portada.contenidoAsesoramiento"),
    //   pie: t("portada.recorridoPack"),
    //   link: `/d/${d.key}`,
    //   delay: 0.25,
    //   renderIcon: () => <d.Icon size="52px" />,
    // },
  ];
  // Disciplinas cuya página aún no está disponible (clave de la disciplina).
  const NO_DISPONIBLES = new Set(["fisiologia", "cultura"]);
  const pagada = usePagada(d.key);
  // La Teoría solo se ve pagada: si alguien llega por la URL sin pagar, vuelve a la portada.
  useEffect(() => {
    if (modo === "teoria" && pagada === false) navigate(`/disciplina/${d.key}`, { replace: true });
  }, [modo, pagada, d.key, navigate]);
  const puertas = pagada === false ? puertasSinPagar : modo === "teoria" ? puertasTeoria : puertasPortada;

  return (
    // minH + columna + contenido flex=1: el footer se queda abajo aunque la
    // página sea corta (tres cajas y poco más).
    <Box minH="100vh" display="flex" flexDirection="column" bg="#F0DCC0" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      {/* ── CABECERA: mandala, nombre de la disciplina, su frase y la línea con el mandala pequeño ── */}
      <WelcomeCabecera activo={mounted} titulo={esFilo ? t("header.filosofia") : nombreDe(d.nom)} subtitulo={esAstro ? t("astroVision.frase") : esPsico ? t("psicoPortada.frase") : esFisio ? t("fisioPortada.frase") : esFilo ? t("filoPortada.frase") : segunIdioma(d.gancho)} mayusculas sinSeparador={esAstro || esFisio || esFilo || esPsico} />

      {/* Fisiología: los tres primeros bloques sobre la foto de la disciplina (difuminada arriba y abajo, letra
          de la disciplina con su sombra) y el resto debajo, en grande, sobre el beige (letra chocolate). */}
      {esFisio ? (
        <Box flex={1}>
          {/* Primer box: foto de la disciplina de fondo; el texto a la izquierda y la foto a la derecha. */}
          <Box position="relative" mt={{ base: 8, md: 14 }} pt={{ base: "88px", md: "120px" }} pb={{ base: "88px", md: "120px" }}>
            <FondoBanda nom={d.nom} visible={banda} />
            <Flex position="relative" zIndex={1} direction={{ base: "column", md: "row" }} align="center" gap={{ base: 10, md: 12, lg: 16 }} maxW="1180px" mx="auto" w="100%" px={{ base: 6, md: 10, lg: 16 }}>
              <Flex direction="column" flex="1" minW={0} gap={{ base: 6, md: 8 }} align={{ base: "center", md: "flex-start" }} textAlign={{ base: "center", md: "left" }} order={{ base: 1, md: 0 }}>
                {/* Nada entra antes que el fondo: todo espera a `banda` (+ lo que tarda en encenderse la foto). */}
                {(["fisioPortada.p1", "fisioPortada.p1b", "fisioPortada.p2"] as const).map((k, i) => (
                  <Reveal key={k} inView listo={banda} direction="right" distance={30} blur duration={1} delay={FONDO_ESPERA + i * 0.35}>
                    <Text color={d.txt} textShadow={sombraTexto(d.nom, d.bg)} fontSize={{ base: "lg", md: "xl", lg: "2xl" }} lineHeight="1.55" letterSpacing="0.01em">
                      <PalabrasVivas texto={t(k)} cursivas listo={banda} retraso={FONDO_ESPERA + 0.1 + i * 0.5} total={1.5} />
                    </Text>
                  </Reveal>
                ))}
                <Reveal inView listo={banda} direction="right" distance={30} blur duration={1} delay={FONDO_ESPERA + 0.7}>
                  <Flex direction="column" gap={3} align={{ base: "center", md: "flex-start" }}>
                    <Text color={d.txt} textShadow={sombraTexto(d.nom, d.bg)} fontSize={{ base: "lg", md: "xl", lg: "2xl" }} lineHeight="1.55">
                      <PalabrasVivas texto={t("fisioPortada.cita")} cursivas listo={banda} retraso={FONDO_ESPERA + 0.8} total={1.2} />
                    </Text>
                    {/* La raya nace junto a la cita y se extiende; después, el autor. */}
                    <Reveal inView listo={banda} direction="none" duration={1.2} delay={FONDO_ESPERA + 1.9} w="100%" maxW="220px">
                      <Box h="1px" w="100%" style={{ background: `linear-gradient(to right, ${d.txt}cc, ${d.txt}00)` }} />
                    </Reveal>
                    <Reveal inView listo={banda} direction="up" distance={10} blur duration={0.9} delay={FONDO_ESPERA + 2.2}>
                      <Text color={d.txt} textShadow={sombraTexto(d.nom, d.bg)} fontSize={{ base: "md", md: "lg" }} letterSpacing="0.02em">
                        <TextoRico texto={t("fisioPortada.citaAutor")} />
                      </Text>
                    </Reveal>
                  </Flex>
                </Reveal>
              </Flex>
              {/* El cuerpo: se descorre desde la derecha, se asienta con zoom, lo cruza un destello y se inclina hacia el ratón. */}
              <Box w={{ base: "260px", md: "340px", lg: "400px" }} flexShrink={0} order={{ base: 0, md: 1 }}>
                <FotoViva desde="der" listo={banda} delay={FONDO_ESPERA} radio="22px" border={`1.5px solid ${d.txt}`}>
                  <Image src="/img/disciplinas/fisiologia-cuerpo.webp" alt="" w="100%" h="auto" display="block" loading="lazy" />
                </FotoViva>
              </Box>
            </Flex>
          </Box>

          {/* Sobre el beige: la frase a todo lo ancho, en cursiva y negrita. */}
          <Reveal inView direction="up" distance={20} duration={1} w="100%">
            <Text color={FONDO_PAGINA_TURQUESA} textAlign="center" fontStyle="italic" fontWeight="700" w="100%" px={{ base: 6, md: 10, lg: 16 }} py={{ base: 14, md: 20 }} fontSize={{ base: "xl", md: "2xl", lg: "3xl" }} lineHeight="1.4" letterSpacing="0.01em">
              <PalabrasVivas texto={t("fisioPortada.p3")} total={1.6} />
            </Text>
          </Reveal>

          {/* Otra banda con la foto de la disciplina: «Descubres la grandeza…» y el siguiente párrafo. */}
          <Box position="relative" mb={{ base: "40px", md: "88px" }} pt={{ base: "88px", md: "120px" }} pb={{ base: "88px", md: "120px" }}>
            <FondoBanda nom={d.nom} visible={banda} />
            <Flex position="relative" zIndex={1} direction={{ base: "column", md: "row" }} align="center" gap={{ base: 10, md: 12, lg: 16 }} maxW="1180px" mx="auto" w="100%" px={{ base: 6, md: 10, lg: 16 }}>
              {/* Izquierda: las fotos de «Tus células», cambiando solas. */}
              <Box w={{ base: "260px", md: "340px", lg: "400px" }} flexShrink={0}>
                <FotoViva desde="izq" listo={banda} delay={FONDO_ESPERA} radio="22px" border={`1.5px solid ${d.txt}`} sx={{ aspectRatio: "1 / 1" }}>
                  <CarruselCelulas color={d.txt} conBorde={false} />
                </FotoViva>
              </Box>
              <Flex direction="column" flex="1" minW={0} gap={{ base: 6, md: 8 }} align={{ base: "center", md: "flex-start" }} textAlign={{ base: "center", md: "left" }}>
                {(["fisioPortada.p4", "fisioPortada.p5"] as const).map((k, i) => (
                  <Reveal key={k} inView listo={banda} direction="left" distance={30} blur duration={1} delay={FONDO_ESPERA + i * 0.35}>
                    <Text color={d.txt} textShadow={sombraTexto(d.nom, d.bg)} fontSize={{ base: "lg", md: "xl", lg: "2xl" }} lineHeight="1.55" letterSpacing="0.01em">
                      <PalabrasVivas texto={t(k)} cursivas listo={banda} retraso={FONDO_ESPERA + 0.1 + i * 0.5} total={1.5} />
                    </Text>
                  </Reveal>
                ))}
              </Flex>
            </Flex>
          </Box>

          {/* Debajo: «Mis células». Botón grande con la foto de Fisiología de fondo y el mandala a la izquierda;
              abre el popup inmersivo con todas las células. */}
          <Reveal inView direction="up" distance={20} scaleFrom={0.95} duration={1} w="100%" display="flex" justifyContent="center">
            <Box
              as="button"
              type="button"
              onClick={() => setCelulasAbierto(true)}
              role="group"
              position="relative"
              overflow="hidden"
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={{ base: 4, md: 6 }}
              w={{ base: "calc(100% - 48px)", md: "auto" }}
              maxW="560px"
              minW={{ md: "400px" }}
              px={{ base: 8, md: 12 }}
              py={{ base: 4, md: 5 }}
              mb={{ base: 14, md: 20 }}
              borderRadius="full"
              fontFamily="'EB Garamond', serif"
              cursor="pointer"
              boxShadow={`0 0 26px ${d.bg}88, 0 0 60px ${d.bg}44`}
              transition="transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease"
              _hover={{ transform: "translateY(-4px)", boxShadow: `0 0 34px ${d.bg}bb, 0 0 80px ${d.bg}66` }}
              _active={{ transform: "translateY(-1px) scale(0.985)" }}
              _focusVisible={focoBlanco}
            >
              {/* La foto de la disciplina, a resolución completa; respira con un zoom lento al pasar el puntero. */}
              <Box position="absolute" inset={0} transition="transform 1.2s cubic-bezier(0.22,1,0.36,1)" _groupHover={{ transform: "scale(1.08)" }}>
                <DisciplinaBgLayer nom={d.nom} borderRadius="full" />
              </Box>
              <Box position="relative" zIndex={1} transition="transform 1.4s cubic-bezier(0.22,1,0.36,1)" _groupHover={{ transform: "rotate(45deg) scale(1.08)" }}>
                <MandalaTinte h={{ base: "34px", md: "42px" }} color={FONDO_PAGINA_BEIGE} />
              </Box>
              <Text
                position="relative"
                zIndex={1}
                color={d.txt}
                textShadow={sombraTexto(d.nom, d.bg)}
                fontWeight="700"
                fontSize={{ base: "lg", md: "2xl" }}
                letterSpacing="0.16em"
                textTransform="uppercase"
                whiteSpace="nowrap"
              >
                {t("fisioPortada.boton")}
              </Text>
            </Box>
          </Reveal>

          {/* Sistemas del cuerpo (primera fila) y, como segunda fila de la misma rejilla, las portadas de Profundiza (al pulsar, popup
              inmersivo con el contenido del tema). Tarjetas vivas: zoom, brillo y subida al pasar el puntero. */}
          <Box w="100%" maxW="1560px" mx="auto" px={{ base: 3, md: 6, lg: 8 }} pb={{ base: 16, md: 24 }}>
            <SimpleGrid columns={{ base: 1, md: 4 }} spacingX={{ base: 0, md: 3 }} spacingY={{ base: 5, md: 10 }}>
              {sistemasPortada.map((s, i) => (
                <Reveal key={s.key} inView once amount={0.2} direction="up" distance={40} scaleFrom={0.94} blur duration={0.9} delay={0.08 + (i % 4) * 0.14} display="flex">
                  <FotoBox
                    vivo
                    cuadrada
                    titulo={s.label}
                    foto={s.foto}
                    nom={d.nom}
                    tinta={d.txt}
                    bg={d.bg}
                    glow="0 0 0 rgba(0,0,0,0)"
                    onClick={() => setSistemaAbierto(s)}
                  />
                </Reveal>
              ))}
              {portadasProfundiza.map((tema, i) => (
                <Reveal key={tema.key} inView once amount={0.2} direction="up" distance={40} scaleFrom={0.94} blur duration={0.9} delay={0.08 + (i % 4) * 0.14} display="flex">
                  <FotoBox
                    vivo
                    cuadrada
                    titulo={tema.label}
                    foto={tema.foto}
                    nom={d.nom}
                    tinta={d.txt}
                    bg={d.bg}
                    glow="0 0 0 rgba(0,0,0,0)"
                    onClick={() => setTemaAbierto(tema)}
                  />
                </Reveal>
              ))}
            </SimpleGrid>
            {/* Bajo las ocho tarjetas: una frase pequeña, en cursiva, con dos palabras en negrita. */}
            <Reveal inView once direction="up" distance={14} duration={0.9}>
              <Text mt={{ base: 8, md: 12 }} textAlign="center" fontStyle="italic" color={FONDO_PAGINA_TURQUESA} fontSize={{ base: "md", md: "lg" }} letterSpacing="0.01em" lineHeight="1.5">
                <PalabrasVivas texto={t("fisioPortada.nocurso")} total={1.2} />
              </Text>
            </Reveal>
          </Box>

          {/* Otra banda con la foto de la disciplina: el cómic del origen según la ciencia, leído aquí mismo
              (viñeta a la izquierda, texto a la derecha y flechas para pasar). */}
          <Box position="relative" mb={{ base: "56px", md: "96px" }} pt={{ base: "88px", md: "120px" }} pb={{ base: "88px", md: "120px" }}>
            <FondoBanda nom={d.nom} visible={banda} />
            <Box position="relative" zIndex={1}>
              <Box px={{ base: 5, md: 10, lg: 14 }} mb={{ base: 10, md: 14 }}>
                <TituloSeccion color={d.txt} grande>{t("fisioPortada.origen")}</TituloSeccion>
              </Box>
              <ComicEnLinea vinetas={vinetasCiencia} color={d.txt} sombra={sombraTexto(d.nom, d.bg)} />
            </Box>
          </Box>

          {/* Debajo del cómic, sobre el beige: la frase de las sesiones a todo lo ancho y, debajo, el botón alargado
              (sin relleno: solo el borde y el texto) para pedir la primera llamada. */}
          <Flex
            direction="column"
            align="center"
            gap={{ base: 8, md: 10 }}
            maxW="1180px"
            mx="auto"
            w="100%"
            px={{ base: 6, md: 10, lg: 16 }}
            pb={{ base: 20, md: 28 }}
          >
            <Reveal inView direction="up" distance={16} duration={0.9} delay={0.15}>
              <Flex
                as="button"
                type="button"
                onClick={() => navigate("/reservar-cita")}
                align="center"
                justify="center"
                gap={{ base: 4, md: 6 }}
                px={{ base: 8, md: 10 }}
                py="14px"
                borderRadius="full"
                bg="transparent"
                color={FONDO_PAGINA_TURQUESA}
                border={`1.5px solid ${FONDO_PAGINA_TURQUESA}`}
                fontFamily="'EB Garamond', serif"
                fontWeight="700"
                fontSize={{ base: "md", md: "lg" }}
                letterSpacing="0.16em"
                textTransform="uppercase"
                textAlign="left"
                lineHeight="1.3"
                cursor="pointer"
                transition="transform 0.3s cubic-bezier(0.22,1,0.36,1), background 0.3s ease"
                _hover={{ transform: "translateY(-2px)", bg: `${FONDO_PAGINA_TURQUESA}14` }}
                _active={{ transform: "translateY(0) scale(0.99)" }}
                _focusVisible={focoBlanco}
              >
                <MandalaTinte h="26px" color={FONDO_PAGINA_TURQUESA} />
                {t("welcome.hero.pedirCita")}
              </Flex>
            </Reveal>
          </Flex>
        </Box>
      ) : esFilo ? (
        <Box flex={1}>
          {/* Apertura: el mármol de Filosofía, la foto a la izquierda y los tres textos a la derecha. */}
          <Box position="relative" mt={{ base: 8, md: 14 }} pt={{ base: "88px", md: "120px" }} pb={{ base: "88px", md: "120px" }}>
            <FondoBanda nom={d.nom} visible={banda} src="/img/fondos/filosofia-marmol.webp" deriva />
            <Flex position="relative" zIndex={1} direction={{ base: "column", md: "row" }} align="center" gap={{ base: 10, md: 12, lg: 16 }} maxW="1180px" mx="auto" w="100%" px={{ base: 6, md: 10, lg: 16 }}>
              <FotoPsico src="/img/disciplinas/filosofia-estatua.webp" desde="izq" listo={banda} color={d.txt} respira />
              <Flex direction="column" flex="1" minW={0} gap={{ base: 6, md: 8 }} align={{ base: "center", md: "flex-start" }} textAlign={{ base: "center", md: "left" }}>
                {(["filoPortada.p1", "filoPortada.p1b", "filoPortada.cierre", "filoLinea.t1", "filoLinea.t2", "filoLinea.t3"] as const).map((k, i) => (
                  <Reveal key={k} inView listo={banda} direction="left" distance={30} blur duration={1} delay={FONDO_ESPERA + i * 0.35}>
                    <Text color={d.txt} textShadow={sombraTexto(d.nom, d.bg)} fontSize={{ base: "lg", md: "lg", lg: "xl" }} lineHeight="1.55" letterSpacing="0.01em">
                      <PalabrasVivas texto={t(k)} cursivas listo={banda} retraso={FONDO_ESPERA + 0.1 + i * 0.5} total={1.5} />
                    </Text>
                  </Reveal>
                ))}
              </Flex>
            </Flex>
          </Box>

          {/* Sobre el beige: los grandes pensadores en una línea del tiempo que acaba en «Tú · Hoy», el mensaje y el botón. */}
          <Box pt={{ base: 16, md: 24 }}>
            <LineaTiempoFilosofia color={FONDO_PAGINA_TURQUESA} />
          </Box>
          <Flex direction="column" align="center" gap={{ base: 6, md: 8 }} maxW="900px" mx="auto" w="100%" px={{ base: 6, md: 10 }} pt={{ base: 14, md: 20 }} pb={{ base: 20, md: 28 }} textAlign="center">
            <Reveal inView once direction="up" distance={16} duration={0.9} delay={0.2}>
              <Flex
                as="button"
                type="button"
                onClick={() => navigate("/reservar-cita")}
                align="center"
                justify="center"
                gap={{ base: 4, md: 6 }}
                mt={{ base: 4, md: 6 }}
                px={{ base: 8, md: 10 }}
                py="14px"
                borderRadius="full"
                color={FONDO_PAGINA_BEIGE}
                style={{ backgroundImage: "url(/img/fondos/marmol-chocolate.webp)", backgroundSize: "cover", backgroundPosition: "center" }}
                fontFamily="'EB Garamond', serif"
                fontWeight="700"
                fontSize={{ base: "md", md: "lg" }}
                letterSpacing="0.16em"
                textTransform="uppercase"
                lineHeight="1.3"
                cursor="pointer"
                position="relative"
                overflow="hidden"
                sx={{
                  "@keyframes destelloBoton": { "0%": { left: "-55%" }, "45%,100%": { left: "130%" } },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    width: "40%",
                    left: "-55%",
                    background: `linear-gradient(105deg, ${FONDO_PAGINA_BEIGE}00, ${FONDO_PAGINA_BEIGE}40, ${FONDO_PAGINA_BEIGE}00)`,
                    animation: "destelloBoton 6s ease-in-out 1.5s infinite",
                    pointerEvents: "none",
                  },
                  "@media (prefers-reduced-motion: reduce)": { "&::after": { animation: "none", opacity: 0 } },
                }}
                transition="transform 0.3s cubic-bezier(0.22,1,0.36,1), filter 0.3s ease"
                _hover={{ transform: "translateY(-2px)", filter: "brightness(1.12)" }}
                _active={{ transform: "translateY(0) scale(0.99)" }}
                _focusVisible={focoBlanco}
              >
                <MandalaTinte h="26px" color={FONDO_PAGINA_BEIGE} />
                {t("welcome.hero.pedirCita")}
              </Flex>
            </Reveal>
          </Flex>
        </Box>
      ) : esPsico ? (
        <Box flex={1}>
          {/* Primer mármol (el fondo de Psicología): la foto a la izquierda y los tres primeros textos a la derecha. */}
          <BandaParalaje nom={d.nom} visible={banda} color={d.txt} mandala="der" mt={{ base: 8, md: 14 }} pt={{ base: "88px", md: "120px" }} pb={{ base: "88px", md: "120px" }}>
            <Flex position="relative" zIndex={1} direction={{ base: "column", md: "row" }} align="center" gap={{ base: 10, md: 12, lg: 16 }} maxW="1180px" mx="auto" w="100%" px={{ base: 6, md: 10, lg: 16 }}>
              <FotoPsico src="/img/psicologia/portada-1.webp" desde="izq" listo={banda} color={d.txt} delay={FONDO_ESPERA} />
              <Flex direction="column" flex="1" minW={0} gap={{ base: 6, md: 8 }} align={{ base: "center", md: "flex-start" }} textAlign={{ base: "center", md: "left" }}>
                {(["psicoPortada.p1", "psicoPortada.p2", "psicoPortada.p3"] as const).map((k, i) => (
                  <Reveal key={k} inView listo={banda} direction="left" distance={30} blur duration={1} delay={FONDO_ESPERA + i * 0.35}>
                    <Text color={d.txt} textShadow={sombraTexto(d.nom, d.bg)} fontSize={{ base: "lg", md: "xl", lg: "2xl" }} lineHeight="1.55" letterSpacing="0.01em">
                      <PalabrasVivas texto={t(k)} listo={banda} retraso={FONDO_ESPERA + 0.1 + i * 0.5} total={1.5} />
                    </Text>
                  </Reveal>
                ))}
              </Flex>
            </Flex>
          </BandaParalaje>

          {/* Un separador: dos rayas que nacen del centro y el mandala en medio. */}
          <Box pt={{ base: 12, md: 20 }}><RayaMandala color={FONDO_PAGINA_TURQUESA} /></Box>

          {/* Sobre el beige: el texto a la izquierda y la foto a la derecha. */}
          <Flex maxW="1180px" mx="auto" w="100%" px={{ base: 6, md: 10, lg: 16 }} pt={{ base: 10, md: 16 }} pb={{ base: 14, md: 24 }} direction={{ base: "column", md: "row" }} align="center" gap={{ base: 10, md: 12, lg: 16 }}>
            <Flex direction="column" flex="1" minW={0} gap={{ base: 6, md: 8 }} align={{ base: "center", md: "flex-start" }} textAlign={{ base: "center", md: "left" }}>
              {(["psicoPortada.p4", "psicoPortada.p5"] as const).map((k, i) => (
                <Reveal key={k} inView direction="right" distance={30} blur duration={1} delay={i * 0.2}>
                  <Text color={FONDO_PAGINA_TURQUESA} fontSize={{ base: "lg", md: "xl", lg: "2xl" }} lineHeight="1.55" letterSpacing="0.01em">
                    <PalabrasVivas texto={t(k)} total={1.5} />
                  </Text>
                </Reveal>
              ))}
            </Flex>
            <FotoPsico src="/img/psicologia/portada-2.webp" desde="der" color={FONDO_PAGINA_TURQUESA} />
          </Flex>

          {/* Segundo mármol: la historia del origen del sufrimiento, con el mismo formato que la de Astrología. */}
          <BandaParalaje nom={d.nom} visible={banda} color={d.txt} mandala="izq" mb={{ base: "56px", md: "96px" }} pt={{ base: "72px", md: "110px" }} pb={{ base: "72px", md: "110px" }}>
            <Box position="relative" zIndex={1}>
              <Box px={{ base: 5, md: 10, lg: 14 }} mb={{ base: 10, md: 14 }}>
                <TituloSeccion color={d.txt} grande>{t("psicoPortada.origen")}</TituloSeccion>
              </Box>
              <ComicEnLinea vinetas={vinetasSufrimiento} color={d.txt} sombra={sombraTexto(d.nom, d.bg)} />
            </Box>
          </BandaParalaje>

          {/* Abajo del todo: el botón de reservar la primera sesión. */}
          <Flex direction="column" align="center" maxW="1180px" mx="auto" w="100%" px={{ base: 6, md: 10, lg: 16 }} pb={{ base: 20, md: 28 }}>
            <Reveal inView direction="up" distance={16} duration={0.9}>
              <BotonReserva onClick={() => navigate("/reservar-cita")} color={FONDO_PAGINA_TURQUESA} ancho="auto">
                <Flex align="center" gap={{ base: 4, md: 5 }}>
                  <MandalaTinte h="26px" color={FONDO_PAGINA_TURQUESA} />
                  {t("welcome.hero.pedirCita")}
                </Flex>
              </BotonReserva>
            </Reveal>
          </Flex>
        </Box>
      ) : NO_DISPONIBLES.has(d.key) ? (
        <Flex flex={1} align="flex-start" justify="center" px={{ base: 5, md: 10 }} pt={{ base: 10, md: 16 }} pb={{ base: 24, md: 32 }}>
          <Text
            color={FONDO_PAGINA_TURQUESA}
            fontFamily="'EB Garamond', serif"
            fontStyle="italic"
            fontSize={{ base: "xl", md: "2xl" }}
            letterSpacing="0.03em"
            textAlign="center"
          >
            {t("portada.noDisponible")}
          </Text>
        </Flex>
      ) : (
      <>
      {/* ── BANDA CON LA FOTO DE LA DISCIPLINA DE FONDO (como el mármol, pero con su foto) ──
          A la izquierda, su foto cuadrada; a la derecha, las puertas apiladas con el mismo
          alto que la foto. */}
      <Box flex={1} position="relative" mt={{ base: 8, md: 14 }} mb={{ base: "40px", md: "88px" }} pt={{ base: esAstro ? "72px" : "104px", md: "110px" }} pb={{ base: esAstro ? "72px" : "116px", md: "120px" }}>
        <FondoBanda nom={d.nom} visible={banda} />

        {esAstro ? (
          <Box position="relative" zIndex={1} w="100%" maxW="1320px" mx="auto" px={{ base: 5, md: 10, lg: 14 }}>
            <LineaTiempoAstrologia activo={banda} />
          </Box>
        ) : (
          <Box position="relative" zIndex={1} w="100%" maxW="1040px" mx="auto" px={{ base: 5, md: 10, lg: 16 }}>
            {pagada !== null && (
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))" }} gap={{ base: 6, md: 9 }} alignItems="stretch">
                <Reveal activo={banda} direction="right" distance={30} scaleFrom={0.95} duration={0.9} delay={0.45}>
                  {/* Misma anchura que las puertas de debajo (en móvil, todo el ancho de la columna). */}
                  <Box w="100%">
                    <FotoDisciplina d={d} />
                  </Box>
                </Reveal>

                <Grid templateRows={{ md: `repeat(${puertas.length}, minmax(0, 1fr))` }} gap={{ base: 4, md: 5 }}>
                  {puertas.map((p, i) => (
                    <Reveal key={p.clave} activo={banda} direction="left" distance={30} scaleFrom={0.97} duration={0.8} delay={0.7 + i * 0.15} h="100%">
                      <Flex
                        // Cada puerta se abre en una PESTAÑA NUEVA (la disciplina se queda donde está
                        // y la persona no se pierde). La apagada (Reels) no lleva enlace.
                        {...(p.apagada ? {} : { as: "a" as const, href: p.link, target: "_blank", rel: "noopener noreferrer" })}
                        textDecoration="none"
                        role="group"
                        w="100%"
                        h="100%"
                        direction="row"
                        align="center"
                        gap={{ base: 4, md: 5 }}
                        position="relative"
                        overflow="hidden"
                        bg="transparent"
                        border={`2px solid ${d.txt}80`}
                        borderRadius="2xl"
                        px={{ base: 5, md: 6 }}
                        py={{ base: 5, md: 4 }}
                        minH={{ base: "104px", md: "0" }}
                        // Transparente: se ve la foto de la banda. Solo el filo del color de la disciplina y,
                        // al pasar el ratón, un velito de ese color y una subida mínima.
                        cursor={p.apagada ? "default" : "pointer"}
                        opacity={p.apagada ? 0.6 : 1}
                        transition="transform 0.28s ease, background 0.28s ease"
                        _hover={
                          p.apagada
                            ? {}
                            : { transform: "translateY(-3px)", bg: `${d.txt}1a`, borderColor: `${d.txt}b3`, textDecoration: "none" }
                        }
                        _focusVisible={focoBlanco}
                      >
                        {/* Icono */}
                        <Box
                          position="relative"
                          zIndex={1}
                          flexShrink={0}
                          w={{ base: "64px", md: "72px" }}
                          h={{ base: "64px", md: "72px" }}
                          borderRadius="full"
                          border={`1px solid ${d.txt}66`}
                          bg={`${d.txt}14`}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          transition="transform 0.28s ease"
                          _groupHover={p.apagada ? {} : { transform: "scale(1.05)" }}
                          sx={{ "& svg": { width: "38px", height: "38px" } }}
                        >
                          {p.renderIcon(d.txt)}
                        </Box>

                        {/* Título */}
                        <Flex position="relative" zIndex={1} direction="column" align="flex-start" gap={1} minW={0}>
                          <Text
                            color={d.txt}
                            fontWeight="700"
                            fontSize={{ base: "md", md: "lg" }}
                            letterSpacing="0.12em"
                            textTransform="uppercase"
                            textAlign="left"
                            lineHeight="1.25"
                            textShadow={conFondo ? `0 1px 3px ${d.bg}, 0 0 14px ${d.bg}dd` : "1px 1px 3px rgba(0,0,0,0.45)"}
                          >
                            {p.titulo}
                          </Text>
                          {p.pie && (
                            <Text
                              color={d.txt}
                              opacity={0.82}
                              fontStyle="italic"
                              fontSize={{ base: "sm", md: "md" }}
                              letterSpacing="0.04em"
                              textShadow={conFondo ? `0 1px 3px ${d.bg}, 0 0 12px ${d.bg}dd` : "1px 1px 3px rgba(0,0,0,0.45)"}
                            >
                              {p.pie}
                            </Text>
                          )}
                        </Flex>
                      </Flex>
                    </Reveal>
                  ))}
                </Grid>
              </Grid>
            )}
          </Box>

        )}
      </Box>
      {/* Fuera de la banda de estrellas (que era solo para la línea del tiempo): «¿Qué es una carta astral?», sobre el beige. */}
      {esAstro && (
        <Box pb={{ base: 20, md: 28 }}>
          <QueEsCartaAstral activo={banda} />
        </Box>
      )}
      {/* Tercera sección, con OTRO fondo de estrellas: los autores de la historia de la Astrología, de dos en dos. */}
      {esAstro && (
        <Box position="relative" mb={{ base: "40px", md: "88px" }} pt={{ base: "64px", md: "96px" }} pb={{ base: "64px", md: "96px" }}>
          <FondoBanda nom={d.nom} visible={banda} />
          <Box position="relative" zIndex={1} w="100%" px={{ base: 5, md: 10, lg: 14 }}>
            <AutoresAstrologia lista={AUTORES_ASTROLOGIA} titulo="astroAutores.defensores" />
          </Box>
        </Box>
      )}
      {/* Bajo la banda de los autores, ya sobre el beige: la frase de las críticas. */}
      {esAstro && (
        <Flex justify="center" px={{ base: 6, md: 10 }} pb={{ base: 12, md: 16 }}>
          <Text
            maxW="820px"
            textAlign="center"
            color={FONDO_PAGINA_TURQUESA}
            fontFamily="'EB Garamond', serif"
            fontSize={{ base: "lg", md: "2xl" }}
            lineHeight="1.6"
            letterSpacing="0.01em"
          >
            <PalabrasVivas texto={t("astroAutores.critica")} cursivas total={1.4} />
          </Text>
        </Flex>
      )}
      {/* Segundo box de autores, con otro fondo de estrellas: los CRÍTICOS. */}
      {esAstro && (
        <Box position="relative" mb={{ base: "40px", md: "88px" }} pt={{ base: "64px", md: "96px" }} pb={{ base: "64px", md: "96px" }}>
          <FondoBanda nom={d.nom} visible={banda} />
          <Box position="relative" zIndex={1} w="100%" px={{ base: 5, md: 10, lg: 14 }}>
            <AutoresAstrologia lista={CRITICOS_ASTROLOGIA} titulo="astroAutores.criticos" />
          </Box>
        </Box>
      )}
      {/* Tras los críticos, ya sobre el beige: mi posición. */}
      {esAstro && (
        <Flex justify="center" px={{ base: 6, md: 10 }} pb={{ base: 20, md: 28 }}>
          <Text
            maxW="820px"
            textAlign="center"
            color={FONDO_PAGINA_TURQUESA}
            fontFamily="'EB Garamond', serif"
            fontSize={{ base: "lg", md: "2xl" }}
            lineHeight="1.6"
            letterSpacing="0.01em"
          >
            <PalabrasVivas texto={t("astroAutores.acuerdo")} cursivas total={1.4} />
          </Text>
        </Flex>
      )}
      {/* Último apartado, con otro fondo de estrellas: Astrología en el arte (casi todo imágenes). */}
      {esAstro && (
        <Box position="relative" mb={{ base: "40px", md: "88px" }} pt={{ base: "64px", md: "96px" }} pb={{ base: "64px", md: "96px" }}>
          <FondoBanda nom={d.nom} visible={banda} />
          <Box position="relative" zIndex={1} w="100%" px={{ base: 5, md: 10, lg: 14 }}>
            <ArteAstrologia />
          </Box>
        </Box>
      )}
      {/* Abajo del todo, bajo Astrología en el arte: los mismos dos botones de la lectura. */}
      {esAstro && (
        <Flex justify="center" px={{ base: 5, md: 10 }} pb={{ base: 20, md: 28 }}>
          <BotonesLectura mt={0} />
        </Flex>
      )}
      {/* Los cuatro boxes de servicios (ServiciosAstrologia) están quitados de esta página por ahora; el componente sigue en components/web. */}
      </>
      )}

      {/* Dentro de Teoría: volver a la portada (abajo a la izquierda, fuera de las cajas). */}
      {modo === "teoria" && pagada && (
        <Flex px={{ base: 5, md: 10, lg: 16 }} pb={{ base: 10, md: 14 }} justify="flex-start">
          <BotonPaso
            direction="prev"
            label={t("comun.volver")}
            onClick={() => navigate(`/disciplina/${d.key}`)}
            nom={d.nom}
            color="white"
            bg={d.bg}
          />
        </Flex>
      )}

      <SiteFooter />

      {esFisio && <TusCelulasModal titulo={t("fisioPortada.boton")} isOpen={celulasAbierto} onClose={() => setCelulasAbierto(false)} />}
      {esFisio && <TemaProfundizaModal tema={temaAbierto} onClose={() => setTemaAbierto(null)} />}
      {esFisio && <SistemaModal sistema={sistemaAbierto} sistemas={sistemasPortada} onSelect={setSistemaAbierto} onClose={() => setSistemaAbierto(null)} />}
    </Box>
  );
}

/** Capa de fondo de una banda: la foto (o el cielo estrellado) de la disciplina, con un difuminado CORTO arriba y abajo (55 px), el mismo de las bandas de Welcome. */
function FondoBanda({ nom, visible, src, deriva = false }: { nom: string; visible: boolean; src?: string; /** El mármol se desplaza y respira muy despacio (solo con `src`). */ deriva?: boolean }) {
  const mascara = "linear-gradient(to bottom, transparent 0, #000 55px, #000 calc(100% - 55px), transparent 100%)";
  return (
    <Box
      position="absolute"
      inset={0}
      pointerEvents="none"
      opacity={visible ? 1 : 0}
      transition="opacity 0.5s ease"
      overflow="hidden"
      sx={{ WebkitMaskImage: mascara, maskImage: mascara }}
    >
      {src ? <Box position="absolute" inset={0} bgImage={`url(${src})`} bgSize="cover" bgPosition="center" sx={deriva ? { "@keyframes marmolDeriva": { from: { transform: "scale(1.06) translate(-1.5%, 0.8%)" }, to: { transform: "scale(1.14) translate(1.5%, -0.8%)" } }, animation: "marmolDeriva 38s ease-in-out infinite alternate", "@media (prefers-reduced-motion: reduce)": { animation: "none" } } : undefined} /> : <DisciplinaBgLayer nom={nom} borderRadius="0" />}
    </Box>
  );
}

export default function DisciplinaPortada({ modo = "portada" }: { modo?: "portada" | "teoria" }) {
  const { disciplina } = useParams<{ disciplina: string }>();
  const navigate = useNavigate();
  const d = presentacionPorKey(disciplina);

  // Slug desconocido: a la portada (mismo criterio que
  // /d/:disciplina, para no dejar un 404 seco).
  useEffect(() => {
    if (!d) navigate("/welcome", { replace: true });
    // La URL antigua de Filosofía (/disciplina/cultura) pasa a la nueva.
    else if (d.key === "cultura" && disciplina !== "filosofia") navigate(modo === "teoria" ? "/disciplina/filosofia/teoria" : "/disciplina/filosofia", { replace: true });
  }, [d, disciplina, modo, navigate]);
  if (!d) return null;

  // key: al saltar de una disciplina a otra (o de la portada a su Teoría) se
  // remonta y las entradas vuelven a dispararse, en vez de encontrarlas ya
  // colocadas.
  return <Portada key={`${d.key}-${modo}`} d={d} modo={modo} />;
}
