import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Image, Input, Text } from "@chakra-ui/react";
import axios from "axios";
import { API_URL } from "../../GlobalVariables";

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

export function SubscribeBox() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "invalid" | "error">("idle");
  const reveal = useReveal(0.15);

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = async () => {
    if (status === "loading") return;
    if (!email || !isValidEmail(email)) {
      setStatus("invalid");
      return;
    }
    setStatus("loading");
    try {
      await axios.post(`${API_URL}/subscribe`, { email });
      setStatus("ok");
      setEmail("");
    } catch (err) {
      setStatus("error");
    }
  };

  // Reset to idle after 3 seconds of success
  useEffect(() => {
    if (status !== "ok") return;
    const t = setTimeout(() => setStatus("idle"), 3000);
    return () => clearTimeout(t);
  }, [status]);

  return (
    <Flex ref={reveal.ref} direction="column" align="center" w="100%" maxW="900px" mt={10} gap={{ base: 8, md: 10 }}>
      {/* Separador con mandala en medio y líneas degradadas a los lados */}
      {/* {!hideSeparator && (
        <Flex
          align="center"
          justify="center"
          gap={{ base: 4, md: 6 }}
          mb={{ base: 4, md: 6 }}
          opacity={reveal.visible ? 1 : 0}
          transform={reveal.visible ? "scaleX(1)" : "scaleX(0.85)"}
          transition="opacity 0.8s ease, transform 0.8s ease"
        >
          <Box
            h="1px"
            w={{ base: "60px", md: "150px" }}
            bg="linear-gradient(to right, transparent, rgba(255,255,255,0.55))"
          />
          <Image
            src="/img/icono/life.png"
            alt=""
            h={{ base: "26px", md: "34px" }}
            objectFit="contain"
            flexShrink={0}
            style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.45)) drop-shadow(0 0 18px rgba(255,255,255,0.22))" }}
          />
          <Box
            h="1px"
            w={{ base: "60px", md: "150px" }}
            bg="linear-gradient(to left, transparent, rgba(255,255,255,0.55))"
          />
        </Flex>
      )} */}

      <Box
        w="100%"
        maxW="560px"
        bg="rgba(255,255,255,0.07)"
        border="1.5px solid rgba(255,255,255,0.18)"
        borderRadius="3xl"
        px={{ base: 7, md: 10 }}
        py={{ base: 8, md: 10 }}
        sx={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
        textAlign="center"
        boxShadow="0 0 16px rgba(255,255,255,0.22), 0 0 38px rgba(255,255,255,0.12), 0 0 70px rgba(180,255,245,0.12)"
        opacity={reveal.visible ? 1 : 0}
        transform={reveal.visible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.95)"}
        transition="opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s"
      >
        <Image
          src="/img/icono/life.png"
          h={{ base: "48px", md: "60px" }}
          objectFit="contain"
          mx="auto"
          mb={4}
          opacity={0.9}
          style={{ filter: "drop-shadow(0 0 9px rgba(255,255,255,0.6)) drop-shadow(0 0 22px rgba(255,255,255,0.32)) drop-shadow(0 0 42px rgba(180,255,245,0.22))" }}
        />
        <Text
          color="white"
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="700"
          fontFamily="'EB Garamond', serif"
          letterSpacing="0.08em"
          mb={2}
          textShadow="0 0 12px rgba(255,255,255,0.55), 0 0 26px rgba(255,255,255,0.3), 0 0 50px rgba(180,255,245,0.22)"
        >
          No te pierdas nada.
        </Text>
        <Text
          color="rgba(255,255,255,0.65)"
          fontSize={{ base: "md", md: "lg" }}
          fontFamily="'EB Garamond', serif"
          mb={6}
          lineHeight="1.6"
        >
          Cuando publique nuevos contenidos serás el primero en saberlo.
        </Text>

        {status === "ok" ? (
          <Flex direction="column" align="center" gap={2} py={2}>
            <Text fontSize="3xl" lineHeight="1">✓</Text>
            <Text
              color="white"
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="600"
              fontFamily="'EB Garamond', serif"
            >
              Registrado correctamente
            </Text>
            <Text
              color="rgba(255,255,255,0.7)"
              fontSize={{ base: "md", md: "lg" }}
              fontFamily="'EB Garamond', serif"
              fontStyle="italic"
            >
              Gracias por querer aprender
            </Text>
          </Flex>
        ) : (
          <Flex direction="column" align="center" gap={{ base: 8, md: 10 }}>
            <Input
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (status === "invalid") setStatus("idle"); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Tu email"
              type="email"
              w="100%"
              maxW="320px"
              bg="rgba(255,255,255,0.08)"
              border={status === "invalid" ? "1px solid rgba(255,130,130,0.6)" : "1px solid rgba(255,255,255,0.25)"}
              borderRadius="full"
              color="white"
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "md", md: "lg" }}
              px={5}
              py={3}
              textAlign="center"
              _placeholder={{ color: "rgba(255,255,255,0.4)" }}
              _focus={{ borderColor: status === "invalid" ? "rgba(255,130,130,0.8)" : "rgba(255,255,255,0.5)", boxShadow: "none" }}
            />
            {status === "invalid" && (
              <Text color="rgba(255,150,150,0.9)" fontSize="sm" fontFamily="'EB Garamond', serif">
                Introduce un email válido
              </Text>
            )}
            {status === "error" && (
              <Text color="rgba(255,150,150,0.9)" fontSize="sm" fontFamily="'EB Garamond', serif">
                No se pudo enviar. Inténtalo de nuevo en un momento.
              </Text>
            )}
            <Box
              as="button"
              onClick={handleSubmit}
              disabled={status === "loading"}
              px={{ base: 8, md: 10 }}
              py="12px"
              borderRadius="full"
              bg="rgba(255,255,255,0.12)"
              border="1.5px solid rgba(255,255,255,0.5)"
              color="white"
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="700"
              letterSpacing="0.16em"
              textTransform="uppercase"
              cursor={status === "loading" ? "not-allowed" : "pointer"}
              opacity={status === "loading" ? 0.6 : 1}
              boxShadow="0 0 14px rgba(255,255,255,0.28), 0 0 30px rgba(255,255,255,0.15)"
              textShadow="0 0 10px rgba(255,255,255,0.5), 0 0 22px rgba(255,255,255,0.28)"
              _hover={status === "loading" ? {} : {
                bg: "rgba(255,255,255,0.22)",
                borderColor: "white",
                boxShadow: "0 0 22px rgba(255,255,255,0.45), 0 0 44px rgba(180,255,245,0.25)",
              }}
              transition="all 0.2s"
              whiteSpace="nowrap"
            >
              {status === "loading" ? "Enviando…" : "Suscribirme"}
            </Box>
          </Flex>
        )}
      </Box>
    </Flex>
  );
}
