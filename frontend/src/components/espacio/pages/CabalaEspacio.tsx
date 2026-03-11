import React, { useEffect } from "react";
import { Box, Flex, VStack } from "@chakra-ui/react";
import SiteHeader from "../../global/SiteHeader";
import SiteFooter from "../../global/Footer";
import { DisciplineHeader } from "../../global/DisciplineHeader";
import {
  CabalaIcon,
  cabalaNom,
  cabalaBg,
  cabalaTxt,
} from "../../../GlobalVariables";
import ArbolDeLaVida from "../../global/ArbolDeLaVida";
import ThemeSection from "../components/ThemeSection";
import { preguntasCabala } from "../../../hardCoded/espacio/PreguntasCabala";

export default function CabalaEspacio() {

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      <Box flex="1">
        <Flex
          direction="column" alignItems="center"
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 14, md: 20 }}
        >
          <DisciplineHeader
            icon={<CabalaIcon size={{ base: "40px", md: "56px" }} />}
            title={cabalaNom}
            bgColor={cabalaBg}
            color={cabalaTxt}
            maxW="900px"
          />

          {/* ── Árbol de la Vida ── */}
          <Box
            w="100%"
            maxW="900px"
            boxShadow={"0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"}
            bg={cabalaBg}
            border={`1.5px solid ${cabalaTxt}55`}
            borderRadius="3xl"
            px={{ base: 6, md: 10 }}
            pt={{ base: 8, md: 10 }}
            pb={{ base: 8, md: 10 }}
            mb={{ base: 10, md: 14 }}
          >
            <ArbolDeLaVida />
          </Box>

          {/* ── Preguntas por sephirot ── */}
          <VStack spacing={6} w="100%" maxW="900px">
            {preguntasCabala.map((bloque, i) => (
              <ThemeSection
                key={i}
                title={bloque.title}
                icon={bloque.icon}
                subPreguntas={bloque.subPreguntas}
                bgColor={cabalaBg}
                color={cabalaTxt}
              />
            ))}
          </VStack>
        </Flex>
      </Box>

      <SiteFooter />
    </Box>
  );
}
