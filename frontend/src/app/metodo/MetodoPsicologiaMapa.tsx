import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { experienciaById } from "../../components/metodo/psicologiaRecorrido";
import {
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt;
const PAPEL = "#fbf4e8";
// Halo claro (crema + color de la disciplina) para despegar la tinta del fondo.
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

export default function MetodoPsicologiaMapa() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    if (!exp) { navigate("/metodo/psicologia", { replace: true }); }
  }, [exp, navigate]);

  if (!exp) return null;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box position="relative" flex="1">
        <Flex position="relative" zIndex={1} justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
          <Flex direction="column" align="center" w="100%" maxW="760px" gap={{ base: 8, md: 10 }}>

            <MetodoStepHeader
              icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
              title="Mapa de consciencia"
              bgColor={`${neuropsicologiaBg}f0`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              step={{ current: 8, total: 9 }}
              mb={0}
              prev={{ label: "← Integración", onClick: () => navigate(`/metodo/psicologia/${exp.id}/integracion`) }}
            />

            {/* Placeholder — pendiente de definir el contenido del mapa */}
            <Box
              position="relative"
              w="100%"
              borderRadius="2xl"
              overflow="hidden"
              border={`1px solid ${TINTA}33`}
              boxShadow={`0 10px 40px rgba(94,45,16,0.18), 0 0 0 1px ${neuropsicologiaBg}55`}
            >
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1} px={{ base: 7, md: 11 }} py={{ base: 12, md: 16 }} textAlign="center">
                <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontStyle="italic" lineHeight="1.8" style={{ textShadow: INK_SHADOW }}>
                  Tu mapa de consciencia se mostrará aquí.
                </Text>
              </Box>
            </Box>

          </Flex>
        </Flex>
      </Box>

      <SiteFooter />
    </Box>
  );
}
