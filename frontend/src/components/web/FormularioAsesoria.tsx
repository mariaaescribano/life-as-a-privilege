import React, { useState } from "react";
import { Box, Flex, Input, Modal, ModalBody, ModalContent, ModalOverlay, Text, Textarea } from "@chakra-ui/react";
import { API_URL } from "../../GlobalVariables";
import { useT } from "../../i18n";
import { Reveal } from "../global/Reveal";
import { focoBlanco } from "../global/foco";

/**
 * Formulario de «Asesoría 1:1»: nombre, email y mensaje. Manda al mismo endpoint
 * que la página de contacto (POST /contact, que llega por correo a María); el
 * asunto lo pone la propia página, así que la persona no lo escribe. Usa los
 * mismos textos que /contacto/escribir (`contacto.*`).
 *
 * Sobre el turquesa: campos de cristal con filo blanco, letra blanca, el halo
 * define la caja. Con `marmol` (dentro de una BandaMarmol): campos claros y letra
 * turquesa oscuro. Los campos entran de uno en uno al asomar (o cuando `activo`).
 */
const PALETA = {
  turquesa: {
    texto: "white", suave: "rgba(255,255,255,0.85)", error: "rgba(255,190,190,0.95)",
    campoBg: "rgba(0,40,40,0.28)", borde: "rgba(255,255,255,0.32)", bordeHover: "rgba(255,255,255,0.5)", bordeFoco: "white",
    placeholder: "rgba(255,255,255,0.55)", glowFoco: "0 0 14px rgba(255,255,255,0.2)",
    botonBorde: "rgba(255,255,255,0.85)", botonBg: "rgba(255,255,255,0.1)", botonBgHover: "rgba(255,255,255,0.2)",
    botonHalo: "0 0 14px rgba(255,255,255,0.16), 0 0 32px rgba(255,255,255,0.08), 0 0 58px rgba(180,255,245,0.1)",
    botonTexto: "white",
  },
  marmol: {
    texto: "#004f4f", suave: "#004f4fd9", error: "#b3261e",
    campoBg: "#ffffffb3", borde: "#004f4f", bordeHover: "#004f4f", bordeFoco: "#004f4f",
    placeholder: "#004f4f8c", glowFoco: "0 0 14px #b08d3f44",
    botonBorde: "#004f4f", botonBg: "#004f4f", botonBgHover: "#006b6b", botonTexto: "white",
    botonHalo: "0 0 14px #b08d3f33",
  },
};

