import React, { useEffect } from "react";
import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../global/SiteHeader";
import { DisciplineHeader } from "../../global/DisciplineHeader";
import { tcmBg, TCMIcon, tcmTxt } from "../../../GlobalVariables";

/* ─── Candado ─── */
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(218,113,113,0.4)">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
  </svg>
);

const tests = [
  { id: 1, label: "Conoce tu constitución", link: "/tcm/test/1" },
  { id: 2, label: "Tu elemento predominante", link: "/tcm/test/2" },
  { id: 3, label: "Tu desequilibrio actual", link: "/tcm/test/3" },
];

const constitutions = [
  { id: 1, name: "Deficiencia de Qi", active: false },
  { id: 2, name: "Estancamiento de Sangre", active: false },
  { id: 3, name: "Calor Interno", active: false },
];

const recColumns = ["Consejos", "Hierbas", "Ejercicios"];

/* ─── Separador decorativo ─── */
const Divider = ({ opacity = 1 }: { opacity?: number }) => (
  <Flex justify="center" gap={1} style={{ opacity }}>
    <Box w="16px" h="1px" borderRadius="full" bg="rgba(218,113,113,0.28)" />
    <Box w="32px" h="1px" borderRadius="full" bg="rgba(218,113,113,0.55)" />
    <Box w="16px" h="1px" borderRadius="full" bg="rgba(218,113,113,0.28)" />
  </Flex>
);

export default function TCMespacio() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="#008080"
      fontFamily="'EB Garamond', serif"
    >
      <SiteHeader variant="auto" />

      <Box flex="1">
        <Flex
          direction="column"
          alignItems="center"
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 14, md: 20 }}
        >
          <DisciplineHeader
            icon={<TCMIcon size={{ base: "40px", md: "60px" }} />}
            title="Medicina China"
            bgColor={tcmBg}
            color={tcmTxt}
            maxW="700px"
          />

          {/* ══ CARD CONÓCETE ══ */}
          <Box
            w="100%"
            maxW="900px"
            bg={tcmBg}
            border="1px solid rgba(218,113,113,0.22)"
            borderRadius="3xl"
            px={{ base: 6, md: 10 }}
            pt={{ base: 8, md: 10 }}
            pb={{ base: 8, md: 10 }}
            mb={{ base: 10, md: 14 }}
            boxShadow="0 6px 48px rgba(0,0,0,0.22), 0 0 60px rgba(107,4,4,0.18)"
          >
            {/* Título de sección */}
            <Text
              color="white"
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="400"
              letterSpacing="0.14em"
              textTransform="uppercase"
              lineHeight="1"
              textAlign="center"
              mb={{ base: 8, md: 10 }}
            >
              Tests para el Autoconocimiento
            </Text>

            {/* Tests */}
            <SimpleGrid
              w="100%"
              columns={{ base: 1, md: 3 }}
              spacing={{ base: 4, md: 5 }}
            >
              {tests.map((t) => (
                <Flex
                  key={t.id}
                  direction="column"
                  align="center"
                  justify="center"
                  bg={tcmBg}
                  border="1px solid rgba(218,113,113,0.35)"
                  borderRadius="2xl"
                  px={{ base: 8, md: 5 }}
                  py={10}
                  cursor="pointer"
                  boxShadow="0 4px 24px rgba(0,0,0,0.25), 0 0 18px rgba(107,4,4,0.38)"
                  transition="all 0.22s ease"
                  _hover={{ bg: "rgba(107,4,4,0.68)", transform: "translateY(-4px)", boxShadow: "0 10px 36px rgba(0,0,0,0.32), 0 0 30px rgba(107,4,4,0.55)" }}
                  onClick={() => navigate(t.link)}
                >
                  <Text
                    color={tcmTxt}
                    fontSize={{ base: "lg", md: "md", lg: "lg" }}
                    fontWeight="500"
                    letterSpacing="0.06em"
                    textAlign="center"
                    lineHeight="1.4"
                  >
                    {t.label}
                  </Text>
                </Flex>
              ))}
            </SimpleGrid>
          </Box>

          {/* ══ CONSTITUCIONES ══ */}
          <Flex direction="column" w="100%" maxW="900px" gap={{ base: 5, md: 6 }}>
            {constitutions.map((c) => (
              <Box
                key={c.id}
                bg={tcmBg}
                border="1px dashed rgba(218,113,113,0.22)"
                borderRadius="2xl"
                px={{ base: 6, md: 10 }}
                py={{ base: 7, md: 9 }}
                opacity={0.58}
                pointerEvents="none"
                position="relative"
                overflow="hidden"
              >
                {/* Watermark lock */}
                <Box position="absolute" top={4} right={5} opacity={0.35}>
                  <LockIcon />
                </Box>

                {/* Header de constitución */}
                <Flex direction="column" mb={{ base: 6, md: 7 }}>
                  <Flex align="baseline" gap={2} mb={3}>
                    <Text
                      color="rgba(218,113,113,0.55)"
                      fontSize={{ base: "xs", md: "sm" }}
                      letterSpacing="0.22em"
                      textTransform="uppercase"
                    >
                      Constitución:
                    </Text>
                    <Text
                      color="rgba(255,255,255,0.35)"
                      fontSize={{ base: "xl", md: "2xl" }}
                      fontWeight="400"
                      letterSpacing="0.06em"
                      fontStyle="italic"
                    >
                      {c.name}
                    </Text>
                  </Flex>
                  <Divider opacity={0.4} />
                </Flex>

                {/* 3 columnas */}
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 4, md: 5 }}>
                  {recColumns.map((col) => (
                    <Box
                      key={col}
                      bg="rgba(0,0,0,0.18)"
                      border="1px solid rgba(218,113,113,0.1)"
                      borderRadius="xl"
                      px={5}
                      py={6}
                    >
                      {/* Título de columna */}
                      <Flex direction="column" align="center" gap={2} mb={5}>
                        <Text
                          color="rgba(218,113,113,0.4)"
                          fontSize="10px"
                          letterSpacing="0.05em"
                        >
                          ✦
                        </Text>
                        <Text
                          color="rgba(218,113,113,0.6)"
                          fontSize={{ base: "xs", md: "sm" }}
                          letterSpacing="0.25em"
                          textTransform="uppercase"
                          fontWeight="600"
                        >
                          {col}
                        </Text>
                        <Box w="28px" h="1px" bg="rgba(218,113,113,0.18)" borderRadius="full" />
                      </Flex>

                      {/* Líneas placeholder */}
                      <Flex direction="column" gap={3} px={1}>
                        {[100, 75, 88].map((w, i) => (
                          <Box
                            key={i}
                            h="1px"
                            bg="rgba(218,113,113,0.18)"
                            borderRadius="full"
                            w={`${w}%`}
                          />
                        ))}
                      </Flex>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            ))}
          </Flex>
        </Flex>
      </Box>

      {/* ── FOOTER ── */}
      <Box
        as="footer"
        borderTop="1px solid rgba(255,255,255,0.1)"
        px={{ base: 6, md: 16 }}
        py={{ base: 8, md: 10 }}
      >
        <Text
          color="rgba(255,255,255,0.38)"
          fontSize="xs"
          letterSpacing="0.05em"
          textAlign="center"
        >
          © 2026 Life as a Privilege · María Escribano · Todos los derechos reservados
        </Text>
      </Box>
    </Box>
  );
}
