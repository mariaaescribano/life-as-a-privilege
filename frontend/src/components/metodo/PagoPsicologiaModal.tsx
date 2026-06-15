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

interface PagoPsicologiaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPagar: () => void;
  loading?: boolean;
  error?: string | null;
  /** Si se pasa, muestra un botón de "modo test" (desbloqueo sin cobro). */
  onTest?: () => void;
}

/** Pago de la 2ª disciplina (Psicología). Mismo lenguaje que PagoMetodoModal. */
export function PagoPsicologiaModal({ isOpen, onClose, onPagar, loading, error, onTest }: PagoPsicologiaModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
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
                Segunda disciplina
              </Text>
            </Flex>

            <Box h="1px" bgGradient="linear(to-r, transparent, rgba(255,255,255,0.4), transparent)" />

            <Text
              color="rgba(255,255,255,0.95)"
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.85"
              letterSpacing="0.015em"
              textAlign="center"
            >
              Continúa el Recorrido con Psicología: reconstruye tu historia y comprende cómo se construyó tu mente.
            </Text>

            <Text
              color="white"
              fontSize={{ base: "4xl", md: "5xl" }}
              fontWeight="700"
              lineHeight="1"
              textAlign="center"
              textShadow="0 0 20px rgba(255,255,255,0.75), 0 0 42px rgba(255,255,255,0.4)"
              mt={1}
            >
              20 €
            </Text>

            <Flex justify="center" mt={3} gap={4} wrap="wrap">
              <Box
                as="button"
                onClick={loading ? undefined : onPagar}
                px={10}
                py={3}
                borderRadius="full"
                bg="white"
                color="#008080"
                fontFamily="'EB Garamond', serif"
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="700"
                letterSpacing="0.08em"
                cursor={loading ? "not-allowed" : "pointer"}
                opacity={loading ? 0.6 : 1}
                boxShadow="0 4px 24px rgba(255,255,255,0.28)"
                transition="all 0.22s"
                _hover={loading ? {} : { transform: "translateY(-2px)", boxShadow: "0 8px 32px rgba(255,255,255,0.4)" }}
              >
                {loading ? "Conectando…" : "Pagar"}
              </Box>
              <Box
                as="button"
                onClick={loading ? undefined : onClose}
                px={8}
                py={3}
                borderRadius="full"
                bg="transparent"
                color="rgba(255,255,255,0.85)"
                border="1px solid rgba(255,255,255,0.5)"
                fontFamily="'EB Garamond', serif"
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="600"
                letterSpacing="0.06em"
                cursor={loading ? "not-allowed" : "pointer"}
                opacity={loading ? 0.5 : 1}
                transition="all 0.22s"
                _hover={loading ? {} : { borderColor: "white", color: "white" }}
              >
                Ahora no
              </Box>
            </Flex>

            {error && (
              <Text
                color="#ffb4b4"
                fontSize="sm"
                textAlign="center"
                fontStyle="italic"
                mt={1}
                textShadow="0 0 8px rgba(255,140,140,0.35)"
              >
                {error}
              </Text>
            )}

            {onTest && (
              <Box
                as="button"
                onClick={loading ? undefined : onTest}
                alignSelf="center"
                mt={1}
                px={5}
                py={2}
                borderRadius="full"
                bg="rgba(255,255,255,0.08)"
                color="rgba(255,255,255,0.8)"
                border="1px dashed rgba(255,255,255,0.4)"
                fontFamily="'EB Garamond', serif"
                fontSize="sm"
                letterSpacing="0.04em"
                cursor={loading ? "not-allowed" : "pointer"}
                transition="all 0.2s"
                _hover={loading ? {} : { bg: "rgba(255,255,255,0.16)", color: "white" }}
              >
                Probar sin pagar · modo test
              </Box>
            )}

            <Text
              color="rgba(255,255,255,0.55)"
              fontSize="xs"
              letterSpacing="0.06em"
              fontStyle="italic"
              textAlign="center"
              mt={1}
            >
              Pago seguro a través de Stripe
            </Text>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
