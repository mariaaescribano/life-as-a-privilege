import React, { useEffect, useState } from "react";
import { Box, Collapse, Flex, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { ContactModal } from "../../components/global/ContactModal";
import { SubscribeBox } from "../../components/global/SubscribeBox";
import { DisciplineHeader } from "../../components/global/DisciplineHeader";
import { FloatingActionButton } from "../../components/aprendizaje/FloatingActionButton";
import type { Modulo, ModuloContenido, Submodulo } from "../../dtos/aprendizaje.type";
import { modulosNeuroPsicologia, modulosEsquizofrenia, modulosAnorexia, modulosDepresion, modulosPadresHeridos } from "../../hardCoded/aprendizajes/NeuroPsicologia/ModulosNeuroPsicologia";
import SiteHeader from "../../components/global/SiteHeader";
import { VolverAlMapa } from "../../components/global/VolverAlMapa";
import SiteFooter from "../../components/global/Footer";
import {
  astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaNomLink, ayurvedaTxt,
  cabalaBg, CabalaIcon, cabalaNom, cabalaTxt,
  culturaBg, CulturaIcon, culturaNom, culturaNomLink, culturaTxt,
  fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
  nutricionBg, NutricionIcon, nutricionNom, nutricionNomLink, nutricionTxt,
  tcmBg, TCMIcon, tcmNom, tcmNomLink, tcmTxt,
} from "../../GlobalVariables";
import { modulostcmFundamentos, modulostcmCincoElementos } from "../../hardCoded/aprendizajes/TCM/ModulosTCM";
import { modulosFitoterapia } from "../../hardCoded/aprendizajes/Fitoterapia/ModulosFitoterpia";
import { modulosAstrologia, modulosAstrologiaCurso0, modulosArquetipos } from "../../hardCoded/aprendizajes/Astrologia/ModulosAstrologia";
import { modulosCabala } from "../../hardCoded/aprendizajes/Cabala/ModulosCabala";
import { modulosCabala2 } from "../../hardCoded/aprendizajes/Cabala/ModulosCabala2";
import { modulosNutricion, modulosMicrobiota } from "../../hardCoded/aprendizajes/Nutricion/ModulosNutricion";
import { modulosGrasas } from "../../hardCoded/aprendizajes/Nutricion/ModulosGrasas";
import { modulosAyurveda } from "../../hardCoded/aprendizajes/Ayurveda/ModulosAyurveda";
import { modulosChakras } from "../../hardCoded/aprendizajes/Ayurveda/ModulosChakras";
import { modulosKarma } from "../../hardCoded/aprendizajes/Ayurveda/ModulosKarma";
import { modulosFisiologia, modulosFisiologiaInflamacion, modulosFisiologiaCancer, modulosFisiologiaMeditacion, modulosFisiologiaEjercicio } from "../../hardCoded/aprendizajes/Fisiologia/ModulosFisiologia";
import { modulosCultura } from "../../hardCoded/aprendizajes/Cultura/ModulosCultura";
import { modulosFisica } from "../../hardCoded/aprendizajes/Cultura/ModulosFisica";

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
      case neuropsicologiaNom + "cursoEsq":
        return { nom: neuropsicologiaNom, nomModalidad: nom, bgColor: neuropsicologiaBg, color: neuropsicologiaTxt, icon: <NeuropsicologiaIcon size={{ base: "44px", md: "44px" }} /> };
      case neuropsicologiaNom + "cursoAnx":
        return { nom: neuropsicologiaNom, nomModalidad: nom, bgColor: neuropsicologiaBg, color: neuropsicologiaTxt, icon: <NeuropsicologiaIcon size={{ base: "44px", md: "44px" }} /> };
      case neuropsicologiaNom + "cursoDep":
        return { nom: neuropsicologiaNom, nomModalidad: nom, bgColor: neuropsicologiaBg, color: neuropsicologiaTxt, icon: <NeuropsicologiaIcon size={{ base: "44px", md: "44px" }} /> };
      case neuropsicologiaNom + "cursoPad":
        return { nom: neuropsicologiaNom, nomModalidad: nom, bgColor: neuropsicologiaBg, color: neuropsicologiaTxt, icon: <NeuropsicologiaIcon size={{ base: "44px", md: "44px" }} /> };
      case fisiologiaNom:
        return { nom: fisiologiaNom, nomModalidad: nom, bgColor: fisiologiaBg, color: fisiologiaTxt, icon: <FisiologiaIcon size="44px" /> };
      case astrologiaNom:
        return { nom: astrologiaNom, nomModalidad: nom, bgColor: astrologiaBg, color: astrologiaTxt, icon: <AstrologiaIcon size={{ base: "44px", md: "44px" }}/> };
      case tcmNomLink:
        return { nom: tcmNom, nomModalidad: nom, bgColor: tcmBg, color: tcmTxt, icon: <TCMIcon size={{ base: "44px", md: "44px" }} /> };
      case nutricionNomLink:
        return { nom: nutricionNom, nomModalidad: nom, bgColor: nutricionBg, color: nutricionTxt, icon: <NutricionIcon size={{ base: "44px", md: "44px" }}  /> };
      case "ayurveda":
        return { nom: ayurvedaNom, nomModalidad: nom, bgColor: ayurvedaBg, color: ayurvedaTxt, icon: <AyurvedaIcon size={{ base: "44px", md: "44px" }} /> };
      case cabalaNom:
        return { nom: cabalaNom, nomModalidad: nom, bgColor: cabalaBg, color: cabalaTxt, icon: <CabalaIcon size={{ base: "44px", md: "44px" }} /> };
      case culturaNomLink:
        return { nom: culturaNom, nomModalidad: nom, bgColor: culturaBg, color: culturaTxt, icon: <CulturaIcon size={{ base: "44px", md: "44px" }} /> };
      default:
        return { nom: "", nomModalidad: "", bgColor: "", color: "", icon: null };
    }
  };

  const getModulosPageLink = (): string => {
    if (!moduloId || !datos?.cursoId) return "";
    if (moduloId.startsWith(neuropsicologiaNom)) {
      return `/aprendizaje/cursos/${neuropsicologiaNom}`;
    }
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
      else if(moduloId === neuropsicologiaNom + "cursoEsq")
      {
        setdatos(getModuleByTitle(submoduloId!, modulosEsquizofrenia));
      }
      else if(moduloId === neuropsicologiaNom + "cursoAnx")
      {
        setdatos(getModuleByTitle(submoduloId!, modulosAnorexia));
      }
      else if(moduloId === neuropsicologiaNom + "cursoDep")
      {
        setdatos(getModuleByTitle(submoduloId!, modulosDepresion));
      }
      else if(moduloId === neuropsicologiaNom + "cursoPad")
      {
        setdatos(getModuleByTitle(submoduloId!, modulosPadresHeridos));
      }
      else if(moduloId === tcmNomLink)
      {
        setdatos(getModuleByTitle(submoduloId!, [...modulostcmFundamentos, ...modulostcmCincoElementos]));
      }
      else if(moduloId === astrologiaNom)
      {
        setdatos(
          getModuleByTitle(submoduloId!, modulosAstrologiaCurso0) ??
          getModuleByTitle(submoduloId!, modulosAstrologia) ??
          getModuleByTitle(submoduloId!, modulosArquetipos)
        );
      }
      else if(moduloId === cabalaNom)
      {
        setdatos(
          getModuleByTitle(submoduloId!, modulosCabala) ??
          getModuleByTitle(submoduloId!, modulosCabala2)
        );
      }
      else if(moduloId === nutricionNomLink)
      {
        setdatos(
          getModuleByTitle(submoduloId!, modulosNutricion) ??
          getModuleByTitle(submoduloId!, modulosMicrobiota) ??
          getModuleByTitle(submoduloId!, modulosGrasas) ??
          getModuleByTitle(submoduloId!, modulosFitoterapia)
        );
      }
      else if(moduloId === ayurvedaNomLink)
      {
        setdatos(
          getModuleByTitle(submoduloId!, modulosAyurveda) ??
          getModuleByTitle(submoduloId!, modulosChakras) ??
          getModuleByTitle(submoduloId!, modulosKarma)
        );
      }
      else if(moduloId === fisiologiaNom)
      {
        setdatos(
          getModuleByTitle(submoduloId!, modulosFisiologia) ??
          getModuleByTitle(submoduloId!, modulosFisiologiaInflamacion) ??
          getModuleByTitle(submoduloId!, modulosFisiologiaCancer) ??
          getModuleByTitle(submoduloId!, modulosFisiologiaMeditacion) ??
          getModuleByTitle(submoduloId!, modulosFisiologiaEjercicio)
        );
      }
      else if(moduloId === culturaNomLink)
      {
        setdatos(
          getModuleByTitle(submoduloId!, modulosCultura) ??
          getModuleByTitle(submoduloId!, modulosFisica)
        );
      }
    }
  }, [moduloId, submoduloId]);

  const [saberMasOpen, setSaberMasOpen] = useState(false);

  // Aquí vivían el reproductor de YouTube y su fontanería: control de velocidad,
  // autoplay al encadenar lecciones y un listener de `postMessage` contra la API
  // de YouTube. Se retiró todo junto con el iframe.

  const GLOW = "0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)";

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">

      {/* ── HEADER ── */}
      <SiteHeader variant="auto" />
      <VolverAlMapa />

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
              <DisciplineHeader
                icon={<datos.icon size={{ base: "28px", md: "34px" }} />}
                title={datos.nom}
                bgColor={moduloDatos.bgColor}
                color={moduloDatos.color}
                onIconClick={() => { const link = getModulosPageLink(); if (link) navigate(link); }}
                compact
              />
            )}

            {/* Flechas de lección anterior / siguiente. Antes flanqueaban el
                vídeo en escritorio y estas solo salían en móvil; al quitar el
                reproductor son las únicas, así que se ven en todos los tamaños. */}
            <Flex
              display="flex"
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
            
            {moduloDatos && (
              <SubscribeBox />
            )}

          </Flex>
        </Box>
      )}

      {/* ── FOOTER ── */}
      <SiteFooter />

      {/* ── BOTÓN FLOTANTE ── */}
      {datos?.floatingButton && moduloDatos && moduloId !== fisiologiaNom && (
        <FloatingActionButton
          config={{ ...datos.floatingButton, action: datos.floatingButton.action === "astrologia-services" ? "astrologia-services" : "modal" }}
          color={moduloDatos.color}
          bgColor={moduloDatos.bgColor}
          icon={<datos.icon size="22px" />}
          modalityName={moduloDatos.nom}
        />
      )}

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
