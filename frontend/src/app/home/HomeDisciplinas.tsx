import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { Reveal } from "../../components/global/Reveal";
import SeparadorFlor from "../../components/welcome/SeparadorFlor";
import { MAPA } from "../../components/web/mapaDisciplinasData";
import { useNombreDisciplina } from "../../i18n/nombreDisciplina";
import { useT } from "../../i18n";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../../components/global/DisciplinaBgLayer";
import { FONDO_PAGINA_TURQUESA as T } from "../../GlobalVariables";
import { CAMINO, type CaminoKey } from "../../data/camino";

/** Las ocho: mismo orden que MAPA, con la clave de su recorrido. Pulsar una lleva DIRECTAMENTE a empezarla
 *  (`CAMINO[clave].ruta`, p. ej. /metodo/cabala), sin pasar por la portada de la disciplina (ilustraciones, cursos, pack). */
const CLAVES: CaminoKey[] = ["psicologia", "fisiologia", "nutricion", "cultura", "tcm", "metodo", "cabala", "ayurveda"];

/**
 * Debajo de las dos cajas de la home: la separación con el mandala en medio, el titular y las ocho disciplinas en
 * cajas, CUATRO por línea, cada una con su icono y su nombre. La letra de cada disciplina es el beige de la
 * página (se define en la paleta, GlobalVariables); la caja lleva el color de la disciplina.
 */
export default function HomeDisciplinas() {
  const t = useT();
  const navigate = useNavigate();
  const nombreDisciplina = useNombreDisciplina();

  return (
    <Box w="100%" maxW="1500px" mx="auto" px={{ base: 3, md: 6 }} fontFamily="'EB Garamond', serif">
      <SeparadorFlor />

      <Reveal inView amount={0.5} direction="up" distance={18} duration={0.9}>
        <Text color={T} textAlign="center" fontWeight="700" fontSize={{ base: "lg", md: "2xl" }} lineHeight="1.4" letterSpacing="0.02em" maxW="720px" mx="auto" px={4}>
          {t("home.perspectivas.titulo")}
        </Text>
      </Reveal>

      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 3, md: 5 }} mt={{ base: 8, md: 10 }} mb={{ base: 12, md: 16 }}>
        {MAPA.map((d, i) => (
          <Reveal key={d.name} inView amount={0.3} direction="up" distance={24} scaleFrom={0.95} duration={0.7} delay={(i % 4) * 0.1}>
            <Flex
              as="button"
              type="button"
              onClick={() => navigate(CAMINO[CLAVES[i]].ruta)}
              position="relative"
              overflow="hidden"
              direction="column"
              align="center"
              justify="center"
              gap={{ base: 3, md: 4 }}
              w="100%"
              h={{ base: "170px", md: "300px" }}
              px={3}
              borderRadius="2xl"
              bg={d.bg}
              cursor="pointer"
              role="group"
              transition="transform 0.28s ease"
              _hover={{ transform: "translateY(-3px)" }}
              _focusVisible={{ outline: `2px solid ${T}cc`, outlineOffset: "2px" }}
            >
              {/* Su foto de fondo, tal cual (sin velo): la de cada disciplina, o el cielo estrellado en Astrología. */}
              {hasDisciplinaBg(d.name) && <DisciplinaBgLayer nom={d.name} borderRadius="2xl" talCual />}
              <Box position="relative" zIndex={1} display="flex" alignItems="center" justifyContent="center">{d.renderIcon("52px")}</Box>
              <Text position="relative" zIndex={1} color={d.txt} fontWeight="700" fontSize={{ base: "lg", md: "2xl" }} letterSpacing="0.05em" lineHeight="1.15" textAlign="center" noOfLines={1}>
                {nombreDisciplina(d.name)}
              </Text>
            </Flex>
          </Reveal>
        ))}
      </SimpleGrid>
    </Box>
  );
}
