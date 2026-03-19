import React, { useState } from "react";
import {
  Box, Flex, Text, Input, Textarea,
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import { API_URL } from "../../GlobalVariables";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
  bgColor: string;
  color: string;
  emailSubject: string;
  showDescription?: boolean;
}

export function ContactModal({
  isOpen, onClose, title, icon, subtitle, bgColor, color, emailSubject, showDescription = false,
}: ContactModalProps) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const handleClose = () => {
    setNombre(""); setEmail(""); setDescripcion("");
    setSent(false); setError(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!nombre.trim() || !email.trim()) return;
    setSending(true); setError(false);
    try {
      await axios.post(`${API_URL}/contact`, {
        nombre: nombre.trim(),
        email: email.trim(),
        titulo: emailSubject,
        mensaje: descripcion.trim() || "—",
      });
      setSent(true);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  const inputStyle = {
    bg: `${bgColor}cc`,
    border: `1px solid ${color}44`,
    color: color,
    borderRadius: "xl",
    fontFamily: "'EB Garamond', serif",
    fontSize: { base: "md", md: "lg" },
    _placeholder: { color: `${color}55` },
    _focus: { borderColor: `${color}99`, boxShadow: `0 0 0 1px ${color}55` },
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" isCentered>
      <ModalOverlay bg="rgba(0,0,0,0.65)" sx={{ backdropFilter: "blur(6px)" }} />
      <ModalContent
        bg={bgColor}
        border={`1px solid ${color}44`}
        borderRadius="2xl"
        boxShadow={`0 16px 60px rgba(0,0,0,0.5), 0 0 40px ${color}22`}
        mx={{ base: 4, md: 0 }}
        fontFamily="'EB Garamond', serif"
      >
        <ModalCloseButton color={`${color}99`} top={4} right={4} />
        <ModalBody px={{ base: 6, md: 8 }} py={{ base: 7, md: 9 }}>
          {sent ? (
            <Flex direction="column" align="center" gap={4} py={4}>
              <Text fontSize="3xl" color={color}>✓</Text>
              <Text
                color={color}
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="700"
                textAlign="center"
                letterSpacing="0.04em"
              >
                ¡Mensaje enviado!
              </Text>
              <Text
                color={`${color}aa`}
                fontSize={{ base: "md", md: "lg" }}
                textAlign="center"
                lineHeight="1.7"
              >
                Me pondré en contacto contigo pronto.
              </Text>
              <Box
                as="button"
                onClick={handleClose}
                mt={2}
                px={7} py={2.5}
                borderRadius="full"
                border={`1.5px solid ${color}55`}
                bg="transparent"
                color={`${color}aa`}
                fontFamily="'EB Garamond', serif"
                fontSize="md"
                fontWeight="600"
                letterSpacing="0.06em"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ bg: `${color}18`, color: color }}
              >
                Cerrar
              </Box>
            </Flex>
          ) : (
            <Flex direction="column" gap={5}>
              <Box>
                <Flex align="center" gap={3} mb={subtitle ? 2 : 0}>
                  {icon && <Box flexShrink={0}>{icon}</Box>}
                  <Text
                    color={color}
                    fontSize={{ base: "2xl", md: "3xl" }}
                    fontWeight="900"
                    letterSpacing="0.04em"
                    lineHeight="1.2"
                    style={{ textShadow: `1px 2px 10px ${color}55` }}
                  >
                    {title}
                  </Text>
                </Flex>
                {subtitle && (
                  <Text
                    color={`${color}cc`}
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="500"
                    lineHeight="1.7"
                    fontStyle="italic"
                  >
                    {subtitle}
                  </Text>
                )}
              </Box>

              <Box h="1px" bg={`${color}22`} borderRadius="full" />

              <Input
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                {...inputStyle}
              />
              <Input
                placeholder="Tu email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                {...inputStyle}
              />
              {showDescription && (
                <Textarea
                  placeholder="¿Qué te gustaría saber? (opcional)"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={3}
                  resize="none"
                  {...inputStyle}
                />
              )}

              {error && (
                <Text color={`${color}aa`} fontSize="sm" textAlign="center">
                  Ha ocurrido un error. Por favor, inténtalo de nuevo.
                </Text>
              )}

              <Box
                as="button"
                onClick={handleSubmit}
                disabled={sending || !nombre.trim() || !email.trim()}
                mt={1}
                px={8} py={3}
                borderRadius="full"
                bg={color}
                color={bgColor}
                fontFamily="'EB Garamond', serif"
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="700"
                letterSpacing="0.07em"
                cursor={sending || !nombre.trim() || !email.trim() ? "not-allowed" : "pointer"}
                opacity={sending || !nombre.trim() || !email.trim() ? 0.5 : 1}
                transition="all 0.22s"
                boxShadow={`0 4px 20px ${color}44`}
                _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
              >
                {sending ? "Enviando..." : "Enviar"}
              </Box>
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
