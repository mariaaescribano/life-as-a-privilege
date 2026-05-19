import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Image, Input, SimpleGrid, Text, Textarea } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { API_URL } from "../../GlobalVariables";
import type { Opinion } from "../../dtos/opinion.type";

const useReveal = (threshold = 0.1) => {
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

const inputStyles = {
  bg: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.28)",
  color: "white",
  borderRadius: "full",
  size: "lg" as const,
  textAlign: "center" as const,
  fontFamily: "'EB Garamond', serif",
  letterSpacing: "0.04em",
  boxShadow: "0 0 10px rgba(255,255,255,0.12)",
  _placeholder: { color: "rgba(255,255,255,0.4)" },
  _hover: { border: "1px solid rgba(255,255,255,0.55)" },
  _focus: {
    border: "1px solid rgba(255,255,255,0.85)",
    boxShadow: "0 0 0 1px rgba(255,255,255,0.25), 0 0 18px rgba(255,255,255,0.3)",
    bg: "rgba(255,255,255,0.12)",
    outline: "none",
  },
};

const textareaStyles = {
  ...inputStyles,
  borderRadius: "2xl",
  textAlign: "left" as const,
  px: 5,
  py: 4,
};

function OpinionesList({ opiniones, loading, listReveal }: { opiniones: Opinion[]; loading: boolean; listReveal: { ref: React.RefObject<HTMLDivElement | null>; visible: boolean } }) {
  return (
    <Box ref={listReveal.ref} w="100%" maxW="950px" mx="auto">
      {loading ? (
        <Text
          color="rgba(255,255,255,0.75)"
          textAlign="center"
          fontStyle="italic"
          fontSize={{ base: "md", md: "lg" }}
          textShadow="0 0 8px rgba(255,255,255,0.25)"
        >
          Cargando…
        </Text>
      ) : opiniones.length === 0 ? (
        <Text
          color="rgba(255,255,255,0.75)"
          textAlign="center"
          fontStyle="italic"
          fontSize={{ base: "md", md: "lg" }}
          textShadow="0 0 8px rgba(255,255,255,0.25)"
        >
          Todavía no hay opiniones publicadas. ¡Sé la primera persona en compartir la tuya!
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 5, md: 6 }}>
          {opiniones.map((op, i) => (
            <Flex
              key={op.id}
              direction="column"
              gap={3}
              bg="rgba(255,255,255,0.10)"
              border="1px solid rgba(255,255,255,0.28)"
              borderRadius="2xl"
              boxShadow="0 0 14px rgba(255,255,255,0.18), 0 0 32px rgba(255,255,255,0.08)"
              sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
              p={{ base: 5, md: 6 }}
              opacity={listReveal.visible ? 1 : 0}
              transform={listReveal.visible ? "translateY(0)" : "translateY(20px)"}
              transition={`opacity 0.6s ease ${(i % 6) * 0.08}s, transform 0.6s ease ${(i % 6) * 0.08}s`}
            >
              <Text
                color="rgba(255,255,255,0.95)"
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="1.75"
                fontFamily="'EB Garamond', serif"
                textShadow="0 0 8px rgba(255,255,255,0.25)"
                flex="1"
              >
                {op.texto}
              </Text>
              <Text
                color="white"
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="700"
                letterSpacing="0.06em"
                fontFamily="'EB Garamond', serif"
                textShadow="0 0 10px rgba(255,255,255,0.55), 0 0 22px rgba(255,255,255,0.3)"
                mt="auto"
              >
                — {op.nombre}
              </Text>
            </Flex>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}

function DejarOpinion({ formReveal }: { formReveal: { ref: React.RefObject<HTMLDivElement | null>; visible: boolean } }) {
  const [form, setForm] = useState({ nombre: "", texto: "", email: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

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
    <Flex
      ref={formReveal.ref}
      direction="column"
      w={{ base: "100%", sm: "520px" }}
      mx="auto"
      gap={5}
      opacity={formReveal.visible ? 1 : 0}
      transform={formReveal.visible ? "translateY(0)" : "translateY(28px)"}
      transition="opacity 0.8s ease, transform 0.8s ease"
    >
      {status === "ok" ? (
        <Flex direction="column" align="center" textAlign="center" py={6} gap={5}>
          <Box
            fontSize="6xl"
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
            ♥
          </Box>
          <Text
            color="white"
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="700"
            letterSpacing="0.05em"
            textShadow="0 0 14px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.3)"
          >
            ¡Gracias por compartirla!
          </Text>
          <Text
            color="rgba(255,255,255,0.85)"
            fontSize={{ base: "md", md: "lg" }}
            textShadow="0 0 10px rgba(255,255,255,0.35)"
          >
            Aparecerá publicada en breve.
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
            }}
            transition="all 0.25s ease"
            mt={2}
          >
            Dejar otra opinión
          </Flex>
        </Flex>
      ) : (
        <Flex as="form" onSubmit={handleSubmit} direction="column" gap={5}>
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
              {...inputStyles}
            />
          </Box>

          <Box>
            <Text color="rgba(255,255,255,0.78)" fontSize="xs" letterSpacing="0.18em" mb={2} fontWeight="600" textAlign="center" textShadow="0 0 8px rgba(255,255,255,0.35)">
              EMAIL (OPCIONAL)
            </Text>
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              {...inputStyles}
            />
          </Box>

          <Box>
            <Text color="rgba(255,255,255,0.78)" fontSize="xs" letterSpacing="0.18em" mb={2} fontWeight="600" textAlign="center" textShadow="0 0 8px rgba(255,255,255,0.35)">
              TU OPINIÓN
            </Text>
            <Textarea
              name="texto"
              value={form.texto}
              onChange={handleChange}
              placeholder="Cuenta tu experiencia…"
              required
              rows={6}
              resize="vertical"
              {...textareaStyles}
            />
          </Box>

          {status === "error" && (
            <Text color="#ff8a8a" fontSize="sm" textAlign="center" fontStyle="italic" textShadow="0 0 8px rgba(255,140,140,0.4)">
              Hubo un error al enviar la opinión. Inténtalo de nuevo.
            </Text>
          )}

          {/* Botón Enviar */}
          <Flex justify="center" pt={{ base: 8, md: 10 }}>
            <Flex
              as="button"
              type="submit"
              align="center"
              justify="center"
              gap={{ base: 3, md: 4 }}
              px={{ base: 10, md: 14 }}
              py={{ base: "14px", md: "16px" }}
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
              }}
              transition="all 0.25s ease"
              pointerEvents={status === "sending" ? "none" : "auto"}
            >
              <Image
                src="/img/icono/life.png"
                alt=""
                h={{ base: "26px", md: "32px" }}
                objectFit="contain"
                flexShrink={0}
                style={{ filter: "drop-shadow(0 0 9px rgba(255,255,255,0.7)) drop-shadow(0 0 20px rgba(255,255,255,0.35))" }}
              />
              <Text
                color="white"
                fontFamily="'EB Garamond', serif"
                fontWeight="700"
                fontSize={{ base: "md", md: "xl" }}
                letterSpacing="0.2em"
                textTransform="uppercase"
                textShadow="0 0 12px rgba(255,255,255,0.65), 0 0 26px rgba(255,255,255,0.4)"
              >
                {status === "sending" ? "Enviando…" : "Enviar opinión"}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}

export default function Opiniones() {
  const [opiniones, setOpiniones] = useState<Opinion[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const listReveal = useReveal(0.05);
  const formReveal = useReveal(0.1);
  const dejarTitleReveal = useReveal(0.2);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const t = setTimeout(() => setMounted(true), 60);
    fetch(`${API_URL}/opinion`)
      .then(r => r.ok ? r.json() : [])
      .then((data: Opinion[]) => setOpiniones(Array.isArray(data) ? data : []))
      .catch(() => setOpiniones([]))
      .finally(() => setLoading(false));
    return () => clearTimeout(t);
  }, []);

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="#008080"
      fontFamily="'EB Garamond', serif"
    >
      <SiteHeader variant="auto" />

      {/* ── MANDALA SEPARADOR ── */}
      <Flex justify="center" pt={{ base: 10, md: 14 }}>
        <Image
          src="/img/icono/life.png"
          alt=""
          h={{ base: "48px", md: "64px" }}
          objectFit="contain"
          style={{ filter: "drop-shadow(0 0 9px rgba(255,255,255,0.78)) drop-shadow(0 0 21px rgba(255,255,255,0.42)) drop-shadow(0 0 42px rgba(180,255,245,0.32))" }}
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
        pt={{ base: 6, md: 8 }}
        gap={{ base: 3, md: 4 }}
      >
        <Text
          color="white"
          fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
          fontWeight="700"
          letterSpacing="0.1em"
          lineHeight="1.1"
          textTransform="uppercase"
          textShadow="0 0 14px rgba(255,255,255,0.85), 0 0 30px rgba(255,255,255,0.55), 0 0 56px rgba(180,255,245,0.45)"
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(20px)"}
          transition="opacity 0.85s ease 0.25s, transform 0.85s ease 0.25s"
        >
          Opiniones
        </Text>
        <Text
          color="rgba(255,255,255,0.88)"
          fontSize={{ base: "sm", md: "lg" }}
          fontStyle="italic"
          letterSpacing="0.05em"
          lineHeight="1.5"
          textShadow="0 0 8px rgba(255,255,255,0.5), 0 0 18px rgba(255,255,255,0.28)"
          maxW={{ base: "100%", md: "512px" }}
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(13px)"}
          transition="opacity 0.85s ease 0.5s, transform 0.85s ease 0.5s"
        >
          Experiencias de quienes ya están en el camino
        </Text>
      </Flex>

      {/* ── LISTA DE OPINIONES ── */}
      <Flex
        justify="center"
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 11, md: 16 }}
      >
        <OpinionesList opiniones={opiniones} loading={loading} listReveal={listReveal} />
      </Flex>

      {/* ── SEPARADOR ── */}
      <Flex justify="center" pt={{ base: 14, md: 18 }}>
        <Box w="100%" maxW="500px" h="1px" bg="rgba(255,255,255,0.18)" />
      </Flex>

      {/* ── TÍTULO DEJAR OPINIÓN ── */}
      <Flex
        ref={dejarTitleReveal.ref}
        direction="column"
        align="center"
        textAlign="center"
        px={{ base: 5, md: 10 }}
        pt={{ base: 14, md: 18 }}
        gap={{ base: 3, md: 4 }}
      >
        <Text
          color="white"
          fontSize={{ base: "2xl", md: "4xl" }}
          fontWeight="700"
          letterSpacing="0.08em"
          lineHeight="1.1"
          textTransform="uppercase"
          textShadow="0 0 14px rgba(255,255,255,0.7), 0 0 30px rgba(255,255,255,0.4), 0 0 54px rgba(180,255,245,0.35)"
          opacity={dejarTitleReveal.visible ? 1 : 0}
          transform={dejarTitleReveal.visible ? "translateY(0)" : "translateY(18px)"}
          transition="opacity 0.8s ease, transform 0.8s ease"
        >
          Deja tu opinión
        </Text>
        <Text
          color="rgba(255,255,255,0.85)"
          fontSize={{ base: "sm", md: "md" }}
          fontStyle="italic"
          letterSpacing="0.04em"
          lineHeight="1.5"
          textShadow="0 0 8px rgba(255,255,255,0.4)"
          maxW={{ base: "100%", md: "480px" }}
          opacity={dejarTitleReveal.visible ? 1 : 0}
          transform={dejarTitleReveal.visible ? "translateY(0)" : "translateY(13px)"}
          transition="opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s"
        >
          Comparte tu experiencia con el Recorrido
        </Text>
      </Flex>

      {/* ── FORMULARIO ── */}
      <Flex
        flex={1}
        justify="center"
        px={{ base: 5, md: 10 }}
        pt={{ base: 11, md: 14 }}
        pb={{ base: 24, md: 32 }}
      >
        <DejarOpinion formReveal={formReveal} />
      </Flex>

      <SiteFooter />
    </Box>
  );
}
