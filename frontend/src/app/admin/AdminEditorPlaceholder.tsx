import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { disciplinaByKey } from "../../data/adminDisciplinas";
import { useAdminGuard } from "./useAdminGuard";

export default function AdminEditorPlaceholder() {
  const navigate = useNavigate();
  const { disciplina } = useParams<{ disciplina: string }>();
  const { verificando } = useAdminGuard();
  const disc = disciplinaByKey(disciplina ?? "");

  if (verificando) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />
      <Flex flex="1" justify="center" align="center" px={6} py={16}>
        <Flex direction="column" align="center" gap={4} maxW="480px" textAlign="center">
          {disc && (
            <Box style={{ filter: `drop-shadow(0 0 10px ${disc.txt}66)` }}>
              <disc.Icon size={{ base: "48px", md: "60px" }} />
            </Box>
          )}
          <Text color="white" fontSize="2xl" fontWeight="700" textTransform="capitalize">
            {disc?.nombre ?? "Disciplina"}
          </Text>
          <Text color="rgba(255,255,255,0.7)" fontStyle="italic">
            El editor de contenido de esta disciplina aún no está disponible. Lo añadiremos pronto.
          </Text>
          <Text as="button" onClick={() => navigate(`/admin/${disc?.key ?? ""}`)} color={disc?.txt ?? "white"} mt={2}
                _hover={{ textShadow: "0 0 10px rgba(255,255,255,0.5)" }}>
            ← Volver a la lista
          </Text>
        </Flex>
      </Flex>
      <SiteFooter />
    </Box>
  );
}
