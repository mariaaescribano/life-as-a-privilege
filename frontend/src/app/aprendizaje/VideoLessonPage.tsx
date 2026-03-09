import React, { useEffect, useState } from "react";
import { Box, Collapse, Flex, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import type { Modulo, ModuloContenido, Submodulo } from "../../dtos/aprendizaje.type";
import { modulosNeuroPsicologia } from "../../hardCoded/aprendizajes/NeuroPsicologia/ModulosNeuroPsicologia";
import SiteHeader from "../../components/global/SiteHeader";
import {
  astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaTxt,
  fitoterapiaBg, FitoterapiaIcon, fitoterapiaNom, fitoterapiaTxt,
  cabalaBg, CabalaIcon, cabalaNom, cabalaTxt,
  fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
  nutricionBg, NutricionIcon, nutricionNom, nutricionTxt,
  tcmBg, TCMIcon, tcmNom, tcmNomLink, tcmTxt,
} from "../../GlobalVariables";
import { modulostcm } from "../../hardCoded/aprendizajes/TCM/ModulosTCM";
import { modulosFitoterapia } from "../../hardCoded/aprendizajes/Fitoterapia/ModulosFitoterpia";
import { modulosAstrologia } from "../../hardCoded/aprendizajes/Astrologia/ModulosAstrologia";

export default function VideoLessonPage() {
  const { moduloId, submoduloId } = useParams<{ moduloId: string; submoduloId: string }>();
  const [datos, setdatos] = useState<Submodulo | null>(null);
  const [moduloDatos, setModuloDatos] = useState<Modulo | null>(null);
  const [letraOpen, setLetraOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const getModuloDatos = (): Modulo => {
    switch (moduloId) {
      case neuropsicologiaNom:
        return { nom: neuropsicologiaNom, bgColor: neuropsicologiaBg, color: neuropsicologiaTxt, icon: <NeuropsicologiaIcon size={{ base: "44px", md: "44px" }} /> };
      case "fisiologia":
        return { nom: fisiologiaNom, bgColor: fisiologiaBg, color: fisiologiaTxt, icon: <FisiologiaIcon size="44px" /> };
      case astrologiaNom:
        return { nom: astrologiaNom, bgColor: astrologiaBg, color: astrologiaTxt, icon: <AstrologiaIcon size={{ base: "44px", md: "44px" }}/> };
      case tcmNomLink:
        return { nom: tcmNom, bgColor: tcmBg, color: tcmTxt, icon: <TCMIcon size={{ base: "44px", md: "44px" }} /> };
      case "nutricion":
        return { nom: nutricionNom, bgColor: nutricionBg, color: nutricionTxt, icon: <NutricionIcon size="44px" /> };
      case "ayurveda":
        return { nom: ayurvedaNom, bgColor: ayurvedaBg, color: ayurvedaTxt, icon: <AyurvedaIcon size="44px" /> };
      case fitoterapiaNom:
        return { nom: fitoterapiaNom, bgColor: fitoterapiaBg, color: fitoterapiaTxt, icon: <FitoterapiaIcon size={{ base: "44px", md: "44px" }}  /> };
      case cabalaNom:
        return { nom: cabalaNom, bgColor: cabalaBg, color: cabalaTxt, icon: <CabalaIcon size={{ base: "44px", md: "44px" }} /> };
      default:
        return { nom: "", bgColor: "", color: "", icon: null };
    }
  };

  // SUBMODULOS

  const getModuleByTitle = (title: string, modulos:ModuloContenido[]): Submodulo | null => {
    for (const modulo of modulos) {
      const found = modulo.submodules.find((sub) => sub.id === title);
      if (found) return found;
    }
    return null;
  };

  useEffect(() => {
    if (moduloId) setModuloDatos(getModuloDatos());
  }, [moduloId]);

  useEffect(() => {
    if (moduloId && submoduloId) {
      if(moduloId === neuropsicologiaNom)
      { 
        setdatos(getModuleByTitle(submoduloId!, modulosNeuroPsicologia));
      }
      else if(moduloId === tcmNomLink)
      { 
        setdatos(getModuleByTitle(submoduloId!, modulostcm));
      }
      else if(moduloId === fitoterapiaNom)
      { 
        setdatos(getModuleByTitle(submoduloId!, modulosFitoterapia));
      }
      else if(moduloId === astrologiaNom)
      { 
        setdatos(getModuleByTitle(submoduloId!, modulosAstrologia));
      }
    }
  }, [moduloId, submoduloId]);

  const GLOW = "0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)";

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">

      {/* ── HEADER ── */}
      <SiteHeader variant="auto" />

      {/* ── MAIN ── */}
      {datos && (
        <Box flex="1">
          <Flex
            direction="column"
            alignItems="center"
            px={{ base: 5, md: 10, lg: 16 }}
            pt={{ base: 10, md: 14 }}
            pb={{ base: 14, md: 20 }}
          >
            {/* Cabecera */}
            {moduloDatos && (
              <Box
                    bg={moduloDatos.bgColor}
                    borderRadius="2xl"
                    boxShadow={GLOW}
                    px={{ base: 8, md: 14 }}
                    py={{ base: 8, md: 8 }}
                    w="100%"
                    maxW={"850px"}
                    mb={{ base: 10, md: 12 }}
                  >
                    <Flex direction="row" align="center" justify="center" gap={5}>
                      <Box
                        borderRadius="full"
                        bg={moduloDatos.bgColor}
                        border={`5px solid ${moduloDatos.color}`}
                        boxShadow={`0 0 22px ${moduloDatos.color}77, 0 0 55px ${moduloDatos.color}28`}
                        w={{ base: "60px", md: "72px" }}
                        h={{ base: "60px", md: "72px" }}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexShrink={0}
                      >
                        {< datos.icon size={{base:"30px", md:"40px"}}/>}
                      </Box>
                      <Text
                        color={moduloDatos.color}
                        fontSize={{ base: "lg", md: "2xl" }}
                        fontWeight="700"
                        letterSpacing="0.05em"
                        textShadow="0 2px 8px rgba(0,0,0,0.3)"
                        filter="drop-shadow(1px 1px 2px rgba(0,0,0,0.2))"
                      >
                        {datos.nom}
                      </Text>
                    </Flex>
                  </Box>
            )}

            {/* Video + flechas laterales (desktop) */}
            <Flex
              w="100%"
              maxW={{ base: "100%", md: "85%", xl: "75%" }}
              align="center"
              gap={4}
              mb={{ base: 4, md: 8 }}
            >
              {/* Flecha anterior — solo desktop */}
              <Box
                as="button"
                flexShrink={0}
                display={{ base: "none", md: "flex" }}
                disabled={!datos.linkAnterior}
                onClick={() => datos.linkAnterior && navigate(datos.linkAnterior)}
                w="52px" h="52px"
                borderRadius="full"
                border="2px solid rgba(255,255,255,0.55)"
                color="white"
                fontFamily="'EB Garamond', serif"
                fontSize="2xl"
                fontWeight="700"
                bg="rgba(255,255,255,0.08)"
                cursor={datos.linkAnterior ? "pointer" : "not-allowed"}
                opacity={datos.linkAnterior ? 1 : 0.25}
                transition="all 0.2s"
                alignItems="center" justifyContent="center"
                _hover={datos.linkAnterior ? { bg: "rgba(255,255,255,0.2)", borderColor: "white" } : {}}
              >
                ←
              </Box>

              {/* iframe */}
              <Box
                flex="1"
                aspectRatio={16 / 9}
                borderRadius="2xl"
                overflow="hidden"
                boxShadow="0 8px 40px rgba(0,0,0,0.45), 0 0 30px rgba(107,196,200,0.3)"
              >
                <iframe
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  src={`https://www.youtube.com/embed/${datos.video}`}
                  title="YouTube video player"
                  allowFullScreen
                />
              </Box>

              {/* Flecha siguiente — solo desktop */}
              <Box
                as="button"
                flexShrink={0}
                display={{ base: "none", md: "flex" }}
                disabled={!datos.linkNext}
                onClick={() => datos.linkNext && navigate(datos.linkNext)}
                w="52px" h="52px"
                borderRadius="full"
                border="2px solid rgba(255,255,255,0.55)"
                color="white"
                fontFamily="'EB Garamond', serif"
                fontSize="2xl"
                fontWeight="700"
                bg="rgba(255,255,255,0.08)"
                cursor={datos.linkNext ? "pointer" : "not-allowed"}
                opacity={datos.linkNext ? 1 : 0.25}
                transition="all 0.2s"
                alignItems="center" justifyContent="center"
                _hover={datos.linkNext ? { bg: "rgba(255,255,255,0.2)", borderColor: "white" } : {}}
              >
                →
              </Box>
            </Flex>

            {/* Flechas debajo — solo móvil */}
            <Flex
              display={{ base: "flex", md: "none" }}
              gap={4}
              justify="center"
              mb={{ base: 6 }}
            >
              <Box
                as="button"
                disabled={!datos.linkAnterior}
                onClick={() => datos.linkAnterior && navigate(datos.linkAnterior)}
                w="44px" h="44px"
                borderRadius="full"
                border="2px solid rgba(255,255,255,0.55)"
                color="white"
                fontFamily="'EB Garamond', serif"
                fontSize="xl"
                fontWeight="700"
                bg="rgba(255,255,255,0.08)"
                cursor={datos.linkAnterior ? "pointer" : "not-allowed"}
                opacity={datos.linkAnterior ? 1 : 0.25}
                transition="all 0.2s"
                display="flex" alignItems="center" justifyContent="center"
                _hover={datos.linkAnterior ? { bg: "rgba(255,255,255,0.2)", borderColor: "white" } : {}}
              >
                ←
              </Box>
              <Box
                as="button"
                disabled={!datos.linkNext}
                onClick={() => datos.linkNext && navigate(datos.linkNext)}
                w="44px" h="44px"
                borderRadius="full"
                border="2px solid rgba(255,255,255,0.55)"
                color="white"
                fontFamily="'EB Garamond', serif"
                fontSize="xl"
                fontWeight="700"
                bg="rgba(255,255,255,0.08)"
                cursor={datos.linkNext ? "pointer" : "not-allowed"}
                opacity={datos.linkNext ? 1 : 0.25}
                transition="all 0.2s"
                display="flex" alignItems="center" justifyContent="center"
                _hover={datos.linkNext ? { bg: "rgba(255,255,255,0.2)", borderColor: "white" } : {}}
              >
                →
              </Box>
            </Flex>

            {/* Descripción */}
            {moduloDatos && (
              <Box
                maxW="800px"
                w="100%"
                textAlign="center"
                bg={moduloDatos.bgColor}
                border={`1px solid ${moduloDatos.color}44`}
                borderRadius="2xl"
                px={{ base: 6, md: 10 }}
                py={{ base: 4, md: 6 }}
                mb={datos.letra ? { base: 4, md: 5 } : 0}
              >
                <Text
                  fontSize={{ base: "lg", md: "xl" }}
                  color={moduloDatos.color}
                  lineHeight="1.8"
                  fontStyle={"italic"}
                  letterSpacing="0.02em"
                >
                  {datos.descripcion}
                </Text>
              </Box>
            )}

            {/* Letra / Transcripción (plegable) */}
            {datos.letra && moduloDatos && (
              <Box maxW="800px" w="100%">
                {/* Cabecera toggle */}
                <Flex
                  as="button"
                  w="100%"
                  align="center"
                  justify="space-between"
                  px={{ base: 6, md: 10 }}
                  py={{ base: 3, md: 4 }}
                  bg={moduloDatos.bgColor}
                  border={`1px solid ${moduloDatos.color}44`}
                  borderRadius={letraOpen ? "2xl 2xl 0 0" : "2xl"}
                  cursor="pointer"
                  onClick={() => setLetraOpen(!letraOpen)}
                  transition="border-radius 0.2s"
                >
                  <Text
                    color={moduloDatos.color}
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="600"
                    letterSpacing="0.04em"
                  >
                    Transcripción
                  </Text>
                  <Text
                    color={moduloDatos.color}
                    fontSize="xl"
                    transition="transform 0.25s"
                    transform={letraOpen ? "rotate(180deg)" : "rotate(0deg)"}
                  >
                    ▾
                  </Text>
                </Flex>

                {/* Contenido plegable */}
                <Collapse in={letraOpen} animateOpacity>
                  <Box
                    px={{ base: 6, md: 10 }}
                    py={{ base: 5, md: 7 }}
                    bg={moduloDatos.bgColor}
                    border={`1px solid ${moduloDatos.color}44`}
                    borderTop="none"
                    borderRadius="0 0 2xl 2xl"
                  >
                    <Text
                      color={moduloDatos.color}
                      fontSize={{ base: "md", md: "lg" }}
                      lineHeight="2"
                      letterSpacing="0.02em"
                      whiteSpace="pre-wrap"
                    >
                      {datos.letra}
                    </Text>
                  </Box>
                </Collapse>
              </Box>
            )}
            {/* CTA Clases particulares */}
            {moduloDatos && (
              <Flex
                direction="column"
                align="center"
                maxW="800px"
                w="100%"
                textAlign="center"
                px={{ base: 6, md: 10 }}
                pt={{ base: 6, md: 8 }}
                gap={1}
              >
                <Text
                  fontSize={{ base: "lg", md: "xl" }}
                  color={moduloDatos.bgColor}
                  lineHeight="1.8"
                  textShadow={`0 0 10px ${moduloDatos.color}, 0 2px 14px ${moduloDatos.color}97`}
                  letterSpacing="0.02em"
                >
                  ¿Buscas profundizar y recibir un acompañamiento personalizado?
                </Text>
                <Text
                  fontSize={{ base: "lg", md: "xl" }}
                  color={moduloDatos.bgColor}
                  lineHeight="1.8"
                  textShadow={`0 0 10px ${moduloDatos.color}, 0 2px 14px ${moduloDatos.color}97`}
                  letterSpacing="0.02em"
                  fontStyle="italic"
                  mb={4}
                >
                  Pide información sin compromiso.
                </Text>
                <Box
                  as="a"
                  href="/contacto"
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
                  px={7} py={2}
                  borderRadius="full"
                  border={`2px solid ${moduloDatos.color}88`}
                  color={moduloDatos.color}
                  fontFamily="'EB Garamond', serif"
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight="600"
                  bg={moduloDatos.bgColor}
                  letterSpacing="0.05em"
                  cursor="pointer"
                  boxShadow={`0 0 20px ${moduloDatos.color}bb, 0 2px 14px ${moduloDatos.color}77`}
                  _hover={{ bg: `${moduloDatos.color}22`, borderColor: moduloDatos.color, boxShadow: `0 0 30px ${moduloDatos.color}dd, 0 4px 18px ${moduloDatos.color}99` }}
                  transition="all 0.2s"
                >
                  Contactar
                </Box>
              </Flex>
            )}

          </Flex>
        </Box>
      )}

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
        <Text
          as="a"
          href="/contacto"
          color="rgba(255,255,255,0.4)"
          fontSize="xs"
          letterSpacing="0.05em"
          display="block"
          textAlign="center"
          mt={1}
          textDecoration="underline"
          cursor="pointer"
        >
          Contactar
        </Text>
      </Box>
    </Box>
  );
}
