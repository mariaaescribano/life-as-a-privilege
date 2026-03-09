import React, { useState } from "react";
import {
  Box, Flex, Text, Input, Textarea, Button,
} from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import { API_URL } from "../../GlobalVariables";

const glassCard = {
  bg: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.35)",
  sx: { backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" },
  borderRadius: "2xl",
  boxShadow: "0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)",
};

const inputStyle = {
  bg: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.35)",
  color: "white",
  borderRadius: "xl",
  _placeholder: { color: "rgba(255,255,255,0.45)" },
  _focus: { borderColor: "rgba(255,255,255,0.7)", boxShadow: "none" },
  _hover: { borderColor: "rgba(255,255,255,0.5)" },
  fontSize: { base: "md", md: "lg" },
  px: 4,
  py: 3,
  h: "auto",
};

const Contacto = () => {
  const [form, setForm] = useState({ nombre: "", email: "", titulo: "", mensaje: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.titulo || !form.mensaje) return;
    setStatus("sending");
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      setForm({ nombre: "", email: "", titulo: "", mensaje: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">

      {/* ── HEADER ── */}
      <SiteHeader variant="auto" />

      {/* ── MAIN ── */}
      <Box flex="1">
        <Flex
          direction="column"
          alignItems="center"
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 14, md: 20 }}
        >
          <Box w="100%" maxW="680px" {...glassCard} px={{ base: 7, md: 12 }} py={{ base: 8, md: 12 }}>

            {/* Título */}
            <Flex justify="center" align="center" gap={3} mb={2}>
              <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={{ base: "28px", md: "34px" }} h={{ base: "28px", md: "34px" }} fill="white" flexShrink={0}>
                <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/>
              </Box>
              <Text
                color="white"
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="700"
                letterSpacing="0.04em"
                textShadow="0 2px 10px rgba(0,100,90,0.5)"
              >
                Contactar
              </Text>
            </Flex>
            <Text
              color="rgba(255,255,255,0.65)"
              fontSize={{ base: "md", md: "lg" }}
              textAlign="center"
              mb={8}
              lineHeight="1.7"
            >
              ¿Tienes alguna pregunta o quieres ponerte en contacto? Escríbeme.
            </Text>

            {status === "ok" ? (
              <Box textAlign="center" py={8}>
                <Text
                  fontSize="5xl"
                  mb={4}
                  sx={{
                    animation: "heartbeat 1.2s ease-in-out infinite",
                    "@keyframes heartbeat": {
                      "0%, 100%": { transform: "scale(1)" },
                      "50%": { transform: "scale(1.18)" },
                    },
                    display: "inline-block",
                    filter: "drop-shadow(0 0 12px rgba(255,150,150,0.8))",
                  }}
                >
                  ♥
                </Text>
                <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight="600" mb={2}>
                  ¡Mensaje enviado!
                </Text>
                <Text color="rgba(255,255,255,0.7)" fontSize={{ base: "md", md: "lg" }}>
                  Te responderé lo antes posible.
                </Text>
                <Box
                  as="button"
                  mt={6}
                  onClick={() => setStatus("idle")}
                  px={6} py={2}
                  borderRadius="full"
                  border="2px solid rgba(255,255,255,0.55)"
                  color="white"
                  fontSize="md"
                  fontFamily="'EB Garamond', serif"
                  bg="transparent"
                  cursor="pointer"
                  _hover={{ bg: "rgba(255,255,255,0.18)" }}
                  transition="all 0.2s"
                >
                  Enviar otro mensaje
                </Box>
              </Box>
            ) : (
              <Flex as="form" onSubmit={handleSubmit} direction="column" gap={4}>

                <Box>
                  <Text color="rgba(255,255,255,0.8)" fontSize="sm" mb={1} letterSpacing="0.04em">
                    Nombre *
                  </Text>
                  <Input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    required
                    {...inputStyle}
                  />
                </Box>

                <Box>
                  <Text color="rgba(255,255,255,0.8)" fontSize="sm" mb={1} letterSpacing="0.04em">
                    Email *
                  </Text>
                  <Input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    required
                    {...inputStyle}
                  />
                </Box>

                <Box>
                  <Text color="rgba(255,255,255,0.8)" fontSize="sm" mb={1} letterSpacing="0.04em">
                    Título *
                  </Text>
                  <Input
                    name="titulo"
                    value={form.titulo}
                    onChange={handleChange}
                    placeholder="Asunto de tu mensaje"
                    required
                    {...inputStyle}
                  />
                </Box>

                <Box>
                  <Text color="rgba(255,255,255,0.8)" fontSize="sm" mb={1} letterSpacing="0.04em">
                    Mensaje *
                  </Text>
                  <Textarea
                    name="mensaje"
                    value={form.mensaje}
                    onChange={handleChange}
                    placeholder="Escribe tu mensaje aquí..."
                    required
                    rows={6}
                    resize="vertical"
                    {...inputStyle}
                  />
                </Box>

                {status === "error" && (
                  <Text color="rgba(255,150,150,0.9)" fontSize="sm" textAlign="center">
                    Hubo un error al enviar el mensaje. Inténtalo de nuevo.
                  </Text>
                )}

                <Button
                  type="submit"
                  isLoading={status === "sending"}
                  loadingText="Enviando..."
                  mt={2}
                  borderRadius="full"
                  border="2px solid rgba(255,255,255,0.55)"
                  color="white"
                  fontSize={{ base: "md", md: "lg" }}
                  fontFamily="'EB Garamond', serif"
                  fontWeight="600"
                  bg="transparent"
                  letterSpacing="0.05em"
                  _hover={{ bg: "rgba(255,255,255,0.18)", borderColor: "white" }}
                  _active={{ bg: "rgba(255,255,255,0.25)" }}
                  transition="all 0.2s"
                  py={6}
                >
                  Enviar mensaje
                </Button>

              </Flex>
            )}

          </Box>
        </Flex>
      </Box>

      {/* ── FOOTER ── */}
      <Box
        as="footer"
        borderTop="1px solid rgba(255,255,255,0.15)"
        px={{ base: 6, md: 16 }}
        py={{ base: 8, md: 10 }}
      >
        <Text color="rgba(255,255,255,0.5)" fontSize="xs" letterSpacing="0.05em" textAlign="center">
          © 2026 Life as a Privilege · María Escribano · Todos los derechos reservados
        </Text>
        <Text
          as="a"
          href="/contacto"
          color="rgba(255,255,255,0.4)"
          fontSize="xs"
          letterSpacing="0.05em"
          display="block"
          textAlign="center"
          mt={1}
          textDecoration="underline"
          cursor="pointer"
        >
          Contactar
        </Text>
      </Box>

    </Box>
  );
};

export default Contacto;
