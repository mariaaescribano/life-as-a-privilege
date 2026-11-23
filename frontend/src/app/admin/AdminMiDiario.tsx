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
    <Box minH="100vh" display="flex" flexDirection="column" bg="#F0DCC0" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />
      <Flex flex="1" justify="center" px={{ base: 5, md: 10 }} pt={{ base: 8, md: 12 }} pb={{ base: 10, md: 16 }}>
        <Box w="100%" maxW="820px">
          <Text color="#005F5F" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="700" letterSpacing="0.08em" textTransform="uppercase"
                lineHeight="1.15" textAlign="center" mb={{ base: 6, md: 8 }}>
            Diario
          </Text>
          <ListaDiarioMaria />
        </Box>
      </Flex>
      <SiteFooter />
    </Box>
  );
}
