import React, { useEffect, useState } from "react";
import {
  Box, Flex, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay,
  Text, VStack,
} from "@chakra-ui/react";
import SiteHeader from "../../global/SiteHeader";
import SiteFooter from "../../global/Footer";
import { DisciplineHeader } from "../../global/DisciplineHeader";
import { CabalaIcon, cabalaNom, cabalaBg, cabalaTxt } from "../../../GlobalVariables";
import ArbolDeLaVida, { type Sefira } from "../../global/ArbolDeLaVida";
import EditableCard from "../components/EditableCard";
import { preguntasCabala } from "../../../hardCoded/espacio/PreguntasCabala";

export default function CabalaEspacio() {
  const [sefiraAbierta, setSefiraAbierta] = useState<Sefira | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const preguntas = sefiraAbierta ? preguntasCabala[sefiraAbierta.key] : [];

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      <Box flex="1">
        <Flex
          direction="column" alignItems="center"
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 14, md: 20 }}
        >
          <DisciplineHeader
            icon={<CabalaIcon size={{ base: "40px", md: "56px" }} />}
            title={cabalaNom}
            bgColor={cabalaBg}
            color={cabalaTxt}
            maxW="900px"
          />

          <Box
            w="100%"
            maxW="900px"
            boxShadow={"0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"}
            bg={cabalaBg}
            border={`1.5px solid ${cabalaTxt}55`}
            borderRadius="3xl"
            px={{ base: 6, md: 10 }}
            pt={{ base: 8, md: 10 }}
            pb={{ base: 8, md: 10 }}
          >
            <ArbolDeLaVida
              suppressInternalModal
              onSefiraClick={(s) => setSefiraAbierta(s)}
            />
          </Box>
        </Flex>
      </Box>

      {/* ── Modal de sefirá ── */}
      <Modal
        isOpen={sefiraAbierta !== null}
        onClose={() => setSefiraAbierta(null)}
        size="xl"
        scrollBehavior="inside"
        isCentered
      >
        <ModalOverlay bg="rgba(0,0,0,0.82)" backdropFilter="blur(4px)" />
        <ModalContent
          bg={cabalaBg}
          border={`1.5px solid ${cabalaTxt}55`}
          borderRadius="2xl"
          overflow="hidden"
          boxShadow={`0 0 60px ${cabalaTxt}33, 0 12px 40px rgba(0,0,0,0.7)`}
          mx={{ base: 4, md: "auto" }}
          my="auto"
          maxW={{ base: "calc(100% - 2rem)", md: "xl" }}
          fontFamily="'EB Garamond', serif"
        >
          <ModalCloseButton color={cabalaTxt} top={3} right={3} />

          {/* Línea de brillo superior */}
          <Box
            h="2px"
            style={{ background: `linear-gradient(90deg, transparent, ${cabalaTxt}88, transparent)` }}
          />

          <ModalBody px={{ base: 6, md: 8 }} pt={7} pb={8}>
            {sefiraAbierta && (
              <VStack align="stretch" spacing={6}>

                {/* Cabecera */}
                <Box>
                  {/* <Text
                    color={`${cabalaTxt}66`}
                    fontSize="xs"
                    letterSpacing="0.15em"
                    textTransform="uppercase"
                    mb={1}
                  >
                    Sefirá {sefiraAbierta.number}
                  </Text> */}
                <HStack spacing={2} align="center" mb={4}>
                  <CabalaIcon size={{base:"25px", md:"35px"}} />

                  <Text
                    color={cabalaTxt}
                    fontSize="3xl"
                    fontWeight="700"
                    letterSpacing="0.04em"
                    lineHeight="1"
                    mt="5px"
                    style={{ textShadow: `0 0 20px ${cabalaTxt}77` }}
                  >
                    {sefiraAbierta.hebrewName}
                  </Text>
                </HStack>
                  {/* <Text
                    color={`${cabalaTxt}88`}
                    fontSize="sm"
                    letterSpacing="0.12em"
                    textTransform="uppercase"
                    mb={4}
                  >
                    {sefiraAbierta.spanishName}
                  </Text> */}

                  <Box
                    h="1px" mb={4}
                    style={{ background: `linear-gradient(90deg, transparent, ${cabalaTxt}44, transparent)` }}
                  />

                  <Text
                    color={`${cabalaTxt}cc`}
                    fontSize="md"
                    lineHeight="1.85"
                    letterSpacing="0.02em"
                  >
                    {sefiraAbierta.description}
                  </Text>
                </Box>

                {/* Preguntas */}
                <Box>
                  <Box
                    h="1px" mb={5}
                    style={{ background: `linear-gradient(90deg, transparent, ${cabalaTxt}33, transparent)` }}
                  />
                  <VStack spacing={3} align="stretch">
                    {preguntas.map((p) => (
                      <EditableCard
                        key={p.idPregunta}
                        idPregunta={p.idPregunta}
                        pregunta={p.pregunta}
                        consejo={p.consejo}
                        bgColor={`${cabalaTxt}18`}
                        color={cabalaTxt}
                        apiPath="cabala"
                      />
                    ))}
                  </VStack>
                </Box>

              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <SiteFooter />
    </Box>
  );
}
