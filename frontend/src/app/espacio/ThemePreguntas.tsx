import React, { useEffect, useState } from "react";
import { Box, Flex, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";

import ThemeSection from "../../components/espacio/ThemeSection";
import type { Bloque, ThemeTitleObject } from "../../dtos/espacio.type";
import { preguntasNeuroPsicologia } from "../../hardCoded/espacio/PreguntasNeuroPsicologia";
import {
  AprendizajeIcon,
  EspacioPersonalIcon,
  neuropsicologiaBg,
  NeuropsicologiaIcon,
  neuropsicologiaNom,
  neuropsicologiaTxt,
} from "../../GlobalVariables";

const ThemePreguntas = () => {
  const { themeId } = useParams<{ themeId: string }>();
  const navigate = useNavigate();

  const [bloques, setBloques] = useState<Bloque[]>([]);
  const [theme, settheme]     = useState<ThemeTitleObject>();
  const [img, setImg]         = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setImg(sessionStorage.getItem("img"));
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
      <Flex
        as="header"
        align="center"
        justify="space-between"
        px={{ base: 5, md: 12 }}
        py={{ base: 3, md: 4 }}
        bg="#008080"
        position="sticky"
        top="0"
        zIndex="100"
        borderBottom="1px solid rgba(255,255,255,0.12)"
      >
        <Image
          src="/img/life.png"
          h={{ base: "56px", md: "70px" }}
          objectFit="contain"
          cursor="pointer"
          onClick={() => navigate("/")}
          _hover={{ opacity: 0.85 }}
          transition="opacity 0.2s"
        />

        <Flex align="center" gap={{ base: 4, md: 6 }}>
          <Flex
            align="center" gap={2} cursor="pointer"
            onClick={() => navigate("/espacio/espacioHome")}
            color="rgba(255,255,255,0.85)" _hover={{ color: "white" }} transition="color 0.2s"
          >
            <EspacioPersonalIcon color="currentColor" size={{ base: "22px", md: "24px" } as any} />
            <Text display={{ base: "none", md: "block" }} fontSize="sm" fontWeight="500" letterSpacing="0.04em" textShadow="0 1px 4px rgba(0,80,70,0.5)">
              Mi Espacio
            </Text>
          </Flex>

          <Flex
            align="center" gap={2} cursor="pointer"
            onClick={() => navigate("/aprendizaje/aprendizajeHome")}
            color="rgba(255,255,255,0.85)" _hover={{ color: "white" }} transition="color 0.2s"
          >
            <AprendizajeIcon color="currentColor" size={{ base: "22px", md: "24px" } as any} />
            <Text display={{ base: "none", md: "block" }} fontSize="sm" fontWeight="500" letterSpacing="0.04em" textShadow="0 1px 4px rgba(0,80,70,0.5)">
              Aprendizajes
            </Text>
          </Flex>

          {img && (
            <Box
              w={{ base: "36px", md: "42px" }} h={{ base: "36px", md: "42px" }}
              borderRadius="full" overflow="hidden"
              border="2px solid rgba(255,255,255,0.55)" flexShrink={0}
              cursor="pointer" onClick={() => navigate("/espacio/espacioHome")}
              _hover={{ border: "2px solid white" }} transition="border 0.2s"
            >
              <Image src={img} w="100%" h="100%" objectFit="cover" />
            </Box>
          )}
        </Flex>
      </Flex>

      {/* ── MAIN ── */}
      <Box flex="1">
        {theme && (
          <Flex
            direction="column"
            alignItems="center"
            px={{ base: 5, md: 10, lg: 16 }}
            pt={{ base: 10, md: 14 }}
            pb={{ base: 14, md: 20 }}
          >
            {/* Cabecera de la disciplina — con sus propios colores */}
            <Box
              bg={theme.bgColor}
              borderRadius="2xl"
              boxShadow="0 8px 28px rgba(107,196,200,0.55), 0 2px 8px rgba(107,196,200,0.3)"
              px={{ base: 8, md: 14 }}
              py={{ base: 6, md: 8 }}
              w="100%"
              maxW="850px"
              mb={{ base: 10, md: 12 }}
            >
              <HStack spacing={4} justify="center">
                {theme.icon}
                <Text
                  color={theme.color}
                  fontSize={{ base: "2xl", md: "4xl" }}
                  fontWeight="700"
                  letterSpacing="0.05em"
                  filter="drop-shadow(1px 1px 3px rgba(0,0,0,0.3))"
                >
                  {theme.title}
                </Text>
              </HStack>
            </Box>

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
          </Flex>
        )}
      </Box>

      {/* ── FOOTER ── */}
      <Box
        as="footer"
        borderTop="1px solid rgba(255,255,255,0.15)"
        px={{ base: 6, md: 16 }}
        py={{ base: 8, md: 10 }}
      >
        <Text color="rgba(255,255,255,0.5)" fontSize="xs" letterSpacing="0.05em" textAlign="center">
          © 2026 Life as a Privilege · María Escribano · Todos los derechos reservados
        </Text>
      </Box>
    </Box>
  );
};

export default ThemePreguntas;
