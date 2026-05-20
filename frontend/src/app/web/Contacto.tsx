import React, { useState, useEffect, useRef } from "react";
import {
  Box, Flex, Image, Text, Input, Textarea,
} from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import { API_URL } from "../../GlobalVariables";
import SiteFooter from "../../components/global/Footer";

const useReveal = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

const inputStyle = {
  bg: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.28)",
  color: "white",
  borderRadius: "full",
  textAlign: "center" as const,
  fontFamily: "'EB Garamond', serif",
  letterSpacing: "0.04em",
  boxShadow: "0 0 10px rgba(255,255,255,0.12)",
  _placeholder: { color: "rgba(255,255,255,0.4)" },
  _hover: { borderColor: "rgba(255,255,255,0.55)" },
  _focus: {
    borderColor: "rgba(255,255,255,0.85)",
    boxShadow: "0 0 0 1px rgba(255,255,255,0.25), 0 0 18px rgba(255,255,255,0.3)",
    bg: "rgba(255,255,255,0.12)",
    outline: "none",
  },
  fontSize: { base: "md", md: "lg" },
  px: 5,
  py: 3,
  h: "auto",
};

const textareaStyle = {
  ...inputStyle,
  borderRadius: "2xl",
  textAlign: "left" as const,
  px: 5,
  py: 4,
};

