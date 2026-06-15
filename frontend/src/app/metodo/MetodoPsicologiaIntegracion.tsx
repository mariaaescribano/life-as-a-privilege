import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { PsicologiaBg } from "../../components/metodo/PsicologiaBg";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { AgendarLlamada } from "../../components/global/AgendarLlamada";
import {
  experienciaById,
  INTEGRACION,
} from "../../components/metodo/psicologiaRecorrido";
import {
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt;
const PAPEL = "#fbf4e8";
const INK_SHADOW = `0 1px 2px rgba(94,45,16,0.18)`;

export default function MetodoPsicologiaIntegracion() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");
  const [reservando, setReservando] = useState(false);
  const reservaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    if (!exp) { navigate("/metodo/psicologia", { replace: true }); }
  }, [exp, navigate]);

  if (!exp) return null;

  const abrirReserva = () => {
    setReservando(true);
    requestAnimationFrame(() => {
      reservaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box position="relative" flex="1" overflow="hidden">
        <PsicologiaBg overlay="rgba(247,236,220,0.22)" />

        <Flex position="relative" zIndex={1} justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
          <Flex direction="column" align="center" w="100%" maxW="760px" gap={{ base: 8, md: 10 }}>

            <MetodoStepHeader
              icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
              title="La Integración"
              bgColor={`${neuropsicologiaBg}f0`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              mb={0}
              prev={{ label: "← Los Nudos", onClick: () => navigate(`/metodo/psicologia/${exp.id}/nudos`) }}
            />

            {/* Texto principal */}
            <Flex direction="column" align="center" textAlign="center" gap={4} maxW="600px">
              <Text color={TINTA} fontSize="2xl" opacity={0.8} style={{ filter: `drop-shadow(0 0 6px ${TINTA}44)` }}>✦</Text>
              <Flex direction="column" gap={2.5}>
                {INTEGRACION.principal.map((p, i) => (
                  <Text key={i} color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight={i === INTEGRACION.principal.length - 1 ? "700" : "500"} lineHeight="1.5" style={i === INTEGRACION.principal.length - 1 ? { textShadow: INK_SHADOW } : undefined}>
                    {p}
                  </Text>
                ))}
              </Flex>
            </Flex>

            {/* Texto secundario */}
            <Flex direction="column" gap={4} maxW="600px" textAlign="center">
              {INTEGRACION.secundario.map((p, i) => (
                <Text key={i} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.9" opacity={0.9}>
                  {p}
                </Text>
              ))}
            </Flex>

            {/* Lo que exploraremos */}
            <Box
              position="relative"
              w="100%"
              maxW="640px"
              borderRadius="2xl"
              overflow="hidden"
              border={`1px solid ${TINTA}33`}
              boxShadow={`0 10px 40px rgba(94,45,16,0.18), 0 0 0 1px ${neuropsicologiaBg}55`}
            >
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" overlay="rgba(247,236,220,0.55)" />
              <Box position="relative" zIndex={1} px={{ base: 7, md: 11 }} py={{ base: 8, md: 10 }}>
                <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} letterSpacing="0.18em" textTransform="uppercase" fontWeight="600" opacity={0.7} textAlign="center" mb={6}>
                  Lo que exploraremos
                </Text>
                <Flex direction="column" gap={4}>
                  {INTEGRACION.exploraremos.map((item, i) => (
                    <Flex key={i} align="flex-start" gap={3}>
                      <Box as="span" color={TINTA} fontSize="md" opacity={0.7} mt="2px" flexShrink={0}>✦</Box>
                      <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.7">{item}</Text>
                    </Flex>
                  ))}
                </Flex>
              </Box>
            </Box>

            {/* Cierre */}
            <Flex direction="column" gap={3} maxW="600px" textAlign="center">
              {INTEGRACION.cierre.map((p, i) => (
                <Text key={i} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.85" fontStyle="italic" opacity={i === INTEGRACION.cierre.length - 1 ? 1 : 0.9} fontWeight={i === INTEGRACION.cierre.length - 1 ? "600" : "400"} style={i === INTEGRACION.cierre.length - 1 ? { textShadow: INK_SHADOW } : undefined}>
                  {p}
                </Text>
              ))}
            </Flex>

            {/* Botón / reserva */}
            {!reservando ? (
              <Box
                as="button"
                onClick={abrirReserva}
                mt={2}
                px={{ base: 9, md: 12 }}
                py={4}
                borderRadius="full"
                bg={TINTA}
                color={PAPEL}
                fontFamily="'EB Garamond', serif"
                fontWeight="700"
                fontSize={{ base: "lg", md: "xl" }}
                letterSpacing="0.06em"
                cursor="pointer"
                boxShadow={`0 8px 26px rgba(94,45,16,0.38)`}
                transition="all 0.22s"
                _hover={{ transform: "translateY(-2px)", boxShadow: `0 12px 34px rgba(94,45,16,0.48)` }}
              >
                {INTEGRACION.boton}
              </Box>
            ) : (
              <Box ref={reservaRef} w="100%" maxW="640px" scrollMarginTop="90px">
                <AgendarLlamada
                  color={neuropsicologiaTxt}
                  bgColor={neuropsicologiaBg}
                  disciplinaNom={neuropsicologiaNom}
                  precio={INTEGRACION.precio}
                  duracionMin={INTEGRACION.duracionMin}
                  titulo="Reserva tu Sesión de Integración"
                  subtitulo={`Sesión de ${INTEGRACION.duracionMin} min con María · ${INTEGRACION.precio} € · horario peninsular España`}
                />
              </Box>
            )}
          </Flex>
        </Flex>
      </Box>

      <SiteFooter />
    </Box>
  );
}
