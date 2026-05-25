import React from "react";
import {
  Box,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

interface AvisoInicialModalProps {
  isOpen: boolean;
  onConfirm: () => void;
}

export function AvisoInicialModal({ isOpen, onConfirm }: AvisoInicialModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={() => { /* no se cierra por fuera */ }} size="lg" isCentered closeOnOverlayClick={false} closeOnEsc={false}>
      <ModalOverlay bg="rgba(0,0,0,0.72)" sx={{ backdropFilter: "blur(8px)" }} />
      <ModalContent
        bg="#008080"
        border="1px solid rgba(255,255,255,0.32)"
        borderRadius="2xl"
        boxShadow="0 16px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.12)"
        mx={{ base: 4, md: 0 }}
        fontFamily="'EB Garamond', serif"
        overflow="hidden"
      >
        <ModalBody px={{ base: 7, md: 10 }} py={{ base: 8, md: 10 }}>
          <Flex direction="column" gap={5}>
            <Flex align="center" gap={3} justify="center">
              <Image src="/img/icono/life.png" h="36px" objectFit="contain" />
              <Text
                color="white"
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="800"
                letterSpacing="0.05em"
                style={{ textShadow: "1px 2px 12px rgba(255,255,255,0.3)" }}
              >
                Aviso importante
              </Text>
            </Flex>

            <Box h="1px" bgGradient="linear(to-r, transparent, rgba(255,255,255,0.4), transparent)" />

            <Text
              color="rgba(255,255,255,0.95)"
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.85"
              letterSpacing="0.015em"
            >
              Vas a empezar un recorrido de transformación intenso y muy distinto a lo que te
              habías encontrado antes. Por favor, <strong>cómprate una libreta</strong> para
              apuntar y llevar un diario, responder preguntas… <strong>a mano</strong>. Es
              importante que así sea para que el inconsciente fluya y este proceso sea más
              profundo. 
            </Text>

            <Text
              color="rgba(255,255,255,0.95)"
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.85"
              letterSpacing="0.015em"
              fontStyle="italic"
              textAlign="center"
              mt={1}
            >
              Gracias por estar aquí. ¡A por todas!
            </Text>

            <Flex justify="center" mt={3}>
              <Box
                as="button"
                onClick={onConfirm}
                px={10}
                py={3}
                borderRadius="full"
                bg="white"
                color="#008080"
                fontFamily="'EB Garamond', serif"
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="700"
                letterSpacing="0.08em"
                cursor="pointer"
                boxShadow="0 4px 24px rgba(255,255,255,0.28)"
                transition="all 0.22s"
                _hover={{ transform: "translateY(-2px)", boxShadow: "0 8px 32px rgba(255,255,255,0.4)" }}
              >
                Empezar
              </Box>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
