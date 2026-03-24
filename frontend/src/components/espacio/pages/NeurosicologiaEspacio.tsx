import React, { useEffect, useState } from "react";
import { Box, Flex, VStack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

import ThemeSection from "../../../components/espacio/components/ThemeSection";
import { DisciplineHeader } from "../../../components/global/DisciplineHeader";
import SiteHeader from "../../../components/global/SiteHeader";
import type { Bloque, ThemeTitleObject } from "../../../dtos/espacio.type";
import { preguntasNeuroPsicologia } from "../../../hardCoded/espacio/PreguntasNeuroPsicologia";
import {
  neuropsicologiaBg,
  NeuropsicologiaIcon,
  neuropsicologiaNom,
  neuropsicologiaTxt,
} from "../../../GlobalVariables";
import SiteFooter from "../../global/Footer";
import { SolicitarAutoevaluacionButton } from "../../global/SolicitarAutoevaluacionButton";

const ThemePreguntas = () => {
  const { themeId } = useParams<{ themeId: string }>();

  const [bloques, setBloques] = useState<Bloque[]>([]);
  const [theme, settheme]     = useState<ThemeTitleObject>();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const getThemeData = () => {
    if (themeId == neuropsicologiaNom) {
      settheme({
        title:   neuropsicologiaNom,
        icon:    <NeuropsicologiaIcon size={{ base: "40px", md: "56px" }} />,
        color:   neuropsicologiaTxt,
        bgColor: neuropsicologiaBg,
      });
      return preguntasNeuroPsicologia;
    }
  };

  useEffect(() => {
    if (!themeId) return;
    const data = getThemeData();
    if (data) setBloques(data);
  }, [themeId]);

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="#008080"
      fontFamily="'EB Garamond', serif"
    >
      {/* ── HEADER ── */}
      <SiteHeader variant="private" />

      {/* ── MAIN ── */}
      <Box flex="1">
        {theme && (
          <Flex
            direction="column"
            alignItems="center"
            px={{ base: 5, md: 10, lg: 16 }}
            pt={{ base: 10, md: 14 }}
          >
            <DisciplineHeader
              icon={theme.icon}
              title={theme.title}
              bgColor={theme.bgColor}
              color={theme.color}
            />

            {/* Preguntas flotantes — sin card contenedor */}
            <VStack spacing={6} w="100%" maxW="850px">
              {bloques.map((bloque, index) => (
                <ThemeSection
                  key={index + "preg"}
                  title={bloque.title}
                  icon={bloque.icon}
                  subPreguntas={bloque.subPreguntas}
                  color={theme.color}
                  bgColor={theme.bgColor}
                />
              ))}
            </VStack>

            <SolicitarAutoevaluacionButton
              bgColor={neuropsicologiaBg}
              color={neuropsicologiaTxt}
              icon={<NeuropsicologiaIcon size={{base:"30px", md: "50px"}}  />}
              disciplineName="Neuropsicología"
            />
          </Flex>
        )}
      </Box>

      {/* ── FOOTER ── */}
      <SiteFooter />
    </Box>
  );
};

export default ThemePreguntas;
