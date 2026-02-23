import React, { useEffect, useState } from "react";
import { Box, Flex, HStack, Image, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import type { Submodulo } from "../../dtos/aprendizaje.type";
import { modulosNeuroPsicologia } from "../../hardCoded/aprendizajes/ModulosNeuroPsicologia";
import { AprendizajeIcon, EspacioPersonalIcon } from "../../GlobalVariables";

export default function VideoLessonPage() {
  const { moduloId, submoduloId } = useParams<{ moduloId: string; submoduloId: string }>();
  const [datos, setdatos] = useState<Submodulo | null>(null);
  const [img, setImg] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setImg(sessionStorage.getItem("img"));
  }, []);

  const getNeuroPsicologiaSubmoduleByTitle = (title: string): Submodulo | null => {
    for (const modulo of modulosNeuroPsicologia) {
      const found = modulo.submodules.find((sub) => sub.id === title);
      if (found) return found;
    }
    return null;
  };

  useEffect(() => {
    if (moduloId && submoduloId) {
      setdatos(getNeuroPsicologiaSubmoduleByTitle(submoduloId!));
    }
  }, [moduloId, submoduloId]);

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
            <Box
              bg="rgba(255,255,255,0.14)"
              border="1px solid rgba(255,255,255,0.38)"
              sx={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
              borderRadius="2xl"
              boxShadow="0 8px 40px rgba(107,196,200,0.45)"
              px={{ base: 8, md: 14 }}
              py={{ base: 6, md: 8 }}
              w="100%"
              maxW="850px"
              mb={{ base: 8, md: 10 }}
            >
              <HStack spacing={4} justify="center">
                <datos.detalles.icon size="56px" />
                <Text
                  color="white"
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="700"
                  letterSpacing="0.05em"
                  textShadow="0 2px 10px rgba(0,100,90,0.4)"
                >
                  {datos.nom}
                </Text>
              </HStack>
            </Box>

            {/* Video */}
            <Box
              w={{ base: "100%", md: "70%", xl: "60%" }}
              aspectRatio={16 / 9}
              borderRadius="2xl"
              overflow="hidden"
              boxShadow="0 8px 40px rgba(0,0,0,0.45), 0 0 30px rgba(107,196,200,0.3)"
              mb={{ base: 6, md: 8 }}
            >
              <iframe
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                src={`https://www.youtube.com/embed/${datos.video}`}
                title="YouTube video player"
                allowFullScreen
              />
            </Box>

            {/* Descripción */}
            <Text
              maxW="800px"
              textAlign="center"
              fontSize={{ base: "md", md: "lg" }}
              color="rgba(255,255,255,0.9)"
              lineHeight="1.8"
              letterSpacing="0.02em"
              mb={{ base: 8, md: 10 }}
            >
              {datos.descripcion}
            </Text>

            {/* Botones de navegación */}
            <Flex gap={4} justify="center">
              <Box
                as="button"
                disabled={!datos.linkAnterior}
                onClick={() => datos.linkAnterior && navigate(datos.linkAnterior)}
                px={8}
                py={3}
                borderRadius="full"
                border="2px solid rgba(255,255,255,0.6)"
                color="white"
                fontFamily="'EB Garamond', serif"
                fontSize="xl"
                fontWeight="700"
                bg="transparent"
                cursor={datos.linkAnterior ? "pointer" : "not-allowed"}
                opacity={datos.linkAnterior ? 1 : 0.4}
                transition="all 0.2s"
                _hover={datos.linkAnterior ? { bg: "rgba(255,255,255,0.15)", borderColor: "white" } : {}}
              >
                ←
              </Box>
              <Box
                as="button"
                disabled={!datos.linkNext}
                onClick={() => datos.linkNext && navigate(datos.linkNext)}
                px={8}
                py={3}
                borderRadius="full"
                border="2px solid rgba(255,255,255,0.6)"
                color="white"
                fontFamily="'EB Garamond', serif"
                fontSize="xl"
                fontWeight="700"
                bg="transparent"
                cursor={datos.linkNext ? "pointer" : "not-allowed"}
                opacity={datos.linkNext ? 1 : 0.4}
                transition="all 0.2s"
                _hover={datos.linkNext ? { bg: "rgba(255,255,255,0.15)", borderColor: "white" } : {}}
              >
                →
              </Box>
            </Flex>
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
      </Box>
    </Box>
  );
}
