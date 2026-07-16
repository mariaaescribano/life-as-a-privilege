import React from "react";
import { Box, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Text } from "@chakra-ui/react";
import { cabalaBg, cabalaNom, cabalaTxt } from "../../GlobalVariables";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";

// Popup de "Ilustraciones" de Cábala. De momento NO hay ninguna ilustración:
// muestra un estado vacío. En el futuro se llenará con la galería (mismo patrón
// que las ilustraciones del resto de disciplinas).
export function CabalaIlustracionesModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "lg" }} isCentered scrollBehavior="inside">
      <ModalOverlay bg="rgba(0,0,0,0.82)" sx={{ backdropFilter: "blur(8px)" }} />
      <ModalContent bg="transparent" boxShadow="none" overflow="visible" mx={4} fontFamily="'EB Garamond', serif">
        <Box position="relative" borderRadius="2xl" overflow="hidden"
             boxShadow={`0 0 24px ${cabalaTxt}44, 0 0 60px ${cabalaTxt}22, 0 26px 70px rgba(0,0,0,0.6)`}>
          <DisciplinaBgLayer nom={cabalaNom} borderRadius="2xl" />
          {/* Cerrar */}
          <Box
            as="button"
            onClick={onClose}
            position="absolute"
            top={3}
            right={3}
            zIndex={3}
            w="30px"
            h="30px"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg={`${cabalaBg}cc`}
            border={`1px solid ${cabalaTxt}44`}
            color={`${cabalaTxt}cc`}
            cursor="pointer"
            transition="all 0.15s"
            _hover={{ color: cabalaTxt, bg: cabalaBg, borderColor: cabalaTxt }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="currentColor">
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          </Box>

          <ModalBody position="relative" zIndex={1} px={{ base: 7, md: 10 }} py={{ base: 12, md: 16 }}>
            <Flex direction="column" align="center" gap={4} textAlign="center">
              <Text
                color={cabalaTxt}
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="700"
                letterSpacing="0.16em"
                textTransform="uppercase"
                style={{ textShadow: `0 0 14px ${cabalaTxt}cc, 0 0 32px ${cabalaTxt}66` }}
              >
                Ilustraciones
              </Text>
              <Box h="1px" w="60%" maxW="220px" style={{ background: `linear-gradient(90deg, transparent, ${cabalaTxt}66, transparent)` }} />
              <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.8" maxW="440px"
                    style={{ textShadow: `0 1px 3px ${cabalaBg}f5, 0 0 10px ${cabalaBg}cc` }}>
                Aún no hay ilustraciones disponibles. Pronto encontrarás aquí las imágenes del Árbol de la Vida.
              </Text>
            </Flex>
          </ModalBody>
        </Box>
      </ModalContent>
    </Modal>
  );
}

export default CabalaIlustracionesModal;