const Contacto = () => {
  const [form, setForm] = useState({ nombre: "", email: "", titulo: "", mensaje: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [serverSlow, setServerSlow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const formReveal = useReveal(0.1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const t = setTimeout(() => setMounted(true), 60);
    const timer = setTimeout(() => setServerSlow(true), 8000);
    fetch(`${API_URL}/contact/ping`).finally(() => {
      clearTimeout(timer);
      setServerSlow(false);
    });
    return () => {
      clearTimeout(t);
      clearTimeout(timer);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.titulo || !form.mensaje) return;
    setStatus("sending");
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 90000);
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        signal: controller.signal,
      });
      clearTimeout(timeout);
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

      {/* ── MANDALA SEPARADOR ── */}
      <Flex justify="center" pt={{ base: 10, md: 14 }}>
        <Image
          src="/img/icono/life.png"
          alt=""
          h={{ base: "60px", md: "80px" }}
          objectFit="contain"
          style={{ filter: "drop-shadow(0 0 11px rgba(255,255,255,0.78)) drop-shadow(0 0 26px rgba(255,255,255,0.42)) drop-shadow(0 0 52px rgba(180,255,245,0.32))" }}
          opacity={mounted ? 1 : 0}
          transform={mounted ? "scale(1) rotate(0deg)" : "scale(0.7) rotate(-12deg)"}
          transition="opacity 1s ease 0.1s, transform 1s ease 0.1s"
        />
      </Flex>

      {/* ── TÍTULO ── */}
      <Flex
        direction="column"
        align="center"
        textAlign="center"
        px={{ base: 5, md: 10 }}
        pt={{ base: 8, md: 10 }}
        gap={{ base: 3, md: 4 }}
      >
        <Text
          color="white"
          fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }}
          fontWeight="700"
          letterSpacing="0.1em"
          lineHeight="1.1"
          textTransform="uppercase"
          textShadow="0 0 18px rgba(255,255,255,0.85), 0 0 38px rgba(255,255,255,0.55), 0 0 70px rgba(180,255,245,0.45)"
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(24px)"}
          transition="opacity 0.85s ease 0.25s, transform 0.85s ease 0.25s"
        >
          Contactar
        </Text>
        <Text
          color="rgba(255,255,255,0.88)"
          fontSize={{ base: "md", md: "lg" }}
          lineHeight="1.7"
          letterSpacing="0.03em"
          maxW={{ base: "100%", md: "560px" }}
          textShadow="0 0 10px rgba(255,255,255,0.45), 0 0 22px rgba(255,255,255,0.22)"
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(16px)"}
          transition="opacity 0.85s ease 0.5s, transform 0.85s ease 0.5s"
        >
          ¿Tienes alguna pregunta o quieres ponerte en contacto? Escríbeme.
        </Text>
      </Flex>

      {/* ── FORMULARIO (sin caja) ── */}
      <Flex flex="1" justify="center" px={{ base: 5, md: 10 }} pt={{ base: 12, md: 16 }} pb={{ base: 24, md: 32 }}>
        <Flex
          ref={formReveal.ref}
          direction="column"
          w={{ base: "100%", sm: "520px" }}
          gap={5}
          opacity={formReveal.visible ? 1 : 0}
          transform={formReveal.visible ? "translateY(0)" : "translateY(28px)"}
          transition="opacity 0.8s ease, transform 0.8s ease"
        >
          {status === "ok" ? (
            <Flex direction="column" align="center" textAlign="center" py={8} gap={5} w="80%" mx="auto">
              <Box
                color="white"
                sx={{
                  animation: "heartbeat 1.2s ease-in-out infinite",
                  "@keyframes heartbeat": {
                    "0%, 100%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.18)" },
                  },
                  display: "inline-block",
                  filter: "drop-shadow(0 0 14px rgba(255,180,180,0.8)) drop-shadow(0 0 30px rgba(255,180,180,0.4))",
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="72px" viewBox="0 -960 960 960" width="72px" fill="currentColor">
                  <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/>
                </svg>
              </Box>
              <Text
                color="white"
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="700"
                letterSpacing="0.05em"
                textShadow="0 0 14px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.3)"
              >
                ¡Mensaje enviado!
              </Text>
              <Text
                color="rgba(255,255,255,0.85)"
                fontSize={{ base: "md", md: "lg" }}
                textShadow="0 0 10px rgba(255,255,255,0.35)"
              >
                Te responderé lo antes posible.
              </Text>
              <Flex
                as="button"
                onClick={() => setStatus("idle")}
                align="center"
                justify="center"
                gap={2}
                px={{ base: 6, md: 8 }}
                py={{ base: "10px", md: "12px" }}
                borderRadius="full"
                border="1px solid rgba(255,255,255,0.55)"
                bg="rgba(255,255,255,0.08)"
                cursor="pointer"
                color="white"
                fontFamily="'EB Garamond', serif"
                fontWeight="600"
                fontSize={{ base: "sm", md: "md" }}
                letterSpacing="0.16em"
                textTransform="uppercase"
                boxShadow="0 0 14px rgba(255,255,255,0.3), 0 0 30px rgba(255,255,255,0.15)"
                textShadow="0 0 10px rgba(255,255,255,0.55), 0 0 22px rgba(255,255,255,0.3)"
                _hover={{
                  bg: "rgba(255,255,255,0.18)",
                  borderColor: "rgba(255,255,255,0.9)",
                  boxShadow: "0 0 24px rgba(255,255,255,0.5), 0 0 48px rgba(180,255,245,0.3)",
                  transform: "translateY(-1px)",
                }}
                transition="all 0.25s ease"
                mt={2}
              >
                Enviar otro mensaje
              </Flex>
            </Flex>
          ) : (
            <Flex as="form" onSubmit={handleSubmit} direction="column" gap={5} w="80%" mx="auto">

              <Box>
                <Text color="rgba(255,255,255,0.78)" fontSize="xs" letterSpacing="0.18em" mb={2} fontWeight="600" textAlign="center" textShadow="0 0 8px rgba(255,255,255,0.35)">
                  NOMBRE
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
                <Text color="rgba(255,255,255,0.78)" fontSize="xs" letterSpacing="0.18em" mb={2} fontWeight="600" textAlign="center" textShadow="0 0 8px rgba(255,255,255,0.35)">
                  EMAIL
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
                <Text color="rgba(255,255,255,0.78)" fontSize="xs" letterSpacing="0.18em" mb={2} fontWeight="600" textAlign="center" textShadow="0 0 8px rgba(255,255,255,0.35)">
                  TÍTULO
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
                <Text color="rgba(255,255,255,0.78)" fontSize="xs" letterSpacing="0.18em" mb={2} fontWeight="600" textAlign="center" textShadow="0 0 8px rgba(255,255,255,0.35)">
                  MENSAJE
                </Text>
                <Textarea
                  name="mensaje"
                  value={form.mensaje}
                  onChange={handleChange}
                  placeholder="Escribe tu mensaje aquí..."
                  required
                  rows={6}
                  resize="vertical"
                  {...textareaStyle}
                />
              </Box>

              {serverSlow && status === "idle" && (
                <Text color="rgba(255,220,100,0.9)" fontSize="sm" textAlign="center" textShadow="0 0 8px rgba(255,220,100,0.4)">
                  El servidor está iniciando, puede tardar unos segundos...
                </Text>
              )}

              {status === "error" && (
                <Text color="rgba(255,150,150,0.9)" fontSize="sm" textAlign="center" textShadow="0 0 8px rgba(255,150,150,0.4)">
                  Hubo un error al enviar el mensaje. Inténtalo de nuevo.
                </Text>
              )}

              {/* Botón Enviar */}
              <Flex justify="center" pt={{ base: 8, md: 10 }}>
                <Flex
                  as="button"
                  type="submit"
                  align="center"
                  justify="center"
                  gap={{ base: 2, md: 4 }}
                  px={{ base: 6, md: 14 }}
                  py={{ base: "14px", md: "16px" }}
                  flexShrink={0}
                  borderRadius="full"
                  border="1.5px solid rgba(255,255,255,0.6)"
                  bg="rgba(255,255,255,0.10)"
                  cursor={status === "sending" ? "not-allowed" : "pointer"}
                  opacity={status === "sending" ? 0.55 : 1}
                  boxShadow="0 0 18px rgba(255,255,255,0.36), 0 0 40px rgba(255,255,255,0.18), 0 0 70px rgba(180,255,245,0.18), 0 4px 14px rgba(0,0,0,0.18)"
                  _hover={status === "sending" ? {} : {
                    bg: "rgba(255,255,255,0.2)",
                    borderColor: "white",
                    boxShadow: "0 0 28px rgba(255,255,255,0.55), 0 0 58px rgba(180,255,245,0.35), 0 6px 18px rgba(0,0,0,0.22)",
                    transform: "translateY(-1px)",
                  }}
                  transition="all 0.25s ease"
                  pointerEvents={status === "sending" ? "none" : "auto"}
                >
                  <Image
                    src="/img/icono/life.png"
                    alt=""
                    h={{ base: "20px", md: "32px" }}
                    objectFit="contain"
                    flexShrink={0}
                    style={{ filter: "drop-shadow(0 0 9px rgba(255,255,255,0.7)) drop-shadow(0 0 20px rgba(255,255,255,0.35))" }}
                  />
                  <Text
                    color="white"
                    fontFamily="'EB Garamond', serif"
                    fontWeight="700"
                    fontSize={{ base: "sm", md: "xl" }}
                    letterSpacing={{ base: "0.12em", md: "0.2em" }}
                    textTransform="uppercase"
                    textShadow="0 0 12px rgba(255,255,255,0.65), 0 0 26px rgba(255,255,255,0.4)"
                    whiteSpace="nowrap"
                  >
                    {status === "sending" ? "Enviando…" : "Enviar mensaje"}
                  </Text>
                </Flex>
              </Flex>

            </Flex>
          )}
        </Flex>
      </Flex>

      {/* ── FOOTER ── */}
      <SiteFooter />

    </Box>
  );
};

export default Contacto;
