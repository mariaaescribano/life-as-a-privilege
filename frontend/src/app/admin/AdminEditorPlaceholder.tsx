import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LoadingDisciplina } from "../../components/metodo/comicLoaders";
import { disciplinaByKey } from "../../data/adminDisciplinas";
import { useAdminGuard } from "./useAdminGuard";

export default function AdminEditorPlaceholder() {
  const navigate = useNavigate();
  const { disciplina } = useParams<{ disciplina: string }>();
  const { verificando } = useAdminGuard();
  const disc = disciplinaByKey(disciplina ?? "");

  if (verificando) {
    return <LoadingDisciplina color={disc?.txt} />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#F0DCC0" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />
      <Flex flex="1" justify="center" align="center" px={6} py={16}>
        <Flex direction="column" align="center" gap={4} maxW="480px" textAlign="center">
          {disc && (
            <Box style={{ filter: `drop-shadow(0 0 10px ${disc.txt}66)` }}>
              <disc.Icon size={{ base: "48px", md: "60px" }} />
            </Box>
          )}
          <Text color="#005F5F" fontSize="2xl" fontWeight="700" textTransform="capitalize">
            {disc?.nombre ?? "Disciplina"}
          </Text>
          <Text color="#005F5Fcc" fontStyle="italic">
            El editor de contenido de esta disciplina aún no está disponible. Lo añadiremos pronto.
          </Text>
          <Text as="button" onClick={() => navigate(`/admin/${disc?.key ?? ""}`)} color="#005F5F" textDecoration="underline" mt={2}>
            ← Volver a la lista
          </Text>
        </Flex>
      </Flex>
      <SiteFooter />
    </Box>
  );
}
