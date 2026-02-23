import { Box, Flex, HStack, Image, Text } from "@chakra-ui/react";
import { ModuloAcordeon } from "../../components/aprendizaje/ModuloAcordeon";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Modulo } from "../../dtos/aprendizaje.type";
import {
  AprendizajeIcon, EspacioPersonalIcon,
  astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaTxt,
  biologiaBg, BiologiaIcon, biologiaNom, biologiaTxt,
  cabalaBg, CabalaIcon, cabalaNom, cabalaTxt,
  fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
  nutricionBg, NutricionIcon, nutricionNom, nutricionTxt,
  tcmBg, TCMIcon, tcmNom, tcmTxt,
} from "../../GlobalVariables";
import { modulosNeuroPsicologia } from "../../hardCoded/aprendizajes/ModulosNeuroPsicologia";

export default function ModulesPage() {
  const { moduloId } = useParams<{ moduloId: string }>();
  const navigate = useNavigate();
  const [moduloDatos, setmoduloDatos] = useState<Modulo | null>(null);
  const [img, setImg] = useState<string | null>(null);

  const getModuloDatos = (): Modulo => {
    switch (moduloId) {
      case "fisiologia":
        return { nom: fisiologiaNom, bgColor: fisiologiaBg, color: fisiologiaTxt, icon: <FisiologiaIcon />, modulos: modulosNeuroPsicologia };
      case neuropsicologiaNom:
        return { nom: neuropsicologiaNom, bgColor: neuropsicologiaBg, color: neuropsicologiaTxt, icon: <NeuropsicologiaIcon size={{ base: "60px", md: "60px" }} />, modulos: modulosNeuroPsicologia };
      case "astrologia":
        return { nom: astrologiaNom, bgColor: astrologiaBg, color: astrologiaTxt, icon: <AstrologiaIcon /> };
      case "tcm":
        return { nom: tcmNom, bgColor: tcmBg, color: tcmTxt, icon: <TCMIcon /> };
      case "nutricion":
        return { nom: nutricionNom, bgColor: nutricionBg, color: nutricionTxt, icon: <NutricionIcon /> };
      case "ayurveda":
        return { nom: ayurvedaNom, bgColor: ayurvedaBg, color: ayurvedaTxt, icon: <AyurvedaIcon /> };
      case "biologia":
        return { nom: biologiaNom, bgColor: biologiaBg, color: biologiaTxt, icon: <BiologiaIcon /> };
      case "cabala":
        return { nom: cabalaNom, bgColor: cabalaBg, color: cabalaTxt, icon: <CabalaIcon /> };
      default:
        return { nom: "", bgColor: "", color: "", icon: null };
    }
  };

  useEffect(() => {
    if (moduloId) {
      setmoduloDatos(getModuloDatos());
    }
  }, [moduloId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setImg(sessionStorage.getItem("img"));
  }, []);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">

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
        {moduloDatos != null && moduloDatos.modulos && (
          <Flex
            direction="column"
            alignItems="center"
            px={{ base: 5, md: 10, lg: 16 }}
            pt={{ base: 10, md: 14 }}
            pb={{ base: 14, md: 20 }}
          >
            {/* Cabecera disciplina — con sus propios colores */}
            <Box
              bg={moduloDatos.bgColor}
              borderRadius="2xl"
              boxShadow="0 8px 28px rgba(107,196,200,0.55), 0 2px 8px rgba(107,196,200,0.3)"
              px={{ base: 8, md: 14 }}
              py={{ base: 6, md: 8 }}
              w="100%"
              maxW="850px"
              mb={{ base: 10, md: 12 }}
            >
              <HStack spacing={4} justify="center">
                {moduloDatos.icon}
                <Text
                  color={moduloDatos.color}
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="700"
                  letterSpacing="0.05em"
                  filter="drop-shadow(1px 1px 3px rgba(0,0,0,0.3))"
                >
                  {moduloDatos.nom}
                </Text>
              </HStack>
            </Box>

            {/* Módulos directos — sin card contenedor */}
            <Box w="100%" maxW="850px">
              {moduloDatos.modulos.map((mod, i) => (
                <ModuloAcordeon
                  key={i}
                  title={mod.title}
                  bgColor={moduloDatos.bgColor}
                  color={moduloDatos.color}
                  submodules={mod.submodules}
                  icon={mod.icon}
                />
              ))}
            </Box>
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
}
