import React from "react";
import { Box, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Text } from "@chakra-ui/react";
import { cabalaBg, cabalaNom, cabalaTxt } from "../../GlobalVariables";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import type { NotaEstudios } from "./cabalaSefirot";
import { CAJA_GLOW } from "./cabalaGlow";

// Sombra NEGRA (no del color del fondo): es lo que hace legible el texto ámbar
// sobre la acuarela marrón.
const INK_SHADOW = "0 1px 4px rgba(0,0,0,0.9), 0 2px 12px rgba(0,0,0,0.72), 0 0 22px rgba(0,0,0,0.5)";

// Popup de una "nota" (asterisco) de una sefirá: título + párrafos, sobre el
// fondo de Cábala. Genérico: sirve para cualquier sefirá que tenga `nota`.
export function CabalaNotaModal({ nota, isOpen, onClose }: { nota: NotaEstudios; isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "xl" }} isCentered scrollBehavior="inside">
      <ModalOverlay bg="rgba(0,0,0,0.82)" sx={{ backdropFilter: "blur(8px)" }} />
      <ModalContent bg="transparent" boxShadow="none" overflow="visible" mx={4} fontFamily="'EB Garamond', serif">
        <Box position="relative" borderRadius="2xl" overflow="hidden"
             boxShadow={CAJA_GLOW}>
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

          {/* El cuerpo ES el contenedor de scroll: así la barra queda pegada al
              borde de la caja y no flotando dentro del padding. */}
          <ModalBody
            position="relative"
            zIndex={1}
            px={{ base: 7, md: 14 }}
            py={{ base: 12, md: 16 }}
            maxH={{ base: "78vh", md: "76vh" }}
            overflowY="auto"
            sx={{
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-track": { background: "transparent" },
              "&::-webkit-scrollbar-thumb": { background: `${cabalaTxt}55`, borderRadius: "999px" },
            }}
          >
            <Flex direction="column" gap={5}>
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
              <Flex direction="column" gap={4}>
                {nota.parrafos.map((p, i) => (
                  <Text key={i} color={cabalaTxt} fontSize={{ base: "md", md: "lg" }} lineHeight="1.85"
                        style={{ textShadow: INK_SHADOW }}>
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
