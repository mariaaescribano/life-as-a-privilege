import { Box, Flex, Text } from "@chakra-ui/react";
import { MandalaTinte } from "../../components/global/MandalaTinte";
import { FONDO_PAGINA_TURQUESA as T } from "../../GlobalVariables";
import React, { useEffect, useState } from "react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { CursosGrid } from "../../components/aprendizaje/CursosGrid";
import { useCursosData } from "../../data/cursosApi";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { LifeLoader } from "../../components/metodo/comicLoaders";
import { useT } from "../../i18n";
import TituloSeccion from "../../components/global/TituloSeccion";
import { repartirCienciaTradicion } from "../../data/cienciaTradicion";
// Cuántas portadas de curso se piden por adelantado: las dos primeras filas de
// la cuadrícula (3 columnas en escritorio). El resto baja al acercarse.
const PORTADAS_PRIMERA_PANTALLA = 6;

export const AprendizajeHome = () => {
  const t = useT();
  const [mounted, setMounted] = useState(false);
  // La página entra en cuanto llegan los datos de los cursos. Las portadas ya
  // no la retienen (ver la precarga de abajo): lo primero que se ve son los
  // ocho boxes de disciplina, que son iconos y no tienen foto que esperar.
  const [imagesReady, setImagesReady] = useState(false);
  const { cursosData, loading } = useCursosData();
  // Todos los cursos de todas las disciplinas, en una sola lista mezclada,
  // ordenada por fecha de creación descendente (los más nuevos, primero).
  // El tipo se deduce del propio `cursosData`; antes venía de NuevosCursosPage
  // (la página de «Vídeos»), que se eliminó junto con la sección de YouTube.
  const allCourses = Object.values(cursosData)
    .flatMap((modalidad) => modalidad.cursos.map((curso) => ({ curso, modalidad })))
    .sort((a, b) => (b.curso.createdAt ?? "").localeCompare(a.curso.createdAt ?? ""));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  // Precarga de portadas de curso. NO retiene la página: lo primero que se ve
  // aquí son los ocho boxes de disciplina (iconos, sin fotos), y las tarjetas de
  // curso están media página más abajo. Antes se esperaba a las ~36 portadas
  // antes de pintar nada. Ahora se piden en cuanto llegan los datos, en paralelo
  // con la entrada de la página, y las de más abajo bajan solas al acercarse
  // (`loading="lazy"` en la tarjeta).
  useEffect(() => {
    if (loading) return; // esperamos a que useCursosData termine
    setImagesReady(true);
    const urls = allCourses
      .map((e) => e.curso.foto)
      .filter((src): src is string => Boolean(src))
      .slice(0, PORTADAS_PRIMERA_PANTALLA);
    if (urls.length === 0) return;
    const id = setTimeout(() => { void precargarImagenes(urls); }, 400);
    return () => clearTimeout(id);
  }, [loading, cursosData]);

  // Una vez listas las imágenes, disparamos la animación de entrada.
  useEffect(() => {
    if (loading || !imagesReady) return;
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, [loading, imagesReady]);

  // Mientras se descargan las portadas (o llegan los datos): fondo teal con la
  // animación del MANDALA del logo de la web en blanco, centrada (el loader "de
  // la casa", no la estrella de astrología). El header se pinta ya para que
  // cargue antes de desbloquear la página.
  if (loading || !imagesReady) {
    return (
      <Box minH="100vh" display="flex" flexDirection="column" bg="#F0DCC0" fontFamily="'EB Garamond', serif">
        <SiteHeader variant="auto" />
        <Flex flex="1" align="center" justify="center" overflow="hidden">
          <LifeLoader />
        </Flex>
      </Box>
    );
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#F0DCC0" fontFamily="'EB Garamond', serif">

      <SiteHeader variant="auto" />

      {/* ── MANDALA SEPARADOR ── */}
      {/* Wrapper con flotación perpetua (vida continua, como en Welcome y
          /elMetodo); la imagen hace la entrada épica (surge girando desde muy
          pequeña y se enfoca). */}
      <Flex justify="center" pt={{ base: 10, md: 14 }}>
        <Box
          sx={{
            "@keyframes mandalaFloat": {
              "0%, 100%": { transform: "translateY(0) scale(1)" },
              "50%": { transform: "translateY(-9px) scale(1.03)" },
            },
            animation: "mandalaFloat 5.5s ease-in-out infinite",
          }}
        >
          <MandalaTinte
            h={{ base: "48px", md: "64px" }}
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "scale(1) rotate(0deg)" : "scale(0.25) rotate(-45deg)",
              filter: mounted ? "none" : "blur(6px)",
              transition: "opacity 1.1s ease, transform 1.3s cubic-bezier(0.22,1.5,0.36,1), filter 1s ease",
            }}
          />
        </Box>
      </Flex>

      {/* ── TÍTULO ── */}
      <Flex
        direction="column"
        align="center"
        textAlign="center"
        px={{ base: 5, md: 10 }}
        pt={{ base: 6, md: 8 }}
        gap={{ base: 3, md: 4 }}
      >
        <Text
          color={T}
          fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
          fontWeight="700"
          letterSpacing="0.1em"
          lineHeight="1.1"
          textTransform="uppercase"
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(20px)"}
          transition="opacity 0.85s ease 0.25s, transform 0.85s ease 0.25s"
        >
          {t("aprendizaje.titulo")}
        </Text>
        <Text
          color={`${T}e0`}
          fontSize={{ base: "sm", md: "lg" }}
          fontStyle="italic"
          letterSpacing="0.05em"
          lineHeight="1.5"
          maxW={{ base: "100%", md: "512px" }}
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(13px)"}
          transition="opacity 0.85s ease 0.5s, transform 0.85s ease 0.5s"
        >
          {t("aprendizaje.lema")}
        </Text>
      </Flex>

      {/* ── TODOS LOS CURSOS ── */}
      <Flex
        flex={1}
        direction="column"
        align="center"
        px={{ base: 5, md: 8, lg: 10 }}
        pt={{ base: 4, md: 6 }}
        pb={{ base: 24, md: 32 }}
      >
        {allCourses.length > 0 && (
          <Box w="100%">
            <Box h={{ base: 6, md: 8 }} />

            {/* Dos bloques, CIENCIA y TRADICIÓN, cada uno con su título entre rayas. */}
            {(() => {
              const { ciencia, tradicion } = repartirCienciaTradicion(allCourses, (e) => e.modalidad.nom);
              return [
                { clave: "seccion.ciencia" as const, cursos: ciencia },
                { clave: "seccion.tradicion" as const, cursos: tradicion },
              ]
                .filter((g) => g.cursos.length > 0)
                .map((g, n) => (
                  <Box key={g.clave} mt={n === 0 ? 0 : { base: 12, md: 16 }}>
                    <Box mb={{ base: 6, md: 8 }}><TituloSeccion>{t(g.clave)}</TituloSeccion></Box>
                    <CursosGrid
                      items={g.cursos.map((entry) => ({
                        curso: entry.curso,
                        color: entry.modalidad.color,
                        bgColor: entry.modalidad.bgColor,
                        nom: entry.modalidad.nom,
                      }))}
                    />
                  </Box>
                ));
            })()}
          </Box>
        )}
      </Flex>

      <SiteFooter />
    </Box>
  );
};
