import React, { useEffect, useState } from "react";
import { Box, Flex, Grid, Text, Input, Textarea, Button } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { API_URL } from "../../GlobalVariables";
import type { Opinion } from "../../dtos/opinion.type";

const glassCard = {
  bg: "rgba(255,255,255,0.18)",
  border: "1px solid rgba(255,255,255,0.4)",
  sx: { backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" },
  borderRadius: "2xl",
  boxShadow: "0 6px 24px rgba(107,196,200,0.4)",
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

const Opiniones: React.FC = () => {
  const [opiniones, setOpiniones] = useState<Opinion[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nombre: "", texto: "", email: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  useEffect(() => {
    fetch(`${API_URL}/opinion`)
      .then(r => r.ok ? r.json() : [])
      .then((data: Opinion[]) => setOpiniones(Array.isArray(data) ? data : []))
      .catch(() => setOpiniones([]))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.texto.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch(`${API_URL}/opinion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          texto: form.texto.trim(),
          email: form.email.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      setForm({ nombre: "", texto: "", email: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      <Box flex="1">
        {/* ── TÍTULO ── */}
        <Flex direction="column" align="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 10, md: 14 }}>
          <Flex align="center" justify="center" gap={3} mb={3}>
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={{ base: "32px", md: "40px" }} h={{ base: "32px", md: "40px" }} fill="white" flexShrink={0}>
              <path d="M580-240q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM280-560q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm0 320q-33 0-56.5-23.5T200-320v-200q0-33 23.5-56.5T280-600q33 0 56.5 23.5T360-520v200q0 33-23.5 56.5T280-240Zm300 0q-33 0-56.5-23.5T500-320v-200q0-33 23.5-56.5T580-600q33 0 56.5 23.5T660-520v200q0 33-23.5 56.5T580-240Z"/>
            </Box>
            <Text
              color="white"
              fontSize={{ base: "4xl", md: "5xl" }}
              fontWeight="700"
              letterSpacing="0.04em"
              textShadow="0 2px 10px rgba(0,100,90,0.5)"
            >
              Opiniones
            </Text>
          </Flex>
          <Text
            color="rgba(255,255,255,0.75)"
            fontSize={{ base: "md", md: "lg" }}
            textAlign="center"
            maxW="640px"
            lineHeight="1.7"
          >
            Experiencias y reflexiones de quienes han caminado por aquí.
          </Text>
        </Flex>

        {/* ── LISTADO ── */}
        <Box px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 10, md: 12 }}>
          {loading ? (
            <Flex justify="center" py={10}>
              <Text color="rgba(255,255,255,0.7)">Cargando...</Text>
            </Flex>
          ) : opiniones.length === 0 ? (
            <Flex justify="center" py={10}>
              <Text color="rgba(255,255,255,0.7)" fontSize="lg" textAlign="center">
                Todavía no hay opiniones publicadas.<br />¡Sé la primera persona en compartir la tuya!
              </Text>
            </Flex>
          ) : (
            <Grid
              maxW="1100px"
              mx="auto"
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
              gap={{ base: 5, md: 6 }}
            >
              {opiniones.map(op => (
                <Box
                  key={op.id}
                  {...glassCard}
                  px={{ base: 6, md: 7 }}
                  py={{ base: 6, md: 7 }}
                  display="flex"
                  flexDirection="column"
                  gap={3}
                >
                  <Text color="white" fontSize="3xl" lineHeight="1" opacity={0.55}>“</Text>
                  <Text
                    color="rgba(255,255,255,0.92)"
                    fontSize={{ base: "md", md: "lg" }}
                    lineHeight="1.7"
                    fontStyle="italic"
                  >
                    {op.texto}
                  </Text>
                  <Text
                    color="white"
                    fontSize={{ base: "md", md: "lg" }}
                    fontWeight="700"
                    letterSpacing="0.04em"
                    mt={1}
                    textShadow="0 1px 5px rgba(0,60,50,0.3)"
                  >
                    — {op.nombre}
                  </Text>
                </Box>
              ))}
            </Grid>
          )}
        </Box>

        {/* ── FORMULARIO ── */}
        <Flex justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 14, md: 20 }} pb={{ base: 14, md: 20 }}>
          <Box w="100%" maxW="680px" {...glassCard} px={{ base: 7, md: 12 }} py={{ base: 8, md: 12 }}>
            <Flex justify="center" align="center" gap={3} mb={2}>
              <Text
                color="white"
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="700"
                letterSpacing="0.04em"
                textShadow="0 2px 10px rgba(0,100,90,0.5)"
              >
                Deja tu opinión
              </Text>
            </Flex>
            <Text
              color="rgba(255,255,255,0.65)"
              fontSize={{ base: "sm", md: "md" }}
              textAlign="center"
              mb={6}
              lineHeight="1.7"
            >
              Las opiniones se publican tras una breve revisión.
            </Text>

            {status === "ok" ? (
              <Box textAlign="center" py={6}>
                <Text fontSize="5xl" mb={3}
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
                  ¡Gracias por compartirla!
                </Text>
                <Text color="rgba(255,255,255,0.7)" fontSize={{ base: "md", md: "lg" }}>
                  Aparecerá publicada en breve.
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
                  bg="transparent"
                  cursor="pointer"
                  _hover={{ bg: "rgba(255,255,255,0.18)" }}
                  transition="all 0.2s"
                >
                  Dejar otra opinión
                </Box>
              </Box>
            ) : (
              <Flex as="form" onSubmit={handleSubmit} direction="column" gap={4}>
                <Box>
                  <Text color="rgba(255,255,255,0.8)" fontSize="sm" mb={1} letterSpacing="0.04em">Nombre *</Text>
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
                  <Text color="rgba(255,255,255,0.8)" fontSize="sm" mb={1} letterSpacing="0.04em">Email (opcional)</Text>
                  <Input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    {...inputStyle}
                  />
                </Box>

                <Box>
                  <Text color="rgba(255,255,255,0.8)" fontSize="sm" mb={1} letterSpacing="0.04em">Tu opinión *</Text>
                  <Textarea
                    name="texto"
                    value={form.texto}
                    onChange={handleChange}
                    placeholder="Cuenta tu experiencia..."
                    required
                    rows={6}
                    resize="vertical"
                    {...inputStyle}
                  />
                </Box>

                {status === "error" && (
                  <Text color="rgba(255,150,150,0.9)" fontSize="sm" textAlign="center">
                    Hubo un error al enviar la opinión. Inténtalo de nuevo.
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
                  Enviar opinión
                </Button>
              </Flex>
            )}
          </Box>
        </Flex>
      </Box>

      <SiteFooter />
    </Box>
  );
};

export default Opiniones;
