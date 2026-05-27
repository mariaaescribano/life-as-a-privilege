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

interface PagoExitoModalProps {
  isOpen: boolean;
  onAceptar: () => void;
}

export function PagoExitoModal({ isOpen, onAceptar }: PagoExitoModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onAceptar} size="lg" isCentered closeOnOverlayClick={false} closeOnEsc={false}>
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
            <Flex direction="column" align="center" gap={2}>
              <Image src="/img/icono/life.png" h="36px" objectFit="contain" />
              <Text
                color="white"
                fontSize={{ base: "lg", md: "3xl" }}
                fontWeight="800"
                letterSpacing="0.03em"
                textAlign="center"
                whiteSpace="nowrap"
                style={{ textShadow: "1px 2px 12px rgba(255,255,255,0.3)" }}
              >
                Pago de Astrología realizado
              </Text>
            </Flex>

            <Box h="1px" bgGradient="linear(to-r, transparent, rgba(255,255,255,0.4), transparent)" />

            <Text
              color="rgba(255,255,255,0.95)"
              fontSize={{ base: "lg", md: "xl" }}
              lineHeight="1.7"
              letterSpacing="0.015em"
              textAlign="center"
              fontStyle="italic"
            >
              Ya puedes acceder.
            </Text>

            <Flex justify="center" mt={3}>
              <Box
                as="button"
                onClick={onAceptar}
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
                Aceptar
              </Box>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
