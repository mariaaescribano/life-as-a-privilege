// Página 404. Antes, cualquier URL inventada renderizaba Welcome, así que un
// enlace roto parecía la portada: ni el visitante sabía que se había equivocado
// ni Google podía distinguir una página real de una que no existe.
import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { useT } from "../../i18n";

export default function NoEncontrada() {
  const navigate = useNavigate();
  const t = useT();

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      <Flex flex="1" direction="column" align="center" justify="center" textAlign="center"
            px={{ base: 6, md: 10 }} py={{ base: 12, md: 20 }} gap={{ base: 5, md: 6 }}>
        <Image
          src="/img/icono/life.png"
          alt=""
          h={{ base: "64px", md: "84px" }}
          objectFit="contain"
          style={{ filter: "drop-shadow(0 0 9px rgba(255,255,255,0.55)) drop-shadow(0 0 24px rgba(180,255,245,0.28))" }}
        />

        <Text color="white" fontSize={{ base: "5xl", md: "7xl" }} fontWeight="700" lineHeight="1"
              letterSpacing="0.04em"
              textShadow="0 0 18px rgba(255,255,255,0.45), 0 0 40px rgba(180,255,245,0.22)">
          404
        </Text>

        <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight="600" letterSpacing="0.05em"
              textTransform="uppercase"
              textShadow="0 0 12px rgba(255,255,255,0.35)">
          {t("web.404.titulo")}
        </Text>

        <Text color="rgba(255,255,255,0.78)" fontSize={{ base: "md", md: "lg" }} fontStyle="italic" maxW="520px">
          {t("web.404.texto")}
        </Text>

        <Flex gap={4} wrap="wrap" justify="center" mt={2}>
          <Box as="button" onClick={() => navigate("/")}
               px={7} py={3} borderRadius="full" bg="rgba(255,255,255,0.12)"
               border="1.5px solid rgba(255,255,255,0.5)" color="white" fontWeight="700"
               fontSize={{ base: "sm", md: "md" }} letterSpacing="0.04em" cursor="pointer"
               transition="all 0.2s" _hover={{ bg: "rgba(255,255,255,0.2)", transform: "translateY(-2px)" }}>
            {t("web.404.inicio")}
          </Box>
          <Box as="button" onClick={() => navigate("/elMetodo")}
               px={7} py={3} borderRadius="full" bg="transparent"
               border="1.5px solid rgba(255,255,255,0.35)" color="rgba(255,255,255,0.9)" fontWeight="600"
               fontSize={{ base: "sm", md: "md" }} letterSpacing="0.04em" cursor="pointer"
               transition="all 0.2s" _hover={{ bg: "rgba(255,255,255,0.12)", transform: "translateY(-2px)" }}>
            {t("web.404.recorrido")}
          </Box>
        </Flex>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
