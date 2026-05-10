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

const PAYMENT_LINK = "https://buy.stripe.com/fZu6oAc1x02E8zZ7Uw2VG01";

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscribeModal({ isOpen, onClose }: SubscribeModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setPassword2("");
    setSubmitting(false);
    setSubmitted(false);
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Introduce un email válido.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== password2) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/contact`, {
        nombre: cleanEmail,
        email: cleanEmail,
        titulo: "Quiero apuntarme — Pre-pago pack",
        mensaje:
          `El usuario ha iniciado el flujo de compra del pack y va a proceder al pago.\n\n` +
          `Email: ${cleanEmail}\n` +
          `Contraseña elegida: ${password}\n\n` +
          `Cuando recibas la confirmación de pago de Stripe, crea su cuenta con estos datos y envíale el código de acceso.`,
      });
      setSubmitted(true);
    } catch {
      setError("No se pudo registrar tu solicitud. Inténtalo de nuevo.");
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
                Quiero apuntarme
              </Text>
            </Flex>

            <Box h="1px" bg="rgba(255,255,255,0.18)" borderRadius="full" />

            {!submitted ? (
              <Flex direction="column" gap={4}>
                <Text color="rgba(255,255,255,0.85)" fontSize={{ base: "md", md: "lg" }} lineHeight="1.7">
                  Introduce el email y la contraseña que usarás para acceder a
                  los cursos. Después te llevaremos al pago seguro.
                </Text>

                <Input
                  placeholder="Tu email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  {...inputStyle}
                />
                <Input
                  placeholder="Contraseña (mín. 6 caracteres)"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  {...inputStyle}
                />
                <Input
                  placeholder="Repite la contraseña"
                  type="password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  {...inputStyle}
                />

                <Box
                  bg="rgba(255,255,255,0.10)"
                  border="1px solid rgba(255,255,255,0.2)"
                  borderRadius="xl"
                  px={4}
                  py={3}
                  textAlign="center"
                >
                  <Text color="rgba(255,255,255,0.7)" fontSize="sm" letterSpacing="0.12em" textTransform="uppercase">
                    Pack completo
                  </Text>
                  <Text color="white" fontSize="2xl" fontWeight="700">
                    70 €
                  </Text>
                  <Text color="rgba(255,255,255,0.65)" fontSize="xs" fontStyle="italic">
                    acceso 1 año a cursos y materiales · consultas aparte
                  </Text>
                </Box>

                {error && (
                  <Text color="rgba(255,200,200,0.95)" fontSize="sm" textAlign="center">
                    {error}
                  </Text>
                )}

                <Box
                  as="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  mt={1}
                  px={8}
                  py={3}
                  borderRadius="full"
                  bg="white"
                  color="#008080"
                  fontFamily="'EB Garamond', serif"
                  fontSize={{ base: "lg", md: "xl" }}
                  fontWeight="700"
                  letterSpacing="0.07em"
                  cursor={submitting ? "not-allowed" : "pointer"}
                  opacity={submitting ? 0.6 : 1}
                  transition="all 0.22s"
                  boxShadow="0 4px 20px rgba(255,255,255,0.25)"
                  _hover={{ opacity: 0.9, transform: "translateY(-1px)" }}
                >
                  {submitting ? "Preparando..." : "Continuar al pago"}
                </Box>
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
                  Datos recibidos
                </Text>
                <Text
                  color="rgba(255,255,255,0.85)"
                  fontSize={{ base: "md", md: "lg" }}
                  textAlign="center"
                  lineHeight="1.7"
                >
                  Pulsa el botón para completar el pago de <strong>70&nbsp;€</strong> en
                  Stripe. Una vez confirmado, recibirás tu código de acceso por
                  email.
                </Text>

                <Box
                  as="a"
                  href={PAYMENT_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  display="inline-block"
                  mt={2}
                  px={8}
                  py={3}
                  borderRadius="full"
                  bg="white"
                  color="#008080"
                  fontFamily="'EB Garamond', serif"
                  fontSize={{ base: "lg", md: "xl" }}
                  fontWeight="700"
                  letterSpacing="0.07em"
                  textDecoration="none"
                  boxShadow="0 4px 20px rgba(255,255,255,0.25)"
                  transition="all 0.22s"
                  _hover={{ opacity: 0.9, transform: "translateY(-1px)" }}
                >
                  Ir al pago →
                </Box>

                <Box
                  as="button"
                  onClick={handleClose}
                  mt={2}
                  px={6}
                  py={2}
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
