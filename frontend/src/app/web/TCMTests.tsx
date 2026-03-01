import React, { useEffect } from "react";
import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import { DisciplineHeader } from "../../components/global/DisciplineHeader";
import { TCMIcon, tcmBg, tcmTxt } from "../../GlobalVariables";

/* ─── Indicador "pendiente" (anillo de guiones) ─── */
const PendingRing = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle
      cx="11" cy="11" r="8.5"
      stroke="rgba(218,113,113,0.75)"
      strokeWidth="1.8"
      strokeDasharray="4 2.5"
      strokeLinecap="round"
    />
  </svg>
);

/* ─── Candado (tests no disponibles) ─── */
const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(218,113,113,0.45)">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
  </svg>
);

/* ─── Flecha derecha ─── */
const ArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"/>
  </svg>
);

const tests = [
  {
    id: 1,
    label: "Test 1",
    subtitle: "Los Cinco Elementos",
    available: true,
    link: "/tcm/test/1",
  },
  {
    id: 2,
    label: "Test 2",
    subtitle: "Próximamente",
    available: false,
    link: "",
  },
  {
    id: 3,
    label: "Test 3",
    subtitle: "Próximamente",
    available: false,
    link: "",
  },
];

export default function TCMTests() {
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

      {/* ── MAIN ── */}
      <Box flex="1">
        <Flex
          direction="column"
          alignItems="center"
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 14, md: 20 }}
        >
          {/* Encabezado de disciplina */}
          <DisciplineHeader
            icon={<TCMIcon size={{base:"40px", md:"60px"}} />}
            title="Tests · Medicina China"
            bgColor={tcmBg}
            color={tcmTxt}
            maxW="700px"
          />

          {/* Subtítulo orientativo */}
          <Text
            color="rgba(255,255,255,0.52)"
            fontSize={{ base: "sm", md: "md" }}
            letterSpacing="0.08em"
            fontStyle="italic"
            textAlign="center"
            mb={{ base: 8, md: 10 }}
            maxW="480px"
          >
            Herramientas de autodiagnóstico desde la visión de la Medicina Tradicional China
          </Text>

          {/* ── TARJETAS DE TESTS ── */}
          <SimpleGrid
            w="100%"
            maxW="820px"
            columns={{ base: 1, md: 3 }}
            spacing={{ base: 5, md: 6 }}
          >
            {tests.map((t) => (
              <Flex
                key={t.id}
                direction="column"
                align="center"
                gap={5}
                bg={
                  t.available
                    ? "rgba(107,4,4,0.48)"
                    : "rgba(50,15,15,0.32)"
                }
                border={`1px ${t.available ? "solid" : "dashed"} ${
                  t.available
                    ? "rgba(218,113,113,0.35)"
                    : "rgba(218,113,113,0.18)"
                }`}
                borderRadius="2xl"
                px={{ base: 8, md: 5 }}
                py={9}
                cursor={t.available ? "pointer" : "not-allowed"}
                opacity={t.available ? 1 : 0.55}
                boxShadow={
                  t.available
                    ? "0 4px 24px rgba(0,0,0,0.25), 0 0 18px rgba(107,4,4,0.38)"
                    : "none"
                }
                transition="all 0.22s ease"
                _hover={
                  t.available
                    ? {
                        bg: "rgba(107,4,4,0.68)",
                        transform: "translateY(-4px)",
                        boxShadow:
                          "0 10px 36px rgba(0,0,0,0.32), 0 0 30px rgba(107,4,4,0.55)",
                      }
                    : {}
                }
                onClick={() => t.available && navigate(t.link)}
              >
                {/* Estado */}
                <Flex align="center" gap={2}>
                  {t.available ? <PendingRing /> : <LockIcon />}
                  <Text
                    color={
                      t.available
                        ? "rgba(218,113,113,0.82)"
                        : "rgba(218,113,113,0.38)"
                    }
                    fontSize="10px"
                    letterSpacing="0.2em"
                    textTransform="uppercase"
                    fontWeight="700"
                  >
                    {t.available ? "Pendiente" : "No disponible"}
                  </Text>
                </Flex>

                {/* Número del test */}
                <Text
                  color={t.available ? "white" : "rgba(255,255,255,0.35)"}
                  fontSize={{ base: "4xl", md: "3xl" }}
                  fontWeight="700"
                  letterSpacing="0.05em"
                  textAlign="center"
                  lineHeight="1"
                >
                  {t.label}
                </Text>

                {/* Línea decorativa */}
                <Flex justify="center" gap={1}>
                  <Box
                    w="14px" h="1px" borderRadius="full"
                    bg={t.available ? "rgba(218,113,113,0.35)" : "rgba(218,113,113,0.15)"}
                  />
                  <Box
                    w="28px" h="1px" borderRadius="full"
                    bg={t.available ? "rgba(218,113,113,0.65)" : "rgba(218,113,113,0.22)"}
                  />
                  <Box
                    w="14px" h="1px" borderRadius="full"
                    bg={t.available ? "rgba(218,113,113,0.35)" : "rgba(218,113,113,0.15)"}
                  />
                </Flex>

                {/* Subtítulo */}
                <Text
                  color={
                    t.available
                      ? "rgba(218,113,113,0.78)"
                      : "rgba(218,113,113,0.32)"
                  }
                  fontSize="sm"
                  letterSpacing="0.06em"
                  fontStyle="italic"
                  textAlign="center"
                >
                  {t.subtitle}
                </Text>

                {/* Flecha (solo disponible) */}
                {t.available && (
                  <Box color="rgba(218,113,113,0.65)">
                    <ArrowRight />
                  </Box>
                )}
              </Flex>
            ))}
          </SimpleGrid>
        </Flex>
      </Box>

      {/* ── FOOTER ── */}
      <Box
        as="footer"
        borderTop="1px solid rgba(255,255,255,0.12)"
        px={{ base: 6, md: 16 }}
        py={{ base: 8, md: 10 }}
      >
        <Text
          color="rgba(255,255,255,0.45)"
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
