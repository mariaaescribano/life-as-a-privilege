/**
 * ESCRIBIRME (/contacto/escribir).
 *
 * El formulario, en su propia página: se llega desde la tarjeta
 * «Escríbeme» de /contacto. Antes colgaba debajo de las tarjetas y había
 * que bajar hasta él.
 */
import React, { useState, useEffect } from "react";
import {
  Box, Flex, Text, Input, Textarea,
} from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import { API_URL } from "../../GlobalVariables";
import SiteFooter from "../../components/global/Footer";
import WelcomeCabecera from "../../components/welcome/WelcomeCabecera";
import TrasCabecera from "../../components/global/TrasCabecera";
import { MandalaTinte } from "../../components/global/MandalaTinte";
import { FONDO_PAGINA_TURQUESA as T } from "../../GlobalVariables";
import { useT } from "../../i18n";
import { useVistoConEspera } from "../../hooks/useVistoConEspera";

const inputStyle = {
  bg: "transparent",
  border: `1.5px solid ${T}66`,
  color: T,
  borderRadius: "full",
  textAlign: "center" as const,
  fontFamily: "'EB Garamond', serif",
  letterSpacing: "0.04em",
  _placeholder: { color: `${T}80` },
  _hover: { borderColor: `${T}b3` },
  _focus: { borderColor: T, bg: `${T}0d`, outline: "none", boxShadow: "none" },
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

/** Corazón de línea fina, del color de la letra (chocolate): cierra la frase de la cabecera con un latido muy suave. */
const CorazonFino = () => (
  <Box
    as="svg"
    aria-hidden
    viewBox="0 0 24 24"
    display="inline-block"
    w="0.95em"
    h="0.95em"
    verticalAlign="-0.12em"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    sx={{
      "@keyframes corazonFino": { "0%, 100%": { transform: "scale(1)" }, "50%": { transform: "scale(1.14)" } },
      animation: "corazonFino 2.4s ease-in-out infinite",
      "@media (prefers-reduced-motion: reduce)": { animation: "none" },
    }}
  >
    <path d="M12 20.5s-7.5-4.7-9.4-9.6C1.3 7.600 3.200 4.500 6.500 4.500c2 0 3.700 1.100 5.500 3.100 1.800-2 3.500-3.100 5.500-3.100 3.300 0 5.200 3.100 3.900 6.400-1.900 4.900-9.400 9.600-9.400 9.600z" />
  </Box>
);

const ContactoFormulario = () => {
  const t = useT();
  const [form, setForm] = useState({ nombre: "", email: "", titulo: "", mensaje: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [serverSlow, setServerSlow] = useState(false);
  const [mounted, setMounted] = useState(false);
  // Ref de CALLBACK: el formulario se monta DESPUÉS de la cabecera (TrasCabecera), y con un ref normal el observador
  // se preparaba antes de que existiera y el formulario se quedaba a opacidad 0.
  const formReveal = useVistoConEspera("0px", 0);

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
    <Box minH="100vh" display="flex" flexDirection="column" bg="#F0DCC0" fontFamily="'EB Garamond', serif">

      {/* ── HEADER ── */}
      <SiteHeader variant="auto" />

      {/* ── Mandala, título y frase (la cabecera de la casa) ── */}
      <WelcomeCabecera activo={mounted} titulo={t("contacto.titulo")} subtitulo={t("contacto.formSubtitulo")} mayusculas sinSeparador iconoFrase={<CorazonFino />} />

      {/* ── FORMULARIO (sin caja) ── */}
      <TrasCabecera flex="1" display="flex" flexDirection="column">
      <Flex flex="1" justify="center" px={{ base: 5, md: 10 }} pt={{ base: 8, md: 12 }} pb={{ base: 24, md: 32 }}>
        <Flex
          ref={formReveal.ref}
          direction="column"
          w={{ base: "100%", sm: "560px" }}
          gap={5}
          // Caja con borde fino del color de la letra: el formulario (y su mensaje de enviado) dentro.
          border={`1.5px solid ${T}66`}
          borderRadius="2xl"
          px={{ base: 4, md: 8 }}
          py={{ base: 8, md: 10 }}
          alignSelf="flex-start"
          opacity={formReveal.visible ? 1 : 0}
          transform={formReveal.visible ? "translateY(0)" : "translateY(28px)"}
          transition="opacity 0.8s ease, transform 0.8s ease"
        >
          {status === "ok" ? (
            <Flex direction="column" align="center" textAlign="center" py={8} gap={5} w="80%" mx="auto">
              <Box
                color={T}
                sx={{
                  animation: "heartbeat 1.2s ease-in-out infinite",
                  "@keyframes heartbeat": {
                    "0%, 100%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.18)" },
                  },
                  display: "inline-block",
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="72px" viewBox="0 -960 960 960" width="72px" fill="currentColor">
                  <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/>
                </svg>
              </Box>
              <Text
                color={T}
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="700"
                letterSpacing="0.05em"
              >
                {t("contacto.enviado")}
              </Text>
              <Text
                color={T}
                fontSize={{ base: "md", md: "lg" }}
              >
                {t("contacto.responder")}
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
                border={`1px solid ${T}`}
                bg="transparent"
                cursor="pointer"
                color={T}
                fontFamily="'EB Garamond', serif"
                fontWeight="600"
                fontSize={{ base: "sm", md: "md" }}
                letterSpacing="0.16em"
                textTransform="uppercase"
                _hover={{
                  bg: `${T}14`,
                  borderColor: T,
                  transform: "translateY(-1px)",
                }}
                transition="all 0.25s ease"
                mt={2}
              >
                {t("contacto.otro")}
              </Flex>
            </Flex>
          ) : (
            <Flex as="form" onSubmit={handleSubmit} direction="column" gap={5} w="80%" mx="auto">

              <Box>
                <Text color={T} fontSize="xs" letterSpacing="0.18em" mb={2} fontWeight="600" textAlign="center" textShadow="0 0 8px rgba(255,255,255,0.26)">
                  {t("contacto.campo.nombre")}
                </Text>
                <Input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder={t("contacto.ph.nombre")}
                  required
                  {...inputStyle}
                />
              </Box>

              <Box>
                <Text color={T} fontSize="xs" letterSpacing="0.18em" mb={2} fontWeight="600" textAlign="center" textShadow="0 0 8px rgba(255,255,255,0.26)">
                  {t("contacto.campo.email")}
                </Text>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t("contacto.ph.email")}
                  required
                  {...inputStyle}
                />
              </Box>

              <Box>
                <Text color={T} fontSize="xs" letterSpacing="0.18em" mb={2} fontWeight="600" textAlign="center" textShadow="0 0 8px rgba(255,255,255,0.26)">
                  {t("contacto.campo.titulo")}
                </Text>
                <Input
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  placeholder={t("contacto.ph.titulo")}
                  required
                  {...inputStyle}
                />
              </Box>

              <Box>
                <Text color={T} fontSize="xs" letterSpacing="0.18em" mb={2} fontWeight="600" textAlign="center" textShadow="0 0 8px rgba(255,255,255,0.26)">
                  {t("contacto.campo.mensaje")}
                </Text>
                <Textarea
                  name="mensaje"
                  value={form.mensaje}
                  onChange={handleChange}
                  placeholder={t("contacto.ph.mensaje")}
                  required
                  rows={6}
                  resize="vertical"
                  {...textareaStyle}
                />
              </Box>

              {serverSlow && status === "idle" && (
                <Text color={T} fontSize="sm" textAlign="center" textShadow="0 0 8px rgba(255,220,100,0.4)">
                  {t("contacto.servidorLento")}
                </Text>
              )}

              {status === "error" && (
                <Text color="#b3261e" fontSize="sm" textAlign="center" textShadow="0 0 8px rgba(255,150,150,0.4)">
                  {t("contacto.error")}
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
                  border={`1.5px solid ${T}`}
                  bg="transparent"
                  cursor={status === "sending" ? "not-allowed" : "pointer"}
                  opacity={status === "sending" ? 0.55 : 1}
                  _hover={status === "sending" ? {} : {
                    bg: `${T}14`,
                    borderColor: T,
                    transform: "translateY(-1px)",
                  }}
                  transition="all 0.25s ease"
                  pointerEvents={status === "sending" ? "none" : "auto"}
                >
                  <MandalaTinte h={{ base: "20px", md: "32px" }} />
                  <Text
                    color={T}
                    fontFamily="'EB Garamond', serif"
                    fontWeight="700"
                    fontSize={{ base: "sm", md: "xl" }}
                    letterSpacing={{ base: "0.12em", md: "0.2em" }}
                    textTransform="uppercase"
                    whiteSpace="nowrap"
                  >
                    {status === "sending" ? t("comun.enviando") : t("contacto.enviar")}
                  </Text>
                </Flex>
              </Flex>

            </Flex>
          )}
        </Flex>
      </Flex>

      </TrasCabecera>

      {/* ── FOOTER ── */}
      <TrasCabecera><SiteFooter /></TrasCabecera>

    </Box>
  );
};

export default ContactoFormulario;
