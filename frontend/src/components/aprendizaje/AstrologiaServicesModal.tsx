import React, { useState } from "react";
import { Box, Flex, Input, Text, Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/react";
import axios from "axios";
import { API_URL } from "../../GlobalVariables";

const COLOR = "#feffe4";

const SERVICES = [
  { id: "asc-sol-luna", label: "Conocer mi Ascendente, Sol y Luna en profundidad", price: "5€" },
  { id: "lectura-carta", label: "Lectura de carta astral", price: "15€" },
  { id: "lectura-profundidad", label: "Lectura en profundidad de carta astral", price: "30€" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AstrologiaServicesModal({ isOpen, onClose }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [email, setEmail]       = useState("");
  const [sending, setSending]   = useState(false);
  const [sent, setSent]         = useState(false);
  const [error, setError]       = useState(false);

  const handleClose = () => {
    setSelected(null); setEmail(""); setSending(false); setSent(false); setError(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!email.trim() || !selected) return;
    const service = SERVICES.find(s => s.id === selected);
    setSending(true); setError(false);
    try {
      await axios.post(`${API_URL}/contact`, {
        nombre: "—",
        email: email.trim(),
        titulo: `Servicio Astrológico — ${service?.label}`,
        mensaje: `Servicio: ${service?.label} (${service?.price})`,
      });
      setSent(true);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered size="md">
      <ModalOverlay bg="rgba(0,0,0,0.75)" sx={{ backdropFilter: "blur(8px)" }} />
      <ModalContent bg="transparent" boxShadow="none" mx={{ base: 4, md: 0 }}>
        <ModalBody p={0}>
          {/* Card con fondo de estrellas */}
          <Box
            borderRadius="2xl"
            overflow="hidden"
            position="relative"
            border="1px solid rgba(254,255,228,0.18)"
            boxShadow="0 24px 80px rgba(0,0,30,0.85), 0 0 60px rgba(100,100,255,0.15)"
            sx={{
              backgroundImage: `url('/img/astrologia/space.jpg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Overlay oscuro para legibilidad */}
            <Box position="absolute" inset={0} bg="rgba(4,6,22,0.62)" zIndex={0} />

            {/* Estrellas decorativas grandes */}
            <Text position="absolute" top="14px" left="18px"  color="rgba(254,255,228,0.35)" fontSize="11px" userSelect="none">✦</Text>
            <Text position="absolute" top="22px" right="28px" color="rgba(254,255,228,0.25)" fontSize="8px"  userSelect="none">✧</Text>
            <Text position="absolute" bottom="60px" left="12px" color="rgba(254,255,228,0.2)" fontSize="9px" userSelect="none">⋆</Text>
            <Text position="absolute" bottom="40px" right="16px" color="rgba(254,255,228,0.3)" fontSize="10px" userSelect="none">✦</Text>

            {/* Cerrar */}
            <Box
              as="button"
              position="absolute"
              top="12px" right="12px"
              w="30px" h="30px"
              borderRadius="full"
              display="flex" alignItems="center" justifyContent="center"
              color="rgba(254,255,228,0.5)"
              fontSize="16px"
              cursor="pointer"
              _hover={{ color: COLOR, bg: "rgba(254,255,228,0.08)" }}
              transition="all 0.18s"
              onClick={handleClose}
              zIndex={2}
            >
              ✕
            </Box>

            {/* Contenido */}
            <Box position="relative" zIndex={1} px={{ base: 7, md: 9 }} pt={8} pb={8}>
              {sent ? (
                <Flex direction="column" align="center" gap={4} py={6} textAlign="center">
                  <Text fontSize="3xl" color={COLOR}>✦</Text>
                  <Text color={COLOR} fontSize={{ base: "xl", md: "2xl" }} fontFamily="'EB Garamond', serif" fontWeight="700" letterSpacing="0.04em">
                    ¡Mensaje enviado!
                  </Text>
                  <Text color="rgba(254,255,228,0.92)" fontSize={{ base: "md", md: "lg" }} fontFamily="'EB Garamond', serif" lineHeight="1.75">
                    Muy pronto me pondré en contacto contigo.
                  </Text>
                  <Box
                    as="button" onClick={handleClose} mt={2}
                    px={7} py={2}
                    borderRadius="full"
                    border="1px solid rgba(254,255,228,0.35)"
                    bg="transparent"
                    color="rgba(254,255,228,0.92)"
                    fontFamily="'EB Garamond', serif"
                    fontSize="md" letterSpacing="0.06em"
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{ bg: "rgba(254,255,228,0.08)", color: COLOR }}
                  >
                    Cerrar
                  </Box>
                </Flex>
              ) : (
                <Flex direction="column" gap={6}>
                  {/* Título */}
                  <Box textAlign="center">
                    <Text
                      color={COLOR}
                      fontFamily="'EB Garamond', serif"
                      fontSize={{ base: "2xl", md: "3xl" }}
                      fontWeight="700"
                      letterSpacing="0.08em"
                      textShadow="0 0 20px rgba(254,255,228,0.4)"
                    >
                      ✦ Servicios Astrológicos ✦
                    </Text>
                    <Box mt={2} h="1px" bg="linear-gradient(90deg, transparent, rgba(254,255,228,0.25), transparent)" />
                  </Box>

                  {/* Email */}
                  <Input
                    placeholder="Tu email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    bg="rgba(255,255,255,0.05)"
                    border="1px solid rgba(254,255,228,0.25)"
                    color={COLOR}
                    borderRadius="xl"
                    fontFamily="'EB Garamond', serif"
                    fontSize={{ base: "md", md: "lg" }}
                    _placeholder={{ color: "rgba(254,255,228,0.35)" }}
                    _focus={{ borderColor: "rgba(254,255,228,0.6)", boxShadow: "0 0 0 1px rgba(254,255,228,0.2)" }}
                    _hover={{ borderColor: "rgba(254,255,228,0.4)" }}
                  />

                  {/* Opciones */}
                  <Flex direction="column" gap={3}>
                    {SERVICES.map((s) => {
                      const active = selected === s.id;
                      return (
                        <Flex
                          key={s.id}
                          as="button"
                          align="center"
                          gap={4}
                          px={5}
                          py={4}
                          borderRadius="xl"
                          border={`1px solid ${active ? "rgba(254,255,228,0.55)" : "rgba(254,255,228,0.15)"}`}
                          bg={active ? "rgba(254,255,228,0.08)" : "rgba(255,255,255,0.02)"}
                          cursor="pointer"
                          onClick={() => setSelected(s.id)}
                          transition="all 0.2s"
                          textAlign="left"
                          _hover={{ bg: "rgba(254,255,228,0.06)", borderColor: "rgba(254,255,228,0.35)" }}
                        >
                          {/* Radio */}
                          <Box
                            flexShrink={0}
                            w="18px" h="18px"
                            borderRadius="full"
                            border={`2px solid ${active ? COLOR : "rgba(254,255,228,0.35)"}`}
                            display="flex" alignItems="center" justifyContent="center"
                            transition="all 0.18s"
                          >
                            {active && (
                              <Box w="8px" h="8px" borderRadius="full" bg={COLOR} />
                            )}
                          </Box>

                          {/* Texto */}
                          <Box flex="1">
                            <Text
                              color={active ? COLOR : "rgba(254,255,228,0.95)"}
                              fontFamily="'EB Garamond', serif"
                              fontSize={{ base: "md", md: "lg" }}
                              fontWeight={active ? "600" : "400"}
                              lineHeight="1.4"
                              transition="all 0.18s"
                            >
                              {s.label}
                            </Text>
                          </Box>

                          {/* Precio */}
                          <Text
                            flexShrink={0}
                            color={active ? COLOR : "rgba(254,255,228,0.85)"}
                            fontFamily="'EB Garamond', serif"
                            fontSize={{ base: "lg", md: "xl" }}
                            fontWeight="700"
                            letterSpacing="0.04em"
                            transition="all 0.18s"
                          >
                            {s.price}
                          </Text>
                        </Flex>
                      );
                    })}
                  </Flex>

                  {error && (
                    <Text color="rgba(254,255,228,0.6)" fontSize="sm" textAlign="center" fontFamily="'EB Garamond', serif">
                      Ha ocurrido un error. Por favor, inténtalo de nuevo.
                    </Text>
                  )}

                  {/* Botón enviar */}
                  <Box
                    as="button"
                    onClick={handleSubmit}
                    disabled={sending || !email.trim() || !selected}
                    mt={1}
                    py={4}
                    borderRadius="full"
                    bg={(!email.trim() || !selected) ? "rgba(254,255,228,0.08)" : "rgba(254,255,228,0.14)"}
                    border="1.5px solid rgba(254,255,228,0.45)"
                    color={(!email.trim() || !selected) ? "rgba(254,255,228,0.35)" : COLOR}
                    fontFamily="'EB Garamond', serif"
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="700"
                    letterSpacing="0.18em"
                    cursor={(!email.trim() || !selected) ? "not-allowed" : "pointer"}
                    transition="all 0.22s"
                    textShadow={(!email.trim() || !selected) ? "none" : "0 0 16px rgba(254,255,228,0.4)"}
                    boxShadow={(!email.trim() || !selected) ? "none" : "0 0 20px rgba(254,255,228,0.1)"}
                    _hover={(!email.trim() || !selected) ? {} : {
                      bg: "rgba(254,255,228,0.22)",
                      borderColor: COLOR,
                      boxShadow: "0 0 30px rgba(254,255,228,0.2)",
                    }}
                  >
                    {sending ? "Enviando..." : "Enviar"}
                  </Box>
                </Flex>
              )}
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
