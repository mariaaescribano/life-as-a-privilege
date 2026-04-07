import React, { useEffect, useRef, useState } from "react";
import { Box, Collapse, Flex, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { ContactModal } from "../../components/global/ContactModal";
import { SaberMasButton } from "../../components/global/SaberMasButton";
import { DisciplineHeader } from "../../components/global/DisciplineHeader";
import { FloatingActionButton } from "../../components/aprendizaje/FloatingActionButton";
import type { Modulo, ModuloContenido, Submodulo } from "../../dtos/aprendizaje.type";
import { modulosNeuroPsicologia, modulosEsquizofrenia, modulosAnorexia } from "../../hardCoded/aprendizajes/NeuroPsicologia/ModulosNeuroPsicologia";
import SiteHeader from "../../components/global/SiteHeader";
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
import { modulosAyurveda } from "../../hardCoded/aprendizajes/Ayurveda/ModulosAyurveda";
import { modulosFisiologia, modulosFisiologiaInflamacion, modulosFisiologiaCancer } from "../../hardCoded/aprendizajes/Fisiologia/ModulosFisiologia";
import { modulosCultura } from "../../hardCoded/aprendizajes/Cultura/ModulosCultura";

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
          getModuleByTitle(submoduloId!, modulosFitoterapia)
        );
      }
      else if(moduloId === ayurvedaNomLink)
      {
        setdatos(getModuleByTitle(submoduloId!, modulosAyurveda));
      }
      else if(moduloId === fisiologiaNom)
      {
        setdatos(
          getModuleByTitle(submoduloId!, modulosFisiologia) ??
          getModuleByTitle(submoduloId!, modulosFisiologiaInflamacion) ??
          getModuleByTitle(submoduloId!, modulosFisiologiaCancer)
        );
      }
      else if(moduloId === culturaNomLink)
      {
        setdatos(getModuleByTitle(submoduloId!, modulosCultura));
      }
    }
  }, [moduloId, submoduloId]);

  const [saberMasOpen, setSaberMasOpen] = useState(false);
  const [speed, setSpeed] = useState(() => {
    const s = parseFloat(sessionStorage.getItem("videoSpeed") ?? "1");
    return isNaN(s) ? 1 : s;
  });
  const [shouldAutoplay, setShouldAutoplay] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const val = sessionStorage.getItem("videoAutoplay") === "1";
    sessionStorage.removeItem("videoAutoplay");
    setShouldAutoplay(val);
  }, [moduloId, submoduloId]);

  // Auto-avance al vídeo siguiente cuando YouTube termina; aplica velocidad guardada al cargar
  useEffect(() => {
    const applySpeed = () => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "setPlaybackRate", args: [speed] }),
        "*"
      );
    };
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.youtube.com") return;
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        // Aplica velocidad cuando el player está listo y al comenzar a reproducir
        if (data.event === "onReady" || (data.event === "onStateChange" && data.info === 1)) {
          applySpeed();
        }
        if (data.event === "onStateChange" && data.info === 0 && datos?.linkNext) {
          sessionStorage.setItem("videoAutoplay", "1");
          navigate(datos.linkNext);
        }
      } catch {}
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [datos, navigate, speed]);

  const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  const changeSpeed = (rate: number) => {
    setSpeed(rate);
    sessionStorage.setItem("videoSpeed", String(rate));
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: "setPlaybackRate", args: [rate] }),
      "*"
    );
  };

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
              <DisciplineHeader
                icon={<datos.icon size={{ base: "28px", md: "34px" }} />}
                title={datos.nom}
                bgColor={moduloDatos.bgColor}
                color={moduloDatos.color}
                onIconClick={() => { const link = getModulosPageLink(); if (link) navigate(link); }}
                compact
              />
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
                  key={datos.video}
                  ref={iframeRef}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  src={`https://www.youtube.com/embed/${datos.video}?enablejsapi=1${shouldAutoplay ? "&autoplay=1" : ""}`}
                  title="YouTube video player"
                  allowFullScreen
                  onLoad={() => {
                    iframeRef.current?.contentWindow?.postMessage(
                      JSON.stringify({ event: "listening" }),
                      "*"
                    );
                  }}
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

            {/* Velocidad de reproducción */}
            <Flex
              alignSelf="center"
              gap={1}
              mb={{ base: 4, md: 6 }}
              bg="rgba(0,0,0,0.45)"
              borderRadius="full"
              px={3} py="6px"
              border="1px solid rgba(255,255,255,0.18)"
            >
              {SPEEDS.map((rate) => (
                <Box
                  key={rate}
                  as="button"
                  onClick={() => changeSpeed(rate)}
                  px="10px" py="4px"
                  borderRadius="full"
                  fontSize={{ base: "12px", md: "13px" }}
                  fontWeight="700"
                  letterSpacing="0.04em"
                  cursor="pointer"
                  color={speed === rate ? "#1a1a1a" : "rgba(255,255,255,0.80)"}
                  bg={speed === rate ? "white" : "transparent"}
                  transition="all 0.18s ease"
                  _hover={{ color: speed === rate ? "#1a1a1a" : "white", bg: speed === rate ? "white" : "rgba(255,255,255,0.12)" }}
                >
                  {rate === 1 ? "1×" : `${rate}×`}
                </Box>
              ))}
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

      {/* ── BOTÓN FLOTANTE ── */}
      {datos?.floatingButton && moduloDatos && moduloId !== fisiologiaNom && (
        <FloatingActionButton
          config={datos.floatingButton}
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
