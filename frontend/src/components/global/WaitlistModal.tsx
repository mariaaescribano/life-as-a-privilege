import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Image,
} from "@chakra-ui/react";
import axios from "axios";
import { API_URL } from "../../GlobalVariables";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setEmail("");
    setSubmitting(false);
    setSubmitted(false);
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setError(null);
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Introduce un email válido.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/contact`, {
        nombre: cleanEmail,
        email: cleanEmail,
        titulo: "Nuevo cliente",
        mensaje:
          `Una persona quiere ser de las primeras en participar en el pack del Método cuando esté disponible.\n\n` +
          `Email: ${cleanEmail}`,
      });
      setSubmitted(true);
    } catch {
      setError("No se pudo enviar. Inténtalo de nuevo en un momento.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    bg: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.4)",
    color: "white",
    borderRadius: "xl",
    fontFamily: "'EB Garamond', serif",
    fontSize: { base: "md", md: "lg" },
    _placeholder: { color: "rgba(255,255,255,0.55)" },
    _focus: { borderColor: "white", boxShadow: "0 0 0 1px rgba(255,255,255,0.5)" },
    _hover: { borderColor: "rgba(255,255,255,0.7)" },
  } as const;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" isCentered>
      <ModalOverlay bg="rgba(0,0,0,0.65)" sx={{ backdropFilter: "blur(6px)" }} />
      <ModalContent
        bg="#008080"
        border="1px solid rgba(255,255,255,0.25)"
        borderRadius="2xl"
        boxShadow="0 16px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.1)"
        mx={{ base: 4, md: 0 }}
        fontFamily="'EB Garamond', serif"
      >
        <ModalCloseButton color="rgba(255,255,255,0.8)" top={4} right={4} />
        <ModalBody px={{ base: 6, md: 8 }} py={{ base: 7, md: 9 }}>
          <Flex direction="column" gap={5}>
            <Flex align="center" gap={3}>
              <Image src="/img/icono/life.png" h="32px" objectFit="contain" />
              <Text
                color="white"
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="900"
                letterSpacing="0.04em"
                lineHeight="1.2"
                style={{ textShadow: "1px 2px 10px rgba(255,255,255,0.35)" }}
              >
                Próximamente
              </Text>
            </Flex>

            <Box h="1px" bg="rgba(255,255,255,0.18)" borderRadius="full" />

            {!submitted ? (
              <Flex direction="column" gap={4}>
                <Text
                  color="rgba(255,255,255,0.88)"
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight="1.8"
                >
                  Actualmente está en proceso de desarrollo. Deja tu email para
                  ser de los primeros en participar.
                </Text>

                <Input
                  placeholder="Tu email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") void handleSubmit(); }}
                  isDisabled={submitting}
                  {...inputStyle}
                />

                {error && (
                  <Text color="rgba(255,200,200,0.95)" fontSize="sm" textAlign="center">
                    {error}
                  </Text>
                )}

                <Flex justify="center" mt={1}>
                  <Box
                    as="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    px={8}
                    py={2.5}
                    borderRadius="full"
                    bg="white"
                    color="#008080"
                    fontFamily="'EB Garamond', serif"
                    fontSize={{ base: "md", md: "lg" }}
                    fontWeight="700"
                    letterSpacing="0.08em"
                    cursor={submitting ? "not-allowed" : "pointer"}
                    opacity={submitting ? 0.6 : 1}
                    boxShadow="0 4px 24px rgba(255,255,255,0.28)"
                    transition="all 0.22s"
                    _hover={submitting ? {} : { transform: "translateY(-2px)", boxShadow: "0 8px 32px rgba(255,255,255,0.4)" }}
                  >
                    {submitting ? "Enviando…" : "Avísame"}
                  </Box>
                </Flex>
              </Flex>
            ) : (
              <Flex direction="column" align="center" gap={4} py={2}>
                <Text fontSize="3xl" color="white">✓</Text>
                <Text
                  color="white"
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight="700"
                  textAlign="center"
                  letterSpacing="0.04em"
                >
                  ¡Gracias!
                </Text>
                <Text
                  color="rgba(255,255,255,0.85)"
                  fontSize={{ base: "md", md: "lg" }}
                  textAlign="center"
                  lineHeight="1.7"
                >
                  Te avisaré en cuanto el pack esté disponible.
                </Text>
                <Box
                  as="button"
                  onClick={handleClose}
                  mt={2}
                  px={7}
                  py={2.5}
                  borderRadius="full"
                  border="1.5px solid rgba(255,255,255,0.4)"
                  bg="transparent"
                  color="rgba(255,255,255,0.85)"
                  fontFamily="'EB Garamond', serif"
                  fontSize="md"
                  fontWeight="600"
                  letterSpacing="0.06em"
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{ bg: "rgba(255,255,255,0.12)", color: "white" }}
                >
                  Cerrar
                </Box>
              </Flex>
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
