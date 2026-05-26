import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { CartaAstral3D } from "../../components/metodo/CartaAstral3D/CartaAstral3D";
import { astrologiaBg, astrologiaTxt, AstrologiaIcon } from "../../GlobalVariables";

export default function MetodoAstrologiaCartaAstral() {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) {
      navigate("/welcome");
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [navigate]);

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="#008080"
      fontFamily="'EB Garamond', serif"
    >
      <SiteHeader variant="private" />

      <Flex
        flex="1"
        justify="center"
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 8, md: 12 }}
        pb={{ base: 12, md: 16 }}
      >
        <Flex direction="column" align="center" w="100%" maxW="900px" gap={{ base: 6, md: 8 }}>
          <MetodoStepHeader
            icon={<AstrologiaIcon size={{ base: "40px", md: "56px" }} />}
            title="Astrología"
            bgColor={`${astrologiaBg}dd`}
            color={astrologiaTxt}
            space
            mb={0}
            prev={{ label: "← Volver", onClick: () => navigate("/metodo/astrologia") }}
            next={{ label: "Continuar a los planetas →", onClick: () => navigate("/metodo/astrologia/planetas") }}
          />

          <Flex direction="column" align="center" gap={3} mt={2}>
            <Text
              color="white"
              fontSize={{ base: "2xl", md: "4xl" }}
              fontWeight="700"
              letterSpacing="0.06em"
              textAlign="center"
              style={{ textShadow: `0 0 14px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.3), 0 0 60px ${astrologiaTxt}55` }}
            >
              Tu universo personal
            </Text>
            <Text
              color={`${astrologiaTxt}cc`}
              fontSize={{ base: "sm", md: "md" }}
              fontStyle="italic"
              lineHeight="1.7"
              textAlign="center"
              maxW="540px"
              style={{ textShadow: `0 0 8px rgba(255,255,255,0.35)` }}
            >
              Usa las flechas ← → para recorrer tus planetas
            </Text>
          </Flex>

          <CartaAstral3D color={astrologiaTxt} />
        </Flex>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
