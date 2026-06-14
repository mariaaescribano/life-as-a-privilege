import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { AgendarLlamada } from "../../components/global/AgendarLlamada";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { astrologiaBg, astrologiaNom, astrologiaTxt, AstrologiaIcon } from "../../GlobalVariables";

/**
 * Última pantalla del Recorrido de Astrología: reservar una llamada (de pago,
 * pago simulado por ahora) con María. Estilo astrología (fondo estrellado +
 * texto con brillo). Usa el componente reutilizable AgendarLlamada.
 */
export default function MetodoAstrologiaLlamada() {
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, []);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={6}>
          <MetodoStepHeader
            icon={<AstrologiaIcon size={{ base: "40px", md: "52px" }} />}
            title="Llamada"
            bgColor={`${astrologiaBg}dd`}
            color={astrologiaTxt}
            space
            mb={0}
            prev={{ label: "← Aspectos", onClick: () => navigate("/metodo/astrologia/aspectos") }}
            next={{
              label: "Psicología →",
              onClick: () => navigate("/metodo/psicologia"),
              disabled: true,
              disabledTooltip: "Psicología estará disponible próximamente",
            }}
          />

          <AgendarLlamada
            color={astrologiaTxt}
            bgColor={astrologiaBg}
            disciplinaNom={astrologiaNom}
            precio={20}
            titulo="Reserva tu llamada de astrología"
          />

          {/* Nota debajo del box de la llamada, con fondo de astrología */}
          <Box
            position="relative"
            w="100%"
            borderRadius="2xl"
            overflow="hidden"
            border={`1px solid ${astrologiaTxt}44`}
            boxShadow={`0 0 18px rgba(255,255,255,0.1), 0 0 30px ${astrologiaTxt}1a`}
          >
            <DisciplinaBgLayer nom={astrologiaNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 7, md: 9 }} textAlign="center">
              <Text
                color={`${astrologiaTxt}ee`}
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="1.9"
                style={{ textShadow: `0 0 10px ${astrologiaTxt}44` }}
              >
                Da el paso de integrar tus arquetipos: agenda una llamada y no te quedes con dudas.
              </Text>
              <Text
                color={`${astrologiaTxt}bb`}
                fontSize={{ base: "xs", md: "sm" }}
                fontStyle="italic"
                mt={3}
                lineHeight="1.6"
                style={{ textShadow: `0 0 8px ${astrologiaTxt}33` }}
              >
                La llamada es opcional pero recomendada. Puedes avanzar a Psicología.
              </Text>
            </Box>
          </Box>
        </Flex>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