const FormularioAsesoria = ({ asunto, marmol = false, activo }: { asunto: string; marmol?: boolean; activo?: boolean }) => {
  const t = useT();
  const c = marmol ? PALETA.marmol : PALETA.turquesa;
  // Con `activo` manda el padre (BandaMarmol); sin él, cada campo entra al asomar.
  const control = activo !== undefined ? { activo } : { inView: true };
  const campo = {
    w: "100%",
    bg: c.campoBg,
    border: `1px solid ${c.borde}`,
    color: c.texto,
    fontFamily: "'EB Garamond', serif",
    fontSize: { base: "md", md: "lg" },
    px: 6,
    py: 3,
    h: "auto",
    _placeholder: { color: c.placeholder },
    _hover: { borderColor: c.bordeHover },
    _focus: { borderColor: c.bordeFoco, boxShadow: c.glowFoco },
    _focusVisible: { borderColor: c.bordeFoco, boxShadow: c.glowFoco },
  };
  const etiqueta = {
    color: c.texto,
    fontFamily: "'EB Garamond', serif",
    fontWeight: "600",
    fontSize: { base: "sm", md: "md" },
    letterSpacing: "0.18em",
    mb: 2,
    ml: 2,
  } as const;
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [estado, setEstado] = useState<"idle" | "sending" | "ok" | "error">("idle");

  const cambiar = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.email.trim() || !form.mensaje.trim() || estado === "sending") return;
    setEstado("sending");
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 90000);
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, titulo: asunto }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error();
      setEstado("ok");
      setForm({ nombre: "", email: "", mensaje: "" });
    } catch {
      setEstado("error");
    }
  };

  return (
    <Box w="100%" maxW="760px" mx="auto" px={{ base: 5, md: 10 }}>
      {/* Aviso de envío: popup con tick, no depende de ninguna animación de entrada. */}
      <Modal isOpen={estado === "ok"} onClose={() => setEstado("idle")} isCentered size="sm">
        <ModalOverlay bg="rgba(0,0,0,0.45)" />
        <ModalContent bg="#008080" borderRadius="2xl" border="2px solid rgba(255,255,255,0.6)" mx={{ base: 4, md: 0 }}>
          <ModalBody px={8} py={9}>
            <Flex direction="column" align="center" textAlign="center" gap={3}>
              <Flex w="64px" h="64px" borderRadius="full" border="2px solid white" align="center" justify="center" boxShadow="0 0 18px rgba(255,255,255,0.3)">
                <Text color="white" fontSize="3xl" lineHeight="1">✓</Text>
              </Flex>
              <Text color="white" fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "2xl", md: "3xl" }}>
                {t("contacto.enviado")}
              </Text>
              <Text color="rgba(255,255,255,0.9)" fontFamily="'EB Garamond', serif" fontStyle="italic" fontSize={{ base: "md", md: "xl" }}>
                {t("contacto.responder")}
              </Text>
              <Box
                as="button"
                type="button"
                onClick={() => setEstado("idle")}
                mt={3}
                px={8}
                py="10px"
                borderRadius="full"
                border="1.5px solid rgba(255,255,255,0.85)"
                color="white"
                fontFamily="'EB Garamond', serif"
                fontWeight="700"
                letterSpacing="0.14em"
                textTransform="uppercase"
                _hover={{ bg: "rgba(255,255,255,0.15)" }}
                _focusVisible={focoBlanco}
              >
                {t("comun.cerrar")}
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
      {(
        <Flex as="form" direction="column" gap={{ base: 5, md: 6 }} onSubmit={enviar} noValidate>
          <Flex direction={{ base: "column", md: "row" }} gap={{ base: 5, md: 6 }}>
            <Reveal {...control} direction="up" distance={20} duration={0.7} flex="1">
              <Text {...etiqueta}>{t("contacto.campo.nombre")}</Text>
              <Input {...campo} borderRadius="full" name="nombre" value={form.nombre} onChange={cambiar} placeholder={t("contacto.ph.nombre")} autoComplete="name" maxLength={120} />
            </Reveal>
            <Reveal {...control} direction="up" distance={20} duration={0.7} delay={0.12} flex="1">
              <Text {...etiqueta}>{t("contacto.campo.email")}</Text>
              <Input {...campo} borderRadius="full" name="email" type="email" value={form.email} onChange={cambiar} placeholder={t("contacto.ph.email")} autoComplete="email" />
            </Reveal>
          </Flex>
          <Reveal {...control} direction="up" distance={20} duration={0.7} delay={0.24}>
            <Text {...etiqueta}>{t("contacto.campo.mensaje")}</Text>
            <Textarea {...campo} borderRadius="2xl" py={4} name="mensaje" value={form.mensaje} onChange={cambiar} placeholder={t("contacto.ph.mensaje")} rows={6} resize="vertical" />
          </Reveal>

          {estado === "error" && (
            <Text color={c.error} fontFamily="'EB Garamond', serif" fontSize={{ base: "md", md: "lg" }} textAlign="center">
              {t("contacto.error")}
            </Text>
          )}

          <Reveal {...control} direction="up" distance={16} duration={0.7} delay={0.36} alignSelf="center">
            <Box
              as="button"
              type="submit"
              disabled={estado === "sending"}
              px={{ base: 8, md: 12 }}
              py="14px"
              borderRadius="full"
              border={`1.5px solid ${c.botonBorde}`}
              bg={c.botonBg}
              color={c.botonTexto}
              fontFamily="'EB Garamond', serif"
              fontWeight="700"
              fontSize={{ base: "md", md: "lg" }}
              letterSpacing="0.16em"
              textTransform="uppercase"
              whiteSpace="nowrap"
              cursor={estado === "sending" ? "not-allowed" : "pointer"}
              opacity={estado === "sending" ? 0.6 : 1}
              boxShadow={c.botonHalo}
              _hover={estado === "sending" ? {} : { bg: c.botonBgHover }}
              _focusVisible={focoBlanco}
              transition="background 0.25s ease, border-color 0.25s ease"
            >
              {estado === "sending" ? t("comun.enviando") : t("contacto.enviar")}
            </Box>
          </Reveal>
        </Flex>
      )}
    </Box>
  );
};

export default FormularioAsesoria;
