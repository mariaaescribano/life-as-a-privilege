import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Reveal, RevealItem, RevealStagger } from "../global/Reveal";
import { useT } from "../../i18n";
import { useNombreDisciplina } from "../../i18n/nombreDisciplina";
import {
  astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaTxt,
  cabalaBg, CabalaIcon, cabalaNom, cabalaTxt,
  culturaBg, CulturaIcon, culturaNom, culturaTxt,
  fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
  nutricionBg, NutricionIcon, nutricionNom, nutricionTxt,
  tcmBg, TCMIcon, tcmNom, tcmTxt,
} from "../../GlobalVariables";
import { arenaLinea, arenaTinta, arenaTintaSuave } from "../../data/landingProyectos";

/**
 * «Desde dónde miro» — la tira de las ocho disciplinas, en la landing.
 *
 * Es la PRUEBA de lo que dice el box de María, no un menú: los círculos NO son
 * enlaces. En el recibidor solo hay dos puertas (El Mapa y Nace una madre); si
 * cada disciplina llevase a su página, la landing dejaría de repartir entre dos
 * proyectos y se convertiría en la portada de El Mapa.
 *
 * Dos decisiones de pintura que conviene no deshacer sin querer:
 *
 * 1. Cada icono va sobre un CÍRCULO del color de su disciplina. No es un adorno:
 *    los iconos de GlobalVariables llevan su color cocido dentro (pensados para
 *    fondo oscuro, la mayoría en tonos claros), así que sobre el crema de la
 *    landing serían invisibles. El círculo les devuelve su fondo. Es el mismo
 *    apaño que ya usan las tarjetas de la portada de El Mapa.
 * 2. Círculo de COLOR PLANO, no `DisciplinaBgLayer`. Siete de las ocho
 *    disciplinas tienen imagen de fondo (.webp): usarlas aquí serían siete
 *    descargas en la puerta de entrada de la web. Con el color sólido se ven
 *    igual de reconocibles y la landing sigue siendo ligera.
 *
 * Los nombres van en tinta (no en el color de la disciplina): fuera de las cajas
 * el texto es siempre del color de la página, y con ocho colores ya bastante
 * cargados, ponerlos también en la letra convertía la tira en un arcoíris que le
 * robaba el protagonismo a las dos cajas de proyecto.
 */

// Mismo orden que la portada de El Mapa. Los COLORES se importan de
// GlobalVariables (no se copian), así que si cambias el color de una disciplina
// aquí cambia solo; lo único propio de este archivo es qué disciplinas salen y
// en qué orden.
const DISCIPLINAS = [
  { nom: astrologiaNom,      bg: astrologiaBg,      txt: astrologiaTxt,      icono: (s: string) => <AstrologiaIcon size={{ base: s, md: s }} /> },
  { nom: neuropsicologiaNom, bg: neuropsicologiaBg, txt: neuropsicologiaTxt, icono: (s: string) => <NeuropsicologiaIcon size={{ base: s, md: s }} /> },
  { nom: ayurvedaNom,        bg: ayurvedaBg,        txt: ayurvedaTxt,        icono: (s: string) => <AyurvedaIcon size={{ base: s, md: s }} /> },
  { nom: tcmNom,             bg: tcmBg,             txt: tcmTxt,             icono: (s: string) => <TCMIcon size={{ base: s, md: s }} /> },
  { nom: fisiologiaNom,      bg: fisiologiaBg,      txt: fisiologiaTxt,      icono: (s: string) => <FisiologiaIcon size={s} /> },
  { nom: nutricionNom,       bg: nutricionBg,       txt: nutricionTxt,       icono: (s: string) => <NutricionIcon size={{ base: s, md: s }} /> },
  { nom: cabalaNom,          bg: cabalaBg,          txt: cabalaTxt,          icono: (s: string) => <CabalaIcon size={{ base: s, md: s }} /> },
  { nom: culturaNom,         bg: culturaBg,         txt: culturaTxt,         icono: (s: string) => <CulturaIcon size={{ base: s, md: s }} /> },
];

const DisciplinasMirada = () => {
  const t = useT();
  const nombreDe = useNombreDisciplina();

  return (
    <Box px={{ base: 6, md: 12, lg: 20 }}>
      <Box maxW="1240px" mx="auto">
        {/* ── Título y frase ── */}
        <Reveal inView amount={0.1} direction="up" distance={22} duration={0.8}>
          <Flex direction="column" align="center" gap={{ base: 4, md: 5 }} textAlign="center">
            <Text
              color={arenaTinta}
              fontFamily="'EB Garamond', serif"
              fontWeight="700"
              fontSize={{ base: "xl", md: "2xl" }}
              letterSpacing="0.14em"
              textTransform="uppercase"
            >
              {t("landing.mirada.titulo")}
            </Text>

            <Box h="1px" w={{ base: "60px", md: "90px" }} bg={arenaLinea} />

            <Text
              color={arenaTintaSuave}
              fontFamily="'EB Garamond', serif"
              fontStyle="italic"
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.7"
              letterSpacing="0.02em"
              maxW="640px"
            >
              {t("landing.mirada.sub")}
            </Text>
          </Flex>
        </Reveal>

        {/* ── Las ocho ──
            Entran en cascada al asomar (`stagger`), de izquierda a derecha. */}
        <RevealStagger
          inView
          amount={0.05}
          stagger={0.07}
          delayChildren={0.1}
          display="grid"
          gridTemplateColumns={{ base: "repeat(2, 1fr)", sm: "repeat(4, 1fr)", lg: "repeat(8, 1fr)" }}
          gap={{ base: 7, md: 8 }}
          mt={{ base: 12, md: 16 }}
        >
          {DISCIPLINAS.map((d) => (
            <RevealItem
              key={d.nom}
              direction="up"
              distance={16}
              role="group"
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={{ base: 3, md: 4 }}
            >
              {/* Círculo del color de la disciplina, con su icono dentro. */}
              <Flex
                align="center"
                justify="center"
                w={{ base: "60px", md: "66px" }}
                h={{ base: "60px", md: "66px" }}
                flexShrink={0}
                borderRadius="full"
                bg={d.bg}
                border={`2px solid ${d.txt}`}
                boxShadow={`0 6px 18px ${d.bg}59, 0 2px 6px #2A26221A`}
                transition="transform 0.28s ease, box-shadow 0.28s ease"
                _groupHover={{
                  transform: "translateY(-4px) scale(1.06)",
                  boxShadow: `0 12px 26px ${d.bg}73, 0 3px 10px #2A26222B`,
                }}
              >
                {d.icono("32px")}
              </Flex>

              <Text
                color={arenaTinta}
                fontFamily="'EB Garamond', serif"
                fontWeight="600"
                fontSize={{ base: "xs", md: "sm" }}
                letterSpacing="0.06em"
                textAlign="center"
                lineHeight="1.35"
              >
                {/* Versión corta: en una tira de ocho columnas los nombres largos
                    («Medicina China») partirían la rejilla en dos alturas. */}
                {nombreDe(d.nom, true)}
              </Text>
            </RevealItem>
          ))}
        </RevealStagger>
      </Box>
    </Box>
  );
};

export default DisciplinasMirada;
