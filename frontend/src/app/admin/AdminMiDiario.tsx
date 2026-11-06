import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { ListaDiarioMaria } from "../../components/global/DiarioMaria";
import { useAdminGuard } from "./useAdminGuard";

// El DIARIO de María: lo que apunta de sí misma. Solo lo ve ella. Se escribe desde «Notas»
// (pestaña DIARIO) dentro del recorrido que hace con una persona; aquí se lee todo junto.
export default function AdminMiDiario() {
  const { verificando } = useAdminGuard();
  if (verificando) return <LifeLoading variant="private" />;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />
      <Flex flex="1" justify="center" px={{ base: 5, md: 10 }} pt={{ base: 8, md: 12 }} pb={{ base: 10, md: 16 }}>
        <Box w="100%" maxW="820px">
          <Text color="white" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="700" letterSpacing="0.08em" textTransform="uppercase"
                lineHeight="1.15" textAlign="center" mb={{ base: 6, md: 8 }}
                textShadow="0 0 14px rgba(255,255,255,0.6), 0 0 30px rgba(180,255,245,0.3)">
            Diario
          </Text>
          <ListaDiarioMaria />
        </Box>
      </Flex>
      <SiteFooter />
    </Box>
  );
}
