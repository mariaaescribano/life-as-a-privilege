import React, { useEffect, useState } from "react";
import { Box, Collapse, Flex, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { ContactModal } from "../../components/global/ContactModal";
import { SaberMasButton } from "../../components/global/SaberMasButton";
import type { Modulo, ModuloContenido, Submodulo } from "../../dtos/aprendizaje.type";
import { modulosNeuroPsicologia } from "../../hardCoded/aprendizajes/NeuroPsicologia/ModulosNeuroPsicologia";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import {
  astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaNomLink, ayurvedaTxt,
  fitoterapiaBg, FitoterapiaIcon, fitoterapiaNom, fitoterapiaTxt,
  cabalaBg, CabalaIcon, cabalaNom, cabalaTxt,
  fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
  nutricionBg, NutricionIcon, nutricionNom, nutricionNomLink, nutricionTxt,
  tcmBg, TCMIcon, tcmNom, tcmNomLink, tcmTxt,
} from "../../GlobalVariables";
import { modulostcmFundamentos, modulostcmCincoElementos } from "../../hardCoded/aprendizajes/TCM/ModulosTCM";
import { modulosFitoterapia } from "../../hardCoded/aprendizajes/Fitoterapia/ModulosFitoterpia";
import { modulosAstrologia } from "../../hardCoded/aprendizajes/Astrologia/ModulosAstrologia";
import { modulosCabala } from "../../hardCoded/aprendizajes/Cabala/ModulosCabala";
import { modulosNutricion } from "../../hardCoded/aprendizajes/Nutricion/ModulosNutricion";
import { modulosAyurveda } from "../../hardCoded/aprendizajes/Ayurveda/ModulosAyurveda";

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
    const nom = moduloId ?? "";
    switch (moduloId) {
      case neuropsicologiaNom:
        return { nom: neuropsicologiaNom, nomModalidad: nom, bgColor: neuropsicologiaBg, color: neuropsicologiaTxt, icon: <NeuropsicologiaIcon size={{ base: "44px", md: "44px" }} /> };
      case "fisiologia":
        return { nom: fisiologiaNom, nomModalidad: nom, bgColor: fisiologiaBg, color: fisiologiaTxt, icon: <FisiologiaIcon size="44px" /> };
      case astrologiaNom:
        return { nom: astrologiaNom, nomModalidad: nom, bgColor: astrologiaBg, color: astrologiaTxt, icon: <AstrologiaIcon size={{ base: "44px", md: "44px" }}/> };
      case tcmNomLink:
        return { nom: tcmNom, nomModalidad: nom, bgColor: tcmBg, color: tcmTxt, icon: <TCMIcon size={{ base: "44px", md: "44px" }} /> };
      case nutricionNomLink:
        return { nom: nutricionNom, nomModalidad: nom, bgColor: nutricionBg, color: nutricionTxt, icon: <NutricionIcon size={{ base: "44px", md: "44px" }}  /> };
      case "ayurveda":
        return { nom: ayurvedaNom, nomModalidad: nom, bgColor: ayurvedaBg, color: ayurvedaTxt, icon: <AyurvedaIcon size={{ base: "44px", md: "44px" }} /> };
      case fitoterapiaNom:
        return { nom: fitoterapiaNom, nomModalidad: nom, bgColor: fitoterapiaBg, color: fitoterapiaTxt, icon: <FitoterapiaIcon size={{ base: "44px", md: "44px" }}  /> };
      case cabalaNom:
        return { nom: cabalaNom, nomModalidad: nom, bgColor: cabalaBg, color: cabalaTxt, icon: <CabalaIcon size={{ base: "44px", md: "44px" }} /> };
      default:
        return { nom: "", nomModalidad: "", bgColor: "", color: "", icon: null };
    }
  };

  const getModulosPageLink = (): string => {
    if (!moduloId || !datos?.cursoId) return "";
    return `/aprendizaje/modulosPage/${moduloId}/${datos.cursoId}`;
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
        setdatos(getModuleByTitle(submoduloId!, [...modulostcmFundamentos, ...modulostcmCincoElementos]));
      }
      else if(moduloId === fitoterapiaNom)
      { 
        setdatos(getModuleByTitle(submoduloId!, modulosFitoterapia));
      }
      else if(moduloId === astrologiaNom)
      { 
        setdatos(getModuleByTitle(submoduloId!, modulosAstrologia));
      }
      else if(moduloId === cabalaNom)
      {
        setdatos(getModuleByTitle(submoduloId!, modulosCabala));
      }
      else if(moduloId === nutricionNomLink)
      {
        setdatos(getModuleByTitle(submoduloId!, modulosNutricion));
      }
      else if(moduloId === ayurvedaNomLink)
      {
        setdatos(getModuleByTitle(submoduloId!, modulosAyurveda));
      }
    }
  }, [moduloId, submoduloId]);

  // Auto-avance al vídeo siguiente cuando YouTube termina
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data.event === "onStateChange" && data.info === 0 && datos?.linkNext) {
          navigate(datos.linkNext);
        }
      } catch {}
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [datos, navigate]);

  const [saberMasOpen, setSaberMasOpen] = useState(false);

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
                        as="button"
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
                        cursor="pointer"
                        onClick={() => { const link = getModulosPageLink(); if (link) navigate(link); }}
                        _hover={{ opacity: 0.75, transform: "scale(1.05)" }}
                        transition="all 0.2s"
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
                boxShadow={GLOW}
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
                boxShadow={GLOW}
              >
                <iframe
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  src={`https://www.youtube.com/embed/${datos.video}?enablejsapi=1`}
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
                boxShadow={GLOW}
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
                boxShadow={GLOW}
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
                boxShadow={GLOW}
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
                boxShadow={GLOW}
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
              <Box maxW="800px" w="100%" >
                {/* Cabecera toggle */}
                <Flex
                  as="button"
                  w="100%"
                  boxShadow={GLOW}
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
            
            {/* ── BOTÓN ¿QUIERES SABER MÁS? ── */}
            {moduloDatos && (
              <SaberMasButton
                  icon={moduloDatos.icon}
                  color={moduloDatos.color}
                  bgColor={moduloDatos.bgColor}
                  onClick={() => setSaberMasOpen(true)}
                />
            )}

          </Flex>
        </Box>
      )}

      {/* ── FOOTER ── */}
      <SiteFooter />

      {moduloDatos && (
        <ContactModal
          isOpen={saberMasOpen}
          onClose={() => setSaberMasOpen(false)}
          title="¿Quieres saber más?"
          icon={moduloDatos.icon}
          subtitle="Déjame tus datos y cuéntame en qué puedo ayudarte."
          bgColor={moduloDatos.bgColor}
          color={moduloDatos.color}
          emailSubject={`Quiero saber más — ${moduloDatos.nom}`}
          showDescription
        />
      )}
    </Box>
  );
}
