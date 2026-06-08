import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
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

      <Flex flex="1" justify="center" px={{ base: 5, md: 10 }} py={{ base: 10, md: 14 }}>
        <Box w="100%" maxW="920px">
          <Text color="white" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700" letterSpacing="0.06em"
                textAlign="center" mb={2} textShadow="0 0 18px rgba(255,255,255,0.55)">
            Panel de administración
          </Text>
          <Text color="rgba(255,255,255,0.7)" fontSize={{ base: "sm", md: "md" }} textAlign="center" mb={{ base: 8, md: 12 }} fontStyle="italic">
            Elige una disciplina para escribir el contenido de tus usuarios.
          </Text>

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
                  boxShadow={`0 0 18px ${d.txt}22, 0 6px 20px rgba(0,0,0,0.3)`}
                  cursor="pointer"
                  transition="all 0.22s ease"
                  position="relative"
                  overflow="hidden"
                  _hover={{
                    transform: "translateY(-3px)",
                    boxShadow: `0 0 30px ${d.txt}55, 0 10px 28px rgba(0,0,0,0.35)`,
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
                    {!d.editable && (
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
        </Box>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
