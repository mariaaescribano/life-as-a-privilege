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
  showCheckboxes?: boolean;
  emailOrPhone?: boolean;
  textareaPlaceholder?: string;
}

export function ContactModal({
  isOpen, onClose, title, icon, subtitle, bgColor, color, emailSubject,
  showDescription = false, showCheckboxes = true, emailOrPhone = false,
  textareaPlaceholder = "¿En qué puedo ayudarte?",
}: ContactModalProps) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [claseParticular, setClaseParticular] = useState(false);
  const [conocerme, setConocerme] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const handleClose = () => {
    setNombre(""); setEmail(""); setDescripcion("");
    setClaseParticular(false); setConocerme(false);
    setSent(false); setError(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!nombre.trim() || !email.trim()) return;
    setSending(true); setError(false);

    const opciones: string[] = [];
    if (claseParticular) opciones.push("Quiero clases particulares");
    if (conocerme) opciones.push("Quiero conocerme según esta modalidad");

    const partes: string[] = [];
    if (opciones.length > 0) partes.push(`Interesado en: ${opciones.join(", ")}`);
    if (descripcion.trim()) partes.push(descripcion.trim());
    const mensajeFinal = partes.length > 0 ? partes.join("\n\n") : "—";

    try {
      await axios.post(`${API_URL}/contact`, {
        nombre: nombre.trim(),
        email: email.trim(),
        titulo: emailSubject,
        mensaje: mensajeFinal,
      });
      setSent(true);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  const inputStyle = {
    bg: "rgba(255,255,255,0.08)",
    border: `1px solid ${color}77`,
    color: color,
    borderRadius: "xl",
    fontFamily: "'EB Garamond', serif",
    fontSize: { base: "md", md: "lg" },
    _placeholder: { color: `${color}66` },
    _focus: { borderColor: color, boxShadow: `0 0 0 1px ${color}55` },
    _hover: { borderColor: `${color}bb` },
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
                Muy pronto me pondré en contacto contigo.
                Gracias por tu confianza.
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
                {/* {subtitle && (
                  <Text
                    color={`${color}cc`}
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="500"
                    lineHeight="1.7"
                    fontStyle="italic"
                  >
                    {subtitle}
                  </Text>
                )} */}
              </Box>

              <Box h="1px" bg={`${color}22`} borderRadius="full" />

              <Input
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                {...inputStyle}
              />
              <Input
                placeholder={emailOrPhone ? "Tu email o teléfono" : "Tu email"}
                type={emailOrPhone ? "text" : "email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                {...inputStyle}
              />

              {/* ── Checkboxes ── */}
              {showCheckboxes && (
                <Flex direction="column" gap={3}>
                  {[
                    { label: "Quiero clases particulares", value: claseParticular, set: setClaseParticular },
                    { label: "Quiero conocerme según esta modalidad", value: conocerme, set: setConocerme },
                  ].map(({ label, value, set }) => (
                    <Flex
                      key={label}
                      as="button"
                      type="button"
                      align="center"
                      gap={3}
                      onClick={() => set(!value)}
                      cursor="pointer"
                      bg="transparent"
                      border="none"
                      p={0}
                      textAlign="left"
                    >
                      <Box
                        w="20px" h="20px"
                        flexShrink={0}
                        borderRadius="5px"
                        border={`2px solid ${value ? color : `${color}55`}`}
                        bg={value ? color : "transparent"}
                        display="flex" alignItems="center" justifyContent="center"
                        transition="all 0.18s"
                      >
                        {value && (
                          <Box as="span" color={bgColor} fontSize="12px" fontWeight="900" lineHeight={1}>
                            ✓
                          </Box>
                        )}
                      </Box>
                      <Text
                        color={value ? color : `${color}99`}
                        fontSize={{ base: "md", md: "lg" }}
                        fontFamily="'EB Garamond', serif"
                        fontWeight={value ? "600" : "400"}
                        transition="all 0.18s"
                      >
                        {label}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              )}

              {showDescription && (
                <Textarea
                  placeholder={textareaPlaceholder}
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
