import React, { useEffect, useState } from "react";
import { Box, Flex, Text, Input, Textarea, Button, SimpleGrid } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { API_URL, OpinionesIcon } from "../../GlobalVariables";
import type { Opinion } from "../../dtos/opinion.type";

const GLASS = {
  bg: "rgba(255,255,255,0.22)",
  border: "1px solid rgba(255,255,255,0.45)",
  sx: { backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" },
  borderRadius: "2xl",
  boxShadow: "0 8px 36px rgba(107,196,200,0.45)",
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

function OpinionesHeader() {
  return (
    <Box
      {...GLASS}
      px={{ base: 6, md: 10 }}
      py={{ base: 5, md: 7 }}
      w="100%"
      maxW="850px"
      mb={0}
    >
      <Flex direction="row" align="center" justify="center" gap={5}>
        <Box
          borderRadius="full"
          bg="rgba(255,255,255,0.18)"
          border="5px solid rgba(255,255,255,0.7)"
          boxShadow="0 0 22px rgba(255,255,255,0.45), 0 0 55px rgba(107,196,200,0.25)"
          w={{ base: "60px", md: "72px" }}
          h={{ base: "60px", md: "72px" }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
          overflow="hidden"
          p="6px"
        >
          <OpinionesIcon color="white" size="44px" />
        </Box>
        <Text
          color="white"
          fontSize={{ base: "2xl", md: "5xl" }}
          fontWeight="700"
          letterSpacing="0.05em"
          filter="drop-shadow(1px 1px 3px rgba(0,0,0,0.25))"
          lineHeight="1.15"
        >
          Opiniones
        </Text>
      </Flex>
    </Box>
  );
}

function OpinionesListBox({ opiniones, loading }: { opiniones: Opinion[]; loading: boolean }) {
  return (
    <Box
      {...GLASS}
      w="100%"
      maxW="850px"
      px={{ base: 6, md: 10 }}
      py={{ base: 8, md: 10 }}
    >
      <Flex align="center" justify="center" gap={3} mb={{ base: 6, md: 8 }}>
        <OpinionesIcon color="white" size="34px" />
        <Text
          color="white"
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="700"
          letterSpacing="0.05em"
          filter="drop-shadow(1px 1px 3px rgba(0,0,0,0.25))"
        >
          Experiencias
        </Text>
      </Flex>

      {loading ? (
        <Text color="rgba(255,255,255,0.75)" textAlign="center" fontStyle="italic">
          Cargando...
        </Text>
      ) : opiniones.length === 0 ? (
        <Text color="rgba(255,255,255,0.75)" textAlign="center" fontStyle="italic">
          Todavía no hay opiniones publicadas. ¡Sé la primera persona en compartir la tuya!
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 5, md: 6 }}>
          {opiniones.map((op) => (
            <Flex
              key={op.id}
              direction="column"
              gap={3}
              bg="rgba(255,255,255,0.10)"
              border="1px solid rgba(255,255,255,0.28)"
              borderRadius="xl"
              boxShadow="0 2px 12px rgba(180,230,235,0.20), 0 0 10px rgba(107,196,200,0.22)"
              p={{ base: 5, md: 6 }}
            >
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
                textShadow="0 1px 5px rgba(0,60,50,0.3)"
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

function DejarOpinionBox() {
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
    <Box
      {...GLASS}
      w="100%"
      maxW="850px"
      px={{ base: 6, md: 10 }}
      py={{ base: 8, md: 10 }}
    >
      <Flex align="center" justify="center" gap={3} mb={2}>
        <OpinionesIcon color="white" size="34px" />
        <Text
          color="white"
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="700"
          letterSpacing="0.05em"
          filter="drop-shadow(1px 1px 3px rgba(0,0,0,0.25))"
        >
          Deja tu opinión
        </Text>
      </Flex>

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
        <Flex as="form" onSubmit={handleSubmit} direction="column" gap={4} maxW="560px" mx="auto">
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
  );
}

export default function Opiniones() {
  const [opiniones, setOpiniones] = useState<Opinion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    fetch(`${API_URL}/opinion`)
      .then(r => r.ok ? r.json() : [])
      .then((data: Opinion[]) => setOpiniones(Array.isArray(data) ? data : []))
      .catch(() => setOpiniones([]))
      .finally(() => setLoading(false));
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

      <Box flex="1">
        <Flex
          direction="column"
          alignItems="center"
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 14, md: 20 }}
          gap={{ base: 10, md: 12 }}
        >
          <OpinionesHeader />
          <OpinionesListBox opiniones={opiniones} loading={loading} />
          <Box w="100%" maxW="500px" h="1px" bg="rgba(255,255,255,0.15)" />
          <DejarOpinionBox />
        </Flex>
      </Box>

      <SiteFooter />
    </Box>
  );
}
