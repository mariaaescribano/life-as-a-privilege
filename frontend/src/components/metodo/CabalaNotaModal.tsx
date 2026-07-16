import React from "react";
import { Box, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Text } from "@chakra-ui/react";
import { cabalaBg, cabalaNom, cabalaTxt } from "../../GlobalVariables";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import type { NotaEstudios } from "./cabalaSefirot";

// Popup de una "nota" (asterisco) de una sefirá: título + párrafos, sobre el
// fondo de Cábala. Genérico: sirve para cualquier sefirá que tenga `nota`.
export function CabalaNotaModal({ nota, isOpen, onClose }: { nota: NotaEstudios; isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "xl" }} isCentered scrollBehavior="inside">
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

          <ModalBody position="relative" zIndex={1} px={{ base: 6, md: 9 }} py={{ base: 9, md: 11 }}>
            <Flex direction="column" gap={4}>
              <Text
                color={cabalaTxt}
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="700"
                letterSpacing="0.04em"
                textAlign="center"
                style={{ textShadow: `0 0 14px ${cabalaTxt}cc, 0 0 32px ${cabalaTxt}66` }}
              >
                {nota.titulo}
              </Text>
              <Box h="1px" w="55%" maxW="220px" mx="auto"
                   style={{ background: `linear-gradient(90deg, transparent, ${cabalaTxt}66, transparent)` }} />
              <Flex direction="column" gap={3.5}>
                {nota.parrafos.map((p, i) => (
                  <Text key={i} color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.85"
                        style={{ textShadow: `0 1px 3px ${cabalaBg}f5, 0 0 10px ${cabalaBg}cc` }}>
                    {p}
                  </Text>
                ))}
              </Flex>
            </Flex>
          </ModalBody>
        </Box>
      </ModalContent>
    </Modal>
  );
}

export default CabalaNotaModal;
