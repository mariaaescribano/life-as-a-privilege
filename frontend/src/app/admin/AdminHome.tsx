import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { ADMIN_DISCIPLINAS } from "../../data/adminDisciplinas";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../../components/global/DisciplinaBgLayer";
import { useAdminGuard } from "./useAdminGuard";

export default function AdminHome() {
  const navigate = useNavigate();
  const { verificando } = useAdminGuard();

  if (verificando) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      {/* ── MANDALA ── */}
      <Flex justify="center" pt={{ base: 8, md: 12 }}>
        <Image
          src="/img/icono/life.png"
          alt=""
          h={{ base: "48px", md: "64px" }}
          objectFit="contain"
          style={{ filter: "drop-shadow(0 0 9px rgba(255,255,255,0.59)) drop-shadow(0 0 21px rgba(255,255,255,0.32)) drop-shadow(0 0 42px rgba(180,255,245,0.24))" }}
        />
      </Flex>

      {/* ── TÍTULO ── */}
      <Flex direction="column" align="center" textAlign="center" px={{ base: 5, md: 10 }} pt={{ base: 5, md: 7 }} gap={{ base: 2, md: 3 }}>
        <Text color="white" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="700" letterSpacing="0.08em"
              textTransform="uppercase" lineHeight="1.15"
              textShadow="0 0 14px rgba(255,255,255,0.6), 0 0 30px rgba(180,255,245,0.3)">
          Administración de El Mapa
        </Text>
        <Text color="rgba(255,255,255,0.72)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic">
          Elige una disciplina para escribir el contenido de tus usuarios.
        </Text>
      </Flex>

      <Flex flex="1" justify="center" px={{ base: 5, md: 10 }} pt={{ base: 8, md: 12 }} pb={{ base: 10, md: 14 }}>
        <Box w="100%" maxW="920px">
          <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }} gap={{ base: 4, md: 6 }}>
            {ADMIN_DISCIPLINAS.map((d) => {
              const Icon = d.Icon;
              return (
                <Flex
                  key={d.key}
                  as="button"
                  onClick={() => navigate(`/admin/${d.key}`)}
                  align="center"
                  gap={4}
                  textAlign="left"
                  px={{ base: 5, md: 6 }}
                  py={{ base: 6, md: 7 }}
                  borderRadius="2xl"
                  bg={d.bg}
                  border={`1px solid ${d.txt}55`}
                  cursor="pointer"
                  transition="all 0.22s ease"
                  position="relative"
                  overflow="hidden"
                  _hover={{
                    transform: "translateY(-3px)",
                    borderColor: `${d.txt}aa`,
                  }}
                >
                  {/* imagen de fondo de la disciplina, tintada con su color (más luz) */}
                  {hasDisciplinaBg(d.nombre) && (
                    <DisciplinaBgLayer nom={d.nombre} borderRadius="2xl" overlay={`${d.bg}59`} />
                  )}

                  {/* icono a la izquierda — círculo con la imagen de la disciplina */}
                  <Flex
                    position="relative"
                    zIndex={1}
                    align="center"
                    justify="center"
                    flexShrink={0}
                    overflow="hidden"
                    w={{ base: "54px", md: "64px" }}
                    h={{ base: "54px", md: "64px" }}
                    borderRadius="full"
                    bg={d.bg}
                    border={`2px solid ${d.txt}`}
                    style={{ boxShadow: `0 0 12px ${d.txt}aa` }}
                  >
                    {hasDisciplinaBg(d.nombre) && (
                      <DisciplinaBgLayer nom={d.nombre} borderRadius="full" overlay={`${d.bg}55`} />
                    )}
                    <Box position="relative" zIndex={1} display="flex" alignItems="center" justifyContent="center"
                         style={{ filter: `drop-shadow(0 0 6px ${d.bg})` }}>
                      <Icon size={{ base: "34px", md: "40px" }} />
                    </Box>
                  </Flex>

                  {/* nombre — color de la disciplina */}
                  <Box position="relative" zIndex={1} minW={0}>
                    <Text color={d.txt} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.04em"
                          textTransform="capitalize" noOfLines={1}
                          style={{ textShadow: `0 1px 6px ${d.bg}, 0 2px 14px ${d.bg}, 0 0 18px ${d.txt}66` }}>
                      {d.nombre}
                    </Text>
                    {!d.disponible && (
                      <Text color={`${d.txt}cc`} fontSize="xs" fontStyle="italic" mt={0.5}
                            style={{ textShadow: `0 1px 6px ${d.bg}` }}>
                        próximamente
                      </Text>
                    )}
                  </Box>
                </Flex>
              );
            })}
          </Grid>

          {/* Acceso a editores globales (no por usuario) */}
          <Flex justify="center" mt={{ base: 8, md: 10 }} gap={4} wrap="wrap">
            <Box as="button" onClick={() => navigate("/admin/astrologia-textos")}
                 px={6} py={3} borderRadius="full" bg="rgba(255,255,255,0.1)"
                 border="1.5px solid rgba(255,255,255,0.45)" color="white" fontWeight="700"
                 fontSize={{ base: "sm", md: "md" }} letterSpacing="0.03em" cursor="pointer"
                 transition="all 0.2s" _hover={{ bg: "rgba(255,255,255,0.18)", transform: "translateY(-2px)" }}>
              ✦ Interpretaciones de la carta (arquetipos)
            </Box>
            <Box as="button" onClick={() => navigate("/admin/accesos")}
                 px={6} py={3} borderRadius="full" bg="rgba(255,255,255,0.1)"
                 border="1.5px solid rgba(255,255,255,0.45)" color="white" fontWeight="700"
                 fontSize={{ base: "sm", md: "md" }} letterSpacing="0.03em" cursor="pointer"
                 transition="all 0.2s" _hover={{ bg: "rgba(255,255,255,0.18)", transform: "translateY(-2px)" }}>
              ✦ Accesos (regalar el recorrido)
            </Box>
          </Flex>
        </Box>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
